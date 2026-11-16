// Testes das regras do servidor (não precisa do Colyseus).
import { createRequire } from 'module'; import path from 'path'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const D = path.dirname(fileURLToPath(import.meta.url));
const code = esbuild.buildSync({ entryPoints: [path.join(D, '../src/regras.ts')], bundle: true, format: 'cjs', write: false, platform: 'node' }).outputFiles[0].text;
const m = { exports: {} }; new Function('module', 'exports', 'require', code)(m, m.exports, require);
const { novoJogador, validarPatch, nomeSala, LIMITES } = m.exports;
let ok = true; const c = (v, t) => { console.log((v ? 'OK   ' : 'FALHA') + ' ' + t); if (!v) ok = false };
let j = novoJogador(); let t = 1000;
let r = validarPatch(j, { nm: '<b>Asta</b>"', lv: 99, p: [0, 0] }, t);
c(r.ok && r.patch.nm === 'bAsta/b' && r.patch.lv === 50, 'nome sem HTML e nível no máximo 50');
r = validarPatch(j, { p: [5, 0] }, t += 500); c(r.ok && r.patch.p[0] === 5, 'andar normal é aceito');
r = validarPatch(j, { p: [30, 0] }, t += 100); c(r.ok && Math.abs(r.patch.p[0] - 10.2) < 0.01 && r.avisos.includes('velocidade'), 'rápido demais é freado (' + r.patch.p[0] + ' m)');
r = validarPatch(j, { p: [300, 0] }, t += 4000); c(r.ok && r.patch.p[0] === 300, 'teleporte (viagem rápida) é aceito');
r = validarPatch(j, { p: [0, 200] }, t += 500); c(r.ok && r.patch.p[0] === 300 && r.avisos.includes('teleporte'), 'dois teleportes seguidos: o segundo é negado');
r = validarPatch(j, { p: [99999, -99999] }, t += 5000); c(r.ok && r.patch.p[0] === LIMITES.mundo.x1 && r.patch.p[1] === LIMITES.mundo.z0, 'fora do mapa vira a borda do mapa');
j = novoJogador(); validarPatch(j, { lv: 10 }, t += 2000);
r = validarPatch(j, { bh: [{ n: 1, id: 'b', d: 99999 }] }, t += 10); c(r.ok && r.patch.bh[0].d === 50 + 10 * 60 && r.avisos.includes('dano'), 'dano exagerado em chefe é cortado (' + r.patch.bh[0].d + ')');
let neg = 0; for (let i = 2; i < 20; i++) { r = validarPatch(j, { bh: [{ n: i, id: 'b', d: 10 }] }, t + i); if (!r.ok || r.avisos.includes('golpes')) neg++ }
c(neg > 0, 'golpes demais por segundo são recusados (' + neg + ')');
j = novoJogador(); let rec = 0; for (let i = 0; i < 40; i++) { r = validarPatch(j, { a: i }, 50000); if (!r.ok && r.motivo === 'frequencia') rec++ }
c(rec === 40 - LIMITES.atualizacoesPorSeg, 'mais de 20 atualizações por segundo são ignoradas');
r = validarPatch(novoJogador(), { big: 'x'.repeat(190), l: Array(64).fill('y'.repeat(190)) }, 1); c(!r.ok && r.motivo === 'tamanho', 'presença grande demais é recusada');
r = validarPatch(novoJogador(), { ['__proto__']: { admin: true }, ok: 1 }, 1); c(r.ok && !({}).admin, 'não aceita truque de __proto__');
c(nomeSala('clv-ab12cd') === 'clv-ab12cd' && nomeSala('main') === 'main' && nomeSala('../x') === null, 'nomes de sala válidos');
process.exit(ok ? 0 : 1);
