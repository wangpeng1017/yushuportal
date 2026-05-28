<template>
  <Dialog v-model="dialogVisible" title="维修记录详情" width="900px">
    <el-tabs v-model="activeTab">
      <!-- ==================== 工单信息 Tab ==================== -->
      <el-tab-pane label="工单信息" name="info">
        <el-form label-width="100px" :disabled="true">
          <!-- 基本信息 -->
          <el-divider content-position="left">基本信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维修单号">
                <el-input :model-value="detailData.repairCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备编号">
                <el-input :model-value="detailData.equipmentSn" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备名称">
                <el-input :model-value="detailData.equipmentName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设备类型">
                <el-input :model-value="detailData.equipmentTypeName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设备型号">
                <el-input :model-value="detailData.equipmentMode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="供应商">
                <el-input :model-value="detailData.equipmentSupplierName" />
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
              <el-form-item label="故障等级">
                <el-input :model-value="detailData.breakdownLevelText" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="紧急程度">
                <el-input :model-value="detailData.repairDegreeText" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="故障来源">
                <el-input
                  :model-value="eamEnumStore.getRepairWorkOrderSourceText(detailData.sourceType)"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="报修工单号">
                <el-input :model-value="detailData.failureWorkOrderCode" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="报修人">
                <el-input :model-value="detailData.presentPersonName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="报修时间">
                <el-input :model-value="detailData.presentTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="创建人">
                <el-input :model-value="detailData.createByPersonName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="创建时间">
                <el-input :model-value="detailData.createTime" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="故障描述">
                <el-input :model-value="detailData.remark" type="textarea" :rows="3" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="故障图片">
                <UploadImgs
                  v-model="detailData.attachmentUrls"
                  :limit="9"
                  :disabled="true"
                  :drag="false"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 维修信息 -->
          <el-divider content-position="left">维修信息</el-divider>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维修人员">
                <el-input :model-value="detailData.repairPersonName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修级别">
                <el-input :model-value="detailData.repairLevelText" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维修类型">
                <el-input :model-value="detailData.repairTypeText" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否更换备件">
                <el-input :model-value="detailData.needReplSparePartText" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="是否停机">
                <el-input :model-value="detailData.needShutdownText" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="停机开始时间">
                <el-input :model-value="detailData.shutdownBeginTime" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="停机结束时间">
                <el-input :model-value="detailData.shutdownEndTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="停机时长">
                <el-input :model-value="detailData.shutdownDurationText" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维修开始时间">
                <el-input :model-value="detailData.repairBeginTime" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="维修结束时间">
                <el-input :model-value="detailData.repairEndTime" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="维修时长">
                <el-input :model-value="detailData.repairDurationText" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认人">
                <el-input :model-value="detailData.confirmPersonName" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="确认时间">
                <el-input :model-value="detailData.confirmTime" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="维修记录">
                <el-input :model-value="detailData.repairRecord" type="textarea" :rows="3" />
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
                  <template v-if="record.operateType === 'assign'">
                    {{ record.changePersonName || '' }}
                  </template>
                  <template v-else>
                    {{ record.operatePersonName || '' }}
                  </template>
                  【{{ record.operateTypeDesc }}】
                </span>
                <div
                  v-if="
                    ['revoke', 'reassign', 'transfer'].includes(record.operateType) &&
                    record.operateContent
                  "
                  class="record-reason"
                >
                  {{ record.operateContent }}
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-else description="暂无处理记录" />
        </div>
      </el-tab-pane>

      <!-- ==================== 备件列表 Tab ==================== -->
      <el-tab-pane label="备件列表" name="spare">
        <el-table
          v-loading="spareLoading"
          :data="spareList"
          :stripe="true"
          :show-overflow-tooltip="true"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="备件编号" align="center" prop="partCode" width="120" />
          <el-table-column label="备件名称" align="center" prop="partName" width="150" />
          <el-table-column
            label="规格型号"
            align="center"
            prop="partSpecification"
            min-width="220"
          />
          <el-table-column label="备件类型" align="center" prop="partGroupName" width="180" />
          <el-table-column label="数量" align="center" prop="useAmount" width="100" />
          <el-table-column label="库存单位" align="center" prop="stockUnitName" width="100" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </Dialog>
</template>

<script lang="ts" setup>
import * as RecordApi from '@/api/eam/repairWorkRecord'
import type { RepairWorkOrderVo } from '@/api/eam/repairWorkOrder'
import type { RepairWorkOrderProcessRecordVo, SparePartDetailVo } from '@/api/eam/repairWorkRecord'
import { useEamEnumStore } from '@/store/modules/enums'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'

