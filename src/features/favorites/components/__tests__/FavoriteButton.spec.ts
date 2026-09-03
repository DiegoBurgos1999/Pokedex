import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'

import { useFavoritesStore } from '../../store/useFavoritesStore'
import FavoriteButton from '../FavoriteButton.vue'

const pikachu: PokemonSummary = { id: 25, name: 'pikachu', sprite: 'x.png', types: ['electric'] }

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  pinia = createPinia()
  setActivePinia(pinia)
})

describe('FavoriteButton', () => {
  it('is not pressed for a pokemon that is not a favorite', () => {
    const wrapper = mount(FavoriteButton, {
      props: { summary: pikachu },
      global: { plugins: [pinia] },
    })

    expect(wrapper.get('button').attributes('aria-pressed')).toBe('false')
    expect(wrapper.get('button').attributes('aria-label')).toBe('Agregar a favoritos')
  })

  it('adds the pokemon to favorites on click, without a confirmation step', async () => {
    const wrapper = mount(FavoriteButton, {
      props: { summary: pikachu },
      global: { plugins: [pinia] },
    })

    await wrapper.get('button').trigger('click')

    expect(useFavoritesStore().isFavorite(25)).toBe(true)
    expect(wrapper.get('button').attributes('aria-pressed')).toBe('true')
  })

  it('opens the confirm-removal dialog instead of removing immediately', async () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)

    const wrapper = mount(FavoriteButton, {
      props: { summary: pikachu },
      global: { plugins: [pinia] },
    })
    await wrapper.get('button').trigger('click')

    expect(store.isFavorite(25)).toBe(true)
    expect(store.pendingRemoval).toEqual(pikachu)
  })

  it('stops the click from bubbling to an enclosing clickable card', async () => {
    const wrapper = mount(
      {
        components: { FavoriteButton },
        data: () => ({ cardClicked: false }),
        template: `<article @click="cardClicked = true"><FavoriteButton :summary="pikachu" /></article>`,
        setup: () => ({ pikachu }),
      },
      { global: { plugins: [pinia] } },
    )

    await wrapper.get('button').trigger('click')

    expect((wrapper.vm as unknown as { cardClicked: boolean }).cardClicked).toBe(false)
  })

  it("prevents the click's default action, not just its bubbling — a nested <a> follows its href on the native default action even when propagation never reaches the anchor's own listener", () => {
    const wrapper = mount(
      {
        components: { FavoriteButton },
        template: `<a href="/pokemon/25"><FavoriteButton :summary="pikachu" /></a>`,
        setup: () => ({ pikachu }),
      },
      { global: { plugins: [pinia] } },
    )

    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    wrapper.get('button').element.dispatchEvent(clickEvent)

    expect(clickEvent.defaultPrevented).toBe(true)
  })
})
