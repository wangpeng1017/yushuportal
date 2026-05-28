<template>
  <div class="device-ledger-page">
    <div class="layout-wrap">
      <!-- 左侧设备类型树 -->
      <div class="left-tree">
        <ContentWrap class="h-full">
          <div class="tree-title">设备类型</div>
          <el-input
            v-model="treeFilterText"
            placeholder="搜索设备类型"
            clearable
            class="tree-search"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="key"
            :props="{ children: 'children', label: 'title' }"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterTreeNode"
            @node-click="handleTreeNodeClick"
          />
        </ContentWrap>
      </div>

      <!-- 右侧列表区域 -->
      <div class="right-content">
        <QueryForm :model="queryParams" :cols="4" @search="handleQuery" @reset="resetQuery">
          <QueryItem label="设备编号">
            <el-input v-model="queryParams.equipmentSn" clearable placeholder="请输入设备编号" />
          </QueryItem>
          <QueryItem label="设备名称">
            <el-input v-model="queryParams.equipmentName" clearable placeholder="请输入设备名称" />
          </QueryItem>
          <QueryItem label="设备状态">
            <el-select v-model="queryParams.operationStatus" placeholder="请选择设备状态" clearable>
              <el-option
                v-for="item in eamEnumStore.getOperationStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </QueryItem>
          <QueryItem label="供应商">
            <el-select v-model="queryParams.equipmentSupplier" placeholder="请选择供应商" clearable filterable>
              <el-option
                v-for="item in supplierOptions"
                :key="item.supplierSn"
                :label="item.supplierName"
                :value="item.supplierSn"
              />
            </el-select>
          </QueryItem>
          <QueryItem label="设备型号">
            <el-input v-model="queryParams.equipmentMode" clearable placeholder="请输入设备型号" />
          </QueryItem>
        </QueryForm>

        <ListPage
          :loading="loading"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        >
          <template #actions>
            <el-button
              type="primary"
              :disabled="selectedRows.length === 0"
              @click="openBatchPrint"
            >
              <Icon icon="ep:printer" class="mr-5px" />
              批量打印贴纸（已选 {{ selectedRows.length }} 台）
            </el-button>
          </template>
          <el-table
            ref="tableRef"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="设备编号" align="center" prop="equipmentSn" width="160" />
            <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="120" />
            <el-table-column label="设备状态" align="center" prop="operationStatus" width="80">
              <template #default="scope">
                <span
                  class="operation-status-dot"
                  :class="getOperationStatusClass(scope.row.operationStatus)"
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="120" />
            <el-table-column label="排序号" align="center" prop="sequenceNumber" width="80" />
            <el-table-column
              label="供应商"
              align="center"
              prop="equipmentSupplierName"
              min-width="150"
            />
            <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120">
              <template #default="scope">
                {{ eamEnumStore.getEquipmentModeText(scope.row.equipmentMode) }}
              </template>
            </el-table-column>
            <el-table-column label="设备类别" align="center" prop="equipmentCategory" width="100" />
            <el-table-column
              label="设备类别描述"
              align="center"
              prop="equipmentCategoryDesc"
              width="120"
            />
            <el-table-column label="资产状态" align="center" prop="equipmentStatus" width="100">
              <template #default="scope">
                {{ eamEnumStore.getEquipmentStatusText(scope.row.equipmentStatus) }}
              </template>
            </el-table-column>
            <el-table-column
              label="投入运营时间"
              align="center"
              prop="equipmentOperating"
              width="120"
            />
            <el-table-column label="购置时间" align="center" prop="equipmentPurchase" width="120" />
            <el-table-column label="操作" align="center" fixed="right" width="160">
              <template #default="scope">
                <RowActions
                  :row="scope.row"
                  :on-detail="checkPermi([PERMI.QUERY]) ? (r: any) => openDetail(r.id) : null"
                >
                  <template v-if="checkPermi([PERMI.QUERY])" #more>
                    <el-dropdown-item @click="openQrcode(scope.row)">
                      生成二维码
                    </el-dropdown-item>
                  </template>
                </RowActions>
              </template>
            </el-table-column>
          </el-table>
        </ListPage>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <DeviceLedgerDetail ref="detailRef" />

    <!-- 二维码弹窗 -->
    <QrcodeDialog ref="qrcodeRef" />

    <!-- 批量打印贴纸 -->
    <BatchLabelPrint ref="batchPrintRef" />
  </div>
</template>

<script lang="ts" setup>
import { checkPermi } from '@/utils/permission'
import * as DeviceLedgerApi from '@/api/eam/deviceLedger'
import { useEamEnumStore } from '@/store/modules/enums'
import DeviceLedgerDetail from './detail.vue'
import QrcodeDialog from './components/QrcodeDialog.vue'
import BatchLabelPrint from './components/BatchLabelPrint.vue'

defineOptions({ name: 'EamDeviceLedger' })

const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:optEquipment:query'
}

// ==================== 左侧设备类型树 ====================
interface TreeNode {
  key: string
  title: string
  children?: TreeNode[]
}

