import { OrbitCamera, OverlayMesh, Renderer, invert, multiply, transformPoint, translation, type OverlayData, type Vec3 } from 'gridfall-engine';
import { buildGround } from './ground';
import { MAX_LEVEL, defaultMap, downloadMap, loadMap, mistDef, readMapFile, saveMap, type MapData, type MistDef } from './map';
import { MistSet } from './mist';
import { SettingsPanel } from './settings';
import { TILES } from './tiles';

/**
 * The map maker: the beach seen from an orbit camera, with tools on the left and, for a chosen
 * mist bank, its controls on the right. Raise, lower and flatten the ground (whole levels under a
 * round brush), paint it with the ground tiles, place mist banks (click empty ground: a new one;
 * click a bank: choose it; drag: move it) and shape each one, set where the crab starts. Every
 * change is saved in the browser as it is made, and the game loads that map; Download keeps a
 * file and Load brings one back.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const renderer = new Renderer(canvas);
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;
renderer.fogRange = [80, 300];

let map: MapData = loadMap();
let ground = buildGround(renderer, map);
const mist = new MistSet(renderer, map.mist);
ground.setGrid(true);

const camera = new OrbitCamera();
camera.target = [map.size / 2, 0, map.size / 2];
camera.distance = 42;
camera.maxDistance = 160;
camera.pitch = (50 * Math.PI) / 180;

// ---------- editor state

type Tool = 'raise' | 'lower' | 'flatten' | 'paint' | 'mist' | 'spawn';
let tool: Tool = 'raise';
let brush = 2.5;
let tile = 1;
let selected = -1;
let flattenTo = 0;
let saveTimer = 0;
const toolButtons = new Map<Tool, HTMLButtonElement>();

/** Save in the browser a moment after the last change (the game picks it up on its next load). */
function touched(): void {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const ok = saveMap(map);
    saved.textContent = ok ? `saved ${new Date().toLocaleTimeString()}` : 'could not save (storage unavailable)';
  }, 400);
}

// ---------- picking: a point on the ground under the mouse

