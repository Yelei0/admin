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
  Radio,
  Steps,
  Statistic
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
  FileTextOutlined,
  BridgeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'

const { Option } = Select
const { TextArea } = Input

interface BridgeApproval {
  id: string
  approvalNo: string
  plateNo: string
  trailer: string
  driverName: string
  driverPhone: string
  escortName: string
  escortPhone: string
  formationNo: string
  planDate: string
  cargoType: string
  cargoAmount: string
  shipperName: string
  carrierName: string
  applyTime: string
  bridgeName: string
  direction: '上桥' | '下桥'
  status: '待申请' | '待审批' | '审批通过' | '审批不通过' | '已上桥' | '已下桥'
  applyTime2?: string
  approveTime?: string
  approver?: string
  approveRemark?: string
  upBridgeTime?: string
  downBridgeTime?: string
  createTime: string
}

// 模拟数据
const mockApprovals: BridgeApproval[] = [
  {
    id: '1',
    approvalNo: 'SQ20240115001',
    plateNo: '浙A12345',
    trailer: '浙A1223挂',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    cargoType: '液化石油气',
    cargoAmount: '20吨',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    applyTime: '2024-01-15 08:00',
    bridgeName: '舟山跨海大桥',
    direction: '上桥',
    status: '已上桥',
    approveTime: '2024-01-15 08:10',
    approver: '桥隧管理员',
    approveRemark: '审批通过，准予上桥',
    upBridgeTime: '2024-01-15 08:15',
    createTime: '2024-01-15 07:30'
  },
  {
    id: '2',
    approvalNo: 'SQ20240115002',
    plateNo: '浙B67890',
    trailer: '浙B4567挂',
    driverName: '李师傅',
    driverPhone: '13800138002',
    escortName: '钱押运',
    escortPhone: '13900139002',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    cargoType: '液化石油气',
    cargoAmount: '18吨',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    applyTime: '2024-01-15 08:05',
    bridgeName: '舟山跨海大桥',
    direction: '上桥',
    status: '待审批',
    createTime: '2024-01-15 07:35'
  },
  {
    id: '3',
    approvalNo: 'SQ20240116001',
    plateNo: '浙C11111',
    trailer: '浙C8910挂',
    driverName: '王师傅',
    driverPhone: '13800138003',
    escortName: '孙押运',
    escortPhone: '13900139003',
    formationNo: 'BD20240116001',
    planDate: '2024-01-16',
    cargoType: '硫酸',
    cargoAmount: '15吨',
    shipperName: '中石油运输公司',
    carrierName: '安全运输有限公司',
    applyTime: '2024-01-16 14:00',
    bridgeName: '舟山跨海大桥',
    direction: '上桥',
    status: '审批不通过',
    approveTime: '2024-01-16 14:15',
    approver: '桥隧管理员',
    approveRemark: '自查报告未通过，禁止上桥',
    createTime: '2024-01-16 13:30'
  },
  {
    id: '4',
    approvalNo: 'SQ20240117001',
    plateNo: '浙D22222',
    trailer: '浙D1122挂',
    driverName: '赵师傅',
    driverPhone: '13800138004',
    escortName: '李押运',
    escortPhone: '13900139004',
    formationNo: 'BD20240117001',
    planDate: '2024-01-17',
    cargoType: '柴油',
    cargoAmount: '25吨',
    shipperName: '恒力石化有限公司',
    carrierName: '恒通物流集团',
    applyTime: '',
    bridgeName: '舟山跨海大桥',
    direction: '上桥',
    status: '待申请',
    createTime: '2024-01-17 08:00'
  },
  {
    id: '5',
    approvalNo: 'SQ20240115003',
    plateNo: '浙A12345',
    trailer: '浙A1223挂',
    driverName: '张师傅',
    driverPhone: '13800138001',
    escortName: '赵押运',
    escortPhone: '13900139001',
    formationNo: 'BD20240115001',
    planDate: '2024-01-15',
    cargoType: '液化石油气',
    cargoAmount: '20吨',
    shipperName: '中石化销售有限公司',
    carrierName: '危险品运输集团',
    applyTime: '2024-01-15 11:00',
    bridgeName: '舟山跨海大桥',
    direction: '下桥',
    status: '已下桥',
    approveTime: '2024-01-15 11:10',
    approver: '桥隧管理员',
    approveRemark: '审批通过，准予下桥',
    upBridgeTime: '2024-01-15 08:15',
    downBridgeTime: '2024-01-15 11:15',
    createTime: '2024-01-15 10:30'
  }
]

