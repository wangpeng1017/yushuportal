import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 备件分类 - 查询/列表对象 */
export interface EamSparePartClassificationDto {
  id?: string
  classifName?: string
  classifParentId?: string
  parentName?: string
  sort?: number
  status?: string
  createBy?: string
  createByName?: string
  createTime?: string
  updateBy?: string
  updateByName?: string
  updateTime?: string
}

/** 备件分类 - 新增参数 */
export interface EamSparePartClassificationSaveDto {
  classifName: string
  classifParentId?: string
  sort?: number
  status?: string
}

/** 备件分类 - 更新参数 */
export interface EamSparePartClassificationUpdateDto extends EamSparePartClassificationSaveDto {
  id: string
}

/** 状态枚举项 */
export interface StatusOption {
  text: string
  value: string
}

// ==================== API 方法 ====================

const prefix = '/work/eamSparePartClassification'

/** 分页查询 */
export const getSparePartClassificationPage = (params: any) =>
  request.get({ url: prefix + '/list', params })

/** 全量列表（不分页） */
export const getSparePartClassificationList = (params?: any) =>
  request.get({ url: prefix + '/listAll', params })

/** 按 ID 查询详情 */
export const getSparePartClassificationById = (id: string) =>
  request.get({ url: prefix + '/queryById', params: { id } })

/** 新增 */
export const createSparePartClassification = (data: EamSparePartClassificationSaveDto) =>
  request.post({ url: prefix + '/add', data })

/** 编辑 */
export const updateSparePartClassification = (data: EamSparePartClassificationUpdateDto) =>
  request.put({ url: prefix + '/edit', data })

/** 删除 */
export const deleteSparePartClassification = (id: string) =>
  request.delete({ url: prefix + '/delete', params: { id } })

/** 批量删除 */
export const batchDeleteSparePartClassification = (ids: string) =>
  request.delete({ url: prefix + '/deleteBatch', params: { ids } })

/** 导出 */
export const exportSparePartClassification = (params: any) =>
  request.download({ url: prefix + '/exportXls', params })

/** 获取状态枚举列表 */
export const getStatusList = () =>
  request.get({ url: prefix + '/listOfStatus' })
