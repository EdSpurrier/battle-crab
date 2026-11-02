import { OverlayMesh, translation, type Renderer, type Vec3 } from 'gridfall-engine';
import type { ThirdPersonCamera } from './camera';
import type { Ground } from './ground';
import { band, emptyOverlay, joinOverlays, ringPoints } from './overlayShapes';
import { pickGround } from './pick';

/**
 * Two ways to play, switched with a toggle (the settings, or C):
 * - 3rd person: the camera orbits behind the crab with the mouse (pointer lock), W/S along the
 *   look, A/D across it, the crab facing the camera's way while it moves;
 * - topdown: an orthographic view from 45 degrees above, following the crab (an RTS framing;
 *   Q/E turn it by eighths, the wheel zooms); WASD moves relative to the view; the mouse moves an
 *   aim marker over the ground and the crab always faces it.
 * The third-person camera's settings are kept while in top down and put back on return.
 */
export type ControlMode = '3rd person' | 'topdown';
export const CONTROL_MODES: ControlMode[] = ['3rd person', 'topdown'];

interface CameraSnapshot {
  ortho: boolean;
  pitch: number;
  distance: number;
  lift: number;
  aim: number;
  shoulder: number;
  height: number;
  minPitch: number;
  maxPitch: number;
}

const snapshot = (c: ThirdPersonCamera): CameraSnapshot => ({ ortho: c.ortho, pitch: c.pitch, distance: c.distance, lift: c.lift, aim: c.aim, shoulder: c.shoulder, height: c.height, minPitch: c.minPitch, maxPitch: c.maxPitch });
const restore = (c: ThirdPersonCamera, s: CameraSnapshot): void => {
  c.ortho = s.ortho; c.pitch = s.pitch; c.distance = s.distance; c.lift = s.lift; c.aim = s.aim; c.shoulder = s.shoulder; c.height = s.height; c.minPitch = s.minPitch; c.maxPitch = s.maxPitch;
};

/** What the frame needs from the controls: where to walk, which way to face, whether to face it standing still too. */
export interface Intent {
  dir: Vec3;
  faceYaw: number;
  faceAlways: boolean;
  /** Shift held: run. */
  run: boolean;
}

export class Controls {
  mode: ControlMode = '3rd person';
  /** Top down: the ground point under the mouse (null: none yet, or the sky). */
  aim: Vec3 | null = null;
  /** The camera's tilt and zoom in top down (settings). */
  topPitch = (45 * Math.PI) / 180;
  topDistance = 22;
  private saved: CameraSnapshot | null = null;
  private mouse: [number, number] | null = null;
  private readonly marker: { mesh: OverlayMesh; model: Float32Array; onTop: boolean };
  /** Called after the mode changes (the HUD, the pointer lock). */
  onModeChange: ((mode: ControlMode) => void) | null = null;

  constructor(private readonly renderer: Renderer, private readonly camera: ThirdPersonCamera, private readonly canvas: HTMLCanvasElement, private readonly ground: Ground, readonly lookSpeed: number) {
    this.marker = { mesh: new OverlayMesh(renderer.gl, emptyOverlay()), model: translation(0, 0, 0), onTop: true };
    renderer.overlays.push(this.marker);
  }

  get topDown(): boolean {
    return this.mode === 'topdown';
  }

  setMode(mode: ControlMode): void {
    if (mode === this.mode) return;
    const c = this.camera;
    if (mode === 'topdown') {
      this.saved = snapshot(c);
      c.ortho = true;
      c.minPitch = (20 * Math.PI) / 180;
      c.maxPitch = (89 * Math.PI) / 180;
      c.pitch = this.topPitch;
      c.distance = this.topDistance;
      c.lift = 0;
      c.aim = 0;
      c.shoulder = 0;
      c.height = 0.6;
    } else {
      this.topPitch = c.pitch;
      this.topDistance = c.distance;
      if (this.saved) restore(c, this.saved);
      this.aim = null;
      this.marker.mesh.setData(emptyOverlay());
    }
    this.mode = mode;
    this.onModeChange?.(mode);
  }

  toggle(): void {
    this.setMode(this.topDown ? '3rd person' : 'topdown');
  }

  /** The mouse moved: third person orbits by the movement; top down remembers where the cursor is. */
  mouseMoved(e: MouseEvent, overPanel: boolean, locked: boolean): void {
    if (this.topDown) {
      this.mouse = overPanel ? null : [e.clientX, e.clientY];
      return;
    }
    if (!locked && (overPanel || e.buttons)) return;
    this.camera.rotate(-e.movementX * this.lookSpeed, e.movementY * this.lookSpeed);
  }

  /** Top down: turn the view by an eighth (Q / E). */
  turnView(steps: number): void {
    if (this.topDown) this.camera.yaw += (steps * Math.PI) / 4;
  }

  /** A key for this scheme (handled: true). */
  key(code: string): boolean {
    if (code === 'KeyQ') return (this.turnView(1), true);
    if (code === 'KeyE') return (this.turnView(-1), true);
    return false;
  }

  /** Each frame: the walk direction from the keys (in the camera's frame) and which way to face. */
  update(keys: Set<string>, crab: Vec3): Intent {
    let f = 0;
    let r = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1;
    const fw = this.camera.forward();
    const rt = this.camera.right();
    const dir: Vec3 = [fw[0] * f + rt[0] * r, 0, fw[2] * f + rt[2] * r];
    const run = keys.has('ShiftLeft') || keys.has('ShiftRight');
    if (!this.topDown) return { dir, faceYaw: this.camera.yaw, faceAlways: false, run };
    this.aim = this.mouse ? pickGround(this.camera, this.canvas, this.mouse[0], this.mouse[1], (x, z) => this.ground.heightAt(x, z), this.ground.size) : null;
    this.drawMarker();
    const faceYaw = this.aim ? Math.atan2(this.aim[0] - crab[0], this.aim[2] - crab[2]) : this.camera.yaw;
    return { dir, faceYaw, faceAlways: !!this.aim, run };
  }

  /** The aim marker: a ring with four ticks, on the ground under the mouse. */
  private drawMarker(): void {
    const a = this.aim;
    if (!a) return this.marker.mesh.setData(emptyOverlay());
    const h = (x: number, z: number) => this.ground.heightAt(x, z);
    const white: [number, number, number, number] = [1, 1, 1, 0.95];
    const dark: [number, number, number, number] = [0.05, 0.05, 0.05, 0.6];
    const tick = (dx: number, dz: number) => band([[a[0] + dx * 0.55, 0, a[2] + dz * 0.55], [a[0] + dx * 0.95, 0, a[2] + dz * 0.95], [a[0] + dx * 0.95 + dz * 0.001, 0, a[2] + dz * 0.95 + dx * 0.001]], 0.08, white, h, 0.05);
    this.marker.mesh.setData(joinOverlays([band(ringPoints(a[0], a[2], 0.5, 32), 0.14, dark, h, 0.04), band(ringPoints(a[0], a[2], 0.5, 32), 0.07, white, h, 0.05), tick(1, 0), tick(-1, 0), tick(0, 1), tick(0, -1)]));
  }
}
