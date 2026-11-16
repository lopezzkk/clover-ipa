// HUD da versão experimental: nome do lugar, desempenho, níveis gráficos, hora do dia e controles de toque.
import type { Nivel, Preset } from '../config';

interface Op { nivel: Nivel; presets: Record<Nivel, Preset>; aoNivel(n: Nivel): void; aoHora(h: 'dia' | 'tarde' | 'noite'): void; joy: { x: number; y: number }; pular(): void; esquivar(): void; correr(v: boolean): void }

export function criarHud(o: Op) {
  const el = (h: string) => { const d = document.createElement('div'); d.innerHTML = h; return d.firstElementChild as HTMLElement; };
  const topo = el(`<div class="hud-topo"><div class="lugar"><b>Vila Hage</b><span>Reino Esquecido</span></div><div class="tag">EXPERIMENTAL · Babylon.js · Fase 1</div></div>`);
  const med = el(`<div class="hud-med">— FPS</div>`);
  const painel = el(`<div class="hud-painel"><button class="hp-abre">⚙️</button><div class="hp-corpo"><h4>Gráficos</h4><div class="hp-l">${(Object.keys(o.presets) as Nivel[]).map(k => `<button data-n="${k}" class="${k === o.nivel ? 'on' : ''}">${o.presets[k].nome}</button>`).join('')}</div>
    <h4>Hora</h4><div class="hp-l"><button data-h="dia" class="on">Dia</button><button data-h="tarde">Entardecer</button><button data-h="noite">Noite</button></div>
    <p>PC: WASD anda · mouse arrasta a câmera · roda aproxima · Ctrl corre · Espaço pula · C esquiva</p></div></div>`);
  const toque = el(`<div class="hud-toque"><div class="joy"><div class="knob"></div></div><div class="bts"><button class="b-pulo">⤒</button><button class="b-esq">↻</button><button class="b-run">🏃</button></div></div>`);
  document.body.append(topo, med, painel, toque);
  painel.querySelector('.hp-abre')!.addEventListener('click', () => painel.classList.toggle('aberto'));
  painel.querySelectorAll<HTMLButtonElement>('[data-n]').forEach(b => b.onclick = () => o.aoNivel(b.dataset.n as Nivel));
  painel.querySelectorAll<HTMLButtonElement>('[data-h]').forEach(b => b.onclick = () => { painel.querySelectorAll('[data-h]').forEach(x => x.classList.remove('on')); b.classList.add('on'); o.aoHora(b.dataset.h as 'dia'); });
  // joystick virtual (só aparece no toque)
  const joy = toque.querySelector('.joy') as HTMLElement, knob = toque.querySelector('.knob') as HTMLElement; let id: number | null = null, cx = 0, cy = 0;
  joy.addEventListener('pointerdown', e => { id = e.pointerId; const r = joy.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2; joy.setPointerCapture(e.pointerId); mover(e); e.preventDefault(); });
  const mover = (e: PointerEvent) => { if (e.pointerId !== id) return; const R = joy.offsetWidth * 0.38; let dx = e.clientX - cx, dy = e.clientY - cy; const d = Math.hypot(dx, dy); if (d > R) { dx *= R / d; dy *= R / d; } knob.style.transform = `translate(${dx}px,${dy}px)`; o.joy.x = dx / R; o.joy.y = -dy / R; };
  joy.addEventListener('pointermove', mover);
  const solta = (e: PointerEvent) => { if (e.pointerId !== id) return; id = null; knob.style.transform = ''; o.joy.x = o.joy.y = 0; };
  joy.addEventListener('pointerup', solta); joy.addEventListener('pointercancel', solta);
  (toque.querySelector('.b-pulo') as HTMLElement).onpointerdown = e => { e.preventDefault(); o.pular(); };
  (toque.querySelector('.b-esq') as HTMLElement).onpointerdown = e => { e.preventDefault(); o.esquivar(); };
  const br = toque.querySelector('.b-run') as HTMLElement; let rn = false; br.onpointerdown = e => { e.preventDefault(); rn = !rn; br.classList.toggle('on', rn); o.correr(rn); };
  if (matchMedia('(pointer:coarse)').matches) document.body.classList.add('toque');
  return { medir(fps: number, dc: number, ativos: number) { med.textContent = `${fps.toFixed(0)} FPS · ${dc} desenhos · ${ativos} objetos ativos · ${o.presets[o.nivel].nome}`; } };
}
