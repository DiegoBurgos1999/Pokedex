import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useToastStore } from '../useToastStore'

beforeEach(() => {
  setActivePinia(createPinia())
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useToastStore', () => {
  it('starts empty', () => {
    expect(useToastStore().toasts).toEqual([])
  })

  it('queues a toast with a default success variant', () => {
    const store = useToastStore()
    store.show('Pikachu añadido a favoritos')

    expect(store.toasts).toEqual([
      { id: expect.any(Number), message: 'Pikachu añadido a favoritos', variant: 'success' },
    ])
  })

  it('auto-dismisses after the given duration', () => {
    const store = useToastStore()
    store.show('hola', 'success', 1000)

    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(999)
    expect(store.toasts).toHaveLength(1)
    vi.advanceTimersByTime(1)
    expect(store.toasts).toHaveLength(0)
  })

  it('can be dismissed manually before the timer fires', () => {
    const store = useToastStore()
    store.show('hola')
    const id = store.toasts[0]?.id as number

    store.dismiss(id)

    expect(store.toasts).toEqual([])
  })

  it('stacks multiple toasts independently', () => {
    const store = useToastStore()
    store.show('primero')
    store.show('segundo')

    expect(store.toasts.map((t) => t.message)).toEqual(['primero', 'segundo'])
  })

  it('does not stack a duplicate of an already-visible identical toast', () => {
    const store = useToastStore()
    store.show('Pikachu añadido a favoritos')
    store.show('Pikachu añadido a favoritos')

    expect(store.toasts).toHaveLength(1)
  })
})
