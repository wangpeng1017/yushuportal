# EAM 控制台 UI 改造设计稿

> 日期：2026-04-29
> 范围：iimake-eam-console-rebuild
> 状态：🟡 设计已确认 / 待写实施计划

---

## 1. 背景与目标

### 1.1 背景
当前 EAM 控制台共有 57 个列表页（`src/views/eam/*/page.vue`），UI 风格分散：
- 侧栏白底浅色，缺乏品牌辨识度
- 各列表页查询区栅格不统一，部分页用 `inline` 紧凑、部分用换行
- 行内操作列没有统一规范，"详情/编辑/删除/批量/状态变更"混在一起
- 业务批量按钮位置随意（有时在表格上方、有时在查询区底部、有时无）

### 1.2 目标
对齐**参考图风格**（紫色渐变侧栏 + 亮蓝主色 + 白卡圆角查询区 + 斑马表格 + 顶部右对齐业务按钮 + 行内三件套操作列），通过"主题层 + 通用组件"两层基建 + 5 个示范页迁移，建立全站统一规范。后续 52 页按规范分批迁移（不在本期）。

### 1.3 非目标
- 不升级 Element Plus（保持 2.11）
- 不重写业务逻辑（仅改造 UI 模板与样式）
- 不做主题切换开关（YAGNI，本期固定一种风格）
- 不在本期完成全部 57 页迁移（仅交付 5 页示范 + 规范文档）

---

## 2. 设计决策摘要

| 决策项 | 选择 | 理由 |
|---|---|---|
| 改造方式 | **B**（主题层 + 通用组件 + 渐进迁移） | 一次性重写风险大；纯换肤无法解决结构问题 |
| 配色 | **A**（完全照参考图）：紫色渐变侧栏 + 主色 `#1677FF` | 用户指定 |
| Logo 文字 | "**设备管理**" | 用户指定 |
| 操作列规则 | **A**（铁律：详情/编辑/删除 + 更多 ▾） | 用户指定 |
| 示范页 | **A**（5 页全选） | 覆盖最多场景 |
| 查询区栅格 | **C**（`:cols="4"` 默认，可覆盖；>8 字段自动展开/收起） | 兼顾参考图美观与字段多的业务页 |
| 列宽拖拽 | 保留 ResizableTable | 项目既有铁律 F020 |
| 业务按钮配色 | 提交=success(绿) / 审核=primary(蓝) / 驳回=warning(橙) / 删除=danger(红) / 新增=primary(蓝) | 语义对齐 EP 默认 |
| 表格行高 | 52px（表头 48px） | 比 EP 默认略高，兼顾密度与参考图美观 |
| 主题切换 | 不做 | YAGNI |

---

## 3. 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│ 紫色渐变侧栏          │   ToolHeader（面包屑 + 工具图标 + 头像）   │
│  Logo: 设备管理       ├─────────────────────────────────────┤
│  └ 首页              │  ┌─ QueryForm（白卡圆角 4 列栅格） ─────┐  │
│  └ 组织与仓库          │  │ 字段1  字段2  字段3  字段4         │  │
│  └ 知识库            │  │ ...        [搜索] [重置]           │  │
│  └ 工单管理          │  └────────────────────────────────────┘  │
│  └ 系统管理          │  ┌─ ListPage（白卡） ─────────────────┐  │
│  └ ...               │  │  [+新增] [批量提交] [批量审核] ▶︎     │  │
│                       │  │  ┌──────────────────────────────┐  │  │
│  （深色 #1F2240）    │  │  │ ResizableTable（斑马 / 多选）   │  │  │
│                       │  │  │  ...                          │  │  │
│                       │  │  │  操作: 详情 编辑 删除 [更多▾]   │  │  │
│                       │  │  └──────────────────────────────┘  │  │
│                       │  │                  Pagination →      │  │
│                       │  └────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**两层基建**：
1. **主题层**（CSS 变量 + 全局样式覆盖）：改 `var.css` + 新增 `styles/theme/_*.scss`，让所有页面无需改动 .vue 即可获得新配色与基础视觉
2. **组件层**（3 个通用组件 + 1 个子组件）：`<ListPage>`、`<QueryForm>` + `<QueryItem>`、`<RowActions>`

---

## 4. 视觉 Token

