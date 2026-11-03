import type { Renderer, Vec3 } from 'gridfall-engine';
import { type Combatant, type HitKind } from './combat';
import { ENEMY_KINDS, type EnemyKind } from './enemyKinds';
import type { Ground } from './ground';
import type { World } from './impacts';
import { fallApart } from './fallApart';
import { sfx } from './sound';
import type { Vec3 as V3 } from 'gridfall-engine';
import type { Loot } from './loot';
import { Player } from './player';
import { CLAWS, CLAW_KINDS, MATERIAL_IDS, PIECES, SHELLS, type Piece, type PieceKind, type ShellBuild } from './shell';
import { Structure } from './structure';
import { Arsenal } from './weapons';

/**
 * An opponent: the same crab, shell, deck and weapons as the player, of a kind (enemyKinds.ts): the
 * battle's random crabs, or Bullet Hell's marchers, gunners, skirmishers, bruisers, rocketeers and
 * bosses, each with its own size, armour, pace, preferred distance and firing rhythm. A simple
 * mind: close to the distance it likes, circle, face the player, fire in bursts when near enough
 * (all its guns at once), nip when it has no guns and is close, jump now and then. Cracked at zero
 * health: it collapses, bursts, sheds its weapons onto the sand (the player can pick them up), and
 * the beach spawns another a few seconds later.
 */

const WEAPONS = PIECES.filter((p) => p.weapon).map((p) => p.kind);
/** Opponents have this share of the health their shell and kind would give them (half: they crack quicker). */
const ENEMY_HEALTH = 0.5;
/** A corpse lies this long, then takes this long to sink into the sand. */
const CORPSE_SECONDS = 20;
const SINK_SECONDS = 1.6;

/** A random build: a few planks on the deck and one or two weapons on them. */
function randomBuild(rand: () => number): ShellBuild {
  const shell = SHELLS[Math.floor(rand() * SHELLS.length)];
  const [cols, rows] = shell.grid;
  const pieces: Piece[] = [];
  const spots: [number, number][] = [];
  for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) spots.push([x, z]);
  spots.sort(() => rand() - 0.5);
  const planks = 2 + Math.floor(rand() * 3);
  const material = MATERIAL_IDS[Math.floor(rand() * MATERIAL_IDS.length)];
  for (let i = 0; i < planks && i < spots.length; i++) pieces.push({ x: spots[i][0], y: 0, z: spots[i][1], kind: 'plank', yaw: 0, material });
  const guns = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < guns && i < planks; i++) {
    const kind: PieceKind = WEAPONS[Math.floor(rand() * WEAPONS.length)];
    pieces.push({ x: spots[i][0], y: 1, z: spots[i][1], kind, yaw: 0 });
  }
  return { shell: shell.id, pieces, claws: CLAW_KINDS[Math.floor(rand() * CLAW_KINDS.length)] };
}

/** A kind's build: its weapons on metal planks across the deck, facing forward. */
function buildFor(kind: EnemyKind): ShellBuild {
  const shell = SHELLS.find((s) => s.id === kind.shell) ?? SHELLS[0];
  const [cols, rows] = shell.grid;
  const pieces: Piece[] = [];
  const z = Math.floor(rows / 2);
  const start = Math.max(0, Math.floor((cols - kind.weapons.length) / 2));
  kind.weapons.forEach((w, i) => {
    const x = Math.min(cols - 1, start + i);
    pieces.push({ x, y: 0, z, kind: 'plank', yaw: 0, material: 'metal' });
    pieces.push({ x, y: 1, z, kind: w, yaw: 0 });
  });
  return { shell: shell.id, pieces, claws: kind.claws };
}

export interface EnemyOptions {
  kind?: EnemyKind;
  /** Armour on top of the kind's (a wave's ramp). */
  armorScale?: number;
  rand?: () => number;
}

