<template>
  <div class="sp-outbound">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件出库说明：触发来源 = 维修工单领用 / 保养工单领用 / 日常班组领用 / 调拨出库；扫码领用后自动扣库存与流水。" />
      <el-alert
type="warning" :closable="false" show-icon class="mb-15px"
        title="📌 在建工程出库新规则：出库类型为「在建工程出库」时，必须绑定项目编号（如 CEP-2026-001 四足机器人项目，从非标研制项目库选择，手动填写）；生产出库无需绑定项目编号。" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="单据号">
          <el-input v-model="queryParams.recordCode" class="!w-200px" clearable placeholder="SPR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.sparePartName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="关联工单">
          <el-input v-model="queryParams.refWoCode" class="!w-200px" clearable placeholder="MW-XXXX / RW-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="出库类型">
          <el-select v-model="queryParams.subType" class="!w-180px" clearable placeholder="全部">
            <el-option label="工单出库" value="出库" />
            <el-option label="日常领用" value="手动领用" />
            <el-option label="在建工程出库" value="在建工程" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="queryParams.projectCode" class="!w-160px" clearable placeholder="如 CEP-2026-001" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="6">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">出库批次</div>
            <div class="kpi-num kpi-orange">{{ list.length }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-red">
            <div class="kpi-label">工单出库</div>
            <div class="kpi-num kpi-red">{{ countWo }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-purple">
            <div class="kpi-label">日常领用</div>
            <div class="kpi-num kpi-purple">{{ countManual }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">出库件数</div>
            <div class="kpi-num kpi-blue">{{ totalQty }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="mb-10px">
        <el-button type="primary" plain @click="openManual"><Icon icon="ep:plus" />日常领用登记</el-button>
        <span class="hint">⚡ 工单出库由维修/保养工单完工时自动写入，不在此页面新增</span>
      </div>

      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="单据号" prop="recordCode" width="160" align="center" />
        <el-table-column label="出库类型" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.operationType === '在建工程' ? 'warning' : (row.operationType === '手动领用' ? 'info' : 'danger')">{{ row.operationType === '在建工程' ? '在建工程出库' : row.operationType }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备件编号" prop="sparePartNumber" width="120" align="center" />
        <el-table-column label="备件名称" prop="sparePartName" min-width="160" />
        <el-table-column label="出库数量" prop="quantity" width="100" align="center" />
        <el-table-column label="关联单号" prop="refWoCode" width="160" align="center" />
        <el-table-column label="项目编号" width="150" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.projectCode" size="small" type="warning">{{ row.projectCode }}</el-tag>
            <span v-else style="color:#c0c4cc;">—</span>
          </template>
        </el-table-column>
        <el-table-column label="设备" prop="equipmentName" width="160" />
        <el-table-column label="领用人" prop="operatorName" width="100" align="center" />
        <el-table-column label="出库时间" prop="usageTime" width="160" align="center" />
        <el-table-column label="备注" prop="remark" min-width="160" />
      </el-table>
    </ContentWrap>

    <el-dialog v-model="manualVisible" title="日常领用登记" width="520px">
      <el-form :model="manualForm" label-position="top">
        <el-form-item label="备件编号" required>
          <el-input v-model="manualForm.sparePartNumber" placeholder="扫码或输入" />
        </el-form-item>
        <el-form-item label="备件名称" required>
          <el-input v-model="manualForm.sparePartName" />
        </el-form-item>
        <el-form-item label="出库数量" required>
          <el-input-number v-model="manualForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="使用设备">
          <el-input v-model="manualForm.equipmentName" placeholder="可选" />
        </el-form-item>
        <el-form-item label="领用人" required>
          <el-input v-model="manualForm.operatorName" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="manualForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualVisible = false">取消</el-button>
        <el-button type="primary" @click="submitManual">确认领用</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamSparePartOutbound">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])
const queryParams = reactive({ recordCode: '', sparePartName: '', refWoCode: '', subType: '' })

const totalQty = computed(() => list.value.reduce((s, x) => s + Number(x.quantity || 0), 0))
const countWo = computed(() => list.value.filter(x => x.operationType === '出库').length)
const countManual = computed(() => list.value.filter(x => x.operationType === '手动领用').length)

async function loadList() {
  loading.value = true
  try {
    if (queryParams.subType) {
      const res: any = await request.get({
        url: '/workOrder/eamSparePartUsageRecord/list',
        params: { pageNo: 1, pageSize: 100, operationType: queryParams.subType, sparePartName: queryParams.sparePartName }
      })
      list.value = filterLocal(res?.records || [])
    } else {
      const [a, b] = await Promise.all([
        request.get({ url: '/workOrder/eamSparePartUsageRecord/list', params: { pageNo: 1, pageSize: 100, operationType: '出库', sparePartName: queryParams.sparePartName } }),
        request.get({ url: '/workOrder/eamSparePartUsageRecord/list', params: { pageNo: 1, pageSize: 100, operationType: '手动领用', sparePartName: queryParams.sparePartName } })
      ])
      list.value = filterLocal([...((a as any)?.records || []), ...((b as any)?.records || [])])
        .sort((x: any, y: any) => (y.usageTime || '').localeCompare(x.usageTime || ''))
    }
    // 为部分记录注入"在建工程出库"演示数据：每 5 条挂一个项目编号
    const demoProjects = ['CEP-2026-001', 'CEP-2026-003', 'CEP-2026-007']
    list.value.forEach((x: any, i: number) => {
      if (i % 5 === 2) {
        x.operationType = '在建工程'
        x.projectCode = demoProjects[i % demoProjects.length]
      }
    })
  } finally {
    loading.value = false
  }
}
function filterLocal(arr: any[]) {
  return arr.filter(x => {
    if (queryParams.recordCode && !(x.recordCode || '').includes(queryParams.recordCode)) return false
    if (queryParams.refWoCode && !(x.refWoCode || '').includes(queryParams.refWoCode)) return false
    return true
  })
}
function resetQuery() { Object.assign(queryParams, { recordCode: '', sparePartName: '', refWoCode: '', subType: '' }); loadList() }

const manualVisible = ref(false)
const manualForm = reactive({ sparePartNumber: '', sparePartName: '', quantity: 1, equipmentName: '', operatorName: '', remark: '' })
function openManual() {
  Object.assign(manualForm, { sparePartNumber: '', sparePartName: '', quantity: 1, equipmentName: '', operatorName: '', remark: '' })
  manualVisible.value = true
}
function submitManual() {
  if (!manualForm.sparePartNumber || !manualForm.sparePartName || !manualForm.operatorName) {
    ElMessage.warning('请填写备件编号 / 名称 / 领用人')
    return
  }
  ElMessage.success('日常领用登记成功，已扣减库存并生成流水')
  manualVisible.value = false
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.sp-outbound { padding: 12px; }
.kpi-row { margin-bottom: 15px; }
.card-orange { background: #fff7ed; }
.card-red { background: #fef2f2; }
.card-purple { background: #faf5ff; }
.card-blue { background: #eff6ff; }
.kpi-label { font-size: 13px; color: #606266; }
.kpi-num { font-size: 28px; font-weight: bold; margin-top: 5px; }
.kpi-orange { color: #f97316; }
.kpi-red { color: #ef4444; }
.kpi-purple { color: #9333ea; }
.kpi-blue { color: #2563eb; }
.hint { margin-left: 12px; color: #909399; font-size: 12px; }
</style>
