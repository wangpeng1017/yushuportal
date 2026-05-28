<template>
  <ContentWrap>
    <!-- 顶部 Tab 切换 -->
    <el-tabs v-model="currentToolType" class="cat-tabs" @tab-change="handleTabChange">
      <el-tab-pane label="刀具" name="刀具" />
      <el-tab-pane label="量具" name="量具" />
      <el-tab-pane label="模具" name="模具" />
    </el-tabs>

    <el-row :gutter="16">
      <!-- 左侧分类树 -->
      <el-col :span="10">
        <el-card shadow="never" class="tree-card">
          <div class="tree-toolbar">
            <el-input
              v-model="filterText"
              placeholder="搜索分类名称"
              clearable
              prefix-icon="Search"
              class="!w-60%"
            />
            <el-button type="primary" @click="handleAddRoot">
              <Icon icon="ep:plus" class="mr-3px" />新增一级
            </el-button>
          </div>

          <el-tree
            ref="treeRef"
            :data="treeData"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            :empty-text="treeLoading ? '加载中…' : '暂无分类，点击右上角「新增一级」'"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="tree-node-row">
                <span class="tree-node-label">
                  <Icon
                    :icon="data.children && data.children.length ? 'ep:folder-opened' : 'ep:document'"
                    class="mr-3px"
                    :style="{ color: data.status === 0 ? '#aaa' : '#409eff' }"
                  />
                  <span :class="{ 'is-disabled': data.status === 0 }">{{ data.name }}</span>
                  <el-tag size="small" type="info" round class="lvl-tag">L{{ data.level }}</el-tag>
                </span>
                <span class="tree-node-actions">
                  <el-button
                    v-if="data.level < 5"
                    size="small"
                    link
                    type="primary"
                    @click.stop="handleAddChild(data)"
                  >
                    +子级
                  </el-button>
                  <el-button
                    size="small"
                    link
                    type="danger"
                    @click.stop="handleDelete(data)"
                  >
                    删除
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧编辑面板 -->
      <el-col :span="14">
        <el-card v-if="currentNode" shadow="never" class="form-card">
          <template #header>
            <div class="form-card-header">
              <span>节点详情 — {{ currentNode.name }}</span>
              <el-tag size="small" :type="currentNode.status === 1 ? 'success' : 'info'">
                {{ currentNode.status === 1 ? '已启用' : '已停用' }}
              </el-tag>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="100px"
          >
            <el-form-item label="分类编号">
              <el-input v-model="formData.code" disabled />
            </el-form-item>
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入分类名称" maxlength="40" show-word-limit />
            </el-form-item>
            <el-form-item label="适用对象">
              <el-input v-model="formData.toolType" disabled />
            </el-form-item>
            <el-form-item label="上级分类">
              <el-input :model-value="parentPath || '（一级根节点）'" disabled />
            </el-form-item>
            <el-form-item label="层级">
              <el-input :model-value="`第 ${formData.level} 级`" disabled />
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="formData.sort" :min="1" :max="999" />
            </el-form-item>
            <el-form-item label="启用状态">
              <el-switch
                v-model="formData.status"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="停用"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="saving" @click="handleSave">
                <Icon icon="ep:check" class="mr-3px" />保存
              </el-button>
              <el-button @click="resetForm">
                <Icon icon="ep:refresh-left" class="mr-3px" />重置
              </el-button>
              <el-button
                v-if="formData.level < 5"
                type="success"
                plain
                @click="handleAddChild(currentNode)"
              >
                <Icon icon="ep:plus" class="mr-3px" />新增子级
              </el-button>
              <el-button type="danger" plain @click="handleDelete(currentNode)">
                <Icon icon="ep:delete" class="mr-3px" />删除
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
        <el-empty v-else description="请在左侧选择分类节点查看/编辑详情" />
      </el-col>
    </el-row>
  </ContentWrap>

  <!-- 新增对话框 -->
  <el-dialog v-model="addDialogVisible" :title="addDialogTitle" width="500px" :close-on-click-modal="false">
    <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="addForm.name" placeholder="请输入分类名称" maxlength="40" show-word-limit />
      </el-form-item>
      <el-form-item label="适用对象">
        <el-input v-model="addForm.toolType" disabled />
      </el-form-item>
      <el-form-item label="上级分类">
        <el-input :model-value="addParentPath || '（一级根节点）'" disabled />
      </el-form-item>
      <el-form-item label="层级">
        <el-input :model-value="`第 ${addForm.level} 级`" disabled />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="addForm.sort" :min="1" :max="999" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="addDialogVisible = false">取消</el-button>
      <el-button type="primary" :loading="adding" @click="submitAdd">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="EamToolCategory">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import request from '@/config/axios'

