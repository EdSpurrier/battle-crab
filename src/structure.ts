import { Mesh, MeshBuilder, box, material, multiply, rotationX, rotationY, transformPoint, translation, type Instance, type Mat4, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { CELL, cellCentre, pieceType, shellType, type Piece, type ShellBuild, type ShellType } from './shell';

/**
 * What is built on the shell, drawn: one mesh per piece in its cell, in body space, posed each
 * frame by the crab's body matrix. Weapons are turrets: the whole piece traverses about its
 * cell's upright axis toward the aim point and its moving part (the barrel, the gatling cluster)
 * elevates about its pivot, so a shot leaves the muzzle straight along the barrel. The moving
 * part also kicks back, spins (a gatling) or swings (the knocker) with `kick` and `spin`.
 */

/** How far a turret traverses from the way it is mounted (radians), how it elevates, and how quickly it turns (per second). */
const TRAVERSE = (140 * Math.PI) / 180;
const ELEVATE: [number, number] = [(-20 * Math.PI) / 180, (60 * Math.PI) / 180];
const TURN_RATE = 9;
/** A cannonball's speed: the barrel's elevation is solved so the ball comes down on the aim point. */
export const CANNON_SPEED = 20;
const GRAVITY = 20;

const WOOD: Vec = [0.42, 0.27, 0.13];
const WOOD_DARK: Vec = [0.3, 0.19, 0.09];
const IRON: Vec = [0.16, 0.16, 0.18];
const IRON_LIGHT: Vec = [0.3, 0.3, 0.33];
const BRASS: Vec = [0.55, 0.4, 0.12];
const TANK: Vec = [0.5, 0.08, 0.05];
const H = CELL / 2;
/** Weapons are drawn this many times their cell (about the cell's floor, so they still stand on it). */
const WEAPON_SCALE = 3;

/** The mesh scaled by `s` about the point (0, y0, 0). */
function scaledMesh(data: MeshData, s: number, y0: number): MeshData {
  const v = new Float32Array(data.vertices);
  for (let i = 0; i < v.length; i += 11) {
    v[i] *= s;
    v[i + 1] = y0 + (v[i + 1] - y0) * s;
    v[i + 2] *= s;
  }
  return { vertices: v, indices: data.indices };
}

function scaledShape(shape: Shape, s: number): Shape {
  const y0 = -H;
  const pt = (p?: [number, number, number]): [number, number, number] | undefined => (p ? [p[0] * s, y0 + (p[1] - y0) * s, p[2] * s] : undefined);
  // The moving part is built about its pivot (which is scaled with the piece), so it scales about its own origin.
  return { fixed: scaledMesh(shape.fixed, s, y0), moving: shape.moving ? scaledMesh(shape.moving, s, 0) : undefined, pivot: pt(shape.pivot), muzzle: pt(shape.muzzle) };
}

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
        // The barrel, about its pivot at the front of the body: it slides straight back into it on the recoil.
        moving: merge([box(-0.02, -0.02, -0.02, 0.02, 0.02, 0.22, IRON), box(-0.03, -0.03, 0.16, 0.03, 0.03, 0.22, IRON_LIGHT)]),
        pivot: [0, 0.03, 0.1],
        muzzle: [0, 0.03, 0.32],
      };
    case 'flamethrower':
      return {
        fixed: merge([ellipsoid(0, -0.02, -0.06, 0.1, 0.11, 0.12, TANK, 12, 7), box(-0.09, -H, -0.1, 0.09, -H + 0.05, 0.08, WOOD_DARK)]),
        // The nozzle pipe elevates about the tank's front.
        moving: merge([box(-0.025, -0.025, -0.02, 0.025, 0.025, 0.26, IRON), box(-0.045, -0.045, 0.22, 0.045, 0.045, 0.28, IRON_LIGHT)]),
        pivot: [0, 0.015, 0.04],
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
  /** The turret's traverse from the way it is mounted and its barrel's elevation (radians), eased toward what is wanted. */
  aimYaw: number;
  aimPitch: number;
  wantYaw: number;
  wantPitch: number;
  /** Whether the cannon can reach the aim point at CANNON_SPEED (else it fires at its highest). */
  inRange: boolean;
  /** After `pose`: where a shot leaves and the way the barrel points, in the world. */
  muzzle: Vec3;
  direction: Vec3;
}

interface Part {
  instance: Instance;
  local: Mat4;
  /** A weapon's turret: the cell's centre and mounting turn (its local is remade each frame), the pivot in cell space, the muzzle from the pivot. */
  turret?: { weapon: Mounted; cell: Vec3; mountYaw: number; pivot: [number, number, number]; muzzleRel: [number, number, number] };
  moving?: { instance: Instance; kind: Piece['kind'] };
}

export class Structure {
  readonly shell: ShellType;
  readonly weapons: Mounted[] = [];
  private readonly parts: Part[] = [];
  private readonly instances: Instance[] = [];
  private readonly tmp: Mat4 = new Float32Array(16);
  private readonly tmp2: Mat4 = new Float32Array(16);
  private readonly tmp3: Mat4 = new Float32Array(16);
  private readonly barrel: Mat4 = new Float32Array(16);