```css
/* src/styles/var.css 增补 */
:root {
  /* —— 主色（亮蓝，照参考图）—— */
  --el-color-primary: #1677FF;
  --el-color-primary-light-3: #4596FF;
  --el-color-primary-light-5: #7AB3FF;
  --el-color-primary-light-7: #B0D1FF;
  --el-color-primary-light-8: #CCDFFF;
  --el-color-primary-light-9: #EBF3FF;
  --el-color-primary-dark-2: #0958D9;

  /* —— 语义色（业务按钮）—— */
  --el-color-success: #16A34A;
  --el-color-warning: #F97316;
  --el-color-danger:  #EF4444;

  /* —— 紫色侧栏 —— */
  --eam-sider-bg-from: #1F2240;
  --eam-sider-bg-to:   #2A2F5C;
  --eam-sider-text:    rgba(255,255,255,.85);
  --eam-sider-text-active: #FFFFFF;
  --eam-sider-active-bg: rgba(255,255,255,.08);
  --eam-sider-hover-bg:  rgba(255,255,255,.04);

  /* —— 内容区 —— */
  --eam-bg-page: #F4F6FA;
  --eam-bg-card: #FFFFFF;
  --eam-radius-card: 12px;
  --eam-shadow-card: 0 2px 8px rgba(15, 23, 42, .04);

  /* —— 表格 —— */
  --eam-table-header-bg: #F0F4FA;
  --eam-table-header-color: #1F2937;
  --eam-table-stripe-bg: #F7FAFE;
  --eam-table-row-hover: #EBF3FF;
  --eam-table-row-height: 52px;

  /* —— 间距 —— */
  --eam-space-page: 16px;
  --eam-space-card: 16px;
}
```

**操作列文字按钮颜色**：
- 详情：`#0EA5E9`（青蓝）
- 编辑：`#1677FF`（主色蓝）
- 删除：`#EF4444`（语义红）

---

## 5. 通用组件 API

### 5.1 `<ListPage>`

**职责**：列表页骨架（卡片 + 业务按钮区 + 表格 slot + 分页）。

**Props**
| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `loading` | `boolean` | `false` | 整体 loading |
| `total` | `number` | `0` | 分页总数 |
| `page` | `number` | — | 当前页（v-model） |
| `limit` | `number` | — | 每页条数（v-model） |
| `pageSizes` | `number[]` | `[10,20,50,100]` | 可选每页条数 |

**Emits**：`update:page` / `update:limit` / `pagination`

**Slots**：
- `#actions`：右上角业务按钮区（新增/批量*）
- 默认 slot：表格主体
- `#footer`：兜底（少用，覆盖默认分页）

**用法示例**
```vue
<ListPage
  :loading="loading"
  :total="total"
  v-model:page="queryParams.pageNo"
  v-model:limit="queryParams.pageSize"
  @pagination="getList"
>
  <template #actions>
    <el-button type="primary" @click="openCreate">
      <Icon icon="ep:plus" />新增
    </el-button>
    <el-button type="success" :disabled="!hasSel" @click="batchSubmit">
      <Icon icon="ep:upload" />提交申请
    </el-button>
  </template>

  <ResizableTable :data="list" @selection-change="onSel">
    <el-table-column type="selection" width="50" />
    <!-- 业务列 -->
    <el-table-column label="操作" fixed="right" width="180">
      <template #default="{ row }">
        <RowActions
          :row="row"
          :on-detail="openDetail"
          :on-edit="openEdit"
          :on-delete="onDelete"
        />
      </template>
    </el-table-column>
  </ResizableTable>
</ListPage>
```

**内部布局**
- `.list-page` = 白卡 + 圆角 12px + 阴影
- `.list-page__header` = 顶部右对齐 actions（高度 56px，padding 16px）
- `.list-page__body` = 表格容器
- `.list-page__footer` = 分页右对齐

### 5.2 `<QueryForm>` + `<QueryItem>`

**职责**：查询区栅格 + 自动展开/收起 + 搜索/重置按钮固定右下。

**`<QueryForm>` Props**
| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `model` | `object` | — | 表单对象（透传 el-form） |
| `cols` | `number` | `4` | 每行列数（2/3/4/6） |
| `collapseAfter` | `number` | `8` | 字段超过此数自动展开/收起 |
| `labelWidth` | `string` | `'90px'` | label 宽度 |

**Emits**：`search`（点搜索 / 任一 input 回车）、`reset`

**`<QueryItem>` Props**
| Prop | 类型 | 默认 | 说明 |
|---|---|---|---|
| `label` | `string` | — | 字段标签 |
| `prop` | `string` | — | 字段 key |
| `span` | `number` | `1` | 占多少列（1/2/3/4） |

**用法示例**
```vue
<QueryForm
  ref="queryFormRef"
  :model="queryParams"
  :cols="4"
  :collapse-after="8"
  @search="handleQuery"
  @reset="resetQuery"
>
  <QueryItem label="报修单号" prop="reportNo">
    <el-input v-model="queryParams.reportNo" placeholder="请输入报修单号" />
  </QueryItem>
  <QueryItem label="审核状态" prop="auditStatus">
    <el-select v-model="queryParams.auditStatus" placeholder="请选择审核状态">
      <el-option v-for="o in opts" :key="o.value" :label="o.label" :value="o.value" />
    </el-select>
  </QueryItem>
  <QueryItem label="故障时间" prop="failTime" :span="2">
    <el-date-picker v-model="queryParams.failTime" type="daterange" />
  </QueryItem>
</QueryForm>
```

