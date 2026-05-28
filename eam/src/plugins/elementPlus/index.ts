import type { App } from 'vue'
// 需要全局引入一些组件，如ElScrollbar，不然一些下拉项样式有问题
import { ElLoading, ElScrollbar, ElButton } from 'element-plus'

const plugins = [ElLoading]

const components = [ElScrollbar, ElButton]

export const setupElementPlus = (app: App<Element>) => {
  plugins.forEach((plugin) => {
    app.use(plugin)
  })

  components.forEach((component) => {
    app.component(component.name, component)
  })
  
  // 设置 Vben Admin 风格主题色
  if (typeof document !== 'undefined') {
    const root = document.documentElement
    
    // Vben 主色 - 蓝色系
    root.style.setProperty('--el-color-primary', '#0960bd')
    root.style.setProperty('--el-color-primary-light-3', '#409eff')
    root.style.setProperty('--el-color-primary-light-5', '#79bbff')
    root.style.setProperty('--el-color-primary-light-7', '#b3d8ff')
    root.style.setProperty('--el-color-primary-light-8', '#d9ecff')
    root.style.setProperty('--el-color-primary-light-9', '#ecf5ff')
    root.style.setProperty('--el-color-primary-dark-2', '#0748a3')
    
    // 成功色
    root.style.setProperty('--el-color-success', '#52c41a')
    root.style.setProperty('--el-color-success-light-3', '#7dd63d')
    root.style.setProperty('--el-color-success-light-5', '#a3e261')
    root.style.setProperty('--el-color-success-light-7', '#c8ed84')
    root.style.setProperty('--el-color-success-light-8', '#ddf4b8')
    root.style.setProperty('--el-color-success-light-9', '#f0faeb')
    
    // 警告色
    root.style.setProperty('--el-color-warning', '#faad14')
    root.style.setProperty('--el-color-warning-light-3', '#ffc043')
    root.style.setProperty('--el-color-warning-light-5', '#ffd372')
    root.style.setProperty('--el-color-warning-light-7', '#ffe6a1')
    root.style.setProperty('--el-color-warning-light-8', '#fff0c7')
    root.style.setProperty('--el-color-warning-light-9', '#fff9ed')
    
    // 危险色
    root.style.setProperty('--el-color-danger', '#ff4d4f')
    root.style.setProperty('--el-color-danger-light-3', '#ff7577')
    root.style.setProperty('--el-color-danger-light-5', '#ff9c9e')
    root.style.setProperty('--el-color-danger-light-7', '#ffc4c5')
    root.style.setProperty('--el-color-danger-light-8', '#ffdcdc')
    root.style.setProperty('--el-color-danger-light-9', '#fff1f0')
    
    // 信息色
    root.style.setProperty('--el-color-info', '#909399')
    root.style.setProperty('--el-color-info-light-3', '#a6a9ad')
    root.style.setProperty('--el-color-info-light-5', '#bcbec1')
    root.style.setProperty('--el-color-info-light-7', '#d2d3d5')
    root.style.setProperty('--el-color-info-light-8', '#e1e2e3')
    root.style.setProperty('--el-color-info-light-9', '#f4f4f5')
    
    // Vben 边框圆角 - 扫平风格
    root.style.setProperty('--el-border-radius-base', '2px')
    root.style.setProperty('--el-border-radius-small', '2px')
    root.style.setProperty('--el-border-radius-round', '16px')
    root.style.setProperty('--el-border-radius-circle', '100%')
    
    // Vben 边框颜色
    root.style.setProperty('--el-border-color', '#e5e7eb')
    root.style.setProperty('--el-border-color-light', '#f0f0f0')
    root.style.setProperty('--el-border-color-lighter', '#f5f5f5')
    root.style.setProperty('--el-border-color-extra-light', '#fafafa')
    
    // Vben 文本颜色
    root.style.setProperty('--el-text-color-primary', 'rgba(0, 0, 0, 0.85)')
    root.style.setProperty('--el-text-color-regular', 'rgba(0, 0, 0, 0.65)')
    root.style.setProperty('--el-text-color-secondary', 'rgba(0, 0, 0, 0.45)')
    root.style.setProperty('--el-text-color-placeholder', 'rgba(0, 0, 0, 0.25)')
  }
}
