<template>
  <div v-if="bom" class="bom-detail">
    <!-- 头部信息 -->
    <div class="bom-header">
      <div class="bom-header-main">
        <span class="bom-code">{{ bom.version }}</span>
        <span class="bom-name">{{ bom.parentName }}</span>
      </div>
      <div class="bom-header-meta">
        <el-tag v-if="bom.status === '已审核'" type="success" effect="dark" size="small">✓ 已审核</el-tag>
        <el-tag v-else type="warning" effect="plain" size="small">待审核</el-tag>
        <el-tag size="small" effect="plain">{{ bom.bomType }}</el-tag>
        <el-tag size="small" effect="plain">数据源：{{ bom.source }}</el-tag>
        <span class="bom-updated">最后更新：{{ bom.updatedAt }}</span>
      </div>
    </div>

    <!-- BOM 基础信息卡 -->
    <div class="bom-section">
      <div class="bom-section-title">
        <span class="bom-dot" style="background:#1890FF"></span>BOM 基础信息
      </div>
      <div class="bom-grid">
        <div class="bom-field"><label>BOM 版本</label><span>{{ bom.version }}</span></div>
        <div class="bom-field"><label>BOM 分类</label><span>{{ bom.bomType }}</span></div>
        <div class="bom-field"><label>BOM 用途</label><span>{{ bom.usage }}</span></div>
        <div class="bom-field"><label>BOM 分组</label><span>{{ bom.groupName }}</span></div>
        <div class="bom-field"><label>父项物料编码</label><span>{{ bom.parentCode }}</span></div>
        <div class="bom-field"><label>父项物料单位</label><span>{{ bom.parentUnit }}</span></div>
        <div class="bom-field"><label>父项标准工时(h)</label><span class="hi">{{ bom.standardHours }}</span></div>
        <div class="bom-field"><label>子项数</label><span>{{ bom.items.length }} 项（{{ alternateCount }} 替代关系）</span></div>
      </div>
    </div>

    <!-- 子项明细表 -->
    <div class="bom-section">
      <div class="bom-toolbar">
        <div class="bom-section-title">
          <span class="bom-dot" style="background:#722ED1"></span>子项明细
          <el-tag v-if="alternateCount > 0" size="small" type="warning" effect="light" style="margin-left:8px">
            包含 {{ alternateCount }} 组替代料关系
          </el-tag>
        </div>
        <div class="bom-toolbar-actions">
          <el-button size="small" @click="onAction('新增行')">+ 新增行</el-button>
          <el-button size="small" @click="onAction('插入行')">插入行</el-button>
          <el-button size="small" @click="onAction('替代获取')" type="warning" plain>替代获取</el-button>
          <el-button size="small" @click="onAction('替代设置')" type="warning" plain>替代设置</el-button>
          <el-button size="small" @click="onAction('替代删除')" type="danger" plain>替代删除</el-button>
          <el-button size="small" @click="onAction('业务查询')">业务查询</el-button>
          <el-button size="small" @click="onAction('批量填充')">批量填充</el-button>
        </div>
      </div>

      <!-- 自定义表格，渲染替代料关系 -->
      <div class="bom-table-wrap">
        <table class="bom-table">
          <thead>
            <tr>
              <th style="width:64px">项次</th>
              <th style="width:160px">子项物料编码</th>
              <th>子项物料名称</th>
              <th style="width:200px">子项规格型号</th>
              <th style="width:88px">物料属性</th>
              <th style="width:100px">子项类型</th>
              <th style="width:64px">单位</th>
              <th style="width:80px">用量:分子</th>
              <th style="width:80px">用量:分母</th>
              <th style="width:80px">固定损耗</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, idx) in renderItems" :key="idx">
              <tr
                :class="{
                  'is-alternate': item.supply === '替代件',
                  'is-group-start': item.isGroupStart,
                  'has-alternate': item.hasAlternate
                }"
              >
                <td class="bom-td-seq">
                  <span v-if="item.supply === '替代件'" class="seq-alt-mark">↳</span>
                  <span class="seq-num">{{ item.seq }}</span>
                </td>
                <td>
                  <a class="bom-link">{{ item.childCode }}</a>
                </td>
                <td>
                  {{ item.childName }}
                  <el-tooltip
                    v-if="item.hasAlternate && item.supply === '标准件'"
                    content="该项次存在替代料"
                    placement="top"
                  >
                    <span class="alt-flag">🔗</span>
                  </el-tooltip>
                </td>
                <td>{{ item.childSpec || '-' }}</td>
                <td>{{ item.childAttribute }}</td>
                <td>
                  <el-tag
                    v-if="item.supply === '标准件'"
                    size="small"
                    type="primary"
                    effect="plain"
                  >标准件</el-tag>
                  <el-tag
                    v-else
                    size="small"
                    type="warning"
                    effect="dark"
                  >🟡 替代件</el-tag>
                </td>
                <td>{{ item.unit }}</td>
                <td class="bom-td-num">{{ item.qtyNumerator.toFixed(4) }}</td>
                <td class="bom-td-num">{{ item.qtyDenominator.toFixed(4) }}</td>
                <td class="bom-td-num">{{ item.fixedLoss.toFixed(4) }}</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- 替代料规则说明 -->
      <div class="bom-tip">
        💡 <strong>替代料识别规则</strong>：项次（seq）相同的多行属于同一组，第一行是<el-tag size="small" type="primary" effect="plain" style="margin:0 4px">标准件</el-tag>，
        后续行带<el-tag size="small" type="warning" effect="dark" style="margin:0 4px">🟡 替代件</el-tag>徽章并向右缩进，发料时可任选一项使用。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus'
