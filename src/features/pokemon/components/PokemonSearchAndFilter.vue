<script setup lang="ts">
import BaseInput from '@/shared/ui/BaseInput.vue'

import { pokemonCopy } from '../copy'
import type { PokemonType } from '../model/pokemonTypeTheme'

defineProps<{ appliedTypes: PokemonType[] }>()
const emit = defineEmits<{ openFilters: [] }>()

const query = defineModel<string>({ default: '' })
</script>

<template>
  <div class="flex min-w-0 flex-1 basis-[420px] items-center justify-end gap-3">
    <BaseInput v-model="query" :placeholder="pokemonCopy.searchPlaceholder" />
    <button
      type="button"
      class="flex h-[var(--control-height)] items-center gap-2.5 rounded-pill border border-border bg-surface px-5.5 font-sans text-base font-semibold text-ink shadow-control transition-transform duration-fast hover:-translate-y-0.5 hover:border-brand"
      @click="emit('openFilters')"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" />
      </svg>
      {{ pokemonCopy.filters }}
      <span
        v-if="appliedTypes.length"
        class="rounded-pill bg-brand px-2 py-0.5 text-xs font-bold text-white"
      >
        {{ appliedTypes.length }}
      </span>
    </button>
  </div>
</template>
