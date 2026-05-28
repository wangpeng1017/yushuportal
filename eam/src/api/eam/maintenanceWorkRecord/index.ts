import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 主表查询参数（status=4 由前端固定附加，不暴露给调用方） */
export interface WorkRecordDto {
  pageNo?: number
  pageSize?: number
  code?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 主表 VO */
export interface WorkRecordVo {
  id: string
  code: string
  planCode: string
  planName: string
  equipmentSn: string
  equipmentName: string
  equipmentTypeCode: string
  equipmentTypeDesc: string
  equipmentModel: string
  equipmentSupplier: string
  equipmentSupplierName: string
  maintenanceLevel: string
  maintenanceLevelDesc: string
  status: string
  personSn: string
  personName: string
  workStartTime: string
  overdueTime: string
  startTime: string
  endTime: string
  useTime: number
  needReplSparePartText: string
  remark: string
  createByPersonName: string
  createTime: string
}

/** 保养明细 VO */
export interface WorkRecordItemVo {
  id: string
  workCode: string
  maintenancePart: string
  remark: string
  status: string
  dealRemark: string
  seq: number
  createByPersonName: string
  createTime: string
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

const prefix = '/workOrder/eamMaintenanceWork'

/** 保养记录分页查询（固定 status=4，仅查询已完成工单） */
export const getWorkRecordPage = (params: WorkRecordDto) =>
  request.get({ url: prefix + '/list', params: { ...params, status: '4' } })

// ==================== 保养明细子表 API ====================

const itemPrefix = '/workOrder/eamMaintenanceWorkItem'

/** 保养明细分页查询 */
export const getWorkRecordItemPage = (params: {
  pageNo: number
  pageSize: number
  workCode: string
}) => request.get({ url: itemPrefix + '/list', params })

// ==================== 备件列表 API ====================

const sparePrefix = '/workOrder/eamSparePartUsageRecord'

/** 备件列表查询 - 从 data.detailList 中提取，data 为空时返回空数组 */
export const getSparePartsList = async (refWoCode: string): Promise<SparePartDetailVo[]> => {
  const res = await request.get({ url: sparePrefix + '/queryByRefWoCode', params: { refWoCode } })
  return res?.detailList || []
}
