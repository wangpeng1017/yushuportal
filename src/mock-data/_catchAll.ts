/**
 * 通用兜底 mock：放在 mock 链最后
 * - GET 列表/分页 → 空列表
 * - POST/PUT/DELETE → 操作成功
 *
 * 注意：这里的 url 用 '/admin-api'（前缀通配），匹配任意 admin-api 请求
 * mock-bridge 通过 url.includes(mockPath) 来匹配，所以放在 auth.ts 之后才会兜底
 */

const ok = (data: any = null) => ({ code: 200, data, msg: '' })

export default [
  // ── 分页类（包含 page / list 关键词） ──
  {
    url: '/admin-api',
    method: 'get',
    response: ({ url }) => {
      // 分页接口
      if (url.includes('/page') || url.includes('/list-page')) {
        return ok({ list: [], total: 0 })
      }
      // 列表接口
      if (
        url.includes('/list') ||
        url.includes('/get-list') ||
        url.includes('/simple-list') ||
        url.includes('/all-list') ||
        url.includes('/tree')
      ) {
        return ok([])
      }
      // get-by-id / get
      if (url.includes('/get')) {
        return ok({})
      }
      // 计数
      if (url.includes('/count') || url.includes('/total')) {
        return ok(0)
      }
      // 默认空对象
      return ok({})
    }
  },
  // ── 创建 / 更新 / 删除 ──
  { url: '/admin-api', method: 'post', response: () => ok(true) },
  { url: '/admin-api', method: 'put', response: () => ok(true) },
  { url: '/admin-api', method: 'delete', response: () => ok(true) }
]
