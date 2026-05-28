<template>
  <div class="mobile-page" :class="{ 'mobile-page--standalone': isStandalone }">
    <div v-if="!isStandalone" class="left-tip">
      <h3>移动端演示</h3>
      <p>员工手持 PDA / 手机访问，扫码报修、拍照打卡、完工报工。</p>
      <p>数据与 PC 端实时同步。</p>
      <p>切换 Tab 查看不同类型工单，点击卡片可打开操作菜单。</p>
      <p style="margin-top: 16px; padding-top: 12px; border-top: 1px dashed #d0d6e0;">
        <a :href="h5Url" target="_blank" style="color: #0f4c5c; font-weight: 600;">
          独立 H5 全屏演示 →
        </a>
      </p>
    </div>

    <div class="phone-shell" :class="{ 'phone-shell--standalone': isStandalone }">
      <div v-if="!isStandalone" class="phone-notch"></div>
      <div v-if="!isStandalone" class="status-bar">
        <span>{{ statusTime }}</span>
        <span>电量 100%</span>
      </div>

      <!-- Hero 区 -->
      <div class="h5-hero">
        <div class="hero-title">设备管理平台</div>
        <div class="hero-sub">欢迎回来，{{ workshopText }}</div>
      </div>

      <div class="h5-body">
        <!-- KPI 大卡 -->
        <div class="kpi-card">
          <div class="kpi-head">今日工单概览</div>
          <div class="kpi-main">
            <span class="kpi-num">{{ completionRate }}%</span>
            <span class="kpi-label">完成率</span>
          </div>
          <div class="kpi-sub">
            <div class="kpi-sub-item">
              <div class="kpi-sub-label">待保养</div>
              <div class="kpi-sub-num">{{ maintList.length }}</div>
            </div>
            <div class="kpi-sub-item">
              <div class="kpi-sub-label">待维修</div>
              <div class="kpi-sub-num">{{ repairList.length }}</div>
            </div>
          </div>
        </div>

        <!-- PDA 扫码 demo 入口 -->
        <div class="scan-demo-card" @click="goScanDemo">
          <div class="scan-demo-icon">
            <Icon icon="ep:full-screen" :size="36" />
          </div>
          <div class="scan-demo-text">
            <div class="scan-demo-title">📱 PDA 扫码体验</div>
            <div class="scan-demo-sub">点击进入设备扫码落地页（5 工单入口 + 7 天 token）</div>
          </div>
          <Icon icon="ep:arrow-right" :size="20" />
        </div>

        <!-- 6 应用 grid -->
        <div class="section-title">常用应用</div>
        <div class="app-grid">
          <div
            v-for="app in appList" :key="app.code"
            class="app-item" @click="handleAppClick(app)"
          >
            <div class="app-icon" :style="{ background: app.color }">
              <Icon :icon="app.icon" :color="app.iconColor" />
            </div>
            <div class="app-name">{{ app.name }}</div>
          </div>
        </div>

        <!-- Tab + 工单卡 -->
        <div class="section-title">工单中心</div>
        <div class="tab-bar">
          <div
            v-for="tab in tabs" :key="tab.value"
            class="tab-btn" :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            <span>{{ tab.label }}</span>
            <span class="tab-count">{{ tab.count }}</span>
          </div>
        </div>

        <div class="card-list">
          <template v-if="activeTab === 'maintenance'">
            <div v-if="!maintList.length" class="empty-tip">暂无待办保养工单</div>
            <div v-for="wo in maintList" :key="wo.id" class="wo-card" @click="openDetail(wo, 'maintenance')">
              <div class="wo-header">
                <span class="wo-code">{{ wo.code }}</span>
                <el-tag size="small" :type="getStatusTag(wo.status)">{{ statusLabel(wo.status, 'maint') }}</el-tag>
              </div>
              <div class="wo-title">{{ wo.equipmentName }}</div>
              <div class="wo-meta">{{ wo.planName }}</div>
              <div class="wo-meta">计划 {{ formatTime(wo.workStartTime) }}</div>
            </div>
          </template>

          <template v-if="activeTab === 'inspection'">
            <div v-if="!inspList.length" class="empty-tip">暂无待办点检工单</div>
            <div v-for="wo in inspList" :key="wo.id" class="wo-card" @click="openDetail(wo, 'inspection')">
              <div class="wo-header">
                <span class="wo-code">{{ wo.workCode }}</span>
                <el-tag size="small" :type="getStatusTag(wo.status)">{{ statusLabel(wo.status, 'insp') }}</el-tag>
              </div>
              <div class="wo-title">{{ wo.equipmentName || '-' }}</div>
              <div class="wo-meta">{{ wo.planName }}</div>
              <div class="wo-meta">进度 {{ wo.spotInspection || '0/0' }}</div>
            </div>
          </template>

          <template v-if="activeTab === 'repair'">
            <div v-if="!repairList.length" class="empty-tip">暂无待办维修工单</div>
            <div v-for="wo in repairList" :key="wo.id" class="wo-card" @click="openDetail(wo, 'repair')">
              <div class="wo-header">
                <span class="wo-code">{{ wo.repairCode }}</span>
                <el-tag size="small" :type="getStatusTag(wo.status)">{{ statusLabel(wo.status, 'repair') }}</el-tag>
              </div>
              <div class="wo-title">{{ wo.equipmentName }}</div>
              <div class="wo-meta wo-fault">{{ wo.remark }}</div>
              <div class="wo-meta">{{ wo.sourceTypeText }}</div>
            </div>
          </template>

          <template v-if="activeTab === 'report'">
            <div class="report-action">
              <el-button type="primary" size="large" round class="full-btn" @click="openReportForm">主动报修</el-button>
            </div>
            <div v-if="!failureList.length" class="empty-tip">暂无报修单</div>
            <div v-for="wo in failureList" :key="wo.id" class="wo-card" @click="openDetail(wo, 'failure')">
              <div class="wo-header">
                <span class="wo-code">{{ wo.failureCode }}</span>
                <el-tag size="small" :type="getFailureTag(wo.status)">{{ wo.status === '2' ? '已审核' : '待审核' }}</el-tag>
              </div>
              <div class="wo-title">{{ wo.equipmentName }}</div>
              <div class="wo-meta wo-fault">{{ wo.remark }}</div>
              <div class="wo-meta">{{ wo.sourceTypeText }}</div>
            </div>
          </template>
        </div>
      </div>

      <!-- 底部 nav -->
      <div class="bottom-nav">
        <div
          v-for="tab in tabs" :key="tab.value"
          class="nav-item" :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          <Icon :icon="tab.icon" />
          <span>{{ tab.short }}</span>
        </div>
      </div>
    </div>

    <el-drawer v-model="detailVisible" :title="detailTitle" direction="btt" size="78%">
      <template v-if="currentWo">
        <el-descriptions :column="1" border size="small">
          <el-descriptions-item label="工单编号">{{ currentWoCode }}</el-descriptions-item>
          <el-descriptions-item label="设备">{{ currentWo.equipmentName }}</el-descriptions-item>
          <el-descriptions-item v-if="currentWo.planName" label="所属计划">{{ currentWo.planName }}</el-descriptions-item>
          <el-descriptions-item v-if="currentWo.remark" label="故障描述">{{ currentWo.remark }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusTag(currentWo.status)">{{ currentStatusText }}</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        <div v-if="scanned" class="scan-success">扫码确认成功</div>
        <div v-if="photoUploaded > 0" class="photo-tip">已上传 {{ photoUploaded }} 张照片</div>
        <div class="action-row">
          <el-button :type="scanBtnType" plain @click="handleScan">扫码确认</el-button>
          <el-button type="warning" plain @click="handleTakePhoto">拍照打卡</el-button>
          <el-button type="success" :disabled="completeDisabled" @click="handleComplete">完工报工</el-button>
        </div>
      </template>
    </el-drawer>

    <el-drawer v-model="reportVisible" title="主动报修" direction="btt" size="80%">
      <el-form :model="reportForm" label-position="top">
        <el-form-item label="设备编号" required>
          <el-input v-model="reportForm.equipmentSn" placeholder="请输入或扫码">
            <template #append>
              <el-button @click="scanForReport">扫码</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input v-model="reportForm.equipmentName" placeholder="扫码后自动带出" />
        </el-form-item>
        <el-form-item label="故障描述" required>
          <el-input v-model="reportForm.remark" type="textarea" :rows="3" placeholder="请描述故障现象" />
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-radio-group v-model="reportForm.breakdownLevel">
            <el-radio-button label="1">紧急</el-radio-button>
            <el-radio-button label="2">一般</el-radio-button>
            <el-radio-button label="3">轻微</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="故障照片">
          <el-button @click="addReportPhoto">拍照</el-button>
          <span class="photo-count">已上传 {{ reportForm.photos }} 张</span>
        </el-form-item>
        <el-button type="primary" size="large" round class="full-btn" @click="submitReport">提交报修</el-button>
      </el-form>
    </el-drawer>
  </div>
</template>

<script setup lang="ts" name="MobileDashboard">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'
import { usePlant } from '@/hooks/web/usePlant'

const route = useRoute()
const isStandalone = computed(() => String(route.path || '').startsWith('/h5'))
const h5Url = computed(() => `${location.origin}/h5/eam`)

const { plantCode } = usePlant()
const workshopMap: any = { C: 'C 端 / 陆钟', B: 'B 端 / 买盼', CNC: '数控 / 刚嘉成', ALL: '管理员' }
const workshopText = computed(() => workshopMap[plantCode.value] || '员工')

const statusTime = ref('')
const statusDate = ref('')
function tickTime() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  statusTime.value = pad(d.getHours()) + ':' + pad(d.getMinutes())
  statusDate.value = (d.getMonth() + 1) + '月' + d.getDate() + '日'
}
tickTime()
setInterval(tickTime, 60000)

