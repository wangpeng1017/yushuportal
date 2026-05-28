<template>
  <div class="m-header">
    <div class="m-header-left" @click="onBack">
      <Icon v-if="showBack" icon="ep:arrow-left" :size="22" />
    </div>
    <div class="m-header-title">{{ title }}</div>
    <div class="m-header-right">
      <slot name="right" ></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'MobileHeader' })

interface Props {
  title: string
  showBack?: boolean
  backTo?: string
}
const props = withDefaults(defineProps<Props>(), {
  showBack: true,
  backTo: '',
})

const router = useRouter()
function onBack() {
  if (props.backTo) {
    router.push(props.backTo)
  } else {
    router.back()
  }
}
</script>

<style scoped>
.m-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 12px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}
.m-header-left {
  width: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.m-header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.m-header-right {
  width: 40px;
  text-align: right;
}
</style>
