// Água e vegetação: lagos, rio e mar com ondas animadas, brilho do sol e transparência;
// vento balançando a grama e as copas das árvores/arbustos (só as partes verdes e altas, o tronco fica parado).
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Material } from '@babylonjs/core/Materials/material';
import { MaterialPluginBase } from '@babylonjs/core/Materials/materialPluginBase';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { UniformBuffer } from '@babylonjs/core/Materials/uniformBuffer';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

// ---------- vento (deslocamento no vertex shader, sem custo no processador) ----------
export class VentoPlugin extends MaterialPluginBase {
  static tempo = 0; static forca = 1;
  private _on = false; private grama: boolean;
  constructor(m: Material, grama = false) { super(m, 'Vento', 200, { VENTO: false, VENTO_GRAMA: false }); this.grama = grama; this._enable(true); this._on = true; }
  prepareDefines(defines: any) { defines.VENTO = this._on && VentoPlugin.forca > 0; defines.VENTO_GRAMA = this.grama; }
  getClassName() { return 'VentoPlugin'; }
  getUniforms() { return { ubo: [{ name: 'ventoT', size: 1, type: 'float' }, { name: 'ventoF', size: 1, type: 'float' }, { name: 'ventoM', size: 1, type: 'float' }], vertex: 'uniform float ventoT; uniform float ventoF; uniform float ventoM;' }; }
  bindForSubMesh(ubo: UniformBuffer) { ubo.updateFloat('ventoT', VentoPlugin.tempo); ubo.updateFloat('ventoF', VentoPlugin.forca);
    // peso do próprio material (folhagem verde sem cores por vértice)
    const m = this._material as StandardMaterial; const c = (m.metadata && m.metadata.corOrig) || m.diffuseColor; ubo.updateFloat('ventoM', c ? Math.max(0, Math.min(1, (c.g - Math.max(c.r, c.b)) * 5)) : 0); }
  getCustomCode(tipo: string): any {
    if (tipo !== 'vertex') return null;
    return {
      CUSTOM_VERTEX_UPDATE_WORLDPOS: `
#ifdef VENTO
  float vPeso = 0.0;
  #ifdef VENTO_GRAMA
    vPeso = clamp(positionUpdated.y * 2.2, 0.0, 1.0) * 0.16;
  #else
    vPeso = clamp((worldPos.y - 1.2) / 4.0, 0.0, 1.0) * 0.09;
    #ifdef VERTEXCOLOR
      vPeso *= clamp((color.g - max(color.r, color.b)) * 5.0, 0.0, 1.0);
    #else
      vPeso *= ventoM;
    #endif
  #endif
  float vOnda = sin(ventoT * 1.7 + worldPos.x * 0.35 + worldPos.z * 0.22) + 0.45 * sin(ventoT * 3.1 + worldPos.x * 0.9);
  worldPos.x += vOnda * vPeso * ventoF;
  worldPos.z += cos(ventoT * 1.3 + worldPos.z * 0.3) * vPeso * 0.6 * ventoF;
#endif
`,
    };
  }
}

// ---------- água ----------
function texOndas(s: Scene) {
  // mapa de relevo das ondas (ruído suave que repete nas bordas)
  const N = 256; const t = new DynamicTexture('ondas', N, s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
  const img = c.createImageData(N, N); const h = new Float32Array(N * N);
  const ondas: [number, number, number, number][] = []; for (let i = 0; i < 14; i++) ondas.push([1 + Math.floor(Math.random() * 6), Math.floor(Math.random() * 7) - 3, Math.random() * 6.283, 0.4 + Math.random()]);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let v = 0; for (const [a, b, f, w] of ondas) v += Math.sin((a * x + b * y) / N * 6.283 + f) * w / Math.max(1, Math.hypot(a, b)); h[y * N + x] = v; }
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = h[y * N + ((x + 1) % N)] - h[y * N + ((x + N - 1) % N)], dy = h[((y + 1) % N) * N + x] - h[((y + N - 1) % N) * N + x];
    const nx = -dx * 1.6, ny = -dy * 1.6, nz = 1; const l = Math.hypot(nx, ny, nz); const k = (y * N + x) * 4;
    img.data[k] = (nx / l * 0.5 + 0.5) * 255; img.data[k + 1] = (ny / l * 0.5 + 0.5) * 255; img.data[k + 2] = (nz / l * 0.5 + 0.5) * 255; img.data[k + 3] = 255;
  }
  c.putImageData(img, 0, 0); t.update(false); t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; return t;
}

