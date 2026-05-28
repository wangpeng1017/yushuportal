<template>
  <div>
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <el-skeleton :loading="loading" animated>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="logo-circle">
              <img src="@/assets/imgs/huixin_logo1.svg" alt="Logo" class="logo-img" />
            </div>
            <div class="welcome-text ml-16px">
              <div class="text-22px font-bold">
                你好，慧新全智，祝你开心每一天！
              </div>
              <div class="mt-8px text-13px flex items-center">
                <Icon icon="ep:calendar" class="mr-6px" />
                <span class="mr-16px">{{ currentDate }}</span>
                <!-- <Icon icon="ep:sunny" class="mr-6px" />
                <span>今日晴,20℃ - 32℃</span> -->
              </div>
            </div>
          </div>
          <div class="flex items-center gap-60px">
            <div class="stat-item">
              <div class="stat-label">我的待办</div>
              <CountTo
                class="stat-value"
                :start-val="0"
                :end-val="totalSate.todo"
                :duration="2600"
              />
            </div>
            <div class="stat-item">
              <div class="stat-label">未读消息</div>
              <CountTo
                class="stat-value"
                :start-val="0"
                :end-val="totalSate.access"
                :duration="2600"
              />
            </div>
          </div>
        </div>
      </el-skeleton>
    </div>
  </div>

  <el-row class="mt-8px" :gutter="8" justify="space-between">
    <!-- 左侧区域: 我的应用 + 我的待办 -->
    <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 我的应用 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center">
              <Icon icon="ep:grid" :size="16" class="mr-8px" style="color: #0097BA" />
              <span>{{ t('workplace.project') }}</span>
            </div>
            <!-- <el-link
              type="primary"
              :underline="false"
              href="https://github.com/yudaocode"
              target="_blank"
            >
              {{ t('action.more') }}
            </el-link> -->
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <div 
            class="carousel-wrapper" 
            :class="{ 
              'hide-left-arrow': currentPage === 0, 
              'hide-right-arrow': currentPage === projectPages.length - 1 
            }"
          >
            <el-carousel
              ref="carouselRef"
              :interval="5000"
              :arrow="projectPages.length > 1 ? 'always' : 'never'"
              indicator-position="none"
              height="215px"
              @change="handleCarouselChange"
            >
            <el-carousel-item v-for="(page, pageIndex) in projectPages" :key="`page-${pageIndex}`">
              <el-row :gutter="16" class="project-grid">
                <el-col
                  v-for="(item, index) in page"
                  :key="`card-${index}`"
                  :span="4"
                  class="mb-16px"
                >
                  <div
                    class="project-item cursor-pointer"
                    @click="handleProjectClick(item.redirectUris[0])"
                  >
                    <div class="project-icon-wrapper">
                      <img :src="item.logo" alt="" class="w-full h-full" />
                    </div>
                    <div class="project-name mt-8px text-13px">{{ item.name }}</div>
                    <div class="project-description mt-4px text-11px">{{ item.description || '暂无描述' }}</div>
                  </div>
                </el-col>
              </el-row>
            </el-carousel-item>
          </el-carousel>
          </div>
          <div class="carousel-indicator">
            <span
              v-for="(page, index) in projectPages"
              :key="`indicator-${index}`"
              class="indicator-dot"
              :class="{ active: currentPage === index }"
              @click="handleIndicatorClick(index)"
            ></span>
          </div>
        </el-skeleton>
      </el-card>

      <!-- 我的待办 -->
      <el-card shadow="never" class="mt-8px">
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center">
              <Icon icon="ep:calendar" :size="16" class="mr-8px" style="color: #0097BA" />
              <span class="text-16px font-bold">我的任务</span>
            </div>
            <div>
              <el-link type="primary" :underline="false" @click="handleMoreTasks">
                {{ t('action.more') }}
              </el-link>
            </div>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <el-tabs v-model="taskActiveTab" class="task-tabs">
            <el-tab-pane label="我的待办" name="pending">
              <div class="task-list">
                <div
                  v-for="item in currentTaskList"
                  :key="item.id"
                  class="task-item"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="task-title">
                        <el-tag :type="getTaskTypeColor(item.type)" size="small" class="mr-8px">
                          {{ item.type }}
                        </el-tag>
                        <span>{{ item.title }}</span>
                      </div>
                      <div class="task-content mt-6px text-12px text-gray-500">
                        {{ item.content }}
                      </div>
                      <div class="mt-6px text-11px text-gray-400">
                        <span>发起人: {{ item.creator }}</span>
                        <el-divider direction="vertical" />
                        <span>{{ item.createTime ? formatTime(item.createTime, 'yyyy-MM-dd HH:mm') : '-' }}</span>
                      </div>
                    </div>
                    <div class="task-actions ml-12px">
                      <el-button class="custom-primary-btn" size="small" @click="handleTaskAction(item, 'approve')">
                        处理
                      </el-button>
                    </div>
                  </div>
                  <el-divider class="my-8px" />
                </div>
                <el-empty v-if="currentTaskList.length === 0" description="暂无待办" :image-size="80" />
              </div>
              <div v-if="currentTaskTotal > 0" class="flex justify-end mt-12px">
                <el-pagination
                  v-model:current-page="taskPagination.page"
                  v-model:page-size="taskPagination.size"
                  :total="currentTaskTotal"
                  :page-sizes="[5, 10, 20]"
                  layout="total, sizes, prev, pager, next"
                  small
                  @current-change="handleTaskPageChange"
                  @size-change="handleTaskSizeChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的已办" name="completed">
              <div class="task-list">
                <div
                  v-for="item in currentTaskList"
                  :key="item.id"
                  class="task-item"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="task-title">
                        <el-tag :type="getTaskTypeColor(item.type)" size="small" class="mr-8px">
                          {{ item.type }}
                        </el-tag>
                        <span>{{ item.title }}</span>
                      </div>
                      <div class="task-content mt-6px text-12px text-gray-500">
                        {{ item.content }}
                      </div>
                      <div class="mt-6px text-11px text-gray-400">
                        <span>处理时间: {{ item.handleTime ? formatTime(item.handleTime, 'yyyy-MM-dd HH:mm') : '-' }}</span>
                        <el-divider direction="vertical" />
                        <el-tag
                          :type="item.result === 'approved' ? 'success' : 'danger'"
                          size="small"
                        >
                          {{ item.result === 'approved' ? '已同意' : '已拒绝' }}
                        </el-tag>
                      </div>
                    </div>
                    <div class="task-actions ml-12px">
                      <el-button type="default" size="small" @click="handleTaskAction(item, 'view')">
                        查看
                      </el-button>
                    </div>
                  </div>
                  <el-divider class="my-8px" />
                </div>
                <el-empty v-if="currentTaskList.length === 0" description="暂无已办" :image-size="80" />
              </div>
              <div v-if="currentTaskTotal > 0" class="flex justify-end mt-12px">
                <el-pagination
                  v-model:current-page="taskPagination.page"
                  v-model:page-size="taskPagination.size"
                  :total="currentTaskTotal"
                  :page-sizes="[5, 10, 20]"
                  layout="total, sizes, prev, pager, next"
                  small
                  @current-change="handleTaskPageChange"
                  @size-change="handleTaskSizeChange"
                />
              </div>
            </el-tab-pane>
            
            <el-tab-pane label="我的发起" name="initiated">
              <div class="task-list">
                <div
                  v-for="item in currentTaskList"
                  :key="item.id"
                  class="task-item"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="task-title">
                        <el-tag :type="getTaskTypeColor(item.type)" size="small" class="mr-8px">
                          {{ item.type }}
                        </el-tag>
                        <span>{{ item.title }}</span>
                      </div>
                      <div class="task-content mt-6px text-12px text-gray-500">
                        {{ item.content }}
                      </div>
                      <div class="mt-6px text-11px text-gray-400">
                        <span>当前处理人: {{ item.currentHandler || '无' }}</span>
                        <el-divider direction="vertical" />
                        <el-tag
                          :type="item.status === 'pending' ? 'warning' : item.status === 'approved' ? 'success' : 'info'"
                          size="small"
                        >
                          {{ getTaskStatusText(item.status) }}
                        </el-tag>
                        <el-divider direction="vertical" />
                        <span>{{ item.createTime ? formatTime(item.createTime, 'yyyy-MM-dd HH:mm') : '-' }}</span>
                      </div>
                    </div>
                    <div class="task-actions ml-12px">
                      <el-button type="default" size="small" @click="handleTaskAction(item, 'view')">
                        查看
                      </el-button>
                    </div>
                  </div>
                  <el-divider class="my-8px" />
                </div>
                <el-empty v-if="currentTaskList.length === 0" description="暂无发起" :image-size="80" />
              </div>
              <div v-if="currentTaskTotal > 0" class="flex justify-end mt-12px">
                <el-pagination
                  v-model:current-page="taskPagination.page"
                  v-model:page-size="taskPagination.size"
                  :total="currentTaskTotal"
                  :page-sizes="[5, 10, 20]"
                  layout="total, sizes, prev, pager, next"
                  small
                  @current-change="handleTaskPageChange"
                  @size-change="handleTaskSizeChange"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-skeleton>
      </el-card>
    </el-col>

    <!-- 右侧区域: 常用菜单 + 消息公告 + 帮助文档 -->
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px">
      <!-- 常用菜单 -->
      <el-card shadow="never">
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center">
              <Icon icon="ep:star" :size="16" class="mr-8px" style="color: #0097BA" />
              <span>{{ t('workplace.shortcutOperation') }}</span>
            </div>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <el-row :gutter="8">
            <el-col v-for="item in shortcut" :key="`team-${item.name}`" :xl="12" :lg="12" :md="12" :sm="12" :xs="24" class="mb-12px">
              <div class="shortcut-item flex items-center">
                <Icon :icon="item.icon" :size="18" class="mr-8px" style="color: #0097BA" />
                <el-link type="default" :underline="false" class="shortcut-link" @click="handleShortcutClick(item.url)">
                  {{ item.name }}
                </el-link>
              </div>
            </el-col>
          </el-row>
        </el-skeleton>
      </el-card>

      <!-- 消息公告 -->
      <el-card shadow="hover" class="mt-8px">
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center">
              <Icon icon="ep:bell" :size="16" class="mr-8px" style="color: #0097BA" />
              <span class="text-16px font-bold">消息公告</span>
            </div>
            <div>
              <el-link type="primary" :underline="false" @click="handleMoreNotice">
                {{ t('action.more') }}
              </el-link>
            </div>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <el-tabs v-model="messageNoticeTab" class="message-notice-tabs">
            <el-tab-pane label="消息" name="message">
              <div class="notice-content">
                <div
                  v-for="(item, index) in currentMessageList"
                  :key="`message-${index}`"
                  class="notice-item-card"
                  @click="handleNoticeClick(item, 'message')"
                >
                  <div class="flex items-start">
                    <el-tag
                      type="primary"
                      size="small"
                      class="notice-tag-small">
                      消息
                    </el-tag>
                    <div class="flex-1 ml-12px">
                      <div class="notice-title-small">
                        {{ item.title }}
                      </div>
                      <div class="mt-4px text-11px text-gray-400">
                        {{ formatTime(item.date, 'yyyy-MM-dd HH:mm') }}
                      </div>
                    </div>
                  </div>
                  <el-divider v-if="index < currentMessageList.length - 1" class="my-6px" />
                </div>
                <el-empty
                  v-if="currentMessageList.length === 0"
                  description="暂无消息"
                  :image-size="60"
                />
              </div>
              <div v-if="messageTotal > 0" class="flex justify-end mt-12px">
                <el-pagination
                  v-model:current-page="messagePagination.page"
                  v-model:page-size="messagePagination.size"
                  :total="messageTotal"
                  :page-sizes="[5, 10, 20]"
                  layout="total, sizes, prev, pager, next"
                  small
                  @current-change="handleMessagePageChange"
                  @size-change="handleMessageSizeChange"
                />
              </div>
            </el-tab-pane>

            <el-tab-pane label="公告" name="notice">
              <div class="notice-content">
                <div
                  v-for="(item, index) in currentNoticeList"
                  :key="`notice-${index}`"
                  class="notice-item-card"
                  @click="handleNoticeClick(item, 'notice')"
                >
                  <div class="flex items-start">
                    <el-tag
                      :type="item.noticeType === 'company' ? 'success' : 'warning'"
                      size="small"
                      class="notice-tag-small"
                    >
                      {{ item.noticeType === 'company' ? '企业' : '系统' }}
                    </el-tag>
                    <div class="flex-1 ml-12px">
                      <div class="notice-title-small">
                        {{ item.title }}
                      </div>
                      <div class="mt-4px text-11px text-gray-400">
                        {{ formatTime(item.date, 'yyyy-MM-dd HH:mm') }}
                      </div>
                    </div>
                  </div>
                  <el-divider v-if="index < currentNoticeList.length - 1" class="my-6px" />
                </div>
                <el-empty
                  v-if="currentNoticeList.length === 0"
                  description="暂无公告"
                  :image-size="60"
                />
              </div>
              <div v-if="noticeTotal > 0" class="flex justify-end mt-12px">
                <el-pagination
                  v-model:current-page="noticePagination.page"
                  v-model:page-size="noticePagination.size"
                  :total="noticeTotal"
                  :page-sizes="[5, 10, 20]"
                  layout="total, sizes, prev, pager, next"
                  small
                  @current-change="handleNoticePageChange"
                  @size-change="handleNoticeSizeChange"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-skeleton>
      </el-card>

      <!-- 帮助文档 -->
      <el-card shadow="hover" class="mt-8px">
        <template #header>
          <div class="card-header flex justify-between items-center">
            <div class="flex items-center">
              <Icon icon="ep:document" :size="16" class="mr-8px" style="color: #0097BA" />
              <span class="text-16px font-bold">帮助文档</span>
            </div>
            <div>
              <el-link type="primary" :underline="false" @click="handleMoreHelp">
                {{ t('action.more') }}
              </el-link>
            </div>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <div class="help-content">
            <div
              v-for="(item, index) in currentHelpDocList"
              :key="`help-${index}`"
              class="help-item"
            >
              <div class="flex items-start justify-between">
                <div class="flex items-start flex-1 cursor-pointer" @click="handleHelpClick(item)">
                  <Icon
                    :icon="item.icon"
                    :size="20"
                    style="color: #0097BA"
                    class="help-icon"
                  />
                  <div class="flex-1 ml-12px">
                    <div class="help-title">
                      {{ item.title }}
                    </div>
                    <div class="help-desc mt-4px text-12px text-gray-500">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
                <el-button
                  class="custom-primary-btn ml-12px"
                  size="small"
                  :icon="Download"
                  @click="handleDownloadHelp(item)"
                >
                  下载
                </el-button>
              </div>
              <el-divider v-if="index < currentHelpDocList.length - 1" class="my-8px" />
            </div>
            <el-empty v-if="currentHelpDocList.length === 0" description="暂无帮助文档" :image-size="60" />
          </div>
          <div v-if="helpDocList.length > 0" class="flex justify-end mt-12px">
            <el-pagination
              v-model:current-page="helpPagination.page"
              v-model:page-size="helpPagination.size"
              :total="helpDocList.length"
              :page-sizes="[5, 10, 20]"
              layout="total, sizes, prev, pager, next"
              small
              @current-change="handleHelpPageChange"
              @size-change="handleHelpSizeChange"
            />
          </div>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'
