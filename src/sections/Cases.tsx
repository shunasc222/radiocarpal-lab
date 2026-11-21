import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, ClipboardList, Lightbulb, RotateCcw, Stethoscope, X } from 'lucide-react'
import { Badge, Button, Card, Field, ProgressBar, SectionHeader, useToast } from '../components/ui/ui'
import { CASES, type ClinicalCase } from '../data/cases'
import type { SectionId } from '../lib/nav'
import { shuffle, cn } from '../lib/utils'
import { FigurePanel } from '../components/ui/FigurePanel'
import AtlasFigure, { type AtlasView } from '../components/figure/AtlasFigure'

const CASE_FIG: Record<string, { view: AtlasView; selected: string; surfaces: boolean; cap: string }> = {
  escafoides: { view: 'palmar', selected: 'escafoides', surfaces: false, cap: 'Escafoides (resaltado): suelo de la tabaquera anatómica' },
  tfcc: { view: 'palmar', selected: 'disco', surfaces: true, cap: 'Disco articular del TFCC (esquemático) entre la ulna y el carpo' },
  'radio-distal': { view: 'distal', selected: 'superficie-articular', surfaces: true, cap: 'Superficie articular del radio distal vista desde distal' },
}

type Stage = 0 | 1 | 2
const STAGES = ['Presentación clínica', 'Toma de decisiones', 'Explicación anatómica']

function CaseFigure({ id }: { id: string }) {
  const f = CASE_FIG[id]
  if (!f) return null
  return (
    <FigurePanel caption={f.cap} className="self-start">
      <AtlasFigure view={f.view} selected={f.selected} showLabels={false} highlightSurfaces={f.surfaces} wide={false} interactive={false} />
    </FigurePanel>
  )
}

