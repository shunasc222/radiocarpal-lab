import { RIBBONS, DIRECT, PATHS, BONE_ORDER } from '../../src/data/anatomy3d.generated'
import { LM, BOX, CENTROID } from '../../src/data/landmarks3d'
import { LAYER_ITEMS, LAYER_OF, describe3D } from '../../src/components/viewer3d/info3d'
import { BONE_IDS, LAYERS } from '../../src/components/viewer3d/config'

describe('modelo 3D: datos generados', () => {
  it('15 huesos con caja y centroide', () => {
    expect(BONE_ORDER).toHaveLength(15)
    for (const id of BONE_IDS) { expect(BOX[id]).toBeDefined(); expect(CENTROID[id]).toBeDefined() }
  })
  it('orientación: radio lateral (x<0) respecto de la ulna; escafoides lateral al piramidal; pisiforme palmar al piramidal', () => {
    expect(CENTROID.radio[0]).toBeLessThan(CENTROID.ulna[0])
    expect(CENTROID.escafoides[0]).toBeLessThan(CENTROID.semilunar[0])
    expect(CENTROID.semilunar[0]).toBeLessThan(CENTROID.piramidal[0])
    expect(CENTROID.pisiforme[2]).toBeGreaterThan(CENTROID.piramidal[2]) // z+ = palmar
    expect(CENTROID.trapecio[0]).toBeLessThan(CENTROID.ganchoso[0])
    expect(CENTROID.hueso_grande[1]).toBeLessThan(CENTROID.semilunar[1]) // fila distal por debajo (y−)
    expect(LM.ganchoso.hook[2]).toBeGreaterThan(LM.ganchoso.dorsal[2]) // el gancho es palmar
    expect(LM.radio.listerTubercle[2]).toBeLessThan(0) // tubérculo de Lister dorsal
    expect(LM.escafoides.tubercle[2]).toBeGreaterThan(0) // tubérculo del escafoides palmar
  })
  it('cintas, hilos y recorridos: puntos finitos con propietario válido', () => {
    const owners = (pts: number[][]) => pts.every((p) => p.every(Number.isFinite) && p[3] >= -1 && p[3] < BONE_ORDER.length)
    for (const strips of Object.values(RIBBONS)) for (const st of strips) { expect(st.length).toBeGreaterThan(5); for (const r of st) expect(r.every(Number.isFinite)).toBe(true) }
    for (const d of Object.values(DIRECT)) expect(owners(d.pts)).toBe(true)
    for (const p of Object.values(PATHS)) expect(owners(p.pts)).toBe(true)
  })
})

describe('modelo 3D: capas y fichas', () => {
  it('5 capas', () => expect(LAYERS.map((l) => l.id)).toEqual(['osteologia', 'superficies', 'ligamentos', 'miologia', 'neurovascular']))
  it('toda estructura de cada capa tiene ficha y pertenece a su capa', () => {
    for (const [layer, items] of Object.entries(LAYER_ITEMS)) for (const it of items) {
      const card = describe3D(it.id)
      expect(card, it.id).not.toBeNull()
      expect(card!.layer, it.id).toBe(layer)
      expect(LAYER_OF[it.id]).toBe(layer)
      expect(card!.fields.length).toBeGreaterThanOrEqual(2)
    }
  })
  it('las estructuras esquemáticas se declaran como tales y las mallas reales también', () => {
    expect(describe3D('rsc')!.provenance).toBe('esquematico')
    expect(describe3D('disco')!.provenance).toBe('esquematico')
    expect(describe3D('a-radial')!.provenance).toBe('esquematico')
    expect(describe3D('fcu')!.provenance).toBe('esquematico')
    expect(describe3D('escafoides')!.provenance).toBe('real')
    expect(describe3D('ecrb')!.provenance).toBe('real')
    expect(describe3D('retinaculo')!.provenance).toBe('real')
  })
  it('ECRL y ECRB conservan inserciones distintas en la ficha 3D', () => {
    expect(JSON.stringify(describe3D('ecrl'))).toMatch(/2\.º metacarpiano/)
    expect(JSON.stringify(describe3D('ecrb'))).toMatch(/3\.º metacarpiano/)
  })
})
