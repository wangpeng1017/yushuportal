<template>
  <!-- 三端共享提示 -->
  <el-alert
    title="维修知识库三端共享"
    description="本知识库为全平台共用，C 端 / B 端 / 数控机加三端的故障案例互通，便于跨端经验积累与智能推荐。"
    type="success"
    show-icon
    :closable="false"
    class="mb-10px"
  />

  <!-- 搜索区域 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="auto"
    >
      <el-form-item label="故障关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="故障现象/原因/方案"
          clearable
          @keyup.enter="handleQuery"
          class="!w-220px"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="equipmentTypeName">
        <el-select
          v-model="queryParams.equipmentTypeName"
          placeholder="请选择设备类型"
          clearable
          class="!w-160px"
        >
          <el-option label="非标设备" value="非标设备" />
          <el-option label="加工类设备" value="加工类设备" />
          <el-option label="数控设备" value="数控设备" />
          <el-option label="注塑设备" value="注塑设备" />
        </el-select>
      </el-form-item>
      <el-form-item label="故障类别" prop="breakdownType">
        <el-select
          v-model="queryParams.breakdownType"
          placeholder="请选择故障类别"
          clearable
          class="!w-140px"
        >
          <el-option label="电气故障" value="1" />
          <el-option label="机械故障" value="2" />
          <el-option label="软件故障" value="3" />
          <el-option label="其他" value="4" />
        </el-select>
      </el-form-item>
      <el-form-item label="来源车间" prop="workshopCode">
        <el-select
          v-model="queryParams.workshopCode"
          placeholder="全部车间"
          clearable
          class="!w-140px"
        >
          <el-option label="全部" value="ALL" />
          <el-option label="C 端" value="C" />
          <el-option label="B 端" value="B" />
          <el-option label="数控机加" value="CNC" />
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
  </ContentWrap>

  <!-- 列表区域 -->
  <ContentWrap>
    <div class="mb-10px flex justify-between items-center">
      <span class="text-gray-500 text-sm">维修记录自动沉淀，共 {{ total }} 条知识</span>
      <el-button type="primary" plain @click="handleExport">
        <Icon icon="ep:download" class="mr-5px" />&nbsp;导出
      </el-button>
    </div>

    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="知识编号" align="center" prop="knowledgeCode" width="120" />
      <el-table-column label="来源车间" align="center" prop="workshopCode" width="100">
        <template #default="{ row }">
          <el-tag size="small" :type="row.workshopCode === 'C' ? 'success' : (row.workshopCode === 'B' ? 'warning' : 'primary')">
            {{ row.workshopCode === 'C' ? 'C 端' : (row.workshopCode === 'B' ? 'B 端' : '数控机加') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName" width="100" />
      <el-table-column label="设备型号" align="center" prop="equipmentMode" width="100" />
      <el-table-column label="故障现象" align="center" prop="faultPhenomenon" min-width="180" />
      <el-table-column label="故障原因" align="center" prop="faultCause" min-width="180" />
      <el-table-column label="维修方案" align="center" prop="repairSolution" min-width="200" />
      <el-table-column label="故障类别" align="center" prop="breakdownTypeText" width="90">
        <template #default="{ row }">
          <el-tag
            :type="breakdownTagType(row.breakdownType)"
            size="small"
          >
            {{ row.breakdownTypeText || '-' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维修级别" align="center" prop="repairLevelText" width="80" />
      <el-table-column label="维修时长" align="center" prop="repairDuration" width="90" />
      <el-table-column label="备件耗用" align="center" prop="sparePartUsed" width="120" />
      <el-table-column label="来源工单" align="center" prop="sourceWorkOrder" width="120" />
      <el-table-column label="发生次数" align="center" prop="occurrenceCount" width="80">
        <template #default="{ row }">
          <el-tag type="warning" size="small" v-if="row.occurrenceCount >= 5">
            {{ row.occurrenceCount }}次
          </el-tag>
          <span v-else>{{ row.occurrenceCount ?? 1 }}次</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template #default="{ row }">
          <el-button link class="btn-other" @click="handleView(row)">
            &nbsp;查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 详情弹窗 -->
  <el-dialog
    v-model="detailVisible"
    title="维修知识详情"
    width="800px"
    :close-on-click-modal="false"
  >
    <template v-if="currentRecord">
      <el-descriptions :column="2" border size="small" class="mb-20px">
        <el-descriptions-item label="知识编号">{{ currentRecord.knowledgeCode }}</el-descriptions-item>
        <el-descriptions-item label="故障类别">
          <el-tag :type="breakdownTagType(currentRecord.breakdownType)" size="small">
            {{ currentRecord.breakdownTypeText }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备类型">{{ currentRecord.equipmentTypeName }}</el-descriptions-item>
        <el-descriptions-item label="设备型号">{{ currentRecord.equipmentMode }}</el-descriptions-item>
        <el-descriptions-item label="维修级别">{{ currentRecord.repairLevelText }}</el-descriptions-item>
        <el-descriptions-item label="维修时长">{{ currentRecord.repairDuration }}</el-descriptions-item>
        <el-descriptions-item label="备件耗用">{{ currentRecord.sparePartUsed || '-' }}</el-descriptions-item>
        <el-descriptions-item label="来源工单">{{ currentRecord.sourceWorkOrder || '-' }}</el-descriptions-item>
        <el-descriptions-item label="发生次数">{{ currentRecord.occurrenceCount ?? 1 }}次</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentRecord.createTime }}</el-descriptions-item>
        <el-descriptions-item label="故障现象" :span="2">{{ currentRecord.faultPhenomenon }}</el-descriptions-item>
        <el-descriptions-item label="故障原因" :span="2">{{ currentRecord.faultCause }}</el-descriptions-item>
        <el-descriptions-item label="维修方案" :span="2">{{ currentRecord.repairSolution }}</el-descriptions-item>
      </el-descriptions>

      <!-- 相似故障记录 -->
      <div class="mt-10px">
        <div class="text-sm font-bold text-gray-700 mb-10px flex items-center gap-6px">
          <Icon icon="ep:connection" />
          相似故障记录（同设备类型 + 同故障类别）
        </div>
        <el-table
          :data="similarList"
          size="small"
          :show-overflow-tooltip="true"
          max-height="200"
          empty-text="暂无相似记录"
        >
          <el-table-column label="知识编号" prop="knowledgeCode" width="110" />
          <el-table-column label="故障现象" prop="faultPhenomenon" min-width="140" />
          <el-table-column label="维修方案" prop="repairSolution" min-width="160" />
          <el-table-column label="发生次数" prop="occurrenceCount" width="70" align="center">
            <template #default="{ row }">{{ row.occurrenceCount ?? 1 }}次</template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as KnowledgeApi from '@/api/eam/repairKnowledge'
import type { RepairKnowledgeVo } from '@/api/eam/repairKnowledge'

defineOptions({ name: 'EamRepairKnowledge' })

// ==================== 搜索条件 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<RepairKnowledgeVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: undefined as string | undefined,
  equipmentTypeName: undefined as string | undefined,
  breakdownType: undefined as string | undefined
})
const queryFormRef = ref()

// ==================== 故障类别 Tag 颜色 ====================
const breakdownTagType = (type?: string) => {
  const map: Record<string, string> = {
    '1': 'danger',
    '2': 'warning',
    '3': 'info',
    '4': ''
  }
  return (map[type ?? ''] ?? '') as any
}

// ==================== 列表查询 ====================
const getList = async () => {
  loading.value = true
  try {
    const res = await KnowledgeApi.getKnowledgePage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      keyword: queryParams.keyword,
      equipmentTypeName: queryParams.equipmentTypeName,
      breakdownType: queryParams.breakdownType
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// ==================== 导出 ====================
const handleExport = () => {
  // 预留导出功能
}

// ==================== 查看详情 ====================
const detailVisible = ref(false)
const currentRecord = ref<RepairKnowledgeVo | null>(null)
const similarList = ref<RepairKnowledgeVo[]>([])

const handleView = async (row: RepairKnowledgeVo) => {
  currentRecord.value = row
  detailVisible.value = true
  // 加载相似故障（同设备类型 + 同故障类别）
  try {
    const res = await KnowledgeApi.getKnowledgePage({
      pageNo: 1,
      pageSize: 5,
      equipmentTypeName: row.equipmentTypeName,
      breakdownType: row.breakdownType
    })
    similarList.value = (res.records ?? []).filter((r: RepairKnowledgeVo) => r.id !== row.id)
  } catch {
    similarList.value = []
  }
}

// ==================== 初始化 ====================
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}

:deep(.el-card__body) {
  padding: 15px;
}
</style>
