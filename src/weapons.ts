import { Mesh, MeshBuilder, box, material, multiply, rotationY, translation, type Instance, type Mat4, type MeshData, type PointLight, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { DAMAGE, type Combatant } from './combat';
import { impactFx, type Hit, type Obstacle, type World } from './impacts';
import { pieceType, type PieceKind } from './shell';
import { CANNON_SPEED, GRENADE_SPEED, isPartRef, type Mounted, type Structure } from './structure';

/**
 * Firing what is mounted on the shell. One weapon is selected at a time (action slots 2 to 5;
 * slot 1 is the claws, the crab's own). The trigger is held or released; each weapon makes of it
 * what it is:
 * - the cannon lobs a big ball per pull that hits very hard;
 * - the guns stream tracers while held (the gatling after spinning up); they hit at once (a ray
 *   against the world; the tracer lasts the flight and the hit plays when it lands);
 * - the flamethrower pours flame while held, and sets wood alight;
 * - the knocker is a ball on a chain of links (a rope simulated point by point, so it sways and
 *   swings): holding hauls the ball up and back behind the pole, letting go sends it swinging
 *   forward, and whatever the ball meets at speed takes it;
 * - the spiky ball cannon fires a spiked ball trailing the same kind of chain; a second pull reels
 *   it back in, and it hits on the way out and on the way back;
 * - the fireworks gun lets off a handful of rockets, straight at the aim, that wander and pop;
 * - the grenade launcher lobs a grenade in an arc onto the aim point; it bounces and rolls, then
 *   bursts on its fuse (or at once when it hits a crab or a piece), hurting everything near.
 * Ammunition is limited (the knocker and the spiky ball never run out); pickups refill it.
 * Hits hurt crabs and break the pieces built on their shells.
 */

interface Ball {
  instance: Instance;
  pos: Vec3;
  vel: Vec3;
  life: number;
  size: number;
  damage: number;
  blast: number;
}

/** A gun's hit, due when its tracer gets there. */
interface Pending {
  at: number;
  hit: Hit;
  damage: number;
  size: number;
  blast: number;
}

/**
 * A power-up's effect on a weapon (Bullet Hell): the yaw offsets it fires at (every shot goes out along
 * each; [0] is one stream straight ahead), multipliers on damage, bullet size and the time between
 * shots, a splash radius round each hit, and how much bigger the gun is drawn.
 */
export interface Boost {
  streams: number[];
  damage: number;
  size: number;
  rate: number;
  blast: number;
  grow: number;
  /** Grenades: this many bomblets scatter from each burst. */
  cluster: number;
}
export const plainBoost = (): Boost => ({ streams: [0], damage: 1, size: 1, rate: 1, blast: 0, grow: 1, cluster: 0 });
const NO_BOOST = plainBoost();

/** The spiky ball out on its chain. */
interface Tether {
  phase: 'ready' | 'flying' | 'landed' | 'reeling';
  pos: Vec3;
  vel: Vec3;
  ball: Instance;
  /** The chain: a rope from the muzzle to the ball, drawn as links. */
  rope: Rope;
  links: Instance[];
  /** Landed on something (else it hangs in the air at the chain's end and falls). */
  resting: boolean;
  hitCool: number;
}

/** The knocker's chain and ball. */
interface Flail {
  rope: Rope;
  ball: Instance;
  links: Instance[];
  /** How far it has been hauled back, 0..1 (the trigger held). */
  drawn: number;
}

/** A grenade lobbed: it bounces about until its fuse runs out. */
interface Grenade {
  instance: Instance;
  pos: Vec3;
  vel: Vec3;
  fuse: number;
  spin: number;
  boost: Boost;
}

/** A firework rocket in the air. */
interface Rocket {
  pos: Vec3;
  vel: Vec3;
  life: number;
  phase: number;
  color: Vec3;
  colorTo: Vec3;
  wobble: number;
}

const isCombatant = (o: unknown): o is Combatant => !!o && typeof o === 'object' && 'hurt' in o;

const BALL: Vec = [0.12, 0.12, 0.13];
const SPIKE: Vec = [0.2, 0.2, 0.22];
const TRACER_SPEED = 70;
const GUN_RANGE = 80;
/** How many shots (or seconds of flame) a weapon carries. */
export const AMMO: Record<PieceKind, number> = { plank: 0, beam: 0, joint: 0, cannon: 10, gatling: 300, machinegun: 150, flamethrower: 12, knocker: Infinity, spikeball: Infinity, fireworks: 18, grenade: 14 };
/** A grenade: its fuse, the blast it makes, how much of its bounce it keeps. */
const GRENADE_FUSE = 1.7;
const GRENADE_BLAST = 3.2;
const GRENADE_BOUNCE = 0.45;
/** The spiky ball: how fast it leaves, how far its chain reaches, how fast it is reeled in. */
const SPIKE_SPEED = 22;
const CHAIN_REACH = 14;
/** How fast the drum winds the chain in (units of chain a second); the ball is dragged along on its end. */
const WINCH_SPEED = 8;
/** The knocker: links in its chain, how long hauling it right back takes, the swing a full haul gives on release, how fast the ball must go to hurt, the speed at which it does all it can. */
const KNOCK_LINKS = 12;
const KNOCK_DRAW_SECONDS = 0.5;
const KNOCK_RELEASE = 11;
const KNOCK_MIN_SPEED = 3.5;
const KNOCK_FULL_SPEED = 11;
/** The spiky ball's chain: links in it. */
const SPIKE_LINKS = 24;
const GRAVITY = 20;
const FIREWORK_COLORS: [Vec3, Vec3][] = [[[1, 0.3, 0.3], [1, 0.8, 0.2]], [[0.3, 0.6, 1], [0.8, 0.4, 1]], [[0.3, 1, 0.4], [1, 1, 0.5]], [[1, 0.5, 0.9], [0.5, 0.9, 1]], [[1, 0.85, 0.3], [1, 0.4, 0.1]]];

export class Arsenal {
  /** The chosen weapon, an index into the structure's weapons (-1: none, the claws): what the mouse button fires. */
  selected = -1;
  /** Each weapon's own trigger (a gamepad fires several at once): held now, and pulled since the last frame. */
  private readonly triggers = new Map<Mounted, { held: boolean; pulled: boolean }>();
  /** Power-ups per weapon (Bullet Hell); a weapon without one fires plainly. */
  readonly boost = new Map<Mounted, Boost>();
  private boostOf(m: Mounted): Boost {
    return this.boost.get(m) ?? NO_BOOST;
  }

  /** `facing` turned about +y by each of the boost's stream angles. */
  private fan(facing: Vec3, streams: number[]): Vec3[] {
    return streams.map((a) => {
      if (!a) return facing;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      return [facing[0] * c + facing[2] * sn, facing[1], -facing[0] * sn + facing[2] * c];
    });
  }
  private readonly cooldown = new Map<Mounted, number>();
  /** The last cooldown each weapon was given, so a recharge can be shown as a share. */
  private readonly cooldownMax = new Map<Mounted, number>();

  /** How much of weapon `m`'s recharge is back, 0..1 (1: ready). */
  readyShare(m: Mounted): number {
    const left = this.cooldown.get(m) ?? 0;
    const max = this.cooldownMax.get(m) ?? 1;
    return left <= 0 ? 1 : Math.max(0, 1 - left / max);
  }
  private readonly spinRate = new Map<Mounted, number>();
  private readonly ammo = new Map<Mounted, number>();
  private readonly knockHits = new Map<unknown, number>();
  private readonly tethers = new Map<Mounted, Tether>();
  private readonly flails = new Map<Mounted, Flail>();
  private readonly rockets: Rocket[] = [];
  private readonly grenades: Grenade[] = [];
  private readonly balls: Ball[] = [];
  private readonly pending: Pending[] = [];
  private clock = 0;
  /** Light this frame: the flame's glow while it pours, muzzle flashes and pops for a moment after. */
  private flaming: { at: Vec3; ttl: number } | null = null;
  private readonly flashes: { at: Vec3; color: Vec3; ttl: number; life: number; radius: number; intensity: number }[] = [];
  private readonly ballMesh: Mesh;
  private readonly spikeMesh: Mesh;
  private readonly knockerMesh: Mesh;
  private readonly grenadeMesh: Mesh;
  private readonly linkMesh: Mesh;
  private readonly ballMaterial = material({ roughness: 0.5, metallic: 0.5 });

  /** Who fires: their own box and pieces are never hit. `damageScale` softens an opponent's guns; `infinite` ammo for them too. */
  constructor(private readonly renderer: Renderer, public structure: Structure, private readonly world: World, private readonly owner: unknown, private readonly damageScale = 1, private readonly infinite = false) {
    this.ballMesh = new Mesh(renderer.gl, sphere(0.15, BALL));
    this.spikeMesh = new Mesh(renderer.gl, spikedBall(0.4, SPIKE));
    this.knockerMesh = new Mesh(renderer.gl, spikedBall(0.36, BALL));
    this.grenadeMesh = new Mesh(renderer.gl, grenadeShell());
    this.linkMesh = new Mesh(renderer.gl, chainLink());
    for (const m of structure.weapons) this.ammo.set(m, AMMO[m.piece.kind]);
  }

  /** `n` link instances for a chain, hidden until posed. */
  private makeLinks(n: number): Instance[] {
    const links: Instance[] = [];
    for (let i = 0; i < n; i++) links.push({ mesh: this.linkMesh, model: new Float32Array(16), material: this.ballMaterial, hidden: true });
    this.renderer.instances.push(...links);
    return links;
  }

  /** Pose a chain's links along a rope, each turned a quarter from the last so they read as a chain; links wound onto the drum are hidden. */
  private poseLinks(links: Instance[], rope: Rope): void {
    const wound = Math.floor(rope.wound);
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      link.hidden = i < wound;
      if (link.hidden) continue;
      alongMatrix(this.tmpA, rope.pts[i], rope.pts[i + 1]);
      multiply(this.tmpA, rotationY((i % 2) * Math.PI * 0.5, this.tmpB), link.model as Float32Array);
    }
  }

  private readonly tmpA = new Float32Array(16);
  private readonly tmpB = new Float32Array(16);

  /** Take a weapon's chain off the beach (the piece broke off). */
  private forget(m: Mounted): void {
    const t = this.tethers.get(m);
    const f = this.flails.get(m);
    const gone = [...(t ? [t.ball, ...t.links] : []), ...(f ? [f.ball, ...f.links] : [])];
    if (gone.length) removeInstances(this.renderer, gone);
    this.tethers.delete(m);
    this.flails.delete(m);
  }

  get weapon(): Mounted | null {
    return this.structure.weapons[this.selected] ?? null;
  }

  /** How many shots weapon `m` has left (Infinity: never runs out). */
  ammoOf(m: Mounted): number {
    return this.infinite ? Infinity : this.ammo.get(m) ?? AMMO[m.piece.kind];
  }

  /** Every weapon back to full. */
  refill(): void {
    for (const m of this.structure.weapons) this.ammo.set(m, AMMO[m.piece.kind]);
  }

  /** The chosen weapon's trigger: down on press, up on release. */
  trigger(down: boolean): void {
    const w = this.weapon;
    if (w) this.fire(w, down);
  }

  /** Weapon `m`'s own trigger (held: it fires as long as it is down; a pull is the press). */
  fire(m: Mounted, down: boolean): void {
    let s = this.triggers.get(m);
    if (!s) {
      s = { held: false, pulled: false };
      this.triggers.set(m, s);
    }
    if (down && !s.held) s.pulled = true;
    s.held = down;
  }

  /** Every trigger up (the window lost focus, the crab cracked). */
  releaseAll(): void {
    for (const s of this.triggers.values()) {
      s.held = false;
      s.pulled = false;
    }
  }

  private heldOf(m: Mounted): boolean {
    return this.triggers.get(m)?.held ?? false;
  }

  /** Spend `n` of weapon `w`'s ammunition if it has it. */
  private spend(w: Mounted, n: number): boolean {
    if (this.infinite) return true;
    const left = this.ammo.get(w) ?? AMMO[w.piece.kind];
    if (left < n) return false;
    this.ammo.set(w, left - n);
    return true;
  }

  /**
   * A frame: turn the turrets toward `aimAt` (the crosshair's point in the world, the ground
   * marker), fire what each weapon's trigger asks of it straight out of its barrel, swing the
   * knockers, fly the balls, chains and rockets, ease the kicks.
   */
  update(dt: number, body: Mat4, aimAt: Vec3 | null = null): void {
    this.clock += dt;
    this.structure.aim(body, aimAt, dt);
    for (let i = this.pending.length - 1; i >= 0; i--) {
      if (this.pending[i].at <= this.clock) {
        const h = this.pending[i];
        this.land(h.hit, h.size, h.damage);
        if (h.blast > 0) this.splash(h.hit.point, h.blast, h.damage * 0.6);
        this.pending.splice(i, 1);
      }
    }
    for (const [k, t] of this.knockHits) if (t <= this.clock) this.knockHits.delete(k);
    // Chains of weapons that have broken off go with them.
    for (const m of [...this.tethers.keys(), ...this.flails.keys()]) if (!this.structure.weapons.includes(m)) this.forget(m);
    for (const m of this.structure.weapons) {
      m.kick = Math.max(0, m.kick - dt * 6);
      this.cooldown.set(m, Math.max(0, (this.cooldown.get(m) ?? 0) - dt));
      if (m.piece.kind === 'gatling') {
        const rate = this.spinRate.get(m) ?? 0;
        const want = this.heldOf(m) && this.ammoOf(m) > 0 ? 1 : 0;
        const next = rate + (want - rate) * (1 - Math.exp(-(want ? 2.2 : 1.4) * dt));
        this.spinRate.set(m, next);
        m.spin += dt * next * 40;
      }
      if (m.piece.kind === 'knocker') this.swingKnocker(m, dt, this.heldOf(m));
    }
    for (const w of this.structure.weapons) {
      const s = this.triggers.get(w);
      const held = s?.held ?? false;
      const pulled = s?.pulled ?? false;
      if (s) s.pulled = false;
      const muzzle = w.muzzle;
      const facing = w.direction;
      const cool = this.cooldown.get(w) ?? 0;
      switch (w.piece.kind) {
        case 'cannon':
          if (pulled && cool <= 0 && this.spend(w, 1)) {
            const b = this.boostOf(w);
            this.cooldown.set(w, 1 * b.rate);
            w.kick = 1;
            this.flash(muzzle, [1, 0.75, 0.35], 0.12, 8, 40);
            for (const dir of this.fan(facing, b.streams)) this.ball(muzzle, [dir[0] * CANNON_SPEED, dir[1] * CANNON_SPEED, dir[2] * CANNON_SPEED], b);
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 18, color: [1, 0.85, 0.5], colorTo: [1, 0.4, 0.1], speed: 6, dir: facing, cone: 0.35, life: 0.2, size: 0.2, fadeCurve: 'down', sizeCurve: 'peak', shape: 'disc' });
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 30, color: [0.55, 0.55, 0.55], colorTo: [0.3, 0.3, 0.3], speed: 3, dir: facing, cone: 0.5, up: 0.6, life: 1.8, size: 0.35, drag: 1.2, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'gatling': {
          const rate = this.spinRate.get(w) ?? 0;
          if (held && rate > 0.55 && cool <= 0 && this.spend(w, 1)) {
            const b = this.boostOf(w);
            this.cooldown.set(w, (1 / (8 + rate * 22)) * b.rate);
            w.kick = 0.6;
            for (const dir of this.fan(facing, b.streams)) this.tracer(muzzle, dir, 0.03, DAMAGE.gatling * b.damage, b.size, b.blast);
          }
          break;
        }
        case 'machinegun':
          if (held && cool <= 0 && this.spend(w, 1)) {
            const b = this.boostOf(w);
            this.cooldown.set(w, 0.11 * b.rate);
            w.kick = 0.3;
            for (const dir of this.fan(facing, b.streams)) this.tracer(muzzle, dir, 0.04, DAMAGE.machinegun * b.damage, b.size, b.blast);
          }
          break;
        case 'flamethrower':
          if (held && this.spend(w, dt)) {
            w.kick = 0.3;
            this.flaming = { at: [muzzle[0] + facing[0] * 3, muzzle[1] + facing[1] * 3 + 0.5, muzzle[2] + facing[2] * 3], ttl: 0.1 };
            for (const o of this.world.inCone(muzzle, facing, 6.5, 0.36, this.owner, this.structure.flatAim)) {
              if (isCombatant(o)) o.hurt(DAMAGE.flamethrower * dt * this.damageScale);
              else if (isPartRef(o)) {
                o.structure.damage(o.index, DAMAGE.flamethrower * dt * this.damageScale);
                o.structure.ignite(o.index);
              }
            }
            // A roaring tongue: a bright core, a broad body of flame, and smoke rolling off the end.
            const p = this.renderer.particles;
            // Colours above 1 are HDR: the core and the body glow through the tone map, as a real flame outshines the sun.
            p.emit(muzzle[0], muzzle[1], muzzle[2], { count: Math.max(1, Math.round(1400 * dt)), color: [4.5, 3.8, 2], colorTo: [3.5, 1.8, 0.4], speed: 15, dir: facing, cone: 0.07, up: 0.3, life: 0.38, size: 0.45, gravity: -1, drag: 1.3, fadeCurve: 'ease-out', sizeCurve: 'up', shape: 'disc' });
            p.emit(muzzle[0], muzzle[1], muzzle[2], { count: Math.max(1, Math.round(4000 * dt)), color: [3.2, 2, 0.6], colorTo: [1.6, 0.22, 0.03], speed: 13, dir: facing, cone: 0.2, up: 1, life: 0.75, size: 0.6, gravity: -3.5, drag: 1.5, fadeCurve: 'ease-out', sizeCurve: 'up', shape: 'smoke' });
            p.emit(muzzle[0], muzzle[1], muzzle[2], { count: Math.max(1, Math.round(900 * dt)), color: [5, 4.5, 3], colorTo: [2.5, 1.2, 0.2], speed: 16, dir: facing, cone: 0.12, up: 0.5, life: 0.45, size: 0.12, gravity: -2, drag: 0.6, stretch: 4, fadeCurve: 'ease-out', shape: 'disc' });
            p.emit(muzzle[0] + facing[0] * 4, muzzle[1] + facing[1] * 4 + 0.8, muzzle[2] + facing[2] * 4, { count: Math.max(1, Math.round(400 * dt)), color: [0.3, 0.26, 0.24], colorTo: [0.08, 0.08, 0.08], speed: 1.8, dir: facing, cone: 0.6, up: 1.8, life: 2.2, size: 0.8, drag: 1, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'knocker':
          break;
        case 'spikeball':
          this.spikeball(w, pulled, dt, muzzle, facing);
          break;
        case 'grenade':
          if (pulled && cool <= 0 && this.spend(w, 1)) {
            const b = this.boostOf(w);
            this.cooldown.set(w, 0.75 * b.rate);
            this.cooldownMax.set(w, 0.75 * b.rate);
            w.kick = 0.8;
            this.flash(muzzle, [1, 0.8, 0.4], 0.08, 4, 20);
            for (const dir of this.fan(facing, b.streams)) {
              const model = new Float32Array(16);
              placeBall(model, muzzle, b.size);
              const instance: Instance = { mesh: this.grenadeMesh, model, material: this.ballMaterial };
              this.renderer.instances.push(instance);
              this.grenades.push({ instance, pos: [muzzle[0], muzzle[1], muzzle[2]], vel: [dir[0] * GRENADE_SPEED, dir[1] * GRENADE_SPEED, dir[2] * GRENADE_SPEED], fuse: GRENADE_FUSE, spin: 0, boost: b });
            }
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 12, color: [0.6, 0.6, 0.6], colorTo: [0.35, 0.35, 0.35], speed: 2, dir: facing, cone: 0.5, life: 0.9, size: 0.2, drag: 1.2, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'fireworks':
          if (pulled && cool <= 0 && this.spend(w, 1)) {
            this.cooldown.set(w, 0.7);
            w.kick = 1;
            for (let k = 0; k < 6; k++) {
              const [c0, c1] = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
              // Straight at the aim with a little scatter (the rockets wander on their own once out).
              const spread = 0.22;
              const d: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + (Math.random() - 0.5) * 0.1, facing[2] + (Math.random() - 0.5) * spread];
              const sp = 14 + Math.random() * 5;
              this.rockets.push({ pos: [muzzle[0], muzzle[1], muzzle[2]], vel: [d[0] * sp, d[1] * sp, d[2] * sp], life: 0.7 + Math.random() * 0.9, phase: Math.random() * Math.PI * 2, color: c0, colorTo: c1, wobble: 6 + Math.random() * 10 });
            }
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 20, color: [0.6, 0.6, 0.6], colorTo: [0.35, 0.35, 0.35], speed: 2, dir: facing, cone: 0.6, life: 1.2, size: 0.25, drag: 1.2, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
      }
    }
    // Rockets and balls carry on.
    this.flyRockets(dt);
    this.flyBalls(dt);
    this.flyGrenades(dt);
  }

  // ---------- grenades

  /** Grenades arc, bounce and roll; a crab or a piece in the way sets one off at once, else the fuse does. */
  private flyGrenades(dt: number): void {
    for (let i = this.grenades.length - 1; i >= 0; i--) {
      const g = this.grenades[i];
      g.fuse -= dt;
      g.vel[1] -= GRAVITY * dt;
      g.spin += dt * Math.hypot(g.vel[0], g.vel[1], g.vel[2]) * 2;
      const next: Vec3 = [g.pos[0] + g.vel[0] * dt, g.pos[1] + g.vel[1] * dt, g.pos[2] + g.vel[2] * dt];
      const hit = this.world.segment(g.pos, next, this.owner);
      let burst = g.fuse <= 0;
      if (hit && hit.owner !== undefined) burst = true;
      else if (hit) {
        // Off the sand or a rock: the bounce keeps some of the speed, and a slow one rolls to a stop.
        const n = hit.normal;
        const vn = g.vel[0] * n[0] + g.vel[1] * n[1] + g.vel[2] * n[2];
        g.vel = [(g.vel[0] - 2 * vn * n[0]) * GRENADE_BOUNCE, (g.vel[1] - 2 * vn * n[1]) * GRENADE_BOUNCE, (g.vel[2] - 2 * vn * n[2]) * GRENADE_BOUNCE];
        g.pos = [hit.point[0] + n[0] * 0.14, hit.point[1] + n[1] * 0.14, hit.point[2] + n[2] * 0.14];
        if (Math.abs(vn) > 2) impactFx(this.renderer, hit, 0.4);
      } else g.pos = next;
      const floor = this.world.heightAt(g.pos[0], g.pos[2]) + 0.13;
      if (g.pos[1] < floor) {
        g.pos[1] = floor;
        g.vel[0] *= 0.96;
        g.vel[2] *= 0.96;
        if (g.vel[1] < 0) g.vel[1] = 0;
      }
      // A glint, ticking faster as the fuse runs down.
      if (Math.random() < dt * (6 + (GRENADE_FUSE - g.fuse) * 10)) this.renderer.particles.emit(g.pos[0], g.pos[1] + 0.12, g.pos[2], { count: 1, color: [2, 0.5, 0.3], colorTo: [1, 0.2, 0.1], speed: 0.2, life: 0.12, size: 0.14, fadeCurve: 'down', shape: 'disc' });
      if (burst) {
        const b = g.boost;
        this.splash(g.pos, GRENADE_BLAST * Math.sqrt(b.size) + b.blast, DAMAGE.grenade * b.damage);
        if (hit && hit.owner !== undefined) this.hurtOwner(hit.owner, DAMAGE.grenade * b.damage * 0.5);
        // A cluster: bomblets scatter from the burst, each a smaller grenade on a short fuse.
        for (let k = 0; k < b.cluster; k++) {
          const a = Math.random() * Math.PI * 2;
          const sp = 3 + Math.random() * 4;
          const model = new Float32Array(16);
          placeBall(model, g.pos, b.size * 0.6);
          const instance: Instance = { mesh: this.grenadeMesh, model, material: this.ballMaterial };
          this.renderer.instances.push(instance);
          this.grenades.push({ instance, pos: [g.pos[0], g.pos[1] + 0.3, g.pos[2]], vel: [Math.cos(a) * sp, 4 + Math.random() * 3, Math.sin(a) * sp], fuse: 0.5 + Math.random() * 0.4, spin: 0, boost: { ...b, size: b.size * 0.6, damage: b.damage * 0.5, blast: b.blast * 0.5, cluster: 0 } });
        }
        const list = this.renderer.instances;
        const k = list.indexOf(g.instance);
        if (k >= 0) list.splice(k, 1);
        this.grenades.splice(i, 1);
        continue;
      }
      const m = g.instance.model as Float32Array;
      placeBall(m, g.pos, g.boost.size);
      multiply(m, rotationY(g.spin, this.tmpB), this.tmpA);
      m.set(this.tmpA);
    }
  }

  /** What the chosen slot is called (for the HUD). */
  static nameOf(m: Mounted | null): string {
    return m ? pieceType(m.piece.kind).name : 'Claws';
  }

  /** A light for a moment (a muzzle flash, a pop). */
  private flash(at: Vec3, color: Vec3, life: number, radius: number, intensity: number): void {
    this.flashes.push({ at: [at[0], at[1], at[2]], color, ttl: life, life, radius, intensity });
  }

  /** The lights this frame's firing throws: the flame's glow, muzzle flashes, rockets and their pops. Call after `update`. */
  lights(dt: number): PointLight[] {
    const out: PointLight[] = [];
    if (this.flaming) {
      this.flaming.ttl -= dt;
      if (this.flaming.ttl <= 0) this.flaming = null;
      else out.push({ x: this.flaming.at[0], y: this.flaming.at[1], z: this.flaming.at[2], radius: 10, r: 1, g: 0.5, b: 0.12, intensity: 60 + Math.random() * 25 });
    }
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const f = this.flashes[i];
      f.ttl -= dt;
      if (f.ttl <= 0) {
        this.flashes.splice(i, 1);
        continue;
      }
      const k = f.ttl / f.life;
      out.push({ x: f.at[0], y: f.at[1], z: f.at[2], radius: f.radius, r: f.color[0], g: f.color[1], b: f.color[2], intensity: f.intensity * k });
    }
    for (const r of this.rockets) out.push({ x: r.pos[0], y: r.pos[1], z: r.pos[2], radius: 4.5, r: r.color[0], g: r.color[1], b: r.color[2], intensity: 14 });
    return out;
  }

  // ---------- the knocker: a pendulum, pumped while held

  /**
   * The chain hangs from the arm's ring as a rope with the ball on its end. Held, the ball is hauled up
   * and back behind the pole and kept there; let go, it swings forward with the haul behind it, then
   * swings itself out under gravity. Whatever the ball meets at speed takes a blow.
   */
  private swingKnocker(m: Mounted, dt: number, holding: boolean): void {
    const L = m.chainLength;
    const anchor = m.anchor;
    let f = this.flails.get(m);
    if (!f) {
      f = { rope: new Rope(KNOCK_LINKS, L / KNOCK_LINKS, anchor, [anchor[0], anchor[1] - L, anchor[2]]), ball: { mesh: this.knockerMesh, model: new Float32Array(16), material: this.ballMaterial }, links: this.makeLinks(KNOCK_LINKS), drawn: 0 };
      this.renderer.instances.push(f.ball);
      this.flails.set(m, f);
    }
    const fwd = m.direction;
    const ball = f.rope.end;
    let pull: Vec3 | null = null;
    let endDrag = 0.5;
    if (holding) {
      // Hauled back: a stiff pull toward a point behind and below the ring, damped hard so it hangs there.
      f.drawn = Math.min(1, f.drawn + dt / KNOCK_DRAW_SECONDS);
      const back = 0.3 + 0.6 * f.drawn;
      const target: Vec3 = [anchor[0] - fwd[0] * L * back, anchor[1] - L * (1 - back * back) * 0.8, anchor[2] - fwd[2] * L * back];
      pull = [(target[0] - ball[0]) * 90, (target[1] - ball[1]) * 90, (target[2] - ball[2]) * 90];
      endDrag = 7;
    } else if (f.drawn > 0) {
      // Let go: the ball is thrown forward by the haul (velocity in verlet is the step from the last position).
      const v = KNOCK_RELEASE * f.drawn * dt;
      f.rope.prev[KNOCK_LINKS][0] -= fwd[0] * v;
      f.rope.prev[KNOCK_LINKS][2] -= fwd[2] * v;
      f.drawn = 0;
    }
    f.rope.step(dt, anchor, null, pull, 0.6, endDrag);
    // The ball never goes under the sand.
    const floor = this.world.heightAt(ball[0], ball[2]) + 0.4;
    if (ball[1] < floor) ball[1] = floor;
    m.muzzle = [ball[0], ball[1], ball[2]];
    this.poseLinks(f.links, f.rope);
    translation(ball[0], ball[1], ball[2], f.ball.model as Float32Array);
    const vel = f.rope.endVelocity(dt);
    const speed = Math.hypot(vel[0], vel[1], vel[2]);
    if (speed < KNOCK_MIN_SPEED) return;
    // Whatever the ball reaches takes a blow by its speed, once each half a second; the blow slows the ball.
    for (const o of this.world.near(m.muzzle, 0.5, this.owner)) {
      const key = o.owner;
      if (this.knockHits.has(key)) continue;
      this.knockHits.set(key, this.clock + 0.5);
      this.hurtBox(o, DAMAGE.knocker * Math.min(1, speed / KNOCK_FULL_SPEED), 3);
      f.rope.slowEnd(0.45);
    }
  }

  // ---------- the spiky ball on its chain

  private spikeball(w: Mounted, pulled: boolean, dt: number, muzzle: Vec3, facing: Vec3): void {
    let t = this.tethers.get(w);
    if (!t) {
      t = { phase: 'ready', pos: [0, 0, 0], vel: [0, 0, 0], ball: { mesh: this.spikeMesh, model: new Float32Array(16), material: this.ballMaterial, hidden: true }, rope: new Rope(SPIKE_LINKS, CHAIN_REACH / SPIKE_LINKS, muzzle, muzzle), links: this.makeLinks(SPIKE_LINKS), resting: false, hitCool: 0 };
      this.renderer.instances.push(t.ball);
      this.tethers.set(w, t);
    }
    if (pulled) {
      if (t.phase === 'ready') {
        t.phase = 'flying';
        t.pos = [muzzle[0], muzzle[1], muzzle[2]];
        t.vel = [facing[0] * SPIKE_SPEED, facing[1] * SPIKE_SPEED, facing[2] * SPIKE_SPEED];
        t.resting = false;
        // The chain pays out from the drum: every link starts at the muzzle and is dragged out behind the ball.
        t.rope.reset(muzzle, muzzle);
        t.ball.hidden = false;
        w.kick = 1;
        this.flash(muzzle, [1, 0.75, 0.35], 0.1, 6, 30);
        this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 14, color: [1, 0.85, 0.5], colorTo: [1, 0.4, 0.1], speed: 5, dir: facing, cone: 0.35, life: 0.18, size: 0.16, fadeCurve: 'down', sizeCurve: 'peak', shape: 'disc' });
      } else if (t.phase === 'flying' || t.phase === 'landed') {
        t.phase = 'reeling';
        t.resting = false;
      }
    }
    t.hitCool = Math.max(0, t.hitCool - dt);
    if (t.phase === 'flying') {
      t.vel[1] -= 20 * dt;
      const next: Vec3 = [t.pos[0] + t.vel[0] * dt, t.pos[1] + t.vel[1] * dt, t.pos[2] + t.vel[2] * dt];
      const hit = this.world.segment(t.pos, next, this.owner);
      if (hit) {
        this.land(hit, 2, DAMAGE.spikeball);
        t.pos = [hit.point[0] + hit.normal[0] * 0.4, hit.point[1] + hit.normal[1] * 0.4, hit.point[2] + hit.normal[2] * 0.4];
        t.phase = 'landed';
        t.resting = true;
      } else {
        t.pos = next;
        if (Math.hypot(next[0] - muzzle[0], next[1] - muzzle[1], next[2] - muzzle[2]) > CHAIN_REACH) {
          // The chain is out: the ball is caught short and drops.
          t.phase = 'landed';
          t.vel = [t.vel[0] * 0.2, Math.min(0, t.vel[1]), t.vel[2] * 0.2];
        }
      }
    } else if (t.phase === 'landed') {
      // Caught at the chain's end: it falls until it lands; walking off drags it along.
      const d: Vec3 = [t.pos[0] - muzzle[0], t.pos[1] - muzzle[1], t.pos[2] - muzzle[2]];
      const l = Math.hypot(d[0], d[1], d[2]);
      if (l > CHAIN_REACH) {
        const k = CHAIN_REACH / l;
        t.pos = [muzzle[0] + d[0] * k, muzzle[1] + d[1] * k, muzzle[2] + d[2] * k];
        t.resting = false;
      }
      if (!t.resting) {
        t.vel[1] -= GRAVITY * dt;
        const next: Vec3 = [t.pos[0] + t.vel[0] * dt, t.pos[1] + t.vel[1] * dt, t.pos[2] + t.vel[2] * dt];
        const hit = this.world.segment(t.pos, next, this.owner);
        if (hit) {
          t.pos = [hit.point[0] + hit.normal[0] * 0.4, hit.point[1] + hit.normal[1] * 0.4, hit.point[2] + hit.normal[2] * 0.4];
          t.vel = [0, 0, 0];
          t.resting = true;
          impactFx(this.renderer, hit, 1);
        } else t.pos = next;
      }
    } else if (t.phase === 'reeling') {
      // The drum winds the chain in link by link; the ball is the chain's free end, dragged along behind it
      // over the sand (scuffing up dust) and round whatever is in the way, until it is home.
      t.rope.wound = Math.min(SPIKE_LINKS, t.rope.wound + (WINCH_SPEED * dt) / t.rope.seg);
      const was: Vec3 = [t.pos[0], t.pos[1], t.pos[2]];
      const onGround = t.pos[1] <= this.world.heightAt(t.pos[0], t.pos[2]) + 0.46;
      t.rope.step(dt, muzzle, null, null, 0.8, onGround ? 5 : 0.3);
      const e = t.rope.end;
      const floor = this.world.heightAt(e[0], e[2]) + 0.4;
      if (e[1] < floor) e[1] = floor;
      t.pos = [e[0], e[1], e[2]];
      const moved = Math.hypot(t.pos[0] - was[0], t.pos[2] - was[2]);
      if (onGround && moved > 1.5 * dt && Math.random() < dt * 30) this.renderer.particles.emit(t.pos[0], t.pos[1] - 0.1, t.pos[2], { count: 2, color: [0.78, 0.7, 0.5], colorTo: [0.7, 0.62, 0.45], speed: 0.6, up: 0.5, life: 0.7, size: 0.18, drag: 1.5, alpha: 0.6, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
      if (t.hitCool <= 0) {
        const hit = this.world.segment(was, t.pos, this.owner);
        if (hit && hit.owner !== undefined) {
          this.land(hit, 1.5, DAMAGE.spikeball * 0.4);
          t.hitCool = 0.4;
        }
      }
      if (t.rope.length < 0.6 || Math.hypot(t.pos[0] - muzzle[0], t.pos[1] - muzzle[1], t.pos[2] - muzzle[2]) < 0.5) {
        t.phase = 'ready';
        t.ball.hidden = true;
        for (const link of t.links) link.hidden = true;
      }
    }
    if (t.phase !== 'ready') {
      translation(t.pos[0], t.pos[1], t.pos[2], t.ball.model as Float32Array);
      // The chain between the muzzle and the ball sags, sways and drags on the sand (while reeling it was stepped above, the ball on its end).
      if (t.phase !== 'reeling') t.rope.step(dt, muzzle, t.pos, null, 1.2, 0);
      t.rope.floor((x, z) => this.world.heightAt(x, z) + 0.08);
      this.poseLinks(t.links, t.rope);
    }
  }

  // ---------- fireworks

  private flyRockets(dt: number): void {
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.life -= dt;
      r.phase += dt * r.wobble;
      // A wobble across the way it goes, a little gravity, drag.
      const l = Math.hypot(r.vel[0], r.vel[2]) || 1;
      const px = -r.vel[2] / l;
      const pz = r.vel[0] / l;
      const wob = Math.sin(r.phase) * 18;
      r.vel[0] += (px * wob - r.vel[0] * 0.6) * dt;
      r.vel[2] += (pz * wob - r.vel[2] * 0.6) * dt;
      r.vel[1] += (Math.cos(r.phase * 0.7) * 5 - 2 - r.vel[1] * 0.6) * dt;
      r.pos[0] += r.vel[0] * dt;
      r.pos[1] += r.vel[1] * dt;
      r.pos[2] += r.vel[2] * dt;
      this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 2, color: r.color, colorTo: r.colorTo, speed: 1.5, cone: 1, life: 0.35, size: 0.08, gravity: 2, fadeCurve: 'down', sizeCurve: 'down', shape: 'spark', stretch: 3 });
      if (Math.random() < dt * 20) this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 1, color: [0.6, 0.6, 0.6], colorTo: [0.4, 0.4, 0.4], speed: 0.3, life: 1, size: 0.14, alpha: 0.4, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
      const ground = this.world.segment(r.pos, [r.pos[0], r.pos[1] - 0.05, r.pos[2]], this.owner);
      if (r.life <= 0 || ground) {
        // Pop: a bright burst of its colours, glitter that falls, and a thump to whatever is close.
        this.flash(r.pos, r.color, 0.3, 9, 45);
        this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 6, color: [1, 1, 0.9], colorTo: r.color, speed: 0.5, life: 0.12, size: 0.8, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
        this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 46, color: r.color, colorTo: r.colorTo, speed: 6, cone: Math.PI, life: 0.8, size: 0.09, gravity: 3, drag: 1.5, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark', stretch: 2 });
        this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 24, color: r.colorTo, colorTo: [1, 1, 1], speed: 2.5, cone: Math.PI, life: 1.6, size: 0.06, gravity: 4, drag: 0.8, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
        for (const o of this.world.near(r.pos, 2.2, this.owner)) this.hurtBox(o, DAMAGE.fireworks, 1);
        this.rockets.splice(i, 1);
      }
    }
  }

  // ---------- cannonballs

  private flyBalls(dt: number): void {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.vel[1] -= 20 * dt;
      const next: Vec3 = [b.pos[0] + b.vel[0] * dt, b.pos[1] + b.vel[1] * dt, b.pos[2] + b.vel[2] * dt];
      b.life -= dt;
      const hit = this.world.segment(b.pos, next, this.owner);
      if (hit || b.life <= 0) {
        if (hit) {
          this.land(hit, 4 * b.size, DAMAGE.cannon * b.damage);
          if (b.blast > 0) this.splash(hit.point, b.blast, DAMAGE.cannon * b.damage * 0.5);
        }
        const list = this.renderer.instances;
        const k = list.indexOf(b.instance);
        if (k >= 0) list.splice(k, 1);
        this.balls.splice(i, 1);
        continue;
      }
      b.pos = next;
      placeBall(b.instance.model as Float32Array, b.pos, b.size);
    }
  }

  private ball(at: Vec3, vel: Vec3, b: Boost = NO_BOOST): void {
    const model = new Float32Array(16);
    placeBall(model, at, b.size);
    const instance: Instance = { mesh: this.ballMesh, model, material: this.ballMaterial };
    this.renderer.instances.push(instance);
    this.balls.push({ instance, pos: [at[0], at[1], at[2]], vel, life: 6, size: b.size, damage: b.damage, blast: b.blast });
  }

  /** A blast round `at`: everything within `radius` takes `damage`, with a boom to match. */
  private splash(at: Vec3, radius: number, damage: number): void {
    for (const o of this.world.near(at, radius, this.owner, this.structure.flatAim)) this.hurtBox(o, damage, 1);
    const p = this.renderer.particles;
    p.emit(at[0], at[1] + 0.2, at[2], { count: 4, color: [3, 2.2, 1], colorTo: [2, 0.6, 0.1], speed: 0.3, life: 0.14, size: radius * 0.9, fadeCurve: 'down', sizeCurve: 'up', shape: 'disc' });
    p.emit(at[0], at[1] + 0.2, at[2], { count: Math.round(10 * radius), color: [0.5, 0.45, 0.4], colorTo: [0.25, 0.25, 0.25], speed: radius * 1.5, up: 1, life: 1 + radius * 0.2, size: 0.3 + radius * 0.12, drag: 1.5, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
    p.emit(at[0], at[1] + 0.2, at[2], { count: Math.round(12 * radius), color: [1, 0.9, 0.5], colorTo: [1, 0.4, 0.1], speed: 4 + radius * 2, up: 2, life: 0.5, size: 0.06, gravity: 12, stretch: 4, fadeCurve: 'down', shape: 'spark' });
    this.flash(at, [1, 0.7, 0.3], 0.15, 3 + radius * 1.5, 25 + radius * 8);
  }

  // ---------- hits

  /** A hit lands: its effect, and the damage to whoever (or whatever piece) was hit. */
  private land(hit: Hit, size: number, damage: number): void {
    impactFx(this.renderer, hit, size);
    this.hurtOwner(hit.owner, damage);
  }

  private hurtOwner(owner: unknown, damage: number): void {
    if (isCombatant(owner)) owner.hurt(damage * this.damageScale);
    else if (isPartRef(owner)) owner.structure.damage(owner.index, damage * this.damageScale);
  }

  /** A blow to a box (the knocker's ball, a rocket's pop): the effect on it, the damage to its owner. */
  private hurtBox(o: Obstacle, damage: number, size: number): void {
    impactFx(this.renderer, { point: [o.center[0], o.center[1], o.center[2]], normal: [0, 1, 0], surface: o.surface, distance: 0, owner: o.owner }, size);
    this.hurtOwner(o.owner, damage);
  }

  /** A gun's shot: a ray against the world, a tracer that lasts as long as the flight, the hit due when it lands. */
  /** `size` scales the bullet (and its hit), `blast` is a splash radius where it lands. */
  private tracer(muzzle: Vec3, facing: Vec3, spread: number, damage: number, size = 1, blast = 0): void {
    const d: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + (Math.random() - 0.5) * spread, facing[2] + (Math.random() - 0.5) * spread];
    const l = Math.hypot(d[0], d[1], d[2]) || 1;
    const dir: Vec3 = [d[0] / l, d[1] / l, d[2] / l];
    const hit = this.world.raycast(muzzle, dir, GUN_RANGE, this.owner, this.structure.flatAim);
    const flight = (hit ? hit.distance : GUN_RANGE) / TRACER_SPEED;
    if (hit) this.pending.push({ at: this.clock + flight, hit, damage, size, blast });
    this.flash(muzzle, [1, 0.85, 0.5], 0.07, 5, 35);
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 1, color: [3.5, 3, 1.6], colorTo: [3, 1.6, 0.5], speed: TRACER_SPEED, dir, cone: 0, life: Math.max(0.02, flight), size: 0.17 * size, stretch: 10, vary: 0, fadeCurve: 'none', sizeCurve: 'none', shape: 'spark' });
    // A glowing core so the round reads from above as well.
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 1, color: [4, 3.5, 2.5], colorTo: [3, 2, 1], speed: TRACER_SPEED, dir, cone: 0, life: Math.max(0.02, flight), size: 0.3 * size, vary: 0, fadeCurve: 'none', sizeCurve: 'none', shape: 'disc' });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 3, color: [1, 0.8, 0.4], colorTo: [1, 0.4, 0.1], speed: 2, dir: facing, cone: 0.6, life: 0.08, size: 0.1, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
  }

  /** Take the balls and chains off the beach (an opponent gone). */
  dispose(): void {
    removeInstances(this.renderer, [...this.balls.map((b) => b.instance), ...this.grenades.map((g) => g.instance), ...[...this.tethers.values()].flatMap((t) => [t.ball, ...t.links]), ...[...this.flails.values()].flatMap((f) => [f.ball, ...f.links])]);
    this.grenades.length = 0;
    this.balls.length = 0;
    this.tethers.clear();
    this.flails.clear();
    this.rockets.length = 0;
  }
}

