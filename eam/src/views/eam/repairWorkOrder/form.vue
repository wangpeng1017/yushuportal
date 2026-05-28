<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <!-- ==================== 基本信息 ==================== -->
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="维修类型" prop="maintainType" required>
            <el-radio-group v-model="formData.maintainType">
              <el-radio value="内部">
                内部维修
                <span class="text-12px text-gray-400 ml-5px">默认免审</span>
              </el-radio>
              <el-radio value="外部">
                外部维修
                <span class="text-12px text-gray-400 ml-5px">需走 BPM 审批流</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData.maintainType === '外部'" label="维修总费用">
            <el-input v-model="formData.totalFee" placeholder="飞书审批通过 / ERP 回传后自动回填" disabled>
              <template #prepend>¥</template>
              <template #append>元（只读）</template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.maintainType === '外部'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="飞书需求单号">
            <el-input v-model="formData.feishuOrderNo" placeholder="飞书提交后自动回填" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维修合同/协议附件">
            <el-upload
              :file-list="formData.contractFiles || []"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              :auto-upload="false"
              :on-change="(f: any) => handleContractUpload(f)"
              multiple
            >
              <el-button plain>
                <Icon icon="ep:upload" class="mr-5px" />车间上传（PDF/Word/图片）
              </el-button>
              <template #tip>
                <div class="text-12px text-gray-500">外部维修必须附合同/协议，由车间发起人上传</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="维修单号">
            <el-input v-model="formData.repairCode" disabled placeholder="系统自动生成" />
          </el-form-item>
        </el-col>
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
              <el-button type="primary" @click="openEquipmentSelector">选择</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" disabled />
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
          <el-form-item label="设备类型">
            <el-input v-model="formData.equipmentTypeName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否有故障" prop="hasBreakdown">
            <el-select
              v-model="formData.hasBreakdown"
              placeholder="请选择"
              clearable
              class="w-full"
              @change="handleHasBreakdownChange"
            >
              <el-option
                v-for="item in eamEnumStore.getYesNoList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ==================== 故障信息 ==================== -->
      <el-divider content-position="left">故障信息</el-divider>
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
          <el-form-item label="故障等级" prop="breakdownLevel">
            <el-select
              v-model="formData.breakdownLevel"
              placeholder="请选择故障等级"
              clearable
              class="w-full"
              @change="handleBreakdownLevelChange"
            >
              <el-option
                v-for="item in eamEnumStore.getRepairWorkOrderRepairLevelList"
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
          <el-form-item label="故障图片">
            <el-tooltip content="最多上传9张图片，仅支持 jpg、png、gif 格式" placement="top">
              <UploadImgs v-model="formData.attachmentUrls" :limit="9" :drag="false" />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSave">保 存</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSaveAndPublish"
        >保存并发布</el-button
      >
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
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import * as RepairWorkOrderApi from '@/api/eam/repairWorkOrder'
import * as FailureWorkOrderApi from '@/api/eam/failureWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'RepairWorkOrderForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formType = ref<'create' | 'update'>('create')
const formRef = ref()

const dialogTitle = computed(() => {
  return formType.value === 'create' ? '新增维修工单' : '编辑维修工单'
})

// ==================== 表单数据 ====================

const formData = reactive({
  id: undefined as string | undefined,
  repairCode: '',
  equipmentSn: '',
  equipmentName: '',
  equipmentType: '',
  equipmentTypeName: '',
  equipmentMode: '',
  capacityGroupCode: '',
  capacityGroupName: '',
  hasBreakdown: undefined as string | undefined,
  breakdownTime: '',
  breakdownLevel: undefined as string | undefined,
  breakdownLevelText: '',
  remark: '',
  attachmentUrls: [] as string[],
  // 维修类型 + 外部维修相关字段（演示）
  maintainType: '内部' as '内部' | '外部',
  totalFee: '',
  feishuOrderNo: '',
  contractFiles: [] as any[]
})

/** 合同附件上传（mock：仅展示文件名） */
function handleContractUpload(file: any) {
  if (!formData.contractFiles) formData.contractFiles = []
  formData.contractFiles.push({ name: file.name, size: file.size, status: 'success' })
}

/** hasBreakdown 是否为"是" */
const isBreakdown = computed(() => {
  // yesNo 枚举的值可能是 '1'/'0' 或 '是'/'否'，需兼容
  const yesItem = eamEnumStore.getYesNoList.find((e) => e.text === '是' || e.value === '1')
  return formData.hasBreakdown === yesItem?.value
})

