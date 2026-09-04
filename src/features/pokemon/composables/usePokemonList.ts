import { useQueries } from '@tanstack/vue-query'
import { computed, ref, watch } from 'vue'

import { fetchPokemonDetail, GENERATION_ONE_COUNT } from '../api/pokemonApi'
import { toPokemonSummary } from '../mappers/pokemonSummary.mapper'
import { PAGE_SIZE } from '../model/constants'
import type { PokemonSummary } from '../model/pokemon.model'
import type { PokemonType } from '../model/pokemonTypeTheme'
import { matchesPokemonQuery } from '../utils/matchesPokemonQuery'
import { useIndexBrowse } from './useIndexBrowse'
import { usePokemonSearch } from './usePokemonSearch'
import { useTypeFilterBrowse } from './useTypeFilterBrowse'

export type PokemonListState = 'skeleton' | 'ready' | 'empty' | 'error'

/**
 * Backs PokedexView. Two ways to source the list are kept as an explicit
 * branch (via `useIndexBrowse`/`useTypeFilterBrowse`) rather than unified,
 * since `GET /pokemon` and `GET /type/{name}` paginate completely
 * differently — see those composables for why. This composable layers
 * search, paging and per-item detail fetching on top of whichever one is
 * active.
 *
 * Search always filters whatever is already loaded (the accumulated batches
 * when unfiltered, the full type list when filtering): PokéAPI has no search
 * endpoint, and fetching the whole 151-entry index just to support instant
 * search would undo the point of paginating in the first place.
 */
export function usePokemonList() {
  const { query, debouncedQuery } = usePokemonSearch()
  const applied = ref<PokemonType[]>([])
  const page = ref(1)

  const isTypeFiltering = computed(() => applied.value.length > 0)
  const isIndexActive = computed(() => !isTypeFiltering.value)

  const indexBrowse = useIndexBrowse(page, isIndexActive)
  const typeFilterBrowse = useTypeFilterBrowse(applied)

  const baseEntries = computed(() =>
    isTypeFiltering.value ? typeFilterBrowse.entries.value : indexBrowse.entries.value,
  )

  const filteredEntries = computed(() => {
    const q = debouncedQuery.value.trim().toLowerCase()
    if (!q) return baseEntries.value
    return baseEntries.value.filter((entry) => matchesPokemonQuery(entry, q))
  })

  const totalCount = computed(() =>
    isTypeFiltering.value ? filteredEntries.value.length : GENERATION_ONE_COUNT,
  )
  const pageCount = computed(() => Math.max(1, Math.ceil(totalCount.value / PAGE_SIZE)))

  // Type-filtered browsing already has its whole list in memory, so "Ver
  // más" there just reveals more of it; unfiltered browsing shows exactly
  // what's been fetched so far — the batches themselves ARE the paging.
  const visibleEntries = computed(() =>
    isTypeFiltering.value
      ? filteredEntries.value.slice(0, page.value * PAGE_SIZE)
      : filteredEntries.value,
  )

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
  // "Ver más" has two phases: fetching the new batch's names (index-batch
  // query), then fetching each of their details. The spinner has to cover
  // both — checking only the detail queries left the first phase silent.
  const isLoadingMore = computed(() => {
    if (!hasLoadedFirstBatch.value) return false
    const indexBatchPending = !isTypeFiltering.value && indexBrowse.isPending.value
    return indexBatchPending || detailQueries.value.some((q) => q.isPending)
  })

  const isBaseListLoading = computed(() =>
    isTypeFiltering.value
      ? typeFilterBrowse.isPending.value
      : indexBrowse.entries.value.length === 0 && indexBrowse.isPending.value,
  )
  const isBaseListError = computed(() =>
    isTypeFiltering.value ? typeFilterBrowse.isAllErrored.value : indexBrowse.isAllErrored.value,
  )
  const isDetailAllError = computed(
    () => detailQueries.value.length > 0 && detailQueries.value.every((q) => q.isError),
  )
  // A batch fetched after the first one (e.g. "Ver más" while offline) can
  // fail — either the index batch itself or a per-item detail call — without
  // everything having failed, since earlier batches are already cached and
  // showing. That must not be silent: it's surfaced as `loadMoreError`
  // instead of the full-page error state, since the cards already loaded are
  // still worth showing. Gated on `page > 1` so a partial failure *within*
  // the first batch doesn't show "couldn't load more" copy before the user
  // has ever clicked "Ver más".
  const hasAnyIndexBatchError = computed(
    () => !isTypeFiltering.value && indexBrowse.hasAnyError.value,
  )
  const hasAnyDetailError = computed(() => detailQueries.value.some((q) => q.isError))
  const loadMoreError = computed(
    () =>
      page.value > 1 &&
      !isBaseListError.value &&
      !isDetailAllError.value &&
      (hasAnyIndexBatchError.value || hasAnyDetailError.value),
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

  watch(applied, () => {
    page.value = 1
  })

  const loadMore = (): void => {
    page.value += 1
  }

  const retry = (): void => {
    if (isTypeFiltering.value) typeFilterBrowse.retry()
    else indexBrowse.retry()
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
    totalCount,
    hasMore: computed(() => visibleEntries.value.length < totalCount.value),
    isLoadingMore,
    loadMoreError,
    loadMore,
    retry,
    applyFilters,
    clearAll,
  }
}
