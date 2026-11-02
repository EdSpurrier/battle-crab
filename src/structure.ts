import { Mesh, MeshBuilder, box, material, multiply, rotationX, rotationY, scaling, transformPoint, translation, type Instance, type Mat4, type MeshData, type PointLight, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';
import { shatter, type Obstacle } from './impacts';
import type { Loot } from './loot';
import { CELL, MATERIALS, burns, canPlace, cellCentre, maxWeapons, pieceHp, pieceType, pieceWeight, shellType, supported, type Piece, type PieceKind, type ShellBuild, type ShellType } from './shell';

/**
 * What is built on the shell, drawn and kept: one mesh per piece in its cell, in body space,
 * posed each frame by the crab's body matrix. Every piece has hit points; shot to nothing it is
 * gone, and whatever it was holding up falls away (debris that tumbles to the sand). Wood burns.
 * Weapons are turrets: the whole piece traverses about its cell's upright axis toward the aim
 * point and its moving part elevates about its pivot, so a shot leaves the muzzle straight along
 * the barrel; the knocker's ball hangs on a chain from its pole and swings as a pendulum.
 */

/** How far a turret traverses from the way it is mounted (radians), how it elevates, and how quickly it turns (per second). */
const TRAVERSE = (140 * Math.PI) / 180;
const ELEVATE: [number, number] = [(-20 * Math.PI) / 180, (60 * Math.PI) / 180];
const TURN_RATE = 9;
/** A cannonball's speed: the barrel's elevation is solved so the ball comes down on the aim point. */
export const CANNON_SPEED = 20;
const GRAVITY = 20;
/** The knocker's chain (cell units, before the weapon scale) and the ball on its end. */
const CHAIN = 0.55;
const BALL = 0.13;
/** Fire: damage a second to a burning piece, how long a piece burns before it goes out on its own, how often it tries to spread. */
const BURN_DPS = 7;
const BURN_SECONDS = 9;
const SPREAD_EVERY = 0.6;

const WOOD: Vec = [0.42, 0.27, 0.13];
const WOOD_DARK: Vec = [0.3, 0.19, 0.09];
const IRON: Vec = [0.16, 0.16, 0.18];
const IRON_LIGHT: Vec = [0.3, 0.3, 0.33];
const BRASS: Vec = [0.55, 0.4, 0.12];
const TANK: Vec = [0.5, 0.08, 0.05];
const ROCKET: Vec = [0.7, 0.15, 0.1];
const H = CELL / 2;
/** Weapons are drawn this many times their cell (about the cell's floor, so they still stand on it). */
const WEAPON_SCALE = 3;

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

/** A piece's fixed mesh and, for a weapon, its moving part with the point it moves about (cell space: the cell's centre at the origin, the piece facing +z). */
interface Shape {
  fixed: MeshData;
  moving?: MeshData;
  /** Where the moving part pivots / sits (cell space). */
  pivot?: [number, number, number];
  /** Where a shot leaves (cell space). */
  muzzle?: [number, number, number];
}

function scaledShape(shape: Shape, s: number): Shape {
  const y0 = -H;
  const pt = (p?: [number, number, number]): [number, number, number] | undefined => (p ? [p[0] * s, y0 + (p[1] - y0) * s, p[2] * s] : undefined);
  // The moving part is built about its pivot (which is scaled with the piece), so it scales about its own origin.
  return { fixed: scaledMesh(shape.fixed, s, y0), moving: shape.moving ? scaledMesh(shape.moving, s, 0) : undefined, pivot: pt(shape.pivot), muzzle: pt(shape.muzzle) };
}

function shapeOf(piece: Piece): Shape {
  const m = MATERIALS[piece.material ?? 'wood'];
  switch (piece.kind) {
    case 'plank':
      return { fixed: merge([box(-H, -H, -H, H, H, H, m.color), box(-H * 0.98, H - 0.012, -H * 0.98, H * 0.98, H + 0.004, H * 0.98, m.dark)]) };
    case 'beam':
      // A bar the length of the cell along its facing, a little below the middle so a plank on it sits flush, with a cap at each end.
      return { fixed: merge([box(-0.07, -H, -H, 0.07, -H + 0.16, H, m.color), box(-0.09, -H, -H, 0.09, -H + 0.17, -H + 0.04, m.dark), box(-0.09, -H, H - 0.04, 0.09, -H + 0.17, H, m.dark)]) };
    case 'joint':
      return { fixed: merge([box(-0.05, -H, -0.05, 0.05, H, 0.05, m.dark), box(-H, H - 0.03, -H, H, H, H, m.color), box(-H, -H, -H, H, -H + 0.03, H, m.color)]) };
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
        fixed: merge([box(-0.04, -H, -0.04, 0.04, -0.03, 0.04, IRON), ellipsoid(0, -0.03, 0, 0.07, 0.015, 0.07, IRON_LIGHT, 12, 4)]),
        moving: merge([box(-0.06, 0, -0.12, 0.06, 0.1, 0.1, IRON_LIGHT), box(-0.03, -0.09, -0.02, 0.03, 0, 0.06, BRASS), box(-0.02, 0.03, 0.1, 0.02, 0.07, 0.34, IRON), box(-0.03, 0.02, 0.28, 0.03, 0.08, 0.34, IRON_LIGHT)]),
        pivot: [0, -0.02, 0],
        muzzle: [0, 0.03, 0.34],
      };
    case 'flamethrower':
      return {
        fixed: merge([ellipsoid(0, -0.02, -0.06, 0.1, 0.11, 0.12, TANK, 12, 7), box(-0.09, -H, -0.1, 0.09, -H + 0.05, 0.08, WOOD_DARK)]),
        moving: merge([box(-0.025, -0.025, -0.02, 0.025, 0.025, 0.26, IRON), box(-0.045, -0.045, 0.22, 0.045, 0.045, 0.28, IRON_LIGHT)]),
        pivot: [0, 0.015, 0.04],
        muzzle: [0, 0.015, 0.33],
      };
    case 'knocker':
      // A pole with an arm out the top and a ring at the arm's end; the chain and ball that hang from it are the
      // Arsenal's (a rope of links it simulates), so there is no moving part here.
      return {
        fixed: merge([box(-0.03, -H, -0.03, 0.03, H + 0.3, 0.03, WOOD_DARK), box(-0.025, H + 0.25, 0, 0.025, H + 0.3, 0.2, WOOD_DARK), box(-0.07, -H, -0.07, 0.07, -H + 0.04, 0.07, IRON), box(-0.03, H + 0.22, 0.17, 0.03, H + 0.3, 0.23, IRON_LIGHT)]),
        pivot: [0, H + 0.27, 0.2],
        muzzle: [0, H + 0.27 - CHAIN - BALL * 0.6, 0.2],
      };
    case 'spikeball':
      // A stubby mortar with a drum of chain behind it; the ball flies out of the barrel and is reeled back.
      return {
        fixed: merge([box(-0.12, -H, -0.1, 0.12, -H + 0.08, 0.1, WOOD_DARK), ellipsoid(0, -H + 0.16, -0.12, 0.1, 0.1, 0.06, IRON_LIGHT, 10, 6)]),
        moving: merge([box(-0.075, -0.075, -0.1, 0.075, 0.075, 0.24, IRON), box(-0.09, -0.09, 0.18, 0.09, 0.09, 0.24, IRON_LIGHT)]),
        pivot: [0, -H + 0.16, 0],
        muzzle: [0, -H + 0.16, 0.28],
      };
    case 'fireworks':
      // A rack of tubes, tilted up.
      return {
        fixed: merge([box(-0.1, -H, -0.08, 0.1, -H + 0.06, 0.08, WOOD_DARK), box(-0.02, -H, -0.02, 0.02, -H + 0.12, 0.02, IRON)]),
        moving: merge([-0.06, -0.02, 0.02, 0.06].flatMap((x) => [0.03, -0.03].map((y) => box(x - 0.018, y - 0.018, -0.06, x + 0.018, y + 0.018, 0.2, ROCKET)))),
        pivot: [0, -H + 0.14, 0],
        muzzle: [0, -H + 0.14, 0.22],
      };
  }
}

