<template>
  <div class="erp-sync-page">
    <!-- 概览卡片 -->
    <ContentWrap>
      <el-row :gutter="16">
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-label">同步策略</div>
            <div class="stat-value">{{ config.cronDesc || '—' }}</div>
            <div class="stat-sub">cron: {{ config.cronExpr || '—' }}</div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-label">上次同步时间</div>
            <div class="stat-value">{{ config.lastSyncTime || '—' }}</div>
            <div class="stat-sub">
              <el-tag size="small" type="success">成功 {{ config.lastSuccessCount ?? 0 }}</el-tag>
              <el-tag size="small" type="danger" class="ml-5px">失败 {{ config.lastFailureCount ?? 0 }}</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="stat-card">
            <div class="stat-label">下次自动同步</div>
            <div class="stat-value">{{ config.nextSyncTime || '—' }}</div>
            <div class="stat-sub">
              <el-tag v-if="config.enabled" size="small" type="success">已启用</el-tag>
              <el-tag v-else size="small" type="info">已暂停</el-tag>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :lg="6">
          <el-card shadow="never" class="stat-card stat-action">
            <div class="stat-label">手动操作</div>
            <el-button type="primary" :icon="Refresh" :loading="runLoading" @click="handleRunNow">
              立即同步
            </el-button>
            <div class="stat-sub mt-5px">同步对象：{{ config.syncTarget || '—' }}</div>
          </el-card>
        </el-col>
      </el-row>
    </ContentWrap>

    <!-- 配置表单 -->
    <ContentWrap>
      <div class="title-bar">
        <span class="title-text">同步策略配置</span>
        <span class="title-hint">修改 cron 表达式与同步开关</span>
      </div>
      <el-form :model="form" label-width="120px" class="mt-10px">
        <el-row :gutter="20">
          <el-col :xs="24" :md="12">
            <el-form-item label="cron 表达式" required>
              <el-input v-model="form.cronExpr" placeholder="0 0 2 * * ?" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="说明">
              <el-input v-model="form.cronDesc" placeholder="如：每天凌晨 02:00" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="是否启用">
              <el-switch v-model="form.enabled" active-text="启用" inactive-text="暂停" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="同步对象">
              <el-input v-model="form.syncTarget" placeholder="如：设备主数据 + 物料 BOM" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="saveLoading" @click="handleSaveConfig">
            <Icon icon="ep:check" class="mr-3px" />保存配置
          </el-button>
          <el-button @click="loadConfig">
            <Icon icon="ep:refresh" class="mr-3px" />重新加载
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- 同步历史 -->
    <ContentWrap>
      <div class="title-bar">
        <span class="title-text">同步历史</span>
        <span class="title-hint">最近 10 条同步记录</span>
      </div>
      <el-table v-loading="historyLoading" :data="historyList" :stripe="true" border class="mt-10px">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="开始时间" prop="startTime" width="170" align="center" />
        <el-table-column label="结束时间" prop="endTime" width="170" align="center" />
        <el-table-column label="耗时" width="100" align="center">
          <template #default="{ row }">{{ (row.durationMs / 1000).toFixed(2) }} s</template>
        </el-table-column>
        <el-table-column label="触发方式" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.trigger === 'AUTO' ? 'primary' : 'warning'" size="small">
              {{ row.trigger === 'AUTO' ? '自动' : '手动' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成功" prop="success" width="80" align="center">
          <template #default="{ row }">
            <el-tag type="success" size="small">{{ row.success }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="失败" prop="failure" width="80" align="center">
          <template #default="{ row }">
            <el-tag :type="row.failure > 0 ? 'danger' : 'info'" size="small">{{ row.failure }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作人" prop="operator" width="120" align="center" />
        <el-table-column label="备注" prop="remark" min-width="200" :show-overflow-tooltip="true" />
      </el-table>
      <Pagination
        class="mt-15px"
        :total="historyTotal"
        v-model:page="historyParams.pageNo"
        v-model:limit="historyParams.pageSize"
        @pagination="loadHistory"
      />
    </ContentWrap>

    <!-- 立即同步弹窗 -->
    <el-dialog v-model="runDialogVisible" title="立即同步 ERP 设备主数据" width="500px">
      <el-alert
        title="同步范围说明"
        description="留空则按默认策略全量同步；若指定物料号或时间范围，则按条件增量拉取。"
        type="info" :closable="false" class="mb-15px"
      />
      <el-form :model="runForm" label-width="100px">
        <el-form-item label="物料号">
          <el-input v-model="runForm.materialNo" placeholder="可选，例如 PACK-2024" clearable />
        </el-form-item>
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="runForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="runDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="runLoading" @click="confirmRunNow">
          <Icon icon="ep:promotion" class="mr-3px" />确认同步
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'
import request from '@/config/axios'

defineOptions({ name: 'SystemErpSync' })

// ── 配置 ──
interface SyncConfig {
  cronExpr: string
  cronDesc: string
  lastSyncTime?: string
  nextSyncTime?: string
  lastSuccessCount?: number
  lastFailureCount?: number
  enabled: boolean
  syncTarget?: string
}

const config = reactive<SyncConfig>({
  cronExpr: '',
  cronDesc: '',
  enabled: true,
  syncTarget: ''
})

const form = reactive<SyncConfig>({
  cronExpr: '',
  cronDesc: '',
  enabled: true,
  syncTarget: ''
})

const saveLoading = ref(false)

async function loadConfig() {
  try {
    const data: any = await request.get({ url: '/admin-api/system/erp-sync/config' })
    Object.assign(config, data || {})
    form.cronExpr = config.cronExpr
    form.cronDesc = config.cronDesc
    form.enabled = config.enabled
    form.syncTarget = config.syncTarget || ''
  } catch (e) {
    console.error('Load erp-sync config failed', e)
  }
}

async function handleSaveConfig() {
  if (!form.cronExpr.trim()) {
    ElMessage.warning('cron 表达式不能为空')
    return
  }
  saveLoading.value = true
  try {
    const data: any = await request.put({
      url: '/admin-api/system/erp-sync/config',
      data: { ...form }
    })
    Object.assign(config, data || {})
    ElMessage.success('配置已保存')
  } catch (e) {
    ElMessage.error('保存失败')
    console.error(e)
  } finally {
    saveLoading.value = false
  }
}

// ── 立即同步 ──
const runDialogVisible = ref(false)
const runLoading = ref(false)
const runForm = reactive({
  materialNo: '',
  dateRange: [] as string[]
})

function handleRunNow() {
  runForm.materialNo = ''
  runForm.dateRange = []
  runDialogVisible.value = true
}

async function confirmRunNow() {
  runLoading.value = true
  try {
    const body: any = {
      materialNo: runForm.materialNo || undefined,
      dateRange: runForm.dateRange?.length ? runForm.dateRange : undefined,
      operator: 'admin'
    }
    const data: any = await request.post({ url: '/admin-api/system/erp-sync/run', data: body })
    if (data?.snapshot) Object.assign(config, data.snapshot)
    ElMessage.success(`同步完成：成功 ${data?.success ?? 0} 条，失败 ${data?.failure ?? 0} 条`)
    runDialogVisible.value = false
    await loadHistory()
  } catch (e) {
    ElMessage.error('同步失败')
    console.error(e)
  } finally {
    runLoading.value = false
  }
}

// ── 同步历史 ──
const historyList = ref<any[]>([])
const historyTotal = ref(0)
const historyLoading = ref(false)
const historyParams = reactive({ pageNo: 1, pageSize: 10 })

async function loadHistory() {
  historyLoading.value = true
  try {
    const data: any = await request.get({
      url: '/admin-api/system/erp-sync/history',
      params: { ...historyParams }
    })
    historyList.value = data?.records || []
    historyTotal.value = data?.total || 0
  } catch (e) {
    historyList.value = []
    historyTotal.value = 0
  } finally {
    historyLoading.value = false
  }
}

onMounted(async () => {
  await loadConfig()
  await loadHistory()
})
</script>

<style lang="scss" scoped>
.erp-sync-page {
  .stat-card {
    height: 120px;

    .stat-label {
      font-size: 13px;
      color: #909399;
      margin-bottom: 8px;
    }

    .stat-value {
      font-size: 22px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 6px;
      word-break: break-all;
    }

    .stat-sub {
      font-size: 12px;
      color: #606266;
    }

    &.stat-action {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .title-bar {
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 8px;
    margin-bottom: 4px;

    .title-text {
      font-size: 16px;
      font-weight: 600;
      margin-right: 12px;
    }

    .title-hint {
      font-size: 12px;
      color: #909399;
    }
  }
}
</style>
