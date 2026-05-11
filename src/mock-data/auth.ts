/**
 * Mock: 登录认证 + 用户信息 + 权限 + 菜单 + 字典
 * 任意账号密码均可登录
 */

const MOCK_TOKEN = 'mock-token-portal-demo'

// ── 菜单：只保留有真实页面对应的菜单项（去掉空页面/重复页面）──
const mk = (id: number, parentId: number, path: string, name: string, icon: string, comp: string, compName: string) => ({
  id, parentId, path, name, icon,
  component: comp, componentName: compName,
  visible: true, keepAlive: true
})

const portalMenus = [
  // 工单管理（仅保留 BPM 任务页）
  {
    id: 1300, parentId: 0, path: '/work-order', name: '工单管理', icon: 'ep:tickets',
    component: '', componentName: 'MockWorkOrder', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(1302, 1300, 'todo', '我的待办', 'ep:bell', 'bpm/task/todo/index', 'MockWorkOrderTodo'),
      mk(1303, 1300, 'done', '我的已办', 'ep:document-checked', 'bpm/task/done/index', 'MockWorkOrderDone')
    ]
  },
  // 系统管理
  {
    id: 1400, parentId: 0, path: '/sys-mgmt', name: '系统管理', icon: 'ep:setting',
    component: '', componentName: 'MockSysMgmt', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(1401, 1400, 'user', '用户管理', 'ep:user', 'system/user/index', 'MockSysUser'),
      mk(1402, 1400, 'role', '角色管理', 'ep:user-filled', 'system/role/index', 'MockSysRole'),
      mk(1403, 1400, 'menu', '菜单管理', 'ep:menu', 'system/menu/index', 'MockSysMenu'),
      mk(1404, 1400, 'dept', '部门管理', 'ep:office-building', 'system/dept/index', 'MockSysDept'),
      mk(1405, 1400, 'dict', '字典管理', 'ep:reading', 'system/dict/index', 'MockSysDict'),
      mk(1406, 1400, 'notice', '通知公告', 'ep:bell', 'system/notice/index', 'MockSysNotice'),
      mk(1407, 1400, 'tenant', '租户管理', 'ep:office-building', 'system/tenant/index', 'MockSysTenant')
    ]
  },
  // 监控中心
  {
    id: 1700, parentId: 0, path: '/monitor', name: '监控中心', icon: 'ep:monitor',
    component: '', componentName: 'MockMonitor', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(1701, 1700, 'server', '服务监控', 'ep:cpu', 'infra/server/index', 'MockMonServer'),
      mk(1702, 1700, 'redis', 'Redis 监控', 'ep:cpu', 'infra/redis/index', 'MockMonRedis'),
      mk(1703, 1700, 'job', '定时任务', 'ep:alarm-clock', 'infra/job/index', 'MockMonJob')
    ]
  },
  // 日志审计
  {
    id: 1800, parentId: 0, path: '/audit', name: '日志审计', icon: 'ep:document-copy',
    component: '', componentName: 'MockAudit', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(1801, 1800, 'login', '登录日志', 'ep:user', 'system/loginlog/index', 'MockAuditLogin'),
      mk(1802, 1800, 'operate', '操作日志', 'ep:document', 'system/operatelog/index', 'MockAuditOperate'),
      mk(1803, 1800, 'access', '接口访问日志', 'ep:link', 'infra/apiAccessLog/index', 'MockAuditAccess'),
      mk(1804, 1800, 'error', '接口错误日志', 'ep:warning', 'infra/apiErrorLog/index', 'MockAuditError')
    ]
  },
  // 文档管理（只剩文件管理 → 直接做成顶级菜单也行，保留分组结构方便扩展）
  {
    id: 1900, parentId: 0, path: '/doc', name: '文档管理', icon: 'ep:document',
    component: '', componentName: 'MockDoc', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(1901, 1900, 'file', '文件管理', 'ep:folder-opened', 'infra/file/index', 'MockDocFile')
    ]
  },
  // 工作流程
  {
    id: 2500, parentId: 0, path: '/workflow', name: '工作流程', icon: 'ep:share',
    component: '', componentName: 'MockWorkflow', visible: true, keepAlive: true, alwaysShow: true,
    children: [
      mk(2501, 2500, 'model', '流程模型', 'ep:data-board', 'bpm/model/index', 'MockWfModel'),
      mk(2502, 2500, 'category', '流程分类', 'ep:files', 'bpm/category/index', 'MockWfCategory'),
      mk(2503, 2500, 'form', '流程表单', 'ep:document', 'bpm/form/index', 'MockWfForm')
    ]
  }
]

