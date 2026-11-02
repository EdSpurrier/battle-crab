import type { Renderer, Vec3 } from 'gridfall-engine';
import { Crab } from './crab';
import type { Ground } from './ground';

/**
 * The player: a position on the sand, a facing (where the camera aims: the crab always faces the
 * way the player looks) and a velocity. Scuttles in any direction the input pushes, sideways as
 * readily as forward, as a crab does. The crab model follows this each frame.
 */
export class Player {
  position: Vec3;
  /** Which way the crab faces (radians about +y): set from the camera every frame. */
  yaw = 0;
  speed = 3.2;
  readonly velocity: Vec3 = [0, 0, 0];
  readonly crab: Crab;

  constructor(renderer: Renderer, private readonly ground: Ground, start: Vec3) {
    this.position = [start[0], ground.heightAt(start[0], start[2]), start[2]];
    this.crab = new Crab(renderer, (x, z) => ground.heightAt(x, z), this.position, this.yaw);
  }

  /** Move along `dir` (a direction on the ground, not necessarily unit; zero to stand still) facing `yaw`. */
  update(dt: number, dir: Vec3, yaw: number): void {
    this.yaw = yaw;
    const len = Math.hypot(dir[0], dir[2]);
    const x0 = this.position[0];
    const z0 = this.position[2];
    if (len > 1e-4) {
      const step = this.speed * Math.min(1, len) * dt;
      const margin = 1.5;
      this.position[0] = Math.min(this.ground.size - margin, Math.max(margin, x0 + (dir[0] / len) * step));
      this.position[2] = Math.min(this.ground.size - margin, Math.max(margin, z0 + (dir[2] / len) * step));
    }
    this.position[1] = this.ground.heightAt(this.position[0], this.position[2]);
    if (dt > 0) {
      this.velocity[0] = (this.position[0] - x0) / dt;
      this.velocity[2] = (this.position[2] - z0) / dt;
    }
    this.crab.update(dt, this.position, this.yaw, this.velocity);
  }
}
