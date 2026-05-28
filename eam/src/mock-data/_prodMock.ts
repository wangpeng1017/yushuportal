/**
 * 生产环境 Mock（Vercel 部署用）
 * 导出 tryMatchMock 函数，由 service.ts 的 axios adapter 直接调用
 */
import authMock from './auth'
import equipmentMock from './eam-equipment'
import workorderMock from './eam-workorder'
import extraMock from './eam-extra'
import routeMock from './eam-inspection-route'
import knowledgeMock from './eam-knowledge'
import projectMock from './eam-project'
import iotOeeMock from './eam-iot-oee'
import toolingMock from './eam-tooling'
import plantConfigMock from './sys-plant-config'
import erpSyncMock from './sys-erp-sync'
import feishuApprovalMock from './feishu-approval'
import baseDataMock from './eam-base-data'
import purchaseRequestMock from './eam-purchase-request'
import equipmentClassTreeMock from './eam-equipment-class-tree'

const allMocks = [...authMock, ...equipmentMock, ...workorderMock, ...extraMock, ...routeMock, ...knowledgeMock, ...projectMock, ...iotOeeMock, ...toolingMock, ...plantConfigMock, ...erpSyncMock, ...feishuApprovalMock, ...baseDataMock, ...purchaseRequestMock, ...equipmentClassTreeMock]

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

/**
 * 尝试匹配 mock 规则。匹配成功返回响应数据，失败返回 null
 */
export function tryMatchMock(
  url: string,
  method: string,
  data?: any,
  headers?: Record<string, string>
): any | null {
  const m = method.toLowerCase()
  for (const mock of allMocks) {
    const mm = (mock.method || 'get').toLowerCase()
    if (m !== mm) continue
    const mockPath = mock.url.replace('/admin-api', '')
    if (url.includes(mockPath)) {
      const query = parseQS(url)
      const body = typeof data === 'string' ? (() => { try { return JSON.parse(data) } catch { return {} } })() : (data || {})
      const hdrs: Record<string, string> = {}
      if (headers) Object.keys(headers).forEach(k => { hdrs[k.toLowerCase()] = String(headers[k]) })
      return typeof mock.response === 'function'
        ? mock.response({ url, body, query, headers: hdrs })
        : mock.response
    }
  }
  return null
}

export function setupProdMockServer() {
  console.log('[Mock] 生产环境已注册', allMocks.length, '个mock接口')
}
