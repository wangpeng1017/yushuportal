<template>
  <div class="oee-analysis-page">
    <!-- 顶部筛选栏 -->
    <el-card shadow="never" class="mb-20px filter-card">
      <el-form inline>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="车间">
          <el-select v-model="workshopName" placeholder="全部车间" clearable style="width: 140px">
            <el-option label="C端车间" value="C端车间" />
            <el-option label="数控机加车间" value="数控机加车间" />
            <el-option label="全部车间" value="" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 第一行：OEE 指标卡片 -->
    <el-row :gutter="20" class="mb-20px">
      <el-col v-for="item in gaugeData" :key="item.name" :span="6">
        <el-card shadow="hover" class="gauge-card">
          <div class="gauge-title">{{ item.name }}</div>
          <div class="gauge-value" :style="{ color: item.color }">{{ item.value }}%</div>
          <el-progress
            :percentage="item.value"
            :color="item.color"
            :stroke-width="8"
            :show-text="false"
          />
          <div class="gauge-desc">{{ item.desc }}</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 第二行：OEE 趋势折线图 -->
    <el-card shadow="hover" class="mb-20px">
      <template #header>
        <span class="chart-title">OEE 趋势（近7天）</span>
      </template>
      <div ref="trendChartRef" style="height: 300px"></div>
    </el-card>

    <!-- 第三行：设备 OEE 排名 -->
    <el-card shadow="hover">
      <template #header>
        <span class="chart-title">设备 OEE 排名</span>
      </template>
      <div ref="rankChartRef" style="height: 300px"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'
import * as IotOeeApi from '@/api/eam/iotOee'
import type { OeeDataVo } from '@/api/eam/iotOee'

defineOptions({ name: 'EamOeeAnalysis' })

const dateRange = ref<string[]>([])
const workshopName = ref('')

const summaryData = ref({ availability: 0, performance: 0, quality: 0, oee: 0 })
const trendList = ref<OeeDataVo[]>([])
const rankList = ref<{ name: string; oee: number }[]>([])

const gaugeData = computed(() => [
  {
    name: '综合设备效率 OEE',
    value: summaryData.value.oee,
    color: '#409EFF',
    desc: '可用率 × 性能率 × 良品率',
  },
  {
    name: '可用率',
    value: summaryData.value.availability,
    color: '#67C23A',
    desc: '实际运行时间 / 计划运行时间',
  },
  {
    name: '性能率',
    value: summaryData.value.performance,
    color: '#E6A23C',
    desc: '实际产量 / 理论产量',
  },
  {
    name: '良品率',
    value: summaryData.value.quality,
    color: '#F56C6C',
    desc: '良品数 / 总产出数',
  },
])

// ── ECharts 实例 ──
const trendChartRef = ref<HTMLElement>()
const rankChartRef = ref<HTMLElement>()
let trendChart: echarts.ECharts | null = null
let rankChart: echarts.ECharts | null = null

function initTrendChart() {
  if (!trendChartRef.value) return
  if (trendChart) trendChart.dispose()
  trendChart = echarts.init(trendChartRef.value)

  const dates = trendList.value.map(d => d.date || '')
  const oeeData = trendList.value.map(d => d.oee ?? 0)
  const availData = trendList.value.map(d => d.availability ?? 0)
  const perfData = trendList.value.map(d => d.performance ?? 0)
  const qualData = trendList.value.map(d => d.quality ?? 0)

  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['OEE', '可用率', '性能率', '良品率'], bottom: 0 },
    grid: { left: 50, right: 20, top: 20, bottom: 40 },
    xAxis: { type: 'category', data: dates, axisLabel: { rotate: 0 } },
    yAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    series: [
      { name: 'OEE', type: 'line', data: oeeData, smooth: true, lineStyle: { width: 3 }, itemStyle: { color: '#409EFF' } },
      { name: '可用率', type: 'line', data: availData, smooth: true, lineStyle: { width: 2, type: 'dashed' }, itemStyle: { color: '#67C23A' } },
      { name: '性能率', type: 'line', data: perfData, smooth: true, lineStyle: { width: 2, type: 'dashed' }, itemStyle: { color: '#E6A23C' } },
      { name: '良品率', type: 'line', data: qualData, smooth: true, lineStyle: { width: 2, type: 'dashed' }, itemStyle: { color: '#F56C6C' } },
    ],
  })
}

function initRankChart() {
  if (!rankChartRef.value) return
  if (rankChart) rankChart.dispose()
  rankChart = echarts.init(rankChartRef.value)

  const sorted = [...rankList.value].sort((a, b) => b.oee - a.oee)
  const names = sorted.map(d => d.name)
  const values = sorted.map(d => d.oee)

  rankChart.setOption({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}: {c}%' },
    grid: { left: 120, right: 40, top: 20, bottom: 30 },
    xAxis: { type: 'value', min: 0, max: 100, axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: names, axisLabel: { width: 100, overflow: 'truncate' } },
    series: [
      {
        name: 'OEE',
        type: 'bar',
        data: values,
        barMaxWidth: 24,
        itemStyle: {
          color: (params: any) => {
            const v = params.value
            if (v >= 70) return '#67C23A'
            if (v >= 55) return '#E6A23C'
            return '#F56C6C'
          },
          borderRadius: [0, 4, 4, 0],
        },
        label: { show: true, position: 'right', formatter: '{c}%', fontSize: 12 },
      },
    ],
  })
}

async function loadData() {
  try {
    const params = {
      workshopName: workshopName.value || undefined,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1],
    }

    const [summaryRes, trendRes] = await Promise.all([
      IotOeeApi.getOeeSummary(params),
      IotOeeApi.getOeeData(params),
    ])

    summaryData.value = summaryRes?.data || { availability: 0, performance: 0, quality: 0, oee: 0 }

    const rawTrend = trendRes?.data?.trend || trendRes?.data?.records || trendRes?.data || []
    trendList.value = rawTrend

    const rawRank = trendRes?.data?.rank || []
    rankList.value = rawRank

    await nextTick()
    initTrendChart()
    initRankChart()
  } catch (e) {
    console.error('加载OEE数据失败', e)
  }
}

function resetFilter() {
  dateRange.value = []
  workshopName.value = ''
  loadData()
}

onMounted(() => {
  loadData()
})

onBeforeUnmount(() => {
  trendChart?.dispose()
  rankChart?.dispose()
})
</script>

<style scoped>
.oee-analysis-page {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100%;
}

.filter-card :deep(.el-card__body) {
  padding: 12px 16px 0;
}

.gauge-card {
  text-align: center;
  border-radius: 8px;
}

.gauge-title {
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.gauge-value {
  font-size: 38px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 8px;
}

.gauge-desc {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 6px;
}

.chart-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}
</style>
