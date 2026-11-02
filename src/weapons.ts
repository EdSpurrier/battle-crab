import { Mesh, MeshBuilder, material, transformPoint, translation, type Instance, type Mat4, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { pieceType } from './shell';
import type { Mounted, Structure } from './structure';

/**
 * Firing what is mounted on the shell. One weapon is selected at a time (action slots 2 to 5;
 * slot 1 is the claws, the crab's own). The trigger is held or released; each weapon makes of it
 * what it is: a cannon lobs a ball per pull, the guns stream tracers while held (the gatling
 * after spinning up), the flamethrower pours flame while held, the knocker swings per pull.
 * Shots are looks for now: nothing is hit yet.
 */

interface Ball {
  instance: Instance;
  pos: Vec3;
  vel: Vec3;
  life: number;
}

const BALL: Vec = [0.12, 0.12, 0.13];

export class Arsenal {
  /** The chosen weapon, an index into the structure's weapons (-1: none, the claws). */
  selected = -1;
  private held = false;
  private pulled = false;
  private readonly cooldown = new Map<Mounted, number>();
  private readonly spinRate = new Map<Mounted, number>();
  private readonly balls: Ball[] = [];
  private readonly ballMesh: Mesh;
  private readonly ballMaterial = material({ roughness: 0.5, metallic: 0.5 });

  constructor(private readonly renderer: Renderer, public structure: Structure, private readonly groundHeight: (x: number, z: number) => number) {
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

  /** A frame: fire what the trigger asks of the chosen weapon, move the balls, ease the kicks. */
  update(dt: number, body: Mat4): void {
    const w = this.weapon;
    const pulled = this.pulled;
    this.pulled = false;
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
      const muzzle = this.point(body, w.muzzleLocal);
      const facing = this.direction(body, w.facingLocal);
      const cool = this.cooldown.get(w) ?? 0;
      switch (w.piece.kind) {
        case 'cannon':
          if (pulled && cool <= 0) {
            this.cooldown.set(w, 1);
            w.kick = 1;
            this.ball(muzzle, [facing[0] * 16, 3 + facing[1] * 16, facing[2] * 16]);
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
    // The balls fly, fall and land in a puff of sand.
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const b = this.balls[i];
      b.vel[1] -= 20 * dt;
      b.pos[0] += b.vel[0] * dt;
      b.pos[1] += b.vel[1] * dt;
      b.pos[2] += b.vel[2] * dt;
      b.life -= dt;
      const g = this.groundHeight(b.pos[0], b.pos[2]);
      if (b.pos[1] <= g + 0.07 || b.life <= 0) {
        this.renderer.particles.emit(b.pos[0], g + 0.1, b.pos[2], { count: 40, color: [0.75, 0.66, 0.46], colorTo: [0.6, 0.52, 0.36], speed: 3, up: 3.5, life: 0.9, size: 0.22, gravity: 6, drag: 0.8, alpha: 0.8, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
        const list = this.renderer.instances;
        const k = list.indexOf(b.instance);
        if (k >= 0) list.splice(k, 1);
        this.balls.splice(i, 1);
        continue;
      }
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

  private tracer(muzzle: Vec3, facing: Vec3, spread: number): void {
    const dir: Vec3 = [facing[0] + (Math.random() - 0.5) * spread, facing[1] + (Math.random() - 0.5) * spread, facing[2] + (Math.random() - 0.5) * spread];
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 1, color: [1, 0.9, 0.5], colorTo: [1, 0.6, 0.2], speed: 70, dir, cone: 0, life: 0.35, size: 0.05, stretch: 10, vary: 0, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
    this.renderer.particles.emit(muzzle[0], muzzle[1], muzzle[2], { count: 3, color: [1, 0.8, 0.4], colorTo: [1, 0.4, 0.1], speed: 2, dir: facing, cone: 0.6, life: 0.08, size: 0.1, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
  }

  private point(body: Mat4, local: [number, number, number]): Vec3 {
    const p = transformPoint(body, local);
    return [p[0], p[1], p[2]];
  }

  private direction(body: Mat4, local: [number, number, number]): Vec3 {
    // A direction through the rotation only, lifted a little so shots arc rather than skim the sand.
    const d: Vec3 = [body[0] * local[0] + body[4] * local[1] + body[8] * local[2], body[1] * local[0] + body[5] * local[1] + body[9] * local[2] + 0.08, body[2] * local[0] + body[6] * local[1] + body[10] * local[2]];
    const l = Math.hypot(d[0], d[1], d[2]) || 1;
    return [d[0] / l, d[1] / l, d[2] / l];
  }
}