const activeTab = ref('maintenance')
const maintList = ref<any[]>([])
const inspList = ref<any[]>([])
const repairList = ref<any[]>([])
const failureList = ref<any[]>([])
const completedTodayCount = ref(0)

const tabs = computed(() => [
  { value: 'maintenance', label: '保养', short: '保养', count: maintList.value.length, icon: 'ep:set-up' },
  { value: 'inspection', label: '点检', short: '点检', count: inspList.value.length, icon: 'ep:view' },
  { value: 'repair', label: '维修', short: '维修', count: repairList.value.length, icon: 'ep:tools' },
  { value: 'report', label: '报修', short: '报修', count: failureList.value.length, icon: 'ep:warning-filled' }
])

const completionRate = computed(() => {
  const total = maintList.value.length + inspList.value.length + repairList.value.length + completedTodayCount.value
  if (!total) return 0
  return Math.round((completedTodayCount.value / total) * 1000) / 10
})

const appList = [
  { code: 'scan', name: '扫码体验', icon: 'ep:full-screen', color: '#fee2e2', iconColor: '#dc2626' },
  { code: 'scan-stop', name: '停用设备演示', icon: 'ep:circle-close', color: '#fef3c7', iconColor: '#d97706' },
  { code: 'equip', name: '设备档案', icon: 'ep:office-building', color: '#e8f3ff', iconColor: '#2563eb' },
  { code: 'maint', name: '保养工单', icon: 'ep:set-up', color: '#f3e8ff', iconColor: '#9333ea' },
  { code: 'insp', name: '点检工单', icon: 'ep:view', color: '#dcfce7', iconColor: '#16a34a' },
  { code: 'repair', name: '维修工单', icon: 'ep:tools', color: '#ffedd5', iconColor: '#ea580c' },
  { code: 'parts', name: '备件领用', icon: 'ep:goods', color: '#fef2f2', iconColor: '#ef4444' },
  { code: 'report', name: '故障报修', icon: 'ep:warning-filled', color: '#fef9c3', iconColor: '#ca8a04' }
]

