<template>
  <div class="m-login">
    <MobileHeader title="登录" :show-back="false" />
    <div class="m-login-body">
      <div class="m-login-title">PDA 移动端登录</div>
      <div class="m-login-sub">请使用您的桌面端账号登录</div>

      <div class="m-form">
        <el-input v-model="form.username" placeholder="用户名" size="large" class="m-input" />
        <el-input v-model="form.password" type="password" placeholder="密码" size="large" class="m-input" show-password @keyup.enter="onSubmit" />
        <el-button type="primary" size="large" class="m-btn" :loading="submitting" @click="onSubmit">登 录</el-button>
      </div>

      <div class="m-tip">演示提示：任意账号 + 任意密码（非空）即可登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mobileLogin } from '@/api/mobile/auth'
import { setMobileToken } from './utils/mobile-token'
import MobileHeader from './components/MobileHeader.vue'

defineOptions({ name: 'MobileLogin' })

const route = useRoute()
const router = useRouter()

const form = reactive({ username: '', password: '' })
const submitting = ref(false)

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  submitting.value = true
  try {
    const res = await mobileLogin(form)
    setMobileToken(res.token)
    ElMessage.success(`欢迎，${res.nickname}`)
    const redirect = route.query.redirect as string
    if (redirect) {
      try { router.replace(decodeURIComponent(redirect)) } catch { router.replace('/m/equipment/EQ20240001') }
    } else {
      router.replace('/m/equipment/EQ20240001')
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || '登录失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.m-login { min-height: 100vh; background: #fff; }
.m-login-body { padding: 30px 20px; }
.m-login-title { font-size: 22px; font-weight: bold; color: #303133; text-align: center; margin-top: 20px; }
.m-login-sub { font-size: 13px; color: #909399; text-align: center; margin-top: 8px; margin-bottom: 30px; }
.m-form { display: flex; flex-direction: column; gap: 14px; }
.m-input :deep(.el-input__wrapper) { border-radius: 8px; }
.m-btn { margin-top: 8px; height: 48px; border-radius: 8px; }
.m-tip { margin-top: 20px; padding: 10px 14px; background: #f5f7fa; border-radius: 6px; font-size: 12px; color: #909399; }
</style>
