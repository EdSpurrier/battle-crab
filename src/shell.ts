import type { Vec, Vec3 } from 'gridfall-engine';

/**
 * The Battle Shell: which of five shells the crab wears (each with its own deck to build on and
 * its own trade-offs), what is built on it: pieces in the cells of a grid standing on the shell's
 * top (planks, beams and joints in wood, metal or stone; weapons), and which claws it has. Every
 * piece has hit points and weight: shot off, it falls, and the crab gets lighter. Plain JSON,
 * saved in the browser by the build screen and loaded by the game.
 */

export type ShellId = 'whelk' | 'conch' | 'nautilus' | 'cowrie' | 'turban';

export interface ShellType {
  id: ShellId;
  name: string;
  blurb: string;
  good: string[];
  bad: string[];
  /** The deck: cells across (x), deep (z) and high (y). */
  grid: [number, number, number];
  /** Multipliers on the crab's walking speed and jump height, and hit points. */
  speed: number;
  jump: number;
  armor: number;
  /** Looks (linear rgb) and how big the shell is against the whelk. */
  color: Vec;
  light: Vec;
  scale: number;
}

export const SHELLS: ShellType[] = [
  { id: 'whelk', name: 'Whelk', blurb: 'The shell it came with. Nothing special, nothing wrong.', good: ['4 × 4 deck, 6 high', 'armour 100'], bad: ['plain'], grid: [4, 4, 6], speed: 1, jump: 1, armor: 100, color: [0.36, 0.24, 0.12], light: [0.42, 0.29, 0.15], scale: 1 },
  { id: 'conch', name: 'Conch', blurb: 'Broad and roomy: the widest deck to build on.', good: ['6 × 5 deck, 6 high', 'armour 140'], bad: ['speed × 0.8', 'jump × 0.85'], grid: [6, 5, 6], speed: 0.8, jump: 0.85, armor: 140, color: [0.55, 0.42, 0.3], light: [0.7, 0.55, 0.4], scale: 1.18 },
  { id: 'nautilus', name: 'Nautilus', blurb: 'Light and quick, with little room on top.', good: ['speed × 1.25', 'jump × 1.2'], bad: ['3 × 3 deck, 5 high', 'armour 60'], grid: [3, 3, 5], speed: 1.25, jump: 1.2, armor: 60, color: [0.75, 0.7, 0.6], light: [0.6, 0.3, 0.2], scale: 0.85 },
  { id: 'cowrie', name: 'Cowrie', blurb: 'Thick and glossy: shrugs off hits, but it is a lot to carry.', good: ['armour 200', '4 × 4 deck'], bad: ['only 4 high', 'speed × 0.7', 'jump × 0.7'], grid: [4, 4, 4], speed: 0.7, jump: 0.7, armor: 200, color: [0.2, 0.14, 0.1], light: [0.5, 0.4, 0.3], scale: 1.05 },
  { id: 'turban', name: 'Turban', blurb: 'Tall: build high, and mind the balance.', good: ['4 × 3 deck, 10 high', 'jump × 1.1'], bad: ['speed × 0.9', 'armour 80'], grid: [4, 3, 10], speed: 0.9, jump: 1.1, armor: 80, color: [0.3, 0.33, 0.25], light: [0.45, 0.5, 0.35], scale: 1 },
];

/** What the building blocks are made of: how much they take, how much they weigh, whether they burn. */
export type Material = 'wood' | 'metal' | 'stone';
export const MATERIALS: Record<Material, { name: string; hp: number; weight: number; burns: boolean; color: Vec; dark: Vec; roughness: number; metallic: number }> = {
  wood: { name: 'Wood', hp: 40, weight: 1, burns: true, color: [0.42, 0.27, 0.13], dark: [0.3, 0.19, 0.09], roughness: 0.9, metallic: 0 },
  metal: { name: 'Metal', hp: 120, weight: 3, burns: false, color: [0.32, 0.33, 0.36], dark: [0.2, 0.21, 0.24], roughness: 0.45, metallic: 0.7 },
  stone: { name: 'Stone', hp: 90, weight: 4, burns: false, color: [0.5, 0.48, 0.44], dark: [0.36, 0.34, 0.31], roughness: 0.95, metallic: 0 },
};
export const MATERIAL_IDS: Material[] = ['wood', 'metal', 'stone'];

