// Build da versão experimental Babylon.js → dist/ (index.html + jogo.js). Não publica nada.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const D = path.dirname(fileURLToPath(import.meta.url));
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const dev = process.argv.includes('--dev');
fs.mkdirSync(path.join(D, 'dist'), { recursive: true });
const r = esbuild.buildSync({ entryPoints: [path.join(D, 'src/main.ts')], bundle: true, format: 'iife', target: 'es2020', minify: !dev, sourcemap: dev ? 'inline' : false, outfile: path.join(D, 'dist/jogo.js'), metafile: true, logLevel: 'warning' });
fs.copyFileSync(path.join(D, 'index.html'), path.join(D, 'dist/index.html'));
const kb = fs.statSync(path.join(D, 'dist/jogo.js')).size / 1024;
console.log('dist/jogo.js', kb.toFixed(0), 'KB');
