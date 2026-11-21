// MATEMÁTICA DO JOGO SEM O THREE.JS (fase 1 da camada própria em cima do Babylon)
// Vetores, giros (quatérnio e ângulos), matrizes, cores, caixas, esferas, planos e raios com os MESMOS nomes e o
// MESMO comportamento que o jogo usava do three.js (r128), para os sistemas continuarem iguais.
// Conferido contra o three.js r128 com milhares de contas aleatórias (teste em babylon/testes/matematica.mjs).
/* eslint-disable @typescript-eslint/no-explicit-any */
type N = number; type A = any;

const _lut: string[] = []; for (let i = 0; i < 256; i++) _lut[i] = (i < 16 ? '0' : '') + i.toString(16);
let _seed = 1234567;
export const MathUtils = {
  DEG2RAD: Math.PI / 180, RAD2DEG: 180 / Math.PI,
  generateUUID(): string { const d0 = Math.random() * 0xffffffff | 0, d1 = Math.random() * 0xffffffff | 0, d2 = Math.random() * 0xffffffff | 0, d3 = Math.random() * 0xffffffff | 0;
    const u = _lut[d0 & 0xff] + _lut[d0 >> 8 & 0xff] + _lut[d0 >> 16 & 0xff] + _lut[d0 >> 24 & 0xff] + '-' + _lut[d1 & 0xff] + _lut[d1 >> 8 & 0xff] + '-' + _lut[d1 >> 16 & 0x0f | 0x40] + _lut[d1 >> 24 & 0xff] + '-' + _lut[d2 & 0x3f | 0x80] + _lut[d2 >> 8 & 0xff] + '-' + _lut[d2 >> 16 & 0xff] + _lut[d2 >> 24 & 0xff] + _lut[d3 & 0xff] + _lut[d3 >> 8 & 0xff] + _lut[d3 >> 16 & 0xff] + _lut[d3 >> 24 & 0xff];
    return u.toUpperCase(); },
  clamp: (v: N, a: N, b: N) => Math.max(a, Math.min(b, v)),
  euclideanModulo: (n: N, m: N) => ((n % m) + m) % m,
  mapLinear: (x: N, a1: N, a2: N, b1: N, b2: N) => b1 + (x - a1) * (b2 - b1) / (a2 - a1),
  inverseLerp: (x: N, y: N, v: N) => x !== y ? (v - x) / (y - x) : 0,
  lerp: (x: N, y: N, t: N) => (1 - t) * x + t * y,
  damp: (x: N, y: N, l: N, dt: N) => MathUtils.lerp(x, y, 1 - Math.exp(-l * dt)),
  pingpong: (x: N, len = 1) => len - Math.abs(MathUtils.euclideanModulo(x, len * 2) - len),
  smoothstep: (x: N, a: N, b: N) => { if (x <= a) return 0; if (x >= b) return 1; x = (x - a) / (b - a); return x * x * (3 - 2 * x); },
  smootherstep: (x: N, a: N, b: N) => { if (x <= a) return 0; if (x >= b) return 1; x = (x - a) / (b - a); return x * x * x * (x * (x * 6 - 15) + 10); },
  randInt: (l: N, h: N) => l + Math.floor(Math.random() * (h - l + 1)),
  randFloat: (l: N, h: N) => l + Math.random() * (h - l),
  randFloatSpread: (r: N) => r * (0.5 - Math.random()),
  seededRandom(s?: N) { if (s !== undefined) _seed = s % 2147483647; _seed = _seed * 16807 % 2147483647; return (_seed - 1) / 2147483646; },
  degToRad: (d: N) => d * MathUtils.DEG2RAD, radToDeg: (r: N) => r * MathUtils.RAD2DEG,
  isPowerOfTwo: (v: N) => (v & (v - 1)) === 0 && v !== 0,
  ceilPowerOfTwo: (v: N) => Math.pow(2, Math.ceil(Math.log(v) / Math.LN2)),
  floorPowerOfTwo: (v: N) => Math.pow(2, Math.floor(Math.log(v) / Math.LN2)),
};

// ---------------------------------------------------------------- Vector2
export class Vector2 {
  x: N; y: N; constructor(x = 0, y = 0) { this.x = x; this.y = y; }
  get isVector2() { return true; }
  get width() { return this.x; } set width(v) { this.x = v; } get height() { return this.y; } set height(v) { this.y = v; }
  set(x: N, y: N) { this.x = x; this.y = y; return this; } setScalar(s: N) { this.x = s; this.y = s; return this; }
  setX(x: N) { this.x = x; return this; } setY(y: N) { this.y = y; return this; }
  setComponent(i: N, v: N) { if (i === 0) this.x = v; else if (i === 1) this.y = v; else throw new Error('index is out of range: ' + i); return this; }
  getComponent(i: N) { if (i === 0) return this.x; if (i === 1) return this.y; throw new Error('index is out of range: ' + i); }
  clone() { return new Vector2(this.x, this.y); } copy(v: A) { this.x = v.x; this.y = v.y; return this; }
  add(v: A) { this.x += v.x; this.y += v.y; return this; } addScalar(s: N) { this.x += s; this.y += s; return this; }
  addVectors(a: A, b: A) { this.x = a.x + b.x; this.y = a.y + b.y; return this; } addScaledVector(v: A, s: N) { this.x += v.x * s; this.y += v.y * s; return this; }
  sub(v: A) { this.x -= v.x; this.y -= v.y; return this; } subScalar(s: N) { this.x -= s; this.y -= s; return this; }
  subVectors(a: A, b: A) { this.x = a.x - b.x; this.y = a.y - b.y; return this; }
  multiply(v: A) { this.x *= v.x; this.y *= v.y; return this; } multiplyScalar(s: N) { this.x *= s; this.y *= s; return this; }
  divide(v: A) { this.x /= v.x; this.y /= v.y; return this; } divideScalar(s: N) { return this.multiplyScalar(1 / s); }
  applyMatrix3(m: A) { const x = this.x, y = this.y, e = m.elements; this.x = e[0] * x + e[3] * y + e[6]; this.y = e[1] * x + e[4] * y + e[7]; return this; }
  min(v: A) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); return this; } max(v: A) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); return this; }
  clamp(a: A, b: A) { this.x = Math.max(a.x, Math.min(b.x, this.x)); this.y = Math.max(a.y, Math.min(b.y, this.y)); return this; }
  clampScalar(a: N, b: N) { this.x = Math.max(a, Math.min(b, this.x)); this.y = Math.max(a, Math.min(b, this.y)); return this; }
  clampLength(a: N, b: N) { const l = this.length(); return this.divideScalar(l || 1).multiplyScalar(Math.max(a, Math.min(b, l))); }
  floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); return this; } ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); return this; }
  round() { this.x = Math.round(this.x); this.y = Math.round(this.y); return this; }
  roundToZero() { this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x); this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y); return this; }
  negate() { this.x = -this.x; this.y = -this.y; return this; }
  dot(v: A) { return this.x * v.x + this.y * v.y; } cross(v: A) { return this.x * v.y - this.y * v.x; }
  lengthSq() { return this.x * this.x + this.y * this.y; } length() { return Math.sqrt(this.x * this.x + this.y * this.y); }
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y); } normalize() { return this.divideScalar(this.length() || 1); }
  angle() { return Math.atan2(-this.y, -this.x) + Math.PI; }
  distanceTo(v: A) { return Math.sqrt(this.distanceToSquared(v)); } distanceToSquared(v: A) { const dx = this.x - v.x, dy = this.y - v.y; return dx * dx + dy * dy; }
  manhattanDistanceTo(v: A) { return Math.abs(this.x - v.x) + Math.abs(this.y - v.y); }
  setLength(l: N) { return this.normalize().multiplyScalar(l); }
  lerp(v: A, a: N) { this.x += (v.x - this.x) * a; this.y += (v.y - this.y) * a; return this; }
  lerpVectors(a: A, b: A, t: N) { this.x = a.x + (b.x - a.x) * t; this.y = a.y + (b.y - a.y) * t; return this; }
  equals(v: A) { return v.x === this.x && v.y === this.y; }
  fromArray(a: A, o = 0) { this.x = a[o]; this.y = a[o + 1]; return this; } toArray(a: A = [], o = 0) { a[o] = this.x; a[o + 1] = this.y; return a; }
  fromBufferAttribute(at: A, i: N) { this.x = at.getX(i); this.y = at.getY(i); return this; }
  rotateAround(c: A, ang: N) { const cs = Math.cos(ang), s = Math.sin(ang), x = this.x - c.x, y = this.y - c.y; this.x = x * cs - y * s + c.x; this.y = x * s + y * cs + c.y; return this; }
  random() { this.x = Math.random(); this.y = Math.random(); return this; }
  *[Symbol.iterator]() { yield this.x; yield this.y; }
}

