// Utilidades compartidas: extrae las rutas SVG del esquema original (src/data/wristGeometry.ts).
import { readFileSync } from 'node:fs'
export function boneSvg(scale = 1) {
  const src = readFileSync(new URL('../src/data/wristGeometry.ts', import.meta.url), 'utf8')
  const body = src.slice(src.indexOf('BONE_PATHS: Record<string, string> = {') + 'BONE_PATHS: Record<string, string> = '.length)
  const obj = new Function(`return ${body.slice(0, body.indexOf('\n}\n') + 2)}`)()
  const fills = { radio: '#efe8da', ulna: '#efe8da', disco: '#c9d6e3', escafoides: '#f2d6df', semilunar: '#ddd1ea', piramidal: '#cfdeea', pisiforme: '#efe6d0' }
  const order = ['radio', 'ulna', 'trapecio', 'trapezoide', 'hueso_grande', 'ganchoso', 'escafoides', 'semilunar', 'piramidal', 'disco', 'pisiforme']
  return `<g transform="scale(${scale})">${order.map((k) => `<path d="${obj[k]}" fill="${fills[k] ?? '#ece8de'}" stroke="${fills[k] ? '#8a8f7a' : '#b8b3a3'}" stroke-width="2"/>`).join('')}</g>`
}
export const FONT = "font-family=\"Georgia, 'Times New Roman', serif\""
export const SANS = "font-family=\"system-ui, 'Segoe UI', Arial, sans-serif\""
