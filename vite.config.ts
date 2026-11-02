import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Battle Crab draws with the Gridfall Engine installed as a package at a release tag (package.json).
 * `npm run dev:engine` (ENGINE_SOURCE=1) aliases the sibling checkout's source instead, so an engine
 * feature being built next door shows here straight away before it is released.
 * Three pages: the game (index.html), the map maker (editor.html) and the model viewer (models.html,
 * which lists every .glb in Models/ through import.meta.glob).
 */
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ENGINE_SOURCE = path.join(HERE, '../gridfall-engine/src/engine/index.ts');
const useSource = process.env.ENGINE_SOURCE === '1' && existsSync(ENGINE_SOURCE);

export default defineConfig({
  resolve: useSource ? { alias: { 'gridfall-engine': ENGINE_SOURCE } } : {},
  server: { port: 5182, open: false, fs: { allow: ['.', '../gridfall-engine'] } },
  assetsInclude: ['**/*.glb'],
  build: { rollupOptions: { input: { main: path.join(HERE, 'index.html'), editor: path.join(HERE, 'editor.html'), models: path.join(HERE, 'models.html'), shell: path.join(HERE, 'build.html') } } },
});
