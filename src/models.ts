import { Animator, JointPalette, Mesh, OrbitCamera, Renderer, groundGrid, loadGlb, material, multiply, scaling, translation, type AnimationClip, type Instance, type Material, type Model } from 'gridfall-engine';
import { SettingsPanel } from './settings';

/**
 * The model viewer: every .glb in the Models folder (picked up by Vite at build time, so a file
 * dropped in there is in the list on the next load), one shown at a time on a floor, with its
 * animation clips to play, a turntable, wireframe, and what the file holds (parts, triangles,
 * size, rig). Drag orbits, right-drag pans, the wheel zooms.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const renderer = new Renderer(canvas);
const gl = renderer.gl;
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;
renderer.post.settings.volumetric = false;
renderer.fogRange = [200, 600];

/** The files: path → URL. */
const FILES = import.meta.glob('/Models/*.glb', { query: '?url', import: 'default', eager: true }) as Record<string, string>;
const names = Object.keys(FILES).sort().map((path) => ({ path, name: path.split('/').pop()!.replace(/\.glb$/i, ''), url: FILES[path] }));

const camera = new OrbitCamera();
camera.target = [0, 1, 0];
camera.distance = 8;
camera.minDistance = 0.3;
camera.maxDistance = 400;
camera.pitch = (22 * Math.PI) / 180;
camera.yaw = Math.PI * 0.8;

// The floor: a grid of two greys, sized to the model shown.
const floor: Instance = { mesh: new Mesh(gl, groundGrid(40, 40, [0.3, 0.3, 0.31], [0.26, 0.26, 0.27])), model: translation(-20, 0, -20), material: material({ roughness: 0.95, nearFade: false }) };
renderer.instances.push(floor);

interface Shown {
  name: string;
  model: Model;
  instances: Instance[];
  animator: Animator | null;
  palettes: JointPalette[];
  place: Float32Array;
  radius: number;
}
let shown: Shown | null = null;
const player = { clip: -1, time: 0, speed: 1, playing: true, loop: true };
const look = { wireframe: false, turntable: false, spin: 0 };

async function show(entry: { name: string; url: string }): Promise<void> {
  info.textContent = `loading ${entry.name}…`;
  let model: Model;
  try {
    model = await loadGlb(gl, entry.url);
  } catch (err) {
    info.textContent = `${entry.name}: ${err instanceof Error ? err.message : 'could not load'}`;
    return;
  }
  clear();
  // Stand it on the floor, centred.
  const c = [(model.min[0] + model.max[0]) / 2, model.min[1], (model.min[2] + model.max[2]) / 2];
  const place = translation(-c[0], -c[1], -c[2]);
  const instances: Instance[] = model.parts.map((p) => ({ mesh: new Mesh(gl, p.mesh), model: multiply(place, p.matrix), material: p.material, wireframe: look.wireframe }));
  renderer.instances.push(...instances);
  const size = [model.max[0] - model.min[0], model.max[1] - model.min[1], model.max[2] - model.min[2]];
  const radius = Math.max(0.01, Math.hypot(size[0], size[1], size[2]) / 2);
  const animator = model.rig ? new Animator(model) : null;
  model.parts.forEach((p, i) => {
    if (animator?.isSkinned(i)) instances[i].mesh.setSkin(p.joints!, p.weights!);
  });
  const palettes = (model.rig?.skins ?? []).map((s) => new JointPalette(gl, s.joints.length));
  shown = { name: entry.name, model, instances, animator, palettes, place, radius };
  floor.model = multiply(translation(-radius * 3, -0.001, -radius * 3), scaling(radius * 0.15, 1, radius * 0.15));
  camera.target = [0, size[1] / 2, 0];
  camera.distance = radius * 2.6;
  camera.far = Math.max(500, radius * 20);
  player.time = 0;
  player.clip = animator?.clips.length ? 0 : -1;
  const tris = model.parts.reduce((n, p) => n + p.mesh.indices.length / 3, 0);
  const rig = model.rig;
  const skinned = model.parts.filter((_, i) => animator?.isSkinned(i)).length;
  info.textContent = `${entry.name}: ${model.parts.length} part${model.parts.length === 1 ? '' : 's'}, ${Math.round(tris).toLocaleString()} triangles, ${size.map((v) => v.toFixed(2)).join(' × ')} units` + (rig ? `; ${rig.clips.length} clip${rig.clips.length === 1 ? '' : 's'}, ${rig.skins.length} skin${rig.skins.length === 1 ? '' : 's'} (${skinned} skinned part${skinned === 1 ? '' : 's'}, ${rig.skins.reduce((n, s) => n + s.joints.length, 0)} joints)` : '; no rig');
  buildPanel();
  pose();
}

function clear(): void {
  if (!shown) return;
  const gone = new Set(shown.instances);
  renderer.instances.splice(0, renderer.instances.length, ...renderer.instances.filter((i) => !gone.has(i)));
  const textures = new Set<{ dispose(): void }>();
  for (const i of shown.instances) {
    i.mesh.dispose();
    const m = i.material as Material | undefined;
    for (const t of [m?.albedo, m?.metallicRoughness, m?.normal, m?.emissiveMap]) if (t) textures.add(t);
  }
  for (const t of textures) t.dispose();
  for (const p of shown.palettes) p.dispose();
  shown = null;
}

