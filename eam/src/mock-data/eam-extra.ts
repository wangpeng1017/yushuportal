/**
 * Mock 补充：修正字段名 + 设备选择弹窗 + 设备类型/类别/供应商完整数据
 * 解决页面显示空白和弹窗无数据的问题
 */

import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

// ── 有状态存储：子表数据（新增/删除会真正修改） ──
const planDeviceStore: Record<string, any[]> = {}   // planCode → 设备列表
const planItemStore: Record<string, any[]> = {}     // planCode → 保养/检查项列表

function getPlanDevices(planCode: string, defaults: any[]) {
  if (!planDeviceStore[planCode]) planDeviceStore[planCode] = [...defaults]
  return planDeviceStore[planCode]
}
function getPlanItems(planCode: string, defaults: any[]) {
  if (!planItemStore[planCode]) planItemStore[planCode] = [...defaults]
  return planItemStore[planCode]
}

// ── 设备类型完整数据（字段名匹配页面 prop） ──
const equipmentTypes = [
  { id: 'T001', typeCode: 'T001', typeName: '非标设备', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T001-1', typeCode: 'T001-1', typeName: '自动化工作站', categoryCode: 'T001', categoryName: '非标设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T001-2', typeCode: 'T001-2', typeName: '自动化线体', categoryCode: 'T001', categoryName: '非标设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T001-3', typeCode: 'T001-3', typeName: '半自动设备', categoryCode: 'T001', categoryName: '非标设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T002', typeCode: 'T002', typeName: '工具类设备', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T003', typeCode: 'T003', typeName: '加工类设备', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T004', typeCode: 'T004', typeName: '测试仪器', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T005', typeCode: 'T005', typeName: '数控设备', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T005-1', typeCode: 'T005-1', typeName: '铣削CNC', categoryCode: 'T005', categoryName: '数控设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T005-2', typeCode: 'T005-2', typeName: '车铣磨CNC', categoryCode: 'T005', categoryName: '数控设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T005-3', typeCode: 'T005-3', typeName: '车削NC', categoryCode: 'T005', categoryName: '数控设备', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'T006', typeCode: 'T006', typeName: '注塑设备', categoryCode: '', categoryName: '', createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
]

// ── 设备类别完整数据 ──
const equipmentCategories = [
  { id: 'C001', categoryCode: 'C001', categoryName: '重点设备', sortNo: 1, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C002', categoryCode: 'C002', categoryName: '关键设备', sortNo: 2, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C003', categoryCode: 'C003', categoryName: '标品设备', sortNo: 3, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C004', categoryCode: 'C004', categoryName: '安全设施', sortNo: 4, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C005', categoryCode: 'C005', categoryName: '特种设备', sortNo: 5, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C006', categoryCode: 'C006', categoryName: '关键装置', sortNo: 6, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
  { id: 'C007', categoryCode: 'C007', categoryName: '手持电动工具', sortNo: 7, createByName: '系统', createTime: '2025-01-01 00:00:00', updateByName: '', updateTime: '' },
]

// ── 供应商完整数据 ──
const suppliers = [
  { id: 'S001', supplierSn: 'S001', supplierName: '华诚精密', supplierCategory: '1', supplierCert: '91330000XXXX', supplierGoods: '1', supplierStatus: '1', contacts: '张三', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S004', supplierSn: 'S004', supplierName: '自研（自动化团队）', supplierCategory: '2', supplierCert: '', supplierGoods: '2', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S009', supplierSn: 'S009', supplierName: '乔峰', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S010', supplierSn: 'S010', supplierName: '台群', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S011', supplierSn: 'S011', supplierName: '哈斯', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S012', supplierSn: 'S012', supplierName: '华中', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S013', supplierSn: 'S013', supplierName: '广数', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S014', supplierSn: 'S014', supplierName: '锐锋', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S015', supplierSn: 'S015', supplierName: '海天国际', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
  { id: 'S016', supplierSn: 'S016', supplierName: '快克智能', supplierCategory: '1', supplierCert: '', supplierGoods: '1', supplierStatus: '1', contacts: '', contactsPhone: '', createTime: '2025-01-01 00:00:00' },
]

// ── 供应商枚举 ──
const supplierCategoryEnum = [{ value: '1', text: '设备供应商' }, { value: '2', text: '内部' }]
const supplierGoodsEnum = [{ value: '1', text: '生产设备' }, { value: '2', text: '非标设备' }]
const supplierStatusEnum = [{ value: '1', text: '启用', type: 'success' }, { value: '2', text: '停用', type: 'danger' }]

// ── 设备列表（用于选择弹窗，简化字段） ──
const deviceSelectorData = [
  // C端
  { id: 'C01', equipmentSn: 'EW-LP-001', equipmentName: '轻型手动压机', equipmentMode: 'LP-50', equipmentTypeDesc: '加工类设备', equipmentSupplierName: '华诚精密', workshopCode: 'C' },
  { id: 'C02', equipmentSn: 'EW-TCM-001', equipmentName: '端子机', equipmentMode: 'TCM-200', equipmentTypeDesc: '加工类设备', equipmentSupplierName: '金田铜业', workshopCode: 'C' },
  { id: 'C03', equipmentSn: 'EW-PP-001', equipmentName: '气动压机', equipmentMode: 'PP-100', equipmentTypeDesc: '加工类设备', equipmentSupplierName: '力丰液压', workshopCode: 'C' },
  { id: 'C04', equipmentSn: 'EW-BPIL-001', equipmentName: 'PACK线', equipmentMode: 'BPIL-A1', equipmentTypeDesc: '非标设备', equipmentSupplierName: '自研', workshopCode: 'C' },
  { id: 'C05', equipmentSn: 'EW-CCM-001', equipmentName: '三防漆涂覆机', equipmentMode: 'CCM-3F', equipmentTypeDesc: '非标设备', equipmentSupplierName: '诺信EFD', workshopCode: 'C' },
  // B端
  { id: 'B01', equipmentSn: 'B-20000002', equipmentName: '冷媒检漏仪', equipmentMode: 'GS-H3', equipmentTypeDesc: '测试仪器', equipmentSupplierName: '工艺部', workshopCode: 'B' },
  { id: 'B02', equipmentSn: 'B-20000015', equipmentName: '自动锁螺丝机', equipmentMode: 'ASM-4', equipmentTypeDesc: '加工类设备', equipmentSupplierName: '快克智能', workshopCode: 'B' },
  { id: 'B03', equipmentSn: 'B-20000023', equipmentName: '手动PACK压装机', equipmentMode: 'MP-200', equipmentTypeDesc: '加工类设备', equipmentSupplierName: '华诚精密', workshopCode: 'B' },
  // 数控
  { id: 'N01', equipmentSn: 'A1', equipmentName: 'CNC铣削加工中心', equipmentMode: 'T-7', equipmentTypeDesc: '数控设备', equipmentSupplierName: '乔峰', workshopCode: 'CNC' },
  { id: 'N02', equipmentSn: 'A2', equipmentName: 'CNC铣削加工中心', equipmentMode: 'T-700B', equipmentTypeDesc: '数控设备', equipmentSupplierName: '台群', workshopCode: 'CNC' },
  { id: 'N04', equipmentSn: 'A4', equipmentName: 'CNC铣削加工中心', equipmentMode: 'VF2', equipmentTypeDesc: '数控设备', equipmentSupplierName: '哈斯', workshopCode: 'CNC' },
  { id: 'N07', equipmentSn: 'C1', equipmentName: 'CNC车削中心', equipmentMode: 'C320K TT', equipmentTypeDesc: '数控设备', equipmentSupplierName: '广数', workshopCode: 'CNC' },
  { id: 'N09', equipmentSn: 'INJ-001', equipmentName: '注塑机', equipmentMode: 'MA1200', equipmentTypeDesc: '注塑设备', equipmentSupplierName: '海天国际', workshopCode: 'CNC' },
]

function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter(item => item.workshopCode === ws)
}

export default [
  // ══ 设备类型（覆盖 eam-equipment 中的旧定义） ══
  {
    url: '/admin-api/mdm/eamBaseEquipmentType/list',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: paginate(equipmentTypes, query?.pageNo, query?.pageSize || 50) })
  },
  {
    url: '/admin-api/mdm/eamBaseEquipmentType/allList',
    method: 'get',
    response: () => ({ code: 200, data: equipmentTypes })
  },
  {
    url: '/admin-api/mdm/eamBaseEquipmentType/queryById',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: equipmentTypes.find(t => t.id === query?.id) || equipmentTypes[0] })
  },

  // ══ 设备类别 ══
  {
    url: '/admin-api/mdm/eamBaseEquipmentCategory/list',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: paginate(equipmentCategories, query?.pageNo, query?.pageSize || 50) })
  },
  {
    url: '/admin-api/mdm/eamBaseEquipmentCategory/equipmentCategoryList',
    method: 'get',
    response: () => ({ code: 200, data: equipmentCategories })
  },
  {
    url: '/admin-api/mdm/eamBaseEquipmentCategory/queryById',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: equipmentCategories.find(c => c.id === query?.id) || equipmentCategories[0] })
  },

  // ══ 供应商（覆盖旧定义） ══
  {
    url: '/admin-api/equipment/optSupplier/list',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: paginate(suppliers, query?.pageNo, query?.pageSize) })
  },
  {
    url: '/admin-api/equipment/optSupplier/queryById',
    method: 'get',
    response: ({ query }) => ({ code: 200, data: suppliers.find(s => s.id === query?.id) || suppliers[0] })
  },
  // 供应商枚举
  { url: '/admin-api/equipment/optSupplier/listOfCategory', method: 'get', response: () => ({ code: 200, data: supplierCategoryEnum }) },
  { url: '/admin-api/equipment/optSupplier/listOfGoods', method: 'get', response: () => ({ code: 200, data: supplierGoodsEnum }) },
  { url: '/admin-api/equipment/optSupplier/listOfStatus', method: 'get', response: () => ({ code: 200, data: supplierStatusEnum }) },

  // ══ 设备选择弹窗（多个模块复用） ══
  // 保养计划的设备选择
  {
    url: '/admin-api/workOrder/eamMaintenancePlan/pageListByResourcesTree',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(deviceSelectorData, ws)
      if (query?.equipmentSn) data = data.filter(d => d.equipmentSn.includes(query.equipmentSn))
      if (query?.equipmentName) data = data.filter(d => d.equipmentName.includes(query.equipmentName))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },
  // 点检计划的设备选择
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlan/pageListByResourcesTree',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(deviceSelectorData, ws)
      if (query?.equipmentSn) data = data.filter(d => d.equipmentSn.includes(query.equipmentSn))
      if (query?.equipmentName) data = data.filter(d => d.equipmentName.includes(query.equipmentName))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },

  // ══════════════════════════════════════
  // 保养计划 - 设备子表（有状态，支持增删）
  // ══════════════════════════════════════
  {
    url: '/admin-api/workOrder/eamMaintenancePlanEquipment/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const pc = query?.planCode || '_default'
      const defaults = filterByWorkshop(deviceSelectorData, ws).slice(0, 3).map((d, i) => ({
        id: 'MPE-' + d.id, equipmentSn: d.equipmentSn, equipmentName: d.equipmentName,
        equipmentTypeDesc: d.equipmentTypeDesc, equipmentModel: d.equipmentMode,
        equipmentSupplierName: d.equipmentSupplierName, planCode: pc,
        createByPersonName: '系统', createTime: '2025-01-01'
      }))
      return { code: 200, data: paginate(getPlanDevices(pc, defaults), query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/workOrder/eamMaintenancePlanEquipment/add',
    method: 'post',
    response: ({ body }) => {
      const items = Array.isArray(body) ? body : [body]
      items.forEach(item => {
        const pc = item.planCode || '_default'
        if (!planDeviceStore[pc]) planDeviceStore[pc] = []
        planDeviceStore[pc].push({
          id: 'MPE-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          equipmentSn: item.equipmentSn || '', equipmentName: item.equipmentName || '',
          equipmentTypeDesc: item.equipmentTypeDesc || '', equipmentModel: item.equipmentModel || item.equipmentMode || '',
          equipmentSupplierName: item.equipmentSupplierName || '', planCode: pc,
          createByPersonName: '管理员', createTime: new Date().toISOString().slice(0, 10)
        })
      })
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamMaintenancePlanEquipment/delete',
    method: 'delete',
    response: ({ query }) => {
      for (const pc in planDeviceStore) {
        planDeviceStore[pc] = planDeviceStore[pc].filter(d => d.id !== query?.id)
      }
      return { code: 200, data: true }
    }
  },

  // 保养计划 - 保养项子表（有状态）
  {
    url: '/admin-api/workOrder/eamMaintenancePlanItem/list',
    method: 'get',
    response: ({ query }) => {
      const pc = query?.planCode || '_default'
      const defaults = [
        { id: 'MPI01', planCode: pc, maintenancePart: '剪刀部', remark: '普通液态润滑油，每月一次', seq: 1, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'MPI02', planCode: pc, maintenancePart: '工件夹紧部', remark: 'NSK PS-2 润滑脂，每月一次，一次0.5g', seq: 2, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'MPI03', planCode: pc, maintenancePart: 'X/Y/Z轴组件', remark: 'NSK PS-2 润滑脂，每月一次，一次1g', seq: 3, createByPersonName: '系统', createTime: '2025-01-01' },
      ]
      return { code: 200, data: paginate(getPlanItems(pc, defaults), query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/workOrder/eamMaintenancePlanItem/add',
    method: 'post',
    response: ({ body }) => {
      const pc = body?.planCode || '_default'
      if (!planItemStore[pc]) planItemStore[pc] = []
      planItemStore[pc].push({ id: 'MPI-' + Date.now(), ...body, createByPersonName: '管理员', createTime: new Date().toISOString().slice(0, 10) })
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamMaintenancePlanItem/delete',
    method: 'delete',
    response: ({ query }) => {
      for (const pc in planItemStore) { planItemStore[pc] = planItemStore[pc].filter(d => d.id !== query?.id) }
      return { code: 200, data: true }
    }
  },

  // ══════════════════════════════════════
  // 点检计划 - 设备子表（有状态，支持增删）
  // ══════════════════════════════════════
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const pc = query?.planCode || '_default'
      const defaults = filterByWorkshop(deviceSelectorData, ws).slice(0, 4).map(d => ({
        id: 'SPD-' + d.id, equipmentSn: d.equipmentSn, equipmentName: d.equipmentName,
        equipmentTypeDesc: d.equipmentTypeDesc, equipmentModel: d.equipmentMode,
        equipmentSupplierName: d.equipmentSupplierName, planCode: pc,
        createByPersonName: '系统', createTime: '2025-01-01'
      }))
      return { code: 200, data: paginate(getPlanDevices('si_' + pc, defaults), query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/add',
    method: 'post',
    response: ({ body }) => {
      const items = Array.isArray(body) ? body : [body]
      items.forEach(item => {
        const pc = 'si_' + (item.planCode || '_default')
        if (!planDeviceStore[pc]) planDeviceStore[pc] = []
        planDeviceStore[pc].push({
          id: 'SPD-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
          equipmentSn: item.equipmentSn || '', equipmentName: item.equipmentName || '',
          equipmentTypeDesc: item.equipmentTypeDesc || '', equipmentModel: item.equipmentModel || item.equipmentMode || '',
          equipmentSupplierName: item.equipmentSupplierName || '', planCode: item.planCode || '',
          createByPersonName: '管理员', createTime: new Date().toISOString().slice(0, 10)
        })
      })
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/delete',
    method: 'delete',
    response: ({ query }) => {
      for (const pc in planDeviceStore) { planDeviceStore[pc] = planDeviceStore[pc].filter(d => d.id !== query?.id) }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanDevice/deleteBatch',
    method: 'delete',
    response: ({ query }) => {
      const ids = (query?.ids || '').split(',')
      for (const pc in planDeviceStore) { planDeviceStore[pc] = planDeviceStore[pc].filter(d => !ids.includes(d.id)) }
      return { code: 200, data: true }
    }
  },

  // 点检计划 - 检查项子表（有状态）
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanItem/list',
    method: 'get',
    response: ({ query }) => {
      const pc = query?.planCode || '_default'
      const defaults = [
        { id: 'SPI01', planCode: pc, itemName: '清理机台灰尘、杂物及油污，保持整洁', itemType: '1', needTypeText: '定性', normal: '', abnormal: '', max: '', min: '', defaultValue: '', unitName: '', sort: 1, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'SPI02', planCode: pc, itemName: '各功能按钮/急停开关是否能正常工作', itemType: '1', needTypeText: '定性', normal: '', abnormal: '', max: '', min: '', defaultValue: '', unitName: '', sort: 2, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'SPI03', planCode: pc, itemName: '供气气压在标准值', itemType: '2', needTypeText: '定量', normal: '0.6', abnormal: '', max: '0.7', min: '0.5', defaultValue: '0.6', unitName: 'MP', sort: 3, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'SPI04', planCode: pc, itemName: '运行平稳、无异常振动、异响', itemType: '1', needTypeText: '定性', normal: '', abnormal: '', max: '', min: '', defaultValue: '', unitName: '', sort: 4, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'SPI05', planCode: pc, itemName: '管路无老化、龟裂，各接头无漏气', itemType: '1', needTypeText: '定性', normal: '', abnormal: '', max: '', min: '', defaultValue: '', unitName: '', sort: 5, createByPersonName: '系统', createTime: '2025-01-01' },
        { id: 'SPI06', planCode: pc, itemName: '安全门打开能正常中止设备', itemType: '1', needTypeText: '定性', normal: '', abnormal: '', max: '', min: '', defaultValue: '', unitName: '', sort: 6, createByPersonName: '系统', createTime: '2025-01-01' },
      ]
      return { code: 200, data: paginate(getPlanItems('si_' + pc, defaults), query?.pageNo, query?.pageSize) }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanItem/add',
    method: 'post',
    response: ({ body }) => {
      const pc = 'si_' + (body?.planCode || '_default')
      if (!planItemStore[pc]) planItemStore[pc] = []
      planItemStore[pc].push({ id: 'SPI-' + Date.now(), ...body, createByPersonName: '管理员', createTime: new Date().toISOString().slice(0, 10) })
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanItem/delete',
    method: 'delete',
    response: ({ query }) => {
      for (const pc in planItemStore) { planItemStore[pc] = planItemStore[pc].filter(d => d.id !== query?.id) }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/workOrder/eamSpotInspectionPlanItem/deleteBatch',
    method: 'delete',
    response: ({ query }) => {
      const ids = (query?.ids || '').split(',')
      for (const pc in planItemStore) { planItemStore[pc] = planItemStore[pc].filter(d => !ids.includes(d.id)) }
      return { code: 200, data: true }
    }
  },

  // ══ 保养工单子表（保养项明细） ══
  {
    url: '/admin-api/workOrder/eamMaintenanceWork/itemList',
    method: 'get',
    response: ({ query }) => ({
      code: 200,
      data: paginate([
        { id: 'MI01', workCode: query?.workCode || '', maintenancePart: '剪刀部', remark: '普通液态润滑油，每月一次，一次一滴', status: '1', dealRemark: '已完成', seq: 1, createByPersonName: '系统', createTime: '2026-04-01' },
        { id: 'MI02', workCode: query?.workCode || '', maintenancePart: '工件夹紧部', remark: 'NSK PS-2 润滑脂，每月一次，一次0.5g', status: '1', dealRemark: '已完成', seq: 2, createByPersonName: '系统', createTime: '2026-04-01' },
        { id: 'MI03', workCode: query?.workCode || '', maintenancePart: 'X/Y/Z轴组件', remark: 'NSK PS-2 润滑脂，每月一次，一次1g', status: '1', dealRemark: '已完成', seq: 3, createByPersonName: '系统', createTime: '2026-04-01' },
        { id: 'MI04', workCode: query?.workCode || '', maintenancePart: '张力器清洁羊毛轮', remark: '更换频率，每月一次', status: '2', dealRemark: '', seq: 4, createByPersonName: '系统', createTime: '2026-04-01' },
      ], query?.pageNo, query?.pageSize)
    })
  },

  // ══ 点检工单子表（设备列表） ══
  {
    url: '/admin-api/workOrder/eamSpotInspectionWork/workStandardList',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let data = filterByWorkshop(deviceSelectorData, ws).map((d, i) => ({
        ...d,
        id: 'WS-' + d.id,
        workCode: query?.workCode || '',
        status: i < 3 ? '3' : '1',
        abnormalNum: 0,
        deviceSn: d.equipmentSn,
        deviceName: d.equipmentName,
        deviceMode: d.equipmentMode,
        startTime: '2026-04-15 08:05',
        endTime: i < 3 ? '2026-04-15 08:15' : '',
        personName: '陆钟',
        skipReason: '',
        skipPersonName: '',
      }))
      return { code: 200, data: paginate(data, query?.pageNo, query?.pageSize) }
    }
  },

  // ══ 点检工单子表（点检项明细） ══
  {
    url: '/admin-api/workOrder/eamSpotInspectionWork/workStandardItemList',
    method: 'get',
    response: () => ({
      code: 200,
      data: [
        { id: 'WSI01', itemName: '清理机台灰尘、杂物及油污，保持整洁', itemType: '1', checkRecord: '√', checkResult: '1', sort: 1 },
        { id: 'WSI02', itemName: '各功能按钮是否能正常工作，急停开关是否能准确停止设备', itemType: '1', checkRecord: '√', checkResult: '1', sort: 2 },
        { id: 'WSI03', itemName: '供气气压在标准值（0.6MP）', itemType: '2', needTypeText: '参数', normal: '0.6', min: '0.5', max: '0.7', unitName: 'MP', checkRecord: '0.6', checkResult: '1', sort: 3 },
        { id: 'WSI04', itemName: '运行平稳、无异常振动、异响。各轴限位开关功能正常', itemType: '1', checkRecord: '√', checkResult: '1', sort: 4 },
        { id: 'WSI05', itemName: '管路无老化、龟裂，各接头无漏气现象', itemType: '1', checkRecord: '√', checkResult: '1', sort: 5 },
        { id: 'WSI06', itemName: '安全门打开能正常中止设备', itemType: '1', checkRecord: '√', checkResult: '1', sort: 6 },
      ]
    })
  },

]
