<template>
  <ContentWrap>
    <!-- 搜索栏 -->
    <el-form
v-if="searchFields && searchFields.length"
      class="-mb-15px" :model="queryParams" :inline="true" label-width="90px">
      <el-form-item v-for="f in searchFields" :key="f.prop" :label="f.label" :prop="f.prop">
        <el-input
v-model="queryParams[f.prop]" class="!w-200px" clearable
          :placeholder="`请输入${f.label}`" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <!-- 工具栏 -->
    <div class="mb-10px" v-if="enableCreate">
      <el-button type="primary" plain @click="$emit('create')">
        <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
      </el-button>
    </div>
    <!-- 列表 -->
    <el-table
v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" border
      @row-dblclick="handleRowDblClick">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column
v-for="col in columns" :key="col.prop"
        :label="col.label" :prop="col.prop" align="center"
        :width="col.width" :min-width="col.minWidth"
        :show-overflow-tooltip="true">
        <template v-if="col.formatter || col.tag" #default="{ row }">
          <el-tag v-if="col.tag" :type="col.tag(row)" size="small">{{ col.formatter ? col.formatter(row) : row[col.prop] }}</el-tag>
          <span v-else-if="col.formatter">{{ col.formatter(row) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="enableDetail || enableEdit || enableDelete || $slots.action" label="操作" align="center" :width="actionWidth || 220" fixed="right">
        <template #default="scope">
          <el-button v-if="enableDetail" link type="primary" @click="openDetail(scope.row)">
            <Icon icon="ep:view" class="mr-3px" />详情
          </el-button>
          <el-button v-if="enableEdit" link type="warning" @click="$emit('edit', scope.row)">
            <Icon icon="ep:edit" class="mr-3px" />编辑
          </el-button>
          <el-button v-if="enableDelete" link type="danger" @click="handleDelete(scope.row)">
            <Icon icon="ep:delete" class="mr-3px" />删除
          </el-button>
          <slot name="action" :row="scope.row"></slot>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
class="mt-15px"
      :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="loadList" />
  </ContentWrap>

  <!-- 详情对话框 -->
  <el-dialog v-model="detailVisible" :title="detailTitle" width="900px">
    <el-descriptions :column="2" border>
      <el-descriptions-item v-for="col in detailColumns" :key="col.prop" :label="col.label" :span="col.span || 1">
        <el-tag v-if="col.tag" :type="col.tag(detailData)" size="small">{{ (col as any).formatter ? (col as any).formatter(detailData) : (detailData[col.prop] || '--') }}</el-tag>
        <span v-else>{{ (col as any).formatter ? (col as any).formatter(detailData) : (detailData[col.prop] || '--') }}</span>
      </el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const props = defineProps<{
  apiPath: string
  columns: Array<{ prop: string; label: string; width?: string | number; minWidth?: string | number; formatter?: (row: any) => string; tag?: (row: any) => string }>
  searchFields?: Array<{ prop: string; label: string }>
  enableCreate?: boolean
  enableDetail?: boolean
  enableEdit?: boolean
  enableDelete?: boolean
  /** 删除接口路径，默认从 apiPath 推导（page → delete）*/
  deleteApi?: string
  /** 删除时确认提示中显示的字段（如 toolName）*/
  deleteNameProp?: string
  detailTitleProp?: string
  /** 操作列宽度 */
  actionWidth?: number
  /** 详情对话框额外字段定义；不传则使用 columns */
  detailExtraColumns?: Array<{ prop: string; label: string; span?: number; tag?: (row: any) => string }>
  /** 外部传入的额外查询参数（如树过滤）；变化时自动重新加载 */
  extraQuery?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'edit', row: any): void
  (e: 'deleted', row: any): void
}>()

const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const queryParams = reactive<any>({ pageNo: 1, pageSize: 10 })

const detailVisible = ref(false)
const detailData = ref<any>({})
const detailTitle = computed(() => {
  if (!detailData.value) return '详情'
  const title = props.detailTitleProp ? detailData.value[props.detailTitleProp] : ''
  return title ? `详情 - ${title}` : '详情'
})
const detailColumns = computed(() => {
  if (props.detailExtraColumns && props.detailExtraColumns.length) return props.detailExtraColumns
  return props.columns.map(c => ({ prop: c.prop, label: c.label, tag: c.tag, formatter: (c as any).formatter }))
})

async function loadList() {
  loading.value = true
  try {
    const params = { ...queryParams, ...(props.extraQuery || {}) }
    const res: any = await request.get({ url: props.apiPath, params })
    list.value = res?.records || res?.list || []
    total.value = res?.total || 0
  } catch (e) {
    console.error('Load list failed:', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 监听外部 query 变化（如树节点切换），自动重新加载
// 用 JSON.stringify 兜底，避免对象引用比较失效
watch(() => JSON.stringify(props.extraQuery || {}), () => {
  queryParams.pageNo = 1
  loadList()
})

function handleQuery() {
  queryParams.pageNo = 1
  loadList()
}

function resetQuery() {
  Object.keys(queryParams).forEach(k => {
    if (k !== 'pageNo' && k !== 'pageSize') queryParams[k] = ''
  })
  queryParams.pageNo = 1
  loadList()
}

function openDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function handleRowDblClick(row: any) {
  if (props.enableDetail) openDetail(row)
}

async function handleDelete(row: any) {
  const name = props.deleteNameProp ? row[props.deleteNameProp] : (row.code || row.id || '')
  try {
    await ElMessageBox.confirm(
      `确认删除 ${name ? `「${name}」` : '该记录'}？此操作不可恢复。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
    )
  } catch {
    return // 用户取消
  }
  try {
    const url = props.deleteApi || props.apiPath.replace('/page', '/delete')
    await request.delete({ url, params: { id: row.id } })
    ElMessage.success('删除成功')
    emit('deleted', row)
    loadList()
  } catch (e) {
    ElMessage.error('删除失败')
    console.error(e)
  }
}

onMounted(() => loadList())

defineExpose({ loadList, queryParams, openDetail })
</script>
