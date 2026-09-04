import { httpGet } from '@/shared/api/httpClient'

import type {
  AbilityDto,
  PokemonDto,
  PokemonListResponseDto,
  PokemonSpeciesDto,
  TypeDto,
} from './pokemonDto'

/** Project scope: generation 1 only. */
export const GENERATION_ONE_COUNT = 151

export const fetchPokemonIndexPage = (
  limit: number,
  offset: number,
): Promise<PokemonListResponseDto> => httpGet(`/pokemon?limit=${limit}&offset=${offset}`)

export const fetchPokemonDetail = (idOrName: number | string): Promise<PokemonDto> =>
  httpGet(`/pokemon/${idOrName}`)

export const fetchPokemonSpecies = (idOrName: number | string): Promise<PokemonSpeciesDto> =>
  httpGet(`/pokemon-species/${idOrName}`)

export const fetchType = (name: string): Promise<TypeDto> => httpGet(`/type/${name}`)

export const fetchAbility = (name: string): Promise<AbilityDto> => httpGet(`/ability/${name}`)
