<template>
  <el-row :gutter="16">
    <!-- 左侧树 -->
    <el-col :span="5">
      <el-card shadow="never" style="height: calc(100vh - 180px); overflow: auto">
        <el-input
          v-model="treeFilterText"
          placeholder="搜索分类"
          clearable
          class="mb-10px"
          prefix-icon="Search"
        />
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="{ label: 'label', children: 'children' }"
          node-key="key"
          :filter-node-method="filterNode"
          :expand-on-click-node="false"
          highlight-current
          :default-expanded-keys="defaultExpanded"
          @node-click="handleNodeClick"
        >
          <template #default="{ data }">
            <span class="custom-tree-node">
              <span>{{ data.label }}</span>
              <el-tag
                v-if="data.count !== undefined"
                size="small"
                type="info"
                round
                style="margin-left: 6px; height: 18px; line-height: 16px; padding: 0 6px"
              >
                {{ data.count }}
              </el-tag>
            </span>
          </template>
        </el-tree>
      </el-card>
    </el-col>

    <!-- 右侧主区 -->
    <el-col :span="19">
      <slot :selected-key="selectedKey" :selected-node="selectedNode"></slot>
    </el-col>
  </el-row>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps<{
  /** 树数据：{ key, label, children?, count? } */
  treeData: any[]
  /** 默认选中节点 key */
  defaultKey?: string
  /** 默认展开的 key 数组 */
  defaultExpandedKeys?: string[]
}>()

const emit = defineEmits<{
  (e: 'select', key: string, node: any): void
}>()

const treeRef = ref()
const treeFilterText = ref('')
const selectedKey = ref<string>(props.defaultKey || 'ALL')
const selectedNode = ref<any>(null)

const defaultExpanded = computed(() => {
  if (props.defaultExpandedKeys) return props.defaultExpandedKeys
  // 默认展开根节点 + 第一层
  return ['ALL', ...(props.treeData || []).map(t => t.key)]
})

watch(treeFilterText, (val) => {
  treeRef.value?.filter(val)
})

function filterNode(value: string, data: any) {
  if (!value) return true
  return (data.label || '').includes(value)
}

function handleNodeClick(data: any) {
  selectedKey.value = data.key
  selectedNode.value = data
  emit('select', data.key, data)
}

onMounted(() => {
  // 默认选中第一个节点（"全部"）
  if (props.treeData && props.treeData.length > 0) {
    const firstKey = props.defaultKey || props.treeData[0].key
    selectedKey.value = firstKey
    selectedNode.value = props.treeData[0]
    emit('select', firstKey, props.treeData[0])
  }
})

defineExpose({ selectedKey })
</script>

<style scoped>
.custom-tree-node {
  display: flex;
  align-items: center;
  flex: 1;
  font-size: 14px;
}
</style>
