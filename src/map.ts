/**
 * A map: the beach's shape (a level per cell, whole steps; cells a step apart slope, further
 * apart are cliffs), which ground tile each cell wears, the mist placed on it and where the crab
 * starts. Plain JSON, so the map maker saves it (the browser's storage, a file) and the game loads it.
 */

export const MAP_VERSION = 1;
/** World units per level, and the tallest level. */
export const LEVEL_HEIGHT = 0.5;
export const MAX_LEVEL = 8;

export interface MistDef {
  center: [number, number, number];
  size: [number, number, number];
  /** Degrees about +y. */
  yaw: number;
  /** Linear rgb. */
  color: [number, number, number];
  density: number;
  softness: number;
  falloff: number;
  /** How much the billows break it up (0..1) and how big they are (world units). */
  noise: number;
  noiseScale: number;
  /** Drift: units per second, degrees (0 = toward +z), and a rise (units per second). */
  speed: number;
  direction: number;
  rise: number;
  churn: number;
  glow: [number, number, number];
  glowStrength: number;
}

export type PropKind = 'rock' | 'boulder' | 'clam' | 'snail' | 'driftwood' | 'starfish';
export const PROP_KINDS: PropKind[] = ['rock', 'boulder', 'clam', 'snail', 'driftwood', 'starfish'];

/** A thing on the beach: a rock, a shell, a log, standing on the ground at (x, z). */
export interface PropDef {
  kind: PropKind;
  x: number;
  z: number;
  /** Degrees about +y. */
  yaw: number;
  scale: number;
}

export interface MapData {
  version: number;
  name: string;
  size: number;
  /** Per cell (z * size + x): its level, 0..MAX_LEVEL. */
  levels: number[];
  /** Per cell: which ground tile (an index into tiles.ts's TILES). */
  paint: number[];
  mist: MistDef[];
  props: PropDef[];
  /** Where the crab starts (x, z). */
  spawn: [number, number];
}

const STORE = 'battle-crab.map';

/** A mist bank: the defaults with `over` on top. */
export function mistDef(over: Partial<MistDef> = {}): MistDef {
  const d: MistDef = {
    center: [32, 0.9, 32],
    size: [10, 2, 8],
    yaw: 0,
    color: [0.8, 0.86, 0.92],
    density: 0.45,
    softness: 0.5,
    falloff: 0.9,
    noise: 0.7,
    noiseScale: 5,
    speed: 0.4,
    direction: 60,
    rise: 0,
    churn: 0.15,
    glow: [0, 0, 0],
    glowStrength: 0,
  };
  const triple = (v: unknown, fallback: [number, number, number]): [number, number, number] =>
    Array.isArray(v) && v.length === 3 ? [Number(v[0]), Number(v[1]), Number(v[2])] : [...fallback];
  // Arrays copied, so banks never share them.
  return { ...d, ...over, center: triple(over.center, d.center), size: triple(over.size, d.size), color: triple(over.color, d.color), glow: triple(over.glow, d.glow) };
}

/** A prop with the defaults filled in. */
export function propDef(over: Partial<PropDef> & { kind: PropKind }): PropDef {
  return { x: 0, z: 0, yaw: 0, scale: 1, ...over };
}

/** The beach as it comes: flat sand, a low mist over all of it and two banks, a scatter of rocks and shells, the crab in the middle. */
export function defaultMap(size = 64): MapData {
  const n = size * size;
  let seed = 5;
  const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const props: PropDef[] = [];
  for (let i = 0; i < 26; i++) {
    const x = 3 + rand() * (size - 6);
    const z = 3 + rand() * (size - 6);
    if (Math.hypot(x - size / 2, z - size / 2) < 5) continue;
    const kind = PROP_KINDS[Math.floor(rand() * PROP_KINDS.length)];
    props.push(propDef({ kind, x, z, yaw: rand() * 360, scale: 0.8 + rand() * 0.6 }));
  }
  return {
    version: MAP_VERSION,
    name: 'beach',
    size,
    levels: new Array<number>(n).fill(0),
    paint: new Array<number>(n).fill(0),
    mist: [
      mistDef({ center: [size / 2, 0.5, size / 2], size: [size, 1.2, size], density: 0.12, noiseScale: 9 }),
      mistDef({ center: [size / 2 + 10, 0.9, size / 2 - 8], size: [12, 2, 9], yaw: 25, density: 0.5 }),
      mistDef({ center: [size / 2 - 12, 0.9, size / 2 + 9], size: [10, 1.8, 14], yaw: -40, density: 0.45 }),
    ],
    props,
    spawn: [size / 2, size / 2],
  };
}

/** Whether `data` is a map this build understands; arrays the right length, numbers in range. */
export function isMap(data: unknown): data is MapData {
  if (!data || typeof data !== 'object') return false;
  const m = data as Partial<MapData>;
  if (typeof m.size !== 'number' || m.size < 8 || m.size > 256) return false;
  const n = m.size * m.size;
  if (!Array.isArray(m.levels) || m.levels.length !== n || !Array.isArray(m.paint) || m.paint.length !== n) return false;
  if (!Array.isArray(m.mist) || !Array.isArray(m.spawn) || m.spawn.length !== 2) return false;
  return true;
}

/** A map made whole again after JSON (missing mist fields filled in, levels clamped). */
export function normalizeMap(m: MapData): MapData {
  return {
    ...m,
    version: MAP_VERSION,
    name: m.name || 'beach',
    levels: m.levels.map((l) => Math.max(0, Math.min(MAX_LEVEL, Math.round(Number(l) || 0)))),
    paint: m.paint.map((p) => Math.max(0, Math.round(Number(p) || 0))),
    mist: m.mist.map((d) => mistDef(d)),
    props: (Array.isArray(m.props) ? m.props : []).filter((p) => PROP_KINDS.includes(p.kind)).map((p) => propDef({ kind: p.kind, x: Number(p.x) || 0, z: Number(p.z) || 0, yaw: Number(p.yaw) || 0, scale: Math.max(0.2, Math.min(5, Number(p.scale) || 1)) })),
    spawn: [Number(m.spawn[0]) || m.size / 2, Number(m.spawn[1]) || m.size / 2],
  };
}

/** The map last saved in this browser, or the default. */
export function loadMap(): MapData {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const data: unknown = JSON.parse(raw);
      if (isMap(data)) return normalizeMap(data);
    }
  } catch {
    // Unreadable: the default below.
  }
  return defaultMap();
}

export function saveMap(map: MapData): boolean {
  try {
    localStorage.setItem(STORE, JSON.stringify(map));
    return true;
  } catch {
    return false;
  }
}

/** Hand the map to the browser as a .json download. */
export function downloadMap(map: MapData): void {
  const blob = new Blob([JSON.stringify(map)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${map.name || 'map'}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** A map from a file the user picked; rejects what is not one. */
export async function readMapFile(file: File): Promise<MapData> {
  const data: unknown = JSON.parse(await file.text());
  if (!isMap(data)) throw new Error(`${file.name} is not a Battle Crab map`);
  return normalizeMap(data);
}
