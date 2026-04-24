import React, { useState } from 'react'
import {
  Card,
  Tabs,
  Badge,
  Tag,
  Button,
  DatePicker,
} from 'antd'

interface VehicleInfo {
  id: string
  plateNumber: string
  trailer: string
  driver: string
  escort: string
  escortPhone: string
  carrierCompany: string
  shipperCompany: string
  batchNo: string
  goodsType: string
  status: 'pending' | 'numbered'
}

interface EscortBatch {
  id: string
  batchNumber: string
  formationDate: string
  vehicles: VehicleInfo[]
  escorts: string[]
  leadVehicles: string[]
  status: 'boarding_pending' | 'boarding_approved'
}

const initialVehicles: VehicleInfo[] = [
  {
    id: 'V001',
    plateNumber: '浙A12345',
    trailer: '浙A1234挂',
    driver: '张师傅',
    escort: '赵押运',
    escortPhone: '13900139001',
    carrierCompany: '安全运输有限公司',
    shipperCompany: '中石化销售有限公司',
    batchNo: 'PC20240101001',
    goodsType: '液化石油气',
    status: 'pending',
  },
  {
    id: 'V002',
    plateNumber: '浙B23456',
    trailer: '浙B2345挂',
    driver: '李师傅',
    escort: '钱押运',
    escortPhone: '13900139002',
    carrierCompany: '危险品运输集团',
    shipperCompany: '中石油运输公司',
    batchNo: 'PC20240102001',
    goodsType: '汽油',
    status: 'pending',
  },
  {
    id: 'V003',
    plateNumber: '浙C34567',
    trailer: '浙C3456挂',
    driver: '王师傅',
    escort: '孙押运',
    escortPhone: '13900139003',
    carrierCompany: '恒通物流集团',
    shipperCompany: '恒力石化有限公司',
    batchNo: 'PC20240103001',
    goodsType: '柴油',
    status: 'pending',
  },
  {
    id: 'V004',
    plateNumber: '浙D45678',
    trailer: '浙D4567挂',
    driver: '刘师傅',
    escort: '李押运',
    escortPhone: '13900139004',
    carrierCompany: '安全运输有限公司',
    shipperCompany: '中石化销售有限公司',
    batchNo: 'PC20240101002',
    goodsType: '液化石油气',
    status: 'numbered',
  },
  {
    id: 'V005',
    plateNumber: '浙E56789',
    trailer: '浙E5678挂',
    driver: '赵师傅',
    escort: '周押运',
    escortPhone: '13900139005',
    carrierCompany: '危险品运输集团',
    shipperCompany: '中石油运输公司',
    batchNo: 'PC20240102002',
    goodsType: '汽油',
    status: 'numbered',
  },
  {
    id: 'V006',
    plateNumber: '浙F67890',
    trailer: '浙F6789挂',
    driver: '钱师傅',
    escort: '吴押运',
    escortPhone: '13900139006',
    carrierCompany: '恒通物流集团',
    shipperCompany: '恒力石化有限公司',
    batchNo: 'PC20240103002',
    goodsType: '柴油',
    status: 'numbered',
  },
]

const initialFormations: EscortBatch[] = [
  {
    id: 'F001',
    batchNumber: 'YY20240120001',
    formationDate: '2024-01-20',
    vehicles: [initialVehicles[3], initialVehicles[4]],
    escorts: ['E001', 'E002'],
    leadVehicles: ['V004'],
    status: 'boarding_approved',
  },
  {
    id: 'F002',
    batchNumber: 'YY20240121001',
    formationDate: '2024-01-21',
    vehicles: [initialVehicles[5]],
    escorts: ['E003'],
    leadVehicles: ['V006'],
    status: 'boarding_pending',
  },
  {
    id: 'F003',
    batchNumber: 'YY20240122001',
    formationDate: '2024-01-22',
    vehicles: [initialVehicles[0], initialVehicles[1], initialVehicles[2]],
    escorts: ['E001', 'E002', 'E003'],
    leadVehicles: ['V001'],
    status: 'boarding_pending',
  },
]

type PageType = 'list' | 'detail'

type TabKey = 'pending' | 'approved'

const BridgeApprovalPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('list')
  const [activeTab, setActiveTab] = useState<TabKey>('pending')
  const [formationDateFilter, setFormationDateFilter] = useState<string | null>(null)
  const [selectedFormation, setSelectedFormation] = useState<EscortBatch | null>(null)

  const getStatusTag = (status: 'boarding_pending' | 'boarding_approved') => {
    const statusMap = {
      boarding_pending: { color: 'orange', text: '上桥审批中' },
      boarding_approved: { color: 'green', text: '上桥审批通过' },
    }
    const { color, text } = statusMap[status]
    return <Tag color={color} style={{ marginRight: 0 }}>{text}</Tag>
  }

  const filteredFormations = initialFormations.filter(formation => {
    if (formationDateFilter && formation.formationDate !== formationDateFilter) return false
    if (activeTab === 'pending' && formation.status !== 'boarding_pending') return false
    if (activeTab === 'approved' && formation.status !== 'boarding_approved') return false
    return true
  })

  const handleBack = () => {
    setCurrentPage('list')
    setSelectedFormation(null)
  }

  const handleFormationClick = (formation: EscortBatch) => {
    setSelectedFormation(formation)
    setCurrentPage('detail')
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>上桥审批</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>监管APP - 上桥审批管理</p>
      </div>

      <div className="mobile-container" style={{
        width: 375,
        margin: '0 auto',
        backgroundColor: '#f5f5f5',
        minHeight: 700,
        position: 'relative',
      }}>
        {currentPage === 'list' ? (
          <>
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
              上桥审批
            </div>

            <div style={{ backgroundColor: '#fff', padding: '0 16px' }}>
              <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as TabKey)}
                style={{ marginTop: 0 }}
                items={[
                  {
                    key: 'pending',
                    label: <span style={{ fontSize: 14 }}>上桥审批中 <Badge count={initialFormations.filter(f => f.status === 'boarding_pending').length} size="small" style={{ marginLeft: 8 }} /></span>,
                  },
                  {
                    key: 'approved',
                    label: <span style={{ fontSize: 14 }}>审批通过 <Badge count={initialFormations.filter(f => f.status === 'boarding_approved').length} size="small" style={{ marginLeft: 8 }} /></span>,
                  },
                ]}
              />
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginBottom: 8 }}>
              <DatePicker
                style={{ width: '100%' }}
                placeholder="选择日期"
                onChange={(date) => setFormationDateFilter(date?.format('YYYY-MM-DD') || null)}
              />
            </div>

            <div style={{ padding: '0 16px', height: 580, overflowY: 'auto' }}>
              {filteredFormations.map(formation => (
                <div
                  key={formation.id}
                  onClick={() => handleFormationClick(formation)}
                  style={{
                    backgroundColor: '#fff',
                    marginBottom: 12,
                    borderRadius: 8,
                    padding: 16,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    border: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>{formation.batchNumber}</div>
                    {getStatusTag(formation.status)}
                  </div>

                  <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>车辆列表 ({formation.vehicles.length})</div>
                    {formation.vehicles.slice(0, 2).map(vehicle => (
                      <div key={vehicle.id} style={{ fontSize: 14, color: '#333', marginBottom: 4 }}>
                        {vehicle.plateNumber}
                      </div>
                    ))}
                    {formation.vehicles.length > 2 && (
                      <div style={{ fontSize: 12, color: '#999' }}>
                        还有 {formation.vehicles.length - 2} 辆车...
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#999' }}>
                    <div>编队日期: {formation.formationDate}</div>
                    <div>押运员: {formation.escorts.length} 人</div>
                  </div>
                </div>
              ))}

              {filteredFormations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                  <div style={{ fontSize: 14 }}>暂无数据</div>
                </div>
              )}
            </div>
          </>
        ) : currentPage === 'detail' && selectedFormation ? (
          <>
            <div style={{
              height: 56,
              backgroundColor: '#1677ff',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: 1,
            }}>
              <div
                onClick={handleBack}
                style={{
                  width: 44,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                ←
              </div>
              <div style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>审批详情</div>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>批次编号</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{selectedFormation.batchNumber}</div>
                </div>

                <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>当前状态</div>
                  <div>{getStatusTag(selectedFormation.status)}</div>
                </div>

                <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>编队日期</div>
                    <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{selectedFormation.formationDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>押运人员</div>
                    <div style={{ fontSize: 14, color: '#333', fontWeight: 500 }}>{selectedFormation.escorts.length} 人</div>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#fff',
                borderRadius: 8,
                padding: 16,
                marginBottom: 24,
              }}>
                <div style={{ fontSize: 14, color: '#333', fontWeight: 500, marginBottom: 12 }}>
                  车辆列表 ({selectedFormation.vehicles.length})
                </div>

                {selectedFormation.vehicles.map(vehicle => (
                  <div
                    key={vehicle.id}
                    style={{
                      backgroundColor: '#f5f5f5',
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{vehicle.plateNumber}</div>
                      <div style={{
                        fontSize: 11,
                        color: '#fff',
                        backgroundColor: vehicle.goodsType === '液化石油气' ? '#ff6b6b' :
                                       vehicle.goodsType === '汽油' ? '#ffa94d' : '#69db7c',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}>
                        {vehicle.goodsType}
                      </div>
                    </div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>挂车: {vehicle.trailer}</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>驾驶员: {vehicle.driver}</div>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>押运员: {vehicle.escort}</div>
                    <div style={{ fontSize: 13, color: '#666' }}>承运企业: {vehicle.carrierCompany}</div>
                  </div>
                ))}
              </div>

              {selectedFormation.status === 'boarding_pending' && (
                <div style={{
                  position: 'absolute',
                  bottom: 24,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 'calc(100% - 32px)',
                }}>
                  <Button
                    type="primary"
                    size="large"
                    block
                    style={{
                      height: 48,
                      fontSize: 15,
                      fontWeight: 500,
                      boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
                    }}
                    onClick={() => {
                      // 模拟审批通过
                      setSelectedFormation({
                        ...selectedFormation,
                        status: 'boarding_approved',
                      })
                    }}
                  >
                    上桥审批通过
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </Card>
  )
}

export default BridgeApprovalPage