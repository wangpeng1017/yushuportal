<template>
  <Dialog v-model="dialogVisible" :title="title" :width="width">
    <!-- 搜索区域 -->
    <el-form
      v-if="searchColumns.length > 0"
      class="-mb-15px search-form"
      :model="searchParams"
      :inline="true"
      label-width="auto"
      @submit.prevent
    >
      <el-form-item v-for="col in searchColumns" :key="col.prop" :label="col.label">
        <el-input
          v-model="searchParams[col.prop]"
          :placeholder="'请输入' + col.label"
          clearable
          class="!w-140px"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
        </el-button>
        <el-button @click="handleReset">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 选中提示 -->
    <el-alert
      class="mt-10px"
      :title="selectedRow ? '已选中 1 条数据' : '未选中任何数据'"
      :type="selectedRow ? 'success' : 'info'"
      :closable="false"
      show-icon
    />

    <!-- 表格区域 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      :stripe="true"
      :show-overflow-tooltip="true"
      highlight-current-row
      class="mt-10px"
      @current-change="handleCurrentChange"
      @row-dblclick="handleRowDblclick"
    >
      <!-- 单选列 -->
      <el-table-column width="50" align="center">
        <template #default="scope">
          <el-radio
            v-model="selectedIndex"
            :value="scope.$index"
            @change="handleRadioChange(scope.row)"
            >&nbsp;</el-radio
          >
        </template>
      </el-table-column>

      <el-table-column
        v-for="col in displayColumns"
        :key="col.prop"
        :label="col.label"
        :width="col.width"
        :min-width="col.minWidth"
        align="center"
      >
        <template #default="scope">
          {{ col.formatter ? col.formatter(scope.row, scope.row[col.prop]) : scope.row[col.prop] }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-if="showPagination"
      :total="total"
      v-model:page="pageNo"
      v-model:limit="pageSize"
      @pagination="loadData"
    />
    <div class="clear-both"></div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="!selectedRow" @click="handleConfirm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
defineOptions({ name: 'TableSelectDialog' })

export interface TableColumn {
  prop: string
  label: string
  width?: number | string
  minWidth?: number | string
  searchable?: boolean
  /** 自定义格式化函数 */
  formatter?: (row: any, value: any) => string
}

export interface FieldMapping {
  from: string
  to: string
}

const props = withDefaults(
  defineProps<{
    title?: string
    width?: string
    columns: TableColumn[]
    fetchApi: (params: any) => Promise<any>
    fieldMapping: FieldMapping[]
    showPagination?: boolean
    /** 是否为分页接口，如果是则从 records/total 中取数据 */
    paginated?: boolean
    /** 额外的固定查询参数，每次请求都会带上 */
    extraParams?: Record<string, any>
  }>(),
  {
    title: '选择',
    width: '800px',
    showPagination: true,
    paginated: true,
    extraParams: () => ({})
  }
)

const emit = defineEmits<{
  (e: 'select', row: any, mapping: Record<string, any>): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const tableData = ref<any[]>([])
const total = ref(0)
const pageNo = ref(1)
const pageSize = ref(10)
const selectedRow = ref<any>(null)
const selectedIndex = ref<number>(-1)
const tableRef = ref()
const searchParams = reactive<Record<string, any>>({})

/** 可搜索列 */
const searchColumns = computed(() => props.columns.filter((col) => col.searchable))

/** 展示列 */
const displayColumns = computed(() => props.columns)

/** 加载数据 */
const loadData = async () => {
  loading.value = true
  // 翻页/搜索时重置选中状态
  selectedRow.value = null
  selectedIndex.value = -1
  try {
    // 过滤掉空值参数
    const params: any = {}
    for (const key in searchParams) {
      const val = searchParams[key]
      if (val !== undefined && val !== null && val !== '') {
        params[key] = val
      }
    }
    if (props.showPagination) {
      params.pageNo = pageNo.value
      params.pageSize = pageSize.value
    }
    // 合并额外固定参数
    Object.assign(params, props.extraParams)
    const res = await props.fetchApi(params)
    if (props.paginated) {
      tableData.value = res?.records ?? []
      total.value = res?.total ?? 0
    } else {
      // 非分页接口，直接拿数组
      tableData.value = Array.isArray(res) ? res : []
      total.value = tableData.value.length
    }
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleSearch = () => {
  pageNo.value = 1
  loadData()
}

/** 重置搜索 */
const handleReset = () => {
  searchColumns.value.forEach((col) => {
    searchParams[col.prop] = undefined
  })
  handleSearch()
}

/** 行选中（点击行触发） */
const handleCurrentChange = (row: any) => {
  selectedRow.value = row
  selectedIndex.value = row ? tableData.value.indexOf(row) : -1
}

/** 单选框选中 */
const handleRadioChange = (row: any) => {
  selectedRow.value = row
  // 同步表格高亮行
  tableRef.value?.setCurrentRow(row)
}

/** 行双击选中确认 */
const handleRowDblclick = (row: any) => {
  selectedRow.value = row
  selectedIndex.value = tableData.value.indexOf(row)
  handleConfirm()
}

/** 确认选择 */
const handleConfirm = () => {
  if (!selectedRow.value) return
  const mapped: Record<string, any> = {}
  props.fieldMapping.forEach((m) => {
    mapped[m.to] = selectedRow.value[m.from]
  })
  emit('select', selectedRow.value, mapped)
  dialogVisible.value = false
}

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  selectedRow.value = null
  selectedIndex.value = -1
  // 重置搜索参数
  searchColumns.value.forEach((col) => {
    searchParams[col.prop] = undefined
  })
  pageNo.value = 1
  loadData()
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
:deep(.el-radio) {
  margin-right: 0;
}

.search-form :deep(.el-form-item) {
  margin-right: 10px;
}
</style>
