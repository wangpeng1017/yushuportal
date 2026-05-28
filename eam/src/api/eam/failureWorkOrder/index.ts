import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 主表查询参数 */
export interface FailureWorkOrderDto {
  pageNo?: number
  pageSize?: number
  failureCode?: string
  status?: string
  executeStatus?: string
  breakdownLevel?: string
  breakdownType?: string
  repairDegree?: string
  breakdownTime_begin?: string
  breakdownTime_end?: string
}

/** 主表 VO */
export interface FailureWorkOrderVo {
  id: string
  failureCode: string
  equipmentSn: string
  equipmentName: string
  equipmentType: string
  equipmentTypeName: string
  equipmentMode: string
  equipmentSupplierName: string
  breakdownTime: string
  personSn: string
  personName: string
  breakdownLevel: string
  breakdownLevelText: string
  breakdownType: string
  breakdownTypeText: string
  repairDegree: string
  repairDegreeText: string
  remark: string
  status: string
  executeStatus: string
  auditorIdea: string
  createByPersonName: string
  createTime: string
  /** 图片地址，多个以逗号分隔 */
  attachments?: string
}

/** 处理记录 VO */
export interface ProcessRecordVo {
  id: string
  failureCode: string
  operatePersonSn: string
  operatePersonName: string
  operateTime: string
  operateType: string
  operateTypeDesc: string
  operateContent: string
}

/** 审核通过请求参数 */
export interface AuditPassVo {
  ids: string
  createRepair: number
}

// ==================== 主表 API ====================

const prefix = '/workOrder/eamFailureWorkOrder'

/** 分页查询 */
export const getFailureWorkOrderPage = (params: FailureWorkOrderDto) =>
  request.get({ url: prefix + '/list', params })

/** 按 ID 查询 */
export const getFailureWorkOrderById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createFailureWorkOrder = (data: any) => request.post({ url: prefix + '/add', data })

/** 编辑 */
export const updateFailureWorkOrder = (data: any) => request.put({ url: prefix + '/edit', data })

/** 单条删除 */
export const deleteFailureWorkOrder = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const batchDeleteFailureWorkOrder = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

/** 提交申请 */
export const submitFailureWorkOrder = (ids: string) =>
  request.post({ url: prefix + '/submit', data: { ids } })

/** 审核通过 */
export const auditPassFailureWorkOrder = (data: AuditPassVo) =>
  request.post({ url: prefix + '/auditPass', data })

/** 驳回 */
export const rejectFailureWorkOrder = (data: { id: string; auditorIdea: string }) =>
  request.post({ url: prefix + '/reject', data })

// ==================== 处理记录 API ====================

const recordPrefix = '/workOrder/eamFailureWorkOrderProcessRecord'

/** 处理记录分页查询 */
export const getProcessRecordList = (params: {
  failureCode: string
  pageNo: number
  pageSize: number
}) => request.get({ url: recordPrefix + '/list', params })

// ==================== 枚举接口 ====================

/** 审核状态枚举 */
export const listOfStatus = () => request.get({ url: prefix + '/listOfStatus' })

/** 执行状态枚举 */
export const listOfExecuteStatus = () => request.get({ url: prefix + '/listOfExecuteStatus' })

/** 故障等级枚举 */
export const listOfBreakdownLevel = () => request.get({ url: prefix + '/listOfBreakdownLevel' })

/** 故障类别枚举 */
export const listOfBreakdownType = () => request.get({ url: prefix + '/listOfBreakdownType' })

/** 紧急程度枚举 */
export const listOfRepairDegree = () => request.get({ url: prefix + '/listOfRepairDegree' })

// ==================== 辅助 API ====================

/** 设备选择器分页查询 */
export const getEquipmentPageNew = (params: any) =>
  request.get({ url: '/equipment/optEquipment/pageListNew', params })
