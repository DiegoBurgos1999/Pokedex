<script setup lang="ts">
import BaseButton from '@/shared/ui/BaseButton.vue'

import { pokemonCopy } from '../copy'

defineEmits<{ clear: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3.5 py-22 motion-safe:animate-[fade-up_0.4s_both]"
  >
    <div
      class="relative h-30 w-30 rounded-full border-8 border-border-strong motion-safe:animate-[floaty_3.4s_ease-in-out_infinite]"
      style="
        background: linear-gradient(
          var(--color-surface-muted) 0 44%,
          var(--color-border-strong) 44% 56%,
          var(--color-placeholder-shine) 56% 100%
        );
      "
    >
      <div
        class="absolute top-1/2 left-1/2 h-8.5 w-8.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-8 border-border-strong bg-surface"
      />
    </div>
    <h3 class="mt-2.5 text-2xl font-bold">{{ pokemonCopy.emptyTitle }}</h3>
    <p class="max-w-md text-center text-base leading-relaxed text-ink-muted">
      {{ pokemonCopy.emptyDescription }}
    </p>
    <BaseButton class="mt-2.5" @click="$emit('clear')">{{ pokemonCopy.clearSearch }}</BaseButton>
  </div>
</template>