export type PieceKind = 'plank' | 'beam' | 'joint' | 'cannon' | 'gatling' | 'machinegun' | 'flamethrower' | 'knocker' | 'spikeball' | 'fireworks';

export interface PieceType {
  kind: PieceKind;
  name: string;
  /** The key that picks it on the build screen. */
  key: string;
  weapon: boolean;
  blurb: string;
  /** A weapon's own hit points and weight (a building block takes its material's). */
  hp?: number;
  weight?: number;
}

export const PIECES: PieceType[] = [
  { kind: 'plank', name: 'Plank', key: '1', weapon: false, blurb: 'A block to build with, in wood, metal or stone.' },
  { kind: 'beam', name: 'Beam', key: '2', weapon: false, blurb: 'A length that reaches out sideways: an arm off the deck.' },
  { kind: 'joint', name: 'Joint', key: '3', weapon: false, blurb: 'A post with a plate: holds things up.' },
  { kind: 'cannon', name: 'Cannon', key: '4', weapon: true, blurb: 'One heavy ball at a time, in an arc. Hits hard.', hp: 70, weight: 5 },
  { kind: 'gatling', name: 'Gatling gun', key: '5', weapon: true, blurb: 'Spins up, then a stream of fire. Hold.', hp: 60, weight: 4 },
  { kind: 'machinegun', name: 'Machine gun', key: '6', weapon: true, blurb: 'Steady fire. Hold.', hp: 50, weight: 2.5 },
  { kind: 'flamethrower', name: 'Flamethrower', key: '7', weapon: true, blurb: 'A short tongue of fire. Sets wood alight. Hold.', hp: 40, weight: 2.5 },
  { kind: 'knocker', name: 'Bommy knocker', key: '8', weapon: true, blurb: 'A spiked ball on a chain. Hold to pump the swing; let it fly through things.', hp: 60, weight: 4 },
  { kind: 'spikeball', name: 'Spiky ball cannon', key: '9', weapon: true, blurb: 'Fires a spiked ball on a chain; press again to reel it in.', hp: 60, weight: 5 },
  { kind: 'fireworks', name: 'Fireworks gun', key: '0', weapon: true, blurb: 'A handful of rockets that spin off every which way and pop.', hp: 35, weight: 2 },
];

/** The claws: the crab's own, or metal clampers in four sizes. */
export type ClawKind = 'own' | 'tiny' | 'medium' | 'large' | 'uber';
export const CLAW_KINDS: ClawKind[] = ['own', 'tiny', 'medium', 'large', 'uber'];
/** `works`: the claws can nip and take action slot 1; the tiny ones cannot, and the slot goes to a fourth weapon instead. */
export const CLAWS: Record<ClawKind, { name: string; blurb: string; scale: number; damage: number; weight: number; metal: boolean; works: boolean }> = {
  own: { name: 'Own claws', blurb: 'What it was born with.', scale: 1, damage: 20, weight: 0, metal: false, works: true },
  tiny: { name: 'Tiny clampers', blurb: 'Little metal pincers for show: no bite at all, but they free a fourth slot for a weapon.', scale: 0.6, damage: 0, weight: 0.5, metal: true, works: false },
  medium: { name: 'Clampers', blurb: 'A solid pair of metal clampers.', scale: 1.2, damage: 40, weight: 2.5, metal: true, works: true },
  large: { name: 'Large clampers', blurb: 'Heavy clampers: a real bite.', scale: 1.55, damage: 55, weight: 4, metal: true, works: true },
  uber: { name: 'Uber clampers', blurb: 'Absurd. Slow to carry, awful to meet.', scale: 2, damage: 80, weight: 7, metal: true, works: true },
};

