<template>
  <div class="patrol-work-page">
    <!-- 顶部统计卡片 -->
    <div class="stat-grid">
      <div class="stat-card"><div class="num">{{ list.length }}</div><div class="label">本周工单总数</div></div>
      <div class="stat-card success"><div class="num">{{ list.filter(r => r.status === '已完成').length }}</div><div class="label">完整完成</div></div>
      <div class="stat-card warn"><div class="num">{{ list.filter(r => r.status === '进行中').length }}</div><div class="label">进行中</div></div>
      <div class="stat-card danger"><div class="num">{{ list.filter(r => r.miss > 0).length }}</div><div class="label">漏点 → 隐患工单</div></div>
    </div>

    <!-- 搜索区 -->
    <ContentWrap>
      <el-form :model="queryParams" :inline="true" label-width="90px" class="-mb-15px">
        <el-form-item label="工单号" prop="code">
          <el-input v-model="queryParams.code" class="!w-200px" clearable placeholder="请输入工单号" />
        </el-form-item>
        <el-form-item label="巡检路线" prop="route">
          <el-input v-model="queryParams.route" class="!w-200px" clearable placeholder="请输入路线" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-140px">
            <el-option label="未开始" value="未开始" />
            <el-option label="进行中" value="进行中" />
            <el-option label="已完成" value="已完成" />
            <el-option label="异常完成" value="异常完成" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="() => {}"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 主表 -->
    <ContentWrap>
      <el-table :data="filteredList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="工单号" prop="code" width="160" align="center" />
        <el-table-column label="所属计划" prop="planCode" width="110" align="center" />
        <el-table-column label="巡检路线" prop="route" min-width="200" />
        <el-table-column label="时段" prop="shift" width="90" align="center" />
        <el-table-column label="执行人" prop="executor" width="90" align="center" />
        <el-table-column label="打卡进度" width="180" align="center">
          <template #default="{row}">
            <div class="progress-cell">
              <div class="pace-bar" :class="row.miss > 0 ? 'danger' : (row.checked < row.total ? 'warn' : '')">
                <div class="fill" :style="{ width: (row.checked / row.total * 100) + '%' }"></div>
              </div>
              <span style="font-size:12px;color:#606266;min-width:40px;">{{ row.checked }}/{{ row.total }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="漏点" width="80" align="center">
          <template #default="{row}">
            <span v-if="row.miss > 0" class="miss-tag">缺 {{ row.miss }}</span>
            <span v-else style="color:#c0c4cc;">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="110" align="center">
          <template #default="{row}">
            <el-tag size="small" :type="statusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="异常去向" width="160" align="center">
          <template #default="{row}">
            <el-link v-if="row.hazardOrder" type="warning" :underline="false" @click="msg('跳转 隐患工单 ' + row.hazardOrder)">→ {{ row.hazardOrder }}</el-link>
            <span v-else style="color:#c0c4cc;">—</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="120">
          <template #default="{row}">
            <el-button link class="btn-other" @click="openTrace(row)">查看轨迹</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="filteredList.length" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" />
    </ContentWrap>

    <!-- 轨迹弹窗 -->
    <el-dialog v-model="traceVisible" title="巡检轨迹" width="640px">
      <div v-if="curWork">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="工单号">{{ curWork.code }}</el-descriptions-item>
          <el-descriptions-item label="所属计划">{{ curWork.planCode }}</el-descriptions-item>
          <el-descriptions-item label="巡检路线">{{ curWork.route }}</el-descriptions-item>
          <el-descriptions-item label="时段">{{ curWork.shift }}</el-descriptions-item>
          <el-descriptions-item label="执行人">{{ curWork.executor }}</el-descriptions-item>
          <el-descriptions-item label="状态"><el-tag size="small" :type="statusType(curWork.status)">{{ curWork.status }}</el-tag></el-descriptions-item>
          <el-descriptions-item label="打卡进度">{{ curWork.checked }}/{{ curWork.total }}</el-descriptions-item>
          <el-descriptions-item label="漏点">
            <span v-if="curWork.miss > 0" class="miss-tag">缺 {{ curWork.miss }}</span>
            <span v-else>—</span>
          </el-descriptions-item>
        </el-descriptions>
        <h4 style="margin:20px 0 12px 0;color:#303133;">📍 打卡轨迹</h4>
        <el-timeline v-if="curWork.trace && curWork.trace.length">
          <el-timeline-item v-for="(t, i) in curWork.trace" :key="i" :type="t.type" :timestamp="t.time" placement="top">
            <strong>{{ t.point }}</strong>
            <div style="font-size:12px;color:#909399;margin-top:4px;">{{ t.note }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else description="暂无轨迹数据" />
      </div>
      <template #footer><el-button @click="traceVisible = false">关闭</el-button></template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

defineOptions({ name: 'EamPatrolWork' })

const message = useMessage()
const queryParams = reactive({ code: '', route: '', status: '', pageNo: 1, pageSize: 10 })
const traceVisible = ref(false)
const curWork = ref<any>(null)

const list = ref<any[]>([
  { id: '1', code: 'PW2026-0512', planCode: 'PP001', route: 'CR-PWR-001 配电室路线', shift: '早班', executor: '张三', checked: 8, total: 8, miss: 0, status: '已完成', hazardOrder: null, trace: [
    { type: 'success', time: '08:02', point: '1号配电柜', note: 'NFC 打卡 · 状态正常' },
    { type: 'success', time: '08:08', point: '2号变压器', note: 'NFC 打卡 · 状态正常' },
    { type: 'success', time: '08:15', point: '配电室门口', note: 'GPS 打卡' },
    { type: 'success', time: '08:21', point: '高压柜', note: 'NFC 打卡' },
    { type: 'success', time: '08:25', point: '接地装置', note: '二维码打卡' },
    { type: 'success', time: '08:28', point: '应急照明', note: '二维码打卡 · 已测试' },
    { type: 'success', time: '08:33', point: 'UPS', note: 'NFC 打卡' },
    { type: 'success', time: '08:38', point: '消防设施', note: 'GPS 打卡 · 完成' }
  ] },
  { id: '2', code: 'PW2026-0513', planCode: 'PP001', route: 'CR-PWR-001 配电室路线', shift: '中班', executor: '李四', checked: 3, total: 8, miss: 0, status: '进行中', hazardOrder: null, trace: [
    { type: 'success', time: '14:32', point: '1号配电柜', note: 'NFC 打卡 · 状态正常' },
    { type: 'warning', time: '14:38', point: '2号变压器', note: '⚠ 油位偏低，已上报隐患' },
    { type: 'success', time: '14:45', point: '配电室门口', note: 'GPS 打卡' },
    { type: 'primary', time: '14:50', point: '高压柜（进行中）', note: '...' }
  ] },
  { id: '3', code: 'PW2026-0514', planCode: 'PP001', route: 'CR-PWR-001 配电室路线', shift: '夜班', executor: '王六', checked: 6, total: 8, miss: 2, status: '异常完成', hazardOrder: 'HZ2026-0019', trace: [
    { type: 'success', time: '22:05', point: '1号配电柜', note: 'NFC 打卡' },
    { type: 'success', time: '22:10', point: '2号变压器', note: 'NFC 打卡' },
    { type: 'success', time: '22:18', point: '配电室门口', note: 'GPS 打卡' },
    { type: 'success', time: '22:25', point: '高压柜', note: 'NFC 打卡' },
    { type: 'danger', time: '22:30', point: '接地装置（漏点）', note: '⚠ 未打卡，超时跳过' },
    { type: 'success', time: '22:38', point: '应急照明', note: '二维码打卡' },
    { type: 'danger', time: '22:42', point: 'UPS（漏点）', note: '⚠ 未打卡' },
    { type: 'success', time: '22:50', point: '消防设施', note: 'GPS 打卡' }
  ] },
  { id: '4', code: 'PW2026-0515', planCode: 'PP002', route: 'CR-PWR-002 锅炉房路线', shift: '14:00', executor: '动力员', checked: 6, total: 6, miss: 0, status: '已完成', hazardOrder: null, trace: [] },
  { id: '5', code: 'PW2026-0516', planCode: 'PP003', route: 'CR-C-001 PACK 车间', shift: '早班', executor: '王工', checked: 5, total: 5, miss: 0, status: '已完成', hazardOrder: null, trace: [] },
  { id: '6', code: 'PW2026-0517', planCode: 'PP004', route: 'CR-C-002 电机装配线', shift: '中班', executor: '李工', checked: 4, total: 4, miss: 0, status: '已完成', hazardOrder: null, trace: [] },
  { id: '7', code: 'PW2026-0518', planCode: 'PP005', route: 'CR-B-001 B 端电子车间', shift: '早班', executor: '张工', checked: 4, total: 4, miss: 0, status: '已完成', hazardOrder: null, trace: [] },
  { id: '8', code: 'PW2026-0519', planCode: 'PP008', route: 'CR-PWR-001 配电室路线', shift: '月度', executor: '安全员', checked: 8, total: 12, miss: 4, status: '异常完成', hazardOrder: 'HZ2026-0020', trace: [] }
])

const filteredList = computed(() => list.value.filter(r => {
  if (queryParams.code && !r.code.includes(queryParams.code)) return false
  if (queryParams.route && !r.route.includes(queryParams.route)) return false
  if (queryParams.status && r.status !== queryParams.status) return false
  return true
}))

const resetQuery = () => Object.assign(queryParams, { code: '', route: '', status: '', pageNo: 1 })
const statusType = (s: string) => {
  if (s === '已完成') return 'success'
  if (s === '进行中') return 'warning'
  if (s === '异常完成') return 'danger'
  return 'info'
}
const openTrace = (row: any) => { curWork.value = row; traceVisible.value = true }
const msg = (t: string) => message.success(t)
</script>

<style scoped>
.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.stat-card { padding: 16px 18px; border-radius: 4px; background: #fff; border-left: 4px solid #409eff; box-shadow: 0 1px 4px rgba(0,21,41,0.04); }
.stat-card.warn { border-left-color: #e6a23c; }
.stat-card.danger { border-left-color: #f56c6c; }
.stat-card.success { border-left-color: #67c23a; }
.stat-card .num { font-size: 26px; font-weight: 600; color: #303133; line-height: 1.2; }
.stat-card .label { font-size: 12px; color: #909399; margin-top: 4px; }
.progress-cell { display: flex; align-items: center; gap: 8px; }
.pace-bar { flex: 1; height: 6px; background: #ebeef5; border-radius: 3px; overflow: hidden; }
.pace-bar .fill { height: 100%; background: #67c23a; transition: width .3s; }
.pace-bar.warn .fill { background: #e6a23c; }
.pace-bar.danger .fill { background: #f56c6c; }
.miss-tag { background: #fef0f0; color: #f56c6c; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
</style>
