import { PATHS } from '../../data/anatomy3d.generated'
import { LM } from '../../data/landmarks3d'
import { PLATES } from '../../data/plates.generated'
import { MUSCLES } from '../../data/muscles'
import { f1, linePath, proj, type PlateKey } from '../figure/plateGeo'
import { cn } from '../../lib/utils'

const BASE = import.meta.env.BASE_URL
const FLEX = '#a8587a', EXT = '#4f7391'

/** Último punto (más distal) del trazado de una zona: sirve de marcador de inserción. */
function lowest(d: string): [number, number] {
  let best: [number, number] = [0, 0]
  for (const m of d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)) { const y = Number(m[2]); if (y > best[1]) best = [Number(m[1]), y] }
  return best
}

export default function MuscleFigure({ view, selected, onSelect }: { view: 'palmar' | 'dorsal'; selected: string | null; onSelect: (id: string) => void }) {
  const key = (view === 'palmar' ? 'palmar-muscles' : 'dorsal-muscles') as PlateKey, P = PLATES[key]
  const visible = MUSCLES.filter((m) => (view === 'palmar' ? m.grupo === 'flexor' : m.grupo === 'extensor'))
  const y1 = (P.a1 + 4.2) * P.S
  const ins = (id: string): [number, number] | null => {
    if (id === 'fcr') return proj(key, LM.mc2.baseVolar[0], LM.mc2.baseVolar[1], LM.mc2.baseVolar[2])
    if (id === 'ecrl') return proj(key, LM.mc2.baseDorsal[0], LM.mc2.baseDorsal[1], LM.mc2.baseDorsal[2])
    if (id === 'ecrb') return proj(key, LM.mc3.baseDorsal[0], LM.mc3.baseDorsal[1], LM.mc3.baseDorsal[2])
    if (id === 'ecu') return proj(key, LM.mc5.baseDorsal[0], LM.mc5.baseDorsal[1], LM.mc5.baseDorsal[2])
    if (id === 'fcu') { const p = PATHS.fcu.pts[PATHS.fcu.pts.length - 1]; return proj(key, p[0], p[1], p[2]) }
    if (id === 'pl') return P.zones.pl ? lowest(P.zones.pl.d) : null
    return null
  }
  return (
    <svg viewBox={`0 0 ${P.w} ${y1}`} role="group" aria-label={`Músculos de la muñeca sobre los huesos reales, vista ${view}`} className="block h-auto w-full select-none">
      <image href={`${BASE}atlas/${key}.webp`} x="0" y="0" width={P.w} height={P.h} />
      {view === 'palmar' && (() => {
        const sel = selected === 'fcu'
        return (
          <g opacity={selected && !sel ? 0.4 : 1}>
            {sel && <path d={linePath(key, PATHS.fcu.pts)} fill="none" stroke="#7a64a3" strokeOpacity=".3" strokeWidth="26" strokeLinecap="round" />}
            <path d={linePath(key, PATHS.fcu.pts)} fill="none" stroke="#e6d6b4" strokeWidth="11" strokeLinecap="round" strokeDasharray="14 8" />
            <path d={linePath(key, PATHS.fcu.pts)} fill="none" stroke="transparent" strokeWidth="34" strokeLinecap="round" pointerEvents="stroke" className="zone" role="button" tabIndex={0} aria-label="Flexor ulnar del carpo" aria-pressed={sel}
              onClick={() => onSelect('fcu')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect('fcu') } }} />
          </g>
        )
      })()}
      {visible.map((m) => {
        const z = P.zones[m.id]; if (!z) return null
        const isSel = selected === m.id, col = m.grupo === 'flexor' ? FLEX : EXT
        const p = isSel ? ins(m.id) : null
        return (
          <g key={m.id}>
            <path d={z.d} fillRule="evenodd" className="zone" role="button" tabIndex={0} aria-label={m.nombre} aria-pressed={isSel}
              fill={isSel ? '#7a64a3' : '#fff'} fillOpacity={isSel ? 0.3 : 0} stroke={isSel ? col : 'transparent'} strokeWidth={isSel ? 3.5 : 0} strokeLinejoin="round"
              onClick={() => onSelect(m.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(m.id) } }} />
            {p && <g aria-hidden><rect x={f1(p[0]) - 9} y={f1(p[1]) - 9} width="18" height="18" rx="3" fill={col} stroke="#fff" strokeWidth="2.5" /><text x={f1(p[0]) + 16} y={f1(p[1]) + 5} fontSize="15" fontWeight="700" fill="#303542" stroke="#faf7f2" strokeWidth="4" paintOrder="stroke">inserción</text></g>}
          </g>
        )
      })}
      {selected === 'fcu' && (() => { const p = ins('fcu'); return p && <g aria-hidden><rect x={f1(p[0]) - 9} y={f1(p[1]) - 9} width="18" height="18" rx="3" fill={FLEX} stroke="#fff" strokeWidth="2.5" /><text x={f1(p[0]) + 16} y={f1(p[1]) + 5} fontSize="15" fontWeight="700" fill="#303542" stroke="#faf7f2" strokeWidth="4" paintOrder="stroke">inserción (pisiforme)</text></g> })()}
      <text x={view === 'palmar' ? 12 : P.w - 12} y="24" textAnchor={view === 'palmar' ? 'start' : 'end'} fontSize="15" fontWeight="600" fill="#5b6272" letterSpacing="1.2">{view === 'palmar' ? 'VISTA PALMAR · RADIO A LA IZQUIERDA' : 'VISTA DORSAL · RADIO A LA DERECHA'}</text>
      <text x={view === 'palmar' ? 12 : P.w - 12} y="46" textAnchor={view === 'palmar' ? 'start' : 'end'} fontSize="13" fill="#5b6272">↑ el origen está en el epicóndilo (fuera de la imagen)</text>
      <g className={cn()} />
    </svg>
  )
}
