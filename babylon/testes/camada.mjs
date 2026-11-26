// Confere a camada própria inteira (montar-compat.mjs) contra o three.js r128 original:
// formas (todas as geometrias com medidas aleatórias), árvore de objetos, câmera, raio de clique e materiais.
// Uso: node testes/camada.mjs /caminho/three.min.js
import vm from 'vm'; import fs from 'fs'; import { montarCompat } from '../montar-compat.mjs';
const ctx = (src) => { const c = { console, Math, Float32Array, Uint16Array, Uint32Array, Int32Array, Uint8Array, Int8Array, Int16Array, Float64Array, Uint8ClampedArray, ArrayBuffer, DataView, Array, Object, JSON, Number, String, Symbol, Map, Set, WeakMap, Error, TypeError, Promise, Date, performance };
  c.window = c; c.self = c; c.document = { createElementNS: () => ({ style: {} }), createElement: () => ({ style: {} }) }; vm.createContext(c); vm.runInContext(src, c); return c.THREE; };
const A = ctx(fs.readFileSync(process.argv[2] || '/tmp/claude-0/three/three.min.js', 'utf8')), B = ctx((await montarCompat()).txt);
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const r = (a = 3) => rnd() * a; const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
let ok = 0; const falhas = [];
const arr = x => x == null ? null : Array.from(x);
const cmp = (nome, a, b) => { const x = JSON.stringify(a), y = JSON.stringify(b); if (x === y) { ok++; return; }
  const ax = JSON.parse(x), bx = JSON.parse(y); const flat = o => Array.isArray(o) ? o.flatMap(flat) : (o && typeof o === 'object') ? Object.values(o).flatMap(flat) : [o];
  const fa = flat(ax), fb = flat(bx); if (fa.length === fb.length && fa.every((v, i) => v === fb[i] || (typeof v === 'number' && Math.abs(v - fb[i]) < 1e-9 * Math.max(1, Math.abs(v))))) { ok++; return; }
  falhas.push(nome + ': ' + x.slice(0, 120) + ' ≠ ' + y.slice(0, 120)); };
