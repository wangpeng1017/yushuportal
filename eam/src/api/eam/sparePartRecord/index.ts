import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 备件使用记录 - 列表对象 */
export interface SparePartRecordDto {
  id?: string
  recordCode?: string
  usageTime?: string
  equipmentSn?: string
  equipmentName?: string
  equipmentTypeName?: string
  equipmentMode?: string
  capacityGroupName?: string
  equipmentSupplierName?: string
  refWoType?: string
  refWoCode?: string
  workCenterName?: string
  workShopName?: string
  createByPersonName?: string
  createTime?: string
}

/** 备件使用记录详情 - 列表对象 */
export interface SparePartRecordDetailDto {
  id?: string
  recordId?: string
  partCode?: string
  partName?: string
  partSpecification?: string
  partGroupName?: string
  useAmount?: number
  stockUnitName?: string
  createByPersonName?: string
  createTime?: string
}

/** 备件使用记录 - 查询参数 */
export interface SparePartRecordQueryDto {
  pageNo?: number
  pageSize?: number
  recordCode?: string
  equipmentSn?: string
  equipmentName?: string
  refWoCode?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 备件使用记录详情 - 查询参数 */
export interface SparePartRecordDetailQueryDto {
  pageNo?: number
  pageSize?: number
  recordId?: string
}

// ==================== API 方法 ====================

/** 备件使用记录列表查询 */
export const getSparePartRecordList = (params: SparePartRecordQueryDto) =>
  request.get({ url: '/workOrder/eamSparePartUsageRecord/list', params })

/** 备件使用记录详情列表查询 */
export const getSparePartRecordDetailList = (params: SparePartRecordDetailQueryDto) =>
  request.get({ url: '/workOrder/eamSparePartUsageRecordDetail/list', params })

/** 导出备件使用记录 */
export const exportSparePartRecord = (params: SparePartRecordQueryDto) =>
  request.download({ url: '/workOrder/eamSparePartUsageRecord/exportXls', params })