// ---------------------------------------------------------------- Quaternion
export class Quaternion {
  _x: N; _y: N; _z: N; _w: N; _onChangeCallback: () => void = () => {};
  constructor(x = 0, y = 0, z = 0, w = 1) { this._x = x; this._y = y; this._z = z; this._w = w; }
  get isQuaternion() { return true; }
  static slerp(a: A, b: A, q: A, t: N) { return q.copy(a).slerp(b, t); }
  static slerpFlat(dst: A, d0: N, s0: A, i0: N, s1: A, i1: N, t: N) {
    let x0 = s0[i0], y0 = s0[i0 + 1], z0 = s0[i0 + 2], w0 = s0[i0 + 3]; const x1 = s1[i1], y1 = s1[i1 + 1], z1 = s1[i1 + 2], w1 = s1[i1 + 3];
    if (t === 0) { dst[d0] = x0; dst[d0 + 1] = y0; dst[d0 + 2] = z0; dst[d0 + 3] = w0; return; }
    if (t === 1) { dst[d0] = x1; dst[d0 + 1] = y1; dst[d0 + 2] = z1; dst[d0 + 3] = w1; return; }
    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      let s = 1 - t; const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1, dir = cos >= 0 ? 1 : -1, sqrSin = 1 - cos * cos;
      if (sqrSin > Number.EPSILON) { const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir); s = Math.sin(s * len) / sin; t = Math.sin(t * len) / sin; }
      const tDir = t * dir; x0 = x0 * s + x1 * tDir; y0 = y0 * s + y1 * tDir; z0 = z0 * s + z1 * tDir; w0 = w0 * s + w1 * tDir;
      if (s === 1 - t) { const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0); x0 *= f; y0 *= f; z0 *= f; w0 *= f; }
    }
    dst[d0] = x0; dst[d0 + 1] = y0; dst[d0 + 2] = z0; dst[d0 + 3] = w0;
  }
  static multiplyQuaternionsFlat(dst: A, d: N, s0: A, i0: N, s1: A, i1: N) {
    const x0 = s0[i0], y0 = s0[i0 + 1], z0 = s0[i0 + 2], w0 = s0[i0 + 3], x1 = s1[i1], y1 = s1[i1 + 1], z1 = s1[i1 + 2], w1 = s1[i1 + 3];
    dst[d] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1; dst[d + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1; dst[d + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1; dst[d + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1; return dst;
  }
  get x() { return this._x; } set x(v) { this._x = v; this._onChangeCallback(); }
  get y() { return this._y; } set y(v) { this._y = v; this._onChangeCallback(); }
  get z() { return this._z; } set z(v) { this._z = v; this._onChangeCallback(); }
  get w() { return this._w; } set w(v) { this._w = v; this._onChangeCallback(); }
  set(x: N, y: N, z: N, w: N) { this._x = x; this._y = y; this._z = z; this._w = w; this._onChangeCallback(); return this; }
  clone() { return new Quaternion(this._x, this._y, this._z, this._w); }
  copy(q: A) { this._x = q.x; this._y = q.y; this._z = q.z; this._w = q.w; this._onChangeCallback(); return this; }
  setFromEuler(e: A, update?: boolean) {
    const x = e._x, y = e._y, z = e._z, o = e._order, c1 = Math.cos(x / 2), c2 = Math.cos(y / 2), c3 = Math.cos(z / 2), s1 = Math.sin(x / 2), s2 = Math.sin(y / 2), s3 = Math.sin(z / 2);
    switch (o) {
      case 'XYZ': this._x = s1 * c2 * c3 + c1 * s2 * s3; this._y = c1 * s2 * c3 - s1 * c2 * s3; this._z = c1 * c2 * s3 + s1 * s2 * c3; this._w = c1 * c2 * c3 - s1 * s2 * s3; break;
      case 'YXZ': this._x = s1 * c2 * c3 + c1 * s2 * s3; this._y = c1 * s2 * c3 - s1 * c2 * s3; this._z = c1 * c2 * s3 - s1 * s2 * c3; this._w = c1 * c2 * c3 + s1 * s2 * s3; break;
      case 'ZXY': this._x = s1 * c2 * c3 - c1 * s2 * s3; this._y = c1 * s2 * c3 + s1 * c2 * s3; this._z = c1 * c2 * s3 + s1 * s2 * c3; this._w = c1 * c2 * c3 - s1 * s2 * s3; break;
      case 'ZYX': this._x = s1 * c2 * c3 - c1 * s2 * s3; this._y = c1 * s2 * c3 + s1 * c2 * s3; this._z = c1 * c2 * s3 - s1 * s2 * c3; this._w = c1 * c2 * c3 + s1 * s2 * s3; break;
      case 'YZX': this._x = s1 * c2 * c3 + c1 * s2 * s3; this._y = c1 * s2 * c3 + s1 * c2 * s3; this._z = c1 * c2 * s3 - s1 * s2 * c3; this._w = c1 * c2 * c3 - s1 * s2 * s3; break;
      case 'XZY': this._x = s1 * c2 * c3 - c1 * s2 * s3; this._y = c1 * s2 * c3 - s1 * c2 * s3; this._z = c1 * c2 * s3 + s1 * s2 * c3; this._w = c1 * c2 * c3 + s1 * s2 * s3; break;
      default: console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + o);
    }
    if (update !== false) this._onChangeCallback(); return this;
  }
  setFromAxisAngle(ax: A, ang: N) { const h = ang / 2, s = Math.sin(h); this._x = ax.x * s; this._y = ax.y * s; this._z = ax.z * s; this._w = Math.cos(h); this._onChangeCallback(); return this; }
  setFromRotationMatrix(m: A) {
    const te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10], tr = m11 + m22 + m33;
    if (tr > 0) { const s = 0.5 / Math.sqrt(tr + 1.0); this._w = 0.25 / s; this._x = (m32 - m23) * s; this._y = (m13 - m31) * s; this._z = (m21 - m12) * s; }
    else if (m11 > m22 && m11 > m33) { const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33); this._w = (m32 - m23) / s; this._x = 0.25 * s; this._y = (m12 + m21) / s; this._z = (m13 + m31) / s; }
    else if (m22 > m33) { const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33); this._w = (m13 - m31) / s; this._x = (m12 + m21) / s; this._y = 0.25 * s; this._z = (m23 + m32) / s; }
    else { const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22); this._w = (m21 - m12) / s; this._x = (m13 + m31) / s; this._y = (m23 + m32) / s; this._z = 0.25 * s; }
    this._onChangeCallback(); return this;
  }
  setFromUnitVectors(f: A, t: A) {
    const EPS = 0.000001; let r = f.dot(t) + 1;
    if (r < EPS) { r = 0; if (Math.abs(f.x) > Math.abs(f.z)) { this._x = -f.y; this._y = f.x; this._z = 0; this._w = r; } else { this._x = 0; this._y = -f.z; this._z = f.y; this._w = r; } }
    else { this._x = f.y * t.z - f.z * t.y; this._y = f.z * t.x - f.x * t.z; this._z = f.x * t.y - f.y * t.x; this._w = r; }
    return this.normalize();
  }
  angleTo(q: A) { return 2 * Math.acos(Math.abs(MathUtils.clamp(this.dot(q), -1, 1))); }
  rotateTowards(q: A, step: N) { const a = this.angleTo(q); if (a === 0) return this; const t = Math.min(1, step / a); this.slerp(q, t); return this; }
  identity() { return this.set(0, 0, 0, 1); }
  invert() { return this.conjugate(); }
  inverse() { return this.conjugate(); }
  conjugate() { this._x *= -1; this._y *= -1; this._z *= -1; this._onChangeCallback(); return this; }
  dot(v: A) { return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w; }
  lengthSq() { return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w; }
  length() { return Math.sqrt(this.lengthSq()); }
  normalize() { let l = this.length(); if (l === 0) { this._x = 0; this._y = 0; this._z = 0; this._w = 1; } else { l = 1 / l; this._x *= l; this._y *= l; this._z *= l; this._w *= l; } this._onChangeCallback(); return this; }
  multiply(q: A) { return this.multiplyQuaternions(this, q); } premultiply(q: A) { return this.multiplyQuaternions(q, this); }
  multiplyQuaternions(a: A, b: A) {
    const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w, qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;
    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby; this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx; this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz; this._onChangeCallback(); return this;
  }
  slerp(qb: A, t: N) {
    if (t === 0) return this; if (t === 1) return this.copy(qb);
    const x = this._x, y = this._y, z = this._z, w = this._w; let cosHalf = w * qb._w + x * qb._x + y * qb._y + z * qb._z;
    if (cosHalf < 0) { this._w = -qb._w; this._x = -qb._x; this._y = -qb._y; this._z = -qb._z; cosHalf = -cosHalf; } else this.copy(qb);
    if (cosHalf >= 1.0) { this._w = w; this._x = x; this._y = y; this._z = z; return this; }
    const sqrSin = 1.0 - cosHalf * cosHalf;
    if (sqrSin <= Number.EPSILON) { const s = 1 - t; this._w = s * w + t * this._w; this._x = s * x + t * this._x; this._y = s * y + t * this._y; this._z = s * z + t * this._z; this.normalize(); this._onChangeCallback(); return this; }
    const sinHalf = Math.sqrt(sqrSin), half = Math.atan2(sinHalf, cosHalf), ra = Math.sin((1 - t) * half) / sinHalf, rb = Math.sin(t * half) / sinHalf;
    this._w = w * ra + this._w * rb; this._x = x * ra + this._x * rb; this._y = y * ra + this._y * rb; this._z = z * ra + this._z * rb; this._onChangeCallback(); return this;
  }
  equals(q: A) { return q._x === this._x && q._y === this._y && q._z === this._z && q._w === this._w; }
  fromArray(a: A, o = 0) { this._x = a[o]; this._y = a[o + 1]; this._z = a[o + 2]; this._w = a[o + 3]; this._onChangeCallback(); return this; }
  toArray(a: A = [], o = 0) { a[o] = this._x; a[o + 1] = this._y; a[o + 2] = this._z; a[o + 3] = this._w; return a; }
  fromBufferAttribute(at: A, i: N) { this._x = at.getX(i); this._y = at.getY(i); this._z = at.getZ(i); this._w = at.getW(i); return this; }
  _onChange(cb: () => void) { this._onChangeCallback = cb; return this; }
  *[Symbol.iterator]() { yield this._x; yield this._y; yield this._z; yield this._w; }
}

