/**
 * Mock: 设备档案 + 设备类型 + 设备类别 + 设备履历 + 供应商
 * 三车间独立数据，通过 token 识别数据权限
 *
 * 升级点（2026-04-27）：
 *   1. 新增 dataSource 字段（ERP_SYNC / EAM_SELF_BUILD / EAM_MANUAL）
 *   2. C 端三棵分类树（categoryPathByType / categoryPathByProcess / categoryPathByPlan）
 *   3. C 端按真实数生成：PACK 1线15台 + 电机10线30+台 + CNC 30台 + 注塑6台 + 非标规划若干
 */

import { getWorkshopByToken } from './auth'

// ── 工具函数 ──
function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter(item => item.workshopCode === ws)
}

// ══════════════════════════════════════════════
// dataSource 枚举
// ══════════════════════════════════════════════
const dataSourceEnum = [
  { value: 'ERP_SYNC', text: 'ERP同步', tagType: 'primary', color: '#3f7be5' },
  { value: 'EAM_SELF_BUILD', text: 'EAM自制', tagType: 'warning', color: '#e69b00' },
  { value: 'EAM_MANUAL', text: 'EAM手工', tagType: 'info', color: '#7a7a7a' }
]

// ══════════════════════════════════════════════
// 设备档案数据（三车间）
// ══════════════════════════════════════════════
type Eq = Record<string, any>

// 通用字段补丁，避免每条都写 createBy 之类样板字段
function defaults(extra: Eq = {}): Eq {
  return {
    equipmentSupplier: 'S001',
    equipmentSupplierName: '华诚精密',
    equipmentMode: '',
    equipmentTag: '',
    equipmentStatus: '1',
    operationStatus: '1',
    equipmentRevstop: '1',
    sequenceNumber: 0,
    locationSn: '',
    equipmentPurchase: '2025-03-01',
    equipmentOperating: '2025-04-01',
    createTime: '2025-04-01 08:00:00',
    workshopName: 'C端车间',
    productionLineName: '',
    responsiblePersonName: '高学才',
    maintenanceUnit: '工艺部',
    maintenanceCycle: '每月例行保养',
    manufacturer: '',
    systemVersion: '',
    commProtocol: '',
    commInterface: '',
    equipmentSource: '外购',
    projectId: '',
    dataSource: 'ERP_SYNC',
    categoryPathByType: [],
    categoryPathByProcess: [],
    categoryPathByPlan: [],
    ...extra
  }
}

// ── C 端 - PACK 自动化主线（1 条，15 台细分设备）──
// type: 非标设备/自动化线体/PACK自动化线
// process: PACK工艺线/PACK主线（1条）
const PACK_LINE: Eq[] = []
const packStations = [
  // 工位 1-5（上下料 + 入壳）
  { name: 'PACK上下料工作站#1', mode: 'PACK-UL-01', sub: '工位 1-5', stationType: '上下料工作站' },
  { name: 'PACK上下料工作站#2', mode: 'PACK-UL-02', sub: '工位 1-5', stationType: '上下料工作站' },
  { name: 'PACK电芯入壳机', mode: 'PACK-IS-01', sub: '工位 1-5', stationType: '装配工作站' },
  { name: 'PACK预压机', mode: 'PACK-PR-01', sub: '工位 1-5', stationType: '装配工作站' },
  { name: 'PACK激光焊接机#1', mode: 'PACK-LW-01', sub: '工位 1-5', stationType: '装配工作站' },
  // 工位 6-10（焊接 + BMS）
  { name: 'PACK激光焊接机#2', mode: 'PACK-LW-02', sub: '工位 6-10', stationType: '装配工作站' },
  { name: 'PACK BMS 装配台', mode: 'PACK-BMS-01', sub: '工位 6-10', stationType: '装配工作站' },
  { name: 'PACK扭矩拧紧机', mode: 'PACK-TQ-01', sub: '工位 6-10', stationType: '装配工作站' },
  { name: 'PACK点胶机', mode: 'PACK-DG-01', sub: '工位 6-10', stationType: '装配工作站' },
  { name: 'PACK绝缘耐压测试仪', mode: 'PACK-IT-01', sub: '工位 6-10', stationType: '检测工作站' },
  // 工位 11-15（检测 + 出站）
  { name: 'PACK内阻测试仪', mode: 'PACK-IR-01', sub: '工位 11-15', stationType: '检测工作站' },
  { name: 'PACK气密性检测机', mode: 'PACK-AT-01', sub: '工位 11-15', stationType: '检测工作站' },
  { name: 'PACK外观检测AOI', mode: 'PACK-AOI-01', sub: '工位 11-15', stationType: '检测工作站' },
  { name: 'PACK打码贴标机', mode: 'PACK-LBL-01', sub: '工位 11-15', stationType: '装配工作站' },
  { name: 'PACK下料堆垛机', mode: 'PACK-PA-01', sub: '工位 11-15', stationType: '上下料工作站' }
]
packStations.forEach((s, i) => {
  const idx = String(i + 1).padStart(3, '0')
  const dataSource = i < 9 ? 'ERP_SYNC' : i < 12 ? 'EAM_SELF_BUILD' : 'EAM_MANUAL'
  const sn = dataSource === 'ERP_SYNC' ? `EQ-PACK-${idx}` :
             dataSource === 'EAM_SELF_BUILD' ? `EQ-FB-P${idx}` : `EQ-MN-P${idx}`
  PACK_LINE.push(defaults({
    id: `C-PACK-${idx}`,
    workshopCode: 'C',
    equipmentSn: sn,
    equipmentName: s.name,
    equipmentMode: s.mode,
    equipmentType: 'T001',
    equipmentTypeDesc: '非标设备',
    equipmentCategory: 'C002',
    equipmentCategoryDesc: '关键设备',
    equipmentTag: 'C端-PACK主线',
    locationSn: `C-PACK-${idx}`,
    sequenceNumber: i + 1,
    productionLineName: 'PACK 主线',
    responsiblePersonName: '刘朋朋',
    manufacturer: dataSource === 'EAM_SELF_BUILD' ? '自研（自动化团队）' : '联赢智能',
    systemVersion: 'WinCC RT V18',
    commProtocol: 'OPC-UA',
    commInterface: '以太网接口',
    equipmentSource: dataSource === 'EAM_SELF_BUILD' ? '自研' : '外购',
    dataSource,
    categoryPathByType: ['非标设备', '自动化线体', 'PACK 自动化线'],
    categoryPathByProcess: ['PACK 工艺线', 'PACK 主线（1 条）', s.sub]
  }))
})

