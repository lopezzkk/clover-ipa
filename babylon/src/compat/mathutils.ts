// MathUtils próprio, no formato de módulo que as partes de dados esperam
import { MathUtils as M } from './matematica';
export const DEG2RAD = M.DEG2RAD, RAD2DEG = M.RAD2DEG;
export const { generateUUID, clamp, euclideanModulo, mapLinear, inverseLerp, lerp, damp, pingpong, smoothstep, smootherstep, randInt, randFloat, randFloatSpread, seededRandom, degToRad, radToDeg, isPowerOfTwo, ceilPowerOfTwo, floorPowerOfTwo } = M;
