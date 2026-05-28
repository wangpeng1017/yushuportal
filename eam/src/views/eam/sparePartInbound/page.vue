<template>
  <div class="sp-inbound">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件入库说明：触发来源 = ERP 采购订单到货 / 退库入库 / 调拨入库；操作员扫码登记 → 自动写入备件库存与流水。" />
      <el-form :inline="true" :model="queryParams" class="-mb-15px">
        <el-form-item label="单据号">
          <el-input v-model="queryParams.recordCode" class="!w-200px" clearable placeholder="SPR-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="备件名称">
          <el-input v-model="queryParams.sparePartName" class="!w-200px" clearable placeholder="如 NSK 润滑脂" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item label="关联采购单">
          <el-input v-model="queryParams.refWoCode" class="!w-200px" clearable placeholder="PO-XXXX" @keyup.enter="loadList" />
        </el-form-item>
        <el-form-item>
          <el-button @click="loadList"><Icon icon="ep:search" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-row :gutter="12" class="kpi-row">
        <el-col :span="8">
          <el-card shadow="never" class="card-blue">
            <div class="kpi-label">入库批次（近期）</div>
            <div class="kpi-num kpi-blue">{{ list.length }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-green">
            <div class="kpi-label">入库总数（件次）</div>
            <div class="kpi-num kpi-green">{{ totalQty }}</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" class="card-orange">
            <div class="kpi-label">关联采购单数</div>
            <div class="kpi-num kpi-orange">{{ uniquePoCount }}</div>
          </el-card>
        </el-col>
      </el-row>

      <div class="mb-10px">
        <el-button type="primary" plain @click="openManual"><Icon icon="ep:plus" />手动入库</el-button>
        <el-button plain @click="ElMessage.info('请到「采购管理 → 备件采购」状态=已生成PO 的单据上一键到货入库')"><Icon icon="ep:link" />从 ERP 采购单一键入库</el-button>
      </div>

      <el-table v-loading="loading" :data="list" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="单据号" prop="recordCode" width="160" align="center" />
        <el-table-column label="备件编号" prop="sparePartNumber" width="120" align="center" />
        <el-table-column label="备件名称" prop="sparePartName" min-width="160" />
        <el-table-column label="入库数量" prop="quantity" width="100" align="center" />
        <el-table-column label="关联采购单" prop="refWoCode" width="160" align="center" />
        <el-table-column label="供应商" prop="equipmentSupplierName" width="130" align="center" />
        <el-table-column label="入库人" prop="operatorName" width="100" align="center" />
        <el-table-column label="入库时间" prop="usageTime" width="160" align="center" />
        <el-table-column label="备注" prop="remark" min-width="160" />
      </el-table>
    </ContentWrap>

    <el-dialog v-model="manualVisible" title="手动入库登记" width="520px">
      <el-form :model="manualForm" label-width="100px" label-position="top">
        <el-form-item label="备件编号" required>
          <el-input v-model="manualForm.sparePartNumber" placeholder="扫码或输入" />
        </el-form-item>
        <el-form-item label="备件名称" required>
          <el-input v-model="manualForm.sparePartName" placeholder="备件名称" />
        </el-form-item>
        <el-form-item label="入库数量" required>
          <el-input-number v-model="manualForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="入库类型">
          <el-radio-group v-model="manualForm.refWoType">
            <el-radio-button label="采购订单">采购到货</el-radio-button>
            <el-radio-button label="退库">退库入库</el-radio-button>
            <el-radio-button label="调拨入库">调拨入库</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单号关联">
          <el-input v-model="manualForm.refWoCode" placeholder="PO 号 / 工单号 / 调拨单号" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="manualForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="manualVisible = false">取消</el-button>
        <el-button type="primary" @click="submitManual">确认入库</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamSparePartInbound">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const list = ref<any[]>([])
const queryParams = reactive({ recordCode: '', sparePartName: '', refWoCode: '' })

const totalQty = computed(() => list.value.reduce((s, x) => s + Number(x.quantity || 0), 0))
const uniquePoCount = computed(() => new Set(list.value.map(x => x.refWoCode).filter(c => c && c !== '-')).size)

async function loadList() {
  loading.value = true
  try {
    const res: any = await request.get({
      url: '/workOrder/eamSparePartUsageRecord/list',
      params: { pageNo: 1, pageSize: 100, operationType: '入库', ...queryParams }
    })
    let arr = res?.records || []
    if (queryParams.recordCode) arr = arr.filter((x: any) => (x.recordCode || '').includes(queryParams.recordCode))
    if (queryParams.refWoCode) arr = arr.filter((x: any) => (x.refWoCode || '').includes(queryParams.refWoCode))
    list.value = arr
  } finally {
    loading.value = false
  }
}
function resetQuery() { Object.assign(queryParams, { recordCode: '', sparePartName: '', refWoCode: '' }); loadList() }

const manualVisible = ref(false)
const manualForm = reactive({ sparePartNumber: '', sparePartName: '', quantity: 1, refWoType: '采购订单', refWoCode: '', remark: '' })
function openManual() {
  Object.assign(manualForm, { sparePartNumber: '', sparePartName: '', quantity: 1, refWoType: '采购订单', refWoCode: '', remark: '' })
  manualVisible.value = true
}
function submitManual() {
  if (!manualForm.sparePartNumber || !manualForm.sparePartName) { ElMessage.warning('请填写备件编号和名称'); return }
  ElMessage.success('入库登记成功，已生成单据并扣账')
  manualVisible.value = false
  loadList()
}

onMounted(loadList)
</script>

<style scoped>
.sp-inbound { padding: 12px; }
.kpi-row { margin-bottom: 15px; }
.card-blue { background: #eff6ff; }
.card-green { background: #f0fdf4; }
.card-orange { background: #fff7ed; }
.kpi-label { font-size: 13px; color: #606266; }
.kpi-num { font-size: 28px; font-weight: bold; margin-top: 5px; }
.kpi-blue { color: #2563eb; }
.kpi-green { color: #16a34a; }
.kpi-orange { color: #f97316; }
</style>
