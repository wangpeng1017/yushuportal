<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
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
                    v-if="formData.equipmentSn"
                    class="clear-icon"
                    @click.stop="clearEquipment"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="openEquipmentSelector"> 选择 </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型">
            <el-input v-model="formData.equipmentTypeName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号">
            <el-input v-model="formData.equipmentMode" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="故障时间" prop="breakdownTime">
            <el-date-picker
              v-model="formData.breakdownTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:00"
              placeholder="请选择故障时间"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="报修人" prop="personName">
            <div class="selector-wrap">
              <el-input
                v-model="formData.personName"
                readonly
                placeholder="请选择报修人"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon v-if="formData.personName" class="clear-icon" @click.stop="clearPerson">
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button type="primary" @click="openPersonSelector"> 选择 </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="故障等级" prop="breakdownLevel">
            <el-select
              v-model="formData.breakdownLevel"
              placeholder="请选择故障等级"
              clearable
              class="w-full"
              @change="handleBreakdownLevelChange"
            >
              <el-option
                v-for="item in eamEnumStore.getFailureWorkOrderBreakdownLevelList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="故障类别" prop="breakdownType">
            <el-select
              v-model="formData.breakdownType"
              placeholder="请选择故障类别"
              clearable
              class="w-full"
              @change="handleBreakdownTypeChange"
            >
              <el-option
                v-for="item in eamEnumStore.getFailureWorkOrderBreakdownTypeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急程度" prop="repairDegree">
            <el-select
              v-model="formData.repairDegree"
              placeholder="请选择紧急程度"
              clearable
              class="w-full"
              @change="handleRepairDegreeChange"
            >
              <el-option
                v-for="item in eamEnumStore.getRepairDegreeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="故障描述" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="4"
              :maxlength="120"
              show-word-limit
              placeholder="请输入故障描述"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="图片">
            <el-tooltip content="最多上传9张图片，仅支持 jpg、png、gif 格式" placement="top">
              <UploadImgs v-model="formData.attachmentUrls" :limit="9" :drag="false" />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit"> 确 定 </el-button>
    </template>

    <!-- ==================== 设备选择弹窗 ==================== -->
    <TableSelectDialog
      ref="equipmentSelectorRef"
      title="选择设备"
      width="900px"
      :columns="equipmentColumns"
      :fetch-api="FailureWorkOrderApi.getEquipmentPageNew"
      :field-mapping="equipmentFieldMapping"
      :paginated="true"
      @select="handleEquipmentSelect"
    />

    <!-- ==================== 人员选择弹窗 ==================== -->
    <PersonSelectDialog ref="personDialogRef" @confirm="handlePersonConfirm" />
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import * as FailureWorkOrderApi from '@/api/eam/failureWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'FailureWorkOrderForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()

const dialogTitle = computed(() => {
  return mode.value === 'create' ? '新增报修工单' : '编辑报修工单'
})

// ==================== 表单数据 ====================
const formData = reactive({
  id: undefined as string | undefined,
  failureCode: '',
  status: '',
  equipmentSn: '',
  equipmentName: '',
  equipmentType: '',
  equipmentTypeName: '',
  equipmentMode: '',
  breakdownTime: '',
  personSn: '',
  personName: '',
  breakdownLevel: undefined as string | undefined,
  breakdownLevelText: '',
  breakdownType: undefined as string | undefined,
  breakdownTypeText: '',
  repairDegree: undefined as string | undefined,
  repairDegreeText: '',
  remark: '',
  attachmentUrls: [] as string[]
})

const formRules = {
  equipmentSn: [{ required: true, message: '请选择设备', trigger: 'change' }],
  breakdownTime: [{ required: true, message: '请选择故障时间', trigger: 'change' }],
  personName: [{ required: true, message: '请选择报修人', trigger: 'change' }],
  breakdownLevel: [{ required: true, message: '请选择故障等级', trigger: 'change' }],
  breakdownType: [{ required: true, message: '请选择故障类别', trigger: 'change' }],
  repairDegree: [{ required: true, message: '请选择紧急程度', trigger: 'change' }]
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
  formData.equipmentType = row.equipmentType || ''
  formData.equipmentTypeName = row.equipmentTypeDesc || ''
  formData.equipmentMode = row.equipmentMode || ''
}

