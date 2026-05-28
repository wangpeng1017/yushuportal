# 设备二维码 + PDA 移动 H5 v1 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 桌面端"设备台账"操作列加【生成二维码】+ 表格批量打印贴纸；新建移动 H5 模块 (`/m/*`) 提供扫码后的 5 个工单入口；**纯前端 + 充足 mock 数据，不动后端**。

**Architecture:** 利用项目已有 `qrcode` 库 + `vue3-print-nb` 完成桌面端二维码弹窗与批量贴纸；新建独立的 `/m/*` 路由组（公开落地页 + 鉴权工单页 + 移动登录），通过 mock 文件注入 6 类接口数据（设备 by sn、4 类工单列表、移动登录），实现端到端可演示流程。

**Tech Stack:**
- Vue 3.5 + Element Plus 2.11 + UnoCSS + TypeScript
- 二维码：`qrcode@1.5.3` + 复用 `src/components/Qrcode/src/Qrcode.vue`
- 打印：`vue3-print-nb@0.1.4`
- Mock：vite-plugin-mock + 双份注入 (`mock/` + `src/mock-data/`)
- 测试：Jest（按 `~/.claude/rules/testing.md` 纯逻辑测试）

**关联设计稿:** `docs/specs/2026-04-29-equipment-qrcode-design.md`

---

## File Structure

### 桌面端（修改）

| 路径 | 责任 | 类型 |
|---|---|---|
| `src/views/eam/deviceLedger/page.vue` | 操作列加按钮 + 多选 + 批量打印入口 | 修改 |
| `src/views/eam/deviceLedger/components/QrcodeDialog.vue` | 单台二维码弹窗（含下载 PNG / 打印按钮） | 新建 |
| `src/views/eam/deviceLedger/components/BatchLabelPrint.vue` | 批量贴纸预览 + 打印 | 新建 |
| `src/views/eam/deviceLedger/utils/qrcode-helper.ts` | URL 生成 / canvas → PNG 下载 工具 | 新建 |

### 移动端（全新建）

| 路径 | 责任 | 类型 |
|---|---|---|
| `src/views/mobile/equipment/landing.vue` | 扫码落地页（公开）+ 5 工单按钮 | 新建 |
| `src/views/mobile/equipment/detail.vue` | 设备档案查看（公开） | 新建 |
| `src/views/mobile/equipment/components/StatusTag.vue` | 设备状态标签（运行/待机/停机/故障） | 新建 |
| `src/views/mobile/maintenance/list.vue` | 保养工单列表（要登录，按 sn 筛选） | 新建 |
| `src/views/mobile/spotInspection/list.vue` | 点巡检工单列表 | 新建 |
| `src/views/mobile/repairOrder/list.vue` | 维修工单列表 | 新建 |
| `src/views/mobile/workorder/history.vue` | 综合历史工单列表 | 新建 |
| `src/views/mobile/login.vue` | 移动端登录页 | 新建 |
| `src/views/mobile/components/MobileHeader.vue` | 通用顶部条（标题 + 返回按钮） | 新建 |
| `src/views/mobile/components/WorkOrderCard.vue` | 通用工单卡片 | 新建 |
| `src/views/mobile/utils/mobile-token.ts` | localStorage token 读写 / 校验有效期 | 新建 |
| `src/views/mobile/utils/mobile-route-guard.ts` | 路由守卫白名单 + redirect 编码 | 新建 |

### API（前端调用层）

| 路径 | 责任 | 类型 |
|---|---|---|
| `src/api/mobile/equipment.ts` | `getDeviceBySn` | 新建 |
| `src/api/mobile/workorder.ts` | 4 类工单列表查询 | 新建 |
| `src/api/mobile/auth.ts` | 移动端登录接口 | 新建 |

### Mock（demo 数据 + 接口）

| 路径 | 责任 | 类型 |
|---|---|---|
| `mock/eam-mobile.ts` | 移动端 7 个 mock 接口 + 充足设备/工单数据 | 新建 |
| `src/mock-data/eam-mobile.ts` | 同上（生产 mock 桥接） | 新建 |
| `mock/_prodMock.ts` | 注册新 mock | 修改 |
| `src/mock-bridge.ts` | 注册新 mock | 修改 |

### 路由

| 路径 | 责任 | 类型 |
|---|---|---|
| `src/router/modules/remaining.ts` | 新增 `/m/*` 路由组 7 条 + guard 钩子 | 修改 |

### 测试

| 路径 | 责任 | 类型 |
|---|---|---|
| `src/lib/__tests__/qrcode-url-builder.test.ts` | URL 拼接逻辑测试 | 新建 |
| `src/lib/__tests__/device-status-check.test.ts` | 已停用/不存在判定测试 | 新建 |
| `src/lib/__tests__/mobile-route-guard.test.ts` | 路由守卫白名单测试 | 新建 |
| `src/lib/__tests__/batch-label-layout.test.ts` | A4 排版分页测试 | 新建 |

### PRD

| 路径 | 责任 | 类型 |
|---|---|---|
| `docs/PRD.md` | F0XX 设备二维码生成 + F0YY PDA 扫码 H5 落地页 | 修改/新建 |

---

## Tasks

### Task 1: 工具函数 + 单元测试（TDD 起步）

**Files:**
- Create: `src/views/eam/deviceLedger/utils/qrcode-helper.ts`
- Create: `src/views/mobile/utils/mobile-token.ts`
- Create: `src/views/mobile/utils/mobile-route-guard.ts`
- Test: `src/lib/__tests__/qrcode-url-builder.test.ts`
- Test: `src/lib/__tests__/mobile-route-guard.test.ts`
- Test: `src/lib/__tests__/batch-label-layout.test.ts`

- [ ] **Step 1.1: 写 URL 构建器测试（先红）**

```typescript
// src/lib/__tests__/qrcode-url-builder.test.ts
import { buildEquipmentQrUrl } from '@/views/eam/deviceLedger/utils/qrcode-helper'

describe('buildEquipmentQrUrl', () => {
  it('正常拼接 URL', () => {
    expect(buildEquipmentQrUrl('https://eam.com', 'EQ20240001'))
      .toBe('https://eam.com/m/equipment/EQ20240001')
  })
  it('域名末尾有斜杠也能正确拼接', () => {
    expect(buildEquipmentQrUrl('https://eam.com/', 'EQ001'))
      .toBe('https://eam.com/m/equipment/EQ001')
  })
  it('设备编号含特殊字符要 escape', () => {
    expect(buildEquipmentQrUrl('https://eam.com', 'EQ/001'))
      .toBe('https://eam.com/m/equipment/EQ%2F001')
  })
  it('空设备编号抛错', () => {
    expect(() => buildEquipmentQrUrl('https://eam.com', '')).toThrow()
  })
})
```

- [ ] **Step 1.2: 跑测试，确认失败**

```bash
npx jest src/lib/__tests__/qrcode-url-builder.test.ts
```
Expected: FAIL `Cannot find module '@/views/eam/deviceLedger/utils/qrcode-helper'`

- [ ] **Step 1.3: 实现 qrcode-helper.ts**

```typescript
// src/views/eam/deviceLedger/utils/qrcode-helper.ts
/**
 * 拼接设备二维码 URL
 * @param baseUrl - 域名前缀，例如 https://eam.com
 * @param equipmentSn - 设备编号
 * @returns 完整二维码 URL，例如 https://eam.com/m/equipment/EQ20240001
 */
export function buildEquipmentQrUrl(baseUrl: string, equipmentSn: string): string {
  if (!equipmentSn) {
    throw new Error('equipmentSn 不能为空')
  }
  const cleanBase = baseUrl.replace(/\/+$/, '')
  return `${cleanBase}/m/equipment/${encodeURIComponent(equipmentSn)}`
}

/**
 * 从 canvas 元素生成 PNG 并触发下载
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string): void {
  const url = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

/**
 * 获取部署环境的 base URL
 */
export function getDeployBaseUrl(): string {
  return import.meta.env.VITE_APP_URL || window.location.origin
}
```

- [ ] **Step 1.4: 跑测试，确认通过**

```bash
npx jest src/lib/__tests__/qrcode-url-builder.test.ts
```
Expected: PASS（4 个用例全过）

- [ ] **Step 1.5: 写 A4 排版分页测试**

```typescript
// src/lib/__tests__/batch-label-layout.test.ts
import { calcLabelPages } from '@/views/eam/deviceLedger/utils/qrcode-helper'

describe('calcLabelPages', () => {
  it('44 张占满 1 页', () => {
    expect(calcLabelPages(44)).toEqual({ totalPages: 1, perPage: 44, lastPageCount: 44 })
  })
  it('45 张占 2 页（首页满 + 末页 1）', () => {
    expect(calcLabelPages(45)).toEqual({ totalPages: 2, perPage: 44, lastPageCount: 1 })
  })
  it('100 张占 3 页（前 2 页满 + 末页 12）', () => {
    expect(calcLabelPages(100)).toEqual({ totalPages: 3, perPage: 44, lastPageCount: 12 })
  })
  it('0 张返回 0 页', () => {
    expect(calcLabelPages(0)).toEqual({ totalPages: 0, perPage: 44, lastPageCount: 0 })
  })
})
```

- [ ] **Step 1.6: 实现 calcLabelPages 函数**

追加到 `src/views/eam/deviceLedger/utils/qrcode-helper.ts`：

