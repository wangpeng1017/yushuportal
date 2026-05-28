<template>
  <div class="eam-query-form" @keyup.enter="handleSearch">
    <div class="eam-query-form__grid" :style="{ '--eam-form-cols': String(cols) }">
      <slot></slot>
      <div class="eam-query-form__actions">
        <el-button type="primary" class="eam-search-btn" @click="handleSearch">
          <Icon icon="ep:search" class="mr-5px" />搜索
        </el-button>
        <el-button class="eam-reset-btn" @click="handleReset">
          <Icon icon="ep:refresh" class="mr-5px" />重置
        </el-button>
        <span v-if="needToggle" class="eam-query-form__toggle" @click="collapsed = !collapsed">
          {{ collapsed ? '展开 ▼' : '收起 ▲' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import { Icon } from '@/components/Icon'
import { QueryFormCtxKey, type QueryFormProps } from './types'

const props = withDefaults(defineProps<QueryFormProps>(), {
  cols: 4,
  collapseAfter: 8,
  labelWidth: '90px'
})

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const collapsed = ref(false)
const items = ref<symbol[]>([])

const needToggle = computed(() => items.value.length > props.collapseAfter)

function registerItem(id: symbol): number {
  items.value.push(id)
  return items.value.length - 1
}

function unregisterItem(id: symbol): void {
  const idx = items.value.indexOf(id)
  if (idx > -1) items.value.splice(idx, 1)
}

function handleSearch() { emit('search') }
function handleReset() { emit('reset') }

provide(QueryFormCtxKey, {
  cols: computed(() => props.cols) as any,
  collapsed,
  registerItem,
  unregisterItem,
  triggerSearch: handleSearch
})
</script>
