import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bone, Box, ClipboardCheck, Home, Link2, Menu, Activity, Stethoscope, Waypoints, X } from 'lucide-react'
import { SECTIONS, type SectionId } from '../../lib/nav'
import { ProgressBar } from '../ui/ui'
import { cn } from '../../lib/utils'

const ICONS: Record<SectionId, ReactNode> = {
  inicio: <Home className="size-5" />,
  atlas: <Bone className="size-5" />,
  'explorador-3d': <Box className="size-5" />,
  ligamentos: <Link2 className="size-5" />,
  miologia: <Activity className="size-5" />,
  neurovascular: <Waypoints className="size-5" />,
  casos: <Stethoscope className="size-5" />,
  evaluacion: <ClipboardCheck className="size-5" />,
}

const BOTTOM: SectionId[] = ['inicio', 'atlas', 'explorador-3d', 'casos']

function Logo({ compact }: { compact?: boolean }) {
  return (
    <a href="#/inicio" className="flex items-center gap-3" aria-label="RADIOCARPAL LAB — ir al inicio">
      <img src="./favicon.svg" alt="" className="size-10 rounded-xl shadow-soft" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-serif text-[1.35rem] font-semibold tracking-wide text-deep-700">RADIOCARPAL LAB</span>
          <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.2em] text-ink-soft">PUCE Santo Domingo</span>
        </span>
      )}
    </a>
  )
}

export function Shell({ section, go, visited, children }: { section: SectionId; go: (id: SectionId) => void; visited: SectionId[]; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  useEffect(() => { setOpen(false) }, [section])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navList = (onPick?: () => void) => (
    <ul className="space-y-1">
      {SECTIONS.map((s) => {
        const active = s.id === section
        return (
          <li key={s.id}>
            <a
              href={`#/${s.id}`} aria-current={active ? 'page' : undefined} onClick={onPick}
              className={cn('group flex min-h-12 items-center gap-3 rounded-2xl px-3 py-2 transition-colors', active ? 'bg-deep text-white shadow-soft' : 'text-ink hover:bg-sage/20')}
            >
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-xl', active ? 'bg-white/15' : 'bg-cream text-deep')}>{ICONS[s.id]}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-medium leading-tight">{s.n}. {s.titulo}</span>
                <span className={cn('block truncate text-[11.5px]', active ? 'text-white/75' : 'text-ink-soft')}>{s.descripcion}</span>
              </span>
              {visited.includes(s.id) && !active && <span aria-label="visitado" className="size-2 rounded-full bg-sage" />}
            </a>
          </li>
        )
      })}
    </ul>
  )

  return (
    <div className="paper min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-deep focus:px-4 focus:py-2 focus:text-white">Saltar al contenido</a>

      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[19rem] flex-col border-r border-line bg-warm/80 p-5 backdrop-blur lg:flex">
        <Logo />
        <p className="mt-4 text-xs leading-relaxed text-ink-soft">Laboratorio virtual de anatomía, biomecánica y correlación clínica de la muñeca.</p>
        <nav aria-label="Secciones" className="mt-6 flex-1 overflow-y-auto pr-1">{navList()}</nav>
        <div className="mt-4 rounded-2xl bg-cream p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-medium text-deep-700">
            <span>Progreso de exploración</span><span>{visited.length}/{SECTIONS.length}</span>
          </div>
          <ProgressBar value={visited.length} max={SECTIONS.length} label="Módulos explorados" />
        </div>
      </aside>

      {/* Barra superior (móvil y tableta) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-cream/90 px-4 py-2.5 backdrop-blur lg:hidden" style={{ paddingTop: 'max(0.625rem, env(safe-area-inset-top))' }}>
        <Logo />
        <button type="button" aria-label="Abrir menú de secciones" aria-expanded={open} onClick={() => setOpen(true)} className="grid size-11 place-items-center rounded-full border border-line bg-warm shadow-soft">
          <Menu className="size-5 text-deep-700" />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-50 lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="dialog" aria-modal="true" aria-label="Menú de secciones">
            <button type="button" aria-label="Cerrar menú" className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} />
            <motion.div initial={{ y: 60 }} animate={{ y: 0 }} exit={{ y: 60 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }} className="absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-[2rem] bg-cream p-5 pb-8 shadow-lift">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-2xl">Secciones</h2>
                <button type="button" aria-label="Cerrar" onClick={() => setOpen(false)} className="grid size-11 place-items-center rounded-full bg-warm shadow-soft"><X className="size-5" /></button>
              </div>
              <nav aria-label="Todas las secciones">{navList(() => setOpen(false))}</nav>
              <div className="mt-4 rounded-2xl bg-warm p-4">
                <div className="mb-2 flex justify-between text-xs font-medium text-deep-700"><span>Progreso</span><span>{visited.length}/{SECTIONS.length}</span></div>
                <ProgressBar value={visited.length} max={SECTIONS.length} label="Módulos explorados" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main id="main" className="mx-auto w-full max-w-[1180px] px-4 pb-32 pt-6 sm:px-6 sm:pt-8 lg:ml-[19rem] lg:w-[calc(100%-19rem)] lg:max-w-none lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-[1100px]">{children}</div>
        <footer className="mx-auto mt-16 max-w-[1100px] border-t border-dashed border-line pt-6 text-xs leading-relaxed text-ink-soft">
          <p><strong className="font-semibold text-deep-700">RADIOCARPAL LAB</strong> · PUCE Santo Domingo · Medicina · Morfofunción Osteomuscular. Recurso educativo complementario. Las ilustraciones son esquemas didácticos originales; el contenido debe contrastarse con la bibliografía indicada.</p>
        </footer>
      </main>

      {/* Navegación inferior táctil (móvil y tableta) */}
      <nav aria-label="Navegación rápida" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-warm/95 backdrop-blur lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <ul className="mx-auto grid max-w-xl grid-cols-5">
          {BOTTOM.map((id) => {
            const s = SECTIONS.find((x) => x.id === id)!
            const active = section === id
            return (
              <li key={id}>
                <button type="button" aria-current={active ? 'page' : undefined} onClick={() => go(id)} className={cn('flex min-h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium', active ? 'text-deep-700' : 'text-ink-soft')}>
                  <span className={cn('grid h-7 w-12 place-items-center rounded-full transition-colors', active && 'bg-sage/40')}>{ICONS[id]}</span>
                  {s.corto}
                </button>
              </li>
            )
          })}
          <li>
            <button type="button" aria-label="Más secciones" onClick={() => setOpen(true)} className={cn('flex min-h-16 w-full flex-col items-center justify-center gap-1 text-[11px] font-medium', !BOTTOM.includes(section) ? 'text-deep-700' : 'text-ink-soft')}>
              <span className={cn('grid h-7 w-12 place-items-center rounded-full', !BOTTOM.includes(section) && 'bg-sage/40')}><Menu className="size-5" /></span>
              Más
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
