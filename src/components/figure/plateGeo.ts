import { PLATES } from '../../data/plates.generated'

export type PlateKey = 'palmar' | 'dorsal' | 'distal' | 'palmar-muscles' | 'dorsal-muscles' | 'scaphoid'

/** Proyecta un punto 3D (cm; x radial→ulnar, y distal→proximal, z dorsal→palmar) a píxeles de la lámina. */
export function proj(key: PlateKey, x: number, y: number, z: number): [number, number] {
  const F = PLATES[key]
  if (key === 'dorsal' || key === 'dorsal-muscles') return [(F.x1 - x) * F.S, (F.a1 - y) * F.S]
  if (key === 'distal') return [(x - F.x0) * F.S, (F.a1 - z) * F.S]
  return [(x - F.x0) * F.S, (F.a1 - y) * F.S]
}
export const f1 = (n: number) => Math.round(n * 10) / 10

/** Polígono cerrado «M x y L … Z» a partir de puntos 3D. */
export function polyPath(key: PlateKey, pts: number[][]): string {
  return 'M' + pts.map((p) => proj(key, p[0], p[1], p[2]).map(f1).join(' ')).join('L') + 'Z'
}
export function linePath(key: PlateKey, pts: number[][]): string {
  return 'M' + pts.map((p) => proj(key, p[0], p[1], p[2]).map(f1).join(' ')).join('L')
}
/** Cinta (filas izquierda/cresta/derecha) → polígono 2D del contorno. */
export function ribbonPath(key: PlateKey, strip: number[][]): string {
  const left = strip.map((r) => [r[0], r[1], r[2]]), right = strip.map((r) => [r[8], r[9], r[10]]).reverse()
  return polyPath(key, [...left, ...right])
}

/** Disco articular (esquemático): elipse proyectada. */
export const DISC = { c: [0.4, -0.07, -0.1] as const, rx: 0.72, rz: 0.72, t: 0.2 }
export function discPath(key: PlateKey): string {
  const pts: number[][] = []
  for (let i = 0; i < 40; i++) {
    const a = (i / 40) * Math.PI * 2
    if (key === 'distal') pts.push([DISC.c[0] + Math.cos(a) * DISC.rx, DISC.c[1], DISC.c[2] + Math.sin(a) * DISC.rz])
    else pts.push([DISC.c[0] + Math.cos(a) * DISC.rx, DISC.c[1] + Math.sin(a) * DISC.t * 0.8, DISC.c[2]])
  }
  return polyPath(key, pts)
}

/** Línea de la cresta de una cinta (brillo central). */
export function crestPath(key: PlateKey, strip: number[][]): string {
  return linePath(key, strip.map((r) => [r[4], r[5], r[6]]))
}
