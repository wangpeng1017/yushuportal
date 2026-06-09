<template>
  <div class="mdm-app">
    <!-- 独立应用顶栏（仿 EAM 顶栏） -->
    <div class="mdm-appbar">
      <div class="mdm-appbar-left">
        <div class="mdm-appbar-logo">
          <span class="mdm-app-icon">
            <Icon icon="ep:files" :size="18" color="#fff" />
          </span>
          <div class="mdm-appbar-title">
            <span class="title-main">MDM 主数据管理</span>
          </div>
        </div>
      </div>
      <div class="mdm-appbar-right">
        <el-input
          v-model="globalKeyword"
          placeholder="全局搜索物料/供应商/客户..."
          size="small"
          clearable
          style="width: 240px"
          :prefix-icon="Search"
        />
        <el-tooltip content="数据同步状态">
          <span class="mdm-appbar-status">
            <span class="dot dot-green"></span>
            ERP 已连接
          </span>
        </el-tooltip>
        <el-tooltip content="通知">
          <el-badge :value="3" :max="99">
            <Icon icon="ep:bell" :size="18" color="#fff" />
          </el-badge>
        </el-tooltip>
        <el-dropdown trigger="click">
          <span class="mdm-appbar-user">
            <el-avatar :size="28" :src="userAvatar" />
            <span>{{ userNickname }}</span>
            <Icon icon="ep:arrow-down" :size="12" color="#fff" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onAction('个人中心', '已打开个人中心')">
                <Icon icon="ep:user" :size="14" /> 个人中心
              </el-dropdown-item>
              <el-dropdown-item @click="onAction('系统设置', '已打开系统设置')">
                <Icon icon="ep:setting" :size="14" /> 系统设置
              </el-dropdown-item>
              <el-dropdown-item divided @click="onLogout">
                <Icon icon="ep:switch-button" :size="14" /> 退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <a class="mdm-appbar-back" @click="onBackPortal">
          <Icon icon="ep:back" :size="14" /> 返回门户
        </a>
      </div>
    </div>

    <!-- 主体区 -->
    <div class="mdm-page">
    <!-- 顶部 Banner -->
    <div class="mdm-banner">
      <div class="mdm-banner-left">
        <div class="mdm-banner-icon">
          <Icon icon="ep:files" :size="36" color="#fff" />
        </div>
        <div>
          <div class="mdm-banner-title">MDM 主数据管理平台</div>
          <div class="mdm-banner-subtitle">企业数据治理 · 跨系统统一主数据 · 数据来源：金蝶云星空 ERP / PLM / MES / WMS</div>
        </div>
      </div>
      <div class="mdm-banner-right">
        <el-button type="primary" :icon="Refresh" @click="onSyncErp">从 ERP 同步主数据</el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="mdm-stats">
      <div class="mdm-stat-card" v-for="s in statCards" :key="s.label" :style="{ borderTopColor: s.color }">
        <div class="mdm-stat-value" :style="{ color: s.color }">{{ s.value.toLocaleString() }}</div>
        <div class="mdm-stat-label">
          <Icon :icon="s.icon" :size="14" :color="s.color" />
          {{ s.label }}
        </div>
      </div>
    </div>

    <!-- 主体：左树 + 右列表 -->
    <div class="mdm-main">
      <!-- 左侧分类树 -->
      <div class="mdm-sidebar">
        <div class="mdm-sidebar-header">
          <Icon icon="ep:menu" :size="14" />
          <span>主数据分类</span>
        </div>
        <el-tree
          ref="treeRef"
          :data="treeData"
          :props="{ children: 'children', label: 'name' }"
          node-key="key"
          :default-expanded-keys="defaultExpandedKeys"
          highlight-current
          :current-node-key="currentKey"
          :expand-on-click-node="false"
          @node-click="onTreeClick"
        >
          <template #default="{ node, data }">
            <span class="mdm-tree-node">
              <Icon v-if="data.icon" :icon="data.icon" :size="13" :color="node.isCurrent ? '#fff' : '#6b7280'" />
              <span class="mdm-tree-text">{{ data.name }}</span>
              <span v-if="data.count !== undefined" class="mdm-tree-count">{{ data.count }}</span>
            </span>
          </template>
        </el-tree>
      </div>

      <!-- 右侧主区 -->
      <div class="mdm-content">
        <!-- 面包屑 + 数据源标识 -->
        <div class="mdm-breadcrumb">
          <span class="mdm-breadcrumb-domain">{{ currentDomain }}</span>
          <Icon icon="ep:arrow-right" :size="12" color="#c0c4cc" />
          <span class="mdm-breadcrumb-sub">{{ currentSubName }}</span>
          <div class="mdm-breadcrumb-right">
            <el-tag size="small" type="info" effect="plain">共 {{ filteredRows.length }} 条</el-tag>
          </div>
        </div>

        <!-- 快捷过滤栏 -->
        <div class="mdm-filter">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索编码 / 名称 / 规格"
            clearable
            style="width: 280px"
            :prefix-icon="Search"
          />
          <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px">
            <el-option label="已审核" value="已审核" />
            <el-option label="未审核" value="未审核" />
            <el-option label="已禁用" value="已禁用" />
          </el-select>
          <el-select v-model="filterSource" placeholder="数据源" clearable style="width: 130px">
            <el-option label="ERP" value="ERP" />
            <el-option label="PLM" value="PLM" />
            <el-option label="EAM" value="EAM" />
            <el-option label="QMS" value="QMS" />
            <el-option label="CRM" value="CRM" />
            <el-option label="WMS" value="WMS" />
            <el-option label="手工" value="手工" />
          </el-select>
          <el-button @click="onReset">重置</el-button>
        </div>

        <!-- 数据列表 -->
        <div class="mdm-table-wrap">
          <el-table
            :data="pagedRows"
            stripe
            border
            row-key="id"
            height="100%"
            highlight-current-row
            @selection-change="(v) => (selectedRows = v)"
            @row-click="onRowClick"
          >
            <el-table-column type="selection" width="44" />
            <el-table-column type="index" label="#" width="50" align="center" />
            <el-table-column
              v-for="col in currentColumns"
              :key="col.prop"
              :prop="col.prop"
              :label="col.label"
              :width="col.width"
              :min-width="col.width ? undefined : 110"
              show-overflow-tooltip
            />
            <el-table-column label="数据源" width="90" align="center">
              <template #default="{ row }">
                <el-tag size="small" effect="plain">{{ row.source }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="90" align="center">
              <template #default="{ row }">
                <el-tag
                  v-if="row.status === '已审核'"
                  size="small"
                  type="success"
                  effect="dark"
                >✓ 已审核</el-tag>
                <el-tag
                  v-else-if="row.status === '未审核'"
                  size="small"
                  type="warning"
                  effect="plain"
                >待审核</el-tag>
                <el-tag v-else size="small" type="danger" effect="plain">已禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right" align="center">
              <template #default="{ row }">
                <el-button text size="small" type="primary" @click.stop="onRowClick(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="mdm-pager">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredRows.length"
            layout="total, sizes, prev, pager, next, jumper"
            background
          />
        </div>
      </div>
    </div>

    <!-- 详情抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :size="drawerSize"
      :with-header="false"
      destroy-on-close
    >
      <div class="mdm-drawer">
        <div class="mdm-drawer-header">
          <span class="mdm-drawer-title">
            <Icon :icon="drawerIcon" :size="16" />
            {{ drawerTitle }}
          </span>
          <div class="mdm-drawer-actions">
            <el-tag size="small" type="info" effect="plain">来源：{{ currentRow?.source }}</el-tag>
            <el-button size="small" @click="drawerVisible = false">关闭</el-button>
          </div>
        </div>
        <div class="mdm-drawer-body">
          <MaterialDetail v-if="drawerType === 'material'" :material="currentRow" />
          <BomDetail v-else-if="drawerType === 'bom'" :bom="currentRow" />
          <GenericDetail
            v-else
            :row="currentRow"
            :columns="currentColumns"
            :title="drawerTitle"
          />
        </div>
      </div>
    </el-drawer>

    </div><!-- /mdm-page -->

    <!-- ERP 同步进度对话框 -->
    <el-dialog
      v-model="syncVisible"
      title="从 ERP 同步主数据"
      width="480"
      :close-on-click-modal="false"
      :show-close="!syncing"
    >
      <div class="mdm-sync">
        <el-radio-group v-model="syncSource" :disabled="syncing">
          <el-radio value="ERP">金蝶云星空 ERP</el-radio>
          <el-radio value="PLM">PLM 系统</el-radio>
          <el-radio value="MES">MES 生产系统</el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="syncDomains" :disabled="syncing" style="margin-top:16px">
          <el-checkbox value="material">物料档案</el-checkbox>
          <el-checkbox value="bom">BOM 物料清单</el-checkbox>
          <el-checkbox value="supplier">供应商</el-checkbox>
          <el-checkbox value="customer">客户</el-checkbox>
          <el-checkbox value="warehouse">仓库</el-checkbox>
        </el-checkbox-group>
        <el-progress
          v-if="syncing || syncProgress === 100"
          :percentage="syncProgress"
          :status="syncProgress === 100 ? 'success' : ''"
          style="margin-top: 18px"
        />
        <div v-if="syncMsg" class="mdm-sync-msg">{{ syncMsg }}</div>
      </div>
      <template #footer>
        <el-button :disabled="syncing" @click="syncVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="syncing"
          :disabled="syncing || syncDomains.length === 0"
          @click="startSync"
        >{{ syncing ? '同步中…' : '开始同步' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import { Icon } from '@/components/Icon'
import {
  mdmCategories,
  materialGroupTree,
  dataMap,
  overviewStats,
  type MdmCategory
} from './mock-data'
import MaterialDetail from './components/MaterialDetail.vue'
import BomDetail from './components/BomDetail.vue'
import GenericDetail from './components/GenericDetail.vue'

import { useRouter } from 'vue-router'
import * as authUtil from '@/utils/auth'
import { useUserStore } from '@/store/modules/user'
import defaultAvatar from '@/assets/imgs/unitree-g1.png'

defineOptions({ name: 'MdmApp' })

const router = useRouter()
const userStore = useUserStore()
const userAvatar = computed(() => userStore.user?.avatar || defaultAvatar)
const userNickname = computed(() => userStore.user?.nickname || '宇树科技')
const globalKeyword = ref('')

const onBackPortal = () => {
  router.push('/index')
}

const onLogout = () => {
  ElMessageBox.confirm('确定要退出 MDM 主数据管理并清除登录态吗？', '退出登录', {
    confirmButtonText: '退出',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    authUtil.removeToken()
    location.href = '/login'
  }).catch(() => {})
}

// 顶部统计卡片
const statCards = [
  { label: '物料档案', value: overviewStats.materials, icon: 'ep:files', color: '#1890FF' },
  { label: '供应商', value: overviewStats.suppliers, icon: 'ep:truck', color: '#52C41A' },
  { label: '客户', value: overviewStats.customers, icon: 'ep:user-filled', color: '#FA8C16' },
  { label: '设备档案', value: overviewStats.devices, icon: 'ep:tools', color: '#722ED1' },
  { label: '耗材种类', value: overviewStats.consumables, icon: 'ep:goblet', color: '#13C2C2' },
  { label: '今日同步', value: overviewStats.syncedToday, icon: 'ep:refresh', color: '#EB2F96' }
]

// 树结构：用 mdmCategories；物料分组域单独挂分组树
const treeData = computed(() => {
  return mdmCategories.map((cat) => {
    if (cat.key === 'material') {
      // 在物料分组下挂分组树
      const newChildren = (cat.children || []).map((c) => {
        if (c.key === 'materialGroup') {
          return { ...c, children: materialGroupTree as unknown as MdmCategory[] }
        }
        return c
      })
      return { ...cat, children: newChildren }
    }
    return cat
  })
})

const defaultExpandedKeys = ['material', 'device', 'supplyChain', 'warehouse', 'basic', 'integration']

// 当前选中子分类 key
const currentKey = ref('materialList')
const currentParentKey = ref('material')

const onTreeClick = (data: any) => {
  // 只有叶子才切数据（dataMap 中有的）
  if (data.key in dataMap) {
    currentKey.value = data.key
    // 找到上级
    for (const cat of mdmCategories) {
      if (cat.children?.find((c) => c.key === data.key)) {
        currentParentKey.value = cat.key
        break
      }
    }
    currentPage.value = 1
    drawerVisible.value = false
  }
}

const currentDomain = computed(() => {
  return mdmCategories.find((c) => c.key === currentParentKey.value)?.name || ''
})

const currentSubName = computed(() => {
  for (const cat of mdmCategories) {
    const found = cat.children?.find((c) => c.key === currentKey.value)
    if (found) return found.name
  }
  return ''
})

// 当前列表数据 + 列
const currentRows = computed(() => dataMap[currentKey.value]?.rows || [])
const currentColumns = computed(() => dataMap[currentKey.value]?.columns || [])

// 过滤
const searchKeyword = ref('')
const filterStatus = ref('')
const filterSource = ref('')

const filteredRows = computed(() => {
  let rows = currentRows.value
  if (searchKeyword.value) {
    const kw = searchKeyword.value.trim().toLowerCase()
    rows = rows.filter((r) =>
      [r.code, r.name, r.spec, r.version, r.parentName].some((v) =>
        String(v || '').toLowerCase().includes(kw)
      )
    )
  }
  if (filterStatus.value) {
    rows = rows.filter((r) => r.status === filterStatus.value)
  }
  if (filterSource.value) {
    rows = rows.filter((r) => r.source === filterSource.value)
  }
  return rows
})

const onReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterSource.value = ''
}

// 分页
const currentPage = ref(1)
const pageSize = ref(20)
const pagedRows = computed(() =>
  filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

// 选择
const selectedRows = ref<any[]>([])

// 抽屉
const drawerVisible = ref(false)
const drawerSize = computed(() => (currentKey.value === 'bom' ? '70%' : '52%'))
const currentRow = ref<any>(null)
const drawerType = computed(() => {
  if (currentKey.value === 'materialList') return 'material'
  if (currentKey.value === 'bom') return 'bom'
  return 'generic'
})
const drawerTitle = computed(() => {
  if (!currentRow.value) return ''
  if (drawerType.value === 'material') return `物料档案 · ${currentRow.value.name}`
  if (drawerType.value === 'bom') return `BOM · ${currentRow.value.parentName}`
  return `${currentSubName.value} · ${currentRow.value.name || currentRow.value.code}`
})
const drawerIcon = computed(() => {
  if (drawerType.value === 'material') return 'ep:files'
  if (drawerType.value === 'bom') return 'ep:connection'
  return 'ep:document'
})

const onRowClick = (row: any) => {
  currentRow.value = row
  drawerVisible.value = true
}

// 通用操作（toast）
const onAction = (name: string, msg?: string) => {
  ElMessage.success(msg || `已执行：${name}`)
}

// 导入：弹文件选择
const onImport = () => {
  ElMessageBox.confirm(
    '请选择 Excel/CSV 文件，系统将解析并预览。\nDemo 模式下将模拟导入 50 条记录。',
    '导入主数据',
    {
      confirmButtonText: '模拟导入',
      cancelButtonText: '取消',
      type: 'info'
    }
  )
    .then(() => {
      const loading = ElMessage({
        message: '正在解析文件...',
        type: 'info',
        duration: 800
      })
      setTimeout(() => {
        loading.close?.()
        ElMessage.success('导入完成：成功 48 条，失败 2 条（编码冲突）')
      }, 900)
    })
    .catch(() => {})
}

// 导出
const onExport = () => {
  const tip = ElMessage({ message: '正在生成 Excel...', type: 'info', duration: 1200 })
  setTimeout(() => {
    tip.close?.()
    ElMessage.success(`已导出 mdm-${currentKey.value}-${dateStr()}.xlsx（共 ${filteredRows.value.length} 条）`)
  }, 1300)
}

const dateStr = () => {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

// ERP 同步
const syncVisible = ref(false)
const syncSource = ref('ERP')
const syncDomains = ref(['material', 'bom'])
const syncing = ref(false)
const syncProgress = ref(0)
const syncMsg = ref('')

const onSyncErp = () => {
  syncVisible.value = true
  syncing.value = false
  syncProgress.value = 0
  syncMsg.value = ''
}

const startSync = () => {
  syncing.value = true
  syncProgress.value = 0
  syncMsg.value = '正在连接 ' + syncSource.value + '...'
  const timer = setInterval(() => {
    syncProgress.value += Math.floor(Math.random() * 18) + 8
    if (syncProgress.value >= 100) {
      syncProgress.value = 100
      clearInterval(timer)
      syncing.value = false
      syncMsg.value = `同步完成：物料 156 条 / BOM 32 条 / 供应商 8 条`
      setTimeout(() => {
        syncVisible.value = false
        ElMessage.success(`从 ${syncSource.value} 同步成功，共更新 ${syncDomains.value.length} 个数据域`)
      }, 1100)
    } else {
      syncMsg.value = '正在同步：' + syncDomains.value.map((d) => domainName(d)).join('、')
    }
  }, 280)
}

const domainName = (k: string) => {
  const map: Record<string, string> = {
    material: '物料档案',
    bom: 'BOM',
    supplier: '供应商',
    customer: '客户',
    warehouse: '仓库'
  }
  return map[k] || k
}
</script>

<style lang="scss" scoped>
.mdm-app {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f4f5f7;
  overflow: hidden;
}

/* ========== 独立应用顶栏 ========== */
.mdm-appbar {
  height: 56px;
  flex-shrink: 0;
  background: linear-gradient(90deg, #001D44 0%, #00405C 50%, #1A5A70 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 29, 68, 0.18);
  position: relative;
  z-index: 100;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent 0%, rgba(79, 172, 254, 0.05) 50%, transparent 100%);
    pointer-events: none;
  }
}

.mdm-appbar-left {
  display: flex;
  align-items: center;
  gap: 32px;
  flex: 1;
}

.mdm-appbar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.mdm-app-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 12px rgba(79, 172, 254, 0.4);
}

.mdm-appbar-title {
  display: flex;
  flex-direction: column;
  line-height: 1.2;

  .title-main {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.3px;
  }

  .title-sub {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.55);
    margin-top: 2px;
  }
}

.mdm-appbar-nav {
  display: flex;
  gap: 4px;
  align-items: center;
  height: 100%;
}

.nav-item {
  padding: 6px 14px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  position: relative;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.08);
  }

  &.active {
    color: #fff;
    font-weight: 500;
    background: rgba(79, 172, 254, 0.18);

    &::after {
      content: '';
      position: absolute;
      bottom: -19px;
      left: 14px;
      right: 14px;
      height: 2px;
      background: linear-gradient(90deg, #4FACFE 0%, #00F2FE 100%);
      border-radius: 2px;
    }
  }
}

