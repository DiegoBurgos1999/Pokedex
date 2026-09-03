import { useQueries, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

import { fetchAbility, fetchPokemonDetail, fetchPokemonSpecies, fetchType } from '../api/pokemonApi'
import type { TypeDto } from '../api/pokemonDto'
import { humanize, resolveAbilityName, toPokemonDetail } from '../mappers/pokemonDetail.mapper'
import { computeWeaknesses } from '../mappers/weaknesses.mapper'
import type { PokemonDetail } from '../model/pokemon.model'

export type PokemonDetailState = 'skeleton' | 'ready' | 'error'

/**
 * A resolved id always has data or an error — unlike the list, there's no
 * "empty" state here. Ability translation and type weaknesses are secondary
 * data: their own loading/failure never blocks or errors the page, they
 * just resolve in and update the view reactively.
 */
export function usePokemonDetail(id: MaybeRefOrGetter<number>) {
  const idRef = computed(() => toValue(id))

  const pokemonQuery = useQuery({
    queryKey: ['pokemon', 'detail', idRef],
    queryFn: () => fetchPokemonDetail(idRef.value),
    staleTime: Infinity,
  })

  const speciesQuery = useQuery({
    queryKey: ['pokemon', 'species', idRef],
    queryFn: () => fetchPokemonSpecies(idRef.value),
    staleTime: Infinity,
  })

  const primaryAbilitySlug = computed(
    () =>
      pokemonQuery.data.value?.abilities.find((a) => a.slot === 1)?.ability.name ??
      pokemonQuery.data.value?.abilities[0]?.ability.name ??
      null,
  )

  const abilityQuery = useQuery({
    queryKey: ['pokemon', 'ability', primaryAbilitySlug],
    queryFn: () => fetchAbility(primaryAbilitySlug.value as string),
    enabled: computed(() => primaryAbilitySlug.value !== null),
    staleTime: Infinity,
  })

  const abilityName = computed(() => {
    if (abilityQuery.data.value) return resolveAbilityName(abilityQuery.data.value)
    return primaryAbilitySlug.value ? humanize(primaryAbilitySlug.value) : ''
  })

  const typeNames = computed(() => pokemonQuery.data.value?.types.map((t) => t.type.name) ?? [])

  const typeQueries = useQueries({
    queries: () =>
      typeNames.value.map((name) => ({
        queryKey: ['pokemon', 'type', name],
        queryFn: () => fetchType(name),
        staleTime: Infinity,
      })),
  })

  const weaknesses = computed(() => {
    const loaded = typeQueries.value.map((q) => q.data).filter((d): d is TypeDto => d !== undefined)
    return loaded.length > 0 ? computeWeaknesses(loaded) : []
  })

  const detail = computed<PokemonDetail | null>(() => {
    const pokemon = pokemonQuery.data.value
    const species = speciesQuery.data.value
    if (!pokemon || !species) return null
    return toPokemonDetail(pokemon, species, abilityName.value, weaknesses.value)
  })

  const state = computed<PokemonDetailState>(() => {
    if (pokemonQuery.isError.value || speciesQuery.isError.value) return 'error'
    if (pokemonQuery.isPending.value || speciesQuery.isPending.value) return 'skeleton'
    return 'ready'
  })

  const retry = (): void => {
    void pokemonQuery.refetch()
    void speciesQuery.refetch()
  }

  return { detail, state, retry }
}
