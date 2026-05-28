import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 保养标准查询参数 */
export interface StandardDto {
  pageNo?: number
  pageSize?: number
  code?: string
  name?: string
}

/** 保养标准保存参数 */
export interface StandardSaveDto {
  id?: string
  code?: string
  name: string
  equipmentTypeCode?: string
  equipmentTypeDesc?: string
  seq?: number
}

/** 保养标准 VO */
export interface StandardVo {
  id: string
  code: string
  name: string
  equipmentTypeCode: string
  equipmentTypeDesc: string
  seq: number
  createByPersonName: string
  createTime: string
}

/** 标准项查询参数 */
export interface StandardItemDto {
  pageNo?: number
  pageSize?: number
  maintenanceStandardCode?: string
}

/** 标准项保存参数 */
export interface StandardItemSaveDto {
  id?: string
  maintenanceStandardCode: string
  maintenancePart: string
  remark: string
  seq?: number
}

/** 标准项 VO */
export interface StandardItemVo {
  id: string
  maintenanceStandardCode: string
  maintenancePart: string
  remark: string
  seq: number
  createByPersonName: string
  createTime: string
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamMaintenanceStandard'

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

// ==================== 子表 API ====================

const itemPrefix = '/workOrder/eamMaintenanceStandardItem'

/** 标准项分页查询 */
export const getStandardItemPage = (params: StandardItemDto) =>
  request.get({ url: itemPrefix + '/list', params })

/** 标准项按 ID 查询 */
export const getStandardItemById = (id: string) =>
  request.get({ url: itemPrefix + '/queryById', params: { id } })

/** 标准项新增 */
export const createStandardItem = (data: StandardItemSaveDto) =>
  request.post({ url: itemPrefix + '/add', data })

/** 标准项编辑 */
export const updateStandardItem = (data: StandardItemSaveDto) =>
  request.put({ url: itemPrefix + '/edit', data })

/** 标准项删除 */
export const deleteStandardItem = (id: string) =>
  request.delete({ url: itemPrefix + '/delete', params: { id } })

/** 标准项批量删除 */
export const batchDeleteStandardItem = (ids: string) =>
  request.delete({ url: itemPrefix + '/deleteBatch', params: { ids } })
