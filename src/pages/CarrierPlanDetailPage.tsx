import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Row,
  Col,
  Divider,
  Tag,
  AutoComplete,
  Steps,
  Descriptions,
  List
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Option } = Select
const { Step } = Steps

interface BatchPlan {
  id: string
  planNo: string
  planDate: string
  timeRange: string
  goodsCategory: string
  emergencyMeasures: string
  totalVehicles: number
  usedVehicles: number
  shipperId: string
  shipperName: string
  carrierId: string
  carrierName: string
}

interface VehicleInfo {
  id: string
  headVehicle: string
  trailer: string
  driverId: string
  driverName: string
  driverPhone: string
  escortId: string
  escortName: string
  escortPhone: string
}

interface Driver {
  id: string
  name: string
  phone: string
  licenseNo: string
}

interface Escort {
  id: string
  name: string
  phone: string
  certificateNo: string
}

interface PlanDetail {
  id: string
  batchPlanId: string
  batchPlanNo: string
  planDate: string
  timeRange: string
  goodsCategory: string
  emergencyMeasures: string
  headVehicle: string
  trailer: string
  driverId: string
  driverName: string
  driverPhone: string
  escortId: string
  escortName: string
  escortPhone: string
  shipperName: string
  carrierName: string
  status: 'pending' | 'rejected' | 'waiting_assemble' | 'waiting_training' | 'waiting_self_check' | 'self_check_waiting_confirm' | 'waiting_forming' | 'waiting_bridge_approval' | 'escorting' | 'completed' | 'cancelled'
  createTime?: string
  approvalTime?: string
  assembleArrivalTime?: string
  trainingCompleteTime?: string
  selfCheckCompleteTime?: string
  selfCheckConfirmTime?: string
  formingCompleteTime?: string
  bridgeApprovalTime?: string
  escortStartTime?: string
  completeTime?: string
  cancelTime?: string
}

// 模拟托运企业数据
const mockShippers = [
  { id: '1', name: '中石化销售有限公司' },
  { id: '2', name: '中石油运输公司' },
  { id: '3', name: '恒力石化有限公司' },
]



// 模拟货物品类数据（带应急处置措施）
const mockGoodsCategories = [
  { category: '液化石油气', measures: '远离火源，保持通风，使用防爆设备。泄漏时切断气源，喷雾状水稀释，高温时用大量水冷却罐体。' },
  { category: '硫酸', measures: '避免接触皮肤和眼睛，使用防护装备。泄漏时用碱中和，覆盖砂土，收集处理。' },
  { category: '液氯', measures: '佩戴防毒面具，向上风向疏散，用水雾稀释。眼睛接触用大量水冲洗。' },
  { category: '柴油', measures: '防火防爆，切断火源。用泡沫覆盖泄露区域，收集后处理。' },
  { category: '汽油', measures: '防火防爆，消除静电。使用防爆工具，喷雾状水冷却。' },
  { category: '甲醇', measures: '防火防毒，佩戴防护装备。泄漏时用抗溶性泡沫覆盖，切断火源。' },
  { category: '苯', measures: '佩戴防毒面具，远离热源。泄漏时用活性炭吸附，通风换气。' },
  { category: '氨水', measures: '佩戴防护装备，通风不良时戴呼吸器。用大量水冲洗，收集废水处理。' },
]

// 模拟车头数据
const mockHeadVehicles = [
  '浙A12345',
  '浙B67890',
  '浙C11111',
  '浙D22222',
  '浙E33333',
  '沪A99999',
  '沪B88888',
  '苏A77777',
  '苏B66666',
  '京A55555',
  '京B44444',
  '粤A33333',
  '粤B22222',
]

// 模拟挂车数据（格式：浙A1223挂）
const mockTrailers = [
  '浙A1223挂',
  '浙B4567挂',
  '浙C8910挂',
  '浙D1122挂',
  '浙E3344挂',
  '浙F5566挂',
  '沪A7788挂',
  '沪B9900挂',
  '苏A1122挂',
  '苏B3344挂',
  '京A5566挂',
  '京B7788挂',
  '粤A9900挂',
  '粤B1122挂',
]

