# -*- coding: utf-8 -*-
"""从 ERP 接口清单 Excel 生成 MDM mock 数据层（erp-schema.ts / static-data.ts / biz-doc-data.ts）"""
import json
import pandas as pd

F_FIELDS = '/Users/wangpeng/Desktop/ERP接口清单及字段.xlsx'
F_LIST = '/Users/wangpeng/Desktop/宇树-ERP接口清单.xlsx'
OUT_DIR = '/Users/wangpeng/Downloads/0201yushu/xitong/iimake-made-portal/iimake-made-portal/src/views/mdm'

# ---------- 1. 解析字段明细工作簿 ----------
xl = pd.ExcelFile(F_FIELDS)
sheet_defs = {}
for s in xl.sheet_names[1:]:
    df = xl.parse(s, header=None)
    header = []
    sections = []
    cur = ('header', header)
    for _, r in df.iterrows():
        c0 = str(r[0]).strip() if pd.notna(r[0]) else ''
        if c0:
            if '主表' in c0:
                cur = ('header', header)
            elif c0.startswith('若是'):
                cur = ('skipmark', None)
            else:
                sec = {'title': c0, 'fields': []}
                sections.append(sec)
                cur = ('detail', sec['fields'])
            # 序列号小节标题行右侧可能直接带字段（成品序列号|序号）
            if cur[0] == 'detail' and len(r) > 1 and pd.notna(r[1]):
                cur[1].append({'name': str(r[1]).strip()})
            continue
        if len(r) > 1 and pd.notna(r[1]):
            name = str(r[1]).strip()
            fd = {'name': name}
            if len(r) > 2 and pd.notna(r[2]):
                v2 = str(r[2]).strip()
                if '、' in v2 and len(v2) > 6:
                    fd['enum'] = v2.split('、')
                    if len(r) > 3 and pd.notna(r[3]):
                        fd['sample'] = str(r[3]).strip()
                else:
                    fd['sample'] = v2.split(' ')[0] if v2.startswith('2025-') or v2.startswith('9999-') else v2
            if cur[0] == 'header':
                header.append(fd)
            elif cur[0] == 'detail':
                cur[1].append(fd)
        else:
            if cur[0] == 'skipmark':
                continue
    sheet_defs[s] = {'header': header, 'details': [x for x in sections if x['fields']]}

# 仓库列表特殊：截掉尾部仓位值集两行
sheet_defs['仓库列表']['header'] = [f for f in sheet_defs['仓库列表']['header'] if '仓位值集' not in f['name']]

# ---------- 2. 解析宇树接口清单 ----------
lst = pd.read_excel(F_LIST, sheet_name='接口清单', header=0)
biz_rows = []
for _, r in lst.iterrows():
    if pd.isna(r['编号']) or str(r['模块']).strip() == '基础资料':
        continue
    mod = str(r['模块']).strip()
    if mod == '委外管理/采购管理':
        mod = '采购管理'
    biz_rows.append({
        'id': int(r['编号']),
        'module': mod,
        'bizForm': str(r['业务表单']).strip(),
        'kingdeeForm': '' if pd.isna(r['金蝶表单']) else str(r['金蝶表单']).strip(),
        'upstream': '' if pd.isna(r['上游关联单据']) or str(r['上游关联单据']).strip() == '无' else str(r['上游关联单据']).strip(),
        'direction': '' if pd.isna(r['传递方向']) else str(r['传递方向']).strip(),
        'note': '' if pd.isna(r['备注']) else str(r['备注']).strip(),
    })
# 补充：送货通知单（SRM，仅在字段清单文件中存在）
biz_rows.append({'id': 49, 'module': '采购管理', 'bizForm': '送货通知单', 'kingdeeForm': '送货通知单(SRM)',
                 'upstream': '采购订单', 'direction': 'SRM→中台→MOM', 'note': '来源 SRM 系统'})

