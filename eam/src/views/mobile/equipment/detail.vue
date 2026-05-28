<template>
  <div class="m-detail">
    <MobileHeader title="设备档案" :back-to="`/m/equipment/${sn}`" />
    <div class="m-body">
      <div v-if="loading" class="m-loading">加载中...</div>
      <div v-else-if="!device" class="m-empty">
        <div class="m-empty-text">设备信息加载失败</div>
      </div>
      <div v-else class="m-card">
        <div class="m-row"><span class="m-label">设备编号</span><span>{{ device.equipmentSn }}</span></div>
        <div class="m-row"><span class="m-label">设备名称</span><span>{{ device.equipmentName }}</span></div>
        <div class="m-row"><span class="m-label">设备类型</span><span>{{ device.equipmentTypeDesc }}</span></div>
        <div class="m-row"><span class="m-label">所属车间</span><span>{{ device.workshopName }}</span></div>
        <div class="m-row"><span class="m-label">运行状态</span><StatusTag :status="device.operationStatus" /></div>
        <div class="m-row"><span class="m-label">资产状态</span><span>{{ device.equipmentStatus === 'USING' ? '使用中' : '已停用' }}</span></div>
        <div v-if="device.equipmentMode" class="m-row"><span class="m-label">设备型号</span><span>{{ device.equipmentMode }}</span></div>
        <div v-if="device.equipmentSupplierName" class="m-row"><span class="m-label">供应商</span><span>{{ device.equipmentSupplierName }}</span></div>
        <div v-if="device.equipmentOperating" class="m-row"><span class="m-label">投运时间</span><span>{{ device.equipmentOperating }}</span></div>
        <div v-if="device.equipmentPurchase" class="m-row"><span class="m-label">购置时间</span><span>{{ device.equipmentPurchase }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDeviceBySn, type DeviceLandingVo } from '@/api/mobile/equipment'
import MobileHeader from '../components/MobileHeader.vue'
import StatusTag from './components/StatusTag.vue'

defineOptions({ name: 'MobileEquipmentDetail' })

const route = useRoute()
const loading = ref(false)
const device = ref<DeviceLandingVo | null>(null)
const sn = route.query.sn as string

async function load() {
  if (!sn) return
  loading.value = true
  try {
    device.value = await getDeviceBySn(sn)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.m-detail { min-height: 100vh; background: #f5f7fa; }
.m-body { padding: 12px; }
.m-card { background: #fff; border-radius: 8px; padding: 8px 14px; }
.m-row { display: flex; padding: 10px 0; border-bottom: 1px solid #f0f2f5; font-size: 14px; align-items: center; }
.m-row:last-child { border-bottom: none; }
.m-label { width: 90px; color: #909399; flex-shrink: 0; }
.m-loading, .m-empty { text-align: center; padding: 60px 0; color: #909399; }
.m-empty-text { font-size: 14px; }
</style>
