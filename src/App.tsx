import { HashRouter as Router, Link, useLocation, useNavigate } from 'react-router-dom'
import { Layout, Menu, Button } from 'antd'
import { SettingOutlined } from '@ant-design/icons'
import AppRoutes from './router'
import './App.css'

const { Content, Sider } = Layout

// 菜单项配置
const menuItems = [
  {
    key: 'orders',
    label: <Link to="/orders">订单管理</Link>,
  },
  {
    key: 'users',
    label: <Link to="/users">用户管理</Link>,
  },
  {
    key: 'products',
    label: <Link to="/products">产品管理</Link>,
  },
]

// 侧边栏组件
const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  // 根据当前路径确定选中的菜单项
  const selectedKey = location.pathname.slice(1) || 'orders'
  
  // 处理设置按钮点击
  const handleSettingClick = () => {
    navigate('/settings')
  }
  
  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <div className="logo" style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: 18, fontWeight: 'bold' }}>
        <span>后台管理系统</span>
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
        items={menuItems}
      />
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