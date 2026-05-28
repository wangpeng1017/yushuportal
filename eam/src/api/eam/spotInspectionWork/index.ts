import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 主表查询参数 */
export interface WorkDto {
  pageNo?: number
  pageSize?: number
  workCode?: string
  planName?: string
  status?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 主表 VO */
export interface WorkVo {
  id: string
  workCode: string
  planCode: string
  planName: string
  status: string
  hasParamPlan: string
  equipmentModel: string
  spotInspection: string
  workStartTime: string
  overdueTime: string
  startTime: string
  endTime: string
  positionName: string
  personSn: string
  personName: string
  createTime: string
}

/** 设备子表查询参数 */
export interface WorkStandardDto {
  pageNo?: number
  pageSize?: number
  workCode?: string
}

/** 设备子表 VO */
export interface WorkStandardVo {
  id: string
  workCode: string
  status: string
  spotInspection: string
  abnormalNum: number
  startTime: string
  endTime: string
  hasParamPlan: string
  deviceSn: string
  deviceName: string
  equipmentTypeDesc: string
  deviceMode: string
  equipmentSupplierName: string
  personName: string
  skipReason: string
  skipPersonName: string
  createTime: string
  /** 图片地址，多个以逗号分隔 */
  attachments?: string
}

/** 检查项查询参数 */
export interface WorkStandardItemDto {
  pageNo?: number
  pageSize?: number
  workStandardId?: string
}

/** 检查项 VO */
export interface WorkStandardItemVo {
  id: string
  workStandardId: string
  itemName: string
  itemType: string
  needTypeCode: string
  needTypeText: string
  normal: string
  abnormal: string
  max: string
  min: string
  defaultValue: string
  unitName: string
  paramsUnit: string
  checkRecord: string
  checkResult: string
  sort: number
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamSpotInspectionWork'

/** 主表分页查询 */
export const getWorkPage = (params: WorkDto) => request.get({ url: prefix + '/list', params })

/** 主表按 ID 查询 */
export const getWorkById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 主表编辑（用于派工） */
export const updateWork = (data: Record<string, any>) =>
  request.put({ url: prefix + '/edit', data })

/** 工单状态枚举 */
export const listOfStatus = () => request.get({ url: prefix + '/listOfStatus' })

// ==================== 设备子表 API ====================

const standardPrefix = '/workOrder/eamSpotInspectionWorkStandard'

/** 设备子表分页查询 */
export const getWorkStandardPage = (params: WorkStandardDto) =>
  request.get({ url: standardPrefix + '/list', params })

/** 设备子表按 ID 查询 */
export const getWorkStandardById = (id: string) =>
  request.get({ url: standardPrefix + '/queryById', params: { id } })

/** 设备子表编辑（保存开始/结束时间） */
export const updateWorkStandard = (data: Record<string, any>) =>
  request.put({ url: standardPrefix + '/edit', data })

/** 跳过巡检（后端为 GET 方法，参数走 query string） */
export const skipCheck = (params: Record<string, any>) =>
  request.get({ url: standardPrefix + '/skipCheck', params })

// ==================== 检查项 API ====================

const itemPrefix = '/workOrder/eamSpotInspectionWorkStandardItem'

/** 检查项分页查询 */
export const getWorkStandardItemPage = (params: WorkStandardItemDto) =>
  request.get({ url: itemPrefix + '/list', params })

/** 检查项编辑（保存检查记录） */
export const updateWorkStandardItem = (data: Record<string, any>) =>
  request.post({ url: itemPrefix + '/edit', data })

/** 完成工单（后端为 GET 方法，参数走 query string） */
export const saveWorkStandard = (params: Record<string, any>) =>
  request.get({ url: itemPrefix + '/saveWorkStandard', params })
