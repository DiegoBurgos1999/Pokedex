<script setup lang="ts">
import { RouterLink } from 'vue-router'

import favoritosIcon from '@/assets/icons/favoritos.png'

import { favoritesCopy } from '../copy'
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3.5 py-20 motion-safe:animate-[fade-up_0.4s_both]"
  >
    <div
      class="h-[68px] w-19 bg-contain bg-center bg-no-repeat opacity-20 motion-safe:animate-[floaty_3.4s_ease-in-out_infinite]"
      :style="{ backgroundImage: `url(${favoritosIcon})` }"
    />
    <h3 class="mt-1 text-2xl font-bold">{{ favoritesCopy.emptyTitle }}</h3>
    <p class="max-w-md text-center text-base leading-relaxed text-ink-muted">
      {{ favoritesCopy.emptyDescription }}
    </p>
    <RouterLink
      to="/pokedex"
      class="mt-2 rounded-pill bg-brand px-9 py-4 font-sans text-base font-semibold text-white shadow-brand"
    >
      {{ favoritesCopy.exploreAction }}
    </RouterLink>
  </div>
</template>
