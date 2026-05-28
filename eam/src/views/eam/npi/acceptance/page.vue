<template>
  <div class="npi-acc">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="装配与验收：装配车间完成机械装配/接线/电气调试，自动化设备团队通知生产+工艺预验收 → 生产现场调试 → 批量试产 → 内部验收，4 步全部通过即可入档设备台账" />
    </ContentWrap>

    <ContentWrap>
      <div class="section-title">装配进度（按项目）</div>
      <el-row :gutter="14">
        <el-col v-for="p in projectsWithAssembly" :key="p.id" :span="12">
          <div class="project-card">
            <div class="card-header">
              <div>
                <div class="proj-code">{{ p.projectCode }}</div>
                <div class="proj-name">{{ p.projectName }}</div>
              </div>
              <el-tag :type="p.currentStage === 14 ? 'success' : 'warning'" size="small">阶段 {{ p.currentStage }}</el-tag>
            </div>
            <div v-for="(stage, key) in p.assembly" :key="key" class="assembly-row">
              <span class="stage-label">{{ key }}</span>
              <el-progress :percentage="stage.progress" :status="stage.progress === 100 ? 'success' : ''" :stroke-width="14" />
              <span v-if="stage.completedAt" class="completed-at">{{ stage.completedAt }}</span>
              <span v-else class="completed-at">— 进行中</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </ContentWrap>

    <ContentWrap>
      <div class="section-title">验收记录</div>
      <el-table :data="acceptances" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="项目编号" prop="projectCode" width="160" align="center" />
        <el-table-column label="项目名称" prop="projectName" min-width="220" />
        <el-table-column label="验收类型" prop="type" width="130" align="center">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="验收日期" prop="date" width="120" align="center" />
        <el-table-column label="参与方" prop="participants" width="220" />
        <el-table-column label="发现问题" prop="issues" min-width="240" />
        <el-table-column label="结论" prop="conclusion" min-width="200" />
        <el-table-column label="结果" prop="result" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.result === 'PASSED' ? 'success' : 'danger'" size="small">{{ row.result === 'PASSED' ? '通过' : '不通过' }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamNpiAcceptance">
import { ref, computed, onMounted } from 'vue'
import request from '@/config/axios'

const projects = ref<any[]>([])
const acceptances = ref<any[]>([])

const projectsWithAssembly = computed(() => projects.value.filter(p => p.assembly))

function getTypeTag(t: string): any {
  if (t === '内部验收') return 'success'
  if (t === '预验收') return 'warning'
  if (t === '批量试产') return ''
  return 'info'
}

async function loadAll() {
  // 加载所有项目（含装配进度）
  const res: any = await request.get({ url: '/eam/npi/project/page' })
  const list = res?.records || []
  // 分别 get 详情，取出 assembly
  const detailed = await Promise.all(list.map(async (p: any) => {
    const d: any = await request.get({ url: '/eam/npi/project/get', params: { id: p.id } })
    return d
  }))
  projects.value = detailed
  // 验收记录
  const ac: any = await request.get({ url: '/eam/npi/acceptance/list' })
  acceptances.value = ac?.records || []
}

onMounted(loadAll)
</script>

<style scoped>
.npi-acc { padding: 12px; }
.section-title { font-size: 14px; font-weight: 600; color: #303133; margin-bottom: 10px; padding-left: 8px; border-left: 3px solid #0f4c5c; }
.project-card { background: white; border: 1px solid #e4e7ed; border-radius: 8px; padding: 16px; margin-bottom: 14px; }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #e4e7ed; }
.proj-code { font-size: 12px; color: #909399; }
.proj-name { font-size: 14px; color: #303133; font-weight: 600; margin-top: 2px; }
.assembly-row { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.stage-label { font-size: 13px; color: #303133; width: 90px; flex-shrink: 0; }
.assembly-row :deep(.el-progress) { flex: 1; }
.completed-at { font-size: 12px; color: #909399; min-width: 100px; text-align: right; }
</style>
