<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1100px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="130px"
      :disabled="mode === 'view'"
    >
      <!-- ==================== 基础信息 ==================== -->
      <div class="section-title">基础信息</div>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备编号" prop="equipmentSn">
            <div class="selector-wrap">
              <el-input
                v-model="formData.equipmentSn"
                readonly
                placeholder="请选择设备"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.equipmentSn && mode === 'create'"
                    class="clear-icon"
                    @click.stop="clearEquipment"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button v-if="mode === 'create'" type="primary" @click="openEquipmentSelector">
                选择
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型">
            <el-input v-model="formData.equipmentTypeDesc" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备型号">
            <el-input v-model="formData.equipmentModel" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商">
            <el-input v-model="formData.equipmentSupplierName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养级别" prop="maintenanceLevel">
            <el-select
              v-model="formData.maintenanceLevel"
              placeholder="请选择保养级别"
              clearable
              :disabled="mode === 'edit' && ['2', '3'].includes(formData.status)"
              class="w-full"
              @change="handleMaintenanceLevelChange"
            >
              <el-option
                v-for="item in eamEnumStore.getMaintenanceLevelList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="计划开始时间" prop="workStartTime">
            <el-date-picker
              v-model="formData.workStartTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择计划保养开始时间"
              :disabled="mode === 'edit' && ['2', '3'].includes(formData.status)"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束时间" prop="overdueTime">
            <el-date-picker
              v-model="formData.overdueTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择计划保养结束时间"
              :disabled="mode === 'edit' && ['2', '3'].includes(formData.status)"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养人" prop="personName">
            <div class="selector-wrap">
              <el-input
                v-model="formData.personName"
                readonly
                placeholder="请选择保养人"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.personName && mode !== 'view'"
                    class="clear-icon"
                    @click.stop="clearPerson"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button v-if="mode !== 'view'" type="primary" @click="openPersonSelector">
                选择
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ==================== 处理情况（新增时隐藏） ==================== -->
      <template v-if="mode !== 'create'">
        <div class="section-title">处理情况</div>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="保养状态" prop="status">
              <el-select v-model="formData.status" disabled class="w-full">
                <el-option
                  v-for="item in eamEnumStore.getMaintenanceWorkStatusList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="保养开始时间">
              <el-date-picker
                v-model="formData.startTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择保养开始时间"
                disabled
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保养结束时间">
              <el-date-picker
                v-model="formData.endTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择保养结束时间"
                disabled
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保养用时">
              <div class="use-time-wrap">
                <el-input-number
                  v-model="useTimeHours"
                  :min="0"
                  :precision="0"
                  controls-position="right"
                  disabled
                  class="use-time-input"
                />
                <span class="use-time-unit">小时</span>
                <el-input-number
                  v-model="useTimeMinutes"
                  :min="0"
                  :max="59"
                  :precision="0"
                  controls-position="right"
                  disabled
                  class="use-time-input"
                />
                <span class="use-time-unit">分</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="描述" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              maxlength="120"
              show-word-limit
              placeholder="请输入描述"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- ==================== 内联保养项子表 ==================== -->
    <div class="item-section">
      <div class="item-section-header">
        <span>保养项</span>
        <div v-if="canEditItems" class="item-section-toolbar">
          <el-button plain type="success" size="small" @click="openStandardSelector">
            <Icon icon="ep:document-add" class="mr-5px" />&nbsp;选择保养标准
          </el-button>
          <el-button plain type="primary" size="small" @click="openItemForm('create')">
            <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增保养项
          </el-button>
          <el-button
            plain
            type="danger"
            size="small"
            :disabled="itemSelectedKeys.length === 0"
            @click="handleItemBatchDelete"
          >
            <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
          </el-button>
        </div>
      </div>

      <el-table
        :data="localItemList"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handleItemSelectionChange"
      >
        <el-table-column v-if="canEditItems" type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养部位" align="center" prop="maintenancePart" min-width="200" />
        <el-table-column label="保养标准" align="center" prop="remark" min-width="200" />
        <el-table-column label="是否已保养" align="center" prop="status" width="120">
          <template #default="scope">
            <el-switch
              v-if="mode === 'edit' && ['2', '3'].includes(formData.status)"
              v-model="scope.row.status"
              active-value="1"
              inactive-value="0"
              active-text="已保养"
              inactive-text="未保养"
              inline-prompt
            />
            <el-tag
              v-else-if="scope.row.status != null && scope.row.status !== ''"
              :type="scope.row.status === '1' ? 'success' : 'info'"
            >
              {{ scope.row.status === '1' ? '已保养' : '未保养' }}
            </el-tag>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="seq" width="80" />
        <el-table-column v-if="canEditItems" label="操作" align="center" fixed="right" width="140">
          <template #default="scope">
            <el-button link class="btn-edit" @click="openItemForm('edit', scope.$index)">
              &nbsp;编辑
            </el-button>
            <el-button link class="btn-delete" @click="handleItemDelete(scope.$index)">
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
      <el-button
        v-if="mode !== 'view'"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </template>

    <!-- ==================== 设备选择弹窗 ==================== -->
    <TableSelectDialog
      ref="equipmentSelectorRef"
      title="选择设备"
      width="900px"
      :columns="equipmentColumns"
      :fetch-api="WorkOrderApi.getEquipmentPageNew"
      :field-mapping="equipmentFieldMapping"
      :paginated="true"
      @select="handleEquipmentSelect"
    />

    <!-- ==================== 保养标准选择弹窗 ==================== -->
    <TableSelectDialog
      ref="standardSelectorRef"
      title="选择保养标准"
      width="850px"
      :columns="standardColumns"
      :fetch-api="WorkOrderApi.getMaintenanceStandardPage"
      :field-mapping="standardFieldMapping"
      :extra-params="standardExtraParams"
      :paginated="true"
      @select="handleStandardSelect"
    />

    <!-- ==================== 人员选择弹窗 ==================== -->
    <PersonSelectDialog ref="personDialogRef" @confirm="handlePersonConfirm" />

    <!-- ==================== 保养项编辑弹窗 ==================== -->
    <ItemForm ref="itemFormRef" @success="onItemFormSuccess" />
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import * as WorkOrderApi from '@/api/eam/maintenanceWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'
import ItemForm from './item-form.vue'

