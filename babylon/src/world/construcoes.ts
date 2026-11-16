// Kit de construção: cada modelo é montado uma vez (protótipo escondido) e repetido por instâncias de hardware.
// Uma casa inteira vira poucos desenhos por quadro, não importa quantas existam.
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3, VertexData, AbstractMesh, InstancedMesh, Material } from '@babylonjs/core';
import { textura, reboco, madeira, tabuas, telhas, pedra, vidro } from './texturas';

export interface Mats { [k: string]: StandardMaterial }
export function criarMateriais(scene: Scene): Mats {
  const m = (n: string, cor: string, tx?: [string, (c: CanvasRenderingContext2D, s: number, r: () => number) => void, number], spec = 0.04): StandardMaterial => {
    const x = new StandardMaterial('m_' + n, scene); x.diffuseColor = Color3.FromHexString(cor); x.specularColor = new Color3(spec, spec, spec);
    if (tx) x.diffuseTexture = textura(scene, tx[0], 256, tx[1], tx[2]);
    return x;
  };
  const M: Mats = {
    reboco: m('reboco', '#ffffff', ['reboco', reboco, 1]), rebocoCreme: m('rebocoCreme', '#f3dfb8', ['reboco', reboco, 1]),
    madeira: m('madeira', '#ffffff', ['madeira', madeira, 1]), madeiraEscura: m('madeiraEscura', '#6b5a50', ['madeira', madeira, 1]),
    tabuas: m('tabuas', '#ffffff', ['tabuas', tabuas, 1]), pedra: m('pedra', '#ffffff', ['pedra', pedra, 1.5], 0.08), pedraClara: m('pedraClara', '#d8d2c6', ['pedra', pedra, 2], 0.08),
    telhaVermelha: m('telhaV', '#ffffff', ['telhas', telhas, 2]), telhaAzul: m('telhaA', '#8aa2c8', ['telhas', telhas, 2]), telhaMarrom: m('telhaM', '#b88a68', ['telhas', telhas, 2]), telhaArdosia: m('telhaS', '#7a7f8a', ['telhas', telhas, 2]),
    persianaVerde: m('persV', '#4f8a5a', ['tabuas', tabuas, 0.5]), persianaAzul: m('persA', '#4a6aa8', ['tabuas', tabuas, 0.5]), persianaVermelha: m('persR', '#a8484a', ['tabuas', tabuas, 0.5]),
    metal: m('metal', '#3a3a40', undefined, 0.5), ouro: m('ouro', '#d8b04a', undefined, 0.6),
    flores: m('flores', '#ffffff'), folha: m('folha', '#ffffff'), casca: m('casca', '#8a6a52', ['madeira', madeira, 1]),
  };
  const v = new StandardMaterial('m_vidro', scene); const tv = textura(scene, 'vidro', 64, vidro); v.diffuseTexture = tv; v.emissiveTexture = tv; v.emissiveColor = new Color3(0.25, 0.2, 0.12); v.specularColor = new Color3(0.6, 0.6, 0.6); M.vidro = v;
  const lu = new StandardMaterial('m_luz', scene); lu.emissiveColor = new Color3(1, 0.78, 0.42); lu.diffuseColor = new Color3(1, 0.85, 0.6); lu.disableLighting = true; M.luz = lu;
  const ag = new StandardMaterial('m_agua', scene); ag.diffuseColor = new Color3(0.15, 0.32, 0.45); ag.specularColor = new Color3(0.9, 0.9, 0.9); ag.specularPower = 96; ag.alpha = 0.88; M.agua = ag;
  const mg = new StandardMaterial('m_magia', scene); mg.emissiveColor = new Color3(0.55, 0.85, 1); mg.disableLighting = true; M.magia = mg;
  return M;
}

// ---------- peças básicas ----------
const caixa = (s: Scene, w: number, h: number, d: number, x: number, y: number, z: number, ry = 0, rx = 0, rz = 0) => { const b = MeshBuilder.CreateBox('p', { width: w, height: h, depth: d }, s); b.position.set(x, y, z); b.rotation.set(rx, ry, rz); return b; };
/** prisma do telhado/empena: base d (eixo z), altura h, comprimento w (eixo x) */
function prisma(s: Scene, w: number, d: number, h: number) {
  const x = w / 2, z = d / 2;
  const P = [-x, 0, -z, -x, 0, z, -x, h, 0, x, 0, -z, x, 0, z, x, h, 0];
  const I = [0, 1, 2, 3, 5, 4];
  const m = new Mesh('prisma', s); const vd = new VertexData(); vd.positions = P; vd.indices = I; const N: number[] = []; VertexData.ComputeNormals(P, I, N); vd.normals = N;
  vd.uvs = [0, 0, 1, 0, 0.5, 1, 0, 0, 1, 0, 0.5, 1]; vd.applyToMesh(m); return m;
}