import { formatTime } from '@/utils'
import { Download } from '@element-plus/icons-vue'

import { useUserStore } from '@/store/modules/user'
// import { useWatermark } from '@/hooks/web/useWatermark'
import type { WorkplaceTotal, Project, Shortcut } from './types'

import * as ClientApi from '@/api/system/oauth2/client'

interface TaskItem {
  id: string
  title: string
  content: string
  type: string
  creator?: string
  currentHandler?: string
  createTime?: Date
  handleTime?: Date
  status?: 'pending' | 'approved' | 'rejected' | 'processing'
  result?: 'approved' | 'rejected'
}

interface Notice {
  title: string
  noticeType: 'company' | 'system'
  date: Date
}

interface Message {
  title: string
  date: Date
  type?: 'system' | 'user'
}

interface HelpDoc {
  title: string
  description: string
  icon: string
  color: string
  url?: string
}

import { pieOptions, barOptions } from './echarts-data'
import { useRouter } from 'vue-router'

defineOptions({ name: 'Index' })

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
// const { setWatermark } = useWatermark()
const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname
const pieOptionsData = reactive<EChartsOption>(pieOptions) as EChartsOption

// 获取当前日期和星期
const currentDate = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]
  return `${year}年${month}月${day}日${weekDay}`
})
// 获取统计数
let totalSate = reactive<WorkplaceTotal>({
  project: 0,
  access: 0,
  todo: 0
})

