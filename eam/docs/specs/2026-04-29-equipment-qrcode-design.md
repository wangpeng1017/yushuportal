# 设备二维码 + PDA 移动 H5 v1 设计稿

> 文档日期: 2026-04-29
> 模块归属: 设备台账 (`eam/deviceLedger`) + 移动端 (`mobile/*`)
> 状态: ✅ 已批准 (王老师 2026-04-29)
> 关联功能: F0YY 设备二维码生成 / F0ZZ PDA 扫码 H5 落地页 (待 PRD 注册)

---

## 一、需求背景

### 1.1 用户需求

> 设备台账的每个设备都需要可以生成一个设备的二维码。在设备台账操作列加一个"生成二维码"按钮。展示二维码，二维码下面是 2 行：设备名称和设备编号。
>
> 二维码主要用于 PDA 扫码后快速进行对应设备的工单选择，比如保养工单、点巡检工单等。

### 1.2 现状

- 设备台账列表 `src/views/eam/deviceLedger/page.vue` (400 行) — 操作列当前仅【详情】按钮
- 已有可复用资产：
  - `qrcode@1.5.3` npm 包
  - `src/components/Qrcode/src/Qrcode.vue` 通用二维码组件
  - `vue3-print-nb@0.1.4` 打印插件
  - `src/views/mobile/` 移动端目录

---

## 二、决策记录

| Q | 决策项 | 选择 | 备注 |
|---|---|---|---|
| Q1 | 二维码内容 | **B+ URL 内嵌设备编号** | `https://eam.xxx.com/m/equipment/{equipmentSn}` 浏览器+App 双兼容 |
| Q2 | v1 入口菜单 | **5 项**：①保养工单 ②点巡检工单 ③维修工单 ⑤设备档案 ⑥历史工单 | ④巡检路线打卡 / ⑦设备状态上报 → v2 |
| Q2-行为 | ①②③ 点击行为 | **方案 Y：跳该设备工单列表 + 自动筛选** | 列表为空时显示【+ 新建】大按钮 |
| Q3.1 | token 有效期 | **7 天** | 平衡安全与体验 |
| Q3.2 | 账号体系 | **复用桌面端账号** | 统一身份 |
| Q4 | 移动 H5 实现 | **新建 mobile 专用页（重做 5 个页面）** | 体验优先 |
| Q5 | 已停用设备处理 | **提示"该设备已停用"** | 红色警告页，按钮禁用 |
| Q6 | 弹窗 UI | **下载 PNG + 打印贴纸 + 批量打印** | 三按钮全要 |

---

## 三、整体架构

```
【桌面端 - 设备台账列表】
src/views/eam/deviceLedger/page.vue (修改)
├─ 操作列 加按钮:【生成二维码】 → 弹 QrcodeDialog
├─ 表格加 多选列 (el-table-column type="selection")
└─ 顶部加按钮:【批量打印贴纸（已选 N 台）】

新增组件:
src/views/eam/deviceLedger/components/
├─ QrcodeDialog.vue        单台二维码弹窗
└─ BatchLabelPrint.vue     批量贴纸打印预览

【移动端 H5 - 重做 5 个页面】
src/views/mobile/
├─ equipment/landing.vue    扫码落地页 ⭐ 入口
├─ equipment/detail.vue     设备档案查看
├─ maintenance/list.vue     保养工单列表
├─ spotInspection/list.vue  点巡检列表
├─ repairOrder/list.vue     维修工单列表
├─ workorder/history.vue    综合历史工单
└─ login.vue                移动端登录

【路由】
src/router/modules/remaining.ts
└─ /m/* 路由组（独立 layout，无菜单栏，仅顶部 title）
```

---

## 四、桌面端二维码弹窗 (QrcodeDialog)

### 4.1 视觉规格

```
┌──────────────────────────────────┐
│  设备二维码                  [X] │
├──────────────────────────────────┤
│        ┌──────────────┐          │
│        │              │          │
│        │   QR 240px   │          │
│        │              │          │
│        └──────────────┘          │
│                                  │
│        设备名称：立式加工中心    │
│        设备编号：EQ20240001      │
│                                  │
├──────────────────────────────────┤
│        [下载 PNG]  [打印贴纸]    │
└──────────────────────────────────┘
```

### 4.2 技术细节

- 二维码组件复用 `src/components/Qrcode/src/Qrcode.vue`
- URL 生成：`${import.meta.env.VITE_APP_URL}/m/equipment/${equipmentSn}`
- 屏幕显示尺寸：240×240px
- 下载 PNG 尺寸：512×512px（高分辨率）
- 下载实现：`canvas.toDataURL('image/png')` → `<a download>` 触发
- 打印贴纸：单张 70×50mm，复用 `vue3-print-nb`

### 4.3 操作列按钮

```vue
<el-button link
  v-hasPermi="[PERMI.QUERY]"
  @click="openQrcode(scope.row)">
  生成二维码
</el-button>
```

权限沿用 `eam:optEquipment:query`（能看到设备就能生成）。

---

## 五、批量打印贴纸 (BatchLabelPrint)

### 5.1 触发流程

1. 列表 `el-table-column type="selection"` 多选（仅当前页生效，不跨页）
2. 顶部按钮：`批量打印贴纸（已选 N 台）` — N=0 时禁用
3. 点击 → 弹窗预览 → 调用 `vue3-print-nb` 打印

### 5.2 贴纸规格

- **单张尺寸**：70×50mm（行业常用，可贴中等设备）
- **A4 排版**：4 列 × 11 行 = **44 张/页**
- **单张布局**：

