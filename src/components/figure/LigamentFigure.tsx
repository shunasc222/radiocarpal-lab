import { PLATES } from '../../data/plates.generated'
import { DIRECT, RIBBONS } from '../../data/anatomy3d.generated'
import { LIGAMENTS, type LigCategory, type LigView } from '../../data/ligaments'
import { cn } from '../../lib/utils'
import { discPath, linePath, polyPath, ribbonPath, type PlateKey } from './plateGeo'

export const CAT_COLOR: Record<LigCategory, string> = {
  radiocarpiano: '#a8587a', ulnocarpiano: '#7a64a3', colateral: '#4f7391', intercarpiano: '#3f5446', radioulnar: '#a77b2a', capsula: '#7f8f72',
}
const BASE = import.meta.env.BASE_URL

export interface LigamentFigureProps {
  view: LigView
  selected: string | null
  onSelect?: (id: string) => void
  cat: LigCategory | 'todos'
  failure?: boolean
  only?: string[]
  /** Recorte (cm) de la lámina: [yMax, yMin]. */
  crop?: [number, number]
  interactive?: boolean
  className?: string
}

const CAPSULE: number[][] = [[-3.7, -0.9, 0], [-3.3, 0.45, 0], [-1.5, 0.55, 0], [0.9, 0.55, 0], [1.9, 0.3, 0], [2.0, -1.5, 0], [1.2, -2.0, 0], [-0.9, -2.0, 0], [-2.8, -2.1, 0], [-3.6, -1.7, 0]]
const DIRECT_OF: Record<string, string[]> = { escafolunar: ['escafolunar'], lunopiramidal: ['lunopiramidal'], radioulnares: ['radioulnar-palmar', 'radioulnar-dorsal'] }

export default function LigamentFigure({ view, selected, onSelect, cat, failure = false, only, crop = [4.2, -3.6], interactive = true, className }: LigamentFigureProps) {
  const key = view as PlateKey, P = PLATES[view]
  const y0 = (P.a1 - crop[0]) * P.S, y1 = (P.a1 - crop[1]) * P.S
  const items = LIGAMENTS.filter((l) => l.views.includes(view) && (cat === 'todos' || l.categoria === cat) && (!only || only.includes(l.id)))

  const shapes = (id: string): { d: string; kind: 'fill' | 'line'; w: number; dashed?: boolean }[] => {
    if (RIBBONS[id]) return RIBBONS[id].map((st) => ({ d: ribbonPath(key, st), kind: 'fill', w: 1.5 }))
    if (DIRECT_OF[id]) return DIRECT_OF[id].map((k) => ({ d: linePath(key, DIRECT[k].pts), kind: 'line', w: DIRECT[k].r * P.S * 2.2, dashed: id !== 'radioulnares' }))
    if (id === 'tfcc') return [{ d: discPath(key), kind: 'fill', w: 1.5 }]
    if (id === 'capsula') return [{ d: polyPath(key, CAPSULE), kind: 'line', w: 3, dashed: true }]
    if (id === 'sinovial') return [{ d: linePath(key, CAPSULE.slice(1, 8).map((p) => [p[0] * 0.92, p[1] * 0.9 - 0.1, 0])), kind: 'line', w: 2.5, dashed: true }]
    return []
  }

  return (
    <svg viewBox={`0 ${y0} ${P.w} ${y1 - y0}`} role="group" aria-label={`Ligamentos de la muñeca, vista ${view}`} className={cn('block h-auto w-full select-none', className)}>
      <image href={`${BASE}atlas/${view}.webp`} x="0" y="0" width={P.w} height={P.h} />
      {items.map((l) => {
        const isSel = selected === l.id, color = CAT_COLOR[l.categoria], failed = failure && l.id === 'escafolunar'
        return (
          <g key={l.id} opacity={isSel ? 1 : selected ? 0.45 : 0.92} style={{ transition: 'opacity .2s' }}>
            {shapes(l.id).map((sh, i) => (
              <g key={i}>
                {isSel && <path d={sh.d} fill={sh.kind === 'fill' ? '#7a64a3' : 'none'} fillOpacity=".35" stroke="#7a64a3" strokeOpacity=".35" strokeWidth={(sh.kind === 'line' ? sh.w : 3) + 12} strokeLinecap="round" strokeLinejoin="round" />}
                <path d={sh.d} fill={sh.kind === 'fill' ? (failed ? '#c0392b' : color) : 'none'} fillOpacity={sh.kind === 'fill' ? 0.78 : 0}
                  stroke={failed ? '#c0392b' : color} strokeWidth={sh.kind === 'line' ? sh.w : 1.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={failed ? '3 8' : sh.dashed ? '10 7' : undefined} />
                {interactive && (
                  <path d={sh.d} fill={sh.kind === 'fill' ? 'transparent' : 'none'} stroke="transparent" strokeWidth={Math.max(sh.w + 18, 30)} strokeLinecap="round" strokeLinejoin="round" pointerEvents={sh.kind === 'fill' ? 'all' : 'stroke'}
                    className="zone" role="button" tabIndex={i === 0 ? 0 : -1} aria-label={l.nombre} aria-pressed={isSel}
                    onClick={() => onSelect?.(l.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(l.id) } }} />
                )}
              </g>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
