<script setup lang="ts">
withDefaults(defineProps<{ label?: string }>(), { label: 'Cargando' })
</script>

<template>
  <span
    class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
    role="status"
  >
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
