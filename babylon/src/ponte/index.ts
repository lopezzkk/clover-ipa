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
import { melhorarMaterial, ajustarCena, Grama, Faiscas, texDetalhe } from './visual';
import { Mundo } from './mundo';
import { Interface } from './interface';
import { Vilas } from './vilas';
import { Castelos } from './castelos';
import { Interiores } from './interiores';
import { Clima } from './clima';
import { Efeitos } from './efeitos';
import { CenarioNativo } from './cenario';
import { Modelos } from './modelos';
import { Personagens } from './personagens';
import { Grimorios } from './grimorios';
import { Chefes } from './chefes';
import { Natureza } from './natureza';

type T3 = any;
import { alcanceDe } from './alcance';
type Nivel = 'muitobaixo' | 'baixo' | 'medio' | 'alto' | 'ultra';

class Ponte {
  ativo = true; pronto = false;
  engine!: Engine; scene!: Scene; cam!: TargetCamera; tr!: Tradutor;
  private luzes = new Map<T3, Light>(); private sombra: ShadowGenerator | null = null; private pipe: DefaultRenderingPipeline | null = null; private ssao: SSAO2RenderingPipeline | null = null; private glow: GlowLayer | null = null;
  private raioSombra = 40; private ceu!: AbstractMesh; private nivel: Nivel | '' = ''; private q = 0; private w = 0; private h = 0; private casters = new Set<AbstractMesh>();
  ms = 0; msSync = 0; erros = 0; grama!: Grama; faiscas!: Faiscas; pers!: Personagens; cortados = 0; desenhos = 0; perfil: Record<string, number> = {}; /** amostras sem média (para medir com precisão: PONTE141.bruto = {}) */ bruto: Record<string, number[]> | null = null; sombrasAtivas = 0; grim!: Grimorios; chefes!: Chefes; nat!: Natureza; mundo!: Mundo; ui!: Interface; vilas!: Vilas; castelos!: Castelos; interiores!: Interiores; clima!: Clima; efeitos!: Efeitos; cenario!: CenarioNativo; modelos!: Modelos; private tAnt = 0;

  private canvasPrincipal: HTMLCanvasElement | null = null; private pr = 1; private reserva: T3 = null;
  /** Motor Babylon como renderizador ÚNICO do jogo: o three.js não desenha mais nada (nem cria contexto WebGL).
   *  Devolve um objeto com a mesma "cara" do renderizador que o jogo usa (render, setSize, setPixelRatio, shadowMap...). */
  motor(cv: HTMLCanvasElement) {
    this.canvasPrincipal = cv; const self = this;
    const R: T3 = {
      babylon: true, domElement: cv, localClippingEnabled: false, autoClear: true,
      shadowMap: { enabled: true, autoUpdate: false, needsUpdate: false, type: 1 },
      capabilities: { isWebGL2: true, getMaxAnisotropy: () => 8, maxTextures: 16, precision: 'highp' },
      info: { render: { calls: 0, triangles: 0 }, memory: { geometries: 0, textures: 0 }, reset() {} },
      setPixelRatio(p: number) { self.pr = p || 1; if (self.engine) { self.engine.setHardwareScalingLevel(1 / self.pr); self.engine.resize(); } },
      getPixelRatio() { return self.pr; },
      setSize(_w: number, _h: number, _s?: boolean) { if (self.engine) self.engine.resize(); },
      getSize(v: T3) { const w = cv.clientWidth, h = cv.clientHeight; return v ? v.set(w, h) : { x: w, y: h, width: w, height: h }; },
      compile() {}, setClearColor() {}, clear() {}, dispose() {}, setAnimationLoop() {},
      getContext() { return self.engine ? (self.engine as any)._gl : null; },
      render(s: T3, c: T3) { if (self.ativo) { self.render(s, c, R); R.info.render.calls = self.desenhos; } else self.desenharReserva(s, c, R); },
    };
    return R;
  }
  /** segurança: se o Babylon falhar várias vezes, um renderizador three.js de reserva assume numa tela nova (o jogo não trava) */
  private desenharReserva(s: T3, c: T3, R: T3) {
    try {
      if (!this.reserva) { const T = (window as any).THREE; if (!T) return; const cv = document.createElement('canvas'); cv.id = 'c-reserva'; cv.style.cssText = getComputedStyle(R.domElement).cssText || 'position:fixed;inset:0;width:100%;height:100%';
        R.domElement.after(cv); R.domElement.style.visibility = 'hidden'; this.reserva = new T.WebGLRenderer({ canvas: cv, antialias: false }); this.reserva.setPixelRatio(this.pr); this.reserva.shadowMap.enabled = true; }
      this.reserva.setSize(R.domElement.clientWidth, R.domElement.clientHeight, false); this.reserva.render(s, c);
    } catch { /* sem reserva */ }
  }

