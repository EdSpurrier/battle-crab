import { Mesh, MeshBuilder, VERTEX_FLOATS, box, material, multiply, rotationY, scaling, translation, type Instance, type Mat4, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { shatter, type Obstacle, type Stuff, type Surface, type World } from './impacts';
import type { Loot } from './loot';
import { sfx } from './sound';
import { PROP_KINDS, type PropDef, type PropKind } from './map';

/**
 * Things on the beach, drawn from code: rocks and boulders (lumpy, grey, solid), clam and snail
 * shells, driftwood (solid), starfish. One mesh per kind, an instance per prop, stood on the
 * ground at its spot, turned and scaled. The solid ones are boxes for shots to hit and for the
 * crabs to walk round. Shells and driftwood break (`hp`): shot enough, one bursts into debris
 * (a shower of what it is made of, and a few chunks that tumble onto the sand as loot's rubble)
 * and blocks nothing any more. Rocks and boulders stand whatever hits them.
 */

interface PropLook {
  name: string;
  mesh: MeshData;
  roughness: number;
  /** Half the size of its box for shots (none: shots pass), before the prop's scale. */
  solid?: Vec3;
  /** Breakable: the hits it takes (at scale one), what it is made of, what it sounds like when hit, the colours of its chunks. */
  hp?: number;
  stuff?: Stuff;
  surface?: Surface;
  chunks?: Vec[];
  /** How far across it reaches on the ground (picking in the map maker), before the scale. */
  radius: number;
  /** Swatch colour for the palette. */
  swatch: string;
}

/** A small deterministic random source. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A low-poly ellipsoid, each ring point pushed in or out by `lumpy` (the same for every face meeting there, so the surface holds together); `keep` leaves faces out. */
function lump(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, color: Vec, segs: number, rings: number, lumpy: number, seed: number, keep?: (y: number) => boolean): MeshData {
  const rand = rng(seed);
  const bump: number[][] = [];
  for (let j = 0; j <= rings; j++) {
    bump.push([]);
    for (let i = 0; i < segs; i++) bump[j].push(1 + (rand() - 0.5) * 2 * lumpy);
  }
  const b = new MeshBuilder();
  const at = (i: number, j: number): Vec => {
    const k = bump[j][((i % segs) + segs) % segs] ?? 1;
    const th = (i / segs) * Math.PI * 2;
    const ph = -Math.PI / 2 + (j / rings) * Math.PI;
    const cp = Math.cos(ph);
    return [cx + rx * k * cp * Math.cos(th), cy + ry * k * Math.sin(ph), cz + rz * k * cp * Math.sin(th)];
  };
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segs; i++) {
      const mid = at(i, j)[1] * 0.5 + at(i + 1, j + 1)[1] * 0.5;
      if (keep && !keep(mid)) continue;
      if (j === 0) b.tri(at(i, 0), at(i, 1), at(i + 1, 1), color);
      else if (j === rings - 1) b.tri(at(i, j), at(i, rings), at(i + 1, j), color);
      else b.quad(at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j), color);
    }
  }
  return b.build();
}

function merge(parts: MeshData[]): MeshData {
  let nv = 0;
  let ni = 0;
  for (const p of parts) {
    nv += p.vertices.length;
    ni += p.indices.length;
  }
  const vertices = new Float32Array(nv);
  const indices = new Uint32Array(ni);
  let vo = 0;
  let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / VERTEX_FLOATS;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}

/** The mesh turned about +y by `a` and moved by (x, y, z). */
function placed(data: MeshData, a: number, x: number, y: number, z: number): MeshData {
  const c = Math.cos(a);
  const s = Math.sin(a);
  const v = new Float32Array(data.vertices);
  for (let i = 0; i < v.length; i += VERTEX_FLOATS) {
    const px = v[i]; const pz = v[i + 2];
    v[i] = px * c + pz * s + x;
    v[i + 1] += y;
    v[i + 2] = -px * s + pz * c + z;
    const nx = v[i + 3]; const nz = v[i + 5];
    v[i + 3] = nx * c + nz * s;
    v[i + 5] = -nx * s + nz * c;
  }
  return { vertices: v, indices: data.indices };
}

