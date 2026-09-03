import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'splash',
    component: () => import('@/features/onboarding/views/SplashView.vue'),
  },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('@/features/onboarding/views/OnboardingView.vue'),
  },
  {
    path: '/',
    component: () => import('../layouts/AppLayout.vue'),
    children: [
      {
        path: 'pokedex',
        name: 'pokedex',
        component: () => import('@/features/pokemon/views/PokedexView.vue'),
      },
      {
        path: 'pokemon/:id',
        name: 'pokemon-detail',
        component: () => import('@/features/pokemon/views/PokemonDetailView.vue'),
        props: true,
      },
      {
        path: 'favorites',
        name: 'favorites',
        component: () => import('@/features/favorites/views/FavoritesView.vue'),
      },
      {
        path: 'regions',
        name: 'regions',
        component: () => import('@/shared/ui/ComingSoonView.vue'),
        props: { title: 'Regiones' },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/shared/ui/ComingSoonView.vue'),
        props: { title: 'Perfil' },
      },
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
