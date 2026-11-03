import { multiply, rotationX, rotationY, scaling, translation, type Instance, type PointLight, type Renderer, type Vec3 } from 'gridfall-engine';
import { CELL, type PieceKind } from './shell';

/**
 * What comes off a shell and stays on the beach. A piece shot off (or shed by a cracked crab) tumbles
 * to the sand and lies there. Rubble (planks, beams, joints) sinks away after a while. A weapon
 * rights itself, glows softly, and can be picked up by a crab with a free slot by walking over it.
 * The pieces' meshes are the structure's; this takes them over and disposes of them in the end.
 */

interface Item {
  /** What it is (null: rubble, not worth picking up). */
  kind: PieceKind | null;
  fixed: Instance;
  moving?: { instance: Instance; pivot: [number, number, number] };
  pos: Vec3;
  vel: Vec3;
  spin: number;
  yaw: number;
  /** Seconds since it came to rest (-1: still tumbling). */
  rest: number;
  /** How far it has righted itself (a weapon), 0..1. */
  upright: number;
  /** Rubble: seconds left before it sinks; sinking, how far down it has gone. */
  left: number;
  sunk: number;
  phase: number;
  /** Drawn this many times its mesh's size; rests this high over the sand. */
  scale: number;
  lift: number;
}

/** A loose bit's own size, rest height and how long it lies (rubble's defaults otherwise). */
export interface LootOptions {
  scale?: number;
  lift?: number;
  seconds?: number;
}

const GRAVITY = 20;
/** Rubble lies this long, then sinks into the sand; at most this many loose weapons lie about (the oldest sink). */
const RUBBLE_SECONDS = 25;
const MAX_WEAPONS_LYING = 12;
const H = CELL / 2;

export class Loot {
  private readonly items: Item[] = [];

  constructor(private readonly renderer: Renderer, private readonly groundHeight: (x: number, z: number) => number) {}

  /** A piece coming off at `pos` (its instance's origin) with velocity `vel`; `kind` null for rubble. */
  add(kind: PieceKind | null, fixed: Instance, moving: Item['moving'], pos: Vec3, vel: Vec3, options: LootOptions = {}): void {
    this.items.push({ kind, fixed, moving, pos: [pos[0], pos[1], pos[2]], vel: [vel[0], vel[1], vel[2]], spin: Math.random() * Math.PI * 2, yaw: Math.random() * Math.PI * 2, rest: -1, upright: 0, left: options.seconds ?? RUBBLE_SECONDS, sunk: 0, phase: Math.random() * 7, scale: options.scale ?? 1, lift: options.lift ?? H });
    const weapons = this.items.filter((i) => i.kind);
    if (weapons.length > MAX_WEAPONS_LYING) {
      const oldest = weapons[0];
      oldest.kind = null;
      oldest.left = 0;
    }
  }

  /** A burst at `at`: everything lying within `radius` is flung outward and up, the harder the nearer. */
  blast(at: Vec3, radius: number, strength: number): void {
    for (const it of this.items) {
      const dx = it.pos[0] - at[0];
      const dz = it.pos[2] - at[2];
      const d = Math.hypot(dx, it.pos[1] - at[1], dz);
      if (d >= radius) continue;
      const k = (1 - d / radius) * strength;
      const flat = Math.hypot(dx, dz) || 1;
      it.vel[0] += (dx / flat) * k;
      it.vel[1] += 0.6 * k;
      it.vel[2] += (dz / flat) * k;
      it.rest = -1;
      it.upright = 0;
      it.spin += (Math.random() - 0.5) * 2;
    }
  }

  /** How many weapons lie about. */
  get lying(): number {
    return this.items.filter((i) => i.kind).length;
  }

