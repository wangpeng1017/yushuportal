<template>
  <div class="purchase-dashboard">
    <!-- 顶部 4 张统计卡 -->
    <ContentWrap>
      <div class="stat-grid">
        <div class="stat-card danger" @click="filterTab = 'overdue'">
          <div class="stat-icon">⚠️</div>
          <div class="stat-num">{{ stats.overdue }}</div>
          <div class="stat-label">已逾期 <small>需立即处置</small></div>
        </div>
        <div class="stat-card warn" @click="filterTab = 'urgent'">
          <div class="stat-icon">🔥</div>
          <div class="stat-num">{{ stats.urgent }}</div>
          <div class="stat-label">紧急到货 <small>≤ 7 天</small></div>
        </div>
        <div class="stat-card primary" @click="filterTab = 'soon'">
          <div class="stat-icon">📦</div>
          <div class="stat-num">{{ stats.soon }}</div>
          <div class="stat-label">即将到货 <small>7-15 天</small></div>
        </div>
        <div class="stat-card success" @click="filterTab = 'arrived'">
          <div class="stat-icon">✅</div>
          <div class="stat-num">{{ stats.arrived }}</div>
          <div class="stat-label">已到货 <small>本月累计</small></div>
        </div>
      </div>
    </ContentWrap>

    <!-- 二级筛选 + 列表 -->
    <ContentWrap>
      <el-radio-group v-model="filterTab" class="mb-12px">
        <el-radio-button value="all">全部 ({{ list.length }})</el-radio-button>
        <el-radio-button value="overdue">已逾期 ({{ stats.overdue }})</el-radio-button>
        <el-radio-button value="urgent">紧急到货 ({{ stats.urgent }})</el-radio-button>
        <el-radio-button value="soon">即将到货 ({{ stats.soon }})</el-radio-button>
        <el-radio-button value="arrived">已到货 ({{ stats.arrived }})</el-radio-button>
      </el-radio-group>

      <el-alert v-if="filterTab === 'overdue' && stats.overdue > 0"
        type="error" :closable="false" show-icon class="mb-12px"
        :title="`⚠️ 当前有 ${stats.overdue} 单已逾期，请联系采购催货并升级处置（自动同步通知项目经理 / 采购主管）`" />

      <el-table :data="filtered" stripe>
        <el-table-column type="index" label="#" width="50" align="center" />
        <el-table-column prop="code" label="申请单号" width="160" align="center" />
        <el-table-column prop="itemName" label="零部件" min-width="180" />
        <el-table-column prop="specification" label="规格" min-width="160" />
        <el-table-column prop="quantity" label="数量" width="80" align="center" />
        <el-table-column prop="targetLine" label="目标线体" width="160" align="center" />
        <el-table-column label="申请日期" width="110" align="center" prop="applicationDate" />
        <el-table-column label="要求到货日期" width="120" align="center">
          <template #default="{row}">{{ getExpectedDate(row) }}</template>
        </el-table-column>
        <el-table-column label="距到货" width="120" align="center" sortable :sort-method="(a,b) => dueDays(a) - dueDays(b)">
          <template #default="{row}">
            <el-tag size="small" :type="getDueTagType(row)">{{ getDueLabel(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100" align="center" prop="status">
          <template #default="{row}">
            <el-tag size="small" :type="getStatusColor(row.status)">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="ERP 单号" prop="erpPurchaseOrderNo" width="140" align="center" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{row}">
            <el-button v-if="dueDays(row) < 7 && row.status !== '已到货'" link type="warning" @click="msg('已通知供应商催货 + 推送钉钉给采购员（Demo）')">⚡ 催货</el-button>
            <el-button link type="primary" @click="goDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <!-- 趋势示意（简易柱状图） -->
    <ContentWrap>
      <h3 class="section-title">📈 未来 30 天到货分布</h3>
      <div class="chart-grid">
        <div v-for="(d, i) in dayBuckets" :key="i" class="bar-col" :title="`${d.label}：${d.count} 单`">
          <div class="bar" :style="{ height: (d.count * 24 + 4) + 'px', background: d.color }">
            <span class="bar-num">{{ d.count || '' }}</span>
          </div>
          <div class="bar-label">{{ d.shortLabel }}</div>
        </div>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="dot" style="background:#f56c6c;"></span>已逾期</span>
        <span class="legend-item"><span class="dot" style="background:#e6a23c;"></span>≤7 天</span>
        <span class="legend-item"><span class="dot" style="background:#409eff;"></span>7-15 天</span>
        <span class="legend-item"><span class="dot" style="background:#67c23a;"></span>>15 天</span>
      </div>
    </ContentWrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

defineOptions({ name: 'EamDiyPurchaseDashboard' })

const message = useMessage()
const router = useRouter()

const list = ref<any[]>([])
const filterTab = ref<'all' | 'overdue' | 'urgent' | 'soon' | 'arrived'>('all')

/** 静态 mock 数据（与 page.vue 同源，加上 expectedArrivalDate 用于看板演示） */
const STATIC_DATA = [
  { code: 'DIY-PR-2026-001', itemName: '西门子 S7-1200 PLC', specification: 'CPU 1214C DC/DC/DC', quantity: 2, targetLine: 'PACK 线', applicantName: '张工', applicationDate: '2026-04-12', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0421', expectedArrivalDate: '2026-04-28' },
  { code: 'DIY-PR-2026-002', itemName: '安川伺服电机', specification: 'SGM7J-A5A 750W', quantity: 4, targetLine: '电机扁线绕线机', applicantName: '李伟', applicationDate: '2026-04-15', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0438', expectedArrivalDate: '2026-05-02' },
  { code: 'DIY-PR-2026-003', itemName: '基恩士光电传感器', specification: 'PR-G51N3', quantity: 8, targetLine: 'PACK 线', applicantName: '刘朋朋', applicationDate: '2026-04-18', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-05' },
  { code: 'DIY-PR-2026-004', itemName: '台达变频器', specification: 'VFD007EL21A 0.75kW', quantity: 2, targetLine: '装配自动锁付线', applicantName: '严欢欢', applicationDate: '2026-04-20', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-12' },
  { code: 'DIY-PR-2026-005', itemName: '威纶通触摸屏', specification: 'MT8071iE 7寸', quantity: 1, targetLine: 'PCBA 自动测试线', applicantName: '陈工', applicationDate: '2026-04-22', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-15' },
  { code: 'DIY-PR-2026-006', itemName: 'SMC 电磁阀', specification: 'SY5120-5LZD-01', quantity: 12, targetLine: 'PACK 线', applicantName: '陆钟', applicationDate: '2026-04-23', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0492', expectedArrivalDate: '2026-05-08' },
  { code: 'DIY-PR-2026-007', itemName: '欧姆龙安全继电器', specification: 'G9SE-201 24VDC', quantity: 3, targetLine: '装配自动锁付线', applicantName: '严欢欢', applicationDate: '2026-04-24', status: 'DRAFT', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-20' },
  { code: 'DIY-PR-2026-008', itemName: '海德汉光栅尺', specification: 'LS 187 220mm', quantity: 1, targetLine: '电机扁线绕线机', applicantName: '李伟', applicationDate: '2026-04-25', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-25' },
  { code: 'DIY-PR-2026-009', itemName: '欧姆龙旋转编码器', specification: 'E6B2-CWZ6C', quantity: 2, targetLine: '老化测试线', applicantName: '王组长', applicationDate: '2026-04-25', status: 'PUSH_FAILED', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-05-30' },
  { code: 'DIY-PR-2026-010', itemName: '研华工控机', specification: 'IPC-510 i5/8G/256SSD', quantity: 1, targetLine: 'PCBA 自动测试线', applicantName: '陈工', applicationDate: '2026-04-26', status: 'FEISHU_REJECTED', erpPurchaseOrderNo: '', expectedArrivalDate: '2026-06-08' },
  // 加几条逾期 / 紧急到货案例（基于今天 2026-05-10）
  { code: 'DIY-PR-2026-011', itemName: '欧姆龙安全继电器（备）', specification: 'G9SX-AD322', quantity: 5, targetLine: 'PACK 线', applicantName: '张工', applicationDate: '2026-04-05', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: 'PO-2026-04-0501', expectedArrivalDate: '2026-05-05' },
  { code: 'DIY-PR-2026-012', itemName: 'KEYENCE 视觉相机', specification: 'CV-X150F', quantity: 2, targetLine: 'PCBA 自动测试线', applicantName: '陈工', applicationDate: '2026-04-08', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: 'PO-2026-04-0511', expectedArrivalDate: '2026-04-30' },
  { code: 'DIY-PR-2026-013', itemName: '滑动导轨 30mm', specification: 'HIWIN HGR30R 800mm', quantity: 4, targetLine: '电机扁线绕线机', applicantName: '李伟', applicationDate: '2026-04-22', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: 'PO-2026-04-0529', expectedArrivalDate: '2026-05-13' },
  { code: 'DIY-PR-2026-014', itemName: '气缸 SMC CDQ2A40', specification: 'CDQ2A40-50DM', quantity: 6, targetLine: '装配自动锁付线', applicantName: '严欢欢', applicationDate: '2026-04-25', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: 'PO-2026-04-0541', expectedArrivalDate: '2026-05-15' }
]

async function load() {
  list.value = STATIC_DATA.map(r => ({ ...r }))
}

function getExpectedDate(row: any): string {
  return row.expectedArrivalDate || '—'
}
function dueDays(row: any): number {
  const target = getExpectedDate(row)
  if (target === '—') return 999
  const diff = new Date(target).getTime() - Date.now()
  return Math.ceil(diff / (24 * 3600 * 1000))
}
function isArrived(row: any): boolean {
  return row.status === '已到货' || row.status === 'ARRIVED' || row.status === 'DELIVERED'
}
function getDueTagType(row: any): any {
  if (isArrived(row)) return 'info'
  const d = dueDays(row)
  if (d < 0) return 'danger'
  if (d <= 7) return 'danger'
  if (d <= 15) return 'warning'
  return 'success'
}
function getDueLabel(row: any): string {
  if (isArrived(row)) return '已到货'
  const d = dueDays(row)
  if (d < 0) return `逾期 ${-d} 天`
  if (d === 0) return '今日到货'
  return `还有 ${d} 天`
}
function getStatusColor(s: string): any {
  if (s === 'DELIVERED' || s === '已到货') return 'success'
  if (s === 'FEISHU_APPROVED' || s === '已审批') return 'primary'
  if (s === 'FEISHU_APPROVING' || s === '飞书审批中') return 'warning'
  if (s === 'FEISHU_REJECTED' || s === '已驳回' || s === 'PUSH_FAILED') return 'danger'
  return 'info'
}
function getStatusName(s: string): string {
  const map: any = {
    DRAFT: '草稿', FEISHU_APPROVING: '飞书审批中', FEISHU_APPROVED: '已审批',
    FEISHU_REJECTED: '已驳回', PUSH_FAILED: '推送失败', DELIVERED: '已到货'
  }
  return map[s] || s || '—'
}

const stats = computed(() => ({
  overdue: list.value.filter(r => !isArrived(r) && dueDays(r) < 0).length,
  urgent: list.value.filter(r => !isArrived(r) && dueDays(r) >= 0 && dueDays(r) <= 7).length,
  soon: list.value.filter(r => !isArrived(r) && dueDays(r) > 7 && dueDays(r) <= 15).length,
  arrived: list.value.filter(r => isArrived(r)).length
}))

const filtered = computed(() => {
  if (filterTab.value === 'all') return list.value
  if (filterTab.value === 'overdue') return list.value.filter(r => !isArrived(r) && dueDays(r) < 0)
  if (filterTab.value === 'urgent') return list.value.filter(r => !isArrived(r) && dueDays(r) >= 0 && dueDays(r) <= 7)
  if (filterTab.value === 'soon') return list.value.filter(r => !isArrived(r) && dueDays(r) > 7 && dueDays(r) <= 15)
  if (filterTab.value === 'arrived') return list.value.filter(r => isArrived(r))
  return list.value
})

/** 30 天分桶柱状图（演示） */
const dayBuckets = computed(() => {
  const buckets = [
    { label: '已逾期', shortLabel: '逾期', count: stats.value.overdue, color: '#f56c6c' },
    { label: '0-3 天', shortLabel: '0-3', count: list.value.filter(r => !isArrived(r) && dueDays(r) >= 0 && dueDays(r) <= 3).length, color: '#e6a23c' },
    { label: '4-7 天', shortLabel: '4-7', count: list.value.filter(r => !isArrived(r) && dueDays(r) > 3 && dueDays(r) <= 7).length, color: '#e6a23c' },
    { label: '8-15 天', shortLabel: '8-15', count: stats.value.soon, color: '#409eff' },
    { label: '16-30 天', shortLabel: '16-30', count: list.value.filter(r => !isArrived(r) && dueDays(r) > 15 && dueDays(r) <= 30).length, color: '#67c23a' },
    { label: '>30 天', shortLabel: '>30', count: list.value.filter(r => !isArrived(r) && dueDays(r) > 30).length, color: '#67c23a' }
  ]
  return buckets
})

function goDetail(row: any) {
  router.push({ path: '/eam/project/diyEquipmentPartPurchase', query: { code: row.code } })
}
function msg(t: string) { message.success(t) }

onMounted(load)
</script>

<style scoped>
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 18px 20px;
  border-left: 5px solid #409eff;
  box-shadow: 0 1px 4px rgba(0,21,41,0.05);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,21,41,0.1); }
.stat-card.danger { border-left-color: #f56c6c; background: #fff; }
.stat-card.warn { border-left-color: #909399; background: #fff; }
.stat-card.primary { border-left-color: #409eff; background: #fff; }
.stat-card.success { border-left-color: #909399; background: #fff; }
.stat-icon { font-size: 24px; }
.stat-num { font-size: 32px; font-weight: 700; color: #303133; line-height: 1.1; margin-top: 4px; }
.stat-label { color: #606266; font-size: 13px; margin-top: 4px; }
.stat-label small { color: #909399; font-size: 11px; margin-left: 6px; }

.section-title { margin: 0 0 16px 0; font-size: 14px; color: #303133; padding-bottom: 6px; border-bottom: 2px solid #409eff; display: inline-block; padding-right: 16px; }

.chart-grid { display: flex; gap: 24px; align-items: flex-end; padding: 20px 12px; height: 220px; background: #fafafa; border-radius: 4px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px; }
.bar { width: 60%; min-height: 4px; border-radius: 4px 4px 0 0; transition: height 0.4s; position: relative; }
.bar-num { position: absolute; top: -22px; left: 50%; transform: translateX(-50%); font-size: 13px; font-weight: 600; color: #303133; }
.bar-label { color: #909399; font-size: 12px; }

.legend { margin-top: 12px; display: flex; gap: 20px; justify-content: center; }
.legend-item { font-size: 12px; color: #606266; display: flex; align-items: center; gap: 4px; }
.legend .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
</style>
