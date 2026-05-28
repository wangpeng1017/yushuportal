<template>
  <div class="custom-equipment-project-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="项目编号" prop="projectCode">
          <el-input
            v-model="queryParams.projectCode"
            class="!w-200px"
            clearable
            placeholder="请输入项目编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="queryParams.projectName"
            class="!w-200px"
            clearable
            placeholder="请输入项目名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="当前阶段" prop="currentPhase">
          <el-select
            v-model="queryParams.currentPhase"
            placeholder="请选择阶段"
            clearable
            class="!w-200px"
          >
            <el-option
              v-for="item in PHASE_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="项目状态" prop="status">
          <el-select
            v-model="queryParams.status"
            placeholder="请选择状态"
            clearable
            class="!w-200px"
          >
            <el-option
              v-for="item in STATUS_OPTIONS"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" />&nbsp;搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" />&nbsp;重置
          </el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <!-- ==================== 主表列表 ==================== -->
    <ContentWrap>
      <div class="table-toolbar">
        <el-button plain type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          plain
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        @row-dblclick="handleRowDblClick"
        @selection-change="handleSelectionChange"
        highlight-current-row
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="项目编号" align="center" prop="projectCode" width="130" />
        <el-table-column label="项目名称" align="center" prop="projectName" min-width="180" />
        <el-table-column label="需求来源" align="center" prop="demandSource" width="90">
          <template #default="scope">
            <span style="color:#606266">{{ scope.row.demandSource || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前阶段" align="center" prop="currentPhase" width="120">
          <template #default="scope">
            <el-tag :type="getPhaseColor(scope.row.currentPhase)">
              {{ getPhaseName(scope.row.currentPhase) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="负责人" align="center" prop="responsiblePersonName" width="90" />
        <el-table-column label="计划时间" align="center" width="220">
          <template #default="scope">
            {{
              scope.row.planStartDate && scope.row.planEndDate
                ? scope.row.planStartDate + ' 至 ' + scope.row.planEndDate
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column label="项目状态" align="center" prop="status" width="90">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="交付设备" align="center" prop="deliveryEquipmentSn" width="120" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="260">
          <template #default="scope">
            <el-button link type="primary" @click="openFlowDetail(scope.row)">
              &nbsp;流程详情
            </el-button>
            <el-button link class="btn-other" @click="openForm('view', scope.row)">
              &nbsp;查看
            </el-button>
            <el-button link class="btn-edit" @click="openForm('edit', scope.row)">
              &nbsp;编辑
            </el-button>
            <el-button link class="btn-delete" @click="handleDelete(scope.row)">
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>

    <!-- ==================== 下方：子表 Tabs ==================== -->
    <ContentWrap>
      <div v-if="!currentProject" class="no-selection-tip">
        <el-empty description="双击上方列表行加载子表数据" />
      </div>
      <template v-else>
        <div class="sub-table-header">
          <span class="sub-table-title">
            当前项目：<strong>{{ currentProject.projectName }}</strong>
            （{{ currentProject.projectCode }}）
          </span>
        </div>
        <el-tabs v-model="activeTab">
          <!-- ====== BOM清单 Tab ====== -->
          <el-tab-pane label="BOM清单" name="bom">
            <el-table
              v-loading="bomLoading"
              :data="bomList"
              :stripe="true"
              :show-overflow-tooltip="true"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="物料编码" align="center" prop="materialCode" width="130" />
              <el-table-column label="物料名称" align="center" prop="materialName" min-width="160" />
              <el-table-column label="物料类型" align="center" prop="materialType" width="110">
                <template #default="scope">
                  <el-tag :type="getMaterialTypeColor(scope.row.materialType)">
                    {{ scope.row.materialType || '--' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="规格型号" align="center" prop="specification" width="150" />
              <el-table-column label="数量" align="center" prop="quantity" width="80" />
              <el-table-column label="供应商" align="center" prop="supplierName" width="150" />
              <el-table-column label="采购状态" align="center" prop="purchaseStatus" width="100">
                <template #default="scope">
                  <el-tag :type="getPurchaseStatusColor(scope.row.purchaseStatus)">
                    {{ scope.row.purchaseStatus || '--' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            <Pagination
              :total="bomTotal"
              v-model:page="bomQueryParams.pageNo"
              v-model:limit="bomQueryParams.pageSize"
              @pagination="getBomList"
            />
          </el-tab-pane>

          <!-- ====== 评审记录 Tab ====== -->
          <el-tab-pane label="评审记录" name="review">
            <el-table
              v-loading="reviewLoading"
              :data="reviewList"
              :stripe="true"
              :show-overflow-tooltip="true"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="评审类型" align="center" prop="reviewType" width="130" />
              <el-table-column label="评审日期" align="center" prop="reviewDate" width="120" />
              <el-table-column label="评审人" align="center" prop="reviewerNames" width="150" />
              <el-table-column label="评审结论" align="center" prop="reviewResult" width="120">
                <template #default="scope">
                  <el-tag :type="getReviewResultColor(scope.row.reviewResult)">
                    {{ scope.row.reviewResult || '--' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="评审意见" align="center" prop="reviewSuggestion" min-width="200" />
            </el-table>
            <Pagination
              :total="reviewTotal"
              v-model:page="reviewQueryParams.pageNo"
              v-model:limit="reviewQueryParams.pageSize"
              @pagination="getReviewList"
            />
          </el-tab-pane>

          <!-- ====== 验收记录 Tab ====== -->
          <el-tab-pane label="验收记录" name="acceptance">
            <el-table
              v-loading="acceptanceLoading"
              :data="acceptanceList"
              :stripe="true"
              :show-overflow-tooltip="true"
            >
              <el-table-column type="index" label="序号" width="60" align="center" />
              <el-table-column label="验收类型" align="center" prop="reviewType" width="130" />
              <el-table-column label="验收日期" align="center" prop="reviewDate" width="120" />
              <el-table-column label="验收人" align="center" prop="reviewerNames" width="150" />
              <el-table-column label="验收结论" align="center" prop="reviewResult" width="120">
                <template #default="scope">
                  <el-tag :type="getReviewResultColor(scope.row.reviewResult)">
                    {{ scope.row.reviewResult || '--' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="验收意见" align="center" prop="reviewSuggestion" min-width="200" />
            </el-table>
            <Pagination
              :total="acceptanceTotal"
              v-model:page="acceptanceQueryParams.pageNo"
              v-model:limit="acceptanceQueryParams.pageSize"
              @pagination="getAcceptanceList"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
    </ContentWrap>

    <!-- ==================== 新增/编辑弹窗 ==================== -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="680px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目编号" prop="projectCode">
              <el-input
                v-model="formData.projectCode"
                placeholder="请输入项目编号"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目名称" prop="projectName">
              <el-input
                v-model="formData.projectName"
                placeholder="请输入项目名称"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="需求来源" prop="demandSource">
              <el-select
                v-model="formData.demandSource"
                placeholder="请选择需求来源"
                :disabled="dialogType === 'view'"
                class="w-full"
              >
                <el-option label="生产需求" value="生产需求" />
                <el-option label="工艺需求" value="工艺需求" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人" prop="responsiblePersonName">
              <el-input
                v-model="formData.responsiblePersonName"
                placeholder="请输入负责人"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划开始" prop="planStartDate">
              <el-date-picker
                v-model="formData.planStartDate"
                type="date"
                placeholder="请选择计划开始日期"
                value-format="YYYY-MM-DD"
                :disabled="dialogType === 'view'"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划结束" prop="planEndDate">
              <el-date-picker
                v-model="formData.planEndDate"
                type="date"
                placeholder="请选择计划结束日期"
                value-format="YYYY-MM-DD"
                :disabled="dialogType === 'view'"
                class="w-full"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="需求描述" prop="demandDescription">
              <el-input
                v-model="formData.demandDescription"
                type="textarea"
                :rows="4"
                placeholder="请输入需求描述"
                :disabled="dialogType === 'view'"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          v-if="dialogType !== 'view'"
          type="primary"
          @click="submitForm"
          :loading="submitLoading"
        >
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getProjectPage,
  createProject,
  updateProject,
  deleteProject,
  advancePhase,
  getBomPage,
  getReviewPage,
  type ProjectVo
} from '@/api/eam/customEquipmentProject'

const router = useRouter()
function openFlowDetail(row: any) {
  router.push({ path: '/eam/project/customEquipmentProject/flow/' + (row.id || row.projectCode) })
}

// ── 阶段枚举 ──
const PHASE_OPTIONS = [
  { value: '1',  label: '需求提报',       color: '' },
  { value: '2',  label: '工艺需求转化',    color: '' },
  { value: '3',  label: '方案设计',       color: '' },
  { value: '4',  label: '方案评审1',      color: 'warning' },
  { value: '5',  label: '方案细化',       color: '' },
  { value: '6',  label: '方案评审2',      color: 'warning' },
  { value: '7',  label: '图纸绘制',       color: '' },
  { value: '8',  label: 'BOM生成',        color: '' },
  { value: '9',  label: '采购下单',       color: '' },
  { value: '10', label: '采购收料',       color: '' },
  { value: '11', label: '物料领用+装配',  color: '' },
  { value: '12', label: '预验收',         color: 'warning' },
  { value: '13', label: '调试+批量试产',  color: '' },
  { value: '14', label: '内部验收',       color: 'success' },
]

// ── 状态枚举 ──
const STATUS_OPTIONS = [
  { value: '1', label: '进行中', type: 'success' },
  { value: '2', label: '已完成', type: 'info' },
  { value: '3', label: '已取消', type: 'danger' },
]

// ── 工具函数 ──
function getPhaseName(val: string) {
  return PHASE_OPTIONS.find(o => o.value === val)?.label || val || '--'
}
function getPhaseColor(val: string): string {
  return PHASE_OPTIONS.find(o => o.value === val)?.color || ''
}
function getStatusType(val: string): string {
  return STATUS_OPTIONS.find(o => o.value === val)?.type || ''
}
function getStatusLabel(val: string): string {
  return STATUS_OPTIONS.find(o => o.value === val)?.label || val || '--'
}
function getMaterialTypeColor(type: string): string {
  const map: Record<string, string> = { '机加件': 'primary', '钣金件': 'warning', '外购标准件': '' }
  return map[type] || ''
}
function getPurchaseStatusColor(status: string): string {
  const map: Record<string, string> = { '待采购': '', '已下单': 'warning', '已到货': 'success' }
  return map[status] || ''
}
function getReviewResultColor(result: string): string {
  const map: Record<string, string> = { '通过': 'success', '有条件通过': 'warning', '不通过': 'danger' }
  return map[result] || ''
}

// ── 主表状态 ──
const loading = ref(false)
const list = ref<ProjectVo[]>([])
const total = ref(0)
const selectedIds = ref<string[]>([])
const queryParams = reactive({
  projectCode: '',
  projectName: '',
  currentPhase: '',
  status: '',
  pageNo: 1,
  pageSize: 10,
})

// ── 子表状态 ──
const currentProject = ref<ProjectVo | null>(null)
const activeTab = ref('bom')

const bomLoading = ref(false)
const bomList = ref<any[]>([])
const bomTotal = ref(0)
const bomQueryParams = reactive({ pageNo: 1, pageSize: 10 })

const reviewLoading = ref(false)
const reviewList = ref<any[]>([])
const reviewTotal = ref(0)
const reviewQueryParams = reactive({ pageNo: 1, pageSize: 10 })

const acceptanceLoading = ref(false)
const acceptanceList = ref<any[]>([])
const acceptanceTotal = ref(0)
const acceptanceQueryParams = reactive({ pageNo: 1, pageSize: 10 })

// ── 弹窗状态 ──
const dialogVisible = ref(false)
const dialogTitle = ref('')
const dialogType = ref<'create' | 'edit' | 'view'>('create')
const submitLoading = ref(false)
const formRef = ref()
const formData = reactive<ProjectVo>({})

const formRules = {
  projectCode: [{ required: true, message: '请输入项目编号', trigger: 'blur' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  demandSource: [{ required: true, message: '请选择需求来源', trigger: 'change' }],
}

// ── 主表方法 ──
async function getList() {
  loading.value = true
  try {
    const res = await getProjectPage(queryParams)
    const data = res?.data || res
    list.value = data?.records || []
    total.value = data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNo = 1
  getList()
}

function resetQuery() {
  queryParams.projectCode = ''
  queryParams.projectName = ''
  queryParams.currentPhase = ''
  queryParams.status = ''
  queryParams.pageNo = 1
  getList()
}

function handleSelectionChange(rows: ProjectVo[]) {
  selectedIds.value = rows.map(r => r.id as string)
}

function handleRowDblClick(row: ProjectVo) {
  currentProject.value = row
  bomQueryParams.pageNo = 1
  reviewQueryParams.pageNo = 1
  acceptanceQueryParams.pageNo = 1
  getBomList()
  getReviewList()
  getAcceptanceList()
}

async function handleBatchDelete() {
  if (selectedIds.value.length === 0) return
  await ElMessageBox.confirm(`确认删除选中的 ${selectedIds.value.length} 条记录？`, '警告', { type: 'warning' })
  try {
    for (const id of selectedIds.value) {
      await deleteProject(id)
    }
    ElMessage.success('删除成功')
    getList()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

async function handleDelete(row: ProjectVo) {
  await ElMessageBox.confirm(`确认删除项目【${row.projectName}】？`, '警告', { type: 'warning' })
  try {
    await deleteProject(row.id as string)
    ElMessage.success('删除成功')
    if (currentProject.value?.id === row.id) {
      currentProject.value = null
    }
    getList()
  } catch (e) {
    ElMessage.error('删除失败')
  }
}

async function handleAdvancePhase(row: ProjectVo) {
  const nextPhase = PHASE_OPTIONS.find(o => o.value === String(Number(row.currentPhase) + 1))
  const nextLabel = nextPhase ? nextPhase.label : '完成'
  await ElMessageBox.confirm(
    `确认将项目【${row.projectName}】从【${getPhaseName(row.currentPhase || '')}】推进到【${nextLabel}】？`,
    '推进阶段确认',
    { type: 'warning' }
  )
  try {
    await advancePhase(row.id as string)
    ElMessage.success('阶段推进成功')
    getList()
  } catch (e) {
    ElMessage.error('阶段推进失败')
  }
}

// ── 弹窗方法 ──
function openForm(type: 'create' | 'edit' | 'view', row?: ProjectVo) {
  dialogType.value = type
  dialogTitle.value = type === 'create' ? '新增研制项目' : type === 'edit' ? '编辑研制项目' : '查看研制项目'
  Object.assign(formData, {
    id: undefined,
    projectCode: '',
    projectName: '',
    demandSource: '',
    demandDescription: '',
    responsiblePersonName: '',
    planStartDate: '',
    planEndDate: '',
  })
  if (row) {
    Object.assign(formData, { ...row })
  }
  dialogVisible.value = true
}

async function submitForm() {
  if (!formRef.value) return
  await formRef.value.validate()
  submitLoading.value = true
  try {
    if (formData.id) {
      await updateProject({ ...formData })
      ElMessage.success('编辑成功')
    } else {
      await createProject({ ...formData })
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    getList()
  } catch (e) {
    ElMessage.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

// ── 子表方法 ──
async function getBomList() {
  if (!currentProject.value) return
  bomLoading.value = true
  try {
    const res = await getBomPage({ projectCode: currentProject.value.projectCode, ...bomQueryParams })
    const data = res?.data || res
    bomList.value = data?.records || []
    bomTotal.value = data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    bomLoading.value = false
  }
}

async function getReviewList() {
  if (!currentProject.value) return
  reviewLoading.value = true
  try {
    const res = await getReviewPage({
      projectCode: currentProject.value.projectCode,
      reviewCategory: 'review',
      ...reviewQueryParams
    })
    const data = res?.data || res
    reviewList.value = data?.records || []
    reviewTotal.value = data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    reviewLoading.value = false
  }
}

async function getAcceptanceList() {
  if (!currentProject.value) return
  acceptanceLoading.value = true
  try {
    const res = await getReviewPage({
      projectCode: currentProject.value.projectCode,
      reviewCategory: 'acceptance',
      ...acceptanceQueryParams
    })
    const data = res?.data || res
    acceptanceList.value = data?.records || []
    acceptanceTotal.value = data?.total || 0
  } catch (e) {
    console.error(e)
  } finally {
    acceptanceLoading.value = false
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.custom-equipment-project-page {
  padding: 0;
}
.table-toolbar {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}
.sub-table-header {
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}
.sub-table-title {
  font-size: 14px;
  color: #606266;
}
.no-selection-tip {
  padding: 20px 0;
}
</style>
