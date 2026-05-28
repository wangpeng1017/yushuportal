<script lang="tsx">
import { PropType } from 'vue'
import { ElMenu, ElScrollbar } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import { usePermissionStore } from '@/store/modules/permission'
import { useRenderMenuItem } from './components/useRenderMenuItem'
import { isUrl } from '@/utils/is'
import { useDesign } from '@/hooks/web/useDesign'
import { LayoutType } from '@/types/layout'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('menu')

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Menu',
  props: {
    menuSelect: {
      type: Function as PropType<(index: string) => void>,
      default: undefined
    }
  },
  setup(props) {
    const appStore = useAppStore()

    const layout = computed(() => appStore.getLayout)

    const { push, currentRoute } = useRouter()

    const permissionStore = usePermissionStore()

    const menuMode = computed((): 'vertical' | 'horizontal' => {
      // 竖
      const vertical: LayoutType[] = ['classic', 'topLeft', 'cutMenu']

      if (vertical.includes(unref(layout))) {
        return 'vertical'
      } else {
        return 'horizontal'
      }
    })

    const routers = computed(() =>
      unref(layout) === 'cutMenu' ? permissionStore.getMenuTabRouters : permissionStore.getRouters
    )

    const collapse = computed(() => appStore.getCollapse)

    const uniqueOpened = computed(() => appStore.getUniqueOpened)

    const activeMenu = computed(() => {
      const { meta, path } = unref(currentRoute)
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu as string
      }
      return path
    })

    const menuSelect = (index: string) => {
      if (props.menuSelect) {
        props.menuSelect(index)
      }
      // 自定义事件
      if (isUrl(index)) {
        window.open(index)
      } else {
        push(index)
      }
    }

    const renderMenuWrap = () => {
      if (unref(layout) === 'top') {
        return renderMenu()
      } else {
        return <div className="overflow-auto h-full ">{renderMenu()}</div>
      }
    }

    const renderMenu = () => {
      return (
        <ElMenu
          defaultActive={unref(activeMenu)}
          mode={unref(menuMode)}
          collapse={
            unref(layout) === 'top' || unref(layout) === 'cutMenu' ? false : unref(collapse)
          }
          uniqueOpened={unref(layout) === 'top' ? false : unref(uniqueOpened)}
          backgroundColor="var(--left-menu-bg-color)"
          textColor="var(--left-menu-text-color)"
          activeTextColor="var(--left-menu-text-active-color)"
          popperClass={
            unref(menuMode) === 'vertical'
              ? `${prefixCls}-popper--vertical`
              : `${prefixCls}-popper--horizontal`
          }
          onSelect={menuSelect}
        >
          {{
            default: () => {
              const { renderMenuItem } = useRenderMenuItem(unref(menuMode))
              return renderMenuItem(unref(routers))
            }
          }}
        </ElMenu>
      )
    }

    return () => (
      <div
        id={prefixCls}
        class={[
          `${prefixCls} ${prefixCls}__${unref(menuMode)}`,
          'h-[100%] overflow-hidden flex-col bg-[var(--left-menu-bg-color)]',
          {
            'w-[var(--left-menu-min-width)]': unref(collapse) && unref(layout) !== 'cutMenu',
            'w-[var(--left-menu-max-width)]': !unref(collapse) && unref(layout) !== 'cutMenu'
          }
        ]}
      >
        {renderMenuWrap()}
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-menu;

.#{$prefix-cls} {
  position: relative;
  transition: width var(--transition-time-02);

  :deep(.#{$elNamespace}-menu) {
    width: 100% !important;
    border-right: none;
    background-color: var(--left-menu-bg-color) !important;

    // 设置选中时子标题的颜色
    .is-active {
      & > .#{$elNamespace}-sub-menu__title {
        color: var(--left-menu-text-active-color) !important;
      }
    }

    // 菜单项基础样式 - 规范无圆角无外间距
    .#{$elNamespace}-sub-menu__title,
    .#{$elNamespace}-menu-item {
      border-radius: 0;
      margin: 0;
      height: 48px;
      line-height: 24px;
      font-size: 14px;
      padding: 12px 16px !important;
      color: var(--left-menu-text-color);

      .el-icon,
      svg {
        color: var(--left-menu-text-color);
        width: 20px;
        height: 20px;
        margin-right: 8px;
      }

      &:hover {
        color: #E0E0E0 !important;
        background-color: transparent !important;

        .el-icon,
        svg {
          color: #E0E0E0;
        }
      }
    }

    // 选中态 - 规范白色文字 + 左侧 3px 白条
    .#{$elNamespace}-menu-item.is-active {
      color: #FFFFFF !important;
      background-color: var(--left-menu-bg-active-color) !important;
      border-left: 3px solid #FFFFFF;
      padding-left: 13px !important;
      box-shadow: none;
      position: relative;

      &::before {
        content: none;
      }

      &:hover {
        background-color: var(--left-menu-bg-active-color) !important;
      }

      .el-icon,
      svg {
        color: #FFFFFF !important;
      }
    }

    // 子菜单背景色（与父级一致）
    .#{$elNamespace}-menu {
      background-color: var(--left-menu-bg-color) !important;

      .#{$elNamespace}-sub-menu__title,
      .#{$elNamespace}-menu-item:not(.is-active) {
        background-color: transparent !important;
      }
    }

    // 二级菜单缩进（一级 16px + 缩进 24px = 40px）
    .#{$elNamespace}-sub-menu .#{$elNamespace}-menu-item {
      padding-left: 40px !important;
      background-color: rgba(0, 0, 0, 0.18) !important;

      &.is-active {
        padding-left: 37px !important; // 40 - 3 (border-left)
      }
    }

    // 三级菜单（如果有）缩进（40 + 20 = 60px）
    .#{$elNamespace}-sub-menu .#{$elNamespace}-sub-menu .#{$elNamespace}-menu-item {
      padding-left: 60px !important;

      &.is-active {
        padding-left: 57px !important;
      }
    }
  }

  // 折叠时的最小宽度
  :deep(.#{$elNamespace}-menu--collapse) {
    width: var(--left-menu-min-width);

    & > .is-active,
    & > .is-active > .#{$elNamespace}-sub-menu__title {
      position: relative;
      background-color: var(--left-menu-bg-active-color) !important;
      color: #FFFFFF !important;
      border-left: 3px solid #FFFFFF;
      box-shadow: none;
      border-radius: 0;

      &::before {
        content: none;
      }
    }
  }

  // 折叠动画的时候，就需要把文字给隐藏掉
  :deep(.horizontal-collapse-transition) {
    // transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out !important;
    .#{$prefix-cls}__title {
      display: none;
    }
  }

  // 垂直菜单
  &__vertical {
    :deep(.#{$elNamespace}-menu--vertical) {
      &:not(.#{$elNamespace}-menu--collapse) .#{$elNamespace}-sub-menu__title,
      .#{$elNamespace}-menu-item {
        padding-right: 0;
      }
    }
  }

  // 水平菜单
  &__horizontal {
    height: calc(var(--top-tool-height)) !important;

    :deep(.#{$elNamespace}-menu--horizontal) {
      height: calc(var(--top-tool-height));
      border-bottom: none;
      // 重新设置底部高亮颜色
      & > .#{$elNamespace}-sub-menu.is-active {
        .#{$elNamespace}-sub-menu__title {
          border-bottom-color: var(--el-color-primary) !important;
        }
      }

      .#{$elNamespace}-menu-item.is-active {
        position: relative;

        &::after {
          display: none !important;
        }
      }

      .#{$prefix-cls}__title {
        /* stylelint-disable-next-line */
        max-height: calc(var(--top-tool-height) - 2px) !important;
        /* stylelint-disable-next-line */
        line-height: calc(var(--top-tool-height) - 2px);
      }
    }
  }
}
</style>

<style lang="scss">
$prefix-cls: #{$namespace}-menu-popper;

.#{$prefix-cls}--vertical,
.#{$prefix-cls}--horizontal {
  // 设置选中时子标题的颜色
  .is-active {
    & > .el-sub-menu__title {
      color: var(--left-menu-text-active-color) !important;
    }
  }

  // 弹出菜单悬停（折叠状态）
  .el-sub-menu__title,
  .el-menu-item {
    border-radius: 0;
    margin: 0;
    font-size: 14px;
    line-height: 24px;
    padding: 12px 16px !important;

    &:hover {
      color: #E0E0E0 !important;
      background-color: transparent !important;
    }
  }

  .el-menu-item.is-active {
    position: relative;
    background-color: var(--left-menu-bg-active-color) !important;
    color: #FFFFFF !important;
    border-left: 3px solid #FFFFFF;
    padding-left: 13px !important;

    &::before {
      content: none;
    }

    &:hover {
      background-color: var(--left-menu-bg-active-color) !important;
    }
  }
}
</style>
