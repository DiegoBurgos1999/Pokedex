/**
 * Raw PokéAPI response shapes. Only the fields this app actually reads are
 * declared — nothing outside `api/` and `mappers/` may reference these.
 */

export interface NamedApiResourceDto {
  name: string
  url: string
}

export interface PokemonListResponseDto {
  count: number
  results: NamedApiResourceDto[]
}

export interface PokemonDto {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    versions?: {
      'generation-v'?: {
        'black-white'?: {
          front_default: string | null
        }
      }
    }
  }
  types: Array<{
    type: NamedApiResourceDto
  }>
  abilities: Array<{
    is_hidden: boolean
    slot: number
    ability: NamedApiResourceDto
  }>
}

export interface PokemonSpeciesDto {
  gender_rate: number
  flavor_text_entries: Array<{
    flavor_text: string
    language: NamedApiResourceDto
  }>
  genera: Array<{
    genus: string
    language: NamedApiResourceDto
  }>
}

export interface TypeDto {
  name: string
  damage_relations: {
    double_damage_from: NamedApiResourceDto[]
    half_damage_from: NamedApiResourceDto[]
    no_damage_from: NamedApiResourceDto[]
  }
  pokemon: Array<{
    pokemon: NamedApiResourceDto
  }>
}

export interface AbilityDto {
  name: string
  names: Array<{
    name: string
    language: NamedApiResourceDto
  }>
}