// 模拟批次计划数据
const mockBatchPlans: BatchPlan[] = [
  {
    id: '1',
    planNo: 'PL20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 5,
    usedVehicles: 2,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
  },
  {
    id: '2',
    planNo: 'PL20240101002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 3,
    usedVehicles: 0,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
  },
  {
    id: '3',
    planNo: 'PL20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 8,
    usedVehicles: 3,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
  },
]

// 模拟驾驶员数据
const mockDrivers: Driver[] = [
  { id: 'D001', name: '张师傅', phone: '13800138001', licenseNo: 'A123456' },
  { id: 'D002', name: '李师傅', phone: '13800138002', licenseNo: 'A123457' },
  { id: 'D003', name: '王师傅', phone: '13800138003', licenseNo: 'A123458' },
  { id: 'D004', name: '赵师傅', phone: '13800138004', licenseNo: 'B123456' },
  { id: 'D005', name: '钱师傅', phone: '13800138005', licenseNo: 'B123457' },
]

// 模拟押运员数据
const mockEscorts: Escort[] = [
  { id: 'E001', name: '赵押运', phone: '13900139001', certificateNo: 'Y123456' },
  { id: 'E002', name: '钱押运', phone: '13900139002', certificateNo: 'Y123457' },
  { id: 'E003', name: '孙押运', phone: '13900139003', certificateNo: 'Y123458' },
  { id: 'E004', name: '李押运', phone: '13900139004', certificateNo: 'Y123459' },
  { id: 'E005', name: '周押运', phone: '13900139005', certificateNo: 'Y123460' },
]

