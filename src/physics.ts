import type { Vec3 } from 'gridfall-engine';

/**
 * The beach's physics, such as it is: nothing simulates rigid bodies in full, but what is hit is
 * pushed. An impulse is a change of velocity for a body of mass one (world units a second); a
 * heavier crab (a loaded shell, a big kind) takes less of it. Blows carry the impulse of what struck
 * (a cannonball along its flight, the knocker's ball by its swing); a burst pushes everything round
 * it outward and a little up, the harder the nearer. Pushable things: the crabs (alive, they stagger;
 * cracked, the corpse slides, hops and tumbles), the loot lying about.
 */

export interface Pushable {
  /** Take an impulse (units a second, for mass one; the body divides by its mass). */
  shove(impulse: Vec3): void;
}

export const isPushable = (o: unknown): o is Pushable => !!o && typeof o === 'object' && 'shove' in o && typeof (o as Pushable).shove === 'function';

/**
 * The impulse a burst at `at` of `strength` reaching `radius` gives something whose centre is `c`:
 * outward (mostly along the ground) and up, falling off to nothing at the edge; null when out of reach.
 */
export function radialImpulse(at: Vec3, c: Vec3, radius: number, strength: number): Vec3 | null {
  const dx = c[0] - at[0];
  const dy = c[1] - at[1];
  const dz = c[2] - at[2];
  const d = Math.hypot(dx, dy, dz);
  if (d >= radius) return null;
  const k = (1 - d / radius) * strength;
  // Something right on top of the burst goes straight up.
  const flat = Math.hypot(dx, dz);
  const ux = flat > 1e-3 ? dx / flat : 0;
  const uz = flat > 1e-3 ? dz / flat : 0;
  return [ux * k, 0.45 * k + Math.max(0, dy) * 0.1, uz * k];
}

/** `v` scaled to length `l` (zero stays zero). */
export function withLength(v: Vec3, l: number): Vec3 {
  const n = Math.hypot(v[0], v[1], v[2]);
  return n < 1e-6 ? [0, 0, 0] : [(v[0] / n) * l, (v[1] / n) * l, (v[2] / n) * l];
}
