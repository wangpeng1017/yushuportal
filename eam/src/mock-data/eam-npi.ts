/**
 * EM-06 非标设备研制（NPI - New Product Introduction）mock 数据
 * 14 阶段流程 + 3 类 BOM + 3 个评审节点
 */

// 14 阶段定义
export const STAGES = [
  { idx: 1,  key: 'productionDemand', name: '生产需求', dept: '生产部门' },
  { idx: 2,  key: 'craftDemand',      name: '工艺需求', dept: '工艺部门' },
  { idx: 3,  key: 'design3D',         name: '方案设计', dept: '自动化设备团队' },
  { idx: 4,  key: 'review1',          name: '方案评审 1', dept: '工艺+生产' },
  { idx: 5,  key: 'designDetail',     name: '方案细化', dept: '自动化设备团队' },
  { idx: 6,  key: 'review2',          name: '方案评审 2', dept: '工艺+生产' },
  { idx: 7,  key: 'drawing',          name: '图纸绘制', dept: '自动化设备团队' },
  { idx: 8,  key: 'bom',              name: 'BOM 生成', dept: '自动化设备团队' },
  { idx: 9,  key: 'purchase',         name: '采购下单', dept: '自动化+采购部' },
  { idx: 10, key: 'receiving',        name: '采购收料', dept: '自动化设备团队' },
  { idx: 11, key: 'materialIssue',    name: '物料领用', dept: '自动化设备团队' },
  { idx: 12, key: 'assembly',         name: '设备装配', dept: '装配车间' },
  { idx: 13, key: 'preAcceptance',    name: '预验收',   dept: '生产+工艺' },
  { idx: 14, key: 'finalAcceptance',  name: '试产+内部验收', dept: '生产现场' }
]

// 5 个项目，覆盖各阶段
const projects = [
  {
    id: 'NPI001', projectCode: 'NPI-2026-001', projectName: 'PACK-A2 自动上下料工作站',
    demandDept: '生产部门', applicantName: '张工', applicationDate: '2026-02-08',
    expectedDeliveryDate: '2026-06-30', workshopCode: 'C',
    currentStage: 9, currentStageStatus: 'in_progress',
    budget: 250000, estimatedCost: 234500,
    description: 'PACK 线扩展第二工位，自动上下料 + 视觉定位 + 真空吸附',
    designReview1: { status: 'PASSED', reviewers: '张主任 / 王工', comment: '方案可行，建议加视觉精度参数', time: '2026-02-25' },
    designReview2: { status: 'PASSED', reviewers: '张主任 / 王工 / 李总', comment: '细化方案符合工艺要求', time: '2026-03-12' },
    preAcceptance: { status: 'PENDING', reviewers: '', comment: '', time: '' }
  },
  {
    id: 'NPI002', projectCode: 'NPI-2026-002', projectName: 'B 端老化测试台',
    demandDept: '生产部门', applicantName: '严欢欢', applicationDate: '2026-03-12',
    expectedDeliveryDate: '2026-08-15', workshopCode: 'C',
    currentStage: 4, currentStageStatus: 'in_progress',
    budget: 180000, estimatedCost: 165000,
    description: 'B 端电池模组老化测试，温箱 +85℃ / -40℃ 循环测试',
    designReview1: { status: 'PENDING', reviewers: '', comment: '', time: '' },
    designReview2: { status: 'PENDING', reviewers: '', comment: '', time: '' },
    preAcceptance: { status: 'PENDING', reviewers: '', comment: '', time: '' }
  },
  {
    id: 'NPI003', projectCode: 'NPI-2026-003', projectName: '电机扁线绕线机 V2',
    demandDept: '生产部门', applicantName: '李伟', applicationDate: '2026-01-22',
    expectedDeliveryDate: '2026-07-31', workshopCode: 'C',
    currentStage: 8, currentStageStatus: 'in_progress',
    budget: 480000, estimatedCost: 462000,
    description: '电机扁线绕线机 V2 升级，4 轴联动 + 张力反馈 + 自动换线',
    designReview1: { status: 'PASSED', reviewers: '王工', comment: 'V2 方案优于 V1，建议增加张力监控', time: '2026-02-10' },
    designReview2: { status: 'PASSED', reviewers: '王工 / 张主任', comment: '详细设计通过', time: '2026-02-28' },
    preAcceptance: { status: 'PENDING', reviewers: '', comment: '', time: '' }
  },
  {
    id: 'NPI004', projectCode: 'NPI-2026-004', projectName: 'PCBA 自动测试线',
    demandDept: '工艺部门', applicantName: '陈工', applicationDate: '2025-11-08',
    expectedDeliveryDate: '2026-05-15', workshopCode: 'C',
    currentStage: 12, currentStageStatus: 'in_progress',
    budget: 580000, estimatedCost: 552000,
    description: 'PCBA 自动 ICT + FCT 一体测试线，含治具切换',
    designReview1: { status: 'PASSED', reviewers: '张主任 / 王工', comment: '同意', time: '2025-12-05' },
    designReview2: { status: 'PASSED', reviewers: '张主任 / 王工 / 李总', comment: '同意', time: '2025-12-25' },
    preAcceptance: { status: 'PENDING', reviewers: '', comment: '', time: '' }
  },
  {
    id: 'NPI005', projectCode: 'NPI-2026-005', projectName: '装配自动锁付线',
    demandDept: '生产部门', applicantName: '刘工', applicationDate: '2025-09-15',
    expectedDeliveryDate: '2026-03-30', workshopCode: 'C',
    currentStage: 14, currentStageStatus: 'completed',
    budget: 320000, estimatedCost: 298500,
    description: '装配车间自动锁付线，4 工位 + 扭矩控制 + 防错',
    designReview1: { status: 'PASSED', reviewers: '王工', comment: '同意', time: '2025-10-08' },
    designReview2: { status: 'PASSED', reviewers: '王工 / 张主任', comment: '同意', time: '2025-10-25' },
    preAcceptance: { status: 'PASSED', reviewers: '生产 / 工艺', comment: '达到导入生产现场标准', time: '2026-03-08' }
  }
]

