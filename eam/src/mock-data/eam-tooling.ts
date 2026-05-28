/**
 * Mock: EM-09 生产工器具管理（刀具/量具/模具）
 * 仅数控机加车间可见
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

// ══════════════════════════════════════════════
// 1. 工器具 5 级分类树（刀/量/模 三棵）
// ══════════════════════════════════════════════
const toolCategoryTree = [
  // 刀具树
  { id: 'TC001', code: 'TC001', name: '车削', toolType: '刀具', parentId: 0, level: 1, sort: 1, status: 1 },
  { id: 'TC001-01', code: 'TC001-01', name: '车外圆', toolType: '刀具', parentId: 'TC001', level: 2, sort: 1, status: 1 },
  { id: 'TC001-01-01', code: 'TC001-01-01', name: 'φ50 外圆车刀', toolType: '刀具', parentId: 'TC001-01', level: 3, sort: 1, status: 1 },
  { id: 'TC001-01-01-01', code: 'TC001-01-01-01', name: '硬质合金', toolType: '刀具', parentId: 'TC001-01-01', level: 4, sort: 1, status: 1 },
  { id: 'TC001-01-01-01-01', code: 'TC001-01-01-01-01', name: '山特维克 SDJCR2020K11', toolType: '刀具', parentId: 'TC001-01-01-01', level: 5, sort: 1, status: 1 },
  { id: 'TC001-02', code: 'TC001-02', name: '车内孔', toolType: '刀具', parentId: 'TC001', level: 2, sort: 2, status: 1 },
  { id: 'TC001-03', code: 'TC001-03', name: '车端面', toolType: '刀具', parentId: 'TC001', level: 2, sort: 3, status: 1 },
  { id: 'TC001-04', code: 'TC001-04', name: '切槽', toolType: '刀具', parentId: 'TC001', level: 2, sort: 4, status: 1 },
  { id: 'TC001-05', code: 'TC001-05', name: '车螺纹', toolType: '刀具', parentId: 'TC001', level: 2, sort: 5, status: 1 },
  { id: 'TC002', code: 'TC002', name: '铣削', toolType: '刀具', parentId: 0, level: 1, sort: 2, status: 1 },
  { id: 'TC002-01', code: 'TC002-01', name: '面铣', toolType: '刀具', parentId: 'TC002', level: 2, sort: 1, status: 1 },
  { id: 'TC002-02', code: 'TC002-02', name: '立铣', toolType: '刀具', parentId: 'TC002', level: 2, sort: 2, status: 1 },
  { id: 'TC002-03', code: 'TC002-03', name: '键槽铣', toolType: '刀具', parentId: 'TC002', level: 2, sort: 3, status: 1 },
  { id: 'TC003', code: 'TC003', name: '钻削', toolType: '刀具', parentId: 0, level: 1, sort: 3, status: 1 },
  { id: 'TC003-01', code: 'TC003-01', name: '麻花钻', toolType: '刀具', parentId: 'TC003', level: 2, sort: 1, status: 1 },
  { id: 'TC004', code: 'TC004', name: '镗削', toolType: '刀具', parentId: 0, level: 1, sort: 4, status: 1 },
  { id: 'TC005', code: 'TC005', name: '磨削', toolType: '刀具', parentId: 0, level: 1, sort: 5, status: 1 },
  { id: 'TC006', code: 'TC006', name: '刨削', toolType: '刀具', parentId: 0, level: 1, sort: 6, status: 1 },

  // 量具树
  { id: 'GC001', code: 'GC001', name: '长度', toolType: '量具', parentId: 0, level: 1, sort: 1, status: 1 },
  { id: 'GC001-01', code: 'GC001-01', name: '游标卡尺', toolType: '量具', parentId: 'GC001', level: 2, sort: 1, status: 1 },
  { id: 'GC001-02', code: 'GC001-02', name: '数显卡尺', toolType: '量具', parentId: 'GC001', level: 2, sort: 2, status: 1 },
  { id: 'GC001-03', code: 'GC001-03', name: '外径千分尺', toolType: '量具', parentId: 'GC001', level: 2, sort: 3, status: 1 },
  { id: 'GC001-04', code: 'GC001-04', name: '量块', toolType: '量具', parentId: 'GC001', level: 2, sort: 4, status: 1 },
  { id: 'GC002', code: 'GC002', name: '形位', toolType: '量具', parentId: 0, level: 1, sort: 2, status: 1 },
  { id: 'GC002-01', code: 'GC002-01', name: '百分表', toolType: '量具', parentId: 'GC002', level: 2, sort: 1, status: 1 },
  { id: 'GC003', code: 'GC003', name: '角度', toolType: '量具', parentId: 0, level: 1, sort: 3, status: 1 },
  { id: 'GC004', code: 'GC004', name: '表面', toolType: '量具', parentId: 0, level: 1, sort: 4, status: 1 },
  { id: 'GC005', code: 'GC005', name: '三坐标', toolType: '量具', parentId: 0, level: 1, sort: 5, status: 1 },
  { id: 'GC005-01', code: 'GC005-01', name: '台式 CMM', toolType: '量具', parentId: 'GC005', level: 2, sort: 1, status: 1 },
  { id: 'GC005-02', code: 'GC005-02', name: '便携关节臂', toolType: '量具', parentId: 'GC005', level: 2, sort: 2, status: 1 },
  { id: 'GC006', code: 'GC006', name: '力学', toolType: '量具', parentId: 0, level: 1, sort: 6, status: 1 },
  { id: 'GC007', code: 'GC007', name: '电学', toolType: '量具', parentId: 0, level: 1, sort: 7, status: 1 },

  // 模具树
  { id: 'MC001', code: 'MC001', name: '注塑', toolType: '模具', parentId: 0, level: 1, sort: 1, status: 1 },
  { id: 'MC001-01', code: 'MC001-01', name: '单工位', toolType: '模具', parentId: 'MC001', level: 2, sort: 1, status: 1 },
  { id: 'MC001-02', code: 'MC001-02', name: '多工位', toolType: '模具', parentId: 'MC001', level: 2, sort: 2, status: 1 },
  { id: 'MC002', code: 'MC002', name: '冲压', toolType: '模具', parentId: 0, level: 1, sort: 2, status: 1 },
  { id: 'MC002-01', code: 'MC002-01', name: '单工位', toolType: '模具', parentId: 'MC002', level: 2, sort: 1, status: 1 },
  { id: 'MC002-02', code: 'MC002-02', name: '级进模', toolType: '模具', parentId: 'MC002', level: 2, sort: 2, status: 1 },
  { id: 'MC002-03', code: 'MC002-03', name: '复合模', toolType: '模具', parentId: 'MC002', level: 2, sort: 3, status: 1 },
  { id: 'MC003', code: 'MC003', name: '压铸', toolType: '模具', parentId: 0, level: 1, sort: 3, status: 1 },
  { id: 'MC004', code: 'MC004', name: '锻造', toolType: '模具', parentId: 0, level: 1, sort: 4, status: 1 },
  { id: 'MC005', code: 'MC005', name: '工装夹具', toolType: '模具', parentId: 0, level: 1, sort: 5, status: 1 },
]

// ══════════════════════════════════════════════
// 2. 刀具档案（批量编号·不贴码·不关联订单）
// ══════════════════════════════════════════════
const toolMasterList = [
  { id: 'T001', toolCode: 'PO-2026-04-0123-L1', toolName: 'φ50 外圆车刀', categoryPath: '车削/车外圆/φ50 外圆车刀/硬质合金/山特维克 SDJCR2020K11', specification: 'SDJCR2020K11', material: '硬质合金', brand: '山特维克', supplierName: '山特维克可乐满', purchaseOrderNo: 'PO-2026-04-0123', inboundQty: 50, currentStock: 32, unit: '把', unitPrice: 85.5, storageLocation: 'CNC-WH-A1-01', status: '已启用', remark: 'φ20-φ50 阶梯轴常用', workshopCode: 'CNC' },
  { id: 'T002', toolCode: 'PO-2026-04-0125-L1', toolName: 'φ80 外圆车刀', categoryPath: '车削/车外圆/φ80 外圆车刀/硬质合金/山高 SCLCR2525M12', specification: 'SCLCR2525M12', material: '硬质合金', brand: '山高', supplierName: '山高刀具', purchaseOrderNo: 'PO-2026-04-0125', inboundQty: 30, currentStock: 18, unit: '把', unitPrice: 92.0, storageLocation: 'CNC-WH-A1-02', status: '已启用', remark: '中型轴类零件', workshopCode: 'CNC' },
  { id: 'T003', toolCode: 'PO-2026-04-0128-L1', toolName: 'φ80 外圆车刀（淬硬钢）', categoryPath: '车削/车外圆/φ80 外圆车刀/CBN/株洲钻石 CBN300', specification: 'CBN300', material: 'CBN', brand: '株洲钻石', supplierName: '株洲钻石切削刀具', purchaseOrderNo: 'PO-2026-04-0128', inboundQty: 10, currentStock: 7, unit: '把', unitPrice: 320.0, storageLocation: 'CNC-WH-A1-03', status: '已启用', remark: '淬硬钢精车专用', workshopCode: 'CNC' },
  { id: 'T004', toolCode: 'PO-2026-04-0130-L1', toolName: 'φ20 内孔车刀', categoryPath: '车削/车内孔/φ20 内孔车刀/硬质合金/株洲钻石 S16Q-SCLCR06', specification: 'S16Q-SCLCR06', material: '硬质合金', brand: '株洲钻石', supplierName: '株洲钻石切削刀具', purchaseOrderNo: 'PO-2026-04-0130', inboundQty: 20, currentStock: 14, unit: '把', unitPrice: 75.0, storageLocation: 'CNC-WH-A2-01', status: '已启用', remark: '小孔精镗', workshopCode: 'CNC' },
  { id: 'T005', toolCode: 'PO-2026-04-0132-L1', toolName: '90° 端面车刀', categoryPath: '车削/车端面/90° 端面车刀/硬质合金/山特维克 DCLNR2525M12', specification: 'DCLNR2525M12', material: '硬质合金', brand: '山特维克', supplierName: '山特维克可乐满', purchaseOrderNo: 'PO-2026-04-0132', inboundQty: 25, currentStock: 19, unit: '把', unitPrice: 88.0, storageLocation: 'CNC-WH-A2-02', status: '已启用', remark: '端面精加工', workshopCode: 'CNC' },
  { id: 'T006', toolCode: 'PO-2026-04-0134-L1', toolName: '3mm 切槽车刀', categoryPath: '车削/切槽/3mm 切槽车刀/硬质合金/KENNAMETAL A4G0303M03P-08', specification: 'A4G0303M03P-08', material: '硬质合金', brand: 'KENNAMETAL', supplierName: '肯纳金属', purchaseOrderNo: 'PO-2026-04-0134', inboundQty: 15, currentStock: 9, unit: '把', unitPrice: 110.0, storageLocation: 'CNC-WH-A3-01', status: '已启用', remark: '宽 3mm 外圆切槽', workshopCode: 'CNC' },
  { id: 'T007', toolCode: 'PO-2026-04-0136-L1', toolName: 'M16 外螺纹车刀', categoryPath: '车削/车螺纹/60° 外螺纹车刀/硬质合金/山特维克 R166.0G-16MM01-300', specification: 'R166.0G-16MM01-300', material: '硬质合金', brand: '山特维克', supplierName: '山特维克可乐满', purchaseOrderNo: 'PO-2026-04-0136', inboundQty: 12, currentStock: 8, unit: '把', unitPrice: 135.0, storageLocation: 'CNC-WH-A3-02', status: '已启用', remark: 'M16 标准外螺纹', workshopCode: 'CNC' },
  { id: 'T008', toolCode: 'PO-2026-04-0140-L1', toolName: 'φ80 面铣刀盘', categoryPath: '铣削/面铣/φ80 面铣刀盘/硬质合金可转位/山特维克 R245-080Q27-12M', specification: 'R245-080Q27-12M', material: '硬质合金可转位', brand: '山特维克', supplierName: '山特维克可乐满', purchaseOrderNo: 'PO-2026-04-0140', inboundQty: 8, currentStock: 5, unit: '把', unitPrice: 580.0, storageLocation: 'CNC-WH-B1-01', status: '已启用', remark: '平面粗精铣', workshopCode: 'CNC' },
  { id: 'T009', toolCode: 'PO-2026-04-0143-L1', toolName: 'φ100 面铣刀盘', categoryPath: '铣削/面铣/φ100 面铣刀盘/硬质合金可转位/伊斯卡 F90AN-D100-08-32', specification: 'F90AN-D100-08-32', material: '硬质合金可转位', brand: '伊斯卡', supplierName: '伊斯卡刀具', purchaseOrderNo: 'PO-2026-04-0143', inboundQty: 6, currentStock: 4, unit: '把', unitPrice: 720.0, storageLocation: 'CNC-WH-B1-02', status: '已启用', remark: '大平面高效铣', workshopCode: 'CNC' },
  { id: 'T010', toolCode: 'PO-2026-04-0145-L1', toolName: 'φ10 平头立铣刀', categoryPath: '铣削/立铣/φ10 平头立铣刀/硬质合金/日立 EPSM4100', specification: 'EPSM4100', material: '硬质合金', brand: '日立', supplierName: '日立工具', purchaseOrderNo: 'PO-2026-04-0145', inboundQty: 40, currentStock: 26, unit: '把', unitPrice: 95.0, storageLocation: 'CNC-WH-B2-01', status: '已启用', remark: '不锈钢/淬硬钢精铣', workshopCode: 'CNC' },
  { id: 'T011', toolCode: 'PO-2026-04-0147-L1', toolName: 'φ16 球头立铣刀', categoryPath: '铣削/立铣/φ16 球头立铣刀/硬质合金/三菱 IMX16-S22-C04', specification: 'IMX16-S22-C04', material: '硬质合金', brand: '三菱', supplierName: '三菱综合材料', purchaseOrderNo: 'PO-2026-04-0147', inboundQty: 20, currentStock: 13, unit: '把', unitPrice: 280.0, storageLocation: 'CNC-WH-B2-02', status: '已启用', remark: '曲面精加工', workshopCode: 'CNC' },
  { id: 'T012', toolCode: 'PO-2026-04-0150-L1', toolName: 'φ8 键槽铣刀', categoryPath: '铣削/键槽铣/φ8 键槽铣刀/硬质合金/OSG VC2MB R0.5×8', specification: 'VC2MB R0.5×8', material: '硬质合金', brand: 'OSG', supplierName: '欧士机', purchaseOrderNo: 'PO-2026-04-0150', inboundQty: 30, currentStock: 22, unit: '把', unitPrice: 65.0, storageLocation: 'CNC-WH-B3-01', status: '已启用', remark: '8mm 键槽专用', workshopCode: 'CNC' },
  { id: 'T013', toolCode: 'PO-2026-04-0152-L1', toolName: 'φ8 麻花钻', categoryPath: '钻削/麻花钻/φ8 麻花钻/高速钢/OSG EX-GDS 8.0', specification: 'EX-GDS 8.0', material: '高速钢', brand: 'OSG', supplierName: '欧士机', purchaseOrderNo: 'PO-2026-04-0152', inboundQty: 100, currentStock: 78, unit: '把', unitPrice: 12.5, storageLocation: 'CNC-WH-C1-01', status: '已启用', remark: '通用钢件钻孔', workshopCode: 'CNC' },
  { id: 'T014', toolCode: 'PO-2026-04-0154-L1', toolName: 'φ12 硬质合金钻头', categoryPath: '钻削/麻花钻/φ12 钻头/硬质合金/钴领 WALTER A6585TFP-1/2', specification: 'A6585TFP-1/2', material: '硬质合金', brand: 'WALTER', supplierName: '瓦尔特刀具', purchaseOrderNo: 'PO-2026-04-0154', inboundQty: 25, currentStock: 17, unit: '把', unitPrice: 145.0, storageLocation: 'CNC-WH-C1-02', status: '已启用', remark: '不锈钢深孔', workshopCode: 'CNC' },
  { id: 'T015', toolCode: 'PO-2026-04-0156-L1', toolName: 'φ20 枪钻', categoryPath: '钻削/深孔钻/φ20 枪钻/硬质合金/克奇曼 Φ20 L500', specification: 'Φ20 L500', material: '硬质合金', brand: '克奇曼', supplierName: '克奇曼刀具', purchaseOrderNo: 'PO-2026-04-0156', inboundQty: 6, currentStock: 4, unit: '把', unitPrice: 850.0, storageLocation: 'CNC-WH-C2-01', status: '已启用', remark: '深径比 ≥10 的深孔', workshopCode: 'CNC' },
  { id: 'T016', toolCode: 'PO-2026-04-0160-L1', toolName: 'φ40-60 微调镗刀杆', categoryPath: '镗削/微调镗刀/φ40-60 微调镗刀杆/可调式/威迪亚 BMR-40', specification: 'BMR-40', material: '可调式', brand: '威迪亚', supplierName: '威迪亚刀具', purchaseOrderNo: 'PO-2026-04-0160', inboundQty: 4, currentStock: 3, unit: '把', unitPrice: 1280.0, storageLocation: 'CNC-WH-D1-01', status: '已启用', remark: '精镗孔径微调', workshopCode: 'CNC' },
  { id: 'T017', toolCode: 'PO-2026-04-0163-L1', toolName: 'φ300 平面砂轮', categoryPath: '磨削/砂轮/φ300 平面砂轮/白刚玉 WA60/白鸽 WA60K6V35', specification: 'WA60K6V35', material: '白刚玉 WA60', brand: '白鸽', supplierName: '白鸽磨料', purchaseOrderNo: 'PO-2026-04-0163', inboundQty: 12, currentStock: 8, unit: '片', unitPrice: 78.0, storageLocation: 'CNC-WH-E1-01', status: '已启用', remark: '钢材平面磨', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 3. 量具档案（含借用数量）
// ══════════════════════════════════════════════
const gaugeMasterList = [
  { id: 'G001', gaugeCode: 'PO-2026-04-0200-L1', gaugeName: '游标卡尺 0-150mm', categoryPath: '长度/游标卡尺/0-150mm/0.02mm/三丰 530-101', measureRange: '0-150mm', accuracy: '0.02mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0200', inboundQty: 30, currentStock: 22, borrowedQty: 5, unit: '把', unitPrice: 320.0, storageLocation: 'CNC-WH-G1-01', status: '已启用', remark: '通用长度测量', workshopCode: 'CNC' },
  { id: 'G002', gaugeCode: 'PO-2026-04-0202-L1', gaugeName: '游标卡尺 0-300mm', categoryPath: '长度/游标卡尺/0-300mm/0.02mm/三丰 530-104', measureRange: '0-300mm', accuracy: '0.02mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0202', inboundQty: 15, currentStock: 11, borrowedQty: 2, unit: '把', unitPrice: 580.0, storageLocation: 'CNC-WH-G1-02', status: '已启用', remark: '中型零件测量', workshopCode: 'CNC' },
  { id: 'G003', gaugeCode: 'PO-2026-04-0205-L1', gaugeName: '数显卡尺 0-150mm', categoryPath: '长度/数显卡尺/0-150mm/0.01mm/三丰 500-196-30', measureRange: '0-150mm', accuracy: '0.01mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0205', inboundQty: 20, currentStock: 13, borrowedQty: 4, unit: '把', unitPrice: 1280.0, storageLocation: 'CNC-WH-G2-01', status: '已启用', remark: '高精度测量', workshopCode: 'CNC' },
  { id: 'G004', gaugeCode: 'PO-2026-04-0208-L1', gaugeName: '数显卡尺 0-200mm', categoryPath: '长度/数显卡尺/0-200mm/0.01mm/马尔 MAR16ER', measureRange: '0-200mm', accuracy: '0.01mm', brand: '马尔', supplierName: 'Mahr 马尔', purchaseOrderNo: 'PO-2026-04-0208', inboundQty: 10, currentStock: 8, borrowedQty: 1, unit: '把', unitPrice: 1850.0, storageLocation: 'CNC-WH-G2-02', status: '已启用', remark: '德系高精度', workshopCode: 'CNC' },
  { id: 'G005', gaugeCode: 'PO-2026-04-0210-L1', gaugeName: '外径千分尺 0-25mm', categoryPath: '长度/外径千分尺/0-25mm/0.001mm/三丰 103-137', measureRange: '0-25mm', accuracy: '0.001mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0210', inboundQty: 25, currentStock: 18, borrowedQty: 3, unit: '把', unitPrice: 760.0, storageLocation: 'CNC-WH-G3-01', status: '已启用', remark: '精密轴径测量', workshopCode: 'CNC' },
  { id: 'G006', gaugeCode: 'PO-2026-04-0212-L1', gaugeName: '外径千分尺 25-50mm', categoryPath: '长度/外径千分尺/25-50mm/0.001mm/三丰 103-138', measureRange: '25-50mm', accuracy: '0.001mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0212', inboundQty: 20, currentStock: 14, borrowedQty: 2, unit: '把', unitPrice: 820.0, storageLocation: 'CNC-WH-G3-02', status: '已启用', remark: '', workshopCode: 'CNC' },
  { id: 'G007', gaugeCode: 'PO-2026-04-0215-L1', gaugeName: '深度千分尺 0-25mm', categoryPath: '长度/深度千分尺/0-25mm/0.01mm/三丰 129-110', measureRange: '0-25mm', accuracy: '0.01mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0215', inboundQty: 8, currentStock: 6, borrowedQty: 1, unit: '把', unitPrice: 690.0, storageLocation: 'CNC-WH-G4-01', status: '已启用', remark: '', workshopCode: 'CNC' },
  { id: 'G008', gaugeCode: 'PO-2026-04-0218-L1', gaugeName: '高度尺 0-300mm', categoryPath: '长度/高度尺/0-300mm/0.01mm/三丰 192-130', measureRange: '0-300mm', accuracy: '0.01mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0218', inboundQty: 6, currentStock: 5, borrowedQty: 0, unit: '把', unitPrice: 2350.0, storageLocation: 'CNC-WH-G5-01', status: '已启用', remark: '划线/高度测量', workshopCode: 'CNC' },
  { id: 'G009', gaugeCode: 'PO-2026-04-0220-L1', gaugeName: '量块 83 件套', categoryPath: '长度/量块/83 块组/一等/成量 83 件套', measureRange: '83 件套', accuracy: '一等', brand: '成量', supplierName: '成都量具刃具', purchaseOrderNo: 'PO-2026-04-0220', inboundQty: 2, currentStock: 2, borrowedQty: 0, unit: '套', unitPrice: 4800.0, storageLocation: 'CNC-WH-G6-01', status: '已启用', remark: '高精度尺寸传递', workshopCode: 'CNC' },
  { id: 'G010', gaugeCode: 'PO-2026-04-0225-L1', gaugeName: '百分表 0-10mm', categoryPath: '形位/百分表/0-10mm/0.01mm/三丰 2046S', measureRange: '0-10mm', accuracy: '0.01mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0225', inboundQty: 15, currentStock: 11, borrowedQty: 2, unit: '把', unitPrice: 380.0, storageLocation: 'CNC-WH-H1-01', status: '已启用', remark: '位置度/平面度', workshopCode: 'CNC' },
  { id: 'G011', gaugeCode: 'PO-2026-04-0228-L1', gaugeName: '千分表 0-1mm', categoryPath: '形位/千分表/0-1mm/0.001mm/三丰 2110S-10', measureRange: '0-1mm', accuracy: '0.001mm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0228', inboundQty: 8, currentStock: 5, borrowedQty: 2, unit: '把', unitPrice: 950.0, storageLocation: 'CNC-WH-H1-02', status: '已启用', remark: '高精度跳动测量', workshopCode: 'CNC' },
  { id: 'G012', gaugeCode: 'PO-2026-04-0232-L1', gaugeName: '万能角度尺', categoryPath: '角度/万能角度尺/0-320°/5\'/三丰 187-901', measureRange: '0-320°', accuracy: "5'", brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0232', inboundQty: 5, currentStock: 4, borrowedQty: 1, unit: '把', unitPrice: 1450.0, storageLocation: 'CNC-WH-J1-01', status: '已启用', remark: '通用角度测量', workshopCode: 'CNC' },
  { id: 'G013', gaugeCode: 'PO-2026-04-0240-L1', gaugeName: '表面粗糙度仪', categoryPath: '表面/表面粗糙度仪/Ra 0.025-12.5μm/0.001μm/三丰 SJ-210', measureRange: 'Ra 0.025-12.5μm', accuracy: '0.001μm', brand: '三丰', supplierName: 'Mitutoyo 三丰', purchaseOrderNo: 'PO-2026-04-0240', inboundQty: 2, currentStock: 2, borrowedQty: 0, unit: '台', unitPrice: 28000.0, storageLocation: 'CNC-WH-K1-01', status: '已启用', remark: '便携式表面测量', workshopCode: 'CNC' },
  { id: 'G014', gaugeCode: 'PO-2026-04-0245-L1', gaugeName: '台式 CMM', categoryPath: '三坐标/台式 CMM/500×500×400mm/1.8μm/海克斯康 GLOBAL S', measureRange: '500×500×400mm', accuracy: '1.8μm', brand: '海克斯康', supplierName: 'Hexagon 海克斯康', purchaseOrderNo: 'PO-2026-04-0245', inboundQty: 1, currentStock: 1, borrowedQty: 0, unit: '台', unitPrice: 580000.0, storageLocation: 'CNC-WH-CMM-01', status: '已启用', remark: '关键件全尺寸检测', workshopCode: 'CNC' },
  { id: 'G015', gaugeCode: 'PO-2026-04-0250-L1', gaugeName: '扭力扳手 20-100N·m', categoryPath: '力学/扭力扳手/20-100N·m/±4%/世达 SATA 96202', measureRange: '20-100N·m', accuracy: '±4%', brand: '世达', supplierName: 'SATA 世达', purchaseOrderNo: 'PO-2026-04-0250', inboundQty: 6, currentStock: 4, borrowedQty: 1, unit: '把', unitPrice: 580.0, storageLocation: 'CNC-WH-L1-01', status: '已启用', remark: '螺栓扭力控制', workshopCode: 'CNC' },
  { id: 'G016', gaugeCode: 'PO-2026-04-0255-L1', gaugeName: '万用表 FLUKE 17B+', categoryPath: '电学/万用表/电压/电阻/电流/4.5位/福禄克 FLUKE 17B+', measureRange: '电压/电阻/电流', accuracy: '4.5 位', brand: '福禄克', supplierName: 'Fluke 福禄克', purchaseOrderNo: 'PO-2026-04-0255', inboundQty: 4, currentStock: 3, borrowedQty: 1, unit: '台', unitPrice: 1280.0, storageLocation: 'CNC-WH-M1-01', status: '已启用', remark: '设备维修电气测量', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 4. 模具档案（单件编号·贴模架条码·关联生产订单）
// ══════════════════════════════════════════════
const mouldMasterList = [
  { id: 'M001', mouldCode: 'PO-2026-03-0050-L1-01', mouldName: 'B2 电机外壳注塑模', categoryPath: '注塑/单工位/电机壳系列/1出1/M-MOTOR-001', barcode: 'BC-MOULD-2026-001', productCode: 'B2-CASE', processType: '注塑', specification: '1出1', mouldFrameNo: 'MF-001', supplierName: '东莞精模', purchaseOrderNo: 'PO-2026-03-0050', unitPrice: 85000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0421-01', usageCount: 1428, storageLocation: 'CNC-MWH-A-01', remark: 'B2 电机外壳注塑模', workshopCode: 'CNC' },
  { id: 'M002', mouldCode: 'PO-2026-03-0052-L1-01', mouldName: 'B3 电机外壳注塑模', categoryPath: '注塑/单工位/电机壳系列/1出1/M-MOTOR-002', barcode: 'BC-MOULD-2026-002', productCode: 'B3-CASE', processType: '注塑', specification: '1出1', mouldFrameNo: 'MF-002', supplierName: '东莞精模', purchaseOrderNo: 'PO-2026-03-0052', unitPrice: 92000.0, status: '在库', currentProductionOrder: '', usageCount: 856, storageLocation: 'CNC-MWH-A-02', remark: 'B3 电机外壳注塑模', workshopCode: 'CNC' },
  { id: 'M003', mouldCode: 'PO-2026-03-0055-L1-01', mouldName: '减速器主壳体', categoryPath: '注塑/单工位/减速器壳系列/1出1/M-GEAR-001', barcode: 'BC-MOULD-2026-003', productCode: 'GEAR-CASE-A', processType: '注塑', specification: '1出1', mouldFrameNo: 'MF-003', supplierName: '苏州模具厂', purchaseOrderNo: 'PO-2026-03-0055', unitPrice: 105000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0420-03', usageCount: 2105, storageLocation: 'CNC-MWH-A-03', remark: '减速器主壳体', workshopCode: 'CNC' },
  { id: 'M004', mouldCode: 'PO-2026-03-0058-L1-01', mouldName: '通用端盖 1模4腔', categoryPath: '注塑/多工位/小盖板系列/1出4/M-COVER-001', barcode: 'BC-MOULD-2026-004', productCode: 'COVER-A', processType: '注塑', specification: '1出4', mouldFrameNo: 'MF-004', supplierName: '苏州模具厂', purchaseOrderNo: 'PO-2026-03-0058', unitPrice: 68000.0, status: '在库', currentProductionOrder: '', usageCount: 5621, storageLocation: 'CNC-MWH-B-01', remark: '通用端盖 1 模 4 腔', workshopCode: 'CNC' },
  { id: 'M005', mouldCode: 'PO-2026-03-0058-L1-02', mouldName: '通用端盖 1模8腔', categoryPath: '注塑/多工位/小盖板系列/1出8/M-COVER-002', barcode: 'BC-MOULD-2026-005', productCode: 'COVER-B', processType: '注塑', specification: '1出8', mouldFrameNo: 'MF-005', supplierName: '苏州模具厂', purchaseOrderNo: 'PO-2026-03-0058', unitPrice: 95000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0420-05', usageCount: 8932, storageLocation: 'CNC-MWH-B-02', remark: '通用端盖 1 模 8 腔', workshopCode: 'CNC' },
  { id: 'M006', mouldCode: 'PO-2026-03-0062-L1-01', mouldName: '小型连接器外壳', categoryPath: '注塑/多工位/连接器系列/1出16/M-CON-001', barcode: 'BC-MOULD-2026-006', productCode: 'CONN-A', processType: '注塑', specification: '1出16', mouldFrameNo: 'MF-006', supplierName: '深圳精密模具', purchaseOrderNo: 'PO-2026-03-0062', unitPrice: 138000.0, status: '在库', currentProductionOrder: '', usageCount: 12450, storageLocation: 'CNC-MWH-B-03', remark: '小型连接器外壳', workshopCode: 'CNC' },
  { id: 'M007', mouldCode: 'PO-2026-03-0070-L1-01', mouldName: '电机座底板冲裁模', categoryPath: '冲压/单工位/钣金件系列/冲裁模/M-PUNCH-001', barcode: 'BC-MOULD-2026-007', productCode: 'PUNCH-A', processType: '冲压', specification: '冲裁模', mouldFrameNo: 'MF-007', supplierName: '青岛冲模', purchaseOrderNo: 'PO-2026-03-0070', unitPrice: 45000.0, status: '在库', currentProductionOrder: '', usageCount: 3208, storageLocation: 'CNC-MWH-C-01', remark: '电机座底板冲裁', workshopCode: 'CNC' },
  { id: 'M008', mouldCode: 'PO-2026-03-0072-L1-01', mouldName: 'L 型支架弯曲模', categoryPath: '冲压/单工位/钣金件系列/弯曲模/M-BEND-001', barcode: 'BC-MOULD-2026-008', productCode: 'BEND-A', processType: '冲压', specification: '弯曲模', mouldFrameNo: 'MF-008', supplierName: '青岛冲模', purchaseOrderNo: 'PO-2026-03-0072', unitPrice: 38000.0, status: '维修中', currentProductionOrder: '', usageCount: 2654, storageLocation: 'CNC-MWH-C-02', remark: 'L 型支架弯曲', workshopCode: 'CNC' },
  { id: 'M009', mouldCode: 'PO-2026-03-0075-L1-01', mouldName: '电池外壳级进冲压', categoryPath: '冲压/级进模/电池外壳系列/8 工位/M-PROG-001', barcode: 'BC-MOULD-2026-009', productCode: 'BAT-CASE', processType: '冲压', specification: '8 工位', mouldFrameNo: 'MF-009', supplierName: '上海精密冲模', purchaseOrderNo: 'PO-2026-03-0075', unitPrice: 280000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0421-08', usageCount: 1825, storageLocation: 'CNC-MWH-D-01', remark: '电池外壳级进冲压', workshopCode: 'CNC' },
  { id: 'M010', mouldCode: 'PO-2026-03-0078-L1-01', mouldName: '散热片级进成型', categoryPath: '冲压/级进模/散热片系列/12 工位/M-PROG-002', barcode: 'BC-MOULD-2026-010', productCode: 'HEAT-A', processType: '冲压', specification: '12 工位', mouldFrameNo: 'MF-010', supplierName: '上海精密冲模', purchaseOrderNo: 'PO-2026-03-0078', unitPrice: 420000.0, status: '在库', currentProductionOrder: '', usageCount: 980, storageLocation: 'CNC-MWH-D-02', remark: '散热片级进成型', workshopCode: 'CNC' },
  { id: 'M011', mouldCode: 'PO-2026-03-0082-L1-01', mouldName: '法兰复合模', categoryPath: '冲压/复合模/法兰系列/冲裁+落料/M-COMP-001', barcode: 'BC-MOULD-2026-011', productCode: 'FLANGE-A', processType: '冲压', specification: '冲裁+落料', mouldFrameNo: 'MF-011', supplierName: '青岛冲模', purchaseOrderNo: 'PO-2026-03-0082', unitPrice: 86000.0, status: '在库', currentProductionOrder: '', usageCount: 1632, storageLocation: 'CNC-MWH-E-01', remark: '法兰复合模', workshopCode: 'CNC' },
  { id: 'M012', mouldCode: 'PO-2026-03-0090-L1-01', mouldName: '电机壳铝合金压铸', categoryPath: '压铸/单工位/电机壳系列/1出1/M-DC-001', barcode: 'BC-MOULD-2026-012', productCode: 'DC-CASE-A', processType: '压铸', specification: '1出1', mouldFrameNo: 'MF-012', supplierName: '宁波铸模', purchaseOrderNo: 'PO-2026-03-0090', unitPrice: 165000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0421-12', usageCount: 4256, storageLocation: 'CNC-MWH-F-01', remark: '电机壳铝合金压铸', workshopCode: 'CNC' },
  { id: 'M013', mouldCode: 'PO-2026-03-0095-L1-01', mouldName: '减速器壳压铸', categoryPath: '压铸/单工位/减速器系列/1出1/M-DC-002', barcode: 'BC-MOULD-2026-013', productCode: 'DC-GEAR', processType: '压铸', specification: '1出1', mouldFrameNo: 'MF-013', supplierName: '宁波铸模', purchaseOrderNo: 'PO-2026-03-0095', unitPrice: 178000.0, status: '在库', currentProductionOrder: '', usageCount: 2103, storageLocation: 'CNC-MWH-F-02', remark: '减速器壳压铸', workshopCode: 'CNC' },
  { id: 'M014', mouldCode: 'PO-2026-03-0100-L1-01', mouldName: '电机轴车削专用夹具', categoryPath: '工装夹具/车削夹具/电机轴系列/三爪卡具/F-TURN-001', barcode: 'BC-FIXT-2026-014', productCode: 'FIX-TURN-A', processType: '车削夹具', specification: '三爪卡具', mouldFrameNo: 'FF-014', supplierName: '本厂自制', purchaseOrderNo: 'PO-2026-03-0100', unitPrice: 12000.0, status: '在用', currentProductionOrder: 'PO-WORK-2026-0421-14', usageCount: 8520, storageLocation: 'CNC-MWH-G-01', remark: '电机轴车削专用', workshopCode: 'CNC' },
  { id: 'M015', mouldCode: 'PO-2026-03-0105-L1-01', mouldName: '电机壳气密性检测工装', categoryPath: '工装夹具/检测工装/电机壳系列/气检工装/F-TEST-001', barcode: 'BC-FIXT-2026-015', productCode: 'FIX-TEST-A', processType: '检测工装', specification: '气检工装', mouldFrameNo: 'FF-015', supplierName: '本厂自制', purchaseOrderNo: 'PO-2026-03-0105', unitPrice: 18500.0, status: '在库', currentProductionOrder: '', usageCount: 3640, storageLocation: 'CNC-MWH-G-02', remark: '电机壳气密性检测', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 5. 采购需求（含飞书审批 + ERP 自动化字段）
// 状态枚举：DRAFT / SUBMITTED / IN_APPROVAL / APPROVED / REJECTED / CANCELED / PO_GENERATED / ERP_FAILED
// ══════════════════════════════════════════════
type PurchaseDemand = {
  id: string
  demandCode: string
  toolType: string
  categoryPath: string
  itemName: string
  specification: string
  quantity: number
  unit: string
  expectedDate: string
  applicantName: string
  department: string
  usagePurpose: string
  erpPushStatus: string
  erpPurchaseOrderNo: string
  pushFailReason: string
  createTime: string
  workshopCode: string
  approvalStatus: string
  feishuApprovalCode: string
  feishuApprovalUrl: string
  approver: string
  approvedAt: string
  approvalNodes: any[]
  erpStatus: string
  erpFailReason: string
}

const purchaseDemandList: PurchaseDemand[] = [
  { id: 'PD001', demandCode: 'PD-2026-04-0001', toolType: '刀具', categoryPath: '车削/车外圆/φ50 外圆车刀/硬质合金/山特维克 SDJCR2020K11', itemName: 'φ50 外圆车刀', specification: 'SDJCR2020K11', quantity: 30, unit: '把', expectedDate: '2026-05-15', applicantName: '刚嘉成', department: '数控机加车间', usagePurpose: '常规耗材补充', erpPushStatus: '已生成PO', erpPurchaseOrderNo: 'PO-2026-04-0123', pushFailReason: '', createTime: '2026-04-20 09:30:00', workshopCode: 'CNC', approvalStatus: 'DELIVERED', feishuApprovalCode: 'FS-2026-04-0001', feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-2026-04-0001', approver: '飞书审批员', approvedAt: '2026-04-20 10:12:00', approvalNodes: [{ nodeName: '发起申请', approver: '刚嘉成', action: '提交', comment: '常规耗材', time: '2026-04-20 09:35:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-20 10:12:00' }], erpStatus: 'SUCCESS', erpFailReason: '' },
  { id: 'PD002', demandCode: 'PD-2026-04-0002', toolType: '刀具', categoryPath: '铣削/立铣/φ16 球头立铣刀/硬质合金/三菱 IMX16-S22-C04', itemName: 'φ16 球头立铣刀', specification: 'IMX16-S22-C04', quantity: 20, unit: '把', expectedDate: '2026-05-20', applicantName: '王组长', department: '数控机加车间', usagePurpose: '曲面精加工急需', erpPushStatus: '已生成PO', erpPurchaseOrderNo: 'PO-2026-04-0147', pushFailReason: '', createTime: '2026-04-21 10:15:00', workshopCode: 'CNC', approvalStatus: 'DELIVERED', feishuApprovalCode: 'FS-2026-04-0010', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-21 11:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '王组长', action: '提交', comment: '曲面精加工急需', time: '2026-04-21 10:15:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-21 11:00:00' }], erpStatus: 'SUCCESS', erpFailReason: '' },
  { id: 'PD003', demandCode: 'PD-2026-04-0003', toolType: '量具', categoryPath: '长度/数显卡尺/0-150mm/0.01mm/三丰 500-196-30', itemName: '数显卡尺 0-150mm', specification: '500-196-30', quantity: 10, unit: '把', expectedDate: '2026-05-25', applicantName: '李组长', department: '数控机加车间', usagePurpose: '替换损坏件', erpPushStatus: '已生成PO', erpPurchaseOrderNo: 'PO-2026-04-0205', pushFailReason: '', createTime: '2026-04-22 14:20:00', workshopCode: 'CNC', approvalStatus: 'DELIVERED', feishuApprovalCode: 'FS-2026-04-0011', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-22 15:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '李组长', action: '提交', comment: '', time: '2026-04-22 14:20:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-22 15:00:00' }], erpStatus: 'SUCCESS', erpFailReason: '' },
  { id: 'PD004', demandCode: 'PD-2026-04-0004', toolType: '模具', categoryPath: '注塑/单工位/电机壳系列/1出1/M-MOTOR-003', itemName: 'B5 电机外壳注塑模', specification: '1出1', quantity: 1, unit: '套', expectedDate: '2026-06-30', applicantName: '刚嘉成', department: '数控机加车间', usagePurpose: '新产品开发配套', erpPushStatus: '待推送', erpPurchaseOrderNo: '', pushFailReason: '', createTime: '2026-04-25 16:00:00', workshopCode: 'CNC', approvalStatus: 'FEISHU_APPROVING', feishuApprovalCode: 'FS-2026-04-0002', feishuApprovalUrl: 'https://applink.feishu.cn/client/mini_program/open?appId=mock&approval=FS-2026-04-0002', approver: '飞书审批员', approvedAt: '', approvalNodes: [{ nodeName: '发起申请', approver: '刚嘉成', action: '提交', comment: '新产品配套急需', time: '2026-04-25 16:05:00' }], erpStatus: '', erpFailReason: '' },
  { id: 'PD005', demandCode: 'PD-2026-04-0005', toolType: '刀具', categoryPath: '钻削/麻花钻/φ8 麻花钻/高速钢/OSG EX-GDS 8.0', itemName: 'φ8 麻花钻', specification: 'EX-GDS 8.0', quantity: 100, unit: '把', expectedDate: '2026-05-10', applicantName: '张组长', department: '数控机加车间', usagePurpose: '日常消耗补货', erpPushStatus: '已生成PO', erpPurchaseOrderNo: 'PO-2026-04-0152', pushFailReason: '', createTime: '2026-04-19 11:45:00', workshopCode: 'CNC', approvalStatus: 'DELIVERED', feishuApprovalCode: 'FS-2026-04-0012', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-19 13:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '张组长', action: '提交', comment: '', time: '2026-04-19 11:45:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-19 13:00:00' }], erpStatus: 'SUCCESS', erpFailReason: '' },
  { id: 'PD006', demandCode: 'PD-2026-04-0006', toolType: '量具', categoryPath: '形位/千分表/0-1mm/0.001mm/三丰 2110S-10', itemName: '千分表 0-1mm', specification: '2110S-10', quantity: 8, unit: '把', expectedDate: '2026-05-30', applicantName: '李组长', department: '数控机加车间', usagePurpose: '精密测量需要', erpPushStatus: '已推送', erpPurchaseOrderNo: '', pushFailReason: '', createTime: '2026-04-24 09:00:00', workshopCode: 'CNC', approvalStatus: 'FEISHU_REJECTED', feishuApprovalCode: 'FS-2026-04-0013', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-24 14:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '李组长', action: '提交', comment: '精密测量需要', time: '2026-04-24 09:00:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '驳回', comment: '请补充用途详情，单价较高', time: '2026-04-24 14:00:00' }], erpStatus: '', erpFailReason: '' },
  { id: 'PD007', demandCode: 'PD-2026-04-0007', toolType: '刀具', categoryPath: '磨削/砂轮/φ300 平面砂轮/白刚玉 WA60/白鸽 WA60K6V35', itemName: 'φ300 平面砂轮', specification: 'WA60K6V35', quantity: 12, unit: '片', expectedDate: '2026-05-15', applicantName: '王组长', department: '数控机加车间', usagePurpose: '磨削车间常规备货', erpPushStatus: '已生成PO', erpPurchaseOrderNo: 'PO-2026-04-0163', pushFailReason: '', createTime: '2026-04-20 15:30:00', workshopCode: 'CNC', approvalStatus: 'DELIVERED', feishuApprovalCode: 'FS-2026-04-0014', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-20 16:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '王组长', action: '提交', comment: '', time: '2026-04-20 15:30:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-20 16:00:00' }], erpStatus: 'SUCCESS', erpFailReason: '' },
  { id: 'PD008', demandCode: 'PD-2026-04-0008', toolType: '模具', categoryPath: '工装夹具/检测工装/电机壳系列/气检工装/F-TEST-002', itemName: '电机壳新版气密检测工装', specification: '气检工装-改进型', quantity: 1, unit: '套', expectedDate: '2026-06-15', applicantName: '刚嘉成', department: '数控机加车间', usagePurpose: '检测精度升级', erpPushStatus: '失败', erpPurchaseOrderNo: '', pushFailReason: 'ERP 接口超时，请重试', createTime: '2026-04-25 11:00:00', workshopCode: 'CNC', approvalStatus: 'PUSH_FAILED', feishuApprovalCode: 'FS-2026-04-0015', feishuApprovalUrl: '', approver: '飞书审批员', approvedAt: '2026-04-25 13:00:00', approvalNodes: [{ nodeName: '发起申请', approver: '刚嘉成', action: '提交', comment: '检测精度升级', time: '2026-04-25 11:00:00' }, { nodeName: '审批人', approver: '飞书审批员', action: '通过', comment: '同意', time: '2026-04-25 13:00:00' }], erpStatus: 'FAILED', erpFailReason: 'ERP 接口超时，请重试' },
  { id: 'PD009', demandCode: 'PD-2026-04-0009', toolType: '刀具', categoryPath: '车削/车外圆/φ32 外圆车刀/硬质合金', itemName: 'φ32 外圆车刀', specification: 'SDJCR1616M11', quantity: 20, unit: '把', expectedDate: '2026-05-28', applicantName: '王组长', department: '数控机加车间', usagePurpose: '日常补货', erpPushStatus: '', erpPurchaseOrderNo: '', pushFailReason: '', createTime: '2026-04-26 09:00:00', workshopCode: 'CNC', approvalStatus: 'DRAFT', feishuApprovalCode: '', feishuApprovalUrl: '', approver: '', approvedAt: '', approvalNodes: [], erpStatus: '', erpFailReason: '' },
]

// 暴露给 feishu-approval mock 联动写入
// @ts-ignore
;(globalThis as any).__patchPurchaseDemand = (sourceId: string, patch: Record<string, any>) => {
  const idx = purchaseDemandList.findIndex((p) => p.id === sourceId)
  if (idx < 0) return false
  Object.assign(purchaseDemandList[idx], patch)
  return true
}

// ══════════════════════════════════════════════
// 6. 入库记录
// ══════════════════════════════════════════════
const inboundList = [
  { id: 'IN001', inboundCode: 'IN-2026-04-0001', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-04-0123', relatedOutboundCode: '', toolType: '刀具', itemCode: 'PO-2026-04-0123-L1', quantity: 30, operatorName: '王库管', inboundTime: '2026-04-22 10:00:00', storageLocation: 'CNC-WH-A1-01', barcodes: '', remark: '', workshopCode: 'CNC' },
  { id: 'IN002', inboundCode: 'IN-2026-04-0002', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-04-0125', relatedOutboundCode: '', toolType: '刀具', itemCode: 'PO-2026-04-0125-L1', quantity: 30, operatorName: '王库管', inboundTime: '2026-04-22 14:30:00', storageLocation: 'CNC-WH-A1-02', barcodes: '', remark: '', workshopCode: 'CNC' },
  { id: 'IN003', inboundCode: 'IN-2026-04-0003', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-03-0050', relatedOutboundCode: '', toolType: '模具', itemCode: 'PO-2026-03-0050-L1-01', quantity: 1, operatorName: '王库管', inboundTime: '2026-04-15 09:00:00', storageLocation: 'CNC-MWH-A-01', barcodes: 'BC-MOULD-2026-001', remark: '已打印模架条码', workshopCode: 'CNC' },
  { id: 'IN004', inboundCode: 'IN-2026-04-0004', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-03-0058', relatedOutboundCode: '', toolType: '模具', itemCode: 'PO-2026-03-0058-L1-01', quantity: 1, operatorName: '王库管', inboundTime: '2026-04-16 10:30:00', storageLocation: 'CNC-MWH-B-01', barcodes: 'BC-MOULD-2026-004', remark: '已打印模架条码', workshopCode: 'CNC' },
  { id: 'IN005', inboundCode: 'IN-2026-04-0005', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-04-0205', relatedOutboundCode: '', toolType: '量具', itemCode: 'PO-2026-04-0205-L1', quantity: 10, operatorName: '王库管', inboundTime: '2026-04-23 09:30:00', storageLocation: 'CNC-WH-G2-01', barcodes: '', remark: '', workshopCode: 'CNC' },
  { id: 'IN006', inboundCode: 'IN-2026-04-0006', inboundType: '退库入库', purchaseOrderNo: '', relatedOutboundCode: 'OUT-2026-04-0050', toolType: '量具', itemCode: 'PO-2026-04-0200-L1', quantity: 1, operatorName: '王库管', inboundTime: '2026-04-25 16:30:00', storageLocation: 'CNC-WH-G1-01', barcodes: '', remark: '量具借用归还，状态完好', workshopCode: 'CNC' },
  { id: 'IN007', inboundCode: 'IN-2026-04-0007', inboundType: '调拨入库', purchaseOrderNo: '', relatedOutboundCode: '', toolType: '刀具', itemCode: 'PO-2026-04-0140-L1', quantity: 2, operatorName: '王库管', inboundTime: '2026-04-24 11:15:00', storageLocation: 'CNC-WH-B1-01', barcodes: '', remark: '从注塑车间调拨入库', workshopCode: 'CNC' },
  { id: 'IN008', inboundCode: 'IN-2026-04-0008', inboundType: '采购入库', purchaseOrderNo: 'PO-2026-04-0152', relatedOutboundCode: '', toolType: '刀具', itemCode: 'PO-2026-04-0152-L1', quantity: 100, operatorName: '王库管', inboundTime: '2026-04-22 15:00:00', storageLocation: 'CNC-WH-C1-01', barcodes: '', remark: '麻花钻常规补货', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 7. 出库记录
// ══════════════════════════════════════════════
const outboundList = [
  { id: 'OUT001', outboundCode: 'OUT-2026-04-0001', outboundType: '领用', toolType: '刀具', itemCode: 'PO-2026-04-0123-L1', quantity: 5, receiverName: '操作工A', usageProcess: 'A1 设备外圆粗车', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-23 08:30:00', expectedReturnDate: '', remark: '', workshopCode: 'CNC' },
  { id: 'OUT002', outboundCode: 'OUT-2026-04-0002', outboundType: '领用', toolType: '刀具', itemCode: 'PO-2026-04-0125-L1', quantity: 3, receiverName: '操作工B', usageProcess: 'A2 设备外圆精车', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-23 09:15:00', expectedReturnDate: '', remark: '', workshopCode: 'CNC' },
  { id: 'OUT003', outboundCode: 'OUT-2026-04-0003', outboundType: '借用', toolType: '量具', itemCode: 'PO-2026-04-0200-L1', quantity: 2, receiverName: '检测员张三', usageProcess: '巡检 / 抽检', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-23 14:00:00', expectedReturnDate: '2026-04-25', remark: '抽检用，使用完毕请归还', workshopCode: 'CNC' },
  { id: 'OUT004', outboundCode: 'OUT-2026-04-0004', outboundType: '领用', toolType: '模具', itemCode: 'PO-2026-03-0050-L1-01', quantity: 1, receiverName: '注塑工长', usageProcess: 'INJ-001 注塑机上模', productionOrderNo: 'PO-WORK-2026-0421-01', operatorName: '王库管', outboundTime: '2026-04-21 08:00:00', expectedReturnDate: '', remark: '扫码 BC-MOULD-2026-001 关联生产订单', workshopCode: 'CNC' },
  { id: 'OUT005', outboundCode: 'OUT-2026-04-0005', outboundType: '领用', toolType: '模具', itemCode: 'PO-2026-03-0058-L1-02', quantity: 1, receiverName: '注塑工长', usageProcess: 'INJ-002 注塑机上模', productionOrderNo: 'PO-WORK-2026-0420-05', operatorName: '王库管', outboundTime: '2026-04-20 09:00:00', expectedReturnDate: '', remark: '扫码 BC-MOULD-2026-005 关联生产订单', workshopCode: 'CNC' },
  { id: 'OUT006', outboundCode: 'OUT-2026-04-0006', outboundType: '借用', toolType: '量具', itemCode: 'PO-2026-04-0205-L1', quantity: 1, receiverName: '操作工C', usageProcess: 'A3 设备首件检验', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-24 10:00:00', expectedReturnDate: '2026-04-26', remark: '首件检验借用', workshopCode: 'CNC' },
  { id: 'OUT007', outboundCode: 'OUT-2026-04-0007', outboundType: '调拨', toolType: '刀具', itemCode: 'PO-2026-04-0145-L1', quantity: 5, receiverName: '注塑车间组长', usageProcess: '注塑车间使用', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-25 13:30:00', expectedReturnDate: '', remark: '车间间调拨', workshopCode: 'CNC' },
  { id: 'OUT008', outboundCode: 'OUT-2026-04-0008', outboundType: '报废', toolType: '刀具', itemCode: 'PO-2026-04-0152-L1', quantity: 8, receiverName: '王库管', usageProcess: '报废处理', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-25 17:00:00', expectedReturnDate: '', remark: '钻头折断报废', workshopCode: 'CNC' },
  { id: 'OUT009', outboundCode: 'OUT-2026-04-0009', outboundType: '领用', toolType: '刀具', itemCode: 'PO-2026-04-0140-L1', quantity: 1, receiverName: '操作工D', usageProcess: 'A4 设备面铣', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-22 09:00:00', expectedReturnDate: '', remark: '', workshopCode: 'CNC' },
  { id: 'OUT010', outboundCode: 'OUT-2026-04-0010', outboundType: '领用', toolType: '刀具', itemCode: 'PO-2026-04-0150-L1', quantity: 4, receiverName: '操作工E', usageProcess: 'A6 设备键槽加工', productionOrderNo: '', operatorName: '王库管', outboundTime: '2026-04-24 14:30:00', expectedReturnDate: '', remark: '', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 8. 借用归还记录（量具）
// ══════════════════════════════════════════════
const borrowReturnList = [
  { id: 'BR001', borrowCode: 'BR-2026-04-0001', outboundCode: 'OUT-2026-04-0003', gaugeCode: 'PO-2026-04-0200-L1', borrowerName: '检测员张三', borrowDate: '2026-04-23', expectedReturnDate: '2026-04-25', actualReturnDate: '2026-04-25', returnStatus: '已归还', returnCondition: '完好', damageRemark: '', remark: '', workshopCode: 'CNC' },
  { id: 'BR002', borrowCode: 'BR-2026-04-0002', outboundCode: 'OUT-2026-04-0006', gaugeCode: 'PO-2026-04-0205-L1', borrowerName: '操作工C', borrowDate: '2026-04-24', expectedReturnDate: '2026-04-26', actualReturnDate: '', returnStatus: '已借用', returnCondition: '', damageRemark: '', remark: '尚未归还', workshopCode: 'CNC' },
  { id: 'BR003', borrowCode: 'BR-2026-04-0003', outboundCode: 'OUT-2026-04-0011', gaugeCode: 'PO-2026-04-0210-L1', borrowerName: '操作工A', borrowDate: '2026-04-15', expectedReturnDate: '2026-04-17', actualReturnDate: '2026-04-17', returnStatus: '已归还', returnCondition: '完好', damageRemark: '', remark: '', workshopCode: 'CNC' },
  { id: 'BR004', borrowCode: 'BR-2026-04-0004', outboundCode: 'OUT-2026-04-0012', gaugeCode: 'PO-2026-04-0212-L1', borrowerName: '操作工B', borrowDate: '2026-04-18', expectedReturnDate: '2026-04-20', actualReturnDate: '2026-04-21', returnStatus: '已归还', returnCondition: '完好', damageRemark: '', remark: '逾期1天归还', workshopCode: 'CNC' },
  { id: 'BR005', borrowCode: 'BR-2026-04-0005', outboundCode: 'OUT-2026-04-0013', gaugeCode: 'PO-2026-04-0228-L1', borrowerName: '检测员李四', borrowDate: '2026-04-22', expectedReturnDate: '2026-04-24', actualReturnDate: '2026-04-24', returnStatus: '已归还', returnCondition: '损坏', damageRemark: '指针卡顿，已联动报废', remark: '已转报废登记', workshopCode: 'CNC' },
  { id: 'BR006', borrowCode: 'BR-2026-04-0006', outboundCode: 'OUT-2026-04-0014', gaugeCode: 'PO-2026-04-0220-L1', borrowerName: '检测员王五', borrowDate: '2026-04-10', expectedReturnDate: '2026-04-12', actualReturnDate: '', returnStatus: '逾期', returnCondition: '', damageRemark: '', remark: '已发催办通知', workshopCode: 'CNC' },
  { id: 'BR007', borrowCode: 'BR-2026-04-0007', outboundCode: 'OUT-2026-04-0015', gaugeCode: 'PO-2026-04-0225-L1', borrowerName: '检测员张三', borrowDate: '2026-04-20', expectedReturnDate: '2026-04-22', actualReturnDate: '2026-04-22', returnStatus: '已归还', returnCondition: '完好', damageRemark: '', remark: '', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 9. 报废登记
// ══════════════════════════════════════════════
const scrapList = [
  { id: 'SC001', scrapCode: 'SC-2026-04-0001', toolType: '刀具', itemCode: 'PO-2026-04-0152-L1', scrapQuantity: 8, scrapReason: '损坏', reasonDetail: '钻头折断（连续断刀）', disposalType: '回收', operatorName: '王库管', reviewerName: '刚嘉成', scrapTime: '2026-04-25 17:00:00', attachments: '', remark: '已联动出库 OUT-2026-04-0008', workshopCode: 'CNC' },
  { id: 'SC002', scrapCode: 'SC-2026-04-0002', toolType: '量具', itemCode: 'PO-2026-04-0228-L1', scrapQuantity: 1, scrapReason: '精度不达标', reasonDetail: '指针卡顿，校准失败', disposalType: '销毁', operatorName: '检测员李四', reviewerName: '刚嘉成', scrapTime: '2026-04-24 16:00:00', attachments: '', remark: '借用归还时发现损坏', workshopCode: 'CNC' },
  { id: 'SC003', scrapCode: 'SC-2026-04-0003', toolType: '刀具', itemCode: 'PO-2026-04-0143-L1', scrapQuantity: 1, scrapReason: '损耗', reasonDetail: '刀刃磨损严重，多次重磨', disposalType: '回收', operatorName: '操作工B', reviewerName: '刚嘉成', scrapTime: '2026-04-20 11:30:00', attachments: '', remark: '使用 6 个月达预期寿命', workshopCode: 'CNC' },
  { id: 'SC004', scrapCode: 'SC-2026-04-0004', toolType: '模具', itemCode: 'PO-2026-03-0072-L1-01', scrapQuantity: 0, scrapReason: '损坏', reasonDetail: '导柱磨损严重，已送修', disposalType: '保留', operatorName: '注塑工长', reviewerName: '刚嘉成', scrapTime: '2026-04-22 10:00:00', attachments: '', remark: '维修中，未实际报废', workshopCode: 'CNC' },
  { id: 'SC005', scrapCode: 'SC-2026-04-0005', toolType: '刀具', itemCode: 'PO-2026-04-0145-L1', scrapQuantity: 5, scrapReason: '损坏', reasonDetail: '加工不锈钢崩刃', disposalType: '回收', operatorName: '操作工A', reviewerName: '刚嘉成', scrapTime: '2026-04-19 14:00:00', attachments: '', remark: '', workshopCode: 'CNC' },
  { id: 'SC006', scrapCode: 'SC-2026-04-0006', toolType: '量具', itemCode: 'PO-2026-04-0210-L1', scrapQuantity: 1, scrapReason: '丢失', reasonDetail: '车间内遗失，多次寻找未果', disposalType: '销毁', operatorName: '操作工A', reviewerName: '刚嘉成', scrapTime: '2026-04-15 17:30:00', attachments: '', remark: '已扣减库存', workshopCode: 'CNC' },
]

// ══════════════════════════════════════════════
// 接口定义
// ══════════════════════════════════════════════
export default <MockMethod[]>[
  // 工器具分类树
  {
    url: '/admin-api/eam/tool-category/tree',
    method: 'get',
    response: ({ query }) => {
      const { toolType } = query
      let list = toolCategoryTree
      if (toolType) list = list.filter(c => c.toolType === toolType)
      return { code: 200, data: list }
    }
  },
  {
    url: '/admin-api/eam/tool-category/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      let list = toolCategoryTree
      if (query.toolType) list = list.filter(c => c.toolType === query.toolType)
      if (query.name) list = list.filter(c => (c.name || '').includes(query.name))
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    }
  },

  // 刀具档案
  {
    url: '/admin-api/eam/tool-master/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      let list = toolMasterList
      if (query.toolName) list = list.filter(t => t.toolName.includes(query.toolName))
      if (query.toolCode) list = list.filter(t => t.toolCode.includes(query.toolCode))
      // 树节点过滤：categoryFilter 是分类路径中的某个段（如 "车削"、"车外圆"）
      if (query.categoryFilter && query.categoryFilter !== 'ALL') {
        list = list.filter(t => (t.categoryPath || '').includes(query.categoryFilter))
      }
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    }
  },
  {
    url: '/admin-api/eam/tool-master/get',
    method: 'get',
    response: ({ query }) => {
      const item = toolMasterList.find(t => t.id === query.id)
      return { code: 200, data: item || null }
    }
  },
  // ── 刀具档案 CRUD ──
  {
    url: '/admin-api/eam/tool-master/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'T' + String(Date.now()).slice(-6)
      const now = new Date().toISOString().slice(0,10).replace(/-/g,'')
      const newItem = {
        id,
        toolCode: body.toolCode || `PO-${now}-USER-L1`,
        categoryPath: body.categoryPath || '',
        currentStock: body.currentStock ?? body.inboundQty ?? 0,
        status: '已启用',
        workshopCode: 'CNC',
        ...body,
      }
      toolMasterList.unshift(newItem)
      return { code: 200, data: { id } }
    }
  },
  {
    url: '/admin-api/eam/tool-master/update',
    method: 'post',
    response: ({ body }) => {
      const idx = toolMasterList.findIndex(t => t.id === body.id)
      if (idx >= 0) toolMasterList[idx] = { ...toolMasterList[idx], ...body }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tool-master/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = toolMasterList.findIndex(t => t.id === query.id)
      if (idx >= 0) toolMasterList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 量具档案 CRUD ──
  {
    url: '/admin-api/eam/gauge-master/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'G' + String(Date.now()).slice(-6)
      const now = new Date().toISOString().slice(0,10).replace(/-/g,'')
      const newItem = {
        id,
        gaugeCode: body.gaugeCode || `PO-${now}-USER-L1`,
        currentStock: body.currentStock ?? body.inboundQty ?? 0,
        borrowedQty: 0,
        status: '已启用',
        workshopCode: 'CNC',
        ...body,
      }
      gaugeMasterList.unshift(newItem)
      return { code: 200, data: { id } }
    }
  },
  {
    url: '/admin-api/eam/gauge-master/update',
    method: 'post',
    response: ({ body }) => {
      const idx = gaugeMasterList.findIndex(t => t.id === body.id)
      if (idx >= 0) gaugeMasterList[idx] = { ...gaugeMasterList[idx], ...body }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/gauge-master/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = gaugeMasterList.findIndex(t => t.id === query.id)
      if (idx >= 0) gaugeMasterList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 模具档案 CRUD ──
  {
    url: '/admin-api/eam/mould-master/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'M' + String(Date.now()).slice(-6)
      const now = new Date().toISOString().slice(0,10).replace(/-/g,'')
      const newItem = {
        id,
        mouldCode: body.mouldCode || `PO-${now}-USER-L1-01`,
        barcode: 'BC-MOULD-' + Date.now(),
        status: '在库',
        usageCount: 0,
        workshopCode: 'CNC',
        ...body,
      }
      mouldMasterList.unshift(newItem)
      return { code: 200, data: { id } }
    }
  },
  {
    url: '/admin-api/eam/mould-master/update',
    method: 'post',
    response: ({ body }) => {
      const idx = mouldMasterList.findIndex(t => t.id === body.id)
      if (idx >= 0) mouldMasterList[idx] = { ...mouldMasterList[idx], ...body }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/mould-master/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = mouldMasterList.findIndex(t => t.id === query.id)
      if (idx >= 0) mouldMasterList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 工器具分类 CRUD ──
  {
    url: '/admin-api/eam/tool-category/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'CAT' + String(Date.now()).slice(-6)
      toolCategoryTree.push({
        id, code: id, name: body.name, toolType: body.toolType || '刀具',
        parentId: body.parentId || 0, level: body.level || 1, sort: body.sort || 99, status: 1
      })
      return { code: 200, data: { id } }
    }
  },
  {
    url: '/admin-api/eam/tool-category/update',
    method: 'post',
    response: ({ body }) => {
      const idx = toolCategoryTree.findIndex(c => c.id === body.id)
      if (idx >= 0) Object.assign(toolCategoryTree[idx], body)
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tool-category/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = toolCategoryTree.findIndex(c => c.id === query.id)
      if (idx >= 0) toolCategoryTree.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 入库管理 CRUD ──
  {
    url: '/admin-api/eam/tooling-inbound/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'IN' + String(Date.now()).slice(-6)
      const code = 'IN-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + String(inboundList.length + 1).padStart(4, '0')
      inboundList.unshift({
        id, inboundCode: code, inboundTime: new Date().toISOString().slice(0,19).replace('T',' '),
        operatorName: body.operatorName || '当前用户', barcodes: '', workshopCode: 'CNC',
        ...body,
      })
      return { code: 200, data: { id, inboundCode: code } }
    }
  },
  {
    url: '/admin-api/eam/tooling-inbound/update',
    method: 'post',
    response: ({ body }) => {
      const idx = inboundList.findIndex(p => p.id === body.id)
      if (idx >= 0) Object.assign(inboundList[idx], body)
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tooling-inbound/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = inboundList.findIndex(p => p.id === query.id)
      if (idx >= 0) inboundList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 出库管理 CRUD ──
  {
    url: '/admin-api/eam/tooling-outbound/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'OUT' + String(Date.now()).slice(-6)
      const code = 'OUT-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + String(outboundList.length + 1).padStart(4, '0')
      outboundList.unshift({
        id, outboundCode: code, outboundTime: new Date().toISOString().slice(0,19).replace('T',' '),
        operatorName: body.operatorName || '当前用户', workshopCode: 'CNC',
        ...body,
      })
      return { code: 200, data: { id, outboundCode: code } }
    }
  },
  {
    url: '/admin-api/eam/tooling-outbound/update',
    method: 'post',
    response: ({ body }) => {
      const idx = outboundList.findIndex(p => p.id === body.id)
      if (idx >= 0) Object.assign(outboundList[idx], body)
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tooling-outbound/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = outboundList.findIndex(p => p.id === query.id)
      if (idx >= 0) outboundList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 借用归还 CRUD ──
  {
    url: '/admin-api/eam/gauge-borrow-return/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'BR' + String(Date.now()).slice(-6)
      const code = 'BR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + String(borrowReturnList.length + 1).padStart(4, '0')
      borrowReturnList.unshift({
        id, borrowCode: code, returnStatus: '已借用', returnCondition: '', actualReturnDate: '',
        damageRemark: '', workshopCode: 'CNC',
        ...body,
      })
      return { code: 200, data: { id, borrowCode: code } }
    }
  },
  {
    url: '/admin-api/eam/gauge-borrow-return/return',
    method: 'post',
    response: ({ body }) => {
      const idx = borrowReturnList.findIndex(p => p.id === body.id)
      if (idx >= 0) {
        borrowReturnList[idx] = {
          ...borrowReturnList[idx],
          actualReturnDate: body.actualReturnDate,
          returnCondition: body.returnCondition,
          damageRemark: body.damageRemark || '',
          remark: body.remark || '',
          returnStatus: '已归还',
        }
      }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/gauge-borrow-return/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = borrowReturnList.findIndex(p => p.id === query.id)
      if (idx >= 0) borrowReturnList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  // ── 报废登记 CRUD ──
  {
    url: '/admin-api/eam/tooling-scrap/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'SC' + String(Date.now()).slice(-6)
      const code = 'SC-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + String(scrapList.length + 1).padStart(4, '0')
      scrapList.unshift({
        id, scrapCode: code, scrapTime: new Date().toISOString().slice(0,19).replace('T',' '),
        operatorName: body.operatorName || '当前用户', workshopCode: 'CNC', attachments: '',
        ...body,
      })
      return { code: 200, data: { id, scrapCode: code } }
    }
  },
  {
    url: '/admin-api/eam/tooling-scrap/update',
    method: 'post',
    response: ({ body }) => {
      const idx = scrapList.findIndex(p => p.id === body.id)
      if (idx >= 0) Object.assign(scrapList[idx], body)
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tooling-scrap/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = scrapList.findIndex(p => p.id === query.id)
      if (idx >= 0) scrapList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },

  // 量具档案
  {
    url: '/admin-api/eam/gauge-master/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      let list = gaugeMasterList
      if (query.gaugeName) list = list.filter(t => t.gaugeName.includes(query.gaugeName))
      if (query.categoryFilter && query.categoryFilter !== 'ALL') {
        list = list.filter(t => (t.categoryPath || '').includes(query.categoryFilter))
      }
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    }
  },
  {
    url: '/admin-api/eam/gauge-master/get',
    method: 'get',
    response: ({ query }) => {
      const item = gaugeMasterList.find(t => t.id === query.id)
      return { code: 200, data: item || null }
    }
  },

  // 模具档案
  {
    url: '/admin-api/eam/mould-master/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      let list = mouldMasterList
      if (query.mouldName) list = list.filter(t => t.mouldName.includes(query.mouldName))
      if (query.barcode) list = list.filter(t => t.barcode.includes(query.barcode))
      if (query.categoryFilter && query.categoryFilter !== 'ALL') {
        list = list.filter(t => (t.categoryPath || '').includes(query.categoryFilter))
      }
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    }
  },
  {
    url: '/admin-api/eam/mould-master/get',
    method: 'get',
    response: ({ query }) => {
      const item = mouldMasterList.find(t => t.id === query.id)
      return { code: 200, data: item || null }
    }
  },

  // 采购需求
  {
    url: '/admin-api/eam/tool-purchase-demand/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      let list = purchaseDemandList.slice()
      if (query.demandCode) list = list.filter(p => (p.demandCode || '').includes(query.demandCode))
      if (query.itemName) list = list.filter(p => (p.itemName || '').includes(query.itemName))
      if (query.approvalStatus) list = list.filter(p => p.approvalStatus === query.approvalStatus)
      return { code: 200, data: paginate(list, query.pageNo, query.pageSize) }
    }
  },
  {
    url: '/admin-api/eam/tool-purchase-demand/get',
    method: 'get',
    response: ({ query }) => {
      const item = purchaseDemandList.find(p => p.id === query.id)
      return { code: 200, data: item || null }
    }
  },
  // ── 采购需求 CRUD + 业务操作 ──
  {
    url: '/admin-api/eam/tool-purchase-demand/create',
    method: 'post',
    response: ({ body }) => {
      const id = 'PD' + String(Date.now()).slice(-6)
      const now = new Date()
      const code = `PD-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(purchaseDemandList.length+1).padStart(4,'0')}`
      purchaseDemandList.unshift({
        id, demandCode: code,
        toolType: body.toolType || '',
        categoryPath: body.categoryPath || '',
        itemName: body.itemName || '',
        specification: body.specification || '',
        quantity: body.quantity || 1,
        unit: body.unit || '',
        expectedDate: body.expectedDate || '',
        applicantName: body.applicantName || '当前用户',
        department: body.department || '数控机加车间',
        usagePurpose: body.usagePurpose || '',
        erpPushStatus: '',
        erpPurchaseOrderNo: '',
        pushFailReason: '',
        createTime: now.toISOString().slice(0,19).replace('T',' '),
        workshopCode: 'CNC',
        approvalStatus: 'DRAFT',
        feishuApprovalCode: '',
        feishuApprovalUrl: '',
        approver: '',
        approvedAt: '',
        approvalNodes: [],
        erpStatus: '',
        erpFailReason: '',
      })
      return { code: 200, data: { id, demandCode: code } }
    }
  },
  {
    url: '/admin-api/eam/tool-purchase-demand/update',
    method: 'post',
    response: ({ body }) => {
      const idx = purchaseDemandList.findIndex(p => p.id === body.id)
      if (idx >= 0) Object.assign(purchaseDemandList[idx], body)
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/eam/tool-purchase-demand/delete',
    method: 'delete',
    response: ({ query }) => {
      const idx = purchaseDemandList.findIndex(p => p.id === query.id)
      if (idx >= 0) purchaseDemandList.splice(idx, 1)
      return { code: 200, data: true }
    }
  },
  {
    // 兼容旧路径：直连 ERP（不走审批），新流程请用 /erp/purchase-order/create
    url: '/admin-api/eam/tool-purchase-demand/push-erp',
    method: 'post',
    response: ({ body }) => {
      const po = 'PO-2026-04-' + Math.floor(Math.random() * 9000 + 1000)
      const idx = purchaseDemandList.findIndex(p => p.id === body.id)
      if (idx >= 0) {
        purchaseDemandList[idx].erpPushStatus = '已生成PO'
        purchaseDemandList[idx].erpPurchaseOrderNo = po
        purchaseDemandList[idx].pushFailReason = ''
        purchaseDemandList[idx].approvalStatus = 'PO_GENERATED'
        purchaseDemandList[idx].erpStatus = 'SUCCESS'
        purchaseDemandList[idx].erpFailReason = ''
      }
      return { code: 200, data: { erpPurchaseOrderNo: po } }
    }
  },

  // 入库
  {
    url: '/admin-api/eam/tooling-inbound/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      return { code: 200, data: paginate(inboundList, query.pageNo, query.pageSize) }
    }
  },

  // 出库
  {
    url: '/admin-api/eam/tooling-outbound/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      return { code: 200, data: paginate(outboundList, query.pageNo, query.pageSize) }
    }
  },

  // 借用归还
  {
    url: '/admin-api/eam/gauge-borrow-return/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      return { code: 200, data: paginate(borrowReturnList, query.pageNo, query.pageSize) }
    }
  },

  // 报废
  {
    url: '/admin-api/eam/tooling-scrap/page',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      if (ws !== 'CNC' && ws !== 'ALL') return { code: 200, data: { records: [], total: 0 } }
      return { code: 200, data: paginate(scrapList, query.pageNo, query.pageSize) }
    }
  },

  // 月度消耗报表 (mock)
  {
    url: '/admin-api/eam/tooling-report/monthly',
    method: 'get',
    response: () => ({
      code: 200,
      data: {
        totalQuantity: 245,
        totalAmount: 38540,
        byCategory: [
          { name: '刀具', quantity: 156, amount: 18420 },
          { name: '量具', quantity: 12, amount: 4200 },
          { name: '模具', quantity: 0, amount: 0 },
        ],
        byOperator: [
          { name: '操作工A', quantity: 38, amount: 4520 },
          { name: '操作工B', quantity: 32, amount: 3850 },
          { name: '操作工C', quantity: 28, amount: 3210 },
        ]
      }
    })
  },
]
