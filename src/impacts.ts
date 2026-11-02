import type { Renderer, Vec3 } from 'gridfall-engine';

/**
 * What a shot can hit (the ground, the boulders) and what it looks like when it does. Rays are
 * marched against the heightfield and slab-tested against the boulders as turned boxes; a hit
 * says where, which way the surface faces and what it is made of, so the effect fits: sand puffs
 * and a dust ring on the beach, sparks and stone chips on rock.
 */

export type Surface = 'sand' | 'rock' | 'shell' | 'wood';

export interface Obstacle {
  center: Vec3;
  /** Half the size along the box's own x, y, z. */
  half: Vec3;
  /** Turn about +y, radians. */
  yaw: number;
  surface: Surface;
  /** Who this is (a crab, or a piece of one's structure): a hit on it hurts them. */
  owner?: unknown;
  /** Whose it is when `owner` is a piece: a shooter's own pieces are skipped like their own body. */
  self?: unknown;
}

export interface Hit {
  point: Vec3;
  normal: Vec3;
  surface: Surface;
  distance: number;
  owner?: unknown;
}

export class World {
  /** What stands still (boulders). */
  readonly obstacles: Obstacle[] = [];
  /** What moves (the crabs): set afresh each frame. */
  moving: Obstacle[] = [];

  constructor(private readonly groundHeight: (x: number, z: number) => number) {}

  /** The sand's height at x, z. */
  heightAt(x: number, z: number): number {
    return this.groundHeight(x, z);
  }

  /** The first thing a ray meets within `maxDistance` (never `ignore`'s own box), or null. */
  raycast(from: Vec3, dir: Vec3, maxDistance: number, ignore?: unknown): Hit | null {
    let best: Hit | null = this.groundHit(from, dir, maxDistance);
    for (const list of [this.obstacles, this.moving]) {
      for (const o of list) {
        if (ignore !== undefined && (o.owner === ignore || o.self === ignore)) continue;
        const h = this.boxHit(o, from, dir, best ? best.distance : maxDistance);
        if (h) best = h;
      }
    }
    return best;
  }

  /** The first thing between two points (a moving ball's step), or null. */
  segment(from: Vec3, to: Vec3, ignore?: unknown): Hit | null {
    const d: Vec3 = [to[0] - from[0], to[1] - from[1], to[2] - from[2]];
    const len = Math.hypot(d[0], d[1], d[2]);
    if (len < 1e-6) return null;
    return this.raycast(from, [d[0] / len, d[1] / len, d[2] / len], len, ignore);
  }

  /** The owners of the moving boxes within `range` of `from` and within `halfAngle` of `dir` (a flame's tongue, a swing's reach), not `ignore`. */
  inCone(from: Vec3, dir: Vec3, range: number, halfAngle: number, ignore?: unknown): unknown[] {
    const out: unknown[] = [];
    const cosA = Math.cos(halfAngle);
    for (const o of this.moving) {
      if (o.owner === undefined || o.owner === ignore || o.self === ignore) continue;
      const d: Vec3 = [o.center[0] - from[0], o.center[1] - from[1], o.center[2] - from[2]];
      const l = Math.hypot(d[0], d[1], d[2]);
      const reach = Math.max(o.half[0], o.half[2]);
      if (l - reach > range) continue;
      if (l < reach) {
        out.push(o.owner);
        continue;
      }
      if ((d[0] * dir[0] + d[1] * dir[1] + d[2] * dir[2]) / l >= cosA - reach / Math.max(l, 1e-3)) out.push(o.owner);
    }
    return out;
  }

  /** The moving boxes (and their owners) within `range` of a point, not `ignore`'s: a swing's reach, a burst. */
  near(at: Vec3, range: number, ignore?: unknown): Obstacle[] {
    const out: Obstacle[] = [];
    for (const o of this.moving) {
      if (o.owner === undefined || o.owner === ignore || o.self === ignore) continue;
      const d = Math.hypot(o.center[0] - at[0], o.center[1] - at[1], o.center[2] - at[2]);
      if (d - Math.max(o.half[0], o.half[1], o.half[2]) <= range) out.push(o);
    }
    return out;
  }