/** junta as peças por material: um modelo = poucos meshes */
function juntar(nome: string, partes: [Mesh, Material][]): Mesh[] {
  const grupos = new Map<Material, Mesh[]>();
  for (const [m, mat] of partes) { if (!grupos.has(mat)) grupos.set(mat, []); grupos.get(mat)!.push(m); }
  const out: Mesh[] = [];
  for (const [mat, ms] of grupos) { const j = Mesh.MergeMeshes(ms, true, true)!; j.name = nome + '_' + mat.name; j.material = mat; j.isVisible = false; j.receiveShadows = true; out.push(j); }
  return out;
}

// ---------- casa em enxaimel ----------
export interface CasaOpts { w: number; d: number; andares: 1 | 2; telhado: string; persiana: string; reboco?: string; chamine?: boolean; varanda?: boolean }
export function prototipoCasa(s: Scene, M: Mats, o: CasaOpts): Mesh[] {
  const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  const { w, d } = o; const base = 0.6, h1 = 3, h2 = 2.8, over = o.andares === 2 ? 0.35 : 0;
  add(caixa(s, w + 0.4, base, d + 0.4, 0, base / 2, 0), 'pedra');
  add(caixa(s, w, h1, d, 0, base + h1 / 2, 0), o.reboco || 'reboco');
  let topo = base + h1;
  if (o.andares === 2) { add(caixa(s, w + over * 2, h2, d + over * 2, 0, topo + h2 / 2 + 0.15, 0), o.reboco || 'reboco'); add(caixa(s, w + over * 2 + 0.2, 0.3, d + over * 2 + 0.2, 0, topo + 0.15, 0), 'madeira'); topo += h2 + 0.3; }
  // enxaimel: postes, travessas e mãos-francesas em cada andar
  const vigas = (y0: number, hh: number, ww: number, dd: number) => {
    const t = 0.2, e = 0.07;
    for (const [fw, fd, ry] of [[ww, dd, 0], [dd, ww, Math.PI / 2]] as const) for (const sgn of [1, -1]) {
      const n = Math.max(2, Math.round(fw / 1.7));
      for (let i = 0; i <= n; i++) { const px = -fw / 2 + fw * i / n; const v = caixa(s, t, hh, t, 0, 0, 0); v.position = rot(px, y0 + hh / 2, sgn * (fd / 2 + e), ry); add(v, 'madeira'); }
      for (const yy of [y0 + 0.1, y0 + hh - 0.1]) { const v = caixa(s, fw + t, t, t, 0, 0, 0); v.position = rot(0, yy, sgn * (fd / 2 + e), ry); v.rotation.y = ry; add(v, 'madeira'); }
      for (const sx of [-1, 1]) { const L = Math.hypot(fw / n, hh) * 0.9; const v = caixa(s, t * 0.8, L, t * 0.8, 0, 0, 0); v.position = rot(sx * (fw / 2 - fw / n / 2), y0 + hh / 2, sgn * (fd / 2 + e), ry); v.rotation.set(0, ry, sx * sgn * Math.atan2(fw / n, hh) * (ry ? -1 : 1)); add(v, 'madeira'); }
    }
  };
  const rot = (x: number, y: number, z: number, ry: number) => new Vector3(x * Math.cos(ry) + z * Math.sin(ry), y, -x * Math.sin(ry) + z * Math.cos(ry));
  vigas(base, h1, w, d); if (o.andares === 2) vigas(base + h1 + 0.3, h2, w + over * 2, d + over * 2);
  // telhado de duas águas com beiral
  const W = w + over * 2, D = d + over * 2, hr = D * 0.55, ov = 0.6;
  const emp = prisma(s, W, D, hr); emp.position.y = topo; add(emp, o.reboco || 'reboco');
  const L = Math.hypot(D / 2 + ov, hr + ov * hr / (D / 2)); const ang = Math.atan2(hr, D / 2);
  for (const sz of [1, -1]) { const r = caixa(s, W + ov * 2, 0.22, L, 0, topo + hr / 2 - 0.05, sz * (D / 4 + ov / 2) * 0.98, 0, sz * ang); add(r, o.telhado); }
  add(caixa(s, W + ov * 2 + 0.1, 0.28, 0.32, 0, topo + hr + 0.05, 0), 'madeira');
  if (o.chamine !== false) add(caixa(s, 0.9, hr + 1.6, 0.9, W * 0.28, topo + hr / 2 + 0.6, -D * 0.18), 'pedra');
  // porta com batente e degrau
  add(caixa(s, 1.25, 2.25, 0.12, 0, base + 1.12, d / 2 + 0.06), 'tabuas');
  add(caixa(s, 1.55, 0.2, 0.25, 0, base + 2.35, d / 2 + 0.1), 'madeira');
  add(caixa(s, 1.8, 0.25, 0.7, 0, base - 0.12, d / 2 + 0.5), 'pedraClara');
  add(caixa(s, 0.1, 0.1, 0.12, 0.42, base + 1.1, d / 2 + 0.14), 'metal');
  // janelas com vidro aceso, venezianas e floreiras
  const janela = (x: number, y: number, z: number, ry: number) => {
    const p = (dx: number, dy: number, dz: number) => rot(x + dx, y + dy, z + dz, ry).add(Vector3.Zero());
    const g = caixa(s, 0.9, 1.05, 0.06, 0, 0, 0); g.position = p(0, 0, 0.09); g.rotation.y = ry; add(g, 'vidro');
    const f = caixa(s, 1.08, 0.12, 0.16, 0, 0, 0); f.position = p(0, -0.6, 0.12); f.rotation.y = ry; add(f, 'madeira');
    const f2 = caixa(s, 1.08, 0.1, 0.12, 0, 0, 0); f2.position = p(0, 0.58, 0.1); f2.rotation.y = ry; add(f2, 'madeira');
    for (const sx of [-1, 1]) { const ps = caixa(s, 0.42, 1.1, 0.06, 0, 0, 0); ps.position = p(sx * 0.68, 0, 0.12); ps.rotation.y = ry; add(ps, o.persiana); }
    const fl = caixa(s, 0.95, 0.24, 0.3, 0, 0, 0); fl.position = p(0, -0.78, 0.22); fl.rotation.y = ry; add(fl, 'madeira');
    for (let i = 0; i < 4; i++) { const b = MeshBuilder.CreateIcoSphere('f', { radius: 0.13, subdivisions: 1 }, s); b.position = p(-0.33 + i * 0.22, -0.6, 0.24); add(b, i % 2 ? 'persianaVermelha' : 'persianaVerde'); }
  };
  const nj = Math.max(1, Math.floor(w / 2.6));
  for (let i = 0; i < nj; i++) { const x = -w / 2 + w * (i + 0.5) / nj; if (Math.abs(x) > 1) janela(x, base + 1.7, d / 2, 0); janela(x, base + 1.7, d / 2, Math.PI); }
  janela(0, base + 1.7, w / 2, Math.PI / 2); janela(0, base + 1.7, w / 2, -Math.PI / 2);
  if (o.andares === 2) for (let i = 0; i < nj + 1; i++) { const x = -W / 2 + W * (i + 0.5) / (nj + 1); janela(x, base + h1 + 0.3 + 1.4, D / 2, 0); janela(x, base + h1 + 0.3 + 1.4, D / 2, Math.PI); }
  if (o.varanda) { add(caixa(s, 2.6, 0.12, 1.2, 0, base + 2.6, d / 2 + 0.6), 'madeira'); for (const sx of [-1, 1]) add(caixa(s, 0.16, 2.5, 0.16, sx * 1.2, base + 1.25, d / 2 + 1.1), 'madeira'); add(caixa(s, 2.8, 0.12, 1.4, 0, base + 2.75, d / 2 + 0.6, 0, -0.25), o.telhado); }
  return juntar('casa', P);
}

