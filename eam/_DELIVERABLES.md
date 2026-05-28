# UNITREE 全平台 UI 风格统一改造交付物

> 2026-05-08 提交：将 4 个工业管理系统（portal / MES / QMS / EAM）的 UI 视觉统一对齐 WMS 风格。EAM 主代码直接在本仓库；其他系统的交付物以子目录形式归档。

## 子目录索引

| 目录 | 内容 | 部署目标 |
|------|------|---------|
| `_unitree-style/` | 共享设计 token 权威源（tokens.css / base.css / components.css / element-plus-override.scss / logo.png + sync.sh） | 改一处同步到全部 4 项目 |
| `_qms-deliverable/` | QMS 6 个 HTML（原版 + `*_unitree.html` 改造版）、`_inject_module_switcher.py`（IQC/IPQC/FQC 三业务一级菜单）、`_patch_logo.py`（UNITREE PNG logo 注入）、`_build_unitree_iqc.py`（IQC 标杆深度改造）、`_build_unitree_skin.py`（5 个轻 retrofit）、`unitree-theme/` 子目录 | `8.130.182.148:3011/qms/`（共用 portal 端口） |
| `_mes-deliverable/` | `mes.html`（含完整内联 CSS）、`mes.html.original.bak`（原版备份）、`_rebuild_mes.py`、`unitree-theme/` | `8.130.182.148:3011/mes.html` |
| `_portal-patches/` | portal（一体化平台）本会话改动的关键文件副本（Logo.vue / UserInfo.vue / Home/Index.vue / styles/var.css + index.scss / store/modules/app.ts / unitree-g1.png + unitree-logo.png） | portal 源码在内网 GitLab；本目录仅供对照 |

## 生产 URL

| 系统 | URL |
|------|-----|
| WMS（设计基准，未改造） | http://zjx.iampmer.com/wms/ |
| portal 一体化平台 | http://8.130.182.148:3011/index |
| MES 生产管理 | http://8.130.182.148:3011/mes.html |
| QMS 质量管理 | http://8.130.182.148:3011/qms/ |
| EAM 设备管理 | http://8.130.182.148:3010/ |

## 核心设计 Token

```css
--u-primary:    #1677FF;     /* 主色蓝 */
--u-bg-page:    #E6E9F0;     /* 内容区底色 */
--u-sidebar-bg: #3B3F48;     /* 侧栏深灰 */
--u-header-bg:  #FFFFFF;     /* 顶栏白 */
--u-sidebar-w:  220px;
--u-header-h:   56px;
--u-radius:     6px;
--u-fs-body:    14px;
--u-fs-table:   13px;
```

## Logo 规范（参考 WMS 实测）

- 图片：白色 UNITREE 字母 PNG（原图 2722×613，**强制显示 112×52**，object-fit: contain）
- 副标题（XX 管理系统/一体化平台）：font-size **16px** / font-weight **700** / color **#fff** / margin-top 8px / letter-spacing 1px
- Logo 区高 ~100px，背景同侧栏 `#3B3F48`

## 关键技术点

### EAM
- `src/utils/autoLogin.ts`：从 `.env` 读账号自动登录，地址栏不闪 `/login`
- `src/store/modules/app.ts`：theme version 检测，旧 localStorage theme 自动清除
- `src/styles/var.css`：UniTree 颜色 token + logo-height 100px / top-tool-height 56px 解耦
- `src/layout/components/Logo/src/Logo.vue`：UNITREE PNG（112×52）+ 16px 副标题
- `src/layout/components/ToolHeader.vue`：顶栏工具按钮 6→3（消息/全屏/用户）
- `.env.local/stage/prod`：`VITE_AUTO_LOGIN` 配置

### MES
- 单文件 HTML 因 chromium parser bug 导致外部 link/style 被丢出 DOM → 改为**全部内联**到主 `<style>` 内末尾
- layout 修复：`.container` display:block + padding-left:220px / `.sidebar` fixed / `.navbar` margin-left:220px

### QMS
- 6 个 HTML 注入 v3 三业务一级菜单（IQC / IPQC / FQC，扁平 click 跳对应主 HTML，当前业务下挂"不合格品 MRB"二级）
- 删除导航首页 + nginx `/qms/` 302 → `/qms/IQC.html`
- 共用 portal 端口 3011（避开阿里云安全组未开放 3012）

### portal
- QMS 卡片跳转 `qms.iampmer.com` → `8.130.182.148:3011/qms/IQC.html`
- 头像换成宇树春晚机器人头（CNY 装饰版）
- nginx index.html / .html / /qms/ 全 no-cache，避免缓存阴魂

## 设计稿

`/Users/wangpeng/Downloads/yushu/xitong/docs/plans/2026-05-08-unitree-ui-unification-design.md`（本仓库未包含，在 xitong 总目录）
