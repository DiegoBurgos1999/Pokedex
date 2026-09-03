<script setup lang="ts">
defineProps<{ placeholder?: string; label?: string }>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div
    class="flex h-[var(--control-height)] min-w-0 flex-1 items-center gap-3 rounded-pill border border-border bg-surface px-5 shadow-control"
  >
    <span class="text-lg text-ink-faint" aria-hidden="true">⌕</span>
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :aria-label="label ?? placeholder"
      class="w-full min-w-0 border-none bg-transparent font-sans text-base text-ink outline-none placeholder:text-ink-subtle"
    />
  </div>
</template>
