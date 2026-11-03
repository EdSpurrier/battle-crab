import { invert, multiply, transformPoint, type CameraLike, type Vec3 } from 'gridfall-engine';

/**
 * The point on the ground under a screen position: a ray from the camera through the pixel,
 * marched until it goes under the heightfield, then closed in on by bisection. Outside the map
 * the ground is taken as flat at 0. Null when the ray never meets the ground (the sky).
 */
/** The ray through a screen point: where it starts (the near plane) and its way (unit). */
export function screenRay(camera: CameraLike, canvas: HTMLCanvasElement, clientX: number, clientY: number): { from: Vec3; dir: Vec3 } {
  const r = canvas.getBoundingClientRect();
  const nx = ((clientX - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((clientY - r.top) / r.height) * 2;
  const inv = invert(multiply(camera.projection(r.width / r.height), camera.view()));
  const un = (z: number): Vec3 => {
    const p = transformPoint(inv, [nx, ny, z]);
    return [p[0] / p[3], p[1] / p[3], p[2] / p[3]];
  };
  const a = un(-1);
  const b = un(1);
  const dir: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(dir[0], dir[1], dir[2]);
  return { from: a, dir: [dir[0] / len, dir[1] / len, dir[2] / len] };
}

export function pickGround(camera: CameraLike, canvas: HTMLCanvasElement, clientX: number, clientY: number, heightAt: (x: number, z: number) => number, size: number): Vec3 | null {
  const r = canvas.getBoundingClientRect();
  const nx = ((clientX - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((clientY - r.top) / r.height) * 2;
  const inv = invert(multiply(camera.projection(r.width / r.height), camera.view()));
  const un = (z: number): Vec3 => {
    const p = transformPoint(inv, [nx, ny, z]);
    return [p[0] / p[3], p[1] / p[3], p[2] / p[3]];
  };
  const a = un(-1);
  const b = un(1);
  const dir: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(dir[0], dir[1], dir[2]);
  dir[0] /= len; dir[1] /= len; dir[2] /= len;
  const h = (x: number, z: number) => (x < 0 || z < 0 || x >= size || z >= size ? 0 : heightAt(x, z));
  const at = (t: number): Vec3 => [a[0] + dir[0] * t, a[1] + dir[1] * t, a[2] + dir[2] * t];
  let t0 = 0;
  for (let t = 0.5; t < 800; t += 0.5) {
    const p = at(t);
    if (p[1] <= h(p[0], p[2])) {
      let lo = t0;
      let hi = t;
      for (let i = 0; i < 12; i++) {
        const m = (lo + hi) / 2;
        const q = at(m);
        if (q[1] <= h(q[0], q[2])) hi = m;
        else lo = m;
      }
      return at((lo + hi) / 2);
    }
    t0 = t;
  }
  return null;
}
