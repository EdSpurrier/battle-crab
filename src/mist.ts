import { fogVolume, type FogVolume, type Renderer } from 'gridfall-engine';
import type { MistDef } from './map';

/**
 * The map's mist banks in the renderer: one fog volume per MistDef, kept in step with the defs
 * (`sync` after editing one), scaled all together by a thickness (the Look's slider).
 */
export class MistSet {
  readonly volumes: FogVolume[] = [];
  private thickness = 1;

  constructor(private readonly renderer: Renderer, public defs: MistDef[]) {
    this.rebuild(defs);
  }

  /** Throw the volumes away and make them again from `defs` (a map loaded). */
  rebuild(defs: MistDef[]): void {
    const list = this.renderer.fogVolumes.volumes;
    for (const v of this.volumes) {
      const i = list.indexOf(v);
      if (i >= 0) list.splice(i, 1);
    }
    this.volumes.length = 0;
    this.defs = defs;
    defs.forEach((_, i) => this.add(i));
  }

  /** A volume for def `i` (already in `defs`). */
  add(i: number): FogVolume {
    const v = fogVolume();
    this.volumes.splice(i, 0, v);
    this.renderer.fogVolumes.volumes.push(v);
    this.sync(i);
    return v;
  }

  remove(i: number): void {
    const [v] = this.volumes.splice(i, 1);
    const list = this.renderer.fogVolumes.volumes;
    const k = list.indexOf(v);
    if (k >= 0) list.splice(k, 1);
    this.defs.splice(i, 1);
  }

  /** Copy def `i` into its volume. */
  sync(i: number): void {
    const d = this.defs[i];
    const v = this.volumes[i];
    if (!d || !v) return;
    v.center = [d.center[0], d.center[1], d.center[2]];
    v.size = [d.size[0], d.size[1], d.size[2]];
    v.yaw = d.yaw;
    v.color = [d.color[0], d.color[1], d.color[2]];
    v.density = d.density * this.thickness;
    v.softness = d.softness;
    v.falloff = d.falloff;
    v.noise = d.noise;
    v.noiseScale = d.noiseScale;
    v.speed = d.speed;
    v.direction = d.direction;
    v.rise = d.rise;
    v.churn = d.churn;
    v.glow = [d.glow[0], d.glow[1], d.glow[2]];
    v.glowStrength = d.glowStrength;
  }

  /** Every bank's density × this. */
  setThickness(k: number): void {
    this.thickness = k;
    this.defs.forEach((_, i) => this.sync(i));
  }
}
