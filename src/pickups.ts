import { Mesh, box, material, multiply, rotationY, translation, type Instance, type PointLight, type Renderer, type Vec3 } from 'gridfall-engine';
import { PROP_LOOKS } from './props';

/**
 * Pickups on the beach: an ammo crate (every weapon refilled), a health box (half the armour
 * back), a starfish (eat it: a spell of invincibility). They bob and turn where they lie; walk
 * over one to take it; another appears somewhere else a while later. A power-up (Bullet Hell) is
 * placed where a crab cracked rather than spawned, and does not count toward the beach's usual few.
 */
export type PickupKind = 'ammo' | 'health' | 'starfish' | 'power';

interface Pickup {
  kind: PickupKind;
  pos: Vec3;
  instance: Instance;
  phase: number;
  /** Put there on purpose (a power-up), not one of the beach's own. */
  placed: boolean;
}

const PICKUPS = 5;
const RESPAWN = 14;
const REACH = 1.3;

function merge(parts: { vertices: Float32Array; indices: Uint32Array }[]): { vertices: Float32Array; indices: Uint32Array } {
  let nv = 0; let ni = 0;
  for (const p of parts) { nv += p.vertices.length; ni += p.indices.length; }
  const vertices = new Float32Array(nv);
  const indices = new Uint32Array(ni);
  let vo = 0; let io = 0;
  for (const p of parts) {
    vertices.set(p.vertices, vo);
    const base = vo / 11;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}

export class Pickups {
  private readonly items: Pickup[] = [];
  private readonly meshes: Record<PickupKind, Mesh>;
  private readonly mats = { ammo: material({ roughness: 0.85 }), health: material({ roughness: 0.6 }), starfish: material({ roughness: 0.8 }), power: material({ roughness: 0.3, metallic: 0.2 }) };
  private respawnIn = 3;

  constructor(private readonly renderer: Renderer, private readonly groundHeight: (x: number, z: number) => number, private readonly size: number, private readonly keepClear: () => Vec3) {
    const gl = renderer.gl;
    // An ammo crate: a wooden box with a brass band and bullet tips showing. A health box: white with a red cross. A starfish: the prop's.
    const crate = merge([box(-0.3, 0, -0.3, 0.3, 0.42, 0.3, [0.42, 0.27, 0.13]), box(-0.31, 0.16, -0.31, 0.31, 0.26, 0.31, [0.55, 0.4, 0.12]), ...[-0.15, 0, 0.15].map((x) => box(x - 0.04, 0.42, -0.04, x + 0.04, 0.55, 0.04, [0.6, 0.45, 0.15]))]);
    const health = merge([box(-0.3, 0, -0.3, 0.3, 0.4, 0.3, [0.85, 0.85, 0.85]), box(-0.2, 0.41, -0.07, 0.2, 0.44, 0.07, [0.8, 0.08, 0.05]), box(-0.07, 0.41, -0.2, 0.07, 0.44, 0.2, [0.8, 0.08, 0.05]), box(-0.31, 0.41, -0.07, -0.29, 0.44, 0.07, [0.8, 0.08, 0.05])]);
    // A power-up: a bright magenta crystal (HDR colours, so it glows) on a dark base.
    const power = merge([box(-0.12, 0.25, -0.12, 0.12, 0.85, 0.12, [2.4, 0.5, 2.8]), box(-0.2, 0.42, -0.2, 0.2, 0.62, 0.2, [3, 1.2, 3.2]), box(-0.22, 0, -0.22, 0.22, 0.08, 0.22, [0.08, 0.08, 0.1])]);
    this.meshes = { ammo: new Mesh(gl, crate), health: new Mesh(gl, health), starfish: new Mesh(gl, PROP_LOOKS.starfish.mesh), power: new Mesh(gl, power) };
    for (let i = 0; i < PICKUPS; i++) this.spawn();
  }

  private spawn(): void {
    const kinds: PickupKind[] = ['ammo', 'ammo', 'health', 'health', 'starfish'];
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const clear = this.keepClear();
    let x = this.size / 2;
    let z = this.size / 2;
    for (let tries = 0; tries < 30; tries++) {
      x = 3 + Math.random() * (this.size - 6);
      z = 3 + Math.random() * (this.size - 6);
      if (Math.hypot(x - clear[0], z - clear[2]) > 8) break;
    }
    const instance: Instance = { mesh: this.meshes[kind], model: new Float32Array(16), material: this.mats[kind] };
    this.renderer.instances.push(instance);
    this.items.push({ kind, pos: [x, this.groundHeight(x, z), z], instance, phase: Math.random() * 6, placed: false });
  }

  /** Put a pickup of `kind` at `pos` (a power-up where a crab cracked). */
  place(kind: PickupKind, pos: Vec3): void {
    const instance: Instance = { mesh: this.meshes[kind], model: new Float32Array(16), material: this.mats[kind] };
    this.renderer.instances.push(instance);
    this.items.push({ kind, pos: [pos[0], this.groundHeight(pos[0], pos[2]), pos[2]], instance, phase: Math.random() * 6, placed: true });
  }

  /** A pulsing light over each power-up. */
  lights(): PointLight[] {
    const out: PointLight[] = [];
    for (const p of this.items) if (p.kind === 'power') out.push({ x: p.pos[0], y: p.pos[1] + 1, z: p.pos[2], radius: 4, r: 1, g: 0.3, b: 1, intensity: 10 + 5 * Math.sin(p.phase * 2) });
    return out;
  }

  /** A frame: bob and turn; whatever `at` has walked over is taken (`onTake` says what it was). */
  update(dt: number, at: Vec3, onTake: (kind: PickupKind) => void): void {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const p = this.items[i];
      p.phase += dt * 2;
      const scale = p.kind === 'starfish' ? 1.4 : 1;
      const m = multiply(translation(p.pos[0], p.pos[1] + 0.12 + Math.sin(p.phase) * 0.08, p.pos[2]), rotationY(p.phase * (p.kind === 'power' ? 2 : 0.5)));
      if (scale !== 1) for (let k = 0; k < 12; k++) m[k] *= scale;
      (p.instance.model as Float32Array).set(m);
      if (Math.hypot(at[0] - p.pos[0], at[2] - p.pos[2]) < REACH && Math.abs(at[1] - p.pos[1]) < 1.5) {
        onTake(p.kind);
        const glow: [number, number, number] = p.kind === 'ammo' ? [1, 0.8, 0.3] : p.kind === 'health' ? [0.4, 1, 0.5] : p.kind === 'power' ? [2, 0.5, 2.5] : [1, 0.6, 0.9];
        this.renderer.particles.emit(p.pos[0], p.pos[1] + 0.3, p.pos[2], { count: 40, color: glow, colorTo: [1, 1, 1], speed: 2.5, up: 2, cone: Math.PI, life: 0.8, size: 0.08, gravity: -1, drag: 1, fadeCurve: 'down', sizeCurve: 'none', shape: 'spark' });
        const list = this.renderer.instances;
        const k = list.indexOf(p.instance);
        if (k >= 0) list.splice(k, 1);
        this.items.splice(i, 1);
      }
    }
    if (this.items.filter((p) => !p.placed).length < PICKUPS) {
      this.respawnIn -= dt;
      if (this.respawnIn <= 0) {
        this.spawn();
        this.respawnIn = RESPAWN;
      }
    }
  }
}
