import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { BONE_ORDER, DIRECT, PATHS, RIBBONS } from '../../data/anatomy3d.generated'
import { COLORS, explodeOffset, type BoneId } from './config'
import { setOpacity } from './materials'
import { LabelSprite } from './LabelSprite'
import { ELEMENT_NAME, LIG_COLOR, NV_COLOR } from './registry3d'
import type { SceneState } from './Scene3D'
import { labelOn } from './info3d'

type ExRef = { current: { v: number } }
const off = (owner: number, k: number, fallback: [number, number, number] = [0, 0, 0]): [number, number, number] => {
  if (owner < 0) return [fallback[0] * k, fallback[1] * k, fallback[2] * k]
  const o = explodeOffset(BONE_ORDER[owner] as BoneId); return [o[0] * k, o[1] * k, o[2] * k]
}

/** Elemento seleccionable genérico (material propio, resaltado al seleccionar / pasar el cursor). */
function useHighlight(mat: THREE.MeshStandardMaterial, selected: boolean) {
  const { invalidate } = useThree()
  useEffect(() => { mat.emissive.set(selected ? COLORS.select : '#000'); mat.emissiveIntensity = selected ? 0.5 : 0; invalidate() }, [selected, mat, invalidate])
  return {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; mat.emissive.set('#fff'); mat.emissiveIntensity = selected ? 0.5 : 0.18; invalidate() },
    onPointerOut: () => { document.body.style.cursor = 'auto'; mat.emissive.set(selected ? COLORS.select : '#000'); mat.emissiveIntensity = selected ? 0.5 : 0; invalidate() },
  }
}

const stdMat = (color: string, rough = 0.5) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, envMapIntensity: 0.55, side: THREE.DoubleSide })

/* ───────── cintas de ligamentos (drapeadas sobre el hueso real) ───────── */
function buildRibbon(strip: number[][], k: number, geo: THREE.BufferGeometry) {
  const n = strip.length, pos = new Float32Array(n * 3 * 3)
  strip.forEach((r, i) => {
    const o = off(r[3], k)
    for (let j = 0; j < 3; j++) pos.set([r[j * 4] + o[0], r[j * 4 + 1] + o[1], r[j * 4 + 2] + o[2]], i * 9 + j * 3)
  })
  const idx: number[] = []
  for (let i = 0; i < n - 1; i++) { const a = i * 3, b = (i + 1) * 3; idx.push(a, a + 1, b, a + 1, b + 1, b, a + 1, a + 2, b + 1, a + 2, b + 2, b + 1) }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere()
}

function Ribbon({ id, strips, color, s, ex, layerOn, opacity }: { id: string; strips: number[][][]; color: string; s: SceneState; ex: ExRef; layerOn: boolean; opacity: number }) {
  const mat = useMemo(() => stdMat(color, 0.42), [color])
  const geos = useMemo(() => strips.map(() => new THREE.BufferGeometry()), [strips])
  const last = useRef(-1)
  const { invalidate } = useThree()
  useEffect(() => { setOpacity(mat, opacity); invalidate() }, [opacity, mat, invalidate])
  useFrame(() => { const k = ex.current.v; if (Math.abs(k - last.current) > 0.003) { last.current = k; strips.forEach((st, i) => buildRibbon(st, k, geos[i])) } })
  const hl = useHighlight(mat, s.selected === id)
  const visible = layerOn && !s.hidden.has(id)
  const mid = strips[0][Math.floor(strips[0].length / 2)].slice(4, 7)
  return (
    <group visible={visible}>
      {geos.map((g, i) => <mesh key={i} geometry={g} material={mat} onClick={(e) => { e.stopPropagation(); s.onSelect(id) }} {...hl} />)}
      {labelOn(s, id) && visible && <LabelSprite text={ELEMENT_NAME[id] ?? id} position={[mid[0], mid[1], mid[2] + (mid[2] > 0 ? 0.7 : -0.7)]} active={s.selected === id} />}
    </group>
  )
}

/* ───────── hilos/tubos (interóseos, vasos, nervios) ───────── */
function TubeItem({ id, pts, r, color, s, ex, layerOn, opacity, rough = 0.45, groupOffset }: { id: string; pts: number[][]; r: number; color: string; s: SceneState; ex: ExRef; layerOn: boolean; opacity: number; rough?: number; groupOffset?: [number, number, number] }) {
  const mat = useMemo(() => stdMat(color, rough), [color, rough])
  const ref = useRef<THREE.Mesh>(null), halo = useRef<THREE.Mesh>(null)
  const last = useRef(-1)
  const { invalidate } = useThree()
  useEffect(() => { setOpacity(mat, opacity); invalidate() }, [opacity, mat, invalidate])
  const hl = useHighlight(mat, s.selected === id)
  const build = (k: number) => {
    const v = pts.map((p) => { const o = off(p[3], k, groupOffset); return new THREE.Vector3(p[0] + o[0], p[1] + o[1], p[2] + o[2]) })
    const curve = new THREE.CatmullRomCurve3(v, false, 'centripetal')
    const n = Math.max(24, pts.length * 4)
    if (ref.current) { ref.current.geometry.dispose(); ref.current.geometry = new THREE.TubeGeometry(curve, n, r, 10, false) }
    if (halo.current) { halo.current.geometry.dispose(); halo.current.geometry = new THREE.TubeGeometry(curve, n, Math.max(r + 0.12, 0.2), 6, false) }
  }
  useFrame(() => { const k = ex.current.v; if (Math.abs(k - last.current) > 0.003) { last.current = k; build(k) } })
  useEffect(() => { last.current = -1; invalidate() }, [pts, r, invalidate])
  const visible = layerOn && !s.hidden.has(id)
  const mid = pts[Math.floor(pts.length / 2)]
  return (
    <group visible={visible}>
      <mesh ref={ref} material={mat} />
      <mesh ref={halo} onClick={(e: ThreeEvent<MouseEvent>) => { e.stopPropagation(); s.onSelect(id) }} {...hl}>
        <meshBasicMaterial colorWrite={false} depthWrite={false} transparent opacity={0} />
      </mesh>
      {labelOn(s, id) && visible && <LabelSprite text={ELEMENT_NAME[id] ?? id} position={[mid[0], mid[1], mid[2] + (mid[2] > 0 ? 0.8 : -0.8)]} active={s.selected === id} />}
    </group>
  )
}