// ────────────────────────────────────────────────
// 状态
// ────────────────────────────────────────────────
const currentToolType = ref<'刀具' | '量具' | '模具'>('刀具')
const filterText = ref('')
const treeRef = ref()
const treeLoading = ref(false)
const flatList = ref<any[]>([])
const treeData = ref<any[]>([])
const currentNode = ref<any>(null)

const formRef = ref<FormInstance>()
const formData = reactive({
  id: '',
  code: '',
  name: '',
  toolType: '',
  parentId: 0 as string | number,
  level: 1,
  sort: 1,
  status: 1
})
const formRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}
const saving = ref(false)

// ────────────────────────────────────────────────
// 新增对话框
// ────────────────────────────────────────────────
const addDialogVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addForm = reactive({
  name: '',
  toolType: '',
  parentId: 0 as string | number,
  level: 1,
  sort: 1
})
const addFormRules: FormRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}
const adding = ref(false)
const addParentPath = ref('')

const addDialogTitle = computed(() =>
  addForm.parentId === 0 ? `新增一级分类（${addForm.toolType}）` : `新增子级分类（${addForm.toolType} - L${addForm.level}）`
)

// ────────────────────────────────────────────────
// 计算：上级分类路径
// ────────────────────────────────────────────────
const parentPath = computed(() => buildParentPath(formData.parentId))

function buildParentPath(parentId: string | number): string {
  if (!parentId || parentId === 0) return ''
  const segs: string[] = []
  let cur: any = flatList.value.find(c => c.id === parentId)
  while (cur) {
    segs.unshift(cur.name)
    if (!cur.parentId || cur.parentId === 0) break
    cur = flatList.value.find(c => c.id === cur.parentId)
  }
  return segs.join(' / ')
}

// ────────────────────────────────────────────────
// 树构建：扁平 → 树
// ────────────────────────────────────────────────
function buildTree(list: any[]): any[] {
  const map = new Map<string | number, any>()
  list.forEach(item => map.set(item.id, { ...item, children: [] }))
  const roots: any[] = []
  list.forEach(item => {
    const node = map.get(item.id)
    if (!item.parentId || item.parentId === 0) {
      roots.push(node)
    } else {
      const parent = map.get(item.parentId)
      if (parent) {
        parent.children.push(node)
      } else {
        // 孤儿节点：当根处理
        roots.push(node)
      }
    }
  })
  // 按 sort 排序
  const sortRecursive = (nodes: any[]) => {
    nodes.sort((a, b) => (a.sort || 0) - (b.sort || 0))
    nodes.forEach(n => n.children && n.children.length && sortRecursive(n.children))
  }
  sortRecursive(roots)
  // 清理空 children 数组（让叶子节点不显示展开箭头）
  const cleanLeaves = (nodes: any[]) => {
    nodes.forEach(n => {
      if (n.children && n.children.length === 0) {
        delete n.children
      } else if (n.children) {
        cleanLeaves(n.children)
      }
    })
  }
  cleanLeaves(roots)
  return roots
}

