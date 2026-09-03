import type { PokemonType } from './pokemonTypeTheme'

/**
 * Spanish display names for the 18 Pokémon types. This is a fixed,
 * deterministic set (not per-Pokémon data), so it's a local table rather
 * than a PokéAPI call — consistent with the project's "no i18n library"
 * policy for UI copy.
 */
export const TYPE_NAME_ES: Record<PokemonType, string> = {
  grass: 'Planta',
  poison: 'Veneno',
  fire: 'Fuego',
  water: 'Agua',
  bug: 'Bicho',
  flying: 'Volador',
  normal: 'Normal',
  electric: 'Eléctrico',
  ground: 'Tierra',
  fairy: 'Hada',
  fighting: 'Lucha',
  psychic: 'Psíquico',
  rock: 'Roca',
  ice: 'Hielo',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  steel: 'Acero',
  dark: 'Siniestro',
}