// ---------------------------------------------------------------- Vector3
const _q3 = new Quaternion();
export class Vector3 {
  x: N; y: N; z: N; constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }
  get isVector3() { return true; }
  set(x: N, y: N, z?: N) { if (z === undefined) z = this.z; this.x = x; this.y = y; this.z = z; return this; }
  setScalar(s: N) { this.x = s; this.y = s; this.z = s; return this; }
  setX(x: N) { this.x = x; return this; } setY(y: N) { this.y = y; return this; } setZ(z: N) { this.z = z; return this; }
  setComponent(i: N, v: N) { if (i === 0) this.x = v; else if (i === 1) this.y = v; else if (i === 2) this.z = v; else throw new Error('index is out of range: ' + i); return this; }
  getComponent(i: N) { if (i === 0) return this.x; if (i === 1) return this.y; if (i === 2) return this.z; throw new Error('index is out of range: ' + i); }
  clone() { return new Vector3(this.x, this.y, this.z); } copy(v: A) { this.x = v.x; this.y = v.y; this.z = v.z; return this; }
  add(v: A) { this.x += v.x; this.y += v.y; this.z += v.z; return this; } addScalar(s: N) { this.x += s; this.y += s; this.z += s; return this; }
  addVectors(a: A, b: A) { this.x = a.x + b.x; this.y = a.y + b.y; this.z = a.z + b.z; return this; }
  addScaledVector(v: A, s: N) { this.x += v.x * s; this.y += v.y * s; this.z += v.z * s; return this; }
  sub(v: A) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; } subScalar(s: N) { this.x -= s; this.y -= s; this.z -= s; return this; }
  subVectors(a: A, b: A) { this.x = a.x - b.x; this.y = a.y - b.y; this.z = a.z - b.z; return this; }
  multiply(v: A) { this.x *= v.x; this.y *= v.y; this.z *= v.z; return this; } multiplyScalar(s: N) { this.x *= s; this.y *= s; this.z *= s; return this; }
  multiplyVectors(a: A, b: A) { this.x = a.x * b.x; this.y = a.y * b.y; this.z = a.z * b.z; return this; }
  applyEuler(e: A) { return this.applyQuaternion(_q3.setFromEuler(e)); }
  applyAxisAngle(ax: A, ang: N) { return this.applyQuaternion(_q3.setFromAxisAngle(ax, ang)); }
  applyMatrix3(m: A) { const x = this.x, y = this.y, z = this.z, e = m.elements; this.x = e[0] * x + e[3] * y + e[6] * z; this.y = e[1] * x + e[4] * y + e[7] * z; this.z = e[2] * x + e[5] * y + e[8] * z; return this; }
  applyNormalMatrix(m: A) { return this.applyMatrix3(m).normalize(); }
  applyMatrix4(m: A) { const x = this.x, y = this.y, z = this.z, e = m.elements; const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
    this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w; this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w; this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w; return this; }
  applyQuaternion(q: A) { const x = this.x, y = this.y, z = this.z, qx = q.x, qy = q.y, qz = q.z, qw = q.w;
    const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
    this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy; this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz; this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx; return this; }
  project(c: A) { return this.applyMatrix4(c.matrixWorldInverse).applyMatrix4(c.projectionMatrix); }
  unproject(c: A) { return this.applyMatrix4(c.projectionMatrixInverse).applyMatrix4(c.matrixWorld); }
  transformDirection(m: A) { const x = this.x, y = this.y, z = this.z, e = m.elements; this.x = e[0] * x + e[4] * y + e[8] * z; this.y = e[1] * x + e[5] * y + e[9] * z; this.z = e[2] * x + e[6] * y + e[10] * z; return this.normalize(); }
  divide(v: A) { this.x /= v.x; this.y /= v.y; this.z /= v.z; return this; } divideScalar(s: N) { return this.multiplyScalar(1 / s); }
  min(v: A) { this.x = Math.min(this.x, v.x); this.y = Math.min(this.y, v.y); this.z = Math.min(this.z, v.z); return this; }
  max(v: A) { this.x = Math.max(this.x, v.x); this.y = Math.max(this.y, v.y); this.z = Math.max(this.z, v.z); return this; }
  clamp(a: A, b: A) { this.x = Math.max(a.x, Math.min(b.x, this.x)); this.y = Math.max(a.y, Math.min(b.y, this.y)); this.z = Math.max(a.z, Math.min(b.z, this.z)); return this; }
  clampScalar(a: N, b: N) { this.x = Math.max(a, Math.min(b, this.x)); this.y = Math.max(a, Math.min(b, this.y)); this.z = Math.max(a, Math.min(b, this.z)); return this; }
  clampLength(a: N, b: N) { const l = this.length(); return this.divideScalar(l || 1).multiplyScalar(Math.max(a, Math.min(b, l))); }
  floor() { this.x = Math.floor(this.x); this.y = Math.floor(this.y); this.z = Math.floor(this.z); return this; }
  ceil() { this.x = Math.ceil(this.x); this.y = Math.ceil(this.y); this.z = Math.ceil(this.z); return this; }
  round() { this.x = Math.round(this.x); this.y = Math.round(this.y); this.z = Math.round(this.z); return this; }
  roundToZero() { this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x); this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y); this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z); return this; }
  negate() { this.x = -this.x; this.y = -this.y; this.z = -this.z; return this; }
  dot(v: A) { return this.x * v.x + this.y * v.y + this.z * v.z; }
  lengthSq() { return this.x * this.x + this.y * this.y + this.z * this.z; } length() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
  manhattanLength() { return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); }
  normalize() { return this.divideScalar(this.length() || 1); } setLength(l: N) { return this.normalize().multiplyScalar(l); }
  lerp(v: A, a: N) { this.x += (v.x - this.x) * a; this.y += (v.y - this.y) * a; this.z += (v.z - this.z) * a; return this; }
  lerpVectors(a: A, b: A, t: N) { this.x = a.x + (b.x - a.x) * t; this.y = a.y + (b.y - a.y) * t; this.z = a.z + (b.z - a.z) * t; return this; }
  cross(v: A) { return this.crossVectors(this, v); }
  crossVectors(a: A, b: A) { const ax = a.x, ay = a.y, az = a.z, bx = b.x, by = b.y, bz = b.z; this.x = ay * bz - az * by; this.y = az * bx - ax * bz; this.z = ax * by - ay * bx; return this; }
  projectOnVector(v: A) { const d = v.lengthSq(); if (d === 0) return this.set(0, 0, 0); const s = v.dot(this) / d; return this.copy(v).multiplyScalar(s); }
  projectOnPlane(n: A) { _v3a.copy(this).projectOnVector(n); return this.sub(_v3a); }
  reflect(n: A) { return this.sub(_v3a.copy(n).multiplyScalar(2 * this.dot(n))); }
  angleTo(v: A) { const d = Math.sqrt(this.lengthSq() * v.lengthSq()); if (d === 0) return Math.PI / 2; const t = this.dot(v) / d; return Math.acos(MathUtils.clamp(t, -1, 1)); }
  distanceTo(v: A) { return Math.sqrt(this.distanceToSquared(v)); }
  distanceToSquared(v: A) { const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z; return dx * dx + dy * dy + dz * dz; }
  manhattanDistanceTo(v: A) { return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z); }
  setFromSpherical(s: A) { return this.setFromSphericalCoords(s.radius, s.phi, s.theta); }
  setFromSphericalCoords(r: N, phi: N, th: N) { const sr = Math.sin(phi) * r; this.x = sr * Math.sin(th); this.y = Math.cos(phi) * r; this.z = sr * Math.cos(th); return this; }
  setFromCylindrical(c: A) { return this.setFromCylindricalCoords(c.radius, c.theta, c.y); }
  setFromCylindricalCoords(r: N, th: N, y: N) { this.x = r * Math.sin(th); this.y = y; this.z = r * Math.cos(th); return this; }
  setFromMatrixPosition(m: A) { const e = m.elements; this.x = e[12]; this.y = e[13]; this.z = e[14]; return this; }
  setFromMatrixScale(m: A) { const sx = this.setFromMatrixColumn(m, 0).length(), sy = this.setFromMatrixColumn(m, 1).length(), sz = this.setFromMatrixColumn(m, 2).length(); this.x = sx; this.y = sy; this.z = sz; return this; }
  setFromMatrixColumn(m: A, i: N) { return this.fromArray(m.elements, i * 4); }
  setFromMatrix3Column(m: A, i: N) { return this.fromArray(m.elements, i * 3); }
  equals(v: A) { return v.x === this.x && v.y === this.y && v.z === this.z; }
  fromArray(a: A, o = 0) { this.x = a[o]; this.y = a[o + 1]; this.z = a[o + 2]; return this; }
  toArray(a: A = [], o = 0) { a[o] = this.x; a[o + 1] = this.y; a[o + 2] = this.z; return a; }
  fromBufferAttribute(at: A, i: N) { this.x = at.getX(i); this.y = at.getY(i); this.z = at.getZ(i); return this; }
  random() { this.x = Math.random(); this.y = Math.random(); this.z = Math.random(); return this; }
  *[Symbol.iterator]() { yield this.x; yield this.y; yield this.z; }
}
const _v3a = new Vector3();

// ---------------------------------------------------------------- Vector4
export class Vector4 {
  x: N; y: N; z: N; w: N; constructor(x = 0, y = 0, z = 0, w = 1) { this.x = x; this.y = y; this.z = z; this.w = w; }
  get isVector4() { return true; }
  get width() { return this.z; } set width(v) { this.z = v; } get height() { return this.w; } set height(v) { this.w = v; }
  set(x: N, y: N, z: N, w: N) { this.x = x; this.y = y; this.z = z; this.w = w; return this; }
  setScalar(s: N) { this.x = s; this.y = s; this.z = s; this.w = s; return this; }
  clone() { return new Vector4(this.x, this.y, this.z, this.w); } copy(v: A) { this.x = v.x; this.y = v.y; this.z = v.z; this.w = v.w !== undefined ? v.w : 1; return this; }
  add(v: A) { this.x += v.x; this.y += v.y; this.z += v.z; this.w += v.w; return this; }
  sub(v: A) { this.x -= v.x; this.y -= v.y; this.z -= v.z; this.w -= v.w; return this; }
  multiplyScalar(s: N) { this.x *= s; this.y *= s; this.z *= s; this.w *= s; return this; } divideScalar(s: N) { return this.multiplyScalar(1 / s); }
  applyMatrix4(m: A) { const x = this.x, y = this.y, z = this.z, w = this.w, e = m.elements;
    this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w; this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w; this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w; this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w; return this; }
  dot(v: A) { return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w; }
  lengthSq() { return this.dot(this); } length() { return Math.sqrt(this.lengthSq()); } normalize() { return this.divideScalar(this.length() || 1); }
  lerp(v: A, a: N) { this.x += (v.x - this.x) * a; this.y += (v.y - this.y) * a; this.z += (v.z - this.z) * a; this.w += (v.w - this.w) * a; return this; }
  equals(v: A) { return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w; }
  fromArray(a: A, o = 0) { this.x = a[o]; this.y = a[o + 1]; this.z = a[o + 2]; this.w = a[o + 3]; return this; }
  toArray(a: A = [], o = 0) { a[o] = this.x; a[o + 1] = this.y; a[o + 2] = this.z; a[o + 3] = this.w; return a; }
  fromBufferAttribute(at: A, i: N) { this.x = at.getX(i); this.y = at.getY(i); this.z = at.getZ(i); this.w = at.getW(i); return this; }
}

