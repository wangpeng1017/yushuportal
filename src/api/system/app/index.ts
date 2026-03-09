import request from '@/config/axios'

export interface AppVO {
  id: number
  clientId: string
  name: string
  code: string
  logo: string
  description: string
  status: number
  umcInternalFlag: boolean
  redirectUri: string
  defaultFlag: boolean
  creator: string
  createTime: Date
  updater: string
  updateTime: Date
  deleted: boolean
  tenantId: number
}

// 查询应用的列表
export const getAppPage = (params: PageParam) => {
  return request.get({ url: '/system/app/page', params })
}

// 查询应用的列表
export const getAppList = (params: PageParam) => {
  return request.get({ url: '/system/app/list', params })
}

// 查询应用的详情
export const getApp = (id: number) => {
  return request.get({ url: '/system/app/get?id=' + id })
}

// 新增应用
export const createApp = (data: AppVO) => {
  return request.post({ url: '/system/app/create', data })
}

// 修改应用
export const updateApp = (data: AppVO) => {
  return request.put({ url: '/system/app/update', data })
}

// 删除应用
export const deleteApp = (id: number) => {
  return request.delete({ url: '/system/app/delete?id=' + id })
}

// 批量删除应用
export const deleteAppList = (ids: number[]) => {
  return request.delete({ url: '/system/app/delete-list', params: { ids: ids.join(',') } })
}