#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
M3b 批量改造：给 QMS 其余 5 个 HTML 注入 UniTree 视觉皮肤
- 不替换侧栏/页面内容，只通过 CSS 覆盖让原 Bootstrap 元素视觉对齐 WMS
- 输出 *_unitree.html，原文件不动
"""
import os
import sys

DIR = os.path.dirname(os.path.abspath(__file__))

FILES = [
    'IQC_MRB_20260503.html',
    'IPQC_20260507.html',
    'IPQC_MRB_20260503.html',
    'FQC_20260507.html',
    'FQC_MRB_20260503.html',
]

# 副标题（出现在 .sidebar 上，便于配合 logo 显示）
SUBTITLES = {
    'IQC_MRB_20260503.html': '质量管理系统 / IQC MRB',
    'IPQC_20260507.html': '质量管理系统 / IPQC 检验',
    'IPQC_MRB_20260503.html': '质量管理系统 / IPQC MRB',
    'FQC_20260507.html': '质量管理系统 / FQC 检验',
    'FQC_MRB_20260503.html': '质量管理系统 / FQC MRB',
}

INJECT_TEMPLATE = '''
<!-- UniTree UI Theme (M3b 轻 retrofit) -->
<link rel="stylesheet" href="unitree-theme/tokens.css">
<link rel="stylesheet" href="unitree-theme/base.css">
<link rel="stylesheet" href="unitree-theme/components.css">
<style>
  /* ==== UniTree Skin: 给原 Bootstrap 元素套 WMS 视觉 ==== */
  body {
    font-family: var(--u-font) !important;
    font-size: var(--u-fs-body) !important;
    background-color: var(--u-bg-page) !important;
    color: var(--u-text-2) !important;
  }
  h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5 {
    color: var(--u-text-1) !important;
  }
  h4, .h4 { font-size: var(--u-fs-h2) !important; }

  /* —— 侧栏覆盖 —— */
  .sidebar {
    background-color: var(--u-sidebar-bg) !important;
    width: var(--u-sidebar-w) !important;
    color: var(--u-sidebar-text) !important;
    padding-top: 0 !important;
  }
  .sidebar .text-center.mb-3,
  .sidebar .menu-header {
    padding: var(--u-space-4) var(--u-space-4) var(--u-space-3) !important;
    border-bottom: 1px solid rgba(255,255,255,0.08) !important;
    margin: 0 !important;
  }
  .sidebar .text-center.mb-3 h4,
  .sidebar .menu-header {
    font-weight: 700 !important;
    color: #fff !important;
    letter-spacing: 2px !important;
    margin-bottom: 4px !important;
  }
  .sidebar .text-center.mb-3 .badge,
  .sidebar .text-center.mb-3 span.badge {
    background: transparent !important;
    color: rgba(255,255,255,.65) !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    letter-spacing: 1px !important;
    padding: 0 !important;
    margin-top: 4px !important;
  }
  .sidebar .menu-title {
    color: rgba(255,255,255,.40) !important;
    font-size: 12px !important;
    font-weight: 400 !important;
    letter-spacing: 1px !important;
    padding: var(--u-space-3) var(--u-space-5) var(--u-space-2) !important;
    border: none !important;
    cursor: default !important;
  }
  .sidebar .menu-title:hover { color: rgba(255,255,255,.40) !important; }
  .sidebar .menu-title i { display: none !important; }
  .sidebar .sub-menu { padding-left: 0 !important; background: transparent !important; }
  .sidebar .sub-menu a,
  .sidebar .nav-link {
    height: var(--u-menu-item-h) !important;
    display: flex !important;
    align-items: center !important;
    padding: 0 var(--u-space-5) !important;
    color: var(--u-sidebar-text) !important;
    font-size: var(--u-fs-body) !important;
    border-left: none !important;
    transition: background .15s !important;
  }
  .sidebar .sub-menu a:hover,
  .sidebar .nav-link:hover {
    background: var(--u-sidebar-bg-hover) !important;
    color: #fff !important;
  }
  .sidebar .sub-menu a.active,
  .sidebar .nav-link.active {
    background: var(--u-sidebar-active-bg) !important;
    color: #fff !important;
    position: relative;
    border-left: none !important;
  }
  .sidebar .sub-menu a.active::before,
  .sidebar .nav-link.active::before {
    content: "";
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 4px;
    background: #fff;
  }

  /* —— 主体覆盖 —— */
  .main-content {
    margin-left: var(--u-sidebar-w) !important;
    width: calc(100% - var(--u-sidebar-w)) !important;
    padding: var(--u-content-padding) !important;
    background-color: var(--u-bg-page) !important;
  }

  /* —— Bootstrap 卡片 —— */
  .card {
    border: none !important;
    border-radius: var(--u-radius) !important;
    box-shadow: var(--u-shadow-card) !important;
  }

  /* —— Bootstrap 按钮 —— */
  .btn { border-radius: var(--u-radius) !important; font-weight: 400 !important; }
  .btn-primary,
  .btn-primary:focus {
    background-color: var(--u-primary) !important;
    border-color: var(--u-primary) !important;
  }
  .btn-primary:hover {
    background-color: var(--u-primary-hover) !important;
    border-color: var(--u-primary-hover) !important;
  }
  .btn-outline-primary {
    border-color: var(--u-border-dark) !important;
    color: var(--u-text-2) !important;
    background: #fff !important;
  }
  .btn-outline-primary:hover {
    border-color: var(--u-primary) !important;
    color: var(--u-primary) !important;
    background: #fff !important;
  }
  .btn-success { background-color: var(--u-success) !important; border-color: var(--u-success) !important; }
  .btn-danger  { background-color: var(--u-danger)  !important; border-color: var(--u-danger)  !important; }
  .btn-warning { background-color: var(--u-warning) !important; border-color: var(--u-warning) !important; color: #fff !important; }
  .btn-info    { background-color: var(--u-info)    !important; border-color: var(--u-info)    !important; color: #fff !important; }

  /* —— Bootstrap 徽章 → UniTree Tag 视觉 —— */
  .badge {
    font-weight: 400 !important;
    border-radius: var(--u-radius-sm) !important;
    padding: 4px 8px !important;
    font-size: var(--u-fs-sm) !important;
  }
  .badge.bg-primary   { background-color: var(--u-primary-bg) !important; color: var(--u-primary) !important; border: 1px solid var(--u-primary-border); }
  .badge.bg-success   { background-color: var(--u-success-bg) !important; color: var(--u-success) !important; border: 1px solid var(--u-success-border); }
  .badge.bg-warning   { background-color: var(--u-warning-bg) !important; color: var(--u-warning) !important; border: 1px solid var(--u-warning-border); }
  .badge.bg-danger    { background-color: var(--u-danger-bg)  !important; color: var(--u-danger)  !important; border: 1px solid var(--u-danger-border);  }
  .badge.bg-info      { background-color: var(--u-info-bg)    !important; color: var(--u-info)    !important; border: 1px solid var(--u-info-border);    }
  .badge.bg-secondary { background-color: var(--u-bg-stripe) !important; color: var(--u-text-2) !important; border: 1px solid var(--u-border); }

  /* —— Bootstrap 表格 —— */
  .table {
    --bs-table-color: var(--u-text-2) !important;
    border-color: var(--u-border-light) !important;
    font-size: var(--u-fs-table) !important;
  }
  .table thead th {
    background-color: var(--u-bg-stripe) !important;
    color: var(--u-text-1) !important;
    font-weight: 500 !important;
    border-bottom-color: var(--u-border) !important;
  }
  .table-hover tbody tr:hover { --bs-table-bg-state: var(--u-bg-hover) !important; }
  .table-bordered { border-color: var(--u-border-light) !important; }
  .table-bordered th, .table-bordered td { border-color: var(--u-border-light) !important; }

  /* —— Bootstrap Tab —— */
  .nav-tabs { border-bottom: 1px solid var(--u-border) !important; }
  .nav-tabs .nav-link {
    color: var(--u-text-2) !important;
    border: none !important;
    background: transparent !important;
    padding: 12px 0 !important;
    margin-right: 24px !important;
  }
  .nav-tabs .nav-link.active {
    color: var(--u-primary) !important;
    font-weight: 500 !important;
    border-bottom: 2px solid var(--u-primary) !important;
    background: transparent !important;
  }

  /* —— 表单元素 —— */
  .form-control, .form-select {
    border-radius: var(--u-radius) !important;
    border-color: var(--u-border) !important;
    font-size: var(--u-fs-body) !important;
  }
  .form-control:focus, .form-select:focus {
    border-color: var(--u-primary) !important;
    box-shadow: var(--u-shadow-focus) !important;
  }
  .form-label { color: var(--u-text-2) !important; font-weight: 400 !important; }

  /* —— Modal —— */
  .modal-content {
    border-radius: var(--u-radius) !important;
    border: none !important;
    box-shadow: var(--u-shadow-modal) !important;
  }
  .modal-header { border-bottom: 1px solid var(--u-border-light) !important; }
  .modal-footer { border-top: 1px solid var(--u-border-light) !important; }

  /* —— Alert —— */
  .alert { border-radius: var(--u-radius) !important; border: none !important; }

  /* —— 文字色覆盖 —— */
  .text-muted { color: var(--u-text-3) !important; }
  .text-danger { color: var(--u-danger) !important; }
  .text-success { color: var(--u-success) !important; }
  .text-warning { color: var(--u-warning) !important; }
  .text-info { color: var(--u-info) !important; }
  .text-primary { color: var(--u-primary) !important; }
</style>
'''


def retrofit(filename: str) -> bool:
    src = os.path.join(DIR, filename)
    base, _ = os.path.splitext(filename)
    dst = os.path.join(DIR, f'{base}_unitree.html')
    with open(src, 'r', encoding='utf-8') as f:
        html = f.read()
    if '</head>' not in html:
        print(f'[ERROR] {filename}: 找不到 </head>')
        return False
    new_html = html.replace('</head>', INJECT_TEMPLATE + '\n</head>', 1)
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print(f'[OK] {filename} -> {os.path.basename(dst)}  '
          f'({os.path.getsize(src)} -> {os.path.getsize(dst)} bytes)')
    return True


def main() -> int:
    ok_count = 0
    for f in FILES:
        if retrofit(f):
            ok_count += 1
    print(f'\n完成 {ok_count}/{len(FILES)} 个文件')
    return 0 if ok_count == len(FILES) else 1


if __name__ == '__main__':
    sys.exit(main())