/** coloca uma cópia (instâncias) do protótipo */
export function colocar(protos: Mesh[], x: number, y: number, z: number, ry: number, esc = 1, sombras?: (m: AbstractMesh) => void): TransformNode {
  const n = new TransformNode('obj', protos[0].getScene()); n.position.set(x, y, z); n.rotation.y = ry; n.scaling.setAll(esc);
  for (const p of protos) { const i: InstancedMesh = p.createInstance(p.name + '_i'); i.parent = n; i.isPickable = false; sombras?.(i); }
  n.freezeWorldMatrix();
  for (const c of n.getChildMeshes()) c.freezeWorldMatrix();
  return n;
}

// ---------- igreja de Hage ----------
export function prototipoIgreja(s: Scene, M: Mats): Mesh[] {
  const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  add(caixa(s, 9, 0.8, 16, 0, 0.4, 0), 'pedra');
  add(caixa(s, 8.2, 6, 15, 0, 3.8, 0), 'pedraClara');
  const r = prisma(s, 15.6, 8.2, 4.5); r.rotation.y = Math.PI / 2; r.position.y = 6.8; add(r, 'pedraClara');
  const ang = Math.atan2(4.5, 4.1), L = Math.hypot(4.7, 5.1);
  for (const sx of [1, -1]) add(caixa(s, L, 0.25, 16.6, sx * 2.25, 6.8 + 2.2, 0, 0, 0, -sx * ang), 'telhaArdosia');
  // torre do sino com agulha
  add(caixa(s, 4, 13, 4, 0, 6.5, 9), 'pedra');
  add(caixa(s, 4.4, 0.4, 4.4, 0, 13.2, 9), 'madeira');
  for (const [x, z] of [[-1.7, 7.3], [1.7, 7.3], [-1.7, 10.7], [1.7, 10.7]]) add(caixa(s, 0.5, 3, 0.5, x, 14.9, z), 'pedraClara');
  const sino = MeshBuilder.CreateCylinder('sino', { diameterTop: 0.5, diameterBottom: 1.3, height: 1.1, tessellation: 16 }, s); sino.position.set(0, 15.2, 9); add(sino, 'ouro');
  const ag = MeshBuilder.CreateCylinder('agulha', { diameterTop: 0, diameterBottom: 5.6, height: 7, tessellation: 4 }, s); ag.rotation.y = Math.PI / 4; ag.position.set(0, 20, 9); add(ag, 'telhaArdosia');
  const cr = caixa(s, 0.18, 1.6, 0.18, 0, 24.2, 9); add(cr, 'ouro'); add(caixa(s, 0.9, 0.18, 0.18, 0, 24.4, 9), 'ouro');
  // rosácea e portal
  const ro = MeshBuilder.CreateCylinder('rosa', { diameter: 2.4, height: 0.2, tessellation: 24 }, s); ro.rotation.x = Math.PI / 2; ro.position.set(0, 9.2, 11.1); add(ro, 'vidro');
  add(caixa(s, 2, 3.4, 0.2, 0, 2.5, 11.05), 'tabuas');
  const arco = MeshBuilder.CreateTorus('arco', { diameter: 2.2, thickness: 0.35, tessellation: 24 }, s); arco.rotation.x = Math.PI / 2; arco.position.set(0, 4.1, 11.1); add(arco, 'pedra');
  for (const z of [-5, -1, 3]) for (const sx of [-1, 1]) { const j = caixa(s, 0.12, 2.6, 1, sx * 4.15, 4.4, z); add(j, 'vidro'); }
  return juntar('igreja', P);
}

