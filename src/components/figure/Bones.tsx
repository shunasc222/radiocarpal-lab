import { BONE_PATHS } from '../../data/wristGeometry'

export const BONE_STYLE: Record<string, { fill: string; stroke: string }> = {
  radio: { fill: 'url(#g-bone)', stroke: '#8a8f7a' },
  ulna: { fill: 'url(#g-bone)', stroke: '#8a8f7a' },
  disco: { fill: '#c9d6e3', stroke: '#6b86a0' },
  escafoides: { fill: '#f2d6df', stroke: '#a8587a' },
  semilunar: { fill: '#ddd1ea', stroke: '#7a64a3' },
  piramidal: { fill: '#cfdeea', stroke: '#4f7391' },
  pisiforme: { fill: '#efe6d0', stroke: '#9a8a5c' },
  trapecio: { fill: '#ece8de', stroke: '#b8b3a3' },
  trapezoide: { fill: '#ece8de', stroke: '#b8b3a3' },
  hueso_grande: { fill: '#ece8de', stroke: '#b8b3a3' },
  ganchoso: { fill: '#ece8de', stroke: '#b8b3a3' },
}

export function BoneDefs() {
  return (
    <defs>
      <linearGradient id="g-bone" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#f4efe3" />
        <stop offset="1" stopColor="#e3dccb" />
      </linearGradient>
      <linearGradient id="g-fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ece8de" stopOpacity="0.9" />
        <stop offset="1" stopColor="#ece8de" stopOpacity="0" />
      </linearGradient>
      <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="130%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#536b5a" floodOpacity="0.18" />
      </filter>
    </defs>
  )
}

/** Dibuja los huesos del esquema. `skip` omite ids; `opacity` y `transform` permiten animar casos concretos. */
export function BaseBones({ skip = [], opacityOf, transformOf }: { skip?: string[]; opacityOf?: (id: string) => number; transformOf?: (id: string) => string | undefined }) {
  const order = ['radio', 'ulna', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso', 'escafoides', 'semilunar', 'piramidal', 'disco', 'pisiforme']
  return (
    <g filter="url(#soft-shadow)" aria-hidden>
      {/* bases de metacarpianos (contexto) */}
      <g opacity="0.9">
        {[[72, 590, 70], [168, 580, 58], [236, 574, 64], [332, 574, 64], [404, 580, 44]].map(([x, y, w], i) => (
          <rect key={i} x={x} y={y} width={w} height={90} rx={14} fill="url(#g-fade)" stroke="#d6d0c0" strokeWidth={1} />
        ))}
      </g>
      {order.filter((id) => !skip.includes(id)).map((id) => (
        <path key={id} d={BONE_PATHS[id]} fill={BONE_STYLE[id].fill} stroke={BONE_STYLE[id].stroke} strokeWidth={1.6} strokeLinejoin="round" opacity={opacityOf ? opacityOf(id) : 1} transform={transformOf?.(id)} style={{ transition: 'opacity .25s, transform .45s' }} />
      ))}
    </g>
  )
}
