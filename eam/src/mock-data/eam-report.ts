// EAM 报表中心 mock 数据：12 个月趋势 + 当月明细
// 单一来源，4 个报表页面共用过滤
type Plant = 'C' | 'B' | 'CNC' | 'ALL'

const MONTHS = ['2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02', '2026-03', '2026-04']

// ════ 综合驾驶舱（KPI + 趋势）════
const dashboard = {
  kpis: {
    ALL: { equipmentCount: 86, oeeAvg: 82.5, monthWoCount: 124, monthRepairCost: 168200 },
    C:   { equipmentCount: 32, oeeAvg: 79.8, monthWoCount: 48,  monthRepairCost: 62100 },
    B:   { equipmentCount: 28, oeeAvg: 81.2, monthWoCount: 41,  monthRepairCost: 48700 },
    CNC: { equipmentCount: 26, oeeAvg: 86.6, monthWoCount: 35,  monthRepairCost: 57400 }
  },
  oeeTrend: {
    ALL: [78.2, 79.6, 80.1, 81.5, 82.3, 80.8, 79.4, 81.7, 83.2, 82.1, 83.5, 82.5],
    C:   [76.5, 77.8, 78.2, 79.0, 80.1, 78.8, 76.2, 78.9, 80.5, 79.6, 81.2, 79.8],
    B:   [78.0, 79.5, 80.6, 81.4, 82.1, 80.5, 79.1, 81.3, 82.7, 81.8, 82.9, 81.2],
    CNC: [82.5, 84.1, 85.3, 86.2, 87.0, 85.6, 83.9, 86.5, 87.8, 86.9, 87.6, 86.6]
  },
  woTrend: {
    ALL: { maint: [98, 105, 110, 95, 102, 88, 92, 108, 115, 100, 118, 112], repair: [22, 28, 25, 19, 23, 18, 21, 26, 30, 24, 28, 32], inspection: [60, 62, 64, 58, 61, 56, 59, 63, 65, 60, 66, 68] },
    C:   { maint: [38, 42, 44, 36, 40, 33, 35, 41, 45, 39, 46, 43], repair: [9, 11, 10, 7, 9, 7, 8, 10, 12, 9, 11, 13], inspection: [22, 23, 24, 21, 22, 20, 21, 23, 24, 22, 24, 25] },
    B:   { maint: [32, 34, 36, 30, 33, 28, 30, 35, 37, 32, 38, 36], repair: [7, 9, 8, 6, 7, 5, 6, 8, 9, 7, 9, 10], inspection: [20, 21, 21, 19, 20, 18, 19, 21, 22, 20, 22, 23] },
    CNC: { maint: [28, 29, 30, 29, 29, 27, 27, 32, 33, 29, 34, 33], repair: [6, 8, 7, 6, 7, 6, 7, 8, 9, 8, 8, 9],   inspection: [18, 18, 19, 18, 19, 18, 19, 19, 19, 18, 20, 20] }
  },
  faultTopEquipment: {
    ALL: [{ name: '注塑机 INJ-001', count: 14 }, { name: '电阻焊接机 RW-30', count: 11 }, { name: 'CNC 加工中心 MA1200', count: 9 }, { name: '点胶机 PACK-A1', count: 8 }, { name: '检测设备 DET-001', count: 7 }, { name: '自动锁螺丝机 ASM-4', count: 6 }, { name: '轻型手动压机 LP-50', count: 5 }, { name: 'AOI 检测机', count: 5 }, { name: 'PLC 控制柜', count: 4 }, { name: 'PCBA 测试架', count: 4 }],
    C:   [{ name: '点胶机 PACK-A1', count: 8 }, { name: '轻型手动压机 LP-50', count: 5 }, { name: 'PCBA 测试架', count: 4 }, { name: '电机扁线绕线机', count: 4 }, { name: 'AOI 检测机', count: 3 }, { name: 'PLC 控制柜', count: 2 }],
    B:   [{ name: '电阻焊接机 RW-30', count: 11 }, { name: '检测设备 DET-001', count: 7 }, { name: '自动锁螺丝机 ASM-4', count: 6 }, { name: '气路控制柜', count: 3 }, { name: 'B端贴标机', count: 2 }],
    CNC: [{ name: '注塑机 INJ-001', count: 14 }, { name: 'CNC 加工中心 MA1200', count: 9 }, { name: '车铣复合 CNC-V8', count: 4 }, { name: '油雾分离器', count: 3 }, { name: '冷却液泵', count: 2 }]
  },
  partsConsumePie: {
    ALL: [{ name: '润滑油液类', value: 28560 }, { name: '电气元件', value: 35280 }, { name: '机械传动件', value: 21640 }, { name: '密封/橡胶件', value: 12480 }, { name: '检测耗材', value: 8520 }, { name: '其他', value: 4720 }],
    C:   [{ name: '电气元件', value: 18560 }, { name: '检测耗材', value: 6240 }, { name: '密封件', value: 4680 }, { name: '机械件', value: 3920 }, { name: '其他', value: 1500 }],
    B:   [{ name: '焊头电极', value: 12800 }, { name: '电气元件', value: 9540 }, { name: '气路接头', value: 5680 }, { name: '检测耗材', value: 2280 }, { name: '其他', value: 1200 }],
    CNC: [{ name: '润滑液压油', value: 22300 }, { name: '机械传动件', value: 13800 }, { name: '电气元件', value: 7180 }, { name: '冷却液', value: 5260 }, { name: '其他', value: 2020 }]
  }
}