SHEET_MAP = {
    10: '生产订单', 11: '生产订单变更单', 12: '生产用料清单', 13: '生产用料清单变更单',
    14: '生产领料单', 15: '生产补料单', 16: '生产退料单', 17: '生产汇报单', 18: '生产入库单',
    19: '委外订单', 20: '委外订单变更单', 21: '委外用料清单', 22: '委外领料单',
    23: '委外退料单', 24: '委外补料单', 25: '生产入库单', 26: '采购订单',
    27: '收料通知单', 28: '采购入库单', 29: '采购退料单', 30: '采购退料单', 31: '采购退料单',
    32: '出库申请单', 33: '其他出库单', 34: '其他出库单', 35: '调拨申请单', 36: '直接调拨单',
    37: '其他入库单', 38: '调拨申请单', 39: '直接调拨单', 40: '其他入库单',
    41: '组装拆卸单单', 42: '盘盈单', 43: None, 44: '发货通知单', 45: '销售出库单',
    46: '退货通知单', 47: '销售退货单', 48: None, 49: '送货通知单',
}
# 48 供应商质量问题通知：手工 schema
QUALITY_SCHEMA = {
    'header': [{'name': '通知单号'}, {'name': '单据类型', 'sample': '供应商质量事故告知函'}, {'name': '供应商编码'},
               {'name': '供应商名称'}, {'name': '发出日期'}, {'name': '问题等级'}, {'name': '问题描述'}, {'name': '处理要求'}],
    'details': [{'title': '不良明细', 'fields': [{'name': '序号'}, {'name': '物料编码'}, {'name': '物料名称'},
                {'name': '规格型号'}, {'name': '不良数量'}, {'name': '不良现象'}, {'name': '处置方式'}]}],
}

def dir_type(s):
    if not s or '不传' in s or '不对接' in s:
        return 'NONE'
    has_k2m, has_m2k = '金蝶→MOM' in s, 'MOM→金蝶' in s
    if 'SRM' in s:
        return 'K2M'
    if has_k2m and has_m2k:
        return 'BOTH'
    if has_m2k:
        return 'M2K'
    return 'K2M'

interfaces = []
for b in biz_rows:
    sheet = SHEET_MAP.get(b['id'])
    schema = QUALITY_SCHEMA if b['id'] == 48 else (sheet_defs.get(sheet) if sheet else None)
    interfaces.append({**b, 'dirType': dir_type(b['direction']),
                       'header': schema['header'] if schema else [],
                       'details': schema['details'] if schema else []})

# ---------- 3. 测试数据值池（GO2 机器狗业务线） ----------
MATS = [
    ('08.01.01.00018', '标准版套件-欧标（含电池）', 'GO2-EU-STD', 'PCS', '自制', '是'),
    ('00.01.01.00018', '标准版套件-欧标（不含电池）', 'GO2-EU-STD-NB', 'PCS', '自制', '否'),
    ('11.09.06.00008', '充电线A', 'EU-2PIN-1.5M', 'PCS', '外购', '否'),
    ('11.09.06.00009', '充电线B', 'EU-2PIN-2M', 'PCS', '外购', '否'),
    ('11.09.06.00010', '充电线C', 'EU-3PIN-1.5M', 'PCS', '外购', '否'),
    ('11.03.07.00024', '充电器', '54V-3A-EU', 'PCS', '自制', '否'),
    ('11.08.00022', '说明书', 'GO2-CN/EN', 'PCS', '外购', '否'),
    ('11.10.00004', '返修卡', 'STD-2026', 'PCS', '外购', '否'),
    ('11.02.01.01.00029', 'GO2', 'GO2-AIR', 'PCS', '自制', '否'),
    ('12.01.00001', '电池包', '8000mAh-58V', 'PCS', '自制', '否'),
    ('12.02.00007', '关节电机组件', 'M107-V2', 'PCS', '委外', '否'),
    ('12.03.00015', '主控板', 'MCB-GO2-V3', 'PCS', '外购', '否'),
    ('12.04.00021', '足端橡胶套', 'RB-FOOT-04', 'PCS', '外购', '否'),
    ('13.01.00002', '包装箱', 'GO2-CARTON', 'PCS', '外购', '否'),
    ('14.05.00011', '锂电池电芯', 'INR21700-50E', 'PCS', '外购', '是'),
]
SUPS = [('S0001', '苏州精工线材有限公司'), ('S0002', '深圳华芯电子科技'), ('S0003', '宁波精密注塑制品'),
        ('S0004', '杭州智控机电（委外）'), ('S0005', '常州动力电池科技')]
