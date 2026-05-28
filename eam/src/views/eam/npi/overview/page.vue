<template>
  <div class="npi-overview">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="非标设备研制 14 阶段流程：生产/工艺需求 → 方案设计 → 评审 1 → 方案细化 → 评审 2 → 图纸 → BOM → 采购下单 → 收料 → 物料领用 → 装配 → 预验收 → 试产+内部验收（C 端专属）" />
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="项目编号">
          <el-input v-model="queryParams.projectCode" class="!w-200px" clearable placeholder="NPI-2026-XXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="queryParams.projectName" class="!w-220px" clearable placeholder="如 PACK-A2 上下料工作站" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="当前阶段">
          <el-select v-model="queryParams.currentStage" placeholder="全部" clearable class="!w-180px">
            <el-option v-for="s in STAGES" :key="s.idx" :label="`${s.idx}. ${s.name}`" :value="s.idx" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14">
        <el-col :span="6"><div class="kpi card-blue"><div class="kpi-label">在研项目数</div><div class="kpi-num">{{ list.length }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-orange"><div class="kpi-label">采购阶段</div><div class="kpi-num">{{ countAtStage(9) }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-purple"><div class="kpi-label">装配调试中</div><div class="kpi-num">{{ countAtStage(12) }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-green"><div class="kpi-label">已验收入档</div><div class="kpi-num">{{ countAtStage(14) }}</div></div></el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="甘特图（14 阶段进度）" name="gantt">
          <div class="gantt-wrapper">
            <div class="gantt-header">
              <div class="gantt-row-label">项目</div>
              <div v-for="s in STAGES" :key="s.idx" class="gantt-stage-cell">
                <div class="gantt-stage-num">{{ String(s.idx).padStart(2, '0') }}</div>
                <div class="gantt-stage-name">{{ s.name }}</div>
              </div>
            </div>
            <div v-for="p in list" :key="p.id" class="gantt-row" @click="openDetail(p)">
              <div class="gantt-row-label">
                <div class="proj-code">{{ p.projectCode }}</div>
                <div class="proj-name">{{ p.projectName }}</div>
              </div>
              <div v-for="s in p.stages" :key="s.idx" class="gantt-cell" :class="getStageClass(s)">
                <div v-if="s.status === 'completed'" class="gantt-bar bar-done"><Icon icon="ep:check" /></div>
                <div v-else-if="s.status === 'in_progress'" class="gantt-bar bar-doing">
                  <span class="bar-label">进行中</span>
                </div>
                <div v-else-if="s.status === 'rejected'" class="gantt-bar bar-rejected">驳回</div>
                <div v-else class="gantt-bar bar-pending">—</div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="列表视图" name="list">
          <el-table :data="list" stripe @row-click="openDetail">
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="项目编号" prop="projectCode" width="160" align="center" />
            <el-table-column label="项目名称" prop="projectName" min-width="240" />
            <el-table-column label="发起部门" prop="demandDept" width="110" align="center" />
            <el-table-column label="申请人" prop="applicantName" width="100" align="center" />
            <el-table-column label="申请日期" prop="applicationDate" width="120" align="center" />
            <el-table-column label="预计交付" prop="expectedDeliveryDate" width="120" align="center" />
            <el-table-column label="预算" prop="budget" width="120" align="right">
              <template #default="{ row }">¥ {{ Number(row.budget || 0).toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="实际成本" prop="estimatedCost" width="120" align="right">
              <template #default="{ row }">¥ {{ Number(row.estimatedCost || 0).toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="当前阶段" width="180" align="center">
              <template #default="{ row }">
                <el-tag :type="row.currentStage === 14 ? 'success' : 'warning'" size="small">{{ row.currentStage }} - {{ STAGES[row.currentStage-1]?.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="进度" width="120" align="center">
              <template #default="{ row }">
                <el-progress :percentage="Math.round(row.currentStage / 14 * 100)" :status="row.currentStage === 14 ? 'success' : ''" />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>

    <el-dialog v-model="detailVisible" :title="`项目详情 - ${detailRow?.projectCode}`" width="900px" top="6vh">
      <template v-if="detailRow">
        <el-descriptions :column="2" border size="small">
          <el-descriptions-item label="项目编号">{{ detailRow.projectCode }}</el-descriptions-item>
          <el-descriptions-item label="项目名称">{{ detailRow.projectName }}</el-descriptions-item>
          <el-descriptions-item label="发起部门">{{ detailRow.demandDept }}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{ detailRow.applicantName }}</el-descriptions-item>
          <el-descriptions-item label="申请日期">{{ detailRow.applicationDate }}</el-descriptions-item>
          <el-descriptions-item label="预计交付">{{ detailRow.expectedDeliveryDate }}</el-descriptions-item>
          <el-descriptions-item label="预算">¥ {{ Number(detailRow.budget || 0).toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="实际成本">¥ {{ Number(detailRow.estimatedCost || 0).toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="项目描述" :span="2">{{ detailRow.description }}</el-descriptions-item>
        </el-descriptions>

        <div class="section-title mt-15px">14 阶段进度</div>
        <el-steps :active="detailRow.currentStage" finish-status="success" :process-status="detailRow.currentStageStatus === 'rejected' ? 'error' : 'process'" align-center>
          <el-step v-for="s in detailRow.stages" :key="s.idx" :title="s.name" :description="s.dept" />
        </el-steps>

        <div class="section-title mt-15px">关键评审节点</div>
        <el-descriptions :column="3" border size="small">
          <el-descriptions-item label="方案评审 1">
            <el-tag size="small" :type="getReviewTag(detailRow.designReview1?.status)">{{ getReviewText(detailRow.designReview1?.status) }}</el-tag>
            <div v-if="detailRow.designReview1?.time" class="text-12px text-gray-500 mt-3px">{{ detailRow.designReview1.time }} {{ detailRow.designReview1.reviewers }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="方案评审 2">
            <el-tag size="small" :type="getReviewTag(detailRow.designReview2?.status)">{{ getReviewText(detailRow.designReview2?.status) }}</el-tag>
            <div v-if="detailRow.designReview2?.time" class="text-12px text-gray-500 mt-3px">{{ detailRow.designReview2.time }} {{ detailRow.designReview2.reviewers }}</div>
          </el-descriptions-item>
          <el-descriptions-item label="预验收">
            <el-tag size="small" :type="getReviewTag(detailRow.preAcceptance?.status)">{{ getReviewText(detailRow.preAcceptance?.status) }}</el-tag>
            <div v-if="detailRow.preAcceptance?.time" class="text-12px text-gray-500 mt-3px">{{ detailRow.preAcceptance.time }} {{ detailRow.preAcceptance.reviewers }}</div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamNpiOverview">
import { ref, reactive, onMounted } from 'vue'
import request from '@/config/axios'

const STAGES = [
  { idx: 1, name: '生产需求', dept: '生产' },
  { idx: 2, name: '工艺需求', dept: '工艺' },
  { idx: 3, name: '方案设计', dept: '自动化' },
  { idx: 4, name: '方案评审 1', dept: '工艺+生产' },
  { idx: 5, name: '方案细化', dept: '自动化' },
  { idx: 6, name: '方案评审 2', dept: '工艺+生产' },
  { idx: 7, name: '图纸绘制', dept: '自动化' },
  { idx: 8, name: 'BOM 生成', dept: '自动化' },
  { idx: 9, name: '采购下单', dept: '自动化+采购' },
  { idx: 10, name: '采购收料', dept: '自动化' },
  { idx: 11, name: '物料领用', dept: '自动化' },
  { idx: 12, name: '设备装配', dept: '装配车间' },
  { idx: 13, name: '预验收', dept: '生产+工艺' },
  { idx: 14, name: '试产+验收', dept: '生产现场' }
]

const activeTab = ref('gantt')
const queryParams = reactive({ projectCode: '', projectName: '', currentStage: undefined as number | undefined })
const list = ref<any[]>([])

async function loadList() {
  const res: any = await request.get({ url: '/eam/npi/project/page', params: queryParams })
  list.value = res?.records || []
}
function resetQuery() {
  Object.assign(queryParams, { projectCode: '', projectName: '', currentStage: undefined })
  loadList()
}
function countAtStage(stage: number) {
  return list.value.filter(p => p.currentStage === stage).length
}

function getStageClass(stage: any) {
  if (stage.status === 'completed') return 'cell-done'
  if (stage.status === 'in_progress') return 'cell-doing'
  if (stage.status === 'rejected') return 'cell-rejected'
  return 'cell-pending'
}

function getReviewTag(s: string): any {
  if (s === 'PASSED') return 'success'
  if (s === 'REJECTED') return 'danger'
  return 'info'
}
function getReviewText(s: string): string {
  return ({ PASSED: '已通过', REJECTED: '已驳回', PENDING: '待评审' } as any)[s] || '待评审'
}

const detailVisible = ref(false)
const detailRow = ref<any>(null)
async function openDetail(row: any) {
  const res: any = await request.get({ url: '/eam/npi/project/get', params: { id: row.id } })
  detailRow.value = res
  detailVisible.value = true
}

onMounted(loadList)
</script>

<style scoped>
.npi-overview { padding: 12px; }
.kpi { padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-label { font-size: 13px; color: #909399; }
.kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; margin-top: 6px; color: #303133; }
.card-blue { border-left-color: #409eff; }
.card-orange { border-left-color: #909399; }
.card-purple { border-left-color: #909399; }
.card-green { border-left-color: #67c23a; }
.section-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #409eff; }

.gantt-wrapper { overflow-x: auto; }
.gantt-header { display: flex; background: #f5f7fa; border-bottom: 2px solid #e4e7ed; position: sticky; top: 0; z-index: 2; }
.gantt-row-label { width: 200px; flex-shrink: 0; padding: 8px 12px; font-weight: 600; font-size: 12px; border-right: 1px solid #e4e7ed; }
.gantt-stage-cell { width: 86px; flex-shrink: 0; padding: 8px 4px; text-align: center; border-right: 1px solid #e4e7ed; }
.gantt-stage-num { font-size: 11px; color: #909399; font-weight: 600; }
.gantt-stage-name { font-size: 11px; color: #303133; line-height: 1.3; margin-top: 2px; }
.gantt-row { display: flex; border-bottom: 1px solid #e4e7ed; cursor: pointer; transition: background 0.15s; }
.gantt-row:hover { background: #f0f9ff; }
.gantt-row .gantt-row-label { line-height: 1.4; padding: 10px 12px; }
.proj-code { font-size: 12px; color: #909399; }
.proj-name { font-size: 13px; color: #303133; font-weight: 600; }
.gantt-cell { width: 86px; flex-shrink: 0; padding: 12px 6px; border-right: 1px solid #f0f2f5; display: flex; align-items: center; justify-content: center; }
.gantt-bar { width: 100%; height: 26px; border-radius: 4px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; }
.bar-done { background: #67c23a; color: white; }
.bar-doing { background: #5b8def; color: white; animation: pulse 1.5s ease-in-out infinite; }
.bar-rejected { background: #f56c6c; color: white; }
.bar-pending { background: #f5f7fa; color: #c0c4cc; }
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.65; }
}
</style>
