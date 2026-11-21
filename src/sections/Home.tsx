import { motion } from 'motion/react'
import { Activity, ArrowRight, Bone, ClipboardCheck, Compass, Stethoscope } from 'lucide-react'
import { Button, Card } from '../components/ui/ui'
import AtlasFigure from '../components/figure/AtlasFigure'
import type { SectionId } from '../lib/nav'

const HERO_LABELS = ['radio-distal', 'disco', 'escafoides', 'semilunar', 'piramidal']

const CARDS: { id: SectionId; titulo: string; texto: string; icon: React.ReactNode; tone: string }[] = [
  { id: 'atlas', titulo: 'Anatomía', texto: 'Atlas interactivo de huesos y superficies articulares, ligamentos y modelo 3D.', icon: <Bone className="size-6" />, tone: 'bg-sage/40 text-deep' },
  { id: 'miologia', titulo: 'Biomecánica', texto: 'Músculos motores y simulador de flexión, extensión, desviaciones y circunducción.', icon: <Activity className="size-6" />, tone: 'bg-lilac/50 text-lilac-deep' },
  { id: 'casos', titulo: 'Clínica', texto: 'Tres casos: fractura de escafoides, lesión del TFCC y fractura distal del radio.', icon: <Stethoscope className="size-6" />, tone: 'bg-rose/60 text-rose-deep' },
  { id: 'evaluacion', titulo: 'Evaluación', texto: 'Banco de 20 preguntas con retroalimentación fundamentada y bibliografía en APA.', icon: <ClipboardCheck className="size-6" />, tone: 'bg-steel/60 text-steel-deep' },
]

export default function Home({ go }: { go: (id: SectionId) => void }) {
  return (
    <div>
      <section className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] border border-line bg-warm/70 px-5 py-8 shadow-soft sm:px-10 sm:py-12 lg:grid-cols-[1fr_1fr]" aria-labelledby="main-heading">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-rose/40 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-16 size-72 rounded-full bg-steel/40 blur-3xl" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-deep">PUCE Santo Domingo — Medicina — Morfofunción Osteomuscular</p>
          <h1 id="main-heading" tabIndex={-1} className="mt-4 text-[2.9rem] leading-[0.95] outline-none sm:text-6xl xl:text-7xl">RADIOCARPAL <span className="text-lilac-deep">LAB</span></h1>
          <p className="mt-4 font-serif text-[1.65rem] italic leading-tight text-deep sm:text-3xl">Explora la anatomía de la muñeca como nunca antes.</p>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base">Laboratorio virtual de anatomía funcional, estructuras articulares y correlaciones clínicas.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button variant="primary" size="lg" onClick={() => go('explorador-3d')} icon={<Compass className="size-5" />}>COMENZAR EXPLORACIÓN</Button>
            <Button variant="soft" size="lg" onClick={() => go('atlas')}>EXPLORAR ANATOMÍA</Button>
            <Button variant="outline" size="lg" onClick={() => go('evaluacion')}>INICIAR AUTOEVALUACIÓN</Button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }} className="relative mx-auto w-full max-w-[560px]">
          <div className="float">
            <AtlasFigure selected={null} showLabels highlightSurfaces={false} wide viewBox="-100 -14 620 720" onlyLabels={HERO_LABELS} interactive={false} />
          </div>
          <p className="mt-1 text-center text-[11px] text-ink-soft">Esquema original · muñeca derecha · vista palmar</p>
        </motion.div>
      </section>

      <section className="mt-10" aria-label="Módulos principales">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.06 }}>
              <button type="button" onClick={() => go(c.id)} className="group h-full w-full rounded-3xl border border-line bg-warm p-5 text-left shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift active:scale-[0.99]">
                <span className={`grid size-12 place-items-center rounded-2xl ${c.tone}`}>{c.icon}</span>
                <h2 className="mt-4 text-3xl">{c.titulo}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.texto}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-deep">Abrir <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="Cómo usar el laboratorio">
        <Card className="bg-cream"><h3 className="text-2xl">Ocho módulos conectados</h3><p className="mt-2 text-sm text-ink-soft">Cambia de sección cuando quieras desde el menú lateral (escritorio) o la barra inferior (móvil). Tu progreso se guarda en este dispositivo.</p></Card>
        <Card className="bg-cream"><h3 className="text-2xl">Pensado para el teléfono</h3><p className="mt-2 text-sm text-ink-soft">Todos los esquemas responden al toque; el modelo 3D se gira con un dedo y se acerca pellizcando.</p></Card>
        <Card className="bg-cream"><h3 className="text-2xl">Rigor anatómico</h3><p className="mt-2 text-sm text-ink-soft">Dibujos originales, sin imágenes de libros. Los textos se basan en la bibliografía de la asignatura y deben contrastarse con ella.</p></Card>
      </section>
    </div>
  )
}
