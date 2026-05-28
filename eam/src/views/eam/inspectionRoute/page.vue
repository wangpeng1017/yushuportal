<template>
  <div class="inspection-route-page">
    <!-- ==================== 搜索区 ==================== -->
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="90px"
      >
        <el-form-item label="路线编号" prop="routeCode">
          <el-input
            v-model="queryParams.routeCode"
            class="!w-200px"
            clearable
            placeholder="请输入路线编号"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="路线名称" prop="routeName">
          <el-input
            v-model="queryParams.routeName"
            class="!w-200px"
            clearable
            placeholder="请输入路线名称"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属区域" prop="areaName">
          <el-input
            v-model="queryParams.areaName"
            class="!w-200px"
            clearable
            placeholder="请输入所属区域"
            @keyup.enter="handleQuery"
          />
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
        <el-button v-hasPermi="[PERMI.CREATE]" plain type="primary" @click="openRouteDialog('create')">
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
        </el-button>
      </div>

      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        :show-overflow-tooltip="true"
        :row-class-name="getRowClassName"
        @selection-change="handleSelectionChange"
        @row-dblclick="handleRowDblClick"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="路线编号" align="center" prop="routeCode" width="140" />
        <el-table-column label="路线名称" align="center" prop="routeName" min-width="200" />
        <el-table-column label="所属区域" align="center" prop="areaName" width="160" />
        <el-table-column label="巡检点数量" align="center" prop="pointCount" width="100" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button
              link
              class="btn-other"
              v-hasPermi="[PERMI.QUERY]"
              @click="openRouteDialog('view', scope.row)"
            >
              &nbsp;查看
            </el-button>
            <el-button
              link
              class="btn-edit"
              v-hasPermi="[PERMI.UPDATE]"
              @click="openRouteDialog('edit', scope.row)"
            >
              &nbsp;编辑
            </el-button>
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handleDelete(scope.row)"
            >
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

    <!-- ==================== 子表：巡检点位清单 ==================== -->
    <ContentWrap>
      <div class="item-section-title">
        巡检点位清单
        <span v-if="currentRouteCode" class="item-section-subtitle">（{{ currentRouteName }}）</span>
      </div>
      <div class="item-section-toolbar">
        <el-button
          v-hasPermi="[PERMI.CREATE]"
          plain
          type="primary"
          :disabled="!currentRouteCode"
          @click="openPointDialog('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" />&nbsp;新增点位
        </el-button>
        <el-button
          v-hasPermi="[PERMI.DELETE]"
          plain
          type="danger"
          :disabled="pointSelectedIds.length === 0"
          @click="handlePointBatchDelete"
        >
          <Icon icon="ep:delete" class="mr-5px" />&nbsp;批量删除
        </el-button>
      </div>

      <el-table
        v-loading="pointLoading"
        :data="pointList"
        :stripe="true"
        :show-overflow-tooltip="true"
        @selection-change="handlePointSelectionChange"
      >
        <el-table-column type="selection" width="50" align="center" />
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="点位名称" align="center" prop="pointName" width="160" />
        <el-table-column label="位置描述" align="center" prop="pointLocation" min-width="200" />
        <el-table-column label="检查要求" align="center" prop="checkRequirement" min-width="200" />
        <el-table-column label="排序" align="center" prop="sort" width="70" />
        <el-table-column label="创建人" align="center" prop="createByPersonName" width="100" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="160" />
        <el-table-column label="操作" align="center" fixed="right" width="100">
          <template #default="scope">
            <el-button
              link
              class="btn-delete"
              v-hasPermi="[PERMI.DELETE]"
              @click="handlePointDelete(scope.row)"
            >
              &nbsp;删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <Pagination
        :total="pointTotal"
        v-model:page="pointQueryParams.pageNo"
        v-model:limit="pointQueryParams.pageSize"
        @pagination="getPointList"
      />
    </ContentWrap>

    <!-- ==================== 路线新增/编辑弹窗 ==================== -->
    <el-dialog
      v-model="routeDialogVisible"
      :title="routeDialogTitle"
      width="560px"
      :close-on-click-modal="false"
      @closed="resetRouteForm"
    >
      <el-form
        ref="routeFormRef"
        :model="routeForm"
        :rules="routeRules"
        label-width="90px"
        :disabled="routeDialogMode === 'view'"
      >
        <el-form-item label="路线编号" prop="routeCode">
          <el-input v-model="routeForm.routeCode" placeholder="请输入路线编号" :disabled="routeDialogMode === 'edit'" />
        </el-form-item>
        <el-form-item label="路线名称" prop="routeName">
          <el-input v-model="routeForm.routeName" placeholder="请输入路线名称" />
        </el-form-item>
        <el-form-item label="所属区域" prop="areaName">
          <el-input v-model="routeForm.areaName" placeholder="请输入所属区域" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="routeForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="routeDialogVisible = false">取消</el-button>
        <el-button v-if="routeDialogMode !== 'view'" type="primary" @click="submitRouteForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- ==================== 点位新增弹窗 ==================== -->
    <el-dialog
      v-model="pointDialogVisible"
      title="新增巡检点位"
      width="520px"
      :close-on-click-modal="false"
      @closed="resetPointForm"
    >
      <el-form
        ref="pointFormRef"
        :model="pointForm"
        :rules="pointRules"
        label-width="90px"
      >
        <el-form-item label="点位名称" prop="pointName">
          <el-input v-model="pointForm.pointName" placeholder="请输入点位名称" />
        </el-form-item>
        <el-form-item label="位置描述" prop="pointLocation">
          <el-input v-model="pointForm.pointLocation" placeholder="请输入位置描述" />
        </el-form-item>
        <el-form-item label="检查要求" prop="checkRequirement">
          <el-input v-model="pointForm.checkRequirement" type="textarea" :rows="3" placeholder="请输入检查要求" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="pointForm.sort" :min="1" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="pointDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPointForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import * as RouteApi from '@/api/eam/inspectionRoute'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'EamInspectionRoute' })

