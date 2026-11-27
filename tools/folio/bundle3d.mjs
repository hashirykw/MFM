// Bundles the 3D scripts into /assets/folio/3d/: each page script becomes a small entry file and
// three.js (tree-shaken to only what the models use) goes into one shared, content-hashed chunk
// the browser can cache for a year. Called by build.py; run `npm ci` here once first.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const out = path.join(root, 'assets/folio/3d');
fs.rmSync(out, { recursive: true, force: true });
const threePlugin = { name: 'three', setup(b) { b.onResolve({ filter: /three\.module\.min\.js$/ }, () => ({ path: path.join(here, 'node_modules/three/build/three.module.js') })); } };
const r = await build({
  entryPoints: ['scene3d', 'mosque3d', 'prayer3d', 'ornament3d'].map(n => path.join(here, 'src', n + '.js')),
  bundle: true, splitting: true, format: 'esm', minify: true, target: 'es2020', outdir: out,
  entryNames: '[name]', chunkNames: 'c-[hash]', legalComments: 'none', metafile: true, plugins: [threePlugin],
});
const sizes = Object.entries(r.metafile.outputs).map(([f, o]) => `${path.basename(f)} ${Math.round(o.bytes / 1024)} KB`);
console.log(sizes.join('\n'));
