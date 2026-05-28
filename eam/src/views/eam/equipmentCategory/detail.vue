<template>
  <Dialog v-model="dialogVisible" title="详情" width="600">
    <el-form v-loading="formLoading" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备分类编码">
            <el-input v-model="formData.categoryCode" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="设备分类名称">
            <el-input v-model="formData.categoryName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="排序">
            <el-input-number
              v-model="formData.sortNo"
              disabled
              :min="0"
              :max="99999"
              :precision="0"
              controls-position="right"
              style="width: 100%"
            />
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
import * as EquipmentCategoryApi from '@/api/eam/equipmentCategory'

defineOptions({ name: 'EamEquipmentCategoryDetail' })

const dialogVisible = ref(false)
const formLoading = ref(false)

const formData = ref({
  categoryCode: '',
  categoryName: '',
  sortNo: 0 as number | undefined
})

/** 打开详情弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  formLoading.value = true
  try {
    const res = await EquipmentCategoryApi.getEquipmentCategoryById(id)
    // request 封装层已自动解包 res.data，拿到的直接是业务数据对象
    const data = res
    formData.value = {
      categoryCode: data.categoryCode ?? '',
      categoryName: data.categoryName ?? '',
      sortNo: data.sortNo ?? 0
    }
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
