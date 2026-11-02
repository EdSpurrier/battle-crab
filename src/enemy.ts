import type { Renderer, Vec3 } from 'gridfall-engine';
import { DAMAGE, type Combatant } from './combat';
import type { Ground } from './ground';
import { wreckFx, type World } from './impacts';
import { Player } from './player';
import { PIECES, SHELLS, type Piece, type PieceKind, type ShellBuild } from './shell';
import { Structure } from './structure';
import { Arsenal } from './weapons';

/**
 * An opponent: the same crab, shell, deck and weapons as the player, with a random shell and a
 * random build, driven by a simple mind: close to a distance it likes, circle, face the player,
 * fire in bursts when near enough, jump now and then. Cracked at zero health: a burst of shell,
 * and the beach spawns another a few seconds later.
 */

const TEAM: [number, number, number, number] = [0.55, 0.7, 1, 0.45];
const WEAPONS = PIECES.filter((p) => p.weapon).map((p) => p.kind);

/** A random build: a few planks on the deck and one or two weapons on them. */
function randomBuild(rand: () => number): ShellBuild {
  const shell = SHELLS[Math.floor(rand() * SHELLS.length)];
  const [cols, rows] = shell.grid;
  const pieces: Piece[] = [];
  const spots: [number, number][] = [];
  for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) spots.push([x, z]);
  spots.sort(() => rand() - 0.5);
  const planks = 2 + Math.floor(rand() * 3);
  for (let i = 0; i < planks && i < spots.length; i++) pieces.push({ x: spots[i][0], y: 0, z: spots[i][1], kind: 'plank', yaw: 0 });
  const guns = 1 + Math.floor(rand() * 2);
  for (let i = 0; i < guns && i < planks; i++) {
    const kind: PieceKind = WEAPONS[Math.floor(rand() * WEAPONS.length)];
    pieces.push({ x: spots[i][0], y: 1, z: spots[i][1], kind, yaw: 0 });
  }
  return { shell: shell.id, pieces };
}

export class Enemy implements Combatant {
  readonly player: Player;
  readonly structure: Structure;
  readonly arsenal: Arsenal;
  /** How far from the target it likes to be, which way it circles, and its firing rhythm. */
  private keep: number;
  private circle = 1;
  private circleIn = 2;
  /** Firing rhythm: fires while positive, rests until -1.3, then a new burst. The aim wanders a little. */
  private burst = -1;
  private errX = 0;
  private errZ = 0;
  private wrecked = false;

  constructor(private readonly renderer: Renderer, ground: Ground, private readonly world: World, at: Vec3, rand: () => number = Math.random) {
    const build = randomBuild(rand);
    this.player = new Player(renderer, ground, at, SHELLS.find((s) => s.id === build.shell));
    this.structure = new Structure(renderer, build);
    this.player.crab.structure = this.structure;
    this.player.crab.setTeam(TEAM);
    // Softer guns than the player's, and a worse eye: three of them share the beach.
    this.arsenal = new Arsenal(renderer, this.structure, world, this, 0.3);
    this.arsenal.selected = this.structure.weapons.length ? 0 : -1;
    this.keep = 6 + rand() * 7;
  }

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
  hurt(amount: number): void {
    this.player.hurt(amount);
  }

  /** A frame of the mind and the body. `target`: who to fight (null: wander in place). */
  update(dt: number, target: Combatant | null): void {
    const p = this.player;
    if (!this.alive) {
      if (!this.wrecked) {
        this.wrecked = true;
        const b = this.crab.body;
        wreckFx(this.renderer, [b[12], b[13] + 0.3, b[14]]);
        this.arsenal.trigger(false);
        this.dispose();
      }
      return;
    }
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
      // Close in, back off, or circle.
      this.circleIn -= dt;
      if (this.circleIn <= 0) {
        this.circle = Math.random() < 0.5 ? 1 : -1;
        this.circleIn = 1.5 + Math.random() * 2.5;
      }
      if (dist > this.keep + 2) dir = [tx, 0, tz];
      else if (dist < this.keep - 2) dir = [-tx, 0, -tz];
      else dir = [tz * this.circle, 0, -tx * this.circle];
      run = dist > this.keep + 9;
      jump = Math.random() < dt * 0.15;
      // Firing: in bursts, at the target with a wandering error.
      this.errX = Math.max(-2.5, Math.min(2.5, this.errX + (Math.random() - 0.5) * 5 * dt));
      this.errZ = Math.max(-2.5, Math.min(2.5, this.errZ + (Math.random() - 0.5) * 5 * dt));
      aimAt = [target.position[0] + this.errX, target.position[1] + 0.6, target.position[2] + this.errZ];
      this.burst -= dt;
      if (this.burst <= -3) this.burst = 0.5 + Math.random() * 0.7;
      const firing = dist < 26 && this.burst > 0;
      if (this.arsenal.selected >= 0) this.arsenal.trigger(firing);
      else if (firing && dist < 2.2 && Math.random() < dt * 2) {
        this.crab.snapNext();
        target.hurt(DAMAGE.claw * 0.5);
      }
    } else this.arsenal.trigger(false);
    p.update(dt, dir, faceYaw, true, run, jump);
    this.arsenal.update(dt, this.crab.body, aimAt);
  }

  /** Take it off the beach. */
  dispose(): void {
    this.structure.dispose();
    this.crab.dispose();
  }
}
