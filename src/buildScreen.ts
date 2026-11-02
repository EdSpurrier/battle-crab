import { Mesh, OrbitCamera, Renderer, box, invert, material, multiply, transformPoint, translation, type Instance, type Vec3 } from 'gridfall-engine';
import { Crab } from './crab';
import { buildGround } from './ground';
import { defaultMap } from './map';
import { SettingsPanel } from './settings';
import { CELL, MAX_WEAPONS, PIECES, SHELLS, cellAt, cellCentre, inGrid, loadBuild, pieceType, saveBuild, shellType, weaponsOf, type Piece, type PieceKind, type ShellBuild, type ShellId } from './shell';
import { Structure } from './structure';

/**
 * The Battle Shell screen: the crab on a patch of sand, its shell's deck gridded, and a panel of
 * shells to wear and pieces to build with. Point at the deck or at a piece: the cell you would
 * fill lights up; the left button places the chosen piece there, the right button removes the
 * piece under the pointer, R turns the piece a quarter. Weapons take the action slots 2 to 5 in
 * the order they are placed. Saved in the browser as you go; the game wears it on its next load.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const renderer = new Renderer(canvas);
renderer.dayNight.enabled = true;
renderer.timeOfDay = 0.3;
renderer.post.settings.volumetric = false;
renderer.fogRange = [60, 200];

const map = defaultMap(24);
map.mist = [];
const ground = buildGround(renderer, map);
const AT: Vec3 = [12, 0, 12];
let build: ShellBuild = loadBuild();
let crab = new Crab(renderer, (x, z) => ground.heightAt(x, z), AT, 0, shellType(build.shell));
let structure = new Structure(renderer, build);
crab.structure = structure;

const camera = new OrbitCamera();
camera.target = [AT[0], 1.3, AT[2]];
camera.distance = 5;
camera.minDistance = 1.5;
camera.maxDistance = 20;
camera.pitch = (28 * Math.PI) / 180;
camera.yaw = Math.PI * 0.75;

// ---------- the cell under the pointer, lit

const ghostMaterial = material({ color: [0.35, 0.8, 1], roughness: 1, transparent: true, opacity: 0.4, nearFade: false });
const badMaterial = material({ color: [1, 0.3, 0.2], roughness: 1, transparent: true, opacity: 0.4, nearFade: false });
const ghost: Instance = { mesh: new Mesh(renderer.gl, box(-CELL / 2, -CELL / 2, -CELL / 2, CELL / 2, CELL / 2, CELL / 2, [1, 1, 1])), model: new Float32Array(16), material: ghostMaterial, hidden: true };
renderer.instances.push(ghost);

/** What the left button does: place a piece of this kind, or erase ('erase'). */
let piece: PieceKind | 'erase' = 'plank';
let turn = 0;
/** Where a placed piece would go, and which piece the pointer is on (to remove). */
let target: [number, number, number] | null = null;
let over: Piece | null = null;
let mouse: [number, number] | null = null;

function occupied(c: [number, number, number]): Piece | undefined {
  return build.pieces.find((p) => p.x === c[0] && p.y === c[1] && p.z === c[2]);
}