export class Natureza {
  private agua: Mesh | null = null; private mat: StandardMaterial | null = null; private bump: DynamicTexture | null = null; private feito = false; private t = 0;
  private plugados = new WeakSet<Material>(); private q = 0;
  constructor(private s: Scene) {}
  private criarAgua() {
    const W: T3[] = jogo('WATER83'), inW = jogo('inWater83'); if (!W || !inW) return; this.feito = true;
    const P: number[] = [], I: number[] = [], U: number[] = []; let n = 0; const Y = 0.11;
    const tri = (ax: number, az: number, bx: number, bz: number, cx: number, cz: number) => { if (!inW((ax + bx + cx) / 3, (az + bz + cz) / 3)) return; P.push(ax, Y, az, bx, Y, bz, cx, Y, cz); U.push(ax / 9, az / 9, bx / 9, bz / 9, cx / 9, cz / 9); I.push(n, n + 1, n + 2); n += 3; };
    const quad = (xa: number, za: number, xb: number, zb: number) => { tri(xa, za, xb, zb, xb, za); tri(xa, za, xa, zb, xb, zb); };
    for (const o of W) {
      if (o.t === 'c') { // lago redondo: anéis e fatias, margem lisa
        const seg = Math.max(32, Math.round(o.r * 3)), an = Math.max(3, Math.round(o.r / 2));
        for (let i = 0; i < an; i++) { const r0 = o.r * i / an, r1 = o.r * (i + 1) / an; for (let k = 0; k < seg; k++) { const a0 = k / seg * 6.2832, a1 = (k + 1) / seg * 6.2832;
          const p = (r: number, a: number) => [o.x + Math.cos(a) * r, o.z + Math.sin(a) * r];
          const [x00, z00] = p(r0, a0), [x01, z01] = p(r0, a1), [x10, z10] = p(r1, a0), [x11, z11] = p(r1, a1); tri(x00, z00, x11, z11, x10, z10); if (i) tri(x00, z00, x01, z01, x11, z11); } }
      } else { // mar/rio: grade de 2 m, e 0,5 m perto da terra para a margem ficar lisa
        for (let x = o.x0; x < o.x1; x += 4) for (let z = o.z0; z < o.z1; z += 4) { const xb = Math.min(o.x1, x + 4), zb = Math.min(o.z1, z + 4);
          const c = [inW(x, z), inW(xb, z), inW(x, zb), inW(xb, zb), inW((x + xb) / 2, (z + zb) / 2)]; const t = c.filter(Boolean).length;
          if (t === 5) quad(x, z, xb, zb); else if (t > 0 || inW(x + 1, z + 1) || inW(x + 3, z + 3)) for (let u = x; u < xb; u += 0.8) for (let v = z; v < zb; v += 0.8) quad(u, v, Math.min(xb, u + 0.8), Math.min(zb, v + 0.8)); }
      }
    }
    if (!n) return;
    const N: number[] = []; for (let i = 0; i < n; i++) N.push(0, 1, 0);
    const m = new Mesh('agua3d', this.s); const vd = new VertexData(); vd.positions = P; vd.indices = I; vd.normals = N; vd.uvs = U; vd.applyToMesh(m);
    const mat = this.mat = new StandardMaterial('agua3d', this.s); this.bump = texOndas(this.s); mat.bumpTexture = this.bump; mat.bumpTexture.level = 0.55;
    mat.diffuseColor = new Color3(0.1, 0.33, 0.52); mat.specularColor = new Color3(1, 0.97, 0.9); mat.specularPower = 180; mat.emissiveColor = new Color3(0.03, 0.09, 0.14);
    mat.alpha = 0.84; mat.backFaceCulling = false; mat.useReflectionFresnelFromSpecular = false;
    m.material = mat; m.isPickable = false; m.receiveShadows = true; m.freezeWorldMatrix(); m.alwaysSelectAsActiveMesh = false;
    this.agua = m;
  }
  atualizar(dt: number, nivel: string, grama: Material | null) {
    this.t += dt; VentoPlugin.tempo = this.t;
    VentoPlugin.forca = nivel === 'muitobaixo' ? 0 : nivel === 'baixo' ? 0.6 : 1;
    if (!this.feito) this.criarAgua();
    if (this.agua && this.bump) {
      this.agua.setEnabled(true); const b = this.bump; b.uOffset = (this.t * 0.012) % 1; b.vOffset = (this.t * 0.008) % 1;
      if (this.mat) this.mat.bumpTexture!.level = nivel === 'muitobaixo' || nivel === 'baixo' ? 0.35 : 0.55;
    }
    // vento: grama e cenário (meio segundo entre verificações)
    if (++this.q % 30 === 1 && nivel !== 'muitobaixo') {
      if (grama && !this.plugados.has(grama)) { new VentoPlugin(grama, true); this.plugados.add(grama); }
      for (const m of this.s.materials) if (!this.plugados.has(m) && m.metadata && m.metadata.cat && m instanceof StandardMaterial) { new VentoPlugin(m, false); this.plugados.add(m); }
    }
  }
  get aguaVertices() { return this.agua ? this.agua.getTotalVertices() : 0; }
}
