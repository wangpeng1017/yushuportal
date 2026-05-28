<template>
  <div :class="prefixCls" class="login-page">
    <!-- 左侧品牌区 - 丝绸渐变 + 装饰 -->
    <div :class="`${prefixCls}__left lt-xl:hidden`">
      <div class="brand-bg"></div>
      <div class="brand-content">
        <div class="brand-logo">
          <img alt="" class="h-44px" src="@/assets/imgs/logoW.svg" />
          <span class="brand-title">iimake EAM</span>
        </div>
        <div class="brand-tagline">
          <h1 class="tagline-main">智能制造一体化平台</h1>
          <p class="tagline-sub">让数据驱动制造，让管理更高效</p>
        </div>
        <div class="brand-decoration">
          <img alt="" class="w-full max-w-540px opacity-90" src="@/assets/imgs/logo_banner.png" />
        </div>
      </div>
    </div>

    <!-- 右侧登录卡片 -->
    <div :class="`${prefixCls}__right`">
      <Transition appear enter-active-class="animate__animated animate__fadeInUp">
        <div class="login-card">
          <LoginForm class="login-form-wrap" />
          <MobileForm class="login-form-wrap" />
          <QrCodeForm class="login-form-wrap" />
          <RegisterForm class="login-form-wrap" />
          <SSOLoginVue class="login-form-wrap" />
          <ForgetPasswordForm class="login-form-wrap" />
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'

import {
  LoginForm,
  MobileForm,
  QrCodeForm,
  RegisterForm,
  SSOLoginVue,
  ForgetPasswordForm
} from './components'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.login-page {
  position: relative;
  height: 100vh;
  width: 100%;
  display: flex;
  background-color: #f4f7fb;
  overflow: hidden;
}

/* ========== 左侧品牌区 ========== */
.#{$prefix-cls}__left {
  flex: 1.2;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 30%, rgba(33, 150, 243, 0.18) 0%, transparent 55%),
    radial-gradient(ellipse at 80% 70%, rgba(124, 158, 250, 0.15) 0%, transparent 55%),
    linear-gradient(135deg, #eaf2fe 0%, #f7faff 50%, #e8eef9 100%);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.7) 50%, transparent 70%),
      linear-gradient(70deg, transparent 35%, rgba(186, 215, 250, 0.4) 50%, transparent 65%);
    transform: translateY(-5%) rotate(-8deg);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -15%;
    right: -10%;
    width: 70%;
    height: 70%;
    background: radial-gradient(circle, rgba(33, 150, 243, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }
}

.brand-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  padding: 60px 60px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 90px;
}

.brand-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a2332;
  letter-spacing: 0.5px;
}

.brand-tagline {
  flex: 1;

  .tagline-main {
    font-size: 38px;
    font-weight: 700;
    color: #1a2332;
    letter-spacing: 1px;
    margin-bottom: 14px;
    line-height: 1.3;
  }

  .tagline-sub {
    font-size: 16px;
    color: #5a6677;
    letter-spacing: 0.5px;
    line-height: 1.6;
  }
}

.brand-decoration {
  display: flex;
  justify-content: center;
  margin-top: auto;
}

/* ========== 右侧登录卡片 ========== */
.#{$prefix-cls}__right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 30px;
  position: relative;
  z-index: 2;

  /* 移动端单列时，整页深底也要变浅 */
  @media (max-width: 1024px) {
    background:
      radial-gradient(ellipse at top right, rgba(33, 150, 243, 0.1) 0%, transparent 60%),
      linear-gradient(135deg, #f7faff 0%, #ffffff 100%);
  }
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 16px;
  padding: 32px 36px;
  box-shadow:
    0 20px 50px -10px rgba(15, 23, 42, 0.08),
    0 10px 24px -6px rgba(15, 23, 42, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

/* 表单包装：让原表单组件继承新风格 */
.login-form-wrap {
  width: 100%;
}

/* 覆写表单内部样式 - 浅色 */
:deep(.login-form) {
  background: transparent !important;
  padding: 0 !important;
  color: #1a2332;

  .el-form-item__label {
    color: #1a2332 !important;
  }

  .el-checkbox__label {
    color: #5a6677 !important;
  }

  .el-link {
    color: var(--primary-color) !important;
  }

  .el-input__wrapper {
    background-color: #f7f9fc !important;
    box-shadow: 0 0 0 1px transparent inset !important;
    border-radius: 8px !important;
    padding: 6px 12px !important;

    &:hover {
      background-color: #f0f4f8 !important;
      box-shadow: 0 0 0 1px var(--primary-color-hover) inset !important;
    }

    &.is-focus {
      background-color: #ffffff !important;
      box-shadow:
        0 0 0 1px var(--primary-color) inset,
        0 0 0 3px rgba(33, 150, 243, 0.12) !important;
    }
  }

  .el-input__inner {
    color: #1a2332 !important;
    font-size: 14px;

    &::placeholder {
      color: #a0a8b3 !important;
    }
  }

  .el-button--primary {
    height: 44px !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    border-radius: 8px !important;
    background: linear-gradient(135deg, #42a5f5 0%, #1976d2 100%) !important;
    border: none !important;
    box-shadow: 0 6px 16px rgba(33, 150, 243, 0.32) !important;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(33, 150, 243, 0.4) !important;
    }
  }
}
</style>
