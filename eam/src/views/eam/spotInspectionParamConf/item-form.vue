<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="参数分组" prop="paramsGroup">
            <el-input v-model="formData.paramsGroup" maxlength="10" placeholder="请输入参数分组" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数分组描述" prop="paramsGroupDesc">
            <el-input v-model="formData.paramsGroupDesc" maxlength="20" placeholder="请输入参数分组描述" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="参数key" prop="paramsKey">
            <el-input v-model="formData.paramsKey" maxlength="10" placeholder="请输入参数key" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="参数描述" prop="paramsDesc">
            <el-input v-model="formData.paramsDesc" maxlength="20" placeholder="请输入参数描述" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
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
          <el-form-item label="上限值" prop="upLimit">
            <el-input v-model="formData.upLimit" placeholder="请输入上限值" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="下限值" prop="lowerLimit">
            <el-input v-model="formData.lowerLimit" placeholder="请输入下限值" />
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
          <el-form-item label="单位" prop="paramsUnit">
            <el-select
              v-model="formData.paramsUnit"
              placeholder="请选择单位"
              clearable
              class="w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getParamsUnitList"
                :key="item.value"
                :label="item.text"
                :value="item.text"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否巡检项" prop="sipItem">
            <el-select
              v-model="formData.sipItem"
              placeholder="请选择"
              class="w-full"
              @change="handleSipItemChange"
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
          <el-form-item label="是否自动巡检" prop="autoSip">
            <el-select
              v-model="formData.autoSip"
              placeholder="请选择"
              class="w-full"
              @change="handleAutoSipChange"
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
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序" prop="sortNo">
            <el-input-number
              v-model="formData.sortNo"
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
import * as ParamConfApi from '@/api/eam/spotInspectionParamConf'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'ParamItemForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit'>('create')
const formRef = ref()
const currentConf = ref<ParamConfApi.ParamConfVo | null>(null)

const dialogTitle = computed(() => {
  return mode.value === 'create' ? '新增参数项' : '编辑参数项'
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
  paramsGroup: '',
  paramsGroupDesc: '',
  paramsKey: '',
  paramsDesc: '',
  itemType: '' as string,
  normalTags: [] as string[],
  abnormalTags: [] as string[],
  upLimit: '',
  lowerLimit: '',
  defaultValue: '',
  paramsUnit: '',
  needTypeCode: '1',
  needTypeText: '是',
  sipItem: '1',
  sipItemDesc: '是',
  autoSip: '0',
  autoSipDesc: '否',
  sortNo: 1 as number
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = {
    paramsKey: [{ required: true, message: '请输入参数key', trigger: 'blur' }],
    paramsDesc: [{ required: true, message: '请输入参数描述', trigger: 'blur' }],
    itemType: [{ required: true, message: '请选择定性/定量', trigger: 'change' }],
    needTypeCode: [{ required: true, message: '请选择必检项', trigger: 'change' }],
    sipItem: [{ required: true, message: '请选择是否巡检项', trigger: 'change' }],
    autoSip: [{ required: true, message: '请选择是否自动巡检', trigger: 'change' }],
    sortNo: [{ required: true, message: '请输入排序', trigger: 'blur' }]
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
    rules.upLimit = [{ validator: validateNumber, trigger: 'blur' }]
    rules.lowerLimit = [{ validator: validateNumber, trigger: 'blur' }]
    rules.defaultValue = [{ validator: validateOptionalNumber, trigger: 'blur' }]
  }

  return rules
})

// ==================== 联动处理 ====================
const handleItemTypeChange = () => {
  formData.defaultValue = ''
  formData.normalTags = []
  formData.abnormalTags = []
  formData.upLimit = ''
  formData.lowerLimit = ''
  formData.paramsUnit = ''
  normalInput.value = ''
  abnormalInput.value = ''
}

const handleNeedTypeChange = (val: string) => {
  formData.needTypeText = eamEnumStore.getYesNoText(val)
}

const handleSipItemChange = (val: string) => {
  formData.sipItemDesc = eamEnumStore.getYesNoText(val)
}

const handleAutoSipChange = (val: string) => {
  formData.autoSipDesc = eamEnumStore.getYesNoText(val)
}

