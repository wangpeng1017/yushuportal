// ============================================================
// MDM 主数据 Mock 数据（Demo 用，纯前端假数据）
// 字段对齐金蝶云星空 ERP 截图实际字段
// ============================================================

// ---------------- 类型定义 ----------------

export interface MdmCategory {
  key: string
  name: string
  icon: string
  count?: number
  children?: MdmCategory[]
}

export interface MaterialRecord {
  id: string
  code: string
  name: string
  spec: string
  groupCode: string
  groupName: string
  attribute: '自制' | '外购' | '委外'
  baseUnit: string
  purchaseUnit: string
  category: string
  productCategory: string
  productBelong: 'C端' | 'B端' | '海外'
  taxRate: string
  status: '已审核' | '未审核' | '已禁用'
  source: 'ERP' | 'PLM' | '手工'
  englishName: string
  enabled: boolean
  updatedAt: string
  owner: string
  projectNo: string
  version: string
  // 详情扩展字段
  weight?: number
  weightUnit?: string
  length?: number
  width?: number
  height?: number
  sizeUnit?: string
  stockUnit?: string
  warehouse?: string
  bin?: string
  batchRule?: string
  shelfLife?: number
  costPrice?: number
  currency?: string
  saleUnit?: string
  saleOrgPrice?: string
  minOrderQty?: number
  warranty?: number
  warrantyUnit?: string
  taxClassCode?: string
  purchaseOrg?: string
  buyer?: string
  defaultSupplier?: string
  leadTime?: number
  brand?: string
  packageRule?: string
  inspectScheme?: string
  qualityLevel?: string
  inspectionRequired?: boolean
  workshop?: string
  productLine?: string
  routing?: string
  standardHours?: number
  productionType?: string
  issueMode?: string
  // 金蝶物料接口对齐补充字段
  isKit?: '是' | '否'
  batchManaged?: '是' | '否'
  actualHours?: number
}

export interface BomItem {
  seq: number
  childCode: string
  childName: string
  childSpec: string
  childAttribute: '自制' | '外购' | '委外'
  supply: '标准件' | '替代件'
  unit: string
  qtyNumerator: number
  qtyDenominator: number
  fixedLoss: number
}

export interface BomRecord {
  id: string
  version: string
  bomType: '标准BOM' | '计划BOM' | '替代BOM'
  parentCode: string
  parentName: string
  parentUnit: string
  groupCode: string
  groupName: string
  status: '已审核' | '未审核'
  source: 'ERP' | 'PLM' | '手工'
  usage: string
  standardHours: number
  updatedAt: string
  items: BomItem[]
}

export interface DeviceRecord {
  id: string
  code: string
  name: string
  spec: string
  category: '低值设备' | '固定资产' | '设备配件'
  subCategory: string
  attribute: '自制' | '外购'
  baseUnit: string
  status: '已审核' | '未审核'
  source: 'ERP' | 'EAM' | '手工'
  amount?: number
  acquireDate?: string
  location?: string
  responsible?: string
  updatedAt: string
}

export interface ConsumableRecord {
  id: string
  code: string
  name: string
  spec: string
  subCategory: string
  baseUnit: string
  attribute: '外购'
  defaultSupplier?: string
  warehouse?: string
  status: '已审核' | '未审核'
  source: 'ERP' | '手工'
  updatedAt: string
}

export interface SupplierRecord {
  id: string
  code: string
  name: string
  shortName: string
  category: string
  contact: string
  area: string
  taxNo: string
  payTerm: string
  status: '已审核' | '未审核'
  source: 'ERP' | '手工'
  updatedAt: string
}

export interface CustomerRecord {
  id: string
  code: string
  name: string
  shortName: string
  category: 'C端经销商' | 'B端企业' | '海外客户'
  contact: string
  area: string
  creditLimit: number
  payTerm: string
  status: '已审核' | '未审核'
  source: 'ERP' | 'CRM' | '手工'
  updatedAt: string
}

export interface SimpleRecord {
  id: string
  code: string
  name: string
  status: '已审核' | '未审核'
  source: string
  updatedAt: string
  [k: string]: any
}

// ---------------- 分类树（左侧导航） ----------------

export const mdmCategories: MdmCategory[] = [
  {
    key: 'basic',
    name: '① 基础数据',
    icon: 'ep:folder',
    children: [
      { key: 'org', name: '组织/部门', icon: 'ep:office-building' },
      { key: 'employee', name: '员工档案', icon: 'ep:user' },
      { key: 'unit', name: '计量单位', icon: 'ep:scale-to-original' },
      { key: 'currency', name: '币别', icon: 'ep:money' },
      { key: 'taxRate', name: '税率/税收分类', icon: 'ep:document' },
      { key: 'rdProject', name: '研发项目', icon: 'ep:opportunity' },
      { key: 'buildProject', name: '在建工程项目', icon: 'ep:office-building' },
      { key: 'saleProject', name: '销售项目', icon: 'ep:sell' }
    ]
  },
  {
    key: 'material',
    name: '② 物料&产品 ⭐',
    icon: 'ep:box',
    children: [
      { key: 'materialList', name: '物料档案', icon: 'ep:files' },
      { key: 'materialGroup', name: '物料分组', icon: 'ep:menu' },
      { key: 'productCategory', name: '产品分类', icon: 'ep:grid' },
      { key: 'bom', name: 'BOM 物料清单 ⭐', icon: 'ep:connection' }
    ]
  },
  {
    key: 'production',
    name: '③ 生产相关',
    icon: 'ep:cpu',
    children: [
      { key: 'routing', name: '工艺路线', icon: 'ep:guide' },
      { key: 'process', name: '工序', icon: 'ep:set-up' },
      { key: 'productLine', name: '工作中心/产线', icon: 'ep:histogram' },
      { key: 'shift', name: '班次/班组', icon: 'ep:calendar' }
    ]
  },
  {
    key: 'supplyChain',
    name: '④ 供应链',
    icon: 'ep:share',
    children: [
      { key: 'supplier', name: '供应商档案', icon: 'ep:truck' },
      { key: 'customer', name: '客户档案', icon: 'ep:user-filled' },
      { key: 'buyer', name: '采购员', icon: 'ep:avatar' },
      { key: 'quota', name: '配额策略', icon: 'ep:pie-chart' }
    ]
  },
  {
    key: 'warehouse',
    name: '⑤ 仓库',
    icon: 'ep:office-building',
    children: [
      { key: 'warehouseList', name: '仓库档案', icon: 'ep:house' },
      { key: 'binList', name: '仓位/库位', icon: 'ep:location' },
      { key: 'batchRule', name: '批号编码规则', icon: 'ep:postcard' },
      { key: 'serialRule', name: '序列号编码规则', icon: 'ep:ticket' },
      { key: 'inventoryPolicy', name: '库存策略', icon: 'ep:trend-charts' }
    ]
  },
  {
    key: 'quality',
    name: '⑥ 质量',
    icon: 'ep:medal',
    children: [
      { key: 'inspectItem', name: '检验项目', icon: 'ep:list' },
      { key: 'inspectScheme', name: '检验方案', icon: 'ep:document-copy' },
      { key: 'qualityLevel', name: '质量等级', icon: 'ep:trophy' }
    ]
  },
  {
    key: 'device',
    name: '⑦ 设备主数据 ⭐',
    icon: 'ep:tools',
    children: [
      { key: 'deviceList', name: '设备档案', icon: 'ep:setting' },
      { key: 'consumable', name: '耗材/易耗品', icon: 'ep:goblet' }
    ]
  },
  {
    key: 'integration',
    name: '⑧ ERP 接口集成',
    icon: 'ep:connection',
    children: [
      { key: 'erpInterface', name: 'ERP 接口清单 (48)', icon: 'ep:list' }
    ]
  }
]

// ---------------- 物料分组树（金蝶 PLM 体系） ----------------

export const materialGroupTree = [
  {
    key: 'all',
    name: '全部',
    count: 12580,
    children: [
      { key: '1', name: '1(成品)', count: 156 },
      { key: '2', name: '2(半成品)', count: 423 },
      { key: '3', name: '3(原材料)', count: 2841 },
      { key: '4', name: '4(研发临时物料)', count: 87 },
      { key: '5', name: '5(非原材料/C类物资)', count: 312 },
      { key: '6', name: '6(销售项目)', count: 24 },
      { key: '7', name: '7(费用)', count: 9 },
      { key: '13', name: '13(行政办公物品)', count: 145 },
      { key: '16', name: '16(软件类)', count: 32 },
      { key: '98', name: '98(销售套件)', count: 68 },
      { key: '99', name: '99(贸易型产品)', count: 41 },
      {
        key: 'plm',
        name: 'PLM 系列',
        children: [
          { key: 'PLM-00', name: 'PLM-00(销售套件)', count: 73 },
          { key: 'PLM-01', name: 'PLM-01(成品)', count: 211 },
          { key: 'PLM-02', name: 'PLM-02(半成品)', count: 304 },
          { key: 'PLM-03', name: 'PLM-03(制图零件)', count: 1872 },
          { key: 'PLM-04', name: 'PLM-04(外购件)', count: 2391 },
          { key: 'PLM-05', name: 'PLM-05(包装类)', count: 138 },
          { key: 'PLM-06', name: 'PLM-06(停用)', count: 56 },
          { key: 'PLM-07', name: 'PLM-07(模具类)', count: 41 },
          { key: 'PLM-08', name: 'PLM-08(原材料)', count: 627 },
          { key: 'PLM-09', name: 'PLM-09(销售项目组件)', count: 82 },
          { key: 'PLM-10', name: 'PLM-10(停用)', count: 14 },
          { key: 'PLM-11', name: 'PLM-11(工具类)', count: 198 },
          { key: 'PLM-12', name: 'PLM-12(耗材类)', count: 845 }
        ]
      }
    ]
  }
]

// ---------------- 物料档案 20 条（Go2 全系列真实编码） ----------------

