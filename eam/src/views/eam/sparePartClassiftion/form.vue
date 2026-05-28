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
          <el-form-item label="分类名称" prop="classifName">
            <el-input
              v-model="formData.classifName"
              maxlength="50"
              placeholder="请输入分类名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级分类" prop="classifParentId">
            <el-tree-select
              v-model="formData.classifParentId"
              :data="parentTree"
              :props="defaultProps"
              check-strictly
              default-expand-all
              placeholder="请选择上级分类"
              node-key="id"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序" prop="sort">
            <el-input-number
              v-model="formData.sort"
              :min="1"
              :max="9999"
              placeholder="请输入排序"
              controls-position="right"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="formData.status"
              placeholder="请选择状态"
              style="width: 100%"
            >
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">
        <Icon icon="ep:check" class="mr-5px" />确 定
      </el-button>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />取 消
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { handleTree } from '@/utils/tree'
import * as SparePartClassificationApi from '@/api/eam/sparePartClassification'

defineOptions({ name: 'EamSparePartClassificationForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('') // create | update
const formRef = ref()
const emit = defineEmits(['success'])

// 树形选择器的配置
const defaultProps = {
  children: 'children',
  label: 'classifName',
  value: 'id'
}

// ==================== 上级分类树形数据 ====================
const parentTree = ref<any[]>([])

const loadParentTree = async () => {
  try {
    const res = await SparePartClassificationApi.getSparePartClassificationList()
    const list = res ?? []
    // 构建树形结构
    const tree = handleTree(list, 'id', 'classifParentId')
    // 将顶级分类节点和其他分类保持同一层级
    parentTree.value = [
      {
        id: '0',
        classifName: '顶级分类',
        children: []
      },
      ...tree
    ]
  } catch {
    parentTree.value = [
      {
        id: '0',
        classifName: '顶级分类',
        children: []
      }
    ]
  }
}

// ==================== 状态枚举列表 ====================
const statusList = ref<SparePartClassificationApi.StatusOption[]>([])

const loadStatusList = async () => {
  try {
    const res = await SparePartClassificationApi.getStatusList()
    statusList.value = res ?? []
  } catch {
    statusList.value = []
  }
}



// ==================== 表单数据 ====================
const formData = ref({
  id: undefined as string | undefined,
  classifName: '',
  classifParentId: '0',
  sort: 1,
  status: ''
})

const formRules = reactive({
  classifName: [
    { required: true, message: '分类名称不能为空', trigger: 'blur' },
    { max: 50, message: '名称长度不能超过50个字符', trigger: 'blur' }
  ],
  classifParentId: [
    { required: true, message: '上级分类不能为空', trigger: 'change' }
  ],
  status: [{ required: true, message: '状态不能为空', trigger: 'change' }]
})

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增备件分类' : '编辑备件分类'
  formType.value = type
  resetForm()
  // 加载上级分类树形数据
  await loadParentTree()
  // 加载状态枚举列表
  await loadStatusList()
  // 编辑时加载数据
  if (id) {
    formLoading.value = true
    try {
      const res = await SparePartClassificationApi.getSparePartClassificationById(id)
      const data = res
      formData.value = {
        id: data.id,
        classifName: data.classifName ?? '',
        classifParentId: data.classifParentId ?? '0',
        sort: data.sort ?? 1,
        status: data.status ?? ''
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
    // 处理顶级分类的情况，将 '0' 转换为空字符串或 null
    const submitData = {
      ...formData.value,
      classifParentId: formData.value.classifParentId === '0' ? '' : formData.value.classifParentId
    }
    
    if (formType.value === 'create') {
      await SparePartClassificationApi.createSparePartClassification(
        submitData as SparePartClassificationApi.EamSparePartClassificationSaveDto
      )
      message.success(t('common.createSuccess'))
    } else {
      await SparePartClassificationApi.updateSparePartClassification(
        submitData as SparePartClassificationApi.EamSparePartClassificationUpdateDto
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
    classifName: '',
    classifParentId: '0',
    sort: 1,
    status: ''
  }
  formRef.value?.resetFields()
}
</script>
