<template>
  <div class="spot-inspection-record-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="110px"
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
        <el-form-item label="巡检开始时间" prop="workStartTimeRange">
          <el-date-picker
            v-model="workStartTimeRange"
            type="datetimerange"
            start-placeholder="请选择开始时间"
            end-placeholder="请选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :disabled-date="disableFutureDate"
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

    <!-- ==================== 主表列表（已完成工单记录） ==================== -->
    <ContentWrap>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="工单编号" align="center" prop="workCode" width="150" />
        <el-table-column label="计划名称" align="center" prop="planName" min-width="150" />
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
        <!-- 产能组、产品型号、巡检岗位、巡检状态、设备巡检进度 已删除，不迁移 -->
        <el-table-column label="计划巡检时间" align="center" width="300">
          <template #default="scope">
            {{ formatPlanTime(scope.row.workStartTime, scope.row.overdueTime) }}
          </template>
        </el-table-column>
        <el-table-column label="巡检开始时间" align="center" prop="startTime" width="200" />
        <el-table-column label="巡检结束时间" align="center" prop="endTime" width="200" />
        <el-table-column label="巡检人员" align="center" prop="personName" width="200" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="200">
          <template #default="scope">
            {{ scope.row.createByPersonName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="200" />
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
      <div class="item-section-title">点巡检设备列表</div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.QUERY]"
          plain
          type="success"
          :disabled="deviceSelectedRows.length !== 1"
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
        <el-table-column label="检查项目进度" align="center" prop="spotInspection" width="120" />
        <el-table-column label="巡检开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="巡检结束时间" align="center" prop="endTime" width="160" />
        <el-table-column label="设备编号" align="center" prop="deviceSn" width="140" />
        <el-table-column label="设备名称" align="center" prop="deviceName" min-width="200" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
        <el-table-column label="设备型号" align="center" prop="deviceMode" width="120" />
        <!-- 产能组已删除，不迁移 -->
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="240" />
        <el-table-column label="巡检人" align="center" prop="personName" width="100" />
        <el-table-column label="跳过原因" align="center" prop="skipReason" width="150" />
        <el-table-column label="跳过人" align="center" prop="skipPersonName" width="100" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100">
          <template #default="scope">
            {{ scope.row.createByPersonName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <!-- 无操作列：只读模块 -->
      </el-table>

      <Pagination
        :total="deviceTotal"
        v-model:page="deviceQueryParams.pageNo"
        v-model:limit="deviceQueryParams.pageSize"
        @pagination="getDeviceList"
      />
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <RecordDetail ref="recordDetailRef" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import * as WorkApi from '@/api/eam/spotInspectionWork'
import { useEamEnumStore } from '@/store/modules/enums'
import RecordDetail from './record-detail.vue'

defineOptions({ name: 'EamSpotInspectionRecord' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:spotInspectionWork:query'
}

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<WorkApi.WorkVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  workCode: undefined as string | undefined,
  planName: undefined as string | undefined
})
const queryFormRef = ref()
const currentRecord = ref<WorkApi.WorkVo | null>(null)

// 搜索时间范围，默认近 30 天
const workStartTimeRange = ref<string[]>([
  dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
  dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
])

/** 禁止选择未来日期 */
const disableFutureDate = (date: Date) => {
  return dayjs(date).isAfter(dayjs(), 'day')
}

const getList = async () => {
  loading.value = true
  try {
    const params: WorkApi.WorkDto = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      workCode: queryParams.workCode,
      planName: queryParams.planName,
      status: '3' // 固定查询已完成记录
    }
    // 巡检开始时间范围
    if (workStartTimeRange.value && workStartTimeRange.value.length === 2) {
      ;(params as any).workStartTime_begin = workStartTimeRange.value[0]
      ;(params as any).workStartTime_end = workStartTimeRange.value[1]
    }
    const res = await WorkApi.getWorkPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
    // 刷新后更新当前选中引用
    if (currentRecord.value) {
      const found = list.value.find((r) => r.id === currentRecord.value!.id)
      if (found) {
        currentRecord.value = found
      } else {
        clearSubSection()
      }
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  // 校验时间范围不能超过 90 天
  if (workStartTimeRange.value && workStartTimeRange.value.length === 2) {
    const start = dayjs(workStartTimeRange.value[0])
    const end = dayjs(workStartTimeRange.value[1])
    if (end.diff(start, 'day') > 90) {
      message.warning('时间范围不能超过90天，请重新选择')
      return
    }
  }
  queryParams.pageNo = 1
  clearSubSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  // 重置时间为默认近 30 天
  workStartTimeRange.value = [
    dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
  ]
  clearSubSection()
  queryParams.pageNo = 1
  getList()
}

const getRowClassName = ({ row }: { row: WorkApi.WorkVo }) => {
  return currentRecord.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载设备子表 ====================
const handleRowDblClick = (row: WorkApi.WorkVo) => {
  if (row.id === currentRecord.value?.id) return
  currentRecord.value = row
  deviceSelectedRows.value = []
  deviceQueryParams.pageNo = 1
  getDeviceList()
}

// ==================== 格式化计划巡检时间 ====================
const formatPlanTime = (start: string, end: string) => {
  if (!start || !end) return '--'
  return dayjs(start).format('MM-DD HH:mm') + ' 至 ' + dayjs(end).format('MM-DD HH:mm')
}

// ==================== 设备子表 ====================
const deviceLoading = ref(false)
const deviceTotal = ref(0)
const deviceList = ref<WorkApi.WorkStandardVo[]>([])
const deviceQueryParams = reactive({ pageNo: 1, pageSize: 5 })
const deviceSelectedRows = ref<WorkApi.WorkStandardVo[]>([])

const getDeviceList = async () => {
  if (!currentRecord.value) return
  deviceLoading.value = true
  try {
    const res = await WorkApi.getWorkStandardPage({
      pageNo: deviceQueryParams.pageNo,
      pageSize: deviceQueryParams.pageSize,
      workCode: currentRecord.value.workCode
    })
    deviceList.value = res.records ?? []
    deviceTotal.value = res.total ?? 0
  } finally {
    deviceLoading.value = false
  }
}

const handleDeviceSelectionChange = (rows: WorkApi.WorkStandardVo[]) => {
  deviceSelectedRows.value = rows
}

// ==================== 查看详情 ====================
const recordDetailRef = ref()

const handleViewDetail = () => {
  if (deviceSelectedRows.value.length !== 1) {
    message.warning('请选择一条设备数据')
    return
  }
  recordDetailRef.value.open(deviceSelectedRows.value[0])
}

// ==================== 公共方法 ====================
const clearSubSection = () => {
  currentRecord.value = null
  deviceList.value = []
  deviceTotal.value = 0
  deviceSelectedRows.value = []
  deviceQueryParams.pageNo = 1
}

// ==================== 初始化 ====================
onMounted(async () => {
  await Promise.all([eamEnumStore.loadYesNo(), eamEnumStore.loadEquipmentMode()])
  await getList()
})
</script>

<style lang="scss" scoped>
.spot-inspection-record-page {
  height: 100%;
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
</style>
