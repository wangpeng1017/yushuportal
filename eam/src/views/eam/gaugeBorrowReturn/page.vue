<template>
  <SimpleListPage
    ref="listRef"
    apiPath="/admin-api/eam/gauge-borrow-return/page"
    :columns="columns"
    :searchFields="[{ prop: 'borrowerName', label: '借用人' }, { prop: 'gaugeCode', label: '量具编号' }]"
    :enableCreate="true"
    :enableDetail="true"
    detailTitleProp="borrowCode"
    @create="handleCreate"
  >
    <template #action="{ row }">
      <el-button v-if="row.returnStatus !== '已归还'" link type="success" @click="handleReturn(row)">
        <Icon icon="ep:check" class="mr-3px" />归还
      </el-button>
    </template>
  </SimpleListPage>
  <SimpleFormDialog
    ref="formRef"
    title="新增借用记录"
    :fields="formFields"
    apiCreate="/admin-api/eam/gauge-borrow-return/create"
    @success="reloadList"
  />
  <!-- 归还对话框 -->
  <el-dialog v-model="returnVisible" title="量具归还登记" width="600px">
    <el-form :model="returnForm" label-width="120px">
      <el-form-item label="借用记录号">
        <el-input v-model="returnForm.borrowCode" disabled />
      </el-form-item>
      <el-form-item label="量具编号">
        <el-input v-model="returnForm.gaugeCode" disabled />
      </el-form-item>
      <el-form-item label="实际归还日期" required>
        <el-date-picker v-model="returnForm.actualReturnDate" type="date" value-format="YYYY-MM-DD" class="!w-full" />
      </el-form-item>
      <el-form-item label="归还检查结果" required>
        <el-radio-group v-model="returnForm.returnCondition">
          <el-radio-button label="完好">完好</el-radio-button>
          <el-radio-button label="损坏">损坏</el-radio-button>
          <el-radio-button label="丢失">丢失</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="returnForm.returnCondition && returnForm.returnCondition !== '完好'" label="损坏/丢失说明">
        <el-input
v-model="returnForm.damageRemark" type="textarea" :rows="3"
          placeholder="勾选损坏或丢失时建议填写，将自动联动报废登记" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="returnForm.remark" type="textarea" :rows="2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="returnVisible = false">取消</el-button>
      <el-button type="primary" @click="submitReturn">确认归还</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="EamGaugeBorrowReturn">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'
import SimpleListPage from '../_tooling-shared/SimpleListPage.vue'
import SimpleFormDialog from '../_tooling-shared/SimpleFormDialog.vue'

const columns = [
  { prop: 'borrowCode', label: '借用记录号', width: 180 },
  { prop: 'gaugeCode', label: '量具编号', width: 200 },
  { prop: 'borrowerName', label: '借用人', width: 120 },
  { prop: 'borrowDate', label: '借用日期', width: 120 },
  { prop: 'expectedReturnDate', label: '预计归还', width: 120 },
  { prop: 'actualReturnDate', label: '实际归还', width: 120 },
  {
    prop: 'returnStatus', label: '归还状态', width: 100,
    tag: (r: any) => r.returnStatus === '已归还' ? 'success' : (r.returnStatus === '逾期' ? 'danger' : 'warning')
  },
  {
    prop: 'returnCondition', label: '检查结果', width: 100,
    tag: (r: any) => r.returnCondition === '完好' ? 'success' : (r.returnCondition === '损坏' ? 'danger' : (r.returnCondition === '丢失' ? 'danger' : 'info'))
  },
  { prop: 'damageRemark', label: '损坏说明', minWidth: 200 },
]

const formFields = [
  { prop: 'gaugeCode', label: '量具编号', required: true, placeholder: '量具内部编号' },
  { prop: 'borrowerName', label: '借用人', required: true },
  { prop: 'borrowDate', label: '借用日期', type: 'date' as const, required: true },
  { prop: 'expectedReturnDate', label: '预计归还日期', type: 'date' as const, required: true },
  { prop: 'remark', label: '备注', type: 'textarea' as const, span: 24 },
]

const listRef = ref()
const formRef = ref()
const returnVisible = ref(false)
const returnForm = reactive<any>({})

function handleCreate() {
  formRef.value?.open()
}
function reloadList() {
  listRef.value?.loadList()
}

function handleReturn(row: any) {
  Object.keys(returnForm).forEach(k => delete returnForm[k])
  Object.assign(returnForm, {
    id: row.id,
    borrowCode: row.borrowCode,
    gaugeCode: row.gaugeCode,
    actualReturnDate: new Date().toISOString().slice(0, 10),
    returnCondition: '完好',
    damageRemark: '',
    remark: ''
  })
  returnVisible.value = true
}

async function submitReturn() {
  if (!returnForm.actualReturnDate || !returnForm.returnCondition) {
    ElMessage.warning('请填写完整的归还信息')
    return
  }
  await request.post({ url: '/admin-api/eam/gauge-borrow-return/return', data: returnForm })
  ElMessage.success('归还登记成功' + (returnForm.returnCondition !== '完好' ? '，已联动报废登记' : ''))
  returnVisible.value = false
  reloadList()
}
</script>
