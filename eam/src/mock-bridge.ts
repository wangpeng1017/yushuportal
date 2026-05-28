/**
 * Mock 桥接：从 src/mock-data/ 导出 mock 匹配函数
 */
// @ts-nocheck
import authMock from './mock-data/auth'
import equipmentMock from './mock-data/eam-equipment'
import workorderMock from './mock-data/eam-workorder'
import extraMock from './mock-data/eam-extra'
import routeMock from './mock-data/eam-inspection-route'
import knowledgeMock from './mock-data/eam-knowledge'
import projectMock from './mock-data/eam-project'
import iotOeeMock from './mock-data/eam-iot-oee'
import toolingMock from './mock-data/eam-tooling'
import plantConfigMock from './mock-data/sys-plant-config'
import feishuApprovalMock from './mock-data/feishu-approval'
import erpSyncMock from './mock-data/sys-erp-sync'
import baseDataMock from './mock-data/eam-base-data'
import purchaseRequestMock from './mock-data/eam-purchase-request'
import equipmentClassTreeMock from './mock-data/eam-equipment-class-tree'
import reportMock from './mock-data/eam-report'
import npiMock from './mock-data/eam-npi'
import mobileMock from './mock-data/eam-mobile'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock, ...routeMock, ...knowledgeMock, ...projectMock, ...iotOeeMock, ...toolingMock, ...plantConfigMock, ...feishuApprovalMock, ...erpSyncMock, ...baseDataMock, ...purchaseRequestMock, ...equipmentClassTreeMock, ...reportMock, ...npiMock, ...mobileMock]

function parseQS(url: string): Record<string, string> {
  const q: Record<string, string> = {}
  const i = url.indexOf('?')
  if (i === -1) return q
  url.substring(i + 1).split('&').forEach(p => {
    const [k, v] = p.split('=')
    if (k) q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : ''
  })
  return q
}

export function tryMatchMock(
  url: string, method: string, data?: any, headers?: Record<string, string>
): any | null {
  const m = method.toLowerCase()
  for (const mock of allMocks) {
    const mm = (mock.method || 'get').toLowerCase()
    if (m !== mm) continue
    const mockPath = mock.url.replace('/admin-api', '')
    if (url.includes(mockPath)) {
      const query = parseQS(url)
      const body = typeof data === 'string'
        ? (() => { try { return JSON.parse(data) } catch { return {} } })()
        : (data || {})
      const hdrs: Record<string, string> = {}
      if (headers) Object.keys(headers).forEach(k => { hdrs[k.toLowerCase()] = String(headers[k]) })
      return typeof mock.response === 'function'
        ? mock.response({ url, body, query, headers: hdrs })
        : mock.response
    }
  }
  // ── 兜底：未匹配的 /admin-api/* 请求统一返回空成功响应，避免 404 走到真后端 ──
  // 档 2 要求：F12 Network 不应有任何外部请求
  if (url.includes('/admin-api/') || url.startsWith('admin-api')) {
    if (import.meta.env.VITE_DEV !== 'true') {
      console.warn('[mock-fallback]', method.toUpperCase(), url)
    }
    return { code: 200, data: null, msg: 'mock-fallback' }
  }
  return null
}