const ROCK: Vec = [0.3, 0.29, 0.27];
const BOULDER: Vec = [0.26, 0.25, 0.24];
const CLAM: Vec = [0.78, 0.7, 0.58];
const CLAM_RIB: Vec = [0.62, 0.52, 0.4];
const SNAIL: Vec = [0.62, 0.42, 0.3];
const SNAIL_LIGHT: Vec = [0.75, 0.58, 0.45];
const WOOD: Vec = [0.36, 0.28, 0.2];
const WOOD_DARK: Vec = [0.26, 0.2, 0.14];
const STAR: Vec = [0.75, 0.3, 0.12];

function lookOf(kind: PropKind): PropLook {
  switch (kind) {
    case 'rock':
      return { name: 'Rock', mesh: lump(0, 0.32, 0, 0.6, 0.42, 0.5, ROCK, 10, 6, 0.18, 3), roughness: 0.95, solid: [0.55, 0.42, 0.48], radius: 0.6, swatch: '#5a5753' };
    case 'boulder':
      return { name: 'Boulder', mesh: lump(0, 0.75, 0, 1.25, 0.95, 1.05, BOULDER, 12, 7, 0.16, 7), roughness: 0.95, solid: [1.15, 0.9, 0.95], radius: 1.2, swatch: '#48453f' };
    case 'clam': {
      // A fan: a flattened half-dome with ribs (narrow dark wedges) across it.
      const dome = lump(0, 0, 0, 0.5, 0.2, 0.42, CLAM, 14, 6, 0.04, 11, (y) => y > -0.02);
      const ribs: MeshData[] = [];
      for (let k = 0; k < 7; k++) {
        const a = -0.9 + (1.8 * k) / 6;
        ribs.push(placed(box(-0.015, 0.0, 0, 0.015, 0.215, 0.44, CLAM_RIB), a, 0, 0, -0.08));
      }
      return { name: 'Clam shell', mesh: merge([dome, ...ribs]), roughness: 0.6, solid: [0.48, 0.2, 0.4], hp: 35, stuff: 'stone', surface: 'shell', chunks: [CLAM, CLAM_RIB], radius: 0.5, swatch: '#c7b394' };
    }
    case 'snail':
      return { name: 'Snail shell', mesh: merge([lump(0, 0.26, 0, 0.32, 0.26, 0.36, SNAIL, 12, 7, 0.03, 13), lump(0.18, 0.42, -0.12, 0.2, 0.17, 0.2, SNAIL_LIGHT, 10, 6, 0.03, 17), lump(0.33, 0.52, -0.2, 0.1, 0.09, 0.11, SNAIL, 8, 5, 0.03, 19)]), roughness: 0.7, solid: [0.34, 0.3, 0.38], hp: 45, stuff: 'stone', surface: 'shell', chunks: [SNAIL, SNAIL_LIGHT], radius: 0.4, swatch: '#9e6b4c' };
    case 'driftwood':
      return {
        name: 'Driftwood',
        mesh: merge([lump(0, 0.14, 0, 1, 0.14, 0.13, WOOD, 10, 5, 0.08, 23), placed(lump(0, 0, 0, 0.42, 0.07, 0.07, WOOD_DARK, 8, 4, 0.06, 29), 0.6, 0.45, 0.22, 0.15), lump(0.9, 0.12, 0, 0.18, 0.12, 0.12, WOOD_DARK, 8, 4, 0.06, 31)]),
        roughness: 0.9,
        solid: [1, 0.16, 0.16],
        hp: 70,
        stuff: 'wood',
        surface: 'wood',
        chunks: [WOOD, WOOD_DARK],
        radius: 1,
        swatch: '#5c4733',
      };
    case 'starfish': {
      const arms: MeshData[] = [];
      for (let k = 0; k < 5; k++) arms.push(placed(lump(0, 0.04, 0.2, 0.08, 0.045, 0.22, STAR, 8, 4, 0.05, 37 + k), (k * Math.PI * 2) / 5, 0, 0, 0));
      return { name: 'Starfish', mesh: merge([lump(0, 0.045, 0, 0.14, 0.06, 0.14, STAR, 10, 5, 0.03, 41), ...arms]), roughness: 0.8, radius: 0.4, swatch: '#bf4d1f' };
    }
  }
}