export interface Piece {
  x: number;
  y: number;
  z: number;
  kind: PieceKind;
  /** Which way it faces, in quarter turns from the crab's forward. */
  yaw: number;
  /** A building block's material (left out: wood). */
  material?: Material;
}

export interface ShellBuild {
  shell: ShellId;
  pieces: Piece[];
  claws: ClawKind;
}

/** Action slots: the claws (when they work) and the weapons on the shell, four in all. */
export const MAX_ACTIONS = 4;
/** Weapons mounted at once: three beside working claws; four when the claws are the tiny ones that cannot bite. */
export function maxWeapons(claws: ClawKind): number {
  return CLAWS[claws].works ? MAX_ACTIONS - 1 : MAX_ACTIONS;
}
/** A deck cell's size (world units). */
export const CELL = 0.3;
/** How many cells past the deck's edge a build may reach, on arms. */
export const OVERHANG = 3;
/** The deck's centre in body space (z) and how high it sits on a whelk-sized shell (y), before the shell's scale. */
const DECK_Z = -0.22;
const DECK_Y = 0.3;
const DECK_RISE = 0.45;
/** The speed and jump multiplier for a build weight: nothing on at 0, halved at WEIGHT_HALF. */
const WEIGHT_HALF = 45;

const STORE = 'battle-crab.shell';

export function shellType(id: ShellId): ShellType {
  return SHELLS.find((s) => s.id === id) ?? SHELLS[0];
}

export function pieceType(kind: PieceKind): PieceType {
  return PIECES.find((p) => p.kind === kind) ?? PIECES[0];
}

export function pieceHp(piece: Piece): number {
  const t = pieceType(piece.kind);
  return t.weapon ? t.hp ?? 50 : MATERIALS[piece.material ?? 'wood'].hp;
}

export function pieceWeight(piece: Piece): number {
  const t = pieceType(piece.kind);
  return t.weapon ? t.weight ?? 3 : MATERIALS[piece.material ?? 'wood'].weight;
}

export function burns(piece: Piece): boolean {
  return !pieceType(piece.kind).weapon && MATERIALS[piece.material ?? 'wood'].burns;
}

/** The weight of what is built and worn. */
export function buildWeight(pieces: Piece[], claws: ClawKind): number {
  return pieces.reduce((w, p) => w + pieceWeight(p), 0) + CLAWS[claws].weight;
}

/** How a weight slows the crab and shortens its jump (1 with nothing on). */
export function weightFactor(weight: number): number {
  return 1 / (1 + weight / WEIGHT_HALF);
}

/** The deck's top (body space y) on a shell. */
export function deckTop(shell: ShellType): number {
  return DECK_Y + DECK_RISE * shell.scale;
}

/** A cell's centre in body space (the crab faces +z; +x is its left). Cells past the deck's edge are fine. */
export function cellCentre(shell: ShellType, x: number, y: number, z: number): Vec3 {
  const [cols, rows] = shell.grid;
  return [(x - (cols - 1) / 2) * CELL, deckTop(shell) + CELL / 2 + y * CELL, DECK_Z + (z - (rows - 1) / 2) * CELL];
}

/** The cell a body-space point is in (may be outside the reach: check with `inReach`). */
export function cellAt(shell: ShellType, p: Vec3): [number, number, number] {
  const [cols, rows] = shell.grid;
  return [Math.floor(p[0] / CELL + cols / 2), Math.floor((p[1] - deckTop(shell)) / CELL), Math.floor((p[2] - DECK_Z) / CELL + rows / 2)];
}

/** Whether a cell is over the deck itself. */
export function onDeck(shell: ShellType, c: [number, number, number]): boolean {
  const [cols, rows, layers] = shell.grid;
  return c[0] >= 0 && c[0] < cols && c[1] >= 0 && c[1] < layers && c[2] >= 0 && c[2] < rows;
}

