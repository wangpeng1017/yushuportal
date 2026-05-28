<template>
  <span class="status-tag" :class="`status-tag--${statusClass}`">
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

defineOptions({ name: 'StatusTag' })

const props = defineProps<{ status: string }>()

const STATUS_MAP: Record<string, { text: string; cls: string }> = {
  RUN: { text: '运行中', cls: 'run' },
  STANDBY: { text: '待机', cls: 'standby' },
  CLOSE: { text: '停机', cls: 'close' },
  FAILURE: { text: '故障', cls: 'fault' },
}

const statusText = computed(() => STATUS_MAP[props.status]?.text || '未知')
const statusClass = computed(() => STATUS_MAP[props.status]?.cls || 'default')
</script>

<style scoped>
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-tag--run { background: #f0f9eb; color: #67C23A; }
.status-tag--standby { background: #fdf6ec; color: #E6A23C; }
.status-tag--close { background: #f4f4f5; color: #909399; }
.status-tag--fault { background: #fef0f0; color: #F56C6C; }
.status-tag--default { background: #f4f4f5; color: #909399; }
</style>
