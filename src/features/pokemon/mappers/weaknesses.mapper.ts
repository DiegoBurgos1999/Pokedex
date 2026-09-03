import type { TypeDto } from '../api/pokemonDto'
import { isKnownType, type PokemonType } from '../model/pokemonTypeTheme'

/**
 * Combines the damage relations of every type a Pokémon has into its net
 * weaknesses: types that deal double damage to at least one of its types,
 * minus any type it resists or is immune to through another of its types
 * (dual-typing can cancel out an individual type's weakness).
 */
export const computeWeaknesses = (types: TypeDto[]): PokemonType[] => {
  const doubleDamageFrom = new Set<string>()
  const resisted = new Set<string>()

  for (const type of types) {
    for (const t of type.damage_relations.double_damage_from) doubleDamageFrom.add(t.name)
    for (const t of type.damage_relations.half_damage_from) resisted.add(t.name)
    for (const t of type.damage_relations.no_damage_from) resisted.add(t.name)
  }

  return [...doubleDamageFrom].filter((name) => !resisted.has(name)).filter(isKnownType)
}
