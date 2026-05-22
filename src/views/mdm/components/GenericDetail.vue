<template>
  <div v-if="row" class="generic-detail">
    <div class="gd-header">
      <div class="gd-header-main">
        <span class="gd-code">{{ row.code }}</span>
        <span class="gd-name">{{ row.name }}</span>
      </div>
      <div class="gd-header-meta">
        <el-tag v-if="row.status === '已审核'" type="success" effect="dark" size="small">✓ 已审核</el-tag>
        <el-tag v-else-if="row.status === '未审核'" type="warning" effect="plain" size="small">待审核</el-tag>
        <el-tag v-else type="danger" effect="plain" size="small">已禁用</el-tag>
        <el-tag size="small" effect="plain">数据源：{{ row.source }}</el-tag>
        <span class="gd-updated">最后更新：{{ row.updatedAt }}</span>
      </div>
    </div>

    <div class="gd-section">
      <div class="gd-section-title">
        <span class="gd-dot"></span>详情信息
      </div>
      <div class="gd-grid">
        <div v-for="col in columns" :key="col.prop" class="gd-field">
          <label>{{ col.label }}</label>
          <span>{{ format(row[col.prop]) }}</span>
        </div>
        <!-- 把其他业务字段也展示 -->
        <div v-for="key in extraKeys" :key="key" class="gd-field">
          <label>{{ key }}</label>
          <span>{{ format(row[key]) }}</span>
        </div>
      </div>
    </div>

    <div class="gd-section">
      <div class="gd-section-title">
        <span class="gd-dot" style="background:#52C41A"></span>元数据
      </div>
      <div class="gd-grid">
        <div class="gd-field"><label>记录 ID</label><span>{{ row.id }}</span></div>
        <div class="gd-field"><label>数据源</label><span>{{ row.source }}</span></div>
        <div class="gd-field"><label>状态</label><span>{{ row.status }}</span></div>
        <div class="gd-field"><label>最后更新</label><span>{{ row.updatedAt }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  row: Record<string, any> | null
  columns: Array<{ prop: string; label: string }>
  title: string
}>()

const baseKeys = new Set(['id', 'code', 'name', 'status', 'source', 'updatedAt'])

// 显示 columns 之外的其他业务字段
const extraKeys = computed(() => {
  if (!props.row) return []
  const colProps = new Set(props.columns.map((c) => c.prop))
  return Object.keys(props.row).filter(
    (k) => !baseKeys.has(k) && !colProps.has(k) && typeof props.row![k] !== 'object'
  )
})

const format = (v: any) => {
  if (v === undefined || v === null || v === '') return '/'
  if (typeof v === 'number') return v.toLocaleString()
  if (typeof v === 'boolean') return v ? '是' : '否'
  return String(v)
}
</script>

<style lang="scss" scoped>
.generic-detail {
  padding: 0 4px;
}

.gd-header {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 16px 12px 14px;
  border-bottom: 1px solid #ebeef5;
  z-index: 10;

  .gd-header-main {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 8px;

    .gd-code {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #888;
    }

    .gd-name {
      font-size: 17px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .gd-header-meta {
    display: flex;
    align-items: center;
    gap: 8px;

    .gd-updated {
      margin-left: auto;
      font-size: 12px;
      color: #9ca3af;
    }
  }
}

.gd-section {
  padding: 14px 12px 16px;
  border-bottom: 8px solid #f8fafc;
}

.gd-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 12px;
}

.gd-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #1890ff;
  display: inline-block;
}

.gd-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 24px;
}

.gd-field {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 28px;
  border-bottom: 1px dashed #f1f5f9;
  padding: 4px 0;

  label {
    width: 110px;
    color: #6b7280;
    flex-shrink: 0;
  }

  span {
    color: #1f2937;
    flex: 1;
    word-break: break-all;
  }
}
</style>
