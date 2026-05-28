<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="650px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="保养部位" prop="maintenancePart">
            <el-input
              v-model="formData.maintenancePart"
              maxlength="30"
              placeholder="请输入保养部位"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="保养标准" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="4"
              maxlength="120"
              show-word-limit
              placeholder="请输入保养标准"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import type { WorkOrderItemLocal } from '@/api/eam/maintenanceWorkOrder'

defineOptions({ name: 'MaintenanceWorkOrderItemForm' })

const emit = defineEmits<{
  (e: 'success', item: WorkOrderItemLocal): void
}>()

const dialogVisible = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()

const dialogTitle = computed(() => {
  return mode.value === 'create' ? '新增保养项' : '编辑保养项'
})

const formData = reactive({
  maintenancePart: '',
  remark: '',
  seq: 1 as number
})

const formRules = {
  maintenancePart: [{ required: true, message: '请输入保养部位', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入保养标准', trigger: 'blur' }]
}

// ==================== 弹窗控制 ====================
const open = (m: 'create' | 'edit', item?: WorkOrderItemLocal) => {
  mode.value = m
  dialogVisible.value = true

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.maintenancePart = ''
      formData.remark = ''
      formData.seq = 1
    } else if (item) {
      formData.maintenancePart = item.maintenancePart || ''
      formData.remark = item.remark || ''
      formData.seq = item.seq || 1
    }
  })
}

// ==================== 提交（直接 emit 数据给父组件，不调 API） ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  emit('success', {
    maintenancePart: formData.maintenancePart,
    remark: formData.remark,
    seq: formData.seq
  })
  dialogVisible.value = false
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.w-full {
  width: 100%;
}
</style>
