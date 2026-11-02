import type { Draw, Vec3 } from 'gridfall-engine';

/**
 * The ground tiles a map is painted with: square textures drawn on a canvas (no image files),
 * each a layer of the terrain's splat. A map's `paint` holds an index into TILES per cell.
 * Seeded, so a tile looks the same every load.
 */
export interface Tile {
  name: string;
  draw: Draw;
  /** Multiplied into the tile (linear rgb), and the surface's roughness. */
  tint: Vec3;
  roughness: number;
  /** A swatch colour for the map maker's palette (CSS). */
  swatch: string;
}

/** A small deterministic random source (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Draw `shape` at (x, y) and again across the tile's edges, so a tile repeats without a seam. */
function wrapped(ctx: CanvasRenderingContext2D, size: number, x: number, y: number, reach: number, shape: (x: number, y: number) => void): void {
  for (const dx of [-size, 0, size]) {
    for (const dy of [-size, 0, size]) {
      const px = x + dx;
      const py = y + dy;
      if (px < -reach || py < -reach || px > size + reach || py > size + reach) continue;
      shape(px, py);
    }
  }
}

function speckle(ctx: CanvasRenderingContext2D, size: number, rand: () => number, count: number, light: string, dark: string, alpha: number, dot = 1): void {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = rand() < 0.5 ? light : dark;
    ctx.globalAlpha = alpha * (0.4 + rand() * 0.6);
    ctx.fillRect(Math.floor(rand() * size), Math.floor(rand() * size), dot, dot);
  }
  ctx.globalAlpha = 1;
}

function blotches(ctx: CanvasRenderingContext2D, size: number, rand: () => number, count: number, color: string, alpha: number, rMin: number, rMax: number): void {
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const r = rMin + rand() * (rMax - rMin);
    ctx.globalAlpha = alpha * (0.5 + rand() * 0.5);
    wrapped(ctx, size, rand() * size, rand() * size, r, (x, y) => {
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * (0.6 + rand() * 0.4), rand() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.globalAlpha = 1;
}

const sand: Draw = (ctx, size) => {
  const rand = rng(11);
  ctx.fillStyle = '#cdb27e';
  ctx.fillRect(0, 0, size, size);
  blotches(ctx, size, rand, 40, '#d9c08c', 0.35, size * 0.05, size * 0.18);
  blotches(ctx, size, rand, 30, '#b89a68', 0.3, size * 0.04, size * 0.15);
  speckle(ctx, size, rand, size * 40, '#e8d6a8', '#9c8252', 0.5);
};

const wetSand: Draw = (ctx, size) => {
  const rand = rng(23);
  ctx.fillStyle = '#8e7a58';
  ctx.fillRect(0, 0, size, size);
  blotches(ctx, size, rand, 30, '#7a6749', 0.4, size * 0.08, size * 0.25);
  blotches(ctx, size, rand, 20, '#a08b66', 0.3, size * 0.05, size * 0.15);
  speckle(ctx, size, rand, size * 30, '#b4a07a', '#5e4e36', 0.45);
};

const pebbles: Draw = (ctx, size) => {
  const rand = rng(37);
  ctx.fillStyle = '#9a927f';
  ctx.fillRect(0, 0, size, size);
  speckle(ctx, size, rand, size * 20, '#b5ad9a', '#6e675a', 0.5);
  for (let i = 0; i < 260; i++) {
    const r = size * (0.012 + rand() * 0.035);
    const g = 90 + Math.floor(rand() * 90);
    const tintR = Math.floor(rand() * 20);
    const base = `rgb(${g + tintR}, ${g}, ${g - Math.floor(rand() * 15)})`;
    const rot = rand() * Math.PI;
    const squash = 0.6 + rand() * 0.4;
    wrapped(ctx, size, rand() * size, rand() * size, r, (x, y) => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(x + r * 0.15, y + r * 0.2, r, r * squash, rot, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = base;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * squash, rot, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.beginPath();
      ctx.ellipse(x - r * 0.25, y - r * 0.25, r * 0.4, r * 0.3 * squash, rot, 0, Math.PI * 2);
      ctx.fill();
    });
  }
  ctx.globalAlpha = 1;
};

const grass: Draw = (ctx, size) => {
  const rand = rng(41);
  ctx.fillStyle = '#5f7a35';
  ctx.fillRect(0, 0, size, size);
  blotches(ctx, size, rand, 30, '#4e6a2a', 0.35, size * 0.06, size * 0.2);
  ctx.lineWidth = Math.max(1, size / 256);
  for (let i = 0; i < size * 6; i++) {
    const len = size * (0.02 + rand() * 0.04);
    const a = -Math.PI / 2 + (rand() - 0.5) * 1.2;
    const g = 100 + Math.floor(rand() * 90);
    ctx.strokeStyle = `rgba(${Math.floor(g * 0.7)}, ${g}, ${Math.floor(g * 0.35)}, 0.8)`;
    wrapped(ctx, size, rand() * size, rand() * size, len, (x, y) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len);
      ctx.stroke();
    });
  }
};

