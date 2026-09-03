import { describe, expect, it } from 'vitest'

import type { TypeDto } from '../../api/pokemonDto'
import { computeWeaknesses } from '../weaknesses.mapper'

const resource = (name: string) => ({ name, url: '' })

const grass: TypeDto = {
  name: 'grass',
  damage_relations: {
    double_damage_from: [
      resource('fire'),
      resource('ice'),
      resource('poison'),
      resource('flying'),
      resource('bug'),
    ],
    half_damage_from: [
      resource('water'),
      resource('electric'),
      resource('grass'),
      resource('ground'),
    ],
    no_damage_from: [],
  },
  pokemon: [],
}

const poison: TypeDto = {
  name: 'poison',
  damage_relations: {
    double_damage_from: [resource('ground'), resource('psychic')],
    half_damage_from: [
      resource('grass'),
      resource('fighting'),
      resource('poison'),
      resource('bug'),
      resource('fairy'),
    ],
    no_damage_from: [],
  },
  pokemon: [],
}

describe('computeWeaknesses', () => {
  it('unions double-damage types across a single type', () => {
    expect(computeWeaknesses([grass])).toEqual(
      expect.arrayContaining(['fire', 'ice', 'flying', 'bug']),
    )
  })

  it('cancels out a weakness when another of the pokemon types resists it (dual typing)', () => {
    // grass-poison (e.g. Bulbasaur): poison is a double-damage-from type for
    // grass, but poison itself resists poison, so it should not appear.
    expect(computeWeaknesses([grass, poison])).not.toContain('poison')
  })

  it('still includes a type only one of the two types is weak to', () => {
    expect(computeWeaknesses([grass, poison])).toEqual(expect.arrayContaining(['fire', 'psychic']))
  })

  it('drops damage-relation names this app does not recognize as a type', () => {
    const weird: TypeDto = {
      name: 'weird',
      damage_relations: {
        double_damage_from: [resource('fire'), resource('stellar')],
        half_damage_from: [],
        no_damage_from: [],
      },
      pokemon: [],
    }
    expect(computeWeaknesses([weird])).toEqual(['fire'])
  })
})
