<template>
  <Dialog v-model="dialogVisible" title="执行任务" width="95%" top="3vh">
    <!-- ==================== 基本信息 ==================== -->
    <div class="section-title">基本信息</div>
    <el-form :model="formData" label-width="90px" class="info-form">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="设备编号">
            <el-input v-model="formData.deviceSn" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称">
            <el-input v-model="formData.deviceName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型">
            <el-input v-model="formData.equipmentTypeDesc" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">
            <el-input v-model="formData.equipmentSupplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备型号">
            <el-input v-model="formData.deviceMode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间">
            <el-date-picker
              v-model="formData.startTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择开始时间"
              class="w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-date-picker
              v-model="formData.endTime"
              type="datetime"
              format="YYYY-MM-DD HH:mm:ss"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择结束时间"
              class="w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="图片">
            <el-tooltip content="最多上传9张图片，仅支持 jpg、png、gif 格式" placement="top">
              <UploadImgs v-model="formData.attachmentUrls" :limit="9" :drag="false" />
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider />

    <!-- ==================== 检查项列表 ==================== -->
    <div class="section-title">检查项</div>
    <el-table
      v-loading="itemLoading"
      :data="itemList"
      :stripe="true"
      :show-overflow-tooltip="false"
      border
    >
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="检查项名称" align="center" prop="itemName" min-width="200" />
      <el-table-column label="是否必检项" align="center" prop="needTypeText" width="100">
        <template #default="scope">
          {{ eamEnumStore.getYesNoText(scope.row.needTypeCode) || scope.row.needTypeText }}
        </template>
      </el-table-column>
      <el-table-column label="上限" align="center" prop="max" width="80">
        <template #default="scope">{{ scope.row.max || '--' }}</template>
      </el-table-column>
      <el-table-column label="下限" align="center" prop="min" width="80">
        <template #default="scope">{{ scope.row.min || '--' }}</template>
      </el-table-column>
      <el-table-column label="默认值" align="center" prop="defaultValue" width="80">
        <template #default="scope">{{ scope.row.defaultValue || '--' }}</template>
      </el-table-column>
      <el-table-column label="单位" align="center" prop="unitName" width="70">
        <template #default="scope">{{ scope.row.unitName || '--' }}</template>
      </el-table-column>
      <el-table-column label="检查记录" min-width="260">
        <template #default="scope">
          <!-- 定性：radio-group 正常项 + 异常项 -->
          <div v-if="scope.row.itemType === '定性'" class="check-record-qualitative">
            <div v-if="scope.row.normal" class="radio-row">
              <span class="radio-label normal-label">正常项：</span>
              <el-radio-group v-model="scope.row._checkValue" class="radio-group-inline">
                <el-radio
                  v-for="opt in splitOptions(scope.row.normal)"
                  :key="'n-' + opt"
                  :value="opt"
                  class="radio-option"
                >
                  {{ opt }}
                </el-radio>
              </el-radio-group>
            </div>
            <div v-if="scope.row.abnormal" class="radio-row">
              <span class="radio-label abnormal-label">异常项：</span>
              <el-radio-group v-model="scope.row._checkValue" class="radio-group-inline">
                <el-radio
                  v-for="opt in splitOptions(scope.row.abnormal)"
                  :key="'a-' + opt"
                  :value="opt"
                  class="radio-option"
                >
                  {{ opt }}
                </el-radio>
              </el-radio-group>
            </div>
          </div>
          <!-- 定量：input 输入框 -->
          <div v-else-if="scope.row.itemType === '定量'" class="check-record-quantitative">
            <el-input v-model="scope.row._checkValue" placeholder="请输入检测值" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="检查结果" align="center" prop="checkResult" width="100" />
      <el-table-column label="排序" align="center" prop="sort" width="60" />
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template #default="scope">
          <el-button link class="btn-edit" @click="handleSaveItem(scope.row)">
            &nbsp;保存
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="itemTotal"
      v-model:page="itemQueryParams.pageNo"
      v-model:limit="itemQueryParams.pageSize"
      @pagination="getItemList"
    />

    <div class="footer-bar">
      <el-button plain type="primary" @click="dialogVisible = false">关 闭</el-button>
      <el-button type="primary" @click="handleSaveStandard">保 存</el-button>
      <el-button type="primary" @click="handleComplete">完成工单</el-button>
    </div>
  </Dialog>

  <!-- ==================== 完成工单二次确认弹窗 ==================== -->
  <Dialog v-model="confirmDialogVisible" title="完成工单确认" width="400px">
    <el-form :model="confirmForm" :rules="confirmRules" ref="confirmFormRef" label-width="80px">
      <!-- 班次/班组已删除，不迁移 -->
      <el-form-item label="完成日期" prop="completeDate">
        <el-date-picker
          v-model="confirmForm.completeDate"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择完成日期"
          :disabled-date="disableDateFn"
          class="!w-260px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="confirmDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirmComplete">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import * as WorkApi from '@/api/eam/spotInspectionWork'
