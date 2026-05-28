import request from '@/config/axios'

export interface MobileWorkOrderVo {
  id: string
  code: string
  type: 'MAINT' | 'INSP' | 'REPAIR'
  typeText: string
  equipmentSn: string
  equipmentName: string
  status: string
  statusText: string
  personName?: string
  workStartTime?: string
  endTime?: string
  remark?: string
  createTime: string
}

export interface MobileWorkOrderQuery {
  equipmentSn?: string
  status?: string
  showAll?: 0 | 1
  pageNo?: number
  pageSize?: number
}

export interface MobileWorkOrderPage {
  records: MobileWorkOrderVo[]
  total: number
}

export const getMaintenanceListBySn = (params: MobileWorkOrderQuery) =>
  request.get<MobileWorkOrderPage>({ url: '/mobile/workorder/maintenance/list', params })

export const getSpotInspectionListBySn = (params: MobileWorkOrderQuery) =>
  request.get<MobileWorkOrderPage>({ url: '/mobile/workorder/spotInspection/list', params })

export const getRepairListBySn = (params: MobileWorkOrderQuery) =>
  request.get<MobileWorkOrderPage>({ url: '/mobile/workorder/repair/list', params })

export const getHistoryListBySn = (params: MobileWorkOrderQuery) =>
  request.get<MobileWorkOrderPage>({ url: '/mobile/workorder/history/list', params })
