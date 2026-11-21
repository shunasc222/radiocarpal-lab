import { AnimatePresence, motion } from 'motion/react'
import { Badge, Card, Field } from './ui'
import type { Structure } from '../../data/structures'

export function StructureCard({ s }: { s: Structure | null }) {
  return (
    <AnimatePresence mode="wait">
      {s ? (
        <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} data-testid="structure-card">
          <Card as="article" aria-live="polite" className="!p-5 border-t-[5px] border-t-sage shadow-lift">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge tone={s.participacion === 'directa' ? 'rose' : 'steel'}>{s.participacion === 'directa' ? 'Participa directamente' : 'Estructura relacionada'}</Badge>
              <Badge tone="sage">{s.grupo}</Badge>
            </div>
            <h2 className="text-[1.9rem] leading-[1.05]">{s.nombre}</h2>
            <p className="mt-2 text-sm italic text-ink-soft">{s.participacionNota}</p>
            <dl className="mt-5 space-y-4">
              <Field label="Ubicación" tone="sage">{s.ubicacion}</Field>
              <Field label="Descripción" tone="rose">{s.descripcion}</Field>
              <Field label="Función" tone="lilac">{s.funcion}</Field>
              <Field label="Relaciones anatómicas" tone="steel">{s.relaciones}</Field>
              <Field label="Importancia clínica" tone="rose">{s.clinica}</Field>
            </dl>
          </Card>
        </motion.div>
      ) : (
        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <Card className="grid min-h-48 place-items-center text-center !p-8">
            <div>
              <p className="font-serif text-2xl text-deep-700">Selecciona una estructura</p>
              <p className="mt-2 text-sm text-ink-soft">Toca el esquema o elige un nombre de la lista para ver su ficha anatómica.</p>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