CUSTS = [('C0001', '杭州京东世纪贸易'), ('C0002', '欧洲经销商 RoboEU GmbH'), ('C0003', '深圳天猫旗舰店运营方')]
WHS = [('CK001', '原材料仓'), ('CK002', '半成品仓'), ('CK003', '成品仓'), ('CK004', '委外仓'), ('CK005', '不良品仓'), ('CK006', '包材仓')]
DEPTS = [('BM001', '生产部'), ('BM002', '采购部'), ('BM003', '仓储部'), ('BM004', '质量部'), ('BM005', '研发部'), ('BM006', '销售部')]
EMPS = [('YG001', '乃永刚'), ('YG002', '王芳'), ('YG003', '李军'), ('YG004', '张敏'),
        ('YG005', '赵磊'), ('YG006', '陈静'), ('YG007', '刘洋'), ('YG008', '周婷')]
DATES = ['2026-05-20', '2026-05-26', '2026-06-02', '2026-06-08', '2026-06-11']
STATUSES = ['已同步', '已同步', '同步失败', '待同步', '已同步']
QTYS = ['100', '500', '50', '200', '20', '350', '8']

PREFIX = [('生产订单变更', 'MOC'), ('生产用料清单变更', 'PPBC'), ('生产用料清单', 'PPB'), ('生产订单', 'MO'),
          ('生产领料', 'SLL'), ('生产补料', 'SBL'), ('生产退料', 'STL'), ('生产汇报', 'SHB'), ('生产入库', 'SRK'),
          ('委外订单变更', 'WOC'), ('委外用料清单变更', 'WBC'), ('委外用料清单', 'WYB'), ('委外订单', 'WO'),
          ('委外领料', 'WLL'), ('委外退料', 'WTL'), ('委外补料', 'WBL'), ('委外收料', 'WSL'),
          ('采购订单', 'PO'), ('收料', 'SLT'), ('采购入库', 'CRK'), ('采购退料', 'CTL'), ('退料申请', 'TLA'),
          ('送货通知', 'SHT'), ('出库申请单', 'CKA'), ('出库申请', 'CKA'), ('其他出库', 'QCK'), ('其他入库', 'QRK'),
          ('调拨申请', 'DBA'), ('直接调拨', 'DBD'), ('拆卸', 'CXD'), ('差异', 'CYD'),
          ('发货通知', 'FHT'), ('销售出库', 'XCK'), ('退货通知', 'THT'), ('销售退货', 'XTH'), ('供应商问题', 'ZLT')]

def prefix_of(name):
    for k, v in PREFIX:
        if k in name:
            return v
    return 'DOC'

BILL_TYPE_SAMPLE = {'单据类型': None}

