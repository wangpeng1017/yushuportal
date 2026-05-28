import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 点巡检标准查询参数 */
export interface StandardDto {
  pageNo?: number
  pageSize?: number
  code?: string
  name?: string
  equipmentTypeCode?: string
}

/** 点巡检标准保存参数 */
export interface StandardSaveDto {
  id?: string
  code?: string
  name: string
  equipmentTypeCode: string
  equipmentTypeText: string
  remark?: string
}

/** 点巡检标准 VO */
export interface StandardVo {
  id: string
  code: string
  name: string
  equipmentTypeCode: string
  equipmentTypeText: string
  remark: string
  checknum: number
  createByPersonName: string
  createTime: string
}

/** 检查项查询参数 */
export interface StandardItemDto {
  pageNo?: number
  pageSize?: number
  standardCode?: string
  column?: string
  order?: string
}

/** 检查项保存参数 */
export interface StandardItemSaveDto {
  id?: string
  standardCode: string
  itemName: string
  itemType: string
  normal?: string
  abnormal?: string
  max?: string
  min?: string
  needTypeCode: string
  needTypeText: string
  defaultValue?: string
  sort: number
  checkStandard?: string
  unitName?: string
  unitNumber?: string
}

/** 检查项 VO */
export interface StandardItemVo {
  id: string
  standardCode: string
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

const prefix = '/workOrder/eamSpotInspectionStandard'

/** 主表分页查询 */
export const getStandardPage = (params: StandardDto) =>
  request.get({ url: prefix + '/list', params })

/** 主表按 ID 查询 */
export const getStandardById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 主表新增 */
export const createStandard = (data: StandardSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 主表编辑 */
export const updateStandard = (data: StandardSaveDto) =>
  request.put({ url: prefix + '/edit', data })

/** 主表删除 */
export const deleteStandard = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 主表批量删除 */
export const batchDeleteStandard = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

/** 参数单位枚举列表 */
export const listOfParamsUnit = () =>
  request.get({ url: prefix + '/listOfParamsUnit' })

/** 是否枚举列表 */
export const listOfYesNo = () =>
  request.get({ url: prefix + '/listOfYesNo' })

// ==================== 子表 API ====================

const itemPrefix = '/workOrder/eamSpotInspectionStandardItem'

/** 检查项分页查询 */
export const getStandardItemPage = (params: StandardItemDto) =>
  request.get({ url: itemPrefix + '/list', params })

/** 检查项按 ID 查询 */
export const getStandardItemById = (id: string) =>
  request.get({ url: itemPrefix + '/queryById', params: { id } })

/** 检查项新增 */
export const createStandardItem = (data: StandardItemSaveDto) =>
  request.post({ url: itemPrefix + '/add', data })

/** 检查项编辑 */
export const updateStandardItem = (data: StandardItemSaveDto) =>
  request.put({ url: itemPrefix + '/edit', data })

/** 检查项删除 */
export const deleteStandardItem = (id: string) =>
  request.delete({ url: itemPrefix + '/delete', params: { id } })

/** 检查项批量删除 */
export const batchDeleteStandardItem = (ids: string) =>
  request.delete({ url: itemPrefix + '/deleteBatch', params: { ids } })
