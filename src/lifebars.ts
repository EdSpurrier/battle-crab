import { multiply, transformPoint, type CameraLike, type Vec3 } from 'gridfall-engine';
import type { Combatant } from './combat';

/**
 * Life bars: one over each opponent's shell, following it on screen, and the player's own along
 * the bottom. HTML over the canvas, placed by projecting a world point through the camera.
 */
export class LifeBars {
  private readonly layer: HTMLDivElement;
  private readonly bars = new Map<Combatant, { root: HTMLDivElement; fill: HTMLDivElement }>();
  private readonly own: { root: HTMLDivElement; fill: HTMLDivElement; text: HTMLSpanElement };

  constructor(parent: HTMLElement) {
    this.layer = document.createElement('div');
    this.layer.className = 'lifebars';
    parent.appendChild(this.layer);
    const root = document.createElement('div');
    root.className = 'lifebar own';
    const fill = document.createElement('div');
    fill.className = 'fill';
    const text = document.createElement('span');
    root.append(fill, text);
    parent.appendChild(root);
    this.own = { root, fill, text };
    const stamina = document.createElement('div');
    stamina.className = 'stamina own';
    const sfill = document.createElement('div');
    sfill.className = 'fill';
    stamina.appendChild(sfill);
    parent.appendChild(stamina);
    this.stamina = { root: stamina, fill: sfill };
  }

  /** The player's sprint bar, under the life bar. */
  private readonly stamina: { root: HTMLDivElement; fill: HTMLDivElement };

  /** `stamina`: the player's sprint left, 0..1; `winded`: spent, and not back yet. */
  update(camera: CameraLike, canvas: HTMLCanvasElement, me: Combatant, others: Combatant[], stamina = 1, winded = false): void {
    this.stamina.fill.style.width = `${Math.max(0, Math.min(1, stamina)) * 100}%`;
    this.stamina.root.classList.toggle('winded', winded);
    this.stamina.root.classList.toggle('full', stamina >= 1);
    const r = canvas.getBoundingClientRect();
    const pv = multiply(camera.projection(r.width / r.height), camera.view());
    const seen = new Set<Combatant>();
    for (const c of others) {
      if (!c.alive) continue;
      seen.add(c);
      let bar = this.bars.get(c);
      if (!bar) {
        const root = document.createElement('div');
        root.className = 'lifebar';
        const fill = document.createElement('div');
        fill.className = 'fill';
        root.appendChild(fill);
        this.layer.appendChild(root);
        bar = { root, fill };
        this.bars.set(c, bar);
      }
      const b = c.crab.body;
      // Over the shell, however big the crab is (its scale is in the body matrix's columns).
      const at: Vec3 = [b[12], b[13] + 1.7 * (Math.hypot(b[0], b[1], b[2]) || 1), b[14]];
      const p = transformPoint(pv, at);
      if (p[3] <= 0) {
        bar.root.hidden = true;
        continue;
      }
      const x = (p[0] / p[3]) * 0.5 + 0.5;
      const y = 1 - ((p[1] / p[3]) * 0.5 + 0.5);
      bar.root.hidden = x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1;
      bar.root.style.left = `${r.left + x * r.width}px`;
      bar.root.style.top = `${r.top + y * r.height}px`;
      this.paint(bar.fill, c.health / c.maxHealth);
    }
    for (const [c, bar] of this.bars) {
      if (!seen.has(c)) {
        bar.root.remove();
        this.bars.delete(c);
      }
    }
    this.paint(this.own.fill, me.health / me.maxHealth);
    this.own.text.textContent = `${Math.ceil(me.health)} / ${me.maxHealth}`;
  }

  private paint(fill: HTMLDivElement, share: number): void {
    const s = Math.max(0, Math.min(1, share));
    fill.style.width = `${s * 100}%`;
    fill.style.background = s > 0.5 ? 'linear-gradient(90deg, #1fb8c8, #4ff2ff)' : s > 0.25 ? 'linear-gradient(90deg, #d9a21f, #ffd84f)' : 'linear-gradient(90deg, #c02070, #ff3fb4)';
  }
}
