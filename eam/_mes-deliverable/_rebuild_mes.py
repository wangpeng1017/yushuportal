#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
M3c MES 重写：把 unitree-theme 3 个 CSS + retrofit override **全部内联**到主 <style> 内部
- 之前的 <link> + 第二个 <style> 在 mes.html 中被 HTML parser 丢出 DOM（妙在合法 HTML 但被 chromium 当 head 关闭后处理出错）
- 内联策略：保证所有 CSS 都被浏览器解析，且 retrofit override 在最末（cascade 最后胜出）
"""
import os
import re

DIR = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(DIR, 'mes.html.bak.20260508')  # 干净版备份
DST = os.path.join(DIR, 'mes.html')
THEME_DIR = os.path.join(DIR, 'unitree-theme')

# 读取 unitree-theme 三个 css
def read_css(name):
    with open(os.path.join(THEME_DIR, name), 'r', encoding='utf-8') as f:
        return f.read()

THEME_TOKENS = read_css('tokens.css')
THEME_BASE = read_css('base.css')
THEME_COMPONENTS = read_css('components.css')

RETROFIT_OVERRIDE = '''
/* ==== UniTree Skin for MES (override) ==== */
body {
  font-family: var(--u-font) !important;
  background-color: var(--u-bg-page) !important;
  color: var(--u-text-2) !important;
}

/* —— 关键 layout 修复：sidebar 从顶到底 fixed，navbar/main 让出 sidebar 宽度 —— */
body { margin: 0 !important; padding: 0 !important; }
.sidebar {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  bottom: 0 !important;
  width: var(--u-sidebar-w, 220px) !important;
  z-index: 100 !important;
  overflow-y: auto !important;
  height: 100vh !important;
}
.navbar {
  margin-left: var(--u-sidebar-w, 220px) !important;
  position: sticky !important;
  top: 0 !important;
  z-index: 90 !important;
  width: calc(100% - var(--u-sidebar-w, 220px)) !important;
}
.container {
  margin-left: var(--u-sidebar-w, 220px) !important;
  padding: 0 !important;
  display: block !important;
  width: calc(100% - var(--u-sidebar-w, 220px)) !important;
  min-height: calc(100vh - var(--u-header-h, 56px)) !important;
}
.container > main,
.container > .content,
.container .main-content,
main.content {
  margin-left: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  padding: var(--u-content-padding, 24px) !important;
  box-sizing: border-box !important;
}

/* —— 顶栏白色 56px —— */
.navbar {
  background: var(--u-header-bg) !important;
  color: var(--u-text-1) !important;
  height: var(--u-header-h, 56px) !important;
  padding: 0 var(--u-space-6, 24px) !important;
  border-bottom: 1px solid var(--u-border) !important;
  box-shadow: none !important;
}
.navbar .nav-brand,
.navbar h1, .navbar h2, .navbar h3, .navbar h4,
.navbar a {
  color: var(--u-text-1) !important;
}
.navbar .text-white {
  color: var(--u-text-1) !important;
}

/* —— 侧栏深灰 —— */
.sidebar {
  background: var(--u-sidebar-bg) !important;
  color: var(--u-sidebar-text) !important;
}
.sidebar-header {
  background: transparent !important;
  border-bottom: 1px solid rgba(255,255,255,0.08) !important;
}
.sidebar a,
.sidebar .menu-item,
.sidebar .submenu-item,
.sidebar [class*="menu"] a {
  color: var(--u-sidebar-text) !important;
  transition: background .15s !important;
}
.sidebar a:hover,
.sidebar .menu-item:hover,
.sidebar .submenu-item:hover {
  background: var(--u-sidebar-bg-hover) !important;
  color: #fff !important;
}
.sidebar a.active,
.sidebar .menu-item.active,
.sidebar .submenu-item.active,
.sidebar [class*="active"] {
  background: var(--u-sidebar-active-bg) !important;
  color: #fff !important;
  position: relative;
}
.sidebar a.active::before,
.sidebar .submenu-item.active::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 4px;
  background: #fff;
}

/* —— 4 个数据卡 → UniTree 白底 —— */
.stat-card {
  background: var(--u-bg-card) !important;
  color: var(--u-text-1) !important;
  border-radius: var(--u-radius) !important;
  box-shadow: var(--u-shadow-card) !important;
  border: 1px solid var(--u-border-light) !important;
  background-image: none !important;
}
.stat-card *, .stat-card .text-white { color: var(--u-text-1) !important; }
.stat-card .stat-value { color: var(--u-text-1) !important; font-weight: 700 !important; }
.stat-card .stat-label { color: var(--u-text-3) !important; }
.stat-card.orange .stat-value { color: var(--u-warning) !important; }
.stat-card.green  .stat-value { color: var(--u-success) !important; }
.stat-card.purple .stat-value { color: var(--u-info) !important; }
.stat-card.red    .stat-value { color: var(--u-danger) !important; }
.stat-card.blue   .stat-value { color: var(--u-primary) !important; }

/* —— 快捷动作按钮 —— */
.action-btn,
button.action-btn,
[class*="action-btn"],
.quick-action {
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
body button.action-btn[style*="linear-gradient"],
body div.action-btn[style*="linear-gradient"],
body .stat-card[style*="linear-gradient"] {
  background: var(--u-bg-card) !important;
  background-image: none !important;
}

/* 普通 .card */
.card {
  background: var(--u-bg-card) !important;
  border: none !important;
  border-radius: var(--u-radius) !important;
  box-shadow: var(--u-shadow-card) !important;
}

/* 表格 */
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

/* —— 表格溢出兜底：让 main 内所有 section/div 自动横向滚动，避免被宽表格撑爆 —— */
main.content {
  overflow-x: hidden !important; /* main 自身不横滚，避免整页滚 */
  box-sizing: border-box !important;
}
main.content > *,
main.content section,
main.content > div {
  max-width: 100% !important;
  box-sizing: border-box !important;
}
/* 含表格的 section/div 自动允许内部横向滚 */
main.content section:has(table),
main.content > div:has(table),
main.content [class*="-section"]:has(table),
main.content [class*="-content"]:has(table),
.work-order-section,
.bottom-section,
.bottom-right,
[class$="-section"] {
  overflow-x: auto !important;
  max-width: 100% !important;
}
/* 表格本身：让宽度自然撑开 + 父级横滚 */
main.content table {
  min-width: max-content;
  width: auto !important;
  max-width: none !important;
}

/* badge / tag */
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
'''

# 拼接：tokens 在最前（先定义），base，components，最后 retrofit override
ALL_INLINE_CSS = (
    '/* === BEGIN unitree-theme tokens.css === */\n' + THEME_TOKENS + '\n' +
    '/* === BEGIN unitree-theme base.css === */\n' + THEME_BASE + '\n' +
    '/* === BEGIN unitree-theme components.css === */\n' + THEME_COMPONENTS + '\n' +
    '/* === BEGIN UniTree retrofit override === */\n' + RETROFIT_OVERRIDE
)


def main():
    if not os.path.exists(SRC):
        print(f'[ERROR] 找不到源备份 {SRC}')
        return 1

    with open(SRC, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. 找到原始主 <style>...</style> 区段
    m = re.search(r'(<style>)(.*?)(</style>)', html, flags=re.DOTALL)
    if not m:
        print('[ERROR] 找不到主 <style>')
        return 2

    old_main_style_inner = m.group(2)
    # 内联 CSS 追加到主 style 内末尾
    new_inner = old_main_style_inner + '\n\n' + ALL_INLINE_CSS + '\n'
    new_html = html[:m.start(2)] + new_inner + html[m.end(2):]

    # 2. 替换 navbar 的 logo 文字 + sidebar 的 sidebar-header（同之前 retrofit）
    new_html = new_html.replace(
        '<h1><i class="fas fa-industry"></i> UniTree MES</h1>',
        '<h1 style="font-size:14px;color:#4B5563;font-weight:500;letter-spacing:0;margin:0;padding:0 0 0 16px;">生产管理 / 数字工位终端</h1>',
        1
    )
    new_html = new_html.replace(
        '<div class="sidebar-header">系统导航</div>',
        '''<div class="sidebar-header" style="padding:10px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;border-bottom:1px solid rgba(255,255,255,0.08);background:transparent;">
                <img src="/unitree-theme/logo.png" alt="UNITREE" style="height:52px;width:112px;object-fit:contain;display:block;" />
                <div style="font-size:16px;color:#ffffff;letter-spacing:1px;font-weight:700;margin-top:8px;line-height:1;">生产管理系统</div>
            </div>''',
        1
    )

    with open(DST, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'[OK] {DST} 重建完成 (内联 CSS, 不再用外部 link)')
    print(f'     大小: {os.path.getsize(SRC)} -> {os.path.getsize(DST)} bytes')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