.mdm-appbar-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mdm-appbar-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  padding: 4px 10px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .dot-green {
    background: #52c41a;
    box-shadow: 0 0 6px #52c41a;
    animation: pulse 2s ease-in-out infinite;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.mdm-appbar-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12.5px;
  color: #fff;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(79, 172, 254, 0.6);
    color: #fff;
  }
}

.mdm-appbar-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #fff;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
  }
}

/* ========== 主体页 ========== */
.mdm-page {
  flex: 1;
  min-height: 0;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: auto;
}

.mdm-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1A5A70 0%, #00405C 50%, #001D44 100%);
  border-radius: 8px;
  padding: 18px 24px;
  color: #fff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%; right: -5%;
    width: 320px;
    height: 320px;
    background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
    pointer-events: none;
  }
}

.mdm-banner-left {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1;
}

.mdm-banner-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.mdm-banner-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 4px;
}

.mdm-banner-subtitle {
  font-size: 12.5px;
  color: rgba(255, 255, 255, 0.75);
}

.mdm-banner-right {
  z-index: 1;
}

.mdm-stats {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
}

.mdm-stat-card {
  background: #fff;
  border-radius: 6px;
  padding: 12px 16px;
  border-top: 3px solid;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.mdm-stat-value {
  font-size: 22px;
  font-weight: 600;
  font-family: Consolas, Monaco, monospace;
  line-height: 1.2;
}

.mdm-stat-label {
  margin-top: 4px;
  font-size: 12px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 4px;
}

.mdm-main {
  display: flex;
  gap: 12px;
  flex: 1;
  min-height: 0;
}

.mdm-sidebar {
  width: 248px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 6px;
  padding: 12px 8px 16px;
  overflow-y: auto;
  height: 100%;
}

.mdm-sidebar-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 8px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 6px;
}

