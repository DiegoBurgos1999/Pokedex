import type { AbilityDto, PokemonDto, PokemonSpeciesDto } from '../api/pokemonDto'
import type { PokemonDetail } from '../model/pokemon.model'
import { isKnownType, type PokemonType } from '../model/pokemonTypeTheme'
import { resolveSprite } from './resolveSprite'

const byLanguage = <T extends { language: { name: string } }>(
  entries: T[],
  language: string,
): T | undefined => entries.find((entry) => entry.language.name === language)

export const humanize = (slug: string): string =>
  slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export const resolveGenus = (species: PokemonSpeciesDto): string =>
  byLanguage(species.genera, 'es')?.genus ?? byLanguage(species.genera, 'en')?.genus ?? ''

export const resolveDescription = (species: PokemonSpeciesDto): string => {
  const entry =
    byLanguage(species.flavor_text_entries, 'es') ?? byLanguage(species.flavor_text_entries, 'en')
  // Flavor text ships with hard line breaks and form-feed characters meant
  // for the games' fixed-width text boxes.
  return entry?.flavor_text.replace(/[\n\f\r]+/g, ' ').trim() ?? ''
}

export const resolveAbilityName = (ability: AbilityDto): string =>
  byLanguage(ability.names, 'es')?.name ??
  byLanguage(ability.names, 'en')?.name ??
  humanize(ability.name)

/** species.gender_rate is -1 for genderless species, otherwise eighths female. */
export const resolveGenderRate = (species: PokemonSpeciesDto): number | null =>
  species.gender_rate === -1 ? null : species.gender_rate

export const toPokemonDetail = (
  dto: PokemonDto,
  species: PokemonSpeciesDto,
  abilityName: string,
  weaknesses: PokemonType[],
): PokemonDetail => ({
  id: dto.id,
  name: dto.name,
  sprite: resolveSprite(dto),
  types: dto.types.map((t) => t.type.name).filter(isKnownType),
  weightKg: dto.weight / 10,
  heightM: dto.height / 10,
  category: resolveGenus(species),
  ability: abilityName,
  genderRate: resolveGenderRate(species),
  description: resolveDescription(species),
  weaknesses,
})
