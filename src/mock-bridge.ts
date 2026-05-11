/**
 * Mock 桥接：从 src/mock-data/ 导出 mock 匹配函数
 * 由 src/config/axios/service.ts 的拦截器调用
 */
// @ts-nocheck
import authMock from './mock-data/auth'
import catchAllMock from './mock-data/_catchAll'

const allMocks = [...authMock, ...catchAllMock]

function parseQS(url: string): Record<string, string> {
  const q: Record<string, string> = {}
  const i = url.indexOf('?')
  if (i === -1) return q
  url
    .substring(i + 1)
    .split('&')
    .forEach((p) => {
      const [k, v] = p.split('=')
      if (k) q[decodeURIComponent(k)] = v ? decodeURIComponent(v) : ''
    })
  return q
}

export function tryMatchMock(
  url: string,
  method: string,
  data?: any,
  headers?: Record<string, string>
): any | null {
  const m = (method || 'get').toLowerCase()
  for (const mock of allMocks) {
    const mm = (mock.method || 'get').toLowerCase()
    if (mm !== '*' && m !== mm) continue
    const mockPath = mock.url.replace('/admin-api', '')
    const matched = mock.url === '*' ? true : url.includes(mockPath)
    if (matched) {
      const query = parseQS(url)
      const body =
        typeof data === 'string'
          ? (() => {
              try {
                return JSON.parse(data)
              } catch {
                return {}
              }
            })()
          : data || {}
      const hdrs: Record<string, string> = {}
      if (headers)
        Object.keys(headers).forEach((k) => {
          hdrs[k.toLowerCase()] = String(headers[k])
        })
      return typeof mock.response === 'function'
        ? mock.response({ url, body, query, headers: hdrs })
        : mock.response
    }
  }
  return null
}
