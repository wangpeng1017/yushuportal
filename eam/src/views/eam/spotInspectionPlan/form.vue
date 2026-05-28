<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="120px"
      :disabled="mode === 'view'"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="计划编号" prop="code">
            <el-input v-model="formData.code" disabled placeholder="系统自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划名称" prop="name">
            <el-input v-model="formData.name" maxlength="50" placeholder="请输入计划名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型" prop="equipmentTypeText">
            <div class="selector-wrap">
              <el-input
                v-model="formData.equipmentTypeText"
                readonly
                placeholder="请选择设备类型"
                class="selector-input"
              >
                <template #suffix>
                  <el-icon
                    v-if="formData.equipmentTypeText && mode !== 'view'"
                    class="clear-icon"
                    @click.stop="clearEquipmentType"
                  >
                    <CircleClose />
                  </el-icon>
                </template>
              </el-input>
              <el-button v-if="mode !== 'view'" type="primary" @click="openTypeSelector">
                选择
              </el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号" prop="equipmentModel">
            <el-select
              v-model="formData.equipmentModel"
              placeholder="请选择设备型号"
              clearable
              filterable
              class="w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getEquipmentModeList"
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
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择开始日期"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择结束日期"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="是否可跳过" prop="skipCode">
            <el-select v-model="formData.skipCode" placeholder="请选择" class="w-full">
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
          <el-form-item label="是否参数巡检" prop="hasParamPlan">
            <el-select
              v-model="formData.hasParamPlan"
              placeholder="请选择"
              class="w-full"
              @change="handleParamPlanChange"
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
          <el-form-item label="循环周期" prop="periodicFrequencyType">
            <el-select
              v-model="formData.periodicFrequencyType"
              placeholder="请选择循环周期"
              class="w-full"
              @change="handleFrequencyTypeChange"
            >
              <el-option
                v-for="item in frequencyTypeOptions"
                :key="item.type"
                :label="item.type"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启用状态" prop="status">
            <el-select
              v-model="formData.status"
              disabled
              placeholder="请选择启用状态"
              class="w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getSupplierStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 周期频率动态字段：oneStr -->
      <el-row v-if="currentFreqConfig" :gutter="20">
        <el-col :span="12">
          <el-form-item :label="currentFreqConfig.oneTitle" prop="oneStr">
            <!-- default 模式：单选 -->
            <el-select
              v-if="currentFreqConfig.oneMode === 'default'"
              v-model="formData.oneStr"
              :placeholder="'请选择' + currentFreqConfig.oneTitle"
              class="w-full"
            >
              <el-option
                v-for="opt in oneOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
            <!-- multiple 模式：多选 -->
            <el-select
              v-else
              v-model="formData.oneStrArr"
              :placeholder="'请选择' + currentFreqConfig.oneTitle"
              multiple
              class="w-full"
            >
              <el-option
                v-for="opt in oneOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- twoStr 字段：仅在每日/每班显示提前时间输入，每季度/每半年显示日期多选 -->
        <el-col v-if="showTwoField" :span="12">
          <el-form-item :label="currentFreqConfig.twoTitle" prop="twoStr">
            <!-- 每日/每班：提前生成时间(分)，数字输入 -->
            <el-input-number
              v-if="isTwoFieldNumber"
              v-model="formData.twoStr"
              :min="0"
              :max="1440"
              :precision="0"
              controls-position="right"
              class="w-full"
            />
            <!-- 每季度/每半年：日期多选 -->
            <el-select
              v-else
              v-model="formData.twoStrArr"
              :placeholder="'请选择' + currentFreqConfig.twoTitle"
              multiple
              class="w-full"
            >
              <el-option v-for="opt in twoOptions" :key="opt" :label="String(opt)" :value="opt" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="执行有效期(分)" prop="validityPeriod">
            <el-input-number
              v-model="formData.validityPeriod"
              :min="0"
              :max="999999"
              :precision="0"
              controls-position="right"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button
        v-if="mode !== 'view'"
        type="primary"
        :loading="submitLoading"
        @click="handleSubmit"
      >
        确 定
      </el-button>
    </template>

    <!-- 设备类型弹窗选择器 -->
    <TableSelectDialog
      ref="typeSelectorRef"
      title="选择设备类型"
      width="850px"
      :columns="typeColumns"
      :fetch-api="EquipmentApi.getEquipmentTypePage"
      :field-mapping="typeFieldMapping"
      :paginated="true"
      @select="handleTypeSelect"
    />
  </Dialog>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'
import * as PlanApi from '@/api/eam/spotInspectionPlan'
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'

