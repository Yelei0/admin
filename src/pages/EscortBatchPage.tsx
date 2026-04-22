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
  Upload,
  Tooltip,
} from 'antd'
import { UploadOutlined } from '@ant-design/icons'

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

// 押运批次接口
interface EscortBatch {
  id: string
  batchNo: string
  planDate: string
  timeRange: string
  goodsCategory: string
  emergencyMeasures: string
  totalVehicles: number
  shipperId: string
  shipperName: string
  carrierId: string
  carrierName: string
  escortVehicles: string[] // 押运车
  escortPersonnel: EscortPerson[] // 押运人员
  summaryFile?: string // 押运总结文件
}

// 押运人员接口
interface EscortPerson {
  id: string
  name: string
  phone: string
  certificateNo: string
}

// 初始模拟数据
const initialMockData: EscortBatch[] = [
  {
    id: '1',
    batchNo: 'EB20240101001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 5,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    escortVehicles: ['浙A12345', '浙A67890'],
    escortPersonnel: [
      { id: 'E001', name: '赵押运', phone: '13900139001', certificateNo: 'EP2023001' },
      { id: 'E002', name: '钱押运', phone: '13900139002', certificateNo: 'EP2023002' },
    ],
  },
  {
    id: '2',
    batchNo: 'EB20240101002',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 3,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    escortVehicles: ['浙B12345'],
    escortPersonnel: [
      { id: 'E003', name: '孙押运', phone: '13900139003', certificateNo: 'EP2023003' },
    ],
  },
  {
    id: '3',
    batchNo: 'EB20240102001',
    planDate: '2024-01-20',
    timeRange: '09:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 8,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    escortVehicles: ['浙C12345', '浙C67890', '浙C24680'],
    escortPersonnel: [
      { id: 'E004', name: '李押运', phone: '13900139004', certificateNo: 'EP2023004' },
      { id: 'E005', name: '周押运', phone: '13900139005', certificateNo: 'EP2023005' },
      { id: 'E006', name: '吴押运', phone: '13900139006', certificateNo: 'EP2023006' },
    ],
  },
  {
    id: '4',
    batchNo: 'EB20240102002',
    planDate: '2024-01-21',
    timeRange: '10:00-14:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 4,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    escortVehicles: ['浙D12345', '浙D67890'],
    escortPersonnel: [
      { id: 'E007', name: '郑押运', phone: '13900139007', certificateNo: 'EP2023007' },
      { id: 'E008', name: '王押运', phone: '13900139008', certificateNo: 'EP2023008' },
    ],
  },
  {
    id: '5',
    batchNo: 'EB20240103001',
    planDate: '2024-01-25',
    timeRange: '08:00-16:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 6,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    escortVehicles: ['浙E12345', '浙E67890', '浙E24680'],
    escortPersonnel: [
      { id: 'E009', name: '冯押运', phone: '13900139009', certificateNo: 'EP2023009' },
      { id: 'E010', name: '陈押运', phone: '13900139010', certificateNo: 'EP2023010' },
      { id: 'E011', name: '褚押运', phone: '13900139011', certificateNo: 'EP2023011' },
    ],
  },
  {
    id: '6',
    batchNo: 'EB20240103002',
    planDate: '2024-01-26',
    timeRange: '09:00-15:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 2,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    escortVehicles: ['浙F12345'],
    escortPersonnel: [
      { id: 'E012', name: '卫押运', phone: '13900139012', certificateNo: 'EP2023012' },
    ],
  },
  {
    id: '7',
    batchNo: 'EB20240104001',
    planDate: '2024-01-28',
    timeRange: '11:00-17:00',
    goodsCategory: '柴油',
    emergencyMeasures: mockGoodsCategories[3].measures,
    totalVehicles: 10,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    escortVehicles: ['浙G12345', '浙G67890', '浙G24680', '浙G13579'],
    escortPersonnel: [
      { id: 'E013', name: '蒋押运', phone: '13900139013', certificateNo: 'EP2023013' },
      { id: 'E014', name: '沈押运', phone: '13900139014', certificateNo: 'EP2023014' },
      { id: 'E015', name: '韩押运', phone: '13900139015', certificateNo: 'EP2023015' },
      { id: 'E016', name: '杨押运', phone: '13900139016', certificateNo: 'EP2023016' },
    ],
  },
  {
    id: '8',
    batchNo: 'EB20240104002',
    planDate: '2024-01-29',
    timeRange: '08:00-12:00',
    goodsCategory: '液氨',
    emergencyMeasures: mockGoodsCategories[2].measures,
    totalVehicles: 3,
    shipperId: '3',
    shipperName: '恒力石化有限公司',
    carrierId: '2',
    carrierName: '安全运输有限公司',
    escortVehicles: ['浙H12345', '浙H67890'],
    escortPersonnel: [
      { id: 'E017', name: '朱押运', phone: '13900139017', certificateNo: 'EP2023017' },
      { id: 'E018', name: '秦押运', phone: '13900139018', certificateNo: 'EP2023018' },
    ],
  },
  {
    id: '9',
    batchNo: 'EB20240105001',
    planDate: '2024-01-30',
    timeRange: '13:00-18:00',
    goodsCategory: '液化石油气',
    emergencyMeasures: mockGoodsCategories[0].measures,
    totalVehicles: 7,
    shipperId: '2',
    shipperName: '中石油运输公司',
    carrierId: '3',
    carrierName: '恒通物流集团',
    escortVehicles: ['浙J12345', '浙J67890', '浙J24680'],
    escortPersonnel: [
      { id: 'E019', name: '尤押运', phone: '13900139019', certificateNo: 'EP2023019' },
      { id: 'E020', name: '许押运', phone: '13900139020', certificateNo: 'EP2023020' },
      { id: 'E021', name: '何押运', phone: '13900139021', certificateNo: 'EP2023021' },
    ],
  },
  {
    id: '10',
    batchNo: 'EB20240105002',
    planDate: '2024-01-31',
    timeRange: '09:00-16:00',
    goodsCategory: '硫酸',
    emergencyMeasures: mockGoodsCategories[1].measures,
    totalVehicles: 5,
    shipperId: '1',
    shipperName: '中石化销售有限公司',
    carrierId: '1',
    carrierName: '危险品运输集团',
    escortVehicles: ['浙K12345', '浙K67890'],
    escortPersonnel: [
      { id: 'E022', name: '吕押运', phone: '13900139022', certificateNo: 'EP2023022' },
      { id: 'E023', name: '施押运', phone: '13900139023', certificateNo: 'EP2023023' },
    ],
  },
]

