/**
 * 采购管理 - 飞书+ERP 黑盒架构状态机
 * EAM 仅做提单 + 状态展示，飞书审批 + ERP 对接是外部黑盒
 */
export const FEISHU_STATUS_OPTIONS = [
  { value: 'DRAFT',             label: '草稿' },
  { value: 'PUSHED_TO_FEISHU',  label: '已推送飞书' },
  { value: 'FEISHU_APPROVING',  label: '飞书审批中' },
  { value: 'FEISHU_APPROVED',   label: '飞书已通过' },
  { value: 'FEISHU_REJECTED',   label: '飞书已驳回' },
  { value: 'DELIVERED',         label: 'ERP 已到货' },
  { value: 'PUSH_FAILED',       label: '推送失败' }
]

export const FEISHU_STATUS_COLOR: Record<string, string> = {
  DRAFT:            'info',
  PUSHED_TO_FEISHU: 'primary',
  FEISHU_APPROVING: 'warning',
  FEISHU_APPROVED:  'success',
  FEISHU_REJECTED:  'danger',
  DELIVERED:        'success',
  PUSH_FAILED:      'danger'
}

/**
 * 历史 mock 状态值映射到新状态机（Q6A：保留 mock 数据，前端展示层映射）
 */
const LEGACY_TO_FEISHU: Record<string, string> = {
  // 老 EAM 自闭环状态 → 新飞书黑盒状态
  IN_APPROVAL:   'FEISHU_APPROVING',
  APPROVED:      'FEISHU_APPROVED',
  PO_GENERATED:  'DELIVERED',
  ERP_PUSHED:    'DELIVERED',
  INBOUND:       'DELIVERED',
  REJECTED:      'FEISHU_REJECTED',
  CANCELED:      'DRAFT',
  ERP_FAILED:    'PUSH_FAILED',
  SUBMITTED:     'FEISHU_APPROVING'
}

export function normalizeStatus(s: string): string {
  if (!s) return 'DRAFT'
  if (LEGACY_TO_FEISHU[s]) return LEGACY_TO_FEISHU[s]
  return s
}

export function getStatusName(s: string): string {
  const norm = normalizeStatus(s)
  return FEISHU_STATUS_OPTIONS.find(o => o.value === norm)?.label || norm
}

export function getStatusColor(s: string): string {
  const norm = normalizeStatus(s)
  return FEISHU_STATUS_COLOR[norm] || 'info'
}

export function canEdit(row: any): boolean {
  const s = normalizeStatus(row.status)
  return s === 'DRAFT' || s === 'FEISHU_REJECTED' || s === 'PUSH_FAILED'
}
export function canPushToFeishu(row: any): boolean {
  return normalizeStatus(row.status) === 'DRAFT'
}
export function canDelete(row: any): boolean {
  return normalizeStatus(row.status) === 'DRAFT'
}
export function canRetryPush(row: any): boolean {
  return normalizeStatus(row.status) === 'PUSH_FAILED'
}
export function canResubmit(row: any): boolean {
  return normalizeStatus(row.status) === 'FEISHU_REJECTED'
}
export function hasFeishuTicket(row: any): boolean {
  // 已推送飞书的所有状态都可查看飞书单据
  const s = normalizeStatus(row.status)
  return s !== 'DRAFT' && s !== 'PUSH_FAILED'
}

/**
 * 演示态：模拟飞书+ERP 状态推进（手动刷新一行 / 批量刷新）
 * 推进规则：
 *  PUSHED_TO_FEISHU → FEISHU_APPROVING → FEISHU_APPROVED → DELIVERED
 *  小概率（10%）变 FEISHU_REJECTED
 */
export function simulateNextStatus(curr: string): string {
  const norm = normalizeStatus(curr)
  if (norm === 'PUSHED_TO_FEISHU') return 'FEISHU_APPROVING'
  if (norm === 'FEISHU_APPROVING') return Math.random() < 0.1 ? 'FEISHU_REJECTED' : 'FEISHU_APPROVED'
  if (norm === 'FEISHU_APPROVED') return 'DELIVERED'
  return norm  // 终态/草稿/驳回/失败 不再推进
}

/**
 * 飞书单据 URL（mock，跳转外部）
 */
export function buildFeishuUrl(row: any): string {
  const code = row.code || row.projectCode || row.demandCode || row.id
  return `https://feishu.cn/approval/detail/${code}`
}
