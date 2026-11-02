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
  /** The zoom actually shown: pulled in from `distance` while ground stands between the crab and the eye, eased back out after. */
  private shown = this.distance;
  /** Aiming down the barrel (the right mouse button): 1 narrows the view and brings the camera in; eased toward `aimZoom`. */
  aimZoom = 0;
  private aimed = 0;
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

  /** Where a perspective camera stands for this view: at the zoom distance (as shown) behind the target. */
  viewPoint(): Vec3 {
    return this.eyeAt(this.shown);
  }

  eye(): Vec3 {
    return this.eyeAt(this.ortho ? ORTHO_BACK : this.shown);
  }

  private eyeAt(back: number, tilt = this.tilt): Vec3 {
    const cp = Math.cos(tilt);
    const p = this.pivot();
    return [p[0] - Math.sin(this.yaw) * cp * back, p[1] + Math.sin(tilt) * back, p[2] - Math.cos(this.yaw) * cp * back];
  }

  /** How far along each view ray the scene starts: the orthographic eye stands ORTHO_BACK back, not at the zoom distance. */
  rayStart(): number {
    return this.ortho ? Math.max(0, ORTHO_BACK - this.shown) : 0;
  }

  view(): Mat4 {
    const p = this.pivot();
    return lookAt(this.eye(), [p[0], p[1] + this.aim, p[2]]);
  }

  projection(aspect: number): Mat4 {
    const fov = this.fov * (1 - 0.5 * this.aimed);
    if (!this.ortho) return perspective(fov, aspect, this.near, this.far);
    const halfH = this.shown * Math.tan(fov / 2);
    return orthographic(-halfH * aspect, halfH * aspect, -halfH, halfH, 1, ORTHO_BACK * 3);
  }

  /** The view distance to the target: where depth of field focuses when it follows the crab. */
  focusDistance(): number {
    return this.ortho ? ORTHO_BACK : this.shown;
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

  /**
   * Ease the look-at point toward the crab, then keep the eye above the ground. The eye checked is
   * the virtual one at the zoom distance (where a perspective camera stands), whichever the
   * projection: the orthographic eye is far back and its height means nothing. Orthographic, the
   * view ray behind that point is checked too (further and further back along the same line), so
   * the parallel rays into the frame do not pass through a rise behind the camera.
   */
  update(dt: number): void {
    const k = 1 - Math.exp(-this.stiffness * dt);
    this.target[0] += (this.follow[0] - this.target[0]) * k;
    this.target[1] += (this.follow[1] + this.height - this.target[1]) * k;
    this.target[2] += (this.follow[2] - this.target[2]) * k;
    this.aimed += (this.aimZoom - this.aimed) * (1 - Math.exp(-12 * dt));
    this.tilt = this.pitch;
    if (!this.groundHeight) {
      this.shown = this.distance;
      return;
    }
    const pivotY = this.pivot()[1];
    // The eye's footprint moves as the tilt changes; a few rounds settle it on flat and gentle ground.
    for (let i = 0; i < 3; i++) {
      let need = -Infinity;
      for (const d of this.ortho ? [this.distance, this.distance + 2, this.distance + 4, this.distance + 8, this.distance + 16, this.distance + 32, this.distance + 64] : [this.distance]) {
        const p = this.eyeAt(d);
        const floor = this.groundHeight(p[0], p[2]) + this.clearance;
        if (p[1] < floor) need = Math.max(need, (floor - pivotY) / d);
      }
      if (need === -Infinity) break;
      this.tilt = Math.max(this.tilt, Math.asin(Math.min(1, Math.max(-1, need))));
    }
    // Ground between the crab and the eye (a cliff behind the crab): the camera pulls in along its own
    // line to just in front of it, at once; it eases back out as the way clears.
    const wanted = this.distance * (1 - 0.4 * this.aimed);
    let clear = wanted;
    const steps = Math.max(4, Math.ceil(wanted / 0.25));
    for (let s = 1; s <= steps; s++) {
      const d = (wanted * s) / steps;
      const p = this.eyeAt(d);
      if (p[1] < this.groundHeight(p[0], p[2]) + this.clearance * 0.5) {
        clear = Math.max(this.minDistance * 0.4, d - 0.4);
        break;
      }
    }
    if (clear < this.shown) this.shown = clear;
    else this.shown += (clear - this.shown) * (1 - Math.exp(-6 * dt));
  }
}