// ==================== 弹窗控制 ====================
const open = (
  m: 'create' | 'edit',
  mainConf: ParamConfApi.ParamConfVo,
  row?: ParamConfApi.ParamItemVo
) => {
  mode.value = m
  currentConf.value = mainConf
  dialogVisible.value = true
  normalInput.value = ''
  abnormalInput.value = ''

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.paramsGroup = ''
      formData.paramsGroupDesc = ''
      formData.paramsKey = ''
      formData.paramsDesc = ''
      formData.itemType = ''
      formData.normalTags = []
      formData.abnormalTags = []
      formData.upLimit = ''
      formData.lowerLimit = ''
      formData.defaultValue = ''
      formData.paramsUnit = ''
      formData.needTypeCode = '1'
      formData.needTypeText = eamEnumStore.getYesNoText('1')
      formData.sipItem = '1'
      formData.sipItemDesc = eamEnumStore.getYesNoText('1')
      formData.autoSip = '0'
      formData.autoSipDesc = eamEnumStore.getYesNoText('0')
      formData.sortNo = 1
    } else if (row) {
      formData.id = row.id
      formData.paramsGroup = row.paramsGroup || ''
      formData.paramsGroupDesc = row.paramsGroupDesc || ''
      formData.paramsKey = row.paramsKey
      formData.paramsDesc = row.paramsDesc
      formData.itemType = row.itemType
      formData.normalTags = row.normal ? row.normal.split(',').filter((s) => s) : []
      formData.abnormalTags = row.abnormal ? row.abnormal.split(',').filter((s) => s) : []
      formData.upLimit = row.upLimit || ''
      formData.lowerLimit = row.lowerLimit || ''
      formData.defaultValue = row.defaultValue || ''
      formData.paramsUnit = row.paramsUnit || ''
      formData.needTypeCode = row.needTypeCode || '1'
      formData.needTypeText = row.needTypeText || eamEnumStore.getYesNoText('1')
      formData.sipItem = row.sipItem || '1'
      formData.sipItemDesc = row.sipItemDesc || eamEnumStore.getYesNoText('1')
      formData.autoSip = row.autoSip || '0'
      formData.autoSipDesc = row.autoSipDesc || eamEnumStore.getYesNoText('0')
      formData.sortNo = row.sortNo || 1
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 定量额外校验：上限 >= 下限
  if (formData.itemType === '定量') {
    if (parseFloat(formData.upLimit) < parseFloat(formData.lowerLimit)) {
      message.warning('上限值应大于下限值')
      return
    }
  }

  if (!currentConf.value) {
    message.warning('未选中配置')
    return
  }

  submitLoading.value = true
  try {
    const data: ParamConfApi.ParamItemSaveDto = {
      confId: currentConf.value.id,
      deviceType: currentConf.value.deviceType,
      deviceTypeDesc: currentConf.value.deviceTypeDesc,
      deviceSupCode: currentConf.value.deviceSupCode,
      deviceSupName: currentConf.value.deviceSupName,
      deviceModel: currentConf.value.deviceModel,
      paramsGroup: formData.paramsGroup || undefined,
      paramsGroupDesc: formData.paramsGroupDesc || undefined,
      paramsKey: formData.paramsKey,
      paramsDesc: formData.paramsDesc,
      itemType: formData.itemType,
      needTypeCode: formData.needTypeCode,
      needTypeText: formData.needTypeText,
      sipItem: formData.sipItem,
      sipItemDesc: formData.sipItemDesc,
      autoSip: formData.autoSip,
      autoSipDesc: formData.autoSipDesc,
      sortNo: formData.sortNo
    }

    if (formData.itemType === '定性') {
      data.normal = formData.normalTags.join(',')
      data.abnormal = formData.abnormalTags.join(',')
      data.defaultValue = formData.defaultValue
      data.upLimit = ''
      data.lowerLimit = ''
      data.paramsUnit = ''
    } else if (formData.itemType === '定量') {
      data.upLimit = formData.upLimit
      data.lowerLimit = formData.lowerLimit
      data.defaultValue = formData.defaultValue
      data.paramsUnit = formData.paramsUnit
      data.normal = ''
      data.abnormal = ''
    }

    if (mode.value === 'edit') {
      data.id = formData.id
      await ParamConfApi.updateParamItem(data)
      message.success('编辑成功')
    } else {
      await ParamConfApi.createParamItem(data)
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
