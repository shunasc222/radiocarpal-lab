import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, BookMarked, Check, ClipboardCheck, ListChecks, RotateCcw, Stethoscope, X, Zap } from 'lucide-react'
import { Badge, Button, Card, ProgressBar, SectionHeader, useToast } from '../components/ui/ui'
import { CATEGORY_LABEL } from '../data/questions'
import { REFERENCES } from '../data/references'
import { MODE_INFO, generalFeedback, prepareQuiz, scoreQuiz, type PreparedQuestion, type QuizMode } from '../lib/quiz'
import { cn } from '../lib/utils'

type Phase = 'menu' | 'running' | 'result'
const LETTERS = ['A', 'B', 'C', 'D']

function Menu({ start }: { start: (m: QuizMode) => void }) {
  const modes: { id: QuizMode; icon: React.ReactNode; tone: string }[] = [
    { id: 'rapida', icon: <Zap className="size-6" />, tone: 'bg-rose/50 text-rose-deep' },
    { id: 'completa', icon: <ListChecks className="size-6" />, tone: 'bg-lilac/50 text-lilac-deep' },
    { id: 'clinica', icon: <Stethoscope className="size-6" />, tone: 'bg-steel/60 text-steel-deep' },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {modes.map((m) => (
        <button key={m.id} type="button" onClick={() => start(m.id)} className="group rounded-3xl border border-line bg-warm p-6 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift active:scale-[0.99]">
          <span className={cn('grid size-12 place-items-center rounded-2xl', m.tone)}>{m.icon}</span>
          <h3 className="mt-4 text-3xl">{MODE_INFO[m.id].titulo}</h3>
          <p className="mt-1 text-sm text-ink-soft">{MODE_INFO[m.id].subtitulo}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-deep">Comenzar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
        </button>
      ))}
    </div>
  )
}

function Running({ items, mode, onFinish, onExit }: { items: PreparedQuestion[]; mode: QuizMode; onFinish: (a: (number | null)[]) => void; onExit: () => void }) {
  const [i, setI] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null))
  const it = items[i]
  const chosen = answers[i]
  const done = chosen !== null
  const pick = (pos: number) => { if (!done) setAnswers((a) => a.map((v, k) => (k === i ? pos : v))) }
  const last = i === items.length - 1
  const answeredCount = answers.filter((a) => a !== null).length

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Badge tone="lilac">{MODE_INFO[mode].titulo}</Badge>
        <div className="flex-1"><ProgressBar value={answeredCount} max={items.length} label="Progreso de la evaluación" /></div>
        <span className="text-sm font-medium text-deep-700" data-testid="quiz-progress">{i + 1}/{items.length}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={it.q.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
          <Card className="!p-5 sm:!p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-deep">{CATEGORY_LABEL[it.q.categoria]}</p>
            <h2 className="mt-2 font-sans text-[19px] font-semibold leading-snug text-ink sm:text-xl" style={{ fontFamily: 'var(--font-sans)', letterSpacing: 0 }} data-testid="quiz-question">{it.q.enunciado}</h2>
            <div className="mt-5 grid gap-2.5" role="radiogroup" aria-label="Alternativas">
              {it.options.map((o, pos) => {
                const isChosen = chosen === pos
                const isCorrect = pos === it.correctPos
                return (
                  <button key={o.orig} type="button" role="radio" aria-checked={isChosen} disabled={done} onClick={() => pick(pos)}
                    className={cn('flex min-h-14 items-start gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] transition-colors',
                      !done && 'border-line bg-warm hover:border-sage active:bg-cream',
                      done && isCorrect && 'border-deep bg-sage/30',
                      done && isChosen && !isCorrect && 'border-rose-deep bg-rose/50',
                      done && !isCorrect && !isChosen && 'border-line bg-cream opacity-60')}>
                    <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold', done && isCorrect ? 'bg-deep text-white' : done && isChosen ? 'bg-rose-deep text-white' : 'bg-sage/30 text-deep-700')}>
                      {done && isCorrect ? <Check className="size-4" /> : done && isChosen ? <X className="size-4" /> : LETTERS[pos]}
                    </span>
                    {o.text}
                  </button>
                )
              })}
            </div>
            {done && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 space-y-2" data-testid="quiz-feedback">
                <p className={cn('rounded-2xl p-4 text-[15px]', chosen === it.correctPos ? 'bg-sage/30 text-deep-700' : 'bg-rose/40 text-ink')}>
                  <strong>{chosen === it.correctPos ? '¡Correcto! ' : 'Incorrecto. '}</strong>
                  {it.q.justificacion}
                </p>
                {chosen !== it.correctPos && chosen !== null && (
                  <p className="rounded-2xl bg-cream p-4 text-sm"><strong>Por qué tu respuesta no es la correcta: </strong>{it.q.errores[it.options[chosen].orig]}</p>
                )}
              </motion.div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onExit}>Salir</Button>
        {last
          ? <Button variant="primary" disabled={!done} onClick={() => onFinish(answers)} icon={<ClipboardCheck className="size-4" />}>Ver resultados</Button>
          : <Button variant="primary" disabled={!done} onClick={() => setI((n) => n + 1)}>Siguiente<ArrowRight className="size-4" /></Button>}
      </div>
    </div>
  )
}

