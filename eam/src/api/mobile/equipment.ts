import request from '@/config/axios'

export interface DeviceLandingVo {
  id: string
  equipmentSn: string
  equipmentName: string
  equipmentTypeDesc: string
  workshopName: string
  operationStatus: 'RUN' | 'STANDBY' | 'CLOSE' | 'FAILURE'
  equipmentStatus: 'USING' | 'ABOLISHED' | 'IDLE'
  equipmentMode?: string
  equipmentSupplierName?: string
  equipmentOperating?: string
  equipmentPurchase?: string
}

export const getDeviceBySn = (sn: string) =>
  request.get<DeviceLandingVo>({ url: `/eam/optEquipment/getBySn`, params: { sn } })
