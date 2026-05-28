/**
 * Mock: 巡检路线管理 + 巡检点位管理
 * 三端均匀分布：每端 2 条路线，每条路线 3-5 个点位
 */

import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

// ── 有状态存储 ──
const routePointStore: Record<string, any[]> = {}

function getRoutePoints(routeCode: string, defaults: any[]) {
  if (!routePointStore[routeCode]) routePointStore[routeCode] = [...defaults]
  return routePointStore[routeCode]
}

// ── 基础路线数据：每端 2 条 ──
const allRoutes: any[] = [
  // C 端 2 条
  {
    id: 'R-C-001',
    routeCode: 'CR-C-001',
    routeName: 'PACK 车间日常巡检',
    areaName: 'C端 PACK 车间',
    pointCount: 5,
    remark: 'PACK 车间整线巡视：电控/压机/点胶/测试/急停',
    createByPersonName: '王工',
    createTime: '2026-03-01 08:00:00',
    workshopCode: 'C'
  },
  {
    id: 'R-C-002',
    routeCode: 'CR-C-002',
    routeName: '电机装配线巡检',
    areaName: 'C端电子车间',
    pointCount: 4,
    remark: '电机装配线工位/设备/物料区巡视',
    createByPersonName: '王工',
    createTime: '2026-03-05 09:00:00',
    workshopCode: 'C'
  },
  // B 端 2 条
  {
    id: 'R-B-001',
    routeCode: 'CR-B-001',
    routeName: 'B 端电子车间巡检',
    areaName: 'B端电子车间',
    pointCount: 4,
    remark: '锁螺丝/焊接/测试线巡视',
    createByPersonName: '李工',
    createTime: '2026-03-08 09:00:00',
    workshopCode: 'B'
  },
  {
    id: 'R-B-002',
    routeCode: 'CR-B-002',
    routeName: '来料检验区巡检',
    areaName: 'B端 IQC 区',
    pointCount: 3,
    remark: '来料/IQC/中转仓巡视',
    createByPersonName: '李工',
    createTime: '2026-03-10 09:00:00',
    workshopCode: 'B'
  },
  // CNC 2 条
  {
    id: 'R-N-001',
    routeCode: 'CR-N-001',
    routeName: '数控加工车间巡检',
    areaName: '数控机加车间',
    pointCount: 5,
    remark: 'CNC 铣削/车削/加工中心巡视',
    createByPersonName: '张工',
    createTime: '2026-03-12 10:00:00',
    workshopCode: 'CNC'
  },
  {
    id: 'R-N-002',
    routeCode: 'CR-N-002',
    routeName: '注塑车间巡检',
    areaName: '注塑车间',
    pointCount: 4,
    remark: '注塑机/料斗/模具/水路巡视',
    createByPersonName: '张工',
    createTime: '2026-03-15 10:00:00',
    workshopCode: 'CNC'
  }
]

