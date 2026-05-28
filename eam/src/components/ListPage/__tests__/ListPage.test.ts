import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ListPage from '../ListPage.vue'

describe('ListPage', () => {
  it('默认渲染 .eam-list-page 卡片容器', () => {
    const wrapper = mount(ListPage, { props: { total: 0 } })
    expect(wrapper.find('.eam-list-page').exists()).toBe(true)
  })

  it('#actions slot 渲染到 header 区', () => {
    const wrapper = mount(ListPage, {
      props: { total: 0 },
      slots: { actions: '<button class="my-action">新增</button>' }
    })
    const header = wrapper.find('.eam-list-page__header')
    expect(header.find('.my-action').exists()).toBe(true)
  })

  it('默认 slot 渲染到 body 区', () => {
    const wrapper = mount(ListPage, {
      props: { total: 0 },
      slots: { default: '<div class="my-table">表格</div>' }
    })
    expect(wrapper.find('.eam-list-page__body .my-table').exists()).toBe(true)
  })

  it('total > 0 时渲染分页', () => {
    const wrapper = mount(ListPage, {
      props: { total: 100, page: 1, limit: 10 }
    })
    expect(wrapper.find('.eam-list-page__footer').exists()).toBe(true)
  })

  it('total = 0 时不渲染分页', () => {
    const wrapper = mount(ListPage, { props: { total: 0 } })
    expect(wrapper.find('.eam-list-page__footer').exists()).toBe(false)
  })
})