function goScanDemo() {
  window.location.href = '/m/equipment/EQ20240001'
}

function handleAppClick(app: any) {
  if (app.code === 'scan') window.location.href = '/m/equipment/EQ20240001'
  else if (app.code === 'scan-stop') window.location.href = '/m/equipment/EQ20230099'
  else if (app.code === 'equip') window.location.href = '/m/equipment/EQ20240001'
  else if (app.code === 'maint') activeTab.value = 'maintenance'
  else if (app.code === 'insp') activeTab.value = 'inspection'
  else if (app.code === 'repair') activeTab.value = 'repair'
  else if (app.code === 'report') { activeTab.value = 'report'; openReportForm() }
  else if (app.code === 'parts') ElMessage.info('备件领用：扫码识别工单后自动扣库存（演示中已在工单完工时联动）')
}

async function loadAll() {
  try {
    const [m, i, r, f] = await Promise.all([
      request.get({ url: '/workOrder/eamMaintenanceWork/list', params: { pageNo: 1, pageSize: 50 } }),
      request.get({ url: '/workOrder/eamSpotInspectionWork/list', params: { pageNo: 1, pageSize: 50 } }),
      request.get({ url: '/workOrder/eamRepairWorkOrder/list', params: { pageNo: 1, pageSize: 50 } }),
      request.get({ url: '/workOrder/eamFailureWorkOrder/list', params: { pageNo: 1, pageSize: 50 } }),
    ])
    const ms = (m as any)?.records || []
    const is = (i as any)?.records || []
    const rs = (r as any)?.records || []
    const fs = (f as any)?.records || []
    maintList.value = ms.filter((x: any) => x.status === '1' || x.status === '2' || x.status === '3')
    inspList.value = is.filter((x: any) => x.status === '1' || x.status === '2')
    repairList.value = rs.filter((x: any) => x.status === '2' || x.status === '3' || x.status === '4')
    failureList.value = fs
    const completed = ms.filter((x: any) => x.status === '4').length
      + is.filter((x: any) => x.status === '3').length
      + rs.filter((x: any) => x.status === '5').length
    completedTodayCount.value = completed
  } catch (e) {
    console.error('加载工单失败', e)
  }
}

