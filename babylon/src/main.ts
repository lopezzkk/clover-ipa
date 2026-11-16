// Clover RP — versão experimental com Babylon.js · Fase 1 (motor, Vila Hage, personagem, controles).
// Não substitui o jogo atual e não é publicada.
import { ArcRotateCamera, Vector3, Color3, SceneInstrumentation, EngineInstrumentation, Color4 } from '@babylonjs/core';
import { criarMundo } from './cena';
import { PRESETS, nivelSalvo, salvarNivel, type Nivel } from './config';
import { criarTerreno, altura } from './world/terreno';
import { criarVilaHage } from './world/vila-hage';
import { Personagem } from './player/personagem';
import { criarHud } from './ui/hud';

const canvas = document.getElementById('jogo') as HTMLCanvasElement;
const nivel: Nivel = nivelSalvo(); const cfg = PRESETS[nivel];
const W = criarMundo(canvas); const { scene, engine } = W;

criarTerreno(scene, nivel === 'muitobaixo' ? 0.6 : nivel === 'baixo' ? 0.8 : 1);
const vila = criarVilaHage(scene, cfg);
const pj = new Personagem(scene);
const pos = new Vector3(0, 0, 14); let vy = 0, noAr = false, yaw = Math.PI, esqV = new Vector3();

const cam = new ArcRotateCamera('cam', -Math.PI / 2, 1.24, 7.2, new Vector3(0, 1.6, 14), scene);
cam.lowerRadiusLimit = 3.5; cam.upperRadiusLimit = 20; cam.lowerBetaLimit = 0.3; cam.upperBetaLimit = 1.48; cam.minZ = 0.1; cam.wheelDeltaPercentage = 0.01; cam.panningSensibility = 0; cam.angularSensibilityX = 900; cam.angularSensibilityY = 900;
cam.inputs.removeByType('ArcRotateCameraKeyboardMoveInput');
cam.attachControl(canvas, true);
W.aplicar(cfg, cam, [...vila.sombra, ...pj.malhas]);

// ---------- controles ----------
const tec: Record<string, boolean> = {};
let correr = false, pedePulo = false, pedeEsq = false; const joy = { x: 0, y: 0 };
addEventListener('keydown', e => { tec[e.code] = true; if (e.code === 'Space') pedePulo = true; if (e.code === 'KeyC') pedeEsq = true; });
addEventListener('keyup', e => { tec[e.code] = false; });
const hud = criarHud({ nivel, presets: PRESETS, aoNivel: n => { salvarNivel(n); location.reload(); }, aoHora: h => hora(h), joy, pular: () => (pedePulo = true), esquivar: () => (pedeEsq = true), correr: v => (correr = v) });

// ---------- dia, entardecer e noite ----------
function hora(h: 'dia' | 'tarde' | 'noite') {
  const sky: any = scene.getMeshByName('ceu')!.material; const V = vila.mats.vidro, Lz = vila.mats.luz;
  const cfgH = { dia: { sol: new Vector3(-0.55, -0.85, -0.42), si: 2, sc: '#fff2dc', ai: 0.62, sp: new Vector3(120, 160, 90), lum: 1.05, fog: '#b8d1eb', vid: 0.25, luz: 0.35 },
    tarde: { sol: new Vector3(-0.9, -0.28, -0.3), si: 1.5, sc: '#ffb070', ai: 0.42, sp: new Vector3(260, 30, 90), lum: 0.9, fog: '#e6b48a', vid: 0.7, luz: 0.85 },
    noite: { sol: new Vector3(0.4, -0.9, 0.3), si: 0.45, sc: '#8aa4ff', ai: 0.36, sp: new Vector3(-50, -120, -20), lum: 0.25, fog: '#1c2440', vid: 1.25, luz: 1.3 } }[h];
  W.sol.direction = cfgH.sol.normalize(); W.sol.position = cfgH.sol.scale(-200); W.sol.intensity = cfgH.si; W.sol.diffuse = Color3.FromHexString(cfgH.sc); W.amb.intensity = cfgH.ai;
  W.amb.diffuse = h === 'noite' ? new Color3(0.45, 0.55, 0.9) : new Color3(0.92, 0.95, 1);
  sky.sunPosition = cfgH.sp; sky.luminance = cfgH.lum; scene.fogColor = Color3.FromHexString(cfgH.fog); scene.clearColor = Color4.FromColor3(scene.fogColor);
  V.emissiveColor = new Color3(1, 0.78, 0.45).scale(cfgH.vid); Lz.emissiveColor = new Color3(1, 0.78, 0.42).scale(cfgH.luz);
  if (W.glow) W.glow.intensity = h === 'noite' ? 0.9 : h === 'tarde' ? 0.7 : 0.45;
}
hora('dia');

