<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="500px" scroll>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="内部/外部" prop="internal">
        <el-switch
          v-model="formData.internal"
          :disabled="formType === 'update'"
          active-text="内部"
          inactive-text="外部"
        />
      </el-form-item>
      <el-form-item 
        v-if="!formData.internal"
        label="应用" 
        prop="appId">
        <el-select
          v-model="formData.appId"
          placeholder="请选择应用"
          clearable
          filterable
          @change="onAppChange">
          <el-option
            v-for="app in appOptions"
            :key="app.id"
            :label="app.name"
            :value="app.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item 
        v-if="!formData.internal"
        label="应用编码" 
        prop="appCode">
        <el-input v-model="formData.appCode" disabled placeholder="请选择应用后自动填充" readonly />
      </el-form-item>
      <el-form-item 
        v-if="!formData.internal"
        label="应用菜单" prop="linkMenuId">
        <el-select
          v-model="formData.linkMenuId"
          placeholder="请选择应用菜单"
          clearable
          filterable
          :disabled="!formData.appId"
          @change="onMenuChange">
          <el-option
            v-for="menu in menuOptions"
            :key="menu.id"
            :label="menu.name"
            :value="menu.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="快捷名称" prop="linkName">
        <el-input v-model="formData.linkName" placeholder="请输入快捷名称" />
      </el-form-item>
      <el-form-item label="路由地址" prop="linkRouter">
        <el-input v-model="formData.linkRouter" placeholder="请输入路由地址" />
      </el-form-item>
      <el-form-item label="快捷图标" prop="linkIcon">
        <IconSelect v-model="formData.linkIcon" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import * as QuickLinkApi from '@/api/system/app/quickLink'
import * as AppApi from '@/api/system/app'
import * as MenuApi from '@/api/system/menu'
defineOptions({ name: 'SystemAppQuickLinkForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const appOptions = ref<any[]>([]) // 应用选项
const menuOptions = ref<any[]>([]) // 菜单选项
const formData = ref({
  id: undefined,
  appId: undefined,
  appCode: undefined,
  linkName: undefined,
  linkMenuId: undefined,
  linkRouter: undefined,
  linkIcon: undefined,
  internal: false,
  creator: undefined,
  createTime: undefined,
  updater: undefined,
  updateTime: undefined,
  deleted: undefined,
  tenantId: undefined
})
const formRules = computed(() => {
  return {
    appId: !formData.value.internal ? [{ required: true, message: '应用不能为空', trigger: 'blur' }] : [],
    appCode: !formData.value.internal ? [{ required: true, message: '应用编码不能为空', trigger: 'blur' }] : [],
    linkName: [{ required: true, message: '快捷名称不能为空', trigger: 'blur' }],
    linkMenuId: !formData.value.internal ? [{ required: true, message: '请选择菜单', trigger: 'change' }] : [],
    linkRouter: [{ required: true, message: '路由地址不能为空', trigger: 'blur' }],
    linkIcon: [{ required: true, message: '快捷图标不能为空', trigger: 'blur' }],
    internal: formType.value === 'create' ? [{ required: true, message: '内部/外部不能为空', trigger: 'blur' }] : []
  }
})
const formRef = ref() // 表单 Ref

/** 加载应用列表 */
const loadAppOptions = async () => {
  try {
    const response = await AppApi.getAppList({})
    appOptions.value = response || []
  } catch (error) {
    console.error('加载应用列表失败:', error)
    appOptions.value = []
  }
}

/** 加载菜单列表 */
const loadMenuOptions = async (appId: number) => {
  if (!appId) {
    menuOptions.value = []
    return
  }
  try {
    const response = await MenuApi.getMenuListByAppId(appId)
    menuOptions.value = response || []
  } catch (error) {
    console.error('加载菜单列表失败:', error)
    menuOptions.value = []
  }
}

/** 菜单选择变化时 */
const onMenuChange = async (menuId: number) => {
  if (menuId) {
    try {
      // 获取菜单详细信息
      const menuInfo = menuOptions.value.find(menu => menu.id === menuId)
      if (menuInfo) {
        // 只在新增模式下自动填充菜单名称，编辑模式下保持原值
        if (formType.value === 'create' && !formData.value.linkName) {
          formData.value.linkName = menuInfo.name
        }
        formData.value.linkMenuId = menuInfo.id
      }
      // 通过选中的菜单ID调用MenuApi.getMenuFullPath获取路由地址
      const fullPath = await MenuApi.getMenuFullPath(menuId)
      formData.value.linkRouter = fullPath || undefined
    } catch (error) {
      console.error('获取菜单完整路径失败:', error)
      formData.value.linkRouter = undefined
    }
  } else {
    formData.value.linkMenuId = undefined
    formData.value.linkRouter = undefined
  }
}

/** 应用选择变化时，自动填充应用编码并加载菜单 */
const onAppChange = (appId: number) => {
  if (appId) {
    const selectedApp = appOptions.value.find(app => app.id === appId)
    if (selectedApp) {
      formData.value.appCode = selectedApp.code
    }
    // 加载对应应用的菜单
    loadMenuOptions(appId)
  } else {
    formData.value.appCode = undefined
    menuOptions.value = []
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 加载应用选项
  await loadAppOptions()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await QuickLinkApi.getAppQuickLink(id)
      // 先保存从后端获取的linkName，避免后面被覆盖
      const savedLinkName = data.linkName
      
      formData.value = data
      
      // 如果有appId，加载对应的菜单
      if (formData.value.appId) {
        await loadMenuOptions(formData.value.appId)
        // 如果有linkMenuId，在菜单加载完成后设置linkName（仅在linkName为空时）
        if (formData.value.linkMenuId && !savedLinkName) {
          const menuInfo = menuOptions.value.find(menu => menu.id === formData.value.linkMenuId)
          if (menuInfo) {
            formData.value.linkName = menuInfo.name
          }
        }
      }
      
      // 确保使用从后端获取的linkName（除非为空）
      if (savedLinkName) {
        formData.value.linkName = savedLinkName
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as QuickLinkApi.AppQuickLinkVO
    if (formType.value === 'create') {
      await QuickLinkApi.createAppQuickLink(data)
      message.success(t('common.createSuccess'))
    } else {
      await QuickLinkApi.updateAppQuickLink(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    appId: undefined,
    appCode: undefined,
    linkName: undefined,
    linkMenuId: undefined,
    linkRouter: undefined,
    linkIcon: undefined,
    internal: false,
    creator: undefined,
    createTime: undefined,
    updater: undefined,
    updateTime: undefined,
    deleted: undefined,
    tenantId: undefined
  }
  menuOptions.value = []
  formRef.value?.resetFields()
}
</script>