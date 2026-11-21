import { bone3DInfo } from '../../data/bones3d'
import { CATEGORY_LABEL, LIG_BY_ID } from '../../data/ligaments'
import { MOVEMENT_BY_ID } from '../../data/movements'
import { MUSCLES } from '../../data/muscles'
import { NV_BY_ID } from '../../data/neurovascular'
import { BONE_IDS, type BoneId, type LayerId } from './config'

export type Provenance = 'real' | 'esquematico'
export interface CardField { label: string; text: string; tone?: 'sage' | 'rose' | 'lilac' | 'steel' }
export interface CardData { id: string; layer: LayerId; title: string; badges: { text: string; tone: 'sage' | 'rose' | 'lilac' | 'steel' }[]; fields: CardField[]; note?: string; provenance: Provenance }

const REAL = 'Forma: malla real de BodyParts3D 4.0 (CC BY 4.0), suavizada y recortada.'
const SCHEM = 'Representación esquemática: recorrido e inserciones aproximados, calculados sobre los huesos reales; no es una disección.'

const VEINS: Record<string, { nombre: string; trayecto: string; clinica: string }> = {
  'v-cefalica': { nombre: 'Vena cefálica', trayecto: 'Vena superficial del lado radial del dorso de la mano y del antebrazo; nace de la red venosa dorsal y asciende por el borde lateral.', clinica: 'Lugar frecuente de venopunción; está próxima a las ramas sensitivas del nervio radial superficial.' },
  'v-basilica': { nombre: 'Vena basílica', trayecto: 'Vena superficial del lado ulnar del dorso de la mano y del antebrazo; asciende por el borde medial.', clinica: 'Se emplea en accesos venosos; se relaciona con ramas del nervio cutáneo antebraquial medial.' },
}

export function describe3D(id: string): CardData | null {
  if ((BONE_IDS as readonly string[]).includes(id)) {
    const s = bone3DInfo(id as BoneId)
    return {
      id, layer: 'osteologia', title: s.nombre, provenance: 'real',
      badges: [{ text: s.participacion === 'directa' ? 'Participa directamente' : 'Estructura relacionada', tone: s.participacion === 'directa' ? 'rose' : 'steel' }, { text: s.grupo, tone: 'sage' }],
      fields: [
        { label: 'Ubicación', text: s.ubicacion, tone: 'sage' }, { label: 'Descripción', text: s.descripcion, tone: 'rose' }, { label: 'Función', text: s.funcion, tone: 'lilac' },
        { label: 'Relaciones anatómicas', text: s.relaciones, tone: 'steel' }, { label: 'Importancia clínica', text: s.clinica, tone: 'rose' },
      ],
      note: `${REAL} ${s.participacionNota}`,
    }
  }
  if (id === 'disco') {
    const d = LIG_BY_ID['tfcc']
    return {
      id, layer: 'superficies', title: 'Disco articular (fibrocartílago triangular)', provenance: 'esquematico',
      badges: [{ text: 'Participa directamente', tone: 'rose' }, { text: 'Partes blandas', tone: 'sage' }],
      fields: [
        { label: 'Ubicación', text: 'Entre la cabeza de la ulna y los huesos semilunar y piramidal; del borde distal de la escotadura ulnar del radio a la base de la estiloides ulnar.', tone: 'sage' },
        { label: 'Función', text: d.funcion, tone: 'lilac' }, { label: 'Estabilidad', text: d.estabilidad, tone: 'steel' }, { label: 'Importancia clínica', text: d.lesion, tone: 'rose' },
      ],
      note: 'El disco no está en el conjunto de datos de BodyParts3D: se representa como un disco bicóncavo esquemático. Su posición es aproximada.',
    }
  }
  const lig = LIG_BY_ID[id]
  if (lig && lig.id !== 'capsula' && lig.id !== 'sinovial' && lig.id !== 'tfcc') {
    const real = id === 'retinaculo' || id === 'membrana'
    return {
      id, layer: 'ligamentos', title: lig.nombre, provenance: real ? 'real' : 'esquematico',
      badges: [{ text: lig.propio ? 'Propio de la radiocarpiana' : lig.categoria === 'radioulnar' ? 'Estabilizador radioulnar distal' : lig.categoria === 'intercarpiano' ? 'Intercarpiano' : 'Estructura vecina', tone: lig.propio ? 'rose' : 'steel' }, { text: CATEGORY_LABEL[lig.categoria], tone: 'sage' }],
      fields: [
        { label: 'Origen', text: lig.origen, tone: 'sage' }, { label: 'Inserción', text: lig.insercion, tone: 'rose' }, { label: 'Función', text: lig.funcion, tone: 'lilac' },
        { label: 'Función estabilizadora', text: lig.estabilidad, tone: 'steel' }, { label: 'Relación con lesiones clínicas', text: lig.lesion, tone: 'rose' },
      ],
      note: real ? `${REAL}${lig.nota ? ' ' + lig.nota : ''}` : `${SCHEM}${lig.nota ? ' ' + lig.nota : ''}`,
    }
  }
  const mus = MUSCLES.find((m) => m.id === id)
  if (mus) {
    return {
      id, layer: 'miologia', title: mus.nombre, provenance: id === 'fcu' ? 'esquematico' : 'real',
      badges: [{ text: mus.grupo === 'flexor' ? 'Flexor' : 'Extensor', tone: mus.grupo === 'flexor' ? 'rose' : 'steel' }, { text: 'Motor principal', tone: 'sage' }],
      fields: [
        { label: 'Origen principal', text: mus.origen, tone: 'sage' }, { label: 'Inserción distal', text: mus.insercion, tone: 'rose' }, { label: 'Inervación', text: mus.inervacion, tone: 'lilac' },
        { label: 'Acción', text: mus.accion, tone: 'steel' }, { label: 'Función estabilizadora', text: mus.estabilizacion, tone: 'sage' },
        { label: 'Movimientos', text: mus.movimientos.map((m) => MOVEMENT_BY_ID[m].nombre).join(', '), tone: 'lilac' },
      ],
      note: id === 'fcu'
        ? 'El flexor ulnar del carpo no está en el conjunto de datos de BodyParts3D: se dibuja solo su tendón, de forma esquemática, hasta el pisiforme.'
        : 'Forma: malla real de BodyParts3D 4.0 (CC BY 4.0) recortada a 10 cm de la línea articular. El tramo tendinoso (claro) se estimó por el calibre del músculo.',
    }
  }
  const nv = NV_BY_ID[id]
  if (nv) {
    const fields: CardField[] = [
      { label: 'Origen', text: nv.origen, tone: 'sage' }, { label: 'Trayecto', text: nv.trayecto, tone: 'rose' }, { label: 'Relación con la muñeca', text: nv.relacionMuneca, tone: 'lilac' },
      { label: nv.kind === 'arteria' ? 'Territorio irrigado' : 'Territorio y función', text: nv.territorio, tone: 'steel' },
    ]
    if (nv.kind === 'nervio') fields.push({ label: 'Inervación motora', text: nv.motora ?? '', tone: 'rose' }, { label: 'Sensibilidad cutánea', text: nv.cutanea ?? '', tone: 'lilac' }, { label: 'Inervación articular', text: nv.articular ?? '', tone: 'steel' })
    fields.push({ label: 'Relación clínica', text: nv.clinica, tone: 'rose' })
    return { id, layer: 'neurovascular', title: nv.nombre, provenance: 'esquematico', badges: [{ text: nv.kind === 'arteria' ? 'Arteria' : 'Nervio', tone: nv.kind === 'arteria' ? 'rose' : 'lilac' }, { text: nv.plano, tone: 'sage' }], fields, note: `${SCHEM} Los vasos y nervios no forman parte de BodyParts3D.` }
  }
  const v = VEINS[id]
  if (v) return { id, layer: 'neurovascular', title: v.nombre, provenance: 'esquematico', badges: [{ text: 'Vena superficial', tone: 'steel' }], fields: [{ label: 'Trayecto', text: v.trayecto, tone: 'rose' }, { label: 'Relación clínica', text: v.clinica, tone: 'lilac' }], note: SCHEM }
  return null
}

