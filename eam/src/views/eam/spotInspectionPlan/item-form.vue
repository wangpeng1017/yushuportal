<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检查项名称" prop="itemName">
            <el-input v-model="formData.itemName" maxlength="50" placeholder="请输入检查项名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="定性/定量" prop="itemType">
            <el-select
              v-model="formData.itemType"
              placeholder="请选择"
              class="w-full"
              @change="handleItemTypeChange"
            >
              <el-option label="定性" value="定性" />
              <el-option label="定量" value="定量" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 定性：正常项 / 异常项 -->
      <el-row v-if="formData.itemType === '定性'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="正常项" prop="normalTags">
            <div class="tag-input-wrap">
              <div class="tag-list">
                <el-tag
                  v-for="(tag, index) in formData.normalTags"
                  :key="'n' + index"
                  closable
                  type="success"
                  @close="removeNormalTag(index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <el-input
                v-model="normalInput"
                size="small"
                placeholder="输入后回车新增"
                @keyup.enter="addNormalTag"
              />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="异常项" prop="abnormalTags">
            <div class="tag-input-wrap">
              <div class="tag-list">
                <el-tag
                  v-for="(tag, index) in formData.abnormalTags"
                  :key="'a' + index"
                  closable
                  type="danger"
                  @close="removeAbnormalTag(index)"
                >
                  {{ tag }}
                </el-tag>
              </div>
              <el-input
                v-model="abnormalInput"
                size="small"
                placeholder="输入后回车新增"
                @keyup.enter="addAbnormalTag"
              />
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 定量：上限/下限 -->
      <el-row v-if="formData.itemType === '定量'" :gutter="20">
        <el-col :span="12">
          <el-form-item label="上限值" prop="max">
            <el-input v-model="formData.max" placeholder="请输入上限值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下限值" prop="min">
            <el-input v-model="formData.min" placeholder="请输入下限值" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <!-- 定性默认值：从正常项中选择 -->
        <el-col v-if="formData.itemType === '定性'" :span="12">
          <el-form-item label="默认值" prop="defaultValue">
            <el-select
              v-model="formData.defaultValue"
              placeholder="请选择默认值"
              clearable
              class="w-full"
            >
              <el-option
                v-for="tag in formData.normalTags"
                :key="tag"
                :label="tag"
                :value="tag"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 定量默认值：输入框 -->
        <el-col v-if="formData.itemType === '定量'" :span="12">
          <el-form-item label="默认值" prop="defaultValue">
            <el-input v-model="formData.defaultValue" placeholder="请输入默认值" />
          </el-form-item>
        </el-col>
        <!-- 定量单位 -->
        <el-col v-if="formData.itemType === '定量'" :span="12">
          <el-form-item label="单位" prop="unitNumber">
            <el-select
              v-model="formData.unitNumber"
              placeholder="请选择单位"
              clearable
              class="w-full"
              @change="handleUnitChange"
            >
              <el-option
                v-for="item in eamEnumStore.getParamsUnitList"
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
          <el-form-item label="必检项" prop="needTypeCode">
            <el-select
              v-model="formData.needTypeCode"
              placeholder="请选择"
              class="w-full"
              @change="handleNeedTypeChange"
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
        <el-col :span="12">
          <el-form-item label="排序号" prop="sort">
            <el-input-number
              v-model="formData.sort"
              :min="0"
              :max="999999"
              :precision="0"
              :step="1"
              controls-position="right"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="检查标准" prop="checkStandard">
            <el-input
              v-model="formData.checkStandard"
              type="textarea"
              :rows="3"
              maxlength="200"
              placeholder="请输入检查标准"
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
import * as PlanApi from '@/api/eam/spotInspectionPlan'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'PlanItemForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()
const currentPlan = ref<PlanApi.PlanVo | null>(null)

const dialogTitle = computed(() => {
  return mode.value === 'create' ? '新增检查项' : '编辑检查项'
})

// ==================== 标签输入 ====================
const normalInput = ref('')
const abnormalInput = ref('')

const addNormalTag = () => {
  const val = normalInput.value.trim()
  if (!val) return
  if (val.includes(',')) {
    message.warning('不允许输入逗号')
    return
  }
  if (!formData.normalTags.includes(val)) {
    formData.normalTags.push(val)
  }
  normalInput.value = ''
}

const removeNormalTag = (index: number) => {
  const removed = formData.normalTags[index]
  formData.normalTags.splice(index, 1)
  if (formData.defaultValue === removed) {
    formData.defaultValue = ''
  }
}

const addAbnormalTag = () => {
  const val = abnormalInput.value.trim()
  if (!val) return
  if (val.includes(',')) {
    message.warning('不允许输入逗号')
    return
  }
  if (!formData.abnormalTags.includes(val)) {
    formData.abnormalTags.push(val)
  }
  abnormalInput.value = ''
}

const removeAbnormalTag = (index: number) => {
  formData.abnormalTags.splice(index, 1)
}

// ==================== 数值校验 ====================
const numberPattern =
  /^(?:0(?:\.\d{1,8})?|[1-9]\d{0,9}(?:\.\d{1,8})?|-(?:[1-9]\d{0,9}(?:\.\d{1,8})?|0\.\d{1,8}))$/

