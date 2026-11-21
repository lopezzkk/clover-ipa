// Tradutor three.js → Babylon.js.
// A cada quadro: o jogo monta a cena dele (three.js) do mesmo jeito de sempre; aqui cada objeto visível ganha (ou atualiza)
// uma cópia no Babylon. Geometrias, materiais e texturas são traduzidos uma vez e reaproveitados; só o que muda é atualizado.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Matrix } from '@babylonjs/core/Maths/math.vector';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Material } from '@babylonjs/core/Materials/material';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Constants } from '@babylonjs/core/Engines/constants';
import { LinesMesh } from '@babylonjs/core/Meshes/linesMesh';
import { Geometry } from '@babylonjs/core/Meshes/geometry';
import { CreatePlane } from '@babylonjs/core/Meshes/Builders/planeBuilder';
import { CreateLineSystem } from '@babylonjs/core/Meshes/Builders/linesBuilder';

type T3 = any; // objetos do three.js (o jogo usa o r128 global)

interface Rep { b: AbstractMesh; visto: number; m: Float32Array; tipo: string; mat: T3; geo: T3; geoV: number; matV: number }

export class Tradutor {
  quadro = 0;
  private reps = new Map<T3, Rep>();
  private geos = new Map<T3, { g: Geometry; v: number; temCor: boolean; n: number }>();
  private mats = new Map<string, { m: StandardMaterial; src: T3; v: string }>();
  private reservaMat: StandardMaterial[] = [];
  private texs = new Map<T3, { t: Texture; v: number }>();
  sombraAdd?: (m: AbstractMesh) => void; sombraRem?: (m: AbstractMesh) => void;
  melhorar?: (b: StandardMaterial, src: T3, obj: T3) => void;
  stats = { objetos: 0, malhas: 0, novos: 0, liberados: 0, reusados: 0 };
  efeitos: { x: number; y: number; z: number; r: number; c: Color3; novo: boolean }[] = [];

  constructor(private s: Scene) {}

  // ---------- texturas ----------
  textura(t3: T3): Texture | null {
    if (!t3 || !t3.image) return null;
    const c = this.texs.get(t3);
    if (c && c.v === t3.version) return c.t;
    const img = t3.image; let t: Texture;
    if (c) { // mudou (ex.: textura desenhada que foi atualizada)
      if (c.t instanceof DynamicTexture) { const ctx = c.t.getContext(); ctx.clearRect(0, 0, c.t.getSize().width, c.t.getSize().height); ctx.drawImage(img, 0, 0, c.t.getSize().width, c.t.getSize().height); c.t.update(t3.flipY !== false); c.v = t3.version; return c.t; }
    }
    const w = img.width || img.videoWidth || 1, h = img.height || img.videoHeight || 1;
    if (img instanceof HTMLImageElement && img.src && img.complete) t = new Texture(img.src, this.s, false, t3.flipY !== false);
    else { const d = new DynamicTexture('t3', { width: w, height: h }, this.s, true); try { d.getContext().drawImage(img, 0, 0, w, h); } catch { /* imagem ainda não pronta */ } d.update(t3.flipY !== false); t = d; }
    t.wrapU = t3.wrapS === 1001 ? Texture.CLAMP_ADDRESSMODE : t3.wrapS === 1002 ? Texture.MIRROR_ADDRESSMODE : Texture.WRAP_ADDRESSMODE;
    t.wrapV = t3.wrapT === 1001 ? Texture.CLAMP_ADDRESSMODE : t3.wrapT === 1002 ? Texture.MIRROR_ADDRESSMODE : Texture.WRAP_ADDRESSMODE;
    if (t3.repeat) { t.uScale = t3.repeat.x; t.vScale = t3.repeat.y; } if (t3.offset) { t.uOffset = t3.offset.x; t.vOffset = t3.offset.y; }
    if (t3.magFilter === 1003) t.updateSamplingMode(Texture.NEAREST_SAMPLINGMODE);
    t.anisotropicFilteringLevel = 4;
    if (c) c.t.dispose();
    this.texs.set(t3, { t, v: t3.version });
    if (!c && t3.addEventListener) t3.addEventListener('dispose', () => { const x = this.texs.get(t3); if (x) { x.t.dispose(); this.texs.delete(t3); } });
    return t;
  }

