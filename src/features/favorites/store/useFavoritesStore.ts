import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'

/**
 * In-memory only, by design: favorites reset on reload. Persistence would be
 * a one-line addition (pinia-plugin-persistedstate / useLocalStorage) but
 * this is a deliberate scope decision, not an oversight — see CLAUDE.md.
 */
export const useFavoritesStore = defineStore('favorites', () => {
  const favorites = ref<PokemonSummary[]>([])
  // The Pokémon currently in the "remove from favorites?" confirmation dialog.
  // Global (not per-component) because only one such dialog can be open at a
  // time, regardless of which card or the detail hero triggered it.
  const pendingRemoval = ref<PokemonSummary | null>(null)

  const count = computed(() => favorites.value.length)

  const isFavorite = (id: number): boolean => favorites.value.some((p) => p.id === id)

  const addFavorite = (summary: PokemonSummary): void => {
    if (!isFavorite(summary.id)) favorites.value.push(summary)
  }

  const removeFavorite = (id: number): void => {
    favorites.value = favorites.value.filter((p) => p.id !== id)
  }

  const toggleFavorite = (summary: PokemonSummary): void => {
    if (isFavorite(summary.id)) removeFavorite(summary.id)
    else addFavorite(summary)
  }

  const requestRemoval = (summary: PokemonSummary): void => {
    pendingRemoval.value = summary
  }

  const confirmRemoval = (): void => {
    if (pendingRemoval.value) removeFavorite(pendingRemoval.value.id)
    pendingRemoval.value = null
  }

  const cancelRemoval = (): void => {
    pendingRemoval.value = null
  }

  return {
    favorites,
    pendingRemoval,
    count,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    requestRemoval,
    confirmRemoval,
    cancelRemoval,
  }
})
