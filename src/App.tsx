import { HashRouter as Router, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
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
        defaultOpenKeys={['shipperManagement']}
      >
        <SubMenu key="shipperManagement" title="托运企业管理">
          <Menu.Item key="shippers">
            <Link to="/shippers">托运企业列表</Link>
          </Menu.Item>
        </SubMenu>
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
        <Menu.Item key="carrier">
          <Link to="/carrier">承运商端</Link>
        </Menu.Item>
      </Menu>
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
