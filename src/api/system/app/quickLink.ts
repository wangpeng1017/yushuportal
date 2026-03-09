import request from '@/config/axios'

export interface AppQuickLinkVO {
  id: number
  appId: number
  appCode: string
  linkName: string
  linkMenuId: number
  linkIcon: string
  linkRouter: string
  appRedirectUri?: string
  internal?: boolean
  creator: string
  createTime: Date
  updater: string
  updateTime: Date
  deleted: boolean
  tenantId: number
}

// 查询应用快捷链接的列表
export const getAppQuickLinkPage = (params: PageParam) => {
  return request.get({ url: '/system/app-quick-link/page', params })
}

// 查询应用快捷链接的列表
export const getAppQuickLinkList = (params: PageParam) => {
  return request.get({ url: '/system/app-quick-link/list', params })
}

export const getAppQuickLinkListForApp = (params: PageParam) => {
  return request.get({ url: '/system/app-quick-link/list-for-app', params })
}

// 查询应用快捷链接的详情
export const getAppQuickLink = (id: number) => {
  return request.get({ url: '/system/app-quick-link/get?id=' + id })
}

// 新增应用快捷链接
export const createAppQuickLink = (data: AppQuickLinkVO) => {
  return request.post({ url: '/system/app-quick-link/create', data })
}

// 修改应用快捷链接
export const updateAppQuickLink = (data: AppQuickLinkVO) => {
  return request.put({ url: '/system/app-quick-link/update', data })
}

// 删除应用快捷链接
export const deleteAppQuickLink = (id: number) => {
  return request.delete({ url: '/system/app-quick-link/delete?id=' + id })
}

// 批量删除应用快捷链接
export const deleteAppQuickLinkList = (ids: number[]) => {
  return request.delete({ url: '/system/app-quick-link/delete-list', params: { ids: ids.join(',') } })
}