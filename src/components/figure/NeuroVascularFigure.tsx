import { PATHS } from '../../data/anatomy3d.generated'
import { PLATES } from '../../data/plates.generated'
import { NV_ITEMS } from '../../data/neurovascular'
import { f1, linePath } from './plateGeo'

export const ART = '#c0405f'
export const NERVE = '#c99a12'
const BASE = import.meta.env.BASE_URL
const P = PLATES.palmar

/** Arcos y esquemas sin recorrido 3D (redes carpianas, ramos articulares). */
const EXTRA: Record<string, { pts: number[][]; dashed: boolean }> = {
  'rete-palmar': { pts: [[-2.7, -0.4, 0], [-1.6, -0.15, 0], [-0.4, -0.25, 0], [0.8, -0.5, 0], [1.3, -0.9, 0]], dashed: false },
  'rete-dorsal': { pts: [[-2.8, -0.7, 0], [-1.6, -0.55, 0], [-0.4, -0.6, 0], [0.8, -0.85, 0], [1.4, -1.2, 0]], dashed: true },
  'n-articulares': { pts: [[-2.2, 0.15, 0], [-1.0, 0.3, 0], [0.2, 0.2, 0]], dashed: true },
}
const DORSAL = new Set(['a-interosea-post', 'n-interoseo-post', 'n-radial-sup', 'rete-dorsal'])
const BADGE_AT: Record<string, number> = { 'a-radial': 0.18, 'a-ulnar': 0.2, 'n-mediano': 0.28, 'n-ulnar': 0.3, 'n-radial-sup': 0.35, 'a-interosea-ant': 0.45, 'a-interosea-post': 0.55, 'n-interoseo-ant': 0.5, 'n-interoseo-post': 0.6, 'rete-palmar': 0.4, 'rete-dorsal': 0.62, 'n-articulares': 0.5 }

export default function NeuroVascularFigure({ selected, onSelect, hidden }: { selected: string | null; onSelect: (id: string) => void; hidden: { arteria: boolean; nervio: boolean } }) {
  const y0 = (P.a1 - 10.2) * P.S, y1 = (P.a1 + 4.2) * P.S
  return (
    <svg viewBox={`40 ${y0} ${P.w - 80} ${y1 - y0}`} role="group" aria-label="Arterias y nervios del antebrazo distal y la muñeca sobre los huesos reales, vista palmar" className="block h-auto w-full select-none">
      <image href={`${BASE}atlas/palmar.webp`} x="0" y="0" width={P.w} height={P.h} opacity=".5" />
      {NV_ITEMS.map((it) => {
        if (hidden[it.kind]) return null
        const src = PATHS[it.id] ? { pts: PATHS[it.id].pts, dashed: DORSAL.has(it.id) || !!it.dashed, r: PATHS[it.id].r } : { ...EXTRA[it.id], r: 0.06 }
        if (!src.pts) return null
        const d = linePath('palmar', src.pts), isSel = selected === it.id, color = it.kind === 'arteria' ? ART : NERVE
        const w = Math.max(5, src.r * P.S * 1.7) * (isSel ? 1.4 : 1)
        const at = src.pts[Math.min(src.pts.length - 1, Math.round((src.pts.length - 1) * (BADGE_AT[it.id] ?? 0.4)))]
        const [bx, by] = (() => { const p = linePath('palmar', [at]).slice(1).split(' ').map(Number); return [p[0], p[1]] })()
        return (
          <g key={it.id} opacity={selected && !isSel ? 0.4 : 1}>
            {isSel && <path d={d} fill="none" stroke={color} strokeOpacity=".28" strokeWidth={w + 14} strokeLinecap="round" strokeLinejoin="round" />}
            <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={src.dashed ? `${w * 1.8} ${w * 1.4}` : undefined} />
            <path d={d} fill="none" stroke="transparent" strokeWidth="34" strokeLinecap="round" pointerEvents="stroke" className="zone" role="button" tabIndex={0} aria-label={it.nombre} aria-pressed={isSel}
              onClick={() => onSelect(it.id)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(it.id) } }} />
            <g aria-hidden className="cursor-pointer" onClick={() => onSelect(it.id)}>
              <circle cx={f1(bx)} cy={f1(by)} r="13" fill={color} stroke="#fff" strokeWidth="2" />
              <text x={f1(bx)} y={f1(by) + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#fff">{it.num}</text>
            </g>
          </g>
        )
      })}
      <text x="52" y={y0 + 22} fontSize="14" fontWeight="600" fill="#5b6272" letterSpacing="1">VISTA PALMAR · PUNTEADO = DORSAL O PROFUNDO</text>
    </svg>
  )
}
