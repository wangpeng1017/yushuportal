<template>
  <div class="flow-detail-page">
    <!-- 顶部：项目卡片 + 进度条 -->
    <ContentWrap>
      <div class="project-header">
        <div class="header-left">
          <el-button :icon="ArrowLeft" link @click="goBack">返回列表</el-button>
          <div class="project-title">
            <h2>{{ project.projectName }}</h2>
            <div class="meta">
              <el-tag size="small">{{ project.projectCode }}</el-tag>
              <el-tag size="small" type="info">负责人：{{ project.owner }}</el-tag>
              <el-tag size="small" :type="priorityColor">优先级：{{ project.priority }}</el-tag>
              <span class="date-range">{{ project.planStart }} 至 {{ project.planEnd }}</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="progress-num">{{ progressPercent }}%</div>
          <div class="progress-label">流程进度（{{ doneCount }}/5 节点）</div>
        </div>
      </div>
      <el-progress :percentage="progressPercent" :stroke-width="10" :color="progressColor" />
    </ContentWrap>

    <!-- 5 节点横向 stepper -->
    <ContentWrap>
      <el-steps :active="activeStepIndex" finish-status="success" :process-status="currentStatus" align-center>
        <el-step
          v-for="node in nodes"
          :key="node.id"
          :title="node.id + '. ' + node.name"
          :description="node.role"
          :status="node.status === 'rejected' ? 'error' : (node.status === 'done' ? 'success' : (node.status === 'in_progress' ? 'process' : 'wait'))"
          @click="currentNodeId = node.id"
          style="cursor:pointer;"
        />
      </el-steps>
    </ContentWrap>

    <!-- 当前节点表单区 -->
    <ContentWrap>
      <div class="node-header">
        <h3>{{ currentNode.id }}. {{ currentNode.name }}</h3>
        <div class="node-meta">
          <el-tag size="small">{{ currentNode.role }}</el-tag>
          <el-tag v-if="currentNode.status === 'done'" size="small" type="success">已完成</el-tag>
          <el-tag v-if="currentNode.status === 'in_progress'" size="small" type="warning">进行中</el-tag>
          <el-tag v-if="currentNode.status === 'rejected'" size="small" type="danger">已打回，待重提</el-tag>
        </div>
      </div>
      <el-alert :title="currentNode.desc" type="info" :closable="false" style="margin:12px 0;" />
      <el-divider style="margin:12px 0;" />

      <!-- ========== 节点 1：立项需求 ========== -->
      <div v-if="currentNodeId === 1">
        <h4 class="section-title">📋 生产需求（生产部填写）</h4>
        <el-form :model="forms.demand" label-width="120px" :disabled="currentNode.status === 'done'">
          <el-form-item label="设备用途">
            <el-input v-model="forms.demand.purpose" placeholder="例如：电池模组 PACK 自动化装配" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="产能要求 (UPH)">
                <el-input-number v-model="forms.demand.uph" :min="0" :max="10000" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="紧急度">
                <el-radio-group v-model="forms.demand.urgency">
                  <el-radio value="高">高</el-radio>
                  <el-radio value="中">中</el-radio>
                  <el-radio value="低">低</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="期望交付日">
                <el-date-picker v-model="forms.demand.expectDate" type="date" value-format="YYYY-MM-DD" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="现场条件">
            <el-input v-model="forms.demand.site" type="textarea" :rows="2" placeholder="占地尺寸 / 电气接口 / 上下料对接条件……" />
          </el-form-item>
        </el-form>
        <h4 class="section-title">⚙️ 工艺需求（工艺部细化）</h4>
        <el-form :model="forms.process" label-width="120px" :disabled="currentNode.status === 'done'">
          <el-form-item label="工艺路线">
            <el-input v-model="forms.process.route" type="textarea" :rows="2" placeholder="例：电芯上料 → 压机入壳 → 极耳焊接 → BMS 装配 → 测试 → 下料" />
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="节拍 (s)">
                <el-input-number v-model="forms.process.ct" :min="0" :max="600" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="精度 (mm)">
                <el-input v-model="forms.process.precision" placeholder="±0.05" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工位数">
                <el-input-number v-model="forms.process.stations" :min="1" :max="50" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="关键技术指标">
            <el-input v-model="forms.process.kpi" type="textarea" :rows="2" placeholder="OEE ≥ 85%，良率 ≥ 99%，节拍偏差 ≤ 5%……" />
          </el-form-item>
        </el-form>
      </div>

      <!-- ========== 节点 2：方案设计（含两次评审） ========== -->
      <div v-else-if="currentNodeId === 2">
        <el-tabs v-model="schemeTab">
          <el-tab-pane label="方案 v1.0 (概念)" name="v1">
            <h4 class="section-title">🏗️ 概念方案（自动化团队）</h4>
            <el-form :model="forms.scheme.v1" label-width="120px" :disabled="forms.scheme.v1.locked">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="设计负责人">
                    <el-input v-model="forms.scheme.v1.designer" placeholder="机械主设" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="3D 文件链接">
                    <el-input v-model="forms.scheme.v1.url3d" placeholder="\\\\server\\drawings\\…\\v1.0">
                      <template #append><el-button :icon="Link" @click="msg('打开 3D 模型（Demo）')">打开</el-button></template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="方案概要">
                <el-input v-model="forms.scheme.v1.summary" type="textarea" :rows="2" />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="初估成本 (万)">
                    <el-input-number v-model="forms.scheme.v1.cost" :min="0" :max="9999" style="width:100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="初估工期 (天)">
                    <el-input-number v-model="forms.scheme.v1.duration" :min="0" :max="365" style="width:100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="风险等级">
                    <el-select v-model="forms.scheme.v1.risk" style="width:100%;">
                      <el-option label="高" value="高" /><el-option label="中" value="中" /><el-option label="低" value="低" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <h4 class="section-title">🔍 评审 1（工艺 + 生产联合）</h4>
            <div class="review-block">
              <el-form :model="forms.review1" label-width="120px" :disabled="forms.review1.locked">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="评审日期">
                      <el-date-picker v-model="forms.review1.date" type="date" value-format="YYYY-MM-DD" style="width:100%;" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="评审委员">
                      <el-select v-model="forms.review1.reviewers" multiple placeholder="选择评审人" style="width:100%;">
                        <el-option label="张总（生产副总）" value="张总" />
                        <el-option label="王主管（工艺）" value="王主管" />
                        <el-option label="李工（QA 主管）" value="李工" />
                        <el-option label="刘工（PM）" value="刘工" />
                        <el-option label="陈工（电气主设）" value="陈工" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="评审结论">
                  <el-radio-group v-model="forms.review1.result">
                    <el-radio value="通过">✅ 通过</el-radio>
                    <el-radio value="有条件通过">⚠ 有条件通过</el-radio>
                    <el-radio value="打回">❌ 打回</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="forms.review1.result === '有条件通过' || forms.review1.result === '打回'" label="整改 / 优化项">
                  <el-input v-model="forms.review1.suggestions" type="textarea" :rows="2" placeholder="一行一条整改要求……" />
                </el-form-item>
                <el-form-item label="会议纪要">
                  <el-input v-model="forms.review1.minutes" type="textarea" :rows="2" placeholder="评审过程关键讨论内容……" />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'方案 v2.0 (详细)' + (forms.scheme.v1.passed ? '' : ' 🔒')" name="v2" :disabled="!forms.scheme.v1.passed">
            <h4 class="section-title">🔧 详细方案（基于 v1.0 整改）</h4>
            <el-form :model="forms.scheme.v2" label-width="120px" :disabled="forms.scheme.v2.locked">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="详细 3D 链接">
                    <el-input v-model="forms.scheme.v2.url3d" placeholder="\\\\server\\drawings\\…\\v2.0" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="电气方案">
                    <el-input v-model="forms.scheme.v2.electrical" placeholder="PLC 选型 / 控制架构" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="关键件选型">
                <el-input v-model="forms.scheme.v2.keyParts" type="textarea" :rows="2" placeholder="机器人型号、伺服选型、视觉相机、传感器……" />
              </el-form-item>
              <el-form-item label="v2 优化点">
                <el-input v-model="forms.scheme.v2.improvements" type="textarea" :rows="2" placeholder="对比 v1.0 的关键改进项" />
              </el-form-item>
            </el-form>
            <h4 class="section-title">🔍 评审 2（详细方案冻结 Gate）</h4>
            <div class="review-block">
              <el-form :model="forms.review2" label-width="120px" :disabled="forms.review2.locked">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="评审日期">
                      <el-date-picker v-model="forms.review2.date" type="date" value-format="YYYY-MM-DD" style="width:100%;" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="评审委员">
                      <el-select v-model="forms.review2.reviewers" multiple placeholder="选择评审人" style="width:100%;">
                        <el-option label="张总（生产副总）" value="张总" />
                        <el-option label="王主管（工艺）" value="王主管" />
                        <el-option label="李工（QA 主管）" value="李工" />
                        <el-option label="刘工（PM）" value="刘工" />
                        <el-option label="陈工（电气主设）" value="陈工" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="评审结论">
                  <el-radio-group v-model="forms.review2.result">
                    <el-radio value="通过">✅ 通过</el-radio>
                    <el-radio value="有条件通过">⚠ 有条件通过</el-radio>
                    <el-radio value="打回">❌ 打回</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="forms.review2.result === '有条件通过' || forms.review2.result === '打回'" label="整改 / 优化项">
                  <el-input v-model="forms.review2.suggestions" type="textarea" :rows="2" placeholder="一行一条整改要求……" />
                </el-form-item>
                <el-form-item label="会议纪要">
                  <el-input v-model="forms.review2.minutes" type="textarea" :rows="2" placeholder="评审过程关键讨论内容……" />
                </el-form-item>
              </el-form>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-divider />
        <h4 class="section-title">📜 历史打回记录</h4>
        <el-table v-if="rejectHistory.length" :data="rejectHistory" size="small" border>
          <el-table-column prop="time" label="时间" width="160" />
          <el-table-column prop="from" label="来源" width="140" />
          <el-table-column prop="user" label="操作人" width="100" />
          <el-table-column prop="reason" label="原因" />
        </el-table>
        <el-empty v-else description="暂无打回记录" :image-size="50" />
      </div>

      <!-- ========== 节点 3：图纸 BOM ========== -->
      <div v-else-if="currentNodeId === 3">
        <h4 class="section-title">📐 图纸清单</h4>
        <div style="margin-bottom:8px;">
          <el-button type="primary" size="small" plain :disabled="currentNode.status === 'done'" @click="addDrawing">+ 新增图纸</el-button>
        </div>
        <el-table :data="drawings" border stripe size="small">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="no" label="图号" width="140" />
          <el-table-column prop="name" label="名称" min-width="180" />
          <el-table-column prop="version" label="版本" width="80" align="center" />
          <el-table-column prop="designer" label="绘制人" width="100" align="center" />
          <el-table-column prop="reviewer" label="校核人" width="100" align="center" />
          <el-table-column prop="approver" label="批准人" width="100" align="center" />
          <el-table-column label="文件" width="100" align="center">
            <template #default="{row}">
              <el-button link type="primary" size="small" @click="msg('打开图纸 ' + row.no)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-divider />
        <h4 class="section-title">📦 BOM 三栏（按物料类型拆分）</h4>
        <el-alert type="info" :closable="false" style="margin-bottom:12px;">
          <template #title><b>机加件 / 钣金件 / 外购标准件</b> 三类拆分。外购需录供应商，便于后续节点齐套率计算。</template>
        </el-alert>
        <el-tabs v-model="bomTab">
          <el-tab-pane :label="'机加件 (' + bom.machined.length + ')'" name="machined">
            <div style="margin-bottom:8px;">
              <el-button type="primary" size="small" plain :disabled="currentNode.status === 'done'" @click="addBom('machined')">+ 新增物料</el-button>
            </div>
            <el-table :data="bom.machined" border stripe size="small">
              <el-table-column type="index" label="#" width="50" align="center" />
              <el-table-column prop="code" label="物料编号" width="120" />
              <el-table-column prop="name" label="物料名称" min-width="160" />
              <el-table-column prop="spec" label="规格型号" min-width="200" />
              <el-table-column prop="qty" label="数量" width="80" align="center" />
              <el-table-column prop="unit" label="单位" width="70" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{$index}">
                  <el-button link type="danger" size="small" :disabled="currentNode.status === 'done'" @click="bom.machined.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'钣金件 (' + bom.sheetmetal.length + ')'" name="sheetmetal">
            <div style="margin-bottom:8px;">
              <el-button type="primary" size="small" plain :disabled="currentNode.status === 'done'" @click="addBom('sheetmetal')">+ 新增物料</el-button>
            </div>
            <el-table :data="bom.sheetmetal" border stripe size="small">
              <el-table-column type="index" label="#" width="50" align="center" />
              <el-table-column prop="code" label="物料编号" width="120" />
              <el-table-column prop="name" label="物料名称" min-width="160" />
              <el-table-column prop="spec" label="规格型号" min-width="200" />
              <el-table-column prop="qty" label="数量" width="80" align="center" />
              <el-table-column prop="unit" label="单位" width="70" align="center" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{$index}">
                  <el-button link type="danger" size="small" :disabled="currentNode.status === 'done'" @click="bom.sheetmetal.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="'外购标准件 (' + bom.purchased.length + ')'" name="purchased">
            <div style="margin-bottom:8px;">
              <el-button type="primary" size="small" plain :disabled="currentNode.status === 'done'" @click="addBom('purchased')">+ 新增物料</el-button>
            </div>
            <el-table :data="bom.purchased" border stripe size="small">
              <el-table-column type="index" label="#" width="50" align="center" />
              <el-table-column prop="code" label="物料编号" width="120" />
              <el-table-column prop="name" label="物料名称" min-width="160" />
              <el-table-column prop="spec" label="规格型号" min-width="200" />
              <el-table-column prop="qty" label="数量" width="80" align="center" />
              <el-table-column prop="unit" label="单位" width="70" align="center" />
              <el-table-column prop="supplier" label="供应商" min-width="160" />
              <el-table-column label="操作" width="80" align="center">
                <template #default="{$index}">
                  <el-button link type="danger" size="small" :disabled="currentNode.status === 'done'" @click="bom.purchased.splice($index, 1)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div class="bom-summary">
          <span>机加件 <b>{{ bom.machined.length }}</b> 项</span>
          <span>钣金件 <b>{{ bom.sheetmetal.length }}</b> 项</span>
          <span>外购标准件 <b>{{ bom.purchased.length }}</b> 项</span>
          <span class="total">合计 <b>{{ bom.machined.length + bom.sheetmetal.length + bom.purchased.length }}</b> 项</span>
        </div>
      </div>

      <!-- ========== 节点 4：采购装配 ========== -->
      <div v-else-if="currentNodeId === 4">
        <div class="metric-grid">
          <div class="metric-card primary">
            <div class="num">{{ purchase.totalOrders }}</div>
            <div class="label">采购单总数</div>
          </div>
          <div class="metric-card success">
            <div class="num">{{ purchase.received }}</div>
            <div class="label">已收料</div>
          </div>
          <div class="metric-card warn">
            <div class="num">{{ purchase.kitsetReady }}%</div>
            <div class="label">物料齐套率</div>
          </div>
          <div class="metric-card danger">
            <div class="num">{{ assemblyOverall }}%</div>
            <div class="label">装配进度</div>
          </div>
        </div>

        <h4 class="section-title">📤 采购订单（钉钉 + ERP）</h4>
        <el-table :data="purchase.orders" border stripe size="small">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="material" label="物料" min-width="160" />
          <el-table-column prop="supplier" label="供应商" width="160" />
          <el-table-column prop="ddCode" label="钉钉申请号" width="130" align="center">
            <template #default="{row}"><el-link type="primary" :underline="false" @click="msg('打开钉钉审批 ' + row.ddCode)">{{ row.ddCode }}</el-link></template>
          </el-table-column>
          <el-table-column prop="erpCode" label="ERP 单号" width="140" align="center">
            <template #default="{row}"><el-link type="warning" :underline="false">{{ row.erpCode }}</el-link></template>
          </el-table-column>
          <el-table-column prop="amount" label="金额 (万)" width="100" align="center" />
          <el-table-column prop="dueDate" label="货期" width="120" align="center" />
          <el-table-column prop="status" label="状态" width="100" align="center">
            <template #default="{row}">
              <el-tag size="small" :type="row.status === '已到货' ? 'success' : row.status === '在途' ? 'warning' : 'info'">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
        </el-table>

        <el-divider />
        <h4 class="section-title">📦 收料 + 抽检记录</h4>
        <el-table :data="receiving" border stripe size="small">
          <el-table-column type="index" label="#" width="50" align="center" />
          <el-table-column prop="material" label="物料" min-width="160" />
          <el-table-column prop="qty" label="数量" width="80" align="center" />
          <el-table-column prop="receiveDate" label="到货日" width="120" align="center" />
          <el-table-column prop="qcReport" label="质检报告" width="100" align="center">
            <template #default="{row}">
              <el-link v-if="row.qcReport" type="primary" :underline="false">{{ row.qcReport }}</el-link>
              <span v-else style="color:#c0c4cc;">—</span>
            </template>
          </el-table-column>
          <el-table-column prop="sampleResult" label="抽检结果" width="120" align="center">
            <template #default="{row}">
              <el-tag size="small" :type="row.sampleResult === '合格' ? 'success' : (row.sampleResult === '不合格' ? 'danger' : 'info')">{{ row.sampleResult }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="receiveCode" label="收料单号" width="140" />
        </el-table>

        <el-divider />
        <h4 class="section-title">🔧 装配进度（机械 / 接线 / 电气）</h4>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="assembly-card">
              <div class="title">机械装配</div>
              <el-progress :percentage="assembly.mechanical" :stroke-width="14" status="success" />
              <div class="hint">{{ assembly.mechanicalNote }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="assembly-card">
              <div class="title">接线 / 走线</div>
              <el-progress :percentage="assembly.wiring" :stroke-width="14" />
              <div class="hint">{{ assembly.wiringNote }}</div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="assembly-card">
              <div class="title">电气调试</div>
              <el-progress :percentage="assembly.electrical" :stroke-width="14" status="warning" />
              <div class="hint">{{ assembly.electricalNote }}</div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- ========== 节点 5：验收交付 ========== -->
      <div v-else-if="currentNodeId === 5">
        <el-steps :active="acceptStep" align-center finish-status="success" style="margin-bottom:20px;">
          <el-step title="预验收" description="工艺 + 生产签字" />
          <el-step title="批量试产" description="生产线实跑数据" />
          <el-step title="内部验收" description="QA + 总监签字" />
        </el-steps>

        <h4 class="section-title">✅ 预验收</h4>
        <el-form :model="acceptance.pre" label-width="120px" :disabled="currentNode.status === 'done'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="预验收日期">
                <el-date-picker v-model="acceptance.pre.date" type="date" value-format="YYYY-MM-DD" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工艺签字">
                <el-input v-model="acceptance.pre.processSign" placeholder="工艺主管姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生产签字">
                <el-input v-model="acceptance.pre.productionSign" placeholder="生产主管姓名" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="达成项">
            <el-input v-model="acceptance.pre.achievements" type="textarea" :rows="2" placeholder="对照立项需求逐项检查……" />
          </el-form-item>
        </el-form>

        <h4 class="section-title">🏭 批量试产</h4>
        <el-form :model="acceptance.trial" label-width="120px" :disabled="currentNode.status === 'done'">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="试产时长 (h)">
                <el-input-number v-model="acceptance.trial.duration" :min="0" :max="9999" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="试产数量">
                <el-input-number v-model="acceptance.trial.quantity" :min="0" :max="999999" style="width:100%;" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="一次合格率">
                <el-input v-model="acceptance.trial.yieldRate" placeholder="99.2%" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="实际节拍 (s)">
                <el-input-number v-model="acceptance.trial.realCt" :min="0" :max="600" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="试产报告">
            <el-input v-model="acceptance.trial.report" type="textarea" :rows="2" placeholder="问题点 / 改进项 / 数据汇总……" />
          </el-form-item>
        </el-form>

        <h4 class="section-title">🎯 内部验收</h4>
        <el-form :model="acceptance.final" label-width="120px" :disabled="currentNode.status === 'done'">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="QA 签字">
                <el-input v-model="acceptance.final.qaSign" placeholder="QA 主管姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="总监签字">
                <el-input v-model="acceptance.final.directorSign" placeholder="生产总监姓名" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="移交日期">
                <el-date-picker v-model="acceptance.final.handoverDate" type="date" value-format="YYYY-MM-DD" style="width:100%;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="验收结论">
            <el-input v-model="acceptance.final.conclusion" type="textarea" :rows="2" placeholder="最终验收意见 / 后续运维交底……" />
          </el-form-item>
        </el-form>
      </div>

      <!-- 底部按钮 -->
      <div class="action-bar">
        <el-button v-if="currentNode.status !== 'done'" @click="msg('保存草稿（Demo）')">保存草稿</el-button>
        <el-button
          v-if="currentNodeId === 2 && (forms.review1.result === '打回' || forms.review2.result === '打回') && currentNode.status !== 'done'"
          type="danger"
          @click="rejectScheme"
        >❌ 确认打回（方案重做）</el-button>
        <el-button
          v-if="currentNode.status !== 'done'"
          :type="currentNodeId === 5 ? 'success' : 'primary'"
          :disabled="!canAdvance"
          @click="advance"
        >{{ currentNodeId === 5 ? '🎉 完成项目' : '✅ 提交并推进下一节点' }}</el-button>
        <el-tag v-if="currentNode.status === 'done'" type="success" size="large">本节点已完成 · {{ currentNode.doneAt }}</el-tag>
      </div>
    </ContentWrap>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Link } from '@element-plus/icons-vue'

defineOptions({ name: 'EamCustomEquipmentProjectFlow' })

const message = useMessage()
const router = useRouter()

const project = reactive({
  projectCode: 'CEP-2026-001',
  projectName: 'PACK 车间电池模组装配自动化设备',
  owner: '刘工（PM）',
  priority: 'S2 客户承诺',
  planStart: '2026-04-01',
  planEnd: '2026-09-30'
})
const priorityColor = computed(() => project.priority.startsWith('S1') ? 'danger' : project.priority.startsWith('S2') ? 'warning' : 'info')

const NODES_DEF = [
  { id: 1, name: '立项需求', role: '生产 + 工艺', desc: '生产部提出原始需求，工艺部细化为明确的工艺指标。包含设备用途/产能/紧急度/工艺路线/CT/精度/工位等。' },
  { id: 2, name: '方案设计', role: '自动化团队 + 评审委员会', desc: '从概念方案 v1.0 到详细方案 v2.0，含 2 次评审 Gate（评审 1 + 评审 2），评审可通过/有条件通过/打回。' },
  { id: 3, name: '图纸 BOM', role: '自动化团队', desc: '详细图纸绘制 + BOM 三栏拆分（机加件 / 钣金件 / 外购标准件）。外购需录供应商。' },
  { id: 4, name: '采购装配', role: '采购部 + 装配车间', desc: '钉钉发起采购申请 → ERP 生成订单 → 收料抽检 → 物料领用 → 机械/接线/电气调试。' },
  { id: 5, name: '验收交付', role: '工艺 + 生产 + QA + 总监', desc: '预验收 → 批量试产（含良率数据）→ 内部验收（QA + 总监签字 + 移交）。' }
]

const nodes = ref(NODES_DEF.map(n => ({
  ...n,
  status: n.id < 2 ? 'done' : (n.id === 2 ? 'in_progress' : 'pending'),
  doneAt: n.id === 1 ? '2026-04-12 16:20' : ''
})))

const currentNodeId = ref<number>(2)
const currentNode = computed(() => nodes.value.find(n => n.id === currentNodeId.value)!)
const activeStepIndex = computed(() => {
  // active 步骤：第一个非 done 节点的 index
  const idx = nodes.value.findIndex(n => n.status !== 'done')
  return idx === -1 ? 5 : idx
})
const currentStatus = computed<'process' | 'error' | 'wait' | 'finish' | 'success'>(() => {
  const cur = nodes.value.find(n => n.status === 'in_progress' || n.status === 'rejected')
  if (!cur) return 'finish'
  return cur.status === 'rejected' ? 'error' : 'process'
})
const doneCount = computed(() => nodes.value.filter(n => n.status === 'done').length)
const progressPercent = computed(() => Math.round(doneCount.value / 5 * 100))
const progressColor = computed(() => progressPercent.value >= 80 ? '#67c23a' : progressPercent.value >= 50 ? '#409eff' : '#e6a23c')

// 当前节点能否推进（node 2 需要两次评审都通过）
const canAdvance = computed(() => {
  if (currentNodeId.value === 2) {
    const r1Pass = forms.review1.result && forms.review1.result !== '打回'
    const r2Pass = forms.review2.result && forms.review2.result !== '打回'
    return Boolean(r1Pass && r2Pass)
  }
  return true
})

// ── 表单数据 ──
const forms = reactive({
  demand: {
    purpose: '电池模组 PACK 自动化装配（C 端 PACK 车间扩产）',
    uph: 60, urgency: '高', expectDate: '2026-09-30',
    site: '占地 8m×4m，380V/63A，与上线物料车对接 / 与下线 AGV 对接'
  },
  process: {
    route: '电芯上料 → 压机入壳 → 极耳焊接 → BMS 装配 → 测试 → 下料贴码',
    ct: 60, precision: '±0.05', stations: 8,
    kpi: 'OEE ≥ 85%，一次良率 ≥ 99%，节拍偏差 ≤ 5%，连续运行稳定性 ≥ 8h'
  },
  scheme: {
    v1: {
      designer: '陈工（机械主设）', url3d: '\\\\server\\drawings\\CEP-2026-001\\v1.0\\PACK装配线.SLDASM',
      summary: '8 工位线性布局；电芯/壳体上料采用六轴机器人 + 视觉定位；激光焊接采用 IPG 1500W；测试段集成 ATE',
      cost: 280, duration: 120, risk: '中',
      passed: false, locked: false
    },
    v2: {
      url3d: '', electrical: '', keyParts: '', improvements: '',
      passed: false, locked: true
    }
  },
  review1: { date: '2026-05-09', reviewers: [], result: '', suggestions: '', minutes: '', locked: false },
  review2: { date: '', reviewers: [], result: '', suggestions: '', minutes: '', locked: true }
})

const schemeTab = ref('v1')
const rejectHistory = ref<any[]>([])

// 评审 1 通过后解锁 v2 + 评审 2
watch(() => forms.review1.result, (v) => {
  if (v && v !== '打回') {
    forms.scheme.v1.passed = true
    forms.scheme.v1.locked = true
    forms.scheme.v2.locked = false
    forms.review2.locked = false
    schemeTab.value = 'v2'
  }
})
// 评审 2 通过后整个节点 2 推进
watch(() => forms.review2.result, (v) => {
  if (v && v !== '打回') {
    forms.scheme.v2.passed = true
  }
})

// ── 节点 3：图纸 + BOM ──
const drawings = ref<any[]>([
  { no: 'DWG-001', name: '总装图', version: 'v2.0', designer: '陈工', reviewer: '王工', approver: '李工' },
  { no: 'DWG-002', name: '机械结构图', version: 'v2.0', designer: '陈工', reviewer: '王工', approver: '李工' },
  { no: 'DWG-003', name: '电气控制图', version: 'v2.0', designer: '赵工', reviewer: '王工', approver: '李工' },
  { no: 'DWG-004', name: '气路图', version: 'v1.0', designer: '陈工', reviewer: '王工', approver: '李工' }
])
function addDrawing() {
  drawings.value.push({ no: 'DWG-' + String(drawings.value.length + 1).padStart(3, '0'), name: '', version: 'v1.0', designer: '', reviewer: '', approver: '' })
}

const bomTab = ref('machined')
const bom = reactive({
  machined: [
    { code: 'MA-001', name: '工位底座板', spec: '500×300×30 Q235', qty: 8, unit: '件' },
    { code: 'MA-002', name: '夹具体', spec: 'AL6061-T6 定制', qty: 8, unit: '件' },
    { code: 'MA-003', name: '导向轴 Φ20', spec: '45# 镀硬铬', qty: 32, unit: '根' }
  ],
  sheetmetal: [
    { code: 'SM-001', name: '机柜外壳', spec: '1.5mm 喷塑', qty: 1, unit: '套' },
    { code: 'SM-002', name: '安全围栏', spec: '聚碳酸酯 + 铝型材', qty: 1, unit: '套' }
  ],
  purchased: [
    { code: 'PU-001', name: '六轴机器人', spec: 'KUKA KR10 R1100-2', qty: 2, unit: '台', supplier: '库卡（上海）' },
    { code: 'PU-002', name: '激光焊接电源', spec: 'IPG YLR-1500-MM-AC', qty: 1, unit: '台', supplier: 'IPG 光子' },
    { code: 'PU-003', name: 'PLC', spec: 'Siemens S7-1500 1517-3 PN/DP', qty: 1, unit: '台', supplier: '西门子' },
    { code: 'PU-004', name: '直线导轨 30mm', spec: 'HIWIN HGR30R', qty: 16, unit: '根', supplier: 'HIWIN（上银）' },
    { code: 'PU-005', name: '工业相机', spec: 'BASLER acA2440-75um', qty: 4, unit: '台', supplier: 'BASLER 中国' }
  ]
})
function addBom(type: 'machined' | 'sheetmetal' | 'purchased') {
  const idx = bom[type].length + 1
  const prefix = type === 'machined' ? 'MA' : type === 'sheetmetal' ? 'SM' : 'PU'
  const newRow: any = { code: `${prefix}-${String(idx).padStart(3, '0')}`, name: '', spec: '', qty: 1, unit: '件' }
  if (type === 'purchased') newRow.supplier = ''
  bom[type].push(newRow)
}

// ── 节点 4：采购 + 装配 ──
const purchase = reactive({
  totalOrders: 5,
  received: 4,
  kitsetReady: 88,
  orders: [
    { material: '六轴机器人 KUKA KR10', supplier: '库卡（上海）', ddCode: 'DD-2026-1042', erpCode: 'PO-026-0185', amount: 26, dueDate: '2026-06-15', status: '已到货' },
    { material: '激光焊接电源 IPG 1500W', supplier: 'IPG 光子', ddCode: 'DD-2026-1043', erpCode: 'PO-026-0186', amount: 18, dueDate: '2026-06-20', status: '已到货' },
    { material: 'Siemens PLC S7-1500', supplier: '西门子', ddCode: 'DD-2026-1044', erpCode: 'PO-026-0187', amount: 6, dueDate: '2026-06-10', status: '已到货' },
    { material: 'HIWIN 直线导轨', supplier: 'HIWIN（上银）', ddCode: 'DD-2026-1045', erpCode: 'PO-026-0188', amount: 4, dueDate: '2026-05-30', status: '已到货' },
    { material: 'BASLER 工业相机', supplier: 'BASLER 中国', ddCode: 'DD-2026-1046', erpCode: 'PO-026-0189', amount: 8, dueDate: '2026-07-05', status: '在途' }
  ]
})
const receiving = ref<any[]>([
  { material: '六轴机器人 KUKA KR10', qty: 2, receiveDate: '2026-06-12', qcReport: 'QC-2026-0421', sampleResult: '合格', receiveCode: 'RC-2026-0099' },
  { material: '激光焊接电源 IPG 1500W', qty: 1, receiveDate: '2026-06-18', qcReport: 'QC-2026-0422', sampleResult: '合格', receiveCode: 'RC-2026-0100' },
  { material: 'Siemens PLC S7-1500', qty: 1, receiveDate: '2026-06-08', qcReport: 'QC-2026-0423', sampleResult: '合格', receiveCode: 'RC-2026-0101' },
  { material: 'HIWIN 直线导轨', qty: 16, receiveDate: '2026-05-28', qcReport: 'QC-2026-0420', sampleResult: '合格', receiveCode: 'RC-2026-0098' }
])
const assembly = reactive({
  mechanical: 100, mechanicalNote: '已完成 · 8 工位机械装配验收通过',
  wiring: 75, wiringNote: '7/8 工位接线完成，工位 8 进行中',
  electrical: 40, electricalNote: 'PLC 程序联调中（4/8 工位）'
})
const assemblyOverall = computed(() => Math.round((assembly.mechanical + assembly.wiring + assembly.electrical) / 3))

// ── 节点 5：验收交付 ──
const acceptance = reactive({
  pre: { date: '', processSign: '', productionSign: '', achievements: '' },
  trial: { duration: 0, quantity: 0, yieldRate: '', realCt: 0, report: '' },
  final: { qaSign: '', directorSign: '', handoverDate: '', conclusion: '' }
})
const acceptStep = computed(() => {
  let s = 0
  if (acceptance.pre.processSign && acceptance.pre.productionSign) s = 1
  if (acceptance.trial.yieldRate) s = 2
  if (acceptance.final.qaSign && acceptance.final.directorSign) s = 3
  return s
})

// ── 推进 / 打回 ──
function advance() {
  const cur = nodes.value.find(n => n.id === currentNodeId.value)!
  cur.status = 'done'
  cur.doneAt = new Date().toISOString().slice(0, 16).replace('T', ' ')
  const next = nodes.value.find(n => n.id > currentNodeId.value && n.status !== 'done')
  if (next) {
    next.status = 'in_progress'
    currentNodeId.value = next.id
  } else {
    message.success('🎉 项目完成！')
  }
  message.success(`节点 ${cur.id}（${cur.name}）已完成`)
}

function rejectScheme() {
  const cur = nodes.value.find(n => n.id === currentNodeId.value)!
  const isR1 = forms.review1.result === '打回'
  const isR2 = forms.review2.result === '打回'
  const reviewName = isR1 ? '评审 1' : (isR2 ? '评审 2' : '评审')
  rejectHistory.value.unshift({
    time: new Date().toISOString().slice(0, 16).replace('T', ' '),
    from: '节点 2 · ' + reviewName,
    user: '当前用户',
    reason: (isR1 ? forms.review1.suggestions : forms.review2.suggestions) || '方案需优化'
  })
  cur.status = 'rejected'
  if (isR1) {
    // 打回 v1.0：v1 解锁让设计师重新提交
    forms.scheme.v1.locked = false
    forms.scheme.v1.passed = false
    forms.review1.result = ''
    forms.review1.locked = false
    forms.scheme.v2.locked = true
    forms.review2.locked = true
    schemeTab.value = 'v1'
  } else if (isR2) {
    // 打回 v2.0：v2 解锁让设计师重新提交
    forms.scheme.v2.locked = false
    forms.scheme.v2.passed = false
    forms.review2.result = ''
    forms.review2.locked = false
    schemeTab.value = 'v2'
  }
  message.warning(`已打回到方案${isR1 ? ' v1.0 概念' : ' v2.0 详细'}阶段，设计师重新提交后再发起评审`)
}

function goBack() { router.push('/eam/project/customEquipmentProject') }
function msg(t: string) { message.success(t) }

</script>

<style scoped>
.flow-detail-page { padding: 0; }
.project-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.header-left { display: flex; gap: 16px; align-items: flex-start; }
.project-title h2 { margin: 0; font-size: 18px; color: #303133; }
.meta { margin-top: 6px; display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
.date-range { font-size: 12px; color: #909399; }
.header-right { text-align: right; }
.progress-num { font-size: 32px; font-weight: 600; color: #409eff; line-height: 1; }
.progress-label { font-size: 12px; color: #909399; margin-top: 4px; }

.node-header { display: flex; justify-content: space-between; align-items: center; }
.node-header h3 { margin: 0; color: #303133; font-size: 16px; }
.node-meta { display: flex; gap: 8px; }
.section-title { margin: 16px 0 12px 0; font-size: 14px; color: #303133; padding-bottom: 6px; border-bottom: 2px solid #409eff; display: inline-block; padding-right: 12px; }

.action-bar { margin-top: 24px; padding-top: 16px; border-top: 1px solid #ebeef5; display: flex; gap: 8px; justify-content: flex-end; align-items: center; }

.bom-summary { margin-top: 12px; padding: 12px; background: #f5f7fa; border-radius: 4px; display: flex; gap: 24px; font-size: 13px; color: #606266; }
.bom-summary .total { margin-left: auto; color: #303133; }
.bom-summary b { color: #409eff; font-size: 15px; padding: 0 2px; }

.metric-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.metric-card { padding: 14px 18px; border-radius: 4px; background: #fff; border-left: 4px solid #409eff; box-shadow: 0 1px 3px rgba(0,21,41,0.05); }
.metric-card.warn { border-left-color: #e6a23c; }
.metric-card.danger { border-left-color: #f56c6c; }
.metric-card.success { border-left-color: #67c23a; }
.metric-card.primary { border-left-color: #409eff; }
.metric-card .num { font-size: 24px; font-weight: 600; color: #303133; line-height: 1.2; }
.metric-card .label { font-size: 12px; color: #909399; margin-top: 4px; }

.assembly-card { background: #f5f7fa; border-radius: 4px; padding: 14px; }
.assembly-card .title { font-weight: 600; color: #303133; margin-bottom: 8px; font-size: 13px; }
.assembly-card .hint { color: #909399; font-size: 12px; margin-top: 8px; }
.review-block { background: #fafafa; padding: 16px; border-radius: 4px; margin-top: 8px; }
</style>
