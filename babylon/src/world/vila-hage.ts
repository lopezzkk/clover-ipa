// Vila Hage refeita: praça com poço, casas em enxaimel ao redor, igreja com torre do sino, lampiões,
// plantações, cercas, floresta em volta e a Torre dos Grimórios ao longe. Mesmo lugar e mesma função do jogo atual.
import { AbstractMesh, Mesh, Scene } from '@babylonjs/core';
import { criarMateriais, prototipoCasa, prototipoIgreja, prototipoPoco, prototipoLampiao, prototipoBanco, prototipoBarril, prototipoCaixote, prototipoCerca, prototipoTorre, colocar, type Mats } from './construcoes';
import { prototipoArvore, prototipoPinheiro, prototipoArbusto, espalhar } from './vegetacao';
import { altura, distEstrada } from './terreno';
import type { Preset } from '../config';

export interface Colisor { x: number; z: number; r: number }
export interface Vila { mats: Mats; colisores: Colisor[]; luzes: AbstractMesh[]; sombra: AbstractMesh[] }

export function criarVilaHage(s: Scene, cfg: Preset): Vila {
  const M = criarMateriais(s); const col: Colisor[] = []; const sombra: AbstractMesh[] = []; const luzes: AbstractMesh[] = [];
  const reg = (protos: Mesh[]) => { for (const p of protos) sombra.push(p); return protos; };
  const CASAS = [
    reg(prototipoCasa(s, M, { w: 6, d: 5, andares: 2, telhado: 'telhaVermelha', persiana: 'persianaVerde', chamine: true })),
    reg(prototipoCasa(s, M, { w: 5, d: 4.5, andares: 1, telhado: 'telhaMarrom', persiana: 'persianaAzul', reboco: 'rebocoCreme', varanda: true })),
    reg(prototipoCasa(s, M, { w: 7, d: 5.5, andares: 2, telhado: 'telhaAzul', persiana: 'persianaVermelha', reboco: 'rebocoCreme' })),
    reg(prototipoCasa(s, M, { w: 4.6, d: 4.2, andares: 1, telhado: 'telhaArdosia', persiana: 'persianaVerde', chamine: false })),
    reg(prototipoCasa(s, M, { w: 6.4, d: 4.8, andares: 1, telhado: 'telhaVermelha', persiana: 'persianaAzul', varanda: true })),
  ];
  // anel de casas em volta da praça, viradas para o centro, deixando as estradas livres
  let k = 0;
  for (const [raio, n, off] of [[33, 14, 0], [50, 18, 0.12]] as const) for (let i = 0; i < n; i++) {
    const a = off + i / n * Math.PI * 2; const x = Math.sin(a) * raio, z = Math.cos(a) * raio;
    if (distEstrada(x, z) < 8.5) continue; if (Math.hypot(x - 0, z + 52) < 16) continue; // igreja
    const v = CASAS[(k++ * 7 + i) % CASAS.length]; const ry = Math.atan2(-x, -z) + (raio > 40 ? (i % 3 - 1) * 0.12 : 0);
    colocar(v, x, altura(x, z), z, ry, 1); col.push({ x, z, r: 3.6 });
  }
  // igreja ao norte da praça, de frente para o sul
  colocar(reg(prototipoIgreja(s, M)), 0, altura(0, -54), -54, Math.PI, 1); col.push({ x: 0, z: -54, r: 7 }, { x: 0, z: -63, r: 3 });
  // poço no centro
  colocar(reg(prototipoPoco(s, M)), 0, 0, 0, 0.3, 1); col.push({ x: 0, z: 0, r: 2.3 });
  // lampiões em volta da praça (a parte acesa brilha)
  const lp = reg(prototipoLampiao(s, M)); for (const p of lp) if (p.material === M.luz) luzes.push(p);
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + 0.2, x = Math.sin(a) * 24, z = Math.cos(a) * 24; if (distEstrada(x, z) < 3.5) continue; colocar(lp, x, 0, z, -a + Math.PI / 2, 1); col.push({ x, z, r: 0.4 }); }
  // bancos, barris e caixotes
  const bc = reg(prototipoBanco(s, M)), br = reg(prototipoBarril(s, M)), cx = reg(prototipoCaixote(s, M));
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + 0.5, x = Math.sin(a) * 8, z = Math.cos(a) * 8; colocar(bc, x, 0, z, a + Math.PI, 1); col.push({ x, z, r: 1.1 }); }
  for (let i = 0; i < 16; i++) { const a = i * 2.4, rr = 28 + (i % 3), x = Math.sin(a) * rr, z = Math.cos(a) * rr; if (distEstrada(x, z) < 4) continue;
    colocar(i % 2 ? br : cx, x, altura(x, z), z, a, 0.9 + (i % 3) * 0.1); if (i % 4 === 0) colocar(cx, x + 0.9, altura(x, z), z + 0.3, a + 0.5, 0.8); col.push({ x, z, r: 0.7 }); }
  // plantações cercadas a sudeste e sudoeste
  const ce = reg(prototipoCerca(s, M));
  for (const [cx0, cz0] of [[62, 42], [-66, 40]]) { for (let i = -3; i <= 3; i++) for (const sz of [-1, 1]) { const x = cx0 + i * 3.1, z = cz0 + sz * 11; colocar(ce, x, altura(x, z), z, 0, 1); }
    for (let i = -3; i <= 3; i++) for (const sx of [-1, 1]) { const x = cx0 + sx * 11, z = cz0 + i * 3.1; colocar(ce, x, altura(x, z), z, Math.PI / 2, 1); } }
  // árvores: em volta da vila e floresta mais densa ao longe (evita estradas e casas)
  const AR = [0, 1, 2].map(t => reg(prototipoArvore(s, M, t, cfg.arvoreDet))), PI = reg(prototipoPinheiro(s, M)), AB = [0, 1].map(t => reg(prototipoArbusto(s, M, t)));
  let sd = 12345; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const livre = (x: number, z: number, m: number) => distEstrada(x, z) > 5 && !col.some(c => Math.hypot(c.x - x, c.z - z) < c.r + m) && !(Math.abs(Math.abs(x) - 64) < 13 && Math.abs(z - 41) < 13) && Math.hypot(x + 64, z + 52) > 14;
  let nArv = 0; const alvo = Math.round(160 * (0.5 + cfg.arvoreDet / 3));
  for (let t = 0; t < alvo * 6 && nArv < alvo; t++) {
    const a = r() * Math.PI * 2, rr = 58 + Math.pow(r(), 0.7) * 170, x = Math.sin(a) * rr, z = Math.cos(a) * rr;
    if (Math.abs(x) > 245 || Math.abs(z) > 245 || !livre(x, z, 2.5)) continue;
    const y = altura(x, z); if (y > 22) continue;
    const pin = rr > 140 || y > 10; colocar(pin ? PI : AR[Math.floor(r() * 3)], x, y - 0.2, z, r() * 6.28, 0.8 + r() * 0.6); col.push({ x, z, r: 0.7 }); nArv++;
  }
  for (let i = 0; i < 70; i++) { const a = r() * 6.28, rr = 26 + r() * 60, x = Math.sin(a) * rr, z = Math.cos(a) * rr; if (!livre(x, z, 1.2)) continue; colocar(AB[i % 2], x, altura(x, z), z, r() * 6.28, 0.7 + r() * 0.6); }
  // Torre dos Grimórios ao noroeste
  colocar(reg(prototipoTorre(s, M)), -64, altura(-64, -52), -52, 0, 1); col.push({ x: -64, z: -52, r: 8 });
  // grama e flores (quantidade conforme o nível gráfico)
  const ondeGrama = (rr: () => number): [number, number, number] | null => { const x = (rr() - 0.5) * 300, z = (rr() - 0.5) * 300, d = Math.hypot(x, z); if (d < 24 || distEstrada(x, z) < 3.5 || col.some(c => Math.hypot(c.x - x, c.z - z) < c.r)) return null; const y = altura(x, z); return y > 16 ? null : [x, y, z]; };
  espalhar(s, cfg.grama, 'grama', ondeGrama, 77);
  espalhar(s, cfg.flores, 'flor', rr => { const p = ondeGrama(rr); if (!p) return null; const d = Math.hypot(p[0], p[2]); return d < 90 ? p : (rr() < 0.3 ? p : null); }, 31);
  return { mats: M, colisores: col, luzes, sombra };
}
