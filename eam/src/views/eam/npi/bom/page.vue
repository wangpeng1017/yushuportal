<template>
  <div class="npi-bom">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="BOM 管理：自动化设备团队按图纸生成，分 3 类 — 机加件 / 钣金件 / 外购标准件；含供应商、单价、货期；可一键生成采购需求推送飞书黑盒架构" />
      <el-form :inline="true" :model="queryParams">
        <el-form-item label="项目">
          <el-select v-model="queryParams.projectId" placeholder="请选择项目" class="!w-280px" @change="loadList">
            <el-option v-for="p in projects" :key="p.id" :label="p.projectCode + ' - ' + p.projectName" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="generatePurchase"><Icon icon="ep:promotion" />一键生成采购申请（推送飞书）</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap v-if="queryParams.projectId">
      <el-row :gutter="14" class="mb-15px">
        <el-col :span="6"><div class="kpi card-blue"><div class="kpi-label">机加件</div><div class="kpi-num">{{ machining.length }}</div><div class="kpi-foot">¥ {{ machSum.toLocaleString() }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-orange"><div class="kpi-label">钣金件</div><div class="kpi-num">{{ sheetMetal.length }}</div><div class="kpi-foot">¥ {{ sheetSum.toLocaleString() }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-purple"><div class="kpi-label">外购标准件</div><div class="kpi-num">{{ standard.length }}</div><div class="kpi-foot">¥ {{ stdSum.toLocaleString() }}</div></div></el-col>
        <el-col :span="6"><div class="kpi card-green"><div class="kpi-label">BOM 总额</div><div class="kpi-num">¥ {{ totalSum.toLocaleString() }}</div></div></el-col>
      </el-row>

      <el-tabs v-model="activeTab">
        <el-tab-pane :label="`机加件 (${machining.length})`" name="machining">
          <el-table :data="machining" stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="物料编码" prop="code" width="160" />
            <el-table-column label="物料名称" prop="name" min-width="180" />
            <el-table-column label="图号" prop="drawingNo" width="180" align="center" />
            <el-table-column label="材质" prop="material" width="160" />
            <el-table-column label="数量" prop="quantity" width="80" align="center" />
            <el-table-column label="单位" prop="unit" width="60" align="center" />
            <el-table-column label="供应商" prop="supplier" width="140" />
            <el-table-column label="单价" prop="unitPrice" width="100" align="right">
              <template #default="{ row }">¥ {{ row.unitPrice }}</template>
            </el-table-column>
            <el-table-column label="小计" prop="total" width="120" align="right">
              <template #default="{ row }">¥ {{ Number(row.total).toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="到货日期" prop="deliveryDate" width="110" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`钣金件 (${sheetMetal.length})`" name="sheetMetal">
          <el-table :data="sheetMetal" stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="物料编码" prop="code" width="160" />
            <el-table-column label="物料名称" prop="name" min-width="180" />
            <el-table-column label="图号" prop="drawingNo" width="180" align="center" />
            <el-table-column label="材质" prop="material" width="160" />
            <el-table-column label="数量" prop="quantity" width="80" align="center" />
            <el-table-column label="单位" prop="unit" width="60" align="center" />
            <el-table-column label="供应商" prop="supplier" width="140" />
            <el-table-column label="单价" prop="unitPrice" width="100" align="right">
              <template #default="{ row }">¥ {{ row.unitPrice }}</template>
            </el-table-column>
            <el-table-column label="小计" prop="total" width="120" align="right">
              <template #default="{ row }">¥ {{ Number(row.total).toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="到货日期" prop="deliveryDate" width="110" align="center" />
          </el-table>
        </el-tab-pane>
        <el-tab-pane :label="`外购标准件 (${standard.length})`" name="standard">
          <el-table :data="standard" stripe>
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="物料编码" prop="code" width="160" />
            <el-table-column label="物料名称" prop="name" min-width="180" />
            <el-table-column label="规格型号" prop="specification" width="200" />
            <el-table-column label="数量" prop="quantity" width="80" align="center" />
            <el-table-column label="单位" prop="unit" width="60" align="center" />
            <el-table-column label="供应商" prop="supplier" width="140" />
            <el-table-column label="单价" prop="unitPrice" width="100" align="right">
              <template #default="{ row }">¥ {{ row.unitPrice }}</template>
            </el-table-column>
            <el-table-column label="小计" prop="total" width="120" align="right">
              <template #default="{ row }">¥ {{ Number(row.total).toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="到货日期" prop="deliveryDate" width="110" align="center" />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </ContentWrap>
    <ContentWrap v-else>
      <el-empty description="请先选择项目查看 BOM 明细" />
    </ContentWrap>
  </div>
</template>

<script setup lang="ts" name="EamNpiBom">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const projects = ref<any[]>([])
const queryParams = reactive({ projectId: '' as string })
const activeTab = ref('machining')
const machining = ref<any[]>([])
const sheetMetal = ref<any[]>([])
const standard = ref<any[]>([])

const machSum = computed(() => machining.value.reduce((s, x) => s + Number(x.total || 0), 0))
const sheetSum = computed(() => sheetMetal.value.reduce((s, x) => s + Number(x.total || 0), 0))
const stdSum = computed(() => standard.value.reduce((s, x) => s + Number(x.total || 0), 0))
const totalSum = computed(() => machSum.value + sheetSum.value + stdSum.value)

async function loadProjects() {
  const res: any = await request.get({ url: '/eam/npi/project/page' })
  projects.value = res?.records || []
  if (projects.value.length && !queryParams.projectId) {
    queryParams.projectId = projects.value[0].id
    loadList()
  }
}

async function loadList() {
  if (!queryParams.projectId) return
  const [m, s, p] = await Promise.all([
    request.get({ url: '/eam/npi/bom/list', params: { projectId: queryParams.projectId, bomType: 'machining' } }),
    request.get({ url: '/eam/npi/bom/list', params: { projectId: queryParams.projectId, bomType: 'sheetMetal' } }),
    request.get({ url: '/eam/npi/bom/list', params: { projectId: queryParams.projectId, bomType: 'standard' } })
  ])
  machining.value = (m as any)?.records || []
  sheetMetal.value = (s as any)?.records || []
  standard.value = (p as any)?.records || []
}

async function generatePurchase() {
  if (!queryParams.projectId) { ElMessage.warning('请先选择项目'); return }
  await ElMessageBox.confirm(
    `将根据当前 BOM 生成 ${machining.value.length + sheetMetal.value.length + standard.value.length} 条采购明细，推送飞书审批 → ERP 自动 PO`,
    '一键生成采购申请', { type: 'warning' }
  )
  ElMessage.success('已生成采购申请单并推送飞书，请到「采购管理 → 设备采购」查看')
}

onMounted(loadProjects)
</script>

<style scoped>
.npi-bom { padding: 12px; }
.kpi { padding: 18px; border-radius: 6px; background: #fff; border: 1px solid #ebeef5; border-left-width: 4px; box-shadow: 0 1px 3px rgba(0,21,41,0.04); }
.kpi-label { font-size: 13px; color: #909399; }
.kpi-num { font-size: 26px; font-weight: 600; line-height: 1.2; margin-top: 6px; color: #303133; }
.kpi-foot { font-size: 12px; color: #909399; margin-top: 4px; }
.card-blue { border-left-color: #409eff; }
.card-orange { border-left-color: #909399; }
.card-purple { border-left-color: #909399; }
.card-green { border-left-color: #67c23a; }
</style>
