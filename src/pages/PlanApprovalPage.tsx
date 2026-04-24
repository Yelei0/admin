import { useState } from 'react'
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
} from 'antd'
import { useNavigate } from 'react-router-dom'

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
  status: 'pending' | 'rejected' | 'waiting_assemble' | 'waiting_training' | 'waiting_self_check' | 'self_check_waiting_confirm' | 'self_check_rejected' | 'waiting_forming' | 'waiting_bridge_approval' | 'escorting' | 'completed' | 'cancelled'
  rejectReason?: string // 驳回原因
  selfCheckRejectReason?: string // 自查驳回原因
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
  // 自检自查信息
  selfCheckInfo?: {
    vehicleStatus: string
    driverStatus: string
    escortStatus: string
    cargoStatus: string
    safetyEquipment: string
    emergencyKit: string
    otherChecks: string
  }
}

// 模拟批次计划数据


// 初始模拟数据
const initialMockData: PlanDetail[] = [
  {
    id: '1',
    planDetailNo: 'MX20240101001',
    batchPlanId: '1',
    batchPlanNo: 'PC20240101001',
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
    planDetailNo: 'MX20240101002',
    batchPlanId: '1',
    batchPlanNo: 'PC20240101001',
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
    planDetailNo: 'MX20240101003',
    batchPlanId: '2',
    batchPlanNo: 'PC20240101002',
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
    planDetailNo: 'MX20240101004',
    batchPlanId: '2',
    batchPlanNo: 'PC20240101002',
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
    planDetailNo: 'MX20240102001',
    batchPlanId: '3',
    batchPlanNo: 'PC20240102001',
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
    planDetailNo: 'MX20240102002',
    batchPlanId: '3',
    batchPlanNo: 'PC20240102001',
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
    selfCheckInfo: {
      vehicleStatus: '车况良好，轮胎气压正常，制动系统正常',
      driverStatus: '精神状态良好，证件齐全有效',
      escortStatus: '精神状态良好，证件齐全有效',
      cargoStatus: '装载规范，固定牢固，无泄漏',
      safetyEquipment: '灭火器2个，三角警示牌1个，反光背心2件',
      emergencyKit: '应急药品齐全，防护用品齐全',
      otherChecks: '车辆外观整洁，标识清晰'
    }
  },
  {
    id: '7',
    planDetailNo: 'MX20240101005',
    batchPlanId: '1',
    batchPlanNo: 'PC20240101001',
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
    selfCheckInfo: {
      vehicleStatus: '车况良好，轮胎气压正常，制动系统正常',
      driverStatus: '精神状态良好，证件齐全有效',
      escortStatus: '精神状态良好，证件齐全有效',
      cargoStatus: '装载规范，固定牢固，无泄漏',
      safetyEquipment: '灭火器2个，三角警示牌1个，反光背心2件',
      emergencyKit: '应急药品齐全，防护用品齐全',
      otherChecks: '车辆外观整洁，标识清晰'
    }
  },
  {
    id: '8',
    planDetailNo: 'MX20240101006',
    batchPlanId: '1',
    batchPlanNo: 'PC20240101001',
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
    planDetailNo: 'MX20240101007',
    batchPlanId: '2',
    batchPlanNo: 'PC20240101002',
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
    planDetailNo: 'MX20240102003',
    batchPlanId: '3',
    batchPlanNo: 'PC20240102001',
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
    planDetailNo: 'MX20240102004',
    batchPlanId: '3',
    batchPlanNo: 'PC20240102001',
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
  const navigate = useNavigate()
  const [searchForm] = Form.useForm()
  const [rejectForm] = Form.useForm()
  const [data, setData] = useState<PlanDetail[]>(initialMockData)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentRejectId, setCurrentRejectId] = useState<string>('')

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
      render: (status: 'pending' | 'rejected' | 'waiting_assemble' | 'waiting_training' | 'waiting_self_check' | 'self_check_waiting_confirm' | 'self_check_rejected' | 'waiting_forming' | 'waiting_bridge_approval' | 'escorting' | 'completed' | 'cancelled', record: PlanDetail) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审批' },
          rejected: { color: 'red', text: '已驳回' },
          waiting_assemble: { color: 'orange', text: '待集结' },
          waiting_training: { color: 'orange', text: '待培训' },
          waiting_self_check: { color: 'orange', text: '待自查' },
          self_check_waiting_confirm: { color: 'orange', text: '自查待确认' },
          self_check_rejected: { color: 'red', text: '自查已驳回' },
          waiting_forming: { color: 'orange', text: '待编队' },
          waiting_bridge_approval: { color: 'orange', text: '待上桥审批' },
          escorting: { color: 'blue', text: '押运中' },
          completed: { color: 'green', text: '已完成' },
          cancelled: { color: 'default', text: '已取消' },
        }
        const tag = <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>
        if (status === 'rejected' && record.rejectReason) {
          return (
            <span 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
                message.info(`驳回原因：${record.rejectReason}`)
              }}
            >
              {tag}
            </span>
          )
        }
        if (status === 'self_check_rejected' && record.selfCheckRejectReason) {
          return (
            <span 
              style={{ cursor: 'pointer' }} 
              onClick={() => {
                message.info(`自查驳回原因：${record.selfCheckRejectReason}`)
              }}
            >
              {tag}
            </span>
          )
        }
        return tag
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
        <Space size="small">
          <Button
            type="link"
            size="small"
            onClick={() => viewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                danger
                onClick={() => handleReject(record.id)}
              >
                驳回
              </Button>
              <Button
                type="link"
                size="small"
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
    navigate('/plan-detail-view', { state: { record } })
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
    setCurrentRejectId(id)
    rejectForm.resetFields()
    setRejectModalVisible(true)
  }

  const handleRejectSubmit = (values: { rejectReason: string }) => {
    setData(data.map(item => 
      item.id === currentRejectId 
        ? { 
            ...item, 
            status: 'rejected', 
            approvalTime: new Date().toLocaleString('zh-CN'),
            rejectReason: values.rejectReason
          } 
        : item
    ))
    setRejectModalVisible(false)
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
        title="驳回原因"
        open={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            htmlType="submit" 
            form="rejectForm"
          >
            确认驳回
          </Button>
        ]}
        width={500}
      >
        <Form
          id="rejectForm"
          form={rejectForm}
          layout="vertical"
          onFinish={handleRejectSubmit}
        >
          <Form.Item 
            label="驳回原因" 
            name="rejectReason"
            rules={[{ required: true, message: '请输入驳回原因' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入驳回原因"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default PlanApprovalPage
