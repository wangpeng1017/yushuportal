/**
 * Mock: 登录认证 + 用户权限 + 字典
 * 支持4个预设账号，通过 token 区分车间数据权限
 */


// ── 用户-车间映射（通过token识别） ──
const USER_MAP: Record<string, any> = {
  'c-admin':   { token: 'mock-token-c',   workshopCode: 'C',   workshopName: 'C端车间',    nickname: 'C端管理员' },
  'b-admin':   { token: 'mock-token-b',   workshopCode: 'B',   workshopName: 'B端车间',    nickname: 'B端管理员' },
  'cnc-admin': { token: 'mock-token-cnc', workshopCode: 'CNC', workshopName: '数控机加车间', nickname: '数控机加管理员' },
  'admin':     { token: 'mock-token-all', workshopCode: 'ALL', workshopName: '全部车间',    nickname: '超级管理员' },
  'feishu-approver': { token: 'mock-token-feishu', workshopCode: 'ALL', workshopName: '飞书审批员', nickname: '审批员' },
}

// 通过token反查车间
export function getWorkshopByToken(authorization?: string): string {
  const token = (authorization || '').replace('Bearer ', '')
  for (const u of Object.values(USER_MAP)) {
    if (u.token === token) return u.workshopCode
  }
  return 'ALL'
}

