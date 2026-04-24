import {
  Card,
  Form,
  Input,
  Select,
  Table,
  Button,
  Tag,
  Space,
} from 'antd'

interface CarrierPersonnel {
  id: string
  name: string
  position: string
  carrier: string
  phone: string
  gender: string
  idCard: string
  证件: string[]
  createTime: string
  lastUpdateTime: string
}

const CarrierPersonnelPage = () => {
  const [form] = Form.useForm()

  const mockData: CarrierPersonnel[] = [
    {
      id: '1',
      name: '张师傅',
      position: '驾押人员',
      carrier: '安全运输有限公司',
      phone: '13800138001',
      gender: '男',
      idCard: '3301**********1234',
      证件: ['驾驶证', '从业资格证', '押运员证'],
      createTime: '2024-01-01 10:00:00',
      lastUpdateTime: '2024-03-01 15:30:00',
    },
    {
      id: '2',
      name: '李师傅',
      position: '驾驶员',
      carrier: '危险品运输集团',
      phone: '13900139001',
      gender: '男',
      idCard: '3301**********5678',
      证件: ['驾驶证', '从业资格证'],
      createTime: '2024-01-15 09:00:00',
      lastUpdateTime: '2024-02-20 14:00:00',
    },
    {
      id: '3',
      name: '赵押运',
      position: '押运员',
      carrier: '恒通物流集团',
      phone: '13700137001',
      gender: '女',
      idCard: '3301**********9012',
      证件: ['从业资格证', '押运员证'],
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
      title: '人员姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '工作岗位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '所属承运企业',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
    },
    {
      title: '证件信息',
      dataIndex: '证件',
      key: '证件',
      render: (tags: string[]) => (
        <Space size="small">
          {tags.map((tag) => (
            <Tag key={tag} color={getTagColor()}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: '最新更新证件时间',
      dataIndex: 'lastUpdateTime',
      key: 'lastUpdateTime',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
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
        <h1 style={{ margin: 0 }}>承运人员管理</h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理承运人员信息和资质</p>
      </div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="所属承运企业" name="carrier">
          <Select style={{ width: 200 }} placeholder="请选择" />
        </Form.Item>
        <Form.Item label="名称/手机号/身份证" name="search">
          <Input style={{ width: 300 }} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="人员职位" name="position">
          <Select style={{ width: 200 }} placeholder="请选择">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="驾押人员">驾押人员</Select.Option>
            <Select.Option value="驾驶员">驾驶员</Select.Option>
            <Select.Option value="押运员">押运员</Select.Option>
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
    </Card>
  )
}

export default CarrierPersonnelPage
