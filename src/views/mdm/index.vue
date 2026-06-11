<template>
  <div class="mdm-app">
    <!-- 独立应用顶栏（仿 EAM 顶栏） -->
    <div class="mdm-appbar">
      <div class="mdm-appbar-left">
        <div class="mdm-appbar-logo">
          <span class="mdm-app-icon">
            <Icon icon="ep:files" :size="18" color="#fff" />
          </span>
          <div class="mdm-appbar-title">
            <span class="title-main">MDM 主数据管理</span>
          </div>
        </div>
      </div>
      <div class="mdm-appbar-right">
        <el-tooltip content="数据同步状态">
          <span class="mdm-appbar-status">
            <span class="dot dot-green"></span>
            金蝶云星空 已连接
          </span>
        </el-tooltip>
        <el-tooltip content="通知">
          <el-badge :value="syncFailCount" :max="99">
            <Icon icon="ep:bell" :size="18" color="#fff" />
          </el-badge>
        </el-tooltip>
        <el-dropdown trigger="click">
          <span class="mdm-appbar-user">
            <el-avatar :size="28" :src="userAvatar" />
            <span>{{ userNickname }}</span>
            <Icon icon="ep:arrow-down" :size="12" color="#fff" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onAction('个人中心', '已打开个人中心')">
                <Icon icon="ep:user" :size="14" /> 个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="onAction('系统设置', '已打开系统设置')">
                <Icon icon="ep:setting" :size="14" /> 系统设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="onLogout">
                <Icon icon="ep:switch-button" :size="14" /> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <a class="mdm-appbar-back" @click="onBackPortal">
          <Icon icon="ep:back" :size="14" /> 返回门户
        </a>
      </div>
    </div>

    <!-- 主体区 -->
    <div class="mdm-page">
      <!-- 双 Tab：静态主数据 / 业务单据 -->
      <div class="mdm-tabs">
        <div
          class="mdm-tab"
          :class="{ active: activeTab === 'static' }"
          @click="activeTab = 'static'"
        >
          <Icon icon="ep:coin" :size="15" />
          静态主数据（基础资料）
          <span class="mdm-tab-count">{{ staticTotal }}</span>
        </div>
        <div
          class="mdm-tab"
          :class="{ active: activeTab === 'biz' }"
          @click="activeTab = 'biz'"
        >
          <Icon icon="ep:tickets" :size="15" />
          业务单据（动态数据 · 主子表）
          <span class="mdm-tab-count">{{ bizDocs.length }}</span>
        </div>
        <div class="mdm-tabs-right">
          <el-button type="primary" plain size="small" :icon="Refresh" @click="onSyncErp">
            从 ERP 同步主数据
          </el-button>
        </div>
      </div>

      <StaticPanel v-if="activeTab === 'static'" />
      <BizDocPanel v-else />
    </div>

    <!-- ERP 同步进度对话框 -->
    <el-dialog
      v-model="syncVisible"
      title="从 ERP 同步主数据"
      width="480"
      :close-on-click-modal="false"
      :show-close="!syncing"
    >
      <div class="mdm-sync">
        <el-radio-group v-model="syncSource" :disabled="syncing">
          <el-radio value="ERP">金蝶云星空 ERP</el-radio>
          <el-radio value="SRM">SRM 系统</el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="syncDomains" :disabled="syncing" style="margin-top: 16px">
          <el-checkbox v-for="c in staticCategories" :key="c.key" :value="c.key">{{ c.name }}</el-checkbox>
        </el-checkbox-group>
        <el-progress
          v-if="syncing || syncProgress === 100"
          :percentage="syncProgress"
          :status="syncProgress === 100 ? 'success' : ''"
          style="margin-top: 18px"
        />
        <div v-if="syncMsg" class="mdm-sync-msg">{{ syncMsg }}</div>
      </div>
      <template #footer>
        <el-button :disabled="syncing" @click="syncVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="syncing"
          :disabled="syncing || syncDomains.length === 0"
          @click="startSync"
        >{{ syncing ? '同步中…' : '开始同步' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import { Icon } from '@/components/Icon'
import { useRouter } from 'vue-router'
import * as authUtil from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import defaultAvatar from '@/assets/imgs/unitree-g1.png'
import { staticCategories } from './static-data'
import { bizDocs } from './biz-doc-data'
import StaticPanel from './components/StaticPanel.vue'
import BizDocPanel from './components/BizDocPanel.vue'

defineOptions({ name: 'MdmApp' })

const router = useRouter()
const userStore = useUserStore()
const userAvatar = computed(() => userStore.user?.avatar || defaultAvatar)
const userNickname = computed(() => userStore.user?.nickname || '宇树科技')

const activeTab = ref<'static' | 'biz'>('static')

const onBackPortal = () => {
  router.push('/index')
}

const onLogout = () => {
  ElMessageBox.confirm('确定要退出 MDM 主数据管理并清除登录态吗？', '退出登录', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      authUtil.removeToken()
      location.href = '/login'
    })
    .catch(() => {})
}

// 统计
const staticTotal = staticCategories.reduce((s, c) => s + c.rows.length, 0)
const syncFailCount = bizDocs.filter((d) => d.syncStatus === '同步失败').length

// 通用操作（toast）
const onAction = (name: string, msg?: string) => {
  ElMessage.success(msg || `已执行：${name}`)
}

// ERP 同步
const syncVisible = ref(false)
const syncSource = ref('ERP')
const syncDomains = ref(['material', 'bom'])
const syncing = ref(false)
const syncProgress = ref(0)
const syncMsg = ref('')

const onSyncErp = () => {
  syncVisible.value = true
  syncing.value = false
  syncProgress.value = 0
  syncMsg.value = ''
}

const startSync = () => {
  syncing.value = true
  syncProgress.value = 0
  syncMsg.value = '正在连接 ' + syncSource.value + '...'
  const timer = setInterval(() => {
    syncProgress.value += Math.floor(Math.random() * 18) + 8
    if (syncProgress.value >= 100) {
      syncProgress.value = 100
      clearInterval(timer)
      syncing.value = false
      const names = syncDomains.value
        .map((k) => staticCategories.find((c) => c.key === k)?.name || k)
        .join('、')
      syncMsg.value = `同步完成：${names}`
      setTimeout(() => {
        syncVisible.value = false
        ElMessage.success(`从 ${syncSource.value} 同步成功，共更新 ${syncDomains.value.length} 个数据域`)
      }, 1100)
    } else {
      syncMsg.value =
        '正在同步：' +
        syncDomains.value.map((k) => staticCategories.find((c) => c.key === k)?.name || k).join('、')
    }
  }, 280)
}
</script>

<style lang="scss" scoped>
.mdm-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  overflow: hidden;
}