function groundUnder(clientX: number, clientY: number): Vec3 | null {
  const r = canvas.getBoundingClientRect();
  const nx = ((clientX - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((clientY - r.top) / r.height) * 2;
  const inv = invert(multiply(camera.projection(r.width / r.height), camera.view()));
  const un = (z: number): Vec3 => {
    const p = transformPoint(inv, [nx, ny, z]);
    return [p[0] / p[3], p[1] / p[3], p[2] / p[3]];
  };
  const a = un(-1);
  const b = un(1);
  const dir: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const len = Math.hypot(dir[0], dir[1], dir[2]);
  dir[0] /= len; dir[1] /= len; dir[2] /= len;
  const h = (x: number, z: number) => (x < 0 || z < 0 || x >= map.size || z >= map.size ? 0 : ground.heightAt(x, z));
  let t0 = 0;
  for (let t = 0.5; t < 400; t += 0.5) {
    const p: Vec3 = [a[0] + dir[0] * t, a[1] + dir[1] * t, a[2] + dir[2] * t];
    if (p[1] <= h(p[0], p[2])) {
      // Between t0 (above) and t (below): close in.
      let lo = t0;
      let hi = t;
      for (let i = 0; i < 12; i++) {
        const m = (lo + hi) / 2;
        const q: Vec3 = [a[0] + dir[0] * m, a[1] + dir[1] * m, a[2] + dir[2] * m];
        if (q[1] <= h(q[0], q[2])) hi = m;
        else lo = m;
      }
      const m = (lo + hi) / 2;
      return [a[0] + dir[0] * m, a[1] + dir[1] * m, a[2] + dir[2] * m];
    }
    t0 = t;
  }
  return null;
}

// ---------- the brush ring and the chosen bank's outline, drawn on the ground

const ringData = (): OverlayData => ({ vertices: new Float32Array(0), indices: new Uint32Array(0) });
const ring = { mesh: new OverlayMesh(renderer.gl, ringData()), model: translation(0, 0, 0), onTop: true };
const outline = { mesh: new OverlayMesh(renderer.gl, ringData()), model: translation(0, 0, 0), onTop: true };
renderer.overlays.push(ring, outline);

/** A band on the ground along `points` (closed), `width` wide, in a colour. */
function band(points: Vec3[], width: number, rgba: [number, number, number, number]): OverlayData {
  const n = points.length;
  const vertices = new Float32Array(n * 2 * 7);
  const indices = new Uint32Array(n * 6);
  for (let i = 0; i < n; i++) {
    const p = points[i];
    const prev = points[(i + n - 1) % n];
    const next = points[(i + 1) % n];
    // The outward direction: perpendicular to the path, in the ground plane.
    let dx = next[0] - prev[0];
    let dz = next[2] - prev[2];
    const l = Math.hypot(dx, dz) || 1;
    dx /= l; dz /= l;
    const ox = dz;
    const oz = -dx;
    const y = ground.heightAt(p[0], p[2]) + 0.04;
    const w = width / 2;
    const o = i * 14;
    vertices.set([p[0] - ox * w, y, p[2] - oz * w, rgba[0], rgba[1], rgba[2], rgba[3]], o);
    vertices.set([p[0] + ox * w, y, p[2] + oz * w, rgba[0], rgba[1], rgba[2], rgba[3]], o + 7);
    const j = (i + 1) % n;
    indices.set([i * 2, j * 2, j * 2 + 1, i * 2, j * 2 + 1, i * 2 + 1], i * 6);
  }
  return { vertices, indices };
}

function showRing(at: Vec3 | null): void {
  if (!at || tool === 'mist') return ring.mesh.setData(ringData());
  const pts: Vec3[] = [];
  const r = tool === 'spawn' ? 1 : brush;
  for (let i = 0; i < 48; i++) {
    const a = (i / 48) * Math.PI * 2;
    pts.push([at[0] + Math.cos(a) * r, 0, at[2] + Math.sin(a) * r]);
  }
  ring.mesh.setData(band(pts, 0.1, tool === 'paint' ? [1, 1, 1, 0.9] : tool === 'lower' ? [1, 0.5, 0.4, 0.9] : [0.5, 0.9, 1, 0.9]));
}

/** The four ground corners of bank `d`'s footprint, turned by its yaw. */
function footprint(d: MistDef): Vec3[] {
  const a = (d.yaw * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  const hx = d.size[0] / 2;
  const hz = d.size[2] / 2;
  return [[-hx, 0, -hz], [hx, 0, -hz], [hx, 0, hz], [-hx, 0, hz]].map(([x, , z]) => [d.center[0] + x * c + z * s, 0, d.center[2] - x * s + z * c] as Vec3);
}

function showOutline(): void {
  const d = map.mist[selected];
  if (!d) return outline.mesh.setData(ringData());
  // More points along each side so the band follows the ground.
  const corners = footprint(d);
  const pts: Vec3[] = [];
  for (let i = 0; i < 4; i++) {
    const p = corners[i];
    const q = corners[(i + 1) % 4];
    for (let k = 0; k < 8; k++) pts.push([p[0] + ((q[0] - p[0]) * k) / 8, 0, p[2] + ((q[2] - p[2]) * k) / 8]);
  }
  outline.mesh.setData(band(pts, 0.14, [1, 0.85, 0.3, 0.95]));
}

/**
 * Which bank's footprint holds the ground point, the smallest first (a small bank inside a big
 * one stays reachable). A layer over most of the map is never picked this way (it would catch
 * every click); the bank list chooses it.
 */
function bankAt(p: Vec3): number {
  let best = -1;
  let bestArea = map.size * map.size * 0.6;
  map.mist.forEach((d, i) => {
    const a = (d.yaw * Math.PI) / 180;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const dx = p[0] - d.center[0];
    const dz = p[2] - d.center[2];
    // Into the bank's own frame (the inverse turn).
    const lx = dx * c - dz * s;
    const lz = dx * s + dz * c;
    const area = d.size[0] * d.size[2];
    if (Math.abs(lx) <= d.size[0] / 2 && Math.abs(lz) <= d.size[2] / 2 && area < bestArea) {
      best = i;
      bestArea = area;
    }
  });
  return best;
}

// ---------- the tools

/** Every cell within the brush of `at`, with how far in it is (1 at the centre, 0 at the edge). */
function cellsUnder(at: Vec3, fn: (x: number, z: number, inner: number) => void): void {
  const r = brush;
  for (let z = Math.max(0, Math.floor(at[2] - r)); z <= Math.min(map.size - 1, Math.ceil(at[2] + r)); z++) {
    for (let x = Math.max(0, Math.floor(at[0] - r)); x <= Math.min(map.size - 1, Math.ceil(at[0] + r)); x++) {
      const d = Math.hypot(x + 0.5 - at[0], z + 0.5 - at[2]);
      if (d <= r) fn(x, z, 1 - d / Math.max(r, 1e-3));
    }
  }
}

function applyLevels(at: Vec3, step: number): void {
  let changed = false;
  cellsUnder(at, (x, z) => {
    const i = z * map.size + x;
    const want = step === 0 ? flattenTo : Math.max(0, Math.min(MAX_LEVEL, map.levels[i] + step));
    if (map.levels[i] !== want) {
      map.levels[i] = want;
      changed = true;
    }
  });
  if (!changed) return;
  ground.rebuild();
  touched();
}

function applyPaint(at: Vec3): void {
  let changed = false;
  cellsUnder(at, (x, z) => {
    if (map.paint[z * map.size + x] !== tile) changed = true;
    ground.paint(x, z, tile);
  });
  if (changed) touched();
}

function select(i: number): void {
  selected = i;
  showOutline();
  buildBankPanel();
  refreshBankList();
}

function addBank(at: Vec3): void {
  const d = mistDef({ center: [at[0], 0.9, at[2]], size: [10, 2, 8] });
  map.mist.push(d);
  mist.add(map.mist.length - 1);
  setTool('mist');
  select(map.mist.length - 1);
  touched();
}

// ---------- mouse

let button = -1;
let lastX = 0;
let lastY = 0;
let lastApply = 0;
let dragBank = -1;
let dragFrom: Vec3 | null = null;
let dragCenter: [number, number] = [0, 0];
let hover: Vec3 | null = null;

function useTool(at: Vec3, first: boolean): void {
  const now = performance.now();
  switch (tool) {
    case 'raise':
    case 'lower':
      if (first || now - lastApply > 140) {
        applyLevels(at, tool === 'raise' ? 1 : -1);
        lastApply = now;
      }
      break;
    case 'flatten':
      if (first) flattenTo = ground.levelAt(at[0], at[2]);
      applyLevels(at, 0);
      break;
    case 'paint':
      applyPaint(at);
      break;
    case 'spawn':
      if (first) {
        map.spawn = [at[0], at[2]];
        spawnNote.textContent = `crab starts at ${at[0].toFixed(1)}, ${at[2].toFixed(1)}`;
        touched();
      }
      break;
    case 'mist':
      if (first) {
        const hit = bankAt(at);
        if (hit >= 0) {
          select(hit);
          dragBank = hit;
          dragFrom = at;
          dragCenter = [map.mist[hit].center[0], map.mist[hit].center[2]];
        } else addBank(at);
      } else if (dragBank >= 0 && dragFrom) {
        const d = map.mist[dragBank];
        d.center[0] = dragCenter[0] + (at[0] - dragFrom[0]);
        d.center[2] = dragCenter[1] + (at[2] - dragFrom[2]);
        mist.sync(dragBank);
        showOutline();
        bankPanelRefresh?.();
        touched();
      }
      break;
  }
}

canvas.addEventListener('pointerdown', (e) => {
  button = e.button;
  lastX = e.clientX;
  lastY = e.clientY;
  canvas.setPointerCapture(e.pointerId);
  if (button === 0 && !e.shiftKey) {
    const at = groundUnder(e.clientX, e.clientY);
    if (at) useTool(at, true);
  }
});
canvas.addEventListener('pointerup', () => {
  button = -1;
  dragBank = -1;
  dragFrom = null;
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointermove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  hover = groundUnder(e.clientX, e.clientY);
  if (button === 2) camera.rotate(dx * 0.005, dy * 0.004);
  else if (button === 1 || (button === 0 && e.shiftKey)) camera.pan(-dx * camera.distance * 0.0016, dy * camera.distance * 0.0016);
  else if (button === 0 && hover) useTool(hover, false);
});
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const pick: Record<string, Tool> = { Digit1: 'raise', Digit2: 'lower', Digit3: 'flatten', Digit4: 'paint', Digit5: 'mist', Digit6: 'spawn' };
  if (pick[e.code]) setTool(pick[e.code]);
  if (e.code === 'BracketLeft') setBrush(brush - 0.5);
  if (e.code === 'BracketRight') setBrush(brush + 0.5);
  if ((e.code === 'Delete' || e.code === 'Backspace') && tool === 'mist' && selected >= 0) deleteBank();
});

// ---------- panels

const tools = new SettingsPanel(document.body, 'Map maker', { persist: false, open: true });
tools.root.classList.add('left');
let brushSlider: HTMLInputElement | null = null;

function setTool(t: Tool): void {
  const was = tool;
  tool = t;
  toolButtons.forEach((b, k) => b.classList.toggle('on', k === t));
  if (t !== 'mist' && was === 'mist') select(-1);
}
function setBrush(v: number): void {
  brush = Math.max(0.5, Math.min(12, v));
  if (brushSlider) {
    brushSlider.value = String(brush);
    brushSlider.dispatchEvent(new Event('input'));
  }
}

tools.section('Tool');
(['raise', 'lower', 'flatten', 'paint', 'mist', 'spawn'] as Tool[]).forEach((t, i) => {
  tools.button(`${i + 1} ${t}`, () => setTool(t), { raise: 'raise the ground a level under the brush', lower: 'lower it a level', flatten: 'level the ground under the brush to where you first click', paint: 'paint the ground with the chosen tile', mist: 'click empty ground for a new bank; click a bank to choose it, drag to move it', spawn: 'where the crab starts' }[t]);
  const bar = tools.root.querySelector('section:last-of-type .buttons')!;
  toolButtons.set(t, bar.lastElementChild as HTMLButtonElement);
});
tools.slider('brush', 'Brush', 0.5, 12, 0.5, () => brush, (v) => (brush = v), 1, 'cells, [ and ] change it');
brushSlider = tools.root.querySelector('section:last-of-type input[type=range]');
tools.note('Raise and lower work in whole levels; one step slopes, two or more make a cliff.');

tools.section('Paint with');
const swatches = document.createElement('div');
swatches.className = 'swatches';
TILES.forEach((t, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'swatch';
  b.style.background = t.swatch;
  b.title = t.name;
  b.addEventListener('click', () => {
    tile = i;
    setTool('paint');
    swatches.querySelectorAll('.swatch').forEach((el, k) => el.classList.toggle('on', k === i));
  });
  swatches.appendChild(b);
});
tools.root.lastElementChild!.appendChild(swatches);
swatches.children[tile].classList.add('on');
const tileNote = tools.note(`tile: ${TILES[tile].name}`);
swatches.addEventListener('click', () => (tileNote.textContent = `tile: ${TILES[tile].name}`));

tools.section('Mist banks');
const bankList = document.createElement('div');
bankList.className = 'buttons';
tools.root.lastElementChild!.appendChild(bankList);
tools.note('a number chooses a bank (the beach-wide layer too); on the ground, click a bank or drag it');
/** The row of bank buttons and New bank, redone whenever banks change. */
function refreshBankList(): void {
  bankList.replaceChildren();
  map.mist.forEach((d, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = String(i + 1);
    b.title = `${d.size[0]} × ${d.size[2]} at ${d.center[0].toFixed(0)}, ${d.center[2].toFixed(0)}`;
    b.classList.toggle('on', i === selected);
    b.addEventListener('click', () => {
      setTool('mist');
      select(i);
    });
    bankList.appendChild(b);
  });
  const add = document.createElement('button');
  add.type = 'button';
  add.textContent = '+ New bank';
  add.title = 'a new bank where the camera looks';
  add.addEventListener('click', () => addBank([camera.target[0], 0, camera.target[2]]));
  bankList.appendChild(add);
}

tools.section('Map');
let gridOn = true;
tools.toggle_('grid', 'Grid', () => gridOn, (v) => { gridOn = v; ground.setGrid(v); });
const spawnNote = tools.note(`crab starts at ${map.spawn[0].toFixed(1)}, ${map.spawn[1].toFixed(1)}`);
const saved = tools.note('saved as you go (this browser)');
const file = document.createElement('input');
file.type = 'file';
file.accept = 'application/json,.json';
file.hidden = true;
document.body.appendChild(file);
file.addEventListener('change', async () => {
  const f = file.files?.[0];
  if (!f) return;
  try {
    replaceMap(await readMapFile(f));
    saved.textContent = `loaded ${f.name}`;
  } catch (err) {
    saved.textContent = err instanceof Error ? err.message : 'could not load that file';
  }
  file.value = '';
});
tools
  .button('Download', () => downloadMap(map), 'the map as a .json file')
  .button('Load…', () => file.click(), 'a map file from your computer')
  .button('New', () => {
    if (confirm('Start a new, flat map? The current one is replaced (download it first to keep it).')) replaceMap(defaultMap(map.size));
  });

/** Swap in another map: the ground, mist and camera follow. */
function replaceMap(next: MapData): void {
  map = next;
  ground.dispose();
  ground = buildGround(renderer, map);
  ground.setGrid(gridOn);
  mist.rebuild(map.mist);
  select(-1);
  camera.target = [map.size / 2, 0, map.size / 2];
  spawnNote.textContent = `crab starts at ${map.spawn[0].toFixed(1)}, ${map.spawn[1].toFixed(1)}`;
  touched();
}

// The chosen bank's controls, on the right; rebuilt whenever the choice changes.
const bank = new SettingsPanel(document.body, 'Mist bank', { persist: false, open: false });
let bankPanelRefresh: (() => void) | null = null;

function deleteBank(): void {
  if (selected < 0) return;
  mist.remove(selected);
  select(-1);
  touched();
}

function buildBankPanel(): void {
  bank.clear();
  bankPanelRefresh = null;
  const d = map.mist[selected];
  if (!d) return bank.toggle(false);
  const i = selected;
  const edit = <K extends keyof MistDef>(key: K, v: MistDef[K]) => {
    d[key] = v;
    mist.sync(i);
    showOutline();
    touched();
  };
  const part = (key: 'center' | 'size' | 'color' | 'glow', k: number, v: number) => {
    d[key][k] = v;
    mist.sync(i);
    showOutline();
    touched();
  };
  bank.note(`bank ${i + 1} of ${map.mist.length}: drag it on the ground to move it`);
  bank
    .section('Shape')
    .slider('w', 'Width', 1, map.size, 0.5, () => d.size[0], (v) => part('size', 0, v), 1)
    .slider('l', 'Length', 1, map.size, 0.5, () => d.size[2], (v) => part('size', 2, v), 1)
    .slider('h', 'Height', 0.2, 12, 0.1, () => d.size[1], (v) => part('size', 1, v), 1)
    .slider('y', 'Centre height', -2, 10, 0.1, () => d.center[1], (v) => part('center', 1, v), 1)
    .slider('yaw', 'Turn', -180, 180, 1, () => d.yaw, (v) => edit('yaw', v), 0, 'degrees')
    .slider('soft', 'Soft edges', 0, 1, 0.01, () => d.softness, (v) => edit('softness', v), 2)
    .slider('fall', 'Thins upward', 0, 1, 0.01, () => d.falloff, (v) => edit('falloff', v), 2)
    .section('Look')
    .slider('dens', 'Density', 0, 3, 0.01, () => d.density, (v) => edit('density', v), 2)
    .color('col', 'Colour', () => d.color, (v) => edit('color', v))
    .slider('noise', 'Billows', 0, 1, 0.01, () => d.noise, (v) => edit('noise', v), 2)
    .slider('nscale', 'Billow size', 0.5, 30, 0.5, () => d.noiseScale, (v) => edit('noiseScale', v), 1)
    .color('glow', 'Glow', () => d.glow, (v) => edit('glow', v))
    .slider('glows', 'Glow strength', 0, 4, 0.05, () => d.glowStrength, (v) => edit('glowStrength', v), 2)
    .section('Drift')
    .slider('speed', 'Speed', 0, 5, 0.05, () => d.speed, (v) => edit('speed', v), 2)
    .slider('dir', 'Direction', -180, 180, 1, () => d.direction, (v) => edit('direction', v), 0, 'degrees, 0 toward +z')
    .slider('rise', 'Rise', -2, 2, 0.05, () => d.rise, (v) => edit('rise', v), 2)
    .slider('churn', 'Churn', 0, 2, 0.01, () => d.churn, (v) => edit('churn', v), 2)
    .plain()
    .button('Duplicate', () => {
      const copy = mistDef({ ...d, center: [d.center[0] + 3, d.center[1], d.center[2] + 3] });
      map.mist.push(copy);
      mist.add(map.mist.length - 1);
      select(map.mist.length - 1);
      touched();
    })
    .button('Delete', deleteBank, 'Delete key');
  bank.toggle(true);
  bankPanelRefresh = () => {
    const field = bank.root.querySelector('p.note');
    if (field) field.textContent = `bank ${i + 1} of ${map.mist.length}: at ${d.center[0].toFixed(1)}, ${d.center[2].toFixed(1)}`;
  };
}

setTool('raise');
refreshBankList();

// ---------- the frame

let last = performance.now();
let frames = 0;
let fpsAt = last;
function frame(now: number): void {
  last = now;
  ground.commit();
  showRing(hover);
  camera.target[1] = ground.heightAt(camera.target[0], camera.target[2]);
  renderer.time = now / 1000;
  renderer.resize();
  renderer.render(camera);
  frames++;
  if (now - fpsAt > 500) {
    stats.textContent = `${Math.round((frames * 1000) / (now - fpsAt))} fps · ${renderer.drawCalls} draws · ${map.mist.length} mist banks`;
    frames = 0;
    fpsAt = now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
