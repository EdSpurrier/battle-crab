import { Mesh, MeshBuilder, box, material, translation, type Instance, type Mat4, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { DAMAGE, type Combatant } from './combat';
import { impactFx, type Hit, type Obstacle, type World } from './impacts';
import { pieceType, type PieceKind } from './shell';
import { CANNON_SPEED, isPartRef, type Mounted, type Structure } from './structure';

/**
 * Firing what is mounted on the shell. One weapon is selected at a time (action slots 2 to 5;
 * slot 1 is the claws, the crab's own). The trigger is held or released; each weapon makes of it
 * what it is:
 * - the cannon lobs a big ball per pull that hits very hard;
 * - the guns stream tracers while held (the gatling after spinning up); they hit at once (a ray
 *   against the world; the tracer lasts the flight and the hit plays when it lands);
 * - the flamethrower pours flame while held, and sets wood alight;
 * - the knocker is a ball on a chain: holding pumps the swing in the direction it is already
 *   going, and whatever the ball meets at speed takes it;
 * - the spiky ball cannon fires a spiked ball on a chain; a second pull reels it back in, and it
 *   hits on the way out and on the way back;
 * - the fireworks gun lets off a handful of rockets that wander and pop.
 * Ammunition is limited (the knocker and the spiky ball never run out); pickups refill it.
 * Hits hurt crabs and break the pieces built on their shells.
 */

interface Ball {
  instance: Instance;
  pos: Vec3;
  vel: Vec3;
  life: number;
}

/** A gun's hit, due when its tracer gets there. */
interface Pending {
  at: number;
  hit: Hit;
  damage: number;
}

/** The spiky ball out on its chain. */
interface Tether {
  phase: 'ready' | 'flying' | 'landed' | 'reeling';
  pos: Vec3;
  vel: Vec3;
  ball: Instance;
  chain: Instance;
  hitCool: number;
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
export const AMMO: Record<PieceKind, number> = { plank: 0, beam: 0, joint: 0, cannon: 10, gatling: 300, machinegun: 150, flamethrower: 12, knocker: Infinity, spikeball: Infinity, fireworks: 18 };
/** The spiky ball: how fast it leaves, how far its chain reaches, how fast it is reeled in. */
const SPIKE_SPEED = 22;
const CHAIN_REACH = 14;
const REEL_SPEED = 20;
/** The knocker: gravity on its pendulum, how hard a held trigger pumps it, how fast the ball must go to hurt, the speed at which it does all it can. */
const KNOCK_GRAVITY = 24;
const KNOCK_PUMP = 7;
const KNOCK_MIN_SPEED = 3.5;
const KNOCK_FULL_SPEED = 10;
const FIREWORK_COLORS: [Vec3, Vec3][] = [[[1, 0.3, 0.3], [1, 0.8, 0.2]], [[0.3, 0.6, 1], [0.8, 0.4, 1]], [[0.3, 1, 0.4], [1, 1, 0.5]], [[1, 0.5, 0.9], [0.5, 0.9, 1]], [[1, 0.85, 0.3], [1, 0.4, 0.1]]];

export class Arsenal {
  /** The chosen weapon, an index into the structure's weapons (-1: none, the claws). */
  selected = -1;
  private held = false;
  private pulled = false;
  private readonly cooldown = new Map<Mounted, number>();
  private readonly spinRate = new Map<Mounted, number>();
  private readonly ammo = new Map<Mounted, number>();
  private readonly knockHits = new Map<unknown, number>();
  private readonly tethers = new Map<Mounted, Tether>();
  private readonly rockets: Rocket[] = [];
  private readonly balls: Ball[] = [];
  private readonly pending: Pending[] = [];
  private clock = 0;
  private readonly ballMesh: Mesh;
  private readonly spikeMesh: Mesh;
  private readonly chainMesh: Mesh;
  private readonly ballMaterial = material({ roughness: 0.5, metallic: 0.5 });

  /** Who fires: their own box and pieces are never hit. `damageScale` softens an opponent's guns; `infinite` ammo for them too. */
  constructor(private readonly renderer: Renderer, public structure: Structure, private readonly world: World, private readonly owner: unknown, private readonly damageScale = 1, private readonly infinite = false) {
    this.ballMesh = new Mesh(renderer.gl, sphere(0.15, BALL));
    this.spikeMesh = new Mesh(renderer.gl, spikedBall(0.2, SPIKE));
    this.chainMesh = new Mesh(renderer.gl, box(-0.025, 0, -0.025, 0.025, 1, 0.025, [0.3, 0.3, 0.33]));
    for (const m of structure.weapons) this.ammo.set(m, AMMO[m.piece.kind]);
  }

  get weapon(): Mounted | null {
    return this.structure.weapons[this.selected] ?? null;
  }

  /** How many shots weapon `m` has left (Infinity: never runs out). */
  ammoOf(m: Mounted): number {
    return this.infinite ? Infinity : this.ammo.get(m) ?? 0;
  }

  /** Every weapon back to full. */
  refill(): void {
    for (const m of this.structure.weapons) this.ammo.set(m, AMMO[m.piece.kind]);
  }

  /** The trigger: down on press, up on release. */
  trigger(down: boolean): void {
    if (down && !this.held) this.pulled = true;
    this.held = down;
  }

  /** Spend `n` of weapon `w`'s ammunition if it has it. */
  private spend(w: Mounted, n: number): boolean {
    if (this.infinite) return true;
    const left = this.ammo.get(w) ?? 0;
    if (left < n) return false;
    this.ammo.set(w, left - n);
    return true;
  }

  /**
   * A frame: turn the turrets toward `aimAt` (the crosshair's point in the world, the ground
   * marker), fire what the trigger asks of the chosen weapon straight out of its barrel, swing the
   * knockers, fly the balls, chains and rockets, ease the kicks.
   */
  update(dt: number, body: Mat4, aimAt: Vec3 | null = null): void {
    this.clock += dt;
    this.structure.aim(body, aimAt, dt);
    const w = this.weapon;
    const pulled = this.pulled;
    this.pulled = false;
    for (let i = this.pending.length - 1; i >= 0; i--) {
      if (this.pending[i].at <= this.clock) {
        this.land(this.pending[i].hit, 1, this.pending[i].damage);
        this.pending.splice(i, 1);
      }
    }
    for (const [k, t] of this.knockHits) if (t <= this.clock) this.knockHits.delete(k);
    for (const m of this.structure.weapons) {
      m.kick = Math.max(0, m.kick - dt * 6);
      this.cooldown.set(m, Math.max(0, (this.cooldown.get(m) ?? 0) - dt));
      if (m.piece.kind === 'gatling') {
        const rate = this.spinRate.get(m) ?? 0;
        const want = m === w && this.held && this.ammoOf(m) > 0 ? 1 : 0;
        const next = rate + (want - rate) * (1 - Math.exp(-(want ? 2.2 : 1.4) * dt));
        this.spinRate.set(m, next);
        m.spin += dt * next * 40;
      }
      if (m.piece.kind === 'knocker') this.swingKnocker(m, dt, m === w && this.held);
    }
    if (w) {
      const muzzle = w.muzzle;
      const facing = w.direction;
      const cool = this.cooldown.get(w) ?? 0;
      switch (w.piece.kind) {
        case 'cannon':
          if (pulled && cool <= 0 && this.spend(w, 1)) {
            this.cooldown.set(w, 1);
            w.kick = 1;
            this.ball(muzzle, [facing[0] * CANNON_SPEED, facing[1] * CANNON_SPEED, facing[2] * CANNON_SPEED]);
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 18, color: [1, 0.85, 0.5], colorTo: [1, 0.4, 0.1], speed: 6, dir: facing, cone: 0.35, life: 0.2, size: 0.2, fadeCurve: 'down', sizeCurve: 'peak', shape: 'disc' });
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 30, color: [0.55, 0.55, 0.55], colorTo: [0.3, 0.3, 0.3], speed: 3, dir: facing, cone: 0.5, up: 0.6, life: 1.8, size: 0.35, drag: 1.2, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'gatling': {
          const rate = this.spinRate.get(w) ?? 0;
          if (this.held && rate > 0.55 && cool <= 0 && this.spend(w, 1)) {
            this.cooldown.set(w, 1 / (8 + rate * 22));
            w.kick = 0.6;
            this.tracer(muzzle, facing, 0.03, DAMAGE.gatling);
          }
          break;
        }
        case 'machinegun':
          if (this.held && cool <= 0 && this.spend(w, 1)) {
            this.cooldown.set(w, 0.11);
            w.kick = 0.3;
            this.tracer(muzzle, facing, 0.04, DAMAGE.machinegun);
          }
          break;
        case 'flamethrower':
          if (this.held && this.spend(w, dt)) {
            w.kick = 0.3;
            for (const o of this.world.inCone(muzzle, facing, 4.5, 0.3, this.owner)) {
              if (isCombatant(o)) o.hurt(DAMAGE.flamethrower * dt * this.damageScale);
              else if (isPartRef(o)) {
                o.structure.damage(o.index, DAMAGE.flamethrower * dt * this.damageScale);
                o.structure.ignite(o.index);
              }
            }
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: Math.max(1, Math.round(900 * dt)), color: [1, 0.8, 0.3], colorTo: [0.7, 0.12, 0.02], speed: 9, dir: facing, cone: 0.14, up: 0.6, life: 0.5, size: 0.14, gravity: -2.5, drag: 1.6, fadeCurve: 'ease-out', sizeCurve: 'up', shape: 'smoke' });
            if (Math.random() < dt * 30) this.renderer.particles.emit(muzzle[0] + facing[0] * 2, muzzle[1] + 0.4, muzzle[2] + facing[2] * 2, { count: 2, color: [0.25, 0.22, 0.2], colorTo: [0.1, 0.1, 0.1], speed: 0.8, up: 1.2, life: 1.8, size: 0.3, drag: 1, alpha: 0.4, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'knocker':
          break;
        case 'spikeball':
          this.spikeball(w, pulled, dt, muzzle, facing);
          break;
        case 'fireworks':
          if (pulled && cool <= 0 && this.spend(w, 1)) {
            this.cooldown.set(w, 0.7);
            w.kick = 1;
            for (let k = 0; k < 6; k++) {
              const [c0, c1] = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
              const spread = 0.35;
              const d: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + Math.random() * 0.3, facing[2] + (Math.random() - 0.5) * spread];
              const sp = 11 + Math.random() * 5;
              this.rockets.push({ pos: [muzzle[0], muzzle[1], muzzle[2]], vel: [d[0] * sp, d[1] * sp, d[2] * sp], life: 0.7 + Math.random() * 0.9, phase: Math.random() * Math.PI * 2, color: c0, colorTo: c1, wobble: 6 + Math.random() * 10 });
            }
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 20, color: [0.6, 0.6, 0.6], colorTo: [0.35, 0.35, 0.35], speed: 2, dir: facing, cone: 0.6, life: 1.2, size: 0.25, drag: 1.2, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
      }
    }
    // Chains of weapons not chosen still fly, land and hang; rockets and balls carry on.
    for (const [m] of this.tethers) if (m !== w) this.spikeball(m, false, dt, m.muzzle, m.direction);
    this.flyRockets(dt);
    this.flyBalls(dt);
  }

  /** What the chosen slot is called (for the HUD). */
  static nameOf(m: Mounted | null): string {
    return m ? pieceType(m.piece.kind).name : 'Claws';
  }

  // ---------- the knocker: a pendulum, pumped while held

  private swingKnocker(m: Mounted, dt: number, pumping: boolean): void {
    const L = m.chainLength;
    let a = -(KNOCK_GRAVITY / L) * Math.sin(m.swing) - 0.35 * m.swingRate;
    if (pumping) a += (KNOCK_PUMP * (m.swingRate >= 0 ? 1 : -1)) / Math.max(0.6, L);
    m.swingRate += a * dt;
    m.swing += m.swingRate * dt;
    const speed = Math.abs(m.swingRate) * L;
    if (speed < KNOCK_MIN_SPEED) return;
    // The ball is where the last pose put it; whatever it reaches takes a blow by its speed, once each half a second.
    for (const o of this.world.near(m.muzzle, 0.45, this.owner)) {
      const key = o.owner;
      if (this.knockHits.has(key)) continue;
      this.knockHits.set(key, this.clock + 0.5);
      this.hurtBox(o, DAMAGE.knocker * Math.min(1, speed / KNOCK_FULL_SPEED), 3);
      // The blow slows the ball.
      m.swingRate *= 0.55;
    }
  }

  // ---------- the spiky ball on its chain

  private spikeball(w: Mounted, pulled: boolean, dt: number, muzzle: Vec3, facing: Vec3): void {
    let t = this.tethers.get(w);
    if (!t) {
      t = { phase: 'ready', pos: [0, 0, 0], vel: [0, 0, 0], ball: { mesh: this.spikeMesh, model: new Float32Array(16), material: this.ballMaterial, hidden: true }, chain: { mesh: this.chainMesh, model: new Float32Array(16), material: this.ballMaterial, hidden: true }, hitCool: 0 };
      this.renderer.instances.push(t.ball, t.chain);
      this.tethers.set(w, t);
    }
    if (pulled) {
      if (t.phase === 'ready') {
        t.phase = 'flying';
        t.pos = [muzzle[0], muzzle[1], muzzle[2]];
        t.vel = [facing[0] * SPIKE_SPEED, facing[1] * SPIKE_SPEED, facing[2] * SPIKE_SPEED];
        t.ball.hidden = false;
        t.chain.hidden = false;
        w.kick = 1;
        this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 14, color: [1, 0.85, 0.5], colorTo: [1, 0.4, 0.1], speed: 5, dir: facing, cone: 0.35, life: 0.18, size: 0.16, fadeCurve: 'down', sizeCurve: 'peak', shape: 'disc' });
      } else if (t.phase === 'flying' || t.phase === 'landed') t.phase = 'reeling';
    }
    t.hitCool = Math.max(0, t.hitCool - dt);
    if (t.phase === 'flying') {
      t.vel[1] -= 20 * dt;
      const next: Vec3 = [t.pos[0] + t.vel[0] * dt, t.pos[1] + t.vel[1] * dt, t.pos[2] + t.vel[2] * dt];
      const hit = this.world.segment(t.pos, next, this.owner);
      if (hit) {
        this.land(hit, 2, DAMAGE.spikeball);
        t.pos = [hit.point[0] + hit.normal[0] * 0.2, hit.point[1] + hit.normal[1] * 0.2, hit.point[2] + hit.normal[2] * 0.2];
        t.phase = 'landed';
      } else {
        t.pos = next;
        if (Math.hypot(next[0] - muzzle[0], next[1] - muzzle[1], next[2] - muzzle[2]) > CHAIN_REACH) t.phase = 'landed';
      }
    } else if (t.phase === 'reeling') {
      const d: Vec3 = [muzzle[0] - t.pos[0], muzzle[1] - t.pos[1], muzzle[2] - t.pos[2]];
      const l = Math.hypot(d[0], d[1], d[2]);
      if (l < 0.6) {
        t.phase = 'ready';
        t.ball.hidden = true;
        t.chain.hidden = true;
      } else {
        const step = Math.min(l, REEL_SPEED * dt);
        const next: Vec3 = [t.pos[0] + (d[0] / l) * step, t.pos[1] + (d[1] / l) * step, t.pos[2] + (d[2] / l) * step];
        if (t.hitCool <= 0) {
          const hit = this.world.segment(t.pos, next, this.owner);
          if (hit && hit.owner !== undefined) {
            this.land(hit, 1.5, DAMAGE.spikeball * 0.4);
            t.hitCool = 0.4;
          }
        }
        t.pos = next;
      }
    }
    if (t.phase !== 'ready') {
      translation(t.pos[0], t.pos[1], t.pos[2], t.ball.model as Float32Array);
      alongMatrix(t.chain.model as Float32Array, muzzle, t.pos);
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
      r.vel[1] += (Math.cos(r.phase * 0.7) * 10 - 5 - r.vel[1] * 0.6) * dt;
      r.pos[0] += r.vel[0] * dt;
      r.pos[1] += r.vel[1] * dt;
      r.pos[2] += r.vel[2] * dt;
      this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 2, color: r.color, colorTo: r.colorTo, speed: 1.5, cone: 1, life: 0.35, size: 0.08, gravity: 2, fadeCurve: 'down', sizeCurve: 'down', shape: 'spark', stretch: 3 });
      if (Math.random() < dt * 20) this.renderer.particles.emit(r.pos[0], r.pos[1], r.pos[2], { count: 1, color: [0.6, 0.6, 0.6], colorTo: [0.4, 0.4, 0.4], speed: 0.3, life: 1, size: 0.14, alpha: 0.4, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
      const ground = this.world.segment(r.pos, [r.pos[0], r.pos[1] - 0.05, r.pos[2]], this.owner);
      if (r.life <= 0 || ground) {
        // Pop: a bright burst of its colours, glitter that falls, and a thump to whatever is close.
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
        if (hit) this.land(hit, 4, DAMAGE.cannon);
        const list = this.renderer.instances;
        const k = list.indexOf(b.instance);
        if (k >= 0) list.splice(k, 1);
        this.balls.splice(i, 1);
        continue;
      }
      b.pos = next;
      translation(b.pos[0], b.pos[1], b.pos[2], b.instance.model);
    }
  }

  private ball(at: Vec3, vel: Vec3): void {
    const instance: Instance = { mesh: this.ballMesh, model: translation(at[0], at[1], at[2]), material: this.ballMaterial };
    this.renderer.instances.push(instance);
    this.balls.push({ instance, pos: [at[0], at[1], at[2]], vel, life: 6 });
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
  private tracer(muzzle: Vec3, facing: Vec3, spread: number, damage: number): void {
    const d: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + (Math.random() - 0.5) * spread, facing[2] + (Math.random() - 0.5) * spread];
    const l = Math.hypot(d[0], d[1], d[2]) || 1;
    const dir: Vec3 = [d[0] / l, d[1] / l, d[2] / l];
    const hit = this.world.raycast(muzzle, dir, GUN_RANGE, this.owner);
    const flight = (hit ? hit.distance : GUN_RANGE) / TRACER_SPEED;
    if (hit) this.pending.push({ at: this.clock + flight, hit, damage });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 1, color: [1, 0.95, 0.7], colorTo: [1, 0.7, 0.3], speed: TRACER_SPEED, dir, cone: 0, life: Math.max(0.02, flight), size: 0.11, stretch: 12, vary: 0, fadeCurve: 'none', sizeCurve: 'none', shape: 'spark' });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 3, color: [1, 0.8, 0.4], colorTo: [1, 0.4, 0.1], speed: 2, dir: facing, cone: 0.6, life: 0.08, size: 0.1, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
  }

  /** Take the balls and chains off the beach (an opponent gone). */
  dispose(): void {
    const gone = new Set<Instance>([...this.balls.map((b) => b.instance), ...[...this.tethers.values()].flatMap((t) => [t.ball, t.chain])]);
    const list = this.renderer.instances;
    let k = 0;
    for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[k++] = list[i];
    list.length = k;
    this.balls.length = 0;
    this.tethers.clear();
    this.rockets.length = 0;
  }
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
