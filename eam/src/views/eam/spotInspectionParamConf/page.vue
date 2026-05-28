<template>
  <div class="spot-inspection-param-conf-page">
    <!-- ==================== 上方：配置列表区域 ==================== -->
    <ContentWrap>
      <!-- 搜索区 -->
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="设备类型" prop="deviceTypeDesc">
          <el-input
            v-model="queryParams.deviceTypeDesc"
            class="!w-200px"
            clearable
            placeholder="请输入设备类型"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-select
            v-model="queryParams.deviceModel"
            placeholder="请选择设备型号"
            clearable
            filterable
            class="!w-200px"
          >
            <el-option
              v-for="item in eamEnumStore.getEquipmentModeList"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备厂家" prop="deviceSupName">
          <el-input
            v-model="queryParams.deviceSupName"
            class="!w-200px"
            clearable
            placeholder="请输入设备厂家"
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

    <!-- 主表列表 -->
    <ContentWrap>
      <!-- 工具栏 -->
      <div class="table-toolbar">
        <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openForm('create')">
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
        <el-button
          v-hasPermi="[PERMI.UPDATE]"
          plain
          type="success"
          :disabled="selectedIds.length === 0"
          @click="handleEnable"
        >
          <Icon icon="ep:check" class="mr-5px" />&nbsp;启用
        </el-button>
        <el-button
          v-hasPermi="[PERMI.UPDATE]"
          plain
          type="warning"
          :disabled="selectedIds.length === 0"
          @click="handleDisable"
        >
          <Icon icon="ep:close" class="mr-5px" />&nbsp;停用
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
        <el-table-column label="巡检配置编号" align="center" prop="code" width="140" />
        <el-table-column label="巡检配置名称" align="center" prop="name" min-width="200" />
        <el-table-column label="设备类型" align="center" prop="deviceTypeDesc" width="150" />
        <el-table-column label="设备型号" align="center" prop="deviceModel" width="120" />
        <el-table-column label="设备厂家" align="center" prop="deviceSupName" min-width="200" />
        <el-table-column label="启用状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getSupplierStatusType(scope.row.status)">
              {{ eamEnumStore.getSupplierStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="220">
          <template #default="scope">
            <el-button
              link
              class="btn-other"
              v-hasPermi="[PERMI.QUERY]"
              @click="openForm('view', scope.row)"
            >
              &nbsp;查看
            </el-button>
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openForm('edit', scope.row)"
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

    <!-- ==================== 下方：参数项清单区域 ==================== -->
    <ContentWrap>
      <div class="item-section-title">参数项清单</div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.CREATE]"
          plain
          type="primary"
          :disabled="!currentConf"
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
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="!currentConf"
          @click="handleClearAllItems"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;全部清除
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
        <el-table-column label="参数分组" align="center" prop="paramsGroup" width="120">
          <template #default="scope">{{ scope.row.paramsGroup || '--' }}</template>
        </el-table-column>
        <el-table-column label="参数分组描述" align="center" prop="paramsGroupDesc" width="120">
          <template #default="scope">{{ scope.row.paramsGroupDesc || '--' }}</template>
        </el-table-column>
        <el-table-column label="参数key" align="center" prop="paramsKey" width="120" />
        <el-table-column label="参数描述" align="center" prop="paramsDesc" width="150" />
        <el-table-column label="必检项" align="center" prop="needTypeText" width="80" />
        <el-table-column label="定性/定量" align="center" prop="itemType" width="100" />
        <el-table-column label="结果选项" align="center" prop="normal" min-width="300">
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
        <el-table-column label="上限值" align="center" prop="upLimit" width="80">
          <template #default="scope">{{ scope.row.upLimit || '--' }}</template>
        </el-table-column>
        <el-table-column label="下限值" align="center" prop="lowerLimit" width="80">
          <template #default="scope">{{ scope.row.lowerLimit || '--' }}</template>
        </el-table-column>
        <el-table-column label="默认值" align="center" prop="defaultValue" width="100">
          <template #default="scope">{{ scope.row.defaultValue || '--' }}</template>
        </el-table-column>
        <el-table-column label="单位" align="center" prop="paramsUnit" width="80">
          <template #default="scope">{{ scope.row.paramsUnit || '--' }}</template>
        </el-table-column>
        <el-table-column label="是否巡检项" align="center" prop="sipItem" width="100">
          <template #default="scope">
            {{ eamEnumStore.getYesNoText(scope.row.sipItem) }}
          </template>
        </el-table-column>
        <el-table-column label="是否自动巡检" align="center" prop="autoSip" width="130">
          <template #default="scope">
            {{ eamEnumStore.getYesNoText(scope.row.autoSip) }}
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sortNo" width="80" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
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
    <ParamConfForm ref="formRef" @success="onFormSuccess" />
    <ItemForm ref="itemFormRef" @success="onItemFormSuccess" />
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import * as ParamConfApi from '@/api/eam/spotInspectionParamConf'
import { useEamEnumStore } from '@/store/modules/enums'
import ParamConfForm from './form.vue'
import ItemForm from './item-form.vue'

defineOptions({ name: 'EamSpotInspectionParamConf' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:spotInspectionParamConf:query',
  CREATE: 'eam:spotInspectionParamConf:create',
  UPDATE: 'eam:spotInspectionParamConf:update',
  DELETE: 'eam:spotInspectionParamConf:delete'
}

// ==================== 启用/停用状态常量（与后端枚举对应） ====================
const STATUS_ENABLED = '1'
const STATUS_DISABLED = '0'

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<ParamConfApi.ParamConfVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  deviceTypeDesc: undefined as string | undefined,
  deviceModel: undefined as string | undefined,
  deviceSupName: undefined as string | undefined
})
const queryFormRef = ref()
const selectedIds = ref<string[]>([])
const selectedRows = ref<ParamConfApi.ParamConfVo[]>([])
const currentConf = ref<ParamConfApi.ParamConfVo | null>(null)

