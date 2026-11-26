// Monta a camada própria (src/compat/three-dados.ts) num arquivo só, que define window.THREE para o jogo.
// As partes de matemática do three.js são trocadas pela matemática própria (src/compat/matematica.ts).
import path from 'path'; import fs from 'fs'; import { createRequire } from 'module'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const D = path.dirname(fileURLToPath(import.meta.url));
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const MATH = ['Vector2', 'Vector3', 'Vector4', 'Quaternion', 'Euler', 'Matrix3', 'Matrix4', 'Color', 'Box3', 'Sphere', 'Plane', 'Ray'];
const plug = { name: 'matematica-propria', setup(b) { b.onResolve({ filter: /\.js$/ }, a => {
  const full = path.resolve(a.resolveDir, a.path); const m = /vendor[\\/]three-r128[\\/]math[\\/](\w+)\.js$/.exec(full); if (!m) return;
  if (MATH.includes(m[1])) return { path: path.join(D, 'src/compat/matematica.ts') };
  if (m[1] === 'MathUtils') return { path: path.join(D, 'src/compat/mathutils.ts') };
}); } };
export async function montarCompat(saida) {
  const r = await esbuild.build({ entryPoints: [path.join(D, 'src/compat/three-dados.ts')], bundle: true, format: 'iife', globalName: 'THREE', minify: true, target: 'es2018', write: false, metafile: true, plugins: [plug], logLevel: 'warning', legalComments: 'none' });
  const txt = '/* Camada própria do Clover RPG: partes de dados baseadas no three.js r128 (MIT, © 2010-2021 three.js authors) + matemática própria */\n' + r.outputFiles[0].text;
  if (saida) fs.writeFileSync(saida, txt); const entradas = Object.keys(r.metafile.inputs); return { txt, kb: (txt.length / 1024) | 0, arquivos: entradas.length, entradas };
}
if (process.argv[1] && process.argv[1].endsWith('montar-compat.mjs')) { const o = await montarCompat(process.argv[2]); console.log('camada própria:', o.kb, 'KB,', o.arquivos, 'arquivos'); }