```typescript
const LABELS_PER_PAGE = 44 // A4 4×11 排版

export function calcLabelPages(count: number): {
  totalPages: number
  perPage: number
  lastPageCount: number
} {
  if (count <= 0) {
    return { totalPages: 0, perPage: LABELS_PER_PAGE, lastPageCount: 0 }
  }
  const totalPages = Math.ceil(count / LABELS_PER_PAGE)
  const lastPageCount = count % LABELS_PER_PAGE === 0 ? LABELS_PER_PAGE : count % LABELS_PER_PAGE
  return { totalPages, perPage: LABELS_PER_PAGE, lastPageCount }
}
```

- [ ] **Step 1.7: 跑测试**

```bash
npx jest src/lib/__tests__/batch-label-layout.test.ts
```
Expected: PASS（4 个用例全过）

- [ ] **Step 1.8: 写 mobile token 工具**

```typescript
// src/views/mobile/utils/mobile-token.ts
const TOKEN_KEY = 'mobileToken'
const EXPIRE_KEY = 'mobileTokenExpiresAt'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 天

export function setMobileToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRE_KEY, String(Date.now() + TOKEN_TTL_MS))
}

export function getMobileToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = Number(localStorage.getItem(EXPIRE_KEY) || 0)
  if (!token) return null
  if (Date.now() > expiresAt) {
    clearMobileToken()
    return null
  }
  return token
}

export function clearMobileToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRE_KEY)
}

export function isMobileTokenValid(): boolean {
  return getMobileToken() !== null
}
```

- [ ] **Step 1.9: 写路由守卫测试**

```typescript
// src/lib/__tests__/mobile-route-guard.test.ts
import { isPublicMobileRoute, buildLoginRedirect } from '@/views/mobile/utils/mobile-route-guard'

describe('isPublicMobileRoute', () => {
  it('落地页公开', () => {
    expect(isPublicMobileRoute('/m/equipment/EQ001')).toBe(true)
  })
  it('设备档案公开', () => {
    expect(isPublicMobileRoute('/m/equipment/detail')).toBe(true)
  })
  it('登录页公开', () => {
    expect(isPublicMobileRoute('/m/login')).toBe(true)
  })
  it('保养工单要登录', () => {
    expect(isPublicMobileRoute('/m/maintenance/list')).toBe(false)
  })
  it('维修工单要登录', () => {
    expect(isPublicMobileRoute('/m/repairOrder/list')).toBe(false)
  })
  it('非 /m 开头不在白名单管控范围', () => {
    expect(isPublicMobileRoute('/foo')).toBe(true)
  })
})

describe('buildLoginRedirect', () => {
  it('编码 redirect 参数', () => {
    expect(buildLoginRedirect('/m/maintenance/list?equipmentSn=EQ001'))
      .toBe('/m/login?redirect=%2Fm%2Fmaintenance%2Flist%3FequipmentSn%3DEQ001')
  })
  it('空 redirect 兜底跳落地', () => {
    expect(buildLoginRedirect('')).toBe('/m/login')
  })
})
```

- [ ] **Step 1.10: 实现 mobile-route-guard.ts**

```typescript
// src/views/mobile/utils/mobile-route-guard.ts
const PUBLIC_PATHS = [
  /^\/m\/login/,
  /^\/m\/equipment\/detail/,
  /^\/m\/equipment\/[^/]+$/,
]

export function isPublicMobileRoute(path: string): boolean {
  if (!path.startsWith('/m/')) return true
  return PUBLIC_PATHS.some(re => re.test(path))
}

export function buildLoginRedirect(originalPath: string): string {
  if (!originalPath) return '/m/login'
  return `/m/login?redirect=${encodeURIComponent(originalPath)}`
}
```

- [ ] **Step 1.11: 跑全部新增测试**

```bash
npx jest src/lib/__tests__/qrcode-url-builder.test.ts src/lib/__tests__/batch-label-layout.test.ts src/lib/__tests__/mobile-route-guard.test.ts --no-coverage
```
Expected: PASS（14 个用例全过）

- [ ] **Step 1.12: Commit**

```bash
git add src/views/eam/deviceLedger/utils/qrcode-helper.ts \
        src/views/mobile/utils/mobile-token.ts \
        src/views/mobile/utils/mobile-route-guard.ts \
        src/lib/__tests__/qrcode-url-builder.test.ts \
        src/lib/__tests__/batch-label-layout.test.ts \
        src/lib/__tests__/mobile-route-guard.test.ts
git commit -m "feat(eam): 设备二维码工具函数 + 移动端 token/路由守卫工具（含单测）"
```

---

### Task 2: API 调用层

**Files:**
- Create: `src/api/mobile/equipment.ts`
- Create: `src/api/mobile/workorder.ts`
- Create: `src/api/mobile/auth.ts`

- [ ] **Step 2.1: 实现设备 API**

```typescript
// src/api/mobile/equipment.ts
import request from '@/config/axios'

export interface DeviceLandingVo {
  id: string
  equipmentSn: string
  equipmentName: string
  equipmentTypeDesc: string
  workshopName: string
  operationStatus: 'RUN' | 'STANDBY' | 'CLOSE' | 'FAILURE'
  equipmentStatus: 'USING' | 'ABOLISHED' | 'IDLE'
  equipmentMode?: string
  equipmentSupplierName?: string
  equipmentOperating?: string
  equipmentPurchase?: string
}

export const getDeviceBySn = (sn: string) =>
  request.get<DeviceLandingVo>({ url: `/eam/optEquipment/getBySn`, params: { sn } })
```

- [ ] **Step 2.2: 实现工单 API**

```typescript
// src/api/mobile/workorder.ts
import request from '@/config/axios'

export interface MobileWorkOrderVo {
  id: string
  code: string                  // 工单编号
  type: 'MAINT' | 'INSP' | 'REPAIR' // 工单类型
  typeText: string
  equipmentSn: string
  equipmentName: string
  status: string
  statusText: string
  personName?: string
  workStartTime?: string
  endTime?: string
  remark?: string
  createTime: string
}

export interface MobileWorkOrderQuery {
  equipmentSn?: string
  status?: string
  showAll?: 0 | 1   // 0=仅未完成；1=全部
  pageNo?: number
  pageSize?: number
}

export const getMaintenanceListBySn = (params: MobileWorkOrderQuery) =>
  request.get({ url: '/mobile/workorder/maintenance/list', params })

export const getSpotInspectionListBySn = (params: MobileWorkOrderQuery) =>
  request.get({ url: '/mobile/workorder/spotInspection/list', params })

export const getRepairListBySn = (params: MobileWorkOrderQuery) =>
  request.get({ url: '/mobile/workorder/repair/list', params })

export const getHistoryListBySn = (params: MobileWorkOrderQuery) =>
  request.get({ url: '/mobile/workorder/history/list', params })
```

- [ ] **Step 2.3: 实现移动端登录 API**

```typescript
// src/api/mobile/auth.ts
import request from '@/config/axios'

export interface MobileLoginParams {
  username: string
  password: string
}

export interface MobileLoginVo {
  token: string
  userId: string
  nickname: string
  expiresIn: number   // 秒
}

export const mobileLogin = (data: MobileLoginParams) =>
  request.post<MobileLoginVo>({ url: '/mobile/auth/login', data })
```

- [ ] **Step 2.4: Commit**

```bash
git add src/api/mobile/
git commit -m "feat(mobile): 设备/工单/登录 三类移动端 API 调用层"
```

---

### Task 3: Mock 数据 + Mock 接口

**Files:**
- Create: `mock/eam-mobile.ts`
- Create: `src/mock-data/eam-mobile.ts`
- Modify: `mock/_prodMock.ts`
- Modify: `src/mock-bridge.ts`

- [ ] **Step 3.1: 设计 mock 设备清单（覆盖各种状态）**

mock 数据要包含至少 8 台设备，覆盖：
- 4 台 RUN 运行中
- 1 台 STANDBY 待机
- 1 台 CLOSE 停机（资产 USING）
- 1 台 FAILURE 故障
- 1 台 ABOLISHED 已废弃（资产已停用，扫码触发"已停用"提示）

并且：每台设备至少 2 张工单（覆盖未完成 + 已完成），保养/点巡检/维修各类型都有数据。

- [ ] **Step 3.2: 创建 mock/eam-mobile.ts**

