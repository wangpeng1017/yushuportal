/**
 * Mock: IoT 设备运行监控 + OEE 分析数据
 * C端车间(5台) + 数控机加车间(6台)
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

// ── 全量设备监控数据 ──
const allDeviceMonitor = [
  // C端车间
  {
    id: 'DM-C-001',
    equipmentSn: 'EW-BPIL-001',
    equipmentName: 'PACK线',
    equipmentMode: '全自动',
    workshopName: 'C端车间',
    workshopCode: 'C',
    powerStatus: 'running',
    runTime: 7.5,
    processTime: 6.8,
    idleRunTime: 0.5,
    freeTime: 0.2,
    faultTime: 0,
    processCount: 1200,
    ngCount: 3,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-C-002',
    equipmentSn: 'EW-PL-001',
    equipmentName: '流水线',
    equipmentMode: '半自动',
    workshopName: 'C端车间',
    workshopCode: 'C',
    powerStatus: 'running',
    runTime: 6.8,
    processTime: 6.0,
    idleRunTime: 0.6,
    freeTime: 0.2,
    faultTime: 0,
    processCount: 980,
    ngCount: 5,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-C-003',
    equipmentSn: 'EW-CCM-001',
    equipmentName: '涂覆机',
    equipmentMode: '全自动',
    workshopName: 'C端车间',
    workshopCode: 'C',
    powerStatus: 'standby',
    runTime: 3.2,
    processTime: 2.8,
    idleRunTime: 0.4,
    freeTime: 4.6,
    faultTime: 0,
    processCount: 450,
    ngCount: 0,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-C-004',
    equipmentSn: 'EW-BSM-001',
    equipmentName: '电池分选机',
    equipmentMode: '全自动',
    workshopName: 'C端车间',
    workshopCode: 'C',
    powerStatus: 'running',
    runTime: 8.0,
    processTime: 7.2,
    idleRunTime: 0.6,
    freeTime: 0.2,
    faultTime: 0,
    processCount: 2000,
    ngCount: 12,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-C-005',
    equipmentSn: 'EW-LP-001',
    equipmentName: '压机',
    equipmentMode: '半自动',
    workshopName: 'C端车间',
    workshopCode: 'C',
    powerStatus: 'fault',
    runTime: 2.1,
    processTime: 1.8,
    idleRunTime: 0.2,
    freeTime: 0.4,
    faultTime: 1.5,
    processCount: 310,
    ngCount: 8,
    alarmInfo: '485通讯异常',
    collectTime: '2026-04-16 07:45:00',
  },
  // 数控机加车间
  {
    id: 'DM-CNC-001',
    equipmentSn: 'A1',
    equipmentName: 'A1 CNC加工中心',
    equipmentMode: '数控',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'running',
    runTime: 7.2,
    processTime: 5.8,
    idleRunTime: 0.8,
    freeTime: 0.6,
    faultTime: 0,
    processCount: 45,
    ngCount: 1,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-CNC-002',
    equipmentSn: 'A2',
    equipmentName: 'A2 CNC加工中心',
    equipmentMode: '数控',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'running',
    runTime: 6.5,
    processTime: 5.2,
    idleRunTime: 0.8,
    freeTime: 0.5,
    faultTime: 0,
    processCount: 38,
    ngCount: 2,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-CNC-003',
    equipmentSn: 'A4',
    equipmentName: 'A4 CNC加工中心',
    equipmentMode: '数控',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'stopped',
    runTime: 0,
    processTime: 0,
    idleRunTime: 0,
    freeTime: 8.0,
    faultTime: 3.0,
    processCount: 0,
    ngCount: 0,
    alarmInfo: '主轴异响，停机维修中',
    collectTime: '2026-04-16 06:00:00',
  },
  {
    id: 'DM-CNC-004',
    equipmentSn: 'A6',
    equipmentName: 'A6 CNC加工中心',
    equipmentMode: '数控',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'running',
    runTime: 7.8,
    processTime: 6.5,
    idleRunTime: 0.8,
    freeTime: 0.5,
    faultTime: 0,
    processCount: 52,
    ngCount: 1,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-CNC-005',
    equipmentSn: 'C1',
    equipmentName: 'C1 车削中心',
    equipmentMode: '数控',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'running',
    runTime: 6.0,
    processTime: 4.8,
    idleRunTime: 0.8,
    freeTime: 0.4,
    faultTime: 0,
    processCount: 120,
    ngCount: 4,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
  {
    id: 'DM-CNC-006',
    equipmentSn: 'INJ-001',
    equipmentName: '注塑机',
    equipmentMode: '全自动',
    workshopName: '数控机加车间',
    workshopCode: 'CNC',
    powerStatus: 'running',
    runTime: 7.0,
    processTime: 5.5,
    idleRunTime: 1.0,
    freeTime: 0.5,
    faultTime: 0,
    processCount: 800,
    ngCount: 15,
    alarmInfo: '',
    collectTime: '2026-04-16 09:30:00',
  },
]

// ── OEE 过去7天趋势 ──
const oeeTrend = [
  { date: '4/10', oee: 62.1, availability: 83.5, performance: 76.2, quality: 97.5 },
  { date: '4/11', oee: 65.3, availability: 86.0, performance: 78.0, quality: 97.2 },
  { date: '4/12', oee: 63.8, availability: 84.2, performance: 77.5, quality: 97.6 },
  { date: '4/13', oee: 66.1, availability: 87.0, performance: 78.8, quality: 96.5 },
  { date: '4/14', oee: 61.5, availability: 82.0, performance: 76.5, quality: 98.0 },
  { date: '4/15', oee: 64.7, availability: 85.2, performance: 78.5, quality: 96.8 },
  { date: '4/16', oee: 67.2, availability: 88.0, performance: 79.2, quality: 96.4 },
]

// ── 设备OEE排名 ──
const oeeRank = [
  { name: 'A6 CNC', oee: 72.5 },
  { name: 'A1 CNC', oee: 68.3 },
  { name: 'C1车削', oee: 66.1 },
  { name: 'PACK线', oee: 65.8 },
  { name: '流水线', oee: 63.2 },
  { name: 'A2 CNC', oee: 61.5 },
  { name: '电池分选机', oee: 58.9 },
  { name: '注塑机', oee: 55.2 },
  { name: '涂覆机', oee: 48.3 },
  { name: 'A4 CNC', oee: 0 },
]

export default [
  // ── 设备运行监控列表 ──
  {
    url: '/admin-api/iot/eamDeviceMonitor/list',
    method: 'get',
    response: ({ query, headers }) => {
      const ws = getWorkshopByToken(headers?.authorization)
      let list = allDeviceMonitor
      if (ws !== 'ALL') {
        list = list.filter(d => d.workshopCode === ws)
      }
      if (query?.workshopCode) {
        list = list.filter(d => d.workshopCode === query.workshopCode)
      }
      return { code: 200, data: { records: list, total: list.length } }
    },
  },
  // ── OEE 分析列表（趋势+排名） ──
  {
    url: '/admin-api/iot/eamOeeAnalysis/list',
    method: 'get',
    response: ({ query }) => {
      let trend = oeeTrend
      let rank = oeeRank
      // 车间过滤：C端车间整体效率略低
      if (query?.workshopName === 'C端车间') {
        trend = trend.map(d => ({
          ...d,
          oee: Math.round((d.oee - 2.5) * 10) / 10,
          availability: Math.round((d.availability - 1.5) * 10) / 10,
        }))
        rank = rank.filter(r => ['PACK线', '流水线', '电池分选机', '涂覆机'].includes(r.name))
      } else if (query?.workshopName === '数控机加车间') {
        trend = trend.map(d => ({
          ...d,
          oee: Math.round((d.oee + 1.8) * 10) / 10,
          performance: Math.round((d.performance + 1.2) * 10) / 10,
        }))
        rank = rank.filter(r => ['A6 CNC', 'A1 CNC', 'C1车削', 'A2 CNC', '注塑机', 'A4 CNC'].includes(r.name))
      }
      return { code: 200, data: { trend, rank } }
    },
  },
  // ── OEE 汇总指标 ──
  {
    url: '/admin-api/iot/eamOeeAnalysis/summary',
    method: 'get',
    response: ({ query }) => {
      let base = { availability: 85.2, performance: 78.5, quality: 96.8, oee: 64.7 }
      if (query?.workshopName === 'C端车间') {
        base = { availability: 83.5, performance: 76.8, quality: 97.2, oee: 63.1 }
      } else if (query?.workshopName === '数控机加车间') {
        base = { availability: 87.0, performance: 80.2, quality: 96.5, oee: 67.3 }
      }
      return { code: 200, data: base }
    },
  },
] as MockMethod[]
