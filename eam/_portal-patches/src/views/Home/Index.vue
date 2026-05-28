<template>
  <div class="ut-home">
    <!-- 顶部欢迎横幅 -->
    <div class="ut-banner">
      <!-- 流光丝带装饰 -->
      <svg class="ut-banner-deco" viewBox="0 0 1200 200" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="utRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
            <stop offset="40%" stop-color="#ffffff" stop-opacity="0.85" />
            <stop offset="60%" stop-color="#dbe6f0" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
          <linearGradient id="utRibbon2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
            <stop offset="50%" stop-color="#c5d6e6" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M -50 150 Q 350 60, 700 130 T 1300 100" stroke="url(#utRibbon)" stroke-width="2.5" fill="none" />
        <path d="M -50 110 Q 400 40, 750 95 T 1300 70" stroke="url(#utRibbon)" stroke-width="1.5" fill="none" opacity="0.7" />
        <path d="M 200 170 Q 600 80, 1000 150 T 1300 130" stroke="url(#utRibbon2)" stroke-width="2" fill="none" />
        <path d="M -50 80 Q 500 30, 900 70 T 1300 50" stroke="url(#utRibbon2)" stroke-width="1" fill="none" opacity="0.6" />
      </svg>
      <div class="ut-banner-left">
        <div class="ut-avatar">
          <img src="@/assets/imgs/unitree-g1.png" alt="UNITREE G1" />
        </div>
        <div class="ut-greeting">
          <div class="ut-greeting-title">
            你好，<span class="hl">{{ username }}</span> 祝你开心每一天
          </div>
          <div class="ut-greeting-sub">今日晴，20℃ - 32℃!</div>
        </div>
      </div>
      <div class="ut-banner-right">
        <div class="ut-stat">
          <div class="ut-stat-label">我的待办</div>
          <div class="ut-stat-num">{{ stats.todo }}</div>
        </div>
        <div class="ut-stat">
          <div class="ut-stat-label">未读消息</div>
          <div class="ut-stat-num">{{ stats.unread }}</div>
        </div>
      </div>
    </div>

    <div class="ut-grid">
      <!-- 左主列 -->
      <div class="ut-main-col">
        <!-- 我的应用 -->
        <div class="ut-card">
          <div class="ut-card-header">
            <span class="ut-card-icon">
              <Icon icon="ep:menu" :size="16" color="#1890FF" />
            </span>
            <span class="ut-card-title">我的应用</span>
          </div>
          <div class="ut-app-grid">
            <div v-for="app in apps" :key="app.name" class="ut-app-item" @click="onAppClick(app)">
              <div class="ut-app-icon" :style="{ background: app.bg }">
                <Icon :icon="app.icon" :size="28" color="#fff" />
              </div>
              <div class="ut-app-name">{{ app.name }}</div>
              <div class="ut-app-desc">{{ app.desc }}</div>
            </div>
          </div>
        </div>

        <!-- 我的任务 -->
        <div class="ut-card">
          <div class="ut-card-header">
            <span class="ut-card-icon">
              <Icon icon="ep:document" :size="16" color="#1890FF" />
            </span>
            <span class="ut-card-title">我的任务</span>
          </div>
          <el-tabs v-model="activeTab" class="ut-tabs">
            <el-tab-pane label="我的待办" name="todo" />
            <el-tab-pane label="我的已办" name="done" />
            <el-tab-pane label="我的发起" name="my" />
          </el-tabs>
          <div class="ut-task-list">
            <div v-for="task in currentTasks" :key="task.id" class="ut-task-item">
              <div class="ut-task-info">
                <div class="ut-task-title">{{ task.title }}</div>
                <div class="ut-task-meta">发起人：{{ task.applicant }}</div>
              </div>
              <button class="ut-task-btn">{{ task.btnText }}</button>
            </div>
            <div v-if="currentTasks.length === 0" class="ut-empty-text">暂无任务</div>
          </div>
        </div>
      </div>

      <!-- 右侧列 -->
      <div class="ut-side-col">
        <!-- 常用菜单 -->
        <div class="ut-card">
          <div class="ut-card-header">
            <span class="ut-card-icon">
              <Icon icon="ep:menu" :size="16" color="#1890FF" />
            </span>
            <span class="ut-card-title">常用菜单</span>
          </div>
          <div class="ut-shortcut-grid">
            <div v-for="s in shortcuts" :key="s.name" class="ut-shortcut-item">
              <div class="ut-shortcut-icon" :style="{ background: s.bg }">
                <Icon :icon="s.icon" :size="16" color="#fff" />
              </div>
              <span>{{ s.name }}</span>
            </div>
          </div>
        </div>

        <!-- 消息公告 -->
        <div class="ut-card">
          <div class="ut-card-header">
            <span class="ut-card-icon">
              <Icon icon="ep:chat-line-square" :size="16" color="#1890FF" />
            </span>
            <span class="ut-card-title">消息公告</span>
          </div>
          <el-tabs v-model="msgTab" class="ut-tabs">
            <el-tab-pane label="消息" name="msg" />
            <el-tab-pane label="公告" name="announce" />
          </el-tabs>
          <div class="ut-empty-text">暂无{{ msgTab === 'msg' ? '消息' : '公告' }}</div>
        </div>

        <!-- 帮助文档 -->
        <div class="ut-card">
          <div class="ut-card-header">
            <span class="ut-card-icon">
              <Icon icon="ep:reading" :size="16" color="#1890FF" />
            </span>
            <span class="ut-card-title">帮助文档</span>
          </div>
          <div class="ut-empty-text">暂无文档</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { Icon } from '@/components/Icon'

defineOptions({ name: 'Index' })

const userStore = useUserStore()
const username = computed(() => userStore.getUser?.nickname || '宇树科技')

const stats = reactive({ todo: 2, unread: 456 })

const apps = [
  { name: 'MES生产管理', desc: '生产执行系统', icon: 'ep:cpu', bg: 'linear-gradient(135deg,#4FACFE,#00F2FE)', url: '/mes.html?v=20260508' },
  { name: 'WMS仓储管理', desc: '智能仓储物流', icon: 'ep:office-building', bg: 'linear-gradient(135deg,#5F72BD,#9B23EA)', url: 'http://zjx.iampmer.com/wms/' },
  { name: 'QMS质量管理', desc: '全流程质量管控', icon: 'ep:medal', bg: 'linear-gradient(135deg,#43E97B,#38F9D7)', url: 'http://8.130.182.148:3011/qms/IQC.html' },
  { name: 'EAM设备管理', desc: '设备资产全生命周期', icon: 'ep:tools', bg: 'linear-gradient(135deg,#FA709A,#FEE140)', url: 'http://8.130.182.148:3010/index?v=20260508' },
  { name: 'EHS安环管理', desc: '安全环保健康', icon: 'ep:lock', bg: 'linear-gradient(135deg,#11998E,#38EF7D)', url: 'http://zjx.iampmer.com/ehs/' },
  { name: 'MDM主数据管理', desc: '企业主数据治理', icon: 'ep:files', bg: 'linear-gradient(135deg,#667EEA,#764BA2)' },
  { name: 'IoT平台', desc: '设备互联互通', icon: 'ep:link', bg: 'linear-gradient(135deg,#FF6A00,#EE0979)' },
  { name: '数据集成平台', desc: '异构系统数据集成', icon: 'ep:share', bg: 'linear-gradient(135deg,#13547A,#80D0C7)' },
  { name: 'AI智能体', desc: '智能决策与对话', icon: 'ep:promotion', bg: 'linear-gradient(135deg,#A18CD1,#FBC2EB)' }
]

const shortcuts = [
  { name: '物料档案维护', icon: 'ep:files', bg: '#1890FF' },
  { name: '排班管理', icon: 'ep:calendar', bg: '#FF4D4F' },
  { name: '内部快捷测试', icon: 'ep:check', bg: '#52C41A' },
  { name: '波次策略配置', icon: 'ep:guide', bg: '#FAAD14' }
]

const activeTab = ref('todo')
const msgTab = ref('msg')

const todoTasks = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: '领导审批',
  applicant: '2026-03-10 10:30',
  btnText: '处理'
}))
const doneTasks: typeof todoTasks = []
const myTasks: typeof todoTasks = []

