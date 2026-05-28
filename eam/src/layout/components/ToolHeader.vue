<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Message } from '@/layout/components//Message'
import { Collapse } from '@/layout/components/Collapse'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import RouterSearch from '@/components/RouterSearch/index.vue'
import TenantVisit from '@/layout/components/TenantVisit/index.vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'
import { checkPermi } from '@/utils/permission'

const { getPrefixCls, variables } = useDesign()

const prefixCls = getPrefixCls('tool-header')

const appStore = useAppStore()

// 面包屑
const breadcrumb = computed(() => appStore.getBreadcrumb)

// 折叠图标
const hamburger = computed(() => appStore.getHamburger)

// 全屏图标
const screenfull = computed(() => appStore.getScreenfull)

// 搜索图片
const search = computed(() => appStore.search)

// 尺寸图标
const size = computed(() => appStore.getSize)

// 布局
const layout = computed(() => appStore.getLayout)

// 多语言图标
const locale = computed(() => appStore.getLocale)

// 消息图标
const message = computed(() => appStore.getMessage)

// 租户切换权限
const hasTenantVisitPermission = computed(
  () => import.meta.env.VITE_APP_TENANT_ENABLE === 'true' && checkPermi(['system:tenant:visit'])
)

export default defineComponent({
  name: 'ToolHeader',
  setup() {
    return () => (
      <div
        id={`${variables.namespace}-tool-header`}
        class={[
          prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {layout.value !== 'top' ? (
          <div class="h-full flex items-center">
            {hamburger.value && layout.value !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="#3B3F48"></Collapse>
            ) : undefined}
            {breadcrumb.value ? <Breadcrumb class="lt-md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {/* UniTree 顶栏只保留三件套：通知 / 全屏 / 用户。隐藏租户切换/搜索/尺寸/翻译 */}
          {/* {hasTenantVisitPermission.value ? <TenantVisit /> : undefined} */}
          {message.value ? (
            <Message class="custom-hover" color="#3B3F48"></Message>
          ) : undefined}
          {screenfull.value ? (
            <Screenfull class="custom-hover" color="#3B3F48"></Screenfull>
          ) : undefined}
          {/* {search.value ? <RouterSearch isModal={false} color="#3B3F48" /> : undefined} */}
          {/* {size.value ? (
            <SizeDropdown class="custom-hover" color="#3B3F48"></SizeDropdown>
          ) : undefined} */}
          {/* {locale.value ? (
            <LocaleDropdown
              class="custom-hover"
              color="#3B3F48"
            ></LocaleDropdown>
          ) : undefined} */}
          <UserInfo></UserInfo>
          <a href="http://8.130.182.148:3011/index" class="back-portal-btn" title="返回宇树MOM一体化平台首页">
            <span class="back-arrow">←</span> 返回门户
          </a>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
  background-color: var(--top-header-bg-color);
  box-shadow: none;
  color: var(--top-header-text-color);
  font-size: 14px;
  line-height: 24px;

  :deep(.custom-hover) {
    width: 36px;
    height: 36px;
    border-radius: 4px;
    margin: 0 4px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    color: var(--top-header-text-color);

    &:hover {
      background-color: var(--top-header-hover-color);
    }
  }

  :deep(.back-portal-btn) {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 30px;
    padding: 0 12px;
    margin-right: 10px;
    font-size: 13px;
    color: var(--top-header-text-color, #3B3F48);
    background: rgba(105, 177, 255, 0.08);
    border: 1px solid rgba(105, 177, 255, 0.45);
    border-radius: 4px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;

    &:hover {
      background: rgba(105, 177, 255, 0.18);
      border-color: #1890ff;
      color: #1890ff;
    }

    .back-arrow {
      font-weight: 600;
    }
  }
}
</style>
