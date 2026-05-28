<template>
  <div class="maintenance-work-order-page">
    <QueryForm :model="queryParams" :cols="3" @search="handleQuery" @reset="resetQuery">
      <QueryItem label="工单编号">
        <el-input v-model="queryParams.code" clearable placeholder="请输入工单编号" />
      </QueryItem>
      <QueryItem label="保养状态">
        <el-select v-model="queryParams.status" placeholder="请选择保养状态" clearable>
          <el-option
            v-for="item in searchStatusOptions"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </QueryItem>
      <QueryItem label="创建时间">
        <el-date-picker
          v-model="createTimeRange"
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
          <Icon icon="ep:plus" class="mr-5px" />快速工单
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />批量删除
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DISPATCH]"
          type="warning"
          :disabled="selectedIds.length !== 1"
          @click="handleDispatch"
        >
          <Icon icon="ep:user" class="mr-5px" />派工
        </el-button>
        <el-button
          v-hasPermi="[PERMI.FINISH]"
          type="success"
          :disabled="selectedIds.length !== 1"
          @click="handleComplete"
        >
          <Icon icon="ep:check" class="mr-5px" />完成工单
        </el-button>
        <el-button
          type="danger"
          :disabled="selectedIds.length !== 1"
          @click="handleTransferToRepair"
        >
          <Icon icon="ep:warning" class="mr-5px" />异常转维修
        </el-button>
      </template>

      <el-table
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养单号" align="center" prop="code" width="160" />
        <el-table-column label="保养状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getMaintenanceWorkStatusType(scope.row.status)">
              {{ eamEnumStore.getMaintenanceWorkStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center" prop="planName" min-width="180" />
        <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
        <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="180" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="120" />
        <el-table-column label="设备型号" align="center" prop="equipmentModel" width="120" />
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="120" />
        <el-table-column label="保养开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="保养完成时间" align="center" prop="endTime" width="160" />
        <el-table-column label="保养用时" align="center" prop="useTime" width="100" />
        <el-table-column label="保养人" align="center" prop="personName" width="100" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <RowActions
              :row="scope.row"
              :on-detail="checkPermi([PERMI.QUERY]) ? (r: any) => openForm('view', r) : null"
              :on-edit="
                checkPermi([PERMI.UPDATE]) && ['1','2','3'].includes(scope.row.status)
                  ? (r: any) => openForm('edit', r)
                  : null
              "
              :on-delete="
                checkPermi([PERMI.DELETE]) && scope.row.status === '1'
                  ? handleDelete
                  : null
              "
            />
          </template>
        </el-table-column>
      </el-table>
    </ListPage>

    <!-- ==================== 下方：保养项子表（只读） ==================== -->
    <ContentWrap>
      <div class="item-section-header">保养项明细</div>
      <el-table
        v-loading="itemLoading"
        :data="itemList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养部位" align="center" prop="maintenancePart" min-width="200" />
        <el-table-column label="保养标准说明" align="center" prop="remark" min-width="200" />
        <el-table-column label="是否已保养" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag
              v-if="scope.row.status != null && scope.row.status !== ''"
              :type="eamEnumStore.getMaintenanceWorkItemStatusType(scope.row.status)"
            >
              {{ eamEnumStore.getMaintenanceWorkItemStatusText(scope.row.status) }}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="处理备注" align="center" prop="dealRemark" min-width="200" />
        <el-table-column label="排序" align="center" prop="seq" width="80" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      </el-table>
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <WorkOrderForm ref="formRef" @success="onFormSuccess" />

    <!-- 人员选择弹窗（派工用） -->
    <PersonSelectDialog ref="personDialogRef" @confirm="onDispatchPersonConfirm" />

    <!-- 完成工单确认弹窗 -->
    <Dialog v-model="completeDialogVisible" title="完成工单确认" width="420px">
      <el-form
        ref="completeFormRef"
        :model="completeFormData"
        :rules="completeFormRules"
        label-width="80px"
      >
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="completeFormData.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择开始时间"
            class="w-full"
          />
        </el-form-item>
        <el-form-item label="完成日期" prop="endTime">
          <el-date-picker
            v-model="completeFormData.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择完成日期"
            class="w-full"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="completeDialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="completeSubmitLoading" @click="onCompleteConfirm">
          确 定
        </el-button>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { checkPermi } from '@/utils/permission'
import * as WorkOrderApi from '@/api/eam/maintenanceWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import WorkOrderForm from './form.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'
import { ElMessageBox } from 'element-plus'
import request from '@/config/axios'

defineOptions({ name: 'EamMaintenanceWorkOrder' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:maintenanceWorkOrder:query',
  CREATE: 'eam:maintenanceWorkOrder:create',
  UPDATE: 'eam:maintenanceWorkOrder:update',
  DELETE: 'eam:maintenanceWorkOrder:delete',
  DISPATCH: 'eam:maintenanceWorkOrder:dispatch',
  FINISH: 'eam:maintenanceWorkOrder:finish'
}

// ==================== 搜索条件 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<WorkOrderApi.WorkOrderVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  code: undefined as string | undefined,
  status: undefined as string | undefined,
  createTime_begin: undefined as string | undefined,
  createTime_end: undefined as string | undefined
})
const createTimeRange = ref<string[]>([])

/** 搜索状态下拉仅显示 1/2/3（不显示已完成4） */
const searchStatusOptions = computed(() => {
  return eamEnumStore.getMaintenanceWorkStatusList.filter((item) =>
    ['1', '2', '3'].includes(item.value)
  )
})

// ==================== 列表选中状态 ====================
const selectedIds = ref<string[]>([])
const selectedRows = ref<WorkOrderApi.WorkOrderVo[]>([])
const currentRow = ref<WorkOrderApi.WorkOrderVo | null>(null)

// ==================== 主表列表 ====================
const getList = async () => {
  loading.value = true
  try {
    // 处理日期范围
    if (createTimeRange.value && createTimeRange.value.length === 2) {
      queryParams.createTime_begin = createTimeRange.value[0]
      queryParams.createTime_end = createTimeRange.value[1]
    } else {
      queryParams.createTime_begin = undefined
      queryParams.createTime_end = undefined
    }

    const res = await WorkOrderApi.getWorkOrderPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
      status: queryParams.status,
      createTime_begin: queryParams.createTime_begin,
      createTime_end: queryParams.createTime_end
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0

    // 刷新后更新当前选中行引用
    if (currentRow.value) {
      const found = list.value.find((r) => r.id === currentRow.value!.id)
      if (found) {
        currentRow.value = found
      } else {
        clearSubSection()
      }
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearSubSection()
  getList()
}

const resetQuery = () => {
  queryParams.code = undefined
  queryParams.status = undefined
  createTimeRange.value = []
  queryParams.createTime_begin = undefined
  queryParams.createTime_end = undefined
  clearSubSection()
  handleQuery()
}

const handleSelectionChange = (rows: WorkOrderApi.WorkOrderVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
  selectedRows.value = rows
}

const getRowClassName = ({ row }: { row: WorkOrderApi.WorkOrderVo }) => {
  return currentRow.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: WorkOrderApi.WorkOrderVo) => {
  if (row.id === currentRow.value?.id) return
  currentRow.value = row
  getItemList()
}

// ==================== 主表 CRUD ====================
const formRef = ref()

const openForm = (mode: 'create' | 'edit' | 'view', row?: WorkOrderApi.WorkOrderVo) => {
  formRef.value.open(mode, row)
}

const handleDelete = async (row: WorkOrderApi.WorkOrderVo) => {
  if (row.status !== '1') {
    message.warning('仅未开始状态的工单可删除')
    return
  }
  try {
    await message.delConfirm()
    await WorkOrderApi.deleteWorkOrder(row.id)
    message.success('删除成功')
    if (row.id === currentRow.value?.id) {
      clearSubSection()
    }
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  // 校验选中行状态
  const invalid = selectedRows.value.some((r) => r.status !== '1')
  if (invalid) {
    message.warning('请只选择未开始状态的工单')
    return
  }
  try {
    await message.delConfirm()
    await WorkOrderApi.batchDeleteWorkOrder(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearSubSection()
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const onFormSuccess = () => {
  getList()
}

// ==================== 派工 ====================
const personDialogRef = ref()
const dispatchTargetRow = ref<WorkOrderApi.WorkOrderVo | null>(null)

const handleDispatch = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '1') {
    message.warning('仅未开始状态的工单可派工')
    return
  }
  dispatchTargetRow.value = row
  personDialogRef.value?.open()
}

const onDispatchPersonConfirm = async (user: {
  id: number
  nickname: string
  username: string
}) => {
  if (!dispatchTargetRow.value) return
  try {
    await WorkOrderApi.dispatchWorkOrder({
      id: dispatchTargetRow.value.id,
      personSn: String(user.id),
      personName: user.nickname
    })
    message.success('派工成功')
    dispatchTargetRow.value = null
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // API 异常
  }
}

// ==================== 完成工单 ====================
const completeDialogVisible = ref(false)
const completeSubmitLoading = ref(false)
const completeFormRef = ref()
const completeTargetRow = ref<WorkOrderApi.WorkOrderVo | null>(null)
const completeFormData = reactive({ startTime: '' as string, endTime: '' as string })
const completeFormRules = {
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择完成日期', trigger: 'change' }]
}

const handleComplete = () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (!['2', '3'].includes(row.status)) {
    message.warning('仅待保养或保养中的工单可完成')
    return
  }
  completeTargetRow.value = row
  completeFormData.startTime = row.startTime || ''
  completeFormData.endTime = ''
  completeDialogVisible.value = true
}

const onCompleteConfirm = async () => {
  const valid = await completeFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!completeTargetRow.value) return
  completeSubmitLoading.value = true
  try {
    const res: any = await WorkOrderApi.completeWorkOrder({
      code: completeTargetRow.value.code,
      startTime: completeFormData.startTime,
      endTime: completeFormData.endTime
    })
    // mock 端会返回 consumedSpareParts（自动扣减的备件清单）
    const consumed = res?.consumedSpareParts || []
    if (consumed.length) {
      const detail = consumed.map((c: any) =>
        `${c.number} ${c.name} -${c.qty}${c.unit}（库存 ${c.before}→${c.after}）`
      ).join('\n')
      ElMessageBox.alert(detail, '完工成功，已扣减备件库存', { confirmButtonText: '知道了' })
    } else {
      message.success('完成工单成功（本次保养未消耗备件）')
    }
    completeDialogVisible.value = false
    completeTargetRow.value = null
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // API 异常
  } finally {
    completeSubmitLoading.value = false
  }
}

// ==================== 异常转维修 ====================
const handleTransferToRepair = async () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条数据')
    return
  }
  const row = selectedRows.value[0]
  if (!['1', '2', '3'].includes(row.status)) {
    message.warning('已完工/已挂起的工单不可再转维修')
    return
  }
  try {
    const { value: remark } = await ElMessageBox.prompt(
      `确认将「${row.code} ${row.equipmentName}」转为维修工单？\n保养工单将挂起，自动生成对应的维修工单。`,
      '异常转维修',
      {
        confirmButtonText: '确认转维修',
        cancelButtonText: '取消',
        inputType: 'textarea',
        inputPlaceholder: '请简述异常情况（可选）',
        inputValue: '',
      }
    )
    const res: any = await request.post({
      url: '/workOrder/eamMaintenanceWork/transferToRepair',
      data: { code: row.code, remark }
    })
    ElMessageBox.alert(
      `已生成维修工单：${res?.repairCode || '-'}\n请到"维修管理 → 维修工单"查看处理`,
      '转维修成功',
      { confirmButtonText: '知道了' }
    )
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 保养项子表（只读） ====================
const itemLoading = ref(false)
const itemList = ref<WorkOrderApi.WorkOrderItemVo[]>([])

const getItemList = async () => {
  if (!currentRow.value) return
  itemLoading.value = true
  try {
    const res = await WorkOrderApi.getWorkOrderItemPage({
      pageNo: 1,
      pageSize: 1000,
      workCode: currentRow.value.code
    })
    itemList.value = res.records ?? []
  } finally {
    itemLoading.value = false
  }
}

// ==================== 公共方法 ====================
const clearSubSection = () => {
  currentRow.value = null
  itemList.value = []
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadMaintenanceWorkOrderEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.maintenance-work-order-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-header {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式
:deep(.el-button.btn-edit) {
  color: #0097ba;

  &:hover {
    color: rgb(0 151 186 / 75%);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>
