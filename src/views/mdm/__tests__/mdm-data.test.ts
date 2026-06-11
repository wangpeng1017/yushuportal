import { describe, expect, it } from 'vitest'
import { bizInterfaces, bizModules } from '../erp-schema'
import { bizDocs } from '../biz-doc-data'
import { staticCategories } from '../static-data'

describe('静态主数据（基础资料）', () => {
  it('共 8 类，与接口清单一一对应，仓位（不对接）已去除', () => {
    expect(staticCategories.map((c) => c.key)).toEqual([
      'material',
      'bom',
      'warehouse',
      'employee',
      'dept',
      'rdProject',
      'buildProject',
      'saleProject'
    ])
    expect(staticCategories.find((c) => c.name === '仓位')).toBeUndefined()
  })

  it('每类都有测试数据', () => {
    for (const c of staticCategories) {
      expect(c.rows.length, c.name).toBeGreaterThan(0)
      expect(c.fields.length, c.name).toBeGreaterThan(0)
    }
  })

  it('物料含 0527 新增的"是否危化品"字段，锂电池电芯为危化品', () => {
    const mat = staticCategories.find((c) => c.key === 'material')!
    expect(mat.fields).toContain('是否危化品')
    const cell = mat.rows.find((r) => r.name === '锂电池电芯')
    expect(cell?.data['是否危化品']).toBe('是')
  })

  it('BOM 为主子表结构：标准套件 BOM 有 7 行子项且含替代件', () => {
    const bom = staticCategories.find((c) => c.key === 'bom')!
    const std = bom.rows.find((r) => r.code === '08.01.01.00018_VB')!
    expect(std.details?.[0].rows).toHaveLength(7)
    expect(std.details?.[0].rows.some((r) => r['子项类型'] === '替代件')).toBe(true)
  })
})

describe('业务接口（48 接口全量）', () => {
  it('覆盖宇树清单全部 39 个业务接口（编号 10-48）+ 送货通知单', () => {
    const ids = bizInterfaces.map((i) => i.id).sort((a, b) => a - b)
    const expected = Array.from({ length: 40 }, (_, k) => k + 10)
    expect(ids).toEqual(expected)
  })

  it('六大模块齐全且接口数正确', () => {
    const count = (m: string) => bizInterfaces.filter((i) => i.module === m).length
    expect(bizModules).toHaveLength(6)
    expect(count('生产管理')).toBe(9)
    expect(count('委外管理')).toBe(7)
    expect(count('采购管理')).toBe(7)
    expect(count('仓库管理')).toBe(12)
    expect(count('销售管理')).toBe(4)
    expect(count('供应商协同')).toBe(1)
  })

  it('除"库存核对表"（不传递）外，每个接口都有主表字段和 ≥3 张测试单据', () => {
    for (const i of bizInterfaces) {
      const docs = bizDocs.filter((d) => d.interfaceId === i.id)
      if (i.bizForm === '库存核对表') {
        expect(i.dirType).toBe('NONE')
        expect(docs).toHaveLength(0)
        continue
      }
      expect(i.header.length, i.bizForm).toBeGreaterThan(0)
      expect(docs.length, i.bizForm).toBeGreaterThanOrEqual(3)
    }
  })

  it('动态单据均为主子表格式：明细段有字段且测试单据明细行非空', () => {
    for (const i of bizInterfaces) {
      if (i.dirType === 'NONE') continue
      expect(i.details.length, i.bizForm).toBeGreaterThan(0)
      for (const d of bizDocs.filter((x) => x.interfaceId === i.id)) {
        expect(d.details[0]?.length, d.billNo).toBeGreaterThan(0)
      }
    }
  })
})

describe('业务单据测试数据', () => {
  it('单据编号全局唯一', () => {
    const nos = bizDocs.map((d) => d.billNo)
    expect(new Set(nos).size).toBe(nos.length)
  })

  it('上游链路引用有效（upstreamDocId 指向存在单据且接口匹配）', () => {
    const byId = new Map(bizDocs.map((d) => [d.id, d]))
    const linked = bizDocs.filter((d) => d.upstreamDocId)
    expect(linked.length).toBeGreaterThan(0)
    for (const d of linked) {
      const up = byId.get(d.upstreamDocId!)
      expect(up, d.billNo).toBeDefined()
      expect(up!.billNo).toBe(d.upstreamBillNo)
      expect(up!.interfaceId).toBe(d.upstreamInterfaceId)
    }
  })

  it('同步状态枚举合法，且存在"同步失败"样例供手工重传演示', () => {
    const valid = ['已同步', '同步失败', '待同步']
    for (const d of bizDocs) {
      expect(valid).toContain(d.syncStatus)
    }
    expect(bizDocs.some((d) => d.syncStatus === '同步失败')).toBe(true)
  })

  it('0527 拍板：金蝶→MOM 单据创建人为金蝶ERP，MOM 回传单据体现实际创建人', () => {
    const metaById = new Map(bizInterfaces.map((i) => [i.id, i]))
    for (const d of bizDocs) {
      const meta = metaById.get(d.interfaceId)!
      if (meta.dirType === 'K2M') {
        expect(d.creator, d.billNo).toBe('金蝶ERP')
      } else if (meta.dirType === 'M2K') {
        expect(d.creator, d.billNo).not.toBe('金蝶ERP')
        expect(d.creator.length, d.billNo).toBeGreaterThan(1)
      }
    }
  })

  it('生产链路贯通：生产订单 → 用料清单 → 领料 → 汇报 → 入库可追溯', () => {
    const moMeta = bizInterfaces.find((i) => i.id === 10)!
    const rkMeta = bizInterfaces.find((i) => i.id === 18)!
    expect(moMeta.kingdeeForm).toBe('生产订单')
    expect(rkMeta.kingdeeForm).toBe('完工入库单')
    const rkDoc = bizDocs.find((d) => d.interfaceId === 18 && d.upstreamDocId)
    expect(rkDoc).toBeDefined()
    // 沿上游一直走，最多 6 跳应能到达无上游的源头单据
    const byId = new Map(bizDocs.map((d) => [d.id, d]))
    let cur = rkDoc!
    let hops = 0
    while (cur.upstreamDocId && hops < 6) {
      cur = byId.get(cur.upstreamDocId)!
      hops++
    }
    expect(hops).toBeGreaterThanOrEqual(2)
  })
})
