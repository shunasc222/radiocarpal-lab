import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Droplets, Zap } from 'lucide-react'
import { Badge, Button, Card, Field, SectionHeader, Tabs, Toggle } from '../components/ui/ui'
import NeuroVascularFigure, { ART, NERVE } from '../components/figure/NeuroVascularFigure'
import { NV_BY_ID, NV_ITEMS, SCAPHOID_VASC, type NVKind } from '../data/neurovascular'
import { PLATES } from '../data/plates.generated'
import { LM } from '../data/landmarks3d'
import { f1, proj } from '../components/figure/plateGeo'
const BASE = import.meta.env.BASE_URL
import { cn } from '../lib/utils'

type Tab = 'vascular' | 'nervioso'

function ScaphoidInset() {
  const [fx, setFx] = useState(false)
  const P = PLATES.scaphoid, z = P.zones.escafoides
  const [px, py] = proj('scaphoid', LM.escafoides.proximalPole[0], LM.escafoides.proximalPole[1], LM.escafoides.proximalPole[2])
  const [tx, ty] = proj('scaphoid', LM.escafoides.tubercle[0], LM.escafoides.tubercle[1], LM.escafoides.tubercle[2])
  const mx = (px + tx) / 2, my = (py + ty) / 2, ax = px - tx, ay = py - ty, len = Math.hypot(ax, ay), ux = ax / len, uy = ay / len
  const nx = -uy, ny = ux, hw = 90
  const half = `M${f1(mx + nx * hw)} ${f1(my + ny * hw)}L${f1(mx - nx * hw)} ${f1(my - ny * hw)}L${f1(mx - nx * hw + ux * 260)} ${f1(my - ny * hw + uy * 260)}L${f1(mx + nx * hw + ux * 260)} ${f1(my + ny * hw + uy * 260)}Z`
  return (
    <Card className="!p-5">
      <h3 className="text-2xl">{SCAPHOID_VASC.titulo}</h3>
      <div className="mt-3 grid items-center gap-4 sm:grid-cols-[240px_1fr]">
        <div>
          <svg viewBox={`0 0 ${P.w} ${P.h}`} role="img" aria-label="Escafoides real con su aporte vascular esquemático y fractura simulada de la cintura" className="mx-auto block w-full max-w-[280px] rounded-2xl bg-cream">
            <defs><clipPath id="sc"><path d={z.d} fillRule="evenodd" /></clipPath></defs>
            <image href={`${BASE}atlas/scaphoid.webp`} x="0" y="0" width={P.w} height={P.h} />
            <g clipPath="url(#sc)"><path d={half} fill="#4b5563" opacity={fx ? 0.6 : 0} style={{ transition: 'opacity .4s' }} /></g>
            <path d={`M${f1(tx - ux * 6 + nx * 22)} ${f1(ty - uy * 6 + ny * 22)}C${f1(mx + nx * 30)} ${f1(my + ny * 30)} ${f1(mx + ux * 40 + nx * 24)} ${f1(my + uy * 40 + ny * 24)} ${f1(px - ux * 14 + nx * 8)} ${f1(py - uy * 14 + ny * 8)}`} stroke={ART} strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="8 7" />
            {fx && <path d={`M${f1(mx + nx * hw)} ${f1(my + ny * hw)}L${f1(mx - nx * hw)} ${f1(my - ny * hw)}`} stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />}
            <text x={f1(px - 50)} y={f1(py - 34)} fontSize="15" fontWeight="700" fill="#303542" stroke="#faf7f2" strokeWidth="3" paintOrder="stroke">polo proximal</text>
            <text x={f1(tx - 10)} y={f1(ty + 44)} fontSize="14" fontWeight="700" fill="#a8587a" stroke="#faf7f2" strokeWidth="3" paintOrder="stroke">rama de la a. radial (esquema)</text>
          </svg>
          <Toggle pressed={fx} tone="rose" onClick={() => setFx((v) => !v)} className="mt-2 w-full justify-center">{fx ? 'Fractura simulada' : 'Simular fractura de la cintura'}</Toggle>
        </div>
        <div>
          <ul className="space-y-2 text-[15px] leading-relaxed">
            {SCAPHOID_VASC.puntos.map((p) => <li key={p} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-rose-deep" />{p}</li>)}
          </ul>
          {fx && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 rounded-xl bg-rose/40 p-3 text-sm font-medium text-rose-deep" data-testid="scaphoid-warning">El fragmento proximal (en gris) pierde su irrigación: riesgo de necrosis avascular y pseudoartrosis.</motion.p>}
          <p className="mt-3 text-xs text-ink-soft">{SCAPHOID_VASC.nota} Hueso: BodyParts3D (CC BY 4.0); el trayecto vascular es esquemático.</p>
        </div>
      </div>
    </Card>
  )
}

export default function Neurovascular() {
  const [tab, setTab] = useState<Tab>('vascular')
  const [sel, setSel] = useState<string | null>(null)
  const [hidden, setHidden] = useState({ arteria: false, nervio: true })
  const kind: NVKind = tab === 'vascular' ? 'arteria' : 'nervio'
  const changeTab = (t: Tab) => {
    setTab(t)
    setHidden({ arteria: t === 'nervioso' ? true : false, nervio: t === 'vascular' ? true : false })
    if (sel && NV_BY_ID[sel].kind !== (t === 'vascular' ? 'arteria' : 'nervio')) setSel(null)
  }
  const toggleKind = (k: NVKind) => setHidden((h) => ({ ...h, [k]: !h[k] }))
  const it = sel ? NV_BY_ID[sel] : null
  const items = NV_ITEMS.filter((n) => n.kind === kind)

  return (
    <div>
      <SectionHeader n={6} eyebrow="Vascularización e inervación" title="Vasos y nervios de la muñeca"
        lead="Las arterias se muestran en rojo y los nervios en amarillo. Los trayectos punteados son profundos o dorsales. Selecciona un elemento para ver su territorio y su relevancia clínica." />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs<Tab> label="Sistema" value={tab} onChange={changeTab} items={[
          { id: 'vascular', label: 'Sistema vascular', icon: <Droplets className="size-4" /> },
          { id: 'nervioso', label: 'Sistema nervioso', icon: <Zap className="size-4" /> },
        ]} />
        <div className="flex gap-2" role="group" aria-label="Mostrar capas">
          <Toggle pressed={!hidden.arteria} tone="rose" onClick={() => toggleKind('arteria')}><span className="size-2.5 rounded-full" style={{ background: ART }} aria-hidden />Arterias</Toggle>
          <Toggle pressed={!hidden.nervio} tone="lilac" onClick={() => toggleKind('nervio')}><span className="size-2.5 rounded-full" style={{ background: NERVE }} aria-hidden />Nervios</Toggle>
          <Button variant="ghost" size="sm" onClick={() => { setSel(null); setHidden({ arteria: tab === 'nervioso', nervio: tab === 'vascular' }) }}>Restablecer</Button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="min-w-0 space-y-4">
          <Card className="!p-3"><div className="mx-auto max-w-md"><NeuroVascularFigure selected={sel} onSelect={setSel} hidden={hidden} /></div></Card>
          <ul className="flex flex-wrap gap-2" aria-label={tab === 'vascular' ? 'Lista de arterias' : 'Lista de nervios'}>
            {items.map((n) => (
              <li key={n.id}>
                <button type="button" aria-pressed={sel === n.id} onClick={() => { setSel(n.id); setHidden((h) => ({ ...h, [n.kind]: false })) }}
                  className={cn('inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-sm transition-colors', sel === n.id ? 'border-deep bg-deep text-white' : 'border-line bg-warm hover:border-sage')}>
                  <span className="grid size-5 place-items-center rounded-full text-[10px] font-bold text-white" style={{ background: n.kind === 'arteria' ? ART : NERVE }}>{n.num}</span>{n.nombre}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 space-y-4">
          <AnimatePresence mode="wait">
            {it ? (
              <motion.div key={it.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="nv-card">
                <Card as="article" className="!p-5">
                  <div className="mb-3 flex flex-wrap gap-2"><Badge tone={it.kind === 'arteria' ? 'rose' : 'lilac'}>{it.kind === 'arteria' ? 'Arteria' : 'Nervio'}</Badge><Badge tone="sage">{it.plano}</Badge></div>
                  <h2 className="text-[1.8rem] leading-tight">{it.nombre}</h2>
                  <dl className="mt-5 space-y-4">
                    <Field label="Origen" tone="sage">{it.origen}</Field>
                    <Field label="Trayecto" tone="rose">{it.trayecto}</Field>
                    <Field label="Relación con la muñeca" tone="lilac">{it.relacionMuneca}</Field>
                    <Field label={it.kind === 'arteria' ? 'Territorio irrigado' : 'Territorio y función'} tone="steel">{it.territorio}</Field>
                    {it.kind === 'nervio' && (
                      <div className="rounded-2xl bg-cream p-4">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-deep">Tipos de inervación (diferenciados)</p>
                        <dl className="space-y-3">
                          <Field label="Motora (músculos)" tone="rose">{it.motora}</Field>
                          <Field label="Sensibilidad cutánea regional" tone="lilac">{it.cutanea}</Field>
                          <Field label="Inervación articular" tone="steel">{it.articular}</Field>
                        </dl>
                      </div>
                    )}
                    <Field label="Relación con síntomas o consecuencias clínicas" tone="rose">{it.clinica}</Field>
                  </dl>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="e" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Card className="grid min-h-48 place-items-center text-center"><div><p className="font-serif text-2xl text-deep-700">Selecciona un vaso o un nervio</p><p className="mt-2 text-sm text-ink-soft">Toca un trazo del esquema o un elemento de la lista.</p></div></Card>
              </motion.div>
            )}
          </AnimatePresence>
          {tab === 'nervioso' && (
            <Card className="border-lilac bg-lilac/10 !p-4 text-sm">
              <strong>Precisión:</strong> no todos estos nervios inervan la cápsula radiocarpiana de la misma manera. La inervación articular está mejor documentada para el nervio interóseo posterior (dorsal) y el interóseo anterior (palmar); los demás aportes son variables.
            </Card>
          )}
        </div>
      </div>
      {tab === 'vascular' && <div className="mt-8"><ScaphoidInset /></div>}
    </div>
  )
}
