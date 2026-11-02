import { Mesh, Renderer, box, material, multiply, rotationY, translation, type Vec3 } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { buildGround } from './ground';
import { installLook } from './look';
import { loadMap } from './map';
import { MistSet } from './mist';
import { Player } from './player';

/**
 * Battle Crab, first light: the beach from the map (the one last saved in the map maker, or the
 * default), the crab, a third-person camera orbiting it. Click anywhere to take the mouse (Esc
 * gives it back); the mouse orbits the camera round the crab; W/S walk forward and back along the
 * look and A/D sidestep across it, the crab facing the camera's way while it moves; the wheel
 * zooms, Tab opens the settings.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const hint = document.getElementById('hint')!;
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

// Light and look: the sky model's sun, held at mid-morning (the clock does not run yet); the settings panel (Tab).
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;
const look = installLook(document.body, renderer, camera, mist);
// Opening the panel gives the cursor back (so it can be used); the game plays on underneath:
// keys still walk, the mouse still orbits whenever it is over the scene rather than the panel.
look.panel.onToggle = (open) => {
  if (open && locked()) document.exitPointerLock();
};

// ---------- input: the mouse orbits once it moves, keys walk

const LOOK_SPEED = 0.0022;
const keys = new Set<string>();
const overPanel = (e: Event) => e.target instanceof Element && !!e.target.closest('.settings');
window.addEventListener('keydown', (e) => {
  if (e.code === 'Tab') {
    e.preventDefault();
    look.panel.toggle();
    return;
  }
  if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement)) keys.add(e.code);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

// The mouse orbits the camera whenever it moves, no button held. A press anywhere on the window
// (not in the settings panel) locks the pointer to the game: hidden cursor, no screen edge to run
// into, Esc releases it. Asked for on the press and again on the click of the same gesture, so the
// press that gives the window focus is enough. Where locking is refused (some embedded browsers)
// the bare mouse movement still orbits.
const locked = () => document.pointerLockElement === canvas;
const CONTROLS = 'mouse to look · WASD to walk · wheel to zoom · Tab for settings';
hint.textContent = `${CONTROLS} · click to capture the mouse`;
function capture(e: Event): void {
  if (locked() || overPanel(e) || (e.target instanceof Element && e.target.closest('a'))) return;
  const asked = canvas.requestPointerLock() as unknown;
  if (asked instanceof Promise) {
    asked.catch((err: unknown) => {
      const name = err instanceof Error ? err.name : '';
      if (name === 'SecurityError') hint.textContent = `${CONTROLS} (this browser will not capture the mouse)`;
      else console.warn('pointer lock refused this time:', err);
    });
  }
}
window.addEventListener('mousedown', capture);
window.addEventListener('click', capture);
document.addEventListener('pointerlockchange', () => {
  hint.textContent = locked() ? `${CONTROLS} · Esc to release the mouse` : `${CONTROLS} · click to capture the mouse`;
});
window.addEventListener('mousemove', (e) => {
  if (!locked() && (overPanel(e) || e.buttons)) return;
  camera.rotate(-e.movementX * LOOK_SPEED, e.movementY * LOOK_SPEED);
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });

/** The walk direction from the keys held, in the camera's frame on the ground: W/S along the look, A/D across it. */
function walkDirection(): Vec3 {
  let f = 0;
  let r = 0;
  if (keys.has('KeyW') || keys.has('ArrowUp')) f += 1;
  if (keys.has('KeyS') || keys.has('ArrowDown')) f -= 1;
  if (keys.has('KeyD') || keys.has('ArrowRight')) r += 1;
  if (keys.has('KeyA') || keys.has('ArrowLeft')) r -= 1;
  const fw = camera.forward();
  const rt = camera.right();
  return [fw[0] * f + rt[0] * r, 0, fw[2] * f + rt[2] * r];
}

// ---------- the frame

let last = performance.now();
let frames = 0;
let fpsAt = last;
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  player.update(dt, walkDirection(), camera.yaw);
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
