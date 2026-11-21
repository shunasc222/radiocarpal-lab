import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../src/App'

beforeEach(() => { window.location.hash = '#/inicio' })

describe('navegación y módulos', () => {
  it('los botones principales abren sus secciones', async () => {
    const u = userEvent.setup()
    render(<App />)
    await u.click(screen.getByRole('button', { name: 'EXPLORAR ANATOMÍA' }))
    expect(await screen.findByRole('heading', { name: /Osteología y superficies articulares/ })).toBeInTheDocument()
    window.location.hash = '#/inicio'
    await u.click(await screen.findByRole('button', { name: 'INICIAR AUTOEVALUACIÓN' }))
    expect(await screen.findByRole('heading', { name: /Pon a prueba/ })).toBeInTheDocument()
  })

  it('atlas: seleccionar estructura, ocultar etiquetas', async () => {
    window.location.hash = '#/atlas'
    const u = userEvent.setup()
    render(<App />)
    await u.click(await screen.findByRole('button', { name: /^3?\s?.*Escafoides$/i, hidden: false }).catch(() => screen.getAllByRole('button', { name: /Escafoides/ })[0]))
    expect(await screen.findByTestId('structure-card')).toHaveTextContent(/Escafoides/)
    await u.click(screen.getByRole('button', { name: 'Ocultar etiquetas' }))
    expect(screen.getByRole('button', { name: 'Mostrar etiquetas' })).toBeInTheDocument()
  })

  it('quiz rápido: responder todo y ver resultado', async () => {
    window.location.hash = '#/evaluacion'
    const u = userEvent.setup()
    render(<App />)
    await u.click(await screen.findByRole('button', { name: /Evaluación rápida/ }))
    for (let i = 0; i < 5; i++) {
      const group = screen.getByRole('radiogroup')
      await u.click(within(group).getAllByRole('radio')[0])
      expect(screen.getByTestId('quiz-feedback')).toBeInTheDocument()
      await u.click(screen.getByRole('button', { name: i === 4 ? /Ver resultados/ : /Siguiente/ }))
      if (i < 4) await waitFor(() => expect(screen.getByTestId('quiz-progress')).toHaveTextContent(`${i + 2}/5`))
      if (i < 4) await waitFor(() => expect(within(screen.getByRole('radiogroup')).getAllByRole('radio')[0]).toBeEnabled())
    }
    expect(await screen.findByTestId('quiz-result')).toBeInTheDocument()
    expect(screen.getByTestId('quiz-score')).toHaveTextContent(/\/5/)
    await u.click(screen.getByRole('button', { name: /Repetir la evaluación/ }))
    expect(screen.getByTestId('quiz-progress')).toHaveTextContent('1/5')
  })

  it('caso clínico: la explicación no se ve antes de responder', async () => {
    window.location.hash = '#/casos'
    const u = userEvent.setup()
    render(<App />)
    await u.click(await screen.findByRole('button', { name: /Pasar a la toma de decisiones/ }))
    expect(screen.queryByTestId('case-explanation')).not.toBeInTheDocument()
    for (const d of ['e1', 'e2', 'e3']) {
      const card = await screen.findByTestId(`decision-${d}`)
      await u.click(within(card).getAllByRole('button')[0])
    }
    await u.click(screen.getByRole('button', { name: /Ver explicación anatómica/ }))
    expect(await screen.findByTestId('case-explanation')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: /Reiniciar caso/ }))
    expect(await screen.findByText('Motivo de consulta')).toBeInTheDocument()
  })

  it('miología: tarjeta de músculo y simulador', async () => {
    window.location.hash = '#/miologia'
    const u = userEvent.setup()
    render(<App />)
    await u.click((await screen.findAllByRole('button', { name: 'Extensor radial corto del carpo' }))[0])
    expect(screen.getByTestId('muscle-card')).toHaveTextContent(/3\.º metacarpiano/)
    await u.click(screen.getByRole('tab', { name: /Movimientos/ }))
    await u.click(screen.getByRole('button', { name: 'Desviación ulnar' }))
    expect(screen.getByTestId('movement-card')).toHaveTextContent(/Desviación ulnar/)
  })

  it('ligamentos: ficha del escafolunar', async () => {
    window.location.hash = '#/ligamentos'
    const u = userEvent.setup()
    render(<App />)
    await u.click((await screen.findAllByRole('button', { name: 'Ligamento escafolunar interóseo' }))[0])
    expect(screen.getByTestId('ligament-card')).toHaveTextContent(/escafoides y semilunar/i)
  })
})
