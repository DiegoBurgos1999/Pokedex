import { defineStore } from 'pinia'
import { ref } from 'vue'

/** In-memory only, like favorites — replays the onboarding flow on reload. */
export const useOnboardingStore = defineStore('onboarding', () => {
  const hasSeenOnboarding = ref(false)

  const markOnboardingSeen = (): void => {
    hasSeenOnboarding.value = true
  }

  return { hasSeenOnboarding, markOnboardingSeen }
})