```typescript
// mock/eam-mobile.ts
/**
 * Mock: 移动 H5（设备扫码落地页 + 4 类工单 + 移动登录）
 */
import type { MockMethod } from 'vite-plugin-mock'

// ── 设备清单（覆盖各种状态） ──
const allDevices = [
  {
    id: 'DEV-001', equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    equipmentTypeDesc: 'CNC 加工中心', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '北京精雕',
    equipmentOperating: '2023-05-01', equipmentPurchase: '2023-04-15',
  },
  {
    id: 'DEV-002', equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    equipmentTypeDesc: 'CNC 车床', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '半自动', equipmentSupplierName: '沈阳机床',
    equipmentOperating: '2023-06-20', equipmentPurchase: '2023-06-01',
  },
  {
    id: 'DEV-003', equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    equipmentTypeDesc: '装配线', workshopName: 'C端车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '宁德时代',
    equipmentOperating: '2024-01-10', equipmentPurchase: '2023-12-15',
  },
  {
    id: 'DEV-004', equipmentSn: 'EQ20240004', equipmentName: '电池分选机',
    equipmentTypeDesc: '检测设备', workshopName: 'C端车间',
    operationStatus: 'STANDBY', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '比亚迪',
  },
  {
    id: 'DEV-005', equipmentSn: 'EQ20240005', equipmentName: '涂覆机',
    equipmentTypeDesc: '涂装设备', workshopName: 'C端车间',
    operationStatus: 'FAILURE', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '广汽',
  },
  {
    id: 'DEV-006', equipmentSn: 'EQ20240006', equipmentName: '压机',
    equipmentTypeDesc: '冲压设备', workshopName: 'C端车间',
    operationStatus: 'CLOSE', equipmentStatus: 'USING',
    equipmentMode: '半自动', equipmentSupplierName: '海尔',
  },
  {
    id: 'DEV-007', equipmentSn: 'EQ20230099', equipmentName: '老式车床（已废弃）',
    equipmentTypeDesc: '老式车床', workshopName: '数控机加车间',
    operationStatus: 'CLOSE', equipmentStatus: 'ABOLISHED',
    equipmentMode: '手动', equipmentSupplierName: '上海机床厂',
  },
  {
    id: 'DEV-008', equipmentSn: 'EQ20240008', equipmentName: '激光切割机',
    equipmentTypeDesc: 'CNC 切割', workshopName: '数控机加车间',
    operationStatus: 'RUN', equipmentStatus: 'USING',
    equipmentMode: '全自动', equipmentSupplierName: '大族激光',
  },
]

// ── 工单清单（每台设备 2~4 张工单） ──
const allWorkOrders = [
  // 保养工单
  { id: 'WO-M-001', code: 'WB202404010001', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待处理', personName: '张三',
    workStartTime: '2026-04-29 09:00:00', remark: '一级保养',
    createTime: '2026-04-28 10:00:00' },
  { id: 'WO-M-002', code: 'WB202404010002', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'COMPLETED', statusText: '已完成', personName: '李四',
    workStartTime: '2026-04-15 09:00:00', endTime: '2026-04-15 11:30:00',
    remark: '二级保养', createTime: '2026-04-14 10:00:00' },
  { id: 'WO-M-003', code: 'WB202404010003', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    status: 'IN_PROGRESS', statusText: '处理中', personName: '王五',
    workStartTime: '2026-04-28 14:00:00', remark: '日常保养',
    createTime: '2026-04-28 13:00:00' },
  { id: 'WO-M-004', code: 'WB202404010004', type: 'MAINT', typeText: '保养工单',
    equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    status: 'PENDING', statusText: '待处理', personName: '赵六',
    workStartTime: '2026-04-30 08:00:00', remark: '周保养',
    createTime: '2026-04-29 09:00:00' },

  // 点巡检工单
  { id: 'WO-I-001', code: 'WI202404010001', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待巡检', personName: '张三',
    workStartTime: '2026-04-29 16:00:00', remark: '日常点检',
    createTime: '2026-04-29 08:00:00' },
  { id: 'WO-I-002', code: 'WI202404010002', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240003', equipmentName: 'PACK 线',
    status: 'COMPLETED', statusText: '已完成', personName: '李四',
    workStartTime: '2026-04-28 16:00:00', endTime: '2026-04-28 16:20:00',
    remark: '日常点检', createTime: '2026-04-28 08:00:00' },
  { id: 'WO-I-003', code: 'WI202404010003', type: 'INSP', typeText: '点巡检工单',
    equipmentSn: 'EQ20240008', equipmentName: '激光切割机',
    status: 'PENDING', statusText: '待巡检', personName: '王五',
    workStartTime: '2026-04-29 16:00:00', remark: '日常点检',
    createTime: '2026-04-29 08:00:00' },

  // 维修工单
  { id: 'WO-R-001', code: 'WR202404010001', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240005', equipmentName: '涂覆机',
    status: 'IN_PROGRESS', statusText: '处理中', personName: '维修班-赵',
    workStartTime: '2026-04-29 10:00:00', remark: '加热管温度异常',
    createTime: '2026-04-29 09:30:00' },
  { id: 'WO-R-002', code: 'WR202404010002', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240002', equipmentName: '数控车床',
    status: 'COMPLETED', statusText: '已完成', personName: '维修班-钱',
    workStartTime: '2026-04-25 14:00:00', endTime: '2026-04-25 17:00:00',
    remark: '主轴异响处理', createTime: '2026-04-25 13:00:00' },
  { id: 'WO-R-003', code: 'WR202404010003', type: 'REPAIR', typeText: '维修工单',
    equipmentSn: 'EQ20240001', equipmentName: '立式加工中心',
    status: 'PENDING', statusText: '待派工', personName: '',
    remark: 'X 轴定位漂移', createTime: '2026-04-29 11:00:00' },
]

// ── 工具函数 ──
function filterByQuery(list: any[], query: any) {
  let result = list
  if (query.equipmentSn) {
    result = result.filter(w => w.equipmentSn === query.equipmentSn)
  }
  if (query.showAll !== '1' && query.showAll !== 1) {
    result = result.filter(w => w.status !== 'COMPLETED')
  }
  return result
}

function paged(list: any[], pageNo = 1, pageSize = 20) {
  const start = (pageNo - 1) * pageSize
  return {
    records: list.slice(start, start + pageSize),
    total: list.length,
  }
}

// ── 接口注册 ──
export default [
  // 设备 by sn
  {
    url: '/admin-api/eam/optEquipment/getBySn',
    method: 'get',
    response: ({ query }: any) => {
      const sn = query.sn
      const device = allDevices.find(d => d.equipmentSn === sn)
      if (!device) {
        return { code: 404, msg: '设备不存在', data: null }
      }
      return { code: 0, msg: 'success', data: device }
    },
  },

  // 保养工单
  {
    url: '/admin-api/mobile/workorder/maintenance/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'MAINT'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 点巡检工单
  {
    url: '/admin-api/mobile/workorder/spotInspection/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'INSP'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 维修工单
  {
    url: '/admin-api/mobile/workorder/repair/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(
        allWorkOrders.filter(w => w.type === 'REPAIR'),
        query
      )
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 综合历史工单
  {
    url: '/admin-api/mobile/workorder/history/list',
    method: 'get',
    response: ({ query }: any) => {
      const list = filterByQuery(allWorkOrders, query)
      return { code: 0, msg: 'success', data: paged(list, +query.pageNo, +query.pageSize) }
    },
  },

  // 移动登录（demo: 任意用户名密码都通过）
  {
    url: '/admin-api/mobile/auth/login',
    method: 'post',
    response: ({ body }: any) => {
      const { username, password } = body || {}
      if (!username || !password) {
        return { code: 400, msg: '账号密码不能为空', data: null }
      }
      return {
        code: 0,
        msg: 'success',
        data: {
          token: 'mobile-demo-token-' + Date.now(),
          userId: 'mobile-user-001',
          nickname: username,
          expiresIn: 7 * 24 * 60 * 60,
        },
      }
    },
  },
] as MockMethod[]
```

- [ ] **Step 3.3: 创建 src/mock-data/eam-mobile.ts**

复制 `mock/eam-mobile.ts` 整个文件到 `src/mock-data/eam-mobile.ts`，将顶部 import type 替换为：

```typescript
// src/mock-data/eam-mobile.ts
// @ts-nocheck
// (其他内容与 mock/eam-mobile.ts 完全一致，但删除 import type { MockMethod } 这一行)
```

- [ ] **Step 3.4: 注册到 mock/_prodMock.ts**

```typescript
// mock/_prodMock.ts (修改)
import authMock from './auth'
import equipmentMock from './eam-equipment'
import workorderMock from './eam-workorder'
import extraMock from './eam-extra'
import routeMock from './eam-inspection-route'
import knowledgeMock from './eam-knowledge'
import projectMock from './eam-project'
import iotOeeMock from './eam-iot-oee'
import toolingMock from './eam-tooling'
import plantConfigMock from './sys-plant-config'
import feishuApprovalMock from './feishu-approval'
import mobileMock from './eam-mobile'   // 🆕

const allMocks = [
  ...authMock, ...equipmentMock, ...workorderMock, ...extraMock,
  ...routeMock, ...knowledgeMock, ...projectMock, ...iotOeeMock,
  ...toolingMock, ...plantConfigMock, ...feishuApprovalMock,
  ...mobileMock,   // 🆕
]
```

- [ ] **Step 3.5: 注册到 src/mock-bridge.ts**

```typescript
// src/mock-bridge.ts (修改)
// 在已有 import 列表末尾追加：
import mobileMock from './mock-data/eam-mobile'

// allMocks 数组末尾追加 ...mobileMock,
const allMocks = [
  // ... 已有的 mock
  ...mobileMock,
]
```

- [ ] **Step 3.6: 启动 dev 验证 mock 接口**

```bash
npm run dev
```

打开浏览器控制台，访问：
```
http://localhost:xxxx/admin-api/eam/optEquipment/getBySn?sn=EQ20240001
http://localhost:xxxx/admin-api/mobile/workorder/maintenance/list?equipmentSn=EQ20240001
```

Expected: 都能拿到 mock 数据 (`code: 0` + 设备/工单 JSON)

- [ ] **Step 3.7: Commit**

```bash
git add mock/eam-mobile.ts src/mock-data/eam-mobile.ts mock/_prodMock.ts src/mock-bridge.ts
git commit -m "feat(mock): 移动端 6 个接口 mock + 8 设备/10 工单充足演示数据"
```

---

### Task 4: 桌面端 二维码弹窗组件

**Files:**
- Create: `src/views/eam/deviceLedger/components/QrcodeDialog.vue`

- [ ] **Step 4.1: 创建 QrcodeDialog.vue**