  private groundHit(from: Vec3, dir: Vec3, maxDistance: number): Hit | null {
    const at = (t: number): Vec3 => [from[0] + dir[0] * t, from[1] + dir[1] * t, from[2] + dir[2] * t];
    const under = (p: Vec3) => p[1] <= this.groundHeight(p[0], p[2]);
    if (under(from)) return null;
    let t0 = 0;
    const step = 0.2;
    for (let t = step; t <= maxDistance + step; t += step) {
      const tt = Math.min(t, maxDistance);
      if (under(at(tt))) {
        let lo = t0;
        let hi = tt;
        for (let i = 0; i < 10; i++) {
          const m = (lo + hi) / 2;
          if (under(at(m))) hi = m;
          else lo = m;
        }
        const p = at(hi);
        p[1] = this.groundHeight(p[0], p[2]);
        // The slope from the heights round the point.
        const e = 0.25;
        const nx = this.groundHeight(p[0] - e, p[2]) - this.groundHeight(p[0] + e, p[2]);
        const nz = this.groundHeight(p[0], p[2] - e) - this.groundHeight(p[0], p[2] + e);
        const nl = Math.hypot(nx, 2 * e, nz);
        return { point: p, normal: [nx / nl, (2 * e) / nl, nz / nl], surface: 'sand', distance: hi };
      }
      t0 = tt;
      if (tt >= maxDistance) break;
    }
    return null;
  }

  /** A slab test in the box's own frame. */
  private boxHit(o: Obstacle, from: Vec3, dir: Vec3, maxDistance: number): Hit | null {
    const c = Math.cos(-o.yaw);
    const s = Math.sin(-o.yaw);
    const local = (p: Vec3, point: boolean): Vec3 => {
      const x = point ? p[0] - o.center[0] : p[0];
      const y = point ? p[1] - o.center[1] : p[1];
      const z = point ? p[2] - o.center[2] : p[2];
      return [x * c + z * s, y, -x * s + z * c];
    };
    const p = local(from, true);
    const d = local(dir, false);
    let tmin = 0;
    let tmax = maxDistance;
    let axis = -1;
    let sign = 1;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(d[i]) < 1e-9) {
        if (Math.abs(p[i]) > o.half[i]) return null;
        continue;
      }
      let t1 = (-o.half[i] - p[i]) / d[i];
      let t2 = (o.half[i] - p[i]) / d[i];
      let sgn = -1;
      if (t1 > t2) {
        [t1, t2] = [t2, t1];
        sgn = 1;
      }
      if (t1 > tmin) {
        tmin = t1;
        axis = i;
        sign = sgn;
      }
      tmax = Math.min(tmax, t2);
      if (tmin > tmax) return null;
    }
    if (axis < 0 || tmin <= 0 || tmin > maxDistance) return null;
    const nLocal: Vec3 = [0, 0, 0];
    nLocal[axis] = sign;
    // Back to the world: the inverse turn.
    const cw = Math.cos(o.yaw);
    const sw = Math.sin(o.yaw);
    const n: Vec3 = [nLocal[0] * cw + nLocal[2] * sw, nLocal[1], -nLocal[0] * sw + nLocal[2] * cw];
    return { point: [from[0] + dir[0] * tmin, from[1] + dir[1] * tmin, from[2] + dir[2] * tmin], normal: n, surface: o.surface, distance: tmin, owner: o.owner };
  }
}

