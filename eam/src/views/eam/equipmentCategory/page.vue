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
      <el-form-item label="设备分类名称" prop="categoryName">
        <el-input
          v-model="queryParams.categoryName"
          class="!w-240px"
          clearable
          maxlength="30"
          placeholder="请输入设备分类名称"
          @keyup.enter="handleQuery"
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
      <!-- TODO: 后端 exportXls 接口当前未实现，导出功能暂不可用 -->
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="设备分类编码" align="center" prop="categoryCode" />
      <el-table-column label="设备分类名称" align="center" prop="categoryName" />
      <el-table-column label="排序" align="center" prop="sortNo" width="100" />
      <el-table-column label="创建人" align="center" prop="createByName" width="120" />
      <el-table-column
        label="创建日期"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="更新人" align="center" prop="updateByName" width="120" />
      <el-table-column
        label="更新日期"
        align="center"
        prop="updateTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button
            link
            class="btn-other"
            v-hasPermi="[PERMI.QUERY]"
            @click="openDetail(scope.row.id)"
          >
            &nbsp;查看
          </el-button>
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

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 新增/编辑弹窗 -->
  <EquipmentCategoryForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <EquipmentCategoryDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as EquipmentCategoryApi from '@/api/eam/equipmentCategory'
import EquipmentCategoryForm from './form.vue'
import EquipmentCategoryDetail from './detail.vue'

defineOptions({ name: 'EamEquipmentCategory' })

const message = useMessage()
const { t } = useI18n()

// ==================== 权限标识集中定义 ====================
const PERMI = {
  CREATE: 'eam:equipmentCategory:create',
  UPDATE: 'eam:equipmentCategory:update',
  DELETE: 'eam:equipmentCategory:delete',
  QUERY: 'eam:equipmentCategory:query',
  EXPORT: 'eam:equipmentCategory:export'
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<EquipmentCategoryApi.EamBaseEquipmentCategoryDto[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  categoryName: undefined as string | undefined
})
const queryFormRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // request 封装层已自动解包 res.data，拿到的直接是分页对象 { records, total, size, current, pages }
    const res = await EquipmentCategoryApi.getEquipmentCategoryPage(queryParams)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
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
    await EquipmentCategoryApi.deleteEquipmentCategory(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 批量删除 */
const checkedIds = ref<string[]>([])
const handleSelectionChange = (rows: EquipmentCategoryApi.EamBaseEquipmentCategoryDto[]) => {
  checkedIds.value = rows.map((row) => row.id!).filter(Boolean)
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await EquipmentCategoryApi.batchDeleteEquipmentCategory(checkedIds.value.join(','))
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 初始化 ====================
onMounted(() => {
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
