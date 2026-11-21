// Construye los GLB y los puntos de referencia de RADIOCARPAL LAB a partir de BodyParts3D 4.0
// (© The Database Center for Life Science, CC BY 4.0) distribuido en @somakine/bodyparts3d-musculoskeletal.
// Uso: npm run build:models
// Transformaciones aplicadas (declaradas en public/models/ATTRIBUTION.txt):
//  - selección de la mano/antebrazo DERECHOS; sistema de coordenadas del proyecto en cm (x radial→ulnar, y distal→proximal, z dorsal→palmar),
//    con origen en el borde proximal del semilunar;
//  - subdivisión Loop (suavizado) de los huesos; recorte en y = 10 cm con tapa plana;
//  - máscara aproximada de cartílago articular derivada de las normales y la altura de cada hueso;
//  - normales suaves recalculadas.
import { Document, NodeIO } from '@gltf-transform/core'
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs'
import * as THREE from 'three'
import { LoopSubdivision } from 'three-subdivide'

const PK = 'node_modules/@somakine/bodyparts3d-musculoskeletal/public'
const A = `${PK}/assets/bodyparts3d`
const OUT = 'public/models'
mkdirSync(OUT, { recursive: true })
const io = new NodeIO()
const YCUT = 10 // cm sobre la línea articular

/* ───────── lectura ───────── */
async function readNodes(file) {
  const doc = await io.read(`${A}/${file}`)
  const out = []
  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh(); if (!mesh) continue
    const m = node.getWorldMatrix()
    const P = [], I = []
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION'), idx = prim.getIndices(), base = P.length / 3
      for (let i = 0; i < pos.getCount(); i++) {
        const [x, y, z] = pos.getElement(i, [0, 0, 0])
        P.push((m[0] * x + m[4] * y + m[8] * z + m[12]) * 100, (m[1] * x + m[5] * y + m[9] * z + m[13]) * 100, (m[2] * x + m[6] * y + m[10] * z + m[14]) * 100)
      }
      if (idx) for (let i = 0; i < idx.getCount(); i++) I.push(base + idx.getScalar(i)); else for (let i = 0; i < pos.getCount(); i++) I.push(base + i)
    }
    out.push({ name: node.getName(), P, I })
  }
  return out
}
const cx = (g) => { let s = 0; for (let i = 0; i < g.P.length; i += 3) s += g.P[i]; return s / (g.P.length / 3) }

/** Elimina vértices duplicados por posición. */
function weld({ P, I }) {
  const map = new Map(), np = [], remap = new Int32Array(P.length / 3)
  for (let i = 0; i < P.length; i += 3) {
    const k = `${Math.round(P[i] * 1e4)}|${Math.round(P[i + 1] * 1e4)}|${Math.round(P[i + 2] * 1e4)}`
    let j = map.get(k); if (j === undefined) { j = np.length / 3; map.set(k, j); np.push(P[i], P[i + 1], P[i + 2]) }
    remap[i / 3] = j
  }
  const ni = []; for (let t = 0; t < I.length; t += 3) { const a = remap[I[t]], b = remap[I[t + 1]], c = remap[I[t + 2]]; if (a !== b && b !== c && a !== c) ni.push(a, b, c) }
  return { P: np, I: ni }
}

function subdivide(g, iterations) {
  if (!iterations) return g
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(g.P, 3)); geo.setIndex(g.I)
  const res = LoopSubdivision.modify(geo, iterations, { split: false, uvSmooth: false, preserveEdges: false, flatOnly: false })
  const pos = res.getAttribute('position'), idx = res.getIndex()
  const P = Array.from(pos.array), I = idx ? Array.from(idx.array) : Array.from({ length: pos.count }, (_, i) => i)
  return weld({ P, I })
}

/* ───────── normales y utilidades ───────── */
function normals({ P, I }) {
  const N = new Float32Array(P.length)
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t] * 3, b = I[t + 1] * 3, c = I[t + 2] * 3
    const ux = P[b] - P[a], uy = P[b + 1] - P[a + 1], uz = P[b + 2] - P[a + 2], vx = P[c] - P[a], vy = P[c + 1] - P[a + 1], vz = P[c + 2] - P[a + 2]
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx
    for (const k of [a, b, c]) { N[k] += nx; N[k + 1] += ny; N[k + 2] += nz }
  }
  for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l }
  return N
}
function smoothAttr(g, v, iters = 2) {
  const n = g.P.length / 3, nb = Array.from({ length: n }, () => new Set())
  for (let t = 0; t < g.I.length; t += 3) for (let k = 0; k < 3; k++) { nb[g.I[t + k]].add(g.I[t + (k + 1) % 3]); nb[g.I[t + k]].add(g.I[t + (k + 2) % 3]) }
  let cur = Float32Array.from(v)
  for (let it = 0; it < iters; it++) { const nx = new Float32Array(n); for (let i = 0; i < n; i++) { let s = cur[i], c = 1; for (const j of nb[i]) { s += cur[j]; c++ } nx[i] = s / c } cur = nx }
  return cur
}
const bbox = (g) => { const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (let i = 0; i < g.P.length; i += 3) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], g.P[i + k]); mx[k] = Math.max(mx[k], g.P[i + k]) } return { mn, mx } }
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t) }

