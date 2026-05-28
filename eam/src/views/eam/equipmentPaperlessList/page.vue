<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-card shadow="never" class="mb-10px">
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="日期" prop="dateRange">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            :disabled-date="disabledDate"
            class="!w-360px"
          />
        </el-form-item>
        <el-form-item label="设备类型" prop="equipmentType">
          <el-select
          v-model="queryParams.equipment_type_code"
          placeholder="请选择设备类型"
          clearable
          filterable
          class="!w-200px"
        >
          <el-option
            v-for="item in equipmentTypeOptions"
            :key="item.typeCode"
            :label="item.typeName"
            :value="item.typeCode"
          />
        </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 列表 -->
    <el-card shadow="never">
      <!-- <div class="mb-10px">
        <el-button
          v-hasPermi="['']"
          :loading="exportLoading"
          plain
          type="success"
          @click="handleExport"
        >
          <Icon class="mr-5px" icon="ep:download" />&nbsp;导出
        </el-button>
      </div> -->
      <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="日期" align="center" prop="createTime" />
        <el-table-column label="班组" align="center" prop="shiftName" />
        <el-table-column label="机台号" align="center" prop="capacityGroupCode" />
        <el-table-column label="备件型号" align="center" prop="equipmentSn" />
        <el-table-column label="更换时间" align="center" prop="changeTime" />
        <el-table-column label="更换类型" align="center" prop="changeTypeName" />
        <el-table-column label="确认员" align="center" prop="changePersonName" />
      </el-table>
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </el-card>
  </ContentWrap>
</template>

<script lang="ts" setup>
import * as EquipmentPaperlessApi from '@/api/eam/equipmentPaperless'
import download from '@/utils/download'
import * as EquipmentApi from '@/api/eam/optEquipment'
defineOptions({ name: 'EquipmentPaperlessList' })

const message = useMessage()

const dateRange = ref([])
// ==================== 搜索下拉数据 ====================
const equipmentTypeOptions = ref<any[]>([])
const loadEquipmentTypeOptions = async () => {
  try {
    const data = await EquipmentApi.getEquipmentTypeAllList()
    equipmentTypeOptions.value = data || []
  } catch (error) {
    console.error('加载设备类型列表失败:', error)
  }
}
// 禁用未来日期
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<EquipmentPaperlessApi.EquipmentPaperlessDto[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  date_begin: undefined as string | undefined,
  date_end: undefined as string | undefined,
  equipment_type_code: undefined as string | undefined
})
const queryFormRef = ref()
const exportLoading = ref(false)

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 设置时间范围
    if (dateRange.value && dateRange.value.length === 2) {
      queryParams.date_begin = dateRange.value[0] + ' 00:00:00'
      queryParams.date_end = dateRange.value[1] + ' 23:59:59'
    } else {
      queryParams.date_begin = undefined
      queryParams.date_end = undefined
    }

    const res = await EquipmentPaperlessApi.getEquipmentPaperlessList(queryParams)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  dateRange.value = [
  ]
  queryParams.equipment_type_code=''
  handleQuery()
}

/** 导出 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    
    // 设置时间范围
    const exportParams = { ...queryParams }
    if (dateRange.value && dateRange.value.length === 2) {
      exportParams.date_begin = dateRange.value[0] + ' 00:00:00'
      exportParams.date_end = dateRange.value[1] + ' 23:59:59'
    }
    
    const data = await EquipmentPaperlessApi.exportEquipmentPaperless(exportParams)
    download.excel(data, '设备无纸化记录.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  getList()
  loadEquipmentTypeOptions()
})
</script>

<style lang="scss" scoped>
:deep(.el-card__body) {
  padding: 15px;
}
</style>