```
┌─────────────────────┐
│ ┌──────┐            │
│ │ QR   │  立式加工  │
│ │28×28 │  中心      │
│ │ mm   │  EQ-001    │
│ └──────┘            │
└─────────────────────┘
```

---

## 六、移动 H5 落地页 (landing.vue)

### 6.1 路由

`/m/equipment/:sn` （公开访问，无需 token）

### 6.2 视觉规格

```
扫码进入 /m/equipment/EQ20240001

  ┌─ 顶部状态条 ─────────┐
  │  立式加工中心  🟢 运行 │
  │  EQ20240001          │
  │  CNC 数控机加车间    │
  └──────────────────────┘

  ┌─ 工单菜单 ───────────┐
  │ [🔧 保养工单]        │
  │ [📋 点巡检工单]      │
  │ [🔨 维修工单]        │
  │ [📂 设备档案查看]    │ ← 公开
  │ [📜 历史工单查询]    │
  └──────────────────────┘
```

### 6.3 异常分支

| 场景 | 处理 |
|---|---|
| 设备不存在 | 显示"设备不存在或已删除"空态页 |
| `equipmentStatus === 'ABOLISHED'` 或 `operationStatus === 'CLOSE'` | 显示"⚠ 该设备已停用"红色警告页，按钮全部禁用 |
| API 失败 | 显示重试按钮 |

---

## 七、认证与路由守卫

### 7.1 路由 meta

```ts
/m/equipment/:sn          → public: true   (落地页公开)
/m/equipment/detail        → public: true   (档案查看公开)
/m/maintenance/list        → public: false  (要登录)
/m/spotInspection/list     → public: false
/m/repairOrder/list        → public: false
/m/workorder/history       → public: false
/m/login                   → public: true
```

### 7.2 Guard 逻辑

```ts
router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/m/')) {
    if (to.meta.public) return next()
    const token = getMobileToken()  // localStorage, 7 天
    if (!token) {
      return next(`/m/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
  next()
})
```

### 7.3 登录流程

- 复用 `useUserStore.login()` 接口（统一桌面端账号）
- token 存 `localStorage`，key=`mobileToken`，有效期 7 天
- 登录成功后 `router.replace(redirect)`
- redirect 参数兜底：解析失败/参数错误 → 跳 `/m/equipment` 列表

---

## 八、API 契约

### 8.1 桌面端

**无新增 API**（二维码纯前端生成）。

### 8.2 移动端

```ts
// src/api/mobile/equipment.ts (新增)
export interface DeviceLandingVo {
  id: string
  equipmentSn: string
  equipmentName: string
  equipmentTypeDesc: string
  operationStatus: string  // RUN / FAILURE / STANDBY / CLOSE
  equipmentStatus: string  // 资产状态：USING / ABOLISHED / ...
}

export const getDeviceBySn = (sn: string) =>
  request.get({ url: `/eam/optEquipment/getBySn?sn=${sn}` })
```

```ts
// src/api/mobile/workorder.ts (新增, 复用现有后端接口)
export const getMaintenanceListBySn = (params) =>
  request.get({ url: '/eam/maintenance/list', params })

export const getSpotInspectionListBySn = (params) =>
  request.get({ url: '/eam/spotInspection/list', params })

export const getRepairOrderListBySn = (params) =>
  request.get({ url: '/eam/repairWorkOrder/list', params })

export const getWorkorderHistoryBySn = (params) =>
  request.get({ url: '/eam/workorder/history', params })
```

---

## 九、错误处理

| 场景 | 处理 |
|---|---|
| 二维码生成失败 | 弹窗内显示 ErrorPlaceholder + 重试按钮 |
| 设备不存在 | H5 显示空态页 |
| 设备已停用 | H5 显示红色警告页，按钮禁用 |
| 未登录访问受保护页 | 跳 `/m/login?redirect=...` |
| 登录后 redirect 失败 | 兜底跳 `/m/equipment` |
| 桌面端打印对话框被取消 | 不做处理 |

---

## 十、测试策略

### 10.1 PRD 更新

- `F0YY 设备二维码生成`（桌面端）
- `F0ZZ PDA 扫码 H5 落地页`

### 10.2 单元测试（Jest，纯逻辑）

| 测试文件 | 覆盖逻辑 |
|---|---|
| `qrcode-url-builder.test.ts` | URL 拼接（特殊字符 escape、域名拼接、无尾斜杠等边界） |
| `device-status-check.test.ts` | 已停用/不存在判定（基于 equipmentStatus + operationStatus 组合） |
| `mobile-route-guard.test.ts` | 路由守卫白名单 + 跳登录的 redirect 编码 |
| `batch-label-layout.test.ts` | A4 排版分页（30/44/45/100 等台数的页数计算） |

---

## 十一、Auto Mode 合理假设

1. ✅ 二维码弹窗显示尺寸：240×240px
2. ✅ 下载 PNG 尺寸：512×512px（高分辨率印刷用）
3. ✅ 贴纸单张：70×50mm（中等设备适用）
4. ✅ A4 排版：4×11 = 44 张/页
5. ✅ Mobile token 存 localStorage，key=`mobileToken`
6. ✅ Mobile layout 独立，无侧栏菜单（PDA 屏幕小）
7. ✅ "生成二维码"按钮权限沿用 `eam:optEquipment:query`
8. ✅ 多选只对当前页生效（不跨页）

---

## 十二、v2 预留

- ④ 巡检路线打卡（需路线匹配逻辑 + 打卡接口）
- ⑦ 设备状态上报（需新建后端接口和数据模型）
- 二维码批量生成 PDF（带分页+边距控制）
- 设备状态实时同步（H5 落地页接 IoT 实时数据）
