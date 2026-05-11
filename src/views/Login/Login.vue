<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] flex items-center justify-center login-gradient-bg"
  >
    <!-- 加载状态显示 -->
    <div class="loading-container">
      <el-icon class="loading-icon" size="48"><Loading /></el-icon>
      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useDesign } from '@/hooks/web/useDesign'
import { Loading } from '@element-plus/icons-vue'
import * as authUtil from '@/utils/auth'
import * as LoginApi from '@/api/login'

defineOptions({ name: 'Login' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const { currentRoute } = useRouter()
const loadingText = ref('正在跳转登录...')

// SSO登录方法
const ssoLogin = async () => {
  const redirect: string = `${window.location.origin}/login?redirect=/index`
  localStorage.setItem('redirect_uri', redirect)
  window.location.href = `${import.meta.env.VITE_IIMAKE_SSO_URL}?client_id=${import.meta.env.VITE_IIMAKE_CLIENT_ID}&response_type=code&auto_approve=false&scope=%7B%22user.read%22%3Atrue%7D&redirect_uri=${encodeURIComponent(redirect)}`
}

// Code登录方法
const codeLogin = async () => {
  const queryParams = currentRoute.value.query
  const code = queryParams.code
  if (code) {
    loadingText.value = '正在登录...'
    const redirect_uri = localStorage.getItem('redirect_uri') || window.location.origin + window.location.pathname
    const loginResult = await LoginApi.codeLogin({ code: code, url: redirect_uri?.replaceAll('#', '%23') })
    if (loginResult && loginResult.username) {
      let auth: any = {}
      auth.accessToken = loginResult.access_token
      auth.refreshToken = loginResult.refresh_token
      auth.tokenType = loginResult.token_type
      auth.expiresIn = loginResult.expires_in
      authUtil.setOauth2Token(auth)
      authUtil.setTenantId(1)
      try {
        const loginForm = {
          username: loginResult.username
        }
        const res = await LoginApi.loginByUsername(loginForm)
        if (!res) {
          return
        }
        authUtil.setToken(res)
        const redirect = queryParams.redirect as string || '/'
        window.location.href = redirect
      } catch (error) {
        console.log(error)
        loadingText.value = '登录失败，正在跳转...'
        setTimeout(() => {
          ssoLogin()
        }, 1500)
      }
    } else {
      loadingText.value = '登录失败，正在跳转...'
      setTimeout(() => {
        ssoLogin()
      }, 1500)
    }
  } else {
    // 没有code参数，执行SSO登录
    ssoLogin()
  }
}

// Mock 演示模式：直接调 loginByUsername 拿 token 进入系统，跳过 SSO
const mockLogin = async () => {
  loadingText.value = '正在以 Demo 模式登录...'
  try {
    authUtil.setTenantId(1)
    const res = await LoginApi.loginByUsername({ username: 'admin' })
    if (res) {
      authUtil.setToken(res)
      const redirect = (currentRoute.value.query.redirect as string) || '/'
      window.location.href = redirect
    }
  } catch (e) {
    console.error('mock login failed', e)
    loadingText.value = 'Mock 登录失败'
  }
}

onMounted(() => {
  if (import.meta.env.VITE_MOCK_MODE === 'true') {
    mockLogin()
  } else {
    codeLogin()
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
}

// 渐变背景 - 从 #00405C 到稍浅的蓝色
.login-gradient-bg {
  background: linear-gradient(135deg, #00405C 0%, #1A5A70 50%, #367484 100%);
}

// 加载容器样式
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

// 加载图标动画
.loading-icon {
  animation: rotate 2s linear infinite;
  color: white;
}

// 加载文字样式
.loading-text {
  margin-top: 16px;
  font-size: 14px;
  color: white;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
