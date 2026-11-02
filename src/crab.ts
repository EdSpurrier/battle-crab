import { Mesh, MeshBuilder, VERTEX_FLOATS, box, cross, dot, material, normalize, sub, type Instance, type Mat4, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';

/**
 * The crab, built from code: a body poking out of a spiral shell, eye stalks, two claws and
 * three pairs of walking legs. The legs are animated procedurally: each foot has a rest spot
 * beside the body; when the body has moved or turned far enough from it the leg steps to where
 * the spot will be (an arc, a few frames long), legs stepping in two alternating groups so three
 * feet are always down. Each leg is posed by two-bone IK (hip, knee, foot) with the knee bent up
 * and out, crab-fashion. The shell is where the weapon platform will be built.
 *
 * Body space: the crab faces +z, +x is its left (right-handed, +y up: looking along +z, +x is on
 * the left), the origin is the body's centre, `HEIGHT` above the sand when standing.
 */

export const HEIGHT = 0.5;
/** Ground height under a point: feet land on it. */
export type GroundHeight = (x: number, z: number) => number;

/** How far a foot may be from its spot before the leg steps: longer strides, fewer steps. Grows with speed (a run strides further). */
const STEP_TRIGGER = 0.45;
const STEP_TRIGGER_RUN = 0.75;
/** A step's length in time at walking pace and at a run (in between, in proportion). */
const STEP_SECONDS = 0.22;
const STEP_SECONDS_RUN = 0.18;
const WALK_SPEED = 4.8;
const RUN_SPEED = 8.4;
const STEP_LIFT = 0.26;
/** How far ahead of the spot a foot lands, in seconds of the body's velocity, and the most it reaches ahead (world units) however fast. */
const STEP_LEAD = 0.17;
const STEP_LEAD_MAX = 0.75;
/**
 * A pincer's nip: a reach out (the jaw gaping wider as it goes), a fast chomp, a short hold shut,
 * then back. How long the whole takes, how far the claw reaches forward, the jaw's angles at rest and
 * at its widest (radians).
 */
const SNAP_SECONDS = 0.32;
const SNAP_REACH = 0.7;
const JAW_OPEN = 0.45;
const JAW_WIDE = 0.95;
/** Landing: falling with the ground this close below, the feet reach down for their spots; on touchdown the body dips this much over this long. */
const LAND_REACH = 1.3;
const LAND_SQUASH = 0.14;
const LAND_SECONDS = 0.22;
const MOUTH: Vec = [0.08, 0.02, 0.02];
/** A planted foot further from its hip than this share of the leg's reach slides along, rather than stretch back to where it was. */
const REACH_KEEP = 0.93;
/** A group may start stepping once the other group's step is this far along (a quicker cadence at speed than waiting for it to land). */
const OVERLAP_AT = 0.6;

const BODY: Vec = [0.5, 0.08, 0.03];
const LEG: Vec = [0.42, 0.07, 0.03];
const SHELL: Vec = [0.36, 0.24, 0.12];
const SHELL_LIGHT: Vec = [0.42, 0.29, 0.15];
const EYE_WHITE: Vec = [0.92, 0.92, 0.9];
const PUPIL: Vec = [0.015, 0.015, 0.015];
/** Googly eyes: the eyeball's radius, how far across it the pupil may slide (a share of the radius), its spring and damping, how hard a jolt moves it. */
const EYE_RADIUS = 0.131;
const PUPIL_RADIUS = 0.064;
const PUPIL_RANGE = 0.55;
const PUPIL_SPRING = 30;
const PUPIL_DAMPING = 5;
const PUPIL_JOLT = 0.06;
/** Idle glances: standing still, the eyes look somewhere new every so often (seconds between, how far over). */
const GLANCE_EVERY: [number, number] = [0.7, 2.6];
const GLANCE_RANGE = 0.42;
/** The eyelid: skin over the back of the eyeball, a little larger than it, reaching this far forward (a share of the radius). */
const LID_SCALE = 1.07;
const LID_REACH = 0.15;
/** Lashes along the lid's top rim: how many, their length and thickness; a blink: how far the lid sweeps forward (radians), how long, how often (seconds between). */
const LASHES = 5;
const LASH_LENGTH = 0.1;
const LASH_WIDTH = 0.016;
const LASH: Vec = [0.03, 0.02, 0.02];
const BLINK_SWEEP = 2.5;
const BLINK_SECONDS = 0.16;
const BLINK_EVERY: [number, number] = [2, 6];
/** In the air the feet tuck in under the body: this share of the way from hip to rest spot, this far below the body's centre. */
const TUCK = 0.7;
const TUCK_DROP = 0.3;
/**
 * On a slope the body rides HEIGHT above the highest ground under its feet's spots (never lower
 * than over its own cell), up to this much higher, eased; the claws are held at least this far
 * above the ground under and just ahead of them.
 */
const LIFT_MAX = 1;
const CLAW_CLEAR = 0.3;

// ---------- small vector helpers (the engine's math gives normalize / cross / dot / sub)

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const length = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const distance = (a: Vec3, b: Vec3): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const mix = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

/** A body-space point in the world: turned by the body's yaw about +y, then moved to the body's centre. */
function toWorld(p: Vec3, centre: Vec3, yaw: number): Vec3 {
  const s = Math.sin(yaw);
  const c = Math.cos(yaw);
  return [centre[0] + p[0] * c + p[2] * s, centre[1] + p[1], centre[2] - p[0] * s + p[2] * c];
}

/** A body-space direction in the world (turned, not moved). */
function toWorldDir(d: Vec3, yaw: number): Vec3 {
  return toWorld(d, [0, 0, 0], yaw);
}

// ---------- meshes

/** A low-poly ellipsoid centred at (cx, cy, cz), flat-shaded; `keep` leaves out the faces whose middle (offset from the centre) it refuses. */
function ellipsoid(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, color: Vec, segs = 12, rings = 7, keep?: (x: number, y: number, z: number) => boolean): MeshData {
  const b = new MeshBuilder();
  const at = (i: number, j: number): Vec => {
    const th = (i / segs) * Math.PI * 2;
    const ph = -Math.PI / 2 + (j / rings) * Math.PI;
    const cp = Math.cos(ph);
    return [cx + rx * cp * Math.cos(th), cy + ry * Math.sin(ph), cz + rz * cp * Math.sin(th)];
  };
  const wanted = (i: number, j: number): boolean => {
    if (!keep) return true;
    const th = ((i + 0.5) / segs) * Math.PI * 2;
    const ph = -Math.PI / 2 + ((j + 0.5) / rings) * Math.PI;
    const cp = Math.cos(ph);
    return keep(rx * cp * Math.cos(th), ry * Math.sin(ph), rz * cp * Math.sin(th));
  };
  for (let j = 0; j < rings; j++) {
    for (let i = 0; i < segs; i++) {
      if (!wanted(i, j)) continue;
      if (j === 0) b.tri(at(i, 0), at(i, 1), at(i + 1, 1), color);
      else if (j === rings - 1) b.tri(at(i, j), at(i, rings), at(i + 1, j), color);
      else b.quad(at(i, j), at(i, j + 1), at(i + 1, j + 1), at(i + 1, j), color);
    }
  }
  return b.build();
}

/** A limb segment: a square rod from y = 0 up to y = len, posed with `poseAlong`. */
function rod(len: number, width: number, color: Vec): MeshData {
  return box(-width / 2, 0, -width / 2, width / 2, len, width / 2, color);
}

/** The mesh moved by `m` (positions through it, normals through its rotation). */
function transformMesh(data: MeshData, m: Mat4): MeshData {
  const v = new Float32Array(data.vertices);
  for (let i = 0; i < v.length; i += VERTEX_FLOATS) {
    const x = v[i]; const y = v[i + 1]; const z = v[i + 2];
    v[i] = m[0] * x + m[4] * y + m[8] * z + m[12];
    v[i + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
    v[i + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];
    const nx = v[i + 3]; const ny = v[i + 4]; const nz = v[i + 5];
    v[i + 3] = m[0] * nx + m[4] * ny + m[8] * nz;
    v[i + 4] = m[1] * nx + m[5] * ny + m[9] * nz;
    v[i + 5] = m[2] * nx + m[6] * ny + m[10] * nz;
  }
  return { vertices: v, indices: new Uint32Array(data.indices) };
}

/** Several meshes as one. */
function mergeMeshes(parts: MeshData[]): MeshData {
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

// ---------- posing

/**
 * `out` becomes the matrix that stands a mesh built along +y from `from` toward `to` (its +y along
 * the segment), rolled so its +x is perpendicular to `ref`.
 */
function poseAlong(out: Mat4, from: Vec3, to: Vec3, ref: Vec3): void {
  const y = normalize(sub(to, from));
  let x = cross(ref, y);
  if (length(x) < 1e-4) x = cross([1, 0, 0], y);
  if (length(x) < 1e-4) x = cross([0, 0, 1], y);
  x = normalize(x);
  const z = cross(x, y);
  out[0] = x[0]; out[1] = x[1]; out[2] = x[2]; out[3] = 0;
  out[4] = y[0]; out[5] = y[1]; out[6] = y[2]; out[7] = 0;
  out[8] = z[0]; out[9] = z[1]; out[10] = z[2]; out[11] = 0;
  out[12] = from[0]; out[13] = from[1]; out[14] = from[2]; out[15] = 1;
}

/**
 * `out` places an eyelid: at the eye's world centre, turned by the body's yaw, and swept forward by
 * `blink` radians about the eye's side axis (0: the lid over the back of the ball; BLINK_SWEEP: over the front).
 */
function poseLid(out: Mat4, centre: Vec3, yaw: number, blink: number): void {
  const s = Math.sin(yaw);
  const c = Math.cos(yaw);
  const ca = Math.cos(blink);
  const sa = Math.sin(blink);
  out[0] = c; out[1] = 0; out[2] = -s; out[3] = 0;
  out[4] = sa * s; out[5] = ca; out[6] = sa * c; out[7] = 0;
  out[8] = ca * s; out[9] = -sa; out[10] = ca * c; out[11] = 0;
  out[12] = centre[0]; out[13] = centre[1]; out[14] = centre[2]; out[15] = 1;
}

/** `out` becomes a body-space placement (turned by yaw, moved to the centre) for a mesh built in body space. */
function poseBody(out: Mat4, centre: Vec3, yaw: number): void {
  const s = Math.sin(yaw);
  const c = Math.cos(yaw);
  out[0] = c; out[1] = 0; out[2] = -s; out[3] = 0;
  out[4] = 0; out[5] = 1; out[6] = 0; out[7] = 0;
  out[8] = s; out[9] = 0; out[10] = c; out[11] = 0;
  out[12] = centre[0]; out[13] = centre[1]; out[14] = centre[2]; out[15] = 1;
}

/**
 * Two-bone IK: where the middle joint goes so that bones of `l1` and `l2` reach from `root` to
 * `target` (or as near as they can), bending toward `pole`. Returns the joint and the end the
 * second bone actually reaches.
 */
function twoBone(root: Vec3, target: Vec3, l1: number, l2: number, pole: Vec3): { joint: Vec3; end: Vec3 } {
  const d0 = sub(target, root);
  let d = length(d0);
  const dir: Vec3 = d < 1e-5 ? [0, -1, 0] : scale(d0, 1 / d);
  d = Math.min(l1 + l2 - 1e-3, Math.max(Math.abs(l1 - l2) + 1e-3, d));
  const end = add(root, scale(dir, d));
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  let p = sub(pole, scale(dir, dot(pole, dir)));
  if (length(p) < 1e-4) p = cross(dir, [1, 0, 0]);
  if (length(p) < 1e-4) p = cross(dir, [0, 0, 1]);
  p = normalize(p);
  return { joint: add(root, add(scale(dir, a), scale(p, h))), end };
}

// ---------- the crab

interface Leg {
  /** Hip, foot rest spot and knee direction, in body space (the rest spot's y is ignored: feet sit on the ground). */
  hip: Vec3;
  rest: Vec3;
  pole: Vec3;
  l1: number;
  l2: number;
  /** Legs step in two alternating groups (a tripod gait: the other group stays down). */
  group: number;
  /** Where the foot is in the world; while stepping, from where to where and how far along (-1: planted). */
  foot: Vec3;
  from: Vec3;
  to: Vec3;
  t: number;
  upper: Instance;
  lower: Instance;
}

interface Claw {
  shoulder: Vec3;
  rest: Vec3;
  pole: Vec3;
  l1: number;
  l2: number;
  side: number;
  upper: Instance;
  lower: Instance;
  /** The pincer: a fat palm at the wrist, a fixed lower jaw along the forearm and an upper jaw hinged at the wrist. */
  palm: Instance;
  jawLower: Instance;
  jawUpper: Instance;
  /** A snap in progress, 0..1 (-1: none). */
  snap: number;
}

/**
 * Where a nip is at `t` (0..1): how far the claw has reached out (0..1, overshooting a little) and
 * how far open the jaw is (radians). A flung reach that overshoots and settles, a snap shut, a small
 * bounce of the jaw off the bite, and an easy return.
 */
function nip(t: number): { reach: number; open: number } {
  const smooth = (k: number) => k * k * (3 - 2 * k);
  const fling = (k: number) => 1 + 2.4 * Math.pow(k - 1, 3) + 1.4 * Math.pow(k - 1, 2); // ease out with overshoot
  if (t < 0.34) {
    const k = t / 0.34;
    return { reach: fling(k), open: JAW_OPEN + (JAW_WIDE - JAW_OPEN) * Math.min(1, 1.15 * Math.sqrt(k)) };
  }
  if (t < 0.42) {
    const k = (t - 0.34) / 0.08;
    return { reach: 1 + 0.08 * (1 - k), open: JAW_WIDE * (1 - k * k) };
  }
  if (t < 0.52) {
    const k = (t - 0.42) / 0.1;
    return { reach: 1, open: 0.18 * Math.sin(k * Math.PI) };
  }
  const e = smooth((t - 0.52) / 0.48);
  return { reach: 1 - e, open: JAW_OPEN * e };
}

/**
 * A googly eye: the eyeball's centre in body space, a pupil that slides about on it (offset and
 * speed across and up, as shares of the radius), and its lid with the lashes on it (one mesh, turned
 * about the eye's centre to blink).
 */
interface Eye {
  centre: Vec3;
  pupil: Instance;
  lid: Instance;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
}

export class Crab {
  private readonly legs: Leg[] = [];
  private readonly claws: Claw[] = [];
  private readonly eyes: Eye[] = [];
  /** Body, shell and eyeballs: built in body space, all placed by one matrix. */
  private readonly bodyModel: Mat4 = new Float32Array(16);
  private readonly ground: GroundHeight;
  private phase = 0;
  private readonly centre: Vec3 = [0, HEIGHT, 0];
  private lastVelocity: Vec3 = [0, 0, 0];
  /** How much higher than HEIGHT the body rides for the ground under its feet (a slope). */
  private lift = 0;
  /** Where the eyes are looking (both the same way): an offset the pupils settle to, picked afresh now and then when idle. */
  private gaze: [number, number] = [0, 0];
  private glanceIn = 1;
  /** A blink in progress, 0..1 (-1: none), and the time to the next. */
  private blink = -1;
  private blinkIn = 1.2;
  /** Whether it was in the air last frame, and a landing squash in progress (0..1, -1: none). */
  private wasAirborne = false;
  private landing = -1;

  constructor(renderer: Renderer, ground: GroundHeight, at: Vec3, yaw: number) {
    this.ground = ground;
    const gl = renderer.gl;
    const skin = material({ roughness: 0.55 });
    const shellSkin = material({ roughness: 0.85 });
    const part = (data: MeshData, mat = skin): Instance => {
      const instance: Instance = { mesh: new Mesh(gl, data), model: new Float32Array(16), material: mat };
      renderer.instances.push(instance);
      return instance;
    };
    const fixed = (data: MeshData, mat = skin): void => {
      renderer.instances.push({ mesh: new Mesh(gl, data), model: this.bodyModel, material: mat });
    };

    // The body (what shows in front of the shell), a tiny mouth at its front, the shell and its two spiral whorls curling up and back.
    fixed(ellipsoid(0, 0, 0.1, 0.5, 0.2, 0.42, BODY));
    fixed(ellipsoid(0, -0.05, 0.515, 0.055, 0.022, 0.025, MOUTH, 10, 5));
    // The spire curls up, back and to the crab's right, the way a hermit crab carries its shell.
    fixed(ellipsoid(0, 0.3, -0.3, 0.62, 0.52, 0.75, SHELL, 14, 8), shellSkin);
    fixed(ellipsoid(-0.3, 0.62, -0.75, 0.4, 0.36, 0.42, SHELL_LIGHT, 12, 6), shellSkin);
    fixed(ellipsoid(-0.58, 0.9, -0.95, 0.22, 0.2, 0.24, SHELL, 10, 5), shellSkin);
    // Eye stalks and big googly eyes: a white ball on each stalk, a pupil that slides about on it.
    for (const s of [-1, 1]) {
      const base: Vec3 = [s * 0.14, 0.08, 0.42];
      const tip: Vec3 = [s * 0.27, 0.5, 0.52];
      const b = new MeshBuilder();
      const d = normalize(sub(tip, base));
      const side = scale(normalize(cross(d, [0, 0, 1])), 0.025);
      const fwd = scale(normalize(cross(side, d)), 0.025);
      const corner = (p: Vec3, a: number, c: number): Vec => add(p, add(scale(side, a), scale(fwd, c)));
      const q = (a: Vec, bb: Vec, c: Vec, dd: Vec) => b.quad(a, bb, c, dd, BODY);
      q(corner(base, -1, -1), corner(base, 1, -1), corner(tip, 1, -1), corner(tip, -1, -1));
      q(corner(base, 1, 1), corner(base, -1, 1), corner(tip, -1, 1), corner(tip, 1, 1));
      q(corner(base, 1, -1), corner(base, 1, 1), corner(tip, 1, 1), corner(tip, 1, -1));
      q(corner(base, -1, 1), corner(base, -1, -1), corner(tip, -1, -1), corner(tip, -1, 1));
      fixed(b.build());
      const eyeCentre: Vec3 = [tip[0] + s * 0.03, tip[1] + EYE_RADIUS * 0.7, tip[2] + 0.02];
      fixed(ellipsoid(eyeCentre[0], eyeCentre[1], eyeCentre[2], EYE_RADIUS, EYE_RADIUS, EYE_RADIUS, EYE_WHITE, 14, 8));
      // The eyelid: skin over the back of the ball (and a rim round the front), a little larger than it,
      // built about the eye's centre so it can turn to blink; the lashes fan up from its top rim.
      const lid = EYE_RADIUS * LID_SCALE;
      const front = EYE_RADIUS * LID_REACH;
      const rim = Math.sqrt(Math.max(0, lid * lid - front * front));
      const lashes: MeshData[] = [];
      for (let k = 0; k < LASHES; k++) {
        const th = (-0.75 + (1.5 * k) / Math.max(1, LASHES - 1)) + s * 0.08;
        const base: Vec3 = [rim * Math.sin(th), rim * Math.cos(th), front];
        const dir = normalize(add(scale(normalize(base), 0.45), [0, 0.7, 0.55]));
        const m = new Float32Array(16);
        poseAlong(m, base, add(base, dir), [0, 0, 1]);
        lashes.push(transformMesh(rod(LASH_LENGTH, LASH_WIDTH, LASH), m));
      }
      const lidMesh = mergeMeshes([ellipsoid(0, 0, 0, lid, lid, lid, BODY, 14, 8, (_x, _y, z) => z < front), ...lashes]);
      // The pupil: a flat disc, posed on the eyeball's surface each frame (built along +y: poseAlong stands it on its direction).
      this.eyes.push({ centre: eyeCentre, pupil: part(ellipsoid(0, 0, 0, PUPIL_RADIUS, 0.03, PUPIL_RADIUS, PUPIL, 12, 4)), lid: part(lidMesh), ox: 0, oy: 0, vx: 0, vy: 0 });
    }

    // Three pairs of walking legs: front legs splay forward, back legs back; knees up and out.
    for (let i = 0; i < 3; i++) {
      for (const s of [-1, 1]) {
        const z = 0.3 - i * 0.3;
        const splay = (1 - i) * 0.25;
        const l1 = 0.6;
        const l2 = 0.85;
        this.legs.push({
          hip: [s * 0.4, 0, z],
          rest: [s * 1.05, 0, z + splay],
          pole: [s, 0.9, 0],
          l1,
          l2,
          group: (i + (s > 0 ? 1 : 0)) % 2,
          foot: [0, 0, 0],
          from: [0, 0, 0],
          to: [0, 0, 0],
          t: -1,
          upper: part(rod(l1, 0.09, LEG)),
          lower: part(rod(l2, 0.065, LEG)),
        });
      }
    }

    // Two big claws held up in front, close in, on arms bent double with the elbows out to the sides.
    for (const s of [-1, 1]) {
      const l1 = 0.5;
      const l2 = 0.55;
      this.claws.push({
        shoulder: [s * 0.32, -0.02, 0.42],
        rest: [s * 0.42, -0.2, 0.9],
        pole: [s * 1, 0.5, 0.15],
        l1,
        l2,
        side: s,
        upper: part(rod(l1, 0.11, LEG)),
        lower: part(rod(l2, 0.095, LEG)),
        // The pincer, built along +y from the wrist: a fat palm, then the jaws each side of the hinge (local z is up once posed).
        palm: part(ellipsoid(0, 0.04, 0, 0.19, 0.17, 0.15, LEG, 12, 6)),
        jawLower: part(ellipsoid(0, 0.3, -0.07, 0.2, 0.34, 0.09, BODY, 12, 6)),
        jawUpper: part(ellipsoid(0, 0.28, 0.07, 0.18, 0.31, 0.08, BODY, 12, 6)),
        snap: -1,
      });
    }

    // Start standing: every foot on its rest spot.
    this.centre = [at[0], at[1] + HEIGHT, at[2]];
    for (const leg of this.legs) {
      leg.foot = this.restSpot(leg, yaw, [0, 0, 0]);
    }
    this.pose(yaw, 0);
  }

  /** Where a leg's foot wants to be now: its rest spot, led a little by the body's velocity (never further than STEP_LEAD_MAX), on the ground. */
  private restSpot(leg: Leg, yaw: number, velocity: Vec3): Vec3 {
    const p = toWorld(leg.rest, this.centre, yaw);
    const speed = Math.hypot(velocity[0], velocity[2]);
    const lead = speed > 1e-4 ? Math.min(STEP_LEAD, STEP_LEAD_MAX / speed) : 0;
    p[0] += velocity[0] * lead;
    p[2] += velocity[2] * lead;
    p[1] = this.ground(p[0], p[2]);
    return p;
  }

  /** How far along from walking pace to running, 0..1. */
  private static pace(speed: number): number {
    return Math.min(1, Math.max(0, (speed - WALK_SPEED) / (RUN_SPEED - WALK_SPEED)));
  }

  /**
   * A frame: `at` is the crab's position (on the sand, or above it in a jump), `yaw` which way it
   * faces, `velocity` how it is moving in the world; `airborne` while it jumps (the feet tuck in).
   */
  update(dt: number, at: Vec3, yaw: number, velocity: Vec3, airborne = false): void {
    const speed = Math.hypot(velocity[0], velocity[2]);
    this.phase += dt * (1.5 + speed * 3);
    this.centre[0] = at[0];
    this.centre[2] = at[2];
    // On a slope the body stays HEIGHT above the highest ground under its feet's spots, so the uphill
    // legs do not fold into the hill; eased, so a step onto a rise is a rise and not a pop.
    const base = this.ground(at[0], at[2]);
    let top = base;
    for (const leg of this.legs) {
      const p = toWorld(leg.rest, [at[0], 0, at[2]], yaw);
      top = Math.max(top, this.ground(p[0], p[2]));
    }
    const wantLift = Math.min(LIFT_MAX, Math.max(0, top - base));
    this.lift += (wantLift - this.lift) * (1 - Math.exp(-8 * dt));
    this.centre[1] = at[1] + HEIGHT + this.lift;
    this.wobbleEyes(dt, yaw, velocity);
    for (const claw of this.claws) {
      if (claw.snap < 0) continue;
      claw.snap += dt / SNAP_SECONDS;
      if (claw.snap >= 1) claw.snap = -1;
    }

    if (airborne) {
      // Going up, the feet draw in under the body; coming down with the ground near, they reach for
      // their spots so they are planted before the body arrives. No stepping either way.
      const falling = velocity[1] < 0 && at[1] - this.ground(at[0], at[2]) < LAND_REACH;
      const k = 1 - Math.exp(-(falling ? 18 : 14) * dt);
      for (const leg of this.legs) {
        leg.t = -1;
        const want = falling ? this.restSpot(leg, yaw, velocity) : toWorld([leg.hip[0] + (leg.rest[0] - leg.hip[0]) * TUCK, -TUCK_DROP, leg.hip[2] + (leg.rest[2] - leg.hip[2]) * TUCK], this.centre, yaw);
        leg.foot = mix(leg.foot, want, k);
      }
      this.wasAirborne = true;
      this.pose(yaw, speed);
      return;
    }
    if (this.wasAirborne) {
      this.wasAirborne = false;
      this.landing = 0;
      for (const leg of this.legs) leg.foot[1] = this.ground(leg.foot[0], leg.foot[2]);
    }
    if (this.landing >= 0) {
      this.landing += dt / LAND_SECONDS;
      if (this.landing >= 1) this.landing = -1;
      else this.centre[1] -= LAND_SQUASH * Math.sin(this.landing * Math.PI);
    }

    // Which group of legs may step: one group at a time, the next allowed to start once the first
    // is most of the way down. From a walk to a run the steps get a little quicker and a good deal longer.
    const pace = Crab.pace(speed);
    const stepSeconds = STEP_SECONDS + (STEP_SECONDS_RUN - STEP_SECONDS) * pace;
    const trigger = STEP_TRIGGER + (STEP_TRIGGER_RUN - STEP_TRIGGER) * pace;
    const stepping = [false, false];
    const busy = [false, false];
    for (const leg of this.legs) {
      if (leg.t < 0) continue;
      stepping[leg.group] = true;
      if (leg.t < OVERLAP_AT) busy[leg.group] = true;
    }
    for (const group of [0, 1]) {
      if (busy[1 - group] || stepping[group]) continue;
      let need = false;
      for (const leg of this.legs) {
        if (leg.group !== group) continue;
        const want = this.restSpot(leg, yaw, velocity);
        const hip = toWorld(leg.hip, this.centre, yaw);
        if (distance(leg.foot, want) > trigger || distance(leg.foot, hip) > (leg.l1 + leg.l2) * 0.97) need = true;
      }
      if (!need) continue;
      for (const leg of this.legs) {
        if (leg.group !== group) continue;
        const want = this.restSpot(leg, yaw, velocity);
        if (distance(leg.foot, want) < 0.06) continue;
        leg.from = [leg.foot[0], leg.foot[1], leg.foot[2]];
        leg.to = want;
        leg.t = 0;
      }
      break;
    }

    // Move the stepping feet along their arcs (toward where the spot is now, so a fast crab's feet keep up).
    // A planted foot the body has outrun slides along within the leg's reach rather than stretch back
    // to where it was put down.
    let bob = 0;
    for (const leg of this.legs) {
      if (leg.t < 0) {
        const hip = toWorld(leg.hip, this.centre, yaw);
        const reach = (leg.l1 + leg.l2) * REACH_KEEP;
        const d = distance(leg.foot, hip);
        if (d > reach) {
          const k = reach / d;
          leg.foot = [hip[0] + (leg.foot[0] - hip[0]) * k, 0, hip[2] + (leg.foot[2] - hip[2]) * k];
          leg.foot[1] = this.ground(leg.foot[0], leg.foot[2]);
        }
        continue;
      }
      leg.t = Math.min(1, leg.t + dt / stepSeconds);
      leg.to = this.restSpot(leg, yaw, velocity);
      const t = leg.t;
      const ease = t * t * (3 - 2 * t);
      leg.foot = mix(leg.from, leg.to, ease);
      const lift = Math.sin(t * Math.PI) * STEP_LIFT;
      leg.foot[1] += lift;
      bob = Math.max(bob, Math.sin(t * Math.PI));
      if (t >= 1) {
        leg.foot = leg.to;
        leg.t = -1;
      }
    }
    this.centre[1] += bob * 0.03;
    this.pose(yaw, speed);
  }

  /** Snap a pincer: the crab's left (+1) or right (-1) claw thrusts forward and closes. Ignored mid-snap. */
  snap(side: 1 | -1): void {
    const claw = this.claws.find((c) => c.side === side);
    if (claw && claw.snap < 0) claw.snap = 0;
  }

  /**
   * Googly eyes: each pupil is a weight on a spring in the eyeball, jolted the other way whenever the
   * crab speeds up, slows, turns or jumps, and settling back to looking forward.
   */
  private wobbleEyes(dt: number, yaw: number, velocity: Vec3): void {
    if (dt <= 0) return;
    // The change in velocity since last frame, in the crab's own frame (x: its left, y: up, z: forward).
    const ax = (velocity[0] - this.lastVelocity[0]) / dt;
    const ay = (velocity[1] - this.lastVelocity[1]) / dt;
    const az = (velocity[2] - this.lastVelocity[2]) / dt;
    this.lastVelocity = [velocity[0], velocity[1], velocity[2]];
    const s = Math.sin(yaw);
    const c = Math.cos(yaw);
    const sideways = ax * c - az * s;
    const forwardA = ax * s + az * c;
    // A blink every so often (now and then two close together).
    if (this.blink >= 0) {
      this.blink += dt / BLINK_SECONDS;
      if (this.blink >= 1) this.blink = -1;
    } else {
      this.blinkIn -= dt;
      if (this.blinkIn <= 0) {
        this.blink = 0;
        this.blinkIn = Math.random() < 0.2 ? 0.3 : BLINK_EVERY[0] + Math.random() * (BLINK_EVERY[1] - BLINK_EVERY[0]);
      }
    }
    // Idle, the eyes glance about: somewhere new every so often, back to the front now and then; moving, they look ahead.
    const speed = Math.hypot(velocity[0], velocity[2]);
    if (speed < 0.3) {
      this.glanceIn -= dt;
      if (this.glanceIn <= 0) {
        this.glanceIn = GLANCE_EVERY[0] + Math.random() * (GLANCE_EVERY[1] - GLANCE_EVERY[0]);
        if (Math.random() < 0.3) this.gaze = [0, 0];
        else {
          const a = Math.random() * Math.PI * 2;
          const r = GLANCE_RANGE * (0.4 + Math.random() * 0.6);
          this.gaze = [Math.cos(a) * r, Math.sin(a) * r * 0.6];
        }
      }
    } else {
      this.gaze = [0, 0];
      this.glanceIn = 0.6;
    }
    for (const eye of this.eyes) {
      // Accelerating forward throws the pupil back and down a little; a sideways jolt, across; a jump, down then up.
      const fx = -sideways * PUPIL_JOLT - (eye.ox - this.gaze[0]) * PUPIL_SPRING - eye.vx * PUPIL_DAMPING;
      const fy = (-ay - forwardA * 0.5) * PUPIL_JOLT - (eye.oy - this.gaze[1]) * PUPIL_SPRING - eye.vy * PUPIL_DAMPING;
      eye.vx += fx * dt;
      eye.vy += fy * dt;
      eye.ox += eye.vx * dt;
      eye.oy += eye.vy * dt;
      const r = Math.hypot(eye.ox, eye.oy);
      if (r > PUPIL_RANGE) {
        eye.ox *= PUPIL_RANGE / r;
        eye.oy *= PUPIL_RANGE / r;
        // Hitting the rim: stop going further, keep the slide along it.
        const dot = eye.vx * eye.ox + eye.vy * eye.oy;
        if (dot > 0) {
          eye.vx -= (dot * eye.ox) / (PUPIL_RANGE * PUPIL_RANGE);
          eye.vy -= (dot * eye.oy) / (PUPIL_RANGE * PUPIL_RANGE);
        }
      }
    }
  }

  private pose(yaw: number, speed: number): void {
    poseBody(this.bodyModel, this.centre, yaw);
    const forward = toWorldDir([0, 0, 1], yaw);
    const sweep = this.blink >= 0 ? BLINK_SWEEP * Math.sin(this.blink * Math.PI) : 0;
    for (const eye of this.eyes) {
      // The pupil sits on the eyeball's surface, forward of centre, slid by its offset; the lid turns about the centre to blink.
      const dirLocal = normalize([eye.ox, eye.oy, 1]);
      const dir = toWorldDir(dirLocal, yaw);
      const on = toWorld(eye.centre, this.centre, yaw);
      const at = add(on, scale(dir, EYE_RADIUS - 0.012));
      poseAlong(eye.pupil.model, at, add(at, dir), [0, 1, 0]);
      poseLid(eye.lid.model, on, yaw, sweep);
    }
    for (const leg of this.legs) {
      const hip = toWorld(leg.hip, this.centre, yaw);
      const { joint, end } = twoBone(hip, leg.foot, leg.l1, leg.l2, toWorldDir(leg.pole, yaw));
      poseAlong(leg.upper.model, hip, joint, forward);
      poseAlong(leg.lower.model, joint, end, forward);
    }
    for (const claw of this.claws) {
      const shoulder = toWorld(claw.shoulder, this.centre, yaw);
      const sway = Math.sin(this.phase * 2 + claw.side) * (0.02 + Math.min(0.06, speed * 0.02));
      // A nip: the claw reaches out and a little up and in, jaw gaping, then chomps and comes back.
      const { reach, open } = claw.snap >= 0 ? nip(claw.snap) : { reach: 0, open: JAW_OPEN };
      const rest: Vec3 = [claw.rest[0] - claw.side * reach * 0.15, claw.rest[1] + sway + reach * 0.1, claw.rest[2] + sway * 0.5 + reach * SNAP_REACH];
      const target = toWorld(rest, this.centre, yaw);
      // Held clear of the ground: under the wrist and under the pincer's tip ahead of it (a mound in front).
      const floor = Math.max(this.ground(target[0], target[2]), this.ground(target[0] + forward[0] * 0.65, target[2] + forward[2] * 0.65)) + CLAW_CLEAR;
      if (target[1] < floor) target[1] = floor;
      const { joint, end } = twoBone(shoulder, target, claw.l1, claw.l2, toWorldDir(claw.pole, yaw));
      poseAlong(claw.upper.model, shoulder, joint, forward);
      poseAlong(claw.lower.model, joint, end, forward);
      // The pincer carries on along the forearm, the forearm twisted a quarter turn so the jaws open
      // sideways (the hinge upright: seen from above, the gape shows): the palm and inner jaw fixed,
      // the outer jaw hinged open at the wrist, swinging away from the body.
      const dir = normalize(sub(end, joint));
      let ref = cross(dir, [0, 1, 0]);
      ref = length(ref) < 1e-4 ? [1, 0, 0] : normalize(ref);
      // poseAlong's local z (the jaws' separation axis) is cross(x, dir) with x = cross(ref, dir): flip ref so z points outward.
      const outward = toWorldDir([claw.side, 0, 0], yaw);
      if (dot(cross(normalize(cross(ref, dir)), dir), outward) < 0) ref = scale(ref, -1);
      poseAlong(claw.palm.model, end, add(end, dir), ref);
      poseAlong(claw.jawLower.model, end, add(end, dir), ref);
      const x = normalize(cross(ref, dir));
      const z = cross(x, dir);
      const hinged = add(scale(dir, Math.cos(open)), scale(z, Math.sin(open)));
      poseAlong(claw.jawUpper.model, end, add(end, hinged), ref);
    }
  }
}
