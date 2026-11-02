import { Mesh, box, material, multiply, rotationY, translation, type Instance, type Mat4, type Renderer, type Vec3 } from 'gridfall-engine';
import type { Ground } from './ground';

/**
 * The crab, as a box for now: a position, a facing and a speed. Walks where it is pushed (a
 * direction on the ground from the input) and turns to face that way. The shell and the weapon
 * platform built on it come later; for now this is one box that the camera follows.
 */
export class Player {
  position: Vec3;
  /** Which way the box faces (radians about +y); turns toward the walk direction. */
  yaw = 0;
  speed = 4.5;
  turnRate = 10;
  readonly instance: Instance;
  private readonly model: Mat4 = new Float32Array(16);
  private readonly tmpT: Mat4 = new Float32Array(16);
  private readonly tmpR: Mat4 = new Float32Array(16);

  constructor(renderer: Renderer, private readonly ground: Ground, start: Vec3) {
    this.position = [start[0], start[1], start[2]];
    // A crab-coloured body box (linear rgb), long along +z (the way it faces), low to the sand.
    const body = box(-0.45, 0, -0.6, 0.45, 0.55, 0.6, [0.5, 0.08, 0.03]);
    this.instance = { mesh: new Mesh(renderer.gl, body), model: this.model, material: material({ roughness: 0.6 }) };
    renderer.instances.push(this.instance);
    this.pose();
  }

  /** Walk along `dir` (a direction on the ground, not necessarily unit; zero to stand still). */
  update(dt: number, dir: Vec3): void {
    const len = Math.hypot(dir[0], dir[2]);
    if (len > 1e-4) {
      const nx = dir[0] / len;
      const nz = dir[2] / len;
      const step = this.speed * Math.min(1, len) * dt;
      const margin = 1;
      this.position[0] = Math.min(this.ground.size - margin, Math.max(margin, this.position[0] + nx * step));
      this.position[2] = Math.min(this.ground.size - margin, Math.max(margin, this.position[2] + nz * step));
      // Turn toward the walk direction the short way round.
      const want = Math.atan2(nx, nz);
      let d = want - this.yaw;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      this.yaw += d * Math.min(1, this.turnRate * dt);
    }
    this.position[1] = this.ground.heightAt(this.position[0], this.position[2]);
    this.pose();
  }

  private pose(): void {
    translation(this.position[0], this.position[1], this.position[2], this.tmpT);
    rotationY(this.yaw, this.tmpR);
    multiply(this.tmpT, this.tmpR, this.model);
  }
}