const getList = async () => {
  loading.value = true
  try {
    const res = await ParamConfApi.getParamConfPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      deviceTypeDesc: queryParams.deviceTypeDesc,
      deviceModel: queryParams.deviceModel,
      deviceSupName: queryParams.deviceSupName
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
    // 刷新后更新当前选中配置引用
    if (currentConf.value) {
      const found = list.value.find((r) => r.id === currentConf.value!.id)
      if (found) {
        currentConf.value = found
      } else {
        clearItemSection()
      }
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearItemSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  clearItemSection()
  handleQuery()
}

const handleSelectionChange = (rows: ParamConfApi.ParamConfVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
  selectedRows.value = rows
}

// 行样式：高亮选中行
const getRowClassName = ({ row }: { row: ParamConfApi.ParamConfVo }) => {
  return currentConf.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: ParamConfApi.ParamConfVo) => {
  if (row.id === currentConf.value?.id) {
    return
  }
  currentConf.value = row
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
  getItemList()
}

// ==================== 主表 CRUD ====================
const formRef = ref()

const openForm = (mode: 'create' | 'edit' | 'view', row?: ParamConfApi.ParamConfVo) => {
  formRef.value.open(mode, row)
}

const handleDelete = async (row: ParamConfApi.ParamConfVo) => {
  try {
    await message.delConfirm()
    await ParamConfApi.deleteParamConf(row.id)
    message.success('删除成功')
    if (row.id === currentConf.value?.id) {
      clearItemSection()
    }
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  try {
    await message.delConfirm()
    await ParamConfApi.batchDeleteParamConf(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearItemSection()
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 启用/停用 ====================
const handleEnable = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择数据')
    return
  }
  const invalid = selectedRows.value.some((r) => r.status !== STATUS_DISABLED)
  if (invalid) {
    message.warning('请只选择停用状态的数据')
    return
  }
  try {
    await ElMessageBox.confirm('确认要启用选中的数据吗？', '提示', { type: 'warning' })
    for (const row of selectedRows.value) {
      await ParamConfApi.updateParamConf({
        id: row.id,
        code: row.code,
        name: row.name,
        deviceType: row.deviceType,
        deviceTypeDesc: row.deviceTypeDesc,
        deviceSupCode: row.deviceSupCode,
        deviceSupName: row.deviceSupName,
        deviceModel: row.deviceModel,
        status: STATUS_ENABLED,
        statusDesc: eamEnumStore.getSupplierStatusText(STATUS_ENABLED)
      })
    }
    message.success('启用成功')
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleDisable = async () => {
  if (selectedRows.value.length === 0) {
    message.warning('请选择数据')
    return
  }
  const invalid = selectedRows.value.some((r) => r.status !== STATUS_ENABLED)
  if (invalid) {
    message.warning('请只选择启用状态的数据')
    return
  }
  try {
    await ElMessageBox.confirm('确认要停用选中的数据吗？', '提示', { type: 'warning' })
    for (const row of selectedRows.value) {
      await ParamConfApi.updateParamConf({
        id: row.id,
        code: row.code,
        name: row.name,
        deviceType: row.deviceType,
        deviceTypeDesc: row.deviceTypeDesc,
        deviceSupCode: row.deviceSupCode,
        deviceSupName: row.deviceSupName,
        deviceModel: row.deviceModel,
        status: STATUS_DISABLED,
        statusDesc: eamEnumStore.getSupplierStatusText(STATUS_DISABLED)
      })
    }
    message.success('停用成功')
    selectedIds.value = []
    selectedRows.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const onFormSuccess = () => {
  getList()
  if (currentConf.value) {
    getItemList()
  }
}

// ==================== 子表：参数项清单 ====================
const itemLoading = ref(false)
const itemTotal = ref(0)
const itemList = ref<ParamConfApi.ParamItemVo[]>([])
const itemQueryParams = reactive({
  pageNo: 1,
  pageSize: 5
})
const itemSelectedIds = ref<string[]>([])

const getItemList = async () => {
  if (!currentConf.value) {
    return
  }
  itemLoading.value = true
  try {
    const res = await ParamConfApi.getParamItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      confId: currentConf.value.id
    })
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

const handleItemSelectionChange = (rows: ParamConfApi.ParamItemVo[]) => {
  itemSelectedIds.value = rows.map((r) => r.id)
}

const clearItemSection = () => {
  currentConf.value = null
  itemList.value = []
  itemTotal.value = 0
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
}

// ==================== 参数项 CRUD ====================
const itemFormRef = ref()

const openItemForm = (mode: 'create' | 'edit', row?: ParamConfApi.ParamItemVo) => {
  itemFormRef.value.open(mode, currentConf.value!, row)
}

const handleItemDelete = async (row: ParamConfApi.ParamItemVo) => {
  try {
    await message.delConfirm()
    await ParamConfApi.deleteParamItem(row.id)
    message.success('删除成功')
    itemSelectedIds.value = []
    getItemList()
  } catch {
    // 用户取消
  }
}

const handleItemBatchDelete = async () => {
  try {
    await message.delConfirm()
    await ParamConfApi.batchDeleteParamItem(itemSelectedIds.value.join(','))
    message.success('批量删除成功')
    itemSelectedIds.value = []
    getItemList()
  } catch {
    // 用户取消
  }
}

const handleClearAllItems = async () => {
  if (!currentConf.value) return
  try {
    await ElMessageBox.confirm('确认要清除当前配置下的所有参数项吗？', '提示', {
      type: 'warning'
    })
    await ParamConfApi.deleteAllParamItems(currentConf.value.id)
    message.success('全部清除成功')
    itemSelectedIds.value = []
    getItemList()
  } catch {
    // 用户取消
  }
}

const onItemFormSuccess = () => {
  getItemList()
}

// ==================== 工具方法 ====================
const splitTags = (str: string): string[] => {
  if (!str) return []
  return str.split(',').filter((s) => s.trim())
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadParamConfEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.spot-inspection-param-conf-page {
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