const message = useMessage()
const eamEnumStore = useEamEnumStore()

// ==================== 权限标识 ====================
const PERMI = {
  QUERY: 'eam:inspectionRoute:query',
  CREATE: 'eam:inspectionRoute:create',
  UPDATE: 'eam:inspectionRoute:update',
  DELETE: 'eam:inspectionRoute:delete'
}

// ==================== 主表列表 ====================
const loading = ref(true)
const total = ref(0)
const list = ref<RouteApi.InspectionRouteVo[]>([])
const queryParams = reactive({
  pageNo: 1,
  pageSize: 5,
  routeCode: undefined as string | undefined,
  routeName: undefined as string | undefined,
  areaName: undefined as string | undefined
})
const queryFormRef = ref()
const selectedIds = ref<string[]>([])
const currentRouteCode = ref('')
const currentRouteName = ref('')

const getList = async () => {
  loading.value = true
  try {
    const res = await RouteApi.getRoutePage({
      pageNo: queryParams.pageNo,
      pageSize: queryParams.pageSize,
      routeCode: queryParams.routeCode,
      routeName: queryParams.routeName,
      areaName: queryParams.areaName
    })
    list.value = res.records ?? []
    total.value = res.total ?? 0
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  clearPointSection()
  getList()
}

const resetQuery = () => {
  queryFormRef.value?.resetFields()
  clearPointSection()
  handleQuery()
}

const handleSelectionChange = (rows: RouteApi.InspectionRouteVo[]) => {
  selectedIds.value = rows.map((r) => r.id!)
}

const getRowClassName = ({ row }: { row: RouteApi.InspectionRouteVo }) => {
  return currentRouteCode.value === row.routeCode ? 'row-selected' : ''
}

// ==================== 双击主表行加载子表 ====================
const handleRowDblClick = (row: RouteApi.InspectionRouteVo) => {
  if (row.routeCode === currentRouteCode.value) return
  currentRouteCode.value = row.routeCode!
  currentRouteName.value = row.routeName!
  pointSelectedIds.value = []
  pointQueryParams.pageNo = 1
  getPointList()
}

// ==================== 路线弹窗 CRUD ====================
const routeDialogVisible = ref(false)
const routeDialogMode = ref<'create' | 'edit' | 'view'>('create')
const routeDialogTitle = computed(() => {
  const map = { create: '新增巡检路线', edit: '编辑巡检路线', view: '查看巡检路线' }
  return map[routeDialogMode.value]
})
const routeFormRef = ref()
const routeForm = reactive<RouteApi.InspectionRouteVo>({
  routeCode: '',
  routeName: '',
  areaName: '',
  remark: ''
})
const routeRules = {
  routeCode: [{ required: true, message: '请输入路线编号', trigger: 'blur' }],
  routeName: [{ required: true, message: '请输入路线名称', trigger: 'blur' }],
  areaName: [{ required: true, message: '请输入所属区域', trigger: 'blur' }]
}

const openRouteDialog = (mode: 'create' | 'edit' | 'view', row?: RouteApi.InspectionRouteVo) => {
  routeDialogMode.value = mode
  routeDialogVisible.value = true
  if (row) {
    Object.assign(routeForm, row)
  }
}

const resetRouteForm = () => {
  routeFormRef.value?.resetFields()
  Object.assign(routeForm, { id: undefined, routeCode: '', routeName: '', areaName: '', remark: '' })
}

const submitRouteForm = async () => {
  await routeFormRef.value?.validate()
  try {
    if (routeDialogMode.value === 'create') {
      await RouteApi.createRoute(routeForm)
      message.success('新增成功')
    } else {
      await RouteApi.updateRoute(routeForm)
      message.success('修改成功')
    }
    routeDialogVisible.value = false
    getList()
  } catch {
    // 接口异常
  }
}

const handleDelete = async (row: RouteApi.InspectionRouteVo) => {
  try {
    await message.delConfirm()
    await RouteApi.deleteRoute(row.id!)
    message.success('删除成功')
    if (row.routeCode === currentRouteCode.value) clearPointSection()
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

const handleBatchDelete = async () => {
  try {
    await message.delConfirm()
    for (const id of selectedIds.value) {
      await RouteApi.deleteRoute(id)
    }
    message.success('批量删除成功')
    clearPointSection()
    selectedIds.value = []
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 子表：巡检点位 ====================
const pointLoading = ref(false)
const pointTotal = ref(0)
const pointList = ref<RouteApi.RoutePointVo[]>([])
const pointQueryParams = reactive({ pageNo: 1, pageSize: 5 })
const pointSelectedIds = ref<string[]>([])

const getPointList = async () => {
  if (!currentRouteCode.value) return
  pointLoading.value = true
  try {
    const res = await RouteApi.getPointPage({
      pageNo: pointQueryParams.pageNo,
      pageSize: pointQueryParams.pageSize,
      routeCode: currentRouteCode.value,
      column: 'sort',
      order: 'asc'
    })
    pointList.value = res.records ?? []
    pointTotal.value = res.total ?? 0
  } finally {
    pointLoading.value = false
  }
}

const handlePointSelectionChange = (rows: RouteApi.RoutePointVo[]) => {
  pointSelectedIds.value = rows.map((r) => r.id!)
}

const clearPointSection = () => {
  currentRouteCode.value = ''
  currentRouteName.value = ''
  pointList.value = []
  pointTotal.value = 0
  pointSelectedIds.value = []
  pointQueryParams.pageNo = 1
}

// ==================== 点位弹窗 ====================
const pointDialogVisible = ref(false)
const pointFormRef = ref()
const pointForm = reactive<RouteApi.RoutePointVo>({
  pointName: '',
  pointLocation: '',
  checkRequirement: '',
  sort: 1
})
const pointRules = {
  pointName: [{ required: true, message: '请输入点位名称', trigger: 'blur' }],
  pointLocation: [{ required: true, message: '请输入位置描述', trigger: 'blur' }]
}

const openPointDialog = (mode: 'create') => {
  pointDialogVisible.value = true
}

const resetPointForm = () => {
  pointFormRef.value?.resetFields()
  Object.assign(pointForm, { id: undefined, pointName: '', pointLocation: '', checkRequirement: '', sort: 1 })
}

const submitPointForm = async () => {
  await pointFormRef.value?.validate()
  try {
    await RouteApi.createPoint({ ...pointForm, routeCode: currentRouteCode.value })
    message.success('新增成功')
    pointDialogVisible.value = false
    getPointList()
    getList()
  } catch {
    // 接口异常
  }
}

const handlePointDelete = async (row: RouteApi.RoutePointVo) => {
  try {
    await message.delConfirm()
    await RouteApi.deletePoint(row.id!)
    message.success('删除成功')
    pointSelectedIds.value = []
    getPointList()
    getList()
  } catch {
    // 用户取消
  }
}

const handlePointBatchDelete = async () => {
  try {
    await message.delConfirm()
    for (const id of pointSelectedIds.value) {
      await RouteApi.deletePoint(id)
    }
    message.success('批量删除成功')
    pointSelectedIds.value = []
    getPointList()
    getList()
  } catch {
    // 用户取消
  }
}

// ==================== 初始化 ====================
onMounted(async () => {
  await eamEnumStore.loadSpotInspectionEnums()
  await getList()
})
</script>

<style lang="scss" scoped>
.inspection-route-page {
  height: 100%;
}

.table-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.item-section-title {
  font-size: 15px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 12px;
}

.item-section-subtitle {
  font-size: 13px;
  font-weight: normal;
  color: #909399;
  margin-left: 8px;
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

:deep(.el-button.btn-edit) {
  color: #0097ba;

  &:hover {
    color: rgb(0 151 186 / 75%);
  }
}

:deep(.el-button.btn-delete) {
  color: #d54941;

  &:hover {
    color: rgb(213 73 65 / 75%);
  }
}

:deep(.el-button.btn-other) {
  color: #a5d867;

  &:hover {
    color: rgb(165 216 103 / 75%);
  }
}
</style>
