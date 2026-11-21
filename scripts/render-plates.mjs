// Genera las láminas 2D (public/atlas/*.webp) y las siluetas de cada zona (src/data/plates.generated.ts)
// a partir de los modelos 3D (BodyParts3D, CC BY 4.0). Requiere `npm run build` previo y Playwright.
// Uso: node scripts/render-plates.mjs
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { contours } from 'd3-contour'
import { PNG } from 'pngjs'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const PORT = 4188
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
mkdirSync('public/atlas', { recursive: true })
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })
const page = await browser.newPage()
page.on('pageerror', (e) => console.log('ERR', e.message))
await page.goto(`http://127.0.0.1:${PORT}/#/__plate`); await page.waitForSelector('body[data-plate-ready="1"]', { timeout: 30000 })
const run = (cfg) => page.evaluate((c) => window.__renderPlate(c), cfg)
const save = (name, data) => writeFileSync(`public/atlas/${name}.webp`, Buffer.from(data.split(',')[1], 'base64'))

const simplifyRing = (ring, tol) => {
  // anillo cerrado: se parte por el punto más lejano al inicial para que Douglas-Peucker no colapse
  const pts = ring.slice(0, -1); let k = 0, dm = -1
  for (let i = 1; i < pts.length; i++) { const d = (pts[i][0] - pts[0][0]) ** 2 + (pts[i][1] - pts[0][1]) ** 2; if (d > dm) { dm = d; k = i } }
  const a = simplify(pts.slice(0, k + 1), tol), b = simplify(pts.slice(k).concat([pts[0]]), tol)
  return a.concat(b.slice(1, -1))
}
const simplify = (pts, tol) => {
  if (pts.length < 5) return pts
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1
  const stack = [[0, pts.length - 1]]
  while (stack.length) {
    const [a, b] = stack.pop(); let dmax = 0, im = -1
    const [x1, y1] = pts[a], [x2, y2] = pts[b], dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / len; if (d > dmax) { dmax = d; im = i } }
    if (dmax > tol) { keep[im] = 1; stack.push([a, im], [im, b]) }
  }
  return pts.filter((_, i) => keep[i])
}
function zonesFromIds(dataUrl, w, h, names) {
  const png = PNG.sync.read(Buffer.from(dataUrl.split(',')[1], 'base64'))
  const out = {}
  for (let zi = 1; zi < names.length; zi++) {
    const r = zi * 9 + 6, grid = new Float64Array(w * h); let n = 0, sx = 0, sy = 0
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const o = (y * w + x) * 4; if (png.data[o + 3] > 200 && png.data[o] === r && png.data[o + 1] < 4) { grid[y * w + x] = 1; n++; sx += x; sy += y } }
    if (n < 25) continue
    const polys = contours().size([w, h]).thresholds([0.5])(grid)[0].coordinates
    const d = polys.map((poly) => poly.map((ring) => { const s = simplifyRing(ring, 0.9); return 'M' + s.map(([x, y]) => `${Math.round(x * 10) / 10} ${Math.round(y * 10) / 10}`).join('L') + 'Z' }).join('')).join('')
    out[names[zi]] = { d, cx: Math.round(sx / n), cy: Math.round(sy / n), area: n }
  }
  return out
}

const plates = {}
for (const view of ['palmar', 'dorsal', 'distal']) {
  const a = await run({ view, mode: 'beauty' }); save(view, a.data)
  const b = await run({ view, mode: 'surf' }); save(`${view}-surf`, b.data)
  const ids = await run({ view, mode: 'ids' })
  plates[view] = { w: ids.w, h: ids.h, ...ids.frame, zones: zonesFromIds(ids.data, ids.w, ids.h, ids.zones) }
  console.log(view, ids.w, 'x', ids.h, Object.keys(plates[view].zones).join(','))
}
for (const view of ['palmar', 'dorsal']) {
  const m = await run({ view, mode: 'beauty', muscles: true }); save(`${view}-muscles`, m.data)
  const ids = await run({ view, mode: 'ids', zonesOnlyMuscles: true })
  plates[`${view}-muscles`] = { w: ids.w, h: ids.h, ...ids.frame, zones: zonesFromIds(ids.data, ids.w, ids.h, ids.zones) }
  console.log(`${view}-muscles`, Object.keys(plates[`${view}-muscles`].zones).join(','))
}
{
  const frame = { S: 120, x0: -3.1, x1: -0.2, a0: -1.9, a1: 0.2 }
  const a = await run({ view: 'palmar', mode: 'beauty', only: ['escafoides'], frame }); save('scaphoid', a.data)
  const ids = await run({ view: 'palmar', mode: 'ids', only: ['escafoides'], frame })
  plates.scaphoid = { w: ids.w, h: ids.h, ...ids.frame, zones: zonesFromIds(ids.data, ids.w, ids.h, ids.zones) }
  console.log('scaphoid', Object.keys(plates.scaphoid.zones).join(','))
}
await browser.close(); server.kill()
writeFileSync('src/data/plates.generated.ts', `/* Generado por scripts/render-plates.mjs a partir de los modelos 3D (BodyParts3D 4.0, CC BY 4.0). No editar. */\nexport interface PlateZone { d: string; cx: number; cy: number; area: number }\nexport interface Plate { w: number; h: number; S: number; x0: number; x1: number; a0: number; a1: number; zones: Record<string, PlateZone> }\nexport const PLATES: Record<string, Plate> = ${JSON.stringify(plates)}\n`)
console.log('Láminas y zonas generadas')
