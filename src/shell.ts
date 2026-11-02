import type { Vec, Vec3 } from 'gridfall-engine';

/**
 * The Battle Shell: which of five shells the crab wears (each with its own deck to build on and
 * its own trade-offs), and what is built on it: pieces (wooden planks and joints, weapons) in the
 * cells of a grid standing on the shell's top. Plain JSON, saved in the browser by the build
 * screen and loaded by the game.
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
  { id: 'whelk', name: 'Whelk', blurb: 'The shell it came with. Nothing special, nothing wrong.', good: ['4 × 4 deck, 3 high', 'armour 100'], bad: ['plain'], grid: [4, 4, 3], speed: 1, jump: 1, armor: 100, color: [0.36, 0.24, 0.12], light: [0.42, 0.29, 0.15], scale: 1 },
  { id: 'conch', name: 'Conch', blurb: 'Broad and roomy: the widest deck to build on.', good: ['6 × 5 deck, 3 high', 'armour 140'], bad: ['speed × 0.8', 'jump × 0.85'], grid: [6, 5, 3], speed: 0.8, jump: 0.85, armor: 140, color: [0.55, 0.42, 0.3], light: [0.7, 0.55, 0.4], scale: 1.18 },
  { id: 'nautilus', name: 'Nautilus', blurb: 'Light and quick, with little room on top.', good: ['speed × 1.25', 'jump × 1.2'], bad: ['3 × 3 deck, 3 high', 'armour 60'], grid: [3, 3, 3], speed: 1.25, jump: 1.2, armor: 60, color: [0.75, 0.7, 0.6], light: [0.6, 0.3, 0.2], scale: 0.85 },
  { id: 'cowrie', name: 'Cowrie', blurb: 'Thick and glossy: shrugs off hits, but it is a lot to carry.', good: ['armour 200', '4 × 4 deck'], bad: ['only 2 high', 'speed × 0.7', 'jump × 0.7'], grid: [4, 4, 2], speed: 0.7, jump: 0.7, armor: 200, color: [0.2, 0.14, 0.1], light: [0.5, 0.4, 0.3], scale: 1.05 },
  { id: 'turban', name: 'Turban', blurb: 'Tall: build high, and mind the balance.', good: ['4 × 3 deck, 5 high', 'jump × 1.1'], bad: ['speed × 0.9', 'armour 80'], grid: [4, 3, 5], speed: 0.9, jump: 1.1, armor: 80, color: [0.3, 0.33, 0.25], light: [0.45, 0.5, 0.35], scale: 1 },
];

export type PieceKind = 'plank' | 'joint' | 'cannon' | 'gatling' | 'machinegun' | 'flamethrower' | 'knocker';

export interface PieceType {
  kind: PieceKind;
  name: string;
  /** The key that picks it on the build screen. */
  key: string;
  weapon: boolean;
  blurb: string;
}

export const PIECES: PieceType[] = [
  { kind: 'plank', name: 'Plank', key: '1', weapon: false, blurb: 'A wooden block to build with.' },
  { kind: 'joint', name: 'Joint', key: '2', weapon: false, blurb: 'A post with a plate: holds things up.' },
  { kind: 'cannon', name: 'Cannon', key: '3', weapon: true, blurb: 'One heavy ball at a time, in an arc.' },
  { kind: 'gatling', name: 'Gatling gun', key: '4', weapon: true, blurb: 'Spins up, then a stream of fire. Hold.' },
  { kind: 'machinegun', name: 'Machine gun', key: '5', weapon: true, blurb: 'Steady fire. Hold.' },
  { kind: 'flamethrower', name: 'Flamethrower', key: '6', weapon: true, blurb: 'A short tongue of fire. Hold.' },
  { kind: 'knocker', name: 'Bommy knocker', key: '7', weapon: true, blurb: 'A spiked ball on a pole. Swings.' },
];

export interface Piece {
  x: number;
  y: number;
  z: number;
  kind: PieceKind;
  /** Which way it faces, in quarter turns from the crab's forward. */
  yaw: number;
}

export interface ShellBuild {
  shell: ShellId;
  pieces: Piece[];
}

/** Weapons mounted at once: action slots 2 to 5 (slot 1 is the claws). */
export const MAX_WEAPONS = 4;
/** A deck cell's size (world units). */
export const CELL = 0.3;
/** The deck's centre in body space (z) and how high it sits on a whelk-sized shell (y), before the shell's scale. */
const DECK_Z = -0.22;
const DECK_Y = 0.3;
const DECK_RISE = 0.45;

const STORE = 'battle-crab.shell';

export function shellType(id: ShellId): ShellType {
  return SHELLS.find((s) => s.id === id) ?? SHELLS[0];
}

export function pieceType(kind: PieceKind): PieceType {
  return PIECES.find((p) => p.kind === kind) ?? PIECES[0];
}

/** The deck's top (body space y) on a shell. */
export function deckTop(shell: ShellType): number {
  return DECK_Y + DECK_RISE * shell.scale;
}

/** A cell's centre in body space (the crab faces +z; +x is its left). */
export function cellCentre(shell: ShellType, x: number, y: number, z: number): Vec3 {
  const [cols, rows] = shell.grid;
  return [(x - (cols - 1) / 2) * CELL, deckTop(shell) + CELL / 2 + y * CELL, DECK_Z + (z - (rows - 1) / 2) * CELL];
}

/** The cell a body-space point is in (may be outside the grid: check with `inGrid`). */
export function cellAt(shell: ShellType, p: Vec3): [number, number, number] {
  const [cols, rows] = shell.grid;
  return [Math.floor(p[0] / CELL + cols / 2), Math.floor((p[1] - deckTop(shell)) / CELL), Math.floor((p[2] - DECK_Z) / CELL + rows / 2)];
}

export function inGrid(shell: ShellType, c: [number, number, number]): boolean {
  const [cols, rows, layers] = shell.grid;
  return c[0] >= 0 && c[0] < cols && c[1] >= 0 && c[1] < layers && c[2] >= 0 && c[2] < rows;
}

/** The weapons on the deck in the order they were placed, as many as there are slots for. */
export function weaponsOf(build: ShellBuild): Piece[] {
  return build.pieces.filter((p) => pieceType(p.kind).weapon).slice(0, MAX_WEAPONS);
}

/** A first shell: a whelk with a couple of planks and a cannon. */
export function defaultBuild(): ShellBuild {
  return {
    shell: 'whelk',
    pieces: [
      { x: 1, y: 0, z: 1, kind: 'plank', yaw: 0 },
      { x: 2, y: 0, z: 1, kind: 'plank', yaw: 0 },
      { x: 1, y: 1, z: 1, kind: 'cannon', yaw: 0 },
      { x: 2, y: 1, z: 1, kind: 'machinegun', yaw: 0 },
    ],
  };
}

export function loadBuild(): ShellBuild {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const data = JSON.parse(raw) as Partial<ShellBuild>;
      if (data && typeof data.shell === 'string' && Array.isArray(data.pieces)) {
        const shell = shellType(data.shell as ShellId);
        const pieces = (data.pieces as Piece[]).filter((p) => PIECES.some((t) => t.kind === p.kind) && inGrid(shell, [p.x, p.y, p.z])).map((p) => ({ x: p.x, y: p.y, z: p.z, kind: p.kind, yaw: ((Number(p.yaw) || 0) % 4 + 4) % 4 }));
        return { shell: shell.id, pieces };
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