export const PROP_LOOKS: Record<PropKind, PropLook> = Object.fromEntries(PROP_KINDS.map((k) => [k, lookOf(k)])) as Record<PropKind, PropLook>;

/** A breakable prop's box carries this: a hit on it hurts the prop. */
export interface PropRef {
  props: Props;
  index: number;
}
export const isPropRef = (o: unknown): o is PropRef => !!o && typeof o === 'object' && 'props' in o && (o as PropRef).props instanceof Props;

export class Props {
  private readonly meshes = new Map<PropKind, Mesh>();
  private readonly materials = new Map<PropKind, ReturnType<typeof material>>();
  private instances: Instance[] = [];
  defs: PropDef[] = [];
  /** Hits left per prop (Infinity for one that never breaks), and each one's box in the world (none once broken). */
  private hp: number[] = [];
  private boxes: (Obstacle | null)[] = [];
  /** The world whose obstacles the boxes are, and where the debris goes (the game; the map maker attaches nothing). */
  private world: World | null = null;
  private loot: Loot | null = null;

  constructor(private readonly renderer: Renderer, private readonly groundHeight: (x: number, z: number) => number, defs: PropDef[]) {
    for (const k of PROP_KINDS) {
      this.meshes.set(k, new Mesh(renderer.gl, PROP_LOOKS[k].mesh));
      this.materials.set(k, material({ roughness: PROP_LOOKS[k].roughness }));
    }
    this.rebuild(defs);
  }

  /** Draw these props (the old ones gone), whole again. */
  rebuild(defs: PropDef[]): void {
    this.clear();
    this.defs = defs;
    for (const d of defs) {
      const instance: Instance = { mesh: this.meshes.get(d.kind)!, model: new Float32Array(16), material: this.materials.get(d.kind) };
      this.place(instance, d);
      this.instances.push(instance);
    }
    this.renderer.instances.push(...this.instances);
    this.hp = defs.map((d) => (PROP_LOOKS[d.kind].hp ?? Infinity) * d.scale);
    this.boxes = defs.map((_, i) => this.boxOf(i));
    if (this.world) this.world.obstacles.push(...this.boxes.filter((b): b is Obstacle => !!b));
  }

  /** Put the solid props' boxes into the world (shots stop at them, crabs walk round them) and send the debris of broken ones to `loot`. */
  attach(world: World, loot: Loot): void {
    this.world = world;
    this.loot = loot;
    world.obstacles.push(...this.boxes.filter((b): b is Obstacle => !!b));
  }

  /** Prop `i`'s box for shots (null: shots pass, or it is broken), owned by it when it can break. */
  private boxOf(i: number): Obstacle | null {
    const d = this.defs[i];
    const look = PROP_LOOKS[d.kind];
    if (!look.solid) return null;
    const half: Vec3 = [look.solid[0] * d.scale, look.solid[1] * d.scale, look.solid[2] * d.scale];
    const box: Obstacle = { center: [d.x, this.groundHeight(d.x, d.z) + half[1], d.z], half, yaw: (d.yaw * Math.PI) / 180, surface: look.surface ?? 'rock' };
    if (look.hp) box.owner = { props: this, index: i } as PropRef;
    return box;
  }

  /** A blow of `amount` to prop `i` (at `at`, for the debris); enough of them and it breaks. */
  damage(i: number, amount: number, at?: Vec3): void {
    if (!(this.hp[i] > 0) || !isFinite(this.hp[i])) return;
    this.hp[i] -= amount;
    if (this.hp[i] > 0) return;
    this.hp[i] = 0;
    this.break(i, at);
  }

