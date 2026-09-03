<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps<{ title: string }>()
</script>

<template>
  <div
    class="flex min-h-full flex-col items-center justify-center gap-4 px-[var(--page-padding-x)] py-30 motion-safe:animate-[fade-up_0.4s_both]"
  >
    <div
      class="relative h-26 w-26 rounded-full border-[7px] border-border-strong motion-safe:animate-[floaty_3.6s_ease-in-out_infinite]"
      style="
        background: linear-gradient(
          var(--color-surface-muted) 0 44%,
          var(--color-border-strong) 44% 56%,
          var(--color-placeholder-shine) 56% 100%
        );
      "
    >
      <div
        class="absolute top-1/2 left-1/2 h-[30px] w-[30px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[7px] border-border-strong bg-surface"
      />
    </div>
    <h1 class="mt-3 text-4xl font-bold">{{ title }}</h1>
    <p class="max-w-md text-center text-md leading-relaxed text-ink-muted">
      Próximamente. Estamos trabajando en esta sección; vuelve pronto para descubrirla.
    </p>
    <RouterLink
      to="/pokedex"
      class="mt-3 rounded-pill border border-border px-9 py-4 font-sans text-base font-semibold text-ink transition-colors duration-fast hover:border-brand hover:text-brand"
    >
      Volver a Pokedex
    </RouterLink>
  </div>
</template>
