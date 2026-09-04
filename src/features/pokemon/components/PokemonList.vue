<script setup lang="ts">
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue'
import BaseSpinner from '@/shared/ui/BaseSpinner.vue'
import ErrorState from '@/shared/ui/ErrorState.vue'

import { pokemonCopy } from '../copy'
import type { PokemonListState } from '../composables/usePokemonList'
import type { PokemonSummary } from '../model/pokemon.model'
import PokemonCard from './PokemonCard.vue'

withDefaults(
  defineProps<{
    state: PokemonListState
    items: PokemonSummary[]
    /** Threaded into each card's link so the detail page's back link knows where to return. */
    from?: 'pokedex' | 'favorites'
    /** Omit all pagination props to render as a flat, unpaginated grid (Favorites). */
    shownCount?: number
    hasMore?: boolean
    isLoadingMore?: boolean
    /** A later batch failed to load while earlier ones are still showing — not a full-page error. */
    loadMoreError?: boolean
    page?: number
    pageCount?: number
  }>(),
  {
    from: 'pokedex',
    shownCount: 0,
    hasMore: false,
    isLoadingMore: false,
    loadMoreError: false,
    page: 1,
    pageCount: undefined,
  },
)

const emit = defineEmits<{ loadMore: []; retry: [] }>()
</script>

<template>
  <div>
    <div
      v-if="state === 'skeleton'"
      class="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-5.5"
    >
      <div
        v-for="n in 6"
        :key="n"
        class="flex h-[var(--card-height)] overflow-hidden rounded-xl bg-surface shadow-card"
      >
        <div class="flex flex-1 flex-col gap-3 p-6">
          <BaseSkeleton class="h-3 w-16" radius="pill" />
          <BaseSkeleton class="h-5.5 w-[70%]" />
          <div class="mt-auto flex gap-2">
            <BaseSkeleton class="h-6.5 w-22" radius="pill" />
            <BaseSkeleton class="h-6.5 w-22" radius="pill" />
          </div>
        </div>
        <BaseSkeleton class="w-[150px] shrink-0" radius="none" />
      </div>
    </div>

    <div v-else-if="state === 'ready'">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-5.5 mt-2.5">
        <PokemonCard v-for="item in items" :key="item.id" :pokemon="item" :from="from" />
      </div>

      <div v-if="pageCount !== undefined" class="flex flex-col items-center gap-4 py-11">
        <div class="flex items-center gap-2" aria-hidden="true">
          <span
            v-for="n in pageCount"
            :key="n"
            class="h-2 rounded-pill transition-[width,background-color] duration-fast"
            :class="n === page ? 'w-7.5 bg-brand' : 'w-2 bg-dot-inactive'"
          />
        </div>
        <p class="text-sm text-ink-subtle">
          {{ pokemonCopy.showingCount(shownCount ?? 0) }}
        </p>
        <template v-if="loadMoreError">
          <p class="text-sm font-semibold text-accent">{{ pokemonCopy.loadMoreError }}</p>
          <button
            type="button"
            class="flex items-center gap-2 rounded-pill bg-accent px-10.5 py-4 font-sans text-base font-semibold text-white shadow-danger transition-transform duration-fast hover:-translate-y-0.5"
            @click="emit('retry')"
          >
            {{ pokemonCopy.retry }}
          </button>
        </template>
        <button
          v-else-if="hasMore"
          type="button"
          class="flex items-center gap-2 rounded-pill bg-brand px-10.5 py-4 font-sans text-base font-semibold text-white shadow-brand transition-transform duration-fast hover:-translate-y-0.5"
          @click="emit('loadMore')"
        >
          <BaseSpinner v-if="isLoadingMore" />
          {{ pokemonCopy.loadMore }}
        </button>
      </div>
    </div>

    <div v-else-if="state === 'empty'">
      <slot name="empty" />
    </div>

    <ErrorState
      v-else-if="state === 'error'"
      :title="pokemonCopy.errorTitle"
      :description="pokemonCopy.errorDescription"
      :retry-label="pokemonCopy.retry"
      @retry="emit('retry')"
    />
  </div>
</template>
