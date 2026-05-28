<template>
  <div v-show="visible" class="eam-query-form__item" :style="itemStyle">
    <span class="label">{{ label }}</span>
    <span class="control">
      <slot></slot>
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useQueryFormContext } from './useQueryFormContext'
import type { QueryItemProps } from './types'

const props = withDefaults(defineProps<QueryItemProps>(), { span: 1 })

const ctx = useQueryFormContext()
const id = Symbol('query-item')

let myIndex = -1

onMounted(() => {
  if (ctx) myIndex = ctx.registerItem(id)
})

onBeforeUnmount(() => {
  ctx?.unregisterItem(id)
})

const visible = computed(() => {
  if (!ctx) return true
  if (!ctx.collapsed.value) return true
  return myIndex >= 0 && myIndex < ctx.cols.value
})

const itemStyle = computed(() => {
  if (props.span > 1) return { gridColumn: `span ${props.span}` }
  return {}
})
</script>
