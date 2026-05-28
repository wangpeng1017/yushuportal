/**
 * Mock: 维修知识库
 * 维修记录自动沉淀，按车间隔离，支持关键词搜索和故障类别筛选
 */
import type { MockMethod } from 'vite-plugin-mock'
import { getWorkshopByToken } from './auth'

function paginate(list: any[], pageNo = 1, pageSize = 10) {
  const start = (Number(pageNo) - 1) * Number(pageSize)
  return { records: list.slice(start, start + Number(pageSize)), total: list.length }
}

function filterByWorkshop(list: any[], ws: string) {
  if (ws === 'ALL') return list
  return list.filter((item) => item.workshopCode === ws)
}

// ── 知识库数据 ──
const allKnowledge = [
  // C端知识
  {
    id: 'K-C01',
    knowledgeCode: 'K-C01',
    workshopCode: 'C',
    equipmentTypeName: '加工类设备',
    equipmentMode: 'LP-50',
    faultPhenomenon: '485通讯端子故障',
    faultCause: '通讯线老化接触不良',
    repairSolution: '更换485端子，通讯恢复正常',
    breakdownType: '1',
    breakdownTypeText: '电气故障',
    repairLevelText: '小修',
    repairDuration: '10分钟',
    sparePartUsed: '485通讯端子x1',
    sourceWorkOrder: 'RW-C-0001',
    occurrenceCount: 3,
    createTime: '2026-03-05 11:15:00'
  },
  {
    id: 'K-C02',
    knowledgeCode: 'K-C02',
    workshopCode: 'C',
    equipmentTypeName: '非标设备',
    equipmentMode: 'CCM-3F',
    faultPhenomenon: '三防漆涂覆机喷嘴堵塞',
    faultCause: '涂料残留固化堵塞喷嘴',
    repairSolution: '用溶剂清洗喷嘴，严重时更换喷嘴',
    breakdownType: '2',
    breakdownTypeText: '机械故障',
    repairLevelText: '小修',
    repairDuration: '30分钟',
    sparePartUsed: '喷嘴x1',
    sourceWorkOrder: 'RW-C-0002',
    occurrenceCount: 2,
    createTime: '2026-04-12 15:30:00'
  },
  {
    id: 'K-C03',
    knowledgeCode: 'K-C03',
    workshopCode: 'C',
    equipmentTypeName: '非标设备',
    equipmentMode: 'BPIL-A1',
    faultPhenomenon: 'PACK线传送带打滑',
    faultCause: '传送皮带松弛磨损，摩擦力不足',
    repairSolution: '调节张紧轮增加张力，磨损严重时更换皮带',
    breakdownType: '2',
    breakdownTypeText: '机械故障',
    repairLevelText: '小修',
    repairDuration: '45分钟',
    sparePartUsed: '传送皮带x1',
    sourceWorkOrder: '',
    occurrenceCount: 1,
    createTime: '2026-02-20 10:00:00'
  },
  // B端知识
  {
    id: 'K-B01',
    knowledgeCode: 'K-B01',
    workshopCode: 'B',
    equipmentTypeName: '加工类设备',
    equipmentMode: 'ASM-4',
    faultPhenomenon: '锁螺丝机出丝不畅卡料',
    faultCause: '供丝通道碎屑堵塞，批头磨损',
    repairSolution: '清理供丝通道堵塞碎屑，更换批头',
    breakdownType: '2',
    breakdownTypeText: '机械故障',
    repairLevelText: '小修',
    repairDuration: '20分钟',
    sparePartUsed: '批头x2',
    sourceWorkOrder: 'RW-B-0001',
    occurrenceCount: 4,
    createTime: '2026-04-08 10:25:00'
  },
  {
    id: 'K-B02',
    knowledgeCode: 'K-B02',
    workshopCode: 'B',
    equipmentTypeName: '加工类设备',
    equipmentMode: 'RW-300',
    faultPhenomenon: '电阻焊接机焊点虚焊',
    faultCause: '电极头磨损，接触压力不足',
    repairSolution: '更换电极头，重新调整焊接参数（电流/压力/时间）',
    breakdownType: '1',
    breakdownTypeText: '电气故障',
    repairLevelText: '小修',
    repairDuration: '25分钟',
    sparePartUsed: '电极头x2',
    sourceWorkOrder: '',
    occurrenceCount: 2,
    createTime: '2026-03-15 14:00:00'
  },
  // 数控知识
  {
    id: 'K-N01',
    knowledgeCode: 'K-N01',
    workshopCode: 'CNC',
    equipmentTypeName: '数控设备',
    equipmentMode: 'VF2',
    faultPhenomenon: 'CNC主轴异响',
    faultCause: '主轴轴承磨损，润滑不足',
    repairSolution: '更换主轴轴承，检查润滑油路，重新跑合',
    breakdownType: '2',
    breakdownTypeText: '机械故障',
    repairLevelText: '大修',
    repairDuration: '4小时',
    sparePartUsed: 'CNC主轴轴承x1',
    sourceWorkOrder: '',
    occurrenceCount: 1,
    createTime: '2026-04-10 18:00:00'
  },
  {
    id: 'K-N02',
    knowledgeCode: 'K-N02',
    workshopCode: 'CNC',
    equipmentTypeName: '注塑设备',
    equipmentMode: 'MA1200',
    faultPhenomenon: '注塑机温控模块异常',
    faultCause: '温控板元件老化，控温精度下降',
    repairSolution: '更换温控模块，重新标定温度参数',
    breakdownType: '1',
    breakdownTypeText: '电气故障',
    repairLevelText: '大修',
    repairDuration: '2小时',
    sparePartUsed: '温控模块x1',
    sourceWorkOrder: 'RW-N-0001',
    occurrenceCount: 2,
    createTime: '2026-04-14 16:00:00'
  },
  {
    id: 'K-N03',
    knowledgeCode: 'K-N03',
    workshopCode: 'CNC',
    equipmentTypeName: '数控设备',
    equipmentMode: 'T-7',
    faultPhenomenon: 'CNC刀具磨损报警',
    faultCause: '刀具寿命到期，切削刃磨损超标',
    repairSolution: '更换刀具，重新对刀，验证首件加工精度',
    breakdownType: '2',
    breakdownTypeText: '机械故障',
    repairLevelText: '小修',
    repairDuration: '15分钟',
    sparePartUsed: '',
    sourceWorkOrder: '',
    occurrenceCount: 12,
    createTime: '2026-01-10 09:00:00'
  }
]

