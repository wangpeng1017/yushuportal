<template>
  <el-dialog
    v-model="visible"
    title="设备二维码"
    width="400px"
    align-center
    @closed="onClosed"
  >
    <div class="qr-wrap">
      <div ref="canvasWrapRef" :id="printAreaId" class="qr-canvas">
        <canvas ref="canvasRef"></canvas>
        <div class="qr-info">
          <div class="qr-line">设备名称：{{ device?.equipmentName }}</div>
          <div class="qr-line">设备编号：{{ device?.equipmentSn }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleDownload">下载 PNG</el-button>
      <el-button type="primary" v-print="printConfig">打印贴纸</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'
import {
  buildEquipmentQrUrl,
  downloadCanvasAsPng,
  getDeployBaseUrl,
} from '../utils/qrcode-helper'

defineOptions({ name: 'QrcodeDialog' })

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const device = ref<DeviceLite | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const canvasWrapRef = ref<HTMLDivElement | null>(null)

// 唯一 ID 避免多实例冲突（v-print 通过 ID 抓取打印区域）
const printAreaId = `qrcode-print-area-${Math.random().toString(36).slice(2, 9)}`
const printConfig = {
  id: printAreaId,
  popTitle: '设备二维码',
}

async function open(d: DeviceLite) {
  device.value = d
  visible.value = true
  await nextTick()
  if (!canvasRef.value) return
  // 清空旧二维码避免再次打开同设备时闪现
  const ctx = canvasRef.value.getContext('2d')
  ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), d.equipmentSn)
  try {
    await QRCode.toCanvas(canvasRef.value, url, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'H',
    })
  } catch (e) {
    ElMessage.error('二维码生成失败')
    console.error(e)
  }
}

function onClosed() {
  device.value = null
}

async function handleDownload() {
  if (!canvasRef.value || !device.value) return
  // 先快照，避免异步竞态（用户秒关弹窗时 device.value 可能被 onClosed 清空）
  const sn = device.value.equipmentSn
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), sn)
  const tmpCanvas = document.createElement('canvas')
  try {
    await QRCode.toCanvas(tmpCanvas, url, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
    })
    downloadCanvasAsPng(tmpCanvas, `${sn}.png`)
  } catch (e) {
    ElMessage.error('PNG 生成失败')
    console.error(e)
  }
}

defineExpose({ open })
</script>

<style scoped>
.qr-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.qr-canvas {
  text-align: center;
}
.qr-canvas canvas {
  display: block;
  margin: 0 auto;
}
.qr-info {
  margin-top: 16px;
  color: #303133;
  font-size: 14px;
}
.qr-line {
  line-height: 1.8;
}
</style>
