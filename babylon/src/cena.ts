// Motor e cena: céu atmosférico, sol com sombras, luz ambiente, névoa, brilho e pós-processamento.
// Tudo que pesa é ligado/desligado pelo nível gráfico escolhido.
import { Engine, Scene, Vector3, Color3, Color4, DirectionalLight, HemisphericLight, ShadowGenerator, CascadedShadowGenerator, DefaultRenderingPipeline, SSAO2RenderingPipeline, GlowLayer, MeshBuilder, ImageProcessingConfiguration, Camera, AbstractMesh } from '@babylonjs/core';
import { SkyMaterial } from '@babylonjs/materials/sky/skyMaterial';
import type { Preset } from './config';

export interface Mundo {
  engine: Engine; scene: Scene; sol: DirectionalLight; amb: HemisphericLight;
  sombras: ShadowGenerator | null; pipeline: DefaultRenderingPipeline | null; ssao: SSAO2RenderingPipeline | null; glow: GlowLayer | null;
  aplicar(p: Preset, cam: Camera, casters: AbstractMesh[]): void;
}

export function criarMundo(canvas: HTMLCanvasElement): Mundo {
  const engine = new Engine(canvas, true, { stencil: true, preserveDrawingBuffer: false, powerPreference: 'high-performance', adaptToDeviceRatio: true });
  const scene = new Scene(engine);
  scene.clearColor = new Color4(0.62, 0.78, 0.95, 1);
  scene.ambientColor = new Color3(0.25, 0.25, 0.28);
  scene.fogMode = Scene.FOGMODE_EXP2; scene.fogColor = new Color3(0.72, 0.82, 0.92); scene.fogDensity = 0.0045;
  scene.skipPointerMovePicking = true; scene.autoClear = true; scene.autoClearDepthAndStencil = true;

  const sky = MeshBuilder.CreateBox('ceu', { size: 1800 }, scene);
  const sm = new SkyMaterial('m_ceu', scene); sm.backFaceCulling = false; sm.turbidity = 6; sm.luminance = 1.05; sm.rayleigh = 1.6; sm.mieCoefficient = 0.004; sm.mieDirectionalG = 0.85;
  sm.useSunPosition = true; sm.sunPosition = new Vector3(120, 160, 90); sky.material = sm; sky.infiniteDistance = true; sky.isPickable = false; sky.applyFog = false;

  const amb = new HemisphericLight('ambiente', new Vector3(0.2, 1, 0.1), scene);
  amb.intensity = 0.62; amb.diffuse = new Color3(0.92, 0.95, 1); amb.groundColor = new Color3(0.42, 0.38, 0.3); amb.specular = Color3.Black();
  const sol = new DirectionalLight('sol', new Vector3(-0.55, -0.85, -0.42).normalize(), scene);
  sol.position = new Vector3(120, 160, 90); sol.intensity = 2.0; sol.diffuse = new Color3(1, 0.95, 0.86); sol.specular = new Color3(0.5, 0.48, 0.42);

  const M: Mundo = {
    engine, scene, sol, amb, sombras: null, pipeline: null, ssao: null, glow: null,
    aplicar(p, cam, casters) {
      engine.setHardwareScalingLevel(p.escala);
      cam.maxZ = p.distancia + 900; scene.fogDensity = 0.55 / p.distancia;
      // sombras
      if (M.sombras) { M.sombras.dispose(); M.sombras = null; }
      if (p.sombras === 2) {
        const c = new CascadedShadowGenerator(p.sombraRes, sol); c.numCascades = 3; c.lambda = 0.82; c.shadowMaxZ = Math.min(140, p.distancia); c.stabilizeCascades = true;
        c.autoCalcDepthBounds = false; c.filteringQuality = ShadowGenerator.QUALITY_MEDIUM; c.usePercentageCloserFiltering = true; c.darkness = 0.25; c.bias = 0.004; c.normalBias = 0.02; M.sombras = c;
      } else if (p.sombras === 1) {
        const g = new ShadowGenerator(p.sombraRes, sol); g.usePercentageCloserFiltering = true; g.filteringQuality = ShadowGenerator.QUALITY_LOW; g.darkness = 0.3; g.bias = 0.002; g.normalBias = 0.02;
        sol.shadowMinZ = 1; sol.shadowMaxZ = 400; sol.autoUpdateExtends = false; sol.orthoLeft = -70; sol.orthoRight = 70; sol.orthoTop = 70; sol.orthoBottom = -70; M.sombras = g;
      }
      if (M.sombras) for (const m of casters) M.sombras.addShadowCaster(m, false);
      // brilho (lampiões, janelas, magias)
      if (p.brilho && !M.glow) { M.glow = new GlowLayer('brilho', scene, { mainTextureRatio: 0.35, blurKernelSize: 32 }); M.glow.intensity = 0.55; }
      if (!p.brilho && M.glow) { M.glow.dispose(); M.glow = null; }
      // pós-processamento
      if (M.pipeline) { M.pipeline.dispose(); M.pipeline = null; }
      if (p.posProc) {
        const pl = new DefaultRenderingPipeline('pos', true, scene, [cam]);
        pl.fxaaEnabled = true; pl.samples = 1;
        pl.bloomEnabled = true; pl.bloomThreshold = 0.82; pl.bloomWeight = 0.35; pl.bloomKernel = 48; pl.bloomScale = 0.5;
        pl.imageProcessingEnabled = true; pl.imageProcessing.toneMappingEnabled = true; pl.imageProcessing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
        pl.imageProcessing.exposure = 1.08; pl.imageProcessing.contrast = 1.12; pl.imageProcessing.vignetteEnabled = true; pl.imageProcessing.vignetteWeight = 1.2; pl.imageProcessing.vignetteColor = new Color4(0.1, 0.06, 0.02, 0);
        pl.sharpenEnabled = true; pl.sharpen.edgeAmount = 0.25;
        M.pipeline = pl;
      } else { scene.imageProcessingConfiguration.toneMappingEnabled = true; scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES; scene.imageProcessingConfiguration.exposure = 1.05; }
      if (M.ssao) { M.ssao.dispose(); M.ssao = null; }
      if (p.ssao) { const s = new SSAO2RenderingPipeline('ssao', scene, { ssaoRatio: 0.5, blurRatio: 0.5 }, [cam]); s.radius = 2.2; s.totalStrength = 1.1; s.samples = 12; s.maxZ = 120; M.ssao = s; }
    },
  };
  return M;
}