// ── C 端 - 电机装配工艺线（10 条，每条 3 段 × 3-5 台）──
const MOTOR_LINES: Eq[] = []
const motorSegments = [
  { seg: '转子装配段', stationType: '装配工作站' },
  { seg: '定子装配段', stationType: '装配工作站' },
  { seg: '整机测试段', stationType: '检测工作站' }
]
const motorMachinesPerSeg = [
  { suffix: '上料机', mode: 'MTR-UL', kind: '半自动设备', cat: '半自动压合机' },
  { suffix: '装配机', mode: 'MTR-AS', kind: '自动化线体', cat: '电机自动化装配线' },
  { suffix: '测试台', mode: 'MTR-TST', kind: '自动化工作站', cat: '检测工作站' }
]
let motorIdCounter = 0
for (let line = 1; line <= 10; line++) {
  // 第 1-3 条 / 第 4-6 条 / 第 7-10 条 三组
  const groupLabel =
    line <= 3 ? '电机线 1-3' :
    line <= 6 ? '电机线 4-6' : '电机线 7-10'
  for (const seg of motorSegments) {
    for (const m of motorMachinesPerSeg) {
      motorIdCounter += 1
      const idx = String(motorIdCounter).padStart(3, '0')
      const dsCycle = motorIdCounter % 5
      const dataSource =
        dsCycle === 0 ? 'EAM_SELF_BUILD' :
        dsCycle === 1 ? 'EAM_MANUAL' : 'ERP_SYNC'
      const sn = dataSource === 'ERP_SYNC' ? `EQ-MTR-${idx}` :
                 dataSource === 'EAM_SELF_BUILD' ? `EQ-FB-M${idx}` : `EQ-MN-M${idx}`
      MOTOR_LINES.push(defaults({
        id: `C-MTR-${idx}`,
        workshopCode: 'C',
        equipmentSn: sn,
        equipmentName: `电机线#${line}-${seg.seg}-${m.suffix}`,
        equipmentMode: `${m.mode}-${line}`,
        equipmentType: 'T001',
        equipmentTypeDesc: '非标设备',
        equipmentCategory: 'C001',
        equipmentCategoryDesc: '重点设备',
        equipmentTag: `C端-电机线#${line}`,
        locationSn: `C-MTR-${line}-${idx}`,
        sequenceNumber: motorIdCounter,
        productionLineName: `电机装配线 #${line}`,
        responsiblePersonName: '高学才',
        manufacturer: '联赢激光',
        systemVersion: 'TwinCAT 3',
        commProtocol: 'EtherCAT',
        commInterface: '以太网接口',
        equipmentSource: dataSource === 'EAM_SELF_BUILD' ? '自研' : '外购',
        dataSource,
        categoryPathByType: ['非标设备', m.kind, m.cat],
        categoryPathByProcess: ['电机装配工艺线（10 条）', groupLabel, seg.seg]
      }))
    }
  }
}

