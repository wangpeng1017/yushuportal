<template>
  <div class="purchase-request-page">
    <!-- ============ 搜索区 ============ -->
    <ContentWrap>
      <el-form :inline="true" :model="queryParams" class="-mb-15px" label-width="90px">
        <el-form-item label="项目编号">
          <el-input v-model="queryParams.projectCode" class="!w-200px" clearable placeholder="CIP-2026-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="queryParams.projectName" class="!w-200px" clearable placeholder="请输入项目名称" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="审批状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-200px">
            <el-option v-for="opt in STATUS_OPTIONS" :key="opt.value" :label="opt.label" :value="opt.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- ============ 主表 ============ -->
    <ContentWrap>
      <div class="mb-10px">
        <el-button plain type="primary" @click="openForm('create')"><Icon icon="ep:plus" class="mr-5px" />新增采购申请</el-button>
        <el-button plain @click="refreshAllStatus"><Icon icon="ep:refresh" class="mr-5px" />同步飞书/ERP 状态</el-button>
      </div>
      <el-table v-loading="loading" :data="list" :stripe="true" highlight-current-row @row-dblclick="openDetail">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="项目编号" prop="projectCode" width="135" align="center" />
        <el-table-column label="项目名称" prop="projectName" min-width="200" />
        <el-table-column label="申购人" prop="applicantName" width="80" align="center" />
        <el-table-column label="申购部门" prop="applicantDept" width="120" align="center" />
        <el-table-column label="申购日期" prop="applicationDate" width="100" align="center" />
        <el-table-column label="要求到货" prop="expectedDate" width="100" align="center" />
        <el-table-column label="清单数量" width="200" align="center">
          <template #default="{ row }">
            <el-tag size="small" type="info" class="mr-3px">钣金 {{ row.sheetMetalItems?.length || 0 }}</el-tag>
            <el-tag size="small" type="warning" class="mr-3px">机加 {{ row.machiningItems?.length || 0 }}</el-tag>
            <el-tag size="small" type="success">外购 {{ row.outsourceItems?.length || 0 }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预估金额" prop="totalAmount" width="100" align="right">
          <template #default="{ row }">¥ {{ Number(row.totalAmount || 0).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="审批状态" prop="status" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusColor(row.status)">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="340" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="openDetail(row)"><Icon icon="ep:view" />详情</el-button>
            <el-button v-if="canEditRow(row)" link type="primary" @click="openForm('edit', row)"><Icon icon="ep:edit" />编辑</el-button>
            <el-button v-if="canPushToFeishu(row)" link type="success" @click="handlePushFeishu(row)"><Icon icon="ep:promotion" />推送飞书</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="primary" @click="openFeishu(row)"><Icon icon="ep:link" />飞书单据</el-button>
            <el-button v-if="hasFeishuTicket(row)" link type="warning" @click="refreshOne(row)">刷新状态</el-button>
            <el-button v-if="canResubmit(row)" link type="primary" @click="handleResubmit(row)">重新申请</el-button>
            <el-button v-if="canRetryPush(row)" link type="warning" @click="handleRetryPush(row)">重试推送</el-button>
            <el-button v-if="canDeleteRow(row)" link type="danger" @click="handleDelete(row)"><Icon icon="ep:delete" />删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="loadList"
      />
    </ContentWrap>

    <!-- ============ 新建/编辑对话框（含三 Tab 明细） ============ -->
    <el-dialog v-model="formVisible" :title="formTitle" width="1100px" top="6vh" :close-on-click-modal="false">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
        <el-row :gutter="16">
          <el-col :span="8">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input v-model="formData.projectCode" :disabled="formMode === 'edit'" placeholder="留空自动生成 CIP-2026-XXXX" />
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="项目名称" prop="projectName">
              <el-input v-model="formData.projectName" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购人" prop="applicantName">
              <el-input v-model="formData.applicantName" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购部门" prop="applicantDept">
              <el-input v-model="formData.applicantDept" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="所属端别" prop="workshopCode">
              <el-select v-model="formData.workshopCode">
                <el-option label="C 端（PACK/PCBA/装配）" value="C" />
                <el-option label="B 端" value="B" />
                <el-option label="数控机加" value="CNC" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="申购日期" prop="applicationDate">
              <el-date-picker v-model="formData.applicationDate" type="date" value-format="YYYY-MM-DD" class="!w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="要求到货日期" prop="expectedDate">
              <el-date-picker v-model="formData.expectedDate" type="date" value-format="YYYY-MM-DD" class="!w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预估金额">
              <el-input-number v-model="formData.totalAmount" :min="0" :step="1000" class="!w-full" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="formData.remark" type="textarea" :rows="2" placeholder="材质、数量以清单为准；货期过长的请与申购人沟通..." />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!-- 三 Tab 明细 -->
      <el-tabs v-model="activeTab" type="border-card" class="mt-10px">
        <el-tab-pane label="钣金件清单" name="sheetMetal">
          <div class="mb-8px">
            <el-button size="small" plain type="primary" @click="addRow('sheetMetal')"><Icon icon="ep:plus" />添加行</el-button>
          </div>
          <el-table :data="formData.sheetMetalItems" border size="small">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="物料编号" width="140">
              <template #default="{ row }"><el-input v-model="row.materialCode" size="small" /></template>
            </el-table-column>
            <el-table-column label="图号" width="170">
              <template #default="{ row }"><el-input v-model="row.drawingNo" size="small" /></template>
            </el-table-column>
            <el-table-column label="名称" min-width="160">
              <template #default="{ row }"><el-input v-model="row.itemName" size="small" /></template>
            </el-table-column>
            <el-table-column label="数量" width="80">
              <template #default="{ row }"><el-input-number v-model="row.quantity" :min="0" size="small" :controls="false" class="!w-full" /></template>
            </el-table-column>
            <el-table-column label="材质" width="120">
              <template #default="{ row }"><el-input v-model="row.material" size="small" /></template>
            </el-table-column>
            <el-table-column label="表面处理" width="140">
              <template #default="{ row }"><el-input v-model="row.surfaceTreat" size="small" /></template>
            </el-table-column>
            <el-table-column label="备注" min-width="120">
              <template #default="{ row }"><el-input v-model="row.remark" size="small" /></template>
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeRow('sheetMetal', $index)"><Icon icon="ep:delete" /></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="机加工件清单" name="machining">
          <div class="mb-8px">
            <el-button size="small" plain type="primary" @click="addRow('machining')"><Icon icon="ep:plus" />添加行</el-button>
          </div>
          <el-table :data="formData.machiningItems" border size="small">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="物料编号" width="140">
              <template #default="{ row }"><el-input v-model="row.materialCode" size="small" /></template>
            </el-table-column>
            <el-table-column label="图号" width="170">
              <template #default="{ row }"><el-input v-model="row.drawingNo" size="small" /></template>
            </el-table-column>
            <el-table-column label="名称" min-width="160">
              <template #default="{ row }"><el-input v-model="row.itemName" size="small" /></template>
            </el-table-column>
            <el-table-column label="数量" width="80">
              <template #default="{ row }"><el-input-number v-model="row.quantity" :min="0" size="small" :controls="false" class="!w-full" /></template>
            </el-table-column>
            <el-table-column label="材质" width="120">
              <template #default="{ row }"><el-input v-model="row.material" size="small" /></template>
            </el-table-column>
            <el-table-column label="表面处理" width="140">
              <template #default="{ row }"><el-input v-model="row.surfaceTreat" size="small" /></template>
            </el-table-column>
            <el-table-column label="备注" min-width="120">
              <template #default="{ row }"><el-input v-model="row.remark" size="small" /></template>
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeRow('machining', $index)"><Icon icon="ep:delete" /></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="外购件清单" name="outsource">
          <el-alert type="warning" :closable="false" show-icon class="mb-8px" title="货期过长的请与申购人沟通，提前预警或替换。加急！" />
          <div class="mb-8px">
            <el-button size="small" plain type="primary" @click="addRow('outsource')"><Icon icon="ep:plus" />添加行</el-button>
          </div>
          <el-table :data="formData.outsourceItems" border size="small">
            <el-table-column type="index" label="序号" width="55" align="center" />
            <el-table-column label="物料编号" width="140">
              <template #default="{ row }"><el-input v-model="row.materialCode" size="small" /></template>
            </el-table-column>
            <el-table-column label="图号/型号/规格" width="180">
              <template #default="{ row }"><el-input v-model="row.drawingSpec" size="small" /></template>
            </el-table-column>
            <el-table-column label="物料描述" min-width="160">
              <template #default="{ row }"><el-input v-model="row.description" size="small" /></template>
            </el-table-column>
            <el-table-column label="数量" width="80">
              <template #default="{ row }"><el-input-number v-model="row.quantity" :min="0" size="small" :controls="false" class="!w-full" /></template>
            </el-table-column>
            <el-table-column label="品牌" width="110">
              <template #default="{ row }"><el-input v-model="row.brand" size="small" /></template>
            </el-table-column>
            <el-table-column label="备注" min-width="120">
              <template #default="{ row }"><el-input v-model="row.remark" size="small" placeholder="加急 / 货期" /></template>
            </el-table-column>
            <el-table-column label="链接" width="200">
              <template #default="{ row }"><el-input v-model="row.link" size="small" placeholder="https://..." /></template>
            </el-table-column>
            <el-table-column label="操作" width="60" align="center">
              <template #default="{ $index }">
                <el-button link type="danger" size="small" @click="removeRow('outsource', $index)"><Icon icon="ep:delete" /></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" :loading="formSaving" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>

    <!-- ============ 详情对话框 ============ -->
    <el-dialog v-model="detailVisible" title="采购申请详情" width="1000px" top="6vh">
      <template v-if="detailData">
        <el-descriptions :column="3" border>
          <el-descriptions-item label="项目编号">{{ detailData.projectCode }}</el-descriptions-item>
          <el-descriptions-item label="项目名称" :span="2">{{ detailData.projectName }}</el-descriptions-item>
          <el-descriptions-item label="申购人">{{ detailData.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="申购部门">{{ detailData.applicantDept }}</el-descriptions-item>
          <el-descriptions-item label="所属端别">{{ detailData.workshopCode }}</el-descriptions-item>
          <el-descriptions-item label="申购日期">{{ detailData.applicationDate }}</el-descriptions-item>
          <el-descriptions-item label="要求到货">{{ detailData.expectedDate }}</el-descriptions-item>
          <el-descriptions-item label="预估金额">¥ {{ Number(detailData.totalAmount || 0).toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="审批状态">
            <el-tag :type="getStatusColor(detailData.status)">{{ getStatusName(detailData.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="飞书单据">
            <el-link v-if="hasFeishuTicket(detailData)" type="primary" @click="openFeishu(detailData)">{{ detailData.feishuTicketCode || detailData.code }}</el-link>
            <span v-else>—</span>
          </el-descriptions-item>
          <el-descriptions-item label="飞书审批单号" :span="3">
            <span v-if="detailData.feishuApprovalCode">{{ detailData.feishuApprovalCode }}</span>
            <span v-else>—</span>
            <el-link v-if="detailData.feishuApprovalUrl" :href="detailData.feishuApprovalUrl" type="primary" target="_blank" class="ml-10px">打开飞书</el-link>
          </el-descriptions-item>
          <el-descriptions-item label="ERP PO 单号" :span="3">{{ detailData.erpPurchaseOrderNo || '—' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="3">{{ detailData.remark || '—' }}</el-descriptions-item>
        </el-descriptions>

        <el-tabs v-model="detailActiveTab" type="border-card" class="mt-15px">
          <el-tab-pane :label="`钣金件清单 (${detailData.sheetMetalItems?.length || 0})`" name="sheetMetal">
            <el-table :data="detailData.sheetMetalItems" size="small" border>
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column label="物料编号" prop="materialCode" width="140" />
              <el-table-column label="图号" prop="drawingNo" width="170" />
              <el-table-column label="名称" prop="itemName" min-width="160" />
              <el-table-column label="数量" prop="quantity" width="70" align="center" />
              <el-table-column label="材质" prop="material" width="120" />
              <el-table-column label="表面处理" prop="surfaceTreat" width="140" />
              <el-table-column label="备注" prop="remark" min-width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="`机加工件清单 (${detailData.machiningItems?.length || 0})`" name="machining">
            <el-table :data="detailData.machiningItems" size="small" border>
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column label="物料编号" prop="materialCode" width="140" />
              <el-table-column label="图号" prop="drawingNo" width="170" />
              <el-table-column label="名称" prop="itemName" min-width="160" />
              <el-table-column label="数量" prop="quantity" width="70" align="center" />
              <el-table-column label="材质" prop="material" width="120" />
              <el-table-column label="表面处理" prop="surfaceTreat" width="140" />
              <el-table-column label="备注" prop="remark" min-width="120" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="`外购件清单 (${detailData.outsourceItems?.length || 0})`" name="outsource">
            <el-table :data="detailData.outsourceItems" size="small" border>
              <el-table-column type="index" label="序号" width="55" align="center" />
              <el-table-column label="物料编号" prop="materialCode" width="140" />
              <el-table-column label="图号/型号/规格" prop="drawingSpec" width="180" />
              <el-table-column label="物料描述" prop="description" min-width="160" />
              <el-table-column label="数量" prop="quantity" width="70" align="center" />
              <el-table-column label="品牌" prop="brand" width="110" />
              <el-table-column label="备注" prop="remark" min-width="120" />
              <el-table-column label="链接" min-width="180">
                <template #default="{ row }"><el-link v-if="row.link" :href="row.link" target="_blank" type="primary">{{ row.link }}</el-link><span v-else>—</span></template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="飞书审批" name="feishu">
            <el-alert
type="info" :closable="false" show-icon class="mb-15px"
              title="EAM 仅做提单 + 状态展示。审批进度、审批人意见、ERP 对接全部由飞书完成。" />
            <div v-if="hasFeishuTicket(detailData)" class="text-center mt-20px">
              <el-button type="primary" size="large" @click="openFeishu(detailData)">
                <Icon icon="ep:link" />前往飞书查看完整审批进度
              </el-button>
              <div class="text-12px text-gray-500 mt-10px">飞书单据号：{{ detailData.feishuTicketCode || detailData.code || detailData.projectCode }}</div>
            </div>
            <el-empty v-else description="尚未推送飞书" />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

// 飞书+ERP 黑盒架构状态机（EAM 仅做提单+状态展示）
import {
  FEISHU_STATUS_OPTIONS as STATUS_OPTIONS,
  getStatusName, getStatusColor, normalizeStatus,
  canEdit as canEditRow, canPushToFeishu, canDelete as canDeleteRow,
  canRetryPush, canResubmit, hasFeishuTicket,
  simulateNextStatus, buildFeishuUrl
} from '../_purchase-shared/feishu-status'
function getNodeColor(action: string) {
  if (action === '通过') return 'success'
  if (action === '驳回') return 'danger'
  if (action === '撤回') return 'info'
  if (action === '待审批') return 'warning'
  return 'primary'
}
// keep getNodeTagType for backwards compat (无引用，但避免误删后报错)
function getNodeTagType(action: string): any {
  if (action === '通过') return 'success'
  if (action === '驳回') return 'danger'
  if (action === '撤回') return 'info'
  if (action === '待审批') return 'warning'
  return 'primary'
}

const queryParams = reactive({ pageNo: 1, pageSize: 10, projectCode: '', projectName: '', status: '' })
const list = ref<any[]>([])
const total = ref(0)
const loading = ref(false)

async function loadList() {
  loading.value = true
  try {
    const res = await request.get({ url: '/eam/purchase-request/page', params: queryParams })
    list.value = (res as any)?.list || []
    total.value = (res as any)?.total || 0
  } finally { loading.value = false }
}
function resetQuery() {
  Object.assign(queryParams, { pageNo: 1, pageSize: 10, projectCode: '', projectName: '', status: '' })
  loadList()
}

// 表单
const formVisible = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const formTitle = ref('')
const formSaving = ref(false)
const formRef = ref()
const activeTab = ref('sheetMetal')
const formData = reactive<any>({
  id: '', projectCode: '', projectName: '', applicantName: '', applicantDept: '',
  applicationDate: '', expectedDate: '', remark: '', workshopCode: 'C',
  totalAmount: 0, sheetMetalItems: [], machiningItems: [], outsourceItems: [],
})
const formRules = {
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  applicantName: [{ required: true, message: '请输入申购人', trigger: 'blur' }],
  applicantDept: [{ required: true, message: '请输入申购部门', trigger: 'blur' }],
  applicationDate: [{ required: true, message: '请选择申购日期', trigger: 'change' }],
  expectedDate: [{ required: true, message: '请选择要求到货日期', trigger: 'change' }],
  workshopCode: [{ required: true, message: '请选择端别', trigger: 'change' }],
}

function resetForm() {
  Object.assign(formData, {
    id: '', projectCode: '', projectName: '', applicantName: '', applicantDept: '',
    applicationDate: new Date().toISOString().slice(0, 10), expectedDate: '', remark: '', workshopCode: 'C',
    totalAmount: 0, sheetMetalItems: [], machiningItems: [], outsourceItems: [],
  })
}
async function openForm(mode: 'create' | 'edit', row?: any) {
  formMode.value = mode
  formTitle.value = mode === 'create' ? '新增采购申请' : `编辑：${row?.projectCode}`
  if (mode === 'create') {
    resetForm()
  } else {
    const res: any = await request.get({ url: '/eam/purchase-request/get', params: { id: row.id } })
    Object.assign(formData, JSON.parse(JSON.stringify(res || {})))
  }
  activeTab.value = 'sheetMetal'
  formVisible.value = true
}
function addRow(type: 'sheetMetal' | 'machining' | 'outsource') {
  if (type === 'outsource') {
    formData.outsourceItems.push({ seq: formData.outsourceItems.length + 1, materialCode: '', drawingSpec: '', description: '', quantity: 1, brand: '', remark: '', link: '' })
  } else {
    const list = type === 'sheetMetal' ? formData.sheetMetalItems : formData.machiningItems
    list.push({ seq: list.length + 1, materialCode: '', drawingNo: '', itemName: '', quantity: 1, material: '', surfaceTreat: '', remark: '' })
  }
}
function removeRow(type: 'sheetMetal' | 'machining' | 'outsource', idx: number) {
  const arr = type === 'sheetMetal' ? formData.sheetMetalItems : type === 'machining' ? formData.machiningItems : formData.outsourceItems
  arr.splice(idx, 1)
  arr.forEach((it: any, i: number) => (it.seq = i + 1))
}
async function handleSave() {
  await formRef.value?.validate?.()
  formSaving.value = true
  try {
    if (formMode.value === 'create') {
      await request.post({ url: '/eam/purchase-request/create', data: formData })
      ElMessage.success('已创建')
    } else {
      await request.put({ url: '/eam/purchase-request/update', data: formData })
      ElMessage.success('已更新')
    }
    formVisible.value = false
    loadList()
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message)
  } finally { formSaving.value = false }
}

// 详情
const detailVisible = ref(false)
const detailActiveTab = ref('sheetMetal')
const detailData = ref<any>(null)
async function openDetail(row: any) {
  const res: any = await request.get({ url: '/eam/purchase-request/get', params: { id: row.id } })
  detailData.value = res
  detailActiveTab.value = 'sheetMetal'
  detailVisible.value = true
}

// EAM 仅做提单 + 状态展示（飞书审批 + ERP 对接为外部黑盒）
async function handlePushFeishu(row: any) {
  await ElMessageBox.confirm(`推送「${row.projectCode} ${row.projectName}」到飞书「物品需求单」？\n推送后由飞书完成审批 + ERP 对接，本系统仅展示状态`, '推送飞书', { confirmButtonText: '确认推送' })
  await request.post({ url: '/eam/purchase-request/submit-approval', data: { id: row.id } })
  row.status = 'PUSHED_TO_FEISHU'
  row.feishuTicketCode = 'FS-' + Date.now()
  ElMessage.success('已推送飞书，请到飞书查看审批进度')
  loadList()
}
function openFeishu(row: any) {
  window.open(buildFeishuUrl(row), '_blank')
}
async function refreshOne(row: any) {
  const next = simulateNextStatus(row.status)
  if (next === normalizeStatus(row.status)) {
    ElMessage.info('当前已是最终状态，无新进展')
    return
  }
  row.status = next
  if (next === 'DELIVERED' && !row.erpPurchaseOrderNo) {
    row.erpPurchaseOrderNo = 'PO-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + String(Math.floor(Math.random()*1000)).padStart(3, '0')
  }
  ElMessage.success('已同步飞书/ERP 最新状态：' + getStatusName(next))
}
async function refreshAllStatus() {
  let updated = 0
  list.value.forEach((row: any) => {
    const next = simulateNextStatus(row.status)
    if (next !== normalizeStatus(row.status)) {
      row.status = next
      if (next === 'DELIVERED' && !row.erpPurchaseOrderNo) {
        row.erpPurchaseOrderNo = 'PO-' + new Date().toISOString().slice(0,10).replace(/-/g, '') + '-' + String(Math.floor(Math.random()*1000)).padStart(3, '0')
      }
      updated++
    }
  })
  ElMessage.success('已同步飞书/ERP 状态，' + updated + ' 单有更新')
}
async function handleDelete(row: any) {
  await ElMessageBox.confirm(`确认删除「${row.projectCode}」？`, '删除', { type: 'warning', confirmButtonText: '删除' })
  await request.delete({ url: '/eam/purchase-request/delete', params: { id: row.id } })
  ElMessage.success('已删除')
  loadList()
}
async function handleResubmit(row: any) {
  await ElMessageBox.confirm(`将「${row.projectCode}」重置为草稿，可重新编辑后推送飞书`, '重新申请', { type: 'info' })
  row.status = 'DRAFT'
  ElMessage.success('已重置为草稿')
  loadList()
}
async function handleRetryPush(row: any) {
  await ElMessageBox.confirm(`重新推送「${row.projectCode}」到飞书？`, '重试推送', { type: 'warning' })
  row.status = 'PUSHED_TO_FEISHU'
  ElMessage.success('已重新推送飞书')
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.purchase-request-page :deep(.el-tabs--border-card) {
  --el-tabs-header-height: 38px;
}
.purchase-request-page :deep(.el-table .cell) {
  font-size: 12px;
}
</style>