:deep(.el-tree) {
  background: transparent;

  .el-tree-node__content {
    height: 32px;
    border-radius: 4px;
  }

  .el-tree-node.is-current > .el-tree-node__content {
    background: linear-gradient(90deg, #1890ff 0%, #4cb1ff 100%);
    color: #fff;

    .mdm-tree-text,
    .mdm-tree-count {
      color: #fff;
    }
  }
}

.mdm-tree-node {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  flex: 1;
}

.mdm-tree-text {
  flex: 1;
  color: #374151;
}

.mdm-tree-count {
  font-size: 11px;
  color: #9ca3af;
  font-family: Consolas, Monaco, monospace;
}

.mdm-content {
  flex: 1;
  background: #fff;
  border-radius: 6px;
  padding: 14px 16px 12px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.mdm-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 10px;

  .mdm-breadcrumb-domain {
    color: #6b7280;
  }

  .mdm-breadcrumb-sub {
    color: #1f2937;
    font-weight: 500;
  }

  .mdm-breadcrumb-right {
    margin-left: auto;
  }
}

.mdm-filter {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.mdm-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.mdm-table-wrap {
  flex: 1;
  min-height: 360px;
  overflow: hidden;
}

.mdm-pager {
  padding-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.mdm-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.mdm-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-bottom: 1px solid #ebeef5;
  background: #f8fafc;
}

.mdm-drawer-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.mdm-drawer-actions {
  display: flex;
  gap: 6px;
}

.mdm-drawer-body {
  flex: 1;
  overflow-y: auto;
}

.mdm-sync {
  font-size: 14px;
}

.mdm-sync-msg {
  margin-top: 8px;
  font-size: 12.5px;
  color: #6b7280;
}
</style>