// ────────────────────────────────────────────────
// 加载树
// ────────────────────────────────────────────────
async function loadTree() {
  treeLoading.value = true
  try {
    const res: any = await request.get({
      url: '/admin-api/eam/tool-category/tree',
      params: { toolType: currentToolType.value }
    })
    flatList.value = Array.isArray(res) ? res : (res?.data || res || [])
    treeData.value = buildTree(flatList.value)
    // 默认选中第一个根节点
    await nextTick()
    if (treeData.value.length > 0) {
      const firstNode = treeData.value[0]
      treeRef.value?.setCurrentKey?.(firstNode.id)
      handleNodeClick(firstNode)
    } else {
      currentNode.value = null
    }
  } catch (e) {
    console.error('加载分类树失败', e)
    ElMessage.error('加载分类树失败')
    flatList.value = []
    treeData.value = []
  } finally {
    treeLoading.value = false
  }
}

// ────────────────────────────────────────────────
// Tab 切换
// ────────────────────────────────────────────────
function handleTabChange() {
  filterText.value = ''
  currentNode.value = null
  loadTree()
}

// ────────────────────────────────────────────────
// 搜索过滤
// ────────────────────────────────────────────────
watch(filterText, (val) => {
  treeRef.value?.filter(val)
})

function filterNode(value: string, data: any) {
  if (!value) return true
  return (data.name || '').includes(value)
}

// ────────────────────────────────────────────────
// 节点点击
// ────────────────────────────────────────────────
function handleNodeClick(data: any) {
  currentNode.value = data
  Object.assign(formData, {
    id: data.id,
    code: data.code,
    name: data.name,
    toolType: data.toolType,
    parentId: data.parentId,
    level: data.level,
    sort: data.sort,
    status: data.status
  })
}

function resetForm() {
  if (!currentNode.value) return
  Object.assign(formData, {
    id: currentNode.value.id,
    code: currentNode.value.code,
    name: currentNode.value.name,
    toolType: currentNode.value.toolType,
    parentId: currentNode.value.parentId,
    level: currentNode.value.level,
    sort: currentNode.value.sort,
    status: currentNode.value.status
  })
  formRef.value?.clearValidate()
}

