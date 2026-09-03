<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import FavoriteButton from '@/features/favorites/components/FavoriteButton.vue'
import TypeChip from '@/shared/ui/TypeChip.vue'
import { formatPokemonNumber } from '@/shared/utils/pad'

import { getTypeGradient, getTypeTheme } from '../model/pokemonTypeTheme'
import type { PokemonSummary } from '../model/pokemon.model'

const props = withDefaults(
  defineProps<{ pokemon: PokemonSummary; from?: 'pokedex' | 'favorites' }>(),
  { from: 'pokedex' },
)

const primaryType = computed(() => props.pokemon.types[0] ?? 'normal')
const softBackground = computed(() => getTypeTheme(primaryType.value).soft)
const heroGradient = computed(() => getTypeGradient(primaryType.value))
</script>

<template>
  <RouterLink
    :to="{ path: `/pokemon/${pokemon.id}`, query: from === 'favorites' ? { from } : undefined }"
    class="card-lift relative flex h-[var(--card-height)] overflow-hidden rounded-xl shadow-card motion-safe:animate-[fade-up_0.45s_both]"
    :style="{ backgroundColor: softBackground }"
  >
    <div class="flex min-w-0 flex-1 flex-col p-5">
      <span class="text-sm font-semibold text-ink/75">{{ formatPokemonNumber(pokemon.id) }}</span>
      <h3 class="mt-0.5 truncate text-3xl font-bold tracking-tightest text-ink capitalize">
        {{ pokemon.name }}
      </h3>
      <div class="mt-auto flex gap-2">
        <TypeChip v-for="type in pokemon.types" :key="type" :type="type" />
      </div>
    </div>
    <div
      class="relative flex w-[170px] shrink-0 items-center justify-center rounded-l-[60px] rounded-r-xl"
      :style="{ backgroundImage: heroGradient }"
    >
      <div
        role="img"
        :aria-label="pokemon.name"
        class="sprite h-[104px] w-[104px] bg-contain bg-center bg-no-repeat drop-shadow-lg"
        :style="{ backgroundImage: `url(${pokemon.sprite})` }"
      />
      <FavoriteButton :summary="pokemon" class="absolute top-3 right-3" />
    </div>
  </RouterLink>
</template>
