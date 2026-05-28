import request from '@/config/axios'

// ==================== 类型复用 ====================

// 主表 VO 直接复用维修工单模块（同一后端实体 EamRepairWorkOrder）
import type { RepairWorkOrderVo, RepairWorkOrderProcessRecordVo } from '@/api/eam/repairWorkOrder'
export type { RepairWorkOrderVo as RepairRecordVo }
export type { RepairWorkOrderProcessRecordVo }

// ==================== DTO 定义 ====================

/** 维修记录分页查询参数（status=6 由前端固定附加，不暴露给调用方） */
export interface RepairRecordDto {
  pageNo?: number
  pageSize?: number
  repairCode?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 备件明细 VO */
export interface SparePartDetailVo {
  partGroup: string
  partGroupName: string
  partCode: string
  partName: string
  partSpecification: string
  useAmount: number
  stockUnitCode: string
  stockUnitName: string
  storeUnitNum: number
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamRepairWorkOrder'

/** 维修记录分页查询（固定 status=6，仅查询已完成工单） */
export const getRepairRecordPage = (params: RepairRecordDto) =>
  request.get({ url: prefix + '/list', params: { ...params, status: '6' } })

// ==================== 处理记录 API ====================

const recordPrefix = '/workOrder/eamRepairWorkOrderProcessRecord'

/** 处理记录分页查询 */
export const getProcessRecordList = (params: {
  repairCode: string
  pageNo: number
  pageSize: number
}) => request.get({ url: recordPrefix + '/list', params })

// ==================== 备件列表 API ====================

const sparePrefix = '/workOrder/eamSparePartUsageRecord'

/** 备件列表查询 - 从 data.detailList 中提取，data 为空时返回空数组 */
export const getSparePartsList = async (refWoCode: string): Promise<SparePartDetailVo[]> => {
  const res = await request.get({ url: sparePrefix + '/queryByRefWoCode', params: { refWoCode } })
  return res?.detailList || []
}
