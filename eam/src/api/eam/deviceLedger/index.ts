import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 设备台账 - 列表/详情返回对象（复用 OptEquipment Entity） */
export interface DeviceLedgerVo {
  id?: string
  equipmentSn?: string
  equipmentName?: string
  equipmentType?: string
  equipmentTypeDesc?: string
  equipmentCategory?: string
  equipmentCategoryDesc?: string
  equipmentMode?: string
  equipmentSupplier?: string
  equipmentSupplierName?: string
  equipmentStatus?: string
  operationStatus?: string
  sequenceNumber?: number
  equipmentPurchase?: string
  equipmentOperating?: string
  createTime?: string
}

/** 设备类型 - 树数据源 */
export interface EquipmentTypeItem {
  id?: string
  typeCode?: string
  typeName?: string
}

/** 供应商名称列表项 */
export interface SupplierNameItem {
  supplierSn?: string
  supplierName?: string
}

/** 点检记录 VO */
export interface SpotInspectionVo {
  id?: string
  startTime?: string
  endTime?: string
  status?: string | number
  personName?: string
}

/** 维修记录 VO */
export interface RepairWorkOrderVo {
  id?: string
  breakdownTime?: string
  repairBeginTime?: string
  repairEndTime?: string
  status?: string | number
  repairPersonName?: string
}

/** 保养记录 VO */
export interface MaintenanceWorkOrderVo {
  id?: string
  startTime?: string
  endTime?: string
  useTime?: number
  status?: string | number
  personName?: string
}

// ==================== API 方法 ====================

/** 设备台账分页查询（复用 OptEquipment 列表接口） */
export const getDeviceLedgerPage = (params: any) =>
  request.get({ url: '/equipment/optEquipment/list', params })

/** 设备台账按 ID 查询详情 */
export const getDeviceLedgerById = (id: string) =>
  request.get({ url: '/equipment/optEquipment/queryById', params: { id } })

/** 设备类型分页列表（树数据源） */
export const getEquipmentTypeList = (params?: any) =>
  request.get({ url: '/mdm/eamBaseEquipmentType/list', params })

/** 供应商名称列表（搜索下拉数据源） */
export const getSupplierNameList = () =>
  request.get({ url: '/equipment/optSupplier/queryNameList' })

// ==================== 工单记录接口 ====================

/** 点检记录列表 */
export const getSpotInspectionList = (params: any) =>
  request.get({ url: '/workOrder/eamSpotInspectionWorkStandard/list', params })

/** 维修记录列表 */
export const getRepairWorkOrderList = (params: any) =>
  request.get({ url: '/workOrder/eamRepairWorkOrder/list', params })

/** 保养记录列表 */
export const getMaintenanceWorkOrderList = (params: any) =>
  request.get({ url: '/workOrder/eamMaintenanceWork/list', params })
