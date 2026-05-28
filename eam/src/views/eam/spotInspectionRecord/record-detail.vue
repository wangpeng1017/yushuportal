<template>
  <Dialog v-model="dialogVisible" title="查看详情" width="95%" top="3vh">
    <!-- ==================== 基本信息（只读） ==================== -->
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
          <el-form-item label="设备型号">
            <el-input v-model="formData.deviceMode" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商">
            <el-input v-model="formData.equipmentSupplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开始时间">
            <el-input v-model="formData.startTime" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="结束时间">
            <el-input v-model="formData.endTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="图片">
            <UploadImgs
              v-model="formData.attachmentUrls"
              :limit="9"
              :disabled="true"
              :drag="false"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-divider />

    <!-- ==================== 检查项列表（只读） ==================== -->
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
          <!-- 定性：只读展示选中项 -->
          <div v-if="scope.row.itemType === '定性'" class="check-record-qualitative">
            <div v-if="scope.row.normal" class="radio-row">
              <span class="radio-label normal-label">正常项：</span>
              <el-radio-group
                :model-value="scope.row.checkRecord"
                disabled
                class="radio-group-inline"
              >
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
              <el-radio-group
                :model-value="scope.row.checkRecord"
                disabled
                class="radio-group-inline"
              >
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
          <!-- 定量：只读展示数值 -->
          <div v-else-if="scope.row.itemType === '定量'" class="text-center">
            {{ scope.row.checkRecord || '--' }}
          </div>
          <div v-else class="text-center">--</div>
        </template>
      </el-table-column>
      <el-table-column label="检查结果" align="center" prop="checkResult" width="100" />
      <el-table-column label="排序" align="center" prop="sort" width="60" />
    </el-table>

    <Pagination
      :total="itemTotal"
      v-model:page="itemQueryParams.pageNo"
      v-model:limit="itemQueryParams.pageSize"
      @pagination="getItemList"
    />

    <div class="footer-bar">
      <el-button plain type="primary" @click="dialogVisible = false">关 闭</el-button>
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import * as WorkApi from '@/api/eam/spotInspectionWork'
import { useEamEnumStore } from '@/store/modules/enums'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'EamSpotInspectionRecordDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const currentStandard = ref<WorkApi.WorkStandardVo | null>(null)

// ==================== 基本信息 ====================
const formData = reactive({
  deviceSn: '',
  deviceName: '',
  equipmentTypeDesc: '',
  deviceMode: '',
  equipmentSupplierName: '',
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
const open = (standard: WorkApi.WorkStandardVo) => {
  currentStandard.value = standard
  dialogVisible.value = true

  formData.deviceSn = standard.deviceSn || ''
  formData.deviceName = standard.deviceName || ''
  formData.equipmentTypeDesc = standard.equipmentTypeDesc || ''
  formData.deviceMode = standard.deviceMode || ''
  formData.equipmentSupplierName = standard.equipmentSupplierName || ''
  formData.startTime = standard.startTime || ''
  formData.endTime = standard.endTime || ''
  formData.attachmentUrls = standard.attachments ? standard.attachments.split(',') : []

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
    itemList.value = res.records ?? []
    itemTotal.value = res.total ?? 0
  } finally {
    itemLoading.value = false
  }
}

const splitOptions = (str: string): string[] => {
  if (!str) return []
  return str.split(',').filter((s) => s.trim())
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

.text-center {
  text-align: center;
}

.footer-bar {
  display: flex;
  justify-content: flex-end;
  padding-top: 12px;
  clear: both;
}
</style>
