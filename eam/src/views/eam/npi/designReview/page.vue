<template>
  <div class="npi-review">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="非标设备方案评审：3 个评审节点 — 方案评审 1（三维方案，工艺+生产）/ 方案评审 2（细化方案，工艺+生产）/ 预验收（生产+工艺确认达标）" />
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="项目编号">
          <el-input v-model="queryParams.projectCode" class="!w-200px" clearable />
        </el-form-item>
        <el-form-item label="评审类型">
          <el-select v-model="queryParams.type" placeholder="全部" clearable class="!w-180px">
            <el-option label="方案评审 1" value="方案评审 1" />
            <el-option label="方案评审 2" value="方案评审 2" />
            <el-option label="预验收" value="预验收" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-180px">
            <el-option label="待评审" value="PENDING" />
            <el-option label="已通过" value="PASSED" />
            <el-option label="已驳回" value="REJECTED" />
          </el-select>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="14" class="mb-15px">
        <el-col :span="8"><div class="kpi card-orange"><div class="kpi-label">待评审</div><div class="kpi-num">{{ countPending }}</div></div></el-col>
        <el-col :span="8"><div class="kpi card-green"><div class="kpi-label">已通过</div><div class="kpi-num">{{ countPassed }}</div></div></el-col>
        <el-col :span="8"><div class="kpi card-red"><div class="kpi-label">已驳回</div><div class="kpi-num">{{ countRejected }}</div></div></el-col>
      </el-row>

      <el-table :data="filteredList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="项目编号" prop="projectCode" width="160" align="center" />
        <el-table-column label="项目名称" prop="projectName" min-width="240" />
        <el-table-column label="评审类型" prop="type" width="130" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.type === '预验收' ? 'warning' : ''">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评审人" prop="reviewers" width="180" align="center" />
        <el-table-column label="评审意见" prop="comment" min-width="280" />
        <el-table-column label="评审时间" prop="time" width="120" align="center" />
        <el-table-column label="状态" prop="status" width="110" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING'" link type="success" @click="approve(row)">通过</el-button>
            <el-button v-if="row.status === 'PENDING'" link type="danger" @click="reject(row)">驳回</el-button>
            <el-button v-else link type="primary">查看记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamNpiDesignReview">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const list = ref<any[]>([])
const queryParams = reactive({ projectCode: '', type: '', status: '' })

const filteredList = computed(() => list.value.filter(x => {
  if (queryParams.projectCode && !(x.projectCode || '').includes(queryParams.projectCode)) return false
  if (queryParams.type && x.type !== queryParams.type) return false
  if (queryParams.status && x.status !== queryParams.status) return false
  return true
}))

const countPending = computed(() => filteredList.value.filter(x => x.status === 'PENDING').length)
const countPassed = computed(() => filteredList.value.filter(x => x.status === 'PASSED').length)
const countRejected = computed(() => filteredList.value.filter(x => x.status === 'REJECTED').length)

function getStatusTag(s: string): any {
  if (s === 'PASSED') return 'success'
  if (s === 'REJECTED') return 'danger'
  return 'warning'
}
function getStatusText(s: string): string {
  return ({ PASSED: '已通过', REJECTED: '已驳回', PENDING: '待评审' } as any)[s] || s
}

async function loadList() {
  const res: any = await request.get({ url: '/eam/npi/review/list' })
  list.value = res?.records || []
}

async function approve(row: any) {
  await ElMessageBox.confirm(`通过「${row.projectName}」的「${row.type}」？`, '通过评审', { type: 'success' })
  row.status = 'PASSED'
  row.reviewers = '当前评审组'
  row.comment = '评审通过'
  row.time = new Date().toISOString().slice(0, 10)
  ElMessage.success('已通过，项目自动推进到下一阶段')
}
async function reject(row: any) {
  await ElMessageBox.confirm(`驳回「${row.projectName}」的「${row.type}」？请在弹窗描述驳回原因`, '驳回评审', { type: 'warning' })
  row.status = 'REJECTED'
  row.reviewers = '当前评审组'
  row.comment = '驳回 - 请优化方案后重新提交'
  row.time = new Date().toISOString().slice(0, 10)
  ElMessage.success('已驳回，自动化设备团队将重新调整方案')
}

onMounted(loadList)
</script>

<style scoped>
.npi-review { padding: 12px; }
.kpi { padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-label { font-size: 13px; color: #909399; }
.kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; margin-top: 6px; color: #303133; }
.card-orange { border-left-color: #909399; }
.card-green { border-left-color: #67c23a; }
.card-red { border-left-color: #f56c6c; }
</style>