// ── C 端 - 来料检验（独立 3 段，6 台）──
const IQC_EQUIPMENTS: Eq[] = []
const iqcSpecs = [
  { name: 'AOI 外观检测仪', mode: 'IQC-AOI-01', seg: '外观检验段', cat: '检测工作站' },
  { name: '高分辨率显微镜', mode: 'IQC-MSC-01', seg: '外观检验段', cat: '检测工作站' },
  { name: '影像测量仪', mode: 'IQC-IMG-01', seg: '尺寸检验段', cat: '检测工作站' },
  { name: '三坐标测量机', mode: 'IQC-CMM-01', seg: '尺寸检验段', cat: '检测工作站' },
  { name: '电池容量测试柜', mode: 'IQC-BAT-01', seg: '性能检验段', cat: '检测工作站' },
  { name: '内阻测试仪', mode: 'IQC-IR-02', seg: '性能检验段', cat: '检测工作站' }
]
iqcSpecs.forEach((s, i) => {
  const idx = String(i + 1).padStart(3, '0')
  const dataSource = i < 4 ? 'ERP_SYNC' : 'EAM_MANUAL'
  const sn = dataSource === 'ERP_SYNC' ? `EQ-IQC-${idx}` : `EQ-MN-Q${idx}`
  IQC_EQUIPMENTS.push(defaults({
    id: `C-IQC-${idx}`,
    workshopCode: 'C',
    equipmentSn: sn,
    equipmentName: s.name,
    equipmentMode: s.mode,
    equipmentType: 'T004',
    equipmentTypeDesc: '测试仪器',
    equipmentCategory: 'C002',
    equipmentCategoryDesc: '关键设备',
    equipmentTag: 'C端-来料检验',
    locationSn: `C-IQC-${idx}`,
    sequenceNumber: i + 1,
    productionLineName: '来料检验',
    responsiblePersonName: '高学才',
    manufacturer: '基恩士',
    dataSource,
    categoryPathByType: ['非标设备', '自动化工作站', '检测工作站'],
    categoryPathByProcess: ['来料检验', s.seg]
  }))
})

// ── C 端 - 工具类（电批/点胶机/手持工具，作为 byType 树补充）──
const C_TOOL_EQUIPMENTS: Eq[] = []
const cTools = [
  { name: '直流智能电批 #1', mode: 'EB-DC-01', third: '直流电批', second: '电批' },
  { name: '直流智能电批 #2', mode: 'EB-DC-02', third: '直流电批', second: '电批' },
  { name: '交流电批 #1', mode: 'EB-AC-01', third: '交流电批', second: '电批' },
  { name: '智能扭矩电批 #1', mode: 'EB-TQ-01', third: '智能扭矩电批', second: '电批' },
  { name: '单组分点胶机 #1', mode: 'DG-S-01', third: '单组分点胶机', second: '手动点胶机' },
  { name: '双组分点胶机 #1', mode: 'DG-D-01', third: '双组分点胶机', second: '手动点胶机' },
  { name: '热风枪 #1', mode: 'HG-01', third: '热风枪', second: '其他手持工具' },
  { name: '烙铁台 #1', mode: 'IR-01', third: '烙铁台', second: '其他手持工具' }
]
cTools.forEach((t, i) => {
  const idx = String(i + 1).padStart(3, '0')
  const dataSource = i < 4 ? 'ERP_SYNC' : i < 6 ? 'EAM_SELF_BUILD' : 'EAM_MANUAL'
  const sn = dataSource === 'ERP_SYNC' ? `EQ-TOOL-${idx}` :
             dataSource === 'EAM_SELF_BUILD' ? `EQ-FB-T${idx}` : `EQ-MN-T${idx}`
  C_TOOL_EQUIPMENTS.push(defaults({
    id: `C-TOOL-${idx}`,
    workshopCode: 'C',
    equipmentSn: sn,
    equipmentName: t.name,
    equipmentMode: t.mode,
    equipmentType: 'T002',
    equipmentTypeDesc: '工具类设备',
    equipmentCategory: 'C007',
    equipmentCategoryDesc: '手持电动工具',
    equipmentTag: 'C端-工具',
    locationSn: `C-TL-${idx}`,
    sequenceNumber: i + 1,
    responsiblePersonName: '刘朋朋',
    manufacturer: '日东工器',
    dataSource,
    categoryPathByType: ['工具类设备', t.second, t.third],
    categoryPathByProcess: []
  }))
})

