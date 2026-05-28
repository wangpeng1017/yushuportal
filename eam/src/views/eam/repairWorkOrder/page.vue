<template>
  <!-- 搜索区域 -->
  <ContentWrap>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="auto">
      <el-form-item label="维修单号" prop="repairCode">
        <el-input
          v-model="queryParams.repairCode"
          placeholder="请输入维修单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="报修工单号" prop="failureWorkOrderCode">
        <el-input
          v-model="queryParams.failureWorkOrderCode"
          placeholder="请输入报修工单号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备编号" prop="equipmentSn">
        <el-input
          v-model="queryParams.equipmentSn"
          placeholder="请输入设备编号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input
          v-model="queryParams.equipmentName"
          placeholder="请输入设备名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="设备型号" prop="equipmentMode">
        <el-input
          v-model="queryParams.equipmentMode"
          placeholder="请输入设备型号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable class="!w-200px">
          <el-option
            v-for="item in statusOptionsForSearch"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="createTimeRange"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="YYYY-MM-DD"
          :disabled-date="disabledDate"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表区域 -->
  <ContentWrap>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['eam:repairWorkOrder:create']"
        >
          <Icon icon="ep:plus" /> 创建快速工单
        </el-button>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" :row-class-name="getRepairRowClassName" @row-dblclick="handleRepairRowDblClick">
      <el-table-column label="维修单号" align="center" prop="repairCode" width="160" />
      <el-table-column label="维修状态" align="center" prop="status" width="100">
        <template #default="{ row }">
          <el-tag :type="eamEnumStore.getRepairWorkOrderStatusType(row.status)" size="small">
            {{ eamEnumStore.getRepairWorkOrderStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="维修人员" align="center" prop="repairPersonName" width="100" />
      <el-table-column
        label="维修开始时间"
        align="center"
        prop="repairBeginTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="维修结束时间"
        align="center"
        prop="repairEndTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="设备编号" align="center" prop="equipmentSn" width="140" />
      <el-table-column label="设备名称" align="center" prop="equipmentName" width="150" />
      <el-table-column label="设备类型" align="center" prop="equipmentTypeName" width="120" />
      <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120" />
      <el-table-column label="供应商" align="center" prop="equipmentSupplierName" width="120" />
      <el-table-column label="故障描述" align="center" prop="remark" width="150" />
      <el-table-column label="紧急程度" align="center" prop="repairDegreeText" width="100" />
      <el-table-column label="故障等级" align="center" prop="breakdownLevelText" width="100" />
      <el-table-column
        label="故障时间"
        align="center"
        prop="breakdownTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="故障来源" align="center" prop="sourceType" width="100">
        <template #default="{ row }">
          {{ eamEnumStore.getRepairWorkOrderSourceText(row.sourceType) }}
        </template>
      </el-table-column>
      <el-table-column label="停机时长" align="center" prop="shutdownDurationText" width="100" />
      <el-table-column label="确认人" align="center" prop="confirmPersonName" width="100" />
      <el-table-column label="报修工单号" align="center" prop="failureWorkOrderCode" width="160" />
      <el-table-column
        label="报修时间"
        align="center"
        prop="presentTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="报修人" align="center" prop="presentPersonName" width="100" />
      <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="170"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="280">
        <template #default="{ row }">
          <el-button
            v-if="row.status === '1'"
            link
            type="primary"
            @click="openForm('update', row)"
            v-hasPermi="['eam:repairWorkOrder:update']"
            >编辑</el-button
          >
          <el-button
            v-if="row.status === '1'"
            link
            type="primary"
            @click="handlePublish(row)"
            v-hasPermi="['eam:repairWorkOrder:publish']"
            >发布工单</el-button
          >
          <el-button
            link
            type="primary"
            @click="openDetail(row)"
            v-hasPermi="['eam:repairWorkOrder:query']"
            >查看</el-button
          >
          <el-button
            v-if="row.status === '2'"
            link
            type="primary"
            @click="handleAssign(row)"
            v-hasPermi="['eam:repairWorkOrder:assign']"
            >派工</el-button
          >
          <el-button
            v-if="row.status === '2' || row.status === '3'"
            link
            type="warning"
            @click="openRevokeDialog(row)"
            v-hasPermi="['eam:repairWorkOrder:revoke']"
            >撤单</el-button
          >
          <el-button
            v-if="['3', '4', '5'].includes(row.status)"
            link
            type="primary"
            @click="openReassignDialog(row)"
            v-hasPermi="['eam:repairWorkOrder:reassign']"
            >重新派工</el-button
          >
          <el-button
            v-if="row.status === '3'"
            link
            type="success"
            @click="handleRepairComplete(row)"
            >完工报工</el-button
          >
          <el-button
            v-if="row.status === '4'"
            link
            type="primary"
            @click="handleConfirmSatisfied(row)"
            >确认满意</el-button
          >
          <el-button
            v-if="row.status === '5'"
            link
            type="success"
            @click="handleConfirmComplete(row)"
            v-hasPermi="['eam:repairWorkOrder:confirm']"
            >完成工单</el-button
          >
          <el-button
            v-if="(row.status === '1' || row.status === '2') && row.sourceType === 'ks'"
            link
            type="danger"
            @click="handleDelete(row.id)"
            v-hasPermi="['eam:repairWorkOrder:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- ==================== 备件耗用子表 ==================== -->
  <ContentWrap>
    <div class="item-section-title">备件耗用</div>
    <div class="item-section-toolbar">
      <el-button plain type="primary" :disabled="!currentRepair" @click="openSparePartForm">
        <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增备件
      </el-button>
    </div>
    <el-table v-loading="sparePartLoading" :data="sparePartList" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="备件编号" align="center" prop="sparePartNumber" width="120" />
      <el-table-column label="备件名称" align="center" prop="sparePartName" min-width="150" />
      <el-table-column label="使用数量" align="center" prop="quantity" width="90" />
      <el-table-column label="领用人" align="center" prop="operatorName" width="100" />
      <el-table-column label="领用时间" align="center" prop="operateTime" width="160" />
      <el-table-column label="备注" align="center" prop="remark" min-width="150" />
      <el-table-column label="操作" align="center" fixed="right" width="80">
        <template #default="scope">
          <el-button link class="btn-delete" @click="handleSparePartDelete(scope.row)">&nbsp;删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 新增备件弹窗 -->
  <Dialog v-model="sparePartDialogVisible" title="新增备件耗用" width="500px">
    <el-form ref="sparePartFormRef" :model="sparePartFormData" label-width="100px">
      <el-form-item label="备件编号" prop="sparePartNumber" :rules="[{required:true,message:'必填'}]">
        <el-input v-model="sparePartFormData.sparePartNumber" placeholder="如：BJ-001" />
      </el-form-item>
      <el-form-item label="备件名称" prop="sparePartName" :rules="[{required:true,message:'必填'}]">
        <el-input v-model="sparePartFormData.sparePartName" placeholder="如：485通讯端子" />
      </el-form-item>
      <el-form-item label="使用数量" prop="quantity" :rules="[{required:true,message:'必填'}]">
        <el-input-number v-model="sparePartFormData.quantity" :min="1" :precision="0" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="sparePartFormData.remark" placeholder="领用说明" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="sparePartDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitSparePart">确定</el-button>
    </template>
  </Dialog>

  <!-- 创建/编辑表单弹窗 -->
  <RepairWorkOrderForm ref="formRef" @success="getList" />

  <!-- 详情弹窗 -->
  <RepairWorkOrderDetail ref="detailRef" />

  <!-- ==================== 撤单弹窗 ==================== -->
  <Dialog v-model="revokeDialogVisible" title="撤单" width="500px">
    <el-form ref="revokeFormRef" :model="revokeForm" label-width="100px">
      <el-form-item label="维修单号">
        <el-input v-model="revokeForm.repairCode" disabled />
      </el-form-item>
      <el-form-item label="撤单原因" prop="reason">
        <el-input
          v-model="revokeForm.reason"
          type="textarea"
          :rows="4"
          placeholder="请输入撤单原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="revokeDialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="revokeLoading" @click="submitRevoke">确 定</el-button>
    </template>
  </Dialog>

  <!-- ==================== 重新派工弹窗 ==================== -->
  <Dialog v-model="reassignDialogVisible" title="重新派工" width="500px">
    <el-form ref="reassignFormRef" :model="reassignForm" :rules="reassignRules" label-width="100px">
      <el-form-item label="维修单号">
        <el-input v-model="reassignForm.repairCode" disabled />
      </el-form-item>
      <el-form-item label="维修人员" prop="repairPersonName">
        <div class="selector-wrap">
          <el-input
            v-model="reassignForm.repairPersonName"
            readonly
            placeholder="请选择维修人员"
            class="selector-input"
          >
            <template #suffix>
              <el-icon
                v-if="reassignForm.repairPersonName"
                class="clear-icon"
                @click.stop="clearReassignPerson"
              >
                <CircleClose />
              </el-icon>
            </template>
          </el-input>
          <el-button type="primary" @click="openReassignPersonSelect">选择</el-button>
        </div>
      </el-form-item>
      <el-form-item label="原因" prop="reason">
        <el-input
          v-model="reassignForm.reason"
          type="textarea"
          :rows="4"
          placeholder="请输入重新派工原因"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="reassignDialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="reassignLoading" @click="submitReassign">确 定</el-button>
    </template>
  </Dialog>

  <!-- ==================== 人员选择弹窗（派工 + 重新派工共用） ==================== -->
  <PersonSelectDialog ref="personDialogRef" @confirm="handlePersonConfirm" />
</template>

<script lang="ts" setup>
import { CircleClose } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { dateFormatter } from '@/utils/formatTime'
import * as RepairWorkOrderApi from '@/api/eam/repairWorkOrder'
import { useEamEnumStore } from '@/store/modules/enums'
import RepairWorkOrderForm from './form.vue'
import RepairWorkOrderDetail from './detail.vue'
import PersonSelectDialog from '@/components/PersonSelectDialog/index.vue'
import { Dialog } from '@/components/Dialog'

defineOptions({ name: 'EamRepairWorkOrder' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

const loading = ref(true)
const list = ref<RepairWorkOrderApi.RepairWorkOrderVo[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  repairCode: undefined as string | undefined,
  failureWorkOrderCode: undefined as string | undefined,
  equipmentSn: undefined as string | undefined,
  equipmentName: undefined as string | undefined,
  equipmentMode: undefined as string | undefined,
  status: undefined as string | undefined
})
const queryFormRef = ref()
const createTimeRange = ref<[string, string] | undefined>()

/** 搜索下拉状态选项：排除"已完成"(status=6)，只显示前 5 项 */
const statusOptionsForSearch = computed(() => {
  return eamEnumStore.getRepairWorkOrderStatusList.filter((item) => item.value !== '6')
})

/** 创建时间 90 天限制 */
const disabledDate = (date: Date) => {
  if (!createTimeRange.value || createTimeRange.value.length === 0) return false
  const start = createTimeRange.value[0]
  if (!start) return false
  const startDate = new Date(start)
  const diff = Math.abs(date.getTime() - startDate.getTime())
  return diff > 90 * 24 * 60 * 60 * 1000
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params: RepairWorkOrderApi.RepairWorkOrderDto = {
      ...queryParams,
      createTime_begin: createTimeRange.value?.[0],
      createTime_end: createTimeRange.value?.[1]
    }
    // 默认排除"已完成"：status 未选择时传 1,2,3,4,5
    // if (!params.status) {
    //   params.status = '1,2,3,4,5'
    // }
    const res = await RepairWorkOrderApi.getRepairWorkOrderPage(params)
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  createTimeRange.value = undefined
  handleQuery()
}

// ==================== 创建/编辑 ====================

const formRef = ref()
const openForm = (type: string, row?: RepairWorkOrderApi.RepairWorkOrderVo) => {
  formRef.value.open(type, row)
}

// ==================== 详情 ====================

const detailRef = ref()
const openDetail = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  detailRef.value.open(row)
}

// ==================== 完工报工 + 发起人确认满意 ====================
import request from '@/config/axios'

const handleRepairComplete = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  try {
    const { value: record } = await ElMessageBox.prompt(
      `确认报工完工「${row.repairCode} ${row.equipmentName}」？\n报工后将进入"已完工，待发起人确认"状态。\n关联的物料领用清单将自动扣减备件库存。`,
      '完工报工',
      { confirmButtonText: '确认完工', cancelButtonText: '取消', inputType: 'textarea', inputPlaceholder: '请填写维修记录（可选）', inputValue: row.repairRecord || '' }
    )
    const res: any = await request.post({
      url: '/workOrder/eamRepairWorkOrder/complete',
      data: { repairCode: row.repairCode, id: row.id, repairRecord: record, repairEndTime: new Date().toISOString().replace('T', ' ').slice(0, 19) }
    })
    const consumed = res?.consumedSpareParts || []
    if (consumed.length) {
      const detail = consumed.map((c: any) => `${c.name} -${c.qty}${c.unit}（库存 ${c.before}→${c.after}）`).join('\n')
      ElMessageBox.alert(`完工成功！已扣减备件库存：\n${detail}\n\n已通知报修人进行确认。`, '完工成功', { confirmButtonText: '知道了' })
    } else {
      message.success('完工成功（本次维修未消耗备件），已通知报修人确认')
    }
    await getList()
  } catch {}
}

const handleConfirmSatisfied = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  try {
    await ElMessageBox.confirm(
      `作为报修人，确认「${row.repairCode} ${row.equipmentName}」的维修结果满意？\n\n维修人员：${row.repairPersonName}\n维修记录：${row.repairRecord || '-'}`,
      '发起人确认满意',
      { confirmButtonText: '确认满意（闭环）', cancelButtonText: '取消', type: 'success' }
    )
    await request.post({
      url: '/workOrder/eamRepairWorkOrder/confirmSatisfied',
      data: { repairCode: row.repairCode, id: row.id, confirmPersonName: row.presentPersonName }
    })
    message.success('已确认满意，工单闭环')
    await getList()
  } catch {}
}

