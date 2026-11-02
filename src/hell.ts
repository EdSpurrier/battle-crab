import { ENEMY_KINDS, type EnemyKind, type EnemyKindId } from './enemyKinds';
import type { Mounted, Structure } from './structure';
import type { ShellBuild } from './shell';
import { plainBoost, type Arsenal, type Boost } from './weapons';

/**
 * Bullet Hell: a mode of its own (index.html?mode=hell). The crab starts with a machine gun (the
 * primary, left button, bottomless) and a grenade launcher (the secondary, right button, on a
 * recharge) and nothing else; every gun fires dead level. Cracked opponents sometimes drop a
 * power-up, and each one taken climbs a stage on one gun or the other. The stages below are
 * cumulative, and past the end of a table the last stage repeats, so it only ever gets bigger,
 * faster and madder. Opponents come in waves: every KILLS_PER_STAGE cracks is a stage, each stage
 * brings more of them and new kinds (enemyKinds.ts), tougher as the stages mount; a boss every
 * fifth stage. Cracked, the run is over: back to the plain guns and stage one.
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

/** The grenade launcher starts on a slow recharge (rate 3: a grenade every couple of seconds). */
export const SECONDARY: Stage[] = [
  { name: 'Grenade launcher', blurb: 'One grenade at a time, on a recharge.', apply: (b) => { b.rate = 3; } },
  { name: 'Bigger bang', blurb: 'A wider, harder blast.', apply: (b) => { b.blast += 1.2; b.damage *= 1.4; } },
  { name: 'Double shot', blurb: 'Two grenades a pull.', apply: (b) => { b.streams = [-6 * DEG, 6 * DEG]; } },
  { name: 'Quick recharge', blurb: 'Grenades come back much faster.', apply: (b) => { b.rate *= 0.6; } },
  { name: 'Cluster', blurb: 'Each burst throws out bomblets.', apply: (b) => { b.cluster = 5; } },
  { name: 'Triple spread', blurb: 'Three grenades fanned out.', apply: (b) => { b.streams = fanOf(14, 1); } },
  { name: 'Heavy grenades', blurb: 'Bigger grenades, bigger blasts.', apply: (b) => { b.size *= 1.5; b.blast += 1.5; b.damage *= 1.5; } },
  { name: 'Carpet', blurb: 'Five grenades a pull, recharging faster still.', apply: (b) => { b.streams = fanOf(12, 2); b.rate *= 0.7; } },
  { name: 'Armageddon', blurb: 'More bomblets, more blast. Again.', apply: (b) => { b.cluster += 3; b.blast += 0.6; b.damage *= 1.3; } },
];

/** The boost a stage number earns: every stage up to it applied in turn (the last repeats past the end). */
export function boostFor(table: Stage[], stage: number): Boost {
  const b = plainBoost();
  for (let i = 0; i <= stage; i++) table[Math.min(i, table.length - 1)].apply(b);
  b.grow = Math.min(2.4, 1 + 0.1 * stage);
  return b;
}

export function stageOf(table: Stage[], stage: number): Stage {
  return table[Math.min(stage, table.length - 1)];
}

/** How the run starts: a whelk, two planks, a machine gun and a grenade launcher; tiny clampers so the slots are the guns'. */
export function hellBuild(): ShellBuild {
  return {
    shell: 'whelk',
    pieces: [
      { x: 1, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'metal' },
      { x: 2, y: 0, z: 1, kind: 'plank', yaw: 0, material: 'metal' },
      { x: 1, y: 1, z: 1, kind: 'machinegun', yaw: 0 },
      { x: 2, y: 1, z: 1, kind: 'grenade', yaw: 0 },
    ],
    claws: 'tiny',
  };
}

/** A power-up drops this often: at least every DROP_EVERY cracks, with a chance each time before that. */
const DROP_CHANCE = 0.45;
const DROP_EVERY = 3;
/** Cracks per wave stage, and the most opponents on the beach at once. */
const KILLS_PER_STAGE = 6;
const MAX_ENEMIES = 12;

/** What each stage brings: a weight per kind (0: none yet). The march never stops. */
function roster(stage: number): Partial<Record<EnemyKindId, number>> {
  return {
    marcher: 3,
    gunner: stage >= 2 ? 2 : 0.6,
    skirmisher: stage >= 3 ? 1.6 : 0,
    bruiser: stage >= 4 ? 1 : 0,
    rocketeer: stage >= 5 ? 1.2 : 0,
  };
}

const STAGE_NEWS: Record<number, string> = {
  2: 'gunners join the march',
  3: 'skirmishers dart in with flame',
  4: 'bruisers lumber in under heavy guns',
  5: 'rocketeers shell from afar, and a boss',
};

export class Hell {
  primary = 0;
  secondary = 0;
  kills = 0;
  private sinceDrop = 0;
  /** Marchers come in groups: this many more of them are due. */
  private groupLeft = 0;
  private bossFor = 0;

