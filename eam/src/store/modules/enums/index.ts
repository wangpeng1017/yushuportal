/**
 * 枚举 Store 统一导出
 *
 * 按业务模块拆分枚举管理，便于维护和扩展
 *
 * 使用示例：
 * ```typescript
 * import { useEamEnumStore } from '@/store/modules/enums'
 *
 * const eamEnumStore = useEamEnumStore()
 * await eamEnumStore.loadEquipmentStatus()
 * const statusList = eamEnumStore.getEquipmentStatusList
 * ```
 */

// 导出所有枚举 store
export { useEamEnumStore, useEamEnumStoreWithOut } from './eamEnums'

// 导出类型
export type { EamEnumState } from './eamEnums'

/**
 * 清除所有枚举模块的缓存
 * 用于语言切换或需要强制刷新枚举数据的场景
 *
 * @example
 * ```typescript
 * import { clearAllEnumCaches } from '@/store/modules/enums'
 *
 * // 切换语言时清除所有枚举缓存
 * clearAllEnumCaches()
 * ```
 */
export const clearAllEnumCaches = () => {
  // 动态导入所有枚举 store 并清除缓存
  Promise.all([
    import('./eamEnums').then(({ useEamEnumStore }) => {
      const store = useEamEnumStore()
      store.resetEnums()
    })
  ]).catch((error) => {
    console.error('清除枚举缓存失败:', error)
  })
}
