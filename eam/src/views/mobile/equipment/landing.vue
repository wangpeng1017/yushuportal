<template>
  <div class="m-landing">
    <MobileHeader :show-back="false" title="设备扫码" />

    <div class="m-body">
      <div v-if="loading" class="m-loading">加载中...</div>

      <div v-else-if="error" class="m-empty">
        <Icon icon="ep:warning-filled" :size="64" color="#E6A23C" />
        <div class="m-empty-text">{{ error }}</div>
        <el-button @click="load">重试</el-button>
      </div>

      <div v-else-if="abolished" class="m-empty">
        <Icon icon="ep:circle-close-filled" :size="64" color="#F56C6C" />
        <div class="m-empty-text">⚠ 该设备已停用</div>
        <div class="m-empty-sub">设备编号：{{ device?.equipmentSn }}</div>
        <div class="m-empty-sub">如需查询历史信息，请联系管理员</div>
      </div>

      <template v-else-if="device">
        <div class="m-info-card">
          <div class="m-info-name">
            {{ device.equipmentName }}
            <StatusTag :status="device.operationStatus" />
          </div>
          <div class="m-info-line">编号：{{ device.equipmentSn }}</div>
          <div class="m-info-line">类型：{{ device.equipmentTypeDesc }}</div>
          <div class="m-info-line">车间：{{ device.workshopName }}</div>
          <div v-if="device.equipmentSupplierName" class="m-info-line">
            供应商：{{ device.equipmentSupplierName }}
          </div>
        </div>

        <div class="m-menu">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="m-menu-item"
            @click="onMenuClick(item)"
          >
            <Icon :icon="item.icon" :size="28" :color="item.color" />
            <div class="m-menu-text">{{ item.title }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDeviceBySn, type DeviceLandingVo } from '@/api/mobile/equipment'
import { isMobileTokenValid } from '../utils/mobile-token'
import { buildLoginRedirect } from '../utils/mobile-route-guard'
import { isDeviceAbolished } from './landing-utils'
import MobileHeader from '../components/MobileHeader.vue'
import StatusTag from './components/StatusTag.vue'

defineOptions({ name: 'MobileEquipmentLanding' })

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const device = ref<DeviceLandingVo | null>(null)

const abolished = computed(() => isDeviceAbolished(device.value))

interface MenuItem {
  title: string
  icon: string
  color: string
  path: string
  requireAuth: boolean
}

const menuItems: MenuItem[] = [
  { title: '保养工单', icon: 'ep:tools', color: '#E6A23C', path: '/m/maintenance/list', requireAuth: true },
  { title: '点巡检工单', icon: 'ep:document', color: '#409EFF', path: '/m/spotInspection/list', requireAuth: true },
  { title: '维修工单', icon: 'ep:setting', color: '#F56C6C', path: '/m/repairOrder/list', requireAuth: true },
  { title: '设备档案查看', icon: 'ep:files', color: '#67C23A', path: '/m/equipment/detail', requireAuth: false },
  { title: '历史工单查询', icon: 'ep:notebook', color: '#909399', path: '/m/workorder/history', requireAuth: true },
]

async function load() {
  const sn = route.params.sn as string
  if (!sn) {
    error.value = '设备编号不能为空'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await getDeviceBySn(sn)
    if (!res) {
      error.value = '设备不存在或已删除'
      return
    }
    device.value = res
  } catch (e: any) {
    error.value = e?.msg || '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

function onMenuClick(item: MenuItem) {
  if (!device.value) return
  const sn = device.value.equipmentSn
  if (item.requireAuth && !isMobileTokenValid()) {
    const targetPath = `${item.path}?equipmentSn=${encodeURIComponent(sn)}`
    router.push(buildLoginRedirect(targetPath))
    return
  }
  if (item.path === '/m/equipment/detail') {
    router.push(`/m/equipment/detail?sn=${encodeURIComponent(sn)}`)
    return
  }
  router.push(`${item.path}?equipmentSn=${encodeURIComponent(sn)}`)
}

onMounted(load)
</script>

<style scoped>
.m-landing {
  min-height: 100vh;
  background: #f5f7fa;
}
.m-body {
  padding: 12px;
}
.m-loading {
  text-align: center;
  padding: 60px 0;
  color: #909399;
  font-size: 14px;
}
.m-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}
.m-empty-text {
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.m-empty-sub {
  margin-top: 6px;
  font-size: 13px;
  color: #909399;
}
.m-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 14px;
}
.m-info-name {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.m-info-line {
  font-size: 13px;
  color: #606266;
  line-height: 1.9;
}
.m-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.m-menu-item {
  background: #fff;
  border-radius: 8px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s;
}
.m-menu-item:active {
  transform: scale(0.96);
}
.m-menu-text {
  font-size: 14px;
  color: #303133;
}
</style>