const treeRef = ref()
const treeData = ref<TreeNode[]>([])
const selectedTypeCode = ref('')
const treeFilterText = ref('')

watch(treeFilterText, (val) => {
  treeRef.value?.filter(val)
})

const filterTreeNode = (value: string, data: TreeNode) => {
  if (!value) return true
  if (data.key === 'all') return true
  return data.title.includes(value)
}

const loadTreeData = async () => {
  // 从设备档案的"按设备类型"5 级分类树同源加载（与 optEquipment byType 一致）
  try {
    const mod = await import('../optEquipment/category-trees')
    const defs = mod.C_TREE_BY_TYPE || []
    const toNode = (arr: any[]): TreeNode[] =>
      arr.map((d: any) => ({
        key: d.label,
        title: d.label,
        children: d.children?.length ? toNode(d.children) : undefined,
      }))
    treeData.value = [
      { key: 'all', title: '全部', children: toNode(defs) }
    ]
  } catch (error) {
    console.error('加载设备类型树失败:', error)
    treeData.value = [{ key: 'all', title: '全部' }]
  }
}

const handleTreeNodeClick = (data: TreeNode) => {
  if (data.key === 'all') {
    selectedTypeCode.value = ''
  } else {
    selectedTypeCode.value = data.key
  }
  queryParams.pageNo = 1
  getList()
}

// ==================== 供应商搜索下拉 ====================
const supplierOptions = ref<DeviceLedgerApi.SupplierNameItem[]>([])
const loadSupplierOptions = async () => {
  try {
    const data = await DeviceLedgerApi.getSupplierNameList()
    supplierOptions.value = data || []
  } catch (error) {
    console.error('加载供应商列表失败:', error)
  }
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<DeviceLedgerApi.DeviceLedgerVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  operationStatus: undefined as string | undefined,
  equipmentSupplier: undefined as string | undefined,
  equipmentMode: undefined as string | undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params: any = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      equipmentSn: queryParams.equipmentSn,
      equipmentName: queryParams.equipmentName,
      operationStatus: queryParams.operationStatus,
      equipmentSupplier: queryParams.equipmentSupplier,
      equipmentMode: queryParams.equipmentMode
    }
    // 树节点过滤
    if (selectedTypeCode.value) {
      params.equipmentType = selectedTypeCode.value
    }
    const res = await DeviceLedgerApi.getDeviceLedgerPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
    // 翻页/筛选/重置后清空多选，避免与 el-table 内部状态不一致
    selectedRows.value = []
    tableRef.value?.clearSelection?.()
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
  queryParams.equipmentSn = undefined
  queryParams.equipmentName = undefined
  queryParams.operationStatus = undefined
  queryParams.equipmentSupplier = undefined
  queryParams.equipmentMode = undefined
  handleQuery()
}

// ==================== 运行状态彩色圆点 ====================
const getOperationStatusClass = (status: string) => {
  const classMap: Record<string, string> = {
    RUN: 'status-run',
    FAILURE: 'status-failure',
    STANDBY: 'status-standby',
    CLOSE: 'status-close'
  }
  return classMap[status] || ''
}

// ==================== 详情 ====================
const detailRef = ref()
const openDetail = (id: string) => {
  detailRef.value.open(id)
}

// ==================== 二维码弹窗 ====================
const qrcodeRef = ref<InstanceType<typeof QrcodeDialog>>()
const openQrcode = (row: DeviceLedgerApi.DeviceLedgerVo) => {
  qrcodeRef.value.open({
    equipmentSn: row.equipmentSn,
    equipmentName: row.equipmentName,
  })
}

// ==================== 多选 + 批量打印 ====================
const tableRef = ref()
const selectedRows = ref<DeviceLedgerApi.DeviceLedgerVo[]>([])
const batchPrintRef = ref<InstanceType<typeof BatchLabelPrint>>()

const handleSelectionChange = (rows: DeviceLedgerApi.DeviceLedgerVo[]) => {
  selectedRows.value = rows
}

const openBatchPrint = () => {
  if (selectedRows.value.length === 0) return
  batchPrintRef.value?.open(
    selectedRows.value.map(r => ({
      equipmentSn: r.equipmentSn,
      equipmentName: r.equipmentName,
    }))
  )
}

// ==================== 初始化 ====================
onMounted(async () => {
  await Promise.all([eamEnumStore.loadEquipmentEnums(), loadTreeData(), loadSupplierOptions()])
  await getList()
})
</script>

<style lang="scss" scoped>
.device-ledger-page {
  height: 100%;
}

.layout-wrap {
  display: flex;
  gap: 16px;
  height: 100%;
}

.left-tree {
  flex-shrink: 0;
  width: 240px;
}

.right-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.tree-search {
  margin-bottom: 10px;
}

.tree-title {
  padding-bottom: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #ebeef5;
}

.operation-status-dot {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.status-run {
  background: #3f9901;
}

.status-failure {
  background: #e13d35;
}

.status-standby {
  background: #f0c803;
}

.status-close {
  background: #989b9a;
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}

.batch-bar {
  margin-bottom: 12px;
}
</style>