/* ───────── disco articular (esquemático) ───────── */
import { DISC } from '../figure/plateGeo'
function discGeometry() {
  const g = new THREE.CylinderGeometry(1, 1, 1, 64, 4, false)
  const p = g.attributes.position
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = p.getY(i), rho = Math.min(1, Math.hypot(x, z))
    const dish = (1 - rho * rho) * 0.5 // bicóncavo: más delgado en el centro
    p.setXYZ(i, x * DISC.rx, y * DISC.t * (0.55 + 0.45 * rho) - Math.sign(y) * dish * DISC.t * 0.0 + (y > 0 ? -dish * 0.05 : dish * 0.05), z * DISC.rz)
  }
  g.computeVertexNormals(); return g
}

function Disc({ s, ex }: { s: SceneState; ex: ExRef }) {
  const mat = useMemo(() => stdMat(COLORS.disc, 0.4), [])
  const geo = useMemo(discGeometry, [])
  const g = useRef<THREE.Group>(null)
  const { invalidate } = useThree()
  const layer = s.layers.superficies
  useEffect(() => { setOpacity(mat, 0.55 + 0.45 * layer.opacity); invalidate() }, [layer.opacity, mat, invalidate])
  useFrame(() => { if (g.current) { const o = explodeOffset('ulna'); const k = ex.current.v; g.current.position.set(DISC.c[0] + o[0] * k * 0.8, DISC.c[1] + o[1] * k * 0.5, DISC.c[2] + o[2] * k * 0.8) } })
  const hl = useHighlight(mat, s.selected === 'disco')
  const visible = layer.on && !s.hidden.has('disco')
  return (
    <group ref={g} visible={visible} position={[...DISC.c]}>
      <mesh geometry={geo} material={mat} onClick={(e) => { e.stopPropagation(); s.onSelect('disco') }} {...hl} />
      {labelOn(s, 'disco') && visible && <LabelSprite text="Disco articular" position={[0.2, 0.0, 1.5]} active={s.selected === 'disco'} />}
    </group>
  )
}

const RIB_CAT: Record<string, string> = {
  rsc: 'radiocarpiano', lrl: 'radiocarpiano', srl: 'radiocarpiano', rsl: 'radiocarpiano', 'radiocarpiano-dorsal': 'radiocarpiano',
  ulnolunar: 'ulnocarpiano', ulnotriquetral: 'ulnocarpiano', ulnocapitado: 'ulnocarpiano', 'colateral-radial': 'colateral', 'colateral-ulnar': 'colateral', 'intercarpiano-dorsal': 'intercarpiano',
}
const DIRECT_ITEMS: { id: string; keys: string[]; cat: string }[] = [
  { id: 'escafolunar', keys: ['escafolunar'], cat: 'intercarpiano' }, { id: 'lunopiramidal', keys: ['lunopiramidal'], cat: 'intercarpiano' },
  { id: 'radioulnares', keys: ['radioulnar-palmar', 'radioulnar-dorsal'], cat: 'radioulnar' },
]

export default function Procedural({ s, ex }: { s: SceneState; ex: ExRef }) {
  const lig = s.layers.ligamentos, nv = s.layers.neurovascular, mio = s.layers.miologia
  return (
    <>
      <Disc s={s} ex={ex} />
      {Object.entries(RIBBONS).map(([id, strips]) => <Ribbon key={id} id={id} strips={strips} color={LIG_COLOR[RIB_CAT[id]]} s={s} ex={ex} layerOn={lig.on} opacity={lig.opacity} />)}
      {DIRECT_ITEMS.flatMap((d) => d.keys.map((k) => <TubeItem key={k} id={d.id} pts={DIRECT[k].pts} r={DIRECT[k].r} color={LIG_COLOR[d.cat]} s={s} ex={ex} layerOn={lig.on} opacity={lig.opacity} rough={0.4} />))}
      {Object.entries(PATHS).map(([id, p]) => {
        if (id === 'fcu') return <TubeItem key={id} id={id} pts={p.pts} r={p.r} color={COLORS.tendon} s={s} ex={ex} layerOn={mio.on} opacity={mio.opacity} rough={0.55} groupOffset={[0, 0, 1.4]} />
        const col = NV_COLOR(id)
        return <TubeItem key={id} id={id} pts={p.pts} r={p.r} color={col} s={s} ex={ex} layerOn={nv.on} opacity={nv.opacity} groupOffset={[0, 0, id.startsWith('a-interosea-post') || id === 'n-interoseo-post' || id.startsWith('v-') || id === 'n-radial-sup' ? -1.4 : 1.4]} />
      })}
    </>
  )
}