/** Estructuras de cada capa (para las listas de visibilidad/selección). */
export const LAYER_ITEMS: Record<LayerId, { id: string; name: string }[]> = {
  osteologia: BONE_IDS.map((id) => ({ id, name: bone3DInfo(id).nombre })),
  superficies: [{ id: 'disco', name: 'Disco articular' }],
  ligamentos: [
    'rsc', 'lrl', 'srl', 'rsl', 'radiocarpiano-dorsal', 'ulnolunar', 'ulnotriquetral', 'ulnocapitado', 'colateral-radial', 'colateral-ulnar', 'escafolunar', 'lunopiramidal', 'intercarpiano-dorsal', 'radioulnares', 'retinaculo', 'membrana',
  ].map((id) => ({ id, name: LIG_BY_ID[id].nombre.replace('Ligamento ', '').replace(' (ligamento transverso del carpo)', '').replace(' (Testut-Kuentz)', '').replace(' (porción distal)', '') })),
  miologia: MUSCLES.map((m) => ({ id: m.id, name: m.nombre })),
  neurovascular: [
    ...['a-radial', 'a-ulnar', 'a-interosea-ant', 'a-interosea-post', 'n-mediano', 'n-ulnar', 'n-radial-sup', 'n-interoseo-ant', 'n-interoseo-post'].map((id) => ({ id, name: NV_BY_ID[id].nombre.replace(' (rama superficial)', ' (superficial)').replace(' (rama profunda del radial)', '') })),
    { id: 'v-cefalica', name: VEINS['v-cefalica'].nombre }, { id: 'v-basilica', name: VEINS['v-basilica'].nombre },
  ],
}
export const LAYER_OF: Record<string, LayerId> = Object.fromEntries((Object.entries(LAYER_ITEMS) as [LayerId, { id: string }[]][]).flatMap(([l, items]) => items.map((i) => [i.id, l])))
LAYER_OF.fcu = 'miologia'

/** ¿Debe mostrarse la etiqueta de esta estructura? Solo la capa elegida (o la estructura seleccionada). */
export function labelOn(s: { labels: boolean; labelLayer: LayerId | null; selected: string | null }, id: string): boolean {
  return s.selected === id || (s.labels && (s.labelLayer === null || LAYER_OF[id] === s.labelLayer))
}
