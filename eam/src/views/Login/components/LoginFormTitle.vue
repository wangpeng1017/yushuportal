<template>
  <!-- 登录、手机登录、二维码登录显示自定义标题 -->
  <div v-if="showCustomTitle" class="enter-x mb-3 text-left text-white">
    <div class="text-2xl font-bold xl:text-3xl">登录到</div>
    <div class="text-2xl font-bold xl:text-3xl">设备管理系统</div>
  </div>
  <!-- 其他登录方式显示原有标题 -->
  <h2 v-else class="enter-x mb-3 text-center text-2xl font-bold xl:text-center xl:text-3xl text-white">
    {{ getFormTitle }}
  </h2>
</template>
<script lang="ts" setup>
import { LoginStateEnum, useLoginState } from './useLogin'

defineOptions({ name: 'LoginFormTitle' })

const { t } = useI18n()

const { getLoginState } = useLoginState()

// 根据不同登录状态显示不同标题
const showCustomTitle = computed(() => {
  const customStates = [LoginStateEnum.LOGIN, LoginStateEnum.MOBILE, LoginStateEnum.QR_CODE]
  return customStates.includes(unref(getLoginState))
})

const getFormTitle = computed(() => {
  const titleObj = {
    [LoginStateEnum.RESET_PASSWORD]: t('sys.login.forgetFormTitle'),
    [LoginStateEnum.REGISTER]: t('sys.login.signUpFormTitle'),
    [LoginStateEnum.SSO]: t('sys.login.ssoFormTitle'),
    [LoginStateEnum.LOGIN]: '',
    [LoginStateEnum.MOBILE]: '',
    [LoginStateEnum.QR_CODE]: ''
  }
  return titleObj[unref(getLoginState)]
})
</script>
