<template>
  <Dialog v-model="dialogVisible" title="设备档案详情" width="900px">
    <el-form v-loading="formLoading" :model="formData" label-width="140px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备编号">
            <el-input v-model="formData.equipmentSn" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称">
            <el-input v-model="formData.equipmentName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型编码">
            <el-input v-model="formData.equipmentType" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型描述">
            <el-input v-model="formData.equipmentTypeDesc" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备分类编码">
            <el-input v-model="formData.equipmentCategory" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备分类描述">
            <el-input v-model="formData.equipmentCategoryDesc" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备型号">
            <el-input v-model="formData.equipmentModeText" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置号">
            <el-input v-model="formData.locationSn" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备标识">
            <el-input v-model="formData.equipmentTag" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编号">
            <el-input v-model="formData.equipmentSupplier" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商名称">
            <el-input v-model="formData.equipmentSupplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产状态">
            <el-input v-model="formData.equipmentStatusText" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="运行状态">
            <el-input v-model="formData.operationStatusText" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启停用状态">
            <el-input v-model="formData.equipmentRevstopText" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序号">
            <el-input v-model="formData.sequenceNumber" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购置时间">
            <el-input v-model="formData.equipmentPurchase" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="投入运营时间">
            <el-input v-model="formData.equipmentOperating" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'

defineOptions({ name: 'EamOptEquipmentDetail' })

const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const formLoading = ref(false)

const formData = ref({
  equipmentSn: '',
  equipmentName: '',
  equipmentType: '',
  equipmentTypeDesc: '',
  equipmentCategory: '',
  equipmentCategoryDesc: '',
  equipmentModeText: '',
  locationSn: '',
  equipmentTag: '',
  equipmentSupplier: '',
  equipmentSupplierName: '',
  equipmentStatusText: '',
  operationStatusText: '',
  equipmentRevstopText: '',
  sequenceNumber: '' as string | number,
  equipmentPurchase: '',
  equipmentOperating: ''
})

/** 打开详情弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    // 确保枚举已加载
    await eamEnumStore.loadEquipmentEnums()
    const res = await EquipmentApi.getEquipmentById(id)
    formData.value = {
      equipmentSn: res.equipmentSn ?? '',
      equipmentName: res.equipmentName ?? '',
      equipmentType: res.equipmentType ?? '',
      equipmentTypeDesc: res.equipmentTypeDesc ?? '',
      equipmentCategory: res.equipmentCategory ?? '',
      equipmentCategoryDesc: res.equipmentCategoryDesc ?? '',
      equipmentModeText: eamEnumStore.getEquipmentModeText(res.equipmentMode ?? ''),
      locationSn: res.locationSn ?? '',
      equipmentTag: res.equipmentTag ?? '',
      equipmentSupplier: res.equipmentSupplier ?? '',
      equipmentSupplierName: res.equipmentSupplierName ?? '',
      equipmentStatusText: eamEnumStore.getEquipmentStatusText(res.equipmentStatus ?? ''),
      operationStatusText: eamEnumStore.getOperationStatusText(res.operationStatus ?? ''),
      equipmentRevstopText: eamEnumStore.getEquipmentRevstopText(res.equipmentRevstop ?? ''),
      sequenceNumber: res.sequenceNumber ?? '',
      equipmentPurchase: res.equipmentPurchase ?? '',
      equipmentOperating: res.equipmentOperating ?? ''
    }
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open })
</script>
