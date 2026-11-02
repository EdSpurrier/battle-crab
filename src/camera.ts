import { lookAt, orthographic, perspective, type CameraLike, type Mat4, type Vec3 } from 'gridfall-engine';

/** How far back the orthographic eye stands: far enough that nothing on the beach is behind it. */
export const ORTHO_BACK = 200;

/**
 * A third-person follow camera: looks at a point just above the crab from behind it, at a
 * yaw / pitch / distance the player turns and zooms, in perspective or orthographically
 * (the same framing at the zoom distance, from an eye pulled far back along the same line).
 * Kept above the ground: when the pitch asked for would put the eye under the sand (plus
 * `clearance`), the view tilts up just enough. Implements the engine's CameraLike (eye, view,
 * projection, target, distance, viewPoint, rayStart), so shadows and grass centre on the crab
 * and fog is measured from where a perspective camera would stand. Input handling lives in
 * main.ts; this only holds the framing.
 */
export class ThirdPersonCamera implements CameraLike {
  /** The point looked at (the crab, lifted by `height`); eased toward `follow` each frame. */
  target: Vec3 = [0, 0, 0];
  /** Where the crab is now. */
  follow: Vec3 = [0, 0, 0];
  /** How far above the crab's feet the camera looks. */
  height = 1.2;
  yaw = 0;
  /** The tilt asked for; `tilt` is what is shown once the ground has had its say. */
  pitch = (18 * Math.PI) / 180;
  distance = 9;
  fov = (50 * Math.PI) / 180;
  near = 0.1;
  far = 400;
  minDistance = 3;
  maxDistance = 30;
  minPitch = (-15 * Math.PI) / 180;
  maxPitch = (80 * Math.PI) / 180;
  /** How quickly the look-at point catches up with the crab (per second; higher is stiffer). */
  stiffness = 10;
  /** Orthographic instead of perspective. */
  ortho = false;
  /** The ground under a point, when the camera is to stay above it. */
  groundHeight: ((x: number, z: number) => number) | null = null;
  /** How far above the ground the eye must stay (world units). */
  clearance = 0.6;
  /**
   * The rig: the whole camera (eye and the point it looks at) lifted by `lift` and moved
   * sideways by `shoulder` (right of the crab when positive), so a raised camera still faces
   * forward rather than down at the crab; `aim` tips the view by raising only the look-at point.
   */
  lift = 0;
  shoulder = 0;
  aim = 0;
  private tilt = this.pitch;

  /** The point the rig pivots on: the target, lifted and moved to the shoulder. */
  private pivot(): Vec3 {
    const r = this.right();
    return [this.target[0] + r[0] * this.shoulder, this.target[1] + this.lift, this.target[2] + r[2] * this.shoulder];
  }

  /** Where a perspective camera stands for this view: at the zoom distance behind the target. */
  viewPoint(): Vec3 {
    return this.eyeAt(this.distance);
  }

  eye(): Vec3 {
    return this.eyeAt(this.ortho ? ORTHO_BACK : this.distance);
  }

  private eyeAt(back: number, tilt = this.tilt): Vec3 {
    const cp = Math.cos(tilt);
    const p = this.pivot();
    return [p[0] - Math.sin(this.yaw) * cp * back, p[1] + Math.sin(tilt) * back, p[2] - Math.cos(this.yaw) * cp * back];
  }

  /** How far along each view ray the scene starts: the orthographic eye stands ORTHO_BACK back, not at the zoom distance. */
  rayStart(): number {
    return this.ortho ? Math.max(0, ORTHO_BACK - this.distance) : 0;
  }

  view(): Mat4 {
    const p = this.pivot();
    return lookAt(this.eye(), [p[0], p[1] + this.aim, p[2]]);
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

  /** Ease the look-at point toward the crab, then keep the eye above the ground. */
  update(dt: number): void {
    const k = 1 - Math.exp(-this.stiffness * dt);
    this.target[0] += (this.follow[0] - this.target[0]) * k;
    this.target[1] += (this.follow[1] + this.height - this.target[1]) * k;
    this.target[2] += (this.follow[2] - this.target[2]) * k;
    this.tilt = this.pitch;
    if (!this.groundHeight) return;
    // The eye's footprint moves as the tilt changes; two rounds settle it on flat and gentle ground.
    for (let i = 0; i < 2; i++) {
      const eye = this.eyeAt(this.distance);
      const floor = this.groundHeight(eye[0], eye[2]) + this.clearance;
      if (eye[1] >= floor) break;
      const s = Math.min(1, Math.max(-1, (floor - this.pivot()[1]) / this.distance));
      this.tilt = Math.max(this.tilt, Math.asin(s));
    }
  }
}