/** A grenade: a dark green egg with a brass cap and a band. */
function grenadeShell(): MeshData {
  const parts = [sphere(0.13, [0.1, 0.16, 0.08], 10, 7), box(-0.04, 0.1, -0.04, 0.04, 0.17, 0.04, [0.55, 0.4, 0.12]), box(-0.135, -0.02, -0.135, 0.135, 0.02, 0.135, [0.2, 0.2, 0.2])];
  let nv = 0;
  let ni = 0;
  for (const p of parts) {
    nv += p.vertices.length;
    ni += p.indices.length;
  }
  const vertices = new Float32Array(nv);
  const indices = new Uint32Array(ni);
  let vo = 0;
  let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / 11;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}

/** A cannonball's matrix: at `at`, `size` times the plain ball. */
function placeBall(out: Float32Array, at: Vec3, size: number): void {
  out.fill(0);
  out[0] = size;
  out[5] = size;
  out[10] = size;
  out[12] = at[0];
  out[13] = at[1];
  out[14] = at[2];
  out[15] = 1;
}

function removeInstances(renderer: Renderer, instances: Instance[]): void {
  const gone = new Set(instances);
  const list = renderer.instances;
  let k = 0;
  for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[k++] = list[i];
  list.length = k;
}

/**
 * A chain as a rope of points stepped by Verlet integration: each point keeps its last position, so its
 * velocity is the step it took; gravity and drag act, then the distance between neighbours is put back
 * a few times over. The first point is pinned to an anchor; the last is either free and heavy (the
 * knocker's ball) or pinned to a position the physics owns (the spiky ball).
 */
