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
        // Vue Query's default 'online' mode *pauses* a query indefinitely
        // while `navigator.onLine` is false instead of letting it fail —
        // fetchStatus sits at "paused" forever, isPending stays true, and
        // nothing ever reaches an error state. That's an undocumented fifth
        // "silent" state this app's design explicitly rules out (every
        // failure must show a message plus a retry action). 'always' makes
        // a query genuinely attempt the request and fail normally when
        // there's no connection, so the existing error/retry UI handles it.
        networkMode: 'always',
      },
    },
  },
}
