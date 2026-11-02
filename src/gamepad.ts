/**
 * A gamepad (the standard mapping): the left stick moves, the right stick faces, the shoulder
 * buttons and the triggers each fire one action slot (LB 1, RB 2, LT 3, RT 4), pressing the left
 * stick in runs, A (the bottom face button) jumps. Polled each frame; the first connected pad is
 * the one that plays. Sticks have a dead zone and are rescaled past it so a nudge is a nudge.
 */
export interface PadState {
  /** Left stick, right and down positive, each -1..1 (0 inside the dead zone). */
  move: [number, number];
  /** Right stick, the same. */
  look: [number, number];
  /** The left stick pressed in. */
  run: boolean;
  /** A pressed since the last frame. */
  jump: boolean;
  /** LB, RB, LT, RT held: fire action slots 1 to 4. */
  fire: [boolean, boolean, boolean, boolean];
  /** Anything at all is being pressed or pushed this frame. */
  busy: boolean;
}

const DEAD = 0.22;
const FIRE_BUTTONS = [4, 5, 6, 7];
const RUN_BUTTON = 10;
const JUMP_BUTTON = 0;

function axis(v: number | undefined): number {
  const x = v ?? 0;
  const a = Math.abs(x);
  if (a < DEAD) return 0;
  return Math.sign(x) * Math.min(1, (a - DEAD) / (1 - DEAD));
}

export class GamepadInput {
  private jumpWas = false;
  connected = false;

  constructor() {
    window.addEventListener('gamepadconnected', () => this.poll());
  }

  /** The pad's state this frame, or null when none is connected. */
  poll(): PadState | null {
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    let pad: Gamepad | null = null;
    for (const p of pads) {
      if (p && p.connected) {
        pad = p;
        break;
      }
    }
    this.connected = !!pad;
    if (!pad) {
      this.jumpWas = false;
      return null;
    }
    const b = (i: number): boolean => {
      const btn = pad.buttons[i];
      return !!btn && (btn.pressed || btn.value > 0.5);
    };
    const move: [number, number] = [axis(pad.axes[0]), axis(pad.axes[1])];
    const look: [number, number] = [axis(pad.axes[2]), axis(pad.axes[3])];
    const jumpNow = b(JUMP_BUTTON);
    const jump = jumpNow && !this.jumpWas;
    this.jumpWas = jumpNow;
    const fire: [boolean, boolean, boolean, boolean] = [b(FIRE_BUTTONS[0]), b(FIRE_BUTTONS[1]), b(FIRE_BUTTONS[2]), b(FIRE_BUTTONS[3])];
    const run = b(RUN_BUTTON);
    const busy = !!(move[0] || move[1] || look[0] || look[1] || run || jumpNow || fire.some(Boolean));
    return { move, look, run, jump, fire, busy };
  }
}
