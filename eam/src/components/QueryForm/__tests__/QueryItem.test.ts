import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QueryItem from '../QueryItem.vue'

describe('QueryItem', () => {
  it('渲染 label 文本', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '报修单号' },
      slots: { default: '<input class="real-input" />' }
    })
    expect(wrapper.text()).toContain('报修单号')
    expect(wrapper.find('.real-input').exists()).toBe(true)
  })

  it('span=2 时 grid-column 占两列', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '故障时间', span: 2 },
      slots: { default: '<input />' }
    })
    const style = (wrapper.element as HTMLElement).style.gridColumn
    expect(style).toContain('span 2')
  })

  it('默认 span=1 时不设置 grid-column 跨列', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '审核状态' },
      slots: { default: '<input />' }
    })
    const style = (wrapper.element as HTMLElement).style.gridColumn
    expect(style).toBe('')
  })
})
