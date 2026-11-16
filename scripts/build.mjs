// Build do Clover RP.
//   node scripts/build.mjs           → dist/ (site em vários arquivos, com cache por arquivo)
//   node scripts/build.mjs --single  → dist-single/clover-rpg.html (um arquivo só, igual ao formato antigo)
//   --nomin                          → sem compactar (para depurar)
// Usa o esbuild (o mesmo motor que o Vite usa por baixo) e não precisa de internet.
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let esbuild;
try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }

const args = new Set(process.argv.slice(2));
const SINGLE = args.has('--single'), MIN = !args.has('--nomin');
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const hash = b => crypto.createHash('sha256').update(b).digest('hex').slice(0, 10);

// ---------- 1 · jogo: junta os módulos na ordem do manifest ----------
const manifest = JSON.parse(rd('game/manifest.json'));
let game = manifest.map(f => rd(path.join('game', f))).join('');
const assets = JSON.parse(rd('assets/models/assets.json'));

// ---------- 2 · segurança: nada de e-mail de administrador ou código secreto no que vai para o jogador ----------
function guard(label, text) {
  const bad = [/[a-z0-9._%+-]+@gmail\.com/i, /TREVONEGRO/i].filter(r => r.test(text));
  if (bad.length) { console.error('BLOQUEADO: dado secreto encontrado em', label, bad.map(String)); process.exit(1); }
}

function minify(code) {
  if (!MIN) return code;
  return esbuild.transformSync(code, { minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: true, legalComments: 'none', target: 'es2019', charset: 'utf8' }).code;
}

// ---------- 3 · núcleo TypeScript ----------
const core = esbuild.buildSync({ entryPoints: [path.join(ROOT, 'src/core/index.ts')], bundle: true, format: 'iife', target: 'es2019', minify: MIN, write: false, charset: 'utf8' }).outputFiles[0].text;

const template = rd('index.template.html');
const css = s => s.replace(/(<style(?:\s[^>]*)?>)([\s\S]*?)(<\/style>)/g, (m, a, c, b) => { if (!MIN) return m; try { return a + esbuild.transformSync(c, { loader: 'css', minify: true }).code + b } catch { return m } });
const headScripts = s => s.replace(/(<script(?:\s[^>]*)?>)([\s\S]*?)(<\/script>)/g, (m, a, code, b) => { if (/src=/.test(a) || code.trim().length < 200 || !MIN) return m; try { return a + esbuild.transformSync(code, { minifyWhitespace: true, legalComments: 'none', target: 'es2019', charset: 'utf8' }).code.replace(/<\/script/gi, '<\\/script') + b } catch { return m } });

if (SINGLE) {
  // um arquivo só: modelos voltam para dentro do código (como antes) e o núcleo roda antes do jogo
  const b64 = Object.fromEntries(assets.map(a => [a.id, fs.readFileSync(path.join(ROOT, 'assets/models', a.file)).toString('base64')]));
  let g = game.replace(/__A\("([^"]+)"\)/g, (m, id) => { if (!(id in b64)) throw new Error('modelo sem arquivo: ' + id); return JSON.stringify(b64[id]) });
  const boot = core + ';(function(){var C=window.Clover;C.beforeGame();addEventListener("load",function(){C.afterGame(Math.round(performance.now()))})})();\n';
  let html = template.replace('/*__LOADER__*/', () => (minify(boot + g)).replace(/<\/script/gi, '<\\/script'));
  html = headScripts(css(html)); guard('clover-rpg.html', html);
  fs.mkdirSync(path.join(ROOT, 'dist-single'), { recursive: true });
  fs.writeFileSync(path.join(ROOT, 'dist-single/clover-rpg.html'), html);
  console.log('dist-single/clover-rpg.html', (Buffer.byteLength(html) / 1048576).toFixed(2), 'MB');
  process.exit(0);
}

// ---------- 4 · site em vários arquivos ----------
const OUT = path.join(ROOT, 'dist');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'js'), { recursive: true }); fs.mkdirSync(path.join(OUT, 'models'), { recursive: true });
const gameMin = minify(game); guard('game.js', gameMin); guard('core.js', core);
const gameFile = `js/game.${hash(gameMin)}.js`, coreFile = `js/core.${hash(core)}.js`;
fs.writeFileSync(path.join(OUT, gameFile), gameMin); fs.writeFileSync(path.join(OUT, coreFile), core);
const bootAssets = assets.map(a => {
  const buf = fs.readFileSync(path.join(ROOT, 'assets/models', a.file));
  const ext = path.extname(a.file); const f = `models/${a.id}.${hash(buf)}${ext}`;
  fs.writeFileSync(path.join(OUT, f), buf); return { id: a.id, url: f, bytes: buf.length };
});
const BOOT = { core: coreFile, game: gameFile, assets: bootAssets, gameBytes: Buffer.byteLength(gameMin) };
const loader = esbuild.buildSync({ entryPoints: [path.join(ROOT, 'src/boot/loader.ts')], bundle: true, format: 'iife', target: 'es2019', minify: MIN, write: false, define: { __BOOT__: JSON.stringify(BOOT) } }).outputFiles[0].text;
let html = template.replace('/*__LOADER__*/', () => loader.replace(/<\/script/gi, '<\\/script'));
html = headScripts(css(html)); guard('index.html', html);
fs.writeFileSync(path.join(OUT, 'index.html'), html);
// arquivos públicos (ícones, manifest, modo offline)
for (const f of fs.readdirSync(path.join(ROOT, 'public'))) fs.copyFileSync(path.join(ROOT, 'public', f), path.join(OUT, f));
// versão do cache do modo offline = soma dos arquivos (muda sozinha a cada build diferente)
const ver = hash(html + gameMin + core);
const sw = rd('public/sw.js').replace(/const V='[^']*'/, `const V='clover-${ver}'`);
fs.writeFileSync(path.join(OUT, 'sw.js'), sw);
const size = d => fs.readdirSync(d, { withFileTypes: true }).reduce((a, e) => a + (e.isDirectory() ? size(path.join(d, e.name)) : fs.statSync(path.join(d, e.name)).size), 0);
console.log('dist/ pronto:', (size(OUT) / 1048576).toFixed(2), 'MB · jogo', (Buffer.byteLength(gameMin) / 1048576).toFixed(2), 'MB · modelos', (bootAssets.reduce((a, x) => a + x.bytes, 0) / 1048576).toFixed(2), 'MB · cache', ver);
