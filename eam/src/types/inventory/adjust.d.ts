/**
 * Copyright (c) 2025-2026
 * Inventory Adjustment Type Definitions
 * Since 2026-02-03
 */

/**
 * Inventory Adjustment Order DTO
 */
export interface InventoryAdjustOrderDto {
  id?: number
  adjustOrderNo?: string
  adjustType?: number
  adjustReason?: number
  warehouseId?: number
  relatedOrderNo?: string
  approvalStatus?: number
  remark?: string
  attachment?: string
  auditor?: string
  auditTime?: string
  tenantId?: string
}

/**
 * Inventory Adjustment Order Page VO
 */
export interface InventoryAdjustOrderPageVo {
  id?: number
  adjustOrderNo?: string
  adjustType?: number
  adjustTypeName?: string
  adjustReason?: number
  adjustReasonName?: string
  warehouseId?: number
  warehouseName?: string
  relatedOrderNo?: string
  approvalStatus?: number
  approvalStatusName?: string
  remark?: string
  auditor?: string
  auditTime?: string
  createTime?: string
  creator?: string
  detailCount?: number
  totalAdjustQty?: number
}

/**
 * Inventory Adjustment Detail DTO
 */
export interface InventoryAdjustDetailDto {
  id?: number
  adjustOrderNo?: string
  warehouseId?: number
  areaId?: number
  locationId: number
  materialCode: string
  batchNo: string
  systemQty?: number
  actualQty?: number
  adjustQty?: number
  afterQty?: number
  tenantId?: string
}

/**
 * Inventory Adjustment Detail VO
 */
export interface InventoryAdjustDetailVo {
  id?: number
  adjustOrderNo?: string
  warehouseId?: number
  warehouseName?: string
  areaId?: number
  areaName?: string
  locationId?: number
  locationCode?: string
  materialCode?: string
  materialName?: string
  batchNo?: string
  systemQty?: number
  actualQty?: number
  adjustQty?: number
  afterQty?: number
  tenantId?: string
  createTime?: string
  creator?: string
  updateTime?: string
  updater?: string
  deleted?: boolean
}

/**
 * Inventory Adjustment Detail Page VO (for detail left join order)
 */
export interface InventoryAdjustDetailPageVo {
  id?: number
  adjustOrderNo?: string
  adjustType?: number
  adjustReason?: number
  materialCode?: string
  materialName?: string
  materialSpec?: string
  batchNo?: string
  locationId?: number
  locationCode?: string
  locationName?: string
  systemQty?: number
  actualQty?: number
  adjustQty?: number
  approvalStatus?: number
  createTime?: string
  creator?: string
}

/**
 * Inventory Adjustment Order Save DTO
 */
export interface InventoryAdjustOrderSaveDto {
  adjustOrderNo: string
  adjustType: number
  adjustReason: number
  warehouseId: number
  relatedOrderNo?: string
  remark?: string
  attachment?: string
  detailList?: InventoryAdjustDetailDto[]
  tenantId?: string
}

/**
 * Inventory Adjustment Order Update DTO
 */
export interface InventoryAdjustOrderUpdateDto {
  id: number
  adjustOrderNo: string
  adjustType: number
  adjustReason: number
  warehouseId: number
  relatedOrderNo?: string
  remark?: string
  attachment?: string
  detailList?: InventoryAdjustDetailDto[]
  tenantId?: string
}

/**
 * Inventory Adjustment Order Submit DTO
 */
export interface InventoryAdjustOrderSubmitDto {
  id: number
}

/**
 * Inventory Adjustment Order Approve DTO
 */
export interface InventoryAdjustOrderApproveDto {
  id: number
  remark?: string
}

/**
 * Inventory Adjustment Order Post DTO
 */
export interface InventoryAdjustOrderPostDto {
  id: number
}

/**
 * Inventory Adjustment Order Page Query DTO
 */
export interface InventoryAdjustOrderPageDto {
  pageNo?: number
  pageSize?: number
  adjustOrderNo?: string
  warehouseId?: number
  adjustType?: number
  adjustReason?: number
  approvalStatus?: number
  beginTime?: string
  endTime?: string
}

/**
 * Inventory Adjustment Order Detail VO
 */
export interface InventoryAdjustOrderDetailVo {
  id?: number
  adjustOrderNo?: string
  adjustType?: number
  adjustTypeName?: string
  adjustReason?: number
  adjustReasonName?: string
  warehouseId?: number
  warehouseName?: string
  relatedOrderNo?: string
  approvalStatus?: number
  approvalStatusName?: string
  remark?: string
  attachment?: string
  auditor?: string
  auditTime?: string
  createTime?: string
  creator?: string
  creatorName?:string
  updateTime?: string
  updater?: string
  updaterName?: string
  detailList?: InventoryAdjustDetailVo[]
}

/**
 * Enum Option
 */
export interface EnumOption {
  label: string
  value: number
}
