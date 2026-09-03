<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import favoritosIcon from '@/assets/icons/favoritos.png'
import perfilIcon from '@/assets/icons/perfil.png'
import regionesIcon from '@/assets/icons/regiones.png'
import RemoveFavoriteDialog from '@/features/favorites/components/RemoveFavoriteDialog.vue'
import { useFavoritesStore } from '@/features/favorites/store/useFavoritesStore'
import { useMediaQuery } from '@/shared/composables/useMediaQuery'
import { useUiStore } from '@/shared/store/useUiStore'
import ToastContainer from '@/shared/ui/ToastContainer.vue'

const route = useRoute()
const ui = useUiStore()
const favoritesStore = useFavoritesStore()

// Desktop-first design: below 1024px the sidebar degrades to icon-only,
// regardless of the user's manual collapse preference.
const { matches: isNarrowViewport } = useMediaQuery('(max-width: 1023px)')
const collapsed = computed(() => ui.sidebarCollapsed || isNarrowViewport.value)

const main = ref<HTMLElement | null>(null)
const scrolled = ref(false)

const onScroll = (): void => {
  scrolled.value = (main.value?.scrollTop ?? 0) > 260
}

const scrollToTop = (): void => {
  main.value?.scrollTo({ top: 0, behavior: 'smooth' })
}

const cameFromFavorites = computed(() => route.query.from === 'favorites')
const isDexActive = computed(
  () => route.name === 'pokedex' || (route.name === 'pokemon-detail' && !cameFromFavorites.value),
)
const isFavActive = computed(
  () => route.name === 'favorites' || (route.name === 'pokemon-detail' && cameFromFavorites.value),
)
</script>

<template>
  <div class="flex h-screen min-h-190 w-full overflow-hidden bg-canvas font-sans text-ink">
    <aside
      class="z-20 flex shrink-0 flex-col gap-6.5 bg-surface p-5.5 shadow-sidebar transition-[width] duration-slow ease-out-expo"
      :style="{
        width: collapsed ? 'var(--sidebar-width-collapsed)' : 'var(--sidebar-width)',
      }"
    >
      <div class="flex min-h-11 items-center gap-3">
        <button
          type="button"
          class="flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-1 rounded-sm bg-surface-sunken text-ink transition-colors duration-fast hover:bg-surface-sunken-hover"
          aria-label="Alternar menú"
          @click="ui.toggleSidebar"
        >
          <span class="block h-0.5 w-4.5 rounded-full bg-current" />
          <span class="block h-0.5 w-4.5 rounded-full bg-current" />
          <span class="block h-0.5 w-4.5 rounded-full bg-current" />
        </button>
        <div
          class="flex items-center gap-2.5 overflow-hidden transition-opacity duration-fast"
          :class="collapsed ? 'opacity-0' : 'opacity-100'"
        >
          <div
            class="h-6.5 w-6.5 shrink-0 rounded-full border-2 border-ink"
            style="
              background: linear-gradient(
                var(--color-accent) 0 45%,
                var(--color-ink) 45% 55%,
                var(--color-surface) 55% 100%
              );
            "
          />
          <span class="text-lg font-bold whitespace-nowrap">Pokédex</span>
        </div>
      </div>

      <nav class="flex flex-col gap-2">
        <RouterLink
          to="/pokedex"
          class="flex items-center gap-3.5 rounded-md px-3.5 py-3.5 text-base font-semibold transition-colors duration-fast"
          :class="
            isDexActive ? 'bg-brand-soft text-brand' : 'text-nav-inactive hover:bg-surface-sunken'
          "
        >
          <span class="w-6 shrink-0 text-center text-lg">⌂</span>
          <span
            class="whitespace-nowrap transition-opacity duration-fast"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >Pokedex</span
          >
        </RouterLink>
        <RouterLink
          to="/regions"
          class="flex items-center gap-3.5 rounded-md px-3.5 py-3.5 text-base font-semibold transition-colors duration-fast"
          :class="
            route.name === 'regions'
              ? 'bg-brand-soft text-brand'
              : 'text-nav-inactive hover:bg-surface-sunken'
          "
        >
          <span
            class="h-5 w-6 shrink-0 bg-contain bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${regionesIcon})` }"
          />
          <span
            class="whitespace-nowrap transition-opacity duration-fast"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >Regiones</span
          >
        </RouterLink>
        <RouterLink
          to="/favorites"
          class="flex items-center gap-3.5 rounded-md px-3.5 py-3.5 text-base font-semibold transition-colors duration-fast"
          :class="
            isFavActive ? 'bg-brand-soft text-brand' : 'text-nav-inactive hover:bg-surface-sunken'
          "
        >
          <span
            class="h-5 w-6 shrink-0 bg-contain bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${favoritosIcon})` }"
          />
          <span
            class="whitespace-nowrap transition-opacity duration-fast"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >Favoritos</span
          >
          <span
            class="ml-auto rounded-pill bg-accent px-2.5 py-0.5 text-xs font-bold text-white transition-opacity duration-fast"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
          >
            {{ favoritesStore.count }}
          </span>
        </RouterLink>
        <RouterLink
          to="/profile"
          class="flex items-center gap-3.5 rounded-md px-3.5 py-3.5 text-base font-semibold transition-colors duration-fast"
          :class="
            route.name === 'profile'
              ? 'bg-brand-soft text-brand'
              : 'text-nav-inactive hover:bg-surface-sunken'
          "
        >
          <span
            class="h-5 w-6 shrink-0 bg-contain bg-center bg-no-repeat"
            :style="{ backgroundImage: `url(${perfilIcon})` }"
          />
          <span
            class="whitespace-nowrap transition-opacity duration-fast"
            :class="collapsed ? 'opacity-0' : 'opacity-100'"
            >Perfil</span
          >
        </RouterLink>
      </nav>

      <div v-if="!collapsed" class="mt-auto rounded-lg bg-surface-muted p-4">
        <p class="mb-1.5 text-sm font-bold">Datos de PokéAPI</p>
        <p class="text-xs leading-relaxed text-ink-muted">
          151 Pokémon de la primera generación disponibles.
        </p>
      </div>
    </aside>

    <main ref="main" class="relative flex-1 overflow-y-auto pb-22" @scroll="onScroll">
      <RouterView />

      <button
        v-if="scrolled"
        type="button"
        title="Volver al inicio"
        class="fixed right-9 bottom-8.5 z-15 flex h-14.5 w-14.5 items-center justify-center rounded-full bg-brand text-white shadow-brand transition-transform duration-fast hover:-translate-y-1 motion-safe:animate-[pop_0.3s_both]"
        @click="scrollToTop"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M12 19V6" />
          <path d="M5.5 12.5L12 6l6.5 6.5" />
        </svg>
      </button>
    </main>

    <RemoveFavoriteDialog />
    <ToastContainer />
  </div>
</template>