// ---------- poço da praça ----------
export function prototipoPoco(s: Scene, M: Mats): Mesh[] {
  const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  const anel = MeshBuilder.CreateTube('anel', { path: Array.from({ length: 33 }, (_, i) => new Vector3(Math.cos(i / 32 * Math.PI * 2) * 1.6, 0.55, Math.sin(i / 32 * Math.PI * 2) * 1.6)), radius: 0.55, tessellation: 12 }, s); add(anel, 'pedra');
  const ag = MeshBuilder.CreateDisc('agua', { radius: 1.3, tessellation: 24 }, s); ag.rotation.x = Math.PI / 2; ag.position.y = 0.55; add(ag, 'agua');
  for (const sx of [-1, 1]) add(caixa(s, 0.25, 3.2, 0.25, sx * 1.55, 1.6, 0), 'madeira');
  add(caixa(s, 3.4, 0.2, 0.2, 0, 2.7, 0), 'madeira');
  const r = prisma(s, 4, 3, 1.2); r.position.y = 3.1; add(r, 'madeira');
  for (const sz of [1, -1]) add(caixa(s, 4.2, 0.12, 2.1, 0, 3.7, sz * 0.75, 0, sz * 0.67), 'telhaMarrom');
  const b = MeshBuilder.CreateCylinder('balde', { diameterTop: 0.5, diameterBottom: 0.4, height: 0.5, tessellation: 10 }, s); b.position.set(0, 1.9, 0); add(b, 'tabuas');
  return juntar('poco', P);
}