def fill_value(fname, fd, i, j, ctx):
    """按字段名启发式生成测试值。i=单据序号 j=明细行序号 ctx=接口上下文"""
    m = MATS[(i * 3 + j) % len(MATS)]
    sup = SUPS[i % len(SUPS)]
    cust = CUSTS[i % len(CUSTS)]
    wh = WHS[(i + j) % len(WHS)]
    emp = EMPS[(i + j) % len(EMPS)]
    if fd.get('enum'):
        return fd['enum'][i % len(fd['enum'])]
    n = fname
    if '序号' in n or n == '项次':
        return str(j + 1)
    if '单据编号' in n or n == '编号':
        return ctx['billNo']
    if 'BOM版本' in n:
        return '08.01.01.00018_VB'
    if '物料编码' in n or '子项' in n and '编码' in n:
        return m[0]
    if '物料名称' in n:
        return m[1]
    if '规格' in n:
        return m[2]
    if '单据类型' in n:
        return ctx['kingdeeForm'] or ctx['bizForm']
    if '业务类型' in n:
        return '标准' + ctx['module'].replace('管理', '')
    if '日期' in n or '时间' in n:
        return ctx['billDate']
    if '供应商编码' in n:
        return sup[0]
    if '供应商' in n:
        return sup[1]
    if '客户编码' in n:
        return cust[0]
    if '客户' in n:
        return cust[1]
    if '仓位' in n:
        return wh[0] + '-A-0' + str(j + 1)
    if '仓库' in n or '调出' in n or '调入' in n:
        return wh[1]
    if '组织' in n:
        return '宇树科技'
    if '车间' in n:
        return '总装车间' if i % 2 == 0 else '部装车间'
    if '部门' in n:
        return DEPTS[i % len(DEPTS)][1]
    if '批号' in n:
        return 'LOT2026' + str(600 + i * 7 + j)
    if '序列号' in n:
        return 'SN-GO2-2026' + str(10000 + i * 53 + j)
    if '数量' in n:
        return QTYS[(i + j) % len(QTYS)]
    if '单位' in n:
        return 'PCS'
    if '单价' in n or '金额' in n:
        return str(880 + i * 35)
    if '状态' in n:
        return '已审核'
    if '是否' in n or n in ('套件', '允许锁库', '参与拣货', '参与预警'):
        return '是' if (i + j) % 3 == 0 else '否'
    if '地址' in n:
        return '浙江省杭州市滨江区宇树科技产业园 ' + str(i + 1) + ' 号库'
    if '物流单号' in n:
        return 'SF20266' + str(8800 + i * 13)
    if '审批' in n or '审核' in n:
        return '秦兴国'
    if '采购员' in n or '仓管员' in n or '创建人' in n or '修改人' in n or '负责人' in n or '人' in n[-1:]:
        return emp[1]
    if '备注' in n:
        return 'GO2 欧标套件 6 月批次' if i % 2 == 0 else ''
    if '等级' in n:
        return ['一般', '严重', '重大'][i % 3]
    if '描述' in n:
        return '充电线A 端子压接不良，抽检不良率 2.3%'
    if '要求' in n:
        return '7 日内提交 8D 报告并完成围堵'
    if '现象' in n:
        return '端子松脱 / 接触电阻超标'
    if '处置' in n:
        return ['退货', '挑选使用', '让步接收'][j % 3]
    if '工时' in n:
        return '10'
    if '项目' in n and '编' in n:
        return 'RB11'
    if fd.get('sample'):
        return fd['sample']
    return '—'

# ---------- 4. 生成业务单据 ----------
docs = []
doc_seq = {}
docs_by_iface = {}
for it in interfaces:
    if it['dirType'] == 'NONE' or not it['header']:
        docs_by_iface[it['id']] = []
        continue
    count = 5 if it['id'] in (10, 12, 14, 17, 18, 26, 27, 28, 44, 45) else 3
    arr = []
    pre = prefix_of(it['bizForm'] + '|' + it['kingdeeForm'])
    for i in range(count):
        doc_seq[pre] = doc_seq.get(pre, 0) + 1
        bill_no = '%s202606%03d' % (pre, doc_seq[pre])
        ctx = {'billNo': bill_no, 'billDate': DATES[i % len(DATES)],
               'bizForm': it['bizForm'], 'kingdeeForm': it['kingdeeForm'], 'module': it['module']}
        k = (it['id'] + i) % 7
        status = '同步失败' if k == 3 else ('待同步' if k == 5 else '已同步')
        creator = '金蝶ERP' if it['dirType'] == 'K2M' else EMPS[i % len(EMPS)][1]
        header = {f['name']: fill_value(f['name'], f, i, 0, ctx) for f in it['header']}
        details = []
        for si, sec in enumerate(it['details']):
            rows = []
            nrow = 2 if '序列号' in sec['title'] else (3 + (i + len(arr)) % 4)
            for j in range(nrow):
                rows.append({f['name']: fill_value(f['name'], f, i, j, ctx) for f in sec['fields']})
            details.append(rows)
        arr.append({'id': 'doc-%d-%d' % (it['id'], i + 1), 'interfaceId': it['id'], 'billNo': bill_no,
                    'billDate': ctx['billDate'], 'syncStatus': status, 'creator': creator,
                    'header': header, 'details': details})
    docs_by_iface[it['id']] = arr
    docs.extend(arr)

# 上游链路：单据 i 关联上游接口的第 i % n 张单
name_index = {}
for it in interfaces:
    name_index.setdefault(it['bizForm'], []).append(it)
