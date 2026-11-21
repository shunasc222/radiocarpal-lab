import { lazy, Suspense } from 'react'
import { Shell } from './components/layout/Shell'
import { ToastProvider } from './components/ui/ui'
import { useRoute } from './lib/nav'
import Home from './sections/Home'
import Atlas from './sections/Atlas'
import Ligaments from './sections/Ligaments'
import Myology from './sections/Myology'
import Neurovascular from './sections/Neurovascular'
import Cases from './sections/Cases'
import Assessment from './sections/Assessment'

const PlateHarness = lazy(() => import('./dev/PlateHarness'))
const Explorer3D = lazy(() => import('./sections/Explorer3D'))

export default function App() {
  const { section, go, visited } = useRoute()
  if (window.location.hash.startsWith('#/__plate')) return <Suspense fallback={null}><PlateHarness /></Suspense>
  return (
    <ToastProvider>
      <Shell section={section} go={go} visited={visited}>
        {section === 'inicio' && <Home go={go} />}
        {section === 'atlas' && <Atlas />}
        {section === 'explorador-3d' && <Suspense fallback={<p role="status" className="p-8 text-center text-ink-soft">Cargando explorador 3D…</p>}><Explorer3D go={go} /></Suspense>}
        {section === 'ligamentos' && <Ligaments />}
        {section === 'miologia' && <Myology />}
        {section === 'neurovascular' && <Neurovascular />}
        {section === 'casos' && <Cases go={go} />}
        {section === 'evaluacion' && <Assessment />}
      </Shell>
    </ToastProvider>
  )
}
