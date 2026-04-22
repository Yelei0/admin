import React, { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Space,
  Tag,
  message,
  Modal,
  Descriptions,
  Row,
  Col,
} from 'antd'
import { PlusOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'

// 货物类别及应急措施
const mockGoodsCategories = [
  {
    category: '液化石油气',
    measures: '远离火源，保持通风，使用防爆设备。泄漏时切断气源，喷雾状水稀释，高温时用大量水冷却罐体。',
  },
  {
    category: '硫酸',
    measures: '穿戴防护装备，避免接触皮肤和眼睛。泄漏时用砂土或石灰中和，收集处理。',
  },
  {
    category: '液氨',
    measures: '佩戴防毒面具，保持通风。泄漏时用大量水稀释，注意收集处理。',
  },
  {
    category: '柴油',
    measures: '远离火源，使用防爆设备。泄漏时用砂土吸收，收集处理。',
  },
]

// 模拟托运企业数据
const mockShippers = [
  { id: '1', name: '中石化销售有限公司' },
  { id: '2', name: '中石油运输公司' },
  { id: '3', name: '恒力石化有限公司' },
]

// 模拟承运企业数据
const mockCarriers = [
  { id: '1', name: '危险品运输集团' },
  { id: '2', name: '安全运输有限公司' },
  { id: '3', name: '恒通物流集团' },
]

// 批次计划接口
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

// 驾驶员接口
interface Driver {
  id: string
  name: string
  phone: string
  licenseNo: string
}

// 押运员接口
interface Escort {
  id: string
  name: string
  phone: string
  certificateNo: string
}

// 计划明细接口
interface PlanDetail {
  id: string
  planDetailNo: string
  batchPlanId: string
  batchPlanNo: string
  escortBatchNo?: string // 押运批次号
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

// 初始模拟数据
const initialMockData: PlanDetail[] = [
  {
    id: '1',
    planDetailNo: 'PD20240101001',
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
    planDetailNo: 'PD20240101002',
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
    planDetailNo: 'PD20240101003',
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
    planDetailNo: 'PD20240101004',
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
    planDetailNo: 'PD20240102001',
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
    planDetailNo: 'PD20240102002',
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
    planDetailNo: 'PD20240101005',
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
    planDetailNo: 'PD20240101006',
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
    planDetailNo: 'PD20240101007',
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
    planDetailNo: 'PD20240102003',
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
    planDetailNo: 'PD20240102004',
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

const PlanApprovalPage = () => {
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<PlanDetail[]>(initialMockData)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<PlanDetail | null>(null)

  const columns = [
    {
      title: '计划明细号',
      dataIndex: 'planDetailNo',
      key: 'planDetailNo',
      width: 150,
    },
    {
      title: '批次计划编号',
      dataIndex: 'batchPlanNo',
      key: 'batchPlanNo',
      width: 150,
    },
    {
      title: '押运批次号',
      dataIndex: 'escortBatchNo',
      key: 'escortBatchNo',
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
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
    },
    {
      title: '审批时间',
      dataIndex: 'approvalTime',
      key: 'approvalTime',
      width: 150,
    },
    {
      title: '到达集结点时间',
      dataIndex: 'assembleArrivalTime',
      key: 'assembleArrivalTime',
      width: 150,
    },
    {
      title: '培训完成时间',
      dataIndex: 'trainingCompleteTime',
      key: 'trainingCompleteTime',
      width: 150,
    },
    {
      title: '自查完成时间',
      dataIndex: 'selfCheckCompleteTime',
      key: 'selfCheckCompleteTime',
      width: 150,
    },
    {
      title: '自查确认时间',
      dataIndex: 'selfCheckConfirmTime',
      key: 'selfCheckConfirmTime',
      width: 150,
    },
    {
      title: '编队完成时间',
      dataIndex: 'formingCompleteTime',
      key: 'formingCompleteTime',
      width: 150,
    },
    {
      title: '上桥审批时间',
      dataIndex: 'bridgeApprovalTime',
      key: 'bridgeApprovalTime',
      width: 150,
    },
    {
      title: '押运开始时间',
      dataIndex: 'escortStartTime',
      key: 'escortStartTime',
      width: 150,
    },
    {
      title: '完成时间',
      dataIndex: 'completeTime',
      key: 'completeTime',
      width: 150,
    },
    {
      title: '取消时间',
      dataIndex: 'cancelTime',
      key: 'cancelTime',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: PlanDetail) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => viewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                danger
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
              <Button
                type="text"
                onClick={() => handleApprove(record.id)}
              >
                通过
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  const viewDetail = (record: PlanDetail) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  const handleApprove = (id: string) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, status: 'waiting_assemble', approvalTime: new Date().toLocaleString('zh-CN') } 
        : item
    ))
    message.success('审批通过成功')
  }

  const handleReject = (id: string) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, status: 'rejected', approvalTime: new Date().toLocaleString('zh-CN') } 
        : item
    ))
    message.success('审批驳回成功')
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
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看和审批运输计划明细，包括批次计划信息、车辆驾押信息等详细内容</p>
        </div>
      </div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="计划明细号" name="planDetailNo">
          <Input placeholder="请输入计划明细号" />
        </Form.Item>
        <Form.Item label="批次计划编号" name="batchPlanNo">
          <Input placeholder="请输入批次计划编号" />
        </Form.Item>
        <Form.Item label="押运批次号" name="escortBatchNo">
          <Input placeholder="请输入押运批次号" />
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
        <Form.Item label="驾驶员" name="driverName">
          <Input placeholder="请输入驾驶员" />
        </Form.Item>
        <Form.Item label="押运员" name="escortName">
          <Input placeholder="请输入押运员" />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Input placeholder="请输入状态" />
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
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{
          x: 2800,
          y: 600,
        }}
      />

      <Modal
        title="计划明细详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentRecord && (
          <div>
            <Descriptions title="基本信息" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="计划明细号">{currentRecord.planDetailNo}</Descriptions.Item>
              <Descriptions.Item label="批次计划编号">{currentRecord.batchPlanNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentRecord.planDate}</Descriptions.Item>
              <Descriptions.Item label="时间段">{currentRecord.timeRange}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{currentRecord.goodsCategory}</Descriptions.Item>
              <Descriptions.Item label="托运企业">{currentRecord.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业">{currentRecord.carrierName}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
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
                  const statusInfo = statusMap[currentRecord.status]
                  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
                })()}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="车辆信息" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="车头">{currentRecord.headVehicle}</Descriptions.Item>
              <Descriptions.Item label="挂车">{currentRecord.trailer}</Descriptions.Item>
              <Descriptions.Item label="驾驶员">{currentRecord.driverName} / {currentRecord.driverPhone}</Descriptions.Item>
              <Descriptions.Item label="押运员">{currentRecord.escortName} / {currentRecord.escortPhone}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="应急措施" bordered>
              <Descriptions.Item label="应急措施" span={3}>
                {currentRecord.emergencyMeasures}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="时间信息" bordered style={{ marginTop: 24 }}>
              {currentRecord.createTime && (
                <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
              )}
              {currentRecord.approvalTime && (
                <Descriptions.Item label="审批时间">{currentRecord.approvalTime}</Descriptions.Item>
              )}
              {currentRecord.assembleArrivalTime && (
                <Descriptions.Item label="到达集结点时间">{currentRecord.assembleArrivalTime}</Descriptions.Item>
              )}
              {currentRecord.trainingCompleteTime && (
                <Descriptions.Item label="培训完成时间">{currentRecord.trainingCompleteTime}</Descriptions.Item>
              )}
              {currentRecord.selfCheckCompleteTime && (
                <Descriptions.Item label="自查完成时间">{currentRecord.selfCheckCompleteTime}</Descriptions.Item>
              )}
              {currentRecord.selfCheckConfirmTime && (
                <Descriptions.Item label="自查确认时间">{currentRecord.selfCheckConfirmTime}</Descriptions.Item>
              )}
              {currentRecord.formingCompleteTime && (
                <Descriptions.Item label="编队完成时间">{currentRecord.formingCompleteTime}</Descriptions.Item>
              )}
              {currentRecord.bridgeApprovalTime && (
                <Descriptions.Item label="上桥审批时间">{currentRecord.bridgeApprovalTime}</Descriptions.Item>
              )}
              {currentRecord.escortStartTime && (
                <Descriptions.Item label="押运开始时间">{currentRecord.escortStartTime}</Descriptions.Item>
              )}
              {currentRecord.completeTime && (
                <Descriptions.Item label="完成时间">{currentRecord.completeTime}</Descriptions.Item>
              )}
              {currentRecord.cancelTime && (
                <Descriptions.Item label="取消时间">{currentRecord.cancelTime}</Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default PlanApprovalPage
