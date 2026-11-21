import * as THREE from 'three'
import { COLORS } from './config'

const NOISE = /* glsl */ `
float rcHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float rcNoise(vec3 x){ vec3 i = floor(x), f = fract(x); f = f*f*(3.0-2.0*f);
  return mix(mix(mix(rcHash(i), rcHash(i+vec3(1,0,0)), f.x), mix(rcHash(i+vec3(0,1,0)), rcHash(i+vec3(1,1,0)), f.x), f.y),
             mix(mix(rcHash(i+vec3(0,0,1)), rcHash(i+vec3(1,0,1)), f.x), mix(rcHash(i+vec3(0,1,1)), rcHash(i+vec3(1,1,1)), f.x), f.y), f.z); }
`

type BoneMat = THREE.MeshPhysicalMaterial & { setCartilage: (v: number) => void }

/** Hueso: marfil con veteado sutil, oclusión ambiental horneada (`_ao`) y tinte de cartílago (`_cartilage`). */
export function boneMaterial(): BoneMat {
  const m = new THREE.MeshPhysicalMaterial({ color: COLORS.bone, roughness: 0.5, metalness: 0, clearcoat: 0.22, clearcoatRoughness: 0.5, envMapIntensity: 0.75 }) as BoneMat
  const u = { uCart: { value: 0.12 }, uCartColor: { value: new THREE.Color(COLORS.cartilage) } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float _cartilage;\nattribute float _ao;\nvarying float vCart;\nvarying float vAo;\nvarying vec3 vOP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCart = _cartilage;\nvAo = _ao;\nvOP = position;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vCart;\nvarying float vAo;\nvarying vec3 vOP;\nuniform float uCart;\nuniform vec3 uCartColor;\n${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float mott = rcNoise(vOP * 2.6) * 0.6 + rcNoise(vOP * 9.0) * 0.4;
        diffuseColor.rgb *= 0.93 + 0.12 * mott;
        float cart = smoothstep(0.12, 0.7, vCart) * uCart;
        vec3 shade = vec3(0.6, 0.52, 0.44);
        diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * shade, clamp(vAo * 0.95, 0.0, 1.0) * (1.0 - cart * 0.6));
        diffuseColor.rgb = mix(diffuseColor.rgb, uCartColor * (1.0 - vAo * 0.25), cart);`)
  }
  m.customProgramCacheKey = () => 'bone-v2'
  m.setCartilage = (v: number) => { u.uCart.value = v }
  return m
}

/** Músculo: rojo anatómico mate-húmedo con estriado de fibras y tramo tendinoso nacarado (`_tendon`). */
export function muscleMaterial(): THREE.MeshPhysicalMaterial {
  const m = new THREE.MeshPhysicalMaterial({ color: COLORS.muscle, roughness: 0.46, metalness: 0, clearcoat: 0.3, clearcoatRoughness: 0.4, sheen: 0.4, sheenColor: new THREE.Color('#ffb4a8'), sheenRoughness: 0.6, envMapIntensity: 0.7 })
  const u = { uTendon: { value: new THREE.Color(COLORS.tendon) } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float _tendon;\nvarying float vTend;\nvarying vec3 vOP;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvTend = _tendon;\nvOP = position;')
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', `#include <common>\nvarying float vTend;\nvarying vec3 vOP;\nuniform vec3 uTendon;\n${NOISE}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
        float t = smoothstep(0.3, 0.7, vTend);
        float fib = rcNoise(vec3(vOP.x * 42.0, vOP.y * 1.6, vOP.z * 42.0));
        float fib2 = rcNoise(vec3(vOP.x * 90.0, vOP.y * 3.0, vOP.z * 90.0));
        vec3 muscleCol = diffuseColor.rgb * (0.82 + 0.3 * fib + 0.08 * fib2);
        vec3 tendonCol = uTendon * (0.94 + 0.1 * rcNoise(vec3(vOP.x * 60.0, vOP.y * 1.2, vOP.z * 60.0)));
        diffuseColor.rgb = mix(muscleCol, tendonCol, t);`)
  }
  m.customProgramCacheKey = () => 'muscle-v2'
  return m
}

/** Ligamento: blanco nacarado con tinte según la categoría. */
export function ligamentMaterial(color: string): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({ color, roughness: 0.36, metalness: 0, clearcoat: 0.55, clearcoatRoughness: 0.3, sheen: 0.5, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.4, side: THREE.DoubleSide, envMapIntensity: 0.9 })
}

export function plainMaterial(color: string, roughness = 0.5): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({ color, roughness, metalness: 0, clearcoat: 0.4, clearcoatRoughness: 0.35, envMapIntensity: 0.8, side: THREE.DoubleSide })
}

/** Casco invertido para dibujar un contorno limpio alrededor de una malla. */
export function outlineMaterial(color = '#5d5240', thickness = 0.03, opacity = 0.55): THREE.MeshBasicMaterial & { setThickness: (t: number) => void } {
  const m = new THREE.MeshBasicMaterial({ color, side: THREE.BackSide, transparent: opacity < 1, opacity, depthWrite: true }) as THREE.MeshBasicMaterial & { setThickness: (t: number) => void }
  const u = { uThick: { value: thickness } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uThick;').replace('#include <begin_vertex>', '#include <begin_vertex>\ntransformed += normalize(normal) * uThick;')
  }
  m.customProgramCacheKey = () => 'outline-v1'
  m.setThickness = (t: number) => { u.uThick.value = t }
  return m
}

export function setOpacity(m: THREE.Material & { opacity: number }, opacity: number) {
  const transparent = opacity < 0.999
  if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true }
  m.opacity = opacity
  m.depthWrite = !transparent || opacity > 0.9
}
