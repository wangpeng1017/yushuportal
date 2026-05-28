/**
 * Mock: 设备采购申请单（CIPxxx 项目级三类清单）
 * 主表 + 钣金件/机加工件/外购件三类明细
 * 审批链：申请人 → 部门负责人 → 设备主管 → 财务（确认预算）→ 通过后开干
 */
import type { MockMethod } from 'vite-plugin-mock'

// ============== 数据结构 ==============
type ApprovalNodeRec = {
  nodeName: string
  approver: string
  action: '提交' | '通过' | '驳回' | '撤回' | '待审批'
  comment: string
  time: string
}

type SheetMetalItem = {
  seq: number
  materialCode: string
  drawingNo: string
  itemName: string
  quantity: number
  material: string
  surfaceTreat: string
  remark: string
}
type MachiningItem = SheetMetalItem
type OutsourceItem = {
  seq: number
  materialCode: string
  drawingSpec: string
  description: string
  quantity: number
  brand: string
  remark: string
  link: string
}

type PurchaseRequest = {
  id: string
  projectCode: string // CIP-2026-001
  projectName: string
  applicantName: string
  applicantDept: string
  applicationDate: string
  expectedDate: string
  remark: string
  status: 'DRAFT' | 'IN_APPROVAL' | 'APPROVED' | 'REJECTED' | 'CANCELED' | 'ERP_PUSHED' | 'ERP_FAILED'
  currentNode: string
  feishuApprovalCode: string
  feishuApprovalUrl: string
  approvalNodes: ApprovalNodeRec[]
  sheetMetalItems: SheetMetalItem[]
  machiningItems: MachiningItem[]
  outsourceItems: OutsourceItem[]
  totalAmount: number
  workshopCode: string
  createTime: string
  approvedAt: string
  erpPushStatus: string
  erpFailReason: string
  erpPurchaseOrderNo: string
}

// 4 节点审批链定义
const APPROVAL_CHAIN = [
  { nodeName: '部门负责人', approver: '李部长' },
  { nodeName: '设备主管', approver: '陈主管' },
  { nodeName: '财务确认预算', approver: '赵会计' },
]

