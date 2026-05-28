<template>
  <Dialog v-model="dialogVisible" title="设备履历" width="1000px">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="基本信息详情" name="info" />
      <el-tab-pane label="点检记录" name="inspection" />
      <el-tab-pane label="维修记录" name="repair" />
      <el-tab-pane label="保养记录" name="maintenance" />
    </el-tabs>

    <!-- Tab 1: 基本信息详情 -->
    <div v-show="activeTab === 'info'">
      <el-form v-loading="formLoading" :model="formData" label-width="120px">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="设备编号">
              <el-input v-model="formData.equipmentSn" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input v-model="formData.equipmentName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类别">
              <el-input v-model="formData.equipmentCategoryDesc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型">
              <el-input v-model="formData.equipmentTypeDesc" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备型号">
              <el-input v-model="formData.equipmentModeText" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商">
              <el-input v-model="formData.equipmentSupplierName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="购置日期">
              <el-input v-model="formData.equipmentPurchase" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="资产状态">
              <el-input v-model="formData.equipmentStatusText" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投入运营时间">
              <el-input v-model="formData.equipmentOperating" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- Tab 2: 点检记录 -->
    <div v-show="activeTab === 'inspection'">
      <el-table
        v-loading="inspectionLoading"
        :data="inspectionList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="开始时间" align="center" prop="startTime" width="180" />
        <el-table-column label="结束时间" align="center" prop="endTime" width="180" />
        <el-table-column label="点检结果" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getWorkOrderStatusType(scope.row.status) as any">
              {{ eamEnumStore.getWorkOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="点检员" align="center" prop="personName" min-width="100" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="inspectionParams.pageNo"
          v-model:page-size="inspectionParams.pageSize"
          :total="inspectionTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadInspectionList"
          @current-change="loadInspectionList"
        />
      </div>
    </div>

    <!-- Tab 3: 维修记录 -->
    <div v-show="activeTab === 'repair'">
      <el-table
        v-loading="repairLoading"
        :data="repairList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="故障时间" align="center" prop="breakdownTime" width="180" />
        <el-table-column label="维修开始时间" align="center" prop="repairBeginTime" width="180" />
        <el-table-column label="维修结束时间" align="center" prop="repairEndTime" width="180" />
        <el-table-column label="维修状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getRepairWorkOrderStatusType(scope.row.status) as any">
              {{ eamEnumStore.getRepairWorkOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="维修人" align="center" prop="repairPersonName" min-width="100" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="repairParams.pageNo"
          v-model:page-size="repairParams.pageSize"
          :total="repairTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadRepairList"
          @current-change="loadRepairList"
        />
      </div>
    </div>

    <!-- Tab 4: 保养记录 -->
    <div v-show="activeTab === 'maintenance'">
      <el-table
        v-loading="maintenanceLoading"
        :data="maintenanceList"
        :stripe="true"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="保养开始时间" align="center" prop="startTime" width="180" />
        <el-table-column label="保养结束时间" align="center" prop="endTime" width="180" />
        <el-table-column label="保养用时" align="center" prop="useTime" width="120">
          <template #default="scope">
            {{ formatUseTime(scope.row.useTime) }}
          </template>
        </el-table-column>
        <el-table-column label="保养状态" align="center" prop="status" width="100">
          <template #default="scope">
            <el-tag :type="eamEnumStore.getMaintenanceWorkStatusType(scope.row.status) as any">
              {{ eamEnumStore.getMaintenanceWorkStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="保养人" align="center" prop="personName" min-width="100" />
      </el-table>
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="maintenanceParams.pageNo"
          v-model:page-size="maintenanceParams.pageSize"
          :total="maintenanceTotal"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="loadMaintenanceList"
          @current-change="loadMaintenanceList"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as DeviceLedgerApi from '@/api/eam/deviceLedger'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'EamDeviceLedgerDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const formLoading = ref(false)
const activeTab = ref('info')

// 当前设备编号（用于关联查询）
const currentEquipmentSn = ref('')

// ==================== 基本信息 ====================
const formData = ref({
  equipmentSn: '',
  equipmentName: '',
  equipmentCategoryDesc: '',
  equipmentTypeDesc: '',
  equipmentModeText: '',
  equipmentSupplierName: '',
  equipmentPurchase: '',
  equipmentStatusText: '',
  equipmentOperating: ''
})

// ==================== 点检记录 ====================
const inspectionLoading = ref(false)
const inspectionList = ref<DeviceLedgerApi.SpotInspectionVo[]>([])
const inspectionTotal = ref(0)
const inspectionParams = reactive({ pageNo: 1, pageSize: 10 })

const loadInspectionList = async () => {
  if (!currentEquipmentSn.value) return
  inspectionLoading.value = true
  try {
    const res = await DeviceLedgerApi.getSpotInspectionList({
      pageNo: inspectionParams.pageNo,
      pageSize: inspectionParams.pageSize,
      deviceSn: currentEquipmentSn.value,
      status: 3
    })
    inspectionList.value = res?.records ?? []
    inspectionTotal.value = res?.total ?? 0
  } finally {
    inspectionLoading.value = false
  }
}

// ==================== 维修记录 ====================
const repairLoading = ref(false)
const repairList = ref<DeviceLedgerApi.RepairWorkOrderVo[]>([])
const repairTotal = ref(0)
const repairParams = reactive({ pageNo: 1, pageSize: 10 })

const loadRepairList = async () => {
  if (!currentEquipmentSn.value) return
  repairLoading.value = true
  try {
    const res = await DeviceLedgerApi.getRepairWorkOrderList({
      pageNo: repairParams.pageNo,
      pageSize: repairParams.pageSize,
      equipmentSn: currentEquipmentSn.value,
      status: 6
    })
    repairList.value = res?.records ?? []
    repairTotal.value = res?.total ?? 0
  } finally {
    repairLoading.value = false
  }
}

// ==================== 保养记录 ====================
const maintenanceLoading = ref(false)
const maintenanceList = ref<DeviceLedgerApi.MaintenanceWorkOrderVo[]>([])
const maintenanceTotal = ref(0)
const maintenanceParams = reactive({ pageNo: 1, pageSize: 10 })

const loadMaintenanceList = async () => {
  if (!currentEquipmentSn.value) return
  maintenanceLoading.value = true
  try {
    const res = await DeviceLedgerApi.getMaintenanceWorkOrderList({
      pageNo: maintenanceParams.pageNo,
      pageSize: maintenanceParams.pageSize,
      equipmentSn: currentEquipmentSn.value,
      status: 4
    })
    maintenanceList.value = res?.records ?? []
    maintenanceTotal.value = res?.total ?? 0
  } finally {
    maintenanceLoading.value = false
  }
}

// ==================== 保养用时格式化 ====================
const formatUseTime = (minutes: number | undefined) => {
  if (!minutes || minutes <= 0) return ''
  const hours = Math.floor(minutes / 60)
  const mins = Math.floor(minutes % 60)
  return hours + '小时' + mins + '分'
}

// ==================== Tab 切换 ====================
const handleTabChange = (tab: string | number) => {
  if (tab === 'inspection' && inspectionList.value.length === 0) {
    loadInspectionList()
  } else if (tab === 'repair' && repairList.value.length === 0) {
    loadRepairList()
  } else if (tab === 'maintenance' && maintenanceList.value.length === 0) {
    loadMaintenanceList()
  }
}

// ==================== 打开弹窗 ====================
const open = async (id: string) => {
  dialogVisible.value = true
  activeTab.value = 'info'
  formLoading.value = true

  // 重置工单列表
  inspectionList.value = []
  inspectionTotal.value = 0
  inspectionParams.pageNo = 1
  repairList.value = []
  repairTotal.value = 0
  repairParams.pageNo = 1
  maintenanceList.value = []
  maintenanceTotal.value = 0
  maintenanceParams.pageNo = 1

  try {
    await eamEnumStore.loadEquipmentEnums()
    await eamEnumStore.loadSpotInspectionWorkEnums()
    await eamEnumStore.loadRepairWorkOrderEnums()
    await eamEnumStore.loadMaintenanceWorkOrderEnums()
    const res = await DeviceLedgerApi.getDeviceLedgerById(id)
    currentEquipmentSn.value = res.equipmentSn ?? ''
    formData.value = {
      equipmentSn: res.equipmentSn ?? '',
      equipmentName: res.equipmentName ?? '',
      equipmentCategoryDesc: res.equipmentCategoryDesc ?? '',
      equipmentTypeDesc: res.equipmentTypeDesc ?? '',
      equipmentModeText: eamEnumStore.getEquipmentModeText(res.equipmentMode ?? ''),
      equipmentSupplierName: res.equipmentSupplierName ?? '',
      equipmentPurchase: res.equipmentPurchase ?? '',
      equipmentStatusText: eamEnumStore.getEquipmentStatusText(res.equipmentStatus ?? ''),
      equipmentOperating: res.equipmentOperating ?? ''
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0 0;
}
</style>
