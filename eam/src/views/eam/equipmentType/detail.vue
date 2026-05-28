<template>
  <Dialog v-model="dialogVisible" title="详情" width="600">
    <el-form v-loading="formLoading" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类型编码">
            <el-input v-model="formData.typeCode" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类型名称">
            <el-input v-model="formData.typeName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类别编码">
            <el-input v-model="formData.categoryCode" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备类别名称">
            <el-input v-model="formData.categoryName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">
        <Icon icon="ep:close" class="mr-5px" />关 闭
      </el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as EquipmentTypeApi from '@/api/eam/equipmentType'

defineOptions({ name: 'EamEquipmentTypeDetail' })

const dialogVisible = ref(false)
const formLoading = ref(false)

const formData = ref({
  typeCode: '',
  typeName: '',
  categoryCode: '',
  categoryName: ''
})

/** 打开详情弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    const res = await EquipmentTypeApi.getEquipmentTypeById(id)
    // request 封装层已自动解包，拿到的直接是业务数据对象
    const data = res
    formData.value = {
      typeCode: data.typeCode ?? '',
      typeName: data.typeName ?? '',
      categoryCode: data.categoryCode ?? '',
      categoryName: data.categoryName ?? ''
    }
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
