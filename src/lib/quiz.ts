import { CATEGORY_LABEL, QUESTIONS, type QCategory, type Question } from '../data/questions'
import { shuffle } from './utils'

export type QuizMode = 'rapida' | 'completa' | 'clinica'

export interface PreparedQuestion {
  q: Question
  /** Alternativas ya barajadas; `orig` es el índice original en q.opciones. */
  options: { text: string; orig: number }[]
  /** Posición (tras barajar) de la alternativa correcta. */
  correctPos: number
}

export const MODE_INFO: Record<QuizMode, { titulo: string; subtitulo: string }> = {
  rapida: { titulo: 'Evaluación rápida', subtitulo: '5 preguntas · una por área' },
  completa: { titulo: 'Evaluación completa', subtitulo: '20 preguntas' },
  clinica: { titulo: 'Evaluación clínica', subtitulo: 'Casos aplicados' },
}

export function selectQuestions(mode: QuizMode, rnd: () => number = Math.random, bank: readonly Question[] = QUESTIONS): Question[] {
  if (mode === 'completa') return shuffle(bank, rnd)
  if (mode === 'clinica') return shuffle(bank.filter((q) => q.aplicada), rnd)
  const cats = Object.keys(CATEGORY_LABEL) as QCategory[]
  const picked = cats.map((c) => shuffle(bank.filter((q) => q.categoria === c), rnd)[0]).filter(Boolean)
  return shuffle(picked, rnd)
}

export function prepare(q: Question, rnd: () => number = Math.random): PreparedQuestion {
  const options = shuffle(q.opciones.map((text, orig) => ({ text, orig })), rnd)
  return { q, options, correctPos: options.findIndex((o) => o.orig === q.correcta) }
}

export function prepareQuiz(mode: QuizMode, rnd: () => number = Math.random, bank: readonly Question[] = QUESTIONS): PreparedQuestion[] {
  return selectQuestions(mode, rnd, bank).map((q) => prepare(q, rnd))
}

export interface QuizResult {
  correct: number
  total: number
  pct: number
  byCategory: { categoria: QCategory; correct: number; total: number }[]
}

/** `answers[i]` es la posición (tras barajar) elegida en la pregunta i, o null si quedó sin responder. */
export function scoreQuiz(items: PreparedQuestion[], answers: (number | null)[]): QuizResult {
  let correct = 0
  const map = new Map<QCategory, { correct: number; total: number }>()
  items.forEach((it, i) => {
    const ok = answers[i] !== null && answers[i] !== undefined && answers[i] === it.correctPos
    if (ok) correct++
    const c = map.get(it.q.categoria) ?? { correct: 0, total: 0 }
    c.total++
    if (ok) c.correct++
    map.set(it.q.categoria, c)
  })
  const total = items.length
  return {
    correct, total, pct: total === 0 ? 0 : Math.round((correct / total) * 100),
    byCategory: [...map.entries()].map(([categoria, v]) => ({ categoria, ...v })),
  }
}

export function generalFeedback(pct: number): string {
  if (pct >= 90) return 'Dominio excelente. Puedes pasar a integrar la anatomía con casos más complejos.'
  if (pct >= 70) return 'Buen nivel. Repasa las áreas con menor puntaje y revisa la explicación de cada error.'
  if (pct >= 50) return 'Nivel intermedio. Vuelve al atlas y a los módulos de ligamentos y músculos antes de repetir.'
  return 'Conviene repasar los fundamentos: superficies articulares, ligamentos y relaciones. Usa el modo de estudio del atlas y vuelve a intentarlo.'
}
