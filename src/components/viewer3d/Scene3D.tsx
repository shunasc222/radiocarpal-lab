import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import { OrbitControls, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { BONE_IDS, BONE_NAME, COLORS, TARGET, VIEWS, explodeOffset, type BoneId, type LayerId, type ViewName } from './config'
import { boneMaterial, muscleMaterial, setOpacity } from './materials'
import Procedural from './Procedural'
import { LabelSprite } from './LabelSprite'
import { MUSCLE3D_NAME } from './registry3d'
import { labelOn } from './info3d'

export interface SceneState {
  layers: Record<LayerId, { on: boolean; opacity: number }>
  hidden: ReadonlySet<string>
  selected: string | null
  labels: boolean
  labelLayer: LayerId | null
  explode: number
  view: { name: ViewName; nonce: number }
  onSelect: (id: string | null) => void
}

const BASE = import.meta.env.BASE_URL

function Environment() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = pm.fromScene(new RoomEnvironment(), 0.03).texture
    scene.environment = env
    return () => { scene.environment = null; env.dispose(); pm.dispose() }
  }, [gl, scene])
  return null
}

function CameraRig({ view }: { view: { name: ViewName; nonce: number } }) {
  const { camera, controls, invalidate, size } = useThree()
  const aspectK = size.width / size.height < 0.95 ? 1.35 : 1
  const goal = useRef<THREE.Vector3 | null>(null)
  const T = useMemo(() => new THREE.Vector3(...TARGET), [])
  useEffect(() => {
    const [x, y, z] = VIEWS[view.name]
    goal.current = new THREE.Vector3(x * aspectK, y * aspectK, z * aspectK).sub(T)
    invalidate()
  }, [view.nonce, view.name, T, invalidate, aspectK])
  useFrame((_, dt) => {
    const g = goal.current
    if (!g) return
    const f = 1 - Math.exp(-dt * 7)
    const o = camera.position.clone().sub(T)
    const r = o.length(), rg = g.length()
    const q = new THREE.Quaternion().setFromUnitVectors(o.clone().normalize(), g.clone().normalize())
    o.applyQuaternion(new THREE.Quaternion().slerp(q, f)).setLength(r + (rg - r) * f)
    camera.position.copy(T).add(o); camera.lookAt(T)
    const c = controls as unknown as { target?: THREE.Vector3; update?: () => void } | null
    if (c?.target) { c.target.copy(T); c.update?.() }
    if (q.angleTo(new THREE.Quaternion()) < 0.004 && Math.abs(rg - r) < 0.05) { camera.position.copy(T).add(g); camera.lookAt(T); goal.current = null } else invalidate()
  })
  return null
}

/** Mallas con nombre dentro de un GLB. */
function useMeshes(url: string): Record<string, THREE.Mesh> {
  const gltf = useGLTF(url)
  return useMemo(() => {
    const out: Record<string, THREE.Mesh> = {}
    gltf.scene.traverse((o) => { if ((o as THREE.Mesh).isMesh) out[o.name] = o as THREE.Mesh })
    return out
  }, [gltf])
}

function Pickable({ id, geometry, material, selected, dim, onSelect, offset, visible, labelPos, label, children }: {
  id: string; geometry: THREE.BufferGeometry; material: THREE.Material; selected: boolean; dim: boolean; onSelect: SceneState['onSelect']
  offset: [number, number, number]; visible: boolean; labelPos?: [number, number, number]; label?: string; children?: React.ReactNode
}) {
  const ref = useRef<THREE.Mesh>(null)
  const { invalidate } = useThree()
  const m = material as THREE.MeshStandardMaterial
  useEffect(() => {
    m.emissive.set(selected ? COLORS.select : '#000000'); m.emissiveIntensity = selected ? 0.42 : 0
    invalidate()
  }, [selected, m, invalidate])
  void dim
  return (
    <group position={offset} visible={visible}>
      <mesh
        ref={ref} geometry={geometry} material={material} name={id}
        onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); onSelect(id) }}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; m.emissive.set('#ffffff'); m.emissiveIntensity = selected ? 0.42 : 0.12; invalidate() }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; m.emissive.set(selected ? COLORS.select : '#000000'); m.emissiveIntensity = selected ? 0.42 : 0; invalidate() }}
      />
      {label && labelPos && visible && <LabelSprite text={label} position={labelPos} active={selected} />}
      {children}
    </group>
  )
}

