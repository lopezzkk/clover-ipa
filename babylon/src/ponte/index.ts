// Ponte do Babylon.js para o Clover RP: o jogo inteiro continua igual (lógica, menus, magias, online);
// só o desenho da tela passa a ser feito pelo Babylon.js, com sombras, céu, brilho e pós-processamento.
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { TargetCamera } from '@babylonjs/core/Cameras/targetCamera';
import { Vector3, Quaternion } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { DefaultRenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline';
import { SSAO2RenderingPipeline } from '@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/ssao2RenderingPipeline';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { Constants } from '@babylonjs/core/Engines/constants';
import { Light } from '@babylonjs/core/Lights/light';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent';
import '@babylonjs/core/Layers/effectLayerSceneComponent';
import '@babylonjs/core/Rendering/depthRendererSceneComponent';
import '@babylonjs/core/Rendering/geometryBufferRendererSceneComponent';
import '@babylonjs/core/Rendering/prePassRendererSceneComponent';
import '@babylonjs/core/PostProcesses/RenderPipeline/postProcessRenderPipelineManagerSceneComponent';
import '@babylonjs/core/Meshes/thinInstanceMesh';
import { SkyMaterial } from '@babylonjs/materials/sky/skyMaterial';
import { Tradutor } from './tradutor';
import { melhorarMaterial, ajustarCena, Grama } from './visual';

type T3 = any;
type Nivel = 'muitobaixo' | 'baixo' | 'medio' | 'alto' | 'ultra';

class Ponte {
  ativo = true; pronto = false;
  engine!: Engine; scene!: Scene; cam!: TargetCamera; tr!: Tradutor;
  private luzes = new Map<T3, Light>(); private sombra: ShadowGenerator | null = null; private pipe: DefaultRenderingPipeline | null = null; private ssao: SSAO2RenderingPipeline | null = null; private glow: GlowLayer | null = null;
  private raioSombra = 40; private ceu!: AbstractMesh; private nivel: Nivel | '' = ''; private q = 0; private w = 0; private h = 0; private casters = new Set<AbstractMesh>();
  ms = 0; erros = 0; grama!: Grama;

  private iniciar(R: T3) {
    const c3: HTMLCanvasElement = R.domElement;
    const cv = document.createElement('canvas'); cv.id = 'c-babylon';
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:' + (getComputedStyle(c3).zIndex === 'auto' ? '0' : getComputedStyle(c3).zIndex);
    c3.after(cv);
    const nv = this.lerNivel();
    this.engine = new Engine(cv, nv !== 'muitobaixo' && nv !== 'baixo', { stencil: true, preserveDrawingBuffer: false, powerPreference: 'high-performance', adaptToDeviceRatio: false, doNotHandleContextLost: false });
    const s = this.scene = new Scene(this.engine);
    s.useRightHandedSystem = true; s.skipPointerMovePicking = true; s.blockMaterialDirtyMechanism = false;
    s.ambientColor = new Color3(0.2, 0.2, 0.22);
    this.cam = new TargetCamera('cam3', new Vector3(0, 5, 10), s); this.cam.rotationQuaternion = new Quaternion();
    this.tr = new Tradutor(s);
    this.tr.sombraAdd = m => { this.casters.add(m); this.sombra?.addShadowCaster(m, false); };
    this.tr.sombraRem = m => { this.casters.delete(m); this.sombra?.removeShadowCaster(m, false); };
    this.tr.melhorar = (b, src, obj) => melhorarMaterial(this.scene, b, src, obj);
    // céu
    this.ceu = CreateBox('ceu', { size: 3000 }, s); const sm = new SkyMaterial('ceu', s); sm.backFaceCulling = false; sm.turbidity = 5; sm.luminance = 1; sm.rayleigh = 1.4; sm.mieCoefficient = 0.004; sm.useSunPosition = true; sm.sunPosition = new Vector3(100, 140, 60);
    this.ceu.material = sm; this.ceu.infiniteDistance = true; this.ceu.isPickable = false; this.ceu.applyFog = false;
    ajustarCena(s); this.grama = new Grama(s);
    this.pronto = true;
  }

  private lerNivel(): Nivel {
    const C = (0, eval)("typeof CFG!=='undefined'?CFG:{}") || {};
    if (C.perf) return 'muitobaixo'; if (C.ultra) return 'ultra';
    return C.gfx === 'baixo' ? 'baixo' : C.gfx === 'alto' ? 'alto' : 'medio';
  }

  private aplicarNivel(n: Nivel, R: T3) {
    this.nivel = n; const s = this.scene;
    this.engine.setHardwareScalingLevel(1 / Math.max(0.5, (R.getPixelRatio && R.getPixelRatio()) || 1));
    // sombras: em cascata (nítidas perto e alcance longo)
    if (this.sombra) { this.sombra.dispose(); this.sombra = null; }
    const sol = [...this.luzes.values()].find(l => l instanceof DirectionalLight) as DirectionalLight | undefined;
    if (sol && n !== 'muitobaixo') {
      const res = n === 'ultra' ? 4096 : n === 'alto' ? 2048 : n === 'medio' ? 2048 : 1024;
      // sombra que acompanha o jogador (como no jogo original): nítida perto, sem custo longe
      const g = new ShadowGenerator(res, sol); g.usePercentageCloserFiltering = true; g.filteringQuality = n === 'ultra' ? ShadowGenerator.QUALITY_HIGH : ShadowGenerator.QUALITY_MEDIUM;
      g.darkness = 0.12; g.bias = 0.0015; g.normalBias = 0.02; g.transparencyShadow = false;
      sol.autoUpdateExtends = false; sol.autoCalcShadowZBounds = false; this.raioSombra = n === 'ultra' || n === 'alto' ? 48 : 36;
      sol.orthoLeft = -this.raioSombra; sol.orthoRight = this.raioSombra; sol.orthoTop = this.raioSombra; sol.orthoBottom = -this.raioSombra; sol.shadowMinZ = 1; sol.shadowMaxZ = 400;
      for (const m of this.casters) g.addShadowCaster(m, false);
      this.sombra = g;
    }
    // brilho só nos efeitos de magia (materiais de soma de luz) e no que o jogo já marca como brilhante
    if (this.glow) { this.glow.dispose(); this.glow = null; }
    if (n !== 'muitobaixo') {
      const gl = new GlowLayer('brilho', s, { mainTextureRatio: n === 'baixo' ? 0.25 : 0.4, blurKernelSize: n === 'baixo' ? 16 : 32 }); gl.intensity = 0.55;
      gl.customEmissiveColorSelector = (mesh, _sub, mat, res) => { const m = mat as StandardMaterial; if (m && (m.alphaMode === Constants.ALPHA_ADD || m.metadata?.brilha)) res.set(m.emissiveColor.r * 0.45 * m.alpha, m.emissiveColor.g * 0.45 * m.alpha, m.emissiveColor.b * 0.45 * m.alpha, 1); else res.set(0, 0, 0, 0); void mesh; };
      this.glow = gl;
    }
    // pós-processamento
    if (this.pipe) { this.pipe.dispose(); this.pipe = null; } if (this.ssao) { this.ssao.dispose(); this.ssao = null; }
    const ip = s.imageProcessingConfiguration; ip.toneMappingEnabled = true; ip.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; ip.exposure = 1.25; ip.contrast = 1.06;
    if (n === 'medio' || n === 'alto' || n === 'ultra') {
      const p = new DefaultRenderingPipeline('pos', true, s, [this.cam]);
      p.fxaaEnabled = true; p.bloomEnabled = true; p.bloomThreshold = 0.9; p.bloomWeight = n === 'medio' ? 0.22 : 0.32; p.bloomKernel = 40; p.bloomScale = 0.5;
      p.imageProcessingEnabled = true; p.imageProcessing.toneMappingEnabled = true; p.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; p.imageProcessing.exposure = 1.25; p.imageProcessing.contrast = 1.08;
      p.imageProcessing.vignetteEnabled = true; p.imageProcessing.vignetteWeight = 0.9; p.imageProcessing.vignetteColor = new Color4(0.08, 0.05, 0.02, 0);
      if (n !== 'medio') { p.sharpenEnabled = true; p.sharpen.edgeAmount = 0.2; }
      this.pipe = p;
    }
    if (n === 'ultra') { const a = new SSAO2RenderingPipeline('ssao', s, { ssaoRatio: 0.5, blurRatio: 0.5 }, [this.cam]); a.radius = 1.6; a.totalStrength = 0.9; a.samples = 12; a.maxZ = 90; this.ssao = a; }
    this.ceu.setEnabled(n !== 'muitobaixo');
  }

  private luz(l3: T3) {
    let b = this.luzes.get(l3);
    if (!b) {
      if (l3.isDirectionalLight) b = new DirectionalLight('sol', new Vector3(0, -1, 0), this.scene);
      else if (l3.isHemisphereLight) b = new HemisphericLight('ceuLuz', new Vector3(0, 1, 0), this.scene);
      else if (l3.isPointLight) b = new PointLight('ponto', Vector3.Zero(), this.scene);
      else if (l3.isAmbientLight) { b = new HemisphericLight('amb', new Vector3(0, 1, 0), this.scene); }
      if (!b) return; this.luzes.set(l3, b); this.nivel = ''; // reaplica sombras
    }
    const c = l3.color; b.diffuse = new Color3(c.r, c.g, c.b); b.intensity = l3.intensity * (l3.isHemisphereLight ? 1.35 : l3.isDirectionalLight ? 1.7 : 1);
    b.setEnabled(l3.visible !== false);
    const e = l3.matrixWorld.elements;
    if (b instanceof DirectionalLight) { const t = l3.target; t.updateMatrixWorld(); const te = t.matrixWorld.elements; const d = new Vector3(te[12] - e[12], te[13] - e[13], te[14] - e[14]); if (d.lengthSquared() > 1e-6) b.direction = d.normalize(); const PJ = (0, eval)("typeof P!=='undefined'?P:null"); const cx = PJ ? PJ.x : e[12], cz = PJ ? PJ.z : e[14]; b.position = new Vector3(cx, 0, cz).subtract(b.direction.scale(200)); b.specular = new Color3(0.35, 0.33, 0.3); this.sol(b); }
    else if (b instanceof HemisphericLight) { if (l3.groundColor) b.groundColor = new Color3(l3.groundColor.r, l3.groundColor.g, l3.groundColor.b); else b.groundColor = b.diffuse.scale(0.5); b.specular = Color3.Black(); }
    else if (b instanceof PointLight) { b.position = new Vector3(e[12], e[13], e[14]); b.range = l3.distance || 30; b.specular = b.diffuse.scale(0.2); }
  }
  private sol(d: DirectionalLight) {
    const sm = this.ceu.material as SkyMaterial; const up = -d.direction.y;
    sm.sunPosition = d.direction.scale(-300); sm.luminance = Math.max(0.15, Math.min(1.1, 0.2 + up * 1.2)); sm.turbidity = up < 0.25 ? 8 : 5;
  }

  render(s3: T3, c3: T3, R: T3) {
    const t0 = performance.now();
    try {
      if (!this.pronto) this.iniciar(R);
      const tr = this.tr; tr.quadro++;
      s3.updateMatrixWorld(); if (c3.parent === null) c3.updateMatrixWorld();
      // tamanho da tela
      const cv = this.engine.getRenderingCanvas()!; if (cv.clientWidth !== this.w || cv.clientHeight !== this.h) { this.w = cv.clientWidth; this.h = cv.clientHeight; this.engine.resize(); }
      // câmera do jogo
      const e = c3.matrixWorld.elements; this.cam.position.set(e[12], e[13], e[14]);
      const q = new (window as any).THREE.Quaternion(); c3.getWorldQuaternion(q); this.cam.rotationQuaternion!.set(q.x, q.y, q.z, q.w);
      this.cam.fov = (c3.fov || 60) * Math.PI / 180; this.cam.minZ = c3.near || 0.1; this.cam.maxZ = c3.far || 2000;
      // fundo e névoa
      const bg = s3.background; if (bg && bg.isColor) this.scene.clearColor = new Color4(bg.r, bg.g, bg.b, 1);
      const f = s3.fog; if (f) { this.scene.fogColor = new Color3(f.color.r, f.color.g, f.color.b); if (f.isFogExp2) { this.scene.fogMode = Scene.FOGMODE_EXP2; this.scene.fogDensity = f.density; } else { this.scene.fogMode = Scene.FOGMODE_LINEAR; this.scene.fogStart = f.near; this.scene.fogEnd = f.far; } } else this.scene.fogMode = Scene.FOGMODE_NONE;
      // percorre a cena do jogo
      const mask = c3.layers ? c3.layers.mask : 1;
      const walk = (o: T3) => {
        if (o.visible === false) return;
        if (o.isLight) this.luz(o);
        else if ((o.layers.mask & mask) !== 0 && (o.isMesh || o.isSprite || o.isPoints || o.isLine)) tr.objeto(o, o.matrixWorld.elements);
        const ch = o.children; for (let i = 0; i < ch.length; i++) walk(ch[i]);
      };
      walk(s3);
      tr.fim();
      if (t0 - this.q > 500) { this.q = t0; const n = this.lerNivel(); if (n !== this.nivel) this.aplicarNivel(n, R); }
      const gq: Record<string, [number, number]> = { muitobaixo: [0, 0], baixo: [0, 0], medio: [32, 110], alto: [48, 160], ultra: [64, 240] }; const g = gq[this.nivel || 'medio']; this.grama.atualizar(g[0], g[1]);
      this.engine.beginFrame(); this.scene.render(); this.engine.endFrame();
    } catch (err) {
      // se algo der errado na ponte, o jogo volta a desenhar com o three.js (nada trava)
      this.erros++; console.error('[Ponte Babylon]', err);
      if (this.erros > 5) { this.ativo = false; const cv = document.getElementById('c-babylon'); if (cv) cv.style.display = 'none'; }
    }
    this.ms = this.ms * 0.9 + (performance.now() - t0) * 0.1;
  }
  /** teste: esfera flutuando ao lado do jogador e um chão de teste, para conferir as sombras */
  sondaSombra(x: number, z: number) {
    const sp = CreateSphere('sonda', { diameter: 2 }, this.scene); sp.position.set(x + 3, 3, z); const m = new StandardMaterial('sondaM', this.scene); m.diffuseColor = new Color3(1, 0.2, 0.2); sp.material = m;
    const gr = CreateGround('sondaChao', { width: 12, height: 12 }, this.scene); gr.position.set(x + 3, 0.3, z); const mg = new StandardMaterial('sondaG', this.scene); mg.diffuseColor = new Color3(0.9, 0.9, 0.9); gr.material = mg; gr.receiveShadows = true;
    this.sombra?.addShadowCaster(sp); return { sombra: !!this.sombra, lista: this.sombra?.getShadowMap()?.renderList?.length, luz: this.sombra?.getLight().name };
  }
  info() { return { ativo: this.ativo, nivel: this.nivel, ms: +this.ms.toFixed(2), desenhos: this.engine ? (this.engine as any)._drawCalls?.current : 0, ...this.tr?.stats, texturas: this.tr?.totalTexturas, grama: this.grama?.total, sombra: this.sombra ? this.sombra.getShadowMap()!.renderList!.length : -1, geometrias: this.tr?.totalGeometrias, erros: this.erros }; }
}

(window as any).PONTE141 = new Ponte();
