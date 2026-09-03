<script setup lang="ts">
import { ref } from 'vue'

import ActiveTypeFilters from '../components/ActiveTypeFilters.vue'
import NoResultsEmptyState from '../components/NoResultsEmptyState.vue'
import PokemonFilters from '../components/PokemonFilters.vue'
import PokemonList from '../components/PokemonList.vue'
import PokemonSearchAndFilter from '../components/PokemonSearchAndFilter.vue'
import { usePokemonList } from '../composables/usePokemonList'
import { pokemonCopy } from '../copy'
import type { PokemonType } from '../model/pokemonTypeTheme'

const {
  query,
  applied,
  page,
  pageCount,
  state,
  items,
  shownCount,
  totalCount,
  hasMore,
  isLoadingMore,
  loadMoreError,
  loadMore,
  retry,
  applyFilters,
  clearAll,
} = usePokemonList()

const showFilters = ref(false)

const removeFilter = (type: PokemonType): void => {
  applyFilters(applied.value.filter((t) => t !== type))
}

const onApplyFilters = (types: PokemonType[]): void => {
  applyFilters(types)
  showFilters.value = false
}
</script>

<template>
  <div>
    <div
      class="sticky top-0 z-10 bg-canvas-translucent px-[var(--page-padding-x)] pt-7.5 pb-4.5 backdrop-blur-[10px]"
    >
      <div class="mb-5.5 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p class="mb-1 text-sm font-semibold tracking-eyebrow text-ink-subtle uppercase">
            {{ pokemonCopy.eyebrow }}
          </p>
          <h1 class="text-4xl font-bold tracking-tightest">{{ pokemonCopy.title }}</h1>
        </div>
        <PokemonSearchAndFilter
          v-model="query"
          :applied-types="applied"
          @open-filters="showFilters = true"
        />
      </div>

      <ActiveTypeFilters
        :applied-types="applied"
        @remove="removeFilter"
        @clear="applyFilters([])"
      />
    </div>

    <div class="px-[var(--page-padding-x)] pt-2">
      <PokemonList
        :state="state"
        :items="items"
        :shown-count="shownCount"
        :total-count="totalCount"
        :has-more="hasMore"
        :is-loading-more="isLoadingMore"
        :load-more-error="loadMoreError"
        :page="page"
        :page-count="pageCount"
        @load-more="loadMore"
        @set-page="page = $event"
        @retry="retry"
      >
        <template #empty>
          <NoResultsEmptyState @clear="clearAll" />
        </template>
      </PokemonList>
    </div>

    <PokemonFilters
      :open="showFilters"
      :applied-types="applied"
      @close="showFilters = false"
      @apply="onApplyFilters"
    />
  </div>
</template>