function statusLabel(s: string, type: string) {
  const M: any = { '1': '待派工', '2': '已派工', '3': '保养中', '4': '已完工' }
  const I: any = { '1': '待派工', '2': '执行中', '3': '已完成' }
  const R: any = { '1': '草稿', '2': '已派工', '3': '维修中', '4': '已完工待确认', '5': '已确认' }
  if (type === 'maint' || type === 'maintenance') return M[s] || s
  if (type === 'insp' || type === 'inspection') return I[s] || s
  if (type === 'repair') return R[s] || s
  return s
}
function getStatusTag(s: string): any {
  if (s === '1') return 'info'
  if (s === '2') return 'warning'
  if (s === '4' || s === '5') return 'success'
  return ''
}
function getFailureTag(s: string): any {
  return s === '2' ? 'success' : 'warning'
}
function formatTime(t: string) {
  return t ? t.slice(5, 16) : '-'
}

const detailVisible = ref(false)
const currentWo = ref<any>(null)
const currentType = ref('maintenance')
const titleMap: any = { maintenance: '保养工单详情', inspection: '点检工单详情', repair: '维修工单详情', failure: '报修单详情' }
const detailTitle = computed(() => titleMap[currentType.value])
const currentWoCode = computed(() => {
  const w = currentWo.value
  if (!w) return ''
  return w.code || w.workCode || w.repairCode || w.failureCode || ''
})
const currentStatusText = computed(() => {
  if (!currentWo.value) return ''
  return statusLabel(currentWo.value.status, currentType.value)
})
const scanned = ref(false)
const photoUploaded = ref(0)
const scanBtnType = computed(() => (scanned.value ? 'success' : 'primary'))
const completeDisabled = computed(() => currentType.value === 'failure')

function openDetail(wo: any, type: string) {
  currentWo.value = wo
  currentType.value = type
  scanned.value = false
  photoUploaded.value = 0
  detailVisible.value = true
}

