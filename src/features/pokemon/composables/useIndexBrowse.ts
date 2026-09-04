import { useQueries } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

import { fetchPokemonIndexPage, GENERATION_ONE_COUNT } from '../api/pokemonApi'
import { toIndexEntries } from '../mappers/pokemonIndex.mapper'
import { PAGE_SIZE } from '../model/constants'

/**
 * Unfiltered browsing: `GET /pokemon` supports real `offset`/`limit`
 * pagination, so this fetches one batch of `PAGE_SIZE` per "Ver más" click
 * and accumulates them in memory. Each batch is its own cached query, so
 * nothing already shown is ever re-fetched.
 */
export function useIndexBrowse(page: Ref<number>, active: Ref<boolean>) {
  const queries = useQueries({
    queries: () => {
      if (!active.value) return []
      return Array.from({ length: page.value }, (_, i) => {
        const offset = i * PAGE_SIZE
        const limit = Math.max(0, Math.min(PAGE_SIZE, GENERATION_ONE_COUNT - offset))
        return {
          queryKey: ['pokemon', 'index-batch', offset],
          queryFn: () => fetchPokemonIndexPage(limit, offset),
          staleTime: Infinity,
          select: toIndexEntries,
        }
      })
    },
  })

  const entries = computed(() => queries.value.flatMap((q) => q.data ?? []))
  const isPending = computed(() => queries.value.some((q) => q.isPending))
  const isAllErrored = computed(
    () => queries.value.length > 0 && queries.value.every((q) => q.isError),
  )
  const hasAnyError = computed(() => queries.value.some((q) => q.isError))

  const retry = (): void => {
    queries.value.forEach((q) => void q.refetch())
  }

  return { entries, isPending, isAllErrored, hasAnyError, retry }
}
