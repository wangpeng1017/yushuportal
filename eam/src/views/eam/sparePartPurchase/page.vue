<template>
  <div class="spare-part-purchase-page">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件采购说明：触发来源 = 安全库存预警 / 维修工单缺件 / 计划性补货；流程 = 申请 → 飞书审批 → ERP 生成 PO → 入库扣账" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="申请单号">
          <el-input v-model="queryParams.code" class="!w-200px" clearable placeholder="SP-PR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.itemName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-200px">
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
        <el-button plain type="primary" @click="openCreate"><Icon icon="ep:plus" />新增采购申请</el-button>
        <el-button plain @click="refreshAllStatus"><Icon icon="ep:refresh" />同步飞书/ERP 状态</el-button>
        <span class="ml-10px hint">⚡ 单据推送飞书后，由飞书完成审批+ERP 对接，本页仅展示状态</span>
      </div>
      <el-table :data="filteredList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="申请单号" prop="code" width="160" align="center" />
        <el-table-column label="备件名称" prop="itemName" min-width="180" />
        <el-table-column label="规格型号" prop="specification" width="140" />
        <el-table-column label="申请数量" prop="quantity" width="90" align="center" />
        <el-table-column label="单位" prop="unit" width="70" align="center" />
        <el-table-column label="预估金额" prop="totalAmount" width="120" align="right">
          <template #default="{ row }">¥ {{ Number(row.totalAmount || 0).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicantName" width="90" align="center" />
        <el-table-column label="所属库房" prop="warehouseTypeText" width="140" align="center" />
        <el-table-column label="触发来源" prop="triggerSourceText" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.triggerSource === 'warning' ? 'danger' : (row.triggerSource === 'workOrder' ? 'warning' : '')">
              {{ row.triggerSourceText }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请日期" prop="applicationDate" width="110" align="center" />
        <el-table-column label="状态" prop="status" width="120" align="center">
          <template #default="{ row }"><el-tag :type="getStatusColor(row.status)">{{ getStatusName(row.status) }}</el-tag></template>
        </el-table-column>
        <el-table-column label="ERP 到货单号" prop="erpPurchaseOrderNo" width="140" align="center" />
        <el-table-column label="操作" width="320" align="center" fixed="right">
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

    <el-dialog v-model="formVisible" :title="formMode === 'create' ? '新增备件采购申请' : '编辑备件采购申请'" width="640px">
      <el-form :model="formData" label-width="100px" label-position="top">
        <el-row :gutter="14">
          <el-col :span="12">
            <el-form-item label="备件编号" required>
              <el-input v-model="formData.partNumber" placeholder="如 BJ-XXX" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备件名称" required>
              <el-input v-model="formData.itemName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号">
              <el-input v-model="formData.specification" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请数量" required>
              <el-input-number v-model="formData.quantity" :min="1" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单位">
              <el-input v-model="formData.unit" placeholder="管/桶/个" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属库房">
              <el-select v-model="formData.warehouseType" class="w-100%">
                <el-option label="设备维修备件库" value="1" />
                <el-option label="自动化备件库" value="2" />
                <el-option label="B 端关键备件库" value="3" />
                <el-option label="CNC 设备备件库" value="4" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="触发来源">
              <el-radio-group v-model="formData.triggerSource">
                <el-radio-button label="warning">安全库存预警</el-radio-button>
                <el-radio-button label="workOrder">维修工单</el-radio-button>
                <el-radio-button label="plan">计划补货</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input v-model="formData.applicantName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预估金额">
              <el-input-number v-model="formData.totalAmount" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="formData.remark" type="textarea" :rows="2" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存草稿</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailVisible" :title="`备件采购详情 - ${detailRow?.code}`" width="640px">
      <el-descriptions v-if="detailRow" :column="2" border size="small">
        <el-descriptions-item label="申请单号">{{ detailRow.code }}</el-descriptions-item>
        <el-descriptions-item label="状态"><el-tag :type="getStatusColor(detailRow.status)">{{ getStatusName(detailRow.status) }}</el-tag></el-descriptions-item>
        <el-descriptions-item label="备件名称">{{ detailRow.itemName }}</el-descriptions-item>
        <el-descriptions-item label="规格型号">{{ detailRow.specification }}</el-descriptions-item>
        <el-descriptions-item label="申请数量">{{ detailRow.quantity }} {{ detailRow.unit }}</el-descriptions-item>
        <el-descriptions-item label="预估金额">¥ {{ Number(detailRow.totalAmount || 0).toLocaleString() }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ detailRow.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="申请日期">{{ detailRow.applicationDate }}</el-descriptions-item>
        <el-descriptions-item label="所属库房">{{ detailRow.warehouseTypeText }}</el-descriptions-item>
        <el-descriptions-item label="触发来源">{{ detailRow.triggerSourceText }}</el-descriptions-item>
        <el-descriptions-item label="ERP 单号" :span="2">{{ detailRow.erpPurchaseOrderNo || '—' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  FEISHU_STATUS_OPTIONS as STATUS_OPTIONS,
  getStatusName, getStatusColor, normalizeStatus,
  canEdit, canPushToFeishu, canDelete, canRetryPush, canResubmit, hasFeishuTicket,
  simulateNextStatus, buildFeishuUrl
} from '../_purchase-shared/feishu-status'

const queryParams = reactive({ code: '', itemName: '', status: '' })
const list = ref<any[]>([
  { id: 'SPP01', code: 'SP-PR-2026-001', itemName: 'NSK PS-2润滑脂', specification: '0.5g/次', quantity: 10, unit: '管', totalAmount: 350, applicantName: '陆钟', warehouseType: '1', warehouseTypeText: '设备维修备件库', triggerSource: 'warning', triggerSourceText: '安全库存预警', applicationDate: '2026-04-22', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0501' },
  { id: 'SPP02', code: 'SP-PR-2026-002', itemName: '注塑机温控模块', specification: 'TC-48', quantity: 2, unit: '块', totalAmount: 5360, applicantName: '彭向', warehouseType: '4', warehouseTypeText: 'CNC设备备件库', triggerSource: 'workOrder', triggerSourceText: '维修工单缺件', applicationDate: '2026-04-14', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '' },
  { id: 'SPP03', code: 'SP-PR-2026-003', itemName: '检测探针 0.5mm', specification: '弹簧探针', quantity: 8, unit: '组', totalAmount: 1160, applicantName: '严欢欢', warehouseType: '3', warehouseTypeText: 'B端关键备件库', triggerSource: 'warning', triggerSourceText: '安全库存预警', applicationDate: '2026-04-25', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '' },
  { id: 'SPP04', code: 'SP-PR-2026-004', itemName: '485通讯端子', specification: '标准', quantity: 20, unit: '个', totalAmount: 250, applicantName: '李伟', warehouseType: '2', warehouseTypeText: '自动化备件库', triggerSource: 'plan', triggerSourceText: '计划补货', applicationDate: '2026-04-26', status: 'DRAFT', erpPurchaseOrderNo: '' },
  { id: 'SPP05', code: 'SP-PR-2026-005', itemName: 'CNC 主轴轴承', specification: '7014C', quantity: 1, unit: '套', totalAmount: 3850, applicantName: '刚嘉成', warehouseType: '4', warehouseTypeText: 'CNC设备备件库', triggerSource: 'workOrder', triggerSourceText: '维修工单缺件', applicationDate: '2026-04-17', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0489' },
  { id: 'SPP06', code: 'SP-PR-2026-006', itemName: '伺服电机驱动器', specification: 'V90 400W', quantity: 2, unit: '台', totalAmount: 6400, applicantName: '李伟', warehouseType: '2', warehouseTypeText: '自动化备件库', triggerSource: 'workOrder', triggerSourceText: '维修工单缺件', applicationDate: '2026-04-19', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0463' },
  { id: 'SPP07', code: 'SP-PR-2026-007', itemName: '电极头', specification: 'φ16', quantity: 6, unit: '对', totalAmount: 390, applicantName: '买盼', warehouseType: '3', warehouseTypeText: 'B端关键备件库', triggerSource: 'plan', triggerSourceText: '计划补货', applicationDate: '2026-04-20', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0145' },
  { id: 'SPP08', code: 'SP-PR-2026-008', itemName: '46# 抗磨液压油', specification: '200L/桶', quantity: 3, unit: '桶', totalAmount: 3840, applicantName: '彭向', warehouseType: '4', warehouseTypeText: 'CNC设备备件库', triggerSource: 'warning', triggerSourceText: '安全库存预警', applicationDate: '2026-04-23', status: 'DELIVERED', erpPurchaseOrderNo: 'PO-2026-04-0512' },
  { id: 'SPP09', code: 'SP-PR-2026-009', itemName: '止逆环', specification: 'φ40 标准', quantity: 4, unit: '个', totalAmount: 1680, applicantName: '彭向', warehouseType: '4', warehouseTypeText: 'CNC设备备件库', triggerSource: 'plan', triggerSourceText: '计划补货', applicationDate: '2026-04-24', status: 'FEISHU_APPROVED', erpPurchaseOrderNo: '' },
  { id: 'SPP10', code: 'SP-PR-2026-010', itemName: '点胶针头', specification: '22G', quantity: 30, unit: '盒', totalAmount: 1350, applicantName: '刘朋朋', warehouseType: '2', warehouseTypeText: '自动化备件库', triggerSource: 'plan', triggerSourceText: '计划补货', applicationDate: '2026-04-25', status: 'FEISHU_APPROVING', erpPurchaseOrderNo: '' },
  { id: 'SPP11', code: 'SP-PR-2026-011', itemName: '气管接头', specification: '6mm', quantity: 50, unit: '个', totalAmount: 400, applicantName: '陆钟', warehouseType: '1', warehouseTypeText: '设备维修备件库', triggerSource: 'plan', triggerSourceText: '计划补货', applicationDate: '2026-04-15', status: 'PUSH_FAILED', erpPurchaseOrderNo: '' },
  { id: 'SPP12', code: 'SP-PR-2026-012', itemName: '冷却液 5%', specification: 'BLASOCUT 25L', quantity: 6, unit: '桶', totalAmount: 3480, applicantName: '王组长', warehouseType: '4', warehouseTypeText: 'CNC设备备件库', triggerSource: 'warning', triggerSourceText: '安全库存预警', applicationDate: '2026-04-26', status: 'FEISHU_REJECTED', erpPurchaseOrderNo: '' }
])

const filteredList = computed(() => list.value.filter(x => {
  if (queryParams.code && !(x.code || '').includes(queryParams.code)) return false
  if (queryParams.itemName && !(x.itemName || '').includes(queryParams.itemName)) return false
  if (queryParams.status && x.status !== queryParams.status) return false
  return true
}))

function loadList() { /* 静态 mock，computed 会过滤 */ }
function resetQuery() { Object.assign(queryParams, { code: '', itemName: '', status: '' }) }

const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formData = reactive<any>({})
function openCreate() {
  formMode.value = 'create'
  Object.assign(formData, { partNumber: '', itemName: '', specification: '', quantity: 1, unit: '', warehouseType: '1', triggerSource: 'plan', applicantName: '', totalAmount: 0, remark: '' })
  formVisible.value = true
}
function openEdit(row: any) {
  formMode.value = 'edit'
  Object.assign(formData, { ...row })
  formVisible.value = true
}
function submitForm() {
  if (!formData.itemName || !formData.applicantName) { ElMessage.warning('请填写备件名称和申请人'); return }
  const sourceTextMap: any = { warning: '安全库存预警', workOrder: '维修工单缺件', plan: '计划补货' }
  const whTextMap: any = { '1': '设备维修备件库', '2': '自动化备件库', '3': 'B端关键备件库', '4': 'CNC设备备件库' }
  if (formMode.value === 'create') {
    list.value.unshift({
      id: 'SPP' + Date.now(),
      code: 'SP-PR-2026-' + String(list.value.length + 1).padStart(3, '0'),
      ...formData,
      warehouseTypeText: whTextMap[formData.warehouseType],
      triggerSourceText: sourceTextMap[formData.triggerSource],
      applicationDate: new Date().toISOString().slice(0, 10),
      status: 'DRAFT',
      erpPurchaseOrderNo: ''
    })
  } else {
    const idx = list.value.findIndex(x => x.id === formData.id)
    if (idx >= 0) {
      list.value[idx] = {
        ...list.value[idx], ...formData,
        warehouseTypeText: whTextMap[formData.warehouseType],
        triggerSourceText: sourceTextMap[formData.triggerSource]
      }
    }
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
  if (next === row.status) {
    ElMessage.info('当前已是最终状态，无新进展')
    return
  }
  row.status = next
  if (next === 'DELIVERED') {
    row.erpPurchaseOrderNo = 'PO-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + String(Math.floor(Math.random()*1000)).padStart(3, '0')
  }
  ElMessage.success('已同步飞书/ERP 最新状态：' + getStatusName(next))
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
.spare-part-purchase-page { padding: 12px; }
.hint { color: #909399; font-size: 12px; }
</style>