const BridgeApprovalPage = () => {
  const [approvals, setApprovals] = useState<BridgeApproval[]>(mockApprovals)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false)
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false)
  const [currentApproval, setCurrentApproval] = useState<BridgeApproval | null>(null)
  const [editingApproval, setEditingApproval] = useState<BridgeApproval | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [approveForm] = Form.useForm()

  // 查看详情
  const handleViewDetail = (record: BridgeApproval) => {
    setCurrentApproval(record)
    setIsDetailDrawerOpen(true)
  }

  // 申请上桥
  const handleApply = (record: BridgeApproval) => {
    setEditingApproval(record)
    form.setFieldsValue({
      bridgeName: record.bridgeName,
      direction: record.direction
    })
    setIsModalOpen(true)
  }

  // 提交申请
  const handleApplySubmit = () => {
    form.validateFields().then(values => {
      if (editingApproval) {
        setApprovals(approvals.map(a => {
          if (a.id === editingApproval.id) {
            return {
              ...a,
              ...values,
              status: '待审批',
              applyTime: new Date().toLocaleString('zh-CN')
            }
          }
          return a
        }))
        message.success('申请提交成功，等待审批')
        setIsModalOpen(false)
        form.resetFields()
      }
    })
  }

  // 审批
  const handleApprove = (record: BridgeApproval) => {
    setCurrentApproval(record)
    approveForm.resetFields()
    setIsApproveModalOpen(true)
  }

  // 提交审批
  const handleApproveSubmit = () => {
    approveForm.validateFields().then(values => {
      if (currentApproval) {
        setApprovals(approvals.map(a => {
          if (a.id === currentApproval.id) {
            return {
              ...a,
              status: values.action === 'approve' ? (a.direction === '上桥' ? '已上桥' : '已下桥') : '审批不通过',
              approveTime: new Date().toLocaleString('zh-CN'),
              approver: '桥隧管理员',
              approveRemark: values.remark,
              upBridgeTime: values.action === 'approve' && a.direction === '上桥' ? new Date().toLocaleString('zh-CN') : a.upBridgeTime,
              downBridgeTime: values.action === 'approve' && a.direction === '下桥' ? new Date().toLocaleString('zh-CN') : a.downBridgeTime
            }
          }
          return a
        }))
        message.success(values.action === 'approve' ? '审批通过' : '已驳回')
        setIsApproveModalOpen(false)
      }
    })
  }

  // 搜索
  const handleSearch = (values: any) => {
    let filtered = mockApprovals
    if (values.plateNo) {
      filtered = filtered.filter(a => a.plateNo.includes(values.plateNo))
    }
    if (values.status) {
      filtered = filtered.filter(a => a.status === values.status)
    }
    if (values.direction) {
      filtered = filtered.filter(a => a.direction === values.direction)
    }
    setApprovals(filtered)
  }

  // 重置
  const handleReset = () => {
    searchForm.resetFields()
    setApprovals(mockApprovals)
  }

  const columns: ColumnsType<BridgeApproval> = [
    {
      title: '申请编号',
      dataIndex: 'approvalNo',
      key: 'approvalNo',
      width: 150
    },
    {
      title: '车牌号',
      dataIndex: 'plateNo',
      key: 'plateNo',
      width: 120
    },
    {
      title: '挂车号',
      dataIndex: 'trailer',
      key: 'trailer',
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
      title: '货物品类',
      dataIndex: 'cargoType',
      key: 'cargoType',
      width: 120
    },
    {
      title: '方向',
      dataIndex: 'direction',
      key: 'direction',
      width: 80,
      align: 'center',
      render: (direction: string) => (
        <Tag color={direction === '上桥' ? 'blue' : 'green'}>{direction}</Tag>
      )
    },
    {
      title: '大桥名称',
      dataIndex: 'bridgeName',
      key: 'bridgeName',
      width: 150
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 160
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const statusMap: Record<string, { color: string; icon: React.ReactNode }> = {
          '待申请': { color: 'default', icon: <ClockCircleOutlined /> },
          '待审批': { color: 'warning', icon: <ClockCircleOutlined /> },
          '审批通过': { color: 'processing', icon: <CheckCircleOutlined /> },
          '审批不通过': { color: 'error', icon: <CloseCircleOutlined /> },
          '已上桥': { color: 'success', icon: <CheckCircleOutlined /> },
          '已下桥': { color: 'success', icon: <CheckCircleOutlined /> }
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
            icon={<BridgeOutlined />}
            onClick={() => handleApply(record)}
            disabled={!['待申请', '审批不通过'].includes(record.status)}
          >
            申请
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
          <h1 style={{ margin: 0 }}>上桥审批</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理车辆上下桥申请和审批流程</p>
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
        <Form.Item label="方向" name="direction">
          <Select placeholder="请选择方向" style={{ width: 100 }} allowClear>
            <Option value="上桥">上桥</Option>
            <Option value="下桥">下桥</Option>
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select placeholder="请选择状态" style={{ width: 140 }} allowClear>
            <Option value="待申请">待申请</Option>
            <Option value="待审批">待审批</Option>
            <Option value="审批通过">审批通过</Option>
            <Option value="审批不通过">审批不通过</Option>
            <Option value="已上桥">已上桥</Option>
            <Option value="已下桥">已下桥</Option>
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
        dataSource={approvals}
        rowKey="id"
        pagination={{ pageSize: 10, showTotal: (total) => `共 ${total} 条记录` }}
        scroll={{ x: 1800, y: 'calc(100vh - 380px)' }}
      />

      {/* 申请弹窗 */}
      <Modal
        title="上桥申请"
        open={isModalOpen}
        onOk={handleApplySubmit}
        onCancel={() => {
          setIsModalOpen(false)
          form.resetFields()
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="申请编号">
            <Input value={editingApproval?.approvalNo} disabled />
          </Form.Item>
          <Form.Item label="车牌号">
            <Input value={editingApproval?.plateNo} disabled />
          </Form.Item>
          <Form.Item label="挂车号">
            <Input value={editingApproval?.trailer} disabled />
          </Form.Item>
          <Form.Item label="编队编号">
            <Input value={editingApproval?.formationNo} disabled />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="大桥名称"
                name="bridgeName"
                rules={[{ required: true, message: '请选择大桥名称' }]}
              >
                <Select placeholder="请选择大桥名称">
                  <Option value="舟山跨海大桥">舟山跨海大桥</Option>
                  <Option value="岱山大桥">岱山大桥</Option>
                  <Option value="金塘大桥">金塘大桥</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="方向"
                name="direction"
                rules={[{ required: true, message: '请选择方向' }]}
              >
                <Select placeholder="请选择方向">
                  <Option value="上桥">上桥</Option>
                  <Option value="下桥">下桥</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 审批弹窗 */}
      <Modal
        title="审批上桥申请"
        open={isApproveModalOpen}
        onOk={handleApproveSubmit}
        onCancel={() => setIsApproveModalOpen(false)}
        width={500}
      >
        <Form form={approveForm} layout="vertical">
          <Form.Item label="申请编号">
            <Input value={currentApproval?.approvalNo} disabled />
          </Form.Item>
          <Form.Item label="车牌号">
            <Input value={currentApproval?.plateNo} disabled />
          </Form.Item>
          <Form.Item label="方向">
            <Tag color={currentApproval?.direction === '上桥' ? 'blue' : 'green'}>
              {currentApproval?.direction}
            </Tag>
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
        title="上桥审批详情"
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={700}
      >
        {currentApproval && (
          <>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="申请编号">{currentApproval.approvalNo}</Descriptions.Item>
              <Descriptions.Item label="状态">
                <Tag color={
                  currentApproval.status === '已上桥' || currentApproval.status === '已下桥' ? 'success' :
                  currentApproval.status === '审批不通过' ? 'error' :
                  currentApproval.status === '待审批' ? 'warning' : 'default'
                }>
                  {currentApproval.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="车牌号">{currentApproval.plateNo}</Descriptions.Item>
              <Descriptions.Item label="挂车号">{currentApproval.trailer}</Descriptions.Item>
              <Descriptions.Item label="驾驶员">{currentApproval.driverName}</Descriptions.Item>
              <Descriptions.Item label="驾驶员电话">{currentApproval.driverPhone}</Descriptions.Item>
              <Descriptions.Item label="押运员">{currentApproval.escortName}</Descriptions.Item>
              <Descriptions.Item label="押运员电话">{currentApproval.escortPhone}</Descriptions.Item>
              <Descriptions.Item label="编队编号">{currentApproval.formationNo}</Descriptions.Item>
              <Descriptions.Item label="计划日期">{currentApproval.planDate}</Descriptions.Item>
              <Descriptions.Item label="货物品类">{currentApproval.cargoType}</Descriptions.Item>
              <Descriptions.Item label="货物量">{currentApproval.cargoAmount}</Descriptions.Item>
              <Descriptions.Item label="托运企业" span={2}>{currentApproval.shipperName}</Descriptions.Item>
              <Descriptions.Item label="承运企业" span={2}>{currentApproval.carrierName}</Descriptions.Item>
              <Descriptions.Item label="大桥名称">{currentApproval.bridgeName}</Descriptions.Item>
              <Descriptions.Item label="方向">
                <Tag color={currentApproval.direction === '上桥' ? 'blue' : 'green'}>
                  {currentApproval.direction}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="申请时间">{currentApproval.applyTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批时间">{currentApproval.approveTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批人">{currentApproval.approver || '-'}</Descriptions.Item>
              <Descriptions.Item label="审批意见">{currentApproval.approveRemark || '-'}</Descriptions.Item>
              <Descriptions.Item label="上桥时间">{currentApproval.upBridgeTime || '-'}</Descriptions.Item>
              <Descriptions.Item label="下桥时间">{currentApproval.downBridgeTime || '-'}</Descriptions.Item>
            </Descriptions>

            <Divider>时间轴</Divider>

            <Timeline
              items={[
                {
                  color: 'green',
                  children: (
                    <>
                      <div>申请提交</div>
                      <div style={{ color: '#999' }}>{currentApproval.applyTime || '未提交'}</div>
                    </>
                  )
                },
                {
                  color: currentApproval.approveTime ? 'green' : 'gray',
                  children: (
                    <>
                      <div>审批完成</div>
                      <div style={{ color: '#999' }}>{currentApproval.approveTime || '待审批'}</div>
                      {currentApproval.approveRemark && (
                        <div style={{ color: '#666' }}>备注：{currentApproval.approveRemark}</div>
                      )}
                    </>
                  )
                },
                {
                  color: currentApproval.upBridgeTime ? 'green' : 'gray',
                  children: (
                    <>
                      <div>上桥</div>
                      <div style={{ color: '#999' }}>{currentApproval.upBridgeTime || '未上桥'}</div>
                    </>
                  )
                },
                {
                  color: currentApproval.downBridgeTime ? 'green' : 'gray',
                  children: (
                    <>
                      <div>下桥</div>
                      <div style={{ color: '#999' }}>{currentApproval.downBridgeTime || '未下桥'}</div>
                    </>
                  )
                }
              ]}
            />
          </>
        )}
      </Drawer>
    </Card>
  )
}

export default BridgeApprovalPage
