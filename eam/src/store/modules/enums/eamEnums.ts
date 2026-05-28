import { defineStore } from 'pinia'
import { store } from '@/store'
import { useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

import * as SupplierApi from '@/api/eam/supplier'
import * as EquipmentApi from '@/api/eam/optEquipment'
import * as SpotInspectionStandardApi from '@/api/eam/spotInspectionStandard'
import * as SpotInspectionWorkApi from '@/api/eam/spotInspectionWork'
import * as MaintenancePlanApi from '@/api/eam/maintenancePlan'
import * as MaintenanceWorkOrderApi from '@/api/eam/maintenanceWorkOrder'
import * as FailureWorkOrderApi from '@/api/eam/failureWorkOrder'
import * as RepairWorkOrderApi from '@/api/eam/repairWorkOrder'

/**
 * 枚举实体接口
 */
export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

/**
 * EAM 模块枚举状态接口
 */
export interface EamEnumState {
  // 供应商类别枚举
  supplierCategory: EnumEntity[]

  // 供应设备类别枚举
  supplierGoods: EnumEntity[]

  // 供应商状态枚举
  supplierStatus: EnumEntity[]

  // 设备型号枚举
  equipmentMode: EnumEntity[]

  // 资产状态枚举
  equipmentStatus: EnumEntity[]

  // 运行状态枚举
  operationStatus: EnumEntity[]

  // 启停用状态枚举
  equipmentRevstop: EnumEntity[]

  // 点巡检标准-参数单位枚举
  paramsUnit: EnumEntity[]

  // 点巡检标准-是否枚举
  yesNo: EnumEntity[]

  // 工单状态枚举
  workOrderStatus: EnumEntity[]

  // 保养级别枚举
  maintenanceLevel: EnumEntity[]

  // 保养工单状态枚举
  maintenanceWorkStatus: EnumEntity[]

  // 保养项状态枚举
  maintenanceWorkItemStatus: EnumEntity[]

  // 报修工单审核状态枚举
  failureWorkOrderStatus: EnumEntity[]

  // 报修工单执行状态枚举
  failureWorkOrderExecuteStatus: EnumEntity[]

  // 故障等级枚举
  failureWorkOrderBreakdownLevel: EnumEntity[]

  // 故障类别枚举
  failureWorkOrderBreakdownType: EnumEntity[]

  // 紧急程度枚举
  repairDegree: EnumEntity[]

  // 维修工单状态枚举
  repairWorkOrderStatus: EnumEntity[]

  // 维修工单来源类型枚举
  repairWorkOrderSource: EnumEntity[]

  // 维修工单维修级别枚举
  repairWorkOrderRepairLevel: EnumEntity[]

  // 维修工单维修类型枚举
  repairWorkOrderRepairType: EnumEntity[]

  // 记录已加载的枚举
  loadedEnums: Set<string>
}

/**
 * EAM 模块枚举 Store
 * 管理 EAM 相关的所有枚举数据
 */
export const useEamEnumStore = defineStore('eamEnum', {
  state: (): EamEnumState => ({
    supplierCategory: [],
    supplierGoods: [],
    supplierStatus: [],
    equipmentMode: [],
    equipmentStatus: [],
    operationStatus: [],
    equipmentRevstop: [],
    paramsUnit: [],
    yesNo: [],
    workOrderStatus: [],
    maintenanceLevel: [],
    maintenanceWorkStatus: [],
    maintenanceWorkItemStatus: [],
    failureWorkOrderStatus: [],
    failureWorkOrderExecuteStatus: [],
    failureWorkOrderBreakdownLevel: [],
    failureWorkOrderBreakdownType: [],
    repairDegree: [],
    repairWorkOrderStatus: [],
    repairWorkOrderSource: [],
    repairWorkOrderRepairLevel: [],
    repairWorkOrderRepairType: [],
    loadedEnums: new Set<string>()
  }),

  getters: {
    // ==================== 供应商相关 getters ====================

    /**
     * 获取供应商类别列表
     */
    getSupplierCategoryList(): EnumEntity[] {
      return this.supplierCategory
    },

    /**
     * 根据值获取供应商类别文本
     */
    getSupplierCategoryText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierCategory.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取供应设备类别列表
     */
    getSupplierGoodsList(): EnumEntity[] {
      return this.supplierGoods
    },

    /**
     * 根据值获取供应设备类别文本
     */
    getSupplierGoodsText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierGoods.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取供应商状态列表
     */
    getSupplierStatusList(): EnumEntity[] {
      return this.supplierStatus
    },

    /**
     * 根据值获取供应商状态文本
     */
    getSupplierStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.supplierStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取供应商状态标签类型
     */
    getSupplierStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'success',
          '0': 'danger'
        }
        return typeMap[value] || 'info'
      }
    },

    // ==================== 设备档案相关 getters ====================

    /**
     * 获取设备型号列表
     */
    getEquipmentModeList(): EnumEntity[] {
      return this.equipmentMode
    },

    /**
     * 根据值获取设备型号文本
     */
    getEquipmentModeText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentMode.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取资产状态列表
     */
    getEquipmentStatusList(): EnumEntity[] {
      return this.equipmentStatus
    },

    /**
     * 根据值获取资产状态文本
     */
    getEquipmentStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取运行状态列表
     */
    getOperationStatusList(): EnumEntity[] {
      return this.operationStatus
    },

    /**
     * 根据值获取运行状态文本
     */
    getOperationStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.operationStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取启停用状态列表
     */
    getEquipmentRevstopList(): EnumEntity[] {
      return this.equipmentRevstop
    },

    /**
     * 根据值获取启停用状态文本
     */
    getEquipmentRevstopText(): (value: string) => string {
      return (value: string) => {
        const item = this.equipmentRevstop.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 点巡检标准相关 getters ====================

    /**
     * 获取参数单位列表
     */
    getParamsUnitList(): EnumEntity[] {
      return this.paramsUnit
    },

    /**
     * 根据值获取参数单位文本
     */
    getParamsUnitText(): (value: string) => string {
      return (value: string) => {
        const item = this.paramsUnit.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取是否枚举列表
     */
    getYesNoList(): EnumEntity[] {
      return this.yesNo
    },

    /**
     * 根据值获取是否枚举文本
     */
    getYesNoText(): (value: string) => string {
      return (value: string) => {
        const item = this.yesNo.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 工单状态相关 getters ====================

    /**
     * 获取工单状态列表
     */
    getWorkOrderStatusList(): EnumEntity[] {
      return this.workOrderStatus
    },

    /**
     * 根据值获取工单状态文本
     */
    getWorkOrderStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.workOrderStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取工单状态标签类型（用于 el-tag type）
     */
    getWorkOrderStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'warning',
          '2': '',
          '3': 'success'
        }
        return typeMap[value] || 'info'
      }
    },

    // ==================== 保养级别相关 getters ====================

    /**
     * 获取保养级别列表
     */
    getMaintenanceLevelList(): EnumEntity[] {
      return this.maintenanceLevel
    },

    /**
     * 根据值获取保养级别文本
     */
    getMaintenanceLevelText(): (value: string) => string {
      return (value: string) => {
        const item = this.maintenanceLevel.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 保养工单状态相关 getters ====================

    /**
     * 获取保养工单状态列表
     */
    getMaintenanceWorkStatusList(): EnumEntity[] {
      return this.maintenanceWorkStatus
    },

    /**
     * 根据值获取保养工单状态文本
     */
    getMaintenanceWorkStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.maintenanceWorkStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取保养工单状态标签类型（用于 el-tag type）
     * 1=未开始(warning) 2=待保养(default) 3=保养中(primary) 4=已完成(success)
     */
    getMaintenanceWorkStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'warning',
          '2': '',
          '3': '',
          '4': 'success'
        }
        return typeMap[value] || 'info'
      }
    },

    // ==================== 保养项状态相关 getters ====================

    /**
     * 获取保养项状态列表
     */
    getMaintenanceWorkItemStatusList(): EnumEntity[] {
      return this.maintenanceWorkItemStatus
    },

    /**
     * 根据值获取保养项状态文本
     */
    getMaintenanceWorkItemStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.maintenanceWorkItemStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取保养项状态标签类型
     * 0=未保养(warning) 1=已保养(success)
     */
    getMaintenanceWorkItemStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '0': 'warning',
          '1': 'success'
        }
        return typeMap[value] || 'info'
      }
    },

    // ==================== 报修工单审核状态相关 getters ====================

    /**
     * 获取报修工单审核状态列表
     */
    getFailureWorkOrderStatusList(): EnumEntity[] {
      return this.failureWorkOrderStatus
    },

    /**
     * 根据值获取报修工单审核状态文本
     */
    getFailureWorkOrderStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.failureWorkOrderStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取报修工单审核状态标签类型
     * 0=草稿(info) 1=审核中(warning) 2=审核通过(success) 3=驳回申请(danger)
     */
    getFailureWorkOrderStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '0': 'info',
          '1': 'warning',
          '2': 'success',
          '3': 'danger'
        }
        return typeMap[value] || 'info'
      }
    },

    // ==================== 报修工单执行状态相关 getters ====================

    /**
     * 获取报修工单执行状态列表
     */
    getFailureWorkOrderExecuteStatusList(): EnumEntity[] {
      return this.failureWorkOrderExecuteStatus
    },

    /**
     * 根据值获取报修工单执行状态文本
     */
    getFailureWorkOrderExecuteStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.failureWorkOrderExecuteStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 故障等级相关 getters ====================

    /**
     * 获取故障等级列表
     */
    getFailureWorkOrderBreakdownLevelList(): EnumEntity[] {
      return this.failureWorkOrderBreakdownLevel
    },

    /**
     * 根据值获取故障等级文本
     */
    getFailureWorkOrderBreakdownLevelText(): (value: string) => string {
      return (value: string) => {
        const item = this.failureWorkOrderBreakdownLevel.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 故障类别相关 getters ====================

    /**
     * 获取故障类别列表
     */
    getFailureWorkOrderBreakdownTypeList(): EnumEntity[] {
      return this.failureWorkOrderBreakdownType
    },

    /**
     * 根据值获取故障类别文本
     */
    getFailureWorkOrderBreakdownTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.failureWorkOrderBreakdownType.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 紧急程度相关 getters ====================

    /**
     * 获取紧急程度列表
     */
    getRepairDegreeList(): EnumEntity[] {
      return this.repairDegree
    },

    /**
     * 根据值获取紧急程度文本
     */
    getRepairDegreeText(): (value: string) => string {
      return (value: string) => {
        const item = this.repairDegree.find((e) => e.value === value)
        return item?.text || value
      }
    },

    // ==================== 维修工单相关 getters ====================

    /**
     * 获取维修工单状态列表
     */
    getRepairWorkOrderStatusList(): EnumEntity[] {
      return this.repairWorkOrderStatus
    },

    /**
     * 根据值获取维修工单状态文本
     */
    getRepairWorkOrderStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.repairWorkOrderStatus.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 根据值获取维修工单状态标签类型
     * 1=草稿(info) 2=待分配(warning) 3=已分配(default) 4=维修中(default) 5=待确认(warning) 6=已完成(success)
     */
    getRepairWorkOrderStatusType(): (value: string) => string {
      return (value: string) => {
        const typeMap: Record<string, string> = {
          '1': 'info',
          '2': 'warning',
          '3': '',
          '4': '',
          '5': 'warning',
          '6': 'success'
        }
        return typeMap[value] || 'info'
      }
    },

    /**
     * 获取维修工单来源类型列表
     */
    getRepairWorkOrderSourceList(): EnumEntity[] {
      return this.repairWorkOrderSource
    },

    /**
     * 根据值获取维修工单来源类型文本
     */
    getRepairWorkOrderSourceText(): (value: string) => string {
      return (value: string) => {
        const item = this.repairWorkOrderSource.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取维修工单维修级别列表
     */
    getRepairWorkOrderRepairLevelList(): EnumEntity[] {
      return this.repairWorkOrderRepairLevel
    },

    /**
     * 根据值获取维修工单维修级别文本
     */
    getRepairWorkOrderRepairLevelText(): (value: string) => string {
      return (value: string) => {
        const item = this.repairWorkOrderRepairLevel.find((e) => e.value === value)
        return item?.text || value
      }
    },

    /**
     * 获取维修工单维修类型列表
     */
    getRepairWorkOrderRepairTypeList(): EnumEntity[] {
      return this.repairWorkOrderRepairType
    },

    /**
     * 根据值获取维修工单维修类型文本
     */
    getRepairWorkOrderRepairTypeText(): (value: string) => string {
      return (value: string) => {
        const item = this.repairWorkOrderRepairType.find((e) => e.value === value)
        return item?.text || value
      }
    }
  },

  actions: {
    // ==================== 供应商相关 actions ====================

    /**
     * 加载供应商类别枚举
     */
    async loadSupplierCategory() {
      if (this.loadedEnums.has('supplierCategory')) {
        return
      }

      const cacheKey = 'enum_eam_supplierCategory'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierCategory = cached
        this.loadedEnums.add('supplierCategory')
        return
      }

      try {
        const data = await SupplierApi.listOfCategory()
        this.supplierCategory = data || []
        this.loadedEnums.add('supplierCategory')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应商类别枚举失败:', error)
      }
    },

    /**
     * 加载供应设备类别枚举
     */
    async loadSupplierGoods() {
      if (this.loadedEnums.has('supplierGoods')) {
        return
      }

      const cacheKey = 'enum_eam_supplierGoods'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierGoods = cached
        this.loadedEnums.add('supplierGoods')
        return
      }

      try {
        const data = await SupplierApi.listOfGoods()
        this.supplierGoods = data || []
        this.loadedEnums.add('supplierGoods')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应设备类别枚举失败:', error)
      }
    },

    /**
     * 加载供应商状态枚举
     */
    async loadSupplierStatus() {
      if (this.loadedEnums.has('supplierStatus')) {
        return
      }

      const cacheKey = 'enum_eam_supplierStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.supplierStatus = cached
        this.loadedEnums.add('supplierStatus')
        return
      }

      try {
        const data = await SupplierApi.listOfStatus()
        this.supplierStatus = data || []
        this.loadedEnums.add('supplierStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载供应商状态枚举失败:', error)
      }
    },

    /**
     * 批量加载供应商相关枚举
     */
    async loadSupplierEnums() {
      await Promise.all([
        this.loadSupplierCategory(),
        this.loadSupplierGoods(),
        this.loadSupplierStatus()
      ])
    },

    // ==================== 设备档案相关 actions ====================

    /**
     * 加载设备型号枚举
     */
    async loadEquipmentMode() {
      if (this.loadedEnums.has('equipmentMode')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentMode'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentMode = cached
        this.loadedEnums.add('equipmentMode')
        return
      }

      try {
        const data = await EquipmentApi.listOfMode()
        this.equipmentMode = data || []
        this.loadedEnums.add('equipmentMode')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载设备型号枚举失败:', error)
      }
    },

    /**
     * 加载资产状态枚举
     */
    async loadEquipmentStatus() {
      if (this.loadedEnums.has('equipmentStatus')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentStatus = cached
        this.loadedEnums.add('equipmentStatus')
        return
      }

      try {
        const data = await EquipmentApi.listOfStatus()
        this.equipmentStatus = data || []
        this.loadedEnums.add('equipmentStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载资产状态枚举失败:', error)
      }
    },

    /**
     * 加载运行状态枚举
     */
    async loadOperationStatus() {
      if (this.loadedEnums.has('operationStatus')) {
        return
      }

      const cacheKey = 'enum_eam_operationStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.operationStatus = cached
        this.loadedEnums.add('operationStatus')
        return
      }

      try {
        const data = await EquipmentApi.listOfOperationStatus()
        this.operationStatus = data || []
        this.loadedEnums.add('operationStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载运行状态枚举失败:', error)
      }
    },

    /**
     * 加载启停用状态枚举
     */
    async loadEquipmentRevstop() {
      if (this.loadedEnums.has('equipmentRevstop')) {
        return
      }

      const cacheKey = 'enum_eam_equipmentRevstop'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.equipmentRevstop = cached
        this.loadedEnums.add('equipmentRevstop')
        return
      }

      try {
        const data = await EquipmentApi.listOfRevstop()
        this.equipmentRevstop = data || []
        this.loadedEnums.add('equipmentRevstop')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载启停用状态枚举失败:', error)
      }
    },

    /**
     * 批量加载设备档案相关枚举
     */
    async loadEquipmentEnums() {
      await Promise.all([
        this.loadEquipmentMode(),
        this.loadEquipmentStatus(),
        this.loadOperationStatus(),
        this.loadEquipmentRevstop()
      ])
    },

    // ==================== 点巡检标准相关 actions ====================

    /**
     * 加载参数单位枚举
     */
    async loadParamsUnit() {
      if (this.loadedEnums.has('paramsUnit')) {
        return
      }

      const cacheKey = 'enum_eam_paramsUnit'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.paramsUnit = cached
        this.loadedEnums.add('paramsUnit')
        return
      }

      try {
        const data = await SpotInspectionStandardApi.listOfParamsUnit()
        this.paramsUnit = data || []
        this.loadedEnums.add('paramsUnit')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载参数单位枚举失败:', error)
      }
    },

    /**
     * 加载是否枚举
     */
    async loadYesNo() {
      if (this.loadedEnums.has('yesNo')) {
        return
      }

      const cacheKey = 'enum_eam_yesNo'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.yesNo = cached
        this.loadedEnums.add('yesNo')
        return
      }

      try {
        const data = await SpotInspectionStandardApi.listOfYesNo()
        this.yesNo = data || []
        this.loadedEnums.add('yesNo')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载是否枚举失败:', error)
      }
    },

    /**
     * 批量加载点巡检标准相关枚举
     */
    async loadSpotInspectionEnums() {
      await Promise.all([this.loadParamsUnit(), this.loadYesNo()])
    },

    /**
     * 批量加载参数巡检配置相关枚举
     */
    async loadParamConfEnums() {
      await Promise.all([
        this.loadSupplierStatus(),
        this.loadEquipmentMode(),
        this.loadParamsUnit(),
        this.loadYesNo()
      ])
    },

    /**
     * 批量加载点巡检计划相关枚举
     * 包含：供应商状态(启用状态)、设备型号、是否枚举、参数单位
     */
    async loadSpotInspectionPlanEnums() {
      await Promise.all([
        this.loadSupplierStatus(),
        this.loadEquipmentMode(),
        this.loadYesNo(),
        this.loadParamsUnit()
      ])
    },

    // ==================== 工单状态相关 actions ====================

    /**
     * 加载工单状态枚举
     */
    async loadWorkOrderStatus() {
      if (this.loadedEnums.has('workOrderStatus')) {
        return
      }

      const cacheKey = 'enum_eam_workOrderStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.workOrderStatus = cached
        this.loadedEnums.add('workOrderStatus')
        return
      }

      try {
        const data = await SpotInspectionWorkApi.listOfStatus()
        this.workOrderStatus = data || []
        this.loadedEnums.add('workOrderStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载工单状态枚举失败:', error)
      }
    },

    /**
     * 批量加载点巡检工单相关枚举
     * 包含：工单状态、是否枚举、设备型号
     */
    async loadSpotInspectionWorkEnums() {
      await Promise.all([this.loadWorkOrderStatus(), this.loadYesNo(), this.loadEquipmentMode()])
    },

    // ==================== 保养级别相关 actions ====================

    /**
     * 加载保养级别枚举
     */
    async loadMaintenanceLevel() {
      if (this.loadedEnums.has('maintenanceLevel')) {
        return
      }

      const cacheKey = 'enum_eam_maintenanceLevel'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.maintenanceLevel = cached
        this.loadedEnums.add('maintenanceLevel')
        return
      }

      try {
        const data = await MaintenancePlanApi.listOfMaintenanceLevel()
        this.maintenanceLevel = data || []
        this.loadedEnums.add('maintenanceLevel')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载保养级别枚举失败:', error)
      }
    },

    /**
     * 批量加载保养计划相关枚举
     * 包含：供应商状态(启用状态)、保养级别
     */
    async loadMaintenancePlanEnums() {
      await Promise.all([this.loadSupplierStatus(), this.loadMaintenanceLevel()])
    },

    // ==================== 保养工单状态相关 actions ====================

    /**
     * 加载保养工单状态枚举
     */
    async loadMaintenanceWorkStatus() {
      if (this.loadedEnums.has('maintenanceWorkStatus')) {
        return
      }

      const cacheKey = 'enum_eam_maintenanceWorkStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.maintenanceWorkStatus = cached
        this.loadedEnums.add('maintenanceWorkStatus')
        return
      }

      try {
        const data = await MaintenanceWorkOrderApi.listOfWorkOrderStatus()
        this.maintenanceWorkStatus = data || []
        this.loadedEnums.add('maintenanceWorkStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载保养工单状态枚举失败:', error)
      }
    },

    /**
     * 加载保养项状态枚举
     */
    async loadMaintenanceWorkItemStatus() {
      if (this.loadedEnums.has('maintenanceWorkItemStatus')) {
        return
      }

      const cacheKey = 'enum_eam_maintenanceWorkItemStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.maintenanceWorkItemStatus = cached
        this.loadedEnums.add('maintenanceWorkItemStatus')
        return
      }

      try {
        const data = await MaintenanceWorkOrderApi.listOfItemStatus()
        this.maintenanceWorkItemStatus = data || []
        this.loadedEnums.add('maintenanceWorkItemStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载保养项状态枚举失败:', error)
      }
    },

    /**
     * 批量加载保养工单相关枚举
     * 包含：保养工单状态、保养项状态、保养级别
     */
    async loadMaintenanceWorkOrderEnums() {
      await Promise.all([
        this.loadMaintenanceWorkStatus(),
        this.loadMaintenanceWorkItemStatus(),
        this.loadMaintenanceLevel()
      ])
    },

    // ==================== 报修工单相关 actions ====================

    /**
     * 加载报修工单审核状态枚举
     */
    async loadFailureWorkOrderStatus() {
      if (this.loadedEnums.has('failureWorkOrderStatus')) {
        return
      }

      const cacheKey = 'enum_eam_failureWorkOrderStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.failureWorkOrderStatus = cached
        this.loadedEnums.add('failureWorkOrderStatus')
        return
      }

      try {
        const data = await FailureWorkOrderApi.listOfStatus()
        this.failureWorkOrderStatus = data || []
        this.loadedEnums.add('failureWorkOrderStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载报修工单审核状态枚举失败:', error)
      }
    },

    /**
     * 加载报修工单执行状态枚举
     */
    async loadFailureWorkOrderExecuteStatus() {
      if (this.loadedEnums.has('failureWorkOrderExecuteStatus')) {
        return
      }

      const cacheKey = 'enum_eam_failureWorkOrderExecuteStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.failureWorkOrderExecuteStatus = cached
        this.loadedEnums.add('failureWorkOrderExecuteStatus')
        return
      }

      try {
        const data = await FailureWorkOrderApi.listOfExecuteStatus()
        this.failureWorkOrderExecuteStatus = data || []
        this.loadedEnums.add('failureWorkOrderExecuteStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载报修工单执行状态枚举失败:', error)
      }
    },

    /**
     * 加载故障等级枚举
     */
    async loadFailureWorkOrderBreakdownLevel() {
      if (this.loadedEnums.has('failureWorkOrderBreakdownLevel')) {
        return
      }

      const cacheKey = 'enum_eam_failureWorkOrderBreakdownLevel'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.failureWorkOrderBreakdownLevel = cached
        this.loadedEnums.add('failureWorkOrderBreakdownLevel')
        return
      }

      try {
        const data = await FailureWorkOrderApi.listOfBreakdownLevel()
        this.failureWorkOrderBreakdownLevel = data || []
        this.loadedEnums.add('failureWorkOrderBreakdownLevel')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载故障等级枚举失败:', error)
      }
    },

    /**
     * 加载故障类别枚举
     */
    async loadFailureWorkOrderBreakdownType() {
      if (this.loadedEnums.has('failureWorkOrderBreakdownType')) {
        return
      }

      const cacheKey = 'enum_eam_failureWorkOrderBreakdownType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.failureWorkOrderBreakdownType = cached
        this.loadedEnums.add('failureWorkOrderBreakdownType')
        return
      }

      try {
        const data = await FailureWorkOrderApi.listOfBreakdownType()
        this.failureWorkOrderBreakdownType = data || []
        this.loadedEnums.add('failureWorkOrderBreakdownType')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载故障类别枚举失败:', error)
      }
    },

    /**
     * 加载紧急程度枚举
     */
    async loadRepairDegree() {
      if (this.loadedEnums.has('repairDegree')) {
        return
      }

      const cacheKey = 'enum_eam_repairDegree'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.repairDegree = cached
        this.loadedEnums.add('repairDegree')
        return
      }

      try {
        const data = await FailureWorkOrderApi.listOfRepairDegree()
        this.repairDegree = data || []
        this.loadedEnums.add('repairDegree')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载紧急程度枚举失败:', error)
      }
    },

    /**
     * 批量加载报修工单相关枚举
     */
    async loadFailureWorkOrderEnums() {
      await Promise.all([
        this.loadFailureWorkOrderStatus(),
        this.loadFailureWorkOrderExecuteStatus(),
        this.loadFailureWorkOrderBreakdownLevel(),
        this.loadFailureWorkOrderBreakdownType(),
        this.loadRepairDegree()
      ])
    },

    // ==================== 维修工单相关 actions ====================

    /**
     * 加载维修工单状态枚举
     */
    async loadRepairWorkOrderStatus() {
      if (this.loadedEnums.has('repairWorkOrderStatus')) {
        return
      }

      const cacheKey = 'enum_eam_repairWorkOrderStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.repairWorkOrderStatus = cached
        this.loadedEnums.add('repairWorkOrderStatus')
        return
      }

      try {
        const data = await RepairWorkOrderApi.listOfStatus()
        this.repairWorkOrderStatus = data || []
        this.loadedEnums.add('repairWorkOrderStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载维修工单状态枚举失败:', error)
      }
    },

    /**
     * 加载维修工单来源类型枚举
     */
    async loadRepairWorkOrderSource() {
      if (this.loadedEnums.has('repairWorkOrderSource')) {
        return
      }

      const cacheKey = 'enum_eam_repairWorkOrderSource'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.repairWorkOrderSource = cached
        this.loadedEnums.add('repairWorkOrderSource')
        return
      }

      try {
        const data = await RepairWorkOrderApi.listOfSource()
        this.repairWorkOrderSource = data || []
        this.loadedEnums.add('repairWorkOrderSource')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载维修工单来源类型枚举失败:', error)
      }
    },

    /**
     * 加载维修工单维修级别枚举
     */
    async loadRepairWorkOrderRepairLevel() {
      if (this.loadedEnums.has('repairWorkOrderRepairLevel')) {
        return
      }

      const cacheKey = 'enum_eam_repairWorkOrderRepairLevel'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.repairWorkOrderRepairLevel = cached
        this.loadedEnums.add('repairWorkOrderRepairLevel')
        return
      }

      try {
        const data = await RepairWorkOrderApi.listOfRepairLevel()
        this.repairWorkOrderRepairLevel = data || []
        this.loadedEnums.add('repairWorkOrderRepairLevel')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载维修工单维修级别枚举失败:', error)
      }
    },

    /**
     * 加载维修工单维修类型枚举
     */
    async loadRepairWorkOrderRepairType() {
      if (this.loadedEnums.has('repairWorkOrderRepairType')) {
        return
      }

      const cacheKey = 'enum_eam_repairWorkOrderRepairType'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.repairWorkOrderRepairType = cached
        this.loadedEnums.add('repairWorkOrderRepairType')
        return
      }

      try {
        const data = await RepairWorkOrderApi.listOfRepairType()
        this.repairWorkOrderRepairType = data || []
        this.loadedEnums.add('repairWorkOrderRepairType')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载维修工单维修类型枚举失败:', error)
      }
    },

    /**
     * 批量加载维修工单相关枚举
     */
    async loadRepairWorkOrderEnums() {
      await Promise.all([
        this.loadRepairWorkOrderStatus(),
        this.loadRepairWorkOrderSource(),
        this.loadRepairWorkOrderRepairLevel(),
        this.loadRepairWorkOrderRepairType(),
        this.loadRepairDegree(),
        this.loadYesNo()
      ])
    },

    /**
     * 重置 EAM 模块枚举缓存
     */
    resetEnums() {
      wsCache.delete('enum_eam_supplierCategory')
      wsCache.delete('enum_eam_supplierGoods')
      wsCache.delete('enum_eam_supplierStatus')
      wsCache.delete('enum_eam_equipmentMode')
      wsCache.delete('enum_eam_equipmentStatus')
      wsCache.delete('enum_eam_operationStatus')
      wsCache.delete('enum_eam_equipmentRevstop')
      wsCache.delete('enum_eam_paramsUnit')
      wsCache.delete('enum_eam_yesNo')
      wsCache.delete('enum_eam_workOrderStatus')
      wsCache.delete('enum_eam_maintenanceLevel')
      wsCache.delete('enum_eam_maintenanceWorkStatus')
      wsCache.delete('enum_eam_maintenanceWorkItemStatus')
      wsCache.delete('enum_eam_failureWorkOrderStatus')
      wsCache.delete('enum_eam_failureWorkOrderExecuteStatus')
      wsCache.delete('enum_eam_failureWorkOrderBreakdownLevel')
      wsCache.delete('enum_eam_failureWorkOrderBreakdownType')
      wsCache.delete('enum_eam_repairDegree')
      wsCache.delete('enum_eam_repairWorkOrderStatus')
      wsCache.delete('enum_eam_repairWorkOrderSource')
      wsCache.delete('enum_eam_repairWorkOrderRepairLevel')
      wsCache.delete('enum_eam_repairWorkOrderRepairType')
      this.supplierCategory = []
      this.supplierGoods = []
      this.supplierStatus = []
      this.equipmentMode = []
      this.equipmentStatus = []
      this.operationStatus = []
      this.equipmentRevstop = []
      this.paramsUnit = []
      this.yesNo = []
      this.workOrderStatus = []
      this.maintenanceLevel = []
      this.maintenanceWorkStatus = []
      this.maintenanceWorkItemStatus = []
      this.failureWorkOrderStatus = []
      this.failureWorkOrderExecuteStatus = []
      this.failureWorkOrderBreakdownLevel = []
      this.failureWorkOrderBreakdownType = []
      this.repairDegree = []
      this.repairWorkOrderStatus = []
      this.repairWorkOrderSource = []
      this.repairWorkOrderRepairLevel = []
      this.repairWorkOrderRepairType = []
      this.loadedEnums.clear()
    }
  }
})

export const useEamEnumStoreWithOut = () => {
  return useEamEnumStore(store)
}