class Rope {
  readonly pts: Vec3[] = [];
  readonly prev: Vec3[] = [];
  /** Segments wound in at the anchor (a drum), fractional: those points sit at the anchor and the next segment is short by the fraction. */
  wound = 0;

  constructor(readonly n: number, readonly seg: number, from: Vec3, to: Vec3) {
    for (let i = 0; i <= n; i++) {
      this.pts.push([0, 0, 0]);
      this.prev.push([0, 0, 0]);
    }
    this.reset(from, to);
  }

  /** How much chain is out. */
  get length(): number {
    return (this.n - this.wound) * this.seg;
  }

  /** Lay the rope in a straight line from `from` to `to`, still, nothing wound in. */
  reset(from: Vec3, to: Vec3): void {
    this.wound = 0;
    for (let i = 0; i <= this.n; i++) {
      const t = i / this.n;
      const p = this.pts[i];
      p[0] = from[0] + (to[0] - from[0]) * t;
      p[1] = from[1] + (to[1] - from[1]) * t;
      p[2] = from[2] + (to[2] - from[2]) * t;
      this.prev[i].splice(0, 3, p[0], p[1], p[2]);
    }
  }

  get end(): Vec3 {
    return this.pts[this.n];
  }

  /** The last point's velocity over the step just taken. */
  endVelocity(dt: number): Vec3 {
    const p = this.pts[this.n];
    const q = this.prev[this.n];
    const k = 1 / Math.max(dt, 1e-4);
    return [(p[0] - q[0]) * k, (p[1] - q[1]) * k, (p[2] - q[2]) * k];
  }

