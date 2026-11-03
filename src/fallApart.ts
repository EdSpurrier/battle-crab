import type { Instance, Renderer, Vec, Vec3 } from 'gridfall-engine';
import type { Crab } from './crab';
import { debrisFor } from './debris';
import { wreckFx } from './impacts';
import type { Loot } from './loot';
import type { Structure } from './structure';
import { sfx } from './sound';

/**
 * A crab cracks and comes apart, the moment it is killed: every piece on its shell (weapons, planks,
 * beams, joints) is flung off onto the sand (weapons for the taking), its claws break off at the
 * shoulder and tumble away as loose arms, forearms and jaws, and bits of its broken shell fly off in
 * the shell's own colours with a burst of shell and smoke. The body and its shell stay together: that
 * is the corpse that lies on the beach.
 */
export function fallApart(renderer: Renderer, crab: Crab, structure: Structure, loot: Loot | null): void {
  const b = crab.body;
  const s = Math.hypot(b[0], b[1], b[2]) || 1;
  const centre: Vec3 = [b[12], b[13] + 0.3 * s, b[14]];
  wreckFx(renderer, centre);
  sfx.play('break.shell', centre, 1.2);
  structure.shedAll();
  // The claws: loose pieces lying a while (less than rubble) at the crab's own size.
  crab.shedClaws((instance: Instance, at: Vec3, vel: Vec3, scale: number) => {
    if (loot) {
      renderer.instances.push(instance);
      loot.add(null, instance, undefined, at, vel, { scale, lift: 0.1 * scale, seconds: 12 });
    } else instance.mesh.dispose();
  });
  // Broken shell: chunks in its colours (and a darker underside), big and small, flung every way.
  const c = crab.shell.color;
  const l = crab.shell.light;
  const palette: Vec[] = [c, l, [c[0] * 0.6, c[1] * 0.6, c[2] * 0.6], [l[0] * 0.85, l[1] * 0.8, l[2] * 0.75]];
  const debris = debrisFor(renderer);
  debris.burst(centre, palette, Math.round(16 * s), 6.5, 0.15 * s);
  debris.burst([centre[0], centre[1] + 0.4 * s, centre[2]], palette, Math.round(8 * s), 4, 0.26 * s);
  debris.burst(centre, 'shell', Math.round(8 * s), 5, 0.1 * s);
}
