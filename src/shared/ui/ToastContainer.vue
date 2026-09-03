<script setup lang="ts">
import BaseToast from './BaseToast.vue'
import { useToastStore } from '../store/useToastStore'

const store = useToastStore()
</script>

<template>
  <div
    class="pointer-events-none fixed inset-x-0 bottom-8 z-50 flex flex-col items-center gap-2"
    aria-live="polite"
    role="region"
  >
    <TransitionGroup name="toast">
      <div v-for="toast in store.toasts" :key="toast.id" class="pointer-events-auto">
        <BaseToast
          :message="toast.message"
          :variant="toast.variant"
          @dismiss="store.dismiss(toast.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    transform var(--duration-base) var(--ease-out-expo),
    opacity var(--duration-base) var(--ease-out-expo);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
