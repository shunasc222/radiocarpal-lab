import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { MOVEMENTS, MOVEMENT_BY_ID } from '../../data/movements'
import { MUSCLES } from '../../data/muscles'
import { Badge, Button, Card, Field, Toggle } from '../ui/ui'
import { cn } from '../../lib/utils'

/** Ángulos (grados) en cada plano para un movimiento y una fracción s ∈ [0,1] de su recorrido. */
export function anglesFor(id: string, s: number): { sagital: number; frontal: number } {
  const m = MOVEMENT_BY_ID[id]
  switch (id) {
    case 'flexion': return { sagital: m.amplitud * s, frontal: 0 }
    case 'extension': return { sagital: -m.amplitud * s, frontal: 0 }
    case 'desviacion-radial': return { sagital: 0, frontal: m.amplitud * s }
    case 'desviacion-ulnar': return { sagital: 0, frontal: -m.amplitud * s }
    case 'circunduccion': {
      const phi = 2 * Math.PI * s
      const c = Math.cos(phi), sn = Math.sin(phi)
      // F (≈ 70°) → desviación ulnar (≈ 30°) → E (≈ 60°) → desviación radial (≈ 20°)
      return { sagital: c * (c > 0 ? 70 : 60), frontal: -sn * (sn > 0 ? 30 : 20) }
    }
    default: return { sagital: 0, frontal: 0 }
  }
}

const SPEEDS = [0.5, 1, 2]

function HandSagittal({ angle }: { angle: number }) {
  return (
    <svg viewBox="0 0 520 300" role="img" aria-label={`Plano sagital: ${Math.round(angle)} grados`} className="block h-auto w-full">
      <text x="14" y="24" fontSize="13" fontWeight="600" fill="#5b6272" letterSpacing="1">PLANO SAGITAL · VISTA LATERAL</text>
      <g transform="translate(270 160)">
        {/* antebrazo fijo */}
        <path d="M-262 -34 L-8 -34 C4 -34 8 -26 8 -16 L8 16 C8 26 4 34 -8 34 L-262 34 Z" fill="#f4efe3" stroke="#8a8f7a" strokeWidth="2" />
        <path d="M-250 -10 L-14 -10 M-250 12 L-14 12" stroke="#cdc6b4" strokeWidth="6" strokeLinecap="round" />
        <text x="-250" y="62" fontSize="12" fill="#5b6272">Antebrazo (fijo)</text>
        <text x="-250" y="-44" fontSize="11" fill="#7a64a3" fontWeight="600">DORSAL ↑</text>
        <text x="-250" y="82" fontSize="11" fill="#a8587a" fontWeight="600">PALMAR ↓</text>
        {/* mano móvil */}
        <g transform={`rotate(${angle})`} style={{ transition: 'transform 0.05s linear' }}>
          <path d="M6 -28 C60 -32 130 -28 200 -16 C232 -10 232 14 200 18 C130 30 60 32 6 28 Z" fill="#f7e3ea" stroke="#a8587a" strokeWidth="2" />
          <ellipse cx="22" cy="-6" rx="14" ry="12" fill="#f2d6df" stroke="#a8587a" /><ellipse cx="44" cy="-4" rx="14" ry="13" fill="#ddd1ea" stroke="#7a64a3" /><ellipse cx="66" cy="-6" rx="13" ry="12" fill="#cfdeea" stroke="#4f7391" />
          <path d="M84 -6 L170 -6 M84 8 L170 8" stroke="#d9a9bb" strokeWidth="5" strokeLinecap="round" />
          <text x="100" y="42" fontSize="11" fill="#a8587a">Mano</text>
        </g>
        <circle r="5" fill="#536b5a" /><text x="12" y="-40" fontSize="11" fill="#536b5a" fontWeight="600">eje de la muñeca</text>
      </g>
    </svg>
  )
}

function HandFrontal({ angle }: { angle: number }) {
  return (
    <svg viewBox="0 0 520 380" role="img" aria-label={`Plano frontal: ${Math.round(angle)} grados`} className="block h-auto w-full">
      <text x="14" y="24" fontSize="13" fontWeight="600" fill="#5b6272" letterSpacing="1">PLANO FRONTAL · VISTA PALMAR</text>
      <g transform="translate(260 130)">
        <path d="M-50 -110 L50 -110 L50 0 L-50 0 Z" fill="#f4efe3" stroke="#8a8f7a" strokeWidth="2" />
        <path d="M-30 -106 L-30 -4 M28 -106 L28 -4" stroke="#cdc6b4" strokeWidth="9" strokeLinecap="round" />
        <text x="-44" y="-118" fontSize="11" fill="#5b6272">Radio</text><text x="20" y="-118" fontSize="11" fill="#5b6272">Ulna</text>
        <text x="-86" y="-60" fontSize="11" fill="#4f7391" fontWeight="600" textAnchor="end">← RADIAL</text>
        <text x="86" y="-60" fontSize="11" fill="#a77b2a" fontWeight="600">ULNAR →</text>
        <g transform={`rotate(${angle})`} style={{ transition: 'transform 0.05s linear' }}>
          <path d="M-46 4 L46 4 L50 125 L-50 125 Z" fill="#f7e3ea" stroke="#a8587a" strokeWidth="2" strokeLinejoin="round" />
          <ellipse cx="-26" cy="20" rx="20" ry="14" fill="#f2d6df" stroke="#a8587a" /><ellipse cx="0" cy="18" rx="16" ry="13" fill="#ddd1ea" stroke="#7a64a3" /><ellipse cx="26" cy="20" rx="16" ry="13" fill="#cfdeea" stroke="#4f7391" />
          {[-34, -12, 12, 34].map((x) => <rect key={x} x={x - 9} y="125" width="18" height="80" rx="9" fill="#f7e3ea" stroke="#a8587a" strokeWidth="1.6" />)}
          <path d="M-46 30 L-90 96 C-96 110 -80 118 -72 108 L-40 62 Z" fill="#f7e3ea" stroke="#a8587a" strokeWidth="1.6" />
        </g>
        <circle r="5" fill="#536b5a" />
      </g>
    </svg>
  )
}

