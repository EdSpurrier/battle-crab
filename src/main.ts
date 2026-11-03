import { Renderer, type Vec3 } from 'gridfall-engine';
import { ThirdPersonCamera } from './camera';
import { crabBox } from './combat';
import { Controls } from './controls';
import { ControlsPanel } from './controlsPanel';
import { Enemy } from './enemy';
import { GamepadInput } from './gamepad';
import { buildGround } from './ground';
import { World } from './impacts';
import { debrisFor } from './debris';
import { fallApart } from './fallApart';
import { LifeBars } from './lifebars';
import { Hell, hellBuild } from './hell';
import { Waves } from './waves';
import { installLook } from './look';
import { Loot } from './loot';
import { loadMap } from './map';
import { MistSet } from './mist';
import { Pickups } from './pickups';
import { Player } from './player';
import { Props } from './props';
import { CLAWS, MAX_ACTIONS, MAX_CARRIED, loadBuild, pieceType, shellType } from './shell';
import { Structure, type Mounted } from './structure';
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
// The mode: the battle (the saved battle shell, three opponents, weapons to collect) or Bullet Hell (?mode=hell:
// one machine gun, power-ups off cracked opponents, more and more of them; see hell.ts).
const HELL = new URLSearchParams(location.search).get('mode') === 'hell';
const build = HELL ? hellBuild() : loadBuild();
const shell = shellType(build.shell);
const player = new Player(renderer, ground, [map.spawn[0], 0, map.spawn[1]], shell, build.claws);
// What comes off any shell lies on the sand: weapons to pick up, rubble for a while.
const loot = new Loot(renderer, (x, z) => ground.heightAt(x, z));
const structure = new Structure(renderer, build, (x, z) => ground.heightAt(x, z), loot);
player.crab.structure = structure;
// What is carried slows the crab; pieces shot off lighten it (and may take a weapon slot with them).
const weigh = () => player.setWeight(structure.weight() + CLAWS[build.claws].weight);
weigh();
const world = new World((x, z) => ground.heightAt(x, z));
// The beach's rocks, shells and driftwood (the map's props); the solid ones stop shots.
const props = new Props(renderer, (x, z) => ground.heightAt(x, z), map.props);
// Shells and driftwood break under fire (into debris that blocks nothing); rocks and boulders stand.
props.attach(world, loot);
player.blockers = world.obstacles;
structure.owner = player;
// Cracked, the crab comes apart at once (fallApart.ts); back on the beach it is whole again (Structure.restore, Crab.revive).
player.onCrack = () => fallApart(renderer, player.crab, structure, loot);
// A burst flings the loot lying about, and shakes the view the nearer it is to the crab.
world.blasts.push((at, r, s) => loot.blast(at, r, s));
world.blasts.push((at, r, s) => {
  const d = Math.hypot(at[0] - player.position[0], at[2] - player.position[2]);
  camera.shake(Math.min(0.8, (s * 0.025 * r) / Math.max(1, d * 0.35)));
});
// The beach's flying debris (debris.ts): every hit throws chunks of what it hit.
const debris = debrisFor(renderer, (x, z) => ground.heightAt(x, z));
const arsenal = new Arsenal(renderer, structure, world, player, 1, HELL);
structure.invulnerable = HELL;
// Unlimited ammunition: on unless the settings turn it off (Bullet Hell is always bottomless).
let unlimitedAmmo = true;
arsenal.infinite = true;
// Bullet Hell: a quicker crab, and every gun fires dead level.
structure.flatAim = HELL;
player.speedScale = HELL ? 1.25 : 1;
camera.follow = player.position;
camera.target = [player.position[0], player.position[1] + camera.height, player.position[2]];

// ---------- opponents, in waves (waves.ts): every few cracks a stage, each stage more of them, new kinds, tougher

