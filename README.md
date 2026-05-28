# 宇树平台 monorepo

包含两个独立的 Vue 3 + Vite 子应用：

| 子应用 | 目录 | 端口 | nginx 路径 | 部署脚本 |
|---|---|---|---|---|
| **Portal**（统一入口门户） | 根目录 (`./`) | `3011` | `/var/www/yushu-portal/` | `./deploy.sh` |
| **EAM**（设备资产管理控制台） | `./eam/` | `3010` | `/var/www/yushu-eam/` | `./eam/deploy.sh` |

> 子应用各自独立 `package.json` / `node_modules` / `dist` / `build`，互不依赖。  
> 进入对应目录执行 `pnpm i && pnpm dev` 即可开发。

## QMS 静态子站（非独立子应用）

| 资源 | 位置 | 服务器路径 |
|---|---|---|
| QMS HTML（IQC/IPQC/FQC + MRB） | `./public/qms/` | nginx alias → `/var/www/yushu-qms/`，从 portal 的 `/qms/` 访问 |

> QMS 不是独立 Vue 子应用，是一组纯 HTML，跟随 portal 同步交付。注入了「返回门户」按钮回到 portal。

## 仓库

- GitHub：[`wangpeng1017/yushuportal`](https://github.com/wangpeng1017/yushuportal)（main monorepo，含 portal + eam）
- EAM 旧仓库：[`wangpeng1017/yushueam-archived`](https://github.com/wangpeng1017/yushueam-archived)（已归档，仅供历史追溯）
- Portal 后端：[`wangpeng1017/yushu-portal-api`](https://github.com/wangpeng1017/yushu-portal-api)（private）

## 服务器

- 阿里云 `8.130.182.148`
- nginx 反向代理：`3010` (EAM) / `3011` (Portal + QMS alias)
- SSH 已授权（`~/.claude/settings.json`）

## 历史

- 2026-05-28：EAM 通过 `git subtree` 从 `yushueam` 仓库合并进 `eam/` 子目录，保留 129 commit 历史。`yushueam` 仓库归档为 `yushueam-archived`。
- 2026-05-28：QMS 同步 0527 新版（IQC/IPQC/FQC）到 `public/qms/`，注入返回门户按钮。
