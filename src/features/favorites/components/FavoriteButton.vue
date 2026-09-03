<script setup lang="ts">
import { computed } from 'vue'

import heartFilled from '@/assets/icons/heart-filled.png'
import heartOutline from '@/assets/icons/heart-outline.png'
import { pokemonCopy } from '@/features/pokemon/copy'
import type { PokemonSummary } from '@/features/pokemon/model/pokemon.model'

import { useFavoriteToggle } from '../composables/useFavoriteToggle'

const props = withDefaults(defineProps<{ summary: PokemonSummary; size?: 'sm' | 'md' }>(), {
  size: 'sm',
})

const { isFavorite, toggle } = useFavoriteToggle()

const favorite = computed(() => isFavorite(props.summary.id))
const label = computed(() =>
  favorite.value ? pokemonCopy.removeFavorite : pokemonCopy.addFavorite,
)

const onClick = (event: MouseEvent): void => {
  // The card wrapping this button is a RouterLink: stopping propagation alone
  // keeps its click listener from firing, but not the anchor's native
  // "follow the link" default action — that still runs unless prevented.
  event.preventDefault()
  event.stopPropagation()
  toggle(props.summary)
}
</script>

<template>
  <button
    type="button"
    :aria-pressed="favorite"
    :aria-label="label"
    :title="label"
    class="flex shrink-0 items-center justify-center rounded-full border-2 border-white/85 transition-transform duration-fast hover:scale-[1.12] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    :class="size === 'sm' ? 'h-[38px] w-[38px]' : 'h-[50px] w-[50px]'"
    :style="{ backgroundColor: favorite ? 'white' : 'rgba(255,255,255,.28)' }"
    @click="onClick"
  >
    <span
      class="block bg-contain bg-center bg-no-repeat"
      :class="size === 'sm' ? 'h-[17px] w-[19px]' : 'h-[23px] w-[26px]'"
      :style="{ backgroundImage: `url(${favorite ? heartFilled : heartOutline})` }"
    />
  </button>
</template>
