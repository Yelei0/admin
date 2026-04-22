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
} from 'antd'

// 押运人员接口
interface EscortPerson {
  id: string
  name: string // 姓名
  phone: string // 电话号码
  certificateNo: string // 身份证号
}

// 初始模拟数据
const initialPersonnel: EscortPerson[] = [
  { id: 'E001', name: '赵押运', phone: '13900139001', certificateNo: '330101199001011234' },
  { id: 'E002', name: '钱押运', phone: '13900139002', certificateNo: '330101199001011235' },
  { id: 'E003', name: '孙押运', phone: '13900139003', certificateNo: '330101199001011236' },
  { id: 'E004', name: '李押运', phone: '13900139004', certificateNo: '330101199001011237' },
  { id: 'E005', name: '周押运', phone: '13900139005', certificateNo: '330101199001011238' },
  { id: 'E006', name: '吴押运', phone: '13900139006', certificateNo: '330101199001011239' },
  { id: 'E007', name: '郑押运', phone: '13900139007', certificateNo: '330101199001011240' },
  { id: 'E008', name: '王押运', phone: '13900139008', certificateNo: '330101199001011241' },
  { id: 'E009', name: '冯押运', phone: '13900139009', certificateNo: '330101199001011242' },
  { id: 'E010', name: '陈押运', phone: '13900139010', certificateNo: '330101199001011243' },
]

const EscortPersonnelPage = () => {
  const [data, setData] = useState<EscortPerson[]>(initialPersonnel)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPerson, setEditingPerson] = useState<EscortPerson | null>(null)
  const [form] = Form.useForm()

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '电话号码',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '身份证号',
      dataIndex: 'certificateNo',
      key: 'certificateNo',
      flex: 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      align: 'center' as const,
      render: (_: unknown, record: EscortPerson) => (
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
    setEditingPerson(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (person: EscortPerson) => {
    setEditingPerson(person)
    form.setFieldsValue(person)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (editingPerson) {
        // 更新现有人员
        setData(data.map(item => 
          item.id === editingPerson.id 
            ? { ...item, ...values } 
            : item
        ))
        message.success('更新成功')
      } else {
        // 添加新人员
        const newPerson: EscortPerson = {
          id: `E${Date.now()}`,
          ...values,
        }
        setData([...data, newPerson])
        message.success('添加成功')
      }
      setIsModalOpen(false)
    })
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>押运人员维护</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>维护押运人员的基础信息，包括姓名、电话号码、身份证号等</p>
        </div>
        <Button type="primary" onClick={handleAdd}>
          新增人员
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
          x: 1000,
          y: 600,
        }}
      />

      <Modal
        title={editingPerson ? '编辑人员' : '新增人员'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="电话号码"
            rules={[{ required: true, message: '请输入电话号码' }]}
          >
            <Input placeholder="请输入电话号码" />
          </Form.Item>
          <Form.Item
            name="certificateNo"
            label="身份证号"
            rules={[{ required: true, message: '请输入身份证号' }]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default EscortPersonnelPage
