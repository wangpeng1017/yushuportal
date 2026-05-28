<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="750px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      :disabled="mode === 'view'"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="配置编号" prop="code">
            <el-input v-model="formData.code" disabled placeholder="不填写系统自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="配置名称" prop="name">
            <el-input v-model="formData.name" maxlength="20" placeholder="请输入配置名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="deviceTypeDesc">
            <div class="selector-wrap">
              <el-input
                v-model="formData.deviceTypeDesc"
                readonly
                placeholder="请选择设备类型"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.deviceTypeDesc && mode !== 'view'"
                    class="clear-icon"
                    @click.stop="clearDeviceType"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button v-if="mode !== 'view'" type="primary" @click="openTypeSelector">
                选择
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号" prop="deviceModel">
            <el-select
              v-model="formData.deviceModel"
              placeholder="请选择设备型号"
              clearable
              filterable
              class="w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getEquipmentModeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备厂家" prop="deviceSupName">
            <div class="selector-wrap">
              <el-input
                v-model="formData.deviceSupName"
                readonly
                placeholder="请选择设备厂家"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.deviceSupName && mode !== 'view'"
                    class="clear-icon"
                    @click.stop="clearDeviceSup"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button v-if="mode !== 'view'" type="primary" @click="openSupSelector">
                选择
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="请选择启用状态"
              class="w-full"
              @change="handleStatusChange"
            >
              <el-option
                v-for="item in eamEnumStore.getSupplierStatusList"
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
          <el-form-item label="参数表图片" prop="attachmentUrls">
            <el-tooltip content="最多上传9张图片" placement="top" :disabled="mode === 'view'">
              <UploadImgs
                v-model="formData.attachmentUrls"
                :limit="9"
                :disabled="mode === 'view'"
                :drag="false"
              />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        v-if="mode !== 'view'"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </template>

    <!-- 设备类型弹窗选择器 -->
    <TableSelectDialog
      ref="typeSelectorRef"
      title="选择设备类型"
      width="850px"
      :columns="typeColumns"
      :fetch-api="EquipmentApi.getEquipmentTypePage"
      :field-mapping="typeFieldMapping"
      :paginated="true"
      @select="handleTypeSelect"
    />

    <!-- 设备厂家弹窗选择器 -->
    <TableSelectDialog
      ref="supSelectorRef"
      title="选择设备厂家"
      width="850px"
      :columns="supColumns"
      :fetch-api="SupplierApi.getSupplierPage"
      :field-mapping="supFieldMapping"
      :paginated="true"
      @select="handleSupSelect"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import * as ParamConfApi from '@/api/eam/spotInspectionParamConf'
import * as EquipmentApi from '@/api/eam/optEquipment'
import * as SupplierApi from '@/api/eam/supplier'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'ParamConfForm' })

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
  const map = { create: '新增-参数巡检配置', edit: '编辑-参数巡检配置', view: '查看-参数巡检配置' }
  return map[mode.value]
})

const formData = reactive({
  id: undefined as string | undefined,
  code: '',
  name: '',
  deviceType: '',
  deviceTypeDesc: '',
  deviceModel: '',
  deviceSupCode: '',
  deviceSupName: '',
  status: '1',
  statusDesc: '',
  attachmentUrls: [] as string[]
})

const formRules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  deviceTypeDesc: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  deviceModel: [{ required: true, message: '请选择设备型号', trigger: 'change' }],
  deviceSupName: [{ required: true, message: '请选择设备厂家', trigger: 'change' }],
  status: [{ required: true, message: '请选择启用状态', trigger: 'change' }]
}

// ==================== 设备类型选择器 ====================
const typeSelectorRef = ref()

const typeColumns: TableColumn[] = [
  { prop: 'typeCode', label: '设备类型编码', width: 140, searchable: true },
  { prop: 'typeName', label: '设备类型名称', minWidth: 150, searchable: true },
  { prop: 'categoryCode', label: '设备分类编号', width: 120 },
  { prop: 'categoryName', label: '设备分类名称', minWidth: 120 }
]

const typeFieldMapping: FieldMapping[] = [
  { from: 'typeCode', to: 'deviceType' },
  { from: 'typeName', to: 'deviceTypeDesc' }
]

const openTypeSelector = () => {
  typeSelectorRef.value?.open()
}

const handleTypeSelect = (_row: any, mapped: Record<string, any>) => {
  formData.deviceType = mapped.deviceType
  formData.deviceTypeDesc = mapped.deviceTypeDesc
}

const clearDeviceType = () => {
  formData.deviceType = ''
  formData.deviceTypeDesc = ''
}

// ==================== 设备厂家选择器 ====================
const supSelectorRef = ref()

const supColumns: TableColumn[] = [
  { prop: 'supplierSn', label: '供应商编号', width: 140, searchable: true },
  { prop: 'supplierName', label: '供应商名称', minWidth: 200, searchable: true },
  { prop: 'supplierCategory', label: '供应商类别', width: 120 }
]

const supFieldMapping: FieldMapping[] = [
  { from: 'supplierSn', to: 'deviceSupCode' },
  { from: 'supplierName', to: 'deviceSupName' }
]

const openSupSelector = () => {
  supSelectorRef.value?.open()
}

const handleSupSelect = (_row: any, mapped: Record<string, any>) => {
  formData.deviceSupCode = mapped.deviceSupCode
  formData.deviceSupName = mapped.deviceSupName
}

const clearDeviceSup = () => {
  formData.deviceSupCode = ''
  formData.deviceSupName = ''
}

// ==================== 状态联动 ====================
const handleStatusChange = (val: string) => {
  formData.statusDesc = eamEnumStore.getSupplierStatusText(val)
}

// ==================== 弹窗控制 ====================
const open = (m: 'create' | 'edit' | 'view', row?: ParamConfApi.ParamConfVo) => {
  mode.value = m
  dialogVisible.value = true

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.code = ''
      formData.name = ''
      formData.deviceType = ''
      formData.deviceTypeDesc = ''
      formData.deviceModel = ''
      formData.deviceSupCode = ''
      formData.deviceSupName = ''
      formData.status = '1'
      formData.statusDesc = eamEnumStore.getSupplierStatusText('1')
      formData.attachmentUrls = []
    } else if (row) {
      formData.id = row.id
      formData.code = row.code
      formData.name = row.name
      formData.deviceType = row.deviceType
      formData.deviceTypeDesc = row.deviceTypeDesc
      formData.deviceModel = row.deviceModel
      formData.deviceSupCode = row.deviceSupCode
      formData.deviceSupName = row.deviceSupName
      formData.status = row.status
      formData.statusDesc = row.statusDesc
      formData.attachmentUrls = row.attachmentUrl ? row.attachmentUrl.split(',') : []
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const data: ParamConfApi.ParamConfSaveDto = {
      name: formData.name,
      deviceType: formData.deviceType,
      deviceTypeDesc: formData.deviceTypeDesc,
      deviceModel: formData.deviceModel,
      deviceSupCode: formData.deviceSupCode,
      deviceSupName: formData.deviceSupName,
      status: formData.status,
      statusDesc: formData.statusDesc,
      attachmentUrl: formData.attachmentUrls.length > 0 ? formData.attachmentUrls.join(',') : ''
    }
    if (mode.value === 'edit') {
      data.id = formData.id
      data.code = formData.code
      await ParamConfApi.updateParamConf(data)
      message.success('编辑成功')
    } else {
      await ParamConfApi.createParamConf(data)
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
