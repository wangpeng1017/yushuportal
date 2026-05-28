<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tool-purchase-demand/page"
    :columns="columns"
    :searchFields="searchFields"
    :enableCreate="true"
    :enableDetail="true"
    :enableEdit="true"
    :enableDelete="true"
    :actionWidth="380"
    detailTitleProp="demandCode"
    @create="handleCreate"
    @edit="handleEdit"
  >
    <template #action="{ row }">
      <el-button
        v-if="canSubmit(row)"
        link
        type="primary"
        @click="handleSubmit(row)"
      >
        <Icon icon="ep:promotion" class="mr-3px" />
        提交审批
      </el-button>
      <el-button
        v-if="row.approvalStatus === 'IN_APPROVAL'"
        link
        type="warning"
        @click="handleCancel(row)"
      >
        <Icon icon="ep:close-bold" class="mr-3px" />
        撤回
      </el-button>
      <el-button
        v-if="hasApprovalRecord(row)"
        link
        type="info"
        @click="openProgress(row)"
      >
        <Icon icon="ep:tickets" class="mr-3px" />
        审批进度
      </el-button>
      <el-button
        v-if="row.approvalStatus === 'ERP_FAILED' || row.approvalStatus === 'APPROVED'"
        link
        type="danger"
        @click="handleRetryErp(row)"
      >
        <Icon icon="ep:refresh-right" class="mr-3px" />
        重试ERP
      </el-button>
      <el-button
        v-if="row.approvalStatus === 'PO_GENERATED'"
        link
        type="success"
        @click="openPo(row)"
      >
        <Icon icon="ep:document-checked" class="mr-3px" />
        PO详情
      </el-button>
    </template>
  </SimpleListPage>

  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/tool-purchase-demand/create"
    apiUpdate="/admin-api/eam/tool-purchase-demand/update"
    @success="reloadList"
  />

  <!-- 提交审批确认对话框 -->
  <el-dialog v-model="submitVisible" title="提交飞书审批" width="640px">
    <el-alert
      type="info"
      :closable="false"
      title="审批人：飞书审批员（演示阶段统一审批人，后续接入真实飞书审批链）"
      class="mb-15px"
    />
    <el-descriptions v-if="submitTarget" :column="2" border>
      <el-descriptions-item label="需求单号">{{ submitTarget.demandCode }}</el-descriptions-item>
      <el-descriptions-item label="工器具类型">{{ submitTarget.toolType }}</el-descriptions-item>
      <el-descriptions-item label="品名" :span="2">{{ submitTarget.itemName }}</el-descriptions-item>
      <el-descriptions-item label="规格">{{ submitTarget.specification }}</el-descriptions-item>
      <el-descriptions-item label="数量">{{ submitTarget.quantity }} {{ submitTarget.unit }}</el-descriptions-item>
      <el-descriptions-item label="期望到货">{{ submitTarget.expectedDate }}</el-descriptions-item>
      <el-descriptions-item label="申请人">{{ submitTarget.applicantName }}</el-descriptions-item>
      <el-descriptions-item label="预估金额" :span="2">
        <span class="text-orange-600 font-bold">{{ estimateAmount(submitTarget) }}</span>
        <span class="text-gray-500 text-12px ml-5px">（按 80 元/件估算，正式金额以 ERP 为准）</span>
      </el-descriptions-item>
      <el-descriptions-item label="用途说明" :span="2">{{ submitTarget.usagePurpose || '-' }}</el-descriptions-item>
    </el-descriptions>
    <el-form class="mt-15px">
      <el-form-item label="提交说明">
        <el-input
          v-model="submitComment"
          type="textarea"
          :rows="3"
          placeholder="（可选）补充给审批人的说明"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitVisible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="confirmSubmit">确认提交</el-button>
    </template>
  </el-dialog>

  <!-- 审批进度对话框 -->
  <el-dialog v-model="progressVisible" title="审批进度" width="600px">
    <el-descriptions v-if="progressTarget" :column="1" border>
      <el-descriptions-item label="审批单号">{{ progressTarget.feishuApprovalCode || '-' }}</el-descriptions-item>
      <el-descriptions-item label="飞书链接">
        <el-link
          v-if="progressTarget.feishuApprovalUrl"
          :href="progressTarget.feishuApprovalUrl"
          type="primary"
          target="_blank"
        >
          {{ progressTarget.feishuApprovalUrl }}
        </el-link>
        <span v-else>-</span>
      </el-descriptions-item>
      <el-descriptions-item label="当前状态">
        <el-tag :type="statusType(progressTarget.approvalStatus)" size="small">
          {{ statusLabel(progressTarget.approvalStatus) }}
        </el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div class="mt-15px font-bold">审批节点</div>
    <el-timeline class="mt-10px">
      <el-timeline-item
        v-for="(node, idx) in progressTarget?.approvalNodes || []"
        :key="idx"
        :type="nodeType(node.action)"
        :timestamp="node.time"
        placement="top"
      >
        <div>
          <span class="font-bold">{{ node.nodeName }}</span>
          <span class="ml-10px">{{ node.approver }}</span>
          <el-tag size="small" class="ml-10px" :type="nodeType(node.action)">{{ node.action }}</el-tag>
        </div>
        <div v-if="node.comment" class="text-12px text-gray-600 mt-3px">意见：{{ node.comment }}</div>
      </el-timeline-item>
    </el-timeline>
    <template v-if="progressTarget?.approvalStatus === 'ERP_FAILED'">
      <el-alert
        type="error"
        :closable="false"
        :title="`ERP 推送失败：${progressTarget.erpFailReason || '未知原因'}`"
        class="mt-15px"
      />
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="EamToolPurchaseDemand">
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

