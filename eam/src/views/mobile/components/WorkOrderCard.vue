<template>
  <div class="wo-card" :class="`wo-card--${statusClass}`">
    <div class="wo-head">
      <span class="wo-code">{{ order.code }}</span>
      <span class="wo-status" :class="`wo-status--${statusClass}`">
        {{ order.statusText }}
      </span>
    </div>
    <div class="wo-body">
      <div class="wo-line">
        <span class="wo-label">设备：</span>
        <span>{{ order.equipmentName }} ({{ order.equipmentSn }})</span>
      </div>
      <div v-if="order.personName" class="wo-line">
        <span class="wo-label">负责人：</span>
        <span>{{ order.personName }}</span>
      </div>
      <div v-if="order.workStartTime" class="wo-line">
        <span class="wo-label">开始时间：</span>
        <span>{{ order.workStartTime }}</span>
      </div>
      <div v-if="order.remark" class="wo-line">
        <span class="wo-label">备注：</span>
        <span>{{ order.remark }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MobileWorkOrderVo } from '@/api/mobile/workorder'

defineOptions({ name: 'WorkOrderCard' })

const props = defineProps<{ order: MobileWorkOrderVo }>()

const statusClass = computed(() => {
  switch (props.order.status) {
    case 'PENDING': return 'pending'
    case 'IN_PROGRESS': return 'progress'
    case 'COMPLETED': return 'done'
    default: return 'default'
  }
})
</script>

<style scoped>
.wo-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  border-left: 4px solid #909399;
}
.wo-card--pending { border-left-color: #E6A23C; }
.wo-card--progress { border-left-color: #409EFF; }
.wo-card--done { border-left-color: #67C23A; }
.wo-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.wo-code {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}
.wo-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f4f4f5;
  color: #606266;
}
.wo-status--pending { background: #fdf6ec; color: #E6A23C; }
.wo-status--progress { background: #ecf5ff; color: #409EFF; }
.wo-status--done { background: #f0f9eb; color: #67C23A; }
.wo-body { font-size: 13px; color: #606266; }
.wo-line { line-height: 1.7; }
.wo-label { color: #909399; }
</style>
