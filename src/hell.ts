import type { Vec3 } from 'gridfall-engine';
import type { Structure } from './structure';
import type { Mounted } from './structure';
import type { ShellBuild } from './shell';
import { plainBoost, type Arsenal, type Boost } from './weapons';

/**
 * Bullet Hell: a mode of its own (index.html?mode=hell). The crab starts with one plain machine gun
 * on its back and nothing else; cracked opponents sometimes drop a power-up, and each one taken
 * climbs a stage on the primary gun (left button) or the secondary (right button, a cannon that
 * the first secondary power-up bolts on). The stages below are cumulative, and past the end of a
 * table the last stage repeats, so it only ever gets bigger, faster and madder. Cracked, the run
 * is over: back to the plain gun.
 */

interface Stage {
  name: string;
  blurb: string;
  apply: (b: Boost) => void;
}

const DEG = Math.PI / 180;
const fanOf = (step: number, n: number): number[] => {
  const out = [0];
  for (let i = 1; i <= n; i++) out.push(i * step * DEG, -i * step * DEG);
  return out;
};

export const PRIMARY: Stage[] = [
  { name: 'Machine gun', blurb: 'A plain machine gun.', apply: () => {} },
  { name: 'Heavy rounds', blurb: 'Bigger bullets that hit harder.', apply: (b) => { b.damage *= 1.6; b.size *= 1.5; } },
  { name: 'Twin barrels', blurb: 'Two streams side by side.', apply: (b) => { b.streams = [-3 * DEG, 3 * DEG]; } },
  { name: 'Rapid fire', blurb: 'Nearly twice the rate.', apply: (b) => { b.rate *= 0.6; } },
  { name: 'Trident', blurb: 'One forward, two off at 45 degrees.', apply: (b) => { b.streams = [0, -45 * DEG, 45 * DEG]; } },
  { name: 'Big bullets', blurb: 'Bigger again, harder again.', apply: (b) => { b.damage *= 1.6; b.size *= 1.4; } },
  { name: 'Five-way', blurb: 'Five streams across the front.', apply: (b) => { b.streams = fanOf(25, 2); } },
  { name: 'Explosive rounds', blurb: 'Every hit bursts.', apply: (b) => { b.blast = 1.8; } },
  { name: 'Minigun', blurb: 'Twice the rate again.', apply: (b) => { b.rate *= 0.5; } },
  { name: 'Seven-way', blurb: 'Seven streams, most of the way round.', apply: (b) => { b.streams = fanOf(20, 3); } },
  { name: 'Ring of fire', blurb: 'Twelve streams, all the way round.', apply: (b) => { b.streams = Array.from({ length: 12 }, (_, i) => i * 30 * DEG); } },
  { name: 'Overkill', blurb: 'Bigger, harder, wider bursts. Again.', apply: (b) => { b.damage *= 1.35; b.size *= 1.15; b.blast += 0.6; } },
];

export const SECONDARY: Stage[] = [
  { name: 'Cannon', blurb: 'A cannon on the back, on the right button.', apply: () => {} },
  { name: 'Heavy shot', blurb: 'Bigger balls that hit harder.', apply: (b) => { b.damage *= 1.6; b.size *= 1.4; } },
  { name: 'Triple cannon', blurb: 'Three balls in a spread.', apply: (b) => { b.streams = fanOf(20, 1); } },
  { name: 'Quick reload', blurb: 'Twice the rate.', apply: (b) => { b.rate *= 0.5; } },
  { name: 'Shrapnel', blurb: 'Every ball bursts where it lands.', apply: (b) => { b.blast = 3; } },
  { name: 'Five barrels', blurb: 'Five balls in a spread, bigger again.', apply: (b) => { b.streams = fanOf(16, 2); b.size *= 1.3; } },
  { name: 'Doom cannon', blurb: 'Enormous, fast, and the bursts are huge.', apply: (b) => { b.damage *= 2.5; b.size *= 1.6; b.blast = 4.5; b.rate *= 0.6; } },
  { name: 'Apocalypse', blurb: 'More balls, more damage. Again.', apply: (b) => { b.damage *= 1.4; b.streams = fanOf(12, Math.floor(b.streams.length / 2) + 1); } },
];

/** The boost a stage number earns: every stage up to it applied in turn (the last repeats past the end). */
export function boostFor(table: Stage[], stage: number): Boost {
  const b = plainBoost();
  for (let i = 0; i <= stage; i++) table[Math.min(i, table.length - 1)].apply(b);
  b.grow = Math.min(2.4, 1 + 0.1 * (stage + 1));
  return b;
}

export function stageOf(table: Stage[], stage: number): Stage {
  return table[Math.min(stage, table.length - 1)];
}

