import type { Renderer } from 'gridfall-engine';
import type { ThirdPersonCamera } from './camera';
import type { MistSet } from './mist';
import { SettingsPanel } from './settings';

/**
 * The look: the camera and visual settings a player (or we, tuning) can change, in a panel
 * (Tab). Camera: perspective or orthographic, field of view, how high it stays off the ground,
 * depth of field (focus following the crab or set by hand), what is too close to the eye fading
 * out. Fog: distance fog's start, end, colour tint. Mist: the volumetric fog (sunlit haze near
 * the ground, light shafts) and the map's mist banks, all together.
 */
export interface Look {
  panel: SettingsPanel;
  /** Each frame: keeps depth of field focused on the crab when set to follow it, the fog pushed back in orthographic. */
  update(): void;
}

const FOG_OFF: [number, number] = [1e4, 2e4];

export function installLook(parent: HTMLElement, renderer: Renderer, camera: ThirdPersonCamera, mist: MistSet): Look {
  const post = renderer.post.settings;
  const panel = new SettingsPanel(parent, 'Settings (Tab)');

  // ---------- distance fog: measured from the eye, so in orthographic (the eye pulled far back) it is pushed back as far.
  let fogOn = true;
  let fogStart = 25;
  let fogEnd = 110;
  let fogBack = -1;
  let fogColor: [number, number, number] = [0.6, 0.66, 0.74];
  let fogTint = 0;
  const applyFog = () => {
    fogBack = camera.rayStart();
    renderer.fogRange = fogOn ? [fogStart + fogBack, Math.max(fogStart + 0.5, fogEnd) + fogBack] : FOG_OFF;
    renderer.fogTint = fogOn && fogTint > 0 ? { color: fogColor, amount: fogTint } : null;
  };
  applyFog();

  // ---------- depth of field: focus follows the crab unless set by hand
  let focusFollows = true;
  let focusAt = 9;
  post.dof = false;
  post.dofRange = 3;
  post.dofFalloff = 14;
  post.dofBlur = 6;

  // ---------- what is too close to the eye fades out, so the camera never cuts through the crab or a rock
  renderer.nearFade.enabled = true;
  renderer.nearFade.distance = 4;

  let mistThickness = 1;

  panel
    .section('Camera')
    .choice('camera.type', 'Projection', ['perspective', 'orthographic'], () => (camera.ortho ? 'orthographic' : 'perspective'), (v) => (camera.ortho = v === 'orthographic'))
    .slider('camera.fov', 'Field of view', 30, 90, 1, () => Math.round((camera.fov * 180) / Math.PI), (v) => (camera.fov = (v * Math.PI) / 180), 0, 'degrees')
    .slider('camera.clearance', 'Above ground', 0, 4, 0.05, () => camera.clearance, (v) => (camera.clearance = v), 2, 'world units the eye keeps above the sand')
    .toggle_('camera.nearFade', 'Fade what is close', () => renderer.nearFade.enabled, (v) => (renderer.nearFade.enabled = v))
    .slider('camera.nearFadeAt', 'Fade within', 1, 12, 0.25, () => renderer.nearFade.distance, (v) => (renderer.nearFade.distance = v), 2, 'world units from the eye')
    .toggle_('camera.dof', 'Depth of field', () => post.dof, (v) => (post.dof = v))
    .choice('camera.focus', 'Focus', ['on the crab', 'by hand'], () => (focusFollows ? 'on the crab' : 'by hand'), (v) => (focusFollows = v === 'on the crab'))
    .slider('camera.focusAt', 'Focus distance', 2, 60, 0.5, () => focusAt, (v) => (focusAt = v))
    .slider('camera.focusRange', 'Sharp range', 0.5, 20, 0.5, () => post.dofRange, (v) => (post.dofRange = v))
    .slider('camera.blur', 'Blur', 1, 16, 1, () => post.dofBlur, (v) => (post.dofBlur = v))
    .section('Fog')
    .toggle_('fog.on', 'Distance fog', () => fogOn, (v) => { fogOn = v; applyFog(); })
    .slider('fog.start', 'Starts at', 0, 300, 0.5, () => fogStart, (v) => { fogStart = v; applyFog(); }, 1, 'world units from the camera')
    .slider('fog.end', 'Thick by', 1, 600, 0.5, () => fogEnd, (v) => { fogEnd = v; applyFog(); }, 1, 'world units from the camera')
    .color('fog.color', 'Colour', () => fogColor, (v) => { fogColor = v; applyFog(); })
    .slider('fog.tint', 'Colour strength', 0, 1, 0.01, () => fogTint, (v) => { fogTint = v; applyFog(); }, 2, "0: the sky's horizon colour, 1: the colour above")
    .section('Mist')
    .toggle_('mist.volumetric', 'Volumetric haze', () => post.volumetric, (v) => (post.volumetric = v))
    .slider('mist.density', 'Haze density', 0, 0.06, 0.001, () => post.fogDensity, (v) => (post.fogDensity = v), 3)
    .slider('mist.height', 'Haze height', 1, 30, 0.5, () => post.fogHeight, (v) => (post.fogHeight = v))
    .slider('mist.shafts', 'Light shafts', 0, 1, 0.05, () => post.fogSun, (v) => (post.fogSun = v))
    .toggle_('mist.banks', 'Mist banks', () => renderer.fogVolumes.settings.enabled, (v) => (renderer.fogVolumes.settings.enabled = v))
    .slider('mist.thickness', 'Bank thickness', 0, 3, 0.1, () => mistThickness, (v) => { mistThickness = v; mist.setThickness(v); });
  panel.note('Banks are placed and shaped in the map maker.');

  return {
    panel,
    update() {
      post.dofFocus = focusFollows ? camera.focusDistance() : focusAt;
      if (camera.rayStart() !== fogBack) applyFog();
    },
  };
}