function handleScan() {
  ElMessage.success('扫码成功，设备已确认')
  scanned.value = true
}
function handleTakePhoto() {
  photoUploaded.value += 1
  ElMessage.success('已上传第 ' + photoUploaded.value + ' 张照片')
}
async function handleComplete() {
  if (!currentWo.value) return
  try {
    const tip1 = scanned.value ? '已扫码  ' : '未扫码  '
    const tip2 = photoUploaded.value > 0 ? '已上传 ' + photoUploaded.value + ' 张照片' : '未拍照'
    await ElMessageBox.confirm('确认完工报工？\n' + tip1 + tip2, '完工确认', { confirmButtonText: '确认完工' })
    if (currentType.value === 'maintenance') {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
      const res: any = await request.post({
        url: '/workOrder/eamMaintenanceWork/complete',
        data: { code: currentWo.value.code, startTime: currentWo.value.startTime || now, endTime: now },
      })
      const consumed = res?.consumedSpareParts || []
      ElMessage.success('完工成功' + (consumed.length ? '，已扣 ' + consumed.length + ' 项备件' : ''))
    } else if (currentType.value === 'repair') {
      await request.post({
        url: '/workOrder/eamRepairWorkOrder/complete',
        data: { repairCode: currentWo.value.repairCode, id: currentWo.value.id, repairRecord: '移动端报工' },
      })
      ElMessage.success('维修完工，已通知发起人确认')
    } else if (currentType.value === 'inspection') {
      ElMessage.success('点检完工已记录')
    }
    detailVisible.value = false
    await loadAll()
  } catch (e) {
    /* user cancel */
  }
}

const reportVisible = ref(false)
const reportForm = reactive({ equipmentSn: '', equipmentName: '', remark: '', breakdownLevel: '2', photos: 0 })
function openReportForm() {
  Object.assign(reportForm, { equipmentSn: '', equipmentName: '', remark: '', breakdownLevel: '2', photos: 0 })
  reportVisible.value = true
}
function scanForReport() {
  reportForm.equipmentSn = 'EW-LP-001'
  reportForm.equipmentName = '轻型手动压机'
  ElMessage.success('扫码成功')
}
function addReportPhoto() {
  reportForm.photos += 1
}
async function submitReport() {
  if (!reportForm.equipmentSn || !reportForm.remark) {
    ElMessage.warning('请填写设备编号和故障描述')
    return
  }
  ElMessage.success('报修单已提交，请到 PC 端故障报修页查看新单')
  reportVisible.value = false
  await loadAll()
}

onMounted(loadAll)
</script>

