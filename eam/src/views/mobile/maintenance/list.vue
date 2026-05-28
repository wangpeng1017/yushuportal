<template>
  <div class="m-list">
    <MobileHeader :title="title" :back-to="backTo" />

    <div class="m-toolbar">
      <span class="m-toolbar-info">设备 {{ equipmentSn }}（共 {{ total }} 单）</span>
      <el-switch v-model="showAll" active-text="显示全部" inactive-text="仅未完成" @change="reload" />
    </div>

    <div class="m-body">
      <div v-if="loading && list.length === 0" class="m-loading">加载中...</div>

      <div v-else-if="list.length === 0" class="m-empty">
        <Icon icon="ep:document-remove" :size="64" color="#c0c4cc" />
        <div class="m-empty-text">该设备暂无{{ title }}</div>
        <el-button v-if="canCreate" type="primary" @click="onCreate">+ 新建{{ title }}</el-button>
      </div>

      <template v-else>
        <WorkOrderCard v-for="o in list" :key="o.id" :order="o" @click="onOrderClick(o)" />
        <div v-if="!loading && list.length < total" class="m-loadmore" @click="loadMore">点击加载更多</div>
      </template>
    </div>

    <div v-if="canCreate && list.length > 0" class="m-fab">
      <el-button type="primary" round @click="onCreate">
        <Icon icon="ep:plus" />新建{{ title }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getMaintenanceListBySn, type MobileWorkOrderVo } from '@/api/mobile/workorder'
import MobileHeader from '../components/MobileHeader.vue'
import WorkOrderCard from '../components/WorkOrderCard.vue'

defineOptions({ name: 'MobileMaintenanceList' })

const route = useRoute()
const title = '保养工单'
const equipmentSn = route.query.equipmentSn as string
const backTo = `/m/equipment/${equipmentSn}`
const canCreate = true

const list = ref<MobileWorkOrderVo[]>([])
const total = ref(0)
const loading = ref(false)
const showAll = ref(false)
const pageNo = ref(1)
const pageSize = 20

async function loadPage(reset = false) {
  if (reset) { pageNo.value = 1; list.value = [] }
  loading.value = true
  try {
    const res: any = await getMaintenanceListBySn({
      equipmentSn, showAll: showAll.value ? 1 : 0,
      pageNo: pageNo.value, pageSize,
    })
    list.value = pageNo.value === 1 ? (res.records || []) : [...list.value, ...(res.records || [])]
    total.value = res.total || 0
  } catch (e: any) { ElMessage.error(e?.msg || '加载失败') }
  finally { loading.value = false }
}

const reload = () => loadPage(true)
const loadMore = () => { pageNo.value++; loadPage() }

function onOrderClick(o: MobileWorkOrderVo) { ElMessage.info(`点击工单 ${o.code}（demo: 详情页 v2 实现）`) }
function onCreate() { ElMessage.info(`新建${title}（demo: v2 实现真实表单）`) }

onMounted(reload)
</script>

<style scoped>
.m-list { min-height: 100vh; background: #f5f7fa; padding-bottom: 80px; }
.m-toolbar { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: #fff; border-bottom: 1px solid #ebeef5; }
.m-toolbar-info { font-size: 13px; color: #606266; }
.m-body { padding: 12px; }
.m-loading, .m-empty { text-align: center; padding: 60px 20px; color: #909399; }
.m-empty { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.m-empty-text { font-size: 14px; }
.m-loadmore { text-align: center; padding: 14px; color: #909399; font-size: 13px; cursor: pointer; }
.m-fab { position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%); z-index: 50; }
</style>
