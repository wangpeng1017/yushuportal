/**
 * C 端设备档案 — 三棵分类树定义
 *
 * 节点结构：{ label: string; children?: TreeDef[] }
 * 渲染时由 page.vue 根据 categoryPathByType / categoryPathByProcess / categoryPathByPlan
 * 计算每个节点的设备数量。
 */

export interface TreeDef {
  label: string
  children?: TreeDef[]
}

// ── 树① 按设备类型 ─────────────────────────────────────────
export const C_TREE_BY_TYPE: TreeDef[] = [
  {
    label: '非标设备',
    children: [
      {
        label: '自动化工作站',
        children: [
          { label: '上下料工作站' },
          { label: '装配工作站' },
          { label: '检测工作站' }
        ]
      },
      {
        label: '自动化线体',
        children: [
          { label: 'PACK 自动化线' },
          { label: '电机自动化装配线' },
          { label: '总装自动化线' }
        ]
      },
      {
        label: '半自动设备',
        children: [
          { label: '半自动点胶机' },
          { label: '半自动压合机' },
          { label: '半自动测试台' }
        ]
      }
    ]
  },
  {
    label: '工具类设备',
    children: [
      {
        label: '电批',
        children: [
          { label: '直流电批' },
          { label: '交流电批' },
          { label: '智能扭矩电批' }
        ]
      },
      {
        label: '手动点胶机',
        children: [
          { label: '单组分点胶机' },
          { label: '双组分点胶机' }
        ]
      },
      {
        label: '其他手持工具',
        children: [
          { label: '热风枪' },
          { label: '烙铁台' }
        ]
      }
    ]
  },
  {
    label: '加工类设备',
    children: [
      {
        label: '压机',
        children: [
          { label: '液压压机' },
          { label: '伺服压机' },
          { label: '气动压机' }
        ]
      },
      {
        label: '台钻',
        children: [
          { label: '立式台钻' },
          { label: '摇臂钻' }
        ]
      },
      {
        label: '其他加工',
        children: [
          { label: '切割机' },
          { label: '钻铣床' }
        ]
      }
    ]
  }
]

// ── 树② 按加工工艺 ────────────────────────────────────────
export const C_TREE_BY_PROCESS: TreeDef[] = [
  {
    label: 'PACK 工艺线',
    children: [
      {
        label: 'PACK 主线（1 条）',
        children: [
          { label: '工位 1-5' },
          { label: '工位 6-10' },
          { label: '工位 11-15' }
        ]
      },
      {
        label: 'PACK 辅线',
        children: [
          { label: '老化测试段' }
        ]
      }
    ]
  },
  {
    label: '电机装配工艺线（10 条）',
    children: [
      {
        label: '电机线 1-3',
        children: [
          { label: '转子装配段' },
          { label: '定子装配段' },
          { label: '整机测试段' }
        ]
      },
      {
        label: '电机线 4-6',
        children: [
          { label: '转子装配段' },
          { label: '定子装配段' },
          { label: '整机测试段' }
        ]
      },
      {
        label: '电机线 7-10',
        children: [
          { label: '转子装配段' },
          { label: '定子装配段' },
          { label: '整机测试段' }
        ]
      }
    ]
  },
  {
    label: '来料检验',
    children: [
      { label: '外观检验段' },
      { label: '尺寸检验段' },
      { label: '性能检验段' }
    ]
  },
  {
    label: '总装线（暂无）',
    children: [
      { label: '规划中' }
    ]
  }
]

// ── 树③ 非标规划（未投产）─────────────────────────────────
export const C_TREE_BY_PLAN: TreeDef[] = [
  {
    label: '自动上下料规划',
    children: [
      { label: 'PACK 上下料' },
      { label: '电机上下料' },
      { label: 'CNC 上下料' }
    ]
  },
  {
    label: '检测规划',
    children: [
      {
        label: '外观检测',
        children: [
          { label: 'AOI 在线' },
          { label: '离线 AOI' }
        ]
      },
      {
        label: '尺寸检测',
        children: [
          { label: '三坐标' },
          { label: '影像测量' }
        ]
      }
    ]
  },
  {
    label: '清洗机规划',
    children: [
      { label: '超声波清洗' },
      { label: '等离子清洗' }
    ]
  },
  {
    label: '激光打标规划',
    children: [
      { label: '光纤激光' },
      { label: '紫外激光' }
    ]
  }
]

// ── 旧逻辑：B/CNC 端单棵树（按 equipmentType 一级分类）────────
export function buildLegacyTypeTree(allEquipments: any[], typeOptions: any[]): any[] {
  const groupedByType: Record<string, number> = {}
  allEquipments.forEach((item: any) => {
    const t = item.equipmentType
    if (t) groupedByType[t] = (groupedByType[t] || 0) + 1
  })
  const typeNodes = (typeOptions || []).map((t: any) => {
    const code = t.typeCode || t.code || t.value
    const name = t.typeName || t.name || t.label
    return { key: code, label: name, count: groupedByType[code] || 0, path: [name] }
  })
  return [
    {
      key: 'ALL',
      label: '全部设备',
      path: [],
      count: allEquipments.length,
      children: typeNodes
    }
  ]
}
