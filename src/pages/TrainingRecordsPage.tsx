
import {
  Card,
  Form,
  Input,
  Select,
  Table,
  Button,
  Space,
  DatePicker,
} from 'antd'

interface TrainingRecord {
  id: string
  planDetailNo: string
  materialName: string
  materialType: string
  name: string
  position: string
  status: string
  completeTime: string
}

const TrainingRecordsPage = () => {
  const [form] = Form.useForm()

  const mockData: TrainingRecord[] = [
    {
      id: '1',
      planDetailNo: 'JD20231212001',
      materialName: '资料名称1',
      materialType: '视频',
      name: '张三',
      position: '驾驶员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '2',
      planDetailNo: 'JD20231212002',
      materialName: '资料名称2',
      materialType: '文章',
      name: '张三',
      position: '押运员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '3',
      planDetailNo: 'JD20231212003',
      materialName: '资料名称3',
      materialType: '视频',
      name: '张三',
      position: '驾驶员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '4',
      planDetailNo: 'JD20231212004',
      materialName: '资料名称4',
      materialType: '文章',
      name: '张三',
      position: '驾驶员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '5',
      planDetailNo: 'JD20231212005',
      materialName: '资料名称5',
      materialType: '视频',
      name: '张三',
      position: '驾驶员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '6',
      planDetailNo: 'JD20231212006',
      materialName: '资料名称6',
      materialType: '文章',
      name: '张三',
      position: '驾驶员',
      status: '已完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '7',
      planDetailNo: 'JD20231212007',
      materialName: '资料名称7',
      materialType: '视频',
      name: '张三',
      position: '驾驶员',
      status: '未完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '8',
      planDetailNo: 'JD20231212008',
      materialName: '资料名称8',
      materialType: '文章',
      name: '张三',
      position: '驾驶员',
      status: '未完成',
      completeTime: '2023-12-12 12:05:05',
    },
    {
      id: '9',
      planDetailNo: 'JD20231212009',
      materialName: '资料名称9',
      materialType: '视频',
      name: '张三',
      position: '押运员',
      status: '未完成',
      completeTime: '2023-12-12 12:05:05',
    },
  ]

  const columns = [
    {
      title: '计划明细号',
      dataIndex: 'planDetailNo',
      key: 'planDetailNo',
    },
    {
      title: '资料名称',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: '资料类型',
      dataIndex: 'materialType',
      key: 'materialType',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '培训完成时间',
      dataIndex: 'completeTime',
      key: 'completeTime',
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>培训记录</h1>
        <p style={{ margin: '4px 0 0 0', color: '#666' }}>查看培训记录信息</p>
      </div>

      <Form
        form={form}
        layout="inline"
        style={{ marginBottom: 16 }}
      >
        <Form.Item label="计划明细号" name="planDetailNo">
          <Input style={{ width: 200 }} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="姓名/电话等" name="search">
          <Input style={{ width: 200 }} placeholder="请输入" />
        </Form.Item>
        <Form.Item label="培训状态" name="status">
          <Select style={{ width: 150 }} placeholder="请选择">
            <Select.Option value="全部">全部</Select.Option>
            <Select.Option value="已完成">已完成</Select.Option>
            <Select.Option value="未完成">未完成</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="完成时间" name="timeRange">
          <DatePicker.RangePicker style={{ width: 300 }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
        </Form.Item>
      </Form>

      <Table 
        columns={columns} 
        dataSource={mockData} 
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
      />
    </Card>
  )
}

export default TrainingRecordsPage
