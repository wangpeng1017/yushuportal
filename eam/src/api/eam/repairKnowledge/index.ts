import request from '@/config/axios'

export interface RepairKnowledgeVo {
  id?: string
  knowledgeCode?: string
  equipmentTypeName?: string
  equipmentMode?: string
  faultPhenomenon?: string
  faultCause?: string
  repairSolution?: string
  breakdownType?: string
  breakdownTypeText?: string
  repairLevelText?: string
  repairDuration?: string
  sparePartUsed?: string
  sourceWorkOrder?: string
  occurrenceCount?: number
  workshopCode?: string
  createTime?: string
}

const prefix = '/workOrder/eamRepairKnowledge'

export const getKnowledgePage = (params: any) => request.get({ url: prefix + '/list', params })
export const getKnowledgeById = (id: string) => request.get({ url: prefix + '/queryById', params: { id } })
