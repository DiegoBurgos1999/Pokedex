import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'

import { useFavoritesStore } from '../useFavoritesStore'

const pikachu: PokemonSummary = { id: 25, name: 'pikachu', sprite: 'x.png', types: ['electric'] }
const charmander: PokemonSummary = { id: 4, name: 'charmander', sprite: 'y.png', types: ['fire'] }

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useFavoritesStore', () => {
  it('starts empty', () => {
    const store = useFavoritesStore()
    expect(store.favorites).toEqual([])
    expect(store.count).toBe(0)
  })

  it('adds a favorite', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)
    expect(store.favorites).toEqual([pikachu])
    expect(store.isFavorite(25)).toBe(true)
  })

  it('does not duplicate a favorite already added', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)
    store.addFavorite(pikachu)
    expect(store.count).toBe(1)
  })

  it('removes a favorite', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)
    store.addFavorite(charmander)
    store.removeFavorite(25)
    expect(store.favorites).toEqual([charmander])
    expect(store.isFavorite(25)).toBe(false)
  })

  it('removing a favorite that is not present is a no-op', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)
    store.removeFavorite(999)
    expect(store.favorites).toEqual([pikachu])
  })

  it('toggles a favorite on and off', () => {
    const store = useFavoritesStore()
    store.toggleFavorite(pikachu)
    expect(store.isFavorite(25)).toBe(true)
    store.toggleFavorite(pikachu)
    expect(store.isFavorite(25)).toBe(false)
  })

  it('removes only after the pending removal is confirmed', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)

    store.requestRemoval(pikachu)
    expect(store.pendingRemoval).toEqual(pikachu)
    expect(store.isFavorite(25)).toBe(true)

    store.confirmRemoval()
    expect(store.isFavorite(25)).toBe(false)
    expect(store.pendingRemoval).toBeNull()
  })

  it('keeps the favorite when the pending removal is cancelled', () => {
    const store = useFavoritesStore()
    store.addFavorite(pikachu)

    store.requestRemoval(pikachu)
    store.cancelRemoval()

    expect(store.isFavorite(25)).toBe(true)
    expect(store.pendingRemoval).toBeNull()
  })
})
