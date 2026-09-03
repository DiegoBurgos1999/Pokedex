<script setup lang="ts">
import type { ToastVariant } from '../store/useToastStore'

defineProps<{ message: string; variant: ToastVariant }>()
defineEmits<{ dismiss: [] }>()
</script>

<template>
  <div
    role="status"
    class="flex items-center gap-3 rounded-lg bg-ink py-3 pr-3 pl-4 text-white shadow-modal"
  >
    <span
      class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      :class="variant === 'success' ? 'bg-success' : 'bg-accent'"
      aria-hidden="true"
    >
      {{ variant === 'success' ? '✓' : '✕' }}
    </span>
    <p class="text-sm font-semibold">{{ message }}</p>
    <button
      type="button"
      class="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-fast hover:bg-white/10 hover:text-white"
      aria-label="Cerrar notificación"
      @click="$emit('dismiss')"
    >
      ✕
    </button>
  </div>
</template>
