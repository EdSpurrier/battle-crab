import type { OverlayData, Vec3 } from 'gridfall-engine';

/** Shapes drawn on the ground as overlay bands: brush rings, footprints, an aim marker. */

export function emptyOverlay(): OverlayData {
  return { vertices: new Float32Array(0), indices: new Uint32Array(0) };
}

/** `n` points round a circle on the ground (y left 0; `band` puts them on the ground). */
export function ringPoints(cx: number, cz: number, radius: number, n = 48): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * radius, 0, cz + Math.sin(a) * radius]);
  }
  return pts;
}

/** A band along `points` (a closed path), `width` wide, laid on the ground a little above it, in a colour. */
export function band(points: Vec3[], width: number, rgba: [number, number, number, number], heightAt: (x: number, z: number) => number, lift = 0.04): OverlayData {
  const n = points.length;
  const vertices = new Float32Array(n * 2 * 7);
  const indices = new Uint32Array(n * 6);
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const prev = points[(i + n - 1) % n];
    const next = points[(i + 1) % n];
    let dx = next[0] - prev[0];
    let dz = next[2] - prev[2];
    const l = Math.hypot(dx, dz) || 1;
    dx /= l; dz /= l;
    const ox = dz;
    const oz = -dx;
    const y = heightAt(p[0], p[2]) + lift;
    const w = width / 2;
    const o = i * 14;
    vertices.set([p[0] - ox * w, y, p[2] - oz * w, rgba[0], rgba[1], rgba[2], rgba[3]], o);
    vertices.set([p[0] + ox * w, y, p[2] + oz * w, rgba[0], rgba[1], rgba[2], rgba[3]], o + 7);
    const j = (i + 1) % n;
    indices.set([i * 2, j * 2, j * 2 + 1, i * 2, j * 2 + 1, i * 2 + 1], i * 6);
  }
  return { vertices, indices };
}

/** Several bands in one overlay. */
export function joinOverlays(parts: OverlayData[]): OverlayData {
  let v = 0;
  let n = 0;
  for (const p of parts) {
    v += p.vertices.length;
    n += p.indices.length;
  }
  const vertices = new Float32Array(v);
  const indices = new Uint32Array(n);
  let vo = 0;
  let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / 7;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}
