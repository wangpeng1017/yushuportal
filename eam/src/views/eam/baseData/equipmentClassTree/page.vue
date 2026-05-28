<template>
  <div class="equipment-class-tree-page">
    <el-row :gutter="12">
      <!-- 左：树 -->
      <el-col :span="9">
        <el-card class="h-full" shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold text-14px">设备分类树（3 大根 + 5 级层级）</span>
              <el-button-group size="small">
                <el-button type="primary" @click="openAddDialog(null)"><Icon icon="ep:plus" />根节点</el-button>
                <el-button @click="loadTree"><Icon icon="ep:refresh" />刷新</el-button>
              </el-button-group>
            </div>
          </template>
          <el-tree
            v-loading="loading"
            ref="treeRef"
            :data="treeData"
            node-key="id"
            :default-expanded-keys="defaultExpanded"
            :expand-on-click-node="false"
            highlight-current
            @node-click="handleNodeClick"
          >
            <template #default="{ node, data }">
              <span class="flex-1 flex justify-between items-center pr-8px">
                <span :class="{ 'text-gray-400': !data.enabled }">
                  <Icon v-if="!data.enabled" icon="ep:lock" class="mr-3px" />
                  {{ data.label }}
                </span>
                <span class="text-12px text-gray-400">L{{ node.level }} · {{ data.children?.length || 0 }} 子项</span>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右：节点详情/编辑 -->
      <el-col :span="15">
        <el-card class="h-full" shadow="never">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="font-bold text-14px">{{ selectedNode ? `编辑节点：${selectedNode.label}` : '请选择左侧节点' }}</span>
              <el-button-group v-if="selectedNode" size="small">
                <el-button type="primary" @click="openAddDialog(selectedNode)"><Icon icon="ep:plus" />新增子节点</el-button>
                <el-button type="danger" @click="handleDelete"><Icon icon="ep:delete" />删除</el-button>
              </el-button-group>
            </div>
          </template>
          <div v-if="!selectedNode" class="text-center text-gray-400 py-50px">
            <Icon icon="ep:guide" class="text-50px" />
            <div class="mt-10px text-13px">点击左侧树节点查看/编辑</div>
          </div>
          <el-form v-else label-width="100px" :model="editForm" class="max-w-600px">
            <el-form-item label="节点 ID">
              <el-tag size="small" type="info">{{ selectedNode.id }}</el-tag>
            </el-form-item>
            <el-form-item label="所在路径">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item v-for="(seg, i) in selectedPath" :key="i">{{ seg }}</el-breadcrumb-item>
              </el-breadcrumb>
            </el-form-item>
            <el-form-item label="节点名称">
              <el-input v-model="editForm.label" />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="editForm.sort" :min="0" />
            </el-form-item>
            <el-form-item label="启用">
              <el-switch v-model="editForm.enabled" />
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="editForm.remark" type="textarea" :rows="2" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSave"><Icon icon="ep:check" />保存修改</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新增对话框 -->
    <el-dialog v-model="addDialogVisible" :title="`新增${addParent ? '子' : '根'}节点${addParent ? '到 ' + addParent.label : ''}`" width="500px">
      <el-form label-width="80px" :model="addForm">
        <el-form-item label="节点名称" required>
          <el-input v-model="addForm.label" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="addForm.sort" :min="0" />
        </el-form-item>
        <el-form-item label="启用">
          <el-switch v-model="addForm.enabled" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addForm.remark" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="adding" @click="handleAdd">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="EamBaseEquipmentClassTree">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/config/axios'

const loading = ref(false)
const saving = ref(false)
const adding = ref(false)
const treeRef = ref()
const treeData = ref<any[]>([])
const selectedNode = ref<any>(null)
const editForm = reactive({ id: '', label: '', sort: 0, enabled: true, remark: '' })

const defaultExpanded = computed(() => treeData.value.map(n => n.id))

const selectedPath = computed(() => {
  if (!selectedNode.value) return []
  function find(nodes: any[], target: string, path: string[]): string[] | null {
    for (const n of nodes) {
      const next = [...path, n.label]
      if (n.id === target) return next
      if (n.children?.length) {
        const r = find(n.children, target, next)
        if (r) return r
      }
    }
    return null
  }
  return find(treeData.value, selectedNode.value.id, []) || [selectedNode.value.label]
})

async function loadTree() {
  loading.value = true
  try {
    const res: any = await request.get({ url: '/eam/equipment-class-tree/get' })
    treeData.value = Array.isArray(res) ? res : []
    if (selectedNode.value) {
      // 重新查找已选节点
      function find(nodes: any[], id: string): any {
        for (const n of nodes) {
          if (n.id === id) return n
          if (n.children?.length) {
            const r = find(n.children, id)
            if (r) return r
          }
        }
        return null
      }
      const stillThere = find(treeData.value, selectedNode.value.id)
      if (stillThere) {
        selectedNode.value = stillThere
        Object.assign(editForm, stillThere)
      } else {
        selectedNode.value = null
      }
    }
  } finally { loading.value = false }
}

function handleNodeClick(node: any) {
  selectedNode.value = node
  Object.assign(editForm, {
    id: node.id, label: node.label, sort: node.sort, enabled: node.enabled, remark: node.remark || '',
  })
}

async function handleSave() {
  if (!selectedNode.value) return
  saving.value = true
  try {
    await request.post({ url: '/eam/equipment-class-tree/update-node', data: { ...editForm } })
    ElMessage.success('已保存')
    await loadTree()
  } finally { saving.value = false }
}

async function handleDelete() {
  if (!selectedNode.value) return
  await ElMessageBox.confirm(`确认删除「${selectedNode.value.label}」？\n如果有子节点将一并删除，且不可恢复。`, '删除确认', { type: 'warning' })
  await request.delete({ url: '/eam/equipment-class-tree/delete-node', params: { id: selectedNode.value.id } })
  ElMessage.success('已删除')
  selectedNode.value = null
  await loadTree()
}

// 新增对话框
const addDialogVisible = ref(false)
const addParent = ref<any>(null)
const addForm = reactive({ label: '', sort: 99, enabled: true, remark: '' })

function openAddDialog(parent: any) {
  addParent.value = parent
  Object.assign(addForm, { label: '', sort: 99, enabled: true, remark: '' })
  addDialogVisible.value = true
}
async function handleAdd() {
  if (!addForm.label) { ElMessage.warning('请输入节点名称'); return }
  adding.value = true
  try {
    await request.post({
      url: '/eam/equipment-class-tree/add-node',
      data: { parentId: addParent.value?.id || null, ...addForm },
    })
    ElMessage.success('已新增')
    addDialogVisible.value = false
    await loadTree()
  } finally { adding.value = false }
}

onMounted(loadTree)
</script>

<style scoped>
.equipment-class-tree-page {
  padding: 12px;
}
.equipment-class-tree-page :deep(.el-card__body) {
  min-height: 600px;
  max-height: calc(100vh - 200px);
  overflow: auto;
}
.equipment-class-tree-page :deep(.el-tree-node__content) {
  height: 32px;
}
</style>
