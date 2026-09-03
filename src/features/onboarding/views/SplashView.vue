<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'

import { onboardingCopy } from '../copy'
import { useOnboardingStore } from '../store/useOnboardingStore'

const SPLASH_DURATION_MS = 1400

const router = useRouter()
const onboardingStore = useOnboardingStore()

let timeoutId: ReturnType<typeof setTimeout>

onMounted(() => {
  timeoutId = setTimeout(() => {
    void router.replace(onboardingStore.hasSeenOnboarding ? '/pokedex' : '/onboarding')
  }, SPLASH_DURATION_MS)
})

onBeforeUnmount(() => clearTimeout(timeoutId))
</script>

<template>
  <div class="flex h-screen flex-col items-center justify-center gap-8.5 bg-surface-modal">
    <div
      class="relative h-37.5 w-37.5 rounded-full border-7 border-ink motion-safe:animate-[pokeball-spin_1.6s_cubic-bezier(.5,.05,.5,.95)_infinite]"
      style="
        background: linear-gradient(
          var(--color-accent) 0 45%,
          var(--color-ink) 45% 55%,
          var(--color-surface) 55% 100%
        );
      "
    >
      <div
        class="absolute top-1/2 left-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full border-7 border-ink bg-surface"
      />
    </div>
    <p
      class="text-base font-semibold tracking-[.2em] text-ink-subtle uppercase motion-safe:animate-[pokeball-pulse_1.6s_ease-in-out_infinite]"
    >
      {{ onboardingCopy.loading }}
    </p>
  </div>
</template>
