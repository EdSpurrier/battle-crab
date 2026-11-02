import { Mesh, MeshBuilder, box, cross, dot, material, normalize, sub, type Instance, type Mat4, type MeshData, type Renderer, type Vec, type Vec3 } from 'gridfall-engine';

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

const STEP_TRIGGER = 0.26;
const STEP_SECONDS = 0.13;
const STEP_LIFT = 0.2;
const STEP_LEAD = 0.1;

const BODY: Vec = [0.5, 0.08, 0.03];
const LEG: Vec = [0.42, 0.07, 0.03];
const SHELL: Vec = [0.36, 0.24, 0.12];
const SHELL_LIGHT: Vec = [0.42, 0.29, 0.15];
const EYE: Vec = [0.02, 0.02, 0.02];

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

/** A low-poly ellipsoid centred at (cx, cy, cz), flat-shaded. */
function ellipsoid(cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, color: Vec, segs = 12, rings = 7): MeshData {
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

/** A limb segment: a square rod from y = 0 up to y = len, posed with `poseAlong`. */
function rod(len: number, width: number, color: Vec): MeshData {
  return box(-width / 2, 0, -width / 2, width / 2, len, width / 2, color);
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
  pincer: Instance;
}

export class Crab {
  private readonly legs: Leg[] = [];
  private readonly claws: Claw[] = [];
  /** Body, shell and eyes: built in body space, all placed by one matrix. */
  private readonly bodyModel: Mat4 = new Float32Array(16);
  private readonly ground: GroundHeight;
  private phase = 0;
  private readonly centre: Vec3 = [0, HEIGHT, 0];

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

    // The body (what shows in front of the shell), the shell and its two spiral whorls curling up and back.
    fixed(ellipsoid(0, 0, 0.1, 0.5, 0.2, 0.42, BODY));
    // The spire curls up, back and to the crab's right, the way a hermit crab carries its shell.
    fixed(ellipsoid(0, 0.3, -0.3, 0.62, 0.52, 0.75, SHELL, 14, 8), shellSkin);
    fixed(ellipsoid(-0.3, 0.62, -0.75, 0.4, 0.36, 0.42, SHELL_LIGHT, 12, 6), shellSkin);
    fixed(ellipsoid(-0.58, 0.9, -0.95, 0.22, 0.2, 0.24, SHELL, 10, 5), shellSkin);
    // Eye stalks and eyes.
    for (const s of [-1, 1]) {
      const base: Vec3 = [s * 0.14, 0.08, 0.42];
      const tip: Vec3 = [s * 0.2, 0.42, 0.55];
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
      fixed(ellipsoid(tip[0], tip[1], tip[2], 0.07, 0.07, 0.07, EYE, 8, 5));
    }

    // Three pairs of walking legs: front legs splay forward, back legs back; knees up and out.
    for (let i = 0; i < 3; i++) {
      for (const s of [-1, 1]) {
        const z = 0.3 - i * 0.3;
        const splay = (1 - i) * 0.25;
        const l1 = 0.55;
        const l2 = 0.75;
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

    // Two claws held out in front, elbows out.
    for (const s of [-1, 1]) {
      const l1 = 0.4;
      const l2 = 0.45;
      this.claws.push({
        shoulder: [s * 0.3, -0.05, 0.4],
        rest: [s * 0.5, -0.3, 1.05],
        pole: [s * 0.8, 0.5, 0.2],
        l1,
        l2,
        side: s,
        upper: part(rod(l1, 0.1, LEG)),
        lower: part(rod(l2, 0.085, LEG)),
        pincer: part(ellipsoid(0, 0.2, 0, 0.15, 0.24, 0.11, BODY, 10, 6)),
      });
    }

    // Start standing: every foot on its rest spot.
    this.centre = [at[0], at[1] + HEIGHT, at[2]];
    for (const leg of this.legs) {
      leg.foot = this.restSpot(leg, yaw, [0, 0, 0]);
    }
    this.pose(yaw, 0);
  }

  /** Where a leg's foot wants to be now: its rest spot, led a little by the body's velocity, on the ground. */
  private restSpot(leg: Leg, yaw: number, velocity: Vec3): Vec3 {
    const p = toWorld(leg.rest, this.centre, yaw);
    p[0] += velocity[0] * STEP_LEAD;
    p[2] += velocity[2] * STEP_LEAD;
    p[1] = this.ground(p[0], p[2]);
    return p;
  }

  /**
   * A frame: `at` is the crab's position on the sand, `yaw` which way it faces (the camera's),
   * `velocity` how it is moving in the world.
   */
  update(dt: number, at: Vec3, yaw: number, velocity: Vec3): void {
    const speed = Math.hypot(velocity[0], velocity[2]);
    this.phase += dt * (1.5 + speed * 3);
    this.centre[0] = at[0];
    this.centre[2] = at[2];
    this.centre[1] = at[1] + HEIGHT;

    // Which group of legs may step: only one group is ever off the ground.
    const stepping = [false, false];
    for (const leg of this.legs) if (leg.t >= 0) stepping[leg.group] = true;
    for (const group of [0, 1]) {
      if (stepping[1 - group] || stepping[group]) continue;
      let need = false;
      for (const leg of this.legs) {
        if (leg.group !== group) continue;
        const want = this.restSpot(leg, yaw, velocity);
        const hip = toWorld(leg.hip, this.centre, yaw);
        if (distance(leg.foot, want) > STEP_TRIGGER || distance(leg.foot, hip) > (leg.l1 + leg.l2) * 0.97) need = true;
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
    let bob = 0;
    for (const leg of this.legs) {
      if (leg.t < 0) continue;
      leg.t = Math.min(1, leg.t + dt / STEP_SECONDS);
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

  private pose(yaw: number, speed: number): void {
    poseBody(this.bodyModel, this.centre, yaw);
    const forward = toWorldDir([0, 0, 1], yaw);
    for (const leg of this.legs) {
      const hip = toWorld(leg.hip, this.centre, yaw);
      const { joint, end } = twoBone(hip, leg.foot, leg.l1, leg.l2, toWorldDir(leg.pole, yaw));
      poseAlong(leg.upper.model, hip, joint, forward);
      poseAlong(leg.lower.model, joint, end, forward);
    }
    for (const claw of this.claws) {
      const shoulder = toWorld(claw.shoulder, this.centre, yaw);
      const sway = Math.sin(this.phase * 2 + claw.side) * (0.02 + Math.min(0.06, speed * 0.02));
      const rest: Vec3 = [claw.rest[0], claw.rest[1] + sway, claw.rest[2] + sway * 0.5];
      const target = toWorld(rest, this.centre, yaw);
      const { joint, end } = twoBone(shoulder, target, claw.l1, claw.l2, toWorldDir(claw.pole, yaw));
      poseAlong(claw.upper.model, shoulder, joint, forward);
      poseAlong(claw.lower.model, joint, end, forward);
      // The pincer carries on along the forearm.
      const on = add(end, sub(end, joint));
      poseAlong(claw.pincer.model, end, on, [0, 1, 0]);
    }
  }
}