export interface Mounted {
  piece: Piece;
  index: number;
  /** The weapon's moving part: kicked back (0..1, a recoil) and spun (radians, a gatling). */
  kick: number;
  spin: number;
  /** The turret's traverse from the way it is mounted and its barrel's elevation (radians), eased toward what is wanted. */
  aimYaw: number;
  aimPitch: number;
  wantYaw: number;
  wantPitch: number;
  /** Whether the cannon can reach the aim point at CANNON_SPEED (else it fires at its highest). */
  inRange: boolean;
  /** The knocker: where its chain hangs from, in the world (after `pose`); the Arsenal swings the chain and sets `muzzle` to the ball. */
  anchor: Vec3;
  /** After `pose`: where a shot leaves (the knocker: where the ball is) and the way the barrel points, in the world. */
  muzzle: Vec3;
  direction: Vec3;
  /** The chain's length in the world (the knocker). */
  chainLength: number;
  /** How much bigger than built the gun is drawn (Bullet Hell power-ups). */
  grow: number;
}

/** A piece of a structure as something a shot can hit. */
export interface PartRef {
  structure: Structure;
  index: number;
}
export const isPartRef = (o: unknown): o is PartRef => !!o && typeof o === 'object' && 'structure' in o && 'index' in o;

interface Part {
  instance: Instance;
  local: Mat4;
  /** A weapon's turret: the cell's centre and mounting turn (its local is remade each frame), the pivot in cell space, the muzzle from the pivot. */
  turret?: { weapon: Mounted; cell: Vec3; mountYaw: number; pivot: [number, number, number]; muzzleRel: [number, number, number] };
  moving?: { instance: Instance; kind: Piece['kind'] };
  hp: number;
  maxHp: number;
  /** Seconds of fire left (0: not burning), and the time to the next try at spreading. */
  burning: number;
  spreadIn: number;
  dead: boolean;
}