// ════ 维保统计 ════
const maintenance = {
  completionRate: {
    ALL: { plan: [98, 100, 105, 92, 96, 88, 92, 102, 108, 96, 110, 105], actual: [95, 99, 101, 88, 93, 86, 90, 100, 106, 94, 108, 103] },
    C:   { plan: [38, 40, 42, 35, 38, 33, 35, 40, 43, 38, 44, 41], actual: [37, 39, 41, 34, 37, 32, 34, 39, 42, 37, 43, 40] },
    B:   { plan: [32, 33, 35, 29, 32, 28, 30, 34, 36, 31, 37, 35], actual: [31, 33, 34, 28, 30, 27, 29, 33, 35, 30, 36, 34] },
    CNC: { plan: [28, 27, 28, 28, 26, 27, 27, 28, 29, 27, 29, 29], actual: [27, 27, 26, 26, 26, 27, 27, 28, 29, 27, 29, 29] }
  },
  inspectionRate: {
    ALL: { plan: [60, 62, 64, 58, 61, 56, 59, 63, 65, 60, 66, 68], actual: [58, 60, 63, 56, 59, 55, 57, 61, 64, 58, 64, 66] }
  },
  woTimeliness: {
    ALL: { onTime: [88, 92, 90, 85, 89, 86, 88, 91, 93, 89, 92, 91], delayed: [12, 13, 14, 10, 11, 10, 11, 13, 15, 11, 14, 13] }
  },
  topRepairer: [
    { name: '李伟', dept: 'C 端', count: 38, avgHours: 1.8, satisfaction: 4.6 },
    { name: '陆钟', dept: 'C 端', count: 32, avgHours: 2.1, satisfaction: 4.5 },
    { name: '买盼', dept: 'B 端', count: 36, avgHours: 1.6, satisfaction: 4.7 },
    { name: '严欢欢', dept: 'B 端', count: 28, avgHours: 1.9, satisfaction: 4.4 },
    { name: '彭向', dept: 'CNC', count: 30, avgHours: 2.3, satisfaction: 4.6 },
    { name: '刚嘉成', dept: 'CNC', count: 26, avgHours: 2.5, satisfaction: 4.5 }
  ],
  faultCategory: {
    ALL: [{ name: '电气故障', value: 32 }, { name: '机械磨损', value: 28 }, { name: '气路故障', value: 14 }, { name: '油路故障', value: 12 }, { name: '控制系统', value: 9 }, { name: '其他', value: 5 }]
  },
  monthlyDetail: [
    { equipmentName: '注塑机 INJ-001', faultCode: 'F-2026-04-031', occurDate: '2026-04-14', repairer: '彭向', repairHours: 2.5, parts: '温控模块×1', cost: 5360 },
    { equipmentName: '电阻焊接机 RW-30', faultCode: 'F-2026-04-028', occurDate: '2026-04-08', repairer: '买盼', repairHours: 1.5, parts: '电极头×6 / 气管接头×1', cost: 980 },
    { equipmentName: 'CNC 加工中心 MA1200', faultCode: 'F-2026-04-023', occurDate: '2026-04-17', repairer: '刚嘉成', repairHours: 4.0, parts: '主轴轴承×1', cost: 3850 },
    { equipmentName: '点胶机 PACK-A1', faultCode: 'F-2026-04-018', occurDate: '2026-04-12', repairer: '李伟', repairHours: 1.0, parts: '点胶针头×10', cost: 450 },
    { equipmentName: '轻型手动压机 LP-50', faultCode: 'F-2026-04-014', occurDate: '2026-04-10', repairer: '陆钟', repairHours: 1.5, parts: '485通讯端子×2', cost: 250 },
    { equipmentName: '检测设备 DET-001', faultCode: 'F-2026-04-009', occurDate: '2026-04-06', repairer: '严欢欢', repairHours: 2.2, parts: '检测探针×4', cost: 580 },
    { equipmentName: '自动锁螺丝机 ASM-4', faultCode: 'F-2026-04-006', occurDate: '2026-04-08', repairer: '买盼', repairHours: 1.8, parts: '批头×2', cost: 320 },
    { equipmentName: '注塑机 INJ-001', faultCode: 'F-2026-04-035', occurDate: '2026-04-23', repairer: '彭向', repairHours: 1.2, parts: '46# 抗磨液压油×1桶', cost: 1280 }
  ]
}

