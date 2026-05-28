# EAM UI 改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前 EAM 控制台改造为参考图风格（紫色侧栏 + 亮蓝主色 + 白卡圆角查询区 + 斑马表格 + 顶部业务按钮 + 行内三件套操作列），交付 4 个通用组件 + 5 个示范页 + 改造规范文档。

**Architecture:** 两层基建：(1) 主题层修改 `var.css` + 新增 `styles/theme/_*.scss`，让所有页面零改动获得新配色；(2) 组件层新增 `<ListPage>` / `<QueryForm>` / `<QueryItem>` / `<RowActions>` 4 个通用组件，承载查询区栅格、业务按钮 slot、行内操作铁律。然后用这套基建迁移 5 个示范页（设备台账/故障工单/点巡检计划/供应商/保养工单），并产出 `docs/UI改造规范.md` 供后续 52 页对照迁移。

**Tech Stack:** Vue 3.5 + TypeScript + Element Plus 2.11 + UnoCSS + Pinia + Vite + Vitest（单测）+ vue-tsc（类型检查）

**Spec:** [`docs/superpowers/specs/2026-04-29-ui-restyle-design.md`](../specs/2026-04-29-ui-restyle-design.md)

---

## File Structure（决策落点）

### 新增（Create）
```
src/components/
├── ListPage/
│   ├── index.ts
│   ├── ListPage.vue
│   ├── types.ts
│   └── __tests__/
│       └── ListPage.test.ts
├── QueryForm/
│   ├── index.ts
│   ├── QueryForm.vue
│   ├── QueryItem.vue
│   ├── types.ts
│   ├── useQueryFormContext.ts        # 父子组件共享 collapse 状态
│   └── __tests__/
│       ├── QueryForm.test.ts
│       └── QueryItem.test.ts
└── RowActions/
    ├── index.ts
    ├── RowActions.vue
    ├── types.ts
    └── __tests__/
        └── RowActions.test.ts

src/styles/theme/
├── index.scss
├── _layout.scss        # 紫色侧栏 + Logo 区
├── _list.scss          # ListPage 卡片 + 表格样式
└── _form.scss          # QueryForm 栅格

docs/
└── UI改造规范.md         # 团队迁移手册
```

### 修改（Modify）
```
src/styles/var.css                              # 主色 + 紫侧栏 + 表格 token
src/components/index.ts                         # 注册 3 个新组件全局可用
src/layout/components/Logo/                     # 文字"设备管理" + 暗紫底
src/layout/components/Menu/                     # 菜单项配色
src/layout/components/ToolHeader.vue            # 白底 + 工具图标
src/layout/components/useRenderLayout.tsx       # 引入新主题样式
src/views/eam/deviceLedger/page.vue             # 示范 1
src/views/eam/failureWorkOrder/page.vue         # 示范 2
src/views/eam/spotInspectionPlan/page.vue       # 示范 3
src/views/eam/supplier/page.vue                 # 示范 4
src/views/eam/maintenanceWorkOrder/page.vue     # 示范 5
docs/PRD.md                                     # 增补 F004 条目
```

### 关键约束
- **测试位置**：`src/<module>/__tests__/<Name>.test.ts`（按 `vitest.config.ts` 的 include 规则）
- **类型文件**：每个组件目录下 `types.ts` 放 Props/Emits 类型导出
- **ResizableTable**：本仓库无此组件（memory 中的 F020 是 LIMS 项目规则），示范页直接用 `<el-table>`
- **图标**：用 `<Icon icon="ep:xxx" />`（项目既有 iconify 集成）

---

## Task 1: 视觉 Token 写入 var.css

**Files:**
- Modify: `src/styles/var.css`

- [ ] **Step 1: 备份当前 var.css**

```bash
cp src/styles/var.css src/styles/var.css.bak
```

- [ ] **Step 2: 修改 var.css 中 :root（亮主题）**

把 `src/styles/var.css` 中 `:root { ... }` 第一段（约前 100 行的亮主题）整段替换为：

```css
:root {
    /* ========== 系统后台 UI 规范 - 三栏布局 ========== */

    --login-bg-color: #f5f7fa;

    --left-menu-max-width: 220px;
    --left-menu-min-width: 64px;

    /* —— 紫色侧栏渐变 —— */
    --left-menu-bg-color: #1F2240;
    --left-menu-bg-light-color: #2A2F5C;
    --left-menu-bg-active-color: rgba(255, 255, 255, 0.08);
    --left-menu-text-color: rgba(255, 255, 255, 0.85);
    --left-menu-text-active-color: #FFFFFF;
    --left-menu-collapse-bg-active-color: rgba(255, 255, 255, 0.08);

    --eam-sider-bg-from: #1F2240;
    --eam-sider-bg-to:   #2A2F5C;
    --eam-sider-hover-bg:  rgba(255,255,255,.04);

    /* logo */
    --logo-height: 56px;
    --logo-title-text-color: #FFFFFF;

    /* header */
    --top-header-bg-color: #FFFFFF;
    --top-header-text-color: #1F2937;
    --top-header-hover-color: #F4F6FA;
    --top-tool-height: var(--logo-height);
    --top-tool-p-x: 8px;
    --tags-view-height: 36px;

    /* tab menu */
    --tab-menu-max-width: 80px;
    --tab-menu-min-width: 30px;
    --tab-menu-collapse-height: 36px;

    --app-content-padding: 16px;

    /* —— 内容区底色（浅灰蓝） —— */
    --app-content-bg-color: #F4F6FA;
    --eam-bg-page: #F4F6FA;
    --eam-bg-card: #FFFFFF;
    --eam-radius-card: 12px;
    --eam-shadow-card: 0 2px 8px rgba(15, 23, 42, .04);

    /* —— 卡片背景 —— */
    --card-bg-color: #FFFFFF;

    --app-footer-height: 48px;
    --transition-time-02: 0.25s;

    /* ========== 主色：亮蓝 #1677FF ========== */
    --primary-color: #1677FF;
    --primary-color-hover: #4596FF;
    --primary-color-active: #0958D9;

    --el-color-primary: #1677FF;
    --el-color-primary-light-3: #4596FF;
    --el-color-primary-light-5: #7AB3FF;
    --el-color-primary-light-7: #B0D1FF;
    --el-color-primary-light-8: #CCDFFF;
    --el-color-primary-light-9: #EBF3FF;
    --el-color-primary-dark-2: #0958D9;

    /* —— 语义色 —— */
    --el-color-success: #16A34A;
    --el-color-warning: #F97316;
    --el-color-danger:  #EF4444;

    /* —— 表格 token —— */
    --eam-table-header-bg: #F0F4FA;
    --eam-table-header-color: #1F2937;
    --eam-table-stripe-bg: #F7FAFE;
    --eam-table-row-hover: #EBF3FF;
    --eam-table-row-height: 52px;

    /* —— 操作列文字按钮色 —— */
    --eam-action-detail: #0EA5E9;
    --eam-action-edit: #1677FF;
    --eam-action-delete: #EF4444;
    --eam-action-more: #6B7280;

    /* —— 间距 —— */
    --eam-space-page: 16px;
    --eam-space-card: 16px;

    --text-color-primary: #1F2937;
}
```

> ⚠️ 注意：var.css 后段还可能有 `[data-theme='dark']` 等暗色主题段，**不要动**那些段，只改 `:root { ... }` 第一段。

- [ ] **Step 3: 启动 dev 验证未报错**

```bash
npm run dev
```

