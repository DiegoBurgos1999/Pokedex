import { flushPromises } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { AbilityDto, PokemonDto, PokemonSpeciesDto, TypeDto } from '../../api/pokemonDto'
import { usePokemonDetail } from '../usePokemonDetail'
import { mountComposable } from './testHost'

const { fetchPokemonDetail, fetchPokemonSpecies, fetchAbility, fetchType } = vi.hoisted(() => ({
  fetchPokemonDetail: vi.fn(),
  fetchPokemonSpecies: vi.fn(),
  fetchAbility: vi.fn(),
  fetchType: vi.fn(),
}))

vi.mock('../../api/pokemonApi', async () => {
  const actual = await vi.importActual<object>('../../api/pokemonApi')
  return { ...actual, fetchPokemonDetail, fetchPokemonSpecies, fetchAbility, fetchType }
})

const pikachu: PokemonDto = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: { front_default: 'x.png' },
  types: [{ type: { name: 'electric', url: '' } }],
  abilities: [{ is_hidden: false, slot: 1, ability: { name: 'static', url: '' } }],
}

const species: PokemonSpeciesDto = {
  gender_rate: 4,
  flavor_text_entries: [{ flavor_text: 'Zap!', language: { name: 'es', url: '' } }],
  genera: [{ genus: 'Pokémon Ratón', language: { name: 'es', url: '' } }],
}

const staticAbility: AbilityDto = {
  name: 'static',
  names: [{ name: 'Elec. Estática', language: { name: 'es', url: '' } }],
}

const electricType: TypeDto = {
  name: 'electric',
  damage_relations: {
    double_damage_from: [{ name: 'ground', url: '' }],
    half_damage_from: [],
    no_damage_from: [],
  },
  pokemon: [],
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('usePokemonDetail', () => {
  it('combines pokemon, species, ability and weakness data once everything resolves', async () => {
    fetchPokemonDetail.mockResolvedValue(pikachu)
    fetchPokemonSpecies.mockResolvedValue(species)
    fetchAbility.mockResolvedValue(staticAbility)
    fetchType.mockResolvedValue(electricType)

    const { result } = mountComposable(() => usePokemonDetail(25))
    await flushPromises()
    await flushPromises()

    expect(result.state.value).toBe('ready')
    expect(result.detail.value).toEqual({
      id: 25,
      name: 'pikachu',
      sprite: 'x.png',
      types: ['electric'],
      weightKg: 6,
      heightM: 0.4,
      category: 'Pokémon Ratón',
      ability: 'Elec. Estática',
      genderRate: 4,
      description: 'Zap!',
      weaknesses: ['ground'],
    })
  })

  it('goes to the error state when the core pokemon fetch fails', async () => {
    fetchPokemonDetail.mockRejectedValue(new Error('boom'))
    fetchPokemonSpecies.mockResolvedValue(species)

    const { result } = mountComposable(() => usePokemonDetail(25))
    await flushPromises()

    expect(result.state.value).toBe('error')
    expect(result.detail.value).toBeNull()
  })

  it('falls back to a humanized ability slug when the ability translation fails', async () => {
    fetchPokemonDetail.mockResolvedValue(pikachu)
    fetchPokemonSpecies.mockResolvedValue(species)
    fetchAbility.mockRejectedValue(new Error('no translation'))
    fetchType.mockResolvedValue(electricType)

    const { result } = mountComposable(() => usePokemonDetail(25))
    await flushPromises()
    await flushPromises()

    expect(result.detail.value?.ability).toBe('Static')
  })
})
