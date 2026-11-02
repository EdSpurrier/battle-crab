/**
 * A small settings panel: sections of toggles, sliders, choices and colours built from getters
 * and setters on the live objects (the renderer's settings, the camera). Every control has a key;
 * its value is kept in localStorage and put back on the next load, so a look survives a reload
 * (`persist: false` for a panel whose values live elsewhere, an editor's selection). Tab opens
 * and closes it (main.ts); while it is open the mouse is the panel's, not the aim's.
 *
 * Sliders are a filled bar with no handle; the number beside each is a field (type a value and
 * press Enter or click away), plain until it has focus.
 */

type Stored = Record<string, boolean | number | string>;

function load(store: string): Stored {
  try {
    const raw = localStorage.getItem(store);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

/** A CSS colour (#rrggbb) to the engine's linear rgb. */
export function hexToLinear(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  const c = (v: number) => Math.pow(v / 255, 2.2);
  return [c((n >> 16) & 255), c((n >> 8) & 255), c(n & 255)];
}

/** Linear rgb to a CSS colour (#rrggbb). */
export function linearToHex(rgb: [number, number, number]): string {
  const c = (v: number) => Math.round(Math.pow(Math.min(1, Math.max(0, v)), 1 / 2.2) * 255).toString(16).padStart(2, '0');
  return `#${c(rgb[0])}${c(rgb[1])}${c(rgb[2])}`;
}

export class SettingsPanel {
  readonly root: HTMLDivElement;
  private readonly stored: Stored;
  private readonly store: string | null;
  private section_: HTMLElement | null = null;
  private open_ = false;
  /** Per control: show the live value again (after a change made elsewhere, a key toggling a setting). */
  private readonly refreshers: (() => void)[] = [];
  /** Called with the new state when the panel opens or closes. */
  onToggle: ((open: boolean) => void) | null = null;

  constructor(parent: HTMLElement, title: string, options: { persist?: string | false; open?: boolean } = {}) {
    this.store = options.persist === false ? null : (options.persist ?? 'battle-crab.settings');
    this.stored = this.store ? load(this.store) : {};
    this.root = document.createElement('div');
    this.root.className = 'settings';
    this.open_ = options.open ?? false;
    this.root.hidden = !this.open_;
    if (title) {
      const h = document.createElement('h2');
      h.textContent = title;
      this.root.appendChild(h);
    }
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

  /** Everything added from here on goes to the panel's bottom again (after sections). */
  plain(): this {
    this.section_ = null;
    return this;
  }

  /** Empty the panel of everything but its title (a panel rebuilt for a new selection). */
  clear(): this {
    for (const el of Array.from(this.root.children)) if (el.tagName !== 'H2') el.remove();
    this.section_ = null;
    this.refreshers.length = 0;
    return this;
  }

  /** Every control shows its live value again (something changed a setting from outside the panel). */
  refresh(): void {
    for (const r of this.refreshers) r();
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
    this.refreshers.push(() => (input.checked = get()));
    row.appendChild(input);
    return this;
  }

  /** A slider (a filled bar) with an editable number beside it. `decimals` rounds what the field shows. */
  slider(key: string, label: string, min: number, max: number, step: number, get: () => number, set: (v: number) => void, decimals = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0, unit = ''): this {
    const row = this.row(label);
    const input = document.createElement('input');
    input.type = 'range';
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    const field = document.createElement('input');
    field.type = 'number';
    field.className = 'value';
    field.min = String(min);
    field.max = String(max);
    field.step = String(step);
    if (unit) field.title = unit;
    const stored = this.stored[key];
    if (typeof stored === 'number') set(stored);
    const show = (v: number) => {
      input.value = String(v);
      input.style.setProperty('--fill', `${((v - min) / (max - min)) * 100}%`);
      if (document.activeElement !== field) field.value = v.toFixed(decimals);
    };
    show(get());
    input.addEventListener('input', () => {
      const v = Number(input.value);
      set(v);
      show(v);
      this.save(key, v);
    });
    const commit = () => {
      const typed = Number(field.value);
      if (!Number.isFinite(typed)) return show(get());
      const v = Math.min(max, Math.max(min, typed));
      set(v);
      field.blur();
      show(v);
      this.save(key, v);
    };
    field.addEventListener('change', commit);
    field.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') commit();
      if (e.key === 'Escape') field.blur();
      e.stopPropagation();
    });
    field.addEventListener('blur', () => show(get()));
    this.refreshers.push(() => show(get()));
    row.appendChild(input);
    row.appendChild(field);
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
    this.refreshers.push(() => (select.value = get()));
    row.appendChild(select);
    return this;
  }

  /** A colour, given and taken as the engine's linear rgb. */
  color(key: string, label: string, get: () => [number, number, number], set: (v: [number, number, number]) => void): this {
    const row = this.row(label);
    const input = document.createElement('input');
    input.type = 'color';
    const stored = this.stored[key];
    if (typeof stored === 'string') set(hexToLinear(stored));
    input.value = linearToHex(get());
    input.addEventListener('input', () => {
      set(hexToLinear(input.value));
      this.save(key, input.value);
    });
    this.refreshers.push(() => (input.value = linearToHex(get())));
    row.appendChild(input);
    return this;
  }

  /** A button. */
  button(label: string, onClick: () => void, title = ''): this {
    const b = document.createElement('button');
    b.type = 'button';
    b.textContent = label;
    if (title) b.title = title;
    b.addEventListener('click', onClick);
    const holder = this.section_ ?? this.root;
    let bar = holder.lastElementChild;
    if (!bar || !bar.classList.contains('buttons')) {
      bar = document.createElement('div');
      bar.className = 'buttons';
      holder.appendChild(bar);
    }
    bar.appendChild(b);
    return this;
  }

  /** A line of text (a hint, a readout); returns the element so it can be updated. */
  note(text: string): HTMLParagraphElement {
    const p = document.createElement('p');
    p.className = 'note';
    p.textContent = text;
    (this.section_ ?? this.root).appendChild(p);
    return p;
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
    if (!this.store) return;
    this.stored[key] = value;
    try {
      localStorage.setItem(this.store, JSON.stringify(this.stored));
    } catch {
      // Storage may be unavailable (private window); the setting still applies this session.
    }
  }
}
