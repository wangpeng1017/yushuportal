<template>
  <TreeListLayout :tree-data="treeData" @select="handleTreeSelect">
    <template #default>
      <SimpleListPage
        :key="`mould-${selectedCategory}`"
        ref="listRef"
        apiPath="/admin-api/eam/mould-master/page"
        :columns="columns"
        :searchFields="[
          { prop: 'mouldName', label: '模具名称' },
          { prop: 'barcode', label: '模架条码' },
        ]"
        :enableCreate="true"
        :enableDetail="true"
        :enableEdit="true"
        :enableDelete="true"
        deleteNameProp="mouldName"
        detailTitleProp="mouldName"
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
    apiCreate="/admin-api/eam/mould-master/create"
    apiUpdate="/admin-api/eam/mould-master/update"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamMouldMaster">
import { ref, onMounted, nextTick } from 'vue'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'
import TreeListLayout from '../_tooling-shared/TreeListLayout.vue'

const columns = [
  { prop: 'mouldCode', label: '模具编号', width: 220 },
  { prop: 'mouldName', label: '模具名称', minWidth: 200 },
  { prop: 'barcode', label: '模架条码', width: 180 },
  { prop: 'categoryPath', label: '分类路径', minWidth: 320 },
  { prop: 'processType', label: '工艺', width: 100 },
  { prop: 'specification', label: '规格', width: 120 },
  { prop: 'currentProductionOrder', label: '当前生产订单', width: 200 },
  { prop: 'usageCount', label: '累计使用', width: 110 },
  {
    prop: 'status', label: '状态', width: 100,
    tag: (r: any) => r.status === '在用' ? 'success' : (r.status === '在库' ? 'info' : (r.status === '维修中' ? 'warning' : 'danger'))
  },
  { prop: 'storageLocation', label: '仓位', width: 140 },
]

const formFields = [
  { prop: 'mouldName', label: '模具名称', required: true },
  { prop: 'processType', label: '工艺类型', type: 'select' as const, required: true, options: [
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
  { prop: 'unitPrice', label: '单价', type: 'number' as const, precision: 2 },
  { prop: 'storageLocation', label: '仓位' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const selectedCategory = ref<string>('ALL')
const treeData = ref<any[]>([])
const allMoulds = ref<any[]>([])
const formTitle = ref('新增模具档案')

function handleCreate() {
  formTitle.value = '新增模具档案'
  formRef.value?.open()
}

function handleEdit(row: any) {
  formTitle.value = '编辑模具档案'
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

async function buildTree() {
  const listRes: any = await request.get({
    url: '/admin-api/eam/mould-master/page', params: { pageNo: 1, pageSize: 1000 }
  })
  allMoulds.value = listRes?.records || []

  // 从 categoryPath 自动构建多级树（key=完整路径，label=节点名）
  const root: any = { children: new Map<string, any>() }
  allMoulds.value.forEach((item: any) => {
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

  treeData.value = [
    { key: 'ALL', label: '全部', count: allMoulds.value.length, children: toArray(root.children) }
  ]
}

onMounted(() => buildTree())
</script>
