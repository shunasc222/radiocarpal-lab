// Genera public/og-image.png (1200×630) para la vista previa al compartir. Requiere Playwright.
import { createRequire } from 'node:module'
import { readFileSync, writeFileSync } from 'node:fs'
import { FONT, SANS } from './lib-card.mjs'
const { chromium } = createRequire(import.meta.url)('playwright')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<defs><radialGradient id="a" cx="85%" cy="0%" r="70%"><stop offset="0" stop-color="#EBC7D4" stop-opacity=".7"/><stop offset="1" stop-color="#FAF7F2" stop-opacity="0"/></radialGradient>
<radialGradient id="b" cx="0%" cy="100%" r="70%"><stop offset="0" stop-color="#B7CADB" stop-opacity=".7"/><stop offset="1" stop-color="#FAF7F2" stop-opacity="0"/></radialGradient></defs>
<rect width="1200" height="630" fill="#FAF7F2"/><rect width="1200" height="630" fill="url(#a)"/><rect width="1200" height="630" fill="url(#b)"/>
<image href="data:image/webp;base64,${readFileSync('public/atlas/palmar.webp').toString('base64')}" x="780" y="-60" width="380" height="665" />
<text x="70" y="150" ${SANS} font-size="22" font-weight="600" letter-spacing="5" fill="#536B5A">PUCE SANTO DOMINGO · MEDICINA</text>
<text x="70" y="270" ${FONT} font-size="112" font-weight="600" fill="#3F5446">RADIOCARPAL</text>
<text x="70" y="380" ${FONT} font-size="112" font-weight="600" fill="#7A64A3">LAB</text>
<text x="70" y="450" ${FONT} font-size="38" font-style="italic" fill="#536B5A">Explora la anatomía de la muñeca.</text>
<text x="70" y="540" ${SANS} font-size="24" fill="#5B6272">Atlas interactivo · Anatomía 3D · Casos clínicos · Autoevaluación</text><text x="70" y="596" ${SANS} font-size="15" fill="#8A8F7A">Modelos: BodyParts3D © DBCLS, CC BY 4.0</text></svg>`
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } })
await p.setContent(`<body style="margin:0">${svg}</body>`)
writeFileSync(new URL('../public/og-image.png', import.meta.url), await p.screenshot())
await b.close(); console.log('public/og-image.png generado')
