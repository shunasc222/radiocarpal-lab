import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertTriangle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, Field, SectionHeader, Tabs, Toggle } from '../components/ui/ui'
import LigamentFigure, { CAT_COLOR } from '../components/figure/LigamentFigure'
import { CATEGORY_LABEL, FAILURE_STEPS, LIGAMENTS, LIG_BY_ID, type LigCategory, type LigView } from '../data/ligaments'
import { cn } from '../lib/utils'

const CATS: (LigCategory | 'todos')[] = ['todos', 'radiocarpiano', 'ulnocarpiano', 'colateral', 'intercarpiano', 'radioulnar', 'capsula']
const CAT_NAME: Record<LigCategory | 'todos', string> = { todos: 'Todos', ...CATEGORY_LABEL }

export default function Ligaments() {
  const [view, setView] = useState<LigView>('palmar')
  const [selected, setSelected] = useState<string | null>(null)
  const [cat, setCat] = useState<LigCategory | 'todos'>('todos')
  const [step, setStep] = useState(0)

  const list = useMemo(() => LIGAMENTS.filter((l) => l.views.includes(view) && (cat === 'todos' || l.categoria === cat)), [view, cat])
  const lig = selected ? LIG_BY_ID[selected] : null
  const change = (v: LigView) => {
    setView(v)
    if (selected && !LIG_BY_ID[selected].views.includes(v)) setSelected(null)
  }

  return (
    <div>
      <SectionHeader n={4} eyebrow="Ligamentos y estabilidad" title="Medios de unión de la muñeca"
        lead="Distingue los ligamentos propios de la articulación radiocarpiana de los intercarpianos y de los estabilizadores de la articulación radioulnar distal. Toca un ligamento en el esquema o en la lista." />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Tabs<LigView> label="Vista" value={view} onChange={change} items={[{ id: 'palmar', label: 'Vista palmar' }, { id: 'dorsal', label: 'Vista dorsal' }]} />
        <Button variant="soft" size="sm" onClick={() => { setSelected(null); setCat('todos'); setView('palmar') }} icon={<RotateCcw className="size-4" />}>Restablecer</Button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
        {CATS.map((c) => (
          <Toggle key={c} pressed={cat === c} onClick={() => setCat(c)}>
            {c !== 'todos' && <span className="size-2.5 rounded-full" style={{ background: CAT_COLOR[c] }} aria-hidden />}
            {CAT_NAME[c]}
          </Toggle>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0 space-y-4">
          <Card className="!p-2 sm:!p-4">
            <LigamentFigure view={view} selected={selected} onSelect={setSelected} cat={cat} />
            <p className="px-2 pb-1 text-center text-xs text-ink-soft">
              {view === 'palmar' ? 'Vista palmar: radio a la izquierda.' : 'Vista dorsal: radio a la derecha.'} Huesos reales (BodyParts3D, CC BY 4.0); ligamentos y disco esquemáticos, con inserciones aproximadas; los interóseos y el disco se ven sobre el hueso por transparencia.
            </p>
          </Card>
          <ul className="flex flex-wrap gap-2" aria-label="Lista de ligamentos">
            {list.map((l) => (
              <li key={l.id}>
                <button type="button" aria-pressed={selected === l.id} onClick={() => setSelected(l.id)}
                  className={cn('inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors', selected === l.id ? 'border-deep bg-deep text-white' : 'border-line bg-warm hover:border-sage')}>
                  <span className="size-2.5 shrink-0 rounded-full" style={{ background: CAT_COLOR[l.categoria] }} aria-hidden />{l.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <AnimatePresence mode="wait">
            {lig ? (
              <motion.div key={lig.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="ligament-card">
                <Card as="article" className="!p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <Badge tone={lig.propio ? 'rose' : 'steel'}>{lig.propio ? 'Propio de la radiocarpiana' : lig.categoria === 'radioulnar' ? 'Estabilizador radioulnar distal' : 'Intercarpiano / no radiocarpiano'}</Badge>
                    <Badge tone="sage">{CATEGORY_LABEL[lig.categoria]}</Badge>
                  </div>
                  <h2 className="text-[1.8rem] leading-tight">{lig.nombre}</h2>
                  <dl className="mt-5 space-y-4">
                    <Field label="Origen" tone="sage">{lig.origen}</Field>
                    <Field label="Inserción" tone="rose">{lig.insercion}</Field>
                    <Field label="Función" tone="lilac">{lig.funcion}</Field>
                    <Field label="Función estabilizadora" tone="steel">{lig.estabilidad}</Field>
                    <Field label="Relación con lesiones clínicas" tone="rose">{lig.lesion}</Field>
                  </dl>
                  {lig.nota && <p className="mt-4 rounded-xl bg-cream p-3 text-xs text-ink-soft"><strong>Nota:</strong> {lig.nota}</p>}
                </Card>
              </motion.div>
            ) : (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="grid min-h-48 place-items-center text-center">
                  <div>
                    <p className="font-serif text-2xl text-deep-700">Selecciona un ligamento</p>
                    <p className="mt-2 text-sm text-ink-soft">Verás su origen, inserción, función estabilizadora y la lesión clínica asociada.</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-ink-soft" aria-label="Leyenda de colores">
            {(Object.keys(CATEGORY_LABEL) as LigCategory[]).map((c) => (
              <li key={c} className="flex items-center gap-2"><span className="h-1.5 w-5 rounded-full" style={{ background: CAT_COLOR[c] }} />{CATEGORY_LABEL[c]}</li>
            ))}
          </ul>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="falla">
        <div className="mb-5 flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-rose/60 text-rose-deep"><AlertTriangle className="size-5" /></span>
          <div>
            <h2 id="falla" className="text-3xl sm:text-4xl">¿Qué ocurre cuando falla la estabilidad ligamentosa?</h2>
            <p className="mt-2 max-w-3xl text-[15px] text-ink-soft">Ejemplo: rotura del ligamento escafolunar interóseo. La lesión rompe el vínculo entre dos huesos, altera la cinemática del carpo y acaba produciendo dolor e inestabilidad.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="!p-3">
            <p className="mb-1 px-2 text-sm font-semibold text-deep-700">Carpo normal (vista dorsal)</p>
            <LigamentFigure view="dorsal" selected="escafolunar" cat="todos" only={['escafolunar', 'lunopiramidal']} crop={[1.2, -2.6]} interactive={false} />
          </Card>
          <Card className="!p-3 border-rose/70">
            <p className="mb-1 px-2 text-sm font-semibold text-rose-deep">Falla del ligamento escafolunar (esquema)</p>
            <LigamentFigure view="dorsal" selected="escafolunar" cat="todos" only={['escafolunar', 'lunopiramidal']} failure crop={[1.2, -2.6]} interactive={false} />
            <p className="px-2 pt-1 text-xs text-ink-soft">Rojo punteado: ligamento escafolunar roto. Consecuencia (no dibujada): el escafoides se flexiona y el semilunar se extiende (DISI).</p>
          </Card>
        </div>
        <Card className="mt-4">
          <div role="group" aria-label="Pasos" className="mb-4 flex gap-2">
            {FAILURE_STEPS.map((s, i) => (
              <button key={s.titulo} type="button" aria-label={`Paso ${i + 1}`} aria-current={i === step} onClick={() => setStep(i)} className={cn('h-2.5 flex-1 rounded-full transition-colors', i <= step ? 'bg-deep' : 'bg-sage/30')} />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="min-h-28" data-testid="failure-step">
              <h3 className="text-2xl">{FAILURE_STEPS[step].titulo}</h3>
              <p className="mt-2 text-[15px] leading-relaxed">{FAILURE_STEPS[step].texto}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-4 flex gap-2">
            <Button variant="soft" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)} icon={<ChevronLeft className="size-4" />}>Anterior</Button>
            <Button variant="primary" size="sm" disabled={step === FAILURE_STEPS.length - 1} onClick={() => setStep((s) => s + 1)}>Siguiente<ChevronRight className="size-4" /></Button>
          </div>
        </Card>
      </section>
    </div>
  )
}
