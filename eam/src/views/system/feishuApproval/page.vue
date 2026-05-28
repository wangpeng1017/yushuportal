<template>
  <ContentWrap>
    <el-alert
      title="飞书审批模拟"
      type="info"
      :closable="false"
      class="mb-15px"
      description="用于现场客户演示。生产环境此页应替换为飞书企业 OAuth + Approval API 真实集成。审批通过后自动调用 ERP 接口生成采购单。"
    />

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane :label="`待我审批 (${pendingCount})`" name="IN_APPROVAL" />
      <el-tab-pane label="全部" name="ALL" />
    </el-tabs>

    <el-form :inline="true" class="-mb-10px">
      <el-form-item label="关键字">
        <el-input
          v-model="keyword"
          class="!w-260px"
          placeholder="审批单号 / 标题 / 申请人"
          clearable
          @keyup.enter="loadList"
          @clear="loadList"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="loadList">
          <Icon icon="ep:search" class="mr-5px" />
          搜索
        </el-button>
        <el-button @click="resetSearch">
          <Icon icon="ep:refresh" class="mr-5px" />
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" :stripe="true" border>
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="审批单号" prop="approvalCode" width="170" align="center" />
      <el-table-column label="业务类型" prop="sourceType" width="160" align="center">
        <template #default="{ row }">
          <el-tag size="small">{{ sourceTypeLabel(row.sourceType) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" min-width="260" show-overflow-tooltip />
      <el-table-column label="申请人" prop="applicantName" width="120" align="center" />
      <el-table-column label="提交时间" prop="submittedAt" width="170" align="center" />
      <el-table-column label="状态" prop="status" width="130" align="center">
        <template #default="{ row }">
          <el-tag :type="statusType(row.status)" size="small">{{ statusLabel(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审批人" prop="approver" width="120" align="center" />
      <el-table-column label="操作" align="center" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">
            <Icon icon="ep:view" class="mr-3px" />
            详情
          </el-button>
          <template v-if="row.status === 'IN_APPROVAL'">
            <el-button link type="success" @click="openAction(row, 'approve')">
              <Icon icon="ep:check" class="mr-3px" />
              通过
            </el-button>
            <el-button link type="danger" @click="openAction(row, 'reject')">
              <Icon icon="ep:close" class="mr-3px" />
              驳回
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      class="mt-15px"
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="loadList"
    />
  </ContentWrap>

  <!-- 详情弹窗 -->
  <el-dialog v-model="detailVisible" :title="`审批详情 - ${detailData.approvalCode || ''}`" width="760px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="审批单号">{{ detailData.approvalCode }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="statusType(detailData.status)" size="small">{{ statusLabel(detailData.status) }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="标题" :span="2">{{ detailData.title }}</el-descriptions-item>
      <el-descriptions-item label="申请人">{{ detailData.applicantName }}</el-descriptions-item>
      <el-descriptions-item label="提交时间">{{ detailData.submittedAt }}</el-descriptions-item>
      <el-descriptions-item label="审批人">{{ detailData.approver || '-' }}</el-descriptions-item>
      <el-descriptions-item label="审批时间">{{ detailData.approvedAt || '-' }}</el-descriptions-item>
    </el-descriptions>
    <div class="mt-15px font-bold">业务详情</div>
    <el-descriptions :column="2" border class="mt-5px">
      <el-descriptions-item v-for="(v, k) in detailObj" :key="k" :label="String(k)">{{ v }}</el-descriptions-item>
    </el-descriptions>
    <div class="mt-15px font-bold">审批节点</div>
    <el-timeline class="mt-10px">
      <el-timeline-item
        v-for="(node, idx) in detailData.approvalNodes || []"
        :key="idx"
        :type="nodeType(node.action)"
        :timestamp="node.time"
        placement="top"
      >
        <div>
          <span class="font-bold">{{ node.nodeName }}</span>
          <span class="ml-10px">{{ node.approver }}</span>
          <el-tag size="small" class="ml-10px" :type="nodeType(node.action)">{{ node.action }}</el-tag>
        </div>
        <div v-if="node.comment" class="text-12px text-gray-600 mt-3px">意见：{{ node.comment }}</div>
      </el-timeline-item>
    </el-timeline>
  </el-dialog>

  <!-- 通过/驳回意见弹窗 -->
  <el-dialog v-model="actionVisible" :title="actionTitle" width="500px">
    <el-form :model="actionForm">
      <el-form-item label="审批意见">
        <el-input
          v-model="actionForm.comment"
          type="textarea"
          :rows="4"
          :placeholder="actionType === 'approve' ? '请填写通过意见（可空）' : '请填写驳回原因'"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="actionVisible = false">取消</el-button>
      <el-button :type="actionType === 'approve' ? 'success' : 'danger'" :loading="actionLoading" @click="submitAction">
        确定{{ actionType === 'approve' ? '通过' : '驳回' }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="SystemFeishuApproval">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'

const activeTab = ref<'IN_APPROVAL' | 'ALL'>('IN_APPROVAL')
const keyword = ref('')
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)
const pendingCount = ref(0)
const queryParams = reactive({ pageNo: 1, pageSize: 10 })

const detailVisible = ref(false)
const detailData = ref<any>({})
const detailObj = computed(() => {
  const raw = detailData.value?.detail
  if (!raw) return {}
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return { 详情: String(raw) }
  }
})

const actionVisible = ref(false)
const actionLoading = ref(false)
const actionType = ref<'approve' | 'reject'>('approve')
const actionTarget = ref<any>(null)
const actionForm = reactive({ comment: '' })
const actionTitle = computed(() => (actionType.value === 'approve' ? '审批通过' : '审批驳回'))

function sourceTypeLabel(t: string) {
  if (t === 'PURCHASE_DEMAND') return '采购需求'
  if (t === 'SPARE_PART_DEMAND') return '备件采购'
  if (t === 'CUSTOM_PROJECT') return '非标研制'
  return t || '-'
}

function statusLabel(s: string) {
  switch (s) {
    case 'IN_APPROVAL': return '审批中'
    case 'APPROVED': return '已通过'
    case 'REJECTED': return '已驳回'
    case 'CANCELED': return '已撤回'
    default: return s
  }
}

function statusType(s: string): any {
  switch (s) {
    case 'IN_APPROVAL': return 'warning'
    case 'APPROVED': return 'success'
    case 'REJECTED': return 'danger'
    case 'CANCELED': return 'info'
    default: return ''
  }
}

function nodeType(action: string): any {
  if (action === '通过') return 'success'
  if (action === '驳回') return 'danger'
  if (action === '撤回') return 'info'
  return 'primary'
}

async function loadList() {
  loading.value = true
  try {
    const params: any = { ...queryParams }
    if (activeTab.value === 'IN_APPROVAL') params.status = 'IN_APPROVAL'
    if (keyword.value) params.keyword = keyword.value
    const res: any = await request.get({ url: '/admin-api/feishu/approval/page', params })
    list.value = res?.records || []
    total.value = res?.total || 0
    // 同步 pending 计数（独立请求，避免 tab 切换时被覆盖）
    if (activeTab.value !== 'IN_APPROVAL') {
      const cntRes: any = await request.get({
        url: '/admin-api/feishu/approval/page',
        params: { pageNo: 1, pageSize: 1, status: 'IN_APPROVAL' },
      })
      pendingCount.value = cntRes?.total || 0
    } else {
      pendingCount.value = total.value
    }
  } catch (e) {
    console.error('Load approval list failed:', e)
    list.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function resetSearch() {
  keyword.value = ''
  queryParams.pageNo = 1
  loadList()
}

function handleTabChange() {
  queryParams.pageNo = 1
  loadList()
}

function openDetail(row: any) {
  detailData.value = row
  detailVisible.value = true
}

function openAction(row: any, type: 'approve' | 'reject') {
  actionTarget.value = row
  actionType.value = type
  actionForm.comment = type === 'approve' ? '同意' : ''
  actionVisible.value = true
}

async function submitAction() {
  if (!actionTarget.value) return
  if (actionType.value === 'reject' && !actionForm.comment.trim()) {
    ElMessage.warning('请填写驳回原因')
    return
  }
  actionLoading.value = true
  try {
    const url =
      actionType.value === 'approve'
        ? '/admin-api/feishu/approval/approve'
        : '/admin-api/feishu/approval/reject'
    await request.post({
      url,
      data: {
        id: actionTarget.value.id,
        approvalCode: actionTarget.value.approvalCode,
        approver: '飞书审批员',
        comment: actionForm.comment,
      },
    })
    ElMessage.success(actionType.value === 'approve' ? '审批已通过' : '审批已驳回')

    // 通过时自动调 ERP 生成采购订单
    if (actionType.value === 'approve' && actionTarget.value.sourceType === 'PURCHASE_DEMAND') {
      try {
        const erpRes: any = await request.post({
          url: '/admin-api/erp/purchase-order/create',
          data: {
            sourceType: actionTarget.value.sourceType,
            sourceId: actionTarget.value.sourceId,
            approvalCode: actionTarget.value.approvalCode,
          },
        })
        if (erpRes?.erpPurchaseOrderNo) {
          ElMessage.success(`ERP 已生成采购单：${erpRes.erpPurchaseOrderNo}`)
        }
      } catch (erpErr: any) {
        ElMessage.error('ERP 推送失败，请到采购需求页重试')
        console.error('ERP create failed:', erpErr)
      }
    }
    actionVisible.value = false
    loadList()
  } catch (e: any) {
    ElMessage.error(e?.msg || '操作失败')
    console.error(e)
  } finally {
    actionLoading.value = false
  }
}

onMounted(() => loadList())
</script>
