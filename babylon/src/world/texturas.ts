// Texturas desenhadas na hora (sem baixar imagens): reboco, madeira, telhas, pedra, terra, grama.
// Cada uma é feita uma vez e reaproveitada por todos os objetos.
import { DynamicTexture, Scene, Texture } from '@babylonjs/core';

type Pinta = (c: CanvasRenderingContext2D, s: number, r: () => number) => void;
const cache = new Map<string, DynamicTexture>();

function rnd(seed: number) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

export function textura(scene: Scene, nome: string, s: number, pinta: Pinta, uv = 1): DynamicTexture {
  const k = nome + s + '@' + uv; const old = cache.get(k); if (old) return old;
  const t = new DynamicTexture('tx_' + nome, { width: s, height: s }, scene, true);
  const c = t.getContext() as unknown as CanvasRenderingContext2D;
  pinta(c, s, rnd(nome.length * 7919 + s));
  t.update(true);
  t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.uScale = t.vScale = uv; t.anisotropicFilteringLevel = 4;
  cache.set(k, t); return t;
}

const ruido = (c: CanvasRenderingContext2D, s: number, r: () => number, n: number, cor: (v: number) => string, tam = 2) => {
  for (let i = 0; i < n; i++) { c.fillStyle = cor(r()); const z = 1 + r() * tam; c.fillRect(r() * s, r() * s, z, z); }
};

export const reboco: Pinta = (c, s, r) => {
  c.fillStyle = '#efe6d2'; c.fillRect(0, 0, s, s);
  ruido(c, s, r, s * 18, v => `rgba(${150 + v * 60 | 0},${130 + v * 50 | 0},${100 + v * 40 | 0},0.10)`, 3);
  for (let i = 0; i < 14; i++) { c.fillStyle = `rgba(120,100,80,${0.04 + r() * 0.05})`; c.beginPath(); c.ellipse(r() * s, r() * s, 6 + r() * 22, 4 + r() * 14, r() * 3, 0, 7); c.fill(); }
};
export const madeira: Pinta = (c, s, r) => {
  c.fillStyle = '#5a3a22'; c.fillRect(0, 0, s, s);
  for (let y = 0; y < s; y += 2) { c.fillStyle = `rgba(${40 + r() * 40 | 0},${24 + r() * 20 | 0},${12 + r() * 10 | 0},${0.35 + r() * 0.3})`; c.fillRect(0, y, s, 1 + r() * 1.5); }
  for (let i = 0; i < 8; i++) { c.strokeStyle = 'rgba(30,18,8,.5)'; c.beginPath(); c.ellipse(r() * s, r() * s, 3 + r() * 4, 1.5, 0, 0, 7); c.stroke(); }
};
export const tabuas: Pinta = (c, s, r) => {
  madeira(c, s, r); c.fillStyle = 'rgba(20,10,4,.65)'; for (let x = 0; x < s; x += s / 6) c.fillRect(x, 0, 2, s);
};
export const telhas: Pinta = (c, s, r) => {
  c.fillStyle = '#7a2e22'; c.fillRect(0, 0, s, s); const h = s / 10, w = s / 8;
  for (let y = 0; y < s; y += h) for (let x = -(y / h % 2) * w / 2; x < s; x += w) {
    const t = 0.75 + r() * 0.35; c.fillStyle = `rgb(${150 * t | 0},${62 * t | 0},${44 * t | 0})`;
    c.beginPath(); c.moveTo(x + 1, y); c.lineTo(x + w - 1, y); c.lineTo(x + w - 2, y + h - 2); c.quadraticCurveTo(x + w / 2, y + h + 2, x + 2, y + h - 2); c.fill();
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(x, y + h - 3, w, 2);
  }
};
export const pedra: Pinta = (c, s, r) => {
  c.fillStyle = '#6f6a62'; c.fillRect(0, 0, s, s); const h = s / 6;
  for (let y = 0; y < s; y += h) for (let x = -(y / h % 2) * h; x < s; x += h * 1.6) {
    const t = 0.8 + r() * 0.4; c.fillStyle = `rgb(${128 * t | 0},${122 * t | 0},${112 * t | 0})`;
    c.beginPath(); c.roundRect(x + 2, y + 2, h * 1.6 - 4, h - 4, 5); c.fill();
  }
  ruido(c, s, r, s * 6, v => `rgba(40,40,40,${v * 0.25})`);
};
export const terra: Pinta = (c, s, r) => {
  c.fillStyle = '#a2835a'; c.fillRect(0, 0, s, s);
  ruido(c, s, r, s * 30, v => `rgba(${90 + v * 70 | 0},${70 + v * 50 | 0},${40 + v * 30 | 0},0.35)`, 3);
  for (let i = 0; i < s / 3; i++) { c.fillStyle = `rgba(110,110,105,${0.3 + r() * 0.4})`; c.beginPath(); c.arc(r() * s, r() * s, 1 + r() * 2.5, 0, 7); c.fill(); }
};
export const grama: Pinta = (c, s, r) => {
  c.fillStyle = '#5d7f3c'; c.fillRect(0, 0, s, s);
  ruido(c, s, r, s * 40, v => `rgba(${60 + v * 60 | 0},${110 + v * 60 | 0},${30 + v * 30 | 0},0.45)`, 2);
  for (let i = 0; i < s * 3; i++) { const x = r() * s, y = r() * s; c.strokeStyle = `rgba(${40 + r() * 50 | 0},${90 + r() * 70 | 0},${20 + r() * 25 | 0},.55)`; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 3, y - 3 - r() * 4); c.stroke(); }
};
export const vidro: Pinta = (c, s) => {
  const g = c.createLinearGradient(0, 0, 0, s); g.addColorStop(0, '#ffd890'); g.addColorStop(1, '#e09a40'); c.fillStyle = g; c.fillRect(0, 0, s, s);
  c.fillStyle = '#2a1a0e'; c.fillRect(s / 2 - 2, 0, 4, s); c.fillRect(0, s / 2 - 2, s, 4);
};
