<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/base-data/spot-inspection-item/page"
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
    apiCreate="/admin-api/eam/base-data/spot-inspection-item/create"
    apiUpdate="/admin-api/eam/base-data/spot-inspection-item/update"
    @success="reload"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import SimpleListPage from '../../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'code', label: '点检项编码', width: 140 },
  { prop: 'name', label: '点检项名称', width: 160 },
  { prop: 'category', label: '所属系统', width: 110 },
  { prop: 'unit', label: '检测方法/单位', width: 130 },
  { prop: 'description', label: '检测标准', minWidth: 220 },
  { prop: 'remark', label: '点检周期', width: 90 },
]
const searchFields = [
  { prop: 'code', label: '点检项编码' },
  { prop: 'name', label: '点检项名称' },
  { prop: 'category', label: '所属系统' },
]
const formFields = [
  { prop: 'code', label: '点检项编码', required: true },
  { prop: 'name', label: '点检项名称', required: true },
  { prop: 'category', label: '所属系统', type: 'select' as const, options: ['液压系统', '润滑系统', '气动系统', '电气系统', '机械系统', '安全装置', '精度', '辅助系统', '通用项'].map(v => ({ label: v, value: v })) },
  { prop: 'unit', label: '方法/单位' },
  { prop: 'remark', label: '点检周期', type: 'select' as const, options: ['日点检', '周点检', '月点检', '季度点检', '年度点检'].map(v => ({ label: v, value: v })) },
  { prop: 'sort', label: '排序', type: 'number' as const, min: 0 },
  { prop: 'description', label: '检测标准', type: 'textarea' as const, span: 24 },
]

const listRef = ref<any>()
const formRef = ref<any>()
const formTitle = ref('')
function reload() { listRef.value?.loadList?.() }
function handleCreate() { formTitle.value = '新增点检项'; formRef.value?.open?.() }
function handleEdit(row: any) { formTitle.value = '编辑点检项'; formRef.value?.open?.(row.id, row) }
</script>
