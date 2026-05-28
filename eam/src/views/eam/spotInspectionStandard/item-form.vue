<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="750px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="检查项" prop="itemName">
            <el-input v-model="formData.itemName" maxlength="30" placeholder="请输入检查项" />
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

      <!-- 定性：正常项 -->
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
        <!-- 定性默认值：下拉（选项来源于正常项标签） -->
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
              placeholder="请选择必检项"
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
          <el-form-item label="序号" prop="sort">
            <el-input-number
              v-model="formData.sort"
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

      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="检查标准" prop="checkStandard">
            <el-input
              v-model="formData.checkStandard"
              type="textarea"
              :rows="4"
              maxlength="120"
              show-word-limit
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
import * as StandardApi from '@/api/eam/spotInspectionStandard'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'ItemForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()
const standardCode = ref('')

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
  // 如果默认值与被删除的标签相同，清空默认值
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

// ==================== 数值校验正则 ====================
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
  needTypeCode: '1',
  needTypeText: '是',
  sort: 1 as number,
  checkStandard: '',
  unitName: '',
  unitNumber: ''
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = {
    itemName: [{ required: true, message: '请输入检查项', trigger: 'blur' }],
    itemType: [{ required: true, message: '请选择定性/定量', trigger: 'change' }],
    needTypeCode: [{ required: true, message: '请选择必检项', trigger: 'change' }],
    sort: [{ required: true, message: '请输入序号', trigger: 'blur' }]
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
    rules.abnormalTags = [
      {
        validator: (_rule: any, _value: any, callback: any) => {
          if (formData.abnormalTags.length === 0) {
            callback(new Error('请至少输入一个异常项'))
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
  formData.unitName = ''
  formData.unitNumber = ''
  normalInput.value = ''
  abnormalInput.value = ''
}

const handleUnitChange = (val: string) => {
  if (!val) {
    formData.unitName = ''
    return
  }
  const found = eamEnumStore.getParamsUnitList.find((e) => e.value === val)
  formData.unitName = found?.text || ''
}

const handleNeedTypeChange = (val: string) => {
  const found = eamEnumStore.getYesNoList.find((e) => e.value === val)
  formData.needTypeText = found?.text || ''
}

// ==================== 弹窗控制 ====================
const open = (m: 'create' | 'edit', stdCode: string, row?: StandardApi.StandardItemVo) => {
  mode.value = m
  standardCode.value = stdCode
  dialogVisible.value = true
  normalInput.value = ''
  abnormalInput.value = ''

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.itemName = ''
      formData.itemType = ''
      formData.normalTags = []
      formData.abnormalTags = []
      formData.max = ''
      formData.min = ''
      formData.defaultValue = ''
      formData.needTypeCode = '1'
      formData.needTypeText = '是'
      formData.sort = 1
      formData.checkStandard = ''
      formData.unitName = ''
      formData.unitNumber = ''
    } else if (row) {
      formData.id = row.id
      formData.itemName = row.itemName
      formData.itemType = row.itemType
      formData.normalTags = row.normal ? row.normal.split(',').filter((s) => s) : []
      formData.abnormalTags = row.abnormal ? row.abnormal.split(',').filter((s) => s) : []
      formData.max = row.max || ''
      formData.min = row.min || ''
      formData.defaultValue = row.defaultValue || ''
      formData.needTypeCode = row.needTypeCode || '1'
      formData.needTypeText = row.needTypeText || '是'
      formData.sort = row.sort || 1
      formData.checkStandard = row.checkStandard || ''
      formData.unitName = row.unitName || ''
      formData.unitNumber = row.unitNumber || ''
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
      message.warning('上限值应大于下限值')
      return
    }
  }

  submitLoading.value = true
  try {
    const data: StandardApi.StandardItemSaveDto = {
      standardCode: standardCode.value,
      itemName: formData.itemName,
      itemType: formData.itemType,
      needTypeCode: formData.needTypeCode,
      needTypeText: formData.needTypeText,
      sort: formData.sort,
      checkStandard: formData.checkStandard
    }

    if (formData.itemType === '定性') {
      data.normal = formData.normalTags.join(',')
      data.abnormal = formData.abnormalTags.join(',')
      data.defaultValue = formData.defaultValue
      data.max = ''
      data.min = ''
      data.unitName = ''
      data.unitNumber = ''
    } else if (formData.itemType === '定量') {
      data.max = formData.max
      data.min = formData.min
      data.defaultValue = formData.defaultValue
      data.unitName = formData.unitName
      data.unitNumber = formData.unitNumber
      data.normal = ''
      data.abnormal = ''
    }

    if (mode.value === 'edit') {
      data.id = formData.id
      await StandardApi.updateStandardItem(data)
      message.success('编辑成功')
    } else {
      await StandardApi.createStandardItem(data)
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
