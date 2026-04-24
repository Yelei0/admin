
import {
  Card,
  Button,
  message,
} from 'antd'

const DriverAppTrainingPage = () => {

  const handleVideoComplete = () => {
    message.success('视频学习完成！')
  }

  const handleArticleComplete = () => {
    message.success('文章学习完成！')
  }

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600 }}>培训学习</h1>
        <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: 14 }}>驾押人员APP - 培训学习</p>
      </div>

      <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {/* 视频类培训 */}
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
            视频培训
          </div>

          <div style={{ padding: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                XX化工企业应急预案
              </h3>
            </div>

            {/* 视频播放区域 */}
            <div style={{
              position: 'relative',
              width: '100%',
              height: 200,
              backgroundColor: '#1a1a1a',
              borderRadius: 8,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* 视频封面 */}
              <div style={{ position: 'absolute', inset: 0, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#2a3b4c',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 0,
                      height: 0,
                      borderTop: '12px solid transparent',
                      borderBottom: '12px solid transparent',
                      borderLeft: '20px solid white',
                      marginLeft: 5,
                    }} />
                  </div>
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '8px 12px',
                  fontSize: 12,
                }}>
                  城市数字化发展趋势
                </div>
              </div>
            </div>

            {/* 视频信息 */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
                视频时长: 03:50 / 03:50
              </div>
              <div style={{
                height: 4,
                backgroundColor: '#f0f0f0',
                borderRadius: 2,
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  width: '100%',
                  backgroundColor: '#1890ff',
                }} />
              </div>
            </div>

            {/* 学习完成按钮 */}
            <Button
              type="primary"
              block
              onClick={handleVideoComplete}
              style={{ height: 44, fontSize: 16, marginTop: 20 }}
            >
              学习完成 (60S)
            </Button>
          </div>
        </div>

        {/* 文章类培训 */}
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
            文章培训
          </div>

          <div style={{ padding: 16, height: 580, overflowY: 'auto' }}>
            <div style={{ marginBottom: 16 }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>
                1. 前言
              </h3>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500, color: '#333' }}>
                数字化业务暂行管理办法
              </h4>
            </div>

            {/* 文章内容 */}
            <div style={{ marginBottom: 24 }}>
              <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500, color: '#333' }}>
                一、目的
              </h5>
              <p style={{ margin: '0 0 12px 0', fontSize: 13, lineHeight: 1.5, color: '#666' }}>
                为响应集团数字化转型要求，快速高效地开展数字化业务，有效控制开发成本，提升各组织及业务场景的工作效率，实现物流运输智能业务群的数字化转型，现制定物流运输智能业务群数字化暂行管理办法。
              </p>

              <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500, color: '#333' }}>
                二、适用范围
              </h5>
              <p style={{ margin: '0 0 12px 0', fontSize: 13, lineHeight: 1.5, color: '#666' }}>
                适用于物流运输智能业务群数字化需求的提出、评审、开发、验收、实施、结算及考核全流程。
              </p>

              <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500, color: '#333' }}>
                三、职责划分
              </h5>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, lineHeight: 1.5, color: '#666' }}>
                1、业务自驱及专业赋能组织：<br />
                负责数字化业务的需求提出、价值确认、验收使用及产品推广；
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, lineHeight: 1.5, color: '#666' }}>
                2、备品与数字化赋能群：<br />
                负责数字化业务的整体规划和把控，收集整理物流运输智能业务群的数字化业务需求，与数字化部门对接、组织评审、开发跟进及验收考核；
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: 13, lineHeight: 1.5, color: '#666' }}>
                3、数字化业务评审小组：<br />
                负责对数字化业务需求进行评审，确保需求的合理性、可行性和价值性。
              </p>
            </div>

            {/* 学习完成按钮 */}
            <Button
              type="primary"
              block
              onClick={handleArticleComplete}
              style={{ height: 44, fontSize: 16, marginTop: 20 }}
            >
              学习完成
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default DriverAppTrainingPage
