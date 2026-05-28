import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 周期频率类型 VO（来自后端 queryDictItem） */
export interface PeriodicFrequencyTypeVo {
  type: string
  oneMode: string
  one: (string | number)[]
  twoMode: string
  two: number[]
  oneTitle: string
  twoTitle: string
}

/** 主表查询参数 */
export interface PlanDto {
  pageNo?: number
  pageSize?: number
  code?: string
  name?: string
  status?: string
}

/** 主表保存参数 */
export interface PlanSaveDto {
  id?: string
  code?: string
  name: string
  equipmentTypeCode: string
  equipmentTypeText: string
  equipmentModel?: string
  startDate: string
  endDate: string
  skipCode: string
  skipText?: string
  periodicFrequencyType: string
  periodicFrequency: string
  hasParamPlan: string
  validityPeriod?: number
  status: string
}

/** 主表 VO */
export interface PlanVo {
  id: string
  code: string
  name: string
  equipmentTypeCode: string
  equipmentTypeText: string
  equipmentModel: string
  startDate: string
  endDate: string
  skipCode: string
  skipText: string
  periodicFrequencyType: string
  periodicFrequency: string
  deviceNum: number
  status: string
  hasParamPlan: string
  validityPeriod: number
  createByPersonName: string
  createTime: string
}

/** 设备子表查询参数 */
export interface PlanDeviceDto {
  pageNo?: number
  pageSize?: number
  planCode?: string
}

/** 设备子表保存参数 */
export interface PlanDeviceSaveDto {
  id?: string
  planCode: string
  equipmentSn: string
  equipmentName: string
  equipmentModel?: string
  equipmentSupplier?: string
  equipmentSupplierName?: string
  equipmentType?: string
  equipmentTypeDesc?: string
  hasParamPlan?: string
}

/** 设备子表 VO */
export interface PlanDeviceVo {
  id: string
  planCode: string
  equipmentSn: string
  equipmentName: string
  equipmentModel: string
  equipmentSupplier: string
  equipmentSupplierName: string
  equipmentType: string
  equipmentTypeDesc: string
  hasParamPlan: string
  createByPersonName: string
  createTime: string
}

/** 检查项子表查询参数 */
export interface PlanItemDto {
  pageNo?: number
  pageSize?: number
  planCode?: string
}

/** 检查项子表保存参数 */
export interface PlanItemSaveDto {
  id?: string
  planCode: string
  itemName: string
  itemType: string
  normal?: string
  abnormal?: string
  max?: string
  min?: string
  needTypeCode: string
  needTypeText: string
  defaultValue?: string
  sort?: number
  checkStandard?: string
  unitName?: string
  unitNumber?: string
}

/** 检查项子表 VO */
export interface PlanItemVo {
  id: string
  planCode: string
  itemName: string
  itemType: string
  normal: string
  abnormal: string
  max: string
  min: string
  needTypeCode: string
  needTypeText: string
  defaultValue: string
  sort: number
  checkStandard: string
  unitName: string
  unitNumber: string
  createByPersonName: string
  createTime: string
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamSpotInspectionPlan'

/** 主表分页查询 */
export const getPlanPage = (params: PlanDto) => request.get({ url: prefix + '/list', params })

/** 主表按 ID 查询 */
export const getPlanById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 主表新增 */
export const createPlan = (data: PlanSaveDto) => request.post({ url: prefix + '/add', data })

/** 主表编辑 */
export const updatePlan = (data: PlanSaveDto) => request.put({ url: prefix + '/edit', data })

/** 主表删除 */
export const deletePlan = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 主表批量删除 */
export const batchDeletePlan = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

/** 启用/停用（后端为 GET 方法） */
export const updatePlanStatus = (ids: string, status: string) =>
  request.get({ url: prefix + '/updateStatus', params: { ids, status } })

/** 查询周期频率类型字典（后端为 GET 方法） */
export const queryDictItem = (): Promise<PeriodicFrequencyTypeVo[]> =>
  request.get({ url: prefix + '/queryDictItem' })

/** 设备选择器 — 分页查询可选设备（已排除当前计划已有设备） */
export const pageListByResourcesTree = (params: any) =>
  request.get({ url: prefix + '/pageListByResourcesTree', params })

/** 根据计划手动创建工单 */
export const createWorkOrder = (planCode: string) =>
  request.post({ url: prefix + '/createWorkOrder', params: { planCode } })

// ==================== 设备子表 API ====================

const devicePrefix = '/workOrder/eamSpotInspectionPlanDevice'

/** 设备列表分页查询 */
export const getDevicePage = (params: PlanDeviceDto) =>
  request.get({ url: devicePrefix + '/list', params })

/** 设备批量新增（后端接收 List） */
export const addDevices = (data: PlanDeviceSaveDto[]) =>
  request.post({ url: devicePrefix + '/add', data })

/** 设备删除 */
export const deleteDevice = (id: string) =>
  request.delete({ url: devicePrefix + '/delete', params: { id } })

/** 设备批量删除 */
export const batchDeleteDevice = (ids: string) =>
  request.delete({ url: devicePrefix + '/deleteBatch', params: { ids } })

// ==================== 检查项子表 API ====================

const itemPrefix = '/workOrder/eamSpotInspectionPlanItem'

/** 检查项分页查询 */
export const getItemPage = (params: PlanItemDto) =>
  request.get({ url: itemPrefix + '/list', params })

/** 检查项新增 */
export const createItem = (data: PlanItemSaveDto) =>
  request.post({ url: itemPrefix + '/add', data })

/** 检查项编辑 */
export const updateItem = (data: PlanItemSaveDto) =>
  request.put({ url: itemPrefix + '/edit', data })

/** 检查项删除 */
export const deleteItem = (id: string) =>
  request.delete({ url: itemPrefix + '/delete', params: { id } })

/** 检查项批量删除 */
export const batchDeleteItem = (ids: string) =>
  request.delete({ url: itemPrefix + '/deleteBatch', params: { ids } })

/** 选择标准导入检查项（后端为 GET 方法） */
export const addStandard = (planCode: string, standardCodes: string) =>
  request.get({ url: itemPrefix + '/addStandard', params: { planCode, standardCodes } })

// ==================== 标准选择器辅助 API ====================

/** 点巡检标准分页查询（用于标准选择弹窗） */
export const getStandardPage = (params: any) =>
  request.get({ url: '/workOrder/eamSpotInspectionStandard/list', params })
