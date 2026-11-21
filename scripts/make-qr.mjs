// Genera el QR y la tarjeta de la infografía para una URL pública YA PUBLICADA.
// Uso: npm run qr -- https://tu-sitio.vercel.app/   (salida en qr/)
// El script comprueba que la URL responde (HTTP 200) y que el QR generado decodifica exactamente a esa URL.
import { createRequire } from 'node:module'
import { mkdirSync, writeFileSync } from 'node:fs'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { boneSvg, FONT, SANS } from './lib-card.mjs'

const TEST = process.env.QR_TEST === '1' // solo para probar el generador; NO usar para el QR definitivo
const url = process.argv[2]
if (!url || !(TEST ? /^https?:\/\//.test(url) : /^https:\/\//.test(url))) { console.error('Indica la URL pública definitiva (https://…). Ej.: npm run qr -- https://radiocarpal-lab.vercel.app/'); process.exit(1) }
if (!TEST && /localhost|127\.0\.0\.1|example\./.test(url)) { console.error('La URL no es una dirección pública definitiva.'); process.exit(1) }

const res = await fetch(url, { redirect: 'follow' }).catch((e) => ({ ok: false, status: String(e) }))
if (!res.ok) { console.error(`La URL no respondió correctamente (${res.status}). No se genera el QR para una dirección no verificada.`); process.exit(1) }
const html = await res.text()
if (!/RADIOCARPAL LAB/.test(html)) { console.error('La URL responde, pero no parece ser RADIOCARPAL LAB. Se cancela.'); process.exit(1) }

mkdirSync('qr', { recursive: true })
const opts = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#FFFFFF' } }
const png = await QRCode.toBuffer(url, { ...opts, width: 2048, type: 'png' })
const svg = await QRCode.toString(url, { ...opts, type: 'svg' })
writeFileSync('qr/radiocarpal-lab-qr.png', png)
writeFileSync('qr/radiocarpal-lab-qr.svg', svg)

const img = PNG.sync.read(png)
const dec = jsQR(new Uint8ClampedArray(img.data), img.width, img.height)
if (!dec || dec.data !== url) { console.error('La verificación de decodificación falló.'); process.exit(1) }
console.log('QR verificado: decodifica exactamente a', dec.data)

// Tarjeta para la infografía (600×800), colores de la aplicación.
const inner = svg.match(/<svg[^>]*viewBox="0 0 (\d+) \d+"[^>]*>([\s\S]*)<\/svg>/)
const n = Number(inner[1]); const size = 360
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
<defs><radialGradient id="a" cx="90%" cy="0%" r="70%"><stop offset="0" stop-color="#EBC7D4" stop-opacity=".8"/><stop offset="1" stop-color="#FAF7F2" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="0%" cy="100%" r="70%"><stop offset="0" stop-color="#B7CADB" stop-opacity=".8"/><stop offset="1" stop-color="#FAF7F2" stop-opacity="0"/></radialGradient></defs>
<rect width="600" height="800" rx="36" fill="#FAF7F2"/><rect width="600" height="800" rx="36" fill="url(#a)"/><rect width="600" height="800" rx="36" fill="url(#b)"/>
<rect x="14" y="14" width="572" height="772" rx="26" fill="none" stroke="#A9B89A" stroke-width="2" stroke-dasharray="6 8"/>
<text x="300" y="110" text-anchor="middle" ${SANS} font-size="15" font-weight="600" letter-spacing="4" fill="#536B5A">PUCE SANTO DOMINGO · MEDICINA</text>
<text x="300" y="185" text-anchor="middle" ${FONT} font-size="50" font-weight="600" fill="#3F5446">EXPLORA</text>
<text x="300" y="245" text-anchor="middle" ${FONT} font-size="50" font-weight="600" fill="#7A64A3">RADIOCARPAL LAB</text>
<text x="300" y="285" text-anchor="middle" ${FONT} font-size="21" font-style="italic" fill="#536B5A">Atlas interactivo · Anatomía 3D · Casos clínicos · Autoevaluación</text>
<rect x="110" y="320" width="380" height="380" rx="24" fill="#FFFFFF" stroke="#E6E0D5"/>
<svg x="120" y="330" width="360" height="360" viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges">${inner[2]}</svg>
<text x="300" y="745" text-anchor="middle" ${SANS} font-size="23" font-weight="600" fill="#3F5446">Escanea y explora la anatomía de la muñeca.</text>
</svg>`
writeFileSync('qr/tarjeta-qr.svg', card)
try {
  const { chromium } = createRequire(import.meta.url)('playwright')
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 600, height: 800 }, deviceScaleFactor: 3 })
  await p.setContent(`<body style="margin:0;background:transparent">${card}</body>`)
  writeFileSync('qr/tarjeta-qr.png', await p.screenshot({ omitBackground: true }))
  await b.close()
} catch { console.log('Playwright no disponible: solo se generó la tarjeta en SVG.') }
console.log('Archivos en ./qr: radiocarpal-lab-qr.png, radiocarpal-lab-qr.svg, tarjeta-qr.svg, tarjeta-qr.png')
