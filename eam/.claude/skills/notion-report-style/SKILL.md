---
name: notion-report-style
description: EAM 系统全平台视觉规范 · Notion 风克制色彩。专门解决"色彩过鲜艳 / 文字下面有填充背景看不清 / 滥用红黄绿警示色"问题。新增页面或 ECharts/el-tag/el-button/KPI 卡时必读必应用。
---

# EAM 系统 · Notion 风视觉规范

> **一句话总则**：**克制色彩、保对比度、警示色仅用于真异常**。

---

## 🚫 反面教材（绝对不要写）

```vue
<!-- ❌ 鲜艳渐变 KPI 卡 -->
<div class="kpi" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white"></div>

<!-- ❌ effect="plain" 透明底浅文字（看不清） -->
<el-tag type="warning" effect="plain">低库存</el-tag>

<!-- ❌ 把"信息描述"用 type="primary/success" 包成 tag -->
<el-tag type="primary">生产需求</el-tag>

<!-- ❌ ECharts 用鲜艳橙色/纯红做"非异常"图表 -->
itemStyle: { color: '#f97316' }   // 橙色
itemStyle: { color: '#ef4444' }   // 鲜红
itemStyle: { color: '#16a34a' }   // 鲜绿

<!-- ❌ ElMessage 用项目自定义浅黄/浅红填充背景 -->
.el-message.el-message--warning { background-color: #fffbe6 }
```

---

## ✅ 正面规范

### 1. KPI 卡（白底 + 左侧 4px 色条）

```vue
<div class="kpi-card kpi-blue">
  <div class="kpi-label">在籍设备数</div>
  <div class="kpi-num">86</div>
  <div class="kpi-foot">台</div>
</div>

<style>
/* 共享 */
.kpi-card {
  padding: 18px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-left-width: 4px;
  box-shadow: 0 1px 3px rgba(0,21,41,0.04);
}
.kpi-card .kpi-label { font-size: 13px; color: #909399; }
.kpi-card .kpi-num   { font-size: 26px; font-weight: 600; color: #303133; line-height: 1.2; }
.kpi-card .kpi-foot  { font-size: 12px; color: #909399; margin-top: 4px; }

/* 左侧色条仅作语义标识，不污染主体 */
.kpi-blue   { border-left-color: #409eff; }   /* 主指标 */
.kpi-green  { border-left-color: #67c23a; }   /* 成功 / 健康 */
.kpi-red    { border-left-color: #f56c6c; }   /* 真异常（逾期 / 故障） */
.kpi-orange { border-left-color: #909399; }   /* 普通指标用灰，不要用橙 */
</style>
```

### 2. ECharts 配色规范（蓝色调梯度 + 警示红）

**单色调梯度**（饼图、堆叠柱）：

```js
color: ['#5b8def', '#82a6f0', '#a4bdf2', '#c5d4f5', '#94a3b8', '#cbd5e1']
//      主蓝     │ 浅蓝1   │ 浅蓝2   │ 浅蓝3   │ 灰1     │ 灰2
```

**单色实心**（柱图、折线主色）：

```js
itemStyle: { color: '#5b8def' }   // 标准蓝
lineStyle: { color: '#5b8def' }
```

**警示色**（仅当数据语义就是"故障 / 异常 / 逾期"时才用）：

```js
itemStyle: { color: '#f56c6c' }   // 故障设备 TOP10、逾期天数 OK
//                              ↑ 不要给"销售额"这种正常指标用红色
```

**禁用色**（鲜艳过头）：
- ❌ `#f97316` 橙
- ❌ `#ef4444` 纯红
- ❌ `#16a34a` 鲜绿
- ❌ `#9333ea` 紫
- ❌ `#dc2626` 深红

### 3. el-tag 使用规范

**判断该不该用 tag**：

| 内容性质 | 用 tag？ | 例 |
|---|---|---|
| **状态/进度** | ✅ 用 tag（克制色） | 进行中 / 已完成 / 已逾期 |
| **真异常警示** | ✅ 用 tag（warning/danger） | 断货 / 故障 / 逾期 |
| **信息描述/数据值** | ❌ **不要用 tag**，用纯文字 | 生产需求 / 工艺需求 / 设备类型 / 备件分类 |
| **类型标识（弱）** | ❌ **不要用 tag**，用纯文字 + 浅灰色 | 通用备件 / 消耗品 |

```vue
<!-- ✅ 信息性内容：纯文字 -->
<span style="color:#606266">{{ row.demandSource }}</span>

<!-- ✅ 状态：保留 tag，颜色克制 -->
<el-tag size="small" type="success">已完成</el-tag>
<el-tag size="small" type="info">进行中</el-tag>

<!-- ✅ 警示：tag + warning/danger（仅真异常） -->
<el-tag size="small" type="danger">断货</el-tag>
<el-tag size="small" type="warning">低库存</el-tag>
```