defineOptions({ name: 'MaintenanceWorkOrderForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit' | 'view'>('create')
const formRef = ref()

const dialogTitle = computed(() => {
  const map = { create: '新增-保养工单', edit: '编辑-保养工单', view: '查看-保养工单' }
  return map[mode.value]
})

// ==================== 表单数据 ====================
const formData = reactive({
  id: undefined as string | undefined,
  code: '',
  equipmentSn: '',
  equipmentName: '',
  equipmentTypeCode: '',
  equipmentTypeDesc: '',
  equipmentModel: '',
  equipmentSupplier: '',
  equipmentSupplierName: '',
  maintenanceLevel: '' as string | undefined,
  maintenanceLevelDesc: '' as string | undefined,
  workStartTime: '' as string | undefined,
  overdueTime: '' as string | undefined,
  planCode: '',
  planName: '',
  personSn: '',
  personName: '',
  status: '1',
  startTime: '' as string | undefined,
  endTime: '' as string | undefined,
  useTime: undefined as number | undefined,
  remark: ''
})

/** 保养用时拆分为小时和分钟（只读展示） */
const useTimeHours = computed(() => {
  if (formData.useTime == null) return 0
  return Math.floor(formData.useTime / 60)
})
const useTimeMinutes = computed(() => {
  if (formData.useTime == null) return 0
  return formData.useTime % 60
})

const formRules = {
  equipmentSn: [{ required: true, message: '请选择设备', trigger: 'change' }],
  workStartTime: [{ required: true, message: '请选择计划保养开始时间', trigger: 'change' }],
  overdueTime: [{ required: true, message: '请选择计划保养结束时间', trigger: 'change' }]
}

/** 是否允许增删改保养项（新增和编辑status=1时可以，status=2/3只能勾选） */
const canEditItems = computed(() => {
  if (mode.value === 'view') return false
  if (mode.value === 'create') return true
  // edit 模式：只有 status=1 时允许增删改
  return formData.status === '1'
})

// ==================== 本地保养项数组 ====================
const localItemList = ref<WorkOrderApi.WorkOrderItemLocal[]>([])
const itemSelectedKeys = ref<string[]>([])

const handleItemSelectionChange = (rows: WorkOrderApi.WorkOrderItemLocal[]) => {
  itemSelectedKeys.value = rows.map((r) => r._tempId || r.id || '')
}

// ==================== 设备选择器 ====================
const equipmentSelectorRef = ref()

const equipmentColumns: TableColumn[] = [
  { prop: 'equipmentSn', label: '设备编号', width: 140, searchable: true },
  { prop: 'equipmentName', label: '设备名称', minWidth: 180, searchable: true },
  { prop: 'equipmentTypeDesc', label: '设备类型', width: 120 },
  { prop: 'equipmentMode', label: '设备型号', width: 120 },
  { prop: 'equipmentSupplierName', label: '供应商', width: 150 }
]

const equipmentFieldMapping: FieldMapping[] = [
  { from: 'equipmentSn', to: 'equipmentSn' },
  { from: 'equipmentName', to: 'equipmentName' }
]

const openEquipmentSelector = () => {
  equipmentSelectorRef.value?.open()
}

const handleEquipmentSelect = (row: any, _mapped: Record<string, any>) => {
  formData.equipmentSn = row.equipmentSn || ''
  formData.equipmentName = row.equipmentName || ''
  formData.equipmentTypeCode = row.equipmentType || ''
  formData.equipmentTypeDesc = row.equipmentTypeDesc || ''
  // 字段映射：equipmentMode -> equipmentModel
  formData.equipmentModel = row.equipmentMode || ''
  formData.equipmentSupplier = row.equipmentSupplier || ''
  formData.equipmentSupplierName = row.equipmentSupplierName || ''
}

const clearEquipment = () => {
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentTypeCode = ''
  formData.equipmentTypeDesc = ''
  formData.equipmentModel = ''
  formData.equipmentSupplier = ''
  formData.equipmentSupplierName = ''
}

// ==================== 保养标准选择器 ====================
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

/** 保养标准弹窗的额外固定参数（带入已选设备的 equipmentTypeCode） */
const standardExtraParams = computed(() => {
  const params: Record<string, any> = {}
  if (formData.equipmentTypeCode) {
    params.equipmentTypeCode = formData.equipmentTypeCode
  }
  return params
})

const openStandardSelector = () => {
  if (!formData.equipmentSn) {
    message.warning('请先选择设备')
    return
  }
  standardSelectorRef.value?.open()
}

const handleStandardSelect = async (_row: any, mapped: Record<string, any>) => {
  try {
    const res = await WorkOrderApi.getStandardItemList({
      maintenanceStandardCode: mapped.standardCode,
      pageNo: 1,
      pageSize: 1000
    })
    const items = res?.records ?? []
    if (items.length === 0) {
      message.warning('该保养标准下没有保养项')
      return
    }
    items.forEach((item: any) => {
      localItemList.value.push({
        _tempId: 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
        maintenancePart: item.maintenancePart || '',
        remark: item.remark || '',
        seq: item.seq || localItemList.value.length + 1
      })
    })
    message.success(`已导入 ${items.length} 条保养项`)
  } catch {
    // API 异常
  }
}

// ==================== 人员选择器 ====================
const personDialogRef = ref()

const openPersonSelector = () => {
  personDialogRef.value?.open()
}

const handlePersonConfirm = (user: { id: number; nickname: string; username: string }) => {
  formData.personSn = String(user.id)
  formData.personName = user.nickname
}

const clearPerson = () => {
  formData.personSn = ''
  formData.personName = ''
}

// ==================== 保养级别变更 ====================
const handleMaintenanceLevelChange = (val: string) => {
  const item = eamEnumStore.getMaintenanceLevelList.find((e) => e.value === val)
  formData.maintenanceLevelDesc = item?.text || ''
}

// ==================== 保养项子表操作 ====================
const itemFormRef = ref()
const editingItemIndex = ref(-1)

const openItemForm = (itemMode: 'create' | 'edit', index?: number) => {
  if (itemMode === 'edit' && index !== undefined) {
    editingItemIndex.value = index
    itemFormRef.value.open('edit', localItemList.value[index])
  } else {
    editingItemIndex.value = -1
    itemFormRef.value.open('create')
  }
}

const onItemFormSuccess = (item: WorkOrderApi.WorkOrderItemLocal) => {
  if (editingItemIndex.value >= 0) {
    // 编辑：原地更新
    const existing = localItemList.value[editingItemIndex.value]
    existing.maintenancePart = item.maintenancePart
    existing.remark = item.remark
    existing.seq = item.seq
  } else {
    // 新增：追加
    localItemList.value.push({
      ...item,
      _tempId: 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9)
    })
  }
}

const handleItemDelete = (index: number) => {
  localItemList.value.splice(index, 1)
}

const handleItemBatchDelete = () => {
  localItemList.value = localItemList.value.filter(
    (item) => !itemSelectedKeys.value.includes(item._tempId || item.id || '')
  )
  itemSelectedKeys.value = []
}

// ==================== 弹窗控制 ====================
const open = async (m: 'create' | 'edit' | 'view', row?: WorkOrderApi.WorkOrderVo) => {
  mode.value = m
  dialogVisible.value = true
  localItemList.value = []
  itemSelectedKeys.value = []
  editingItemIndex.value = -1

  await nextTick()
  formRef.value?.clearValidate()

  if (m === 'create') {
    resetFormData()
  } else if (row) {
    // 编辑或查看：加载详情
    try {
      const detail = await WorkOrderApi.getWorkOrderById(row.id)
      fillFormData(detail)
    } catch {
      fillFormData(row)
    }
    // 加载保养项
    await loadItems(row.code)
  }
}

const resetFormData = () => {
  formData.id = undefined
  formData.code = ''
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentTypeCode = ''
  formData.equipmentTypeDesc = ''
  formData.equipmentModel = ''
  formData.equipmentSupplier = ''
  formData.equipmentSupplierName = ''
  formData.maintenanceLevel = undefined
  formData.maintenanceLevelDesc = undefined
  formData.workStartTime = undefined
  formData.overdueTime = undefined
  formData.planCode = ''
  formData.planName = ''
  formData.personSn = ''
  formData.personName = ''
  formData.status = '1'
  formData.startTime = undefined
  formData.endTime = undefined
  formData.useTime = undefined
  formData.remark = ''
}

const fillFormData = (row: any) => {
  formData.id = row.id
  formData.code = row.code || ''
  formData.equipmentSn = row.equipmentSn || ''
  formData.equipmentName = row.equipmentName || ''
  formData.equipmentTypeCode = row.equipmentTypeCode || ''
  formData.equipmentTypeDesc = row.equipmentTypeDesc || ''
  formData.equipmentModel = row.equipmentModel || ''
  formData.equipmentSupplier = row.equipmentSupplier || ''
  formData.equipmentSupplierName = row.equipmentSupplierName || ''
  formData.maintenanceLevel = row.maintenanceLevel || undefined
  formData.maintenanceLevelDesc = row.maintenanceLevelDesc || undefined
  formData.workStartTime = row.workStartTime || undefined
  formData.overdueTime = row.overdueTime || undefined
  formData.planCode = row.planCode || ''
  formData.planName = row.planName || ''
  formData.personSn = row.personSn || ''
  formData.personName = row.personName || ''
  formData.status = row.status || '1'
  formData.startTime = row.startTime || undefined
  formData.endTime = row.endTime || undefined
  formData.useTime = row.useTime ?? undefined
  formData.remark = row.remark || ''
}

const loadItems = async (workCode: string) => {
  try {
    const res = await WorkOrderApi.getWorkOrderItemPage({
      pageNo: 1,
      pageSize: 1000,
      workCode
    })
    const items = res?.records ?? []
    localItemList.value = items.map((item: WorkOrderApi.WorkOrderItemVo) => ({
      id: item.id,
      _tempId: 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      maintenancePart: item.maintenancePart || '',
      remark: item.remark || '',
      seq: item.seq,
      status: item.status,
      dealRemark: item.dealRemark
    }))
  } catch {
    localItemList.value = []
  }
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 构建 itemList（清除 id，后端先删后插全量替换）
  const itemList: WorkOrderApi.WorkOrderItemLocal[] = localItemList.value.map((item) => ({
    maintenancePart: item.maintenancePart,
    remark: item.remark,
    seq: item.seq,
    status: item.status
  }))

  submitLoading.value = true
  try {
    if (mode.value === 'edit') {
      const data: WorkOrderApi.WorkOrderUpdateDto = {
        id: formData.id!,
        code: formData.code,
        equipmentSn: formData.equipmentSn,
        equipmentName: formData.equipmentName,
        equipmentTypeCode: formData.equipmentTypeCode,
        equipmentTypeDesc: formData.equipmentTypeDesc,
        equipmentModel: formData.equipmentModel,
        equipmentSupplier: formData.equipmentSupplier,
        equipmentSupplierName: formData.equipmentSupplierName,
        maintenanceLevel: formData.maintenanceLevel,
        maintenanceLevelDesc: formData.maintenanceLevelDesc,
        workStartTime: formData.workStartTime,
        overdueTime: formData.overdueTime,
        planCode: formData.planCode,
        planName: formData.planName,
        personSn: formData.personSn,
        personName: formData.personName,
        status: formData.status,
        remark: formData.remark,
        itemList
      }
      await WorkOrderApi.saveMaintenanceWorkOrder(data)
      message.success('编辑成功')
    } else {
      const data: WorkOrderApi.WorkOrderSaveDto = {
        equipmentSn: formData.equipmentSn,
        equipmentName: formData.equipmentName,
        equipmentTypeCode: formData.equipmentTypeCode,
        equipmentTypeDesc: formData.equipmentTypeDesc,
        equipmentModel: formData.equipmentModel,
        equipmentSupplier: formData.equipmentSupplier,
        equipmentSupplierName: formData.equipmentSupplierName,
        maintenanceLevel: formData.maintenanceLevel,
        maintenanceLevelDesc: formData.maintenanceLevelDesc,
        workStartTime: formData.workStartTime,
        overdueTime: formData.overdueTime,
        planCode: formData.planCode,
        planName: formData.planName,
        personSn: formData.personSn,
        personName: formData.personName,
        status: formData.status,
        remark: formData.remark,
        itemList
      }
      await WorkOrderApi.createWorkOrder(data)
      message.success('新增成功')
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.w-full {
  width: 100%;
}

.section-title {
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.selector-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}

.selector-input {
  flex: 1;
}

.clear-icon {
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}

.use-time-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.use-time-input {
  flex: 1;
}

.use-time-unit {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.item-section {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.item-section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
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
</style>