/** A crab coming apart: a burst of shell and a cloud. */
export function wreckFx(renderer: Renderer, at: Vec3): void {
  const p = renderer.particles;
  p.emit(at[0], at[1], at[2], { count: 10, color: [1, 0.9, 0.7], colorTo: [1, 0.5, 0.2], speed: 1, life: 0.14, size: 1.4, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
  p.emit(at[0], at[1], at[2], { count: 70, color: [0.6, 0.45, 0.25], colorTo: [0.4, 0.28, 0.14], speed: 7, up: 4, life: 1.4, size: 0.1, gravity: 12, shape: 'disc' });
  p.emit(at[0], at[1], at[2], { count: 30, color: [0.85, 0.2, 0.1], colorTo: [0.5, 0.08, 0.03], speed: 6, up: 5, life: 1.2, size: 0.09, gravity: 12, shape: 'disc' });
  p.emit(at[0], at[1], at[2], { count: 50, color: [1, 0.85, 0.4], colorTo: [1, 0.4, 0.1], speed: 9, up: 3, life: 0.5, size: 0.05, gravity: 10, stretch: 5, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
  p.emit(at[0], at[1] + 0.3, at[2], { count: 40, color: [0.4, 0.38, 0.36], colorTo: [0.2, 0.2, 0.2], speed: 1.5, up: 2.5, life: 2.6, size: 0.6, gravity: -0.3, drag: 0.8, alpha: 0.6, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
}

/** The look of a hit: `size` 1 for a bullet, about 4 for a cannonball. */
/** What a built piece is made of, for the debris it sheds. */
export type Stuff = 'wood' | 'metal' | 'stone';

/**
 * A piece shedding what it is made of: a blow (`size` about 1, along `dir`) or the whole piece breaking up
 * (`size` 3, every way). Wood: splinters, shards and chunks; metal: sparks, shards, bolts; stone: chips and grit
 * in a cloud of dust. Everything falls under gravity and settles for a moment on the sand.
 */
export function shatter(renderer: Renderer, at: Vec3, stuff: Stuff, size: number, dir?: Vec3): void {
  const [x, y, z] = at;
  const p = renderer.particles;
  // No direction: the emitter flings every way (a piece breaking up); with one, a wide cone about it.
  const all = !dir;
  const d = dir;
  const cone = 0.75;
  const up = all ? 1.2 : 0.3;
  const n = Math.round(14 * size);
  if (stuff === 'wood') {
    // Long splinters, flat shards that tumble, a few fat chunks, and a cloud of sawdust.
    p.emit(x, y, z, { count: n * 2, color: [0.62, 0.44, 0.2], colorTo: [0.42, 0.27, 0.1], speed: 4 + 2 * size, dir: d, cone, up, life: 1.1 + 0.2 * size, size: 0.05 + 0.02 * size, gravity: 12, drag: 0.4, stretch: 4, shape: 'spark' });
    p.emit(x, y, z, { count: n, color: [0.74, 0.58, 0.36], colorTo: [0.5, 0.36, 0.2], speed: 3 + 1.5 * size, dir: d, cone, up, life: 1.3 + 0.2 * size, size: 0.1 + 0.03 * size, gravity: 10, drag: 0.6, shape: 'disc' });
    p.emit(x, y, z, { count: Math.round(n * 0.4), color: [0.45, 0.3, 0.14], colorTo: [0.36, 0.23, 0.1], speed: 2.5 + size, dir: d, cone, up, life: 1.6, size: 0.16 + 0.05 * size, gravity: 13, drag: 0.5, shape: 'disc' });
    p.emit(x, y, z, { count: Math.round(n * 0.6), color: [0.8, 0.7, 0.5], colorTo: [0.6, 0.52, 0.38], speed: 1.5 + size, dir: d, cone, up: up + 0.3, life: 1 + 0.2 * size, size: 0.2 + 0.08 * size, drag: 1.5, alpha: 0.45, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  } else if (stuff === 'metal') {
    // Sparks that bounce, dark shards, a few bolts and rivets, grey smoke.
    p.emit(x, y, z, { count: n * 2, color: [1, 0.92, 0.6], colorTo: [1, 0.45, 0.1], speed: 6 + 2 * size, dir: d, cone, up, life: 0.5 + 0.1 * size, size: 0.05, gravity: 12, drag: 0.3, stretch: 5, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
    p.emit(x, y, z, { count: n, color: [0.3, 0.3, 0.33], colorTo: [0.16, 0.16, 0.18], speed: 3 + 1.5 * size, dir: d, cone, up, life: 1.4, size: 0.08 + 0.03 * size, gravity: 13, drag: 0.4, stretch: 2, shape: 'spark' });
    p.emit(x, y, z, { count: Math.round(n * 0.4), color: [0.42, 0.42, 0.45], colorTo: [0.2, 0.2, 0.22], speed: 2.5 + size, dir: d, cone, up, life: 1.6, size: 0.07 + 0.02 * size, gravity: 14, shape: 'disc' });
    p.emit(x, y, z, { count: Math.round(n * 0.5), color: [0.4, 0.4, 0.4], colorTo: [0.22, 0.22, 0.22], speed: 1.2 + size, dir: d, cone, up: up + 0.4, life: 1.4 + 0.3 * size, size: 0.22 + 0.1 * size, drag: 1.3, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  } else {
    // Chips and grit, a few lumps, and a thick dust cloud that hangs.
    p.emit(x, y, z, { count: n * 2, color: [0.5, 0.49, 0.47], colorTo: [0.32, 0.32, 0.31], speed: 4 + 2 * size, dir: d, cone, up, life: 1 + 0.2 * size, size: 0.05 + 0.02 * size, gravity: 13, drag: 0.4, shape: 'disc' });
    p.emit(x, y, z, { count: Math.round(n * 0.5), color: [0.42, 0.41, 0.4], colorTo: [0.3, 0.3, 0.29], speed: 2.5 + size, dir: d, cone, up, life: 1.6, size: 0.14 + 0.05 * size, gravity: 14, drag: 0.5, shape: 'disc' });
    p.emit(x, y, z, { count: n, color: [0.6, 0.58, 0.55], colorTo: [0.42, 0.41, 0.4], speed: 1.5 + size, dir: d, cone, up: up + 0.3, life: 1.6 + 0.4 * size, size: 0.28 + 0.1 * size, drag: 1.4, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  }
}

export function impactFx(renderer: Renderer, hit: Hit, size: number): void {
  const [x, y, z] = hit.point;
  const n = hit.normal;
  const px = x + n[0] * 0.03;
  const py = y + n[1] * 0.03;
  const pz = z + n[2] * 0.03;
  const p = renderer.particles;
  const big = size >= 2;
  if (hit.surface === 'sand') {
    // Sand thrown up along the surface's normal with a few grains flung further, a dust ring spreading flat, and for a big hit a column of dust.
    p.emit(px, py, pz, { count: Math.round(16 * size), color: [0.8, 0.7, 0.5], colorTo: [0.62, 0.54, 0.38], speed: 2.2 * Math.sqrt(size), dir: n, cone: 0.7, up: 0.8, life: 0.6 + 0.2 * size, size: 0.22 + 0.08 * size, gravity: 4, drag: 0.8, alpha: 1, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
    p.emit(px, py, pz, { count: Math.round(8 * size), color: [0.62, 0.52, 0.36], colorTo: [0.5, 0.42, 0.3], speed: 4 + 1.5 * size, dir: n, cone: 0.6, life: 0.7 + 0.2 * size, size: 0.05 + 0.01 * size, gravity: 14, shape: 'disc' });
    p.emit(px, py + 0.03, pz, { count: Math.round(10 * size), color: [0.78, 0.7, 0.5], colorTo: [0.72, 0.64, 0.47], speed: 2.5 + 1.2 * size, up: 0.1, life: 0.6 + 0.1 * size, size: 0.2 + 0.05 * size, drag: 2.5, alpha: 0.75, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
    if (big) p.emit(px, py + 0.2, pz, { count: 24, color: [0.7, 0.64, 0.5], colorTo: [0.55, 0.5, 0.42], speed: 1.2, up: 3.5, life: 2.2, size: 0.55, gravity: -0.4, drag: 0.9, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  } else if (hit.surface === 'wood') {
    // Wood: a shower of splinters and chunks flung along the normal, and a puff of dust.
    shatter(renderer, [px, py, pz], 'wood', size, n);
    p.emit(px, py, pz, { count: Math.round(4 * size), color: [0.55, 0.45, 0.32], colorTo: [0.35, 0.3, 0.22], speed: 0.8, dir: n, cone: 1, up: 0.4, life: 0.8 + 0.2 * size, size: 0.16 + 0.06 * size, drag: 1.2, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  } else if (hit.surface === 'shell') {
    // A crab: a flash, bits of shell flung off along the normal, a few sparks off the metal, a puff.
    p.emit(px, py, pz, { count: big ? 6 : 2, color: [1, 0.9, 0.7], colorTo: [1, 0.5, 0.2], speed: 0.5, life: big ? 0.1 : 0.07, size: big ? 0.6 : 0.26, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
    p.emit(px, py, pz, { count: Math.round(9 * size), color: [0.6, 0.45, 0.25], colorTo: [0.4, 0.28, 0.14], speed: 3 + 1.2 * size, dir: n, cone: 0.8, life: 0.9, size: 0.06 + 0.02 * size, gravity: 10, shape: 'disc' });
    p.emit(px, py, pz, { count: Math.round(6 * size), color: [1, 0.9, 0.5], colorTo: [1, 0.4, 0.1], speed: 5 + size, dir: n, cone: 0.9, life: 0.35, size: 0.045, gravity: 12, stretch: 4, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
    p.emit(px, py, pz, { count: Math.round(3 * size), color: [0.6, 0.55, 0.5], colorTo: [0.35, 0.32, 0.3], speed: 0.9, dir: n, cone: 1, up: 0.5, life: 0.9 + 0.2 * size, size: 0.18 + 0.08 * size, drag: 1.2, alpha: 0.5, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  } else {
    // Rock: a flash, bright sparks that bounce off along the normal, grey chips, and a wisp of smoke.
    p.emit(px, py, pz, { count: big ? 8 : 3, color: [1, 0.95, 0.8], colorTo: [1, 0.6, 0.2], speed: 0.5, life: big ? 0.12 : 0.08, size: big ? 0.7 : 0.3, fadeCurve: 'down', sizeCurve: 'down', shape: 'disc' });
    p.emit(px, py, pz, { count: Math.round(14 * size), color: [1, 0.9, 0.5], colorTo: [1, 0.4, 0.1], speed: 5 + 2 * size, dir: n, cone: 0.9, life: 0.4 + 0.1 * size, size: 0.05, gravity: 12, stretch: 5, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
    p.emit(px, py, pz, { count: Math.round(8 * size), color: [0.45, 0.44, 0.42], colorTo: [0.3, 0.3, 0.29], speed: 2.5 + size, dir: n, cone: 0.8, life: 0.9, size: 0.06 + 0.02 * size, gravity: 10, shape: 'disc' });
    p.emit(px, py, pz, { count: Math.round(4 * size), color: [0.5, 0.5, 0.5], colorTo: [0.3, 0.3, 0.3], speed: 0.9, dir: n, cone: 1, up: 0.5, life: 1 + 0.3 * size, size: 0.2 + 0.1 * size, drag: 1.2, alpha: 0.55, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
  }
}
