import { describe, expect, it } from 'vitest'

import type { PokemonDto } from '../../api/pokemonDto'
import { toPokemonSummary } from '../pokemonSummary.mapper'

const basePokemon: PokemonDto = {
  id: 25,
  name: 'pikachu',
  height: 4,
  weight: 60,
  sprites: {
    front_default: 'https://example.com/default.png',
    versions: {
      'generation-v': {
        'black-white': { front_default: 'https://example.com/gen-v.png' },
      },
    },
  },
  types: [{ type: { name: 'electric', url: '' } }],
  abilities: [],
}

describe('toPokemonSummary', () => {
  it('maps id, name, sprite and types from the DTO', () => {
    const summary = toPokemonSummary(basePokemon)

    expect(summary).toEqual({
      id: 25,
      name: 'pikachu',
      sprite: 'https://example.com/gen-v.png',
      types: ['electric'],
    })
  })

  it('falls back to the default sprite when the generation-v sprite is missing', () => {
    const summary = toPokemonSummary({ ...basePokemon, sprites: { front_default: 'x.png' } })

    expect(summary.sprite).toBe('x.png')
  })

  it('drops types PokéAPI returns that this app does not recognize', () => {
    const summary = toPokemonSummary({
      ...basePokemon,
      types: [{ type: { name: 'electric', url: '' } }, { type: { name: 'stellar', url: '' } }],
    })

    expect(summary.types).toEqual(['electric'])
  })
})
