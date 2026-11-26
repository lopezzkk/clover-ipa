// CAMADA PRÓPRIA — fase 2: os objetos do jogo (grupos, malhas, formas, materiais, luzes, câmera, texturas)
// sem o desenhista do three.js. O jogo continua chamando T.Mesh, T.Group, T.SphereGeometry... com o mesmo
// comportamento, mas quem desenha é só o Babylon (a ponte). A biblioteca three.js inteira (603 KB, carregada
// de fora pela internet) não é mais baixada: entram só as partes de dados que o jogo usa, e a matemática é a
// própria (src/compat/matematica.ts). Partes de dados com base no código do three.js r128 (licença MIT,
// Copyright © 2010-2021 three.js authors), sem o renderizador WebGL, carregadores, áudio e ajudantes.
export * from '../../vendor/three-r128/constants.js';
export { REVISION } from '../../vendor/three-r128/constants.js';
export { Vector2, Vector3, Vector4, Quaternion, Euler, Matrix3, Matrix4, Color, Box3, Sphere, Plane, Ray } from './matematica';
export * as MathUtils from './mathutils';
export { Spherical } from '../../vendor/three-r128/math/Spherical.js';
export { Cylindrical } from '../../vendor/three-r128/math/Cylindrical.js';
export { Frustum } from '../../vendor/three-r128/math/Frustum.js';
export { Triangle } from '../../vendor/three-r128/math/Triangle.js';
export { Line3 } from '../../vendor/three-r128/math/Line3.js';
export { Layers } from '../../vendor/three-r128/core/Layers.js';
export { EventDispatcher } from '../../vendor/three-r128/core/EventDispatcher.js';
export { Clock } from '../../vendor/three-r128/core/Clock.js';
export { Object3D } from '../../vendor/three-r128/core/Object3D.js';
export { Raycaster } from '../../vendor/three-r128/core/Raycaster.js';
export * from '../../vendor/three-r128/core/BufferAttribute.js';
export { InstancedBufferAttribute } from '../../vendor/three-r128/core/InstancedBufferAttribute.js';
export { BufferGeometry } from '../../vendor/three-r128/core/BufferGeometry.js';
export * from '../../vendor/three-r128/geometries/Geometries.js';
export * from '../../vendor/three-r128/materials/Materials.js';
export { Texture } from '../../vendor/three-r128/textures/Texture.js';
export { CanvasTexture } from '../../vendor/three-r128/textures/CanvasTexture.js';
export { DataTexture } from '../../vendor/three-r128/textures/DataTexture.js';
export { Group } from '../../vendor/three-r128/objects/Group.js';
export { Mesh } from '../../vendor/three-r128/objects/Mesh.js';
export { InstancedMesh } from '../../vendor/three-r128/objects/InstancedMesh.js';
export { SkinnedMesh } from '../../vendor/three-r128/objects/SkinnedMesh.js';
export { Skeleton } from '../../vendor/three-r128/objects/Skeleton.js';
export { Bone } from '../../vendor/three-r128/objects/Bone.js';
export { Sprite } from '../../vendor/three-r128/objects/Sprite.js';
export { Points } from '../../vendor/three-r128/objects/Points.js';
export { Line } from '../../vendor/three-r128/objects/Line.js';
export { LineSegments } from '../../vendor/three-r128/objects/LineSegments.js';
export { LineLoop } from '../../vendor/three-r128/objects/LineLoop.js';
export { LOD } from '../../vendor/three-r128/objects/LOD.js';
export { Scene } from '../../vendor/three-r128/scenes/Scene.js';
export { Fog } from '../../vendor/three-r128/scenes/Fog.js';
export { FogExp2 } from '../../vendor/three-r128/scenes/FogExp2.js';
export { Camera } from '../../vendor/three-r128/cameras/Camera.js';
export { PerspectiveCamera } from '../../vendor/three-r128/cameras/PerspectiveCamera.js';
export { OrthographicCamera } from '../../vendor/three-r128/cameras/OrthographicCamera.js';
export { PointLight } from '../../vendor/three-r128/lights/PointLight.js';
export { DirectionalLight } from '../../vendor/three-r128/lights/DirectionalLight.js';
export { HemisphereLight } from '../../vendor/three-r128/lights/HemisphereLight.js';
export { AmbientLight } from '../../vendor/three-r128/lights/AmbientLight.js';
export { SpotLight } from '../../vendor/three-r128/lights/SpotLight.js';
export * from '../../vendor/three-r128/extras/curves/Curves.js';
export { Curve } from '../../vendor/three-r128/extras/core/Curve.js';
export { CurvePath } from '../../vendor/three-r128/extras/core/CurvePath.js';
export { Path } from '../../vendor/three-r128/extras/core/Path.js';
export { Shape } from '../../vendor/three-r128/extras/core/Shape.js';
export { ShapePath } from '../../vendor/three-r128/extras/core/ShapePath.js';
export { ShapeUtils } from '../../vendor/three-r128/extras/ShapeUtils.js';
