import { useState } from 'react'
import {
  Card,
  Form,
  Input,
  Select,
  Table,
  Button,
  Switch,
  Space,
  Modal,
  DatePicker,
  Radio,
  message,
} from 'antd'

interface TrainingMaterial {
  id: string
  name: string
  type: string
  creator: string
  lastModifier: string
  createTime: string
  lastModifyTime: string
  viewCount: string
  duration: number
  status: string
}

const TrainingMaterialsPage = () => {
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecord, setEditingRecord] = useState<TrainingMaterial | null>(null)

  const mockData: TrainingMaterial[] = [
    {
      id: '1',
      name: '应急操作名称',
      type: '视频',
      creator: '张三',
      lastModifier: '张三',
      createTime: '2023-10-09 10:20',
      lastModifyTime: '2023-10-09 10:20',
      viewCount: '不限',
      duration: 10,
      status: '已上传',
    },
    {
      id: '2',
      name: '边缘资料名称',
      type: '文章',
      creator: '张三',
      lastModifier: '张三',
      createTime: '2023-10-09 10:20',
      lastModifyTime: '2023-10-09 10:20',
      viewCount: '不限',
      duration: 5,
      status: '已上传',
    },
    {
      id: '3',
      name: '边缘资料名称',
      type: '文章',
      creator: '张三',
      lastModifier: '张三',
      createTime: '2023-10-09 10:20',
      lastModifyTime: '2023-10-09 10:20',
      viewCount: '不限',
      duration: 5,
      status: '已上传',
    },
    {
      id: '4',
      name: '边缘资料名称',
      type: '文章',
      creator: '张三',
      lastModifier: '李四',
      createTime: '2023-10-09 10:20',
      lastModifyTime: '2023-10-09 10:20',
      viewCount: '3',
      duration: 5,
      status: '已上传',
    },
    {
      id: '5',
      name: '边缘资料名称',
      type: '文章',
      creator: '张三',
      lastModifier: '李四',
      createTime: '2023-10-09 10:20',
      lastModifyTime: '2023-10-09 10:20',
      viewCount: '2',
      duration: 5,
      status: '已上传',
    },
  ]

  const columns = [
    {
      title: '资料名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: '修改人',
      dataIndex: 'lastModifier',
      key: 'lastModifier',
    },
    {
      title: '修改时间',
      dataIndex: 'lastModifyTime',
      key: 'lastModifyTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '浏览次数',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: '学习时长(min)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '附件',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '相关操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small">预览</Button>
          <Button type="link" size="small">修改</Button>
          <Button type="link" size="small" danger>删除</Button>
        </Space>
      ),
    },
  ]

  const handleAdd = () => {
    setEditingRecord(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(() => {
      message.success('保存成功')
      setModalVisible(false)
    })
  }

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>培训资料管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理培训资料信息</p>
        </div>
        <Button type="primary" onClick={handleAdd}>新增</Button>
      </div>

      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="请输入资料名称" name="name">
          <Input style={{ width: 200 }} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="" name="type">
          <Select style={{ width: 120 }} placeholder="全部">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="视频">视频</Select.Option>
            <Select.Option value="文章">文章</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset">
            重置
          </Button>
        </Form.Item>
      </Form>

      <Table columns={columns} dataSource={mockData} rowKey="id" />

      <Modal
        title={editingRecord ? '修改培训资料' : '新增培训资料'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="资料名称" name="name" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
          <Form.Item label="有效开始日期" name="startDate" rules={[{ required: true, message: '请选择日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="有效结束日期" name="endDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="培训介绍" name="description">
            <Input.TextArea rows={4} placeholder="请输入" />
          </Form.Item>

          <Form.Item label="资料类型" name="type" rules={[{ required: true, message: '请选择' }]}>
            <Radio.Group>
              <Radio value="视频">视频</Radio>
              <Radio value="文档">文档</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="资料地址" name="url" rules={[{ required: true, message: '请输入' }]}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  )
}

export default TrainingMaterialsPage
