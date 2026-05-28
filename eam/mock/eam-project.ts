/**
 * Mock: 非标设备研制管理（C端专属，Phase 6 EM-07）
 * 仅 workshopCode=C 的账号可见，B端和数控无权访问
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

// ── 有状态存储（支持增删查） ──
let projectStore = [
  {
    id: 'proj-001',
    projectCode: 'P-C-001',
    projectName: '7520电机装配线自动化改造',
    demandSource: '生产需求',
    demandDescription: '7520电机装配线现有人工装配效率低，需自动化改造提升产能，目标节拍30s/件。',
    currentPhase: '11',
    responsiblePersonName: '刘朋朋',
    planStartDate: '2025-09-01',
    planEndDate: '2026-03-31',
    actualEndDate: '',
    status: '1',
    deliveryEquipmentSn: '',
    workshopCode: 'C',
    createByPersonName: '刘朋朋',
    createTime: '2025-09-01 09:00:00',
  },
  {
    id: 'proj-002',
    projectCode: 'P-C-002',
    projectName: 'PACK线自动贴标机',
    demandSource: '工艺需求',
    demandDescription: 'PACK线现有手动贴标不合格率高，需设计自动贴标机实现精准贴附，误差±0.3mm以内。',
    currentPhase: '8',
    responsiblePersonName: '刘朋朋',
    planStartDate: '2025-11-01',
    planEndDate: '2026-05-31',
    actualEndDate: '',
    status: '1',
    deliveryEquipmentSn: '',
    workshopCode: 'C',
    createByPersonName: '刘朋朋',
    createTime: '2025-11-01 10:00:00',
  },
  {
    id: 'proj-003',
    projectCode: 'P-C-003',
    projectName: '电池测试架升级',
    demandSource: '生产需求',
    demandDescription: '现有测试架老化，探针接触不良率15%，需升级探针模组和PCB转接板，提升测试稳定性。',
    currentPhase: '14',
    responsiblePersonName: '高学才',
    planStartDate: '2025-06-01',
    planEndDate: '2025-12-31',
    actualEndDate: '2025-12-28',
    status: '2',
    deliveryEquipmentSn: 'EW-TEST-001',
    workshopCode: 'C',
    createByPersonName: '高学才',
    createTime: '2025-06-01 08:30:00',
  },
]

const bomStore: Record<string, any[]> = {
  'P-C-001': [
    { id: 'bom-001-1', projectCode: 'P-C-001', materialCode: 'MAT-SRV-001', materialName: '伺服电机', materialType: '外购标准件', specification: '台达ECMA-C20604RS 400W', quantity: 4, supplierName: '台达电子', purchaseStatus: '已到货' },
    { id: 'bom-001-2', projectCode: 'P-C-001', materialCode: 'MAT-ALU-001', materialName: '铝型材框架', materialType: '钣金件', specification: '40×40 6063铝合金 定制加工', quantity: 1, supplierName: '华诚精密', purchaseStatus: '已到货' },
    { id: 'bom-001-3', projectCode: 'P-C-001', materialCode: 'MAT-PLC-001', materialName: 'PLC控制器', materialType: '外购标准件', specification: '西门子S7-1200 CPU 1214C', quantity: 1, supplierName: '西门子', purchaseStatus: '已到货' },
  ],
  'P-C-002': [
    { id: 'bom-002-1', projectCode: 'P-C-002', materialCode: 'MAT-LBL-001', materialName: '标签打印头', materialType: '外购标准件', specification: '斑马 ZE500-4 打印头', quantity: 2, supplierName: '斑马科技', purchaseStatus: '已下单' },
    { id: 'bom-002-2', projectCode: 'P-C-002', materialCode: 'MAT-CYL-001', materialName: '气缸', materialType: '外购标准件', specification: 'SMC CDJ2B16-100 行程100mm', quantity: 6, supplierName: 'SMC气动', purchaseStatus: '待采购' },
  ],
  'P-C-003': [
    { id: 'bom-003-1', projectCode: 'P-C-003', materialCode: 'MAT-PRB-001', materialName: '测试探针', materialType: '机加件', specification: '弹簧探针 直径1.5mm 行程3mm', quantity: 200, supplierName: '乔峰精密', purchaseStatus: '已到货' },
    { id: 'bom-003-2', projectCode: 'P-C-003', materialCode: 'MAT-PCB-001', materialName: 'PCB转接板', materialType: '机加件', specification: 'FR4 1.6mm 定制设计 100×80mm', quantity: 10, supplierName: '自研（自动化团队）', purchaseStatus: '已到货' },
  ],
}

const reviewStore: Record<string, any[]> = {
  'P-C-001': [
    { id: 'rev-001-1', projectCode: 'P-C-001', reviewType: '方案评审1', reviewCategory: 'review', reviewDate: '2025-10-10', reviewerNames: '刘朋朋、高学才、周明', reviewResult: '通过', reviewSuggestion: '方案可行，伺服选型合理，请加快推进。' },
    { id: 'rev-001-2', projectCode: 'P-C-001', reviewType: '方案评审2', reviewCategory: 'review', reviewDate: '2025-10-25', reviewerNames: '刘朋朋、高学才、周明、张工', reviewResult: '有条件通过', reviewSuggestion: '图纸需细化夹具定位精度，补充公差标注后可进入采购阶段。' },
  ],
  'P-C-002': [
    { id: 'rev-002-1', projectCode: 'P-C-002', reviewType: '方案评审1', reviewCategory: 'review', reviewDate: '2025-12-05', reviewerNames: '刘朋朋、周明', reviewResult: '通过', reviewSuggestion: '自动贴标方案清晰，视觉定位方案合理，同意进入细化阶段。' },
  ],
  'P-C-003': [
    { id: 'rev-003-1', projectCode: 'P-C-003', reviewType: '方案评审1', reviewCategory: 'review', reviewDate: '2025-07-08', reviewerNames: '高学才、刘朋朋', reviewResult: '通过', reviewSuggestion: '探针升级方案技术可行，同意推进。' },
    { id: 'rev-003-2', projectCode: 'P-C-003', reviewType: '方案评审2', reviewCategory: 'review', reviewDate: '2025-07-20', reviewerNames: '高学才、刘朋朋、张工', reviewResult: '通过', reviewSuggestion: '图纸设计合理，可以进入采购阶段。' },
    { id: 'acc-003-1', projectCode: 'P-C-003', reviewType: '预验收', reviewCategory: 'acceptance', reviewDate: '2025-12-15', reviewerNames: '高学才、刘朋朋', reviewResult: '有条件通过', reviewSuggestion: '探针接触率已提升至99.2%，需再调试5个工作日确认稳定性后正式验收。' },
    { id: 'acc-003-2', projectCode: 'P-C-003', reviewType: '内部验收', reviewCategory: 'acceptance', reviewDate: '2025-12-28', reviewerNames: '高学才、刘朋朋、周明', reviewResult: '通过', reviewSuggestion: '测试架运行稳定，探针接触率99.5%，正式验收通过，办理设备入库手续。' },
  ],
}

let bomIdCounter = 100
let reviewIdCounter = 100

export default [
  // ── 项目列表分页 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/list',
    method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      // 仅C端和超管可见
      if (ws !== 'C' && ws !== 'ALL') {
        return { code: 200, data: { records: [], total: 0 } }
      }
      let data = projectStore.filter(p => p.workshopCode === 'C')
      if (query.projectCode) data = data.filter(p => p.projectCode.includes(query.projectCode))
      if (query.projectName) data = data.filter(p => p.projectName.includes(query.projectName))
      if (query.currentPhase) data = data.filter(p => p.currentPhase === query.currentPhase)
      if (query.status) data = data.filter(p => p.status === query.status)
      return { code: 200, data: paginate(data, query.pageNo, query.pageSize) }
    },
  },
  // ── 项目详情 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/queryById',
    method: 'get',
    response: ({ query }: any) => {
      const item = projectStore.find(p => p.id === query.id)
      return { code: 200, data: item || null }
    },
  },
  // ── 新增项目 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/add',
    method: 'post',
    response: ({ body }: any) => {
      const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
      const newItem = {
        ...body,
        id: 'proj-' + Date.now(),
        workshopCode: 'C',
        currentPhase: '1',
        status: '1',
        createTime: now,
      }
      projectStore.push(newItem)
      return { code: 200, data: newItem }
    },
  },
  // ── 编辑项目 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/edit',
    method: 'put',
    response: ({ body }: any) => {
      const idx = projectStore.findIndex(p => p.id === body.id)
      if (idx >= 0) projectStore[idx] = { ...projectStore[idx], ...body }
      return { code: 200, data: true }
    },
  },
  // ── 删除项目 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/delete',
    method: 'delete',
    response: ({ query }: any) => {
      projectStore = projectStore.filter(p => p.id !== query.id)
      return { code: 200, data: true }
    },
  },
  // ── 推进阶段 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProject/advancePhase',
    method: 'post',
    response: ({ query }: any) => {
      const idx = projectStore.findIndex(p => p.id === query.id)
      if (idx >= 0) {
        const cur = Number(projectStore[idx].currentPhase)
        if (cur < 14) {
          projectStore[idx] = { ...projectStore[idx], currentPhase: String(cur + 1) }
          if (cur + 1 === 14) {
            projectStore[idx] = { ...projectStore[idx], status: '2' }
          }
        }
      }
      return { code: 200, data: true }
    },
  },

  // ── BOM列表分页 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProjectBom/list',
    method: 'get',
    response: ({ query }: any) => {
      const code = query.projectCode || ''
      const all = bomStore[code] || []
      return { code: 200, data: paginate(all, query.pageNo, query.pageSize) }
    },
  },
  // ── 新增BOM ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProjectBom/add',
    method: 'post',
    response: ({ body }: any) => {
      const newItem = { ...body, id: 'bom-' + (++bomIdCounter) }
      const code = body.projectCode || ''
      if (!bomStore[code]) bomStore[code] = []
      bomStore[code].push(newItem)
      return { code: 200, data: newItem }
    },
  },
  // ── 删除BOM ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProjectBom/delete',
    method: 'delete',
    response: ({ query }: any) => {
      for (const code of Object.keys(bomStore)) {
        bomStore[code] = bomStore[code].filter(b => b.id !== query.id)
      }
      return { code: 200, data: true }
    },
  },

  // ── 评审/验收记录列表 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProjectReview/list',
    method: 'get',
    response: ({ query }: any) => {
      const code = query.projectCode || ''
      let all = reviewStore[code] || []
      if (query.reviewCategory) {
        all = all.filter((r: any) => r.reviewCategory === query.reviewCategory)
      }
      return { code: 200, data: paginate(all, query.pageNo, query.pageSize) }
    },
  },
  // ── 新增评审记录 ──
  {
    url: '/admin-api/workOrder/eamCustomEquipmentProjectReview/add',
    method: 'post',
    response: ({ body }: any) => {
      const newItem = { ...body, id: 'rev-' + (++reviewIdCounter) }
      const code = body.projectCode || ''
      if (!reviewStore[code]) reviewStore[code] = []
      reviewStore[code].push(newItem)
      return { code: 200, data: newItem }
    },
  },
] as MockMethod[]