defineOptions({ name: 'PlanForm' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()
const emit = defineEmits<{
  (e: 'success'): void
}>()

const dialogVisible = ref(false)
const submitLoading = ref(false)
const mode = ref<'create' | 'edit' | 'view'>('create')
const formRef = ref()

/** 记录编辑前的 hasParamPlan 值，用于检测切换 */
const prevHasParamPlan = ref('')

const dialogTitle = computed(() => {
  const map = { create: '新增-点巡检计划', edit: '编辑-点巡检计划', view: '查看-点巡检计划' }
  return map[mode.value]
})

// ==================== 周期频率类型数据 ====================
const frequencyTypeOptions = ref<PlanApi.PeriodicFrequencyTypeVo[]>([])

/** 加载周期频率类型字典 */
const loadFrequencyTypes = async () => {
  if (frequencyTypeOptions.value.length > 0) return
  try {
    frequencyTypeOptions.value = await PlanApi.queryDictItem()
  } catch {
    // 静默处理
  }
}

/** 当前选中的频率类型配置 */
const currentFreqConfig = computed(() => {
  if (!formData.periodicFrequencyType) return null
  return frequencyTypeOptions.value.find((o) => o.type === formData.periodicFrequencyType) || null
})

/** 是否显示 twoStr 字段 */
const showTwoField = computed(() => {
  if (!currentFreqConfig.value) return false
  const type = formData.periodicFrequencyType
  // 每日/每班：显示提前生成时间
  if (type === '每日' || type === '每班') return true
  // 每季度/每半年：显示日期多选
  if (currentFreqConfig.value.twoMode === 'multiple') return true
  return false
})

/** twoStr 字段是否为数字输入（每日/每班的提前生成时间） */
const isTwoFieldNumber = computed(() => {
  const type = formData.periodicFrequencyType
  return type === '每日' || type === '每班'
})

/** oneStr 选项列表 */
const oneOptions = computed(() => {
  if (!currentFreqConfig.value) return []
  const type = formData.periodicFrequencyType
  if (type === '每班') {
    // 每班特殊格式："Shift_A,白班" → { value: "Shift_A", label: "白班" }
    return currentFreqConfig.value.one.map((item) => {
      const parts = String(item).split(',')
      return { value: parts[0], label: parts[1] || parts[0] }
    })
  }
  return currentFreqConfig.value.one.map((item) => ({
    value: item,
    label: String(item)
  }))
})

/** twoStr 选项列表（每季度/每半年的日期） */
const twoOptions = computed(() => {
  if (!currentFreqConfig.value) return []
  return currentFreqConfig.value.two
})

// ==================== 表单数据 ====================
const formData = reactive({
  id: undefined as string | undefined,
  code: '',
  name: '',
  equipmentTypeCode: '',
  equipmentTypeText: '',
  equipmentModel: '' as string | undefined,
  startDate: '',
  endDate: '',
  skipCode: '0',
  hasParamPlan: '0',
  periodicFrequencyType: '',
  // 单选值（每日/每年/每季度/每半年的 oneMode=default）
  oneStr: undefined as string | number | undefined,
  // 多选值（每班/每周/每月的 oneMode=multiple）
  oneStrArr: [] as (string | number)[],
  // 数字值（每日/每班的提前生成时间）
  twoStr: 0 as number,
  // 多选值（每季度/每半年的日期）
  twoStrArr: [] as number[],
  validityPeriod: undefined as number | undefined,
  status: '0'
})

const formRules = computed(() => {
  const rules: Record<string, any[]> = {
    name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
    equipmentTypeText: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
    startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
    endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
    skipCode: [{ required: true, message: '请选择是否可跳过', trigger: 'change' }],
    hasParamPlan: [{ required: true, message: '请选择是否参数巡检', trigger: 'change' }],
    periodicFrequencyType: [{ required: true, message: '请选择循环周期', trigger: 'change' }],
    status: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
    validityPeriod: [{ required: true, message: '请输入执行有效期', trigger: 'change' }]
  }
  // 参数巡检时设备型号必填
  if (formData.hasParamPlan === '1') {
    rules.equipmentModel = [
      { required: true, message: '参数巡检时设备型号必填', trigger: 'change' }
    ]
  }
  // oneStr 必填验证
  if (currentFreqConfig.value) {
    if (currentFreqConfig.value.oneMode === 'default') {
      rules.oneStr = [
        { required: true, message: '请选择' + currentFreqConfig.value.oneTitle, trigger: 'change' }
      ]
    } else {
      rules.oneStr = [
        {
          validator: (_rule: any, _value: any, callback: any) => {
            if (formData.oneStrArr.length === 0) {
              callback(new Error('请选择' + currentFreqConfig.value!.oneTitle))
            } else {
              callback()
            }
          },
          trigger: 'change'
        }
      ]
    }
    // twoStr 验证
    if (showTwoField.value) {
      if (isTwoFieldNumber.value) {
        rules.twoStr = [
          {
            required: true,
            message: '请输入' + currentFreqConfig.value.twoTitle,
            trigger: 'change'
          }
        ]
      } else {
        rules.twoStr = [
          {
            validator: (_rule: any, _value: any, callback: any) => {
              if (formData.twoStrArr.length === 0) {
                callback(new Error('请选择' + currentFreqConfig.value!.twoTitle))
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  }
  return rules
})

// ==================== 设备类型选择器 ====================
const typeSelectorRef = ref()

const typeColumns: TableColumn[] = [
  { prop: 'typeCode', label: '设备类型编码', width: 140, searchable: true },
  { prop: 'typeName', label: '设备类型名称', minWidth: 150, searchable: true },
  { prop: 'categoryCode', label: '设备分类编号', width: 120 },
  { prop: 'categoryName', label: '设备分类名称', minWidth: 120 }
]

const typeFieldMapping: FieldMapping[] = [
  { from: 'typeCode', to: 'equipmentTypeCode' },
  { from: 'typeName', to: 'equipmentTypeText' }
]

const openTypeSelector = () => {
  typeSelectorRef.value?.open()
}

const handleTypeSelect = (_row: any, mapped: Record<string, any>) => {
  formData.equipmentTypeCode = mapped.equipmentTypeCode
  formData.equipmentTypeText = mapped.equipmentTypeText
}

const clearEquipmentType = () => {
  formData.equipmentTypeCode = ''
  formData.equipmentTypeText = ''
}

// ==================== 是否参数巡检切换 ====================
const handleParamPlanChange = async (val: string) => {
  // 编辑模式下，从"否"切换到"是"时弹出确认
  if (mode.value === 'edit' && val === '1' && prevHasParamPlan.value === '0') {
    try {
      await ElMessageBox.confirm('切换为参数巡检后将清空现有检查项，是否继续？', '提示', {
        type: 'warning'
      })
      // 用户确认，继续
    } catch {
      // 用户取消，恢复原值
      formData.hasParamPlan = prevHasParamPlan.value
    }
  }
}

// ==================== 循环周期切换 ====================
const handleFrequencyTypeChange = () => {
  // 切换类型时重置动态字段
  formData.oneStr = undefined
  formData.oneStrArr = []
  formData.twoStr = 0
  formData.twoStrArr = []
}

// ==================== 周期频率拼装与解析 ====================

/**
 * 将 oneStr/twoStr 拼装为 periodicFrequency 字符串
 *
 * 格式说明：
 * - 每日：   oneStr(数组) 中每个值与 twoStr 配对 → "hour-minute,hour-minute"
 * - 每班：   oneStr(数组) 中每个班次与 twoStr 配对 → "Shift_A-minute,Shift_B-minute"
 * - 每周/每月/每年：oneStr(数组) 直接逗号拼接 → "1,3,5"
 * - 每季度/每半年：oneStr(数组)×twoStr(数组) 笛卡尔积 → "month-day,month-day"
 */
const assemblePeriodicFrequency = (): string => {
  const type = formData.periodicFrequencyType
  const isDefault = currentFreqConfig.value?.oneMode === 'default'
  // 统一转为数组
  const oneArr: (string | number)[] = isDefault
    ? formData.oneStr !== undefined && formData.oneStr !== ''
      ? [formData.oneStr]
      : []
    : [...formData.oneStrArr]

  if (type === '每日' || type === '每班') {
    // oneArr 中每个值配对 twoStr(提前时间)
    return oneArr.map((v) => v + '-' + formData.twoStr).join(',')
  }
  if (currentFreqConfig.value?.twoMode === 'multiple' && formData.twoStrArr.length > 0) {
    // 每季度/每半年：笛卡尔积
    const parts: string[] = []
    oneArr.forEach((one) => {
      formData.twoStrArr.forEach((two) => {
        parts.push(one + '-' + two)
      })
    })
    return parts.join(',')
  }
  // 每周/每月/每年：直接拼接
  return oneArr.join(',')
}

/**
 * 将 periodicFrequency 字符串解析回 oneStr/twoStr
 */
const parsePeriodicFrequency = (freq: string, type: string) => {
  if (!freq) return
  const config = frequencyTypeOptions.value.find((o) => o.type === type)
  if (!config) return

  if (type === '每日') {
    // "8-30" → oneStr=[8], twoStr=30
    const arr1: number[] = []
    let arr2 = 0
    freq.split(',').forEach((n) => {
      const parts = n.split('-')
      const v = parseInt(parts[0])
      if (!arr1.includes(v)) arr1.push(v)
      arr2 = parseInt(parts[1]) || 0
    })
    // 每日 oneMode=default → 单选
    formData.oneStr = arr1[0]
    formData.oneStrArr = []
    formData.twoStr = arr2
    formData.twoStrArr = []
  } else if (type === '每班') {
    // "Shift_A-30,Shift_B-30" → oneStrArr=["Shift_A","Shift_B"], twoStr=30
    const arr1: string[] = []
    let arr2 = 0
    freq.split(',').forEach((n) => {
      const parts = n.split('-')
      if (!arr1.includes(parts[0])) arr1.push(parts[0])
      arr2 = parseInt(parts[1]) || 0
    })
    formData.oneStr = undefined
    formData.oneStrArr = arr1
    formData.twoStr = arr2
    formData.twoStrArr = []
  } else if (config.twoMode === 'multiple' && config.two.length > 0) {
    // 每季度/每半年："2-15,2-28" → oneStr=[2], twoStrArr=[15,28]
    const arr1: number[] = []
    const arr2: number[] = []
    freq.split(',').forEach((n) => {
      const parts = n.split('-')
      const v1 = parseInt(parts[0])
      const v2 = parseInt(parts[1])
      if (!arr1.includes(v1)) arr1.push(v1)
      if (!arr2.includes(v2)) arr2.push(v2)
    })
    // oneMode=default → 单选
    formData.oneStr = arr1[0]
    formData.oneStrArr = []
    formData.twoStr = 0
    formData.twoStrArr = arr2
  } else {
    // 每周/每月/每年："1,3,5" → oneStrArr=[1,3,5]
    const arr: number[] = []
    freq.split(',').forEach((n) => {
      if (n) arr.push(parseInt(n))
    })
    if (config.oneMode === 'default') {
      formData.oneStr = arr[0]
      formData.oneStrArr = []
    } else {
      formData.oneStr = undefined
      formData.oneStrArr = arr
    }
    formData.twoStr = 0
    formData.twoStrArr = []
  }
}

// ==================== 弹窗控制 ====================
const open = async (m: 'create' | 'edit' | 'view', row?: PlanApi.PlanVo) => {
  mode.value = m
  dialogVisible.value = true
  await loadFrequencyTypes()

  nextTick(() => {
    formRef.value?.clearValidate()
    if (m === 'create') {
      formData.id = undefined
      formData.code = ''
      formData.name = ''
      formData.equipmentTypeCode = ''
      formData.equipmentTypeText = ''
      formData.equipmentModel = undefined
      formData.startDate = ''
      formData.endDate = ''
      formData.skipCode = '0'
      formData.hasParamPlan = '0'
      formData.periodicFrequencyType = ''
      formData.oneStr = undefined
      formData.oneStrArr = []
      formData.twoStr = 0
      formData.twoStrArr = []
      formData.validityPeriod = undefined
      formData.status = '0'
      prevHasParamPlan.value = '0'
    } else if (row) {
      formData.id = row.id
      formData.code = row.code
      formData.name = row.name
      formData.equipmentTypeCode = row.equipmentTypeCode
      formData.equipmentTypeText = row.equipmentTypeText
      formData.equipmentModel = row.equipmentModel || undefined
      formData.startDate = row.startDate
      formData.endDate = row.endDate
      formData.skipCode = row.skipCode || '0'
      formData.hasParamPlan = row.hasParamPlan || '0'
      formData.periodicFrequencyType = row.periodicFrequencyType || ''
      formData.validityPeriod = row.validityPeriod || undefined
      formData.status = row.status || '0'
      prevHasParamPlan.value = row.hasParamPlan || '0'
      // 解析周期频率回填
      parsePeriodicFrequency(row.periodicFrequency, row.periodicFrequencyType)
    }
  })
}

// ==================== 提交 ====================
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 拼装 periodicFrequency
  const periodicFrequency = assemblePeriodicFrequency()
  if (!periodicFrequency) {
    message.warning('请完善循环周期参数')
    return
  }

  // 获取 skipText
  const skipText = eamEnumStore.getYesNoText(formData.skipCode)

  submitLoading.value = true
  try {
    const data: PlanApi.PlanSaveDto = {
      name: formData.name,
      equipmentTypeCode: formData.equipmentTypeCode,
      equipmentTypeText: formData.equipmentTypeText,
      equipmentModel: formData.equipmentModel,
      startDate: formData.startDate,
      endDate: formData.endDate,
      skipCode: formData.skipCode,
      skipText: skipText,
      periodicFrequencyType: formData.periodicFrequencyType,
      periodicFrequency: periodicFrequency,
      hasParamPlan: formData.hasParamPlan,
      validityPeriod: formData.validityPeriod,
      status: formData.status
    }
    if (mode.value === 'edit') {
      data.id = formData.id
      data.code = formData.code
      await PlanApi.updatePlan(data)
      message.success('编辑成功')
    } else {
      await PlanApi.createPlan(data)
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

.selector-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}

.selector-input {
  flex: 1;
}

.clear-icon {
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}
</style>
