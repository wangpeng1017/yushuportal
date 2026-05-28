<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/base-data/fault-code/page"
    :columns="columns"
    :searchFields="searchFields"
    :enableCreate="true"
    :enableEdit="true"
    :enableDelete="true"
    deleteNameProp="name"
    @create="handleCreate"
    @edit="handleEdit"
  />
  <SimpleFormDialog
    ref="formRef"
    :title="formTitle"
    :fields="formFields"
    apiCreate="/admin-api/eam/base-data/fault-code/create"
    apiUpdate="/admin-api/eam/base-data/fault-code/update"
    @success="reload"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import SimpleListPage from '../../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'code', label: '故障编码', width: 140 },
  { prop: 'name', label: '故障名称', width: 200 },
  { prop: 'category', label: '故障分类', width: 120 },
  { prop: 'level', label: '严重等级', width: 90, tag: (r: any) => (r.level === '紧急' ? 'danger' : r.level === '严重' ? 'warning' : 'info') },
  { prop: 'description', label: '故障描述', minWidth: 240 },
  { prop: 'sort', label: '排序', width: 70 },
  { prop: 'createTime', label: '创建时间', width: 160 },
]
const searchFields = [
  { prop: 'code', label: '故障编码' },
  { prop: 'name', label: '故障名称' },
  { prop: 'category', label: '故障分类' },
]
const formFields = [
  { prop: 'code', label: '故障编码', required: true },
  { prop: 'name', label: '故障名称', required: true },
  { prop: 'category', label: '故障分类', type: 'select' as const, options: ['机械故障', '电气故障', '气动故障', '液压故障', '控制故障', '工艺故障'].map(v => ({ label: v, value: v })) },
  { prop: 'level', label: '严重等级', type: 'select' as const, options: ['紧急', '严重', '一般', '轻微'].map(v => ({ label: v, value: v })) },
  { prop: 'sort', label: '排序', type: 'number' as const, min: 0 },
  { prop: 'description', label: '故障描述', type: 'textarea' as const, span: 24 },
]

const listRef = ref<any>()
const formRef = ref<any>()
const formTitle = ref('')
function reload() { listRef.value?.loadList?.() }
function handleCreate() { formTitle.value = '新增故障代码'; formRef.value?.open?.() }
function handleEdit(row: any) { formTitle.value = '编辑故障代码'; formRef.value?.open?.(row.id, row) }
</script>
