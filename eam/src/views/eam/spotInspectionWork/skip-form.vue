<template>
  <Dialog v-model="dialogVisible" title="跳过巡检" width="500px">
    <el-form :model="formData" :rules="formRules" ref="formRef" label-width="80px">
      <!-- 班次/班组已删除，不迁移 -->
      <el-form-item label="完成日期" prop="completeDate">
        <el-date-picker
          v-model="formData.completeDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择完成日期"
          :disabled-date="disableDateFn"
          class="!w-320px"
        />
      </el-form-item>
      <el-form-item label="跳过原因" prop="skipReason">
        <el-input
          v-model="formData.skipReason"
          type="textarea"
          :rows="4"
          :maxlength="120"
          show-word-limit
          placeholder="请输入跳过原因"
          class="!w-320px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import * as WorkApi from '@/api/eam/spotInspectionWork'

defineOptions({ name: 'EamSpotInspectionWorkSkipForm' })

const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const formRef = ref()
const workId = ref('')
const deviceIds = ref('')

const formData = reactive({
  completeDate: '',
  skipReason: ''
})

const formRules = {
  completeDate: [{ required: true, message: '请选择完成日期', trigger: 'change' }],
  skipReason: [{ required: true, message: '请输入跳过原因', trigger: 'blur' }]
}

/** 只允许选择今天或昨天 */
const disableDateFn = (date: Date) => {
  const today = dayjs().startOf('day')
  const yesterday = today.subtract(1, 'day')
  const d = dayjs(date).startOf('day')
  return d.isBefore(yesterday) || d.isAfter(today)
}

/** 打开弹窗 */
const open = (id: string, ids: string) => {
  workId.value = id
  deviceIds.value = ids
  formData.completeDate = dayjs().format('YYYY-MM-DD')
  formData.skipReason = ''
  dialogVisible.value = true
  nextTick(() => {
    formRef.value?.clearValidate()
  })
}

/** 提交 */
const handleSubmit = async () => {
  await formRef.value?.validate()
  submitLoading.value = true
  try {
    // 跳过巡检接口为 GET，参数走 query string
    await WorkApi.skipCheck({
      id: workId.value,
      ids: deviceIds.value,
      skipReason: formData.skipReason,
      completeDate: formData.completeDate,
      // 班次/班组已删除，传空字符串
      teamCode: '',
      teamName: '',
      shiftCode: '',
      shiftName: ''
    })
    message.success('跳过巡检成功')
    dialogVisible.value = false
    emit('success')
  } catch {
    // API 异常
  } finally {
    submitLoading.value = false
  }
}

defineExpose({ open })
</script>