  /** Scale the last point's velocity (a blow landed). */
  slowEnd(k: number): void {
    const p = this.pts[this.n];
    const q = this.prev[this.n];
    for (let a = 0; a < 3; a++) q[a] = p[a] - (p[a] - q[a]) * k;
  }

  /**
   * A frame. `anchor` pins the first point; `endAt` pins the last (null: it is a free, heavy ball);
   * `pull` is an acceleration on a free last point; `drag` per second on every point, `endDrag` extra on the last.
   */
  step(dt: number, anchor: Vec3, endAt: Vec3 | null, pull: Vec3 | null, drag: number, endDrag: number): void {
    const n = this.n;
    const g = -GRAVITY * dt * dt;
    // Points up to `w0` are on the drum (at the anchor); segment w0 is the part-wound one.
    const w0 = Math.min(n - 1, Math.floor(this.wound));
    const frac = Math.min(1, this.wound - w0);
    for (let i = 1; i <= n; i++) {
      const p = this.pts[i];
      const q = this.prev[i];
      if (i <= w0) {
        p.splice(0, 3, anchor[0], anchor[1], anchor[2]);
        q.splice(0, 3, anchor[0], anchor[1], anchor[2]);
        continue;
      }
      if (i === n && endAt) {
        q.splice(0, 3, p[0], p[1], p[2]);
        p.splice(0, 3, endAt[0], endAt[1], endAt[2]);
        continue;
      }
      const k = Math.max(0, 1 - (drag + (i === n ? endDrag : 0)) * dt);
      const vx = (p[0] - q[0]) * k;
      const vy = (p[1] - q[1]) * k;
      const vz = (p[2] - q[2]) * k;
      q.splice(0, 3, p[0], p[1], p[2]);
      p[0] += vx;
      p[1] += vy + g;
      p[2] += vz;
      if (i === n && pull) {
        p[0] += pull[0] * dt * dt;
        p[1] += pull[1] * dt * dt;
        p[2] += pull[2] * dt * dt;
      }
    }
    this.pts[0].splice(0, 3, anchor[0], anchor[1], anchor[2]);
    for (let it = 0; it < 10; it++) {
      for (let i = w0; i < n; i++) {
        const a = this.pts[i];
        const b = this.pts[i + 1];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const dz = b[2] - a[2];
        const l = Math.hypot(dx, dy, dz) || 1e-6;
        const want = i === w0 ? this.seg * (1 - frac) : this.seg;
        const diff = (l - want) / l;
        // Who gives: the anchor (and the drum) never, a pinned end never, the heavy ball little, links between them half each.
        let wa = 0.5;
        let wb = 0.5;
        if (i === w0) {
          wa = 0;
          wb = 1;
        }
        if (i + 1 === n) {
          if (endAt) {
            wa = i === w0 ? 0 : 1;
            wb = 0;
          } else if (i > w0) {
            wa = 0.85;
            wb = 0.15;
          }
        }
        a[0] += dx * diff * wa;
        a[1] += dy * diff * wa;
        a[2] += dz * diff * wa;
        b[0] -= dx * diff * wb;
        b[1] -= dy * diff * wb;
        b[2] -= dz * diff * wb;
      }
    }
  }