```vue
<!-- src/views/eam/deviceLedger/components/QrcodeDialog.vue -->
<template>
  <el-dialog
    v-model="visible"
    title="设备二维码"
    width="400px"
    align-center
    @closed="onClosed"
  >
    <div class="qr-wrap" v-print="printConfig">
      <div ref="canvasWrapRef" class="qr-canvas" id="qrcode-print-area">
        <canvas ref="canvasRef" />
        <div class="qr-info">
          <div class="qr-line">设备名称：{{ device?.equipmentName }}</div>
          <div class="qr-line">设备编号：{{ device?.equipmentSn }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="handleDownload">下载 PNG</el-button>
      <el-button type="primary" @click="handlePrint">打印贴纸</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import QRCode from 'qrcode'
import { ElMessage } from 'element-plus'
import {
  buildEquipmentQrUrl,
  downloadCanvasAsPng,
  getDeployBaseUrl,
} from '../utils/qrcode-helper'

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const device = ref<DeviceLite | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const printConfig = {
  id: 'qrcode-print-area',
  popTitle: '设备二维码',
}

async function open(d: DeviceLite) {
  device.value = d
  visible.value = true
  await nextTick()
  if (!canvasRef.value) return
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), d.equipmentSn)
  try {
    await QRCode.toCanvas(canvasRef.value, url, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'H',
    })
  } catch (e) {
    ElMessage.error('二维码生成失败')
    console.error(e)
  }
}

function onClosed() {
  device.value = null
}

function handleDownload() {
  if (!canvasRef.value || !device.value) return
  // 重新生成 512×512 高分辨率版本
  const tmpCanvas = document.createElement('canvas')
  const url = buildEquipmentQrUrl(getDeployBaseUrl(), device.value.equipmentSn)
  QRCode.toCanvas(tmpCanvas, url, {
    width: 512,
    margin: 2,
    errorCorrectionLevel: 'H',
  }).then(() => {
    downloadCanvasAsPng(tmpCanvas, `${device.value!.equipmentSn}.png`)
  })
}

function handlePrint() {
  // v-print 指令已绑定，按钮触发原生打印对话框
  // 备注：v-print 自动处理；这里不需要主动调 window.print
}

defineExpose({ open })
</script>

<style scoped>
.qr-wrap {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.qr-canvas {
  text-align: center;
}
.qr-canvas canvas {
  display: block;
  margin: 0 auto;
}
.qr-info {
  margin-top: 16px;
  color: #303133;
  font-size: 14px;
}
.qr-line {
  line-height: 1.8;
}
</style>
```

> 注：`v-print` 来自项目已有依赖 `vue3-print-nb`。

- [ ] **Step 4.2: 验证组件可独立加载（手动）**

加一段临时测试代码到 `src/views/eam/deviceLedger/page.vue` 末尾：

```vue
<button @click="testQr">测试</button>
```

```typescript
const testQr = () => {
  detailRef.value.open({ equipmentSn: 'EQ20240001', equipmentName: '测试' })
}
```

启动 dev，确认弹窗显示 + 二维码渲染。验证后回滚临时代码。

- [ ] **Step 4.3: Commit**

```bash
git add src/views/eam/deviceLedger/components/QrcodeDialog.vue
git commit -m "feat(eam): 设备二维码弹窗组件（含下载 PNG/打印按钮）"
```

---

### Task 5: 桌面端 设备台账页接入二维码按钮

**Files:**
- Modify: `src/views/eam/deviceLedger/page.vue:153-164` (操作列)
- Modify: `src/views/eam/deviceLedger/page.vue:177-180` (引入弹窗)
- Modify: `src/views/eam/deviceLedger/page.vue:183-186` (import)
- Modify: `src/views/eam/deviceLedger/page.vue:323-327` (函数 + ref)

- [ ] **Step 5.1: 修改 import 区**

在 `<script lang="ts" setup>` 顶部已有 import 后追加：

```typescript
import QrcodeDialog from './components/QrcodeDialog.vue'
```

- [ ] **Step 5.2: 增加操作列按钮**

将 `page.vue:153-164` 操作列宽度从 80 改成 160，并在【详情】按钮后追加【生成二维码】：

```vue
<el-table-column label="操作" align="center" fixed="right" width="160">
  <template #default="scope">
    <el-button
      link
      class="btn-other"
      v-hasPermi="[PERMI.QUERY]"
      @click="openDetail(scope.row.id)"
    >
      &nbsp;详情
    </el-button>
    <el-button
      link
      class="btn-other"
      v-hasPermi="[PERMI.QUERY]"
      @click="openQrcode(scope.row)"
    >
      &nbsp;生成二维码
    </el-button>
  </template>
</el-table-column>
```

- [ ] **Step 5.3: 增加 ref 和函数**

在 `script setup` 末尾（onMounted 前）追加：

```typescript
// ==================== 二维码弹窗 ====================
const qrcodeRef = ref()
const openQrcode = (row: DeviceLedgerApi.DeviceLedgerVo) => {
  qrcodeRef.value.open({
    equipmentSn: row.equipmentSn,
    equipmentName: row.equipmentName,
  })
}
```

- [ ] **Step 5.4: 增加弹窗组件挂载**

将原 `<DeviceLedgerDetail ref="detailRef" />` 后追加：

```vue
<!-- 二维码弹窗 -->
<QrcodeDialog ref="qrcodeRef" />
```

- [ ] **Step 5.5: 跑 dev，端到端验证**

```bash
npm run dev
```

操作步骤：
1. 进入 `/eam/deviceLedger`
2. 任意设备的"操作列"点【生成二维码】
3. 确认弹窗显示 + 二维码可见 + 下方 2 行文字（设备名称 / 设备编号）
4. 点【下载 PNG】，确认浏览器触发下载（文件名 = `{equipmentSn}.png`）
5. 点【打印贴纸】，确认浏览器打印对话框弹出，预览中含二维码 + 文字

- [ ] **Step 5.6: Commit**

```bash
git add src/views/eam/deviceLedger/page.vue
git commit -m "feat(eam): 设备台账操作列接入【生成二维码】按钮"
```

---

### Task 6: 桌面端 批量打印贴纸组件

**Files:**
- Create: `src/views/eam/deviceLedger/components/BatchLabelPrint.vue`

- [ ] **Step 6.1: 创建 BatchLabelPrint.vue**

```vue
<!-- src/views/eam/deviceLedger/components/BatchLabelPrint.vue -->
<template>
  <el-dialog
    v-model="visible"
    :title="`批量打印贴纸（共 ${devices.length} 台 / ${pageInfo.totalPages} 页）`"
    width="900px"
    align-center
    @opened="onOpened"
  >
    <div id="batch-label-print-area" class="label-sheet">
      <div
        v-for="(group, pageIdx) in pagedDevices"
        :key="pageIdx"
        class="label-page"
      >
        <div
          v-for="d in group"
          :key="d.equipmentSn"
          class="label-cell"
        >
          <canvas :data-sn="d.equipmentSn" />
          <div class="label-info">
            <div class="label-name">{{ d.equipmentName }}</div>
            <div class="label-sn">{{ d.equipmentSn }}</div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" v-print="printConfig">打印</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import QRCode from 'qrcode'
import {
  buildEquipmentQrUrl,
  getDeployBaseUrl,
  calcLabelPages,
} from '../utils/qrcode-helper'

interface DeviceLite {
  equipmentSn: string
  equipmentName: string
}

const visible = ref(false)
const devices = ref<DeviceLite[]>([])

const printConfig = {
  id: 'batch-label-print-area',
  popTitle: '设备贴纸',
  extraCss: '',
}

const pageInfo = computed(() => calcLabelPages(devices.value.length))

const pagedDevices = computed(() => {
  const groups: DeviceLite[][] = []
  for (let i = 0; i < devices.value.length; i += pageInfo.value.perPage) {
    groups.push(devices.value.slice(i, i + pageInfo.value.perPage))
  }
  return groups
})

function open(list: DeviceLite[]) {
  devices.value = list
  visible.value = true
}

async function onOpened() {
  await nextTick()
  const baseUrl = getDeployBaseUrl()
  const allCanvas = document.querySelectorAll<HTMLCanvasElement>('#batch-label-print-area canvas')
  for (const canvas of Array.from(allCanvas)) {
    const sn = canvas.dataset.sn || ''
    if (!sn) continue
    try {
      await QRCode.toCanvas(canvas, buildEquipmentQrUrl(baseUrl, sn), {
        width: 100,
        margin: 1,
        errorCorrectionLevel: 'H',
      })
    } catch (e) {
      console.error('生成失败 sn=', sn, e)
    }
  }
}

defineExpose({ open })
</script>

<style scoped>
.label-sheet {
  max-height: 60vh;
  overflow-y: auto;
  background: #f5f7fa;
  padding: 12px;
}
.label-page {
  background: #fff;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: 50mm;
  gap: 0;
  padding: 8mm;
  margin-bottom: 12px;
  page-break-after: always;
}
.label-cell {
  width: 70mm;
  height: 50mm;
  display: flex;
  align-items: center;
  border: 1px dashed #ddd;
  padding: 4mm;
  box-sizing: border-box;
}
.label-cell canvas {
  width: 28mm;
  height: 28mm;
  flex-shrink: 0;
}
.label-info {
  margin-left: 4mm;
  font-size: 11px;
  line-height: 1.4;
  overflow: hidden;
  flex: 1;
}
.label-name {
  font-weight: bold;
  color: #303133;
  word-break: break-all;
}
.label-sn {
  margin-top: 4px;
  color: #606266;
}

/* 打印优化：去掉边框 */
@media print {
  .label-cell { border: none; }
}
</style>
```

- [ ] **Step 6.2: Commit**

```bash
git add src/views/eam/deviceLedger/components/BatchLabelPrint.vue
git commit -m "feat(eam): 批量打印贴纸组件（A4 4×11 排版 + 多页分批）"
```

