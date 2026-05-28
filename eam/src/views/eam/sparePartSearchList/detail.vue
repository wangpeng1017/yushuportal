<template>
  <Dialog v-model="dialogVisible" title="备件详情" width="50%">
    <el-form
      :model="formData"
      label-width="100px"
      class="detail-form"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="备件编号">
            <el-input v-model="formData.number" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备件名称">
            <el-input v-model="formData.name" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="规格型号">
            <el-input v-model="formData.specification" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="基础单位">
            <el-input v-model="formData.unitName" disabled />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="备件类型">
            <el-input v-model="formData.materialGroupName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import * as SparePartSearchApi from '@/api/eam/sparePartSearch'

defineOptions({ name: 'SparePartSearchDetail' })

const dialogVisible = ref(false)
const formData = ref<any>({
  number: '',
  name: '',
  specification: '',
  unitName: '',
  materialGroupName: ''
})

/** 打开弹窗 */
const open = async (record: SparePartSearchApi.SparePartSearchDto) => {
  dialogVisible.value = true
  resetForm()
  
  formData.value = {
    number: record.number || '',
    name: record.name || '',
    specification: record.specification || '',
    unitName: record.unitName || '',
    materialGroupName: record.materialGroupName || ''
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    number: '',
    name: '',
    specification: '',
    unitName: '',
    materialGroupName: ''
  }
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.detail-form {
  :deep(.el-input.is-disabled .el-input__inner) {
    color: rgba(0, 0, 0, 0.85);
    -webkit-text-fill-color: rgba(0, 0, 0, 0.85);
  }
}
</style>
