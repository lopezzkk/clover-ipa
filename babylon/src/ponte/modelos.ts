// CARREGAMENTO DOS MODELOS 3D SEM O THREE.JS
// Antes: os 7 modelos .glb do jogo (Grimório do Asta, Nero, Espada Destruidora e os 4 demônios baixados)
// eram lidos pelo GLTFLoader do three.js (arquivo vendor de 96 KB).
// Agora: um leitor de .glb pequeno, feito para o jogo, lê o arquivo, e as texturas são carregadas pelo Babylon
// (a ponte usa elas direto, sem converter de novo). O carregador oficial de glTF do Babylon foi testado e
// descartado: ele soma ~970 KB ao jogo (materiais PBR e shaders que o jogo não usa).
// O jogo recebe a mesma estrutura de antes (mesmos nomes, posições, formas, cores e texturas), então a espada,
// o Nero, a capa do grimório e os demônios continuam funcionando igual, e o desenho de reserva também.
import { Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };
// mesmo nome que o three.js dava (PropertyBinding.sanitizeNodeName)
const nome = (s: string) => (s || '').replace(/\s/g, '_').replace(/[\[\]\.:\/]/g, '');

export class Modelos {
  private prontos = new Map<string, T3>(); private esperando = new Map<string, ((sc: T3) => void)[]>();
  carregados = 0; erros = 0; texturas = 0; ultimoErro = '';
  constructor(private s: Scene) {}

  /** substitui o glb100 do jogo: devolve (no retorno) uma cópia do modelo, igual ao antigo */
  carregar(k: string, cb: (sc: T3) => void, antigo?: (k: string, cb: (sc: T3) => void) => void) {
    const pronto = this.prontos.get(k); if (pronto) { cb(pronto.clone(true)); return; }
    let fila = this.esperando.get(k); if (!fila) this.esperando.set(k, fila = []); fila.push(cb); if (fila.length > 1) return;
    this.ler(k).then(sc => {
      this.prontos.set(k, sc); this.carregados++;
      for (const f of this.esperando.get(k) || []) { try { f(sc.clone(true)); } catch { /* igual ao antigo: erro de quem pediu não para os outros */ } }
      this.esperando.set(k, []);
    }).catch(e => {
      this.erros++; this.ultimoErro = String(e && e.message || e); console.warn('modelos (Babylon)', k, e);
      const fila2 = this.esperando.get(k) || []; this.esperando.set(k, []);
      // reserva: se o three.js ainda tiver o carregador antigo, usa ele
      if (antigo) for (const f of fila2) { try { antigo(k, f); } catch { /* sem reserva */ } }
    });
  }