for it in interfaces:
    if not it['upstream']:
        continue
    UPSTREAM_ALIAS = {'生产工单': '生产订单', '收料通知': '收料单'}
    ups = [u for u in it['upstream'].replace('（', '(').split('/') if u]
    target = None
    for u in ups:
        u = UPSTREAM_ALIAS.get(u.strip(), u.strip())
        for cand in interfaces:
            if cand['id'] == it['id'] or not docs_by_iface.get(cand['id']):
                continue
            names = [cand['bizForm'], cand['kingdeeForm']]
            if any(n and (u in n or n in u) for n in names):
                target = cand
                break
        if target:
            break
    if not target:
        continue
    tdocs = docs_by_iface[target['id']]
    for i, d in enumerate(docs_by_iface.get(it['id'], [])):
        up = tdocs[i % len(tdocs)]
        d['upstreamDocId'] = up['id']
        d['upstreamBillNo'] = up['billNo']
        d['upstreamInterfaceId'] = target['id']

# ---------- 5. 静态主数据 ----------
def srow(idx, code, name, data, details=None):
    r = {'id': idx, 'code': code, 'name': name,
         'status': '已审核' if idx % 7 else '未审核', 'source': 'ERP',
         'syncTime': DATES[idx % len(DATES)] + ' 0' + str(8 + idx % 9) + ':1' + str(idx % 6) + ':00',
         'data': data}
    if details:
        r['details'] = details
    return r

mat_fields = [f['name'] for f in sheet_defs['物料接口']['header']] + ['是否危化品']
mat_rows = []
extra = {'物料分组': '机器狗', '物料属性': '自制', '套件': '否', '基本单位': 'PCS', '存货类别': '原材料',
         '项目编号': 'RB11', '产品分类': 'GO2', '产品归属': 'C端', '库存单位': 'PCS', '启用批号管理': '是',
         '后端采购员': '乃永刚', '标准工时': '2', '人员实作工时': '2', '负责人': '乃永刚'}
for i, m in enumerate(MATS):
    d = dict(extra)
    d.update({'物料编码': m[0], '物料名称': m[1], '规格型号': m[2], '基本单位': m[3], '库存单位': m[3],
              '物料属性': m[4], '是否危化品': m[5], '套件': '是' if '套件' in m[1] else '否',
              '存货类别': '产成品' if m[4] == '自制' and '套件' in m[1] else ('半成品' if m[4] == '自制' else '原材料'),
              '后端采购员': EMPS[i % len(EMPS)][1], '负责人': EMPS[(i + 1) % len(EMPS)][1],
              '标准工时': '10' if '套件' in m[1] else '2', '人员实作工时': '10' if '套件' in m[1] else '2'})
    if i == 0:
        d.update({'物料分组': '机器狗', '存货类别': '产成品', '项目编号': 'RB11', '产品分类': 'GO2', '产品归属': 'C端'})
    mat_rows.append(srow(i + 1, m[0], m[1], d))

bom_header_fields = [f['name'] for f in sheet_defs['BOM接口']['header']]
bom_child_fields = [f['name'] for f in sheet_defs['BOM接口']['details'][0]['fields']]
BOM_CHILDREN_MAIN = [
    ('11.09.06.00008', '充电线A', '外购', '标准件', '直接领料', '10'),
    ('11.09.06.00009', '充电线B', '外购', '替代件', '直接领料', '10'),
    ('11.09.06.00010', '充电线C', '外购', '替代件', '直接领料', '10'),
    ('11.03.07.00024', '充电器', '自制', '标准件', '直接领料', '20'),
    ('11.08.00022', '说明书', '外购', '标准件', '直接领料', '30'),
    ('11.10.00004', '返修卡', '外购', '标准件', '直接领料', '40'),
    ('11.02.01.01.00029', 'GO2', '自制', '标准件', '直接领料', '50'),
]
BOM_CHILDREN_GO2 = [
    ('12.02.00007', '关节电机组件', '委外', '标准件', '调拨领料', '10'),
    ('12.03.00015', '主控板', '外购', '标准件', '直接领料', '20'),
    ('12.04.00021', '足端橡胶套', '外购', '标准件', '直接倒冲', '30'),
    ('12.01.00001', '电池包', '自制', '标准件', '直接领料', '40'),
    ('13.01.00002', '包装箱', '外购', '标准件', '不发料', '50'),
]
BOM_CHILDREN_BAT = [
    ('14.05.00011', '锂电池电芯', '外购', '标准件', '直接领料', '10'),
    ('12.03.00015', '主控板', '外购', '标准件', '直接领料', '20'),
    ('13.01.00002', '包装箱', '外购', '标准件', '不发料', '30'),
]