// ---------------------------------------------------------------- Matrix3
export class Matrix3 {
  elements: N[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];
  get isMatrix3() { return true; }
  set(n11: N, n12: N, n13: N, n21: N, n22: N, n23: N, n31: N, n32: N, n33: N) { const te = this.elements; te[0] = n11; te[1] = n21; te[2] = n31; te[3] = n12; te[4] = n22; te[5] = n32; te[6] = n13; te[7] = n23; te[8] = n33; return this; }
  identity() { return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1); }
  copy(m: A) { const te = this.elements, me = m.elements; for (let i = 0; i < 9; i++) te[i] = me[i]; return this; }
  extractBasis(x: A, y: A, z: A) { x.setFromMatrix3Column(this, 0); y.setFromMatrix3Column(this, 1); z.setFromMatrix3Column(this, 2); return this; }
  setFromMatrix4(m: A) { const me = m.elements; return this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]); }
  multiply(m: A) { return this.multiplyMatrices(this, m); } premultiply(m: A) { return this.multiplyMatrices(m, this); }
  multiplyMatrices(a: A, b: A) {
    const ae = a.elements, be = b.elements, te = this.elements;
    const a11 = ae[0], a12 = ae[3], a13 = ae[6], a21 = ae[1], a22 = ae[4], a23 = ae[7], a31 = ae[2], a32 = ae[5], a33 = ae[8];
    const b11 = be[0], b12 = be[3], b13 = be[6], b21 = be[1], b22 = be[4], b23 = be[7], b31 = be[2], b32 = be[5], b33 = be[8];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31; te[3] = a11 * b12 + a12 * b22 + a13 * b32; te[6] = a11 * b13 + a12 * b23 + a13 * b33;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31; te[4] = a21 * b12 + a22 * b22 + a23 * b32; te[7] = a21 * b13 + a22 * b23 + a23 * b33;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31; te[5] = a31 * b12 + a32 * b22 + a33 * b32; te[8] = a31 * b13 + a32 * b23 + a33 * b33; return this;
  }
  multiplyScalar(s: N) { const te = this.elements; for (let i = 0; i < 9; i++) te[i] *= s; return this; }
  determinant() { const te = this.elements, a = te[0], b = te[1], c = te[2], d = te[3], e = te[4], f = te[5], g = te[6], h = te[7], i = te[8]; return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g; }
  invert() {
    const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n12 = te[3], n22 = te[4], n32 = te[5], n13 = te[6], n23 = te[7], n33 = te[8];
    const t11 = n33 * n22 - n32 * n23, t12 = n32 * n13 - n33 * n12, t13 = n23 * n12 - n22 * n13, det = n11 * t11 + n21 * t12 + n31 * t13;
    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0); const di = 1 / det;
    te[0] = t11 * di; te[1] = (n31 * n23 - n33 * n21) * di; te[2] = (n32 * n21 - n31 * n22) * di;
    te[3] = t12 * di; te[4] = (n33 * n11 - n31 * n13) * di; te[5] = (n31 * n12 - n32 * n11) * di;
    te[6] = t13 * di; te[7] = (n21 * n13 - n23 * n11) * di; te[8] = (n22 * n11 - n21 * n12) * di; return this;
  }
  getInverse(m: A) { return this.copy(m).invert(); }
  transpose() { let t; const m = this.elements; t = m[1]; m[1] = m[3]; m[3] = t; t = m[2]; m[2] = m[6]; m[6] = t; t = m[5]; m[5] = m[7]; m[7] = t; return this; }
  getNormalMatrix(m4: A) { return this.setFromMatrix4(m4).invert().transpose(); }
  transposeIntoArray(r: A) { const m = this.elements; r[0] = m[0]; r[1] = m[3]; r[2] = m[6]; r[3] = m[1]; r[4] = m[4]; r[5] = m[7]; r[6] = m[2]; r[7] = m[5]; r[8] = m[8]; return this; }
  setUvTransform(tx: N, ty: N, sx: N, sy: N, rot: N, cx: N, cy: N) { const c = Math.cos(rot), s = Math.sin(rot);
    return this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1); }
  scale(sx: N, sy: N) { const te = this.elements; te[0] *= sx; te[3] *= sx; te[6] *= sx; te[1] *= sy; te[4] *= sy; te[7] *= sy; return this; }
  rotate(th: N) { const c = Math.cos(th), s = Math.sin(th), te = this.elements, a11 = te[0], a12 = te[3], a13 = te[6], a21 = te[1], a22 = te[4], a23 = te[7];
    te[0] = c * a11 + s * a21; te[3] = c * a12 + s * a22; te[6] = c * a13 + s * a23; te[1] = -s * a11 + c * a21; te[4] = -s * a12 + c * a22; te[7] = -s * a13 + c * a23; return this; }
  translate(tx: N, ty: N) { const te = this.elements; te[0] += tx * te[2]; te[3] += tx * te[5]; te[6] += tx * te[8]; te[1] += ty * te[2]; te[4] += ty * te[5]; te[7] += ty * te[8]; return this; }
  equals(m: A) { const te = this.elements, me = m.elements; for (let i = 0; i < 9; i++) if (te[i] !== me[i]) return false; return true; }
  fromArray(a: A, o = 0) { for (let i = 0; i < 9; i++) this.elements[i] = a[i + o]; return this; }
  toArray(a: A = [], o = 0) { const te = this.elements; for (let i = 0; i < 9; i++) a[o + i] = te[i]; return a; }
  clone() { return new Matrix3().fromArray(this.elements); }
}

