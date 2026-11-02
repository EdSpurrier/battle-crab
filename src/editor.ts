import { OrbitCamera, OverlayMesh, Renderer, translation, type OverlayData, type Vec3 } from 'gridfall-engine';
import { buildGround } from './ground';
import { MAX_LEVEL, defaultMap, downloadMap, loadMap, mistDef, readMapFile, saveMap, type MapData, type MistDef } from './map';
import { MistSet } from './mist';
import { band as bandOn, emptyOverlay as empty, ringPoints } from './overlayShapes';
import { pickGround } from './pick';
import { SettingsPanel } from './settings';
import { TILES } from './tiles';

/**
 * The map maker: the beach seen from an orbit camera, a toolbar of icons down the left (hover
 * for what each does), the tool's options beside it and, for a chosen mist bank, its controls on
 * the right. Raise, lower, flatten and smooth the ground (whole levels under a round brush), paint
 * it with the ground tiles, place mist banks (click empty ground: a new one; click a bank: choose
 * it; drag: move it) and shape each one, set where the crab starts. Every change is saved in the
 * browser as it is made, and the game loads that map; Download keeps a file and Load brings one back.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const toolbar = document.getElementById('toolbar')!;
const renderer = new Renderer(canvas);
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;
renderer.fogRange = [80, 300];

let map: MapData = loadMap();
let ground = buildGround(renderer, map);
const mist = new MistSet(renderer, map.mist);
let gridOn = true;
ground.setGrid(gridOn);

const camera = new OrbitCamera();
camera.target = [map.size / 2, 0, map.size / 2];
camera.distance = 42;
camera.maxDistance = 160;
camera.pitch = (50 * Math.PI) / 180;

// ---------- editor state

type Tool = 'raise' | 'lower' | 'flatten' | 'smooth' | 'paint' | 'mist' | 'spawn';
const TOOLS: { id: Tool; name: string; key: string; tip: string; icon: string }[] = [
  { id: 'raise', name: 'Raise', key: '1', tip: 'Raise the ground a level under the brush.\nHold to keep raising. One step slopes; two or more make a cliff.', icon: '<path d="M3 20h18"/><path d="M6 20c2-6 4-9 6-9s4 3 6 9"/><path d="M12 8V3"/><path d="M9.5 5.5 12 3l2.5 2.5"/>' },
  { id: 'lower', name: 'Lower', key: '2', tip: 'Lower the ground a level under the brush.\nHold to keep lowering.', icon: '<path d="M3 20h18"/><path d="M6 20c2-6 4-9 6-9s4 3 6 9"/><path d="M12 3v5"/><path d="M9.5 5.5 12 8l2.5-2.5"/>' },
  { id: 'flatten', name: 'Flatten', key: '3', tip: 'Level the ground under the brush to the height\nwhere you first press; drag to spread that height.', icon: '<path d="M3 17h18"/><path d="M3 7h18"/><path d="M12 9v6"/><path d="M9.5 12.5 12 15l2.5-2.5"/><path d="M9.5 11.5 12 9l2.5 2.5"/>' },
  { id: 'smooth', name: 'Smooth', key: '4', tip: 'Soften the ground under the brush: each cell moves\ntoward its neighbours. Hold to keep smoothing.', icon: '<path d="M3 20h18"/><path d="M4 14c2.5-4.5 5-4.5 8 0s5.5 4.5 8 0"/>' },
  { id: 'paint', name: 'Paint', key: '5', tip: 'Paint the ground under the brush with the chosen tile.', icon: '<path d="M20 4c-3 0-9 7-9 7l2 2s7-6 7-9z"/><path d="M11 11c-2 0-4 1-4 4-1 1-2 1-3 1 1 2 3 3 5 3 3 0 4-2 4-4z"/>' },
  { id: 'mist', name: 'Mist', key: '6', tip: 'Click empty ground for a new mist bank; click a bank\nto choose it; drag to move it. Its controls open on the right.', icon: '<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.3 1.5A3.3 3.3 0 0 0 7 18z"/>' },
  { id: 'spawn', name: 'Start', key: '7', tip: 'Where the crab starts: click the ground.', icon: '<path d="M6 21V4"/><path d="M6 4h11l-2.5 4L17 12H6"/>' },
];
const ICONS = {
  grid: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16"/>',
  download: '<path d="M12 4v11"/><path d="M8 11l4 4 4-4"/><path d="M4 19h16"/>',
  upload: '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M4 19h16"/>',
  fresh: '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M12 11v6M9 14h6"/>',
  play: '<path d="M7 4l13 8-13 8z"/>',
};
let tool: Tool = 'raise';
let brush = 2.5;
let tile = 1;
let selected = -1;
let flattenTo = 0;
let saveTimer = 0;
const toolButtons = new Map<Tool, HTMLButtonElement>();
let savedNote: HTMLElement | null = null;

/** Save in the browser a moment after the last change (the game picks it up on its next load). */
function touched(): void {
  window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => {
    const ok = saveMap(map);
    if (savedNote) savedNote.textContent = ok ? `saved ${new Date().toLocaleTimeString()}` : 'could not save (storage unavailable)';
  }, 400);
}

