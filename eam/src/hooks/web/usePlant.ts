/**
 * usePlant Hook：获取当前用户的端别 + 字段段开关
 * 用于"通用功能 + 个性化字段段"的渲染控制
 *
 * 端别 (plantCode):
 * - C: C 端车间（PACK/PCBA/装配）
 * - B: B 端车间
 * - CNC: 数控机加车间
 * - ALL: admin（跨端）
 */
import { computed, onMounted } from 'vue'
import { useCache, CACHE_KEY } from '@/hooks/web/useCache'
import { usePlantConfigStore } from '@/store/modules/plantConfig'

export function usePlant() {
  const { wsCache } = useCache()
  const plantConfigStore = usePlantConfigStore()

  // 自动加载配置（仅一次）
  onMounted(() => {
    plantConfigStore.loadConfigs()
  })

  const plantCode = computed<string>(() => {
    const userInfo = wsCache.get(CACHE_KEY.USER) || {}
    return userInfo?.user?.plantCode || 'ALL'
  })

  const workshopName = computed<string>(() => {
    const userInfo = wsCache.get(CACHE_KEY.USER) || {}
    return userInfo?.user?.workshopName || '全部车间'
  })

  function inPlant(scope: string | string[]): boolean {
    const current = plantCode.value
    if (current === 'ALL') return true
    if (Array.isArray(scope)) return scope.includes(current)
    return scope === current
  }

  const isC = computed(() => inPlant(['C', 'ALL']))
  const isB = computed(() => inPlant(['B', 'ALL']))
  const isCNC = computed(() => inPlant(['CNC', 'ALL']))
  const isAdmin = computed(() => plantCode.value === 'ALL')

  /** 字段段开关 - 由端别配置驱动 */
  const showIotFields = computed(() =>
    plantConfigStore.isFieldEnabled('showIotFields', plantCode.value)
  )
  const showProjectFields = computed(() =>
    plantConfigStore.isFieldEnabled('showProjectField', plantCode.value)
  )
  const showMultiWarehouse = computed(() =>
    plantConfigStore.isFieldEnabled('multiWarehouse', plantCode.value)
  )
  const showToolboxIntegration = computed(() =>
    plantConfigStore.isFieldEnabled('toolboxIntegration', plantCode.value)
  )
  const enableCriticalLevel = computed(() =>
    plantConfigStore.isFieldEnabled('enableCriticalLevel', plantCode.value)
  )
  const enableCapability = computed(() =>
    plantConfigStore.isFieldEnabled('enableCapability', plantCode.value)
  )
  const showSnBatchBinding = computed(() =>
    plantConfigStore.isFieldEnabled('snBatchBinding', plantCode.value)
  )
  const showIdleTimeCollect = computed(() =>
    plantConfigStore.isFieldEnabled('idleTimeCollect', plantCode.value)
  )
  const showCraftParamsCollect = computed(() =>
    plantConfigStore.isFieldEnabled('craftParamsCollect', plantCode.value)
  )

  return {
    plantCode,
    workshopName,
    inPlant,
    isC,
    isB,
    isCNC,
    isAdmin,
    showIotFields,
    showProjectFields,
    showMultiWarehouse,
    showToolboxIntegration,
    enableCriticalLevel,
    enableCapability,
    showSnBatchBinding,
    showIdleTimeCollect,
    showCraftParamsCollect
  }
}