  /** Keep every free point above the ground (`height` at x, z), so a slack chain lies on the sand rather than under it. */
  floor(height: (x: number, z: number) => number): void {
    for (let i = Math.floor(this.wound) + 1; i < this.n; i++) {
      const p = this.pts[i];
      const h = height(p[0], p[2]);
      if (p[1] < h) p[1] = h;
    }
  }
}

/** One link of chain, a unit long along +y (scaled to the segment when posed): a rod with a bar either side, an elongated ring. */
function chainLink(): MeshData {
  const c: Vec = [0.3, 0.3, 0.33];
  const d: Vec = [0.22, 0.22, 0.25];
  const parts = [box(-0.018, 0, -0.018, 0.018, 1, 0.018, d), box(0.03, 0.12, -0.014, 0.058, 0.88, 0.014, c), box(-0.058, 0.12, -0.014, -0.03, 0.88, 0.014, c), box(-0.058, 0.06, -0.014, 0.058, 0.13, 0.014, c), box(-0.058, 0.87, -0.014, 0.058, 0.94, 0.014, c)];
  let nv = 0;
  let ni = 0;
  for (const p of parts) {
    nv += p.vertices.length;
    ni += p.indices.length;
  }
  const vertices = new Float32Array(nv);
  const indices = new Uint32Array(ni);
  let vo = 0;
  let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / 11;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}

