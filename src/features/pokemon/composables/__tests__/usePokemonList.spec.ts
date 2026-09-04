import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PokemonDto, PokemonListResponseDto, TypeDto } from '../../api/pokemonDto'
import { usePokemonList } from '../usePokemonList'
import { mountComposable } from './testHost'

const { fetchPokemonIndexPage, fetchPokemonDetail, fetchType } = vi.hoisted(() => ({
  fetchPokemonIndexPage: vi.fn(),
  fetchPokemonDetail: vi.fn(),
  fetchType: vi.fn(),
}))

vi.mock('../../api/pokemonApi', async () => {
  const actual = await vi.importActual<object>('../../api/pokemonApi')
  return { ...actual, fetchPokemonIndexPage, fetchPokemonDetail, fetchType }
})

const dto = (id: number, name: string, types: string[] = ['normal']): PokemonDto => ({
  id,
  name,
  height: 10,
  weight: 100,
  sprites: { front_default: `${name}.png` },
  types: types.map((t) => ({ type: { name: t, url: '' } })),
  abilities: [],
})

const entryUrl = (id: number) => `https://pokeapi.co/api/v2/pokemon/${id}/`

/** A tiny fake backend: slices a full name list the way `?limit&offset` would. */
const backedBy = (names: string[]) => {
  fetchPokemonIndexPage.mockImplementation(
    (limit: number, offset: number): Promise<PokemonListResponseDto> =>
      Promise.resolve({
        count: names.length,
        results: names
          .slice(offset, offset + limit)
          .map((name, i) => ({ name, url: entryUrl(offset + i + 1) })),
      }),
  )
}

const names = (count: number, prefix = 'p') =>
  Array.from({ length: count }, (_, i) => `${prefix}${i + 1}`)

beforeEach(() => {
  vi.clearAllMocks()
  fetchPokemonDetail.mockImplementation((id: number) => Promise.resolve(dto(id, `p${id}`)))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePokemonList', () => {
  it('fetches the first backend page and shows it as ready', async () => {
    backedBy(names(151))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(fetchPokemonIndexPage).toHaveBeenCalledWith(12, 0)
    expect(result.state.value).toBe('ready')
    expect(result.items.value.map((p) => p.name)).toEqual(names(12))
    expect(result.totalCount.value).toBe(151)
    expect(result.hasMore.value).toBe(true)
  })

  it('accumulates the next backend page on top of the first instead of replacing it', async () => {
    backedBy(names(24))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.loadMore()
    await flushPromises()

    expect(fetchPokemonIndexPage).toHaveBeenCalledWith(12, 12)
    expect(result.items.value).toHaveLength(24)
    expect(result.items.value.map((p) => p.name)).toEqual(names(24))
  })

  it('never refetches a batch that was already loaded', async () => {
    backedBy(names(24))
    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()
    result.loadMore()
    await flushPromises()

    expect(fetchPokemonIndexPage).toHaveBeenCalledTimes(2)
  })

  it('clamps the limit on the last, short batch instead of spilling into generation 2', async () => {
    backedBy(names(151))
    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    // Jump straight to the last batch (offset 144, only 7 pokémon left).
    for (let i = 0; i < 12; i++) {
      result.loadMore()
      await flushPromises()
    }

    expect(fetchPokemonIndexPage).toHaveBeenLastCalledWith(7, 144)
    expect(result.hasMore.value).toBe(false)
  })

  it('search only matches pokémon already loaded, not ones further back', async () => {
    backedBy(['bulbasaur', 'ivysaur', 'venusaur', 'charmander'])

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.query.value = 'charmander'
    await new Promise((resolve) => setTimeout(resolve, 350))
    await flushPromises()

    // charmander is entry #4, already within the first (and only) batch,
    // so it's loaded and searchable.
    expect(result.items.value.map((p) => p.id)).toEqual([4])
  })

  it('does not find a match that has not been loaded yet', async () => {
    backedBy(names(24, 'mon'))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    // "mon13" lives in the second batch, which hasn't been requested yet.
    result.query.value = 'mon13'
    await new Promise((resolve) => setTimeout(resolve, 350))
    await flushPromises()

    expect(result.state.value).toBe('empty')

    result.loadMore()
    await flushPromises()

    expect(result.items.value.map((p) => p.id)).toEqual([13])
  })

  it("shows isLoadingMore while the next batch's names are still being fetched, before any detail call exists", async () => {
    backedBy(names(12))
    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.isLoadingMore.value).toBe(false)

    let resolveNextBatch!: (value: PokemonListResponseDto) => void
    fetchPokemonIndexPage.mockReturnValueOnce(
      new Promise((resolve) => {
        resolveNextBatch = resolve
      }),
    )

    result.loadMore()
    await flushPromises()

    // The index-batch fetch for page 2 is in flight; no detail query for it
    // exists yet (there's nothing to fetch details for), so a spinner that
    // only watched detail queries would stay silent here.
    expect(result.isLoadingMore.value).toBe(true)

    resolveNextBatch({
      count: 24,
      results: names(24)
        .slice(12, 24)
        .map((name, i) => ({ name, url: entryUrl(13 + i) })),
    })
    await flushPromises()

    expect(result.isLoadingMore.value).toBe(false)
    expect(result.items.value).toHaveLength(24)
  })

  it('goes to the error state when the very first batch fails to load', async () => {
    fetchPokemonIndexPage.mockRejectedValue(new Error('network down'))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.state.value).toBe('error')
  })

  it('surfaces a loadMoreError (not the full-page error) when a later batch fails to fetch', async () => {
    backedBy(names(24))
    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    fetchPokemonIndexPage.mockRejectedValueOnce(new Error('offline'))
    result.loadMore()
    await flushPromises()

    expect(result.state.value).toBe('ready')
    expect(result.loadMoreError.value).toBe(true)
    expect(result.items.value).toHaveLength(12)
  })

  it('surfaces a loadMoreError when a later batch loads but its detail calls fail', async () => {
    backedBy(names(24))
    fetchPokemonDetail.mockImplementation((id: number) =>
      id <= 12 ? Promise.resolve(dto(id, `p${id}`)) : Promise.reject(new Error('offline')),
    )

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.loadMore()
    await flushPromises()

    expect(result.state.value).toBe('ready')
    expect(result.loadMoreError.value).toBe(true)
    expect(result.items.value).toHaveLength(12)
  })

  it('replaces the index-driven list with a union of type queries when filters are applied', async () => {
    backedBy(names(24))
    const fireType: TypeDto = {
      name: 'fire',
      damage_relations: { double_damage_from: [], half_damage_from: [], no_damage_from: [] },
      pokemon: [{ pokemon: { name: 'p4', url: 'https://pokeapi.co/api/v2/pokemon/4/' } }],
    }
    fetchType.mockResolvedValue(fireType)

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.applyFilters(['fire'])
    await flushPromises()

    expect(fetchType).toHaveBeenCalledWith('fire')
    expect(result.items.value.map((p) => p.id)).toEqual([4])
  })
})