---

### Task 7: 桌面端 接入多选 + 批量打印

**Files:**
- Modify: `src/views/eam/deviceLedger/page.vue` (列表多选 + 顶部按钮 + 引入组件)

- [ ] **Step 7.1: 引入 BatchLabelPrint 组件**

在 import 区：

```typescript
import BatchLabelPrint from './components/BatchLabelPrint.vue'
```

- [ ] **Step 7.2: 在 el-table 加入多选列**

`page.vue` 中 `<el-table>` 起始标签后第一列前加：

```vue
<el-table-column type="selection" width="50" align="center" />
```

并给 `<el-table>` 加 ref 和事件：

```vue
<el-table
  ref="tableRef"
  v-loading="loading"
  :data="list"
  :stripe="true"
  :show-overflow-tooltip="true"
  @selection-change="handleSelectionChange"
>
```

- [ ] **Step 7.3: 在 ContentWrap 顶部加按钮**

在 `<!-- 列表 -->` 注释下、`<ContentWrap>` 内、`<el-table>` 上方加：

```vue
<div class="batch-bar">
  <el-button
    type="primary"
    :disabled="selectedRows.length === 0"
    @click="openBatchPrint"
  >
    <Icon icon="ep:printer" class="mr-5px" />
    批量打印贴纸（已选 {{ selectedRows.length }} 台）
  </el-button>
</div>
```

并加样式：

```scss
.batch-bar {
  margin-bottom: 12px;
}
```

- [ ] **Step 7.4: 增加 ref + 函数**

在 `script setup` 区：

```typescript
// ==================== 多选 + 批量打印 ====================
const tableRef = ref()
const selectedRows = ref<DeviceLedgerApi.DeviceLedgerVo[]>([])
const batchPrintRef = ref()

const handleSelectionChange = (rows: DeviceLedgerApi.DeviceLedgerVo[]) => {
  selectedRows.value = rows
}

const openBatchPrint = () => {
  if (selectedRows.value.length === 0) return
  batchPrintRef.value.open(
    selectedRows.value.map(r => ({
      equipmentSn: r.equipmentSn,
      equipmentName: r.equipmentName,
    }))
  )
}
```

- [ ] **Step 7.5: 挂载组件**

在 `<DeviceLedgerDetail ref="detailRef" />` 后：

```vue
<!-- 批量打印贴纸 -->
<BatchLabelPrint ref="batchPrintRef" />
```

- [ ] **Step 7.6: 端到端验证**

1. 进入 `/eam/deviceLedger`
2. 勾选 3-5 台设备
3. 点【批量打印贴纸】
4. 弹窗显示，确认每台设备都生成了二维码 + 名称编号
5. 点【打印】触发浏览器打印预览，确认 A4 排版

- [ ] **Step 7.7: Commit**

```bash
git add src/views/eam/deviceLedger/page.vue
git commit -m "feat(eam): 设备台账多选 + 批量打印贴纸入口"
```

---

### Task 8: 移动端通用组件

**Files:**
- Create: `src/views/mobile/components/MobileHeader.vue`
- Create: `src/views/mobile/components/WorkOrderCard.vue`
- Create: `src/views/mobile/equipment/components/StatusTag.vue`

- [ ] **Step 8.1: MobileHeader.vue**

```vue
<!-- src/views/mobile/components/MobileHeader.vue -->
<template>
  <div class="m-header">
    <div class="m-header-left" @click="onBack">
      <Icon v-if="showBack" icon="ep:arrow-left" :size="22" />
    </div>
    <div class="m-header-title">{{ title }}</div>
    <div class="m-header-right">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title: string
  showBack?: boolean
  backTo?: string
}
const props = withDefaults(defineProps<Props>(), {
  showBack: true,
  backTo: '',
})

const router = useRouter()
function onBack() {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>

<style scoped>
.m-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.m-header-left {
  width: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.m-header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m-header-right {
  width: 40px;
  text-align: right;
}
</style>
```

- [ ] **Step 8.2: WorkOrderCard.vue**

```vue
<!-- src/views/mobile/components/WorkOrderCard.vue -->
<template>
  <div class="wo-card" :class="`wo-card--${statusClass}`">
    <div class="wo-head">
      <span class="wo-code">{{ order.code }}</span>
      <span class="wo-status" :class="`wo-status--${statusClass}`">
        {{ order.statusText }}
      </span>
    </div>
    <div class="wo-body">
      <div class="wo-line">
        <span class="wo-label">设备：</span>
        <span>{{ order.equipmentName }} ({{ order.equipmentSn }})</span>
      </div>
      <div v-if="order.personName" class="wo-line">
        <span class="wo-label">负责人：</span>
        <span>{{ order.personName }}</span>
      </div>
      <div v-if="order.workStartTime" class="wo-line">
        <span class="wo-label">开始时间：</span>
        <span>{{ order.workStartTime }}</span>
      </div>
      <div v-if="order.remark" class="wo-line">
        <span class="wo-label">备注：</span>
        <span>{{ order.remark }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { MobileWorkOrderVo } from '@/api/mobile/workorder'

const props = defineProps<{ order: MobileWorkOrderVo }>()

const statusClass = computed(() => {
  switch (props.order.status) {
    case 'PENDING': return 'pending'
    case 'IN_PROGRESS': return 'progress'
    case 'COMPLETED': return 'done'
    default: return 'default'
  }
})
</script>

<style scoped>
.wo-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px 14px;
  margin-bottom: 10px;
  border-left: 4px solid #909399;
}
.wo-card--pending { border-left-color: #E6A23C; }
.wo-card--progress { border-left-color: #409EFF; }
.wo-card--done { border-left-color: #67C23A; }
.wo-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.wo-code {
  font-weight: bold;
  font-size: 14px;
  color: #303133;
}
.wo-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  background: #f4f4f5;
  color: #606266;
}
.wo-status--pending { background: #fdf6ec; color: #E6A23C; }
.wo-status--progress { background: #ecf5ff; color: #409EFF; }
.wo-status--done { background: #f0f9eb; color: #67C23A; }
.wo-body { font-size: 13px; color: #606266; }
.wo-line { line-height: 1.7; }
.wo-label { color: #909399; }
</style>
```

- [ ] **Step 8.3: StatusTag.vue**

```vue
<!-- src/views/mobile/equipment/components/StatusTag.vue -->
<template>
  <span class="status-tag" :class="`status-tag--${statusClass}`">
    {{ statusText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ status: string }>()

const STATUS_MAP: Record<string, { text: string; cls: string }> = {
  RUN: { text: '运行中', cls: 'run' },
  STANDBY: { text: '待机', cls: 'standby' },
  CLOSE: { text: '停机', cls: 'close' },
  FAILURE: { text: '故障', cls: 'fault' },
}

const statusText = computed(() => STATUS_MAP[props.status]?.text || '未知')
const statusClass = computed(() => STATUS_MAP[props.status]?.cls || 'default')
</script>

<style scoped>
.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
.status-tag--run { background: #f0f9eb; color: #67C23A; }
.status-tag--standby { background: #fdf6ec; color: #E6A23C; }
.status-tag--close { background: #f4f4f5; color: #909399; }
.status-tag--fault { background: #fef0f0; color: #F56C6C; }
.status-tag--default { background: #f4f4f5; color: #909399; }
</style>
```

- [ ] **Step 8.4: Commit**

```bash
git add src/views/mobile/components/ src/views/mobile/equipment/components/
git commit -m "feat(mobile): 移动端通用组件 Header/WorkOrderCard/StatusTag"
```

---

### Task 9: 移动端 设备扫码落地页

**Files:**
- Create: `src/views/mobile/equipment/landing.vue`
- Test: `src/lib/__tests__/device-status-check.test.ts`

- [ ] **Step 9.1: 写设备状态判定测试**

```typescript
// src/lib/__tests__/device-status-check.test.ts
import { isDeviceAbolished, getOperationStatusBadge } from '@/views/mobile/equipment/landing-utils'

describe('isDeviceAbolished', () => {
  it('equipmentStatus=ABOLISHED 视为停用', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'ABOLISHED', operationStatus: 'RUN' })).toBe(true)
  })
  it('USING + CLOSE 不算停用（暂停而非作废）', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'USING', operationStatus: 'CLOSE' })).toBe(false)
  })
  it('USING + RUN 正常', () => {
    expect(isDeviceAbolished({ equipmentStatus: 'USING', operationStatus: 'RUN' })).toBe(false)
  })
  it('null 数据视为不存在，但不抛错', () => {
    expect(isDeviceAbolished(null)).toBe(false)
  })
})
```

- [ ] **Step 9.2: 创建 landing-utils.ts**

```typescript
// src/views/mobile/equipment/landing-utils.ts
import type { DeviceLandingVo } from '@/api/mobile/equipment'

export function isDeviceAbolished(device: DeviceLandingVo | null): boolean {
  if (!device) return false
  return device.equipmentStatus === 'ABOLISHED'
}

export function getOperationStatusBadge(status: string): string {
  const map: Record<string, string> = {
    RUN: '🟢',
    STANDBY: '🟡',
    CLOSE: '⚫',
    FAILURE: '🔴',
  }
  return map[status] || '⚪'
}
```

- [ ] **Step 9.3: 跑测试**

```bash
npx jest src/lib/__tests__/device-status-check.test.ts
```
Expected: PASS (4 用例)

- [ ] **Step 9.4: 创建 landing.vue**

