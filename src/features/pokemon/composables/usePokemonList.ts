import { useQueries, useQuery } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'

import { fetchPokemonDetail, fetchPokemonIndex, fetchType } from '../api/pokemonApi'
import { toIndexEntries, unionPokemonFromTypes } from '../mappers/pokemonIndex.mapper'
import { toPokemonSummary } from '../mappers/pokemonSummary.mapper'
import { PAGE_SIZE } from '../model/constants'
import type { PokemonSummary } from '../model/pokemon.model'
import type { PokemonType } from '../model/pokemonTypeTheme'
import { usePokemonSearch } from './usePokemonSearch'

export type PokemonListState = 'skeleton' | 'ready' | 'empty' | 'error'

/**
 * Backs PokedexView (and, via its non-paginated inputs, FavoritesView's
 * grid). Two ways to source the base list are kept as an explicit branch
 * rather than unified: the plain index (cheap, cached forever) versus one
 * `GET /type/{name}` call per active filter, unioned client-side — PokéAPI
 * has no "index filtered by type" endpoint.
 */
export function usePokemonList() {
  const { query, debouncedQuery } = usePokemonSearch()
  const applied = ref<PokemonType[]>([])
  const page = ref(1)

  const indexQuery = useQuery({
    queryKey: ['pokemon', 'index'],
    queryFn: fetchPokemonIndex,
    staleTime: Infinity,
    select: toIndexEntries,
  })

  const isTypeFiltering = computed(() => applied.value.length > 0)

  const typeQueries = useQueries({
    queries: () =>
      applied.value.map((type) => ({
        queryKey: ['pokemon', 'type', type],
        queryFn: () => fetchType(type),
        staleTime: Infinity,
      })),
  })

  const typeFilterPending = computed(() => typeQueries.value.some((q) => q.isPending))
  const typeFilterAllErrored = computed(
    () => typeQueries.value.length > 0 && typeQueries.value.every((q) => q.isError),
  )

  const baseEntries = computed(() => {
    if (!isTypeFiltering.value) return indexQuery.data.value ?? []
    const loaded = typeQueries.value
      .map((q) => q.data)
      .filter((d): d is NonNullable<typeof d> => d !== undefined)
    return unionPokemonFromTypes(loaded)
  })

  const filteredEntries = computed(() => {
    const q = debouncedQuery.value.trim().toLowerCase()
    if (!q) return baseEntries.value
    return baseEntries.value.filter(
      (entry) => entry.name.toLowerCase().includes(q) || String(entry.id).includes(q),
    )
  })

  const pageCount = computed(() => Math.max(1, Math.ceil(filteredEntries.value.length / PAGE_SIZE)))
  const visibleEntries = computed(() => filteredEntries.value.slice(0, page.value * PAGE_SIZE))

  const detailQueries = useQueries({
    queries: () =>
      visibleEntries.value.map((entry) => ({
        queryKey: ['pokemon', 'detail', entry.id],
        queryFn: () => fetchPokemonDetail(entry.id),
        staleTime: Infinity,
      })),
  })

  // useQueries preserves result order against the queries array, so this
  // stays aligned with visibleEntries without re-sorting.
  const items = computed<PokemonSummary[]>(() =>
    detailQueries.value
      .map((q) => q.data)
      .filter((data): data is NonNullable<typeof data> => data !== undefined)
      .map(toPokemonSummary),
  )

  const hasLoadedFirstBatch = computed(() => detailQueries.value.some((q) => q.data !== undefined))
  const isLoadingMore = computed(
    () => hasLoadedFirstBatch.value && detailQueries.value.some((q) => q.isPending),
  )

  const isBaseListLoading = computed(() =>
    isTypeFiltering.value ? typeFilterPending.value : indexQuery.isPending.value,
  )
  const isBaseListError = computed(() =>
    isTypeFiltering.value ? typeFilterAllErrored.value : indexQuery.isError.value,
  )
  const isDetailAllError = computed(
    () => detailQueries.value.length > 0 && detailQueries.value.every((q) => q.isError),
  )
  // A batch fetched after the first one (e.g. "Ver más" while offline) can
  // fail without every visible query having errored — some of the earlier,
  // already-cached ones still have data. That must not be silent: it's
  // surfaced as `loadMoreError` instead of the full-page error state, since
  // the successfully loaded cards above it are still worth showing.
  const hasAnyDetailError = computed(() => detailQueries.value.some((q) => q.isError))
  const loadMoreError = computed(
    () => hasLoadedFirstBatch.value && !isDetailAllError.value && hasAnyDetailError.value,
  )

  const state = computed<PokemonListState>(() => {
    if (isBaseListError.value || isDetailAllError.value) return 'error'
    if (isBaseListLoading.value) return 'skeleton'
    if (visibleEntries.value.length > 0 && !hasLoadedFirstBatch.value && !hasAnyDetailError.value) {
      return 'skeleton'
    }
    if (filteredEntries.value.length === 0) return 'empty'
    return 'ready'
  })

  watch([debouncedQuery, applied], () => {
    page.value = 1
  })

  const loadMore = (): void => {
    page.value += 1
  }

  const retry = (): void => {
    if (isTypeFiltering.value) typeQueries.value.forEach((q) => void q.refetch())
    else void indexQuery.refetch()
    detailQueries.value.forEach((q) => {
      if (q.isError) void q.refetch()
    })
  }

  const applyFilters = (types: PokemonType[]): void => {
    applied.value = types
  }

  const clearAll = (): void => {
    query.value = ''
    applied.value = []
    page.value = 1
  }

  return {
    query,
    applied,
    page,
    pageCount,
    state,
    items,
    shownCount: computed(() => visibleEntries.value.length),
    totalCount: computed(() => filteredEntries.value.length),
    hasMore: computed(() => visibleEntries.value.length < filteredEntries.value.length),
    isLoadingMore,
    loadMoreError,
    loadMore,
    retry,
    applyFilters,
    clearAll,
  }
}