// 阶段进度（按项目 + 阶段）
function genStages(currentStage: number, status: string) {
  return STAGES.map(s => {
    if (s.idx < currentStage) return { ...s, status: 'completed', completeTime: '2026-0' + Math.min(4, Math.max(1, s.idx)) + '-' + String(s.idx * 2 + 5).padStart(2, '0') }
    if (s.idx === currentStage) return { ...s, status: status, completeTime: '' }
    return { ...s, status: 'pending', completeTime: '' }
  })
}

// BOM 数据（机加 / 钣金 / 外购）
const boms: Record<string, any> = {
  NPI001: {
    machining: [
      { id: 'M1', code: 'NPI-001-M-01', name: '上料机臂支架', drawingNo: 'DWG-NPI001-M-01', material: '6061-T6 铝合金', quantity: 2, unit: '件', supplier: '华诚精密', unitPrice: 850, total: 1700, deliveryDate: '2026-04-20' },
      { id: 'M2', code: 'NPI-001-M-02', name: '夹爪连接座', drawingNo: 'DWG-NPI001-M-02', material: '45# 钢调质', quantity: 4, unit: '件', supplier: '华诚精密', unitPrice: 320, total: 1280, deliveryDate: '2026-04-18' },
      { id: 'M3', code: 'NPI-001-M-03', name: '导轨底板', drawingNo: 'DWG-NPI001-M-03', material: 'Q235 钢', quantity: 1, unit: '件', supplier: '宁波益华', unitPrice: 1200, total: 1200, deliveryDate: '2026-04-22' }
    ],
    sheetMetal: [
      { id: 'S1', code: 'NPI-001-S-01', name: '设备防护罩', drawingNo: 'DWG-NPI001-S-01', material: 'SPCC 1.5mm', quantity: 1, unit: '件', supplier: '海宁钣金', unitPrice: 2400, total: 2400, deliveryDate: '2026-04-25' },
      { id: 'S2', code: 'NPI-001-S-02', name: '电控箱壳体', drawingNo: 'DWG-NPI001-S-02', material: 'SPCC 1.2mm', quantity: 1, unit: '件', supplier: '海宁钣金', unitPrice: 1850, total: 1850, deliveryDate: '2026-04-25' }
    ],
    standard: [
      { id: 'P1', code: 'BJ-PLC-001', name: '西门子 PLC S7-1200', specification: 'CPU 1214C', quantity: 1, unit: '台', supplier: '西门子', unitPrice: 4300, total: 4300, deliveryDate: '2026-04-28' },
      { id: 'P2', code: 'BJ-SVO-001', name: '安川伺服电机', specification: 'SGM7J-A5A 750W', quantity: 4, unit: '套', supplier: '安川电机', unitPrice: 4700, total: 18800, deliveryDate: '2026-05-02' },
      { id: 'P3', code: 'BJ-VSN-001', name: '基恩士视觉系统', specification: 'CV-X150F', quantity: 1, unit: '套', supplier: '基恩士', unitPrice: 32000, total: 32000, deliveryDate: '2026-05-05' },
      { id: 'P4', code: 'BJ-VAC-001', name: 'SMC 真空发生器', specification: 'ZK2A12K15', quantity: 4, unit: '个', supplier: 'SMC', unitPrice: 680, total: 2720, deliveryDate: '2026-04-30' },
      { id: 'P5', code: 'BJ-RAIL-001', name: 'THK 直线导轨', specification: 'SHS25R 1500mm', quantity: 2, unit: '套', supplier: 'THK', unitPrice: 3200, total: 6400, deliveryDate: '2026-05-08' }
    ]
  },
  NPI003: {
    machining: [
      { id: 'M1', code: 'NPI-003-M-01', name: '主轴箱', drawingNo: 'DWG-NPI003-M-01', material: 'HT200 铸铁', quantity: 1, unit: '件', supplier: '华诚精密', unitPrice: 5800, total: 5800, deliveryDate: '2026-04-15' },
      { id: 'M2', code: 'NPI-003-M-02', name: '张力臂', drawingNo: 'DWG-NPI003-M-02', material: '7075 铝合金', quantity: 2, unit: '件', supplier: '华诚精密', unitPrice: 1200, total: 2400, deliveryDate: '2026-04-12' }
    ],
    sheetMetal: [
      { id: 'S1', code: 'NPI-003-S-01', name: '机架立柱', drawingNo: 'DWG-NPI003-S-01', material: 'SPCC 2.0mm', quantity: 4, unit: '件', supplier: '海宁钣金', unitPrice: 920, total: 3680, deliveryDate: '2026-04-20' }
    ],
    standard: [
      { id: 'P1', code: 'BJ-SVO-002', name: '伺服电机', specification: 'SGM7G-13A', quantity: 4, unit: '套', supplier: '安川电机', unitPrice: 6800, total: 27200, deliveryDate: '2026-04-25' },
      { id: 'P2', code: 'BJ-DRV-001', name: '伺服驱动器', specification: 'SGD7S-2R8A30A', quantity: 4, unit: '台', supplier: '安川电机', unitPrice: 5200, total: 20800, deliveryDate: '2026-04-25' }
    ]
  }
}

