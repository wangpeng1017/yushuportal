<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="700px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      :disabled="mode === 'view'"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标准编号" prop="code">
            <el-input v-model="formData.code" disabled placeholder="不填写系统自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标准名称" prop="name">
            <el-input v-model="formData.name" maxlength="30" placeholder="请输入标准名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="equipmentTypeDesc">
            <div class="type-select-wrap">
              <el-input
                v-model="formData.equipmentTypeDesc"
                readonly
                placeholder="请选择设备类型"
                class="type-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.equipmentTypeDesc && mode !== 'view'"
                    class="clear-icon"
                    @click.stop="clearEquipmentType"
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
          <el-form-item label="排序" prop="seq">
            <el-input-number
              v-model="formData.seq"
              :min="1"
              :max="999999"
              :precision="0"
              :step="1"
              controls-position="right"
              class="w-full"
            />
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
  </Dialog>
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import * as StandardApi from '@/api/eam/maintenanceStandard'
import * as EquipmentApi from '@/api/eam/optEquipment'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'

defineOptions({ name: 'MaintenanceStandardForm' })

const message = useMessage()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit' | 'view'>('create')
const formRef = ref()

const dialogTitle = computed(() => {
  const map = { create: '新增-保养标准', edit: '编辑-保养标准', view: '查看-保养标准' }
  return map[mode.value]
})

const formData = reactive({
  id: undefined as string | undefined,
  code: '',
  name: '',
  equipmentTypeCode: '',
  equipmentTypeDesc: '',
  seq: undefined as number | undefined
})

const formRules = {
  name: [{ required: true, message: '请输入标准名称', trigger: 'blur' }]
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
  { from: 'typeCode', to: 'equipmentTypeCode' },
  { from: 'typeName', to: 'equipmentTypeDesc' }
]

const openTypeSelector = () => {
  typeSelectorRef.value?.open()
}

const handleTypeSelect = (_row: any, mapped: Record<string, any>) => {
  formData.equipmentTypeCode = mapped.equipmentTypeCode
  formData.equipmentTypeDesc = mapped.equipmentTypeDesc
}

const clearEquipmentType = () => {
  formData.equipmentTypeCode = ''
  formData.equipmentTypeDesc = ''
}

// ==================== 弹窗控制 ====================
const open = (m: 'create' | 'edit' | 'view', row?: StandardApi.StandardVo) => {
  mode.value = m
  dialogVisible.value = true

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.code = ''
      formData.name = ''
      formData.equipmentTypeCode = ''
      formData.equipmentTypeDesc = ''
      formData.seq = undefined
    } else if (row) {
      formData.id = row.id
      formData.code = row.code
      formData.name = row.name
      formData.equipmentTypeCode = row.equipmentTypeCode
      formData.equipmentTypeDesc = row.equipmentTypeDesc
      formData.seq = row.seq
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const data: StandardApi.StandardSaveDto = {
      name: formData.name,
      equipmentTypeCode: formData.equipmentTypeCode || undefined,
      equipmentTypeDesc: formData.equipmentTypeDesc || undefined,
      seq: formData.seq
    }
    if (mode.value === 'edit') {
      data.id = formData.id
      data.code = formData.code
      await StandardApi.updateStandard(data)
      message.success('编辑成功')
    } else {
      await StandardApi.createStandard(data)
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

.type-select-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}

.type-input {
  flex: 1;
}

.clear-icon {
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}
</style>
