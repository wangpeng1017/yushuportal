<template>
  <div class="report-dashboard">
    <ContentWrap>
      <div class="header-row">
        <div class="header-title">综合驾驶舱</div>
        <div class="filter-row">
          <span class="filter-label">端别：</span>
          <el-select v-model="plant" class="!w-160px" @change="loadAll">
            <el-option label="全部" value="ALL" />
            <el-option label="C 端（PACK/PCBA/装配）" value="C" />
            <el-option label="B 端" value="B" />
            <el-option label="数控机加" value="CNC" />
          </el-select>
        </div>
      </div>
    </ContentWrap>

    <ContentWrap>
      <!-- 4 个 KPI 大卡 -->
      <el-row :gutter="14">
        <el-col :span="6">
          <div class="kpi-card kpi-blue">
            <div class="kpi-icon"><Icon icon="ep:office-building" /></div>
            <div><div class="kpi-label">在籍设备数</div><div class="kpi-num">{{ kpis.equipmentCount }}</div><div class="kpi-foot">台</div></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-green">
            <div class="kpi-icon"><Icon icon="ep:data-line" /></div>
            <div><div class="kpi-label">综合 OEE</div><div class="kpi-num">{{ kpis.oeeAvg }}<span class="suffix">%</span></div><div class="kpi-foot">本月平均</div></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-orange">
            <div class="kpi-icon"><Icon icon="ep:tickets" /></div>
            <div><div class="kpi-label">本月工单</div><div class="kpi-num">{{ kpis.monthWoCount }}</div><div class="kpi-foot">单</div></div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="kpi-card kpi-red">
            <div class="kpi-icon"><Icon icon="ep:wallet" /></div>
            <div><div class="kpi-label">本月维修成本</div><div class="kpi-num">¥ {{ Number(kpis.monthRepairCost || 0).toLocaleString() }}</div><div class="kpi-foot">含备件 + 人工</div></div>
          </div>
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">OEE 12 个月趋势</div>
          <Echart v-if="oeeOption" :options="oeeOption" height="260px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">备件消耗结构（本月）</div>
          <Echart v-if="pieOption" :options="pieOption" height="260px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="14">
          <div class="chart-title">工单数量趋势（保养 / 维修 / 点检）</div>
          <Echart v-if="woOption" :options="woOption" height="280px" />
        </el-col>
        <el-col :span="10">
          <div class="chart-title">故障设备 TOP 10</div>
          <Echart v-if="faultOption" :options="faultOption" height="280px" />
        </el-col>
      </el-row>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamReportDashboard">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'

const plant = ref('ALL')
const data = ref<any>({ kpis: {}, months: [], oeeTrend: [], woTrend: { maint: [], repair: [], inspection: [] }, faultTopEquipment: [], partsConsumePie: [] })
const kpis = computed(() => data.value.kpis || {})

async function loadAll() {
  const res: any = await request.get({ url: '/eam/report/dashboard', params: { plant: plant.value } })
  data.value = res || {}
}

const baseGrid = { left: '5%', right: '4%', bottom: '8%', top: '12%', containLabel: true }
const oeeOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  grid: baseGrid,
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value', min: 70, max: 95, axisLabel: { formatter: '{value}%' } },
  series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, data: data.value.oeeTrend || [], itemStyle: { color: '#0f4c5c' }, lineStyle: { width: 3 }, areaStyle: { color: { type: 'linear', x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: 'rgba(15,76,92,0.35)' }, { offset: 1, color: 'rgba(15,76,92,0.02)' }] } } }]
}))
const pieOption = computed<any>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: ¥{c} ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'middle', itemWidth: 10, textStyle: { fontSize: 12 } },
  series: [{ type: 'pie', radius: ['40%', '70%'], center: ['38%', '50%'], avoidLabelOverlap: false, label: { show: false }, data: data.value.partsConsumePie || [], color: ['#5b8def', '#82a6f0', '#a4bdf2', '#c5d4f5', '#94a3b8', '#cbd5e1'] }]
}))
const woOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['保养', '维修', '点检'], top: 0, textStyle: { fontSize: 12 } },
  grid: baseGrid,
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value' },
  series: [
    { name: '保养', type: 'bar', stack: 'wo', data: data.value.woTrend?.maint || [], itemStyle: { color: '#a4bdf2' } },
    { name: '维修', type: 'bar', stack: 'wo', data: data.value.woTrend?.repair || [], itemStyle: { color: '#f56c6c' } },
    { name: '点检', type: 'bar', stack: 'wo', data: data.value.woTrend?.inspection || [], itemStyle: { color: '#94a3b8' } }
  ]
}))
const faultOption = computed<any>(() => {
  const items = (data.value.faultTopEquipment || []).slice().reverse()
  return {
    tooltip: { trigger: 'axis' },
    grid: { left: '5%', right: '8%', bottom: '5%', top: '5%', containLabel: true },
    xAxis: { type: 'value' },
    yAxis: { type: 'category', data: items.map((x: any) => x.name), axisLabel: { fontSize: 11 } },
    series: [{ type: 'bar', barWidth: 14, data: items.map((x: any) => x.count), itemStyle: { color: '#f56c6c', borderRadius: [0, 4, 4, 0] }, label: { show: true, position: 'right' } }]
  }
})

onMounted(loadAll)
</script>

<style scoped>
.report-dashboard { padding: 12px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.header-title { font-size: 18px; font-weight: bold; color: #1a202c; }
.filter-row { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 13px; color: #606266; }
/* 克制风格的 KPI 卡：白底 + 左侧 4px 细色条 + 深色数字 + 灰色标签 */
.kpi-card { display: flex; align-items: center; gap: 14px; padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-card .kpi-icon { font-size: 32px; color: #909399; }
.kpi-card .kpi-icon :deep(svg) { width: 32px; height: 32px; }
.kpi-card .kpi-label { font-size: 13px; color: #909399; }
.kpi-card .kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; color: #303133; }
.kpi-card .kpi-num .suffix { font-size: 16px; margin-left: 2px; color: #606266; }
.kpi-card .kpi-foot { font-size: 12px; color: #909399; margin-top: 2px; }
.kpi-blue { border-left-color: #409eff; }
.kpi-blue .kpi-icon { color: #409eff; }
.kpi-green { border-left-color: #67c23a; }
.kpi-green .kpi-icon { color: #67c23a; }
.kpi-orange { border-left-color: #909399; }
.kpi-orange .kpi-icon { color: #909399; }
.kpi-red { border-left-color: #909399; }
.kpi-red .kpi-icon { color: #909399; }
.chart-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #0f4c5c; }
</style>
