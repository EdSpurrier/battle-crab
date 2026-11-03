// Copies the game's sounds (sfx.json: picked from the Sound FX Library) out of the shared Game Assets
// folder into public/sfx, and writes public/sfx/manifest.json (event -> files and volume) for the game.
// The audio is asset-store material, so like the Sound FX Library it stays out of git: this runs before
// dev and build. Without the Game Assets folder it warns and the game simply plays no sound.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..');
const out = path.join(repo, 'public', 'sfx');
const picks = JSON.parse(fs.readFileSync(path.join(repo, 'sfx.json'), 'utf8'));

function gameAssets() {
  if (process.env.GAME_ASSETS) return process.env.GAME_ASSETS;
  const cfg = path.join(os.homedir(), '.game-assets.json');
  return fs.existsSync(cfg) ? JSON.parse(fs.readFileSync(cfg, 'utf8')).path : null;
}

const root = gameAssets();
if (!root || !fs.existsSync(path.join(root, 'sounds'))) {
  console.warn('sfx: no Game Assets folder on this computer (~/.game-assets.json or GAME_ASSETS): the game will be silent.');
  process.exit(0);
}

fs.mkdirSync(out, { recursive: true });
const manifest = {};
let copied = 0;
let missing = 0;
for (const [key, entry] of Object.entries(picks)) {
  const files = [];
  entry.files.forEach((f, i) => {
    const from = path.join(root, 'sounds', f.rel);
    const name = `${key}-${i + 1}${path.extname(f.rel).toLowerCase()}`;
    const to = path.join(out, name);
    if (!fs.existsSync(from)) {
      console.warn(`sfx: missing ${f.rel}`);
      missing++;
      return;
    }
    const s = fs.statSync(from);
    if (!fs.existsSync(to) || fs.statSync(to).size !== s.size) {
      fs.copyFileSync(from, to);
      copied++;
    }
    files.push(name);
  });
  manifest[key] = { volume: entry.volume, files };
}
fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifest, null, 1) + '\n');
console.log(`sfx: ${Object.keys(manifest).length} events ready (${copied} copied${missing ? `, ${missing} missing` : ''})`);