const getCount = async () => {
  const data = {
    project: 40,
    access: 2340,
    todo: 6
  }
  totalSate = Object.assign(totalSate, data)
}

// 获取项目数
let projects = reactive<Project[]>([])
// 获取应用列表
/** 查询列表 */
const getProject = async () => {
  loading.value = true
  try {
    const data = await ClientApi.getOAuth2ClientList({})
    projects = Object.assign(projects, data)
  } finally {
    loading.value = false
  }
}
// const getProject = async () => {
//   const data = [
//     {
//       name: '设备管理',
//       icon: 'icon-park-outline:mall-bag',
//       message: 'github.com/yudaocode/yudao-ui-mall-uniapp',
//       personal: 'Vue3 + uniapp 商城手机端',
//       time: new Date('2025-03-04'),
//       color: '#ff4d4f'
//     },
//     {
//       name: '仓储物流',
//       icon: 'material-symbols:cloud-outline',
//       message: 'github.com/YunaiV/yudao-cloud',
//       personal: 'Spring Cloud 微服务架构',
//       time: new Date('2025-04-05'),
//       color: '#1890ff'
//     },
//     {
//       name: '智能制造',
//       icon: 'devicon:antdesign',
//       message: 'github.com/yudaocode/yudao-ui-admin-vben',
//       personal: 'Vue3 + vben5(antd) 管理后台',
//       time: new Date('2025-05-06'),
//       color: '#e18525'
//     },
//     {
//       name: '质量管理',
//       icon: 'ant-design:mobile',
//       message: 'github.com/yudaocode/yudao-ui-admin-uniapp',
//       personal: 'Vue3 + uniapp 管理手机端',
//       time: new Date('2025-06-01'),
//       color: '#2979ff'
//     },
//     {
//       name: '订单管理',
//       icon: 'simple-icons:springboot',
//       message: 'github.com/YunaiV/ruoyi-vue-pro',
//       personal: 'Spring Boot 单体架构',
//       time: new Date('2025-01-02'),
//       color: '#6DB33F'
//     },
//     {
//       name: '物联平台',
//       icon: 'ep:element-plus',
//       message: 'github.com/yudaocode/yudao-ui-admin-vue3',
//       personal: 'Vue3 + element-plus 管理后台',
//       time: new Date('2025-02-03'),
//       color: '#409EFF'
//     },
//     {
//       name: '智慧月台',
//       icon: 'icon-park-outline:mall-bag',
//       message: 'github.com/yudaocode/yudao-ui-mall-uniapp',
//       personal: 'Vue3 + uniapp 商城手机端',
//       time: new Date('2025-03-04'),
//       color: '#ff4d4f'
//     },
//     {
//       name: '智能排产',
//       icon: 'material-symbols:cloud-outline',
//       message: 'github.com/YunaiV/yudao-cloud',
//       personal: 'Spring Cloud 微服务架构',
//       time: new Date('2025-04-05'),
//       color: '#1890ff'
//     },
//     {
//       name: '供应商协同',
//       icon: 'devicon:antdesign',
//       message: 'github.com/yudaocode/yudao-ui-admin-vben',
//       personal: 'Vue3 + vben5(antd) 管理后台',
//       time: new Date('2025-05-06'),
//       color: '#e18525'
//     },
//     {
//       name: '采购中心',
//       icon: 'ant-design:mobile',
//       message: 'github.com/yudaocode/yudao-ui-admin-uniapp',
//       personal: 'Vue3 + uniapp 管理手机端',
//       time: new Date('2025-06-01'),
//       color: '#2979ff'
//     },
//   ]
//   projects = Object.assign(projects, data)
// }