// ==================== 发布工单 ====================

const handlePublish = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '1') {
    message.warning('维修工单状态不为[草稿]，无法发布')
    return
  }
  await message.confirm('是否确认发布该工单?', '确认')
  await RepairWorkOrderApi.publishOrder(row as any)
  message.success('发布成功')
  await getList()
}

// ==================== 派工 ====================

/** 当前操作类型：assign=派工, reassign=重新派工 */
const personSelectAction = ref<'assign' | 'reassign'>('assign')
const currentActionRow = ref<RepairWorkOrderApi.RepairWorkOrderVo>()
const personDialogRef = ref()

const handleAssign = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '2') {
    message.warning('维修工单状态不为[待分配]，无法派工')
    return
  }
  personSelectAction.value = 'assign'
  currentActionRow.value = row
  personDialogRef.value?.open()
}

const handlePersonConfirm = async (user: { id: number; nickname: string; username: string }) => {
  if (personSelectAction.value === 'assign' && currentActionRow.value) {
    // 派工
    await RepairWorkOrderApi.assignOrder({
      id: currentActionRow.value.id,
      repairPersonSn: String(user.id),
      repairPersonName: user.nickname
    })
    message.success('派工成功')
    await getList()
  } else if (personSelectAction.value === 'reassign') {
    // 重新派工 - 回填到重新派工表单
    reassignForm.repairPersonSn = String(user.id)
    reassignForm.repairPersonName = user.nickname
  }
}

