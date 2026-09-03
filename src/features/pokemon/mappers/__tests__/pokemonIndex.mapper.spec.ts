import { describe, expect, it } from 'vitest'

import type { PokemonListResponseDto, TypeDto } from '../../api/pokemonDto'
import { toIndexEntries, unionPokemonFromTypes } from '../pokemonIndex.mapper'

describe('toIndexEntries', () => {
  it('extracts the numeric id out of each entry url', () => {
    const dto: PokemonListResponseDto = {
      count: 2,
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
      ],
    }

    expect(toIndexEntries(dto)).toEqual([
      { id: 1, name: 'bulbasaur' },
      { id: 25, name: 'pikachu' },
    ])
  })
})

const type = (name: string, ids: number[]): TypeDto => ({
  name,
  damage_relations: { double_damage_from: [], half_damage_from: [], no_damage_from: [] },
  pokemon: ids.map((id) => ({
    pokemon: { name: `p${id}`, url: `https://pokeapi.co/api/v2/pokemon/${id}/` },
  })),
})

describe('unionPokemonFromTypes', () => {
  it('unions and dedupes pokémon across the given types, sorted by id', () => {
    const grass = type('grass', [3, 1])
    const poison = type('poison', [1, 24])

    expect(unionPokemonFromTypes([grass, poison])).toEqual([
      { id: 1, name: 'p1' },
      { id: 3, name: 'p3' },
      { id: 24, name: 'p24' },
    ])
  })

  it('drops pokémon outside the gen-1 scope', () => {
    const water = type('water', [7, 999])

    expect(unionPokemonFromTypes([water])).toEqual([{ id: 7, name: 'p7' }])
  })
})
