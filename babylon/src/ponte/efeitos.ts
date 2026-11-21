// Efeitos das magias feitos direto no Babylon (fase 1): a onda de choque "kShock".
// É o efeito mais usado do jogo (266 lugares no código: golpes, magias, impactos, chefes, formas).
// Antes: cada onda criava no three.js 2 formas novas (anel de 64 lados + disco) e 2 materiais novos, que a ponte
// precisava converter para o Babylon e depois jogar fora — trabalho e lixo na memória a cada golpe.
// Agora: um conjunto fixo de anéis já prontos no Babylon é reaproveitado (nada é criado nem apagado durante a luta).
// O desenho e o tempo são os mesmos do jogo (mesma cor, tamanho, duração e altura); a lógica das magias não muda.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { Constants } from '@babylonjs/core/Engines/constants';

type T3 = any;
interface Onda { anel: Mesh; disco: Mesh; mA: StandardMaterial; mD: StandardMaterial; x: number; z: number; y: number; R: number; dur: number; t: number; ativo: boolean; }

export class Efeitos {
  private ondas: Onda[] = []; private orig: T3 = null; ligado = false; usadas = 0; /** faíscas do começo de cada onda (a ponte junta com as outras faíscas de magia) */ pendentes: { x: number; y: number; z: number; r: number; c: Color3; novo: boolean }[] = [];
  constructor(private s: Scene, private ativo: () => boolean) {
    // anel (tubo fino) e disco vazado, iguais aos do jogo: TorusGeometry(1, .06, 6, 64) e RingGeometry(.8, 1, 64)
    const baseA = CreateTorus('ondaAnel', { diameter: 2, thickness: 0.12, tessellation: 64 }, s); baseA.setEnabled(false);
    // anel chato de 0,8 a 1 (como o RingGeometry do jogo), já deitado no chão
    const baseD = new Mesh('ondaDisco', s); { const P: number[] = [], I: number[] = [], N: number[] = []; const n = 64;
      for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, c = Math.cos(a), sn = Math.sin(a); P.push(c * 0.8, 0, sn * 0.8, c, 0, sn); N.push(0, 1, 0, 0, 1, 0); }
      for (let i = 0; i < n; i++) { const k = i * 2; I.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
      const vd = new VertexData(); vd.positions = P; vd.indices = I; vd.normals = N; vd.applyToMesh(baseD); }
    baseD.setEnabled(false);
    for (let i = 0; i < 40; i++) {
      const mA = new StandardMaterial('onda' + i, s); mA.disableLighting = true; mA.diffuseColor = Color3.Black(); mA.alphaMode = Constants.ALPHA_ADD; mA.disableDepthWrite = true; mA.backFaceCulling = false; mA.metadata = { brilha: true, corBasica: new Color3(1, 1, 1) };
      const mD = mA.clone('ondaD' + i); mD.metadata = { brilha: true, corBasica: new Color3(1, 1, 1) };
      const anel = baseA.clone('ondaA' + i, null, true)!; anel.material = mA; anel.isPickable = false; anel.setEnabled(false);
      const disco = baseD.clone('ondaD' + i, null, true)!; disco.material = mD; disco.isPickable = false; disco.setEnabled(false);
      this.ondas.push({ anel, disco, mA, mD, x: 0, z: 0, y: 0.3, R: 1, dur: 0.5, t: 0, ativo: false });
    }
    this.ligar();
  }
  /** o jogo passa a chamar a onda nova (se a ponte desligar, volta a usar a antiga) */
  private ligar() {
    const w = window as any; if (typeof w.kShock !== 'function' || w.kShock.__babylon) return; this.orig = w.kShock; const self = this;
    const nova = function (x: number, z: number, R: number, col: number, dur: number, y?: number) {
      if (!self.ativo()) return self.orig(x, z, R, col, dur, y);
      try { self.onda(x, z, R, col, dur, y); } catch { return self.orig(x, z, R, col, dur, y); }
    };
    (nova as any).__babylon = 1; w.kShock = nova; this.ligado = true;
  }
  onda(x: number, z: number, R: number, col: number, dur: number, y?: number) {
    let o = this.ondas.find(k => !k.ativo); if (!o) o = this.ondas.reduce((a, b) => (a.t / a.dur > b.t / b.dur ? a : b)); // todas ocupadas: reaproveita a mais antiga
    const c = typeof col === 'number' ? new Color3(((col >> 16) & 255) / 255, ((col >> 8) & 255) / 255, (col & 255) / 255) : new Color3(1, 1, 1);
    o.mA.emissiveColor = c; o.mD.emissiveColor = c; o.mA.metadata.corBasica = c; o.mD.metadata.corBasica = c;
    o.x = x; o.z = z; o.y = y || 0.3; o.R = R || 1; o.dur = Math.max(0.05, dur || 0.5); o.t = 0; o.ativo = true; this.usadas++;
    if (this.pendentes.length < 24) this.pendentes.push({ x, y: o.y + 0.2, z, r: Math.min(3, o.R * 0.5), c, novo: true });
    this.passo(o, 0);
  }
  private passo(o: Onda, dt: number) {
    o.t += dt; const u = o.t / o.dur; if (u >= 1) { o.ativo = false; o.anel.setEnabled(false); o.disco.setEnabled(false); return; }
    const s = 0.5 + o.R * Math.pow(u, 0.6);
    o.anel.position.set(o.x, o.y + u * 0.4, o.z); o.anel.scaling.setAll(s); o.mA.alpha = 0.9 * (1 - u);
    o.disco.position.set(o.x, o.y - 0.2, o.z); o.disco.scaling.setAll(s); o.mD.alpha = 0.35 * (1 - u);
    if (!o.anel.isEnabled(false)) { o.anel.setEnabled(true); o.disco.setEnabled(true); }
  }
  atualizar(dt: number) {
    if (!this.ligado) this.ligar();
    for (const o of this.ondas) if (o.ativo) this.passo(o, dt);
  }
  get info() { return { ligado: this.ligado, usadas: this.usadas, ativas: this.ondas.filter(o => o.ativo).length }; }
}
