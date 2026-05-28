import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 供应商 - 列表返回对象（对应后端 SupplierVo） */
export interface OptSupplierVo {
  id?: string
  supplierSn?: string
  supplierName?: string
  supplierCert?: string
  supplierCategory?: string
  supplierGoods?: string
  contacts?: string
  contactsPhone?: string
  supplierStatus?: string
  createTime?: string
}

/** 供应商 - 新增/编辑参数（对应后端 SupplierParamVo） */
export interface OptSupplierSaveDto {
  id?: string
  supplierSn: string
  supplierName: string
  supplierCert: string
  supplierCategory: string
  supplierGoods: string
  contacts: string
  contactsPhone: string
  supplierStatus: string
}

/** 供应商 - 详情返回对象（对应后端 OptSupplier Entity） */
export interface OptSupplierDto {
  id?: string
  supplierSn?: string
  supplierName?: string
  supplierCert?: string
  supplierCategory?: string
  supplierGoods?: string
  contacts?: string
  contactsPhone?: string
  supplierStatus?: string
  createBy?: string
  createTime?: string
  updateBy?: string
  updateTime?: string
  delFlag?: number
}

// ==================== API 方法 ====================

const prefix = '/equipment/optSupplier'

/** 分页查询 */
export const getSupplierPage = (params: any) => request.get({ url: prefix + '/list', params })

/** 按 ID 查询详情 */
export const getSupplierById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createSupplier = (data: OptSupplierSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑（注意：后端是 POST 不是 PUT） */
export const updateSupplier = (data: OptSupplierSaveDto) =>
  request.post({ url: prefix + '/edit', data })

/** 删除 */
export const deleteSupplier = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 启停用切换（注意：后端是 GET 方法） */
export const toggleSupplierStatus = (id: string) =>
  request.get({ url: prefix + '/startupAndShutdown', params: { id } })

// ==================== 枚举查询方法 ====================

/** 获取供应商类别枚举列表 */
export const listOfCategory = () => request.get({ url: prefix + '/listOfCategory' })

/** 获取供应设备类别枚举列表 */
export const listOfGoods = () => request.get({ url: prefix + '/listOfGoods' })

/** 获取供应商状态枚举列表 */
export const listOfStatus = () => request.get({ url: prefix + '/listOfStatus' })

// TODO: 后端无导出接口，导出功能暂不可用
// export const exportSupplier = (params: any) =>
//   request.download({ url: prefix + '/exportXls', params })