const buildMat = (
  code: string,
  name: string,
  spec: string,
  groupName: string,
  attribute: '自制' | '外购',
  productCategory: string,
  productBelong: 'C端' | 'B端' | '海外',
  extra: Partial<MaterialRecord> = {}
): MaterialRecord => ({
  id: code,
  code,
  name,
  spec,
  groupCode: groupName.split('(')[0],
  groupName,
  attribute,
  baseUnit: 'Pcs',
  purchaseUnit: 'Pcs',
  category: '产成品',
  productCategory,
  productBelong,
  taxRate: '13%增值税',
  status: '已审核',
  source: 'ERP',
  englishName: '',
  enabled: true,
  updatedAt: '2026-03-12 10:25',
  owner: '李肖阳',
  projectNo: 'RD41',
  version: 'A2',
  weight: 12.5,
  weightUnit: '千克',
  length: 70,
  width: 31,
  height: 40,
  sizeUnit: '厘米',
  stockUnit: 'Pcs',
  warehouse: '成品库',
  bin: 'A-01-01',
  batchRule: '002',
  shelfLife: 0,
  costPrice: 9800,
  currency: '人民币',
  saleUnit: 'Pcs',
  saleOrgPrice: '20000.00',
  minOrderQty: 1,
  warranty: 12,
  warrantyUnit: '月',
  taxClassCode: '机器人',
  purchaseOrg: '宇树科技股份有限公司',
  buyer: '张明',
  defaultSupplier: '深圳鑫达电子',
  leadTime: 15,
  brand: 'Unitree',
  packageRule: '标准纸箱',
  inspectScheme: '成品出厂检验方案',
  qualityLevel: 'A级',
  inspectionRequired: true,
  workshop: '组装一车间',
  productLine: 'GO2 总装线',
  routing: 'GO2-W 标准工艺路线',
  standardHours: 15,
  actualHours: 10,
  isKit: '是',
  batchManaged: '是',
  productionType: '汇报入库-普通生产',
  issueMode: '调拨领料',
  ...extra
})