export class Structure {
  readonly shell: ShellType;
  readonly weapons: Mounted[] = [];
  /** Called when pieces come off (the weight and the weapons may have changed). */
  onChange: (() => void) | null = null;
  private readonly parts: Part[] = [];
  private readonly instances: Instance[] = [];
  private readonly tmp: Mat4 = new Float32Array(16);
  private readonly tmp2: Mat4 = new Float32Array(16);
  private readonly tmp3: Mat4 = new Float32Array(16);
  private readonly barrel: Mat4 = new Float32Array(16);
  private readonly bodyYawCache = { yaw: 0 };

  /** `loot` takes what comes off (weapons to pick up, rubble that lies a while); without it, pieces shot off simply vanish. */
  constructor(private readonly renderer: Renderer, readonly build: ShellBuild, private readonly groundHeight: (x: number, z: number) => number = () => 0, private readonly loot: Loot | null = null) {
    this.shell = shellType(build.shell);
    build.pieces.forEach((piece, index) => this.addPart(piece, index));
  }

  private readonly metal = material({ roughness: 0.45, metallic: 0.6 });

  /** Build piece `index` of the build: its drawing, and its turret when it is a weapon with a slot free. */
  private addPart(piece: Piece, index: number): void {
    const gl = this.renderer.gl;
    const metal = this.metal;
    const build = this.build;
    {
      const type = pieceType(piece.kind);
      const shape = type.weapon ? scaledShape(shapeOf(piece), WEAPON_SCALE) : shapeOf(piece);
      const c = cellCentre(this.shell, piece.x, piece.y, piece.z);
      const mountYaw = (piece.yaw * Math.PI) / 2;
      const local = multiply(translation(c[0], c[1], c[2]), rotationY(mountYaw));
      const m = MATERIALS[piece.material ?? 'wood'];
      const mat = type.weapon ? metal : material({ roughness: m.roughness, metallic: m.metallic });
      const instance: Instance = { mesh: new Mesh(gl, shape.fixed), model: new Float32Array(16), material: mat };
      this.instances.push(instance);
      this.renderer.instances.push(instance);
      const hp = pieceHp(piece);
      const part: Part = { instance, local, hp, maxHp: hp, burning: 0, spreadIn: 0, dead: false };
      if (shape.moving) {
        const mi: Instance = { mesh: new Mesh(gl, shape.moving), model: new Float32Array(16), material: mat };
        this.instances.push(mi);
        this.renderer.instances.push(mi);
        part.moving = { instance: mi, kind: piece.kind };
      }
      if (type.weapon && shape.muzzle && shape.pivot && this.weapons.length < maxWeapons(build.claws)) {
        const weapon: Mounted = { piece, index, kick: 0, spin: 0, aimYaw: 0, aimPitch: 0, wantYaw: 0, wantPitch: 0, inRange: true, anchor: [0, 0, 0], muzzle: [0, 0, 0], direction: [0, 0, 1], chainLength: (CHAIN + BALL * 0.6) * WEAPON_SCALE, grow: 1 };
        this.weapons.push(weapon);
        const p = shape.pivot;
        const mz = shape.muzzle;
        part.turret = { weapon, cell: c, mountYaw, pivot: p, muzzleRel: [mz[0] - p[0], mz[1] - p[1], mz[2] - p[2]] };
      }
      this.parts.push(part);
    }
  }

