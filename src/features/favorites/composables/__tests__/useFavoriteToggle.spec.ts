import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'
import { useToastStore } from '@/shared/store/useToastStore'

import { useFavoriteToggle } from '../useFavoriteToggle'

const pikachu: PokemonSummary = { id: 25, name: 'pikachu', sprite: 'x.png', types: ['electric'] }

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('useFavoriteToggle', () => {
  it('adds a non-favorite immediately, without opening the confirm dialog', () => {
    const { toggle, isFavorite, pendingRemoval } = useFavoriteToggle()

    toggle(pikachu)

    expect(isFavorite(25)).toBe(true)
    expect(pendingRemoval.value).toBeNull()
  })

  it('does not remove an existing favorite immediately — it asks for confirmation', () => {
    const { toggle, isFavorite, pendingRemoval } = useFavoriteToggle()
    toggle(pikachu)

    toggle(pikachu)

    expect(isFavorite(25)).toBe(true)
    expect(pendingRemoval.value).toEqual(pikachu)
  })

  it('removes the favorite once the pending removal is confirmed', () => {
    const { toggle, isFavorite, confirmRemoval, pendingRemoval } = useFavoriteToggle()
    toggle(pikachu)
    toggle(pikachu)

    confirmRemoval()

    expect(isFavorite(25)).toBe(false)
    expect(pendingRemoval.value).toBeNull()
  })

  it('keeps the favorite when the pending removal is cancelled', () => {
    const { toggle, isFavorite, cancelRemoval, pendingRemoval } = useFavoriteToggle()
    toggle(pikachu)
    toggle(pikachu)

    cancelRemoval()

    expect(isFavorite(25)).toBe(true)
    expect(pendingRemoval.value).toBeNull()
  })

  it('shows a success toast when a favorite is added', () => {
    const { toggle } = useFavoriteToggle()

    toggle(pikachu)

    expect(useToastStore().toasts).toEqual([
      expect.objectContaining({ message: 'Pikachu añadido a favoritos', variant: 'success' }),
    ])
  })

  it('shows a success toast only once removal is confirmed, not when requested', () => {
    const { toggle, confirmRemoval } = useFavoriteToggle()
    toggle(pikachu)
    useToastStore().toasts.splice(0)

    toggle(pikachu)
    expect(useToastStore().toasts).toEqual([])

    confirmRemoval()
    expect(useToastStore().toasts).toEqual([
      expect.objectContaining({ message: 'Pikachu quitado de favoritos', variant: 'success' }),
    ])
  })

  it('is shared across independent composable instances (one global confirm dialog)', () => {
    const first = useFavoriteToggle()
    const second = useFavoriteToggle()

    first.toggle(pikachu)
    first.toggle(pikachu)

    expect(second.pendingRemoval.value).toEqual(pikachu)
  })
})
