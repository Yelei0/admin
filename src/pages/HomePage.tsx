import { Card, Tag, Typography, Divider } from 'antd'

const { Title, Text } = Typography

// 计划明细状态流转数据
const planDetailStatusFlowData = [
  {
    stage: '审批阶段',
    statuses: [
      { value: 'pending', label: '待审批', color: 'orange' },
      { value: 'rejected', label: '已驳回', color: 'red' },
    ],
    next: 'waiting_assemble',
    description: '审批通过后进入待集结'
  },
  {
    stage: '集结阶段',
    statuses: [
      { value: 'waiting_assemble', label: '待集结', color: 'orange' },
    ],
    next: 'waiting_training',
    description: '到达集结点后进入待培训'
  },
  {
    stage: '培训阶段',
    statuses: [
      { value: 'waiting_training', label: '待培训', color: 'orange' },
    ],
    next: 'waiting_self_check',
    description: '培训完成后进入待自查'
  },
  {
    stage: '自查阶段',
    statuses: [
      { value: 'waiting_self_check', label: '待自查', color: 'orange' },
      { value: 'self_check_waiting_confirm', label: '自查待确认', color: 'orange' },
      { value: 'self_check_rejected', label: '自查已驳回', color: 'red' },
    ],
    next: 'waiting_forming',
    description: '自查确认通过后进入待编队'
  },
  {
    stage: '编队阶段',
    statuses: [
      { value: 'waiting_forming', label: '待编队', color: 'orange' },
    ],
    next: 'waiting_bridge_approval',
    description: '编队完成后进入待过桥审批'
  },
  {
    stage: '过桥审批',
    statuses: [
      { value: 'waiting_bridge_approval', label: '待过桥审批', color: 'orange' },
    ],
    next: 'escorting',
    description: '过桥审批通过后进入押运中'
  },
  {
    stage: '执行阶段',
    statuses: [
      { value: 'escorting', label: '押运中', color: 'blue' },
      { value: 'completed', label: '已完成', color: 'green' },
    ],
    next: null,
    description: '押运完成后进入已完成'
  },
]

// 批次计划状态流转数据
const batchPlanStatusFlowData = [
  {
    stage: '提报阶段',
    statuses: [
      { value: 'pending', label: '待审批', color: 'orange' },
    ],
    next: 'approved/rejected',
    description: '托运企业提报后等待审批'
  },
  {
    stage: '审批阶段',
    statuses: [
      { value: 'approved', label: '已通过', color: 'green' },
      { value: 'rejected', label: '已驳回', color: 'red' },
    ],
    next: 'dispatching',
    description: '审批通过后承运商开始派车'
  },
  {
    stage: '派车阶段',
    statuses: [
      { value: 'dispatching', label: '派车中', color: 'blue' },
      { value: 'dispatch_completed', label: '派车完成', color: 'green' },
    ],
    next: null,
    description: '派车数量达到设定车数后完成'
  },
]

