<template>
  <Dialog v-model="dialogVisible" :title="`菜单权限，角色名称：${formData.name}，角色标识：${formData.code}`" width="900px">
    <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="100px">
      <el-form-item label="应用选择">
        <el-tabs v-model="activeAppId" type="card" class="w-full" @tab-click="handleAppChange">
          <el-tab-pane
            v-for="app in appList"
            :key="app.id"
            :label="app.name"
            :name="String(app.id)"
          >
            <el-card class="w-full h-450px !overflow-y-scroll" shadow="never">
              <template #header>
                <div class="flex items-center justify-between">
                  <!-- <div>
                    全选/全不选:
                    <el-switch
                      v-model="treeNodeAll"
                      active-text="是"
                      inactive-text="否"
                      inline-prompt
                      :disabled="!menuOptions || menuOptions.length === 0"
                      @change="handleCheckedTreeNodeAll"
                    />
                    全部展开/折叠:
                    <el-switch
                      v-model="menuExpand"
                      active-text="展开"
                      inactive-text="折叠"
                      inline-prompt
                      :disabled="!menuOptions || menuOptions.length === 0"
                      @change="handleCheckedTreeExpand"
                    />
                  </div> -->
                  <div class="ml-auto">
                    <el-button
                      :disabled="formLoading || !menuOptions || menuOptions.length === 0"
                      type="primary"
                      size="small"
                      @click="saveCurrentApp"
                    >
                      保存当前应用权限
                    </el-button>
                  </div>
                </div>
              </template>
              <el-tree
                :ref="(el) => { treeRef = el }"
                :data="menuOptions"
                :props="defaultProps"
                :default-checked-keys="defaultCheckedKeys"
                empty-text="该应用暂无分配菜单"
                node-key="id"
                show-checkbox
                @check="handleTreeCheck"
              />
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { defaultProps, handleTree } from '@/utils/tree'
import * as RoleApi from '@/api/system/role'
import * as MenuApi from '@/api/system/menu'
import * as PermissionApi from '@/api/system/permission'
import * as AppApi from '@/api/system/app'

defineOptions({ name: 'SystemRoleAssignMenuForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = reactive({
  id: undefined as number | undefined,
  name: '',
  code: '',
  menuIds: []
})
const formRef = ref() // 表单 Ref
const menuOptions = ref<any[]>([]) // 菜单树形结构
const menuExpand = ref(false) // 展开/折叠
let treeRef: any = null // 菜单树组件实例
const treeNodeAll = ref(false) // 全选/全不选
const appList = ref<any[]>([]) // 应用列表
const activeAppId = ref<string>('') // 当前激活的应用ID
const defaultCheckedKeys = ref<number[]>([]) // 默认选中的节点（用于回显）
const currentCheckedKeys = ref<number[]>([]) // 当前选中的节点（实时更新）

/** 打开弹窗 */
const open = async (row: RoleApi.RoleVO) => {
  dialogVisible.value = true
  resetForm()
  // 设置数据
  formData.id = row.id
  formData.name = row.name
  formData.code = row.code
  
  formLoading.value = true
  try {
    // 加载应用列表
    const apps = await AppApi.getAppList({
      status: 0,
      deleted: false,
    } as any)
    appList.value = apps || []
    
    // 默认选中第一个应用
    if (appList.value.length > 0) {
      activeAppId.value = String(appList.value[0].id)
      // 加载第一个应用的菜单和权限
      await loadAppMenus(appList.value[0].id)
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 加载指定应用的菜单和权限 */
const loadAppMenus = async (appId: number) => {
  if (!formData.id) return
  
  formLoading.value = true
  try {
    // 加载 Menu 列表
    const menus = await MenuApi.getAppMenusList(appId)
    menuOptions.value = handleTree(menus)
    
    // 如果没有菜单，直接返回
    if (!menuOptions.value || menuOptions.value.length === 0) {
      defaultCheckedKeys.value = []
      return
    }
    
    // 加载角色在该应用下已分配的菜单权限
    const menuIds = await PermissionApi.getRoleAppMenuList(formData.id, appId) // 根据角色ID和应用ID获取菜单关联列表
  
    // 设置 default-checked-keys 用于回显
    defaultCheckedKeys.value = menuIds || []
    // 同时初始化当前选中的节点
    currentCheckedKeys.value = menuIds || []
  } finally {
    formLoading.value = false
  }
}

/** 处理树节点选中状态变化 */
const handleTreeCheck = (data: any, checked: any) => {
  // 使用事件回调中的 checked 对象，这才是实时的值
  currentCheckedKeys.value = [
    ...(checked.checkedKeys as Array<number>),
    ...(checked.halfCheckedKeys as Array<number>)
  ]
}

/** 处理应用切换 */
const handleAppChange = async (pane: any) => {
  const appId = pane.paneName || pane.props?.name
  if (appId) {
    await loadAppMenus(Number(appId))
  }
}

/** 保存当前应用的权限 */
const saveCurrentApp = async () => {
  if (!activeAppId.value) {
    message.warning('请选择应用')
    return
  }
  
  if (!formData.id) {
    message.warning('角色ID不存在')
    return
  }
  
  formLoading.value = true
  try {
    // 使用 currentCheckedKeys 获取实时的选中状态
    const data = {
      roleId: formData.id,
      appId: Number(activeAppId.value),
      menuIds: currentCheckedKeys.value
    }
    
    if (data.menuIds.length === 0) {
      message.warning('请至少选择一个菜单')
      return
    }
    
    await PermissionApi.assignRoleAppMenu(data)
    message.success('保存成功')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  // 重置选项
  treeNodeAll.value = false
  menuExpand.value = false
  // 重置表单
  formData.id = undefined
  formData.name = ''
  formData.code = ''
  formData.menuIds = []
  // 安全地重置树组件
  if (treeRef && typeof treeRef.setCheckedNodes === 'function') {
    treeRef.setCheckedNodes([])
  }
  formRef.value?.resetFields()
}

/** 全选/全不选 */
const handleCheckedTreeNodeAll = () => {
  if (!treeRef || typeof treeRef.setCheckedNodes !== 'function') return
  treeRef.setCheckedNodes(treeNodeAll.value ? menuOptions.value : [])
}

/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef?.store?.nodesMap
  if (!nodes) return
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
  }
}
</script>