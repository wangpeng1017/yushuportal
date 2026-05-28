<template>
  <div class="pda-quick-page">
    <!-- 顶部状态栏（模拟 Android 工业 PDA） -->
    <div class="pda-statusbar">
      <span>Android PDA · 班组长 张三</span>
      <span>14:32 · 信号 ●●●●○ · 电量 78%</span>
    </div>

    <!-- 顶部导航 -->
    <div class="pda-header">
      <span class="back" @click="goBack">‹ 返回</span>
      <span class="title">快速报修</span>
      <span class="placeholder"></span>
    </div>

    <!-- 主体表单 -->
    <div class="pda-body">
      <div v-if="!submitted">
        <!-- 步骤 1：扫码定位设备 -->
        <div class="card">
          <div class="label">① 扫描设备二维码</div>
          <div v-if="!device" class="scan-area" @click="startScan">
            <div v-if="!scanning">
              <div class="scan-icon">⊞</div>
              <div class="scan-hint">点击扫描设备二维码</div>
            </div>
            <div v-else>
              <div class="scan-frame">
                <div class="scan-line"></div>
              </div>
              <div class="scan-hint">正在扫描…</div>
            </div>
          </div>
          <div v-else class="device-card">
            <div class="device-name">{{ device.name }}</div>
            <div class="device-meta">{{ device.code }} · {{ device.location }}</div>
            <div class="device-meta">最近保养：{{ device.lastMaintenance }}</div>
            <button class="btn-rescan" @click="device = null">重新扫描</button>
          </div>
        </div>

        <!-- 步骤 2：故障描述 -->
        <div v-if="device" class="card">
          <div class="label">② 故障描述</div>
          <textarea v-model="form.desc" placeholder="一句话描述故障现象（如：3 号轴异响 + 抖动 + 无法启动）" rows="3"></textarea>
          <div class="quick-tags">
            <span v-for="t in quickTags" :key="t" class="tag" @click="form.desc = (form.desc ? form.desc + '；' : '') + t">{{ t }}</span>
          </div>
        </div>

        <!-- 步骤 3：拍照 -->
        <div v-if="device" class="card">
          <div class="label">③ 拍照（建议至少 1 张）</div>
          <div class="photo-row">
            <div v-for="(p, i) in form.photos" :key="i" class="photo-thumb">
              <img :src="p" alt="" />
              <span class="photo-del" @click="form.photos.splice(i, 1)">×</span>
            </div>
            <div v-if="form.photos.length < 4" class="photo-add" @click="addPhoto">📷</div>
          </div>
        </div>

        <!-- 步骤 4：紧急程度 -->
        <div v-if="device" class="card">
          <div class="label">④ 紧急程度</div>
          <div class="urgency-row">
            <button v-for="u in urgencies" :key="u.value"
              :class="['urgency-btn', form.urgency === u.value ? 'active ' + u.cls : '']"
              @click="form.urgency = u.value">
              {{ u.label }}
            </button>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button v-if="device" class="submit-btn"
          :class="{ disabled: !form.desc || !form.urgency }"
          :disabled="!form.desc || !form.urgency"
          @click="submit">
          ✓ 提交（自动派工给设备员）
        </button>
      </div>

      <!-- 提交后页面 -->
      <div v-else class="success-card">
        <div class="success-icon">✓</div>
        <div class="success-title">报修单已提交</div>
        <div class="success-meta">单号：{{ submittedCode }}</div>
        <div class="success-meta">默认状态：待派工</div>
        <div class="success-meta">您的内部维修单将由车间设备员直接处理（免审）</div>
        <button class="btn-again" @click="reset">+ 再发一单</button>
        <button class="btn-link" @click="goBack">返回 EAM 首页</button>
      </div>
    </div>

    <!-- PDA 底部物理按键模拟 -->
    <div class="pda-keys">
      <span class="key">◁</span>
      <span class="key home" @click="goBack">○</span>
      <span class="key">▢</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'MobileRepairQuick' })

const router = useRouter()

const scanning = ref(false)
const device = ref<any>(null)
const submitted = ref(false)
const submittedCode = ref('')

const form = reactive({
  desc: '',
  photos: [] as string[],
  urgency: ''
})

const quickTags = ['异响', '抖动', '过热', '漏油', '无法启动', '报警', '断料', '漏气']
const urgencies = [
  { value: '紧急', label: '紧急（停产）', cls: 'cls-danger' },
  { value: '高',   label: '高（影响产能）', cls: 'cls-warning' },
  { value: '中',   label: '中（可生产）', cls: 'cls-primary' },
  { value: '低',   label: '低（计划性）', cls: 'cls-info' }
]

function startScan() {
  scanning.value = true
  setTimeout(() => {
    device.value = {
      name: '注塑机 1 号 · HM-180',
      code: 'EQ-PACK-N7-001',
      location: 'C 端 PACK 车间 · A 区',
      lastMaintenance: '2026-04-22'
    }
    scanning.value = false
  }, 1400)
}

function addPhoto() {
  // mock 一张占位图（svg data URI）
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']
  const c = colors[form.photos.length % colors.length]
  const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'><rect fill='${c}' width='80' height='80'/><text x='50%' y='52%' fill='#fff' font-family='sans-serif' font-size='14' text-anchor='middle'>现场${form.photos.length + 1}</text></svg>`)
  form.photos.push(`data:image/svg+xml;utf8,${svg}`)
}

