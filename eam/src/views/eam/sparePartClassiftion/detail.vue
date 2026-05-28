<template>
  <Dialog v-model="dialogVisible" title="备件分类详情" width="600">
    <el-form v-loading="formLoading" :model="formData" label-width="120px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="分类名称">
            <el-input v-model="formData.classifName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级分类">
            <el-input v-model="formData.parentName" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="排序">
            <el-input v-model="formData.sort" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-tag :type="getStatusTagType(formData.status)">
              {{ formData.statusLabel }}
            </el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="创建人">
            <el-input v-model="formData.createByName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="创建时间">
            <el-input v-model="formData.createTime" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="修改人">
            <el-input v-model="formData.updateByName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="修改时间">
            <el-input v-model="formData.updateTime" disabled />
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
import * as SparePartClassificationApi from '@/api/eam/sparePartClassification'

defineOptions({ name: 'EamSparePartClassificationDetail' })

const dialogVisible = ref(false)
const formLoading = ref(false)

const formData = ref({
  classifName: '',
  parentName: '',
  sort: '',
  status: '',
  statusLabel: '',
  createByName: '',
  createTime: '',
  updateByName: '',
  updateTime: ''
})

// ==================== 状态枚举列表 ====================
const statusList = ref<SparePartClassificationApi.StatusOption[]>([])

const loadStatusList = async () => {
  try {
    const res = await SparePartClassificationApi.getStatusList()
    statusList.value = res ?? []
  } catch {
    statusList.value = []
  }
}

// 获取状态标签
const getStatusLabel = (value: string) => {
  const item = statusList.value.find((s) => s.value === value)
  return item?.text ?? value
}

// 获取状态标签类型
const getStatusTagType = (value: string) => {
  // 根据状态值返回不同的标签类型
  // 可以根据实际业务需求调整
  switch (value) {
    case 'ON':
      return 'success'
    case 'OFF':
      return 'info'
    default:
      return 'info'
  }
}

/** 打开详情弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  formLoading.value = true
  // 加载状态枚举列表
  await loadStatusList()
  try {
    const res = await SparePartClassificationApi.getSparePartClassificationById(id)
    const data = res
    formData.value = {
      classifName: data.classifName ?? '',
      parentName: data.parentName ?? '',
      sort: data.sort?.toString() ?? '',
      status: data.status ?? '',
      statusLabel: getStatusLabel(data.status ?? ''),
      createByName: data.createByName ?? '',
      createTime: data.createTime ?? '',
      updateByName: data.updateByName ?? '',
      updateTime: data.updateTime ?? ''
    }
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open })
</script>
