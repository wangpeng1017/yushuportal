/**
 * Mock: 保养/点检/维修/备件 工单数据
 * 三车间独立数据，通过 token 识别数据权限
 */

import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}
function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter(item => item.workshopCode === ws)
}

// ══════════════════════════════════════════════
// 保养标准
// ══════════════════════════════════════════════
const maintenanceStandards = [
  { id: 'MS-C01', workshopCode: 'C', code: 'MS-C-001', name: '绕线机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '剪刀部润滑/工件夹紧部/XYZ轴/张力器', createTime: '2025-01-10' },
  { id: 'MS-C02', workshopCode: 'C', code: 'MS-C-002', name: 'PACK线季度保养标准', equipmentTypeCode: 'T001', equipmentTypeDesc: '非标设备', remark: '适用于C端PACK线', createTime: '2025-02-01' },
  { id: 'MS-B01', workshopCode: 'B', code: 'MS-B-001', name: '自动锁螺丝机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '台面清洁/气压检查/按钮/治具/急停', createTime: '2025-01-15' },
  { id: 'MS-B02', workshopCode: 'B', code: 'MS-B-002', name: '电阻焊接机月保养标准', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', remark: '适用于B端焊接设备', createTime: '2025-03-01' },
  { id: 'MS-N01', workshopCode: 'CNC', code: 'MS-N-001', name: 'CNC铣削月保养标准', equipmentTypeCode: 'T005', equipmentTypeDesc: '数控设备', remark: '适用于台群/乔峰/哈斯等CNC设备', createTime: '2025-01-15' },
  { id: 'MS-N02', workshopCode: 'CNC', code: 'MS-N-002', name: '注塑机季度保养标准', equipmentTypeCode: 'T006', equipmentTypeDesc: '注塑设备', remark: '适用于海天注塑机', createTime: '2025-02-01' },
]

// ══════════════════════════════════════════════
// 保养标准项清单（关联 maintenanceStandardCode）
// ══════════════════════════════════════════════
const maintenanceStandardItems: any[] = [
  // MS-C-001 绕线机月保养标准（5 项）
  { id: 'MSI-C0101', maintenanceStandardCode: 'MS-C-001', maintenancePart: '剪刀部', remark: '剪刀刃口清洁、润滑（NSK PS-2 润滑脂 0.5g），检查刃口磨损情况', seq: 1, createByPersonName: '陆钟', createTime: '2025-01-10' },
  { id: 'MSI-C0102', maintenanceStandardCode: 'MS-C-001', maintenancePart: '工件夹紧部', remark: '夹爪清洁、检查弹簧弹力、调整夹紧扭矩至 0.8 N·m', seq: 2, createByPersonName: '陆钟', createTime: '2025-01-10' },
  { id: 'MSI-C0103', maintenanceStandardCode: 'MS-C-001', maintenancePart: 'XYZ 轴导轨', remark: '导轨清洁、加注导轨油、检查传动皮带松紧、丝杆跳动 ≤ 0.005 mm', seq: 3, createByPersonName: '陆钟', createTime: '2025-01-10' },
  { id: 'MSI-C0104', maintenanceStandardCode: 'MS-C-001', maintenancePart: '张力器', remark: '更换张力器羊毛轮（每月 1 次），校准张力值 0.3-0.5 N', seq: 4, createByPersonName: '陆钟', createTime: '2025-01-10' },
  { id: 'MSI-C0105', maintenanceStandardCode: 'MS-C-001', maintenancePart: '电气与急停', remark: '急停按钮功能测试、漆包线绝缘电阻 ≥ 50 MΩ、控制柜清洁除尘', seq: 5, createByPersonName: '陆钟', createTime: '2025-01-10' },

  // MS-C-002 PACK 线季度保养标准（4 项）
  { id: 'MSI-C0201', maintenanceStandardCode: 'MS-C-002', maintenancePart: '上下料工位', remark: '机械手夹爪清洁、传感器校准、皮带张紧度检查', seq: 1, createByPersonName: '系统', createTime: '2025-02-01' },
  { id: 'MSI-C0202', maintenanceStandardCode: 'MS-C-002', maintenancePart: '点胶工位', remark: '点胶针头更换、胶筒清洗、压力校准 0.4 MPa、胶量校准', seq: 2, createByPersonName: '系统', createTime: '2025-02-01' },
  { id: 'MSI-C0203', maintenanceStandardCode: 'MS-C-002', maintenancePart: '压合工位', remark: '伺服压机精度校准、压力传感器零点校准、模具紧固螺栓检查', seq: 3, createByPersonName: '系统', createTime: '2025-02-01' },
  { id: 'MSI-C0204', maintenanceStandardCode: 'MS-C-002', maintenancePart: '测试与下料', remark: 'DCIR 测试夹具清洁、出料皮带润滑、安全光栅功能测试', seq: 4, createByPersonName: '系统', createTime: '2025-02-01' },

  // MS-B-001 自动锁螺丝机月保养标准（5 项）
  { id: 'MSI-B0101', maintenanceStandardCode: 'MS-B-001', maintenancePart: '台面清洁', remark: '工作台面、防尘罩、丝桶通道全面清洁', seq: 1, createByPersonName: '买盼', createTime: '2025-01-15' },
  { id: 'MSI-B0102', maintenanceStandardCode: 'MS-B-001', maintenancePart: '气压系统', remark: '气源压力 0.5-0.7 MPa、气管接头无泄漏、过滤器排水', seq: 2, createByPersonName: '买盼', createTime: '2025-01-15' },
  { id: 'MSI-B0103', maintenanceStandardCode: 'MS-B-001', maintenancePart: '操作按钮与急停', remark: '功能测试急停按钮、双手启动按钮、复位按钮', seq: 3, createByPersonName: '买盼', createTime: '2025-01-15' },
  { id: 'MSI-B0104', maintenanceStandardCode: 'MS-B-001', maintenancePart: '治具校准', remark: '锁附治具同心度校准、扭矩校准至 0.8 N·m', seq: 4, createByPersonName: '买盼', createTime: '2025-01-15' },
  { id: 'MSI-B0105', maintenanceStandardCode: 'MS-B-001', maintenancePart: '批头与吸丝', remark: '批头磨损检查、吸丝管路清理、必要时更换批头', seq: 5, createByPersonName: '买盼', createTime: '2025-01-15' },

  // MS-B-002 电阻焊接机月保养标准（4 项）
  { id: 'MSI-B0201', maintenanceStandardCode: 'MS-B-002', maintenancePart: '电极头', remark: '电极头修磨、表面氧化层去除、必要时更换', seq: 1, createByPersonName: '系统', createTime: '2025-03-01' },
  { id: 'MSI-B0202', maintenanceStandardCode: 'MS-B-002', maintenancePart: '冷却水路', remark: '冷却水流量检查 ≥ 4 L/min、水管无渗漏、冷却液 PH 值检测', seq: 2, createByPersonName: '系统', createTime: '2025-03-01' },
  { id: 'MSI-B0203', maintenanceStandardCode: 'MS-B-002', maintenancePart: '电源与变压器', remark: '电源接线紧固、变压器温升测试、绝缘电阻 ≥ 50 MΩ', seq: 3, createByPersonName: '系统', createTime: '2025-03-01' },
  { id: 'MSI-B0204', maintenanceStandardCode: 'MS-B-002', maintenancePart: '焊接参数校验', remark: '焊接电流校准、焊接时间校准、保压时间校准', seq: 4, createByPersonName: '系统', createTime: '2025-03-01' },

  // MS-N-001 CNC 铣削月保养标准（6 项）
  { id: 'MSI-N0101', maintenanceStandardCode: 'MS-N-001', maintenancePart: '主轴系统', remark: '主轴润滑油位检查、主轴温升测试、主轴跳动 ≤ 0.005 mm', seq: 1, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSI-N0102', maintenanceStandardCode: 'MS-N-001', maintenancePart: '导轨与丝杆', remark: '导轨油液位、丝杆润滑、防护钢板检查、反向间隙补偿', seq: 2, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSI-N0103', maintenanceStandardCode: 'MS-N-001', maintenancePart: '冷却系统', remark: '冷却液浓度检测 5%、液位补充、冷却泵过滤网清理', seq: 3, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSI-N0104', maintenanceStandardCode: 'MS-N-001', maintenancePart: '液压系统', remark: '液压油液位、液压油滤芯（每月更换）、油压 4-6 MPa 校准', seq: 4, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSI-N0105', maintenanceStandardCode: 'MS-N-001', maintenancePart: '气动系统', remark: '气源压力 0.6 MPa、油雾器油量、气管无泄漏', seq: 5, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSI-N0106', maintenanceStandardCode: 'MS-N-001', maintenancePart: '换刀机构', remark: '刀库清洁、刀爪磨损检查、换刀位精度校准', seq: 6, createByPersonName: '刚嘉成', createTime: '2025-01-15' },

  // MS-N-002 注塑机季度保养标准（5 项）
  { id: 'MSI-N0201', maintenanceStandardCode: 'MS-N-002', maintenancePart: '锁模机构', remark: '哥林柱润滑、锁模力校准、模板平行度检测', seq: 1, createByPersonName: '彭向', createTime: '2025-02-01' },
  { id: 'MSI-N0202', maintenanceStandardCode: 'MS-N-002', maintenancePart: '注射系统', remark: '螺杆磨损检查、料斗清理、止逆环检查', seq: 2, createByPersonName: '彭向', createTime: '2025-02-01' },
  { id: 'MSI-N0203', maintenanceStandardCode: 'MS-N-002', maintenancePart: '加热系统', remark: '加热圈电阻测试、热电偶校准、温度区段校准 ±2℃', seq: 3, createByPersonName: '彭向', createTime: '2025-02-01' },
  { id: 'MSI-N0204', maintenanceStandardCode: 'MS-N-002', maintenancePart: '液压系统', remark: '液压油更换（46# 抗磨液压油 200L）、滤芯更换、油温 ≤ 50℃', seq: 4, createByPersonName: '彭向', createTime: '2025-02-01' },
  { id: 'MSI-N0205', maintenanceStandardCode: 'MS-N-002', maintenancePart: '电气与安全', remark: '安全门检测、急停按钮测试、漏电保护测试', seq: 5, createByPersonName: '彭向', createTime: '2025-02-01' },
]

// ══════════════════════════════════════════════
// 保养标准物料清单（关联 maintenanceStandardCode + sparePartId）
// 业务规则 Q6=B：选填，纯检查类标准可不配物料
// ══════════════════════════════════════════════
const maintenanceStandardSpareParts: any[] = [
  // MS-C-001 绕线机月保养（2 项物料）
  { id: 'MSP-C0101', maintenanceStandardCode: 'MS-C-001', sparePartId: 'SP02', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', specification: '0.5g/次', unit: '管', planQty: 1, remark: '剪刀部润滑', seq: 1, createByPersonName: '陆钟', createTime: '2025-01-10' },
  { id: 'MSP-C0102', maintenanceStandardCode: 'MS-C-001', sparePartId: 'SP03', sparePartNumber: 'BJ-003', sparePartName: '张力器羊毛轮', specification: '标准', unit: '个', planQty: 1, remark: '每月更换', seq: 2, createByPersonName: '陆钟', createTime: '2025-01-10' },
  // MS-C-002 PACK 线季度保养（无物料 - 演示纯检查类）
  // MS-B-001 锁螺丝机月保养（2 项物料）
  { id: 'MSP-B0101', maintenanceStandardCode: 'MS-B-001', sparePartId: 'SP04', sparePartNumber: 'BJ-004', sparePartName: '急停按钮', specification: 'φ22', unit: '个', planQty: 1, remark: '功能异常时备用', seq: 1, createByPersonName: '买盼', createTime: '2025-01-15' },
  { id: 'MSP-B0102', maintenanceStandardCode: 'MS-B-001', sparePartId: 'SP05', sparePartNumber: 'BJ-005', sparePartName: '气管接头', specification: '6mm', unit: '个', planQty: 2, remark: '气路密封件', seq: 2, createByPersonName: '买盼', createTime: '2025-01-15' },
  // MS-B-002 电阻焊接机月保养（1 项）
  { id: 'MSP-B0201', maintenanceStandardCode: 'MS-B-002', sparePartId: 'SP01', sparePartNumber: 'BJ-001', sparePartName: '485通讯端子', specification: '标准', unit: '个', planQty: 1, remark: '通讯异常时备用', seq: 1, createByPersonName: '系统', createTime: '2025-03-01' },
  // MS-N-001 CNC 铣削月保养（3 项物料 - CNC 用得最多）
  { id: 'MSP-N0101', maintenanceStandardCode: 'MS-N-001', sparePartId: 'SP02', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', specification: '0.5g/次', unit: '管', planQty: 2, remark: '导轨润滑', seq: 1, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSP-N0102', maintenanceStandardCode: 'MS-N-001', sparePartId: 'SP05', sparePartNumber: 'BJ-005', sparePartName: '气管接头', specification: '6mm', unit: '个', planQty: 1, remark: '气路检漏', seq: 2, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  { id: 'MSP-N0103', maintenanceStandardCode: 'MS-N-001', sparePartId: 'SP04', sparePartNumber: 'BJ-004', sparePartName: '急停按钮', specification: 'φ22', unit: '个', planQty: 1, remark: '安全装置备用件', seq: 3, createByPersonName: '刚嘉成', createTime: '2025-01-15' },
  // MS-N-002 注塑机季度保养（2 项 - 季度大保养，含液压油更换）
  { id: 'MSP-N0201', maintenanceStandardCode: 'MS-N-002', sparePartId: 'SP02', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', specification: '0.5g/次', unit: '管', planQty: 3, remark: '哥林柱润滑', seq: 1, createByPersonName: '彭向', createTime: '2025-02-01' },
  { id: 'MSP-N0202', maintenanceStandardCode: 'MS-N-002', sparePartId: 'SP05', sparePartNumber: 'BJ-005', sparePartName: '气管接头', specification: '6mm', unit: '个', planQty: 4, remark: '气路全检更换', seq: 2, createByPersonName: '彭向', createTime: '2025-02-01' },
]

// ══════════════════════════════════════════════
// 保养计划主数据（关联保养标准 maintenanceStandardCode，保证保养项数据一致）
// periodicFrequencyType 改为字符串类型，配合 queryDictItem 字典工作
// ══════════════════════════════════════════════
const maintenancePlans: any[] = [
  { id: 'MP-C01', maintenanceStandardCode: 'MS-C-001', workshopCode: 'C', code: 'MP-C-001', name: '绕线机月保养计划', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', planStartTime: '2025-01-01', planEndTime: '2026-12-31', periodicFrequencyType: '每月', periodicFrequency: '1日', oneStr: '', oneStrArr: [1], validityPeriod: 1440, status: '1', statusDesc: '已启用', createTime: '2025-01-01' },
  { id: 'MP-C02', maintenanceStandardCode: 'MS-C-002', workshopCode: 'C', code: 'MP-C-002', name: 'PACK线季度保养计划', equipmentTypeCode: 'T001', equipmentTypeDesc: '非标设备', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', planStartTime: '2025-02-01', planEndTime: '2026-12-31', periodicFrequencyType: '每季度', periodicFrequency: '第1月-15日', oneStr: '', oneStrArr: [1], twoStrArr: [15], validityPeriod: 4320, status: '1', statusDesc: '已启用', createTime: '2025-02-01' },
  { id: 'MP-B01', maintenanceStandardCode: 'MS-B-001', workshopCode: 'B', code: 'MP-B-001', name: '锁螺丝机月保养计划', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', planStartTime: '2025-02-01', planEndTime: '2026-12-31', periodicFrequencyType: '每周', periodicFrequency: '周五', oneStrArr: ['周五'], validityPeriod: 480, status: '1', statusDesc: '已启用', createTime: '2025-02-01' },
  { id: 'MP-B02', maintenanceStandardCode: 'MS-B-002', workshopCode: 'B', code: 'MP-B-002', name: '电阻焊接机月保养计划', equipmentTypeCode: 'T003', equipmentTypeDesc: '加工类设备', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', planStartTime: '2025-03-01', planEndTime: '2026-12-31', periodicFrequencyType: '每月', periodicFrequency: '15日', oneStrArr: [15], validityPeriod: 720, status: '1', statusDesc: '已启用', createTime: '2025-03-01' },
  { id: 'MP-N01', maintenanceStandardCode: 'MS-N-001', workshopCode: 'CNC', code: 'MP-N-001', name: 'CNC月保养计划', equipmentTypeCode: 'T005', equipmentTypeDesc: '数控设备', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', planStartTime: '2025-01-15', planEndTime: '2026-12-31', periodicFrequencyType: '每月', periodicFrequency: '5日,20日', oneStrArr: [5, 20], validityPeriod: 1440, status: '1', statusDesc: '已启用', createTime: '2025-01-15' },
  { id: 'MP-N02', maintenanceStandardCode: 'MS-N-002', workshopCode: 'CNC', code: 'MP-N-002', name: '注塑机季度保养计划', equipmentTypeCode: 'T006', equipmentTypeDesc: '注塑设备', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', planStartTime: '2025-02-01', planEndTime: '2026-12-31', periodicFrequencyType: '每季度', periodicFrequency: '第3月-25日', oneStrArr: [3], twoStrArr: [25], validityPeriod: 4320, status: '1', statusDesc: '已启用', createTime: '2025-02-01' },
]

// ══════════════════════════════════════════════
// 保养工单
// ══════════════════════════════════════════════
const maintenanceWorkOrders = [
  { id: 'MW-C01', maintenanceStandardCode: 'MS-C-001', workshopCode: 'C', code: 'MW-C-0001', planName: '绕线机月保养计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeDesc: '加工类设备', equipmentModel: 'LP-50', equipmentSupplierName: '华诚精密', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '4', personName: '陆钟', workStartTime: '2026-04-01 08:00', overdueTime: '2026-04-01 18:00', startTime: '2026-04-01 09:15', endTime: '2026-04-01 10:30', useTime: '1小时15分', remark: '', createByPersonName: '系统', createTime: '2026-04-01 08:00' },
  { id: 'MW-C02', maintenanceStandardCode: 'MS-C-002', workshopCode: 'C', code: 'MW-C-0002', planName: 'PACK线季度保养计划', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK线', equipmentTypeDesc: '非标设备', equipmentModel: 'BPIL-A1', equipmentSupplierName: '自研', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', status: '2', personName: '李伟', workStartTime: '2026-04-20 08:00', overdueTime: '2026-04-20 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-14 08:00' },
  { id: 'MW-B01', maintenanceStandardCode: 'MS-B-001', workshopCode: 'B', code: 'MW-B-0001', planName: '锁螺丝机月保养计划', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeDesc: '加工类设备', equipmentModel: 'ASM-4', equipmentSupplierName: '快克智能', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '2', personName: '买盼', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-14 08:00' },
  { id: 'MW-N01', maintenanceStandardCode: 'MS-N-001', workshopCode: 'CNC', code: 'MW-N-0001', planName: 'CNC月保养计划', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentTypeDesc: '数控设备', equipmentModel: 'T-7', equipmentSupplierName: '乔峰', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '4', personName: '刚嘉成', workStartTime: '2026-04-01 08:00', overdueTime: '2026-04-01 18:00', startTime: '2026-04-01 08:30', endTime: '2026-04-01 10:00', useTime: '1小时30分', remark: '', createByPersonName: '系统', createTime: '2026-04-01 08:00' },
  { id: 'MW-N02', maintenanceStandardCode: 'MS-N-002', workshopCode: 'CNC', code: 'MW-N-0002', planName: '注塑机季度保养计划', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeDesc: '注塑设备', equipmentModel: 'MA1200', equipmentSupplierName: '海天国际', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', status: '1', personName: '', workStartTime: '2026-04-25 08:00', overdueTime: '2026-04-25 18:00', startTime: '', endTime: '', useTime: '', remark: '', createByPersonName: '系统', createTime: '2026-04-20 08:00' },
  // ─── 新增：未派工状态的工单（演示派工流程） ───
  { id: 'MW-C03', maintenanceStandardCode: 'MS-C-001', workshopCode: 'C', code: 'MW-C-0003', planName: '绕线机月保养计划', equipmentSn: 'EW-LP-002', equipmentName: 'PACK下料压机', equipmentTypeDesc: '加工类设备', equipmentModel: 'LP-50', equipmentSupplierName: '华诚精密', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '1', personName: '', workStartTime: '2026-05-01 08:00', overdueTime: '2026-05-01 18:00', startTime: '', endTime: '', useTime: '', remark: '系统按计划自动生成，待派工', createByPersonName: '系统', createTime: '2026-04-28 06:00' },
  { id: 'MW-C04', maintenanceStandardCode: 'MS-C-002', workshopCode: 'C', code: 'MW-C-0004', planName: 'PACK线季度保养计划', equipmentSn: 'EW-BPIL-002', equipmentName: 'PACK主线-2', equipmentTypeDesc: '非标设备', equipmentModel: 'BPIL-A1', equipmentSupplierName: '自研', maintenanceLevel: '2', maintenanceLevelDesc: '二级保养', status: '1', personName: '', workStartTime: '2026-05-15 08:00', overdueTime: '2026-05-15 18:00', startTime: '', endTime: '', useTime: '', remark: '系统按计划自动生成，待派工', createByPersonName: '系统', createTime: '2026-04-28 06:00' },
  { id: 'MW-B02', maintenanceStandardCode: 'MS-B-002', workshopCode: 'B', code: 'MW-B-0002', planName: '电阻焊接机月保养计划', equipmentSn: 'B-20000022', equipmentName: '电阻焊接机', equipmentTypeDesc: '加工类设备', equipmentModel: 'RW-30', equipmentSupplierName: '快克智能', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '1', personName: '', workStartTime: '2026-05-01 08:00', overdueTime: '2026-05-01 18:00', startTime: '', endTime: '', useTime: '', remark: '系统按计划自动生成，待派工', createByPersonName: '系统', createTime: '2026-04-28 06:00' },
  { id: 'MW-N03', maintenanceStandardCode: 'MS-N-001', workshopCode: 'CNC', code: 'MW-N-0003', planName: 'CNC月保养计划', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentTypeDesc: '数控设备', equipmentModel: 'T-7', equipmentSupplierName: '乔峰', maintenanceLevel: '1', maintenanceLevelDesc: '一级保养', status: '1', personName: '', workStartTime: '2026-05-05 08:00', overdueTime: '2026-05-05 18:00', startTime: '', endTime: '', useTime: '', remark: '系统按计划自动生成，待派工', createByPersonName: '系统', createTime: '2026-04-28 06:00' },
]

// ══════════════════════════════════════════════
// 故障报修
// ══════════════════════════════════════════════
const failureWorkOrders = [
  // ─── 4 种报修来源全覆盖（sourceType: 1=生产报修 / 2=点检报修 / 3=巡检报修 / 4=保养报修 / 5=其他）───
  { id: 'FW-C01', workshopCode: 'C', failureCode: 'FW-C-0001', sourceType: '1', sourceTypeText: '生产报修', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', breakdownTime: '2026-03-05 10:30', personName: '高学才', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '1', breakdownTypeText: '电气故障', repairDegree: '2', repairDegreeText: '普通', remark: '标定电脑 485 通讯异常', status: '2', executeStatus: '3', auditorIdea: '同意维修', photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f87171%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E485%E7%AB%AF%E5%AD%90%E5%BC%82%E5%B8%B8%3C/text%3E%3C/svg%3E'], scanCode: 'EW-LP-001', createByPersonName: '高学才', createTime: '2026-03-05 10:35' },
  { id: 'FW-C02', workshopCode: 'C', failureCode: 'FW-C-0002', sourceType: '1', sourceTypeText: '生产报修', equipmentSn: 'EW-CCM-001', equipmentName: '三防漆涂覆机', equipmentType: 'T001', equipmentTypeName: '非标设备', equipmentMode: 'CCM-3F', equipmentSupplierName: '诺信EFD', breakdownTime: '2026-04-12 14:00', personName: '刘朋朋', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '3', repairDegreeText: '低', remark: '喷嘴堵塞', status: '1', executeStatus: '1', auditorIdea: '', photos: [], scanCode: 'EW-CCM-001', createByPersonName: '刘朋朋', createTime: '2026-04-12 14:05' },
  { id: 'FW-C03', workshopCode: 'C', failureCode: 'FW-C-0003', sourceType: '4', sourceTypeText: '保养异常', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', breakdownTime: '2026-04-22 09:30', personName: '陆钟', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '2', repairDegreeText: '普通', remark: '保养工单 MW-C-0001 发现张力器异响，已转维修', status: '2', executeStatus: '3', auditorIdea: '已自动转维修', photos: [], scanCode: 'EW-LP-001', createByPersonName: '陆钟', createTime: '2026-04-22 09:35' },
  { id: 'FW-C04', workshopCode: 'C', failureCode: 'FW-C-0004', sourceType: '5', sourceTypeText: '其他报修', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK 线', equipmentType: 'T001', equipmentTypeName: '非标设备', equipmentMode: 'BPIL-A1', equipmentSupplierName: '自研', breakdownTime: '2026-04-25 16:00', personName: '李伟', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '4', breakdownTypeText: '其他', repairDegree: '3', repairDegreeText: '低', remark: '线体节拍偏慢，需要排查 PLC 程序', status: '1', executeStatus: '1', auditorIdea: '', photos: [], scanCode: '', createByPersonName: '李伟', createTime: '2026-04-25 16:05' },
  { id: 'FW-B01', workshopCode: 'B', failureCode: 'FW-B-0001', sourceType: '1', sourceTypeText: '生产报修', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', breakdownTime: '2026-04-08 09:15', personName: '严欢欢', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '2', repairDegreeText: '普通', remark: '锁付机构出丝不畅，卡料', status: '2', executeStatus: '3', auditorIdea: '同意维修', photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fb923c%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E4%BE%9B%E4%B8%9D%E9%80%9A%E9%81%93%E5%8D%A1%E6%96%99%3C/text%3E%3C/svg%3E'], scanCode: 'B-20000015', createByPersonName: '严欢欢', createTime: '2026-04-08 09:20' },
  { id: 'FW-B02', workshopCode: 'B', failureCode: 'FW-B-0002', sourceType: '2', sourceTypeText: '点检异常', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', breakdownTime: '2026-04-20 09:00', personName: '严欢欢', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '3', repairDegreeText: '低', remark: '点检工单 SW-B-0003 发现批头出丝不畅', status: '2', executeStatus: '3', auditorIdea: '已自动转维修', photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f87171%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%BC%82%E5%B8%B8-%E5%87%BA%E4%B8%9D%E4%B8%8D%E7%95%85%3C/text%3E%3C/svg%3E'], scanCode: 'B-20000015', createByPersonName: '严欢欢', createTime: '2026-04-20 09:05' },
  { id: 'FW-B03', workshopCode: 'B', failureCode: 'FW-B-0003', sourceType: '3', sourceTypeText: '巡检异常', equipmentSn: 'B-20000022', equipmentName: '电阻焊接机', equipmentType: 'T003', equipmentTypeName: '加工类设备', equipmentMode: 'RW-30', equipmentSupplierName: '快克智能', breakdownTime: '2026-04-21 10:00', personName: '买盼', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '1', breakdownTypeText: '电气故障', repairDegree: '3', repairDegreeText: '低', remark: '巡检发现冷却水泵噪音偏大', status: '1', executeStatus: '1', auditorIdea: '', photos: [], scanCode: 'B-20000022', createByPersonName: '买盼', createTime: '2026-04-21 10:05' },
  { id: 'FW-N01', workshopCode: 'CNC', failureCode: 'FW-N-0001', sourceType: '1', sourceTypeText: '生产报修', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', breakdownTime: '2026-04-10 14:20', personName: '陈爽', breakdownLevel: '1', breakdownLevelText: '紧急', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '1', repairDegreeText: '紧急', remark: '主轴异响，疑似轴承磨损', status: '1', executeStatus: '1', auditorIdea: '', photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23dc2626%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E4%B8%BB%E8%BD%B4%E5%BC%82%E5%93%8D%3C/text%3E%3C/svg%3E'], scanCode: 'CNC-A4', createByPersonName: '陈爽', createTime: '2026-04-10 14:25' },
  { id: 'FW-N02', workshopCode: 'CNC', failureCode: 'FW-N-0002', sourceType: '1', sourceTypeText: '生产报修', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentType: 'T006', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', breakdownTime: '2026-04-14 11:00', personName: '彭向', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '1', breakdownTypeText: '电气故障', repairDegree: '2', repairDegreeText: '普通', remark: '温控模块显示异常', status: '2', executeStatus: '2', auditorIdea: '同意', photos: [], scanCode: 'CNC-INJ-001', createByPersonName: '彭向', createTime: '2026-04-14 11:05' },
  { id: 'FW-N03', workshopCode: 'CNC', failureCode: 'FW-N-0003', sourceType: '3', sourceTypeText: '巡检异常', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentType: 'T005', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', breakdownTime: '2026-04-16 09:00', personName: '刚嘉成', breakdownLevel: '2', breakdownLevelText: '一般', breakdownType: '2', breakdownTypeText: '机械故障', repairDegree: '2', repairDegreeText: '普通', remark: '巡检 SW-N-0002 发现 A4 主轴有异响，待复核', status: '2', executeStatus: '3', auditorIdea: '已自动转维修', photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fb923c%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%BC%82%E5%93%8D%E5%BC%82%E6%8C%AF%3C/text%3E%3C/svg%3E'], scanCode: 'CNC-A4', createByPersonName: '刚嘉成', createTime: '2026-04-16 09:05' },
  { id: 'FW-N04', workshopCode: 'CNC', failureCode: 'FW-N-0004', sourceType: '4', sourceTypeText: '保养异常', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentType: 'T006', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', breakdownTime: '2026-04-26 10:00', personName: '彭向', breakdownLevel: '3', breakdownLevelText: '轻微', breakdownType: '3', breakdownTypeText: '软件故障', repairDegree: '3', repairDegreeText: '低', remark: '季度保养 MW-N-0002 发现温度区段需要校准', status: '1', executeStatus: '1', auditorIdea: '', photos: [], scanCode: 'CNC-INJ-001', createByPersonName: '彭向', createTime: '2026-04-26 10:05' },
]

// ══════════════════════════════════════════════
// 维修工单
// ══════════════════════════════════════════════
const repairWorkOrders = [
  // ─── 状态: 1=待派工 / 2=已派工 / 3=维修中 / 4=已完工(待发起人确认) / 5=已确认(闭环)
  // ─── sourceType: 1=故障报修 / 2=点检异常 / 3=巡检异常 / 4=保养异常 / 5=其他
  { id: 'RW-C01', workshopCode: 'C', repairCode: 'RW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-03-05 10:30', breakdownLevelText: '一般', breakdownTypeText: '电气故障', repairDegreeText: '普通', remark: '标定电脑 485 通讯异常', status: '5', repairPersonName: '李伟', repairLevelText: '小修', repairTypeText: '电气维修', needShutdownText: '否', shutdownDurationText: '', repairBeginTime: '2026-03-05 11:00', repairEndTime: '2026-03-05 11:10', repairDurationText: '10分钟', failureWorkOrderCode: 'FW-C-0001', presentPersonName: '高学才', presentTime: '2026-03-05 10:35', confirmPersonName: '高学才', confirmTime: '2026-03-05 11:15', repairRecord: '更换 485 端子，通讯恢复正常', causeAnalysis: '485 通讯端子接触松动导致间歇性通讯失败', repairPlan: '1. 拆开通讯线缆 → 2. 更换 485 端子 → 3. 紧固螺丝 → 4. 联调验证', repairLog: [{ time: '2026-03-05 11:00', content: '现场到位，开始检查' }, { time: '2026-03-05 11:05', content: '确认 485 端子松动' }, { time: '2026-03-05 11:10', content: '更换完成，通讯正常' }], photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%2322c55e%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%AE%8C%E5%B7%A5%E7%85%A7%E7%89%87%3C/text%3E%3C/svg%3E'], createByPersonName: '高学才', createTime: '2026-03-05 10:40' },
  { id: 'RW-C02', workshopCode: 'C', repairCode: 'RW-C-0002', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', sourceType: '4', sourceTypeText: '保养异常', breakdownTime: '2026-04-22 09:30', breakdownLevelText: '一般', breakdownTypeText: '机械故障', repairDegreeText: '普通', remark: '保养中发现张力器异响', status: '4', repairPersonName: '李伟', repairLevelText: '小修', repairTypeText: '机械维修', needShutdownText: '是', shutdownDurationText: '30分钟', repairBeginTime: '2026-04-22 10:00', repairEndTime: '2026-04-22 10:30', repairDurationText: '30分钟', failureWorkOrderCode: 'FW-C-0003', presentPersonName: '陆钟', presentTime: '2026-04-22 09:35', confirmPersonName: '', confirmTime: '', repairRecord: '更换张力器羊毛轮，调整张力值', causeAnalysis: '张力器羊毛轮磨损，导致摩擦异响', repairPlan: '更换羊毛轮 + 校准张力 0.4 N', repairLog: [{ time: '2026-04-22 10:00', content: '到位检查' }, { time: '2026-04-22 10:15', content: '更换羊毛轮' }, { time: '2026-04-22 10:30', content: '校准完成，等待发起人确认' }], photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%2322c55e%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E7%BE%8A%E6%AF%9B%E8%BD%AE%E5%B7%B2%E6%9B%B4%E6%8D%A2%3C/text%3E%3C/svg%3E'], createByPersonName: '陆钟', createTime: '2026-04-22 09:40' },
  { id: 'RW-B01', workshopCode: 'B', repairCode: 'RW-B-0001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-04-08 09:15', breakdownLevelText: '一般', breakdownTypeText: '机械故障', repairDegreeText: '普通', remark: '锁付机构出丝不畅', status: '5', repairPersonName: '买盼', repairLevelText: '小修', repairTypeText: '机械维修', needShutdownText: '否', shutdownDurationText: '', repairBeginTime: '2026-04-08 10:00', repairEndTime: '2026-04-08 10:20', repairDurationText: '20分钟', failureWorkOrderCode: 'FW-B-0001', presentPersonName: '严欢欢', presentTime: '2026-04-08 09:20', confirmPersonName: '严欢欢', confirmTime: '2026-04-08 10:25', repairRecord: '清理供丝通道堵塞碎屑，更换批头', causeAnalysis: '供丝通道内有铁屑堆积导致卡料；批头磨损严重', repairPlan: '清理通道 → 更换批头 → 复核扭矩', repairLog: [{ time: '2026-04-08 10:00', content: '检查发现供丝通道异物' }, { time: '2026-04-08 10:10', content: '更换批头' }, { time: '2026-04-08 10:20', content: '试机正常' }], photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%2322c55e%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%B7%B2%E6%9B%B4%E6%8D%A2%E6%89%B9%E5%A4%B4%3C/text%3E%3C/svg%3E'], createByPersonName: '买盼', createTime: '2026-04-08 09:25' },
  { id: 'RW-B02', workshopCode: 'B', repairCode: 'RW-B-0002', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', sourceType: '2', sourceTypeText: '点检异常', breakdownTime: '2026-04-20 09:00', breakdownLevelText: '轻微', breakdownTypeText: '机械故障', repairDegreeText: '低', remark: '点检 SW-B-0003 发现批头出丝不畅', status: '2', repairPersonName: '严欢欢', repairLevelText: '小修', repairTypeText: '机械维修', needShutdownText: '否', shutdownDurationText: '', repairBeginTime: '', repairEndTime: '', repairDurationText: '', failureWorkOrderCode: 'FW-B-0002', presentPersonName: '严欢欢', presentTime: '2026-04-20 09:05', confirmPersonName: '', confirmTime: '', repairRecord: '', causeAnalysis: '', repairPlan: '', repairLog: [], photos: [], createByPersonName: '严欢欢', createTime: '2026-04-20 09:10' },
  { id: 'RW-N01', workshopCode: 'CNC', repairCode: 'RW-N-0001', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', sourceType: '1', sourceTypeText: '故障报修', breakdownTime: '2026-04-14 11:00', breakdownLevelText: '一般', breakdownTypeText: '电气故障', repairDegreeText: '普通', remark: '温控模块显示异常', status: '3', repairPersonName: '刚嘉成', repairLevelText: '大修', repairTypeText: '电气维修', needShutdownText: '是', shutdownDurationText: '2小时', repairBeginTime: '2026-04-14 13:00', repairEndTime: '', repairDurationText: '', failureWorkOrderCode: 'FW-N-0002', presentPersonName: '彭向', presentTime: '2026-04-14 11:05', confirmPersonName: '', confirmTime: '', repairRecord: '', causeAnalysis: '初步判断温控模块电源板烧蚀', repairPlan: '更换电源板 + 校准温度 + 老化测试', repairLog: [{ time: '2026-04-14 13:00', content: '设备停机，开始拆解' }, { time: '2026-04-14 14:00', content: '确认电源板烧蚀，已订货等待到货' }], photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fb923c%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E7%94%B5%E6%BA%90%E6%9D%BF%E7%83%A7%E8%9A%80%3C/text%3E%3C/svg%3E'], createByPersonName: '刚嘉成', createTime: '2026-04-14 11:30' },
  { id: 'RW-N02', workshopCode: 'CNC', repairCode: 'RW-N-0002', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', sourceType: '3', sourceTypeText: '巡检异常', breakdownTime: '2026-04-16 09:00', breakdownLevelText: '一般', breakdownTypeText: '机械故障', repairDegreeText: '普通', remark: '巡检发现 A4 主轴异响', status: '4', repairPersonName: '刚嘉成', repairLevelText: '大修', repairTypeText: '机械维修', needShutdownText: '是', shutdownDurationText: '4小时', repairBeginTime: '2026-04-17 09:00', repairEndTime: '2026-04-17 13:00', repairDurationText: '4小时', failureWorkOrderCode: 'FW-N-0003', presentPersonName: '刚嘉成', presentTime: '2026-04-16 09:05', confirmPersonName: '', confirmTime: '', repairRecord: '更换主轴前后轴承，重新动平衡', causeAnalysis: '主轴前轴承（NSK 7014C）磨损，引起异响', repairPlan: '1. 拆主轴 → 2. 更换前后轴承 → 3. 动平衡 → 4. 试切验证', repairLog: [{ time: '2026-04-17 09:00', content: '拆解主轴' }, { time: '2026-04-17 11:00', content: '更换轴承完成' }, { time: '2026-04-17 13:00', content: '动平衡 + 试切验证 OK' }], photos: ['data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%2322c55e%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E8%BD%B4%E6%89%BF%E5%B7%B2%E6%9B%B4%E6%8D%A2%3C/text%3E%3C/svg%3E'], createByPersonName: '刚嘉成', createTime: '2026-04-16 09:30' },
]

// ══════════════════════════════════════════════
// 维修工单物料领用清单（按 repairCode 关联，完工时扣 spareParts.actualStock）
// ══════════════════════════════════════════════
const repairWorkSpareParts: any[] = [
  { id: 'RWS-C01-1', repairCode: 'RW-C-0001', sparePartId: 'SP01', partCode: 'BJ-001', partName: '485通讯端子', partSpecification: '标准', partGroupName: '设备配件', useAmount: 2, stockUnitName: '个', remark: '更换松动端子' },
  { id: 'RWS-C02-1', repairCode: 'RW-C-0002', sparePartId: 'SP03', partCode: 'BJ-003', partName: '张力器羊毛轮', partSpecification: '标准', partGroupName: '设备配件', useAmount: 1, stockUnitName: '个', remark: '羊毛轮磨损' },
  { id: 'RWS-C02-2', repairCode: 'RW-C-0002', sparePartId: 'SP02', partCode: 'BJ-002', partName: 'NSK PS-2润滑脂', partSpecification: '0.5g/次', partGroupName: '耗材', useAmount: 1, stockUnitName: '管', remark: '润滑' },
  { id: 'RWS-B01-1', repairCode: 'RW-B-0001', sparePartId: 'SP05', partCode: 'BJ-005', partName: '气管接头', partSpecification: '6mm', partGroupName: '设备配件', useAmount: 1, stockUnitName: '个', remark: '更换破损气管' },
  { id: 'RWS-N01-1', repairCode: 'RW-N-0001', sparePartId: 'SP04', partCode: 'BJ-004', partName: '急停按钮', partSpecification: 'φ22', partGroupName: '设备配件', useAmount: 1, stockUnitName: '个', remark: '电源板烧蚀波及' },
  { id: 'RWS-N02-1', repairCode: 'RW-N-0002', sparePartId: 'SP02', partCode: 'BJ-002', partName: 'NSK PS-2润滑脂', partSpecification: '0.5g/次', partGroupName: '耗材', useAmount: 3, stockUnitName: '管', remark: '主轴润滑' },
]

// ══════════════════════════════════════════════
// 维修知识库（静态展示）
// ══════════════════════════════════════════════
const repairKnowledgeList: any[] = [
  { id: 'RK001', code: 'RK-001', title: '485 通讯异常处理', category: '电气故障', equipmentTypeText: '加工类设备', faultPhenomenon: '标定电脑 485 通讯不稳定，间歇性失败', causeAnalysis: '通讯端子接触松动 / 屏蔽线接地不良', solution: '1. 断电拆开通讯线缆\n2. 检查端子是否松动，必要时更换\n3. 紧固屏蔽线接地\n4. 联调验证', tags: '485,通讯,端子', authorName: '高学才', citationCount: 12, createTime: '2025-08-15 14:30' },
  { id: 'RK002', code: 'RK-002', title: '锁螺丝机供丝卡料', category: '机械故障', equipmentTypeText: '加工类设备', faultPhenomenon: '锁付机构出丝不畅，频繁卡料', causeAnalysis: '供丝通道内铁屑堆积 / 批头磨损', solution: '1. 拆开供丝通道清理铁屑\n2. 检查批头磨损情况\n3. 必要时更换批头\n4. 复核扭矩参数 0.8 N·m', tags: '锁螺丝,卡料,批头', authorName: '买盼', citationCount: 8, createTime: '2025-09-12 10:00' },
  { id: 'RK003', code: 'RK-003', title: 'CNC 主轴异响处理', category: '机械故障', equipmentTypeText: '数控设备', faultPhenomenon: '主轴运行时出现非正常异响，振动值上升', causeAnalysis: '主轴轴承磨损 / 动平衡失衡', solution: '1. 测量振速 ≥ 4.5 mm/s 时停机\n2. 拆解主轴检查前后轴承（NSK 7014C 系列）\n3. 更换轴承组\n4. 重新动平衡\n5. 试切验证精度', tags: 'CNC,主轴,轴承,动平衡', authorName: '刚嘉成', citationCount: 23, createTime: '2025-07-20 16:00' },
  { id: 'RK004', code: 'RK-004', title: '注塑机温控模块异常', category: '电气故障', equipmentTypeText: '注塑设备', faultPhenomenon: '温控模块显示异常，温度波动 > ±5℃', causeAnalysis: '电源板烧蚀 / 热电偶老化', solution: '1. 检查电源板焊点\n2. 测量热电偶电阻\n3. 更换损坏组件\n4. 校准温度区段（±2℃）\n5. 老化测试 8 小时', tags: '注塑,温控,电源板', authorName: '彭向', citationCount: 15, createTime: '2025-10-05 11:30' },
  { id: 'RK005', code: 'RK-005', title: '气路泄漏快速定位', category: '气动故障', equipmentTypeText: '通用', faultPhenomenon: '气压持续下降，无法稳定在 0.5-0.7 MPa', causeAnalysis: '气管接头老化 / 气缸密封圈失效', solution: '1. 用肥皂水沿气路涂刷查漏点\n2. 重点检查接头、电磁阀、气缸\n3. 更换 6mm 气管接头\n4. 必要时更换气缸密封圈', tags: '气动,泄漏,接头', authorName: '李伟', citationCount: 19, createTime: '2025-11-18 09:00' },
  { id: 'RK006', code: 'RK-006', title: '伺服压机精度漂移', category: '机械故障', equipmentTypeText: '加工类设备', faultPhenomenon: '压力曲线异常，重复精度下降', causeAnalysis: '压力传感器零点漂移 / 模具紧固松动', solution: '1. 重新标定零点\n2. 检查所有紧固螺栓扭矩\n3. 校验压力曲线\n4. 必要时更换压力传感器', tags: '伺服,压机,精度', authorName: '陆钟', citationCount: 7, createTime: '2026-01-10 15:30' },
]

// ══════════════════════════════════════════════
// 点检工单
// ══════════════════════════════════════════════
// 占位照片（mock 演示用，使用 placehold.co 占位图）
const PHOTO_OK_1 = 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%234ade80%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E7%82%B9%E6%A3%80%E5%90%88%E6%A0%BC-%E6%B2%B9%E4%BD%8D%E6%AD%A3%E5%B8%B8%3C/text%3E%3C/svg%3E'
const PHOTO_OK_2 = 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%2322c55e%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E7%82%B9%E6%A3%80%E5%90%88%E6%A0%BC-%E6%B0%94%E5%8E%8B%E6%AD%A3%E5%B8%B8%3C/text%3E%3C/svg%3E'
const PHOTO_NG_1 = 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23f87171%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%BC%82%E5%B8%B8-%E6%B8%97%E6%B2%B9%3C/text%3E%3C/svg%3E'
const PHOTO_NG_2 = 'data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20fill%3D%22%23fb923c%22/%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3E%E5%BC%82%E5%B8%B8-%E5%BC%82%E5%93%8D%3C/text%3E%3C/svg%3E'
const spotInspectionWorks: any[] = [
  // ─── C 端点检 ───
  { id: 'SW-C01', workshopCode: 'C', workCode: 'SW-C-0001', planCode: 'SP-C-001', planName: '绕线机日常点检计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentModel: 'LP-50', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '8/8', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 09:00', startTime: '2026-04-15 08:05', endTime: '2026-04-15 08:45', personSn: 'P-LZ', personName: '陆钟', createByPersonName: '系统', createTime: '2026-04-15 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'EW-LP-001-PT01', spotInspectionStandardCode: 'SS-C-001' },
  { id: 'SW-C02', workshopCode: 'C', workCode: 'SW-C-0002', planCode: 'SP-C-001', planName: '绕线机日常点检计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentModel: 'LP-50', status: '2', hasParamPlan: '2', inspectionType: '1', spotInspection: '3/8', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 09:00', startTime: '2026-04-16 08:10', endTime: '', personSn: 'P-LZ', personName: '陆钟', createByPersonName: '系统', createTime: '2026-04-16 08:00', photos: [PHOTO_OK_1], scanCode: 'EW-LP-001-PT01', spotInspectionStandardCode: 'SS-C-001' },
  { id: 'SW-C03', workshopCode: 'C', workCode: 'SW-C-0003', planCode: 'SP-C-002', planName: 'PACK 车间日常巡检', equipmentSn: '-', equipmentName: 'PACK 车间路线', equipmentModel: '-', status: '1', hasParamPlan: '2', inspectionType: '2', spotInspection: '0/5', workStartTime: '2026-04-28 08:00', overdueTime: '2026-04-28 12:00', startTime: '', endTime: '', personSn: '', personName: '', createByPersonName: '系统', createTime: '2026-04-28 06:00', photos: [], scanCode: '', routeCode: 'CR-C-001' },
  { id: 'SW-C04', workshopCode: 'C', workCode: 'SW-C-0004', planCode: 'SP-C-001', planName: '绕线机日常点检计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentModel: 'LP-50', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '8/8', workStartTime: '2026-04-18 08:00', overdueTime: '2026-04-18 09:00', startTime: '2026-04-18 08:00', endTime: '2026-04-18 08:35', personSn: 'P-LZ', personName: '陆钟', createByPersonName: '系统', createTime: '2026-04-18 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'EW-LP-001-PT01', spotInspectionStandardCode: 'SS-C-001' },
  { id: 'SW-C05', workshopCode: 'C', workCode: 'SW-C-0005', planCode: 'SP-C-002', planName: 'PACK 车间日常巡检', equipmentSn: '-', equipmentName: 'PACK 车间路线', equipmentModel: '-', status: '3', hasParamPlan: '2', inspectionType: '2', spotInspection: '5/5', workStartTime: '2026-04-22 08:00', overdueTime: '2026-04-22 12:00', startTime: '2026-04-22 08:10', endTime: '2026-04-22 09:30', personSn: 'P-WG', personName: '王工', createByPersonName: '系统', createTime: '2026-04-22 06:00', photos: [PHOTO_OK_1], scanCode: 'CR-C-001-PT01', routeCode: 'CR-C-001' },
  { id: 'SW-C06', workshopCode: 'C', workCode: 'SW-C-0006', planCode: 'SP-C-001', planName: '绕线机日常点检计划', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentModel: 'LP-50', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '8/8', workStartTime: '2026-04-25 08:00', overdueTime: '2026-04-25 09:00', startTime: '2026-04-25 08:00', endTime: '2026-04-25 08:40', personSn: 'P-LZ', personName: '陆钟', createByPersonName: '系统', createTime: '2026-04-25 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'EW-LP-001-PT01', spotInspectionStandardCode: 'SS-C-001' },
  // ─── B 端点检/巡检 ───
  { id: 'SW-B01', workshopCode: 'B', workCode: 'SW-B-0001', planCode: 'SP-B-001', planName: '锁螺丝机日常点检计划', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentModel: 'ASM-4', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '5/5', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 09:00', startTime: '2026-04-15 08:00', endTime: '2026-04-15 08:30', personSn: 'P-MP', personName: '买盼', createByPersonName: '系统', createTime: '2026-04-15 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'B-20000015-PT01', spotInspectionStandardCode: 'SS-B-001' },
  { id: 'SW-B02', workshopCode: 'B', workCode: 'SW-B-0002', planCode: 'SP-B-002', planName: 'B 端电子车间巡检', equipmentSn: '-', equipmentName: 'B端车间路线', equipmentModel: '-', status: '1', hasParamPlan: '2', inspectionType: '2', spotInspection: '0/4', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 09:00', startTime: '', endTime: '', personSn: '', personName: '', createByPersonName: '系统', createTime: '2026-04-16 08:00', photos: [], scanCode: '', routeCode: 'CR-B-001' },
  { id: 'SW-B03', workshopCode: 'B', workCode: 'SW-B-0003', planCode: 'SP-B-001', planName: '锁螺丝机日常点检计划', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentModel: 'ASM-4', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '5/5', workStartTime: '2026-04-20 08:00', overdueTime: '2026-04-20 09:00', startTime: '2026-04-20 08:00', endTime: '2026-04-20 08:30', personSn: 'P-YHH', personName: '严欢欢', createByPersonName: '系统', createTime: '2026-04-20 08:00', photos: [PHOTO_NG_1], scanCode: 'B-20000015-PT01', remark: '发现 1 项异常：批头出丝不畅', spotInspectionStandardCode: 'SS-B-001' },
  { id: 'SW-B04', workshopCode: 'B', workCode: 'SW-B-0004', planCode: 'SP-B-002', planName: 'B 端电子车间巡检', equipmentSn: '-', equipmentName: 'B端车间路线', equipmentModel: '-', status: '3', hasParamPlan: '2', inspectionType: '2', spotInspection: '4/4', workStartTime: '2026-04-22 08:00', overdueTime: '2026-04-22 09:00', startTime: '2026-04-22 08:05', endTime: '2026-04-22 09:00', personSn: 'P-LG', personName: '李工', createByPersonName: '系统', createTime: '2026-04-22 06:00', photos: [PHOTO_OK_1], scanCode: 'CR-B-001-PT01', routeCode: 'CR-B-001' },
  { id: 'SW-B05', workshopCode: 'B', workCode: 'SW-B-0005', planCode: 'SP-B-001', planName: '锁螺丝机日常点检计划', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentModel: 'ASM-4', status: '3', hasParamPlan: '2', inspectionType: '1', spotInspection: '5/5', workStartTime: '2026-04-26 08:00', overdueTime: '2026-04-26 09:00', startTime: '2026-04-26 08:00', endTime: '2026-04-26 08:25', personSn: 'P-MP', personName: '买盼', createByPersonName: '系统', createTime: '2026-04-26 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'B-20000015-PT01', spotInspectionStandardCode: 'SS-B-001' },
  // ─── CNC 点检/巡检 ───
  { id: 'SW-N01', workshopCode: 'CNC', workCode: 'SW-N-0001', planCode: 'SP-N-001', planName: 'CNC日常点检计划', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-7', status: '3', hasParamPlan: '1', inspectionType: '1', spotInspection: '6/6', workStartTime: '2026-04-15 08:00', overdueTime: '2026-04-15 10:00', startTime: '2026-04-15 08:00', endTime: '2026-04-15 09:30', personSn: 'P-GJC', personName: '刚嘉成', createByPersonName: '系统', createTime: '2026-04-15 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'CNC-A1-PT01', spotInspectionStandardCode: 'SS-N-001' },
  { id: 'SW-N02', workshopCode: 'CNC', workCode: 'SW-N-0002', planCode: 'SP-N-002', planName: '数控加工车间巡检', equipmentSn: '-', equipmentName: '数控车间路线', equipmentModel: '-', status: '2', hasParamPlan: '1', inspectionType: '2', spotInspection: '2/5', workStartTime: '2026-04-16 08:00', overdueTime: '2026-04-16 10:00', startTime: '2026-04-16 08:10', endTime: '', personSn: 'P-GJC', personName: '刚嘉成', createByPersonName: '系统', createTime: '2026-04-16 08:00', photos: [PHOTO_OK_1, PHOTO_NG_2], scanCode: 'CNC-PATROL-001', remark: 'A4 主轴有异响，待复核', routeCode: 'CR-N-001' },
  { id: 'SW-N03', workshopCode: 'CNC', workCode: 'SW-N-0003', planCode: 'SP-N-001', planName: 'CNC日常点检计划', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-700B', status: '1', hasParamPlan: '1', inspectionType: '1', spotInspection: '0/6', workStartTime: '2026-04-28 08:00', overdueTime: '2026-04-28 10:00', startTime: '', endTime: '', personSn: '', personName: '', createByPersonName: '系统', createTime: '2026-04-28 06:00', photos: [], scanCode: '', spotInspectionStandardCode: 'SS-N-001' },
  { id: 'SW-N04', workshopCode: 'CNC', workCode: 'SW-N-0004', planCode: 'SP-N-001', planName: 'CNC日常点检计划', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-7', status: '3', hasParamPlan: '1', inspectionType: '1', spotInspection: '6/6', workStartTime: '2026-04-22 08:00', overdueTime: '2026-04-22 10:00', startTime: '2026-04-22 08:00', endTime: '2026-04-22 09:00', personSn: 'P-GJC', personName: '刚嘉成', createByPersonName: '系统', createTime: '2026-04-22 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'CNC-A1-PT01', spotInspectionStandardCode: 'SS-N-001' },
  { id: 'SW-N05', workshopCode: 'CNC', workCode: 'SW-N-0005', planCode: 'SP-N-002', planName: '数控加工车间巡检', equipmentSn: '-', equipmentName: '数控车间路线', equipmentModel: '-', status: '3', hasParamPlan: '1', inspectionType: '2', spotInspection: '5/5', workStartTime: '2026-04-23 08:00', overdueTime: '2026-04-23 10:00', startTime: '2026-04-23 08:00', endTime: '2026-04-23 09:30', personSn: 'P-ZG', personName: '张工', createByPersonName: '系统', createTime: '2026-04-23 06:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'CR-N-001-PT01', routeCode: 'CR-N-001' },
  { id: 'SW-N06', workshopCode: 'CNC', workCode: 'SW-N-0006', planCode: 'SP-N-001', planName: 'CNC日常点检计划', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-700B', status: '3', hasParamPlan: '1', inspectionType: '1', spotInspection: '6/6', workStartTime: '2026-04-25 08:00', overdueTime: '2026-04-25 10:00', startTime: '2026-04-25 08:00', endTime: '2026-04-25 09:00', personSn: 'P-GJC', personName: '刚嘉成', createByPersonName: '系统', createTime: '2026-04-25 08:00', photos: [PHOTO_OK_1, PHOTO_OK_2], scanCode: 'CNC-A2-PT01', spotInspectionStandardCode: 'SS-N-001' },
]

// ══════════════════════════════════════════════
// 点巡检标准（每端 2 条，6 条主表数据）
// ══════════════════════════════════════════════
const spotInspectionStandards: any[] = [
  { id: 'SS-C01', workshopCode: 'C', code: 'SS-C-001', name: '绕线机日常点检标准', equipmentTypeCode: 'T003', equipmentTypeText: '加工类设备', inspectionType: '1', remark: '日检 5 项：剪刀部/夹紧部/XYZ轴/急停/漆包线', checknum: 5, createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SS-C02', workshopCode: 'C', code: 'SS-C-002', name: 'PACK 线点检标准', equipmentTypeCode: 'T001', equipmentTypeText: '非标设备', inspectionType: '1', remark: '上下料/点胶/压合/测试/急停 5 项', checknum: 5, createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  { id: 'SS-B01', workshopCode: 'B', code: 'SS-B-001', name: '锁螺丝机日常点检标准', equipmentTypeCode: 'T003', equipmentTypeText: '加工类设备', inspectionType: '1', remark: '日检 5 项：台面/气压/急停/治具/批头', checknum: 5, createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SS-B02', workshopCode: 'B', code: 'SS-B-002', name: '焊接机点检标准', equipmentTypeCode: 'T003', equipmentTypeText: '加工类设备', inspectionType: '1', remark: '电极头/冷却水/电源/参数/接地 5 项', checknum: 5, createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },
  { id: 'SS-N01', workshopCode: 'CNC', code: 'SS-N-001', name: 'CNC日常点检标准', equipmentTypeCode: 'T005', equipmentTypeText: '数控设备', inspectionType: '1', remark: '主轴/导轨/冷却/液压/气动/换刀 6 项', checknum: 6, createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SS-N02', workshopCode: 'CNC', code: 'SS-N-002', name: '注塑机点检标准', equipmentTypeCode: 'T006', equipmentTypeText: '注塑设备', inspectionType: '1', remark: '锁模/注射/加热/液压/电气 5 项', checknum: 5, createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
]

// ══════════════════════════════════════════════
// 点巡检标准 — 检查项清单（按 standardCode 关联）
// ══════════════════════════════════════════════
const spotInspectionStandardItems: any[] = [
  // SS-C-001 绕线机日常点检（5 项）
  { id: 'SSI-C0101', standardCode: 'SS-C-001', itemName: '剪刀部润滑', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '缺油,卡顿', max: '', min: '', defaultValue: '正常', sort: 1, checkStandard: '剪刀刃口润滑充分、动作顺畅', unitName: '', unitNumber: '', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-C0102', standardCode: 'SS-C-001', itemName: '夹紧部检查', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '松动,磨损', max: '', min: '', defaultValue: '正常', sort: 2, checkStandard: '夹爪无磨损、夹紧扭矩稳定', unitName: '', unitNumber: '', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-C0103', standardCode: 'SS-C-001', itemName: 'XYZ 轴检查', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '0.005', min: '0', defaultValue: '0.003', sort: 3, checkStandard: '丝杆跳动 ≤ 0.005 mm', unitName: 'mm', unitNumber: '', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-C0104', standardCode: 'SS-C-001', itemName: '急停按钮', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '功能正常', abnormal: '失灵', max: '', min: '', defaultValue: '功能正常', sort: 4, checkStandard: '按下急停设备能立即停止', unitName: '', unitNumber: '', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-C0105', standardCode: 'SS-C-001', itemName: '漆包线绝缘', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '', min: '50', defaultValue: '60', sort: 5, checkStandard: '绝缘电阻 ≥ 50 MΩ', unitName: 'MΩ', unitNumber: '', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },

  // SS-C-002 PACK 线点检（5 项）
  { id: 'SSI-C0201', standardCode: 'SS-C-002', itemName: '上下料机械手', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '夹爪松动,传感器失灵', max: '', min: '', defaultValue: '正常', sort: 1, checkStandard: '夹爪/传感器/皮带均正常', unitName: '', unitNumber: '', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-C0202', standardCode: 'SS-C-002', itemName: '点胶压力', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '0.5', min: '0.3', defaultValue: '0.4', sort: 2, checkStandard: '点胶压力 0.3-0.5 MPa', unitName: 'MPa', unitNumber: '', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-C0203', standardCode: 'SS-C-002', itemName: '压合工位', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '压力异常,模具松动', max: '', min: '', defaultValue: '正常', sort: 3, checkStandard: '伺服压机精度合格', unitName: '', unitNumber: '', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-C0204', standardCode: 'SS-C-002', itemName: 'DCIR 测试电压', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '4.3', min: '4.1', defaultValue: '4.2', sort: 4, checkStandard: '测试电压 4.1-4.3 V', unitName: 'V', unitNumber: '', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-C0205', standardCode: 'SS-C-002', itemName: '安全光栅', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '失灵', max: '', min: '', defaultValue: '正常', sort: 5, checkStandard: '光栅功能正常，遮挡时设备停止', unitName: '', unitNumber: '', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },

  // SS-B-001 锁螺丝机日常点检（5 项）
  { id: 'SSI-B0101', standardCode: 'SS-B-001', itemName: '台面清洁', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '清洁', abnormal: '粉尘,杂物', max: '', min: '', defaultValue: '清洁', sort: 1, checkStandard: '工作台面、防尘罩清洁无杂物', unitName: '', unitNumber: '', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-B0102', standardCode: 'SS-B-001', itemName: '气源压力', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '0.7', min: '0.5', defaultValue: '0.6', sort: 2, checkStandard: '气源压力 0.5-0.7 MPa', unitName: 'MPa', unitNumber: '', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-B0103', standardCode: 'SS-B-001', itemName: '急停按钮', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '功能正常', abnormal: '失灵', max: '', min: '', defaultValue: '功能正常', sort: 3, checkStandard: '所有急停按钮功能正常', unitName: '', unitNumber: '', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-B0104', standardCode: 'SS-B-001', itemName: '锁附扭矩', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '0.9', min: '0.7', defaultValue: '0.8', sort: 4, checkStandard: '扭矩值 0.7-0.9 N·m', unitName: 'N·m', unitNumber: '', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SSI-B0105', standardCode: 'SS-B-001', itemName: '批头磨损', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '磨损,断裂', max: '', min: '', defaultValue: '正常', sort: 5, checkStandard: '批头无明显磨损/断裂', unitName: '', unitNumber: '', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },

  // SS-B-002 焊接机点检（5 项）
  { id: 'SSI-B0201', standardCode: 'SS-B-002', itemName: '电极头修磨', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '严重磨损', max: '', min: '', defaultValue: '正常', sort: 1, checkStandard: '电极头表面平整，无严重磨损', unitName: '', unitNumber: '', createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-B0202', standardCode: 'SS-B-002', itemName: '冷却水流量', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '8', min: '4', defaultValue: '5', sort: 2, checkStandard: '水流量 4-8 L/min', unitName: 'L/min', unitNumber: '', createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-B0203', standardCode: 'SS-B-002', itemName: '电源接线', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '紧固', abnormal: '松动,氧化', max: '', min: '', defaultValue: '紧固', sort: 3, checkStandard: '接线无松动、无氧化', unitName: '', unitNumber: '', createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-B0204', standardCode: 'SS-B-002', itemName: '焊接电流', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '6500', min: '5500', defaultValue: '6000', sort: 4, checkStandard: '焊接电流 5500-6500 A', unitName: 'A', unitNumber: '', createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-B0205', standardCode: 'SS-B-002', itemName: '接地电阻', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '4', min: '0', defaultValue: '2', sort: 5, checkStandard: '接地电阻 ≤ 4 Ω', unitName: 'Ω', unitNumber: '', createByPersonName: '李工', createTime: '2026-02-01 09:00:00' },

  // SS-N-001 CNC 日常点检（6 项）
  { id: 'SSI-N0101', standardCode: 'SS-N-001', itemName: '主轴温度', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '60', min: '20', defaultValue: '45', sort: 1, checkStandard: '主轴温度 ≤ 60℃', unitName: '℃', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-N0102', standardCode: 'SS-N-001', itemName: '导轨润滑油位', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '充足', abnormal: '不足,空缺', max: '', min: '', defaultValue: '充足', sort: 2, checkStandard: '油位标尺中线以上', unitName: '', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-N0103', standardCode: 'SS-N-001', itemName: '冷却液浓度', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '8', min: '3', defaultValue: '5', sort: 3, checkStandard: '冷却液浓度 3%-8%', unitName: '%', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-N0104', standardCode: 'SS-N-001', itemName: '液压油压力', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '6', min: '4', defaultValue: '5', sort: 4, checkStandard: '液压油压力 4-6 MPa', unitName: 'MPa', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-N0105', standardCode: 'SS-N-001', itemName: '气源压力', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '0.7', min: '0.5', defaultValue: '0.6', sort: 5, checkStandard: '气源 0.5-0.7 MPa', unitName: 'MPa', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SSI-N0106', standardCode: 'SS-N-001', itemName: '换刀机构', itemType: '定性', needTypeCode: '2', needTypeText: '否', normal: '正常', abnormal: '卡顿,异响', max: '', min: '', defaultValue: '正常', sort: 6, checkStandard: '换刀流畅、无异响', unitName: '', unitNumber: '', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },

  // SS-N-002 注塑机点检（5 项）
  { id: 'SSI-N0201', standardCode: 'SS-N-002', itemName: '锁模力', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '1300', min: '1100', defaultValue: '1200', sort: 1, checkStandard: '锁模力 1100-1300 kN', unitName: 'kN', unitNumber: '', createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-N0202', standardCode: 'SS-N-002', itemName: '注射螺杆', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '正常', abnormal: '磨损,卡料', max: '', min: '', defaultValue: '正常', sort: 2, checkStandard: '螺杆/止逆环正常', unitName: '', unitNumber: '', createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-N0203', standardCode: 'SS-N-002', itemName: '料筒温度', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '230', min: '180', defaultValue: '210', sort: 3, checkStandard: '设定温度 ±2℃', unitName: '℃', unitNumber: '', createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-N0204', standardCode: 'SS-N-002', itemName: '液压油温', itemType: '定量', needTypeCode: '1', needTypeText: '是', normal: '', abnormal: '', max: '50', min: '20', defaultValue: '40', sort: 4, checkStandard: '液压油温 ≤ 50℃', unitName: '℃', unitNumber: '', createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
  { id: 'SSI-N0205', standardCode: 'SS-N-002', itemName: '安全门检测', itemType: '定性', needTypeCode: '1', needTypeText: '是', normal: '功能正常', abnormal: '失灵', max: '', min: '', defaultValue: '功能正常', sort: 5, checkStandard: '安全门打开能停机', unitName: '', unitNumber: '', createByPersonName: '彭向', createTime: '2026-02-01 09:00:00' },
]

// ══════════════════════════════════════════════
// 点巡检计划（每端 2 条 = 1 点检 + 1 巡检）
// ══════════════════════════════════════════════
const spotInspectionPlans: any[] = [
  // C 端 1 点检 + 1 巡检
  { id: 'SP-C01', workshopCode: 'C', code: 'SP-C-001', name: '绕线机日常点检计划', equipmentTypeCode: 'T003', equipmentTypeText: '加工类设备', equipmentModel: '', spotInspectionStandardCode: 'SS-C-001', inspectionType: '1', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 3, status: '1', hasParamPlan: '0', validityPeriod: 60, createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  { id: 'SP-C02', workshopCode: 'C', code: 'SP-C-002', name: 'PACK 车间日常巡检', equipmentTypeCode: '', equipmentTypeText: '', equipmentModel: '', routeCode: 'CR-C-001', inspectionType: '2', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 1, status: '1', hasParamPlan: '0', validityPeriod: 240, createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  // B 端 1 点检 + 1 巡检
  { id: 'SP-B01', workshopCode: 'B', code: 'SP-B-001', name: '锁螺丝机日常点检计划', equipmentTypeCode: 'T003', equipmentTypeText: '加工类设备', equipmentModel: '', spotInspectionStandardCode: 'SS-B-001', inspectionType: '1', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 2, status: '1', hasParamPlan: '0', validityPeriod: 60, createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  { id: 'SP-B02', workshopCode: 'B', code: 'SP-B-002', name: 'B 端电子车间巡检', equipmentTypeCode: '', equipmentTypeText: '', equipmentModel: '', routeCode: 'CR-B-001', inspectionType: '2', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 1, status: '1', hasParamPlan: '0', validityPeriod: 240, createByPersonName: '李工', createTime: '2026-01-15 09:00:00' },
  // CNC 1 点检 + 1 巡检
  { id: 'SP-N01', workshopCode: 'CNC', code: 'SP-N-001', name: 'CNC日常点检计划', equipmentTypeCode: 'T005', equipmentTypeText: '数控设备', equipmentModel: '', spotInspectionStandardCode: 'SS-N-001', inspectionType: '1', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 4, status: '1', hasParamPlan: '1', validityPeriod: 120, createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  { id: 'SP-N02', workshopCode: 'CNC', code: 'SP-N-002', name: '数控加工车间巡检', equipmentTypeCode: '', equipmentTypeText: '', equipmentModel: '', routeCode: 'CR-N-001', inspectionType: '2', startDate: '2026-01-01', endDate: '2026-12-31', skipCode: '0', skipText: '否', periodicFrequencyType: '每日', periodicFrequency: '1次/天', deviceNum: 1, status: '1', hasParamPlan: '0', validityPeriod: 240, createByPersonName: '张工', createTime: '2026-01-20 09:00:00' },
]

// ══════════════════════════════════════════════
// 点检计划设备子表（按 planCode 关联）
// ══════════════════════════════════════════════
const spotInspectionPlanDevices: Record<string, any[]> = {
  'SP-C-001': [
    { id: 'SPD-C0101', planCode: 'SP-C-001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentModel: 'LP-50', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', hasParamPlan: '0', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
    { id: 'SPD-C0102', planCode: 'SP-C-001', equipmentSn: 'EW-TCM-001', equipmentName: '端子机', equipmentModel: 'TCM-200', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', hasParamPlan: '0', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
    { id: 'SPD-C0103', planCode: 'SP-C-001', equipmentSn: 'EW-PP-001', equipmentName: '气动压机', equipmentModel: 'PP-100', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', hasParamPlan: '0', createByPersonName: '陆钟', createTime: '2026-01-10 09:00:00' },
  ],
  'SP-C-002': [
    { id: 'SPD-C0201', planCode: 'SP-C-002', equipmentSn: '-', equipmentName: 'PACK 车间路线（CR-C-001）', equipmentModel: '-', equipmentSupplier: '', equipmentSupplierName: '-', equipmentType: '', equipmentTypeDesc: '巡检路线', hasParamPlan: '0', createByPersonName: '王工', createTime: '2026-01-15 09:00:00' },
  ],
  'SP-B-001': [
    { id: 'SPD-B0101', planCode: 'SP-B-001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentModel: 'ASM-4', equipmentSupplier: 'S016', equipmentSupplierName: '快克智能', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', hasParamPlan: '0', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
    { id: 'SPD-B0102', planCode: 'SP-B-001', equipmentSn: 'B-20000023', equipmentName: '手动PACK压装机', equipmentModel: 'MP-200', equipmentSupplier: 'S001', equipmentSupplierName: '华诚精密', equipmentType: 'T003', equipmentTypeDesc: '加工类设备', hasParamPlan: '0', createByPersonName: '买盼', createTime: '2026-01-10 09:00:00' },
  ],
  'SP-B-002': [
    { id: 'SPD-B0201', planCode: 'SP-B-002', equipmentSn: '-', equipmentName: 'B 端电子车间路线（CR-B-001）', equipmentModel: '-', equipmentSupplier: '', equipmentSupplierName: '-', equipmentType: '', equipmentTypeDesc: '巡检路线', hasParamPlan: '0', createByPersonName: '李工', createTime: '2026-01-15 09:00:00' },
  ],
  'SP-N-001': [
    { id: 'SPD-N0101', planCode: 'SP-N-001', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-7', equipmentSupplier: 'S009', equipmentSupplierName: '乔峰', equipmentType: 'T005', equipmentTypeDesc: '数控设备', hasParamPlan: '1', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
    { id: 'SPD-N0102', planCode: 'SP-N-001', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentModel: 'T-700B', equipmentSupplier: 'S010', equipmentSupplierName: '台群', equipmentType: 'T005', equipmentTypeDesc: '数控设备', hasParamPlan: '1', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
    { id: 'SPD-N0103', planCode: 'SP-N-001', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentModel: 'VF2', equipmentSupplier: 'S011', equipmentSupplierName: '哈斯', equipmentType: 'T005', equipmentTypeDesc: '数控设备', hasParamPlan: '1', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
    { id: 'SPD-N0104', planCode: 'SP-N-001', equipmentSn: 'C1', equipmentName: 'CNC车削中心', equipmentModel: 'C320K TT', equipmentSupplier: 'S013', equipmentSupplierName: '广数', equipmentType: 'T005', equipmentTypeDesc: '数控设备', hasParamPlan: '1', createByPersonName: '刚嘉成', createTime: '2026-01-15 09:00:00' },
  ],
  'SP-N-002': [
    { id: 'SPD-N0201', planCode: 'SP-N-002', equipmentSn: '-', equipmentName: '数控加工车间路线（CR-N-001）', equipmentModel: '-', equipmentSupplier: '', equipmentSupplierName: '-', equipmentType: '', equipmentTypeDesc: '巡检路线', hasParamPlan: '0', createByPersonName: '张工', createTime: '2026-01-20 09:00:00' },
  ],
}

// ══════════════════════════════════════════════
// 备件（共用，按使用记录区分车间）
// ══════════════════════════════════════════════
// warehouseType: '1' 自动化备件库（C 端专用） / '2' 设备维修备件库（C 端 + 通用） / '3' B 端关键备件 / '4' CNC 设备备件
// safetyStatus 由 actualStock vs minStock 实时计算，'red' = 缺货 / 'yellow' = 低库存 / 'green' = 正常
const spareParts = [
  // ─── C 端 自动化备件库（warehouseType=1，PACK 线/电机线非标设备配套）───
  { id: 'SP01', number: 'BJ-001', name: '485通讯端子', specification: '标准', unitName: '个', materialGroupName: '设备配件', categoryPath: '电气/通讯/485端子', actualStock: 12, maxStock: 20, minStock: 5, warehouseType: '1', warehouseTypeText: '自动化备件库', relatedEquipment: 'EW-LP-001', sourceType: '易损件', unitPrice: 12.5 },
  { id: 'SP09', number: 'BJ-009', name: 'PLC 模拟量模块', specification: 'CPU 1212C', unitName: '块', materialGroupName: '设备配件', categoryPath: '电气/控制/PLC模块', actualStock: 4, maxStock: 8, minStock: 2, warehouseType: '1', warehouseTypeText: '自动化备件库', relatedEquipment: 'PACK线', sourceType: '标准件备货', unitPrice: 1850 },
  { id: 'SP10', number: 'BJ-010', name: '伺服电机驱动器', specification: 'V90 400W', unitName: '台', materialGroupName: '设备配件', categoryPath: '电气/控制/驱动器', actualStock: 1, maxStock: 4, minStock: 2, warehouseType: '1', warehouseTypeText: '自动化备件库', relatedEquipment: 'PACK上下料工作站', sourceType: '调试后补买', unitPrice: 3200 },
  { id: 'SP11', number: 'BJ-011', name: '协作机器人吸盘组', specification: 'TM5 标准吸盘', unitName: '套', materialGroupName: '设备配件', categoryPath: '机械/末端/吸盘', actualStock: 3, maxStock: 6, minStock: 2, warehouseType: '1', warehouseTypeText: '自动化备件库', relatedEquipment: 'PACK上下料工作站', sourceType: '通用件备货', unitPrice: 580 },
  { id: 'SP12', number: 'BJ-012', name: '点胶针头', specification: '22G', unitName: '盒', materialGroupName: '耗材', categoryPath: '机械/末端/针头', actualStock: 5, maxStock: 20, minStock: 10, warehouseType: '1', warehouseTypeText: '自动化备件库', relatedEquipment: 'PACK点胶机', sourceType: '生产件冗余', unitPrice: 45 },
  // ─── C 端 设备维修备件库（warehouseType=2）───
  { id: 'SP02', number: 'BJ-002', name: 'NSK PS-2润滑脂', specification: '0.5g/次', unitName: '管', materialGroupName: '耗材', categoryPath: '耗材/润滑/锂基脂', actualStock: 3, maxStock: 10, minStock: 3, warehouseType: '2', warehouseTypeText: '设备维修备件库', relatedEquipment: 'C端绕线机类', sourceType: '易损件', unitPrice: 35 },
  { id: 'SP03', number: 'BJ-003', name: '张力器羊毛轮', specification: '标准', unitName: '个', materialGroupName: '设备配件', categoryPath: '机械/张力器/羊毛轮', actualStock: 8, maxStock: 15, minStock: 5, warehouseType: '2', warehouseTypeText: '设备维修备件库', relatedEquipment: 'C端绕线机类', sourceType: '易损件', unitPrice: 28 },
  { id: 'SP04', number: 'BJ-004', name: '急停按钮', specification: 'φ22', unitName: '个', materialGroupName: '设备配件', categoryPath: '电气/操作元件/急停', actualStock: 2, maxStock: 10, minStock: 5, warehouseType: '2', warehouseTypeText: '设备维修备件库', relatedEquipment: '通用', sourceType: '通用件备货', unitPrice: 22 },
  { id: 'SP05', number: 'BJ-005', name: '气管接头', specification: '6mm', unitName: '个', materialGroupName: '设备配件', categoryPath: '气动/接头/快插', actualStock: 20, maxStock: 30, minStock: 10, warehouseType: '2', warehouseTypeText: '设备维修备件库', relatedEquipment: '通用', sourceType: '通用件备货', unitPrice: 8 },
  // ─── B 端 关键备件库（warehouseType=3）───
  { id: 'SP06', number: 'BJ-006', name: '批头', specification: 'PH2', unitName: '个', materialGroupName: '设备配件', categoryPath: '机械/批头', actualStock: 1, maxStock: 10, minStock: 3, warehouseType: '3', warehouseTypeText: 'B端关键备件库', relatedEquipment: 'B端锁螺丝机', sourceType: '易损件', unitPrice: 18 },
  { id: 'SP13', number: 'BJ-013', name: '电极头', specification: 'φ16', unitName: '对', materialGroupName: '设备配件', categoryPath: '焊接/电极头', actualStock: 4, maxStock: 10, minStock: 4, warehouseType: '3', warehouseTypeText: 'B端关键备件库', relatedEquipment: 'B端焊接机', sourceType: '易损件', unitPrice: 65 },
  { id: 'SP14', number: 'BJ-014', name: '检测探针', specification: '0.5mm 弹簧探针', unitName: '组', materialGroupName: '耗材', categoryPath: '检测/探针', actualStock: 0, maxStock: 8, minStock: 2, warehouseType: '3', warehouseTypeText: 'B端关键备件库', relatedEquipment: 'B端检测设备', sourceType: '易损件', unitPrice: 145 },
  // ─── CNC 设备备件库（warehouseType=4）───
  { id: 'SP07', number: 'BJ-007', name: 'CNC主轴轴承', specification: '7014C', unitName: '套', materialGroupName: '设备配件', categoryPath: '机械/主轴/轴承', actualStock: 2, maxStock: 5, minStock: 2, warehouseType: '4', warehouseTypeText: 'CNC设备备件库', relatedEquipment: 'CNC设备', sourceType: '关键备件', unitPrice: 3850 },
  { id: 'SP08', number: 'BJ-008', name: '注塑机温控模块', specification: 'TC-48', unitName: '块', materialGroupName: '设备配件', categoryPath: '电气/控制/温控', actualStock: 0, maxStock: 3, minStock: 1, warehouseType: '4', warehouseTypeText: 'CNC设备备件库', relatedEquipment: 'INJ-001/002', sourceType: '关键备件', unitPrice: 2680 },
  { id: 'SP15', number: 'BJ-015', name: '46# 抗磨液压油', specification: '200L/桶', unitName: '桶', materialGroupName: '耗材', categoryPath: '耗材/油液/液压油', actualStock: 1, maxStock: 4, minStock: 2, warehouseType: '4', warehouseTypeText: 'CNC设备备件库', relatedEquipment: '注塑机/CNC', sourceType: '保养耗材', unitPrice: 1280 },
  { id: 'SP16', number: 'BJ-016', name: '止逆环', specification: 'φ40 标准', unitName: '个', materialGroupName: '设备配件', categoryPath: '机械/螺杆/止逆环', actualStock: 3, maxStock: 6, minStock: 2, warehouseType: '4', warehouseTypeText: 'CNC设备备件库', relatedEquipment: '注塑机', sourceType: '易损件', unitPrice: 420 },
  { id: 'SP17', number: 'BJ-017', name: '冷却液 5%', specification: 'BLASOCUT 25L', unitName: '桶', materialGroupName: '耗材', categoryPath: '耗材/油液/冷却液', actualStock: 6, maxStock: 12, minStock: 4, warehouseType: '4', warehouseTypeText: 'CNC设备备件库', relatedEquipment: 'CNC设备', sourceType: '保养耗材', unitPrice: 580 },
]

const sparePartRecords: any[] = [
  // 字段对齐前端列定义：recordCode/usageTime/equipmentSn/equipmentName/equipmentTypeName/equipmentMode/equipmentSupplierName/refWoType/refWoCode/operationType
  // C 端
  { id: 'SPR01', recordCode: 'SPR-2026-0001', workshopCode: 'C', sparePartNumber: 'BJ-001', sparePartName: '485通讯端子', quantity: 2, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-C-0001', relatedWorkOrder: 'RW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', operatorName: '李伟', usageTime: '2026-03-05 11:05', operateTime: '2026-03-05 11:05', createTime: '2026-03-05 11:05', remark: 'C端维修领用 / RW-C-0001' },
  { id: 'SPR02', recordCode: 'SPR-2026-0002', workshopCode: 'C', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 1, operationType: '出库', refWoType: '保养工单', refWoCode: 'MW-C-0001', relatedWorkOrder: 'MW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', operatorName: '陆钟', usageTime: '2026-04-01 09:20', operateTime: '2026-04-01 09:20', createTime: '2026-04-01 09:20', remark: 'C端绕线机月保养' },
  { id: 'SPR03', recordCode: 'SPR-2026-0003', workshopCode: 'C', sparePartNumber: 'BJ-003', sparePartName: '张力器羊毛轮', quantity: 1, operationType: '出库', refWoType: '保养工单', refWoCode: 'MW-C-0001', relatedWorkOrder: 'MW-C-0001', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', operatorName: '陆钟', usageTime: '2026-04-01 09:25', operateTime: '2026-04-01 09:25', createTime: '2026-04-01 09:25', remark: '张力器例行更换' },
  { id: 'SPR04', recordCode: 'SPR-2026-0004', workshopCode: 'C', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 1, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-C-0002', relatedWorkOrder: 'RW-C-0002', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentTypeName: '加工类设备', equipmentMode: 'LP-50', equipmentSupplierName: '华诚精密', operatorName: '李伟', usageTime: '2026-04-22 10:25', operateTime: '2026-04-22 10:25', createTime: '2026-04-22 10:25', remark: '保养异常维修' },
  { id: 'SPR05', recordCode: 'SPR-2026-0005', workshopCode: 'C', sparePartNumber: 'BJ-009', sparePartName: 'PLC 模拟量模块', quantity: 1, operationType: '入库', refWoType: '采购订单', refWoCode: 'PO-2026-04-0312', relatedWorkOrder: 'PO-2026-04-0312', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK 线', equipmentTypeName: '非标设备', equipmentMode: 'BPIL-A1', equipmentSupplierName: '西门子', operatorName: '库管小王', usageTime: '2026-04-15 14:00', operateTime: '2026-04-15 14:00', createTime: '2026-04-15 14:00', remark: 'ERP 采购入库' },
  { id: 'SPR06', recordCode: 'SPR-2026-0006', workshopCode: 'C', sparePartNumber: 'BJ-012', sparePartName: '点胶针头', quantity: 5, operationType: '手动领用', refWoType: '日常领用', refWoCode: '-', relatedWorkOrder: '-', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK 点胶机', equipmentTypeName: '非标设备', equipmentMode: 'BPIL-A1', equipmentSupplierName: '诺信EFD', operatorName: '刘朋朋', usageTime: '2026-04-18 09:00', operateTime: '2026-04-18 09:00', createTime: '2026-04-18 09:00', remark: '日常生产消耗' },
  // B 端
  { id: 'SPR07', recordCode: 'SPR-2026-0007', workshopCode: 'B', sparePartNumber: 'BJ-006', sparePartName: '批头', quantity: 2, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-B-0001', relatedWorkOrder: 'RW-B-0001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', operatorName: '买盼', usageTime: '2026-04-08 10:10', operateTime: '2026-04-08 10:10', createTime: '2026-04-08 10:10', remark: 'B端锁螺丝机维修' },
  { id: 'SPR08', recordCode: 'SPR-2026-0008', workshopCode: 'B', sparePartNumber: 'BJ-005', sparePartName: '气管接头', quantity: 1, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-B-0001', relatedWorkOrder: 'RW-B-0001', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', operatorName: '买盼', usageTime: '2026-04-08 10:15', operateTime: '2026-04-08 10:15', createTime: '2026-04-08 10:15', remark: '气路漏气一并更换' },
  { id: 'SPR09', recordCode: 'SPR-2026-0009', workshopCode: 'B', sparePartNumber: 'BJ-013', sparePartName: '电极头', quantity: 2, operationType: '入库', refWoType: '采购订单', refWoCode: 'PO-2026-04-0145', relatedWorkOrder: 'PO-2026-04-0145', equipmentSn: 'B-20000022', equipmentName: '电阻焊接机', equipmentTypeName: '加工类设备', equipmentMode: 'RW-30', equipmentSupplierName: '快克智能', operatorName: '库管小王', usageTime: '2026-04-10 11:00', operateTime: '2026-04-10 11:00', createTime: '2026-04-10 11:00', remark: 'ERP 采购入库' },
  { id: 'SPR10', recordCode: 'SPR-2026-0010', workshopCode: 'B', sparePartNumber: 'BJ-014', sparePartName: '检测探针', quantity: 4, operationType: '入库', refWoType: '采购订单', refWoCode: 'PO-2026-04-0211', relatedWorkOrder: 'PO-2026-04-0211', equipmentSn: 'B-DET-001', equipmentName: 'B端检测设备', equipmentTypeName: '检测设备', equipmentMode: 'DET-001', equipmentSupplierName: '研华', operatorName: '库管小王', usageTime: '2026-04-12 15:00', operateTime: '2026-04-12 15:00', createTime: '2026-04-12 15:00', remark: '安全库存预警补货入库' },
  { id: 'SPR11', recordCode: 'SPR-2026-0011', workshopCode: 'B', sparePartNumber: 'BJ-006', sparePartName: '批头', quantity: 1, operationType: '手动领用', refWoType: '日常领用', refWoCode: '-', relatedWorkOrder: '-', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentTypeName: '加工类设备', equipmentMode: 'ASM-4', equipmentSupplierName: '快克智能', operatorName: '严欢欢', usageTime: '2026-04-19 14:20', operateTime: '2026-04-19 14:20', createTime: '2026-04-19 14:20', remark: '班组日常领用' },
  // CNC
  { id: 'SPR12', recordCode: 'SPR-2026-0012', workshopCode: 'CNC', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 1, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-N-0001', relatedWorkOrder: 'RW-N-0001', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', operatorName: '刚嘉成', usageTime: '2026-04-14 13:30', operateTime: '2026-04-14 13:30', createTime: '2026-04-14 13:30', remark: '注塑机温控故障' },
  { id: 'SPR13', recordCode: 'SPR-2026-0013', workshopCode: 'CNC', sparePartNumber: 'BJ-007', sparePartName: 'CNC主轴轴承', quantity: 1, operationType: '出库', refWoType: '维修工单', refWoCode: 'RW-N-0002', relatedWorkOrder: 'RW-N-0002', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', operatorName: '刚嘉成', usageTime: '2026-04-17 09:30', operateTime: '2026-04-17 09:30', createTime: '2026-04-17 09:30', remark: 'A4 主轴大修' },
  { id: 'SPR14', recordCode: 'SPR-2026-0014', workshopCode: 'CNC', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 2, operationType: '出库', refWoType: '保养工单', refWoCode: 'MW-N-0001', relatedWorkOrder: 'MW-N-0001', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentTypeName: '数控设备', equipmentMode: 'T-7', equipmentSupplierName: '乔峰', operatorName: '刚嘉成', usageTime: '2026-04-01 08:50', operateTime: '2026-04-01 08:50', createTime: '2026-04-01 08:50', remark: 'CNC 月度保养' },
  { id: 'SPR15', recordCode: 'SPR-2026-0015', workshopCode: 'CNC', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 3, operationType: '出库', refWoType: '保养工单', refWoCode: 'MW-N-0002', relatedWorkOrder: 'MW-N-0002', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', operatorName: '彭向', usageTime: '2026-04-25 10:00', operateTime: '2026-04-25 10:00', createTime: '2026-04-25 10:00', remark: '注塑机季度保养' },
  { id: 'SPR16', recordCode: 'SPR-2026-0016', workshopCode: 'CNC', sparePartNumber: 'BJ-015', sparePartName: '46# 抗磨液压油', quantity: 1, operationType: '出库', refWoType: '保养工单', refWoCode: 'MW-N-0002', relatedWorkOrder: 'MW-N-0002', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', operatorName: '彭向', usageTime: '2026-04-25 10:30', operateTime: '2026-04-25 10:30', createTime: '2026-04-25 10:30', remark: '液压油更换' },
  { id: 'SPR17', recordCode: 'SPR-2026-0017', workshopCode: 'CNC', sparePartNumber: 'BJ-007', sparePartName: 'CNC主轴轴承', quantity: 1, operationType: '入库', refWoType: '采购订单', refWoCode: 'PO-2026-04-0489', relatedWorkOrder: 'PO-2026-04-0489', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentTypeName: '数控设备', equipmentMode: 'VF2', equipmentSupplierName: '哈斯', operatorName: '库管小张', usageTime: '2026-04-16 16:00', operateTime: '2026-04-16 16:00', createTime: '2026-04-16 16:00', remark: 'ERP 采购入库' },
  { id: 'SPR18', recordCode: 'SPR-2026-0018', workshopCode: 'CNC', sparePartNumber: 'BJ-016', sparePartName: '止逆环', quantity: 1, operationType: '退库', refWoType: '维修工单', refWoCode: 'RW-N-0002', relatedWorkOrder: 'RW-N-0002', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', operatorName: '刚嘉成', usageTime: '2026-04-17 14:00', operateTime: '2026-04-17 14:00', createTime: '2026-04-17 14:00', remark: '维修后未使用退回' },
  { id: 'SPR19', recordCode: 'SPR-2026-0019', workshopCode: 'CNC', sparePartNumber: 'BJ-017', sparePartName: '冷却液', quantity: 2, operationType: '手动领用', refWoType: '日常领用', refWoCode: '-', relatedWorkOrder: '-', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentTypeName: '数控设备', equipmentMode: 'T-7', equipmentSupplierName: '乔峰', operatorName: '王组长', usageTime: '2026-04-20 08:30', operateTime: '2026-04-20 08:30', createTime: '2026-04-20 08:30', remark: '日常补液' },
  { id: 'SPR20', recordCode: 'SPR-2026-0020', workshopCode: 'CNC', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 2, operationType: '入库', refWoType: '采购订单', refWoCode: 'PO-2026-04-0501', relatedWorkOrder: 'PO-2026-04-0501', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentTypeName: '注塑设备', equipmentMode: 'MA1200', equipmentSupplierName: '海天国际', operatorName: '库管小张', usageTime: '2026-04-22 10:00', operateTime: '2026-04-22 10:00', createTime: '2026-04-22 10:00', remark: '预警补货入库' },
]

// ── 枚举 ──
const workOrderStatus = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '已派工', type: 'warning' }, { value: '3', text: '执行中', type: '' }, { value: '4', text: '已完成', type: 'success' } ]
const maintenanceLevelEnum = [ { value: '1', text: '一级保养' }, { value: '2', text: '二级保养' }, { value: '3', text: '三级保养' } ]
const failureStatusEnum = [ { value: '1', text: '待审核', type: 'info' }, { value: '2', text: '已通过', type: 'success' }, { value: '3', text: '已驳回', type: 'danger' } ]
const executeStatusEnum = [ { value: '1', text: '待执行', type: 'info' }, { value: '2', text: '执行中', type: '' }, { value: '3', text: '已完成', type: 'success' } ]
const breakdownLevelEnum = [ { value: '1', text: '紧急', type: 'danger' }, { value: '2', text: '一般', type: 'warning' }, { value: '3', text: '轻微', type: 'info' } ]
const breakdownTypeEnum = [ { value: '1', text: '电气故障' }, { value: '2', text: '机械故障' }, { value: '3', text: '软件故障' }, { value: '4', text: '其他' } ]
const repairDegreeEnum = [ { value: '1', text: '紧急', type: 'danger' }, { value: '2', text: '普通' }, { value: '3', text: '低', type: 'info' } ]
const repairStatusEnum = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '已派工', type: 'warning' }, { value: '3', text: '维修中' }, { value: '4', text: '已完工', type: 'success' }, { value: '5', text: '已确认', type: 'success' } ]
const inspectionStatusEnum = [ { value: '1', text: '待派工', type: 'info' }, { value: '2', text: '执行中' }, { value: '3', text: '已完成', type: 'success' } ]

// ── 通用handler生成器 ──
function listHandler(allData: any[], url: string, method = 'get') {
  return {
    url: '/admin-api' + url,
    method,
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const data = filterByWorkshop(allData, ws)
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  }
}

export default [
  // ══ 保养标准 ══
  listHandler(maintenanceStandards, '/workOrder/eamMaintenanceStandard/list'),
  { url: '/admin-api/workOrder/eamMaintenanceStandard/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceStandards.find(s => s.id === query?.id) }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandard/delete', method: 'delete', response: () => ({ code: 200, data: true }) },

  // ══ 保养标准项清单（按 maintenanceStandardCode 过滤）══
  {
    url: '/admin-api/workOrder/eamMaintenanceStandardItem/list', method: 'get',
    response: ({ query }: any) => {
      let arr = maintenanceStandardItems.slice()
      if (query?.maintenanceStandardCode) {
        arr = arr.filter(it => it.maintenanceStandardCode === query.maintenanceStandardCode)
      }
      arr.sort((a, b) => (a.seq || 0) - (b.seq || 0))
      return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamMaintenanceStandardItem/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceStandardItems.find(it => it.id === query?.id) }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandardItem/add', method: 'post', response: ({ body }: any) => {
    const id = `MSI-${Date.now()}`
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    maintenanceStandardItems.push({ id, ...body, createByPersonName: body.createByPersonName || '系统', createTime: now })
    return { code: 200, data: { id } }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardItem/edit', method: 'put', response: ({ body }: any) => {
    const idx = maintenanceStandardItems.findIndex(it => it.id === body.id)
    if (idx >= 0) Object.assign(maintenanceStandardItems[idx], body)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardItem/delete', method: 'delete', response: ({ query }: any) => {
    const idx = maintenanceStandardItems.findIndex(it => it.id === query?.id)
    if (idx >= 0) maintenanceStandardItems.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardItem/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = String(query?.ids || '').split(',')
    for (const id of ids) {
      const idx = maintenanceStandardItems.findIndex(it => it.id === id)
      if (idx >= 0) maintenanceStandardItems.splice(idx, 1)
    }
    return { code: 200, data: true }
  } },

  // ══ 保养标准物料清单（按 maintenanceStandardCode 过滤）══
  {
    url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/list', method: 'get',
    response: ({ query }: any) => {
      let arr = maintenanceStandardSpareParts.slice()
      if (query?.maintenanceStandardCode) {
        arr = arr.filter(sp => sp.maintenanceStandardCode === query.maintenanceStandardCode)
      }
      arr.sort((a, b) => (a.seq || 0) - (b.seq || 0))
      return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceStandardSpareParts.find(sp => sp.id === query?.id) }) },
  { url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/add', method: 'post', response: ({ body }: any) => {
    const id = `MSP-${Date.now()}`
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    // 关联备件主数据自动带入名称/规格/单位
    const sp = spareParts.find(s => s.id === body.sparePartId)
    maintenanceStandardSpareParts.push({
      id,
      maintenanceStandardCode: body.maintenanceStandardCode,
      sparePartId: body.sparePartId,
      sparePartNumber: sp?.number || body.sparePartNumber || '',
      sparePartName: sp?.name || body.sparePartName || '',
      specification: sp?.specification || body.specification || '',
      unit: sp?.unitName || body.unit || '',
      planQty: body.planQty || 1,
      remark: body.remark || '',
      seq: body.seq ?? 99,
      createByPersonName: body.createByPersonName || '系统',
      createTime: now,
    })
    return { code: 200, data: { id } }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/edit', method: 'put', response: ({ body }: any) => {
    const idx = maintenanceStandardSpareParts.findIndex(sp => sp.id === body.id)
    if (idx >= 0) {
      const sp = spareParts.find(s => s.id === body.sparePartId)
      if (sp) {
        body.sparePartNumber = sp.number
        body.sparePartName = sp.name
        body.specification = sp.specification
        body.unit = sp.unitName
      }
      Object.assign(maintenanceStandardSpareParts[idx], body)
    }
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/delete', method: 'delete', response: ({ query }: any) => {
    const idx = maintenanceStandardSpareParts.findIndex(sp => sp.id === query?.id)
    if (idx >= 0) maintenanceStandardSpareParts.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceStandardSparePart/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = String(query?.ids || '').split(',')
    for (const id of ids) {
      const idx = maintenanceStandardSpareParts.findIndex(sp => sp.id === id)
      if (idx >= 0) maintenanceStandardSpareParts.splice(idx, 1)
    }
    return { code: 200, data: true }
  } },

  // ══ 保养计划 ══
  // 计划主数据：维护在外部数组，便于其他接口（保养项关联）共用
  {
    url: '/admin-api/workOrder/eamMaintenancePlan/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      return { code: 200, data: paginate(filterByWorkshop(maintenancePlans, ws), query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamMaintenancePlan/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: maintenancePlans.find((p: any) => p.id === query?.id) }) },
  { url: '/admin-api/workOrder/eamMaintenancePlan/save', method: 'post', response: ({ body }: any) => {
    const id = body?.id || `MP-${Date.now()}`
    const code = body?.code || `MP-NEW-${maintenancePlans.length + 1}`
    const idx = maintenancePlans.findIndex((p: any) => p.id === body?.id)
    if (idx >= 0) {
      Object.assign(maintenancePlans[idx], body)
    } else {
      maintenancePlans.unshift({ ...body, id, code, createTime: new Date().toISOString().slice(0, 19).replace('T', ' ') })
    }
    return { code: 200, data: { id, code } }
  } },
  { url: '/admin-api/workOrder/eamMaintenancePlan/delete', method: 'delete', response: ({ query }: any) => {
    const idx = maintenancePlans.findIndex((p: any) => p.id === query?.id)
    if (idx >= 0) maintenancePlans.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamMaintenancePlan/listOfStatus', method: 'get', response: () => ({ code: 200, data: [
    { value: '0', text: '未启用', type: 'info' },
    { value: '1', text: '已启用', type: 'success' },
    { value: '2', text: '已停用', type: 'warning' },
  ] }) },
  // 频率类型字典（关键：解决"具体哪一天"动态字段不显示问题）
  { url: '/admin-api/workOrder/eamMaintenancePlan/queryDictItem', method: 'get', response: () => ({ code: 200, data: [
    { type: '每日', oneTitle: '执行时刻', oneMode: 'default', one: ['08:00', '12:00', '16:00', '20:00'], twoTitle: '提前生成时间(分)', twoMode: 'number', two: [] },
    { type: '每周', oneTitle: '执行星期', oneMode: 'multiple', one: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], twoTitle: '', twoMode: 'default', two: [] },
    { type: '每月', oneTitle: '执行日（每月第几天）', oneMode: 'multiple', one: Array.from({ length: 28 }, (_, i) => i + 1), twoTitle: '', twoMode: 'default', two: [] },
    { type: '每季度', oneTitle: '执行月（每季度第几月）', oneMode: 'multiple', one: [1, 2, 3], twoTitle: '执行日（该月第几天）', twoMode: 'multiple', two: Array.from({ length: 28 }, (_, i) => i + 1) },
    { type: '每半年', oneTitle: '执行月（前半年/后半年第几月）', oneMode: 'multiple', one: [1, 2, 3, 4, 5, 6], twoTitle: '执行日（该月第几天）', twoMode: 'multiple', two: Array.from({ length: 28 }, (_, i) => i + 1) },
    { type: '每年', oneTitle: '执行月份', oneMode: 'multiple', one: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], twoTitle: '执行日（该月第几天）', twoMode: 'multiple', two: Array.from({ length: 28 }, (_, i) => i + 1) },
  ] }) },
  // 保养项（按 planCode 过滤）：关联到保养标准的标准项（数据一致）
  {
    url: '/admin-api/workOrder/eamMaintenancePlanItem/list', method: 'get',
    response: ({ query }: any) => {
      const planCode = query?.planCode
      if (!planCode) return { code: 200, data: { records: [], total: 0 } }
      const plan: any = maintenancePlans.find((p: any) => p.code === planCode)
      if (!plan?.maintenanceStandardCode) return { code: 200, data: { records: [], total: 0 } }
      const items = maintenanceStandardItems
        .filter((it: any) => it.maintenanceStandardCode === plan.maintenanceStandardCode)
        .map((it: any) => ({
          id: `PLAN-${planCode}-${it.id}`,
          planCode,
          maintenanceStandardCode: plan.maintenanceStandardCode,
          maintenancePart: it.maintenancePart,
          remark: it.remark,
          seq: it.seq,
          createByPersonName: it.createByPersonName,
          createTime: it.createTime,
        }))
      return { code: 200, data: paginate(items, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 保养工单 ══
  listHandler(maintenanceWorkOrders, '/workOrder/eamMaintenanceWork/list'),
  { url: '/admin-api/workOrder/eamMaintenanceWork/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: maintenanceWorkOrders.find(w => w.id === query?.id) || maintenanceWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/saveMaintenance', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/dispatch', method: 'post', response: () => ({ code: 200, data: true }) },
  // 完工：自动按工单关联标准的物料清单扣减备件库存
  { url: '/admin-api/workOrder/eamMaintenanceWork/complete', method: 'post', response: ({ body }: any) => {
    const wo = maintenanceWorkOrders.find(w => w.code === body?.code)
    const consumed: any[] = []
    if (wo) {
      wo.status = '4'
      if (body?.startTime) wo.startTime = body.startTime
      if (body?.endTime) wo.endTime = body.endTime
      // 按 maintenanceStandardCode 查物料清单 → 自动扣库存
      const stdCode = (wo as any).maintenanceStandardCode
      if (stdCode) {
        const items = maintenanceStandardSpareParts.filter((sp: any) => sp.maintenanceStandardCode === stdCode)
        for (const it of items) {
          const stock: any = spareParts.find((s: any) => s.id === it.sparePartId)
          if (stock) {
            const before = stock.actualStock
            stock.actualStock = Math.max(0, stock.actualStock - it.planQty)
            consumed.push({ name: it.sparePartName, number: it.sparePartNumber, qty: it.planQty, unit: it.unit, before, after: stock.actualStock })
          }
        }
      }
    }
    return { code: 200, data: { success: true, consumedSpareParts: consumed } }
  } },
  // 工单"保养项明细"（按 workCode → 关联标准 → 标准项）
  {
    url: '/admin-api/workOrder/eamMaintenanceWorkItem/list', method: 'get',
    response: ({ query }: any) => {
      const workCode = query?.workCode
      if (!workCode) return { code: 200, data: { records: [], total: 0 } }
      const wo: any = maintenanceWorkOrders.find(w => w.code === workCode)
      if (!wo?.maintenanceStandardCode) return { code: 200, data: { records: [], total: 0 } }
      const isFinished = wo.status === '4'
      const items = maintenanceStandardItems
        .filter((it: any) => it.maintenanceStandardCode === wo.maintenanceStandardCode)
        .map((it: any) => ({
          id: `WI-${workCode}-${it.id}`,
          workCode,
          maintenancePart: it.maintenancePart,
          remark: it.remark,
          isMaintained: isFinished ? '1' : '0', // 1=已保养 0=未保养
          isMaintainedDesc: isFinished ? '已保养' : '未保养',
          processRemark: isFinished ? '检查正常' : '',
          seq: it.seq,
          createByPersonName: wo.personName || '系统',
          createTime: wo.createTime,
        }))
      return { code: 200, data: paginate(items, query?.pageNo, query?.pageSize) }
    }
  },
  // 工单"备件使用记录"（按 refWoCode → 关联标准 → 标准物料）
  {
    url: '/admin-api/workOrder/eamSparePartUsageRecord/queryByRefWoCode', method: 'get',
    response: ({ query }: any) => {
      const refWoCode = query?.refWoCode
      if (!refWoCode) return { code: 200, data: null }
      const wo: any = maintenanceWorkOrders.find(w => w.code === refWoCode)
      if (!wo?.maintenanceStandardCode) return { code: 200, data: { detailList: [] } }
      const isFinished = wo.status === '4'
      const detailList = maintenanceStandardSpareParts
        .filter((sp: any) => sp.maintenanceStandardCode === wo.maintenanceStandardCode)
        .map((sp: any) => ({
          id: `SU-${refWoCode}-${sp.id}`,
          refWoCode,
          partCode: sp.sparePartNumber,
          partName: sp.sparePartName,
          // 前端列绑定字段（保持双写兼容）
          partSpecification: sp.specification,
          partSpec: sp.specification,
          partGroupName: sp.sparePartName?.includes('润滑') ? '耗材' : '设备配件',
          useAmount: isFinished ? sp.planQty : 0,
          actualQty: isFinished ? sp.planQty : 0,
          planQty: sp.planQty,
          stockUnitName: sp.unit,
          unit: sp.unit,
          replaced: isFinished ? '1' : '0',
          replacedDesc: isFinished ? '是' : '否',
          remark: sp.remark,
        }))
      return { code: 200, data: { refWoCode, detailList } }
    }
  },
  // 异常 → 转维修工单
  { url: '/admin-api/workOrder/eamMaintenanceWork/transferToRepair', method: 'post', response: ({ body }: any) => {
    const wo: any = maintenanceWorkOrders.find(w => w.code === body?.code)
    if (!wo) return { code: 1, msg: '工单不存在' }
    const seq = String(repairWorkOrders.length + 1).padStart(4, '0')
    const newCode = `RW-PM-${seq}`
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const newRepair: any = {
      id: `RW-PM-${Date.now()}`,
      workshopCode: wo.workshopCode,
      repairCode: newCode,
      equipmentSn: wo.equipmentSn,
      equipmentName: wo.equipmentName,
      equipmentTypeName: wo.equipmentTypeDesc,
      equipmentMode: wo.equipmentModel,
      equipmentSupplierName: wo.equipmentSupplierName,
      sourceType: '2',
      sourceTypeText: '保养异常',
      breakdownTime: now,
      breakdownLevelText: '一般',
      breakdownTypeText: '保养中发现',
      repairDegreeText: '普通',
      remark: body?.remark || `保养工单 ${wo.code} 执行中发现异常，转维修处理`,
      status: '1',
      repairPersonName: '',
      repairLevelText: '小修',
      repairTypeText: '机械维修',
      needShutdownText: '否',
      shutdownDurationText: '',
      repairBeginTime: '',
      repairEndTime: '',
      repairDurationText: '',
      failureWorkOrderCode: '',
      presentPersonName: wo.personName || '',
      presentTime: now,
      confirmPersonName: '',
      confirmTime: '',
      repairRecord: '',
      createByPersonName: wo.personName || '系统',
      createTime: now,
    }
    repairWorkOrders.unshift(newRepair)
    // 保养工单标记已挂起
    wo.status = '5'
    wo.remark = (wo.remark || '') + ` [已转维修工单 ${newCode}]`
    return { code: 200, data: { repairCode: newCode, repairId: newRepair.id } }
  } },
  { url: '/admin-api/workOrder/eamMaintenanceWork/delete', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/listOfStatus', method: 'get', response: () => ({ code: 200, data: workOrderStatus }) },
  { url: '/admin-api/workOrder/eamMaintenanceWork/listOfMaintenanceLevel', method: 'get', response: () => ({ code: 200, data: maintenanceLevelEnum }) },

  // ══ 故障报修 ══
  listHandler(failureWorkOrders, '/workOrder/eamFailureWorkOrder/list'),
  { url: '/admin-api/workOrder/eamFailureWorkOrder/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: failureWorkOrders.find(f => f.id === query?.id) || failureWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/add', method: 'post', response: () => ({ code: 200, data: { id: String(Date.now()) } }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfStatus', method: 'get', response: () => ({ code: 200, data: failureStatusEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfExecuteStatus', method: 'get', response: () => ({ code: 200, data: executeStatusEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfBreakdownLevel', method: 'get', response: () => ({ code: 200, data: breakdownLevelEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfBreakdownType', method: 'get', response: () => ({ code: 200, data: breakdownTypeEnum }) },
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfRepairDegree', method: 'get', response: () => ({ code: 200, data: repairDegreeEnum }) },

  // ══ 维修工单 ══
  listHandler(repairWorkOrders, '/workOrder/eamRepairWorkOrder/list'),
  { url: '/admin-api/workOrder/eamRepairWorkOrder/queryById', method: 'get', response: ({ query }) => ({ code: 200, data: repairWorkOrders.find(r => r.id === query?.id) || repairWorkOrders[0] }) },
  { url: '/admin-api/workOrder/eamRepairWorkOrder/listOfStatus', method: 'get', response: () => ({ code: 200, data: repairStatusEnum }) },
  { url: '/admin-api/workOrder/eamRepairWorkOrder/listOfSourceType', method: 'get', response: () => ({ code: 200, data: [
    { value: '1', text: '故障报修' },
    { value: '2', text: '点检异常' },
    { value: '3', text: '巡检异常' },
    { value: '4', text: '保养异常' },
    { value: '5', text: '其他' },
  ] }) },
  // 前端 enum store 实际调用的接口 listOfSource（与 listOfSourceType 同数据，URL 名不同）
  { url: '/admin-api/workOrder/eamRepairWorkOrder/listOfSource', method: 'get', response: () => ({ code: 200, data: [
    { value: '1', text: '故障报修' },
    { value: '2', text: '点检异常' },
    { value: '3', text: '巡检异常' },
    { value: '4', text: '保养异常' },
    { value: '5', text: '其他' },
  ] }) },
  // 故障报修来源字典（同样补一个 listOfSourceType 给故障报修页用）
  { url: '/admin-api/workOrder/eamFailureWorkOrder/listOfSourceType', method: 'get', response: () => ({ code: 200, data: [
    { value: '1', text: '生产报修' },
    { value: '2', text: '点检异常' },
    { value: '3', text: '巡检异常' },
    { value: '4', text: '保养异常' },
    { value: '5', text: '其他' },
  ] }) },
  // 维修工单物料清单（按 repairCode 过滤）
  {
    url: '/admin-api/workOrder/eamRepairWorkSparePart/list', method: 'get',
    response: ({ query }: any) => {
      const arr = repairWorkSpareParts.filter(sp => !query?.repairCode || sp.repairCode === query.repairCode)
      return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamRepairWorkSparePart/queryByRefWoCode', method: 'get', response: ({ query }: any) => {
    const detailList = repairWorkSpareParts.filter(sp => sp.repairCode === query?.refWoCode)
    return { code: 200, data: { refWoCode: query?.refWoCode, detailList } }
  } },
  { url: '/admin-api/workOrder/eamRepairWorkSparePart/add', method: 'post', response: ({ body }: any) => {
    const id = `RWS-${Date.now()}`
    repairWorkSpareParts.push({ id, ...body })
    return { code: 200, data: { id } }
  } },
  { url: '/admin-api/workOrder/eamRepairWorkSparePart/delete', method: 'delete', response: ({ query }: any) => {
    const idx = repairWorkSpareParts.findIndex(sp => sp.id === query?.id)
    if (idx >= 0) repairWorkSpareParts.splice(idx, 1)
    return { code: 200, data: true }
  } },
  // 维修工单完工：状态 → '4'（待发起人确认）+ 自动扣备件库存
  { url: '/admin-api/workOrder/eamRepairWorkOrder/complete', method: 'post', response: ({ body }: any) => {
    const wo: any = repairWorkOrders.find(r => r.repairCode === body?.repairCode || r.id === body?.id)
    if (!wo) return { code: 1, msg: '工单不存在' }
    wo.status = '4'
    wo.repairEndTime = body?.repairEndTime || new Date().toISOString().replace('T', ' ').slice(0, 19)
    if (body?.repairRecord) wo.repairRecord = body.repairRecord
    // 扣物料库存
    const items = repairWorkSpareParts.filter(sp => sp.repairCode === wo.repairCode)
    const consumed: any[] = []
    for (const it of items) {
      const stock: any = spareParts.find(s => s.id === it.sparePartId)
      if (stock) {
        const before = stock.actualStock
        stock.actualStock = Math.max(0, stock.actualStock - it.useAmount)
        consumed.push({ name: it.partName, qty: it.useAmount, unit: it.stockUnitName, before, after: stock.actualStock })
      }
    }
    return { code: 200, data: { success: true, consumedSpareParts: consumed } }
  } },
  // 发起人确认满意 → 状态 '5' 已确认（闭环）
  { url: '/admin-api/workOrder/eamRepairWorkOrder/confirmSatisfied', method: 'post', response: ({ body }: any) => {
    const wo: any = repairWorkOrders.find(r => r.repairCode === body?.repairCode || r.id === body?.id)
    if (!wo) return { code: 1, msg: '工单不存在' }
    if (wo.status !== '4') return { code: 1, msg: '仅"已完工"状态可确认' }
    wo.status = '5'
    wo.confirmPersonName = body?.confirmPersonName || wo.presentPersonName
    wo.confirmTime = new Date().toISOString().replace('T', ' ').slice(0, 19)
    return { code: 200, data: { success: true } }
  } },
  // 维修知识库
  {
    url: '/admin-api/workOrder/eamRepairKnowledge/list', method: 'get',
    response: ({ query }: any) => {
      let arr = repairKnowledgeList.slice()
      if (query?.title) arr = arr.filter(k => (k.title || '').includes(query.title))
      if (query?.category) arr = arr.filter(k => k.category === query.category)
      if (query?.tags) arr = arr.filter(k => (k.tags || '').includes(query.tags))
      return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamRepairKnowledge/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: repairKnowledgeList.find(k => k.id === query?.id) }) },

  // ══════════════════════════════════════
  // 点巡检标准（主表 + 子表）
  // ══════════════════════════════════════
  {
    url: '/admin-api/workOrder/eamSpotInspectionStandard/list', method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(spotInspectionStandards, ws)
      if (query?.code) data = data.filter((s: any) => s.code.includes(query.code))
      if (query?.name) data = data.filter((s: any) => s.name.includes(query.name))
      if (query?.equipmentTypeCode) data = data.filter((s: any) => s.equipmentTypeCode === query.equipmentTypeCode)
      if (query?.inspectionType) data = data.filter((s: any) => s.inspectionType === query.inspectionType)
      // 实时计算 checknum
      data = data.map((s: any) => ({
        ...s,
        checknum: spotInspectionStandardItems.filter((it: any) => it.standardCode === s.code).length
      }))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: spotInspectionStandards.find((s: any) => s.id === query?.id) || null }) },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/add', method: 'post', response: ({ body, headers }: any) => {
    const ws = getWorkshopByToken(headers?.authorization)
    const seq = String(spotInspectionStandards.length + 1).padStart(3, '0')
    const newStd: any = {
      id: 'SS-NEW-' + Date.now(),
      workshopCode: ws === 'ALL' ? 'C' : ws,
      code: body?.code || `SS-${ws === 'ALL' ? 'C' : ws}-${seq}`,
      name: body?.name || '新建标准',
      equipmentTypeCode: body?.equipmentTypeCode || '',
      equipmentTypeText: body?.equipmentTypeText || '',
      inspectionType: body?.inspectionType || '1',
      remark: body?.remark || '',
      checknum: 0,
      createByPersonName: '当前用户',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    spotInspectionStandards.unshift(newStd)
    return { code: 200, data: { id: newStd.id } }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/edit', method: 'put', response: ({ body }: any) => {
    const idx = spotInspectionStandards.findIndex((s: any) => s.id === body?.id)
    if (idx !== -1) Object.assign(spotInspectionStandards[idx], body)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/delete', method: 'delete', response: ({ query }: any) => {
    const idx = spotInspectionStandards.findIndex((s: any) => s.id === query?.id)
    if (idx !== -1) spotInspectionStandards.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = (query?.ids || '').split(',')
    ids.forEach((id: string) => {
      const idx = spotInspectionStandards.findIndex((s: any) => s.id === id)
      if (idx !== -1) spotInspectionStandards.splice(idx, 1)
    })
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/listOfParamsUnit', method: 'get', response: () => ({ code: 200, data: [
    { value: 'mm', text: 'mm' }, { value: 'MPa', text: 'MPa' }, { value: 'V', text: 'V' }, { value: 'A', text: 'A' },
    { value: '℃', text: '℃' }, { value: '%', text: '%' }, { value: 'L/min', text: 'L/min' }, { value: 'kN', text: 'kN' },
    { value: 'N·m', text: 'N·m' }, { value: 'MΩ', text: 'MΩ' }, { value: 'Ω', text: 'Ω' }
  ] }) },
  { url: '/admin-api/workOrder/eamSpotInspectionStandard/listOfYesNo', method: 'get', response: () => ({ code: 200, data: [
    { value: '1', text: '是' }, { value: '2', text: '否' }
  ] }) },

  // 标准检查项子表
  {
    url: '/admin-api/workOrder/eamSpotInspectionStandardItem/list', method: 'get',
    response: ({ query }: any) => {
      const standardCode = query?.standardCode || ''
      let data = spotInspectionStandardItems.filter((it: any) => it.standardCode === standardCode)
      data.sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionStandardItem/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: spotInspectionStandardItems.find((it: any) => it.id === query?.id) || null }) },
  { url: '/admin-api/workOrder/eamSpotInspectionStandardItem/add', method: 'post', response: ({ body }: any) => {
    const newItem: any = {
      id: 'SSI-NEW-' + Date.now(),
      standardCode: body?.standardCode || '',
      itemName: body?.itemName || '',
      itemType: body?.itemType || '定性',
      needTypeCode: body?.needTypeCode || '1',
      needTypeText: body?.needTypeText || '是',
      normal: body?.normal || '',
      abnormal: body?.abnormal || '',
      max: body?.max || '',
      min: body?.min || '',
      defaultValue: body?.defaultValue || '',
      sort: body?.sort || (spotInspectionStandardItems.filter((it: any) => it.standardCode === body?.standardCode).length + 1),
      checkStandard: body?.checkStandard || '',
      unitName: body?.unitName || '',
      unitNumber: body?.unitNumber || '',
      createByPersonName: '当前用户',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    spotInspectionStandardItems.push(newItem)
    return { code: 200, data: { id: newItem.id } }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandardItem/edit', method: 'put', response: ({ body }: any) => {
    const idx = spotInspectionStandardItems.findIndex((it: any) => it.id === body?.id)
    if (idx !== -1) Object.assign(spotInspectionStandardItems[idx], body)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandardItem/delete', method: 'delete', response: ({ query }: any) => {
    const idx = spotInspectionStandardItems.findIndex((it: any) => it.id === query?.id)
    if (idx !== -1) spotInspectionStandardItems.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionStandardItem/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = (query?.ids || '').split(',')
    ids.forEach((id: string) => {
      const idx = spotInspectionStandardItems.findIndex((it: any) => it.id === id)
      if (idx !== -1) spotInspectionStandardItems.splice(idx, 1)
    })
    return { code: 200, data: true }
  } },

  // ══════════════════════════════════════
  // 点巡检计划（主表 + 设备子表 + 检查项子表）
  // ══════════════════════════════════════
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlan/list', method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(spotInspectionPlans, ws)
      if (query?.code) data = data.filter((p: any) => p.code.includes(query.code))
      if (query?.name) data = data.filter((p: any) => p.name.includes(query.name))
      if (query?.status) data = data.filter((p: any) => p.status === query.status)
      if (query?.inspectionType) data = data.filter((p: any) => p.inspectionType === query.inspectionType)
      // 实时计算 deviceNum
      data = data.map((p: any) => ({
        ...p,
        deviceNum: (spotInspectionPlanDevices[p.code] || []).length
      }))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: spotInspectionPlans.find((p: any) => p.id === query?.id) || null }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/add', method: 'post', response: ({ body, headers }: any) => {
    const ws = getWorkshopByToken(headers?.authorization)
    const seq = String(spotInspectionPlans.length + 1).padStart(3, '0')
    const newPlan: any = {
      id: 'SP-NEW-' + Date.now(),
      workshopCode: ws === 'ALL' ? 'C' : ws,
      code: body?.code || `SP-${ws === 'ALL' ? 'C' : ws}-${seq}`,
      name: body?.name || '新建计划',
      equipmentTypeCode: body?.equipmentTypeCode || '',
      equipmentTypeText: body?.equipmentTypeText || '',
      equipmentModel: body?.equipmentModel || '',
      spotInspectionStandardCode: body?.spotInspectionStandardCode || '',
      inspectionType: body?.inspectionType || '1',
      startDate: body?.startDate || '2026-01-01',
      endDate: body?.endDate || '2026-12-31',
      skipCode: body?.skipCode || '0',
      skipText: body?.skipText || '否',
      periodicFrequencyType: body?.periodicFrequencyType || '每日',
      periodicFrequency: body?.periodicFrequency || '1次/天',
      deviceNum: 0,
      status: body?.status || '1',
      hasParamPlan: body?.hasParamPlan || '0',
      validityPeriod: body?.validityPeriod || 60,
      createByPersonName: '当前用户',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }
    spotInspectionPlans.unshift(newPlan)
    return { code: 200, data: { id: newPlan.id } }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/edit', method: 'put', response: ({ body }: any) => {
    const idx = spotInspectionPlans.findIndex((p: any) => p.id === body?.id)
    if (idx !== -1) Object.assign(spotInspectionPlans[idx], body)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/delete', method: 'delete', response: ({ query }: any) => {
    const idx = spotInspectionPlans.findIndex((p: any) => p.id === query?.id)
    if (idx !== -1) spotInspectionPlans.splice(idx, 1)
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = (query?.ids || '').split(',')
    ids.forEach((id: string) => {
      const idx = spotInspectionPlans.findIndex((p: any) => p.id === id)
      if (idx !== -1) spotInspectionPlans.splice(idx, 1)
    })
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/updateStatus', method: 'get', response: ({ query }: any) => {
    const ids = (query?.ids || '').split(',')
    const status = query?.status || '1'
    ids.forEach((id: string) => {
      const idx = spotInspectionPlans.findIndex((p: any) => p.id === id)
      if (idx !== -1) spotInspectionPlans[idx].status = status
    })
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/queryDictItem', method: 'get', response: () => ({ code: 200, data: [
    { type: '每日', oneMode: 'select', one: ['1次/天'], twoMode: '', two: [], oneTitle: '频次', twoTitle: '' },
    { type: '每周', oneMode: 'select', one: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], twoMode: '', two: [], oneTitle: '星期', twoTitle: '' },
    { type: '每月', oneMode: 'select', one: Array.from({length: 31}, (_, i) => i + 1), twoMode: '', two: [], oneTitle: '日期', twoTitle: '' },
  ] }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlan/createWorkOrder', method: 'post', response: ({ query }: any) => {
    const planCode = query?.planCode
    const plan = spotInspectionPlans.find((p: any) => p.code === planCode)
    if (!plan) return { code: 1, msg: '计划不存在' }
    const seq = String(spotInspectionWorks.length + 1).padStart(4, '0')
    const newWork: any = {
      id: 'SW-MAN-' + Date.now(),
      workshopCode: plan.workshopCode,
      workCode: `SW-${plan.workshopCode === 'CNC' ? 'N' : plan.workshopCode}-${seq}`,
      planCode: plan.code,
      planName: plan.name,
      equipmentSn: plan.inspectionType === '2' ? '-' : (spotInspectionPlanDevices[plan.code]?.[0]?.equipmentSn || ''),
      equipmentName: plan.inspectionType === '2' ? `${plan.name}路线` : (spotInspectionPlanDevices[plan.code]?.[0]?.equipmentName || ''),
      equipmentModel: plan.inspectionType === '2' ? '-' : (spotInspectionPlanDevices[plan.code]?.[0]?.equipmentModel || ''),
      status: '1',
      hasParamPlan: plan.hasParamPlan,
      inspectionType: plan.inspectionType,
      spotInspection: '0/0',
      workStartTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
      overdueTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16).replace('T', ' '),
      startTime: '',
      endTime: '',
      personSn: '',
      personName: '',
      createByPersonName: '当前用户',
      createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
      photos: [],
      scanCode: '',
      spotInspectionStandardCode: plan.spotInspectionStandardCode,
      routeCode: plan.routeCode,
    }
    spotInspectionWorks.unshift(newWork)
    return { code: 200, data: { id: newWork.id, workCode: newWork.workCode } }
  } },

  // 计划设备子表
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/list', method: 'get',
    response: ({ query }: any) => {
      const planCode = query?.planCode || ''
      const data = spotInspectionPlanDevices[planCode] || []
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/add', method: 'post', response: ({ body }: any) => {
    const items = Array.isArray(body) ? body : [body]
    items.forEach((item: any) => {
      const pc = item.planCode
      if (!pc) return
      if (!spotInspectionPlanDevices[pc]) spotInspectionPlanDevices[pc] = []
      spotInspectionPlanDevices[pc].push({
        id: 'SPD-NEW-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        planCode: pc,
        equipmentSn: item.equipmentSn || '',
        equipmentName: item.equipmentName || '',
        equipmentModel: item.equipmentModel || item.equipmentMode || '',
        equipmentSupplier: item.equipmentSupplier || '',
        equipmentSupplierName: item.equipmentSupplierName || '',
        equipmentType: item.equipmentType || '',
        equipmentTypeDesc: item.equipmentTypeDesc || '',
        hasParamPlan: item.hasParamPlan || '0',
        createByPersonName: '当前用户',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      })
    })
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/delete', method: 'delete', response: ({ query }: any) => {
    for (const pc in spotInspectionPlanDevices) {
      spotInspectionPlanDevices[pc] = spotInspectionPlanDevices[pc].filter((d: any) => d.id !== query?.id)
    }
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/deleteBatch', method: 'delete', response: ({ query }: any) => {
    const ids = (query?.ids || '').split(',')
    for (const pc in spotInspectionPlanDevices) {
      spotInspectionPlanDevices[pc] = spotInspectionPlanDevices[pc].filter((d: any) => !ids.includes(d.id))
    }
    return { code: 200, data: true }
  } },

  // 计划检查项子表（继承自标准）
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanItem/list', method: 'get',
    response: ({ query }: any) => {
      const planCode = query?.planCode || ''
      const plan = spotInspectionPlans.find((p: any) => p.code === planCode)
      let data: any[] = []
      if (plan?.spotInspectionStandardCode) {
        data = spotInspectionStandardItems
          .filter((it: any) => it.standardCode === plan.spotInspectionStandardCode)
          .map((it: any) => ({ ...it, planCode, id: `PLI-${planCode}-${it.id}` }))
        data.sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
      }
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanItem/add', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanItem/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanItem/delete', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanItem/deleteBatch', method: 'delete', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionPlanItem/addStandard', method: 'get', response: () => ({ code: 200, data: true }) },

  // ══════════════════════════════════════
  // 点检工单（主表 + 子表）
  // ══════════════════════════════════════
  {
    url: '/admin-api/workOrder/eamSpotInspectionWork/list', method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(spotInspectionWorks, ws)
      if (query?.workCode) data = data.filter((w: any) => w.workCode.includes(query.workCode))
      if (query?.planName) data = data.filter((w: any) => w.planName.includes(query.planName))
      if (query?.status) data = data.filter((w: any) => w.status === query.status)
      if (query?.inspectionType) data = data.filter((w: any) => w.inspectionType === query.inspectionType)
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionWork/queryById', method: 'get', response: ({ query }: any) => ({ code: 200, data: spotInspectionWorks.find((s: any) => s.id === query?.id) || spotInspectionWorks[0] }) },
  { url: '/admin-api/workOrder/eamSpotInspectionWork/edit', method: 'put', response: ({ body }: any) => {
    const idx = spotInspectionWorks.findIndex((w: any) => w.id === body?.id)
    if (idx !== -1) {
      Object.assign(spotInspectionWorks[idx], body)
      // 派工：personName 有值 → status='2'
      if (body?.personName && spotInspectionWorks[idx].status === '1') {
        spotInspectionWorks[idx].status = '2'
      }
    }
    return { code: 200, data: true }
  } },
  { url: '/admin-api/workOrder/eamSpotInspectionWork/listOfStatus', method: 'get', response: () => ({ code: 200, data: inspectionStatusEnum }) },

  // 异常转维修（点检版）
  { url: '/admin-api/workOrder/eamSpotInspectionWork/transferToRepair', method: 'post', response: ({ body }: any) => {
    const wo: any = spotInspectionWorks.find((w: any) => w.workCode === body?.workCode)
    if (!wo) return { code: 1, msg: '工单不存在' }
    const seq = String(repairWorkOrders.length + 1).padStart(4, '0')
    const newCode = `RW-PI-${seq}`
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    const sourceTypeText = wo.inspectionType === '2' ? '巡检异常' : '点检异常'
    const sourceType = wo.inspectionType === '2' ? '3' : '2'
    const newRepair: any = {
      id: `RW-PI-${Date.now()}`,
      workshopCode: wo.workshopCode,
      repairCode: newCode,
      equipmentSn: wo.equipmentSn,
      equipmentName: wo.equipmentName,
      equipmentTypeName: wo.equipmentTypeDesc || '',
      equipmentMode: wo.equipmentModel || '',
      equipmentSupplierName: '',
      sourceType,
      sourceTypeText,
      breakdownTime: now,
      breakdownLevelText: '一般',
      breakdownTypeText: sourceTypeText,
      repairDegreeText: '普通',
      remark: body?.remark || `${sourceTypeText}：工单 ${wo.workCode}`,
      status: '1',
      repairPersonName: '',
      repairLevelText: '小修',
      repairTypeText: '',
      needShutdownText: '否',
      shutdownDurationText: '',
      repairBeginTime: '',
      repairEndTime: '',
      repairDurationText: '',
      failureWorkOrderCode: '',
      presentPersonName: wo.personName || '',
      presentTime: now,
      confirmPersonName: '',
      confirmTime: '',
      repairRecord: '',
      createByPersonName: wo.personName || '系统',
      createTime: now,
    }
    repairWorkOrders.unshift(newRepair)
    // 标记原工单
    wo.remark = (wo.remark || '') + ` [已转维修工单 ${newCode}]`
    return { code: 200, data: { repairCode: newCode, repairId: newRepair.id } }
  } },

  // 工单设备子表（按 workCode 关联标准/路线展开）
  {
    url: '/admin-api/workOrder/eamSpotInspectionWorkStandard/list', method: 'get',
    response: ({ query }: any) => {
      const workCode = query?.workCode || ''
      const work = spotInspectionWorks.find((w: any) => w.workCode === workCode)
      if (!work) return { code: 200, data: { records: [], total: 0 } }
      let devices: any[] = []
      if (work.inspectionType === '2' && work.routeCode) {
        // 巡检：从路线点位生成设备子表
        // 引用 eam-inspection-route 中的点位（这里按规则生成）
        const ROUTE_DEFAULTS: Record<string, any[]> = {
          'CR-C-001': [
            { name: '电控柜 1 号', loc: 'PACK 车间 1F 东侧' }, { name: '压机区', loc: 'PACK 车间 1F 中部' },
            { name: '点胶机区', loc: 'PACK 车间 1F 中部' }, { name: '测试区', loc: 'PACK 车间 1F 西侧' },
            { name: '急停按钮区', loc: 'PACK 车间整线' }
          ],
          'CR-B-001': [
            { name: '锁螺丝区', loc: 'B端电子车间 1F 东侧' }, { name: '焊接区', loc: 'B端电子车间 1F 中部' },
            { name: '检漏测试区', loc: 'B端电子车间 1F 西侧' }, { name: 'PACK 压装区', loc: 'B端电子车间 1F 西北' }
          ],
          'CR-N-001': [
            { name: 'CNC 铣削加工中心 A 区', loc: '数控车间 A 区' }, { name: 'CNC 铣削加工中心 B 区', loc: '数控车间 B 区' },
            { name: 'CNC 车削中心区', loc: '数控车间 C 区' }, { name: '冷却液中央站', loc: '数控车间 集中区' },
            { name: '气源压力站', loc: '数控车间 北侧' }
          ]
        }
        const points = ROUTE_DEFAULTS[work.routeCode] || []
        const completedCount = parseInt((work.spotInspection || '0/0').split('/')[0]) || 0
        devices = points.map((pt: any, i: number) => ({
          id: `WSD-${work.workCode}-${i + 1}`,
          workCode: work.workCode,
          status: i < completedCount ? '3' : (work.status === '1' ? '1' : '2'),
          spotInspection: i < completedCount ? '5/5' : '0/5',
          abnormalNum: 0,
          startTime: i < completedCount ? work.startTime : '',
          endTime: i < completedCount ? work.endTime : '',
          hasParamPlan: '0',
          deviceSn: `${work.routeCode}-PT${String(i + 1).padStart(2, '0')}`,
          deviceName: pt.name,
          equipmentTypeDesc: '巡检点位',
          deviceMode: pt.loc,
          equipmentSupplierName: '-',
          personName: work.personName || '',
          skipReason: '',
          skipPersonName: '',
          createTime: work.createTime,
          attachments: i < completedCount ? (work.photos || []).join(',') : '',
          spotInspectionStandardCode: work.spotInspectionStandardCode || '',
          routePointName: pt.name,
        }))
      } else {
        // 点检：从计划设备表展开
        const planDevices = spotInspectionPlanDevices[work.planCode || ''] || []
        const totalItems = spotInspectionStandardItems.filter((it: any) => it.standardCode === work.spotInspectionStandardCode).length || 5
        const completedCount = parseInt((work.spotInspection || '0/0').split('/')[0]) || 0
        const isFinished = work.status === '3'
        const isInProgress = work.status === '2'
        devices = planDevices.map((d: any, i: number) => {
          let devStatus = '1'
          let devCompleted = 0
          if (isFinished) {
            devStatus = '3'
            devCompleted = totalItems
          } else if (isInProgress) {
            // 已派工：第一个执行中或已完成，其他待执行
            if (i === 0) {
              devStatus = completedCount >= totalItems ? '3' : '2'
              devCompleted = Math.min(completedCount, totalItems)
            } else if (i === 1 && completedCount > totalItems) {
              devStatus = '2'
              devCompleted = completedCount - totalItems
            }
          }
          return {
            id: `WSD-${work.workCode}-${i + 1}`,
            workCode: work.workCode,
            status: devStatus,
            spotInspection: `${devCompleted}/${totalItems}`,
            abnormalNum: (work.remark || '').includes('异常') && i === 0 ? 1 : 0,
            startTime: devStatus !== '1' ? work.startTime : '',
            endTime: devStatus === '3' ? work.endTime : '',
            hasParamPlan: d.hasParamPlan || '0',
            deviceSn: d.equipmentSn,
            deviceName: d.equipmentName,
            equipmentTypeDesc: d.equipmentTypeDesc,
            deviceMode: d.equipmentModel,
            equipmentSupplierName: d.equipmentSupplierName,
            personName: work.personName || '',
            skipReason: '',
            skipPersonName: '',
            createTime: work.createTime,
            attachments: devStatus === '3' ? (work.photos || []).join(',') : '',
            spotInspectionStandardCode: work.spotInspectionStandardCode || '',
          }
        })
      }
      return { code: 200, data: paginate(devices, query?.pageNo, query?.pageSize) }
    }
  },
  // 工单设备子表 — 按 ID 查询
  {
    url: '/admin-api/workOrder/eamSpotInspectionWorkStandard/queryById', method: 'get',
    response: ({ query }: any) => {
      const id: string = query?.id || ''
      // 解析 id 格式：WSD-{workCode}-{index}
      const m = /^WSD-(.+)-(\d+)$/.exec(id)
      if (!m) return { code: 200, data: null }
      const workCode = m[1]
      const work = spotInspectionWorks.find((w: any) => w.workCode === workCode)
      if (!work) return { code: 200, data: null }
      // 简化：返回根据 idx 构造的简略对象
      const idx = parseInt(m[2]) - 1
      const planDevices = spotInspectionPlanDevices[work.planCode || ''] || []
      const d = planDevices[idx]
      const isFinished = work.status === '3'
      return { code: 200, data: {
        id,
        workCode,
        status: isFinished ? '3' : (work.status === '2' && idx === 0 ? '2' : '1'),
        spotInspection: work.spotInspection,
        abnormalNum: 0,
        startTime: work.startTime || '',
        endTime: work.endTime || '',
        hasParamPlan: d?.hasParamPlan || '0',
        deviceSn: d?.equipmentSn || work.equipmentSn,
        deviceName: d?.equipmentName || work.equipmentName,
        equipmentTypeDesc: d?.equipmentTypeDesc || '',
        deviceMode: d?.equipmentModel || work.equipmentModel,
        equipmentSupplierName: d?.equipmentSupplierName || '',
        personName: work.personName || '',
        skipReason: '',
        skipPersonName: '',
        createTime: work.createTime,
        attachments: isFinished ? (work.photos || []).join(',') : '',
      } }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionWorkStandard/edit', method: 'put', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionWorkStandard/skipCheck', method: 'get', response: () => ({ code: 200, data: true }) },

  // 工单检查项子表（按 workStandardId 派生标准项 + 实际值）
  {
    url: '/admin-api/workOrder/eamSpotInspectionWorkStandardItem/list', method: 'get',
    response: ({ query }: any) => {
      const workStandardId: string = query?.workStandardId || ''
      const m = /^WSD-(.+)-(\d+)$/.exec(workStandardId)
      if (!m) return { code: 200, data: { records: [], total: 0 } }
      const workCode = m[1]
      const work = spotInspectionWorks.find((w: any) => w.workCode === workCode)
      if (!work) return { code: 200, data: { records: [], total: 0 } }
      const standardCode = work.spotInspectionStandardCode || 'SS-C-001'
      const items = spotInspectionStandardItems
        .filter((it: any) => it.standardCode === standardCode)
        .sort((a: any, b: any) => (a.sort || 0) - (b.sort || 0))
      const isFinished = work.status === '3'
      const completed = parseInt((work.spotInspection || '0/0').split('/')[0]) || 0
      const records = items.map((it: any, i: number) => {
        const filled = isFinished || i < completed
        // 默认结果合格；带异常标记的工单第一项填异常
        const isAnomalyItem = (work.remark || '').includes('异常') && i === 0 && !isFinished
        let checkRecord = ''
        let checkResult = ''
        if (filled) {
          if (it.itemType === '定性') {
            checkRecord = isAnomalyItem ? (it.abnormal.split(',')[0] || it.normal.split(',')[0]) : it.normal.split(',')[0]
            checkResult = isAnomalyItem ? '不合格' : '合格'
          } else {
            checkRecord = it.defaultValue || ''
            checkResult = '合格'
          }
        }
        return {
          id: `WSI-${workStandardId}-${it.id}`,
          workStandardId,
          itemName: it.itemName,
          itemType: it.itemType,
          needTypeCode: it.needTypeCode,
          needTypeText: it.needTypeText,
          normal: it.normal,
          abnormal: it.abnormal,
          max: it.max,
          min: it.min,
          defaultValue: it.defaultValue,
          unitName: it.unitName,
          paramsUnit: it.unitName,
          checkRecord,
          checkResult,
          sort: it.sort,
        }
      })
      return { code: 200, data: paginate(records, query?.pageNo, query?.pageSize) }
    }
  },
  { url: '/admin-api/workOrder/eamSpotInspectionWorkStandardItem/edit', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/workOrder/eamSpotInspectionWorkStandardItem/saveWorkStandard', method: 'get', response: () => ({ code: 200, data: true }) },

  // ══ 点检参数配置（暂留空） ══
  { url: '/admin-api/workOrder/eamSpotInspectionParamConf/list', method: 'get', response: ({ query }: any) => ({ code: 200, data: paginate([], query?.pageNo, query?.pageSize) }) },

  // ══ 点检记录列表（已完工工单，按车间过滤） ══
  { url: '/admin-api/workOrder/eamSpotInspectionWork/recordList', method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const completed = filterByWorkshop(spotInspectionWorks.filter((s: any) => s.status === '3'), ws)
      return { code: 200, data: paginate(completed, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 备件分类（11 条，前端用 classifName / classifParentName / sort / status 字段）══
  // 注意：listAll 必须在 list 之前注册，因为 prodMock 用 url.includes 匹配，list 会误匹配 listAll
  { url: '/admin-api/work/eamSparePartClassification/listAllNodes', method: 'get', response: () => ({
    code: 200, data: [
      { id: 'SPC01', code: 'SPC01', classifName: '电气类', classifParentId: '', status: 'ON' },
      { id: 'SPC02', code: 'SPC02', classifName: '机械类', classifParentId: '', status: 'ON' },
      { id: 'SPC03', code: 'SPC03', classifName: '气动类', classifParentId: '', status: 'ON' },
      { id: 'SPC04', code: 'SPC04', classifName: '液压类', classifParentId: '', status: 'ON' },
      { id: 'SPC05', code: 'SPC05', classifName: '耗材类', classifParentId: '', status: 'ON' },
      { id: 'SPC0101', code: 'SPC0101', classifName: '通讯模块', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0102', code: 'SPC0102', classifName: '控制模块', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0103', code: 'SPC0103', classifName: '操作元件', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0201', code: 'SPC0201', classifName: '主轴系统', classifParentId: 'SPC02', status: 'ON' },
      { id: 'SPC0202', code: 'SPC0202', classifName: '导轨系统', classifParentId: 'SPC02', status: 'ON' },
      { id: 'SPC0501', code: 'SPC0501', classifName: '油液耗材', classifParentId: 'SPC05', status: 'ON' },
    ]
  })},
  // 真实 listAll URL（前端调用，必须在 /list 之前定义）
  { url: '/admin-api/work/eamSparePartClassification/listAll', method: 'get', response: () => ({
    code: 200, data: [
      { id: 'SPC01', code: 'SPC01', classifName: '电气类', classifParentId: '', status: 'ON' },
      { id: 'SPC02', code: 'SPC02', classifName: '机械类', classifParentId: '', status: 'ON' },
      { id: 'SPC03', code: 'SPC03', classifName: '气动类', classifParentId: '', status: 'ON' },
      { id: 'SPC04', code: 'SPC04', classifName: '液压类', classifParentId: '', status: 'ON' },
      { id: 'SPC05', code: 'SPC05', classifName: '耗材类', classifParentId: '', status: 'ON' },
      { id: 'SPC0101', code: 'SPC0101', classifName: '通讯模块', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0102', code: 'SPC0102', classifName: '控制模块', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0103', code: 'SPC0103', classifName: '操作元件', classifParentId: 'SPC01', status: 'ON' },
      { id: 'SPC0201', code: 'SPC0201', classifName: '主轴系统', classifParentId: 'SPC02', status: 'ON' },
      { id: 'SPC0202', code: 'SPC0202', classifName: '导轨系统', classifParentId: 'SPC02', status: 'ON' },
      { id: 'SPC0501', code: 'SPC0501', classifName: '油液耗材', classifParentId: 'SPC05', status: 'ON' },
    ]
  })},
  { url: '/admin-api/work/eamSparePartClassification/list', method: 'get', response: ({ query }) => ({
    code: 200,
    data: paginate([
      { id: 'SPC01', code: 'SPC01', classifName: '电气类', classifParentName: '-', parentCode: '', sort: 1, status: '1', remark: '电气元件大类', createByPersonName: '系统', createTime: '2025-01-01 09:00:00', updateByPersonName: '系统', updateTime: '2025-01-01 09:00:00' },
      { id: 'SPC02', code: 'SPC02', classifName: '机械类', classifParentName: '-', parentCode: '', sort: 2, status: '1', remark: '机械配件大类', createByPersonName: '系统', createTime: '2025-01-01 09:00:00', updateByPersonName: '系统', updateTime: '2025-01-01 09:00:00' },
      { id: 'SPC03', code: 'SPC03', classifName: '气动类', classifParentName: '-', parentCode: '', sort: 3, status: '1', remark: '气动元件', createByPersonName: '系统', createTime: '2025-01-01 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC04', code: 'SPC04', classifName: '液压类', classifParentName: '-', parentCode: '', sort: 4, status: '1', remark: '液压元件', createByPersonName: '系统', createTime: '2025-01-01 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC05', code: 'SPC05', classifName: '耗材类', classifParentName: '-', parentCode: '', sort: 5, status: '1', remark: '油液/清洁/抹布等', createByPersonName: '系统', createTime: '2025-01-01 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0101', code: 'SPC0101', classifName: '通讯模块', classifParentName: '电气类', parentCode: 'SPC01', sort: 1, status: '1', remark: '485/CAN 等通讯', createByPersonName: '陆钟', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0102', code: 'SPC0102', classifName: '控制模块', classifParentName: '电气类', parentCode: 'SPC01', sort: 2, status: '1', remark: 'PLC/驱动器/HMI', createByPersonName: '陆钟', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0103', code: 'SPC0103', classifName: '操作元件', classifParentName: '电气类', parentCode: 'SPC01', sort: 3, status: '1', remark: '急停/按钮/指示灯', createByPersonName: '陆钟', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0201', code: 'SPC0201', classifName: '主轴系统', classifParentName: '机械类', parentCode: 'SPC02', sort: 1, status: '1', remark: '轴承/密封圈', createByPersonName: '刚嘉成', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0202', code: 'SPC0202', classifName: '导轨系统', classifParentName: '机械类', parentCode: 'SPC02', sort: 2, status: '1', remark: '直线导轨/丝杆螺母', createByPersonName: '刚嘉成', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
      { id: 'SPC0501', code: 'SPC0501', classifName: '油液耗材', classifParentName: '耗材类', parentCode: 'SPC05', sort: 1, status: '1', remark: '润滑脂/冷却液/液压油', createByPersonName: '系统', createTime: '2025-01-02 09:00:00', updateByPersonName: '', updateTime: '' },
    ], query?.pageNo, query?.pageSize)
  })},
  { url: '/admin-api/work/eamSparePartClassification/tree', method: 'get', response: () => ({
    code: 200, data: [
      { key: 'SPC01', title: '电气类', parentKey: null },
      { key: 'SPC02', title: '机械类', parentKey: null },
      { key: 'SPC03', title: '气动类', parentKey: null },
      { key: 'SPC04', title: '液压类', parentKey: null },
      { key: 'SPC05', title: '耗材类', parentKey: null },
    ]
  })},
  // ══ 备件库查询（页面真实调用 URL：eamBaseMaterial/list） ══
  { url: '/admin-api/workOrder/eamBaseMaterial/list', method: 'get', response: ({ query }: any) => {
    let arr = spareParts.slice()
    if (query?.warehouseType) arr = arr.filter((sp: any) => sp.warehouseType === query.warehouseType)
    if (query?.name) arr = arr.filter((sp: any) => (sp.name || '').includes(query.name))
    if (query?.number) arr = arr.filter((sp: any) => (sp.number || '').includes(query.number))
    arr = arr.map((sp: any) => {
      let safetyStatus = 'green', safetyStatusText = '正常'
      if (sp.actualStock <= 0) { safetyStatus = 'red'; safetyStatusText = '缺货' }
      else if (sp.actualStock < sp.minStock) { safetyStatus = 'red'; safetyStatusText = '低于安全库存' }
      else if (sp.actualStock < sp.minStock + 2) { safetyStatus = 'yellow'; safetyStatusText = '接近安全库存' }
      return { ...sp, safetyStatus, safetyStatusText }
    })
    return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
  } },
  { url: '/admin-api/workOrder/eamBaseMaterial/queryById', method: 'get', response: ({ query }: any) => ({
    code: 200, data: spareParts.find((sp: any) => sp.id === query?.id) || spareParts[0]
  }) },
  // ══ 备件使用记录（页面真实 URL：eamSparePartUsageRecord/list） ══
  { url: '/admin-api/workOrder/eamSparePartUsageRecord/list', method: 'get', response: ({ query, headers }: any) => {
    const ws = getWorkshopByToken(headers?.authorization)
    let arr = filterByWorkshop(sparePartRecords, ws)
    if (query?.sparePartName) arr = arr.filter((r: any) => (r.sparePartName || '').includes(query.sparePartName))
    if (query?.operationType) arr = arr.filter((r: any) => r.operationType === query.operationType)
    arr.sort((a: any, b: any) => (b.operateTime || '').localeCompare(a.operateTime || ''))
    return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
  } },
  { url: '/admin-api/workOrder/eamSparePartUsageRecordDetail/list', method: 'get', response: ({ query }: any) => ({
    code: 200, data: paginate(sparePartRecords.filter((r: any) => r.id === query?.recordId || !query?.recordId), query?.pageNo, query?.pageSize)
  }) },

  // ══ 备件库查询（共用） ══
  { url: '/admin-api/work/eamSparePartSearch/list', method: 'get', response: ({ query }: any) => {
    let arr = spareParts.slice()
    if (query?.warehouseType) arr = arr.filter((sp: any) => sp.warehouseType === query.warehouseType)
    if (query?.name) arr = arr.filter((sp: any) => (sp.name || '').includes(query.name))
    if (query?.number) arr = arr.filter((sp: any) => (sp.number || '').includes(query.number))
    // 加 safetyStatus 字段（red 缺货 / yellow 低库存 / green 正常）
    arr = arr.map((sp: any) => {
      let safetyStatus = 'green', safetyStatusText = '正常'
      if (sp.actualStock <= 0) { safetyStatus = 'red'; safetyStatusText = '缺货' }
      else if (sp.actualStock < sp.minStock) { safetyStatus = 'red'; safetyStatusText = '低于安全库存' }
      else if (sp.actualStock < sp.minStock + 2) { safetyStatus = 'yellow'; safetyStatusText = '接近安全库存' }
      return { ...sp, safetyStatus, safetyStatusText }
    })
    return { code: 200, data: paginate(arr, query?.pageNo, query?.pageSize) }
  } },
  // 库房类型字典（双库 Tab 用）
  { url: '/admin-api/work/eamSparePartSearch/listOfWarehouseType', method: 'get', response: () => ({ code: 200, data: [
    { value: '1', text: '自动化备件库', plantScope: 'C' },
    { value: '2', text: '设备维修备件库', plantScope: 'C' },
    { value: '3', text: 'B端关键备件库', plantScope: 'B' },
    { value: '4', text: 'CNC设备备件库', plantScope: 'CNC' },
  ] }) },
  // 安全库存预警列表（actualStock < minStock + 2 的全部）
  { url: '/admin-api/work/eamSparePartSearch/warningList', method: 'get', response: ({ query }: any) => {
    const warnings = spareParts.filter((sp: any) => sp.actualStock < sp.minStock + 2).map((sp: any) => ({
      ...sp,
      safetyStatus: sp.actualStock < sp.minStock ? 'red' : 'yellow',
      safetyStatusText: sp.actualStock <= 0 ? '缺货' : (sp.actualStock < sp.minStock ? '低于安全库存' : '接近安全库存'),
      shortageQty: Math.max(0, sp.maxStock - sp.actualStock),
      suggestedPurchase: Math.max(sp.maxStock - sp.actualStock, sp.minStock),
    }))
    return { code: 200, data: paginate(warnings, query?.pageNo, query?.pageSize) }
  } },
  // 手动领用单（创建消耗记录 + 扣库存）
  { url: '/admin-api/work/eamSparePartUsage/createManual', method: 'post', response: ({ body }: any) => {
    const sp: any = spareParts.find(s => s.id === body?.sparePartId || s.number === body?.sparePartNumber)
    if (!sp) return { code: 1, msg: '备件不存在' }
    const qty = Number(body?.quantity || 0)
    if (qty <= 0) return { code: 1, msg: '领用数量必须大于 0' }
    if (sp.actualStock < qty) return { code: 1, msg: `库存不足，当前仅 ${sp.actualStock} ${sp.unitName}` }
    const before = sp.actualStock
    sp.actualStock -= qty
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
    sparePartRecords.unshift({
      id: `SPR-${Date.now()}`,
      workshopCode: body?.workshopCode || 'C',
      sparePartNumber: sp.number,
      sparePartName: sp.name,
      quantity: qty,
      operationType: '手动领用',
      relatedWorkOrder: body?.relatedWorkOrder || '-',
      operatorName: body?.operatorName || '系统',
      operateTime: now,
      remark: body?.remark || '班组日常领用',
    })
    return { code: 200, data: { success: true, before, after: sp.actualStock } }
  } },

  // ══ 备件使用记录（按车间过滤） ══
  {
    url: '/admin-api/work/eamSparePartRecord/list', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      return { code: 200, data: paginate(filterByWorkshop(sparePartRecords, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 保养记录（按车间过滤） ══
  {
    url: '/admin-api/workOrder/eamMaintenanceWork/recordList', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const completed = filterByWorkshop(maintenanceWorkOrders.filter(w => w.status === '4'), ws)
      return { code: 200, data: paginate(completed, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 维修记录（按车间过滤） ══
  {
    url: '/admin-api/workOrder/eamRepairWorkOrder/recordList', method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      return { code: 200, data: paginate(filterByWorkshop(repairWorkOrders, ws), query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 维修工单备件耗用 ══
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/list',
    method: 'get',
    response: ({ query }) => {
      const repairCode = query?.repairCode || ''
      const allParts: Record<string, any[]> = {
        'RW-C-0001': [
          { id: 'RWSP01', repairCode: 'RW-C-0001', sparePartNumber: 'BJ-001', sparePartName: '485通讯端子', quantity: 1, operatorName: 'XXX', operateTime: '2026-03-05 11:05', remark: '更换故障端子' }
        ],
        'RW-B-0001': [
          { id: 'RWSP02', repairCode: 'RW-B-0001', sparePartNumber: 'BJ-006', sparePartName: '批头', quantity: 2, operatorName: '买盼', operateTime: '2026-04-08 10:10', remark: '更换磨损批头' }
        ],
        'RW-N-0001': [
          { id: 'RWSP03', repairCode: 'RW-N-0001', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 1, operatorName: '刚嘉成', operateTime: '2026-04-14 13:30', remark: '更换故障温控板' }
        ]
      }
      const data = allParts[repairCode] || []
      return { code: 200, data: { records: data, total: data.length } }
    }
  },
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/add',
    method: 'post',
    response: () => ({ code: 200, data: { id: String(Date.now()) } })
  },
  {
    url: '/admin-api/workOrder/eamRepairWorkOrderSparePart/delete',
    method: 'delete',
    response: () => ({ code: 200, data: true })
  },
  // ══ 备件报废登记 ══
  {
    url: '/admin-api/eam/sparePartScrap/list',
    method: 'get',
    response: ({ query }) => {
      const list: any[] = [
        { id: 'SPSC01', code: 'SP-SC-2026-001', sparePartNumber: 'BJ-009', sparePartName: 'PLC 模拟量模块', quantity: 1, reason: '损坏', processWay: '退供应商', amount: 1280, applicantName: '李伟', applicationDate: '2026-04-10', status: 'APPROVED', approverName: '陈工', remark: '入库时发现接口针脚弯曲' },
        { id: 'SPSC02', code: 'SP-SC-2026-002', sparePartNumber: 'BJ-002', sparePartName: 'NSK PS-2润滑脂', quantity: 3, reason: '超期失效', processWay: '销毁', amount: 105, applicantName: '陆钟', applicationDate: '2026-04-15', status: 'APPROVED', approverName: '张工', remark: '保质期 24 个月已过' },
        { id: 'SPSC03', code: 'SP-SC-2026-003', sparePartNumber: 'BJ-008', sparePartName: '注塑机温控模块', quantity: 1, reason: '损坏', processWay: '折旧回收', amount: 2680, applicantName: '彭向', applicationDate: '2026-04-18', status: 'APPROVED', approverName: '车间主任', remark: '维修时发现已击穿' },
        { id: 'SPSC04', code: 'SP-SC-2026-004', sparePartNumber: 'BJ-014', sparePartName: '检测探针 0.5mm', quantity: 8, reason: '工艺淘汰', processWay: '销毁', amount: 1160, applicantName: '严欢欢', applicationDate: '2026-04-20', status: 'PENDING', approverName: '', remark: '替换为新规格 0.3mm' },
        { id: 'SPSC05', code: 'SP-SC-2026-005', sparePartNumber: 'BJ-004', sparePartName: 'CNC 主轴轴承', quantity: 1, reason: '损坏', processWay: '销毁', amount: 3850, applicantName: '刚嘉成', applicationDate: '2026-04-22', status: 'PENDING', approverName: '', remark: '维修拆下后已变形无法复用' },
        { id: 'SPSC06', code: 'SP-SC-2026-006', sparePartNumber: 'BJ-015', sparePartName: '46# 抗磨液压油', quantity: 2, reason: '超期失效', processWay: '销毁', amount: 2560, applicantName: '彭向', applicationDate: '2026-04-23', status: 'PENDING', approverName: '', remark: '开桶超 6 个月已乳化' },
        { id: 'SPSC07', code: 'SP-SC-2026-007', sparePartNumber: 'BJ-005', sparePartName: '气管接头', quantity: 5, reason: '错件', processWay: '退供应商', amount: 40, applicantName: '买盼', applicationDate: '2026-04-25', status: 'REJECTED', approverName: '车间主任', remark: '供应商发错型号，已沟通退货' },
        { id: 'SPSC08', code: 'SP-SC-2026-008', sparePartNumber: 'BJ-013', sparePartName: '电极头 φ16', quantity: 4, reason: '损坏', processWay: '折旧回收', amount: 260, applicantName: '买盼', applicationDate: '2026-04-26', status: 'PENDING', approverName: '', remark: '电阻焊机调试时烧蚀' }
      ]
      const page = parseInt(query?.pageNo || '1', 10)
      const size = parseInt(query?.pageSize || '100', 10)
      const start = (page - 1) * size
      return { code: 200, data: { records: list.slice(start, start + size), total: list.length } }
    }
  },
  {
    url: '/admin-api/eam/sparePartScrap/create',
    method: 'post',
    response: () => ({ code: 200, data: { id: 'SPSC' + Date.now() } })
  },
  {
    url: '/admin-api/eam/sparePartScrap/approve',
    method: 'post',
    response: () => ({ code: 200, data: true })
  }
]
