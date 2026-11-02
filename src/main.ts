import { Mesh, Renderer, box, material, multiply, rotationY, translation } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { Controls } from './controls';
import { buildGround } from './ground';
import { installLook } from './look';
import { loadMap } from './map';
import { MistSet } from './mist';
import { Player } from './player';

/**
 * Battle Crab, first light: the beach from the map (the one last saved in the map maker, or the
 * default), the crab, and two ways to play (src/controls.ts; the settings or C switch):
 * third person (click to take the mouse, Esc gives it back; the mouse orbits the camera, W/S
 * walk along the look and A/D sidestep, the crab facing the camera's way while it moves) and top
 * down (an orthographic view from above following the crab; WASD moves on the view, the mouse
 * aims a marker on the ground that the crab faces, Q/E turn the view). The wheel zooms, Tab
 * opens the settings; the game plays on underneath them.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const hint = document.getElementById('hint')!;
const crosshair = document.getElementById('crosshair')!;
const renderer = new Renderer(canvas);

const map = loadMap();
const SIZE = map.size;
const ground = buildGround(renderer, map);
const mist = new MistSet(renderer, map.mist);
const camera = new ThirdPersonCamera();
camera.groundHeight = (x, z) => ground.heightAt(x, z);
const player = new Player(renderer, ground, [map.spawn[0], 0, map.spawn[1]]);
camera.follow = player.position;
camera.target = [player.position[0], player.position[1] + camera.height, player.position[2]];

// A few boulders so walking has something to walk past (boxes, for now).
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const rockMaterial = material({ roughness: 0.9 });
for (let i = 0; i < 24; i++) {
  const x = 4 + rand() * (SIZE - 8);
  const z = 4 + rand() * (SIZE - 8);
  if (Math.hypot(x - map.spawn[0], z - map.spawn[1]) < 4) continue;
  const w = 0.6 + rand() * 1.4;
  const h = 0.5 + rand() * 1.2;
  const d = 0.6 + rand() * 1.4;
  const shade = 0.1 + rand() * 0.08;
  const rock = box(-w / 2, 0, -d / 2, w / 2, h, d / 2, [shade, shade * 0.95, shade * 0.9]);
  renderer.instances.push({ mesh: new Mesh(renderer.gl, rock), model: multiply(translation(x, ground.heightAt(x, z), z), rotationY(rand() * Math.PI)), material: rockMaterial });
}

// Light and look: the sky model's sun, held at mid-morning (the clock does not run yet).
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;

// ---------- input

const LOOK_SPEED = 0.0022;
const controls = new Controls(renderer, camera, canvas, ground, LOOK_SPEED);
const look = installLook(document.body, renderer, camera, mist, controls);
// Opening the panel gives the cursor back (so it can be used); the game plays on underneath.
look.panel.onToggle = (open) => {
  if (open && locked()) document.exitPointerLock();
};

const keys = new Set<string>();
const overPanel = (e: Event) => e.target instanceof Element && !!e.target.closest('.settings');
const typing = (e: Event) => e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement;
window.addEventListener('keydown', (e) => {
  if (e.code === 'Tab') {
    e.preventDefault();
    look.panel.toggle();
    return;
  }
  if (typing(e)) return;
  if (e.code === 'KeyC') {
    controls.toggle();
    look.panel.refresh();
    return;
  }
  if (controls.key(e.code)) return;
  keys.add(e.code);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

// Third person: a press anywhere on the window (not in the settings panel) locks the pointer to the
// game: hidden cursor, no screen edge to run into, Esc releases it. Asked for on the press and again
// on the click of the same gesture, so the press that gives the window focus is enough. Where locking
// is refused (some embedded browsers) the bare mouse movement still orbits. Top down keeps the cursor.
const locked = () => document.pointerLockElement === canvas;
const THIRD = 'mouse to look · WASD to walk · Shift to run · Space to jump · wheel to zoom · Tab for settings · C for topdown';
const TOP = 'mouse to aim · WASD to move · Shift to run · Space to jump · Q/E turn the view · wheel to zoom · Tab for settings · C for 3rd person';
function showHint(): void {
  if (controls.topDown) hint.textContent = TOP;
  else hint.textContent = `${THIRD} · ${locked() ? 'Esc to release the mouse' : 'click to capture the mouse'}`;
}
controls.onModeChange = (mode) => {
  crosshair.hidden = mode === 'topdown';
  if (mode === 'topdown' && locked()) document.exitPointerLock();
  showHint();
};
// The settings may have put a scheme in place already (a saved choice): show it.
controls.onModeChange(controls.mode);
function capture(e: Event): void {
  if (controls.topDown || locked() || overPanel(e) || (e.target instanceof Element && e.target.closest('a'))) return;
  const asked = canvas.requestPointerLock() as unknown;
  if (asked instanceof Promise) {
    asked.catch((err: unknown) => {
      const name = err instanceof Error ? err.name : '';
      if (name === 'SecurityError') hint.textContent = `${THIRD} (this browser will not capture the mouse)`;
      else console.warn('pointer lock refused this time:', err);
    });
  }
}
window.addEventListener('mousedown', capture);
window.addEventListener('click', capture);
document.addEventListener('pointerlockchange', showHint);
window.addEventListener('mousemove', (e) => controls.mouseMoved(e, overPanel(e), locked()));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });

// ---------- the frame

let last = performance.now();
let frames = 0;
let fpsAt = last;
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const intent = controls.update(keys, player.position);
  player.update(dt, intent.dir, intent.faceYaw, intent.faceAlways, intent.run, intent.jump);
  camera.update(dt);
  look.update();
  renderer.time = now / 1000;
  renderer.resize();
  renderer.render(camera);
  frames++;
  if (now - fpsAt > 500) {
    stats.textContent = `${Math.round((frames * 1000) / (now - fpsAt))} fps · ${renderer.drawCalls} draws`;
    frames = 0;
    fpsAt = now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
