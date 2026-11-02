import { fogVolume, type FogVolume, type Renderer } from 'gridfall-engine';
import type { ThirdPersonCamera } from './camera';
import { SettingsPanel } from './settings';

/**
 * The look: the camera and visual settings a player (or we, tuning) can change, in a panel
 * (Tab). Camera: perspective or orthographic, field of view, depth of field (focus following the
 * crab or set by hand). Fog: distance fog's start and end. Mist: the volumetric fog (sunlit haze
 * near the ground, light shafts) and patches of rolling mist placed on the beach.
 */
export interface Look {
  panel: SettingsPanel;
  /** Each frame: keeps depth of field focused on the crab when set to follow it. */
  update(): void;
}

const FOG_OFF: [number, number] = [1e4, 2e4];

export function installLook(parent: HTMLElement, renderer: Renderer, camera: ThirdPersonCamera, beach: number): Look {
  const post = renderer.post.settings;
  const panel = new SettingsPanel(parent, 'Settings (Tab)');

  // ---------- mist patches on the beach: a low layer over all of it and two thicker banks, all one switch.
  const banks: { volume: FogVolume; density: number }[] = [];
  const bank = (over: Partial<FogVolume>) => {
    const volume = fogVolume({ color: [0.8, 0.86, 0.92], softness: 0.5, falloff: 0.9, noise: 0.7, noiseScale: 5, speed: 0.4, direction: 60, churn: 0.15, ...over });
    renderer.fogVolumes.volumes.push(volume);
    banks.push({ volume, density: volume.density });
  };
  bank({ center: [beach / 2, 0.5, beach / 2], size: [beach, 1.2, beach], density: 0.12, noiseScale: 9 });
  bank({ center: [beach / 2 + 10, 0.9, beach / 2 - 8], size: [12, 2, 9], yaw: 25, density: 0.5 });
  bank({ center: [beach / 2 - 12, 0.9, beach / 2 + 9], size: [10, 1.8, 14], yaw: -40, density: 0.45 });
  let mistThickness = 1;
  const applyMist = () => {
    for (const b of banks) b.volume.density = b.density * mistThickness;
  };

  // ---------- distance fog: measured from the eye, so in orthographic (the eye pulled far back) it is pushed back as far.
  let fogOn = true;
  let fogStart = 25;
  let fogEnd = 110;
  let fogBack = -1;
  const applyFog = () => {
    fogBack = camera.rayStart();
    renderer.fogRange = fogOn ? [fogStart + fogBack, Math.max(fogStart + 1, fogEnd) + fogBack] : FOG_OFF;
  };
  applyFog();

  // ---------- depth of field: focus follows the crab unless set by hand
  let focusFollows = true;
  let focusAt = 9;
  post.dof = false;
  post.dofRange = 3;
  post.dofFalloff = 14;
  post.dofBlur = 6;

  panel
    .section('Camera')
    .choice('camera.type', 'Projection', ['perspective', 'orthographic'], () => (camera.ortho ? 'orthographic' : 'perspective'), (v) => (camera.ortho = v === 'orthographic'))
    .slider('camera.fov', 'Field of view', 30, 90, 1, () => Math.round((camera.fov * 180) / Math.PI), (v) => (camera.fov = (v * Math.PI) / 180), (v) => `${Math.round(v)}°`)
    .toggle_('camera.dof', 'Depth of field', () => post.dof, (v) => (post.dof = v))
    .choice('camera.focus', 'Focus', ['on the crab', 'by hand'], () => (focusFollows ? 'on the crab' : 'by hand'), (v) => (focusFollows = v === 'on the crab'))
    .slider('camera.focusAt', 'Focus distance', 2, 60, 0.5, () => focusAt, (v) => (focusAt = v))
    .slider('camera.focusRange', 'Sharp range', 0.5, 20, 0.5, () => post.dofRange, (v) => (post.dofRange = v))
    .slider('camera.blur', 'Blur', 1, 16, 1, () => post.dofBlur, (v) => (post.dofBlur = v))
    .section('Fog')
    .toggle_('fog.on', 'Distance fog', () => fogOn, (v) => { fogOn = v; applyFog(); })
    .slider('fog.start', 'Starts at', 5, 200, 1, () => fogStart, (v) => { fogStart = v; applyFog(); })
    .slider('fog.end', 'Thick by', 20, 400, 1, () => fogEnd, (v) => { fogEnd = v; applyFog(); })
    .section('Mist')
    .toggle_('mist.volumetric', 'Volumetric haze', () => post.volumetric, (v) => (post.volumetric = v))
    .slider('mist.density', 'Haze density', 0, 0.06, 0.002, () => post.fogDensity, (v) => (post.fogDensity = v), (v) => v.toFixed(3))
    .slider('mist.height', 'Haze height', 1, 30, 0.5, () => post.fogHeight, (v) => (post.fogHeight = v))
    .slider('mist.shafts', 'Light shafts', 0, 1, 0.05, () => post.fogSun, (v) => (post.fogSun = v))
    .toggle_('mist.banks', 'Mist banks', () => renderer.fogVolumes.settings.enabled, (v) => (renderer.fogVolumes.settings.enabled = v))
    .slider('mist.thickness', 'Bank thickness', 0, 3, 0.1, () => mistThickness, (v) => { mistThickness = v; applyMist(); });

  return {
    panel,
    update() {
      post.dofFocus = focusFollows ? camera.focusDistance() : focusAt;
      if (camera.rayStart() !== fogBack) applyFog();
    },
  };
}
