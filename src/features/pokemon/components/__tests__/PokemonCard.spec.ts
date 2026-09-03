import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import FavoriteButton from '@/features/favorites/components/FavoriteButton.vue'

import type { PokemonSummary } from '../../model/pokemon.model'
import PokemonCard from '../PokemonCard.vue'

const bulbasaur: PokemonSummary = {
  id: 1,
  name: 'bulbasaur',
  sprite: 'bulbasaur.png',
  types: ['grass', 'poison'],
}

const mountCard = (props: Partial<InstanceType<typeof PokemonCard>['$props']> = {}) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/pokemon/:id', component: { template: '<div />' } },
    ],
  })

  return mount(PokemonCard, {
    props: { pokemon: bulbasaur, ...props },
    global: { plugins: [router, createPinia()] },
  })
}

describe('PokemonCard', () => {
  it('renders the number, name and every type chip', () => {
    const wrapper = mountCard()

    expect(wrapper.text()).toContain('N°001')
    expect(wrapper.text()).toContain('bulbasaur')
    expect(wrapper.text()).toContain('Planta')
    expect(wrapper.text()).toContain('Veneno')
  })

  it('links to the pokemon detail route by id', () => {
    const wrapper = mountCard()

    expect(wrapper.get('a').attributes('href')).toBe('/pokemon/1')
  })

  it('carries a "from=favorites" query on the link when rendered in the favorites context', () => {
    const wrapper = mountCard({ from: 'favorites' })

    expect(wrapper.get('a').attributes('href')).toBe('/pokemon/1?from=favorites')
  })

  it('renders a favorite toggle for the card', () => {
    const wrapper = mountCard()

    expect(wrapper.findComponent(FavoriteButton).exists()).toBe(true)
  })
})