export class Enemy implements Combatant {
  readonly player: Player;
  readonly structure: Structure;
  readonly arsenal: Arsenal;
  readonly kind: EnemyKind;
  /** How far from the target it likes to be, which way it circles, and its firing rhythm. */
  private keep: number;
  private circle = 1;
  private circleIn = 2;
  /** Firing rhythm: fires while positive, rests until -rest, then a new burst. The aim wanders a little. */
  private burst = -1;
  private errX = 0;
  private errZ = 0;
  /** Cracked: it collapses, bursts (shedding its weapons), lies as a corpse that can be knocked about, then sinks and is gone. */
  private dyingFor = 0;
  /** Sinking into the sand (the corpse going): seconds in, or -1 while it lies. */
  private sinking = -1;
  gone = false;

  constructor(private readonly renderer: Renderer, ground: Ground, private readonly world: World, at: Vec3, loot: Loot, options: EnemyOptions = {}) {
    const rand = options.rand ?? Math.random;
    const kind = options.kind ?? ENEMY_KINDS.random;
    this.kind = kind;
    const build = kind.id === 'random' ? randomBuild(rand) : buildFor(kind);
    this.build = build;
    const shell = SHELLS.find((s) => s.id === build.shell);
    this.player = new Player(renderer, ground, at, shell, build.claws);
    this.player.crab.scale = kind.scale;
    this.player.maxHealth = Math.round((shell?.armor ?? 100) * kind.armor * (options.armorScale ?? 1) * ENEMY_HEALTH);
    this.player.health = this.player.maxHealth;
    this.player.speedScale = kind.speed;
    this.structure = new Structure(renderer, build, (x, z) => ground.heightAt(x, z), loot);
    this.structure.owner = this;
    // Cracked, it comes apart at once: the shell's pieces and the claws off, broken shell flying.
    this.player.onCrack = () => fallApart(renderer, this.player.crab, this.structure, loot);
    this.player.crab.structure = this.structure;
    this.player.crab.setTeam(kind.tint);
    // What it carries slows it; pieces shot off lighten it.
    const weigh = () => this.player.setWeight(this.structure.weight() + CLAWS[build.claws].weight);
    weigh();
    this.structure.onChange = () => {
      weigh();
      if (this.arsenal.selected >= this.structure.weapons.length) this.arsenal.selected = this.structure.weapons.length - 1;
    };
    // Softer guns than the player's, never out of ammunition, and a worse eye: several of them share the beach.
    this.arsenal = new Arsenal(renderer, this.structure, world, this, kind.damageScale, true);
    this.arsenal.selected = this.structure.weapons.length ? 0 : -1;
    this.keep = kind.id === 'random' ? 6 + rand() * 7 : kind.keep;
    this.player.blockers = world.obstacles;
  }

  /** The lights its firing and its fires throw. */
  lights(dt: number) {
    return this.gone ? [] : [...this.arsenal.lights(dt), ...this.structure.lights()];
  }

  private readonly build: ShellBuild;

  get crab() {
    return this.player.crab;
  }
  get position(): Vec3 {
    return this.player.position;
  }
  get health(): number {
    return this.player.health;
  }
  set health(v: number) {
    this.player.health = v;
  }
  get maxHealth(): number {
    return this.player.maxHealth;
  }
  get alive(): boolean {
    return this.player.alive;
  }
  hurt(amount: number, kind?: HitKind, from?: V3): void {
    this.player.hurt(amount, kind, from);
  }
  shove(impulse: V3): void {
    this.player.shove(impulse);
  }
  /** Lying cracked on the sand (a corpse, not yet gone). */
  get corpse(): boolean {
    return !this.alive && !this.gone;
  }
  /** Let the corpse go now (too many lie about). */
  sinkNow(): void {
    if (this.sinking < 0) this.sinking = 0;
  }

