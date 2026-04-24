import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Space, Select, DatePicker, Popconfirm, message, Descriptions, Tag, Badge, Tooltip, Drawer } from 'antd'
import { ReloadOutlined, DownloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import PRDAnnotation from '../components/PRDAnnotation'

interface PlanDetail {
  id: string
  batchNumber: string
  carrier: string
  licensePlate: string
  driver: string
  cargoAmount: string
  plannedTime: string
  actualTime: string
  status: string
  cargoType: string
  isException: boolean
  exceptionReason: string
}

const PlanDetailPage = () => {
  const [data, setData] = useState<PlanDetail[]>([
    {
      id: 'MX20240101001',
      batchNumber: 'PC20240101001',
      carrier: '危险品运输集团',
      licensePlate: '浙A12345',
      driver: '张师傅',
      cargoAmount: '20吨',
      plannedTime: '2024-01-15 08:00',
      actualTime: '08:15集结/09:30上桥',
      status: '待集结',
      cargoType: '液化石油气',
      isException: false,
      exceptionReason: '',
    },
    {
      id: 'MX20240101002',
      batchNumber: 'PC20240101001',
      carrier: '危险品运输集团',
      licensePlate: '浙A12346',
      driver: '李师傅',
      cargoAmount: '15吨',
      plannedTime: '2024-01-15 08:00',
      actualTime: '08:20集结/09:45上桥',
      status: '已集结',
      cargoType: '液化石油气',
      isException: false,
      exceptionReason: '',
    },
    {
      id: 'MX20240101003',
      batchNumber: 'PC20240101002',
      carrier: '安全运输公司',
      licensePlate: '浙B67890',
      driver: '王师傅',
      cargoAmount: '25吨',
      plannedTime: '2024-01-16 09:00',
      actualTime: '09:10集结/10:30上桥',
      status: '押运中',
      cargoType: '硫酸',
      isException: true,
      exceptionReason: '车辆故障，已维修',
    },
    {
      id: 'MX20240102001',
      batchNumber: 'PC20240102001',
      carrier: '危险品运输集团',
      licensePlate: '浙A12347',
      driver: '赵师傅',
      cargoAmount: '30吨',
      plannedTime: '2024-01-17 10:00',
      actualTime: '10:05集结/11:30上桥',
      status: '已过桥',
      cargoType: '柴油',
      isException: false,
      exceptionReason: '',
    },
    {
      id: 'MX20240102002',
      batchNumber: 'PC20240102001',
      carrier: '安全运输公司',
      licensePlate: '浙B67891',
      driver: '刘师傅',
      cargoAmount: '22吨',
      plannedTime: '2024-01-17 10:00',
      actualTime: '10:10集结/11:45上桥',
      status: '已完成',
      cargoType: '汽油',
      isException: false,
      exceptionReason: '',
    },
  ])

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<PlanDetail | null>(null)
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(new Date().toLocaleString())

  const handleRefresh = () => {
    message.success('数据已刷新')
    setLastRefreshTime(new Date().toLocaleString())
  }

  const handleExport = () => {
    message.success('导出成功，文件正在下载')
  }

  const handleViewDetail = (record: PlanDetail) => {
    setSelectedDetail(record)
    setIsDrawerOpen(true)
  }

  const getStatusTag = (status: string, isException: boolean) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      '待集结': { color: 'orange', text: '待集结' },
      '已集结': { color: 'blue', text: '已集结' },
      '押运中': { color: 'orange', text: '押运中' },
      '已过桥': { color: 'blue', text: '已过桥' },
      '已完成': { color: 'green', text: '已完成' },
      '异常': { color: 'red', text: '异常' },
    }

    if (isException) {
      return <Tag color="red">异常</Tag>
    }

    const { color, text } = statusMap[status] || { color: 'default', text: status }
    return <Tag color={color}>{text}</Tag>
  }

  const columns = [
    {
      title: '明细ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '关联批次号',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 120,
    },
    {
      title: '承运方',
      dataIndex: 'carrier',
      key: 'carrier',
      width: 120,
    },
    {
      title: '车牌',
      dataIndex: 'licensePlate',
      key: 'licensePlate',
      width: 100,
    },
    {
      title: '驾驶员',
      dataIndex: 'driver',
      key: 'driver',
      width: 100,
    },
    {
      title: '货物量',
      dataIndex: 'cargoAmount',
      key: 'cargoAmount',
      width: 80,
    },
    {
      title: '计划时间',
      dataIndex: 'plannedTime',
      key: 'plannedTime',
      width: 140,
    },
    {
      title: '实际节点时间',
      dataIndex: 'actualTime',
      key: 'actualTime',
      width: 160,
      render: (text: string, record: PlanDetail) => (
        <div>
          <div>{text}</div>
          {record.isException && (
            <Tooltip title={record.exceptionReason}>
              <Button
                type="text"
                danger
                size="small"
                icon={<ExclamationCircleOutlined />}
                style={{ padding: 0, margin: 0, fontSize: 12 }}
              >
                异常
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      title: '当前状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string, record: PlanDetail) => getStatusTag(status, record.isException),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: unknown, record: PlanDetail) => (
        <Space size={12}>
          <Button
            type="text"
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0 }}>计划明细管理</h1>
          <p style={{ margin: '4px 0 0 0', color: '#666' }}>管理运输计划明细，包括任务接收、派车、状态跟踪等操作</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <PRDAnnotation
              id={2}
              title="数据刷新"
              content={
                <div>
                  <p><strong>功能描述</strong>：手动刷新数据，获取最新的计划明细信息</p>
                  <p><strong>操作入口</strong>：点击"刷新"按钮</p>
                  <p><strong>业务规则</strong>：</p>
                  <ul>
                    <li>点击刷新按钮后重新加载数据</li>
                    <li>刷新成功后显示"数据已刷新"提示</li>
                    <li>更新"上次刷新时间"显示</li>
                  </ul>
                </div>
              }
            />
            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
              刷新
            </Button>
          </div>
          <div style={{ position: 'relative' }}>
            <PRDAnnotation
              id={3}
              title="导出明细报表"
              content={
                <div>
                  <p><strong>功能描述</strong>：将当前筛选结果导出为Excel文件</p>
                  <p><strong>操作入口</strong>：点击"导出明细报表"按钮</p>
                  <p><strong>业务规则</strong>：</p>
                  <ul>
                    <li><span className="status-dot status-dot-red"></span>单次导出上限：<strong>1000条</strong></li>
                    <li>超出限制需分批导出或使用更精确筛选条件</li>
                    <li>导出格式：Excel (.xlsx)</li>
                    <li>显示导出进度条</li>
                    <li>导出完成后自动下载文件</li>
                  </ul>
                  <p><strong>导出字段</strong>：</p>
                  <ul>
                    <li>明细ID、关联批次号、承运方</li>
                    <li>车牌、驾驶员、货物类型/数量</li>
                    <li>计划时间、实际节点时间、当前状态</li>
                  </ul>
                </div>
              }
            />
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出明细报表
            </Button>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 16 }}>
        <PRDAnnotation
          id={1}
          title="搜索筛选"
          content={
            <div>
              <p><strong>操作入口</strong>：在搜索区输入查询条件后点击"搜索"按钮</p>
              <p><strong>支持字段</strong>：</p>
              <ul>
                <li>批次计划编号（精确匹配）</li>
                <li>计划日期（日期范围）</li>
                <li>承运企业（模糊匹配）</li>
                <li>车牌号（精确匹配）</li>
                <li>货物类型（下拉选择）</li>
                <li>执行状态（下拉选择）</li>
              </ul>
              <p><strong>业务规则</strong>：</p>
              <ul>
                <li>支持多条件组合查询</li>
                <li>查询条件为空时显示全部数据</li>
                <li>点击"重置"按钮清空所有查询条件</li>
              </ul>
            </div>
          }
        />
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Input placeholder="批次计划编号" style={{ width: 160 }} />
          <Input placeholder="承运企业" style={{ width: 160 }} />
          <Input placeholder="车牌号" style={{ width: 120 }} />
          <Select placeholder="货物类型" style={{ width: 120 }} />
          <Select placeholder="执行状态" style={{ width: 120 }} />
          <Space>
            <Button type="primary">搜索</Button>
            <Button>重置</Button>
          </Space>
        </div>
      </div>

      <div style={{ position: 'relative', marginBottom: 8 }}>
        <PRDAnnotation
          id={4}
          title="执行状态"
          content={
            <div>
              <p><strong>状态定义</strong>：</p>
              <ul>
                <li><span className="status-dot status-dot-gray"></span><strong>待集结</strong> - 车辆尚未到达集结点</li>
                <li><span className="status-dot status-dot-blue"></span><strong>已集结</strong> - 车辆已到达集结点</li>
                <li><span className="status-dot status-dot-orange"></span><strong>押运中</strong> - 正在执行运输任务</li>
                <li><span className="status-dot status-dot-blue"></span><strong>已过桥</strong> - 已通过关键节点</li>
                <li><span className="status-dot status-dot-green"></span><strong>已完成</strong> - 运输任务完成</li>
                <li><span className="status-dot status-dot-red"></span><strong>异常</strong> - 运输过程出现异常</li>
              </ul>
              <p><strong>状态流转</strong>：</p>
              <div style={{ padding: '8px', background: '#f6ffed', borderRadius: '4px', marginBottom: '12px' }}>
                <p style={{ margin: 0 }}>待集结 → 已集结 → 押运中 → 已过桥 → 已完成</p>
                <p style={{ margin: '4px 0 0 0', color: '#ff4d4f' }}>异常状态可任意节点触发</p>
              </div>
              <p><strong>显示样式</strong>：</p>
              <ul>
                <li>使用不同颜色的标签显示状态</li>
                <li>异常状态行显示红色背景</li>
                <li>hover时背景色加深</li>
              </ul>
            </div>
          }
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Badge status="default" text="待集结" />
          <Badge status="processing" text="已集结" />
          <Badge status="warning" text="押运中" />
          <Badge status="processing" text="已过桥" />
          <Badge status="success" text="已完成" />
          <Badge status="error" text="异常" />
          <span style={{ marginLeft: 16, color: '#666' }}>上次刷新时间：{lastRefreshTime}</span>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1200, y: 'calc(100vh - 400px)' }}
        rowClassName={(record) => record.isException ? 'exception-row' : ''}
      />

      <Drawer
        title="计划明细详情"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        placement="right"
        width={700}
      >
        {selectedDetail && (
          <div>
            <div style={{ position: 'relative' }}>
              <PRDAnnotation
                id={5}
                title="查看详情"
                content={
                  <div>
                    <p><strong>操作入口</strong>：点击表格中某条记录的"查看"按钮</p>
                    <p><strong>详情内容</strong>：</p>
                    <ul>
                      <li><strong>基本信息</strong> - 明细ID、批次号、承运企业、车牌、驾驶员、货物信息</li>
                      <li><strong>自检结果</strong> - 车辆状态、安全设备、驾驶员状态、检查时间</li>
                      <li><strong>押运队信息</strong> - 队长、队员、联系电话</li>
                      <li><strong>关键时间轴</strong> - 计划时间 vs 实际时间对比</li>
                      <li><strong>异常报备记录</strong> - 异常类型、时间、描述、报告人</li>
                      <li><strong>轨迹与监控</strong> - 实时轨迹链接、监控链接</li>
                    </ul>
                    <p><strong>显示样式</strong>：</p>
                    <ul>
                      <li>以抽屉形式展示详情</li>
                      <li>异常状态行显示红色背景</li>
                      <li>实际节点时间列显示红色异常按钮，点击查看原因</li>
                    </ul>
                  </div>
                }
              />
            </div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="明细ID">{selectedDetail.id}</Descriptions.Item>
              <Descriptions.Item label="关联批次号">{selectedDetail.batchNumber}</Descriptions.Item>
              <Descriptions.Item label="承运方">{selectedDetail.carrier}</Descriptions.Item>
              <Descriptions.Item label="车牌">{selectedDetail.licensePlate}</Descriptions.Item>
              <Descriptions.Item label="驾驶员">{selectedDetail.driver}</Descriptions.Item>
              <Descriptions.Item label="货物类型">{selectedDetail.cargoType}</Descriptions.Item>
              <Descriptions.Item label="货物量">{selectedDetail.cargoAmount}</Descriptions.Item>
              <Descriptions.Item label="计划时间">{selectedDetail.plannedTime}</Descriptions.Item>
              <Descriptions.Item label="实际节点时间">{selectedDetail.actualTime}</Descriptions.Item>
              <Descriptions.Item label="当前状态">{getStatusTag(selectedDetail.status, selectedDetail.isException)}</Descriptions.Item>
              {selectedDetail.isException && (
                <Descriptions.Item label="异常原因" style={{ color: '#ff4d4f' }}>
                  {selectedDetail.exceptionReason}
                </Descriptions.Item>
              )}
            </Descriptions>
          </div>
        )}
      </Drawer>
    </Card>
  )
}

export default PlanDetailPage