import { useCallback, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { Check, Eye, EyeOff, GraduationCap, Layers, RotateCcw, BookOpen, X as XIcon, ArrowRight } from 'lucide-react'
import { Badge, Button, Card, SectionHeader, Tabs, Toggle, useToast } from '../components/ui/ui'
import { FigurePanel } from '../components/ui/FigurePanel'
import { StructureCard } from '../components/ui/InfoCard'
import AtlasFigure, { VIEW_OF, zonesOf, type AtlasView } from '../components/figure/AtlasFigure'
import { STRUCTURES, STRUCTURE_BY_ID, SURFACES } from '../data/structures'
import { shuffle, useMediaQuery, cn } from '../lib/utils'

type Mode = 'estudio' | 'autoevaluacion'

const QUIZ_POOL = STRUCTURES.filter((s) => s.enEsquema).map((s) => s.id)
const viewFor = (id: string, cur: AtlasView): AtlasView => (VIEW_OF[id] ? VIEW_OF[id] : id in zonesOf(cur) ? cur : 'palmar')

function newRound(prev?: string | null) {
  const pool = QUIZ_POOL.filter((id) => id !== prev)
  const target = pool[Math.floor(Math.random() * pool.length)]
  const distract = shuffle(QUIZ_POOL.filter((id) => id !== target)).slice(0, 3)
  return { target, options: shuffle([target, ...distract]) }
}

export default function Atlas() {
  const wide = useMediaQuery('(min-width: 720px)')
  const { toast } = useToast()
  const [view, setView] = useState<AtlasView>('palmar')
  const [mode, setMode] = useState<Mode>('estudio')
  const [selected, setSelected] = useState<string | null>(null)
  const [labels, setLabels] = useState(true)
  const [surfaces, setSurfaces] = useState(false)
  const [round, setRound] = useState(() => newRound())
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState({ ok: 0, total: 0, streak: 0 })

  const reset = useCallback(() => {
    setMode('estudio'); setView('palmar'); setSelected(null); setLabels(true); setSurfaces(false); setAnswer(null)
  }, [])

  const answerQuiz = useCallback((id: string) => {
    if (answer) return
    setAnswer(id)
    setSelected(round.target)
    setView(viewFor(round.target, view))
    const ok = id === round.target
    setScore((s) => {
      const streak = ok ? s.streak + 1 : 0
      if (ok && streak === 5) toast('¡Racha de 5 identificaciones correctas!')
      return { ok: s.ok + (ok ? 1 : 0), total: s.total + 1, streak }
    })
  }, [answer, round.target, toast])

  const onSelect = useCallback((id: string) => {
    if (mode === 'autoevaluacion') answerQuiz(id)
    else { setSelected(id); if (id in zonesOf(view) === false || VIEW_OF[id]) setView(viewFor(id, view)) }
  }, [mode, answerQuiz, view])

  const next = () => { const r = newRound(round.target); setRound(r); setView(viewFor(r.target, view)); setAnswer(null); setSelected(null) }
  const changeMode = (m: Mode) => {
    setMode(m); setSelected(null); setAnswer(null)
    if (m === 'autoevaluacion') { const r = newRound(); setRound(r); setView(viewFor(r.target, view)); setLabels(false) } else setLabels(true)
  }

  const target = STRUCTURE_BY_ID[round.target]
  const quiz = mode === 'autoevaluacion'
  const card = useMemo(() => (selected ? STRUCTURE_BY_ID[selected] : null), [selected])

  return (
    <div>
      <SectionHeader n={2} eyebrow="Atlas anatómico interactivo" title="Osteología y superficies articulares"
        lead="Imágenes elaboradas a partir de modelos reales de BodyParts3D (CC BY 4.0): muñeca derecha en vistas palmar, dorsal y distal del radio y la ulna. Toca cualquier zona para abrir su ficha. La ulna no contacta con el carpo: entre ambos se interpone el disco articular." />

      <div className="mb-5 flex flex-wrap items-center gap-2" role="toolbar" aria-label="Controles del atlas">
        <Tabs<Mode> label="Modo" value={mode} onChange={changeMode} items={[
          { id: 'estudio', label: 'Modo de estudio', short: 'Estudio', icon: <BookOpen className="size-4" /> },
          { id: 'autoevaluacion', label: 'Modo de autoevaluación', short: 'Autoevaluación', icon: <GraduationCap className="size-4" /> },
        ]} />
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        <Toggle pressed={labels} onClick={() => setLabels((v) => !v)} icon={labels ? <EyeOff className="size-4" /> : <Eye className="size-4" />} title="Mostrar u ocultar los rótulos del esquema">
          {labels ? 'Ocultar etiquetas' : 'Mostrar etiquetas'}
        </Toggle>
        <Toggle pressed={surfaces} onClick={() => setSurfaces((v) => !v)} tone="rose" icon={<Layers className="size-4" />}>Resaltar superficies articulares</Toggle>
        <Button variant="soft" onClick={reset} icon={<RotateCcw className="size-4" />}>Restablecer vista</Button>
      </div>

      {mode === 'estudio' && (
        <div className="mb-4"><Tabs<AtlasView> label="Vista del esquema" value={view} onChange={(v) => { setView(v); if (selected && !(selected in zonesOf(v)) && !(VIEW_OF[selected] === v)) setSelected(null) }} items={[
          { id: 'palmar', label: 'Vista palmar', short: 'Palmar' }, { id: 'dorsal', label: 'Vista dorsal', short: 'Dorsal' }, { id: 'distal', label: 'Vista distal (superficie articular)', short: 'Distal' },
        ]} /></div>
      )}
      <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <FigurePanel caption="Imagen elaborada con modelos reales de BodyParts3D (CC BY 4.0) · muñeca derecha">
            <AtlasFigure view={view} selected={selected} onSelect={onSelect} showLabels={labels && !quiz} highlightSurfaces={surfaces} target={quiz && !answer ? round.target : null} wide={wide} />
            {surfaces && (
              <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 px-2 pb-1 text-xs text-ink-soft" aria-label="Leyenda de superficies">
                <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-[#8cb9df]" />Cartílago articular (radio, ulna y fila proximal del carpo): delimitación aproximada</li>
                {view !== 'distal' && <li className="flex items-center gap-2"><span className="size-3 rounded-sm bg-rose-deep/60" />Disco articular (esquemático)</li>}
              </ul>
            )}
          </FigurePanel>
          {mode === 'estudio' && (
            <div>
              <h2 className="mb-2 text-2xl">Todas las estructuras</h2>
              <ul className="flex flex-wrap gap-2" aria-label="Lista de estructuras">
                {STRUCTURES.map((s) => (
                  <li key={s.id}>
                    <button type="button" aria-pressed={selected === s.id} onClick={() => onSelect(s.id)}
                      className={cn('min-h-11 rounded-full border px-3.5 text-sm transition-colors', selected === s.id ? 'border-deep bg-deep text-white' : 'border-line bg-warm hover:border-sage')}>
                      <span className="mr-1.5 text-xs opacity-60">{s.num}</span>{s.nombre.replace(' (fibrocartílago triangular)', '')}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-4">
          {quiz && (
            <Card className="border-lilac !p-5" aria-live="polite">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Badge tone="lilac">Autoevaluación</Badge>
                <span className="text-sm font-medium text-deep-700" data-testid="atlas-score">Aciertos {score.ok}/{score.total}</span>
              </div>
              <h2 className="text-2xl">¿Qué estructura está resaltada?</h2>
              <p className="mt-2 text-sm text-ink-soft"><strong>Pista:</strong> {target.pista}</p>
              <p className="mt-1 text-xs text-ink-soft">Elige un nombre, o toca la zona que crees que corresponde.</p>
              <div className="mt-4 grid gap-2" role="group" aria-label="Opciones">
                {round.options.map((id) => {
                  const s = STRUCTURE_BY_ID[id]
                  const done = !!answer
                  const isCorrect = id === round.target
                  const isChosen = answer === id
                  return (
                    <button key={id} type="button" disabled={done} onClick={() => answerQuiz(id)}
                      className={cn('flex min-h-12 items-center justify-between gap-2 rounded-2xl border px-4 py-2 text-left text-[15px] transition-colors',
                        !done && 'border-line bg-warm hover:border-sage',
                        done && isCorrect && 'border-deep bg-sage/30',
                        done && isChosen && !isCorrect && 'border-rose-deep bg-rose/50',
                        done && !isCorrect && !isChosen && 'border-line bg-cream opacity-60')}>
                      {s.nombre}
                      {done && isCorrect && <Check className="size-5 text-deep" aria-label="correcta" />}
                      {done && isChosen && !isCorrect && <XIcon className="size-5 text-rose-deep" aria-label="incorrecta" />}
                    </button>
                  )
                })}
              </div>
              {answer && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4" data-testid="atlas-feedback">
                  <p className={cn('rounded-2xl p-3 text-sm font-medium', answer === round.target ? 'bg-sage/30 text-deep-700' : 'bg-rose/50 text-rose-deep')}>
                    {answer === round.target ? '¡Correcto! ' : `Incorrecto. Era: ${target.nombre}. `}{target.participacionNota}
                  </p>
                  <Button variant="primary" className="mt-3" onClick={next} icon={<ArrowRight className="size-4" />}>Siguiente estructura</Button>
                </motion.div>
              )}
            </Card>
          )}
          {(!quiz || answer) && <StructureCard s={card} />}
        </div>
      </div>

      <section className="mt-12" aria-labelledby="superficies">
        <h2 id="superficies" className="mb-4 text-3xl">Superficies articulares</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-rose/70"><Badge tone="rose">Proximal</Badge><h3 className="mt-3 text-2xl">{SURFACES.proximal.titulo}</h3><p className="mt-2 text-[15px] text-ink-soft">{SURFACES.proximal.texto}</p></Card>
          <Card className="border-steel/80"><Badge tone="steel">Distal</Badge><h3 className="mt-3 text-2xl">{SURFACES.distal.titulo}</h3><p className="mt-2 text-[15px] text-ink-soft">{SURFACES.distal.texto}</p></Card>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card className="bg-cream"><h3 className="text-xl">Contacto variable</h3><p className="mt-2 text-[15px] text-ink-soft">{SURFACES.nota}</p></Card>
          <Card className="border-lilac bg-lilac/10"><h3 className="text-xl">Aspecto imprescindible</h3><p className="mt-2 text-[15px] font-medium text-ink">{SURFACES.ulna}</p></Card>
        </div>
      </section>
    </div>
  )
}
