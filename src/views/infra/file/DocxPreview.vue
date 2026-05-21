<template>
  <Dialog v-model="visible" :title="`预览 - ${name}`" width="900px">
    <div v-loading="loading" class="docx-preview-wrap">
      <VueOfficeDocx
        v-if="visible && url"
        :src="url"
        style="min-height: 60vh"
        @rendered="onRendered"
        @error="onError"
      />
      <div v-if="errorMsg" class="docx-preview-error">
        {{ errorMsg }}
        <el-link type="primary" :href="url" :underline="false" target="_blank" class="ml-10px">
          下载源文件
        </el-link>
      </div>
    </div>
    <template #footer>
      <el-button @click="visible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'

defineOptions({ name: 'DocxPreview' })

const props = defineProps<{
  modelValue: boolean
  url: string
  name: string
}>()
const emit = defineEmits(['update:modelValue'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const loading = ref(false)
const errorMsg = ref('')

watch(visible, (val) => {
  if (val) {
    loading.value = true
    errorMsg.value = ''
  }
})

const onRendered = () => {
  loading.value = false
  errorMsg.value = ''
}

const onError = (e: any) => {
  loading.value = false
  errorMsg.value = '预览失败：' + (e?.message || '请检查文件是否可访问或浏览器是否支持')
}
</script>
<style scoped>
.docx-preview-wrap {
  max-height: 70vh;
  overflow: auto;
  background: #f5f5f5;
  padding: 16px;
}
.docx-preview-error {
  color: #f56c6c;
  padding: 12px 0;
  text-align: center;
}
</style>
