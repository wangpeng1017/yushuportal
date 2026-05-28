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
  <div>
    <router-link
      :class="[
        prefixCls,
        layout !== 'classic' ? `${prefixCls}__Top` : '',
        'flex items-center cursor-pointer relative decoration-none overflow-hidden'
      ]"
      :style="{
        height: 'var(--logo-height)',
        padding: '0 16px',
        gap: '10px',
        justifyContent: 'center'
      }"
      to="/"
    >
      <!-- UniTree Logo（对齐 WMS：图 52px + 副标题 12px/700/白） -->
      <div
        v-if="show"
        class="flex flex-col items-center justify-center leading-tight whitespace-nowrap"
      >
        <img
          src="@/assets/imgs/unitree-logo.png"
          alt="UNITREE"
          :style="{
            height: '52px',
            width: '112px',
            objectFit: 'contain',
            display: 'block',
            filter: layout === 'classic' ? 'none' : 'invert(1) brightness(0)'
          }"
        />
        <div
          :class="{
            'text-white': layout === 'classic',
            'text-[var(--top-header-text-color)]':
              layout === 'topLeft' || layout === 'top' || layout === 'cutMenu'
          }"
          :style="{
            marginTop: '8px',
            fontSize: '16px',
            fontWeight: 700,
            letterSpacing: '1px',
            lineHeight: 1
          }"
        >
          设备管理系统
        </div>
      </div>
    </router-link>
  </div>
</template>
