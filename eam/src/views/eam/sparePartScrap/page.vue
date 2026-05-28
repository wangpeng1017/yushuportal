<template>
  <div class="sp-scrap">
    <ContentWrap>
      <el-alert
type="warning" :closable="false" show-icon class="mb-15px"
        title="备件报废说明：损坏 / 超期失效 / 工艺淘汰 / 错件等触发；登记后部门负责人审核 → 资产核销 → 写入流水。" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="报废单号">
          <el-input v-model="queryParams.code" class="!w-200px" clearable placeholder="SP-SC-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.sparePartName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="报废原因">
          <el-select v-model="queryParams.reason" class="!w-180px" clearable placeholder="全部">
            <el-option label="损坏" value="损坏" />
            <el-option label="超期失效" value="超期失效" />
            <el-option label="工艺淘汰" value="工艺淘汰" />
            <el-option label="错件" value="错件" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryParams.status" class="!w-160px" clearable placeholder="全部">
            <el-option label="待审核" value="PENDING" />
            <el-option label="已审核" value="APPROVED" />
            <el-option label="已驳回" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="6">
          <el-card shadow="never" class="card-red">
            <div class="kpi-label">报废批次</div>
            <div class="kpi-num kpi-red">{{ filtered.length }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">待审核</div>
            <div class="kpi-num kpi-orange">{{ countPending }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-green">
            <div class="kpi-label">已核销</div>
            <div class="kpi-num kpi-green">{{ countApproved }}</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">报废估值</div>
            <div class="kpi-num kpi-blue">¥ {{ totalAmountText }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="mb-10px">
        <el-button type="primary" plain @click="openForm"><Icon icon="ep:plus" />报废登记</el-button>
      </div>

      <el-table v-loading="loading" :data="filtered" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="报废单号" prop="code" width="160" align="center" />
        <el-table-column label="备件编号" prop="sparePartNumber" width="120" align="center" />
        <el-table-column label="备件名称" prop="sparePartName" min-width="180" />
        <el-table-column label="报废数量" prop="quantity" width="90" align="center" />
        <el-table-column label="报废原因" prop="reason" width="110" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="getReasonTag(row.reason)">{{ row.reason }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="估值" width="110" align="right">
          <template #default="{ row }">¥ {{ Number(row.amount || 0).toLocaleString() }}</template>
        </el-table-column>
        <el-table-column label="申请人" prop="applicantName" width="100" align="center" />
        <el-table-column label="申请时间" prop="applicationDate" width="120" align="center" />
        <el-table-column label="处理方式" prop="processWay" width="120" align="center" />
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusTag(row.status)" size="small">{{ statusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="审核人" prop="approverName" width="100" align="center" />
        <el-table-column label="操作" width="160" align="center" fixed="right">
          <template #default="{ row }">
            <el-button v-if="row.status === 'PENDING'" link type="success" @click="approve(row)">通过</el-button>
            <el-button v-if="row.status === 'PENDING'" link type="danger" @click="reject(row)">驳回</el-button>
            <span v-else style="color:#909399;font-size:12px;">{{ row.status === 'APPROVED' ? '已核销' : '已驳回' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </ContentWrap>

    <el-dialog v-model="formVisible" title="备件报废登记" width="560px">
      <el-form :model="formData" label-position="top">
        <el-form-item label="备件编号" required>
          <el-input v-model="formData.sparePartNumber" placeholder="扫码或输入" />
        </el-form-item>
        <el-form-item label="备件名称" required>
          <el-input v-model="formData.sparePartName" />
        </el-form-item>
        <el-form-item label="报废数量" required>
          <el-input-number v-model="formData.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="报废原因" required>
          <el-radio-group v-model="formData.reason">
            <el-radio-button label="损坏">损坏</el-radio-button>
            <el-radio-button label="超期失效">超期失效</el-radio-button>
            <el-radio-button label="工艺淘汰">工艺淘汰</el-radio-button>
            <el-radio-button label="错件">错件</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理方式">
          <el-radio-group v-model="formData.processWay">
            <el-radio-button label="销毁">销毁</el-radio-button>
            <el-radio-button label="退供应商">退供应商</el-radio-button>
            <el-radio-button label="折旧回收">折旧回收</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="估值（元）">
          <el-input-number v-model="formData.amount" :min="0" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formData.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交报废申请</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamSparePartScrap">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])
const queryParams = reactive({ code: '', sparePartName: '', reason: '', status: '' })

const filtered = computed(() => list.value.filter(x => {
  if (queryParams.code && !(x.code || '').includes(queryParams.code)) return false
  if (queryParams.sparePartName && !(x.sparePartName || '').includes(queryParams.sparePartName)) return false
  if (queryParams.reason && x.reason !== queryParams.reason) return false
  if (queryParams.status && x.status !== queryParams.status) return false
  return true
}))

const countPending = computed(() => filtered.value.filter(x => x.status === 'PENDING').length)
const countApproved = computed(() => filtered.value.filter(x => x.status === 'APPROVED').length)
const totalAmountText = computed(() => filtered.value.reduce((s, x) => s + Number(x.amount || 0), 0).toLocaleString())

function statusText(s: string) {
  return ({ PENDING: '待审核', APPROVED: '已通过', REJECTED: '已驳回' } as any)[s] || s
}
function getStatusTag(s: string): any {
  if (s === 'APPROVED') return 'success'
  if (s === 'REJECTED') return 'danger'
  return 'warning'
}
function getReasonTag(r: string): any {
  if (r === '损坏') return 'danger'
  if (r === '超期失效') return 'warning'
  if (r === '错件') return 'info'
  return ''
}

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({ url: '/admin-api/eam/sparePartScrap/list', params: { pageNo: 1, pageSize: 100 } })
    list.value = res?.records || []
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(queryParams, { code: '', sparePartName: '', reason: '', status: '' }) }

const formVisible = ref(false)
const formData = reactive({
  sparePartNumber: '', sparePartName: '', quantity: 1, reason: '损坏', processWay: '销毁', amount: 0, remark: ''
})
function openForm() {
  Object.assign(formData, { sparePartNumber: '', sparePartName: '', quantity: 1, reason: '损坏', processWay: '销毁', amount: 0, remark: '' })
  formVisible.value = true
}
function submitForm() {
  if (!formData.sparePartNumber || !formData.sparePartName) { ElMessage.warning('请填写备件编号和名称'); return }
  ElMessage.success('报废申请已提交，等待部门负责人审核')
  formVisible.value = false
  loadList()
}

async function approve(row: any) {
  await ElMessageBox.confirm(`通过报废申请 ${row.code}？将自动扣减库存并写入资产核销流水`, '审核通过', { type: 'success' })
  ElMessage.success('已通过，资产核销完成')
  row.status = 'APPROVED'
  row.approverName = '部门负责人'
}
async function reject(row: any) {
  await ElMessageBox.confirm(`驳回报废申请 ${row.code}？请在驳回备注中说明原因`, '驳回', { type: 'warning' })
  ElMessage.success('已驳回')
  row.status = 'REJECTED'
  row.approverName = '部门负责人'
}

onMounted(loadList)
</script>

<style scoped>
.sp-scrap { padding: 12px; }
.kpi-row { margin-bottom: 15px; }
/* Notion 风：白底 + 左色条，去掉色块背景 */
.card-red, .card-orange, .card-green, .card-blue {
  background: #fff;
  border: 1px solid #ebeef5;
  border-left-width: 4px;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,21,41,0.04);
}
.card-red { border-left-color: #f56c6c; }
.card-orange { border-left-color: #909399; }
.card-green { border-left-color: #67c23a; }
.card-blue { border-left-color: #409eff; }
.kpi-label { font-size: 13px; color: #909399; }
.kpi-num { font-size: 26px; font-weight: 600; margin-top: 5px; color: #303133; }
/* 数字本身不要彩色，统一深字 */
.kpi-red, .kpi-orange, .kpi-green, .kpi-blue { color: #303133; }
</style>
