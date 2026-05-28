<template>
  <div class="failure-work-order-page">
    <QueryForm :model="queryParams" :cols="4" @search="handleQuery" @reset="resetQuery">
      <QueryItem label="报修单号">
        <el-input v-model="queryParams.failureCode" clearable placeholder="请输入报修单号" />
      </QueryItem>
      <QueryItem label="审核状态">
        <el-select v-model="queryParams.status" placeholder="请选择审核状态" clearable>
          <el-option
            v-for="item in eamEnumStore.getFailureWorkOrderStatusList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="维修状态">
        <el-select v-model="queryParams.executeStatus" placeholder="请选择维修状态" clearable>
          <el-option
            v-for="item in eamEnumStore.getFailureWorkOrderExecuteStatusList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="故障等级">
        <el-select v-model="queryParams.breakdownLevel" placeholder="请选择故障等级" clearable>
          <el-option
            v-for="item in eamEnumStore.getFailureWorkOrderBreakdownLevelList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="故障类别">
        <el-select v-model="queryParams.breakdownType" placeholder="请选择故障类别" clearable>
          <el-option
            v-for="item in eamEnumStore.getFailureWorkOrderBreakdownTypeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="紧急程度">
        <el-select v-model="queryParams.repairDegree" placeholder="请选择紧急程度" clearable>
          <el-option
            v-for="item in eamEnumStore.getRepairDegreeList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="故障时间" :span="2">
        <el-date-picker
          v-model="breakdownTimeRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 100%"
        />
      </QueryItem>
    </QueryForm>

    <ListPage
      :loading="loading"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    >
      <template #actions>
        <el-button v-hasPermi="[PERMI.CREATE]" type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.UPDATE]"
          type="warning"
          :disabled="selectedRows.length !== 1"
          @click="handleEdit"
        >
          <Icon icon="ep:edit" class="mr-5px" />编辑
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          type="danger"
          :disabled="selectedRows.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />删除
        </el-button>
        <el-button
          v-hasPermi="[PERMI.SUBMIT]"
          type="success"
          :disabled="selectedRows.length === 0"
          @click="handleSubmit"
        >
          <Icon icon="ep:promotion" class="mr-5px" />提交申请
        </el-button>
        <el-button
          v-hasPermi="[PERMI.AUDIT_PASS]"
          type="primary"
          :disabled="selectedRows.length !== 1"
          @click="handleAuditPass"
        >
          <Icon icon="ep:check" class="mr-5px" />审核通过
        </el-button>
        <el-button
          v-hasPermi="[PERMI.REJECT]"
          type="danger"
          :disabled="selectedRows.length !== 1"
          @click="handleReject"
        >
          <Icon icon="ep:close" class="mr-5px" />驳回
        </el-button>
      </template>

      <el-table
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="报修单号" prop="failureCode" min-width="160" align="center" />
        <el-table-column label="审核状态" prop="status" width="120" align="center">
          <template #default="{ row }">
            <el-tag :type="eamEnumStore.getFailureWorkOrderStatusType(row.status)">
              {{ eamEnumStore.getFailureWorkOrderStatusText(row.status) }}
            </el-tag>
            <el-icon
              v-if="row.status === '3'"
              class="reject-icon"
              @click.stop="showRejectReason(row)"
            >
              <QuestionFilled />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column label="是否创建维修单" width="130" align="center">
          <template #default="{ row }">
            <span v-if="row.status === '2' && row.executeStatus">是</span>
            <span v-else-if="row.status === '2' && !row.executeStatus">否</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="执行状态" width="100" align="center">
          <template #default="{ row }">
            <span v-if="row.executeStatus">
              {{ eamEnumStore.getFailureWorkOrderExecuteStatusText(row.executeStatus) }}
            </span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="设备编号" prop="equipmentSn" min-width="140" align="center" />
        <el-table-column label="设备名称" prop="equipmentName" min-width="160" align="center" />
        <el-table-column label="设备类型" prop="equipmentTypeName" width="120" align="center" />
        <el-table-column label="设备型号" prop="equipmentMode" width="120" align="center" />
        <el-table-column label="供应商" prop="equipmentSupplierName" width="240" align="center" />
        <el-table-column label="故障时间" prop="breakdownTime" width="160" align="center" />
        <el-table-column label="报修人" prop="personName" width="100" align="center" />
        <el-table-column label="故障等级" prop="breakdownLevelText" width="100" align="center" />
        <el-table-column label="故障类别" prop="breakdownTypeText" width="100" align="center" />
        <el-table-column label="紧急程度" prop="repairDegreeText" width="100" align="center" />
        <el-table-column label="故障描述" prop="remark" min-width="150" align="center" />
        <el-table-column label="创建人" prop="createByPersonName" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="160" align="center" />
        <el-table-column label="操作" width="80" align="center" fixed="right">
          <template #default="{ row }">
            <RowActions :row="row" :on-detail="openDetail" />
          </template>
        </el-table-column>
      </el-table>
    </ListPage>

    <!-- ==================== 新增/编辑弹窗 ==================== -->
    <FailureWorkOrderForm ref="formRef" @success="onFormSuccess" />

    <!-- ==================== 详情弹窗 ==================== -->
    <FailureWorkOrderDetail ref="detailRef" />

    <!-- ==================== 审核通过弹窗 ==================== -->
    <Dialog v-model="auditPassDialogVisible" title="审核通过" width="500px">
      <el-form
        ref="auditPassFormRef"
        :model="auditPassFormData"
        :rules="auditPassFormRules"
        label-width="130px"
      >
        <el-form-item label="报修单号">
          <el-input :model-value="auditPassRow?.failureCode" disabled />
        </el-form-item>
        <el-form-item label="是否创建维修单" prop="createRepair">
          <el-select v-model="auditPassFormData.createRepair" placeholder="请选择" class="w-full">
            <el-option
              v-for="item in eamEnumStore.getYesNoList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditPassDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="auditPassLoading" @click="onAuditPassConfirm">
          确 定
        </el-button>
      </template>
    </Dialog>

    <!-- ==================== 驳回弹窗 ==================== -->
    <Dialog v-model="rejectDialogVisible" title="驳回" width="500px">
      <el-form
        ref="rejectFormRef"
        :model="rejectFormData"
        :rules="rejectFormRules"
        label-width="100px"
      >
        <el-form-item label="驳回原因" prop="auditorIdea">
          <el-input
            v-model="rejectFormData.auditorIdea"
            type="textarea"
            :rows="4"
            :maxlength="60"
            show-word-limit
            placeholder="请输入驳回原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="rejectLoading" @click="onRejectConfirm">
          确 定
        </el-button>
      </template>
    </Dialog>

    <!-- ==================== 驳回原因查看弹窗 ==================== -->
    <Dialog v-model="rejectReasonVisible" title="驳回原因" width="400px">
      <div style="white-space: pre-wrap">{{ rejectReasonText }}</div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { QuestionFilled } from '@element-plus/icons-vue'
