import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

/** Cross-feature UI state that belongs to the app shell, not one feature. */
export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    // Exposed read-only (via computed, not the raw ref) so consumers can't
    // bypass toggleSidebar with a direct assignment.
    sidebarCollapsed: computed(() => sidebarCollapsed.value),
    toggleSidebar,
  }
})
