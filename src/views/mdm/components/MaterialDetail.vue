<template>
  <div v-if="material" class="material-detail">
    <!-- 顶部基础信息 + 状态徽章 -->
    <div class="md-header">
      <div class="md-header-main">
        <span class="md-code">{{ material.code }}</span>
        <span class="md-name">{{ material.name }}</span>
      </div>
      <div class="md-header-meta">
        <el-tag v-if="material.status === '已审核'" type="success" effect="dark" size="small">✓ 已审核</el-tag>
        <el-tag v-else-if="material.status === '未审核'" type="warning" effect="plain" size="small">待审核</el-tag>
        <el-tag v-else type="danger" effect="plain" size="small">已禁用</el-tag>
        <el-tag size="small" effect="plain">数据源：{{ material.source }}</el-tag>
        <span class="md-updated">最后更新：{{ material.updatedAt }}</span>
      </div>
    </div>

    <!-- 6 分区折叠 -->
    <el-collapse v-model="activeNames" class="md-collapse">
      <!-- 基本信息 -->
      <el-collapse-item name="basic">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#1890FF"></span>基本信息</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>物料编码</label><span>{{ material.code }}</span></div>
          <div class="md-field"><label>物料名称</label><span>{{ material.name }}</span></div>
          <div class="md-field"><label>规格型号</label><span>{{ material.spec || '/' }}</span></div>
          <div class="md-field"><label>英文名称</label><span>{{ material.englishName || '/' }}</span></div>
          <div class="md-field"><label>物料分组</label><span>{{ material.groupName }}</span></div>
          <div class="md-field"><label>物料属性</label><span>{{ material.attribute }}</span></div>
          <div class="md-field"><label>存货类别</label><span>{{ material.category }}</span></div>
          <div class="md-field"><label>产品分类</label><span>{{ material.productCategory }}</span></div>
          <div class="md-field"><label>产品归属</label><span>{{ material.productBelong }}</span></div>
          <div class="md-field"><label>项目编号</label><span>{{ material.projectNo }}</span></div>
          <div class="md-field"><label>物料版本</label><span>{{ material.version }}</span></div>
          <div class="md-field"><label>负责人</label><span>{{ material.owner }}</span></div>
          <div class="md-field"><label>毛重</label><span>{{ material.weight }} {{ material.weightUnit }}</span></div>
          <div class="md-field"><label>尺寸 (L×W×H)</label><span>{{ material.length }}×{{ material.width }}×{{ material.height }} {{ material.sizeUnit }}</span></div>
          <div class="md-field md-full"><label>默认税率</label><span>{{ material.taxRate }}</span></div>
        </div>
      </el-collapse-item>

      <!-- 库存 -->
      <el-collapse-item name="stock">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#52C41A"></span>库存</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>库存单位</label><span>{{ material.stockUnit }}</span></div>
          <div class="md-field"><label>仓库</label><span>{{ material.warehouse }}</span></div>
          <div class="md-field"><label>仓位</label><span>{{ material.bin }}</span></div>
          <div class="md-field"><label>批号编码规则</label><span>{{ material.batchRule }}</span></div>
          <div class="md-field"><label>保质期(天)</label><span>{{ material.shelfLife }}</span></div>
          <div class="md-field"><label>参考成本</label><span>¥ {{ material.costPrice?.toLocaleString() }}</span></div>
          <div class="md-field"><label>成本单位</label><span>{{ material.stockUnit }}</span></div>
          <div class="md-field"><label>币别</label><span>{{ material.currency }}</span></div>
          <div class="md-field"><label>启用库存管理</label><span>✓ 是</span></div>
          <div class="md-field"><label>启用批号管理</label><span>✓ 是</span></div>
          <div class="md-field"><label>序列号管理</label><span>✓ 是</span></div>
          <div class="md-field"><label>生产追溯</label><span>✓ 是</span></div>
        </div>
      </el-collapse-item>

      <!-- 销售 -->
      <el-collapse-item name="sale">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#FA8C16"></span>销售</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>销售单位</label><span>{{ material.saleUnit }}</span></div>
          <div class="md-field"><label>销售计价单位</label><span>{{ material.saleUnit }}</span></div>
          <div class="md-field"><label>起订量</label><span>{{ material.minOrderQty }}</span></div>
          <div class="md-field"><label>建议零售价</label><span>¥ {{ material.saleOrgPrice }}</span></div>
          <div class="md-field"><label>税收分类编码</label><span>{{ material.taxClassCode }}</span></div>
          <div class="md-field"><label>允许销售</label><span>✓ 是</span></div>
          <div class="md-field"><label>允许退货</label><span>✓ 是</span></div>
          <div class="md-field"><label>启用售后服务</label><span>✓ 是</span></div>
          <div class="md-field"><label>保修期</label><span>{{ material.warranty }} {{ material.warrantyUnit }}</span></div>
          <div class="md-field"><label>生成产品档案</label><span>✓ 是</span></div>
        </div>
      </el-collapse-item>

      <!-- 采购 -->
      <el-collapse-item name="purchase">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#722ED1"></span>采购</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>采购单位</label><span>{{ material.purchaseUnit }}</span></div>
          <div class="md-field"><label>采购计价单位</label><span>{{ material.purchaseUnit }}</span></div>
          <div class="md-field"><label>采购组织</label><span>{{ material.purchaseOrg }}</span></div>
          <div class="md-field"><label>后端采购员</label><span>{{ material.buyer }}</span></div>
          <div class="md-field"><label>默认供应商</label><span>{{ material.defaultSupplier }}</span></div>
          <div class="md-field"><label>交期(天)</label><span>{{ material.leadTime }}</span></div>
          <div class="md-field"><label>品牌</label><span>{{ material.brand }}</span></div>
          <div class="md-field"><label>最小包装数</label><span>1</span></div>
          <div class="md-field"><label>默认条码规则</label><span>{{ material.packageRule }}</span></div>
          <div class="md-field"><label>允许采购</label><span>✓ 是</span></div>
          <div class="md-field"><label>需要请购</label><span>✗ 否</span></div>
          <div class="md-field"><label>允许委外</label><span>✓ 是</span></div>
        </div>
      </el-collapse-item>

      <!-- 质量 -->
      <el-collapse-item name="quality">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#13C2C2"></span>质量</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>检验方案</label><span>{{ material.inspectScheme }}</span></div>
          <div class="md-field"><label>质量等级</label><span>{{ material.qualityLevel }}</span></div>
          <div class="md-field"><label>需要检验</label><span>{{ material.inspectionRequired ? '✓ 是' : '✗ 否' }}</span></div>
          <div class="md-field"><label>启用 IQC</label><span>✓ 是</span></div>
          <div class="md-field"><label>启用 IPQC</label><span>✓ 是</span></div>
          <div class="md-field"><label>启用 OQC</label><span>✓ 是</span></div>
          <div class="md-field"><label>AQL 标准</label><span>1.5</span></div>
          <div class="md-field"><label>抽样方案</label><span>GB/T 2828.1 II</span></div>
        </div>
      </el-collapse-item>

      <!-- 生产 -->
      <el-collapse-item name="produce">
        <template #title>
          <span class="md-section-title"><span class="md-dot" style="background:#EB2F96"></span>生产</span>
        </template>
        <div class="md-grid">
          <div class="md-field"><label>生产车间</label><span>{{ material.workshop }}</span></div>
          <div class="md-field"><label>默认产线</label><span>{{ material.productLine }}</span></div>
          <div class="md-field"><label>默认工艺路线</label><span>{{ material.routing }}</span></div>
          <div class="md-field"><label>标准工时(h)</label><span>{{ material.standardHours }}</span></div>
          <div class="md-field"><label>生产类型</label><span>{{ material.productionType }}</span></div>
          <div class="md-field"><label>发料方式</label><span>{{ material.issueMode }}</span></div>
          <div class="md-field"><label>生产单位</label><span>{{ material.baseUnit }}</span></div>
          <div class="md-field"><label>入库超收比例(%)</label><span>0.00</span></div>
          <div class="md-field"><label>入库欠收比例(%)</label><span>0.00</span></div>
          <div class="md-field"><label>允许生产</label><span>✓ 是</span></div>
          <div class="md-field"><label>是否倒冲料</label><span>✗ 否</span></div>
          <div class="md-field"><label>启用日排产</label><span>✓ 是</span></div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import type { MaterialRecord } from '../mock-data'

