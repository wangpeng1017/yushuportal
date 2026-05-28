<template>
  <div class="maintenance-plan-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="计划编号" prop="code">
          <el-input
            v-model="queryParams.code"
            class="!w-200px"
            clearable
            placeholder="请输入计划编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="计划名称" prop="name">
          <el-input
            v-model="queryParams.name"
            class="!w-200px"
            clearable
            placeholder="请输入计划名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择启用状态"
            clearable
            class="!w-200px"
          >
            <el-option
              v-for="item in eamEnumStore.getSupplierStatusList"
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

    <!-- ==================== 主表列表 ==================== -->
    <ContentWrap>
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
          v-hasPermi="[PERMI.STATUS]"
          plain
          type="success"
          :disabled="selectedIds.length === 0"
          @click="handleEnable"
        >
          <Icon icon="ep:check" class="mr-5px" />&nbsp;启用
        </el-button>
        <el-button
          v-hasPermi="[PERMI.STATUS]"
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
        <el-table-column label="计划编号" align="center" prop="code" width="140" />
        <el-table-column label="计划名称" align="center" prop="name" min-width="200" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
        <el-table-column label="生效时间" align="center" width="320">
          <template #default="scope">
            {{
              scope.row.planStartTime && scope.row.planEndTime
                ? scope.row.planStartTime + ' 至 ' + scope.row.planEndTime
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column label="设备总数" align="center" prop="deviceNum" width="80" />
        <el-table-column label="保养级别" align="center" prop="maintenanceLevelDesc" width="120" />
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

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <!-- ==================== 下方：子表 Tabs ==================== -->
    <ContentWrap>
      <el-tabs v-model="activeTab">
        <!-- ====== 设备列表 Tab ====== -->
        <el-tab-pane label="设备列表" name="equipment">
          <div class="item-section-toolbar">
            <el-button
              v-hasPermi="[PERMI.CREATE]"
              plain
              type="primary"
              :disabled="!currentPlan"
              @click="openDeviceSelector"
            >
              <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增设备
            </el-button>
            <el-button
              v-hasPermi="[PERMI.DELETE]"
              plain
              type="danger"
              :disabled="deviceSelectedIds.length === 0"
              @click="handleDeviceBatchDelete"
            >
              <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
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
            <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
            <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="200" />
            <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
            <el-table-column label="设备型号" align="center" prop="equipmentModel" width="120" />
            <el-table-column
              label="供应商"
              align="center"
              prop="equipmentSupplierName"
              width="200"
            />
            <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
            <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
            <el-table-column label="操作" align="center" fixed="right" width="100">
              <template #default="scope">
                <el-button
                  link
                  class="btn-delete"
                  v-hasPermi="[PERMI.DELETE]"
                  @click="handleDeviceDelete(scope.row)"
                >
                  &nbsp;删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <Pagination
            :total="deviceTotal"
            v-model:page="deviceQueryParams.pageNo"
            v-model:limit="deviceQueryParams.pageSize"
            @pagination="getDeviceList"
          />
        </el-tab-pane>

        <!-- ====== 保养项 Tab ====== -->
        <el-tab-pane label="保养项" name="item">
          <div class="item-section-toolbar">
            <el-button
              v-hasPermi="[PERMI.CREATE]"
              plain
              type="success"
              :disabled="!currentPlan"
              @click="openStandardSelector"
            >
              <Icon icon="ep:document-add" class="mr-5px" />&nbsp;选择保养标准
            </el-button>
            <el-button
              v-hasPermi="[PERMI.CREATE]"
              plain
              type="primary"
              :disabled="!currentPlan"
              @click="openItemForm('create')"
            >
              <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增保养项
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
            <el-table-column
              label="保养部位"
              align="center"
              prop="maintenancePart"
              min-width="200"
            />
            <el-table-column label="保养标准" align="center" prop="remark" min-width="200" />
            <el-table-column label="排序" align="center" prop="seq" width="80" />
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

          <Pagination
            :total="itemTotal"
            v-model:page="itemQueryParams.pageNo"
            v-model:limit="itemQueryParams.pageSize"
            @pagination="getItemList"
          />
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <!-- ==================== 弹窗 ==================== -->
    <PlanForm ref="formRef" @success="onFormSuccess" />
    <ItemForm ref="itemFormRef" @success="onItemFormSuccess" />

    <!-- 设备选择弹窗（多选） -->
    <Dialog v-model="devSelectorVisible" title="选择设备" width="900px">
      <el-form class="-mb-15px search-form" :inline="true" @submit.prevent>
        <el-form-item label="设备编码">
          <el-input
            v-model="devSelectorSearch.equipmentSn"
            placeholder="请输入设备编码"
            clearable
            class="!w-140px"
            @keyup.enter="loadDeviceSelectorData"
          />
        </el-form-item>
        <el-form-item label="设备名称">
          <el-input
            v-model="devSelectorSearch.equipmentName"
            placeholder="请输入设备名称"
            clearable
            class="!w-140px"
            @keyup.enter="loadDeviceSelectorData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadDeviceSelectorData">
            <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
          </el-button>
          <el-button @click="resetDeviceSelectorSearch">
            <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        class="mt-10px"
        :title="
          devSelectorSelected.length > 0
            ? `已选中 ${devSelectorSelected.length} 条数据`
            : '未选中任何数据'
        "
        :type="devSelectorSelected.length > 0 ? 'success' : 'info'"
        :closable="false"
        show-icon
      />

      <el-table
        ref="devSelectorTableRef"
        v-loading="devSelectorLoading"
        :data="devSelectorData"
        :stripe="true"
        :show-overflow-tooltip="true"
        class="mt-10px"
        @selection-change="handleDevSelectorSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column label="设备编码" align="center" prop="equipmentSn" width="140" />
        <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="200" />
        <el-table-column label="型号" align="center" prop="equipmentMode" width="120" />
        <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="150" />
        <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="150" />
      </el-table>

      <Pagination
        :total="devSelectorTotal"
        v-model:page="devSelectorPageNo"
        v-model:limit="devSelectorPageSize"
        @pagination="loadDeviceSelectorData"
      />
      <div class="clear-both"></div>

      <template #footer>
        <el-button @click="devSelectorVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :disabled="devSelectorSelected.length === 0"
          @click="handleDevSelectorConfirm"
        >
          确 定
        </el-button>
      </template>
    </Dialog>

    <!-- 保养标准选择弹窗（单选，复用 TableSelectDialog） -->
    <TableSelectDialog
      ref="standardSelectorRef"
      title="选择保养标准"
      width="850px"
      :columns="standardColumns"
      :fetch-api="fetchStandardWithFilter"
      :field-mapping="standardFieldMapping"
      :paginated="true"
      @select="handleStandardSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import * as PlanApi from '@/api/eam/maintenancePlan'
import { useEamEnumStore } from '@/store/modules/enums'
import PlanForm from './form.vue'
import ItemForm from './item-form.vue'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'

defineOptions({ name: 'EamMaintenancePlan' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:maintenancePlan:query',
  CREATE: 'eam:maintenancePlan:create',
  UPDATE: 'eam:maintenancePlan:update',
  DELETE: 'eam:maintenancePlan:delete',
  STATUS: 'eam:maintenancePlan:status'
}

const STATUS_ENABLED = '1'
const STATUS_DISABLED = '0'

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<PlanApi.PlanVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  code: undefined as string | undefined,
  name: undefined as string | undefined,
  status: undefined as string | undefined
})
const queryFormRef = ref()
const selectedIds = ref<string[]>([])
const selectedRows = ref<PlanApi.PlanVo[]>([])
const currentPlan = ref<PlanApi.PlanVo | null>(null)
const activeTab = ref('equipment')

const getList = async () => {
  loading.value = true
  try {
    const res = await PlanApi.getPlanPage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      code: queryParams.code,
      name: queryParams.name,
      status: queryParams.status
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
    // 刷新后更新当前选中引用
    if (currentPlan.value) {
      const found = list.value.find((r) => r.id === currentPlan.value!.id)
      if (found) {
        currentPlan.value = found
      } else {
        clearSubSections()
      }
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearSubSections()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  clearSubSections()
  handleQuery()
}

const handleSelectionChange = (rows: PlanApi.PlanVo[]) => {
  selectedIds.value = rows.map((r) => r.id)
  selectedRows.value = rows
}

const getRowClassName = ({ row }: { row: PlanApi.PlanVo }) => {
  return currentPlan.value?.id === row.id ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: PlanApi.PlanVo) => {
  if (row.id === currentPlan.value?.id) return
  currentPlan.value = row
  deviceSelectedIds.value = []
  itemSelectedIds.value = []
  deviceQueryParams.pageNo = 1
  itemQueryParams.pageNo = 1
  getDeviceList()
  getItemList()
}

// ==================== 主表 CRUD ====================
const formRef = ref()

const openForm = (mode: 'create' | 'edit' | 'view', row?: PlanApi.PlanVo) => {
  formRef.value.open(mode, row)
}

const handleDelete = async (row: PlanApi.PlanVo) => {
  try {
    await message.delConfirm()
    await PlanApi.deletePlan(row.id)
    message.success('删除成功')
    if (row.id === currentPlan.value?.id) {
      clearSubSections()
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
    await PlanApi.batchDeletePlan(selectedIds.value.join(','))
    message.success('批量删除成功')
    clearSubSections()
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
    await PlanApi.updatePlanStatus(selectedIds.value.join(','), STATUS_ENABLED)
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
    await PlanApi.updatePlanStatus(selectedIds.value.join(','), STATUS_DISABLED)
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
}

// ==================== 设备子表 ====================
const deviceLoading = ref(false)
const deviceTotal = ref(0)
const deviceList = ref<PlanApi.PlanEquipmentVo[]>([])
const deviceQueryParams = reactive({ pageNo: 1, pageSize: 5 })
const deviceSelectedIds = ref<string[]>([])

const getDeviceList = async () => {
  if (!currentPlan.value) return
  deviceLoading.value = true
  try {
    const res = await PlanApi.getEquipmentPage({
      pageNo: deviceQueryParams.pageNo,
      pageSize: deviceQueryParams.pageSize,
      planCode: currentPlan.value.code
    })
    deviceList.value = res.records ?? []
    deviceTotal.value = res.total ?? 0
  } finally {
    deviceLoading.value = false
  }
}

const handleDeviceSelectionChange = (rows: PlanApi.PlanEquipmentVo[]) => {
  deviceSelectedIds.value = rows.map((r) => r.id)
}

const handleDeviceDelete = async (row: PlanApi.PlanEquipmentVo) => {
  try {
    await message.delConfirm()
    await PlanApi.deleteEquipment(row.id)
    message.success('删除成功')
    deviceSelectedIds.value = []
    getDeviceList()
    getList() // 刷新主表 deviceNum
  } catch {
    // 用户取消
  }
}

const handleDeviceBatchDelete = async () => {
  try {
    await message.delConfirm()
    await PlanApi.batchDeleteEquipment(deviceSelectedIds.value.join(','))
    message.success('批量删除成功')
    deviceSelectedIds.value = []
    getDeviceList()
    getList() // 刷新主表 deviceNum
  } catch {
    // 用户取消
  }
}

// ==================== 设备选择器弹窗（多选） ====================
const devSelectorVisible = ref(false)
const devSelectorLoading = ref(false)
const devSelectorData = ref<any[]>([])
const devSelectorTotal = ref(0)
const devSelectorPageNo = ref(1)
const devSelectorPageSize = ref(10)
const devSelectorSearch = reactive({
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined
})
const devSelectorSelected = ref<any[]>([])
const devSelectorTableRef = ref()

const openDeviceSelector = () => {
  devSelectorVisible.value = true
  devSelectorSearch.equipmentSn = undefined
  devSelectorSearch.equipmentName = undefined
  devSelectorPageNo.value = 1
  devSelectorSelected.value = []
  loadDeviceSelectorData()
}

const loadDeviceSelectorData = async () => {
  devSelectorLoading.value = true
  devSelectorSelected.value = []
  try {
    const params: any = {
      pageNo: devSelectorPageNo.value,
      pageSize: devSelectorPageSize.value,
      planCode: currentPlan.value?.code,
      equipmentType: currentPlan.value?.equipmentTypeCode
    }
    if (devSelectorSearch.equipmentSn) params.equipmentSn = devSelectorSearch.equipmentSn
    if (devSelectorSearch.equipmentName) params.equipmentName = devSelectorSearch.equipmentName
    const res = await PlanApi.pageListByResourcesTree(params)
    devSelectorData.value = res?.records ?? []
    devSelectorTotal.value = res?.total ?? 0
  } finally {
    devSelectorLoading.value = false
  }
}

const resetDeviceSelectorSearch = () => {
  devSelectorSearch.equipmentSn = undefined
  devSelectorSearch.equipmentName = undefined
  devSelectorPageNo.value = 1
  loadDeviceSelectorData()
}

const handleDevSelectorSelectionChange = (rows: any[]) => {
  devSelectorSelected.value = rows
}

const handleDevSelectorConfirm = async () => {
  if (devSelectorSelected.value.length === 0 || !currentPlan.value) return
  // 字段映射：equipmentMode→equipmentModel, equipmentLocationCode→capacityGroupCode, equipmentLocation→capacityGroupName
  const devices: PlanApi.PlanEquipmentSaveDto[] = devSelectorSelected.value.map((row) => ({
    planCode: currentPlan.value!.code,
    equipmentSn: row.equipmentSn,
    equipmentName: row.equipmentName,
    equipmentModel: row.equipmentMode || '',
    equipmentSupplier: row.equipmentSupplier || '',
    equipmentSupplierName: row.equipmentSupplierName || '',
    equipmentType: row.equipmentType || '',
    equipmentTypeDesc: row.equipmentTypeDesc || '',
    capacityGroupCode: row.equipmentLocationCode || '',
    capacityGroupName: row.equipmentLocation || ''
  }))
  try {
    await PlanApi.addEquipments(devices)
    message.success('添加成功')
    devSelectorVisible.value = false
    getDeviceList()
    getList() // 刷新主表 deviceNum
  } catch {
    // API 异常
  }
}

// ==================== 保养标准选择器弹窗 ====================
const standardSelectorRef = ref()

const standardColumns: TableColumn[] = [
  { prop: 'code', label: '标准编号', width: 140, searchable: true },
  { prop: 'name', label: '标准名称', minWidth: 200, searchable: true },
  { prop: 'equipmentTypeDesc', label: '设备类型', width: 150 }
]

const standardFieldMapping: FieldMapping[] = [
  { from: 'code', to: 'standardCode' },
  { from: 'name', to: 'standardName' }
]

/** 带设备类型过滤的标准查询方法 */
const fetchStandardWithFilter = (params: any) => {
  return PlanApi.getStandardPage({
    ...params,
    equipmentTypeCode: currentPlan.value?.equipmentTypeCode
  })
}

const openStandardSelector = () => {
  standardSelectorRef.value?.open()
}

const handleStandardSelect = async (_row: any, mapped: Record<string, any>) => {
  if (!currentPlan.value) return
  try {
    await PlanApi.addStandard(currentPlan.value.code, mapped.standardCode)
    message.success('导入成功')
    getItemList()
    getList() // 刷新主表
  } catch {
    // API 异常
  }
}

// ==================== 保养项子表 ====================
const itemLoading = ref(false)
const itemTotal = ref(0)
const itemList = ref<PlanApi.PlanItemVo[]>([])
const itemQueryParams = reactive({ pageNo: 1, pageSize: 5 })
const itemSelectedIds = ref<string[]>([])

const getItemList = async () => {
  if (!currentPlan.value) return
  itemLoading.value = true
  try {
    const res = await PlanApi.getItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      planCode: currentPlan.value.code
    })
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

const handleItemSelectionChange = (rows: PlanApi.PlanItemVo[]) => {
  itemSelectedIds.value = rows.map((r) => r.id)
}

const itemFormRef = ref()

const openItemForm = (mode: 'create' | 'edit', row?: PlanApi.PlanItemVo) => {
  itemFormRef.value.open(mode, currentPlan.value!.code, row)
}

const handleItemDelete = async (row: PlanApi.PlanItemVo) => {
  try {
    await message.delConfirm()
    await PlanApi.deleteItem(row.id)
    message.success('删除成功')
    itemSelectedIds.value = []
    getItemList()
    getList() // 刷新主表
  } catch {
    // 用户取消
  }
}

const handleItemBatchDelete = async () => {
  try {
    await message.delConfirm()
    await PlanApi.batchDeleteItem(itemSelectedIds.value.join(','))
    message.success('批量删除成功')
    itemSelectedIds.value = []
    getItemList()
    getList() // 刷新主表
  } catch {
    // 用户取消
  }
}

const onItemFormSuccess = () => {
  getItemList()
  getList() // 刷新主表
}

// ==================== 公共方法 ====================
const clearSubSections = () => {
  currentPlan.value = null
  deviceList.value = []
  deviceTotal.value = 0
  deviceSelectedIds.value = []
  deviceQueryParams.pageNo = 1
  itemList.value = []
  itemTotal.value = 0
  itemSelectedIds.value = []
  itemQueryParams.pageNo = 1
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadMaintenancePlanEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.maintenance-plan-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.search-form :deep(.el-form-item) {
  margin-right: 10px;
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 操作列按钮样式
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
