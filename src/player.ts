import type { Renderer, Vec3 } from 'gridfall-engine';
import { Crab } from './crab';
import type { Ground } from './ground';
import type { Obstacle } from './impacts';
import { SHELLS, weightFactor, type ClawKind, type ShellType } from './shell';

/** A full sprint lasts this long unladen (weight shortens it: × weightFactor), and comes all the way back in STAMINA_REST. */
const STAMINA_SECONDS = 7;
const STAMINA_REST = 5;

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
  jumpSpeed = 8;
  gravity = 20;
  /** Height above the ground while jumping, and the speed up. */
  air = 0;
  private vy = 0;
  readonly velocity: Vec3 = [0, 0, 0];
  readonly crab: Crab;
  /** Hit points: the shell's armour; at zero the crab is cracked. */
  readonly maxHealth: number;
  health: number;
  /** Seconds of invincibility left (a starfish eaten): nothing hurts, and the crab glows. */
  invincibleFor = 0;
  private readonly shell: ShellType;

  get alive(): boolean {
    return this.health > 0;
  }

  hurt(amount: number): void {
    if (!this.alive || this.invincibleFor > 0) return;
    this.health = Math.max(0, this.health - amount);
    this.crab.flash();
    if (this.health === 0) this.crab.collapse();
  }

  /** The solid things on the beach (rocks, boulders, driftwood): the crab walks round them, not through. */
  blockers: Obstacle[] = [];
  private readonly radius = 0.75;

  /** Push the crab out of any blocker it has walked into (a round crab against turned boxes, on the ground plane). */
  private unblock(): void {
    for (const o of this.blockers) {
      if (o.center[1] + o.half[1] < this.position[1] + 0.2) continue;
      const c = Math.cos(-o.yaw);
      const s = Math.sin(-o.yaw);
      const dx = this.position[0] - o.center[0];
      const dz = this.position[2] - o.center[2];
      const lx = dx * c + dz * s;
      const lz = -dx * s + dz * c;
      const px = o.half[0] + this.radius - Math.abs(lx);
      const pz = o.half[2] + this.radius - Math.abs(lz);
      if (px <= 0 || pz <= 0) continue;
      // Out along the shallower overlap, in the box's frame, then back to the world.
      let ox = 0;
      let oz = 0;
      if (px < pz) ox = (lx >= 0 ? 1 : -1) * px;
      else oz = (lz >= 0 ? 1 : -1) * pz;
      const cw = Math.cos(o.yaw);
      const sw = Math.sin(o.yaw);
      this.position[0] += ox * cw + oz * sw;
      this.position[2] += -ox * sw + oz * cw;
    }
  }

  /** What is carried on the shell weighs this much: the heavier, the slower, the lower the jump and the shorter the sprint. */
  setWeight(weight: number): void {
    const f = weightFactor(weight);
    this.speed = 4.8 * this.shell.speed * f;
    this.jumpSpeed = 8 * Math.sqrt(this.shell.jump * f);
    this.staminaSeconds = STAMINA_SECONDS * f;
  }

  /** Stamina for sprinting, 0..1: spent while running, back while not; empty, the crab is winded until a third is back. */
  stamina = 1;
  winded = false;
  private staminaSeconds = STAMINA_SECONDS;
  /** Running this frame. */
  running = false;

  get airborne(): boolean {
    return this.air > 0 || this.vy > 0;
  }

  /** Snap the left (+1) or right (-1) pincer. */
  snap(side: 1 | -1): void {
    this.crab.snap(side);
  }

  constructor(renderer: Renderer, private readonly ground: Ground, start: Vec3, shell: ShellType = SHELLS[0], claws: ClawKind = 'own') {
    this.position = [start[0], ground.heightAt(start[0], start[2]), start[2]];
    this.shell = shell;
    this.crab = new Crab(renderer, (x, z) => ground.heightAt(x, z), this.position, this.yaw, shell, claws);
    // The shell's own weight: slower with a heavy one, and a lower jump (height goes with the square of the take-off speed).
    this.setWeight(0);
    this.maxHealth = shell.armor;
    this.health = shell.armor;
  }

  /** Back whole at `at` (a respawn). */
  revive(at: Vec3): void {
    this.position[0] = at[0];
    this.position[2] = at[2];
    this.position[1] = this.ground.heightAt(at[0], at[2]);
    this.air = 0;
    this.vy = 0;
    this.health = this.maxHealth;
    this.stamina = 1;
    this.winded = false;
    this.crab.revive();
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
    if (this.invincibleFor > 0) {
      this.invincibleFor = Math.max(0, this.invincibleFor - dt);
      const pulse = 0.45 + 0.25 * Math.sin(performance.now() / 90);
      this.crab.setTeam(this.invincibleFor > 0 ? [1, 0.85, 0.3, pulse] : null);
    }
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
    // Sprinting spends stamina; standing or walking gets it back.
    this.running = run && len > 1e-4 && !this.winded && this.stamina > 0;
    if (this.running) {
      this.stamina = Math.max(0, this.stamina - dt / this.staminaSeconds);
      if (this.stamina === 0) this.winded = true;
    } else {
      this.stamina = Math.min(1, this.stamina + dt / STAMINA_REST);
      if (this.winded && this.stamina >= 0.3) this.winded = false;
    }
    if (len > 1e-4) {
      const nx = dir[0] / len;
      const nz = dir[2] / len;
      const step = this.speed * (this.running ? this.runFactor : 1) * Math.min(1, len) * dt;
      const margin = 1.5;
      this.position[0] = Math.min(this.ground.size - margin, Math.max(margin, x0 + nx * step));
      this.position[2] = Math.min(this.ground.size - margin, Math.max(margin, z0 + nz * step));
    }
    this.unblock();
    this.position[1] = this.ground.heightAt(this.position[0], this.position[2]) + this.air;
    if (dt > 0) {
      this.velocity[0] = (this.position[0] - x0) / dt;
      this.velocity[1] = this.vy;
      this.velocity[2] = (this.position[2] - z0) / dt;
    }
    this.crab.update(dt, this.position, this.yaw, this.velocity, this.airborne);
  }
}