const validateNumber = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('此字段为必填'))
    return
  }
  if (!numberPattern.test(value)) {
    callback(new Error('最多输入10位整数8位小数'))
    return
  }
  callback()
}

const validateOptionalNumber = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback()
    return
  }
  if (!numberPattern.test(value)) {
    callback(new Error('最多输入10位整数8位小数'))
    return
  }
  callback()
}

// ==================== 表单数据 ====================
const formData = reactive({
  id: undefined as string | undefined,
  itemName: '',
  itemType: '' as string,
  normalTags: [] as string[],
  abnormalTags: [] as string[],
  max: '',
  min: '',
  defaultValue: '',
  unitNumber: '',
  unitName: '',
  needTypeCode: '1',
  needTypeText: '是',
  checkStandard: '',
  sort: 1 as number
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = {
    itemName: [{ required: true, message: '请输入检查项名称', trigger: 'blur' }],
    itemType: [{ required: true, message: '请选择定性/定量', trigger: 'change' }],
    needTypeCode: [{ required: true, message: '请选择必检项', trigger: 'change' }]
  }

  if (formData.itemType === '定性') {
    rules.normalTags = [
      {
        validator: (_rule: any, _value: any, callback: any) => {
          if (formData.normalTags.length === 0) {
            callback(new Error('请至少输入一个正常项'))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  }

  if (formData.itemType === '定量') {
    rules.max = [{ validator: validateNumber, trigger: 'blur' }]
    rules.min = [{ validator: validateNumber, trigger: 'blur' }]
    rules.defaultValue = [{ validator: validateOptionalNumber, trigger: 'blur' }]
  }

  return rules
})

// ==================== 联动处理 ====================
const handleItemTypeChange = () => {
  formData.defaultValue = ''
  formData.normalTags = []
  formData.abnormalTags = []
  formData.max = ''
  formData.min = ''
  formData.unitNumber = ''
  formData.unitName = ''
  normalInput.value = ''
  abnormalInput.value = ''
}

const handleNeedTypeChange = (val: string) => {
  formData.needTypeText = eamEnumStore.getYesNoText(val)
}

const handleUnitChange = (val: string) => {
  const found = eamEnumStore.getParamsUnitList.find((item: any) => item.value === val)
  formData.unitName = found ? found.text : ''
}

// ==================== 弹窗控制 ====================
const open = (
  m: 'create' | 'edit',
  plan: PlanApi.PlanVo,
  presetType?: string,
  row?: PlanApi.PlanItemVo
) => {
  mode.value = m
  currentPlan.value = plan
  dialogVisible.value = true
  normalInput.value = ''
  abnormalInput.value = ''

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.itemName = ''
      formData.itemType = presetType || ''
      formData.normalTags = []
      formData.abnormalTags = []
      formData.max = ''
      formData.min = ''
      formData.defaultValue = ''
      formData.unitNumber = ''
      formData.unitName = ''
      formData.needTypeCode = '1'
      formData.needTypeText = eamEnumStore.getYesNoText('1')
      formData.checkStandard = ''
      formData.sort = 1
    } else if (row) {
      formData.id = row.id
      formData.itemName = row.itemName
      formData.itemType = row.itemType
      formData.normalTags = row.normal ? row.normal.split(',').filter((s) => s) : []
      formData.abnormalTags = row.abnormal ? row.abnormal.split(',').filter((s) => s) : []
      formData.max = row.max || ''
      formData.min = row.min || ''
      formData.defaultValue = row.defaultValue || ''
      formData.unitNumber = row.unitNumber || ''
      formData.unitName = row.unitName || ''
      formData.needTypeCode = row.needTypeCode || '1'
      formData.needTypeText = row.needTypeText || eamEnumStore.getYesNoText('1')
      formData.checkStandard = row.checkStandard || ''
      formData.sort = row.sort || 1
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 定量额外校验：上限 >= 下限
  if (formData.itemType === '定量') {
    if (parseFloat(formData.max) < parseFloat(formData.min)) {
      message.warning('上限值应大于等于下限值')
      return
    }
  }

  if (!currentPlan.value) {
    message.warning('未选中计划')
    return
  }

  submitLoading.value = true
  try {
    const data: PlanApi.PlanItemSaveDto = {
      planCode: currentPlan.value.code,
      itemName: formData.itemName,
      itemType: formData.itemType,
      needTypeCode: formData.needTypeCode,
      needTypeText: formData.needTypeText,
      checkStandard: formData.checkStandard || undefined,
      sort: formData.sort
    }

    if (formData.itemType === '定性') {
      data.normal = formData.normalTags.join(',')
      data.abnormal = formData.abnormalTags.join(',')
      data.defaultValue = formData.defaultValue
      data.max = ''
      data.min = ''
      data.unitNumber = ''
      data.unitName = ''
    } else if (formData.itemType === '定量') {
      data.max = formData.max
      data.min = formData.min
      data.defaultValue = formData.defaultValue
      data.unitNumber = formData.unitNumber
      data.unitName = formData.unitName
      data.normal = ''
      data.abnormal = ''
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

.tag-input-wrap {
  width: 100%;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  min-height: 24px;
  margin-bottom: 6px;
}
</style>