  // ---------- materiais ----------
  // a chave inclui o que muda a forma de desenhar (cores do vértice); propriedades simples são copiadas todo quadro
  material(m3: T3, temCor: boolean, obj: T3): StandardMaterial {
    // otimização: o material traduzido fica guardado no próprio material do jogo (sem montar texto de chave a cada objeto)
    // e é conferido só uma vez por quadro, mesmo quando centenas de objetos usam o mesmo material
    const slot = temCor ? '__bmC' : '__bm';
    let c = m3[slot] as { m: StandardMaterial; src: T3; v: string; q?: number; a?: any[] } | undefined;
    if (!c) {
      const k = m3.uuid + (temCor ? 'c' : '');
      c = this.mats.get(k);
      if (!c) {
        // efeitos de magia criam um material brilhante novo a cada uso: os do Babylon são reaproveitados de uma reserva
        const efeito = m3.type === 'MeshBasicMaterial' && !m3.map && m3.blending === 2;
        let m = efeito ? this.reservaMat.pop() : undefined;
        if (m) { m.metadata = {}; m.alpha = 1; this.stats.reusados++; }
        else { m = new StandardMaterial('m3_' + (m3.name || m3.type), this.s); }
        m.specularColor = new Color3(0.06, 0.06, 0.06);
        c = { m, src: m3, v: '' }; this.mats.set(k, c);
        if (m3.addEventListener) m3.addEventListener('dispose', () => { const x = this.mats.get(k); if (x) { if (efeito && this.reservaMat.length < 300) this.reservaMat.push(x.m); else x.m.dispose(); this.mats.delete(k); } m3[slot] = undefined; });
        this.copiarMaterial(c, temCor); c.q = this.quadro;
        this.melhorar?.(m, m3, obj);
      }
      m3[slot] = c;
    }
    if (c.q !== this.quadro) { c.q = this.quadro; this.copiarMaterial(c, temCor); }
    return c.m;
  }
  private copiarMaterial(c: { m: StandardMaterial; src: T3; v: string }, temCor: boolean) {
    const s = c.src, m = c.m;
    // assinatura sem montar texto: compara os valores um por um com os do último quadro
    const a = (c as any).a || ((c as any).a = new Array(16).fill(NaN)); const cc = s.color, ee = s.emissive, mp = s.map;
    const v0 = s.version, v1 = s.opacity, v2 = cc ? cc.r : -1, v3 = cc ? cc.g : -1, v4 = cc ? cc.b : -1, v5 = ee ? ee.r : -1, v6 = ee ? ee.g : -1, v7 = ee ? ee.b : -1, v8 = s.emissiveIntensity, v9 = s.transparent, v10 = s.blending, v11 = s.depthWrite, v12 = s.side, v13 = s.visible, v14 = mp ? mp.version : -1, v15 = mp;
    if (a[0] === v0 && a[1] === v1 && a[2] === v2 && a[3] === v3 && a[4] === v4 && a[5] === v5 && a[6] === v6 && a[7] === v7 && a[8] === v8 && a[9] === v9 && a[10] === v10 && a[11] === v11 && a[12] === v12 && a[13] === v13 && a[14] === v14 && a[15] === v15) return;
    a[0] = v0; a[1] = v1; a[2] = v2; a[3] = v3; a[4] = v4; a[5] = v5; a[6] = v6; a[7] = v7; a[8] = v8; a[9] = v9; a[10] = v10; a[11] = v11; a[12] = v12; a[13] = v13; a[14] = v14; a[15] = v15;
    const basico = s.type === 'MeshBasicMaterial' || s.type === 'SpriteMaterial' || s.type === 'PointsMaterial' || s.type === 'LineBasicMaterial';
    const cor = s.color ? new Color3(s.color.r, s.color.g, s.color.b) : new Color3(1, 1, 1);
    const tx = this.textura(s.map);
    if (basico) {
      // sem iluminação: cor × textura (como o MeshBasicMaterial do three). No Babylon, com a luz desligada,
      // o resultado é (cor emissiva) × (textura difusa), por isso a cor vai no emissivo e a imagem no difuso
      m.disableLighting = true; m.diffuseColor = Color3.Black(); m.diffuseTexture = tx; m.emissiveTexture = null; m.emissiveColor = cor; m.metadata = Object.assign(m.metadata || {}, { corBasica: cor });
      if (tx && tx.hasAlpha === false) tx.hasAlpha = true;
    } else {
      m.disableLighting = false; m.diffuseColor = cor; m.diffuseTexture = tx || m.metadata?.texDet || null;
      const em = s.emissive ? new Color3(s.emissive.r, s.emissive.g, s.emissive.b).scale(s.emissiveIntensity ?? 1) : Color3.Black();
      if (!m.metadata?.emissivoProprio) m.emissiveColor = em;
    }
    if (tx && s.map && s.map.format === 1023) tx.hasAlpha = true; // RGBA
    m.alpha = s.transparent ? s.opacity : 1;
    if (s.transparent && tx) m.useAlphaFromDiffuseTexture = true;
    if (s.alphaTest > 0 && tx) { tx.hasAlpha = true; m.transparencyMode = Material.MATERIAL_ALPHATEST; m.alphaCutOff = s.alphaTest; }
    m.alphaMode = s.blending === 2 ? Constants.ALPHA_ADD : Constants.ALPHA_COMBINE;
    m.disableDepthWrite = s.depthWrite === false;
    // lados: 0 frente (padrão) · 1 só o verso (contorno preto dos personagens) · 2 os dois
    // (no modo de mão direita do Babylon o lado "de trás" fica invertido, por isso a comparação é ao contrário)
    m.backFaceCulling = s.side !== 2; m.cullBackFaces = s.side === 1;
    m.wireframe = !!s.wireframe;
    m.fogEnabled = s.fog !== false;
    if (s.type === 'PointsMaterial') { m.pointsCloud = true; m.pointSize = Math.max(1, (s.size || 1) * 2); }
    if (!temCor) m.metadata = Object.assign(m.metadata || {}, { semCor: true });
  }

