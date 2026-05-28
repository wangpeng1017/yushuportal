/**
 * Mock: 设备基础数据字典（5 个新字典）
 * - 设备状态字典 equipment-status
 * - 故障代码字典 fault-code
 * - 维保类型字典 maintenance-type
 * - 点检项库 spot-inspection-item
 * - 计量单位字典 unit-dict
 */
import type { MockMethod } from 'vite-plugin-mock'

type DictItem = {
  id: string
  code: string
  name: string
  category?: string
  level?: string
  unit?: string
  description?: string
  sort: number
  enabled: boolean
  remark?: string
  createTime: string
}

// ============ 5 套字典初始数据 ============
const equipmentStatusList: DictItem[] = [
  { id: 'ES001', code: 'IN_USE', name: '在用', sort: 1, enabled: true, remark: '正常生产中的设备', createTime: '2026-01-01 09:00:00' },
  { id: 'ES002', code: 'STANDBY', name: '备用', sort: 2, enabled: true, remark: '可用但未投产', createTime: '2026-01-01 09:00:00' },
  { id: 'ES003', code: 'STOPPED', name: '停用', sort: 3, enabled: true, remark: '临时停用，待恢复', createTime: '2026-01-01 09:00:00' },
  { id: 'ES004', code: 'MAINTAIN', name: '维修中', sort: 4, enabled: true, remark: '故障维修中', createTime: '2026-01-01 09:00:00' },
  { id: 'ES005', code: 'PLANNING', name: '规划中', sort: 5, enabled: true, remark: '非标设备规划阶段', createTime: '2026-01-01 09:00:00' },
  { id: 'ES006', code: 'TRANSFER', name: '调拨中', sort: 6, enabled: true, remark: '跨车间调拨中', createTime: '2026-01-01 09:00:00' },
  { id: 'ES007', code: 'SCRAPPED', name: '已报废', sort: 7, enabled: true, remark: '资产已注销', createTime: '2026-01-01 09:00:00' },
]

const faultCodeList: DictItem[] = [
  { id: 'FC001', code: 'F-MECH-001', name: '机械-传动卡死', category: '机械故障', level: '严重', sort: 1, enabled: true, description: '皮带、链条或轴承卡死无法转动', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC002', code: 'F-MECH-002', name: '机械-异响异振', category: '机械故障', level: '一般', sort: 2, enabled: true, description: '设备运行中出现非正常声音或振动', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC003', code: 'F-ELEC-001', name: '电气-跳闸', category: '电气故障', level: '严重', sort: 3, enabled: true, description: '主电源或控制回路跳闸', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC004', code: 'F-ELEC-002', name: '电气-接触不良', category: '电气故障', level: '一般', sort: 4, enabled: true, description: '继电器、接触器、端子接触不良', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC005', code: 'F-PNEU-001', name: '气动-气压不足', category: '气动故障', level: '一般', sort: 5, enabled: true, description: '主管气压低于工作压力', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC006', code: 'F-PNEU-002', name: '气动-气缸卡死', category: '气动故障', level: '严重', sort: 6, enabled: true, description: '气缸活塞无法运动', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC007', code: 'F-CTRL-001', name: '控制-PLC 死机', category: '控制故障', level: '紧急', sort: 7, enabled: true, description: 'PLC 无响应需重启', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC008', code: 'F-CTRL-002', name: '控制-传感器异常', category: '控制故障', level: '一般', sort: 8, enabled: true, description: '光电/接近开关误触发', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC009', code: 'F-HYDR-001', name: '液压-油温过高', category: '液压故障', level: '一般', sort: 9, enabled: true, description: '液压油温度超过 60℃', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC010', code: 'F-HYDR-002', name: '液压-渗油漏油', category: '液压故障', level: '一般', sort: 10, enabled: true, description: '液压管路或油缸渗漏', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC011', code: 'F-PROC-001', name: '工艺-精度超差', category: '工艺故障', level: '严重', sort: 11, enabled: true, description: '加工精度超出公差范围', remark: '', createTime: '2026-01-15 10:00:00' },
  { id: 'FC012', code: 'F-PROC-002', name: '工艺-表面缺陷', category: '工艺故障', level: '一般', sort: 12, enabled: true, description: '产品表面出现划痕、毛刺等', remark: '', createTime: '2026-01-15 10:00:00' },
]

