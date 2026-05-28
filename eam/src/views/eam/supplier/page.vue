<template>
  <QueryForm :model="queryParams" :cols="3" @search="handleQuery" @reset="resetQuery">
    <QueryItem label="供应商编号">
      <el-input v-model="queryParams.supplierSn" clearable maxlength="15" placeholder="请输入供应商编号" />
    </QueryItem>
    <QueryItem label="供应商名称">
      <el-input v-model="queryParams.supplierName" clearable maxlength="60" placeholder="请输入供应商名称" />
    </QueryItem>
    <QueryItem label="建档日期">
      <el-date-picker
        v-model="queryParams.createTime"
        type="daterange"
        value-format="YYYY-MM-DD"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 100%"
      />
    </QueryItem>
  </QueryForm>

  <ListPage :loading="loading" :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" @pagination="getList">
    <template #actions>
      <el-button v-hasPermi="[PERMI.CREATE]" type="primary" @click="openForm('create')">
        <Icon class="mr-5px" icon="ep:plus" />新增
      </el-button>
    </template>

    <el-table :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="供应商编号" align="center" prop="supplierSn" width="120" />
      <el-table-column label="供应商名称" align="center" prop="supplierName" min-width="200" />
      <el-table-column label="供应商类别" align="center" prop="supplierCategory" width="120">
        <template #default="scope">
          {{ eamEnumStore.getSupplierCategoryText(scope.row.supplierCategory) }}
        </template>
      </el-table-column>
      <el-table-column label="营业执照编号" align="center" prop="supplierCert" width="200" />
      <el-table-column
        label="建档日期"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="供应设备类别" align="center" prop="supplierGoods" width="120">
        <template #default="scope">
          {{ eamEnumStore.getSupplierGoodsText(scope.row.supplierGoods) }}
        </template>
      </el-table-column>
      <el-table-column label="联系人" align="center" prop="contacts" width="110" />
      <el-table-column label="联系电话" align="center" prop="contactsPhone" width="120" />
      <el-table-column label="供应商状态" align="center" prop="supplierStatus" width="100">
        <template #default="scope">
          <el-switch
            v-model="scope.row.supplierStatus"
            active-value="1"
            inactive-value="0"
            active-text="启用"
            inactive-text="停用"
            inline-prompt
            @change="handleStatusChange(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <RowActions
            :row="scope.row"
            :on-detail="checkPermi([PERMI.QUERY]) ? (r: any) => openDetail(r.id) : null"
            :on-edit="checkPermi([PERMI.UPDATE]) ? (r: any) => openForm('update', r.id) : null"
            :on-delete="checkPermi([PERMI.DELETE]) ? (r: any) => handleDelete(r.id) : null"
          />
        </template>
      </el-table-column>
    </el-table>
  </ListPage>

  <!-- 新增/编辑弹窗 -->
  <SupplierForm ref="formRef" @success="getList" />
  <!-- 详情弹窗 -->
  <SupplierDetail ref="detailRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { checkPermi } from '@/utils/permission'
import * as SupplierApi from '@/api/eam/supplier'
import { useEamEnumStore } from '@/store/modules/enums'
import SupplierForm from './form.vue'
import SupplierDetail from './detail.vue'

defineOptions({ name: 'EamSupplier' })

const message = useMessage()
const { t } = useI18n()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识集中定义 ====================
const PERMI = {
  CREATE: 'eam:supplier:create',
  UPDATE: 'eam:supplier:update',
  DELETE: 'eam:supplier:delete',
  QUERY: 'eam:supplier:query',
  EXPORT: 'eam:supplier:export'
}

// ==================== 列表相关 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<SupplierApi.OptSupplierVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  supplierSn: undefined as string | undefined,
  supplierName: undefined as string | undefined,
  createTime: undefined as string[] | undefined
})

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // 拆分日期范围为 startTime / endTime
    const params: any = {
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      supplierSn: queryParams.supplierSn,
      supplierName: queryParams.supplierName
    }
    if (queryParams.createTime && queryParams.createTime.length === 2) {
      params.startTime = queryParams.createTime[0]
      params.endTime = queryParams.createTime[1]
    }
    const res = await SupplierApi.getSupplierPage(params)
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
  queryParams.supplierSn = undefined
  queryParams.supplierName = undefined
  queryParams.createTime = undefined
  handleQuery()
}

// ==================== 新增/编辑 ====================
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

// ==================== 详情 ====================
const detailRef = ref()
const openDetail = (id: string) => {
  detailRef.value.open(id)
}

// ==================== 删除 ====================
const handleDelete = async (id: string) => {
  try {
    await SupplierApi.deleteSupplier(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

// ==================== 启停用切换 ====================
const handleStatusChange = async (row: SupplierApi.OptSupplierVo) => {
  try {
    await SupplierApi.toggleSupplierStatus(row.id!)
    message.success('修改成功')
  } catch {
    // 切换失败时恢复状态
    row.supplierStatus = row.supplierStatus === '1' ? '0' : '1'
  }
}

// ==================== 初始化 ====================
onMounted(async () => {
  // 加载枚举数据
  await eamEnumStore.loadSupplierEnums()
  // 加载列表数据
  await getList()
})
</script>