  // ---------- geometrias ----------
  geometria(g3: T3, mesh: Mesh): { temCor: boolean } {
    const at = g3.attributes; const v = (at.position.version || 0) + (at.normal ? at.normal.version : 0) * 1e-3 + (at.color ? at.color.version : 0) * 1e-6 + (g3.index ? g3.index.version : 0) * 1e-9;
    let c = this.geos.get(g3);
    if (c && c.v === v) { if (mesh.geometry !== c.g) c.g.applyToMesh(mesh); return c; } // sem criar objeto novo a cada chamada (menos lixo na memória)
    const vd = new VertexData();
    const pos = at.position; const n = pos.count;
    vd.positions = pos.isInterleavedBufferAttribute ? Array.from({ length: n * 3 }, (_, i) => pos.getComponent ? pos.getComponent(Math.floor(i / 3), i % 3) : [pos.getX, pos.getY, pos.getZ][i % 3].call(pos, Math.floor(i / 3))) : (pos.array.length === n * 3 ? pos.array : Array.from(pos.array).slice(0, n * 3));
    if (at.normal) vd.normals = at.normal.array.length === n * 3 ? at.normal.array : null as any;
    if (at.uv) vd.uvs = at.uv.array;
    let temCor = false;
    if (at.color) { const a = at.color.array, sz = at.color.itemSize; const col = new Float32Array(n * 4); for (let i = 0; i < n; i++) { col[i * 4] = a[i * sz]; col[i * 4 + 1] = a[i * sz + 1]; col[i * 4 + 2] = a[i * sz + 2]; col[i * 4 + 3] = sz === 4 ? a[i * sz + 3] : 1; } vd.colors = col; temCor = true; }
    if (g3.index) vd.indices = g3.index.array; else { const ix = new Uint32Array(n); for (let i = 0; i < n; i++) ix[i] = i; vd.indices = ix; }
    if (!vd.normals) { const nn: number[] = []; VertexData.ComputeNormals(vd.positions as any, vd.indices as any, nn); vd.normals = nn; }
    { const P = vd.positions as any, N = vd.normals as any, U = new Float32Array(n * 2), k = 1 / 2.2;
      for (let i = 0; i < n; i++) { const nx = Math.abs(N[i * 3]), ny = Math.abs(N[i * 3 + 1]), nz = Math.abs(N[i * 3 + 2]); const x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2];
        if (ny >= nx && ny >= nz) { U[i * 2] = x * k; U[i * 2 + 1] = z * k; } else if (nx >= nz) { U[i * 2] = z * k; U[i * 2 + 1] = y * k; } else { U[i * 2] = x * k; U[i * 2 + 1] = y * k; } }
      vd.uvs2 = U; }
    if (c) { // atualização (efeitos que mexem nos vértices)
      const g = c.g; const tot = g.getTotalVertices();
      if (tot === n && g.getTotalIndices() === vd.indices!.length) {
        g.setVerticesData(VertexBuffer.PositionKind, vd.positions as any, true); if (vd.normals) g.setVerticesData(VertexBuffer.NormalKind, vd.normals as any, true);
        if (vd.colors) g.setVerticesData(VertexBuffer.ColorKind, vd.colors as any, true); if (vd.uvs) g.setVerticesData(VertexBuffer.UVKind, vd.uvs as any, true);
        if (g3.index && g3.index.version) g.setIndices(vd.indices as any, n, true);
      } else { g.setAllVerticesData(vd, true); }
      c.v = v; c.temCor = temCor; if (mesh.geometry !== g) g.applyToMesh(mesh); return { temCor };
    }
    const g = new Geometry('g3', this.s, vd, true);
    this.geos.set(g3, { g, v, temCor, n });
    if (g3.addEventListener) g3.addEventListener('dispose', () => { const x = this.geos.get(g3); if (x) { this.geos.delete(g3); setTimeout(() => { try { if (!x.g.meshes.length) x.g.dispose(); } catch { /* já liberada */ } }, 0); } });
    g.applyToMesh(mesh);
    return { temCor };
  }

  // ---------- objetos ----------
  objeto(o: T3, mundo: Float32Array): Rep | null {
    let r = this.reps.get(o);
    const tipo = o.isSprite ? 'sprite' : o.isPoints ? 'pontos' : o.isLine ? 'linha' : o.isSkinnedMesh ? 'pele' : o.isMesh ? 'malha' : '';
    if (!tipo) return null;
    if (!r) {
      let b: AbstractMesh;
      if (tipo === 'sprite') { b = CreatePlane('sprite', { size: 1 }, this.s); (b as Mesh).billboardMode = Mesh.BILLBOARDMODE_ALL; }
      else if (tipo === 'linha') { const p = o.geometry.attributes.position.array; const L: any[] = []; for (let i = 0; i + 5 < p.length; i += 6) L.push([{ x: p[i], y: p[i + 1], z: p[i + 2] }, { x: p[i + 3], y: p[i + 4], z: p[i + 5] }]); b = CreateLineSystem('linha', { lines: L as any }, this.s); const c = o.material && o.material.color; if (c) (b as LinesMesh).color = new Color3(c.r, c.g, c.b); }
      else { b = new Mesh(tipo, this.s); }
      b.isPickable = false; b.doNotSyncBoundingInfo = false;
      r = { b, visto: 0, m: new Float32Array(16), tipo, mat: null, geo: null, geoV: -1, matV: -1 };
      this.reps.set(o, r); this.stats.novos++;
      if ((o.castShadow) && this.sombraAdd && tipo !== 'sprite' && tipo !== 'linha') this.sombraAdd(b);
      // melhoria: toda superfície sólida e iluminada recebe sombra (no jogo original só algumas recebiam)
      const m0 = Array.isArray(o.material) ? o.material[0] : o.material;
      b.receiveShadows = !!o.receiveShadow || !!(m0 && !m0.transparent && (m0.type === 'MeshToonMaterial' || m0.type === 'MeshLambertMaterial' || m0.type === 'MeshStandardMaterial' || m0.type === 'MeshPhongMaterial'));
    }
    r.visto = this.quadro;
    if (!r.b.isEnabled(false)) r.b.setEnabled(true);
    // geometria + material
    if (tipo === 'malha' || tipo === 'pele' || tipo === 'pontos') {
      const mesh = r.b as Mesh; let temCor = false;
      if (tipo === 'pele') temCor = this.pele(o, mesh).temCor; else temCor = this.geometria(o.geometry, mesh).temCor;
      const m3 = Array.isArray(o.material) ? o.material[0] : o.material;
      const usaCor = temCor && !!(m3 && m3.vertexColors);
      // otimização: só mexe quando muda (cada troca marca o material como 'sujo' e o Babylon recalcula tudo)
      if (mesh.useVertexColors !== usaCor) mesh.useVertexColors = usaCor; if (mesh.hasVertexAlpha) mesh.hasVertexAlpha = false;
      if (m3) { const bm = this.material(m3, usaCor, o); if (mesh.material !== bm) mesh.material = bm; const vv = m3.visible === false ? 0 : 1; if (mesh.visibility !== vv) mesh.visibility = vv; }
      const dr = o.geometry.drawRange; if (dr && (dr.start > 0 || dr.count !== Infinity) && mesh.subMeshes && mesh.subMeshes[0]) { const tot = mesh.getTotalIndices(); const cnt = Math.min(tot - dr.start, dr.count === Infinity ? tot : dr.count); mesh.subMeshes[0].indexStart = dr.start; mesh.subMeshes[0].indexCount = Math.max(0, cnt); }
      if (o.renderOrder && mesh.alphaIndex !== o.renderOrder) mesh.alphaIndex = o.renderOrder;
      const bmat = mesh.material as StandardMaterial;
      if (bmat && bmat.alphaMode === Constants.ALPHA_ADD && bmat.alpha > 0.05) { const e = o.matrixWorld.elements; const sc = Math.hypot(e[0], e[1], e[2]); const gs = o.geometry.boundingSphere || (o.geometry.computeBoundingSphere(), o.geometry.boundingSphere);
        this.efeitos.push({ x: e[12], y: e[13], z: e[14], r: Math.min(6, (gs ? gs.radius : 0.5) * sc), c: (bmat.metadata && bmat.metadata.corBasica) || bmat.emissiveColor, novo: r.visto === this.quadro && r.geoV === -1 }); r.geoV = 0; }
    } else if (tipo === 'sprite') {
      const bm = this.material(o.material, false, o); if (r.b.material !== bm) r.b.material = bm;
    }
    // posição/rotação/escala: a matriz do mundo do three vai direto (os dois usam mão direita)
    let mudou = false; const e = o.matrixWorld.elements; const m = r.m;
    for (let i = 0; i < 16; i++) if (m[i] !== e[i]) { mudou = true; m[i] = e[i]; }
    if (mudou) {
      if (tipo === 'sprite') { r.b.position.set(e[12], e[13], e[14]); r.b.scaling.set(Math.hypot(e[0], e[1], e[2]), Math.hypot(e[4], e[5], e[6]), 1); }
      else r.b.freezeWorldMatrix(Matrix.FromArray(m));
    }
    void mundo;
    return r;
  }

  // malha com esqueleto: calcula a pose no processador (poucos modelos na tela)
  private pele(o: T3, mesh: Mesh) {
    const g3 = o.geometry; const pos = g3.attributes.position; const n = pos.count;
    const c = this.geometria(g3, mesh);
    if (!o.boneTransform || !o.skeleton) return c;
    o.skeleton.update();
    const T = (window as any).THREE; const v = new T.Vector3(); const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { o.boneTransform(i, v); out[i * 3] = v.x; out[i * 3 + 1] = v.y; out[i * 3 + 2] = v.z; }
    // boneTransform (r128) devolve a posição no espaço do próprio objeto; a matriz do mundo é aplicada depois
    mesh.setVerticesData(VertexBuffer.PositionKind, out, true);
    return c;
  }

  /** esconde o que não apareceu neste quadro e libera o que sumiu há muito tempo */
  fim() {
    let ativos = 0;
    for (const [o, r] of this.reps) {
      if (r.visto === this.quadro) { ativos++; continue; }
      if (r.b.isEnabled(false)) r.b.setEnabled(false);
      if (this.quadro - r.visto > 600 && !o.parent) { this.sombraRem?.(r.b); r.b.dispose(false, false); this.reps.delete(o); this.stats.liberados++; }
    }
    this.stats.malhas = ativos; this.stats.objetos = this.reps.size;
  }
  get totalTexturas() { return this.texs.size; }
  get totalGeometrias() { return this.geos.size; }
}
export { Engine };
