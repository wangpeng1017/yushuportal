<template>
  <div class="patrol-plan-page">
    <!-- 搜索区 -->
    <ContentWrap>
      <el-form :model="queryParams" :inline="true" label-width="90px" class="-mb-15px">
        <el-form-item label="计划编号" prop="code">
          <el-input v-model="queryParams.code" class="!w-200px" clearable placeholder="请输入计划编号" />
        </el-form-item>
        <el-form-item label="计划名称" prop="name">
          <el-input v-model="queryParams.name" class="!w-200px" clearable placeholder="请输入计划名称" />
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="queryParams.area" placeholder="全部" clearable class="!w-160px">
            <el-option label="动力区" value="动力区" />
            <el-option label="环保区" value="环保区" />
            <el-option label="C 端 PACK 车间" value="C端" />
            <el-option label="B 端电子车间" value="B端" />
          </el-select>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-120px">
            <el-option label="启用" value="启用" />
            <el-option label="停用" value="停用" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 主表 -->
    <ContentWrap>
      <div class="table-toolbar">
        <el-button plain type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />新增
        </el-button>
        <el-button plain type="danger" :disabled="selectedIds.length === 0" @click="handleBatchDelete">
          <Icon icon="ep:delete" class="mr-5px" />批量删除
        </el-button>
      </div>

      <el-table :data="filteredList" stripe @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="计划编号" prop="code" width="130" align="center" />
        <el-table-column label="计划名称" prop="name" min-width="200" />
        <el-table-column label="绑定路线" prop="route" width="200" align="center">
          <template #default="{row}">
            <el-tag type="warning" size="small">{{ row.route }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="所属区域" prop="area" width="120" align="center" />
        <el-table-column label="频次" prop="period" width="160" align="center" />
        <el-table-column label="漏点告警阈值" prop="missThreshold" width="120" align="center" />
        <el-table-column label="允许补检" prop="allowSkip" width="100" align="center">
          <template #default="{row}">
            <el-tag size="small" :type="row.allowSkip === '是' ? 'success' : 'info'">{{ row.allowSkip }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="80" align="center">
          <template #default="{row}">
            <el-tag size="small" :type="row.status === '启用' ? 'success' : 'info'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="creator" width="100" align="center" />
        <el-table-column label="创建时间" prop="createTime" width="160" align="center" />
        <el-table-column label="操作" align="center" fixed="right" width="240">
          <template #default="{row}">
            <el-button link class="btn-other" @click="openForm('view', row)">查看</el-button>
            <el-button link class="btn-edit" @click="openForm('edit', row)">编辑</el-button>
            <el-button link type="success" @click="generateWork(row)">生成工单</el-button>
            <el-button link class="btn-delete" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :total="filteredList.length"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
      />
    </ContentWrap>

    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="640px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" :disabled="dialogMode === 'view'">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="计划编号" prop="code">
              <el-input v-model="formData.code" :disabled="dialogMode !== 'create'" placeholder="系统自动生成" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入计划名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="绑定路线" prop="route">
              <el-select v-model="formData.route" placeholder="请选择巡检路线" filterable style="width:100%;">
                <el-option v-for="r in routeOptions" :key="r" :label="r" :value="r" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属区域" prop="area">
              <el-input v-model="formData.area" placeholder="自动同步路线区域" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="频次" prop="period">
              <el-select v-model="formData.period" placeholder="请选择频次" style="width:100%;">
                <el-option label="每日 1 次" value="每日 1 次" />
                <el-option label="每日 3 次（早 / 中 / 夜）" value="每日 3 次（早 / 中 / 夜）" />
                <el-option label="每 2 小时" value="每 2 小时" />
                <el-option label="每周 1 次" value="每周 1 次" />
                <el-option label="每月 1 次" value="每月 1 次" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏点告警阈值">
              <el-input-number v-model="formData.missThreshold" :min="0" :max="20" style="width:100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="允许补检">
              <el-radio-group v-model="formData.allowSkip">
                <el-radio value="是">是</el-radio>
                <el-radio value="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="formData.status">
                <el-radio value="启用">启用</el-radio>
                <el-radio value="停用">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button v-if="dialogMode !== 'view'" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">{{ dialogMode === 'view' ? '关闭' : '取消' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from 'vue'

defineOptions({ name: 'EamPatrolPlan' })

const message = useMessage()
const queryParams = reactive({ code: '', name: '', area: '', status: '', pageNo: 1, pageSize: 10 })
const selectedIds = ref<string[]>([])
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit' | 'view'>('create')
const dialogTitle = computed(() => ({ create: '新增巡检计划', edit: '编辑巡检计划', view: '巡检计划详情' }[dialogMode.value]))
const formRef = ref()
const formData = reactive<any>({ code: '', name: '', route: '', area: '', period: '', missThreshold: 1, allowSkip: '否', status: '启用' })
const formRules = {
  name: [{ required: true, message: '请输入计划名称', trigger: 'blur' }],
  route: [{ required: true, message: '请选择巡检路线', trigger: 'change' }],
  period: [{ required: true, message: '请选择频次', trigger: 'change' }]
}

const routeOptions = [
  'CR-C-001 PACK 车间日常巡检',
  'CR-C-002 电机装配线巡检',
  'CR-B-001 B 端电子车间巡检',
  'CR-B-002 来料检验区巡检',
  'CR-N-001 数控加工车间巡检',
  'CR-PWR-001 配电室路线',
  'CR-PWR-002 锅炉房路线'
]

const list = ref<any[]>([
  { id: '1', code: 'PP001', name: '配电室每日 3 班巡检', route: 'CR-PWR-001 配电室路线', area: '动力区', period: '每日 3 次（早 / 中 / 夜）', missThreshold: 2, allowSkip: '否', status: '启用', creator: '张工', createTime: '2026-03-01 08:30:00' },
  { id: '2', code: 'PP002', name: '锅炉房每 2 小时巡检', route: 'CR-PWR-002 锅炉房路线', area: '动力区', period: '每 2 小时', missThreshold: 1, allowSkip: '否', status: '启用', creator: '动力员', createTime: '2026-03-02 09:00:00' },
  { id: '3', code: 'PP003', name: 'PACK 车间日巡检', route: 'CR-C-001 PACK 车间日常巡检', area: 'C端', period: '每日 1 次', missThreshold: 1, allowSkip: '是', status: '启用', creator: '王工', createTime: '2026-03-03 10:00:00' },
  { id: '4', code: 'PP004', name: '电机装配线每班巡检', route: 'CR-C-002 电机装配线巡检', area: 'C端', period: '每日 3 次（早 / 中 / 夜）', missThreshold: 2, allowSkip: '否', status: '启用', creator: '王工', createTime: '2026-03-04 11:00:00' },
  { id: '5', code: 'PP005', name: 'B 端电子车间巡检', route: 'CR-B-001 B 端电子车间巡检', area: 'B端', period: '每日 1 次', missThreshold: 1, allowSkip: '是', status: '启用', creator: '李工', createTime: '2026-03-05 14:00:00' },
  { id: '6', code: 'PP006', name: '来料检验区周巡检', route: 'CR-B-002 来料检验区巡检', area: 'B端', period: '每周 1 次', missThreshold: 0, allowSkip: '是', status: '启用', creator: '李工', createTime: '2026-03-06 09:30:00' },
  { id: '7', code: 'PP007', name: '数控加工车间日巡检', route: 'CR-N-001 数控加工车间巡检', area: 'N端', period: '每日 1 次', missThreshold: 1, allowSkip: '否', status: '启用', creator: '张工', createTime: '2026-03-07 10:00:00' },
  { id: '8', code: 'PP008', name: '消防设施月度巡检', route: 'CR-PWR-001 配电室路线', area: '动力区', period: '每月 1 次', missThreshold: 0, allowSkip: '是', status: '停用', creator: '安全员', createTime: '2026-03-08 16:00:00' }
])

const filteredList = computed(() => list.value.filter(r => {
  if (queryParams.code && !r.code.includes(queryParams.code)) return false
  if (queryParams.name && !r.name.includes(queryParams.name)) return false
  if (queryParams.area && r.area !== queryParams.area) return false
  if (queryParams.status && r.status !== queryParams.status) return false
  return true
}))

const handleQuery = () => {}
const resetQuery = () => { Object.assign(queryParams, { code: '', name: '', area: '', status: '', pageNo: 1 }) }
const handleSelectionChange = (rows: any[]) => { selectedIds.value = rows.map(r => r.id) }

const openForm = (mode: 'create' | 'edit' | 'view', row?: any) => {
  dialogMode.value = mode
  if (mode === 'create') {
    Object.assign(formData, { code: 'PP' + String(list.value.length + 1).padStart(3, '0'), name: '', route: '', area: '', period: '', missThreshold: 1, allowSkip: '否', status: '启用' })
  } else if (row) {
    Object.assign(formData, row)
  }
  dialogVisible.value = true
}

const submitForm = async () => {
  await formRef.value?.validate()
  if (dialogMode.value === 'create') {
    list.value.unshift({ ...formData, id: String(Date.now()), creator: '当前用户', createTime: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    message.success('创建成功')
  } else {
    const idx = list.value.findIndex(r => r.id === formData.id)
    if (idx >= 0) list.value[idx] = { ...list.value[idx], ...formData }
    message.success('更新成功')
  }
  dialogVisible.value = false
}

const handleDelete = async (row: any) => {
  await message.delConfirm(row.code)
  list.value = list.value.filter(r => r.id !== row.id)
  message.success('删除成功')
}
const handleBatchDelete = async () => {
  await message.delConfirm()
  list.value = list.value.filter(r => !selectedIds.value.includes(r.id))
  selectedIds.value = []
  message.success('批量删除成功')
}
const generateWork = (row: any) => {
  message.success('已为「' + row.name + '」按时段生成巡检工单（Demo）')
}

onMounted(() => {})
</script>
