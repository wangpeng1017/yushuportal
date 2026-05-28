#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
M2 标杆页面：把 IQC_20260503.html retrofit 为 UniTree 风格
- 不动原文件，输出 IQC_20260503_unitree.html
- 改造范围：head 引入 unitree-theme + 侧栏整段替换 + 顶栏插入 + 第一页 page-ledger 完整重做
- 其他 page 暂保留原样（待 M3b 批量改）
"""
import os
import sys

SRC = os.path.join(os.path.dirname(__file__), 'IQC_20260503.html')
DST = os.path.join(os.path.dirname(__file__), 'IQC_20260503_unitree.html')

# 锚点
HEAD_CLOSE = "</head>"
SIDEBAR_START = '<!-- ================= 超级管理员侧边栏 (按要求调整菜单结构) ================= -->'
SIDEBAR_END = '<!-- ================= 主体内容区 ================= -->'
MAIN_OPEN = '<div class="main-content">'
LEDGER_START = '<!-- 1. 来料检验任务台账 -->'
LEDGER_END = '<!-- 2. 我的检测任务 -->'

# ---------- 注入到 <head> 的内容 ----------
HEAD_INJECT = '''
<!-- UniTree UI Theme (M2 标杆) -->
<link rel="stylesheet" href="unitree-theme/tokens.css">
<link rel="stylesheet" href="unitree-theme/base.css">
<link rel="stylesheet" href="unitree-theme/components.css">
<style>
  /* M2 兼容补丁：覆盖 QMS 原内联样式中与 UniTree Layout 冲突的部分 */
  body { font-size: var(--u-fs-body) !important; background-color: var(--u-bg-page) !important; font-family: var(--u-font) !important; }
  .main-content {
    margin-left: var(--u-sidebar-w) !important;
    padding: 0 !important;
    width: calc(100% - var(--u-sidebar-w)) !important;
    background: var(--u-bg-page);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .u-content { flex: 1; padding: var(--u-content-padding); overflow-x: auto; }
  .page { padding: 0 !important; }
  /* 顶栏从粘性首部固定 */
  .u-header { position: sticky; top: 0; }
  /* 兼容旧页未改造的 page：保留 Bootstrap 默认风格 */
  .page:not(#p-ledger) .card { border-radius: var(--u-radius); }
  /* 顶栏分隔过原有覆盖（覆盖 inline 中的 h4/.h4 设置） */
  h4, .h4 { font-size: var(--u-fs-h2) !important; }
  /* 让 stat 卡片数值色覆盖普通色 */
  .u-stat-card__value[style*="warning"] { color: var(--u-warning) !important; }
  .u-stat-card__value[style*="success"] { color: var(--u-success) !important; }
  .u-stat-card__value[style*="danger"]  { color: var(--u-danger) !important; }
</style>
'''

# ---------- 新侧栏 ----------
SIDEBAR_NEW = '''<!-- ================= UniTree 侧栏（M2 改造） ================= -->
<aside class="u-sidebar" id="appSidebar">
  <div class="u-sidebar__logo">
    <div class="u-sidebar__logo-title">UNITREE</div>
    <div class="u-sidebar__logo-subtitle">质量管理系统</div>
  </div>
  <nav class="u-sidebar__menu">

    <div class="u-menu-group-title">来料检验任务</div>
    <a class="u-menu-item u-menu-item--active" onclick="navTo('p-ledger', this, '来料检验 / 任务台账')">
      <span class="u-menu-item__icon"><i class="bi bi-clipboard-check"></i></span>
      <span class="u-menu-item__text">来料检验任务台账</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-my-tasks', this, '来料检验 / 我的检验任务')">
      <span class="u-menu-item__icon"><i class="bi bi-check2-square"></i></span>
      <span class="u-menu-item__text">我的检验任务</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-exemption-list', this, '来料检验 / 免检任务清单')">
      <span class="u-menu-item__icon"><i class="bi bi-shield-check"></i></span>
      <span class="u-menu-item__text">来料免检任务清单</span>
    </a>

    <div class="u-menu-group-title">三坐标检测</div>
    <a class="u-menu-item" onclick="navTo('p-cmm-tasks', this, '三坐标检测 / 我的检测任务')">
      <span class="u-menu-item__icon"><i class="bi bi-rulers"></i></span>
      <span class="u-menu-item__text">我的检测任务</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-cmm-audit', this, '三坐标检测 / 任务审核')">
      <span class="u-menu-item__icon"><i class="bi bi-clipboard2-check"></i></span>
      <span class="u-menu-item__text">检测任务审核</span>
    </a>

    <div class="u-menu-group-title">基础数据</div>
    <a class="u-menu-item" onclick="navTo('p-material-data', this, '基础数据 / 物料基础数据')">
      <span class="u-menu-item__icon"><i class="bi bi-database"></i></span>
      <span class="u-menu-item__text">物料基础数据</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-standard-manage', this, '基础数据 / 检验标准管理')">
      <span class="u-menu-item__icon"><i class="bi bi-bookmark-star"></i></span>
      <span class="u-menu-item__text">检验标准管理</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-exemption-ledger', this, '基础数据 / 物料免检清单')">
      <span class="u-menu-item__icon"><i class="bi bi-list-check"></i></span>
      <span class="u-menu-item__text">物料免检清单</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-sample-code', this, '基础数据 / 样本量码管理')">
      <span class="u-menu-item__icon"><i class="bi bi-upc"></i></span>
      <span class="u-menu-item__text">样本量码管理</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-national-standard', this, '基础数据 / 国标抽样方案')">
      <span class="u-menu-item__icon"><i class="bi bi-bookmarks"></i></span>
      <span class="u-menu-item__text">国标抽样方案</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-custom-sampling', this, '基础数据 / 自定义抽样 C 端')">
      <span class="u-menu-item__icon"><i class="bi bi-sliders"></i></span>
      <span class="u-menu-item__text">自定义抽样（C端）</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-custom-sampling-b', this, '基础数据 / 自定义抽样 B 端')">
      <span class="u-menu-item__icon"><i class="bi bi-sliders2"></i></span>
      <span class="u-menu-item__text">自定义抽样（B端&机加）</span>
    </a>

    <div class="u-menu-group-title">检验人员</div>
    <a class="u-menu-item" onclick="navTo('p-inspector-manage', this, '检验人员 / 人员台账')">
      <span class="u-menu-item__icon"><i class="bi bi-people"></i></span>
      <span class="u-menu-item__text">人员台账</span>
    </a>

    <div class="u-menu-group-title">业务报表</div>
    <a class="u-menu-item" onclick="navTo('p-material-damage-ledger', this, '业务报表 / 物料损耗台账')">
      <span class="u-menu-item__icon"><i class="bi bi-exclamation-triangle"></i></span>
      <span class="u-menu-item__text">物料损耗台账</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-iqc-daily-report', this, '业务报表 / IQC 日报')">
      <span class="u-menu-item__icon"><i class="bi bi-calendar3"></i></span>
      <span class="u-menu-item__text">IQC 日报</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-business-report', this, '业务报表 / 供应商月度合格率')">
      <span class="u-menu-item__icon"><i class="bi bi-graph-up"></i></span>
      <span class="u-menu-item__text">供应商月度合格率</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-material-analysis', this, '业务报表 / 同属性物料汇总')">
      <span class="u-menu-item__icon"><i class="bi bi-pie-chart"></i></span>
      <span class="u-menu-item__text">同属性物料汇总分析</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-purchase-scorecard', this, '业务报表 / 采购计分卡')">
      <span class="u-menu-item__icon"><i class="bi bi-card-checklist"></i></span>
      <span class="u-menu-item__text">采购计分卡</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-monthly-incoming-summary', this, '业务报表 / 月度来料汇总')">
      <span class="u-menu-item__icon"><i class="bi bi-bar-chart"></i></span>
      <span class="u-menu-item__text">月度来料汇总分析</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-iqc-report', this, '业务报表 / IQC 报告')">
      <span class="u-menu-item__icon"><i class="bi bi-file-earmark-text"></i></span>
      <span class="u-menu-item__text">IQC 报告</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-quality-analysis', this, '业务报表 / 质量分析图表')">
      <span class="u-menu-item__icon"><i class="bi bi-clipboard-data"></i></span>
      <span class="u-menu-item__text">质量分析图表</span>
    </a>
    <a class="u-menu-item" onclick="navTo('p-inspector-capability-matrix', this, '业务报表 / 人员能力矩阵')">
      <span class="u-menu-item__icon"><i class="bi bi-grid-3x3-gap"></i></span>
      <span class="u-menu-item__text">人员能力矩阵</span>
    </a>
  </nav>
</aside>

'''

# ---------- 顶栏 + 内容容器开始 ----------
HEADER_AND_CONTENT_OPEN = '''
  <header class="u-header">
    <div class="u-header__left">
      <div class="u-header__collapse-btn" onclick="toggleSidebar()" title="折叠侧栏">
        <i class="bi bi-list" style="font-size: 18px;"></i>
      </div>
      <div class="u-breadcrumb">
        <span class="u-breadcrumb__item">质量管理</span>
        <span class="u-breadcrumb__sep">/</span>
        <span class="u-breadcrumb__item u-breadcrumb__item--active" id="appBreadcrumb">来料检验 / 任务台账</span>
      </div>
    </div>
    <div class="u-header__right">
      <div class="u-header__tool" title="通知"><i class="bi bi-bell"></i></div>
      <div class="u-header__tool" title="全屏" onclick="document.documentElement.requestFullscreen && document.documentElement.requestFullscreen()"><i class="bi bi-arrows-fullscreen"></i></div>
      <div class="u-avatar" title="王老师">王</div>
    </div>
  </header>

  <div class="u-content">
'''

# ---------- 第一页改造：page-ledger ----------
LEDGER_NEW = '''<!-- 1. 来料检验任务台账（UniTree 风格 M2 改造） -->
    <div id="p-ledger" class="page active">

      <!-- 页头 -->
      <div class="u-page-header">
        <div>
          <h1 class="u-page-title">来料检验任务台账</h1>
          <div class="u-page-subtitle">查询、分配、初判与复判来料检验任务</div>
        </div>
        <div class="u-btn-group">
          <button class="u-btn u-btn--default" onclick="exportReport('ledger')">
            <i class="bi bi-download"></i> 导出报表
          </button>
          <button class="u-btn u-btn--primary" onclick="new bootstrap.Modal(document.getElementById('modalCreate')).show()">
            <i class="bi bi-plus-lg"></i> 新建检验任务
          </button>
        </div>
      </div>

      <!-- 4 个统计卡 -->
      <div class="u-stat-grid" style="margin-bottom: var(--u-space-4);">
        <div class="u-stat-card">
          <div class="u-stat-card__label">总任务数</div>
          <div class="u-stat-card__value">8</div>
          <div class="u-stat-card__delta">较昨日 +2</div>
        </div>
        <div class="u-stat-card">
          <div class="u-stat-card__label">待检 / 检验中</div>
          <div class="u-stat-card__value" style="color:var(--u-warning);">4</div>
          <div class="u-stat-card__delta" style="color:var(--u-text-3);">含待分配 2 单</div>
        </div>
        <div class="u-stat-card">
          <div class="u-stat-card__label">已完成</div>
          <div class="u-stat-card__value" style="color:var(--u-success);">2</div>
          <div class="u-stat-card__delta">合格 1 / 不合格 1</div>
        </div>
        <div class="u-stat-card">
          <div class="u-stat-card__label">不合格率</div>
          <div class="u-stat-card__value" style="color:var(--u-danger);">12.5%</div>
          <div class="u-stat-card__delta u-stat-card__delta--down">较上月 +2.3%</div>
        </div>
      </div>

      <!-- 筛选条 -->
      <div class="u-card u-filter-bar">
        <div class="u-filter-grid">
          <div class="u-field">
            <label class="u-label">检验类型</label>
            <select class="u-select">
              <option value="">全部</option>
              <option>量产</option>
              <option>试产</option>
              <option>样品</option>
            </select>
          </div>
          <div class="u-field">
            <label class="u-label">供应商</label>
            <input type="text" class="u-input" placeholder="请输入供应商名称">
          </div>
          <div class="u-field">
            <label class="u-label">物料名称</label>
            <input type="text" class="u-input" placeholder="请输入物料名称">
          </div>
          <div class="u-field">
            <label class="u-label">物料属性</label>
            <input type="text" class="u-input" placeholder="如：机加件 / 塑料件">
          </div>
          <div class="u-field">
            <label class="u-label">来料日期</label>
            <input type="date" class="u-input">
          </div>
        </div>
        <div class="u-filter-actions">
          <button class="u-btn u-btn--default" onclick="document.querySelectorAll('.u-filter-grid .u-input, .u-filter-grid .u-select').forEach(el => el.value = '')">重置</button>
          <button class="u-btn u-btn--primary"><i class="bi bi-search"></i> 查询</button>
        </div>
      </div>

      <!-- 列表卡片 -->
      <div class="u-card">
        <!-- Tab 标签栏 -->
        <div class="u-tabs">
          <div class="u-tab u-tab--active" onclick="switchLedgerTab('all', this)">全部任务<span class="u-tab__badge">8</span></div>
          <div class="u-tab" onclick="switchLedgerTab('completed', this)">已完成<span class="u-tab__badge">2</span></div>
          <div class="u-tab" onclick="switchLedgerTab('uncompleted', this)">未完成<span class="u-tab__badge">4</span></div>
          <div class="u-tab" onclick="switchLedgerTab('notstarted', this)">未启动<span class="u-tab__badge">2</span></div>
        </div>

        <!-- 工具栏 -->
        <div style="padding: var(--u-space-3) var(--u-space-5); display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--u-border-light);">
          <div class="u-flex u-gap-2">
            <button class="u-btn u-btn--default u-btn--sm" onclick="batchAssign()"><i class="bi bi-people"></i> 批量分配</button>
            <span class="u-text-muted" style="font-size:12px;">已选中 <strong id="selectedCount">0</strong> 项</span>
          </div>
          <div class="u-text-muted" style="font-size:12px;">最近更新 2025-10-26 11:00</div>
        </div>

        <!-- 表格 -->
        <table class="u-table u-table--striped">
          <thead>
            <tr>
              <th class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox" id="selectAll" onchange="toggleSelectAll()"></th>
              <th>检验单号</th>
              <th>检验类型</th>
              <th>订单号</th>
              <th>供应商批次</th>
              <th>供应商</th>
              <th>物料属性</th>
              <th>物料名称</th>
              <th>来料日期</th>
              <th>来料数量</th>
              <th>抽样数量</th>
              <th>检验结果</th>
              <th>状态</th>
              <th>优先级</th>
              <th>检验员</th>
              <th>采购员</th>
              <th class="u-table__cell-action">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251005</strong></td>
              <td>量产</td><td>PO-05</td><td>B005</td><td>蓝思科技</td>
              <td>机加件</td><td>玻璃盖板</td>
              <td>2025-10-25</td><td>1000</td><td>80</td>
              <td><span class="u-tag u-tag--danger">待判定</span></td>
              <td><span class="u-tag u-tag--warning">待结果初判</span></td>
              <td><span class="u-tag u-tag--danger u-tag--pill">特急</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251005')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm u-text-danger" onclick="openLeaderConfirm('IQC20251005')">结果初判</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251003</strong></td>
              <td>试产</td><td>PO-03</td><td>B003</td><td>德赛电池</td>
              <td>塑料件</td><td>动力电池芯</td>
              <td>2025-10-24</td><td>500</td><td>32</td>
              <td><span class="u-tag u-tag--danger">待判定</span></td>
              <td><span class="u-tag u-tag--warning">待结果初判</span></td>
              <td><span class="u-tag u-tag--warning u-tag--pill">紧急</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251003')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm u-text-danger" onclick="openLeaderConfirm('IQC20251003')">结果初判</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251001</strong></td>
              <td>量产</td><td>PO-01</td><td>B001</td><td>立讯精密</td>
              <td>机加件</td><td>机器人关节减速器</td>
              <td>2025-10-24</td><td>1000</td><td>80</td>
              <td>—</td>
              <td><span class="u-tag u-tag--default">待分配</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>—</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251001')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="new bootstrap.Modal(document.getElementById('modalCMMView')).show()">三坐标</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="new bootstrap.Modal(document.getElementById('modalReconfirm')).show()">复判</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251002</strong></td>
              <td>样品</td><td>PO-02</td><td>B002</td><td>富士康科技</td>
              <td>机加件</td><td>伺服电机</td>
              <td>2025-10-24</td><td>50</td><td>5</td>
              <td>—</td>
              <td><span class="u-tag u-tag--info">检验中</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251002')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" style="color:var(--u-success);" onclick="navTo('p-inspection-data', null, '来料检验 / 录入数据')">录入数据</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251004</strong></td>
              <td>量产</td><td>PO-04</td><td>B004</td><td>歌尔股份</td>
              <td>机加件</td><td>精密转轴</td>
              <td>2025-10-24</td><td>200</td><td>13</td>
              <td><span class="u-tag u-tag--danger">待最终判定</span></td>
              <td><span class="u-tag u-tag--primary">三坐标已审</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251004')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="new bootstrap.Modal(document.getElementById('modalCMMView')).show()">三坐标</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="new bootstrap.Modal(document.getElementById('modalReconfirm')).show()">复判</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251005</strong></td>
              <td>量产</td><td>PO-05</td><td>B005</td><td>欣旺达</td>
              <td>塑料件</td><td>储能电芯</td>
              <td>2025-10-23</td><td>800</td><td>50</td>
              <td><span class="u-tag u-tag--danger">不合格</span></td>
              <td><span class="u-tag u-tag--success">已完成</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251005')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="generateReport('IQC20251005')">生成报告</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="viewReport('IQC20251005')">查看</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251006</strong></td>
              <td>量产</td><td>PO-06</td><td>B006</td><td>蓝思科技</td>
              <td>机加件</td><td>玻璃盖板</td>
              <td>2025-10-23</td><td>5000</td><td>125</td>
              <td><span class="u-tag u-tag--success">合格</span></td>
              <td><span class="u-tag u-tag--success">已完成</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>张三</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251006')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="viewReport('IQC20251006')">查看报告</button>
              </td>
            </tr>
            <tr>
              <td class="u-table__cell-checkbox"><input type="checkbox" class="u-checkbox row-checkbox" onchange="updateSelectedCount()"></td>
              <td><strong>IQC20251007</strong></td>
              <td>量产</td><td>PO-07</td><td>B007</td><td>立讯精密</td>
              <td>机加件</td><td>精密连接器</td>
              <td>2025-10-26</td><td>2000</td><td>125</td>
              <td>—</td>
              <td><span class="u-tag u-tag--default">待分配</span></td>
              <td><span class="u-tag u-tag--default u-tag--pill">一般</span></td>
              <td>—</td><td>李四</td>
              <td class="u-table__cell-action">
                <button class="u-btn u-btn--text u-btn--sm" onclick="openDetail('IQC20251007')">详情</button>
                <button class="u-btn u-btn--text u-btn--sm" onclick="new bootstrap.Modal(document.getElementById('modalTaskAssign')).show()">分配</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 分页 -->
        <div class="u-pagination">
          <span class="u-pagination__total">共 8 条 · 每页 10 条</span>
          <button class="u-page-btn" disabled>‹</button>
          <button class="u-page-btn u-page-btn--active">1</button>
          <button class="u-page-btn" disabled>›</button>
        </div>
      </div>

    </div>

    '''

# ---------- 全局 JS（顶栏面包屑同步、折叠、计数）----------
JS_INJECT = '''
<script>
  // M2 标杆：UniTree 适配脚本（与原 switchPage / switchLedgerTab 协作）
  (function () {
    // 把原 switchPage 包装一层，同时同步 .u-menu-item--active 与面包屑
    if (typeof window.switchPage !== 'function') {
      window.switchPage = function (pageId, el) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const pg = document.getElementById(pageId);
        if (pg) pg.classList.add('active');
      };
    }
    window.navTo = function (pageId, el, breadcrumb) {
      window.switchPage(pageId, el);
      // 同步侧栏激活态
      if (el) {
        document.querySelectorAll('.u-sidebar .u-menu-item').forEach(m => m.classList.remove('u-menu-item--active'));
        el.classList.add('u-menu-item--active');
      }
      // 同步面包屑
      const bc = document.getElementById('appBreadcrumb');
      if (bc && breadcrumb) bc.textContent = breadcrumb;
    };
    window.toggleSidebar = function () {
      document.getElementById('appSidebar').classList.toggle('u-sidebar--collapsed');
      document.querySelector('.main-content').style.marginLeft =
        document.getElementById('appSidebar').classList.contains('u-sidebar--collapsed')
          ? 'var(--u-sidebar-w-collapsed)' : 'var(--u-sidebar-w)';
      document.querySelector('.main-content').style.width =
        document.getElementById('appSidebar').classList.contains('u-sidebar--collapsed')
          ? 'calc(100% - var(--u-sidebar-w-collapsed))' : 'calc(100% - var(--u-sidebar-w))';
    };
    window.updateSelectedCount = function () {
      const n = document.querySelectorAll('.row-checkbox:checked').length;
      const elt = document.getElementById('selectedCount');
      if (elt) elt.textContent = n;
    };
    // 复用原 toggleSelectAll，确保同步选中数
    const origToggle = window.toggleSelectAll;
    window.toggleSelectAll = function () {
      if (typeof origToggle === 'function') origToggle();
      else {
        const sa = document.getElementById('selectAll');
        document.querySelectorAll('.row-checkbox').forEach(cb => cb.checked = !!sa.checked);
      }
      window.updateSelectedCount();
    };
  })();
</script>
'''


def must_find(haystack: str, needle: str, label: str) -> int:
    idx = haystack.find(needle)
    if idx < 0:
        print(f'[ERROR] 未找到锚点：{label}\n  needle: {needle!r}', file=sys.stderr)
        sys.exit(1)
    return idx


def main() -> int:
    with open(SRC, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1) 在 </head> 之前注入 UniTree CSS + 补丁
    head_close_idx = must_find(html, HEAD_CLOSE, '</head>')
    html = html[:head_close_idx] + HEAD_INJECT + html[head_close_idx:]

    # 2) 替换 sidebar 整段（从 SIDEBAR_START 到 SIDEBAR_END 之前）
    sb_s = must_find(html, SIDEBAR_START, 'SIDEBAR_START')
    sb_e = must_find(html, SIDEBAR_END, 'SIDEBAR_END')
    if sb_e <= sb_s:
        print('[ERROR] sidebar 锚点顺序错误', file=sys.stderr)
        return 2
    html = html[:sb_s] + SIDEBAR_NEW + html[sb_e:]

    # 3) 在 main-content 容器开头插入顶栏 + .u-content 包裹
    mc_idx = must_find(html, MAIN_OPEN, 'main-content open')
    insert_pos = mc_idx + len(MAIN_OPEN)
    html = html[:insert_pos] + HEADER_AND_CONTENT_OPEN + html[insert_pos:]

    # 4) 替换 page-ledger 整段（LEDGER_START..LEDGER_END 之前）
    lg_s = must_find(html, LEDGER_START, 'LEDGER_START')
    lg_e = must_find(html, LEDGER_END, 'LEDGER_END')
    html = html[:lg_s] + LEDGER_NEW + html[lg_e:]

    # 5) 在 </body> 前关闭 .u-content + 注入 JS
    body_close = '</body>'
    bc_idx = must_find(html, body_close, '</body>')
    html = html[:bc_idx] + '\n  </div><!-- /.u-content -->\n' + JS_INJECT + '\n' + html[bc_idx:]

    with open(DST, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'[OK] 已生成: {DST}')
    print(f'     原文件: {SRC} (未修改)')
    print(f'     大小变化: {os.path.getsize(SRC)} -> {os.path.getsize(DST)} bytes')
    return 0


if __name__ == '__main__':
    sys.exit(main())
