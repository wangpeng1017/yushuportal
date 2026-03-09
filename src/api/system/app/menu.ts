import request from '@/config/axios'

export interface AppAssignMenuReqVO {
  appId: number
  menuIds: number[]
}

// 赋予应用菜单权限
export const assignAppMenu = async (data: AppAssignMenuReqVO) => {
  return await request.post({ url: '/system/app-menu/assign-client-menu', data })
}

// 根据应用ID获取菜单关联列表
export const getMenuIdListByAppId = async (appId: number) => {
  return await request.get({ url: '/system/app-menu/list-menu-by-app?appId=' + appId })
}