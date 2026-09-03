import { type Ref, ref, watch } from 'vue'

/**
 * Mirrors `source` into a new ref, but delays each propagation by `delayMs`.
 * Bursts of rapid changes (e.g. keystrokes) collapse into a single update.
 * The returned ref is read-only from the caller's perspective; write to
 * `source` instead.
 */
export function useDebouncedValue<T>(source: Ref<T>, delayMs = 300): Ref<T> {
  const debounced = ref(source.value) as Ref<T>
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  watch(source, (value) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      debounced.value = value
    }, delayMs)
  })

  return debounced
}
