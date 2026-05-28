<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="900px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备编号" prop="equipmentSn">
            <el-input v-model="formData.equipmentSn" disabled placeholder="系统自动生成" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备名称" prop="equipmentName">
            <el-input
              v-model="formData.equipmentName"
              placeholder="请输入设备名称"
              maxlength="21"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备类型编码" prop="equipmentType">
            <div class="flex w-full">
              <el-input
                v-model="formData.equipmentType"
                disabled
                placeholder="请选择设备类型"
                class="flex-1"
              />
              <el-button class="ml-8px" @click="openEquipmentTypeSelect">选择</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备类型描述">
            <el-input v-model="formData.equipmentTypeDesc" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备分类编码" prop="equipmentCategory">
            <div class="flex w-full">
              <el-input
                v-model="formData.equipmentCategory"
                disabled
                placeholder="请选择设备分类"
                class="flex-1"
              />
              <el-button class="ml-8px" @click="openEquipmentCategorySelect">选择</el-button>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="设备分类描述">
            <el-input v-model="formData.equipmentCategoryDesc" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备型号" prop="equipmentMode">
            <el-select
              v-model="formData.equipmentMode"
              placeholder="请选择设备型号"
              clearable
              class="!w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getEquipmentModeList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="位置号" prop="locationSn">
            <el-input v-model="formData.locationSn" placeholder="请输入位置号" maxlength="30" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="设备标识" prop="equipmentTag">
            <el-input v-model="formData.equipmentTag" placeholder="请输入设备标识" maxlength="30" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商编号" prop="equipmentSupplier">
            <div class="flex w-full">
              <el-input
                v-model="formData.equipmentSupplier"
                disabled
                placeholder="请选择供应商"
                class="flex-1"
              />
              <el-button class="ml-8px" @click="openSupplierSelect">选择</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="供应商名称">
            <el-input v-model="formData.equipmentSupplierName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="资产状态" prop="equipmentStatus">
            <el-select
              v-model="formData.equipmentStatus"
              placeholder="请选择资产状态"
              clearable
              class="!w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getEquipmentStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="运行状态" prop="operationStatus">
            <el-select
              v-model="formData.operationStatus"
              placeholder="请选择运行状态"
              clearable
              class="!w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getOperationStatusList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="启停用状态" prop="equipmentRevstop">
            <el-select
              v-model="formData.equipmentRevstop"
              placeholder="请选择启停用状态"
              clearable
              class="!w-full"
            >
              <el-option
                v-for="item in eamEnumStore.getEquipmentRevstopList"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="排序号" prop="sequenceNumber">
            <el-input-number
              v-model="formData.sequenceNumber"
              :min="1"
              :max="99999999"
              :precision="0"
              :step="1"
              controls-position="right"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="购置时间" prop="equipmentPurchase">
            <el-date-picker
              v-model="formData.equipmentPurchase"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择购置时间"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="投入运营时间" prop="equipmentOperating">
            <el-date-picker
              v-model="formData.equipmentOperating"
              type="date"
              value-format="YYYY-MM-DD"
              placeholder="请选择投入运营时间"
              class="!w-full"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ==================== 宇树扩展字段 ==================== -->
      <el-divider content-position="left">组织归属</el-divider>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="所属车间" prop="workshopName">
            <el-select v-model="formData.workshopName" placeholder="请选择所属车间" clearable class="!w-full">
              <el-option label="C端车间" value="C端车间" />
              <el-option label="B端车间" value="B端车间" />
              <el-option label="数控机加车间" value="数控机加车间" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所属产线" prop="productionLineName">
            <el-input v-model="formData.productionLineName" placeholder="如：715线、G1线、PACK线" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="责任部门" prop="departmentName">
            <el-input v-model="formData.departmentName" placeholder="请输入责任部门" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任人" prop="responsiblePersonName">
            <el-input v-model="formData.responsiblePersonName" placeholder="请输入责任人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="维保单位" prop="maintenanceUnit">
            <el-input v-model="formData.maintenanceUnit" placeholder="如：工艺部/外部供应商" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="维保周期" prop="maintenanceCycle">
            <el-input v-model="formData.maintenanceCycle" placeholder="如：每月例行保养" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="操作指导文件" prop="hasOperationGuide">
            <el-select v-model="formData.hasOperationGuide" placeholder="是否有SOP" clearable class="!w-full">
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- IoT 通讯参数字段段：仅 C 端 + 数控机加 + admin 可见（与 EM-08 联动） -->
      <template v-if="showIotFields">
        <el-divider content-position="left">IoT 通讯参数（C 端 / 数控机加专属）</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备厂家" prop="manufacturer">
              <el-select v-model="formData.manufacturer" placeholder="请选择设备厂家" clearable filterable allow-create class="!w-full">
                <el-option label="台群" value="台群" />
                <el-option label="乔峰" value="乔峰" />
                <el-option label="哈斯" value="哈斯" />
                <el-option label="华中" value="华中" />
                <el-option label="广数" value="广数" />
                <el-option label="锐锋" value="锐锋" />
                <el-option label="新代" value="新代" />
                <el-option label="汇川" value="汇川" />
                <el-option label="三菱" value="三菱" />
                <el-option label="西门子" value="西门子" />
                <el-option label="海天国际" value="海天国际" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统及版本" prop="systemVersion">
              <el-input v-model="formData.systemVersion" placeholder="如：三菱系统M80、FANUC系统0i-MF" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="通讯协议" prop="commProtocol">
              <el-select v-model="formData.commProtocol" placeholder="请选择通讯协议" clearable class="!w-full">
                <el-option label="Modbus-TCP" value="Modbus-TCP" />
                <el-option label="Modbus-RTU" value="Modbus-RTU" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯接口" prop="commInterface">
              <el-select v-model="formData.commInterface" placeholder="请选择通讯接口" clearable class="!w-full">
                <el-option label="以太网接口" value="以太网接口" />
                <el-option label="9针串口(RS485,RS232)" value="9针串口(RS485,RS232)" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- 非标研制字段段：仅 C 端 + admin 可见（与 EM-07 联动） -->
      <template v-if="showProjectFields">
        <el-divider content-position="left">非标研制（C 端专属）</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备来源" prop="equipmentSource">
              <el-select v-model="formData.equipmentSource" placeholder="请选择设备来源" clearable class="!w-full">
                <el-option label="自研" value="自研" />
                <el-option label="外购" value="外购" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联研制项目" prop="projectId">
              <el-input v-model="formData.projectId" placeholder="关联EM-07研制项目编号" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>

  <!-- 设备类型选择弹窗 -->
  <TableSelectDialog
    ref="equipmentTypeSelectRef"
    title="选择设备类型"
    :columns="equipmentTypeColumns"
    :fetch-api="EquipmentApi.getEquipmentTypePage"
    :field-mapping="equipmentTypeMapping"
    :paginated="true"
    width="850px"
    @select="handleEquipmentTypeSelect"
  />

  <!-- 设备分类选择弹窗 -->
  <TableSelectDialog
    ref="equipmentCategorySelectRef"
    title="选择设备分类"
    :columns="equipmentCategoryColumns"
    :fetch-api="EquipmentApi.getEquipmentCategoryList"
    :field-mapping="equipmentCategoryMapping"
    :paginated="true"
    width="650px"
    @select="handleEquipmentCategorySelect"
  />

  <!-- 供应商选择弹窗 -->
  <TableSelectDialog
    ref="supplierSelectRef"
    title="选择供应商"
    :columns="supplierColumns"
    :fetch-api="EquipmentApi.getSupplierList"
    :field-mapping="supplierMapping"
    :paginated="true"
    width="1000px"
    @select="handleSupplierSelect"
  />
