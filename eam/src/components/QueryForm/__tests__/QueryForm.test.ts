import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import QueryForm from '../QueryForm.vue'
import QueryItem from '../QueryItem.vue'

describe('QueryForm', () => {
  it('默认 4 列栅格 - CSS 变量正确设置', () => {
    const wrapper = mount(QueryForm, { props: { model: {} } })
    const grid = wrapper.find('.eam-query-form__grid').element as HTMLElement
    expect(grid.style.getPropertyValue('--eam-form-cols')).toBe('4')
  })

  it('cols=3 时栅格 CSS 变量为 3', () => {
    const wrapper = mount(QueryForm, { props: { model: {}, cols: 3 } })
    const grid = wrapper.find('.eam-query-form__grid').element as HTMLElement
    expect(grid.style.getPropertyValue('--eam-form-cols')).toBe('3')
  })

  it('字段数 ≤ collapseAfter 时不显示展开按钮', () => {
    const wrapper = mount(QueryForm, {
      props: { model: {}, collapseAfter: 8 },
      slots: {
        default: `
          <QueryItem label="字段1"><input /></QueryItem>
          <QueryItem label="字段2"><input /></QueryItem>
        `
      },
      global: { components: { QueryItem } }
    })
    expect(wrapper.find('.eam-query-form__toggle').exists()).toBe(false)
  })

  it('点击搜索按钮触发 @search', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(QueryForm, { props: { model: {}, onSearch } })
    await wrapper.find('button.eam-search-btn').trigger('click')
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('点击重置按钮触发 @reset', async () => {
    const onReset = vi.fn()
    const wrapper = mount(QueryForm, { props: { model: {}, onReset } })
    await wrapper.find('button.eam-reset-btn').trigger('click')
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('在 input 上回车触发 @search', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(QueryForm, {
      props: { model: {}, onSearch },
      slots: { default: `<QueryItem label="字段1"><input class="test-input" /></QueryItem>` },
      global: { components: { QueryItem } }
    })
    await wrapper.find('.test-input').trigger('keyup.enter')
    expect(onSearch).toHaveBeenCalled()
  })
})
