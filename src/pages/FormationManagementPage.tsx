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
  message,
  Tag,
  Descriptions,
  List,
  Avatar,
  Divider,
  Row,
  Col,
  Badge,
  Popconfirm,
  Drawer
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  TeamOutlined,
  CarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select

interface Vehicle {
  id: string
  plateNo: string
  trailer: string
  driverName: string
  driverPhone: string
  escortName: string
  escortPhone: string
  cargoType: string
  cargoAmount: string
  status: '待编队' | '已编队' | '编队中' | '已完成'
}

interface Formation {
  id: string
  formationNo: string
  planDate: string
  timeRange: string
  shipperName: string
  carrierName: string
  goodsCategory: string
  totalVehicles: number
  vehicles: Vehicle[]
  leaderName: string
  leaderPhone: string
  assemblyPoint: string
  assemblyTime: string
  status: '待编队' | '编队中' | '编队完成' | '待检查' | '检查通过' | '检查不通过'
  createTime: string
  remark?: string
}

// 模拟数据
const mockFormations: Formation[] = [
  {
    id: '1',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    timeRange: '08:00-12:00',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    goodsCategory: '液化石油气',
    totalVehicles: 3,
    vehicles: [
      {
        id: '1',
        plateNo: '浙A12345',
        trailer: '浙A1223挂',
        driverName: '张师傅',
        driverPhone: '13800138001',
        escortName: '赵押运',
        escortPhone: '13900139001',
        cargoType: '液化石油气',
        cargoAmount: '20吨',
        status: '待编队'
      },
      {
        id: '2',
        plateNo: '浙B67890',
        trailer: '浙B4567挂',
        driverName: '李师傅',
        driverPhone: '13800138002',
        escortName: '钱押运',
        escortPhone: '13900139002',
        cargoType: '液化石油气',
        cargoAmount: '18吨',
        status: '待编队'
      },
      {
        id: '3',
        plateNo: '浙C11111',
        trailer: '浙C8910挂',
        driverName: '王师傅',
        driverPhone: '13800138003',
        escortName: '孙押运',
        escortPhone: '13900139003',
        cargoType: '液化石油气',
        cargoAmount: '22吨',
        status: '待编队'
      }
    ],
    leaderName: '赵押运',
    leaderPhone: '13900139001',
    assemblyPoint: '岱山双塔收费站',
    assemblyTime: '2024-01-15 07:30',
    status: '待编队',
    createTime: '2024-01-14 14:00'
  },
  {
    id: '2',
    formationNo: 'BD20240116001',
    planDate: '2024-01-16',
    timeRange: '14:00-18:00',
    shipperName: '中石油运输公司',
    carrierName: '安全运输有限公司',
    goodsCategory: '硫酸',
    totalVehicles: 2,
    vehicles: [
      {
        id: '4',
        plateNo: '浙D22222',
        trailer: '浙D1122挂',
        driverName: '赵师傅',
        driverPhone: '13800138004',
        escortName: '李押运',
        escortPhone: '13900139004',
        cargoType: '硫酸',
        cargoAmount: '15吨',
        status: '已编队'
      },
      {
        id: '5',
        plateNo: '浙E33333',
        trailer: '浙E3344挂',
        driverName: '钱师傅',
        driverPhone: '13800138005',
        escortName: '周押运',
        escortPhone: '13900139005',
        cargoType: '硫酸',
        cargoAmount: '18吨',
        status: '已编队'
      }
    ],
    leaderName: '李押运',
    leaderPhone: '13900139004',
    assemblyPoint: '岱山码头',
    assemblyTime: '2024-01-16 13:30',
    status: '编队中',
    createTime: '2024-01-15 10:00'
  },
  {
    id: '3',
    formationNo: 'BD20240117001',
    planDate: '2024-01-17',
    timeRange: '09:00-17:00',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    goodsCategory: '柴油',
    totalVehicles: 4,
    vehicles: [],
    leaderName: '孙押运',
    leaderPhone: '13900139003',
    assemblyPoint: '岱山双塔收费站',
    assemblyTime: '2024-01-17 08:30',
    status: '待检查',
    createTime: '2024-01-16 16:00'
  },
  {
    id: '4',
    formationNo: 'BD20240118001',
    planDate: '2024-01-18',
    timeRange: '10:00-16:00',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    goodsCategory: '液氯',
    totalVehicles: 2,
    vehicles: [],
    leaderName: '钱押运',
    leaderPhone: '13900139002',
    assemblyPoint: '岱山码头',
    assemblyTime: '2024-01-18 09:30',
    status: '检查通过',
    createTime: '2024-01-17 11:00'
  }
]

