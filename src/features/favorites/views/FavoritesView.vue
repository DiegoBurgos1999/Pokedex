<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import ActiveTypeFilters from '@/features/pokemon/components/ActiveTypeFilters.vue'
import NoResultsEmptyState from '@/features/pokemon/components/NoResultsEmptyState.vue'
import PokemonFilters from '@/features/pokemon/components/PokemonFilters.vue'
import PokemonList from '@/features/pokemon/components/PokemonList.vue'
import PokemonSearchAndFilter from '@/features/pokemon/components/PokemonSearchAndFilter.vue'
import type { PokemonListState } from '@/features/pokemon/composables/usePokemonList'
import { usePokemonSearch } from '@/features/pokemon/composables/usePokemonSearch'
import type { PokemonType } from '@/features/pokemon/model/pokemonTypeTheme'

import FavoritesEmptyState from '../components/FavoritesEmptyState.vue'
import { favoritesCopy } from '../copy'
import { useFavoritesStore } from '../store/useFavoritesStore'

const store = useFavoritesStore()

const { query, debouncedQuery } = usePokemonSearch()
const applied = ref<PokemonType[]>([])
const showFilters = ref(false)

const filteredFavorites = computed(() => {
  const q = debouncedQuery.value.trim().toLowerCase()
  return store.favorites.filter((pokemon) => {
    const matchesQuery =
      !q || pokemon.name.toLowerCase().includes(q) || String(pokemon.id).includes(q)
    const matchesType =
      applied.value.length === 0 || pokemon.types.some((type) => applied.value.includes(type))
    return matchesQuery && matchesType
  })
})

const isFiltering = computed(
  () => debouncedQuery.value.trim().length > 0 || applied.value.length > 0,
)

// Favorites are already-resolved summaries held in memory — there is
// nothing left to fetch, so only ready/empty apply here (no skeleton/error).
const state = computed<PokemonListState>(() =>
  filteredFavorites.value.length > 0 ? 'ready' : 'empty',
)

const removeFilter = (type: PokemonType): void => {
  applied.value = applied.value.filter((t) => t !== type)
}

const onApplyFilters = (types: PokemonType[]): void => {
  applied.value = types
  showFilters.value = false
}

const clearFiltering = (): void => {
  query.value = ''
  applied.value = []
}
</script>

<template>
  <div class="px-[var(--page-padding-x)] pt-7.5 pb-10">
    <RouterLink
      to="/pokedex"
      class="mb-4.5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink-muted transition-colors duration-fast hover:text-brand"
    >
      <span aria-hidden="true">←</span> {{ favoritesCopy.backToPokedex }}
    </RouterLink>

    <div class="mb-5.5 flex flex-wrap items-end justify-between gap-5">
      <div>
        <p class="mb-1 text-sm font-semibold tracking-eyebrow text-ink-subtle uppercase">
          {{ favoritesCopy.eyebrow }}
        </p>
        <h1 class="text-4xl font-bold tracking-tightest">{{ favoritesCopy.title }}</h1>
      </div>
      <PokemonSearchAndFilter
        v-if="store.favorites.length > 0"
        v-model="query"
        :applied-types="applied"
        @open-filters="showFilters = true"
      />
    </div>

    <ActiveTypeFilters :applied-types="applied" @remove="removeFilter" @clear="applied = []" />

    <PokemonList :state="state" :items="filteredFavorites" from="favorites">
      <template #empty>
        <FavoritesEmptyState v-if="!isFiltering" />
        <NoResultsEmptyState v-else @clear="clearFiltering" />
      </template>
    </PokemonList>

    <PokemonFilters
      :open="showFilters"
      :applied-types="applied"
      @close="showFilters = false"
      @apply="onApplyFilters"
    />
  </div>
</template>
