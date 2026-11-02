import { DEFAULT_TERRAIN_COLORS, Mesh, OverlayMesh, SplatMap, TextureArray, buildTerrain, heightAt, material, translation, type HeightGrid, type Instance, type OverlayInstance, type Renderer, type Splat } from 'gridfall-engine';
import { LEVEL_HEIGHT, MAX_LEVEL, type MapData } from './map';
import { TILES } from './tiles';

/**
 * The beach the crab walks on, built from a map: the engine's stepped terrain (a level per cell;
 * cells one level apart slope, further apart are cliffs) with its top splatted from the tiles the
 * map is painted with. The map maker edits the same object: `rebuild` after levels change,
 * `paint` a cell, `commit` once a frame.
 */
export interface Ground {
  readonly map: MapData;
  size: number;
  /** World height of the ground at (x, z). */
  heightAt(x: number, z: number): number;
  /** The level of the cell under (x, z), clamped to the map. */
  levelAt(x: number, z: number): number;
  /** Build the terrain again from the map's levels (after raising or lowering). */
  rebuild(): void;
  /** Paint cell (x, z) with a tile; shows after `commit`. */
  paint(x: number, z: number, tile: number): void;
  /** Upload what was painted this frame. */
  commit(): void;
  /** Grid lines on the ground, one per cell (the map maker). */
  setGrid(on: boolean): void;
  /** Take the ground out of the renderer and free its GPU memory (another map loaded). */
  dispose(): void;
}

export function buildGround(renderer: Renderer, map: MapData): Ground {
  const gl = renderer.gl;
  const size = map.size;
  const cell = (x: number, z: number) => Math.min(size - 1, Math.max(0, Math.floor(z))) * size + Math.min(size - 1, Math.max(0, Math.floor(x)));

  const splatMap = new SplatMap(gl, size, size);
  const splat: Splat = {
    map: splatMap,
    layers: new TextureArray(gl, 256, TILES.map((t) => t.draw)),
    tints: TILES.map((t) => t.tint),
    roughness: TILES.map((t) => t.roughness),
    levelHeight: LEVEL_HEIGHT,
    cliff: LEVEL_HEIGHT * 1.5,
    noise: 0.35,
    sharpness: 3,
    grid: null,
  };
  const paintAll = () => {
    for (let z = 0; z < size; z++) for (let x = 0; x < size; x++) splatMap.set(x, z, map.paint[z * size + x], map.paint[z * size + x], map.levels[z * size + x]);
    splatMap.upload();
  };
  paintAll();

  const grid: HeightGrid = { width: size, height: size, maxStep: 1, levelHeight: LEVEL_HEIGHT, level: (x, z) => map.levels[z * size + x] };
  const still = translation(0, 0, 0);
  // The ground never fades near the camera (nearFade off): only what stands on it does. Tops are
  // neutral (the tiles bring the colour); the cliff faces and steps keep the terrain's own sandy shades.
  const colors = { ...DEFAULT_TERRAIN_COLORS, topLow: [0.8, 0.8, 0.8] as [number, number, number], topHigh: [1, 1, 1] as [number, number, number], step: [0.6, 0.52, 0.4] as [number, number, number], cliff: [0.55, 0.45, 0.33] as [number, number, number], rim: [0.2, 0.16, 0.11] as [number, number, number] };
  const topMaterial = material({ splat, roughness: 0.95, doubleSided: true, nearFade: false });
  const sideMaterial = material({ roughness: 0.9, doubleSided: true, nearFade: false });
  let built = buildTerrain(grid, MAX_LEVEL, colors);
  const tops: Instance = { mesh: new Mesh(gl, built.tops), model: still, material: topMaterial };
  const sides: Instance = { mesh: new Mesh(gl, built.sides), model: still, material: sideMaterial };
  const rims: OverlayInstance = { mesh: new OverlayMesh(gl, built.rims), model: still };
  renderer.instances.push(tops, sides);
  renderer.overlays.push(rims);
  let dirty = false;

  return {
    map,
    size,
    heightAt: (x, z) => heightAt(built.corners, size, size, x, z),
    levelAt: (x, z) => map.levels[cell(x, z)],
    rebuild() {
      built = buildTerrain(grid, MAX_LEVEL, colors);
      tops.mesh.dispose();
      sides.mesh.dispose();
      rims.mesh.dispose();
      tops.mesh = new Mesh(gl, built.tops);
      sides.mesh = new Mesh(gl, built.sides);
      rims.mesh = new OverlayMesh(gl, built.rims);
      paintAll();
    },
    paint(x, z, tile) {
      const i = cell(x, z);
      if (map.paint[i] === tile) return;
      map.paint[i] = tile;
      splatMap.set(i % size, Math.floor(i / size), tile, tile, map.levels[i]);
      dirty = true;
    },
    commit() {
      if (!dirty) return;
      splatMap.upload();
      dirty = false;
    },
    setGrid(on) {
      splat.grid = on ? { size: 1, width: 0.03, opacity: 0.22 } : null;
    },
    dispose() {
      for (const inst of [tops, sides]) {
        const i = renderer.instances.indexOf(inst);
        if (i >= 0) renderer.instances.splice(i, 1);
        inst.mesh.dispose();
      }
      const r = renderer.overlays.indexOf(rims);
      if (r >= 0) renderer.overlays.splice(r, 1);
      rims.mesh.dispose();
      splatMap.dispose();
      splat.layers.dispose();
    },
  };
}
