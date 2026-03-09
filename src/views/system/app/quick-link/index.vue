<template>
  <doc-alert title="应用快捷链接管理" url="https://iimake.com/app/quick-link/" />

  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <el-form-item label="快捷名称" prop="linkName">
        <el-input
          v-model="queryParams.linkName"
          placeholder="请输入快捷名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="应用编码" prop="appCode">
        <el-input
          v-model="queryParams.appCode"
          placeholder="请输入应用编码"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="路由地址" prop="linkRouter">
        <el-input
          v-model="queryParams.linkRouter"
          placeholder="请输入路由地址"
          clearable
          @keyup.enter="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="内部/外部" prop="internal">
        <el-select
          v-model="queryParams.internal"
          placeholder="请选择内部/外部"
          clearable
          class="!w-200px"
        >
          <el-option label="内部" :value="true" />
          <el-option label="外部" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-form>
      <el-form-item>
        <el-button
          plain
          type="primary"
          @click="openForm('create')"
          v-hasPermi="['system:app-quick-link:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          plain
          type="danger"
          :disabled="checkedIds.length === 0"
          @click="handleDeleteBatch"
          v-hasPermi="['system:app-quick-link:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="应用名称" width="120" align="center" prop="appId">
        <template #default="scope">
          {{ getAppNameById(scope.row.appId) }}
        </template>
      </el-table-column>
      <el-table-column label="应用编码" width="120" align="center" prop="appCode" />
      <el-table-column label="快捷名称" width="120" align="center" prop="linkName" />
      <el-table-column label="路由地址" width="150" align="center" prop="linkRouter" />
      <el-table-column label="快捷图标" width="120" align="center" prop="linkIcon">
        <template #default="scope">
          <Icon v-if="scope.row.linkIcon" :icon="scope.row.linkIcon" width="20px" height="20px" />
          <span v-else>无图标</span>
        </template>
      </el-table-column>
      <el-table-column label="内部/外部" width="100" align="center" prop="internal">
        <template #default="scope">
          <el-tag v-if="scope.row.internal" type="success">内部</el-tag>
          <el-tag v-else type="info">外部</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" width="160" fixed="right">
        <template #default="scope">
          <el-button
            link
            class="btn-edit"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['system:app-quick-link:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            class="btn-delete"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['system:app-quick-link:delete']"
          >
            删除
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <QuickLinkForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as QuickLinkApi from '@/api/system/app/quickLink'
import * as AppApi from '@/api/system/app'
import QuickLinkForm from './form.vue'
defineOptions({ name: 'SystemAppQuickLink' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const appMap = ref<Record<number, string>>({}) // 应用映射表
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  linkName: null,
  appCode: null,
  linkRouter: null,
  internal: null
})
const queryFormRef = ref() // 搜索的表单

/** 查询应用列表并建立映射 */
const loadAppMap = async () => {
  try {
    const response = await AppApi.getAppList({})
    const apps = response || []
    appMap.value = {}
    apps.forEach((app: any) => {
      appMap.value[app.id] = app.name
    })
  } catch (error) {
    console.error('加载应用列表失败:', error)
    appMap.value = {}
  }
}

/** 根据应用ID获取应用名称 */
const getAppNameById = (appId: number) => {
  return appMap.value[appId] || '-'
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await QuickLinkApi.getAppQuickLinkPage(queryParams)
    list.value = data.list
    total.value = data.total
    // 加载应用映射
    await loadAppMap()
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await QuickLinkApi.deleteAppQuickLink(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: QuickLinkApi.AppQuickLinkVO[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起批量删除
    await QuickLinkApi.deleteAppQuickLinkList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
/* 操作栏按钮样式 */
:deep(.el-button.btn-edit) {
  color: #0097BA;
  &:hover {
    color: rgba(0, 151, 186, 0.75);
  }
}

:deep(.el-button.btn-delete) {
  color: #D54941;
  &:hover {
    color: rgba(213, 73, 65, 0.75);
  }
}
</style>