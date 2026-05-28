import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 设备档案 - 列表/详情返回对象（对应后端 OptEquipment Entity） */
export interface OptEquipmentVo {
  id?: string
  equipmentSn?: string
  equipmentName?: string
  equipmentType?: string
  equipmentTypeDesc?: string
  equipmentCategory?: string
  equipmentCategoryDesc?: string
  equipmentMode?: string
  equipmentTag?: string
  locationSn?: string
  equipmentSupplier?: string
  equipmentSupplierName?: string
  equipmentStatus?: string
  operationStatus?: string
  equipmentRevstop?: string
  sequenceNumber?: number
  equipmentPurchase?: string
  equipmentOperating?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
}

/** 设备档案 - 新增/编辑参数 */
export interface OptEquipmentSaveDto {
  id?: string
  equipmentSn?: string
  equipmentName: string
  equipmentType: string
  equipmentTypeDesc?: string
  equipmentCategory: string
  equipmentCategoryDesc?: string
  equipmentMode?: string
  equipmentTag?: string
  locationSn?: string
  equipmentSupplier?: string
  equipmentSupplierName?: string
  equipmentStatus?: string
  operationStatus?: string
  equipmentRevstop?: string
  sequenceNumber?: number
  equipmentPurchase?: string
  equipmentOperating?: string
}

// ==================== API 方法 ====================

const prefix = '/equipment/optEquipment'

/** 分页查询 */
export const getEquipmentPage = (params: any) => request.get({ url: prefix + '/list', params })

/** 按 ID 查询详情 */
export const getEquipmentById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createEquipment = (data: OptEquipmentSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑（后端支持 PUT 和 POST，新前端使用 PUT） */
export const updateEquipment = (data: OptEquipmentSaveDto) =>
  request.put({ url: prefix + '/edit', data })

/** 单条删除 */
export const deleteEquipment = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const deleteEquipmentBatch = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

// ==================== 枚举查询方法 ====================

/** 获取设备型号枚举列表 */
export const listOfMode = () => request.get({ url: prefix + '/listOfMode' })

/** 获取资产状态枚举列表 */
export const listOfStatus = () => request.get({ url: prefix + '/listOfStatus' })

/** 获取运行状态枚举列表 */
export const listOfOperationStatus = () => request.get({ url: prefix + '/listOfOperationStatus' })

/** 获取启停用状态枚举列表 */
export const listOfRevstop = () => request.get({ url: prefix + '/listOfRevstop' })

// ==================== 关联数据查询方法 ====================

/** 获取设备类型全量列表（不分页），用于搜索下拉 */
export const getEquipmentTypeAllList = (categoryCode?: string) =>
  request.get({
    url: '/mdm/eamBaseEquipmentType/scanDeviceTypeList',
    params: categoryCode ? { categoryCode } : {}
  })

/** 获取设备类型分页列表（用于弹窗选择） */
export const getEquipmentTypePage = (params?: any) =>
  request.get({ url: '/mdm/eamBaseEquipmentType/list', params })

/** 获取设备分类列表（用于 Tab 数据源和弹窗选择） */
export const getEquipmentCategoryList = (params?: any) =>
  request.get({
    url: '/mdm/eamBaseEquipmentCategory/list',
    params: { pageNo: 1, pageSize: 1000, ...params }
  })

/** 获取供应商列表（用于弹窗选择） */
export const getSupplierList = (params?: any) =>
  request.get({ url: '/equipment/optSupplier/list', params })
