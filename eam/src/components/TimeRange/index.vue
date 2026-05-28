<template>
  <el-date-picker
    v-model="timeRange"
    :end-placeholder="t('common.endTimeText')"
    :shortcuts="finalShortcuts"
    :start-placeholder="t('common.startTimeText')"
    range-separator="-"
    type="datetimerange"
    v-bind="$attrs"
  />
</template>
<script lang="ts" setup>
import { isEmpty } from 'lodash-es'

const timeRange = defineModel<string[]>()

const { t } = useI18n()

interface PropsType {
  shortcuts?: Array<{
    text: string
    value: () => Date[]
  }>
}

const props = withDefaults(defineProps<PropsType>(), {
  shortcuts: () => []
})

const defaultShortcuts = [
  {
    text: t('outbound.dateShortcuts.today'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.yesterday'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      start.setHours(0, 0, 0, 0)
      end.setTime(end.getTime() - 3600 * 1000 * 24)
      end.setHours(23, 59, 59, 999)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.last7Days'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.last15Days'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 15)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.last30Days'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.last3Months'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  },
  {
    text: t('outbound.dateShortcuts.currentMonth'),
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(1)
      start.setHours(0, 0, 0, 0)
      return [start, end]
    }
  }
]

// 快捷选项和默认选项
const finalShortcuts = computed(() => {
  return isEmpty(props.shortcuts) ? defaultShortcuts : props.shortcuts
})
</script>
<style lang="scss" scoped></style>