// 获取帮助文档
let helpDocList = reactive<HelpDoc[]>([])

const getHelpDoc = async () => {
  const data = [
    {
      title: '快速入门指南',
      description: '了解系统基本操作流程,帮助您快速上手使用各项功能',
      icon: 'ep:guide',
      color: '#0097BA',
      url: '/help/quick-start'
    },
    {
      title: '设备管理操作手册',
      description: '设备台账管理、设备维护保养、设备巡检等功能的详细使用说明',
      icon: 'ep:setting',
      color: '#0097BA',
      url: '/help/equipment'
    },
    {
      title: '生产管理指南',
      description: '生产计划、工单管理、生产执行等模块的操作流程和注意事项',
      icon: 'ep:data-line',
      color: '#0097BA',
      url: '/help/production'
    },
    {
      title: '质量管理手册',
      description: '质量检验、不合格品处理、质量追溯等功能的使用方法',
      icon: 'ep:document-checked',
      color: '#0097BA',
      url: '/help/quality'
    },
    {
      title: '常见问题解答',
      description: '汇总用户常见问题和解决方案,快速解决使用中遇到的问题',
      icon: 'ep:question-filled',
      color: '#0097BA',
      url: '/help/faq'
    },
    {
      title: '系统更新日志',
      description: '查看系统最新功能更新、优化改进和问题修复记录',
      icon: 'ep:refresh',
      color: '#0097BA',
      url: '/help/changelog'
    }
  ]
  helpDocList = Object.assign(helpDocList, data)
}

