/**
 * UniTree autoLogin
 * 演示/内网环境免登录方案：用 .env 配置的账号密码自动调用登录接口拿 token，
 * mock 模式下直接走前端 mock 拦截。
 *
 * 启用：在 .env.mock 设置：
 *   VITE_AUTO_LOGIN=true
 *   VITE_AUTO_LOGIN_USER=admin
 *   VITE_AUTO_LOGIN_PASS=admin123
 *   VITE_AUTO_LOGIN_TENANT=（可选）
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
