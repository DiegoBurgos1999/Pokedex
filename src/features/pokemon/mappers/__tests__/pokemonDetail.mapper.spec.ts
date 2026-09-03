import { describe, expect, it } from 'vitest'

import type { AbilityDto, PokemonDto, PokemonSpeciesDto } from '../../api/pokemonDto'
import {
  resolveAbilityName,
  resolveDescription,
  resolveGenderRate,
  resolveGenus,
  toPokemonDetail,
} from '../pokemonDetail.mapper'

const pokemon: PokemonDto = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: { front_default: 'x.png' },
  types: [{ type: { name: 'electric', url: '' } }],
  abilities: [],
}

const species: PokemonSpeciesDto = {
  gender_rate: 4,
  flavor_text_entries: [
    { flavor_text: 'Cuando varios\nse juntan.\f', language: { name: 'es', url: '' } },
    { flavor_text: 'When several gather.', language: { name: 'en', url: '' } },
  ],
  genera: [
    { genus: 'Pokémon Ratón', language: { name: 'es', url: '' } },
    { genus: 'Mouse Pokémon', language: { name: 'en', url: '' } },
  ],
}

const ability: AbilityDto = {
  name: 'static',
  names: [
    { name: 'Elec. Estática', language: { name: 'es', url: '' } },
    { name: 'Static', language: { name: 'en', url: '' } },
  ],
}

describe('toPokemonDetail', () => {
  it('combines pokemon, species and ability data into the domain model', () => {
    const detail = toPokemonDetail(pokemon, species, resolveAbilityName(ability), ['ground'])

    expect(detail).toEqual({
      id: 25,
      name: 'pikachu',
      sprite: 'x.png',
      types: ['electric'],
      weightKg: 6,
      heightM: 0.4,
      category: 'Pokémon Ratón',
      ability: 'Elec. Estática',
      genderRate: 4,
      description: 'Cuando varios se juntan.',
      weaknesses: ['ground'],
    })
  })
})

describe('resolveGenus', () => {
  it('prefers the Spanish genus', () => {
    expect(resolveGenus(species)).toBe('Pokémon Ratón')
  })

  it('falls back to English when no Spanish genus exists', () => {
    expect(resolveGenus({ ...species, genera: species.genera.slice(1) })).toBe('Mouse Pokémon')
  })

  it('falls back to an empty string when no genus exists at all', () => {
    expect(resolveGenus({ ...species, genera: [] })).toBe('')
  })
})

describe('resolveDescription', () => {
  it('strips line breaks and form-feed characters from the flavor text', () => {
    expect(resolveDescription(species)).toBe('Cuando varios se juntan.')
  })
})

describe('resolveAbilityName', () => {
  it('prefers the Spanish name', () => {
    expect(resolveAbilityName(ability)).toBe('Elec. Estática')
  })

  it('falls back to English when no Spanish name exists', () => {
    expect(resolveAbilityName({ ...ability, names: ability.names.slice(1) })).toBe('Static')
  })

  it('falls back to a humanized slug when no translation exists at all', () => {
    expect(resolveAbilityName({ name: 'flame-body', names: [] })).toBe('Flame Body')
  })
})

describe('resolveGenderRate', () => {
  it('maps -1 (genderless) to null', () => {
    expect(resolveGenderRate({ ...species, gender_rate: -1 })).toBeNull()
  })

  it('passes through the eighths-female value otherwise', () => {
    expect(resolveGenderRate(species)).toBe(4)
  })
})
