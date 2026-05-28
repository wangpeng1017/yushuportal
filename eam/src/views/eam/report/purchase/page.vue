<template>
  <div class="report-page">
    <ContentWrap>
      <div class="header-row">
        <div class="header-title">采购汇总报表</div>
        <div class="filter-row">
          <span class="filter-label">采购类型：</span>
          <el-select v-model="type" class="!w-160px" @change="loadAll">
            <el-option label="全部" value="ALL" />
            <el-option label="设备采购" value="equipment" />
            <el-option label="工器具采购" value="tool" />
            <el-option label="备件采购" value="part" />
          </el-select>
        </div>
      </div>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="6">
          <div class="kpi-card kpi-blue">
            <div class="kpi-label">本月总采购金额</div>
            <div class="kpi-num">¥ {{ totalMonthAmount }}</div>
            <div class="kpi-foot">{{ data.monthlyDetail?.length || 0 }} 笔</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-green">
            <div class="kpi-label">12 个月累计</div>
            <div class="kpi-num">¥ {{ total12Amount }}</div>
            <div class="kpi-foot">含设备 / 工器具 / 备件</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-orange">
            <div class="kpi-label">合作供应商数</div>
            <div class="kpi-num">{{ data.topSupplier?.length || 0 }}</div>
            <div class="kpi-foot">活跃供应商</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-red">
            <div class="kpi-label">平均申请→入库周期</div>
            <div class="kpi-num">{{ avgCycle }}<span class="suffix">天</span></div>
            <div class="kpi-foot">含审批 + ERP</div>
          </div>
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">采购金额趋势（12 个月）</div>
          <Echart v-if="amountOption" :options="amountOption" height="320px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">采购类型分布</div>
          <Echart v-if="typeOption" :options="typeOption" height="320px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">供应商 TOP 8（按金额）</div>
          <Echart v-if="supplierOption" :options="supplierOption" height="320px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">采购周期分析（节点平均时长）</div>
          <Echart v-if="cycleOption" :options="cycleOption" height="320px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <div class="chart-title">本月采购明细</div>
      <el-table :data="data.monthlyDetail || []" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="采购单号" prop="code" width="160" align="center" />
        <el-table-column label="类型" prop="type" width="90" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.type === '设备' ? 'warning' : row.type === '工器具' ? 'info' : ''">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="物品名称" prop="itemName" min-width="220" />
        <el-table-column label="申请人" prop="applicantName" width="100" align="center" />
        <el-table-column label="供应商" prop="supplier" width="140" align="center" />
        <el-table-column label="金额" prop="amount" width="140" align="right">
          <template #default="{ row }">¥ {{ Number(row.amount).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="120" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getStatusTag(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请日期" prop="applicationDate" width="120" align="center" />
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamReportPurchase">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'

const type = ref('ALL')
const data = ref<any>({})

async function loadAll() {
  const res: any = await request.get({ url: '/eam/report/purchase', params: { type: type.value } })
  data.value = res || {}
}

function getStatusTag(s: string): any {
  if (s === '已通过' || s === '已生成PO' || s === '已入库') return 'success'
  if (s === '审批中') return 'warning'
  if (s === '已驳回') return 'danger'
  return 'info'
}

const totalMonthAmount = computed(() => (data.value.monthlyDetail || []).reduce((s: number, x: any) => s + Number(x.amount || 0), 0).toLocaleString())
const total12Amount = computed(() => {
  const at = data.value.amountTrend || {}
  const sum = ['equipment', 'tool', 'part'].reduce((s: number, k: string) => s + ((at[k] || []) as number[]).reduce((a, b) => a + b, 0), 0)
  return sum.toLocaleString()
})
const avgCycle = computed(() => {
  const c = data.value.cycleAnalysis || []
  return c.reduce((s: number, x: any) => s + Number(x.avgDays || 0), 0).toFixed(1)
})

const amountOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['设备', '工器具', '备件'], top: 0, textStyle: { fontSize: 12 } },
  grid: { left: '5%', right: '4%', bottom: '8%', top: '15%', containLabel: true },
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
  series: [
    { name: '设备', type: 'bar', stack: 'a', data: data.value.amountTrend?.equipment || [], itemStyle: { color: '#5b8def' } },
    { name: '工器具', type: 'bar', stack: 'a', data: data.value.amountTrend?.tool || [], itemStyle: { color: '#a4bdf2' } },
    { name: '备件', type: 'bar', stack: 'a', data: data.value.amountTrend?.part || [], itemStyle: { color: '#94a3b8' } }
  ]
}))
const typeOption = computed<any>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'middle', itemWidth: 10, textStyle: { fontSize: 12 } },
  series: [{ type: 'pie', radius: ['38%', '70%'], center: ['38%', '50%'], data: data.value.typeDistribution || [], color: ['#5b8def', '#a4bdf2', '#94a3b8'], label: { show: false } }]
}))
const supplierOption = computed<any>(() => {
  const items = (data.value.topSupplier || []).slice().reverse()
  return {
    tooltip: { trigger: 'axis', formatter: (params: any) => {
      const p = params[0]
      const supplier = items[p.dataIndex]
      return `${supplier?.name}<br/>金额: ¥${supplier?.amount?.toLocaleString()}<br/>笔数: ${supplier?.count}<br/>主品类: ${supplier?.category}`
    } },
    grid: { left: '5%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '¥{value}' } },
    yAxis: { type: 'category', data: items.map((x: any) => x.name), axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', barWidth: 16, data: items.map((x: any) => x.amount), itemStyle: { color: '#5b8def', borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', formatter: (p: any) => '¥' + (p.value as number).toLocaleString() } }]
  }
})
const cycleOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '5%', right: '5%', bottom: '5%', top: '15%', containLabel: true },
  xAxis: { type: 'value', axisLabel: { formatter: '{value} 天' } },
  yAxis: { type: 'category', data: (data.value.cycleAnalysis || []).map((x: any) => x.stage), axisLabel: { fontSize: 11 } },
  series: [{ type: 'bar', barWidth: 16, data: (data.value.cycleAnalysis || []).map((x: any) => x.avgDays), itemStyle: { color: '#94a3b8', borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right', formatter: '{c} 天' } }]
}))

onMounted(loadAll)
</script>

<style scoped>
.report-page { padding: 12px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.header-title { font-size: 18px; font-weight: bold; color: #1a202c; }
.filter-row { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 13px; color: #606266; }
/* Notion 风 KPI 卡：白底 + 左侧 4px 色条 */
.kpi-card { padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-card .kpi-label { font-size: 13px; color: #909399; }
.kpi-card .kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; margin-top: 6px; color: #303133; }
.kpi-card .suffix { font-size: 16px; margin-left: 4px; color: #606266; }
.kpi-card .kpi-foot { font-size: 12px; color: #909399; margin-top: 4px; }
.kpi-blue { border-left-color: #409eff; }
.kpi-green { border-left-color: #67c23a; }
.kpi-orange { border-left-color: #909399; }
.kpi-red { border-left-color: #909399; }
.chart-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #409eff; }
</style>
