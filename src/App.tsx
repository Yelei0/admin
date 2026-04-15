import { HashRouter as Router, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, message } from 'antd'
import { SettingOutlined, UserOutlined, DownOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import AppRoutes from './router'
import './App.css'

const { Content, Sider } = Layout
const { SubMenu } = Menu

// 侧边栏组件
const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // 根据当前路径确定选中的菜单项
  const pathname = location.pathname
  const selectedKey = pathname.replace('/admin/', '').replace('/', '') || 'shippers'
  
  // 处理设置按钮点击
  const handleSettingClick = () => {
    navigate('/settings')
  }

  // 个人中心下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'change-password',
      label: <Link to="/change-password">修改密码</Link>,
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => {
        // 实际项目中这里应该清除登录态
        message.success('已退出登录')
        navigate('/login')
      },
    },
  ]
  
  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <div className="logo" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 18, fontWeight: 'bold' }}>
        <span>危化品运输管理平台</span>
        <Button 
          type="text" 
          icon={<SettingOutlined />} 
          onClick={handleSettingClick}
          style={{ marginLeft: '8px' }}
        />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
        defaultOpenKeys={['shipperManagement', 'planManagement', 'resourceManagement']}
      >
        {/* 托运企业管理 */}
        <SubMenu key="shipperManagement" title="托运企业管理">
          <Menu.Item key="shippers">
            <Link to="/shippers">托运企业列表</Link>
          </Menu.Item>
        </SubMenu>

        {/* 计划管理 */}
        <SubMenu key="planManagement" title="计划管理">
          <Menu.Item key="batch-plans">
            <Link to="/batch-plans">批次计划管理</Link>
          </Menu.Item>
        </SubMenu>

        {/* 资源管理 */}
        <SubMenu key="resourceManagement" title="资源管理">
          <Menu.Item key="experts">
            <Link to="/experts">应急专家库</Link>
          </Menu.Item>
          <Menu.Item key="carrier">
            <Link to="/carrier">承运商端</Link>
          </Menu.Item>
        </SubMenu>

        {/* 企业信息 */}
        <Menu.Item key="company-info">
          <Link to="/company-info">企业信息管理</Link>
        </Menu.Item>

        {/* 测试页面 */}
        <SubMenu key="test" title="测试页面">
          <Menu.Item key="orders">
            <Link to="/orders">订单管理</Link>
          </Menu.Item>
          <Menu.Item key="users">
            <Link to="/users">用户管理</Link>
          </Menu.Item>
          <Menu.Item key="products">
            <Link to="/products">产品管理</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>

      {/* 底部个人中心 */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        width: '100%', 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        background: '#fff'
      }}>
        <Dropdown menu={{ items: userMenuItems }} placement="topLeft">
          <Button type="text" block style={{ textAlign: 'left' }}>
            <UserOutlined />
            <span style={{ marginLeft: 8 }}>管理员</span>
            <DownOutlined style={{ float: 'right', marginTop: 6 }} />
          </Button>
        </Dropdown>
      </div>
    </Sider>
  )
}

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sidebar />
        <Layout>
          <Content style={{ padding: '24px', margin: 0, minHeight: '100vh' }}>
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App