// ── 菜单树（通用，所有角色共享菜单结构） ──
const eamMenus = [
  {
    path: '/eam/equipment',
    name: '设备台账', icon: 'ep:monitor', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'optEquipment', name: '设备档案', icon: 'ep:document', component: 'eam/optEquipment/page', componentName: 'EamOptEquipment', visible: true, keepAlive: true, parentId: 10 },
      { path: 'deviceLedger', name: '设备履历', icon: 'ep:tickets', component: 'eam/deviceLedger/page', componentName: 'EamDeviceLedger', visible: true, keepAlive: true, parentId: 10 },
    ]
  },
  {
    path: '/eam/maintenance',
    name: '保养管理', icon: 'ep:tools', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'maintenanceStandard', name: '保养标准', icon: 'ep:document-copy', component: 'eam/maintenanceStandard/page', componentName: 'EamMaintenanceStandard', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenancePlan', name: '保养计划', icon: 'ep:calendar', component: 'eam/maintenancePlan/page', componentName: 'EamMaintenancePlan', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenanceWorkOrder', name: '保养工单', icon: 'ep:list', component: 'eam/maintenanceWorkOrder/page', componentName: 'EamMaintenanceWorkOrder', visible: true, keepAlive: true, parentId: 20 },
      { path: 'maintenanceWorkRecord', name: '保养记录', icon: 'ep:notebook', component: 'eam/maintenanceWorkRecord/page', componentName: 'EamMaintenanceWorkRecord', visible: true, keepAlive: true, parentId: 20 },
    ]
  },
  {
    path: '/eam/spotInspection',
    name: '设备点检', icon: 'ep:monitor', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'spotInspectionStandard', name: '点检标准', icon: 'ep:document-copy', component: 'eam/spotInspectionStandard/page', componentName: 'EamSpotInspectionStandard', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionPlan', name: '点检计划', icon: 'ep:calendar', component: 'eam/spotInspectionPlan/page', componentName: 'EamSpotInspectionPlan', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionWork', name: '点检工单', icon: 'ep:list', component: 'eam/spotInspectionWork/page', componentName: 'EamSpotInspectionWork', visible: true, keepAlive: true, parentId: 30 },
      { path: 'spotInspectionRecord', name: '点检记录', icon: 'ep:notebook', component: 'eam/spotInspectionRecord/page', componentName: 'EamSpotInspectionRecord', visible: true, keepAlive: true, parentId: 30 },
    ]
  },
  {
    path: '/eam/patrol',
    name: '区域巡检', icon: 'ep:location', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'route', name: '巡检路线', icon: 'ep:guide', component: 'eam/patrol/route/page', componentName: 'EamPatrolRoute', visible: true, keepAlive: true, parentId: 31 },
      { path: 'plan', name: '巡检计划', icon: 'ep:calendar', component: 'eam/patrol/plan/page', componentName: 'EamPatrolPlan', visible: true, keepAlive: true, parentId: 31 },
      { path: 'work', name: '巡检工单', icon: 'ep:list', component: 'eam/patrol/work/page', componentName: 'EamPatrolWork', visible: true, keepAlive: true, parentId: 31 },
      { path: 'record', name: '巡检记录', icon: 'ep:notebook', component: 'eam/patrol/record/page', componentName: 'EamPatrolRecord', visible: true, keepAlive: true, parentId: 31 },
    ]
  },
  {
    path: '/eam/repair',
    name: '维修管理', icon: 'ep:set-up', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'failureWorkOrder', name: '故障报修', icon: 'ep:warning', component: 'eam/failureWorkOrder/page', componentName: 'EamFailureWorkOrder', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairWorkOrder', name: '维修工单', icon: 'ep:list', component: 'eam/repairWorkOrder/page', componentName: 'EamRepairWorkOrder', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairWorkRecord', name: '维修记录', icon: 'ep:notebook', component: 'eam/repairWorkRecord/page', componentName: 'EamRepairWorkRecord', visible: true, keepAlive: true, parentId: 40 },
      { path: 'repairKnowledge', name: '维修知识库', icon: 'ep:reading', component: 'eam/repairKnowledge/page', componentName: 'EamRepairKnowledge', visible: true, keepAlive: true, parentId: 40 },
    ]
  },
  {
    path: '/eam/sparePart',
    name: '备件管理', icon: 'ep:files', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'sparePartSearchList', name: '备件库查询', icon: 'ep:search', component: 'eam/sparePartSearchList/page', componentName: 'EamSparePartSearchList', visible: true, keepAlive: true, parentId: 50 },
      { path: 'sparePartRecordList', name: '备件使用记录', icon: 'ep:notebook', component: 'eam/sparePartRecordList/page', componentName: 'EamSparePartRecordList', visible: true, keepAlive: true, parentId: 50 },
      { path: 'sparePartWarning', name: '安全库存预警', icon: 'ep:warning', component: 'eam/sparePartWarning/page', componentName: 'EamSparePartWarning', visible: true, keepAlive: true, parentId: 50 },
    ]
  },
  {
    path: '/eam/iot',
    name: 'IoT/OEE', icon: 'ep:data-line', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['C', 'CNC', 'ALL'],
    children: [
      { path: 'deviceMonitor', name: '设备运行监控', icon: 'ep:monitor', component: 'eam/deviceMonitor/page', componentName: 'EamDeviceMonitor', visible: true, keepAlive: true, parentId: 70 },
      { path: 'oeeAnalysis', name: 'OEE分析看板', icon: 'ep:trend-charts', component: 'eam/oeeAnalysis/page', componentName: 'EamOeeAnalysis', visible: true, keepAlive: true, parentId: 70 },
    ]
  },
  {
    path: '/eam/tooling',
    name: '生产工器具', icon: 'ep:scissor', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['CNC', 'ALL'],
    children: [
      { path: 'toolingMaster', name: '工器具档案', icon: 'ep:files', component: 'eam/toolingMaster/page', componentName: 'EamToolingMaster', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingInbound', name: '入库管理', icon: 'ep:download', component: 'eam/toolingInbound/page', componentName: 'EamToolingInbound', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingOutbound', name: '出库管理', icon: 'ep:upload', component: 'eam/toolingOutbound/page', componentName: 'EamToolingOutbound', visible: true, keepAlive: true, parentId: 80 },
      { path: 'gaugeBorrowReturn', name: '借用归还', icon: 'ep:refresh', component: 'eam/gaugeBorrowReturn/page', componentName: 'EamGaugeBorrowReturn', visible: true, keepAlive: true, parentId: 80 },
      { path: 'toolingScrap', name: '报废登记', icon: 'ep:delete', component: 'eam/toolingScrap/page', componentName: 'EamToolingScrap', visible: true, keepAlive: true, parentId: 80 },
    ]
  },
  {
    path: '/eam/project',
    name: '非标研制', icon: 'ep:cpu', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['C', 'ALL'],
    children: [
      { path: 'customEquipmentProject', name: '研制项目', icon: 'ep:promotion', component: 'eam/customEquipmentProject/page', componentName: 'EamCustomEquipmentProject', visible: true, keepAlive: true, parentId: 90 },
    ]
  },
  // 采购管理（独立顶级菜单，全端可见）
  {
    path: '/eam/purchase',
    name: '采购管理', icon: 'ep:shopping-cart-full', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'equipmentPurchaseRequest', name: '设备采购', icon: 'ep:shopping-bag', component: 'eam/equipmentPurchaseRequest/page', componentName: 'EamEquipmentPurchaseRequest', visible: true, keepAlive: true, parentId: 95 },
      { path: 'toolPurchaseDemand', name: '工器具采购', icon: 'ep:shopping-cart', component: 'eam/toolPurchaseDemand/page', componentName: 'EamToolPurchaseDemand', visible: true, keepAlive: true, parentId: 95 },
      { path: 'sparePartPurchase', name: '备件采购', icon: 'ep:files', component: 'eam/sparePartPurchase/page', componentName: 'EamSparePartPurchase', visible: true, keepAlive: true, parentId: 95 },
    ]
  },
  // 设备基础数据（统一字典/分类维护，最底部）
  {
    path: '/eam/baseData',
    name: '设备基础数据', icon: 'ep:management', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'equipmentClassTree', name: '设备分类树', icon: 'ep:files', component: 'eam/baseData/equipmentClassTree/page', componentName: 'EamBaseEquipmentClassTree', visible: true, keepAlive: true, parentId: 200 },
      { path: 'equipmentCategory', name: '设备重要等级', icon: 'ep:medal', component: 'eam/equipmentCategory/page', componentName: 'EamEquipmentCategory', visible: true, keepAlive: true, parentId: 200 },
      { path: 'toolCategory', name: '工器具分类树', icon: 'ep:menu', component: 'eam/toolCategory/page', componentName: 'EamToolCategory', visible: true, keepAlive: true, parentId: 200 },
      { path: 'sparePartCategoryTree', name: '备件分类树', icon: 'ep:files', component: 'eam/baseData/sparePartCategoryTree/page', componentName: 'EamBaseSparePartCategoryTree', visible: true, keepAlive: true, parentId: 200 },
      { path: 'equipmentStatus', name: '设备状态字典', icon: 'ep:flag', component: 'eam/baseData/equipmentStatus/page', componentName: 'EamBaseEquipmentStatus', visible: true, keepAlive: true, parentId: 200 },
      { path: 'faultCode', name: '故障代码字典', icon: 'ep:warning-filled', component: 'eam/baseData/faultCode/page', componentName: 'EamBaseFaultCode', visible: true, keepAlive: true, parentId: 200 },
      { path: 'maintenanceType', name: '维保类型字典', icon: 'ep:tools', component: 'eam/baseData/maintenanceType/page', componentName: 'EamBaseMaintenanceType', visible: true, keepAlive: true, parentId: 200 },
      { path: 'spotInspectionItem', name: '点检项库', icon: 'ep:document-checked', component: 'eam/baseData/spotInspectionItem/page', componentName: 'EamBaseSpotInspectionItem', visible: true, keepAlive: true, parentId: 200 },
    ]
  },
  {
    path: '/system',
    name: '系统管理', icon: 'ep:setting', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    plantScope: ['ALL'],
    children: [
      { path: 'plantConfig', name: '端别配置', icon: 'ep:operation', component: 'system/plantConfig/page', componentName: 'SystemPlantConfig', visible: true, keepAlive: true, parentId: 100 },
      { path: 'erpSync', name: 'ERP 同步配置', icon: 'ep:connection', component: 'system/erpSync/page', componentName: 'SystemErpSync', visible: true, keepAlive: true, parentId: 100 },
      { path: 'feishuApproval', name: '飞书审批模拟', icon: 'ep:chat-line-square', component: 'system/feishuApproval/page', componentName: 'SystemFeishuApproval', visible: true, keepAlive: true, parentId: 100 },
    ]
  },
  // 移动端入口（最底部，PC 投屏演示用）
  {
    path: '/mobile',
    name: '移动端', icon: 'ep:cellphone', component: '#',
    visible: true, keepAlive: true, alwaysShow: true, parentId: 0,
    children: [
      { path: 'dashboard', name: '手机演示', icon: 'ep:iphone', component: 'mobile/dashboard/page', componentName: 'MobileDashboard', visible: true, keepAlive: true, parentId: 300 },
    ]
  }
]