function submit() {
  submittedCode.value = 'RW-' + new Date().toISOString().slice(2, 10).replace(/-/g, '') + '-' + String(Math.floor(Math.random() * 999) + 1).padStart(3, '0')
  submitted.value = true
}

function reset() {
  device.value = null
  form.desc = ''
  form.photos = []
  form.urgency = ''
  submitted.value = false
}

function goBack() {
  router.push('/index')
}
</script>

<style scoped>
.pda-quick-page {
  width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  background: #f0f2f5;
  border: 12px solid #2a2a2a;
  border-radius: 32px;
  position: relative;
  font-family: -apple-system, "PingFang SC", "Helvetica Neue", sans-serif;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  margin-top: 20px;
  margin-bottom: 20px;
}
.pda-statusbar {
  background: #1a1a1a;
  color: #67c23a;
  font-size: 11px;
  padding: 4px 12px;
  display: flex;
  justify-content: space-between;
  font-family: monospace;
}
.pda-header {
  background: #1f4e79;
  color: #fff;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.pda-header .back { font-size: 16px; cursor: pointer; }
.pda-header .title { font-size: 16px; font-weight: 600; }
.pda-header .placeholder { width: 32px; }

.pda-body { padding: 12px; padding-bottom: 80px; }
.card {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}
.label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
}

.scan-area {
  border: 2px dashed #c0c4cc;
  border-radius: 8px;
  padding: 28px 12px;
  text-align: center;
  cursor: pointer;
  background: #fafafa;
}
.scan-icon { font-size: 56px; color: #409eff; line-height: 1; }
.scan-hint { color: #909399; font-size: 13px; margin-top: 8px; }
.scan-frame {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto;
  border: 3px solid #67c23a;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7ed 100%);
}
.scan-frame::before, .scan-frame::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border: 4px solid #67c23a;
}
.scan-frame::before { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.scan-frame::after { bottom: -2px; right: -2px; border-left: none; border-top: none; }
.scan-line {
  position: absolute;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, transparent, #67c23a, transparent);
  animation: scan 1.4s linear infinite;
}
@keyframes scan {
  0% { top: 0; }
  50% { top: 100%; }
  100% { top: 0; }
}

.device-card {
  background: #ecf5ff;
  border-left: 4px solid #409eff;
  border-radius: 4px;
  padding: 12px 14px;
}
.device-name { font-size: 15px; font-weight: 600; color: #1f4e79; }
.device-meta { font-size: 12px; color: #606266; margin-top: 4px; }
.btn-rescan {
  margin-top: 8px;
  padding: 4px 10px;
  background: #fff;
  border: 1px solid #c0c4cc;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  cursor: pointer;
}

textarea {
  width: 100%;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
}
.quick-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.tag {
  background: #f0f9ff;
  color: #409eff;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 12px;
  cursor: pointer;
  border: 1px solid #d9ecff;
}
.tag:active { background: #d9ecff; }

.photo-row { display: flex; gap: 8px; flex-wrap: wrap; }
.photo-thumb {
  width: 64px;
  height: 64px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
.photo-del {
  position: absolute;
  top: 2px; right: 2px;
  width: 18px; height: 18px; line-height: 16px;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 50%;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}
.photo-add {
  width: 64px; height: 64px;
  border: 2px dashed #c0c4cc;
  border-radius: 4px;
  text-align: center;
  line-height: 60px;
  font-size: 24px;
  cursor: pointer;
  color: #909399;
}

.urgency-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.urgency-btn {
  padding: 12px;
  background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  color: #606266;
}
.urgency-btn.active { color: #fff; font-weight: 600; }
.urgency-btn.active.cls-danger { background: #f56c6c; border-color: #f56c6c; }
.urgency-btn.active.cls-warning { background: #e6a23c; border-color: #e6a23c; }
.urgency-btn.active.cls-primary { background: #409eff; border-color: #409eff; }
.urgency-btn.active.cls-info { background: #909399; border-color: #909399; }

.submit-btn {
  width: 100%;
  padding: 16px;
  background: #67c23a;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 16px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}
.submit-btn.disabled {
  background: #c0c4cc;
  cursor: not-allowed;
  box-shadow: none;
}

.success-card {
  background: #fff;
  padding: 32px 16px;
  text-align: center;
  border-radius: 8px;
  margin-top: 24px;
}
.success-icon {
  width: 60px;
  height: 60px;
  background: #67c23a;
  color: #fff;
  font-size: 36px;
  border-radius: 50%;
  margin: 0 auto 12px;
  line-height: 60px;
  font-weight: 700;
}
.success-title { font-size: 18px; font-weight: 600; color: #303133; margin-bottom: 16px; }
.success-meta { font-size: 13px; color: #606266; margin: 4px 0; }
.btn-again {
  margin-top: 24px;
  padding: 12px 32px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}
.btn-link {
  display: block;
  margin: 12px auto 0;
  background: none;
  border: none;
  color: #409eff;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
}

.pda-keys {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  background: #2a2a2a;
  padding: 8px 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.pda-keys .key {
  width: 28px; height: 28px;
  border: 2px solid #888;
  border-radius: 4px;
  text-align: center;
  line-height: 24px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
}
.pda-keys .key.home { width: 32px; height: 32px; line-height: 28px; border-radius: 50%; font-size: 18px; }
</style>
