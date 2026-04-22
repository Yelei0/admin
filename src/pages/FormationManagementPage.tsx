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

interface FormationBatch {
  id: string
  batchNumber: string
  formationDate: string
  vehicles: VehicleInfo[]
  escorts: string[]
  leadVehicles: string[]
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
    batchNo: 'PL20240101001',
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
    batchNo: 'PL20240102001',
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
    batchNo: 'PL20240103001',
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
    batchNo: 'PL20240101002',
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
    batchNo: 'PL20240102002',
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
    batchNo: 'PL20240103002',
    goodsType: '柴油',
    status: 'numbered',
  },
]

const initialFormations: FormationBatch[] = [
  {
    id: 'F001',
    batchNumber: 'BD20240120001',
    formationDate: '2024-01-20',
    vehicles: [initialVehicles[3], initialVehicles[4]],
    escorts: ['E001', 'E002'],
    leadVehicles: ['V004'],
  },
  {
    id: 'F002',
    batchNumber: 'BD20240121001',
    formationDate: '2024-01-21',
    vehicles: [initialVehicles[5]],
    escorts: ['E003'],
    leadVehicles: ['V006'],
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
      batchNumber: `BD${formationDate.replace(/-/g, '')}${String(formations.length + 1).padStart(3, '0')}`,
      formationDate,
      vehicles: selectedVehicles.map(id => initialVehicles.find(v => v.id === id)!),
      escorts: selectedEscorts,
      leadVehicles: selectedLeadVehicles,
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
                    label: <span style={{ fontSize: 14 }}>已编号 <Badge count={filteredFormations.length} size="small" style={{ marginLeft: 8 }} /></span>,
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
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>批次编号</div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>{formation.batchNumber}</div>
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
                          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{vehicle.plateNumber}</div>
                          <div style={{ fontSize: 12, color: '#1677ff' }}>{vehicle.carrierCompany}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{
                            color: '#fff',
                            fontSize: 11,
                            fontWeight: 500,
                            backgroundColor: vehicle.goodsType === '液化石油气' ? '#ff6b6b' :
                                           vehicle.goodsType === '汽油' ? '#ffa94d' : '#69db7c',
                            padding: '4px 10px',
                            borderRadius: 4,
                          }}>
                            {vehicle.goodsType}
                          </div>
                          <Button
                            danger
                            size="small"
                            type="text"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRemoveVehicle(vehicleId)
                            }}
                            disabled={selectedVehicles.length === 1}
                            style={{
                              padding: '4px 8px',
                              fontSize: 12,
                            }}
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运人员（多选）</div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择押运人员"
                  options={escortOptions}
                  value={selectedEscorts}
                  onChange={setSelectedEscorts}
                  maxTagCount={2}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运车辆（多选）</div>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="请选择押运车辆"
                  options={vehicleOptions}
                  value={selectedLeadVehicles}
                  onChange={setSelectedLeadVehicles}
                  maxTagCount={2}
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
                确认编队
              </Button>
            </div>
          </>
        ) : (
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

            {selectedFormation && (
              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>批次编号</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{selectedFormation.batchNumber}</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: '#999', marginBottom: 4 }}>编队日期</div>
                  <div style={{ fontSize: 14, color: '#333' }}>{selectedFormation.formationDate}</div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>车辆列表 ({selectedFormation.vehicles.length})</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {selectedFormation.vehicles.map(vehicle => (
                      <div
                        key={vehicle.id}
                        style={{
                          backgroundColor: '#e6f4ff',
                          color: '#1677ff',
                          padding: '12px 16px',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{vehicle.plateNumber}</div>
                        <div style={{ fontSize: 12, color: '#1677ff' }}>{vehicle.carrierCompany}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运人员 ({selectedFormation.escorts.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedFormation.escorts.map(escortId => {
                      const escort = escortOptions.find(e => e.value === escortId)
                      return escort ? (
                        <div
                          key={escortId}
                          style={{
                            backgroundColor: '#f6ffed',
                            color: '#52c41a',
                            padding: '6px 14px',
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {escort.label}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>押运车辆 ({selectedFormation.leadVehicles.length})</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {selectedFormation.leadVehicles.map(vehicleId => {
                      const vehicle = vehicleOptions.find(v => v.value === vehicleId)
                      return vehicle ? (
                        <div
                          key={vehicleId}
                          style={{
                            backgroundColor: '#fff7e6',
                            color: '#fa8c16',
                            padding: '6px 14px',
                            borderRadius: 16,
                            fontSize: 13,
                            fontWeight: 500,
                          }}
                        >
                          {vehicle.label}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  )
}

export default FormationManagementPage