import { useEamEnumStore } from '@/store/modules/enums'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'EamSpotInspectionWorkExecForm' })

const emit = defineEmits<{
  (e: 'success'): void
}>()

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const currentStandard = ref<WorkApi.WorkStandardVo | null>(null)
const currentWork = ref<WorkApi.WorkVo | null>(null)

// ==================== 基本信息表单 ====================
const formData = reactive({
  id: '',
  deviceSn: '',
  deviceName: '',
  equipmentTypeDesc: '',
  equipmentSupplierName: '',
  deviceMode: '',
  startTime: '',
  endTime: '',
  attachmentUrls: [] as string[]
})

// ==================== 检查项列表 ====================
const itemLoading = ref(false)
const itemTotal = ref(0)
const itemList = ref<any[]>([])
const itemQueryParams = reactive({ pageNo: 1, pageSize: 50 })

/** 打开弹窗 */
const open = async (standard: WorkApi.WorkStandardVo, work: WorkApi.WorkVo) => {
  currentStandard.value = standard
  currentWork.value = work
  dialogVisible.value = true

  // 从后端接口获取最新基本信息
  try {
    const latest = await WorkApi.getWorkStandardById(standard.id)
    if (latest) {
      currentStandard.value = latest
      formData.id = latest.id
      formData.deviceSn = latest.deviceSn || ''
      formData.deviceName = latest.deviceName || ''
      formData.equipmentTypeDesc = latest.equipmentTypeDesc || ''
      formData.equipmentSupplierName = latest.equipmentSupplierName || ''
      formData.deviceMode = latest.deviceMode || ''
      formData.startTime = latest.startTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
      formData.endTime = latest.endTime || dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
      formData.attachmentUrls = latest.attachments ? latest.attachments.split(',') : []
    }
  } catch {
    // 接口异常时降级使用传入数据
    formData.id = standard.id
    formData.deviceSn = standard.deviceSn || ''
    formData.deviceName = standard.deviceName || ''
    formData.equipmentTypeDesc = standard.equipmentTypeDesc || ''
    formData.equipmentSupplierName = standard.equipmentSupplierName || ''
    formData.deviceMode = standard.deviceMode || ''
    formData.startTime = standard.startTime || dayjs().format('YYYY-MM-DD HH:mm:ss')
    formData.endTime = standard.endTime || dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
    formData.attachmentUrls = standard.attachments ? standard.attachments.split(',') : []
  }

  // 加载检查项
  itemQueryParams.pageNo = 1
  getItemList()
}

