import { Renderer, type Vec3 } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { crabBox } from './combat';
import { Controls } from './controls';
import { Enemy } from './enemy';
import { buildGround } from './ground';
import { World, wreckFx } from './impacts';
import { LifeBars } from './lifebars';
import { installLook } from './look';
import { loadMap } from './map';
import { MistSet } from './mist';
import { Pickups } from './pickups';
import { Player } from './player';
import { Props } from './props';
import { CLAWS, loadBuild, shellType } from './shell';
import { Structure } from './structure';
import { Arsenal } from './weapons';

/**
 * Battle Crab, first light: the beach from the map (the one last saved in the map maker, or the
 * default), the crab wearing its Battle Shell (built on the build screen), and two ways to play
 * (src/controls.ts; the settings or C switch): 3rd person (click to take the mouse, Esc gives it
 * back; the mouse orbits the camera, W/S walk along the look and A/D sidestep, the crab facing the
 * camera's way while it moves) and topdown (an orthographic view from above following the crab;
 * WASD moves on the view, the mouse aims a marker on the ground that the crab faces, Q/E turn the
 * view). 1 to 5 pick an action (1 the claws, 2 to 5 the mounted weapons), the left button fires it,
 * the right button aims down the barrel. The wheel zooms, Tab opens the settings; the game plays
 * on underneath them.
 */
const canvas = document.getElementById('gl') as HTMLCanvasElement;
const stats = document.getElementById('stats')!;
const hint = document.getElementById('hint')!;
const crosshair = document.getElementById('crosshair')!;
const actionBar = document.getElementById('actions')!;
const renderer = new Renderer(canvas);

const map = loadMap();
const ground = buildGround(renderer, map);
const mist = new MistSet(renderer, map.mist);
const camera = new ThirdPersonCamera();
camera.groundHeight = (x, z) => ground.heightAt(x, z);
const build = loadBuild();
const shell = shellType(build.shell);
const player = new Player(renderer, ground, [map.spawn[0], 0, map.spawn[1]], shell, build.claws);
const structure = new Structure(renderer, build, (x, z) => ground.heightAt(x, z));
player.crab.structure = structure;
// What is carried slows the crab; pieces shot off lighten it (and may take a weapon slot with them).
const weigh = () => player.setWeight(structure.weight() + CLAWS[build.claws].weight);
weigh();
const world = new World((x, z) => ground.heightAt(x, z));
// The beach's rocks, shells and driftwood (the map's props); the solid ones stop shots.
const props = new Props(renderer, (x, z) => ground.heightAt(x, z), map.props);
world.obstacles.push(...props.obstacles());
player.blockers = world.obstacles;
const arsenal = new Arsenal(renderer, structure, world, player);
camera.follow = player.position;
camera.target = [player.position[0], player.position[1] + camera.height, player.position[2]];

// ---------- opponents: three on the beach at a time, each with its own shell and build; a cracked one is replaced

const ENEMIES = 3;
const enemies: Enemy[] = [];
let respawnIn = 0;
function spawnPoint(): Vec3 {
  for (let tries = 0; tries < 30; tries++) {
    const x = 4 + Math.random() * (map.size - 8);
    const z = 4 + Math.random() * (map.size - 8);
    if (Math.hypot(x - player.position[0], z - player.position[2]) > 14) return [x, 0, z];
  }
  return [4, 0, 4];
}
for (let i = 0; i < ENEMIES; i++) enemies.push(new Enemy(renderer, ground, world, spawnPoint()));
const lifeBars = new LifeBars(document.body);
const cracked = document.createElement('div');
cracked.id = 'cracked';
cracked.hidden = true;
document.body.appendChild(cracked);
let deadFor = 0;
let kills = 0;

// ---------- pickups: ammo crates, health boxes, starfish (a spell of invincibility)

