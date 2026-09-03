import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PokemonDetail } from '../../model/pokemon.model'
import ShareButton from '../ShareButton.vue'

const pikachu: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  sprite: 'x.png',
  types: ['electric'],
  weightKg: 6,
  heightM: 0.4,
  category: 'Pokémon Ratón',
  ability: 'Elec. Estática',
  genderRate: 4,
  description: '...',
  weaknesses: ['ground'],
}

const writeText = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  vi.useFakeTimers()
  writeText.mockClear()
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
})

afterEach(() => {
  vi.useRealTimers()
})

describe('ShareButton', () => {
  it('copies the pokemon name and attributes, comma-separated, to the clipboard', async () => {
    const wrapper = mount(ShareButton, { props: { detail: pikachu } })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(writeText).toHaveBeenCalledWith(
      'pikachu, N°025, Eléctrico, 6 kg, 0,4 m, Pokémon Ratón, Elec. Estática',
    )
  })

  it('shows a transient "copied" confirmation, then reverts', async () => {
    const wrapper = mount(ShareButton, { props: { detail: pikachu } })

    expect(wrapper.text()).toContain('Compartir')

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('¡Copiado!')

    await vi.advanceTimersByTimeAsync(1500)
    expect(wrapper.text()).toContain('Compartir')
  })

  it('degrades gracefully when the clipboard write is denied', async () => {
    writeText.mockRejectedValueOnce(new Error('denied'))
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(ShareButton, { props: { detail: pikachu } })

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('No se pudo copiar')

    await vi.advanceTimersByTimeAsync(1500)
    expect(wrapper.text()).toContain('Compartir')

    vi.restoreAllMocks()
  })
})
