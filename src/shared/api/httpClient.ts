import { ApiError } from './errors'

const BASE_URL = import.meta.env.VITE_POKEAPI_BASE_URL

/**
 * Thin JSON fetch wrapper around PokéAPI. Every caller gets a normalized
 * ApiError instead of having to distinguish HTTP errors from network
 * failures itself.
 */
export const httpGet = async <T>(path: string): Promise<T> => {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`)
  } catch {
    throw new ApiError('No se pudo conectar con el servidor.')
  }

  if (!response.ok) {
    throw new ApiError(`La solicitud falló con estado ${response.status}.`, response.status)
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new ApiError('La respuesta del servidor no es válida.')
  }
}