const pickups = new Pickups(renderer, (x, z) => ground.heightAt(x, z), map.size, () => player.position);
const notice = document.createElement('div');
notice.id = 'notice';
notice.hidden = true;
document.body.appendChild(notice);
let noticeFor = 0;
function say(text: string): void {
  notice.textContent = text;
  notice.hidden = false;
  noticeFor = 2.2;
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

// ---------- actions: 1 the claws, 2 to 5 the weapons on the shell, in the order they were built

let action = 0;
function showActions(): void {
  const slots = [CLAWS[build.claws].name, ...structure.weapons.map((w) => Arsenal.nameOf(w))];
  actionBar.replaceChildren(
    ...slots.map((n, i) => {
      const el = document.createElement('span');
      el.className = `action${i === action ? ' on' : ''}`;
      const ammo = i > 0 ? arsenal.ammoOf(structure.weapons[i - 1]) : Infinity;
      const left = ammo === Infinity ? '' : ` <i>${Math.ceil(ammo)}</i>`;
      el.innerHTML = `<b>${i + 1}</b> ${n}${left}`;
      if (ammo === 0) el.classList.add('empty');
      return el;
    }),
  );
}
function setAction(i: number): void {
  if (i < 0 || i > structure.weapons.length) return;
  action = i;
  arsenal.selected = i - 1;
  arsenal.trigger(false);
  showActions();
}
setAction(0);
structure.onChange = () => {
  weigh();
  if (action > structure.weapons.length) setAction(0);
  else showActions();
  say('A piece came off!');
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
  if (/^Digit[1-5]$/.test(e.code)) {
    setAction(Number(e.code.slice(5)) - 1);
    return;
  }
  if (controls.key(e.code)) return;
  keys.add(e.code);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => {
  keys.clear();
  arsenal.trigger(false);
  camera.aimZoom = 0;
});

// 3rd person: a press anywhere on the window (not in the settings panel) locks the pointer to the
// game: hidden cursor, no screen edge to run into, Esc releases it. Asked for on the press and again
// on the click of the same gesture, so the press that gives the window focus is enough. Where locking
// is refused (some embedded browsers) the bare mouse movement still orbits. Topdown keeps the cursor.
const locked = () => document.pointerLockElement === canvas;
const THIRD = 'mouse to look · 1-5 pick an action, left button fires, right button aims · WASD to walk · Shift to run · Space to jump · Tab for settings · C for topdown';
const TOP = 'mouse to aim · 1-5 pick an action, left button fires, right button zooms · WASD to move · Shift to run · Space to jump · Q/E turn the view · Tab for settings · C for 3rd person';
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
// The left button fires the chosen action (the claws take turns); the right button aims down the barrel while held.
window.addEventListener('mousedown', (e) => {
  if (overPanel(e) || (e.target instanceof Element && e.target.closest('a')) || !player.alive) return;
  if (e.button === 0) {
    if (action === 0) {
      player.crab.snapNext();
      // A nip reaches a little way in front: whoever (or whatever piece) is there takes it, by the claws worn.
      const b = player.crab.body;
      const reach = 2.4 * Math.sqrt(CLAWS[build.claws].scale);
      for (const o of world.inCone([b[12], b[13], b[14]], [b[8], 0, b[10]], reach, 0.7, player)) {
        if (o instanceof Enemy) o.hurt(CLAWS[build.claws].damage);
        else if (o && typeof o === 'object' && 'structure' in o && 'index' in o) (o as { structure: Structure; index: number }).structure.damage((o as { index: number }).index, CLAWS[build.claws].damage);
      }
    } else arsenal.trigger(true);
  }
  if (e.button === 2) camera.aimZoom = 1;
});
window.addEventListener('mouseup', (e) => {
  if (e.button === 0) arsenal.trigger(false);
  if (e.button === 2) camera.aimZoom = 0;
});
window.addEventListener('contextmenu', (e) => {
  if (!overPanel(e)) e.preventDefault();
});
document.addEventListener('pointerlockchange', showHint);
window.addEventListener('mousemove', (e) => controls.mouseMoved(e, overPanel(e), locked()));
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
  // The crabs' boxes and their pieces' for this frame's shots.
  const live = enemies.filter((e) => e.alive);
  world.moving = [crabBox(player), ...structure.boxes(player.crab.body, player), ...live.map(crabBox), ...live.flatMap((e) => e.structure.boxes(e.crab.body, e))];
  const intent = controls.update(keys, player.position);
  if (player.alive) player.update(dt, intent.dir, intent.faceYaw, intent.faceAlways, intent.run, intent.jump);
  else {
    // Cracked: the crab keels over, a burst of shell as it settles, a few seconds down, then back at the start, whole.
    if (deadFor === 0) {
      arsenal.trigger(false);
      cracked.hidden = false;
    }
    player.update(dt, [0, 0, 0], player.yaw, false);
    const was = deadFor;
    deadFor += dt;
    if (was < 1.2 && deadFor >= 1.2) {
      const b = player.crab.body;
      wreckFx(renderer, [b[12], b[13] + 0.3, b[14]]);
    }
    cracked.innerHTML = `Cracked!<small>back on the beach in ${Math.ceil(3.5 - deadFor)}…</small>`;
    if (deadFor >= 3.5) {
      deadFor = 0;
      player.revive([map.spawn[0], 0, map.spawn[1]]);
      cracked.hidden = true;
    }
  }
  // Where the player aims: in topdown the ground marker; in 3rd person what the crosshair is on (or far
  // along the look). The crosshair ray starts just past the crab, so a camera looking down at it does
  // not aim at the ground under its own feet.
  let aimAt = controls.aim;
  if (!controls.topDown) {
    const eye = camera.eye();
    const dir = camera.lookDir();
    const past = camera.focusDistance() + 1.2;
    const from: Vec3 = [eye[0] + dir[0] * past, eye[1] + dir[1] * past, eye[2] + dir[2] * past];
    const hit = world.raycast(from, dir, 120, player);
    aimAt = hit ? hit.point : [from[0] + dir[0] * 120, from[1] + dir[1] * 120, from[2] + dir[2] * 120];
  }
  arsenal.update(dt, player.crab.body, aimAt);
  structure.update(dt);
  // Pickups: walk over one.
  pickups.update(dt, player.position, (kind) => {
    if (kind === 'ammo') {
      arsenal.refill();
      say('Ammunition!');
    } else if (kind === 'health') {
      player.health = Math.min(player.maxHealth, player.health + player.maxHealth / 2);
      say('Patched up!');
    } else {
      player.invincibleFor = 8;
      say('Starfish! Nothing can hurt you for 8 seconds');
    }
    showActions();
  });
  if (noticeFor > 0) {
    noticeFor -= dt;
    if (noticeFor <= 0) notice.hidden = true;
  }
  if (frames % 15 === 0) showActions();
  // The opponents fight the player (none of them while the player is down); a cracked one is replaced after a while.
  for (const e of enemies) e.update(dt, player.alive ? player : null);
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].gone) {
      enemies.splice(i, 1);
      kills++;
      respawnIn = 4;
    }
  }
  // The lights of the fight: muzzle flashes, flame, rockets and their pops, burning pieces.
  renderer.lights.lights.length = 0;
  renderer.lights.lights.push(...arsenal.lights(dt), ...structure.lights(), ...enemies.flatMap((e) => e.lights(dt)));
  if (renderer.lights.lights.length > 48) renderer.lights.lights.length = 48;
  if (enemies.length < ENEMIES) {
    respawnIn -= dt;
    if (respawnIn <= 0) {
      enemies.push(new Enemy(renderer, ground, world, spawnPoint()));
      respawnIn = 4;
    }
  }
  lifeBars.update(camera, canvas, player, enemies, player.stamina, player.winded);
  camera.update(dt);
  look.update();
  renderer.time = now / 1000;
  renderer.resize();
  renderer.render(camera);
  frames++;
  if (now - fpsAt > 500) {
    stats.textContent = `${Math.round((frames * 1000) / (now - fpsAt))} fps · ${renderer.drawCalls} draws · ${kills} cracked${player.invincibleFor > 0 ? ` · ★ ${Math.ceil(player.invincibleFor)} s` : ''}`;
    frames = 0;
    fpsAt = now;
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// A handle on the game for the browser console (poking at the player, the enemies, the lights).
(window as unknown as { crab: unknown }).crab = { player, enemies, arsenal, structure, world, renderer };
