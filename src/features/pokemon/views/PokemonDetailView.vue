<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import errorIllustration from '@/assets/illustrations/error-state.png'
import FavoriteButton from '@/features/favorites/components/FavoriteButton.vue'
import BaseCard from '@/shared/ui/BaseCard.vue'
import BaseSkeleton from '@/shared/ui/BaseSkeleton.vue'
import TypeChip from '@/shared/ui/TypeChip.vue'
import { formatPokemonNumber } from '@/shared/utils/pad'

import ShareButton from '../components/ShareButton.vue'
import { usePokemonDetail } from '../composables/usePokemonDetail'
import { pokemonCopy } from '../copy'
import { getTypeGradient } from '../model/pokemonTypeTheme'

const route = useRoute()
const id = computed(() => Number(route.params.id))
const backTo = computed(() => (route.query.from === 'favorites' ? '/favorites' : '/pokedex'))

const { detail, state, retry } = usePokemonDetail(id)

const summary = computed(() =>
  detail.value
    ? {
        id: detail.value.id,
        name: detail.value.name,
        sprite: detail.value.sprite,
        types: detail.value.types,
      }
    : null,
)

const heroGradient = computed(() =>
  detail.value ? getTypeGradient(detail.value.types[0] ?? 'normal') : undefined,
)
</script>

<template>
  <div class="px-[var(--page-padding-x)] pt-7.5 pb-10 motion-safe:animate-[fade-up_0.35s_both]">
    <RouterLink
      :to="backTo"
      class="mb-4.5 inline-flex items-center gap-2 font-sans text-sm font-semibold text-ink-muted transition-colors duration-fast hover:text-brand"
    >
      <span aria-hidden="true">←</span> {{ pokemonCopy.backToList }}
    </RouterLink>

    <div
      v-if="state === 'skeleton'"
      class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] gap-7"
    >
      <BaseSkeleton class="h-[420px] rounded-3xl" />
      <BaseSkeleton class="h-[420px] rounded-3xl" />
    </div>

    <div
      v-else-if="state === 'error'"
      class="flex flex-col items-center justify-center gap-3 py-20"
    >
      <img class="h-45 w-45 object-contain" :src="errorIllustration" alt="" />
      <h3 class="text-2xl font-bold">{{ pokemonCopy.errorTitle }}</h3>
      <p class="max-w-md text-center text-base leading-relaxed text-ink-muted">
        {{ pokemonCopy.errorDescription }}
      </p>
      <button
        type="button"
        class="mt-3 rounded-pill bg-brand px-11.5 py-4 font-sans text-base font-semibold text-white shadow-brand"
        @click="retry"
      >
        {{ pokemonCopy.retry }}
      </button>
    </div>

    <div
      v-else-if="detail"
      class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-7"
    >
      <div
        class="relative flex min-h-[420px] max-w-[520px] items-center justify-center overflow-hidden rounded-3xl shadow-modal"
        :style="{ backgroundImage: heroGradient }"
      >
        <div
          class="absolute -top-15 -right-17.5 h-[420px] w-[420px] rounded-[50%_50%_50%_8%] bg-white/22"
        />
        <div
          role="img"
          :aria-label="detail.name"
          class="sprite relative h-62.5 w-62.5 bg-contain bg-center bg-no-repeat drop-shadow-xl motion-safe:animate-[floaty_4s_ease-in-out_infinite]"
          :style="{ backgroundImage: `url(${detail.sprite})` }"
        />
        <FavoriteButton
          v-if="summary"
          :summary="summary"
          size="md"
          class="absolute top-5 right-5"
        />
      </div>

      <div class="min-w-0 rounded-3xl bg-surface px-10 pt-9.5 pb-10.5 shadow-modal">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <p class="mb-0.5 text-base font-semibold text-ink-subtle">
              {{ formatPokemonNumber(detail.id) }}
            </p>
            <h1 class="text-5xl font-bold tracking-tightest capitalize">{{ detail.name }}</h1>
          </div>
          <ShareButton :detail="detail" />
        </div>

        <div class="mb-5.5 flex flex-wrap gap-2.5">
          <TypeChip v-for="type in detail.types" :key="type" :type="type" size="md" />
        </div>

        <p class="mb-6.5 max-w-[640px] text-base leading-relaxed text-ink-secondary">
          {{ detail.description }}
        </p>

        <div class="mb-6.5 h-px bg-divider" />

        <div class="mb-7.5 grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-4.5">
          <div>
            <p class="mb-2 text-xs font-semibold tracking-eyebrow text-ink-subtle">
              ⚖ {{ pokemonCopy.weight }}
            </p>
            <BaseCard class="text-xl font-semibold"
              >{{ detail.weightKg.toString().replace('.', ',') }} kg</BaseCard
            >
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold tracking-eyebrow text-ink-subtle">
              ↕ {{ pokemonCopy.height }}
            </p>
            <BaseCard class="text-xl font-semibold"
              >{{ detail.heightM.toString().replace('.', ',') }} m</BaseCard
            >
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold tracking-eyebrow text-ink-subtle">
              ⊞ {{ pokemonCopy.category }}
            </p>
            <BaseCard class="text-md font-semibold">{{ detail.category }}</BaseCard>
          </div>
          <div>
            <p class="mb-2 text-xs font-semibold tracking-eyebrow text-ink-subtle">
              ✦ {{ pokemonCopy.ability }}
            </p>
            <BaseCard class="text-md font-semibold">{{ detail.ability }}</BaseCard>
          </div>
        </div>

        <div v-if="detail.genderRate !== null" class="mb-7.5 max-w-[640px]">
          <p class="mb-2.5 text-center text-xs font-semibold tracking-eyebrow text-ink-subtle">
            {{ pokemonCopy.gender }}
          </p>
          <div class="flex h-2.5 overflow-hidden rounded-pill bg-gender-female">
            <div
              class="bg-gender-male transition-[width] duration-slow ease-out-expo"
              :style="{ width: `${(detail.genderRate / 8) * 100}%` }"
            />
          </div>
          <div class="mt-2 flex justify-between text-sm text-ink-secondary">
            <span>♂ {{ (100 - (detail.genderRate / 8) * 100).toString().replace('.', ',') }}%</span>
            <span>♀ {{ ((detail.genderRate / 8) * 100).toString().replace('.', ',') }}%</span>
          </div>
        </div>

        <h2 class="mb-3.5 text-2xl font-bold">{{ pokemonCopy.weaknesses }}</h2>
        <div class="flex flex-wrap gap-2.5">
          <TypeChip v-for="type in detail.weaknesses" :key="type" :type="type" size="md" />
        </div>
      </div>
    </div>
  </div>
</template>
