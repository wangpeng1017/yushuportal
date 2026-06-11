<template>
  <div class="bizdoc-detail">
    <!-- 单据链路条 -->
    <div class="bizdoc-chain">
      <Icon icon="ep:share" :size="14" color="#6b7280" />
      <span class="chain-label">单据链路</span>
      <template v-for="(node, idx) in chainNodes" :key="node.id">
        <Icon v-if="idx > 0" icon="ep:right" :size="12" color="#c0c4cc" />
        <span
          class="chain-node"
          :class="{ current: node.id === doc.id, clickable: node.id !== doc.id }"
          @click="node.id !== doc.id && emit('jump', node.id)"
        >
          <span class="chain-form">{{ node.form }}</span>
          <span class="chain-no">{{ node.billNo }}</span>
        </span>
      </template>
      <span v-if="chainNodes.length === 1" class="chain-empty">无上下游关联</span>
    </div>

    <!-- 主表 -->
    <div class="bizdoc-section">
      <div class="bizdoc-section-title">
        <Icon icon="ep:document" :size="14" />
        主表
        <el-tag size="small" :type="dirTagType" effect="dark" class="dir-tag">{{ meta.direction }}</el-tag>
        <el-tag v-if="meta.kingdeeForm && meta.kingdeeForm !== meta.bizForm" size="small" effect="plain" type="info">
          金蝶表单：{{ meta.kingdeeForm }}
        </el-tag>
      </div>
      <el-descriptions :column="3" border size="small">
        <el-descriptions-item v-for="f in meta.header" :key="f.name" :label="f.name">
          {{ doc.header[f.name] || '—' }}
        </el-descriptions-item>
        <el-descriptions-item label="实际创建人">
          <el-tag size="small" effect="plain" :type="doc.creator === '金蝶ERP' ? 'info' : 'success'">
            {{ doc.creator }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="同步状态">
          <el-tag size="small" :type="syncTagType" :effect="doc.syncStatus === '已同步' ? 'dark' : 'plain'">
            {{ doc.syncStatus }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 子表（明细 / 序列号等多段） -->
    <div v-for="(sec, si) in meta.details" :key="sec.title" class="bizdoc-section">
      <div class="bizdoc-section-title">
        <Icon icon="ep:list" :size="14" />
        {{ sec.title }}
        <span class="bizdoc-section-count">{{ (doc.details[si] || []).length }} 行</span>
      </div>
      <el-table :data="doc.details[si] || []" border stripe size="small">
        <el-table-column
          v-for="f in sec.fields"
          :key="f.name"
          :prop="f.name"
          :label="f.name"
          :min-width="colWidth(f.name)"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@/components/Icon'
import type { BizInterfaceMeta } from '../erp-schema'
import { bizInterfaces } from '../erp-schema'
import type { BizDoc } from '../biz-doc-data'

const props = defineProps<{
  doc: BizDoc
  meta: BizInterfaceMeta
  allDocs: BizDoc[]
}>()

const emit = defineEmits<{ (e: 'jump', docId: string): void }>()

const formOf = (interfaceId: number) =>
  bizInterfaces.find((i) => i.id === interfaceId)?.bizForm || ''

// 链路：向上递归 upstream，向下查引用本单的单据
const chainNodes = computed(() => {
  const up: { id: string; form: string; billNo: string }[] = []
  let cur: BizDoc | undefined = props.doc
  const seen = new Set<string>([props.doc.id])
  while (cur?.upstreamDocId) {
    const parent = props.allDocs.find((d) => d.id === cur!.upstreamDocId)
    if (!parent || seen.has(parent.id)) break
    seen.add(parent.id)
    up.unshift({ id: parent.id, form: formOf(parent.interfaceId), billNo: parent.billNo })
    cur = parent
  }
  const down: { id: string; form: string; billNo: string }[] = []
  let curId = props.doc.id
  for (let depth = 0; depth < 6; depth++) {
    const child = props.allDocs.find((d) => d.upstreamDocId === curId && !seen.has(d.id))
    if (!child) break
    seen.add(child.id)
    down.push({ id: child.id, form: formOf(child.interfaceId), billNo: child.billNo })
    curId = child.id
  }
  return [
    ...up,
    { id: props.doc.id, form: props.meta.bizForm, billNo: props.doc.billNo },
    ...down
  ]
})

const dirTagType = computed(() => {
  if (props.meta.dirType === 'K2M') return 'primary'
  if (props.meta.dirType === 'M2K') return 'success'
  if (props.meta.dirType === 'BOTH') return 'warning'
  return 'info'
})

const syncTagType = computed(() => {
  if (props.doc.syncStatus === '已同步') return 'success'
  if (props.doc.syncStatus === '同步失败') return 'danger'
  return 'warning'
})

const colWidth = (name: string) => {
  if (name.includes('编码') || name.includes('序列号') || name.includes('日期')) return 130
  if (name.includes('名称') || name.includes('描述') || name.includes('现象')) return 150
  if (name === '序号' || name === '项次') return 56
  return 96
}
</script>

<style lang="scss" scoped>
.bizdoc-detail {
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bizdoc-chain {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  background: #f8fafc;
  border: 1px solid #eef2f7;
  border-radius: 6px;
  padding: 10px 14px;

  .chain-label {
    font-size: 12.5px;
    color: #6b7280;
    margin-right: 4px;
  }

  .chain-empty {
    font-size: 12px;
    color: #9ca3af;
  }
}

.chain-node {
  display: inline-flex;
  flex-direction: column;
  padding: 4px 10px;
  border-radius: 5px;
  border: 1px solid #e5e7eb;
  background: #fff;
  line-height: 1.3;

  .chain-form {
    font-size: 11px;
    color: #6b7280;
  }

  .chain-no {
    font-size: 12px;
    font-family: Consolas, Monaco, monospace;
    color: #1f2937;
  }

  &.current {
    border-color: #1890ff;
    background: #e6f4ff;

    .chain-form,
    .chain-no {
      color: #1677ff;
    }
  }

  &.clickable {
    cursor: pointer;

    &:hover {
      border-color: #91caff;
    }
  }
}

.bizdoc-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13.5px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;

  .dir-tag {
    margin-left: 6px;
  }

  .bizdoc-section-count {
    font-size: 11.5px;
    font-weight: 400;
    color: #9ca3af;
  }
}
</style>