def bom_row(idx, ver, parent_code, parent_name, children, projn=1):
    head = {'BOM版本': ver, 'BOM简称': ver + '_VB' if not ver.endswith('_VB') else ver, '单据类型': '物料清单',
            '父项物料编码': parent_code, '父项物料名称': parent_name, '父项物料单位': 'PCS', '父项标准工时': '10',
            'BOM分类': '标准BOM', 'BOM用途': '通用', '物料属性': '自制', 'BOM分组': '销售套件GO2'}
    rows = []
    for j, c in enumerate(children):
        rows.append({'项次': str(j + 1), '子项物料编码': c[0], '子项物料名称': c[1], '子项物料属性': c[2],
                     '子项类型': c[3], '子项单位': 'PCS', '用量类型': '变动', '用量：分子': '1', '用量：分母': '1',
                     '生效日期': '2025-12-01', '失效日期': '9999-12-31', '发料方式': c[4], 'PLM序号': c[5]})
    return srow(idx, ver, parent_name, head, [{'title': '子项明细', 'fields': bom_child_fields, 'rows': rows}])

bom_rows = [
    bom_row(1, '08.01.01.00018_VB', '00.01.01.00018', '标准版套件-欧标（含电池）', BOM_CHILDREN_MAIN),
    bom_row(2, '11.02.01.01.00029_VA', '11.02.01.01.00029', 'GO2', BOM_CHILDREN_GO2),
    bom_row(3, '12.01.00001_VA', '12.01.00001', '电池包', BOM_CHILDREN_BAT),
]

wh_fields = [f['name'] for f in sheet_defs['仓库列表']['header']]
wh_rows = []
for i, w in enumerate(WHS):
    wh_rows.append(srow(i + 1, w[0], w[1], {
        '编码': w[0], '名称': w[1], '仓库属性': '普通仓' if i < 4 else '不良品仓',
        '仓库负责人': EMPS[(i + 2) % len(EMPS)][1], '分组': '杭州总部', '库存状态类型': '普通',
        '默认库存状态': '可用', '默认收料状态': '待检' if i == 0 else '可用',
        '创建人': '乃永刚', '审核人': '秦兴国', '最后修改人': EMPS[i % len(EMPS)][1],
        '允许锁库': '是', '启用仓位管理': '是' if i < 4 else '否', '参与拣货': '是', '参与预警': '是' if i < 3 else '否'}))

dept_fields = [f['name'] for f in sheet_defs['部门接口']['header']]
dept_rows = [srow(i + 1, d[0], d[1], {'编码': d[0], '名称': d[1], '生效日期': '2025-01-01', '失效日期': '9999-12-31'})
             for i, d in enumerate(DEPTS)]

emp_fields = [f['name'] for f in sheet_defs['员工接口']['header']]
emp_rows = [srow(i + 1, e[0], e[1], {'员工姓名': e[1], '员工编号': e[0]}) for i, e in enumerate(EMPS)]

proj_fields = [f['name'] for f in sheet_defs['项目']['header']]
def proj_rows(items):
    out = []
    for i, (c, n) in enumerate(items):
        out.append(srow(i + 1, c, n, {'项目编码': c, '项目名称': n, '数据状态': '已审核', '禁用状态': '否',
                                      '创建日期': '2026-01-1' + str(i), '创建人': '乃永刚',
                                      '修改日期': DATES[i % len(DATES)], '修改人': EMPS[i % len(EMPS)][1]}))
    return out