const getItemList = async () => {
  if (!currentStandard.value) return
  itemLoading.value = true
  try {
    const res = await WorkApi.getWorkStandardItemPage({
      pageNo: itemQueryParams.pageNo,
      pageSize: itemQueryParams.pageSize,
      workStandardId: currentStandard.value.id
    })
    const records = res.records ?? []
    // 初始化 _checkValue 用于双向绑定
    itemList.value = records.map((item: any) => ({
      ...item,
      _checkValue: item.checkRecord || item.defaultValue || ''
    }))
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

// ==================== 工具方法 ====================
const splitOptions = (str: string): string[] => {
  if (!str) return []
  return str.split(',').filter((s) => s.trim())
}

// ==================== 单条检查项保存 ====================
const handleSaveItem = async (row: any) => {
  if (!row._checkValue) {
    message.warning('请先填写检查记录')
    return
  }
  try {
    const data: Record<string, any> = {
      id: row.id,
      itemName: row.itemName,
      itemType: row.itemType,
      needTypeCode: row.needTypeCode,
      needTypeText: row.needTypeText,
      defaultValue: row.defaultValue,
      checkRecord: row._checkValue,
      workStandardId: row.workStandardId
    }
    if (row.itemType === '定性') {
      data.abnormal = row.abnormal
      data.normal = row.normal
    } else {
      data.max = row.max
      data.min = row.min
      data.paramsUnit = row.paramsUnit
    }
    await WorkApi.updateWorkStandardItem(data)
    message.success('保存成功')
    getItemList()
  } catch {
    // API 异常
  }
}

// ==================== 保存（仅保存开始/结束时间） ====================
const handleSaveStandard = async () => {
  if (!formData.startTime || !formData.endTime) {
    message.warning('请填写开始时间和结束时间')
    return
  }
  try {
    await WorkApi.updateWorkStandard({
      id: formData.id,
      startTime: formData.startTime,
      endTime: formData.endTime,
      attachments: formData.attachmentUrls.length > 0 ? formData.attachmentUrls.join(',') : ''
    })
    message.success('保存成功')
  } catch {
    // API 异常
  }
}

// ==================== 完成工单 ====================
const confirmDialogVisible = ref(false)
const confirmFormRef = ref()
const confirmForm = reactive({
  completeDate: dayjs().format('YYYY-MM-DD')
})
const confirmRules = {
  completeDate: [{ required: true, message: '请选择完成日期', trigger: 'change' }]
}

/** 只允许选择今天或昨天 */
const disableDateFn = (date: Date) => {
  const today = dayjs().startOf('day')
  const yesterday = today.subtract(1, 'day')
  const d = dayjs(date).startOf('day')
  return d.isBefore(yesterday) || d.isAfter(today)
}

const handleComplete = () => {
  // 校验必检项
  const required = itemList.value.filter(
    (item) => item.needTypeCode === '1' || item.needTypeText === '是'
  )
  const incomplete = required.filter((item) => !item._checkValue && !item.checkRecord)
  if (incomplete.length > 0) {
    const names = incomplete.map((i) => i.itemName).join('、')
    message.warning(`以下必检项未完成：${names}`)
    return
  }
  if (!formData.startTime || !formData.endTime) {
    message.warning('请填写开始时间和结束时间')
    return
  }
  confirmForm.completeDate = dayjs().format('YYYY-MM-DD')
  confirmDialogVisible.value = true
}

const handleConfirmComplete = async () => {
  await confirmFormRef.value?.validate()
  try {
    await WorkApi.saveWorkStandard({
      id: formData.id,
      startTime: formData.startTime,
      endTime: formData.endTime,
      completeDate: confirmForm.completeDate,
      attachments: formData.attachmentUrls.length > 0 ? formData.attachmentUrls.join(',') : '',
      // 班次/班组已删除，传空字符串
      teamCode: '',
      teamName: '',
      shiftCode: '',
      shiftName: ''
    })
    message.success('工单完成')
    confirmDialogVisible.value = false
    dialogVisible.value = false
    emit('success')
  } catch {
    // API 异常
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.section-title {
  padding-left: 2px;
  margin-bottom: 14px;
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.info-form {
  :deep(.el-form-item__label) {
    font-weight: bold;
  }

  :deep(.el-form-item) {
    margin-bottom: 14px;
  }

  :deep(.el-input.is-disabled .el-input__wrapper) {
    background-color: #f5f7fa;
  }

  :deep(.el-date-editor.w-full) {
    width: 100%;
  }
}

.check-record-qualitative {
  padding: 4px 0;

  .radio-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: 4px;
    gap: 4px;
  }

  .radio-label {
    min-width: 56px;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;

    &.normal-label {
      color: #67c23a;
    }

    &.abnormal-label {
      color: #f56c6c;
    }
  }

  .radio-group-inline {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }

  .radio-option {
    margin-right: 0;
  }
}

.footer-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  clear: both;
}

// 操作列按钮样式
:deep(.el-button.btn-edit) {
  color: #0097ba;

  &:hover {
    color: rgb(0 151 186 / 75%);
  }
}
</style>
