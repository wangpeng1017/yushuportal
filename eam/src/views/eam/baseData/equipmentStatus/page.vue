<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/base-data/equipment-status/page"
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
    apiCreate="/admin-api/eam/base-data/equipment-status/create"
    apiUpdate="/admin-api/eam/base-data/equipment-status/update"
    @success="reload"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import SimpleListPage from '../../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'code', label: '状态编码', width: 140 },
  { prop: 'name', label: '状态名称', width: 120 },
  { prop: 'sort', label: '排序', width: 80 },
  { prop: 'enabled', label: '启用', width: 80, formatter: (r: any) => (r.enabled ? '是' : '否') },
  { prop: 'remark', label: '说明', minWidth: 200 },
  { prop: 'createTime', label: '创建时间', width: 160 },
]
const searchFields = [
  { prop: 'code', label: '状态编码' },
  { prop: 'name', label: '状态名称' },
]
const formFields = [
  { prop: 'code', label: '状态编码', required: true },
  { prop: 'name', label: '状态名称', required: true },
  { prop: 'sort', label: '排序', type: 'number' as const, min: 0 },
  { prop: 'enabled', label: '是否启用', type: 'select' as const, options: [{ label: '启用', value: true }, { label: '停用', value: false }] },
  { prop: 'remark', label: '说明', type: 'textarea' as const, span: 24 },
]

const listRef = ref<any>()
const formRef = ref<any>()
const formTitle = ref('')
function reload() { listRef.value?.loadList?.() }
function handleCreate() { formTitle.value = '新增设备状态'; formRef.value?.open?.() }
function handleEdit(row: any) { formTitle.value = '编辑设备状态'; formRef.value?.open?.(row.id, row) }
</script>