// ════ 库存消耗 ════
const inventory = {
  topConsume: {
    ALL: [
      { name: 'NSK PS-2润滑脂', code: 'BJ-002', qty: 28, amount: 980, warehouse: '设备维修备件库' },
      { name: '点胶针头 22G', code: 'BJ-012', qty: 65, amount: 2925, warehouse: '自动化备件库' },
      { name: '气管接头 6mm', code: 'BJ-005', qty: 80, amount: 640, warehouse: '设备维修备件库' },
      { name: '电极头 φ16', code: 'BJ-013', qty: 36, amount: 2340, warehouse: 'B端关键备件库' },
      { name: '46# 抗磨液压油', code: 'BJ-015', qty: 12, amount: 4960, warehouse: 'CNC设备备件库' },
      { name: '485通讯端子', code: 'BJ-001', qty: 50, amount: 625, warehouse: '设备维修备件库' },
      { name: '检测探针 0.5mm', code: 'BJ-014', qty: 24, amount: 3480, warehouse: 'B端关键备件库' },
      { name: '批头 PH2', code: 'BJ-006', qty: 18, amount: 540, warehouse: 'B端关键备件库' },
      { name: '伺服电机驱动器', code: 'BJ-016', qty: 4, amount: 12800, warehouse: '自动化备件库' },
      { name: 'CNC 主轴轴承', code: 'BJ-004', qty: 3, amount: 11550, warehouse: 'CNC设备备件库' }
    ]
  },
  turnover: {
    ALL: { rate: [3.2, 3.5, 3.8, 3.1, 3.4, 2.9, 3.2, 3.6, 3.9, 3.3, 3.7, 3.5], days: [114, 104, 96, 118, 107, 126, 114, 101, 94, 110, 99, 104] }
  },
  capitalOccupation: {
    ALL: [
      { warehouse: '设备维修备件库', value: 86200, ratio: 28.5 },
      { warehouse: '自动化备件库', value: 92800, ratio: 30.7 },
      { warehouse: 'B端关键备件库', value: 58300, ratio: 19.3 },
      { warehouse: 'CNC设备备件库', value: 64900, ratio: 21.5 }
    ]
  },
  safetyStockRate: {
    ALL: [{ name: '正常', value: 142 }, { name: '低于安全线', value: 12 }, { name: '缺货', value: 7 }]
  },
  scrapReason: {
    ALL: [{ name: '损坏', value: 14 }, { name: '超期失效', value: 8 }, { name: '工艺淘汰', value: 5 }, { name: '错件', value: 3 }]
  },
  scrapTrend: {
    ALL: [3, 4, 2, 5, 3, 4, 2, 5, 3, 4, 6, 4]
  }
}

