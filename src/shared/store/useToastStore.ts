import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastVariant = 'success' | 'error'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

const DEFAULT_DURATION_MS = 3000

/**
 * A minimal toast queue — no external toast library. `ToastContainer.vue` is
 * the only reader; any composable or component can call `show` to surface a
 * transient confirmation without owning presentation state itself.
 */
export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])
  let nextId = 0

  const dismiss = (id: number): void => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const show = (
    message: string,
    variant: ToastVariant = 'success',
    durationMs = DEFAULT_DURATION_MS,
  ): void => {
    // Rapid identical actions (e.g. toggling the same favorite twice) would
    // otherwise stack duplicate toasts, each with its own dismiss timer.
    if (toasts.value.some((toast) => toast.message === message && toast.variant === variant)) {
      return
    }
    const id = nextId++
    toasts.value.push({ id, message, variant })
    setTimeout(() => dismiss(id), durationMs)
  }

  return { toasts, show, dismiss }
})
