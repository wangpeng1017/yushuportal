<template>
  <div class="report-page">
    <ContentWrap>
      <div class="header-row">
        <div class="header-title">库存消耗分析</div>
        <div class="filter-row">
          <span class="filter-label">库房：</span>
          <el-select v-model="warehouse" class="!w-180px" @change="loadAll">
            <el-option label="全部库房" value="ALL" />
            <el-option label="设备维修备件库" value="W1" />
            <el-option label="自动化备件库" value="W2" />
            <el-option label="B端关键备件库" value="W3" />
            <el-option label="CNC设备备件库" value="W4" />
          </el-select>
        </div>
      </div>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="8">
          <div class="kpi-row card-blue">
            <div class="kpi-label">总库存价值</div>
            <div class="kpi-num">¥ {{ totalCapital }}</div>
            <div class="kpi-foot">{{ data.capitalOccupation?.length || 0 }} 个库房</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="kpi-row card-orange">
            <div class="kpi-label">本月平均周转率</div>
            <div class="kpi-num">{{ avgTurnover }}<span class="suffix">次/月</span></div>
            <div class="kpi-foot">周转天数 {{ avgDays }} 天</div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="kpi-row card-red">
            <div class="kpi-label">本月报废</div>
            <div class="kpi-num">{{ totalScrap }}<span class="suffix">单</span></div>
            <div class="kpi-foot">含损坏 / 失效 / 淘汰</div>
          </div>
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">备件消耗 TOP 10（本月）</div>
          <Echart v-if="topOption" :options="topOption" height="320px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">资金占用分布</div>
          <Echart v-if="capitalOption" :options="capitalOption" height="320px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">库存周转趋势（12 个月）</div>
          <Echart v-if="turnoverOption" :options="turnoverOption" height="280px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">报废原因分布</div>
          <Echart v-if="scrapPieOption" :options="scrapPieOption" height="280px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <div class="chart-title">备件消耗明细（本月 TOP 10）</div>
      <el-table :data="data.topConsume || []" stripe>
        <el-table-column type="index" label="排名" width="70" align="center" />
        <el-table-column label="备件编号" prop="code" width="120" align="center" />
        <el-table-column label="备件名称" prop="name" min-width="200" />
        <el-table-column label="所属库房" prop="warehouse" width="160" align="center" />
        <el-table-column label="消耗数量" prop="qty" width="120" align="center">
          <template #default="{ row }">
            <span style="color:#0f4c5c;font-weight:bold">{{ row.qty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="消耗金额" prop="amount" width="140" align="right">
          <template #default="{ row }">¥ {{ Number(row.amount).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="安全库存达标率（饼图）" align="center" min-width="180">
          <template #header>
            <el-tag size="small" type="info">见上方安全库存图</el-tag>
          </template>
          <template #default>—</template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamReportInventory">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'

const warehouse = ref('ALL')
const data = ref<any>({})

async function loadAll() {
  const res: any = await request.get({ url: '/eam/report/inventory', params: { warehouse: warehouse.value } })
  data.value = res || {}
}

const totalCapital = computed(() => {
  const total = (data.value.capitalOccupation || []).reduce((s: number, x: any) => s + Number(x.value || 0), 0)
  return total.toLocaleString()
})
const avgTurnover = computed(() => {
  const r = data.value.turnover?.rate || []
  if (!r.length) return 0
  return (r.reduce((a: number, b: number) => a + b, 0) / r.length).toFixed(1)
})
const avgDays = computed(() => {
  const r = data.value.turnover?.days || []
  if (!r.length) return 0
  return Math.round(r.reduce((a: number, b: number) => a + b, 0) / r.length)
})
const totalScrap = computed(() => {
  const r = data.value.scrapTrend || []
  return r.reduce((a: number, b: number) => a + b, 0)
})

const topOption = computed<any>(() => {
  const items = (data.value.topConsume || []).slice().reverse()
  return {
    tooltip: { trigger: 'axis', formatter: '{b}: {c}' },
    grid: { left: '5%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: items.map((x: any) => x.name), axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', barWidth: 14, data: items.map((x: any) => x.qty), itemStyle: { color: '#5b8def', borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right' } }]
  }
})
const capitalOption = computed<any>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'middle', itemWidth: 10, textStyle: { fontSize: 12 } },
  series: [{ type: 'pie', radius: ['38%', '70%'], center: ['38%', '50%'], data: (data.value.capitalOccupation || []).map((x: any) => ({ name: x.warehouse, value: x.value })), color: ['#5b8def', '#82a6f0', '#a4bdf2', '#c5d4f5', '#94a3b8'], label: { show: false } }]
}))
const turnoverOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['周转率（次/月）', '周转天数'], top: 0, textStyle: { fontSize: 12 } },
  grid: { left: '5%', right: '8%', bottom: '8%', top: '15%', containLabel: true },
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: [
    { type: 'value', name: '次/月', position: 'left', axisLine: { lineStyle: { color: '#5b8def' } } },
    { type: 'value', name: '天', position: 'right', axisLine: { lineStyle: { color: '#94a3b8' } } }
  ],
  series: [
    { name: '周转率（次/月）', type: 'line', smooth: true, data: data.value.turnover?.rate || [], itemStyle: { color: '#5b8def' }, lineStyle: { width: 3 } },
    { name: '周转天数', type: 'line', smooth: true, yAxisIndex: 1, data: data.value.turnover?.days || [], itemStyle: { color: '#94a3b8' }, lineStyle: { width: 3 } }
  ]
}))
const scrapPieOption = computed<any>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'middle', itemWidth: 10, textStyle: { fontSize: 12 } },
  series: [{ type: 'pie', radius: ['38%', '70%'], center: ['38%', '50%'], data: data.value.scrapReason || [], color: ['#f56c6c', '#94a3b8', '#a4bdf2', '#c5d4f5'], label: { show: false } }]
}))

onMounted(loadAll)
</script>

<style scoped>
.report-page { padding: 12px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.header-title { font-size: 18px; font-weight: bold; color: #1a202c; }
.filter-row { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 13px; color: #606266; }
.kpi-row { padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-row .kpi-label { font-size: 13px; color: #909399; }
.kpi-row .kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; margin-top: 6px; color: #303133; }
.kpi-row .suffix { font-size: 16px; margin-left: 4px; color: #606266; }
.kpi-row .kpi-foot { font-size: 12px; color: #909399; margin-top: 4px; }
.card-blue { border-left-color: #409eff; }
.card-orange { border-left-color: #909399; }
.card-red { border-left-color: #909399; }
.chart-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #409eff; }
</style>
