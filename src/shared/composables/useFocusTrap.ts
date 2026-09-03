import { nextTick, watch, type Ref } from 'vue'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps Tab/Shift+Tab focus cycling inside `container` while `active` is
 * true, calls `onEscape` on the Escape key, and returns focus to whatever
 * was focused before the trap activated once it deactivates. Used by modal
 * dialogs (filters, confirm-removal) per the project's accessibility
 * baseline.
 */
export function useFocusTrap(
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape: () => void,
) {
  let previouslyFocused: HTMLElement | null = null

  const focusables = (): HTMLElement[] =>
    container.value
      ? Array.from(container.value.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
      : []

  const onKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onEscape()
      return
    }

    if (event.key !== 'Tab') return

    const elements = focusables()
    if (elements.length === 0) return

    const first = elements[0]
    const last = elements[elements.length - 1]
    const current = document.activeElement

    if (event.shiftKey && current === first) {
      event.preventDefault()
      last?.focus()
    } else if (!event.shiftKey && current === last) {
      event.preventDefault()
      first?.focus()
    }
  }

  watch(
    active,
    async (isActive) => {
      if (isActive) {
        previouslyFocused = document.activeElement as HTMLElement | null
        document.addEventListener('keydown', onKeydown)
        await nextTick()
        focusables()[0]?.focus()
      } else {
        document.removeEventListener('keydown', onKeydown)
        previouslyFocused?.focus()
        previouslyFocused = null
      }
    },
    { immediate: true },
  )
}
