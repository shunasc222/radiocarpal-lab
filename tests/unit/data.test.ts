import { QUESTIONS, CATEGORY_COUNTS, type QCategory } from '../../src/data/questions'
import { STRUCTURES } from '../../src/data/structures'
import { LIGAMENTS } from '../../src/data/ligaments'
import { MUSCLES } from '../../src/data/muscles'
import { MOVEMENTS } from '../../src/data/movements'
import { CASES } from '../../src/data/cases'
import { NV_ITEMS } from '../../src/data/neurovascular'
import { REFERENCES } from '../../src/data/references'

describe('banco de preguntas', () => {
  it('tiene 20 preguntas con la distribución pedida', () => {
    expect(QUESTIONS).toHaveLength(20)
    for (const [cat, n] of Object.entries(CATEGORY_COUNTS)) expect(QUESTIONS.filter((q) => q.categoria === (cat as QCategory))).toHaveLength(n)
  })
  it('ids y enunciados únicos', () => {
    expect(new Set(QUESTIONS.map((q) => q.id)).size).toBe(20)
    expect(new Set(QUESTIONS.map((q) => q.enunciado)).size).toBe(20)
  })
  it('cada pregunta: 4 alternativas distintas, correcta válida, errores coherentes', () => {
    for (const q of QUESTIONS) {
      expect(new Set(q.opciones).size).toBe(4)
      expect([0, 1, 2, 3]).toContain(q.correcta)
      expect(q.justificacion.length).toBeGreaterThan(20)
      q.errores.forEach((e, i) => (i === q.correcta ? expect(e).toBe('') : expect(e.length).toBeGreaterThan(5)))
    }
  })
  it('hay al menos 5 preguntas aplicadas para la evaluación clínica', () => {
    expect(QUESTIONS.filter((q) => q.aplicada).length).toBeGreaterThanOrEqual(5)
  })
})

describe('datos anatómicos', () => {
  it('estructuras completas y con ids únicos', () => {
    expect(new Set(STRUCTURES.map((s) => s.id)).size).toBe(STRUCTURES.length)
    for (const s of STRUCTURES) for (const k of ['ubicacion', 'descripcion', 'funcion', 'relaciones', 'clinica'] as const) expect(s[k].length).toBeGreaterThan(10)
  })
  it('ligamentos con geometría y campos', () => {
    expect(LIGAMENTS.length).toBeGreaterThanOrEqual(19)
    for (const l of LIGAMENTS.filter((x) => x.views.length > 0)) { expect(l.paths.length).toBeGreaterThan(0); expect(l.lesion.length).toBeGreaterThan(10) }
  })
  it('ECRL y ECRB tienen inserciones distintas y correctas', () => {
    expect(MUSCLES.find((m) => m.id === 'ecrl')!.insercion).toMatch(/2\.º metacarpiano/)
    expect(MUSCLES.find((m) => m.id === 'ecrb')!.insercion).toMatch(/3\.º metacarpiano/)
  })
  it('5 movimientos y 6 músculos principales', () => { expect(MOVEMENTS).toHaveLength(5); expect(MUSCLES).toHaveLength(6) })
  it('3 casos con 3 etapas de contenido y una única opción correcta por decisión', () => {
    expect(CASES).toHaveLength(3)
    for (const c of CASES) for (const d of c.decisiones) { expect(d.opciones.filter((o) => o.correcta)).toHaveLength(1); expect(d.opciones).toHaveLength(4) }
  })
  it('vasos y nervios', () => { expect(NV_ITEMS.some((n) => n.kind === 'arteria')).toBe(true); expect(NV_ITEMS.some((n) => n.kind === 'nervio')).toBe(true) })
  it('4 referencias', () => expect(REFERENCES).toHaveLength(4))
})