import * as FailureWorkOrderApi from '@/api/eam/failureWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import FailureWorkOrderForm from './form.vue'
import FailureWorkOrderDetail from './detail.vue'

defineOptions({ name: 'EamFailureWorkOrder' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:failureWorkOrder:query',
  CREATE: 'eam:failureWorkOrder:create',
  UPDATE: 'eam:failureWorkOrder:update',
  DELETE: 'eam:failureWorkOrder:delete',
  SUBMIT: 'eam:failureWorkOrder:submit',
  AUDIT_PASS: 'eam:failureWorkOrder:auditPass',
  REJECT: 'eam:failureWorkOrder:reject'
}

// ==================== 搜索条件 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<FailureWorkOrderApi.FailureWorkOrderVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  failureCode: undefined as string | undefined,
  status: undefined as string | undefined,
  executeStatus: undefined as string | undefined,
  breakdownLevel: undefined as string | undefined,
  breakdownType: undefined as string | undefined,
  repairDegree: undefined as string | undefined,
  breakdownTime_begin: undefined as string | undefined,
  breakdownTime_end: undefined as string | undefined
})
const breakdownTimeRange = ref<string[]>([])

// ==================== 选中行 ====================
const selectedRows = ref<FailureWorkOrderApi.FailureWorkOrderVo[]>([])

const handleSelectionChange = (rows: FailureWorkOrderApi.FailureWorkOrderVo[]) => {
  selectedRows.value = rows
}

// ==================== 列表加载 ====================
const getList = async () => {
  loading.value = true
  // 同步日期范围到查询参数
  if (breakdownTimeRange.value && breakdownTimeRange.value.length === 2) {
    queryParams.breakdownTime_begin = breakdownTimeRange.value[0]
    queryParams.breakdownTime_end = breakdownTimeRange.value[1]
  } else {
    queryParams.breakdownTime_begin = undefined
    queryParams.breakdownTime_end = undefined
  }
  try {
    const res = await FailureWorkOrderApi.getFailureWorkOrderPage(queryParams)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  // 日期范围校验：不超过 90 天
  if (breakdownTimeRange.value && breakdownTimeRange.value.length === 2) {
    const start = new Date(breakdownTimeRange.value[0])
    const end = new Date(breakdownTimeRange.value[1])
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    if (diffDays > 90) {
      message.warning('时间范围不能超过90天，请重新选择')
      return
    }
  }
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryParams.failureCode = undefined
  queryParams.status = undefined
  queryParams.executeStatus = undefined
  queryParams.breakdownLevel = undefined
  queryParams.breakdownType = undefined
  queryParams.repairDegree = undefined
  breakdownTimeRange.value = []
  queryParams.breakdownTime_begin = undefined
  queryParams.breakdownTime_end = undefined
  handleQuery()
}

// ==================== CRUD 操作 ====================
const formRef = ref()
const detailRef = ref()

const openForm = (mode: 'create' | 'edit', row?: FailureWorkOrderApi.FailureWorkOrderVo) => {
  formRef.value.open(mode, row)
}

const onFormSuccess = () => {
  getList()
}

const handleEdit = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '0' && row.status !== '3') {
    message.warning('仅草稿或驳回状态的工单可编辑')
    return
  }
  openForm('edit', row)
}

