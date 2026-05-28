import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 参数巡检配置查询参数 */
export interface ParamConfDto {
  pageNo?: number
  pageSize?: number
  deviceTypeDesc?: string
  deviceModel?: string
  deviceSupName?: string
}

/** 参数巡检配置保存参数 */
export interface ParamConfSaveDto {
  id?: string
  code?: string
  name: string
  deviceType: string
  deviceTypeDesc: string
  deviceSupCode: string
  deviceSupName: string
  deviceModel: string
  status: string
  statusDesc: string
  /** 图片地址，多个以逗号分隔 */
  attachmentUrl?: string
}

/** 参数巡检配置 VO */
export interface ParamConfVo {
  id: string
  code: string
  name: string
  deviceType: string
  deviceTypeDesc: string
  deviceSupCode: string
  deviceSupName: string
  deviceModel: string
  status: string
  statusDesc: string
  createByPersonName: string
  createTime: string
  /** 图片地址，多个以逗号分隔 */
  attachmentUrl?: string
}

/** 参数项查询参数 */
export interface ParamItemDto {
  pageNo?: number
  pageSize?: number
  confId?: string
}

/** 参数项保存参数 */
export interface ParamItemSaveDto {
  id?: string
  confId: string
  deviceType: string
  deviceTypeDesc: string
  deviceSupCode: string
  deviceSupName: string
  deviceModel: string
  paramsGroup?: string
  paramsGroupDesc?: string
  paramsKey: string
  paramsDesc: string
  itemType: string
  normal?: string
  abnormal?: string
  upLimit?: string
  lowerLimit?: string
  defaultValue?: string
  paramsUnit?: string
  needTypeCode: string
  needTypeText: string
  sipItem: string
  sipItemDesc: string
  autoSip: string
  autoSipDesc: string
  sortNo: number
}

/** 参数项 VO */
export interface ParamItemVo {
  id: string
  confId: string
  deviceType: string
  deviceTypeDesc: string
  deviceSupCode: string
  deviceSupName: string
  deviceModel: string
  paramsGroup: string
  paramsGroupDesc: string
  paramsKey: string
  paramsDesc: string
  paramsUnit: string
  lowerLimit: string
  upLimit: string
  defaultValue: string
  itemType: string
  normal: string
  abnormal: string
  needTypeText: string
  needTypeCode: string
  sipItem: string
  sipItemDesc: string
  autoSip: string
  autoSipDesc: string
  sortNo: number
  createByPersonName: string
  createTime: string
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamSpotInspectionParamConf'

/** 主表分页查询 */
export const getParamConfPage = (params: ParamConfDto) =>
  request.get({ url: prefix + '/list', params })

/** 主表按 ID 查询 */
export const getParamConfById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 主表新增 */
export const createParamConf = (data: ParamConfSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 主表编辑 */
export const updateParamConf = (data: ParamConfSaveDto) =>
  request.put({ url: prefix + '/edit', data })

/** 主表删除 */
export const deleteParamConf = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 主表批量删除 */
export const batchDeleteParamConf = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

// ==================== 子表 API ====================

const itemPrefix = '/workOrder/eamSpotInspectionParamItems'

/** 参数项分页查询 */
export const getParamItemPage = (params: ParamItemDto) =>
  request.get({ url: itemPrefix + '/list', params })

/** 参数项按 ID 查询 */
export const getParamItemById = (id: string) =>
  request.get({ url: itemPrefix + '/queryById', params: { id } })

/** 参数项新增 */
export const createParamItem = (data: ParamItemSaveDto) =>
  request.post({ url: itemPrefix + '/add', data })

/** 参数项编辑 */
export const updateParamItem = (data: ParamItemSaveDto) =>
  request.put({ url: itemPrefix + '/edit', data })

/** 参数项删除 */
export const deleteParamItem = (id: string) =>
  request.delete({ url: itemPrefix + '/delete', params: { id } })

/** 参数项批量删除 */
export const batchDeleteParamItem = (ids: string) =>
  request.delete({ url: itemPrefix + '/deleteBatch', params: { ids } })

/** 按配置ID全部删除参数项 */
export const deleteAllParamItems = (confId: string) =>
  request.delete({ url: itemPrefix + '/deleteByConfId', params: { confId } })
