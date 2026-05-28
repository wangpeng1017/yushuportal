// mock/eam-mobile.ts
/**
 * Mock: 移动 H5（设备扫码落地页 + 4 类工单 + 移动登录）
 *
 * ⚠ SYNC NOTICE: 本文件与 src/mock-data/eam-mobile.ts 必须保持数据一致。
 * 修改时请同步更新另一份（差异仅顶部 ts-nocheck/import 和末尾 as 类型断言）。
 */
import type { MockMethod } from 'vite-plugin-mock'

// ── 设备清单（覆盖各种状态） ──
const allDevices = [
  {
    id: 'DEV-001', equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    equipmentTypeDesc: 'CNC 加工中心', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '北京精雕',
    equipmentOperating: '2023-05-01', equipmentPurchase: '2023-04-15',
  },
  {
    id: 'DEV-002', equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    equipmentTypeDesc: 'CNC 车床', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '半自动', equipmentSupplierName: '沈阳机床',
    equipmentOperating: '2023-06-20', equipmentPurchase: '2023-06-01',
  },
  {
    id: 'DEV-003', equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    equipmentTypeDesc: '装配线', workshopName: 'C端车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '宁德时代',
    equipmentOperating: '2024-01-10', equipmentPurchase: '2023-12-15',
  },
  {
    id: 'DEV-004', equipmentSn: 'EQ20240004', equipmentName: '电池分选机',
    equipmentTypeDesc: '检测设备', workshopName: 'C端车间',
    operationStatus: 'STANDBY', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '比亚迪',
    equipmentOperating: '2024-03-12', equipmentPurchase: '2024-02-20',
  },
  {
    id: 'DEV-005', equipmentSn: 'EQ20240005', equipmentName: '涂覆机',
    equipmentTypeDesc: '涂装设备', workshopName: 'C端车间',
    operationStatus: 'FAILURE', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '广汽',
    equipmentOperating: '2024-02-08', equipmentPurchase: '2024-01-25',
  },
  {
    id: 'DEV-006', equipmentSn: 'EQ20240006', equipmentName: '压机',
    equipmentTypeDesc: '冲压设备', workshopName: 'C端车间',
    operationStatus: 'CLOSE', equipmentStatus: 'USING',
    equipmentMode: '半自动', equipmentSupplierName: '海尔',
    equipmentOperating: '2023-09-15', equipmentPurchase: '2023-08-30',
  },
  {
    id: 'DEV-007', equipmentSn: 'EQ20230099', equipmentName: '老式车床（已废弃）',
    equipmentTypeDesc: '老式车床', workshopName: '数控机加车间',
    operationStatus: 'CLOSE', equipmentStatus: 'ABOLISHED',
    equipmentMode: '手动', equipmentSupplierName: '上海机床厂',
    equipmentOperating: '2018-04-10', equipmentPurchase: '2018-03-01',
  },
  {
    id: 'DEV-008', equipmentSn: 'EQ20240008', equipmentName: '激光切割机',
    equipmentTypeDesc: 'CNC 切割', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '大族激光',
    equipmentOperating: '2024-01-20', equipmentPurchase: '2023-12-28',
  },
]

