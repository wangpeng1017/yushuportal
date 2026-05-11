// 引入unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入 form-create
import { setupFormCreate } from '@/plugins/formCreate'

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

// 路由
import router, { setupRouter } from '@/router'

// 指令
import { setupAuth, setupMountedFocus } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import '@/plugins/tongji' // 百度统计
import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患

import print from 'vue3-print-nb' // 打印插件

import VxeUIBase, { VxeUI } from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUIPluginRenderElement from '@vxe-ui/plugin-render-element'
import '@vxe-ui/plugin-render-element/dist/style.css'

import { ElInput, ElInputNumber, ElSelect, ElCascader, ElDatePicker, ElTimeSelect } from 'element-plus'
  // ...
VxeUIPluginRenderElement.component(ElInput)
VxeUIPluginRenderElement.component(ElInputNumber)
VxeUIPluginRenderElement.component(ElSelect)
VxeUIPluginRenderElement.component(ElCascader)
VxeUIPluginRenderElement.component(ElDatePicker)
VxeUIPluginRenderElement.component(ElTimeSelect)
// ...

VxeUI.use(VxeUIPluginRenderElement)

// Mock 模式：清掉历史 theme/layout 缓存，确保新设计生效
if (import.meta.env.VITE_MOCK_MODE === 'true') {
  try {
    localStorage.removeItem('theme')
    localStorage.removeItem('layout')
    localStorage.removeItem('isDark')
    localStorage.removeItem('fixedMenu')
  } catch {}
}

// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  setupElementPlus(app)

  setupFormCreate(app)

  setupRouter(app)

  // directives 指令
  setupAuth(app)
  setupMountedFocus(app)

  try {
    await Promise.race([
      router.isReady(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('router.isReady timeout')), 8000))
    ])
  } catch (e) {
    console.error('[BOOT]', e)
    // 即使路由没 ready 也强制 mount，让用户看到错误
  }

  app.use(VueDOMPurifyHTML)

  // 打印
  app.use(print)

  app.use(VxeUIBase)
  
  app.use(VxeUITable)

  app.mount('#app')
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
