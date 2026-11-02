import type { ClawKind, PieceKind, ShellId } from './shell';

/**
 * The kinds of opponent. The battle fields `random` crabs (a random shell, build and claws); Bullet
 * Hell fields the rest in waves, each playing differently: marchers swarm and nip, gunners hang
 * back and shoot, skirmishers dart in with flame, bruisers lumber in under heavy guns, rocketeers
 * shell from afar, and a boss brings all of it at once.
 */
export type EnemyKindId = 'random' | 'marcher' | 'gunner' | 'skirmisher' | 'bruiser' | 'rocketeer' | 'boss';

export interface EnemyKind {
  id: EnemyKindId;
  name: string;
  /** The whole crab, body and shell, this many times the usual size. */
  scale: number;
  /** Armour and walking speed as multiples of the shell's. */
  armor: number;
  speed: number;
  /** The distance it likes to keep (0: it charges), and how near it must be to fire. */
  keep: number;
  range: number;
  /** Fires this long, rests this long. */
  burst: number;
  rest: number;
  /** Its weapons (none: it fights with its claws), fired all together. */
  weapons: PieceKind[];
  shell: ShellId;
  claws: ClawKind;
  /** The team tint it wears. */
  tint: [number, number, number, number];
  /** Its guns' damage as a share of the player's. */
  damageScale: number;
}

export const ENEMY_KINDS: Record<EnemyKindId, EnemyKind> = {
  random: { id: 'random', name: 'Crab', scale: 1, armor: 1, speed: 1, keep: 9, range: 26, burst: 0.9, rest: 3, weapons: [], shell: 'whelk', claws: 'own', tint: [0.55, 0.7, 1, 0.45], damageScale: 0.3 },
  marcher: { id: 'marcher', name: 'March crab', scale: 0.55, armor: 0.3, speed: 1.35, keep: 0, range: 3, burst: 1, rest: 0.4, weapons: [], shell: 'nautilus', claws: 'own', tint: [0.6, 1, 0.5, 0.5], damageScale: 0.3 },
  gunner: { id: 'gunner', name: 'Gunner', scale: 1, armor: 1, speed: 1, keep: 9, range: 24, burst: 0.9, rest: 2.2, weapons: ['machinegun'], shell: 'whelk', claws: 'own', tint: [0.55, 0.7, 1, 0.45], damageScale: 0.3 },
  skirmisher: { id: 'skirmisher', name: 'Skirmisher', scale: 0.85, armor: 0.8, speed: 1.5, keep: 4, range: 7, burst: 1.2, rest: 1.5, weapons: ['flamethrower'], shell: 'nautilus', claws: 'tiny', tint: [1, 0.6, 0.2, 0.5], damageScale: 0.35 },
  bruiser: { id: 'bruiser', name: 'Bruiser', scale: 1.45, armor: 3.5, speed: 0.6, keep: 7, range: 22, burst: 0.6, rest: 2.8, weapons: ['cannon', 'grenade'], shell: 'cowrie', claws: 'large', tint: [0.9, 0.25, 0.2, 0.5], damageScale: 0.35 },
  rocketeer: { id: 'rocketeer', name: 'Rocketeer', scale: 0.95, armor: 0.9, speed: 1.1, keep: 16, range: 30, burst: 0.4, rest: 2.4, weapons: ['fireworks'], shell: 'turban', claws: 'tiny', tint: [0.7, 0.4, 1, 0.5], damageScale: 0.35 },
  boss: { id: 'boss', name: 'Boss crab', scale: 2, armor: 9, speed: 0.55, keep: 8, range: 28, burst: 1.4, rest: 1.6, weapons: ['gatling', 'cannon', 'grenade', 'flamethrower'], shell: 'conch', claws: 'uber', tint: [1, 0.85, 0.3, 0.55], damageScale: 0.4 },
};