// ---------- lampião (a luz acende à noite e brilha com o efeito de brilho) ----------
export function prototipoLampiao(s: Scene, M: Mats): Mesh[] {
  const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  add(MeshBuilder.CreateCylinder('poste', { diameterTop: 0.14, diameterBottom: 0.22, height: 3.4, tessellation: 8 }, s), 'metal').position.y = 1.7;
  add(caixa(s, 0.7, 0.08, 0.08, 0.3, 3.3, 0), 'metal');
  add(caixa(s, 0.36, 0.5, 0.36, 0.6, 3.0, 0), 'luz');
  const t = MeshBuilder.CreateCylinder('tampa', { diameterTop: 0, diameterBottom: 0.6, height: 0.3, tessellation: 4 }, s); t.position.set(0.6, 3.4, 0); t.rotation.y = Math.PI / 4; add(t, 'metal');
  return juntar('lampiao', P);
}

// ---------- adereços ----------
export function prototipoBanco(s: Scene, M: Mats): Mesh[] { const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  add(caixa(s, 2.2, 0.12, 0.6, 0, 0.55, 0), 'tabuas'); add(caixa(s, 2.2, 0.5, 0.1, 0, 0.9, -0.28, 0, -0.15), 'tabuas');
  for (const sx of [-1, 1]) add(caixa(s, 0.12, 0.55, 0.55, sx * 0.95, 0.27, 0), 'metal'); return juntar('banco', P); }
export function prototipoBarril(s: Scene, M: Mats): Mesh[] { const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  const b = MeshBuilder.CreateCylinder('barril', { diameterTop: 0.75, diameterBottom: 0.75, height: 1.1, tessellation: 14 }, s); b.position.y = 0.55; add(b, 'tabuas');
  for (const y of [0.2, 0.9]) { const a = MeshBuilder.CreateTorus('aro', { diameter: 0.8, thickness: 0.05, tessellation: 18 }, s); a.position.y = y; add(a, 'metal'); }
  return juntar('barril', P); }
export function prototipoCaixote(s: Scene, M: Mats): Mesh[] { const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  add(caixa(s, 0.9, 0.9, 0.9, 0, 0.45, 0), 'tabuas'); for (const y of [0.05, 0.85]) add(caixa(s, 0.95, 0.1, 0.95, 0, y, 0), 'madeira'); return juntar('caixote', P); }
export function prototipoCerca(s: Scene, M: Mats): Mesh[] { const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  for (const x of [-1.5, 1.5]) add(caixa(s, 0.16, 1.2, 0.16, x, 0.6, 0), 'madeira'); for (const y of [0.45, 0.95]) add(caixa(s, 3.1, 0.12, 0.08, 0, y, 0), 'madeira'); return juntar('cerca', P); }

// ---------- Torre dos Grimórios (marco ao longe) ----------
export function prototipoTorre(s: Scene, M: Mats): Mesh[] {
  const P: [Mesh, Material][] = []; const add = (m: Mesh, k: string) => { P.push([m, M[k]]); return m; };
  add(MeshBuilder.CreateCylinder('base', { diameterTop: 13, diameterBottom: 16, height: 4, tessellation: 24 }, s), 'pedra').position.y = 2;
  add(MeshBuilder.CreateCylinder('torre', { diameterTop: 8, diameterBottom: 11, height: 46, tessellation: 24 }, s), 'pedraClara').position.y = 27;
  const esp = MeshBuilder.CreateTube('espiral', { path: Array.from({ length: 120 }, (_, i) => { const t = i / 119, a = t * Math.PI * 9, r = 5.6 - t * 1.4; return new Vector3(Math.cos(a) * r, 5 + t * 42, Math.sin(a) * r); }), radius: 0.35, tessellation: 6 }, s); add(esp, 'ouro');
  add(MeshBuilder.CreateCylinder('topo', { diameterTop: 10, diameterBottom: 8, height: 2.4, tessellation: 24 }, s), 'pedra').position.y = 51;
  const c = MeshBuilder.CreateCylinder('cone', { diameterTop: 0, diameterBottom: 10.5, height: 12, tessellation: 24 }, s); c.position.y = 58; add(c, 'telhaAzul');
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; const j = caixa(s, 0.2, 2.4, 1.2, Math.cos(a) * 4.3, 30 + (i % 3) * 8, Math.sin(a) * 4.3, -a); add(j, 'vidro'); }
  // anel de grimórios flutuando
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; const l = caixa(s, 1.2, 1.6, 0.35, Math.cos(a) * 9, 46, Math.sin(a) * 9, -a + Math.PI / 2); add(l, 'magia'); }
  return juntar('torre', P);
}