  /** A free cell a picked-up piece can go in: on the deck floor first, then on top of what is held. */
  freeCell(): [number, number, number] | null {
    const alive = this.alivePieces;
    const [cols, rows, layers] = this.shell.grid;
    for (let y = 0; y < layers; y++) for (let z = 0; z < rows; z++) for (let x = 0; x < cols; x++) if (canPlace(this.shell, alive, [x, y, z])) return [x, y, z];
    return null;
  }

  /** Pick a weapon up off the beach: on in a free cell, facing forward, when there is a slot and a cell for it. */
  pickUp(kind: PieceKind): boolean {
    if (this.weapons.length >= maxWeapons(this.build.claws)) return false;
    const cell = this.freeCell();
    if (!cell) return false;
    const piece: Piece = { x: cell[0], y: cell[1], z: cell[2], kind, yaw: 0 };
    this.build.pieces.push(piece);
    this.addPart(piece, this.build.pieces.length - 1);
    this.onChange?.();
    return true;
  }

  /** Everything still on comes off at once (a cracked crab): weapons to be picked up, the rest as rubble. */
  shedAll(): void {
    this.parts.forEach((p, i) => {
      if (!p.dead) this.drop(i, 2.5);
    });
    this.onChange?.();
  }

  /** The pieces still on. */
  get alivePieces(): Piece[] {
    return this.build.pieces.filter((_, i) => !this.parts[i].dead);
  }

  /** What is still on weighs this much (the claws apart). */
  weight(): number {
    return this.build.pieces.reduce((w, p, i) => (this.parts[i].dead ? w : w + pieceWeight(p)), 0);
  }

  /** Hit points left of piece `i` as a share. */
  health(i: number): number {
    const p = this.parts[i];
    return p && !p.dead ? p.hp / p.maxHp : 0;
  }

  /** The pieces' boxes for shots this frame (body space turned to the world), each owned by its PartRef, all `self`'s. */
  boxes(body: Mat4, self: unknown): Obstacle[] {
    const yaw = Math.atan2(body[8], body[10]);
    const out: Obstacle[] = [];
    this.parts.forEach((part, index) => {
      if (part.dead) return;
      const piece = this.build.pieces[index];
      const c = cellCentre(this.shell, piece.x, piece.y, piece.z);
      const w = transformPoint(body, c);
      const weapon = pieceType(piece.kind).weapon;
      const r = weapon ? H * 1.6 : H;
      out.push({ center: [w[0], w[1] + (weapon ? H * 0.6 : 0), w[2]], half: [r, weapon ? H * 2.2 : H, r], yaw, surface: piece.kind === 'plank' || piece.kind === 'beam' || piece.kind === 'joint' ? (piece.material === 'wood' || !piece.material ? 'wood' : 'rock') : 'rock', owner: { structure: this, index } as PartRef, self });
    });
    return out;
  }

  /** Nothing comes off this shell (the player's in Bullet Hell: the run must not lose its only gun). */
  invulnerable = false;

  /** Take `amount` off piece `i`; at nothing it is gone, and whatever it held up falls. */
  damage(i: number, amount: number): void {
    const part = this.parts[i];
    if (!part || part.dead || this.invulnerable) return;
    part.hp -= amount;
    if (part.hp > 0) return;
    this.drop(i);
    // Whatever is no longer joined to the deck comes down too.
    const held = supported(this.shell, this.build.pieces.map((p, k) => (this.parts[k].dead ? null : p)).filter((p): p is Piece => !!p));
    // `held` indexes the live list: map back.
    const live: number[] = [];
    this.parts.forEach((p, k) => {
      if (!p.dead) live.push(k);
    });
    live.forEach((k, liveIndex) => {
      if (!held.has(liveIndex)) this.drop(k);
    });
    this.onChange?.();
  }

