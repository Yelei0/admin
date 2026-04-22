import { useState, useRef } from 'react'
import {
  Card,
  Input,
  Button,
  Badge,
  message,
} from 'antd'

const { TextArea } = Input

interface VehicleInfo {
  id: string
  plateNumber: string
  trailer: string
  driver: string
  escort: string
  carrierCompany: string
  batchNo: string
  goodsType: string
}

interface InspectionItem {
  id: string
  title: string
  description: string
  status: 'pass' | 'fail'
  images?: string[]
  value?: string
}

interface InspectionData {
  id: string
  vehicleId: string
  vehicle: VehicleInfo
  inspector: string
  inspectionDate: string
  items: InspectionItem[]
  driverHealth: {
    items: {
      id: string
      question: string
      answer: 'yes' | 'no'
    }[]
  }
}

const initialVehicles: VehicleInfo[] = [
  {
    id: 'V001',
    plateNumber: '浙A12345',
    trailer: '浙A1234挂',
    driver: '张师傅',
    escort: '赵押运',
    carrierCompany: '安全运输有限公司',
    batchNo: 'PL20240101001',
    goodsType: '液化石油气',
  },
  {
    id: 'V002',
    plateNumber: '浙B23456',
    trailer: '浙B2345挂',
    driver: '李师傅',
    escort: '钱押运',
    carrierCompany: '危险品运输集团',
    batchNo: 'PL20240102001',
    goodsType: '汽油',
  },
  {
    id: 'V003',
    plateNumber: '浙C34567',
    trailer: '浙C3456挂',
    driver: '王师傅',
    escort: '孙押运',
    carrierCompany: '恒通物流集团',
    batchNo: 'PL20240103001',
    goodsType: '柴油',
  },
]

const inspectionData: InspectionData = {
  id: 'I001',
  vehicleId: 'V001',
  vehicle: initialVehicles[0],
  inspector: '测试',
  inspectionDate: '2024-01-20',
  items: [
    {
      id: '1',
      title: '稳压压力',
      description: '低于0.35MPA',
      status: 'pass',
      images: ['https://via.placeholder.com/100'],
    },
    {
      id: '2',
      title: '盲板检查',
      description: '盲板螺丝禁锢情况',
      status: 'pass',
      images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
    },
    {
      id: '3',
      title: '应急物资',
      description: '车辆配备不少于6只70cm高反光锥桶',
      status: 'pass',
      images: ['https://via.placeholder.com/100'],
    },
    {
      id: '4',
      title: '消防器材',
      description: '外观完好，压力指针在绿区，软管无破裂，铅封完好',
      status: 'pass',
      images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
    },
    {
      id: '5',
      title: '安全阀',
      description: '外观完好，铭牌、铅封完好，检验在有效期内',
      status: 'pass',
      images: ['https://via.placeholder.com/100'],
    },
    {
      id: '6',
      title: '车辆行驶里程是否超过60万公里',
      description: '',
      status: 'pass',
      value: '否 公里数(km): 471454',
      images: ['https://via.placeholder.com/100'],
    },
    {
      id: '7',
      title: '车辆GPS连接是否正常',
      description: '',
      status: 'pass',
      value: '是',
    },
    {
      id: '8',
      title: '三漏检查',
      description: '查漏水、漏油、漏气',
      status: 'fail',
      value: '否',
    },
    {
      id: '9',
      title: '刹车系统',
      description: '气泵正常工作，气压正常，刹车阀工作正常，刹车回位正常，全车刹车鼓温度正常',
      status: 'pass',
      value: '是',
    },
    {
      id: '10',
      title: '传动系统',
      description: '变速箱摘挂挡正常，传动轴输出正常，十字轴工况正常，后桥传动正常，轮胎螺丝无松动和短缺，全车轴头温度正常',
      status: 'pass',
      value: '是',
    },
    {
      id: '11',
      title: '动力系统',
      description: '发动机供气正常，无卡顿，增压器正常工作，输出动力正常',
      status: 'pass',
      value: '是',
    },
    {
      id: '12',
      title: '灯光全部正常',
      description: '',
      status: 'pass',
      value: '是',
    },
    {
      id: '13',
      title: '全车反光膜符合要求',
      description: '',
      status: 'pass',
      value: '是',
      images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
    },
  ],
  driverHealth: {
    items: [
      {
        id: 'h1',
        question: '是否头晕、头晕、耳鸣、视力模糊',
        answer: 'no',
      },
      {
        id: 'h2',
        question: '是否心慌气短、心跳加速',
        answer: 'no',
      },
      {
        id: 'h3',
        question: '是否肢体麻木、肌肉疼痛、痉挛',
        answer: 'no',
      },
      {
        id: 'h4',
        question: '是否发烧、咳嗽、感冒',
        answer: 'no',
      },
      {
        id: 'h5',
        question: '是否有来自家庭、工作等方面的心理压力',
        answer: 'no',
      },
    ],
  },
}

type PageType = 'list' | 'detail'

