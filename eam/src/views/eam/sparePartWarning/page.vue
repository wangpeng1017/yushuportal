<template>
  <div class="sp-warning">
    <ContentWrap>
      <div class="header-row">
        <Icon icon="ep:warning" class="warning-icon" />
        <div class="header-text">
          <div class="header-title">备件安全库存预警</div>
          <div class="header-sub">系统每日凌晨自动扫描全部库房</div>
        </div>
      </div>
      <el-button class="reload-btn" @click="loadList">立即扫描</el-button>
    </ContentWrap>
    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="6">
          <el-card shadow="never" class="card-red">
            <div class="kpi-label">缺货品类</div>
            <div class="kpi-num kpi-red">{{ countRed }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">接近安全线</div>
            <div class="kpi-num kpi-orange">{{ countYellow }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-green">
            <div class="kpi-label">建议采购总额</div>
            <div class="kpi-num kpi-green">¥ {{ totalAmountText }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">涉及库房</div>
            <div class="kpi-num kpi-blue">{{ warehouseCount }}</div>
          </el-card>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="list" stripe :row-class-name="getRowClass">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="预警等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getSafetyTagType(row.safetyStatus)" size="small">{{ row.safetyStatusText }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备件编号" prop="number" width="120" align="center" />
        <el-table-column label="备件名称" prop="name" min-width="180" />
        <el-table-column label="规格" prop="specification" width="120" />
        <el-table-column label="所属库房" prop="warehouseTypeText" width="140" align="center" />
        <el-table-column label="当前库存" width="120" align="center">
          <template #default="{ row }">
            <span class="bold" :class="getStockClass(row)">{{ row.actualStock }} {{ row.unitName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="安全下限" prop="minStock" width="100" align="center" />
        <el-table-column label="安全上限" prop="maxStock" width="100" align="center" />
        <el-table-column label="建议采购数量" width="120" align="center">
          <template #default="{ row }">
            <span class="bold suggest">{{ row.suggestedPurchase }} {{ row.unitName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="预估金额" width="120" align="right">
          <template #default="{ row }">¥ {{ formatAmount(row) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleQuickPurchase(row)">一键采购</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])

const countRed = computed(() => list.value.filter(x => x.safetyStatus === 'red').length)
const countYellow = computed(() => list.value.filter(x => x.safetyStatus === 'yellow').length)
const warehouseCount = computed(() => new Set(list.value.map(x => x.warehouseType)).size)
const totalAmountText = computed(() => {
  const total = list.value.reduce((sum, x) => sum + calcAmount(x), 0)
  return total.toLocaleString()
})

function calcAmount(row: any) {
  return Number(row.unitPrice || 0) * (row.suggestedPurchase || 0)
}
function formatAmount(row: any) {
  return calcAmount(row).toLocaleString()
}
function getRowClass({ row }: any) {
  return row.safetyStatus === 'red' ? 'row-red' : 'row-orange'
}
function getSafetyTagType(s: string): any {
  return s === 'red' ? 'danger' : 'warning'
}
function getStockClass(row: any) {
  return row.actualStock < row.minStock ? 'text-red' : 'text-orange'
}

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({ url: '/work/eamSparePartSearch/warningList', params: { pageNo: 1, pageSize: 100 } })
    list.value = res?.records || []
  } finally {
    loading.value = false
  }
}

async function handleQuickPurchase(row: any) {
  const amount = calcAmount(row)
  const tip = '一键创建备件采购申请：\n备件：' + row.name + '\n建议数量：' + row.suggestedPurchase + ' ' + row.unitName + '\n预估金额：¥ ' + amount.toLocaleString()
  await ElMessageBox.confirm(tip, '一键创建采购申请', { confirmButtonText: '确认创建', type: 'warning' })
  ElMessage.success('已创建备件采购申请，请到采购管理-备件采购查看')
}

onMounted(loadList)
</script>

<style scoped>
.sp-warning { padding: 12px; }
.header-row { display: flex; align-items: center; gap: 15px; }
.warning-icon { font-size: 30px; color: #f97316; }
.header-text { line-height: 1.4; }
.header-title { font-size: 16px; font-weight: bold; }
.header-sub { font-size: 12px; color: #909399; margin-top: 3px; }
.reload-btn { margin-top: 10px; }
.kpi-row { margin-bottom: 15px; }
.card-red { background: #fef2f2; }
.card-orange { background: #fff7ed; }
.card-green { background: #f0fdf4; }
.card-blue { background: #eff6ff; }
.kpi-label { font-size: 13px; color: #606266; }
.kpi-num { font-size: 28px; font-weight: bold; margin-top: 5px; }
.kpi-red { color: #ef4444; }
.kpi-orange { color: #f97316; }
.kpi-green { color: #16a34a; }
.kpi-blue { color: #2563eb; }
.bold { font-weight: bold; }
.text-red { color: #ef4444; }
.text-orange { color: #f97316; }
.suggest { color: #3b82f6; }
:deep(.row-red) { background-color: #fef2f2 !important; }
:deep(.row-orange) { background-color: #fff7ed !important; }
</style>
