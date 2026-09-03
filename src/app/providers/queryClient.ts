import type { VueQueryPluginOptions } from '@tanstack/vue-query'

export const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        // Pokemon data is effectively immutable, so refetching on focus only
        // burns requests. Individual queries override staleTime as needed.
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 5 * 60 * 1000,
      },
    },
  },
}
