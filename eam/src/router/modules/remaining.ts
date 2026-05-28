import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()
const remainingRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    name: 'Home',
    meta: {
      noTagsView: true,
      hidden: true
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/eam/optEquipment/page.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/views/system/notify/my/index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    name: 'dict',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'type/data/:dictType',
        component: () => import('@/views/system/dict/data/index.vue'),
        name: 'SystemDictData',
        meta: {
          title: '字典数据',
          noCache: true,
          hidden: true,
          canTo: true,
          icon: '',
          activeMenu: '/system/dict'
        }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    name: 'JobL',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'job-log',
        component: () => import('@/views/infra/job/logger/index.vue'),
        name: 'InfraJobLog',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          icon: 'ep:edit',
          title: '调度日志',
          activeMenu: 'infra/job/index'
        }
      }
    ]
  },
  {
    path: '/h5/eam',
    component: () => import('@/views/mobile/dashboard/page.vue'),
    name: 'H5EamDashboard',
    meta: {
      hidden: true,
      title: '设备管理平台',
      noTagsView: true,
      noCache: true
    }
  },
  // === 移动 H5 路由组（PDA 扫码场景） ===
  {
    path: '/m',
    redirect: '/m/login',
    meta: { hidden: true, noTagsView: true }
  },
  {
    path: '/m/login',
    component: () => import('@/views/mobile/login.vue'),
    name: 'MobileLogin',
    meta: { hidden: true, noTagsView: true, public: true }
  },
  {
    path: '/m/equipment/detail',
    component: () => import('@/views/mobile/equipment/detail.vue'),
    name: 'MobileEquipmentDetail',
    meta: { hidden: true, noTagsView: true, public: true }
  },
  {
    path: '/m/equipment/:sn',
    component: () => import('@/views/mobile/equipment/landing.vue'),
    name: 'MobileEquipmentLanding',
    meta: { hidden: true, noTagsView: true, public: true }
  },
  {
    path: '/m/maintenance/list',
    component: () => import('@/views/mobile/maintenance/list.vue'),
    name: 'MobileMaintenanceList',
    meta: { hidden: true, noTagsView: true }
  },
  {
    path: '/m/spotInspection/list',
    component: () => import('@/views/mobile/spotInspection/list.vue'),
    name: 'MobileSpotInspectionList',
    meta: { hidden: true, noTagsView: true }
  },
  {
    path: '/m/repairOrder/list',
    component: () => import('@/views/mobile/repairOrder/list.vue'),
    name: 'MobileRepairOrderList',
    meta: { hidden: true, noTagsView: true }
  },
  {
    path: '/m/repair/quick',
    component: () => import('@/views/mobile/repairOrder/quick.vue'),
    name: 'MobileRepairQuick',
    meta: { hidden: true, noTagsView: true, title: 'PDA 快速报修' }
  },
  {
    path: '/m/workorder/history',
    component: () => import('@/views/mobile/workorder/history.vue'),
    name: 'MobileWorkorderHistory',
    meta: { hidden: true, noTagsView: true }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/sso',
    component: () => import('@/views/Login/Login.vue'),
    name: 'SSOLogin',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/social-login',
    component: () => import('@/views/Login/SocialLogin.vue'),
    name: 'SocialLogin',
    meta: {
      hidden: true,
      title: t('router.socialLogin'),
      noTagsView: true
    }
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  },
  // 兼容旧链接/书签：/eam/<父菜单>/index → 自动跳到第一个真实子菜单
  { path: '/eam/equipment/index', redirect: '/eam/equipment/optEquipment', meta: { hidden: true } },
  { path: '/eam/maintenance/index', redirect: '/eam/maintenance/maintenanceStandard', meta: { hidden: true } },
  { path: '/eam/inspection/index', redirect: '/eam/inspection/inspectionRoute', meta: { hidden: true } },
  { path: '/eam/repair/index', redirect: '/eam/repair/failureWorkOrder', meta: { hidden: true } },
  { path: '/eam/sparePart/index', redirect: '/eam/sparePart/sparePartSearchList', meta: { hidden: true } },
  { path: '/eam/iot/index', redirect: '/eam/iot/deviceMonitor', meta: { hidden: true } },
  { path: '/eam/tooling/index', redirect: '/eam/tooling/toolingMaster', meta: { hidden: true } },
  { path: '/eam/project/index', redirect: '/eam/project/customEquipmentProject', meta: { hidden: true } },
  {
    path: '/eam/project/customEquipmentProject/flow/:id',
    component: () => import('@/views/eam/customEquipmentProject/flow-detail.vue'),
    name: 'EamCustomEquipmentProjectFlow',
    meta: { hidden: true, title: '项目流程详情', activeMenu: '/eam/project/customEquipmentProject', noCache: false }
  },
  { path: '/eam/purchase/index', redirect: '/eam/purchase/equipmentPurchaseRequest', meta: { hidden: true } },
  { path: '/eam/npi/index', redirect: '/eam/npi/npiOverview', meta: { hidden: true } },
  { path: '/eam/report/index', redirect: '/eam/report/dashboard', meta: { hidden: true } },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/Error/404.vue'),
    name: '',
    meta: {
      title: '404',
      hidden: true,
      breadcrumb: false
    }
  },
  {
    path: '/bpm',
    component: Layout,
    name: 'bpm',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'manager/form/edit',
        component: () => import('@/views/bpm/form/editor/index.vue'),
        name: 'BpmFormEditor',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '设计流程表单',
          activeMenu: '/bpm/manager/form'
        }
      },
      {
        path: 'manager/definition',
        component: () => import('@/views/bpm/model/definition/index.vue'),
        name: 'BpmProcessDefinition',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程定义',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'process-instance/detail',
        component: () => import('@/views/bpm/processInstance/detail/index.vue'),
        name: 'BpmProcessInstanceDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '流程详情',
          activeMenu: '/bpm/task/my'
        },
        props: (route) => ({
          id: route.query.id,
          taskId: route.query.taskId,
          activityId: route.query.activityId
        })
      },
      {
        path: 'process-instance/report',
        component: () => import('@/views/bpm/processInstance/report/index.vue'),
        name: 'BpmProcessInstanceReport',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '数据报表',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'oa/leave/create',
        component: () => import('@/views/bpm/oa/leave/create.vue'),
        name: 'BpmOALeaveCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '发起 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'oa/leave/detail',
        component: () => import('@/views/bpm/oa/leave/detail.vue'),
        name: 'OALeaveDetail',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '查看 OA 请假',
          activeMenu: '/bpm/oa/leave'
        }
      },
      {
        path: 'manager/model/create',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelCreate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '创建流程',
          activeMenu: '/bpm/manager/model'
        }
      },
      {
        path: 'manager/model/:type/:id',
        component: () => import('@/views/bpm/model/form/index.vue'),
        name: 'BpmModelUpdate',
        meta: {
          noCache: true,
          hidden: true,
          canTo: true,
          title: '修改流程',
          activeMenu: '/bpm/manager/model'
        }
      }
    ]
  }
]

export default remainingRouter