</template>

<script lang="ts" setup>
import * as EquipmentApi from '@/api/eam/optEquipment'
import { useEamEnumStore } from '@/store/modules/enums'
import TableSelectDialog from '@/components/TableSelectDialog/index.vue'
import type { TableColumn, FieldMapping } from '@/components/TableSelectDialog/index.vue'
import { usePlant } from '@/hooks/web/usePlant'

defineOptions({ name: 'EamOptEquipmentForm' })

const { showIotFields, showProjectFields } = usePlant()

const message = useMessage()
const { t } = useI18n()
const eamEnumStore = useEamEnumStore()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formRef = ref()

const formData = ref({
  id: undefined as string | undefined,
  equipmentSn: '',
  equipmentName: '',
  equipmentType: '',
  equipmentTypeDesc: '',
  equipmentCategory: '',
  equipmentCategoryDesc: '',
  equipmentMode: '',
  equipmentTag: '',
  locationSn: '',
  equipmentSupplier: '',
  equipmentSupplierName: '',
  equipmentStatus: '',
  operationStatus: '',
  equipmentRevstop: '',
  sequenceNumber: undefined as number | undefined,
  equipmentPurchase: '',
  equipmentOperating: '',
  // 宇树扩展字段
  workshopName: '',
  productionLineName: '',
  departmentName: '',
  responsiblePersonName: '',
  maintenanceUnit: '',
  maintenanceCycle: '',
  hasOperationGuide: '',
  // 数控机加IoT
  manufacturer: '',
  systemVersion: '',
  commProtocol: '',
  commInterface: '',
  // C端非标
  equipmentSource: '',
  projectId: ''
})