// 帮助文档分页
const helpPagination = reactive({
  page: 1,
  size: 5
})

// 当前显示的帮助文档列表(分页后)
const currentHelpDocList = computed(() => {
  const start = (helpPagination.page - 1) * helpPagination.size
  const end = start + helpPagination.size
  return helpDocList.slice(start, end)
})

// 帮助文档分页变化
const handleHelpPageChange = (page: number) => {
  helpPagination.page = page
}

const handleHelpSizeChange = (size: number) => {
  helpPagination.size = size
  helpPagination.page = 1
}

// 查看更多帮助文档
const handleMoreHelp = () => {
  console.log('查看更多帮助文档')
  // TODO: 跳转到帮助文档中心页面
  // router.push({ path: '/help/center' })
}

// 点击帮助文档
const handleHelpClick = (help: HelpDoc) => {
  console.log('查看帮助文档:', help)
  // TODO: 打开帮助文档详情页或外部链接
  // if (help.url) {
  //   router.push(help.url)
  // }
}

// 下载帮助文档
const handleDownloadHelp = (help: HelpDoc) => {
  console.log('下载帮助文档:', help)
  // TODO: 实现文档下载逻辑
  // 示例: 模拟下载PDF文件
  // const link = document.createElement('a')
  // link.href = `/docs/${help.url}.pdf`
  // link.download = `${help.title}.pdf`
  // link.click()
}

// 获取通知公告
let companyNoticeList = reactive<Notice[]>([])
let systemNoticeList = reactive<Notice[]>([])
let messageList = reactive<Message[]>([])

const getNotice = async () => {
  // 企业公告
  const companyData = [
    {
      title: '公司年度总结大会将于本周五下午3点在会议室召开',
      noticeType: 'company' as const,
      date: new Date('2025-12-05 14:30:00')
    },
    {
      title: '关于调整工作时间的通知,自下周一起执行新作息时间',
      noticeType: 'company' as const,
      date: new Date('2025-12-04 09:00:00')
    },
    {
      title: '生产部门设备维护保养计划已更新,请各车间主管查阅',
      noticeType: 'company' as const,
      date: new Date('2025-12-03 16:20:00')
    },
    {
      title: '质量管理体系认证审核将于下月15日进行,请做好准备',
      noticeType: 'company' as const,
      date: new Date('2025-12-02 11:00:00')
    },
    {
      title: '12月份安全生产培训将于下周二开展,请各部门组织参加',
      noticeType: 'company' as const,
      date: new Date('2025-12-01 10:00:00')
    }
  ]
  
  // 系统公告
  const systemData = [
    {
      title: '系统将于本周六凌晨2点进行升级维护,预计2小时',
      noticeType: 'system' as const,
      date: new Date('2025-12-05 10:00:00')
    },
    {
      title: '新增智能排产模块,支持自动排程和产能分析',
      noticeType: 'system' as const,
      date: new Date('2025-12-04 15:30:00')
    },
    {
      title: '移动端APP已上线,支持iOS和Android平台',
      noticeType: 'system' as const,
      date: new Date('2025-12-03 09:20:00')
    },
    {
      title: '系统性能优化完成,页面加载速度提升50%',
      noticeType: 'system' as const,
      date: new Date('2025-12-01 14:00:00')
    },
    {
      title: '新增数据导出功能,支持Excel和PDF格式',
      noticeType: 'system' as const,
      date: new Date('2025-11-30 16:00:00')
    }
  ]
  
  // 消息列表
  const messageData = [
    {
      title: '您有新的待办任务需要处理',
      date: new Date('2025-12-05 15:30:00'),
      type: 'system' as const
    },
    {
      title: '采购订单PR20251203001已审批通过',
      date: new Date('2025-12-05 14:20:00'),
      type: 'system' as const
    },
    {
      title: '设备维修工单WO20251205已完成',
      date: new Date('2025-12-05 11:00:00'),
      type: 'system' as const
    },
    {
      title: '质量检验报告QR20251204已生成',
      date: new Date('2025-12-04 16:30:00'),
      type: 'system' as const
    },
    {
      title: '生产计划调整通知',
      date: new Date('2025-12-04 10:00:00'),
      type: 'user' as const
    },
    {
      title: '物料库存预警提醒',
      date: new Date('2025-12-03 14:00:00'),
      type: 'system' as const
    },
    {
      title: '您的请假申请已通过审批',
      date: new Date('2025-12-03 09:30:00'),
      type: 'system' as const
    }
  ]
  
  companyNoticeList = Object.assign(companyNoticeList, companyData)
  systemNoticeList = Object.assign(systemNoticeList, systemData)
  messageList = Object.assign(messageList, messageData)
}

// 消息公告Tab切换
const messageNoticeTab = ref('message')

// 消息分页
const messagePagination = reactive({
  page: 1,
  size: 5
})

// 公告分页
const noticePagination = reactive({
  page: 1,
  size: 5
})

// 获取所有公告(合并企业和系统)
const allNotices = computed(() => {
  const combined = [...companyNoticeList, ...systemNoticeList]
  return combined.sort((a, b) => b.date.getTime() - a.date.getTime())
})

// 消息总数
const messageTotal = computed(() => messageList.length)

// 公告总数
const noticeTotal = computed(() => allNotices.value.length)

// 当前显示的消息列表(分页后)
const currentMessageList = computed(() => {
  const start = (messagePagination.page - 1) * messagePagination.size
  const end = start + messagePagination.size
  return messageList.slice(start, end)
})

