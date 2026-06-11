<template>
  <div class="mdm-main">
    <!-- 左侧：8 类基础资料（接口清单口径） -->
    <div class="mdm-sidebar">
      <div class="mdm-sidebar-header">
        <Icon icon="ep:menu" :size="14" />
        <span>基础资料（金蝶→MOM）</span>
      </div>
      <el-tree
        :data="treeData"
        :props="{ children: 'children', label: 'name' }"
        node-key="key"
        highlight-current
        :current-node-key="currentKey"
        :expand-on-click-node="false"
        @node-click="onTreeClick"
      >
        <template #default="{ node, data }">
          <span class="mdm-tree-node">
            <Icon v-if="data.icon" :icon="data.icon" :size="13" :color="node.isCurrent ? '#fff' : '#6b7280'" />
            <span class="mdm-tree-text">{{ data.name }}{{ data.star ? ' ⭐' : '' }}</span>
            <span class="mdm-tree-count">{{ data.count }}</span>
          </span>
        </template>
      </el-tree>
      <div class="mdm-sidebar-tip">
        <Icon icon="ep:info-filled" :size="12" color="#9ca3af" />
        仓位不对接（接口清单 #4），不在此维护
      </div>
    </div>

    <!-- 右侧列表 -->
    <div class="mdm-content">
      <div class="mdm-breadcrumb">
        <span class="mdm-breadcrumb-domain">静态主数据</span>
        <Icon icon="ep:arrow-right" :size="12" color="#c0c4cc" />
        <span class="mdm-breadcrumb-sub">{{ currentCategory.name }}</span>
        <div class="mdm-breadcrumb-right">
          <el-tag size="small" type="info" effect="plain">共 {{ filteredRows.length }} 条</el-tag>
        </div>
      </div>

      <div class="mdm-filter">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索编码 / 名称"
          clearable
          style="width: 260px"
          :prefix-icon="Search"
        />
        <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px">
          <el-option label="已审核" value="已审核" />
          <el-option label="未审核" value="未审核" />
        </el-select>
        <el-button @click="onReset">重置</el-button>
      </div>

      <div class="mdm-table-wrap">
        <el-table
          :data="pagedRows"
          stripe
          border
          row-key="id"
          height="100%"
          highlight-current-row
          @row-click="onRowClick"
        >
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column
            v-for="col in currentCategory.listColumns"
            :key="col"
            :label="col"
            :min-width="col.includes('名称') ? 150 : 110"
            show-overflow-tooltip
          >
            <template #default="{ row }">{{ row.data[col] || '—' }}</template>
          </el-table-column>
          <el-table-column label="数据源" width="80" align="center">
            <template #default="{ row }">
              <el-tag size="small" effect="plain">{{ row.source }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="90" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.status === '已审核'" size="small" type="success" effect="dark">✓ 已审核</el-tag>
              <el-tag v-else size="small" type="warning" effect="plain">待审核</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="syncTime" label="同步时间" width="150" align="center" />
          <el-table-column label="操作" width="80" fixed="right" align="center">
            <template #default="{ row }">
              <el-button text size="small" type="primary" @click.stop="onRowClick(row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="mdm-pager">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          :total="filteredRows.length"
          layout="total, sizes, prev, pager, next"
          background
        />
      </div>
    </div>

    <!-- 详情抽屉 -->
    <el-drawer v-model="drawerVisible" :size="currentRow?.details ? '70%' : '52%'" :with-header="false" destroy-on-close>
      <div class="mdm-drawer" v-if="currentRow">
        <div class="mdm-drawer-header">
          <span class="mdm-drawer-title">
            <Icon :icon="currentCategory.icon" :size="16" />
            {{ currentCategory.name }} · {{ currentRow.name }}
          </span>
          <div class="mdm-drawer-actions">
            <el-tag size="small" type="info" effect="plain">来源：{{ currentRow.source }}</el-tag>
            <el-button size="small" @click="drawerVisible = false">关闭</el-button>
          </div>
        </div>
        <div class="mdm-drawer-body">
          <div class="static-detail">
            <el-descriptions :column="3" border size="small">
              <el-descriptions-item v-for="f in currentCategory.fields" :key="f" :label="f">
                {{ currentRow.data[f] || '—' }}
              </el-descriptions-item>
              <el-descriptions-item label="同步时间">{{ currentRow.syncTime }}</el-descriptions-item>
            </el-descriptions>
            <div v-for="blk in currentRow.details || []" :key="blk.title" class="static-detail-block">
              <div class="static-detail-title">
                <Icon icon="ep:list" :size="14" />
                {{ blk.title }}
                <span class="static-detail-count">{{ blk.rows.length }} 行</span>
              </div>
              <el-table :data="blk.rows" border stripe size="small">
                <el-table-column
                  v-for="f in blk.fields"
                  :key="f"
                  :prop="f"
                  :label="f"
                  :min-width="f.includes('编码') ? 130 : f.includes('名称') ? 140 : 90"
                  show-overflow-tooltip
                />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { Icon } from '@/components/Icon'
import { staticCategories, type StaticRow } from '../static-data'

defineOptions({ name: 'StaticPanel' })

const treeData = computed(() =>
  staticCategories.map((c) => ({
    key: c.key,
    name: c.name,
    icon: c.icon,
    star: c.star,
    count: c.rows.length
  }))
)

const currentKey = ref(staticCategories[0].key)

const onTreeClick = (data: any) => {
  currentKey.value = data.key
  currentPage.value = 1
  drawerVisible.value = false
}

const currentCategory = computed(
  () => staticCategories.find((c) => c.key === currentKey.value) || staticCategories[0]
)

const searchKeyword = ref('')
const filterStatus = ref('')

const filteredRows = computed(() => {
  let rows = currentCategory.value.rows
  if (searchKeyword.value) {
    const kw = searchKeyword.value.trim().toLowerCase()
    rows = rows.filter(
      (r) =>
        r.code.toLowerCase().includes(kw) ||
        r.name.toLowerCase().includes(kw) ||
        Object.values(r.data).some((v) => String(v).toLowerCase().includes(kw))
    )
  }
  if (filterStatus.value) {
    rows = rows.filter((r) => r.status === filterStatus.value)
  }
  return rows
})

const onReset = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
}

const currentPage = ref(1)
const pageSize = ref(20)
const pagedRows = computed(() =>
  filteredRows.value.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
)

const drawerVisible = ref(false)
const currentRow = ref<StaticRow | null>(null)

const onRowClick = (row: StaticRow) => {
  currentRow.value = row
  drawerVisible.value = true
}
</script>

<style lang="scss" scoped>
@use './panel-shared.scss';

.mdm-sidebar-tip {
  margin-top: 12px;
  padding: 8px;
  font-size: 11.5px;
  color: #9ca3af;
  display: flex;
  align-items: flex-start;
  gap: 4px;
  border-top: 1px dashed #f1f5f9;
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

.static-detail {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.static-detail-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;

  .static-detail-count {
    font-size: 11.5px;
    font-weight: 400;
    color: #9ca3af;
  }
}
</style>