const geo = g => ({ a: Object.fromEntries(Object.entries(g.attributes).map(([k, v]) => [k, [v.itemSize, arr(v.array)]])), i: g.index ? arr(g.index.array) : null, gr: g.groups, bb: (g.computeBoundingBox(), [g.boundingBox.min.toArray(), g.boundingBox.max.toArray()]), bs: (g.computeBoundingSphere(), [g.boundingSphere.center.toArray(), g.boundingSphere.radius]) });
const GEO = [
  ['SphereGeometry', () => [r(2) + .1, ri(3, 24), ri(2, 16), r(1), r(6.3), r(1), r(3.14)]], ['CylinderGeometry', () => [r(), r(), r(4) + .1, ri(3, 24), ri(1, 4), rnd() > .5, r(1), r(6.3)]],
  ['ConeGeometry', () => [r() + .1, r(4) + .1, ri(3, 24), ri(1, 3), rnd() > .5]], ['BoxGeometry', () => [r() + .1, r() + .1, r() + .1, ri(1, 3), ri(1, 3), ri(1, 3)]],
  ['TorusGeometry', () => [r() + .5, r(.4) + .02, ri(3, 12), ri(3, 48), r(6.3)]], ['PlaneGeometry', () => [r() + .1, r() + .1, ri(1, 8), ri(1, 8)]], ['CircleGeometry', () => [r() + .1, ri(3, 48), r(1), r(6.3)]],
  ['RingGeometry', () => [r(.5) + .1, r() + .7, ri(3, 48), ri(1, 3), r(1), r(6.3)]], ['OctahedronGeometry', () => [r() + .1, ri(0, 2)]], ['IcosahedronGeometry', () => [r() + .1, ri(0, 2)]],
  ['DodecahedronGeometry', () => [r() + .1, ri(0, 1)]], ['TetrahedronGeometry', () => [r() + .1, ri(0, 2)]], ['TorusKnotGeometry', () => [r() + .5, r(.3) + .05, ri(8, 40), ri(3, 8)]],
];
for (const [n, p] of GEO) for (let k = 0; k < 40; k++) { const s = seed; const a = p(); seed = s; p(); cmp(n + JSON.stringify(a.map(v => typeof v === 'number' ? +v.toFixed(3) : v)), geo(new A[n](...a)), geo(new B[n](...a))); }
// Lathe, Tube, Shape, Extrude
const mkLathe = T => new T.LatheGeometry([0, .3, .5, .2, .4].map((x, i) => new T.Vector2(x + .1, i * .4)), 12);
cmp('LatheGeometry', geo(mkLathe(A)), geo(mkLathe(B)));
const mkTube = T => new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0, 0, 0), new T.Vector3(1, 2, 0), new T.Vector3(2, 1, 1), new T.Vector3(3, 3, -1)]), 32, .2, 8, false);
cmp('TubeGeometry', geo(mkTube(A)), geo(mkTube(B)));
const mkShape = T => { const s = new T.Shape(); s.moveTo(0, 0); s.lineTo(1, 0); s.quadraticCurveTo(1.5, .5, 1, 1); s.bezierCurveTo(.8, 1.5, .2, 1.5, 0, 1); s.lineTo(0, 0); const h = new T.Path(); h.absarc(.5, .5, .2, 0, Math.PI * 2, false); s.holes.push(h); return s; };
cmp('ShapeGeometry', geo(new A.ShapeGeometry(mkShape(A), 12)), geo(new B.ShapeGeometry(mkShape(B), 12)));
cmp('ExtrudeGeometry', geo(new A.ExtrudeGeometry(mkShape(A), { depth: .3, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 3, curveSegments: 10 })), geo(new B.ExtrudeGeometry(mkShape(B), { depth: .3, bevelEnabled: true, bevelSize: .05, bevelThickness: .05, bevelSegments: 3, curveSegments: 10 })));
// operações de forma
const ops = T => { const g = new T.BoxGeometry(1, 2, 3, 2, 2, 2); g.rotateX(.3); g.rotateY(1.1); g.translate(1, 2, 3); g.scale(2, .5, 1); g.center(); const ni = g.toNonIndexed(); ni.computeVertexNormals(); const c = g.clone(); c.applyMatrix4(new T.Matrix4().makeRotationZ(.7)); return [geo(g), geo(ni), geo(c)]; };
cmp('ops de forma', ops(A), ops(B));
// árvore de objetos, giros, mira, posições no mundo
const arvore = T => { const out = []; const s = new T.Scene(); const g = new T.Group(); s.add(g); g.position.set(3, 1, -2); g.rotation.set(.3, 1.2, -.4); g.scale.set(1, 2, .5);
  const m = new T.Mesh(new T.BoxGeometry(), new T.MeshLambertMaterial()); g.add(m); m.position.set(1, 0, 0); m.lookAt(5, 5, 5); m.rotateOnAxis(new T.Vector3(0, 1, 0), .5); m.translateZ(2); m.rotateX(.2);
  s.updateMatrixWorld(true); out.push(m.matrixWorld.elements, m.quaternion.toArray(), m.rotation.toArray(), m.getWorldPosition(new T.Vector3()).toArray(), m.getWorldQuaternion(new T.Quaternion()).toArray(), m.getWorldScale(new T.Vector3()).toArray(), m.getWorldDirection(new T.Vector3()).toArray());
  out.push(m.localToWorld(new T.Vector3(1, 1, 1)).toArray(), m.worldToLocal(new T.Vector3(1, 1, 1)).toArray());
  const m2 = new T.Mesh(new T.SphereGeometry()); s.add(m2); m2.position.set(-2, 0, 0); s.updateMatrixWorld(true); g.attach(m2); out.push(m2.position.toArray(), m2.quaternion.toArray(), m2.scale.toArray());
  const n = []; s.traverse(o => n.push(o.type)); out.push(n); const c = g.clone(); out.push(c.children.length, c.children[0].position.toArray()); g.remove(m); out.push(g.children.length, m.parent === null);
  const cam = new T.PerspectiveCamera(60, 1.6, .1, 500); cam.position.set(0, 5, 10); cam.lookAt(0, 0, 0); cam.updateMatrixWorld(); cam.updateProjectionMatrix(); out.push(cam.projectionMatrix.elements, cam.matrixWorldInverse.elements, new T.Vector3(1, 1, 1).project(cam).toArray());
  const rc = new T.Raycaster(); rc.setFromCamera(new T.Vector2(.1, -.2), cam); const alvo = new T.Mesh(new T.SphereGeometry(2, 16, 12)); const sc2 = new T.Scene(); sc2.add(alvo); sc2.updateMatrixWorld(true);
  const hit = rc.intersectObjects(sc2.children, true); out.push(hit.map(h => [h.distance, h.point.toArray(), h.faceIndex]));
  const box = new T.Box3().setFromObject(s); out.push(box.min.toArray(), box.max.toArray());
  const mat = new T.MeshToonMaterial({ color: 0x336699, transparent: true, opacity: .5 }); const cl = mat.clone(); out.push([cl.color.getHex(), cl.opacity, cl.transparent, cl.side, cl.type]);
  const l = new T.PointLight(0xffaa00, 2, 30); out.push([l.color.getHex(), l.intensity, l.distance, l.decay, l.type]);
  return out; };
