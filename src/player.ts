import type { Renderer, Vec3 } from 'gridfall-engine';
import { Crab } from './crab';
import type { Ground } from './ground';

/**
 * The player: a position on the sand, a facing and a velocity. The camera orbits freely round
 * a standing crab (look at its face); the moment the input pushes, the crab turns to face the
 * way the camera looks and moves relative to it: forward and back along the look, sideways
 * across it (a crab's sidestep), facing the same way throughout. The crab model follows this
 * each frame.
 */
export class Player {
  position: Vec3;
  /** Which way the crab faces (radians about +y): turns to the camera's yaw while moving, stays put otherwise. */
  yaw = 0;
  /** Walking speed (world units a second), and how many times that when running (Shift). */
  speed = 4.8;
  runFactor = 1.75;
  /** How fast it turns to face a new direction (per second; higher is snappier). */
  turnRate = 9;
  /** A jump's take-off speed (units a second, up) and the gravity that brings it down. */
  jumpSpeed = 6.5;
  gravity = 20;
  /** Height above the ground while jumping, and the speed up. */
  air = 0;
  private vy = 0;
  readonly velocity: Vec3 = [0, 0, 0];
  readonly crab: Crab;

  get airborne(): boolean {
    return this.air > 0 || this.vy > 0;
  }

  /** Snap the left (+1) or right (-1) pincer. */
  snap(side: 1 | -1): void {
    this.crab.snap(side);
  }

  constructor(renderer: Renderer, private readonly ground: Ground, start: Vec3) {
    this.position = [start[0], ground.heightAt(start[0], start[2]), start[2]];
    this.crab = new Crab(renderer, (x, z) => ground.heightAt(x, z), this.position, this.yaw);
  }

  /**
   * Move along `dir` (a direction on the ground, not necessarily unit; zero to stand still) while
   * turning to face `faceYaw`. Standing still, the facing is left alone unless `faceAlways` (the
   * top-down scheme: the crab follows the aim whether or not it walks).
   */
  update(dt: number, dir: Vec3, faceYaw: number, faceAlways = false, run = false, jump = false): void {
    const len = Math.hypot(dir[0], dir[2]);
    const x0 = this.position[0];
    const z0 = this.position[2];
    // Jumping: straight up off the ground, down under gravity; the walk carries on in the air.
    if (jump && !this.airborne) this.vy = this.jumpSpeed;
    if (this.airborne) {
      this.vy -= this.gravity * dt;
      this.air = Math.max(0, this.air + this.vy * dt);
      if (this.air === 0 && this.vy < 0) this.vy = 0;
    }
    if (len > 1e-4 || faceAlways) {
      // Turn the short way round, eased.
      const d = Math.atan2(Math.sin(faceYaw - this.yaw), Math.cos(faceYaw - this.yaw));
      this.yaw += d * Math.min(1, this.turnRate * dt);
    }
    if (len > 1e-4) {
      const nx = dir[0] / len;
      const nz = dir[2] / len;
      const step = this.speed * (run ? this.runFactor : 1) * Math.min(1, len) * dt;
      const margin = 1.5;
      this.position[0] = Math.min(this.ground.size - margin, Math.max(margin, x0 + nx * step));
      this.position[2] = Math.min(this.ground.size - margin, Math.max(margin, z0 + nz * step));
    }
    this.position[1] = this.ground.heightAt(this.position[0], this.position[2]) + this.air;
    if (dt > 0) {
      this.velocity[0] = (this.position[0] - x0) / dt;
      this.velocity[1] = this.vy;
      this.velocity[2] = (this.position[2] - z0) / dt;
    }
    this.crab.update(dt, this.position, this.yaw, this.velocity, this.airborne);
  }
}
