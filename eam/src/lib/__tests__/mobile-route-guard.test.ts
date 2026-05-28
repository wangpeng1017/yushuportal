import { describe, it, expect } from 'vitest'
import { isPublicMobileRoute, buildLoginRedirect } from '@/views/mobile/utils/mobile-route-guard'

describe('isPublicMobileRoute', () => {
  it('落地页公开', () => {
    expect(isPublicMobileRoute('/m/equipment/EQ001')).toBe(true)
  })
  it('设备档案公开', () => {
    expect(isPublicMobileRoute('/m/equipment/detail')).toBe(true)
  })
  it('登录页公开', () => {
    expect(isPublicMobileRoute('/m/login')).toBe(true)
  })
  it('保养工单要登录', () => {
    expect(isPublicMobileRoute('/m/maintenance/list')).toBe(false)
  })
  it('维修工单要登录', () => {
    expect(isPublicMobileRoute('/m/repairOrder/list')).toBe(false)
  })
  it('非 /m 开头不在白名单管控范围', () => {
    expect(isPublicMobileRoute('/foo')).toBe(true)
  })
})

describe('buildLoginRedirect', () => {
  it('编码 redirect 参数', () => {
    expect(buildLoginRedirect('/m/maintenance/list?equipmentSn=EQ001'))
      .toBe('/m/login?redirect=%2Fm%2Fmaintenance%2Flist%3FequipmentSn%3DEQ001')
  })
  it('空 redirect 兜底跳落地', () => {
    expect(buildLoginRedirect('')).toBe('/m/login')
  })
})
