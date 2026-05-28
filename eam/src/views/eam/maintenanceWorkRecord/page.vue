<template>
  <div class="maintenance-work-record-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="120px"
      >
        <el-form-item label="保养单号" prop="code">
          <el-input
            v-model="queryParams.code"
            class="!w-200px"
            clearable
            placeholder="请输入保养单号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="工单生成时间" prop="createTimeRange">
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

    <!-- ==================== 主表列表 ==================== -->
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
        <el-table-column
          label="是否更换备件"
          align="center"
          prop="needReplSparePartText"
          width="120"
        />
        <el-table-column label="计划保养时间" align="center" width="310">
          <template #default="scope">
            <span v-if="scope.row.workStartTime && scope.row.overdueTime">
              {{ formatDateTime(scope.row.workStartTime) }} 至
              {{ formatDateTime(scope.row.overdueTime) }}
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="保养开始时间" align="center" prop="startTime" width="160" />
        <el-table-column label="保养完成时间" align="center" prop="endTime" width="160" />
        <el-table-column label="保养用时" align="center" prop="useTime" width="100">
          <template #default="scope">
            {{ formatUseTime(scope.row.useTime) }}
          </template>
        </el-table-column>
        <el-table-column label="保养人" align="center" prop="personName" width="100" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="80">
          <template #default="scope">
            <el-button link class="btn-other" @click="handleView(scope.row)">
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

    <!-- ==================== 下方 Tabs：保养明细 + 备件列表 ==================== -->
    <ContentWrap>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="保养明细" name="item">
          <el-table
            v-loading="itemLoading"
            :data="itemList"
            :stripe="true"
            :show-overflow-tooltip="true"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column
              label="保养部位"
              align="center"
              prop="maintenancePart"
              min-width="200"
            />
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
          <Pagination
            :total="itemTotal"
            v-model:page="itemQueryParams.pageNo"
            v-model:limit="itemQueryParams.pageSize"
            @pagination="getItemList"
          />
        </el-tab-pane>

        <el-tab-pane label="备件列表" name="spare">
          <el-table
            v-loading="spareLoading"
            :data="spareList"
            :stripe="true"
            :show-overflow-tooltip="true"
          >
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="备件编号" align="center" prop="partCode" width="120" />
            <el-table-column label="备件名称" align="center" prop="partName" width="150" />
            <el-table-column
              label="规格型号"
              align="center"
              prop="partSpecification"
              min-width="220"
            />
            <el-table-column label="备件类型" align="center" prop="partGroupName" width="180" />
            <el-table-column label="数量" align="center" prop="useAmount" width="100" />
            <el-table-column label="库存单位" align="center" prop="stockUnitName" width="100" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- ==================== 详情弹窗 ==================== -->
    <DetailDialog ref="detailRef" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import * as RecordApi from '@/api/eam/maintenanceWorkRecord'
import { useEamEnumStore } from '@/store/modules/enums'
import DetailDialog from './detail.vue'

defineOptions({ name: 'EamMaintenanceWorkRecord' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 搜索条件 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<RecordApi.WorkRecordVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  code: undefined as string | undefined,
  createTime_begin: undefined as string | undefined,
  createTime_end: undefined as string | undefined
})
const queryFormRef = ref()

// 默认最近 30 天
const createTimeRange = ref<string[]>([
  dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')
])

// ==================== 当前选中行 ====================
const currentRow = ref<RecordApi.WorkRecordVo | null>(null)

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

    const res = await RecordApi.getWorkRecordPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
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
  clearSubSection()
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
  clearSubSection()
  handleQuery()
}

const getRowClassName = ({ row }: { row: RecordApi.WorkRecordVo }) => {
  return currentRow.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行：同时加载保养明细 + 备件列表 ====================
const handleRowDblClick = (row: RecordApi.WorkRecordVo) => {
  if (row.id === currentRow.value?.id) return
  currentRow.value = row
  itemQueryParams.pageNo = 1
  getItemList()
  getSpareList()
}

// ==================== 行内查看 ====================
const detailRef = ref()

const handleView = (row: RecordApi.WorkRecordVo) => {
  detailRef.value?.open(row)
}

// ==================== 格式化工具 ====================
const formatDateTime = (val: string) => {
  if (!val) return ''
  return dayjs(val).format('MM-DD HH:mm')
}

const formatUseTime = (val: number | null | undefined) => {
  if (val == null || val <= 0) return ''
  const hours = Math.floor(val / 60)
  const minutes = Math.floor(val % 60)
  return hours + '小时' + minutes + '分'
}

// ==================== 保养明细子表 ====================
const activeTab = ref('item')
const itemLoading = ref(false)
const itemList = ref<RecordApi.WorkRecordItemVo[]>([])
const itemTotal = ref(0)
const itemQueryParams = reactive({
  pageNo: 1,
  pageSize: 5
})

const getItemList = async () => {
  if (!currentRow.value) return
  itemLoading.value = true
  try {
    const res = await RecordApi.getWorkRecordItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      workCode: currentRow.value.code
    })
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

// ==================== 备件列表子表 ====================
const spareLoading = ref(false)
const spareList = ref<RecordApi.SparePartDetailVo[]>([])

const getSpareList = async () => {
  if (!currentRow.value) return
  spareLoading.value = true
  try {
    spareList.value = await RecordApi.getSparePartsList(currentRow.value.code)
  } finally {
    spareLoading.value = false
  }
}

// ==================== 公共方法 ====================
const clearSubSection = () => {
  currentRow.value = null
  itemList.value = []
  itemTotal.value = 0
  spareList.value = []
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadMaintenanceWorkOrderEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.maintenance-work-record-page {
  height: 100%;
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式
:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>
