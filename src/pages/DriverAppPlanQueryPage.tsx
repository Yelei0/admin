import React, { useState } from 'react'
import {
  Card,
  Tabs,
  Badge,
  Button,
  message,
} from 'antd'

interface PlanInfo {
  id: string
  waybillNumber: string
  driver: string
  escort: string
  mainVehicle: string
  trailer: string
  status: string
  statusKey: 'waiting_gather' | 'gathered' | 'escorting' | 'crossed_bridge' | 'completed' | 'abnormal' | 'waiting_training' | 'waiting_self_check'
  goodsType: string
  shipperCompany: string
}

const currentPlans: PlanInfo[] = [
  {
    id: 'P001',
    waybillNumber: '2024040700010',
    driver: '程金华 13337480606',
    escort: '沈苍飞 15100090018',
    mainVehicle: '津L34854',
    trailer: '贵EB012挂',
    status: '待培训',
    statusKey: 'waiting_training',
    goodsType: '液化石油气',
    shipperCompany: '中石化销售有限公司',
  },
  {
    id: 'P002',
    waybillNumber: '2024040700011',
    driver: '李师傅 13800138000',
    escort: '王押运 13900139000',
    mainVehicle: '浙A12345',
    trailer: '浙A1234挂',
    status: '待自查',
    statusKey: 'waiting_self_check',
    goodsType: '汽油',
    shipperCompany: '中石油运输公司',
  },
]

const historicalPlans: PlanInfo[] = [
  {
    id: 'H001',
    waybillNumber: '2024042400015',
    driver: '秦吉红 15535389633',
    escort: '沈苍飞 15100090018',
    mainVehicle: '津L34854',
    trailer: '贵EB012挂',
    status: '已完成',
    statusKey: 'completed',
    goodsType: '液化石油气',
    shipperCompany: '中石化销售有限公司',
  },
  {
    id: 'H002',
    waybillNumber: '2024042300010',
    driver: '秦吉红 15535389633',
    escort: '沈苍飞 15100090018',
    mainVehicle: '津L34854',
    trailer: '贵EB012挂',
    status: '已完成',
    statusKey: 'completed',
    goodsType: '汽油',
    shipperCompany: '中石油运输公司',
  },
  {
    id: 'H003',
    waybillNumber: '2024042200005',
    driver: '秦吉红 15535389633',
    escort: '沈苍飞 15100090018',
    mainVehicle: '津L34854',
    trailer: '贵EB012挂',
    status: '已完成',
    statusKey: 'completed',
    goodsType: '柴油',
    shipperCompany: '恒力石化有限公司',
  },
]

const DriverAppPlanQueryPage = () => {
  const [activeTab, setActiveTab] = useState('current')

  const getStatusColor = (statusKey: string) => {
    const statusMap: Record<string, string> = {
      waiting_gather: 'default',
      gathered: 'blue',
      escorting: 'orange',
      crossed_bridge: 'cyan',
      completed: 'green',
      abnormal: 'red',
      waiting_training: 'purple',
      waiting_self_check: 'geekblue',
    }
    return statusMap[statusKey] || 'default'
  }

  const handleTraining = (plan: PlanInfo) => {
    message.success(`开始培训 - 运单: ${plan.waybillNumber}`)
  }

  const handleSelfCheck = (plan: PlanInfo) => {
    message.success(`开始自查 - 运单: ${plan.waybillNumber}`)
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>计划查询</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>驾押人员APP - 计划查询</p>
      </div>

      <div className="mobile-container" style={{
        width: 375,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: 700,
        position: 'relative',
      }}>
        <div style={{
          height: 56,
          backgroundColor: '#1677ff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          fontWeight: 500,
          letterSpacing: 1,
        }}>
          计划
        </div>

        <div style={{ backgroundColor: '#fff', padding: '0 16px' }}>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            style={{ marginTop: 0 }}
            items={[
              {
                key: 'current',
                label: <span style={{ fontSize: 14, fontWeight: 500 }}>当前计划</span>,
              },
              {
                key: 'historical',
                label: <span style={{ fontSize: 14, fontWeight: 500 }}>历史计划</span>,
              },
            ]}
          />
        </div>

        <div style={{ padding: '0 16px', height: 580, overflowY: 'auto' }}>
          {(activeTab === 'current' ? currentPlans : historicalPlans).map(plan => (
            <div
              key={plan.id}
              style={{
                backgroundColor: '#fff',
                marginBottom: 12,
                borderRadius: 12,
                padding: 16,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid #f0f0f0',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                },
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
                    运单编号: {plan.waybillNumber}
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {plan.shipperCompany}
                  </div>
                </div>
                <Badge
                  status={getStatusColor(plan.statusKey) as any}
                  text={plan.status}
                  style={{ fontSize: 12, padding: '2px 8px' }}
                />
              </div>

              <div style={{ height: 1, backgroundColor: '#f5f5f5', margin: '12px 0' }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13, marginBottom: 16 }}>
                <div>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>驾驶员</div>
                  <div style={{ color: '#333', fontWeight: 500 }}>{plan.driver}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>押运员</div>
                  <div style={{ color: '#333', fontWeight: 500 }}>{plan.escort}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>主车</div>
                  <div style={{ color: '#333', fontWeight: 500 }}>{plan.mainVehicle}</div>
                </div>
                <div>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>挂车</div>
                  <div style={{ color: '#333', fontWeight: 500 }}>{plan.trailer}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: '#666', marginBottom: 4, fontSize: 12 }}>货物类型</div>
                  <div style={{
                    display: 'inline-block',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 500,
                    backgroundColor: plan.goodsType === '液化石油气' ? '#ff6b6b' :
                                   plan.goodsType === '汽油' ? '#ffa94d' : '#69db7c',
                    padding: '4px 12px',
                    borderRadius: 12,
                  }}>
                    {plan.goodsType}
                  </div>
                </div>
              </div>

              {activeTab === 'current' && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  {plan.statusKey === 'waiting_training' && (
                    <Button
                      type="primary"
                      block
                      onClick={() => handleTraining(plan)}
                      style={{ flex: 1, height: 40, fontSize: 14 }}
                    >
                      培训
                    </Button>
                  )}
                  {plan.statusKey === 'waiting_self_check' && (
                    <Button
                      type="primary"
                      block
                      onClick={() => handleSelfCheck(plan)}
                      style={{ flex: 1, height: 40, fontSize: 14 }}
                    >
                      自查
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}

          {(activeTab === 'current' ? currentPlans : historicalPlans).length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
              <div style={{ fontSize: 14 }}>暂无计划数据</div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

export default DriverAppPlanQueryPage
