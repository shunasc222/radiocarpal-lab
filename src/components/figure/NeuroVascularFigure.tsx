import { NV_ITEMS } from '../../data/neurovascular'
import { BONE_PATHS } from '../../data/wristGeometry'

export const ART = '#c0405f'
export const NERVE = '#7a64a3'

const BADGE: Record<string, [number, number]> = {
  'a-radial': [175, 170], 'a-ulnar': [354, 120], 'a-interosea-ant': [268, 200], 'a-interosea-post': [301, 150],
  'rete-palmar': [190, 345], 'rete-dorsal': [312, 377], 'n-mediano': [262, 40], 'n-interoseo-ant': [244, 120],
  'n-radial-sup': [149, 100], 'n-interoseo-post': [214, 90], 'n-ulnar': [346, 60], 'n-articulares': [268, 358],
}

export default function NeuroVascularFigure({ selected, onSelect, hidden }: { selected: string | null; onSelect: (id: string) => void; hidden: { arteria: boolean; nervio: boolean } }) {
  return (
    <svg viewBox="0 0 520 600" role="group" aria-label="Esquema de arterias y nervios del antebrazo distal y la mano, vista palmar" className="block h-auto w-full select-none">
      <defs>
        <linearGradient id="skin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f7ebe4" /><stop offset="1" stopColor="#f3dfd8" /></linearGradient>
      </defs>
      {/* contorno de partes blandas */}
      <path d="M118 0 H402 V330 C402 360 432 380 434 430 L434 520 C434 575 410 596 380 596 H140 C110 596 88 575 88 520 L84 420 C84 390 118 370 118 330 Z" fill="url(#skin)" stroke="#e5c9bf" strokeWidth="2" />
      {/* huesos en transparencia (carpo) */}
      <g opacity=".7" aria-hidden>
        <path d="M165 0 L255 0 C258 100 270 180 306 244 L308 322 C290 330 262 338 232 346 C196 356 160 366 126 384 C118 360 124 310 136 250 C150 150 160 60 165 0 Z" transform="translate(0 0)" fill="#efe8da" stroke="#cdc6b4" />
        <path d="M330 0 L400 0 C402 100 412 176 424 230 C432 262 428 292 414 312 L416 340 L396 326 C374 318 336 312 322 296 C310 282 314 250 322 232 C330 150 330 60 330 0 Z" fill="#efe8da" stroke="#cdc6b4" />
        {['escafoides', 'semilunar', 'piramidal', 'pisiforme', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso'].map((id) => <path key={id} d={BONE_PATHS[id]} fill={id === 'escafoides' ? '#f2d6df' : '#efe8da'} stroke="#cdc6b4" />)}
      </g>
      {/* retináculo flexor (referencia) */}
      <path d="M160 392 L410 392" stroke="#b8b3a3" strokeWidth="8" strokeOpacity=".35" strokeLinecap="round" aria-hidden />
      <text x="418" y="398" fontSize="11" fill="#8a8f7a" aria-hidden>retináculo flexor</text>

      {NV_ITEMS.map((it) => {
        if (hidden[it.kind]) return null
        const isSel = selected === it.id
        const color = it.kind === 'arteria' ? ART : NERVE
        return (
          <g key={it.id} opacity={selected && !isSel ? 0.35 : 1}>
            {it.paths.map((d, i) => (
              <g key={i}>
                {isSel && <path d={d} fill="none" stroke={color} strokeOpacity=".25" strokeWidth="16" strokeLinecap="round" />}
                <path d={d} fill="none" stroke={color} strokeWidth={isSel ? (it.kind === 'arteria' ? 6 : 5) : it.kind === 'arteria' ? 4 : 3} strokeLinecap="round" strokeDasharray={it.dashed ? '8 6' : undefined} />
                <path d={d} fill="none" stroke="transparent" strokeWidth="26" strokeLinecap="round" pointerEvents="stroke" className="zone"
                  role="button" tabIndex={i === 0 ? 0 : -1} aria-label={it.nombre} aria-pressed={isSel}
                  onClick={() => onSelect(it.id)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(it.id) } }} />
              </g>
            ))}
            <g aria-hidden onClick={() => onSelect(it.id)} className="cursor-pointer">
              <circle cx={BADGE[it.id][0]} cy={BADGE[it.id][1]} r="10" fill={color} stroke="#fff" strokeWidth="1.5" />
              <text x={BADGE[it.id][0]} y={BADGE[it.id][1] + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff">{it.num}</text>
            </g>
          </g>
        )
      })}
      <text x="22" y="24" fontSize="11" fill="#5b6272" fontWeight="600" letterSpacing="1.5">VISTA PALMAR · RADIO A LA IZQUIERDA</text>
    </svg>
  )
}
