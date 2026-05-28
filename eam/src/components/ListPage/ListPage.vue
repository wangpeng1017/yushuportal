<template>
  <div class="eam-list-page" v-loading="loading">
    <div class="eam-list-page__header">
      <slot name="actions"></slot>
    </div>
    <div class="eam-list-page__body">
      <slot></slot>
    </div>
    <div v-if="total > 0" class="eam-list-page__footer">
      <slot name="footer">
        <el-pagination
          background
          :current-page="page"
          :page-size="limit"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="(p) => emit('update:page', p)"
          @size-change="(s) => emit('update:limit', s)"
        />
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ListPageProps } from './types'

const props = withDefaults(defineProps<ListPageProps>(), {
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:limit', limit: number): void
  (e: 'pagination', payload: { page: number; limit: number }): void
}>()
</script>
