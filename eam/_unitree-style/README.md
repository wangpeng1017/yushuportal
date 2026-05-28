# UniTree UI Theme

四系统（WMS / MES / QMS / EAM）共享的 UI 风格与组件类库。

## 目标

把 MES、QMS、EAM 的视觉风格统一到 WMS（http://zjx.iampmer.com/wms/），实现「一套产品、四个模块」的视觉一致性。

## 文件结构

```
unitree-ui-theme/
├── tokens.css                   # CSS 变量（颜色/字体/圆角/阴影/间距/布局尺寸）
├── base.css                     # reset + 全局字体 + 通用工具类
├── components.css               # 共享组件类：sidebar / header / card / btn / table / form / tag / tabs ...
├── element-plus-override.scss   # EAM 专用：Element Plus 主题变量覆盖
├── sync.sh                      # 一键同步到四个项目
└── README.md                    # 本文档
```

**这是单一权威源。禁止在各项目内手动修改 unitree-theme/ 下的文件**——所有修改都应在本目录完成，再 `./sync.sh` 同步。

## 各项目接入

### 静态站（WMS / MES / QMS）

每个 HTML 在 `<head>` 中按顺序引用：

```html
<link rel="stylesheet" href="unitree-theme/tokens.css">
<link rel="stylesheet" href="unitree-theme/base.css">
<link rel="stylesheet" href="unitree-theme/components.css">
```

引用顺序很重要：tokens 必须在最前（变量），base 第二，components 最后（覆盖优先级最高）。

### EAM（Vue + Element Plus）

1. 安装 sass：

   ```bash
   pnpm add -D sass
   ```

2. 在 `src/styles/index.scss`（如不存在则新建）：

   ```scss
   /* 1) Element Plus 主题覆盖（必须最先） */
   @use './unitree-theme/element-plus-override.scss' as *;

   /* 2) UniTree 设计令牌与组件 */
   @import './unitree-theme/tokens.css';
   @import './unitree-theme/base.css';
   @import './unitree-theme/components.css';
   ```

3. 在 `src/main.ts` 中引入：

   ```ts
   import './styles/index.scss';
   ```

4. 配置 `vite.config.ts`（让 Element Plus 重新编译 SCSS）：

   ```ts
   export default defineConfig({
     css: {
       preprocessorOptions: {
         scss: {
           additionalData: `@use "@/styles/unitree-theme/element-plus-override.scss" as *;`,
         },
       },
     },
   });
   ```

## 同步脚本

```bash
./sync.sh           # 同步全部
./sync.sh qms       # 只同步 QMS
./sync.sh mes eam   # 只同步 MES 和 EAM
```

不存在的项目目录会自动 SKIP，不会报错。

## 设计 Token 一览

完整列表见 `tokens.css`，关键变量：

| 类别 | 变量 | 值 |
|------|------|-----|
| 主色 | `--u-primary` | `#1677FF` |
| 页面背景 | `--u-bg-page` | `#E6E9F0` |
| 侧栏背景 | `--u-sidebar-bg` | `#3B3F48` |
| 顶栏背景 | `--u-header-bg` | `#FFFFFF` |
| 字体 | `--u-font` | `Microsoft YaHei, PingFang SC, ...` |
| 正文字号 | `--u-fs-body` | `14px` |
| 表格字号 | `--u-fs-table` | `13px` |
| 圆角 | `--u-radius` | `6px` |
| 侧栏宽度 | `--u-sidebar-w` | `220px` |
| 顶栏高度 | `--u-header-h` | `56px` |

## 组件类一览

| 类名 | 作用 |
|------|------|
| `.u-layout` / `.u-layout__main` / `.u-layout__content` | 整体三栏布局 |
| `.u-sidebar` / `.u-sidebar__logo` / `.u-sidebar__menu` / `.u-menu-item` | 侧栏 |
| `.u-header` / `.u-breadcrumb` / `.u-avatar` | 顶栏 |
| `.u-card` / `.u-card__header` / `.u-card__body` | 卡片 |
| `.u-stat-card` / `.u-stat-grid` | 统计数据卡 |
| `.u-btn` + 修饰符 (`--primary`/`--default`/`--text`/`--danger`) | 按钮 |
| `.u-input` / `.u-select` / `.u-textarea` / `.u-field` / `.u-label` | 表单 |
| `.u-filter-bar` / `.u-filter-grid` / `.u-filter-actions` | 筛选条 |
| `.u-table-wrap` / `.u-table` / `.u-table--striped` | 表格 |
| `.u-tag` + 修饰符 (`--success`/`--warning`/`--danger`/`--info`) | 标签 |
| `.u-tabs` / `.u-tab` / `.u-tab--active` | 标签栏 |
| `.u-pagination` / `.u-page-btn` | 分页 |
| `.u-page-header` / `.u-page-title` | 页头 |

## 版本

- v1.0 (2026-05-08) 初版，基于 WMS 反向提取

## 设计稿来源

`/Users/wangpeng/Downloads/yushu/xitong/docs/plans/2026-05-08-unitree-ui-unification-design.md`
