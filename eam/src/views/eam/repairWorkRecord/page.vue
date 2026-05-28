<template>
  <!-- 搜索区域 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="auto"
    >
      <el-form-item label="维修单号" prop="repairCode">
        <el-input
          v-model="queryParams.repairCode"
          placeholder="请输入维修单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTimeRange">
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          class="!w-240px"
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

  <!-- 列表区域 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="维修单号" align="center" prop="repairCode" width="160" />
      <el-table-column label="维修人员" align="center" prop="repairPersonName" width="100" />
      <el-table-column
        label="维修开始时间"
        align="center"
        prop="repairBeginTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="维修结束时间"
        align="center"
        prop="repairEndTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" width="150" />
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName" width="120" />
      <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120" />
      <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="120" />
      <el-table-column
        label="是否更换备件"
        align="center"
        prop="needReplSparePartText"
        width="120"
      />
      <el-table-column label="故障描述" align="center" prop="remark" width="150" />
      <el-table-column label="紧急程度" align="center" prop="repairDegreeText" width="100" />
      <el-table-column label="故障等级" align="center" prop="breakdownLevelText" width="100" />
      <el-table-column
        label="故障时间"
        align="center"
        prop="breakdownTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="故障来源" align="center" prop="sourceType" width="100">
        <template #default="{ row }">
          {{ eamEnumStore.getRepairWorkOrderSourceText(row.sourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="停机时长" align="center" prop="shutdownDurationText" width="100" />
      <el-table-column label="确认人" align="center" prop="confirmPersonName" width="100" />
      <el-table-column label="报修工单号" align="center" prop="failureWorkOrderCode" width="160" />
      <el-table-column
        label="报修时间"
        align="center"
        prop="presentTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="报修人" align="center" prop="presentPersonName" width="100" />
      <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template #default="{ row }">
          <el-button
            link
            class="btn-other"
            @click="handleView(row)"
            v-hasPermi="['eam:repairWorkOrder:query']"
          >
            &nbsp;查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 详情弹窗 -->
  <DetailDialog ref="detailRef" />
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { dateFormatter } from '@/utils/formatTime'
import * as RecordApi from '@/api/eam/repairWorkRecord'
import type { RepairWorkOrderVo } from '@/api/eam/repairWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import DetailDialog from './detail.vue'

defineOptions({ name: 'EamRepairWorkRecord' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 搜索条件 ====================

const loading = ref(true)
const total = ref(0)
const list = ref<RepairWorkOrderVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repairCode: undefined as string | undefined,
  createTime_begin: undefined as string | undefined,
  createTime_end: undefined as string | undefined
})
const queryFormRef = ref()

// 默认最近 30 天
const createTimeRange = ref<string[]>([
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')
])

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

    const res = await RecordApi.getRepairRecordPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      repairCode: queryParams.repairCode,
      createTime_begin: queryParams.createTime_begin,
      createTime_end: queryParams.createTime_end
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  // 校验时间范围不超过 90 天
  if (createTimeRange.value && createTimeRange.value.length === 2) {
    const start = dayjs(createTimeRange.value[0])
    const end = dayjs(createTimeRange.value[1])
    if (end.diff(start, 'day') > 90) {
      message.warning('时间范围不能超过90天，请重新选择')
      return
    }
  }
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  createTimeRange.value = [
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]
  queryParams.createTime_begin = undefined
  queryParams.createTime_end = undefined
  handleQuery()
}

// ==================== 查看详情 ====================

const detailRef = ref()
const handleView = (row: RepairWorkOrderVo) => {
  detailRef.value?.open(row)
}

// ==================== 初始化 ====================

onMounted(async () => {
  await eamEnumStore.loadRepairWorkOrderSource()
  await getList()
})
</script>

<style lang="scss" scoped>
// 操作列按钮样式
:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>