**渲染要点**
- `display: grid; grid-template-columns: repeat(var(--cols), 1fr); gap: 16px 24px`
- 搜索/重置按钮放在末位栅格，被字段占用则自动新起一行
- 收起时只显示前 `cols` 个字段（即一行）+ 展开按钮
- 任一 input 回车触发 `@search`
- 卡片：白底圆角 12 + padding 24px
- label：右对齐冒号 + 90px 宽
- 搜索：`type="primary"` 蓝填充；重置：朴素白底灰边

### 5.3 `<RowActions>`

**职责**：行内固定三件套（详情/编辑/删除）+ "更多 ▾" 下拉收纳扩展操作。统一权限指令 + 统一二次确认。

**Props**
| Prop | 类型 | 说明 |
|---|---|---|
| `row` | `object` | 当前行数据 |
| `onDetail` | `(row) => void \| null` | 详情回调，传 null 隐藏按钮 |
| `onEdit` | `(row) => void \| null` | 编辑回调，传 null 隐藏按钮 |
| `onDelete` | `(row) => void \| null` | 删除回调，传 null 隐藏按钮（自动套二次确认） |
| `detailPermi` | `string[]` | 详情权限码（默认无限制） |
| `editPermi` | `string[]` | 编辑权限码（默认无限制） |
| `deletePermi` | `string[]` | 删除权限码（默认无限制） |
| `deleteConfirmText` | `string` | 删除二次确认文案，默认 "确认删除该条数据？" |

**Slots**：`#more` —— 在三件套右侧渲染 "更多 ▾" `el-dropdown`，slot 内放 `el-dropdown-item`。

**渲染规则（铁律）**
1. 三件套位置固定：`详情 | 编辑 | 删除 | 更多 ▾`，权限不通过则该按钮整体不渲染（不留空格）
2. 删除按钮自动 `ElMessageBox.confirm` 二次确认（业务页不需自己写）
3. 文字按钮 link 风格，颜色：详情青蓝 / 编辑主蓝 / 删除红 / 更多默认灰
4. 三件套全无 + 无 `#more` slot 时，渲染占位 `—`
5. 操作列宽度：仅三件套 `180px`，带"更多 ▾" `220px`，统一 `fixed="right"`

**操作分发铁律**（确定行内 vs 右上角）
| 操作类型 | 单条 | 多选/全局 |
|---|---|---|
| 详情 / 编辑 / 删除 | **行内三件套** | 不允许批量删除；批量编辑需独立设计 |
| 生成二维码 / 打印贴纸 | `#more` 槽 | 右上角 `#actions` |
| 提交审核 / 撤回 / 驳回 | `#more` 槽 | 右上角 `#actions` |
| 导出 / 下载 | `#more` 槽 | 右上角 `#actions` |
| 新增 | — | 右上角 `#actions` |

---

## 6. 文件结构

```
src/
├── components/
│   ├── ListPage/
│   │   ├── index.ts
│   │   ├── ListPage.vue          ← 新增
│   │   └── types.ts
│   ├── QueryForm/
│   │   ├── index.ts
│   │   ├── QueryForm.vue         ← 新增
│   │   ├── QueryItem.vue         ← 新增
│   │   └── types.ts
│   ├── RowActions/
│   │   ├── index.ts
│   │   ├── RowActions.vue        ← 新增
│   │   └── types.ts
│   └── index.ts                  ← 改：导出 3 个新组件
│
├── styles/
│   ├── var.css                   ← 改：主色 + 紫侧栏 + 表格 token
│   └── theme/                    ← 新增子目录
│       ├── _layout.scss          ← 侧栏渐变 + Logo 区
│       ├── _list.scss            ← ListPage 卡片 + 表格样式
│       ├── _form.scss            ← QueryForm 栅格
│       └── index.scss
│
├── layout/
│   ├── Layout.vue                ← 改：侧栏背景渐变 class
│   └── components/
│       ├── Logo/                 ← 改：文字"设备管理" + 暗紫底
│       ├── Menu/                 ← 改：菜单项配色
│       └── ToolHeader.vue        ← 改：白底 + 面包屑 + 工具图标
│
└── views/eam/
    ├── deviceLedger/page.vue           ← 迁移示范 1
    ├── failureWorkOrder/page.vue       ← 迁移示范 2
    ├── spotInspectionPlan/page.vue     ← 迁移示范 3
    ├── supplier/page.vue               ← 迁移示范 4
    └── maintenanceWorkOrder/page.vue   ← 迁移示范 5
```

---

## 7. 迁移路径（5 阶段）