// ── 工单清单（每台设备 2~4 张工单） ──
const allWorkOrders = [
  // 保养工单
  { id: 'WO-M-001', code: 'WB202404010001', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待处理', personName: '张三',
    workStartTime: '2026-04-29 09:00:00', remark: '一级保养',
    createTime: '2026-04-28 10:00:00' },
  { id: 'WO-M-002', code: 'WB202404010002', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'COMPLETED', statusText: '已完成', personName: '李四',
    workStartTime: '2026-04-15 09:00:00', endTime: '2026-04-15 11:30:00',
    remark: '二级保养', createTime: '2026-04-14 10:00:00' },
  { id: 'WO-M-003', code: 'WB202404010003', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    status: 'IN_PROGRESS', statusText: '处理中', personName: '王五',
    workStartTime: '2026-04-28 14:00:00', remark: '日常保养',
    createTime: '2026-04-28 13:00:00' },
  { id: 'WO-M-004', code: 'WB202404010004', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    status: 'PENDING', statusText: '待处理', personName: '赵六',
    workStartTime: '2026-04-30 08:00:00', remark: '周保养',
    createTime: '2026-04-29 09:00:00' },

  // 点巡检工单
  { id: 'WO-I-001', code: 'WI202404010001', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待巡检', personName: '张三',
    workStartTime: '2026-04-29 16:00:00', remark: '日常点检',
    createTime: '2026-04-29 08:00:00' },
  { id: 'WO-I-002', code: 'WI202404010002', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    status: 'COMPLETED', statusText: '已完成', personName: '李四',
    workStartTime: '2026-04-28 16:00:00', endTime: '2026-04-28 16:20:00',
    remark: '日常点检', createTime: '2026-04-28 08:00:00' },
  { id: 'WO-I-003', code: 'WI202404010003', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240008', equipmentName: '激光切割机',
    status: 'PENDING', statusText: '待巡检', personName: '王五',
    workStartTime: '2026-04-29 16:00:00', remark: '日常点检',
    createTime: '2026-04-29 08:00:00' },

  // 维修工单
  { id: 'WO-R-001', code: 'WR202404010001', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240005', equipmentName: '涂覆机',
    status: 'IN_PROGRESS', statusText: '处理中', personName: '维修班-赵',
    workStartTime: '2026-04-29 10:00:00', remark: '加热管温度异常',
    createTime: '2026-04-29 09:30:00' },
  { id: 'WO-R-002', code: 'WR202404010002', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    status: 'COMPLETED', statusText: '已完成', personName: '维修班-钱',
    workStartTime: '2026-04-25 14:00:00', endTime: '2026-04-25 17:00:00',
    remark: '主轴异响处理', createTime: '2026-04-25 13:00:00' },
  { id: 'WO-R-003', code: 'WR202404010003', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待派工', personName: '',
    remark: 'X 轴定位漂移', createTime: '2026-04-29 11:00:00' },
]

// ── 工具函数 ──
function filterByQuery(list: any[], query: any) {
  let result = list
  if (query.equipmentSn) {
    result = result.filter(w => w.equipmentSn === query.equipmentSn)
  }
  if (query.showAll !== '1' && query.showAll !== 1) {
    result = result.filter(w => w.status !== 'COMPLETED')
  }
  return result
}

function paged(list: any[], pageNo?: number, pageSize?: number) {
  const p = pageNo && !Number.isNaN(pageNo) ? pageNo : 1
  const s = pageSize && !Number.isNaN(pageSize) ? pageSize : 20
  const start = (p - 1) * s
  return {
    records: list.slice(start, start + s),
    total: list.length,
  }
}

// ── 接口注册 ──
export default [
  // 设备 by sn
  {
    url: '/admin-api/eam/optEquipment/getBySn',
    method: 'get',
    response: ({ query }: any) => {
      const sn = query.sn
      const device = allDevices.find(d => d.equipmentSn === sn)
      if (!device) {
        return { code: 404, msg: '设备不存在', data: null }
      }
      return { code: 0, msg: 'success', data: device }
    },
  },

  // 保养工单
  {
    url: '/admin-api/mobile/workorder/maintenance/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'MAINT'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 点巡检工单
  {
    url: '/admin-api/mobile/workorder/spotInspection/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'INSP'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 维修工单
  {
    url: '/admin-api/mobile/workorder/repair/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'REPAIR'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 综合历史工单
  {
    url: '/admin-api/mobile/workorder/history/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(allWorkOrders, query)
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 移动登录（demo: 任意用户名密码都通过）
  {
    url: '/admin-api/mobile/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body || {}
      if (!username || !password) {
        return { code: 400, msg: '账号密码不能为空', data: null }
      }
      return {
        code: 0,
        msg: 'success',
        data: {
          token: 'mobile-demo-token-' + Date.now(),
          userId: 'mobile-user-001',
          nickname: username,
          expiresIn: 7 * 24 * 60 * 60,
        },
      }
    },
  },
] as MockMethod[]