  /** Set piece `i` alight, if it burns. */
  ignite(i: number): void {
    const part = this.parts[i];
    if (!part || part.dead || !burns(this.build.pieces[i])) return;
    if (part.burning <= 0) part.spreadIn = SPREAD_EVERY;
    part.burning = BURN_SECONDS;
  }

  /** The light the burning pieces give off. */
  lights(): PointLight[] {
    const out: PointLight[] = [];
    for (const part of this.parts) {
      if (part.dead || part.burning <= 0) continue;
      const m = part.instance.model;
      out.push({ x: m[12], y: m[13] + H * 2, z: m[14], radius: 5.5, r: 1, g: 0.5, b: 0.12, intensity: 16 + Math.random() * 8 });
    }
    return out;
  }

  /** Fire and falling pieces, a frame on. */
  update(dt: number): void {
    const positions = new Map<string, number>();
    this.build.pieces.forEach((p, i) => {
      if (!this.parts[i].dead) positions.set(`${p.x},${p.y},${p.z}`, i);
    });
    this.parts.forEach((part, i) => {
      if (part.dead || part.burning <= 0) return;
      part.burning -= dt;
      const m = part.instance.model;
      const at: Vec3 = [m[12], m[13], m[14]];
      this.renderer.particles.emit(at[0], at[1] + H, at[2], { count: Math.max(1, Math.round(70 * dt)), color: [1, 0.75, 0.25], colorTo: [0.6, 0.1, 0.02], speed: 0.5, up: 1.6, cone: 1, life: 0.6, size: 0.16, gravity: -2, drag: 1.2, fadeCurve: 'ease-out', sizeCurve: 'up', shape: 'smoke' });
      if (Math.random() < dt * 8) this.renderer.particles.emit(at[0], at[1] + H + 0.3, at[2], { count: 1, color: [0.25, 0.22, 0.2], colorTo: [0.1, 0.1, 0.1], speed: 0.4, up: 1, life: 2, size: 0.3, drag: 0.8, alpha: 0.45, fadeCurve: 'down', sizeCurve: 'up', shape: 'smoke' });
      part.spreadIn -= dt;
      if (part.spreadIn <= 0) {
        part.spreadIn = SPREAD_EVERY;
        const p = this.build.pieces[i];
        for (const [dx, dy, dz] of [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]) {
          const j = positions.get(`${p.x + dx},${p.y + dy},${p.z + dz}`);
          if (j !== undefined && Math.random() < 0.3) this.ignite(j);
        }
      }
      this.damage(i, BURN_DPS * dt);
    });
  }

  /** Piece `i` comes off: its drawing goes to the loot (a weapon to pick up, or rubble), its weapon slot goes. `fling`: how hard it is thrown. */
  private drop(i: number, fling = 1): void {
    const part = this.parts[i];
    if (part.dead) return;
    part.dead = true;
    part.burning = 0;
    const m = part.instance.model;
    const pos: Vec3 = [m[12], m[13], m[14]];
    const instances = [part.instance, ...(part.moving ? [part.moving.instance] : [])];
    const weapon = pieceType(this.build.pieces[i].kind).weapon;
    if (this.loot) {
      for (const inst of instances) {
        const own = this.instances.indexOf(inst);
        if (own >= 0) this.instances.splice(own, 1);
      }
      this.loot.add(weapon ? this.build.pieces[i].kind : null, part.instance, part.moving && part.turret ? { instance: part.moving.instance, pivot: part.turret.pivot } : undefined, pos, [(Math.random() - 0.5) * 2 * fling, (1.5 + Math.random()) * fling, (Math.random() - 0.5) * 2 * fling]);
    } else this.remove(instances);
    // It bursts as it goes: a shower of what it was made of (weapons: iron).
    const piece = this.build.pieces[i];
    shatter(this.renderer, [pos[0], pos[1] + 0.15, pos[2]], pieceType(piece.kind).weapon ? 'metal' : piece.material ?? 'wood', 3);
    const w = this.weapons.findIndex((x) => x.index === i);
    if (w >= 0) this.weapons.splice(w, 1);
  }

  private remove(instances: Instance[]): void {
    const gone = new Set(instances);
    const list = this.renderer.instances;
    let k = 0;
    for (let n = 0; n < list.length; n++) if (!gone.has(list[n])) list[k++] = list[n];
    list.length = k;
    for (const inst of instances) {
      const own = this.instances.indexOf(inst);
      if (own >= 0) this.instances.splice(own, 1);
      inst.mesh.dispose();
    }
  }