  private iniciar(R: T3) {
    const c3: HTMLCanvasElement = R.domElement;
    let cv: HTMLCanvasElement;
    if (this.canvasPrincipal) cv = this.canvasPrincipal; // motor único: desenha direto na tela do jogo
    else { cv = document.createElement('canvas'); cv.id = 'c-babylon';
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;display:block;pointer-events:none;z-index:' + (getComputedStyle(c3).zIndex === 'auto' ? '0' : getComputedStyle(c3).zIndex);
      c3.after(cv); }
    const nv = this.lerNivel();
    this.engine = new Engine(cv, nv !== 'muitobaixo' && nv !== 'baixo', { stencil: true, preserveDrawingBuffer: false, powerPreference: 'high-performance', adaptToDeviceRatio: false, doNotHandleContextLost: false });
    if (this.canvasPrincipal) this.engine.setHardwareScalingLevel(1 / this.pr);
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
    ajustarCena(s); this.grama = new Grama(s); this.faiscas = new Faiscas(s);
    this.pers = new Personagens(s, m => this.tr.sombraAdd?.(m)); this.grim = new Grimorios(s); this.chefes = new Chefes(s); this.nat = new Natureza(s);
    this.mundo = new Mundo(s, m => this.tr.sombraAdd?.(m), m => this.tr.sombraRem?.(m), () => texDetalhe(s));
    this.ui = new Interface(s); this.vilas = new Vilas(s); this.castelos = new Castelos(s); this.interiores = new Interiores(s); this.clima = new Clima(s); this.efeitos = new Efeitos(s, () => this.ativo); this.cenario = new CenarioNativo(s, this.tr); this.modelos = new Modelos(s);
    this.interiores.vinheta = on => { const p = this.pipe as any; if (!p || !p.imageProcessing) return; p.imageProcessing.vignetteEnabled = on; p.imageProcessing.vignetteWeight = 4; p.imageProcessing.vignetteColor = new Color4(0, 0, 0, 0); };
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
      gl.customEmissiveColorSelector = (mesh, _sub, mat, res) => { const m = mat as StandardMaterial; const cc = (m && (m.metadata?.corBasica || m.emissiveColor)); if (m && (m.alphaMode === Constants.ALPHA_ADD || m.metadata?.brilha)) res.set(cc.r * 0.45 * m.alpha, cc.g * 0.45 * m.alpha, cc.b * 0.45 * m.alpha, 1); else res.set(0, 0, 0, 0); void mesh; };
      // otimização: a camada de brilho só desenha o que brilha (antes desenhava a cena inteira de novo, em preto)
      const so = (m: AbstractMesh) => { const mt = m.material as StandardMaterial; return !!mt && (mt.alphaMode === Constants.ALPHA_ADD || !!mt.metadata?.brilha); };
      (gl as any)._shouldRenderMesh = so; const thin = (gl as any)._thinEffectLayer; if (thin) { const orig = thin._shouldRenderMesh.bind(thin); thin._shouldRenderMesh = (m: AbstractMesh) => so(m) && orig(m); }
      this.glow = gl;
    }
    // pós-processamento
    if (this.pipe) { this.pipe.dispose(); this.pipe = null; } if (this.ssao) { this.ssao.dispose(); this.ssao = null; }
    const ip = s.imageProcessingConfiguration; ip.toneMappingEnabled = true; ip.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; ip.exposure = 1.1; ip.contrast = 1.1;
    if (n === 'medio' || n === 'alto' || n === 'ultra') {
      const p = new DefaultRenderingPipeline('pos', true, s, [this.cam]);
      p.fxaaEnabled = true; p.bloomEnabled = true; p.bloomThreshold = 0.9; p.bloomWeight = n === 'medio' ? 0.22 : 0.32; p.bloomKernel = 40; p.bloomScale = 0.5;
      p.imageProcessingEnabled = true; p.imageProcessing.toneMappingEnabled = true; p.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; p.imageProcessing.exposure = 1.1; p.imageProcessing.contrast = 1.12;
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
    const c = l3.color; b.diffuse = new Color3(c.r, c.g, c.b); b.intensity = l3.intensity * (l3.isHemisphereLight ? 1.15 : l3.isDirectionalLight ? 1.45 : 1);
    // otimização: ligar/desligar luz faz o Babylon recalcular as luzes de todas as malhas — só quando muda
    { const on = l3.visible !== false; if (b.isEnabled(false) !== on) b.setEnabled(on); }
    const e = l3.matrixWorld.elements;
    if (b instanceof DirectionalLight) { const t = l3.target; t.updateMatrixWorld(); const te = t.matrixWorld.elements; const d = new Vector3(te[12] - e[12], te[13] - e[13], te[14] - e[14]); if (d.lengthSquared() > 1e-6) b.direction = d.normalize(); const PJ = (0, eval)("typeof P!=='undefined'?P:null"); const cx = PJ ? PJ.x : e[12], cz = PJ ? PJ.z : e[14]; b.position = new Vector3(cx, 0, cz).subtract(b.direction.scale(200)); b.specular = new Color3(0.35, 0.33, 0.3); this.sol(b); }
    else if (b instanceof HemisphericLight) { if (l3.groundColor) b.groundColor = new Color3(l3.groundColor.r, l3.groundColor.g, l3.groundColor.b); else b.groundColor = b.diffuse.scale(0.5); b.specular = Color3.Black(); }
    else if (b instanceof PointLight) { b.position.set(e[12], e[13], e[14]); const rg = l3.distance || 30; if (b.range !== rg) b.range = rg; b.specular = b.diffuse.scale(0.2); }
  }
  private sol(d: DirectionalLight) {
    const sm = this.ceu.material as SkyMaterial; const up = -d.direction.y;
    sm.sunPosition = d.direction.scale(-300); sm.luminance = Math.max(0.15, Math.min(1.1, 0.2 + up * 1.2)); sm.turbidity = up < 0.25 ? 8 : 5;
  }