/* ───────── recorte con tapa (y ≤ yc) ───────── */
function clipCap(g, attrs, yc, capAttr = -1, capVal = 1) {
  const { P, I } = g
  const NP = [], NA = attrs.map(() => []), map = new Map(), cache = new Map(), segs = [], tris = []
  const keep = (i) => {
    if (map.has(i)) return map.get(i)
    const j = NP.length / 3; NP.push(P[i * 3], P[i * 3 + 1], P[i * 3 + 2]); attrs.forEach((a, k) => NA[k].push(a[i])); map.set(i, j); return j
  }
  const cut = (i, o) => {
    const key = i < o ? `${i}_${o}` : `${o}_${i}`
    if (cache.has(key)) return cache.get(key)
    const t = (yc - P[i * 3 + 1]) / (P[o * 3 + 1] - P[i * 3 + 1]), j = NP.length / 3
    NP.push(P[i * 3] + t * (P[o * 3] - P[i * 3]), yc, P[i * 3 + 2] + t * (P[o * 3 + 2] - P[i * 3 + 2]))
    attrs.forEach((a, k) => NA[k].push(a[i] + t * (a[o] - a[i]))); cache.set(key, j); return j
  }
  for (let t = 0; t < I.length; t += 3) {
    const v = [I[t], I[t + 1], I[t + 2]], inside = v.map((i) => P[i * 3 + 1] <= yc), n = inside.filter(Boolean).length
    if (n === 3) tris.push(keep(v[0]), keep(v[1]), keep(v[2]))
    else if (n === 1) {
      const r = inside.indexOf(true), a = v[r], b = v[(r + 1) % 3], c = v[(r + 2) % 3]
      const i1 = cut(a, b), i2 = cut(a, c); tris.push(keep(a), i1, i2); segs.push([i1, i2])
    } else if (n === 2) {
      const r = inside.indexOf(false), o = v[r], a = v[(r + 1) % 3], b = v[(r + 2) % 3] // a,b dentro; orden cíclico o,a,b
      const i0 = cut(a, o), i1 = cut(b, o)  // tramo a→o y o→b
      // triángulos (a,b,i1),(a,i1,i0)  (a→b→o cíclico)
      tris.push(keep(a), keep(b), i1, keep(a), i1, i0); segs.push([i1, i0])
    }
  }
  // tapa: componentes conexas de segmentos
  const parent = new Map(); const f = (x) => { while (parent.get(x) !== x) { parent.set(x, parent.get(parent.get(x))); x = parent.get(x) } return x }
  for (const [a, b] of segs) { if (!parent.has(a)) parent.set(a, a); if (!parent.has(b)) parent.set(b, b); parent.set(f(a), f(b)) }
  const comps = new Map(); for (const s of segs) { const r = f(s[0]); (comps.get(r) ?? comps.set(r, []).get(r)).push(s) }
  const capStart = NP.length / 3
  for (const list of comps.values()) {
    const vs = new Set(); list.forEach(([a, b]) => { vs.add(a); vs.add(b) })
    let sx = 0, sz = 0; for (const v of vs) { sx += NP[v * 3]; sz += NP[v * 3 + 2] }
    const c = NP.length / 3; NP.push(sx / vs.size, yc, sz / vs.size); NA.forEach((a, k) => a.push(k === capAttr ? capVal : 0))
    const dup = new Map(); const d = (v) => { if (!dup.has(v)) { dup.set(v, NP.length / 3); NP.push(NP[v * 3], yc, NP[v * 3 + 2]); NA.forEach((a, k) => a.push(k === capAttr ? capVal : 0)) } return dup.get(v) }
    for (const [a, b] of list) tris.push(d(b), d(a), c)
  }
  return { g: { P: NP, I: tris }, attrs: NA, capStart }
}

function clipCapAbove(g, attrs, yc, capAttr = -1) {
  const m = { P: g.P.slice(), I: g.I.slice() }
  for (let i = 1; i < m.P.length; i += 3) m.P[i] = -m.P[i]
  const r = clipCap(m, attrs, -yc, capAttr, -1)
  for (let i = 1; i < r.g.P.length; i += 3) r.g.P[i] = -r.g.P[i]
  for (let t = 0; t < r.g.I.length; t += 3) { const a = r.g.I[t + 1]; r.g.I[t + 1] = r.g.I[t + 2]; r.g.I[t + 2] = a }
  return r
}

/* ───────── proceso de un hueso / músculo ───────── */
function stats(g) { const n = g.P.length / 3; let c = [0, 0, 0]; for (let i = 0; i < g.P.length; i += 3) for (let k = 0; k < 3; k++) c[k] += g.P[i + k]; return c.map((x) => x / n) }
function translate(g, o) { for (let i = 0; i < g.P.length; i += 3) { g.P[i] -= o[0]; g.P[i + 1] -= o[1]; g.P[i + 2] -= o[2] } }