/** Pose the model at the player's time: each part's matrix, the skinned parts bent on the GPU. */
function pose(): void {
  const s = shown;
  if (!s) return;
  const a = s.animator;
  const spin = look.turntable ? multiply(translation(0, 0, 0), rotationYAbout(look.spin)) : null;
  const base = spin ? multiply(spin, s.place) : s.place;
  if (!a) {
    s.instances.forEach((inst, i) => multiply(base, s.model.parts[i].matrix, inst.model));
    return;
  }
  const clip: AnimationClip | null = player.clip >= 0 ? a.clips[player.clip] ?? null : null;
  a.pose(clip, player.time);
  s.palettes.forEach((pal, k) => pal.set(a.jointMatrices(k)));
  s.instances.forEach((inst, i) => {
    multiply(base, a.partMatrix(i), inst.model);
    if (!a.isSkinned(i)) return;
    inst.skin = s.palettes[s.model.parts[i].skin!];
    const b = (inst.bounds ??= { min: [0, 0, 0], max: [0, 0, 0] }) as { min: number[]; max: number[] };
    a.skinBounds(i, b.min, b.max);
  });
}

function rotationYAbout(a: number): Float32Array {
  const m = new Float32Array(16);
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c; m[2] = -s; m[5] = 1; m[8] = s; m[10] = c; m[15] = 1;
  return m;
}

// ---------- the panel: the files, then what the shown one offers

const panel = new SettingsPanel(document.body, 'Models', { persist: false, open: true });
panel.root.classList.add('left');
let info: HTMLParagraphElement;

function buildPanel(): void {
  panel.clear();
  panel.section(`Files (${names.length})`);
  if (!names.length) panel.note('No .glb files yet. Drop them in the Models folder and reload.');
  const list = document.createElement('div');
  list.className = 'list';
  for (const n of names) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = n.name;
    b.title = n.path;
    b.classList.toggle('on', shown?.name === n.name);
    b.addEventListener('click', () => void show(n));
    list.appendChild(b);
  }
  panel.root.lastElementChild!.appendChild(list);
  info = panel.note(info?.textContent || 'pick a file');
  const a = shown?.animator;
  if (a && a.clips.length) {
    panel
      .section('Animation')
      .choice('clip', 'Clip', ['none', ...a.clips.map((c, i) => `${i + 1}. ${c.name || 'clip'}`)], () => (player.clip < 0 ? 'none' : `${player.clip + 1}. ${a.clips[player.clip].name || 'clip'}`), (v) => { player.clip = v === 'none' ? -1 : Number(v.split('.')[0]) - 1; player.time = 0; })
      .toggle_('playing', 'Playing', () => player.playing, (v) => (player.playing = v))
      .toggle_('loop', 'Loop', () => player.loop, (v) => (player.loop = v))
      .slider('speed', 'Speed', 0, 3, 0.05, () => player.speed, (v) => (player.speed = v), 2)
      .slider('time', 'Time', 0, 1, 0.001, () => (player.clip >= 0 ? player.time / Math.max(1e-3, a.clips[player.clip].duration) : 0), (v) => { if (player.clip >= 0) player.time = v * a.clips[player.clip].duration; }, 3);
  }
  panel
    .section('Look')
    .toggle_('wire', 'Wireframe', () => look.wireframe, (v) => { look.wireframe = v; shown?.instances.forEach((i) => (i.wireframe = v)); })
    .toggle_('turn', 'Turntable', () => look.turntable, (v) => (look.turntable = v))
    .toggle_('shadows', 'Shadows', () => renderer.shadows.settings.strength > 0, (v) => (renderer.shadows.settings.strength = v ? 1 : 0));
}
buildPanel();
if (names.length) void show(names[0]);

// ---------- mouse: drag orbits, right-drag pans, wheel zooms

let button = -1;
let lastX = 0;
let lastY = 0;
canvas.addEventListener('pointerdown', (e) => {
  button = e.button;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', () => (button = -1));
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointermove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  if (button === 0) camera.rotate(dx * 0.005, dy * 0.004);
  else if (button === 2 || button === 1) camera.pan(-dx * camera.distance * 0.0016, dy * camera.distance * 0.0016);
});
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });

// ---------- the frame

let last = performance.now();
let frames = 0;
let fpsAt = last;
let timeSlider = 0;
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  const a = shown?.animator;
  if (a && player.clip >= 0 && player.playing) {
    const d = a.clips[player.clip].duration;
    player.time += dt * player.speed;
    if (player.time > d) player.time = player.loop ? player.time % Math.max(1e-3, d) : d;
    timeSlider += dt;
    if (timeSlider > 0.1) {
      timeSlider = 0;
      panel.refresh();
    }
  }
  if (look.turntable) look.spin += dt * 0.4;
  pose();
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
