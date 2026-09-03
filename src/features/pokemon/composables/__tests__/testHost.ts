import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

/**
 * Composables under test call `useQuery`/`useQueries`, which need an
 * injected QueryClient. Mounting a throwaway host component is the
 * standard way to run a composable inside that app context in isolation.
 */
export function mountComposable<T>(composable: () => T) {
  let result!: T
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })

  const wrapper = mount(
    defineComponent({
      setup() {
        result = composable()
        return () => null
      },
    }),
    { global: { plugins: [[VueQueryPlugin, { queryClient }]] } },
  )

  return { result, wrapper, queryClient }
}