const waves = new Waves(HELL ? 'hell' : 'battle');
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
// The beach opens with the first stage's opponents (as many as it wants, of its kinds).
for (let i = 0; i < waves.wantEnemies(); i++) enemies.push(new Enemy(renderer, ground, world, spawnPoint(), loot, { kind: waves.firstKind() }));
const lifeBars = new LifeBars(document.body);
const cracked = document.createElement('div');
cracked.id = 'cracked';
cracked.hidden = true;
document.body.appendChild(cracked);
let deadFor = 0;
/** The quarter of its health the player is in (a weapon comes off each time it drops one). */
const HEALTH_STAGES = 4;
let healthStage = HEALTH_STAGES;
let kills = 0;
/** The cracked crabs already counted (a corpse lies on after its kill is scored), and how many corpses may lie about. */
const counted = new Set<Enemy>();
const MAX_CORPSES = 6;

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
/** How fast the right stick orbits the camera in 3rd person (radians a second at full tilt). */
const PAD_LOOK = 2.6;
const controls = new Controls(renderer, camera, canvas, ground, LOOK_SPEED);
const look = installLook(document.body, renderer, camera, mist, controls);
// Topdown: the cursor over a crab (not the player's own) aims at the middle of the box it is over.
controls.targetUnder = (from, dir) => {
  const on = world.firstMoving(from, dir, 2000, player);
  return on ? [on.box.center[0], on.box.center[1], on.box.center[2]] : null;
};
// Opening the panel gives the cursor back (so it can be used); the game plays on underneath.
look.panel.section('Game').toggle_('game.unlimitedAmmo', 'Unlimited ammo', () => unlimitedAmmo, (v) => {
  unlimitedAmmo = v;
  // (the action bar shows it on its next refresh)
  arsenal.infinite = v || HELL;
});
look.panel.onToggle = (open) => {
  if (open && locked()) document.exitPointerLock();
};

// ---------- actions: four slots. The claws take the first when they can bite, then the weapons on the
// shell in the order they were built (with the tiny clampers, four weapons). Keys 1-4 (or the mouse's
// chosen one) fire one at a time; a gamepad's LB / RB / LT / RT each fire a slot outright.