defineOptions({ name: 'RepairWorkRecordDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const activeTab = ref('info')

// ==================== 工单信息 ====================

const detailData = reactive({
  repairCode: '',
  equipmentSn: '',
  equipmentName: '',
  equipmentTypeName: '',
  equipmentMode: '',
  equipmentSupplierName: '',
  breakdownTime: '',
  breakdownLevelText: '',
  repairDegreeText: '',
  sourceType: '',
  failureWorkOrderCode: '',
  presentPersonName: '',
  presentTime: '',
  createByPersonName: '',
  createTime: '',
  remark: '',
  attachmentUrls: [] as string[],
  // 维修信息
  repairPersonName: '',
  repairLevelText: '',
  repairTypeText: '',
  needReplSparePartText: '',
  needShutdownText: '',
  shutdownBeginTime: '',
  shutdownEndTime: '',
  shutdownDurationText: '',
  repairBeginTime: '',
  repairEndTime: '',
  repairDurationText: '',
  repairRecord: '',
  confirmPersonName: '',
  confirmTime: ''
})

// ==================== 处理记录 ====================

const recordLoading = ref(false)
const recordList = ref<RepairWorkOrderProcessRecordVo[]>([])

const loadRecords = async (repairCode: string) => {
  recordLoading.value = true
  try {
    const res = await RecordApi.getProcessRecordList({
      repairCode,
      pageNo: 1,
      pageSize: 1000
    })
    recordList.value = res.records ?? []
  } finally {
    recordLoading.value = false
  }
}

// ==================== 备件列表 ====================

const spareLoading = ref(false)
const spareList = ref<SparePartDetailVo[]>([])

const loadSpareList = async (repairCode: string) => {
  spareLoading.value = true
  try {
    spareList.value = await RecordApi.getSparePartsList(repairCode)
  } finally {
    spareLoading.value = false
  }
}

// ==================== 弹窗控制 ====================

const open = async (row: RepairWorkOrderVo) => {
  dialogVisible.value = true
  activeTab.value = 'info'
  recordList.value = []
  spareList.value = []

  // 加载枚举
  await eamEnumStore.loadRepairWorkOrderSource()

  // 使用列表行数据填充详情
  const data: any = row

  // 基本信息
  detailData.repairCode = data.repairCode || ''
  detailData.equipmentSn = data.equipmentSn || ''
  detailData.equipmentName = data.equipmentName || ''
  detailData.equipmentTypeName = data.equipmentTypeName || ''
  detailData.equipmentMode = data.equipmentMode || ''
  detailData.equipmentSupplierName = data.equipmentSupplierName || ''
  detailData.breakdownTime = data.breakdownTime || ''
  detailData.breakdownLevelText = data.breakdownLevelText || ''
  detailData.repairDegreeText = data.repairDegreeText || ''
  detailData.sourceType = data.sourceType || ''
  detailData.failureWorkOrderCode = data.failureWorkOrderCode || ''
  detailData.presentPersonName = data.presentPersonName || ''
  detailData.presentTime = data.presentTime || ''
  detailData.createByPersonName = data.createByPersonName || ''
  detailData.createTime = data.createTime || ''
  detailData.remark = data.remark || ''
  detailData.attachmentUrls = data.attachments ? data.attachments.split(',') : []
  // 维修信息
  detailData.repairPersonName = data.repairPersonName || ''
  detailData.repairLevelText = data.repairLevelText || ''
  detailData.repairTypeText = data.repairTypeText || ''
  detailData.needReplSparePartText = data.needReplSparePartText || ''
  detailData.needShutdownText = data.needShutdownText || ''
  detailData.shutdownBeginTime = data.shutdownBeginTime || ''
  detailData.shutdownEndTime = data.shutdownEndTime || ''
  detailData.shutdownDurationText = data.shutdownDurationText || ''
  detailData.repairBeginTime = data.repairBeginTime || ''
  detailData.repairEndTime = data.repairEndTime || ''
  detailData.repairDurationText = data.repairDurationText || ''
  detailData.repairRecord = data.repairRecord || ''
  detailData.confirmPersonName = data.confirmPersonName || ''
  detailData.confirmTime = data.confirmTime || ''

  // 并行加载处理记录和备件列表
  if (data.repairCode) {
    loadRecords(data.repairCode)
    loadSpareList(data.repairCode)
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
