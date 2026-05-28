import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 分页查询参数 */
export interface RepairWorkOrderDto {
  pageNo?: number
  pageSize?: number
  repairCode?: string
  failureWorkOrderCode?: string
  equipmentSn?: string
  equipmentName?: string
  equipmentMode?: string
  status?: string
  createTime_begin?: string
  createTime_end?: string
}

/** 主表 VO */
export interface RepairWorkOrderVo {
  id: string
  repairCode: string
  equipmentSn: string
  equipmentName: string
  equipmentType: string
  equipmentTypeName: string
  equipmentMode: string
  equipmentSupplier: string
  equipmentSupplierName: string
  plantCode: string
  plantName: string
  workShopCode: string
  workShopName: string
  workCenterCode: string
  workCenterName: string
  capacityGroupCode: string
  capacityGroupName: string
  sourceType: string
  sourceTypeText: string
  breakdownTime: string
  breakdownLevel: string
  breakdownLevelText: string
  breakdownType: string
  breakdownTypeText: string
  repairDegree: string
  repairDegreeText: string
  remark: string
  attachments: string
  undertakeDepartmentCode: string
  undertakeDepartmentName: string
  undertakePositionCode: string
  undertakePositionName: string
  repairPersonSn: string
  repairPersonName: string
  status: string
  statusDesc: string
  repairLevel: string
  repairLevelText: string
  repairType: string
  repairTypeText: string
  needShutdown: string
  needShutdownText: string
  shutdownBeginTime: string
  shutdownEndTime: string
  shutdownDuration: string
  shutdownDurationText: string
  repairBeginTime: string
  repairEndTime: string
  repairDuration: string
  repairDurationText: string
  failureWorkOrderCode: string
  presentPersonSn: string
  presentPersonName: string
  presentTime: string
  confirmPersonSn: string
  confirmPersonName: string
  confirmTime: string
  hasBreakdown: string
  repairRecord: string
  createByPersonName: string
  createTime: string
}

/** 创建工单参数 */
export interface RepairWorkOrderCreateVo {
  equipmentSn?: string
  equipmentName?: string
  equipmentType?: string
  equipmentTypeName?: string
  equipmentMode?: string
  capacityGroupCode?: string
  capacityGroupName?: string
  hasBreakdown?: string
  breakdownTime?: string
  breakdownLevel?: string
  breakdownLevelText?: string
  remark?: string
  attachments?: string
}

/** 编辑工单参数 */
export interface RepairWorkOrderUpdateVo extends RepairWorkOrderCreateVo {
  id: string
  repairCode?: string
}

/** 发布工单参数 */
export interface RepairWorkOrderPublishVo extends RepairWorkOrderCreateVo {
  id?: string
  repairCode?: string
}

/** 派工参数 */
export interface RepairWorkOrderAssignVo {
  id: string
  repairPersonSn: string
  repairPersonName: string
}

/** 撤单参数 */
export interface RepairWorkOrderRevokeVo {
  id: string
  reason?: string
}

/** 重新派工参数 */
export interface RepairWorkOrderReassignVo {
  id: string
  repairPersonSn: string
  repairPersonName: string
  reason?: string
}

/** 确认完成参数 */
export interface RepairWorkOrderConfirmVo {
  id: string
}

/** 处理记录 VO */
export interface RepairWorkOrderProcessRecordVo {
  id: string
  repairCode: string
  operatePersonSn: string
  operatePersonName: string
  operateTime: string
  operateType: string
  operateTypeDesc: string
  operateContent: string
  changePersonSn: string
  changePersonName: string
  status: string
  statusDesc: string
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamRepairWorkOrder'

/** 分页查询 */
export const getRepairWorkOrderPage = (params: RepairWorkOrderDto) =>
  request.get({ url: prefix + '/list', params })

/** 按 ID 查询 */
export const getRepairWorkOrderById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 创建工单 */
export const createOrder = (data: RepairWorkOrderCreateVo) =>
  request.post({ url: prefix + '/createOrder', data })

/** 编辑工单 */
export const editOrder = (data: RepairWorkOrderUpdateVo) =>
  request.put({ url: prefix + '/editOrder', data })

/** 发布工单 */
export const publishOrder = (data: RepairWorkOrderPublishVo) =>
  request.put({ url: prefix + '/publishOrder', data })

/** 单条删除 */
export const deleteRepairWorkOrder = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 派工 */
export const assignOrder = (data: RepairWorkOrderAssignVo) =>
  request.post({ url: prefix + '/assignOrder', data })

/** 撤单 */
export const revokeOrder = (data: RepairWorkOrderRevokeVo) =>
  request.post({ url: prefix + '/revokeOrder', data })

/** 重新派工 */
export const reassignOrder = (data: RepairWorkOrderReassignVo) =>
  request.post({ url: prefix + '/reassignOrder', data })

/** 确认完成 */
export const confirmComplete = (data: RepairWorkOrderConfirmVo) =>
  request.post({ url: prefix + '/confirmComplete', data })

// ==================== 处理记录 API ====================

const recordPrefix = '/workOrder/eamRepairWorkOrderProcessRecord'

/** 处理记录分页查询 */
export const getProcessRecordList = (params: {
  repairCode: string
  pageNo: number
  pageSize: number
}) => request.get({ url: recordPrefix + '/list', params })

// ==================== 枚举接口 ====================

/** 工单状态枚举 */
export const listOfStatus = () => request.get({ url: prefix + '/listOfStatus' })

/** 来源类型枚举 */
export const listOfSource = () => request.get({ url: prefix + '/listOfSource' })

/** 维修级别枚举 */
export const listOfRepairLevel = () => request.get({ url: prefix + '/listOfRepairLevel' })

/** 维修类型枚举 */
export const listOfRepairType = () => request.get({ url: prefix + '/listOfRepairType' })

/** 紧急程度枚举 */
export const listOfRepairDegree = () => request.get({ url: prefix + '/listOfRepairDegree' })

// ==================== 备件耗用子表 API ====================

const sparePartPrefix = '/workOrder/eamRepairWorkOrderSparePart'

/** 查询维修工单备件列表 */
export const getRepairWorkOrderSparePartList = (repairCode: string) =>
  request
    .get({ url: sparePartPrefix + '/list', params: { repairCode } })
    .then((res: any) => res?.records ?? res ?? [])

/** 新增备件耗用 */
export const addRepairWorkOrderSparePart = (data: {
  repairCode: string
  sparePartNumber: string
  sparePartName: string
  quantity: number
  remark?: string
}) => request.post({ url: sparePartPrefix + '/add', data })

/** 删除备件耗用 */
export const deleteRepairWorkOrderSparePart = (id: string) =>
  request.delete({ url: sparePartPrefix + '/delete', params: { id } })
