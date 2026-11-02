import { Mesh, MeshBuilder, material, translation, type Instance, type Mat4, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { impactFx, type Hit, type World } from './impacts';
import { pieceType } from './shell';
import { CANNON_SPEED, type Mounted, type Structure } from './structure';

/**
 * Firing what is mounted on the shell. One weapon is selected at a time (action slots 2 to 5;
 * slot 1 is the claws, the crab's own). The trigger is held or released; each weapon makes of it
 * what it is: a cannon lobs a ball per pull, the guns stream tracers while held (the gatling
 * after spinning up), the flamethrower pours flame while held, the knocker swings per pull.
 * The guns hit at once (a ray against the world; the tracer lasts as long as it takes to get
 * there, and the hit's effect plays when it does); a cannonball flies, falls and hits what it
 * meets. Nothing takes damage yet.
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
}

const BALL: Vec = [0.12, 0.12, 0.13];
const TRACER_SPEED = 70;
const GUN_RANGE = 80;

export class Arsenal {
  /** The chosen weapon, an index into the structure's weapons (-1: none, the claws). */
  selected = -1;
  private held = false;
  private pulled = false;
  private readonly cooldown = new Map<Mounted, number>();
  private readonly spinRate = new Map<Mounted, number>();
  private readonly balls: Ball[] = [];
  private readonly pending: Pending[] = [];
  private clock = 0;
  private readonly ballMesh: Mesh;
  private readonly ballMaterial = material({ roughness: 0.5, metallic: 0.5 });

  constructor(private readonly renderer: Renderer, public structure: Structure, private readonly world: World) {
    const b = new MeshBuilder();
    const segs = 8;
    const rings = 5;
    const r = 0.075;
    const at = (i: number, j: number): Vec => {
      const th = (i / segs) * Math.PI * 2;
      const ph = -Math.PI / 2 + (j / rings) * Math.PI;
      return [r * Math.cos(ph) * Math.cos(th), r * Math.sin(ph), r * Math.cos(ph) * Math.sin(th)];
    };
    for (let j = 0; j < rings; j++) for (let i = 0; i < segs; i++) {
      if (j === 0) b.tri(at(i, 0), at(i, 1), at(i + 1, 1), BALL);
      else if (j === rings - 1) b.tri(at(i, j), at(i, rings), at(i + 1, j), BALL);
      else b.quad(at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j), BALL);
    }
    this.ballMesh = new Mesh(renderer.gl, b.build());
  }

  get weapon(): Mounted | null {
    return this.structure.weapons[this.selected] ?? null;
  }

  /** The trigger: down on press, up on release. */
  trigger(down: boolean): void {
    if (down && !this.held) this.pulled = true;
    this.held = down;
  }

  /**
   * A frame: turn the turrets toward `aimAt` (the crosshair's point in the world, the ground
   * marker), fire what the trigger asks of the chosen weapon straight out of its barrel, move the
   * balls, ease the kicks.
   */
  update(dt: number, body: Mat4, aimAt: Vec3 | null = null): void {
    this.clock += dt;
    this.structure.aim(body, aimAt, dt);
    const w = this.weapon;
    const pulled = this.pulled;
    this.pulled = false;
    // Gun hits whose tracers have arrived.
    for (let i = this.pending.length - 1; i >= 0; i--) {
      if (this.pending[i].at <= this.clock) {
        impactFx(this.renderer, this.pending[i].hit, 1);
        this.pending.splice(i, 1);
      }
    }
    for (const m of this.structure.weapons) {
      m.kick = Math.max(0, m.kick - dt * (m.piece.kind === 'knocker' ? 1.6 : 6));
      this.cooldown.set(m, Math.max(0, (this.cooldown.get(m) ?? 0) - dt));
      if (m.piece.kind === 'gatling') {
        const rate = this.spinRate.get(m) ?? 0;
        const want = m === w && this.held ? 1 : 0;
        const next = rate + (want - rate) * (1 - Math.exp(-(want ? 2.2 : 1.4) * dt));
        this.spinRate.set(m, next);
        m.spin += dt * next * 40;
      }
    }
    if (w) {
      // Straight out of the barrel, as posed last frame.
      const muzzle = w.muzzle;
      const facing = w.direction;
      const cool = this.cooldown.get(w) ?? 0;
      switch (w.piece.kind) {
        case 'cannon':
          if (pulled && cool <= 0) {
            this.cooldown.set(w, 1);
            w.kick = 1;
            this.ball(muzzle, [facing[0] * CANNON_SPEED, facing[1] * CANNON_SPEED, facing[2] * CANNON_SPEED]);
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 14, color: [1, 0.85, 0.5], colorTo: [1, 0.4, 0.1], speed: 5, dir: facing, cone: 0.35, life: 0.18, size: 0.14, fadeCurve: 'down', sizeCurve: 'peak', shape: 'disc' });
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 24, color: [0.55, 0.55, 0.55], colorTo: [0.3, 0.3, 0.3], speed: 2.5, dir: facing, cone: 0.5, up: 0.6, life: 1.6, size: 0.3, drag: 1.2, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'gatling': {
          const rate = this.spinRate.get(w) ?? 0;
          if (this.held && rate > 0.55 && cool <= 0) {
            this.cooldown.set(w, 1 / (8 + rate * 22));
            w.kick = 0.6;
            this.tracer(muzzle, facing, 0.03);
          }
          break;
        }
        case 'machinegun':
          if (this.held && cool <= 0) {
            this.cooldown.set(w, 0.11);
            w.kick = 1;
            this.tracer(muzzle, facing, 0.04);
          }
          break;
        case 'flamethrower':
          if (this.held) {
            w.kick = 0.3;
            this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: Math.max(1, Math.round(900 * dt)), color: [1, 0.8, 0.3], colorTo: [0.7, 0.12, 0.02], speed: 9, dir: facing, cone: 0.14, up: 0.6, life: 0.5, size: 0.14, gravity: -2.5, drag: 1.6, fadeCurve: 'ease-out', sizeCurve: 'up', shape: 'smoke' });
            if (Math.random() < dt * 30) this.renderer.particles.emit(muzzle[0] + facing[0] * 2, muzzle[1] + 0.4, muzzle[2] + facing[2] * 2, { count: 2, color: [0.25, 0.22, 0.2], colorTo: [0.1, 0.1, 0.1], speed: 0.8, up: 1.2, life: 1.8, size: 0.3, drag: 1, alpha: 0.4, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
          }
          break;
        case 'knocker':
          if (pulled && cool <= 0) {
            this.cooldown.set(w, 0.7);
            w.kick = 1;
          }
          break;
      }
    }
    // The balls fly, fall and hit what they meet: the ground in a burst of sand, a boulder in sparks and chips.
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.vel[1] -= 20 * dt;
      const next: Vec3 = [b.pos[0] + b.vel[0] * dt, b.pos[1] + b.vel[1] * dt, b.pos[2] + b.vel[2] * dt];
      b.life -= dt;
      const hit = this.world.segment(b.pos, next);
      if (hit || b.life <= 0) {
        if (hit) impactFx(this.renderer, hit, 4);
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

  /** What the chosen slot is called (for the HUD). */
  static nameOf(m: Mounted | null): string {
    return m ? pieceType(m.piece.kind).name : 'Claws';
  }

  private ball(at: Vec3, vel: Vec3): void {
    const instance: Instance = { mesh: this.ballMesh, model: translation(at[0], at[1], at[2]), material: this.ballMaterial };
    this.renderer.instances.push(instance);
    this.balls.push({ instance, pos: [at[0], at[1], at[2]], vel, life: 6 });
  }

  /** A gun's shot: a ray against the world, a tracer that lasts as long as the flight, the hit due when it lands. */
  private tracer(muzzle: Vec3, facing: Vec3, spread: number): void {
    const d: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + (Math.random() - 0.5) * spread, facing[2] + (Math.random() - 0.5) * spread];
    const l = Math.hypot(d[0], d[1], d[2]) || 1;
    const dir: Vec3 = [d[0] / l, d[1] / l, d[2] / l];
    const hit = this.world.raycast(muzzle, dir, GUN_RANGE);
    const flight = (hit ? hit.distance : GUN_RANGE) / TRACER_SPEED;
    if (hit) this.pending.push({ at: this.clock + flight, hit });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 1, color: [1, 0.95, 0.7], colorTo: [1, 0.7, 0.3], speed: TRACER_SPEED, dir, cone: 0, life: Math.max(0.02, flight), size: 0.11, stretch: 12, vary: 0, fadeCurve: 'none', sizeCurve: 'none', shape: 'spark' });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 3, color: [1, 0.8, 0.4], colorTo: [1, 0.4, 0.1], speed: 2, dir: facing, cone: 0.6, life: 0.08, size: 0.1, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
  }

}