// ── 各路线默认点位 ──
const defaultPoints: Record<string, any[]> = {
  'CR-C-001': [
    { id: 'PT-C0101', routeCode: 'CR-C-001', pointName: '电控柜 1 号', pointLocation: 'PACK 车间 1F 东侧', checkRequirement: '检查电控柜散热风扇运转、外壳温度（≤45℃）、指示灯状态', sort: 1, createByPersonName: '王工', createTime: '2026-03-01 08:10:00' },
    { id: 'PT-C0102', routeCode: 'CR-C-001', pointName: '压机区', pointLocation: 'PACK 车间 1F 中部', checkRequirement: '检查压机液压油位、压力 0.5-0.7 MPa、安全光栅工作状态', sort: 2, createByPersonName: '王工', createTime: '2026-03-01 08:11:00' },
    { id: 'PT-C0103', routeCode: 'CR-C-001', pointName: '点胶机区', pointLocation: 'PACK 车间 1F 中部', checkRequirement: '检查点胶针头无堵塞、胶筒压力 0.4 MPa、出胶量正常', sort: 3, createByPersonName: '王工', createTime: '2026-03-01 08:12:00' },
    { id: 'PT-C0104', routeCode: 'CR-C-001', pointName: '测试区', pointLocation: 'PACK 车间 1F 西侧', checkRequirement: '检查 DCIR 测试夹具清洁、测试电压 4.2V、报警灯状态', sort: 4, createByPersonName: '王工', createTime: '2026-03-01 08:13:00' },
    { id: 'PT-C0105', routeCode: 'CR-C-001', pointName: '急停按钮区', pointLocation: 'PACK 车间整线', checkRequirement: '检查所有急停按钮（4 处）功能、复位状态、标识清晰', sort: 5, createByPersonName: '王工', createTime: '2026-03-01 08:14:00' }
  ],
  'CR-C-002': [
    { id: 'PT-C0201', routeCode: 'CR-C-002', pointName: '绕线工位', pointLocation: '电子车间 2F 东侧', checkRequirement: '检查绕线机张力 0.3-0.5N、漆包线无损伤、剪刀刃口完好', sort: 1, createByPersonName: '王工', createTime: '2026-03-05 09:10:00' },
    { id: 'PT-C0202', routeCode: 'CR-C-002', pointName: '装配工位', pointLocation: '电子车间 2F 中部', checkRequirement: '检查工位整洁、工装夹具完好、扭矩枪扭矩值符合标准', sort: 2, createByPersonName: '王工', createTime: '2026-03-05 09:11:00' },
    { id: 'PT-C0203', routeCode: 'CR-C-002', pointName: '老化测试区', pointLocation: '电子车间 2F 西侧', checkRequirement: '检查老化柜温度 65℃、电流监控正常、风扇运转', sort: 3, createByPersonName: '王工', createTime: '2026-03-05 09:12:00' },
    { id: 'PT-C0204', routeCode: 'CR-C-002', pointName: '物料中转区', pointLocation: '电子车间 2F 北侧', checkRequirement: '检查物料标识、防潮措施、库位整洁', sort: 4, createByPersonName: '王工', createTime: '2026-03-05 09:13:00' }
  ],
  'CR-B-001': [
    { id: 'PT-B0101', routeCode: 'CR-B-001', pointName: '锁螺丝区', pointLocation: 'B端电子车间 1F 东侧', checkRequirement: '检查自动锁螺丝机扭矩、漏锁报警、批头磨损', sort: 1, createByPersonName: '李工', createTime: '2026-03-08 09:10:00' },
    { id: 'PT-B0102', routeCode: 'CR-B-001', pointName: '焊接区', pointLocation: 'B端电子车间 1F 中部', checkRequirement: '检查焊接机电流、电极头清洁、冷却水流量', sort: 2, createByPersonName: '李工', createTime: '2026-03-08 09:11:00' },
    { id: 'PT-B0103', routeCode: 'CR-B-001', pointName: '检漏测试区', pointLocation: 'B端电子车间 1F 西侧', checkRequirement: '检查冷媒检漏仪灵敏度、密封测试压力 0.3 MPa', sort: 3, createByPersonName: '李工', createTime: '2026-03-08 09:12:00' },
    { id: 'PT-B0104', routeCode: 'CR-B-001', pointName: 'PACK 压装区', pointLocation: 'B端电子车间 1F 西北', checkRequirement: '检查手动压装机压力、行程限位、安全防护', sort: 4, createByPersonName: '李工', createTime: '2026-03-08 09:13:00' }
  ],
  'CR-B-002': [
    { id: 'PT-B0201', routeCode: 'CR-B-002', pointName: '来料接收区', pointLocation: 'IQC 1F 东侧', checkRequirement: '检查来料标识、外包装完好、温湿度记录', sort: 1, createByPersonName: '李工', createTime: '2026-03-10 09:10:00' },
    { id: 'PT-B0202', routeCode: 'CR-B-002', pointName: 'IQC 检验台', pointLocation: 'IQC 1F 中部', checkRequirement: '检查检验仪器校准状态、检验记录、待检物料标识', sort: 2, createByPersonName: '李工', createTime: '2026-03-10 09:11:00' },
    { id: 'PT-B0203', routeCode: 'CR-B-002', pointName: '中转仓', pointLocation: 'IQC 1F 西侧', checkRequirement: '检查仓储环境、防潮措施、库位整洁、合格/不合格分区', sort: 3, createByPersonName: '李工', createTime: '2026-03-10 09:12:00' }
  ],
  'CR-N-001': [
    { id: 'PT-N0101', routeCode: 'CR-N-001', pointName: 'CNC 铣削加工中心 A 区', pointLocation: '数控车间 A 区', checkRequirement: '检查 T-7 主轴温度 ≤ 60℃、油雾器油量、防护门状态', sort: 1, createByPersonName: '张工', createTime: '2026-03-12 10:10:00' },
    { id: 'PT-N0102', routeCode: 'CR-N-001', pointName: 'CNC 铣削加工中心 B 区', pointLocation: '数控车间 B 区', checkRequirement: '检查 T-700B/VF2 切削液浓度 5%、液位、过滤网清洁', sort: 2, createByPersonName: '张工', createTime: '2026-03-12 10:11:00' },
    { id: 'PT-N0103', routeCode: 'CR-N-001', pointName: 'CNC 车削中心区', pointLocation: '数控车间 C 区', checkRequirement: '检查 C320K 刀具磨损、卡盘夹持力、程序版本', sort: 3, createByPersonName: '张工', createTime: '2026-03-12 10:12:00' },
    { id: 'PT-N0104', routeCode: 'CR-N-001', pointName: '冷却液中央站', pointLocation: '数控车间 集中区', checkRequirement: '检查冷却液 PH 6.5-9.0、浓度、过滤系统运行', sort: 4, createByPersonName: '张工', createTime: '2026-03-12 10:13:00' },
    { id: 'PT-N0105', routeCode: 'CR-N-001', pointName: '气源压力站', pointLocation: '数控车间 北侧', checkRequirement: '检查气源压力 0.6 MPa、储气罐排水、空压机温度', sort: 5, createByPersonName: '张工', createTime: '2026-03-12 10:14:00' }
  ],
  'CR-N-002': [
    { id: 'PT-N0201', routeCode: 'CR-N-002', pointName: '注塑机料筒', pointLocation: '注塑车间 主线', checkRequirement: '检查料筒温度区段（设定±2℃）、加热圈电阻', sort: 1, createByPersonName: '张工', createTime: '2026-03-15 10:10:00' },
    { id: 'PT-N0202', routeCode: 'CR-N-002', pointName: '注塑机液压站', pointLocation: '注塑车间 主线', checkRequirement: '检查液压油温 ≤ 50℃、油压 4-6 MPa、滤芯压差', sort: 2, createByPersonName: '张工', createTime: '2026-03-15 10:11:00' },
    { id: 'PT-N0203', routeCode: 'CR-N-002', pointName: '模具冷却水', pointLocation: '注塑车间 模具区', checkRequirement: '检查模具冷却水温 25±5℃、流量、回水温度差 ≤ 8℃', sort: 3, createByPersonName: '张工', createTime: '2026-03-15 10:12:00' },
    { id: 'PT-N0204', routeCode: 'CR-N-002', pointName: '原料区', pointLocation: '注塑车间 物料区', checkRequirement: '检查原料标识、干燥温度、湿度 ≤ 30%', sort: 4, createByPersonName: '张工', createTime: '2026-03-15 10:13:00' }
  ]
}

