import type { PokemonDto } from '../api/pokemonDto'
import { toKnownType } from '../model/pokemonTypeTheme'
import type { PokemonSummary } from '../model/pokemon.model'
import { resolveSprite } from './resolveSprite'

export const toPokemonSummary = (dto: PokemonDto): PokemonSummary => ({
  id: dto.id,
  name: dto.name,
  sprite: resolveSprite(dto),
  types: dto.types.map((t) => toKnownType(t.type.name)),
})
