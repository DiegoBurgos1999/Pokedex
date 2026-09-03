/**
 * PokéAPI list endpoints only return a name and a self-referencing URL, not
 * the numeric id. The id is the last path segment, e.g.
 * "https://pokeapi.co/api/v2/pokemon/25/" -> 25.
 */
export const extractIdFromUrl = (url: string): number => {
  const segments = url.split('/').filter(Boolean)
  const id = Number(segments[segments.length - 1])
  if (Number.isNaN(id)) {
    throw new Error(`No se pudo extraer un id numérico de "${url}".`)
  }
  return id
}