const formRules = reactive({
  equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  equipmentType: [{ required: true, message: '请选择设备类型', trigger: 'change' }],
  equipmentCategory: [{ required: true, message: '请选择设备分类', trigger: 'change' }]
})

const resetForm = () => {
  formData.value = {
    id: undefined,
    equipmentSn: '',
    equipmentName: '',
    equipmentType: '',
    equipmentTypeDesc: '',
    equipmentCategory: '',
    equipmentCategoryDesc: '',
    equipmentMode: '',
    equipmentTag: '',
    locationSn: '',
    equipmentSupplier: '',
    equipmentSupplierName: '',
    equipmentStatus: '',
    operationStatus: '',
    equipmentRevstop: '',
    sequenceNumber: undefined,
    equipmentPurchase: '',
    equipmentOperating: '',
    // 宇树扩展字段
    workshopName: '',
    productionLineName: '',
    departmentName: '',
    responsiblePersonName: '',
    maintenanceUnit: '',
    maintenanceCycle: '',
    hasOperationGuide: '',
    // 数控机加IoT
    manufacturer: '',
    systemVersion: '',
    commProtocol: '',
    commInterface: '',
    // C端非标
    equipmentSource: '',
    projectId: ''
  }
  formRef.value?.resetFields()
}

// ==================== 设备类型选择器 ====================
const equipmentTypeSelectRef = ref()
const equipmentTypeColumns: TableColumn[] = [
  { prop: 'typeCode', label: '设备类型编码', width: 140, searchable: true },
  { prop: 'typeName', label: '设备类型名称', minWidth: 150, searchable: true },
  { prop: 'categoryCode', label: '设备分类编号', width: 120 },
  { prop: 'categoryName', label: '设备分类名称', minWidth: 120 }
]
const equipmentTypeMapping: FieldMapping[] = [
  { from: 'typeCode', to: 'equipmentType' },
  { from: 'typeName', to: 'equipmentTypeDesc' },
  { from: 'categoryCode', to: 'equipmentCategory' },
  { from: 'categoryName', to: 'equipmentCategoryDesc' }
]
const openEquipmentTypeSelect = () => {
  equipmentTypeSelectRef.value.open()
}
const handleEquipmentTypeSelect = (_row: any, mapped: Record<string, any>) => {
  formData.value.equipmentType = mapped.equipmentType ?? ''
  formData.value.equipmentTypeDesc = mapped.equipmentTypeDesc ?? ''
  formData.value.equipmentCategory = mapped.equipmentCategory ?? ''
  formData.value.equipmentCategoryDesc = mapped.equipmentCategoryDesc ?? ''
}

// ==================== 设备分类选择器 ====================
const equipmentCategorySelectRef = ref()
const equipmentCategoryColumns: TableColumn[] = [
  { prop: 'categoryCode', label: '设备分类编码', width: 200, searchable: true },
  { prop: 'categoryName', label: '设备分类名称', minWidth: 200, searchable: true }
]
const equipmentCategoryMapping: FieldMapping[] = [
  { from: 'categoryCode', to: 'equipmentCategory' },
  { from: 'categoryName', to: 'equipmentCategoryDesc' }
]
const openEquipmentCategorySelect = () => {
  equipmentCategorySelectRef.value.open()
}
const handleEquipmentCategorySelect = (_row: any, mapped: Record<string, any>) => {
  formData.value.equipmentCategory = mapped.equipmentCategory ?? ''
  formData.value.equipmentCategoryDesc = mapped.equipmentCategoryDesc ?? ''
}