// 当前显示的公告列表(分页后)
const currentNoticeList = computed(() => {
  const start = (noticePagination.page - 1) * noticePagination.size
  const end = start + noticePagination.size
  return allNotices.value.slice(start, end)
})

// 消息分页变化
const handleMessagePageChange = (page: number) => {
  messagePagination.page = page
}

const handleMessageSizeChange = (size: number) => {
  messagePagination.size = size
  messagePagination.page = 1
}

// 公告分页变化
const handleNoticePageChange = (page: number) => {
  noticePagination.page = page
}

const handleNoticeSizeChange = (size: number) => {
  noticePagination.size = size
  noticePagination.page = 1
}

// 查看更多公告
const handleMoreNotice = () => {
  console.log('查看更多消息公告,当前Tab:', messageNoticeTab.value)
  // TODO: 跳转到消息公告列表页面
  // router.push({ path: '/system/notice', query: { type: messageNoticeTab.value } })
}

// 点击公告详情
const handleNoticeClick = (item: Notice | Message, type: string) => {
  console.log('查看详情:', type, item)
  // TODO: 打开详情弹窗或跳转到详情页
}

// 获取待办任务数据
const taskActiveTab = ref('pending')
const taskPagination = reactive({
  page: 1,
  size: 5
})

// 模拟数据
const pendingTasks = reactive<TaskItem[]>([
  {
    id: '1',
    title: '采购订单审批',
    content: '原材料采购订单PR20251203001,金额156,000元,请审批',
    type: '采购审批',
    creator: '张三',
    createTime: new Date('2025-12-03 09:30:00')
  },
  {
    id: '2',
    title: '设备维修申请',
    content: '生产线3号设备故障,需紧急维修,预算费用28,000元',
    type: '维修审批',
    creator: '李四',
    createTime: new Date('2025-12-03 10:15:00')
  },
  {
    id: '3',
    title: '员工请假申请',
    content: '王五申请事假3天(12月10日-12月12日)',
    type: '请假审批',
    creator: '王五',
    createTime: new Date('2025-12-02 16:20:00')
  },
  {
    id: '4',
    title: '质量异常处理',
    content: '产品批次QA20251203批次检测不合格,需确认处理方案',
    type: '质量审批',
    creator: '赵六',
    createTime: new Date('2025-12-02 14:30:00')
  },
  {
    id: '5',
    title: '供应商变更审批',
    content: '原材料供应商变更申请,由A公司变更为B公司',
    type: '供应商审批',
    creator: '孙七',
    createTime: new Date('2025-12-01 11:00:00')
  },
  {
    id: '6',
    title: '生产计划调整',
    content: '因客户需求变更,需调整12月份生产计划',
    type: '计划审批',
    creator: '周八',
    createTime: new Date('2025-12-01 09:00:00')
  }
])

const completedTasks = reactive<TaskItem[]>([
  {
    id: '101',
    title: '物料采购申请',
    content: '电子元器件采购申请,金额45,000元',
    type: '采购审批',
    handleTime: new Date('2025-12-02 15:30:00'),
    result: 'approved'
  },
  {
    id: '102',
    title: '加班申请审批',
    content: '生产部门周末加班申请,涉及人员12人',
    type: '加班审批',
    handleTime: new Date('2025-12-01 18:00:00'),
    result: 'approved'
  },
  {
    id: '103',
    title: '报销单审批',
    content: '差旅费报销申请,金额3,200元',
    type: '报销审批',
    handleTime: new Date('2025-11-30 14:20:00'),
    result: 'rejected'
  },
  {
    id: '104',
    title: '合同签署审批',
    content: '销售合同HT20251130001审批',
    type: '合同审批',
    handleTime: new Date('2025-11-29 16:00:00'),
    result: 'approved'
  }
])

const initiatedTasks = reactive<TaskItem[]>([
  {
    id: '201',
    title: '新产品开发立项',
    content: '智能温控系统新产品开发项目立项申请',
    type: '立项审批',
    currentHandler: '技术总监',
    status: 'processing',
    createTime: new Date('2025-12-03 08:00:00')
  },
  {
    id: '202',
    title: '年度预算申请',
    content: '2026年度部门预算申请,总计2,800,000元',
    type: '预算审批',
    currentHandler: '财务经理',
    status: 'pending',
    createTime: new Date('2025-12-02 10:00:00')
  },
  {
    id: '203',
    title: '培训计划申请',
    content: 'Q1季度员工技能培训计划',
    type: '培训审批',
    status: 'approved',
    createTime: new Date('2025-11-28 14:00:00')
  },
  {
    id: '204',
    title: '设备采购申请',
    content: '生产设备升级采购申请,金额580,000元',
    type: '采购审批',
    status: 'rejected',
    createTime: new Date('2025-11-25 09:30:00')
  }
])

// 当前任务总数
const currentTaskTotal = computed(() => {
  if (taskActiveTab.value === 'pending') {
    return pendingTasks.length
  } else if (taskActiveTab.value === 'completed') {
    return completedTasks.length
  } else {
    return initiatedTasks.length
  }
})

// 当前任务列表(分页后)
const currentTaskList = computed(() => {
  let tasks: TaskItem[] = []
  if (taskActiveTab.value === 'pending') {
    tasks = pendingTasks
  } else if (taskActiveTab.value === 'completed') {
    tasks = completedTasks
  } else {
    tasks = initiatedTasks
  }
  
  const start = (taskPagination.page - 1) * taskPagination.size
  const end = start + taskPagination.size
  return tasks.slice(start, end)
})