```vue
<!-- src/views/mobile/equipment/landing.vue -->
<template>
  <div class="m-landing">
    <MobileHeader :show-back="false" title="设备扫码" />

    <div class="m-body">
      <div v-if="loading" class="m-loading">加载中...</div>

      <div v-else-if="error" class="m-empty">
        <Icon icon="ep:warning-filled" :size="64" color="#E6A23C" />
        <div class="m-empty-text">{{ error }}</div>
        <el-button @click="load">重试</el-button>
      </div>

      <div v-else-if="abolished" class="m-empty">
        <Icon icon="ep:circle-close-filled" :size="64" color="#F56C6C" />
        <div class="m-empty-text">⚠ 该设备已停用</div>
        <div class="m-empty-sub">设备编号：{{ device?.equipmentSn }}</div>
        <div class="m-empty-sub">如需查询历史信息，请联系管理员</div>
      </div>

      <template v-else-if="device">
        <!-- 设备信息卡 -->
        <div class="m-info-card">
          <div class="m-info-name">
            {{ device.equipmentName }}
            <StatusTag :status="device.operationStatus" />
          </div>
          <div class="m-info-line">编号：{{ device.equipmentSn }}</div>
          <div class="m-info-line">类型：{{ device.equipmentTypeDesc }}</div>
          <div class="m-info-line">车间：{{ device.workshopName }}</div>
          <div v-if="device.equipmentSupplierName" class="m-info-line">
            供应商：{{ device.equipmentSupplierName }}
          </div>
        </div>

        <!-- 工单菜单 -->
        <div class="m-menu">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="m-menu-item"
            @click="onMenuClick(item)"
          >
            <Icon :icon="item.icon" :size="28" :color="item.color" />
            <div class="m-menu-text">{{ item.title }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDeviceBySn, type DeviceLandingVo } from '@/api/mobile/equipment'
import { isMobileTokenValid } from '../utils/mobile-token'
import { buildLoginRedirect } from '../utils/mobile-route-guard'
import { isDeviceAbolished } from './landing-utils'
import MobileHeader from '../components/MobileHeader.vue'
import StatusTag from './components/StatusTag.vue'

defineOptions({ name: 'MobileEquipmentLanding' })

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const device = ref<DeviceLandingVo | null>(null)

const abolished = computed(() => isDeviceAbolished(device.value))

const menuItems = [
  { title: '保养工单', icon: 'ep:tools', color: '#E6A23C', path: '/m/maintenance/list', requireAuth: true },
  { title: '点巡检工单', icon: 'ep:document', color: '#409EFF', path: '/m/spotInspection/list', requireAuth: true },
  { title: '维修工单', icon: 'ep:setting', color: '#F56C6C', path: '/m/repairOrder/list', requireAuth: true },
  { title: '设备档案查看', icon: 'ep:files', color: '#67C23A', path: '/m/equipment/detail', requireAuth: false },
  { title: '历史工单查询', icon: 'ep:notebook', color: '#909399', path: '/m/workorder/history', requireAuth: true },
]

async function load() {
  const sn = route.params.sn as string
  if (!sn) {
    error.value = '设备编号不能为空'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const res = await getDeviceBySn(sn)
    if (!res) {
      error.value = '设备不存在或已删除'
      return
    }
    device.value = res
  } catch (e: any) {
    error.value = e?.msg || '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

function onMenuClick(item: typeof menuItems[number]) {
  if (!device.value) return
  const sn = device.value.equipmentSn
  const targetPath = `${item.path}?equipmentSn=${encodeURIComponent(sn)}`

  if (item.requireAuth && !isMobileTokenValid()) {
    router.push(buildLoginRedirect(targetPath))
    return
  }
  if (item.path === '/m/equipment/detail') {
    router.push(`/m/equipment/detail?sn=${encodeURIComponent(sn)}`)
    return
  }
  router.push(targetPath)
}

onMounted(load)
</script>

<style scoped>
.m-landing {
  min-height: 100vh;
  background: #f5f7fa;
}
.m-body {
  padding: 12px;
}
.m-loading {
  text-align: center;
  padding: 60px 0;
  color: #909399;
  font-size: 14px;
}
.m-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 20px;
  text-align: center;
}
.m-empty-text {
  margin-top: 16px;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.m-empty-sub {
  margin-top: 6px;
  font-size: 13px;
  color: #909399;
}
.m-info-card {
  background: #fff;
  border-radius: 8px;
  padding: 14px;
  margin-bottom: 14px;
}
.m-info-name {
  font-size: 17px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.m-info-line {
  font-size: 13px;
  color: #606266;
  line-height: 1.9;
}
.m-menu {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.m-menu-item {
  background: #fff;
  border-radius: 8px;
  padding: 18px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s;
}
.m-menu-item:active {
  transform: scale(0.96);
}
.m-menu-text {
  font-size: 14px;
  color: #303133;
}
</style>
```

- [ ] **Step 9.5: Commit**

```bash
git add src/views/mobile/equipment/landing.vue \
        src/views/mobile/equipment/landing-utils.ts \
        src/lib/__tests__/device-status-check.test.ts
git commit -m "feat(mobile): 设备扫码落地页（含状态判定 + 5 工单菜单）"
```

---

### Task 10: 移动端 设备档案查看 + 登录页

**Files:**
- Create: `src/views/mobile/equipment/detail.vue`
- Create: `src/views/mobile/login.vue`

- [ ] **Step 10.1: detail.vue（设备档案）**

```vue
<!-- src/views/mobile/equipment/detail.vue -->
<template>
  <div class="m-detail">
    <MobileHeader title="设备档案" :back-to="`/m/equipment/${sn}`" />
    <div class="m-body">
      <div v-if="loading" class="m-loading">加载中...</div>
      <div v-else-if="!device" class="m-empty">
        <div class="m-empty-text">设备信息加载失败</div>
      </div>
      <div v-else class="m-card">
        <div class="m-row"><span class="m-label">设备编号</span><span>{{ device.equipmentSn }}</span></div>
        <div class="m-row"><span class="m-label">设备名称</span><span>{{ device.equipmentName }}</span></div>
        <div class="m-row"><span class="m-label">设备类型</span><span>{{ device.equipmentTypeDesc }}</span></div>
        <div class="m-row"><span class="m-label">所属车间</span><span>{{ device.workshopName }}</span></div>
        <div class="m-row"><span class="m-label">运行状态</span><StatusTag :status="device.operationStatus" /></div>
        <div class="m-row"><span class="m-label">资产状态</span><span>{{ device.equipmentStatus === 'USING' ? '使用中' : '已停用' }}</span></div>
        <div v-if="device.equipmentMode" class="m-row"><span class="m-label">设备型号</span><span>{{ device.equipmentMode }}</span></div>
        <div v-if="device.equipmentSupplierName" class="m-row"><span class="m-label">供应商</span><span>{{ device.equipmentSupplierName }}</span></div>
        <div v-if="device.equipmentOperating" class="m-row"><span class="m-label">投运时间</span><span>{{ device.equipmentOperating }}</span></div>
        <div v-if="device.equipmentPurchase" class="m-row"><span class="m-label">购置时间</span><span>{{ device.equipmentPurchase }}</span></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getDeviceBySn, type DeviceLandingVo } from '@/api/mobile/equipment'
import MobileHeader from '../components/MobileHeader.vue'
import StatusTag from './components/StatusTag.vue'

defineOptions({ name: 'MobileEquipmentDetail' })

const route = useRoute()
const loading = ref(false)
const device = ref<DeviceLandingVo | null>(null)
const sn = route.query.sn as string

async function load() {
  if (!sn) return
  loading.value = true
  try {
    device.value = await getDeviceBySn(sn)
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.m-detail { min-height: 100vh; background: #f5f7fa; }
.m-body { padding: 12px; }
.m-card { background: #fff; border-radius: 8px; padding: 8px 14px; }
.m-row {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
  font-size: 14px;
}
.m-row:last-child { border-bottom: none; }
.m-label { width: 90px; color: #909399; flex-shrink: 0; }
.m-loading, .m-empty { text-align: center; padding: 60px 0; color: #909399; }
</style>
```

- [ ] **Step 10.2: login.vue（移动端登录）**

```vue
<!-- src/views/mobile/login.vue -->
<template>
  <div class="m-login">
    <MobileHeader title="登录" :show-back="false" />
    <div class="m-login-body">
      <div class="m-login-title">PDA 移动端登录</div>
      <div class="m-login-sub">请使用您的桌面端账号登录</div>

      <div class="m-form">
        <el-input
          v-model="form.username"
          placeholder="用户名"
          size="large"
          class="m-input"
        />
        <el-input
          v-model="form.password"
          type="password"
          placeholder="密码"
          size="large"
          class="m-input"
          show-password
          @keyup.enter="onSubmit"
        />
        <el-button
          type="primary"
          size="large"
          class="m-btn"
          :loading="submitting"
          @click="onSubmit"
        >
          登 录
        </el-button>
      </div>

      <div class="m-tip">
        💡 演示提示：任意账号 + 任意密码（非空）即可登录
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { mobileLogin } from '@/api/mobile/auth'
import { setMobileToken } from './utils/mobile-token'
import MobileHeader from './components/MobileHeader.vue'

defineOptions({ name: 'MobileLogin' })

const route = useRoute()
const router = useRouter()

const form = reactive({ username: '', password: '' })
const submitting = ref(false)

async function onSubmit() {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  submitting.value = true
  try {
    const res = await mobileLogin(form)
    setMobileToken(res.token)
    ElMessage.success(`欢迎，${res.nickname}`)
    const redirect = route.query.redirect as string
    if (redirect) {
      try {
        router.replace(decodeURIComponent(redirect))
      } catch {
        router.replace('/m/equipment/EQ20240001')
      }
    } else {
      router.replace('/m/equipment/EQ20240001')
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || '登录失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.m-login { min-height: 100vh; background: #fff; }
.m-login-body { padding: 30px 20px; }
.m-login-title {
  font-size: 22px;
  font-weight: bold;
  color: #303133;
  text-align: center;
  margin-top: 20px;
}
.m-login-sub {
  font-size: 13px;
  color: #909399;
  text-align: center;
  margin-top: 8px;
  margin-bottom: 30px;
}
.m-form { display: flex; flex-direction: column; gap: 14px; }
.m-input { :deep(.el-input__wrapper) { border-radius: 8px; } }
.m-btn { margin-top: 8px; height: 48px; border-radius: 8px; }
.m-tip {
  margin-top: 20px;
  padding: 10px 14px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 12px;
  color: #909399;
}
</style>
```

