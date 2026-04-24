import { useState } from 'react'
import {
  Card,
  Button,
  message,
  Input,
  Upload,
  Radio,
} from 'antd'

const { TextArea } = Input
import { PlusOutlined } from '@ant-design/icons'

interface CheckItem {
  id: string
  name: string
  description: string
  required: boolean
  status: 'yes' | 'no' | 'pending'
  images: string[]
  value: string
  comments: string
}

interface DriverHealthItem {
  id: string
  question: string
  answer: 'yes' | 'no' | 'pending'
}

const DriverAppSelfCheckPage = () => {
  const [checkItems, setCheckItems] = useState<CheckItem[]>([
    {
      id: 'pressure',
      name: '稳压压力',
      description: '低于0.35MPA',
      required: true,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'blindPlate',
      name: '盲板检查',
      description: '盲板螺丝禁锢情况',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'emergency',
      name: '应急物资',
      description: '车辆配备不少于6只70cm高反光锥桶',
      required: true,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'fire',
      name: '消防器材',
      description: '外观完好，压力指针在绿区，软管无破裂，铅封完好',
      required: true,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'safety',
      name: '安全阀',
      description: '外观完好，铭牌、铅封完好，检验在有效期内',
      required: true,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'mileage',
      name: '车辆行驶里程是否超过60万公里',
      description: '',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'gps',
      name: '车辆GPS连接是否正常',
      description: '',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'leak',
      name: '三漏检查',
      description: '查漏水、漏油、漏气',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'brake',
      name: '刹车系统',
      description: '气泵正常工作，气压正常，刹车阀工作正常，刹车回位正常，全车刹车鼓温度正常',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'transmission',
      name: '传动系统',
      description: '变速箱摘挂挡正常，传动轴输出正常，十字轴工况正常，后桥传动正常，轮胎螺丝无松动和短缺，全车轴头温度正常',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'engine',
      name: '动力系统',
      description: '发动机供气正常，无卡顿，增压器正常工作，输出动力正常',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'lights',
      name: '灯光全部正常',
      description: '',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
    {
      id: 'reflective',
      name: '全车反光膜符合要求',
      description: '',
      required: false,
      status: 'pending',
      images: [],
      value: '',
      comments: '',
    },
  ])

  const [driverHealthItems, setDriverHealthItems] = useState<DriverHealthItem[]>([
    {
      id: 'h1',
      question: '是否头晕、头晕、耳鸣、视力模糊',
      answer: 'pending',
    },
    {
      id: 'h2',
      question: '是否心慌气短、心跳加速',
      answer: 'pending',
    },
    {
      id: 'h3',
      question: '是否肢体麻木、肌肉疼痛、痉挛',
      answer: 'pending',
    },
    {
      id: 'h4',
      question: '是否发烧、咳嗽、感冒',
      answer: 'pending',
    },
    {
      id: 'h5',
      question: '是否有来自家庭、工作等方面的心理压力',
      answer: 'pending',
    },
  ])

  const handleStatusChange = (id: string, status: 'yes' | 'no' | 'pending') => {
    setCheckItems(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ))
  }

  const handleImageUpload = (id: string, file: any) => {
    setCheckItems(prev => prev.map(item => 
      item.id === id ? { ...item, images: [...item.images, URL.createObjectURL(file.originFileObj)] } : item
    ))
    return false
  }

  const handleValueChange = (id: string, value: string) => {
    setCheckItems(prev => prev.map(item => 
      item.id === id ? { ...item, value } : item
    ))
  }

  const handleCommentsChange = (id: string, comments: string) => {
    setCheckItems(prev => prev.map(item => 
      item.id === id ? { ...item, comments } : item
    ))
  }

  const handleHealthAnswerChange = (id: string, answer: 'yes' | 'no' | 'pending') => {
    setDriverHealthItems(prev => prev.map(item => 
      item.id === id ? { ...item, answer } : item
    ))
  }

  const handleSubmit = () => {
    // 检查必填项
    const requiredItems = checkItems.filter(item => item.required && item.status === 'pending')
    if (requiredItems.length > 0) {
      message.error(`请完成所有必填项的检查`)
      return
    }

    // 检查驾驶员测试
    const pendingHealthItems = driverHealthItems.filter(item => item.answer === 'pending')
    if (pendingHealthItems.length > 0) {
      message.error(`请完成所有驾驶员测试项目`)
      return
    }

    // 模拟提交
    message.success('自检自查提交成功！')
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>自检自查</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>驾押人员APP - 自检自查</p>
      </div>

      <div className="mobile-container" style={{
        width: 375,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: 700,
        position: 'relative',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
        borderRadius: 8,
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
          自检自查
        </div>

        <div style={{ padding: 16, height: 580, overflowY: 'auto' }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
              车辆检查
            </h3>

            {checkItems.map((item) => (
              <div key={item.id} style={{
                marginBottom: 20,
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
                border: `1px solid ${item.required ? '#ff4d4f' : '#d9d9d9'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: '#333', marginBottom: 4 }}>
                      {item.name}{item.required && <span style={{ color: '#ff4d4f', marginLeft: 4 }}>*</span>}
                    </div>
                    {item.description && (
                      <div style={{ fontSize: 12, color: '#999' }}>
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div style={{ marginLeft: 12 }}>
                    <Radio.Group 
                      value={item.status} 
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      size="small"
                    >
                      <Radio.Button value="yes" style={{ marginRight: 4 }}>是</Radio.Button>
                      <Radio.Button value="no" style={{ marginRight: 4 }}>否</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>

                {item.id === 'mileage' && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>公里数</div>
                    <Input
                      placeholder="请输入公里数"
                      value={item.value}
                      onChange={(e) => handleValueChange(item.id, e.target.value)}
                      style={{ fontSize: 13 }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>上传图片</div>
                  <Upload
                    listType="picture-card"
                    multiple
                    beforeUpload={(file) => handleImageUpload(item.id, file)}
                    fileList={item.images.map((url, i) => ({
                      uid: i.toString(),
                      name: `image${i + 1}.jpg`,
                      status: 'done',
                      url,
                    }))}
                  >
                    {item.images.length < 3 && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>上传</div>
                      </div>
                    )}
                  </Upload>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>备注</div>
                  <TextArea
                    rows={2}
                    placeholder="请输入备注信息"
                    value={item.comments}
                    onChange={(e) => handleCommentsChange(item.id, e.target.value)}
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, backgroundColor: '#f0f0f0', margin: '24px 0' }} />

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
              驾驶员测试
            </h3>

            {driverHealthItems.map((item) => (
              <div key={item.id} style={{
                marginBottom: 16,
                padding: 16,
                backgroundColor: '#f9f9f9',
                borderRadius: 8,
              }}>
                <div style={{ fontSize: 14, color: '#333', marginBottom: 12 }}>
                  {item.question}
                </div>
                <Radio.Group 
                  value={item.answer} 
                  onChange={(e) => handleHealthAnswerChange(item.id, e.target.value)}
                  buttonStyle="solid"
                >
                  <Radio.Button value="yes" style={{ marginRight: 8 }}>是</Radio.Button>
                  <Radio.Button value="no" style={{ marginRight: 8 }}>否</Radio.Button>
                </Radio.Group>
              </div>
            ))}
          </div>

          <Button
            type="primary"
            block
            onClick={handleSubmit}
            style={{ height: 44, fontSize: 16, marginTop: 20, marginBottom: 40 }}
          >
            提交自查
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default DriverAppSelfCheckPage
