import { createContext, useCallback, useContext, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Award, X } from 'lucide-react'
import { cn } from '../../lib/utils'

/* ───────── Botón ───────── */
type Variant = 'primary' | 'soft' | 'ghost' | 'outline'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> { variant?: Variant; icon?: ReactNode; size?: 'md' | 'lg' | 'sm' }

export function Button({ variant = 'soft', icon, size = 'md', className, children, ...rest }: BtnProps) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none select-none'
  const sizes = { sm: 'min-h-10 px-4 text-sm', md: 'min-h-11 px-5 text-sm', lg: 'min-h-14 px-7 text-[15px] tracking-wide' }
  const variants: Record<Variant, string> = {
    primary: 'bg-deep text-white shadow-soft hover:bg-deep-700 hover:shadow-lift',
    soft: 'bg-warm text-deep-700 border border-line hover:border-sage hover:bg-cream shadow-soft',
    ghost: 'text-deep-700 hover:bg-deep/10',
    outline: 'border border-deep/40 text-deep-700 hover:bg-deep/10',
  }
  return (
    <button type="button" className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {icon}
      {children}
    </button>
  )
}

/* ───────── Interruptor / chip ───────── */
export function Toggle({ pressed, onClick, children, icon, tone = 'deep', title, className }: {
  pressed: boolean; onClick: () => void; children: ReactNode; icon?: ReactNode; tone?: 'deep' | 'rose' | 'lilac' | 'steel'; title?: string; className?: string
}) {
  const on = { deep: 'bg-deep text-white border-deep', rose: 'bg-rose text-ink border-rose-deep/40', lilac: 'bg-lilac text-ink border-lilac-deep/50', steel: 'bg-steel text-ink border-steel-deep/50' }[tone]
  return (
    <button
      type="button" aria-pressed={pressed} title={title} onClick={onClick}
      className={cn('inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all active:scale-[0.97]', pressed ? on : 'bg-warm border-line text-ink-soft hover:border-sage', className)}
    >
      {icon}{children}
    </button>
  )
}

/* ───────── Tarjetas y encabezados ───────── */
export function Card({ className, children, as: Tag = 'div', ...rest }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' } & React.HTMLAttributes<HTMLElement>) {
  return <Tag className={cn('rounded-3xl border border-line bg-warm p-5 shadow-soft sm:p-6', className)} {...rest}>{children}</Tag>
}

export function SectionHeader({ n, eyebrow, title, lead, children }: { n?: number; eyebrow?: string; title: string; lead?: string; children?: ReactNode }) {
  return (
    <header className="mb-6 sm:mb-8">
      <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-deep">
        {n !== undefined && <span className="grid size-6 place-items-center rounded-full bg-sage/40 text-[11px]">{n}</span>}
        {eyebrow}
      </p>
      <h1 tabIndex={-1} id="main-heading" className="text-[2.1rem] sm:text-5xl outline-none">{title}</h1>
      {lead && <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-ink-soft sm:text-base">{lead}</p>}
      {children}
    </header>
  )
}

export function Field({ label, children, tone }: { label: string; children: ReactNode; tone?: 'rose' | 'lilac' | 'steel' | 'sage' }) {
  const bar = { rose: 'bg-rose', lilac: 'bg-lilac', steel: 'bg-steel', sage: 'bg-sage' }[tone ?? 'sage']
  return (
    <div className="relative pl-4">
      <span className={cn('absolute inset-y-1 left-0 w-1 rounded-full', bar)} aria-hidden />
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-deep">{label}</dt>
      <dd className="mt-0.5 text-[15px] leading-relaxed text-ink">{children}</dd>
    </div>
  )
}

export function Badge({ children, tone = 'sage' }: { children: ReactNode; tone?: 'sage' | 'rose' | 'lilac' | 'steel' }) {
  const t = { sage: 'bg-sage/30 text-deep-700', rose: 'bg-rose/60 text-rose-deep', lilac: 'bg-lilac/50 text-lilac-deep', steel: 'bg-steel/60 text-steel-deep' }[tone]
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold', t)}>{children}</span>
}

/** Pestañas accesibles. */
export function Tabs<T extends string>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: { id: T; label: string; icon?: ReactNode }[]; label: string }) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-warm p-1 shadow-soft">
      {items.map((it) => (
        <button
          key={it.id} role="tab" type="button" aria-selected={value === it.id} onClick={() => onChange(it.id)}
          className={cn('inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors', value === it.id ? 'bg-deep text-white' : 'text-ink-soft hover:bg-cream')}
        >
          {it.icon}{it.label}
        </button>
      ))}
    </div>
  )
}

/** Tooltip accesible (hover y foco) para controles con icono. */
export function Tip({ text, children }: { text: string; children: ReactNode }) {
  return (
    <span className="group relative inline-flex">
      {children}
      <span role="tooltip" className="pointer-events-none absolute -top-9 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-xs text-white shadow-lift group-hover:block group-focus-within:block">{text}</span>
    </span>
  )
}

/* ───────── Mensajes de logro ───────── */
interface ToastCtx { toast: (msg: string) => void }
const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [msg, setMsg] = useState<{ id: number; text: string } | null>(null)
  const toast = useCallback((text: string) => {
    const id = Date.now()
    setMsg({ id, text })
    window.setTimeout(() => setMsg((m) => (m && m.id === id ? null : m)), 3800)
  }, [])
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 lg:bottom-8">
        <AnimatePresence>
          {msg && (
            <motion.div
              key={msg.id} initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }}
              className="pointer-events-auto flex items-center gap-3 rounded-full border border-sage bg-warm py-2.5 pl-4 pr-2 text-sm font-medium text-deep-700 shadow-lift"
            >
              <Award className="size-5 text-lilac-deep" aria-hidden />
              {msg.text}
              <button type="button" aria-label="Cerrar mensaje" className="grid size-8 place-items-center rounded-full hover:bg-cream" onClick={() => setMsg(null)}><X className="size-4" /></button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={value} className="h-2 w-full overflow-hidden rounded-full bg-sage/25">
      <motion.div className="h-full rounded-full bg-gradient-to-r from-sage to-deep" initial={false} animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
    </div>
  )
}
