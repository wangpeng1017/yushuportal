<template>
  <!-- C 端：使用三棵树切换；其它端别保留单棵树 -->
  <TreeListLayout :key="treeKey" :tree-data="treeData" @select="handleTreeSelect">
    <template #default>
      <!-- 仅 C 端显示三树切换 Tab -->
      <ContentWrap v-if="isCPlant" class="!mb-12px">
        <el-tabs v-model="activeTreeType" @tab-change="handleTreeTypeChange">
          <el-tab-pane label="按设备类型" name="byType">
            <template #label>
              <Icon icon="ep:menu" class="mr-4px" />按设备类型
            </template>
          </el-tab-pane>
          <el-tab-pane label="按加工工艺" name="byProcess">
            <template #label>
              <Icon icon="ep:guide" class="mr-4px" />按加工工艺
            </template>
          </el-tab-pane>
          <el-tab-pane label="非标规划" name="byPlan">
            <template #label>
              <Icon icon="ep:cpu" class="mr-4px" />非标规划
            </template>
          </el-tab-pane>
        </el-tabs>
        <div class="tree-tab-hint">
          <span>当前视图：<b>{{ currentTreeLabel }}</b></span>
          <span class="ml-15px hint-sub">{{ currentTreeHint }}</span>
        </div>
      </ContentWrap>

      <!-- 搜索工作栏 -->
      <ContentWrap>
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="110px">
          <el-form-item label="设备编号" prop="equipmentSn">
            <el-input
v-model="queryParams.equipmentSn" class="!w-200px" clearable
              placeholder="请输入设备编号" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
v-model="queryParams.equipmentName" class="!w-200px" clearable
              placeholder="请输入设备名称" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item label="数据源" prop="dataSource">
            <el-select v-model="queryParams.dataSource" placeholder="请选择数据源" clearable class="!w-200px">
              <el-option v-for="ds in dataSourceOptions" :key="ds.value" :label="ds.text" :value="ds.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" prop="equipmentType">
            <el-select v-model="queryParams.equipmentType" placeholder="请选择设备类型" clearable filterable class="!w-200px">
              <el-option
v-for="item in equipmentTypeOptions" :key="item.typeCode"
                :label="item.typeName" :value="item.typeCode" />
            </el-select>
          </el-form-item>
          <el-form-item label="资产状态" prop="equipmentStatus">
            <el-select v-model="queryParams.equipmentStatus" placeholder="请选择资产状态" clearable class="!w-200px">
              <el-option
v-for="item in eamEnumStore.getEquipmentStatusList" :key="item.value"
                :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="运行状态" prop="operationStatus">
            <el-select v-model="queryParams.operationStatus" placeholder="请选择运行状态" clearable class="!w-200px">
              <el-option
v-for="item in eamEnumStore.getOperationStatusList" :key="item.value"
                :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />&nbsp;搜索</el-button>
            <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置</el-button>
          </el-form-item>
        </el-form>
      </ContentWrap>

      <!-- 列表 -->
      <ContentWrap>
        <div class="mb-10px">
          <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openForm('create')">
            <Icon class="mr-5px" icon="ep:plus" />&nbsp;新增
          </el-button>
          <el-button plain type="success" @click="openSyncDialog">
            <Icon class="mr-5px" icon="ep:connection" />&nbsp;手动同步 ERP
          </el-button>
          <el-button
v-hasPermi="[PERMI.DELETE]" plain type="danger"
            :disabled="selectedIds.length === 0" @click="handleBatchDelete">
            <Icon class="mr-5px" icon="ep:delete" />&nbsp;批量删除
          </el-button>
          <el-button
            plain type="warning"
            :disabled="selectedRows.length === 0" @click="openBatchPrint">
            <Icon class="mr-5px" icon="ep:printer" />&nbsp;批量打印贴纸（已选 {{ selectedRows.length }} 台）
          </el-button>
        </div>

        <!-- 设备分类 Tabs（保留原全部/重点/关键） -->
        <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="mb-10px">
          <el-tab-pane label="全部" name="all" />
          <el-tab-pane
v-for="tab in categoryTabs" :key="tab.categoryCode"
            :label="tab.categoryName" :name="tab.categoryCode" />
        </el-tabs>

        <el-table