// 飞书+ERP 黑盒架构状态机（EAM 仅做提单 + 状态展示）
const STATUS_MAP: Record<string, { label: string; tag: string }> = {
  DRAFT:            { label: '草稿', tag: 'info' },
  PUSHED_TO_FEISHU: { label: '已推送飞书', tag: 'primary' },
  FEISHU_APPROVING: { label: '飞书审批中', tag: 'warning' },
  FEISHU_APPROVED:  { label: '飞书已通过', tag: 'success' },
  FEISHU_REJECTED:  { label: '飞书已驳回', tag: 'danger' },
  DELIVERED:        { label: 'ERP 已到货', tag: 'success' },
  PUSH_FAILED:      { label: '推送失败', tag: 'danger' },
  // 历史 mock 兼容
  IN_APPROVAL:  { label: '飞书审批中', tag: 'warning' },
  SUBMITTED:    { label: '飞书审批中', tag: 'warning' },
  APPROVED:     { label: '飞书已通过', tag: 'success' },
  PO_GENERATED: { label: 'ERP 已到货', tag: 'success' },
  ERP_PUSHED:   { label: 'ERP 已到货', tag: 'success' },
  REJECTED:     { label: '飞书已驳回', tag: 'danger' },
  CANCELED:     { label: '草稿', tag: 'info' },
  ERP_FAILED:   { label: '推送失败', tag: 'danger' }
}

function statusLabel(s: string): string {
  return STATUS_MAP[s]?.label || s || '-'
}
function statusType(s: string): any {
  return STATUS_MAP[s]?.tag || ''
}
function nodeType(action: string): any {
  if (action === '通过') return 'success'
  if (action === '驳回') return 'danger'
  if (action === '撤回') return 'info'
  return 'primary'
}