// ---------- picking: a point on the ground under the mouse

const groundUnder = (clientX: number, clientY: number): Vec3 | null => pickGround(camera, canvas, clientX, clientY, (x, z) => ground.heightAt(x, z), map.size);

// ---------- the brush ring and the chosen bank's outline, drawn on the ground

const ring = { mesh: new OverlayMesh(renderer.gl, empty()), model: translation(0, 0, 0), onTop: true };
const outline = { mesh: new OverlayMesh(renderer.gl, empty()), model: translation(0, 0, 0), onTop: true };
renderer.overlays.push(ring, outline);

/** A band on the ground along `points` (closed), `width` wide, in a colour. */
const band = (points: Vec3[], width: number, rgba: [number, number, number, number]): OverlayData => bandOn(points, width, rgba, (x, z) => ground.heightAt(x, z));

const RING_COLOR: Record<Tool, [number, number, number, number]> = {
  raise: [0.5, 0.9, 1, 0.9], lower: [1, 0.5, 0.4, 0.9], flatten: [1, 0.85, 0.3, 0.9], smooth: [0.6, 1, 0.6, 0.9], paint: [1, 1, 1, 0.9], mist: [1, 1, 1, 0], spawn: [1, 0.85, 0.3, 0.9],
};
function showRing(at: Vec3 | null): void {
  if (!at || tool === 'mist') return ring.mesh.setData(empty());
  ring.mesh.setData(band(ringPoints(at[0], at[2], tool === 'spawn' ? 1 : brush), 0.1, RING_COLOR[tool]));
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
  if (!d) return outline.mesh.setData(empty());
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

function setLevels(want: (x: number, z: number, level: number) => number, at: Vec3): void {
  let changed = false;
  cellsUnder(at, (x, z) => {
    const i = z * map.size + x;
    const w = Math.max(0, Math.min(MAX_LEVEL, Math.round(want(x, z, map.levels[i]))));
    if (map.levels[i] !== w) {
      map.levels[i] = w;
      changed = true;
    }
  });
  if (!changed) return;
  ground.rebuild();
  touched();
}

/** Each cell toward the mean of its neighbours (a 3 × 3 box), from a snapshot so the pass is even. */
function smoothAt(at: Vec3): void {
  const before = map.levels.slice();
  const n = map.size;
  setLevels((x, z) => {
    let sum = 0;
    let count = 0;
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        const zz = z + dz;
        if (xx < 0 || zz < 0 || xx >= n || zz >= n) continue;
        sum += before[zz * n + xx];
        count++;
      }
    }
    return sum / count;
  }, at);
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
  if (tool === 'mist') buildOptions();
}

function addBank(at: Vec3): void {
  const d = mistDef({ center: [at[0], 0.9, at[2]], size: [10, 2, 8] });
  map.mist.push(d);
  mist.add(map.mist.length - 1);
  setTool('mist');
  select(map.mist.length - 1);
  touched();
}

