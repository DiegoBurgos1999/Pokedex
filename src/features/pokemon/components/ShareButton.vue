<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'

import { pokemonCopy } from '../copy'
import type { PokemonDetail } from '../model/pokemon.model'
import { buildShareText } from '../utils/buildShareText'

const props = defineProps<{ detail: PokemonDetail }>()

type Status = 'idle' | 'copied' | 'failed'

const status = ref<Status>('idle')
let resetTimeout: ReturnType<typeof setTimeout> | undefined

const onClick = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(buildShareText(props.detail))
    status.value = 'copied'
  } catch (error) {
    console.error('No se pudo copiar al portapapeles', error)
    status.value = 'failed'
  }
  clearTimeout(resetTimeout)
  resetTimeout = setTimeout(() => {
    status.value = 'idle'
  }, 1500)
}

onBeforeUnmount(() => clearTimeout(resetTimeout))
</script>

<template>
  <button
    type="button"
    class="flex items-center gap-2 rounded-pill border border-border bg-surface px-4 py-2 font-sans text-sm font-semibold text-ink shadow-control transition-colors duration-fast hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    @click="onClick"
  >
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.6 10.6l6.8-3.8M8.6 13.4l6.8 3.8" />
    </svg>
    {{
      status === 'copied'
        ? pokemonCopy.shareCopied
        : status === 'failed'
          ? pokemonCopy.shareFailed
          : pokemonCopy.share
    }}
  </button>
</template>