- [ ] **Step 10.3: Commit**

```bash
git add src/views/mobile/equipment/detail.vue src/views/mobile/login.vue
git commit -m "feat(mobile): 设备档案查看页 + 移动端登录页"
```

---

### Task 11: 移动端 4 个工单列表页

**Files:**
- Create: `src/views/mobile/maintenance/list.vue`
- Create: `src/views/mobile/spotInspection/list.vue`
- Create: `src/views/mobile/repairOrder/list.vue`
- Create: `src/views/mobile/workorder/history.vue`

> 4 个页面结构高度相似（标题/API/路由不同），下面给出 1 个完整模板，其他 3 个仅列差异点。

- [ ] **Step 11.1: 保养工单列表 maintenance/list.vue**

```vue
<!-- src/views/mobile/maintenance/list.vue -->
<template>
  <div class="m-list">
    <MobileHeader :title="title" :back-to="backTo" />

    <div class="m-toolbar">
      <span class="m-toolbar-info">设备 {{ equipmentSn }}（{{ total }} 单）</span>
      <el-switch
        v-model="showAll"
        active-text="显示全部"
        inactive-text="仅未完成"
        @change="reload"
      />
    </div>

    <div class="m-body">
      <div v-if="loading && list.length === 0" class="m-loading">加载中...</div>

      <div v-else-if="list.length === 0" class="m-empty">
        <Icon icon="ep:document-remove" :size="64" color="#c0c4cc" />
        <div class="m-empty-text">该设备暂无保养工单</div>
        <el-button type="primary" @click="onCreate">+ 新建保养工单</el-button>
      </div>

      <template v-else>
        <WorkOrderCard
          v-for="o in list"
          :key="o.id"
          :order="o"
          @click="onOrderClick(o)"
        />
        <div v-if="!loading && list.length < total" class="m-loadmore" @click="loadMore">
          点击加载更多
        </div>
      </template>
    </div>

    <div class="m-fab">
      <el-button type="primary" round @click="onCreate">
        <Icon icon="ep:plus" />新建保养工单
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMaintenanceListBySn, type MobileWorkOrderVo } from '@/api/mobile/workorder'
import MobileHeader from '../components/MobileHeader.vue'
import WorkOrderCard from '../components/WorkOrderCard.vue'

defineOptions({ name: 'MobileMaintenanceList' })

const route = useRoute()
const title = '保养工单'
const equipmentSn = route.query.equipmentSn as string
const backTo = `/m/equipment/${equipmentSn}`

const list = ref<MobileWorkOrderVo[]>([])
const total = ref(0)
const loading = ref(false)
const showAll = ref(false)
const pageNo = ref(1)
const pageSize = 20

async function loadPage(reset = false) {
  if (reset) {
    pageNo.value = 1
    list.value = []
  }
  loading.value = true
  try {
    const res = await getMaintenanceListBySn({
      equipmentSn,
      showAll: showAll.value ? 1 : 0,
      pageNo: pageNo.value,
      pageSize,
    })
    const data: any = res
    list.value = pageNo.value === 1
      ? (data.records || [])
      : [...list.value, ...(data.records || [])]
    total.value = data.total || 0
  } catch (e: any) {
    ElMessage.error(e?.msg || '加载失败')
  } finally {
    loading.value = false
  }
}

const reload = () => loadPage(true)
const loadMore = () => { pageNo.value++; loadPage() }

function onOrderClick(o: MobileWorkOrderVo) {
  ElMessage.info(`点击工单 ${o.code}（demo: 详情页 v2 实现）`)
}

function onCreate() {
  ElMessage.info('新建保养工单（demo: v2 实现真实表单）')
}

onMounted(reload)
</script>

<style scoped>
.m-list { min-height: 100vh; background: #f5f7fa; padding-bottom: 80px; }
.m-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.m-toolbar-info { font-size: 13px; color: #606266; }
.m-body { padding: 12px; }
.m-loading, .m-empty {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}
.m-empty { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.m-empty-text { font-size: 14px; }
.m-loadmore {
  text-align: center;
  padding: 14px;
  color: #909399;
  font-size: 13px;
  cursor: pointer;
}
.m-fab {
  position: fixed;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
}
</style>
```

- [ ] **Step 11.2: 点巡检工单 spotInspection/list.vue**

```vue
<!-- src/views/mobile/spotInspection/list.vue -->
<!-- 与 maintenance/list.vue 完全相同，只改：
     1. defineOptions name -> 'MobileSpotInspectionList'
     2. import getMaintenanceListBySn -> getSpotInspectionListBySn
     3. const title = '保养工单' -> '点巡检工单'
     4. ElMessage.info 文案 -> '点巡检工单'
     5. 调用 getSpotInspectionListBySn 替换
-->
<template>
  <!-- (同 maintenance/list.vue 模板) -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getSpotInspectionListBySn, type MobileWorkOrderVo } from '@/api/mobile/workorder'
import MobileHeader from '../components/MobileHeader.vue'
import WorkOrderCard from '../components/WorkOrderCard.vue'

defineOptions({ name: 'MobileSpotInspectionList' })

const route = useRoute()
const title = '点巡检工单'
const equipmentSn = route.query.equipmentSn as string
const backTo = `/m/equipment/${equipmentSn}`

const list = ref<MobileWorkOrderVo[]>([])
const total = ref(0)
const loading = ref(false)
const showAll = ref(false)
const pageNo = ref(1)
const pageSize = 20

async function loadPage(reset = false) {
  if (reset) { pageNo.value = 1; list.value = [] }
  loading.value = true
  try {
    const res = await getSpotInspectionListBySn({
      equipmentSn, showAll: showAll.value ? 1 : 0,
      pageNo: pageNo.value, pageSize,
    })
    const data: any = res
    list.value = pageNo.value === 1 ? (data.records || []) : [...list.value, ...(data.records || [])]
    total.value = data.total || 0
  } catch (e: any) { ElMessage.error(e?.msg || '加载失败') }
  finally { loading.value = false }
}
const reload = () => loadPage(true)
const loadMore = () => { pageNo.value++; loadPage() }
function onOrderClick(o: MobileWorkOrderVo) { ElMessage.info(`点击工单 ${o.code}（demo: 详情页 v2 实现）`) }
function onCreate() { ElMessage.info('新建点巡检工单（demo: v2 实现真实表单）') }
onMounted(reload)
</script>

<style scoped>
/* 与 maintenance/list.vue 相同 */
</style>
```

> ⚠ 模板和 style 完整复制 maintenance/list.vue，仅修改：title、Icon empty-text、API、ElMessage 文案。

- [ ] **Step 11.3: 维修工单 repairOrder/list.vue**

> 同 maintenance，改三处：
> - `defineOptions({ name: 'MobileRepairOrderList' })`
> - `const title = '维修工单'`
> - `import { getRepairListBySn } ...`
> - 调用 `getRepairListBySn` 替换
> - 文案 `保养` → `维修`

- [ ] **Step 11.4: 综合历史 workorder/history.vue**

> 同上，改：
> - `defineOptions({ name: 'MobileWorkorderHistory' })`
> - `const title = '历史工单'`
> - `import { getHistoryListBySn } ...`
> - 调用 `getHistoryListBySn` 替换
> - 顶部多一行说明：`<div class="m-tip">展示该设备的所有类型工单</div>`
> - showAll 默认 true（历史本来就要看全部）
> - **不显示"+ 新建"按钮**（历史查询无新建动作）

- [ ] **Step 11.5: Commit**

```bash
git add src/views/mobile/maintenance/ \
        src/views/mobile/spotInspection/ \
        src/views/mobile/repairOrder/ \
        src/views/mobile/workorder/
git commit -m "feat(mobile): 4 个工单列表页（保养/点巡检/维修/综合历史）"
```

---

### Task 12: 路由 + 全局守卫

**Files:**
- Modify: `src/router/modules/remaining.ts`

- [ ] **Step 12.1: 在 remaining.ts 末尾路由组前加入 /m 路由**

找到 `/h5/eam` 路由定义所在的位置，紧跟其后追加：

