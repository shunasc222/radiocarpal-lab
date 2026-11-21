import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Activity, ChevronDown, Dumbbell } from 'lucide-react'
import { Badge, Card, Field, SectionHeader, Tabs, Toggle } from '../components/ui/ui'
import { FigurePanel } from '../components/ui/FigurePanel'
import MuscleFigure from '../components/biomech/MuscleFigure'
import MovementSim from '../components/biomech/MovementSim'
import { AUXILIARES, MUSCLES } from '../data/muscles'
import { MOVEMENT_BY_ID, WRIST_JOINT_NOTES } from '../data/movements'
import { cn } from '../lib/utils'

type Tab = 'musculos' | 'movimientos'

export default function Myology() {
  const [tab, setTab] = useState<Tab>('musculos')
  const [view, setView] = useState<'palmar' | 'dorsal'>('palmar')
  const [sel, setSel] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const muscle = sel ? MUSCLES.find((m) => m.id === sel)! : null

  const pick = (id: string) => {
    setSel(id)
    const m = MUSCLES.find((x) => x.id === id)!
    setView(m.grupo === 'flexor' ? 'palmar' : 'dorsal')
  }

  return (
    <div>
      <SectionHeader n={5} eyebrow="Miología y biomecánica" title="Músculos y movimientos de la muñeca"
        lead="Seis músculos son los motores principales de la muñeca. Explora su origen, inserción, inervación y acción, y reproduce cada movimiento en el simulador." />
      <div className="mb-6">
        <Tabs<Tab> label="Vistas" value={tab} onChange={setTab} items={[
          { id: 'musculos', label: 'Músculos', icon: <Dumbbell className="size-4" /> },
          { id: 'movimientos', label: 'Movimientos', icon: <Activity className="size-4" /> },
        ]} />
      </div>

      {tab === 'musculos' ? (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Toggle pressed={view === 'palmar'} onClick={() => setView('palmar')} tone="rose">Cara palmar: flexores</Toggle>
            <Toggle pressed={view === 'dorsal'} onClick={() => setView('dorsal')} tone="steel">Cara dorsal: extensores</Toggle>
          </div>
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="min-w-0 space-y-4">
              <FigurePanel caption="Huesos y músculos reales (BodyParts3D, CC BY 4.0) · el tendón del flexor ulnar es esquemático"><div className="mx-auto max-w-sm"><MuscleFigure view={view} selected={sel} onSelect={pick} /></div></FigurePanel>
              <div className="grid gap-4 sm:grid-cols-2">
                {(['flexor', 'extensor'] as const).map((g) => (
                  <div key={g}>
                    <h2 className="mb-2 text-2xl">{g === 'flexor' ? 'Flexores' : 'Extensores'}</h2>
                    <ul className="space-y-2">
                      {MUSCLES.filter((m) => m.grupo === g).map((m) => (
                        <li key={m.id}>
                          <button type="button" aria-pressed={sel === m.id} onClick={() => pick(m.id)}
                            className={cn('flex min-h-12 w-full items-center justify-between rounded-2xl border px-4 text-left text-[15px] transition-colors', sel === m.id ? 'border-deep bg-deep text-white' : 'border-line bg-warm hover:border-sage')}>
                            {m.nombre}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="min-w-0 space-y-4">
              <AnimatePresence mode="wait">
                {muscle ? (
                  <motion.div key={muscle.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="muscle-card">
                    <Card as="article" className="!p-5 border-t-[5px] border-t-sage shadow-lift">
                      <div className="mb-3 flex flex-wrap gap-2"><Badge tone={muscle.grupo === 'flexor' ? 'rose' : 'steel'}>{muscle.grupo === 'flexor' ? 'Flexor' : 'Extensor'} · motor principal</Badge></div>
                      <h2 className="text-[1.9rem] leading-tight">{muscle.nombre}</h2>
                      {muscle.alerta && <p className="mt-3 rounded-xl border border-lilac bg-lilac/15 p-3 text-sm">{muscle.alerta}</p>}
                      <dl className="mt-5 space-y-4">
                        <Field label="Origen principal" tone="sage">{muscle.origen}</Field>
                        <Field label="Inserción distal" tone="rose">{muscle.insercion}</Field>
                        <Field label="Inervación" tone="lilac">{muscle.inervacion}</Field>
                        <Field label="Acción" tone="steel">{muscle.accion}</Field>
                        <Field label="Función estabilizadora" tone="sage">{muscle.estabilizacion}</Field>
                        <Field label="Relaciones funcionales" tone="rose">{muscle.relaciones}</Field>
                        <Field label="Movimientos en los que participa" tone="lilac">{muscle.movimientos.map((m) => MOVEMENT_BY_ID[m].nombre).join(', ')}</Field>
                      </dl>
                    </Card>
                  </motion.div>
                ) : (
                  <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Card className="grid min-h-48 place-items-center text-center"><div><p className="font-serif text-2xl text-deep-700">Selecciona un músculo</p><p className="mt-2 text-sm text-ink-soft">En la imagen se resalta su silueta real y se marca el punto de inserción (cuadrado). El origen queda fuera del recorte.</p></div></Card>
                  </motion.div>
                )}
              </AnimatePresence>
              <Card className="!p-0">
                <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="flex min-h-14 w-full items-center justify-between px-5 text-left">
                  <span><span className="block font-serif text-xl font-semibold text-deep-700">Músculos auxiliares de los dedos</span><span className="text-xs text-ink-soft">Cruzan la muñeca, pero no son sus motores principales</span></span>
                  <ChevronDown className={cn('size-5 transition-transform', open && 'rotate-180')} />
                </button>
                {open && (
                  <ul className="space-y-3 border-t border-line p-5 text-sm">
                    {AUXILIARES.map((a) => (
                      <li key={a.nombre}><strong className="text-deep-700">{a.nombre}</strong> <span className="text-ink-soft">· {a.nervio}</span><br />{a.nota}</li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <MovementSim />
          <div className="grid gap-4 md:grid-cols-3">
            {WRIST_JOINT_NOTES.map((n) => (
              <Card key={n.titulo} className="bg-cream"><h3 className="text-2xl">{n.titulo}</h3><p className="mt-2 text-[15px] text-ink-soft">{n.texto}</p></Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
