import request from '@/config/axios'

export interface InspectionRouteVo {
  id?: string
  routeCode?: string
  routeName?: string
  areaName?: string
  pointCount?: number
  remark?: string
  createByPersonName?: string
  createTime?: string
}

export interface RoutePointVo {
  id?: string
  routeCode?: string
  pointName?: string
  pointLocation?: string
  checkRequirement?: string
  sort?: number
  createByPersonName?: string
  createTime?: string
}

const prefix = '/workOrder/eamInspectionRoute'
const pointPrefix = '/workOrder/eamInspectionRoutePoint'

export const getRoutePage = (params: any) => request.get({ url: prefix + '/list', params })
export const getRouteById = (id: string) => request.get({ url: prefix + '/queryById', params: { id } })
export const createRoute = (data: any) => request.post({ url: prefix + '/add', data })
export const updateRoute = (data: any) => request.put({ url: prefix + '/edit', data })
export const deleteRoute = (id: string) => request.delete({ url: prefix + '/delete', params: { id } })

export const getPointPage = (params: any) => request.get({ url: pointPrefix + '/list', params })
export const createPoint = (data: any) => request.post({ url: pointPrefix + '/add', data })
export const deletePoint = (id: string) => request.delete({ url: pointPrefix + '/delete', params: { id } })
