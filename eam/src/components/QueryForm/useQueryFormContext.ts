import { inject } from 'vue'
import { QueryFormCtxKey, type QueryFormContext } from './types'

export function useQueryFormContext(): QueryFormContext | null {
  return inject(QueryFormCtxKey, null)
}
