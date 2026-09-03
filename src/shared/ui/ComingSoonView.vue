<script setup lang="ts">
import { RouterLink } from 'vue-router'

import comingSoonIllustration from '@/assets/illustrations/coming-soon.png'

defineProps<{ title: string }>()
</script>

<template>
  <div
    class="flex min-h-full flex-col items-center justify-center gap-4 px-[var(--page-padding-x)] py-30 motion-safe:animate-[fade-up_0.4s_both]"
  >
    <img
      class="h-60 w-60 object-contain motion-safe:animate-[floaty_3.6s_ease-in-out_infinite]"
      :src="comingSoonIllustration"
      :alt="title"
    />
    <h1 class="mt-3 text-4xl font-bold">{{ title }}</h1>
    <p class="text-xl font-semibold text-brand">¡Muy pronto disponible!</p>
    <p class="max-w-md text-center text-md leading-relaxed text-ink-muted">
      Estamos trabajando para traerte esta sección. Vuelve más adelante para descubrir todas las
      novedades.
    </p>
    <RouterLink
      to="/pokedex"
      class="mt-3 rounded-pill border border-border px-9 py-4 font-sans text-base font-semibold text-ink transition-colors duration-fast hover:border-brand hover:text-brand"
    >
      Volver a Pokedex
    </RouterLink>
  </div>
</template>
