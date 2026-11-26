// Monta o JOGO COMPLETO com a ponte do Babylon.js (versão experimental, não publicada).
// 1) compila a ponte (TypeScript → ponte.js); 2) usa o build de arquivo único do jogo; 3) põe a ponte antes do jogo.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url'; import { createRequire } from 'module'; import { execFileSync } from 'child_process'; import { montarCompat } from './montar-compat.mjs';
const require = createRequire(import.meta.url); const D = path.dirname(fileURLToPath(import.meta.url)); const ROOT = path.join(D, '..');
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const min = !process.argv.includes('--dev');
esbuild.buildSync({ entryPoints: [path.join(D, 'src/ponte/index.ts')], bundle: true, format: 'iife', target: 'es2020', minify: min, outfile: path.join(D, 'dist/ponte.js'), logLevel: 'warning' });
// o leitor de .glb do three.js (vendor/089, 96 KB) não entra: os modelos são lidos pela ponte (modelos.ts)
execFileSync(process.execPath, [path.join(ROOT, 'scripts/build.mjs'), '--single'], { stdio: 'inherit', env: { ...process.env, CLOVER_SEM: 'vendor/089-gl100.js' } });
let html = fs.readFileSync(path.join(ROOT, 'dist-single/clover-rpg.html'), 'utf8');
const ponte = fs.readFileSync(path.join(D, 'dist/ponte.js'), 'utf8').replace(/<\/script/gi, '<\\/script');
const i = html.lastIndexOf('<script>'); if (i < 0) throw new Error('script do jogo não encontrado');
html = html.slice(0, i) + '<script>' + ponte + '</script>\n' + html.slice(i);
// a biblioteca three.js (603 KB baixada de fora) sai: entra a camada própria (só dados + matemática própria)
const cdn = '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script><script>if(!window.THREE)document.write(\'<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"><\\/script>\')</script><script>if(!window.THREE)document.write(\'<script src="https://unpkg.com/three@0.128.0/build/three.min.js"><\\/script>\')</script>';
if (!html.includes(cdn)) throw new Error('script do three.js não encontrado no index');
const compat = (await montarCompat()).txt.replace(/<\/script/gi, '<\\/script');
html = html.replace(cdn, () => '<script>' + compat + '</script>');
if (/three\.min\.js/.test(html)) throw new Error('ainda tem three.min.js');
html = html.replace('<title>Clover RPG</title>', '<title>Clover RP · Experimental Babylon.js</title>');
if (/[a-z0-9._%+-]+@gmail\.com|TREVONEGRO/i.test(html)) { console.error('BLOQUEADO: dado secreto'); process.exit(1); }
const saida = (process.argv.find(a => a.startsWith('--saida=')) || '--saida=clover-rp-babylon.html').slice(8);
fs.writeFileSync(path.join(D, 'dist', saida), html);
console.log('dist/' + saida, '· sem three.js ·', (Buffer.byteLength(html) / 1048576).toFixed(2), 'MB · ponte', (fs.statSync(path.join(D, 'dist/ponte.js')).size / 1024).toFixed(0), 'KB');
