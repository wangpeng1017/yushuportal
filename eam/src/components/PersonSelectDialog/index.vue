<template>
  <Dialog v-model="dialogVisible" title="选择人员" width="900px">
    <div class="person-select-container">
      <!-- 左侧：部门树 -->
      <div class="dept-tree">
        <el-input v-model="deptName" class="mb-10px" clearable placeholder="请输入部门名称">
          <template #prefix>
            <Icon icon="ep:search" />
          </template>
        </el-input>
        <el-tree
          ref="treeRef"
          :data="deptList"
          :expand-on-click-node="false"
          :filter-node-method="filterNode"
          :props="defaultProps"
          default-expand-all
          highlight-current
          node-key="id"
          @node-click="handleNodeClick"
        />
      </div>
      <!-- 右侧：用户列表 -->
      <div class="user-list">
        <el-form :model="queryParams" :inline="true" class="mb-10px">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="queryParams.username"
              placeholder="请输入用户名"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input
              v-model="queryParams.nickname"
              placeholder="请输入昵称"
              clearable
              @keyup.enter="handleSearch"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table
          :data="userList"
          :loading="loading"
          highlight-current-row
          @current-change="handleCurrentChange"
          style="width: 100%"
          height="400"
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column prop="username" label="用户名" width="120" align="center" />
          <el-table-column prop="nickname" label="昵称" min-width="120" align="center" />
          <el-table-column prop="deptName" label="部门" width="150" align="center">
            <template #default="{ row }">
              {{ row.dept?.name || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="mobile" label="手机号" width="130" align="center" />
        </el-table>
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="!selectedUser" @click="handleConfirm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElTree } from 'element-plus'
import * as DeptApi from '@/api/system/dept'
import * as UserApi from '@/api/system/user'
import { defaultProps, handleTree } from '@/utils/tree'

defineOptions({ name: 'PersonSelectDialog' })

const emit = defineEmits<{
  (e: 'confirm', user: { id: number; nickname: string; username: string }): void
}>()

const dialogVisible = ref(false)
const loading = ref(false)
const deptName = ref('')
const deptList = ref<any[]>([])
const treeRef = ref<InstanceType<typeof ElTree>>()

const userList = ref<any[]>([])
const total = ref(0)
const selectedUser = ref<any>(null)

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  username: '',
  nickname: '',
  deptId: undefined as number | undefined
})

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  selectedUser.value = null
  queryParams.pageNo = 1
  queryParams.username = ''
  queryParams.nickname = ''
  queryParams.deptId = undefined
  getTree()
  getList()
}

/** 获取部门树 */
const getTree = async () => {
  const res = await DeptApi.getSimpleDeptList()
  deptList.value = handleTree(res)
}

/** 获取用户列表 */
const getList = async () => {
  loading.value = true
  try {
    const res = await UserApi.getUserPage(queryParams as any)
    userList.value = res.list || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleSearch = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置 */
const handleReset = () => {
  queryParams.username = ''
  queryParams.nickname = ''
  queryParams.pageNo = 1
  getList()
}

/** 部门树节点过滤 */
const filterNode = (name: string, data: any) => {
  if (!name) return true
  return data.name.includes(name)
}

/** 部门树节点点击 */
const handleNodeClick = (row: any) => {
  queryParams.deptId = row.id
  queryParams.pageNo = 1
  getList()
}

/** 用户列表行选中 */
const handleCurrentChange = (row: any) => {
  selectedUser.value = row
}

/** 确认选择 */
const handleConfirm = () => {
  if (!selectedUser.value) return
  emit('confirm', {
    id: selectedUser.value.id,
    nickname: selectedUser.value.nickname,
    username: selectedUser.value.username
  })
  dialogVisible.value = false
}

/** 监听部门名称搜索 */
watch(deptName, (val) => {
  treeRef.value?.filter(val)
})

defineExpose({ open })
</script>

<style lang="scss" scoped>
.person-select-container {
  display: flex;

  .dept-tree {
    width: 240px;
    max-height: 500px;
    padding-right: 15px;
    overflow-y: auto;
    border-right: 1px solid var(--el-border-color);
  }

  .user-list {
    flex: 1;
    padding-left: 15px;
  }
}
</style>