export const materials: MaterialRecord[] = [
  buildMat('00.01.01.00014', 'Go2-W标准版套件-国标（含电池）', 'Go2-W-CN-BAT', '1(成品)', '自制', 'GO2-W', 'C端'),
  buildMat('00.01.01.00015', 'Go2-W标准版套件-国标（不含电池）', 'Go2-W-CN', '1(成品)', '自制', 'GO2-W', 'C端'),
  buildMat('00.01.01.00016', 'Go2-W标准版套件-海外（含电池）', 'Go2-W-OS-BAT', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00017', 'Go2-W标准版套件-海外（不含电池）', 'Go2-W-OS', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00018', 'Go2-W标准版套件-欧标（含电池）', 'Go2-W-EU-BAT', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00019', 'Go2-W标准版套件-欧标（不含电池）', 'Go2-W-EU', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00020', 'Go2-W激光智能版套件-国标（含电池）', 'Go2-W-Lidar-CN-BAT', '1(成品)', '自制', 'GO2-W', 'C端'),
  buildMat('00.01.01.00021', 'Go2-W激光智能版套件-国标（不含电池）', 'Go2-W-Lidar-CN', '1(成品)', '自制', 'GO2-W', 'C端'),
  buildMat('00.01.01.00022', 'Go2-W激光智能版套件-海外（含电池）', 'Go2-W-Lidar-OS-BAT', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00023', 'Go2-W激光智能版套件-海外（不含电池）', 'Go2-W-Lidar-OS', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00024', 'Go2-W激光智能版套件-欧标（含电池）', 'Go2-W-Lidar-EU-BAT', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00025', 'Go2-W激光智能版套件-欧标（不含电池）', 'Go2-W-Lidar-EU', '1(成品)', '自制', 'GO2-W', '海外'),
  buildMat('00.01.01.00026', 'GO2-Air套件-国标（含电池、遥控器）', 'GO2-Air-CN-Full', '1(成品)', '自制', 'GO2-Air', 'C端'),
  buildMat('00.01.01.00027', 'GO2-Air套件-美标（含电池、遥控器）', 'GO2-Air-US-Full', '1(成品)', '自制', 'GO2-Air', '海外'),
  buildMat('00.01.01.00028', 'GO2-Air套件-英标（含电池、遥控器）', 'GO2-Air-UK-Full', '1(成品)', '自制', 'GO2-Air', '海外'),
  buildMat('00.01.01.00029', 'GO2-Air套件-欧标（含电池、遥控器）', 'GO2-Air-EU-Full', '1(成品)', '自制', 'GO2-Air', '海外'),
  buildMat('00.01.01.00030', 'GO2-Air套件-澳标（含电池、遥控器）', 'GO2-Air-AU-Full', '1(成品)', '自制', 'GO2-Air', '海外'),
  buildMat('00.01.01.00031', 'Go2-Pro套件-国标（含电池、遥控器）', 'GO2-Pro-CN-Full', '1(成品)', '自制', 'GO2-Pro', 'C端'),
  buildMat('00.01.01.00032', 'Go2-Pro套件-美标（含电池、遥控器）', 'GO2-Pro-US-Full', '1(成品)', '自制', 'GO2-Pro', '海外', { status: '未审核' }),
  buildMat('4.04.0008', '弹簧（已禁用）', 'UH6-30', '3(原材料)', '外购', '通用件', 'B端', {
    status: '未审核',
    enabled: false,
    attribute: '外购',
    owner: '王建国',
    weight: 0.03,
    costPrice: 1.5
  })
]

// ---------------- BOM 物料清单 5 套（含 2-3 套替代料） ----------------

export const boms: BomRecord[] = [
  {
    id: '00.01.01.00014_VB',
    version: '00.01.01.00014_VB',
    bomType: '标准BOM',
    parentCode: '00.01.01.00014',
    parentName: 'Go2-W标准版套件-国标（含电池）',
    parentUnit: 'Pcs',
    groupCode: 'GO2',
    groupName: '销售套件-GO2',
    status: '已审核',
    source: 'ERP',
    usage: '通用',
    standardHours: 15,
    updatedAt: '2026-03-15 09:21',
    items: [
      { seq: 1, childCode: '01.02.01.00051', childName: 'GO2-W-轮足机器人-国内', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 2, childCode: '02.02.01.01.00029', childName: 'Go2-电池带包装-长续H', childSpec: '6500mAh', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 3, childCode: '04.03.07.00024', childName: 'GO2/H1-充电器(快充)成品', childSpec: '/', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 4, childCode: '02.02.03.00033', childName: 'Go2-W-包装套件-国内', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 5, childCode: '00.02.07.00007', childName: 'R3-1遥控器-带包装-套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 6, childCode: '02.02.02.04.00178', childName: 'Type-C转Type-A线缆(100cm)', childSpec: '', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 7, childCode: '02.02.04.00016', childName: 'GO2-外置防撞垫-发货套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 8, childCode: '02.02.01.19.00006', childName: 'GO2拓展坞Nano-套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 9, childCode: '05.07.00040', childName: 'GO2使用数据服务说明卡', childSpec: '140x90mm/铜版纸', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 10, childCode: '04.04.06.00007', childName: '充电器AC线（国标）品字尾', childSpec: '(配快充)1.2米,充电器专用', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 11, childCode: '04.01.07.04.00003', childName: '机械式打气筒', childSpec: '/', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 12, childCode: '02.02.01.09.00023', childName: 'Go2深度相机套件-D435i', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 13, childCode: '05.10.00004', childName: 'GO2-返修卡-Edu', childSpec: '', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 14, childCode: '05.08.00022', childName: 'Go2-W-说明书', childSpec: '', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 }
    ]
  },
  {
    id: '01.02.05.00003_VZ',
    version: '01.02.05.00003_VZ',
    bomType: '标准BOM',
    parentCode: '01.02.05.00003',
    parentName: 'G1-成品-基础版-国行',
    parentUnit: 'Pcs',
    groupCode: 'G1',
    groupName: 'G1-产成品',
    status: '已审核',
    source: 'ERP',
    usage: '通用',
    standardHours: 3.5,
    updatedAt: '2026-03-18 14:08',
    items: [
      // ⭐ 替代料关系组 1：项次 1（前护板 标准件 + 替代件）
      { seq: 1, childCode: '03.02.0002732', childName: '前护板_2.0', childSpec: '注塑件-ABS-喷漆-金属色', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 1, childCode: '03.02.0003976', childName: '前护板', childSpec: '机加件-ABS-', childAttribute: '外购', supply: '替代件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 13, childCode: '03.02.0002727', childName: '后护板', childSpec: '注塑件-PC+ABS-', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 14, childCode: '03.02.0004225', childName: '后橡胶盖', childSpec: '注塑件-硅胶,硬度70A-', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 2, childCode: '03.01.0003005', childName: '肩部下抱箍_V1.1', childSpec: '机加件-6061-T6 (SS)-喷120#砂+阳极', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 4, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 3, childCode: '03.02.0002725', childName: '后机身', childSpec: '注塑件-PA6+30%gf-', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 4, childCode: '04.03.03.00042', childName: 'BF50-191-F扬声器', childSpec: 'BF50-191-F扬声器,8欧10W,Max=...', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      // ⭐ 替代料关系组 2：项次 5（电池导向件 标准件 + 替代件）
      { seq: 5, childCode: '03.01.0003897', childName: '电池导向件_0.3_250807', childSpec: '注塑件-PA6+30%GF；-无-黑色', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 5, childCode: '03.01.0003898', childName: '电池导向件_0.3_备用料', childSpec: '注塑件-PA6+25%GF；-无-黑色', childAttribute: '外购', supply: '替代件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 16, childCode: '02.02.01.13.00088', childName: 'G1-零自由度装假手（合并）', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 17, childCode: '02.02.01.12.00309', childName: 'G1-下半身装配', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 15, childCode: '02.02.02.01.00304', childName: 'G1主板成品板', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 21, childCode: '02.02.03.00325', childName: 'G1机身POGOPIN板', childSpec: '711 POGOPIN UP V0.2', childAttribute: '委外', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 22, childCode: '02.02.02.04.00249', childName: 'G1-2号左侧到电机连接线', childSpec: '', childAttribute: '委外', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 25, childCode: '03.01.0001251', childName: '快拆外环', childSpec: '机加件-6061-', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 2, qtyDenominator: 1, fixedLoss: 0 }
    ]
  },
  {
    id: '00.01.01.00015_VB',
    version: '00.01.01.00015_VB',
    bomType: '标准BOM',
    parentCode: '00.01.01.00015',
    parentName: 'Go2-W标准版套件-国标（不含电池）',
    parentUnit: 'Pcs',
    groupCode: 'GO2',
    groupName: '销售套件-GO2',
    status: '已审核',
    source: 'ERP',
    usage: '通用',
    standardHours: 14,
    updatedAt: '2026-03-15 09:25',
    items: [
      { seq: 1, childCode: '01.02.01.00051', childName: 'GO2-W-轮足机器人-国内', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 3, childCode: '04.03.07.00024', childName: 'GO2/H1-充电器(快充)成品', childSpec: '/', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 4, childCode: '02.02.03.00033', childName: 'Go2-W-包装套件-国内', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 5, childCode: '00.02.07.00007', childName: 'R3-1遥控器-带包装-套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 6, childCode: '02.02.02.04.00178', childName: 'Type-C转Type-A线缆(100cm)', childSpec: '', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 14, childCode: '05.08.00022', childName: 'Go2-W-说明书', childSpec: '', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 }
    ]
  },
  {
    id: '00.01.01.00020_VB',
    version: '00.01.01.00020_VB',
    bomType: '标准BOM',
    parentCode: '00.01.01.00020',
    parentName: 'Go2-W激光智能版套件-国标（含电池）',
    parentUnit: 'Pcs',
    groupCode: 'GO2',
    groupName: '销售套件-GO2',
    status: '已审核',
    source: 'ERP',
    usage: '通用',
    standardHours: 18,
    updatedAt: '2026-03-16 11:42',
    items: [
      // ⭐ 替代料关系组 3：项次 1（激光雷达模组）
      { seq: 1, childCode: '01.02.01.00088', childName: 'GO2-W-激光智能版-轮足机器人', childSpec: '含 4D 激光', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 1, childCode: '01.02.01.00089', childName: 'GO2-W-激光智能版-轮足机器人(备用方案)', childSpec: '含 3D 激光', childAttribute: '自制', supply: '替代件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 2, childCode: '02.02.01.01.00029', childName: 'Go2-电池带包装-长续H', childSpec: '6500mAh', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 3, childCode: '04.03.07.00024', childName: 'GO2/H1-充电器(快充)成品', childSpec: '/', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 4, childCode: '02.02.03.00033', childName: 'Go2-W-包装套件-国内', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 5, childCode: '00.02.07.00007', childName: 'R3-1遥控器-带包装-套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 }
    ]
  },
  {
    id: '00.01.01.00026_VB',
    version: '00.01.01.00026_VB',
    bomType: '标准BOM',
    parentCode: '00.01.01.00026',
    parentName: 'GO2-Air套件-国标（含电池、遥控器）',
    parentUnit: 'Pcs',
    groupCode: 'GO2-Air',
    groupName: '销售套件-GO2-Air',
    status: '未审核',
    source: 'PLM',
    usage: '通用',
    standardHours: 12,
    updatedAt: '2026-03-22 15:08',
    items: [
      { seq: 1, childCode: '01.02.01.00110', childName: 'GO2-Air-轻量化机器人', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 2, childCode: '02.02.01.01.00031', childName: 'Go2-Air-电池-标准款', childSpec: '4500mAh', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 3, childCode: '04.03.07.00024', childName: 'GO2/H1-充电器(快充)成品', childSpec: '/', childAttribute: '外购', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 },
      { seq: 4, childCode: '00.02.07.00012', childName: 'R3-Air遥控器-带包装-套件', childSpec: '', childAttribute: '自制', supply: '标准件', unit: 'Pcs', qtyNumerator: 1, qtyDenominator: 1, fixedLoss: 0 }
    ]
  }
]

// ---------------- 设备档案 18 条 ----------------

export const devices: DeviceRecord[] = [
  // 低值设备 14.01（<1000元）
  { id: '14.01.0001', code: '14.01.0001', name: '电烙铁', spec: '936D 60W', category: '低值设备', subCategory: '14.01(低值设备<1000)', attribute: '外购', baseUnit: '把', status: '已审核', source: 'ERP', amount: 320, acquireDate: '2025-08-15', location: 'SMT 车间', responsible: '李志强', updatedAt: '2026-03-12 10:25' },
  { id: '14.01.0002', code: '14.01.0002', name: '手电钻', spec: '12V 锂电', category: '低值设备', subCategory: '14.01(低值设备<1000)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'ERP', amount: 480, acquireDate: '2025-09-02', location: '装配车间', responsible: '王明', updatedAt: '2026-03-12 10:25' },
  { id: '14.01.0003', code: '14.01.0003', name: '螺丝刀套装', spec: '精修 32 件套', category: '低值设备', subCategory: '14.01(低值设备<1000)', attribute: '外购', baseUnit: '套', status: '已审核', source: 'ERP', amount: 168, acquireDate: '2025-10-11', location: '维修工位', responsible: '张洪', updatedAt: '2026-03-12 10:25' },
  { id: '14.01.0004', code: '14.01.0004', name: '万用表', spec: 'UNI-T UT890C', category: '低值设备', subCategory: '14.01(低值设备<1000)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'ERP', amount: 380, acquireDate: '2025-11-20', location: 'QA 实验室', responsible: '刘芳', updatedAt: '2026-03-12 10:25' },
  { id: '14.01.0005', code: '14.01.0005', name: '游标卡尺', spec: '0-200mm 0.02', category: '低值设备', subCategory: '14.01(低值设备<1000)', attribute: '外购', baseUnit: '把', status: '已审核', source: 'ERP', amount: 95, acquireDate: '2025-12-01', location: 'IPQC 工位', responsible: '陈红', updatedAt: '2026-03-12 10:25' },
  // 设备类配件 14.02
  { id: '14.02.0001', code: '14.02.0001', name: '绕线机含嘴带底座套装', spec: '', category: '设备配件', subCategory: '14.02(设备类配件)', attribute: '外购', baseUnit: 'Pcs', status: '已审核', source: 'ERP', amount: 1200, acquireDate: '2025-07-10', location: '电机车间', responsible: '赵建', updatedAt: '2026-03-12 10:25' },
  { id: '14.02.0002', code: '14.02.0002', name: '绕线机含嘴', spec: '', category: '设备配件', subCategory: '14.02(设备类配件)', attribute: '外购', baseUnit: 'Pcs', status: '已审核', source: 'ERP', amount: 280, acquireDate: '2025-07-12', location: '电机车间', responsible: '赵建', updatedAt: '2026-03-12 10:25' },
  { id: '14.02.0003', code: '14.02.0003', name: '甩胶机配件-针头', spec: '【14G】中心距15...', category: '设备配件', subCategory: '14.02(设备类配件)', attribute: '外购', baseUnit: 'Pcs', status: '已审核', source: 'ERP', amount: 35, acquireDate: '2025-08-05', location: '点胶车间', responsible: '钱玲', updatedAt: '2026-03-12 10:25' },
  { id: '14.02.0007', code: '14.02.0007', name: '甩胶机配件-电机', spec: '500W 4500转高速', category: '设备配件', subCategory: '14.02(设备类配件)', attribute: '外购', baseUnit: 'Pcs', status: '已审核', source: 'ERP', amount: 850, acquireDate: '2025-08-15', location: '点胶车间', responsible: '钱玲', updatedAt: '2026-03-12 10:25' },
  { id: '14.02.0018', code: '14.02.0018', name: '步进电机', spec: '57-56 1.2N.M', category: '设备配件', subCategory: '14.02(设备类配件)', attribute: '外购', baseUnit: 'Pcs', status: '已审核', source: 'ERP', amount: 320, acquireDate: '2025-09-10', location: '设备维修部', responsible: '孙德伟', updatedAt: '2026-03-12 10:25' },
  // 固定资产 15.01 研发设备
  { id: '15.01.0001', code: '15.01.0001', name: 'SMT 贴片机', spec: 'YAMAHA YSM20R', category: '固定资产', subCategory: '15.01(研发设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'EAM', amount: 1280000, acquireDate: '2024-05-18', location: 'SMT 1 车间', responsible: '李志强', updatedAt: '2026-03-12 10:25' },
  { id: '15.01.0002', code: '15.01.0002', name: '回流焊炉', spec: 'JT-820N 10 温区', category: '固定资产', subCategory: '15.01(研发设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'EAM', amount: 380000, acquireDate: '2024-05-20', location: 'SMT 1 车间', responsible: '李志强', updatedAt: '2026-03-12 10:25' },
  { id: '15.01.0003', code: '15.01.0003', name: '3D 打印机', spec: 'Stratasys F370', category: '固定资产', subCategory: '15.01(研发设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'EAM', amount: 580000, acquireDate: '2024-08-22', location: '研发实验室', responsible: '王建国', updatedAt: '2026-03-12 10:25' },
  // 固定资产 15.02 生产设备
  { id: '15.02.0001', code: '15.02.0001', name: 'CNC 加工中心', spec: 'DMG MORI NMV5000', category: '固定资产', subCategory: '15.02(生产设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'EAM', amount: 2100000, acquireDate: '2024-03-15', location: '金加工车间', responsible: '周振华', updatedAt: '2026-03-12 10:25' },
  { id: '15.02.0002', code: '15.02.0002', name: '注塑机', spec: '海天 HTF180X 锁模力 180T', category: '固定资产', subCategory: '15.02(生产设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'EAM', amount: 380000, acquireDate: '2024-04-10', location: '注塑车间', responsible: '周振华', updatedAt: '2026-03-12 10:25' },
  { id: '15.02.0003', code: '15.02.0003', name: '装配流水线', spec: 'GO2 总装定制款', category: '固定资产', subCategory: '15.02(生产设备)', attribute: '自制', baseUnit: '条', status: '已审核', source: 'EAM', amount: 850000, acquireDate: '2024-06-30', location: '组装一车间', responsible: '林强', updatedAt: '2026-03-12 10:25' },
  // 固定资产 15.03 办公设备
  { id: '15.03.0001', code: '15.03.0001', name: '商用打印机', spec: 'HP LaserJet M607n', category: '固定资产', subCategory: '15.03(办公设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'ERP', amount: 5800, acquireDate: '2024-09-15', location: '行政办公室', responsible: '韩雪', updatedAt: '2026-03-12 10:25' },
  { id: '15.03.0002', code: '15.03.0002', name: '会议大屏', spec: 'MAXHUB 86 寸触控屏', category: '固定资产', subCategory: '15.03(办公设备)', attribute: '外购', baseUnit: '台', status: '已审核', source: 'ERP', amount: 28000, acquireDate: '2024-09-18', location: '大会议室', responsible: '韩雪', updatedAt: '2026-03-12 10:25' }
]

// ---------------- 耗材 15 条（PLM-12 体系） ----------------

export const consumables: ConsumableRecord[] = [
  // 12.01 漆类
  { id: '12.01.0007', code: '12.01.0007', name: '助焊膏绿油', spec: '铝合金推杆+1支1...', subCategory: '12.01(漆类)', baseUnit: 'Pcs', attribute: '外购', defaultSupplier: '深圳鑫达电子', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.01.0008', code: '12.01.0008', name: '自喷漆', spec: '39 黑色', subCategory: '12.01(漆类)', baseUnit: 'Pcs', attribute: '外购', defaultSupplier: '上海亚士漆', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.01.0009', code: '12.01.0009', name: '自喷漆', spec: '白色 12 瓶装【整箱】', subCategory: '12.01(漆类)', baseUnit: 'Pcs', attribute: '外购', defaultSupplier: '上海亚士漆', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.01.0011', code: '12.01.0011', name: '划线油漆', spec: '白色反光漆【主漆+...', subCategory: '12.01(漆类)', baseUnit: 'Pcs', attribute: '外购', defaultSupplier: '上海亚士漆', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.01.0013', code: '12.01.0013', name: '绝缘漆', spec: '500 毫升', subCategory: '12.01(漆类)', baseUnit: 'Pcs', attribute: '外购', defaultSupplier: '上海亚士漆', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.02 胶类
  { id: '12.02.0001', code: '12.02.0001', name: '红色螺纹胶', spec: 'Loctite 271 50ml', subCategory: '12.02(胶类)', baseUnit: '支', attribute: '外购', defaultSupplier: '汉高乐泰', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.02.0002', code: '12.02.0002', name: 'AB 胶', spec: '环氧 AB 胶 80g', subCategory: '12.02(胶类)', baseUnit: '套', attribute: '外购', defaultSupplier: '汉高乐泰', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.03 胶带/棉类
  { id: '12.03.0001', code: '12.03.0001', name: '高温胶带', spec: '聚酰亚胺 10mm×33m', subCategory: '12.03(胶带/棉类)', baseUnit: '卷', attribute: '外购', defaultSupplier: '3M 中国', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.05 劳保/个人防护
  { id: '12.05.0001', code: '12.05.0001', name: '防静电手套', spec: '碳纤维 PU 涂层 L 码', subCategory: '12.05(劳保/个人防护类)', baseUnit: '副', attribute: '外购', defaultSupplier: '霍尼韦尔', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.05.0002', code: '12.05.0002', name: '防护口罩', spec: 'KN95 独立装', subCategory: '12.05(劳保/个人防护类)', baseUnit: '只', attribute: '外购', defaultSupplier: '霍尼韦尔', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.06 打磨类
  { id: '12.06.0001', code: '12.06.0001', name: '砂纸', spec: '500# 干磨', subCategory: '12.06(打磨类)', baseUnit: '张', attribute: '外购', defaultSupplier: '深圳鑫达电子', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.07 焊接类
  { id: '12.07.0001', code: '12.07.0001', name: '锡丝', spec: 'Sn99.3 0.6mm 500g', subCategory: '12.07(焊接类)', baseUnit: '卷', attribute: '外购', defaultSupplier: '深圳鑫达电子', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: '12.07.0002', code: '12.07.0002', name: '助焊剂', spec: '免清洗 100ml', subCategory: '12.07(焊接类)', baseUnit: '瓶', attribute: '外购', defaultSupplier: '深圳鑫达电子', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.10 清洁/擦拭类
  { id: '12.10.0001', code: '12.10.0001', name: '无尘布', spec: '4×4 寸 100 张装', subCategory: '12.10(清洁/擦拭类)', baseUnit: '包', attribute: '外购', defaultSupplier: '苏州东蓝', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  // 12.11 不干胶贴纸类
  { id: '12.11.0001', code: '12.11.0001', name: '物料标签', spec: '40×30mm 铜版纸', subCategory: '12.11(不干胶贴纸类/卡片类)', baseUnit: '卷', attribute: '外购', defaultSupplier: '广州智印', warehouse: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' }
]

// ---------------- 供应商 10 条 ----------------

export const suppliers: SupplierRecord[] = [
  { id: 'SUP001', code: 'SUP001', name: '深圳鑫达电子有限公司', shortName: '鑫达电子', category: '电子元件', contact: '陈志强 138****1234', area: '广东·深圳', taxNo: '914403006789ABCDE', payTerm: '月结 30 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP002', code: 'SUP002', name: '杭州雷神动力科技有限公司', shortName: '雷神动力', category: '电机/驱动', contact: '王磊 139****5678', area: '浙江·杭州', taxNo: '913301088765FGHIJ', payTerm: '月结 60 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP003', code: 'SUP003', name: '宁德新能源科技有限公司', shortName: '宁德新能源', category: '电池', contact: '李娜 136****9012', area: '福建·宁德', taxNo: '913509999988KLMNO', payTerm: '票到 90 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP004', code: 'SUP004', name: '苏州精模科技有限公司', shortName: '精模科技', category: '结构件/外壳', contact: '张伟 137****3456', area: '江苏·苏州', taxNo: '913205051234PQRST', payTerm: '月结 30 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP005', code: 'SUP005', name: '东莞华瑞包装有限公司', shortName: '华瑞包装', category: '包装材料', contact: '林芳 135****7890', area: '广东·东莞', taxNo: '914419006543UVWXY', payTerm: '月结 45 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP006', code: 'SUP006', name: '汉高乐泰（中国）', shortName: '汉高乐泰', category: '胶粘剂', contact: '赵宏 188****2222', area: '上海', taxNo: '913101007777ABCDF', payTerm: '月结 30 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP007', code: 'SUP007', name: '3M 中国有限公司', shortName: '3M 中国', category: '胶带/工具', contact: '钱玲 186****3333', area: '上海', taxNo: '913101008888GHIJK', payTerm: '月结 60 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP008', code: 'SUP008', name: '霍尼韦尔（中国）', shortName: '霍尼韦尔', category: '劳保用品', contact: '孙德伟 159****4444', area: '上海', taxNo: '913101009999LMNOP', payTerm: '票到 90 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' },
  { id: 'SUP009', code: 'SUP009', name: '广州智印科技有限公司', shortName: '智印科技', category: '印刷/标签', contact: '周振华 199****5555', area: '广东·广州', taxNo: '914401010101QRSTU', payTerm: '月结 30 天', status: '未审核', source: '手工', updatedAt: '2026-04-08 09:15' },
  { id: 'SUP010', code: 'SUP010', name: '台积电（中国）', shortName: 'TSMC', category: '半导体', contact: '刘芳 138****6666', area: '上海/南京', taxNo: '913101012323VWXYZ', payTerm: '票到 60 天', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25' }
]

// ---------------- 客户 8 条 ----------------

export const customers: CustomerRecord[] = [
  { id: 'CUS001', code: 'CUS001', name: '北京京东方电子集团', shortName: '京东方', category: 'B端企业', contact: '采购部 010-88****12', area: '北京', creditLimit: 5000000, payTerm: '月结 30 天', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS002', code: 'CUS002', name: '深圳大疆创新科技有限公司', shortName: '大疆', category: 'B端企业', contact: '研发采购 0755-26****88', area: '广东·深圳', creditLimit: 8000000, payTerm: '月结 60 天', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS003', code: 'CUS003', name: '上海机器人产业创新中心', shortName: '上海机器人中心', category: 'B端企业', contact: '李博士 021-58****66', area: '上海', creditLimit: 3000000, payTerm: '月结 90 天', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS004', code: 'CUS004', name: 'Unitree US Inc.', shortName: 'Unitree US', category: '海外客户', contact: 'John Smith +1-415-****', area: 'San Francisco', creditLimit: 10000000, payTerm: 'TT 30 days', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS005', code: 'CUS005', name: 'Unitree Europe GmbH', shortName: 'Unitree EU', category: '海外客户', contact: 'Hans Mueller +49-89-****', area: 'Munich', creditLimit: 8000000, payTerm: 'TT 30 days', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS006', code: 'CUS006', name: '杭州大象机器人专营店', shortName: '大象机器人', category: 'C端经销商', contact: '王经理 138****7788', area: '浙江·杭州', creditLimit: 500000, payTerm: '款到发货', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS007', code: 'CUS007', name: '武汉智控数码', shortName: '智控数码', category: 'C端经销商', contact: '李老板 139****9911', area: '湖北·武汉', creditLimit: 300000, payTerm: '款到发货', status: '已审核', source: 'CRM', updatedAt: '2026-03-12 10:25' },
  { id: 'CUS008', code: 'CUS008', name: '清华大学智能机器人实验室', shortName: '清华机器人实验室', category: 'B端企业', contact: '张教授 010-62****33', area: '北京', creditLimit: 2000000, payTerm: '货到付款', status: '已审核', source: '手工', updatedAt: '2026-03-12 10:25' }
]

// ---------------- 其他基础数据（精简版） ----------------

// 部门：金蝶接口字段 = 编码/名称/生效日期/失效日期（中台→金蝶/中台→MOM）
export const orgs: SimpleRecord[] = [
  { id: '1000', code: '1000', name: '宇树科技股份有限公司', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '-', 生效日期: '2016-08-01', 失效日期: '9999-12-31' },
  { id: '1001', code: '1001', name: '研发中心', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '宇树科技股份有限公司', 生效日期: '2016-08-01', 失效日期: '9999-12-31' },
  { id: '1002', code: '1002', name: '生产中心', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '宇树科技股份有限公司', 生效日期: '2018-03-01', 失效日期: '9999-12-31' },
  { id: '1003', code: '1003', name: '供应链中心', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '宇树科技股份有限公司', 生效日期: '2018-03-01', 失效日期: '9999-12-31' },
  { id: '1004', code: '1004', name: '质量管理部', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '宇树科技股份有限公司', 生效日期: '2019-01-01', 失效日期: '9999-12-31' },
  { id: '1005', code: '1005', name: '海外事业部', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 上级部门: '宇树科技股份有限公司', 生效日期: '2021-06-01', 失效日期: '9999-12-31' }
]

// 员工：金蝶接口字段 = 员工姓名/员工编号（中台→金蝶/中台→MOM）。按全局铁律不显示电话/邮箱
export const employees: SimpleRecord[] = [
  { id: 'EMP001', code: 'EMP001', name: '李肖阳', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '研发中心', position: '物料工程师' },
  { id: 'EMP002', code: 'EMP002', name: '王建国', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '研发中心', position: '硬件工程师' },
  { id: 'EMP003', code: 'EMP003', name: '张明', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', position: '采购员' },
  { id: 'EMP004', code: 'EMP004', name: '林强', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '生产中心', position: '车间主任' },
  { id: 'EMP005', code: 'EMP005', name: '刘芳', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '质量管理部', position: 'QA 工程师' },
  { id: 'EMP006', code: 'EMP006', name: '韩雪', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '海外事业部', position: '销售经理' }
]

export const units: SimpleRecord[] = [
  { id: 'U01', code: 'Pcs', name: '个', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '数量', precision: 0 },
  { id: 'U02', code: '台', name: '台', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '数量', precision: 0 },
  { id: 'U03', code: '套', name: '套', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '数量', precision: 0 },
  { id: 'U04', code: 'kg', name: '千克', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '重量', precision: 3 },
  { id: 'U05', code: 'g', name: '克', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '重量', precision: 3 },
  { id: 'U06', code: 'm', name: '米', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '长度', precision: 3 },
  { id: 'U07', code: 'cm', name: '厘米', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '长度', precision: 2 },
  { id: 'U08', code: '卷', name: '卷', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', category: '数量', precision: 0 }
]

export const currencies: SimpleRecord[] = [
  { id: 'C01', code: 'CNY', name: '人民币', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', symbol: '¥', rate: 1.0 },
  { id: 'C02', code: 'USD', name: '美元', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', symbol: '$', rate: 7.18 },
  { id: 'C03', code: 'EUR', name: '欧元', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', symbol: '€', rate: 7.85 },
  { id: 'C04', code: 'JPY', name: '日元', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', symbol: '¥', rate: 0.047 }
]

export const taxRates: SimpleRecord[] = [
  { id: 'T01', code: 'T13', name: '13%增值税', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', rate: 0.13, classCode: '标准税率' },
  { id: 'T02', code: 'T9', name: '9%增值税', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', rate: 0.09, classCode: '低税率' },
  { id: 'T03', code: 'T6', name: '6%增值税（服务）', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', rate: 0.06, classCode: '服务业' },
  { id: 'T04', code: 'T0', name: '出口退税 0%', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', rate: 0.0, classCode: '出口免税' },
  { id: 'T05', code: 'TR1', name: '机器人税收分类', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', rate: 0.13, classCode: '智能制造装备' }
]

// ---------------- 生产相关 ----------------

export const routings: SimpleRecord[] = [
  { id: 'R001', code: 'RT-GO2W-001', name: 'GO2-W 标准工艺路线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', stdHours: 15, workshop: '组装一车间', processCount: 8 },
  { id: 'R002', code: 'RT-GO2W-002', name: 'GO2-W 激光智能版工艺路线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', stdHours: 18, workshop: '组装一车间', processCount: 10 },
  { id: 'R003', code: 'RT-GO2AIR-001', name: 'GO2-Air 工艺路线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', stdHours: 12, workshop: '组装二车间', processCount: 6 },
  { id: 'R004', code: 'RT-G1-001', name: 'G1 整机工艺路线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', stdHours: 3.5, workshop: '总装车间', processCount: 5 },
  { id: 'R005', code: 'RT-PCBA-001', name: 'PCBA SMT 工艺路线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', stdHours: 0.5, workshop: 'SMT 1 车间', processCount: 4 }
]

export const processes: SimpleRecord[] = [
  { id: 'P001', code: 'OP010', name: 'SMT 贴片', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: 'YAMAHA YSM20R', stdHours: 0.2 },
  { id: 'P002', code: 'OP020', name: '回流焊', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: 'JT-820N', stdHours: 0.1 },
  { id: 'P003', code: 'OP030', name: 'AOI 检测', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: 'AOI-A8', stdHours: 0.05 },
  { id: 'P004', code: 'OP100', name: '总装', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: '装配线', stdHours: 5 },
  { id: 'P005', code: 'OP110', name: '功能测试', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: '测试治具', stdHours: 2 },
  { id: 'P006', code: 'OP120', name: '老化测试', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: '老化柜', stdHours: 4 },
  { id: 'P007', code: 'OP200', name: '包装', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: '包装工位', stdHours: 0.3 },
  { id: 'P008', code: 'OP210', name: '出货', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', equipment: '出货扫码枪', stdHours: 0.1 }
]

export const productLines: SimpleRecord[] = [
  { id: 'L001', code: 'LINE-GO2-01', name: 'GO2 总装线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', workshop: '组装一车间', capacity: '50台/班' },
  { id: 'L002', code: 'LINE-G1-01', name: 'G1 总装线', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', workshop: '总装车间', capacity: '80台/班' },
  { id: 'L003', code: 'LINE-SMT-01', name: 'SMT 贴片线 #1', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', workshop: 'SMT 1 车间', capacity: '500片/班' },
  { id: 'L004', code: 'LINE-SMT-02', name: 'SMT 贴片线 #2', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', workshop: 'SMT 2 车间', capacity: '500片/班' }
]

export const shifts: SimpleRecord[] = [
  { id: 'S01', code: 'SHIFT-A', name: '白班 A', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', start: '08:00', end: '17:00', leader: '林强' },
  { id: 'S02', code: 'SHIFT-B', name: '中班 B', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', start: '17:00', end: '00:00', leader: '王建国' },
  { id: 'S03', code: 'SHIFT-C', name: '夜班 C', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', start: '00:00', end: '08:00', leader: '周振华' }
]

// ---------------- 供应链额外 ----------------

export const buyers: SimpleRecord[] = [
  { id: 'B001', code: 'B001', name: '张明', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', category: '电子元件', type: '后端采购员' },
  { id: 'B002', code: 'B002', name: '李华', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', category: '结构件', type: '后端采购员' },
  { id: 'B003', code: 'B003', name: '王秋', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', category: '电池/电源', type: '前端采购员' },
  { id: 'B004', code: 'B004', name: '陈志', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', category: '包装材料', type: '前端采购员' },
  { id: 'B005', code: 'B005', name: '马丽', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', dept: '供应链中心', category: '耗材/MRO', type: '后端采购员' }
]

export const quotas: SimpleRecord[] = [
  { id: 'Q001', code: 'QT-001', name: 'Go2 主板配额-顺序优先', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', material: 'PCBA 主板', mode: '顺序优先', suppliers: '深圳鑫达 60% / 苏州精模 40%' },
  { id: 'Q002', code: 'QT-002', name: '电池配额-比例分配', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', material: 'Go2 电池', mode: '比例分配', suppliers: '宁德 70% / 比亚迪 30%' },
  { id: 'Q003', code: 'QT-003', name: '电机配额-顺序优先', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', material: '关节电机', mode: '顺序优先', suppliers: '雷神动力 100%' }
]

// ---------------- 仓库相关 ----------------

// 仓库：金蝶接口字段对齐（金蝶→MOM）
export const warehouses: SimpleRecord[] = [
  { id: 'WH001', code: 'WH-FG', name: '成品库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓库属性: '存储仓', 仓库负责人: '林强', 分组: '总部仓', 库存状态类型: '合格/不合格/待检', 默认库存状态: '合格', 默认收料状态: '待检', 允许锁库: '是', 启用仓位管理: '是', 参与拣货: '是', 参与预警: '是', 仓位值集编码: 'BIN-FG', 仓位值集名称: '成品库仓位集', 创建人: '林强', 审核人: '张洪', 最后修改人: '林强' },
  { id: 'WH002', code: 'WH-WIP', name: '半成品库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓库属性: '存储仓', 仓库负责人: '林强', 分组: '总部仓', 库存状态类型: '合格/待检', 默认库存状态: '合格', 默认收料状态: '待检', 允许锁库: '否', 启用仓位管理: '是', 参与拣货: '是', 参与预警: '否', 仓位值集编码: 'BIN-WIP', 仓位值集名称: '半成品库仓位集', 创建人: '林强', 审核人: '张洪', 最后修改人: '林强' },
  { id: 'WH003', code: 'WH-RM', name: '原材料库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓库属性: '存储仓', 仓库负责人: '张洪', 分组: '总部仓', 库存状态类型: '合格/待检/不合格', 默认库存状态: '待检', 默认收料状态: '待检', 允许锁库: '是', 启用仓位管理: '是', 参与拣货: '是', 参与预警: '是', 仓位值集编码: 'BIN-RM', 仓位值集名称: '原材料库仓位集', 创建人: '张洪', 审核人: '林强', 最后修改人: '张洪' },
  { id: 'WH004', code: 'WH-MRO', name: '耗材库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓库属性: '存储仓', 仓库负责人: '马丽', 分组: '辅料仓', 库存状态类型: '合格', 默认库存状态: '合格', 默认收料状态: '合格', 允许锁库: '否', 启用仓位管理: '否', 参与拣货: '是', 参与预警: '是', 仓位值集编码: '-', 仓位值集名称: '-', 创建人: '马丽', 审核人: '林强', 最后修改人: '马丽' },
  { id: 'WH005', code: 'WH-NG', name: '不良品库', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓库属性: '不良仓', 仓库负责人: '刘芳', 分组: '隔离仓', 库存状态类型: '不合格', 默认库存状态: '不合格', 默认收料状态: '不合格', 允许锁库: '是', 启用仓位管理: '否', 参与拣货: '否', 参与预警: '否', 仓位值集编码: '-', 仓位值集名称: '-', 创建人: '刘芳', 审核人: '林强', 最后修改人: '刘芳' }
]

// 仓位：金蝶为「仓位值集 + 仓位值」两级（文档标注"不对接"，此处仅作主数据展示）
export const bins: SimpleRecord[] = [
  { id: 'BIN001', code: 'A-01-01', name: 'A 区 1 排 1 号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓位值集编码: 'BIN-FG', 仓位值集名称: '成品库仓位集', 创建人: '林强', 审核人: '张洪', 修改人: '林强', 禁用人: '-', 创建日期: '2024-01-10', 审核日期: '2024-01-10', 修改日期: '2026-03-12', 禁用日期: '-' },
  { id: 'BIN002', code: 'A-01-02', name: 'A 区 1 排 2 号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓位值集编码: 'BIN-FG', 仓位值集名称: '成品库仓位集', 创建人: '林强', 审核人: '张洪', 修改人: '林强', 禁用人: '-', 创建日期: '2024-01-10', 审核日期: '2024-01-10', 修改日期: '2026-03-12', 禁用日期: '-' },
  { id: 'BIN003', code: 'B-02-05', name: 'B 区 2 排 5 号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓位值集编码: 'BIN-RM', 仓位值集名称: '原材料库仓位集', 创建人: '张洪', 审核人: '林强', 修改人: '张洪', 禁用人: '-', 创建日期: '2024-02-01', 审核日期: '2024-02-01', 修改日期: '2026-03-12', 禁用日期: '-' },
  { id: 'BIN004', code: 'C-01-01', name: 'C 区 1 排 1 号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 仓位值集编码: 'BIN-WIP', 仓位值集名称: '半成品库仓位集', 创建人: '林强', 审核人: '张洪', 修改人: '林强', 禁用人: '-', 创建日期: '2024-02-15', 审核日期: '2024-02-15', 修改日期: '2026-03-12', 禁用日期: '-' }
]

export const batchRules: SimpleRecord[] = [
  { id: 'BR001', code: 'BR-001', name: 'YYMMDD-XXXX 日期+流水号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', pattern: 'YYMMDD-NNNN', example: '260322-0001' },
  { id: 'BR002', code: 'BR-002', name: 'GO2-YYWW 周次批号', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', pattern: 'GO2-YYWW', example: 'GO2-2612' },
  { id: 'BR003', code: 'BR-003', name: 'V[版本]-YYMMDD', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', pattern: 'VX-YYMMDD', example: 'V2-260322' }
]

export const serialRules: SimpleRecord[] = [
  { id: 'SR001', code: 'SR-GO2', name: 'GO2 序列号规则', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', pattern: 'GO2-YY-NNNNN', example: 'GO2-26-00001' },
  { id: 'SR002', code: 'SR-G1', name: 'G1 序列号规则', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', pattern: 'G1-YY-NNNNN', example: 'G1-26-00001' }
]

export const inventoryPolicies: SimpleRecord[] = [
  { id: 'IP001', code: 'POL-MIN', name: '最小库存预警', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', policy: '低于安全库存 → 自动生成请购单', enabled: '是' },
  { id: 'IP002', code: 'POL-ROP', name: '再订货点策略', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', policy: '到达再订货点 → 触发采购', enabled: '是' },
  { id: 'IP003', code: 'POL-CYC', name: '周期盘点策略', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', policy: '每周一盘点 A 类物料', enabled: '是' },
  { id: 'IP004', code: 'POL-WAV', name: '波次策略', status: '已审核', source: 'WMS', updatedAt: '2026-03-12 10:25', policy: '按订单优先级+客户分组合并波次', enabled: '是' }
]

// ---------------- 质量相关 ----------------

export const inspectItems: SimpleRecord[] = [
  { id: 'INS001', code: 'I-DIM', name: '尺寸测量', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', method: '游标卡尺/三坐标', tolerance: '±0.05mm' },
  { id: 'INS002', code: 'I-WGT', name: '重量测量', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', method: '电子秤', tolerance: '±5g' },
  { id: 'INS003', code: 'I-VIS', name: '外观检验', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', method: '目视检查+放大镜', tolerance: 'AQL 1.5' },
  { id: 'INS004', code: 'I-FCT', name: '功能测试', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', method: '自动测试治具', tolerance: '100% 通过' },
  { id: 'INS005', code: 'I-AGE', name: '老化测试', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', method: '老化柜 48h', tolerance: '无故障' }
]

export const inspectSchemes: SimpleRecord[] = [
  { id: 'IS001', code: 'IQC-001', name: '原材料 IQC 检验方案', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', stage: 'IQC', itemCount: 8 },
  { id: 'IS002', code: 'IPQC-001', name: '产线 IPQC 巡检方案', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', stage: 'IPQC', itemCount: 12 },
  { id: 'IS003', code: 'OQC-001', name: '成品出厂 OQC 方案', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', stage: 'OQC', itemCount: 15 }
]

export const qualityLevels: SimpleRecord[] = [
  { id: 'QL001', code: 'A', name: 'A 级（优）', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', desc: '完全合格，可直接出货', score: '95-100' },
  { id: 'QL002', code: 'B', name: 'B 级（良）', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', desc: '轻微瑕疵，可让步接收', score: '85-94' },
  { id: 'QL003', code: 'C', name: 'C 级（可）', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', desc: '需返工后出货', score: '70-84' },
  { id: 'QL004', code: 'D', name: 'D 级（不良）', status: '已审核', source: 'QMS', updatedAt: '2026-03-12 10:25', desc: '报废处理', score: '<70' }
]

// ---------------- 产品分类 ----------------

export const productCategories: SimpleRecord[] = [
  { id: 'PC001', code: 'GO2-W', name: 'GO2-W 系列', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', belong: 'C端/海外', desc: '轮足机器人标准版' },
  { id: 'PC002', code: 'GO2-Air', name: 'GO2-Air 系列', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', belong: 'C端/海外', desc: '轻量化版本' },
  { id: 'PC003', code: 'GO2-Pro', name: 'GO2-Pro 系列', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', belong: 'C端/海外', desc: '专业版' },
  { id: 'PC004', code: 'G1', name: 'G1 人形机器人', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', belong: 'B端', desc: '人形机器人产品线' },
  { id: 'PC005', code: 'H1', name: 'H1 人形机器人', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', belong: 'B端', desc: '旗舰人形机器人' }
]

// ---------------- 项目主数据（金蝶预置基础资料，金蝶→MOM；分研发/在建工程/销售三类） ----------------
// 字段对齐金蝶「项目」接口：项目编码/项目名称/数据状态/禁用状态/创建日期/创建人/修改日期/修改人

export const rdProjects: SimpleRecord[] = [
  { id: 'RD41', code: 'RD41', name: 'G1 人形机器人量产研发', status: '已审核', source: 'ERP', updatedAt: '2026-04-12 09:10', 禁用状态: '否', 创建日期: '2025-06-01', 创建人: '李肖阳', 修改日期: '2026-04-12', 修改人: '李肖阳' },
  { id: 'RD42', code: 'RD42', name: 'GO2-W 轮足升级研发', status: '已审核', source: 'ERP', updatedAt: '2026-03-20 14:30', 禁用状态: '否', 创建日期: '2025-08-15', 创建人: '王建国', 修改日期: '2026-03-20', 修改人: '王建国' },
  { id: 'RD43', code: 'RD43', name: 'H1 旗舰人形机器人研发', status: '已审核', source: 'ERP', updatedAt: '2026-04-28 16:00', 禁用状态: '否', 创建日期: '2025-09-01', 创建人: '严欢欢', 修改日期: '2026-04-28', 修改人: '严欢欢' },
  { id: 'RD44', code: 'RD44', name: '灵巧手关节模组研发', status: '未审核', source: 'ERP', updatedAt: '2026-05-06 11:20', 禁用状态: '否', 创建日期: '2026-02-10', 创建人: '王建国', 修改日期: '2026-05-06', 修改人: '王建国' }
]

export const buildProjects: SimpleRecord[] = [
  { id: 'JG01', code: 'JG01', name: '二期智能工厂厂房建设', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 禁用状态: '否', 创建日期: '2025-03-01', 创建人: '林强', 修改日期: '2026-03-12', 修改人: '林强' },
  { id: 'JG02', code: 'JG02', name: '总装产线扩建工程', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 禁用状态: '否', 创建日期: '2025-07-01', 创建人: '林强', 修改日期: '2026-03-12', 修改人: '张洪' },
  { id: 'JG03', code: 'JG03', name: '老化测试线建设工程', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', 禁用状态: '是', 创建日期: '2024-10-01', 创建人: '张洪', 修改日期: '2025-12-30', 修改人: '张洪' }
]

export const saleProjects: SimpleRecord[] = [
  { id: 'RB11', code: 'RB11', name: 'GO2 机器狗-标准版（C端）', status: '已审核', source: 'ERP', updatedAt: '2026-03-15 10:25', 禁用状态: '否', 创建日期: '2025-11-02', 创建人: '乃永刚', 修改日期: '2026-03-15', 修改人: '乃永刚' },
  { id: 'RB12', code: 'RB12', name: 'GO2-EDU 教育版', status: '已审核', source: 'ERP', updatedAt: '2026-02-20 10:25', 禁用状态: '否', 创建日期: '2025-12-08', 创建人: '乃永刚', 修改日期: '2026-02-20', 修改人: '王组长' },
  { id: 'RB21', code: 'RB21', name: 'B2 工业四足', status: '已审核', source: 'ERP', updatedAt: '2026-01-18 10:25', 禁用状态: '否', 创建日期: '2025-09-15', 创建人: '李伟', 修改日期: '2026-01-18', 修改人: '李伟' },
  { id: 'HM01', code: 'HM01', name: 'G1 人形机器人-量产', status: '已审核', source: 'ERP', updatedAt: '2026-04-12 10:25', 禁用状态: '否', 创建日期: '2026-01-05', 创建人: '严欢欢', 修改日期: '2026-04-12', 修改人: '严欢欢' },
  { id: 'RB05', code: 'RB05', name: 'Go1 机器狗-停产', status: '已审核', source: 'ERP', updatedAt: '2025-10-30 10:25', 禁用状态: '是', 创建日期: '2024-06-01', 创建人: '乃永刚', 修改日期: '2025-10-30', 修改人: '乃永刚' }
]

// ---------------- ERP 接口集成清单（金蝶云星空 ⇄ 中台 ⇄ MOM，全 48 个接口） ----------------

const mkIf = (no: number, module: string, biz: string, kingdee: string, upstream: string, direction: string): SimpleRecord => ({
  id: 'IF' + String(no).padStart(2, '0'),
  code: String(no),
  name: biz,
  status: direction === '不对接' || direction === '不传递' ? '已禁用' : '已审核',
  source: 'ERP',
  updatedAt: '2026-05-27 18:00',
  模块: module,
  金蝶表单: kingdee,
  上游关联单据: upstream || '无',
  传递方向: direction
})

export const erpInterfaces: SimpleRecord[] = [
  mkIf(1, '基础资料', '物料', '物料', '无', '金蝶→MOM'),
  mkIf(2, '基础资料', 'BOM', 'BOM', '无', '金蝶→MOM'),
  mkIf(3, '基础资料', '仓库', '仓库', '无', '金蝶→MOM'),
  mkIf(4, '基础资料', '仓位', '仓位', '', '不对接'),
  mkIf(5, '基础资料', '员工', '员工', '无', '中台→金蝶/中台→MOM'),
  mkIf(6, '基础资料', '部门', '部门', '无', '中台→金蝶/中台→MOM'),
  mkIf(7, '基础资料', '研发项目', '预置基础资料（研发项目）', '', '金蝶→MOM'),
  mkIf(8, '基础资料', '在建工程项目', '预置基础资料（在建工程项目）', '', '金蝶→MOM'),
  mkIf(9, '基础资料', '销售项目', '预置基础资料（销售项目）', '', '金蝶→MOM'),
  mkIf(10, '生产管理', '制造任务', '生产订单', '计划订单', '金蝶→MOM'),
  mkIf(11, '生产管理', '制造任务', '生产订单变更单', '生产订单', '金蝶→MOM'),
  mkIf(12, '生产管理', '制造任务', '生产用料清单', '生产工单', '金蝶→MOM'),
  mkIf(13, '生产管理', '制造任务', '生产用料清单变更', '生产用料清单', '金蝶→MOM'),
  mkIf(14, '生产管理', '投料记录', '生产领料单', '生产用料清单', 'MOM→MOM→金蝶'),
  mkIf(15, '生产管理', '投料记录', '生产补料单', '生产用料清单', 'MOM→MOM→金蝶'),
  mkIf(16, '生产管理', '投料记录（负数）', '生产退料单', '生产补料单', 'MOM→MOM→金蝶'),
  mkIf(17, '生产管理', '生产汇报单', '生产汇报单', '生产工单', 'MOM→金蝶'),
  mkIf(18, '生产管理', '生产入库单', '完工入库单', '生产汇报单', 'MOM→金蝶'),
  mkIf(19, '委外管理', '委外订单', '委外订单', '计划订单', '金蝶→MOM'),
  mkIf(20, '委外管理', '委外订单变更单', '委外订单变更单', '委外订单', '金蝶→MOM'),
  mkIf(21, '委外管理', '委外用料清单', '委外用料清单', '委外订单', '金蝶→MOM'),
  mkIf(22, '委外管理', '委外领料单', '委外领料单', '委外用料清单', 'MOM→金蝶'),
  mkIf(23, '委外管理', '委外退料单', '委外退料单', '委外领料单', 'MOM→金蝶'),
  mkIf(24, '委外管理', '委外补料单', '委外补料单', '委外用料清单', 'MOM→金蝶'),
  mkIf(25, '委外管理', '委外收料单', '委外完工入库', '委外订单', 'MOM→金蝶'),
  mkIf(26, '委外/采购管理', '采购订单', '采购订单', '委外订单', '金蝶→MOM'),
  mkIf(27, '采购管理', '收料单', '收料通知单', '采购订单', '金蝶→MOM→金蝶'),
  mkIf(28, '采购管理', '采购入库单', '采购入库单', '收料通知单', 'MOM→金蝶'),
  mkIf(29, '采购管理', '采购退料单', '采购退料单', '采购入库单/收料通知', 'MOM→金蝶→MOM'),
  mkIf(30, '采购管理', '退料申请', '退料申请', '采购订单', '金蝶→MOM'),
  mkIf(31, '采购管理', '采购退料单', '采购退料单', '采购入库单/退料申请', 'MOM→金蝶'),
  mkIf(32, '仓库管理', '出库申请', '出库申请', '无', '金蝶→MOM'),
  mkIf(33, '仓库管理', '其他出库单（普通）', '其他出库单（普通）', '出库申请', 'MOM→金蝶'),
  mkIf(34, '仓库管理', '其他出库单（退货）', '其他出库单（退货）', '其他出库单（普通）', 'MOM→金蝶'),
  mkIf(35, '仓库管理', '出库申请单', '调拨申请', '', '金蝶→MOM'),
  mkIf(36, '仓库管理', '其他出库单（普通）', '直接调拨单', '', 'MOM→金蝶'),
  mkIf(37, '仓库管理', '其他入库单', '其他入库单', '无', 'MOM→金蝶'),
  mkIf(38, '仓库管理', '调拨申请', '调拨申请', '', '金蝶→MOM'),
  mkIf(39, '仓库管理', '直接调拨单', '直接调拨单', '调拨申请', 'MOM→金蝶'),
  mkIf(40, '仓库管理', '其他入库单', '直接调拨单', '调拨申请', '金蝶→MOM'),
  mkIf(41, '仓库管理', '拆卸单', '拆卸单', '', 'MOM→金蝶'),
  mkIf(42, '仓库管理', '差异单', '盘盈/盘亏单', '', 'MOM→金蝶'),
  mkIf(43, '仓库管理', '库存核对表', '-', '', '不传递'),
  mkIf(44, '销售管理', '发货通知单', '发货通知单', '销售订单', '金蝶→MOM'),
  mkIf(45, '销售管理', '销售出库单', '销售出库单', '发货通知单', 'MOM→金蝶'),
  mkIf(46, '销售管理', '退货通知单', '退货通知单', '销售出库单', '金蝶→MOM'),
  mkIf(47, '销售管理', '销售退货单', '销售退货单', '退货通知单', 'MOM→金蝶'),
  mkIf(48, '供应商协同', '供应商问题通知书/质量事故告知函', '质量问题通知', '', 'MOM→金蝶')
]

// ---------------- 统一映射：子分类 key → 列表数据 + 列定义 ----------------

export const dataMap: Record<string, { rows: any[]; columns: Array<{ prop: string; label: string; width?: number }> }> = {
  org: {
    rows: orgs,
    columns: [
      { prop: 'code', label: '部门编码', width: 100 },
      { prop: 'name', label: '部门名称' },
      { prop: '上级部门', label: '上级部门' },
      { prop: '生效日期', label: '生效日期', width: 120 },
      { prop: '失效日期', label: '失效日期', width: 120 }
    ]
  },
  employee: {
    rows: employees,
    columns: [
      { prop: 'code', label: '员工编号', width: 120 },
      { prop: 'name', label: '员工姓名', width: 120 },
      { prop: 'dept', label: '部门' },
      { prop: 'position', label: '岗位' }
    ]
  },
  unit: {
    rows: units,
    columns: [
      { prop: 'code', label: '编码', width: 100 },
      { prop: 'name', label: '名称' },
      { prop: 'category', label: '类型' },
      { prop: 'precision', label: '精度', width: 80 }
    ]
  },
  currency: {
    rows: currencies,
    columns: [
      { prop: 'code', label: '币种', width: 100 },
      { prop: 'name', label: '名称' },
      { prop: 'symbol', label: '符号', width: 80 },
      { prop: 'rate', label: '兑换率' }
    ]
  },
  taxRate: {
    rows: taxRates,
    columns: [
      { prop: 'code', label: '编码', width: 100 },
      { prop: 'name', label: '名称' },
      { prop: 'rate', label: '税率' },
      { prop: 'classCode', label: '税分类' }
    ]
  },
  materialList: {
    rows: materials,
    columns: [
      { prop: 'code', label: '物料编码', width: 140 },
      { prop: 'name', label: '物料名称' },
      { prop: 'spec', label: '规格型号', width: 130 },
      { prop: 'groupName', label: '物料分组', width: 100 },
      { prop: 'attribute', label: '物料属性', width: 90 },
      { prop: 'isKit', label: '套件', width: 70 },
      { prop: 'category', label: '存货类别', width: 90 },
      { prop: 'projectNo', label: '项目编号', width: 90 },
      { prop: 'productCategory', label: '产品分类', width: 100 },
      { prop: 'productBelong', label: '产品归属', width: 90 },
      { prop: 'owner', label: '负责人', width: 90 }
    ]
  },
  materialGroup: {
    rows: [
      { id: 'MG001', code: '1', name: '1(成品)', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', count: 156, parent: '全部' },
      { id: 'MG002', code: '2', name: '2(半成品)', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', count: 423, parent: '全部' },
      { id: 'MG003', code: '3', name: '3(原材料)', status: '已审核', source: 'ERP', updatedAt: '2026-03-12 10:25', count: 2841, parent: '全部' },
      { id: 'MG004', code: 'PLM-00', name: 'PLM-00(销售套件)', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', count: 73, parent: 'PLM 系列' },
      { id: 'MG005', code: 'PLM-01', name: 'PLM-01(成品)', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', count: 211, parent: 'PLM 系列' },
      { id: 'MG006', code: 'PLM-12', name: 'PLM-12(耗材类)', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', count: 845, parent: 'PLM 系列' },
      { id: 'MG007', code: 'PLM-14', name: 'PLM-14(低值设备)', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', count: 86, parent: 'PLM 系列' },
      { id: 'MG008', code: 'PLM-15', name: 'PLM-15(固定资产)', status: '已审核', source: 'PLM', updatedAt: '2026-03-12 10:25', count: 38, parent: 'PLM 系列' }
    ],
    columns: [
      { prop: 'code', label: '分组编码', width: 130 },
      { prop: 'name', label: '分组名称' },
      { prop: 'parent', label: '上级' },
      { prop: 'count', label: '物料数', width: 100 }
    ]
  },
  productCategory: {
    rows: productCategories,
    columns: [
      { prop: 'code', label: '分类编码', width: 120 },
      { prop: 'name', label: '分类名称' },
      { prop: 'belong', label: '产品归属' },
      { prop: 'desc', label: '描述' }
    ]
  },
  bom: {
    rows: boms,
    columns: [
      { prop: 'version', label: 'BOM 版本', width: 180 },
      { prop: 'parentCode', label: '父项物料编码', width: 150 },
      { prop: 'parentName', label: '物料名称' },
      { prop: 'bomType', label: 'BOM 分类', width: 100 },
      { prop: 'groupName', label: 'BOM 分组', width: 140 },
      { prop: 'standardHours', label: '父项标准工时', width: 120 }
    ]
  },
  routing: {
    rows: routings,
    columns: [
      { prop: 'code', label: '编码', width: 140 },
      { prop: 'name', label: '工艺路线名称' },
      { prop: 'workshop', label: '车间' },
      { prop: 'stdHours', label: '标准工时' },
      { prop: 'processCount', label: '工序数' }
    ]
  },
  process: {
    rows: processes,
    columns: [
      { prop: 'code', label: '工序编码', width: 100 },
      { prop: 'name', label: '工序名称' },
      { prop: 'equipment', label: '使用设备' },
      { prop: 'stdHours', label: '标准工时' }
    ]
  },
  productLine: {
    rows: productLines,
    columns: [
      { prop: 'code', label: '产线编码', width: 140 },
      { prop: 'name', label: '产线名称' },
      { prop: 'workshop', label: '车间' },
      { prop: 'capacity', label: '产能' }
    ]
  },
  shift: {
    rows: shifts,
    columns: [
      { prop: 'code', label: '班次编码', width: 120 },
      { prop: 'name', label: '班次名称' },
      { prop: 'start', label: '开始时间' },
      { prop: 'end', label: '结束时间' },
      { prop: 'leader', label: '班组长' }
    ]
  },
  supplier: {
    rows: suppliers,
    columns: [
      { prop: 'code', label: '编码', width: 100 },
      { prop: 'name', label: '供应商名称' },
      { prop: 'shortName', label: '简称', width: 120 },
      { prop: 'category', label: '供货类别' },
      { prop: 'area', label: '地区' },
      { prop: 'payTerm', label: '付款方式' }
    ]
  },
  customer: {
    rows: customers,
    columns: [
      { prop: 'code', label: '编码', width: 100 },
      { prop: 'name', label: '客户名称' },
      { prop: 'shortName', label: '简称', width: 140 },
      { prop: 'category', label: '客户类别', width: 110 },
      { prop: 'area', label: '地区' },
      { prop: 'creditLimit', label: '信用额度', width: 110 }
    ]
  },
  buyer: {
    rows: buyers,
    columns: [
      { prop: 'code', label: '工号', width: 100 },
      { prop: 'name', label: '姓名', width: 100 },
      { prop: 'type', label: '类型', width: 120 },
      { prop: 'category', label: '负责类目' },
      { prop: 'dept', label: '所属部门' }
    ]
  },
  quota: {
    rows: quotas,
    columns: [
      { prop: 'code', label: '策略编码', width: 120 },
      { prop: 'name', label: '策略名称' },
      { prop: 'material', label: '适用物料' },
      { prop: 'mode', label: '分配方式', width: 110 },
      { prop: 'suppliers', label: '供应商分配' }
    ]
  },
  warehouseList: {
    rows: warehouses,
    columns: [
      { prop: 'code', label: '仓库编码', width: 110 },
      { prop: 'name', label: '仓库名称', width: 120 },
      { prop: '仓库属性', label: '仓库属性', width: 90 },
      { prop: '仓库负责人', label: '负责人', width: 90 },
      { prop: '分组', label: '分组', width: 90 },
      { prop: '启用仓位管理', label: '仓位管理', width: 90 },
      { prop: '参与预警', label: '参与预警', width: 90 },
      { prop: '仓位值集名称', label: '仓位值集' }
    ]
  },
  binList: {
    rows: bins,
    columns: [
      { prop: '仓位值集编码', label: '仓位值集编码', width: 120 },
      { prop: '仓位值集名称', label: '仓位值集名称', width: 150 },
      { prop: 'code', label: '仓位值编码', width: 110 },
      { prop: 'name', label: '仓位值名称' },
      { prop: '创建人', label: '创建人', width: 90 },
      { prop: '创建日期', label: '创建日期', width: 120 }
    ]
  },
  batchRule: {
    rows: batchRules,
    columns: [
      { prop: 'code', label: '规则编码', width: 100 },
      { prop: 'name', label: '规则名称' },
      { prop: 'pattern', label: '模式' },
      { prop: 'example', label: '示例' }
    ]
  },
  serialRule: {
    rows: serialRules,
    columns: [
      { prop: 'code', label: '规则编码', width: 120 },
      { prop: 'name', label: '规则名称' },
      { prop: 'pattern', label: '模式' },
      { prop: 'example', label: '示例' }
    ]
  },
  inventoryPolicy: {
    rows: inventoryPolicies,
    columns: [
      { prop: 'code', label: '策略编码', width: 120 },
      { prop: 'name', label: '策略名称' },
      { prop: 'policy', label: '策略说明' },
      { prop: 'enabled', label: '启用', width: 80 }
    ]
  },
  inspectItem: {
    rows: inspectItems,
    columns: [
      { prop: 'code', label: '项目编码', width: 100 },
      { prop: 'name', label: '项目名称' },
      { prop: 'method', label: '检验方法' },
      { prop: 'tolerance', label: '允差/标准' }
    ]
  },
  inspectScheme: {
    rows: inspectSchemes,
    columns: [
      { prop: 'code', label: '方案编码', width: 120 },
      { prop: 'name', label: '方案名称' },
      { prop: 'stage', label: '检验阶段', width: 100 },
      { prop: 'itemCount', label: '项目数', width: 80 }
    ]
  },
  qualityLevel: {
    rows: qualityLevels,
    columns: [
      { prop: 'code', label: '等级', width: 80 },
      { prop: 'name', label: '名称' },
      { prop: 'desc', label: '描述' },
      { prop: 'score', label: '分值区间' }
    ]
  },
  deviceList: {
    rows: devices,
    columns: [
      { prop: 'code', label: '设备编码', width: 120 },
      { prop: 'name', label: '设备名称' },
      { prop: 'spec', label: '规格型号' },
      { prop: 'subCategory', label: '设备分类', width: 160 },
      { prop: 'amount', label: '金额(¥)', width: 110 },
      { prop: 'location', label: '存放位置' },
      { prop: 'responsible', label: '负责人', width: 100 }
    ]
  },
  consumable: {
    rows: consumables,
    columns: [
      { prop: 'code', label: '编码', width: 120 },
      { prop: 'name', label: '名称' },
      { prop: 'spec', label: '规格' },
      { prop: 'subCategory', label: '耗材分类', width: 180 },
      { prop: 'baseUnit', label: '单位', width: 80 },
      { prop: 'defaultSupplier', label: '默认供应商' }
    ]
  },
  rdProject: {
    rows: rdProjects,
    columns: [
      { prop: 'code', label: '项目编码', width: 110 },
      { prop: 'name', label: '项目名称' },
      { prop: '禁用状态', label: '禁用状态', width: 90 },
      { prop: '创建人', label: '创建人', width: 90 },
      { prop: '创建日期', label: '创建日期', width: 120 },
      { prop: '修改人', label: '修改人', width: 90 },
      { prop: '修改日期', label: '修改日期', width: 120 }
    ]
  },
  buildProject: {
    rows: buildProjects,
    columns: [
      { prop: 'code', label: '项目编码', width: 110 },
      { prop: 'name', label: '项目名称' },
      { prop: '禁用状态', label: '禁用状态', width: 90 },
      { prop: '创建人', label: '创建人', width: 90 },
      { prop: '创建日期', label: '创建日期', width: 120 },
      { prop: '修改人', label: '修改人', width: 90 },
      { prop: '修改日期', label: '修改日期', width: 120 }
    ]
  },
  saleProject: {
    rows: saleProjects,
    columns: [
      { prop: 'code', label: '项目编码', width: 110 },
      { prop: 'name', label: '项目名称' },
      { prop: '禁用状态', label: '禁用状态', width: 90 },
      { prop: '创建人', label: '创建人', width: 90 },
      { prop: '创建日期', label: '创建日期', width: 120 },
      { prop: '修改人', label: '修改人', width: 90 },
      { prop: '修改日期', label: '修改日期', width: 120 }
    ]
  },
  erpInterface: {
    rows: erpInterfaces,
    columns: [
      { prop: 'code', label: '编号', width: 70 },
      { prop: '模块', label: '模块', width: 130 },
      { prop: 'name', label: '业务表单', width: 200 },
      { prop: '金蝶表单', label: '金蝶表单', width: 190 },
      { prop: '上游关联单据', label: '上游关联单据', width: 170 },
      { prop: '传递方向', label: '传递方向', width: 170 }
    ]
  }
}

// 顶部统计指标
export const overviewStats = {
  materials: 12580,
  suppliers: 386,
  customers: 1247,
  devices: 462,
  consumables: 845,
  syncedToday: 24
}
