import { effectScope, nextTick, ref, type EffectScope, type Ref } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { useFocusTrap } from '../useFocusTrap'

const mountContainer = (): HTMLElement => {
  const container = document.createElement('div')
  container.innerHTML = '<button>A</button><button>B</button>'
  document.body.appendChild(container)
  return container
}

const pressKey = (key: string, shiftKey = false): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, cancelable: true }))
}

let scopes: EffectScope[] = []

/**
 * `useFocusTrap` calls `onScopeDispose`, which needs a real effect scope to
 * attach to (the one a component's `setup()` creates implicitly). Running it
 * bare in a test body leaves that scope-less, which just prints a harmless
 * Vue warning — this keeps every test scoped like the real component tree
 * so the suite output stays clean.
 */
const runTrap = (
  container: Ref<HTMLElement | null>,
  active: Ref<boolean>,
  onEscape: () => void,
): EffectScope => {
  const scope = effectScope()
  scopes.push(scope)
  scope.run(() => useFocusTrap(container, active, onEscape))
  return scope
}

afterEach(() => {
  document.body.innerHTML = ''
  scopes.forEach((scope) => scope.stop())
  scopes = []
})

describe('useFocusTrap', () => {
  it('wraps Tab from the last focusable back to the first', async () => {
    const container = mountContainer()
    runTrap(ref(container), ref(true), vi.fn())
    await nextTick()

    const [first, last] = Array.from(container.querySelectorAll('button'))
    last?.focus()
    pressKey('Tab')

    expect(document.activeElement).toBe(first)
  })

  it('wraps Shift+Tab from the first focusable back to the last', async () => {
    const container = mountContainer()
    runTrap(ref(container), ref(true), vi.fn())
    await nextTick()

    const [first, last] = Array.from(container.querySelectorAll('button'))
    first?.focus()
    pressKey('Tab', true)

    expect(document.activeElement).toBe(last)
  })

  it('calls onEscape and stops the event from bubbling further', async () => {
    const container = mountContainer()
    const onEscape = vi.fn()
    runTrap(ref(container), ref(true), onEscape)
    await nextTick()

    pressKey('Escape')

    expect(onEscape).toHaveBeenCalledTimes(1)
  })

  it('restores focus to the trigger once deactivated', async () => {
    const trigger = document.createElement('button')
    document.body.appendChild(trigger)
    trigger.focus()

    const container = mountContainer()
    const active = ref(true)
    runTrap(ref(container), active, vi.fn())
    await nextTick()

    active.value = false
    await nextTick()

    expect(document.activeElement).toBe(trigger)
  })

  it('removes the keydown listener when the owning scope is disposed while still active', async () => {
    // Regression: the dialog can unmount (route change, parent v-if) without
    // `active` ever flipping back to false. Before this fix, the document
    // listener outlived the component and kept calling a dead closure.
    const container = mountContainer()
    const onEscape = vi.fn()
    const scope = runTrap(ref(container), ref(true), onEscape)
    await nextTick()

    scope.stop()
    pressKey('Escape')

    expect(onEscape).not.toHaveBeenCalled()
  })
})
