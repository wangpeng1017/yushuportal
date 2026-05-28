<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/base-data/maintenance-type/page"
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
    apiCreate="/admin-api/eam/base-data/maintenance-type/create"
    apiUpdate="/admin-api/eam/base-data/maintenance-type/update"
    @success="reload"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import SimpleListPage from '../../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'code', label: '类型编码', width: 140 },
  { prop: 'name', label: '类型名称', width: 140 },
  { prop: 'category', label: '保养级别', width: 120, tag: () => 'primary' },
  { prop: 'description', label: '描述', minWidth: 220 },
  { prop: 'remark', label: '备注', minWidth: 160 },
  { prop: 'sort', label: '排序', width: 70 },
]
const searchFields = [
  { prop: 'code', label: '类型编码' },
  { prop: 'name', label: '类型名称' },
  { prop: 'category', label: '保养级别' },
]
const formFields = [
  { prop: 'code', label: '类型编码', required: true },
  { prop: 'name', label: '类型名称', required: true },
  { prop: 'category', label: '保养级别', type: 'select' as const, options: ['一级保养', '二级保养', '三级保养', '专项保养', '预测保养', '改造升级'].map(v => ({ label: v, value: v })) },
  { prop: 'sort', label: '排序', type: 'number' as const, min: 0 },
  { prop: 'description', label: '描述', type: 'textarea' as const, span: 24 },
  { prop: 'remark', label: '备注', span: 24 },
]

const listRef = ref<any>()
const formRef = ref<any>()
const formTitle = ref('')
function reload() { listRef.value?.loadList?.() }
function handleCreate() { formTitle.value = '新增维保类型'; formRef.value?.open?.() }
function handleEdit(row: any) { formTitle.value = '编辑维保类型'; formRef.value?.open?.(row.id, row) }
</script>
