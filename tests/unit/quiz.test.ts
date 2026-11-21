import { QUESTIONS } from '../../src/data/questions'
import { prepare, prepareQuiz, scoreQuiz, selectQuestions } from '../../src/lib/quiz'
import { mulberry32 } from '../../src/lib/utils'

describe('lógica del cuestionario', () => {
  it('evaluación rápida: 5 preguntas, una por categoría', () => {
    const qs = selectQuestions('rapida')
    expect(qs).toHaveLength(5)
    expect(new Set(qs.map((q) => q.categoria)).size).toBe(5)
  })
  it('completa: 20 sin repetir; clínica: solo aplicadas', () => {
    expect(new Set(selectQuestions('completa').map((q) => q.id)).size).toBe(20)
    expect(selectQuestions('clinica').every((q) => q.aplicada)).toBe(true)
  })
  it('al barajar, la respuesta correcta sigue vinculada a su texto', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const q of QUESTIONS) {
        const p = prepare(q, mulberry32(seed))
        expect(p.options[p.correctPos].text).toBe(q.opciones[q.correcta])
        expect(p.options.map((o) => o.text).sort()).toEqual([...q.opciones].sort())
      }
    }
  })
  it('puntaje: todo correcto = 100 %, todo incorrecto = 0 %, mixto', () => {
    const items = prepareQuiz('completa', mulberry32(7))
    expect(scoreQuiz(items, items.map((i) => i.correctPos))).toMatchObject({ correct: 20, total: 20, pct: 100 })
    expect(scoreQuiz(items, items.map((i) => (i.correctPos + 1) % 4))).toMatchObject({ correct: 0, pct: 0 })
    const mixed = items.map((i, k) => (k < 15 ? i.correctPos : null))
    const r = scoreQuiz(items, mixed)
    expect(r.correct).toBe(15); expect(r.pct).toBe(75)
    expect(r.byCategory.reduce((a, c) => a + c.total, 0)).toBe(20)
  })
})