// ── C 端 - 加工类（压机/台钻/切割机）──
const C_MACHINE_EQUIPMENTS: Eq[] = []
const cMachines = [
  { name: '液压压机 #1', mode: 'HP-100', third: '液压压机', second: '压机' },
  { name: '伺服压机 #1', mode: 'SP-50', third: '伺服压机', second: '压机' },
  { name: '气动压机 #1', mode: 'PP-30', third: '气动压机', second: '压机' },
  { name: '立式台钻 #1', mode: 'TD-V01', third: '立式台钻', second: '台钻' },
  { name: '摇臂钻 #1', mode: 'TD-R01', third: '摇臂钻', second: '台钻' },
  { name: '切割机 #1', mode: 'CT-01', third: '切割机', second: '其他加工' }
]
cMachines.forEach((m, i) => {
  const idx = String(i + 1).padStart(3, '0')
  const dataSource = i < 4 ? 'ERP_SYNC' : 'EAM_MANUAL'
  const sn = dataSource === 'ERP_SYNC' ? `EQ-MCH-${idx}` : `EQ-MN-X${idx}`
  C_MACHINE_EQUIPMENTS.push(defaults({
    id: `C-MCH-${idx}`,
    workshopCode: 'C',
    equipmentSn: sn,
    equipmentName: m.name,
    equipmentMode: m.mode,
    equipmentType: 'T003',
    equipmentTypeDesc: '加工类设备',
    equipmentCategory: 'C001',
    equipmentCategoryDesc: '重点设备',
    equipmentTag: 'C端-加工',
    locationSn: `C-MC-${idx}`,
    sequenceNumber: i + 1,
    responsiblePersonName: '高学才',
    manufacturer: '华诚精密',
    dataSource,
    categoryPathByType: ['加工类设备', m.second, m.third],
    categoryPathByProcess: []
  }))
})

// ── C 端 - 非标规划（未投产，状态=规划中=stop）──
const C_PLAN_EQUIPMENTS: Eq[] = []
const planSpecs = [
  { name: 'PACK 自动上下料站（规划）', mode: 'PLAN-UL-PK', third: 'PACK 上下料', second: '自动上下料规划' },
  { name: 'PACK 自动上下料站#2（规划）', mode: 'PLAN-UL-PK2', third: 'PACK 上下料', second: '自动上下料规划' },
  { name: '电机自动上下料站（规划）', mode: 'PLAN-UL-MT', third: '电机上下料', second: '自动上下料规划' },
  { name: '电机自动上下料站#2（规划）', mode: 'PLAN-UL-MT2', third: '电机上下料', second: '自动上下料规划' },
  { name: 'CNC 自动上下料桁架（规划）', mode: 'PLAN-UL-CNC', third: 'CNC 上下料', second: '自动上下料规划' },
  { name: 'AOI 在线检测系统（规划）', mode: 'PLAN-AOI-ON', third: 'AOI 在线', second: '检测规划' },
  { name: '离线 AOI（规划）', mode: 'PLAN-AOI-OFF', third: '离线 AOI', second: '检测规划' },
  { name: '三坐标测量（规划）', mode: 'PLAN-CMM', third: '三坐标', second: '检测规划' },
  { name: '影像测量（规划）', mode: 'PLAN-IMG', third: '影像测量', second: '检测规划' },
  { name: '超声波清洗机（规划）', mode: 'PLAN-CLN-US', third: '超声波清洗', second: '清洗机规划' },
  { name: '超声波清洗机#2（规划）', mode: 'PLAN-CLN-US2', third: '超声波清洗', second: '清洗机规划' },
  { name: '等离子清洗机（规划）', mode: 'PLAN-CLN-PL', third: '等离子清洗', second: '清洗机规划' },
  { name: '光纤激光打标机（规划）', mode: 'PLAN-LSR-FB', third: '光纤激光', second: '激光打标规划' },
  { name: '紫外激光打标机（规划）', mode: 'PLAN-LSR-UV', third: '紫外激光', second: '激光打标规划' }
]
planSpecs.forEach((p, i) => {
  const idx = String(i + 1).padStart(3, '0')
  C_PLAN_EQUIPMENTS.push(defaults({
    id: `C-PLAN-${idx}`,
    workshopCode: 'C',
    equipmentSn: `EQ-FB-PLAN${idx}`,  // 规划设备全部为 EAM 自制
    equipmentName: p.name,
    equipmentMode: p.mode,
    equipmentType: 'T001',
    equipmentTypeDesc: '非标设备',
    equipmentCategory: 'C002',
    equipmentCategoryDesc: '关键设备',
    equipmentTag: 'C端-规划',
    locationSn: '',
    sequenceNumber: i + 1,
    productionLineName: p.second,
    responsiblePersonName: '刘朋朋',
    manufacturer: '自研（自动化团队）',
    equipmentStatus: '5',     // 规划中
    operationStatus: '4',     // 故障/停机（规划态用停机示意）
    equipmentRevstop: '2',    // 停用
    equipmentSource: '自研',
    dataSource: 'EAM_SELF_BUILD',
    categoryPathByType: [],
    categoryPathByProcess: [],
    categoryPathByPlan: [p.second, p.third]
  }))
})

// ── C 端汇总 ──
const C_EQUIPMENTS = [
  ...PACK_LINE,
  ...MOTOR_LINES,
  ...IQC_EQUIPMENTS,
  ...C_TOOL_EQUIPMENTS,
  ...C_MACHINE_EQUIPMENTS,
  ...C_PLAN_EQUIPMENTS
]

