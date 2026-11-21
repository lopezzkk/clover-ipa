// Confere a matemática própria (src/compat/matematica.ts) contra o three.js r128, conta por conta.
// Uso: node testes/matematica.mjs /caminho/three.min.js
import fs from 'fs'; import path from 'path'; import { createRequire } from 'module'; import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url); const D = path.dirname(fileURLToPath(import.meta.url));
let esbuild; try { esbuild = require('esbuild'); } catch { esbuild = require('/opt/npm-tools/node_modules/esbuild'); }
const out = esbuild.buildSync({ entryPoints: [path.join(D, '../src/compat/matematica.ts')], bundle: true, format: 'cjs', write: false, platform: 'node' });
const mod = { exports: {} }; new Function('module', 'exports', out.outputFiles[0].text)(mod, mod.exports); const M = mod.exports;
const T = require(process.argv[2] || '/tmp/claude-0/three/three.min.js');
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const r = (a = 10) => (rnd() * 2 - 1) * a;
const ORD = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
let ok = 0, falhas = []; const tol = 1e-9;
const num = v => typeof v === 'number';
const flat = o => { if (o == null) return [o]; if (num(o) || typeof o === 'boolean' || typeof o === 'string') return [o];
  if (Array.isArray(o.elements)) return [...o.elements]; if (o.isQuaternion) return [o.x, o.y, o.z, o.w]; if (o.isEuler) return [o.x, o.y, o.z, o.order];
  if (o.isColor) return [o.r, o.g, o.b]; if (o.min && o.min.isVector3) return [...flat(o.min), ...flat(o.max)]; if (o.center && o.center.isVector3) return [...flat(o.center), o.radius];
  if (o.normal && o.normal.isVector3) return [...flat(o.normal), o.constant]; if (o.origin && o.origin.isVector3) return [...flat(o.origin), ...flat(o.direction)];
  if ('w' in o) return [o.x, o.y, o.z, o.w]; if ('z' in o) return [o.x, o.y, o.z]; if ('x' in o) return [o.x, o.y]; if ('h' in o) return [o.h, o.s, o.l]; return [JSON.stringify(o)]; };
const igual = (a, b) => { const A = flat(a), B = flat(b); if (A.length !== B.length) return false;
  for (let i = 0; i < A.length; i++) { const x = A[i], y = B[i]; if (num(x) && num(y)) { if (Number.isNaN(x) && Number.isNaN(y)) continue; if (x === y) continue; if (Math.abs(x - y) > tol * Math.max(1, Math.abs(x), Math.abs(y))) return false; } else if (x !== y) return false; } return true; };