// 装配进度（仅给当前阶段=12 的项目 NPI004）
const assemblyProgress: Record<string, any> = {
  NPI004: {
    机械装配: { progress: 100, completedAt: '2026-04-15', operator: '装配组 / 王师傅' },
    电气接线: { progress: 80, completedAt: '', operator: '电气组 / 李师傅' },
    电气调试: { progress: 30, completedAt: '', operator: '电气组 / 李师傅' },
    联机调试: { progress: 0, completedAt: '', operator: '' }
  },
  NPI005: {
    机械装配: { progress: 100, completedAt: '2026-01-25', operator: '装配组' },
    电气接线: { progress: 100, completedAt: '2026-02-10', operator: '电气组' },
    电气调试: { progress: 100, completedAt: '2026-02-20', operator: '电气组' },
    联机调试: { progress: 100, completedAt: '2026-02-28', operator: '工艺组' }
  }
}

// 验收记录（含 3 类：预验收 / 批量试产 / 内部验收）
const acceptances: Record<string, any[]> = {
  NPI005: [
    { id: 'A1', type: '预验收', date: '2026-03-08', result: 'PASSED', participants: '生产部 / 工艺部', issues: '部分接口防尘需加强', conclusion: '达到导入生产现场标准' },
    { id: 'A2', type: '生产调试', date: '2026-03-15', result: 'PASSED', participants: '生产现场 / 工艺组', issues: '调试时发现真空压力略低，已调整', conclusion: '调试通过' },
    { id: 'A3', type: '批量试产', date: '2026-03-22', result: 'PASSED', participants: '生产现场', issues: '试产 200 件，良率 99.2%', conclusion: '试产合格' },
    { id: 'A4', type: '内部验收', date: '2026-03-28', result: 'PASSED', participants: '总经办 / 生产 / 工艺 / 自动化设备', issues: '无重大问题', conclusion: '内部验收通过，正式投产' }
  ]
}

