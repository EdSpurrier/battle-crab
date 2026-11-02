import { Mesh, Renderer, box, material, multiply, rotationY, translation, type Vec3 } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { buildGround } from './ground';
import { Player } from './player';

/**
 * Battle Crab, first light: a sandy ground, a box for the crab, a third-person camera behind it.
 * WASD walks (relative to where the camera looks), drag turns the camera, wheel zooms.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const renderer = new Renderer(canvas);

const SIZE = 64;
const ground = buildGround(renderer, SIZE);
const player = new Player(renderer, ground, [SIZE / 2, 0, SIZE / 2]);

// A few boulders so walking has something to walk past (boxes too, for now).
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

const camera = new ThirdPersonCamera();
camera.follow = player.position;
camera.target = [player.position[0], player.position[1] + camera.height, player.position[2]];

// Light and look: the sky model's sun, held at mid-morning (the clock does not run yet).
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;

// ---------- input

const keys = new Set<string>();
window.addEventListener('keydown', (e) => keys.add(e.code));
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => keys.clear());

let dragging = false;
let lastX = 0;
let lastY = 0;
canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', () => (dragging = false));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  camera.rotate(-(e.clientX - lastX) * 0.005, (e.clientY - lastY) * 0.004);
  lastX = e.clientX;
  lastY = e.clientY;
});
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });

/** The walk direction from the keys held, in the camera's frame on the ground. */
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
  player.update(dt, walkDirection());
  camera.update(dt);
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
