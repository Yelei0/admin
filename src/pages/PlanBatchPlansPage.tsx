import React, { useState } from 'react'
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
} from 'antd'

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

// 初始模拟数据
const initialMockData: BatchPlan[] = [
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
  {
    id: '4',
    planNo: 'PL20240102002',
    planDate: '2024-01-21',
    timeRange: '10:00-14:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 4,
    usedVehicles: 1,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
  },
  {
    id: '5',
    planNo: 'PL20240103001',
    planDate: '2024-01-25',
    timeRange: '08:00-16:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 6,
    usedVehicles: 4,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
  },
  {
    id: '6',
    planNo: 'PL20240103002',
    planDate: '2024-01-26',
    timeRange: '09:00-15:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 2,
    usedVehicles: 0,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
  },
  {
    id: '7',
    planNo: 'PL20240104001',
    planDate: '2024-01-28',
    timeRange: '11:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 10,
    usedVehicles: 5,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
  },
  {
    id: '8',
    planNo: 'PL20240104002',
    planDate: '2024-01-29',
    timeRange: '08:00-12:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 3,
    usedVehicles: 2,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
  },
  {
    id: '9',
    planNo: 'PL20240105001',
    planDate: '2024-01-30',
    timeRange: '13:00-18:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 7,
    usedVehicles: 3,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
  },
  {
    id: '10',
    planNo: 'PL20240105002',
    planDate: '2024-01-31',
    timeRange: '09:00-16:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 5,
    usedVehicles: 1,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
  },
]

const PlanBatchPlansPage = () => {
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<BatchPlan[]>(initialMockData)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<BatchPlan | null>(null)

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
      title: '已用车辆数',
      dataIndex: 'usedVehicles',
      key: 'usedVehicles',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: BatchPlan) => (
        <Button
          type="text"
          onClick={() => viewDetail(record)}
        >
          查看
        </Button>
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
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看批次计划信息，包括计划编号、日期、企业信息、货物品类等</p>
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
          x: 1200,
          y: 600,
        }}
      />

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
              <Descriptions.Item label="总车辆数">{currentRecord.totalVehicles}</Descriptions.Item>
              <Descriptions.Item label="已用车辆数">{currentRecord.usedVehicles}</Descriptions.Item>
              <Descriptions.Item label="剩余车辆数">{currentRecord.totalVehicles - currentRecord.usedVehicles}</Descriptions.Item>
            </Descriptions>

            <Descriptions title="应急措施" bordered>
              <Descriptions.Item label="应急措施" span={3}>
                {currentRecord.emergencyMeasures}
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </Card>
  )
}

export default PlanBatchPlansPage
