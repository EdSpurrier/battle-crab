import { lookAt, perspective, type Mat4, type Vec3 } from 'gridfall-engine';

/**
 * A third-person follow camera: looks at a point just above the crab from behind it, at a
 * yaw / pitch / distance the player turns and zooms. Implements the engine's CameraLike
 * (eye, view, projection, target, distance), so shadows and grass centre on the crab.
 * Input handling lives in main.ts; this only holds the framing.
 */
export class ThirdPersonCamera {
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

  eye(): Vec3 {
    const cp = Math.cos(this.pitch);
    return [
      this.target[0] - Math.sin(this.yaw) * cp * this.distance,
      this.target[1] + Math.sin(this.pitch) * this.distance,
      this.target[2] - Math.cos(this.yaw) * cp * this.distance,
    ];
  }

  view(): Mat4 {
    return lookAt(this.eye(), this.target);
  }

  projection(aspect: number): Mat4 {
    return perspective(this.fov, aspect, this.near, this.far);
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
