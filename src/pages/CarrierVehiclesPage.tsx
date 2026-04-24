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

interface CarrierVehicle {
  id: string
  plateNumber: string
  carrier: string
  vehicleType: string
  brand: string
  location: string
  资质: string[]
  createTime: string
  lastUpdateTime: string
}

const CarrierVehiclesPage = () => {
  const [form] = Form.useForm()

  const mockData: CarrierVehicle[] = [
    {
      id: '1',
      plateNumber: '浙A12345',
      carrier: '安全运输有限公司',
      vehicleType: '车头',
      brand: '解放',
      location: '杭州市西湖区',
      资质: ['行驶证', '营运证'],
      createTime: '2024-01-01 10:00:00',
      lastUpdateTime: '2024-03-01 15:30:00',
    },
    {
      id: '2',
      plateNumber: '浙A1234挂',
      carrier: '安全运输有限公司',
      vehicleType: '挂车',
      brand: '中集',
      location: '杭州市余杭区',
      资质: ['行驶证', '营运证', '压力容器使用证'],
      createTime: '2024-01-15 09:00:00',
      lastUpdateTime: '2024-02-20 14:00:00',
    },
    {
      id: '3',
      plateNumber: '浙B23456',
      carrier: '危险品运输集团',
      vehicleType: '车头',
      brand: '东风',
      location: '宁波市北仑区',
      资质: ['行驶证', '营运证', '违章清零记录'],
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
      title: '车辆号码',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
    },
    {
      title: '所属承运企业',
      dataIndex: 'carrier',
      key: 'carrier',
    },
    {
      title: '车辆类型',
      dataIndex: 'vehicleType',
      key: 'vehicleType',
    },
    {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: '当前位置',
      dataIndex: 'location',
      key: 'location',
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
        <h1 style={{ margin: 0 }}>承运车辆管理</h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理承运车辆信息和资质</p>
      </div>
      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="所属承运企业" name="carrier">
          <Select style={{ width: 200 }} placeholder="请选择" />
        </Form.Item>
        <Form.Item label="车牌号码" name="plateNumber">
          <Input style={{ width: 200 }} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="车辆类型" name="vehicleType">
          <Select style={{ width: 200 }} placeholder="请选择">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="车头">车头</Select.Option>
            <Select.Option value="挂车">挂车</Select.Option>
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

export default CarrierVehiclesPage