// ============== 初始数据 ==============
const list: PurchaseRequest[] = [
  {
    id: 'PR001',
    projectCode: 'CIP-2026-0001',
    projectName: 'PACK-A2 自动上下料工作站',
    applicantName: '张工',
    applicantDept: '设备部',
    applicationDate: '2026-04-22',
    expectedDate: '2026-05-15',
    remark: '材质、数量以清单为准；有任何加工问题请及时联系设计师确认。',
    status: 'IN_APPROVAL',
    currentNode: '设备主管',
    feishuApprovalCode: 'FS-PR-2026-04-0001',
    feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-PR-2026-04-0001',
    approvalNodes: [
      { nodeName: '发起申请', approver: '张工', action: '提交', comment: '上下料工作站非标自制项目', time: '2026-04-22 09:30:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意，按计划推进', time: '2026-04-22 14:20:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '待审批', comment: '', time: '' },
    ],
    sheetMetalItems: [
      { seq: 1, materialCode: 'BOM-SM-0001', drawingNo: 'CIP-2026-0001-SM-01', itemName: '机架立柱', quantity: 4, material: 'Q235B 8mm', surfaceTreat: '喷砂+RAL7035', remark: '' },
      { seq: 2, materialCode: 'BOM-SM-0002', drawingNo: 'CIP-2026-0001-SM-02', itemName: '底座板', quantity: 1, material: 'Q235B 12mm', surfaceTreat: '喷砂+RAL7035', remark: '激光切割' },
      { seq: 3, materialCode: 'BOM-SM-0003', drawingNo: 'CIP-2026-0001-SM-03', itemName: '防护罩侧板', quantity: 6, material: 'Q235B 3mm', surfaceTreat: '喷砂+RAL7035', remark: '折弯件' },
      { seq: 4, materialCode: 'BOM-SM-0004', drawingNo: 'CIP-2026-0001-SM-04', itemName: '电控柜外壳', quantity: 1, material: 'SPCC 1.5mm', surfaceTreat: '静电粉末喷涂 RAL7035', remark: '' },
    ],
    machiningItems: [
      { seq: 1, materialCode: 'BOM-MA-0001', drawingNo: 'CIP-2026-0001-MA-01', itemName: '夹爪安装座', quantity: 2, material: '6061-T6', surfaceTreat: '硬质阳极氧化', remark: '配合公差 H7' },
      { seq: 2, materialCode: 'BOM-MA-0002', drawingNo: 'CIP-2026-0001-MA-02', itemName: '气缸连接法兰', quantity: 4, material: '45#', surfaceTreat: '发黑', remark: '' },
      { seq: 3, materialCode: 'BOM-MA-0003', drawingNo: 'CIP-2026-0001-MA-03', itemName: '导轨支撑块', quantity: 8, material: '6061-T6', surfaceTreat: '硬质阳极氧化', remark: '需要配研' },
    ],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0001', drawingSpec: 'PA-90 / SMC', description: '驱动气缸 PA90×100', quantity: 4, brand: 'SMC', remark: '货期 7 天', link: 'https://www.smcetech.com/' },
      { seq: 2, materialCode: 'BOM-OS-0002', drawingSpec: 'MGZRL16-150 / SMC', description: '导轨气缸', quantity: 2, brand: 'SMC', remark: '', link: '' },
      { seq: 3, materialCode: 'BOM-OS-0003', drawingSpec: 'CPU 1212C / 西门子', description: 'PLC 主控模块', quantity: 1, brand: '西门子', remark: '货期 4 周', link: 'https://www.siemens.com/' },
      { seq: 4, materialCode: 'BOM-OS-0004', drawingSpec: 'TM5 / Techman', description: '协作机器人', quantity: 1, brand: 'Techman', remark: '加急！预计交期 6 周', link: '' },
    ],
    totalAmount: 186500,
    workshopCode: 'C',
    createTime: '2026-04-22 09:30:00',
    approvedAt: '',
    erpPushStatus: '',
    erpFailReason: '',
    erpPurchaseOrderNo: '',
  },
  {
    id: 'PR002',
    projectCode: 'CIP-2026-0002',
    projectName: '电机装配线-2 工位扩展',
    applicantName: '刘工',
    applicantDept: '工艺部',
    applicationDate: '2026-04-18',
    expectedDate: '2026-05-08',
    remark: '加急项目，配合产线产能爬坡',
    status: 'APPROVED',
    currentNode: '已通过',
    feishuApprovalCode: 'FS-PR-2026-04-0002',
    feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-PR-2026-04-0002',
    approvalNodes: [
      { nodeName: '发起申请', approver: '刘工', action: '提交', comment: '产能爬坡急需', time: '2026-04-18 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意', time: '2026-04-18 11:30:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '通过', comment: '设备方案已确认', time: '2026-04-18 15:00:00' },
      { nodeName: '财务确认预算', approver: '赵会计', action: '通过', comment: '预算已锁定', time: '2026-04-19 09:30:00' },
    ],
    sheetMetalItems: [
      { seq: 1, materialCode: 'BOM-SM-0010', drawingNo: 'CIP-2026-0002-SM-01', itemName: '工位机架', quantity: 2, material: 'Q235B 6mm', surfaceTreat: '喷塑 RAL5012', remark: '' },
      { seq: 2, materialCode: 'BOM-SM-0011', drawingNo: 'CIP-2026-0002-SM-02', itemName: '料盒固定板', quantity: 4, material: 'Q235B 4mm', surfaceTreat: '喷塑 RAL5012', remark: '' },
    ],
    machiningItems: [
      { seq: 1, materialCode: 'BOM-MA-0010', drawingNo: 'CIP-2026-0002-MA-01', itemName: '电机定位销', quantity: 8, material: 'Cr12MoV', surfaceTreat: '热处理 HRC58-62', remark: '配合 H7/g6' },
      { seq: 2, materialCode: 'BOM-MA-0011', drawingNo: 'CIP-2026-0002-MA-02', itemName: '压板治具', quantity: 4, material: '45#', surfaceTreat: '发黑', remark: '' },
    ],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0010', drawingSpec: 'IPC-610H / 研华', description: '工业控制电脑', quantity: 2, brand: '研华', remark: '', link: '' },
      { seq: 2, materialCode: 'BOM-OS-0011', drawingSpec: '15寸触摸屏 / 威纶通', description: 'HMI 触摸屏', quantity: 2, brand: '威纶通', remark: '', link: '' },
    ],
    totalAmount: 78600,
    workshopCode: 'C',
    createTime: '2026-04-18 09:00:00',
    approvedAt: '2026-04-19 09:30:00',
    erpPushStatus: '已生成PO',
    erpFailReason: '',
    erpPurchaseOrderNo: 'PO-2026-04-0301',
  },
  {
    id: 'PR003',
    projectCode: 'CIP-2026-0003',
    projectName: '注塑车间-新模具研制配套',
    applicantName: '王工',
    applicantDept: '注塑车间',
    applicationDate: '2026-04-25',
    expectedDate: '2026-06-10',
    remark: '配合 B5 电机外壳新模具开发',
    status: 'DRAFT',
    currentNode: '草稿',
    feishuApprovalCode: '',
    feishuApprovalUrl: '',
    approvalNodes: [],
    sheetMetalItems: [],
    machiningItems: [
      { seq: 1, materialCode: 'BOM-MA-0020', drawingNo: 'CIP-2026-0003-MA-01', itemName: '模架顶板', quantity: 1, material: 'P20', surfaceTreat: '镜面抛光', remark: '' },
      { seq: 2, materialCode: 'BOM-MA-0021', drawingNo: 'CIP-2026-0003-MA-02', itemName: '型芯', quantity: 1, material: 'NAK80', surfaceTreat: '镜面+渗氮', remark: '' },
    ],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0020', drawingSpec: 'HASCO 标准件', description: '导柱导套', quantity: 4, brand: 'HASCO', remark: '', link: '' },
    ],
    totalAmount: 32000,
    workshopCode: 'C',
    createTime: '2026-04-25 16:00:00',
    approvedAt: '',
    erpPushStatus: '',
    erpFailReason: '',
    erpPurchaseOrderNo: '',
  },
  {
    id: 'PR004',
    projectCode: 'CIP-2026-0004',
    projectName: 'CNC-12 主轴升级改造',
    applicantName: '孙工',
    applicantDept: '数控机加车间',
    applicationDate: '2026-04-15',
    expectedDate: '2026-04-30',
    remark: '原主轴精度衰减，需替换',
    status: 'REJECTED',
    currentNode: '已驳回',
    feishuApprovalCode: 'FS-PR-2026-04-0003',
    feishuApprovalUrl: '',
    approvalNodes: [
      { nodeName: '发起申请', approver: '孙工', action: '提交', comment: '主轴精度衰减', time: '2026-04-15 10:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意', time: '2026-04-15 14:00:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '驳回', comment: '请先做主轴动平衡测试，确认非简单磨损能解决再走采购', time: '2026-04-15 16:30:00' },
    ],
    sheetMetalItems: [],
    machiningItems: [],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0030', drawingSpec: 'BT40-12000rpm / 大隈', description: '高速电主轴', quantity: 1, brand: '大隈', remark: '加急', link: '' },
    ],
    totalAmount: 52000,
    workshopCode: 'CNC',
    createTime: '2026-04-15 10:00:00',
    approvedAt: '',
    erpPushStatus: '',
    erpFailReason: '',
    erpPurchaseOrderNo: '',
  },
  {
    id: 'PR005',
    projectCode: 'CIP-2026-0005',
    projectName: 'B 端检测设备-外观 AOI',
    applicantName: '陈工',
    applicantDept: '质量部',
    applicationDate: '2026-04-26',
    expectedDate: '2026-06-30',
    remark: '配合 B 端来料检验提升',
    status: 'IN_APPROVAL',
    currentNode: '财务确认预算',
    feishuApprovalCode: 'FS-PR-2026-04-0004',
    feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-PR-2026-04-0004',
    approvalNodes: [
      { nodeName: '发起申请', approver: '陈工', action: '提交', comment: '提升来料检验自动化率', time: '2026-04-26 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意', time: '2026-04-26 11:00:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '通过', comment: '已与供应商确认方案', time: '2026-04-26 15:00:00' },
      { nodeName: '财务确认预算', approver: '赵会计', action: '待审批', comment: '', time: '' },
    ],
    sheetMetalItems: [
      { seq: 1, materialCode: 'BOM-SM-0030', drawingNo: 'CIP-2026-0005-SM-01', itemName: 'AOI 设备机柜', quantity: 1, material: 'Q235B 4mm', surfaceTreat: '喷塑 RAL7035', remark: '' },
    ],
    machiningItems: [],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0040', drawingSpec: '500W / 海康', description: '工业线扫相机', quantity: 4, brand: '海康', remark: '加急 4 周到货', link: '' },
      { seq: 2, materialCode: 'BOM-OS-0041', drawingSpec: 'LED 同轴 / 锐视', description: '同轴光源', quantity: 4, brand: '锐视', remark: '', link: '' },
    ],
    totalAmount: 268000,
    workshopCode: 'B',
    createTime: '2026-04-26 09:00:00',
    approvedAt: '',
    erpPushStatus: '',
    erpFailReason: '',
    erpPurchaseOrderNo: '',
  },
  {
    id: 'PR006', projectCode: 'CIP-2026-0006', projectName: 'CNC-15 主轴升级改造', applicantName: '王组长', applicantDept: '数控机加车间',
    applicationDate: '2026-04-10', expectedDate: '2026-05-10', remark: '主轴精度衰减需更换主轴单元',
    status: 'APPROVED', currentNode: '已通过', feishuApprovalCode: 'FS-PR-2026-04-0005', feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-PR-2026-04-0005',
    approvalNodes: [
      { nodeName: '发起申请', approver: '王组长', action: '提交', comment: '主轴精度异常，影响产品合格率', time: '2026-04-10 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意，加急处理', time: '2026-04-10 11:00:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '通过', comment: '已联系大隈供应商', time: '2026-04-10 14:00:00' },
      { nodeName: '财务确认预算', approver: '赵会计', action: '通过', comment: '预算已锁定', time: '2026-04-11 09:00:00' },
    ],
    sheetMetalItems: [], machiningItems: [],
    outsourceItems: [{ seq: 1, materialCode: 'BOM-OS-0050', drawingSpec: 'BT40-12000rpm / 大隈', description: '高速电主轴', quantity: 1, brand: '大隈', remark: '加急 4 周', link: '' }],
    totalAmount: 52000, workshopCode: 'CNC', createTime: '2026-04-10 09:00:00', approvedAt: '2026-04-11 09:00:00', erpPushStatus: '已生成PO', erpFailReason: '', erpPurchaseOrderNo: 'PO-2026-04-0489',
  },
  {
    id: 'PR007', projectCode: 'CIP-2026-0007', projectName: '电机线-3 工位扩展', applicantName: '刘工', applicantDept: '工艺部',
    applicationDate: '2026-04-21', expectedDate: '2026-05-30', remark: '电机装配线新增工位',
    status: 'IN_APPROVAL', currentNode: '部门负责人', feishuApprovalCode: 'FS-PR-2026-04-0006', feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-PR-2026-04-0006',
    approvalNodes: [
      { nodeName: '发起申请', approver: '刘工', action: '提交', comment: '产能配套', time: '2026-04-21 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '待审批', comment: '', time: '' },
    ],
    sheetMetalItems: [
      { seq: 1, materialCode: 'BOM-SM-0040', drawingNo: 'CIP-2026-0007-SM-01', itemName: '工位机架', quantity: 1, material: 'Q235B 6mm', surfaceTreat: '喷塑 RAL5012', remark: '' },
    ],
    machiningItems: [
      { seq: 1, materialCode: 'BOM-MA-0040', drawingNo: 'CIP-2026-0007-MA-01', itemName: '电机定位销', quantity: 4, material: 'Cr12MoV', surfaceTreat: '热处理 HRC58-62', remark: '' },
    ],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0060', drawingSpec: 'IPC-610H / 研华', description: '工业控制电脑', quantity: 1, brand: '研华', remark: '', link: '' },
    ],
    totalAmount: 38500, workshopCode: 'C', createTime: '2026-04-21 09:00:00', approvedAt: '', erpPushStatus: '', erpFailReason: '', erpPurchaseOrderNo: '',
  },
  {
    id: 'PR008', projectCode: 'CIP-2026-0008', projectName: '注塑车间-新模具研制', applicantName: '彭向', applicantDept: '注塑车间',
    applicationDate: '2026-04-12', expectedDate: '2026-06-30', remark: '配合新产品 B7 电机外壳',
    status: 'APPROVED', currentNode: '已通过', feishuApprovalCode: 'FS-PR-2026-04-0007', feishuApprovalUrl: '',
    approvalNodes: [
      { nodeName: '发起申请', approver: '彭向', action: '提交', comment: 'B7 电机外壳新模具', time: '2026-04-12 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意', time: '2026-04-12 11:00:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '通过', comment: '设计方案已确认', time: '2026-04-12 14:00:00' },
      { nodeName: '财务确认预算', approver: '赵会计', action: '通过', comment: '预算已锁定', time: '2026-04-13 09:00:00' },
    ],
    sheetMetalItems: [],
    machiningItems: [
      { seq: 1, materialCode: 'BOM-MA-0050', drawingNo: 'CIP-2026-0008-MA-01', itemName: '模架顶板', quantity: 1, material: 'P20', surfaceTreat: '镜面抛光', remark: '' },
      { seq: 2, materialCode: 'BOM-MA-0051', drawingNo: 'CIP-2026-0008-MA-02', itemName: '型芯', quantity: 1, material: 'NAK80', surfaceTreat: '镜面+渗氮', remark: '' },
    ],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0070', drawingSpec: 'HASCO 标准件', description: '导柱导套', quantity: 4, brand: 'HASCO', remark: '', link: '' },
    ],
    totalAmount: 65000, workshopCode: 'C', createTime: '2026-04-12 09:00:00', approvedAt: '2026-04-13 09:00:00', erpPushStatus: '已生成PO', erpFailReason: '', erpPurchaseOrderNo: 'PO-2026-04-0367',
  },
  {
    id: 'PR009', projectCode: 'CIP-2026-0009', projectName: 'B 端老化测试台', applicantName: '严欢欢', applicantDept: '质量部',
    applicationDate: '2026-04-27', expectedDate: '2026-07-15', remark: '老化测试自动化升级',
    status: 'DRAFT', currentNode: '草稿', feishuApprovalCode: '', feishuApprovalUrl: '', approvalNodes: [],
    sheetMetalItems: [
      { seq: 1, materialCode: 'BOM-SM-0050', drawingNo: 'CIP-2026-0009-SM-01', itemName: '老化箱体', quantity: 1, material: 'SUS304', surfaceTreat: '镜面', remark: '' },
    ],
    machiningItems: [],
    outsourceItems: [
      { seq: 1, materialCode: 'BOM-OS-0080', drawingSpec: 'PT100 / OMRON', description: '温度传感器', quantity: 8, brand: 'OMRON', remark: '', link: '' },
    ],
    totalAmount: 42000, workshopCode: 'B', createTime: '2026-04-27 16:00:00', approvedAt: '', erpPushStatus: '', erpFailReason: '', erpPurchaseOrderNo: '',
  },
  {
    id: 'PR010', projectCode: 'CIP-2026-0010', projectName: 'CNC-车铣复合扩容', applicantName: '王工', applicantDept: '数控机加车间',
    applicationDate: '2026-04-08', expectedDate: '2026-08-30', remark: '采购车铣复合 NC 一台',
    status: 'REJECTED', currentNode: '已驳回', feishuApprovalCode: 'FS-PR-2026-04-0008', feishuApprovalUrl: '',
    approvalNodes: [
      { nodeName: '发起申请', approver: '王工', action: '提交', comment: '产能扩容', time: '2026-04-08 09:00:00' },
      { nodeName: '部门负责人', approver: '李部长', action: '通过', comment: '同意', time: '2026-04-08 11:00:00' },
      { nodeName: '设备主管', approver: '陈主管', action: '驳回', comment: '建议先评估现有设备产能利用率，下季度再议', time: '2026-04-09 14:00:00' },
    ],
    sheetMetalItems: [], machiningItems: [],
    outsourceItems: [{ seq: 1, materialCode: 'BOM-OS-0090', drawingSpec: 'HTM-50 / 大隈', description: '车铣复合NC', quantity: 1, brand: '大隈', remark: '', link: '' }],
    totalAmount: 850000, workshopCode: 'CNC', createTime: '2026-04-08 09:00:00', approvedAt: '', erpPushStatus: '', erpFailReason: '', erpPurchaseOrderNo: '',
  },
]

