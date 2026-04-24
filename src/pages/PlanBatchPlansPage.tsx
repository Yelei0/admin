import { useState } from 'react'
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Space,
  message,
  Modal,
  Descriptions,
  Tag,
  Popconfirm,
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



// 批次计划状态类型
type BatchPlanStatus = 'pending' | 'approved' | 'rejected' | 'dispatching' | 'dispatch_completed' | 'cancelled'

// 批次计划接口
interface BatchPlan {
  id: string
  planNo: string
  planDate: string
  timeRange: string
  goodsCategory: string
  emergencyMeasures: string
  totalVehicles: number
  reportedVehicles: number
  shipperId: string
  shipperName: string
  carrierId: string
  carrierName: string
  status: BatchPlanStatus
  createTime: string
  approvalTime?: string
  rejectReason?: string
  cancelTime?: string
}

// 状态映射
const statusMap: Record<BatchPlanStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审批' },
  approved: { color: 'green', text: '已通过' },
  rejected: { color: 'red', text: '已驳回' },
  dispatching: { color: 'blue', text: '派车中' },
  dispatch_completed: { color: 'green', text: '派车完成' },
  cancelled: { color: 'default', text: '已取消' },
}

// 初始模拟数据 - 统一编号规则：PC + 年月日 + 序号
const initialMockData: BatchPlan[] = [
  {
    id: '1',
    planNo: 'PC20240115001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 5,
    reportedVehicles: 0,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    status: 'pending',
    createTime: '2024-01-14 09:00:00',
  },
  {
    id: '2',
    planNo: 'PC20240116002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 3,
    reportedVehicles: 0,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    status: 'approved',
    createTime: '2024-01-14 10:00:00',
    approvalTime: '2024-01-14 11:30:00',
  },
  {
    id: '3',
    planNo: 'PC20240120003',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 8,
    reportedVehicles: 3,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    status: 'dispatching',
    createTime: '2024-01-18 09:00:00',
    approvalTime: '2024-01-18 10:00:00',
  },
  {
    id: '4',
    planNo: 'PC20240121004',
    planDate: '2024-01-21',
    timeRange: '10:00-14:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 4,
    reportedVehicles: 4,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    status: 'dispatch_completed',
    createTime: '2024-01-19 08:00:00',
    approvalTime: '2024-01-19 09:00:00',
  },
  {
    id: '5',
    planNo: 'PC20240125005',
    planDate: '2024-01-25',
    timeRange: '08:00-16:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 6,
    reportedVehicles: 0,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    status: 'rejected',
    createTime: '2024-01-20 14:00:00',
    approvalTime: '2024-01-20 15:00:00',
    rejectReason: '计划日期与现有计划冲突',
  },
  {
    id: '6',
    planNo: 'PC20240126006',
    planDate: '2024-01-26',
    timeRange: '09:00-15:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 2,
    reportedVehicles: 0,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    status: 'cancelled',
    createTime: '2024-01-22 10:00:00',
    cancelTime: '2024-01-22 11:00:00',
  },
  {
    id: '7',
    planNo: 'PC20240128007',
    planDate: '2024-01-28',
    timeRange: '11:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 10,
    reportedVehicles: 5,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    status: 'dispatching',
    createTime: '2024-01-25 09:00:00',
    approvalTime: '2024-01-25 10:00:00',
  },
  {
    id: '8',
    planNo: 'PC20240129008',
    planDate: '2024-01-29',
    timeRange: '08:00-12:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 3,
    reportedVehicles: 3,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    status: 'dispatch_completed',
    createTime: '2024-01-26 08:00:00',
    approvalTime: '2024-01-26 09:00:00',
  },
  {
    id: '9',
    planNo: 'PC20240130009',
    planDate: '2024-01-30',
    timeRange: '13:00-18:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 7,
    reportedVehicles: 2,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    status: 'dispatching',
    createTime: '2024-01-27 10:00:00',
    approvalTime: '2024-01-27 11:00:00',
  },
  {
    id: '10',
    planNo: 'PC20240131010',
    planDate: '2024-01-31',
    timeRange: '09:00-16:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 5,
    reportedVehicles: 0,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    status: 'pending',
    createTime: '2024-01-29 14:00:00',
  },
]

