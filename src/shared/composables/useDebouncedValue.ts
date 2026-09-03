import { onScopeDispose, type Ref, ref, watch } from 'vue'

/**
 * Mirrors `source` into a new ref, but delays each propagation by `delayMs`.
 * Bursts of rapid changes (e.g. keystrokes) collapse into a single update.
 * The returned ref is read-only from the caller's perspective; write to
 * `source` instead.
 */
export function useDebouncedValue<T>(source: Ref<T>, delayMs = 300): { debounced: Ref<T> } {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = value
    }, delayMs)
  })

  // Without this, a component that unmounts mid-debounce (types, then
  // navigates away before `delayMs` elapses) leaves a pending timer that
  // later writes to an orphaned ref.
  onScopeDispose(() => clearTimeout(timeoutId))

  return { debounced }
}