  /**
   * Turn the turrets toward `target` (a world point; null: back to the way they are mounted),
   * eased. The cannon's elevation is the lob that lands there at CANNON_SPEED (the low arc), or
   * its highest when the point is out of reach.
   */
  aim(body: Mat4, target: Vec3 | null, dt: number): void {
    const bodyYaw = Math.atan2(body[8], body[10]);
    this.bodyYawCache.yaw = bodyYaw;
    const cy = Math.cos(-bodyYaw);
    const sy = Math.sin(-bodyYaw);
    for (const part of this.parts) {
      const t = part.turret;
      if (!t || part.dead) continue;
      const w = t.weapon;
      if (target) {
        const dx0 = target[0] - body[12];
        const dz0 = target[2] - body[14];
        const lx = dx0 * cy + dz0 * sy;
        const lz = -dx0 * sy + dz0 * cy;
        const ly = target[1] - body[13];
        const dx = lx - t.cell[0];
        const dz = lz - t.cell[2];
        // No traverse: a weapon points the way it was mounted (turn it on the build screen); only the barrel elevates.
        w.wantYaw = 0;
        void TRAVERSE;
        const D = Math.max(0.3, Math.hypot(dx, dz) - t.pivot[2]);
        const dy = ly - (t.cell[1] + t.pivot[1]);
        let pitch = Math.atan2(dy, D);
        w.inRange = true;
        if (w.piece.kind === 'cannon' || w.piece.kind === 'spikeball') {
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
      if (part.dead) continue;
      const t = part.turret;
      if (t) multiply(translation(t.cell[0], t.cell[1], t.cell[2], this.tmp), rotationY(t.mountYaw + t.weapon.aimYaw, this.tmp2), part.local);
      multiply(body, part.local, part.instance.model);
      if (!t) continue;
      const w = t.weapon;
      if (w.piece.kind === 'knocker') {
        // The chain hangs from the arm's end; its direction is the mount's forward (the way a drawn-back ball swings).
        const m = part.instance.model;
        const a = transformPoint(m, t.pivot);
        w.anchor = [a[0], a[1], a[2]];
        const dl = Math.hypot(m[8], m[9], m[10]) || 1;
        w.direction = [m[8] / dl, m[9] / dl, m[10] / dl];
        continue;
      }
      multiply(multiply(part.instance.model, translation(t.pivot[0], t.pivot[1], t.pivot[2], this.tmp), this.tmp2), rotationX(-w.aimPitch, this.tmp3), this.barrel);
      const mz = transformPoint(this.barrel, w.grow === 1 ? t.muzzleRel : [t.muzzleRel[0] * w.grow, t.muzzleRel[1] * w.grow, t.muzzleRel[2] * w.grow]);
      w.muzzle = [mz[0], mz[1], mz[2]];
      const dl = Math.hypot(this.barrel[8], this.barrel[9], this.barrel[10]) || 1;
      w.direction = [this.barrel[8] / dl, this.barrel[9] / dl, this.barrel[10] / dl];
      if (!part.moving) continue;
      let motion: Mat4;
      switch (part.moving.kind) {
        case 'gatling':
          motion = multiply(translation(0, 0, -w.kick * 0.03 * WEAPON_SCALE, this.tmp2), rotZ(w.spin), this.tmp);
          break;
        default:
          motion = translation(0, 0, -w.kick * 0.09 * WEAPON_SCALE, this.tmp);
      }
      if (w.grow !== 1) motion = multiply(motion, scaling(w.grow, w.grow, w.grow));
      multiply(this.barrel, motion, part.moving.instance.model);
    }
  }

  dispose(): void {
    const gone = new Set(this.instances);
    const list = this.renderer.instances;
    let k = 0;
    for (let i = 0; i < list.length; i++) if (!gone.has(list[i])) list[k++] = list[i];
    list.length = k;
    for (const i of gone) i.mesh.dispose();
  }
}

function rotZ(a: number): Mat4 {
  const m = new Float32Array(16);
  const c = Math.cos(a);
  const s = Math.sin(a);
  m[0] = c; m[1] = s; m[4] = -s; m[5] = c; m[10] = 1; m[15] = 1;
  return m;
}

export { WEAPON_SCALE };