static_categories = [
    {'key': 'material', 'name': '物料', 'icon': 'ep:files', 'star': True, 'fields': mat_fields,
     'listColumns': ['物料编码', '物料名称', '规格型号', '物料分组', '物料属性', '基本单位', '存货类别', '是否危化品'], 'rows': mat_rows},
    {'key': 'bom', 'name': 'BOM', 'icon': 'ep:connection', 'star': True, 'fields': bom_header_fields,
     'listColumns': ['BOM版本', '父项物料编码', '父项物料名称', 'BOM分类', 'BOM用途', 'BOM分组'], 'rows': bom_rows},
    {'key': 'warehouse', 'name': '仓库', 'icon': 'ep:house', 'star': False, 'fields': wh_fields,
     'listColumns': ['编码', '名称', '仓库属性', '仓库负责人', '分组', '启用仓位管理'], 'rows': wh_rows},
    {'key': 'employee', 'name': '员工', 'icon': 'ep:user', 'star': False, 'fields': emp_fields,
     'listColumns': ['员工编号', '员工姓名'], 'rows': emp_rows},
    {'key': 'dept', 'name': '部门', 'icon': 'ep:office-building', 'star': False, 'fields': dept_fields,
     'listColumns': ['编码', '名称', '生效日期', '失效日期'], 'rows': dept_rows},
    {'key': 'rdProject', 'name': '研发项目', 'icon': 'ep:opportunity', 'star': False, 'fields': proj_fields,
     'listColumns': ['项目编码', '项目名称', '数据状态', '创建人'], 'rows': proj_rows([('RB11', 'GO2 欧标版研发'), ('RB12', 'GO2 Pro 迭代研发'), ('RB15', 'B2 工业版预研')])},
    {'key': 'buildProject', 'name': '在建工程项目', 'icon': 'ep:office-building', 'star': False, 'fields': proj_fields,
     'listColumns': ['项目编码', '项目名称', '数据状态', '创建人'], 'rows': proj_rows([('ZJ2601', '滨江产线二期扩建'), ('ZJ2602', '总装车间自动化改造'), ('ZJ2603', '老化测试房建设')])},
    {'key': 'saleProject', 'name': '销售项目', 'icon': 'ep:sell', 'star': False, 'fields': proj_fields,
     'listColumns': ['项目编码', '项目名称', '数据状态', '创建人'], 'rows': proj_rows([('XS2606', '欧洲经销商年度框架'), ('XS2607', '北美直营渠道'), ('XS2608', '国内电商 618 大促')])},
]

# ---------- 6. 输出 TS ----------
def ts(v):
    return json.dumps(v, ensure_ascii=False, indent=2)

schema_ts = """// 本文件由 /tmp/gen_mdm.py 从《宇树-ERP接口清单.xlsx》《ERP接口清单及字段.xlsx》自动生成，勿手改
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

export const bizInterfaces: BizInterfaceMeta[] = %s

export const bizModules = ['生产管理', '委外管理', '采购管理', '仓库管理', '销售管理', '供应商协同']
""" % ts(interfaces)

static_ts = """// 本文件由 /tmp/gen_mdm.py 自动生成：8 类静态主数据（接口清单口径，仓位不对接已去除）
export interface StaticDetailBlock {
  title: string
  fields: string[]
  rows: Record<string, string>[]
}

export interface StaticRow {
  id: number
  code: string
  name: string
  status: string
  source: string
  syncTime: string
  data: Record<string, string>
  details?: StaticDetailBlock[]
}

export interface StaticCategory {
  key: string
  name: string
  icon: string
  star: boolean
  fields: string[]
  listColumns: string[]
  rows: StaticRow[]
}

export const staticCategories: StaticCategory[] = %s
""" % ts(static_categories)

biz_ts = """// 本文件由 /tmp/gen_mdm.py 自动生成：48 接口业务单据测试数据（GO2 机器狗业务链路）
export interface BizDoc {
  id: string
  interfaceId: number
  billNo: string
  billDate: string
  syncStatus: '已同步' | '同步失败' | '待同步'
  creator: string
  upstreamDocId?: string
  upstreamBillNo?: string
  upstreamInterfaceId?: number
  header: Record<string, string>
  details: Record<string, string>[][]
}

export const bizDocs: BizDoc[] = %s
""" % ts(docs)

open(OUT_DIR + '/erp-schema.ts', 'w').write(schema_ts)
open(OUT_DIR + '/static-data.ts', 'w').write(static_ts)
open(OUT_DIR + '/biz-doc-data.ts', 'w').write(biz_ts)

print('接口总数(业务):', len(interfaces))
print('生成单据数:', len(docs))
print('有上游链接的单据:', sum(1 for d in docs if d.get('upstreamDocId')))
print('同步失败样例:', sum(1 for d in docs if d['syncStatus'] == '同步失败'))
print('静态类别:', [(c['key'], len(c['rows'])) for c in static_categories])
print('各模块接口数:', {m: sum(1 for i in interfaces if i['module'] == m) for m in set(i['module'] for i in interfaces)})
print('无schema接口:', [(i['id'], i['bizForm']) for i in interfaces if not i['header']])
