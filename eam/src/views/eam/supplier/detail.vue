<template>
  <Dialog v-model="dialogVisible" title="供应商详情" width="600px">
    <el-form v-loading="formLoading" :model="formData" label-width="140px">
      <el-form-item label="供应商编号">
        <el-input v-model="formData.supplierSn" disabled />
      </el-form-item>
      <el-form-item label="供应商名称">
        <el-input v-model="formData.supplierName" disabled />
      </el-form-item>
      <el-form-item label="供应商类别">
        <el-input v-model="formData.supplierCategoryText" disabled />
      </el-form-item>
      <el-form-item label="营业执照编号">
        <el-input v-model="formData.supplierCert" disabled />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="formData.contacts" disabled />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="formData.contactsPhone" disabled />
      </el-form-item>
      <el-form-item label="供应设备类别">
        <el-input v-model="formData.supplierGoodsText" disabled />
      </el-form-item>
      <el-form-item label="供应商状态">
        <el-input v-model="formData.supplierStatusText" disabled />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as SupplierApi from '@/api/eam/supplier'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'EamSupplierDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const formLoading = ref(false)

const formData = ref({
  supplierSn: '',
  supplierName: '',
  supplierCategoryText: '',
  supplierCert: '',
  contacts: '',
  contactsPhone: '',
  supplierGoodsText: '',
  supplierStatusText: ''
})

/** 打开详情弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    // 确保枚举已加载
    await eamEnumStore.loadSupplierEnums()
    const res = await SupplierApi.getSupplierById(id)
    const data = res
    formData.value = {
      supplierSn: data.supplierSn ?? '',
      supplierName: data.supplierName ?? '',
      supplierCategoryText: eamEnumStore.getSupplierCategoryText(data.supplierCategory ?? ''),
      supplierCert: data.supplierCert ?? '',
      contacts: data.contacts ?? '',
      contactsPhone: data.contactsPhone ?? '',
      supplierGoodsText: eamEnumStore.getSupplierGoodsText(data.supplierGoods ?? ''),
      supplierStatusText: eamEnumStore.getSupplierStatusText(data.supplierStatus ?? '')
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })
</script>
