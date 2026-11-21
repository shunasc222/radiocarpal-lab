import { useMemo } from 'react'
import { PLATES } from '../../data/plates.generated'
import { STRUCTURE_BY_ID } from '../../data/structures'
import { cn } from '../../lib/utils'
import { discPath, proj } from './plateGeo'

export type AtlasView = 'palmar' | 'dorsal' | 'distal'
export const SHORT: Record<string, string> = {
  'radio-distal': 'Radio distal', 'estiloides-radio': 'Estiloides radial', 'fosita-escafoidea': 'Fosita escafoidea',
  'cresta-interfacetaria': 'Cresta interfacetaria', 'fosita-semilunar': 'Fosita semilunar', 'escotadura-ulnar': 'Escotadura ulnar',
  escafoides: 'Escafoides', semilunar: 'Semilunar', 'ulna-distal': 'Ulna distal', 'estiloides-ulnar': 'Estiloides ulnar',
  disco: 'Disco articular', piramidal: 'Piramidal', pisiforme: 'Pisiforme',
}
const BASE = import.meta.env.BASE_URL
const DISC_SIZE = 0
void DISC_SIZE

/** Zonas disponibles en cada vista (id → trazado y centroide en píxeles de la lámina). */
export function zonesOf(view: AtlasView): Record<string, { d: string; cx: number; cy: number }> {
  const P = PLATES[view], z: Record<string, { d: string; cx: number; cy: number }> = { ...P.zones }
  if (view !== 'distal') { const [cx, cy] = proj(view, 0.4, -0.07, -0.1); z.disco = { d: discPath(view), cx, cy } }
  return z
}
export const VIEW_OF: Record<string, AtlasView> = { 'fosita-escafoidea': 'distal', 'fosita-semilunar': 'distal', 'cresta-interfacetaria': 'distal', 'escotadura-ulnar': 'distal', 'superficie-articular': 'distal' }

export interface AtlasFigureProps {
  view: AtlasView
  selected: string | null
  onSelect?: (id: string) => void
  showLabels: boolean
  highlightSurfaces: boolean
  target?: string | null
  onlyLabels?: string[]
  wide: boolean
  viewBox?: string
  labelMargin?: number
  interactive?: boolean
  className?: string
}

function expand(id: string | null): Set<string> {
  const out = new Set<string>(); if (!id) return out
  out.add(id); STRUCTURE_BY_ID[id]?.hijos?.forEach((h) => out.add(h)); return out
}

