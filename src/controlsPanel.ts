/**
 * The controls, on screen: a panel in the bottom-left corner listing each key (as a key cap) and what it
 * does, rebuilt whenever the scheme changes (topdown or 3rd person, simple or action-slot firing, Bullet
 * Hell, a gamepad plugged in). H folds it down to a one-line reminder and back; the choice is kept.
 */

export interface ControlsState {
  topDown: boolean;
  simple: boolean;
  hell: boolean;
  pad: boolean;
  /** 3rd person: whether the mouse is captured (else a click captures it). */
  locked: boolean;
  /** The claws can nip (not the tiny clampers). */
  claws: boolean;
}

type Row = [keys: string[], what: string];

function rows(s: ControlsState): Row[] {
  if (s.pad) {
    return [
      [['L stick'], 'move'],
      [['R stick'], s.topDown ? 'face / aim' : 'look'],
      [['L3'], 'run'],
      [['A'], 'jump (and lunge)'],
      ...(s.hell ? ([[['RT', 'RB'], 'machine gun'], [['LT', 'LB'], 'grenades']] as Row[]) : ([[['LB', 'RB', 'LT', 'RT'], 'fire slots 1-4']] as Row[])),
    ];
  }
  const out: Row[] = [];
  if (s.topDown) {
    out.push([['W', 'A', 'S', 'D'], 'move'], [['Mouse'], 'aim']);
  } else {
    out.push([['Mouse'], 'look'], [['W', 'A', 'S', 'D'], 'walk / sidestep']);
  }
  out.push([['Shift'], 'run'], [['Space'], 'jump (+ a direction: lunge)']);
  if (s.hell) out.push([['LMB'], 'machine gun'], [['RMB'], 'grenades (recharge)']);
  else if (s.simple) {
    out.push([['LMB'], 'fire every weapon']);
    if (s.claws) out.push([['RMB'], 'nip with the claws']);
    else out.push([['RMB'], 'aim down the barrel']);
  } else out.push([['1', '2', '3', '4'], 'pick an action'], [['LMB'], 'fire it'], [['RMB'], 'aim down the barrel']);
  if (s.topDown) out.push([['Q', 'E'], 'turn the view']);
  out.push([['Wheel'], 'zoom'], [['C'], s.topDown ? '3rd person view' : 'topdown view'], [['Tab'], 'settings']);
  if (!s.topDown) out.push(s.locked ? [['Esc'], 'release the mouse'] : [['Click'], 'capture the mouse']);
  return out;
}

const KEY = 'battlecrab.controlsPanel';

export class ControlsPanel {
  private readonly root: HTMLDivElement;
  private folded = false;
  private last = '';

  constructor(parent: HTMLElement) {
    this.root = document.createElement('div');
    this.root.id = 'controls';
    parent.appendChild(this.root);
    try {
      this.folded = localStorage.getItem(KEY) === 'folded';
    } catch {
      /* no storage: open */
    }
    window.addEventListener('keydown', (e) => {
      if (e.code !== 'KeyH' || e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
      this.folded = !this.folded;
      try {
        localStorage.setItem(KEY, this.folded ? 'folded' : 'open');
      } catch {
        /* not kept */
      }
      this.last = '';
    });
  }

  /** Show the controls for this state (rebuilt only when something changed). */
  update(s: ControlsState): void {
    const sig = JSON.stringify(s) + this.folded;
    if (sig === this.last) return;
    this.last = sig;
    this.root.classList.toggle('folded', this.folded);
    const title = document.createElement('div');
    title.className = 'title';
    title.innerHTML = `Controls <kbd>H</kbd> ${this.folded ? 'show' : 'hide'}`;
    if (this.folded) {
      this.root.replaceChildren(title);
      return;
    }
    const list = document.createElement('dl');
    for (const [keys, what] of rows(s)) {
      const dt = document.createElement('dt');
      for (const k of keys) {
        const kbd = document.createElement('kbd');
        kbd.textContent = k;
        if (k.length > 2) kbd.className = 'wide';
        dt.appendChild(kbd);
      }
      const dd = document.createElement('dd');
      dd.textContent = what;
      list.append(dt, dd);
    }
    this.root.replaceChildren(title, list);
  }
}
