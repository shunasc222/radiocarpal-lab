import { useEffect, useMemo } from 'react'
import * as THREE from 'three'

export function LabelSprite({ text, position, active }: { text: string; position: [number, number, number]; active: boolean }) {
  const { texture, aspect } = useMemo(() => {
    const c = document.createElement('canvas'), ctx = c.getContext('2d')!
    const font = '600 30px system-ui, -apple-system, "Segoe UI", sans-serif'
    ctx.font = font
    const w = Math.ceil(ctx.measureText(text).width) + 44, h = 56
    c.width = w + 8; c.height = h + 14
    ctx.font = font
    ctx.shadowColor = 'rgba(30,40,60,0.35)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 3
    ctx.fillStyle = active ? '#3f5446' : 'rgba(255,255,255,0.96)'
    ctx.beginPath(); ctx.roundRect(4, 4, w, h, 28); ctx.fill()
    ctx.shadowColor = 'transparent'
    ctx.strokeStyle = active ? '#3f5446' : '#b9c3cf'; ctx.lineWidth = 2; ctx.stroke()
    ctx.fillStyle = active ? '#a9b89a' : '#7a64a3'; ctx.beginPath(); ctx.arc(24, 4 + h / 2, 6, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = active ? '#ffffff' : '#2b3140'; ctx.textBaseline = 'middle'; ctx.fillText(text, 38, 4 + h / 2 + 1)
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4
    return { texture: t, aspect: (w + 8) / (h + 14) }
  }, [text, active])
  useEffect(() => () => texture.dispose(), [texture])
  return (
    <sprite position={position} scale={[aspect * 0.36, 0.36, 1]} renderOrder={20}>
      <spriteMaterial map={texture} transparent depthTest={false} />
    </sprite>
  )
}
