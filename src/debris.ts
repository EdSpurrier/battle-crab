import { Mesh, MeshBuilder, material, type Instance, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';

/**
 * Debris: real chunks that fly off whatever is hit, tumble, bounce on the sand, skid to a stop and
 * shrink away after a few seconds. One pool for the whole beach (debrisFor(renderer)), at most
 * MAX_CHUNKS at once (the oldest go first), so a gatling burst or a chain of grenades can throw as
 * much as it likes. What a chunk is made of picks its colours: a crab's shell, wood, metal, stone,
 * sand (clods thrown up by a burst), fire (glowing embers that cool as they fall).
 */

export type DebrisStuff = 'shell' | 'wood' | 'metal' | 'stone' | 'sand' | 'ember';

const COLORS: Record<DebrisStuff, Vec[]> = {
  shell: [[0.62, 0.42, 0.24], [0.78, 0.6, 0.4], [0.45, 0.28, 0.16], [0.85, 0.3, 0.15]],
  wood: [[0.55, 0.38, 0.18], [0.42, 0.28, 0.12], [0.7, 0.54, 0.32]],
  metal: [[0.35, 0.36, 0.4], [0.22, 0.22, 0.25], [0.5, 0.5, 0.55]],
  stone: [[0.45, 0.44, 0.42], [0.32, 0.31, 0.3], [0.58, 0.56, 0.52]],
  sand: [[0.78, 0.68, 0.48], [0.66, 0.56, 0.38], [0.72, 0.62, 0.42]],
  ember: [[1, 0.5, 0.15], [0.9, 0.3, 0.08]],
};

/** Chunks fly at most this long, and this many lie about at once. */
const LIFE = 3.2;
const MAX_CHUNKS = 260;
const GRAVITY = 20;

interface Chunk {
  instance: Instance;
  pos: Vec3;
  vel: Vec3;
  /** Its tumble: an angle about each of two axes and their rates. */
  ax: number;
  ay: number;
  wx: number;
  wy: number;
  size: Vec3;
  age: number;
  life: number;
  resting: boolean;
}

/** An irregular chunk: a box with its corners pushed about, so no two shapes read the same. */
function chunkMesh(color: Vec, seed: number): MeshData {
  let a = seed * 9301 + 49297;
  const r = () => {
    a = (a * 9301 + 49297) % 233280;
    return a / 233280;
  };
  const j = (v: number) => v * (0.65 + r() * 0.7);
  const c: Vec[] = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) c.push([j(x), j(y), j(z)]);
  const b = new MeshBuilder();
  // Corners: index = (x>0)*4 + (y>0)*2 + (z>0).
  const q = (i0: number, i1: number, i2: number, i3: number) => b.quad(c[i0], c[i1], c[i2], c[i3], color);
  q(0, 1, 3, 2); // -x
  q(4, 6, 7, 5); // +x
  q(0, 4, 5, 1); // -y
  q(2, 3, 7, 6); // +y
  q(0, 2, 6, 4); // -z
  q(1, 5, 7, 3); // +z
  return b.build();
}

export class Debris {
  private readonly chunks: Chunk[] = [];
  private readonly meshes = new Map<string, Mesh[]>();
  private readonly mat = material({ roughness: 0.8 });
  /** Embers glow. */
  private readonly glow = material({ roughness: 1, emissive: [3, 1.2, 0.3] });

  constructor(private readonly renderer: Renderer, private readonly groundHeight: (x: number, z: number) => number) {}

