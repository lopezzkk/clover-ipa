// Teste do ajuste automático de efeitos, sem navegador: simula quadros lentos e rápidos.
import { createRequire } from 'module'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const code = esbuild.buildSync({ entryPoints: [path.join(ROOT, 'src/core/autofx.ts')], bundle: true, format: 'cjs', write: false }).outputFiles[0].text;
let cb = null; const g = globalThis;
g.requestAnimationFrame = f => { cb = f; return 1 }; g.document = { hidden: false }; g.run = true;
g.CFG = { auto141: false, fps140: 60 }; g.VB140 = { f: 1, n: 0, auto: 1 }; g.localStorage = { setItem() {} }; g.cfgRefresh113 = () => {};
const mod = { exports: {} }; new Function('module', 'exports', 'require', code)(mod, mod.exports, require);
const ev = []; const bus = { emit: (n, d) => ev.push(d) };
const fx = new mod.exports.AutoFx(bus); fx.start();
let t = 0; const frames = (n, dt) => { for (let i = 0; i < n; i++) { t += dt; cb(t) } };
let ok = true; const check = (c, m) => { console.log((c ? 'OK   ' : 'FALHA') + ' ' + m); if (!c) ok = false };
frames(600, 40); check(fx.factor === 1, 'desligado: não mexe em nada mesmo lento (fator ' + fx.factor + ')');
fx.set(true); frames(200, 40); check(fx.factor < 1 && VB140.auto === fx.factor, 'ligado e lento: reduz partículas (fator ' + fx.factor + ')');
frames(3000, 40); check(fx.factor === 0.4, 'nunca passa do mínimo 0,4 (fator ' + fx.factor + ')');
frames(2000, 16); check(fx.factor > 0.4, 'fluido de novo: devolve aos poucos (fator ' + fx.factor + ')');
frames(20000, 16); check(fx.factor === 1, 'fluido por bastante tempo: volta ao normal (fator ' + fx.factor + ')');
CFG.fps140 = 30; frames(3000, 33.4); check(fx.factor === 1, 'limite de 30 FPS escolhido: 30 FPS não conta como lento (fator ' + fx.factor + ')');
frames(600, 80); fx.set(false); check(fx.factor === 1 && VB140.auto === 1, 'ao desligar: volta ao normal na hora');
check(!('gfx' in CFG) && !('ultra' in CFG), 'nunca mexe no nível gráfico');
process.exit(ok ? 0 : 1);
