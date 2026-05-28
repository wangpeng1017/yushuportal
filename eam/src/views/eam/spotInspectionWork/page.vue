<template>
  <div class="spot-inspection-work-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="工单编号" prop="workCode">
          <el-input
            v-model="queryParams.workCode"
            class="!w-200px"
            clearable
            placeholder="请输入工单编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="计划名称" prop="planName">
          <el-input
            v-model="queryParams.planName"
            class="!w-200px"
            clearable
            placeholder="请输入计划名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="巡检状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择巡检状态"
            clearable
            class="!w-200px"
          >
            <!-- 搜索下拉只保留 value=1(待执行) 和 value=2(执行中) -->
            <el-option
              v-for="item in statusSearchOptions"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="inspectionType">
          <el-select v-model="queryParams.inspectionType" placeholder="全部" clearable class="!w-120px">
            <el-option label="点检" value="1" />
            <el-option label="巡检" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="工单生成时间" prop="createTimeRange">
          <el-date-picker
            v-model="createTimeRange"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            clearable
            class="!w-380px"
          />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- ==================== 主表列表 ==================== -->
    <ContentWrap>
      <div class="table-toolbar">
        <el-button v-hasPermi="[PERMI.DISPATCH]" plain @click="handleDispatch">
          <Icon icon="ep:user" class="mr-5px" />&nbsp;派工
        </el-button>
        <el-button plain type="danger" @click="handleTransferToRepair">
          <Icon icon="ep:warning" class="mr-5px" />&nbsp;异常转维修
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="工单编号" align="center" prop="workCode" width="150" />
        <el-table-column label="类型" align="center" prop="inspectionType" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.inspectionType === '2' ? 'warning' : ''">
              {{ scope.row.inspectionType === '2' ? '巡检' : '点检' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="巡检状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getWorkOrderStatusType(scope.row.status)">
              {{ eamEnumStore.getWorkOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="计划名称" align="center" prop="planName" min-width="220" />
        <el-table-column label="是否参数巡检" align="center" prop="hasParamPlan" width="120">
          <template #default="scope">
            {{ eamEnumStore.getYesNoText(scope.row.hasParamPlan) }}
          </template>
        </el-table-column>
        <el-table-column label="设备型号" align="center" prop="equipmentModel" width="150">
          <template #default="scope">
            {{
              eamEnumStore.getEquipmentModeText(scope.row.equipmentModel) ||
              scope.row.equipmentModel ||
              '--'
            }}
          </template>
        </el-table-column>
        <!-- 产品型号已删除，不迁移 -->
        <el-table-column label="设备巡检进度" align="center" prop="spotInspection" width="120" />
        <el-table-column label="计划巡检时间" align="center" width="300">
          <template #default="scope">
            {{ formatPlanTime(scope.row.workStartTime, scope.row.overdueTime) }}
          </template>
        </el-table-column>
        <el-table-column label="巡检开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="巡检结束时间" align="center" prop="endTime" width="160" />
        <el-table-column label="巡检人员" align="center" prop="personName" width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      </el-table>

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <!-- ==================== 设备子表 ==================== -->
    <ContentWrap>
      <div class="item-section-title">设备列表</div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.SKIP]"
          plain
          type="warning"
          :disabled="deviceSelectedIds.length === 0"
          @click="handleSkip"
        >
          <Icon icon="ep:remove" class="mr-5px" />&nbsp;跳过巡检
        </el-button>
        <el-button
          v-hasPermi="[PERMI.QUERY]"
          plain
          type="success"
          :disabled="deviceSelectedIds.length !== 1"
          @click="handleViewDetail"
        >
          <Icon icon="ep:view" class="mr-5px" />&nbsp;查看
        </el-button>
      </div>

      <el-table
        v-loading="deviceLoading"
        :data="deviceList"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleDeviceSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="操作" align="center" width="140">
          <template #default="scope">
            <!-- 后端实际值域需联调确认：status != '3' 表示非已巡检可执行 -->
            <el-button
              v-if="scope.row.status != '3'"
              v-hasPermi="[PERMI.EXECUTE]"
              link
              class="btn-edit"
              @click="handleExec(scope.row)"
            >
              &nbsp;执行
            </el-button>
            <el-button
              v-if="scope.row.abnormalNum > 0"
              link
              class="btn-other"
              @click="handleTriggerRepair(scope.row)"
            >
              &nbsp;转报修
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="巡检项目进度" align="center" prop="spotInspection" width="120" />
        <el-table-column label="异常" align="center" prop="abnormalNum" width="100">
          <template #default="scope">
            {{ scope.row.abnormalNum == 0 ? '无' : '异常(' + scope.row.abnormalNum + ')' }}
          </template>
        </el-table-column>
        <el-table-column label="巡检开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="巡检结束时间" align="center" prop="endTime" width="160" />
        <el-table-column label="是否参数巡检" align="center" prop="hasParamPlan" width="120">
          <template #default="scope">
            {{ eamEnumStore.getYesNoText(scope.row.hasParamPlan) }}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" align="center" prop="deviceSn" width="140" />
        <el-table-column label="设备名称" align="center" prop="deviceName" min-width="200" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
        <el-table-column label="设备型号" align="center" prop="deviceMode" width="120" />
        <!-- 产能组已删除，不迁移 -->
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="200" />
        <el-table-column label="巡检人" align="center" prop="personName" width="100" />
        <el-table-column label="跳过原因" align="center" prop="skipReason" width="150" />
        <el-table-column label="跳过人" align="center" prop="skipPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      </el-table>

      <Pagination
        :total="deviceTotal"
        v-model:page="deviceQueryParams.pageNo"
        v-model:limit="deviceQueryParams.pageSize"
        @pagination="getDeviceList"
      />
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <PersonSelectDialog ref="personSelectRef" @confirm="handlePersonConfirm" />
    <SkipForm ref="skipFormRef" @success="onSkipSuccess" />
    <ExecForm ref="execFormRef" @success="onExecSuccess" />
    <ExecDetail ref="execDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { ElMessageBox, ElMessage } from 'element-plus'
import request from '@/config/axios'
import * as WorkApi from '@/api/eam/spotInspectionWork'
import { useEamEnumStore } from '@/store/modules/enums'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'
import SkipForm from './skip-form.vue'
import ExecForm from './exec-form.vue'
import ExecDetail from './exec-detail.vue'

defineOptions({ name: 'EamSpotInspectionWork' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:spotInspectionWork:query',
  DISPATCH: 'eam:spotInspectionWork:dispatch',
  SKIP: 'eam:spotInspectionWork:skip',
  EXECUTE: 'eam:spotInspectionWork:execute'
}

// ==================== 搜索栏 - 状态下拉只保留待执行/执行中 ====================
const statusSearchOptions = computed(() => {
  return eamEnumStore.getWorkOrderStatusList.filter((item) => ['1', '2'].includes(item.value))
})

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<WorkApi.WorkVo[]>([])
const createTimeRange = ref<string[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  workCode: undefined as string | undefined,
  planName: undefined as string | undefined,
  status: undefined as string | undefined,
  inspectionType: undefined as string | undefined
})
const queryFormRef = ref()
const selectedRows = ref<WorkApi.WorkVo[]>([])
const currentWork = ref<WorkApi.WorkVo | null>(null)

const getList = async () => {
  loading.value = true
  try {
    const params: WorkApi.WorkDto = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      workCode: queryParams.workCode,
      planName: queryParams.planName,
      status: queryParams.status
    }
    // 时间范围
    if (createTimeRange.value && createTimeRange.value.length === 2) {
      params.createTime_begin = createTimeRange.value[0]
      params.createTime_end = createTimeRange.value[1]
    }
    const res = await WorkApi.getWorkPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
    // 刷新后更新当前选中引用
    if (currentWork.value) {
      const found = list.value.find((r) => r.id === currentWork.value!.id)
      if (found) {
        currentWork.value = found
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
  queryFormRef.value?.resetFields()
  createTimeRange.value = []
  clearSubSection()
  handleQuery()
}

const handleSelectionChange = (rows: WorkApi.WorkVo[]) => {
  selectedRows.value = rows
}

const getRowClassName = ({ row }: { row: WorkApi.WorkVo }) => {
  return currentWork.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载设备子表 ====================
const handleRowDblClick = (row: WorkApi.WorkVo) => {
  if (row.id === currentWork.value?.id) return
  currentWork.value = row
  deviceSelectedIds.value = []
  deviceSelectedRows.value = []
  deviceQueryParams.pageNo = 1
  getDeviceList()
}

// ==================== 格式化计划巡检时间 ====================
const formatPlanTime = (start: string, end: string) => {
  if (!start || !end) return '--'
  return dayjs(start).format('MM-DD HH:mm') + ' 至 ' + dayjs(end).format('MM-DD HH:mm')
}

// ==================== 派工 ====================
const personSelectRef = ref()
const pendingDispatchWork = ref<WorkApi.WorkVo | null>(null)

// ==================== 异常转维修 ====================
const handleTransferToRepair = async () => {
  if (selectedRows.value.length !== 1) {
    message.warning('请选择一条工单')
    return
  }
  const row = selectedRows.value[0]
  if (!['1', '2'].includes(row.status)) {
    message.warning('已完成的工单不可再转维修')
    return
  }
  try {
    const { value: remark } = await ElMessageBox.prompt(
      `确认将「${row.workCode}」转为维修工单？\n${row.inspectionType === '2' ? '巡检' : '点检'}工单将挂起，自动生成对应维修工单。`,
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
      url: '/workOrder/eamSpotInspectionWork/transferToRepair',
      data: { workCode: row.workCode, remark }
    })
    ElMessageBox.alert(
      `已生成维修工单：${res?.repairCode || '-'}\n请到"维修管理 → 维修工单"查看处理`,
      '转维修成功',
      { confirmButtonText: '知道了' }
    )
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleDispatch = () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择工单')
    return
  }
  if (selectedRows.value.length > 1) {
    message.warning('只能选择一条工单进行派工')
    return
  }
  const row = selectedRows.value[0]
  if (row.status !== '1') {
    message.warning('只能对"待执行"状态的工单进行派工')
    return
  }
  pendingDispatchWork.value = row
  personSelectRef.value.open()
}

const handlePersonConfirm = async (user: { id: number; nickname: string }) => {
  if (!pendingDispatchWork.value) return
  try {
    await WorkApi.updateWork({
      id: pendingDispatchWork.value.id,
      personSn: String(user.id),
      personName: user.nickname
    })
    message.success('派工成功')
    getList()
    if (currentWork.value) {
      getDeviceList()
    }
  } catch {
    // API 异常
  } finally {
    pendingDispatchWork.value = null
  }
}

// ==================== 设备子表 ====================
const deviceLoading = ref(false)
const deviceTotal = ref(0)
const deviceList = ref<WorkApi.WorkStandardVo[]>([])
const deviceQueryParams = reactive({ pageNo: 1, pageSize: 10 })
const deviceSelectedIds = ref<string[]>([])
const deviceSelectedRows = ref<WorkApi.WorkStandardVo[]>([])

const getDeviceList = async () => {
  if (!currentWork.value) return
  deviceLoading.value = true
  try {
    const res = await WorkApi.getWorkStandardPage({
      pageNo: deviceQueryParams.pageNo,
      pageSize: deviceQueryParams.pageSize,
      workCode: currentWork.value.workCode
    })
    deviceList.value = res.records ?? []
    deviceTotal.value = res.total ?? 0
  } finally {
    deviceLoading.value = false
  }
}

const handleDeviceSelectionChange = (rows: WorkApi.WorkStandardVo[]) => {
  deviceSelectedIds.value = rows.map((r) => r.id)
  deviceSelectedRows.value = rows
}

// ==================== 跳过巡检 ====================
const skipFormRef = ref()

const handleSkip = () => {
  if (deviceSelectedIds.value.length === 0) {
    message.warning('请选择设备')
    return
  }
  if (!currentWork.value) return
  skipFormRef.value.open(currentWork.value.id, deviceSelectedIds.value.join(','))
}

const onSkipSuccess = () => {
  getList()
  getDeviceList()
}

// ==================== 执行任务 ====================
const execFormRef = ref()

const handleExec = (row: WorkApi.WorkStandardVo) => {
  if (!currentWork.value) return
  execFormRef.value.open(row, currentWork.value)
}

const onExecSuccess = () => {
  getList()
  getDeviceList()
}

// ==================== 查看详情 ====================
const execDetailRef = ref()

const handleViewDetail = () => {
  if (deviceSelectedRows.value.length !== 1) {
    message.warning('请选择一条设备数据')
    return
  }
  execDetailRef.value.open(deviceSelectedRows.value[0])
}

// ==================== 转故障报修 ====================

const handleTriggerRepair = async (row: WorkApi.WorkStandardVo) => {
  const deviceId = row.deviceSn || (row as any).equipmentSn || ''
  await ElMessageBox.confirm(
    `设备 ${deviceId} 发现 ${row.abnormalNum} 项异常，是否转为故障报修？`,
    '转故障报修',
    { confirmButtonText: '确认报修', cancelButtonText: '取消', type: 'warning' }
  )
  // Mock: 直接提示成功
  ElMessage.success('已生成故障报修工单，请到"维修管理-故障报修"中查看')
}

// ==================== 公共方法 ====================
const clearSubSection = () => {
  currentWork.value = null
  deviceList.value = []
  deviceTotal.value = 0
  deviceSelectedIds.value = []
  deviceSelectedRows.value = []
  deviceQueryParams.pageNo = 1
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadSpotInspectionWorkEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.spot-inspection-work-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
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

:deep(.el-button.btn-other) {
  color: var(--el-color-warning);

  &:hover {
    color: rgb(230 162 60 / 75%);
  }
}
</style>
