import request from '@/config/axios'

export interface ProjectVo {
  id?: string
  projectCode?: string
  projectName?: string
  demandSource?: string
  demandDescription?: string
  currentPhase?: string
  responsiblePersonName?: string
  planStartDate?: string
  planEndDate?: string
  actualEndDate?: string
  status?: string
  deliveryEquipmentSn?: string
  workshopCode?: string
  createByPersonName?: string
  createTime?: string
}

export interface ProjectBomVo {
  id?: string
  projectCode?: string
  materialCode?: string
  materialName?: string
  materialType?: string
  specification?: string
  quantity?: number
  supplierName?: string
  purchaseStatus?: string
}

export interface ProjectReviewVo {
  id?: string
  projectCode?: string
  reviewType?: string
  reviewDate?: string
  reviewerNames?: string
  reviewResult?: string
  reviewSuggestion?: string
}

const prefix = '/workOrder/eamCustomEquipmentProject'
const bomPrefix = '/workOrder/eamCustomEquipmentProjectBom'
const reviewPrefix = '/workOrder/eamCustomEquipmentProjectReview'

export const getProjectPage = (params: any) => request.get({ url: prefix + '/list', params })
export const getProjectById = (id: string) => request.get({ url: prefix + '/queryById', params: { id } })
export const createProject = (data: any) => request.post({ url: prefix + '/add', data })
export const updateProject = (data: any) => request.put({ url: prefix + '/edit', data })
export const deleteProject = (id: string) => request.delete({ url: prefix + '/delete', params: { id } })
export const advancePhase = (id: string) => request.post({ url: prefix + '/advancePhase', params: { id } })

export const getBomPage = (params: any) => request.get({ url: bomPrefix + '/list', params })
export const createBom = (data: any) => request.post({ url: bomPrefix + '/add', data })
export const deleteBom = (id: string) => request.delete({ url: bomPrefix + '/delete', params: { id } })

export const getReviewPage = (params: any) => request.get({ url: reviewPrefix + '/list', params })
export const createReview = (data: any) => request.post({ url: reviewPrefix + '/add', data })
