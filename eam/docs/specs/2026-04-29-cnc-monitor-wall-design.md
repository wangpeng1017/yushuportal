# CNC 实时监控墙 v1 设计稿

> 文档日期: 2026-04-29
> 模块归属: IoT/OEE
> 状态: ✅ 已批准 (王老师 2026-04-29)
> 关联功能: F0XX (待 PRD 注册)

---

## 一、需求背景

### 1.1 现状

`IoT/OEE` 菜单当前两个子页面：

- **设备运行监控** (`src/views/eam/deviceMonitor/page.vue`, 307 行) — 仅展示宏观汇总（运行小时、产量、告警字段），无 CNC 实时参数。
- **OEE 分析看板** (`src/views/eam/oeeAnalysis/page.vue`, 260 行) — 离线汇总指标，无法下钻到设备明细。

### 1.2 IoT 可采集的 15 项 CNC 原生数据

| 序号 | 数据项 | 建议归属 |
|---|---|---|
| 1 | 主轴实际转速 | CNC 原生（优先） |
| 2 | 实际进给速度 | CNC 原生（优先） |
| 3 | 进给倍率 | CNC 原生（优先） |
| 4 | 机床运行状态 | CNC 原生（优先） |
| 5 | 自动/手动/MDI 模式 | CNC 原生（优先） |
| 6 | 当前程序号/程序名 | CNC 原生（优先） |
| 7 | 系统报警代码 | CNC 原生（优先） |
| 8 | 系统报警文本 | CNC 原生（优先） |
| 9 | 主轴负载 | CNC 原生（优先） |
| 10 | 主轴电流 | CNC 原生（优先） |
| 11 | 主轴扭矩 | CNC 原生（优先） |
| 12 | 轴当前位置（X/Y/Z） | CNC 原生（优先） |
| 13 | 加工累计时间 | CNC 原生（优先） |
| 14 | 当前刀具号 | CNC 原生（优先） |
| 15 | 轴/伺服负载 | CNC 原生（优先） |

### 1.3 关键缺口

现有页面**完全没承接**这 15 项数据。这些数据**仅对数控机加车间（CNC）有意义**，C 端车间设备（PACK 线/流水线/涂覆机）无主轴/刀具/坐标。

### 1.4 v1 / v2 数据项分配概览

| 阶段 | 原始数据项 | 卡片/页面区块数 | 说明 |
|---|---|---|---|
| v1 监控墙 | 9 项（1,2,4,5,6,7,8,9,14）| 8 个区块 | "程序号+程序名" 合并 1 区块、"报警代码+文本" 合并 1 区块 |
| v2 详情页 | 6 项（3,10,11,12,13,15）| — | 包含进给倍率、电流、扭矩、X/Y/Z 坐标、累计时间、伺服负载 |

---

## 二、决策记录

| 决策项 | 选择 | 理由 |
|---|---|---|
| 主攻方向 | **B：CNC 车间监控墙（多设备并行大屏）** | 提供"鸟瞰入口"，再下钻详情；车间需要全局态势墙 |
| 详情页（方向 A） | v2 再做 | v1 先打通宏观视图 |
| 卡片密度 | **标准型 320×200**，每屏 15 台 | 一屏 8 项关键字段 + 视觉舒适 |
| CNC 机床数量 | **28 台** | 28÷15 → 必须分页+轮播 |
| 数据刷新 | **10s 轮询** | WebSocket 暂不引入，简化后端 |
| 报警声光提示 | **不做** | 维持视觉静默，仅红框+闪烁横幅 |
| 卡片字段 | 见下表（5 必上 + 3 选上） | — |

---

## 三、卡片字段清单（v1 = 8 项）

### 🔴 必上（5 项）

| 字段 | 卡片展示形式 |
|---|---|
| 机床运行状态 (`runStatus`) | 顶部状态灯：🟢运行 / 🟡待机 / ⚫停机 / 🔴故障 + 文字 |
| 系统报警代码+文本 (`alarmCode/alarmText`) | 红色横幅闪烁，仅有报警时显示 |
| 当前程序号/程序名 (`programNo/programName`) | 卡片中段大字 |
| 主轴实际转速 (`spindleSpeed`) | 数字 + 单位 (rpm) |
| 主轴负载 (`spindleLoad`) | 进度条 0–100%（>85% 标红） |

### 🟡 选上（3 项）

| 字段 | 卡片展示 |
|---|---|
| 实际进给速度 (`feedSpeed`) | 小字数字 + 单位 (mm/min) |
| 自动/手动/MDI 模式 (`runMode`) | 小标签 (AUTO / MAN / MDI) |
| 当前刀具号 (`toolNo`) | 小标签 (T05) |

### ⚫ 留给详情页 v2（6 项，接口预留不展示）

`spindleCurrent`（主轴电流）/ `spindleTorque`（主轴扭矩）/ `axisX/Y/Z`（轴当前位置）/ `feedRate`（进给倍率）/ `processTime`（加工累计时间）/ `axisLoad`（轴/伺服负载）

---

## 四、架构与代码位置

### 4.1 文件结构

```
src/views/eam/cncMonitorWall/      # 🆕 新增
├─ page.vue                         监控墙主页
└─ components/
   └─ MonitorCard.vue               单张机床卡片 (320×200)

src/api/eam/iotOee/index.ts        # 扩展
└─ getCncMonitorList()             GET /iot/cncMonitorWall/list

mock/auth.ts                       # 修改：新增菜单项
mock/eam-iot-oee.ts                # 修改：新增 28 台 CNC 数据 + mock 接口
src/router/modules/remaining.ts    # 修改：新增路由 /eam/iot/cncMonitorWall

docs/PRD.md                        # 修改：登记 F0XX
src/lib/__tests__/                 # 🆕 单元测试
```

