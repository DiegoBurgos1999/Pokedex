import { useQueries } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

import { fetchType } from '../api/pokemonApi'
import { unionPokemonFromTypes } from '../mappers/pokemonIndex.mapper'
import type { PokemonType } from '../model/pokemonTypeTheme'

/**
 * Type-filtered browsing: `GET /type/{name}` has no pagination — it always
 * returns that type's entire list — so a type-filtered browse already has
 * everything in memory once the type queries resolve.
 */
export function useTypeFilterBrowse(types: Ref<PokemonType[]>) {
  const queries = useQueries({
    queries: () =>
      types.value.map((type) => ({
        queryKey: ['pokemon', 'type', type],
        queryFn: () => fetchType(type),
        staleTime: Infinity,
      })),
  })

  const entries = computed(() => {
    const loaded = queries.value
      .map((q) => q.data)
      .filter((d): d is NonNullable<typeof d> => d !== undefined)
    return unionPokemonFromTypes(loaded)
  })

  const isPending = computed(() => queries.value.some((q) => q.isPending))
  const isAllErrored = computed(
    () => queries.value.length > 0 && queries.value.every((q) => q.isError),
  )

  const retry = (): void => {
    queries.value.forEach((q) => void q.refetch())
  }

  return { entries, isPending, isAllErrored, retry }
}
