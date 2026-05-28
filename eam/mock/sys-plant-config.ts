/**
 * Mock: 系统管理 - 端别配置（附录 A.11.4 端别开关矩阵）
 * 仅 admin 角色可访问
 */
import type { MockMethod } from 'vite-plugin-mock'

// 端别配置矩阵（与附录 A.11.4 对应）
const plantConfigMatrix = [
  { id: 'CFG001', module: 'EM-01', configKey: 'enableCriticalLevel', configName: 'EM-01 关键设备分级（A·B·C）', defaultValue: '是', plantC: '是', plantB: '是', plantCNC: '是', remark: '是否在设备档案中显示 A/B/C 分级字段' },
  { id: 'CFG002', module: 'EM-01', configKey: 'enableCapability', configName: 'EM-01 设备能力参数（节拍/产能）', defaultValue: '是', plantC: '是', plantB: '是', plantCNC: '是', remark: '是否显示节拍/产能等能力字段' },
  { id: 'CFG003', module: 'EM-01', configKey: 'showIotFields', configName: 'EM-01 IoT 通讯参数字段', defaultValue: '与 EM-08 联动', plantC: '显示', plantB: '隐藏', plantCNC: '显示', remark: 'PLC/协议/IP/端口字段' },
  { id: 'CFG004', module: 'EM-01', configKey: 'showProjectField', configName: 'EM-01 非标研制项目关联字段', defaultValue: '与 EM-07 联动', plantC: '显示', plantB: '隐藏', plantCNC: '隐藏', remark: '与 EM-07 模块开关联动' },
  { id: 'CFG005', module: 'EM-04', configKey: 'enableInspection', configName: 'EM-04 巡检模块', defaultValue: '强制启用', plantC: '强制启用', plantB: '强制启用', plantCNC: '强制启用', remark: '所有端均启用，不可关闭' },
  { id: 'CFG006', module: 'EM-06', configKey: 'multiWarehouse', configName: 'EM-06 多仓库管理（双库切换）', defaultValue: 'C=启用,其他=禁用', plantC: '启用', plantB: '禁用', plantCNC: '禁用', remark: '是否启用双库切换（自动化备件库 + 维修备件库）' },
  { id: 'CFG007', module: 'EM-06', configKey: 'toolboxIntegration', configName: 'EM-06 工装柜对接', defaultValue: 'C=启用,其他=禁用', plantC: '启用', plantB: '禁用', plantCNC: '禁用', remark: '是否启用工装柜 API（安全库存自动触发采购）' },
  { id: 'CFG008', module: 'EM-08', configKey: 'snBatchBinding', configName: 'EM-08 SN 码 + 批次绑定', defaultValue: 'C=启用,CNC=禁用', plantC: '启用', plantB: '禁用', plantCNC: '禁用', remark: '是否在 IoT 配置中显示 SN 字段' },
  { id: 'CFG009', module: 'EM-08', configKey: 'idleTimeCollect', configName: 'EM-08 空转/空闲时间采集', defaultValue: 'CNC=启用,C=禁用', plantC: '禁用', plantB: '禁用', plantCNC: '启用', remark: '是否采集这两个时间维度' },
  { id: 'CFG010', module: 'EM-08', configKey: 'craftParamsCollect', configName: 'EM-08 工艺参数采集（电池相关）', defaultValue: 'C=启用,CNC=禁用', plantC: '启用', plantB: '禁用', plantCNC: '禁用', remark: '是否启用工艺参数采集' },
]

// 模块整体可见性（来自附录 A.1）
const moduleVisibility = [
  { id: 'VIS001', moduleCode: 'EM-01', moduleName: '设备台账', plantC: true, plantB: true, plantCNC: true, remark: '通用模块' },
  { id: 'VIS002', moduleCode: 'EM-02', moduleName: '维护保养', plantC: true, plantB: true, plantCNC: true, remark: '通用模块' },
  { id: 'VIS003', moduleCode: 'EM-03', moduleName: '点检', plantC: true, plantB: true, plantCNC: true, remark: '通用模块' },
  { id: 'VIS004', moduleCode: 'EM-04', moduleName: '巡检', plantC: true, plantB: true, plantCNC: true, remark: '通用模块（B 端强制启用）' },
  { id: 'VIS005', moduleCode: 'EM-05', moduleName: '维修', plantC: true, plantB: true, plantCNC: true, remark: '通用模块（含三端共用维修知识库）' },
  { id: 'VIS006', moduleCode: 'EM-06', moduleName: '备品备件', plantC: true, plantB: true, plantCNC: true, remark: '通用模块' },
  { id: 'VIS007', moduleCode: 'EM-07', moduleName: '非标设备研制', plantC: true, plantB: false, plantCNC: false, remark: '个性化模块（仅 C 端）' },
  { id: 'VIS008', moduleCode: 'EM-08', moduleName: '设备运行数据采集 (IoT/OEE)', plantC: true, plantB: false, plantCNC: true, remark: '个性化模块（C 端 + 数控机加）' },
  { id: 'VIS009', moduleCode: 'EM-09', moduleName: '生产工器具 (刀量模)', plantC: false, plantB: false, plantCNC: true, remark: '个性化模块（仅数控机加，C/B 后续）' },
]

export default <MockMethod[]>[
  {
    url: '/admin-api/system/plant-config/list',
    method: 'get',
    response: () => ({ code: 200, data: plantConfigMatrix })
  },
  {
    url: '/admin-api/system/plant-config/update',
    method: 'post',
    response: ({ body }) => {
      const idx = plantConfigMatrix.findIndex(c => c.id === body.id)
      if (idx >= 0) {
        Object.assign(plantConfigMatrix[idx], body)
      }
      return { code: 200, data: true }
    }
  },
  {
    url: '/admin-api/system/module-visibility/list',
    method: 'get',
    response: () => ({ code: 200, data: moduleVisibility })
  },
]