// ---------------------------------------------------------------- Matrix4
const _zero = new Vector3(0, 0, 0), _one = new Vector3(1, 1, 1), _mx = new Vector3(), _my = new Vector3(), _mz = new Vector3();
export class Matrix4 {
  elements: N[] = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  get isMatrix4() { return true; }
  set(n11: N, n12: N, n13: N, n14: N, n21: N, n22: N, n23: N, n24: N, n31: N, n32: N, n33: N, n34: N, n41: N, n42: N, n43: N, n44: N) {
    const te = this.elements; te[0] = n11; te[4] = n12; te[8] = n13; te[12] = n14; te[1] = n21; te[5] = n22; te[9] = n23; te[13] = n24; te[2] = n31; te[6] = n32; te[10] = n33; te[14] = n34; te[3] = n41; te[7] = n42; te[11] = n43; te[15] = n44; return this;
  }
  identity() { return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  clone() { return new Matrix4().fromArray(this.elements); }
  copy(m: A) { const te = this.elements, me = m.elements; for (let i = 0; i < 16; i++) te[i] = me[i]; return this; }
  copyPosition(m: A) { const te = this.elements, me = m.elements; te[12] = me[12]; te[13] = me[13]; te[14] = me[14]; return this; }
  setFromMatrix3(m: A) { const me = m.elements; return this.set(me[0], me[3], me[6], 0, me[1], me[4], me[7], 0, me[2], me[5], me[8], 0, 0, 0, 0, 1); }
  extractBasis(x: A, y: A, z: A) { x.setFromMatrixColumn(this, 0); y.setFromMatrixColumn(this, 1); z.setFromMatrixColumn(this, 2); return this; }
  makeBasis(x: A, y: A, z: A) { return this.set(x.x, y.x, z.x, 0, x.y, y.y, z.y, 0, x.z, y.z, z.z, 0, 0, 0, 0, 1); }
  extractRotation(m: A) {
    const te = this.elements, me = m.elements, sx = 1 / _mx.setFromMatrixColumn(m, 0).length(), sy = 1 / _mx.setFromMatrixColumn(m, 1).length(), sz = 1 / _mx.setFromMatrixColumn(m, 2).length();
    te[0] = me[0] * sx; te[1] = me[1] * sx; te[2] = me[2] * sx; te[3] = 0; te[4] = me[4] * sy; te[5] = me[5] * sy; te[6] = me[6] * sy; te[7] = 0;
    te[8] = me[8] * sz; te[9] = me[9] * sz; te[10] = me[10] * sz; te[11] = 0; te[12] = 0; te[13] = 0; te[14] = 0; te[15] = 1; return this;
  }
  makeRotationFromEuler(e: A) {
    const te = this.elements, x = e.x, y = e.y, z = e.z, a = Math.cos(x), b = Math.sin(x), c = Math.cos(y), d = Math.sin(y), ee = Math.cos(z), f = Math.sin(z);
    if (e.order === 'XYZ') { const ae = a * ee, af = a * f, be = b * ee, bf = b * f; te[0] = c * ee; te[4] = -c * f; te[8] = d; te[1] = af + be * d; te[5] = ae - bf * d; te[9] = -b * c; te[2] = bf - ae * d; te[6] = be + af * d; te[10] = a * c; }
    else if (e.order === 'YXZ') { const ce = c * ee, cf = c * f, de = d * ee, df = d * f; te[0] = ce + df * b; te[4] = de * b - cf; te[8] = a * d; te[1] = a * f; te[5] = a * ee; te[9] = -b; te[2] = cf * b - de; te[6] = df + ce * b; te[10] = a * c; }
    else if (e.order === 'ZXY') { const ce = c * ee, cf = c * f, de = d * ee, df = d * f; te[0] = ce - df * b; te[4] = -a * f; te[8] = de + cf * b; te[1] = cf + de * b; te[5] = a * ee; te[9] = df - ce * b; te[2] = -a * d; te[6] = b; te[10] = a * c; }
    else if (e.order === 'ZYX') { const ae = a * ee, af = a * f, be = b * ee, bf = b * f; te[0] = c * ee; te[4] = be * d - af; te[8] = ae * d + bf; te[1] = c * f; te[5] = bf * d + ae; te[9] = af * d - be; te[2] = -d; te[6] = b * c; te[10] = a * c; }
    else if (e.order === 'YZX') { const ac = a * c, ad = a * d, bc = b * c, bd = b * d; te[0] = c * ee; te[4] = bd - ac * f; te[8] = bc * f + ad; te[1] = f; te[5] = a * ee; te[9] = -b * ee; te[2] = -d * ee; te[6] = ad * f + bc; te[10] = ac - bd * f; }
    else if (e.order === 'XZY') { const ac = a * c, ad = a * d, bc = b * c, bd = b * d; te[0] = c * ee; te[4] = -f; te[8] = d * ee; te[1] = ac * f + bd; te[5] = a * ee; te[9] = ad * f - bc; te[2] = bc * f - ad; te[6] = b * ee; te[10] = bd * f + ac; }
    te[3] = 0; te[7] = 0; te[11] = 0; te[12] = 0; te[13] = 0; te[14] = 0; te[15] = 1; return this;
  }
  makeRotationFromQuaternion(q: A) { return this.compose(_zero, q, _one); }
  lookAt(eye: A, target: A, up: A) {
    const te = this.elements; _mz.subVectors(eye, target);
    if (_mz.lengthSq() === 0) _mz.z = 1; _mz.normalize(); _mx.crossVectors(up, _mz);
    if (_mx.lengthSq() === 0) { if (Math.abs(up.z) === 1) _mz.x += 0.0001; else _mz.z += 0.0001; _mz.normalize(); _mx.crossVectors(up, _mz); }
    _mx.normalize(); _my.crossVectors(_mz, _mx);
    te[0] = _mx.x; te[4] = _my.x; te[8] = _mz.x; te[1] = _mx.y; te[5] = _my.y; te[9] = _mz.y; te[2] = _mx.z; te[6] = _my.z; te[10] = _mz.z; return this;
  }
  multiply(m: A) { return this.multiplyMatrices(this, m); } premultiply(m: A) { return this.multiplyMatrices(m, this); }
  multiplyMatrices(a: A, b: A) {
    const ae = a.elements, be = b.elements, te = this.elements;
    const a11 = ae[0], a12 = ae[4], a13 = ae[8], a14 = ae[12], a21 = ae[1], a22 = ae[5], a23 = ae[9], a24 = ae[13], a31 = ae[2], a32 = ae[6], a33 = ae[10], a34 = ae[14], a41 = ae[3], a42 = ae[7], a43 = ae[11], a44 = ae[15];
    const b11 = be[0], b12 = be[4], b13 = be[8], b14 = be[12], b21 = be[1], b22 = be[5], b23 = be[9], b24 = be[13], b31 = be[2], b32 = be[6], b33 = be[10], b34 = be[14], b41 = be[3], b42 = be[7], b43 = be[11], b44 = be[15];
    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41; te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42; te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43; te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41; te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42; te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43; te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41; te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42; te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43; te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41; te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42; te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43; te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return this;
  }
  multiplyScalar(s: N) { const te = this.elements; for (let i = 0; i < 16; i++) te[i] *= s; return this; }
  determinant() {
    const te = this.elements, n11 = te[0], n12 = te[4], n13 = te[8], n14 = te[12], n21 = te[1], n22 = te[5], n23 = te[9], n24 = te[13], n31 = te[2], n32 = te[6], n33 = te[10], n34 = te[14], n41 = te[3], n42 = te[7], n43 = te[11], n44 = te[15];
    return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31)
      + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
  }
  transpose() { const te = this.elements; let t;
    t = te[1]; te[1] = te[4]; te[4] = t; t = te[2]; te[2] = te[8]; te[8] = t; t = te[6]; te[6] = te[9]; te[9] = t; t = te[3]; te[3] = te[12]; te[12] = t; t = te[7]; te[7] = te[13]; te[13] = t; t = te[11]; te[11] = te[14]; te[14] = t; return this; }
  setPosition(x: A, y?: N, z?: N) { const te = this.elements; if (x.isVector3) { te[12] = x.x; te[13] = x.y; te[14] = x.z; } else { te[12] = x; te[13] = y!; te[14] = z!; } return this; }
  invert() {
    const te = this.elements, n11 = te[0], n21 = te[1], n31 = te[2], n41 = te[3], n12 = te[4], n22 = te[5], n32 = te[6], n42 = te[7], n13 = te[8], n23 = te[9], n33 = te[10], n43 = te[11], n14 = te[12], n24 = te[13], n34 = te[14], n44 = te[15];
    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    const di = 1 / det;
    te[0] = t11 * di; te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * di;
    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * di;
    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * di;
    te[4] = t12 * di; te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * di;
    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * di;
    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * di;
    te[8] = t13 * di; te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * di;
    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * di;
    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * di;
    te[12] = t14 * di; te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * di;
    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * di;
    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * di;
    return this;
  }
  getInverse(m: A) { return this.copy(m).invert(); }
  scale(v: A) { const te = this.elements, x = v.x, y = v.y, z = v.z; te[0] *= x; te[4] *= y; te[8] *= z; te[1] *= x; te[5] *= y; te[9] *= z; te[2] *= x; te[6] *= y; te[10] *= z; te[3] *= x; te[7] *= y; te[11] *= z; return this; }
  getMaxScaleOnAxis() { const te = this.elements; const sx = te[0] * te[0] + te[1] * te[1] + te[2] * te[2], sy = te[4] * te[4] + te[5] * te[5] + te[6] * te[6], sz = te[8] * te[8] + te[9] * te[9] + te[10] * te[10]; return Math.sqrt(Math.max(sx, sy, sz)); }
  makeTranslation(x: N, y: N, z: N) { return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1); }
  makeRotationX(t: N) { const c = Math.cos(t), s = Math.sin(t); return this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1); }
  makeRotationY(t: N) { const c = Math.cos(t), s = Math.sin(t); return this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1); }
  makeRotationZ(t: N) { const c = Math.cos(t), s = Math.sin(t); return this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1); }
  makeRotationAxis(ax: A, ang: N) { const c = Math.cos(ang), s = Math.sin(ang), t = 1 - c, x = ax.x, y = ax.y, z = ax.z, tx = t * x, ty = t * y;
    return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1); }
  makeScale(x: N, y: N, z: N) { return this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1); }
  makeShear(x: N, y: N, z: N) { return this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1); }
  compose(p: A, q: A, s: A) {
    const te = this.elements, x = q._x, y = q._y, z = q._z, w = q._w, x2 = x + x, y2 = y + y, z2 = z + z, xx = x * x2, xy = x * y2, xz = x * z2, yy = y * y2, yz = y * z2, zz = z * z2, wx = w * x2, wy = w * y2, wz = w * z2, sx = s.x, sy = s.y, sz = s.z;
    te[0] = (1 - (yy + zz)) * sx; te[1] = (xy + wz) * sx; te[2] = (xz - wy) * sx; te[3] = 0;
    te[4] = (xy - wz) * sy; te[5] = (1 - (xx + zz)) * sy; te[6] = (yz + wx) * sy; te[7] = 0;
    te[8] = (xz + wy) * sz; te[9] = (yz - wx) * sz; te[10] = (1 - (xx + yy)) * sz; te[11] = 0;
    te[12] = p.x; te[13] = p.y; te[14] = p.z; te[15] = 1; return this;
  }
  decompose(p: A, q: A, s: A) {
    const te = this.elements; let sx = _mx.set(te[0], te[1], te[2]).length(); const sy = _mx.set(te[4], te[5], te[6]).length(), sz = _mx.set(te[8], te[9], te[10]).length();
    if (this.determinant() < 0) sx = -sx;
    p.x = te[12]; p.y = te[13]; p.z = te[14];
    _m1.copy(this); const isx = 1 / sx, isy = 1 / sy, isz = 1 / sz; const e = _m1.elements;
    e[0] *= isx; e[1] *= isx; e[2] *= isx; e[4] *= isy; e[5] *= isy; e[6] *= isy; e[8] *= isz; e[9] *= isz; e[10] *= isz;
    q.setFromRotationMatrix(_m1); s.x = sx; s.y = sy; s.z = sz; return this;
  }
  makePerspective(l: N, r: N, t: N, b: N, n: N, f: N) { const te = this.elements, x = 2 * n / (r - l), y = 2 * n / (t - b), a = (r + l) / (r - l), bb = (t + b) / (t - b), c = -(f + n) / (f - n), d = -2 * f * n / (f - n);
    te[0] = x; te[4] = 0; te[8] = a; te[12] = 0; te[1] = 0; te[5] = y; te[9] = bb; te[13] = 0; te[2] = 0; te[6] = 0; te[10] = c; te[14] = d; te[3] = 0; te[7] = 0; te[11] = -1; te[15] = 0; return this; }
  makeOrthographic(l: N, r: N, t: N, b: N, n: N, f: N) { const te = this.elements, w = 1 / (r - l), h = 1 / (t - b), p = 1 / (f - n), x = (r + l) * w, y = (t + b) * h, z = (f + n) * p;
    te[0] = 2 * w; te[4] = 0; te[8] = 0; te[12] = -x; te[1] = 0; te[5] = 2 * h; te[9] = 0; te[13] = -y; te[2] = 0; te[6] = 0; te[10] = -2 * p; te[14] = -z; te[3] = 0; te[7] = 0; te[11] = 0; te[15] = 1; return this; }
  equals(m: A) { const te = this.elements, me = m.elements; for (let i = 0; i < 16; i++) if (te[i] !== me[i]) return false; return true; }
  fromArray(a: A, o = 0) { for (let i = 0; i < 16; i++) this.elements[i] = a[i + o]; return this; }
  toArray(a: A = [], o = 0) { const te = this.elements; for (let i = 0; i < 16; i++) a[o + i] = te[i]; return a; }
}
const _m1 = new Matrix4();

