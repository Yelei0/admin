import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

interface DangerousGoods {
  id: string
  fullName: string
  shortName: string
  unCode: string
  cnCode: string
  casCode: string
  emergencyMeasures: string
}

const DangerousGoodsPage = () => {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [data, setData] = useState<DangerousGoods[]>([
    {
      id: '1',
      fullName: '液化石油气',
      shortName: '液化气',
      unCode: 'UN1075',
      cnCode: 'CN21053',
      casCode: '68476-85-7',
      emergencyMeasures: '远离火源，保持通风，使用防爆设备，泄漏时疏散人员',
    },
    {
      id: '2',
      fullName: '硫酸',
      shortName: '浓硫酸',
      unCode: 'UN1830',
      cnCode: 'CN81007',
      casCode: '7664-93-9',
      emergencyMeasures: '避免接触皮肤和眼睛，使用防护装备，泄漏时用碱中和',
    },
    {
      id: '3',
      fullName: '液氯',
      shortName: '氯气',
      unCode: 'UN1017',
      cnCode: 'CN23002',
      casCode: '7782-50-5',
      emergencyMeasures: '佩戴防毒面具，向上风向疏散，用水雾稀释',
    },
    {
      id: '4',
      fullName: '汽油',
      shortName: '汽油',
      unCode: 'UN1203',
      cnCode: 'CN31001',
      casCode: '86290-81-5',
      emergencyMeasures: '防火防爆，消除静电，使用防爆工具，喷雾状水冷却',
    },
    {
      id: '5',
      fullName: '甲醇',
      shortName: '甲醇',
      unCode: 'UN1230',
      cnCode: 'CN32058',
      casCode: '67-56-1',
      emergencyMeasures: '防火防毒，佩戴防护装备，泄漏时用抗溶性泡沫覆盖',
    },
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<DangerousGoods | null>(null)
  const [searchValues, setSearchValues] = useState<Record<string, string>>({})

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
      const itemValue = item[key as keyof DangerousGoods]
      if (typeof itemValue === 'string') {
        return itemValue.toLowerCase().includes(value.toLowerCase())
      }
      return true
    })
  })

  const columns = [
    {
      title: '货物全称',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 150,
    },
    {
      title: '简称',
      dataIndex: 'shortName',
      key: 'shortName',
      width: 100,
    },
    {
      title: 'UN码',
      dataIndex: 'unCode',
      key: 'unCode',
      width: 100,
    },
    {
      title: 'CN码',
      dataIndex: 'cnCode',
      key: 'cnCode',
      width: 100,
    },
    {
      title: 'CAS码',
      dataIndex: 'casCode',
      key: 'casCode',
      width: 120,
    },
    {
      title: '应急处置措施',
      dataIndex: 'emergencyMeasures',
      key: 'emergencyMeasures',
      ellipsis: true,
      flex: 1,
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: DangerousGoods) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条危险货物记录吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: DangerousGoods) => {
    setEditingRecord(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id))
    message.success('删除成功')
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        // 编辑
        setData(data.map(item =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        ))
        message.success('修改成功')
      } else {
        // 新增
        const newRecord: DangerousGoods = {
          id: Date.now().toString(),
          ...values,
        }
        setData([...data, newRecord])
        message.success('新增成功')
      }
      setIsModalOpen(false)
    })
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>危险货物管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理危险货物信息，包括货物基本信息、UN码、CN码、CAS码及应急处置措施</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增货物
        </Button>
      </div>
      <Form
        form={searchForm}
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16, display: 'flex', flexWrap: 'wrap', gap: '12px 24px' }}
      >
        <Form.Item label="货物全称" name="fullName">
          <Input placeholder="请输入货物全称" />
        </Form.Item>
        <Form.Item label="简称" name="shortName">
          <Input placeholder="请输入简称" />
        </Form.Item>
        <Form.Item label="UN码" name="unCode">
          <Input placeholder="请输入UN码" />
        </Form.Item>
        <Form.Item label="CN码" name="cnCode">
          <Input placeholder="请输入CN码" />
        </Form.Item>
        <Form.Item label="CAS码" name="casCode">
          <Input placeholder="请输入CAS码" />
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
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000, y: 'calc(100vh - 320px)' }}
      />

      <Modal
        title={editingRecord ? '编辑危险货物' : '新增危险货物'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        okText="确定"
        cancelText="取消"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ marginTop: 16 }}
        >
          <Form.Item
            label="货物全称"
            name="fullName"
            rules={[{ required: true, message: '请输入货物全称' }]}
          >
            <Input placeholder="请输入货物全称" />
          </Form.Item>

          <Form.Item
            label="简称"
            name="shortName"
            rules={[{ required: true, message: '请输入简称' }]}
          >
            <Input placeholder="请输入简称" />
          </Form.Item>

          <Form.Item
            label="UN码"
            name="unCode"
            rules={[{ required: true, message: '请输入UN码' }]}
          >
            <Input placeholder="例如：UN1075" />
          </Form.Item>

          <Form.Item
            label="CN码"
            name="cnCode"
            rules={[{ required: true, message: '请输入CN码' }]}
          >
            <Input placeholder="例如：CN21053" />
          </Form.Item>

          <Form.Item
            label="CAS码"
            name="casCode"
            rules={[{ required: true, message: '请输入CAS码' }]}
          >
            <Input placeholder="例如：68476-85-7" />
          </Form.Item>

          <Form.Item
            label="应急处置措施"
            name="emergencyMeasures"
            rules={[{ required: true, message: '请输入应急处置措施' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入应急处置措施"
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default DangerousGoodsPage