const columns = [
  { prop: 'demandCode', label: '需求单号', width: 170 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemName', label: '品名', minWidth: 180 },
  { prop: 'specification', label: '规格', width: 180 },
  { prop: 'quantity', label: '数量', width: 70 },
  { prop: 'unit', label: '单位', width: 60 },
  { prop: 'expectedDate', label: '期望到货', width: 110 },
  { prop: 'applicantName', label: '申请人', width: 90 },
  {
    prop: 'approvalStatus',
    label: '状态',
    width: 110,
    formatter: (r: any) => statusLabel(r.approvalStatus),
    tag: (r: any) => statusType(r.approvalStatus),
  },
  { prop: 'erpPurchaseOrderNo', label: 'PO 单号', width: 160 },
  { prop: 'createTime', label: '创建时间', width: 160 },
]

const searchFields = [
  { prop: 'demandCode', label: '需求单号' },
  { prop: 'itemName', label: '品名' },
]

const formFields = [
  {
    prop: 'toolType',
    label: '工器具类型',
    type: 'select' as const,
    required: true,
    options: [
      { label: '刀具', value: '刀具' },
      { label: '量具', value: '量具' },
      { label: '模具', value: '模具' },
    ],
  },
  { prop: 'itemName', label: '品名', required: true },
  { prop: 'specification', label: '规格型号', required: true },
  { prop: 'quantity', label: '数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把/支/套' },
  { prop: 'expectedDate', label: '期望到货日期', type: 'date' as const, required: true },
  { prop: 'applicantName', label: '申请人', required: true },
  { prop: 'department', label: '申请部门' },
  { prop: 'usagePurpose', label: '用途说明', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const formTitle = ref('新增采购需求')

// 提交审批
const submitVisible = ref(false)
const submitting = ref(false)
const submitTarget = ref<any>(null)
const submitComment = ref('')

// 审批进度
const progressVisible = ref(false)
const progressTarget = ref<any>(null)

function canSubmit(row: any) {
  return ['DRAFT', 'REJECTED', 'CANCELED'].includes(row.approvalStatus)
}

function hasApprovalRecord(row: any) {
  return Boolean(
    row.feishuApprovalCode ||
      (row.approvalNodes && row.approvalNodes.length > 0) ||
      ['IN_APPROVAL', 'APPROVED', 'REJECTED', 'CANCELED', 'PO_GENERATED', 'ERP_FAILED'].includes(
        row.approvalStatus,
      ),
  )
}

function estimateAmount(row: any) {
  // 简单估算：按 80 元/件
  const amt = (Number(row.quantity) || 0) * 80
  return `${amt.toFixed(2)} 元`
}

function handleCreate() {
  formTitle.value = '新增采购需求'
  formRef.value?.open()
}

function handleEdit(row: any) {
  if (!canSubmit(row)) {
    ElMessage.warning('当前状态不可编辑（仅草稿/已驳回/已撤回可编辑）')
    return
  }
  formTitle.value = '编辑采购需求'
  formRef.value?.open(row.id, { ...row })
}

function reloadList() {
  listRef.value?.loadList()
}

// 提交审批
function handleSubmit(row: any) {
  submitTarget.value = row
  submitComment.value = ''
  submitVisible.value = true
}

async function confirmSubmit() {
  if (!submitTarget.value) return
  submitting.value = true
  try {
    const detail = {
      品名: submitTarget.value.itemName,
      规格: submitTarget.value.specification,
      数量: `${submitTarget.value.quantity} ${submitTarget.value.unit || ''}`,
      期望到货: submitTarget.value.expectedDate,
      申请人: submitTarget.value.applicantName,
      申请部门: submitTarget.value.department,
      用途: submitTarget.value.usagePurpose || '-',
      预估金额: estimateAmount(submitTarget.value),
    }
    await request.post({
      url: '/admin-api/feishu/approval/submit',
      data: {
        sourceType: 'PURCHASE_DEMAND',
        sourceId: submitTarget.value.id,
        title: `采购需求审批 / ${submitTarget.value.itemName} ×${submitTarget.value.quantity}`,
        applicantName: submitTarget.value.applicantName,
        detail,
        submitComment: submitComment.value,
      },
    })
    ElMessage.success('已提交飞书审批，请等待审批人处理')
    submitVisible.value = false
    reloadList()
  } catch (e: any) {
    ElMessage.error(e?.msg || '提交失败')
    console.error(e)
  } finally {
    submitting.value = false
  }
}

// 撤回
async function handleCancel(row: any) {
  try {
    await ElMessageBox.confirm(`确认撤回审批单 ${row.feishuApprovalCode}？撤回后可修改重新提交。`, '撤回确认', {
      type: 'warning',
    })
  } catch {
    return
  }
  try {
    await request.post({
      url: '/admin-api/feishu/approval/cancel',
      data: {
        sourceId: row.id,
        approvalCode: row.feishuApprovalCode,
        comment: '申请人撤回',
      },
    })
    ElMessage.success('已撤回')
    reloadList()
  } catch (e: any) {
    ElMessage.error(e?.msg || '撤回失败')
    console.error(e)
  }
}

// 重试 ERP
async function handleRetryErp(row: any) {
  try {
    await ElMessageBox.confirm(`确认重新推送 ERP 生成采购订单？`, '重试 ERP', { type: 'warning' })
  } catch {
    return
  }
  try {
    const res: any = await request.post({
      url: '/admin-api/erp/purchase-order/create',
      data: {
        sourceType: 'PURCHASE_DEMAND',
        sourceId: row.id,
        approvalCode: row.feishuApprovalCode,
      },
    })
    if (res?.erpPurchaseOrderNo) {
      ElMessage.success(`ERP 已生成采购单：${res.erpPurchaseOrderNo}`)
    } else {
      ElMessage.success('已重新推送 ERP')
    }
    reloadList()
  } catch (e: any) {
    ElMessage.error(e?.msg || 'ERP 推送失败')
    console.error(e)
  }
}

// 审批进度
function openProgress(row: any) {
  progressTarget.value = row
  progressVisible.value = true
}

// PO 详情（演示版：弹出 message + 复制 PO 号）
function openPo(row: any) {
  ElMessageBox.alert(
    `PO 单号：${row.erpPurchaseOrderNo}\n生成时间：${row.approvedAt}\n\n生产环境此处应跳转 ERP 采购订单详情页。`,
    'PO 详情',
    { confirmButtonText: '确定' },
  )
}
</script>
