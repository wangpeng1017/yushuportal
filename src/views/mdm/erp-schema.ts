// 本文件由 scripts/gen-mdm-data.py 从《宇树-ERP接口清单.xlsx》《ERP接口清单及字段.xlsx》自动生成，勿手改
export interface FieldDef {
  name: string
  enum?: string[]
  sample?: string
}

export interface DetailSection {
  title: string
  fields: FieldDef[]
}

export interface BizInterfaceMeta {
  id: number
  module: string
  bizForm: string
  kingdeeForm: string
  upstream: string
  direction: string
  dirType: 'K2M' | 'M2K' | 'BOTH' | 'NONE'
  note: string
  header: FieldDef[]
  details: DetailSection[]
}

export const bizInterfaces: BizInterfaceMeta[] = [
  {
    "id": 10,
    "module": "生产管理",
    "bizForm": "制造任务",
    "kingdeeForm": "生产订单",
    "upstream": "计划订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类别"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "生产车间"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "业务状态"
          },
          {
            "name": "计划开工时间"
          },
          {
            "name": "计划完工时间"
          },
          {
            "name": "BOM版本"
          },
          {
            "name": "需求类型"
          },
          {
            "name": "排查状态"
          },
          {
            "name": "领料状态"
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "module": "生产管理",
    "bizForm": "制造任务",
    "kingdeeForm": "生产订单变更单",
    "upstream": "生产订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "变更原因"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "变更类型"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "生产订单编号"
          },
          {
            "name": "生产订单行号"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "业务状态"
          },
          {
            "name": "计划开工时间"
          },
          {
            "name": "计划完工时间"
          },
          {
            "name": "BOM版本"
          },
          {
            "name": "需求类型"
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "module": "生产管理",
    "bizForm": "制造任务",
    "kingdeeForm": "生产用料清单",
    "upstream": "生产工单",
    "direction": "金蝶→MOM",
    "note": "原计划为MOM→金蝶，开发沟通确认下",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "产品编号"
      },
      {
        "name": "产品名称"
      },
      {
        "name": "规格型号"
      },
      {
        "name": "BOM版本"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "单位"
      },
      {
        "name": "数量"
      },
      {
        "name": "生产订单类型"
      },
      {
        "name": "生产订单编号"
      },
      {
        "name": "生产订单状态"
      },
      {
        "name": "生产订单行号"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "项次"
          },
          {
            "name": "子项物料编码"
          },
          {
            "name": "子项物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "子项类型"
          },
          {
            "name": "子项单位"
          },
          {
            "name": "使用比例"
          },
          {
            "name": "分子"
          },
          {
            "name": "分母"
          },
          {
            "name": "应发数量"
          },
          {
            "name": "备注"
          },
          {
            "name": "已领数量"
          },
          {
            "name": "未领数量"
          },
          {
            "name": "实领数量"
          }
        ]
      }
    ]
  },
  {
    "id": 13,
    "module": "生产管理",
    "bizForm": "制造任务",
    "kingdeeForm": "生产用料清单变更",
    "upstream": "生产用料清单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "变更原因"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "变更类型"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "分母"
          },
          {
            "name": "分子"
          },
          {
            "name": "单位"
          },
          {
            "name": "生产用料清单编号"
          },
          {
            "name": "应发数量"
          },
          {
            "name": "产品编号"
          },
          {
            "name": "产品名称"
          },
          {
            "name": "生产数量"
          },
          {
            "name": "生产订单编号"
          },
          {
            "name": "生产车间"
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "module": "生产管理",
    "bizForm": "投料记录",
    "kingdeeForm": "生产领料单",
    "upstream": "生产用料清单",
    "direction": "MOM→MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "多选指定审批人"
      },
      {
        "name": "发料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "领料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品编码"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实发数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "生产车间"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 15,
    "module": "生产管理",
    "bizForm": "投料记录",
    "kingdeeForm": "生产补料单",
    "upstream": "生产用料清单",
    "direction": "MOM→MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "发料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "领料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实发数量"
          },
          {
            "name": "报废数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "生产订单编号"
          },
          {
            "name": "备注"
          },
          {
            "name": "补料原因"
          }
        ]
      }
    ]
  },
  {
    "id": 16,
    "module": "生产管理",
    "bizForm": "投料记录（负数）",
    "kingdeeForm": "生产退料单",
    "upstream": "生产补料单",
    "direction": "MOM→MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "收料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "退料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "退料类型"
          },
          {
            "name": "退料原因"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "生产订单编号"
          },
          {
            "name": "备注"
          },
          {
            "name": "产品编码"
          },
          {
            "name": "产品名称"
          }
        ]
      }
    ]
  },
  {
    "id": 17,
    "module": "生产管理",
    "bizForm": "生产汇报单",
    "kingdeeForm": "生产汇报单",
    "upstream": "生产工单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "生产车间"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "生产汇报类型"
          },
          {
            "name": "单位"
          },
          {
            "name": "合格数量"
          },
          {
            "name": "不合格数量"
          },
          {
            "name": "待返修数量"
          },
          {
            "name": "报废数量"
          },
          {
            "name": "返工数量"
          },
          {
            "name": "完成数量"
          },
          {
            "name": "生产车间"
          },
          {
            "name": "人员实作工时"
          },
          {
            "name": "批号"
          },
          {
            "name": "班组"
          },
          {
            "name": "责任部门"
          },
          {
            "name": "库位"
          }
        ]
      }
    ]
  },
  {
    "id": 18,
    "module": "生产管理",
    "bizForm": "生产入库单",
    "kingdeeForm": "完工入库单",
    "upstream": "生产汇报单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "入库组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "车间"
      },
      {
        "name": "货主"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "入库类型"
          },
          {
            "name": "单位"
          },
          {
            "name": "应收数量"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "产线"
          },
          {
            "name": "库存状态"
          }
        ]
      }
    ]
  },
  {
    "id": 19,
    "module": "委外管理",
    "bizForm": "委外订单",
    "kingdeeForm": "委外订单",
    "upstream": "计划订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "计划员"
      },
      {
        "name": "项目类型"
      },
      {
        "name": "创建人部门"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "业务状态"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "计划开工时间"
          },
          {
            "name": "计划完工时间"
          },
          {
            "name": "采购组织"
          },
          {
            "name": "排产状态"
          },
          {
            "name": "领料状态"
          },
          {
            "name": "SMT厂商编号"
          },
          {
            "name": "线路板厂家代号"
          },
          {
            "name": "供应商编码"
          }
        ]
      }
    ]
  },
  {
    "id": 20,
    "module": "委外管理",
    "bizForm": "委外订单变更单",
    "kingdeeForm": "委外订单变更单",
    "upstream": "委外订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "变更原因"
      },
      {
        "name": "备注"
      },
      {
        "name": "创建人部门"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "变更类型"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "委外订单编号"
          },
          {
            "name": "委外订单行号"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "业务状态"
          },
          {
            "name": "计划开工时间"
          },
          {
            "name": "计划完工时间"
          },
          {
            "name": "BOM版本"
          },
          {
            "name": "需求类型"
          }
        ]
      }
    ]
  },
  {
    "id": 21,
    "module": "委外管理",
    "bizForm": "委外用料清单",
    "kingdeeForm": "委外用料清单",
    "upstream": "委外订单",
    "direction": "金蝶→MOM",
    "note": "同生产逻辑，需开发确认对接方向",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "产品编号"
      },
      {
        "name": "产品名称"
      },
      {
        "name": "规格型号"
      },
      {
        "name": "BOM版本"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "单位"
      },
      {
        "name": "数量"
      },
      {
        "name": "委外订单类型"
      },
      {
        "name": "委外订单编号"
      },
      {
        "name": "生产订单状态"
      },
      {
        "name": "生产订单行号"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "项次"
          },
          {
            "name": "子项物料编码"
          },
          {
            "name": "子项物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "子项类型"
          },
          {
            "name": "子项单位"
          },
          {
            "name": "使用比例"
          },
          {
            "name": "分子"
          },
          {
            "name": "分母"
          },
          {
            "name": "应发数量"
          },
          {
            "name": "备注"
          },
          {
            "name": "已领数量"
          },
          {
            "name": "未领数量"
          },
          {
            "name": "实领数量"
          }
        ]
      }
    ]
  },
  {
    "id": 22,
    "module": "委外管理",
    "bizForm": "委外领料单",
    "kingdeeForm": "委外领料单",
    "upstream": "委外用料清单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "发料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "领料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实发数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 23,
    "module": "委外管理",
    "bizForm": "委外退料单",
    "kingdeeForm": "委外退料单",
    "upstream": "委外领料单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "收料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "退料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "退料类型"
          },
          {
            "name": "退料原因"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "委外订单编号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 24,
    "module": "委外管理",
    "bizForm": "委外补料单",
    "kingdeeForm": "委外补料单",
    "upstream": "委外用料清单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "发料组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "委外组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "领料人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "实发数量"
          },
          {
            "name": "报废数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "委外订单编号"
          },
          {
            "name": "备注"
          },
          {
            "name": "补料原因"
          }
        ]
      }
    ]
  },
  {
    "id": 25,
    "module": "委外管理",
    "bizForm": "委外收料单",
    "kingdeeForm": "委外完工入库",
    "upstream": "委外订单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "单据日期"
      },
      {
        "name": "生产组织"
      },
      {
        "name": "入库组织"
      },
      {
        "name": "仓库"
      },
      {
        "name": "车间"
      },
      {
        "name": "货主"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "入库类型"
          },
          {
            "name": "单位"
          },
          {
            "name": "应收数量"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "产线"
          },
          {
            "name": "库存状态"
          }
        ]
      }
    ]
  },
  {
    "id": 26,
    "module": "采购管理",
    "bizForm": "采购订单",
    "kingdeeForm": "采购订单",
    "upstream": "委外订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "单据编号"
      },
      {
        "name": "采购日期"
      },
      {
        "name": "供应商编码"
      },
      {
        "name": "供应商名称"
      },
      {
        "name": "收货地址"
      },
      {
        "name": "编号",
        "sample": "01\\02"
      },
      {
        "name": "钉钉审批编号"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "采购单位"
          },
          {
            "name": "采购数量"
          },
          {
            "name": "交货日期"
          },
          {
            "name": "是否赠品"
          },
          {
            "name": "期望到货日期"
          },
          {
            "name": "前端采购员"
          },
          {
            "name": "空板代号"
          }
        ]
      }
    ]
  },
  {
    "id": 27,
    "module": "采购管理",
    "bizForm": "收料单",
    "kingdeeForm": "收料通知单",
    "upstream": "采购订单",
    "direction": "金蝶→MOM→金蝶",
    "note": "",
    "dirType": "BOTH",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "单据编号"
      },
      {
        "name": "收料日期"
      },
      {
        "name": "单据状态"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "物流单号"
      },
      {
        "name": "收货地址"
      },
      {
        "name": "验收方式"
      },
      {
        "name": "供应商"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "收料单位"
          },
          {
            "name": "交货数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购员"
          }
        ]
      }
    ]
  },
  {
    "id": 28,
    "module": "采购管理",
    "bizForm": "采购入库单",
    "kingdeeForm": "采购入库单",
    "upstream": "收料通知单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "收料组织"
      },
      {
        "name": "采购组织"
      },
      {
        "name": "需求组织"
      },
      {
        "name": "供应商"
      },
      {
        "name": "入库日期"
      },
      {
        "name": "采购员"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "物料编码"
          },
          {
            "name": "库存单位"
          },
          {
            "name": "应收数量"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "计价单位"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购单位"
          },
          {
            "name": "批号"
          }
        ]
      }
    ]
  },
  {
    "id": 29,
    "module": "采购管理",
    "bizForm": "采购退料单",
    "kingdeeForm": "采购退料单",
    "upstream": "采购入库单/收料通知",
    "direction": "MOM→金蝶→MOM",
    "note": "",
    "dirType": "BOTH",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "退料组织"
      },
      {
        "name": "采购组织"
      },
      {
        "name": "需求组织"
      },
      {
        "name": "退料部门"
      },
      {
        "name": "退料日期"
      },
      {
        "name": "退料类型"
      },
      {
        "name": "退料方式"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "采购员"
      },
      {
        "name": "供应商"
      },
      {
        "name": "验收方式"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "退料原因"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "库存单位"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "计价单位"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购单位"
          },
          {
            "name": "批号"
          }
        ]
      }
    ]
  },
  {
    "id": 30,
    "module": "采购管理",
    "bizForm": "退料申请",
    "kingdeeForm": "退料申请",
    "upstream": "采购订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "退料组织"
      },
      {
        "name": "采购组织"
      },
      {
        "name": "需求组织"
      },
      {
        "name": "退料部门"
      },
      {
        "name": "退料日期"
      },
      {
        "name": "退料类型"
      },
      {
        "name": "退料方式"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "采购员"
      },
      {
        "name": "供应商"
      },
      {
        "name": "验收方式"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "退料原因"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "库存单位"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "计价单位"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购单位"
          },
          {
            "name": "批号"
          }
        ]
      }
    ]
  },
  {
    "id": 31,
    "module": "采购管理",
    "bizForm": "采购退料单",
    "kingdeeForm": "采购退料单",
    "upstream": "采购入库单/退料申请",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "退料组织"
      },
      {
        "name": "采购组织"
      },
      {
        "name": "需求组织"
      },
      {
        "name": "退料部门"
      },
      {
        "name": "退料日期"
      },
      {
        "name": "退料类型"
      },
      {
        "name": "退料方式"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "采购员"
      },
      {
        "name": "供应商"
      },
      {
        "name": "验收方式"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "退料原因"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "库存单位"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "计价单位"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购单位"
          },
          {
            "name": "批号"
          }
        ]
      }
    ]
  },
  {
    "id": 32,
    "module": "仓库管理",
    "bizForm": "出库申请",
    "kingdeeForm": "出库申请",
    "upstream": "",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号",
        "sample": "（拉取金蝶数据时需要）"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "申请组织"
      },
      {
        "name": "领用部门"
      },
      {
        "name": "申请日期"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "需求人"
      },
      {
        "name": "需求部门"
      },
      {
        "name": "备注"
      },
      {
        "name": "钉钉编号"
      },
      {
        "name": "客户类型"
      },
      {
        "name": "指定审批人"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "单位"
          },
          {
            "name": "库存组织"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "货主"
          },
          {
            "name": "产品组"
          }
        ]
      }
    ]
  },
  {
    "id": 33,
    "module": "仓库管理",
    "bizForm": "其他出库单（普通）",
    "kingdeeForm": "其他出库单（普通）",
    "upstream": "出库申请",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "领用组织"
      },
      {
        "name": "库存方向"
      },
      {
        "name": "日期"
      },
      {
        "name": "领料部门"
      },
      {
        "name": "领料人"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "钉钉编号"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称",
            "sample": "（自动带出）"
          },
          {
            "name": "规格型号",
            "sample": "（自动带出）"
          },
          {
            "name": "单位",
            "sample": "（自动带出）"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "发货仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "产品组"
          },
          {
            "name": "货主"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 34,
    "module": "仓库管理",
    "bizForm": "其他出库单（退货）",
    "kingdeeForm": "其他出库单（退货）",
    "upstream": "其他出库单（普通）",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "领用组织"
      },
      {
        "name": "库存方向"
      },
      {
        "name": "日期"
      },
      {
        "name": "领料部门"
      },
      {
        "name": "领料人"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "钉钉编号"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称",
            "sample": "（自动带出）"
          },
          {
            "name": "规格型号",
            "sample": "（自动带出）"
          },
          {
            "name": "单位",
            "sample": "（自动带出）"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "发货仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "产品组"
          },
          {
            "name": "货主"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 35,
    "module": "仓库管理",
    "bizForm": "出库申请单",
    "kingdeeForm": "调拨申请",
    "upstream": "",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "申请组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "调拨类型"
      },
      {
        "name": "调拨方向"
      },
      {
        "name": "申请日期"
      },
      {
        "name": "调出货主类型"
      },
      {
        "name": "调入货主类型"
      },
      {
        "name": "备注"
      },
      {
        "name": "销售员"
      },
      {
        "name": "多选指定审批人"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "调出组织"
          },
          {
            "name": "调出仓库"
          },
          {
            "name": "调出仓位"
          },
          {
            "name": "调入组织"
          },
          {
            "name": "调入仓库"
          },
          {
            "name": "调入仓位"
          },
          {
            "name": "调出货主"
          },
          {
            "name": "调入货主"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 36,
    "module": "仓库管理",
    "bizForm": "其他出库单（普通）",
    "kingdeeForm": "直接调拨单",
    "upstream": "",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "调拨类型"
      },
      {
        "name": "调拨方向"
      },
      {
        "name": "调出库存组织"
      },
      {
        "name": "调出货主类型"
      },
      {
        "name": "调出货主"
      },
      {
        "name": "调入库存组织"
      },
      {
        "name": "调入货主类型"
      },
      {
        "name": "调入货主"
      },
      {
        "name": "多选指定审批人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "日期"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "调拨数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "调出仓库"
          },
          {
            "name": "调出仓位"
          },
          {
            "name": "调入仓库"
          },
          {
            "name": "调入仓位"
          },
          {
            "name": "调出库存状态"
          },
          {
            "name": "调入库存状态"
          },
          {
            "name": "调出货主"
          },
          {
            "name": "调入货主"
          },
          {
            "name": "备注"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 37,
    "module": "仓库管理",
    "bizForm": "其他入库单",
    "kingdeeForm": "其他入库单",
    "upstream": "",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "库存方向"
      },
      {
        "name": "日期"
      },
      {
        "name": "部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "货主"
      },
      {
        "name": "研发项目"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "收货仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "仓位"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "备注"
          },
          {
            "name": "货主"
          }
        ]
      }
    ]
  },
  {
    "id": 38,
    "module": "仓库管理",
    "bizForm": "调拨申请",
    "kingdeeForm": "调拨申请",
    "upstream": "",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "申请组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "调拨类型"
      },
      {
        "name": "调拨方向"
      },
      {
        "name": "申请日期"
      },
      {
        "name": "调出货主类型"
      },
      {
        "name": "调入货主类型"
      },
      {
        "name": "备注"
      },
      {
        "name": "销售员"
      },
      {
        "name": "多选指定审批人"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "申请数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "调出组织"
          },
          {
            "name": "调出仓库"
          },
          {
            "name": "调出仓位"
          },
          {
            "name": "调入组织"
          },
          {
            "name": "调入仓库"
          },
          {
            "name": "调入仓位"
          },
          {
            "name": "调出货主"
          },
          {
            "name": "调入货主"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 39,
    "module": "仓库管理",
    "bizForm": "直接调拨单",
    "kingdeeForm": "直接调拨单",
    "upstream": "调拨申请",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "调拨类型"
      },
      {
        "name": "调拨方向"
      },
      {
        "name": "调出库存组织"
      },
      {
        "name": "调出货主类型"
      },
      {
        "name": "调出货主"
      },
      {
        "name": "调入库存组织"
      },
      {
        "name": "调入货主类型"
      },
      {
        "name": "调入货主"
      },
      {
        "name": "多选指定审批人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "日期"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类型"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "调拨数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "调出仓库"
          },
          {
            "name": "调出仓位"
          },
          {
            "name": "调入仓库"
          },
          {
            "name": "调入仓位"
          },
          {
            "name": "调出库存状态"
          },
          {
            "name": "调入库存状态"
          },
          {
            "name": "调出货主"
          },
          {
            "name": "调入货主"
          },
          {
            "name": "备注"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 40,
    "module": "仓库管理",
    "bizForm": "其他入库单",
    "kingdeeForm": "直接调拨单",
    "upstream": "调拨申请",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "库存方向"
      },
      {
        "name": "日期"
      },
      {
        "name": "部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "货主"
      },
      {
        "name": "研发项目"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "收货仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "仓位"
          },
          {
            "name": "实收数量"
          },
          {
            "name": "备注"
          },
          {
            "name": "货主"
          }
        ]
      }
    ]
  },
  {
    "id": 41,
    "module": "仓库管理",
    "bizForm": "拆卸单",
    "kingdeeForm": "拆卸单",
    "upstream": "",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "库存组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "事务类型",
        "sample": "拆卸"
      },
      {
        "name": "库存实物"
      },
      {
        "name": "日期"
      },
      {
        "name": "部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表-成品明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          }
        ]
      },
      {
        "title": "明细表-组装后物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "单位"
          },
          {
            "name": "数量"
          },
          {
            "name": "批号"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "库存状态"
          },
          {
            "name": "备注"
          }
        ]
      },
      {
        "title": "成品序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      },
      {
        "title": "子件序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 42,
    "module": "仓库管理",
    "bizForm": "差异单",
    "kingdeeForm": "盘盈/盘亏单",
    "upstream": "",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "库存组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "货主类型"
      },
      {
        "name": "货主"
      },
      {
        "name": "日期"
      },
      {
        "name": "部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "备注"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "批号"
          },
          {
            "name": "单位"
          },
          {
            "name": "盘点数量"
          },
          {
            "name": "盘盈数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "货主"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 43,
    "module": "仓库管理",
    "bizForm": "库存核对表",
    "kingdeeForm": "",
    "upstream": "",
    "direction": "不传递",
    "note": "",
    "dirType": "NONE",
    "header": [],
    "details": []
  },
  {
    "id": 44,
    "module": "销售管理",
    "bizForm": "发货通知单",
    "kingdeeForm": "发货通知单",
    "upstream": "销售订单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "发货组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "结算币别"
      },
      {
        "name": "销售组织"
      },
      {
        "name": "销售部门"
      },
      {
        "name": "客户"
      },
      {
        "name": "非电商指定审批人"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "销售员"
      },
      {
        "name": "区分国内国外"
      },
      {
        "name": "备注"
      },
      {
        "name": "备注2"
      },
      {
        "name": "备注11"
      },
      {
        "name": "贸易方式"
      },
      {
        "name": "收货人姓名"
      },
      {
        "name": "手机号"
      },
      {
        "name": "收货方地址"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类别"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "销售单位"
          },
          {
            "name": "销售数量"
          },
          {
            "name": "是否赠品"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "要货日期"
          },
          {
            "name": "销售项目"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 45,
    "module": "销售管理",
    "bizForm": "销售出库单",
    "kingdeeForm": "销售出库单",
    "upstream": "发货通知单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "发货组织"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "结算币别"
      },
      {
        "name": "销售组织"
      },
      {
        "name": "销售部门"
      },
      {
        "name": "客户"
      },
      {
        "name": "销售组"
      },
      {
        "name": "销售员"
      },
      {
        "name": "最后签收时间"
      },
      {
        "name": "收入确认"
      },
      {
        "name": "物流公司"
      },
      {
        "name": "物流单号"
      },
      {
        "name": "寄件人号码"
      },
      {
        "name": "物流状态"
      },
      {
        "name": "签收时间"
      },
      {
        "name": "贸易方式"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类别"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "子序列号"
          },
          {
            "name": "库存单位"
          },
          {
            "name": "应发数量"
          },
          {
            "name": "实发数量"
          },
          {
            "name": "是否赠品"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "批号"
          },
          {
            "name": "备注"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 46,
    "module": "销售管理",
    "bizForm": "退货通知单",
    "kingdeeForm": "退货通知单",
    "upstream": "销售出库单",
    "direction": "金蝶→MOM",
    "note": "",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据编号"
      },
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "销售组织"
      },
      {
        "name": "销售部门"
      },
      {
        "name": "退货客户"
      },
      {
        "name": "结算币别"
      },
      {
        "name": "退货原因"
      },
      {
        "name": "销售员"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "库存部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "其他退货备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类别"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "销售单位"
          },
          {
            "name": "销售数量"
          },
          {
            "name": "退货日期"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "退货类型"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 47,
    "module": "销售管理",
    "bizForm": "销售退货单",
    "kingdeeForm": "销售退货单",
    "upstream": "退货通知单",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "日期"
      },
      {
        "name": "销售组织"
      },
      {
        "name": "销售部门"
      },
      {
        "name": "退货客户"
      },
      {
        "name": "结算币别"
      },
      {
        "name": "退货原因"
      },
      {
        "name": "销售员"
      },
      {
        "name": "库存组织"
      },
      {
        "name": "库存部门"
      },
      {
        "name": "仓管员"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "其他退货备注"
      }
    ],
    "details": [
      {
        "title": "物料明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "产品类别"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "销售单位"
          },
          {
            "name": "应退数量"
          },
          {
            "name": "实退数量"
          },
          {
            "name": "退货日期"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "退货类型"
          },
          {
            "name": "备注"
          },
          {
            "name": "销售项目"
          }
        ]
      },
      {
        "title": "序列号",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "序列号"
          },
          {
            "name": "备注"
          }
        ]
      }
    ]
  },
  {
    "id": 48,
    "module": "供应商协同",
    "bizForm": "供应商问题通知书/供应商质量事故告知函",
    "kingdeeForm": "质量问题通知",
    "upstream": "",
    "direction": "MOM→金蝶",
    "note": "",
    "dirType": "M2K",
    "header": [
      {
        "name": "通知单号"
      },
      {
        "name": "单据类型",
        "sample": "供应商质量事故告知函"
      },
      {
        "name": "供应商编码"
      },
      {
        "name": "供应商名称"
      },
      {
        "name": "发出日期"
      },
      {
        "name": "问题等级"
      },
      {
        "name": "问题描述"
      },
      {
        "name": "处理要求"
      }
    ],
    "details": [
      {
        "title": "不良明细",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "不良数量"
          },
          {
            "name": "不良现象"
          },
          {
            "name": "处置方式"
          }
        ]
      }
    ]
  },
  {
    "id": 49,
    "module": "采购管理",
    "bizForm": "送货通知单",
    "kingdeeForm": "送货通知单(SRM)",
    "upstream": "采购订单",
    "direction": "SRM→中台→MOM",
    "note": "来源 SRM 系统",
    "dirType": "K2M",
    "header": [
      {
        "name": "单据类型"
      },
      {
        "name": "业务类型"
      },
      {
        "name": "单据编号"
      },
      {
        "name": "通知日期"
      },
      {
        "name": "单据状态"
      },
      {
        "name": "指定审批人"
      },
      {
        "name": "物流单号"
      },
      {
        "name": "收货地址"
      },
      {
        "name": "验收方式"
      },
      {
        "name": "供应商"
      },
      {
        "name": "编号"
      }
    ],
    "details": [
      {
        "title": "明细表",
        "fields": [
          {
            "name": "序号"
          },
          {
            "name": "物料编码"
          },
          {
            "name": "物料名称"
          },
          {
            "name": "规格型号"
          },
          {
            "name": "送料单位"
          },
          {
            "name": "送货数量"
          },
          {
            "name": "仓库"
          },
          {
            "name": "仓位"
          },
          {
            "name": "采购员"
          }
        ]
      }
    ]
  }
]

export const bizModules = ['生产管理', '委外管理', '采购管理', '仓库管理', '销售管理', '供应商协同']
