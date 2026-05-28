<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-form-item label="供应商编号" prop="supplierSn">
        <el-input v-model="formData.supplierSn" placeholder="请输入供应商编号" maxlength="15" />
      </el-form-item>
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" maxlength="60" />
      </el-form-item>
      <el-form-item label="供应商类别" prop="supplierCategory">
        <el-select
          v-model="formData.supplierCategory"
          placeholder="请选择供应商类别"
          clearable
          class="!w-full"
        >
          <el-option
            v-for="item in eamEnumStore.getSupplierCategoryList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="营业执照编号" prop="supplierCert">
        <el-input v-model="formData.supplierCert" placeholder="请输入营业执照编号" maxlength="18" />
      </el-form-item>
      <el-form-item label="联系人" prop="contacts">
        <el-input v-model="formData.contacts" placeholder="请输入联系人" maxlength="30" />
      </el-form-item>
      <el-form-item label="联系电话" prop="contactsPhone">
        <el-input v-model="formData.contactsPhone" placeholder="请输入联系电话" maxlength="11" />
      </el-form-item>
      <el-form-item label="供应设备类别" prop="supplierGoods">
        <el-select
          v-model="formData.supplierGoods"
          placeholder="请选择供应设备类别"
          clearable
          class="!w-full"
        >
          <el-option
            v-for="item in eamEnumStore.getSupplierGoodsList"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="供应商状态" prop="supplierStatus">
        <el-radio-group v-model="formData.supplierStatus">
          <el-radio
            v-for="item in eamEnumStore.getSupplierStatusList"
            :key="item.value"
            :value="item.value"
          >
            {{ item.text }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as SupplierApi from '@/api/eam/supplier'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'EamSupplierForm' })

const message = useMessage()
const { t } = useI18n()
const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formRef = ref()

const formData = ref({
  id: undefined as string | undefined,
  supplierSn: '',
  supplierName: '',
  supplierCategory: '',
  supplierCert: '',
  contacts: '',
  contactsPhone: '',
  supplierGoods: '',
  supplierStatus: '1'
})

/** 供应商编号：必填 + 纯数字校验 */
const validateSupplierSn = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入供应商编号'))
    return
  }
  if (!/^\d{1,15}$/.test(value)) {
    callback(new Error('请输入小于15个数字'))
    return
  }
  callback()
}

/** 联系电话：必填 + 纯数字校验 */
const validateContactsPhone = (_rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请输入联系电话'))
    return
  }
  if (!/^\d{1,11}$/.test(value)) {
    callback(new Error('请输入正确手机号'))
    return
  }
  callback()
}

const formRules = reactive({
  supplierSn: [{ required: true, validator: validateSupplierSn, trigger: 'blur' }],
  supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
  supplierCategory: [{ required: true, message: '请选择供应商类别', trigger: 'change' }],
  supplierCert: [{ required: true, message: '请输入营业执照编号', trigger: 'blur' }],
  contacts: [{ min: 1, max: 30, message: '长度在 1 到 30 个字符', trigger: 'blur' }],
  contactsPhone: [{ required: true, validator: validateContactsPhone, trigger: 'blur' }],
  supplierGoods: [{ required: true, message: '请选择供应设备类别', trigger: 'change' }],
  supplierStatus: [{ required: true, message: '请选择供应商状态', trigger: 'change' }]
})

const resetForm = () => {
  formData.value = {
    id: undefined,
    supplierSn: '',
    supplierName: '',
    supplierCategory: '',
    supplierCert: '',
    contacts: '',
    contactsPhone: '',
    supplierGoods: '',
    supplierStatus: '1'
  }
  formRef.value?.resetFields()
}

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增供应商' : '编辑供应商'
  formType.value = type
  resetForm()
  // 加载枚举数据
  await eamEnumStore.loadSupplierEnums()
  // 编辑模式：加载详情
  if (id) {
    formLoading.value = true
    try {
      const res = await SupplierApi.getSupplierById(id)
      const data = res
      formData.value = {
        id: data.id ?? undefined,
        supplierSn: data.supplierSn ?? '',
        supplierName: data.supplierName ?? '',
        supplierCategory: data.supplierCategory ?? '',
        supplierCert: data.supplierCert ?? '',
        contacts: data.contacts ?? '',
        contactsPhone: data.contactsPhone ?? '',
        supplierGoods: data.supplierGoods ?? '',
        supplierStatus: data.supplierStatus ?? '0'
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value } as SupplierApi.OptSupplierSaveDto
    if (formType.value === 'create') {
      await SupplierApi.createSupplier(data)
      message.success(t('common.createSuccess'))
    } else {
      await SupplierApi.updateSupplier(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
