<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" max-height="500px" scroll>
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="120px"
    >
      <el-form-item label="应用名" prop="name">
        <el-input v-model="formData.name" placeholder="请输入应用名" />
      </el-form-item>
      <el-form-item label="应用编码" prop="code">
        <el-input 
          v-model="formData.code" 
          placeholder="请输入应用编码（可选）" 
          :disabled="formType === 'update'"
        />
      </el-form-item>
      <el-form-item label="客户端" prop="clientId">
        <el-select
          v-model="formData.clientId"
          placeholder="请选择关联的Oauth2客户端"
          clearable
          filterable
        >
          <el-option
            v-for="client in clientOptions"
            :key="client.id"
            :label="client.name"
            :value="client.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="应用图标" prop="logo">
        <UploadImg v-model="formData.logo" :limit="1" />
      </el-form-item>
      <el-form-item label="应用描述">
        <el-input v-model="formData.description" placeholder="请输入应用描述" type="textarea" />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio
            v-for="dict in getIntDictOptions(DICT_TYPE.COMMON_STATUS)"
            :key="dict.value"
            :value="dict.value"
          >
            {{ dict.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="访问地址" prop="redirectUri">
        <el-input v-model="formData.redirectUri" placeholder="请输入访问地址" />
      </el-form-item>
      <el-form-item label="内部/外部" prop="umcInternalFlag">
        <el-switch
          v-model="formData.umcInternalFlag"
          active-text="内部"
          inactive-text="外部"
        />
      </el-form-item>
      <el-form-item label="是否默认" prop="defaultFlag">
        <el-switch
          v-model="formData.defaultFlag"
          active-text="是"
          inactive-text="否"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { CommonStatusEnum } from '@/utils/constants'
import * as AppApi from '@/api/system/app'
import * as ClientApi from '@/api/system/oauth2/client'

defineOptions({ name: 'SystemAppForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const clientOptions = ref<any[]>([]) // 客户端选项
const formData = ref({
  id: undefined,
  clientId: undefined,
  name: undefined,
  code: undefined,
  logo: undefined,
  description: undefined,
  status: CommonStatusEnum.ENABLE,
  umcInternalFlag: false,
  redirectUri: undefined,
  defaultFlag: false,
  tenantId: undefined
})
const formRules = reactive({
  // clientId: [{ required: true, message: '客户端不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '应用名不能为空', trigger: 'blur' }],
  code: [{ required: false, message: '应用编码不能为空', trigger: 'blur' }],
  logo: [{ required: true, message: '应用图标不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  redirectUri: [{ required: true, message: '访问地址不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 加载客户端列表 */
const loadClientOptions = async () => {
  try {
    const response = await ClientApi.getOAuth2ClientList({})
    clientOptions.value = response || []
  } catch (error) {
    console.error('加载客户端列表失败:', error)
    clientOptions.value = []
  }
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 加载客户端选项
  await loadClientOptions()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const appData = await AppApi.getApp(id)
      // 确保 clientId 是数字类型
      if (appData.clientId) {
        appData.clientId = Number(appData.clientId)
      }
      formData.value = appData
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
    const data = formData.value as unknown as AppApi.AppVO
    if (formType.value === 'create') {
      await AppApi.createApp(data)
      message.success(t('common.createSuccess'))
    } else {
      await AppApi.updateApp(data)
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
    clientId: undefined,
    name: undefined,
    code: undefined,
    logo: undefined,
    description: undefined,
    status: CommonStatusEnum.ENABLE,
    umcInternalFlag: false,
    redirectUri: undefined,
    defaultFlag: false,
    tenantId: undefined
  }
  formRef.value?.resetFields()
}
</script>