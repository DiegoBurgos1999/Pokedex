import { computed } from 'vue'

import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'
import { useToastStore } from '@/shared/store/useToastStore'
import { capitalize } from '@/shared/utils/capitalize'

import { favoritesCopy } from '../copy'
import { useFavoritesStore } from '../store/useFavoritesStore'

/**
 * Adding a favorite is instant; removing one asks for confirmation first
 * (design requirement). Both `PokemonCard` and `PokemonDetailView`'s hero
 * heart button use this so that flow isn't duplicated, and a single shared
 * `RemoveFavoriteDialog` (backed by the store's `pendingRemoval`) handles
 * the confirmation regardless of which one triggered it.
 */
export function useFavoriteToggle() {
  const store = useFavoritesStore()
  const toast = useToastStore()

  const isFavorite = (id: number): boolean => store.isFavorite(id)

  const toggle = (summary: PokemonSummary): void => {
    if (store.isFavorite(summary.id)) {
      store.requestRemoval(summary)
      return
    }
    store.addFavorite(summary)
    toast.show(favoritesCopy.addedToast(capitalize(summary.name)))
  }

  const confirmRemoval = (): void => {
    const removed = store.pendingRemoval
    store.confirmRemoval()
    if (removed) toast.show(favoritesCopy.removedToast(capitalize(removed.name)))
  }

  return {
    isFavorite,
    toggle,
    pendingRemoval: computed(() => store.pendingRemoval),
    confirmRemoval,
    cancelRemoval: store.cancelRemoval,
  }
}