cmp('árvore de objetos', arvore(A), arvore(B));
// valores padrão dos materiais e objetos (sem identificadores)
const pad = (T, n) => { const o = new T[n](); const x = {}; for (const k of Object.keys(o)) { if (['uuid', 'id', 'version', '_listeners'].includes(k)) continue; const v = o[k]; x[k] = v && v.isColor ? v.getHex() : v && v.isVector3 ? v.toArray() : v && v.isVector2 ? v.toArray() : (v && typeof v === 'object') ? (v.type || typeof v) : v; } return x; };
for (const n of ['MeshBasicMaterial', 'MeshToonMaterial', 'MeshLambertMaterial', 'MeshPhongMaterial', 'MeshStandardMaterial', 'SpriteMaterial', 'PointsMaterial', 'LineBasicMaterial', 'Object3D', 'Group', 'Mesh', 'Sprite', 'Points', 'Line', 'LineSegments', 'Scene', 'PointLight', 'DirectionalLight', 'HemisphereLight', 'AmbientLight', 'PerspectiveCamera', 'Texture', 'LOD', 'Bone'])
  cmp('padrão ' + n, pad(A, n), pad(B, n));
// nomes que o jogo usa e que precisam existir
const nomes = ['Mesh', 'Group', 'SphereGeometry', 'Vector3', 'CylinderGeometry', 'ConeGeometry', 'MeshBasicMaterial', 'BoxGeometry', 'TorusGeometry', 'PlaneGeometry', 'DoubleSide', 'CircleGeometry', 'MeshToonMaterial', 'RingGeometry', 'AdditiveBlending', 'MeshLambertMaterial', 'Color', 'BufferGeometry', 'Float32BufferAttribute', 'OctahedronGeometry', 'Matrix4', 'BufferAttribute', 'CanvasTexture', 'Shape', 'ShapeGeometry', 'RepeatWrapping', 'BackSide', 'IcosahedronGeometry', 'Box3', 'Vector2', 'SpriteMaterial', 'Sprite', 'Quaternion', 'Object3D', 'LatheGeometry', 'MeshPhongMaterial', 'DodecahedronGeometry', 'TubeGeometry', 'PointsMaterial', 'Matrix3', 'LineBasicMaterial', 'ExtrudeGeometry', 'Euler', 'Points', 'PointLight', 'CatmullRomCurve3', 'TetrahedronGeometry', 'SkinnedMesh', 'NormalBlending', 'Line', 'Uint16BufferAttribute', 'Skeleton', 'PerspectiveCamera', 'FrontSide', 'DirectionalLight', 'Bone', 'Scene', 'RGBAFormat', 'Plane', 'MeshStandardMaterial', 'LineSegments', 'LOD', 'DataTexture', 'sRGBEncoding', 'Uint32BufferAttribute', 'Raycaster', 'Path', 'NearestFilter', 'LinearEncoding', 'InstancedMesh', 'HemisphereLight', 'Fog', 'AmbientLight', 'MathUtils', 'Texture', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping'];
const faltam = nomes.filter(n => B[n] === undefined); if (faltam.length) falhas.push('faltam: ' + faltam.join(','));
for (const n of nomes) if (typeof A[n] === 'number' || typeof A[n] === 'string') cmp('constante ' + n, A[n], B[n]);
console.log(JSON.stringify({ conferidos_iguais: ok, falhas }, null, 1)); process.exit(falhas.length ? 1 : 0);
