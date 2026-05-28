import request from '@/config/axios'

// ==================== DTO 定义 ====================

/** 设备无纸化记录 - 列表对象 */
export interface EquipmentPaperlessDto {
  createTime?: string
  shiftName?: string
  capacityGroupCode?: string
  equipmentSn?: string
  changeTime?: string
  changeTypeName?: string
  changePersonName?: string
}

/** 设备无纸化记录 - 查询参数 */
export interface EquipmentPaperlessQueryDto {
  pageNo?: number
  pageSize?: number
  date_begin?: string
  date_end?: string
  equipmentType?: string
}

// ==================== API 方法 ====================

/** 设备无纸化记录列表查询 */
export const getEquipmentPaperlessList = (params: EquipmentPaperlessQueryDto) =>
  request.get({ url: '/workOrder/eamSparePartChangeRecord/list', params })

/** 导出设备无纸化记录 */
export const exportEquipmentPaperless = (params: EquipmentPaperlessQueryDto) =>
  request.download({ url: '/workOrder/eamSparePartChangeRecord/exportXls', params })
