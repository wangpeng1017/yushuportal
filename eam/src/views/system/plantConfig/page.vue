<template>
  <ContentWrap>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="模块整体可见性" name="visibility">
        <el-alert
          title="模块整体可见性 (附录 A.1)"
          description="控制每个 EM 模块对各端用户登录后是否显示菜单入口。整模块隐藏通过角色 → 菜单矩阵实现。"
          type="info" :closable="false" class="mb-15px"
        />
        <el-table v-loading="loadingVis" :data="visibilityList" :stripe="true" border>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="模块编码" prop="moduleCode" width="120" align="center" />
          <el-table-column label="模块名称" prop="moduleName" min-width="220" align="center" />
          <el-table-column label="C 端" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.plantC" type="success" size="small">✅ 可见</el-tag>
              <el-tag v-else type="info" size="small">❌ 不可见</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="B 端" width="100" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.plantB" type="success" size="small">✅ 可见</el-tag>
              <el-tag v-else type="info" size="small">❌ 不可见</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="数控机加" width="120" align="center">
            <template #default="{ row }">
              <el-tag v-if="row.plantCNC" type="success" size="small">✅ 可见</el-tag>
              <el-tag v-else type="info" size="small">❌ 不可见</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remark" min-width="200" />
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="字段段开关配置" name="fieldSwitch">
        <el-alert
          title="字段段开关配置 (附录 A.11.4)"
          description="控制通用模块内的个性化字段段是否对各端用户显示。修改后立即生效，整段渲染或不渲染（DOM 级隐藏）。"
          type="warning" :closable="false" class="mb-15px"
        />
        <el-table v-loading="loadingCfg" :data="configList" :stripe="true" border>
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="所属模块" prop="module" width="100" align="center">
            <template #default="{ row }">
              <el-tag size="small">{{ row.module }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="配置项" prop="configName" min-width="280" />
          <el-table-column label="C 端" width="120" align="center">
            <template #default="{ row }">
              <el-select v-model="row.plantC" size="small" @change="handleUpdate(row)" style="width: 110px">
                <el-option label="显示" value="显示" />
                <el-option label="隐藏" value="隐藏" />
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
                <el-option label="强制启用" value="强制启用" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="B 端" width="120" align="center">
            <template #default="{ row }">
              <el-select v-model="row.plantB" size="small" @change="handleUpdate(row)" style="width: 110px">
                <el-option label="显示" value="显示" />
                <el-option label="隐藏" value="隐藏" />
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
                <el-option label="强制启用" value="强制启用" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="数控机加" width="120" align="center">
            <template #default="{ row }">
              <el-select v-model="row.plantCNC" size="small" @change="handleUpdate(row)" style="width: 110px">
                <el-option label="显示" value="显示" />
                <el-option label="隐藏" value="隐藏" />
                <el-option label="启用" value="启用" />
                <el-option label="禁用" value="禁用" />
                <el-option label="是" value="是" />
                <el-option label="否" value="否" />
                <el-option label="强制启用" value="强制启用" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="说明" prop="remark" min-width="280" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </ContentWrap>
</template>

<script setup lang="ts" name="SystemPlantConfig">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/config/axios'
import { usePlantConfigStore } from '@/store/modules/plantConfig'

const plantConfigStore = usePlantConfigStore()
const activeTab = ref('visibility')
const loadingVis = ref(false)
const loadingCfg = ref(false)
const visibilityList = ref<any[]>([])
const configList = ref<any[]>([])

async function loadVisibility() {
  loadingVis.value = true
  try {
    const res: any = await request.get({ url: '/admin-api/system/module-visibility/list' })
    visibilityList.value = res || []
  } finally {
    loadingVis.value = false
  }
}

async function loadConfig() {
  loadingCfg.value = true
  try {
    await plantConfigStore.loadConfigs(true)
    configList.value = JSON.parse(JSON.stringify(plantConfigStore.configList))
  } finally {
    loadingCfg.value = false
  }
}

async function handleUpdate(row: any) {
  await request.post({ url: '/admin-api/system/plant-config/update', data: row })
  // 立即写入 store，让其他页面监听到生效
  plantConfigStore.updateConfig(row)
  ElMessage.success(`已更新 [${row.configName}]，全平台生效`)
}

onMounted(() => {
  loadVisibility()
  loadConfig()
})
</script>
