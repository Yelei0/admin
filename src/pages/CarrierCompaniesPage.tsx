import {
  Card,
  Form,
  Select,
  Table,
  Button,
  Tag,
  Space,
} from 'antd'

interface CarrierCompany {
  id: string
  name: string
  contact: string
  phone: string
 资质: string[]
  createTime: string
  lastUpdateTime: string
}

const CarrierCompaniesPage = () => {
  const [form] = Form.useForm()

  const mockData: CarrierCompany[] = [
    {
      id: '1',
      name: '安全运输有限公司',
      contact: '张经理',
      phone: '13800138000',
      资质: ['营业执照', '道路运输许可证'],
      createTime: '2024-01-01 10:00:00',
      lastUpdateTime: '2024-03-01 15:30:00',
    },
    {
      id: '2',
      name: '危险品运输集团',
      contact: '李总',
      phone: '13900139000',
      资质: ['营业执照', '道路运输许可证', '危险品运输许可证'],
      createTime: '2024-01-15 09:00:00',
      lastUpdateTime: '2024-02-20 14:00:00',
    },
    {
      id: '3',
      name: '恒通物流集团',
      contact: '王主管',
      phone: '13700137000',
      资质: ['营业执照', '道路运输许可证'],
      createTime: '2024-02-01 11:00:00',
      lastUpdateTime: '2024-03-15 10:00:00',
    },
  ]

  const getTagColor = () => {
    // 模拟证件状态，实际项目中应该从数据中获取
    const status = Math.random();
    if (status > 0.7) return 'red';
    if (status > 0.3) return 'orange';
    return 'green';
  };

  const columns = [
    {
      title: '承运企业名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '联系人',
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: '联系人电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '资质信息',
      dataIndex: '资质',
      key: '资质',
      render: (tags: string[]) => (
        <Space size="small">
          {tags.map((tag) => (
            <Tag key={tag} color={getTagColor()}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '最新更新证件时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" size="small">
          证件下载
        </Button>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>承运企业管理</h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理承运企业信息和资质</p>
      </div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="承运企业名称" name="companyName">
          <Select style={{ width: 200 }} placeholder="请选择" />
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
    </Card>
  )
}

export default CarrierCompaniesPage