// 初始模拟数据
const initialMockData: PlanDetail[] = [
  {
    id: '1',
    batchPlanId: '1',
    batchPlanNo: 'PL20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    headVehicle: '浙A12345',
    trailer: '浙A1223挂',
    driverId: 'D001',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortId: 'E001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    status: 'pending',
    createTime: '2024-01-14 10:00:00',
  },
  {
    id: '2',
    batchPlanId: '1',
    batchPlanNo: 'PL20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    headVehicle: '浙B67890',
    trailer: '浙B4567挂',
    driverId: 'D002',
    driverName: '李师傅',
    driverPhone: '13800138002',
    escortId: 'E002',
    escortName: '钱押运',
    escortPhone: '13900139002',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    status: 'rejected',
    createTime: '2024-01-14 09:30:00',
    approvalTime: '2024-01-14 11:00:00',
  },
  {
    id: '3',
    batchPlanId: '2',
    batchPlanNo: 'PL20240101002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    headVehicle: '浙C11111',
    trailer: '浙C8910挂',
    driverId: 'D003',
    driverName: '王师傅',
    driverPhone: '13800138003',
    escortId: 'E003',
    escortName: '孙押运',
    escortPhone: '13900139003',
    shipperName: '中石油运输公司',
    carrierName: '安全运输有限公司',
    status: 'waiting_assemble',
    createTime: '2024-01-15 14:00:00',
    approvalTime: '2024-01-15 15:30:00',
  },
  {
    id: '4',
    batchPlanId: '2',
    batchPlanNo: 'PL20240101002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    headVehicle: '浙D22222',
    trailer: '浙D1122挂',
    driverId: 'D004',
    driverName: '赵师傅',
    driverPhone: '13800138004',
    escortId: 'E004',
    escortName: '李押运',
    escortPhone: '13900139004',
    shipperName: '中石油运输公司',
    carrierName: '安全运输有限公司',
    status: 'waiting_training',
    createTime: '2024-01-15 14:30:00',
    approvalTime: '2024-01-15 15:45:00',
    assembleArrivalTime: '2024-01-16 13:00:00',
  },
  {
    id: '5',
    batchPlanId: '3',
    batchPlanNo: 'PL20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    headVehicle: '浙E33333',
    trailer: '浙E3344挂',
    driverId: 'D005',
    driverName: '钱师傅',
    driverPhone: '13800138005',
    escortId: 'E005',
    escortName: '周押运',
    escortPhone: '13900139005',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    status: 'waiting_self_check',
    createTime: '2024-01-19 09:00:00',
    approvalTime: '2024-01-19 10:30:00',
    assembleArrivalTime: '2024-01-20 08:30:00',
    trainingCompleteTime: '2024-01-20 09:30:00',
  },
  {
    id: '6',
    batchPlanId: '3',
    batchPlanNo: 'PL20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    headVehicle: '沪A99999',
    trailer: '沪A7788挂',
    driverId: 'D001',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortId: 'E001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    status: 'self_check_waiting_confirm',
    createTime: '2024-01-19 09:30:00',
    approvalTime: '2024-01-19 10:45:00',
    assembleArrivalTime: '2024-01-20 08:45:00',
    trainingCompleteTime: '2024-01-20 09:45:00',
    selfCheckCompleteTime: '2024-01-20 10:30:00',
  },
  {
    id: '7',
    batchPlanId: '1',
    batchPlanNo: 'PL20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    headVehicle: '沪B88888',
    trailer: '沪B9900挂',
    driverId: 'D002',
    driverName: '李师傅',
    driverPhone: '13800138002',
    escortId: 'E002',
    escortName: '钱押运',
    escortPhone: '13900139002',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    status: 'waiting_forming',
    createTime: '2024-01-14 10:30:00',
    approvalTime: '2024-01-14 11:30:00',
    assembleArrivalTime: '2024-01-15 07:30:00',
    trainingCompleteTime: '2024-01-15 08:30:00',
    selfCheckCompleteTime: '2024-01-15 09:00:00',
    selfCheckConfirmTime: '2024-01-15 09:30:00',
  },
  {
    id: '8',
    batchPlanId: '1',
    batchPlanNo: 'PL20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    headVehicle: '苏A77777',
    trailer: '苏A1122挂',
    driverId: 'D003',
    driverName: '王师傅',
    driverPhone: '13800138003',
    escortId: 'E003',
    escortName: '孙押运',
    escortPhone: '13900139003',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    status: 'waiting_bridge_approval',
    createTime: '2024-01-14 11:00:00',
    approvalTime: '2024-01-14 12:00:00',
    assembleArrivalTime: '2024-01-15 07:45:00',
    trainingCompleteTime: '2024-01-15 08:45:00',
    selfCheckCompleteTime: '2024-01-15 09:15:00',
    selfCheckConfirmTime: '2024-01-15 09:45:00',
    formingCompleteTime: '2024-01-15 10:00:00',
  },
  {
    id: '9',
    batchPlanId: '2',
    batchPlanNo: 'PL20240101002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    headVehicle: '苏B66666',
    trailer: '苏B3344挂',
    driverId: 'D004',
    driverName: '赵师傅',
    driverPhone: '13800138004',
    escortId: 'E004',
    escortName: '李押运',
    escortPhone: '13900139004',
    shipperName: '中石油运输公司',
    carrierName: '安全运输有限公司',
    status: 'escorting',
    createTime: '2024-01-15 15:00:00',
    approvalTime: '2024-01-15 16:00:00',
    assembleArrivalTime: '2024-01-16 13:15:00',
    trainingCompleteTime: '2024-01-16 13:45:00',
    selfCheckCompleteTime: '2024-01-16 14:00:00',
    selfCheckConfirmTime: '2024-01-16 14:15:00',
    formingCompleteTime: '2024-01-16 14:30:00',
    bridgeApprovalTime: '2024-01-16 14:45:00',
    escortStartTime: '2024-01-16 15:00:00',
  },
  {
    id: '10',
    batchPlanId: '3',
    batchPlanNo: 'PL20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    headVehicle: '京A55555',
    trailer: '京A5566挂',
    driverId: 'D005',
    driverName: '钱师傅',
    driverPhone: '13800138005',
    escortId: 'E005',
    escortName: '周押运',
    escortPhone: '13900139005',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    status: 'completed',
    createTime: '2024-01-19 10:00:00',
    approvalTime: '2024-01-19 11:00:00',
    assembleArrivalTime: '2024-01-20 08:00:00',
    trainingCompleteTime: '2024-01-20 09:00:00',
    selfCheckCompleteTime: '2024-01-20 09:30:00',
    selfCheckConfirmTime: '2024-01-20 10:00:00',
    formingCompleteTime: '2024-01-20 10:30:00',
    bridgeApprovalTime: '2024-01-20 11:00:00',
    escortStartTime: '2024-01-20 11:30:00',
    completeTime: '2024-01-20 16:00:00',
  },
  {
    id: '11',
    batchPlanId: '3',
    batchPlanNo: 'PL20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    headVehicle: '京B44444',
    trailer: '京B7788挂',
    driverId: 'D001',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortId: 'E001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    status: 'cancelled',
    createTime: '2024-01-19 10:30:00',
    cancelTime: '2024-01-19 12:00:00',
  },
]