const mocks = [
  // 项目主表（按 plant 过滤）
  { url: '/admin-api/eam/npi/project/page', method: 'get' as const, response: ({ query }: any) => {
    let arr = projects.slice()
    if (query?.projectCode) arr = arr.filter(p => p.projectCode.includes(query.projectCode))
    if (query?.projectName) arr = arr.filter(p => p.projectName.includes(query.projectName))
    if (query?.currentStage) arr = arr.filter(p => p.currentStage === Number(query.currentStage))
    return { code: 200, data: { records: arr.map(p => ({ ...p, stages: genStages(p.currentStage, p.currentStageStatus) })), total: arr.length } }
  } },
  // 项目详情
  { url: '/admin-api/eam/npi/project/get', method: 'get' as const, response: ({ query }: any) => {
    const p = projects.find(x => x.id === query?.id)
    if (!p) return { code: 200, data: null }
    return { code: 200, data: {
      ...p,
      stages: genStages(p.currentStage, p.currentStageStatus),
      bom: boms[p.id] || { machining: [], sheetMetal: [], standard: [] },
      assembly: assemblyProgress[p.id] || null,
      acceptances: acceptances[p.id] || []
    } }
  } },
  // 评审记录列表（取所有项目的 review1/review2/preAcceptance）
  { url: '/admin-api/eam/npi/review/list', method: 'get' as const, response: () => {
    const reviews: any[] = []
    projects.forEach(p => {
      ['designReview1', 'designReview2', 'preAcceptance'].forEach((type: string, idx) => {
        const r: any = (p as any)[type]
        if (r && r.status !== 'PENDING') {
          reviews.push({
            id: p.id + '-R' + (idx + 1),
            projectCode: p.projectCode,
            projectName: p.projectName,
            type: ['方案评审 1', '方案评审 2', '预验收'][idx],
            status: r.status,
            reviewers: r.reviewers,
            comment: r.comment,
            time: r.time
          })
        } else {
          reviews.push({
            id: p.id + '-R' + (idx + 1),
            projectCode: p.projectCode,
            projectName: p.projectName,
            type: ['方案评审 1', '方案评审 2', '预验收'][idx],
            status: 'PENDING',
            reviewers: '', comment: '', time: ''
          })
        }
      })
    })
    return { code: 200, data: { records: reviews, total: reviews.length } }
  } },
  // BOM 列表（按项目+类型）
  { url: '/admin-api/eam/npi/bom/list', method: 'get' as const, response: ({ query }: any) => {
    const projectId = query?.projectId
    const type = query?.bomType  // machining/sheetMetal/standard
    if (!projectId || !boms[projectId]) return { code: 200, data: { records: [], total: 0 } }
    const arr = type ? (boms[projectId][type] || []) : [
      ...(boms[projectId].machining || []).map((x: any) => ({ ...x, type: '机加件' })),
      ...(boms[projectId].sheetMetal || []).map((x: any) => ({ ...x, type: '钣金件' })),
      ...(boms[projectId].standard || []).map((x: any) => ({ ...x, type: '外购标准件' }))
    ]
    return { code: 200, data: { records: arr, total: arr.length } }
  } },
  // 验收记录列表
  { url: '/admin-api/eam/npi/acceptance/list', method: 'get' as const, response: () => {
    const arr: any[] = []
    projects.forEach(p => {
      const list = acceptances[p.id] || []
      list.forEach((a: any) => arr.push({ ...a, projectId: p.id, projectCode: p.projectCode, projectName: p.projectName }))
    })
    return { code: 200, data: { records: arr, total: arr.length } }
  } }
]

export default mocks