const formRules = computed(() => ({
  equipmentSn: [{ required: true, message: '请选择设备', trigger: 'change' }],
  hasBreakdown: [{ required: true, message: '请选择是否有故障', trigger: 'change' }],
  breakdownTime: isBreakdown.value
    ? [{ required: true, message: '请选择故障时间', trigger: 'change' }]
    : []
}))

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
  formData.capacityGroupCode = row.equipmentLocationCode || ''
  formData.capacityGroupName = row.equipmentLocation || ''
}

const clearEquipment = () => {
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentType = ''
  formData.equipmentTypeName = ''
  formData.equipmentMode = ''
  formData.capacityGroupCode = ''
  formData.capacityGroupName = ''
}

// ==================== 枚举联动 ====================

const handleHasBreakdownChange = (val: string) => {
  if (!val || !isBreakdown.value) {
    formData.breakdownTime = ''
  }
}

const handleBreakdownLevelChange = (val: string) => {
  const item = eamEnumStore.getRepairWorkOrderRepairLevelList.find((e) => e.value === val)
  formData.breakdownLevelText = item?.text || ''
}

// ==================== 弹窗控制 ====================

const open = async (type: 'create' | 'update', row?: RepairWorkOrderApi.RepairWorkOrderVo) => {
  formType.value = type
  dialogVisible.value = true

  // 加载枚举
  await Promise.all([eamEnumStore.loadYesNo(), eamEnumStore.loadRepairWorkOrderRepairLevel()])

  await nextTick()
  formRef.value?.clearValidate()

  if (type === 'create') {
    resetFormData()
  } else if (row) {
    try {
      const detail = await RepairWorkOrderApi.getRepairWorkOrderById(row.id)
      fillFormData(detail)
    } catch {
      fillFormData(row)
    }
  }
}

const resetFormData = () => {
  formData.id = undefined
  formData.repairCode = ''
  formData.equipmentSn = ''
  formData.equipmentName = ''
  formData.equipmentType = ''
  formData.equipmentTypeName = ''
  formData.equipmentMode = ''
  formData.capacityGroupCode = ''
  formData.capacityGroupName = ''
  formData.hasBreakdown = undefined
  formData.breakdownTime = ''
  formData.breakdownLevel = undefined
  formData.breakdownLevelText = ''
  formData.remark = ''
  formData.attachmentUrls = []
}

const fillFormData = (data: any) => {
  formData.id = data.id
  formData.repairCode = data.repairCode || ''
  formData.equipmentSn = data.equipmentSn || ''
  formData.equipmentName = data.equipmentName || ''
  formData.equipmentType = data.equipmentType || ''
  formData.equipmentTypeName = data.equipmentTypeName || ''
  formData.equipmentMode = data.equipmentMode || ''
  formData.capacityGroupCode = data.capacityGroupCode || ''
  formData.capacityGroupName = data.capacityGroupName || ''
  formData.hasBreakdown = data.hasBreakdown || undefined
  formData.breakdownTime = data.breakdownTime || ''
  formData.breakdownLevel = data.breakdownLevel || undefined
  formData.breakdownLevelText = data.breakdownLevelText || ''
  formData.remark = data.remark || ''
  formData.attachmentUrls = data.attachments ? data.attachments.split(',') : []
}

/** 构建提交数据 */
const buildSubmitData = () => {
  return {
    id: formData.id,
    repairCode: formData.repairCode,
    equipmentSn: formData.equipmentSn,
    equipmentName: formData.equipmentName,
    equipmentType: formData.equipmentType,
    equipmentTypeName: formData.equipmentTypeName,
    equipmentMode: formData.equipmentMode,
    capacityGroupCode: formData.capacityGroupCode,
    capacityGroupName: formData.capacityGroupName,
    hasBreakdown: formData.hasBreakdown,
    breakdownTime: formData.breakdownTime,
    breakdownLevel: formData.breakdownLevel,
    breakdownLevelText: formData.breakdownLevelText,
    remark: formData.remark,
    attachments: formData.attachmentUrls.length > 0 ? formData.attachmentUrls.join(',') : ''
  }
}

// ==================== 保存 ====================

const handleSave = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    const data = buildSubmitData()
    if (formType.value === 'update') {
      await RepairWorkOrderApi.editOrder(data as RepairWorkOrderApi.RepairWorkOrderUpdateVo)
      message.success('编辑成功')
    } else {
      await RepairWorkOrderApi.createOrder(data as RepairWorkOrderApi.RepairWorkOrderCreateVo)
      message.success('新增成功')
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    submitLoading.value = false
  }
}

// ==================== 保存并发布 ====================

const handleSaveAndPublish = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  submitLoading.value = true
  try {
    const data = buildSubmitData()
    await RepairWorkOrderApi.publishOrder(data as RepairWorkOrderApi.RepairWorkOrderPublishVo)
    message.success('发布成功')
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
