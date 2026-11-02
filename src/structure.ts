import { Mesh, MeshBuilder, box, material, multiply, rotationX, rotationY, translation, type Instance, type Mat4, type MeshData, type Renderer, type Vec } from 'gridfall-engine';
import { CELL, cellCentre, pieceType, shellType, type Piece, type ShellBuild, type ShellType } from './shell';

/**
 * What is built on the shell, drawn: one mesh per piece in its cell, in body space, posed each
 * frame by the crab's body matrix. Weapons have a moving part (a barrel that kicks back, a
 * gatling cluster that spins, a knocker ball that swings) driven by `kick` and `spin`.
 */

const WOOD: Vec = [0.42, 0.27, 0.13];
const WOOD_DARK: Vec = [0.3, 0.19, 0.09];
const IRON: Vec = [0.16, 0.16, 0.18];
const IRON_LIGHT: Vec = [0.3, 0.3, 0.33];
const BRASS: Vec = [0.55, 0.4, 0.12];
const TANK: Vec = [0.5, 0.08, 0.05];
const H = CELL / 2;

function ellipsoid(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, color: Vec, segs = 10, rings = 6): MeshData {
  const b = new MeshBuilder();
  const at = (i: number, j: number): Vec => {
    const th = (i / segs) * Math.PI * 2;
    const ph = -Math.PI / 2 + (j / rings) * Math.PI;
    const cp = Math.cos(ph);
    return [cx + rx * cp * Math.cos(th), cy + ry * Math.sin(ph), cz + rz * cp * Math.sin(th)];
  };
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segs; i++) {
      if (j === 0) b.tri(at(i, 0), at(i, 1), at(i + 1, 1), color);
      else if (j === rings - 1) b.tri(at(i, j), at(i, rings), at(i + 1, j), color);
      else b.quad(at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j), color);
    }
  }
  return b.build();
}

function merge(parts: MeshData[]): MeshData {
  const FLOATS = 11;
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
    const base = vo / FLOATS;
    for (let i = 0; i < p.indices.length; i++) indices[io + i] = p.indices[i] + base;
    vo += p.vertices.length;
    io += p.indices.length;
  }
  return { vertices, indices };
}

/** A piece's fixed mesh and, for a weapon, its moving part with the point it moves about (cell space: the cell's centre at the origin, the piece facing +z). */
interface Shape {
  fixed: MeshData;
  moving?: MeshData;
  /** Where the moving part pivots / sits (cell space). */
  pivot?: [number, number, number];
  /** Where a shot leaves (cell space). */
  muzzle?: [number, number, number];
}

function shapeOf(kind: Piece['kind']): Shape {
  switch (kind) {
    case 'plank':
      return { fixed: merge([box(-H, -H, -H, H, H, H, WOOD), box(-H * 0.98, H - 0.012, -H * 0.98, H * 0.98, H + 0.004, H * 0.98, WOOD_DARK)]) };
    case 'joint':
      return { fixed: merge([box(-0.05, -H, -0.05, 0.05, H, 0.05, WOOD_DARK), box(-H, H - 0.03, -H, H, H, H, WOOD), box(-H, -H, -H, H, -H + 0.03, H, WOOD)]) };
    case 'cannon':
      return {
        fixed: merge([box(-0.11, -H, -0.1, 0.11, -H + 0.09, 0.1, WOOD_DARK), box(-0.13, -H, -0.12, -0.1, -H + 0.14, 0.12, WOOD_DARK), box(0.1, -H, -0.12, 0.13, -H + 0.14, 0.12, WOOD_DARK)]),
        moving: merge([box(-0.055, -0.055, -0.14, 0.055, 0.055, 0.3, IRON), box(-0.07, -0.07, -0.14, 0.07, 0.07, -0.06, IRON_LIGHT)]),
        pivot: [0, -H + 0.16, 0],
        muzzle: [0, -H + 0.16, 0.32],
      };
    case 'gatling':
      return {
        fixed: merge([box(-0.09, -H, -0.09, 0.09, -H + 0.08, 0.09, IRON), box(-0.03, -H, -0.03, 0.03, 0.02, 0.03, IRON_LIGHT), ellipsoid(0, 0.02, -0.08, 0.09, 0.09, 0.07, IRON_LIGHT)]),
        moving: merge([0, 1, 2, 3, 4, 5].map((k) => {
          const a = (k / 6) * Math.PI * 2;
          const x = Math.cos(a) * 0.045;
          const y = Math.sin(a) * 0.045;
          return box(x - 0.014, y - 0.014, -0.04, x + 0.014, y + 0.014, 0.3, IRON);
        })),
        pivot: [0, 0.02, 0],
        muzzle: [0, 0.02, 0.32],
      };
    case 'machinegun':
      return {
        fixed: merge([box(-0.04, -H, -0.04, 0.04, -0.02, 0.04, IRON), box(-0.06, -0.02, -0.12, 0.06, 0.08, 0.1, IRON_LIGHT), box(-0.03, -0.12, -0.02, 0.03, -0.02, 0.06, BRASS)]),
        moving: box(-0.02, 0.01, 0.08, 0.02, 0.05, 0.3, IRON),
        pivot: [0, 0.03, 0.08],
        muzzle: [0, 0.03, 0.32],
      };
    case 'flamethrower':
      return {
        fixed: merge([ellipsoid(0, -0.02, -0.06, 0.1, 0.11, 0.12, TANK, 12, 7), box(-0.025, -0.01, 0.02, 0.025, 0.04, 0.3, IRON), box(-0.045, -0.03, 0.26, 0.045, 0.06, 0.32, IRON_LIGHT), box(-0.09, -H, -0.1, 0.09, -H + 0.05, 0.08, WOOD_DARK)]),
        muzzle: [0, 0.015, 0.33],
      };
    case 'knocker':
      return {
        fixed: merge([box(-0.03, -H, -0.03, 0.03, H + 0.25, 0.03, WOOD_DARK), box(-0.07, -H, -0.07, 0.07, -H + 0.04, 0.07, IRON)]),
        moving: merge([
          box(-0.02, -0.02, 0, 0.02, 0.02, 0.3, IRON_LIGHT),
          ellipsoid(0, 0, 0.36, 0.09, 0.09, 0.09, IRON),
          ...[[0.1, 0, 0], [-0.1, 0, 0], [0, 0.1, 0], [0, -0.1, 0], [0, 0, 0.1]].map(([dx, dy, dz]) => box(dx - 0.02, dy - 0.02, 0.36 + dz - 0.02, dx + 0.02, dy + 0.02, 0.36 + dz + 0.02, IRON_LIGHT)),
        ]),
        pivot: [0, H + 0.22, 0],
        muzzle: [0, H + 0.22, 0.36],
      };
  }
}