  semWebGL = false;
  /** o aparelho/visualizador não liberou o 3D (WebGL): avisa na tela como abrir o jogo do jeito certo */
  private avisoSemWebGL() {
    if (document.getElementById('aviso-sem-3d')) return;
    const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);
    const d = document.createElement('div'); d.id = 'aviso-sem-3d';
    d.style.cssText = 'position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;background:rgba(8,10,24,.92);padding:24px;font-family:system-ui,sans-serif;color:#f3e6c4;text-align:center';
    d.innerHTML = '<div style="max-width:520px;border:2px solid #e8b84a;border-radius:16px;padding:22px;background:#121a33"><div style="font-size:22px;font-weight:700;color:#e8b84a;margin-bottom:10px">O 3D não abriu aqui</div>'
      + '<div style="font-size:16px;line-height:1.45">Este visualizador não libera os gráficos 3D (WebGL), então só a interface aparece.' + (ios ? ' No iPhone isso acontece quando o arquivo é aberto pela pré-visualização do WhatsApp ou do app Arquivos.' : '') + '<br><br><b>Abra o jogo pelo link no ' + (ios ? 'Safari' : 'navegador (Chrome, Safari ou Firefox)') + '</b>' + (ios ? ', ou pelo atalho na Tela de Início' : '') + '.</div>'
      + '<a href="https://lopezzkk.github.io/clover-ipa/" target="_blank" rel="noopener" style="display:block;margin-top:16px;padding:12px 22px;border-radius:10px;background:#e8b84a;color:#1a1a1a;font-weight:700;font-size:17px;text-decoration:none">Abrir o jogo no ' + (ios ? 'Safari' : 'navegador') + '</a>'
      + '<div style="font-size:13px;opacity:.75;margin-top:6px">Abre a versão publicada do jogo (com 3D).</div>'
      + '<button style="margin-top:12px;padding:8px 18px;border-radius:10px;border:1px solid #e8b84a;background:transparent;color:#f3e6c4;font-size:14px">Fechar aviso</button></div>';
    d.querySelector('button')!.addEventListener('click', () => d.remove()); document.body.appendChild(d);
  }
  render(s3: T3, c3: T3, R: T3) {
    if (this.semWebGL) return; // sem 3D neste aparelho: não fica tentando (e falhando) a cada quadro
    const t0 = performance.now();
    try {
      if (!this.pronto) this.iniciar(R);
      const tr = this.tr; tr.quadro++;
      let tm = performance.now(); const marca = (k: string) => { const n = performance.now(); this.perfil[k] = (this.perfil[k] || 0) * 0.9 + (n - tm) * 0.1; if (this.bruto) (this.bruto[k] ||= []).push(n - tm); tm = n; };
      s3.updateMatrixWorld(); if (c3.parent === null) c3.updateMatrixWorld(); marca('matrizes');
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
      // otimização: objetos pequenos muito longe da câmera não são enviados (cada nível tem seu alcance)
      const alc: Record<string, number> = { muitobaixo: 70, baixo: 95, medio: 130, alto: 170, ultra: 240 }; const A = alc[this.nivel || 'medio'];
      const cx = e[12], cy = e[13], cz = e[14]; let cortados = 0; const pers = this.pers;
      marca('cameraNevoa');
      this.cenario.alcance = A; this.cenario.atualizar(s3); marca('cenarioNativo');
      pers.atualizar(s3, this.cam.position, A * 0.35); marca('personagens');
      const walk = (o: T3) => {
        if (o.visible === false || pers.longe(o)) return;
        if (o.isLight) this.luz(o);
        else if ((o.layers.mask & mask) !== 0 && (o.isMesh || o.isSprite || o.isPoints || o.isLine) && !o.__nativo && !pers.pular(o) && !this.mundo.esconder(o) && !this.clima.esconder(o)) {
          const m = o.matrixWorld.elements; const dx = m[12] - cx, dy = m[13] - cy, dz = m[14] - cz; const d2 = dx * dx + dy * dy + dz * dz;
          let longe = false;
          if (d2 > A * A * 0.3 && o.geometry) { let r = o.__r; if (r === undefined) { const g = o.geometry; if (!g.boundingSphere) g.computeBoundingSphere(); r = o.__r = g.boundingSphere ? g.boundingSphere.radius : 0; }
            const rr = r * Math.hypot(m[0], m[1], m[2]); if (rr < 25 && Math.sqrt(d2) - rr > alcanceDe(rr, A)) longe = true; }
          if (longe) cortados++; else tr.objeto(o, m);
        }
        const ch = o.children; for (let i = 0; i < ch.length; i++) walk(ch[i]);
      };
      tr.efeitos.length = 0;
      walk(s3); this.cortados = cortados; if (this.efeitos.pendentes.length) { for (const e of this.efeitos.pendentes) tr.efeitos.push(e as any); this.efeitos.pendentes.length = 0; } marca('copiaCena');
      const lim: Record<string, number> = { muitobaixo: 0, baixo: 12, medio: 30, alto: 50, ultra: 80 }; this.faiscas.quadro(tr.efeitos, lim[this.nivel || 'medio']);
      tr.fim(); marca('efeitosLimpeza');
      const dt = Math.min(0.1, this.tAnt ? (t0 - this.tAnt) / 1000 : 0.016); this.tAnt = t0; marca('_'); this.grim.atualizar(dt, this.nivel || 'medio'); marca('grimorios');
      this.chefes.atualizar(dt, this.nivel || 'medio', this.cam.position); marca('chefes'); this.mundo.atualizar(dt, this.nivel || 'medio', this.cam.position); marca('mundo'); this.ui.atualizar(dt, this.cam.position); marca('interface'); this.vilas.atualizar(dt, this.nivel || 'medio', this.cam.position); marca('vilas'); this.castelos.atualizar(dt, this.nivel || 'medio', this.cam.position); marca('castelos'); this.interiores.atualizar(dt, this.nivel || 'medio'); marca('interiores'); this.clima.atualizar(dt, this.nivel || 'medio', this.cam.position); marca('clima'); this.efeitos.atualizar(dt); marca('efeitos'); this.nat.atualizar(dt, this.nivel || 'medio', this.scene.getMaterialByName('m_grama'));
      if (t0 - this.q > 500) { this.q = t0; const n = this.lerNivel(); if (n !== this.nivel) this.aplicarNivel(n, R); this.filtrarSombras(); }
      const gq: Record<string, [number, number]> = { muitobaixo: [0, 0], baixo: [0, 0], medio: [32, 110], alto: [48, 160], ultra: [64, 240] }; const g = gq[this.nivel || 'medio']; this.grama.atualizar(g[0], g[1]); marca('grama');
      this.msSync = this.msSync * 0.9 + (performance.now() - t0) * 0.1;
      const dc = (this.engine as any)._drawCalls; if (dc && dc.fetchNewFrame) dc.fetchNewFrame(); // contador de desenhos por quadro (não acumulado)
      tm = performance.now(); this.engine.beginFrame(); this.scene.render(); this.engine.endFrame(); marca('desenhoBabylon');
      if (dc) this.desenhos = dc.current;
    } catch (err) {
      // se algo der errado na ponte, o erro fica registrado e o jogo segue
      this.erros++; console.error('[Ponte Babylon]', err);
      if (!this.pronto && /WebGL/i.test(String(err && (err as any).message || err))) { this.semWebGL = true; this.avisoSemWebGL(); return; }
      // sem o three.js não existe mais desenho de reserva: o Babylon continua desenhando (o erro fica registrado)
      if (this.erros > 5 && (window as any).THREE && (window as any).THREE.WebGLRenderer) { this.ativo = false; try { this.cenario?.restaurar(); } catch { /* segue */ } const cv = document.getElementById('c-babylon'); if (cv) cv.style.display = 'none'; }
    }
    this.ms = this.ms * 0.9 + (performance.now() - t0) * 0.1;
  }
  /** otimização: só faz sombra quem está perto do jogador (a sombra cobre ~48 m em volta dele) */
  private filtrarSombras() {
    const sm = this.sombra?.getShadowMap(); if (!sm) return; let c = { x: this.cam.position.x, z: this.cam.position.z }; try { const P = (0, eval)('typeof P!=="undefined"?P:null'); if (P && typeof P.x === 'number') c = { x: P.x, z: P.z }; } catch { /* usa a câmera */ } const L: AbstractMesh[] = [];
    for (const m of this.casters) { if (m.isDisposed() || !m.isEnabled()) continue; const b = m.getBoundingInfo().boundingSphere; const dx = b.centerWorld.x - c.x, dz = b.centerWorld.z - c.z;
      if (Math.sqrt(dx * dx + dz * dz) - b.radiusWorld < 60) L.push(m); }
    sm.renderList = L; this.sombrasAtivas = L.length;
  }
  /** teste: esfera flutuando ao lado do jogador e um chão de teste, para conferir as sombras */
  sondaSombra(x: number, z: number) {
    const sp = CreateSphere('sonda', { diameter: 2 }, this.scene); sp.position.set(x + 3, 3, z); const m = new StandardMaterial('sondaM', this.scene); m.diffuseColor = new Color3(1, 0.2, 0.2); sp.material = m;
    const gr = CreateGround('sondaChao', { width: 12, height: 12 }, this.scene); gr.position.set(x + 3, 0.3, z); const mg = new StandardMaterial('sondaG', this.scene); mg.diffuseColor = new Color3(0.9, 0.9, 0.9); gr.material = mg; gr.receiveShadows = true;
    this.sombra?.addShadowCaster(sp); return { sombra: !!this.sombra, lista: this.sombra?.getShadowMap()?.renderList?.length, luz: this.sombra?.getLight().name };
  }
  info() { return { ativo: this.ativo, semWebGL: this.semWebGL, nivel: this.nivel, ms: +this.ms.toFixed(2), desenhos: this.desenhos, ...this.tr?.stats, texturas: this.tr?.totalTexturas, grama: this.grama?.total, faiscas: this.faiscas?.ativos, efeitos: this.tr?.efeitos.length, sombra: this.sombra ? this.sombra.getShadowMap()!.renderList!.length : -1, geometrias: this.tr?.totalGeometrias, erros: this.erros, msSync: +this.msSync.toFixed(2), cortados: this.cortados, personagens: this.pers?.ativos, chefes: this.chefes?.ativos, agua: this.nat?.aguaVertices, elementos: this.faiscas?.elementos, mundo: this.mundo?.info, sombras: this.sombrasAtivas, perfil: Object.fromEntries(Object.entries(this.perfil).map(([k, v]) => [k, +v.toFixed(2)])), interface: this.ui?.info, vilas: this.vilas?.info, castelos: this.castelos?.info, clima: this.clima?.info, ondas: this.efeitos?.info, cenario: this.cenario?.info, modelos: this.modelos?.info }; }
  /** carregamento dos modelos .glb pelo Babylon (chamado pelo glb100 do jogo) */
  glb(k: string, cb: (sc: any) => void, antigo?: (k: string, cb: (sc: any) => void) => void) { if (!this.modelos) return antigo ? antigo(k, cb) : undefined; this.modelos.carregar(k, cb, antigo); }
}

(window as any).PONTE141 = new Ponte();
