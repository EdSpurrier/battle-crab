import { ENEMY_KINDS, type EnemyKind, type EnemyKindId } from './enemyKinds';

/**
 * Waves: the opponents ramp up as the crabs crack, in the battle and in Bullet Hell alike. Every
 * `killsPerStage` cracks is a stage; each stage brings more of them on the beach at once, new
 * kinds (enemyKinds.ts), tougher shells and quicker replacements, and a boss every fifth stage.
 * Cracked, the run is over: back to stage one. The side gauge shows the stage, how far through it,
 * and how hot it is getting.
 */

export type WaveMode = 'battle' | 'hell';

interface Rules {
  killsPerStage: number;
  /** Opponents on the beach at stage one, how many more each stage, and the most there can be. */
  start: number;
  perStage: number;
  max: number;
  /** Seconds to the next opponent at stage one, taken off each stage, and the least it gets to. */
  respawn: number;
  respawnStep: number;
  respawnMin: number;
  /** A weight per kind by stage (0: none yet). */
  roster: (stage: number) => Partial<Record<EnemyKindId, number>>;
  news: Record<number, string>;
}

const RULES: Record<WaveMode, Rules> = {
  // The battle: it opens gently, two little crabs at a time; the full-size random-build crabs and the march
  // join at stage 2, gunners and skirmishers at 3, bruisers at 4, rocketeers and a boss at 5. Each stage adds one.
  battle: {
    killsPerStage: 5,
    start: 2,
    perStage: 1,
    max: 9,
    respawn: 4,
    respawnStep: 0.3,
    respawnMin: 1.4,
    roster: (s) => ({
      scout: s <= 2 ? 3 : 1,
      marcher: s >= 2 ? 1.2 : 0,
      random: s >= 2 ? (s === 2 ? 1.2 : 2.5) : 0,
      gunner: s >= 3 ? 1 : 0,
      skirmisher: s >= 3 ? 1 : 0,
      bruiser: s >= 4 ? 0.9 : 0,
      rocketeer: s >= 5 ? 0.9 : 0,
    }),
    news: {
      2: 'full-size crabs and the march join in',
      3: 'gunners and skirmishers join',
      4: 'bruisers lumber in under heavy guns',
      5: 'rocketeers shell from afar, and a boss',
    },
  },
  // Bullet Hell: a march from the start, faster and fuller.
  hell: {
    killsPerStage: 6,
    start: 3,
    perStage: 1.5,
    max: 12,
    respawn: 2.4,
    respawnStep: 0.12,
    respawnMin: 0.8,
    roster: (s) => ({
      marcher: 3,
      gunner: s >= 2 ? 2 : 0.6,
      skirmisher: s >= 3 ? 1.6 : 0,
      bruiser: s >= 4 ? 1 : 0,
      rocketeer: s >= 5 ? 1.2 : 0,
    }),
    news: {
      2: 'gunners join the march',
      3: 'skirmishers dart in with flame',
      4: 'bruisers lumber in under heavy guns',
      5: 'rocketeers shell from afar, and a boss',
    },
  },
};

export class Waves {
  kills = 0;
  /** Marchers come in groups: this many more of them are due. */
  private groupLeft = 0;
  private bossFor = 0;
  private readonly rules: Rules;

  constructor(readonly mode: WaveMode) {
    this.rules = RULES[mode];
  }

  /** The stage, from one. */
  get stage(): number {
    return 1 + Math.floor(this.kills / this.rules.killsPerStage);
  }

  /** How far through the stage, 0..1. */
  get stageShare(): number {
    return (this.kills % this.rules.killsPerStage) / this.rules.killsPerStage;
  }

  /** A crab cracked: what to tell the player when that began a new stage (else null). */
  onKill(): string | null {
    const before = this.stage;
    this.kills++;
    if (this.stage === before) return null;
    const s = this.stage;
    const news = this.rules.news[s] ?? (s % 5 === 0 ? 'a boss' : 'more of them, and tougher');
    return `Stage ${s}: ${news}`;
  }

  /** The run is over (the player cracked): back to stage one; a line to say how far it got. */
  reset(): string {
    const summary = `Run over at stage ${this.stage}: ${this.kills} cracked`;
    this.kills = 0;
    this.groupLeft = 0;
    this.bossFor = 0;
    return summary;
  }

  /** How many opponents the beach should hold now: more with every stage. */
  wantEnemies(): number {
    const r = this.rules;
    return Math.min(r.max, Math.floor(r.start + r.perStage * (this.stage - 1)));
  }

  /** Armour on top of a kind's, by stage. */
  armorScale(): number {
    return 1 + 0.08 * (this.stage - 1);
  }

  /** The kind the beach starts with (before any stage has its say). */
  firstKind(): EnemyKind {
    return this.mode === 'hell' ? ENEMY_KINDS.marcher : ENEMY_KINDS.scout;
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
    const r = this.rules.roster(s);
    const total = Object.values(r).reduce((a, b) => a + (b ?? 0), 0);
    let pick = Math.random() * total;
    for (const [id, w] of Object.entries(r) as [EnemyKindId, number][]) {
      pick -= w ?? 0;
      if (pick <= 0) {
        if (id === 'marcher') this.groupLeft = 2;
        return ENEMY_KINDS[id];
      }
    }
    return this.firstKind();
  }

  /** How long until the next opponent: quick for the rest of a group, faster as the stages mount. */
  respawnSeconds(): number {
    const r = this.rules;
    return this.groupLeft > 0 ? 0.5 : Math.max(r.respawnMin, r.respawn - r.respawnStep * (this.stage - 1));
  }

  /** How hot it is getting overall, 0..1 (the gauge's colour): stage ten is as hot as it reads. */
  heat(): number {
    return Math.min(1, (this.stage - 1 + this.stageShare) / 9);
  }
}