// ==================== 撤单 ====================

const revokeDialogVisible = ref(false)
const revokeLoading = ref(false)
const revokeFormRef = ref()
const revokeForm = reactive({
  id: '' as string,
  repairCode: '',
  reason: ''
})

const openRevokeDialog = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '2' && row.status !== '3') {
    message.warning('维修工单状态不为[待分配]或[已分配]，无法撤单')
    return
  }
  revokeForm.id = row.id
  revokeForm.repairCode = row.repairCode
  revokeForm.reason = ''
  revokeDialogVisible.value = true
}

const submitRevoke = async () => {
  revokeLoading.value = true
  try {
    await RepairWorkOrderApi.revokeOrder({
      id: revokeForm.id,
      reason: revokeForm.reason
    })
    message.success('撤单成功')
    revokeDialogVisible.value = false
    await getList()
  } finally {
    revokeLoading.value = false
  }
}

// ==================== 重新派工 ====================

const reassignDialogVisible = ref(false)
const reassignLoading = ref(false)
const reassignFormRef = ref()
const reassignForm = reactive({
  id: '' as string,
  repairCode: '',
  repairPersonSn: '',
  repairPersonName: '',
  reason: ''
})
const reassignRules = {
  repairPersonName: [{ required: true, message: '请选择维修人员', trigger: 'change' }]
}

