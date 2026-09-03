<script setup lang="ts">
import { computed, ref, watch } from 'vue'

import { useFocusTrap } from '@/shared/composables/useFocusTrap'
import { getTypeTheme, POKEMON_TYPES, type PokemonType } from '../model/pokemonTypeTheme'
import { TYPE_NAME_ES } from '../model/typeCopy'
import { pokemonCopy } from '../copy'

const props = defineProps<{ open: boolean; appliedTypes: PokemonType[] }>()
const emit = defineEmits<{ apply: [types: PokemonType[]]; close: [] }>()

const dialog = ref<HTMLElement | null>(null)
const draft = ref<PokemonType[]>([])
const openRef = computed(() => props.open)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) draft.value = [...props.appliedTypes]
  },
  { immediate: true },
)

useFocusTrap(dialog, openRef, () => emit('close'))

const sortedTypes = [...POKEMON_TYPES].sort((a, b) =>
  TYPE_NAME_ES[a].localeCompare(TYPE_NAME_ES[b], 'es'),
)

const rows = computed(() =>
  sortedTypes.map((type) => {
    const theme = getTypeTheme(type)
    const selected = draft.value.includes(type)
    return { type, label: TYPE_NAME_ES[type], theme, selected }
  }),
)

const toggle = (type: PokemonType): void => {
  draft.value = draft.value.includes(type)
    ? draft.value.filter((t) => t !== type)
    : draft.value.concat(type)
}

const apply = (): void => {
  emit('apply', draft.value)
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-40 flex items-center justify-center bg-overlay p-10 backdrop-blur-[6px] motion-safe:animate-[fade-up_0.22s_both]"
  >
    <div
      ref="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filters-title"
      class="w-full max-w-[760px] overflow-hidden rounded-3xl bg-surface-modal shadow-modal motion-safe:animate-[pop_0.3s_cubic-bezier(.2,.8,.2,1)_both]"
    >
      <div class="flex items-center gap-4 px-8 pt-6 pb-4">
        <button
          type="button"
          class="flex h-[42px] w-[42px] items-center justify-center rounded-sm bg-surface-sunken text-lg text-ink transition-colors duration-fast hover:bg-surface-sunken-hover"
          :aria-label="pokemonCopy.cancel"
          @click="emit('close')"
        >
          ✕
        </button>
        <h2 id="filters-title" class="mx-auto text-2xl font-bold">
          {{ pokemonCopy.filtersModalTitle }}
        </h2>
        <div class="w-[42px]" />
      </div>

      <div class="px-8">
        <div class="flex items-center justify-between border-b border-border py-3">
          <h3 class="text-xl font-bold">{{ pokemonCopy.filtersSectionType }}</h3>
        </div>
        <div class="grid max-h-80 grid-cols-3 gap-x-7 gap-y-0.5 overflow-y-auto py-3.5">
          <button
            v-for="row in rows"
            :key="row.type"
            type="button"
            :aria-pressed="row.selected"
            class="flex items-center justify-between gap-3 border-b border-[var(--color-surface-sunken)] py-3 font-sans text-base text-ink"
            @click="toggle(row.type)"
          >
            <span class="flex items-center gap-2.5">
              <span
                class="block h-2.5 w-2.5 rounded-full"
                :style="{ backgroundColor: row.theme.base }"
              />
              {{ row.label }}
            </span>
            <span
              class="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border-2 text-sm text-white"
              :class="
                row.selected
                  ? 'border-brand-deep bg-brand-deep'
                  : 'border-checkbox-border bg-surface'
              "
            >
              {{ row.selected ? '✓' : '' }}
            </span>
          </button>
        </div>
      </div>

      <div class="flex gap-3.5 border-t border-border px-8 py-6">
        <button
          type="button"
          class="flex-1 rounded-pill bg-brand py-4 font-sans text-lg font-semibold text-white shadow-brand transition-transform duration-fast hover:-translate-y-0.5"
          @click="apply"
        >
          {{ pokemonCopy.apply }}
        </button>
        <button
          type="button"
          class="w-60 rounded-pill bg-neutral-button py-4 font-sans text-lg font-semibold text-ink transition-colors duration-fast hover:bg-neutral-button-hover"
          @click="emit('close')"
        >
          {{ pokemonCopy.cancel }}
        </button>
      </div>
    </div>
  </div>
</template>