const gamepad = new GamepadInput();
type Action = { kind: 'claws' } | { kind: 'weapon'; m: Mounted };
const clawsWork = CLAWS[build.claws].works;
/** The simple firing scheme (the default): the left button holds every weapon's trigger, the right button nips while held. */
const simple = () => controls.fire === 'simple';
function allActions(): Action[] {
  return [...(clawsWork ? [{ kind: 'claws' } as Action] : []), ...structure.weapons.map((m): Action => ({ kind: 'weapon', m }))];
}
function actions(): Action[] {
  return allActions().slice(0, MAX_ACTIONS);
}
/** Weapons past the four slots (a stack picked up on the beach): they fire along with the last slot. */
function extras(): Mounted[] {
  return allActions()
    .slice(MAX_ACTIONS)
    .flatMap((a) => (a.kind === 'weapon' ? [a.m] : []));
}
const PAD_LABELS = ['LB', 'RB', 'LT', 'RT'];
let action = 0;
function showActions(): void {
  if (hell) {
    // Bullet Hell: the two guns and their stages.
    const l = hell.labels();
    const pad = gamepad.connected;
    actionBar.replaceChildren(
      ...([[pad ? 'RT' : 'LMB', l.primary, 1], [pad ? 'LT' : 'RMB', l.secondary, hell.secondaryCharge()]] as [string, string, number][]).map(([key, text, charge]) => {
        const el = document.createElement('span');
        el.className = `action${charge >= 1 ? ' on' : ' empty'}`;
        el.innerHTML = `<b>${key}</b> ${text}<i class="charge" style="width: ${Math.round(charge * 100)}%"></i>`;
        return el;
      }),
    );
    return;
  }
  const list = actions();
  actionBar.replaceChildren(
    ...list.map((a, i) => {
      const el = document.createElement('span');
      // Simple firing: every weapon is live on the left button, the claws on the right.
      const lit = simple() ? true : i === action;
      el.className = `action${lit ? ' on' : ''}`;
      const ammo = a.kind === 'weapon' ? arsenal.ammoOf(a.m) : Infinity;
      const left = ammo === Infinity ? '' : ` <i>${Math.ceil(ammo)}</i>`;
      const name = a.kind === 'weapon' ? Arsenal.nameOf(a.m) : CLAWS[build.claws].name;
      const key = gamepad.connected ? PAD_LABELS[i] : simple() ? (a.kind === 'claws' ? 'RMB' : 'LMB') : String(i + 1);
      const more = i === MAX_ACTIONS - 1 && extras().length ? ` <i class="more">+${extras().length}</i>` : '';
      el.innerHTML = `<b>${key}</b> ${name}${left}${more}`;
      if (ammo === 0) el.classList.add('empty');
      return el;
    }),
  );
}
function setAction(i: number): void {
  if (i < 0 || i >= actions().length) return;
  arsenal.trigger(false);
  action = i;
  const a = actions()[i];
  arsenal.selected = a.kind === 'weapon' ? structure.weapons.indexOf(a.m) : -1;
  showActions();
}
const hell = HELL ? new Hell(arsenal, structure) : null;
// The wave gauge down the right side: the stage, how far through it, how hot it is getting.
const gauge = document.createElement('div');
gauge.id = 'hellgauge';
gauge.innerHTML = '<b></b><div class="bar"><i></i></div><span></span>';
document.body.appendChild(gauge);
const gaugeStage = gauge.querySelector('b') as HTMLElement;
const gaugeFill = gauge.querySelector('i') as HTMLElement;
const gaugeNote = gauge.querySelector('span') as HTMLElement;
function showGauge(): void {
  gaugeStage.textContent = `Stage ${waves.stage}`;
  gaugeFill.style.height = `${Math.round(waves.stageShare * 100)}%`;
  gauge.style.setProperty('--heat', String(waves.heat()));
  gaugeNote.textContent = `${enemies.filter((e) => e.alive).length} / ${waves.wantEnemies()} crabs · ${waves.kills} cracked`;
}
setAction(0);
let pieceCount = structure.alivePieces.length;
structure.onChange = () => {
  weigh();
  if (action >= actions().length) setAction(0);
  else setAction(action);
  const n = structure.alivePieces.length;
  if (n < pieceCount && player.alive) say('A piece came off!');
  pieceCount = n;
};

/** A nip: the claws reach a little way in front, and whoever (or whatever piece) is there takes it, by the claws worn. */
function nip(): void {
  player.crab.snapNext();
  const b = player.crab.body;
  const reach = 2.4 * Math.sqrt(CLAWS[build.claws].scale);
  for (const o of world.inCone([b[12], b[13], b[14]], [b[8], 0, b[10]], reach, 0.7, player)) {
    if (o instanceof Enemy) {
      o.hurt(CLAWS[build.claws].damage, 'nip', player.position);
      const c = o.crab.body;
      debris.burst([c[12], c[13] + 0.3, c[14]], 'shell', 4, 4, 0.08, [c[12] - b[12], 0.5, c[14] - b[14]], 0.6);
    }
    else if (o && typeof o === 'object' && 'structure' in o && 'index' in o) (o as { structure: Structure; index: number }).structure.damage((o as { index: number }).index, CLAWS[build.claws].damage);
  }
}

/** Fire action slot `i` (a gamepad button): a weapon's trigger, or a nip every so often while held. */
let nipCool = 0;
let firingAll = false;
let nipping = false;
function fireAll(down: boolean): void {
  firingAll = down;
  for (const m of structure.weapons) arsenal.fire(m, down);
}
function fireAction(i: number, down: boolean): void {
  const a = actions()[i];
  if (!a) return;
  if (i === MAX_ACTIONS - 1) for (const m of extras()) arsenal.fire(m, down);
  if (a.kind === 'weapon') arsenal.fire(a.m, down);
  else if (down && nipCool <= 0) {
    nip();
    nipCool = 0.4;
  }
}

