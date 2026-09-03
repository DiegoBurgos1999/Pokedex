import { extractIdFromUrl } from '@/shared/utils/extractIdFromUrl'

import { GENERATION_ONE_COUNT } from '../api/pokemonApi'
import type { PokemonListResponseDto, TypeDto } from '../api/pokemonDto'

export interface PokemonIndexEntry {
  id: number
  name: string
}

export const toIndexEntries = (dto: PokemonListResponseDto): PokemonIndexEntry[] =>
  dto.results.map((r) => ({ id: extractIdFromUrl(r.url), name: r.name }))

/**
 * `GET /type/{name}` returns every Pokémon of that type across every
 * generation. Selecting more than one type unions their pokémon (OR, not
 * AND) and the result is capped to this project's gen-1 scope, then sorted
 * back into index order.
 */
export const unionPokemonFromTypes = (types: TypeDto[]): PokemonIndexEntry[] => {
  const byId = new Map<number, PokemonIndexEntry>()

  for (const type of types) {
    for (const { pokemon } of type.pokemon) {
      const id = extractIdFromUrl(pokemon.url)
      if (id <= GENERATION_ONE_COUNT) byId.set(id, { id, name: pokemon.name })
    }
  }

  return [...byId.values()].sort((a, b) => a.id - b.id)
}
