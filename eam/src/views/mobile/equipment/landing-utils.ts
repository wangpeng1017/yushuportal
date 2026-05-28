import type { DeviceLandingVo } from '@/api/mobile/equipment'

export function isDeviceAbolished(device: DeviceLandingVo | null): boolean {
  if (!device) return false
  return device.equipmentStatus === 'ABOLISHED'
}

export function getOperationStatusBadge(status: string): string {
  const map: Record<string, string> = {
    RUN: '🟢',
    STANDBY: '🟡',
    CLOSE: '⚫',
    FAILURE: '🔴',
  }
  return map[status] || '⚪'
}