const FormationManagementPage = () => {
  const [formations, setFormations] = useState<Formation[]>(mockFormations)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [currentFormation, setCurrentFormation] = useState<Formation | null>(null)
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  // 查看详情
  const handleViewDetail = (record: Formation) => {
    setCurrentFormation(record)
    setIsDetailDrawerOpen(true)
  }

  // 编队
  const handleFormation = (record: Formation) => {
    setEditingFormation(record)
    form.setFieldsValue({
      leaderName: record.leaderName,
      leaderPhone: record.leaderPhone,
      assemblyPoint: record.assemblyPoint,
      assemblyTime: record.assemblyTime
    })
    setIsModalOpen(true)
  }

  // 提交编队
  const handleFormationSubmit = () => {
    form.validateFields().then(values => {
      if (editingFormation) {
        setFormations(formations.map(f => {
          if (f.id === editingFormation.id) {
            return {
              ...f,
              ...values,
              status: '编队完成'
            }
          }
          return f
        }))
        message.success('编队提交成功')
        setIsModalOpen(false)
        form.resetFields()
      }
    })
  }

  // 搜索
  const handleSearch = (values: any) => {
    let filtered = mockFormations
    if (values.formationNo) {
      filtered = filtered.filter(f => f.formationNo.includes(values.formationNo))
    }
    if (values.status) {
      filtered = filtered.filter(f => f.status === values.status)
    }
    if (values.planDate) {
      filtered = filtered.filter(f => f.planDate === values.planDate)
    }
    setFormations(filtered)
  }

  // 重置
  const handleReset = () => {
    searchForm.resetFields()
    setFormations(mockFormations)
  }

  const columns: ColumnsType<Formation> = [
    {
      title: '编队编号',
      dataIndex: 'formationNo',
      key: 'formationNo',
      width: 150
    },
    {
      title: '计划日期',
      dataIndex: 'planDate',
      key: 'planDate',
      width: 120
    },
    {
      title: '时间段',
      dataIndex: 'timeRange',
      key: 'timeRange',
      width: 120
    },
    {
      title: '托运企业',
      dataIndex: 'shipperName',
      key: 'shipperName',
      width: 180
    },
    {
      title: '承运企业',
      dataIndex: 'carrierName',
      key: 'carrierName',
      width: 180
    },
    {
      title: '货物品类',
      dataIndex: 'goodsCategory',
      key: 'goodsCategory',
      width: 100
    },
    {
      title: '车数',
      dataIndex: 'totalVehicles',
      key: 'totalVehicles',
      width: 80,
      align: 'center'
    },
    {
      title: '集结点',
      dataIndex: 'assemblyPoint',
      key: 'assemblyPoint',
      width: 150
    },
    {
      title: '集结时间',
      dataIndex: 'assemblyTime',
      key: 'assemblyTime',
      width: 150
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { color: string }> = {
          '待编队': { color: 'default' },
          '编队中': { color: 'processing' },
          '编队完成': { color: 'success' },
          '待检查': { color: 'warning' },
          '检查通过': { color: 'success' },
          '检查不通过': { color: 'error' }
        }
        return <Tag color={statusMap[status]?.color || 'default'}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          <Button
            type="link"
            size="small"
            icon={<TeamOutlined />}
            onClick={() => handleFormation(record)}
            disabled={!['待编队', '编队中'].includes(record.status)}
          >
            编队
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>编队管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理危化品运输车辆编队，支持集结、编队、检查等全流程管理</p>
        </div>
      </div>

      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="编队编号" name="formationNo">
          <Input placeholder="请输入编队编号" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="计划日期" name="planDate">
          <Input placeholder="请输入计划日期" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
            <Option value="待编队">待编队</Option>
            <Option value="编队中">编队中</Option>
            <Option value="编队完成">编队完成</Option>
            <Option value="待检查">待检查</Option>
            <Option value="检查通过">检查通过</Option>
            <Option value="检查不通过">检查不通过</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button onClick={handleReset}>重置</Button>
          </Space>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={formations}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条记录` }}
        scroll={{ x: 1800, y: 'calc(100vh - 380px)' }}
      />

      {/* 编队弹窗 */}
      <Modal
        title="编队管理"
        open={isModalOpen}
        onOk={handleFormationSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="编队编号">
            <Input value={editingFormation?.formationNo} disabled />
          </Form.Item>
          <Form.Item label="计划日期">
            <Input value={editingFormation?.planDate} disabled />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="押运队长"
                name="leaderName"
                rules={[{ required: true, message: '请选择押运队长' }]}
              >
                <Select placeholder="请选择押运队长">
                  {editingFormation?.vehicles.map(v => (
                    <Option key={v.escortName} value={v.escortName}>
                      {v.escortName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="队长电话"
                name="leaderPhone"
                rules={[{ required: true, message: '请输入队长电话' }]}
              >
                <Input placeholder="请输入队长电话" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="集结点"
            name="assemblyPoint"
            rules={[{ required: true, message: '请选择集结点' }]}
          >
            <Select placeholder="请选择集结点">
              <Option value="岱山双塔收费站">岱山双塔收费站</Option>
              <Option value="岱山码头">岱山码头</Option>
              <Option value="舟山跨海大桥入口">舟山跨海大桥入口</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="集结时间"
            name="assemblyTime"
            rules={[{ required: true, message: '请输入集结时间' }]}
          >
            <Input placeholder="请输入集结时间，如：2024-01-15 07:30" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="编队详情"
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={700}
      >
        {currentFormation && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="编队编号">{currentFormation.formationNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentFormation.status === '检查通过' ? 'success' :
                  currentFormation.status === '检查不通过' ? 'error' :
                  currentFormation.status === '编队完成' ? 'processing' : 'default'
                }>
                  {currentFormation.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentFormation.planDate}</Descriptions.Item>
              <Descriptions.Item label="时间段">{currentFormation.timeRange}</Descriptions.Item>
              <Descriptions.Item label="托运企业" span={2}>{currentFormation.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业" span={2}>{currentFormation.carrierName}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{currentFormation.goodsCategory}</Descriptions.Item>
              <Descriptions.Item label="车数">{currentFormation.totalVehicles}辆</Descriptions.Item>
              <Descriptions.Item label="集结点">{currentFormation.assemblyPoint}</Descriptions.Item>
              <Descriptions.Item label="集结时间">{currentFormation.assemblyTime}</Descriptions.Item>
              <Descriptions.Item label="押运队长">{currentFormation.leaderName}</Descriptions.Item>
              <Descriptions.Item label="队长电话">{currentFormation.leaderPhone}</Descriptions.Item>
            </Descriptions>

            <Divider>车辆列表</Divider>

            <List
              dataSource={currentFormation.vehicles}
              renderItem={(vehicle) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<CarOutlined />} style={{ backgroundColor: '#1890ff' }} />}
                    title={
                      <span>
                        {vehicle.plateNo}
                        <Tag style={{ marginLeft: 8 }}>{vehicle.trailer}</Tag>
                      </span>
                    }
                    description={
                      <div>
                        <div>驾驶员：{vehicle.driverName} / {vehicle.driverPhone}</div>
                        <div>押运员：{vehicle.escortName} / {vehicle.escortPhone}</div>
                        <div>货物：{vehicle.cargoType} / {vehicle.cargoAmount}</div>
                      </div>
                    }
                  />
                  <Tag color={vehicle.status === '已编队' ? 'success' : 'default'}>
                    {vehicle.status}
                  </Tag>
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </Card>
  )
}

export default FormationManagementPage