// ---------------------------------------------------------------- Euler
const _mE = new Matrix4(), _qE = new Quaternion();
export class Euler {
  static DefaultOrder = 'XYZ'; static RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
  _x: N; _y: N; _z: N; _order: string; _onChangeCallback: () => void = () => {};
  constructor(x = 0, y = 0, z = 0, order = Euler.DefaultOrder) { this._x = x; this._y = y; this._z = z; this._order = order; }
  get isEuler() { return true; }
  get x() { return this._x; } set x(v) { this._x = v; this._onChangeCallback(); }
  get y() { return this._y; } set y(v) { this._y = v; this._onChangeCallback(); }
  get z() { return this._z; } set z(v) { this._z = v; this._onChangeCallback(); }
  get order() { return this._order; } set order(v) { this._order = v; this._onChangeCallback(); }
  set(x: N, y: N, z: N, order?: string) { this._x = x; this._y = y; this._z = z; this._order = order || this._order; this._onChangeCallback(); return this; }
  clone() { return new Euler(this._x, this._y, this._z, this._order); }
  copy(e: A) { this._x = e._x; this._y = e._y; this._z = e._z; this._order = e._order; this._onChangeCallback(); return this; }
  setFromRotationMatrix(m: A, order?: string, update?: boolean) {
    const cl = MathUtils.clamp, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
    order = order || this._order;
    switch (order) {
      case 'XYZ': this._y = Math.asin(cl(m13, -1, 1)); if (Math.abs(m13) < 0.9999999) { this._x = Math.atan2(-m23, m33); this._z = Math.atan2(-m12, m11); } else { this._x = Math.atan2(m32, m22); this._z = 0; } break;
      case 'YXZ': this._x = Math.asin(-cl(m23, -1, 1)); if (Math.abs(m23) < 0.9999999) { this._y = Math.atan2(m13, m33); this._z = Math.atan2(m21, m22); } else { this._y = Math.atan2(-m31, m11); this._z = 0; } break;
      case 'ZXY': this._x = Math.asin(cl(m32, -1, 1)); if (Math.abs(m32) < 0.9999999) { this._y = Math.atan2(-m31, m33); this._z = Math.atan2(-m12, m22); } else { this._y = 0; this._z = Math.atan2(m21, m11); } break;
      case 'ZYX': this._y = Math.asin(-cl(m31, -1, 1)); if (Math.abs(m31) < 0.9999999) { this._x = Math.atan2(m32, m33); this._z = Math.atan2(m21, m11); } else { this._x = 0; this._z = Math.atan2(-m12, m22); } break;
      case 'YZX': this._z = Math.asin(cl(m21, -1, 1)); if (Math.abs(m21) < 0.9999999) { this._x = Math.atan2(-m23, m22); this._y = Math.atan2(-m31, m11); } else { this._x = 0; this._y = Math.atan2(m13, m33); } break;
      case 'XZY': this._z = Math.asin(-cl(m12, -1, 1)); if (Math.abs(m12) < 0.9999999) { this._x = Math.atan2(m32, m22); this._y = Math.atan2(m13, m11); } else { this._x = Math.atan2(-m23, m33); this._y = 0; } break;
      default: console.warn('THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order);
    }
    this._order = order; if (update !== false) this._onChangeCallback(); return this;
  }
  setFromQuaternion(q: A, order?: string, update?: boolean) { _mE.makeRotationFromQuaternion(q); return this.setFromRotationMatrix(_mE, order, update); }
  setFromVector3(v: A, order?: string) { return this.set(v.x, v.y, v.z, order || this._order); }
  reorder(o: string) { _qE.setFromEuler(this); return this.setFromQuaternion(_qE, o); }
  equals(e: A) { return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order; }
  fromArray(a: A) { this._x = a[0]; this._y = a[1]; this._z = a[2]; if (a[3] !== undefined) this._order = a[3]; this._onChangeCallback(); return this; }
  toArray(a: A = [], o = 0) { a[o] = this._x; a[o + 1] = this._y; a[o + 2] = this._z; a[o + 3] = this._order; return a; }
  toVector3(t?: A) { return t ? t.set(this._x, this._y, this._z) : new Vector3(this._x, this._y, this._z); }
  _onChange(cb: () => void) { this._onChangeCallback = cb; return this; }
}

// ---------------------------------------------------------------- Color
const _names: Record<string, N> = { aliceblue: 0xF0F8FF, antiquewhite: 0xFAEBD7, aqua: 0x00FFFF, aquamarine: 0x7FFFD4, azure: 0xF0FFFF, beige: 0xF5F5DC, bisque: 0xFFE4C4, black: 0x000000, blanchedalmond: 0xFFEBCD, blue: 0x0000FF, blueviolet: 0x8A2BE2, brown: 0xA52A2A, burlywood: 0xDEB887, cadetblue: 0x5F9EA0, chartreuse: 0x7FFF00, chocolate: 0xD2691E, coral: 0xFF7F50, cornflowerblue: 0x6495ED, cornsilk: 0xFFF8DC, crimson: 0xDC143C, cyan: 0x00FFFF, darkblue: 0x00008B, darkcyan: 0x008B8B, darkgoldenrod: 0xB8860B, darkgray: 0xA9A9A9, darkgreen: 0x006400, darkgrey: 0xA9A9A9, darkkhaki: 0xBDB76B, darkmagenta: 0x8B008B, darkolivegreen: 0x556B2F, darkorange: 0xFF8C00, darkorchid: 0x9932CC, darkred: 0x8B0000, darksalmon: 0xE9967A, darkseagreen: 0x8FBC8F, darkslateblue: 0x483D8B, darkslategray: 0x2F4F4F, darkslategrey: 0x2F4F4F, darkturquoise: 0x00CED1, darkviolet: 0x9400D3, deeppink: 0xFF1493, deepskyblue: 0x00BFFF, dimgray: 0x696969, dimgrey: 0x696969, dodgerblue: 0x1E90FF, firebrick: 0xB22222, floralwhite: 0xFFFAF0, forestgreen: 0x228B22, fuchsia: 0xFF00FF, gainsboro: 0xDCDCDC, ghostwhite: 0xF8F8FF, gold: 0xFFD700, goldenrod: 0xDAA520, gray: 0x808080, green: 0x008000, greenyellow: 0xADFF2F, grey: 0x808080, honeydew: 0xF0FFF0, hotpink: 0xFF69B4, indianred: 0xCD5C5C, indigo: 0x4B0082, ivory: 0xFFFFF0, khaki: 0xF0E68C, lavender: 0xE6E6FA, lavenderblush: 0xFFF0F5, lawngreen: 0x7CFC00, lemonchiffon: 0xFFFACD, lightblue: 0xADD8E6, lightcoral: 0xF08080, lightcyan: 0xE0FFFF, lightgoldenrodyellow: 0xFAFAD2, lightgray: 0xD3D3D3, lightgreen: 0x90EE90, lightgrey: 0xD3D3D3, lightpink: 0xFFB6C1, lightsalmon: 0xFFA07A, lightseagreen: 0x20B2AA, lightskyblue: 0x87CEFA, lightslategray: 0x778899, lightslategrey: 0x778899, lightsteelblue: 0xB0C4DE, lightyellow: 0xFFFFE0, lime: 0x00FF00, limegreen: 0x32CD32, linen: 0xFAF0E6, magenta: 0xFF00FF, maroon: 0x800000, mediumaquamarine: 0x66CDAA, mediumblue: 0x0000CD, mediumorchid: 0xBA55D3, mediumpurple: 0x9370DB, mediumseagreen: 0x3CB371, mediumslateblue: 0x7B68EE, mediumspringgreen: 0x00FA9A, mediumturquoise: 0x48D1CC, mediumvioletred: 0xC71585, midnightblue: 0x191970, mintcream: 0xF5FFFA, mistyrose: 0xFFE4E1, moccasin: 0xFFE4B5, navajowhite: 0xFFDEAD, navy: 0x000080, oldlace: 0xFDF5E6, olive: 0x808000, olivedrab: 0x6B8E23, orange: 0xFFA500, orangered: 0xFF4500, orchid: 0xDA70D6, palegoldenrod: 0xEEE8AA, palegreen: 0x98FB98, paleturquoise: 0xAFEEEE, palevioletred: 0xDB7093, papayawhip: 0xFFEFD5, peachpuff: 0xFFDAB9, peru: 0xCD853F, pink: 0xFFC0CB, plum: 0xDDA0DD, powderblue: 0xB0E0E6, purple: 0x800080, rebeccapurple: 0x663399, red: 0xFF0000, rosybrown: 0xBC8F8F, royalblue: 0x4169E1, saddlebrown: 0x8B4513, salmon: 0xFA8072, sandybrown: 0xF4A460, seagreen: 0x2E8B57, seashell: 0xFFF5EE, sienna: 0xA0522D, silver: 0xC0C0C0, skyblue: 0x87CEEB, slateblue: 0x6A5ACD, slategray: 0x708090, slategrey: 0x708090, snow: 0xFFFAFA, springgreen: 0x00FF7F, steelblue: 0x4682B4, tan: 0xD2B48C, teal: 0x008080, thistle: 0xD8BFD8, tomato: 0xFF6347, turquoise: 0x40E0D0, violet: 0xEE82EE, wheat: 0xF5DEB3, white: 0xFFFFFF, whitesmoke: 0xF5F5F5, yellow: 0xFFFF00, yellowgreen: 0x9ACD32 };
const _hslA = { h: 0, s: 0, l: 0 }, _hslB = { h: 0, s: 0, l: 0 };
const hue2rgb = (p: N, q: N, t: N) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t); return p; };
const s2l = (c: N) => c < 0.04045 ? c * 0.0773993808 : Math.pow(c * 0.9478672986 + 0.0521327014, 2.4);
const l2s = (c: N) => c < 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 0.41666) - 0.055;
export class Color {
  static NAMES = _names;
  r = 1; g = 1; b = 1;
  constructor(r?: A, g?: N, b?: N) { if (g === undefined && b === undefined) this.set(r); else this.setRGB(r, g!, b!); }
  get isColor() { return true; }
  set(v: A) { if (v && v.isColor) this.copy(v); else if (typeof v === 'number') this.setHex(v); else if (typeof v === 'string') this.setStyle(v); return this; }
  setScalar(s: N) { this.r = s; this.g = s; this.b = s; return this; }
  setHex(h: N) { h = Math.floor(h); this.r = (h >> 16 & 255) / 255; this.g = (h >> 8 & 255) / 255; this.b = (h & 255) / 255; return this; }
  setRGB(r: N, g: N, b: N) { this.r = r; this.g = g; this.b = b; return this; }
  setHSL(h: N, s: N, l: N) { h = MathUtils.euclideanModulo(h, 1); s = MathUtils.clamp(s, 0, 1); l = MathUtils.clamp(l, 0, 1);
    if (s === 0) { this.r = this.g = this.b = l; } else { const p = l <= 0.5 ? l * (1 + s) : l + s - (l * s), q = (2 * l) - p; this.r = hue2rgb(q, p, h + 1 / 3); this.g = hue2rgb(q, p, h); this.b = hue2rgb(q, p, h - 1 / 3); } return this; }
  setStyle(style: string) {
    const handleAlpha = (s?: string) => { if (s === undefined) return; if (parseFloat(s) < 1) console.warn('THREE.Color: Alpha component of ' + style + ' will be ignored.'); };
    let m;
    if ((m = /^((?:rgb|hsl)a?)\(\s*([^\)]*)\)/.exec(style))) {
      let c; const name = m[1], comps = m[2];
      switch (name) {
        case 'rgb': case 'rgba':
          if ((c = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(comps))) { this.r = Math.min(255, parseInt(c[1], 10)) / 255; this.g = Math.min(255, parseInt(c[2], 10)) / 255; this.b = Math.min(255, parseInt(c[3], 10)) / 255; handleAlpha(c[4]); return this; }
          if ((c = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(comps))) { this.r = Math.min(100, parseInt(c[1], 10)) / 100; this.g = Math.min(100, parseInt(c[2], 10)) / 100; this.b = Math.min(100, parseInt(c[3], 10)) / 100; handleAlpha(c[4]); return this; }
          break;
        case 'hsl': case 'hsla':
          if ((c = /^\s*(\d*\.?\d+)\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(comps))) { const h = parseFloat(c[1]) / 360, s = parseInt(c[2], 10) / 100, l = parseInt(c[3], 10) / 100; handleAlpha(c[4]); return this.setHSL(h, s, l); }
          break;
      }
    } else if ((m = /^\#([A-Fa-f\d]+)$/.exec(style))) {
      const hex = m[1], size = hex.length;
      if (size === 3) { this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255; this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255; this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255; return this; }
      if (size === 6) { this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255; this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255; this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255; return this; }
    }
    if (style && style.length > 0) return this.setColorName(style);
    return this;
  }
  setColorName(s: string) { const h = _names[s.toLowerCase()]; if (h !== undefined) this.setHex(h); else console.warn('THREE.Color: Unknown color ' + s); return this; }
  clone() { return new Color(this.r, this.g, this.b); }
  copy(c: A) { this.r = c.r; this.g = c.g; this.b = c.b; return this; }
  copyGammaToLinear(c: A, f = 2.0) { this.r = Math.pow(c.r, f); this.g = Math.pow(c.g, f); this.b = Math.pow(c.b, f); return this; }
  copyLinearToGamma(c: A, f = 2.0) { const s = f > 0 ? 1.0 / f : 1.0; this.r = Math.pow(c.r, s); this.g = Math.pow(c.g, s); this.b = Math.pow(c.b, s); return this; }
  convertGammaToLinear(f?: N) { return this.copyGammaToLinear(this, f); } convertLinearToGamma(f?: N) { return this.copyLinearToGamma(this, f); }
  copySRGBToLinear(c: A) { this.r = s2l(c.r); this.g = s2l(c.g); this.b = s2l(c.b); return this; }
  copyLinearToSRGB(c: A) { this.r = l2s(c.r); this.g = l2s(c.g); this.b = l2s(c.b); return this; }
  convertSRGBToLinear() { return this.copySRGBToLinear(this); } convertLinearToSRGB() { return this.copyLinearToSRGB(this); }
  getHex() { return (this.r * 255) << 16 ^ (this.g * 255) << 8 ^ (this.b * 255) << 0; }
  getHexString() { return ('000000' + this.getHex().toString(16)).slice(-6); }
  getHSL(t: A) { const r = this.r, g = this.g, b = this.b, max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0, s = 0; const l = (min + max) / 2.0;
    if (min === max) { h = 0; s = 0; } else { const d = max - min; s = l <= 0.5 ? d / (max + min) : d / (2 - max - min);
      switch (max) { case r: h = (g - b) / d + (g < b ? 6 : 0); break; case g: h = (b - r) / d + 2; break; case b: h = (r - g) / d + 4; break; } h /= 6; }
    t.h = h; t.s = s; t.l = l; return t; }
  getStyle() { return 'rgb(' + ((this.r * 255) | 0) + ',' + ((this.g * 255) | 0) + ',' + ((this.b * 255) | 0) + ')'; }
  offsetHSL(h: N, s: N, l: N) { this.getHSL(_hslA); _hslA.h += h; _hslA.s += s; _hslA.l += l; this.setHSL(_hslA.h, _hslA.s, _hslA.l); return this; }
  add(c: A) { this.r += c.r; this.g += c.g; this.b += c.b; return this; }
  addColors(a: A, b: A) { this.r = a.r + b.r; this.g = a.g + b.g; this.b = a.b + b.b; return this; }
  addScalar(s: N) { this.r += s; this.g += s; this.b += s; return this; }
  sub(c: A) { this.r = Math.max(0, this.r - c.r); this.g = Math.max(0, this.g - c.g); this.b = Math.max(0, this.b - c.b); return this; }
  multiply(c: A) { this.r *= c.r; this.g *= c.g; this.b *= c.b; return this; }
  multiplyScalar(s: N) { this.r *= s; this.g *= s; this.b *= s; return this; }
  lerp(c: A, a: N) { this.r += (c.r - this.r) * a; this.g += (c.g - this.g) * a; this.b += (c.b - this.b) * a; return this; }
  lerpColors(a: A, b: A, t: N) { this.r = a.r + (b.r - a.r) * t; this.g = a.g + (b.g - a.g) * t; this.b = a.b + (b.b - a.b) * t; return this; }
  lerpHSL(c: A, a: N) { this.getHSL(_hslA); c.getHSL(_hslB); const h = MathUtils.lerp(_hslA.h, _hslB.h, a), s = MathUtils.lerp(_hslA.s, _hslB.s, a), l = MathUtils.lerp(_hslA.l, _hslB.l, a); this.setHSL(h, s, l); return this; }
  equals(c: A) { return c.r === this.r && c.g === this.g && c.b === this.b; }
  fromArray(a: A, o = 0) { this.r = a[o]; this.g = a[o + 1]; this.b = a[o + 2]; return this; }
  toArray(a: A = [], o = 0) { a[o] = this.r; a[o + 1] = this.g; a[o + 2] = this.b; return a; }
  fromBufferAttribute(at: A, i: N) { this.r = at.getX(i); this.g = at.getY(i); this.b = at.getZ(i); return this; }
  toJSON() { return this.getHex(); }
}

