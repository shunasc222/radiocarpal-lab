import { useCallback, useEffect, useState } from 'react'
import { safeStorage } from './utils'

export type SectionId = 'inicio' | 'atlas' | 'explorador-3d' | 'ligamentos' | 'miologia' | 'neurovascular' | 'casos' | 'evaluacion'

export interface SectionDef { id: SectionId; n: number; titulo: string; corto: string; descripcion: string }

export const SECTIONS: SectionDef[] = [
  { id: 'inicio', n: 1, titulo: 'Inicio', corto: 'Inicio', descripcion: 'Presentación del laboratorio' },
  { id: 'atlas', n: 2, titulo: 'Atlas anatómico', corto: 'Atlas', descripcion: 'Osteología y superficies articulares' },
  { id: 'explorador-3d', n: 3, titulo: 'Explorador 3D', corto: '3D', descripcion: 'Modelo por capas (BodyParts3D)' },
  { id: 'ligamentos', n: 4, titulo: 'Ligamentos y estabilidad', corto: 'Ligamentos', descripcion: 'Medios de unión y estabilidad' },
  { id: 'miologia', n: 5, titulo: 'Miología y biomecánica', corto: 'Músculos', descripcion: 'Músculos y movimientos' },
  { id: 'neurovascular', n: 6, titulo: 'Vascularización e inervación', corto: 'Vasos y nervios', descripcion: 'Arterias, nervios y escafoides' },
  { id: 'casos', n: 7, titulo: 'Casos clínicos', corto: 'Casos', descripcion: 'Razonamiento anatómico aplicado' },
  { id: 'evaluacion', n: 8, titulo: 'Autoevaluación y bibliografía', corto: 'Evaluación', descripcion: 'Cuestionarios y referencias' },
]

const IDS = new Set<string>(SECTIONS.map((s) => s.id))

export function parseHash(hash: string): SectionId {
  const id = hash.replace(/^#\/?/, '').split('?')[0].split('/')[0]
  return IDS.has(id) ? (id as SectionId) : 'inicio'
}

const store = safeStorage()
const KEY = 'radiocarpal-lab.visited'

export function loadVisited(): SectionId[] {
  try {
    const raw = store.get(KEY)
    const arr = raw ? (JSON.parse(raw) as string[]) : []
    return arr.filter((x): x is SectionId => IDS.has(x))
  } catch { return [] }
}

export function useRoute() {
  const [section, setSection] = useState<SectionId>(() => parseHash(window.location.hash))
  const [visited, setVisited] = useState<SectionId[]>(loadVisited)

  useEffect(() => {
    const on = () => setSection(parseHash(window.location.hash))
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  useEffect(() => {
    setVisited((v) => {
      if (v.includes(section)) return v
      const next = [...v, section]
      store.set(KEY, JSON.stringify(next))
      return next
    })
    window.scrollTo({ top: 0 })
    document.title = section === 'inicio' ? 'RADIOCARPAL LAB — Anatomía interactiva de la muñeca' : `${SECTIONS.find((s) => s.id === section)!.titulo} · RADIOCARPAL LAB`
  }, [section])

  const go = useCallback((id: SectionId) => {
    window.location.hash = `#/${id}`
  }, [])

  return { section, go, visited }
}
