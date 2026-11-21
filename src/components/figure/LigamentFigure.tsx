import { LIGAMENTS, type LigCategory, type LigView } from '../../data/ligaments'
import { cn } from '../../lib/utils'
import { BaseBones, BoneDefs } from './Bones'
import { FIG_W } from '../../data/wristGeometry'

export const CAT_COLOR: Record<LigCategory, string> = {
  radiocarpiano: '#a8587a', ulnocarpiano: '#7a64a3', colateral: '#4f7391', intercarpiano: '#3f5446', radioulnar: '#a77b2a', capsula: '#7f8f72',
}

export interface LigamentFigureProps {
  view: LigView
  selected: string | null
  onSelect?: (id: string) => void
  cat: LigCategory | 'todos'
  failure?: boolean
  /** Solo muestra estos ligamentos (comparación de la falla). */
  only?: string[]
  viewBox?: string
  interactive?: boolean
  className?: string
}

const FAIL_TRANSFORM: Record<string, string> = {
  escafoides: 'translate(-14 8) rotate(-16 180 420)',
  semilunar: 'translate(8 -2) rotate(18 310 400)',
}

export default function LigamentFigure({ view, selected, onSelect, cat, failure = false, only, viewBox = '0 -14 470 716', interactive = true, className }: LigamentFigureProps) {
  const mirror = view === 'dorsal'
  const items = LIGAMENTS.filter((l) => l.views.includes(view) && (cat === 'todos' || l.categoria === cat) && (!only || only.includes(l.id)))
  const radiusX = mirror ? FIG_W - 205 : 205
  const ulnaX = mirror ? FIG_W - 372 : 372
  return (
    <svg viewBox={viewBox} role="group" aria-label={`Ligamentos de la muñeca, vista ${view}`} className={cn('block h-auto w-full select-none', className)}>
      <BoneDefs />
      <g transform={mirror ? `translate(${FIG_W} 0) scale(-1 1)` : undefined}>
        <BaseBones
          opacityOf={(id) => (mirror && id === 'pisiforme' ? 0.15 : 1)}
          transformOf={failure ? (id) => FAIL_TRANSFORM[id] : undefined}
        />
        {items.map((l) => {
          const isSel = selected === l.id
          const color = CAT_COLOR[l.categoria]
          const closed = l.paths[0].trim().endsWith('Z')
          const isFailed = failure && l.id === 'escafolunar'
          return (
            <g key={l.id}>
              {l.paths.map((d, i) => (
                <g key={i}>
                  {isSel && <path d={d} fill="none" stroke="#7a64a3" strokeOpacity=".3" strokeWidth={l.width + 12} strokeLinecap="round" />}
                  <path
                    d={d} fill={closed ? color : 'none'} fillOpacity={closed ? (isSel ? 0.7 : 0.45) : 0}
                    stroke={isFailed ? '#c0392b' : color} strokeWidth={isSel ? l.width + 3 : l.width} strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray={isFailed ? '2 7' : l.dashed ? '9 7' : undefined} opacity={isSel ? 1 : selected ? 0.5 : 0.85}
                    style={{ transition: 'opacity .2s, stroke-width .2s' }}
                  />
                  {interactive && (
                    <path
                      d={d} fill={closed ? 'transparent' : 'none'} stroke="transparent" strokeWidth={Math.max(l.width + 18, 26)} strokeLinecap="round" pointerEvents={closed ? 'all' : 'stroke'}
                      className="zone" role="button" tabIndex={i === 0 ? 0 : -1} aria-label={l.nombre} aria-pressed={isSel}
                      onClick={() => onSelect?.(l.id)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(l.id) } }}
                    />
                  )}
                </g>
              ))}
            </g>
          )
        })}
      </g>
      <text x={radiusX} y="22" textAnchor="middle" fontSize="13" fontWeight="600" fill="#5b6272" letterSpacing="2">RADIO</text>
      <text x={ulnaX} y="22" textAnchor="middle" fontSize="13" fontWeight="600" fill="#5b6272" letterSpacing="2">ULNA</text>
    </svg>
  )
}