// ---------------------------------------------------------------- Box3, Sphere, Plane, Ray
const _bv = new Vector3(), _bb = new Vector3();
const _pts = [new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3(), new Vector3()];
export class Box3 {
  min: Vector3; max: Vector3;
  constructor(min = new Vector3(+Infinity, +Infinity, +Infinity), max = new Vector3(-Infinity, -Infinity, -Infinity)) { this.min = min; this.max = max; }
  get isBox3() { return true; }
  set(min: A, max: A) { this.min.copy(min); this.max.copy(max); return this; }
  setFromArray(a: A) { let x0 = +Infinity, y0 = +Infinity, z0 = +Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let i = 0, l = a.length; i < l; i += 3) { const x = a[i], y = a[i + 1], z = a[i + 2]; if (x < x0) x0 = x; if (y < y0) y0 = y; if (z < z0) z0 = z; if (x > x1) x1 = x; if (y > y1) y1 = y; if (z > z1) z1 = z; }
    this.min.set(x0, y0, z0); this.max.set(x1, y1, z1); return this; }
  setFromBufferAttribute(at: A) { let x0 = +Infinity, y0 = +Infinity, z0 = +Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let i = 0, l = at.count; i < l; i++) { const x = at.getX(i), y = at.getY(i), z = at.getZ(i); if (x < x0) x0 = x; if (y < y0) y0 = y; if (z < z0) z0 = z; if (x > x1) x1 = x; if (y > y1) y1 = y; if (z > z1) z1 = z; }
    this.min.set(x0, y0, z0); this.max.set(x1, y1, z1); return this; }
  setFromPoints(p: A[]) { this.makeEmpty(); for (const q of p) this.expandByPoint(q); return this; }
  setFromCenterAndSize(c: A, s: A) { const h = _bv.copy(s).multiplyScalar(0.5); this.min.copy(c).sub(h); this.max.copy(c).add(h); return this; }
  setFromObject(o: A) { this.makeEmpty(); return this.expandByObject(o); }
  clone() { return new Box3().copy(this); } copy(b: A) { this.min.copy(b.min); this.max.copy(b.max); return this; }
  makeEmpty() { this.min.x = this.min.y = this.min.z = +Infinity; this.max.x = this.max.y = this.max.z = -Infinity; return this; }
  isEmpty() { return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z); }
  getCenter(t: A) { return this.isEmpty() ? t.set(0, 0, 0) : t.addVectors(this.min, this.max).multiplyScalar(0.5); }
  getSize(t: A) { return this.isEmpty() ? t.set(0, 0, 0) : t.subVectors(this.max, this.min); }
  expandByPoint(p: A) { this.min.min(p); this.max.max(p); return this; }
  expandByVector(v: A) { this.min.sub(v); this.max.add(v); return this; }
  expandByScalar(s: N) { this.min.addScalar(-s); this.max.addScalar(s); return this; }
  expandByObject(o: A) {
    o.updateWorldMatrix(false, false); const g = o.geometry;
    if (g !== undefined) { if (g.boundingBox === null) g.computeBoundingBox(); _box.copy(g.boundingBox); _box.applyMatrix4(o.matrixWorld); this.union(_box); }
    const ch = o.children; for (let i = 0, l = ch.length; i < l; i++) this.expandByObject(ch[i]); return this;
  }
  containsPoint(p: A) { return !(p.x < this.min.x || p.x > this.max.x || p.y < this.min.y || p.y > this.max.y || p.z < this.min.z || p.z > this.max.z); }
  containsBox(b: A) { return this.min.x <= b.min.x && b.max.x <= this.max.x && this.min.y <= b.min.y && b.max.y <= this.max.y && this.min.z <= b.min.z && b.max.z <= this.max.z; }
  getParameter(p: A, t: A) { return t.set((p.x - this.min.x) / (this.max.x - this.min.x), (p.y - this.min.y) / (this.max.y - this.min.y), (p.z - this.min.z) / (this.max.z - this.min.z)); }
  intersectsBox(b: A) { return !(b.max.x < this.min.x || b.min.x > this.max.x || b.max.y < this.min.y || b.min.y > this.max.y || b.max.z < this.min.z || b.min.z > this.max.z); }
  intersectsSphere(s: A) { this.clampPoint(s.center, _bv); return _bv.distanceToSquared(s.center) <= (s.radius * s.radius); }
  intersectsPlane(p: A) { let mn, mx;
    if (p.normal.x > 0) { mn = p.normal.x * this.min.x; mx = p.normal.x * this.max.x; } else { mn = p.normal.x * this.max.x; mx = p.normal.x * this.min.x; }
    if (p.normal.y > 0) { mn += p.normal.y * this.min.y; mx += p.normal.y * this.max.y; } else { mn += p.normal.y * this.max.y; mx += p.normal.y * this.min.y; }
    if (p.normal.z > 0) { mn += p.normal.z * this.min.z; mx += p.normal.z * this.max.z; } else { mn += p.normal.z * this.max.z; mx += p.normal.z * this.min.z; }
    return (mn <= -p.constant && mx >= -p.constant); }
  clampPoint(p: A, t: A) { return t.copy(p).clamp(this.min, this.max); }
  distanceToPoint(p: A) { const c = _bv.copy(p).clamp(this.min, this.max); return c.sub(p).length(); }
  getBoundingSphere(t: A) { this.getCenter(t.center); t.radius = this.getSize(_bv).length() * 0.5; return t; }
  intersect(b: A) { this.min.max(b.min); this.max.min(b.max); if (this.isEmpty()) this.makeEmpty(); return this; }
  union(b: A) { this.min.min(b.min); this.max.max(b.max); return this; }
  applyMatrix4(m: A) {
    if (this.isEmpty()) return this;
    _pts[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(m); _pts[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(m);
    _pts[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(m); _pts[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(m);
    _pts[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(m); _pts[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(m);
    _pts[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(m); _pts[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(m);
    this.setFromPoints(_pts); return this;
  }
  translate(o: A) { this.min.add(o); this.max.add(o); return this; }
  equals(b: A) { return b.min.equals(this.min) && b.max.equals(this.max); }
}
const _box = new Box3();

export class Sphere {
  center: Vector3; radius: N;
  constructor(center = new Vector3(), radius = -1) { this.center = center; this.radius = radius; }
  set(c: A, r: N) { this.center.copy(c); this.radius = r; return this; }
  setFromPoints(p: A[], oc?: A) { const c = this.center; if (oc !== undefined) c.copy(oc); else _box.setFromPoints(p).getCenter(c);
    let m = 0; for (const q of p) m = Math.max(m, c.distanceToSquared(q)); this.radius = Math.sqrt(m); return this; }
  copy(s: A) { this.center.copy(s.center); this.radius = s.radius; return this; }
  clone() { return new Sphere().copy(this); }
  isEmpty() { return this.radius < 0; } makeEmpty() { this.center.set(0, 0, 0); this.radius = -1; return this; }
  containsPoint(p: A) { return p.distanceToSquared(this.center) <= this.radius * this.radius; }
  distanceToPoint(p: A) { return p.distanceTo(this.center) - this.radius; }
  intersectsSphere(s: A) { const r = this.radius + s.radius; return s.center.distanceToSquared(this.center) <= r * r; }
  intersectsBox(b: A) { return b.intersectsSphere(this); }
  intersectsPlane(p: A) { return Math.abs(p.distanceToPoint(this.center)) <= this.radius; }
  clampPoint(p: A, t: A) { const d = this.center.distanceToSquared(p); t.copy(p); if (d > this.radius * this.radius) { t.sub(this.center).normalize(); t.multiplyScalar(this.radius).add(this.center); } return t; }
  getBoundingBox(t: A) { if (this.isEmpty()) { t.makeEmpty(); return t; } t.set(this.center, this.center); t.expandByScalar(this.radius); return t; }
  applyMatrix4(m: A) { this.center.applyMatrix4(m); this.radius = this.radius * m.getMaxScaleOnAxis(); return this; }
  translate(o: A) { this.center.add(o); return this; }
  union(s: A) { _box.makeEmpty(); this.getBoundingBox(_box); const b2 = s.getBoundingBox(new Box3()); _box.union(b2); _box.getBoundingSphere(this); return this; }
  equals(s: A) { return s.center.equals(this.center) && s.radius === this.radius; }
}

const _pv = new Vector3(), _pv2 = new Vector3(), _pm3 = new Matrix3();
export class Plane {
  normal: Vector3; constant: N;
  constructor(normal = new Vector3(1, 0, 0), constant = 0) { this.normal = normal; this.constant = constant; }
  get isPlane() { return true; }
  set(n: A, c: N) { this.normal.copy(n); this.constant = c; return this; }
  setComponents(x: N, y: N, z: N, w: N) { this.normal.set(x, y, z); this.constant = w; return this; }
  setFromNormalAndCoplanarPoint(n: A, p: A) { this.normal.copy(n); this.constant = -p.dot(this.normal); return this; }
  setFromCoplanarPoints(a: A, b: A, c: A) { const n = _pv.subVectors(c, b).cross(_pv2.subVectors(a, b)).normalize(); this.setFromNormalAndCoplanarPoint(n, a); return this; }
  copy(p: A) { this.normal.copy(p.normal); this.constant = p.constant; return this; }
  normalize() { const i = 1.0 / this.normal.length(); this.normal.multiplyScalar(i); this.constant *= i; return this; }
  negate() { this.constant *= -1; this.normal.negate(); return this; }
  distanceToPoint(p: A) { return this.normal.dot(p) + this.constant; }
  distanceToSphere(s: A) { return this.distanceToPoint(s.center) - s.radius; }
  projectPoint(p: A, t: A) { return t.copy(this.normal).multiplyScalar(-this.distanceToPoint(p)).add(p); }
  intersectLine(l: A, t: A) { const dir = l.delta(_pv), den = this.normal.dot(dir);
    if (den === 0) { if (this.distanceToPoint(l.start) === 0) return t.copy(l.start); return null; }
    const u = -(l.start.dot(this.normal) + this.constant) / den; if (u < 0 || u > 1) return null; return t.copy(dir).multiplyScalar(u).add(l.start); }
  intersectsBox(b: A) { return b.intersectsPlane(this); } intersectsSphere(s: A) { return s.intersectsPlane(this); }
  coplanarPoint(t: A) { return t.copy(this.normal).multiplyScalar(-this.constant); }
  applyMatrix4(m: A, nm?: A) { const n = nm || _pm3.getNormalMatrix(m), rp = this.coplanarPoint(_pv).applyMatrix4(m), no = this.normal.applyMatrix3(n).normalize(); this.constant = -rp.dot(no); return this; }
  translate(o: A) { this.constant -= o.dot(this.normal); return this; }
  equals(p: A) { return p.normal.equals(this.normal) && p.constant === this.constant; }
  clone() { return new Plane().copy(this); }
}

const _rv = new Vector3(), _rSeg = new Vector3(), _rDir = new Vector3(), _rDiff = new Vector3(), _rE1 = new Vector3(), _rE2 = new Vector3(), _rN = new Vector3();
export class Ray {
  origin: Vector3; direction: Vector3;
  constructor(origin = new Vector3(), direction = new Vector3(0, 0, -1)) { this.origin = origin; this.direction = direction; }
  set(o: A, d: A) { this.origin.copy(o); this.direction.copy(d); return this; }
  copy(r: A) { this.origin.copy(r.origin); this.direction.copy(r.direction); return this; }
  clone() { return new Ray().copy(this); }
  at(t: N, tg: A) { return tg.copy(this.direction).multiplyScalar(t).add(this.origin); }
  lookAt(v: A) { this.direction.copy(v).sub(this.origin).normalize(); return this; }
  recast(t: N) { this.origin.copy(this.at(t, _rv)); return this; }
  closestPointToPoint(p: A, t: A) { t.subVectors(p, this.origin); const d = t.dot(this.direction); if (d < 0) return t.copy(this.origin); return t.copy(this.direction).multiplyScalar(d).add(this.origin); }
  distanceToPoint(p: A) { return Math.sqrt(this.distanceSqToPoint(p)); }
  distanceSqToPoint(p: A) { const d = _rv.subVectors(p, this.origin).dot(this.direction); if (d < 0) return this.origin.distanceToSquared(p); _rv.copy(this.direction).multiplyScalar(d).add(this.origin); return _rv.distanceToSquared(p); }
  distanceSqToSegment(v0: A, v1: A, oR?: A, oS?: A) {
    _rSeg.copy(v0).add(v1).multiplyScalar(0.5); _rDir.copy(v1).sub(v0).normalize(); _rDiff.copy(this.origin).sub(_rSeg);
    const segExt = v0.distanceTo(v1) * 0.5, a01 = -this.direction.dot(_rDir), b0 = _rDiff.dot(this.direction), b1 = -_rDiff.dot(_rDir), c = _rDiff.lengthSq(), det = Math.abs(1 - a01 * a01);
    let s0, s1, sq, ext;
    if (det > 0) { s0 = a01 * b1 - b0; s1 = a01 * b0 - b1; ext = segExt * det;
      if (s0 >= 0) { if (s1 >= -ext) { if (s1 <= ext) { const id = 1 / det; s0 *= id; s1 *= id; sq = s0 * (s0 + a01 * s1 + 2 * b0) + s1 * (a01 * s0 + s1 + 2 * b1) + c; } else { s1 = segExt; s0 = Math.max(0, -(a01 * s1 + b0)); sq = -s0 * s0 + s1 * (s1 + 2 * b1) + c; } }
        else { s1 = -segExt; s0 = Math.max(0, -(a01 * s1 + b0)); sq = -s0 * s0 + s1 * (s1 + 2 * b1) + c; } }
      else { if (s1 <= -ext) { s0 = Math.max(0, -(-a01 * segExt + b0)); s1 = (s0 > 0) ? -segExt : Math.min(Math.max(-segExt, -b1), segExt); sq = -s0 * s0 + s1 * (s1 + 2 * b1) + c; }
        else if (s1 <= ext) { s0 = 0; s1 = Math.min(Math.max(-segExt, -b1), segExt); sq = s1 * (s1 + 2 * b1) + c; }
        else { s0 = Math.max(0, -(a01 * segExt + b0)); s1 = (s0 > 0) ? segExt : Math.min(Math.max(-segExt, -b1), segExt); sq = -s0 * s0 + s1 * (s1 + 2 * b1) + c; } }
    } else { s1 = (a01 > 0) ? -segExt : segExt; s0 = Math.max(0, -(a01 * s1 + b0)); sq = -s0 * s0 + s1 * (s1 + 2 * b1) + c; }
    if (oR) oR.copy(this.direction).multiplyScalar(s0).add(this.origin); if (oS) oS.copy(_rDir).multiplyScalar(s1).add(_rSeg); return sq;
  }
  intersectSphere(s: A, t: A) { _rv.subVectors(s.center, this.origin); const tca = _rv.dot(this.direction), d2 = _rv.dot(_rv) - tca * tca, r2 = s.radius * s.radius;
    if (d2 > r2) return null; const thc = Math.sqrt(r2 - d2), t0 = tca - thc, t1 = tca + thc; if (t0 < 0 && t1 < 0) return null; if (t0 < 0) return this.at(t1, t); return this.at(t0, t); }
  intersectsSphere(s: A) { return this.distanceSqToPoint(s.center) <= (s.radius * s.radius); }
  distanceToPlane(p: A) { const den = p.normal.dot(this.direction); if (den === 0) { if (p.distanceToPoint(this.origin) === 0) return 0; return null; } const t = -(this.origin.dot(p.normal) + p.constant) / den; return t >= 0 ? t : null; }
  intersectPlane(p: A, t: A) { const d = this.distanceToPlane(p); if (d === null) return null; return this.at(d, t); }
  intersectsPlane(p: A) { const d = p.distanceToPoint(this.origin); if (d === 0) return true; const den = p.normal.dot(this.direction); if (den * d < 0) return true; return false; }
  intersectBox(b: A, t: A) {
    let tmin, tmax, tymin, tymax, tzmin, tzmax; const ix = 1 / this.direction.x, iy = 1 / this.direction.y, iz = 1 / this.direction.z, o = this.origin;
    if (ix >= 0) { tmin = (b.min.x - o.x) * ix; tmax = (b.max.x - o.x) * ix; } else { tmin = (b.max.x - o.x) * ix; tmax = (b.min.x - o.x) * ix; }
    if (iy >= 0) { tymin = (b.min.y - o.y) * iy; tymax = (b.max.y - o.y) * iy; } else { tymin = (b.max.y - o.y) * iy; tymax = (b.min.y - o.y) * iy; }
    if ((tmin > tymax) || (tymin > tmax)) return null;
    if (tymin > tmin || tmin !== tmin) tmin = tymin; if (tymax < tmax || tmax !== tmax) tmax = tymax;
    if (iz >= 0) { tzmin = (b.min.z - o.z) * iz; tzmax = (b.max.z - o.z) * iz; } else { tzmin = (b.max.z - o.z) * iz; tzmax = (b.min.z - o.z) * iz; }
    if ((tmin > tzmax) || (tzmin > tmax)) return null;
    if (tzmin > tmin || tmin !== tmin) tmin = tzmin; if (tzmax < tmax || tmax !== tmax) tmax = tzmax;
    if (tmax < 0) return null; return this.at(tmin >= 0 ? tmin : tmax, t);
  }
  intersectsBox(b: A) { return this.intersectBox(b, _rv) !== null; }
  intersectTriangle(a: A, b: A, c: A, cull: boolean, t: A) {
    _rE1.subVectors(b, a); _rE2.subVectors(c, a); _rN.crossVectors(_rE1, _rE2);
    let DdN = this.direction.dot(_rN), sign;
    if (DdN > 0) { if (cull) return null; sign = 1; } else if (DdN < 0) { sign = -1; DdN = -DdN; } else return null;
    _rDiff.subVectors(this.origin, a); const DdQxE2 = sign * this.direction.dot(_rE2.crossVectors(_rDiff, _rE2)); if (DdQxE2 < 0) return null;
    const DdE1xQ = sign * this.direction.dot(_rE1.cross(_rDiff)); if (DdE1xQ < 0) return null; if (DdQxE2 + DdE1xQ > DdN) return null;
    const QdN = -sign * _rDiff.dot(_rN); if (QdN < 0) return null; return this.at(QdN / DdN, t);
  }
  applyMatrix4(m: A) { this.origin.applyMatrix4(m); this.direction.transformDirection(m); return this; }
  equals(r: A) { return r.origin.equals(this.origin) && r.direction.equals(this.direction); }
}
