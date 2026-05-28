<template>
  <div class="diy-purchase-page">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="自制设备备件采购说明：用于自制线体（PACK 线/电机线/装配线等）的零部件采购，如电机/PLC/伺服驱动器/传感器；流程 = 申请 → 飞书审批 → ERP 生成 PO → 入库" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="申请单号">
          <el-input v-model="queryParams.code" class="!w-200px" clearable placeholder="DIY-PR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="零部件名称">
          <el-input v-model="queryParams.itemName" class="!w-200px" clearable placeholder="如 PLC / 伺服" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="目标线体">
          <el-select v-model="queryParams.targetLine" placeholder="全部" clearable class="!w-180px">
            <el-option label="PACK 线" value="PACK 线" />
            <el-option label="电机扁线绕线机" value="电机扁线绕线机" />
            <el-option label="PCBA 自动测试线" value="PCBA 自动测试线" />
            <el-option label="装配自动锁付线" value="装配自动锁付线" />
            <el-option label="老化测试线" value="老化测试线" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-160px">
            <el-option v-for="o in STATUS_OPTIONS" :key="o.value" :label="o.label" :value="o.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>
    <ContentWrap>
      <div class="mb-10px">
        <el-button plain type="primary" @click="openCreate"><Icon icon="ep:plus" />新增自制设备备件采购</el-button>
        <el-button plain @click="refreshAllStatus"><Icon icon="ep:refresh" />同步飞书/ERP 状态</el-button>
        <span class="ml-10px hint">⚡ 单据推送飞书后，由飞书完成审批+ERP 对接，本页仅展示状态</span>
      </div>
      <el-table :data="filteredList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="申请单号" prop="code" width="160" align="center" />
        <el-table-column label="零部件名称" prop="itemName" min-width="200" />
        <el-table-column label="规格型号" prop="specification" width="150" />
        <el-table-column label="类别" prop="partCategory" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getCategoryColor(row.partCategory)">{{ row.partCategory }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="quantity" width="80" align="center" />
        <el-table-column label="单位" prop="unit" width="70" align="center" />
        <el-table-column label="预估金额" prop="totalAmount" width="120" align="right">
          <template #default="{ row }">¥ {{ Number(row.totalAmount || 0).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="目标线体" prop="targetLine" width="160" align="center">
          <template #default="{ row }">
            <span style="color:#0f4c5c;font-weight:600">{{ row.targetLine }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicantName" width="90" align="center" />
        <el-table-column label="触发来源" prop="triggerSource" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getSourceColor(row.triggerSource)">{{ row.triggerSource }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请日期" prop="applicationDate" width="110" align="center" />
        <el-table-column label="要求到货日期" width="120" align="center">
          <template #default="{ row }">
            <span>{{ getExpectedDate(row) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="距到货" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getDueTagType(row)">{{ getDueLabel(row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="110" align="center">
          <template #default="{ row }"><el-tag :type="getStatusColor(row.status)">{{ getStatusName(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="ERP 到货单号" prop="erpPurchaseOrderNo" width="140" align="center" />
        <el-table-column label="操作" width="340" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)"><Icon icon="ep:view" />详情</el-button>
            <el-button v-if="canEdit(row)" link type="primary" @click="openEdit(row)"><Icon icon="ep:edit" />编辑</el-button>
            <el-button v-if="canPushToFeishu(row)" link type="success" @click="handlePushFeishu(row)"><Icon icon="ep:promotion" />推送飞书</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="primary" @click="openFeishu(row)"><Icon icon="ep:link" />飞书单据</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="warning" @click="refreshOne(row)">刷新状态</el-button>
            <el-button v-if="canResubmit(row)" link type="primary" @click="handleResubmit(row)">重新申请</el-button>
            <el-button v-if="canRetryPush(row)" link type="warning" @click="handleRetryPush(row)">重试推送</el-button>
            <el-button v-if="canDelete(row)" link type="danger" @click="handleDelete(row)"><Icon icon="ep:delete" />删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <el-dialog v-model="formVisible" :title="formMode === 'create' ? '新增自制设备备件采购' : '编辑自制设备备件采购'" width="700px">
      <el-form :model="formData" label-position="top">
        <el-row :gutter="14">
          <el-col :span="12">
            <el-form-item label="零部件名称" required>
              <el-input v-model="formData.itemName" placeholder="如 西门子 PLC / 安川伺服" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号" required>
              <el-input v-model="formData.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="零部件类别">
              <el-select v-model="formData.partCategory" class="w-100%">
                <el-option label="电气元件" value="电气元件" />
                <el-option label="控制器" value="控制器" />
                <el-option label="驱动器" value="驱动器" />
                <el-option label="传感器" value="传感器" />
                <el-option label="气动元件" value="气动元件" />
                <el-option label="机械传动" value="机械传动" />
                <el-option label="人机界面" value="人机界面" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" required>
              <el-input-number v-model="formData.quantity" :min="1" class="w-100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位">
              <el-input v-model="formData.unit" placeholder="台/件/套" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标线体" required>
              <el-select v-model="formData.targetLine" class="w-100%">
                <el-option label="PACK 线" value="PACK 线" />
                <el-option label="电机扁线绕线机" value="电机扁线绕线机" />
                <el-option label="PCBA 自动测试线" value="PCBA 自动测试线" />
                <el-option label="装配自动锁付线" value="装配自动锁付线" />
                <el-option label="老化测试线" value="老化测试线" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="触发来源">
              <el-radio-group v-model="formData.triggerSource">
                <el-radio-button label="调试缺件">调试缺件</el-radio-button>
                <el-radio-button label="扩展改造">扩展改造</el-radio-button>
                <el-radio-button label="损坏更换">损坏更换</el-radio-button>
                <el-radio-button label="新建立项">新建立项</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人" required>
              <el-input v-model="formData.applicantName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预估金额">
              <el-input-number v-model="formData.totalAmount" :min="0" class="w-100%" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="用途说明">
              <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="该零部件用于自制线体的具体位置 / 工艺需求" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存草稿</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" :title="`自制设备备件采购详情 - ${detailRow?.code}`" width="640px">
      <el-descriptions v-if="detailRow" :column="2" border size="small">
        <el-descriptions-item label="申请单号">{{ detailRow.code }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="getStatusColor(detailRow.status)">{{ getStatusName(detailRow.status) }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="零部件名称">{{ detailRow.itemName }}</el-descriptions-item>
        <el-descriptions-item label="规格型号">{{ detailRow.specification }}</el-descriptions-item>
        <el-descriptions-item label="类别">{{ detailRow.partCategory }}</el-descriptions-item>
        <el-descriptions-item label="数量">{{ detailRow.quantity }} {{ detailRow.unit }}</el-descriptions-item>
        <el-descriptions-item label="预估金额">¥ {{ Number(detailRow.totalAmount || 0).toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="目标线体">{{ detailRow.targetLine }}</el-descriptions-item>
        <el-descriptions-item label="触发来源">{{ detailRow.triggerSource }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detailRow.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ detailRow.applicationDate }}</el-descriptions-item>
        <el-descriptions-item label="ERP 单号">{{ detailRow.erpPurchaseOrderNo || '—' }}</el-descriptions-item>
        <el-descriptions-item label="用途说明" :span="2">{{ detailRow.remark || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamDiyEquipmentPartPurchase">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  FEISHU_STATUS_OPTIONS as STATUS_OPTIONS,
  getStatusName, getStatusColor, normalizeStatus,
  canEdit, canPushToFeishu, canDelete, canRetryPush, canResubmit, hasFeishuTicket,
  simulateNextStatus, buildFeishuUrl
} from '../_purchase-shared/feishu-status'
function getCategoryColor(c: string): any {
  if (c === '控制器' || c === '驱动器') return 'warning'
  if (c === '传感器' || c === '人机界面') return 'success'
  if (c === '气动元件' || c === '机械传动') return 'info'
  return ''
}
function getSourceColor(s: string): any {
  if (s === '调试缺件') return 'warning'
  if (s === '损坏更换') return 'danger'
  if (s === '新建立项') return 'success'
  return ''
}

/** 要求到货日期：从行数据取，如果 mock 没有则按申请日 + 30 天估算 */
function getExpectedDate(row: any): string {
  if (row.expectedArrivalDate) return row.expectedArrivalDate
  if (!row.applicationDate) return '—'
  const d = new Date(row.applicationDate)
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}
/** 距到货天数（正：还有 N 天 / 负：已逾期 N 天 / 0：今天） */
function dueDays(row: any): number {
  const target = getExpectedDate(row)
  if (target === '—') return 999
  const diff = new Date(target).getTime() - Date.now()
  return Math.ceil(diff / (24 * 3600 * 1000))
}
/** 红黄绿三档：>15 天绿 / 7-15 天黄 / <7 天红 / 已逾期红 / 已到货灰 */
function getDueTagType(row: any): any {
  if (row.status === '已到货' || row.status === 'ARRIVED') return 'info'
  const d = dueDays(row)
  if (d < 0) return 'danger'
  if (d <= 7) return 'danger'
  if (d <= 15) return 'warning'
  return 'success'
}
function getDueLabel(row: any): string {
  if (row.status === '已到货' || row.status === 'ARRIVED') return '已到货'
  const d = dueDays(row)
  if (d < 0) return `逾期 ${-d} 天`
  if (d === 0) return '今日到货'
  return `还有 ${d} 天`
}

const queryParams = reactive({ code: '', itemName: '', targetLine: '', status: '' })
const list = ref<any[]>([
  { id: 'DIY01', code: 'DIY-PR-2026-001', itemName: '西门子 S7-1200 PLC', specification: 'CPU 1214C DC/DC/DC', partCategory: '控制器', quantity: 2, unit: '台', totalAmount: 8600, targetLine: 'PACK 线', applicantName: '张工', triggerSource: '扩展改造', applicationDate: '2026-04-12', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0421', remark: 'PACK 线扩展第二工位主控' },
  { id: 'DIY02', code: 'DIY-PR-2026-002', itemName: '安川伺服电机', specification: 'SGM7J-A5A 750W', partCategory: '驱动器', quantity: 4, unit: '套', totalAmount: 18800, targetLine: '电机扁线绕线机', applicantName: '李伟', triggerSource: '新建立项', applicationDate: '2026-04-15', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0438', remark: '新机型 4 轴联动' },
  { id: 'DIY03', code: 'DIY-PR-2026-003', itemName: '基恩士光电传感器', specification: 'PR-G51N3', partCategory: '传感器', quantity: 8, unit: '个', totalAmount: 1840, targetLine: 'PACK 线', applicantName: '刘朋朋', triggerSource: '损坏更换', applicationDate: '2026-04-18', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '', remark: '点胶位置识别异常' },
  { id: 'DIY04', code: 'DIY-PR-2026-004', itemName: '台达变频器', specification: 'VFD007EL21A 0.75kW', partCategory: '驱动器', quantity: 2, unit: '台', totalAmount: 1320, targetLine: '装配自动锁付线', applicantName: '严欢欢', triggerSource: '扩展改造', applicationDate: '2026-04-20', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '', remark: '锁付线传送带调速' },
  { id: 'DIY05', code: 'DIY-PR-2026-005', itemName: '威纶通触摸屏', specification: 'MT8071iE 7寸', partCategory: '人机界面', quantity: 1, unit: '台', totalAmount: 980, targetLine: 'PCBA 自动测试线', applicantName: '陈工', triggerSource: '调试缺件', applicationDate: '2026-04-22', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '', remark: '操作界面触摸失灵' },
  { id: 'DIY06', code: 'DIY-PR-2026-006', itemName: 'SMC 电磁阀', specification: 'SY5120-5LZD-01', partCategory: '气动元件', quantity: 12, unit: '个', totalAmount: 1560, targetLine: 'PACK 线', applicantName: '陆钟', triggerSource: '损坏更换', applicationDate: '2026-04-23', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0492', remark: '吸盘真空控制阀批量更换' },
  { id: 'DIY07', code: 'DIY-PR-2026-007', itemName: '欧姆龙安全继电器', specification: 'G9SE-201 24VDC', partCategory: '电气元件', quantity: 3, unit: '个', totalAmount: 2400, targetLine: '装配自动锁付线', applicantName: '严欢欢', triggerSource: '新建立项', applicationDate: '2026-04-24', status: 'DRAFT', erpPurchaseOrderNo: '', remark: '新增安全门联锁' },
  { id: 'DIY08', code: 'DIY-PR-2026-008', itemName: '海德汉光栅尺', specification: 'LS 187 220mm', partCategory: '传感器', quantity: 1, unit: '套', totalAmount: 4800, targetLine: '电机扁线绕线机', applicantName: '李伟', triggerSource: '扩展改造', applicationDate: '2026-04-25', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '', remark: 'Z 轴定位精度升级' },
  { id: 'DIY09', code: 'DIY-PR-2026-009', itemName: '欧姆龙旋转编码器', specification: 'E6B2-CWZ6C 1024P/R', partCategory: '传感器', quantity: 2, unit: '个', totalAmount: 760, targetLine: '老化测试线', applicantName: '王组长', triggerSource: '损坏更换', applicationDate: '2026-04-25', status: 'PUSH_FAILED', erpPurchaseOrderNo: '', remark: '老化转盘旋转计数' },
  { id: 'DIY10', code: 'DIY-PR-2026-010', itemName: '研华工控机', specification: 'IPC-510 i5/8G/256SSD', partCategory: '控制器', quantity: 1, unit: '台', totalAmount: 6800, targetLine: 'PCBA 自动测试线', applicantName: '陈工', triggerSource: '新建立项', applicationDate: '2026-04-26', status: 'FEISHU_REJECTED', erpPurchaseOrderNo: '', remark: '财务驳回：预算已用完，建议二季度' }
])

const filteredList = computed(() => list.value.filter(x => {
  if (queryParams.code && !(x.code || '').includes(queryParams.code)) return false
  if (queryParams.itemName && !(x.itemName || '').includes(queryParams.itemName)) return false
  if (queryParams.targetLine && x.targetLine !== queryParams.targetLine) return false
  if (queryParams.status && x.status !== queryParams.status) return false
  return true
}))

function loadList() { /* 静态 mock */ }
function resetQuery() { Object.assign(queryParams, { code: '', itemName: '', targetLine: '', status: '' }) }

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formData = reactive<any>({})
function openCreate() {
  formMode.value = 'create'
  Object.assign(formData, { itemName: '', specification: '', partCategory: '电气元件', quantity: 1, unit: '台', targetLine: 'PACK 线', triggerSource: '调试缺件', applicantName: '', totalAmount: 0, remark: '' })
  formVisible.value = true
}
function openEdit(row: any) {
  formMode.value = 'edit'
  Object.assign(formData, { ...row })
  formVisible.value = true
}
function submitForm() {
  if (!formData.itemName || !formData.applicantName || !formData.targetLine) { ElMessage.warning('请填写零部件名称、目标线体、申请人'); return }
  if (formMode.value === 'create') {
    list.value.unshift({
      id: 'DIY' + Date.now(),
      code: 'DIY-PR-2026-' + String(list.value.length + 1).padStart(3, '0'),
      ...formData,
      applicationDate: new Date().toISOString().slice(0, 10),
      status: 'DRAFT',
      erpPurchaseOrderNo: ''
    })
  } else {
    const idx = list.value.findIndex(x => x.id === formData.id)
    if (idx >= 0) list.value[idx] = { ...list.value[idx], ...formData }
  }
  ElMessage.success('保存成功')
  formVisible.value = false
}

async function handlePushFeishu(row: any) {
  await ElMessageBox.confirm('推送到飞书「物品需求单」后由飞书完成审批 + ERP 对接，本系统仅展示状态', '推送飞书', { type: 'warning' })
  row.status = 'PUSHED_TO_FEISHU'
  row.feishuTicketCode = 'FS-' + Date.now()
  ElMessage.success('已推送飞书，请到飞书查看审批进度')
}
function openFeishu(row: any) {
  window.open(buildFeishuUrl(row), '_blank')
}
async function refreshOne(row: any) {
  const next = simulateNextStatus(row.status)
  if (next === row.status) { ElMessage.info('当前已是最终状态'); return }
  row.status = next
  if (next === 'DELIVERED') {
    row.erpPurchaseOrderNo = 'PO-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + String(Math.floor(Math.random()*1000)).padStart(3, '0')
  }
  ElMessage.success('已同步：' + getStatusName(next))
}
async function refreshAllStatus() {
  let updated = 0
  list.value.forEach(row => {
    const next = simulateNextStatus(row.status)
    if (next !== row.status) {
      row.status = next
      if (next === 'DELIVERED' && !row.erpPurchaseOrderNo) {
        row.erpPurchaseOrderNo = 'PO-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + String(Math.floor(Math.random()*1000)).padStart(3, '0')
      }
      updated++
    }
  })
  ElMessage.success('已同步飞书/ERP 状态，' + updated + ' 单有更新')
}
function handleResubmit(row: any) {
  row.status = 'DRAFT'
  ElMessage.success('已重置为草稿，可重新编辑后推送')
}
async function handleRetryPush(row: any) {
  await ElMessageBox.confirm('重新推送到飞书？', '重试推送', { type: 'warning' })
  row.status = 'PUSHED_TO_FEISHU'
  ElMessage.success('已重新推送飞书')
}
async function handleDelete(row: any) {
  await ElMessageBox.confirm('删除草稿后无法恢复，确认？', '删除', { type: 'warning' })
  list.value = list.value.filter(x => x.id !== row.id)
  ElMessage.success('已删除')
}

const detailVisible = ref(false)
const detailRow = ref<any>(null)
function openDetail(row: any) { detailRow.value = row; detailVisible.value = true }

onMounted(loadList)
</script>

<style scoped>
.diy-purchase-page { padding: 12px; }
.hint { color: #909399; font-size: 12px; }
</style>