// ── B 端车间（沿用原 5 条 + 加 dataSource）──
const B_EQUIPMENTS: Eq[] = [
  defaults({ id: 'B01', workshopCode: 'B', equipmentSn: 'EQ-B-001', equipmentName: '冷媒检漏仪', equipmentType: 'T004', equipmentTypeDesc: '测试仪器', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'GS-H3', equipmentTag: 'B端', locationSn: 'B-QC-01', equipmentSupplier: 'S008', equipmentSupplierName: '工艺部', sequenceNumber: 1, equipmentPurchase: '2025-01-10', equipmentOperating: '2025-02-01', createTime: '2025-02-01 08:00:00', workshopName: 'B端车间', responsiblePersonName: '买盼', dataSource: 'ERP_SYNC' }),
  defaults({ id: 'B02', workshopCode: 'B', equipmentSn: 'EQ-B-002', equipmentName: '自动锁螺丝机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'ASM-4', equipmentTag: 'B端', locationSn: 'B-PD-01', equipmentSupplier: 'S016', equipmentSupplierName: '快克智能', sequenceNumber: 2, equipmentPurchase: '2025-02-10', equipmentOperating: '2025-03-01', createTime: '2025-03-01 08:00:00', workshopName: 'B端车间', responsiblePersonName: '买盼', dataSource: 'ERP_SYNC' }),
  defaults({ id: 'B03', workshopCode: 'B', equipmentSn: 'EQ-B-003', equipmentName: '手动PACK压装机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C001', equipmentCategoryDesc: '重点设备', equipmentMode: 'MP-200', equipmentTag: 'B端', locationSn: 'B-PK-01', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', sequenceNumber: 3, equipmentPurchase: '2025-01-20', equipmentOperating: '2025-02-15', createTime: '2025-02-15 08:00:00', workshopName: 'B端车间', responsiblePersonName: '买盼', dataSource: 'EAM_MANUAL' }),
  defaults({ id: 'B04', workshopCode: 'B', equipmentSn: 'EQ-B-004', equipmentName: '电阻自动焊接机', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', equipmentCategory: 'C002', equipmentCategoryDesc: '关键设备', equipmentMode: 'RW-100', equipmentTag: 'B端', locationSn: 'B-PD-02', equipmentSupplier: 'S017', equipmentSupplierName: '联赢激光', sequenceNumber: 4, equipmentPurchase: '2025-03-01', equipmentOperating: '2025-03-15', createTime: '2025-03-15 08:00:00', workshopName: 'B端车间', responsiblePersonName: '买盼', dataSource: 'ERP_SYNC' }),
  defaults({ id: 'B05', workshopCode: 'B', equipmentSn: 'EQ-MN-B005', equipmentName: '电批（工具）', equipmentType: 'T002', equipmentTypeDesc: '工具类设备', equipmentCategory: 'C007', equipmentCategoryDesc: '手持电动工具', equipmentMode: 'ED-10', equipmentTag: 'B端', locationSn: 'B-PD-03', equipmentSupplier: 'S018', equipmentSupplierName: '日东工器', sequenceNumber: 5, equipmentPurchase: '2025-02-20', equipmentOperating: '2025-03-01', createTime: '2025-03-01 08:00:00', workshopName: 'B端车间', responsiblePersonName: '买盼', dataSource: 'EAM_MANUAL' })
]

// ── 数控机加车间（CNC 30 + 注塑 6）──
const CNC_EQUIPMENTS: Eq[] = []
// 铣削 CNC 8 台
const millingSpecs = [
  { sn: 'A1', name: 'CNC铣削加工中心', mode: 'T-7', supplier: 'S009', supplierName: '乔峰', sys: 'FANUC系统0i-MF' },
  { sn: 'A2', name: 'CNC铣削加工中心', mode: 'T-700B', supplier: 'S010', supplierName: '台群', sys: '三菱系统M80' },
  { sn: 'A3', name: 'CNC铣削加工中心', mode: 'T-600B', supplier: 'S010', supplierName: '台群', sys: '三菱系统M80' },
  { sn: 'A4', name: 'CNC铣削加工中心', mode: 'VF2', supplier: 'S011', supplierName: '哈斯', sys: '哈斯系统' },
  { sn: 'A5', name: 'CNC铣削加工中心', mode: 'VF3', supplier: 'S011', supplierName: '哈斯', sys: '哈斯系统' },
  { sn: 'A6', name: 'CNC铣削加工中心', mode: 'NMC630', supplier: 'S012', supplierName: '华中', sys: '华中系统' },
  { sn: 'A7', name: 'CNC铣削加工中心', mode: 'NMC850', supplier: 'S012', supplierName: '华中', sys: '华中系统' },
  { sn: 'A8', name: 'CNC铣削加工中心', mode: 'V850', supplier: 'S010', supplierName: '台群', sys: '三菱系统M80' }
]
millingSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-MIL-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: s.name,
    equipmentMode: s.mode,
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-${s.sn}`,
    equipmentSupplier: s.supplier,
    equipmentSupplierName: s.supplierName,
    sequenceNumber: i + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: s.supplierName,
    systemVersion: s.sys,
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    dataSource: 'ERP_SYNC'
  }))
})
// 铣磨 CNC 6 台
const grindSpecs = [
  { sn: 'B1', mode: 'T-V856H' }, { sn: 'B2', mode: 'T-V856H' },
  { sn: 'B3', mode: 'NMV1060' }, { sn: 'B4', mode: 'NMV1060' },
  { sn: 'B5', mode: 'V856B' },   { sn: 'B6', mode: 'V856B' }
]
grindSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-GRD-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: 'CNC铣磨加工中心',
    equipmentMode: s.mode,
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-${s.sn}`,
    equipmentSupplier: 'S010',
    equipmentSupplierName: '台群',
    sequenceNumber: 8 + i + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '台群',
    systemVersion: '三菱系统M80',
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    dataSource: i < 4 ? 'ERP_SYNC' : 'EAM_MANUAL'
  }))
})
// 车铣磨 5 台
const turnGrindSpecs = [
  { sn: 'TM1', mode: 'TGM-300' }, { sn: 'TM2', mode: 'TGM-300' },
  { sn: 'TM3', mode: 'TGM-500' }, { sn: 'TM4', mode: 'TGM-500' },
  { sn: 'TM5', mode: 'TGM-650' }
]
turnGrindSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-TGM-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: 'CNC车铣磨加工中心',
    equipmentMode: s.mode,
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-${s.sn}`,
    equipmentSupplier: 'S013',
    equipmentSupplierName: '广数',
    sequenceNumber: 14 + i + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '广数',
    systemVersion: '广数系统980TC',
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    dataSource: 'ERP_SYNC'
  }))
})
// 车削 NC 6 台
const turnSpecs = [
  { sn: 'C1', mode: 'C320K TT' }, { sn: 'C2', mode: 'C320K TT' },
  { sn: 'C3', mode: 'C480K' },    { sn: 'C4', mode: 'C480K' },
  { sn: 'C5', mode: 'C320Y' },    { sn: 'C6', mode: 'C320Y' }
]
turnSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-TRN-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: 'NC车削加工机',
    equipmentMode: s.mode,
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-${s.sn}`,
    equipmentSupplier: 'S014',
    equipmentSupplierName: '锐锋',
    sequenceNumber: 19 + i + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '锐锋',
    systemVersion: '新代系统22TB',
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    dataSource: i < 4 ? 'ERP_SYNC' : 'EAM_SELF_BUILD'
  }))
})
// 车铣复合 5 台
const compositeSpecs = [
  { sn: 'CT1', mode: '6146SY' }, { sn: 'CT2', mode: '6146SY' },
  { sn: 'CT3', mode: '6266MY' }, { sn: 'CT4', mode: '6266MY' },
  { sn: 'CT5', mode: '6800MY' }
]
compositeSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-CMP-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: '车铣复合加工机',
    equipmentMode: s.mode,
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-${s.sn}`,
    equipmentSupplier: 'S014',
    equipmentSupplierName: '锐锋',
    sequenceNumber: 25 + i + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '锐锋',
    systemVersion: '新代系统22TB',
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    dataSource: 'ERP_SYNC'
  }))
})
// 注塑 6 台
const injectSpecs = [
  { sn: 'INJ-001', mode: 'MA1200' }, { sn: 'INJ-002', mode: 'MA900' },
  { sn: 'INJ-003', mode: 'MA1600' }, { sn: 'INJ-004', mode: 'MA600' },
  { sn: 'INJ-005', mode: 'MA1900' }, { sn: 'INJ-006', mode: 'MA2500' }
]
injectSpecs.forEach((s, i) => {
  CNC_EQUIPMENTS.push(defaults({
    id: `N-INJ-${String(i + 1).padStart(3, '0')}`,
    workshopCode: 'CNC',
    equipmentSn: s.sn,
    equipmentName: '注塑机',
    equipmentMode: s.mode,
    equipmentType: 'T006',
    equipmentTypeDesc: '注塑设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-注塑',
    locationSn: `INJ-${String(i + 1).padStart(2, '0')}`,
    equipmentSupplier: 'S015',
    equipmentSupplierName: '海天国际',
    sequenceNumber: 30 + i + 1,
    workshopName: '数控机加车间',
    productionLineName: '注塑车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '海天国际',
    systemVersion: '海天控制系统',
    commProtocol: 'Modbus-RTU',
    commInterface: '9针串口(RS485,RS232)',
    dataSource: i < 4 ? 'ERP_SYNC' : 'EAM_MANUAL'
  }))
})

// ── 全部设备汇总 ──
const equipmentList: Eq[] = [
  ...C_EQUIPMENTS,
  ...B_EQUIPMENTS,
  ...CNC_EQUIPMENTS
]

// ── 枚举 ──
const statusEnum = [
  { value: '1', text: '正常', type: 'success' },
  { value: '2', text: '停用', type: 'danger' },
  { value: '3', text: '维修中', type: 'warning' },
  { value: '4', text: '报废', type: 'info' },
  { value: '5', text: '规划中', type: 'warning' },
]
const operationStatusEnum = [
  { value: '1', text: '运行', type: 'success' },
  { value: '2', text: '停机', type: 'danger' },
  { value: '3', text: '待机', type: 'warning' },
  { value: '4', text: '故障', type: 'danger' },
]
const revstopEnum = [
  { value: '1', text: '启用', type: 'success' },
  { value: '2', text: '停用', type: 'danger' },
]

// ── 设备类型/类别 ──
const typeTree = [
  { key: 'T001', title: '非标设备', parentKey: null, children: [
    { key: 'T001-1', title: '自动化工作站', parentKey: 'T001' },
    { key: 'T001-2', title: '自动化线体', parentKey: 'T001' },
    { key: 'T001-3', title: '半自动设备', parentKey: 'T001' },
  ]},
  { key: 'T002', title: '工具类设备', parentKey: null },
  { key: 'T003', title: '加工类设备', parentKey: null },
  { key: 'T004', title: '测试仪器', parentKey: null },
  { key: 'T005', title: '数控设备', parentKey: null, children: [
    { key: 'T005-1', title: '铣削CNC', parentKey: 'T005' },
    { key: 'T005-2', title: '车铣磨CNC', parentKey: 'T005' },
    { key: 'T005-3', title: '车削NC', parentKey: 'T005' },
  ]},
  { key: 'T006', title: '注塑设备', parentKey: null },
]
const categoryTree = [
  { key: 'C001', title: '重点设备', parentKey: null },
  { key: 'C002', title: '关键设备', parentKey: null },
  { key: 'C003', title: '标品设备', parentKey: null },
  { key: 'C004', title: '安全设施', parentKey: null },
  { key: 'C007', title: '手持电动工具', parentKey: null },
]

// ── 手动 ERP 同步：暴露 push 方法（被 erp-sync mock 复用，所以挂在模块级）──
export function pushSyncedEquipment(materialNo?: string) {
  const idx = String(equipmentList.length + 1).padStart(3, '0')
  const sn = `EQ-CNC-SYNC-${idx}`
  const newOne = defaults({
    id: `SYNC-${Date.now()}`,
    workshopCode: 'CNC',
    equipmentSn: sn,
    equipmentName: `ERP同步设备-${materialNo || idx}`,
    equipmentMode: 'SYNC-MODEL',
    equipmentType: 'T005',
    equipmentTypeDesc: '数控设备',
    equipmentCategory: 'C003',
    equipmentCategoryDesc: '标品设备',
    equipmentTag: '数控-CNC',
    locationSn: `CNC-SYNC-${idx}`,
    equipmentSupplier: 'S010',
    equipmentSupplierName: '台群',
    sequenceNumber: equipmentList.length + 1,
    workshopName: '数控机加车间',
    productionLineName: 'CNC车间',
    responsiblePersonName: '刚嘉成',
    maintenanceCycle: '按设备说明书',
    manufacturer: '台群',
    systemVersion: '三菱系统M80',
    commProtocol: 'Modbus-TCP',
    commInterface: '以太网接口',
    createTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
    dataSource: 'ERP_SYNC'
  })
  equipmentList.push(newOne)
  return newOne
}

export { dataSourceEnum }

export default [
  // ── 设备档案（按车间过滤） ──
  {
    url: '/admin-api/equipment/optEquipment/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(equipmentList, ws)
      if (query?.equipmentSn) data = data.filter(e => (e.equipmentSn || '').includes(query.equipmentSn))
      if (query?.equipmentName) data = data.filter(e => (e.equipmentName || '').includes(query.equipmentName))
      if (query?.equipmentType) data = data.filter(e => e.equipmentType === query.equipmentType)
      if (query?.equipmentCategory) data = data.filter(e => e.equipmentCategory === query.equipmentCategory)
      if (query?.dataSource) data = data.filter(e => e.dataSource === query.dataSource)
      // 三棵树过滤（categoryPath 是 string[]，URL 上传逗号分隔）
      if (query?.categoryPathByType) {
        const path = String(query.categoryPathByType).split(',').filter(Boolean)
        data = data.filter(e => path.every((p, idx) => (e.categoryPathByType || [])[idx] === p))
      }
      if (query?.categoryPathByProcess) {
        const path = String(query.categoryPathByProcess).split(',').filter(Boolean)
        data = data.filter(e => path.every((p, idx) => (e.categoryPathByProcess || [])[idx] === p))
      }
      if (query?.categoryPathByPlan) {
        const path = String(query.categoryPathByPlan).split(',').filter(Boolean)
        data = data.filter(e => path.every((p, idx) => (e.categoryPathByPlan || [])[idx] === p))
      }
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/equipment/optEquipment/queryById',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: equipmentList.find(e => e.id === query?.id) || null })
  },
  { url: '/admin-api/equipment/optEquipment/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/equipment/optEquipment/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/delete', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/deleteBatch', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/equipment/optEquipment/listOfStatus', method: 'get', response: () => ({ code: 200, data: statusEnum }) },
  { url: '/admin-api/equipment/optEquipment/listOfOperationStatus', method: 'get', response: () => ({ code: 200, data: operationStatusEnum }) },
  { url: '/admin-api/equipment/optEquipment/listOfMode', method: 'get', response: () => ({ code: 200, data: revstopEnum }) },
  { url: '/admin-api/equipment/optEquipment/listOfDataSource', method: 'get', response: () => ({ code: 200, data: dataSourceEnum }) },

  // ── 手动 ERP 同步（按物料号或时间范围）──
  {
    url: '/admin-api/equipment/optEquipment/syncFromErp',
    method: 'post',
    response: ({ body }) => {
      const materialNo = body?.materialNo
      const newOne = pushSyncedEquipment(materialNo)
      return { code: 200, data: newOne }
    }
  },

  // ── 设备类型下拉 ──
  { url: '/admin-api/mdm/eamBaseEquipmentType/scanDeviceTypeList', method: 'get', response: () => ({
    code: 200,
    data: [
      { typeCode: 'T001', typeName: '非标设备' },
      { typeCode: 'T002', typeName: '工具类设备' },
      { typeCode: 'T003', typeName: '加工类设备' },
      { typeCode: 'T004', typeName: '测试仪器' },
      { typeCode: 'T005', typeName: '数控设备' },
      { typeCode: 'T006', typeName: '注塑设备' },
    ]
  })},

  // ── 设备类型 ──
  { url: '/admin-api/mdm/eamBaseEquipmentType/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate(typeTree.flatMap(t => [
      { id: t.key, code: t.key, name: t.title, parentCode: '', seq: 0, createTime: '2025-01-01' },
      ...(t.children || []).map(c => ({ id: c.key, code: c.key, name: c.title, parentCode: t.key, seq: 0, createTime: '2025-01-01' }))
    ]), query?.pageNo, query?.pageSize || 50)
  })},
  { url: '/admin-api/mdm/eamBaseEquipmentType/tree', method: 'get', response: () => ({ code: 200, data: typeTree }) },

  // ── 设备类别 ──
  { url: '/admin-api/mdm/eamBaseEquipmentCategory/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate(categoryTree.map(c => ({ id: c.key, code: c.key, name: c.title, parentCode: '', seq: 0, createTime: '2025-01-01' })), query?.pageNo, query?.pageSize || 50)
  })},
  { url: '/admin-api/mdm/eamBaseEquipmentCategory/tree', method: 'get', response: () => ({ code: 200, data: categoryTree }) },

  // ── 设备履历（按车间过滤） ──
  {
    url: '/admin-api/equipment/deviceLedger/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(equipmentList, ws)
      if (query?.equipmentSn) data = data.filter(e => (e.equipmentSn || '').includes(query.equipmentSn))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },

  // ── 供应商 ──
  { url: '/admin-api/equipment/optSupplier/list', method: 'get', response: ({ query }) => {
    const suppliers = [
      { id: 'S001', code: 'S001', name: '华诚精密', category: '设备', status: '1', createTime: '2025-01-01' },
      { id: 'S004', code: 'S004', name: '自研（自动化团队）', category: '非标', status: '1', createTime: '2025-01-01' },
      { id: 'S009', code: 'S009', name: '乔峰', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S010', code: 'S010', name: '台群', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S011', code: 'S011', name: '哈斯', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S012', code: 'S012', name: '华中', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S013', code: 'S013', name: '广数', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S014', code: 'S014', name: '锐锋', category: 'CNC', status: '1', createTime: '2025-01-01' },
      { id: 'S015', code: 'S015', name: '海天国际', category: '注塑', status: '1', createTime: '2025-01-01' },
      { id: 'S016', code: 'S016', name: '快克智能', category: '设备', status: '1', createTime: '2025-01-01' },
      { id: 'S017', code: 'S017', name: '联赢激光', category: '设备', status: '1', createTime: '2025-01-01' },
      { id: 'S018', code: 'S018', name: '日东工器', category: '工具', status: '1', createTime: '2025-01-01' },
    ]
    return { code: 200, data: paginate(suppliers, query?.pageNo, query?.pageSize) }
  }},
]
