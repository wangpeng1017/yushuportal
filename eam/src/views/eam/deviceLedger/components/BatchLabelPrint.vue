<template>
  <el-dialog
    v-model="visible"
    :title="`批量打印贴纸（共 ${devices.length} 台 / ${pageInfo.totalPages} 页）`"
    width="900px"
    align-center
    @opened="onOpened"
  >
    <div v-loading="rendering" element-loading-text="二维码生成中...">
      <div :id="printAreaId" class="label-sheet">
        <div
          v-for="(group, pageIdx) in pagedDevices"
          :key="pageIdx"
          class="label-page"
        >
          <div
            v-for="d in group"
            :key="d.equipmentSn"
            class="label-cell"
          >
            <canvas :data-sn="d.equipmentSn"></canvas>
            <div class="label-info">
              <div class="label-name">{{ d.equipmentName }}</div>
              <div class="label-sn">{{ d.equipmentSn }}</div>
            </div>
          </div>
        </div>
      </div>
      <p class="print-tip">💡 打印前请在对话框选择"实际大小/无缩放"，否则贴纸尺寸会偏差。</p>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-print="printConfig">打印</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import QRCode from 'qrcode'
import {
  buildEquipmentQrUrl,
  getDeployBaseUrl,
  calcLabelPages,
} from '../utils/qrcode-helper'

defineOptions({ name: 'BatchLabelPrint' })

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const rendering = ref(false)
const devices = ref<DeviceLite[]>([])

// 唯一 ID 避免多实例冲突
const printAreaId = `batch-label-print-area-${Math.random().toString(36).slice(2, 9)}`
const printConfig = {
  id: printAreaId,
  popTitle: '设备贴纸',
  extraCss: '',
}

const pageInfo = computed(() => calcLabelPages(devices.value.length))

const pagedDevices = computed(() => {
  const groups: DeviceLite[][] = []
  for (let i = 0; i < devices.value.length; i += pageInfo.value.perPage) {
    groups.push(devices.value.slice(i, i + pageInfo.value.perPage))
  }
  return groups
})

function open(list: DeviceLite[]) {
  devices.value = list
  visible.value = true
}

async function onOpened() {
  await nextTick()
  rendering.value = true
  const baseUrl = getDeployBaseUrl()
  const allCanvas = document.querySelectorAll<HTMLCanvasElement>(`#${printAreaId} canvas`)
  // 并发渲染所有 canvas，避免大批量串行阻塞
  await Promise.all(
    Array.from(allCanvas).map(async (canvas) => {
      const sn = canvas.dataset.sn || ''
      if (!sn) return
      try {
        await QRCode.toCanvas(canvas, buildEquipmentQrUrl(baseUrl, sn), {
          width: 100,
          margin: 1,
          errorCorrectionLevel: 'H',
        })
      } catch (e) {
        console.error('生成失败 sn=', sn, e)
      }
    })
  )
  rendering.value = false
}

defineExpose({ open })
</script>

<style scoped>
.label-sheet {
  max-height: 60vh;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 12px;
}
.label-page {
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 70mm);
  grid-auto-rows: 50mm;
  justify-content: start;
  gap: 0;
  padding: 8mm;
  margin-bottom: 12px;
}
.label-page:not(:last-child) {
  page-break-after: always;
}
.label-cell {
  width: 70mm;
  height: 50mm;
  display: flex;
  align-items: center;
  border: 1px dashed #ddd;
  padding: 4mm;
  box-sizing: border-box;
}
.label-cell canvas {
  width: 28mm;
  height: 28mm;
  flex-shrink: 0;
}
.label-info {
  margin-left: 4mm;
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
  flex: 1;
}
.label-name {
  font-weight: bold;
  color: #303133;
  word-break: break-all;
}
.label-sn {
  margin-top: 4px;
  color: #606266;
}

.print-tip {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fdf6ec;
  color: #E6A23C;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

/* 打印优化 */
@media print {
  @page { size: A4; margin: 0; }
  body { background: #fff !important; }
  .label-sheet {
    max-height: none !important;
    overflow: visible !important;
    background: #fff !important;
    padding: 0 !important;
  }
  .label-page {
    margin: 0 !important;
    padding: 8mm !important;
    background: #fff !important;
  }
  .label-cell { border: none !important; }
  .print-tip { display: none !important; }
}
</style>
