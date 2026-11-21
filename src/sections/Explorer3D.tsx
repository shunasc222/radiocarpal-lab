import { lazy, Suspense, useCallback, useMemo, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { AlertTriangle, ArrowRight, ChevronDown, Eye, EyeOff, Move3d, RotateCcw, Tag } from 'lucide-react'
import { Badge, Button, Card, Field, SectionHeader, Toggle } from '../components/ui/ui'
import { LAYERS, type LayerId, type ViewName } from '../components/viewer3d/config'
import { LAYER_ITEMS, LAYER_OF, describe3D } from '../components/viewer3d/info3d'
import { webglAvailable } from '../components/viewer3d/webgl'
import type { SceneState } from '../components/viewer3d/Scene3D'
import type { SectionId } from '../lib/nav'
import { cn } from '../lib/utils'

const Scene3D = lazy(() => import('../components/viewer3d/Scene3D'))

const VIEW_BUTTONS: { id: ViewName; label: string }[] = [
  { id: 'palmar', label: 'Vista palmar' }, { id: 'dorsal', label: 'Vista dorsal' }, { id: 'radial', label: 'Vista radial' }, { id: 'ulnar', label: 'Vista ulnar' },
]
type LayerState = SceneState['layers']
const INITIAL: LayerState = {
  osteologia: { on: true, opacity: 1 }, superficies: { on: true, opacity: 0.8 }, ligamentos: { on: false, opacity: 1 }, miologia: { on: false, opacity: 0.9 }, neurovascular: { on: false, opacity: 1 },
}

function LoadingOverlay() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div role="status" className="absolute inset-0 z-10 grid place-items-center bg-cream/70 backdrop-blur-sm">
      <div className="text-center"><div className="mx-auto mb-3 size-10 animate-spin rounded-full border-4 border-sage/40 border-t-deep" /><p className="text-sm font-medium text-deep-700">Cargando modelo anatómico… {Math.round(progress)} %</p></div>
    </div>
  )
}

