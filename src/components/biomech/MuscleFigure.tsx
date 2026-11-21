import { MUSCLES } from '../../data/muscles'
import { cn } from '../../lib/utils'
import { BaseBones, BoneDefs } from '../figure/Bones'

/** Geometría (vista palmar). En la vista dorsal se refleja el dibujo completo. */
const GEOM: Record<string, { d: string; o: [number, number]; i: [number, number] }> = {
  fcr: { d: 'M346 44 C332 150 272 300 234 420 C216 480 200 560 190 608', o: [346, 44], i: [190, 608] },
  fcu: { d: 'M354 46 C348 200 338 380 326 516', o: [354, 46], i: [326, 516] },
  pl: { d: 'M340 48 C332 200 272 380 254 538', o: [340, 48], i: [254, 538] },
  ecrl: { d: 'M128 36 C130 170 150 330 172 430 C180 500 184 560 188 610', o: [128, 36], i: [188, 610] },
  ecrb: { d: 'M140 46 C160 180 195 330 212 430 C220 500 224 560 228 610', o: [140, 46], i: [228, 610] },
  ecu: { d: 'M148 48 C212 160 302 300 320 430 C324 500 326 560 326 620', o: [148, 48], i: [326, 620] },
}
export const MUSCLE_W = 470

const FLEX = '#a8587a'
const EXT = '#4f7391'

export default function MuscleFigure({ view, selected, onSelect }: { view: 'palmar' | 'dorsal'; selected: string | null; onSelect: (id: string) => void }) {
  const mirror = view === 'dorsal'
  const mx = (x: number) => (mirror ? MUSCLE_W - x : x)
  const visible = MUSCLES.filter((m) => (view === 'palmar' ? m.grupo === 'flexor' : m.grupo === 'extensor'))
  const sel = selected ? MUSCLES.find((m) => m.id === selected) : null
  return (
    <svg viewBox="0 -4 470 696" role="group" aria-label={`Esquema de los músculos de la muñeca, vista ${view}`} className="block h-auto w-full select-none">
      <BoneDefs />
      <g transform={mirror ? `translate(${MUSCLE_W} 0) scale(-1 1)` : undefined}>
        {/* húmero distal y huesos del antebrazo */}
        <g filter="url(#soft-shadow)" aria-hidden>
          <path d="M104 0 H372 V30 C372 52 340 62 322 62 H154 C136 62 104 52 104 30 Z" fill="url(#g-bone)" stroke="#8a8f7a" strokeWidth="1.6" />
          <path d="M158 70 H222 C222 150 224 200 220 252 H160 C158 200 160 140 158 70 Z" fill="url(#g-bone)" stroke="#8a8f7a" strokeWidth="1.6" />
          <path d="M262 80 H310 C310 150 312 200 310 252 H264 C262 200 264 140 262 80 Z" fill="url(#g-bone)" stroke="#8a8f7a" strokeWidth="1.6" />
          <g transform="translate(60 250) scale(0.62)"><BaseBones /></g>
        </g>
        <circle cx="126" cy="38" r="11" fill="#ebc7d4" stroke="#a8587a" /><circle cx="352" cy="38" r="11" fill="#ebc7d4" stroke="#a8587a" />

        {MUSCLES.map((m) => {
          const g = GEOM[m.id]
          const isSel = selected === m.id
          const inView = visible.includes(m)
          const color = m.grupo === 'flexor' ? FLEX : EXT
          return (
            <g key={m.id} opacity={inView ? (selected && !isSel ? 0.35 : 1) : 0.08} pointerEvents={inView ? 'all' : 'none'}>
              {isSel && <path d={g.d} fill="none" stroke="#7a64a3" strokeOpacity=".3" strokeWidth="20" strokeLinecap="round" />}
              <path d={g.d} fill="none" stroke={color} strokeWidth={isSel ? 9 : 6} strokeLinecap="round" />
              <path
                d={g.d} fill="none" stroke="transparent" strokeWidth="28" strokeLinecap="round" pointerEvents="stroke" className="zone"
                role="button" tabIndex={inView ? 0 : -1} aria-label={m.nombre} aria-pressed={isSel}
                onClick={() => onSelect(m.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(m.id) } }}
              />
              {isSel && (
                <>
                  <circle cx={g.o[0]} cy={g.o[1]} r="9" fill="#fff" stroke={color} strokeWidth="3" />
                  <rect x={g.i[0] - 8} y={g.i[1] - 8} width="16" height="16" rx="3" fill={color} stroke="#fff" strokeWidth="2" />
                </>
              )}
            </g>
          )
        })}
      </g>
      <text x={mx(126)} y="-8" textAnchor="middle" fontSize="12" fill="#5b6272">Epicóndilo lateral</text>
      <text x={mx(352)} y="-8" textAnchor="middle" fontSize="12" fill="#5b6272">Epicóndilo medial</text>
      {sel && (() => {
        const g = GEOM[sel.id]
        return (
          <g fontSize="12" fontWeight="600" fill="#303542">
            <text x={mx(g.o[0]) + (mirror ? -16 : 16)} y={g.o[1] + 36} textAnchor={mirror ? 'end' : 'start'}>● Origen</text>
            <text x={mx(g.i[0]) + (mx(g.i[0]) > 235 ? 16 : -16)} y={g.i[1] + 26} textAnchor={mx(g.i[0]) > 235 ? 'start' : 'end'}>■ Inserción</text>
          </g>
        )
      })()}
      <g className={cn()} fontSize="11" fill="#5b6272" aria-hidden>
        <text x={mirror ? 452 : 18} y="670" textAnchor={mirror ? 'end' : 'start'}>{mirror ? 'Radio a la derecha' : 'Radio a la izquierda'}</text>
      </g>
    </svg>
  )
}
