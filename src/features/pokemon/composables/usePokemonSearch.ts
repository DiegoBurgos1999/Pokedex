import { ref } from 'vue'

import { useDebouncedValue } from '@/shared/composables/useDebouncedValue'

/**
 * PokéAPI has no search endpoint; search happens client-side against the
 * cached index. The debounce keeps that filtering from re-running on every
 * keystroke.
 */
export function usePokemonSearch(delayMs = 300) {
  const query = ref('')
  const debouncedQuery = useDebouncedValue(query, delayMs)

  return { query, debouncedQuery }
}
