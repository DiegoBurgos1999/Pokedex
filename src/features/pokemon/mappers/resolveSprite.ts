import type { PokemonDto } from '../api/pokemonDto'

/**
 * The design renders the low-resolution generation-V sprite set (pixelated,
 * matching its retro art direction) rather than the default modern sprite.
 * Falls back to the default sprite for the rare Pokémon missing that set.
 */
export const resolveSprite = (dto: PokemonDto): string =>
  dto.sprites.versions?.['generation-v']?.['black-white']?.front_default ??
  dto.sprites.front_default ??
  ''
