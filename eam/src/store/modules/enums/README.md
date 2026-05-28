# 枚举 Store 模块化架构

## 📁 目录结构

```
src/store/modules/enums/
├── index.ts              # 统一导出入口
├── inventoryEnums.ts     # 库存模块枚举
├── inboundEnums.ts       # 入库模块枚举
├── mdmEnums.ts           # 主数据模块枚举
├── outboundEnums.ts      # 出库模块枚举（待添加）
└── README.md             # 本文档
```

## 🎯 设计原则

### 1. 按业务模块拆分
- ✅ 每个业务模块独立管理自己的枚举
- ✅ 避免单个文件过大，便于维护
- ✅ 职责清晰，易于扩展

### 2. 按需加载
- ✅ 只加载当前页面需要的枚举
- ✅ 避免一次性加载所有枚举导致性能问题
- ✅ 使用 `loadedEnums` Set 避免重复加载

### 3. 独立缓存
- ✅ 每个枚举独立缓存（5分钟过期）
- ✅ 缓存 key 格式：`enum_{module}_{enumName}`
- ✅ 支持单独清除某个模块的缓存

## 📖 使用指南

### 基本使用

```typescript
// 1. 导入对应模块的 store
import { useInventoryEnumStore } from '@/store/modules/enums'

// 2. 在组件中使用
const inventoryEnumStore = useInventoryEnumStore()

// 3. 加载枚举（通常在 onMounted 中）
onMounted(async () => {
  await inventoryEnumStore.loadInventoryStatus()
})

// 4. 使用枚举数据
// 获取列表
const statusList = inventoryEnumStore.getInventoryStatusList

// 获取文本
const statusText = inventoryEnumStore.getInventoryStatusText('NORMAL')

// 获取标签类型
const statusType = inventoryEnumStore.getInventoryStatusType('NORMAL')
```

### 在模板中使用

```vue
<template>
  <!-- 下拉选择 -->
  <el-select v-model="formData.status">
    <el-option
      v-for="status in inventoryEnumStore.getInventoryStatusList"
      :key="status.value"
      :label="status.text"
      :value="status.value" />
  </el-select>
  
  <!-- 显示标签 -->
  <el-tag :type="inventoryEnumStore.getInventoryStatusType(row.status)">
    {{ inventoryEnumStore.getInventoryStatusText(row.status) }}
  </el-tag>
</template>
```

## 🔧 添加新的枚举模块

### 步骤1: 创建模块文件

```typescript
// src/store/modules/enums/outboundEnums.ts
import { defineStore } from 'pinia'
import { store } from '../../index'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
const { wsCache } = useCache('sessionStorage')

import * as OutboundApi from '@/api/outbound'

export interface EnumEntity {
  value: string
  desc?: string
  text: string
}

export interface OutboundEnumState {
  // 出库单状态
  outboundOrderStatus: EnumEntity[]
  
  // 记录已加载的枚举
  loadedEnums: Set<string>
}

export const useOutboundEnumStore = defineStore('outboundEnum', {
  state: (): OutboundEnumState => ({
    outboundOrderStatus: [],
    loadedEnums: new Set<string>()
  }),
  
  getters: {
    getOutboundOrderStatusList(): EnumEntity[] {
      return this.outboundOrderStatus
    },
    
    getOutboundOrderStatusText(): (value: string) => string {
      return (value: string) => {
        const item = this.outboundOrderStatus.find(e => e.value === value)
        return item?.text || value
      }
    }
  },
  
  actions: {
    async loadOutboundOrderStatus() {
      if (this.loadedEnums.has('outboundOrderStatus')) {
        return
      }
      
      const cacheKey = 'enum_outbound_orderStatus'
      const cached = wsCache.get(cacheKey)
      if (cached) {
        this.outboundOrderStatus = cached
        this.loadedEnums.add('outboundOrderStatus')
        return
      }
      
      try {
        const data = await OutboundApi.listOfOutboundOrderStatus()
        this.outboundOrderStatus = data || []
        this.loadedEnums.add('outboundOrderStatus')
        wsCache.set(cacheKey, data, { exp: 300 })
      } catch (error) {
        console.error('加载出库单状态枚举失败:', error)
      }
    },
    
    resetEnums() {
      wsCache.delete('enum_outbound_orderStatus')
      this.outboundOrderStatus = []
      this.loadedEnums.clear()
    }
  }
})

export const useOutboundEnumStoreWithOut = () => {
  return useOutboundEnumStore(store)
}
```

### 步骤2: 在 index.ts 中导出

```typescript
// src/store/modules/enums/index.ts
export { useOutboundEnumStore, useOutboundEnumStoreWithOut } from './outboundEnums'
export type { OutboundEnumState } from './outboundEnums'
```

### 步骤3: 在页面中使用

```typescript
import { useOutboundEnumStore } from '@/store/modules/enums'

const outboundEnumStore = useOutboundEnumStore()
await outboundEnumStore.loadOutboundOrderStatus()
```

