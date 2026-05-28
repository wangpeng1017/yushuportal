/**
 * Mock: 设备分类树（5 级层级树，3 根节点：非标设备/工具类设备/加工类设备）
 * 数据源参照 optEquipment/category-trees.ts 中 C_TREE_BY_TYPE
 */
import type { MockMethod } from 'vite-plugin-mock'

type TreeNode = {
  id: string
  label: string
  sort: number
  enabled: boolean
  remark?: string
  children?: TreeNode[]
}

let idSeq = 1
function newId() { return `N${String(idSeq++).padStart(4, '0')}` }

// 初始数据（与 C_TREE_BY_TYPE 一致）
function buildInitial(): TreeNode[] {
  const RAW = [
    {
      label: '非标设备',
      children: [
        { label: '自动化工作站', children: [{ label: '上下料工作站' }, { label: '装配工作站' }, { label: '检测工作站' }] },
        { label: '自动化线体', children: [{ label: 'PACK 自动化线' }, { label: '电机自动化装配线' }, { label: '总装自动化线' }] },
        { label: '半自动设备', children: [{ label: '半自动点胶机' }, { label: '半自动压合机' }, { label: '半自动测试台' }] },
      ],
    },
    {
      label: '工具类设备',
      children: [
        { label: '电批', children: [{ label: '直流电批' }, { label: '交流电批' }, { label: '智能扭矩电批' }] },
        { label: '手动点胶机', children: [{ label: '单组分点胶机' }, { label: '双组分点胶机' }] },
        { label: '其他手持工具', children: [{ label: '热风枪' }, { label: '烙铁台' }] },
      ],
    },
    {
      label: '加工类设备',
      children: [
        { label: '压机', children: [{ label: '液压压机' }, { label: '伺服压机' }, { label: '气动压机' }] },
        { label: '台钻', children: [{ label: '立式台钻' }, { label: '摇臂钻' }] },
        { label: '其他加工', children: [{ label: '切割机' }, { label: '钻铣床' }] },
      ],
    },
  ]
  let sort = 1
  function convert(arr: any[]): TreeNode[] {
    return arr.map(n => ({
      id: newId(),
      label: n.label,
      sort: sort++,
      enabled: true,
      remark: '',
      children: n.children ? convert(n.children) : [],
    }))
  }
  return convert(RAW)
}

let store: TreeNode[] = buildInitial()

// 工具：递归查找节点
function findNode(nodes: TreeNode[], id: string, parent: TreeNode | null = null): { node: TreeNode | null, parent: TreeNode | null, list: TreeNode[] | null } {
  for (const list of [nodes]) {
    for (const n of list) {
      if (n.id === id) return { node: n, parent, list }
      if (n.children?.length) {
        const r = findNode(n.children, id, n)
        if (r.node) return r
      }
    }
  }
  return { node: null, parent: null, list: null }
}

const mocks: MockMethod[] = [
  {
    url: '/admin-api/eam/equipment-class-tree/get',
    method: 'get',
    response: () => ({ code: 0, msg: '', data: store }),
  },
  {
    url: '/admin-api/eam/equipment-class-tree/add-node',
    method: 'post',
    response: ({ body }) => {
      const node: TreeNode = {
        id: newId(),
        label: body.label || '新节点',
        sort: body.sort ?? 99,
        enabled: body.enabled ?? true,
        remark: body.remark || '',
        children: [],
      }
      if (!body.parentId) {
        store.push(node)
      } else {
        const r = findNode(store, body.parentId)
        if (!r.node) return { code: 1, msg: '父节点不存在' }
        r.node.children = r.node.children || []
        r.node.children.push(node)
      }
      return { code: 0, msg: '', data: node.id }
    },
  },
  {
    url: '/admin-api/eam/equipment-class-tree/update-node',
    method: 'post',
    response: ({ body }) => {
      const r = findNode(store, body.id)
      if (!r.node) return { code: 1, msg: '节点不存在' }
      Object.assign(r.node, {
        label: body.label ?? r.node.label,
        sort: body.sort ?? r.node.sort,
        enabled: body.enabled ?? r.node.enabled,
        remark: body.remark ?? r.node.remark,
      })
      return { code: 0, msg: '', data: true }
    },
  },
  {
    url: '/admin-api/eam/equipment-class-tree/delete-node',
    method: 'delete',
    response: ({ query }) => {
      const r = findNode(store, query.id)
      if (!r.node || !r.list) return { code: 1, msg: '节点不存在' }
      const idx = r.list.indexOf(r.node)
      if (idx === -1) return { code: 1, msg: '节点不存在' }
      r.list.splice(idx, 1)
      return { code: 0, msg: '', data: true }
    },
  },
]

export default mocks