const currentTasks = computed(() => {
  if (activeTab.value === 'todo') return todoTasks
  if (activeTab.value === 'done') return doneTasks
  return myTasks
})

const onAppClick = (app: any) => {
  if (app.url) {
    window.open(app.url, '_blank', 'noopener,noreferrer')
  }
}
</script>

<style lang="scss" scoped>
.ut-home {
  padding: 16px;
  background: #f4f5f7;
  min-height: calc(100vh - 84px);
}

.ut-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 132px;
  background:
    linear-gradient(120deg, #f0f3f7 0%, #e6ecf2 50%, #d8e2eb 100%);
  border-radius: 8px;
  padding: 0 32px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 70%;
    background: radial-gradient(ellipse at 70% 50%, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }
}

.ut-banner-deco {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.ut-banner-left {
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 1;
}

.ut-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  background: #d1d5db;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 70% 30%; /* 偏右上：让机器人头部出现在头像右上区域 */
  }
}

.ut-greeting-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.ut-greeting-sub {
  font-size: 13px;
  color: #6b7280;
}

.ut-banner-right {
  display: flex;
  gap: 64px;
  z-index: 1;
}

.ut-stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 6px;
}

.ut-stat-num {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.ut-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 16px;
}

.ut-main-col,
.ut-side-col {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ut-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
}

.ut-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.ut-card-icon {
  display: inline-flex;
}

.ut-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.ut-app-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px 16px;
  padding: 8px 0;
}

.ut-app-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.15s;

  &:hover {
    transform: translateY(-2px);
  }
}

.ut-app-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.18);
}

.ut-app-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.ut-app-desc {
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
}

.ut-task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ut-task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: linear-gradient(90deg, #eef4fa 0%, #f6f9fc 100%);
  border-radius: 6px;
}

.ut-task-info {
  flex: 1;
}

.ut-task-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.ut-task-meta {
  font-size: 12px;
  color: #9ca3af;
}

.ut-task-btn {
  background: linear-gradient(135deg, #4facfe 0%, #1890ff 100%);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 6px 16px;
  font-size: 13px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    opacity: 0.9;
  }
}

.ut-shortcut-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.ut-shortcut-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #1f2937;
  cursor: pointer;
}

.ut-shortcut-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

:deep(.ut-tabs .el-tabs__header) {
  margin-bottom: 12px;
}

:deep(.ut-tabs .el-tabs__nav-wrap::after) {
  height: 1px;
  background: #f0f0f0;
}

:deep(.ut-tabs .el-tabs__item) {
  font-size: 14px;
}

:deep(.ut-tabs .el-tabs__item.is-active) {
  color: #1890ff;
  font-weight: 600;
}

:deep(.ut-tabs .el-tabs__active-bar) {
  background: #1890ff;
}

.ut-empty-text {
  text-align: center;
  color: #9ca3af;
  font-size: 13px;
  padding: 32px 0;
}
</style>
