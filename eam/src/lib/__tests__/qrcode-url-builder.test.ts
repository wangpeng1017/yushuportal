import { describe, it, expect } from 'vitest'
import { buildEquipmentQrUrl } from '@/views/eam/deviceLedger/utils/qrcode-helper'

describe('buildEquipmentQrUrl', () => {
  it('正常拼接 URL', () => {
    expect(buildEquipmentQrUrl('https://eam.com', 'EQ20240001'))
      .toBe('https://eam.com/m/equipment/EQ20240001')
  })
  it('域名末尾有斜杠也能正确拼接', () => {
    expect(buildEquipmentQrUrl('https://eam.com/', 'EQ001'))
      .toBe('https://eam.com/m/equipment/EQ001')
  })
  it('设备编号含特殊字符要 escape', () => {
    expect(buildEquipmentQrUrl('https://eam.com', 'EQ/001'))
      .toBe('https://eam.com/m/equipment/EQ%2F001')
  })
  it('空设备编号抛错', () => {
    expect(() => buildEquipmentQrUrl('https://eam.com', '')).toThrow()
  })
})