export default function MovementSim() {
  const reduce = useReducedMotion()
  const [id, setId] = useState('flexion')
  const [s, setS] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const dir = useRef(1)
  const raf = useRef<number | null>(null)
  const last = useRef(0)
  const mov = MOVEMENT_BY_ID[id]
  const circ = id === 'circunduccion'

  const stop = useCallback(() => { setPlaying(false); if (raf.current) cancelAnimationFrame(raf.current); raf.current = null }, [])

  useEffect(() => {
    if (!playing) return
    last.current = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last.current) / 1000)
      last.current = now
      const rate = (circ ? 0.16 : 0.32) * speed
      setS((prev) => {
        if (circ) return (prev + rate * dt) % 1
        let next = prev + dir.current * rate * dt * 1.6
        if (next >= 1) { next = 1; dir.current = -1 } else if (next <= 0) { next = 0; dir.current = 1 }
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [playing, speed, circ])

  const choose = (m: string) => {
    setId(m); setS(0); dir.current = 1
    setPlaying(!reduce)
  }
  const reset = () => { stop(); setS(0); dir.current = 1 }

  const a = useMemo(() => anglesFor(id, s), [id, s])
  const muscles = mov.musculos.map((mid) => MUSCLES.find((m) => m.id === mid)!)
  const primary = circ ? 'Cono elíptico (varios ejes)' : `${Math.round(Math.abs(circ ? 0 : a.sagital || a.frontal))}° de ${mov.amplitud}°`

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Elegir movimiento">
        {MOVEMENTS.map((m) => (
          <Toggle key={m.id} pressed={id === m.id} onClick={() => choose(m.id)}>{m.nombre}</Toggle>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="!p-3 sm:!p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className={cn('rounded-2xl border p-2 transition-colors', a.sagital !== 0 ? 'border-lilac bg-lilac/10' : 'border-line')}><HandSagittal angle={a.sagital} /></div>
            <div className={cn('rounded-2xl border p-2 transition-colors', a.frontal !== 0 ? 'border-steel bg-steel/15' : 'border-line')}><HandFrontal angle={a.frontal} /></div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="primary" size="sm" onClick={() => (playing ? stop() : setPlaying(true))} icon={playing ? <Pause className="size-4" /> : <Play className="size-4" />}>{playing ? 'Pausar' : 'Reproducir'}</Button>
            <Button variant="soft" size="sm" onClick={reset} icon={<RotateCcw className="size-4" />}>Reiniciar</Button>
            <span className="ml-1 inline-flex items-center gap-1 text-xs text-ink-soft" role="group" aria-label="Velocidad">
              Velocidad
              {SPEEDS.map((v) => (
                <button key={v} type="button" aria-pressed={speed === v} onClick={() => setSpeed(v)} className={cn('min-h-9 rounded-full px-3 text-xs font-semibold', speed === v ? 'bg-deep text-white' : 'bg-cream hover:bg-sage/20')}>{v}×</button>
              ))}
            </span>
          </div>
          <label className="mt-3 block text-sm font-medium text-deep-700">
            Recorrido del movimiento: <span data-testid="sim-angle">{circ ? `${Math.round(s * 100)} % del ciclo` : primary}</span>
            <input type="range" min={0} max={100} value={Math.round(s * 100)} onChange={(e) => { stop(); setS(Number(e.target.value) / 100) }} className="mt-1 h-9 w-full accent-[#536b5a]" aria-label="Recorrido del movimiento" />
          </label>
          <p className="mt-1 text-xs text-ink-soft">Esquema didáctico simplificado: los ángulos son orientativos (≈ {mov.rango}) y no sustituyen a una medición goniométrica.</p>
        </Card>

        <Card as="article" className="!p-5" data-testid="movement-card">
          <Badge tone="lilac">{mov.plano === 'ambos' ? 'Ambos planos' : `Plano ${mov.plano}`}</Badge>
          <h3 className="mt-3 text-3xl">{mov.nombre}</h3>
          <p className="mt-2 text-sm text-ink-soft">Rango orientativo: <strong>{mov.rango}</strong></p>
          <dl className="mt-4 space-y-3.5">
            <Field label="Dirección" tone="sage">{mov.direccion}</Field>
            <Field label="Músculos principales" tone="rose">
              <ul className="mt-1 flex flex-wrap gap-1.5">{muscles.map((m) => <li key={m.id}><Badge tone={m.grupo === 'flexor' ? 'rose' : 'steel'}>{m.nombre}</Badge></li>)}</ul>
            </Field>
            <Field label="Articulaciones" tone="lilac">{mov.articulaciones}</Field>
            <Field label="Elementos limitantes" tone="steel">{mov.limites}</Field>
            <Field label="Relación con la prensión" tone="sage">{mov.prension}</Field>
          </dl>
          <p className="mt-4 rounded-xl bg-cream p-3 text-[14px] leading-relaxed">{mov.explicacion}</p>
        </Card>
      </div>
    </div>
  )
}
