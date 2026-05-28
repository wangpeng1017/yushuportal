import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 主表查询参数 */
export interface WorkOrderDto {
  pageNo?: number
  pageSize?: number
  code?: string
  status?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 主表 VO */
export interface WorkOrderVo {
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
  remark: string
  createByPersonName: string
  createTime: string
}

/** 主表新增参数（含 itemList） */
export interface WorkOrderSaveDto {
  equipmentSn: string
  equipmentName: string
  equipmentTypeCode?: string
  equipmentTypeDesc?: string
  equipmentModel?: string
  equipmentSupplier?: string
  equipmentSupplierName?: string
  maintenanceLevel?: string
  maintenanceLevelDesc?: string
  workStartTime?: string
  overdueTime?: string
  planCode?: string
  planName?: string
  personSn?: string
  personName?: string
  status?: string
  remark?: string
  itemList?: WorkOrderItemLocal[]
}

/** 主表编辑参数（含 itemList，走 saveMaintenance） */
export interface WorkOrderUpdateDto extends WorkOrderSaveDto {
  id: string
  code: string
}

/** 保养项子表 VO（后端返回） */
export interface WorkOrderItemVo {
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

/** 保养项本地数据（前端暂存、随主表提交） */
export interface WorkOrderItemLocal {
  id?: string
  _tempId?: string
  maintenancePart: string
  remark: string
  seq?: number
  status?: string
  dealRemark?: string
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamMaintenanceWork'

/** 主表分页查询 */
export const getWorkOrderPage = (params: WorkOrderDto) =>
  request.get({ url: prefix + '/list', params })

/** 主表按 ID 查询 */
export const getWorkOrderById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增工单（含 itemList 整体提交） */
export const createWorkOrder = (data: WorkOrderSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑工单 — 保存保养（含 itemList 整体提交） */
export const saveMaintenanceWorkOrder = (data: WorkOrderUpdateDto) =>
  request.post({ url: prefix + '/saveMaintenance', data })

/** 派工（仅传 id / personSn / personName，走 edit） */
export const dispatchWorkOrder = (data: { id: string; personSn: string; personName: string }) =>
  request.put({ url: prefix + '/edit', data })

/** 单条删除 */
export const deleteWorkOrder = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const batchDeleteWorkOrder = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

/** 完成工单（后端 GET） */
export const completeWorkOrder = (params: { code: string; startTime: string; endTime?: string }) =>
  request.get({ url: prefix + '/completeWork', params })

/** 保养工单状态枚举 */
export const listOfWorkOrderStatus = () => request.get({ url: prefix + '/listOfStatus' })

// ==================== 保养项子表 API ====================

const itemPrefix = '/workOrder/eamMaintenanceWorkItem'

/** 保养项分页查询（用于 page.vue 下方子表加载） */
export const getWorkOrderItemPage = (params: {
  pageNo: number
  pageSize: number
  workCode: string
}) => request.get({ url: itemPrefix + '/list', params })

/** 保养项状态枚举 */
export const listOfItemStatus = () => request.get({ url: itemPrefix + '/listOfStatus' })

// ==================== 辅助 API ====================

/** 设备选择器分页查询（pageListNew） */
export const getEquipmentPageNew = (params: any) =>
  request.get({ url: '/equipment/optEquipment/pageListNew', params })

/** 保养标准分页查询（标准选择器弹窗） */
export const getMaintenanceStandardPage = (params: any) =>
  request.get({ url: '/workOrder/eamMaintenanceStandard/list', params })

/** 保养标准项列表查询（导入标准项到工单表单） */
export const getStandardItemList = (params: {
  maintenanceStandardCode: string
  pageNo: number
  pageSize: number
}) => request.get({ url: '/workOrder/eamMaintenanceStandardItem/list', params })
