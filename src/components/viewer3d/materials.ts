import * as THREE from 'three'
import { COLORS } from './config'

/** Hueso: marfil con tinte de cartílago articular dirigido por el atributo `_cartilage` (0–1). */
export function boneMaterial(): THREE.MeshStandardMaterial & { setCartilage: (v: number) => void } {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.bone, roughness: 0.62, metalness: 0, envMapIntensity: 0.55 }) as THREE.MeshStandardMaterial & { setCartilage: (v: number) => void }
  const u = { uCart: { value: 0.12 }, uCartColor: { value: new THREE.Color(COLORS.cartilage) } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float _cartilage;\nvarying float vCart;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvCart = _cartilage;')
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vCart;\nuniform float uCart;\nuniform vec3 uCartColor;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uCartColor, smoothstep(0.12, 0.7, vCart) * uCart);')
  }
  m.customProgramCacheKey = () => 'bone-cart'
  m.setCartilage = (v: number) => { u.uCart.value = v }
  return m
}

/** Músculo: rojo anatómico con tramo tendinoso (atributo `_tendon`). */
export function muscleMaterial(): THREE.MeshStandardMaterial {
  const m = new THREE.MeshStandardMaterial({ color: COLORS.muscle, roughness: 0.5, metalness: 0, envMapIntensity: 0.5 })
  const u = { uTendon: { value: new THREE.Color(COLORS.tendon) } }
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, u)
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute float _tendon;\nvarying float vTend;').replace('#include <begin_vertex>', '#include <begin_vertex>\nvTend = _tendon;')
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vTend;\nuniform vec3 uTendon;')
      .replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.rgb = mix(diffuseColor.rgb, uTendon, smoothstep(0.25, 0.75, vTend));')
  }
  m.customProgramCacheKey = () => 'muscle-tendon'
  return m
}

export function plainMaterial(color: string, roughness = 0.5): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness: 0, envMapIntensity: 0.55 })
}

export function setOpacity(m: THREE.Material & { opacity: number }, opacity: number) {
  const transparent = opacity < 0.999
  if (m.transparent !== transparent) { m.transparent = transparent; m.needsUpdate = true }
  m.opacity = opacity
  m.depthWrite = !transparent || opacity > 0.9
}