### 4.2 菜单注册 (`mock/auth.ts`)

```ts
{
  path: '/eam/iot',
  children: [
    { path: 'deviceMonitor',   ... },
    { path: 'cncMonitorWall',  name: 'CNC 实时监控墙',
      icon: 'ep:data-board',
      component: 'eam/cncMonitorWall/page',
      componentName: 'EamCncMonitorWall',
      visible: true, keepAlive: true, parentId: 70 },
    { path: 'oeeAnalysis',     ... }
  ]
}
```

### 4.3 API 接口契约

```ts
// src/api/eam/iotOee/index.ts (扩展)
export interface CncMonitorVo {
  id: string
  equipmentSn: string
  equipmentName: string
  workshopCode: string         // 仅 'CNC'
  collectTime: string

  runStatus: 'running' | 'standby' | 'stopped' | 'fault'
  alarmCode?: string
  alarmText?: string
  programNo?: string
  programName?: string
  spindleSpeed?: number        // rpm
  spindleLoad?: number         // 0–100
  feedSpeed?: number           // mm/min
  runMode?: 'AUTO' | 'MAN' | 'MDI'
  toolNo?: string
}

export const getCncMonitorList = (params: any) =>
  request.get({ url: '/iot/cncMonitorWall/list', params })
```

---

## 五、卡片视觉规格（标准型 320×200）

```
┌─────────────────────────────────────┐
│ 🟢 运行中  CNC-01  立式加工中心     │  ← 顶部状态条
├─────────────────────────────────────┤
│  程序: O0023 / 后桥支架_粗加工.NC  │  ← 程序号大字
│  转速 2400 rpm   进给 1200 mm/min  │
│  主轴负载 ████████░░ 78%           │
│  AUTO  T05                         │  ← 模式 + 刀号
└─────────────────────────────────────┘

报警态：
┌─────────────────────────────────────┐
│ 🔴 故障    CNC-03  XX加工中心       │
│ ⚠ ALM-1014 主轴过载                 │  ← 报警横幅闪烁（红底白字）
│  程序: O0045 / ...                  │
│  ...                                │
└─────────────────────────────────────┘
```

### 状态色映射

| runStatus | 主色 | 边框/背景 | 状态灯 |
|---|---|---|---|
| running | `#67C23A` | 浅绿 | 🟢 |
| standby | `#E6A23C` | 浅黄 | 🟡 |
| stopped | `#909399` | 浅灰 | ⚫ |
| fault | `#F56C6C` | 浅红 + 闪烁 | 🔴 |

### 主轴负载色阶

- ≤ 70% → 绿
- 70–85% → 黄
- > 85% → 红

---

## 六、刷新与交互

| 行为 | 实现 |
|---|---|
| 数据刷新 | `setInterval` 每 10s 拉一次（onMounted 起，onBeforeUnmount 停） |
| 自动轮播 | 28 台分 2 页（首页 15 + 第二页 13），每页停 30s 自动切下页 |
| 轮播暂停 | 用户手动翻页时暂停 60s 后自动恢复；右上角【⏸暂停】按钮 |
| 数据中断 | 连续 3 次拉取失败 → 顶部黄色提示条"数据采集中断"；恢复后消失 |
| 首次加载 | 显示 loading 遮罩；自动刷新静默不闪屏 |
| 全屏模式 | 右上角【🔳 全屏】按钮，进入后隐藏 layout 顶栏 + 侧边菜单；ESC 退出 |
| 报警提示 | 红卡片 + 报警横幅 CSS 闪烁，**不做声光弹窗** |

---

## 七、错误处理

- 接口失败 → 顶部黄色提示条（不打断用户视线）
- 字段缺失 → 所有可选字段 `??` 兜底，不渲染对应区块
- 状态值非预期 → fallback 到"未知"灰色状态灯
- 长程序名 → CSS `text-overflow: ellipsis` 单行省略

---

## 八、测试策略

### 8.1 PRD 更新

- 在 `docs/PRD.md` 新增 `F0XX CNC 实时监控墙`，状态 🟡 → 🟢

### 8.2 单元测试（Jest，纯逻辑）

| 测试文件 | 覆盖逻辑 |
|---|---|
| `cnc-monitor-status-mapping.test.ts` | `runStatus → 颜色/文字` 映射函数 |
| `cnc-monitor-pagination.test.ts` | 28 台分页计算 + 自动轮播下一页索引 |
| `cnc-monitor-alarm.test.ts` | 报警横幅显示判定（alarmCode 非空即显示） |
| `cnc-monitor-load-color.test.ts` | 主轴负载色阶（70/85 阈值） |

### 8.3 Mock 数据

`mock/eam-iot-oee.ts` 新增 28 台 CNC 设备，覆盖：

- 4 种状态（running/standby/stopped/fault）至少各 2 台
- 有/无 alarmCode 各覆盖
- 不同 runMode (AUTO/MAN/MDI)
- 主轴负载分别覆盖 ≤70 / 70–85 / >85 三档

---

## 九、v2 预留（不做但接口预留）

- 卡片**点击下钻**到详情页（方向 A）：留 `@click` emit
- 详情页字段：6 项预留字段已在 API DTO 设计中标注

---

## 十、Auto Mode 合理假设

1. ✅ 28 台分 2 页 + 自动轮播 30s
2. ✅ 大屏全屏模式按钮
3. ✅ 数据中断时静默警示（黄条 vs 弹窗）
4. ✅ 自动刷新静默不闪屏
