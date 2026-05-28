<template>
  <div class="spare-part-category-tree-page">
    <ContentWrap>
      <el-alert
type="info" :closable="false" show-icon class="mb-15px"
        title="备件分类树（5 级）。CNC 端三级以上分类查询需求由此树支撑。" />
      <el-row :gutter="12">
        <el-col :span="9">
          <el-card shadow="never">
            <template #header>
              <div class="card-header">
                <span class="title">备件分类树</span>
                <el-button-group size="small">
                  <el-button type="primary"><Icon icon="ep:plus" />根节点</el-button>
                  <el-button><Icon icon="ep:refresh" />刷新</el-button>
                </el-button-group>
              </div>
            </template>
            <el-tree :data="treeData" node-key="id" default-expand-all highlight-current @node-click="handleNodeClick">
              <template #default="{ node, data }">
                <span class="tree-node">
                  <span>{{ data.label }}</span>
                  <span class="node-meta">L{{ node.level }} {{ data.children ? data.children.length : 0 }} 子项</span>
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="15">
          <el-card shadow="never">
            <template #header>
              <span class="title">{{ panelTitle }}</span>
            </template>
            <div v-if="!selectedNode" class="empty-tip">
              <div>请选择左侧节点查看详情</div>
            </div>
            <el-form v-else label-width="100px" class="form">
              <el-form-item label="分类编码"><el-tag type="info">{{ selectedNode.id }}</el-tag></el-form-item>
              <el-form-item label="分类名称"><el-input v-model="selectedNode.label" /></el-form-item>
              <el-form-item label="排序"><el-input-number v-model="selectedNode.sort" :min="0" /></el-form-item>
              <el-form-item label="启用"><el-switch v-model="selectedNode.enabled" /></el-form-item>
              <el-form-item label="备注"><el-input v-model="selectedNode.remark" type="textarea" :rows="2" /></el-form-item>
              <el-form-item><el-button type="primary"><Icon icon="ep:check" />保存修改</el-button></el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </ContentWrap>
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
const selectedNode = ref<any>(null)
const panelTitle = computed(() => selectedNode.value ? '节点：' + selectedNode.value.label : '请选择左侧节点')
function handleNodeClick(node: any) { selectedNode.value = node }
const treeData = ref<any[]>([
  { id: 'SPC-001', label: '电气类', sort: 1, enabled: true, remark: '电气元件大类', children: [
    { id: 'SPC-001-001', label: '通讯模块', sort: 1, enabled: true, children: [
      { id: 'SPC-001-001-001', label: '485 端子', sort: 1, enabled: true },
      { id: 'SPC-001-001-002', label: 'CAN 端子', sort: 2, enabled: true },
      { id: 'SPC-001-001-003', label: '工业以太网模块', sort: 3, enabled: true },
    ] },
    { id: 'SPC-001-002', label: '控制模块', sort: 2, enabled: true, children: [
      { id: 'SPC-001-002-001', label: 'PLC', sort: 1, enabled: true, children: [
        { id: 'SPC-001-002-001-001', label: '西门子 CPU 1212C', sort: 1, enabled: true },
        { id: 'SPC-001-002-001-002', label: '三菱 FX5U', sort: 2, enabled: true },
      ] },
      { id: 'SPC-001-002-002', label: '驱动器', sort: 2, enabled: true },
      { id: 'SPC-001-002-003', label: 'HMI', sort: 3, enabled: true },
    ] },
    { id: 'SPC-001-003', label: '操作元件', sort: 3, enabled: true, children: [
      { id: 'SPC-001-003-001', label: '急停按钮', sort: 1, enabled: true },
      { id: 'SPC-001-003-002', label: '指示灯', sort: 2, enabled: true },
    ] },
  ] },
  { id: 'SPC-002', label: '机械类', sort: 2, enabled: true, remark: '机械配件大类', children: [
    { id: 'SPC-002-001', label: '主轴', sort: 1, enabled: true, children: [
      { id: 'SPC-002-001-001', label: '轴承', sort: 1, enabled: true, children: [
        { id: 'SPC-002-001-001-001', label: 'NSK 7014C', sort: 1, enabled: true },
        { id: 'SPC-002-001-001-002', label: 'SKF 6206', sort: 2, enabled: true },
      ] },
      { id: 'SPC-002-001-002', label: '密封圈', sort: 2, enabled: true },
    ] },
    { id: 'SPC-002-002', label: '导轨', sort: 2, enabled: true, children: [
      { id: 'SPC-002-002-001', label: '直线导轨', sort: 1, enabled: true },
      { id: 'SPC-002-002-002', label: '丝杆螺母', sort: 2, enabled: true },
    ] },
    { id: 'SPC-002-003', label: '末端执行器', sort: 3, enabled: true, children: [
      { id: 'SPC-002-003-001', label: '吸盘', sort: 1, enabled: true },
      { id: 'SPC-002-003-002', label: '夹爪', sort: 2, enabled: true },
      { id: 'SPC-002-003-003', label: '点胶针头', sort: 3, enabled: true },
    ] },
  ] },
  { id: 'SPC-003', label: '气动类', sort: 3, enabled: true, children: [
    { id: 'SPC-003-001', label: '气缸', sort: 1, enabled: true },
    { id: 'SPC-003-002', label: '电磁阀', sort: 2, enabled: true },
    { id: 'SPC-003-003', label: '气管接头', sort: 3, enabled: true, children: [
      { id: 'SPC-003-003-001', label: '快插接头', sort: 1, enabled: true },
      { id: 'SPC-003-003-002', label: '直角接头', sort: 2, enabled: true },
    ] },
  ] },
  { id: 'SPC-004', label: '液压类', sort: 4, enabled: true, children: [
    { id: 'SPC-004-001', label: '液压油', sort: 1, enabled: true, children: [
      { id: 'SPC-004-001-001', label: '46# 抗磨液压油', sort: 1, enabled: true },
      { id: 'SPC-004-001-002', label: '32# 抗磨液压油', sort: 2, enabled: true },
    ] },
    { id: 'SPC-004-002', label: '滤芯', sort: 2, enabled: true },
  ] },
  { id: 'SPC-005', label: '耗材类', sort: 5, enabled: true, children: [
    { id: 'SPC-005-001', label: '油液', sort: 1, enabled: true, children: [
      { id: 'SPC-005-001-001', label: '润滑脂', sort: 1, enabled: true, children: [
        { id: 'SPC-005-001-001-001', label: 'NSK PS-2', sort: 1, enabled: true },
        { id: 'SPC-005-001-001-002', label: 'SKF LGMT2', sort: 2, enabled: true },
      ] },
      { id: 'SPC-005-001-002', label: '冷却液', sort: 2, enabled: true },
    ] },
    { id: 'SPC-005-002', label: '清洁剂', sort: 2, enabled: true },
    { id: 'SPC-005-003', label: '抹布手套', sort: 3, enabled: true },
  ] },
])
</script>
<style scoped>
.spare-part-category-tree-page { padding: 12px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
.title { font-weight: bold; font-size: 14px; }
.tree-node { flex: 1; display: flex; justify-content: space-between; align-items: center; padding-right: 8px; }
.node-meta { font-size: 12px; color: #909399; }
.empty-tip { text-align: center; color: #909399; padding: 50px 0; }
.form { max-width: 600px; }
</style>
