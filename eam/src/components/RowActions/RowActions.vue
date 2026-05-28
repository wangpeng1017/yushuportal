<template>
  <span v-if="hasNothing" class="eam-row-actions">—</span>
  <span v-else class="eam-row-actions">
    <el-button v-if="onDetail" link class="ra-detail" @click="handleDetail">详情</el-button>
    <el-button v-if="onEdit" link class="ra-edit" @click="handleEdit">编辑</el-button>
    <el-button v-if="onDelete" link class="ra-delete" @click="handleDelete">删除</el-button>
    <el-dropdown v-if="hasMore" trigger="click" class="ra-more">
      <el-button link class="ra-more">
        更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <slot name="more"></slot>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import type { RowActionsProps } from './types'

const props = withDefaults(defineProps<RowActionsProps>(), {
  onDetail: null,
  onEdit: null,
  onDelete: null,
  deleteConfirmText: '确认删除该条数据？'
})

const slots = useSlots()
const hasMore = computed(() => !!slots.more)

const hasNothing = computed(
  () => !props.onDetail && !props.onEdit && !props.onDelete && !hasMore.value
)

function handleDetail() {
  props.onDetail?.(props.row)
}

function handleEdit() {
  props.onEdit?.(props.row)
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(props.deleteConfirmText, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    props.onDelete?.(props.row)
  } catch {
    // 用户取消
  }
}
</script>