  /** A frame of the mind and the body. `target`: who to fight (null: wander in place). */
  update(dt: number, target: Combatant | null): void {
    const p = this.player;
    if (!this.alive) {
      if (this.gone) return;
      // Keel over (the crab plays its collapse); once down it bursts, and whatever was still on its shell is
      // flung onto the sand (weapons for the taking). The corpse lies on, pushed about by whatever hits it,
      // for CORPSE_SECONDS; then it sinks into the sand and is gone.
      this.arsenal.releaseAll();
      this.dyingFor += dt;
      p.update(dt, [0, 0, 0], p.yaw, false);
      this.structure.update(dt);
      this.arsenal.update(dt, this.crab.body, null);
      if (this.sinking < 0 && this.dyingFor > CORPSE_SECONDS) this.sinking = 0;
      if (this.sinking >= 0) {
        this.sinking += dt;
        p.sink = Math.min(1, this.sinking / SINK_SECONDS) * 1.4 * this.kind.scale;
        if (this.sinking >= SINK_SECONDS) {
          this.dispose();
          this.gone = true;
        }
      }
      return;
    }
    const kind = this.kind;
    let dir: Vec3 = [0, 0, 0];
    let faceYaw = p.yaw;
    let run = false;
    let jump = false;
    let aimAt: Vec3 | null = null;
    if (target && target.alive) {
      const dx = target.position[0] - p.position[0];
      const dz = target.position[2] - p.position[2];
      const dist = Math.hypot(dx, dz) || 1e-3;
      const tx = dx / dist;
      const tz = dz / dist;
      faceYaw = Math.atan2(dx, dz);
      // Close in, back off, or circle (a charger never circles: it comes straight on).
      this.circleIn -= dt;
      if (this.circleIn <= 0) {
        this.circle = Math.random() < 0.5 ? 1 : -1;
        this.circleIn = 1.5 + Math.random() * 2.5;
      }
      if (this.keep <= 0) dir = dist > 1.6 ? [tx, 0, tz] : [0, 0, 0];
      else if (dist > this.keep + 2) dir = [tx, 0, tz];
      else if (dist < this.keep - 2) dir = [-tx, 0, -tz];
      else dir = [tz * this.circle, 0, -tx * this.circle];
      run = this.keep <= 0 ? dist > 6 : dist > this.keep + 9;
      jump = Math.random() < dt * 0.15;
      // Firing: in bursts, at the target with a wandering error.
      this.errX = Math.max(-2.5, Math.min(2.5, this.errX + (Math.random() - 0.5) * 5 * dt));
      this.errZ = Math.max(-2.5, Math.min(2.5, this.errZ + (Math.random() - 0.5) * 5 * dt));
      aimAt = [target.position[0] + this.errX, target.position[1] + 0.6, target.position[2] + this.errZ];
      this.burst -= dt;
      if (this.burst <= -kind.rest) this.burst = kind.burst * (0.6 + Math.random() * 0.8);
      const firing = dist < kind.range && this.burst > 0;
      if (this.structure.weapons.length) {
        if (kind.id === 'random') this.arsenal.trigger(firing);
        else for (const m of this.structure.weapons) this.arsenal.fire(m, firing);
      } else if (firing && dist < 2.2 * Math.max(1, kind.scale) && Math.random() < dt * 1.3 && CLAWS[this.build.claws].works) {
        // A nip: half the claws' bite, by the crab's size; a swarm of small ones adds up, so each is gentler still.
        this.crab.snapNext();
        sfx.play('nip', p.position);
        target.hurt(CLAWS[this.build.claws].damage * 0.5 * kind.scale * (kind.scale < 1 ? 0.5 : 1), 'nip', p.position);
      }
    } else this.arsenal.releaseAll();
    p.update(dt, dir, faceYaw, true, run, jump);
    this.structure.update(dt);
    this.arsenal.update(dt, this.crab.body, aimAt);
  }

  /** Take it off the beach. */
  dispose(): void {
    this.arsenal.dispose();
    this.structure.dispose();
    this.crab.dispose();
  }
}
