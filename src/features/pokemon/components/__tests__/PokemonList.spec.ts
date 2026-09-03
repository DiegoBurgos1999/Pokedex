import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'

import type { PokemonSummary } from '../../model/pokemon.model'
import PokemonList from '../PokemonList.vue'

const bulbasaur: PokemonSummary = { id: 1, name: 'bulbasaur', sprite: 'x.png', types: ['grass'] }

const mountList = (props: Partial<InstanceType<typeof PokemonList>['$props']>) =>
  mount(PokemonList, {
    props: { state: 'ready', items: [], ...props },
    global: {
      plugins: [createPinia()],
      stubs: { RouterLink: { template: '<a><slot /></a>' } },
    },
    slots: { empty: '<p>custom empty content</p>' },
  })

describe('PokemonList', () => {
  it('renders a skeleton grid of 6 placeholders in the skeleton state', () => {
    const wrapper = mountList({ state: 'skeleton' })
    expect(wrapper.findAll('.skeleton').length).toBeGreaterThan(0)
    expect(wrapper.text()).not.toContain('bulbasaur')
  })

  it('renders a card per item in the ready state', () => {
    const wrapper = mountList({ state: 'ready', items: [bulbasaur] })
    expect(wrapper.text()).toContain('bulbasaur')
  })

  it('renders the empty slot in the empty state', () => {
    const wrapper = mountList({ state: 'empty' })
    expect(wrapper.text()).toContain('custom empty content')
  })

  it('renders the built-in error state and emits retry', async () => {
    const wrapper = mountList({ state: 'error' })
    expect(wrapper.text()).toContain('Algo salió mal...')

    await wrapper.get('button').trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('shows pagination controls only when pageCount is provided', () => {
    const paginated = mountList({
      state: 'ready',
      items: [bulbasaur],
      pageCount: 3,
      page: 1,
      shownCount: 12,
      totalCount: 30,
      hasMore: true,
    })
    expect(paginated.text()).toContain('Mostrando 12 de 30 Pokémon')
    expect(paginated.text()).toContain('Ver más')

    const flat = mountList({ state: 'ready', items: [bulbasaur] })
    expect(flat.text()).not.toContain('Ver más')
  })

  it('shows an inline error and retry instead of "Ver más" when a later batch failed to load', async () => {
    const wrapper = mountList({
      state: 'ready',
      items: [bulbasaur],
      pageCount: 2,
      page: 1,
      hasMore: true,
      loadMoreError: true,
    })

    expect(wrapper.text()).toContain('No pudimos cargar más Pokémon')
    expect(wrapper.text()).not.toContain('Ver más')

    const retryButton = wrapper.findAll('button').find((b) => b.text() === 'Reintentar')
    await retryButton?.trigger('click')
    expect(wrapper.emitted('retry')).toHaveLength(1)
  })

  it('emits loadMore when the button is clicked', async () => {
    const wrapper = mountList({
      state: 'ready',
      items: [bulbasaur],
      pageCount: 2,
      page: 1,
      hasMore: true,
    })

    const loadMoreButton = wrapper.findAll('button').find((b) => b.text().includes('Ver más'))
    await loadMoreButton?.trigger('click')
    expect(wrapper.emitted('loadMore')).toHaveLength(1)
  })

  it('renders the page dots as non-interactive progress indicators', () => {
    const wrapper = mountList({
      state: 'ready',
      items: [bulbasaur],
      pageCount: 2,
      page: 1,
      hasMore: true,
    })

    expect(wrapper.find('button[aria-label="Ir a la página 2"]').exists()).toBe(false)
    expect(wrapper.findAll('span.bg-dot-inactive, span.bg-brand')).toHaveLength(2)
  })
})
