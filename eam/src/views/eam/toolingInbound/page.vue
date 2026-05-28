<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tooling-inbound/page"
    :columns="columns"
    :searchFields="[{ prop: 'inboundCode', label: '入库单号' }, { prop: 'purchaseOrderNo', label: 'PO 单号' }]"
    :enableCreate="true"
    :enableDetail="true"
    :enableEdit="true"
    :enableDelete="true"
    deleteNameProp="inboundCode"
    detailTitleProp="inboundCode"
    @create="handleCreate"
    @edit="handleEdit"
  />
  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/tooling-inbound/create"
    apiUpdate="/admin-api/eam/tooling-inbound/update"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolingInbound">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'inboundCode', label: '入库单号', width: 180 },
  { prop: 'inboundType', label: '入库类型', width: 110, tag: (r: any) => r.inboundType === '采购入库' ? 'success' : (r.inboundType === '退库入库' ? 'warning' : 'info') },
  { prop: 'purchaseOrderNo', label: 'PO 单号', width: 180 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'quantity', label: '入库数量', width: 100 },
  { prop: 'storageLocation', label: '仓位', width: 140 },
  { prop: 'operatorName', label: '入库人', width: 100 },
  { prop: 'inboundTime', label: '入库时间', width: 160 },
  { prop: 'remark', label: '备注', minWidth: 200 },
]

const formFields = [
  { prop: 'inboundType', label: '入库类型', type: 'select' as const, required: true, options: [
    { label: '采购入库', value: '采购入库' },
    { label: '退库入库', value: '退库入库' },
    { label: '调拨入库', value: '调拨入库' },
  ] },
  { prop: 'toolType', label: '工器具类型', type: 'select' as const, required: true, options: [
    { label: '刀具', value: '刀具' },
    { label: '量具', value: '量具' },
    { label: '模具', value: '模具' },
  ] },
  { prop: 'purchaseOrderNo', label: 'PO 单号', placeholder: '采购入库时必填，关联 ERP 回写' },
  { prop: 'relatedOutboundCode', label: '关联出库单号', placeholder: '退库入库时必填' },
  { prop: 'itemCode', label: '工器具编号', required: true },
  { prop: 'quantity', label: '入库数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'storageLocation', label: '入库仓位', required: true },
  { prop: 'operatorName', label: '入库人' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24, placeholder: '模具入库时系统自动打印模架条码' },
]

const listRef = ref()
const formRef = ref()
const formTitle = ref('新增入库单')

function handleCreate() {
  formTitle.value = '新增入库单'
  formRef.value?.open()
}

function handleEdit(row: any) {
  formTitle.value = '编辑入库单'
  formRef.value?.open(row.id, row)
}

function reloadList() {
  listRef.value?.loadList()
}
</script>