v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
          <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="180" />
          <el-table-column label="数据源" align="center" prop="dataSource" width="100">
            <template #default="scope">
              <el-tag size="small" :type="getDataSourceTagType(scope.row.dataSource)">
                {{ getDataSourceText(scope.row.dataSource) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" min-width="120" />
          <el-table-column label="设备分类" align="center" prop="equipmentCategoryDesc" min-width="120" />
          <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120" />
          <el-table-column label="设备标识" align="center" prop="equipmentTag" width="140" />
          <el-table-column label="位置号" align="center" prop="locationSn" width="120" />
          <el-table-column label="供应商名称" align="center" prop="equipmentSupplierName" min-width="120" />
          <el-table-column label="资产状态" align="center" prop="equipmentStatus" width="100">
            <template #default="scope">
              {{ eamEnumStore.getEquipmentStatusText(scope.row.equipmentStatus) }}
            </template>
          </el-table-column>
          <el-table-column label="运行状态" align="center" prop="operationStatus" width="100">
            <template #default="scope">
              <span class="operation-status-dot" :class="getOperationStatusClass(scope.row.operationStatus)"></span>
            </template>
          </el-table-column>
          <el-table-column label="所属车间" align="center" prop="workshopName" width="110" />
          <el-table-column label="所属产线" align="center" prop="productionLineName" width="140" />
          <el-table-column label="责任人" align="center" prop="responsiblePersonName" width="100" />
          <el-table-column label="设备厂家" align="center" prop="manufacturer" width="120" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="170" :formatter="dateFormatter" />
          <el-table-column label="操作" align="center" fixed="right" width="290">
            <template #default="scope">
              <el-button link class="btn-other" v-hasPermi="[PERMI.QUERY]" @click="openDetail(scope.row.id)">查看</el-button>
              <el-button link class="btn-edit" v-hasPermi="[PERMI.UPDATE]" @click="openForm('update', scope.row.id)">编辑</el-button>
              <el-button link class="btn-delete" v-hasPermi="[PERMI.DELETE]" @click="handleDelete(scope.row.id)">删除</el-button>
              <el-button link style="color: #E6A23C" v-hasPermi="[PERMI.QUERY]" @click="openQrcode(scope.row)">生成二维码</el-button>
            </template>
          </el-table-column>
        </el-table>

        <Pagination
:total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
          @pagination="getList" />
      </ContentWrap>

      <!-- 新增/编辑/详情 -->
      <EquipmentForm ref="formRef" @success="getList" />
      <EquipmentDetail ref="detailRef" />

      <!-- 二维码弹窗 + 批量打印贴纸 -->
      <QrcodeDialog ref="qrcodeRef" />
      <BatchLabelPrint ref="batchPrintRef" />

      <!-- 手动 ERP 同步弹窗 -->
      <el-dialog v-model="syncDialogVisible" title="手动同步 ERP 设备主数据" width="500px">
        <el-alert
          title="同步说明"
          description="可按物料号或时间范围拉取增量数据，留空则按默认策略全量同步。"
          type="info" :closable="false" class="mb-15px"
        />
        <el-form :model="syncForm" label-width="100px">
          <el-form-item label="物料号">
            <el-input v-model="syncForm.materialNo" placeholder="可选，例如 PACK-2024" clearable />
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="syncForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="syncDialogVisible = false">取消</el-button>
          <el-button type="primary" :loading="syncLoading" @click="confirmSync">
            <Icon icon="ep:promotion" class="mr-3px" />确认同步
          </el-button>
        </template>
      </el-dialog>
    </template>
  </TreeListLayout>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'
import { usePlant } from '@/hooks/web/usePlant'
import request from '@/config/axios'
import EquipmentForm from './form.vue'
import EquipmentDetail from './detail.vue'
import QrcodeDialog from '../deviceLedger/components/QrcodeDialog.vue'
import BatchLabelPrint from '../deviceLedger/components/BatchLabelPrint.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'
import {
  C_TREE_BY_TYPE,
  C_TREE_BY_PROCESS,
  C_TREE_BY_PLAN,
  buildLegacyTypeTree
} from './category-trees'

defineOptions({ name: 'EamOptEquipment' })

const message = useMessage()
const { t } = useI18n()
const eamEnumStore = useEamEnumStore()
const { plantCode } = usePlant()

// ==================== 权限标识 ====================
const PERMI = {
  CREATE: 'eam:optEquipment:create',
  UPDATE: 'eam:optEquipment:update',
  DELETE: 'eam:optEquipment:delete',
  QUERY: 'eam:optEquipment:query',
  EXPORT: 'eam:optEquipment:export'
}

// ==================== 端别判定 ====================
const isCPlant = computed(() => plantCode.value === 'C')

// ==================== 三棵树切换 ====================
type TreeType = 'byType' | 'byProcess' | 'byPlan'
const activeTreeType = ref<TreeType>('byType')
const treeKey = ref(0)  // 触发 TreeListLayout 重建
const treeData = ref<any[]>([])
const allEquipments = ref<any[]>([])

const currentTreeLabel = computed(() => {
  if (!isCPlant.value) return '按车间分类'
  return ({
    byType: '按设备类型',
    byProcess: '按加工工艺',
    byPlan: '非标规划'
  } as Record<TreeType, string>)[activeTreeType.value]
})

const currentTreeHint = computed(() => {
  if (!isCPlant.value) return '点击节点过滤设备列表'
  return ({
    byType: '按"非标 / 工具 / 加工"维度浏览设备',
    byProcess: '按 PACK / 电机线 / 来料检验 工艺线浏览',
    byPlan: '查看尚未投产的非标规划设备（status=规划中）'
  } as Record<TreeType, string>)[activeTreeType.value]
})

// 各树关心的 path 字段
const PATH_KEY_MAP: Record<TreeType, string> = {
  byType: 'categoryPathByType',
  byProcess: 'categoryPathByProcess',
  byPlan: 'categoryPathByPlan'
}

// 把"分类树定义 + 设备列表"组合成 TreeListLayout 需要的结构
function buildTreeFromPathDef(treeDef: any[], pathKey: string) {
  // 根：全部
  const matchPrefix = (eq: any, prefix: string[]): boolean => {
    const arr: string[] = eq[pathKey] || []
    if (arr.length === 0) return prefix.length === 0
    return prefix.every((p, idx) => arr[idx] === p)
  }

  function buildNodes(defs: any[], prefix: string[]): any[] {
    return defs.map(def => {
      const here = [...prefix, def.label]
      const node: any = { key: here.join('>'), label: def.label, path: here }
      if (def.children?.length) {
        node.children = buildNodes(def.children, here)
      }
      // 计数：当前 path 完整命中（子节点也计入）
      node.count = allEquipments.value.filter(e => matchPrefix(e, here)).length
      return node
    })
  }

  const total = allEquipments.value.filter(e => (e[pathKey] || []).length > 0).length
  return [
    {
      key: 'ALL',
      label: '全部',
      path: [],
      count: total || allEquipments.value.length,
      children: buildNodes(treeDef, [])
    }
  ]
}

// 动态加载的"按设备类型"树（来自"设备分类树"维护页面，失败则 fallback 到 C_TREE_BY_TYPE）
const dynamicByTypeTree = ref<any[] | null>(null)

async function loadDynamicByTypeTree() {
  try {
    const data: any = await request.get({ url: '/eam/equipment-class-tree/get' })
    if (Array.isArray(data) && data.length) {
      // 转 TreeNode[] → TreeDef[]：仅保留 label/children，过滤 enabled=false
      const toDef = (nodes: any[]): any[] =>
        nodes.filter((n: any) => n.enabled !== false).map((n: any) => ({
          label: n.label,
          children: n.children?.length ? toDef(n.children) : undefined,
        }))
      dynamicByTypeTree.value = toDef(data)
    }
  } catch (e) {
    dynamicByTypeTree.value = null
  }
}

async function buildTree() {
  // 拉所有设备用于统计每节点数量
  try {
    const res: any = await EquipmentApi.getEquipmentPage({ pageNo: 1, pageSize: 1000 })
    allEquipments.value = res?.records || []
  } catch (e) {
    allEquipments.value = []
  }

  // byType 优先从"设备分类树"动态加载（实时反映维护页面的修改）
  if (activeTreeType.value === 'byType' && !dynamicByTypeTree.value) {
    await loadDynamicByTypeTree()
  }

  if (isCPlant.value) {
    const def =
      activeTreeType.value === 'byType' ? (dynamicByTypeTree.value || C_TREE_BY_TYPE) :
      activeTreeType.value === 'byProcess' ? C_TREE_BY_PROCESS : C_TREE_BY_PLAN
    treeData.value = buildTreeFromPathDef(def, PATH_KEY_MAP[activeTreeType.value])
  } else {
    // 其它端别：按设备类型一级树
    treeData.value = buildLegacyTypeTree(allEquipments.value, equipmentTypeOptions.value)
  }
  treeKey.value += 1
}

function handleTreeTypeChange() {
  // 切树时清空树过滤参数
  queryParams.categoryPathByType = undefined
  queryParams.categoryPathByProcess = undefined
  queryParams.categoryPathByPlan = undefined
  // 切到 byType 时强制重拉一次最新分类树（保证维护页修改实时生效）
  if (activeTreeType.value === 'byType') {
    dynamicByTypeTree.value = null
  }
  buildTree().then(() => {
    queryParams.pageNo = 1
    getList()
  })
}

function handleTreeSelect(_key: string, node: any) {
  // 清空所有 path 过滤
  queryParams.categoryPathByType = undefined
  queryParams.categoryPathByProcess = undefined
  queryParams.categoryPathByPlan = undefined
  queryParams.equipmentType = undefined

  if (!node || !node.path) {
    queryParams.pageNo = 1
    getList()
    return
  }

  if (isCPlant.value) {
    const path: string[] = node.path
    if (path.length === 0) {
      // 全部
    } else {
      const targetKey = PATH_KEY_MAP[activeTreeType.value]
      ;(queryParams as any)[targetKey] = path.join(',')
    }
  } else {
    // 旧逻辑：node.key 是 typeCode 或 'ALL'
    if (node.key && node.key !== 'ALL') queryParams.equipmentType = node.key
  }
  queryParams.pageNo = 1
  getList()
}

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

// dataSource 选项
const dataSourceOptions = ref<{ value: string; text: string }[]>([])
async function loadDataSourceOptions() {
  try {
    const data: any = await request.get({ url: '/admin-api/equipment/optEquipment/listOfDataSource' })
    dataSourceOptions.value = data || []
  } catch (e) {
    dataSourceOptions.value = [
      { value: 'ERP_SYNC', text: 'ERP同步' },
      { value: 'EAM_SELF_BUILD', text: 'EAM自制' },
      { value: 'EAM_MANUAL', text: 'EAM手工' }
    ]
  }
}

function getDataSourceText(value?: string) {
  return dataSourceOptions.value.find(d => d.value === value)?.text || (value || '—')
}

function getDataSourceTagType(value?: string): 'primary' | 'warning' | 'info' | 'success' | 'danger' {
  switch (value) {
    case 'ERP_SYNC': return 'primary'
    case 'EAM_SELF_BUILD': return 'warning'
    case 'EAM_MANUAL': return 'info'
    default: return 'info'
  }
}

// ==================== 设备分类 Tabs ====================
const activeTab = ref('all')
const categoryTabs = ref<any[]>([])
const loadCategoryTabs = async () => {
  try {
    const res = await EquipmentApi.getEquipmentCategoryList()
    categoryTabs.value = res?.records ?? []
  } catch (error) {
    console.error('加载设备分类列表失败:', error)
  }
}
const handleTabChange = () => {
  queryParams.pageNo = 1
  getList()
}

// ==================== 列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<EquipmentApi.OptEquipmentVo[]>([])
const selectedIds = ref<string[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  equipmentTag: undefined as string | undefined,
  equipmentType: undefined as string | undefined,
  equipmentStatus: undefined as string | undefined,
  operationStatus: undefined as string | undefined,
  dataSource: undefined as string | undefined,
  categoryPathByType: undefined as string | undefined,
  categoryPathByProcess: undefined as string | undefined,
  categoryPathByPlan: undefined as string | undefined
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const params: any = { ...queryParams }
    if (activeTab.value !== 'all') params.equipmentCategory = activeTab.value
    const res = await EquipmentApi.getEquipmentPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => { queryParams.pageNo = 1; getList() }

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  // 重置不影响树过滤
  handleQuery()
}

const selectedRows = ref<EquipmentApi.OptEquipmentVo[]>([])
const handleSelectionChange = (rows: EquipmentApi.OptEquipmentVo[]) => {
  selectedIds.value = rows.map(row => row.id!)
  selectedRows.value = rows
}

// ==================== 二维码 + 批量打印 ====================
const qrcodeRef = ref<InstanceType<typeof QrcodeDialog>>()
const batchPrintRef = ref<InstanceType<typeof BatchLabelPrint>>()
const openQrcode = (row: EquipmentApi.OptEquipmentVo) => {
  qrcodeRef.value?.open({
    equipmentSn: row.equipmentSn!,
    equipmentName: row.equipmentName!,
  })
}
const openBatchPrint = () => {
  if (selectedRows.value.length === 0) return
  batchPrintRef.value?.open(
    selectedRows.value.map(r => ({
      equipmentSn: r.equipmentSn!,
      equipmentName: r.equipmentName!,
    }))
  )
}

const getOperationStatusClass = (status: string) => {
  const m: Record<string, string> = { '1': 'status-run', '2': 'status-close', '3': 'status-standby', '4': 'status-failure' }
  return m[status] || ''
}

// ==================== 新增/编辑/详情 ====================
const formRef = ref()
const openForm = (type: string, id?: string) => formRef.value?.open(type, id)

const detailRef = ref()
const openDetail = (id: string) => detailRef.value?.open(id)

// ==================== 删除 ====================
const handleDelete = async (id: string) => {
  try {
    await message.delConfirm()
    await EquipmentApi.deleteEquipment(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleBatchDelete = async () => {
  try {
    await message.delConfirm('是否确认删除选中的数据？')
    await EquipmentApi.deleteEquipmentBatch(selectedIds.value.join(','))
    message.success(t('common.delSuccess'))
    selectedIds.value = []
    await getList()
  } catch {}
}

// ==================== 手动同步 ERP ====================
const syncDialogVisible = ref(false)
const syncLoading = ref(false)
const syncForm = reactive({
  materialNo: '',
  dateRange: [] as string[]
})

function openSyncDialog() {
  syncForm.materialNo = ''
  syncForm.dateRange = []
  syncDialogVisible.value = true
}

async function confirmSync() {
  syncLoading.value = true
  try {
    const body: any = {
      materialNo: syncForm.materialNo || undefined,
      dateRange: syncForm.dateRange?.length ? syncForm.dateRange : undefined
    }
    const newOne: any = await request.post({
      url: '/admin-api/equipment/optEquipment/syncFromErp',
      data: body
    })
    ElMessage.success(`同步完成：${newOne?.equipmentSn || '已新增 1 台设备'}`)
    syncDialogVisible.value = false
    await getList()
    await buildTree()
  } catch (e) {
    ElMessage.error('同步失败')
    console.error(e)
  } finally {
    syncLoading.value = false
  }
}

// ==================== 端别变更监听 ====================
watch(plantCode, () => {
  // 切端别后重建树（防止从 ALL→C 视图错乱）
  buildTree()
})

onMounted(async () => {
  await Promise.all([
    eamEnumStore.loadEquipmentEnums(),
    loadEquipmentTypeOptions(),
    loadCategoryTabs(),
    loadDataSourceOptions()
  ])
  await getList()
  await buildTree()
})
</script>

<style lang="scss" scoped>
.tree-tab-hint {
  font-size: 12px;
  color: #606266;

  b {
    color: #303133;
  }

  .hint-sub {
    color: #909399;
  }
}

.operation-status-dot {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.status-run { background: #3f9901; }
.status-failure { background: #e13d35; }
.status-standby { background: #f0c803; }
.status-close { background: #989b9a; }

:deep(.el-button.btn-edit) {
  color: #0097ba;
  &:hover { color: rgb(0 151 186 / 75%); }
}
:deep(.el-button.btn-delete) {
  color: #d54941;
  &:hover { color: rgb(213 73 65 / 75%); }
}
:deep(.el-button.btn-other) {
  color: #a5d867;
  &:hover { color: rgb(165 216 103 / 75%); }
}
</style>
