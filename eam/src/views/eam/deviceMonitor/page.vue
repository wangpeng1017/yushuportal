<template>
  <div class="device-monitor-page">
    <!-- 顶部标题 -->
    <div class="page-header mb-20px">
      <span class="page-title">设备运行监控</span>
      <span class="page-time">数据更新时间：{{ currentTime }}</span>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="mb-20px">
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card-wrapper">
          <div class="stat-card">
            <div class="stat-value" style="color: #409EFF">{{ stats.total }}</div>
            <div class="stat-label">设备总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card-wrapper">
          <div class="stat-card">
            <div class="stat-value" style="color: #67C23A">{{ stats.running }}</div>
            <div class="stat-label">运行中</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card-wrapper">
          <div class="stat-card">
            <div class="stat-value" style="color: #909399">{{ stats.stopped }}</div>
            <div class="stat-label">停机</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stat-card-wrapper">
          <div class="stat-card">
            <div class="stat-value" style="color: #F56C6C">{{ stats.fault }}</div>
            <div class="stat-label">故障</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备卡片网格 -->
    <el-card shadow="never" class="mb-20px">
      <template #header>
        <span class="section-title">设备状态总览</span>
      </template>
      <el-row :gutter="16">
        <el-col
          v-for="device in monitorList"
          :key="device.id"
          :span="4"
          class="mb-16px"
        >
          <el-card
            shadow="hover"
            :class="['device-card', 'device-' + device.powerStatus]"
          >
            <div class="device-status-dot" :class="statusClass(device.powerStatus)"></div>
            <div class="device-sn">{{ device.equipmentSn }}</div>
            <div class="device-name">{{ device.equipmentName }}</div>
            <div class="device-info">运行 {{ device.runTime }}h | 产量 {{ device.processCount }}</div>
            <div v-if="device.alarmInfo" class="device-alarm">{{ device.alarmInfo }}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近告警列表 -->
    <el-card shadow="never">
      <template #header>
        <span class="section-title">最近告警（最新5条）</span>
      </template>
      <el-table :data="alarmList" size="small" border stripe>
        <el-table-column label="设备编号" prop="equipmentSn" width="140" />
        <el-table-column label="设备名称" prop="equipmentName" width="160" />
        <el-table-column label="告警信息" prop="alarmInfo" />
        <el-table-column label="发生时间" prop="collectTime" width="180" />
        <el-table-column label="状态" prop="powerStatus" width="90">
          <template #default="{ row }">
            <el-tag :type="statusTagType(row.powerStatus)" size="small">
              {{ statusLabel(row.powerStatus) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import * as IotOeeApi from '@/api/eam/iotOee'
import type { DeviceMonitorVo } from '@/api/eam/iotOee'

defineOptions({ name: 'EamDeviceMonitor' })

const monitorList = ref<DeviceMonitorVo[]>([])
const currentTime = ref('')

const stats = computed(() => {
  const list = monitorList.value
  return {
    total: list.length,
    running: list.filter(d => d.powerStatus === 'running').length,
    stopped: list.filter(d => d.powerStatus === 'stopped').length,
    fault: list.filter(d => d.powerStatus === 'fault').length,
  }
})

const alarmList = computed(() => {
  return monitorList.value
    .filter(d => d.alarmInfo)
    .slice(0, 5)
})

function statusClass(status?: string) {
  const map: Record<string, string> = {
    running: 'status-running',
    standby: 'status-standby',
    stopped: 'status-stopped',
    fault: 'status-fault',
  }
  return map[status || ''] || 'status-stopped'
}

function statusLabel(status?: string) {
  const map: Record<string, string> = {
    running: '运行',
    standby: '待机',
    stopped: '停机',
    fault: '故障',
  }
  return map[status || ''] || '未知'
}

function statusTagType(status?: string): 'success' | 'info' | 'warning' | 'danger' | '' {
  const map: Record<string, 'success' | 'info' | 'warning' | 'danger'> = {
    running: 'success',
    standby: 'warning',
    stopped: 'info',
    fault: 'danger',
  }
  return map[status || ''] || 'info'
}

async function loadData() {
  try {
    const res = await IotOeeApi.getDeviceMonitorList({})
    monitorList.value = res?.data?.records || res?.data || []
    currentTime.value = new Date().toLocaleString('zh-CN')
  } catch (e) {
    console.error('加载设备监控数据失败', e)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.device-monitor-page {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100%;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.page-time {
  font-size: 13px;
  color: #909399;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.stat-card-wrapper {
  border-radius: 8px;
}

.stat-card {
  text-align: center;
  padding: 10px 0;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 6px;
}

.device-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 105px;
  border-radius: 8px;
}

.device-card:hover {
  transform: translateY(-3px);
}

.device-fault {
  border-color: #fde2e2;
  background: #fff8f8;
}

.device-running {
  border-color: #e1f3d8;
  background: #f0f9eb;
}

.device-stopped {
  border-color: #e9e9eb;
  background: #f4f4f5;
}

.device-standby {
  border-color: #faecd8;
  background: #fdf6ec;
}

.device-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: 6px;
}

.status-running {
  background: #67C23A;
  box-shadow: 0 0 6px #67C23A88;
}

.status-standby {
  background: #E6A23C;
}

.status-stopped {
  background: #909399;
}

.status-fault {
  background: #F56C6C;
  box-shadow: 0 0 6px #F56C6C88;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.device-sn {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.device-name {
  font-size: 12px;
  color: #606266;
  margin: 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.device-info {
  font-size: 11px;
  color: #909399;
}

.device-alarm {
  font-size: 11px;
  color: #F56C6C;
  margin-top: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