  /** Prop `i` bursts: its drawing goes, its box leaves the world, and what it was made of flies and tumbles onto the sand. */
  private break(i: number, at?: Vec3): void {
    const d = this.defs[i];
    const look = PROP_LOOKS[d.kind];
    const inst = this.instances[i];
    if (inst) inst.hidden = true;
    const wall = this.boxes[i];
    if (wall && this.world) {
      const k = this.world.obstacles.indexOf(wall);
      if (k >= 0) this.world.obstacles.splice(k, 1);
    }
    this.boxes[i] = null;
    const c: Vec3 = wall ? wall.center : [d.x, this.groundHeight(d.x, d.z) + 0.2 * d.scale, d.z];
    const stuff = look.stuff ?? 'stone';
    sfx.play(stuff === 'wood' ? 'break.wood' : 'break.shell', c);
    shatter(this.renderer, at ? [at[0], Math.max(at[1], c[1]), at[2]] : c, stuff, 2.5 * Math.sqrt(d.scale));
    shatter(this.renderer, c, stuff, 1.5 * Math.sqrt(d.scale));
    if (!this.loot) return;
    // Chunks: a handful of lumps in its colours, flung out and up, that tumble and lie as rubble (blocking nothing) until they sink.
    const n = 4 + Math.floor(Math.random() * 3);
    const colors = look.chunks ?? [[0.5, 0.5, 0.5]];
    for (let k = 0; k < n; k++) {
      const s = d.scale * (0.12 + Math.random() * 0.14);
      const sx = s * (0.7 + Math.random() * 1.4);
      const sz = s * (0.7 + Math.random() * 1.4);
      const sy = s * (0.5 + Math.random() * 0.6);
      const mesh = new Mesh(this.renderer.gl, box(-sx, -sy, -sz, sx, sy, sz, colors[k % colors.length]));
      const instance: Instance = { mesh, model: new Float32Array(16), material: this.materials.get(d.kind) };
      this.renderer.instances.push(instance);
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 3;
      this.loot.add(null, instance, undefined, [c[0] + Math.cos(a) * 0.2 * d.scale, c[1] + 0.1, c[2] + Math.sin(a) * 0.2 * d.scale], [Math.cos(a) * sp, 3 + Math.random() * 3, Math.sin(a) * sp]);
    }
  }

  /** Move prop `i`'s drawing to where its def now says. */
  refresh(i: number): void {
    const d = this.defs[i];
    const inst = this.instances[i];
    if (d && inst) this.place(inst, d);
  }

  private place(instance: Instance, d: PropDef): void {
    const m = multiply(translation(d.x, this.groundHeight(d.x, d.z), d.z), multiply(rotationY((d.yaw * Math.PI) / 180), scaling(d.scale, d.scale, d.scale)));
    (instance.model as Float32Array).set(m);
  }

  /** The solid ones' boxes for shots (the broken ones gone). */
  obstacles(): Obstacle[] {
    return this.boxes.filter((b): b is Obstacle => !!b);
  }

  /** The prop under a ground point (the nearest whose reach covers it), or -1. */
  pick(x: number, z: number): number {
    let best = -1;
    let bestD = Infinity;
    this.defs.forEach((d, i) => {
      const r = PROP_LOOKS[d.kind].radius * d.scale;
      const dist = Math.hypot(d.x - x, d.z - z);
      if (dist <= r && dist < bestD) {
        best = i;
        bestD = dist;
      }
    });
    return best;
  }

  private clear(): void {
    const gone = new Set(this.instances);
    const list = this.renderer.instances;
    let k = 0;
    for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[k++] = list[i];
    list.length = k;
    this.instances = [];
    if (this.world) {
      const boxes = new Set(this.boxes);
      const obs = this.world.obstacles;
      let n = 0;
      for (let i = 0; i < obs.length; i++) if (!boxes.has(obs[i])) obs[n++] = obs[i];
      obs.length = n;
    }
    this.boxes = [];
    this.hp = [];
  }

  dispose(): void {
    this.clear();
    for (const m of this.meshes.values()) m.dispose();
  }
}

export type { Mat4 };
