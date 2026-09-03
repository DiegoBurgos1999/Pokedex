<script setup lang="ts">
import { computed, ref } from 'vue'

import { getTypeTheme } from '@/features/pokemon/model/pokemonTypeTheme'
import { useFocusTrap } from '@/shared/composables/useFocusTrap'
import { capitalize } from '@/shared/utils/capitalize'
import { formatPokemonNumber } from '@/shared/utils/pad'

import { favoritesCopy } from '../copy'
import { useFavoriteToggle } from '../composables/useFavoriteToggle'

const { pendingRemoval, confirmRemoval, cancelRemoval } = useFavoriteToggle()

const dialog = ref<HTMLElement | null>(null)
const isOpen = computed(() => pendingRemoval.value !== null)

useFocusTrap(dialog, isOpen, cancelRemoval)

const theme = computed(() =>
  pendingRemoval.value ? getTypeTheme(pendingRemoval.value.types[0] ?? 'normal') : null,
)
</script>

<template>
  <div
    v-if="pendingRemoval"
    class="fixed inset-0 z-45 flex items-center justify-center bg-overlay p-10 backdrop-blur-[6px] motion-safe:animate-[fade-up_0.2s_both]"
  >
    <div
      ref="dialog"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="remove-favorite-title"
      class="w-full max-w-[440px] rounded-2xl bg-surface-modal px-8 pt-8 pb-7 text-center shadow-modal motion-safe:animate-[pop_0.28s_cubic-bezier(.2,.8,.2,1)_both]"
    >
      <div
        class="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full"
        :style="{ backgroundColor: theme?.soft }"
      >
        <div
          class="sprite h-20 w-20 bg-contain bg-center bg-no-repeat"
          :style="{ backgroundImage: `url(${pendingRemoval.sprite})` }"
        />
      </div>
      <p class="mb-1 text-sm font-semibold text-ink-subtle">
        {{ formatPokemonNumber(pendingRemoval.id) }}
      </p>
      <h2 id="remove-favorite-title" class="mb-2.5 text-2xl font-bold">
        {{ favoritesCopy.confirmTitle(capitalize(pendingRemoval.name)) }}
      </h2>
      <p class="mb-6 text-base leading-relaxed text-ink-muted">
        {{ favoritesCopy.confirmDescription }}
      </p>
      <div class="flex flex-col gap-3">
        <button
          type="button"
          class="rounded-pill bg-accent py-4 font-sans text-base font-semibold text-white shadow-danger transition-transform duration-fast hover:-translate-y-0.5"
          @click="confirmRemoval"
        >
          {{ favoritesCopy.confirmYes }}
        </button>
        <button
          type="button"
          class="rounded-pill bg-neutral-button py-4 font-sans text-base font-semibold text-ink transition-colors duration-fast hover:bg-neutral-button-hover"
          @click="cancelRemoval"
        >
          {{ favoritesCopy.confirmCancel }}
        </button>
      </div>
    </div>
  </div>
</template>
