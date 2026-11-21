// Prueba E2E: requiere `npm run build` y Playwright disponible globalmente. Uso: node tests/e2e/smoke.mjs [url]
import { createRequire } from 'node:module'
import { spawn } from 'node:child_process'
const require = createRequire(import.meta.url)
const { chromium } = require('playwright')
const PORT = 4199
const base = process.argv[2] ?? `http://127.0.0.1:${PORT}/`
const server = process.argv[2] ? null : spawn('npx', ['vite', 'preview', '--port', String(PORT), '--host', '127.0.0.1', '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, server ? 2500 : 0))

let fails = 0
const jsClick = (loc) => loc.evaluate((e) => e.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))) // evita la barra inferior fija en móvil
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails++ }
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })

for (const [name, vp, touch] of [['escritorio', { width: 1280, height: 900 }, false], ['móvil 360', { width: 360, height: 740 }, true], ['tableta', { width: 820, height: 1100 }, true]]) {
  const ctx = await browser.newContext({ viewport: vp, hasTouch: touch, isMobile: touch && vp.width < 500 })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
  const go = async (s, wait = 500) => { await page.goto(`${base}#/${s}`); await page.waitForTimeout(wait) }

  for (const s of ['inicio', 'atlas', 'explorador-3d', 'ligamentos', 'miologia', 'neurovascular', 'casos', 'evaluacion']) {
    await go(s, s === 'explorador-3d' ? 2000 : 400)
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    ok(over <= 0, `${name}: sin desplazamiento horizontal en ${s}`)
  }

  await go('atlas')
  await jsClick(page.locator('path[aria-label="Escafoides"]').first())
  ok((await page.getByTestId('structure-card').innerText()).includes('Escafoides'), `${name}: clic en zona del atlas abre la ficha`)
  await page.getByRole('button', { name: 'Resaltar superficies articulares' }).click()
  await page.getByRole('button', { name: 'Restablecer vista' }).click()
  await page.waitForTimeout(600)
  ok(await page.getByTestId('structure-card').count() === 0, `${name}: restablecer vista limpia la selección`)
  await page.getByRole('tab', { name: /distal/i }).click()
  await jsClick(page.locator('path[aria-label="Fosita escafoidea"]').first())
  ok((await page.getByTestId('structure-card').innerText()).includes('Fosita escafoidea'), `${name}: zona real de la vista distal (fosita escafoidea)`)
  await jsClick(page.getByRole('button', { name: 'Restablecer vista' }))
  await page.getByRole('tab', { name: /autoevaluación/i }).click()
  await page.getByRole('group', { name: 'Opciones' }).getByRole('button').first().click()
  ok(await page.getByTestId('atlas-feedback').isVisible(), `${name}: modo autoevaluación del atlas da retroalimentación`)

  await go('explorador-3d', 4000)
  ok(await page.locator('canvas').count() === 1, `${name}: canvas 3D presente`)
  const canvasBox = await page.locator('canvas').boundingBox()
  ok(canvasBox && canvasBox.width > 200 && canvasBox.height > 200, `${name}: el lienzo 3D tiene tamaño visible`)
  await jsClick(page.getByRole('button', { name: 'Vista radial' }))
  await jsClick(page.getByRole('button', { name: 'Mostrar capa Ligamentos' }))
  await jsClick(page.getByRole('button', { name: 'Mostrar capa Miología' }))
  await jsClick(page.getByRole('button', { name: 'Mostrar capa Vasos y nervios' }))
  await jsClick(page.getByRole('button', { name: /^Ocultar capa Osteología$/ }))
  await jsClick(page.getByRole('button', { name: /^Mostrar capa Osteología$/ }))
  await jsClick(page.getByRole('button', { name: 'Separar estructuras' }))
  await page.waitForTimeout(600)
  await jsClick(page.getByRole('button', { name: 'Restablecer modelo' }))
  const lay = page.getByRole('region', { name: 'x' }).or(page.getByLabel('Panel de capas'))
  await jsClick(page.getByRole('button', { name: /Miología/ }).and(page.locator('[aria-expanded]')))
  await jsClick(page.getByLabel('Panel de capas').getByRole('button', { name: 'Extensor radial corto del carpo', exact: true }))
  ok((await page.getByTestId('structure-card').innerText()).includes('3.º metacarpiano'), `${name}: selección de músculo real desde el panel de capas`)
  await jsClick(page.getByRole('button', { name: /Osteología/ }).and(page.locator('[aria-expanded]')))
  await jsClick(page.getByLabel('Panel de capas').getByRole('button', { name: 'Escafoides', exact: true }))
  ok((await page.getByTestId('structure-card').innerText()).includes('Escafoides'), `${name}: selección de hueso`)
  const op = page.getByLabel('Opacidad de Osteología')
  await op.fill('40')
  ok((await op.inputValue()) === '40', `${name}: transparencia ajustable`)
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2)
  await page.mouse.down(); await page.mouse.move(canvasBox.x + canvasBox.width / 2 + 120, canvasBox.y + canvasBox.height / 2 + 30, { steps: 8 }); await page.mouse.up()
  await page.mouse.wheel(0, -300); await page.waitForTimeout(300)
  void lay

  await go('ligamentos')
  await page.getByRole('tab', { name: 'Vista dorsal' }).click()
  await jsClick(page.getByRole('list', { name: 'Lista de ligamentos' }).getByRole('button', { name: /radiocarpiano dorsal/ }))
  ok((await page.getByTestId('ligament-card').innerText()).includes('dorsal'), `${name}: ligamento dorsal`)

  await go('miologia')
  await jsClick(page.getByRole('button', { name: 'Extensor radial largo del carpo' }).first())
  ok((await page.getByTestId('muscle-card').innerText()).includes('2.º metacarpiano'), `${name}: tarjeta de músculo`)
  await page.getByRole('tab', { name: 'Movimientos' }).click()
  await page.getByRole('button', { name: 'Flexión', exact: true }).click()
  await page.waitForTimeout(900)
  const ang = await page.getByTestId('sim-angle').innerText()
  ok(/\d+°/.test(ang) && !ang.startsWith('0°'), `${name}: el simulador anima (${ang})`)

  await go('neurovascular')
  await page.getByRole('list', { name: 'Lista de arterias' }).getByRole('button', { name: /Arteria radial/ }).click()
  await page.waitForTimeout(600)
  ok(await page.getByTestId('nv-card').isVisible(), `${name}: ficha de arteria`)
  await page.getByRole('button', { name: 'Simular fractura de la cintura' }).click()
  ok(await page.getByTestId('scaphoid-warning').isVisible(), `${name}: simulación de fractura de escafoides`)

  await go('evaluacion')
  await page.getByRole('button', { name: /Evaluación completa/ }).click()
  ok((await page.getByTestId('quiz-progress').innerText()) === '1/20', `${name}: evaluación completa = 20 preguntas`)

  ok(errors.length === 0, `${name}: sin errores de consola${errors.length ? ' → ' + errors.slice(0, 2).join(' | ') : ''}`)
  await ctx.close()
}
await browser.close()
server?.kill()
console.log(fails ? `\n${fails} comprobaciones fallaron` : '\nTodas las comprobaciones E2E pasaron')
process.exit(fails ? 1 : 0)
