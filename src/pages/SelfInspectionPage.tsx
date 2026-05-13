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
  Drawer,
  Timeline,
  Checkbox,
  Radio,
  Steps
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  UserOutlined,
  SafetyOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TextArea } = Input

interface SelfCheckItem {
  id: string
  name: string
  checked: boolean
  remark?: string
}

interface SelfInspection {
  id: string
  inspectionNo: string
  plateNo: string
  driverName: string
  driverPhone: string
  escortName: string
  escortPhone: string
  formationNo: string
  planDate: string
  checkTime: string
  checkItems: SelfCheckItem[]
  status: '待自查' | '自查中' | '待审批' | '审批通过' | '审批不通过'
  submitTime?: string
  approveTime?: string
  approver?: string
  approveRemark?: string
  createTime: string
}

// 模拟数据
const mockInspections: SelfInspection[] = [
  {
    id: '1',
    inspectionNo: 'ZC20240115001',
    plateNo: '浙A12345',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    checkTime: '2024-01-15 07:15',
    checkItems: [
      { id: '1', name: '车辆外观检查', checked: true },
      { id: '2', name: '轮胎气压检查', checked: true },
      { id: '3', name: '制动系统检查', checked: true },
      { id: '4', name: '灯光系统检查', checked: true },
      { id: '5', name: '安全设备检查', checked: true },
      { id: '6', name: '驾驶员状态确认', checked: true },
      { id: '7', name: '押运员状态确认', checked: true },
      { id: '8', name: '货物装载确认', checked: true }
    ],
    status: '审批通过',
    submitTime: '2024-01-15 07:20',
    approveTime: '2024-01-15 07:25',
    approver: '安全主管',
    approveRemark: '检查合格，准予通行',
    createTime: '2024-01-15 07:10'
  },
  {
    id: '2',
    inspectionNo: 'ZC20240115002',
    plateNo: '浙B67890',
    driverName: '李师傅',
    driverPhone: '13800138002',
    escortName: '钱押运',
    escortPhone: '13900139002',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    checkTime: '2024-01-15 07:18',
    checkItems: [
      { id: '1', name: '车辆外观检查', checked: true },
      { id: '2', name: '轮胎气压检查', checked: true },
      { id: '3', name: '制动系统检查', checked: true },
      { id: '4', name: '灯光系统检查', checked: true, remark: '左转向灯亮度偏暗' },
      { id: '5', name: '安全设备检查', checked: true },
      { id: '6', name: '驾驶员状态确认', checked: true },
      { id: '7', name: '押运员状态确认', checked: true },
      { id: '8', name: '货物装载确认', checked: true }
    ],
    status: '待审批',
    submitTime: '2024-01-15 07:22',
    createTime: '2024-01-15 07:12'
  },
  {
    id: '3',
    inspectionNo: 'ZC20240116001',
    plateNo: '浙C11111',
    driverName: '王师傅',
    driverPhone: '13800138003',
    escortName: '孙押运',
    escortPhone: '13900139003',
    formationNo: 'BD20240116001',
    planDate: '2024-01-16',
    checkTime: '2024-01-16 13:15',
    checkItems: [
      { id: '1', name: '车辆外观检查', checked: true },
      { id: '2', name: '轮胎气压检查', checked: false, remark: '右后轮胎压不足' },
      { id: '3', name: '制动系统检查', checked: true },
      { id: '4', name: '灯光系统检查', checked: true },
      { id: '5', name: '安全设备检查', checked: true },
      { id: '6', name: '驾驶员状态确认', checked: true },
      { id: '7', name: '押运员状态确认', checked: true },
      { id: '8', name: '货物装载确认', checked: true }
    ],
    status: '审批不通过',
    submitTime: '2024-01-16 13:20',
    approveTime: '2024-01-16 13:25',
    approver: '安全主管',
    approveRemark: '轮胎气压不足，需维修后重新检查',
    createTime: '2024-01-16 13:10'
  },
  {
    id: '4',
    inspectionNo: 'ZC20240117001',
    plateNo: '浙D22222',
    driverName: '赵师傅',
    driverPhone: '13800138004',
    escortName: '李押运',
    escortPhone: '13900139004',
    formationNo: 'BD20240117001',
    planDate: '2024-01-17',
    checkTime: '',
    checkItems: [
      { id: '1', name: '车辆外观检查', checked: false },
      { id: '2', name: '轮胎气压检查', checked: false },
      { id: '3', name: '制动系统检查', checked: false },
      { id: '4', name: '灯光系统检查', checked: false },
      { id: '5', name: '安全设备检查', checked: false },
      { id: '6', name: '驾驶员状态确认', checked: false },
      { id: '7', name: '押运员状态确认', checked: false },
      { id: '8', name: '货物装载确认', checked: false }
    ],
    status: '待自查',
    createTime: '2024-01-17 08:00'
  }
]