function Bones({ s, ex }: { s: SceneState; ex: React.MutableRefObject<{ v: number }> }) {
  const meshes = useMeshes(`${BASE}models/wrist-bones.glb`)
  const mats = useMemo(() => Object.fromEntries(BONE_IDS.map((id) => [id, boneMaterial()])), [])
  const { invalidate } = useThree()
  const groups = useRef<Record<string, THREE.Group | null>>({})
  const layer = s.layers.osteologia, surf = s.layers.superficies
  useEffect(() => {
    for (const id of BONE_IDS) { setOpacity(mats[id], layer.opacity); mats[id].setCartilage(surf.on ? 0.15 + 0.85 * surf.opacity : 0.0) }
    invalidate()
  }, [layer.opacity, surf.on, surf.opacity, mats, invalidate])
  useFrame(() => { apply(ex.current.v) })
  const apply = (k: number) => { for (const id of BONE_IDS) { const g = groups.current[id]; if (g) { const o = explodeOffset(id); g.position.set(o[0] * k, o[1] * k, o[2] * k) } } }
  return (
    <>
      {BONE_IDS.map((id) => meshes[id] && (
        <group key={id} ref={(g) => { groups.current[id] = g }}>
          <Pickable id={id} geometry={meshes[id].geometry} material={mats[id]} selected={s.selected === id} dim={false} onSelect={s.onSelect}
            offset={[0, 0, 0]} visible={layer.on && !s.hidden.has(id)} label={labelOn(s, id) ? BONE_NAME[id] : undefined}
            labelPos={labelAnchor(id)} />
        </group>
      ))}
    </>
  )
}

import { CENTROID } from '../../data/landmarks3d'
function labelAnchor(id: BoneId): [number, number, number] {
  const c = (CENTROID as Record<string, readonly number[]>)[id]
  return [c[0], c[1], (id === 'radio' || id === 'ulna' ? 1.1 : 0.8) + (c[2] > 0 ? 0.6 : 0.2)]
}