// 任务类型颜色
const getTaskTypeColor = (type: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
  const colorMap: Record<string, 'primary' | 'success' | 'warning' | 'info' | 'danger'> = {
    '采购审批': 'primary',
    '维修审批': 'warning',
    '请假审批': 'success',
    '质量审批': 'danger',
    '供应商审批': 'info',
    '计划审批': 'primary',
    '加班审批': 'warning',
    '报销审批': 'success',
    '合同审批': 'primary',
    '立项审批': 'danger',
    '预算审批': 'warning',
    '培训审批': 'info'
  }
  return colorMap[type] || 'primary'
}

// 任务状态文本
const getTaskStatusText = (status?: string) => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    processing: '处理中',
    approved: '已通过',
    rejected: '已拒绝'
  }
  return statusMap[status || 'pending'] || '未知'
}

// 分页变化
const handleTaskPageChange = (page: number) => {
  taskPagination.page = page
}

const handleTaskSizeChange = (size: number) => {
  taskPagination.size = size
  taskPagination.page = 1
}

// 任务操作
const handleTaskAction = (task: TaskItem, action: string) => {
  console.log('任务操作:', action, task)
  // TODO: 实现任务处理逻辑
}

// 查看更多任务
const handleMoreTasks = () => {
  console.log('查看更多任务,当前Tab:', taskActiveTab.value)
  // TODO: 跳转到任务中心页面
  // router.push({ path: '/workflow/task', query: { type: taskActiveTab.value } })
}

// 获取快捷入口
let shortcut = reactive<Shortcut[]>([])

const getShortcut = async () => {
  const data = [
    {
      name: '物料管理',
      icon: 'ep:box',
      url: '/material/management',
      color: '#0097BA'
    },
    {
      name: '物料追溯',
      icon: 'ep:document-checked',
      url: '/material/trace',
      color: '#0097BA'
    },
    {
      name: '采购申请',
      icon: 'ep:document-add',
      url: '/purchase/apply',
      color: '#0097BA'
    },
    {
      name: '往来企业管理',
      icon: 'ep:office-building',
      url: '/enterprise/management',
      color: '#0097BA'
    },
    {
      name: '采购单',
      icon: 'ep:document',
      url: '/purchase/order',
      color: '#0097BA'
    },
    {
      name: '员工管理',
      icon: 'ep:user',
      url: '/employee/management',
      color: '#0097BA'
    },
    {
      name: '工单列表',
      icon: 'ep:list',
      url: '/workorder/list',
      color: '#0097BA'
    },
    {
      name: '工厂建模',
      icon: 'ep:setting',
      url: '/factory/modeling',
      color: '#0097BA'
    },
    {
      name: '生产订单管理',
      icon: 'ep:tickets',
      url: '/production/order',
      color: '#0097BA'
    },
    {
      name: '新增采购申请',
      icon: 'ep:document-add',
      url: '/purchase/apply/add',
      color: '#0097BA'
    }
  ]
  shortcut = Object.assign(shortcut, data)
}

// 用户来源
const getUserAccessSource = async () => {
  const data = [
    { value: 335, name: 'analysis.directAccess' },
    { value: 310, name: 'analysis.mailMarketing' },
    { value: 234, name: 'analysis.allianceAdvertising' },
    { value: 135, name: 'analysis.videoAdvertising' },
    { value: 1548, name: 'analysis.searchEngines' }
  ]
  set(
    pieOptionsData,
    'legend.data',
    data.map((v) => t(v.name))
  )
  pieOptionsData!.series![0].data = data.map((v) => {
    return {
      name: t(v.name),
      value: v.value
    }
  })
}
const barOptionsData = reactive<EChartsOption>(barOptions) as EChartsOption

// 周活跃量
const getWeeklyUserActivity = async () => {
  const data = [
    { value: 13253, name: 'analysis.monday' },
    { value: 34235, name: 'analysis.tuesday' },
    { value: 26321, name: 'analysis.wednesday' },
    { value: 12340, name: 'analysis.thursday' },
    { value: 24643, name: 'analysis.friday' },
    { value: 1322, name: 'analysis.saturday' },
    { value: 1324, name: 'analysis.sunday' }
  ]
  set(
    barOptionsData,
    'xAxis.data',
    data.map((v) => t(v.name))
  )
  set(barOptionsData, 'series', [
    {
      name: t('analysis.activeQuantity'),
      data: data.map((v) => v.value),
      type: 'bar'
    }
  ])
}

const getAllApi = async () => {
  await Promise.all([
    getCount(),
    getProject(),
    getNotice(),
    getHelpDoc(),
    getShortcut(),
    getUserAccessSource()
  ])
  loading.value = false
}

const handleProjectClick = (message: string) => {
  // 判断是否为外部链接(以http://或https://开头)
  if (message.startsWith('http://') || message.startsWith('https://')) {
    // 外部链接,在新窗口打开
    window.open(message, '_blank')
  } else {
    // 内部路由,使用router跳转
    router.push(message)
  }
}

const handleShortcutClick = (url: string) => {
  router.push(url)
}

// 计算分页后的项目列表
const itemsPerPage = 12 // 每页显示12个项目 (2行 x 6列)
const projectPages = computed(() => {
  const pages: Project[][] = []
  for (let i = 0; i < projects.length; i += itemsPerPage) {
    pages.push(projects.slice(i, i + itemsPerPage))
  }
  return pages
})

// 当前页码
const currentPage = ref(0)

// 轮播组件引用
const carouselRef = ref()

// 轮播图切换事件
const handleCarouselChange = (index: number) => {
  currentPage.value = index
}