## 📊 各模块说明

### inventoryEnums.ts - 库存模块
- `inventoryStatus`: 库存状态（正常、冻结、质检中）

### inboundEnums.ts - 入库模块
- `putOnTaskStatus`: 上架任务状态
- `putOnTaskType`: 上架任务类型
- `putOnTaskExecuteStatus`: 上架任务执行状态

### mdmEnums.ts - 主数据模块
- `packageUnitType`: 包装单位类型

## 🚀 性能优化

### 1. 按需加载
```typescript
// ❌ 不推荐：一次性加载所有枚举
await loadAllEnums() // 可能有几十个接口

// ✅ 推荐：只加载需要的枚举
await inventoryEnumStore.loadInventoryStatus() // 只有1个接口
```

### 2. 避免重复加载
```typescript
// 第一次调用：发起请求
await inventoryEnumStore.loadInventoryStatus()

// 第二次调用：直接返回（已加载）
await inventoryEnumStore.loadInventoryStatus()
```

### 3. 缓存机制
```typescript
// 第一次访问：从后端加载
await inventoryEnumStore.loadInventoryStatus()

// 5分钟内再次访问：从缓存读取
await inventoryEnumStore.loadInventoryStatus()
```

## 🔄 迁移指南

### 从旧的 enum.ts 迁移

**之前：**
```typescript
import { useEnumStore } from '@/store/modules/enum'

const enumStore = useEnumStore()
await enumStore.loadInventoryStatusEnum()
const list = enumStore.getInventoryStatusList
```

**现在：**
```typescript
import { useInventoryEnumStore } from '@/store/modules/enums'

const inventoryEnumStore = useInventoryEnumStore()
await inventoryEnumStore.loadInventoryStatus()
const list = inventoryEnumStore.getInventoryStatusList
```

## 🌐 语言切换支持

### 自动清除缓存

当用户切换语言时，系统会自动清除所有枚举缓存，确保枚举文本使用新语言。

**实现原理：**

```typescript
// locale.ts - 语言切换时自动清除枚举缓存
import { clearAllEnumCaches } from './enums'

setCurrentLocale(localeMap: LocaleDropdownType) {
  this.currentLocale.lang = localeMap?.lang
  wsCache.set(CACHE_KEY.LANG, localeMap?.lang)
  
  // 清除所有枚举缓存
  clearAllEnumCaches()
}
```

### 手动清除缓存

如果需要手动清除所有枚举缓存：

```typescript
import { clearAllEnumCaches } from '@/store/modules/enums'

// 清除所有枚举缓存
clearAllEnumCaches()
```

### 清除单个模块缓存

如果只需要清除某个模块的缓存：

```typescript
import { useInventoryEnumStore } from '@/store/modules/enums'

const inventoryEnumStore = useInventoryEnumStore()
inventoryEnumStore.resetEnums()
```

### 语言切换流程

```
用户切换语言
    ↓
locale.setCurrentLocale()
    ↓
clearAllEnumCaches()
    ↓
清除所有模块的枚举缓存
    ↓
清除 sessionStorage 中的缓存
    ↓
重置 loadedEnums 标记
    ↓
下次访问页面时重新加载（使用新语言）
```

## 📝 命名规范

### Store 命名
- 格式：`use{Module}EnumStore`
- 示例：`useInventoryEnumStore`, `useInboundEnumStore`

### 方法命名
- 加载方法：`load{EnumName}` (如 `loadInventoryStatus`)
- Getter 列表：`get{EnumName}List` (如 `getInventoryStatusList`)
- Getter 文本：`get{EnumName}Text` (如 `getInventoryStatusText`)

### 缓存 Key 命名
- 格式：`enum_{module}_{enumName}`
- 示例：`enum_inventory_status`, `enum_inbound_putOnTask`

## ⚠️ 注意事项

1. **不要在 store 之间相互依赖**
   - 每个模块的 store 应该独立
   - 如果需要跨模块使用枚举，在页面中分别导入

2. **缓存过期时间**
   - 默认 5 分钟（300秒）
   - 可根据实际需求调整

3. **错误处理**
   - 所有加载方法都有 try-catch
   - 加载失败不会影响页面其他功能

4. **清除缓存**
   - 使用 `resetEnums()` 清除当前模块缓存
   - 语言切换时会自动清除所有缓存

5. **语言切换**
   - 切换语言后，枚举缓存会自动清除
   - 下次访问页面时会重新加载枚举（使用新语言）
   - 无需手动处理

6. **添加新模块**
   - 创建新的枚举模块文件
   - 在 `enums/index.ts` 中导出
   - 在 `clearAllEnumCaches()` 中添加清除逻辑

## 🎉 优势总结

✅ **模块化**：按业务模块拆分，职责清晰
✅ **可维护**：单个文件不会过大，易于维护
✅ **高性能**：按需加载 + 缓存机制
✅ **易扩展**：添加新模块非常简单
✅ **类型安全**：完整的 TypeScript 类型定义
