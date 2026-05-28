/**
 * UniTree autoLogin
 * 演示/内网环境免登录方案：用 .env 配置的账号密码自动调用登录接口拿 token，
 * 后端鉴权零改动，权限菜单/按钮控制照常工作。
 *
 * 启用：在 .env.local 或 .env.stage 设置：
 *   VITE_AUTO_LOGIN=true
 *   VITE_AUTO_LOGIN_USER=admin
 *   VITE_AUTO_LOGIN_PASS=your-password
 *   VITE_AUTO_LOGIN_TENANT=租户名（如 iimake）
 *
 * 生产关闭（默认）：在 .env.prod 设置 VITE_AUTO_LOGIN=false
 */
import * as LoginApi from '@/api/login'
import * as authUtil from '@/utils/auth'

export interface AutoLoginConfig {
  enabled: boolean
  username: string
  password: string
  tenantName: string
}

export const getAutoLoginConfig = (): AutoLoginConfig => ({
  enabled: import.meta.env.VITE_AUTO_LOGIN === 'true',
  username: (import.meta.env.VITE_AUTO_LOGIN_USER as string) || '',
  password: (import.meta.env.VITE_AUTO_LOGIN_PASS as string) || '',
  tenantName: (import.meta.env.VITE_AUTO_LOGIN_TENANT as string) || ''
})

let inFlight: Promise<boolean> | null = null

/**
 * 尝试自动登录
 * - 已有 token：返回 true
 * - 配置未启用或缺账密：返回 false
 * - 调用登录 API 成功：setToken + 返回 true
 * - 失败：捕获异常并返回 false（不抛出，让守卫继续走 fallback 跳转 /login）
 *
 * 多次并发调用会复用同一个 inFlight Promise，避免重复触发登录请求。
 */
export const tryAutoLogin = async (): Promise<boolean> => {
  if (authUtil.getAccessToken()) return true
  if (inFlight) return inFlight

  inFlight = (async () => {
    const cfg = getAutoLoginConfig()
    if (!cfg.enabled || !cfg.username || !cfg.password) return false

    try {
      if (cfg.tenantName) {
        const tenantId = await LoginApi.getTenantIdByName(cfg.tenantName)
        if (tenantId != null) {
          authUtil.setTenantId(tenantId as unknown as number)
        }
      }
      const loginPayload = {
        username: cfg.username,
        password: cfg.password,
        rememberMe: true,
        tenantName: cfg.tenantName,
        captchaVerification: ''
      }
      const res = await LoginApi.login(loginPayload as any)
      if (!res) return false
      authUtil.setToken(res)
      // eslint-disable-next-line no-console
      console.info('[autoLogin] 自动登录成功 (user=%s)', cfg.username)
      return true
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[autoLogin] 自动登录失败，回退到登录页:', e)
      return false
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}
