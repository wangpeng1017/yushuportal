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
  registerItem: (id: symbol) => number
  unregisterItem: (id: symbol) => void
  triggerSearch: () => void
}

export const QueryFormCtxKey: InjectionKey<QueryFormContext> = Symbol('QueryFormContext')