const openReassignDialog = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (!['3', '4', '5'].includes(row.status)) {
    message.warning('维修工单当前状态无法重新派工')
    return
  }
  reassignForm.id = row.id
  reassignForm.repairCode = row.repairCode
  reassignForm.repairPersonSn = ''
  reassignForm.repairPersonName = ''
  reassignForm.reason = ''
  reassignDialogVisible.value = true
}

const openReassignPersonSelect = () => {
  personSelectAction.value = 'reassign'
  personDialogRef.value?.open()
}

const clearReassignPerson = () => {
  reassignForm.repairPersonSn = ''
  reassignForm.repairPersonName = ''
}

const submitReassign = async () => {
  const valid = await reassignFormRef.value?.validate().catch(() => false)
  if (!valid) return
  reassignLoading.value = true
  try {
    await RepairWorkOrderApi.reassignOrder({
      id: reassignForm.id,
      repairPersonSn: reassignForm.repairPersonSn,
      repairPersonName: reassignForm.repairPersonName,
      reason: reassignForm.reason
    })
    message.success('重新派工成功')
    reassignDialogVisible.value = false
    await getList()
  } finally {
    reassignLoading.value = false
  }
}

// ==================== 完成工单 ====================

const handleConfirmComplete = async (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.status !== '5') {
    message.warning('维修工单状态不为[待确认]，无法操作')
    return
  }
  await message.confirm('是否确认完成该工单?', '确认')
  await RepairWorkOrderApi.confirmComplete({ id: row.id })
  message.success('操作成功')
  await getList()
}

