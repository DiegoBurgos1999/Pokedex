import { flushPromises } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { PokemonDto, TypeDto } from '../../api/pokemonDto'
import { usePokemonList } from '../usePokemonList'
import { mountComposable } from './testHost'

const { fetchPokemonIndex, fetchPokemonDetail, fetchType } = vi.hoisted(() => ({
  fetchPokemonIndex: vi.fn(),
  fetchPokemonDetail: vi.fn(),
  fetchType: vi.fn(),
}))

vi.mock('../../api/pokemonApi', async () => {
  const actual = await vi.importActual<object>('../../api/pokemonApi')
  return { ...actual, fetchPokemonIndex, fetchPokemonDetail, fetchType }
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

const indexOf = (entries: Array<[number, string]>) => ({
  count: entries.length,
  results: entries.map(([id, name]) => ({ name, url: `https://pokeapi.co/api/v2/pokemon/${id}/` })),
})

beforeEach(() => {
  vi.clearAllMocks()
  fetchPokemonDetail.mockImplementation((id: number) => Promise.resolve(dto(id, `p${id}`)))
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('usePokemonList', () => {
  it('resolves the index and shows the ready state with mapped items', async () => {
    fetchPokemonIndex.mockResolvedValue(
      indexOf([
        [1, 'bulbasaur'],
        [4, 'charmander'],
        [7, 'squirtle'],
      ]),
    )

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.state.value).toBe('ready')
    expect(result.items.value.map((p) => p.name)).toEqual(['p1', 'p4', 'p7'])
    expect(result.totalCount.value).toBe(3)
  })

  it('goes to the error state when the index fails to load', async () => {
    fetchPokemonIndex.mockRejectedValue(new Error('network down'))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.state.value).toBe('error')
  })

  it('filters by name once the debounced query settles', async () => {
    fetchPokemonIndex.mockResolvedValue(
      indexOf([
        [1, 'bulbasaur'],
        [4, 'charmander'],
      ]),
    )

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.query.value = 'char'
    await new Promise((resolve) => setTimeout(resolve, 350))
    await flushPromises()

    expect(result.items.value.map((p) => p.name)).toEqual(['p4'])
  })

  it('shows the empty state when a search matches nothing', async () => {
    fetchPokemonIndex.mockResolvedValue(indexOf([[1, 'bulbasaur']]))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    result.query.value = 'nonexistent'
    await new Promise((resolve) => setTimeout(resolve, 350))
    await flushPromises()

    expect(result.state.value).toBe('empty')
  })

  it('grows the visible page with loadMore', async () => {
    const entries = Array.from({ length: 14 }, (_, i) => [i + 1, `p${i + 1}`] as [number, string])
    fetchPokemonIndex.mockResolvedValue(indexOf(entries))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.shownCount.value).toBe(12)
    expect(result.hasMore.value).toBe(true)

    result.loadMore()
    await flushPromises()

    expect(result.shownCount.value).toBe(14)
    expect(result.hasMore.value).toBe(false)
  })

  it('surfaces a loadMoreError (not the full-page error) when a later batch fails but earlier ones already loaded', async () => {
    const entries = Array.from({ length: 14 }, (_, i) => [i + 1, `p${i + 1}`] as [number, string])
    fetchPokemonIndex.mockResolvedValue(indexOf(entries))
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

    fetchPokemonDetail.mockImplementation((id: number) => Promise.resolve(dto(id, `p${id}`)))
    result.retry()
    await flushPromises()

    expect(result.loadMoreError.value).toBe(false)
    expect(result.items.value).toHaveLength(14)
  })

  it('does not surface loadMoreError when only the first batch partially fails', async () => {
    fetchPokemonIndex.mockResolvedValue(
      indexOf(Array.from({ length: 12 }, (_, i) => [i + 1, `p${i + 1}`] as [number, string])),
    )
    fetchPokemonDetail.mockImplementation((id: number) =>
      id <= 7 ? Promise.resolve(dto(id, `p${id}`)) : Promise.reject(new Error('offline')),
    )

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    // Nobody has clicked "Ver más" yet — a partial failure in the very
    // first batch must not show the "couldn't load more" copy.
    expect(result.state.value).toBe('ready')
    expect(result.loadMoreError.value).toBe(false)
    expect(result.items.value).toHaveLength(7)
  })

  it('goes to the full-page error state when nothing has ever loaded successfully', async () => {
    fetchPokemonIndex.mockResolvedValue(indexOf([[1, 'bulbasaur']]))
    fetchPokemonDetail.mockRejectedValue(new Error('offline'))

    const { result } = mountComposable(() => usePokemonList())
    await flushPromises()

    expect(result.state.value).toBe('error')
    expect(result.loadMoreError.value).toBe(false)
  })

  it('replaces the index-driven list with a union of type queries when filters are applied', async () => {
    fetchPokemonIndex.mockResolvedValue(
      indexOf([
        [1, 'bulbasaur'],
        [4, 'charmander'],
      ]),
    )
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
