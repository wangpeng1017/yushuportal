<template>
  <Dialog v-model="dialogVisible" title="查看-保养记录" width="1100px">
    <el-form ref="formRef" :model="formData" label-width="130px" disabled>
      <!-- ==================== 基础信息 ==================== -->
      <div class="section-title">基础信息</div>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备编号">
            <el-input v-model="formData.equipmentSn" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="设备类型">
            <el-input v-model="formData.equipmentTypeDesc" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="设备型号">
            <el-input v-model="formData.equipmentModel" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商">
            <el-input v-model="formData.equipmentSupplierName" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养级别">
            <el-select v-model="formData.maintenanceLevel" class="w-full">
              <el-option
                v-for="item in eamEnumStore.getMaintenanceLevelList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="计划开始时间">
            <el-input v-model="formData.workStartTime" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划结束时间">
            <el-input v-model="formData.overdueTime" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养人">
            <el-input v-model="formData.personName" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ==================== 处理情况 ==================== -->
      <div class="section-title">处理情况</div>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养状态">
            <el-select v-model="formData.status" class="w-full">
              <el-option
                v-for="item in eamEnumStore.getMaintenanceWorkStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否更换备件">
            <el-input v-model="formData.needReplSparePartText" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="保养开始时间">
            <el-input v-model="formData.startTime" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养结束时间">
            <el-input v-model="formData.endTime" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="保养用时">
            <div class="use-time-wrap">
              <el-input-number
                v-model="useTimeHours"
                :min="0"
                :precision="0"
                controls-position="right"
                class="use-time-input"
              />
              <span class="use-time-unit">小时</span>
              <el-input-number
                v-model="useTimeMinutes"
                :min="0"
                :max="59"
                :precision="0"
                controls-position="right"
                class="use-time-input"
              />
              <span class="use-time-unit">分</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="16">
          <el-form-item label="描述">
            <el-input v-model="formData.remark" type="textarea" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- ==================== 保养标准子表（只读） ==================== -->
    <div class="item-section">
      <div class="item-section-header">保养标准</div>
      <el-table
        v-loading="itemLoading"
        :data="itemList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="保养部位" align="center" prop="maintenancePart" min-width="200" />
        <el-table-column label="保养标准" align="center" prop="remark" min-width="200" />
        <el-table-column label="排序" align="center" prop="seq" width="80" />
      </el-table>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as RecordApi from '@/api/eam/maintenanceWorkRecord'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'MaintenanceWorkRecordDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const formRef = ref()

// ==================== 表单数据 ====================
const formData = reactive({
  equipmentSn: '',
  equipmentName: '',
  equipmentTypeDesc: '',
  equipmentModel: '',
  equipmentSupplierName: '',
  maintenanceLevel: '' as string | undefined,
  workStartTime: '' as string | undefined,
  overdueTime: '' as string | undefined,
  personName: '',
  status: '',
  needReplSparePartText: '',
  startTime: '' as string | undefined,
  endTime: '' as string | undefined,
  useTime: undefined as number | undefined,
  remark: ''
})

/** 保养用时拆分为小时和分钟 */
const useTimeHours = computed(() => {
  if (formData.useTime == null) return 0
  return Math.floor(formData.useTime / 60)
})
const useTimeMinutes = computed(() => {
  if (formData.useTime == null) return 0
  return formData.useTime % 60
})

// ==================== 保养标准子表 ====================
const itemLoading = ref(false)
const itemList = ref<RecordApi.WorkRecordItemVo[]>([])

const loadItems = async (workCode: string) => {
  itemLoading.value = true
  try {
    const res = await RecordApi.getWorkRecordItemPage({
      pageNo: 1,
      pageSize: 1000,
      workCode
    })
    itemList.value = res?.records ?? []
  } catch {
    itemList.value = []
  } finally {
    itemLoading.value = false
  }
}

// ==================== 弹窗控制 ====================
const open = async (row: RecordApi.WorkRecordVo) => {
  dialogVisible.value = true
  itemList.value = []

  // 填充表单
  formData.equipmentSn = row.equipmentSn || ''
  formData.equipmentName = row.equipmentName || ''
  formData.equipmentTypeDesc = row.equipmentTypeDesc || ''
  formData.equipmentModel = row.equipmentModel || ''
  formData.equipmentSupplierName = row.equipmentSupplierName || ''
  formData.maintenanceLevel = row.maintenanceLevel || undefined
  formData.workStartTime = row.workStartTime || undefined
  formData.overdueTime = row.overdueTime || undefined
  formData.personName = row.personName || ''
  formData.status = row.status || ''
  formData.needReplSparePartText = row.needReplSparePartText || ''
  formData.startTime = row.startTime || undefined
  formData.endTime = row.endTime || undefined
  formData.useTime = row.useTime ?? undefined
  formData.remark = row.remark || ''

  // 加载保养标准子表
  if (row.code) {
    await loadItems(row.code)
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.w-full {
  width: 100%;
}

.section-title {
  padding-bottom: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color-lighter);

  &:not(:first-child) {
    margin-top: 20px;
  }
}

.use-time-wrap {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.use-time-input {
  flex: 1;
}

.use-time-unit {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.item-section {
  padding-top: 12px;
  margin-top: 12px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.item-section-header {
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}
</style>
