import { describe, it, expect } from 'vitest'
import { isDeviceAbolished } from '@/views/mobile/equipment/landing-utils'

describe('isDeviceAbolished', () => {
  it('equipmentStatus=ABOLISHED 视为停用', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'ABOLISHED', operationStatus: 'RUN' } as any)).toBe(true)
  })
  it('USING + CLOSE 不算停用（暂停而非作废）', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'USING', operationStatus: 'CLOSE' } as any)).toBe(false)
  })
  it('USING + RUN 正常', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'USING', operationStatus: 'RUN' } as any)).toBe(false)
  })
  it('null 数据视为不存在，但不抛错', () => {
    expect(isDeviceAbolished(null)).toBe(false)
  })
})