function CasePlayer({ c, go, onDone }: { c: ClinicalCase; go: (id: SectionId) => void; onDone: () => void }) {
  const { toast } = useToast()
  const [stage, setStage] = useState<Stage>(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  // opciones barajadas una vez por intento
  const [seed, setSeed] = useState(0)
  const order = useMemo(() => Object.fromEntries(c.decisiones.map((d) => [d.id, shuffle(d.opciones.map((_, i) => i))])), [c, seed])  // eslint-disable-line react-hooks/exhaustive-deps

  const answered = Object.keys(answers).length
  const total = c.decisiones.length
  const correct = c.decisiones.filter((d) => answers[d.id] !== undefined && d.opciones[answers[d.id]].correcta).length
  const allDone = answered === total

  const reset = () => { setStage(0); setAnswers({}); setSeed((s) => s + 1) }
  const answer = (did: string, idx: number) => {
    if (answers[did] !== undefined) return
    setAnswers((a) => {
      const next = { ...a, [did]: idx }
      if (Object.keys(next).length === total) {
        const ok = c.decisiones.filter((d) => d.opciones[next[d.id]].correcta).length
        toast(ok === total ? `¡Caso resuelto sin errores! (${ok}/${total})` : `Caso completado: ${ok}/${total} decisiones correctas`)
        onDone()
      }
      return next
    })
  }

  return (
    <div>
      <ol className="mb-5 grid grid-cols-3 gap-2" aria-label="Etapas del caso">
        {STAGES.map((s, i) => {
          const locked = i === 2 && !allDone
          return (
            <li key={s}>
              <button type="button" disabled={locked || (i === 1 && false)} aria-current={stage === i ? 'step' : undefined} onClick={() => setStage(i as Stage)}
                className={cn('flex min-h-14 w-full flex-col items-center justify-center rounded-2xl border px-2 py-2 text-center text-xs font-semibold transition-colors sm:text-sm',
                  stage === i ? 'border-deep bg-deep text-white' : 'border-line bg-warm', locked && 'opacity-45', !locked && stage !== i && 'hover:border-sage')}>
                <span className="text-[10px] opacity-75">Etapa {i + 1}</span>{s}
              </button>
            </li>
          )
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div key={stage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          {stage === 0 && (
            <Card className="!p-5 sm:!p-7">
              <div className="grid gap-6 md:grid-cols-[1.35fr_0.65fr]">
              <div>
              <Badge tone="lilac">{c.paciente}</Badge>
              <h3 className="mt-3 text-3xl">Motivo de consulta</h3>
              <p className="mt-2 text-[16px]">{c.presentacion.motivo}</p>
              <dl className="mt-5 space-y-4">
                <Field label="Antecedente traumático / contexto" tone="rose">{c.presentacion.antecedente}</Field>
                <Field label="Signos y síntomas" tone="lilac"><ul className="mt-1 list-disc space-y-1 pl-5">{c.presentacion.signos.map((s) => <li key={s}>{s}</li>)}</ul></Field>
                <div className="grid gap-3 sm:grid-cols-3">
                  {c.presentacion.hallazgos.map((h) => (
                    <div key={h.etiqueta} className="rounded-2xl bg-cream p-3"><p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-deep">{h.etiqueta}</p><p className="mt-1 text-sm">{h.valor}</p></div>
                  ))}
                </div>
                <Field label="Estudios de imagen" tone="steel">{c.presentacion.imagenes}</Field>
              </dl>
              <Button variant="primary" className="mt-6" onClick={() => setStage(1)} icon={<ClipboardList className="size-4" />}>Pasar a la toma de decisiones</Button>
              </div>
              <CaseFigure id={c.id} />
              </div>
            </Card>
          )}

          {stage === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3"><div className="flex-1"><ProgressBar value={answered} max={total} label="Decisiones respondidas" /></div><span className="text-sm font-medium text-deep-700">{answered}/{total}</span></div>
              {c.decisiones.map((d, qi) => {
                const chosen = answers[d.id]
                const done = chosen !== undefined
                return (
                  <Card key={d.id} className="!p-5" data-testid={`decision-${d.id}`}>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-deep">Decisión {qi + 1} de {total}</p>
                    <h3 className="mt-1 font-sans text-[17px] font-semibold leading-snug text-ink" style={{ fontFamily: 'var(--font-sans)' }}>{d.pregunta}</h3>
                    <div className="mt-4 grid gap-2" role="group" aria-label="Opciones">
                      {order[d.id].map((oi) => {
                        const o = d.opciones[oi]
                        const isChosen = chosen === oi
                        return (
                          <div key={oi}>
                            <button type="button" disabled={done} onClick={() => answer(d.id, oi)}
                              className={cn('flex min-h-12 w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition-colors',
                                !done && 'border-line bg-warm hover:border-sage active:bg-cream',
                                done && o.correcta && 'border-deep bg-sage/30',
                                done && isChosen && !o.correcta && 'border-rose-deep bg-rose/50',
                                done && !o.correcta && !isChosen && 'border-line bg-cream opacity-60')}>
                              <span className="mt-0.5 shrink-0">{done && o.correcta ? <Check className="size-5 text-deep" aria-label="correcta" /> : done && isChosen ? <X className="size-5 text-rose-deep" aria-label="incorrecta" /> : <span className="block size-5 rounded-full border border-sage" />}</span>
                              {o.texto}
                            </button>
                            {done && (isChosen || o.correcta) && (
                              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={cn('mx-1 mt-1 rounded-xl px-3 py-2 text-sm', o.correcta ? 'bg-sage/25 text-deep-700' : 'bg-rose/40 text-rose-deep')}>
                                {isChosen && !o.correcta ? 'Tu respuesta: ' : o.correcta && !isChosen ? 'Respuesta correcta: ' : ''}{o.feedback}
                              </motion.p>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                )
              })}
              {allDone && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-wrap items-center gap-3 rounded-3xl bg-sage/25 p-4">
                  <p className="flex-1 text-[15px] font-medium text-deep-700">Resultado: {correct} de {total} decisiones correctas.</p>
                  <Button variant="primary" onClick={() => setStage(2)} icon={<Lightbulb className="size-4" />}>Ver explicación anatómica</Button>
                </motion.div>
              )}
              {!allDone && <p className="text-center text-xs text-ink-soft">La explicación anatómica se desbloquea al responder todas las decisiones.</p>}
            </div>
          )}

          {stage === 2 && allDone && (
            <Card className="!p-5 sm:!p-7" data-testid="case-explanation">
              <Badge tone="sage">Explicación anatómica</Badge>
              <h3 className="mt-3 text-3xl">{c.titulo}</h3>
              <p className="mt-2 text-[16px]">{c.explicacion.resumen}</p>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {c.explicacion.estructuras.map((e) => (
                  <div key={e.nombre} className="rounded-2xl bg-cream p-4"><p className="font-serif text-xl font-semibold text-deep-700">{e.nombre}</p><p className="mt-1 text-sm">{e.texto}</p></div>
                ))}
              </div>
              <h4 className="mt-6 font-serif text-2xl font-semibold text-deep-700">Puntos clave</h4>
              <ul className="mt-2 space-y-1.5">{c.explicacion.puntosClave.map((p) => <li key={p} className="flex gap-2 text-[15px]"><Check className="mt-1 size-4 shrink-0 text-deep" />{p}</li>)}</ul>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button variant="soft" onClick={() => go('atlas')}>Ver en el atlas</Button>
                {c.explicacion.seccion && <Button variant="soft" onClick={() => go(c.explicacion.seccion!.id as SectionId)}>{c.explicacion.seccion.etiqueta}</Button>}
                <Button variant="outline" onClick={reset} icon={<RotateCcw className="size-4" />}>Reiniciar caso</Button>
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      {stage !== 2 && (answered > 0 || stage > 0) && (
        <div className="mt-4"><Button variant="ghost" size="sm" onClick={reset} icon={<RotateCcw className="size-4" />}>Reiniciar caso</Button></div>
      )}
    </div>
  )
}

export default function Cases({ go }: { go: (id: SectionId) => void }) {
  const [active, setActive] = useState(CASES[0].id)
  const [done, setDone] = useState<string[]>([])
  const c = CASES.find((x) => x.id === active)!
  return (
    <div>
      <SectionHeader n={7} eyebrow="Correlaciones clínicas" title="Casos clínicos interactivos"
        lead="Tres casos con tres etapas: presentación clínica, toma de decisiones y explicación anatómica. La solución no se muestra hasta que respondes." />
      <div className="mb-6 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Casos">
        {CASES.map((k) => (
          <button key={k.id} role="tab" type="button" aria-selected={active === k.id} onClick={() => setActive(k.id)}
            className={cn('relative rounded-3xl border p-4 text-left transition-all', active === k.id ? 'border-deep bg-warm shadow-lift' : 'border-line bg-warm/70 shadow-soft hover:border-sage')}>
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-deep"><span className="flex items-center gap-2"><Stethoscope className="size-4" />Caso {k.numero}</span>{done.includes(k.id) && <Badge tone="sage">Completado</Badge>}</span>
            <span className="mt-2 block font-serif text-2xl font-semibold leading-tight text-deep-700">{k.titulo}</span>
            <span className="mt-1 block text-sm text-ink-soft">{k.resumen}</span>
          </button>
        ))}
      </div>
      <CasePlayer key={c.id} c={c} go={go} onDone={() => setDone((d) => (d.includes(c.id) ? d : [...d, c.id]))} />
    </div>
  )
}
