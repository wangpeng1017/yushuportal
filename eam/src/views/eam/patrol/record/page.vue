<template>
  <div class="patrol-record-page">
    <ContentWrap>
      <el-form :model="queryParams" :inline="true" label-width="90px" class="-mb-15px">
        <el-form-item label="路线" prop="route">
          <el-input v-model="queryParams.route" class="!w-200px" clearable placeholder="请输入路线" />
        </el-form-item>
        <el-form-item label="点位" prop="point">
          <el-input v-model="queryParams.point" class="!w-200px" clearable placeholder="请输入点位" />
        </el-form-item>
        <el-form-item label="打卡方式" prop="scanMode">
          <el-select v-model="queryParams.scanMode" placeholder="全部" clearable class="!w-140px">
            <el-option label="NFC" value="NFC" />
            <el-option label="二维码" value="二维码" />
            <el-option label="GPS" value="GPS" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-120px">
            <el-option label="正常" value="正常" />
            <el-option label="异常" value="异常" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="() => {}"><Icon icon="ep:search" class="mr-5px" />搜索</el-button>
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" />重置</el-button>
        </el-form-item>
      </el-form>
    </ContentWrap>

    <ContentWrap>
      <el-table :data="filteredList" stripe>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column label="路线" prop="route" width="180" />
        <el-table-column label="点位" prop="point" width="160" />
        <el-table-column label="打卡时间" prop="time" width="160" align="center" />
        <el-table-column label="打卡方式" prop="scanMode" width="110" align="center">
          <template #default="{row}">
            <span v-if="row.scanMode === 'NFC'" class="tag-nfc">📱 NFC</span>
            <span v-else-if="row.scanMode === '二维码'" class="tag-scan">▣ 二维码</span>
            <span v-else-if="row.scanMode === 'GPS'" class="tag-gps">📍 GPS</span>
          </template>
        </el-table-column>
        <el-table-column label="GPS 定位" prop="gps" width="170" align="center" />
        <el-table-column label="拍照" prop="photo" width="80" align="center">
          <template #default="{row}">
            <el-button v-if="row.photo > 0" link type="primary" @click="msg('查看 ' + row.photo + ' 张照片（Demo）')">{{ row.photo }} 张</el-button>
            <span v-else style="color:#c0c4cc;">—</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" width="100" align="center">
          <template #default="{row}">
            <el-tag size="small" :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="现场描述" prop="desc" min-width="240" show-overflow-tooltip />
        <el-table-column label="隐患单" prop="hazardOrder" width="130" align="center">
          <template #default="{row}">
            <el-link v-if="row.hazardOrder" type="warning" :underline="false">{{ row.hazardOrder }}</el-link>
            <span v-else style="color:#c0c4cc;">—</span>
          </template>
        </el-table-column>
        <el-table-column label="执行人" prop="executor" width="90" align="center" />
      </el-table>
      <Pagination :total="filteredList.length" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize" />
    </ContentWrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

defineOptions({ name: 'EamPatrolRecord' })

const message = useMessage()
const queryParams = reactive({ route: '', point: '', scanMode: '', status: '', pageNo: 1, pageSize: 10 })

const list = ref<any[]>([
  { route: 'CR-PWR-001 配电室', point: '1号配电柜', time: '2026-05-12 14:32:18', scanMode: 'NFC', gps: '31.2304, 121.4737', photo: 1, status: '正常', desc: '指示灯 / 异响 / 异味均无异常', hazardOrder: null, executor: '李四' },
  { route: 'CR-PWR-001 配电室', point: '2号变压器', time: '2026-05-12 14:38:42', scanMode: 'NFC', gps: '31.2304, 121.4738', photo: 2, status: '异常', desc: '油位偏低（低于下限刻度 5mm），需要补油', hazardOrder: 'HZ2026-0019', executor: '李四' },
  { route: 'CR-PWR-001 配电室', point: '配电室门口', time: '2026-05-12 14:45:11', scanMode: 'GPS', gps: '31.2305, 121.4737', photo: 1, status: '正常', desc: '防火门关闭，通道无堆放', hazardOrder: null, executor: '李四' },
  { route: 'CR-PWR-001 配电室', point: '高压柜', time: '2026-05-12 14:50:32', scanMode: 'NFC', gps: '31.2304, 121.4737', photo: 1, status: '正常', desc: '局部放电指示正常，温度 28℃', hazardOrder: null, executor: '李四' },
  { route: 'CR-PWR-002 锅炉房', point: '锅炉本体', time: '2026-05-12 14:02:07', scanMode: 'NFC', gps: '31.2308, 121.4742', photo: 1, status: '正常', desc: '炉温 / 压力 / 水位均正常', hazardOrder: null, executor: '动力员' },
  { route: 'CR-PWR-002 锅炉房', point: '燃气阀门', time: '2026-05-12 14:08:55', scanMode: '二维码', gps: '31.2308, 121.4743', photo: 1, status: '正常', desc: '阀门开度 70%，无泄漏', hazardOrder: null, executor: '动力员' },
  { route: 'CR-C-001 PACK 车间', point: '电控柜', time: '2026-05-12 09:15:33', scanMode: 'NFC', gps: '31.2300, 121.4720', photo: 2, status: '正常', desc: '指示灯正常，柜内温度 32℃', hazardOrder: null, executor: '王工' },
  { route: 'CR-C-001 PACK 车间', point: '压机', time: '2026-05-12 09:20:18', scanMode: 'NFC', gps: '31.2300, 121.4721', photo: 1, status: '正常', desc: '压机运行平稳，气压 0.62MPa', hazardOrder: null, executor: '王工' },
  { route: 'CR-C-001 PACK 车间', point: '点胶机', time: '2026-05-12 09:25:42', scanMode: '二维码', gps: '31.2300, 121.4722', photo: 1, status: '正常', desc: '胶量充足，喷头无堵', hazardOrder: null, executor: '王工' },
  { route: 'CR-C-001 PACK 车间', point: '测试工位', time: '2026-05-12 09:30:11', scanMode: 'GPS', gps: '31.2300, 121.4723', photo: 1, status: '正常', desc: '测试设备校准状态正常', hazardOrder: null, executor: '王工' },
  { route: 'CR-C-001 PACK 车间', point: '急停按钮', time: '2026-05-12 09:33:55', scanMode: '二维码', gps: '31.2301, 121.4720', photo: 1, status: '正常', desc: '急停按钮按下复位测试通过', hazardOrder: null, executor: '王工' },
  { route: 'CR-N-001 数控加工', point: '主轴箱', time: '2026-05-12 10:42:18', scanMode: 'NFC', gps: '31.2310, 121.4750', photo: 2, status: '异常', desc: '主轴润滑指示偏低，需加注润滑油', hazardOrder: 'HZ2026-0021', executor: '张工' }
])

const filteredList = computed(() => list.value.filter(r => {
  if (queryParams.route && !r.route.includes(queryParams.route)) return false
  if (queryParams.point && !r.point.includes(queryParams.point)) return false
  if (queryParams.scanMode && r.scanMode !== queryParams.scanMode) return false
  if (queryParams.status && r.status !== queryParams.status) return false
  return true
}))

const resetQuery = () => Object.assign(queryParams, { route: '', point: '', scanMode: '', status: '', pageNo: 1 })
const msg = (t: string) => message.success(t)
</script>

<style scoped>
.tag-nfc { background: #f5f0ff; color: #826af9; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.tag-scan { background: #ecf5ff; color: #409eff; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
.tag-gps { background: #f0f9eb; color: #67c23a; padding: 2px 8px; border-radius: 10px; font-size: 11px; }
</style>
