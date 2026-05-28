/**
 * Mock: 飞书审批 + ERP 自动化（生产 build 用）
 * 与 mock/feishu-approval.ts 保持一致
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

type ApprovalNode = {
  nodeName: string
  approver: string
  action: '提交' | '通过' | '驳回' | '撤回'
  comment: string
  time: string
}

type ApprovalRecord = {
  id: string
  approvalCode: string
  approvalUrl: string
  sourceType: string
  sourceId: string
  title: string
  detail: string
  applicantName: string
  submittedAt: string
  status: 'IN_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELED'
  approver: string
  approvedAt: string
  approvalNodes: ApprovalNode[]
}

const approvalList: ApprovalRecord[] = [
  {
    id: 'AP001',
    approvalCode: 'FS-2026-04-0001',
    approvalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-2026-04-0001',
    sourceType: 'PURCHASE_DEMAND',
    sourceId: 'PD001',
    title: '采购需求审批 / φ50 外圆车刀 ×30',
    detail: JSON.stringify({
      品名: 'φ50 外圆车刀',
      规格: 'SDJCR2020K11',
      数量: '30 把',
      申请人: '刚嘉成',
      期望到货: '2026-05-15',
      预估金额: '2565.00 元',
    }),
    applicantName: '刚嘉成',
    submittedAt: '2026-04-20 09:35:00',
    status: 'APPROVED',
    approver: '飞书审批员',
    approvedAt: '2026-04-20 10:12:00',
    approvalNodes: [
      { nodeName: '发起申请', approver: '刚嘉成', action: '提交', comment: '常规耗材，请审批', time: '2026-04-20 09:35:00' },
      { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-20 10:12:00' },
    ],
  },
  {
    id: 'AP002',
    approvalCode: 'FS-2026-04-0002',
    approvalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-2026-04-0002',
    sourceType: 'PURCHASE_DEMAND',
    sourceId: 'PD004',
    title: '采购需求审批 / B5 电机外壳注塑模 ×1',
    detail: JSON.stringify({
      品名: 'B5 电机外壳注塑模',
      规格: '1出1',
      数量: '1 套',
      申请人: '刚嘉成',
      期望到货: '2026-06-30',
      预估金额: '95000.00 元（参考同类）',
    }),
    applicantName: '刚嘉成',
    submittedAt: '2026-04-25 16:05:00',
    status: 'IN_APPROVAL',
    approver: '飞书审批员',
    approvedAt: '',
    approvalNodes: [
      { nodeName: '发起申请', approver: '刚嘉成', action: '提交', comment: '新产品配套急需', time: '2026-04-25 16:05:00' },
    ],
  },
]

type PurchaseDemandPatch = (
  sourceId: string,
  patch: Record<string, any>,
) => boolean
function getDemandPatch(): PurchaseDemandPatch | null {
  // @ts-ignore
  return globalThis.__patchPurchaseDemand || null
}

function nowStr() {
  return new Date().toISOString().slice(0, 19).replace('T', ' ')
}

function paginate<T>(list: T[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

function nextApprovalCode(): string {
  const seq = String(approvalList.length + 1).padStart(4, '0')
  return `FS-2026-04-${seq}`
}

function buildApprovalUrl(code: string): string {
  return `https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=${code}`
}

export default <MockMethod[]>[
  {
    url: '/admin-api/feishu/approval/submit',
    method: 'post',
    response: ({ body }) => {
      const id = 'AP' + String(Date.now()).slice(-6)
      const code = nextApprovalCode()
      const url = buildApprovalUrl(code)
      const time = nowStr()
      const applicantName = body.applicantName || '当前用户'
      approvalList.forEach((a) => {
        if (
          a.sourceType === body.sourceType &&
          a.sourceId === body.sourceId &&
          (a.status === 'REJECTED' || a.status === 'CANCELED')
        ) {
          a.status = 'CANCELED'
        }
      })
      const record: ApprovalRecord = {
        id,
        approvalCode: code,
        approvalUrl: url,
        sourceType: body.sourceType || 'PURCHASE_DEMAND',
        sourceId: body.sourceId || '',
        title: body.title || '审批申请',
        detail: typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail || {}),
        applicantName,
        submittedAt: time,
        status: 'IN_APPROVAL',
        approver: '飞书审批员',
        approvedAt: '',
        approvalNodes: [
          {
            nodeName: '发起申请',
            approver: applicantName,
            action: '提交',
            comment: body.submitComment || '',
            time,
          },
        ],
      }
      approvalList.unshift(record)
      const patch = getDemandPatch()
      if (patch) {
        patch(body.sourceId, {
          approvalStatus: 'IN_APPROVAL',
          feishuApprovalCode: code,
          feishuApprovalUrl: url,
          approver: '飞书审批员',
          approvedAt: '',
          approvalNodes: record.approvalNodes,
          erpFailReason: '',
        })
      }
      return { code: 200, data: { id, approvalCode: code, approvalUrl: url } }
    },
  },

  {
    url: '/admin-api/feishu/approval/page',
    method: 'get',
    response: ({ query }) => {
      let list = approvalList.slice()
      if (query.status) list = list.filter((a) => a.status === query.status)
      if (query.sourceType) list = list.filter((a) => a.sourceType === query.sourceType)
      if (query.keyword) {
        const k = String(query.keyword).toLowerCase()
        list = list.filter(
          (a) =>
            a.approvalCode.toLowerCase().includes(k) ||
            a.title.toLowerCase().includes(k) ||
            a.applicantName.toLowerCase().includes(k),
        )
      }
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    },
  },

  {
    url: '/admin-api/feishu/approval/get',
    method: 'get',
    response: ({ query }) => {
      const a =
        approvalList.find((x) => x.id === query.id) ||
        approvalList.find((x) => x.approvalCode === query.approvalCode) ||
        approvalList.find((x) => x.sourceId === query.sourceId)
      return { code: 200, data: a || null }
    },
  },

  {
    url: '/admin-api/feishu/approval/approve',
    method: 'post',
    response: ({ body, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const idx = approvalList.findIndex(
        (x) => x.id === body.id || x.approvalCode === body.approvalCode,
      )
      if (idx < 0) return { code: 400, data: null, msg: '审批单不存在' }
      const record = approvalList[idx]
      if (record.status !== 'IN_APPROVAL') {
        return { code: 400, data: null, msg: `当前状态 ${record.status} 不可通过` }
      }
      const time = nowStr()
      record.status = 'APPROVED'
      record.approver = body.approver || '飞书审批员'
      record.approvedAt = time
      record.approvalNodes.push({
        nodeName: '审批人',
        approver: record.approver,
        action: '通过',
        comment: body.comment || '同意',
        time,
      })
      const patch = getDemandPatch()
      if (patch) {
        patch(record.sourceId, {
          approvalStatus: 'APPROVED',
          approver: record.approver,
          approvedAt: time,
          approvalNodes: record.approvalNodes,
        })
      }
      return { code: 200, data: { workshopCode: ws, approvalCode: record.approvalCode } }
    },
  },

  {
    url: '/admin-api/feishu/approval/reject',
    method: 'post',
    response: ({ body }) => {
      const idx = approvalList.findIndex(
        (x) => x.id === body.id || x.approvalCode === body.approvalCode,
      )
      if (idx < 0) return { code: 400, data: null, msg: '审批单不存在' }
      const record = approvalList[idx]
      if (record.status !== 'IN_APPROVAL') {
        return { code: 400, data: null, msg: `当前状态 ${record.status} 不可驳回` }
      }
      const time = nowStr()
      record.status = 'REJECTED'
      record.approver = body.approver || '飞书审批员'
      record.approvedAt = time
      record.approvalNodes.push({
        nodeName: '审批人',
        approver: record.approver,
        action: '驳回',
        comment: body.comment || '请补充说明',
        time,
      })
      const patch = getDemandPatch()
      if (patch) {
        patch(record.sourceId, {
          approvalStatus: 'REJECTED',
          approver: record.approver,
          approvedAt: time,
          approvalNodes: record.approvalNodes,
        })
      }
      return { code: 200, data: true }
    },
  },

  {
    url: '/admin-api/feishu/approval/cancel',
    method: 'post',
    response: ({ body }) => {
      const idx = approvalList.findIndex(
        (x) =>
          x.id === body.id ||
          x.approvalCode === body.approvalCode ||
          (x.sourceId === body.sourceId && x.status === 'IN_APPROVAL'),
      )
      if (idx < 0) return { code: 400, data: null, msg: '审批单不存在或已结束' }
      const record = approvalList[idx]
      if (record.status !== 'IN_APPROVAL') {
        return { code: 400, data: null, msg: `当前状态 ${record.status} 不可撤回` }
      }
      const time = nowStr()
      record.status = 'CANCELED'
      record.approvalNodes.push({
        nodeName: '申请人',
        approver: record.applicantName,
        action: '撤回',
        comment: body.comment || '申请人撤回',
        time,
      })
      const patch = getDemandPatch()
      if (patch) {
        patch(record.sourceId, {
          approvalStatus: 'CANCELED',
          approvalNodes: record.approvalNodes,
        })
      }
      return { code: 200, data: true }
    },
  },

  {
    url: '/admin-api/erp/purchase-order/create',
    method: 'post',
    response: ({ body }) => {
      const fail = Math.random() < 0.05
      if (fail) {
        const reason = 'ERP 接口超时（mock 模拟），请重试'
        const patch = getDemandPatch()
        if (patch && body.sourceId) {
          patch(body.sourceId, {
            approvalStatus: 'ERP_FAILED',
            erpStatus: 'FAILED',
            erpFailReason: reason,
          })
        }
        return { code: 500, data: null, msg: reason }
      }
      const po = `PO-2026-04-${Math.floor(Math.random() * 9000 + 1000)}`
      const patch = getDemandPatch()
      if (patch && body.sourceId) {
        patch(body.sourceId, {
          approvalStatus: 'PO_GENERATED',
          erpStatus: 'SUCCESS',
          erpPurchaseOrderNo: po,
          erpPushStatus: '已生成PO',
          erpFailReason: '',
        })
      }
      return { code: 200, data: { erpPurchaseOrderNo: po } }
    },
  },
]
