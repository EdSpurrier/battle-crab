import { Mesh, Renderer, box, material, multiply, rotationY, translation, type Vec3 } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { buildGround } from './ground';
import { installLook } from './look';
import { Player } from './player';

/**
 * Battle Crab, first light: a sandy ground, the crab, a third-person camera behind it.
 * Click to take the mouse; then the mouse aims (the crab faces where you look), WASD scuttles
 * forward / back / sideways relative to the camera, the wheel zooms, Esc gives the mouse back.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const hint = document.getElementById('hint')!;
const renderer = new Renderer(canvas);

const SIZE = 64;
const ground = buildGround(renderer, SIZE);
const camera = new ThirdPersonCamera();
const player = new Player(renderer, ground, [SIZE / 2, 0, SIZE / 2]);
camera.follow = player.position;
camera.target = [player.position[0], player.position[1] + camera.height, player.position[2]];

// A few boulders so walking has something to walk past (boxes, for now).
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const rockMaterial = material({ roughness: 0.9 });
for (let i = 0; i < 24; i++) {
  const x = 4 + rand() * (SIZE - 8);
  const z = 4 + rand() * (SIZE - 8);
  if (Math.hypot(x - SIZE / 2, z - SIZE / 2) < 4) continue;
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
const look = installLook(document.body, renderer, camera, SIZE);
look.panel.onToggle = (open) => {
  if (open && locked()) document.exitPointerLock();
  keys.clear();
};

// ---------- input: the mouse aims once the canvas has it (pointer lock), keys scuttle

const LOOK_SPEED = 0.0022;
const keys = new Set<string>();
window.addEventListener('keydown', (e) => {
  if (e.code === 'Tab') {
    e.preventDefault();
    look.panel.toggle();
    return;
  }
  if (!look.panel.open) keys.add(e.code);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

// The mouse aims whenever it moves over the canvas, no button held. A click asks the browser to
// lock the pointer (hidden cursor, no screen edge to run into); where that is refused (some
// embedded browsers) aiming still works from the bare mouse movement.
const locked = () => document.pointerLockElement === canvas;
const CONTROLS = 'mouse to aim · WASD to scuttle · wheel to zoom · Tab for settings';
hint.textContent = `${CONTROLS} · click to capture the mouse`;
canvas.addEventListener('click', () => {
  if (locked() || look.panel.open) return;
  const asked = canvas.requestPointerLock() as unknown;
  if (asked instanceof Promise) asked.catch(() => (hint.textContent = `${CONTROLS} (this browser will not capture the mouse)`));
});
document.addEventListener('pointerlockchange', () => {
  hint.textContent = locked() ? `${CONTROLS} · Esc to release the mouse` : `${CONTROLS} · click to capture the mouse`;
});
canvas.addEventListener('mousemove', (e) => {
  if (look.panel.open) return;
  camera.rotate(-e.movementX * LOOK_SPEED, e.movementY * LOOK_SPEED);
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });

/** The scuttle direction from the keys held, in the camera's frame on the ground: W/S along the look, A/D across it. */
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
