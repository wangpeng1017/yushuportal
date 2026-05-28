<template>
  <div class="spot-inspection-standard-page">
    <!-- ==================== 上方：标准列表区域 ==================== -->
    <ContentWrap>
      <!-- 搜索区 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="标准编号" prop="code">
          <el-input
            v-model="queryParams.code"
            class="!w-200px"
            clearable
            placeholder="请输入标准编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="标准名称" prop="name">
          <el-input
            v-model="queryParams.name"
            class="!w-200px"
            clearable
            placeholder="请输入标准名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="equipmentTypeCode">
          <el-select
            v-model="queryParams.equipmentTypeCode"
            placeholder="请选择设备类型"
            clearable
            filterable
            class="!w-200px"
          >
            <el-option
              v-for="item in equipmentTypeOptions"
              :key="item.typeCode"
              :label="item.typeName"
              :value="item.typeCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="inspectionType">
          <el-select v-model="queryParams.inspectionType" placeholder="全部" clearable class="!w-120px">
            <el-option label="点检" value="1" />
            <el-option label="巡检" value="2" />
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

    <!-- 主表列表 -->
    <ContentWrap>
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openStandardForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
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
        <el-table-column label="标准编号" align="center" prop="code" width="140" />
        <el-table-column label="类型" align="center" prop="inspectionType" width="80">
          <template #default="scope">
            <el-tag :type="scope.row.inspectionType === '2' ? 'warning' : ''">
              {{ scope.row.inspectionType === '2' ? '巡检' : '点检' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="标准名称" align="center" prop="name" min-width="200" />
        <el-table-column
          label="设备类型"
          align="center"
          prop="equipmentTypeText"
          width="150"
        />
        <el-table-column label="备注" align="center" prop="remark" min-width="200" />
        <el-table-column label="检查项数" align="center" prop="checknum" width="100" />
        <el-table-column
          label="创建人"
          align="center"
          prop="createByPersonName"
          width="100"
        />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template #default="scope">
            <el-button
              link
              class="btn-other"
              v-hasPermi="[PERMI.QUERY]"
              @click="openStandardForm('view', scope.row)"
            >
              &nbsp;查看
            </el-button>
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openStandardForm('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handleDelete(scope.row)"
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

    <!-- ==================== 下方：检查项清单区域 ==================== -->
    <ContentWrap>
      <div class="item-section-title">检查项清单</div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.CREATE]"
          plain
          type="primary"
          :disabled="!currentStandardCode"
          @click="openItemForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="itemSelectedIds.length === 0"
          @click="handleItemBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
        </el-button>
      </div>

      <el-table
        v-loading="itemLoading"
        :data="itemList"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleItemSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="检查项" align="center" prop="itemName" width="150" />
        <el-table-column label="范围类型" align="center" prop="itemType" width="100" />
        <el-table-column label="必检项" align="center" prop="needTypeText" width="80" />
        <el-table-column label="结果选项" align="center" prop="normal" min-width="220">
          <template #default="scope">
            <div v-if="scope.row.itemType === '定性'" class="tag-cell">
              <div class="tag-row">
                <el-tag
                  v-for="(tag, idx) in splitTags(scope.row.normal)"
                  :key="'n' + idx"
                  type="success"
                  size="small"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <div class="tag-row" v-if="scope.row.abnormal">
                <el-tag
                  v-for="(tag, idx) in splitTags(scope.row.abnormal)"
                  :key="'a' + idx"
                  type="danger"
                  size="small"
                  class="tag-item"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="上限" align="center" prop="max" width="80">
          <template #default="scope">{{ scope.row.max || '--' }}</template>
        </el-table-column>
        <el-table-column label="下限" align="center" prop="min" width="80">
          <template #default="scope">{{ scope.row.min || '--' }}</template>
        </el-table-column>
        <el-table-column label="默认值" align="center" prop="defaultValue" width="100">
          <template #default="scope">{{ scope.row.defaultValue || '--' }}</template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="unitName" width="80">
          <template #default="scope">{{ scope.row.unitName || '--' }}</template>
        </el-table-column>
        <el-table-column
          label="检查标准"
          align="center"
          prop="checkStandard"
          min-width="200"
        />
        <el-table-column label="排序" align="center" prop="sort" width="60" />
        <el-table-column
          label="创建人"
          align="center"
          prop="createByPersonName"
          width="100"
        />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="140">
          <template #default="scope">
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openItemForm('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handleItemDelete(scope.row)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 子表分页 -->
      <Pagination
        :total="itemTotal"
        v-model:page="itemQueryParams.pageNo"
        v-model:limit="itemQueryParams.pageSize"
        @pagination="getItemList"
      />
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <StandardForm ref="standardFormRef" @success="onStandardFormSuccess" />
    <ItemForm ref="itemFormRef" @success="onItemFormSuccess" />
  </div>
</template>

<script lang="ts" setup>
import * as StandardApi from '@/api/eam/spotInspectionStandard'
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'
import StandardForm from './form.vue'
import ItemForm from './item-form.vue'

defineOptions({ name: 'EamSpotInspectionStandard' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:spotInspectionStandard:query',
  CREATE: 'eam:spotInspectionStandard:create',
  UPDATE: 'eam:spotInspectionStandard:update',
  DELETE: 'eam:spotInspectionStandard:delete'
}

// ==================== 设备类型下拉选项 ====================
interface EquipmentTypeOption {
  typeCode: string
  typeName: string
}
const equipmentTypeOptions = ref<EquipmentTypeOption[]>([])
const loadEquipmentTypeOptions = async () => {
  try {
    const res = await EquipmentApi.getEquipmentTypeAllList()
    equipmentTypeOptions.value = res || []
  } catch (error) {
    console.error('加载设备类型列表失败:', error)
  }
}

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<StandardApi.StandardVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  code: undefined as string | undefined,
  name: undefined as string | undefined,
  equipmentTypeCode: undefined as string | undefined,
  inspectionType: undefined as string | undefined
})
const queryFormRef = ref()
const selectedIds = ref<string[]>([])
const currentStandardCode = ref('')
const currentStandardName = ref('')

const getList = async () => {
  loading.value = true
  try {
    const res = await StandardApi.getStandardPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
      name: queryParams.name,
      equipmentTypeCode: queryParams.equipmentTypeCode
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  // 搜索时清空子表
  clearItemSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  // 重置时清空子表
  clearItemSection()
  handleQuery()
}

const handleSelectionChange = (rows: StandardApi.StandardVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
}

// 行样式：高亮选中行
const getRowClassName = ({ row }: { row: StandardApi.StandardVo }) => {
  return currentStandardCode.value === row.code ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: StandardApi.StandardVo) => {
  if (row.code === currentStandardCode.value) {
    return
  }
  currentStandardCode.value = row.code
  currentStandardName.value = row.name
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
  getItemList()
}

// ==================== 主表 CRUD ====================
const standardFormRef = ref()

const openStandardForm = (mode: 'create' | 'edit' | 'view', row?: StandardApi.StandardVo) => {
  standardFormRef.value.open(mode, row)
}

const handleDelete = async (row: StandardApi.StandardVo) => {
  try {
    await message.delConfirm()
    await StandardApi.deleteStandard(row.id)
    message.success('删除成功')
    // 如果删除的是当前选中标准，清空子表
    if (row.code === currentStandardCode.value) {
      clearItemSection()
    }
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  try {
    await message.delConfirm()
    await StandardApi.batchDeleteStandard(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearItemSection()
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const onStandardFormSuccess = () => {
  getList()
}

// ==================== 子表：检查项清单 ====================
const itemLoading = ref(false)
const itemTotal = ref(0)
const itemList = ref<StandardApi.StandardItemVo[]>([])
const itemQueryParams = reactive({
  pageNo: 1,
  pageSize: 5
})
const itemSelectedIds = ref<string[]>([])

const getItemList = async () => {
  if (!currentStandardCode.value) {
    return
  }
  itemLoading.value = true
  try {
    const res = await StandardApi.getStandardItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      standardCode: currentStandardCode.value,
      column: 'sort',
      order: 'asc'
    })
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

const handleItemSelectionChange = (rows: StandardApi.StandardItemVo[]) => {
  itemSelectedIds.value = rows.map((r) => r.id)
}

const clearItemSection = () => {
  currentStandardCode.value = ''
  currentStandardName.value = ''
  itemList.value = []
  itemTotal.value = 0
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
}

// ==================== 检查项 CRUD ====================
const itemFormRef = ref()

const openItemForm = (mode: 'create' | 'edit', row?: StandardApi.StandardItemVo) => {
  itemFormRef.value.open(mode, currentStandardCode.value, row)
}

const handleItemDelete = async (row: StandardApi.StandardItemVo) => {
  try {
    await message.delConfirm()
    await StandardApi.deleteStandardItem(row.id)
    message.success('删除成功')
    itemSelectedIds.value = []
    getItemList()
    // 刷新主表以更新 checknum
    getList()
  } catch {
    // 用户取消
  }
}

const handleItemBatchDelete = async () => {
  try {
    await message.delConfirm()
    await StandardApi.batchDeleteStandardItem(itemSelectedIds.value.join(','))
    message.success('批量删除成功')
    itemSelectedIds.value = []
    getItemList()
    getList()
  } catch {
    // 用户取消
  }
}

const onItemFormSuccess = () => {
  getItemList()
  // 刷新主表以更新 checknum
  getList()
}

// ==================== 工具方法 ====================
const splitTags = (str: string): string[] => {
  if (!str) return []
  return str.split(',').filter((s) => s.trim())
}

// ==================== 初始化 ====================
onMounted(async () => {
  await Promise.all([eamEnumStore.loadSpotInspectionEnums(), loadEquipmentTypeOptions()])
  await getList()
})
</script>

<style lang="scss" scoped>
.spot-inspection-standard-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.tag-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: center;
}

.tag-item {
  margin: 0;
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式（与其他模块保持一致）
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