```typescript
// === 移动 H5 路由组（PDA 扫码场景） ===
{
  path: '/m',
  redirect: '/m/login',
  meta: { hidden: true, noTagsView: true },
},
{
  path: '/m/login',
  component: () => import('@/views/mobile/login.vue'),
  name: 'MobileLogin',
  meta: { hidden: true, noTagsView: true, public: true },
},
{
  path: '/m/equipment/:sn',
  component: () => import('@/views/mobile/equipment/landing.vue'),
  name: 'MobileEquipmentLanding',
  meta: { hidden: true, noTagsView: true, public: true },
},
{
  path: '/m/equipment/detail',
  component: () => import('@/views/mobile/equipment/detail.vue'),
  name: 'MobileEquipmentDetail',
  meta: { hidden: true, noTagsView: true, public: true },
},
{
  path: '/m/maintenance/list',
  component: () => import('@/views/mobile/maintenance/list.vue'),
  name: 'MobileMaintenanceList',
  meta: { hidden: true, noTagsView: true },
},
{
  path: '/m/spotInspection/list',
  component: () => import('@/views/mobile/spotInspection/list.vue'),
  name: 'MobileSpotInspectionList',
  meta: { hidden: true, noTagsView: true },
},
{
  path: '/m/repairOrder/list',
  component: () => import('@/views/mobile/repairOrder/list.vue'),
  name: 'MobileRepairOrderList',
  meta: { hidden: true, noTagsView: true },
},
{
  path: '/m/workorder/history',
  component: () => import('@/views/mobile/workorder/history.vue'),
  name: 'MobileWorkorderHistory',
  meta: { hidden: true, noTagsView: true },
},
```

> ⚠ 路由顺序敏感：`/m/equipment/detail` 必须在 `/m/equipment/:sn` 之前，否则 `:sn` 会吃掉 `detail` 这个静态片段。修正：把 `detail` 提前。

修正后顺序：

```typescript
{ path: '/m/equipment/detail', ... },
{ path: '/m/equipment/:sn', ... },
```

- [ ] **Step 12.2: 添加路由守卫（src/permission.ts）**

打开 `src/permission.ts`，找到现有的 `router.beforeEach` 钩子或在最后追加：

```typescript
// === 移动 H5 路由守卫 ===
import { isPublicMobileRoute, buildLoginRedirect } from '@/views/mobile/utils/mobile-route-guard'
import { isMobileTokenValid } from '@/views/mobile/utils/mobile-token'

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/m/')) {
    if (isPublicMobileRoute(to.path)) {
      return next()
    }
    if (!isMobileTokenValid()) {
      return next(buildLoginRedirect(to.fullPath))
    }
    return next()
  }
  next()
})
```

> ⚠ 注意：项目已有 `permission.ts` 中其他守卫逻辑，必须放在主守卫**之前**或额外加一个 `beforeEach`，避免被桌面端 token 守卫拦截。

- [ ] **Step 12.3: 启动 dev 端到端验证**

```bash
npm run dev
```

测试流程：
1. 浏览器直接访问 `http://localhost:xxxx/m/equipment/EQ20240001`
   - Expected: 显示设备 "立式加工中心" 落地页 + 5 按钮
2. 访问 `http://localhost:xxxx/m/equipment/EQ20230099`
   - Expected: 显示 "⚠ 该设备已停用" 红色警告页
3. 访问 `http://localhost:xxxx/m/equipment/NOT_EXISTS`
   - Expected: 显示 "设备不存在或已删除" 空态
4. 落地页点【设备档案查看】
   - Expected: 直接跳 `/m/equipment/detail?sn=EQ20240001`，无需登录
5. 落地页点【保养工单】
   - Expected: 因未登录跳 `/m/login?redirect=...`
6. 在登录页输入任意账号密码 → 跳回原工单列表，看到 mock 工单数据
7. 退出浏览器再进入工单列表
   - Expected: 7 天内不需重登（localStorage 持久）

- [ ] **Step 12.4: Commit**

```bash
git add src/router/modules/remaining.ts src/permission.ts
git commit -m "feat(mobile): /m/* 路由组 + 全局认证守卫"
```

---

### Task 13: PRD 文档 + 端到端集成验证

**Files:**
- Create: `docs/PRD.md`（如不存在）
- Modify: `docs/PRD.md` 加入 F0XX/F0YY

- [ ] **Step 13.1: 创建/更新 PRD**

如果 `docs/PRD.md` 不存在，创建：

```markdown
# IIMAKE EAM 控制台 - 产品需求文档（PRD）

> 唯一权威需求来源 | 状态: 🔴 待开发 / 🟡 开发中 / 🟢 已完成 / ⚫ 已废弃

## 功能总览

| 编号 | 功能 | 状态 | 关联设计稿 | 备注 |
|---|---|---|---|---|
| F001 | 设备二维码生成（桌面端） | 🟢 已完成 | [设计稿](./specs/2026-04-29-equipment-qrcode-design.md) | 弹窗 + 下载 PNG + 打印贴纸 + 批量打印 |
| F002 | PDA 扫码 H5 落地页 | 🟢 已完成 | [设计稿](./specs/2026-04-29-equipment-qrcode-design.md) | /m/* 5 个工单入口 + 7 天 token |
| F003 | CNC 实时监控墙 | 🔴 待开发 | [设计稿](./specs/2026-04-29-cnc-monitor-wall-design.md) | v1.1 推进 |

## 变更历史

- 2026-04-29: F001/F002 demo 完成（前端 + mock 闭环，无后端）
```

如已存在 `docs/PRD.md`，仅追加 F001/F002/F003 行。

- [ ] **Step 13.2: 跑全部新增单元测试**

```bash
npx jest src/lib/__tests__/qrcode-url-builder.test.ts \
         src/lib/__tests__/batch-label-layout.test.ts \
         src/lib/__tests__/mobile-route-guard.test.ts \
         src/lib/__tests__/device-status-check.test.ts \
         --no-coverage
```
Expected: PASS（18 个用例全过）

- [ ] **Step 13.3: 端到端流程演示验证**

```bash
npm run dev
```

完整演示路径：
1. 进入 `/eam/deviceLedger`
2. 任意设备点【生成二维码】 → 弹窗显示二维码 + 设备名 + 编号
3. 用手机扫码 / 浏览器复制 URL 访问 → 跳到 `/m/equipment/EQ20240001`
4. 落地页：看设备名/编号/状态 + 5 按钮
5. 点【设备档案查看】免登录直接看
6. 点【保养工单】跳登录页
7. 任意账号密码登录成功 → 看到该设备的保养工单列表（mock 数据）
8. 切换"显示全部"开关 → 看到已完成的工单
9. 列表空设备的"+ 新建"按钮显示
10. 返回扫码 EQ20230099 → 看到"⚠ 该设备已停用"
11. 返回设备台账，多选 5 台设备 → 点【批量打印贴纸】 → 弹窗预览 → 打印对话框

- [ ] **Step 13.4: 最终 Commit**

```bash
git add docs/PRD.md
git commit -m "docs: PRD 登记 F001 设备二维码 + F002 移动 H5 落地页"
```

---

## Self-Review Checklist

完成所有 Tasks 后过一遍下面的清单：

### 1. Spec 覆盖

| Spec 章节 | 覆盖任务 |
|---|---|
| §3 整体架构 | Task 4-12（按文件结构对应） |
| §4 桌面端二维码弹窗 | Task 4 |
| §5 批量打印贴纸 | Task 6, Task 7 |
| §6 移动 H5 落地页 | Task 9 |
| §7 认证 + 路由守卫 | Task 1.8-1.11, Task 12 |
| §8 API 契约 | Task 2 |
| §9 错误处理 | Task 9（abolished 分支）+ Task 10（detail 加载失败）+ Task 11（empty/loadmore） |
| §10 测试策略 | Task 1, Task 9, Task 13.2 |

### 2. Placeholder 扫描

- [x] 无 "TBD/TODO/implement later" 占位
- [x] 所有"修改"都标了精确文件 + 行号或代码段位置
- [x] 4 个工单列表页虽相似，但 Task 11 已明确每个差异点（不是 "Similar to Task N" 抽象表述）

### 3. Type 一致性

- `DeviceLandingVo` 在 Task 2.1（定义）+ Task 9.4（使用）+ Task 10.1（使用）一致
- `MobileWorkOrderVo` 在 Task 2.2（定义）+ Task 8.2（card props）+ Task 11.x（list 状态）一致
- `MobileWorkOrderQuery` 字段 `showAll: 0|1` 在 Task 2.2/Task 11 调用一致
- `getMobileToken / setMobileToken / clearMobileToken / isMobileTokenValid` 在 Task 1.8 定义后 Task 9.4 / Task 10.2 / Task 12.2 全部正确引用

---

## 实施顺序与时间预估

| Task | 时间预估 | 关键依赖 |
|---|---|---|
| Task 1 工具 + 测试 | 30 min | 无 |
| Task 2 API 调用层 | 15 min | 无 |
| Task 3 Mock 数据 | 30 min | Task 2 |
| Task 4 二维码弹窗 | 25 min | Task 1 |
| Task 5 操作列接入 | 15 min | Task 4 |
| Task 6 批量打印组件 | 30 min | Task 1 |
| Task 7 多选接入 | 15 min | Task 6 |
| Task 8 移动通用组件 | 25 min | 无 |
| Task 9 落地页 | 30 min | Task 2/3/8 |
| Task 10 detail+login | 25 min | Task 8/9 |
| Task 11 4 个工单列表 | 30 min | Task 8/10 |
| Task 12 路由 + 守卫 | 25 min | Task 1/9-11 |
| Task 13 PRD + 验证 | 20 min | All |

**总计：约 5–6 小时**（一名熟悉 Vue 3 + Element Plus 的工程师）

---

## v2 不做项（写入 PRD 待办）

- ④ 巡检路线打卡（需新建打卡 API）
- ⑦ 设备状态上报（需新数据模型）
- 工单详情页（点击卡片只 toast 提示）
- 工单"新建"真实表单（按钮只 toast 提示）
- 真实后端 token 校验（demo 阶段任意账号通过）