function deleteBank(): void {
  if (selected < 0) return;
  mist.remove(selected);
  select(-1);
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
  const again = first || now - lastApply > 140;
  switch (tool) {
    case 'raise':
    case 'lower':
      if (again) {
        const step = tool === 'raise' ? 1 : -1;
        setLevels((_x, _z, level) => level + step, at);
        lastApply = now;
      }
      break;
    case 'flatten':
      if (first) flattenTo = ground.levelAt(at[0], at[2]);
      setLevels(() => flattenTo, at);
      break;
    case 'smooth':
      if (again) {
        smoothAt(at);
        lastApply = now;
      }
      break;
    case 'paint':
      applyPaint(at);
      break;
    case 'spawn':
      if (first) {
        map.spawn = [at[0], at[2]];
        buildOptions();
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
canvas.addEventListener('pointerleave', () => (hover = null));
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const byKey = TOOLS.find((t) => e.key === t.key);
  if (byKey) setTool(byKey.id);
  if (e.code === 'BracketLeft') setBrush(brush - 0.5);
  if (e.code === 'BracketRight') setBrush(brush + 0.5);
  if (e.code === 'KeyG') setGrid(!gridOn);
  if ((e.code === 'Delete' || e.code === 'Backspace') && tool === 'mist' && selected >= 0) deleteBank();
});

// ---------- the toolbar: icons down the left, a tooltip on each

function svg(paths: string): string {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths}</svg>`;
}
function toolButton(icon: string, name: string, tip: string, onClick: () => void, key = ''): HTMLButtonElement {
  const b = document.createElement('button');
  b.type = 'button';
  b.innerHTML = svg(icon);
  b.setAttribute('aria-label', name);
  b.dataset.tip = `${name}${key ? `  ·  ${key}` : ''}\n${tip}`;
  b.addEventListener('click', onClick);
  toolbar.appendChild(b);
  return b;
}
for (const t of TOOLS) toolButtons.set(t.id, toolButton(t.icon, t.name, t.tip, () => setTool(t.id), t.key));
toolbar.appendChild(document.createElement('hr'));
const gridButton = toolButton(ICONS.grid, 'Grid', 'Lines along the cells, to count by.', () => setGrid(!gridOn), 'G');
toolButton(ICONS.download, 'Download', 'Keep the map as a .json file.', () => downloadMap(map));
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
    if (savedNote) savedNote.textContent = `loaded ${f.name}`;
  } catch (err) {
    if (savedNote) savedNote.textContent = err instanceof Error ? err.message : 'could not load that file';
  }
  file.value = '';
});
toolButton(ICONS.upload, 'Load', 'Bring back a map file from your computer.', () => file.click());
toolButton(ICONS.fresh, 'New map', 'Start again with a flat beach (the current map is replaced:\ndownload it first to keep it).', () => {
  if (confirm('Start a new, flat map? The current one is replaced (download it first to keep it).')) replaceMap(defaultMap(map.size));
});
toolbar.appendChild(document.createElement('hr'));
const play = document.createElement('a');
play.href = './';
play.innerHTML = svg(ICONS.play);
play.dataset.tip = 'Play\nThe game, on this map.';
play.setAttribute('aria-label', 'Play');
toolbar.appendChild(play);

function setGrid(on: boolean): void {
  gridOn = on;
  ground.setGrid(on);
  gridButton.classList.toggle('lit', on);
}
function setTool(t: Tool): void {
  const was = tool;
  tool = t;
  toolButtons.forEach((b, k) => b.classList.toggle('on', k === t));
  if (t !== 'mist' && was === 'mist') select(-1);
  buildOptions();
}
function setBrush(v: number): void {
  brush = Math.max(0.5, Math.min(12, v));
  buildOptions();
}

// ---------- the tool's options, beside the toolbar

const options = new SettingsPanel(document.body, '', { persist: false, open: true });
options.root.classList.add('left');

function buildOptions(): void {
  options.clear();
  const t = TOOLS.find((x) => x.id === tool)!;
  options.section(t.name);
  if (tool !== 'mist' && tool !== 'spawn') options.slider('brush', 'Brush', 0.5, 12, 0.5, () => brush, (v) => (brush = v), 1, 'cells across; [ and ] change it');
  if (tool === 'paint') {
    const swatches = document.createElement('div');
    swatches.className = 'swatches';
    TILES.forEach((tl, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = `swatch${i === tile ? ' on' : ''}`;
      b.innerHTML = `<i style="background:${tl.swatch}"></i>${tl.name}`;
      b.addEventListener('click', () => {
        tile = i;
        swatches.querySelectorAll('.swatch').forEach((el, k) => el.classList.toggle('on', k === i));
      });
      swatches.appendChild(b);
    });
    options.root.lastElementChild!.appendChild(swatches);
  }
  if (tool === 'mist') {
    const list = document.createElement('div');
    list.className = 'buttons';
    map.mist.forEach((d, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(i + 1);
      b.title = `${d.size[0]} × ${d.size[2]} at ${d.center[0].toFixed(0)}, ${d.center[2].toFixed(0)}`;
      b.classList.toggle('on', i === selected);
      b.addEventListener('click', () => select(i));
      list.appendChild(b);
    });
    const add = document.createElement('button');
    add.type = 'button';
    add.textContent = '+ New bank';
    add.title = 'a new bank where the camera looks';
    add.addEventListener('click', () => addBank([camera.target[0], 0, camera.target[2]]));
    list.appendChild(add);
    options.root.lastElementChild!.appendChild(list);
    options.note(map.mist.length ? 'A number chooses a bank (the beach-wide layer too). On the ground: click a bank, drag to move it, click open sand for a new one.' : 'Click the ground to place the first bank.');
  }
  if (tool === 'spawn') options.note(`The crab starts at ${map.spawn[0].toFixed(1)}, ${map.spawn[1].toFixed(1)}. Click the ground to move it.`);
  savedNote = options.note(savedNote?.textContent || 'saved as you go, in this browser');
  savedNote.classList.add('status');
}

/** Swap in another map: the ground, mist and camera follow. */
function replaceMap(next: MapData): void {
  map = next;
  ground.dispose();
  ground = buildGround(renderer, map);
  ground.setGrid(gridOn);
  mist.rebuild(map.mist);
  select(-1);
  camera.target = [map.size / 2, 0, map.size / 2];
  buildOptions();
  touched();
}

// ---------- the chosen bank's controls, on the right; rebuilt whenever the choice changes

const bank = new SettingsPanel(document.body, 'Mist bank', { persist: false, open: false });
let bankPanelRefresh: (() => void) | null = null;

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
  const where = bank.note('');
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
    where.textContent = `bank ${i + 1} of ${map.mist.length} · at ${d.center[0].toFixed(1)}, ${d.center[2].toFixed(1)} · drag it on the ground to move it`;
  };
  bankPanelRefresh();
}

setGrid(gridOn);
setTool('raise');

// ---------- the frame

let frames = 0;
let fpsAt = performance.now();
function frame(now: number): void {
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