// cria o mesmo objeto nas duas bibliotecas a partir de números
const mk = {
  v2: L => new L.Vector2(r(), r()), v3: L => new L.Vector3(r(), r(), r()), v3u: L => new L.Vector3(r(), r(), r()).normalize(), v4: L => new L.Vector4(r(), r(), r(), r()),
  q: L => new L.Quaternion(r(), r(), r(), r()).normalize(), e: L => new L.Euler(r(4), r(4), r(4), ORD[(rnd() * 6) | 0]),
  m4: L => new L.Matrix4().compose(new L.Vector3(r(), r(), r()), new L.Quaternion(r(), r(), r(), r()).normalize(), new L.Vector3(r(3) || 1, r(3) || 1, r(3) || 1)),
  m4r: L => new L.Matrix4().fromArray(Array.from({ length: 16 }, () => r())), m3: L => new L.Matrix3().fromArray(Array.from({ length: 9 }, () => r())),
  c: L => new L.Color(rnd(), rnd(), rnd()), b: L => new L.Box3(new L.Vector3(r(), r(), r()), new L.Vector3(r(), r(), r())).union(new L.Box3(new L.Vector3(r(), r(), r()), new L.Vector3(r(), r(), r()))),
  s: L => new L.Sphere(new L.Vector3(r(), r(), r()), Math.abs(r())), p: L => new L.Plane(new L.Vector3(r(), r(), r()).normalize(), r()),
  ray: L => new L.Ray(new L.Vector3(r(), r(), r()), new L.Vector3(r(), r(), r()).normalize()), n: () => r(), n01: () => rnd(), ord: () => ORD[(rnd() * 6) | 0],
  hex: () => (rnd() * 0xffffff) | 0, sty: () => ['#ff8800', '#abc', 'rgb(10,200,30)', 'hsl(200,50%,40%)', 'red', 'rebeccapurple', 'rgb(10%,20%,90%)'][(rnd() * 7) | 0],
};
// [tipo do objeto, método, tipos dos argumentos]
const C = [
  ['v2', 'add', ['v2']], ['v2', 'sub', ['v2']], ['v2', 'multiplyScalar', ['n']], ['v2', 'normalize', []], ['v2', 'length', []], ['v2', 'angle', []], ['v2', 'distanceTo', ['v2']], ['v2', 'lerp', ['v2', 'n01']], ['v2', 'rotateAround', ['v2', 'n']], ['v2', 'applyMatrix3', ['m3']], ['v2', 'cross', ['v2']], ['v2', 'clampLength', ['n01', 'n01']], ['v2', 'setLength', ['n']],
  ['v3', 'add', ['v3']], ['v3', 'addScaledVector', ['v3', 'n']], ['v3', 'sub', ['v3']], ['v3', 'multiply', ['v3']], ['v3', 'divide', ['v3']], ['v3', 'applyEuler', ['e']], ['v3', 'applyAxisAngle', ['v3u', 'n']],
  ['v3', 'applyMatrix3', ['m3']], ['v3', 'applyNormalMatrix', ['m3']], ['v3', 'applyMatrix4', ['m4']], ['v3', 'applyMatrix4', ['m4r']], ['v3', 'applyQuaternion', ['q']], ['v3', 'transformDirection', ['m4']],
  ['v3', 'min', ['v3']], ['v3', 'max', ['v3']], ['v3', 'clamp', ['v3', 'v3']], ['v3', 'clampScalar', ['n', 'n']], ['v3', 'clampLength', ['n01', 'n']], ['v3', 'floor', []], ['v3', 'round', []], ['v3', 'roundToZero', []],
  ['v3', 'negate', []], ['v3', 'dot', ['v3']], ['v3', 'lengthSq', []], ['v3', 'length', []], ['v3', 'manhattanLength', []], ['v3', 'normalize', []], ['v3', 'setLength', ['n']], ['v3', 'lerp', ['v3', 'n01']], ['v3', 'lerpVectors', ['v3', 'v3', 'n01']],
  ['v3', 'cross', ['v3']], ['v3', 'crossVectors', ['v3', 'v3']], ['v3', 'projectOnVector', ['v3']], ['v3', 'projectOnPlane', ['v3u']], ['v3', 'reflect', ['v3u']], ['v3', 'angleTo', ['v3']], ['v3', 'distanceTo', ['v3']], ['v3', 'distanceToSquared', ['v3']],
  ['v3', 'manhattanDistanceTo', ['v3']], ['v3', 'setFromSphericalCoords', ['n', 'n', 'n']], ['v3', 'setFromCylindricalCoords', ['n', 'n', 'n']], ['v3', 'setFromMatrixPosition', ['m4']], ['v3', 'setFromMatrixScale', ['m4']], ['v3', 'setFromMatrixColumn', ['m4', 'n01']], ['v3', 'equals', ['v3']],
  ['v4', 'applyMatrix4', ['m4r']], ['v4', 'normalize', []], ['v4', 'lerp', ['v4', 'n01']],
  ['q', 'setFromEuler', ['e']], ['q', 'setFromAxisAngle', ['v3u', 'n']], ['q', 'setFromRotationMatrix', ['m4']], ['q', 'setFromUnitVectors', ['v3u', 'v3u']], ['q', 'angleTo', ['q']], ['q', 'rotateTowards', ['q', 'n01']], ['q', 'invert', []],
  ['q', 'multiply', ['q']], ['q', 'premultiply', ['q']], ['q', 'slerp', ['q', 'n01']], ['q', 'normalize', []], ['q', 'dot', ['q']], ['q', 'length', []],
  ['e', 'setFromRotationMatrix', ['m4', 'ord']], ['e', 'setFromQuaternion', ['q', 'ord']], ['e', 'reorder', ['ord']], ['e', 'setFromVector3', ['v3']],
  ['m3', 'multiply', ['m3']], ['m3', 'premultiply', ['m3']], ['m3', 'invert', []], ['m3', 'transpose', []], ['m3', 'determinant', []], ['m3', 'getNormalMatrix', ['m4']], ['m3', 'setFromMatrix4', ['m4r']],
  ['m3', 'setUvTransform', ['n', 'n', 'n', 'n', 'n', 'n', 'n']], ['m3', 'scale', ['n', 'n']], ['m3', 'rotate', ['n']], ['m3', 'translate', ['n', 'n']], ['m3', 'multiplyScalar', ['n']],
  ['m4', 'multiply', ['m4']], ['m4', 'premultiply', ['m4r']], ['m4', 'multiplyMatrices', ['m4r', 'm4r']], ['m4', 'invert', []], ['m4r', 'invert', []], ['m4r', 'determinant', []], ['m4', 'transpose', []], ['m4', 'extractRotation', ['m4']],
  ['m4', 'makeRotationFromEuler', ['e']], ['m4', 'makeRotationFromQuaternion', ['q']], ['m4', 'lookAt', ['v3', 'v3', 'v3u']], ['m4', 'scale', ['v3']], ['m4', 'getMaxScaleOnAxis', []], ['m4', 'makeTranslation', ['n', 'n', 'n']],
  ['m4', 'makeRotationX', ['n']], ['m4', 'makeRotationY', ['n']], ['m4', 'makeRotationZ', ['n']], ['m4', 'makeRotationAxis', ['v3u', 'n']], ['m4', 'makeScale', ['n', 'n', 'n']], ['m4', 'makeShear', ['n', 'n', 'n']],
  ['m4', 'compose', ['v3', 'q', 'v3']], ['m4', 'setPosition', ['v3']], ['m4', 'makePerspective', ['n', 'n', 'n', 'n', 'n', 'n']], ['m4', 'makeOrthographic', ['n', 'n', 'n', 'n', 'n', 'n']], ['m4', 'makeBasis', ['v3', 'v3', 'v3']], ['m4', 'setFromMatrix3', ['m3']], ['m4', 'copyPosition', ['m4r']],
  ['c', 'setHex', ['hex']], ['c', 'setHSL', ['n', 'n01', 'n01']], ['c', 'setStyle', ['sty']], ['c', 'getHex', []], ['c', 'getHexString', []], ['c', 'getStyle', []], ['c', 'offsetHSL', ['n01', 'n01', 'n01']], ['c', 'lerp', ['c', 'n01']],
  ['c', 'lerpHSL', ['c', 'n01']], ['c', 'convertSRGBToLinear', []], ['c', 'convertLinearToSRGB', []], ['c', 'convertGammaToLinear', []], ['c', 'convertLinearToGamma', []], ['c', 'multiply', ['c']], ['c', 'sub', ['c']], ['c', 'addScalar', ['n01']], ['c', 'multiplyScalar', ['n01']],
  ['b', 'getCenter', ['v3']], ['b', 'getSize', ['v3']], ['b', 'expandByPoint', ['v3']], ['b', 'expandByScalar', ['n01']], ['b', 'containsPoint', ['v3']], ['b', 'intersectsBox', ['b']], ['b', 'intersectsSphere', ['s']], ['b', 'intersectsPlane', ['p']],
  ['b', 'distanceToPoint', ['v3']], ['b', 'intersect', ['b']], ['b', 'union', ['b']], ['b', 'applyMatrix4', ['m4']], ['b', 'translate', ['v3']], ['b', 'clampPoint', ['v3', 'v3']], ['b', 'isEmpty', []],
  ['s', 'containsPoint', ['v3']], ['s', 'distanceToPoint', ['v3']], ['s', 'intersectsSphere', ['s']], ['s', 'applyMatrix4', ['m4']], ['s', 'clampPoint', ['v3', 'v3']], ['s', 'getBoundingBox', ['b']], ['s', 'intersectsPlane', ['p']],
  ['p', 'distanceToPoint', ['v3']], ['p', 'projectPoint', ['v3', 'v3']], ['p', 'applyMatrix4', ['m4']], ['p', 'translate', ['v3']], ['p', 'negate', []], ['p', 'setFromCoplanarPoints', ['v3', 'v3', 'v3']], ['p', 'coplanarPoint', ['v3']],
  ['ray', 'at', ['n', 'v3']], ['ray', 'distanceToPoint', ['v3']], ['ray', 'closestPointToPoint', ['v3', 'v3']], ['ray', 'intersectSphere', ['s', 'v3']], ['ray', 'intersectPlane', ['p', 'v3']], ['ray', 'intersectBox', ['b', 'v3']],
  ['ray', 'intersectsBox', ['b']], ['ray', 'intersectTriangle', ['v3', 'v3', 'v3', 'n01', 'v3']], ['ray', 'distanceSqToSegment', ['v3', 'v3', 'v3', 'v3']], ['ray', 'applyMatrix4', ['m4']], ['ray', 'intersectsPlane', ['p']],
];
const REP = +(process.argv[3] || 300);
for (const [tipo, met, args] of C) {
  let f = 0;
  for (let k = 0; k < REP; k++) {
    const s0 = seed; const oT = mk[tipo](T); const aT = args.map(a => mk[a](T));
    seed = s0; const oM = mk[tipo](M); const aM = args.map(a => mk[a](M));
    if (met === 'intersectTriangle') { aT[3] = aT[3] > 0.5; aM[3] = aM[3] > 0.5; }
    let rT, rM; try { rT = oT[met](...aT); } catch (e) { rT = 'ERRO ' + e.message; } try { rM = oM[met](...aM); } catch (e) { rM = 'ERRO ' + e.message; }
    const tudoT = [oT, rT === oT ? 'self' : rT, ...aT], tudoM = [oM, rM === oM ? 'self' : rM, ...aM];
    let bom = tudoT.length === tudoM.length && tudoT.every((x, i) => igual(x, tudoM[i]));
    if (bom) ok++; else { f++; if (f <= 1) falhas.push(`${tipo}.${met}: three=${JSON.stringify(flat(rT === oT ? oT : rT)).slice(0, 160)} novo=${JSON.stringify(flat(rM === oM ? oM : rM)).slice(0, 160)}`); }
  }
  if (f) falhas.push(`   ↳ ${tipo}.${met}: ${f}/${REP} diferentes`);
}
// MathUtils
for (const fn of ['clamp', 'euclideanModulo', 'mapLinear', 'lerp', 'smoothstep', 'smootherstep', 'degToRad', 'radToDeg', 'inverseLerp', 'damp', 'pingpong']) {
  for (let k = 0; k < REP; k++) { const a = [r(), r(), r(), r(), r()]; const x = T.MathUtils[fn] ? T.MathUtils[fn](...a) : undefined; if (x === undefined) break; const y = M.MathUtils[fn](...a); if (igual(x, y)) ok++; else { falhas.push('MathUtils.' + fn); break; } }
}
console.log(JSON.stringify({ contas_iguais: ok, metodos: C.length, falhas }, null, 1));
process.exit(falhas.length ? 1 : 0);
