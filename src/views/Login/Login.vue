<template>
  <div :class="prefixCls" class="login-page">
    <!-- 左侧品牌区（科技感 + 机器人） -->
    <div class="login-brand">
      <!-- 网格背景 + 扫描线 -->
      <div class="login-grid-bg"></div>
      <div class="login-scan-line"></div>

      <!-- 装饰光晕 -->
      <div class="login-brand-deco">
        <div class="login-brand-orb orb-1"></div>
        <div class="login-brand-orb orb-2"></div>
      </div>

      <!-- 顶部 LOGO 行（极简） -->
      <div class="login-brand-top">
        <span class="brand-mark">UNITREE</span>
        <span class="brand-divider"></span>
        <span class="brand-product">MOM PLATFORM</span>
      </div>

      <!-- 中部主视觉：宇树 Go2 四足机器人 -->
      <div class="login-robot-wrap">
        <div class="login-robot-halo"></div>
        <img
          class="login-robot"
          src="/robot-go2.png"
          alt="UNITREE Go2"
          draggable="false"
        />

        <!-- 机型水印文字 -->
        <div class="robot-tag">
          <span class="tag-id">UNITREE · Go2</span>
          <span class="tag-status">● LIVE</span>
        </div>
      </div>

      <!-- 标题区 -->
      <div class="login-brand-content">
        <h1 class="login-brand-title">
          <span class="title-en">UNITREE MOM</span>
          <span class="title-zh">宇树MOM 一体化平台</span>
        </h1>
        <p class="login-brand-slogan">Smart Manufacturing Operation Platform · 智能制造运营平台</p>
        <ul class="login-brand-features">
          <li><span class="dot"></span><span class="feature-label">智能制造执行</span><span class="feature-en">MES</span></li>
          <li><span class="dot"></span><span class="feature-label">数据驱动决策</span><span class="feature-en">BI · MDM</span></li>
          <li><span class="dot"></span><span class="feature-label">全流程质量追溯</span><span class="feature-en">QMS</span></li>
          <li><span class="dot"></span><span class="feature-label">设备互联互通</span><span class="feature-en">IoT · EAM</span></li>
        </ul>
      </div>

      <!-- 底部版权 -->
      <div class="login-brand-footer">
        <span>© 2026 UNITREE Robotics</span>
        <span class="footer-divider"></span>
        <span>www.unitree.com</span>
      </div>
    </div>

    <!-- 右侧登录卡片 -->
    <div class="login-form-wrap">
      <div class="login-card">
        <div class="login-card-header">
          <h2>欢迎登录</h2>
          <p>请选择登录方式</p>
        </div>

        <!-- Tab 切换 -->
        <div class="login-tabs">
          <div
            class="login-tab"
            :class="{ active: activeTab === 'password' }"
            @click="activeTab = 'password'"
          >
            <el-icon><User /></el-icon>
            账号密码
          </div>
          <div
            class="login-tab"
            :class="{ active: activeTab === 'qrcode' }"
            @click="activeTab = 'qrcode'"
          >
            <el-icon><Iphone /></el-icon>
            飞书扫码
          </div>
        </div>

        <!-- 表单区 -->
        <div class="login-tab-body">
          <!-- 账号密码 -->
          <div v-show="activeTab === 'password'" class="login-pwd">
            <div class="login-field">
              <el-input
                v-model="username"
                placeholder="请输入账号"
                size="large"
                :prefix-icon="User"
              />
            </div>
            <div class="login-field">
              <el-input
                v-model="password"
                placeholder="请输入密码"
                size="large"
                show-password
                :prefix-icon="Lock"
                @keyup.enter="handleLogin"
              />
            </div>
            <div class="login-extra">
              <el-checkbox v-model="rememberMe" size="small">记住账号</el-checkbox>
              <a class="login-link" @click="onForgot">忘记密码？</a>
            </div>
          </div>

          <!-- 飞书扫码 -->
          <div v-show="activeTab === 'qrcode'" class="login-qrcode">
            <div class="login-qrcode-box">
              <div class="login-qrcode-img" v-html="qrSvg"></div>
              <div class="login-qrcode-center">
                <span class="lark-logo">飞</span>
              </div>
            </div>
            <div class="login-qrcode-tip">
              <el-icon><Iphone /></el-icon>
              打开飞书 App，扫一扫登录
            </div>
            <a class="login-link login-qrcode-refresh" @click="refreshQr">
              <el-icon><Refresh /></el-icon>
              刷新二维码（{{ countdown }}s）
            </a>
          </div>
        </div>

        <!-- 登录按钮 -->
        <el-button
          type="primary"
          size="large"
          class="login-submit"
          :loading="loading"
          @click="handleLogin"
        >
          {{ loading ? '正在登录...' : '登 录' }}
        </el-button>

        <!-- Demo 提示 -->
        <div class="login-demo-tip">
          <el-icon><InfoFilled /></el-icon>
          <span>测试环境请直接点击登录</span>
        </div>

      </div>

      <div class="login-form-footer">
        © 2026 宇树科技股份有限公司 · 技术支持 IIMake
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDesign } from '@/hooks/web/useDesign'
import { User, Lock, Iphone, Refresh, InfoFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as authUtil from '@/utils/auth'
import * as LoginApi from '@/api/login'

defineOptions({ name: 'Login' })

const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
const { currentRoute } = useRouter()

const activeTab = ref<'password' | 'qrcode'>('password')
const username = ref('admin')
const password = ref('admin123')
const rememberMe = ref(true)
const loading = ref(false)

// 假二维码 SVG（每次刷新换种子）
const qrSeed = ref(0)
const qrSvg = computed(() => generateFakeQr(qrSeed.value))

const countdown = ref(120)
let countdownTimer: ReturnType<typeof setInterval> | null = null

const startCountdown = () => {
  countdown.value = 120
  countdownTimer && clearInterval(countdownTimer)
  countdownTimer = setInterval(() => {
    countdown.value -= 1
    if (countdown.value <= 0) {
      refreshQr()
    }
  }, 1000)
}

const refreshQr = () => {
  qrSeed.value = Date.now() % 99999
  startCountdown()
  ElMessage.success('二维码已刷新')
}

const onForgot = () => {
  ElMessage.info('Demo 模式：请联系管理员重置密码')
}

// 模拟登录：任何 Tab 点登录都直接 mockLogin 进系统
const handleLogin = async () => {
  loading.value = true
  try {
    authUtil.setTenantId(1)
    const res = await LoginApi.loginByUsername({ username: 'admin' })
    if (res) {
      authUtil.setToken(res)
      const redirect = (currentRoute.value.query.redirect as string) || '/'
      window.location.href = redirect
    } else {
      loading.value = false
      ElMessage.error('登录失败，请稍后再试')
    }
  } catch (e) {
    console.error('login failed', e)
    loading.value = false
    ElMessage.error('登录失败')
  }
}

// 登录页 mount 时预拉取 Home/Layout 的核心 chunk（用户填账号期间就开始下）
const prefetchHomeChunks = () => {
  // 触发 dynamic chunk 缓存，不实际渲染
  import('@/views/Home/Index.vue').catch(() => {})
  import('@/utils/routerHelper').catch(() => {})
}

// 生成假二维码 SVG（25x25 网格）
function generateFakeQr(seed: number) {
  const size = 25
  let s = seed * 9301 + 49297
  const rnd = () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
  let cells = ''
  const cellSize = 8
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // 三个角的定位框
      const isCorner =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7)
      if (isCorner) {
        const inX = x < 7 ? x : x - (size - 7)
        const inY = y < 7 ? y : y - (size - 7)
        const fill =
          (inX === 0 || inX === 6 || inY === 0 || inY === 6) ||
          (inX >= 2 && inX <= 4 && inY >= 2 && inY <= 4)
        if (fill) {
          cells += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1f2937"/>`
        }
      } else if (rnd() > 0.55) {
        cells += `<rect x="${x * cellSize}" y="${y * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1f2937"/>`
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size * cellSize} ${size * cellSize}" width="100%" height="100%">
    <rect width="100%" height="100%" fill="#fff"/>
    ${cells}
  </svg>`
}

onMounted(() => {
  startCountdown()
  // 用户进入登录页就开始预拉 Home/Layout chunks，登录后秒进
  prefetchHomeChunks()
})

onUnmounted(() => {
  countdownTimer && clearInterval(countdownTimer)
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.login-page {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #fff;
}

/* ---------------- 左侧品牌（科技感 + 机器人） ---------------- */
.login-brand {
  flex: 1;
  min-width: 0;
  position: relative;
  background:
    radial-gradient(ellipse at top right, rgba(79, 172, 254, 0.18) 0%, transparent 60%),
    radial-gradient(ellipse at bottom left, rgba(0, 242, 254, 0.10) 0%, transparent 55%),
    linear-gradient(160deg, #001528 0%, #001D44 35%, #00263F 70%, #001528 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 40px 56px 36px;
  overflow: hidden;
}

/* 网格背景 */
.login-grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(79, 172, 254, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(79, 172, 254, 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  background-position: -1px -1px;
  mask-image: radial-gradient(ellipse 80% 65% at 50% 55%, #000 30%, transparent 100%);
  -webkit-mask-image: radial-gradient(ellipse 80% 65% at 50% 55%, #000 30%, transparent 100%);
  pointer-events: none;
}

/* 扫描线动画 */
.login-scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.6), transparent);
  box-shadow: 0 0 12px rgba(79, 172, 254, 0.5);
  animation: scan 6s linear infinite;
  pointer-events: none;
  z-index: 2;
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* 光晕 */
.login-brand-deco {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.login-brand-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);

  &.orb-1 {
    width: 360px;
    height: 360px;
    background: radial-gradient(circle, #4FACFE 0%, transparent 70%);
    top: -80px;
    right: -100px;
    opacity: 0.4;
  }
  &.orb-2 {
    width: 280px;
    height: 280px;
    background: radial-gradient(circle, #00F2FE 0%, transparent 70%);
    bottom: 60px;
    left: -60px;
    opacity: 0.2;
  }
}

/* 顶部 LOGO 行 */
.login-brand-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11.5px;
  letter-spacing: 3px;

  .brand-mark {
    font-weight: 700;
    color: #fff;
  }

  .brand-divider {
    width: 22px;
    height: 1px;
    background: linear-gradient(90deg, #4FACFE, transparent);
  }

  .brand-product {
    color: rgba(255, 255, 255, 0.55);
    font-weight: 500;
  }
}

/* 机器人主视觉 */
.login-robot-wrap {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 16px 0 24px;
  min-height: 320px;
}

/* 底部光晕（图片下方圆形辉光） */
.login-robot-halo {
  position: absolute;
  bottom: 36px;
  left: 50%;
  transform: translateX(-50%);
  width: 360px;
  height: 60px;
  background: radial-gradient(ellipse at center, rgba(79, 172, 254, 0.45) 0%, rgba(79, 172, 254, 0.15) 35%, transparent 70%);
  filter: blur(8px);
  pointer-events: none;
  animation: halo-pulse 4s ease-in-out infinite;
}

@keyframes halo-pulse {
  0%, 100% { opacity: 0.8; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 1; transform: translateX(-50%) scaleX(1.08); }
}

.login-robot {
  position: relative;
  width: 78%;
  max-width: 460px;
  height: auto;
  object-fit: contain;
  filter:
    drop-shadow(0 8px 24px rgba(0, 0, 0, 0.45))
    drop-shadow(0 0 28px rgba(79, 172, 254, 0.25));
  animation: robot-float 5s ease-in-out infinite;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes robot-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.robot-tag {
  display: flex;
  gap: 14px;
  margin-top: 6px;
  font-family: Consolas, 'JetBrains Mono', monospace;
  font-size: 11px;
  letter-spacing: 1.5px;

  .tag-id {
    color: rgba(255, 255, 255, 0.65);
    padding: 3px 8px;
    border: 1px solid rgba(79, 172, 254, 0.35);
    border-radius: 3px;
    background: rgba(79, 172, 254, 0.05);
  }

  .tag-status {
    color: #52c41a;
    padding: 3px 8px;
    background: rgba(82, 196, 26, 0.1);
    border: 1px solid rgba(82, 196, 26, 0.3);
    border-radius: 3px;

    animation: blink 2s ease-in-out infinite;
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 标题区 */
.login-brand-content {
  position: relative;
  z-index: 1;
}

.login-brand-title {
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  .title-en {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 4px;
    color: #4FACFE;
    text-shadow: 0 0 12px rgba(79, 172, 254, 0.4);
  }

  .title-zh {
    font-size: 36px;
    font-weight: 700;
    line-height: 1.15;
    background: linear-gradient(90deg, #fff 0%, #aee0ff 60%, #4FACFE 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
  }
}

.login-brand-slogan {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.45);
  margin: 0 0 28px;
  letter-spacing: 0.5px;
}

.login-brand-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 24px;

  li {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13.5px;
    color: rgba(255, 255, 255, 0.78);
    padding: 8px 0 8px 4px;
    border-left: 2px solid rgba(79, 172, 254, 0.3);
    padding-left: 10px;
    transition: all 0.3s;

    &:hover {
      color: #fff;
      border-left-color: #4FACFE;
      background: linear-gradient(90deg, rgba(79, 172, 254, 0.08), transparent);
    }

    .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #4FACFE;
      box-shadow: 0 0 8px #4FACFE;
      flex-shrink: 0;
    }

    .feature-label {
      flex: 1;
    }

    .feature-en {
      font-family: Consolas, 'JetBrains Mono', monospace;
      font-size: 10.5px;
      color: rgba(79, 172, 254, 0.7);
      letter-spacing: 0.5px;
    }
  }
}

.login-brand-footer {
  position: relative;
  z-index: 1;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 10px;

  .footer-divider {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
  }
}

/* ---------------- 右侧登录卡片 ---------------- */
.login-form-wrap {
  width: 480px;
  flex-shrink: 0;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.login-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 12px;
  padding: 36px 32px;
  box-shadow: 0 10px 40px rgba(0, 64, 92, 0.08);
}

.login-card-header {
  text-align: center;
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: #1f2937;
    margin: 0 0 6px;
  }

  p {
    font-size: 13px;
    color: #9ca3af;
    margin: 0;
  }
}

/* Tab */
.login-tabs {
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20px;
}

.login-tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: color 0.2s;

  &:hover {
    color: #1890ff;
  }

  &.active {
    color: #00405C;
    font-weight: 500;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 20%;
      right: 20%;
      height: 2px;
      background: linear-gradient(90deg, #00405C, #4FACFE);
      border-radius: 2px;
    }
  }
}

.login-tab-body {
  min-height: 200px;
}

/* 账号密码 */
.login-pwd {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-field {
  :deep(.el-input__wrapper) {
    border-radius: 6px;
  }
}

.login-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -4px;
}

.login-link {
  color: #1890ff;
  font-size: 12.5px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;

  &:hover {
    text-decoration: underline;
  }
}

/* 扫码 */
.login-qrcode {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 0;
}

.login-qrcode-box {
  position: relative;
  width: 168px;
  height: 168px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 6px;
  margin-bottom: 14px;
}

.login-qrcode-img {
  width: 100%;
  height: 100%;
}

.login-qrcode-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  background: #fff;
  border: 2px solid #1f2937;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;

  .lark-logo {
    color: #00d6b9;
    font-weight: 700;
    font-size: 17px;
  }
}

.login-qrcode-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #4b5563;
  margin-bottom: 4px;
}

.login-qrcode-refresh {
  font-size: 12px;
  margin-top: 4px;
}

/* 登录按钮 */
.login-submit {
  width: 100%;
  margin-top: 18px;
  height: 44px;
  font-size: 15px;
  background: linear-gradient(90deg, #00405C 0%, #1A5A70 100%);
  border: none;

  &:hover {
    background: linear-gradient(90deg, #1A5A70 0%, #367484 100%);
  }
}

/* Demo 提示 */
.login-demo-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 12.5px;
  color: #909399;

  .el-icon {
    color: #1890ff;
  }
}

/* 分隔 + 其他登录 */
.login-divider {
  position: relative;
  text-align: center;
  margin: 24px 0 14px;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: #e5e7eb;
  }

  span {
    position: relative;
    padding: 0 12px;
    background: #fff;
    font-size: 12px;
    color: #9ca3af;
  }
}

.login-social {
  display: flex;
  justify-content: center;
  gap: 32px;
}

.login-social-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
    color: #1890ff;
  }

  .social-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
  }
}

.login-form-footer {
  margin-top: 32px;
  font-size: 12px;
  color: #9ca3af;
}

/* 响应式 */
@media (max-width: 960px) {
  .login-brand {
    display: none;
  }
  .login-form-wrap {
    width: 100%;
  }
}
</style>
