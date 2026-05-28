import { describe, it, expect } from 'vitest'
import { calcLabelPages } from '@/views/eam/deviceLedger/utils/qrcode-helper'

describe('calcLabelPages', () => {
  it('44 张占满 1 页', () => {
    expect(calcLabelPages(44)).toEqual({ totalPages: 1, perPage: 44, lastPageCount: 44 })
  })
  it('45 张占 2 页（首页满 + 末页 1）', () => {
    expect(calcLabelPages(45)).toEqual({ totalPages: 2, perPage: 44, lastPageCount: 1 })
  })
  it('100 张占 3 页（前 2 页满 + 末页 12）', () => {
    expect(calcLabelPages(100)).toEqual({ totalPages: 3, perPage: 44, lastPageCount: 12 })
  })
  it('0 张返回 0 页', () => {
    expect(calcLabelPages(0)).toEqual({ totalPages: 0, perPage: 44, lastPageCount: 0 })
  })
})