const openDetail = (row: FailureWorkOrderApi.FailureWorkOrderVo) => {
  detailRef.value.open(row)
}

const handleBatchDelete = async () => {
  const invalid = selectedRows.value.some((r) => r.status !== '0' && r.status !== '3')
  if (invalid) {
    message.warning('仅草稿或驳回状态的工单可删除')
    return
  }
  try {
    await message.delConfirm()
    const ids = selectedRows.value.map((r) => r.id).join(',')
    await FailureWorkOrderApi.batchDeleteFailureWorkOrder(ids)
    message.success('删除成功')
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 提交申请（弹窗选审核人） ====================
const handleSubmit = async () => {
  const invalid = selectedRows.value.some((r) => r.status !== '0' && r.status !== '3')
  if (invalid) {
    message.warning('仅草稿或驳回状态的工单可提交')
    return
  }
  if (selectedRows.value.length === 0) {
    message.warning('请先选择要提交的报修单')
    return
  }
  try {
    const { value: approver } = await ElMessageBox.prompt(
      `共 ${selectedRows.value.length} 张报修单，请选择审核人：\n陈主管（设备主管）/ 李部长（设备部负责人）/ 高学才（B端主管）/ 刚嘉成（数控组长）`,
      '提交审核',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '取消',
        inputPlaceholder: '请输入审核人姓名',
        inputValue: '陈主管',
        inputValidator: (v) => !!v || '请输入审核人',
      }
    )
    const ids = selectedRows.value.map((r) => r.id).join(',')
    await FailureWorkOrderApi.submitFailureWorkOrder(ids)
    message.success(`已提交给「${approver}」审核`)
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 审核通过 ====================
const auditPassDialogVisible = ref(false)
const auditPassLoading = ref(false)
const auditPassFormRef = ref()
const auditPassRow = ref<FailureWorkOrderApi.FailureWorkOrderVo | null>(null)
const auditPassFormData = reactive({
  createRepair: undefined as string | undefined
})
const auditPassFormRules = {
  createRepair: [{ required: true, message: '请选择是否创建维修单', trigger: 'change' }]
}

const handleAuditPass = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '1') {
    message.warning('仅审核中状态的工单可审核通过')
    return
  }
  auditPassRow.value = row
  auditPassFormData.createRepair = undefined
  auditPassDialogVisible.value = true
}

const onAuditPassConfirm = async () => {
  const valid = await auditPassFormRef.value?.validate().catch(() => false)
  if (!valid) return
  auditPassLoading.value = true
  try {
    await FailureWorkOrderApi.auditPassFailureWorkOrder({
      ids: auditPassRow.value!.id,
      createRepair: Number(auditPassFormData.createRepair)
    })
    message.success('审核通过成功')
    auditPassDialogVisible.value = false
    selectedRows.value = []
    getList()
  } finally {
    auditPassLoading.value = false
  }
}

// ==================== 驳回 ====================
const rejectDialogVisible = ref(false)
const rejectLoading = ref(false)
const rejectFormRef = ref()
const rejectRow = ref<FailureWorkOrderApi.FailureWorkOrderVo | null>(null)
const rejectFormData = reactive({
  auditorIdea: ''
})
const rejectFormRules = {
  auditorIdea: [{ required: true, message: '请输入驳回原因', trigger: 'blur' }]
}

const handleReject = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '1') {
    message.warning('仅审核中状态的工单可驳回')
    return
  }
  rejectRow.value = row
  rejectFormData.auditorIdea = ''
  rejectDialogVisible.value = true
}

const onRejectConfirm = async () => {
  const valid = await rejectFormRef.value?.validate().catch(() => false)
  if (!valid) return
  rejectLoading.value = true
  try {
    await FailureWorkOrderApi.rejectFailureWorkOrder({
      id: rejectRow.value!.id,
      auditorIdea: rejectFormData.auditorIdea
    })
    message.success('驳回成功')
    rejectDialogVisible.value = false
    selectedRows.value = []
    getList()
  } finally {
    rejectLoading.value = false
  }
}

// ==================== 驳回原因查看 ====================
const rejectReasonVisible = ref(false)
const rejectReasonText = ref('')

const showRejectReason = (row: FailureWorkOrderApi.FailureWorkOrderVo) => {
  rejectReasonText.value = row.auditorIdea || '无'
  rejectReasonVisible.value = true
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadFailureWorkOrderEnums()
  await eamEnumStore.loadYesNo()
  getList()
})
</script>

<style lang="scss" scoped>
.table-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.reject-icon {
  margin-left: 4px;
  font-size: 14px;
  color: var(--el-color-warning);
  vertical-align: middle;
  cursor: pointer;

  &:hover {
    color: var(--el-color-warning-light-3);
  }
}

.w-full {
  width: 100%;
}
</style>