Expected: 服务启动 `Local: http://localhost:xxxx`，无报错。手动打开浏览器，侧栏背景应已变成深紫色，主按钮变蓝色（#1677FF）。Ctrl+C 停止。

- [ ] **Step 4: 类型检查通过**

```bash
npm run ts:check
```

Expected: 无类型错误（输出 0 errors）。

- [ ] **Step 5: 提交**

```bash
rm src/styles/var.css.bak
git add src/styles/var.css
git commit -m "feat(theme): 注入新视觉 token（紫侧栏+主色#1677FF+表格 token）"
```

---

## Task 2: 新增主题样式包 styles/theme/

**Files:**
- Create: `src/styles/theme/index.scss`
- Create: `src/styles/theme/_layout.scss`
- Create: `src/styles/theme/_list.scss`
- Create: `src/styles/theme/_form.scss`
- Modify: `src/styles/index.scss`

- [ ] **Step 1: 创建 _layout.scss**

写入 `src/styles/theme/_layout.scss`：

```scss
/* —— 侧栏渐变背景 —— */
.v-aside,
[class*='__left-menu'] {
  background: linear-gradient(180deg, var(--eam-sider-bg-from) 0%, var(--eam-sider-bg-to) 100%) !important;
}

/* —— Logo 区 —— */
.v-logo {
  background: var(--eam-sider-bg-from) !important;

  .title {
    color: var(--logo-title-text-color);
    font-weight: 600;
  }
}

/* —— 菜单项 hover/active —— */
.el-menu {
  background: transparent !important;

  .el-menu-item,
  .el-sub-menu__title {
    color: var(--left-menu-text-color) !important;

    &:hover {
      background: var(--eam-sider-hover-bg) !important;
      color: var(--left-menu-text-active-color) !important;
    }
  }

  .el-menu-item.is-active {
    background: var(--left-menu-bg-active-color) !important;
    color: var(--left-menu-text-active-color) !important;
    border-left: 3px solid var(--el-color-primary);
  }
}

/* —— 顶部 Header 白底 —— */
.tool-header,
[class*='__tool-header'] {
  background: var(--top-header-bg-color) !important;
  color: var(--top-header-text-color) !important;
  border-bottom: 1px solid #E5E7EB;
}

/* —— 内容区底色 —— */
.app-main,
[class*='__content'] {
  background: var(--eam-bg-page) !important;
}
```

- [ ] **Step 2: 创建 _list.scss**

写入 `src/styles/theme/_list.scss`：

```scss
/* —— ListPage 卡片 —— */
.eam-list-page {
  background: var(--eam-bg-card);
  border-radius: var(--eam-radius-card);
  box-shadow: var(--eam-shadow-card);
  overflow: hidden;

  &__header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    padding: 16px 24px;
    min-height: 56px;
    border-bottom: 1px solid #F3F4F6;
  }

  &__body {
    padding: 0;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;
    padding: 16px 24px;
  }
}

/* —— Element Plus 表格风格化 —— */
.eam-list-page .el-table {
  --el-table-header-bg-color: var(--eam-table-header-bg);
  --el-table-header-text-color: var(--eam-table-header-color);
  --el-table-row-hover-bg-color: var(--eam-table-row-hover);
  --el-table-tr-bg-color: #FFFFFF;

  thead th.el-table__cell {
    background: var(--eam-table-header-bg);
    color: var(--eam-table-header-color);
    font-weight: 600;
    height: 48px;
  }

  tbody tr td.el-table__cell {
    height: var(--eam-table-row-height);
    padding: 8px 0;
  }

  &.el-table--striped tbody tr.el-table__row--striped td {
    background: var(--eam-table-stripe-bg);
  }
}

/* —— 行内操作按钮颜色 —— */
.eam-row-actions {
  display: inline-flex;
  align-items: center;
  gap: 12px;

  .ra-detail { color: var(--eam-action-detail); }
  .ra-edit   { color: var(--eam-action-edit); }
  .ra-delete { color: var(--eam-action-delete); }
  .ra-more   { color: var(--eam-action-more); }

  .el-button.is-link {
    padding: 0;
    height: auto;
    font-weight: 500;
  }
}
```

- [ ] **Step 3: 创建 _form.scss**

写入 `src/styles/theme/_form.scss`：

```scss
/* —— QueryForm 栅格容器 —— */
.eam-query-form {
  background: var(--eam-bg-card);
  border-radius: var(--eam-radius-card);
  box-shadow: var(--eam-shadow-card);
  padding: 20px 24px;
  margin-bottom: var(--eam-space-page);

  &__grid {
    display: grid;
    grid-template-columns: repeat(var(--eam-form-cols, 4), 1fr);
    gap: 16px 24px;
  }

  &__item {
    display: flex;
    align-items: center;
    min-height: 32px;

    > .label {
      width: 90px;
      flex-shrink: 0;
      text-align: right;
      padding-right: 12px;
      color: #4B5563;
      font-size: 14px;

      &::after {
        content: '：';
      }
    }

    > .control {
      flex: 1;
      min-width: 0;

      .el-input,
      .el-select,
      .el-date-editor {
        width: 100%;
      }
    }
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
    grid-column: -2 / -1; /* 默认占末位栅格，不够则自动换行 */
  }

  &__toggle {
    color: var(--el-color-primary);
    font-size: 13px;
    cursor: pointer;
    user-select: none;
    margin-left: 8px;
  }
}
```

- [ ] **Step 4: 创建 index.scss 聚合**

写入 `src/styles/theme/index.scss`：

```scss
@use './layout';
@use './list';
@use './form';
```

- [ ] **Step 5: 在全局样式中引入**

打开 `src/styles/index.scss`，在文件末尾追加：

```scss
@use './theme/index.scss';
```

- [ ] **Step 6: dev 验证**

```bash
npm run dev
```

Expected: 服务启动无报错；浏览器侧栏现在是紫色渐变（顶 #1F2240，底 #2A2F5C）；菜单 active 项有左侧蓝色 3px 竖条；header 白底。Ctrl+C 停止。

- [ ] **Step 7: 提交**

```bash
git add src/styles/theme src/styles/index.scss
git commit -m "feat(theme): 新增主题样式包（侧栏渐变+卡片+表格+栅格）"
```

---

## Task 3: Logo 文字改为"设备管理"

**Files:**
- Modify: `src/layout/components/Logo/`（具体子文件需先 ls 确认）

- [ ] **Step 1: 定位 Logo 组件主文件**

```bash
ls src/layout/components/Logo/ && find src/layout/components/Logo -name "*.vue" -o -name "*.tsx" | head
```

Expected: 找到 `src.vue` 或类似主文件。

- [ ] **Step 2: 找到 Logo 文字渲染处**

```bash
grep -rn "title\|appName\|文字\|name" src/layout/components/Logo/ | head -10
```

记录文字定义位置（多半是 props 或 i18n key）。

- [ ] **Step 3: 修改 Logo 文字**

如发现是从 i18n 取，搜索 i18n locales：

```bash
grep -rn "iimake\|EAM\|管理后台" src/locales/ | head -5
```

修改对应 key 的中文 value 为 `"设备管理"`。
如果是硬编码，则直接改 Logo 组件中的文字字符串为 `"设备管理"`。

- [ ] **Step 4: dev 验证**

```bash
npm run dev
```

Expected: 侧栏顶部 Logo 文字显示"设备管理"。Ctrl+C 停止。

- [ ] **Step 5: 提交**

```bash
git add src/layout/components/Logo src/locales 2>/dev/null
git commit -m "feat(layout): Logo 文字改为'设备管理'"
```