  constructor(private readonly renderer: Renderer, readonly build: ShellBuild) {
    this.shell = shellType(build.shell);
    const gl = renderer.gl;
    const wood = material({ roughness: 0.9 });
    const metal = material({ roughness: 0.45, metallic: 0.6 });
    build.pieces.forEach((piece, index) => {
      const type = pieceType(piece.kind);
      const shape = type.weapon ? scaledShape(shapeOf(piece.kind), WEAPON_SCALE) : shapeOf(piece.kind);
      const c = cellCentre(this.shell, piece.x, piece.y, piece.z);
      const mountYaw = (piece.yaw * Math.PI) / 2;
      const local = multiply(translation(c[0], c[1], c[2]), rotationY(mountYaw));
      const mat = type.weapon ? metal : wood;
      const instance: Instance = { mesh: new Mesh(gl, shape.fixed), model: new Float32Array(16), material: mat };
      this.instances.push(instance);
      const part: Part = { instance, local };
      if (shape.moving) {
        const mi: Instance = { mesh: new Mesh(gl, shape.moving), model: new Float32Array(16), material: mat };
        this.instances.push(mi);
        part.moving = { instance: mi, kind: piece.kind };
      }
      if (type.weapon && shape.muzzle && shape.pivot && this.weapons.length < 4) {
        const weapon: Mounted = { piece, index, kick: 0, spin: 0, aimYaw: 0, aimPitch: 0, wantYaw: 0, wantPitch: 0, inRange: true, muzzle: [0, 0, 0], direction: [0, 0, 1] };
        this.weapons.push(weapon);
        const p = shape.pivot;
        const m = shape.muzzle;
        part.turret = { weapon, cell: c, mountYaw, pivot: p, muzzleRel: [m[0] - p[0], m[1] - p[1], m[2] - p[2]] };
      }
      this.parts.push(part);
    });
    renderer.instances.push(...this.instances);
  }

  /**
   * Turn the turrets toward `target` (a world point; null: back to the way they are mounted),
   * eased. The cannon's elevation is the lob that lands there at CANNON_SPEED (the low arc), or
   * its highest when the point is out of reach.
   */
  aim(body: Mat4, target: Vec3 | null, dt: number): void {
    const bodyYaw = Math.atan2(body[8], body[10]);
    const cy = Math.cos(-bodyYaw);
    const sy = Math.sin(-bodyYaw);
    for (const part of this.parts) {
      const t = part.turret;
      if (!t) continue;
      const w = t.weapon;
      if (target) {
        // The target in body space, then about the cell's upright axis.
        const dx0 = target[0] - body[12];
        const dz0 = target[2] - body[14];
        const lx = dx0 * cy + dz0 * sy;
        const lz = -dx0 * sy + dz0 * cy;
        const ly = target[1] - body[13];
        const dx = lx - t.cell[0];
        const dz = lz - t.cell[2];
        const yaw = Math.atan2(dx, dz) - t.mountYaw;
        w.wantYaw = Math.max(-TRAVERSE, Math.min(TRAVERSE, Math.atan2(Math.sin(yaw), Math.cos(yaw))));
        // Elevation from the pivot: its height on the cell, the horizontal reach to the point.
        const D = Math.max(0.3, Math.hypot(dx, dz) - t.pivot[2]);
        const dy = ly - (t.cell[1] + t.pivot[1]);
        let pitch = Math.atan2(dy, D);
        w.inRange = true;
        if (w.piece.kind === 'cannon') {
          const v2 = CANNON_SPEED * CANNON_SPEED;
          const disc = v2 * v2 - GRAVITY * (GRAVITY * D * D + 2 * dy * v2);
          if (disc >= 0) pitch = Math.atan((v2 - Math.sqrt(disc)) / (GRAVITY * D));
          else {
            pitch = Math.PI / 4;
            w.inRange = false;
          }
        }
        w.wantPitch = w.piece.kind === 'knocker' ? 0 : Math.max(ELEVATE[0], Math.min(ELEVATE[1], pitch));
      } else {
        w.wantYaw = 0;
        w.wantPitch = 0;
      }
      const k = 1 - Math.exp(-TURN_RATE * dt);
      w.aimYaw += (w.wantYaw - w.aimYaw) * k;
      w.aimPitch += (w.wantPitch - w.aimPitch) * k;
    }
  }

  /** Place every piece by the crab's body matrix: turrets turned and elevated, moving parts kicked, spun or swung. */
  pose(body: Mat4): void {
    for (const part of this.parts) {
      const t = part.turret;
      if (t) {
        // The turret's local placement this frame: the cell, turned by the mounting and the traverse.
        multiply(translation(t.cell[0], t.cell[1], t.cell[2], this.tmp), rotationY(t.mountYaw + t.weapon.aimYaw, this.tmp2), part.local);
      }
      multiply(body, part.local, part.instance.model);
      if (!t) continue;
      const w = t.weapon;
      // The barrel's frame: at the pivot, elevated (a turn about x; positive x-turn tips +z down, so the pitch is negated).
      multiply(multiply(part.instance.model, translation(t.pivot[0], t.pivot[1], t.pivot[2], this.tmp), this.tmp2), rotationX(-w.aimPitch, this.tmp3), this.barrel);
      const mz = transformPoint(this.barrel, t.muzzleRel);
      w.muzzle = [mz[0], mz[1], mz[2]];
      const dl = Math.hypot(this.barrel[8], this.barrel[9], this.barrel[10]) || 1;
      w.direction = [this.barrel[8] / dl, this.barrel[9] / dl, this.barrel[10] / dl];
      if (!part.moving) continue;
      let motion: Mat4;
      switch (part.moving.kind) {
        case 'knocker':
          // Swings forward and down about the pole's top; built hanging out along +z, so a swing is a turn about x.
          motion = rotationX(-0.35 + Math.sin(w.kick * Math.PI) * 1.9, this.tmp);
          break;
        case 'gatling':
          motion = multiply(translation(0, 0, -w.kick * 0.03 * WEAPON_SCALE, this.tmp2), rotZ(w.spin), this.tmp);
          break;
        default:
          motion = translation(0, 0, -w.kick * 0.09 * WEAPON_SCALE, this.tmp);
      }
      multiply(this.barrel, motion, part.moving.instance.model);
    }
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