/** Whether a cell is anywhere a piece may go: over the deck or within the overhang round it. */
export function inReach(shell: ShellType, c: [number, number, number]): boolean {
  const [cols, rows, layers] = shell.grid;
  return c[0] >= -OVERHANG && c[0] < cols + OVERHANG && c[1] >= 0 && c[1] < layers && c[2] >= -OVERHANG && c[2] < rows + OVERHANG;
}

const key = (x: number, y: number, z: number) => `${x},${y},${z}`;

/**
 * Which pieces are held up: those on the deck's bottom layer, and anything joined to one of them
 * through its six neighbours. The rest hang in the air and fall.
 */
export function supported(shell: ShellType, pieces: Piece[]): Set<number> {
  const at = new Map<string, number>();
  pieces.forEach((p, i) => at.set(key(p.x, p.y, p.z), i));
  const held = new Set<number>();
  const queue: number[] = [];
  pieces.forEach((p, i) => {
    if (p.y === 0 && onDeck(shell, [p.x, p.y, p.z])) {
      held.add(i);
      queue.push(i);
    }
  });
  while (queue.length) {
    const i = queue.pop()!;
    const p = pieces[i];
    for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
      const j = at.get(key(p.x + dx, p.y + dy, p.z + dz));
      if (j !== undefined && !held.has(j)) {
        held.add(j);
        queue.push(j);
      }
    }
  }
  return held;
}

/** Whether a piece could go in `c`: an empty cell in reach, on the deck's floor or next to a held piece. */
export function canPlace(shell: ShellType, pieces: Piece[], c: [number, number, number]): boolean {
  if (!inReach(shell, c) || pieces.some((p) => p.x === c[0] && p.y === c[1] && p.z === c[2])) return false;
  if (c[1] === 0 && onDeck(shell, c)) return true;
  const held = supported(shell, pieces);
  return pieces.some((p, i) => held.has(i) && Math.abs(p.x - c[0]) + Math.abs(p.y - c[1]) + Math.abs(p.z - c[2]) === 1);
}

/** The weapons on the deck in the order they were placed, as many as there are slots for. */
export function weaponsOf(build: ShellBuild): Piece[] {
  return build.pieces.filter((p) => pieceType(p.kind).weapon).slice(0, maxWeapons(build.claws));
}

/** A first shell: a whelk with a couple of planks and a cannon. */
export function defaultBuild(): ShellBuild {
  return {
    shell: 'whelk',
    pieces: [
      { x: 1, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'wood' },
      { x: 2, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'wood' },
      { x: 1, y: 1, z: 1, kind: 'cannon', yaw: 0 },
      { x: 2, y: 1, z: 1, kind: 'machinegun', yaw: 0 },
    ],
    claws: 'own',
  };
}

export function loadBuild(): ShellBuild {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const data = JSON.parse(raw) as Partial<ShellBuild>;
      if (data && typeof data.shell === 'string' && Array.isArray(data.pieces)) {
        const shell = shellType(data.shell as ShellId);
        const pieces = (data.pieces as Piece[])
          .filter((p) => PIECES.some((t) => t.kind === p.kind) && inReach(shell, [p.x, p.y, p.z]))
          .map((p) => ({ x: p.x, y: p.y, z: p.z, kind: p.kind, yaw: ((Number(p.yaw) || 0) % 4 + 4) % 4, material: p.material && MATERIAL_IDS.includes(p.material) ? p.material : 'wood' }));
        const claws = data.claws && CLAW_KINDS.includes(data.claws) ? data.claws : 'own';
        return { shell: shell.id, pieces, claws };
      }
    }
  } catch {
    // Unreadable: the default below.
  }
  return defaultBuild();
}

export function saveBuild(build: ShellBuild): boolean {
  try {
    localStorage.setItem(STORE, JSON.stringify(build));
    return true;
  } catch {
    return false;
  }
}
