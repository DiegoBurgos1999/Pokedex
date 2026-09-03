<script setup lang="ts">
import { computed } from 'vue'

import { pokemonCopy } from '../copy'
import { getTypeTheme, type PokemonType } from '../model/pokemonTypeTheme'
import { TYPE_NAME_ES } from '../model/typeCopy'

const props = defineProps<{ appliedTypes: PokemonType[] }>()
const emit = defineEmits<{ remove: [type: PokemonType]; clear: [] }>()

const chips = computed(() =>
  props.appliedTypes.map((type) => ({
    type,
    label: TYPE_NAME_ES[type],
    color: getTypeTheme(type).base,
  })),
)
</script>

<template>
  <div v-if="chips.length" class="flex flex-wrap items-center gap-2.5">
    <button
      v-for="chip in chips"
      :key="chip.type"
      type="button"
      class="flex items-center gap-2 rounded-pill px-3.5 py-1.5 font-sans text-sm font-semibold text-white"
      :style="{ backgroundColor: chip.color }"
      @click="emit('remove', chip.type)"
    >
      {{ chip.label }} <span class="opacity-80">✕</span>
    </button>
    <button
      type="button"
      class="font-sans text-sm font-semibold text-ink-muted underline underline-offset-2 transition-colors duration-fast hover:text-brand"
      @click="emit('clear')"
    >
      {{ pokemonCopy.clearFilters }}
    </button>
  </div>
</template>
