import { onBeforeUnmount, ref, type Ref } from 'vue'

/** Reactive `window.matchMedia` result, kept in sync as the viewport changes. */
export function useMediaQuery(query: string): Ref<boolean> {
  const mql = window.matchMedia(query)
  const matches = ref(mql.matches)

  const onChange = (event: MediaQueryListEvent): void => {
    matches.value = event.matches
  }

  mql.addEventListener('change', onChange)
  onBeforeUnmount(() => mql.removeEventListener('change', onChange))

  return matches
}