const SelfInspectionPage = () => {
  const [inspections, setInspections] = useState<SelfInspection[]>(mockInspections)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [currentInspection, setCurrentInspection] = useState<SelfInspection | null>(null)
  const [editingInspection, setEditingInspection] = useState<SelfInspection | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [approveForm] = Form.useForm()

  // 查看详情
  const handleViewDetail = (record: SelfInspection) => {
    setCurrentInspection(record)
    setIsDetailDrawerOpen(true)
  }

  // 开始自查
  const handleStartCheck = (record: SelfInspection) => {
    setEditingInspection(record)
    setIsModalOpen(true)
  }

  // 提交自查
  const handleCheckSubmit = () => {
    if (editingInspection) {
      setInspections(inspections.map(i => {
        if (i.id === editingInspection.id) {
          return {
            ...i,
            status: '待审批',
            submitTime: new Date().toLocaleString('zh-CN'),
            checkTime: new Date().toLocaleString('zh-CN')
          }
        }
        return i
      }))
      message.success('自查提交成功，等待审批')
      setIsModalOpen(false)
      setEditingInspection(null)
    }
  }

  // 审批
  const handleApprove = (record: SelfInspection) => {
    setCurrentInspection(record)
    approveForm.resetFields()
    setIsApproveModalOpen(true)
  }

  // 提交审批
  const handleApproveSubmit = () => {
    approveForm.validateFields().then(values => {
      if (currentInspection) {
        setInspections(inspections.map(i => {
          if (i.id === currentInspection.id) {
            return {
              ...i,
              status: values.action === 'approve' ? '审批通过' : '审批不通过',
              approveTime: new Date().toLocaleString('zh-CN'),
              approver: '安全主管',
              approveRemark: values.remark
            }
          }
          return i
        }))
        message.success(values.action === 'approve' ? '审批通过' : '已驳回')
        setIsApproveModalOpen(false)
      }
    })
  }

  // 搜索
  const handleSearch = (values: any) => {
    let filtered = mockInspections
    if (values.plateNo) {
      filtered = filtered.filter(i => i.plateNo.includes(values.plateNo))
    }
    if (values.status) {
      filtered = filtered.filter(i => i.status === values.status)
    }
    if (values.planDate) {
      filtered = filtered.filter(i => i.planDate === values.planDate)
    }
    setInspections(filtered)
  }

  // 重置
  const handleReset = () => {
    searchForm.resetFields()
    setInspections(mockInspections)
  }

  // 切换检查项状态
  const handleToggleCheckItem = (itemId: string, checked: boolean) => {
    if (editingInspection) {
      setEditingInspection({
        ...editingInspection,
        checkItems: editingInspection.checkItems.map(item =>
          item.id === itemId ? { ...item, checked } : item
        )
      })
    }
  }

  const columns: ColumnsType<SelfInspection> = [
    {
      title: '自查编号',
      dataIndex: 'inspectionNo',
      key: 'inspectionNo',
      width: 150
    },
    {
      title: '车牌号',
      dataIndex: 'plateNo',
      key: 'plateNo',
      width: 120
    },
    {
      title: '驾驶员',
      dataIndex: 'driverName',
      key: 'driverName',
      width: 100
    },
    {
      title: '押运员',
      dataIndex: 'escortName',
      key: 'escortName',
      width: 100
    },
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
      title: '自查时间',
      dataIndex: 'checkTime',
      key: 'checkTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
          '待自查': { color: 'default', icon: <ClockCircleOutlined /> },
          '自查中': { color: 'processing', icon: <ClockCircleOutlined /> },
          '待审批': { color: 'warning', icon: <ClockCircleOutlined /> },
          '审批通过': { color: 'success', icon: <CheckCircleOutlined /> },
          '审批不通过': { color: 'error', icon: <CloseCircleOutlined /> }
        }
        return <Tag color={statusMap[status]?.color || 'default'} icon={statusMap[status]?.icon}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
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
            icon={<SafetyOutlined />}
            onClick={() => handleStartCheck(record)}
            disabled={!['待自查', '自查中'].includes(record.status)}
          >
            自查
          </Button>
          <Button
            type="link"
            size="small"
            icon={<CheckCircleOutlined />}
            onClick={() => handleApprove(record)}
            disabled={record.status !== '待审批'}
          >
            审批
          </Button>
        </Space>
      )
    }
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>自查审批</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理车辆自查记录，支持自查提交和审批流程</p>
        </div>
      </div>

      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="车牌号" name="plateNo">
          <Input placeholder="请输入车牌号" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="计划日期" name="planDate">
          <Input placeholder="请输入计划日期" style={{ width: 150 }} />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态" style={{ width: 140 }} allowClear>
            <Option value="待自查">待自查</Option>
            <Option value="自查中">自查中</Option>
            <Option value="待审批">待审批</Option>
            <Option value="审批通过">审批通过</Option>
            <Option value="审批不通过">审批不通过</Option>
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
        dataSource={inspections}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条记录` }}
        scroll={{ x: 1600, y: 'calc(100vh - 380px)' }}
      />

      {/* 自查弹窗 */}
      <Modal
        title="车辆自查"
        open={isModalOpen}
        onOk={handleCheckSubmit}
        onCancel={() => {
          setIsModalOpen(false)
          setEditingInspection(null)
        }}
        width={600}
      >
        {editingInspection && (
          <div>
            <Descriptions bordered column={2} style={{ marginBottom: 16 }}>
              <Descriptions.Item label="车牌号">{editingInspection.plateNo}</Descriptions.Item>
              <Descriptions.Item label="驾驶员">{editingInspection.driverName}</Descriptions.Item>
              <Descriptions.Item label="编队编号">{editingInspection.formationNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{editingInspection.planDate}</Descriptions.Item>
            </Descriptions>

            <Divider>检查项目</Divider>

            <List
              dataSource={editingInspection.checkItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<SafetyOutlined style={{ fontSize: 20, color: item.checked ? '#52c41a' : '#999' }} />}
                    title={
                      <Checkbox
                        checked={item.checked}
                        onChange={(e) => handleToggleCheckItem(item.id, e.target.checked)}
                      >
                        {item.name}
                      </Checkbox>
                    }
                    description={item.remark}
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>

      {/* 审批弹窗 */}
      <Modal
        title="审批自查记录"
        open={isApproveModalOpen}
        onOk={handleApproveSubmit}
        onCancel={() => setIsApproveModalOpen(false)}
        width={500}
      >
        <Form form={approveForm} layout="vertical">
          <Form.Item label="自查编号">
            <Input value={currentInspection?.inspectionNo} disabled />
          </Form.Item>
          <Form.Item label="车牌号">
            <Input value={currentInspection?.plateNo} disabled />
          </Form.Item>
          <Form.Item
            label="审批结果"
            name="action"
            rules={[{ required: true, message: '请选择审批结果' }]}
          >
            <Radio.Group>
              <Radio value="approve">通过</Radio>
              <Radio value="reject">驳回</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="审批意见"
            name="remark"
            rules={[{ required: true, message: '请输入审批意见' }]}
          >
            <TextArea rows={3} placeholder="请输入审批意见" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="自查详情"
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={700}
      >
        {currentInspection && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="自查编号">{currentInspection.inspectionNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentInspection.status === '审批通过' ? 'success' :
                  currentInspection.status === '审批不通过' ? 'error' :
                  currentInspection.status === '待审批' ? 'warning' : 'default'
                }>
                  {currentInspection.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="车牌号">{currentInspection.plateNo}</Descriptions.Item>
              <Descriptions.Item label="编队编号">{currentInspection.formationNo}</Descriptions.Item>
              <Descriptions.Item label="驾驶员">{currentInspection.driverName}</Descriptions.Item>
              <Descriptions.Item label="驾驶员电话">{currentInspection.driverPhone}</Descriptions.Item>
              <Descriptions.Item label="押运员">{currentInspection.escortName}</Descriptions.Item>
              <Descriptions.Item label="押运员电话">{currentInspection.escortPhone}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentInspection.planDate}</Descriptions.Item>
              <Descriptions.Item label="自查时间">{currentInspection.checkTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="提交时间">{currentInspection.submitTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批时间">{currentInspection.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批人" span={2}>{currentInspection.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批意见" span={2}>{currentInspection.approveRemark || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider>检查项目</Divider>

            <List
              dataSource={currentInspection.checkItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.checked ?
                        <CheckCircleOutlined style={{ fontSize: 20, color: '#52c41a' }} /> :
                        <CloseCircleOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                    }
                    title={item.name}
                    description={item.remark || (item.checked ? '检查合格' : '检查不合格')}
                  />
                </List.Item>
              )}
            />
          </>
        )}
      </Drawer>
    </Card>
  )
}

export default SelfInspectionPage
