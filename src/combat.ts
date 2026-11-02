import type { Vec3 } from 'gridfall-engine';
import type { Crab } from './crab';
import type { Obstacle } from './impacts';

/** Anyone who can be hit: the player, an opponent. */
export interface Combatant {
  readonly crab: Crab;
  readonly position: Vec3;
  health: number;
  readonly maxHealth: number;
  readonly alive: boolean;
  /** Take `amount` off the health; what happens at zero is the owner's business. */
  hurt(amount: number): void;
}

/** How much each weapon takes off per hit (the flame per second of contact; the knocker at full swing speed; the claws by their kind, see shell.ts CLAWS). */
export const DAMAGE = { cannon: 70, gatling: 3, machinegun: 4, flamethrower: 14, knocker: 45, spikeball: 40, fireworks: 10, grenade: 40, claw: 20 } as const;

/** A crab's box for shots to meet: round the body and shell, turned with it. */
export function crabBox(c: Combatant): Obstacle {
  const b = c.crab.body;
  return { center: [b[12], b[13] + 0.25, b[14]], half: [0.85, 0.75, 0.95], yaw: Math.atan2(b[8], b[10]), surface: 'shell', owner: c };
}