export interface Mounted {
  piece: Piece;
  index: number;
  /** The weapon's moving part: kicked back (0..1, a recoil or a swing) and spun (radians, a gatling). */
  kick: number;
  spin: number;
  muzzleLocal: [number, number, number];
  facingLocal: [number, number, number];
}

interface Part {
  instance: Instance;
  local: Mat4;
  moving?: { instance: Instance; pivot: Mat4; kind: Piece['kind'] };
}

export class Structure {
  readonly shell: ShellType;
  readonly weapons: Mounted[] = [];
  private readonly parts: Part[] = [];
  private readonly instances: Instance[] = [];
  private readonly tmp: Mat4 = new Float32Array(16);
  private readonly tmp2: Mat4 = new Float32Array(16);

  constructor(private readonly renderer: Renderer, readonly build: ShellBuild) {
    this.shell = shellType(build.shell);
    const gl = renderer.gl;
    const wood = material({ roughness: 0.9 });
    const metal = material({ roughness: 0.45, metallic: 0.6 });
    build.pieces.forEach((piece, index) => {
      const type = pieceType(piece.kind);
      const shape = shapeOf(piece.kind);
      const c = cellCentre(this.shell, piece.x, piece.y, piece.z);
      const local = multiply(translation(c[0], c[1], c[2]), rotationY((piece.yaw * Math.PI) / 2));
      const mat = type.weapon ? metal : wood;
      const instance: Instance = { mesh: new Mesh(gl, shape.fixed), model: new Float32Array(16), material: mat };
      this.instances.push(instance);
      const part: Part = { instance, local };
      if (shape.moving && shape.pivot) {
        const mi: Instance = { mesh: new Mesh(gl, shape.moving), model: new Float32Array(16), material: mat };
        this.instances.push(mi);
        part.moving = { instance: mi, pivot: multiply(local, translation(shape.pivot[0], shape.pivot[1], shape.pivot[2])), kind: piece.kind };
      }
      this.parts.push(part);
      if (type.weapon && shape.muzzle && this.weapons.length < 4) {
        const yaw = (piece.yaw * Math.PI) / 2;
        const s = Math.sin(yaw);
        const co = Math.cos(yaw);
        const m = shape.muzzle;
        this.weapons.push({ piece, index, kick: 0, spin: 0, muzzleLocal: [c[0] + m[0] * co + m[2] * s, c[1] + m[1], c[2] - m[0] * s + m[2] * co], facingLocal: [s, 0, co] });
      }
    });
    renderer.instances.push(...this.instances);
  }

  /** Place every piece by the crab's body matrix, the moving parts by their kick and spin. */
  pose(body: Mat4): void {
    let w = 0;
    for (const part of this.parts) {
      multiply(body, part.local, part.instance.model);
      if (!part.moving) continue;
      const weapon = this.weapons.find((m) => m.piece === this.build.pieces[this.parts.indexOf(part)]);
      const kick = weapon?.kick ?? 0;
      const spin = weapon?.spin ?? 0;
      let motion: Mat4;
      switch (part.moving.kind) {
        case 'knocker':
          // Swings forward and down about the pole's top; built hanging out along +z, so a swing is a turn about x.
          motion = rotationX(-0.35 + Math.sin(kick * Math.PI) * 1.9, this.tmp);
          break;
        case 'gatling':
          motion = multiply(translation(0, 0, -kick * 0.03, this.tmp2), rotZ(spin), this.tmp);
          break;
        default:
          motion = translation(0, 0, -kick * 0.09, this.tmp);
      }
      multiply(multiply(body, part.moving.pivot, this.tmp2), motion, part.moving.instance.model);
      w++;
    }
    void w;
  }

  dispose(): void {
    const gone = new Set(this.instances);
    const list = this.renderer.instances;
    let k = 0;
    for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[k++] = list[i];
    list.length = k;
    for (const i of this.instances) i.mesh.dispose();
  }
}

function rotZ(a: number): Mat4 {
  const m = new Float32Array(16);
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c; m[10] = 1; m[15] = 1;
  return m;
}
