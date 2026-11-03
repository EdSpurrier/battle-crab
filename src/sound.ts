import type { Vec3 } from 'gridfall-engine';

/**
 * Sound: Web Audio, one shared player for the whole game (`sfx`). The sounds are the game's picks from
 * the Sound FX Library (sfx.json, copied into public/sfx by scripts/sfx.mjs): each event has a few
 * variations, one picked at random each time and pitched a little either way so repeats do not drone.
 * A sound at a place in the world is quieter the further it is from the listener (the player) and
 * panned by which side of the camera it is on. Busy events (a gatling's rounds, hits) are rate-limited.
 * Loops (the flamethrower, a winch, the sea) run while something keeps asking for them (`hold`) and
 * fade out when it stops. Nothing plays until the page has had a click or a key (the browser's rule).
 */

interface Event {
  volume: number;
  buffers: AudioBuffer[];
}

interface Held {
  source: AudioBufferSourceNode;
  gain: GainNode;
  pan: StereoPannerNode;
  /** Seconds since it was last asked for. */
  idle: number;
  base: number;
}

/** The least time between two plays of an event (seconds); anything not listed: MIN_GAP. */
const GAPS: Record<string, number> = { 'machinegun.fire': 0.05, 'gatling.fire': 0.045, 'hit.shell': 0.06, 'hit.metal': 0.06, 'hit.wood': 0.06, 'hit.stone': 0.08, 'grenade.bounce': 0.08, 'fireworks.pop': 0.08, whoosh: 0.18, jump: 0.15 };
const MIN_GAP = 0.03;
/** Sounds at once, at most (the oldest give way). */
const MAX_VOICES = 28;
/** How far a sound carries: full within NEAR, half at NEAR + FALLOFF, and on down. */
const NEAR = 6;
const FALLOFF = 14;

export class Sound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private readonly events = new Map<string, Event>();
  private readonly lastPlayed = new Map<string, number>();
  private readonly held = new Map<string, Held>();
  private voices: { source: AudioBufferSourceNode; ends: number }[] = [];
  private loading: Promise<void> | null = null;
  /** Where the listener is (the player), and the camera's right along the ground (for panning). */
  listener: Vec3 = [0, 0, 0];
  right: Vec3 = [1, 0, 0];
  private volume_ = 0.8;
  private muted = false;

  get volume(): number {
    return this.volume_;
  }
  set volume(v: number) {
    this.volume_ = Math.max(0, Math.min(1, v));
    if (this.master) this.master.gain.value = this.muted ? 0 : this.volume_;
  }
  get mute(): boolean {
    return this.muted;
  }
  set mute(m: boolean) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this.volume_;
  }

  /** Start up on the first click or key (browsers keep audio off until then); the sounds load in the background. */
  armOnGesture(onReady?: () => void): void {
    const go = () => {
      window.removeEventListener('pointerdown', go, true);
      window.removeEventListener('keydown', go, true);
      this.start().then(() => onReady?.());
    };
    window.addEventListener('pointerdown', go, true);
    window.addEventListener('keydown', go, true);
  }

  private start(): Promise<void> {
    if (this.loading) return this.loading;
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return (this.loading = Promise.resolve());
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.muted ? 0 : this.volume_;
    this.master.connect(this.ctx.destination);
    this.loading = this.load();
    return this.loading;
  }

  private async load(): Promise<void> {
    const base = `${import.meta.env.BASE_URL}sfx/`;
    let manifest: Record<string, { volume: number; files: string[] }>;
    try {
      const r = await fetch(`${base}manifest.json`);
      if (!r.ok) return;
      manifest = await r.json();
    } catch {
      return;
    }
    const ctx = this.ctx!;
    await Promise.all(
      Object.entries(manifest).map(async ([key, e]) => {
        const buffers: AudioBuffer[] = [];
        for (const f of e.files) {
          try {
            const data = await (await fetch(base + f)).arrayBuffer();
            buffers.push(await ctx.decodeAudioData(data));
          } catch {
            /* that one is skipped */
          }
        }
        if (buffers.length) this.events.set(key, { volume: e.volume, buffers });
      }),
    );
  }

  /** How loud and where (pan) a sound at `at` is for the listener. */
  private place(at?: Vec3): { gain: number; pan: number } {
    if (!at) return { gain: 1, pan: 0 };
    const dx = at[0] - this.listener[0];
    const dz = at[2] - this.listener[2];
    const d = Math.hypot(dx, dz);
    const gain = d <= NEAR ? 1 : 1 / (1 + (d - NEAR) / FALLOFF);
    const pan = d < 0.5 ? 0 : Math.max(-1, Math.min(1, ((dx * this.right[0] + dz * this.right[2]) / d) * 0.7));
    return { gain, pan };
  }

  /** Play an event once: at a place in the world (else at the listener), louder or softer, higher or lower. */
  play(key: string, at?: Vec3, volume = 1, rate = 1): void {
    const ctx = this.ctx;
    const e = this.events.get(key);
    if (!ctx || !e || !this.master) return;
    const now = ctx.currentTime;
    if (now - (this.lastPlayed.get(key) ?? -1) < (GAPS[key] ?? MIN_GAP)) return;
    const { gain, pan } = this.place(at);
    const loud = e.volume * volume * gain;
    if (loud < 0.02) return;
    this.lastPlayed.set(key, now);
    this.voices = this.voices.filter((v) => v.ends > now);
    if (this.voices.length >= MAX_VOICES) {
      const oldest = this.voices.shift();
      try {
        oldest?.source.stop();
      } catch {
        /* already done */
      }
    }
    const buffer = e.buffers[Math.floor(Math.random() * e.buffers.length)];
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.playbackRate.value = rate * (0.94 + Math.random() * 0.12);
    const g = ctx.createGain();
    g.gain.value = loud;
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    source.connect(g).connect(p).connect(this.master);
    source.start();
    this.voices.push({ source, ends: now + buffer.duration / source.playbackRate.value });
  }

  /** Keep a loop going under `id` (call every frame it should sound; it fades out a moment after the calls stop). */
  hold(id: string, key: string, at?: Vec3, volume = 1): void {
    const ctx = this.ctx;
    const e = this.events.get(key);
    if (!ctx || !e || !this.master) return;
    let h = this.held.get(id);
    if (!h) {
      const source = ctx.createBufferSource();
      source.buffer = e.buffers[0];
      source.loop = true;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      const pan = ctx.createStereoPanner();
      source.connect(gain).connect(pan).connect(this.master);
      source.start(0, Math.random() * e.buffers[0].duration);
      h = { source, gain, pan, idle: 0, base: e.volume };
      this.held.set(id, h);
    }
    h.idle = 0;
    const { gain, pan } = this.place(at);
    h.gain.gain.setTargetAtTime(h.base * volume * gain, ctx.currentTime, 0.05);
    h.pan.pan.setTargetAtTime(pan, ctx.currentTime, 0.05);
  }

  /** A frame: loops nobody asked for fade out and stop. */
  update(dt: number): void {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const [id, h] of this.held) {
      h.idle += dt;
      if (h.idle > 0.12) h.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      if (h.idle > 0.8) {
        try {
          h.source.stop();
        } catch {
          /* already stopped */
        }
        this.held.delete(id);
      }
    }
  }
}

/** The game's one sound player. */
export const sfx = new Sound();
