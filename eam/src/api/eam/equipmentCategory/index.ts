import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 设备分类 - 查询/列表对象 */
export interface EamBaseEquipmentCategoryDto {
  id?: string
  categoryCode?: string
  categoryName?: string
  sortNo?: number
  createBy?: string
  createByName?: string
  createTime?: string
  updateBy?: string
  updateByName?: string
  updateTime?: string
  delFlag?: number
}

/** 设备分类 - 新增参数 */
export interface EamBaseEquipmentCategorySaveDto {
  categoryCode: string
  categoryName: string
  sortNo: number
}

/** 设备分类 - 更新参数 */
export interface EamBaseEquipmentCategoryUpdateDto extends EamBaseEquipmentCategorySaveDto {
  id: string
}

// ==================== API 方法 ====================

const prefix = '/mdm/eamBaseEquipmentCategory'

/** 分页查询 */
export const getEquipmentCategoryPage = (params: any) =>
  request.get({ url: prefix + '/list', params })

/** 全量列表（不分页） */
export const getEquipmentCategoryList = () =>
  request.get({ url: prefix + '/equipmentCategoryList' })

/** 按 ID 查询详情 */
export const getEquipmentCategoryById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createEquipmentCategory = (data: EamBaseEquipmentCategorySaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑 */
export const updateEquipmentCategory = (data: EamBaseEquipmentCategoryUpdateDto) =>
  request.put({ url: prefix + '/edit', data })

/** 删除 */
export const deleteEquipmentCategory = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const batchDeleteEquipmentCategory = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

// TODO: 后端 exportXls 接口当前未实现（返回 null），导出功能暂不可用
// export const exportEquipmentCategory = (params: any) =>
//   request.download({ url: prefix + '/exportXls', params })
