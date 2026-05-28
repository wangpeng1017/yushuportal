import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 备件查询 - 列表对象 */
export interface SparePartSearchDto {
  id?: string
  number?: string
  name?: string
  specification?: string
  unitName?: string
  stockUnitName?: string
  purchaseUnitName?: string
  minPackCount?: number
  expPeriod?: number
  expUnit?: string
  isInventory?: string
  materialGroupNumber?: string
  materialGroupName?: string
  categoryName?: string
}

/** 备件 - 新增参数 */
export interface SparePartSaveDto {
  number: string
  name: string
  specification?: string
  unitName?: string
  stockUnitName?: string
  purchaseUnitName?: string
  minPackCount?: number
  expPeriod?: number
  expUnit?: string
  isInventory?: string
  materialGroupNumber?: string
  categoryName?: string
}

/** 备件 - 更新参数 */
export interface SparePartUpdateDto extends SparePartSaveDto {
  id: string
}

/** 备件查询 - 查询参数 */
export interface SparePartSearchQueryDto {
  number?: string
  name?: string
  specification?: string
  materialGroupNumber?: string
}

/** 备件分类树节点（物料分组树） */
export interface SparePartTreeNode {
  code?: string
  title?: string
  id?: string
  classifName?: string
  classifParentId?: string
  sort?: number
  status?: string
  children?: SparePartTreeNode[]
}

// ==================== API 方法 ====================

/** 备件列表查询 */
export const getSparePartList = (params: SparePartSearchQueryDto) =>
  request.get({ url: '/workOrder/eamBaseMaterial/list', params })

/** 备件分类树查询（物料分组树） */
export const getSparePartTreeList = () =>
  request.get({ url: '/work/eamSparePartClassification/listAll' })

/** 按 ID 查询备件详情 */
export const getSparePartById = (id: string) =>
  request.get({ url: '/workOrder/eamBaseMaterial/queryById', params: { id } })

/** 新增备件 */
export const createSparePart = (data: SparePartSaveDto) =>
  request.post({ url: '/workOrder/eamBaseMaterial/add', data })

/** 编辑备件 */
export const updateSparePart = (data: SparePartUpdateDto) =>
  request.post({ url: '/workOrder/eamBaseMaterial/edit', data })

/** 删除备件 */
export const deleteSparePart = (id: string) =>
  request.delete({ url: '/workOrder/eamBaseMaterial/delete', params: { id } })

/** 导出备件列表 */
export const exportSparePartList = (params: SparePartSearchQueryDto) =>
  request.download({ url: '/workOrder/eamBaseMaterial/exportXls', params })
