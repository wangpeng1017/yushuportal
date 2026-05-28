<template>
  <div class="home-wrapper">
    <!-- 顶部 Banner - 白色丝绸渐变 + 大数字统计 -->
    <div class="welcome-banner">
      <div class="banner-bg"></div>
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center justify-between relative z-1">
          <div class="flex items-center">
            <div class="avatar-ring">
              <el-avatar :src="avatar" :size="68">
                <img src="@/assets/imgs/avatar.png" alt="" />
              </el-avatar>
            </div>
            <div class="ml-20px welcome-text">
              <div class="text-22px font-700 text-[#1a2332] leading-tight">
                {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
              </div>
              <div class="mt-10px text-13px text-[#6b7785] flex items-center">
                <Icon icon="ep:calendar" class="mr-6px" />
                <span class="mr-16px">{{ currentDate }}</span>
                <Icon icon="ep:sunny" class="mr-6px" />
                <span>{{ t('workplace.toady') }}，20℃ - 32℃</span>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-56px banner-stats">
            <div class="stat-item">
              <div class="stat-label">我的待办</div>
              <div class="stat-value">{{ totalSate.todo }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">未读消息</div>
              <div class="stat-value">{{ totalSate.access }}</div>
            </div>
          </div>
        </div>
      </el-skeleton>
    </div>

    <el-row class="mt-12px" :gutter="12">
      <!-- 左侧：我的应用 + 我的任务 -->
      <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-12px">
        <!-- 我的应用 -->
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <span class="title-bar"></span>
                <Icon icon="ep:grid" :size="16" class="mr-6px" style="color: #2196f3" />
                我的应用
              </span>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <div class="app-grid">
              <div
                v-for="item in shortcut"
                :key="item.name"
                class="app-card"
                @click="handleShortcutClick(item.url)"
              >
                <div class="app-icon" :style="{ background: item.color }">
                  <Icon :icon="item.icon" :size="22" color="#ffffff" />
                </div>
                <div class="app-name">{{ item.name }}</div>
                <div class="app-desc">{{ item.desc }}</div>
              </div>
            </div>
          </el-skeleton>
        </el-card>

        <!-- 我的任务 -->
        <el-card shadow="never" class="section-card mt-12px">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <span class="title-bar"></span>
                <Icon icon="ep:tickets" :size="16" class="mr-6px" style="color: #2196f3" />
                我的任务
              </span>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <el-tabs v-model="taskTab" class="task-tabs">
              <el-tab-pane label="我的待办" name="pending">
                <div class="task-list">
                  <div v-for="item in tasks" :key="item.id" class="task-row">
                    <div class="flex-1 min-w-0">
                      <div class="task-title">{{ item.title }}</div>
                      <div class="task-meta">
                        <span>发起人：{{ item.creator }}</span>
                        <span class="ml-12px">{{ item.time }}</span>
                      </div>
                    </div>
                    <el-button type="primary" size="small" round>处理</el-button>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="我的已办" name="done">
                <el-empty description="暂无已办" :image-size="80" />
              </el-tab-pane>
              <el-tab-pane label="我的发起" name="initiated">
                <el-empty description="暂无发起" :image-size="80" />
              </el-tab-pane>
            </el-tabs>
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 右侧：常用菜单 + 消息公告 + 帮助文档 -->
      <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-12px">
        <!-- 常用菜单 -->
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <span class="title-bar"></span>
                <Icon icon="ep:menu" :size="16" class="mr-6px" style="color: #2196f3" />
                常用菜单
              </span>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <div class="quick-menu-grid">
              <div
                v-for="item in quickMenu"
                :key="item.name"
                class="quick-menu-item"
                @click="handleShortcutClick(item.url)"
              >
                <div class="quick-icon" :style="{ background: item.color }">
                  <Icon :icon="item.icon" :size="16" color="#ffffff" />
                </div>
                <span class="quick-name">{{ item.name }}</span>
              </div>
            </div>
          </el-skeleton>
        </el-card>

        <!-- 消息公告 -->
        <el-card shadow="never" class="section-card mt-12px">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <span class="title-bar"></span>
                <Icon icon="ep:bell" :size="16" class="mr-6px" style="color: #2196f3" />
                消息公告
              </span>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <el-tabs v-model="noticeTab" class="task-tabs">
              <el-tab-pane label="消息" name="message">
                <div class="notice-list">
                  <div v-for="(item, idx) in notice" :key="idx" class="notice-item">
                    <div class="notice-dot"></div>
                    <div class="flex-1 min-w-0">
                      <div class="notice-title">{{ item.title }}</div>
                      <div class="notice-meta">{{ item.type }}</div>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane label="公告" name="notice">
                <el-empty description="暂无公告" :image-size="80" />
              </el-tab-pane>
            </el-tabs>
          </el-skeleton>
        </el-card>

        <!-- 帮助文档 -->
        <el-card shadow="never" class="section-card mt-12px">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <span class="title-bar"></span>
                <Icon icon="ep:document" :size="16" class="mr-6px" style="color: #2196f3" />
                帮助文档
              </span>
            </div>
          </template>
          <el-skeleton :loading="loading" animated>
            <div class="help-list">
              <div class="help-item">
                <Icon icon="ep:guide" :size="18" class="mr-8px" style="color: #2196f3" />
                <span>系统使用入门指南</span>
              </div>
              <div class="help-item">
                <Icon icon="ep:question-filled" :size="18" class="mr-8px" style="color: #2196f3" />
                <span>常见问题解答</span>
              </div>
              <div class="help-item">
                <Icon icon="ep:video-play" :size="18" class="mr-8px" style="color: #2196f3" />
                <span>视频教程</span>
              </div>
            </div>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useRouter } from 'vue-router'

defineOptions({ name: 'Index' })

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname

const taskTab = ref('pending')
const noticeTab = ref('message')

const currentDate = computed(() => {
  const now = new Date()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`
})

const totalSate = reactive({
  project: 40,
  access: 456,
  todo: 2
})

const shortcut = reactive([
  { name: '智造门户', desc: '这里是制造门户的介绍', icon: 'ep:monitor', color: 'var(--app-icon-bg-blue)', url: '/' },
  { name: '智造一体化', desc: '生产一体化管理', icon: 'ep:set-up', color: 'var(--app-icon-bg-cyan)', url: '/' },
  { name: '智造低代码', desc: '低代码平台', icon: 'ep:edit-pen', color: 'var(--app-icon-bg-orange)', url: '/' },
  { name: 'WMS仓储管理', desc: '智能仓储物流', icon: 'ep:office-building', color: 'var(--app-icon-bg-green)', url: '/' },
  { name: 'IOT物联平台', desc: '设备互联互通', icon: 'ep:share', color: 'var(--app-icon-bg-purple)', url: '/' },
  { name: 'DIP数据集成', desc: '异构系统数据集成', icon: 'ep:data-line', color: 'var(--app-icon-bg-blue)', url: '/' },
  { name: '图表编辑器', desc: '低代码图表编辑', icon: 'ep:histogram', color: 'var(--app-icon-bg-cyan)', url: '/' },
  { name: '智慧安全', desc: '暂无描述', icon: 'ep:lock', color: 'var(--app-icon-bg-green)', url: '/' },
  { name: 'AI 大模型', desc: 'AI 智能体平台', icon: 'ep:cpu', color: 'var(--app-icon-bg-purple)', url: '/' },
  { name: '慧图云平台', desc: '数字孪生平台', icon: 'ep:box', color: 'var(--app-icon-bg-red)', url: '/' }
])

const quickMenu = reactive([
  { name: '物料档案维护', icon: 'ep:folder-opened', color: 'var(--app-icon-bg-blue)', url: '/' },
  { name: '排班管理', icon: 'ep:calendar', color: 'var(--app-icon-bg-red)', url: '/' },
  { name: '内部快捷测试', icon: 'ep:cpu', color: 'var(--app-icon-bg-green)', url: '/' },
  { name: '波次策略配置', icon: 'ep:set-up', color: 'var(--app-icon-bg-orange)', url: '/' }
])

const tasks = reactive([
  { id: 1, title: '领导审批', creator: '张三', time: '2026-03-10 10:30' },
  { id: 2, title: '领导审批', creator: '李四', time: '2026-03-10 10:30' },
  { id: 3, title: '领导审批', creator: '王五', time: '2026-03-10 10:30' }
])

const notice = reactive([
  { title: '系统支持 JDK 8/17/21，Vue 2/3', type: '技术兼容性' },
  { title: '后端提供 Spring Boot 2.7/3.2 + Cloud 双架构', type: '架构灵活性' },
  { title: '全部开源，个人与企业可 100% 直接使用，无需授权', type: '开源免授权' },
  { title: '国内使用最广泛的快速开发平台，远超 10w+ 企业使用', type: '广泛企业认可' }
])

const handleShortcutClick = (url: string) => {
  router.push(url)
}

setTimeout(() => {
  loading.value = false
}, 300)
</script>

<style lang="scss" scoped>
.home-wrapper {
  padding: 4px;
}

/* ========== 顶部欢迎 Banner - 白色丝绸渐变 ========== */
.welcome-banner {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f4f7fb 50%, #eef2f8 100%);
  border-radius: var(--border-radius-base);
  padding: 22px 32px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color-light);
  min-height: 120px;
}

.banner-bg {
  position: absolute;
  top: 0;
  right: 0;
  width: 60%;
  height: 100%;
  background:
    radial-gradient(ellipse at top right, rgba(255, 255, 255, 0.85) 0%, transparent 60%),
    linear-gradient(120deg, transparent 0%, rgba(186, 215, 250, 0.18) 50%, rgba(255, 255, 255, 0.6) 100%);
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: -20%;
    right: -10%;
    width: 80%;
    height: 140%;
    background: linear-gradient(70deg, transparent 30%, rgba(255, 255, 255, 0.7) 50%, transparent 70%);
    transform: rotate(-15deg);
  }

  &::after {
    content: '';
    position: absolute;
    top: 10%;
    right: 5%;
    width: 60%;
    height: 110%;
    background: linear-gradient(80deg, transparent 35%, rgba(33, 150, 243, 0.06) 50%, transparent 65%);
    transform: rotate(-8deg);
  }
}

.avatar-ring {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #e8f1fb 100%);
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(33, 150, 243, 0.12);
  flex-shrink: 0;
}

.banner-stats {
  padding-right: 16px;
}

.stat-item {
  text-align: center;

  .stat-label {
    font-size: 13px;
    color: #6b7785;
    margin-bottom: 6px;
    font-weight: 500;
  }

  .stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1a2332;
    line-height: 1;
    font-family: -apple-system, 'Helvetica Neue', sans-serif;
  }
}

/* ========== 通用区块卡片 ========== */
.section-card {
  border-radius: var(--border-radius-base);

  :deep(.el-card__header) {
    padding: 14px 20px;
    border-bottom: 1px solid var(--border-color-light);
  }

  :deep(.el-card__body) {
    padding: 20px;
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #1a2332;
}

.title-bar {
  width: 3px;
  height: 14px;
  background: linear-gradient(to bottom, #42a5f5, #1976d2);
  border-radius: 2px;
  margin-right: 10px;
}

/* ========== 我的应用 - 网格 ========== */
.app-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.app-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background-color: #f5f9ff;
    transform: translateY(-2px);
  }
}

.app-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.app-name {
  font-size: 13px;
  font-weight: 600;
  color: #1a2332;
  text-align: center;
  margin-bottom: 4px;
}

.app-desc {
  font-size: 11px;
  color: #8a93a0;
  text-align: center;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

/* ========== 任务模块 ========== */
.task-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
    background-color: var(--border-color-light);
  }
}

.task-list {
  min-height: 240px;
}

.task-row {
  display: flex;
  align-items: center;
  padding: 14px 16px;
  border-radius: 10px;
  background-color: #f7f9fc;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:hover {
    background-color: #eff5ff;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a2332;
}

.task-meta {
  font-size: 12px;
  color: #8a93a0;
  margin-top: 4px;
}

/* ========== 常用菜单 ========== */
.quick-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.quick-menu-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f9ff;
  }
}

.quick-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  flex-shrink: 0;
}

.quick-name {
  font-size: 13px;
  color: #1a2332;
  font-weight: 500;
}

/* ========== 消息列表 ========== */
.notice-list {
  min-height: 180px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 0;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    .notice-title {
      color: var(--primary-color);
    }
  }

  &:not(:last-child) {
    border-bottom: 1px dashed var(--border-color-light);
  }
}

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: var(--primary-color);
  margin-top: 8px;
  margin-right: 10px;
  flex-shrink: 0;
}

.notice-title {
  font-size: 13px;
  color: #1a2332;
  line-height: 1.5;
  transition: color 0.2s;
}

.notice-meta {
  font-size: 11px;
  color: #8a93a0;
  margin-top: 4px;
}

/* ========== 帮助文档 ========== */
.help-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.help-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  color: #1a2332;
  transition: all 0.2s;

  &:hover {
    background-color: #f5f9ff;
    color: var(--primary-color);
  }
}

/* 响应式 */
@media (max-width: 1024px) {
  .app-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 768px) {
  .app-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .banner-stats {
    display: none !important;
  }
}
</style>