// ════ 采购汇总 ════
const purchase = {
  amountTrend: {
    ALL: { equipment: [28000, 35000, 42000, 26000, 38000, 22000, 30000, 45000, 52000, 38000, 56000, 48500], tool: [8500, 9800, 12300, 7200, 10500, 6800, 8900, 13200, 14800, 11500, 16200, 13800], part: [12300, 14800, 18500, 10800, 15600, 9200, 13400, 17200, 21500, 16800, 24300, 19600] }
  },
  typeDistribution: {
    ALL: [{ name: '设备采购', value: 460500 }, { name: '工器具采购', value: 133900 }, { name: '备件采购', value: 194300 }]
  },
  topSupplier: {
    ALL: [
      { name: '海天国际', amount: 86500, count: 8, category: '注塑机/液压油' },
      { name: '华诚精密', amount: 72300, count: 12, category: '设备维修件' },
      { name: '快克智能', amount: 58200, count: 15, category: '焊接/锁螺丝设备' },
      { name: '西门子', amount: 52800, count: 6, category: 'PLC/驱动器' },
      { name: '诺信EFD', amount: 38600, count: 9, category: '点胶设备/耗材' },
      { name: '研华', amount: 32400, count: 7, category: '检测设备' },
      { name: 'NSK', amount: 28600, count: 14, category: '轴承/润滑脂' },
      { name: 'OMRON', amount: 24800, count: 11, category: '继电器/传感器' }
    ]
  },
  cycleAnalysis: {
    ALL: [
      { stage: '申请→部门审批', avgDays: 0.8 },
      { stage: '部门审批→设备主管', avgDays: 1.2 },
      { stage: '设备主管→财务', avgDays: 0.6 },
      { stage: '财务→生成 PO', avgDays: 0.3 },
      { stage: 'PO→到货入库', avgDays: 5.6 }
    ]
  },
  approvalDuration: {
    ALL: [
      { name: '紧急（24h内）', value: 18 },
      { name: '正常（24-72h）', value: 42 },
      { name: '滞留（72h+）', value: 6 }
    ]
  },
  monthlyDetail: [
    { code: 'CIP-2026-0001', type: '设备', itemName: 'PACK-A2 自动上下料工作站', amount: 186500, applicantName: '张工', supplier: '诺信EFD', status: '审批中', applicationDate: '2026-04-22' },
    { code: 'CIP-2026-0007', type: '设备', itemName: '电机线-3 工位扩展', amount: 38500, applicantName: '刘工', supplier: '快克智能', status: '审批中', applicationDate: '2026-04-21' },
    { code: 'CIP-2026-0009', type: '设备', itemName: 'B 端老化测试台', amount: 42000, applicantName: '严欢欢', supplier: '研华', status: '草稿', applicationDate: '2026-04-27' },
    { code: 'CIP-2026-0005', type: '设备', itemName: 'B 端检测设备-外观 AOI', amount: 268000, applicantName: '陈工', supplier: '研华', status: '审批中', applicationDate: '2026-04-26' },
    { code: 'TPD-2026-001', type: '工器具', itemName: 'φ8 立铣刀（钨钢）', amount: 4800, applicantName: '彭向', supplier: '森拉天时', status: '已通过', applicationDate: '2026-04-18' },
    { code: 'TPD-2026-002', type: '工器具', itemName: '5R 球头铣刀', amount: 6800, applicantName: '刚嘉成', supplier: '森拉天时', status: '已生成PO', applicationDate: '2026-04-12' },
    { code: 'SP-PR-2026-001', type: '备件', itemName: 'NSK PS-2润滑脂×10', amount: 350, applicantName: '陆钟', supplier: 'NSK', status: '已生成PO', applicationDate: '2026-04-22' },
    { code: 'SP-PR-2026-005', type: '备件', itemName: 'CNC 主轴轴承×1', amount: 3850, applicantName: '刚嘉成', supplier: 'NSK', status: '已入库', applicationDate: '2026-04-17' },
    { code: 'SP-PR-2026-008', type: '备件', itemName: '46# 抗磨液压油×3桶', amount: 3840, applicantName: '彭向', supplier: '海天国际', status: '已生成PO', applicationDate: '2026-04-23' }
  ]
}