const maintenanceTypeList: DictItem[] = [
  { id: 'MT001', code: 'PM-DAILY', name: '日保养', category: '一级保养', sort: 1, enabled: true, description: '操作工每班次执行', remark: '清洁、加油、紧固', createTime: '2026-01-01 09:00:00' },
  { id: 'MT002', code: 'PM-WEEKLY', name: '周保养', category: '一级保养', sort: 2, enabled: true, description: '每周执行一次', remark: '设备班组负责', createTime: '2026-01-01 09:00:00' },
  { id: 'MT003', code: 'PM-MONTHLY', name: '月度保养', category: '二级保养', sort: 3, enabled: true, description: '每月一次综合检查', remark: '设备员+操作工联合', createTime: '2026-01-01 09:00:00' },
  { id: 'MT004', code: 'PM-QUARTER', name: '季度保养', category: '二级保养', sort: 4, enabled: true, description: '每季度一次深度保养', remark: '需停机', createTime: '2026-01-01 09:00:00' },
  { id: 'MT005', code: 'PM-YEAR', name: '年度大修', category: '三级保养', sort: 5, enabled: true, description: '每年一次大修', remark: '可能委外', createTime: '2026-01-01 09:00:00' },
  { id: 'MT006', code: 'PM-SPARE', name: '备品备件更换', category: '专项保养', sort: 6, enabled: true, description: '关键易损件按周期更换', remark: '与备件库存联动', createTime: '2026-01-01 09:00:00' },
  { id: 'MT007', code: 'PM-PREDICT', name: '预测性维护', category: '预测保养', sort: 7, enabled: true, description: 'IoT 数据触发的预测性维护', remark: '需 IoT 配置', createTime: '2026-01-01 09:00:00' },
  { id: 'MT008', code: 'PM-OVERHAUL', name: '大修改造', category: '改造升级', sort: 8, enabled: true, description: '设备性能升级改造', remark: '走立项流程', createTime: '2026-01-01 09:00:00' },
]

const spotInspectionItemList: DictItem[] = [
  { id: 'SI001', code: 'SP-OIL-001', name: '液压油液位', category: '液压系统', sort: 1, enabled: true, description: '液压油标位于 H/L 之间', unit: '目视', remark: '日点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI002', code: 'SP-OIL-002', name: '润滑油液位', category: '润滑系统', sort: 2, enabled: true, description: '润滑油不低于 1/3', unit: '目视', remark: '日点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI003', code: 'SP-AIR-001', name: '气压表读数', category: '气动系统', sort: 3, enabled: true, description: '气压 0.5-0.7 MPa', unit: 'MPa', remark: '日点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI004', code: 'SP-TEMP-001', name: '主电机温度', category: '电气系统', sort: 4, enabled: true, description: '不超过 75℃', unit: '℃', remark: '日点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI005', code: 'SP-VIB-001', name: '主轴振动值', category: '机械系统', sort: 5, enabled: true, description: '振速 ≤ 4.5 mm/s', unit: 'mm/s', remark: '周点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI006', code: 'SP-CLEAN-001', name: '设备清洁度', category: '通用项', sort: 6, enabled: true, description: '无油污、无切屑、无杂物', unit: '目视', remark: '日点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI007', code: 'SP-SAFE-001', name: '急停按钮功能', category: '安全装置', sort: 7, enabled: true, description: '按下后立即停机', unit: '动作测试', remark: '周点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI008', code: 'SP-SAFE-002', name: '安全光幕', category: '安全装置', sort: 8, enabled: true, description: '遮挡后立即停机', unit: '动作测试', remark: '周点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI009', code: 'SP-PREC-001', name: '主轴跳动', category: '精度', sort: 9, enabled: true, description: '径向跳动 ≤ 0.005 mm', unit: 'mm', remark: '月点检', createTime: '2026-01-01 09:00:00' },
  { id: 'SI010', code: 'SP-FILTER-001', name: '过滤器状态', category: '辅助系统', sort: 10, enabled: true, description: '滤芯压差正常', unit: '目视/差压表', remark: '月点检', createTime: '2026-01-01 09:00:00' },
]

