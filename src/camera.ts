import { lookAt, orthographic, perspective, type CameraLike, type Mat4, type Vec3 } from 'gridfall-engine';

/** How far back the orthographic eye stands: far enough that nothing on the beach is behind it. */
export const ORTHO_BACK = 200;

/**
 * A third-person follow camera: looks at a point just above the crab from behind it, at a
 * yaw / pitch / distance the player turns and zooms, in perspective or orthographically
 * (the same framing at the zoom distance, from an eye pulled far back along the same line).
 * Implements the engine's CameraLike (eye, view, projection, target, distance, viewPoint,
 * rayStart), so shadows and grass centre on the crab and fog is measured from where a
 * perspective camera would stand. Input handling lives in main.ts; this only holds the framing.
 */
export class ThirdPersonCamera implements CameraLike {
  /** The point looked at (the crab, lifted by `height`); eased toward `follow` each frame. */
  target: Vec3 = [0, 0, 0];
  /** Where the crab is now. */
  follow: Vec3 = [0, 0, 0];
  /** How far above the crab's feet the camera looks. */
  height = 1.2;
  yaw = 0;
  pitch = (18 * Math.PI) / 180;
  distance = 9;
  fov = (50 * Math.PI) / 180;
  near = 0.1;
  far = 400;
  minDistance = 3;
  maxDistance = 30;
  minPitch = (-5 * Math.PI) / 180;
  maxPitch = (80 * Math.PI) / 180;
  /** How quickly the look-at point catches up with the crab (per second; higher is stiffer). */
  stiffness = 10;
  /** Orthographic instead of perspective. */
  ortho = false;

  /** Where a perspective camera stands for this view: at the zoom distance behind the target. */
  viewPoint(): Vec3 {
    return this.eyeAt(this.distance);
  }

  eye(): Vec3 {
    return this.eyeAt(this.ortho ? ORTHO_BACK : this.distance);
  }

  private eyeAt(back: number): Vec3 {
    const cp = Math.cos(this.pitch);
    return [this.target[0] - Math.sin(this.yaw) * cp * back, this.target[1] + Math.sin(this.pitch) * back, this.target[2] - Math.cos(this.yaw) * cp * back];
  }

  /** How far along each view ray the scene starts: the orthographic eye stands ORTHO_BACK back, not at the zoom distance. */
  rayStart(): number {
    return this.ortho ? Math.max(0, ORTHO_BACK - this.distance) : 0;
  }

  view(): Mat4 {
    return lookAt(this.eye(), this.target);
  }

  projection(aspect: number): Mat4 {
    if (!this.ortho) return perspective(this.fov, aspect, this.near, this.far);
    const halfH = this.distance * Math.tan(this.fov / 2);
    return orthographic(-halfH * aspect, halfH * aspect, -halfH, halfH, 1, ORTHO_BACK * 3);
  }

  /** The view distance to the target: where depth of field focuses when it follows the crab. */
  focusDistance(): number {
    return this.ortho ? ORTHO_BACK : this.distance;
  }

  /** The direction the camera faces along the ground (unit, flat). Walking "forward" means this way. */
  forward(): Vec3 {
    return [Math.sin(this.yaw), 0, Math.cos(this.yaw)];
  }

  /** The camera's right along the ground (forward × up). */
  right(): Vec3 {
    return [-Math.cos(this.yaw), 0, Math.sin(this.yaw)];
  }

  rotate(dyaw: number, dpitch: number): void {
    this.yaw += dyaw;
    this.pitch = Math.min(this.maxPitch, Math.max(this.minPitch, this.pitch + dpitch));
  }

  zoom(factor: number): void {
    this.distance = Math.min(this.maxDistance, Math.max(this.minDistance, this.distance * factor));
  }

  /** Ease the look-at point toward the crab. */
  update(dt: number): void {
    const k = 1 - Math.exp(-this.stiffness * dt);
    this.target[0] += (this.follow[0] - this.target[0]) * k;
    this.target[1] += (this.follow[1] + this.height - this.target[1]) * k;
    this.target[2] += (this.follow[2] - this.target[2]) * k;
  }
}
