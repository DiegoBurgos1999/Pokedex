import { describe, expect, it } from 'vitest'

import type { PokemonDetail } from '../../model/pokemon.model'
import { buildShareText } from '../buildShareText'

const pikachu: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  sprite: 'x.png',
  types: ['electric'],
  weightKg: 6,
  heightM: 0.4,
  category: 'Pokémon Ratón',
  ability: 'Elec. Estática',
  genderRate: 4,
  description: '...',
  weaknesses: ['ground'],
}

describe('buildShareText', () => {
  it('joins the name and single-type attributes with commas', () => {
    expect(buildShareText(pikachu)).toBe(
      'pikachu, N°025, Eléctrico, 6 kg, 0,4 m, Pokémon Ratón, Elec. Estática',
    )
  })

  it('includes both types for dual-type pokemon', () => {
    const bulbasaur: PokemonDetail = {
      ...pikachu,
      id: 1,
      name: 'bulbasaur',
      types: ['grass', 'poison'],
      weightKg: 6.9,
      heightM: 0.7,
    }

    expect(buildShareText(bulbasaur)).toBe(
      'bulbasaur, N°001, Planta, Veneno, 6,9 kg, 0,7 m, Pokémon Ratón, Elec. Estática',
    )
  })
})