const clearEquipment = () => {
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentType = ''
  formData.equipmentTypeName = ''
  formData.equipmentMode = ''
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

// ==================== 枚举下拉回填 text ====================
const handleBreakdownLevelChange = (val: string) => {
  const item = eamEnumStore.getFailureWorkOrderBreakdownLevelList.find((e) => e.value === val)
  formData.breakdownLevelText = item?.text || ''
}

const handleBreakdownTypeChange = (val: string) => {
  const item = eamEnumStore.getFailureWorkOrderBreakdownTypeList.find((e) => e.value === val)
  formData.breakdownTypeText = item?.text || ''
}

const handleRepairDegreeChange = (val: string) => {
  const item = eamEnumStore.getRepairDegreeList.find((e) => e.value === val)
  formData.repairDegreeText = item?.text || ''
}

// ==================== 弹窗控制 ====================
const open = async (m: 'create' | 'edit', row?: FailureWorkOrderApi.FailureWorkOrderVo) => {
  mode.value = m
  dialogVisible.value = true

  await nextTick()
  formRef.value?.clearValidate()

  if (m === 'create') {
    resetFormData()
  } else if (row) {
    try {
      const detail = await FailureWorkOrderApi.getFailureWorkOrderById(row.id)
      fillFormData(detail)
    } catch {
      fillFormData(row)
    }
  }
}

const resetFormData = () => {
  formData.id = undefined
  formData.failureCode = ''
  formData.status = ''
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentType = ''
  formData.equipmentTypeName = ''
  formData.equipmentMode = ''
  formData.breakdownTime = ''
  formData.personSn = ''
  formData.personName = ''
  formData.breakdownLevel = undefined
  formData.breakdownLevelText = ''
  formData.breakdownType = undefined
  formData.breakdownTypeText = ''
  formData.repairDegree = undefined
  formData.repairDegreeText = ''
  formData.remark = ''
  formData.attachmentUrls = []
}

const fillFormData = (data: any) => {
  formData.id = data.id
  formData.failureCode = data.failureCode || ''
  formData.status = data.status || ''
  formData.equipmentSn = data.equipmentSn || ''
  formData.equipmentName = data.equipmentName || ''
  formData.equipmentType = data.equipmentType || ''
  formData.equipmentTypeName = data.equipmentTypeName || ''
  formData.equipmentMode = data.equipmentMode || ''
  formData.breakdownTime = data.breakdownTime || ''
  formData.personSn = data.personSn || ''
  formData.personName = data.personName || ''
  formData.breakdownLevel = data.breakdownLevel || undefined
  formData.breakdownLevelText = data.breakdownLevelText || ''
  formData.breakdownType = data.breakdownType || undefined
  formData.breakdownTypeText = data.breakdownTypeText || ''
  formData.repairDegree = data.repairDegree || undefined
  formData.repairDegreeText = data.repairDegreeText || ''
  formData.remark = data.remark || ''
  formData.attachmentUrls = data.attachments ? data.attachments.split(',') : []
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    const data = {
      equipmentSn: formData.equipmentSn,
      equipmentName: formData.equipmentName,
      equipmentType: formData.equipmentType,
      equipmentTypeName: formData.equipmentTypeName,
      equipmentMode: formData.equipmentMode,
      breakdownTime: formData.breakdownTime,
      personSn: formData.personSn,
      personName: formData.personName,
      breakdownLevel: formData.breakdownLevel,
      breakdownLevelText: formData.breakdownLevelText,
      breakdownType: formData.breakdownType,
      breakdownTypeText: formData.breakdownTypeText,
      repairDegree: formData.repairDegree,
      repairDegreeText: formData.repairDegreeText,
      remark: formData.remark,
      attachments: formData.attachmentUrls.length > 0 ? formData.attachmentUrls.join(',') : ''
    }
    if (mode.value === 'edit') {
      await FailureWorkOrderApi.updateFailureWorkOrder({
        ...data,
        id: formData.id,
        failureCode: formData.failureCode,
        status: formData.status
      })
      message.success('编辑成功')
    } else {
      await FailureWorkOrderApi.createFailureWorkOrder(data)
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
</style>