/* ───────── ejecución ───────── */
const hand = (await readNodes('wrist-hand.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)
const fore = (await readNodes('elbow-forearm.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)
const handMus = (await readNodes('supplement-wrist-hand-muscle.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)
const foreMus = (await readNodes('supplement-elbow-forearm-muscle.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)
const conH = (await readNodes('supplement-wrist-hand-connective.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)
const conF = (await readNodes('supplement-elbow-forearm-connective.glb')).filter((n) => /isa:FJ\d+$/.test(n.name) && cx(n) < 0)

const BONES = {
  radio: ['radius', hand], ulna: ['ulna', fore], escafoides: ['scaphoid', hand], semilunar: ['lunate', hand], piramidal: ['triquetral', hand], pisiforme: ['pisiform', hand],
  trapecio: ['trapezium', hand], trapezoide: ['trapezoid', hand], hueso_grande: ['capitate', hand], ganchoso: ['hamate', hand],
  mc1: ['first-metacarpal-bone', hand], mc2: ['second-metacarpal-bone', hand], mc3: ['third-metacarpal-bone', hand], mc4: ['fourth-metacarpal-bone', hand], mc5: ['fifth-metacarpal-bone', hand],
}
const find = (list, key) => list.filter((n) => n.name.includes(`:${key}:`))
const raw = {}
for (const [id, [key, list]] of Object.entries(BONES)) { const f = find(list, key); if (f.length !== 1) throw new Error(`${id}: ${f.length}`); raw[id] = weld(f[0]) }

// origen: borde proximal del semilunar, centrado en el semilunar
const lun = raw.semilunar, lc = stats(lun), lb = bbox(lun)
const ORIGIN = [lc[0], lb.mx[1], lc[2]]
Object.values(raw).forEach((g) => translate(g, ORIGIN))
// Alinea el eje del antebrazo (radio + ulna, y = 3…10 cm) con la vertical mediante una rotación rígida de TODO el conjunto.
const axisOf = (g) => {
  const mean = (y0, y1) => { let sx = 0, sz = 0, n = 0, sy = 0; for (let i = 0; i < g.P.length; i += 3) if (g.P[i + 1] >= y0 && g.P[i + 1] < y1) { sx += g.P[i]; sy += g.P[i + 1]; sz += g.P[i + 2]; n++ } return [sx / n, sy / n, sz / n] }
  const a = mean(3, 5), b = mean(8, 10); return [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
}
const dr = axisOf(raw.radio), du = axisOf(raw.ulna)
const fa = new THREE.Vector3(dr[0] / dr[1] + du[0] / du[1], 2, dr[2] / dr[1] + du[2] / du[1]).normalize()
const Q = new THREE.Quaternion().setFromUnitVectors(fa, new THREE.Vector3(0, 1, 0))
const rot = (g) => { const v = new THREE.Vector3(); for (let i = 0; i < g.P.length; i += 3) { v.set(g.P[i], g.P[i + 1], g.P[i + 2]).applyQuaternion(Q); g.P[i] = v.x; g.P[i + 1] = v.y; g.P[i + 2] = v.z } }
console.log('Eje del antebrazo (x,y,z):', fa.toArray().map((x) => +x.toFixed(3)), '→ rotación de', +(THREE.MathUtils.radToDeg(2 * Math.acos(Q.w))).toFixed(1), '°')
Object.values(raw).forEach(rot)

const bones = {}
for (const [id, g0] of Object.entries(raw)) {
  const iters = /^mc|radio|ulna/.test(id) ? 1 : 2
  let g = subdivide(g0, iters)
  const N = normals(g), n = g.P.length / 3, bb = bbox(g), H = bb.mx[1] - bb.mn[1]
  const mask = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const x = g.P[i * 3], y = g.P[i * 3 + 1], ny = N[i * 3 + 1], nx = N[i * 3]
    if (id === 'radio') mask[i] = Math.max(ss(0.25, 0.6, -ny) * (1 - ss(bb.mn[1] + 1.0, bb.mn[1] + 1.5, y)), ss(0.5, 0.8, nx) * ss(bb.mn[1] + 0.3, bb.mn[1] + 0.8, y) * (1 - ss(bb.mn[1] + 2.4, bb.mn[1] + 3.0, y)))
    else if (id === 'ulna') mask[i] = Math.max(ss(0.45, 0.75, -ny) * (1 - ss(bb.mn[1] + 0.8, bb.mn[1] + 1.3, y)) * ss(bb.mn[1] + 0.25, bb.mn[1] + 0.45, y), ss(0.45, 0.75, -nx) * ss(bb.mn[1] + 0.5, bb.mn[1] + 0.9, y) * (1 - ss(bb.mn[1] + 2.1, bb.mn[1] + 2.7, y)))
    else if (['escafoides', 'semilunar', 'piramidal'].includes(id)) mask[i] = ss(0.2, 0.5, ny) * ss(bb.mn[1] + 0.45 * H, bb.mn[1] + 0.6 * H, y)
  }
  bones[id] = { g, mask: smoothAttr(g, mask, 2), x: x_ => x_, bb }
}
// recorte de huesos largos y metacarpianos
const kept = {}
for (const [id, b] of Object.entries(bones)) {
  if (id.startsWith('mc')) { const r = clipCapAbove(b.g, [b.mask], b.bb.mx[1] - 3.2); kept[id] = { g: r.g, mask: Float32Array.from(r.attrs[0]), cap: r.capStart, capY: -1 } }
  else if (id === 'radio' || id === 'ulna') { const r = clipCap(b.g, [b.mask], YCUT); kept[id] = { g: r.g, mask: Float32Array.from(r.attrs[0]), cap: r.capStart, capY: 1 } }
  else kept[id] = { g: b.g, mask: b.mask, cap: Infinity, capY: 1 }
}

/* ───────── músculos y tejido conectivo (reales) ───────── */
const mus = {}
const prep = (parts, subIters = 0) => { let g = weld(parts[0]); for (const p of parts.slice(1)) { const w = weld(p), off = g.P.length / 3; g.P.push(...w.P); g.I.push(...w.I.map((i) => i + off)) } translate(g, ORIGIN); rot(g); return g }
const MUS_DEF = {
  ecrl: [foreMus, ['extensor-carpi-radialis-longus']], ecrb: [foreMus, ['extensor-carpi-radialis-brevis']], fcr: [foreMus, ['flexor-carpi-radialis']],
  pl: [handMus, ['palmaris-longus']], ecu: [handMus, ['extensor-carpi-ulnaris']],
}
for (const [id, [list, keys]] of Object.entries(MUS_DEF)) {
  const parts = keys.flatMap((k) => find(list, k)); if (!parts.length) throw new Error(id)
  const g = prep(parts)
  // tendón: sección transversal local pequeña → color de tendón (0 = músculo, 1 = tendón)
  const n = g.P.length / 3, tend = new Float32Array(n), ys = []
  for (let i = 0; i < n; i++) ys.push(g.P[i * 3 + 1])
  const bins = new Map()
  for (let i = 0; i < n; i++) { const b = Math.round(g.P[i * 3 + 1] / 0.5); const e = bins.get(b) ?? { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 }; e.x0 = Math.min(e.x0, g.P[i * 3]); e.x1 = Math.max(e.x1, g.P[i * 3]); e.z0 = Math.min(e.z0, g.P[i * 3 + 2]); e.z1 = Math.max(e.z1, g.P[i * 3 + 2]); bins.set(b, e) }
  for (let i = 0; i < n; i++) { const e = bins.get(Math.round(g.P[i * 3 + 1] / 0.5)), w = Math.max(e.x1 - e.x0, e.z1 - e.z0); tend[i] = 1 - ss(0.75, 1.5, w) }
  const sm = smoothAttr(g, tend, 3)
  const zero = new Float32Array(n)
  let r = id === 'pl' ? clipCapAbove(g, [sm, zero], -1.8, 1) : { g, attrs: [sm, zero] }
  r = clipCap(r.g, r.attrs, YCUT, 1, 1)
  mus[id] = { g: r.g, mask: Float32Array.from(r.attrs[0]), capn: Float32Array.from(r.attrs[1]) }
}
const soft = {}
const ret = prep(find(conH, 'flexor-retinaculum-of-wrist')); soft.retinaculo = { g: ret, mask: new Float32Array(ret.P.length / 3) }
const imm = clipCap(prep(find(conF, 'interosseous-membrane-of-forearm')), [], YCUT); soft.membrana = { g: imm.g, mask: new Float32Array(imm.g.P.length / 3), cap: imm.capStart, capY: 1 }

/* ───────── escritura GLB ───────── */
function writeGlb(file, items, extraAttrName) {
  const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('wrist')
  for (const [id, it] of Object.entries(items)) {
    const N = normals(it.g)
    // las caras de la tapa conservan normal +y
    const cap = it.cap ?? Infinity
    const vcount = it.g.P.length / 3
    const normalsArr = Float32Array.from(N)
    // tapa: vértices desde 'cap' (si existe) tienen normal (0,1,0)
    if (it.capn) { for (let i = 0; i < vcount; i++) if (it.capn[i] !== 0) { normalsArr[i * 3] = 0; normalsArr[i * 3 + 1] = Math.sign(it.capn[i]); normalsArr[i * 3 + 2] = 0 } }
    else if (Number.isFinite(cap)) for (let i = cap; i < vcount; i++) { normalsArr[i * 3] = 0; normalsArr[i * 3 + 1] = it.capY ?? 1; normalsArr[i * 3 + 2] = 0 }
    const prim = doc.createPrimitive()
      .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(Float32Array.from(it.g.P)).setBuffer(buf))
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(normalsArr).setBuffer(buf))
      .setAttribute(extraAttrName, doc.createAccessor().setType('SCALAR').setArray(Float32Array.from(it.mask)).setBuffer(buf))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from(it.g.I)).setBuffer(buf))
    const mesh = doc.createMesh(id).addPrimitive(prim)
    scene.addChild(doc.createNode(id).setMesh(mesh))
  }
  return io.write(file, doc)
}
await writeGlb(`${OUT}/wrist-bones.glb`, kept, '_CARTILAGE')
await writeGlb(`${OUT}/wrist-soft.glb`, { ...mus, ...soft }, '_TENDON')

/* ───────── puntos de referencia (sobre la superficie de los huesos reales) ───────── */
const V = (g) => { const a = []; for (let i = 0; i < g.P.length; i += 3) a.push([g.P[i], g.P[i + 1], g.P[i + 2]]); return a }
const pick = (id, score, filter = () => true) => { let best = null, bs = -1e9; for (const v of V(kept[id].g)) { if (!filter(v)) continue; const s = score(v); if (s > bs) { bs = s; best = v } } return best.map((x) => +x.toFixed(3)) }
const bb = (id) => bbox(kept[id].g)
const cen = (id) => stats(kept[id].g).map((x) => +x.toFixed(3))
const R = bb('radio'), U = bb('ulna')
const LM = {
  radio: {
    styloidTip: pick('radio', (v) => -v[1] - 0.5 * v[0], (v) => v[0] < R.mn[0] + 0.45 * (R.mx[0] - R.mn[0])),
    volarRimLateral: pick('radio', (v) => v[2] - 0.2 * v[1] + 0.1 * -v[0], (v) => v[1] < R.mn[1] + 1.0 && v[0] < (R.mn[0] + R.mx[0]) / 2),
    volarRimMedial: pick('radio', (v) => v[2] + 0.2 * v[0], (v) => v[1] < R.mn[1] + 1.0 && v[0] > (R.mn[0] + R.mx[0]) / 2),
    volarRimMid: pick('radio', (v) => v[2] - Math.abs(v[0] - (R.mn[0] + R.mx[0]) / 2), (v) => v[1] < R.mn[1] + 1.2),
    dorsalRimLateral: pick('radio', (v) => -v[2] - 0.2 * v[0], (v) => v[1] < R.mn[1] + 1.0 && v[0] < (R.mn[0] + R.mx[0]) / 2),
    dorsalRimMedial: pick('radio', (v) => -v[2] + 0.2 * v[0], (v) => v[1] < R.mn[1] + 1.0 && v[0] > (R.mn[0] + R.mx[0]) / 2),
    dorsalRimMid: pick('radio', (v) => -v[2] - Math.abs(v[0] - (R.mn[0] + R.mx[0]) / 2), (v) => v[1] < R.mn[1] + 1.2),
    listerTubercle: pick('radio', (v) => -v[2], (v) => v[1] > R.mn[1] + 0.8 && v[1] < R.mn[1] + 2.6 && Math.abs(v[0] - (R.mn[0] + R.mx[0]) / 2) < 0.8),
    ulnarNotchLow: pick('radio', (v) => v[0] - 2 * v[1], (v) => v[1] < R.mn[1] + 1.4),
    ridge: pick('radio', (v) => -v[1], (v) => Math.abs(v[0] - (R.mn[0] * 0.6 + R.mx[0] * 0.4)) < 0.4 && v[1] < R.mn[1] + 1.0),
    ...(() => { const o = {}; return o })(),
  },
  ulna: {
    styloidTip: pick('ulna', (v) => -v[1], (v) => v[0] > U.mn[0] + 0.5 * (U.mx[0] - U.mn[0])),
    headBottom: pick('ulna', (v) => -v[1] - 0.8 * Math.abs(v[0] - (U.mn[0] + U.mx[0]) / 2), (v) => v[1] > U.mn[1] + 0.3),
    foveaVolar: pick('ulna', (v) => v[2] - v[1], (v) => v[1] < U.mn[1] + 1.1 && v[0] > (U.mn[0] + U.mx[0]) / 2 - 0.3),
    foveaDorsal: pick('ulna', (v) => -v[2] - v[1], (v) => v[1] < U.mn[1] + 1.1 && v[0] > (U.mn[0] + U.mx[0]) / 2 - 0.3),
  },
  escafoides: { tubercle: pick('escafoides', (v) => v[2] - v[0] * 0.5 - v[1] * 0.3), waistVolar: pick('escafoides', (v) => v[2], (v) => Math.abs(v[1] - stats(kept.escafoides.g)[1]) < 0.3), proximalPole: pick('escafoides', (v) => v[1] + 0.2 * v[0]), medialSide: pick('escafoides', (v) => v[0], (v) => v[1] > stats(kept.escafoides.g)[1] - 0.3), dorsal: pick('escafoides', (v) => -v[2]), radialSide: pick('escafoides', (v) => -v[0]), c: cen('escafoides') },
  semilunar: { volar: pick('semilunar', (v) => v[2] + 0.2 * v[1]), dorsal: pick('semilunar', (v) => -v[2] + 0.2 * v[1]), radialSide: pick('semilunar', (v) => -v[0]), ulnarSide: pick('semilunar', (v) => v[0]), c: cen('semilunar') },
  piramidal: { volar: pick('piramidal', (v) => v[2]), dorsal: pick('piramidal', (v) => -v[2]), radialSide: pick('piramidal', (v) => -v[0]), ulnarSide: pick('piramidal', (v) => v[0] + 0.3 * v[1]), c: cen('piramidal') },
  pisiforme: { c: cen('pisiforme'), top: pick('pisiforme', (v) => v[1]) },
  hueso_grande: { head: pick('hueso_grande', (v) => v[1]), volar: pick('hueso_grande', (v) => v[2]), dorsal: pick('hueso_grande', (v) => -v[2]), c: cen('hueso_grande') },
  ganchoso: { hook: pick('ganchoso', (v) => v[2]), dorsal: pick('ganchoso', (v) => -v[2]), c: cen('ganchoso') },
  trapecio: { tubercle: pick('trapecio', (v) => v[2]), c: cen('trapecio') },
  trapezoide: { dorsal: pick('trapezoide', (v) => -v[2]), c: cen('trapezoide') },
  mc2: { baseDorsal: pick('mc2', (v) => v[1] - v[2] * 0.3), baseVolar: pick('mc2', (v) => v[1] + v[2] * 0.3) },
  mc3: { baseDorsal: pick('mc3', (v) => v[1] - v[2] * 0.3), baseVolar: pick('mc3', (v) => v[1] + v[2] * 0.3) },
  mc5: { baseDorsal: pick('mc5', (v) => v[1] - v[2] * 0.3), baseVolar: pick('mc5', (v) => v[1] + v[2] * 0.3) },
}
// cortes de los huesos largos: caja x/z a cada cm
const slices = {}
for (const id of ['radio', 'ulna']) {
  slices[id] = []
  for (let y = 0; y <= 10; y++) { let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const v of V(kept[id].g)) if (Math.abs(v[1] - (y - 0.0)) < 0.35) { x0 = Math.min(x0, v[0]); x1 = Math.max(x1, v[0]); z0 = Math.min(z0, v[2]); z1 = Math.max(z1, v[2]) } slices[id].push([y, +x0.toFixed(2), +x1.toFixed(2), +z0.toFixed(2), +z1.toFixed(2)]) }
}
const boneBox = Object.fromEntries(Object.keys(kept).map((id) => [id, (({ mn, mx }) => ({ mn: mn.map((x) => +x.toFixed(3)), mx: mx.map((x) => +x.toFixed(3)) }))(bb(id))]))
const centroids = Object.fromEntries(Object.keys(kept).map((id) => [id, cen(id)]))
writeFileSync('src/data/landmarks3d.ts', `/* Generado por scripts/build-models.mjs a partir de BodyParts3D 4.0 (CC BY 4.0). No editar a mano. Unidades: cm. x: radial(−)→ulnar(+); y: distal(−)→proximal(+); z: dorsal(−)→palmar(+). */\nexport const LM = ${JSON.stringify(LM)} as const\nexport const SLICES = ${JSON.stringify(slices)} as const\nexport const BOX = ${JSON.stringify(boneBox)} as const\nexport const CENTROID = ${JSON.stringify(centroids)} as const\nexport const YCUT = ${YCUT}\n`)

/* ───────── ligamentos y vasos/nervios esquemáticos: drapeado por rayos sobre los huesos reales ───────── */
const BONE_ORDER = ['radio', 'ulna', 'escafoides', 'semilunar', 'piramidal', 'pisiforme', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso', 'mc1', 'mc2', 'mc3', 'mc4', 'mc5']
const ray = BONE_ORDER.map((id) => { const g = kept[id].g; return { P: Float32Array.from(g.P), I: Uint32Array.from(g.I), b: bbox(g) } })
function cast(o, d) {
  let best = Infinity, who = -1
  for (let bi = 0; bi < ray.length; bi++) {
    const { P, I, b } = ray[bi]
    // slab test
    let t0 = 0, t1 = best, ok = true
    for (let k = 0; k < 3 && ok; k++) {
      if (Math.abs(d[k]) < 1e-9) { if (o[k] < b.mn[k] || o[k] > b.mx[k]) ok = false } else { let a = (b.mn[k] - o[k]) / d[k], c = (b.mx[k] - o[k]) / d[k]; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); if (t0 > t1) ok = false }
    }
    if (!ok) continue
    for (let t = 0; t < I.length; t += 3) {
      const a = I[t] * 3, b2 = I[t + 1] * 3, c = I[t + 2] * 3
      const e1x = P[b2] - P[a], e1y = P[b2 + 1] - P[a + 1], e1z = P[b2 + 2] - P[a + 2], e2x = P[c] - P[a], e2y = P[c + 1] - P[a + 1], e2z = P[c + 2] - P[a + 2]
      const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x
      const det = e1x * px + e1y * py + e1z * pz; if (Math.abs(det) < 1e-12) continue
      const tx = o[0] - P[a], ty = o[1] - P[a + 1], tz = o[2] - P[a + 2], u = (tx * px + ty * py + tz * pz) / det; if (u < 0 || u > 1) continue
      const qx = ty * e1z - tz * e1y, qy = tz * e1x - tx * e1z, qz = tx * e1y - ty * e1x, v = (d[0] * qx + d[1] * qy + d[2] * qz) / det; if (v < 0 || u + v > 1) continue
      const tt = (e2x * qx + e2y * qy + e2z * qz) / det; if (tt > 1e-6 && tt < best) { best = tt; who = bi }
    }
  }
  return who < 0 ? null : { t: best, who }
}
const SIDES = {
  palmar: { from: (a, b) => [a, b, 9], dir: [0, 0, -1], at: (a, b, t, off) => [a, b, 9 - t + off], inplane: 'xy' },
  dorsal: { from: (a, b) => [a, b, -9], dir: [0, 0, 1], at: (a, b, t, off) => [a, b, -9 + t - off], inplane: 'xy' },
  radial: { from: (a, b) => [-9, a, b], dir: [1, 0, 0], at: (a, b, t, off) => [-9 + t - off, a, b], inplane: 'yz' },
  ulnar: { from: (a, b) => [9, a, b], dir: [-1, 0, 0], at: (a, b, t, off) => [9 - t + off, a, b], inplane: 'yz' },
}
const r2 = (x) => Math.round(x * 100) / 100
/** Traza un recorrido sobre la superficie ósea. Devuelve puntos [x,y,z,propietario]. */
function drapePath(side, path, off, n = 28) {
  const S = SIDES[side]
  const curve = new THREE.CatmullRomCurve3(path.map(([a, b]) => new THREE.Vector3(a, b, 0)), false, 'centripetal')
  const pts = curve.getPoints(n - 1)
  const out = pts.map((p) => { const h = cast(S.from(p.x, p.y), S.dir); return h ? { p: S.at(p.x, p.y, h.t, off), who: h.who } : { p: null, who: -1, a: p.x, b: p.y } })
  // rechaza saltos (rayos que atraviesan una rendija articular)
  const coord = side === 'palmar' || side === 'dorsal' ? 2 : 0
  const vals = out.filter((o) => o.p).map((o) => o.p[coord]).sort((a, b) => a - b)
  const med = vals.length ? vals[vals.length >> 1] : 0
  for (const o of out) if (o.p && Math.abs(o.p[coord] - med) > 1.1) { o.p = null }
  // rellena huecos por interpolación lineal
  for (let i = 0; i < out.length; i++) if (!out[i].p) {
    let a = i - 1, b = i + 1; while (a >= 0 && !out[a].p) a--; while (b < out.length && !out[b].p) b++
    const A = a >= 0 ? out[a] : out[b], B = b < out.length ? out[b] : out[a]
    const f = a >= 0 && b < out.length ? (i - a) / (b - a) : 0
    const xy = pts[i]; const q = [0, 0, 0]
    if (coord === 2) { q[0] = xy.x; q[1] = xy.y; q[2] = A.p[2] + (B.p[2] - A.p[2]) * f } else { q[0] = A.p[0] + (B.p[0] - A.p[0]) * f; q[1] = xy.x; q[2] = xy.y }
    out[i] = { p: q, who: f < 0.5 ? A.who : B.who }
  }
  return { out, pts }
}
const polyline = (side, path, off) => drapePath(side, path, off).out.map((o) => [r2(o.p[0]), r2(o.p[1]), r2(o.p[2]), o.who])
/** Cinta de ancho w sobre el hueso: cota = máximo entre centro y bordes, suavizada a lo largo del recorrido; 3 filas (izq., cresta, der.). */
function ribbon(side, path, off, w) {
  const { pts, out } = drapePath(side, path, off)
  const coord = side === 'palmar' || side === 'dorsal' ? 2 : 0
  const sgn = side === 'palmar' || side === 'ulnar' ? 1 : -1
  const L = [], Rr = []
  for (let i = 0; i < pts.length; i++) {
    const t = pts[Math.min(pts.length - 1, i + 1)].clone().sub(pts[Math.max(0, i - 1)]).normalize(), pr = new THREE.Vector3(-t.y, t.x, 0)
    L.push([pts[i].x + pr.x * w / 2, pts[i].y + pr.y * w / 2]); Rr.push([pts[i].x - pr.x * w / 2, pts[i].y - pr.y * w / 2])
  }
  const a = polyline_(side, L, off), b = polyline_(side, Rr, off)
  let h = out.map((o, i) => sgn * Math.max(sgn * o.p[coord], sgn * a[i][coord], sgn * b[i][coord]))
  for (let it = 0; it < 4; it++) h = h.map((v, i) => (h[Math.max(0, i - 1)] + 2 * v + h[Math.min(h.length - 1, i + 1)]) / 4)
  const crest = 0.05 * sgn
  const mk = (xy, z) => (coord === 2 ? [r2(xy[0]), r2(xy[1]), r2(z)] : [r2(z), r2(xy[0]), r2(xy[1])])
  const own = (i) => out[i].who
  return pts.map((c, i) => [...mk(L[i], h[i]), own(i), ...mk([c.x, c.y], h[i] + crest), own(i), ...mk(Rr[i], h[i]), own(i)])
}
function polyline_(side, list, off) {
  const S = SIDES[side]
  const res = list.map(([a, b]) => { const h = cast(S.from(a, b), S.dir); return h ? { p: S.at(a, b, h.t, off), who: h.who } : null })
  const coord = side === 'palmar' || side === 'dorsal' ? 2 : 0
  const vals = res.filter(Boolean).map((o) => o.p[coord]).sort((x, y) => x - y), med = vals.length ? vals[vals.length >> 1] : 0
  return res.map((o, i) => {
    if (o && Math.abs(o.p[coord] - med) <= 1.1) return [r2(o.p[0]), r2(o.p[1]), r2(o.p[2]), o.who]
    const [a, b] = list[i]; const q = coord === 2 ? [a, b, med] : [med, a, b]; return [r2(q[0]), r2(q[1]), r2(q[2]), -1]
  })
}

const LIG = {
  rsc: [{ side: 'palmar', path: [[-2.2, 0.05], [-2.45, -0.7], [-1.85, -1.15], [-1.2, -1.45]], w: 0.34, off: 0.03 }],
  lrl: [{ side: 'palmar', path: [[-1.65, 0.08], [-0.95, -0.15], [-0.25, -0.6]], w: 0.3, off: 0.04 }],
  srl: [{ side: 'palmar', path: [[-1.0, 0.1], [-0.6, -0.2], [-0.35, -0.5]], w: 0.24, off: 0.06 }],
  rsl: [{ side: 'palmar', path: [[-1.62, 0.12], [-1.3, -0.1], [-1.1, -0.35]], w: 0.16, off: 0.08 }],
  ulnolunar: [{ side: 'palmar', path: [[0.45, 0.05], [0.25, -0.35], [0.05, -0.7]], w: 0.26, off: 0.04 }],
  ulnotriquetral: [{ side: 'palmar', path: [[0.85, 0.0], [0.9, -0.65], [0.9, -1.2]], w: 0.26, off: 0.04 }],
  ulnocapitado: [{ side: 'palmar', path: [[0.55, 0.0], [0.05, -0.95], [-0.55, -1.55], [-0.95, -1.7]], w: 0.2, off: 0.1 }],
  'radiocarpiano-dorsal': [
    { side: 'dorsal', path: [[-2.15, 0.2], [-1.25, -0.2], [-0.35, -0.72]], w: 0.34, off: 0.04 },
    { side: 'dorsal', path: [[-1.7, 0.2], [-0.5, -0.65], [0.8, -1.35]], w: 0.36, off: 0.04 },
  ],
  'intercarpiano-dorsal': [{ side: 'dorsal', path: [[0.8, -1.4], [0.05, -1.75], [-0.8, -2.05], [-1.8, -2.1]], w: 0.3, off: 0.04 }],
  'colateral-radial': [{ side: 'radial', path: [[-0.8, -0.1], [-1.2, 0.15], [-1.6, 0.45]], w: 0.32, off: 0.03 }],
  'colateral-ulnar': [{ side: 'ulnar', path: [[-0.25, -0.55], [-0.75, -0.2], [-1.15, 0.15]], w: 0.32, off: 0.03 }],
}
const ligOut = {}
for (const [id, strips] of Object.entries(LIG)) ligOut[id] = strips.map((s) => ribbon(s.side, s.path, s.off, s.w))
// ligamentos «directos» (interóseos y radioulnares): hilos 3D entre puntos de referencia, con propietario
const DIRECT = {
  escafolunar: { r: 0.075, pts: [[-0.64, -0.12, -0.8, 'escafoides'], [-0.64, -0.08, -0.25, 'escafoides'], [-0.64, -0.12, 0.4, 'escafoides']] },
  lunopiramidal: { r: 0.075, pts: [[0.52, -0.5, -0.62, 'semilunar'], [0.52, -0.5, -0.05, 'semilunar'], [0.52, -0.55, 0.5, 'semilunar']] },
  'radioulnar-palmar': { r: 0.07, pts: [[-0.42, 0.03, 0.78, 'radio'], [0.3, 0.02, 0.7, 'ulna'], [0.95, -0.05, 0.5, 'ulna']] },
  'radioulnar-dorsal': { r: 0.07, pts: [[-0.5, 0.03, -0.82, 'radio'], [0.3, 0.02, -0.88, 'ulna'], [0.95, -0.08, -0.78, 'ulna']] },
}
const directOut = Object.fromEntries(Object.entries(DIRECT).map(([k, v]) => [k, { r: v.r, pts: v.pts.map(([x, y, z, b]) => [x, y, z, BONE_ORDER.indexOf(b)]) }]))
// vasos y nervios: recorridos drapeados con desplazamiento sobre el hueso (tejidos blandos)
const direct3 = (pts, who = -1) => pts.map(([x, y, z]) => [x, y, z, who])
const smoothPts = (pts, passes = 3) => { let p = pts.map((q) => q.slice()); for (let it = 0; it < passes; it++) p = p.map((q, i) => (i === 0 || i === p.length - 1 ? q : [0, 1, 2].map((k) => r2((p[i - 1][k] + 2 * q[k] + p[i + 1][k]) / 4)).concat([q[3]]))); return p }
const NVP = {
  'a-radial': { r: 0.1, pts: [...polyline('palmar', [[-2.4, 9.5], [-2.5, 6], [-2.6, 3.2], [-2.75, 1.2], [-2.9, 0.1]], 0.32), ...polyline('radial', [[-0.25, 0.5], [-1.0, 0.25], [-1.35, -0.2]], 0.22), ...polyline('dorsal', [[-2.35, -1.0], [-2.05, -1.75], [-1.9, -2.5]], 0.2)] },
  'a-ulnar': { r: 0.1, pts: polyline('palmar', [[0.3, 9.5], [0.4, 6], [0.5, 3.2], [0.55, 1], [0.55, -0.9], [0.45, -1.8], [0.2, -2.35]], 0.48) },
  'n-mediano': { r: 0.1, pts: polyline('palmar', [[-1.35, 9.5], [-1.3, 6], [-1.25, 3.2], [-1.25, 1], [-1.3, -0.8], [-1.3, -1.9], [-1.25, -3.0]], 0.7) },
  'n-ulnar': { r: 0.09, pts: polyline('palmar', [[0.78, 9.5], [0.78, 6], [0.8, 3.2], [0.82, 1], [0.8, -0.9], [0.62, -1.85], [0.38, -2.45]], 0.5) },
  'n-radial-sup': { r: 0.07, pts: polyline('dorsal', [[-2.9, 9.5], [-2.92, 7], [-3.0, 4.5], [-3.1, 2.5], [-3.05, 0.6], [-2.75, -0.6], [-2.45, -1.5], [-2.3, -2.4]], 0.2) },
  'v-cefalica': { r: 0.11, pts: polyline('dorsal', [[-3.4, 9.5], [-3.5, 7], [-3.6, 4.5], [-3.6, 2.5], [-3.5, 0.6], [-3.1, -0.7], [-2.7, -1.6]], 0.42) },
  'v-basilica': { r: 0.11, pts: polyline('dorsal', [[1.5, 9.5], [1.6, 7], [1.65, 4.5], [1.65, 2.5], [1.7, 0.6], [1.75, -1.0], [1.5, -2.0]], 0.42) },
  'a-interosea-ant': { r: 0.065, pts: direct3([[-0.8, 9.5, 0.1], [-0.75, 6, 0.1], [-0.6, 3, 0.15], [-0.5, 1.4, 0.35]]) },
  'n-interoseo-ant': { r: 0.055, pts: direct3([[-0.7, 9.5, 0.2], [-0.65, 6, 0.2], [-0.52, 3, 0.25], [-0.45, 1.2, 0.45], [-0.5, 0.35, 0.62]]) },
  'a-interosea-post': { r: 0.06, pts: direct3([[-0.85, 9.5, -0.45], [-0.78, 6, -0.4], [-0.62, 3, -0.4], [-0.55, 1.0, -0.7]]) },
  'n-interoseo-post': { r: 0.05, pts: direct3([[-0.95, 9.5, -0.55], [-0.85, 6, -0.5], [-0.68, 3, -0.5], [-0.6, 1.0, -0.82], [-0.6, 0.3, -0.9]]) },
}
// FCU (no incluido en BodyParts3D): recorrido esquemático hasta el pisiforme
const fcuPts = polyline('palmar', [[1.2, 9.5], [1.25, 6], [1.25, 3], [1.2, 1], [1.12, -0.6], [1.1, -1.4]], 0.5)
NVP.fcu = { r: 0.17, pts: fcuPts }
for (const k of Object.keys(NVP)) NVP[k].pts = smoothPts(NVP[k].pts, k.startsWith('a-interosea') || k.startsWith('n-interoseo') ? 0 : 4)
writeFileSync('src/data/anatomy3d.generated.ts', `/* Generado por scripts/build-models.mjs. Recorridos ESQUEMÁTICOS calculados sobre la geometría de BodyParts3D (trazado por rayos). Unidades: cm. Último valor de cada punto = índice del hueso propietario (BONE_ORDER) o −1. */\nexport const BONE_ORDER = ${JSON.stringify(BONE_ORDER)} as const\nexport const RIBBONS: Record<string, number[][][]> = ${JSON.stringify(ligOut)}\nexport const DIRECT: Record<string, { r: number; pts: number[][] }> = ${JSON.stringify(directOut)}\nexport const PATHS: Record<string, { r: number; pts: number[][] }> = ${JSON.stringify(NVP)}\n`)
copyFileSync(`${PK}/LICENSE.bodyparts3d.txt`, `${OUT}/LICENSE.bodyparts3d.txt`)
copyFileSync(`${PK}/LICENSE.bodyparts3d-supplemental.txt`, `${OUT}/LICENSE.bodyparts3d-supplemental.txt`)
writeFileSync(`${OUT}/ATTRIBUTION.txt`, `MODELOS 3D DE RADIOCARPAL LAB

Los huesos (radio, ulna, escafoides, semilunar, piramidal, pisiforme, trapecio, trapezoide, hueso grande, ganchoso, metacarpianos),
los músculos (flexor radial del carpo, palmar largo, extensor radial largo y corto del carpo, extensor ulnar del carpo),
el retináculo flexor y la membrana interósea provienen de:

  BodyParts3D 4.0, © The Database Center for Life Science, licenciado bajo Creative Commons Attribution 4.0 International (CC BY 4.0)
  https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
  Licencia: https://creativecommons.org/licenses/by/4.0/

Obtenidos mediante el paquete npm @somakine/bodyparts3d-musculoskeletal (CC BY 4.0), que reorganiza los OBJ originales en GLB.

MODIFICACIONES realizadas por RADIOCARPAL LAB (scripts/build-models.mjs):
  - selección de la extremidad superior derecha y cambio de unidades/ejes;
  - suavizado por subdivisión Loop de los huesos; recorte de radio, ulna, metacarpianos y músculos con tapa plana;
  - recálculo de normales; máscara aproximada del cartílago articular (derivada de la geometría) y del tramo tendinoso de cada músculo.

NO provienen de BodyParts3D (son esquemáticos, construidos a partir de puntos de referencia calculados sobre los huesos reales):
  disco articular, ligamentos radiocarpianos/ulnocarpianos/intercarpianos, flexor ulnar del carpo, arterias, venas y nervios.
`)
console.log('Modelos generados:', Object.keys(kept).length, 'huesos,', Object.keys(mus).length, 'músculos')
