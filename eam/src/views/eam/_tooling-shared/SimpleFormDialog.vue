<template>
  <el-dialog v-model="visible" :title="title" width="800px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col v-for="f in fields" :key="f.prop" :span="f.span || 12">
          <el-form-item :label="f.label" :prop="f.prop">
            <el-select
              v-if="f.type === 'select'"
              v-model="formData[f.prop]"
              :placeholder="`请选择${f.label}`"
              clearable class="!w-full"
            >
              <el-option v-for="o in f.options || []" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <el-input-number
              v-else-if="f.type === 'number'"
              v-model="formData[f.prop]"
              :min="f.min ?? 0"
              :precision="f.precision ?? 0"
              class="!w-full"
            />
            <el-date-picker
              v-else-if="f.type === 'date'"
              v-model="formData[f.prop]"
              type="date"
              value-format="YYYY-MM-DD"
              class="!w-full"
              :placeholder="`请选择${f.label}`"
            />
            <el-input
              v-else-if="f.type === 'textarea'"
              v-model="formData[f.prop]"
              type="textarea"
              :rows="3"
              :placeholder="`请输入${f.label}`"
            />
            <el-input
              v-else
              v-model="formData[f.prop]"
              :placeholder="f.placeholder || `请输入${f.label}`"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="submitting" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import request from '@/config/axios'

const props = defineProps<{
  title: string
  fields: Array<{
    prop: string
    label: string
    type?: 'input' | 'select' | 'number' | 'date' | 'textarea'
    span?: number
    required?: boolean
    options?: Array<{ label: string; value: string | number }>
    placeholder?: string
    min?: number
    precision?: number
  }>
  apiCreate: string
  apiUpdate?: string
}>()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const visible = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive<any>({})
const editId = ref<string | null>(null)

const rules = ref<any>({})

watch(() => props.fields, (fields) => {
  // 重新生成 rules
  const r: any = {}
  fields.forEach(f => {
    if (f.required) {
      r[f.prop] = [{ required: true, message: `请填写${f.label}`, trigger: f.type === 'select' ? 'change' : 'blur' }]
    }
  })
  rules.value = r
}, { immediate: true })

function open(id?: string, initData?: any) {
  visible.value = true
  editId.value = id || null
  // 重置 formData
  Object.keys(formData).forEach(k => delete formData[k])
  if (initData) Object.assign(formData, initData)
}

async function submit() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return
  submitting.value = true
  try {
    const url = editId.value && props.apiUpdate ? props.apiUpdate : props.apiCreate
    await request.post({ url, data: { ...formData, id: editId.value } })
    ElMessage.success(editId.value ? '更新成功' : '新增成功')
    visible.value = false
    emit('success')
  } catch (e) {
    console.error(e)
    ElMessage.error('保存失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

defineExpose({ open })
</script>
