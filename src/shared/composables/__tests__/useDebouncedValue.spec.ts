import { effectScope, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useDebouncedValue } from '../useDebouncedValue'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useDebouncedValue', () => {
  it('collapses rapid changes into a single update after the delay', async () => {
    const source = ref('a')
    const { debounced } = useDebouncedValue(source, 300)

    source.value = 'ab'
    await nextTick() // let the watcher react and schedule the timeout
    vi.advanceTimersByTime(100)
    source.value = 'abc'
    await nextTick()
    vi.advanceTimersByTime(299)
    expect(debounced.value).toBe('a')

    vi.advanceTimersByTime(1)
    expect(debounced.value).toBe('abc')
  })

  it('clears the pending timer when the owning scope is disposed before it fires', async () => {
    // Regression: a component can unmount mid-debounce (types, then
    // navigates away). Before this fix, the orphaned timer still fired and
    // wrote to a ref nobody reads anymore.
    const source = ref('a')
    const scope = effectScope()
    let debounced: { value: string }

    scope.run(() => {
      debounced = useDebouncedValue(source, 300).debounced
    })

    source.value = 'ab'
    await nextTick() // let the watcher run and schedule the pending timeout
    scope.stop() // simulate unmounting while that timeout is still in flight

    vi.advanceTimersByTime(300)

    expect(debounced!.value).toBe('a')
  })
})