  private async ler(k: string): Promise<T3> {
    const T = jogo('T') || (window as any).THREE; const MD = jogo('MD100');
    const b64: string = MD && MD[k] && MD[k].glb; if (!b64) throw new Error('modelo sem dados: ' + k);
    const bin = atob(b64), u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const dv = new DataView(u.buffer); if (dv.getUint32(0, true) !== 0x46546c67) throw new Error('não é .glb: ' + k);
    let J: any = null, BIN: Uint8Array | null = null;
    for (let o = 12; o < u.length;) { const n = dv.getUint32(o, true), tipo = dv.getUint32(o + 4, true); const d = u.subarray(o + 8, o + 8 + n);
      if (tipo === 0x4e4f534a) J = JSON.parse(new TextDecoder().decode(d)); else if (tipo === 0x004e4942) BIN = d; o += 8 + n; }
    if (!J || !BIN) throw new Error('.glb incompleto: ' + k);
    const bv = (i: number) => { const v = J.bufferViews[i]; return { d: BIN!.subarray(v.byteOffset || 0, (v.byteOffset || 0) + v.byteLength), st: v.byteStride || 0 }; };
    const NC: Record<string, number> = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 };
    const TA: Record<number, any> = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
    const NORM: Record<number, number> = { 5120: 127, 5121: 255, 5122: 32767, 5123: 65535 };
    /** lê um "accessor" do arquivo (aceita dados intercalados e números normalizados) */
    const acc = (i: number, float = true): { a: any; n: number } => {
      const A = J.accessors[i], n = NC[A.type], C = TA[A.componentType], tam = C.BYTES_PER_ELEMENT; const { d, st } = bv(A.bufferView);
      const ini = A.byteOffset || 0; const passo = st || n * tam; const out = float ? new Float32Array(A.count * n) : new C(A.count * n);
      const v = new DataView(d.buffer, d.byteOffset, d.byteLength); const div = A.normalized ? NORM[A.componentType] || 1 : 1;
      const lerN = (p: number) => C === Float32Array ? v.getFloat32(p, true) : C === Uint16Array ? v.getUint16(p, true) : C === Uint32Array ? v.getUint32(p, true) : C === Int16Array ? v.getInt16(p, true) : C === Uint8Array ? v.getUint8(p) : v.getInt8(p);
      for (let e = 0; e < A.count; e++) for (let c = 0; c < n; c++) out[e * n + c] = lerN(ini + e * passo + c * tam) / div;
      return { a: out, n };
    };
    // texturas: a imagem vai para o Babylon (desenho) e para o three.js (só o desenho de reserva)
    const urls: string[] = (J.images || []).map((im: any) => { const { d } = bv(im.bufferView); return URL.createObjectURL(new Blob([d.slice()], { type: im.mimeType || 'image/jpeg' })); });
    const imgs: Promise<HTMLImageElement>[] = urls.map(url => new Promise((ok, erro) => { const im = new Image(); im.onload = () => ok(im); im.onerror = erro; im.src = url; }));
    const WR = (w: number | undefined) => w === 33071 ? 'c' : w === 33648 ? 'm' : 'r';
    const texCache = new Map<number, T3>();
    const tex3 = async (ti: number | undefined): Promise<T3> => {
      if (ti == null || !J.textures || !J.textures[ti]) return null; let c = texCache.get(ti); if (c) return c;
      const tx = J.textures[ti], sp = (J.samplers || [])[tx.sampler] || {}; const img = await imgs[tx.source];
      const bt = new Texture(urls[tx.source], this.s, { noMipmap: false, invertY: false, samplingMode: sp.magFilter === 9728 ? Texture.NEAREST_SAMPLINGMODE : Texture.TRILINEAR_SAMPLINGMODE });
      const am = (w: string) => w === 'c' ? Texture.CLAMP_ADDRESSMODE : w === 'm' ? Texture.MIRROR_ADDRESSMODE : Texture.WRAP_ADDRESSMODE;
      bt.wrapU = am(WR(sp.wrapS)); bt.wrapV = am(WR(sp.wrapT)); bt.anisotropicFilteringLevel = 2;
      const t3w = (w: string) => w === 'c' ? T.ClampToEdgeWrapping : w === 'm' ? T.MirroredRepeatWrapping : T.RepeatWrapping;
      c = new T.Texture(img); c.flipY = false; c.encoding = T.LinearEncoding; c.anisotropy = 2; c.wrapS = t3w(WR(sp.wrapS)); c.wrapT = t3w(WR(sp.wrapT)); c.needsUpdate = true; c.__bjs = bt;
      texCache.set(ti, c); this.texturas++; return c;
    };
    const matCache = new Map<number, T3>();
    const mat3 = async (mi: number | undefined): Promise<T3> => {
      if (mi == null) { const d = new T.MeshLambertMaterial({ color: 0xffffff }); d._keep = 1; return d; }
      let c = matCache.get(mi); if (c) return c; const M = J.materials[mi], pb = M.pbrMetallicRoughness || {};
      const f = pb.baseColorFactor || [1, 1, 1, 1]; const map = await tex3(pb.baseColorTexture && pb.baseColorTexture.index);
      const p = { map: map || null, color: new T.Color(f[0], f[1], f[2]), transparent: M.alphaMode === 'BLEND', opacity: f[3], alphaTest: M.alphaMode === 'MASK' ? (M.alphaCutoff ?? 0.5) : 0, side: M.doubleSided ? T.DoubleSide : T.FrontSide };
      c = M.extensions && M.extensions.KHR_materials_unlit ? new T.MeshBasicMaterial(p) : new T.MeshLambertMaterial(p); c._keep = 1; c.name = M.name || ''; matCache.set(mi, c); return c;
    };
    const geoCache = new Map<any, T3>();
    const geo3 = (pr: any): T3 => {
      const chave = JSON.stringify([pr.attributes, pr.indices]); let g = geoCache.get(chave); if (g) return g;
      g = new T.BufferGeometry(); const at = pr.attributes;
      const P = at.POSITION != null ? acc(at.POSITION) : null; if (P) g.setAttribute('position', new T.BufferAttribute(P.a, 3));
      if (at.NORMAL != null) g.setAttribute('normal', new T.BufferAttribute(acc(at.NORMAL).a, 3));
      if (at.TEXCOORD_0 != null) g.setAttribute('uv', new T.BufferAttribute(acc(at.TEXCOORD_0).a, 2));
      if (at.COLOR_0 != null) { const C = acc(at.COLOR_0); g.setAttribute('color', new T.BufferAttribute(C.a, C.n)); }
      if (at.TANGENT != null) g.setAttribute('tangent', new T.BufferAttribute(acc(at.TANGENT).a, 4));
      if (pr.indices != null) { const I = acc(pr.indices, false); g.setIndex(new T.BufferAttribute(I.a, 1)); }
      g._keep = 1; geoCache.set(chave, g); return g;
    };
    // nomes iguais aos do leitor antigo (o nó usa o nome sem espaços/pontos; a malha sem nome de nó fica com o nome dela)
    const malha = async (mi: number): Promise<T3> => {
      const ME = J.meshes[mi]; const lista: T3[] = [];
      for (const pr of ME.primitives) { const o = new T.Mesh(geo3(pr), await mat3(pr.material)); o.castShadow = true; lista.push(o); }
      const nm = ME.name || 'mesh_' + mi; if (lista.length === 1) { lista[0].name = nm; return lista[0]; }
      const g = new T.Group(); g.name = nm; lista.forEach((o, i) => { o.name = nm + '_' + i; g.add(o); }); return g;
    };
    const monta = async (ni: number): Promise<T3> => {
      const N = J.nodes[ni]; const o: T3 = N.mesh != null ? await malha(N.mesh) : new T.Group();
      if (N.name) o.name = nome(N.name);
      if (N.matrix) new T.Matrix4().fromArray(N.matrix).decompose(o.position, o.quaternion, o.scale);
      else { if (N.translation) o.position.fromArray(N.translation); if (N.rotation) o.quaternion.fromArray(N.rotation); if (N.scale) o.scale.fromArray(N.scale); }
      for (const f of N.children || []) o.add(await monta(f));
      return o;
    };
    const cena = (J.scenes || [])[J.scene || 0] || { nodes: J.nodes.map((_: any, i: number) => i) };
    const raiz = new T.Group(); if (cena.name) raiz.name = cena.name;
    for (const ni of cena.nodes || []) raiz.add(await monta(ni));
    await Promise.all(imgs.map(p => p.catch(() => null)));
    raiz.updateMatrixWorld(true); return raiz;
  }
  get info() { return { carregados: this.carregados, texturas: this.texturas, erros: this.erros, ultimoErro: this.ultimoErro }; }
}
