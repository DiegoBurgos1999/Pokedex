import type { PokemonDto } from '../api/pokemonDto'
import { isKnownType } from '../model/pokemonTypeTheme'
import type { PokemonSummary } from '../model/pokemon.model'
import { resolveSprite } from './resolveSprite'

export const toPokemonSummary = (dto: PokemonDto): PokemonSummary => ({
  id: dto.id,
  name: dto.name,
  sprite: resolveSprite(dto),
  types: dto.types.map((t) => t.type.name).filter(isKnownType),
})