export default function Explorer3D({ go }: { go: (id: SectionId) => void }) {
  const [ok] = useState(() => webglAvailable())
  const [layers, setLayers] = useState<LayerState>(INITIAL)
  const [hidden, setHidden] = useState<ReadonlySet<string>>(new Set())
  const [selected, setSelected] = useState<string | null>(null)
  const [view, setView] = useState<{ name: ViewName; nonce: number }>({ name: 'inicial', nonce: 0 })
  const [labels, setLabels] = useState(false)
  const [explode, setExplode] = useState(0)
  const [open, setOpen] = useState<LayerId | null>('osteologia')

  const setLayer = useCallback((id: LayerId, patch: Partial<LayerState[LayerId]>) => setLayers((l) => ({ ...l, [id]: { ...l[id], ...patch } })), [])
  const select = useCallback((id: string | null) => {
    setSelected(id)
    if (id) {
      const l = LAYER_OF[id]
      if (l) setLayers((ls) => (ls[l].on ? ls : { ...ls, [l]: { ...ls[l], on: true } }))
      setHidden((h) => { if (!h.has(id)) return h; const n = new Set(h); n.delete(id); return n })
    }
  }, [])
  const toggleItem = (id: string) => setHidden((h) => { const n = new Set(h); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const solo = (id: LayerId) => setLayers((l) => Object.fromEntries((Object.keys(l) as LayerId[]).map((k) => [k, { ...l[k], on: k === id }])) as LayerState)
  const goView = (name: ViewName) => setView((v) => ({ name, nonce: v.nonce + 1 }))
  const reset = () => { setLayers(INITIAL); setHidden(new Set()); setSelected(null); setExplode(0); setLabels(false); goView('inicial') }

  const state: SceneState = useMemo(() => ({ layers, hidden, selected, labels, labelLayer: open, explode, view, onSelect: select }), [layers, hidden, selected, labels, open, explode, view, select])
  const card = selected ? describe3D(selected) : null
  const activeCount = (Object.values(layers) as { on: boolean }[]).filter((l) => l.on).length

  return (
    <div>
      <SectionHeader n={3} eyebrow="Explorador anatómico 3D" title="La región radiocarpiana por capas"
        lead="Modelo tridimensional con huesos y músculos reales de BodyParts3D. Gira con un dedo o el ratón, acerca pellizcando y toca una estructura para ver su ficha." />

      {/* Capas: accesibles desde el inicio */}
      <div role="group" aria-label="Capas anatómicas" className="mb-4 flex flex-wrap gap-2">
        {LAYERS.map((l) => (
          <Toggle key={l.id} pressed={layers[l.id].on} onClick={() => setLayer(l.id, { on: !layers[l.id].on })} className="!pl-3">
            <span className="grid size-5 place-items-center rounded-full border border-black/10 text-[10px] font-bold text-ink" style={{ background: l.color }} aria-hidden>{l.n}</span>
            <span className="hidden sm:inline">{l.nombre}</span><span className="sm:hidden">{l.corto}</span>
          </Toggle>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.45fr_1fr]">
        <div className="min-w-0 space-y-4">
          <Card className="relative overflow-hidden !p-0">
            {ok ? (
              <div className="relative h-[62dvh] min-h-[380px] max-h-[760px] w-full bg-[radial-gradient(ellipse_at_50%_28%,#f8fafc_0%,#e4e9ef_52%,#c3ccd8_100%)]" data-testid="canvas-wrap">
                <Suspense fallback={<div className="grid h-full place-items-center text-sm text-ink-soft" role="status">Cargando visor 3D…</div>}>
                  <Scene3D state={state} />
                </Suspense>
                <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[16%] bg-gradient-to-b from-[#edf1f5] to-transparent" />
                <LoadingOverlay />
                <div className="pointer-events-none absolute left-3 top-3 flex gap-2"><span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-ink-soft shadow-soft backdrop-blur">Mano derecha · {activeCount} capa{activeCount === 1 ? '' : 's'}</span></div>
                {card && <button type="button" onClick={() => document.getElementById('card3d')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="absolute right-3 top-3 max-w-[60%] truncate rounded-full bg-deep px-3.5 py-2 text-xs font-semibold text-white shadow-lift lg:hidden">Ver ficha: {card.title}</button>}
                <p className="pointer-events-none absolute bottom-2 left-1/2 w-[92%] -translate-x-1/2 text-center text-[10.5px] leading-tight text-ink-soft">Huesos y músculos: BodyParts3D © DBCLS, CC BY 4.0 · Ligamentos, disco, vasos y nervios: esquemáticos</p>
              </div>
            ) : (
              <div className="grid min-h-72 place-items-center p-8 text-center" role="alert">
                <div>
                  <p className="font-serif text-2xl text-deep-700">Tu dispositivo no puede mostrar gráficos 3D (WebGL)</p>
                  <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">Usa la alternativa 2D: el atlas interactivo contiene las mismas estructuras con fichas anatómicas completas.</p>
                  <Button variant="primary" className="mt-4" onClick={() => go('atlas')} icon={<ArrowRight className="size-4" />}>Abrir el atlas 2D</Button>
                </div>
              </div>
            )}
          </Card>

          <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Vistas del modelo">
            {VIEW_BUTTONS.map((v) => <Button key={v.id} variant="soft" size="sm" onClick={() => goView(v.id)}>{v.label}</Button>)}
          </div>
          <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Opciones de visualización">
            <Toggle pressed={labels} onClick={() => setLabels((v) => !v)} icon={<Tag className="size-4" />} title="Muestra las etiquetas de la capa abierta en el panel">Etiquetas</Toggle>
            <Toggle pressed={explode > 0.05} onClick={() => setExplode((e) => (e > 0.05 ? 0 : 1))} tone="lilac" icon={<Move3d className="size-4" />}>Separar estructuras</Toggle>
            <Button variant="outline" size="sm" onClick={reset} icon={<RotateCcw className="size-4" />}>Restablecer modelo</Button>
          </div>
          <label className="flex max-w-lg items-center gap-3 rounded-2xl border border-line bg-warm px-4 py-2 text-sm font-medium text-deep-700">
            Separación
            <input type="range" min={0} max={100} value={Math.round(explode * 100)} onChange={(e) => setExplode(Number(e.target.value) / 100)} className="h-9 flex-1 accent-[#536b5a]" aria-label="Grado de separación de estructuras" />
          </label>

        </div>

        <div className="min-w-0 space-y-4">
          <div id="card3d" className="scroll-mt-20"><AnimatedCard card={card} onClose={() => setSelected(null)} /></div>

          <Card className="!p-4" aria-label="Panel de capas">
            <h2 className="mb-3 text-2xl">Capas</h2>
            <ul className="space-y-2">
              {LAYERS.map((l) => {
                const st = layers[l.id], isOpen = open === l.id
                return (
                  <li key={l.id} className={cn('rounded-2xl border transition-colors', st.on ? 'border-sage bg-cream' : 'border-line bg-warm')}>
                    <div className="flex items-center gap-2 p-2">
                      <button type="button" aria-pressed={st.on} aria-label={`${st.on ? 'Ocultar' : 'Mostrar'} capa ${l.nombre}`} onClick={() => setLayer(l.id, { on: !st.on })} className="grid size-11 shrink-0 place-items-center rounded-xl border border-line bg-warm">
                        {st.on ? <Eye className="size-5 text-deep" /> : <EyeOff className="size-5 text-ink-soft" />}
                      </button>
                      <button type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : l.id)} className="flex min-h-11 min-w-0 flex-1 items-center gap-2 text-left">
                        <span className="h-9 w-2.5 shrink-0 rounded-full border border-black/10" style={{ background: l.color }} aria-hidden />
                        <span className="min-w-0 flex-1"><span className="block text-[14px] font-semibold leading-tight">{l.n}. {l.nombre}</span><span className="block truncate text-[11.5px] text-ink-soft">{l.descripcion}</span></span>
                        <ChevronDown className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')} />
                      </button>
                    </div>
                    {isOpen && (
                      <div className="border-t border-line/70 p-3">
                        <label className="flex items-center gap-3 text-xs font-medium text-deep-700">
                          Transparencia
                          <input type="range" min={10} max={100} value={Math.round(st.opacity * 100)} onChange={(e) => setLayer(l.id, { opacity: Number(e.target.value) / 100 })} className="h-9 flex-1 accent-[#536b5a]" aria-label={`Opacidad de ${l.nombre}`} />
                          <span className="w-9 text-right tabular-nums">{Math.round(st.opacity * 100)}%</span>
                        </label>
                        <div className="mt-2 flex justify-end"><button type="button" onClick={() => solo(l.id)} className="min-h-9 rounded-full px-3 text-xs font-semibold text-deep hover:bg-sage/20">Solo esta capa</button></div>
                        <ul className="mt-1 flex flex-wrap gap-1.5">
                          {LAYER_ITEMS[l.id].map((it) => (
                            <li key={it.id} className="flex overflow-hidden rounded-full border border-line bg-warm">
                              <button type="button" aria-pressed={selected === it.id} onClick={() => select(it.id)} className={cn('min-h-10 px-3 text-[13px]', selected === it.id ? 'bg-deep text-white' : 'hover:bg-cream')}>{it.name}</button>
                              <button type="button" aria-label={`${hidden.has(it.id) ? 'Mostrar' : 'Ocultar'} ${it.name}`} aria-pressed={hidden.has(it.id)} onClick={() => toggleItem(it.id)} className="grid min-h-10 w-10 place-items-center border-l border-line text-ink-soft hover:bg-cream">
                                {hidden.has(it.id) ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                              </button>
                            </li>
                          ))}
                        </ul>
                        {l.id === 'superficies' && <p className="mt-2 text-xs text-ink-soft">El tinte azul se aplica a las superficies articulares del radio, la ulna y la fila proximal del carpo; el disco se muestra como pieza independiente.</p>}
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
          </Card>
          <div role="note" className="flex gap-3 rounded-2xl border border-lilac bg-lilac/15 p-4 text-[13px] leading-relaxed text-ink">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-lilac-deep" aria-hidden />
            <div>
              <p><strong>Qué es real y qué es esquemático.</strong> Los <em>huesos</em>, los <em>músculos</em> (flexor radial del carpo, palmar largo, extensores radiales largo y corto y extensor ulnar), el <em>retináculo flexor</em> y la <em>membrana interósea</em> son mallas reales de BodyParts3D 4.0. El <em>disco articular</em>, los <em>ligamentos</em>, el <em>flexor ulnar del carpo</em> y los <em>vasos y nervios</em> no existen en ese conjunto de datos: se dibujan de forma esquemática sobre la superficie de los huesos reales, con inserciones y recorridos aproximados. El tinte azul del cartílago es una delimitación aproximada derivada de la geometría.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatedCard({ card, onClose }: { card: ReturnType<typeof describe3D>; onClose: () => void }) {
  if (!card) {
    return <Card className="grid min-h-40 place-items-center text-center" data-testid="structure-card-empty"><div><p className="font-serif text-2xl text-deep-700">Selecciona una estructura</p><p className="mt-2 text-sm text-ink-soft">Toca el modelo o elige un elemento en el panel de capas.</p></div></Card>
  }
  return (
    <Card as="article" className="!p-5 border-t-[5px] border-t-sage shadow-lift" data-testid="structure-card" key={card.id}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {card.badges.map((b) => <Badge key={b.text} tone={b.tone}>{b.text}</Badge>)}
        <Badge tone={card.provenance === 'real' ? 'sage' : 'lilac'}>{card.provenance === 'real' ? 'Malla real' : 'Esquemático'}</Badge>
      </div>
      <h2 className="text-[1.8rem] leading-tight">{card.title}</h2>
      <dl className="mt-4 space-y-3.5">{card.fields.map((f) => <Field key={f.label} label={f.label} tone={f.tone}>{f.text}</Field>)}</dl>
      {card.note && <p className="mt-4 rounded-xl bg-cream p-3 text-xs leading-relaxed text-ink-soft">{card.note}</p>}
      <button type="button" onClick={onClose} className="mt-3 min-h-10 text-xs font-semibold text-deep underline underline-offset-2">Quitar selección</button>
    </Card>
  )
}
