/**
 * Mock: 系统管理 - ERP 同步配置
 *
 * 提供：
 *   - GET    /admin-api/system/erp-sync/config   读取配置（cron / 上次/下次 / 计数）
 *   - PUT    /admin-api/system/erp-sync/config   更新配置（cron 表达式）
 *   - POST   /admin-api/system/erp-sync/run      立即同步（mock 拉 5-10 条新设备）
 *   - GET    /admin-api/system/erp-sync/history  同步历史
 */
import type { MockMethod } from 'vite-plugin-mock'
import { pushSyncedEquipment } from './eam-equipment'

// ── 内部状态（vite-plugin-mock 进程内可写）──
const state = {
  cronExpr: '0 0 2 * * ?',
  cronDesc: '每天凌晨 02:00',
  lastSyncTime: '2026-04-27 02:00:08',
  nextSyncTime: '2026-04-28 02:00:00',
  lastSuccessCount: 7,
  lastFailureCount: 1,
  enabled: true,
  syncTarget: '设备主数据 + 物料 BOM'
}

// 同步历史（最近的在前）
const history: any[] = [
  { id: 'H010', startTime: '2026-04-27 02:00:00', endTime: '2026-04-27 02:00:08', durationMs: 8430, success: 7, failure: 1, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H009', startTime: '2026-04-26 02:00:00', endTime: '2026-04-26 02:00:06', durationMs: 6210, success: 9, failure: 0, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H008', startTime: '2026-04-25 16:32:11', endTime: '2026-04-25 16:32:14', durationMs: 3120, success: 4, failure: 0, trigger: 'MANUAL', operator: 'admin', remark: '手动同步：物料号 PACK-2024' },
  { id: 'H007', startTime: '2026-04-25 02:00:00', endTime: '2026-04-25 02:00:09', durationMs: 9012, success: 6, failure: 2, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H006', startTime: '2026-04-24 02:00:00', endTime: '2026-04-24 02:00:05', durationMs: 5230, success: 5, failure: 0, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H005', startTime: '2026-04-23 14:08:23', endTime: '2026-04-23 14:08:25', durationMs: 2003, success: 3, failure: 0, trigger: 'MANUAL', operator: 'cnc-admin', remark: '手动同步：时间范围 2026-04-23' },
  { id: 'H004', startTime: '2026-04-23 02:00:00', endTime: '2026-04-23 02:00:11', durationMs: 11200, success: 8, failure: 1, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H003', startTime: '2026-04-22 02:00:00', endTime: '2026-04-22 02:00:07', durationMs: 7080, success: 6, failure: 0, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H002', startTime: '2026-04-21 02:00:00', endTime: '2026-04-21 02:00:04', durationMs: 4220, success: 4, failure: 0, trigger: 'AUTO', operator: 'system', remark: 'cron 触发' },
  { id: 'H001', startTime: '2026-04-20 09:14:01', endTime: '2026-04-20 09:14:03', durationMs: 1980, success: 2, failure: 0, trigger: 'MANUAL', operator: 'admin', remark: '首次手动初始化' }
]

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

function nowStr() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19)
}

function nextDayAt2() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  d.setHours(2, 0, 0, 0)
  return d.toISOString().replace('T', ' ').slice(0, 19)
}

export default <MockMethod[]>[
  // 读取配置
  {
    url: '/admin-api/system/erp-sync/config',
    method: 'get',
    response: () => ({ code: 200, data: { ...state } })
  },
  // 更新配置
  {
    url: '/admin-api/system/erp-sync/config',
    method: 'put',
    response: ({ body }) => {
      if (typeof body?.cronExpr === 'string' && body.cronExpr.trim()) {
        state.cronExpr = body.cronExpr.trim()
      }
      if (typeof body?.cronDesc === 'string') state.cronDesc = body.cronDesc
      if (typeof body?.enabled === 'boolean') state.enabled = body.enabled
      if (typeof body?.syncTarget === 'string') state.syncTarget = body.syncTarget
      state.nextSyncTime = nextDayAt2()
      return { code: 200, data: { ...state } }
    }
  },
  // 立即同步：mock 拉 5-10 条新设备进 equipmentList
  {
    url: '/admin-api/system/erp-sync/run',
    method: 'post',
    response: ({ body }) => {
      const start = nowStr()
      const targetCount = Math.floor(Math.random() * 6) + 5  // 5-10
      let success = 0
      let failure = 0
      for (let i = 0; i < targetCount; i++) {
        try {
          pushSyncedEquipment(body?.materialNo)
          success += 1
        } catch (_) {
          failure += 1
        }
      }
      const end = nowStr()
      const durationMs = 500 + Math.floor(Math.random() * 4500)
      const newRecord = {
        id: 'H' + String(history.length + 11).padStart(3, '0'),
        startTime: start,
        endTime: end,
        durationMs,
        success,
        failure,
        trigger: 'MANUAL',
        operator: body?.operator || 'admin',
        remark: body?.materialNo ? `手动同步：物料号 ${body.materialNo}` : '手动同步'
      }
      history.unshift(newRecord)
      state.lastSyncTime = end
      state.nextSyncTime = nextDayAt2()
      state.lastSuccessCount = success
      state.lastFailureCount = failure
      return { code: 200, data: { ...newRecord, snapshot: { ...state } } }
    }
  },
  // 同步历史分页
  {
    url: '/admin-api/system/erp-sync/history',
    method: 'get',
    response: ({ query }) => {
      let data = [...history]
      if (query?.trigger) data = data.filter(h => h.trigger === query.trigger)
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  }
] as MockMethod[]
