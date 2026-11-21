import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export function LabelSprite({ text, position, active }: { text: string; position: [number, number, number]; active: boolean }) {
  const { texture, aspect } = useMemo(() => {
    const c = document.createElement('canvas'), ctx = c.getContext('2d')!
    const font = '600 38px system-ui, -apple-system, sans-serif'
    ctx.font = font
    const w = Math.ceil(ctx.measureText(text).width) + 40
    c.width = w; c.height = 64
    ctx.font = font
    ctx.fillStyle = active ? '#536b5a' : 'rgba(255,255,255,0.93)'
    ctx.strokeStyle = '#a9b89a'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.roundRect(2, 2, w - 4, 60, 30); ctx.fill(); ctx.stroke()
    ctx.fillStyle = active ? '#ffffff' : '#303542'; ctx.textBaseline = 'middle'; ctx.fillText(text, 20, 34)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
    return { texture: t, aspect: w / 64 }
  }, [text, active])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <sprite position={position} scale={[aspect * 0.5, 0.5, 1]} renderOrder={20}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}
