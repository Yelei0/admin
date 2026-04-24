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
} from 'antd'

// 押运车辆接口
interface EscortVehicle {
  id: string
  plateNumber: string // 车牌号
}

// 初始模拟数据
const initialVehicles: EscortVehicle[] = [
  { id: 'V001', plateNumber: '浙A12345' },
  { id: 'V002', plateNumber: '浙A67890' },
  { id: 'V003', plateNumber: '浙B12345' },
  { id: 'V004', plateNumber: '浙C12345' },
  { id: 'V005', plateNumber: '浙C67890' },
  { id: 'V006', plateNumber: '浙C24680' },
  { id: 'V007', plateNumber: '浙D12345' },
  { id: 'V008', plateNumber: '浙D67890' },
  { id: 'V009', plateNumber: '浙E12345' },
  { id: 'V010', plateNumber: '浙E67890' },
]

const EscortVehiclesPage = () => {
  const [data, setData] = useState<EscortVehicle[]>(initialVehicles)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState<EscortVehicle | null>(null)
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      flex: 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: EscortVehicle) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingVehicle(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (vehicle: EscortVehicle) => {
    setEditingVehicle(vehicle)
    form.setFieldsValue(vehicle)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingVehicle) {
        // 更新现有车辆
        setData(data.map(item => 
          item.id === editingVehicle.id 
            ? { ...item, ...values } 
            : item
        ))
        message.success('更新成功')
      } else {
        // 添加新车
        const newVehicle: EscortVehicle = {
          id: `V${Date.now()}`,
          ...values,
        }
        setData([...data, newVehicle])
        message.success('添加成功')
      }
      setIsModalOpen(false)
    })
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>押运车辆维护</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>维护押运车辆的基础信息，包括车牌号等</p>
        </div>
        <Button type="primary" onClick={handleAdd}>
          新增车辆
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        scroll={{
          x: 800,
          y: 600,
        }}
      />

      <Modal
        title={editingVehicle ? '编辑车辆' : '新增车辆'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="plateNumber"
            label="车牌号"
            rules={[{ required: true, message: '请输入车牌号' }]}
          >
            <Input placeholder="请输入车牌号" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default EscortVehiclesPage
