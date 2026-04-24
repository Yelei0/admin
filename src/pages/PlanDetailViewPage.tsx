import { Card, Descriptions, Button, Tag, Divider } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

interface PlanDetail {
  id: string
  planDetailNo: string
  batchPlanNo: string
  escortBatchNo?: string
  planDate: string
  timeRange: string
  goodsCategory: string
  emergencyMeasures: string
  headVehicle: string
  trailer: string
  driverName: string
  driverPhone: string
  escortName: string
  escortPhone: string
  shipperName: string
  carrierName: string
  status: string
  rejectReason?: string
  selfCheckRejectReason?: string
  createTime?: string
  approvalTime?: string
  assembleArrivalTime?: string
  trainingCompleteTime?: string
  selfCheckCompleteTime?: string
  selfCheckConfirmTime?: string
  formingCompleteTime?: string
  bridgeApprovalTime?: string
  escortStartTime?: string
  completeTime?: string
  cancelTime?: string
  // 自检自查信息
  selfCheckInfo?: {
    vehicleStatus: string
    driverStatus: string
    escortStatus: string
    cargoStatus: string
    safetyEquipment: string
    emergencyKit: string
    otherChecks: string
  }
}

const PlanDetailViewPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const record = location.state?.record as PlanDetail

  if (!record) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p>未找到计划明细信息</p>
          <Button type="primary" onClick={() => navigate(-1)}>返回</Button>
        </div>
      </Card>
    )
  }

  const statusMap: Record<string, { color: string; text: string }> = {
    pending: { color: 'orange', text: '待审批' },
    rejected: { color: 'red', text: '已驳回' },
    waiting_assemble: { color: 'orange', text: '待集结' },
    waiting_training: { color: 'orange', text: '待培训' },
    waiting_self_check: { color: 'orange', text: '待自查' },
    self_check_waiting_confirm: { color: 'orange', text: '自查待确认' },
    self_check_rejected: { color: 'red', text: '自查已驳回' },
    waiting_forming: { color: 'orange', text: '待编队' },
    waiting_bridge_approval: { color: 'orange', text: '待过桥审批' },
    escorting: { color: 'blue', text: '押运中' },
    completed: { color: 'green', text: '已完成' },
    cancelled: { color: 'gray', text: '已取消' },
  }

  const statusInfo = statusMap[record.status] || { color: 'gray', text: '未知状态' }

  return (
    <Card>
      <div style={{ marginBottom: 24 }}>
        <Button type="link" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>返回</Button>
        <h1 style={{ margin: '16px 0' }}>计划明细详情</h1>
        <p style={{ color: '#666' }}>查看计划明细的详细信息</p>
      </div>

      <Descriptions title="基本信息" bordered style={{ marginBottom: 24 }} column={3}>
        <Descriptions.Item label="计划明细号">{record.planDetailNo}</Descriptions.Item>
        <Descriptions.Item label="批次计划编号">{record.batchPlanNo}</Descriptions.Item>
        {record.escortBatchNo && (
          <Descriptions.Item label="押运批次号">{record.escortBatchNo}</Descriptions.Item>
        )}
        <Descriptions.Item label="计划日期">{record.planDate}</Descriptions.Item>
        <Descriptions.Item label="时间段">{record.timeRange}</Descriptions.Item>
        <Descriptions.Item label="货物品类">{record.goodsCategory}</Descriptions.Item>
        <Descriptions.Item label="托运企业">{record.shipperName}</Descriptions.Item>
        <Descriptions.Item label="承运企业">{record.carrierName}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="车辆信息" bordered style={{ marginBottom: 24 }} column={2}>
        <Descriptions.Item label="车头">{record.headVehicle}</Descriptions.Item>
        <Descriptions.Item label="挂车">{record.trailer}</Descriptions.Item>
      </Descriptions>

      <Descriptions title="人员信息" bordered style={{ marginBottom: 24 }} column={2}>
        <Descriptions.Item label="驾驶员">{record.driverName} / {record.driverPhone}</Descriptions.Item>
        <Descriptions.Item label="押运员">{record.escortName} / {record.escortPhone}</Descriptions.Item>
      </Descriptions>

      <Descriptions title="应急措施" bordered style={{ marginBottom: 24 }}>
        <Descriptions.Item label="应急措施" span={3}>
          {record.emergencyMeasures}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="时间信息" bordered style={{ marginBottom: 24 }} column={3}>
        {record.createTime && (
          <Descriptions.Item label="创建时间">{record.createTime}</Descriptions.Item>
        )}
        {record.approvalTime && (
          <Descriptions.Item label="审批时间">{record.approvalTime}</Descriptions.Item>
        )}
        {record.assembleArrivalTime && (
          <Descriptions.Item label="到达集结点时间">{record.assembleArrivalTime}</Descriptions.Item>
        )}
        {record.trainingCompleteTime && (
          <Descriptions.Item label="培训完成时间">{record.trainingCompleteTime}</Descriptions.Item>
        )}
        {record.selfCheckCompleteTime && (
          <Descriptions.Item label="自查完成时间">{record.selfCheckCompleteTime}</Descriptions.Item>
        )}
        {record.selfCheckConfirmTime && (
          <Descriptions.Item label="自查确认时间">{record.selfCheckConfirmTime}</Descriptions.Item>
        )}
        {record.formingCompleteTime && (
          <Descriptions.Item label="编队完成时间">{record.formingCompleteTime}</Descriptions.Item>
        )}
        {record.bridgeApprovalTime && (
          <Descriptions.Item label="过桥审批时间">{record.bridgeApprovalTime}</Descriptions.Item>
        )}
        {record.escortStartTime && (
          <Descriptions.Item label="押运开始时间">{record.escortStartTime}</Descriptions.Item>
        )}
        {record.completeTime && (
          <Descriptions.Item label="完成时间">{record.completeTime}</Descriptions.Item>
        )}
        {record.cancelTime && (
          <Descriptions.Item label="取消时间">{record.cancelTime}</Descriptions.Item>
        )}
      </Descriptions>

      <Divider orientation="left">自检自查信息</Divider>
      <Descriptions title="自检自查详情" bordered style={{ marginBottom: 24 }} column={2}>
        {record.selfCheckInfo ? (
          <>
            <Descriptions.Item label="车辆状态">{record.selfCheckInfo.vehicleStatus}</Descriptions.Item>
            <Descriptions.Item label="驾驶员状态">{record.selfCheckInfo.driverStatus}</Descriptions.Item>
            <Descriptions.Item label="押运员状态">{record.selfCheckInfo.escortStatus}</Descriptions.Item>
            <Descriptions.Item label="货物状态">{record.selfCheckInfo.cargoStatus}</Descriptions.Item>
            <Descriptions.Item label="安全设备">{record.selfCheckInfo.safetyEquipment}</Descriptions.Item>
            <Descriptions.Item label="应急装备">{record.selfCheckInfo.emergencyKit}</Descriptions.Item>
            <Descriptions.Item label="其他检查" span={2}>
              {record.selfCheckInfo.otherChecks}
            </Descriptions.Item>
          </>
        ) : (
          <Descriptions.Item label="自检自查信息" span={2}>
            暂无自检自查信息
          </Descriptions.Item>
        )}
      </Descriptions>

      {(record.rejectReason || record.selfCheckRejectReason) && (
        <>
          <Divider orientation="left">驳回原因</Divider>
          <Descriptions title="驳回原因详情" bordered style={{ marginBottom: 24 }}>
            {record.rejectReason && (
              <Descriptions.Item label="审批驳回原因" span={3}>
                {record.rejectReason}
              </Descriptions.Item>
            )}
            {record.selfCheckRejectReason && (
              <Descriptions.Item label="自查驳回原因" span={3}>
                {record.selfCheckRejectReason}
              </Descriptions.Item>
            )}
          </Descriptions>
        </>
      )}
    </Card>
  )
}

export default PlanDetailViewPage