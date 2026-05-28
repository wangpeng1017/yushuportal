<template>
  <TreeListLayout :tree-data="treeData" @select="handleTreeSelect">
    <template #default>
      <SimpleListPage
        :key="`tool-${selectedCategory}`"
        ref="listRef"
        apiPath="/admin-api/eam/tool-master/page"
        :columns="columns"
        :searchFields="[
          { prop: 'toolName', label: '刀具名称' },
          { prop: 'toolCode', label: '刀具编号' },
        ]"
        :enableCreate="true"
        :enableDetail="true"
        :enableEdit="true"
        :enableDelete="true"
        deleteNameProp="toolName"
        detailTitleProp="toolName"
        :extraQuery="{ categoryFilter: selectedCategory }"
        @create="handleCreate"
        @edit="handleEdit"
      />
    </template>
  </TreeListLayout>
  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/tool-master/create"
    apiUpdate="/admin-api/eam/tool-master/update"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolMaster">
import { ref, onMounted, nextTick } from 'vue'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'

const columns = [
  { prop: 'toolCode', label: '刀具编号', width: 200 },
  { prop: 'toolName', label: '刀具名称', minWidth: 180 },
  { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
  { prop: 'specification', label: '规格型号', minWidth: 180 },
  { prop: 'material', label: '材质', width: 120 },
  { prop: 'brand', label: '品牌', width: 120 },
  { prop: 'purchaseOrderNo', label: '采购订单号', width: 160 },
  { prop: 'currentStock', label: '当前库存', width: 100 },
  { prop: 'unit', label: '单位', width: 80 },
  { prop: 'storageLocation', label: '仓位', width: 140 },
  { prop: 'status', label: '状态', width: 100, tag: (r: any) => r.status === '已启用' ? 'success' : 'info' },
]

const formFields = [
  { prop: 'toolName', label: '刀具名称', required: true },
  { prop: 'specification', label: '规格型号', required: true },
  { prop: 'material', label: '材质', type: 'select' as const, required: true, options: [
    { label: '硬质合金', value: '硬质合金' },
    { label: '高速钢', value: '高速钢' },
    { label: '陶瓷', value: '陶瓷' },
    { label: 'CBN', value: 'CBN' },
  ] },
  { prop: 'brand', label: '品牌' },
  { prop: 'supplierName', label: '供应商' },
  { prop: 'inboundQty', label: '首次入库数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'unit', label: '单位', placeholder: '把' },
  { prop: 'unitPrice', label: '单价', type: 'number' as const, precision: 2 },
  { prop: 'storageLocation', label: '仓位' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const selectedCategory = ref<string>('ALL')
const treeData = ref<any[]>([])
const allTools = ref<any[]>([])
const formTitle = ref('新增刀具档案')

function handleCreate() {
  formTitle.value = '新增刀具档案'
  formRef.value?.open()
}

function handleEdit(row: any) {
  formTitle.value = '编辑刀具档案'
  formRef.value?.open(row.id, row)
}

function reloadList() {
  listRef.value?.loadList()
}

async function handleTreeSelect(key: string) {
  selectedCategory.value = key
  await nextTick()
  listRef.value?.loadList()
}

// 从所有刀具档案的 categoryPath 自动构建 5 级分类树
async function buildTree() {
  const listRes: any = await request.get({
    url: '/admin-api/eam/tool-master/page', params: { pageNo: 1, pageSize: 1000 }
  })
  allTools.value = listRes?.records || []
  treeData.value = buildTreeFromPaths(allTools.value, '全部')
}

function buildTreeFromPaths(items: any[], rootLabel: string): any[] {
  // 用 Map 嵌套结构组装多级树（key=完整路径，label=节点名）
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
      key: node.fullPath,
      label: node.name,
      count: node.count,
      children: node.children.size > 0 ? toArray(node.children) : undefined
    }))
  }

  return [
    {
      key: 'ALL',
      label: rootLabel,
      count: items.length,
      children: toArray(root.children)
    }
  ]
}

onMounted(() => buildTree())
</script>