  private meshOf(stuff: DebrisStuff | Vec[]): Mesh {
    const key = typeof stuff === 'string' ? stuff : stuff.map((c) => c.map((v) => v.toFixed(2)).join(',')).join(';');
    let list = this.meshes.get(key);
    if (!list) {
      list = [];
      (typeof stuff === 'string' ? COLORS[stuff] : stuff).forEach((col, i) => {
        for (let k = 0; k < 2; k++) list!.push(new Mesh(this.renderer.gl, chunkMesh(col, i * 7 + k * 13 + key.length)));
      });
      this.meshes.set(key, list);
    }
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * Throw `count` chunks of `stuff` from `at`: along `dir` (a cone about it) or every way, at about
   * `speed`, each about `size` across (with a good spread of sizes).
   */
  burst(at: Vec3, stuff: DebrisStuff | Vec[], count: number, speed: number, size: number, dir?: Vec3, cone = 0.8): void {
    for (let n = 0; n < count; n++) {
      let v: Vec3;
      if (dir) {
        const l = Math.hypot(dir[0], dir[1], dir[2]) || 1;
        v = [dir[0] / l + (Math.random() - 0.5) * 2 * cone, dir[1] / l + (Math.random() - 0.3) * 2 * cone, dir[2] / l + (Math.random() - 0.5) * 2 * cone];
      } else {
        const a = Math.random() * Math.PI * 2;
        const up = 0.3 + Math.random() * 0.9;
        v = [Math.cos(a), up, Math.sin(a)];
      }
      const vl = Math.hypot(v[0], v[1], v[2]) || 1;
      const sp = speed * (0.5 + Math.random() * 0.8);
      const s = size * (0.4 + Math.random() * 0.9);
      this.add({
        pos: [at[0], at[1], at[2]],
        vel: [(v[0] / vl) * sp, (v[1] / vl) * sp + 1.5, (v[2] / vl) * sp],
        size: [s * (0.7 + Math.random() * 0.6), s * (0.5 + Math.random() * 0.5), s * (0.7 + Math.random() * 0.6)],
        stuff,
      });
    }
  }

  private add(c: { pos: Vec3; vel: Vec3; size: Vec3; stuff: DebrisStuff | Vec[] }): void {
    if (this.chunks.length >= MAX_CHUNKS) this.remove(0);
    const instance: Instance = { mesh: this.meshOf(c.stuff), model: new Float32Array(16), material: c.stuff === 'ember' ? this.glow : this.mat };
    this.renderer.instances.push(instance);
    this.chunks.push({ instance, pos: c.pos, vel: c.vel, size: c.size, ax: Math.random() * 6, ay: Math.random() * 6, wx: (Math.random() - 0.5) * 24, wy: (Math.random() - 0.5) * 24, age: 0, life: (c.stuff === 'ember' ? 0.5 : 0.7) * LIFE + Math.random() * LIFE * 0.4, resting: false });
  }

  /** A frame: fly, bounce, skid, shrink away. */
  update(dt: number): void {
    for (let i = this.chunks.length - 1; i >= 0; i--) {
      const c = this.chunks[i];
      c.age += dt;
      if (c.age >= c.life) {
        this.remove(i);
        continue;
      }
      if (!c.resting) {
        c.vel[1] -= GRAVITY * dt;
        const drag = Math.exp(-0.4 * dt);
        c.vel[0] *= drag;
        c.vel[2] *= drag;
        c.pos[0] += c.vel[0] * dt;
        c.pos[1] += c.vel[1] * dt;
        c.pos[2] += c.vel[2] * dt;
        c.ax += c.wx * dt;
        c.ay += c.wy * dt;
        const floor = this.groundHeight(c.pos[0], c.pos[2]) + c.size[1] * 0.6;
        if (c.pos[1] < floor) {
          c.pos[1] = floor;
          if (c.vel[1] < -2) {
            // A bounce: it keeps a little of its fall, skids, and tumbles slower.
            c.vel[1] = -c.vel[1] * 0.35;
            c.vel[0] *= 0.6;
            c.vel[2] *= 0.6;
            c.wx *= 0.6;
            c.wy *= 0.6;
          } else {
            c.resting = true;
            c.vel = [0, 0, 0];
          }
        }
      }
      // The last half second it shrinks into the sand.
      const fade = Math.min(1, (c.life - c.age) / 0.5);
      const m = c.instance.model as Float32Array;
      const sx = Math.sin(c.ax);
      const cx = Math.cos(c.ax);
      const sy = Math.sin(c.ay);
      const cy = Math.cos(c.ay);
      // rotationY(ay) * rotationX(ax) * scale(size * fade), then moved to pos.
      const [kx, ky, kz] = [c.size[0] * fade, c.size[1] * fade, c.size[2] * fade];
      m[0] = cy * kx; m[1] = 0; m[2] = -sy * kx; m[3] = 0;
      m[4] = sy * sx * ky; m[5] = cx * ky; m[6] = cy * sx * ky; m[7] = 0;
      m[8] = sy * cx * kz; m[9] = -sx * kz; m[10] = cy * cx * kz; m[11] = 0;
      m[12] = c.pos[0]; m[13] = c.pos[1]; m[14] = c.pos[2]; m[15] = 1;
    }
  }

  private remove(i: number): void {
    const c = this.chunks[i];
    this.chunks.splice(i, 1);
    const list = this.renderer.instances;
    const k = list.indexOf(c.instance);
    if (k >= 0) list.splice(k, 1);
  }

  get count(): number {
    return this.chunks.length;
  }
}

const pools = new WeakMap<Renderer, Debris>();

/** The beach's one debris pool (made on first use; the game calls update each frame). */
export function debrisFor(renderer: Renderer, groundHeight?: (x: number, z: number) => number): Debris {
  let d = pools.get(renderer);
  if (!d) {
    d = new Debris(renderer, groundHeight ?? (() => 0));
    pools.set(renderer, d);
  }
  return d;
}