const HomePage = () => {
  return (
    <div style={{
      height: '100%',
      overflow: 'auto',
      padding: '24px',
      background: '#f5f5f5'
    }}>
      <Card style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>危化品运输管理平台</Title>
        <Text type="secondary">批次计划与计划明细状态流转说明</Text>
      </Card>

      {/* 批次计划状态流转 */}
      <Card title="批次计划状态流转" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待审批</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>已通过</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>派车中</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>派车完成</Tag>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 12, gap: 16 }}>
          <Tag color="red" style={{ fontSize: 12, padding: '2px 8px' }}>已驳回</Tag>
          <Tag color="default" style={{ fontSize: 12, padding: '2px 8px' }}>已取消</Tag>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
        {batchPlanStatusFlowData.map((stage, index) => (
          <Card key={index} size="small" title={stage.stage}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {stage.statuses.map((status) => (
                <Tag key={status.value} color={status.color} style={{ fontSize: 12 }}>
                  {status.label}
                </Tag>
              ))}
            </div>
            {stage.next && (
              <div style={{ color: '#666', fontSize: 12 }}>
                <span style={{ color: '#999' }}>→</span> {stage.description}
              </div>
            )}
            {!stage.next && (
              <div style={{ color: '#52c41a', fontSize: 12 }}>
                ✓ {stage.description}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card title="批次计划要点说明" style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          <div>
            <Title level={5} style={{ color: '#1890ff' }}>状态流转规则</Title>
            <ul style={{ paddingLeft: 20, margin: 0, color: '#666' }}>
              <li>托运企业在前台提报批次计划，状态为<strong>待审批</strong></li>
              <li>计划管理端审批通过后变为<strong>已通过</strong>，驳回则为<strong>已驳回</strong></li>
              <li>承运商根据批次计划派车，开始派车后状态变为<strong>派车中</strong></li>
              <li>当派车数 = 批次设定车数时，状态变为<strong>派车完成</strong></li>
            </ul>
          </div>
          <div>
            <Title level={5} style={{ color: '#ff4d4f' }}>取消规则</Title>
            <ul style={{ paddingLeft: 20, margin: 0, color: '#666' }}>
              <li><strong>可取消状态：</strong>待审批、已通过</li>
              <li><strong>不可取消状态：</strong>已驳回（已结束）、派车中（已开始执行）、派车完成（已完成）</li>
              <li>只有待审批和已通过状态的批次计划可以取消</li>
            </ul>
          </div>
        </div>
        <Divider />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div><Tag color="orange">橙色</Tag> - 待审批</div>
          <div><Tag color="green">绿色</Tag> - 已通过 / 派车完成</div>
          <div><Tag color="blue">蓝色</Tag> - 派车中</div>
          <div><Tag color="red">红色</Tag> - 已驳回</div>
          <div><Tag color="default">灰色</Tag> - 已取消</div>
        </div>
      </Card>

      <Divider>计划明细状态流转</Divider>

      {/* 计划明细状态流转 */}
      <Card title="计划明细状态流转总览" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待审批</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待集结</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待培训</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待自查</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>自查待确认</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待编队</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="orange" style={{ fontSize: 14, padding: '4px 12px' }}>待过桥审批</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="blue" style={{ fontSize: 14, padding: '4px 12px' }}>押运中</Tag>
          <span style={{ color: '#999', fontSize: 20 }}>→</span>
          <Tag color="green" style={{ fontSize: 14, padding: '4px 12px' }}>已完成</Tag>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {planDetailStatusFlowData.map((stage, index) => (
          <Card key={index} size="small" title={stage.stage}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {stage.statuses.map((status) => (
                <Tag key={status.value} color={status.color} style={{ fontSize: 12 }}>
                  {status.label}
                </Tag>
              ))}
            </div>
            {stage.next && (
              <div style={{ color: '#666', fontSize: 12 }}>
                <span style={{ color: '#999' }}>→</span> {stage.description}
              </div>
            )}
            {!stage.next && (
              <div style={{ color: '#52c41a', fontSize: 12 }}>
                ✓ {stage.description}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card title="计划明细 - 驳回与取消规则" style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          <div>
            <Title level={5} style={{ color: '#ff4d4f' }}>驳回规则</Title>
            <div style={{ marginBottom: 8 }}>
              <Tag color="red">已驳回</Tag>
              <Text> 审批阶段被驳回，可查看驳回原因</Text>
            </div>
            <div>
              <Tag color="red">自查已驳回</Tag>
              <Text> 自查阶段被驳回，可查看驳回原因</Text>
            </div>
          </div>
          <div>
            <Title level={5} style={{ color: '#faad14' }}>取消规则</Title>
            <Text type="secondary">
              以下状态允许取消：待审批、已驳回、待集结、待培训、待自查、自查待确认、自查已驳回、待编队
            </Text>
            <div style={{ marginTop: 8 }}>
              <Text strong type="danger">编队完成后（待过桥审批）不允许取消</Text>
            </div>
          </div>
        </div>
      </Card>

      <Card title="计划明细 - 状态说明" style={{ marginTop: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          <div><Tag color="blue">蓝色</Tag> - 押运中</div>
          <div><Tag color="orange">橙色</Tag> - 待操作/进行中/等待中</div>
          <div><Tag color="green">绿色</Tag> - 已完成</div>
          <div><Tag color="red">红色</Tag> - 已驳回/已取消</div>
          <div><Tag color="default">灰色</Tag> - 已取消</div>
        </div>
      </Card>
    </div>
  )
}

export default HomePage
