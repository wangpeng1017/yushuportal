<template>
  <Dialog v-model="dialogVisible" title="报修工单详情" width="900px">
    <el-tabs v-model="activeTab">
      <!-- ==================== 工单信息 Tab ==================== -->
      <el-tab-pane label="工单信息" name="info">
        <el-form label-width="100px" :disabled="true">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备编号">
                <el-input :model-value="detailData.equipmentSn" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备名称">
                <el-input :model-value="detailData.equipmentName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备类型">
                <el-input :model-value="detailData.equipmentTypeName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备型号">
                <el-input :model-value="detailData.equipmentMode" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="故障时间">
                <el-input :model-value="detailData.breakdownTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修人">
                <el-input :model-value="detailData.personName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="故障等级">
                <el-input :model-value="detailData.breakdownLevelText" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="故障类别">
                <el-input :model-value="detailData.breakdownTypeText" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急程度">
                <el-input :model-value="detailData.repairDegreeText" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="故障描述">
                <el-input :model-value="detailData.remark" type="textarea" :rows="4" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="图片">
                <UploadImgs
                  v-model="detailData.attachmentUrls"
                  :limit="9"
                  :disabled="true"
                  :drag="false"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>

      <!-- ==================== 处理记录 Tab ==================== -->
      <el-tab-pane label="处理记录" name="records">
        <div v-loading="recordLoading">
          <el-timeline v-if="recordList.length > 0">
            <el-timeline-item
              v-for="record in recordList"
              :key="record.id"
              :timestamp="record.operateTime"
              placement="top"
            >
              <div class="record-content">
                <span class="record-operator">
                  {{ record.operatePersonName }}【{{ record.operateTypeDesc }}】
                </span>
                <div
                  v-if="record.operateType === 'reject' && record.operateContent"
                  class="record-reason"
                >
                  驳回原因：{{ record.operateContent }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无处理记录" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>

<script lang="ts" setup>
import * as FailureWorkOrderApi from '@/api/eam/failureWorkOrder'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'FailureWorkOrderDetail' })

const dialogVisible = ref(false)
const activeTab = ref('info')

// ==================== 工单信息 ====================
const detailData = reactive({
  equipmentSn: '',
  equipmentName: '',
  equipmentTypeName: '',
  equipmentMode: '',
  breakdownTime: '',
  personName: '',
  breakdownLevelText: '',
  breakdownTypeText: '',
  repairDegreeText: '',
  remark: '',
  attachmentUrls: [] as string[]
})

// ==================== 处理记录 ====================
const recordLoading = ref(false)
const recordList = ref<FailureWorkOrderApi.ProcessRecordVo[]>([])

const loadRecords = async (failureCode: string) => {
  recordLoading.value = true
  try {
    const res = await FailureWorkOrderApi.getProcessRecordList({
      failureCode,
      pageNo: 1,
      pageSize: 1000
    })
    recordList.value = res.records ?? []
  } finally {
    recordLoading.value = false
  }
}

// ==================== 弹窗控制 ====================
const open = async (row: FailureWorkOrderApi.FailureWorkOrderVo) => {
  dialogVisible.value = true
  activeTab.value = 'info'
  recordList.value = []

  // 填充工单信息
  let data = row
  try {
    const detail = await FailureWorkOrderApi.getFailureWorkOrderById(row.id)
    if (detail) data = detail
  } catch {
    // fallback to row data
  }

  detailData.equipmentSn = data.equipmentSn || ''
  detailData.equipmentName = data.equipmentName || ''
  detailData.equipmentTypeName = data.equipmentTypeName || ''
  detailData.equipmentMode = data.equipmentMode || ''
  detailData.breakdownTime = data.breakdownTime || ''
  detailData.personName = data.personName || ''
  detailData.breakdownLevelText = data.breakdownLevelText || ''
  detailData.breakdownTypeText = data.breakdownTypeText || ''
  detailData.repairDegreeText = data.repairDegreeText || ''
  detailData.remark = data.remark || ''
  detailData.attachmentUrls = data.attachments ? data.attachments.split(',') : []

  // 加载处理记录
  if (data.failureCode) {
    loadRecords(data.failureCode)
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.record-content {
  line-height: 1.6;
}

.record-operator {
  font-weight: 500;
}

.record-reason {
  padding: 8px 12px;
  margin-top: 4px;
  font-size: 13px;
  color: var(--el-text-color-regular);
  background-color: var(--el-fill-color-lighter);
  border-radius: 4px;
}
</style>
