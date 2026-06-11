<template>
  <div class="mdm-main">
    <!-- 左侧：模块 → 接口树 -->
    <div class="mdm-sidebar">
      <div class="mdm-sidebar-header">
        <Icon icon="ep:tickets" :size="14" />
        <span>业务单据（{{ bizInterfaces.length }} 个接口）</span>
      </div>
      <el-tree
        :data="treeData"
        :props="{ children: 'children', label: 'name' }"
        node-key="key"
        :default-expanded-keys="expandedKeys"
        highlight-current
        :current-node-key="currentKey"
        :expand-on-click-node="false"
        @node-click="onTreeClick"
      >
        <template #default="{ node, data }">
          <span class="mdm-tree-node" :class="{ disabled: data.disabled }">
            <Icon v-if="data.icon" :icon="data.icon" :size="13" :color="node.isCurrent ? '#fff' : '#6b7280'" />
            <span class="mdm-tree-text">{{ data.name }}</span>
            <span v-if="data.count !== undefined" class="mdm-tree-count">{{ data.count }}</span>
          </span>
        </template>
      </el-tree>
    </div>

    <!-- 右侧 -->
    <div class="mdm-content">
      <!-- 接口信息卡 -->
      <div class="iface-card" v-if="currentMeta">
        <div class="iface-card-main">
          <span class="iface-name">{{ currentMeta.bizForm }}</span>
          <el-tag size="small" :type="dirTagType(currentMeta)" effect="dark">{{ currentMeta.direction || '不传递' }}</el-tag>
          <el-tag v-if="currentMeta.kingdeeForm && currentMeta.kingdeeForm !== currentMeta.bizForm" size="small" type="info" effect="plain">
            金蝶表单：{{ currentMeta.kingdeeForm }}
          </el-tag>
          <el-tag v-if="currentMeta.upstream" size="small" effect="plain">上游：{{ currentMeta.upstream }}</el-tag>
        </div>
        <div v-if="currentMeta.note" class="iface-note">
          <Icon icon="ep:warning" :size="12" color="#fa8c16" />
          {{ currentMeta.note }}
        </div>
      </div>

      <!-- 过滤栏 -->
      <div class="mdm-filter">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索单据编号 / 物料"
          clearable
          style="width: 240px"
          :prefix-icon="Search"
        />
        <el-select v-model="filterSync" placeholder="同步状态" clearable style="width: 130px">
          <el-option label="已同步" value="已同步" />
          <el-option label="同步失败" value="同步失败" />
          <el-option label="待同步" value="待同步" />
        </el-select>
        <el-button @click="onReset">重置</el-button>
        <div class="mdm-filter-right">
          <el-tag size="small" type="info" effect="plain">共 {{ filteredDocs.length }} 张单据</el-tag>
        </div>
      </div>

      <!-- 单据列表（主表） -->
      <div class="mdm-table-wrap">
        <el-table
          v-if="currentMeta && currentMeta.dirType !== 'NONE'"
          :data="filteredDocs"
          stripe
          border
          row-key="id"
          height="100%"
          highlight-current-row
          @row-click="openDoc"
        >
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="billNo" label="单据编号" width="150">
            <template #default="{ row }">
              <span class="mono">{{ row.billNo }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="billDate" label="单据日期" width="105" align="center" />
          <el-table-column label="传递方向" width="150" align="center">
            <template #default>
              <el-tag size="small" :type="dirTagType(currentMeta)" effect="plain">{{ currentMeta.direction }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="上游单据" min-width="140">
            <template #default="{ row }">
              <span v-if="row.upstreamBillNo" class="mono link" @click.stop="jumpToDoc(row.upstreamDocId)">
                {{ row.upstreamBillNo }}
              </span>
              <span v-else class="muted">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="creator" label="创建人" width="90" align="center" />
          <el-table-column label="明细行" width="70" align="center">
            <template #default="{ row }">{{ (row.details[0] || []).length }}</template>
          </el-table-column>
          <el-table-column label="同步状态" width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small" :type="syncTagType(row.syncStatus)" :effect="row.syncStatus === '已同步' ? 'dark' : 'plain'">
                {{ row.syncStatus }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right" align="center">
            <template #default="{ row }">
              <el-button text size="small" type="primary" @click.stop="openDoc(row)">查看</el-button>
              <el-button
                v-if="row.syncStatus === '同步失败'"
                text
                size="small"
                type="warning"
                @click.stop="onResend(row)"
              >手工重传</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-else description="该接口不传递数据（仅本地核对使用）" />
      </div>
    </div>

    <!-- 单据详情抽屉 -->
    <el-drawer v-model="drawerVisible" size="72%" :with-header="false" destroy-on-close>
      <div class="mdm-drawer" v-if="currentDoc && drawerMeta">
        <div class="mdm-drawer-header">
          <span class="mdm-drawer-title">
            <Icon icon="ep:tickets" :size="16" />
            {{ drawerMeta.bizForm }} · {{ currentDoc.billNo }}
          </span>
          <div class="mdm-drawer-actions">
            <el-button
              v-if="currentDoc.syncStatus === '同步失败'"
              size="small"
              type="warning"
              @click="onResend(currentDoc)"
            >手工重传</el-button>
            <el-button size="small" @click="drawerVisible = false">关闭</el-button>
          </div>
        </div>
        <div class="mdm-drawer-body">
          <BizDocDetail :doc="currentDoc" :meta="drawerMeta" :all-docs="docs" @jump="jumpToDoc" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { Icon } from '@/components/Icon'
import { bizInterfaces, bizModules, type BizInterfaceMeta } from '../erp-schema'
import { bizDocs, type BizDoc } from '../biz-doc-data'
import BizDocDetail from './BizDocDetail.vue'

defineOptions({ name: 'BizDocPanel' })

const MODULE_ICONS: Record<string, string> = {
  生产管理: 'ep:cpu',
  委外管理: 'ep:connection',
  采购管理: 'ep:shopping-cart',
  仓库管理: 'ep:house',
  销售管理: 'ep:sell',
  供应商协同: 'ep:link'
}

// 本地可变副本（手工重传演示用）
const docs = reactive<BizDoc[]>(bizDocs.map((d) => ({ ...d })))

const treeData = computed(() =>
  bizModules.map((m) => ({
    key: 'mod-' + m,
    name: m,
    icon: MODULE_ICONS[m],
    children: bizInterfaces
      .filter((i) => i.module === m)
      .map((i) => ({
        key: String(i.id),
        name: i.bizForm + (i.kingdeeForm && i.kingdeeForm !== i.bizForm ? `（${i.kingdeeForm}）` : ''),
        count: docs.filter((d) => d.interfaceId === i.id).length,
        disabled: i.dirType === 'NONE'
      }))
  }))
)

const expandedKeys = computed(() => bizModules.map((m) => 'mod-' + m))

const currentKey = ref(String(bizInterfaces[0]?.id ?? ''))

const onTreeClick = (data: any) => {
  if (data.key.startsWith('mod-')) return
  currentKey.value = data.key
  drawerVisible.value = false
}

const currentMeta = computed<BizInterfaceMeta | undefined>(() =>
  bizInterfaces.find((i) => String(i.id) === currentKey.value)
)

// 过滤
const searchKeyword = ref('')
const filterSync = ref('')

const filteredDocs = computed(() => {
  let rows = docs.filter((d) => String(d.interfaceId) === currentKey.value)
  if (searchKeyword.value) {
    const kw = searchKeyword.value.trim().toLowerCase()
    rows = rows.filter(
      (d) =>
        d.billNo.toLowerCase().includes(kw) ||
        (d.details[0] || []).some((r) =>
          Object.values(r).some((v) => String(v).toLowerCase().includes(kw))
        )
    )
  }
  if (filterSync.value) {
    rows = rows.filter((d) => d.syncStatus === filterSync.value)
  }
  return rows
})

const onReset = () => {
  searchKeyword.value = ''
  filterSync.value = ''
}

// 详情
const drawerVisible = ref(false)
const currentDoc = ref<BizDoc | null>(null)
const drawerMeta = computed(() =>
  currentDoc.value ? bizInterfaces.find((i) => i.id === currentDoc.value!.interfaceId) : undefined
)

const openDoc = (row: BizDoc) => {
  currentDoc.value = row
  drawerVisible.value = true
}

const jumpToDoc = (docId?: string) => {
  if (!docId) return
  const target = docs.find((d) => d.id === docId)
  if (!target) return
  currentKey.value = String(target.interfaceId)
  currentDoc.value = target
  drawerVisible.value = true
}

// 手工重传（0527 拍板：传递失败可手工重传）
const onResend = (row: BizDoc) => {
  ElMessage.info(`正在向中台重传 ${row.billNo} ...`)
  setTimeout(() => {
    row.syncStatus = '已同步'
    ElMessage.success(`${row.billNo} 重传成功，金蝶已接收（创建人：${row.creator}）`)
  }, 800)
}

const dirTagType = (meta: BizInterfaceMeta) => {
  if (meta.dirType === 'K2M') return 'primary'
  if (meta.dirType === 'M2K') return 'success'
  if (meta.dirType === 'BOTH') return 'warning'
  return 'info'
}

const syncTagType = (s: string) => {
  if (s === '已同步') return 'success'
  if (s === '同步失败') return 'danger'
  return 'warning'
}
</script>

<style lang="scss" scoped>
@use './panel-shared.scss';

.iface-card {
  border: 1px solid #eef2f7;
  background: #f8fafc;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 10px;

  .iface-card-main {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .iface-name {
    font-size: 14.5px;
    font-weight: 600;
    color: #1f2937;
  }

  .iface-note {
    margin-top: 6px;
    font-size: 12px;
    color: #92400e;
    display: flex;
    align-items: flex-start;
    gap: 4px;
    white-space: pre-line;
  }
}

.mdm-filter-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.mono {
  font-family: Consolas, Monaco, monospace;
  font-size: 12.5px;
}

.link {
  color: #1677ff;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}

.muted {
  color: #c0c4cc;
}

.mdm-tree-node.disabled .mdm-tree-text {
  color: #c0c4cc;
}
</style>