// ==================== 供应商选择器 ====================
const supplierSelectRef = ref()
const supplierColumns: TableColumn[] = [
  { prop: 'supplierSn', label: '供应商编号', width: 120, searchable: true },
  { prop: 'supplierName', label: '供应商名称', minWidth: 150, searchable: true },
  {
    prop: 'supplierCategory',
    label: '供应商类别',
    width: 120,
    formatter: (_row: any, value: any) => eamEnumStore.getSupplierCategoryText(value ?? '')
  },
  { prop: 'createTime', label: '建档日期', width: 170 },
  {
    prop: 'supplierGoods',
    label: '供应设备类别',
    width: 120,
    formatter: (_row: any, value: any) => eamEnumStore.getSupplierGoodsText(value ?? '')
  },
  {
    prop: 'supplierStatus',
    label: '供应商状态',
    width: 100,
    formatter: (_row: any, value: any) => eamEnumStore.getSupplierStatusText(value ?? '')
  }
]
const supplierMapping: FieldMapping[] = [
  { from: 'supplierSn', to: 'equipmentSupplier' },
  { from: 'supplierName', to: 'equipmentSupplierName' }
]
const openSupplierSelect = async () => {
  // 确保供应商相关枚举已加载（用于列格式化）
  await eamEnumStore.loadSupplierEnums()
  supplierSelectRef.value.open()
}
const handleSupplierSelect = (_row: any, mapped: Record<string, any>) => {
  formData.value.equipmentSupplier = mapped.equipmentSupplier ?? ''
  formData.value.equipmentSupplierName = mapped.equipmentSupplierName ?? ''
}

// ==================== 弹窗操作 ====================

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增设备档案' : '编辑设备档案'
  formType.value = type
  resetForm()
  // 加载枚举数据
  await eamEnumStore.loadEquipmentEnums()
  // 编辑模式：加载详情
  if (id) {
    formLoading.value = true
    try {
      const res = await EquipmentApi.getEquipmentById(id)
      formData.value = {
        id: res.id ?? undefined,
        equipmentSn: res.equipmentSn ?? '',
        equipmentName: res.equipmentName ?? '',
        equipmentType: res.equipmentType ?? '',
        equipmentTypeDesc: res.equipmentTypeDesc ?? '',
        equipmentCategory: res.equipmentCategory ?? '',
        equipmentCategoryDesc: res.equipmentCategoryDesc ?? '',
        equipmentMode: res.equipmentMode ?? '',
        equipmentTag: res.equipmentTag ?? '',
        locationSn: res.locationSn ?? '',
        equipmentSupplier: res.equipmentSupplier ?? '',
        equipmentSupplierName: res.equipmentSupplierName ?? '',
        equipmentStatus: res.equipmentStatus ?? '',
        operationStatus: res.operationStatus ?? '',
        equipmentRevstop: res.equipmentRevstop ?? '',
        sequenceNumber: res.sequenceNumber ?? undefined,
        equipmentPurchase: res.equipmentPurchase ?? '',
        equipmentOperating: res.equipmentOperating ?? '',
        // 宇树扩展字段
        workshopName: res.workshopName ?? '',
        productionLineName: res.productionLineName ?? '',
        departmentName: res.departmentName ?? '',
        responsiblePersonName: res.responsiblePersonName ?? '',
        maintenanceUnit: res.maintenanceUnit ?? '',
        maintenanceCycle: res.maintenanceCycle ?? '',
        hasOperationGuide: res.hasOperationGuide ?? '',
        // 数控机加IoT
        manufacturer: res.manufacturer ?? '',
        systemVersion: res.systemVersion ?? '',
        commProtocol: res.commProtocol ?? '',
        commInterface: res.commInterface ?? '',
        // C端非标
        equipmentSource: res.equipmentSource ?? '',
        projectId: res.projectId ?? ''
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = { ...formData.value } as EquipmentApi.OptEquipmentSaveDto
    if (formType.value === 'create') {
      await EquipmentApi.createEquipment(data)
      message.success(t('common.createSuccess'))
    } else {
      await EquipmentApi.updateEquipment(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