**永远不要用** `effect="plain"` —— 项目历史告诉我们 plain 文字对比度差，看不清。**用默认 light 即可**。

### 4. el-button type 使用规范

| type | 何时用 |
|---|---|
| **default**（无 type）| 大多数操作（查看 / 编辑 / 派工 / 取消 / 重置 / 搜索）⭐ **首选** |
| `primary` | 主要提交动作（确定 / 保存 / 提交） |
| `danger` | **真破坏性**操作（删除 / 异常转维修 / 打回） |
| `success` / `warning` | 极少用，慎用 |

```vue
<!-- ❌ -->
<el-button plain type="primary" @click="dispatch">派工</el-button>

<!-- ✅ -->
<el-button plain @click="dispatch">派工</el-button>
<el-button plain type="danger" @click="transferRepair">异常转维修</el-button>
```

### 5. ElMessage 弹窗

**全平台 CSS 已统一覆盖**（`src/styles/index.scss`），所有 ElMessage 都是白底+细灰边框+深字。

**写代码不用做特殊处理**，直接 `useMessage().success(...)` / `.warning(...)` 即可。

如果未来发现某处弹窗还有彩色填充，检查 `styles/index.scss` 里的 `.el-message` 选择器优先级，**必须用同等具体的 selector**（即 `.el-message.el-message--warning` 这种双类组合）才能覆盖项目主题样式。

### 6. 颜色规范速查表

```
═══════════════════════════════════
✅ 推荐使用                      用途
═══════════════════════════════════
#fff      / #ffffff              背景主色
#ebeef5                          细边框
#909399                          次要文字 / 标签
#606266                          常规文字
#303133                          标题 / 数字主体
#409eff                          主操作蓝（按钮 / 链接 / 边条）
#5b8def                          ECharts 主蓝
#82a6f0  #a4bdf2  #c5d4f5        ECharts 蓝色梯度
#94a3b8  #cbd5e1                 ECharts 中性灰
#67c23a                          成功 / 健康（克制使用）
#e6a23c                          warning（克制使用）
#f56c6c                          danger / 真异常（克制使用）

═══════════════════════════════════
❌ 禁止使用                       原因
═══════════════════════════════════
#f97316   #ea580c                 橙色太鲜艳
#ef4444   #dc2626                 纯红刺眼
#16a34a                           鲜绿
#9333ea                           紫色
#2563eb   #1d4ed8                 深饱和蓝（实色背景禁用）
linear-gradient(135deg, #...)     渐变实色背景禁用
```

---

## 🔍 新增页面前的自检清单

写完 .vue 文件后，**搜索这些关键字检查**：

```bash
# 在你新写的 .vue 里搜
grep -E "linear-gradient|effect=\"plain\"|color:\s*'#f97|'#ef4|'#16a3|'#9333|'#dc26|'#2563'" your-new-file.vue
```

**必须返回空才能提交**。

---

## 📚 历史教训

1. **2026-05-10 王老师反馈**：备件档案"低库存" tag 文字看不清 → 根因是 `effect="plain"`（透明底浅文字），改 light 即可。
2. **同日**：ElMessage 弹窗有黄色填充背景 → 项目主题文件用了 `.el-message.el-message--warning`（双类）覆盖了我的 `.el-message`（单类） → 必须**同等具体度选择器** + `!important` 才能覆盖。
3. **同日**：reportDashboard 4 张 KPI 卡渐变实色"霓虹灯"风 → 改 Notion 风（白底 + 左侧 4px 色条）。
4. **同日**：王老师明确："故障类的可以用红色，警示性颜色，其他不要用" → 凡是非异常指标（在籍设备数 / 综合 OEE / 本月工单数 / 采购金额）**一律不许用红橙紫**。
5. **同日**：王老师反馈"生产需求"被 el-tag 包成蓝色块 → 信息性字段（来源 / 类型 / 分类）**不要用 tag**，纯文字即可。

---

## ✅ 跑全平台扫描脚本

```bash
cd src

# 找渐变背景
grep -rln "linear-gradient(135deg" views/

# 找 plain tag
grep -rn 'effect="plain"' views/

# 找鲜艳 ECharts 色
grep -rn "color: '#f97\|'#ef44\|'#16a3\|'#9333\|'#dc26'" views/

# 找滥用 type=primary 的非主操作 tag/button
grep -rn 'el-tag.*type="primary"\|el-tag.*type="warning"' views/
```

每次大改后运行，结果应**接近空**。