const unitDictList: DictItem[] = [
  { id: 'UN001', code: 'PCS', name: '件', category: '数量', sort: 1, enabled: true, remark: '通用计件', createTime: '2026-01-01 09:00:00' },
  { id: 'UN002', code: 'SET', name: '套', category: '数量', sort: 2, enabled: true, remark: '成套设备/治具', createTime: '2026-01-01 09:00:00' },
  { id: 'UN003', code: 'PIECE', name: '把', category: '数量', sort: 3, enabled: true, remark: '刀具/手持工具', createTime: '2026-01-01 09:00:00' },
  { id: 'UN004', code: 'UNIT', name: '台', category: '数量', sort: 4, enabled: true, remark: '设备/机器', createTime: '2026-01-01 09:00:00' },
  { id: 'UN005', code: 'LINE', name: '条', category: '数量', sort: 5, enabled: true, remark: '产线', createTime: '2026-01-01 09:00:00' },
  { id: 'UN006', code: 'KG', name: '千克', category: '重量', sort: 6, enabled: true, remark: '物料/备件', createTime: '2026-01-01 09:00:00' },
  { id: 'UN007', code: 'G', name: '克', category: '重量', sort: 7, enabled: true, remark: '微小物料', createTime: '2026-01-01 09:00:00' },
  { id: 'UN008', code: 'T', name: '吨', category: '重量', sort: 8, enabled: true, remark: '大宗物料', createTime: '2026-01-01 09:00:00' },
  { id: 'UN009', code: 'M', name: '米', category: '长度', sort: 9, enabled: true, remark: '管线/线缆', createTime: '2026-01-01 09:00:00' },
  { id: 'UN010', code: 'MM', name: '毫米', category: '长度', sort: 10, enabled: true, remark: '加工尺寸', createTime: '2026-01-01 09:00:00' },
  { id: 'UN011', code: 'L', name: '升', category: '体积', sort: 11, enabled: true, remark: '油液类', createTime: '2026-01-01 09:00:00' },
  { id: 'UN012', code: 'ML', name: '毫升', category: '体积', sort: 12, enabled: true, remark: '小容量', createTime: '2026-01-01 09:00:00' },
  { id: 'UN013', code: 'H', name: '小时', category: '时间', sort: 13, enabled: true, remark: '运行时长/工时', createTime: '2026-01-01 09:00:00' },
  { id: 'UN014', code: 'MIN', name: '分钟', category: '时间', sort: 14, enabled: true, remark: '短周期', createTime: '2026-01-01 09:00:00' },
]

// ============ 通用 CRUD 工厂 ============
function paginate<T>(arr: T[], page = 1, size = 10) {
  const start = (page - 1) * size
  return { records: arr.slice(start, start + size), total: arr.length }
}
function buildCrud(prefix: string, store: DictItem[]): MockMethod[] {
  const idPrefix = prefix.split('-').map(s => s[0]?.toUpperCase()).join('')
  return [
    {
      url: `/admin-api/eam/base-data/${prefix}/page`,
      method: 'get',
      response: ({ query }) => {
        const page = parseInt(query.pageNo || '1', 10)
        const size = parseInt(query.pageSize || '10', 10)
        let arr = store.slice()
        if (query.code) arr = arr.filter(x => (x.code || '').includes(query.code))
        if (query.name) arr = arr.filter(x => (x.name || '').includes(query.name))
        if (query.category) arr = arr.filter(x => (x.category || '').includes(query.category))
        arr.sort((a, b) => (a.sort || 0) - (b.sort || 0))
        const r = paginate(arr, page, size)
        return { code: 0, msg: '', data: { list: r.records, total: r.total } }
      },
    },
    {
      url: `/admin-api/eam/base-data/${prefix}/get`,
      method: 'get',
      response: ({ query }) => ({ code: 0, msg: '', data: store.find(x => x.id === query.id) || null }),
    },
    {
      url: `/admin-api/eam/base-data/${prefix}/create`,
      method: 'post',
      response: ({ body }) => {
        const id = `${idPrefix}${String(store.length + 1).padStart(3, '0')}`
        const now = new Date().toISOString().replace('T', ' ').slice(0, 19)
        const record: DictItem = {
          id, code: body.code || '', name: body.name || '',
          category: body.category, level: body.level, unit: body.unit, description: body.description,
          sort: body.sort ?? 99, enabled: body.enabled ?? true, remark: body.remark || '', createTime: now,
        }
        store.unshift(record)
        return { code: 0, msg: '', data: id }
      },
    },
    {
      url: `/admin-api/eam/base-data/${prefix}/update`,
      method: 'post',
      response: ({ body }) => {
        const i = store.findIndex(x => x.id === body.id)
        if (i === -1) return { code: 1, msg: '记录不存在' }
        Object.assign(store[i], body)
        return { code: 0, msg: '', data: true }
      },
    },
    {
      url: `/admin-api/eam/base-data/${prefix}/delete`,
      method: 'delete',
      response: ({ query }) => {
        const i = store.findIndex(x => x.id === query.id)
        if (i === -1) return { code: 1, msg: '记录不存在' }
        store.splice(i, 1)
        return { code: 0, msg: '', data: true }
      },
    },
  ]
}

const mocks: MockMethod[] = [
  ...buildCrud('equipment-status', equipmentStatusList),
  ...buildCrud('fault-code', faultCodeList),
  ...buildCrud('maintenance-type', maintenanceTypeList),
  ...buildCrud('spot-inspection-item', spotInspectionItemList),
  ...buildCrud('unit-dict', unitDictList),
]

export default mocks