// ---------- the gamepad: polled each frame (see gamepad.ts for the mapping)

/** When the pad last faced the crab somewhere, and the ground point it faced (kept until the mouse moves again). */
let padAimedAt = -1;
let padAim: Vec3 | null = null;
let mouseMovedAt = 0;
window.addEventListener('gamepadconnected', (e) => {
  say(`Gamepad: ${e.gamepad.id.split('(')[0].trim() || 'connected'}`);
  showHint();
  showActions();
});
window.addEventListener('gamepaddisconnected', () => {
  gamepad.connected = false;
  showHint();
  showActions();
});

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
  if (/^Digit[1-4]$/.test(e.code)) {
    setAction(Number(e.code.slice(5)) - 1);
    return;
  }
  if (controls.key(e.code)) return;
  keys.add(e.code);
});
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('blur', () => {
  keys.clear();
  firingAll = false;
  nipping = false;
  arsenal.releaseAll();
  camera.aimZoom = 0;
});

// 3rd person: a press anywhere on the window (not in the settings panel) locks the pointer to the
// game: hidden cursor, no screen edge to run into, Esc releases it. Asked for on the press and again
// on the click of the same gesture, so the press that gives the window focus is enough. Where locking
// is refused (some embedded browsers) the bare mouse movement still orbits. Topdown keeps the cursor.
const locked = () => document.pointerLockElement === canvas;
/** The controls panel down in the bottom-left corner (controlsPanel.ts), for the scheme in use; the top bar keeps a short tip. */
const controlsPanel = new ControlsPanel(document.body);
function showHint(): void {
  controlsPanel.update({ topDown: controls.topDown, simple: simple(), hell: HELL, pad: gamepad.connected, locked: locked(), claws: clawsWork });
  hint.textContent = HELL ? 'power-ups drop where crabs crack' : 'H hides the controls';
}
controls.onModeChange = (mode) => {
  crosshair.hidden = mode === 'topdown';
  if (mode === 'topdown' && locked()) document.exitPointerLock();
  showHint();
};
// The settings may have put a scheme in place already (a saved choice): show it.
controls.onModeChange(controls.mode);
controls.onFireChange = () => {
  fireAll(false);
  nipping = false;
  showHint();
  showActions();
};
function capture(e: Event): void {
  if (controls.topDown || locked() || overPanel(e) || (e.target instanceof Element && e.target.closest('a'))) return;
  const asked = canvas.requestPointerLock() as unknown;
  if (asked instanceof Promise) {
    asked.catch((err: unknown) => {
      const name = err instanceof Error ? err.name : '';
      if (name === 'SecurityError') hint.textContent = 'this browser will not capture the mouse: move it to look';
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
    if (hell) hell.firePrimary(true);
    else if (simple()) fireAll(true);
    else if (actions()[action]?.kind === 'claws') nip();
    else {
      arsenal.trigger(true);
      if (action === MAX_ACTIONS - 1) for (const m of extras()) arsenal.fire(m, true);
    }
  }
  if (e.button === 2) {
    if (hell) hell.fireSecondary(true);
    else if (simple() && clawsWork) nipping = true;
    else camera.aimZoom = 1;
  }
});
window.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    if (hell) hell.firePrimary(false);
    else if (simple()) fireAll(false);
    else {
      arsenal.trigger(false);
      for (const m of extras()) arsenal.fire(m, false);
    }
  }
  if (e.button === 2) {
    if (hell) hell.fireSecondary(false);
    nipping = false;
    camera.aimZoom = 0;
  }
});
window.addEventListener('contextmenu', (e) => {
  if (!overPanel(e)) e.preventDefault();
});
document.addEventListener('pointerlockchange', showHint);
window.addEventListener('mousemove', (e) => {
  if (e.movementX || e.movementY) mouseMovedAt = performance.now();
  controls.mouseMoved(e, overPanel(e), locked());
});
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
  // The crabs' boxes and their pieces' for this frame's shots; the corpses' too (shots push them about).
  const live = enemies.filter((e) => e.alive);
  const corpses = enemies.filter((e) => e.corpse);
  world.moving = [crabBox(player), ...structure.boxes(player.crab.body, player), ...live.map(crabBox), ...live.flatMap((e) => e.structure.boxes(e.crab.body, e)), ...corpses.map(crabBox)];
  const intent = controls.update(keys, player.position);
  nipCool = Math.max(0, nipCool - dt);
  if (!hell && player.alive) {
    if (nipping && nipCool <= 0) {
      nip();
      nipCool = 0.4;
    }
    // A weapon picked up while the button is down joins in.
    if (firingAll) for (const m of structure.weapons) arsenal.fire(m, true);
  }
  debris.update(dt);
  // A gamepad joins in over the keys and the mouse: the left stick walks (in the camera's frame), the right
  // stick faces (top down: the aim marker goes a little way out that way and stays until the mouse moves;
  // 3rd person: it orbits the camera), the left stick pressed in runs, A jumps, LB / RB / LT / RT fire the slots.
  const pad = gamepad.poll();
  if (pad && player.alive) {
    const fw = camera.forward();
    const rt = camera.right();
    if (pad.move[0] || pad.move[1]) intent.dir = [fw[0] * -pad.move[1] + rt[0] * pad.move[0], 0, fw[2] * -pad.move[1] + rt[2] * pad.move[0]];
    if (pad.look[0] || pad.look[1]) {
      if (controls.topDown) {
        const dx = fw[0] * -pad.look[1] + rt[0] * pad.look[0];
        const dz = fw[2] * -pad.look[1] + rt[2] * pad.look[0];
        const l = Math.hypot(dx, dz) || 1;
        const p = player.position;
        padAim = [p[0] + (dx / l) * 7, 0, p[2] + (dz / l) * 7];
        padAim[1] = ground.heightAt(padAim[0], padAim[2]);
        padAimedAt = performance.now();
      } else camera.rotate(-pad.look[0] * PAD_LOOK * dt, pad.look[1] * PAD_LOOK * dt);
    }
    if (controls.topDown && padAim && padAimedAt > mouseMovedAt) {
      controls.setAim(padAim);
      intent.faceYaw = Math.atan2(padAim[0] - player.position[0], padAim[2] - player.position[2]);
      intent.faceAlways = true;
    }
    intent.run = intent.run || pad.run;
    intent.jump = intent.jump || pad.jump;
    if (hell) {
      hell.firePrimary(pad.fire[3] || pad.fire[1]);
      hell.fireSecondary(pad.fire[2] || pad.fire[0]);
    } else for (let i = 0; i < 4; i++) fireAction(i, pad.fire[i]);
  }
  if (player.alive) player.update(dt, intent.dir, intent.faceYaw, intent.faceAlways, intent.run, intent.jump);
  else {
    // Cracked: the crab keels over, a burst of shell as it settles, a few seconds down, then back at the start, whole.
    if (deadFor === 0) {
      arsenal.releaseAll();
      firingAll = false;
      nipping = false;
      cracked.hidden = false;
      // The run is over: the waves back to stage one (and Bullet Hell's guns back to plain).
      const run = waves.reset();
      say(hell ? `${run}, ${hell.reset()}` : run);
    }
    player.update(dt, [0, 0, 0], player.yaw, false);
    const was = deadFor;
    deadFor += dt;
    cracked.innerHTML = `Cracked!<small>back on the beach in ${Math.ceil(3.5 - deadFor)}…</small>`;
    if (deadFor >= 3.5) {
      deadFor = 0;
      player.revive([map.spawn[0], 0, map.spawn[1]]);
      structure.restore();
      hell?.apply();
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
    } else if (kind === 'power') {
      if (hell) say(hell.powerUp());
    } else {
      player.invincibleFor = 8;
      say('Starfish! Nothing can hurt you for 8 seconds');
    }
    showActions();
  });
  // Loose weapons: walk over one with a slot free (and a cell for it) and it is yours, with a full load.
  const refused = loot.update(dt, player.alive ? player.position : null, 1.4, (kind) => {
    if (hell || !structure.pickUp(kind)) return false;
    say(`Picked up a ${pieceType(kind).name.toLowerCase()} · ${structure.weapons.length} / ${MAX_CARRIED}`);
    return true;
  });
  if (refused && !hell && noticeFor <= 0) say(`Carrying ${MAX_CARRIED} already: no room for the ${pieceType(refused).name.toLowerCase()}`);
  // A hard knock through each quarter of the crab's health shoots its top weapon off (a stacked one first).
  const healthNow = Math.ceil((player.health / player.maxHealth) * HEALTH_STAGES);
  if (player.alive && !hell && healthNow < healthStage && structure.shedTop()) say('A weapon was shot off!');
  healthStage = player.alive ? healthNow : HEALTH_STAGES;
  if (noticeFor > 0) {
    noticeFor -= dt;
    if (noticeFor <= 0) notice.hidden = true;
  }
  if (frames % 15 === 0) {
    showActions();
    showGauge();
    showHint();
  }
  // The opponents fight the player (none of them while the player is down); a cracked one is replaced after a while.
  for (const e of enemies) e.update(dt, player.alive ? player : null);
  // A crab walking into a corpse shoves it along (a push each frame while they overlap: a nudge, not a blow).
  for (const c of corpses) {
    const cs = c.crab.scale;
    for (const w of [player, ...live]) {
      const wp = w.position;
      const v = w instanceof Enemy ? w.player.velocity : w.velocity;
      const speed = Math.hypot(v[0], v[2]);
      if (speed < 0.5 || Math.hypot(wp[0] - c.position[0], wp[2] - c.position[2]) > 1.1 * cs + 0.9) continue;
      c.shove([v[0] * dt * 4, 0, v[2] * dt * 4]);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    if (!e.alive && !counted.has(e)) {
      // A kill the moment it cracks (the corpse lies on a while).
      counted.add(e);
      const at = e.position;
      kills++;
      // Every few, a new stage; Bullet Hell: now and then a cracked crab leaves a power-up where it fell.
      respawnIn = Math.max(respawnIn, waves.respawnSeconds());
      const news = waves.onKill();
      if (news) say(news);
      if (hell && hell.onKill()) pickups.place('power', [at[0], at[1], at[2]]);
    }
    if (e.gone) {
      counted.delete(e);
      enemies.splice(i, 1);
    }
  }
  // Too many corpses about: the oldest sink early.
  if (corpses.length > MAX_CORPSES) corpses[0].sinkNow();
  // The lights of the fight: muzzle flashes, flame, rockets and their pops, burning pieces.
  renderer.lights.lights.length = 0;
  renderer.lights.lights.push(...arsenal.lights(dt), ...structure.lights(), ...enemies.flatMap((e) => e.lights(dt)), ...loot.lights(), ...pickups.lights());
  if (renderer.lights.lights.length > 48) renderer.lights.lights.length = 48;
  if (live.length < waves.wantEnemies()) {
    respawnIn -= dt;
    if (respawnIn <= 0) {
      // The stage's kinds (marchers in groups, a boss every fifth stage), tougher as it goes.
      enemies.push(new Enemy(renderer, ground, world, spawnPoint(), loot, { kind: waves.nextKind(), armorScale: waves.armorScale() }));
      respawnIn = waves.respawnSeconds();
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
(window as unknown as { crab: unknown }).crab = { player, enemies, arsenal, structure, world, renderer, gamepad, controls, camera, loot, hell, waves, pickups, props, debris };