const rock: Draw = (ctx, size) => {
  const rand = rng(53);
  ctx.fillStyle = '#6b6760';
  ctx.fillRect(0, 0, size, size);
  blotches(ctx, size, rand, 30, '#7d7970', 0.35, size * 0.06, size * 0.2);
  blotches(ctx, size, rand, 20, '#55514b', 0.35, size * 0.05, size * 0.18);
  speckle(ctx, size, rand, size * 25, '#8f8b82', '#3f3c37', 0.5);
  ctx.strokeStyle = 'rgba(30, 28, 25, 0.6)';
  ctx.lineWidth = Math.max(1, size / 200);
  for (let i = 0; i < 28; i++) {
    let x = rand() * size;
    let y = rand() * size;
    const steps = 4 + Math.floor(rand() * 6);
    const seg = size * 0.05;
    let a = rand() * Math.PI * 2;
    const pts: [number, number][] = [[x, y]];
    for (let s = 0; s < steps; s++) {
      a += (rand() - 0.5) * 1.4;
      x += Math.cos(a) * seg;
      y += Math.sin(a) * seg;
      pts.push([x, y]);
    }
    for (const dx of [-size, 0, size]) {
      for (const dy of [-size, 0, size]) {
        ctx.beginPath();
        pts.forEach(([px, py], k) => (k ? ctx.lineTo(px + dx, py + dy) : ctx.moveTo(px + dx, py + dy)));
        ctx.stroke();
      }
    }
  }
};

const seaweed: Draw = (ctx, size) => {
  const rand = rng(67);
  ctx.fillStyle = '#4e6a3f';
  ctx.fillRect(0, 0, size, size);
  blotches(ctx, size, rand, 60, '#2f4a2b', 0.5, size * 0.03, size * 0.12);
  blotches(ctx, size, rand, 40, '#6a8a4c', 0.35, size * 0.02, size * 0.08);
  speckle(ctx, size, rand, size * 20, '#86a560', '#22361f', 0.5);
};

export const TILES: Tile[] = [
  { name: 'sand', draw: sand, tint: [1, 1, 1], roughness: 0.95, swatch: '#cdb27e' },
  { name: 'wet sand', draw: wetSand, tint: [1, 1, 1], roughness: 0.7, swatch: '#8e7a58' },
  { name: 'pebbles', draw: pebbles, tint: [1, 1, 1], roughness: 0.85, swatch: '#9a927f' },
  { name: 'dune grass', draw: grass, tint: [1, 1, 1], roughness: 0.95, swatch: '#5f7a35' },
  { name: 'rock', draw: rock, tint: [1, 1, 1], roughness: 0.8, swatch: '#6b6760' },
  { name: 'seaweed', draw: seaweed, tint: [1, 1, 1], roughness: 0.6, swatch: '#4e6a3f' },
];