/** March a ray from the pointer through the deck's cells (in body space: the crab stands at AT facing +z). */
function pick(): void {
  target = null;
  over = null;
  if (!mouse) return;
  const r = canvas.getBoundingClientRect();
  const nx = ((mouse[0] - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((mouse[1] - r.top) / r.height) * 2;
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
  const shell = structure.shell;
  const body = crab.body;
  // Body space: the crab faces +z with no turn here, so it is a shift by the body's centre.
  const off: Vec3 = [body[12], body[13], body[14]];
  let prev: [number, number, number] | null = null;
  for (let t = 0; t < 40; t += 0.01) {
    const p: Vec3 = [a[0] + dir[0] * t - off[0], a[1] + dir[1] * t - off[1], a[2] + dir[2] * t - off[2]];
    const c = cellAt(shell, p);
    if (inGrid(shell, c)) {
      const hit = occupied(c);
      if (hit) {
        over = hit;
        if (prev && inGrid(shell, prev) && !occupied(prev)) target = prev;
        return;
      }
      prev = c;
    } else if (c[1] < 0 && prev && inGrid(shell, prev) && c[0] === prev[0] && c[2] === prev[2]) {
      // Through the deck: the bottom cell of that column.
      target = [prev[0], 0, prev[2]];
      return;
    } else if (c[1] < 0 && c[0] >= 0 && c[0] < shell.grid[0] && c[2] >= 0 && c[2] < shell.grid[1]) {
      target = [c[0], 0, c[2]];
      return;
    }
    if (p[1] < -0.5) break;
  }
}

function placeable(): boolean {
  if (!target || piece === 'erase') return false;
  const type = pieceType(piece);
  if (type.weapon && weaponsOf(build).length >= MAX_WEAPONS) return false;
  // Something to stand on: the deck, or a piece below.
  return target[1] === 0 || !!occupied([target[0], target[1] - 1, target[2]]);
}

function rebuild(): void {
  structure.dispose();
  structure = new Structure(renderer, build);
  crab.structure = structure;
  saveBuild(build);
  showSlots();
}

function wearShell(id: ShellId): void {
  const shell = shellType(id);
  build = { shell: id, pieces: build.pieces.filter((p) => inGrid(shell, [p.x, p.y, p.z])) };
  structure.dispose();
  crab.dispose();
  crab = new Crab(renderer, (x, z) => ground.heightAt(x, z), AT, 0, shell);
  structure = new Structure(renderer, build);
  crab.structure = structure;
  saveBuild(build);
  buildPanel();
}

// ---------- mouse

let button = -1;
let lastX = 0;
let lastY = 0;
let moved = 0;
canvas.addEventListener('pointerdown', (e) => {
  button = e.button;
  lastX = e.clientX;
  lastY = e.clientY;
  moved = 0;
  canvas.setPointerCapture(e.pointerId);
});
canvas.addEventListener('pointerup', (e) => {
  if (moved < 4) {
    const erase = e.button === 2 || (e.button === 0 && piece === 'erase');
    if (erase && over) {
      build.pieces = build.pieces.filter((p) => p !== over);
      rebuild();
    } else if (e.button === 0 && piece !== 'erase' && target && placeable()) {
      build.pieces.push({ x: target[0], y: target[1], z: target[2], kind: piece, yaw: turn });
      rebuild();
    }
  }
  button = -1;
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
canvas.addEventListener('pointermove', (e) => {
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  mouse = [e.clientX, e.clientY];
  if (button >= 0) {
    moved += Math.abs(dx) + Math.abs(dy);
    if (button === 0 || button === 2) camera.rotate(dx * 0.005, dy * 0.004);
    else camera.pan(-dx * camera.distance * 0.0016, dy * camera.distance * 0.0016);
  }
});
canvas.addEventListener('pointerleave', () => (mouse = null));
canvas.addEventListener('wheel', (e) => {
  camera.zoom(e.deltaY > 0 ? 1.1 : 0.9);
  e.preventDefault();
}, { passive: false });
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLInputElement) return;
  const byKey = PIECES.find((p) => e.key === p.key);
  if (byKey) setPiece(byKey.kind);
  if (e.key === '0' || e.code === 'KeyX') setPiece('erase');
  if (e.code === 'KeyR') turn = (turn + 1) % 4;
});

// ---------- the panel

const panel = new SettingsPanel(document.body, 'Battle Shell', { persist: false, open: true });
panel.root.classList.add('left');
let slotsNote: HTMLParagraphElement | null = null;
const pieceButtons = new Map<PieceKind | 'erase', HTMLButtonElement>();

function setPiece(kind: PieceKind | 'erase'): void {
  piece = kind;
  pieceButtons.forEach((b, k) => b.classList.toggle('on', k === kind));
}

/** Take everything off the deck: the button asks once (a second press within three seconds does it). */
let clearArmed = 0;
function clearDeck(button: HTMLButtonElement): void {
  const now = performance.now();
  if (now - clearArmed < 3000) {
    build.pieces = [];
    rebuild();
    button.textContent = 'Clear the deck';
    clearArmed = 0;
    return;
  }
  clearArmed = now;
  button.textContent = 'Press again to clear';
  setTimeout(() => {
    if (performance.now() - clearArmed >= 3000) button.textContent = 'Clear the deck';
  }, 3100);
}

function showSlots(): void {
  if (!slotsNote) return;
  const weapons = weaponsOf(build);
  const lines = ['1 Claws', ...weapons.map((w, i) => `${i + 2} ${pieceType(w.kind).name}`)];
  const spare = MAX_WEAPONS - weapons.length;
  slotsNote.textContent = `Actions: ${lines.join(' · ')}${spare ? ` · ${spare} slot${spare === 1 ? '' : 's'} free` : ' · full'}`;
}

function buildPanel(): void {
  panel.clear();
  pieceButtons.clear();
  panel.section('Shell');
  const shells = document.createElement('div');
  shells.className = 'cards';
  for (const s of SHELLS) {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = `<b>${s.name}</b> <span class="muted">${s.blurb}</span><br><span class="good">+ ${s.good.join(', ')}</span><br><span class="bad">− ${s.bad.join(', ')}</span>`;
    b.classList.toggle('on', s.id === build.shell);
    b.addEventListener('click', () => wearShell(s.id));
    shells.appendChild(b);
  }
  panel.root.lastElementChild!.appendChild(shells);
  panel.section('Build with');
  const list = document.createElement('div');
  list.className = 'buttons';
  for (const p of PIECES) {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = `${p.key} ${p.name}`;
    b.title = p.blurb;
    b.classList.toggle('on', p.kind === piece);
    b.addEventListener('click', () => setPiece(p.kind));
    list.appendChild(b);
    pieceButtons.set(p.kind, b);
  }
  const eraser = document.createElement('button');
  eraser.type = 'button';
  eraser.textContent = '0 Eraser';
  eraser.title = 'Left click removes the piece under the pointer (right click always does).';
  eraser.classList.toggle('on', piece === 'erase');
  eraser.addEventListener('click', () => setPiece('erase'));
  list.appendChild(eraser);
  pieceButtons.set('erase', eraser);
  panel.root.lastElementChild!.appendChild(list);
  panel.note('Point at the deck or a piece: the lit cell is where it goes. Left places, right removes (or the eraser, 0), R turns a weapon to face another way. A piece needs the deck or a piece under it.');
  slotsNote = panel.note('');
  showSlots();
  panel.plain();
  const bar = document.createElement('div');
  bar.className = 'buttons';
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.textContent = 'Clear the deck';
  clearButton.addEventListener('click', () => clearDeck(clearButton));
  bar.appendChild(clearButton);
  panel.root.appendChild(bar);
  panel.button('Play', () => (location.href = './'));
}
buildPanel();

// ---------- the frame

let last = performance.now();
let frames = 0;
let fpsAt = last;
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  crab.update(dt, AT, 0, [0, 0, 0]);
  pick();
  if (piece === 'erase') {
    // The eraser lights the piece under the pointer, red.
    if (over) {
      const c = cellCentre(structure.shell, over.x, over.y, over.z);
      multiply(crab.body, translation(c[0], c[1], c[2]), ghost.model);
      ghost.material = badMaterial;
      ghost.hidden = false;
    } else ghost.hidden = true;
  } else if (target) {
    const c = cellCentre(structure.shell, target[0], target[1], target[2]);
    multiply(crab.body, translation(c[0], c[1], c[2]), ghost.model);
    ghost.material = placeable() ? ghostMaterial : badMaterial;
    ghost.hidden = false;
  } else ghost.hidden = true;
  renderer.time = now / 1000;
  renderer.resize();
  renderer.render(camera);
  frames++;
  if (now - fpsAt > 500) {
    stats.textContent = `${Math.round((frames * 1000) / (now - fpsAt))} fps · ${build.pieces.length} piece${build.pieces.length === 1 ? '' : 's'}`;
    frames = 0;
    fpsAt = now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