  /**
   * A frame: everything tumbles, lands, rights itself or sinks. A crab at `at` picks up a weapon within
   * `reach` when `take(kind)` says it fitted; returns the kind of a weapon in reach that did not fit (for a notice).
   */
  update(dt: number, at: Vec3 | null, reach: number, take: (kind: PieceKind) => boolean): PieceKind | null {
    let refused: PieceKind | null = null;
    for (let k = this.items.length - 1; k >= 0; k--) {
      const it = this.items[k];
      const g = this.groundHeight(it.pos[0], it.pos[2]) + it.lift;
      if (it.rest < 0) {
        it.vel[1] -= GRAVITY * dt;
        it.pos[0] += it.vel[0] * dt;
        it.pos[1] += it.vel[1] * dt;
        it.pos[2] += it.vel[2] * dt;
        it.spin += dt * 3;
        if (it.pos[1] < g) {
          it.pos[1] = g;
          it.vel = [it.vel[0] * 0.5, -it.vel[1] * 0.3, it.vel[2] * 0.5];
          if (Math.abs(it.vel[1]) < 1.2) {
            it.vel = [0, 0, 0];
            it.rest = 0;
          }
        }
      } else {
        it.rest += dt;
        it.pos[1] = g;
        if (it.kind) {
          // A weapon: it rights itself and bobs a little, so it is seen.
          it.upright = Math.min(1, it.upright + dt * 2.5);
          it.phase += dt * 2;
          if (at && it.upright >= 1 && Math.hypot(at[0] - it.pos[0], at[2] - it.pos[2]) < reach) {
            if (take(it.kind)) {
              this.renderer.particles.emit(it.pos[0], it.pos[1] + 0.3, it.pos[2], { count: 24, color: [0.7, 1, 1], colorTo: [0.3, 0.9, 1], speed: 2.5, up: 2, life: 0.6, size: 0.08, gravity: 3, fadeCurve: 'down', shape: 'spark' });
              this.remove(k);
              continue;
            }
            refused = it.kind;
          }
        } else {
          // Rubble: lies a while, then sinks into the sand and is gone.
          it.left -= dt;
          if (it.left <= 0) {
            it.sunk += dt * 0.5;
            if (it.sunk >= 1) {
              this.remove(k);
              continue;
            }
          }
        }
      }
      this.pose(it);
    }
    return refused;
  }

  /** A soft pulsing light over each weapon lying about. */
  lights(): PointLight[] {
    const out: PointLight[] = [];
    for (const it of this.items) {
      if (!it.kind || it.rest < 0) continue;
      out.push({ x: it.pos[0], y: it.pos[1] + 0.9, z: it.pos[2], radius: 3, r: 0.3, g: 0.95, b: 1, intensity: 5 + 3 * Math.sin(it.phase) });
    }
    return out;
  }

  private pose(it: Item): void {
    const bob = it.kind ? 0.06 * (1 + Math.sin(it.phase)) * it.upright : 0;
    const sink = it.sunk * (it.lift * 2 + 0.4);
    const t = translation(it.pos[0], it.pos[1] + bob - sink, it.pos[2]);
    // Tumbling: turning every way; at rest, a weapon eases to standing on its base, rubble lies as it fell.
    const tumble = multiply(rotationY(it.spin), rotationX(it.spin * 0.7));
    const stand = rotationY(it.yaw);
    const r = it.kind && it.upright > 0 ? (it.upright >= 1 ? stand : multiply(rotationY(it.yaw), rotationX(it.spin * 0.7 * (1 - it.upright)))) : tumble;
    const m = it.scale === 1 ? multiply(t, r) : multiply(multiply(t, r), scaling(it.scale, it.scale, it.scale));
    (it.fixed.model as Float32Array).set(m);
    if (it.moving) (it.moving.instance.model as Float32Array).set(multiply(m, translation(it.moving.pivot[0], it.moving.pivot[1], it.moving.pivot[2])));
  }

  private remove(k: number): void {
    const it = this.items[k];
    this.items.splice(k, 1);
    const gone = new Set<Instance>([it.fixed, ...(it.moving ? [it.moving.instance] : [])]);
    const list = this.renderer.instances;
    let n = 0;
    for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[n++] = list[i];
    list.length = n;
    for (const i of gone) i.mesh.dispose();
  }

  /** Everything off the beach. */
  dispose(): void {
    for (let k = this.items.length - 1; k >= 0; k--) this.remove(k);
  }
}
