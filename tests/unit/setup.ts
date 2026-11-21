import '@testing-library/jest-dom/vitest'

// jsdom no implementa estas APIs del navegador.
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}
class IO { observe() {} unobserve() {} disconnect() {} takeRecords() { return [] } }
;(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver = IO
window.scrollTo = (() => {}) as typeof window.scrollTo
