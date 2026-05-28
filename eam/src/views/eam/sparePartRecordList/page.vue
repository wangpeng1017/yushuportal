<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-card shadow="never" class="mb-10px">
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="记录单号" prop="recordCode">
          <el-input
            v-model="queryParams.recordCode"
            class="!w-200px"
            clearable
            placeholder="请输入记录单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentSn">
          <el-input
            v-model="queryParams.equipmentSn"
            class="!w-200px"
            clearable
            placeholder="请输入设备编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备名称" prop="equipmentName">
          <el-input
            v-model="queryParams.equipmentName"
            class="!w-200px"
            clearable
            placeholder="请输入设备名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关联单号" prop="refWoCode">
          <el-input
            v-model="queryParams.refWoCode"
            class="!w-200px"
            clearable
            placeholder="请输入关联单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="createTimeRange"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            :disabled-date="disabledDate"
            class="!w-360px"
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
    </el-card>

    <!-- 使用记录列表 -->
    <el-card shadow="never" class="mb-10px">
      <div class="table-title">使用记录</div>
      <el-table
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @row-click="handleRowClick"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="记录单号" align="center" prop="recordCode" />
        <el-table-column label="领用时间" align="center" prop="usageTime"  />
        <el-table-column label="设备编号" align="center" prop="equipmentSn"/>
        <el-table-column label="设备名称" align="center" prop="equipmentName"  />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeName"  />
        <el-table-column label="设备型号" align="center" prop="equipmentMode"  />
        <!-- <el-table-column label="产能组" align="center" prop="capacityGroupName" width="150" /> -->
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" />
        <el-table-column label="关联工单类型" align="center" prop="refWoType">
          <template #default="scope">
            {{ getRefWoTypeLabel(scope.row.refWoType) }}
          </template>
        </el-table-column>
        <el-table-column label="关联单号" align="center" prop="refWoCode"  />
        <!-- <el-table-column label="工作中心" align="center" prop="workCenterName" width="150" /> -->
        <!-- <el-table-column label="生产车间" align="center" prop="workShopName" width="150" /> -->
        <el-table-column label="操作类型" align="center" prop="operationType" width="90">
          <template #default="scope">
            <el-tag :type="scope.row.operationType === '退库' ? 'warning' : ''">
              {{ scope.row.operationType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createByPersonName"  />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>

    <!-- 记录详情列表 -->
    <el-card shadow="never">
      <div class="table-title">记录详情</div>
      <el-table
        v-loading="detailLoading"
        :data="detailList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="备件编号" align="center" prop="partCode"  />
        <el-table-column label="备件名称" align="center" prop="partName"  />
        <el-table-column label="规格型号" align="center" prop="partSpecification"  />
        <el-table-column label="备件类型" align="center" prop="partGroupName" />
        <el-table-column label="数量" align="center" prop="useAmount"  />
        <el-table-column label="库存单位" align="center" prop="stockUnitName"  />
        <el-table-column label="创建人" align="center" prop="createByPersonName"  />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          :formatter="dateFormatter"
        />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="detailTotal"
        v-model:page="detailQueryParams.pageNo"
        v-model:limit="detailQueryParams.pageSize"
        @pagination="getDetailList"
      />
    </el-card>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as SparePartRecordApi from '@/api/eam/sparePartRecord'

defineOptions({ name: 'EamSparePartRecord' })


// ==================== 时间范围相关 ====================
const createTimeRange = ref([])
//   dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
//   dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')

// 禁用未来日期
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// ==================== 使用记录列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<SparePartRecordApi.SparePartRecordDto[]>([])
const selectedRecordId = ref<string>('')
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  recordCode: undefined as string | undefined,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  refWoCode: undefined as string | undefined,
  createTime_begin: undefined as string | undefined,
  createTime_end: undefined as string | undefined
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 设置时间范围
    if (createTimeRange.value && createTimeRange.value.length === 2) {
      queryParams.createTime_begin = createTimeRange.value[0]
      queryParams.createTime_end = createTimeRange.value[1]
      
      // 验证时间范围不超过90天
    //   const startDate = dayjs(createTimeRange.value[0])
    //   const endDate = dayjs(createTimeRange.value[1])
    //   const daysDiff = endDate.diff(startDate, 'day')
      
    //   if (daysDiff > 90) {
    //     message.warning('时间范围不能超过90天，请重新选择')
    //     return
    //   }
    }else{
        queryParams.createTime_begin=''
        queryParams.createTime_end=''
    }
    
    const res = await SparePartRecordApi.getSparePartRecordList(queryParams)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  selectedRecordId.value = ''
  detailList.value = []
  detailTotal.value = 0
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  createTimeRange.value = []
//   createTimeRange.value = [
//     dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD HH:mm:ss'),
//     dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss')
//   ]
  selectedRecordId.value = ''
  detailList.value = []
  detailTotal.value = 0
  handleQuery()
}

/** 行点击事件 */
const handleRowClick = (row: SparePartRecordApi.SparePartRecordDto) => {
  if (selectedRecordId.value === row.id) {
    return
  }
  selectedRecordId.value = row.id || ''
  detailQueryParams.recordId = row.id
  detailQueryParams.pageNo = 1
  getDetailList()
}

/** 行样式 */
const getRowClassName = ({ row }: { row: SparePartRecordApi.SparePartRecordDto }) => {
  return selectedRecordId.value === row.id ? 'selected-row' : ''
}

/** 关联工单类型标签 */
const getRefWoTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    maintenance: '保养',
    repair: '维修'
  }
  return map[type] || type
}

// ==================== 记录详情列表相关 ====================
const detailLoading = ref(false)
const detailTotal = ref(0)
const detailList = ref<SparePartRecordApi.SparePartRecordDetailDto[]>([])
const detailQueryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  recordId: undefined as string | undefined
})

/** 查询详情列表 */
const getDetailList = async () => {
  if (!detailQueryParams.recordId) {
    detailList.value = []
    detailTotal.value = 0
    return
  }
  
  detailLoading.value = true
  try {
    const res = await SparePartRecordApi.getSparePartRecordDetailList(detailQueryParams)
    detailList.value = res.records ?? []
    detailTotal.value = res.total ?? 0
  } finally {
    detailLoading.value = false
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.table-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 15px;
  color: #303133;
}

:deep(.selected-row) {
  background-color: #e6f7ff !important;
}

:deep(.el-card__body) {
  padding: 15px;
}
</style>
