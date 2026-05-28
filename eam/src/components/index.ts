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
