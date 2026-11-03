import type { Vec3 } from 'gridfall-engine';
import type { Crab } from './crab';
import type { Obstacle } from './impacts';
import type { Pushable } from './physics';

/** What a hit was (a killing one picks the death: see Crab.collapse): a bullet, a heavy blow (cannonball, knocker, spiky ball), a burst, flame, a nip. */
export type HitKind = 'bullet' | 'blow' | 'blast' | 'flame' | 'nip';

/** Anyone who can be hit: the player, an opponent. */
export interface Combatant extends Pushable {
  readonly crab: Crab;
  readonly position: Vec3;
  health: number;
  readonly maxHealth: number;
  readonly alive: boolean;
  /** Take `amount` off the health (a `kind` of hit from `from`); what happens at zero is the owner's business. */
  hurt(amount: number, kind?: HitKind, from?: Vec3): void;
}

/** How much each weapon takes off per hit (the flame per second of contact; the knocker at full swing speed; the claws by their kind, see shell.ts CLAWS). */
export const DAMAGE = { cannon: 70, gatling: 3, machinegun: 4, flamethrower: 14, knocker: 45, spikeball: 40, fireworks: 10, grenade: 40, claw: 20 } as const;

/** A crab's box for shots to meet: round the body and shell, turned with it. */
export function crabBox(c: Combatant): Obstacle {
  const b = c.crab.body;
  // The body matrix carries the crab's scale in its columns: the box grows with it.
  const s = Math.hypot(b[0], b[1], b[2]) || 1;
  return { center: [b[12], b[13] + 0.25 * s, b[14]], half: [0.85 * s, Math.max(0.75 * s, 0.6), 0.95 * s], yaw: Math.atan2(b[8], b[10]), surface: 'shell', owner: c };
}
