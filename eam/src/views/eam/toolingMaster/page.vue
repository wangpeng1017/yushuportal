<template>
  <div class="tooling-master-page">
    <TreeListLayout :tree-data="treeData" @select="handleTreeSelect" :default-key="'TOOL'">
      <template #default>
        <!-- 易耗品范围说明 -->
        <el-alert
          title="易耗品管理范围：当前覆盖「数控机加车间」（刀具 / 量具 / 夹具均按易耗品管理）。其他车间易耗品暂不纳入本模块。"
          type="info"
          :closable="false"
          show-icon
          class="mb-12px"
        />
        <!-- 顶部面包屑 -->
        <div class="tooling-breadcrumb">
          <el-tag size="large" :type="typeColor" effect="dark" class="mr-10px">
            <Icon :icon="typeIcon" class="mr-3px" />
            {{ typeLabel }}
          </el-tag>
          <el-tag size="small" type="info" class="mr-10px">
            <Icon icon="ep:cherry" class="mr-3px" />易耗品 · 数控机加车间
          </el-tag>
          <span class="text-13px text-gray-500">
            <span v-for="(seg, i) in pathSegs" :key="i">
              <span v-if="i > 0" class="mx-5px">/</span>
              <span>{{ seg }}</span>
            </span>
            <span v-if="pathSegs.length === 0" class="text-gray-400">全部 {{ typeLabel }}</span>
          </span>
        </div>

        <!-- 列表（按 type 切换） -->
        <SimpleListPage
          :key="listKey"
          ref="listRef"
          :api-path="apiPath"
          :columns="columns"
          :search-fields="searchFields"
          :enable-create="true"
          :enable-detail="true"
          :enable-edit="true"
          :enable-delete="true"
          :delete-name-prop="nameProp"
          :detail-title-prop="nameProp"
          :extra-query="{ categoryFilter: categoryFilter }"
          @create="handleCreate"
          @edit="handleEdit"
        />
      </template>
    </TreeListLayout>

    <SimpleFormDialog
      ref="formRef"
      :title="formTitle"
      :fields="formFields"
      :api-create="apiCreate"
      :api-update="apiUpdate"
      @success="reloadList"
    />
  </div>
</template>

<script setup lang="ts" name="EamToolingMaster">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'

