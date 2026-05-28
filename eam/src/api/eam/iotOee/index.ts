import request from '@/config/axios'

export interface DeviceMonitorVo {
  id?: string
  equipmentSn?: string
  equipmentName?: string
  equipmentMode?: string
  workshopName?: string
  powerStatus?: string
  runTime?: number
  processTime?: number
  idleRunTime?: number
  freeTime?: number
  faultTime?: number
  processCount?: number
  ngCount?: number
  alarmInfo?: string
  collectTime?: string
  workshopCode?: string
}

export interface OeeDataVo {
  date?: string
  equipmentSn?: string
  equipmentName?: string
  availability?: number
  performance?: number
  quality?: number
  oee?: number
  workshopCode?: string
}

const prefix = '/iot/eamDeviceMonitor'
const oeePrefix = '/iot/eamOeeAnalysis'

export const getDeviceMonitorList = (params: any) => request.get({ url: prefix + '/list', params })
export const getOeeData = (params: any) => request.get({ url: oeePrefix + '/list', params })
export const getOeeSummary = (params: any) => request.get({ url: oeePrefix + '/summary', params })