// ==================== 删除 ====================

const handleDelete = async (id: string) => {
  await message.confirm('确认删除该数据？', '提示')
  await RepairWorkOrderApi.deleteRepairWorkOrder(id)
  message.success('删除成功')
  await getList()
}

// ==================== 备件耗用子表 ====================

const currentRepair = ref<RepairWorkOrderApi.RepairWorkOrderVo | null>(null)
const sparePartList = ref<any[]>([])
const sparePartLoading = ref(false)
const sparePartDialogVisible = ref(false)
const sparePartFormRef = ref()
const sparePartFormData = reactive({
  sparePartNumber: '',
  sparePartName: '',
  quantity: 1,
  remark: ''
})

const getRepairRowClassName = ({ row }: { row: RepairWorkOrderApi.RepairWorkOrderVo }) => {
  return currentRepair.value?.id === row.id ? 'row-selected' : ''
}

const handleRepairRowDblClick = (row: RepairWorkOrderApi.RepairWorkOrderVo) => {
  if (row.id === currentRepair.value?.id) return
  currentRepair.value = row
  getSparePartList()
}

const getSparePartList = async () => {
  if (!currentRepair.value) return
  sparePartLoading.value = true
  try {
    const res = await RepairWorkOrderApi.getRepairWorkOrderSparePartList(currentRepair.value.repairCode)
    sparePartList.value = res ?? []
  } finally {
    sparePartLoading.value = false
  }
}

const openSparePartForm = () => {
  sparePartFormData.sparePartNumber = ''
  sparePartFormData.sparePartName = ''
  sparePartFormData.quantity = 1
  sparePartFormData.remark = ''
  sparePartDialogVisible.value = true
}

const submitSparePart = async () => {
  const valid = await sparePartFormRef.value?.validate().catch(() => false)
  if (!valid) return
  if (!currentRepair.value) return
  await RepairWorkOrderApi.addRepairWorkOrderSparePart({
    repairCode: currentRepair.value.repairCode,
    ...sparePartFormData
  })
  message.success('新增成功')
  sparePartDialogVisible.value = false
  await getSparePartList()
}

const handleSparePartDelete = async (row: any) => {
  await ElMessageBox.confirm('确认删除该备件记录？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await RepairWorkOrderApi.deleteRepairWorkOrderSparePart(row.id)
  message.success('删除成功')
  await getSparePartList()
}

// ==================== 初始化 ====================

onMounted(async () => {
  await Promise.all([
    eamEnumStore.loadRepairWorkOrderStatus(),
    eamEnumStore.loadRepairWorkOrderSource()
  ])
  await getList()
})
</script>

<style lang="scss" scoped>
.item-section-title {
  margin-bottom: 12px;
  font-size: 15px;
  font-weight: bold;
  color: #303133;
}

.item-section-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

// 选中行高亮
:deep(.el-table .row-selected) {
  --el-table-tr-bg-color: #e6f0fa !important;

  td.el-table__cell {
    background-color: #e6f0fa !important;
  }
}

// 删除按钮样式
:deep(.el-button.btn-delete) {
  color: var(--el-color-danger);

  &:hover {
    color: rgb(245 108 108 / 75%);
  }
}

.selector-wrap {
  display: flex;
  gap: 8px;
  width: 100%;
}

.selector-input {
  flex: 1;
}

.clear-icon {
  cursor: pointer;

  &:hover {
    color: var(--el-color-danger);
  }
}
</style>