let pointIdCounter = 1000

export default [
  // ── 路线列表（分页） ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/list',
    method: 'get',
    response: ({ query, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const { routeCode, routeName, areaName, pageNo = 1, pageSize = 10 } = query || {}
      let filtered = allRoutes.filter(r => ws === 'ALL' || r.workshopCode === ws)
      if (routeCode) filtered = filtered.filter(r => r.routeCode.includes(routeCode))
      if (routeName) filtered = filtered.filter(r => r.routeName.includes(routeName))
      if (areaName) filtered = filtered.filter(r => r.areaName.includes(areaName))
      // 同步 pointCount
      filtered = filtered.map(r => ({
        ...r,
        pointCount: getRoutePoints(r.routeCode, defaultPoints[r.routeCode] || []).length
      }))
      return { code: 200, data: paginate(filtered, pageNo, pageSize), msg: 'ok' }
    }
  },
  // ── 路线详情 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/queryById',
    method: 'get',
    response: ({ query }: any) => {
      const { id } = query || {}
      const route = allRoutes.find(r => r.id === id)
      return { code: 200, data: route || null, msg: 'ok' }
    }
  },
  // ── 新增路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/add',
    method: 'post',
    response: ({ body, headers }: any) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const newRoute = {
        ...body,
        id: 'R-NEW-' + Date.now(),
        pointCount: 0,
        createByPersonName: '当前用户',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
        workshopCode: ws === 'ALL' ? 'C' : ws
      }
      allRoutes.push(newRoute)
      routePointStore[newRoute.routeCode] = []
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 编辑路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/edit',
    method: 'put',
    response: ({ body }: any) => {
      const idx = allRoutes.findIndex(r => r.id === body.id)
      if (idx !== -1) Object.assign(allRoutes[idx], body)
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 删除路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/delete',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query || {}
      const idx = allRoutes.findIndex(r => r.id === id)
      if (idx !== -1) {
        const routeCode = allRoutes[idx].routeCode
        allRoutes.splice(idx, 1)
        delete routePointStore[routeCode]
      }
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 批量删除路线 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoute/deleteBatch',
    method: 'delete',
    response: ({ query }: any) => {
      const ids = (query?.ids || '').split(',')
      ids.forEach((id: string) => {
        const idx = allRoutes.findIndex(r => r.id === id)
        if (idx !== -1) {
          const routeCode = allRoutes[idx].routeCode
          allRoutes.splice(idx, 1)
          delete routePointStore[routeCode]
        }
      })
      return { code: 200, data: true, msg: 'ok' }
    }
  },

  // ── 点位列表（分页） ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/list',
    method: 'get',
    response: ({ query }: any) => {
      const { routeCode, pageNo = 1, pageSize = 10 } = query || {}
      if (!routeCode) return { code: 200, data: { records: [], total: 0 }, msg: 'ok' }
      const points = getRoutePoints(routeCode, defaultPoints[routeCode] || [])
      const sorted = [...points].sort((a, b) => (a.sort || 0) - (b.sort || 0))
      return { code: 200, data: paginate(sorted, pageNo, pageSize), msg: 'ok' }
    }
  },
  // ── 新增点位 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/add',
    method: 'post',
    response: ({ body }: any) => {
      const points = getRoutePoints(body.routeCode, defaultPoints[body.routeCode] || [])
      const newPoint = {
        ...body,
        id: 'PT-' + (++pointIdCounter),
        createByPersonName: '当前用户',
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
      points.push(newPoint)
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 删除点位 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/delete',
    method: 'delete',
    response: ({ query }: any) => {
      const { id } = query || {}
      for (const code in routePointStore) {
        const arr = routePointStore[code]
        const idx = arr.findIndex((p: any) => p.id === id)
        if (idx !== -1) {
          arr.splice(idx, 1)
          return { code: 200, data: true, msg: 'ok' }
        }
      }
      // 同时检查 defaults（首次删除前未初始化store）
      for (const code in defaultPoints) {
        const arr = defaultPoints[code]
        const idx = arr.findIndex((p: any) => p.id === id)
        if (idx !== -1) {
          const storeArr = getRoutePoints(code, arr)
          const si = storeArr.findIndex((p: any) => p.id === id)
          if (si !== -1) storeArr.splice(si, 1)
          return { code: 200, data: true, msg: 'ok' }
        }
      }
      return { code: 200, data: true, msg: 'ok' }
    }
  },
  // ── 批量删除点位 ──
  {
    url: '/admin-api/workOrder/eamInspectionRoutePoint/deleteBatch',
    method: 'delete',
    response: ({ query }: any) => {
      const ids = (query?.ids || '').split(',')
      ids.forEach((id: string) => {
        for (const code in routePointStore) {
          const arr = routePointStore[code]
          const idx = arr.findIndex((p: any) => p.id === id)
          if (idx !== -1) arr.splice(idx, 1)
        }
      })
      return { code: 200, data: true, msg: 'ok' }
    }
  }
]