// 指示器点击事件
const handleIndicatorClick = (index: number) => {
  if (carouselRef.value) {
    carouselRef.value.setActiveItem(index)
  }
}

getAllApi()
// getProject()
</script>

<style lang="scss" scoped>
// 欢迎横幅样式
.welcome-banner {
  background: linear-gradient(135deg, #0A5673 0%, #0D6B8A 100%);
  border-radius: 8px;
  padding: 24px 32px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(10, 86, 115, 0.15);
}

.logo-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.logo-img {
  width: 42px;
  height: 42px;
}

.welcome-text {
  color: white;
  
  .text-22px {
    letter-spacing: 0.5px;
  }
  
  .text-13px {
    opacity: 0.95;
  }
}

.stat-item {
  text-align: center;
  color: white;
}

.stat-label {
  font-size: 13px;
  margin-bottom: 8px;
  opacity: 0.9;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  font-family: 'DIN', 'Arial', sans-serif;
}

.project-grid {
  padding: 8px;
}

// 轮播图容器
.carousel-wrapper {
  position: relative;
  
  // 隐藏左箭头
  &.hide-left-arrow {
    :deep(.el-carousel__arrow--left) {
      display: none !important;
    }
  }
  
  // 隐藏右箭头
  &.hide-right-arrow {
    :deep(.el-carousel__arrow--right) {
      display: none !important;
    }
  }
}

.project-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 12px 8px 12px;
  border-radius: 8px;
  background-color: #ffffff;
  border: 1px solid #0097BA;
  transition: all 0.3s ease;
  height: 95px;
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 151, 186, 0.15);
  }
}

.project-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 20%;
  flex-shrink: 0;
  overflow: hidden;
}

.project-name {
  font-weight: 500;
  color: #00405C;
  word-break: break-word;
  text-align: center;
  font-size: 13px;
  line-height: 1.4;
  width: 100%;
}

.project-description {
  font-size: 11px;
  color: #E3E7EE;
  line-height: 1.3;
  text-align: center;
  word-break: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 100%;
}

.carousel-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #dcdfe6;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #b3b8c4;
  }

  &.active {
    width: 24px;
    border-radius: 4px;
    background-color: #0097BA;
  }
}

:deep(.el-carousel__arrow) {
  background-color: #CCF5FF;
  color: #0097BA;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #0097BA;
    color: #ffffff;
  }
}

// 根据当前页码隐藏左右箭头
:deep(.el-carousel__arrow--left) {
  display: block;
  transition: opacity 0.3s ease;
}

:deep(.el-carousel__arrow--right) {
  display: block;
  transition: opacity 0.3s ease;
}

:deep(.el-carousel__container) {
  height: 215px;
}

:deep(.el-carousel__item) {
  overflow: visible;
}

// 任务模块样式
.task-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
}

.task-list {
  min-height: 300px;
  max-height: 450px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 3px;
    
    &:hover {
      background-color: #c0c4cc;
    }
  }
}

.task-item {
  padding: 6px 0;
  transition: all 0.3s ease;
  
  &:last-child {
    .el-divider {
      display: none;
    }
  }
}

.task-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  line-height: 1.4;
  display: flex;
  align-items: center;
}

.task-content {
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.task-actions {
  flex-shrink: 0;
}

// 通知公告样式
.notice-content {
  min-height: 200px;
  max-height: 240px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 2px;
    
    &:hover {
      background-color: #c0c4cc;
    }
  }
}

// 消息公告Tab样式
.message-notice-tabs {
  :deep(.el-tabs__header) {
    margin-bottom: 12px;
  }
  
  :deep(.el-tabs__nav-wrap::after) {
    height: 1px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 14px;
    font-weight: 500;
  }
}

// 帮助文档样式
.help-content {
  min-height: 200px;
  max-height: 240px;
  overflow-y: auto;
  padding: 4px 0;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 2px;
    
    &:hover {
      background-color: #c0c4cc;
    }
  }
}

.help-item {
  transition: all 0.3s ease;
  padding: 6px 0;
  border-radius: 4px;

  &:hover {
    background-color: #f5f7fa;
    
    .help-title {
      color: #409eff;
    }
  }
}

.help-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.help-title {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  line-height: 1.4;
  transition: color 0.3s ease;
}

.help-desc {
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.notice-item-card {
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 3px 0;

  &:hover {
    .notice-title-small {
      color: #409eff;
    }
  }
}

.notice-tag-small {
  flex-shrink: 0;
  margin-top: 1px;
}

.notice-title-small {
  font-size: 12px;
  color: #303133;
  line-height: 1.4;
  transition: color 0.3s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

// 常用菜单样式
.shortcut-item {
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #f5f7fa;
  }
}

.shortcut-link {
  font-size: 13px;
  transition: color 0.3s ease;

  &:hover {
    color: #409eff !important;
  }
}

// 卡片标题样式
.card-header {
  height: 24px;
  line-height: 24px;
  
  span {
    font-size: 14px;
    font-weight: 500;
    color: #303133;
  }
}

:deep(.el-card__header) {
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
}

// 卡片圆角
:deep(.el-card) {
  border-radius: 5px;
  
  .el-card__header {
    border-radius: 5px 5px 0 0;
  }
}

// 自定义主题色按钮
.custom-primary-btn {
  background-color: #0097BA;
  border-color: #0097BA;
  color: #ffffff;
  
  &:hover {
    background-color: #007a99;
    border-color: #007a99;
  }
  
  &:active {
    background-color: #006080;
    border-color: #006080;
  }
  
  &:focus {
    background-color: #0097BA;
    border-color: #0097BA;
  }
}
</style>