const PlanBatchPlansPage = () => {
  const navigate = useNavigate()
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<BatchPlan[]>(initialMockData)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<BatchPlan | null>(null)
  const [rejectForm] = Form.useForm()

  // 处理审批通过
  const handleApprove = (id: string) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, status: 'approved', approvalTime: new Date().toLocaleString('zh-CN') } 
        : item
    ))
    message.success('审批通过成功')
  }

  // 处理审批驳回
  const handleReject = (record: BatchPlan) => {
    setCurrentRecord(record)
    rejectForm.resetFields()
    setRejectModalVisible(true)
  }

  // 提交驳回
  const handleRejectSubmit = (values: { rejectReason: string }) => {
    if (!currentRecord) return
    setData(data.map(item => 
      item.id === currentRecord.id 
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

  // 处理取消
  const handleCancel = (id: string) => {
    setData(data.map(item => 
      item.id === id 
        ? { ...item, status: 'cancelled', cancelTime: new Date().toLocaleString('zh-CN') } 
        : item
    ))
    message.success('取消成功')
  }

  const columns = [
    {
      title: '批次计划编号',
      dataIndex: 'planNo',
      key: 'planNo',
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
      title: '总车辆数',
      dataIndex: 'totalVehicles',
      key: 'totalVehicles',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '已派车数',
      dataIndex: 'reportedVehicles',
      key: 'reportedVehicles',
      width: 100,
      align: 'center' as const,
      render: (value: number, record: BatchPlan) => (
        <Button 
          type="link" 
          onClick={() => navigate('/plan-approval', { state: { batchPlanId: record.id } })}
        >
          {value}
        </Button>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center' as const,
      render: (status: BatchPlanStatus, record: BatchPlan) => {
        const statusInfo = statusMap[status]
        const tag = <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        
        // 已驳回状态且存在驳回原因时，点击可查看
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
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: BatchPlan) => (
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
                onClick={() => handleReject(record)}
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
          {(record.status === 'pending' || record.status === 'approved') && (
            <Popconfirm
              title="确定要取消该批次计划吗？"
              onConfirm={() => handleCancel(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="link"
                size="small"
                danger
              >
                取消
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ]

  const viewDetail = (record: BatchPlan) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
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
      const itemValue = item[key as keyof BatchPlan]
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
          <h1 style={{ margin: 0 }}>批次计划管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看和审批批次计划，包括计划编号、日期、企业信息、货物品类等</p>
        </div>
      </div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="批次计划编号" name="planNo">
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
          x: 1400,
          y: 600,
        }}
      />

      {/* 详情弹窗 */}
      <Modal
        title="批次计划详情"
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
              <Descriptions.Item label="批次计划编号">{currentRecord.planNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentRecord.planDate}</Descriptions.Item>
              <Descriptions.Item label="时间段">{currentRecord.timeRange}</Descriptions.Item>
              <Descriptions.Item label="托运企业">{currentRecord.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业">{currentRecord.carrierName}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{currentRecord.goodsCategory}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={statusMap[currentRecord.status].color}>
                  {statusMap[currentRecord.status].text}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="总车辆数">{currentRecord.totalVehicles}</Descriptions.Item>
              <Descriptions.Item label="已派车数">{currentRecord.reportedVehicles}</Descriptions.Item>
              <Descriptions.Item label="剩余车辆数">{currentRecord.totalVehicles - currentRecord.reportedVehicles}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="时间信息" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="创建时间">{currentRecord.createTime}</Descriptions.Item>
              {currentRecord.approvalTime && (
                <Descriptions.Item label="审批时间">{currentRecord.approvalTime}</Descriptions.Item>
              )}
              {currentRecord.cancelTime && (
                <Descriptions.Item label="取消时间">{currentRecord.cancelTime}</Descriptions.Item>
              )}
            </Descriptions>

            {currentRecord.rejectReason && (
              <Descriptions title="驳回信息" bordered style={{ marginBottom: 24 }}>
                <Descriptions.Item label="驳回原因" span={3}>
                  {currentRecord.rejectReason}
                </Descriptions.Item>
              </Descriptions>
            )}

            <Descriptions title="应急措施" bordered>
              <Descriptions.Item label="应急措施" span={3}>
                {currentRecord.emergencyMeasures}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>

      {/* 驳回弹窗 */}
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

export default PlanBatchPlansPage