<style scoped>
/* === 容器 === */
.mobile-page { display: flex; gap: 30px; padding: 20px; align-items: flex-start; background: #f5f7fa; min-height: calc(100vh - 120px); }
.mobile-page--standalone { padding: 0; gap: 0; min-height: 100vh; justify-content: center; background: #eef2f6; }
.left-tip { width: 280px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06); }
.left-tip h3 { font-size: 16px; margin-bottom: 12px; color: #303133; }
.left-tip p { font-size: 12px; color: #606266; line-height: 1.7; margin-bottom: 6px; }

/* === 手机外壳框 === */
.phone-shell { width: 380px; height: 780px; border: 12px solid #1f2937; border-radius: 36px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); overflow: hidden; background: #f5f7fa; display: flex; flex-direction: column; position: relative; }
.phone-shell--standalone { width: 100%; max-width: 480px; height: 100vh; border: none; border-radius: 0; box-shadow: none; }
.phone-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 130px; height: 18px; background: #1f2937; border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; z-index: 10; }
.status-bar { background: #1f2937; color: white; padding: 22px 16px 6px; font-size: 11px; display: flex; justify-content: space-between; align-items: center; }

/* === Hero === */
.h5-hero { background: white; padding: 24px 20px 12px; }
.hero-title { font-size: 22px; font-weight: 700; color: #1a202c; line-height: 1.2; }
.hero-sub { font-size: 13px; color: #606266; margin-top: 4px; }

/* === 滚动主体 === */
.h5-body { flex: 1; overflow-y: auto; background: #f5f7fa; padding: 0 16px 80px; }

/* === KPI 大卡 === */
.kpi-card { background: linear-gradient(135deg, #0f4c5c 0%, #145566 100%); color: white; border-radius: 16px; padding: 18px; margin-top: 12px; box-shadow: 0 6px 18px rgba(15, 76, 92, 0.25); position: relative; overflow: hidden; }
.kpi-card::before { content: 'eam'; position: absolute; right: -10px; top: 30px; font-size: 96px; font-weight: 900; opacity: 0.05; letter-spacing: -8px; }
.kpi-head { font-size: 14px; font-weight: 600; opacity: 0.92; }
.kpi-main { margin-top: 8px; display: flex; align-items: baseline; gap: 8px; }
.kpi-num { font-size: 36px; font-weight: 700; }
.kpi-label { font-size: 13px; opacity: 0.85; }
.kpi-sub { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.kpi-sub-item { background: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 10px 12px; }
.kpi-sub-label { font-size: 12px; opacity: 0.85; }
.kpi-sub-num { font-size: 20px; font-weight: 700; margin-top: 2px; }

/* === 节标题 === */
.section-title { font-size: 14px; font-weight: 700; color: #1a202c; margin: 18px 4px 10px; }
.scan-demo-card { display: flex; align-items: center; gap: 14px; padding: 14px 16px; margin-top: 14px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #fff; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
.scan-demo-card:active { transform: scale(0.98); }
.scan-demo-icon { background: rgba(255,255,255,0.2); border-radius: 50%; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.scan-demo-text { flex: 1; }
.scan-demo-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.scan-demo-sub { font-size: 12px; opacity: 0.85; line-height: 1.4; }

/* === 应用 grid === */
.app-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px 8px; background: white; padding: 16px 12px; border-radius: 12px; }
.app-item { display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; }
.app-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; transition: transform 0.15s; }
.app-icon :deep(svg) { width: 24px; height: 24px; }
.app-item:active .app-icon { transform: scale(0.95); }
.app-name { font-size: 12px; color: #4a5568; }

/* === Tab 栏 === */
.tab-bar { display: flex; gap: 6px; background: white; padding: 6px; border-radius: 10px; margin-bottom: 10px; }
.tab-btn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 8px 0; border-radius: 8px; cursor: pointer; font-size: 12px; color: #606266; transition: all 0.15s; }
.tab-btn .tab-count { font-size: 11px; opacity: 0.65; }
.tab-btn.active { background: #0f4c5c; color: white; box-shadow: 0 2px 8px rgba(15, 76, 92, 0.3); }
.tab-btn.active .tab-count { opacity: 1; }

/* === 工单卡 === */
.card-list { padding: 0; }
.empty-tip { text-align: center; color: #909399; padding: 40px 0; font-size: 13px; }
.wo-card { background: white; margin-bottom: 10px; padding: 14px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04); cursor: pointer; transition: transform 0.15s; }
.wo-card:active { transform: scale(0.98); }
.wo-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.wo-code { font-size: 12px; color: #909399; font-family: monospace; }
.wo-title { font-size: 14px; font-weight: 600; color: #1a202c; margin-bottom: 6px; }
.wo-meta { font-size: 12px; color: #606266; margin-top: 3px; }
.wo-fault { color: #ef4444; }
.report-action { padding: 8px 0 16px; }
.full-btn { width: 100%; }

/* === 底部 nav === */
.bottom-nav { position: absolute; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 8px 0 12px; display: flex; justify-content: space-around; box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.04); }
.phone-shell--standalone .bottom-nav { position: fixed; }
.nav-item { display: flex; flex-direction: column; align-items: center; font-size: 11px; color: #909399; gap: 3px; cursor: pointer; padding: 4px 12px; border-radius: 12px; }
.nav-item :deep(svg) { width: 22px; height: 22px; }
.nav-item.active { color: #0f4c5c; font-weight: 600; }

/* === Drawer === */
.scan-success { margin-top: 15px; padding: 10px; background: #f0f9ff; color: #16a34a; font-size: 13px; border-radius: 6px; }
.photo-tip { margin-top: 10px; font-size: 12px; color: #909399; }
.action-row { margin-top: 15px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.photo-count { margin-left: 10px; color: #909399; font-size: 12px; }

/* === 响应式 === */
@media (max-width: 768px) {
  .mobile-page { flex-direction: column; padding: 8px; }
  .left-tip { width: 100%; }
  .phone-shell { width: 100%; max-width: 380px; margin: 0 auto; }
  .mobile-page--standalone .phone-shell { max-width: 100%; }
}
</style>