| 阶段 | 工作 | 验收 |
|---|---|---|
| **P1 主题层** | 改 `var.css` + 新增 `theme/_*.scss` + Layout/Menu/Logo/ToolHeader 改造 | 所有页面颜色变成新风格（即使不动 page.vue） |
| **P2 组件层** | 新建 `<ListPage>` / `<QueryForm>` / `<QueryItem>` / `<RowActions>` + 单测 | 独立 demo 页可演示三组件 |
| **P3 示范迁移** | 5 个示范页改造 | 5 页 UI 与参考图一致、操作铁律落地 |
| **P4 文档** | 新增 `docs/UI改造规范.md` + 示例代码片段 + 更新 PRD F004 | 团队可照抄迁移其他 52 页 |
| **P5 滚动迁移**（不在本期） | 剩余 52 页排期分批迁移 | 后续每周 5-10 页 |

**本期范围 = P1 + P2 + P3 + P4**。

---

## 8. 测试策略

### 8.1 单元测试（vitest）
- `<QueryForm>`：栅格列数计算、展开/收起逻辑、回车触发搜索、重置回调
- `<QueryItem>`：`span` 占多列正确渲染
- `<RowActions>`：
  - 三件套全开 / 选择性隐藏 / 全部隐藏 + 占位 `—`
  - 删除按钮触发 `ElMessageBox.confirm`，确认后才回调
  - 权限指令 `v-hasPermi` 正确隐藏按钮
  - `#more` slot 在 dropdown 中正确渲染
- `<ListPage>`：分页 v-model 双向绑定、`@pagination` emit

### 8.2 手工验收（5 个示范页）
对照参考图逐项检查：
- [ ] 侧栏紫色渐变 + Logo "设备管理"
- [ ] 查询区白卡圆角 12 + 4 列栅格 + 搜索/重置右下角蓝按钮
- [ ] 表格表头浅蓝灰底 + 行高 52 + 斑马浅蓝 + 列宽可拖拽
- [ ] 业务按钮在表格右上角（绿/蓝/橙/蓝）
- [ ] 操作列固定右侧 + 详情(青)/编辑(蓝)/删除(红)
- [ ] 删除二次确认弹窗
- [ ] 字段超过 8 个时出现"展开/收起"
- [ ] 设备台账"生成二维码"在"更多 ▾"下拉中
- [ ] 故障工单批量"提交申请/审核通过/驳回"在右上角

---

## 9. 风险与依赖

### 9.1 风险
| 风险 | 缓解 |
|---|---|
| Element Plus 升级风险 | 本期不升级 EP（保持 2.11），所有改造走 CSS 覆盖 + 组件包装，不动 EP 源码 |
| ResizableTable 兼容 | 示范页迁移时确认 ResizableTable + 新表格样式无冲突；如冲突，优先保持 ResizableTable 原行为 |
| 业务页定制 CSS 冲突 | 迁移每个页时检查 `.batch-bar / .left-tree / .right-content` 等局部 class，统一收编到组件层 |
| 主题色变化影响其他模块 | bpm / report / mobile 等模块复用 `--el-color-primary`，可能受影响。需手工抽检主要页面 |
| 老页面（不在本期 5 页内）未迁移导致风格不一致 | P4 输出迁移规范文档，P5 排期分批补；本期可接受过渡期不一致 |

### 9.2 依赖
- 现有 `Pagination` 组件继续复用
- `Icon` 组件继续复用（基于 iconify）
- `v-hasPermi` 指令继续复用
- ResizableTable 继续复用（如已有 `<ResizableTable>` 包装）

---

## 10. 验收标准

### 10.1 功能验收
- [ ] 5 个示范页运行无报错，列宽拖拽 / 翻页 / 搜索 / 多选 / 详情 / 编辑 / 删除 / 批量按钮等所有原有功能正常
- [ ] 单元测试覆盖率 ≥ 80%（针对 4 个新组件）
- [ ] `npm run ts:check` 无类型错误
- [ ] `npm run lint:eslint` 无 lint 错误

### 10.2 视觉验收
对照参考图，5 个示范页通过手工验收清单（见 §8.2）。

### 10.3 文档验收
- [ ] `docs/UI改造规范.md` 包含：3 个组件 API 说明 + 5 个示范页代码片段 + 操作分发铁律 + 视觉 token 速查表
- [ ] PRD 增补 F004 条目，状态 🟢

---

## 11. 后续工作（不在本期）

- P5：剩余 52 个 page.vue 滚动迁移（按模块分批，每周 5-10 页）
- 主题切换开关（深色 / 浅色侧栏）—— 待真正有需求再做
- 图标系统升级 —— 当前 iconify + ep:* 混用，后续考虑统一
- 批量编辑能力 —— 当前批量仅支持状态变更，编辑需独立设计