  constructor(private readonly arsenal: Arsenal, private readonly structure: Structure) {
    this.apply();
  }

  private get primaryGun(): Mounted | undefined {
    return this.structure.weapons.find((w) => w.piece.kind === 'machinegun');
  }

  private get secondaryGun(): Mounted | undefined {
    return this.structure.weapons.find((w) => w.piece.kind === 'grenade');
  }

  /** The wave stage, from one. */
  get stage(): number {
    return 1 + Math.floor(this.kills / KILLS_PER_STAGE);
  }

  /** How far through the stage, 0..1. */
  get stageShare(): number {
    return (this.kills % KILLS_PER_STAGE) / KILLS_PER_STAGE;
  }

  /** A crab cracked: whether a power-up drops there; `news` is set when a new stage begins. */
  onKill(): { drop: boolean; news: string | null } {
    const before = this.stage;
    this.kills++;
    this.sinceDrop++;
    const news = this.stage > before ? `Stage ${this.stage}${STAGE_NEWS[this.stage] ? `: ${STAGE_NEWS[this.stage]}` : this.stage % 5 === 0 ? ': a boss' : ''}` : null;
    if (this.sinceDrop < DROP_EVERY && Math.random() > DROP_CHANCE) return { drop: false, news };
    this.sinceDrop = 0;
    return { drop: true, news };
  }

  /** A power-up taken: the primary or the secondary climbs a stage; what to tell the player. */
  powerUp(): string {
    if (this.primary >= 1 && Math.random() < 0.45) {
      this.secondary++;
      this.apply();
      const s = stageOf(SECONDARY, this.secondary);
      return `Grenades: ${s.name}! ${s.blurb}`;
    }
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
    if (s) {
      const b = boostFor(SECONDARY, this.secondary);
      this.arsenal.boost.set(s, b);
      s.grow = b.grow;
    }
  }

  firePrimary(down: boolean): void {
    const p = this.primaryGun;
    if (p) this.arsenal.fire(p, down);
  }

  fireSecondary(down: boolean): void {
    const s = this.secondaryGun;
    if (s) this.arsenal.fire(s, down);
  }

  /** How much of the grenade launcher's recharge is back, 0..1. */
  secondaryCharge(): number {
    const s = this.secondaryGun;
    return s ? this.arsenal.readyShare(s) : 0;
  }

  /** The run is over (cracked): back to the plain guns and stage one. */
  reset(): string {
    const summary = `Run over at stage ${this.stage}: ${this.kills} cracked, ${stageOf(PRIMARY, this.primary).name} and ${stageOf(SECONDARY, this.secondary).name}`;
    this.primary = 0;
    this.secondary = 0;
    this.kills = 0;
    this.sinceDrop = 0;
    this.groupLeft = 0;
    this.bossFor = 0;
    this.apply();
    return summary;
  }

  /** The HUD's two chips. */
  labels(): { primary: string; secondary: string } {
    const p = stageOf(PRIMARY, this.primary);
    const s = stageOf(SECONDARY, this.secondary);
    return { primary: `${p.name} · Lv ${this.primary + 1}`, secondary: `${s.name} · Lv ${this.secondary + 1}` };
  }

  /** How many opponents the beach should hold now: more with every stage. */
  wantEnemies(): number {
    const s = this.stage;
    return Math.min(MAX_ENEMIES, 3 + s + Math.floor(s / 2));
  }

  /** Armour on top of a kind's, by stage. */
  armorScale(): number {
    return 1 + 0.08 * (this.stage - 1);
  }

  /** The next opponent to send: a boss once per fifth stage, marchers in threes, the rest by the stage's roster. */
  nextKind(): EnemyKind {
    const s = this.stage;
    if (s % 5 === 0 && this.bossFor !== s) {
      this.bossFor = s;
      return ENEMY_KINDS.boss;
    }
    if (this.groupLeft > 0) {
      this.groupLeft--;
      return ENEMY_KINDS.marcher;
    }
    const r = roster(s);
    const total = Object.values(r).reduce((a, b) => a + (b ?? 0), 0);
    let pick = Math.random() * total;
    for (const [id, w] of Object.entries(r) as [EnemyKindId, number][]) {
      pick -= w ?? 0;
      if (pick <= 0) {
        if (id === 'marcher') this.groupLeft = 2;
        return ENEMY_KINDS[id];
      }
    }
    return ENEMY_KINDS.marcher;
  }

  /** How long until the next opponent: quick for the rest of a group, faster as the stages mount. */
  respawnSeconds(): number {
    return this.groupLeft > 0 ? 0.5 : Math.max(0.8, 2.4 - 0.12 * (this.stage - 1));
  }

  /** How hot it is getting overall, 0..1 (the gauge's colour): stage ten is as hot as it reads. */
  heat(): number {
    return Math.min(1, (this.stage - 1 + this.stageShare) / 9);
  }
}