// ────────────────────────────────────────────────
// 保存
// ────────────────────────────────────────────────
async function handleSave() {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  saving.value = true
  try {
    await request.post({
      url: '/admin-api/eam/tool-category/update',
      data: {
        id: formData.id,
        name: formData.name,
        sort: formData.sort,
        status: formData.status,
        // 保留以下字段不变
        code: formData.code,
        toolType: formData.toolType,
        parentId: formData.parentId,
        level: formData.level
      }
    })
    ElMessage.success('保存成功')
    const savedId = formData.id
    await loadTree()
    // 重新选中刚保存的节点
    await nextTick()
    const target = flatList.value.find(c => c.id === savedId)
    if (target) {
      treeRef.value?.setCurrentKey?.(target.id)
      handleNodeClick(target)
    }
  } catch (e) {
    console.error('保存失败', e)
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

// ────────────────────────────────────────────────
// 新增一级
// ────────────────────────────────────────────────
function handleAddRoot() {
  Object.assign(addForm, {
    name: '',
    toolType: currentToolType.value,
    parentId: 0,
    level: 1,
    sort: nextSort(0)
  })
  addParentPath.value = ''
  addDialogVisible.value = true
  nextTick(() => addFormRef.value?.clearValidate())
}

// ────────────────────────────────────────────────
// 新增子级
// ────────────────────────────────────────────────
function handleAddChild(parent: any) {
  if (parent.level >= 5) {
    ElMessage.warning('最多支持 5 级分类，无法继续新增子级')
    return
  }
  Object.assign(addForm, {
    name: '',
    toolType: parent.toolType,
    parentId: parent.id,
    level: parent.level + 1,
    sort: nextSort(parent.id)
  })
  // buildParentPath(parent.id) 返回 parent 的祖先链，需要再带上 parent 自身
  const ancestorPath = buildParentPath(parent.id)
  addParentPath.value = ancestorPath ? `${ancestorPath} / ${parent.name}` : parent.name
  addDialogVisible.value = true
  nextTick(() => addFormRef.value?.clearValidate())
}

// 同级最大 sort + 1
function nextSort(parentId: string | number): number {
  const siblings = flatList.value.filter(c => (c.parentId || 0) === (parentId || 0) && c.toolType === currentToolType.value)
  if (siblings.length === 0) return 1
  return Math.max(...siblings.map(s => s.sort || 0)) + 1
}

// ────────────────────────────────────────────────
// 提交新增
// ────────────────────────────────────────────────
async function submitAdd() {
  if (!addFormRef.value) return
  const valid = await addFormRef.value.validate().catch(() => false)
  if (!valid) return

  adding.value = true
  try {
    const res: any = await request.post({
      url: '/admin-api/eam/tool-category/create',
      data: {
        name: addForm.name,
        toolType: addForm.toolType,
        parentId: addForm.parentId,
        level: addForm.level,
        sort: addForm.sort
      }
    })
    ElMessage.success('新增成功')
    addDialogVisible.value = false
    const newId = res?.id || res?.data?.id
    await loadTree()
    // 选中新建节点
    await nextTick()
    if (newId) {
      const target = flatList.value.find(c => c.id === newId)
      if (target) {
        treeRef.value?.setCurrentKey?.(target.id)
        handleNodeClick(target)
      }
    }
  } catch (e) {
    console.error('新增失败', e)
    ElMessage.error('新增失败')
  } finally {
    adding.value = false
  }
}

// ────────────────────────────────────────────────
// 删除
// ────────────────────────────────────────────────
async function handleDelete(node: any) {
  // 检查是否有子节点
  const children = flatList.value.filter(c => c.parentId === node.id)
  if (children.length > 0) {
    ElMessage.warning(`该分类下还有 ${children.length} 个子分类，请先删除子分类`)
    return
  }
  try {
    await ElMessageBox.confirm(
      `确认删除分类「${node.name}」（${node.code}）？此操作不可恢复。`,
      '删除确认',
      { type: 'warning', confirmButtonText: '确认删除', cancelButtonText: '取消' }
    )
  } catch {
    return
  }
  try {
    await request.delete({
      url: '/admin-api/eam/tool-category/delete',
      params: { id: node.id }
    })
    ElMessage.success('删除成功')
    if (currentNode.value?.id === node.id) {
      currentNode.value = null
    }
    await loadTree()
  } catch (e) {
    console.error('删除失败', e)
    ElMessage.error('删除失败')
  }
}

// ────────────────────────────────────────────────
// 初始化
// ────────────────────────────────────────────────
onMounted(() => {
  loadTree()
})
</script>

<style lang="scss" scoped>
.cat-tabs {
  margin-bottom: 12px;
}

.tree-card {
  min-height: calc(100vh - 260px);
  max-height: calc(100vh - 200px);
  overflow: auto;
}

.tree-toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.tree-node-row {
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  padding-right: 8px;
}

.tree-node-label {
  display: inline-flex;
  align-items: center;
  font-size: 14px;

  .lvl-tag {
    margin-left: 6px;
    height: 18px;
    line-height: 16px;
    padding: 0 6px;
    color: #909399;
  }

  .is-disabled {
    color: #c0c4cc;
    text-decoration: line-through;
  }
}

.tree-node-actions {
  visibility: hidden;
  display: inline-flex;
  gap: 4px;
}

:deep(.el-tree-node__content):hover .tree-node-actions {
  visibility: visible;
}

:deep(.el-tree-node.is-current) > .el-tree-node__content .tree-node-actions {
  visibility: visible;
}

.form-card {
  min-height: calc(100vh - 260px);

  .form-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
