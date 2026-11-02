/**
 * A small settings panel: sections of toggles, sliders and choices built from getters and
 * setters on the live objects (the renderer's settings, the camera). Every control has a key;
 * its value is kept in localStorage and put back on the next load, so a look survives a reload.
 * Tab opens and closes it (main.ts); while it is open the mouse is the panel's, not the aim's.
 */

const STORE = 'battle-crab.settings';

type Stored = Record<string, boolean | number | string>;

function load(): Stored {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

export class SettingsPanel {
  readonly root: HTMLDivElement;
  private readonly stored: Stored = load();
  private section_: HTMLElement | null = null;
  private open_ = false;
  /** Called with the new state when the panel opens or closes. */
  onToggle: ((open: boolean) => void) | null = null;

  constructor(parent: HTMLElement, title: string) {
    this.root = document.createElement('div');
    this.root.className = 'settings';
    this.root.hidden = true;
    const h = document.createElement('h2');
    h.textContent = title;
    this.root.appendChild(h);
    parent.appendChild(this.root);
  }

  get open(): boolean {
    return this.open_;
  }

  toggle(open = !this.open_): void {
    this.open_ = open;
    this.root.hidden = !open;
    this.onToggle?.(open);
  }

  section(title: string): this {
    const s = document.createElement('section');
    const h = document.createElement('h3');
    h.textContent = title;
    s.appendChild(h);
    this.root.appendChild(s);
    this.section_ = s;
    return this;
  }

  /** A checkbox. */
  toggle_(key: string, label: string, get: () => boolean, set: (v: boolean) => void): this {
    const row = this.row(label);
    const input = document.createElement('input');
    input.type = 'checkbox';
    const stored = this.stored[key];
    if (typeof stored === 'boolean') set(stored);
    input.checked = get();
    input.addEventListener('change', () => {
      set(input.checked);
      this.save(key, input.checked);
    });
    row.appendChild(input);
    return this;
  }

  /** A slider with its value shown beside it. */
  slider(key: string, label: string, min: number, max: number, step: number, get: () => number, set: (v: number) => void, format: (v: number) => string = (v) => String(Math.round(v * 100) / 100)): this {
    const row = this.row(label);
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    const out = document.createElement('span');
    out.className = 'value';
    const stored = this.stored[key];
    if (typeof stored === 'number') set(stored);
    input.value = String(get());
    out.textContent = format(get());
    input.addEventListener('input', () => {
      const v = Number(input.value);
      set(v);
      out.textContent = format(v);
      this.save(key, v);
    });
    row.appendChild(input);
    row.appendChild(out);
    return this;
  }

  /** One of a few named options. */
  choice(key: string, label: string, options: string[], get: () => string, set: (v: string) => void): this {
    const row = this.row(label);
    const select = document.createElement('select');
    for (const o of options) {
      const opt = document.createElement('option');
      opt.value = o;
      opt.textContent = o;
      select.appendChild(opt);
    }
    const stored = this.stored[key];
    if (typeof stored === 'string' && options.includes(stored)) set(stored);
    select.value = get();
    select.addEventListener('change', () => {
      set(select.value);
      this.save(key, select.value);
    });
    row.appendChild(select);
    return this;
  }

  private row(label: string): HTMLLabelElement {
    const row = document.createElement('label');
    const span = document.createElement('span');
    span.textContent = label;
    row.appendChild(span);
    (this.section_ ?? this.root).appendChild(row);
    return row;
  }

  private save(key: string, value: boolean | number | string): void {
    this.stored[key] = value;
    try {
      localStorage.setItem(STORE, JSON.stringify(this.stored));
    } catch {
      // Storage may be unavailable (private window); the setting still applies this session.
    }
  }
}
