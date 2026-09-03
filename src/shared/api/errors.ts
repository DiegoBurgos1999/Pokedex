/**
 * Normalized error shape for every failed request, regardless of whether
 * the failure was an HTTP error status or a network/parsing failure.
 */
export class ApiError extends Error {
  readonly status: number | null

  constructor(message: string, status: number | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}
