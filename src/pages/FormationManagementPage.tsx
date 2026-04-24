import React, { useState } from 'react'
import {
  Card,
  Tabs,
  Input,
  Button,
  Checkbox,
  message,
  DatePicker,
  Select,
  Badge,
  Tag,
} from 'antd'

type VehicleStatus = 'pending' | 'numbered'
type FormationStatus = 'boarding_pending' | 'boarding_approved'

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
  status: VehicleStatus
}

interface FormationBatch {
  id: string
  batchNumber: string
  formationDate: string
  vehicles: VehicleInfo[]
  escorts: string[]
  leadVehicles: string[]
  status: FormationStatus
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

const initialFormations: FormationBatch[] = [
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
]

const escortOptions = [
  { label: '赵押运 13900139001', value: 'E001' },
  { label: '钱押运 13900139002', value: 'E002' },
  { label: '孙押运 13900139003', value: 'E003' },
  { label: '李押运 13900139004', value: 'E004' },
  { label: '周押运 13900139005', value: 'E005' },
]

const vehicleOptions = [
  { label: '浙A12345', value: 'V001' },
  { label: '浙B23456', value: 'V002' },
  { label: '浙C34567', value: 'V003' },
  { label: '浙D45678', value: 'V004' },
  { label: '浙E56789', value: 'V005' },
]

type PageType = 'list' | 'formation' | 'detail'

const FormationManagementPage = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('list')
  const [activeTab, setActiveTab] = useState('pending')
  const [searchText, setSearchText] = useState('')
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [formationDate, setFormationDate] = useState<string | null>(null)
  const [selectedEscorts, setSelectedEscorts] = useState<string[]>([])
  const [selectedLeadVehicles, setSelectedLeadVehicles] = useState<string[]>([])
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [formations, setFormations] = useState<FormationBatch[]>(initialFormations)
  const [selectedFormation, setSelectedFormation] = useState<FormationBatch | null>(null)
  const [formationDateFilter, setFormationDateFilter] = useState<string | null>(null)

  const getStatusTag = (status: FormationStatus) => {
    const statusMap = {
      boarding_pending: { color: 'orange', text: '上桥审批中' },
      boarding_approved: { color: 'green', text: '上桥审批通过' },
    }
    const { color, text } = statusMap[status]
    return <Tag color={color} style={{ marginRight: 0 }}>{text}</Tag>
  }

