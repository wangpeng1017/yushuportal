<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="110px"
    >
      <el-form-item label="分类名称" prop="classifName">
        <el-input
          v-model="queryParams.classifName"
          class="!w-200px"
          clearable
          maxlength="50"
          placeholder="请输入分类名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-200px"
          clearable
          placeholder="请选择状态"
        >
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
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

  <!-- 列表 -->
  <ContentWrap>
    <div class="mb-10px">
      <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
      </el-button>
      <el-button
        v-hasPermi="[PERMI.DELETE]"
        :disabled="checkedIds.length === 0"
        plain
        type="danger"
        @click="handleDeleteBatch"
      >
        <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
      </el-button>
      <!-- <el-button
        v-hasPermi="[PERMI.EXPORT]"
        :loading="exportLoading"
        plain
        type="success"
        @click="handleExport"
      >
        <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
      </el-button> -->
    </div>

    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      default-expand-all
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="分类名称" align="center" prop="classifName"/>
      <el-table-column label="上级分类" align="center" prop="classifParentName" >
        <template #default="scope">
          {{ scope.row.classifParentName ?? '-' }}
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status" >
        <template #default="scope">
          <el-tag :type="getStatusTagType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center" prop="createByPersonName"  />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="修改人" align="center" prop="updateByPersonName"  />
      <el-table-column
        label="修改时间"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" >
        <template #default="scope">
          <!-- <el-button
            link
            class="btn-other"
            v-hasPermi="[PERMI.QUERY]"
            @click="openDetail(scope.row.id)"
          >
            &nbsp;查看
          </el-button> -->
          <el-button
            link
            class="btn-edit"
            v-hasPermi="[PERMI.UPDATE]"
            @click="openForm('update', scope.row.id)"
          >
            &nbsp;编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            v-hasPermi="[PERMI.DELETE]"
            @click="handleDelete(scope.row.id)"
          >
            &nbsp;删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 新增/编辑弹窗 -->
  <SparePartClassificationForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <SparePartClassificationDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as SparePartClassificationApi from '@/api/eam/sparePartClassification'
import SparePartClassificationForm from './form.vue'
import SparePartClassificationDetail from './detail.vue'
import { listToTree } from '@/utils/tree'
import download from '@/utils/download'
defineOptions({ name: 'EamSparePartClassification' })

const message = useMessage()
const { t } = useI18n()

// ==================== 权限标识集中定义 ====================
const PERMI = {
  CREATE: 'eam:sparePartClassification:create',
  UPDATE: 'eam:sparePartClassification:update',
  DELETE: 'eam:sparePartClassification:delete',
  QUERY: 'eam:sparePartClassification:query',
  EXPORT: 'eam:sparePartClassification:export'
}

// ==================== 状态枚举列表 ====================
const statusList = ref<SparePartClassificationApi.StatusOption[]>([])

const loadStatusList = async () => {
  try {
    const res = await SparePartClassificationApi.getStatusList()
    statusList.value = res ?? []
  } catch {
    statusList.value = []
  }
}

// 获取状态标签
const getStatusLabel = (value: string) => {
  const item = statusList.value.find((s) => s.value === value)
  return item?.text ?? value
}

// 获取状态标签类型
const getStatusTagType = (value: string) => {
  // 根据状态值返回不同的标签类型
  // 可以根据实际业务需求调整
  switch (value) {
    case 'ON':
      return 'success'
    case 'OFF':
      return 'info'
    default:
      return 'info'
  }
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<SparePartClassificationApi.EamSparePartClassificationDto[]>([])
const queryParams = reactive({
  classifName: undefined as string | undefined,
  status: undefined as string | undefined
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await SparePartClassificationApi.getSparePartClassificationList(queryParams)
    // 将平铺数据转换为树形结构
    list.value = listToTree(res ?? [], {
      id: 'id',
      children: 'children',
      pid: 'classifParentId'
    })
    // total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// ==================== 新增/编辑 ====================
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

// ==================== 详情 ====================
const detailRef = ref()
const openDetail = (id: string) => {
  detailRef.value.open(id)
}

// ==================== 删除 ====================
/** 单条删除 */
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    await SparePartClassificationApi.deleteSparePartClassification(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 批量删除 */
const checkedIds = ref<string[]>([])
const handleSelectionChange = (rows: SparePartClassificationApi.EamSparePartClassificationDto[]) => {
  checkedIds.value = rows.map((row) => row.id!).filter(Boolean)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await SparePartClassificationApi.batchDeleteSparePartClassification(checkedIds.value.join(','))
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 导出 ====================
const exportLoading = ref(false)
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await SparePartClassificationApi.exportSparePartClassification(queryParams)
    download.excel(data, '备件分类.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  loadStatusList()
  getList()
})
</script>

<style lang="scss" scoped>
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
