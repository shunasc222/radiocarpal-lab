import { useEffect } from 'react'
import { renderPlate, type PlateCfg } from './plate'

/** Ruta oculta usada solo por scripts/render-plates.mjs. */
export default function PlateHarness() {
  useEffect(() => { (window as unknown as { __renderPlate: (c: PlateCfg) => ReturnType<typeof renderPlate> }).__renderPlate = renderPlate; document.body.dataset.plateReady = '1' }, [])
  return <p>plate</p>
}
