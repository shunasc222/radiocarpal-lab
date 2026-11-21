import { useMemo } from 'react'
import { ATLAS_ZONES, LABELS, ZONE_ORDER } from '../../data/wristGeometry'
import { STRUCTURE_BY_ID } from '../../data/structures'
import { cn } from '../../lib/utils'
import { BaseBones, BoneDefs } from './Bones'

export const SHORT: Record<string, string> = {
  'radio-distal': 'Radio distal', 'estiloides-radio': 'Estiloides radial', 'fosita-escafoidea': 'Fosita escafoidea',
  'cresta-interfacetaria': 'Cresta interfacetaria', 'fosita-semilunar': 'Fosita semilunar', 'escotadura-ulnar': 'Escotadura ulnar',
  escafoides: 'Escafoides', semilunar: 'Semilunar', 'ulna-distal': 'Ulna distal', 'estiloides-ulnar': 'Estiloides ulnar',
  disco: 'Disco articular', piramidal: 'Piramidal', pisiforme: 'Pisiforme',
}

const CAPS = {
  escafoides: 'M112 446 C112 420 150 390 190 368 C208 358 226 354 240 358 C258 362 266 380 262 396',
  semilunar: 'M270 374 C282 358 318 356 340 366 C352 374 354 392 350 408',
  piramidal: 'M358 374 C374 360 410 354 432 366 C440 372 444 384 444 394',
}

export interface AtlasFigureProps {
  selected: string | null
  onSelect?: (id: string) => void
  showLabels: boolean
  highlightSurfaces: boolean
  /** Estructura que se pide identificar (modo autoevaluación): se resalta sin rótulo. */
  target?: string | null
  /** Solo estas etiquetas (portada). */
  onlyLabels?: string[]
  wide: boolean
  viewBox?: string
  interactive?: boolean
  className?: string
}

function expand(id: string | null): Set<string> {
  const out = new Set<string>()
  if (!id) return out
  out.add(id)
  STRUCTURE_BY_ID[id]?.hijos?.forEach((h) => out.add(h))
  return out
}

export default function AtlasFigure({ selected, onSelect, showLabels, highlightSurfaces, target, onlyLabels, wide, viewBox: vb, interactive = true, className }: AtlasFigureProps) {
  const sel = useMemo(() => expand(selected), [selected])
  const viewBox = vb ?? (wide ? '-170 -14 790 720' : '40 -14 430 720')
  const labelIds = Object.keys(LABELS).filter((id) => (onlyLabels ? onlyLabels.includes(id) : true))

  return (
    <svg viewBox={viewBox} role="group" aria-label="Esquema anatómico de la articulación radiocarpiana, vista palmar" className={cn('block h-auto w-full select-none', className)} preserveAspectRatio="xMidYMid meet">
      <BoneDefs />
      <BaseBones />

      {/* superficies articulares */}
      {highlightSurfaces && (
        <g aria-hidden>
          <path d={ATLAS_ZONES['fosita-escafoidea']} fill="#a8587a" opacity=".55" />
          <path d={ATLAS_ZONES['fosita-semilunar']} fill="#a8587a" opacity=".55" />
          <path d={ATLAS_ZONES.disco} fill="#a8587a" opacity=".45" />
          {Object.values(CAPS).map((d, i) => <path key={i} d={d} fill="none" stroke="#4f7391" strokeWidth="6" strokeLinecap="round" opacity=".85" />)}
        </g>
      )}

      {/* zona de la interfaz cartilaginosa sin contacto ulna-carpo */}
      {highlightSurfaces && (
        <g aria-hidden>
          <path d="M340 322 L340 356" stroke="#a8587a" strokeWidth="1.6" strokeDasharray="3 3" />
          <text x="344" y="352" fontSize="11" fill="#a8587a" className={wide ? '' : 'hidden'}>sin contacto ulna–carpo</text>
        </g>
      )}

      {/* capa interactiva */}
      <g>
        {ZONE_ORDER.map((id) => {
          const d = ATLAS_ZONES[id]
          const isSel = sel.has(id)
          const isTarget = target === id
          const name = STRUCTURE_BY_ID[id]?.nombre ?? id
          return (
            <path
              key={id} d={d}
              className={cn('zone', isTarget && 'pulse')}
              role={interactive ? 'button' : undefined} tabIndex={interactive ? 0 : -1}
              aria-label={interactive ? (target ? 'Zona anatómica' : name) : undefined} aria-pressed={interactive ? isSel : undefined}
              fill={isSel ? '#7a64a3' : isTarget ? '#7a64a3' : '#ffffff'}
              fillOpacity={isSel ? 0.38 : isTarget ? 0.5 : 0}
              stroke={isSel ? '#536b5a' : isTarget ? '#7a64a3' : 'transparent'} strokeWidth={isSel || isTarget ? 3 : 0}
              pointerEvents={interactive ? 'all' : 'none'}
              onClick={interactive && onSelect ? () => onSelect(id) : undefined}
              onKeyDown={interactive && onSelect ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(id) } } : undefined}
            />
          )
        })}
      </g>

      {/* etiquetas (vista ancha) o números (vista estrecha) */}
      {showLabels && labelIds.map((id) => {
        const l = LABELS[id]
        const s = STRUCTURE_BY_ID[id]
        const active = sel.has(id)
        if (wide) {
          const x2 = l.side === 'l' ? l.tx + 6 : l.tx - 6
          return (
            <g key={id} aria-hidden className={interactive ? 'cursor-pointer' : ''} onClick={interactive && onSelect ? () => onSelect(id) : undefined}>
              <polyline points={`${x2},${l.ty - 5} ${l.ax},${l.ay}`} fill="none" stroke={active ? '#536b5a' : '#a9b89a'} strokeWidth="1.4" />
              <circle cx={l.ax} cy={l.ay} r="3.5" fill={active ? '#536b5a' : '#fff'} stroke="#536b5a" strokeWidth="1.4" />
              <text x={l.tx} y={l.ty} textAnchor={l.side === 'l' ? 'end' : 'start'} fontSize="15" fontWeight={active ? 700 : 500} fill={active ? '#3f5446' : '#303542'}>{SHORT[id]}</text>
            </g>
          )
        }
        return (
          <g key={id} aria-hidden className={interactive ? 'cursor-pointer' : ''} onClick={interactive && onSelect ? () => onSelect(id) : undefined}>
            <circle cx={l.ax} cy={l.ay} r="11" fill={active ? '#536b5a' : '#fff'} stroke="#536b5a" strokeWidth="1.6" />
            <text x={l.ax} y={l.ay + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={active ? '#fff' : '#3f5446'}>{s.num}</text>
          </g>
        )
      })}
    </svg>
  )
}