// ============== 工具函数 ==============
function genCode() {
  const seq = String(list.length + 1).padStart(4, '0')
  return `CIP-2026-${seq}`
}
function paginate<T>(arr: T[], page = 1, size = 10) {
  const start = (page - 1) * size
  return { records: arr.slice(start, start + size), total: arr.length }
}
function nowStr() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
function nextNode(record: PurchaseRequest): string {
  // 找最后一条已通过的节点之后的节点
  const passed = record.approvalNodes.filter(n => n.action === '通过').length
  if (passed >= APPROVAL_CHAIN.length) return '已通过'
  return APPROVAL_CHAIN[passed].nodeName
}

// ============== Mock API ==============
const mocks: MockMethod[] = [
  // 列表
  {
    url: '/admin-api/eam/purchase-request/page',
    method: 'get',
    response: ({ query }) => {
      const page = parseInt(query.pageNo || '1', 10)
      const size = parseInt(query.pageSize || '10', 10)
      let arr = list.slice()
      if (query.projectCode) arr = arr.filter(p => (p.projectCode || '').includes(query.projectCode))
      if (query.projectName) arr = arr.filter(p => (p.projectName || '').includes(query.projectName))
      if (query.status) arr = arr.filter(p => p.status === query.status)
      if (query.workshopCode) arr = arr.filter(p => p.workshopCode === query.workshopCode)
      arr.sort((a, b) => (b.createTime || '').localeCompare(a.createTime || ''))
      const r = paginate(arr, page, size)
      return { code: 0, msg: '', data: { list: r.records, total: r.total } }
    },
  },
  // 详情
  {
    url: '/admin-api/eam/purchase-request/get',
    method: 'get',
    response: ({ query }) => {
      const item = list.find(p => p.id === query.id)
      return { code: 0, msg: '', data: item || null }
    },
  },
  // 创建
  {
    url: '/admin-api/eam/purchase-request/create',
    method: 'post',
    response: ({ body }) => {
      const id = `PR${String(list.length + 1).padStart(3, '0')}`
      const record: PurchaseRequest = {
        id,
        projectCode: body.projectCode || genCode(),
        projectName: body.projectName || '',
        applicantName: body.applicantName || '',
        applicantDept: body.applicantDept || '',
        applicationDate: body.applicationDate || nowStr().split(' ')[0],
        expectedDate: body.expectedDate || '',
        remark: body.remark || '',
        status: 'DRAFT',
        currentNode: '草稿',
        feishuApprovalCode: '',
        feishuApprovalUrl: '',
        approvalNodes: [],
        sheetMetalItems: body.sheetMetalItems || [],
        machiningItems: body.machiningItems || [],
        outsourceItems: body.outsourceItems || [],
        totalAmount: body.totalAmount || 0,
        workshopCode: body.workshopCode || 'C',
        createTime: nowStr(),
        approvedAt: '',
        erpPushStatus: '',
        erpFailReason: '',
        erpPurchaseOrderNo: '',
      }
      list.unshift(record)
      return { code: 0, msg: '', data: id }
    },
  },
  // 更新
  {
    url: '/admin-api/eam/purchase-request/update',
    method: 'put',
    response: ({ body }) => {
      const idx = list.findIndex(p => p.id === body.id)
      if (idx === -1) return { code: 1, msg: '记录不存在' }
      const record = list[idx]
      if (record.status !== 'DRAFT' && record.status !== 'REJECTED' && record.status !== 'CANCELED') {
        return { code: 1, msg: '审批中或已通过的单据不可修改' }
      }
      Object.assign(record, body)
      return { code: 0, msg: '', data: true }
    },
  },
  // 删除
  {
    url: '/admin-api/eam/purchase-request/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = list.findIndex(p => p.id === query.id)
      if (idx === -1) return { code: 1, msg: '记录不存在' }
      if (list[idx].status === 'IN_APPROVAL') return { code: 1, msg: '审批中不可删除，请先撤回' }
      list.splice(idx, 1)
      return { code: 0, msg: '', data: true }
    },
  },
  // 提交审批
  {
    url: '/admin-api/eam/purchase-request/submit-approval',
    method: 'post',
    response: ({ body }) => {
      const record = list.find(p => p.id === body.id)
      if (!record) return { code: 1, msg: '记录不存在' }
      if (record.status === 'IN_APPROVAL') return { code: 1, msg: '已在审批中' }
      record.status = 'IN_APPROVAL'
      record.feishuApprovalCode = `FS-PR-2026-04-${String(list.length).padStart(4, '0')}`
      record.feishuApprovalUrl = `https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=${record.feishuApprovalCode}`
      record.approvalNodes = [
        {
          nodeName: '发起申请',
          approver: record.applicantName,
          action: '提交',
          comment: body.comment || '',
          time: nowStr(),
        },
        {
          nodeName: APPROVAL_CHAIN[0].nodeName,
          approver: APPROVAL_CHAIN[0].approver,
          action: '待审批',
          comment: '',
          time: '',
        },
      ]
      record.currentNode = APPROVAL_CHAIN[0].nodeName
      return { code: 0, msg: '已提交审批', data: { approvalCode: record.feishuApprovalCode, approvalUrl: record.feishuApprovalUrl } }
    },
  },
  // 节点审批（mock 内审批员操作）
  {
    url: '/admin-api/eam/purchase-request/approve-node',
    method: 'post',
    response: ({ body }) => {
      const record = list.find(p => p.id === body.id)
      if (!record) return { code: 1, msg: '记录不存在' }
      if (record.status !== 'IN_APPROVAL') return { code: 1, msg: '当前状态不可审批' }
      const action: '通过' | '驳回' = body.action === 'reject' ? '驳回' : '通过'
      // 替换最后一条 "待审批" 为实际结果
      const pendingIdx = record.approvalNodes.findIndex(n => n.action === '待审批')
      if (pendingIdx === -1) return { code: 1, msg: '无待审批节点' }
      record.approvalNodes[pendingIdx] = {
        ...record.approvalNodes[pendingIdx],
        action,
        comment: body.comment || (action === '通过' ? '同意' : '驳回'),
        time: nowStr(),
      }
      if (action === '驳回') {
        record.status = 'REJECTED'
        record.currentNode = '已驳回'
        return { code: 0, msg: '已驳回', data: true }
      }
      // 推到下一节点
      const next = nextNode(record)
      if (next === '已通过') {
        record.status = 'APPROVED'
        record.currentNode = '已通过'
        record.approvedAt = nowStr()
        // 自动推送 ERP（mock 模拟）
        record.erpPushStatus = '已生成PO'
        record.erpPurchaseOrderNo = `PO-2026-04-${String(300 + list.indexOf(record)).padStart(4, '0')}`
      } else {
        record.currentNode = next
        const nextDef = APPROVAL_CHAIN.find(c => c.nodeName === next)!
        record.approvalNodes.push({ nodeName: next, approver: nextDef.approver, action: '待审批', comment: '', time: '' })
      }
      return { code: 0, msg: '已通过', data: { currentNode: record.currentNode, status: record.status } }
    },
  },
  // 撤回
  {
    url: '/admin-api/eam/purchase-request/cancel-approval',
    method: 'post',
    response: ({ body }) => {
      const record = list.find(p => p.id === body.id)
      if (!record) return { code: 1, msg: '记录不存在' }
      if (record.status !== 'IN_APPROVAL') return { code: 1, msg: '非审批中状态不可撤回' }
      record.status = 'CANCELED'
      record.currentNode = '已撤回'
      record.approvalNodes.push({ nodeName: '申请人', approver: record.applicantName, action: '撤回', comment: body.comment || '申请人主动撤回', time: nowStr() })
      return { code: 0, msg: '已撤回', data: true }
    },
  },
]

export default mocks