export default [
  // ── 登录（任意用户名/密码都可登录） ──
  {
    url: '/admin-api/system/auth/login',
    method: 'post',
    response: () => ({
      code: 200,
      data: {
        userId: 1,
        accessToken: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token',
        expiresTime: Date.now() + 24 * 60 * 60 * 1000
      },
      msg: ''
    })
  },
  {
    url: '/admin-api/system/auth/loginByUsername',
    method: 'post',
    response: () => ({
      code: 200,
      data: {
        userId: 1,
        accessToken: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token',
        expiresTime: Date.now() + 24 * 60 * 60 * 1000
      },
      msg: ''
    })
  },
  {
    url: '/admin-api/system/auth/codeLogin',
    method: 'post',
    response: () => ({
      code: 200,
      data: {
        userId: 1,
        accessToken: MOCK_TOKEN,
        refreshToken: 'mock-refresh-token',
        expiresTime: Date.now() + 24 * 60 * 60 * 1000
      },
      msg: ''
    })
  },
  {
    url: '/admin-api/system/auth/sms-login',
    method: 'post',
    response: () => ({
      code: 200,
      data: { userId: 1, accessToken: MOCK_TOKEN, refreshToken: 'mock-refresh-token', expiresTime: Date.now() + 24 * 60 * 60 * 1000 }
    })
  },
  {
    url: '/admin-api/system/auth/send-sms-code',
    method: 'post',
    response: () => ({ code: 200, data: true })
  },
  {
    url: '/admin-api/system/auth/refresh-token',
    method: 'post',
    response: () => ({
      code: 200,
      data: { accessToken: MOCK_TOKEN, refreshToken: 'mock-refresh-token', expiresTime: Date.now() + 24 * 60 * 60 * 1000 }
    })
  },

  // ── 获取权限 + 用户信息 + 菜单 ──
  {
    url: '/admin-api/system/auth/get-permission-info',
    method: 'get',
    response: () => ({
      code: 200,
      data: {
        permissions: ['*:*:*'],
        roles: ['admin', 'super_admin'],
        user: {
          id: 1,
          avatar: '',
          nickname: '宇树科技',
          username: 'admin',
          deptId: 100,
          email: 'demo@iimake.com'
        },
        menus: portalMenus
      }
    })
  },

  // ── 退出登录 ──
  { url: '/admin-api/system/auth/logout', method: 'post', response: () => ({ code: 200, data: true }) },

  // ── 验证码 ──
  { url: '/admin-api/system/captcha/check', method: 'post', response: () => ({ code: 200, data: { repCode: '0000' } }) },
  { url: '/admin-api/system/captcha/get', method: 'post', response: () => ({ code: 200, data: {} }) },

  // ── 字典 ──
  { url: '/admin-api/system/dict-data/simple-list', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/dict-data/list-all-simple', method: 'get', response: () => ({ code: 200, data: [] }) },
  { url: '/admin-api/system/dict-type/list-all-simple', method: 'get', response: () => ({ code: 200, data: [] }) },

  // ── 租户 ──
  { url: '/admin-api/system/tenant/get-id-by-name', method: 'get', response: () => ({ code: 200, data: 1 }) },
  { url: '/admin-api/system/tenant/get-by-website', method: 'get', response: () => ({ code: 200, data: { id: 1, name: 'Demo 租户' } }) },

  // ── 部门简洁列表 ──
  {
    url: '/admin-api/system/dept/simple-list',
    method: 'get',
    response: () => ({
      code: 200,
      data: [
        { id: 100, name: 'iimake 集团', parentId: 0 },
        { id: 110, name: '研发中心', parentId: 100 },
        { id: 111, name: '前端组', parentId: 110 },
        { id: 112, name: '后端组', parentId: 110 },
        { id: 113, name: '测试组', parentId: 110 },
        { id: 120, name: '产品中心', parentId: 100 },
        { id: 130, name: '运营中心', parentId: 100 }
      ]
    })
  },
  // 部门树
  {
    url: '/admin-api/system/dept/list',
    method: 'get',
    response: () => ({
      code: 200,
      data: [
        { id: 100, name: 'iimake 集团', parentId: 0, status: 0, sort: 1 },
        { id: 110, name: '研发中心', parentId: 100, status: 0, sort: 1 },
        { id: 111, name: '前端组', parentId: 110, status: 0, sort: 1 },
        { id: 112, name: '后端组', parentId: 110, status: 0, sort: 2 },
        { id: 113, name: '测试组', parentId: 110, status: 0, sort: 3 },
        { id: 120, name: '产品中心', parentId: 100, status: 0, sort: 2 },
        { id: 130, name: '运营中心', parentId: 100, status: 0, sort: 3 }
      ]
    })
  },

  // ── 用户分页 ──
  {
    url: '/admin-api/system/user/page',
    method: 'get',
    response: ({ query }) => {
      const mkUser = (id, username, nickname, deptId, deptName, mobile, sex) => ({
        id,
        username,
        nickname,
        deptId,
        deptName,
        dept: { id: deptId, name: deptName },
        mobile,
        sex,
        status: 0,
        createTime: Date.now() - id * 86400000
      })
      const all = [
        mkUser(1, 'admin', '超级管理员', 100, 'iimake 集团', '13800000001', 1),
        mkUser(2, 'zhangsan', '张三', 111, '前端组', '13800000002', 1),
        mkUser(3, 'lisi', '李四', 112, '后端组', '13800000003', 1),
        mkUser(4, 'wangwu', '王五', 113, '测试组', '13800000004', 1),
        mkUser(5, 'zhaoliu', '赵六', 120, '产品中心', '13800000005', 0),
        mkUser(6, 'qianqi', '钱七', 130, '运营中心', '13800000006', 0)
      ]
      const pageNo = parseInt(query?.pageNo || '1', 10)
      const pageSize = parseInt(query?.pageSize || '10', 10)
      const start = (pageNo - 1) * pageSize
      return { code: 200, data: { list: all.slice(start, start + pageSize), total: all.length } }
    }
  },
  { url: '/admin-api/system/user/simple-list', method: 'get', response: () => ({ code: 200, data: [
    { id: 1, nickname: '超级管理员' },
    { id: 2, nickname: '张三' },
    { id: 3, nickname: '李四' }
  ] })},

  // ── 角色简洁 ──
  { url: '/admin-api/system/role/simple-list', method: 'get', response: () => ({ code: 200, data: [
    { id: 1, name: '超级管理员', code: 'super_admin' },
    { id: 2, name: '普通用户', code: 'common' }
  ] })},

  // ── 通知公告 ──
  { url: '/admin-api/system/notice/page', method: 'get', response: () => ({ code: 200, data: { list: [], total: 0 } }) },
  { url: '/admin-api/system/notify-message/get-unread-count', method: 'get', response: () => ({ code: 200, data: 0 }) },
  { url: '/admin-api/system/notify-message/my-page', method: 'get', response: () => ({ code: 200, data: { list: [], total: 0 } }) },

  // ── 个人中心 ──
  {
    url: '/admin-api/system/user/profile/get',
    method: 'get',
    response: () => ({
      code: 200,
      data: {
        id: 1,
        username: 'admin',
        nickname: '宇树科技',
        email: 'demo@iimake.com',
        mobile: '13800000000',
        sex: 1,
        avatar: '',
        loginIp: '127.0.0.1',
        loginDate: Date.now(),
        createTime: Date.now() - 30 * 86400000,
        dept: { id: 100, name: 'iimake 集团' },
        roles: [{ id: 1, name: '超级管理员' }],
        posts: []
      }
    })
  },

  // ── BPM 工作流（最常见接口） ──
  { url: '/admin-api/bpm/task/todo-page', method: 'get', response: () => ({ code: 200, data: { list: [], total: 0 } }) },
  { url: '/admin-api/bpm/task/done-page', method: 'get', response: () => ({ code: 200, data: { list: [], total: 0 } }) },
  { url: '/admin-api/bpm/process-instance/my-page', method: 'get', response: () => ({ code: 200, data: { list: [], total: 0 } }) },
  { url: '/admin-api/bpm/category/list', method: 'get', response: () => ({ code: 200, data: [] }) },

  // ── 文件预签名（避免上传报错） ──
  { url: '/admin-api/infra/file/presigned-url', method: 'get', response: () => ({ code: 200, data: { uploadUrl: '', url: '' } }) }
]