// 根据车间过滤菜单
function filterMenusByPlant(menus: any[], plantCode: string) {
  return menus
    .filter(m => !m.plantScope || m.plantScope.includes(plantCode))
    .map(m => ({
      ...m,
      children: m.children ? filterMenusByPlant(m.children, plantCode) : undefined
    }))
}

export default [
  // ── 登录（根据用户名返回不同token） ──
  {
    url: '/admin-api/system/auth/login',
    method: 'post',
    response: ({ body }) => {
      const username = body?.username || body?.loginName || 'admin'
      const user = USER_MAP[username] || USER_MAP['admin']
      return {
        code: 200,
        data: {
          accessToken: user.token,
          refreshToken: 'mock-refresh-' + user.workshopCode,
          expiresTime: Date.now() + 24 * 60 * 60 * 1000,
          userId: 1
        }
      }
    }
  },
  {
    url: '/admin-api/system/auth/loginByUsername',
    method: 'post',
    response: ({ body }) => {
      const username = body?.username || body?.loginName || 'admin'
      const user = USER_MAP[username] || USER_MAP['admin']
      return {
        code: 200,
        data: {
          accessToken: user.token,
          refreshToken: 'mock-refresh-' + user.workshopCode,
          expiresTime: Date.now() + 24 * 60 * 60 * 1000,
          userId: 1
        }
      }
    }
  },
  // ── 获取权限（根据token返回对应车间的用户信息） ──
  {
    url: '/admin-api/system/auth/get-permission-info',
    method: 'get',
    response: ({ headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      const user = Object.values(USER_MAP).find(u => u.workshopCode === ws) || USER_MAP['admin']
      return {
        code: 200,
        data: {
          permissions: ['*:*:*'],
          roles: ['admin'],
          user: {
            id: 1,
            avatar: '',
            nickname: user.nickname + '（' + user.workshopName + '）',
            deptId: 100,
            plantCode: ws,
            workshopName: user.workshopName
          },
          menus: filterMenusByPlant(eamMenus, ws)
        }
      }
    }
  },
  { url: '/admin-api/system/auth/logout', method: 'post', response: () => ({ code: 200, data: true }) },
  { url: '/admin-api/system/dict-data/simple-list', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/dict-data/list-all-simple', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/tenant/get-id-by-name', method: 'get', response: () => ({ code: 200, data: 1 }) },

  // ── 部门简洁列表（派工对话框等场景用） ──
  {
    url: '/admin-api/system/dept/simple-list',
    method: 'get',
    response: () => ({
      code: 200,
      data: [
        { id: 100, name: '宇树科技', parentId: 0 },
        { id: 110, name: '设备部', parentId: 100 },
        { id: 111, name: 'C端设备组', parentId: 110 },
        { id: 112, name: 'B端设备组', parentId: 110 },
        { id: 113, name: '数控设备组', parentId: 110 },
        { id: 120, name: '生产部', parentId: 100 },
        { id: 121, name: 'C端生产线', parentId: 120 },
        { id: 122, name: 'B端生产线', parentId: 120 },
        { id: 123, name: '数控加工车间', parentId: 120 },
        { id: 124, name: '注塑车间', parentId: 120 },
        { id: 130, name: '工艺部', parentId: 100 },
        { id: 140, name: '质量部', parentId: 100 },
      ]
    })
  },
  // ── 用户分页（派工对话框人员列表） ──
  {
    url: '/admin-api/system/user/page',
    method: 'get',
    response: ({ query }: any) => {
      const mkUser = (id: number, username: string, nickname: string, deptId: number, deptName: string, mobile: string, sex: number, remark: string) =>
        ({ id, username, nickname, deptId, deptName, dept: { id: deptId, name: deptName }, mobile, sex, status: 0, remark })
      const allUsers = [
        // C 端设备组
        mkUser(101, 'lu_zhong', '陆钟', 111, 'C端设备组', '138****0001', 1, 'C端设备组长，绕线机/压机维保'),
        mkUser(102, 'li_wei', '李伟', 111, 'C端设备组', '138****0002', 1, 'C端设备员，PACK 线维保'),
        mkUser(103, 'zhang_ming', '张明', 111, 'C端设备组', '138****0003', 1, 'C端设备员，三防漆涂覆机维保'),
        mkUser(104, 'liu_pengpeng', '刘朋朋', 111, 'C端设备组', '138****0004', 1, 'C端设备员'),
        // B 端设备组
        mkUser(111, 'mai_pan', '买盼', 112, 'B端设备组', '138****0011', 1, 'B端设备组长，锁螺丝机/焊接机维保'),
        mkUser(112, 'yan_huanhuan', '严欢欢', 112, 'B端设备组', '138****0012', 0, 'B端设备员'),
        mkUser(113, 'gao_xuecai', '高学才', 112, 'B端设备组', '138****0013', 1, 'B端设备主管'),
        // 数控设备组
        mkUser(121, 'gang_jiacheng', '刚嘉成', 113, '数控设备组', '138****0021', 1, '数控设备组长，CNC/注塑机维保'),
        mkUser(122, 'peng_xiang', '彭向', 113, '数控设备组', '138****0022', 1, '数控设备员，注塑机专项'),
        mkUser(123, 'chen_shuang', '陈爽', 113, '数控设备组', '138****0023', 0, '数控设备员，CNC 主轴专项'),
        mkUser(124, 'wang_zugzhang', '王组长', 113, '数控设备组', '138****0024', 1, '数控车间班组长'),
        mkUser(125, 'li_zugzhang', '李组长', 113, '数控设备组', '138****0025', 1, '数控车间班组长'),
        mkUser(126, 'zhang_zugzhang', '张组长', 113, '数控设备组', '138****0026', 1, '数控车间班组长'),
        // 设备主管 / 部门负责人 / 财务
        mkUser(201, 'li_buzhang', '李部长', 110, '设备部', '139****0001', 1, '设备部负责人（飞书审批）'),
        mkUser(202, 'chen_zhuguan', '陈主管', 110, '设备部', '139****0002', 1, '设备主管（飞书审批）'),
        mkUser(203, 'zhao_kuaiji', '赵会计', 100, '宇树科技', '139****0003', 0, '财务（预算审批）'),
      ]
      const pageNo = parseInt(query?.pageNo || '1', 10)
      const pageSize = parseInt(query?.pageSize || '10', 10)
      let list = allUsers.slice()
      if (query?.deptId) {
        const d = parseInt(query.deptId, 10)
        list = list.filter(u => u.deptId === d)
      }
      if (query?.nickname) list = list.filter(u => u.nickname.includes(query.nickname))
      if (query?.username) list = list.filter(u => u.username.includes(query.username))
      const total = list.length
      const start = (pageNo - 1) * pageSize
      return { code: 200, data: { list: list.slice(start, start + pageSize), total } }
    }
  },
]
