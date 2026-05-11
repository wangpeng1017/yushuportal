#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
M3c MES 改造：注入 UniTree 风格皮肤
- 输入: mes.html
- 输出: mes_unitree.html（原文件不动）
- 策略: 注入 unitree-theme 三个 css + MES 专用覆盖 CSS（处理 .navbar/.sidebar/.stat-card/.action-btn 等）
"""
import os
import sys

DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(DIR, 'mes.html')
DST = os.path.join(DIR, 'mes_unitree.html')

INJECT = '''
<!-- UniTree UI Theme (M3c MES retrofit) -->
<link rel="stylesheet" href="unitree-theme/tokens.css">
<link rel="stylesheet" href="unitree-theme/base.css">
<link rel="stylesheet" href="unitree-theme/components.css">
<style>
  /* ==== UniTree Skin for MES ==== */
  body {
    font-family: var(--u-font) !important;
    background-color: var(--u-bg-page) !important;
    color: var(--u-text-2) !important;
  }

  /* —— 顶部蓝色大色条 → 白色 56px —— */
  .navbar {
    background: var(--u-header-bg) !important;
    color: var(--u-text-1) !important;
    height: var(--u-header-h) !important;
    padding: 0 var(--u-space-6) !important;
    border-bottom: 1px solid var(--u-border) !important;
    box-shadow: none !important;
  }
  .navbar .nav-brand,
  .navbar .navbar-brand,
  .navbar h1, .navbar h2, .navbar h3, .navbar h4,
  .navbar a {
    color: var(--u-text-1) !important;
  }
  .navbar .text-white,
  .navbar [class*="text-white"] {
    color: var(--u-text-1) !important;
  }
  /* 顶栏右侧用户/工具按钮 */
  .navbar .nav-tool,
  .navbar .user-info,
  .navbar [class*="user"] {
    color: var(--u-text-2) !important;
  }

  /* —— 侧栏 → UniTree 深灰 —— */
  .sidebar {
    background: var(--u-sidebar-bg) !important;
    color: var(--u-sidebar-text) !important;
    width: var(--u-sidebar-w) !important;
  }
  .sidebar-header {
    background: transparent !important;
    color: #fff !important;
    padding: var(--u-space-4) var(--u-space-5) !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    font-weight: 700 !important;
    letter-spacing: 1px !important;
  }
  .sidebar a,
  .sidebar .menu-item,
  .sidebar .sidebar-item,
  .sidebar [class*="menu"] a {
    color: var(--u-sidebar-text) !important;
    transition: background .15s !important;
  }
  .sidebar a:hover,
  .sidebar .menu-item:hover {
    background: var(--u-sidebar-bg-hover) !important;
    color: #fff !important;
  }
  .sidebar a.active,
  .sidebar .menu-item.active,
  .sidebar [class*="active"] {
    background: var(--u-sidebar-active-bg) !important;
    color: #fff !important;
    position: relative;
  }
  .sidebar a.active::before,
  .sidebar .menu-item.active::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: #fff;
  }

  /* —— 4 个渐变数据卡 → UniTree 白底卡片 —— */
  .stat-card {
    background: var(--u-bg-card) !important;
    color: var(--u-text-1) !important;
    border-radius: var(--u-radius) !important;
    box-shadow: var(--u-shadow-card) !important;
    border: 1px solid var(--u-border-light) !important;
    padding: var(--u-space-5) !important;
  }
  .stat-card *, .stat-card .text-white { color: var(--u-text-1) !important; }
  .stat-card .stat-value, .stat-card .value, .stat-card h2, .stat-card h3 {
    color: var(--u-text-1) !important;
    font-weight: 700 !important;
  }
  .stat-card .stat-label, .stat-card .label, .stat-card p {
    color: var(--u-text-3) !important;
  }
  /* 按颜色变体注入主题色到数字（保留视觉信息） */
  .stat-card.orange .stat-value, .stat-card.orange h2, .stat-card.orange h3 { color: var(--u-warning) !important; }
  .stat-card.green  .stat-value, .stat-card.green h2,  .stat-card.green h3  { color: var(--u-success) !important; }
  .stat-card.purple .stat-value, .stat-card.purple h2, .stat-card.purple h3 { color: var(--u-info) !important; }
  .stat-card.red    .stat-value, .stat-card.red h2,    .stat-card.red h3    { color: var(--u-danger) !important; }
  .stat-card.blue   .stat-value, .stat-card.blue h2,   .stat-card.blue h3   { color: var(--u-primary) !important; }

  /* —— 快捷动作按钮（带 inline linear-gradient style）—— */
  /* 用属性选择器命中所有 linear-gradient style 注入 */
  .action-btn,
  button.action-btn,
  [class*="action-btn"],
  .quick-action,
  [class*="quick-action"] {
    background: var(--u-bg-card) !important;
    background-image: none !important;
    border: 1px solid var(--u-border) !important;
    color: var(--u-text-1) !important;
    border-radius: var(--u-radius) !important;
    box-shadow: none !important;
    transition: all .15s !important;
  }
  .action-btn:hover,
  [class*="action-btn"]:hover,
  .quick-action:hover {
    border-color: var(--u-primary) !important;
    color: var(--u-primary) !important;
    box-shadow: var(--u-shadow-card) !important;
  }
  .action-btn *, [class*="action-btn"] *, .quick-action * {
    color: inherit !important;
  }
  /* 内联 style 中的渐变会用 !important 不可逆地被上面规则盖掉，
     但有些行内 style 写法是直接 background: linear-gradient(..)，
     这种情况会被 !important 击败，下方再加一层兜底（提高特异性） */
  body button.action-btn[style*="linear-gradient"],
  body div.action-btn[style*="linear-gradient"],
  body .stat-card[style*="linear-gradient"] {
    background: var(--u-bg-card) !important;
    background-image: none !important;
  }

  /* —— 通用按钮风格 —— */
  button:not(.action-btn):not(.btn-icon):not([class*="close"]) {
    border-radius: var(--u-radius) !important;
  }

  /* —— 普通 .card —— */
  .card {
    background: var(--u-bg-card) !important;
    border: none !important;
    border-radius: var(--u-radius) !important;
    box-shadow: var(--u-shadow-card) !important;
  }

  /* —— 表格 —— */
  table {
    font-size: var(--u-fs-table) !important;
  }
  table thead th {
    background: var(--u-bg-stripe) !important;
    color: var(--u-text-1) !important;
    font-weight: 500 !important;
  }
  table tbody tr:hover td {
    background: var(--u-bg-hover) !important;
  }

  /* —— Badge / Tag —— */
  .badge, .tag, .status-tag {
    border-radius: var(--u-radius-sm) !important;
    font-size: var(--u-fs-sm) !important;
    font-weight: 400 !important;
    padding: 4px 8px !important;
  }
  .badge-blue, .tag-blue { background: var(--u-primary-bg) !important; color: var(--u-primary) !important; border: 1px solid var(--u-primary-border); }
  .badge-yellow, .tag-yellow, .badge-warning { background: var(--u-warning-bg) !important; color: var(--u-warning) !important; border: 1px solid var(--u-warning-border); }
  .badge-green, .tag-green, .badge-success { background: var(--u-success-bg) !important; color: var(--u-success) !important; border: 1px solid var(--u-success-border); }
  .badge-red, .tag-red, .badge-danger { background: var(--u-danger-bg) !important; color: var(--u-danger) !important; border: 1px solid var(--u-danger-border); }

  /* —— 顶栏右上角的用户图标圆形头像区 —— */
  .navbar .user-avatar,
  .navbar img[class*="avatar"] {
    width: 32px !important;
    height: 32px !important;
    border-radius: 50% !important;
  }

  /* —— 修正：让顶栏 logo / 标题文字色为 dark —— */
  .navbar .navbar-brand strong,
  .navbar .logo,
  .navbar .system-title {
    color: var(--u-text-1) !important;
    font-weight: 700 !important;
  }
</style>
'''


def main() -> int:
    if not os.path.exists(SRC):
        print(f'[ERROR] 找不到 {SRC}', file=sys.stderr)
        return 1
    with open(SRC, 'r', encoding='utf-8') as f:
        html = f.read()
    if '</head>' not in html:
        print(f'[ERROR] 找不到 </head>', file=sys.stderr)
        return 2
    new_html = html.replace('</head>', INJECT + '\n</head>', 1)
    with open(DST, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'[OK] {os.path.basename(SRC)} -> {os.path.basename(DST)}  '
          f'({os.path.getsize(SRC)} -> {os.path.getsize(DST)} bytes)')
    return 0


if __name__ == '__main__':
    sys.exit(main())