// ---------- movimento ----------
const ANDAR = 4.6, CORRER = 8.6, PULO = 8.8, G = 24;
scene.onBeforeRenderObservable.add(() => {
  const dt = Math.min(0.05, engine.getDeltaTime() / 1000);
  let ix = (tec.KeyD || tec.ArrowRight ? 1 : 0) - (tec.KeyA || tec.ArrowLeft ? 1 : 0) + joy.x;
  let iz = (tec.KeyW || tec.ArrowUp ? 1 : 0) - (tec.KeyS || tec.ArrowDown ? 1 : 0) + joy.y;
  const mag = Math.min(1, Math.hypot(ix, iz)); if (mag > 0.01) { ix /= Math.max(1, Math.hypot(ix, iz)); iz /= Math.max(1, Math.hypot(ix, iz)); }
  // direção relativa à câmera
  const f = pos.subtract(cam.position); f.y = 0; f.normalize(); const r = new Vector3(f.z, 0, -f.x).scale(-1);
  const dir = f.scale(iz).add(r.scale(ix));
  const run = correr || tec.ControlLeft || tec.ShiftLeft;
  let vel = (run ? CORRER : ANDAR) * mag;
  if (pedeEsq && !pj.esquivando && !noAr) { pj.esquivar(); esqV = (dir.lengthSquared() > 0.01 ? dir.normalize() : new Vector3(Math.sin(yaw), 0, Math.cos(yaw))).scale(13); }
  pedeEsq = false;
  let mv = dir.lengthSquared() > 0.0001 ? dir.normalize().scale(vel) : Vector3.Zero();
  if (pj.esquivando) { mv = esqV; vel = 13; esqV.scaleInPlace(Math.pow(0.12, dt)); }
  if (pedePulo && !noAr && !pj.esquivando) { vy = PULO; noAr = true; } pedePulo = false;
  const nx = pos.x + mv.x * dt, nz = pos.z + mv.z * dt;
  // colisão: empurra para fora de casas, árvores e objetos
  let px = nx, pz = nz;
  for (const c of vila.colisores) { const dx = px - c.x, dz = pz - c.z, d = Math.hypot(dx, dz), m = c.r + 0.35; if (d < m && d > 0.0001) { px = c.x + dx / d * m; pz = c.z + dz / d * m; } }
  pos.x = Math.max(-235, Math.min(235, px)); pos.z = Math.max(-235, Math.min(235, pz));
  const chao = altura(pos.x, pos.z);
  vy -= G * dt; pos.y += vy * dt; if (pos.y <= chao) { pos.y = chao; vy = 0; noAr = false; } else if (pos.y > chao + 0.05) noAr = true;
  if (mv.lengthSquared() > 0.01 && !pj.esquivando) { const alvo = Math.atan2(mv.x, mv.z); let d = alvo - yaw; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; yaw += d * Math.min(1, dt * 12); }
  pj.raiz.position.copyFrom(pos); pj.raiz.rotation.y = yaw;
  pj.animar(dt, Math.hypot(mv.x, mv.z), noAr, vy);
  // câmera segue suave e não entra no chão
  const alvoCam = pos.add(new Vector3(0, 1.55, 0)); cam.target = Vector3.Lerp(cam.target, alvoCam, Math.min(1, dt * 10));
  const hc = altura(cam.position.x, cam.position.z) + 0.6; if (cam.position.y < hc) cam.beta = Math.max(cam.lowerBetaLimit!, cam.beta - 0.02);
});

// ---------- medição ----------
const si = new SceneInstrumentation(scene); si.captureFrameTime = true; const ei = new EngineInstrumentation(engine); ei.captureGPUFrameTime = false;
let acc = 0;
scene.onAfterRenderObservable.add(() => { acc += engine.getDeltaTime(); if (acc > 500) { acc = 0; hud.medir(engine.getFps(), si.drawCallsCounter.current, scene.getActiveMeshes().length); } });
engine.runRenderLoop(() => scene.render());
addEventListener('resize', () => engine.resize());
document.documentElement.classList.add('pronto');
(window as any).__exp = { scene, engine, pos, cam, pj, vila, nivel, hora, tec, joy };
