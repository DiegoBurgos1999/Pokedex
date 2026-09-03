import { afterEach, describe, expect, it, vi } from 'vitest'

import { ApiError } from '../errors'
import { httpGet } from '../httpClient'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('httpGet', () => {
  it('normalizes a network failure into an ApiError with no status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(httpGet('/pokemon/1')).rejects.toMatchObject({
      name: 'ApiError',
      status: null,
    })
  })

  it('normalizes a non-ok HTTP response into an ApiError carrying its status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) }),
    )

    await expect(httpGet('/pokemon/99999')).rejects.toMatchObject({
      name: 'ApiError',
      status: 404,
    })
  })

  it('normalizes a malformed JSON body into an ApiError instead of a raw SyntaxError', async () => {
    // Regression: an `ok: true` response whose body isn't valid JSON (a
    // PokéAPI hiccup, an HTML error page from a proxy) used to escape as a
    // raw SyntaxError, breaking the "every caller gets an ApiError" contract.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.reject(new SyntaxError('Unexpected token < in JSON')),
      }),
    )

    await expect(httpGet('/pokemon/1')).rejects.toBeInstanceOf(ApiError)
  })

  it('resolves with the parsed JSON body on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve({ id: 1 }) }),
    )

    await expect(httpGet('/pokemon/1')).resolves.toEqual({ id: 1 })
  })
})