export default function AtlasFigure({ view, selected, onSelect, showLabels, highlightSurfaces, target, onlyLabels, wide, viewBox: vb, labelMargin = 215, interactive = true, className }: AtlasFigureProps) {
  const P = PLATES[view], zones = useMemo(() => zonesOf(view), [view])
  const sel = useMemo(() => expand(selected), [selected])
  const crop = view === 'distal' ? { y0: 140, y1: 600 } : { y0: (P.a1 - 5.6) * P.S, y1: P.h - 0.3 * P.S }
  const m = wide ? labelMargin : 0
  const viewBox = vb ?? `${-m} ${crop.y0} ${P.w + 2 * m} ${crop.y1 - crop.y0}`
  const order = Object.keys(zones).filter((id) => id !== 'ctx')
  // etiquetas: columna izquierda/derecha según la posición del centroide; separadas verticalmente
  const labels = useMemo(() => {
    const ids = Object.keys(zones).filter((id) => (onlyLabels ? onlyLabels.includes(id) : true) && SHORT[id])
    const place = (side: 'l' | 'r') => {
      const list = ids.filter((id) => (zones[id].cx < P.w / 2) === (side === 'l')).sort((a, b) => zones[a].cy - zones[b].cy)
      let last = -1e9
      return list.map((id) => { const y = Math.max(zones[id].cy, last + 46); last = y; return { id, side, ty: y } })
    }
    return [...place('l'), ...place('r')]
  }, [zones, onlyLabels, P.w])
  const img = `${BASE}atlas/${view}${highlightSurfaces ? '-surf' : ''}.webp`

  return (
    <svg viewBox={viewBox} role="group" aria-label={`Esquema anatómico real de la articulación radiocarpiana, vista ${view === 'distal' ? 'distal del radio y la ulna' : view}`} className={cn('block h-auto w-full select-none', className)} preserveAspectRatio="xMidYMid meet">
      <image href={img} x="0" y="0" width={P.w} height={P.h} />
      {highlightSurfaces && view !== 'distal' && zones.disco && <path d={zones.disco.d} fill="#a8587a" fillOpacity=".55" stroke="#a8587a" strokeWidth="1.5" aria-hidden />}
      {highlightSurfaces && view === 'distal' && ['fosita-escafoidea', 'fosita-semilunar', 'cresta-interfacetaria', 'escotadura-ulnar'].map((id) => zones[id] && <path key={id} d={zones[id].d} fill="none" stroke="#a8587a" strokeWidth="2.2" strokeDasharray="6 5" aria-hidden />)}
      <g>
        {order.map((id) => {
          const z = zones[id], isSel = sel.has(id), isT = target === id, name = STRUCTURE_BY_ID[id]?.nombre ?? id
          return (
            <path key={id} d={z.d} fillRule="evenodd" className={cn('zone', isT && 'pulse')}
              role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? (target ? 'Zona anatómica' : name) : undefined} aria-pressed={interactive ? isSel : undefined}
              fill={isSel || isT ? '#7a64a3' : '#ffffff'} fillOpacity={isSel ? 0.38 : isT ? 0.5 : 0}
              stroke={isSel ? '#536b5a' : isT ? '#7a64a3' : 'transparent'} strokeWidth={isSel || isT ? 3 : 0} strokeLinejoin="round"
              pointerEvents={interactive ? 'all' : 'none'}
              onClick={interactive && onSelect ? () => onSelect(id) : undefined}
              onKeyDown={interactive && onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } } : undefined}
            />
          )
        })}
      </g>
      {showLabels && labels.map(({ id, side, ty }) => {
        const z = zones[id], s = STRUCTURE_BY_ID[id], active = sel.has(id)
        if (wide) {
          const tx = side === 'l' ? -16 : P.w + 16, x2 = side === 'l' ? -10 : P.w + 10
          return (
            <g key={id} aria-hidden className={interactive ? 'cursor-pointer' : ''} onClick={interactive && onSelect ? () => onSelect(id) : undefined}>
              <polyline points={`${x2},${ty - 5} ${z.cx},${z.cy}`} fill="none" stroke={active ? '#3f5446' : '#5d6b78'} strokeWidth="1.6" />
              <circle cx={z.cx} cy={z.cy} r="5" fill={active ? '#536b5a' : '#fff'} stroke="#3f5446" strokeWidth="2" />
              <text x={tx} y={ty} textAnchor={side === 'l' ? 'end' : 'start'} fontSize="27" fontWeight={active ? 700 : 600} fill={active ? '#2f4a38' : '#262c3a'} stroke="#f4f6f9" strokeWidth="6" paintOrder="stroke">{SHORT[id]}</text>
            </g>
          )
        }
        return (
          <g key={id} aria-hidden className={interactive ? 'cursor-pointer' : ''} onClick={interactive && onSelect ? () => onSelect(id) : undefined}>
            <circle cx={z.cx} cy={z.cy} r="15" fill={active ? '#536b5a' : '#fff'} stroke="#536b5a" strokeWidth="2" />
            <text x={z.cx} y={z.cy + 6} textAnchor="middle" fontSize="16" fontWeight="700" fill={active ? '#fff' : '#3f5446'}>{s?.num}</text>
          </g>
        )
      })}
      <text x={wide ? -m + 12 : 10} y={crop.y0 + 22} fontSize="16" fontWeight="600" fill="#5b6272" letterSpacing="1.2">{view === 'palmar' ? 'VISTA PALMAR · RADIO A LA IZQUIERDA' : view === 'dorsal' ? 'VISTA DORSAL · RADIO A LA DERECHA' : 'VISTA DISTAL · PALMAR ARRIBA'}</text>
    </svg>
  )
}