const EscortBatchPage = () => {
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<EscortBatch[]>(initialMockData)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<EscortBatch | null>(null)

  const columns = [
    {
      title: '押运批次编号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 180,
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
      title: '押运车',
      dataIndex: 'escortVehicles',
      key: 'escortVehicles',
      width: 200,
      render: (vehicles: string[]) => (
        <div>
          {vehicles.map((vehicle, index) => (
            <div key={index}>{vehicle}</div>
          ))}
        </div>
      ),
    },
    {
      title: '押运人员',
      dataIndex: 'escortPersonnel',
      key: 'escortPersonnel',
      width: 200,
      render: (personnel: EscortPerson[]) => (
        <div>
          {personnel.map((person, index) => (
            <div key={index}>
              <div>{person.name}</div>
              <div style={{ fontSize: 12, color: '#999' }}>{person.phone}</div>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: EscortBatch) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => viewDetail(record)}
          >
            查看
          </Button>
          <Upload
            name="file"
            action="/api/upload"
            headers={{ authorization: 'authorization-text' }}
            showUploadList={false}
            onSuccess={() => {
              message.success('上传成功');
              setData(data.map(item =>
                item.id === record.id
                  ? { ...item, summaryFile: '已上传' }
                  : item
              ));
            }}
            onError={() => message.error('上传失败')}
          >
            <Button icon={<UploadOutlined />} type="text">
              上传总结
            </Button>
          </Upload>
        </Space>
      ),
    },
  ]

  const viewDetail = (record: EscortBatch) => {
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
      const itemValue = item[key as keyof EscortBatch]
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
          <h1 style={{ margin: 0 }}>押运批次管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看押运批次信息，包括批次编号、日期、企业信息、货物品类、押运车和押运人员信息等</p>
        </div>
      </div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="押运批次编号" name="batchNo">
          <Input placeholder="请输入押运批次编号" />
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
          x: 1400,
          y: 600,
        }}
      />

      <Modal
        title="押运批次详情"
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
              <Descriptions.Item label="押运批次编号">{currentRecord.batchNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentRecord.planDate}</Descriptions.Item>
              <Descriptions.Item label="时间段">{currentRecord.timeRange}</Descriptions.Item>
              <Descriptions.Item label="托运企业">{currentRecord.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业">{currentRecord.carrierName}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{currentRecord.goodsCategory}</Descriptions.Item>
              <Descriptions.Item label="总车辆数">{currentRecord.totalVehicles}</Descriptions.Item>
              <Descriptions.Item label="押运总结文件">
                {currentRecord.summaryFile ? (
                  <span style={{ color: '#52c41a' }}>已上传</span>
                ) : (
                  <span style={{ color: '#faad14' }}>未上传</span>
                )}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="押运车辆" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="押运车" span={3}>
                <div>
                  {currentRecord.escortVehicles.map((vehicle, index) => (
                    <div key={index} style={{ marginBottom: 4 }}>{vehicle}</div>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>

            <Descriptions title="押运人员" bordered style={{ marginBottom: 24 }}>
              <Descriptions.Item label="押运人员" span={3}>
                <div>
                  {currentRecord.escortPersonnel.map((person, index) => (
                    <div key={index} style={{ marginBottom: 8 }}>
                      <div><strong>{person.name}</strong></div>
                      <div style={{ fontSize: 12, color: '#666' }}>电话: {person.phone}</div>
                      <div style={{ fontSize: 12, color: '#666' }}>证件号: {person.certificateNo}</div>
                    </div>
                  ))}
                </div>
              </Descriptions.Item>
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

export default EscortBatchPage
