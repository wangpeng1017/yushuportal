<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'

import avatarImg from '@/assets/imgs/avatar.png'
import { useDesign } from '@/hooks/web/useDesign'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useUserStore } from '@/store/modules/user'
import LockDialog from './components/LockDialog.vue'
import LockPage from './components/LockPage.vue'
import { useLockStore } from '@/store/modules/lock'
import { setToken, getAccessToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'

defineOptions({ name: 'UserInfo' })

const { t } = useI18n()

const { push, replace } = useRouter()

const userStore = useUserStore()

const tagsViewStore = useTagsViewStore()

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('user-info')

const avatar = computed(() => userStore.user.avatar || avatarImg)
const userName = computed(() => userStore.user.nickname ?? 'Admin')

// ── 车间切换器（所有用户都可见，方便演示） ──
const WORKSHOP_OPTIONS = [
  { value: 'mock-token-all', label: '全部车间' },
  { value: 'mock-token-c',   label: 'C端车间' },
  { value: 'mock-token-b',   label: 'B端车间' },
  { value: 'mock-token-cnc', label: '数控机加车间' },
]
// 始终显示切换器，根据当前token选中对应项
const currentWorkshop = ref(getAccessToken() || 'mock-token-all')

const handleWorkshopChange = async (token: string) => {
  setToken({
    accessToken: token,
    refreshToken: 'mock-refresh',
    expiresTime: Date.now() + 24 * 60 * 60 * 1000
  })
  // 清除用户缓存并刷新，让新token生效
  deleteUserCache()
  userStore.$reset()
  window.location.reload()
}

// 锁定屏幕
const lockStore = useLockStore()
const getIsLock = computed(() => lockStore.getLockInfo?.isLock ?? false)
const dialogVisible = ref<boolean>(false)
const lockScreen = () => {
  dialogVisible.value = true
}

const loginOut = async () => {
  try {
    await ElMessageBox.confirm(
      t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    await userStore.loginOut()
    tagsViewStore.delAllViews()
    replace('/login?redirect=/index')
  } catch {}
}
const toProfile = async () => {
  push('/user/profile')
}
const toDocument = () => {
  window.open('https://iimake.com/')
}
</script>

<template>
  <!-- 车间切换器 -->
  <ElSelect
    v-model="currentWorkshop"
    class="mr-10px"
    style="width: 140px"
    size="small"
    @change="handleWorkshopChange"
  >
    <ElOption
      v-for="item in WORKSHOP_OPTIONS"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </ElSelect>

  <ElDropdown class="user-info-dropdown" :class="prefixCls" trigger="click">
    <div class="flex items-center px-8px py-4px rounded-8px hover:bg-[#f5f9ff] cursor-pointer transition-all">
      <ElAvatar :src="avatar" alt="" class="w-32px h-32px rounded-[50%]" />
      <span class="pl-8px text-14px text-[var(--top-header-text-color)] whitespace-nowrap <lg:hidden">
        {{ userName }}
      </span>
    </div>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem>
          <Icon icon="ep:tools" />
          <div @click="toProfile">{{ t('common.profile') }}</div>
        </ElDropdownItem>
        <!-- <ElDropdownItem>
          <Icon icon="ep:menu" />
          <div @click="toDocument">{{ t('common.document') }}</div>
        </ElDropdownItem> -->
        <ElDropdownItem divided>
          <Icon icon="ep:lock" />
          <div @click="lockScreen">{{ t('lock.lockScreen') }}</div>
        </ElDropdownItem>
        <ElDropdownItem divided @click="loginOut">
          <Icon icon="ep:switch-button" />
          <div>{{ t('common.loginOut') }}</div>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>

  <LockDialog v-if="dialogVisible" v-model="dialogVisible" />

  <teleport to="body">
    <transition name="fade-bottom" mode="out-in">
      <LockPage v-if="getIsLock" />
    </transition>
  </teleport>
</template>

<style scoped lang="scss">
.fade-bottom-enter-active,
.fade-bottom-leave-active {
  transition:
    opacity 0.25s,
    transform 0.3s;
}

.fade-bottom-enter-from {
  opacity: 0;
  transform: translateY(-10%);
}

.fade-bottom-leave-to {
  opacity: 0;
  transform: translateY(10%);
}
</style>