export default [
  // ── 知识库分页列表 ──
  {
    url: '/admin-api/workOrder/eamRepairKnowledge/list',
    method: 'get',
    response: ({ query }: { query: any; headers: any }) => {
      const { pageNo = 1, pageSize = 10, keyword, equipmentTypeName, breakdownType, workshopCode } = query

      // 知识库三端共享 (附录 A.6) - 不按 plantCode 过滤，所有端均可读
      let data = [...allKnowledge]

      // 仅当用户主动指定 workshopCode 才过滤（用于按端筛选）
      if (workshopCode && workshopCode !== 'ALL') {
        data = data.filter((item) => item.workshopCode === workshopCode)
      }

      // 关键词模糊搜索（全平台）
      if (keyword) {
        const kw = keyword.toLowerCase()
        data = data.filter(
          (item) =>
            item.faultPhenomenon.toLowerCase().includes(kw) ||
            item.faultCause.toLowerCase().includes(kw) ||
            item.repairSolution.toLowerCase().includes(kw)
        )
      }

      // 设备类型筛选
      if (equipmentTypeName) {
        data = data.filter((item) => item.equipmentTypeName === equipmentTypeName)
      }

      // 故障类别筛选
      if (breakdownType) {
        data = data.filter((item) => item.breakdownType === breakdownType)
      }

      return {
        code: 200,
        data: paginate(data, pageNo, pageSize),
        msg: ''
      }
    }
  },

  // ── 知识详情 ──
  {
    url: '/admin-api/workOrder/eamRepairKnowledge/queryById',
    method: 'get',
    response: ({ query }: { query: any }) => {
      const { id } = query
      const record = allKnowledge.find((item) => item.id === id) ?? null
      return {
        code: 200,
        data: record,
        msg: ''
      }
    }
  }
] as MockMethod[]
