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
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as PlanApi from '@/api/eam/maintenancePlan'

defineOptions({ name: 'MaintenancePlanItemForm' })

const message = useMessage()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()
const planCode = ref('')

const dialogTitle = computed(() => {
  return mode.value === 'create' ? '新增保养项' : '编辑保养项'
})

const formData = reactive({
  id: undefined as string | undefined,
  maintenancePart: '',
  remark: '',
  seq: 1 as number
})

const formRules = {
  maintenancePart: [{ required: true, message: '请输入保养部位', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入保养标准', trigger: 'blur' }]
}

// ==================== 弹窗控制 ====================
const open = (m: 'create' | 'edit', code: string, row?: PlanApi.PlanItemVo) => {
  mode.value = m
  planCode.value = code
  dialogVisible.value = true

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.maintenancePart = ''
      formData.remark = ''
      formData.seq = 1
    } else if (row) {
      formData.id = row.id
      formData.maintenancePart = row.maintenancePart || ''
      formData.remark = row.remark || ''
      formData.seq = row.seq || 1
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const data: PlanApi.PlanItemSaveDto = {
      planCode: planCode.value,
      maintenancePart: formData.maintenancePart,
      remark: formData.remark,
      seq: formData.seq
    }

    if (mode.value === 'edit') {
      data.id = formData.id
      await PlanApi.updateItem(data)
      message.success('编辑成功')
    } else {
      await PlanApi.createItem(data)
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
</style>
