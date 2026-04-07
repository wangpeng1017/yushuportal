<template>
  <div
    :class="prefixCls"
    class="relative h-[100%] lt-md:px-10px lt-sm:px-10px lt-xl:px-10px lt-xl:px-10px"
    style="background-color: #00405C;"
  >
    <!-- 顶部导航栏 -->
    <div class="login-header">
      <div class="flex items-center justify-between px-30px py-10px">
        <!-- 左侧 logo -->
        <div class="flex items-center text-white">
          <img alt="" class="h-40px" style="width: 160px;" src="@/assets/imgs/logoW.svg" />
        </div>
        <!-- 右侧主题、语言选择 -->
        <div class="flex items-center space-x-10px">
          &nbsp;
          <!-- <ThemeSwitch />
          <LocaleDropdown /> -->
        </div>
      </div>
    </div>
    
    <div class="relative mx-auto h-full flex pt-70px">
      <div
        :class="`${prefixCls}__left flex-1 relative p-30px lt-xl:hidden overflow-x-hidden overflow-y-auto flex flex-col`"
      >
        <!-- 中间区域（留空） -->
        <div class="flex-1"></div>
        <!-- 左下角的 banner -->
        <div class="relative">
          <img alt="" class="w-full max-w-600px" src="@/assets/imgs/logo_banner.png" />
        </div>
      </div>
      <div
        class="relative flex-1 p-30px lt-sm:p-10px overflow-x-hidden overflow-y-auto"
      >
        <!-- 右边的登录界面 -->
        <Transition appear enter-active-class="animate__animated animate__bounceInRight">
          <div
            class="m-auto h-[calc(100%-60px)] w-[100%] flex items-center at-2xl:max-w-500px at-lg:max-w-500px at-md:max-w-500px at-xl:max-w-500px"
          >
            <!-- 账号登录 -->
            <LoginForm class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
            <!-- 手机登录 -->
            <MobileForm class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
            <!-- 二维码登录 -->
            <QrCodeForm class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
            <!-- 注册 -->
            <RegisterForm class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
            <!-- 三方登录 -->
            <SSOLoginVue class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
            <!-- 忘记密码 -->
            <ForgetPasswordForm class="m-auto h-auto p-40px login-form-container" style="background-color: rgba(0, 64, 92, 0.3); border-radius: 8px;" />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { underlineToHump } from '@/utils'

import { useDesign } from '@/hooks/web/useDesign'
import { useAppStore } from '@/store/modules/app'
import { ThemeSwitch } from '@/layout/components/ThemeSwitch'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'

import { LoginForm, MobileForm, QrCodeForm, RegisterForm, SSOLoginVue, ForgetPasswordForm } from './components'

defineOptions({ name: 'Login' })

const { t } = useI18n()
const appStore = useAppStore()
const { getPrefixCls } = useDesign()
const prefixCls = getPrefixCls('login')
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-login;

.#{$prefix-cls} {
  overflow: auto;
  background-color: #00405C;

  &__left {
    // 移除原背景图
  }
}

// 顶部导航栏样式
.login-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: rgba(0, 64, 92, 0.3);
  backdrop-filter: blur(10px);
}

// 登录表单样式
:deep(.login-form) {
  // 表单文字颜色为白色
  color: white;
  
  // 标签文字为白色
  .el-form-item__label {
    color: white !important;
  }
  
  // 复选框文字为白色
  .el-checkbox__label {
    color: white !important;
  }
  
  // 链接文字为白色
  .el-link {
    color: white !important;
  }
  
  // 输入框样式
  .el-input__wrapper {
    background-color: white;
  }
  
  // 输入框内文字为黑色
  .el-input__inner {
    color: black !important;
  }
}

// 登录框容器背景样式
.login-form-container {
  background-color: rgba(0, 64, 92, 0.3) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(10px);
}
</style>

<!-- <style lang="scss">
.dark .login-form {
  .el-divider__text {
    background-color: var(--login-bg-color);
  }

  .el-card {
    background-color: var(--login-bg-color);
  }
}

// 登录框容器全局样式
.login-form-container {
  background-color: rgba(0, 64, 92, 0.3) !important;
  border-radius: 8px !important;
  backdrop-filter: blur(10px);
}
</style> -->
