import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

/**
 * Contenedor de ilustraciones y visores anatómicos: fondo gris azulado neutro con degradado suave,
 * marco definido y sombra, para que huesos marfil, músculos y vasos resalten con claridad.
 */
export function FigurePanel({ children, className, caption, tone = 'neutral' }: { children: ReactNode; className?: string; caption?: ReactNode; tone?: 'neutral' | 'deep' }) {
  return (
    <figure className={cn('overflow-hidden rounded-3xl border shadow-lift', tone === 'deep' ? 'border-[#9aa6b5]' : 'border-[#c4ccd6]', className)}>
      <div className={cn('plate-bg p-2 sm:p-4', tone === 'deep' && 'plate-bg-deep')}>{children}</div>
      {caption && <figcaption className="border-t border-[#c4ccd6] bg-white/80 px-4 py-2 text-center text-[11.5px] leading-snug text-ink-soft backdrop-blur">{caption}</figcaption>}
    </figure>
  )
}
