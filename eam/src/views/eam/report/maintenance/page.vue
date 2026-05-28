<template>
  <div class="report-page">
    <ContentWrap>
      <div class="header-row">
        <div class="header-title">维保统计报表</div>
        <div class="filter-row">
          <span class="filter-label">端别：</span>
          <el-select v-model="plant" class="!w-160px" @change="loadAll">
            <el-option label="全部" value="ALL" />
            <el-option label="C 端" value="C" />
            <el-option label="B 端" value="B" />
            <el-option label="数控机加" value="CNC" />
          </el-select>
        </div>
      </div>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="chart-title">保养工单计划 vs 实际完成（12 个月）</div>
          <Echart v-if="completionOption" :options="completionOption" height="280px" />
        </el-col>
        <el-col :span="12">
          <div class="chart-title">点检完成率（12 个月）</div>
          <Echart v-if="inspOption" :options="inspOption" height="280px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="12">
          <div class="chart-title">工单及时性（按时 / 延期）</div>
          <Echart v-if="timelinessOption" :options="timelinessOption" height="280px" />
        </el-col>
        <el-col :span="12">
          <div class="chart-title">故障原因分布</div>
          <Echart v-if="faultOption" :options="faultOption" height="280px" />
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <div class="chart-title">维修人员排行</div>
      <el-table :data="data.topRepairer || []" stripe>
        <el-table-column type="index" label="排名" width="70" align="center" />
        <el-table-column label="姓名" prop="name" width="100" align="center" />
        <el-table-column label="所属端别" prop="dept" width="100" align="center" />
        <el-table-column label="完成工单数" prop="count" width="120" align="center">
          <template #default="{ row }">
            <span style="font-weight:bold;color:#0f4c5c">{{ row.count }}</span> 单
          </template>
        </el-table-column>
        <el-table-column label="平均维修时长" prop="avgHours" width="140" align="center">
          <template #default="{ row }">{{ row.avgHours }} h</template>
        </el-table-column>
        <el-table-column label="发起人满意度评分" align="center">
          <template #default="{ row }">
            <el-rate :model-value="row.satisfaction" disabled show-score text-color="#ff9900" score-template="{value}" />
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <ContentWrap>
      <div class="chart-title">本月维修明细（{{ data.monthlyDetail?.length || 0 }} 条）</div>
      <el-table :data="data.monthlyDetail || []" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="设备" prop="equipmentName" min-width="180" />
        <el-table-column label="故障单号" prop="faultCode" width="160" align="center" />
        <el-table-column label="发生日期" prop="occurDate" width="110" align="center" />
        <el-table-column label="维修人" prop="repairer" width="100" align="center" />
        <el-table-column label="维修工时" prop="repairHours" width="110" align="center">
          <template #default="{ row }">{{ row.repairHours }} h</template>
        </el-table-column>
        <el-table-column label="耗用备件" prop="parts" min-width="200" />
        <el-table-column label="维修成本" prop="cost" width="120" align="right">
          <template #default="{ row }">¥ {{ Number(row.cost || 0).toLocaleString() }}</template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamReportMaintenance">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'

const plant = ref('ALL')
const data = ref<any>({})

async function loadAll() {
  const res: any = await request.get({ url: '/eam/report/maintenance', params: { plant: plant.value } })
  data.value = res || {}
}

const baseGrid = { left: '5%', right: '4%', bottom: '8%', top: '15%', containLabel: true }
const completionOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['计划', '实际'], top: 0, textStyle: { fontSize: 12 } },
  grid: baseGrid,
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value' },
  series: [
    { name: '计划', type: 'bar', barWidth: 12, data: data.value.completionRate?.plan || [], itemStyle: { color: '#94a3b8' } },
    { name: '实际', type: 'bar', barWidth: 12, data: data.value.completionRate?.actual || [], itemStyle: { color: '#16a34a' } }
  ]
}))
const inspOption = computed<any>(() => {
  const plan = data.value.inspectionRate?.plan || []
  const actual = data.value.inspectionRate?.actual || []
  const rate = plan.map((p: number, i: number) => +(actual[i] / p * 100).toFixed(1))
  return {
    tooltip: { trigger: 'axis' },
    grid: baseGrid,
    xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
    yAxis: { type: 'value', min: 80, max: 100, axisLabel: { formatter: '{value}%' } },
    series: [{ type: 'line', smooth: true, symbol: 'circle', symbolSize: 7, data: rate, itemStyle: { color: '#2563eb' }, lineStyle: { width: 3 }, areaStyle: { color: 'rgba(37,99,235,0.15)' } }]
  }
})
const timelinessOption = computed<any>(() => ({
  tooltip: { trigger: 'axis' },
  legend: { data: ['按时完工', '延期完工'], top: 0, textStyle: { fontSize: 12 } },
  grid: baseGrid,
  xAxis: { type: 'category', data: data.value.months || [], axisLabel: { fontSize: 11 } },
  yAxis: { type: 'value' },
  series: [
    { name: '按时完工', type: 'bar', stack: 't', data: data.value.woTimeliness?.onTime || [], itemStyle: { color: '#16a34a' } },
    { name: '延期完工', type: 'bar', stack: 't', data: data.value.woTimeliness?.delayed || [], itemStyle: { color: '#ef4444' } }
  ]
}))
const faultOption = computed<any>(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', right: 10, top: 'middle', itemWidth: 10, textStyle: { fontSize: 12 } },
  series: [{ type: 'pie', radius: ['38%', '70%'], center: ['38%', '50%'], data: data.value.faultCategory || [], color: ['#ef4444', '#f97316', '#9333ea', '#2563eb', '#16a34a', '#94a3b8'], label: { show: false } }]
}))

onMounted(loadAll)
</script>

<style scoped>
.report-page { padding: 12px; }
.header-row { display: flex; justify-content: space-between; align-items: center; }
.header-title { font-size: 18px; font-weight: bold; color: #1a202c; }
.filter-row { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 13px; color: #606266; }
.chart-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #0f4c5c; }
</style>
