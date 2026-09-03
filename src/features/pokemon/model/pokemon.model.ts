import type { PokemonType } from './pokemonTypeTheme'

export interface PokemonSummary {
  id: number
  name: string
  sprite: string
  types: PokemonType[]
}

export interface PokemonDetail {
  id: number
  name: string
  sprite: string
  types: PokemonType[]
  weightKg: number
  heightM: number
  category: string
  ability: string
  /** 0-8 female eighths, or null when the species has no gender. */
  genderRate: number | null
  description: string
  weaknesses: PokemonType[]
}
