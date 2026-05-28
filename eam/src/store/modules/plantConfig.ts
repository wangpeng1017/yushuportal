/**
 * 端别配置 Store
 * 集中管理"通用功能 + 个性化字段段"的开关状态
 * 端别配置页面修改后写入 store，所有页面通过 usePlant() 读取
 */
import { defineStore } from 'pinia'
import request from '@/config/axios'

export interface PlantConfigItem {
  id: string
  module: string
  configKey: string
  configName: string
  defaultValue: string
  plantC: string
  plantB: string
  plantCNC: string
  remark: string
}

export const usePlantConfigStore = defineStore('plant-config', {
  state: () => ({
    configList: [] as PlantConfigItem[],
    loaded: false
  }),
  getters: {
    /** 根据当前用户的 plantCode + configKey 获取该字段段是否启用 */
    isFieldEnabled: (state) => {
      return (configKey: string, plantCode: string): boolean => {
        const item = state.configList.find(c => c.configKey === configKey)
        if (!item) return true // 未配置默认显示
        const value = plantCode === 'C' ? item.plantC :
                      plantCode === 'B' ? item.plantB :
                      plantCode === 'CNC' ? item.plantCNC : '是' // ALL/admin 默认启用
        return ['是', '显示', '启用', '强制启用'].includes(value)
      }
    },
    getConfig: (state) => {
      return (configKey: string): PlantConfigItem | undefined => {
        return state.configList.find(c => c.configKey === configKey)
      }
    }
  },
  actions: {
    async loadConfigs(force = false) {
      if (this.loaded && !force) return
      try {
        const res: any = await request.get({ url: '/admin-api/system/plant-config/list' })
        this.configList = res || []
        this.loaded = true
      } catch (e) {
        console.error('Load plant config failed:', e)
      }
    },
    updateConfig(item: PlantConfigItem) {
      const idx = this.configList.findIndex(c => c.id === item.id)
      if (idx >= 0) {
        this.configList[idx] = { ...item }
      } else {
        this.configList.push({ ...item })
      }
    }
  }
})
