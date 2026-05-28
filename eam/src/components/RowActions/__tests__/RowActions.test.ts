import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RowActions from '../RowActions.vue'

describe('RowActions', () => {
  it('默认渲染：三件套全开 - 详情/编辑/删除三个按钮都显示', () => {
    const wrapper = mount(RowActions, {
      props: { row: { id: 1 }, onDetail: vi.fn(), onEdit: vi.fn(), onDelete: vi.fn() }
    })
    expect(wrapper.text()).toContain('详情')
    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('选择性隐藏：onEdit 传 null 则不渲染编辑按钮', () => {
    const wrapper = mount(RowActions, {
      props: { row: { id: 1 }, onDetail: vi.fn(), onEdit: null, onDelete: vi.fn() }
    })
    expect(wrapper.text()).toContain('详情')
    expect(wrapper.text()).not.toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('全部隐藏 + 无 #more slot 时显示占位 —', () => {
    const wrapper = mount(RowActions, {
      props: { row: { id: 1 }, onDetail: null, onEdit: null, onDelete: null }
    })
    expect(wrapper.text()).toContain('—')
  })

  it('点击详情触发 onDetail 回调，传入 row', async () => {
    const onDetail = vi.fn()
    const row = { id: 42 }
    const wrapper = mount(RowActions, {
      props: { row, onDetail, onEdit: null, onDelete: null }
    })
    await wrapper.find('.ra-detail').trigger('click')
    expect(onDetail).toHaveBeenCalledWith(row)
  })

  it('点击编辑触发 onEdit 回调，传入 row', async () => {
    const onEdit = vi.fn()
    const row = { id: 42 }
    const wrapper = mount(RowActions, {
      props: { row, onDetail: null, onEdit, onDelete: null }
    })
    await wrapper.find('.ra-edit').trigger('click')
    expect(onEdit).toHaveBeenCalledWith(row)
  })

  it('#more slot 渲染时显示"更多 ▾"', () => {
    const wrapper = mount(RowActions, {
      props: { row: { id: 1 }, onDetail: vi.fn(), onEdit: null, onDelete: null },
      slots: { more: '<span class="more-item">导出</span>' }
    })
    expect(wrapper.text()).toContain('更多')
  })
})
