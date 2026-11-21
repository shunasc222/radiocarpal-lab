/**
 * Generador de láminas 2D a partir de los modelos 3D (BodyParts3D, CC BY 4.0).
 * Solo se usa desde scripts/render-plates.mjs (ruta oculta #/__plate): proyección ortográfica
 * palmar / dorsal / distal, en modo «beauty» (con luz) o «ids» (color plano por zona).
 */
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { boneMaterial, muscleMaterial } from '../components/viewer3d/materials'

export type PlateView = 'palmar' | 'dorsal' | 'distal'
export interface PlateFrame { S: number; x0: number; x1: number; a0: number; a1: number }
export interface PlateCfg { view: PlateView; mode: 'beauty' | 'surf' | 'ids'; muscles?: boolean; zonesOnlyMuscles?: boolean; only?: string[]; frame?: PlateFrame }
export const FRAME: Record<PlateView, { S: number; x0: number; x1: number; a0: number; a1: number }> = {
  palmar: { S: 70, x0: -6.4, x1: 3.2, a0: -6.4, a1: 10.4 }, // a = y
  dorsal: { S: 70, x0: -6.4, x1: 3.2, a0: -6.4, a1: 10.4 },
  distal: { S: 150, x0: -4.2, x1: 2.9, a0: -2.2, a1: 2.4 }, // a = z
}
const BONES = ['radio', 'ulna', 'escafoides', 'semilunar', 'piramidal', 'pisiforme', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso', 'mc1', 'mc2', 'mc3', 'mc4', 'mc5']
const base = import.meta.env.BASE_URL
const loader = new GLTFLoader()
const load = (u: string) => new Promise<THREE.Group>((res, rej) => loader.load(u, (g) => res(g.scene), undefined, rej))

type Tri = { a: number; b: number; c: number }
function splitByZone(mesh: THREE.Mesh, zoneOf: (cx: number, cy: number, cz: number, v: { n: THREE.Vector3; cart: number }[]) => string): Record<string, THREE.BufferGeometry> {
  const g = mesh.geometry, pos = g.attributes.position, nor = g.attributes.normal, cart = g.attributes._cartilage as THREE.BufferAttribute | undefined
  const idx = g.index!, groups: Record<string, number[]> = {}
  for (let t = 0; t < idx.count; t += 3) {
    const tri: Tri = { a: idx.getX(t), b: idx.getX(t + 1), c: idx.getX(t + 2) }
    const cx = (pos.getX(tri.a) + pos.getX(tri.b) + pos.getX(tri.c)) / 3, cy = (pos.getY(tri.a) + pos.getY(tri.b) + pos.getY(tri.c)) / 3, cz = (pos.getZ(tri.a) + pos.getZ(tri.b) + pos.getZ(tri.c)) / 3
    const vs = [tri.a, tri.b, tri.c].map((i) => ({ n: new THREE.Vector3(nor.getX(i), nor.getY(i), nor.getZ(i)), cart: cart ? cart.getX(i) : 0 }))
    const z = zoneOf(cx, cy, cz, vs); (groups[z] ??= []).push(tri.a, tri.b, tri.c)
  }
  const out: Record<string, THREE.BufferGeometry> = {}
  for (const [z, ids] of Object.entries(groups)) { const ng = g.clone(); ng.setIndex(ids); out[z] = ng }
  return out
}

export async function renderPlate(cfg: PlateCfg) {
  const F = cfg.frame ?? FRAME[cfg.view], W = Math.round((F.x1 - F.x0) * F.S), H = Math.round((F.a1 - F.a0) * F.S)
  const ids = cfg.mode === 'ids'
  const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !ids, alpha: true, preserveDrawingBuffer: true })
  renderer.setSize(W, H, false); renderer.setPixelRatio(1)
  renderer.toneMapping = ids ? THREE.NoToneMapping : THREE.NeutralToneMapping
  renderer.outputColorSpace = ids ? THREE.LinearSRGBColorSpace : THREE.SRGBColorSpace
  renderer.setClearColor(0x000000, 0)
  const scene = new THREE.Scene()
  if (!ids) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.03).texture }
  const cx = (F.x0 + F.x1) / 2, ca = (F.a0 + F.a1) / 2, hw = (F.x1 - F.x0) / 2, ha = (F.a1 - F.a0) / 2
  const cam = new THREE.OrthographicCamera(-hw, hw, ha, -ha, 0.1, 200)
  if (cfg.view === 'palmar') { cam.position.set(cx, ca, 60); cam.up.set(0, 1, 0); cam.lookAt(cx, ca, 0) }
  else if (cfg.view === 'dorsal') { cam.position.set(cx, ca, -60); cam.up.set(0, 1, 0); cam.lookAt(cx, ca, 0) }
  else { cam.position.set(cx, -60, ca); cam.up.set(0, 0, 1); cam.lookAt(cx, 0, ca) }
  cam.updateProjectionMatrix()
  if (!ids) {
    scene.add(new THREE.AmbientLight(0xffffff, 0.06))
    const key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(-9, 12, cfg.view === 'dorsal' ? -16 : 16); scene.add(key)
    const rim = new THREE.DirectionalLight(0xffe9e0, 0.35); rim.position.set(12, -4, cfg.view === 'dorsal' ? -8 : 8); scene.add(rim)
    const top = new THREE.DirectionalLight(0xdfe8ff, 0.6); top.position.set(0, 6, cfg.view === 'dorsal' ? 18 : -18); scene.add(top)
  }
  const bones = await load(`${base}models/wrist-bones.glb`)
  const soft = await load(`${base}models/wrist-soft.glb`)
  const meshOf = (root: THREE.Group, n: string) => { let m: THREE.Mesh | null = null; root.traverse((o) => { if (o.name === n && (o as THREE.Mesh).isMesh) m = o as THREE.Mesh }); return m as THREE.Mesh | null }
  const zoneIds: string[] = ['ctx']
  const colorOf = (zone: string) => { let i = zoneIds.indexOf(zone); if (i < 0) { zoneIds.push(zone); i = zoneIds.length - 1 } return new THREE.Color().setRGB((i * 9 + 6) / 255, 0, 0, THREE.LinearSRGBColorSpace) }
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material) => { const m = new THREE.Mesh(geo, mat); scene.add(m) }
  const flat = (zone: string) => new THREE.MeshBasicMaterial({ color: colorOf(zone), side: THREE.DoubleSide })

  const distal = cfg.view === 'distal'
  const musclesOnly = !!cfg.zonesOnlyMuscles
  const bonesVisible = !musclesOnly
  // vértices de referencia para asignar fositas por cercanía al escafoides / semilunar
  const near = (id: string) => { const m = meshOf(bones, id)!, p = m.geometry.attributes.position, out: [number, number][] = []; for (let i = 0; i < p.count; i++) if (p.getY(i) > -0.55) out.push([p.getX(i), p.getZ(i)]); return out }
  const sca = near('escafoides'), lun = near('semilunar')
  const dist = (list: [number, number][], x: number, z: number) => { let d = 1e9; for (const [a, b] of list) d = Math.min(d, (a - x) ** 2 + (b - z) ** 2); return d }

  if (bonesVisible) for (const id of BONES) {
    if (distal && id !== 'radio' && id !== 'ulna') continue
    if (cfg.only && !cfg.only.includes(id)) continue
    const m = meshOf(bones, id); if (!m) continue
    if (ids) {
      if (id === 'radio') {
        const parts = splitByZone(m, (x, y, z, v) => {
          const cart = (v[0].cart + v[1].cart + v[2].cart) / 3, ny = (v[0].n.y + v[1].n.y + v[2].n.y) / 3, nx = (v[0].n.x + v[1].n.x + v[2].n.x) / 3
          if (y < 0.0 && x < -2.45 && !(distal && cart > 0.45 && ny < -0.3)) return 'estiloides-radio'
          if (distal && cart > 0.4 && nx > 0.5) return 'escotadura-ulnar'
          if (distal && cart > 0.4 && ny < -0.25) return dist(sca, x, z) <= dist(lun, x, z) ? 'fosita-escafoidea' : 'fosita-semilunar'
          return 'radio-distal'
        })
        // cresta: franja de la fosita más cercana al límite entre ambas
        if (distal && parts['fosita-escafoidea'] && parts['fosita-semilunar']) {
          const edge = (g: THREE.BufferGeometry) => g.attributes.position
          const ps = edge(parts['fosita-escafoidea']), pl = edge(parts['fosita-semilunar'])
          let xs = -1e9, xl = 1e9; for (let i = 0; i < ps.count; i++) xs = Math.max(xs, ps.getX(i)); for (let i = 0; i < pl.count; i++) xl = Math.min(xl, pl.getX(i))
          const xb = (xs + xl) / 2
          for (const k of ['fosita-escafoidea', 'fosita-semilunar'] as const) {
            const sub = splitByZone(new THREE.Mesh(parts[k]), (x) => (Math.abs(x - xb) < 0.17 ? 'cresta-interfacetaria' : k))
            delete parts[k]; Object.assign(parts, { ...Object.fromEntries(Object.entries(sub).map(([z, g]) => [z === k ? k : z, g])) })
          }
        }
        for (const [z, g] of Object.entries(parts)) add(g, flat(z))
      } else if (id === 'ulna') {
        const parts = splitByZone(m, (x, y) => (y < 0.12 && x > 0.45 ? 'estiloides-ulnar' : 'ulna-distal'))
        for (const [z, g] of Object.entries(parts)) add(g, flat(z))
      } else if (['escafoides', 'semilunar', 'piramidal', 'pisiforme'].includes(id)) add(m.geometry, flat(id))
      else add(m.geometry, flat('ctx'))
    } else {
      const mat = boneMaterial(); mat.setCartilage(cfg.mode === 'surf' ? 1 : 0.0); add(m.geometry, mat)
    }
  }
  if (cfg.muscles || musclesOnly) {
    for (const id of ['ecrl', 'ecrb', 'ecu', 'fcr', 'pl']) {
      const palmar = id === 'fcr' || id === 'pl'
      if ((cfg.view === 'palmar') !== palmar && cfg.view !== 'distal') { if (!musclesOnly) { /* en beauty se dibujan solo los de la cara visible */ } }
      if (cfg.view === 'palmar' && !palmar) continue
      if (cfg.view === 'dorsal' && palmar) continue
      const m = meshOf(soft, id); if (!m) continue
      add(m.geometry, ids ? flat(id) : muscleMaterial())
    }
  }
  renderer.render(scene, cam)
  const data = canvas.toDataURL(ids ? 'image/png' : 'image/webp', 0.92)
  return { data, w: W, h: H, zones: zoneIds, frame: F }
}