const MUSCLE_IDS = ['ecrl', 'ecrb', 'ecu', 'fcr', 'pl'] as const
const SOFT_IDS = ['retinaculo', 'membrana'] as const
function SoftReal({ s, ex }: { s: SceneState; ex: React.MutableRefObject<{ v: number }> }) {
  const meshes = useMeshes(`${BASE}models/wrist-soft.glb`)
  const mats = useMemo(() => ({
    ...Object.fromEntries(MUSCLE_IDS.map((id) => [id, muscleMaterial()])),
    retinaculo: new THREE.MeshStandardMaterial({ color: COLORS.retinaculum, roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.55 }),
    membrana: new THREE.MeshStandardMaterial({ color: COLORS.ligament, roughness: 0.45, side: THREE.DoubleSide, envMapIntensity: 0.55 }),
  }) as Record<string, THREE.MeshStandardMaterial>, [])
  const { invalidate } = useThree()
  const mio = s.layers.miologia, lig = s.layers.ligamentos
  useEffect(() => {
    for (const id of MUSCLE_IDS) setOpacity(mats[id], mio.opacity)
    for (const id of SOFT_IDS) setOpacity(mats[id], lig.opacity * 0.5)
    invalidate()
  }, [mio.opacity, lig.opacity, mats, invalidate])
  const refs = useRef<Record<string, THREE.Group | null>>({})
  const palmar = (id: string) => id === 'fcr' || id === 'pl' || id === 'retinaculo'
  useFrame(() => { for (const id of [...MUSCLE_IDS, ...SOFT_IDS]) { const g = refs.current[id]; if (g) g.position.z = (palmar(id) ? 1 : id === 'membrana' ? 0 : -1) * 1.4 * ex.current.v } })
  const items: { id: string; on: boolean; name: string; pos: [number, number, number] }[] = [
    ...MUSCLE_IDS.map((id) => ({ id, on: mio.on, name: MUSCLE3D_NAME[id], pos: [palmar(id) ? -1.2 : -1.6, 5, palmar(id) ? 1.6 : -2.2] as [number, number, number] })),
    { id: 'retinaculo', on: lig.on, name: 'Retináculo flexor', pos: [-0.8, -1.2, 2.2] }, { id: 'membrana', on: lig.on, name: 'Membrana interósea', pos: [-0.8, 5, 0.6] },
  ]
  return (
    <>
      {items.map(({ id, on, name, pos }) => meshes[id] && (
        <group key={id} ref={(g) => { refs.current[id] = g }}>
          <Pickable id={id} geometry={meshes[id].geometry} material={mats[id]} selected={s.selected === id} dim={false} onSelect={s.onSelect}
            offset={[0, 0, 0]} visible={on && !s.hidden.has(id)} label={labelOn(s, id) ? name : undefined} labelPos={pos} />
        </group>
      ))}
    </>
  )
}

function ExplodeDriver({ target, ex }: { target: number; ex: React.MutableRefObject<{ v: number }> }) {
  const { invalidate } = useThree()
  useEffect(() => { invalidate() }, [target, invalidate])
  useFrame(() => {
    const d = target - ex.current.v
    if (Math.abs(d) < 0.002) { if (d !== 0) ex.current.v = target; return }
    ex.current.v += d * 0.2; invalidate()
  })
  return null
}

function Loader() {
  const { active, progress } = useProgress()
  if (!active) return null
  return <group>{void progress}</group>
}

export default function Scene3D({ state, className, onReady }: { state: SceneState; className?: string; onReady?: () => void }) {
  const s = state
  const T = TARGET
  const ex = useRef({ v: 0 })
  const softEverOn = useRef(false)
  if (s.layers.miologia.on || s.layers.ligamentos.on) softEverOn.current = true
  return (
    <Canvas
      className={className} frameloop="demand" dpr={[1, 1.75]} camera={{ position: VIEWS.inicial, fov: 30, near: 0.1, far: 200 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      style={{ touchAction: 'none' }}
      onCreated={({ gl }) => { gl.toneMapping = THREE.NeutralToneMapping; gl.toneMappingExposure = 1.0; gl.outputColorSpace = THREE.SRGBColorSpace; onReady?.() }}
      onPointerMissed={() => s.onSelect(null)}
      aria-label="Modelo 3D de la región radiocarpiana a partir de BodyParts3D"
    >
      <Environment />
      <ambientLight intensity={0.06} />
      <directionalLight position={[-9, 12, 16]} intensity={1.25} />
      <directionalLight position={[12, -4, 8]} intensity={0.35} color="#ffe9e0" />
      <directionalLight position={[0, 6, -18]} intensity={0.6} color="#dfe8ff" />
      <CameraRig view={s.view} />
      <ExplodeDriver target={s.explode} ex={ex} />
      <Loader />
      <Suspense fallback={null}><Bones s={s} ex={ex} /></Suspense>
      {softEverOn.current && <Suspense fallback={null}><SoftReal s={s} ex={ex} /></Suspense>}
      <Suspense fallback={null}><Procedural s={s} ex={ex} /></Suspense>
      <OrbitControls makeDefault enablePan={false} enableDamping dampingFactor={0.12} minDistance={9} maxDistance={55} target={T} rotateSpeed={0.9} zoomSpeed={0.8} />
    </Canvas>
  )
}