/** How the run starts: a whelk, two planks and a machine gun; tiny clampers so a fourth slot is free. */
export function hellBuild(): ShellBuild {
  return {
    shell: 'whelk',
    pieces: [
      { x: 1, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'metal' },
      { x: 2, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'metal' },
      { x: 1, y: 1, z: 1, kind: 'machinegun', yaw: 0 },
    ],
    claws: 'tiny',
  };
}

/** A power-up drops this often: at least every DROP_EVERY cracks, with a chance each time before that. */
const DROP_CHANCE = 0.45;
const DROP_EVERY = 3;

export class Hell {
  primary = 0;
  /** -1: no secondary yet. */
  secondary = -1;
  kills = 0;
  private sinceDrop = 0;

  constructor(private readonly arsenal: Arsenal, private readonly structure: Structure) {
    this.apply();
  }

  private get primaryGun(): Mounted | undefined {
    return this.structure.weapons.find((w) => w.piece.kind === 'machinegun');
  }

  private get secondaryGun(): Mounted | undefined {
    return this.structure.weapons.find((w) => w.piece.kind === 'cannon');
  }

  /** A crab cracked (at `at`): whether a power-up drops there. */
  onKill(): boolean {
    this.kills++;
    this.sinceDrop++;
    if (this.sinceDrop < DROP_EVERY && Math.random() > DROP_CHANCE) return false;
    this.sinceDrop = 0;
    return true;
  }

  /** A power-up taken: the primary or the secondary climbs a stage; what to tell the player. */
  powerUp(): string {
    // The secondary comes along once the primary has a head start, then they take turns by chance.
    const wantSecondary = this.secondary < 0 ? this.primary >= 2 : Math.random() < 0.45;
    if (wantSecondary) {
      if (this.secondary < 0 && !this.secondaryGun && !this.structure.pickUp('cannon')) return this.climbPrimary();
      this.secondary++;
      this.apply();
      const s = stageOf(SECONDARY, this.secondary);
      return `Secondary: ${s.name}! ${s.blurb}`;
    }
    return this.climbPrimary();
  }

  private climbPrimary(): string {
    this.primary++;
    this.apply();
    const s = stageOf(PRIMARY, this.primary);
    return `${s.name}! ${s.blurb}`;
  }

  /** Put the stages onto the guns. */
  apply(): void {
    const p = this.primaryGun;
    if (p) {
      const b = boostFor(PRIMARY, this.primary);
      this.arsenal.boost.set(p, b);
      p.grow = b.grow;
    }
    const s = this.secondaryGun;
    if (s && this.secondary >= 0) {
      const b = boostFor(SECONDARY, this.secondary);
      this.arsenal.boost.set(s, b);
      s.grow = b.grow;
    }
  }

  /** The secondary's trigger (the right button): nothing until it has been earned. */
  fireSecondary(down: boolean): void {
    const s = this.secondaryGun;
    if (s && this.secondary >= 0) this.arsenal.fire(s, down);
  }

  firePrimary(down: boolean): void {
    const p = this.primaryGun;
    if (p) this.arsenal.fire(p, down);
  }

  /** The run is over (cracked): back to the plain gun; the cannon comes off. */
  reset(): string {
    const summary = `Run over: ${this.kills} cracked, ${stageOf(PRIMARY, this.primary).name}${this.secondary >= 0 ? ` and ${stageOf(SECONDARY, this.secondary).name}` : ''}`;
    const s = this.secondaryGun;
    this.primary = 0;
    this.secondary = -1;
    this.kills = 0;
    this.sinceDrop = 0;
    if (s) {
      this.arsenal.boost.delete(s);
      const was = this.structure.invulnerable;
      this.structure.invulnerable = false;
      this.structure.damage(s.index, Number.POSITIVE_INFINITY);
      this.structure.invulnerable = was;
    }
    this.apply();
    return summary;
  }

  /** The HUD's two chips. */
  labels(): { primary: string; secondary: string } {
    const p = stageOf(PRIMARY, this.primary);
    const s = this.secondary >= 0 ? stageOf(SECONDARY, this.secondary) : null;
    return { primary: `${p.name} · Lv ${this.primary + 1}`, secondary: s ? `${s.name} · Lv ${this.secondary + 1}` : 'no secondary yet' };
  }

  /** How many opponents the beach should hold now: more as the run goes on. */
  wantEnemies(): number {
    return Math.min(8, 3 + Math.floor(this.kills / 3));
  }

  /** Where a power-up lands: where the crab cracked. */
  dropAt(at: Vec3): Vec3 {
    return [at[0], at[1], at[2]];
  }
}
