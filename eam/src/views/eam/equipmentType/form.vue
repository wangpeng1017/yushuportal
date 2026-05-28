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
          <el-form-item label="设备类型编码" prop="typeCode">
            <el-input
              v-model="formData.typeCode"
              :disabled="formType === 'update'"
              maxlength="10"
              placeholder="请输入设备类型编码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类型名称" prop="typeName">
            <el-input v-model="formData.typeName" maxlength="30" placeholder="请输入设备类型名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类别编码" prop="categoryCode">
            <el-select
              v-model="formData.categoryCode"
              :disabled="formType === 'update'"
              filterable
              clearable
              placeholder="请选择设备类别"
              style="width: 100%"
              @change="handleCategoryChange"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.categoryCode"
                :label="item.categoryCode + ' - ' + item.categoryName"
                :value="item.categoryCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类别名称">
            <el-input v-model="formData.categoryName" disabled />
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
import * as EquipmentTypeApi from '@/api/eam/equipmentType'
import * as EquipmentCategoryApi from '@/api/eam/equipmentCategory'
import type { EamBaseEquipmentCategoryDto } from '@/api/eam/equipmentCategory'

defineOptions({ name: 'EamEquipmentTypeForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('') // create | update
const formRef = ref()
const emit = defineEmits(['success'])

// ==================== 设备分类下拉列表 ====================
const categoryList = ref<EamBaseEquipmentCategoryDto[]>([])

const loadCategoryList = async () => {
  try {
    const res = await EquipmentCategoryApi.getEquipmentCategoryList()
    categoryList.value = res ?? []
  } catch {
    categoryList.value = []
  }
}

/** 选择设备分类后回填 categoryName */
const handleCategoryChange = (val: string) => {
  if (val) {
    const matched = categoryList.value.find((item) => item.categoryCode === val)
    formData.value.categoryName = matched?.categoryName ?? ''
  } else {
    formData.value.categoryName = ''
  }
}

// ==================== 表单数据 ====================
const formData = ref({
  id: undefined as string | undefined,
  typeCode: '',
  typeName: '',
  categoryCode: '',
  categoryName: ''
})

const formRules = reactive({
  typeCode: [
    { required: true, message: '设备类型编码不能为空', trigger: 'blur' },
    { max: 10, message: '编码长度不能超过10个字符', trigger: 'blur' }
  ],
  typeName: [
    { required: true, message: '设备类型名称不能为空', trigger: 'blur' },
    { max: 30, message: '名称长度不能超过30个字符', trigger: 'blur' }
  ],
  categoryCode: [{ required: true, message: '请选择设备类别', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增' : '编辑'
  formType.value = type
  resetForm()
  // 加载分类下拉列表
  await loadCategoryList()
  // 编辑时加载数据
  if (id) {
    formLoading.value = true
    try {
      const res = await EquipmentTypeApi.getEquipmentTypeById(id)
      // request 封装层已自动解包，拿到的直接是业务数据对象
      const data = res
      formData.value = {
        id: data.id,
        typeCode: data.typeCode ?? '',
        typeName: data.typeName ?? '',
        categoryCode: data.categoryCode ?? '',
        categoryName: data.categoryName ?? ''
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
      await EquipmentTypeApi.createEquipmentType(
        formData.value as EquipmentTypeApi.EamBaseEquipmentTypeSaveDto
      )
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentTypeApi.updateEquipmentType(
        formData.value as EquipmentTypeApi.EamBaseEquipmentTypeUpdateDto
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
    typeCode: '',
    typeName: '',
    categoryCode: '',
    categoryName: ''
  }
  formRef.value?.resetFields()
}
</script>