/** `out` stands a unit rod (built along +y from 0 to 1) from `from` to `to`. */
function alongMatrix(out: Float32Array, from: Vec3, to: Vec3): void {
  const d: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
  const len = Math.hypot(d[0], d[1], d[2]) || 1e-6;
  const y: Vec3 = [d[0] / len, d[1] / len, d[2] / len];
  // x = up × y, or along +x when y is upright.
  let x: Vec3 = [-y[2], 0, y[0]];
  let xl = Math.hypot(x[0], x[1], x[2]);
  if (xl < 1e-4) {
    x = [1, 0, 0];
    xl = 1;
  }
  x = [x[0] / xl, x[1] / xl, x[2] / xl];
  const z: Vec3 = [x[1] * y[2] - x[2] * y[1], x[2] * y[0] - x[0] * y[2], x[0] * y[1] - x[1] * y[0]];
  out.set([x[0], x[1], x[2], 0, y[0] * len, y[1] * len, y[2] * len, 0, z[0], z[1], z[2], 0, from[0], from[1], from[2], 1]);
}

function sphere(r: number, color: Vec, segs = 10, rings = 6): MeshData {
  const b = new MeshBuilder();
  const at = (i: number, j: number): Vec => {
    const th = (i / segs) * Math.PI * 2;
    const ph = -Math.PI / 2 + (j / rings) * Math.PI;
    return [r * Math.cos(ph) * Math.cos(th), r * Math.sin(ph), r * Math.cos(ph) * Math.sin(th)];
  };
  for (let j = 0; j < rings; j++) for (let i = 0; i < segs; i++) {
    if (j === 0) b.tri(at(i, 0), at(i, 1), at(i + 1, 1), color);
    else if (j === rings - 1) b.tri(at(i, j), at(i, rings), at(i + 1, j), color);
    else b.quad(at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j), color);
  }
  return b.build();
}

function spikedBall(r: number, color: Vec): MeshData {
  const parts: MeshData[] = [sphere(r, color)];
  const s = r * 0.22;
  for (const [x, y, z] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
    const cx = x * r; const cy = y * r; const cz = z * r;
    parts.push(box(cx - s, cy - s, cz - s, cx + s, cy + s, cz + s, [0.4, 0.4, 0.42]));
  }
  let nv = 0; let ni = 0;
  for (const p of parts) { nv += p.vertices.length; ni += p.indices.length; }
  const vertices = new Float32Array(nv);
  const indices = new Uint32Array(ni);
  let vo = 0; let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / 11;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}
