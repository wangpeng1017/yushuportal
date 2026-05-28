<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tooling-outbound/page"
    :columns="columns"
    :searchFields="[{ prop: 'outboundCode', label: '出库单号' }, { prop: 'receiverName', label: '领用人' }]"
    :enableCreate="true"
    :enableDetail="true"
    :enableEdit="true"
    :enableDelete="true"
    deleteNameProp="outboundCode"
    detailTitleProp="outboundCode"
    @create="handleCreate"
    @edit="handleEdit"
  />
  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/tooling-outbound/create"
    apiUpdate="/admin-api/eam/tooling-outbound/update"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolingOutbound">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'outboundCode', label: '出库单号', width: 180 },
  {
    prop: 'outboundType', label: '出库类型', width: 100,
    tag: (r: any) => {
      const t = r.outboundType
      return t === '领用' ? 'primary' : (t === '借用' ? 'warning' : (t === '调拨' ? 'info' : 'danger'))
    }
  },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'quantity', label: '数量', width: 80 },
  { prop: 'receiverName', label: '领用人', width: 120 },
  { prop: 'usageProcess', label: '用途/工序', minWidth: 200 },
  { prop: 'productionOrderNo', label: '生产订单', width: 200 },
  { prop: 'expectedReturnDate', label: '预计归还', width: 120 },
  { prop: 'outboundTime', label: '出库时间', width: 160 },
]

const formFields = [
  { prop: 'outboundType', label: '出库类型', type: 'select' as const, required: true, options: [
    { label: '领用', value: '领用' },
    { label: '借用（量具专属）', value: '借用' },
    { label: '调拨', value: '调拨' },
    { label: '报废', value: '报废' },
  ] },
  { prop: 'toolType', label: '工器具类型', type: 'select' as const, required: true, options: [
    { label: '刀具', value: '刀具' },
    { label: '量具', value: '量具' },
    { label: '模具', value: '模具' },
  ] },
  { prop: 'itemCode', label: '工器具编号', required: true, placeholder: '模具出库时扫描模架条码' },
  { prop: 'quantity', label: '数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'receiverName', label: '领用人', required: true },
  { prop: 'usageProcess', label: '用途/工序', placeholder: '如 A1 设备外圆粗车' },
  { prop: 'productionOrderNo', label: '生产订单', placeholder: '模具必填，由 MES 提供' },
  { prop: 'expectedReturnDate', label: '预计归还日期', type: 'date' as const, placeholder: '借用类型必填' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const formTitle = ref('新增出库单')

function handleCreate() {
  formTitle.value = '新增出库单'
  formRef.value?.open()
}

function handleEdit(row: any) {
  formTitle.value = '编辑出库单'
  formRef.value?.open(row.id, row)
}

function reloadList() {
  listRef.value?.loadList()
}
</script>
