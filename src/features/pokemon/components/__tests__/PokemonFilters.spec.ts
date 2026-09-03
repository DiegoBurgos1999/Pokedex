import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import PokemonFilters from '../PokemonFilters.vue'

describe('PokemonFilters', () => {
  it('renders nothing when closed', () => {
    const wrapper = mount(PokemonFilters, { props: { open: false, appliedTypes: [] } })
    expect(wrapper.find('[role="dialog"]').exists()).toBe(false)
  })

  it('seeds the draft from the currently applied types when opened', async () => {
    const wrapper = mount(PokemonFilters, { props: { open: false, appliedTypes: ['fire'] } })
    await wrapper.setProps({ open: true })
    await nextTick()

    const fireRow = wrapper.findAll('button').find((b) => b.text().includes('Fuego'))
    expect(fireRow?.text()).toContain('✓')
  })

  it('toggling a row and applying emits the final selection, not the seed', async () => {
    const wrapper = mount(PokemonFilters, { props: { open: true, appliedTypes: ['fire'] } })
    await nextTick()

    const waterRow = wrapper.findAll('button').find((b) => b.text().includes('Agua'))
    await waterRow?.trigger('click')

    const applyButton = wrapper.findAll('button').find((b) => b.text() === 'Aplicar')
    await applyButton?.trigger('click')

    const emitted = wrapper.emitted('apply')?.[0]?.[0] as string[]
    expect(emitted).toEqual(expect.arrayContaining(['fire', 'water']))
    expect(emitted).toHaveLength(2)
  })

  it('cancel emits close without emitting apply', async () => {
    const wrapper = mount(PokemonFilters, { props: { open: true, appliedTypes: ['fire'] } })
    await nextTick()

    const cancelButton = wrapper.findAll('button').find((b) => b.text() === 'Cancelar')
    await cancelButton?.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('apply')).toBeUndefined()
  })

  it('closes on Escape via the shared focus trap', async () => {
    const wrapper = mount(PokemonFilters, { props: { open: true, appliedTypes: [] } })
    await nextTick()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

    expect(wrapper.emitted('close')).toHaveLength(1)
  })
})