---

## Task 4: RowActions 组件 - 写测试

**Files:**
- Create: `src/components/RowActions/types.ts`
- Create: `src/components/RowActions/__tests__/RowActions.test.ts`

- [ ] **Step 1: 写类型定义**

写入 `src/components/RowActions/types.ts`：

```ts
export interface RowActionsProps<T = any> {
  row: T
  onDetail?: ((row: T) => void) | null
  onEdit?: ((row: T) => void) | null
  onDelete?: ((row: T) => void) | null
  detailPermi?: string[]
  editPermi?: string[]
  deletePermi?: string[]
  deleteConfirmText?: string
}
```

- [ ] **Step 2: 写测试 - 三件套全开**

写入 `src/components/RowActions/__tests__/RowActions.test.ts`：

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import RowActions from '../RowActions.vue'

describe('RowActions', () => {
  it('默认渲染：三件套全开 - 详情/编辑/删除三个按钮都显示', () => {
    const wrapper = mount(RowActions, {
      props: {
        row: { id: 1 },
        onDetail: vi.fn(),
        onEdit: vi.fn(),
        onDelete: vi.fn()
      }
    })
    expect(wrapper.text()).toContain('详情')
    expect(wrapper.text()).toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('选择性隐藏：onEdit 传 null 则不渲染编辑按钮', () => {
    const wrapper = mount(RowActions, {
      props: {
        row: { id: 1 },
        onDetail: vi.fn(),
        onEdit: null,
        onDelete: vi.fn()
      }
    })
    expect(wrapper.text()).toContain('详情')
    expect(wrapper.text()).not.toContain('编辑')
    expect(wrapper.text()).toContain('删除')
  })

  it('全部隐藏 + 无 #more slot 时显示占位 —', () => {
    const wrapper = mount(RowActions, {
      props: {
        row: { id: 1 },
        onDetail: null,
        onEdit: null,
        onDelete: null
      }
    })
    expect(wrapper.text()).toContain('—')
  })

  it('点击详情触发 onDetail 回调，传入 row', async () => {
    const onDetail = vi.fn()
    const row = { id: 42 }
    const wrapper = mount(RowActions, {
      props: { row, onDetail, onEdit: null, onDelete: null }
    })
    await wrapper.find('.ra-detail').trigger('click')
    expect(onDetail).toHaveBeenCalledWith(row)
  })

  it('点击编辑触发 onEdit 回调，传入 row', async () => {
    const onEdit = vi.fn()
    const row = { id: 42 }
    const wrapper = mount(RowActions, {
      props: { row, onDetail: null, onEdit, onDelete: null }
    })
    await wrapper.find('.ra-edit').trigger('click')
    expect(onEdit).toHaveBeenCalledWith(row)
  })

  it('#more slot 渲染时显示"更多 ▾"', () => {
    const wrapper = mount(RowActions, {
      props: {
        row: { id: 1 },
        onDetail: vi.fn(),
        onEdit: null,
        onDelete: null
      },
      slots: {
        more: '<span class="more-item">导出</span>'
      }
    })
    expect(wrapper.text()).toContain('更多')
  })
})
```

- [ ] **Step 3: 运行测试验证全部失败**

```bash
npx vitest run src/components/RowActions/__tests__/RowActions.test.ts
```

Expected: FAIL —— 因为 `RowActions.vue` 还没创建。错误信息类似 `Cannot find module '../RowActions.vue'`。

- [ ] **Step 4: 提交**

```bash
git add src/components/RowActions
git commit -m "test(RowActions): 写 6 个失败测试（三件套显隐+回调+slot）"
```

---

## Task 5: RowActions 组件 - 实现 + 测试通过

**Files:**
- Create: `src/components/RowActions/RowActions.vue`
- Create: `src/components/RowActions/index.ts`

- [ ] **Step 1: 实现 RowActions.vue**

写入 `src/components/RowActions/RowActions.vue`：

```vue
<template>
  <span v-if="hasNothing" class="eam-row-actions">—</span>
  <span v-else class="eam-row-actions">
    <el-button
      v-if="onDetail"
      link
      class="ra-detail"
      @click="handleDetail"
    >
      详情
    </el-button>
    <el-button
      v-if="onEdit"
      link
      class="ra-edit"
      @click="handleEdit"
    >
      编辑
    </el-button>
    <el-button
      v-if="onDelete"
      link
      class="ra-delete"
      @click="handleDelete"
    >
      删除
    </el-button>
    <el-dropdown
      v-if="hasMore"
      trigger="click"
      class="ra-more"
    >
      <el-button link class="ra-more">
        更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <slot name="more" />
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<script lang="ts" setup>
import { computed, useSlots } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import type { RowActionsProps } from './types'

const props = withDefaults(defineProps<RowActionsProps>(), {
  onDetail: null,
  onEdit: null,
  onDelete: null,
  deleteConfirmText: '确认删除该条数据？'
})

const slots = useSlots()
const hasMore = computed(() => !!slots.more)

const hasNothing = computed(
  () => !props.onDetail && !props.onEdit && !props.onDelete && !hasMore.value
)

function handleDetail() {
  props.onDetail?.(props.row)
}

function handleEdit() {
  props.onEdit?.(props.row)
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(props.deleteConfirmText, '提示', {
      type: 'warning',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
    props.onDelete?.(props.row)
  } catch {
    // 用户取消，不做任何事
  }
}
</script>
```

- [ ] **Step 2: 写 index.ts 导出**

写入 `src/components/RowActions/index.ts`：

```ts
import RowActions from './RowActions.vue'

export { RowActions }
export type { RowActionsProps } from './types'
export default RowActions
```

- [ ] **Step 3: 运行测试**

```bash
npx vitest run src/components/RowActions/__tests__/RowActions.test.ts
```

Expected: PASS —— 所有 6 个测试通过。如果"点击删除"相关测试因为 ElMessageBox 异步问题需要补充测试（暂未要求），可保持现状。

- [ ] **Step 4: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。

- [ ] **Step 5: 提交**

```bash
git add src/components/RowActions
git commit -m "feat(RowActions): 行内三件套+更多▾+自动二次确认"
```

---

## Task 6: QueryItem 组件 - 写测试

**Files:**
- Create: `src/components/QueryForm/types.ts`
- Create: `src/components/QueryForm/useQueryFormContext.ts`
- Create: `src/components/QueryForm/__tests__/QueryItem.test.ts`

- [ ] **Step 1: 写类型定义**

写入 `src/components/QueryForm/types.ts`：

```ts
import type { InjectionKey, Ref } from 'vue'

export interface QueryFormProps {
  model: Record<string, any>
  cols?: number
  collapseAfter?: number
  labelWidth?: string
}

export interface QueryItemProps {
  label: string
  prop?: string
  span?: number
}

export interface QueryFormContext {
  cols: Ref<number>
  collapsed: Ref<boolean>
  registerItem: (id: symbol) => number /* 注册并返回顺序索引 */
  unregisterItem: (id: symbol) => void
  triggerSearch: () => void
}

export const QueryFormCtxKey: InjectionKey<QueryFormContext> = Symbol('QueryFormContext')
```

- [ ] **Step 2: 写 context hook**

写入 `src/components/QueryForm/useQueryFormContext.ts`：

```ts
import { inject } from 'vue'
import { QueryFormCtxKey, type QueryFormContext } from './types'

export function useQueryFormContext(): QueryFormContext | null {
  return inject(QueryFormCtxKey, null)
}
```

- [ ] **Step 3: 写 QueryItem 测试**

写入 `src/components/QueryForm/__tests__/QueryItem.test.ts`：

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import QueryItem from '../QueryItem.vue'

describe('QueryItem', () => {
  it('渲染 label 文本', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '报修单号' },
      slots: { default: '<input class="real-input" />' }
    })
    expect(wrapper.text()).toContain('报修单号')
    expect(wrapper.find('.real-input').exists()).toBe(true)
  })

  it('span=2 时 grid-column 占两列', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '故障时间', span: 2 },
      slots: { default: '<input />' }
    })
    const style = (wrapper.element as HTMLElement).style.gridColumn
    expect(style).toContain('span 2')
  })

  it('默认 span=1 时不设置 grid-column 跨列', () => {
    const wrapper = mount(QueryItem, {
      props: { label: '审核状态' },
      slots: { default: '<input />' }
    })
    const style = (wrapper.element as HTMLElement).style.gridColumn
    expect(style).toBe('')
  })
})
```

- [ ] **Step 4: 运行测试验证失败**

```bash
npx vitest run src/components/QueryForm/__tests__/QueryItem.test.ts
```

Expected: FAIL —— `QueryItem.vue` 未创建。

- [ ] **Step 5: 提交**

```bash
git add src/components/QueryForm
git commit -m "test(QueryItem): 写 3 个失败测试（label+span 跨列）"
```

---

## Task 7: QueryItem 组件 - 实现

**Files:**
- Create: `src/components/QueryForm/QueryItem.vue`

- [ ] **Step 1: 实现 QueryItem.vue**

写入 `src/components/QueryForm/QueryItem.vue`：

```vue
<template>
  <div
    v-show="visible"
    class="eam-query-form__item"
    :style="itemStyle"
  >
    <span class="label">{{ label }}</span>
    <span class="control">
      <slot />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useQueryFormContext } from './useQueryFormContext'
import type { QueryItemProps } from './types'

const props = withDefaults(defineProps<QueryItemProps>(), {
  span: 1
})

const ctx = useQueryFormContext()
const id = Symbol('query-item')

let myIndex = -1

onMounted(() => {
  if (ctx) {
    myIndex = ctx.registerItem(id)
  }
})

onBeforeUnmount(() => {
  ctx?.unregisterItem(id)
})

/* 收起状态下：仅前 cols 个字段可见 */
const visible = computed(() => {
  if (!ctx) return true
  if (!ctx.collapsed.value) return true
  return myIndex >= 0 && myIndex < ctx.cols.value
})

const itemStyle = computed(() => {
  if (props.span > 1) {
    return { gridColumn: `span ${props.span}` }
  }
  return {}
})
</script>
```

- [ ] **Step 2: 运行测试**

```bash
npx vitest run src/components/QueryForm/__tests__/QueryItem.test.ts
```

Expected: PASS —— 3 个测试通过。

- [ ] **Step 3: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。

- [ ] **Step 4: 提交**

```bash
git add src/components/QueryForm
git commit -m "feat(QueryItem): 栅格项（label+slot+span 跨列+collapse 联动）"
```

---

## Task 8: QueryForm 组件 - 写测试

**Files:**
- Create: `src/components/QueryForm/__tests__/QueryForm.test.ts`

- [ ] **Step 1: 写 QueryForm 测试**

写入 `src/components/QueryForm/__tests__/QueryForm.test.ts`：

```ts
import { describe, it, expect, vi, nextTick } from 'vitest'
import { mount } from '@vue/test-utils'
import QueryForm from '../QueryForm.vue'
import QueryItem from '../QueryItem.vue'

describe('QueryForm', () => {
  it('默认 4 列栅格 - CSS 变量正确设置', () => {
    const wrapper = mount(QueryForm, {
      props: { model: {} }
    })
    const grid = wrapper.find('.eam-query-form__grid').element as HTMLElement
    expect(grid.style.getPropertyValue('--eam-form-cols')).toBe('4')
  })

  it('cols=3 时栅格 CSS 变量为 3', () => {
    const wrapper = mount(QueryForm, {
      props: { model: {}, cols: 3 }
    })
    const grid = wrapper.find('.eam-query-form__grid').element as HTMLElement
    expect(grid.style.getPropertyValue('--eam-form-cols')).toBe('3')
  })

  it('字段数 ≤ collapseAfter 时不显示展开按钮', () => {
    const wrapper = mount(QueryForm, {
      props: { model: {}, collapseAfter: 8 },
      slots: {
        default: `
          <QueryItem label="字段1"><input /></QueryItem>
          <QueryItem label="字段2"><input /></QueryItem>
        `
      },
      global: { components: { QueryItem } }
    })
    expect(wrapper.find('.eam-query-form__toggle').exists()).toBe(false)
  })

  it('点击搜索按钮触发 @search', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(QueryForm, {
      props: { model: {}, onSearch }
    })
    await wrapper.find('button.eam-search-btn').trigger('click')
    expect(onSearch).toHaveBeenCalledTimes(1)
  })

  it('点击重置按钮触发 @reset', async () => {
    const onReset = vi.fn()
    const wrapper = mount(QueryForm, {
      props: { model: {}, onReset }
    })
    await wrapper.find('button.eam-reset-btn').trigger('click')
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  it('在 input 上回车触发 @search', async () => {
    const onSearch = vi.fn()
    const wrapper = mount(QueryForm, {
      props: { model: {}, onSearch },
      slots: {
        default: `<QueryItem label="字段1"><input class="test-input" /></QueryItem>`
      },
      global: { components: { QueryItem } }
    })
    await wrapper.find('.test-input').trigger('keyup.enter')
    expect(onSearch).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: 运行测试验证失败**

```bash
npx vitest run src/components/QueryForm/__tests__/QueryForm.test.ts
```

Expected: FAIL —— `QueryForm.vue` 未创建。

- [ ] **Step 3: 提交**

```bash
git add src/components/QueryForm/__tests__/QueryForm.test.ts
git commit -m "test(QueryForm): 写 6 个失败测试（栅格+搜索/重置/回车+折叠）"
```

---

## Task 9: QueryForm 组件 - 实现

**Files:**
- Create: `src/components/QueryForm/QueryForm.vue`
- Create: `src/components/QueryForm/index.ts`

- [ ] **Step 1: 实现 QueryForm.vue**

写入 `src/components/QueryForm/QueryForm.vue`：

```vue
<template>
  <div class="eam-query-form" @keyup.enter="handleSearch">
    <div
      class="eam-query-form__grid"
      :style="{ '--eam-form-cols': String(cols) }"
    >
      <slot />
      <div class="eam-query-form__actions">
        <el-button type="primary" class="eam-search-btn" @click="handleSearch">
          <Icon icon="ep:search" class="mr-5px" />搜索
        </el-button>
        <el-button class="eam-reset-btn" @click="handleReset">
          <Icon icon="ep:refresh" class="mr-5px" />重置
        </el-button>
        <span
          v-if="needToggle"
          class="eam-query-form__toggle"
          @click="collapsed = !collapsed"
        >
          {{ collapsed ? '展开 ▼' : '收起 ▲' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, ref } from 'vue'
import { Icon } from '@/components/Icon'
import { QueryFormCtxKey, type QueryFormProps } from './types'

const props = withDefaults(defineProps<QueryFormProps>(), {
  cols: 4,
  collapseAfter: 8,
  labelWidth: '90px'
})

const emit = defineEmits<{
  (e: 'search'): void
  (e: 'reset'): void
}>()

const collapsed = ref(false)
const items = ref<symbol[]>([])

const needToggle = computed(() => items.value.length > props.collapseAfter)

function registerItem(id: symbol): number {
  items.value.push(id)
  return items.value.length - 1
}

function unregisterItem(id: symbol): void {
  const idx = items.value.indexOf(id)
  if (idx > -1) items.value.splice(idx, 1)
}

function handleSearch() {
  emit('search')
}

function handleReset() {
  emit('reset')
}

provide(QueryFormCtxKey, {
  cols: computed(() => props.cols) as any,
  collapsed,
  registerItem,
  unregisterItem,
  triggerSearch: handleSearch
})
</script>
```

- [ ] **Step 2: 写 index.ts**

写入 `src/components/QueryForm/index.ts`：

```ts
import QueryForm from './QueryForm.vue'
import QueryItem from './QueryItem.vue'

export { QueryForm, QueryItem }
export type { QueryFormProps, QueryItemProps } from './types'
export default QueryForm
```

- [ ] **Step 3: 运行测试**

```bash
npx vitest run src/components/QueryForm
```

Expected: PASS —— 9 个测试（QueryItem 3 + QueryForm 6）全部通过。

- [ ] **Step 4: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。

- [ ] **Step 5: 提交**

```bash
git add src/components/QueryForm
git commit -m "feat(QueryForm): 栅格容器（4 列默认+可覆盖+回车搜索+8字段折叠）"
```

---

## Task 10: ListPage 组件 - 写测试 + 实现

**Files:**
- Create: `src/components/ListPage/types.ts`
- Create: `src/components/ListPage/ListPage.vue`
- Create: `src/components/ListPage/index.ts`
- Create: `src/components/ListPage/__tests__/ListPage.test.ts`

- [ ] **Step 1: 写类型**

写入 `src/components/ListPage/types.ts`：

```ts
export interface ListPageProps {
  loading?: boolean
  total?: number
  page?: number
  limit?: number
  pageSizes?: number[]
}
```

- [ ] **Step 2: 写测试**

写入 `src/components/ListPage/__tests__/ListPage.test.ts`：

```ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ListPage from '../ListPage.vue'

describe('ListPage', () => {
  it('默认渲染 .eam-list-page 卡片容器', () => {
    const wrapper = mount(ListPage, { props: { total: 0 } })
    expect(wrapper.find('.eam-list-page').exists()).toBe(true)
  })

  it('#actions slot 渲染到 header 区', () => {
    const wrapper = mount(ListPage, {
      props: { total: 0 },
      slots: {
        actions: '<button class="my-action">新增</button>'
      }
    })
    const header = wrapper.find('.eam-list-page__header')
    expect(header.find('.my-action').exists()).toBe(true)
  })

  it('默认 slot 渲染到 body 区', () => {
    const wrapper = mount(ListPage, {
      props: { total: 0 },
      slots: {
        default: '<div class="my-table">表格</div>'
      }
    })
    expect(wrapper.find('.eam-list-page__body .my-table').exists()).toBe(true)
  })

  it('total > 0 时渲染分页', () => {
    const wrapper = mount(ListPage, {
      props: { total: 100, page: 1, limit: 10 }
    })
    expect(wrapper.find('.eam-list-page__footer').exists()).toBe(true)
  })

  it('total = 0 时不渲染分页', () => {
    const wrapper = mount(ListPage, { props: { total: 0 } })
    expect(wrapper.find('.eam-list-page__footer').exists()).toBe(false)
  })
})
```

- [ ] **Step 3: 运行测试验证失败**

```bash
npx vitest run src/components/ListPage
```

Expected: FAIL —— `ListPage.vue` 未创建。

- [ ] **Step 4: 实现 ListPage.vue**

写入 `src/components/ListPage/ListPage.vue`：

```vue
<template>
  <div class="eam-list-page" v-loading="loading">
    <div class="eam-list-page__header">
      <slot name="actions" />
    </div>
    <div class="eam-list-page__body">
      <slot />
    </div>
    <div v-if="total > 0" class="eam-list-page__footer">
      <slot name="footer">
        <el-pagination
          background
          :current-page="page"
          :page-size="limit"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="(p) => emit('update:page', p)"
          @size-change="(s) => emit('update:limit', s)"
        />
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ListPageProps } from './types'

const props = withDefaults(defineProps<ListPageProps>(), {
  loading: false,
  total: 0,
  page: 1,
  limit: 10,
  pageSizes: () => [10, 20, 50, 100]
})

const emit = defineEmits<{
  (e: 'update:page', page: number): void
  (e: 'update:limit', limit: number): void
  (e: 'pagination', payload: { page: number; limit: number }): void
}>()
</script>
```

- [ ] **Step 5: 写 index.ts**

写入 `src/components/ListPage/index.ts`：

```ts
import ListPage from './ListPage.vue'

export { ListPage }
export type { ListPageProps } from './types'
export default ListPage
```

- [ ] **Step 6: 运行测试**

```bash
npx vitest run src/components/ListPage
```

Expected: PASS —— 5 个测试通过。

- [ ] **Step 7: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。

- [ ] **Step 8: 提交**

```bash
git add src/components/ListPage
git commit -m "feat(ListPage): 列表页骨架（actions slot + 表格 slot + 分页）"
```

---

## Task 11: 全局注册 3 个新组件

**Files:**
- Modify: `src/components/index.ts`

- [ ] **Step 1: 修改 components/index.ts**

打开 `src/components/index.ts`，把内容替换为：

```ts
import type { App } from 'vue'
import { Icon } from './Icon'
import { ListPage } from './ListPage'
import { QueryForm, QueryItem } from './QueryForm'
import { RowActions } from './RowActions'

export const setupGlobCom = (app: App<Element>): void => {
  app.component('Icon', Icon)
  app.component('ListPage', ListPage)
  app.component('QueryForm', QueryForm)
  app.component('QueryItem', QueryItem)
  app.component('RowActions', RowActions)
}

export { ListPage, QueryForm, QueryItem, RowActions }
```

- [ ] **Step 2: 全部测试 + 类型检查**

```bash
npx vitest run && npm run ts:check
```

Expected: 全部测试 PASS，类型 0 errors。

- [ ] **Step 3: dev 验证**

```bash
npm run dev
```

Expected: 服务启动无报错（控制台无 unknown component 警告）。Ctrl+C 停止。

- [ ] **Step 4: 提交**

```bash
git add src/components/index.ts
git commit -m "feat(components): 全局注册 ListPage/QueryForm/QueryItem/RowActions"
```

---

## Task 12: 示范迁移 - 设备台账（deviceLedger）

**Files:**
- Modify: `src/views/eam/deviceLedger/page.vue`

- [ ] **Step 1: 备份当前 page.vue**

```bash
cp src/views/eam/deviceLedger/page.vue src/views/eam/deviceLedger/page.vue.bak
```

- [ ] **Step 2: 整体替换 template**

读取当前 `src/views/eam/deviceLedger/page.vue` 全文，找到 `<template>` 段，整体替换为以下结构（保留 script 段不动）：

```vue
<template>
  <div class="device-ledger-page">
    <div class="layout-wrap">
      <!-- 左侧设备类型树 -->
      <div class="left-tree">
        <ContentWrap class="h-full">
          <div class="tree-title">设备类型</div>
          <el-input
            v-model="treeFilterText"
            placeholder="搜索设备类型"
            clearable
            class="tree-search"
          />
          <el-tree
            ref="treeRef"
            :data="treeData"
            node-key="key"
            :props="{ children: 'children', label: 'title' }"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            :filter-node-method="filterTreeNode"
            @node-click="handleTreeNodeClick"
          />
        </ContentWrap>
      </div>

      <!-- 右侧列表区域 -->
      <div class="right-content">
        <!-- 查询区 -->
        <QueryForm
          :model="queryParams"
          :cols="3"
          @search="handleQuery"
          @reset="resetQuery"
        >
          <QueryItem label="设备编号" prop="equipmentSn">
            <el-input
              v-model="queryParams.equipmentSn"
              clearable
              placeholder="请输入设备编号"
            />
          </QueryItem>
          <QueryItem label="设备名称" prop="equipmentName">
            <el-input
              v-model="queryParams.equipmentName"
              clearable
              placeholder="请输入设备名称"
            />
          </QueryItem>
          <QueryItem label="设备状态" prop="operationStatus">
            <el-select
              v-model="queryParams.operationStatus"
              placeholder="请选择设备状态"
              clearable
            >
              <el-option
                v-for="item in eamEnumStore.getOperationStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </QueryItem>
          <QueryItem label="供应商" prop="equipmentSupplier">
            <el-select
              v-model="queryParams.equipmentSupplier"
              placeholder="请选择供应商"
              clearable
              filterable
            >
              <el-option
                v-for="item in supplierOptions"
                :key="item.supplierSn"
                :label="item.supplierName"
                :value="item.supplierSn"
              />
            </el-select>
          </QueryItem>
          <QueryItem label="设备型号" prop="equipmentMode">
            <el-input
              v-model="queryParams.equipmentMode"
              clearable
              placeholder="请输入设备型号"
            />
          </QueryItem>
        </QueryForm>

        <!-- 列表 -->
        <ListPage
          :loading="loading"
          :total="total"
          v-model:page="queryParams.pageNo"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        >
          <template #actions>
            <el-button
              type="primary"
              :disabled="selectedRows.length === 0"
              @click="openBatchPrint"
            >
              <Icon icon="ep:printer" class="mr-5px" />
              批量打印贴纸（已选 {{ selectedRows.length }} 台）
            </el-button>
          </template>

          <el-table
            ref="tableRef"
            :data="list"
            :stripe="true"
            :show-overflow-tooltip="true"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="设备编号" align="center" prop="equipmentSn" width="160" />
            <el-table-column label="设备名称" align="center" prop="equipmentName" min-width="120" />
            <el-table-column label="设备状态" align="center" prop="operationStatus" width="80">
              <template #default="scope">
                <span
                  class="operation-status-dot"
                  :class="getOperationStatusClass(scope.row.operationStatus)"
                ></span>
              </template>
            </el-table-column>
            <el-table-column label="设备类型" align="center" prop="equipmentTypeDesc" width="120" />
            <el-table-column label="排序号" align="center" prop="sequenceNumber" width="80" />
            <el-table-column
              label="供应商"
              align="center"
              prop="equipmentSupplierName"
              min-width="150"
            />
            <el-table-column label="设备型号" align="center" prop="equipmentMode" width="120">
              <template #default="scope">
                {{ eamEnumStore.getEquipmentModeText(scope.row.equipmentMode) }}
              </template>
            </el-table-column>
            <el-table-column label="设备类别" align="center" prop="equipmentCategory" width="100" />
            <el-table-column
              label="设备类别描述"
              align="center"
              prop="equipmentCategoryDesc"
              width="120"
            />
            <el-table-column label="资产状态" align="center" prop="equipmentStatus" width="100">
              <template #default="scope">
                {{ eamEnumStore.getEquipmentStatusText(scope.row.equipmentStatus) }}
              </template>
            </el-table-column>
            <el-table-column
              label="投入运营时间"
              align="center"
              prop="equipmentOperating"
              width="120"
            />
            <el-table-column label="购置时间" align="center" prop="equipmentPurchase" width="120" />
            <el-table-column label="操作" align="center" fixed="right" width="220">
              <template #default="scope">
                <RowActions
                  :row="scope.row"
                  :on-detail="(r: any) => openDetail(r.id)"
                  :on-edit="null"
                  :on-delete="null"
                >
                  <template #more>
                    <el-dropdown-item @click="openQrcode(scope.row)">
                      <Icon icon="ep:document" class="mr-5px" />生成二维码
                    </el-dropdown-item>
                  </template>
                </RowActions>
              </template>
            </el-table-column>
          </el-table>
        </ListPage>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <DeviceLedgerDetail ref="detailRef" />
    <!-- 二维码弹窗 -->
    <QrcodeDialog ref="qrcodeRef" />
    <!-- 批量打印贴纸 -->
    <BatchLabelPrint ref="batchPrintRef" />
  </div>
</template>
```

> 注意：保留原 `<script lang="ts" setup>` 整段不动，仅替换 `<template>`。原 script 中 `Pagination` 的 import 如果不再使用可以删除（ListPage 内部已含分页）。

- [ ] **Step 3: 检查 script 中是否有未使用的 import**

```bash
npm run ts:check
```

如果报 `'Pagination' is declared but its value is never read`，删除该 import。

- [ ] **Step 4: dev 验证**

```bash
npm run dev
```

打开浏览器 → 设备台账页面，验收清单：
- 查询区是白卡圆角，3 列栅格，搜索/重置按钮蓝色右下角
- 表格表头浅蓝灰底，行高 52，斑马浅蓝
- 操作列固定右侧，显示"详情 | 更多 ▾"，点"更多 ▾"展开"生成二维码"
- 右上角显示"批量打印贴纸（已选 N 台）"按钮
- 翻页正常，多选正常

Ctrl+C 停止。

- [ ] **Step 5: 删除备份 + 提交**

```bash
rm src/views/eam/deviceLedger/page.vue.bak
git add src/views/eam/deviceLedger/page.vue
git commit -m "refactor(deviceLedger): 迁移到 QueryForm+ListPage+RowActions 新规范"
```

---

## Task 13: 示范迁移 - 故障工单（failureWorkOrder）

**Files:**
- Modify: `src/views/eam/failureWorkOrder/page.vue`

- [ ] **Step 1: 读取当前 page.vue 了解结构**

```bash
cat src/views/eam/failureWorkOrder/page.vue | head -200
```

记录字段名（用于 QueryItem 替换）、原批量按钮、原行内操作。

- [ ] **Step 2: 备份**

```bash
cp src/views/eam/failureWorkOrder/page.vue src/views/eam/failureWorkOrder/page.vue.bak
```

- [ ] **Step 3: 改造 template**

将查询区从 `<el-form :inline="true">` 替换为 `<QueryForm :cols="4">` + `<QueryItem>`，对应原所有字段。

将列表外层 `ContentWrap` 替换为 `<ListPage v-model:page v-model:limit @pagination>`。

将顶部"新增/批量提交申请/批量审核通过/批量驳回"等业务按钮放入 `<template #actions>`：

```vue
<template #actions>
  <el-button type="primary" @click="openCreate">
    <Icon icon="ep:plus" />新增
  </el-button>
  <el-button
    type="success"
    :disabled="selectedRows.length === 0"
    @click="batchSubmit"
  >
    <Icon icon="ep:upload" />提交申请
  </el-button>
  <el-button
    type="primary"
    :disabled="selectedRows.length === 0"
    @click="batchApprove"
  >
    <Icon icon="ep:check" />审核通过
  </el-button>
  <el-button
    type="warning"
    :disabled="selectedRows.length === 0"
    @click="batchReject"
  >
    <Icon icon="ep:close" />驳回
  </el-button>
</template>
```

操作列改为：

```vue
<el-table-column label="操作" fixed="right" width="220" align="center">
  <template #default="{ row }">
    <RowActions
      :row="row"
      :on-detail="(r: any) => openDetail(r.id)"
      :on-edit="row.status === 'DRAFT' ? (r: any) => openEdit(r.id) : null"
      :on-delete="row.status === 'DRAFT' ? onDelete : null"
    >
      <template #more>
        <el-dropdown-item
          v-if="row.status === 'DRAFT'"
          @click="submitOne(row)"
        >
          <Icon icon="ep:upload" class="mr-5px" />提交审核
        </el-dropdown-item>
      </template>
    </RowActions>
  </template>
</el-table-column>
```

> 如果原 page.vue 没有 `batchSubmit / batchApprove / batchReject / submitOne / openEdit / onDelete` 等函数，把这些按钮注释掉或映射到现有函数（看原文件实际有什么函数）。**不要新增业务逻辑函数**，只做结构改造。

- [ ] **Step 4: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。如有错误是因为引用了不存在的函数，回到 Step 3 调整。

- [ ] **Step 5: dev 验证**

```bash
npm run dev
```

打开浏览器 → 故障工单页面，对照参考图验收（查询区栅格、业务按钮颜色、操作列三件套+更多▾）。Ctrl+C 停止。

- [ ] **Step 6: 提交**

```bash
rm src/views/eam/failureWorkOrder/page.vue.bak
git add src/views/eam/failureWorkOrder/page.vue
git commit -m "refactor(failureWorkOrder): 迁移到新规范（4列查询+顶部业务按钮+三件套）"
```

---

## Task 14: 示范迁移 - 点巡检计划（spotInspectionPlan）

**Files:**
- Modify: `src/views/eam/spotInspectionPlan/page.vue`

- [ ] **Step 1: 备份**

```bash
cp src/views/eam/spotInspectionPlan/page.vue src/views/eam/spotInspectionPlan/page.vue.bak
```

- [ ] **Step 2: 改造**

参照 Task 12 的改造模式，把：
- 原 `<el-form :inline="true">` 查询区 → `<QueryForm :cols="4">` + `<QueryItem>`（每个原 form-item 对应一个 QueryItem）
- 原 `ContentWrap` 列表外层 → `<ListPage>`
- 原顶部"新增"按钮 → `<template #actions>`
- 原行内操作（详情/编辑/删除/启用/停用 等）→ `<RowActions>` + `#more` 槽收纳"启用/停用"

- [ ] **Step 3: 类型检查 + dev 验证**

```bash
npm run ts:check && npm run dev
```

打开浏览器对照参考图验收。Ctrl+C 停止。

- [ ] **Step 4: 提交**

```bash
rm src/views/eam/spotInspectionPlan/page.vue.bak
git add src/views/eam/spotInspectionPlan/page.vue
git commit -m "refactor(spotInspectionPlan): 迁移到新规范"
```

---

## Task 15: 示范迁移 - 供应商（supplier）

**Files:**
- Modify: `src/views/eam/supplier/page.vue`

- [ ] **Step 1: 备份**

```bash
cp src/views/eam/supplier/page.vue src/views/eam/supplier/page.vue.bak
```

- [ ] **Step 2: 改造（最简形态：只有详情/编辑/删除）**

参照 Task 12 改造结构：
- 查询区 → `<QueryForm :cols="4">` + `<QueryItem>`
- 列表 → `<ListPage>`
- 顶部 → `<template #actions>` 仅放"新增"按钮
- 操作列 → 仅 `<RowActions :on-detail :on-edit :on-delete>`，**不带 `#more` slot**（最小形态）

- [ ] **Step 3: 类型检查 + dev 验证**

```bash
npm run ts:check && npm run dev
```

验收：操作列宽 180，只有"详情 | 编辑 | 删除"三个按钮，删除点击后弹出二次确认。Ctrl+C 停止。

- [ ] **Step 4: 提交**

```bash
rm src/views/eam/supplier/page.vue.bak
git add src/views/eam/supplier/page.vue
git commit -m "refactor(supplier): 迁移到新规范（最简三件套形态）"
```

---

## Task 16: 示范迁移 - 保养工单（maintenanceWorkOrder）

**Files:**
- Modify: `src/views/eam/maintenanceWorkOrder/page.vue`

- [ ] **Step 1: 备份**

```bash
cp src/views/eam/maintenanceWorkOrder/page.vue src/views/eam/maintenanceWorkOrder/page.vue.bak
```

- [ ] **Step 2: 改造（参照故障工单 Task 13）**

保养工单与故障工单结构高度相似：多状态流转、批量操作。直接复制 Task 13 的模板结构，把字段/函数名对应替换。

- [ ] **Step 3: 类型检查 + dev 验证**

```bash
npm run ts:check && npm run dev
```

打开浏览器对照参考图验收。Ctrl+C 停止。

- [ ] **Step 4: 提交**

```bash
rm src/views/eam/maintenanceWorkOrder/page.vue.bak
git add src/views/eam/maintenanceWorkOrder/page.vue
git commit -m "refactor(maintenanceWorkOrder): 迁移到新规范"
```

---

## Task 17: 写迁移规范文档

**Files:**
- Create: `docs/UI改造规范.md`

- [ ] **Step 1: 写文档**

写入 `docs/UI改造规范.md`：

```markdown
# EAM UI 改造规范（团队迁移手册）

> 版本: 1.0 | 更新: 2026-04-29 | 适用：iimake-eam-console-rebuild

本规范基于设计稿 [`docs/superpowers/specs/2026-04-29-ui-restyle-design.md`](./superpowers/specs/2026-04-29-ui-restyle-design.md)，是后续 52 页迁移的对照手册。

---

## 1. 三个核心组件速查

### `<ListPage>` —— 列表页骨架
\`\`\`vue
<ListPage
  :loading :total
  v-model:page :limit
  @pagination="getList"
>
  <template #actions>
    <!-- 右上角：新增/批量* 业务按钮 -->
  </template>
  <!-- 表格 / 树+表格 主体 -->
</ListPage>
\`\`\`

### `<QueryForm>` + `<QueryItem>` —— 查询区
\`\`\`vue
<QueryForm :model="queryParams" :cols="4" @search="handleQuery" @reset="resetQuery">
  <QueryItem label="字段A" prop="a">
    <el-input v-model="queryParams.a" placeholder="请输入" />
  </QueryItem>
  <QueryItem label="日期" prop="date" :span="2">
    <el-date-picker v-model="queryParams.date" type="daterange" />
  </QueryItem>
</QueryForm>
\`\`\`

- 默认 `:cols="4"`，可设 2/3/6
- 字段 > `:collapseAfter="8"` 自动出现"展开/收起"
- 任一 input 回车自动触发 `@search`

### `<RowActions>` —— 行内操作列
\`\`\`vue
<el-table-column label="操作" fixed="right" width="180">
  <template #default="{ row }">
    <RowActions
      :row="row"
      :on-detail="(r) => openDetail(r.id)"
      :on-edit="(r) => openEdit(r.id)"
      :on-delete="onDelete"
    >
      <template #more>
        <el-dropdown-item @click="exportOne(row)">导出</el-dropdown-item>
      </template>
    </RowActions>
  </template>
</el-table-column>
\`\`\`

- 三件套位置固定：详情 | 编辑 | 删除 | 更多 ▾
- 任一传 `null` 则该按钮不渲染
- 删除按钮自动二次确认（不需业务页自己写）
- 操作列宽：仅三件套 180px，带"更多▾" 220px

---

## 2. 操作分发铁律

| 操作类型 | 单条记录 | 多选/全局 |
|---|---|---|
| 详情 / 编辑 / 删除 | **行内三件套** | 不允许批量删除 |
| 生成二维码 / 打印 | `#more` 槽 | 右上角 `#actions` |
| 提交审核 / 撤回 / 驳回 | `#more` 槽 | 右上角 `#actions` |
| 导出 / 下载 | `#more` 槽 | 右上角 `#actions` |
| 新增 | — | 右上角 `#actions` |

**业务按钮颜色映射**：
- 提交申请 → `type="success"` 绿
- 审核通过 → `type="primary"` 蓝
- 驳回 → `type="warning"` 橙
- 删除 → `type="danger"` 红
- 新增 → `type="primary"` 蓝

---

## 3. 视觉 Token 速查

| 用途 | CSS 变量 | 值 |
|---|---|---|
| 主色 | `--el-color-primary` | `#1677FF` |
| 侧栏渐变上 | `--eam-sider-bg-from` | `#1F2240` |
| 侧栏渐变下 | `--eam-sider-bg-to` | `#2A2F5C` |
| 内容区底色 | `--eam-bg-page` | `#F4F6FA` |
| 卡片底色 | `--eam-bg-card` | `#FFFFFF` |
| 卡片圆角 | `--eam-radius-card` | `12px` |
| 表头底色 | `--eam-table-header-bg` | `#F0F4FA` |
| 斑马底色 | `--eam-table-stripe-bg` | `#F7FAFE` |
| 行高 | `--eam-table-row-height` | `52px` |
| 详情按钮色 | `--eam-action-detail` | `#0EA5E9` |
| 编辑按钮色 | `--eam-action-edit` | `#1677FF` |
| 删除按钮色 | `--eam-action-delete` | `#EF4444` |

---

## 4. 迁移 Checklist（每页过一遍）

- [ ] 查询区改用 `<QueryForm :cols="4">` + `<QueryItem>`
- [ ] 列表外层用 `<ListPage>`，分页交给 `v-model:page` `v-model:limit`
- [ ] 顶部业务按钮全部放进 `<template #actions>`
- [ ] 行内操作列改用 `<RowActions>` + `#more` 槽
- [ ] 删除按钮的二次确认从业务页移除（组件已自动处理）
- [ ] 操作列宽：仅三件套 180px，带"更多▾" 220px
- [ ] 字段超过 8 个时享受自动折叠（无需额外配置）
- [ ] 移除原 `Pagination` 的 import（已被 ListPage 内置）
- [ ] `npm run ts:check` 0 errors
- [ ] 浏览器对照参考图验收（侧栏紫/查询区白卡/表格斑马/按钮位置/颜色）

---

## 5. 5 个示范页参考

照抄结构即可：
- `src/views/eam/deviceLedger/page.vue` —— 树+列表 + 单行扩展（生成二维码）
- `src/views/eam/failureWorkOrder/page.vue` —— 多状态流转 + 批量按钮
- `src/views/eam/spotInspectionPlan/page.vue` —— 标准列表
- `src/views/eam/supplier/page.vue` —— 最简档案表
- `src/views/eam/maintenanceWorkOrder/page.vue` —— 复用故障工单结构

---

## 6. 常见坑

- **`Pagination` 双重渲染**：迁移后忘删原 `<Pagination>` 标签 → ListPage 内置已渲染过
- **操作列文字按钮颜色不对**：检查 RowActions 类名是否被业务页 scoped 样式覆盖
- **查询区按钮挤在最末**：字段不足 4 个时搜索/重置会和最后一个字段同行 —— 这是正确行为
- **`@keyup.enter` 在 select 上不生效**：QueryForm 整体绑定 enter，select 不响应是正常的（用搜索按钮）
```

- [ ] **Step 2: 提交**

```bash
git add docs/UI改造规范.md
git commit -m "docs: 新增 UI 改造规范（团队迁移手册）"
```

---

## Task 18: 更新 PRD F004

**Files:**
- Modify: `docs/PRD.md`

- [ ] **Step 1: 编辑 PRD.md**

打开 `docs/PRD.md`，在功能总览表中追加一行：

```markdown
| F004 | UI 改造（紫侧栏+亮蓝主色+ListPage/QueryForm/RowActions 三组件 + 5 页示范） | 🟢 已完成 | [设计稿](./superpowers/specs/2026-04-29-ui-restyle-design.md) | 后续 52 页按 [迁移规范](./UI改造规范.md) 滚动迁移（P5） |
```

并在变更历史段追加：

```markdown
- 2026-04-29: F004 UI 改造完成（4 通用组件 + 5 示范页 + 改造规范）
```

- [ ] **Step 2: 提交**

```bash
git add docs/PRD.md
git commit -m "docs(PRD): 增补 F004 UI 改造（已完成）"
```

---

## Task 19: 终验

**Files:** 无（仅运行验收命令）

- [ ] **Step 1: 跑全部测试**

```bash
npx vitest run
```

Expected: 全部通过（含原有测试 + 新增 4 组件测试，至少 14 个）。

- [ ] **Step 2: 类型检查**

```bash
npm run ts:check
```

Expected: 0 errors。

- [ ] **Step 3: lint 检查**

```bash
npm run lint:eslint
```

Expected: 无 lint 错误（warning 可忽略）。

- [ ] **Step 4: 手工验收 - 启动 dev**

```bash
npm run dev
```

逐项打开 5 个示范页对照参考图：

| 页面 | URL（示意） | 重点 |
|---|---|---|
| 设备台账 | `/eam/deviceLedger` | 树+列表 / 多选批量 / 单行二维码 |
| 故障工单 | `/eam/failureWorkOrder` | 4 列查询 / 业务按钮 4 色 / 三件套+更多 |
| 点巡检计划 | `/eam/spotInspectionPlan` | 标准列表完整 |
| 供应商 | `/eam/supplier` | 仅三件套（最简形态）|
| 保养工单 | `/eam/maintenanceWorkOrder` | 复用故障工单结构 |

每页核对：
- [ ] 侧栏紫色渐变 + Logo "设备管理"
- [ ] 查询区白卡圆角 12 + 4 列栅格 + 搜索/重置右下角蓝按钮
- [ ] 表格表头浅蓝灰底 + 行高 52 + 斑马浅蓝
- [ ] 业务按钮在表格右上角（绿/蓝/橙/蓝）
- [ ] 操作列固定右侧 + 详情(青)/编辑(蓝)/删除(红)
- [ ] 删除二次确认弹窗
- [ ] 翻页 / 多选 / 列宽 / 详情弹窗等原有功能未坏

Ctrl+C 停止。

- [ ] **Step 5: 终结提交（如有遗漏修复）**

如发现问题，定位修复后：

```bash
git add -A
git commit -m "fix(ui-restyle): 终验修复 [具体内容]"
```

如无遗漏，本期任务完成 🎉。

---

## 完成标志

- ✅ 18 + 1 验收 = 19 个 task 全部 checkbox 勾完
- ✅ `npx vitest run` 全部通过
- ✅ `npm run ts:check` 0 errors
- ✅ 5 个示范页 UI 对照参考图通过
- ✅ `docs/UI改造规范.md` 已落地
- ✅ PRD F004 已更新为 🟢

后续 P5（剩余 52 页滚动迁移）按 `docs/UI改造规范.md` 排期执行，**不在本期范围**。