const CarrierPlanDetailPage = () => {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<PlanDetail[]>(initialMockData)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<PlanDetail | null>(null)
  const [selectedBatchPlan, setSelectedBatchPlan] = useState<BatchPlan | null>(null)
  const [selectedShipper, setSelectedShipper] = useState<string>('')
  const [headVehicleOptions, setHeadVehicleOptions] = useState<string[]>([])
  const [trailerOptions, setTrailerOptions] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [vehicleList, setVehicleList] = useState<VehicleInfo[]>([])
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})

  const columns = [
    {
      title: '批次计划编号',
      dataIndex: 'batchPlanNo',
      key: 'batchPlanNo',
      width: 150,
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      width: 120,
    },
    {
      title: '时间段',
      dataIndex: 'timeRange',
      key: 'timeRange',
      width: 120,
    },
    {
      title: '托运企业',
      dataIndex: 'shipperName',
      key: 'shipperName',
      width: 150,
    },
    {
      title: '承运企业',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 150,
    },
    {
      title: '货物品类',
      dataIndex: 'goodsCategory',
      key: 'goodsCategory',
      width: 100,
    },
    {
      title: '车头',
      dataIndex: 'headVehicle',
      key: 'headVehicle',
      width: 100,
    },
    {
      title: '挂车',
      dataIndex: 'trailer',
      key: 'trailer',
      width: 100,
    },
    {
      title: '驾驶员',
      dataIndex: 'driverName',
      key: 'driverName',
      width: 100,
      render: (text: string, record: PlanDetail) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.driverPhone}</div>
        </div>
      ),
    },
    {
      title: '押运员',
      dataIndex: 'escortName',
      key: 'escortName',
      width: 100,
      render: (text: string, record: PlanDetail) => (
        <div>
          <div>{text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{record.escortPhone}</div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: 'pending' | 'rejected' | 'waiting_assemble' | 'waiting_training' | 'waiting_self_check' | 'self_check_waiting_confirm' | 'waiting_forming' | 'waiting_bridge_approval' | 'escorting' | 'completed' | 'cancelled') => {
        const statusMap = {
          pending: { color: 'blue', text: '待审批' },
          rejected: { color: 'red', text: '已驳回' },
          waiting_assemble: { color: 'orange', text: '待集结' },
          waiting_training: { color: 'cyan', text: '待培训' },
          waiting_self_check: { color: 'purple', text: '待自查' },
          self_check_waiting_confirm: { color: 'geekblue', text: '自查待确认' },
          waiting_forming: { color: 'lime', text: '待编队' },
          waiting_bridge_approval: { color: 'gold', text: '待上桥审批' },
          escorting: { color: 'green', text: '押运中' },
          completed: { color: 'success', text: '已完成' },
          cancelled: { color: 'default', text: '已取消' },
        }
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: PlanDetail) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条明细吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingRecord(null)
    setSelectedBatchPlan(null)
    setSelectedShipper('')
    form.resetFields()
    setHeadVehicleOptions([])
    setTrailerOptions([])
    setCurrentStep(0)
    setVehicleList([])
    setIsModalOpen(true)
  }

  const handleEdit = (record: PlanDetail) => {
    setEditingRecord(record)
    const batchPlan = mockBatchPlans.find(bp => bp.id === record.batchPlanId)
    setSelectedBatchPlan(batchPlan || null)
    setHeadVehicleOptions([record.headVehicle])
    setTrailerOptions([record.trailer])
    form.setFieldsValue({
      ...record,
      batchPlanId: record.batchPlanId,
      driverId: record.driverId,
      escortId: record.escortId,
    })
    setCurrentStep(0)
    setVehicleList([{
      id: record.id,
      headVehicle: record.headVehicle,
      trailer: record.trailer,
      driverId: record.driverId,
      driverName: record.driverName,
      driverPhone: record.driverPhone,
      escortId: record.escortId,
      escortName: record.escortName,
      escortPhone: record.escortPhone,
    }])
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleBatchPlanChange = (batchPlanId: string) => {
    const batchPlan = mockBatchPlans.find(bp => bp.id === batchPlanId)
    setSelectedBatchPlan(batchPlan || null)

    if (batchPlan) {
      form.setFieldsValue({
        planDate: batchPlan.planDate,
        timeRange: batchPlan.timeRange,
        goodsCategory: batchPlan.goodsCategory,
        emergencyMeasures: batchPlan.emergencyMeasures,
      })
    }
  }

  const handleGoodsCategoryChange = (category: string) => {
    const goods = mockGoodsCategories.find(g => g.category === category)
    if (goods) {
      form.setFieldsValue({
        emergencyMeasures: goods.measures,
      })
    }
  }

  const handleHeadVehicleSearch = (value: string) => {
    if (value && value.length >= 1) {
      const filtered = mockHeadVehicles.filter(v =>
        v.toLowerCase().includes(value.toLowerCase())
      )
      setHeadVehicleOptions(filtered)
    } else {
      setHeadVehicleOptions([])
    }
  }

  const handleTrailerSearch = (value: string) => {
    if (value && value.length >= 1) {
      const filtered = mockTrailers.filter(v =>
        v.toLowerCase().includes(value.toLowerCase())
      )
      setTrailerOptions(filtered)
    } else {
      setTrailerOptions([])
    }
  }

  const addVehicle = () => {
    if (!selectedBatchPlan) return
    
    const currentCount = vehicleList.length
    const availableCount = selectedBatchPlan.totalVehicles - selectedBatchPlan.usedVehicles - data.filter(d => d.batchPlanId === selectedBatchPlan.id && d.id !== editingRecord?.id).length
    
    if (currentCount >= availableCount) {
      message.error(`该批次最多还能添加 ${availableCount} 辆车`)
      return
    }

    setVehicleList([...vehicleList, {
      id: Date.now().toString(),
      headVehicle: '',
      trailer: '',
      driverId: '',
      driverName: '',
      driverPhone: '',
      escortId: '',
      escortName: '',
      escortPhone: '',
    }])
  }

  const removeVehicle = (id: string) => {
    setVehicleList(vehicleList.filter(v => v.id !== id))
  }

  const handleDriverChange = (index: number, driverId: string) => {
    const newVehicleList = [...vehicleList]
    const driver = mockDrivers.find(d => d.id === driverId)
    if (driver) {
      newVehicleList[index] = {
        ...newVehicleList[index],
        driverId,
        driverName: driver.name,
        driverPhone: driver.phone,
      }
      setVehicleList(newVehicleList)
    }
  }

  const handleEscortChange = (index: number, escortId: string) => {
    const newVehicleList = [...vehicleList]
    const escort = mockEscorts.find(e => e.id === escortId)
    if (escort) {
      newVehicleList[index] = {
        ...newVehicleList[index],
        escortId,
        escortName: escort.name,
        escortPhone: escort.phone,
      }
      setVehicleList(newVehicleList)
    }
  }

  const handleNextStep = () => {
    form.validateFields().then(() => {
      if (currentStep === 0) {
        if (!selectedBatchPlan) {
          message.error('请选择批次计划')
          return
        }
        setCurrentStep(1)
      } else if (currentStep === 1) {
        if (vehicleList.length === 0) {
          message.error('请至少添加一辆车')
          return
        }
        
        const hasEmptyFields = vehicleList.some(v => !v.headVehicle || !v.trailer || !v.driverId || !v.escortId)
        if (hasEmptyFields) {
          message.error('请完善所有车辆信息')
          return
        }
        
        setIsConfirmModalOpen(true)
      }
    })
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleConfirmSave = () => {
    if (!selectedBatchPlan) return
    
    const newRecords: PlanDetail[] = vehicleList.map(v => ({
      id: Date.now().toString() + Math.random(),
      batchPlanId: selectedBatchPlan.id,
      batchPlanNo: selectedBatchPlan.planNo,
      planDate: selectedBatchPlan.planDate,
      timeRange: selectedBatchPlan.timeRange,
      goodsCategory: selectedBatchPlan.goodsCategory,
      emergencyMeasures: selectedBatchPlan.emergencyMeasures,
      headVehicle: v.headVehicle,
      trailer: v.trailer,
      driverId: v.driverId,
      driverName: v.driverName,
      driverPhone: v.driverPhone,
      escortId: v.escortId,
      escortName: v.escortName,
      escortPhone: v.escortPhone,
      shipperName: selectedBatchPlan.shipperName,
      carrierName: selectedBatchPlan.carrierName,
      status: 'pending',
    }))

    setData([...data, ...newRecords])
    message.success('新增成功')
    setIsConfirmModalOpen(false)
    setIsModalOpen(false)
  }

  const handleSearch = (values: any) => {
    setSearchValues(values)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchValues({})
  }

  const filteredData = data.filter(item => {
    return Object.entries(searchValues).every(([key, value]) => {
      if (!value) return true
      const itemValue = item[key as keyof PlanDetail]
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }
      return true
    })
  })

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>计划明细管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理运输计划明细，包括批次计划信息、车辆驾押信息等详细内容</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增计划
        </Button>
      </div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="批次计划编号" name="batchPlanNo">
          <Input placeholder="请输入批次计划编号" />
        </Form.Item>
        <Form.Item label="计划日期" name="planDate">
          <Input placeholder="请输入计划日期" />
        </Form.Item>
        <Form.Item label="时间段" name="timeRange">
          <Input placeholder="请输入时间段" />
        </Form.Item>
        <Form.Item label="托运企业" name="shipperName">
          <Input placeholder="请输入托运企业" />
        </Form.Item>
        <Form.Item label="承运企业" name="carrierName">
          <Input placeholder="请输入承运企业" />
        </Form.Item>
        <Form.Item label="货物品类" name="goodsCategory">
          <Input placeholder="请输入货物品类" />
        </Form.Item>
        <Form.Item label="车头" name="headVehicle">
          <Input placeholder="请输入车头" />
        </Form.Item>
        <Form.Item label="挂车" name="trailer">
          <Input placeholder="请输入挂车" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态">
            <Option value="pending">待审批</Option>
            <Option value="approved">已批准</Option>
            <Option value="rejected">已拒绝</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              搜索
            </Button>
            <Button onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `共 ${total} 条记录`
        }}
        scroll={{ x: 1400, y: 'calc(100vh - 320px)' }}
      />

      <Modal
        title={editingRecord ? '编辑计划' : '新增计划'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          currentStep > 0 && (
            <Button key="prev" onClick={handlePrevStep}>
              上一步
            </Button>
          ),
          <Button key="next" type="primary" onClick={handleNextStep}>
            {currentStep === 1 ? '下一步' : '下一步'}
          </Button>,
        ]}
        width={1000}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="批次信息" />
          <Step title="车辆信息" />
          <Step title="确认提交" />
        </Steps>

        {currentStep === 0 && (
          <Form
            form={form}
            layout="vertical"
          >
            <Divider orientation="left">批次信息</Divider>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="托运企业"
                  name="shipperId"
                  rules={[{ required: true, message: '请选择托运企业' }]}
                >
                  <Select
                    placeholder="请选择托运企业"
                    onChange={(value) => {
                      setSelectedShipper(value)
                      setSelectedBatchPlan(null)
                      form.setFieldsValue({ batchPlanId: undefined })
                    }}
                  >
                    {mockShippers.map(shipper => (
                      <Option key={shipper.id} value={shipper.id}>{shipper.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="批次计划编号"
                  name="batchPlanId"
                  rules={[{ required: true, message: '请选择批次计划' }]}
                >
                  <Select
                    placeholder="请选择批次计划"
                    onChange={handleBatchPlanChange}
                    disabled={!selectedShipper}
                  >
                    {mockBatchPlans.map(plan => {
                      const availableCount = plan.totalVehicles - plan.usedVehicles
                      const currentBatchCount = data.filter(d => d.batchPlanId === plan.id && d.id !== editingRecord?.id).length
                      const canAdd = availableCount - currentBatchCount > 0
                      return (
                        <Option key={plan.id} value={plan.id} disabled={!canAdd}>
                          {plan.planNo} (可添加: {availableCount - currentBatchCount}辆)
                        </Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {selectedBatchPlan && (
              <>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="计划日期">
                      <Input value={selectedBatchPlan.planDate} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="时间段">
                      <Input value={selectedBatchPlan.timeRange} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="批次车数">
                      <Space>
                        <Tag color="blue">总数: {selectedBatchPlan.totalVehicles}</Tag>
                        <Tag color="green">可添加: {selectedBatchPlan.totalVehicles - selectedBatchPlan.usedVehicles - data.filter(d => d.batchPlanId === selectedBatchPlan.id && d.id !== editingRecord?.id).length}</Tag>
                      </Space>
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item label="托运企业">
                      <Input value={selectedBatchPlan.shipperName} disabled />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="承运企业">
                      <Input value={selectedBatchPlan.carrierName} disabled />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider orientation="left">货物信息</Divider>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="货物品类"
                      name="goodsCategory"
                      rules={[{ required: true, message: '请选择货物品类' }]}
                    >
                      <Select
                        placeholder="请选择货物品类"
                        onChange={handleGoodsCategoryChange}
                        showSearch
                        optionFilterProp="children"
                      >
                        {mockGoodsCategories.map(goods => (
                          <Option key={goods.category} value={goods.category}>
                            {goods.category}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label="应急处置措施">
                      <Input.TextArea
                        name="emergencyMeasures"
                        rows={3}
                        disabled
                        placeholder="选择货物品类后自动带出"
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        )}

        {currentStep === 1 && selectedBatchPlan && (
          <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4>车辆驾押信息</h4>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={addVehicle}
              >
                添加车辆
              </Button>
            </div>
            
            <List
              dataSource={vehicleList}
              renderItem={(vehicle, index) => (
                <List.Item
                  actions={[
                    <Button
                      key="delete"
                      danger
                      type="text"
                      onClick={() => removeVehicle(vehicle.id)}
                    >
                      删除
                    </Button>
                  ]}
                >
                  <div style={{ width: '100%' }}>
                    <h5 style={{ marginBottom: 12 }}>车辆 {index + 1}</h5>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="车头"
                          rules={[{ required: true, message: '请输入或选择车头' }]}
                        >
                          <AutoComplete
                            options={headVehicleOptions.map(v => ({ value: v }))}
                            onSearch={handleHeadVehicleSearch}
                            placeholder="输入或选择车牌号"
                            filterOption={false}
                            value={vehicle.headVehicle}
                            onChange={(value) => {
                              const newVehicleList = [...vehicleList]
                              newVehicleList[index].headVehicle = value
                              setVehicleList(newVehicleList)
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="挂车"
                          rules={[{ required: true, message: '请输入或选择挂车' }]}
                        >
                          <AutoComplete
                            options={trailerOptions.map(v => ({ value: v }))}
                            onSearch={handleTrailerSearch}
                            placeholder="输入或选择挂车牌号"
                            filterOption={false}
                            value={vehicle.trailer}
                            onChange={(value) => {
                              const newVehicleList = [...vehicleList]
                              newVehicleList[index].trailer = value
                              setVehicleList(newVehicleList)
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="驾驶员"
                          rules={[{ required: true, message: '请选择驾驶员' }]}
                        >
                          <Select
                            placeholder="请选择驾驶员"
                            value={vehicle.driverId}
                            onChange={(value) => handleDriverChange(index, value)}
                            showSearch
                            optionFilterProp="children"
                          >
                            {mockDrivers.map(driver => (
                              <Option key={driver.id} value={driver.id}>
                                {driver.name} / {driver.phone}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="驾驶员手机号">
                          <Input value={vehicle.driverPhone} disabled placeholder="选择驾驶员后自动带出" />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="押运员"
                          rules={[{ required: true, message: '请选择押运员' }]}
                        >
                          <Select
                            placeholder="请选择押运员"
                            value={vehicle.escortId}
                            onChange={(value) => handleEscortChange(index, value)}
                            showSearch
                            optionFilterProp="children"
                          >
                            {mockEscorts.map(escort => (
                              <Option key={escort.id} value={escort.id}>
                                {escort.name} / {escort.phone}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item label="押运员手机号">
                          <Input value={vehicle.escortPhone} disabled placeholder="选择押运员后自动带出" />
                        </Form.Item>
                      </Col>
                    </Row>
                  </div>
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="确认信息"
        open={isConfirmModalOpen}
        onOk={handleConfirmSave}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={800}
      >
        {selectedBatchPlan && (
          <div>
            <Descriptions title="批次信息" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="批次计划编号">{selectedBatchPlan.planNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{selectedBatchPlan.planDate}</Descriptions.Item>
              <Descriptions.Item label="时间段">{selectedBatchPlan.timeRange}</Descriptions.Item>
              <Descriptions.Item label="托运企业">{selectedBatchPlan.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业">{selectedBatchPlan.carrierName}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{selectedBatchPlan.goodsCategory}</Descriptions.Item>
            </Descriptions>

            <h4 style={{ marginBottom: 16 }}>车辆信息</h4>
            {vehicleList.map((vehicle, index) => (
              <Card key={vehicle.id} title={`车辆 ${index + 1}`} style={{ marginBottom: 16 }} size="small">
                <Row gutter={16}>
                  <Col span={12}>
                    <p><strong>车头：</strong>{vehicle.headVehicle}</p>
                    <p><strong>挂车：</strong>{vehicle.trailer}</p>
                  </Col>
                  <Col span={12}>
                    <p><strong>驾驶员：</strong>{vehicle.driverName} / {vehicle.driverPhone}</p>
                    <p><strong>押运员：</strong>{vehicle.escortName} / {vehicle.escortPhone}</p>
                  </Col>
                </Row>
              </Card>
            ))}

            <div style={{ marginTop: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
              <p><strong>提示：</strong>您正在添加 {vehicleList.length} 辆车，确认无误后点击确定提交。</p>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default CarrierPlanDetailPage
