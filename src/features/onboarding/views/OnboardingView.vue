<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { onboardingCopy } from '../copy'
import { useOnboardingStore } from '../store/useOnboardingStore'

const router = useRouter()
const onboardingStore = useOnboardingStore()

const step = ref<0 | 1>(0)

const shiftPercent = computed(() => (step.value === 0 ? '0%' : '-50%'))
const buttonLabel = computed(() =>
  step.value === 0 ? onboardingCopy.continueLabel : onboardingCopy.startLabel,
)

const finish = (): void => {
  onboardingStore.markOnboardingSeen()
  void router.replace('/pokedex')
}

const next = (): void => {
  if (step.value === 0) step.value = 1
  else finish()
}
</script>

<template>
  <div class="flex h-screen items-center justify-center bg-canvas p-12">
    <div class="w-full max-w-235 overflow-hidden rounded-3xl bg-surface-modal shadow-modal">
      <div class="overflow-hidden">
        <div
          class="flex w-[200%] transition-transform duration-500 ease-out-expo"
          :style="{ transform: `translateX(${shiftPercent})` }"
        >
          <div
            v-for="(item, index) in onboardingCopy.steps"
            :key="index"
            class="grid w-1/2 shrink-0 grid-cols-2 items-center gap-10 px-15 py-14"
          >
            <div class="flex h-75 items-center justify-center rounded-3xl bg-surface-tint">
              <img
                class="h-60 w-60 object-contain motion-safe:animate-[floaty_3.6s_ease-in-out_infinite]"
                :src="item.illustration"
                :alt="item.title"
              />
            </div>
            <div>
              <p class="mb-2.5 text-xs font-bold tracking-[.16em] text-brand uppercase">
                {{ item.eyebrow }}
              </p>
              <h2 class="mb-4 text-5xl leading-tight font-bold tracking-tightest">
                {{ item.title }}
              </h2>
              <p class="text-base leading-relaxed text-ink-muted">{{ item.body }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center gap-5.5 px-15 pb-11.5">
        <div class="flex items-center gap-2">
          <button
            v-for="dotStep in [0, 1] as const"
            :key="dotStep"
            type="button"
            :aria-label="`Ir al paso ${dotStep + 1}`"
            class="h-2 rounded-pill transition-[width,background-color] duration-base"
            :class="step === dotStep ? 'w-7.5 bg-brand-deep' : 'w-2 bg-dot-inactive'"
            @click="step = dotStep"
          />
        </div>
        <button
          type="button"
          class="w-full max-w-130 rounded-pill bg-brand py-5 font-sans text-lg font-semibold text-white shadow-brand transition-transform duration-fast hover:-translate-y-0.5"
          @click="next"
        >
          {{ buttonLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