const mocks = [
  { url: '/admin-api/eam/report/dashboard', method: 'get' as const, response: ({ query }: any) => {
    const plant: Plant = (query?.plant || 'ALL')
    return { code: 200, data: {
      months: MONTHS,
      kpis: dashboard.kpis[plant] || dashboard.kpis.ALL,
      oeeTrend: dashboard.oeeTrend[plant] || dashboard.oeeTrend.ALL,
      woTrend: dashboard.woTrend[plant] || dashboard.woTrend.ALL,
      faultTopEquipment: dashboard.faultTopEquipment[plant] || dashboard.faultTopEquipment.ALL,
      partsConsumePie: dashboard.partsConsumePie[plant] || dashboard.partsConsumePie.ALL
    } }
  } },
  { url: '/admin-api/eam/report/maintenance', method: 'get' as const, response: ({ query }: any) => {
    const plant: Plant = (query?.plant || 'ALL')
    return { code: 200, data: {
      months: MONTHS,
      completionRate: maintenance.completionRate[plant] || maintenance.completionRate.ALL,
      inspectionRate: maintenance.inspectionRate.ALL,
      woTimeliness: maintenance.woTimeliness.ALL,
      topRepairer: plant === 'ALL' ? maintenance.topRepairer : maintenance.topRepairer.filter(x => x.dept.includes(plant === 'C' ? 'C' : plant === 'B' ? 'B' : 'CNC')),
      faultCategory: maintenance.faultCategory.ALL,
      monthlyDetail: maintenance.monthlyDetail
    } }
  } },
  { url: '/admin-api/eam/report/inventory', method: 'get' as const, response: () => {
    return { code: 200, data: {
      months: MONTHS,
      topConsume: inventory.topConsume.ALL,
      turnover: inventory.turnover.ALL,
      capitalOccupation: inventory.capitalOccupation.ALL,
      safetyStockRate: inventory.safetyStockRate.ALL,
      scrapReason: inventory.scrapReason.ALL,
      scrapTrend: inventory.scrapTrend.ALL
    } }
  } },
  { url: '/admin-api/eam/report/purchase', method: 'get' as const, response: () => {
    return { code: 200, data: {
      months: MONTHS,
      amountTrend: purchase.amountTrend.ALL,
      typeDistribution: purchase.typeDistribution.ALL,
      topSupplier: purchase.topSupplier.ALL,
      cycleAnalysis: purchase.cycleAnalysis.ALL,
      approvalDuration: purchase.approvalDuration.ALL,
      monthlyDetail: purchase.monthlyDetail
    } }
  } }
]

export default mocks
