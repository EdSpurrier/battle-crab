import { Mesh, OverlayMesh, buildTerrain, heightAt, material, translation, type HeightGrid, type Renderer } from 'gridfall-engine';

/** The beach the crab walks on: a flat sandy heightfield for now (the engine's terrain, so hills and tide pools can come later). */
export interface Ground {
  size: number;
  /** World height of the sand at (x, z). */
  heightAt(x: number, z: number): number;
}

export function buildGround(renderer: Renderer, size: number): Ground {
  const gl = renderer.gl;
  const grid: HeightGrid = { width: size, height: size, maxStep: 1, levelHeight: 0.5, level: () => 0 };
  // Colours are linear (the engine's convention): warm sand at about a third of white.
  const sand = buildTerrain(grid, 1, {
    topLow: [0.38, 0.3, 0.16],
    topHigh: [0.46, 0.37, 0.21],
    step: [0.34, 0.27, 0.15],
    cliff: [0.28, 0.21, 0.12],
    rim: [0.12, 0.09, 0.05],
  });
  const still = translation(0, 0, 0);
  renderer.instances.push({ mesh: new Mesh(gl, sand.tops), model: still, material: material({ roughness: 0.95, doubleSided: true }) });
  if (sand.sides.indices.length) renderer.instances.push({ mesh: new Mesh(gl, sand.sides), model: still, material: material({ roughness: 0.9, doubleSided: true }) });
  if (sand.rims.indices.length) renderer.overlays.push({ mesh: new OverlayMesh(gl, sand.rims), model: still });
  return { size, heightAt: (x, z) => heightAt(sand.corners, size, size, x, z) };
}