function Result({ items, answers, mode, retry, again, menu }: { items: PreparedQuestion[]; answers: (number | null)[]; mode: QuizMode; retry: () => void; again: () => void; menu: () => void }) {
  const r = useMemo(() => scoreQuiz(items, answers), [items, answers])
  const [review, setReview] = useState(false)
  return (
    <div data-testid="quiz-result">
      <Card className="!p-6 text-center sm:!p-9">
        <Badge tone="lilac">{MODE_INFO[mode].titulo}</Badge>
        <p className="mt-4 font-serif text-7xl font-semibold text-deep-700" data-testid="quiz-score">{r.correct}<span className="text-4xl text-ink-soft">/{r.total}</span></p>
        <p className="mt-1 text-xl font-semibold text-deep" data-testid="quiz-pct">{r.pct} %</p>
        <p className="mx-auto mt-3 max-w-xl text-[15px] text-ink-soft">{generalFeedback(r.pct)}</p>
        <div className="mx-auto mt-6 grid max-w-xl gap-3 text-left">
          {r.byCategory.map((c) => (
            <div key={c.categoria}>
              <div className="mb-1 flex justify-between text-xs font-medium"><span>{CATEGORY_LABEL[c.categoria]}</span><span>{c.correct}/{c.total}</span></div>
              <ProgressBar value={c.correct} max={c.total} label={CATEGORY_LABEL[c.categoria]} />
            </div>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <Button variant="primary" onClick={() => setReview((v) => !v)} icon={<ListChecks className="size-4" />}>{review ? 'Ocultar revisión' : 'Revisar respuestas'}</Button>
          <Button variant="soft" onClick={retry} icon={<RotateCcw className="size-4" />}>Repetir la evaluación</Button>
          <Button variant="soft" onClick={again}>Otras preguntas</Button>
          <Button variant="ghost" onClick={menu}>Cambiar de modo</Button>
        </div>
      </Card>
      {review && (
        <ol className="mt-5 space-y-3" aria-label="Revisión de respuestas">
          {items.map((it, i) => {
            const a = answers[i]
            const ok = a === it.correctPos
            return (
              <li key={it.q.id}>
                <Card className={cn('!p-5', ok ? 'border-sage' : 'border-rose-deep/50')}>
                  <p className="flex items-start gap-2 text-[15px] font-semibold"><span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-white', ok ? 'bg-deep' : 'bg-rose-deep')}>{ok ? <Check className="size-4" /> : <X className="size-4" />}</span>{i + 1}. {it.q.enunciado}</p>
                  <p className="mt-2 text-sm"><strong>Tu respuesta:</strong> {a === null ? 'Sin responder' : it.options[a].text}</p>
                  {!ok && <p className="mt-1 text-sm"><strong>Correcta:</strong> {it.options[it.correctPos].text}</p>}
                  <p className="mt-2 text-sm text-ink-soft">{it.q.justificacion}</p>
                  {!ok && a !== null && <p className="mt-1 text-sm text-rose-deep">{it.q.errores[it.options[a].orig]}</p>}
                </Card>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}

export default function Assessment() {
  const { toast } = useToast()
  const [phase, setPhase] = useState<Phase>('menu')
  const [mode, setMode] = useState<QuizMode>('rapida')
  const [items, setItems] = useState<PreparedQuestion[]>([])
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [attempt, setAttempt] = useState(0)

  const start = (m: QuizMode) => { setMode(m); setItems(prepareQuiz(m)); setAnswers([]); setAttempt((n) => n + 1); setPhase('running') }
  const retry = () => { setAnswers([]); setAttempt((n) => n + 1); setPhase('running') }
  const finish = (a: (number | null)[]) => {
    setAnswers(a); setPhase('result')
    const r = scoreQuiz(items, a)
    if (r.pct === 100) toast('¡Puntuación perfecta!')
    else if (r.pct >= 70) toast(`Evaluación aprobada: ${r.pct} %`)
  }

  return (
    <div>
      <SectionHeader n={8} eyebrow="Autoevaluación y bibliografía" title="Pon a prueba lo aprendido"
        lead="Banco de 20 preguntas con retroalimentación inmediata. Cada alternativa incorrecta tiene su propia explicación." />
      {phase === 'menu' && <Menu start={start} />}
      {phase === 'running' && <Running key={attempt} items={items} mode={mode} onFinish={finish} onExit={() => setPhase('menu')} />}
      {phase === 'result' && <Result items={items} answers={answers} mode={mode} retry={retry} again={() => start(mode)} menu={() => setPhase('menu')} />}

      <section className="mt-16" aria-labelledby="biblio">
        <div className="mb-4 flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-sage/40 text-deep"><BookMarked className="size-5" /></span><h2 id="biblio" className="text-4xl">Bibliografía</h2></div>
        <Card>
          <ol className="space-y-4">
            {REFERENCES.map((r) => (
              <li key={r.id} className="pl-8 -indent-8 text-[15px] leading-relaxed"><span className="font-medium">{r.apa}</span><br /><span className="text-xs text-ink-soft indent-0">Uso en este laboratorio: {r.uso}</span></li>
            ))}
          </ol>
          <div className="mt-6 space-y-2 rounded-2xl bg-cream p-4 text-sm leading-relaxed text-ink-soft">
            <p><strong className="text-deep-700">Alcance y limitaciones.</strong> El contenido se redactó a partir de conocimiento anatómico establecido, coherente con las obras citadas. <strong>No se citan páginas ni figuras</strong> y las obras no se consultaron página por página para elaborar esta versión: el docente debe contrastarlo con su ejemplar.</p>
            <p>Los datos editoriales (año, edición, editorial) deben verificarse con el ejemplar físico. Las ilustraciones son diagramas didácticos originales y no se atribuyen a ningún atlas; no se incluyen imágenes protegidas por derechos de autor.</p>
            <p>Los valores angulares y porcentajes (rangos de movimiento, irrigación del escafoides, parámetros radiográficos) son orientativos y varían entre autores.</p>
          </div>
        </Card>
      </section>

      <section className="mt-10" aria-labelledby="creditos">
        <Card>
          <h2 id="creditos" className="text-3xl">Créditos y licencias de los recursos</h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-relaxed">
            <li><strong>Modelos 3D de huesos, músculos, retináculo flexor y membrana interósea:</strong> BodyParts3D 4.0, © The Database Center for Life Science, licenciado bajo Creative Commons Attribution 4.0 International (CC BY 4.0). Obtenidos a través del paquete npm <code className="rounded bg-cream px-1.5 py-0.5 text-[13px]">@somakine/bodyparts3d-musculoskeletal</code> (CC BY 4.0). <em>Se modificaron:</em> selección de la extremidad derecha, cambio de ejes y unidades, suavizado por subdivisión, recorte con tapa y recálculo de normales. Ver <code className="rounded bg-cream px-1.5 py-0.5 text-[13px]">public/models/ATTRIBUTION.txt</code>.</li>
            <li><strong>Esquemático (no proviene de BodyParts3D):</strong> disco articular, ligamentos, flexor ulnar del carpo, arterias, venas y nervios; el tinte del cartílago articular es una delimitación aproximada derivada de la geometría.</li>
            <li><strong>Ilustraciones 2D:</strong> diagramas originales de RADIOCARPAL LAB y, cuando se indica, proyecciones de los modelos de BodyParts3D (mismos créditos).</li>
            <li><strong>Tipografías:</strong> Inter y Cormorant Garamond (SIL Open Font License 1.1), vía Fontsource.</li>
            <li><strong>Software:</strong> React, Three.js, React Three Fiber, Motion, Tailwind CSS, Lucide (licencias MIT/ISC).</li>
          </ul>
          <p className="mt-4 text-xs text-ink-soft">No se utilizan láminas de libros ni imágenes con derechos de autor sin licencia.</p>
        </Card>
      </section>
    </div>
  )
}