const SelfInspectionPage = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('list')
  const [searchText, setSearchText] = useState('')
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleInfo | null>(null)
  const [rejectModalVisible, setRejectModalVisible] = useState(false)
  const [rejectRemark, setRejectRemark] = useState('')
  const mobileContainerRef = useRef<HTMLDivElement>(null)

  const filteredVehicles = initialVehicles.filter(vehicle => {
    if (searchText && !vehicle.plateNumber.toLowerCase().includes(searchText.toLowerCase())) return false
    return true
  })

  const handleVehicleClick = (vehicle: VehicleInfo) => {
    setSelectedVehicle(vehicle)
    setCurrentPage('detail')
  }

  const handleBack = () => {
    setCurrentPage('list')
    setSelectedVehicle(null)
  }

  const handleApprove = () => {
    message.success('审核通过')
    setCurrentPage('list')
    setSelectedVehicle(null)
  }

  const handleReject = () => {
    setRejectModalVisible(true)
  }

  const handleRejectSubmit = () => {
    if (!rejectRemark) {
      message.warning('请填写驳回原因')
      return
    }
    message.error('审核驳回')
    setRejectModalVisible(false)
    setRejectRemark('')
    setCurrentPage('list')
    setSelectedVehicle(null)
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>自查审批</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>监管APP - 车辆自查审批</p>
      </div>

      <div 
        ref={mobileContainerRef}
        className="mobile-container" style={{
        width: 375,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        height: 700,
        position: 'relative',
        overflow: 'hidden',
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
              自查审批 - 待审批
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: '#fff', marginBottom: 8 }}>
              <Input
                placeholder="输入车牌号搜索"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                prefix={<span style={{ color: '#999' }}>🔍</span>}
              />
            </div>

            <div style={{ padding: '0 16px 100px', height: 580, overflowY: 'auto' }}>
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  onClick={() => handleVehicleClick(vehicle)}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>
                        {vehicle.plateNumber}
                      </div>
                      <div style={{ fontSize: 13, color: '#666' }}>
                        挂车: {vehicle.trailer}
                      </div>
                    </div>
                    <Badge
                      status="processing"
                      text="待审批"
                      style={{ fontSize: 12 }}
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
              <div style={{ flex: 1, textAlign: 'center', marginRight: 44 }}>自查审核</div>
            </div>

            <div style={{ padding: 16, height: 580, overflowY: 'auto' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>车辆信息</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: '#1a1a1a' }}>{selectedVehicle?.plateNumber}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
                  挂车: {selectedVehicle?.trailer} | 驾驶员: {selectedVehicle?.driver} | 押运员: {selectedVehicle?.escort}
                </div>
              </div>

              <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>车辆自查</div>
                {inspectionData.items.map(item => (
                  <div key={item.id} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 13, color: '#333', fontWeight: 500, marginBottom: 4 }}>
                      {item.title}
                      {item.description && <span style={{ color: '#999', fontSize: 12, marginLeft: 8 }}>({item.description})</span>}
                    </div>
                    {item.value && (
                      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                        {item.value}
                      </div>
                    )}
                    {item.images && item.images.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                        {item.images.map((img, index) => (
                          <div
                            key={index}
                            style={{
                              width: 80,
                              height: 80,
                              backgroundColor: '#f0f0f0',
                              borderRadius: 4,
                              overflow: 'hidden',
                            }}
                          >
                            <img src={img} alt={`检查图片 ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                    {item.value && item.value.includes('是') && (
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: '#52c41a',
                      }}>
                        是
                      </div>
                    )}
                    {item.value && item.value.includes('否') && (
                      <div style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 500,
                        color: '#fff',
                        backgroundColor: '#52c41a',
                      }}>
                        否
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '12px 0' }} />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 8, fontWeight: 500 }}>驾驶员测试</div>
                {inspectionData.driverHealth.items.map(item => (
                  <div key={item.id} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 13, color: '#666', marginBottom: 4 }}>
                      {item.question}
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 500,
                      color: '#fff',
                      backgroundColor: item.answer === 'yes' ? '#ff4d4f' : '#52c41a',
                    }}>
                      {item.answer === 'yes' ? '是' : '否'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              backgroundColor: '#fff',
              borderTop: '1px solid #f0f0f0',
              display: 'flex',
              gap: 12,
            }}>
              <Button
                type="default"
                size="large"
                block
                onClick={handleReject}
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 500,
                }}
              >
                驳回
              </Button>
              <Button
                type="primary"
                size="large"
                block
                onClick={handleApprove}
                style={{
                  height: 48,
                  fontSize: 15,
                  fontWeight: 500,
                  boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
                }}
              >
                审核通过
              </Button>
            </div>
          </>
        )}

        {rejectModalVisible && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              width: '90%',
              maxWidth: 320,
              backgroundColor: '#fff',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a', marginBottom: 16, textAlign: 'center' }}>
                驳回原因
              </div>
              <TextArea
                rows={4}
                placeholder="请填写驳回原因"
                value={rejectRemark}
                onChange={(e) => setRejectRemark(e.target.value)}
                style={{ marginBottom: 20 }}
              />
              <div style={{ display: 'flex', gap: 12 }}>
                <Button
                  type="default"
                  block
                  onClick={() => setRejectModalVisible(false)}
                  style={{ height: 40 }}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  block
                  onClick={handleRejectSubmit}
                  style={{ height: 40 }}
                >
                  确定
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

export default SelfInspectionPage
