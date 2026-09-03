import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Cross-feature UI state that belongs to the app shell, not one feature. */
export const useUiStore = defineStore('ui', () => {
  const sidebarCollapsed = ref(false)

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return { sidebarCollapsed, toggleSidebar }
})