import type { BomRecord, BomItem } from '../mock-data'

const props = defineProps<{
  bom: BomRecord | null
}>()

interface RenderItem extends BomItem {
  isGroupStart: boolean
  hasAlternate: boolean
}

// 按项次重新组织：相同 seq 标准件先行，替代件紧随其后
const renderItems = computed<RenderItem[]>(() => {
  if (!props.bom) return []
  const groups = new Map<number, BomItem[]>()
  for (const it of props.bom.items) {
    if (!groups.has(it.seq)) groups.set(it.seq, [])
    groups.get(it.seq)!.push(it)
  }
  // 按 seq 升序
  const sortedSeqs = Array.from(groups.keys()).sort((a, b) => a - b)
  const result: RenderItem[] = []
  for (const seq of sortedSeqs) {
    const group = groups.get(seq)!
    // 组内：标准件在前，替代件在后
    const standards = group.filter((g) => g.supply === '标准件')
    const alternates = group.filter((g) => g.supply === '替代件')
    const ordered = [...standards, ...alternates]
    const hasAlt = alternates.length > 0
    ordered.forEach((it, i) => {
      result.push({
        ...it,
        isGroupStart: i === 0,
        hasAlternate: hasAlt
      })
    })
  }
  return result
})

const alternateCount = computed(() => {
  if (!props.bom) return 0
  const seqs = new Set<number>()
  for (const it of props.bom.items) {
    if (it.supply === '替代件') seqs.add(it.seq)
  }
  return seqs.size
})

const onAction = (name: string) => {
  ElMessage.success(`Demo 模式：已模拟执行「${name}」`)
}
</script>

<style lang="scss" scoped>
.bom-detail {
  padding: 0 4px;
}

.bom-header {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 16px 12px 14px;
  border-bottom: 1px solid #ebeef5;
  z-index: 10;

  .bom-header-main {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 8px;

    .bom-code {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #888;
    }

    .bom-name {
      font-size: 17px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .bom-header-meta {
    display: flex;
    align-items: center;
    gap: 8px;

    .bom-updated {
      margin-left: auto;
      font-size: 12px;
      color: #9ca3af;
    }
  }
}

.bom-section {
  padding: 14px 12px 16px;
  border-bottom: 8px solid #f8fafc;
}

.bom-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 12px;
}

.bom-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.bom-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 24px;
}

.bom-field {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 28px;
  border-bottom: 1px dashed #f1f5f9;
  padding: 2px 0;

  label {
    width: 130px;
    color: #6b7280;
    flex-shrink: 0;
  }

  span {
    color: #1f2937;
    flex: 1;
  }

  .hi {
    color: #d4380d;
    font-weight: 600;
  }
}

.bom-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 8px;

  .bom-toolbar-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }
}

.bom-table-wrap {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: auto;
  max-height: 480px;
}

.bom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12.5px;

  thead {
    position: sticky;
    top: 0;
    background: #f5f7fa;
    z-index: 1;
  }

  th {
    text-align: left;
    padding: 8px 10px;
    font-weight: 500;
    color: #303133;
    border-bottom: 1px solid #ebeef5;
    background: #f5f7fa;
  }

  td {
    padding: 8px 10px;
    border-bottom: 1px solid #f3f4f6;
    color: #1f2937;
    vertical-align: middle;
  }

  tr:hover td {
    background: #f9fafb;
  }

  .bom-td-num {
    text-align: right;
    font-family: Consolas, Monaco, monospace;
  }

  .bom-td-seq {
    text-align: center;
    font-family: Consolas, Monaco, monospace;
    color: #6b7280;
    position: relative;
  }

  .seq-alt-mark {
    color: #fa8c16;
    font-weight: 700;
    margin-right: 2px;
  }

  .bom-link {
    color: #1890ff;
    cursor: pointer;
    font-family: Consolas, Monaco, monospace;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .alt-flag {
    margin-left: 6px;
    font-size: 12px;
  }

  // 标准件有替代料时，主行底部不画线
  tr.has-alternate.is-group-start td {
    border-bottom: 1px solid transparent;
  }

  // 替代件行视觉：浅黄色背景 + 左侧高亮条
  tr.is-alternate {
    background: linear-gradient(90deg, #fffbe6 0%, #fffbe6 4px, #fff 4px, #fff 100%);
    box-shadow: inset 3px 0 0 #faad14;

    td:first-child {
      padding-left: 24px;
    }

    td {
      color: #614700;
    }
  }
}

.bom-tip {
  margin-top: 12px;
  padding: 10px 12px;
  font-size: 12px;
  color: #6b7280;
  background: #f8fafc;
  border-left: 3px solid #faad14;
  border-radius: 2px;
  line-height: 1.8;

  strong {
    color: #d4380d;
  }
}
</style>
