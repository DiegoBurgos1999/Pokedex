/** Formats a Pokémon id as the design's "N°001" label. */
export const formatPokemonNumber = (id: number): string => `N°${String(id).padStart(3, '0')}`
