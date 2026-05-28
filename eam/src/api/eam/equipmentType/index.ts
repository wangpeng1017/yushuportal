import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 设备类型 - 查询/列表对象 */
export interface EamBaseEquipmentTypeDto {
  id?: string
  typeCode?: string
  typeName?: string
  categoryCode?: string
  categoryName?: string
  createBy?: string
  createByName?: string
  createTime?: string
  updateBy?: string
  updateByName?: string
  updateTime?: string
  delFlag?: number
}

/** 设备类型 - 新增参数 */
export interface EamBaseEquipmentTypeSaveDto {
  typeCode: string
  typeName: string
  categoryCode: string
  categoryName: string
}

/** 设备类型 - 更新参数 */
export interface EamBaseEquipmentTypeUpdateDto extends EamBaseEquipmentTypeSaveDto {
  id: string
}

// ==================== API 方法 ====================

const prefix = '/mdm/eamBaseEquipmentType'

/** 分页查询 */
export const getEquipmentTypePage = (params: any) => request.get({ url: prefix + '/list', params })

/** 全量列表（不分页），可选按 categoryCode 筛选 */
export const getEquipmentTypeList = (categoryCode?: string) =>
  request.get({ url: prefix + '/allList', params: categoryCode ? { categoryCode } : {} })

/** 按 ID 查询详情 */
export const getEquipmentTypeById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createEquipmentType = (data: EamBaseEquipmentTypeSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑 */
export const updateEquipmentType = (data: EamBaseEquipmentTypeUpdateDto) =>
  request.put({ url: prefix + '/edit', data })

/** 删除 */
export const deleteEquipmentType = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const batchDeleteEquipmentType = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

// TODO: 后端 exportXls 接口当前未实现（返回 null），导出功能暂不可用
// export const exportEquipmentType = (params: any) =>
//   request.download({ url: prefix + '/exportXls', params })
