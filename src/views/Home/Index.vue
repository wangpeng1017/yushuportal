<template>
  <div>
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img src="@/assets/imgs/avatar.gif" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
                </div>
                <div class="mt-10px text-14px text-gray-500">
                  {{ t('workplace.toady') }}，20℃ - 32℃！
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { set } from 'lodash-es'
import { EChartsOption } from 'echarts'

import { useUserStore } from '@/store/modules/user'
// import { useWatermark } from '@/hooks/web/useWatermark'
import type { WorkplaceTotal, Project, Notice, Shortcut } from './types'
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
    todo: 10
  }
  totalSate = Object.assign(totalSate, data)
}

// 获取项目数
let projects = reactive<Project[]>([])
const getProject = async () => {
  const data = [
    {
      name: 'vue-pro',
      icon: 'simple-icons:springboot',
      message: 'github.com/vue-pro',
      personal: 'Spring Boot 单体架构',
      time: new Date('2025-01-02'),
      color: '#6DB33F'
    }
  ]
  projects = Object.assign(projects, data)
}

// 获取通知公告
let notice = reactive<Notice[]>([])
const getNotice = async () => {
  const data = [
    {
      title: '系统支持 JDK 8/17/21，Vue 2/3',
      type: '技术兼容性',
      keys: ['JDK', 'Vue'],
      date: new Date()
    },
    {
      title: '后端提供 Spring Boot 2.7/3.2 + Cloud 双架构',
      type: '架构灵活性',
      keys: ['Boot', 'Cloud'],
      date: new Date()
    },
    {
      title: '全部开源，个人与企业可 100% 直接使用，无需授权',
      type: '开源免授权',
      keys: ['无需授权'],
      date: new Date()
    },
    {
      title: '国内使用最广泛的快速开发平台，远超 10w+ 企业使用',
      type: '广泛企业认可',
      keys: ['最广泛', '10w+'],
      date: new Date()
    }
  ]
  notice = Object.assign(notice, data)
}

// 获取快捷入口
let shortcut = reactive<Shortcut[]>([])

const getShortcut = async () => {
  const data = [
    {
      name: '首页',
      icon: 'ion:home-outline',
      url: '/',
      color: '#1fdaca'
    },
    {
      name: '商城中心',
      icon: 'ep:shop',
      url: '/mall/home',
      color: '#ff6b6b'
    },
    {
      name: 'AI 大模型',
      icon: 'tabler:ai',
      url: '/ai/chat',
      color: '#7c3aed'
    },
    {
      name: 'ERP 系统',
      icon: 'simple-icons:erpnext',
      url: '/erp/home',
      color: '#3fb27f'
    },
    {
      name: 'CRM 系统',
      icon: 'simple-icons:civicrm',
      url: '/crm/backlog',
      color: '#4daf1bc9'
    },
    {
      name: 'IoT 物联网',
      icon: 'fa-solid:hdd',
      url: '/iot/home',
      color: '#1a73e8'
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
    getShortcut(),
    getUserAccessSource(),
    getWeeklyUserActivity()
  ])
  loading.value = false
}

const handleProjectClick = (message: string) => {
  window.open(`https://${message}`, '_blank')
}

const handleShortcutClick = (url: string) => {
  router.push(url)
}

getAllApi()
</script>
