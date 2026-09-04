<script setup lang="ts">
import errorIllustration from '@/assets/illustrations/error-state.png'

defineProps<{
  title: string
  description: string
  retryLabel: string
}>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-3 py-20 motion-safe:animate-[fade-up_0.4s_both]"
  >
    <img class="h-45 w-45 object-contain" :src="errorIllustration" alt="" />
    <h3 class="mt-2 text-2xl font-bold">{{ title }}</h3>
    <p class="max-w-md text-center text-base leading-relaxed text-ink-muted">
      {{ description }}
    </p>
    <button
      type="button"
      class="mt-3 rounded-pill bg-brand px-11.5 py-4 font-sans text-base font-semibold text-white shadow-brand transition-transform duration-fast hover:-translate-y-0.5"
      @click="emit('retry')"
    >
      {{ retryLabel }}
    </button>
  </div>
</template>