  const filteredVehicles = initialVehicles.filter(vehicle => {
    if (vehicle.status !== activeTab) return false
    if (searchText && !vehicle.plateNumber.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  const filteredFormations = formations.filter(formation => {
    if (formationDateFilter && formation.formationDate !== formationDateFilter) return false
    return true
  })

  const handleVehicleSelect = (vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId)
      } else {
        return [...prev, vehicleId]
      }
    })
  }

  const handleNumbering = () => {
    if (selectedVehicles.length === 0) {
      message.warning('请至少选择一辆车辆')
      return
    }
    setCurrentPage('formation')
  }

  const handleBack = () => {
    setCurrentPage('list')
    setSelectedFormation(null)
  }

  const handleFormationClick = (formation: FormationBatch) => {
    setSelectedFormation(formation)
    setCurrentPage('detail')
  }

  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) return

    const newSelectedVehicles = [...selectedVehicles]
    const draggedItem = newSelectedVehicles[draggedIndex]
    newSelectedVehicles.splice(draggedIndex, 1)
    newSelectedVehicles.splice(dropIndex, 0, draggedItem)
    setSelectedVehicles(newSelectedVehicles)
    setDraggedIndex(null)
  }

  const handleRemoveVehicle = (vehicleId: string) => {
    if (selectedVehicles.length === 1) {
      message.warning('至少保留一辆车辆')
      return
    }
    setSelectedVehicles(prev => prev.filter(id => id !== vehicleId))
  }

  const handleSubmitFormation = () => {
    if (!formationDate) {
      message.warning('请选择编队日期')
      return
    }
    if (selectedEscorts.length === 0) {
      message.warning('请选择押运人员')
      return
    }
    if (selectedLeadVehicles.length === 0) {
      message.warning('请选择押运车辆')
      return
    }

    const newFormation: FormationBatch = {
      id: `F${Date.now()}`,
      batchNumber: `YY${formationDate.replace(/-/g, '')}${String(formations.length + 1).padStart(3, '0')}`,
      formationDate,
      vehicles: selectedVehicles.map(id => initialVehicles.find(v => v.id === id)!),
      escorts: selectedEscorts,
      leadVehicles: selectedLeadVehicles,
      status: 'boarding_pending',
    }

    setFormations(prev => [...prev, newFormation])
    message.success('编队成功')
    setCurrentPage('list')
    setSelectedVehicles([])
    setFormationDate(null)
    setSelectedEscorts([])
    setSelectedLeadVehicles([])
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>编队管理</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>监管APP - 车辆编队管理</p>
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
              编队管理
            </div>

            <div style={{ backgroundColor: '#fff', padding: '0 16px' }}>
              <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                style={{ marginTop: 0 }}
                items={[
                  {
                    key: 'pending',
                    label: <span style={{ fontSize: 14 }}>待编号 <Badge count={filteredVehicles.length} size="small" style={{ marginLeft: 8 }} /></span>,
                  },
                  {
                    key: 'numbered',
                    label: <span style={{ fontSize: 14 }}>已编号 <Badge count={formations.length} size="small" style={{ marginLeft: 8 }} /></span>,
                  },
                ]}
              />
            </div>

            {activeTab === 'pending' ? (
              <>
                <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginBottom: 8 }}>
                  <Input
                    placeholder="输入车牌号搜索"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    allowClear
                    prefix={<span style={{ color: '#999' }}>🔍</span>}
                  />
                </div>

                <div style={{ padding: '0 16px 100px', height: 520, overflowY: 'auto' }}>
                  {filteredVehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      style={{
                        backgroundColor: '#fff',
                        marginBottom: 12,
                        borderRadius: 8,
                        padding: 16,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                        border: selectedVehicles.includes(vehicle.id) ? '2px solid #1677ff' : '1px solid #f0f0f0',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
                            {vehicle.plateNumber}
                          </div>
                          <div style={{ fontSize: 13, color: '#666' }}>
                            挂车: {vehicle.trailer}
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedVehicles.includes(vehicle.id)}
                          onChange={() => handleVehicleSelect(vehicle.id)}
                          style={{ marginLeft: 12 }}
                        />
                      </div>

                      <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                        <div>
                          <span style={{ color: '#999' }}>驾驶员</span>
                          <div style={{ color: '#333', fontWeight: 500 }}>{vehicle.driver}</div>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>押运员</span>
                          <div style={{ color: '#333', fontWeight: 500 }}>{vehicle.escort}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span style={{ color: '#999' }}>承运企业</span>
                          <div style={{ color: '#333', fontWeight: 500 }}>{vehicle.carrierCompany}</div>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span style={{ color: '#999' }}>托运企业</span>
                          <div style={{ color: '#333', fontWeight: 500 }}>{vehicle.shipperCompany}</div>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>批次号</span>
                          <div style={{ color: '#1677ff', fontWeight: 500, fontSize: 12 }}>{vehicle.batchNo}</div>
                        </div>
                        <div>
                          <span style={{ color: '#999' }}>货物类型</span>
                          <div style={{
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 500,
                            backgroundColor: vehicle.goodsType === '液化石油气' ? '#ff6b6b' :
                                           vehicle.goodsType === '汽油' ? '#ffa94d' : '#69db7c',
                            padding: '2px 8px',
                            borderRadius: 4,
                            display: 'inline-block',
                            marginTop: 2,
                          }}>
                            {vehicle.goodsType}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredVehicles.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                      <div style={{ fontSize: 14 }}>暂无数据</div>
                    </div>
                  )}
                </div>

                {selectedVehicles.length > 0 && (
                  <div style={{
                    position: 'absolute',
                    bottom: 24,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 200,
                  }}>
                    <Button
                      type="primary"
                      size="large"
                      block
                      onClick={handleNumbering}
                      style={{
                        height: 48,
                        fontSize: 15,
                        fontWeight: 500,
                        boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
                      }}
                    >
                      编队 ({selectedVehicles.length})
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginBottom: 8 }}>
                  <DatePicker
                    style={{ width: '100%' }}
                    placeholder="选择编队日期"
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
                      <div style={{ fontSize: 14 }}>暂无编队数据</div>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        ) : currentPage === 'formation' ? (
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
              <div style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>待编队</div>
            </div>

            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>编队日期</div>
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="选择日期"
                  onChange={(date) => setFormationDate(date?.format('YYYY-MM-DD') || null)}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>已选车辆 ({selectedVehicles.length})</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedVehicles.map((vehicleId, index) => {
                    const vehicle = initialVehicles.find(v => v.id === vehicleId)
                    return vehicle ? (
                      <div
                        key={vehicleId}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        style={{
                          backgroundColor: '#e6f4ff',
                          color: '#1677ff',
                          padding: '12px 16px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          cursor: 'move',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 15 }}>{vehicle.plateNumber}</div>
                          <div style={{ fontSize: 12, opacity: 0.8 }}>{vehicle.carrierCompany}</div>
                        </div>
                        {selectedVehicles.length > 1 && (
                          <div
                            onClick={() => handleRemoveVehicle(vehicleId)}
                            style={{
                              padding: '4px 8px',
                              fontSize: 12,
                              cursor: 'pointer',
                            }}
                          >
                            删除
                          </div>
                        )}
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运人员（可多选）</div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择押运人员"
                  options={escortOptions}
                  value={selectedEscorts}
                  onChange={setSelectedEscorts}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运车辆</div>
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择押运车辆"
                  options={vehicleOptions.filter(opt => selectedVehicles.includes(opt.value))}
                  value={selectedLeadVehicles}
                  onChange={setSelectedLeadVehicles}
                />
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmitFormation}
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
                }}
              >
                提交编队
              </Button>
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
              <div style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>编队详情</div>
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
                        backgroundColor: '#1677ff',
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
            </div>
          </>
        ) : null}
      </div>
    </Card>
  )
}

export default FormationManagementPage