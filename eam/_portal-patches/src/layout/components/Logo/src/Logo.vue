<script lang="ts" setup>
import { computed, onMounted, ref, unref, watch } from 'vue'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({ name: 'Logo' })

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('logo')

const appStore = useAppStore()

const show = ref(true)

const title = computed(() => appStore.getTitle)

const layout = computed(() => appStore.getLayout)

const collapse = computed(() => appStore.getCollapse)

onMounted(() => {
  if (unref(collapse)) show.value = false
})

watch(
  () => collapse.value,
  (collapse: boolean) => {
    if (unref(layout) === 'topLeft' || unref(layout) === 'cutMenu') {
      show.value = true
      return
    }
    if (!collapse) {
      setTimeout(() => {
        show.value = !collapse
      }, 400)
    } else {
      show.value = !collapse
    }
  }
)

watch(
  () => layout.value,
  (layout) => {
    if (layout === 'top' || layout === 'cutMenu') {
      show.value = true
    } else {
      if (unref(collapse)) {
        show.value = false
      } else {
        show.value = true
      }
    }
  }
)
</script>

<template>
  <div class="unitree-logo-wrap">
    <router-link :class="[prefixCls, 'unitree-logo']" to="/">
      <img class="unitree-icon" src="@/assets/imgs/unitree-logo.png" alt="UNITREE" />
      <div v-if="show" class="unitree-title">一体化平台</div>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.unitree-logo-wrap {
  background: #3B3F48;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  width: 100%;
  overflow: hidden;
}

.unitree-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: var(--logo-height);
  padding: 12px 8px;
  text-decoration: none;
  cursor: pointer;
  gap: 6px;
  white-space: nowrap;
}

.unitree-icon {
  height: 52px;
  width: 112px; /* 对齐 WMS 实际显示尺寸 112×52，否则按原图比例会撑到 231px 超出 220 侧栏 */
  flex-shrink: 0;
  display: block;
  object-fit: contain;
}

.unitree-title {
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 1px;
  line-height: 1;
  white-space: nowrap;
  margin-top: 8px;
}
</style>
