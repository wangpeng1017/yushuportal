<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="600">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备分类编码" prop="categoryCode">
            <el-input
              v-model="formData.categoryCode"
              :disabled="formType === 'update'"
              maxlength="10"
              placeholder="请输入设备分类编码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备分类名称" prop="categoryName">
            <el-input
              v-model="formData.categoryName"
              maxlength="30"
              placeholder="请输入设备分类名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
              v-model="formData.sortNo"
              :min="0"
              :max="99999"
              :precision="0"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />取 消
      </el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">
        <Icon icon="ep:check" class="mr-5px" />确 定
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as EquipmentCategoryApi from '@/api/eam/equipmentCategory'

defineOptions({ name: 'EamEquipmentCategoryForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('') // create | update
const formRef = ref()
const emit = defineEmits(['success'])

const formData = ref({
  id: undefined as string | undefined,
  categoryCode: '',
  categoryName: '',
  sortNo: 0 as number | undefined
})

const formRules = reactive({
  categoryCode: [
    { required: true, message: '设备分类编码不能为空', trigger: 'blur' },
    { max: 10, message: '编码长度不能超过10个字符', trigger: 'blur' }
  ],
  categoryName: [
    { required: true, message: '设备分类名称不能为空', trigger: 'blur' },
    { max: 30, message: '名称长度不能超过30个字符', trigger: 'blur' }
  ],
  sortNo: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增' : '编辑'
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const res = await EquipmentCategoryApi.getEquipmentCategoryById(id)
      // request 封装层已自动解包 res.data，拿到的直接是业务数据对象
      const data = res
      formData.value = {
        id: data.id,
        categoryCode: data.categoryCode ?? '',
        categoryName: data.categoryName ?? '',
        sortNo: data.sortNo ?? 0
      }
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open })

/** 提交表单 */
const submitForm = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return
  formLoading.value = true
  try {
    if (formType.value === 'create') {
      await EquipmentCategoryApi.createEquipmentCategory(
        formData.value as EquipmentCategoryApi.EamBaseEquipmentCategorySaveDto
      )
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentCategoryApi.updateEquipmentCategory(
        formData.value as EquipmentCategoryApi.EamBaseEquipmentCategoryUpdateDto
      )
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    categoryCode: '',
    categoryName: '',
    sortNo: 0
  }
  formRef.value?.resetFields()
}
</script>
