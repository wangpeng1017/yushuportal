<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/tooling-scrap/page"
    :columns="columns"
    :searchFields="[{ prop: 'scrapCode', label: '报废单号' }, { prop: 'itemCode', label: '工器具编号' }]"
    :enableCreate="true"
    :enableDetail="true"
    :enableEdit="true"
    :enableDelete="true"
    deleteNameProp="scrapCode"
    detailTitleProp="scrapCode"
    @create="handleCreate"
    @edit="handleEdit"
  />
  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/tooling-scrap/create"
    apiUpdate="/admin-api/eam/tooling-scrap/update"
    @success="reloadList"
  />
</template>

<script setup lang="ts" name="EamToolingScrap">
import { ref } from 'vue'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'scrapCode', label: '报废单号', width: 180 },
  { prop: 'toolType', label: '类型', width: 80 },
  { prop: 'itemCode', label: '工器具编号', width: 220 },
  { prop: 'scrapQuantity', label: '报废数量', width: 100 },
  {
    prop: 'scrapReason', label: '报废原因', width: 120,
    tag: (r: any) => r.scrapReason === '损坏' ? 'danger' : (r.scrapReason === '损耗' ? 'warning' : (r.scrapReason === '丢失' ? 'danger' : 'info'))
  },
  { prop: 'reasonDetail', label: '详情', minWidth: 240 },
  { prop: 'disposalType', label: '处理方式', width: 100 },
  { prop: 'operatorName', label: '报废人', width: 100 },
  { prop: 'reviewerName', label: '审核人', width: 100 },
  { prop: 'scrapTime', label: '报废时间', width: 160 },
]

const formFields = [
  { prop: 'toolType', label: '工器具类型', type: 'select' as const, required: true, options: [
    { label: '刀具', value: '刀具' },
    { label: '量具', value: '量具' },
    { label: '模具', value: '模具' },
  ] },
  { prop: 'itemCode', label: '工器具编号', required: true },
  { prop: 'scrapQuantity', label: '报废数量', type: 'number' as const, required: true, min: 1 },
  { prop: 'scrapReason', label: '报废原因', type: 'select' as const, required: true, options: [
    { label: '损耗', value: '损耗' },
    { label: '损坏', value: '损坏' },
    { label: '精度不达标', value: '精度不达标' },
    { label: '丢失', value: '丢失' },
    { label: '其他', value: '其他' },
  ] },
  { prop: 'reasonDetail', label: '原因详情', type: 'textarea' as const, span: 24 },
  { prop: 'disposalType', label: '处理方式', type: 'select' as const, required: true, options: [
    { label: '销毁', value: '销毁' },
    { label: '回收', value: '回收' },
    { label: '卖废品', value: '卖废品' },
    { label: '保留', value: '保留' },
  ] },
  { prop: 'operatorName', label: '报废人' },
  { prop: 'reviewerName', label: '审核人' },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const formTitle = ref('新增报废登记')

function handleCreate() {
  formTitle.value = '新增报废登记'
  formRef.value?.open()
}

function handleEdit(row: any) {
  formTitle.value = '编辑报废登记'
  formRef.value?.open(row.id, row)
}

function reloadList() {
  listRef.value?.loadList()
}
</script>
