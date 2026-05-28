/**
 * Copyright (c) 2025-2026
 * Quality Inspection Record Type Definitions
 * Since 2026-02-06
 */

/**
 * 检验单DTO
 */
export interface InspectionOrderDto {
  id?: number
  inspectionNo?: string
  inspectionType?: string
  sourceOrderNo?: string
  sourceOrderType?: string
  materialCode?: string
  materialName?: string
  batchNo?: string
  supplierOrLine?: string
  warehouseCode?: string
  warehouseName?: string
  inspectionTime?: string
  inspector?: string
  inspectionResult?: string
  orderStatus?: string
  reportFileUrl?: string
  remark?: string
  tenantId?: string
}

/**
 * 检验单分页查询DTO
 */
export interface InspectionOrderPageDto {
  pageNo?: number
  pageSize?: number
  inspectionNo?: string
  materialCode?: string
  materialName?: string
  inspectionType?: string
  inspectionResult?: string
  orderStatus?: string
  supplierOrLine?: string
  inspectionTimeStart?: string
  inspectionTimeEnd?: string
}

/**
 * 检验单保存DTO
 */
export interface InspectionOrderSaveDto {
  inspectionType: string
  sourceOrderNo?: string
  sourceOrderType?: string
  materialCode: string
  materialName: string
  batchNo?: string
  supplierOrLine?: string
  warehouseCode?: string
  warehouseName?: string
  inspectionTime: string
  inspector: string
  inspectionResult: string
  remark?: string
  items: InspectionItemSaveDto[]
}

/**
 * 检验单更新DTO
 */
export interface InspectionOrderUpdateDto {
  id: number
  inspectionType: string
  sourceOrderNo?: string
  sourceOrderType?: string
  materialCode: string
  materialName: string
  batchNo?: string
  supplierOrLine?: string
  warehouseCode?: string
  warehouseName?: string
  inspectionTime: string
  inspector: string
  inspectionResult: string
  remark?: string
  items: InspectionItemSaveDto[]
}

/**
 * 检验项目保存DTO
 */
export interface InspectionItemSaveDto {
  id?: number
  itemCode?: string
  itemName: string
  standardRequirement?: string
  actualValue?: string
  judgeResult: string
  itemSort?: number
  remark?: string
}

/**
 * 检验单VO
 */
export interface InspectionOrderVo {
  id?: number
  inspectionNo?: string
  inspectionType?: string
  inspectionTypeText?: string
  sourceOrderNo?: string
  sourceOrderType?: string
  sourceOrderTypeText?: string
  materialCode?: string
  materialName?: string
  batchNo?: string
  supplierOrLine?: string
  warehouseCode?: string
  warehouseName?: string
  inspectionTime?: string
  inspector?: string
  inspectionResult?: string
  inspectionResultText?: string
  orderStatus?: string
  orderStatusText?: string
  reportFileUrl?: string
  remark?: string
  items?: InspectionItemVo[]
  createTime?: string
  creator?: string
  updateTime?: string
  updater?: string
}

/**
 * 检验项目VO
 */
export interface InspectionItemVo {
  id?: number
  itemCode?: string
  itemName?: string
  standardRequirement?: string
  actualValue?: string
  judgeResult?: string
  judgeResultText?: string
  itemSort?: number
  remark?: string
}

/**
 * QMS同步查询DTO
 */
export interface QmsSyncQueryDto {
  startTime?: string
  endTime?: string
  materialCode?: string
}

/**
 * QMS同步结果VO
 */
export interface QmsSyncResultVo {
  totalCount?: number
  createdCount?: number
  updatedCount?: number
  failedCount?: number
  errors?: QmsSyncError[]
}

/**
 * QMS同步错误信息
 */
export interface QmsSyncError {
  inspectionNo?: string
  errorMessage?: string
}

/**
 * 枚举选项
 */
export interface EnumOption {
  label: string
  value: string
}
