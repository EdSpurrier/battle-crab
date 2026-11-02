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

/** How much each weapon takes off per hit (the flame and the claws per second of contact, the knocker per swing). */
export const DAMAGE = { cannon: 30, gatling: 3, machinegun: 4, flamethrower: 14, knocker: 25, claw: 12 } as const;

/** A crab's box for shots to meet: round the body and shell, turned with it. */
export function crabBox(c: Combatant): Obstacle {
  const b = c.crab.body;
  return { center: [b[12], b[13] + 0.25, b[14]], half: [0.85, 0.75, 0.95], yaw: Math.atan2(b[8], b[10]), surface: 'shell', owner: c };
}