defineProps<{
  material: MaterialRecord | null
}>()

const activeNames = ref(['basic', 'stock', 'sale', 'purchase', 'quality', 'produce'])
</script>

<style lang="scss" scoped>
.material-detail {
  padding: 0 4px;
}

.md-header {
  position: sticky;
  top: 0;
  background: #fff;
  padding: 16px 12px 14px;
  border-bottom: 1px solid #ebeef5;
  z-index: 10;

  .md-header-main {
    display: flex;
    align-items: baseline;
    gap: 14px;
    margin-bottom: 8px;

    .md-code {
      font-family: Consolas, Monaco, monospace;
      font-size: 13px;
      color: #888;
    }

    .md-name {
      font-size: 17px;
      font-weight: 600;
      color: #1f2937;
    }
  }

  .md-header-meta {
    display: flex;
    align-items: center;
    gap: 8px;

    .md-updated {
      margin-left: auto;
      font-size: 12px;
      color: #9ca3af;
    }
  }
}

.md-collapse {
  border: none;

  :deep(.el-collapse-item__header) {
    background: #f8fafc;
    padding: 0 14px;
    height: 40px;
    line-height: 40px;
    border: none;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 500;
  }

  :deep(.el-collapse-item__wrap) {
    border: none;
  }

  :deep(.el-collapse-item__content) {
    padding: 14px;
  }
}

.md-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1f2937;
}

.md-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.md-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 24px;
}

.md-field {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 28px;
  border-bottom: 1px dashed #f1f5f9;
  padding: 4px 0;

  label {
    width: 110px;
    color: #6b7280;
    flex-shrink: 0;
  }

  span {
    color: #1f2937;
    flex: 1;
  }

  &.md-full {
    grid-column: span 2;
  }
}
</style>