// ============ 三类配置 ============
const TYPE_CONFIG: Record<string, any> = {
  TOOL: {
    label: '刀具',
    icon: 'ep:scissor',
    color: 'success',
    nameProp: 'toolName',
    apiPath: '/admin-api/eam/tool-master/page',
    apiCreate: '/admin-api/eam/tool-master/create',
    apiUpdate: '/admin-api/eam/tool-master/update',
    searchFields: [
      { prop: 'toolName', label: '刀具名称' },
      { prop: 'toolCode', label: '刀具编号' },
    ],
    columns: [
      { prop: 'toolCode', label: '刀具编号', width: 200 },
      { prop: 'toolName', label: '刀具名称', minWidth: 180 },
      { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
      { prop: 'specification', label: '规格型号', minWidth: 180 },
      { prop: 'material', label: '材质', width: 120 },
      { prop: 'brand', label: '品牌', width: 120 },
      { prop: 'currentStock', label: '当前库存', width: 100 },
      { prop: 'unit', label: '单位', width: 80 },
      { prop: 'storageLocation', label: '仓位', width: 140 },
      { prop: 'status', label: '状态', width: 100, tag: (r: any) => (r.status === '已启用' ? 'success' : 'info') },
    ],
    formFields: [
      { prop: 'toolName', label: '刀具名称', required: true },
      { prop: 'specification', label: '规格型号', required: true },
      { prop: 'material', label: '材质', type: 'select', required: true, options: [
        { label: '硬质合金', value: '硬质合金' },
        { label: '高速钢', value: '高速钢' },
        { label: '陶瓷', value: '陶瓷' },
        { label: 'CBN', value: 'CBN' },
      ] },
      { prop: 'brand', label: '品牌' },
      { prop: 'supplierName', label: '供应商' },
      { prop: 'inboundQty', label: '首次入库数量', type: 'number', required: true, min: 1 },
      { prop: 'unit', label: '单位', placeholder: '把' },
      { prop: 'unitPrice', label: '单价', type: 'number', precision: 2 },
      { prop: 'storageLocation', label: '仓位' },
      { prop: 'remark', label: '备注', type: 'textarea', span: 24 },
    ],
  },
  GAUGE: {
    label: '量具',
    icon: 'ep:histogram',
    color: 'warning',
    nameProp: 'gaugeName',
    apiPath: '/admin-api/eam/gauge-master/page',
    apiCreate: '/admin-api/eam/gauge-master/create',
    apiUpdate: '/admin-api/eam/gauge-master/update',
    searchFields: [
      { prop: 'gaugeName', label: '量具名称' },
      { prop: 'gaugeCode', label: '量具编号' },
    ],
    columns: [
      { prop: 'gaugeCode', label: '量具编号', width: 200 },
      { prop: 'gaugeName', label: '量具名称', minWidth: 200 },
      { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
      { prop: 'measureRange', label: '量程', width: 140 },
      { prop: 'accuracy', label: '精度', width: 120 },
      { prop: 'brand', label: '品牌', width: 120 },
      { prop: 'currentStock', label: '在库', width: 80 },
      { prop: 'borrowedQty', label: '借出', width: 80 },
      { prop: 'unit', label: '单位', width: 70 },
      { prop: 'storageLocation', label: '仓位', width: 140 },
      { prop: 'status', label: '状态', width: 100, tag: (r: any) => (r.status === '已启用' ? 'success' : 'info') },
    ],
    formFields: [
      { prop: 'gaugeName', label: '量具名称', required: true },
      { prop: 'measureRange', label: '量程', required: true, placeholder: '如 0-150mm' },
      { prop: 'accuracy', label: '精度', required: true, placeholder: '如 0.01mm' },
      { prop: 'brand', label: '品牌', placeholder: '如 三丰、马尔' },
      { prop: 'supplierName', label: '供应商' },
      { prop: 'inboundQty', label: '首次入库数量', type: 'number', required: true, min: 1 },
      { prop: 'unit', label: '单位', placeholder: '把/台' },
      { prop: 'unitPrice', label: '单价', type: 'number', precision: 2 },
      { prop: 'storageLocation', label: '仓位' },
      { prop: 'remark', label: '备注', type: 'textarea', span: 24 },
    ],
  },
  MOULD: {
    label: '模具',
    icon: 'ep:box',
    color: 'primary',
    nameProp: 'mouldName',
    apiPath: '/admin-api/eam/mould-master/page',
    apiCreate: '/admin-api/eam/mould-master/create',
    apiUpdate: '/admin-api/eam/mould-master/update',
    searchFields: [
      { prop: 'mouldName', label: '模具名称' },
      { prop: 'mouldCode', label: '模具编号' },
    ],
    columns: [
      { prop: 'mouldCode', label: '模具编号', width: 220 },
      { prop: 'mouldName', label: '模具名称', minWidth: 200 },
      { prop: 'barcode', label: '模架条码', width: 180 },
      { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
      { prop: 'processType', label: '工艺', width: 100 },
      { prop: 'specification', label: '规格', width: 120 },
      { prop: 'currentProductionOrder', label: '当前生产订单', width: 200 },
      { prop: 'usageCount', label: '累计使用', width: 110 },
      { prop: 'status', label: '状态', width: 100, tag: (r: any) => (r.status === '在用' ? 'success' : (r.status === '在库' ? 'info' : (r.status === '维修中' ? 'warning' : 'danger'))) },
      { prop: 'storageLocation', label: '仓位', width: 140 },
    ],
    formFields: [
      { prop: 'mouldName', label: '模具名称', required: true },
      { prop: 'processType', label: '工艺类型', type: 'select', required: true, options: [
        { label: '注塑', value: '注塑' },
        { label: '冲压', value: '冲压' },
        { label: '压铸', value: '压铸' },
        { label: '锻造', value: '锻造' },
        { label: '工装夹具', value: '工装夹具' },
      ] },
      { prop: 'specification', label: '规格', required: true, placeholder: '如 1出4 / 8工位' },
      { prop: 'mouldFrameNo', label: '模架编号', placeholder: '系统将自动生成模架条码' },
      { prop: 'productCode', label: '适用产品' },
      { prop: 'supplierName', label: '供应商' },
      { prop: 'unitPrice', label: '单价', type: 'number', precision: 2 },
      { prop: 'storageLocation', label: '仓位' },
      { prop: 'remark', label: '备注', type: 'textarea', span: 24 },
    ],
  },
}

// ============ 状态 ============
const listRef = ref()
const formRef = ref()
const treeData = ref<any[]>([])
const selectedKey = ref<string>('TOOL') // 完整 key，如 'TOOL' 或 'TOOL/车削/车外圆'
const formTitle = ref('')

// ============ 计算 ============
const currentType = computed<'TOOL' | 'GAUGE' | 'MOULD'>(() => {
  const k = selectedKey.value || 'TOOL'
  if (k.startsWith('GAUGE')) return 'GAUGE'
  if (k.startsWith('MOULD')) return 'MOULD'
  return 'TOOL'
})
const categoryFilter = computed(() => {
  // 去除 type 前缀，剩余即为 categoryPath 过滤
  const k = selectedKey.value
  const idx = k.indexOf('/')
  if (idx === -1) return 'ALL' // 仅根节点 = 全部
  return k.substring(idx + 1)
})
const pathSegs = computed(() => {
  const cat = categoryFilter.value
  if (!cat || cat === 'ALL') return []
  return cat.split('/').filter(Boolean)
})
const cfg = computed(() => TYPE_CONFIG[currentType.value])
const typeLabel = computed(() => cfg.value.label)
const typeIcon = computed(() => cfg.value.icon)
const typeColor = computed(() => cfg.value.color)
const nameProp = computed(() => cfg.value.nameProp)
const apiPath = computed(() => cfg.value.apiPath)
const apiCreate = computed(() => cfg.value.apiCreate)
const apiUpdate = computed(() => cfg.value.apiUpdate)
const columns = computed(() => cfg.value.columns)
const searchFields = computed(() => cfg.value.searchFields)
const formFields = computed(() => cfg.value.formFields)
const listKey = computed(() => `${currentType.value}-${categoryFilter.value}`)

// ============ 方法 ============
function handleCreate() {
  formTitle.value = `新增${typeLabel.value}档案`
  formRef.value?.open()
}
function handleEdit(row: any) {
  formTitle.value = `编辑${typeLabel.value}档案`
  formRef.value?.open(row.id, row)
}
function reloadList() {
  listRef.value?.loadList?.()
}
function handleTreeSelect(key: string) {
  selectedKey.value = key
}

// ============ 树构建 ============
async function buildTree() {
  const types: Array<['TOOL' | 'GAUGE' | 'MOULD', string]> = [
    ['TOOL', '/admin-api/eam/tool-master/page'],
    ['GAUGE', '/admin-api/eam/gauge-master/page'],
    ['MOULD', '/admin-api/eam/mould-master/page'],
  ]
  const roots: any[] = []
  for (const [type, url] of types) {
    const res: any = await request.get({ url, params: { pageNo: 1, pageSize: 1000 } })
    const items = res?.records || res?.list || []
    const tree = buildTreeFromPaths(items, type)
    roots.push({
      key: type,
      label: `${TYPE_CONFIG[type].label}（${items.length}）`,
      count: items.length,
      children: tree,
    })
  }
  treeData.value = roots
}

function buildTreeFromPaths(items: any[], typePrefix: string): any[] {
  const root: any = { children: new Map<string, any>() }
  items.forEach((item: any) => {
    const segs = (item.categoryPath || '').split('/').filter(Boolean)
    let cur = root
    let path = ''
    for (const seg of segs) {
      path = path ? `${path}/${seg}` : seg
      if (!cur.children.has(seg)) {
        cur.children.set(seg, { name: seg, fullPath: path, count: 0, children: new Map() })
      }
      cur = cur.children.get(seg)
      cur.count++
    }
  })
  function toArray(map: Map<string, any>): any[] {
    return Array.from(map.values()).map(node => ({
      key: `${typePrefix}/${node.fullPath}`,
      label: node.name,
      count: node.count,
      children: node.children.size > 0 ? toArray(node.children) : undefined,
    }))
  }
  return toArray(root.children)
}

onMounted(() => buildTree())
</script>

<style scoped>
.tooling-breadcrumb {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  border-left: 3px solid var(--el-color-primary);
}
</style>