/* ========== 独立应用顶栏 ========== */
.mdm-appbar {
  height: 56px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #001D44 0%, #00405C 50%, #1A5A70 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 29, 68, 0.18);
  position: relative;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(79, 172, 254, 0.05) 50%, transparent 100%);
    pointer-events: none;
  }
}

.mdm-appbar-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
}

.mdm-appbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mdm-app-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(79, 172, 254, 0.4);
}

.mdm-appbar-title {
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  .title-main {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.3px;
  }
}

.mdm-appbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mdm-appbar-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .dot-green {
    background: #52c41a;
    box-shadow: 0 0 6px #52c41a;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.mdm-appbar-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(79, 172, 254, 0.6);
    color: #fff;
  }
}

.mdm-appbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

/* ========== 主体页 ========== */
.mdm-page {
  flex: 1;
  min-height: 0;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
}

/* ========== 双 Tab（对齐设备管理 EAM 简洁页签风格）========== */
.mdm-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #fff;
  border-radius: 6px;
  padding: 0 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.mdm-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 16px 10px;
  font-size: 13.5px;
  color: #4b5563;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    color: #1677ff;
  }

  &.active {
    color: #1677ff;
    font-weight: 500;
    border-bottom-color: #1677ff;

    .mdm-tab-count {
      background: #e6f4ff;
      color: #1677ff;
    }
  }
}

.mdm-tab-count {
  font-size: 11px;
  font-family: Consolas, Monaco, monospace;
  background: #f1f5f9;
  color: #6b7280;
  border-radius: 10px;
  padding: 1px 8px;
}

.mdm-tabs-right {
  margin-left: auto;
}

.mdm-sync {
  font-size: 14px;
}

.mdm-sync-msg {
  margin-top: 8px;
  font-size: 12.5px;
  color: #6b7280;
}
</style>
