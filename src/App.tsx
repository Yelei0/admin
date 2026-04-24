import { HashRouter as Router, Link, useLocation, useNavigate, Routes, Route, Outlet } from 'react-router-dom'
import { Layout, Menu, Button, Dropdown, message, Tabs, Tooltip } from 'antd'
import {
  SettingOutlined,
  UserOutlined,
  DownOutlined,
  ReloadOutlined,
  CloseOutlined,
  CloseCircleOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons'
import type { MenuProps, TabsProps } from 'antd'
import { useEffect } from 'react'
import { useTabsStore } from './store/tabsStore'
import AppRoutes from './router/index'
import './App.css'

const { Header, Sider } = Layout

// 路由配置
const routeConfig = [
  { path: '/', label: '首页' },
  { path: '/carrier', label: '人车企改动原型' },
  { path: '/dangerous-goods', label: '危险货物管理' },
  { path: '/carrier-plan-details', label: '计划明细管理' },
  { path: '/batch-plans', label: '批次计划管理' },
  { path: '/shipper-plan-details', label: '计划明细管理' },
  { path: '/plan-approval', label: '计划明细管理' },
  { path: '/plan-batch-plans', label: '批次计划管理' },
  { path: '/escort-batch', label: '押运批次管理' },
  { path: '/escort-vehicles', label: '押运车辆维护' },
  { path: '/escort-personnel', label: '押运人员维护' },
  { path: '/formation-management', label: '编队管理' },
  { path: '/bridge-approval', label: '上桥审批' },
  { path: '/self-inspection', label: '自查审批' },
  { path: '/experts', label: '应急专家库' },
  { path: '/company-info', label: '企业信息管理' },
  { path: '/shippers', label: '托运企业列表' },
  { path: '/settings', label: '系统设置' },
  { path: '/change-password', label: '修改密码' },
  { path: '/driver-app/person-vehicle-binding', label: '人车绑定' },
  { path: '/driver-app/plan-query', label: '计划查询' },
  { path: '/driver-app/training', label: '培训学习' },
  { path: '/driver-app/self-check', label: '自检自查' },
]

// 顶部导航栏组件
const TopHeader = () => {
  const navigate = useNavigate()

  const handleSettingClick = () => {
    navigate('/settings')
  }

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'change-password',
      label: (
        <span onClick={() => navigate('/change-password')}>
          <LockOutlined style={{ marginRight: 8 }} />
          修改密码
        </span>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <span onClick={() => {
          message.success('已退出登录')
          navigate('/login')
        }}>
          <LogoutOutlined style={{ marginRight: 8 }} />
          退出登录
        </span>
      ),
    },
  ]

  return (
    <Header style={{
      background: '#fff',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #f0f0f0',
      height: 64,
      lineHeight: '64px'
    }}>
      {/* 左侧标题 */}
      <div style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1890ff'
      }}>
        危化品运输管理平台
      </div>

      {/* 右侧操作区 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }}>
        {/* 设置按钮 */}
        <Tooltip title="系统设置">
          <Button
            type="text"
            icon={<SettingOutlined />}
            onClick={handleSettingClick}
          >
            设置
          </Button>
        </Tooltip>

        {/* 用户下拉菜单 */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Button type="text">
            <UserOutlined />
            <span style={{ marginLeft: 8 }}>管理员</span>
            <DownOutlined style={{ marginLeft: 4, fontSize: 12 }} />
          </Button>
        </Dropdown>
      </div>
    </Header>
  )
}

// 侧边栏组件
const Sidebar = () => {
  const location = useLocation()
  const pathname = location.pathname
  const selectedKey = pathname.replace('/admin/', '').replace('/', '') || 'carrier'

  return (
    <Sider width={200} style={{ background: '#fff' }}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{ height: '100%', borderRight: 0 }}
        defaultOpenKeys={['shipperClient']}
        items={[
          {
            key: 'carrierPlatform',
            label: '承运企业平台',
            children: [
              {
                key: 'carrier',
                label: <Link to="/carrier">人车企改动原型</Link>,
              },
              {
                key: 'dangerous-goods',
                label: <Link to="/dangerous-goods">危险货物管理</Link>,
              },
              {
                key: 'carrier-plan-details',
                label: <Link to="/carrier-plan-details">计划明细管理</Link>,
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            key: 'shipperClient',
            label: '托运企业端（前台）',
            children: [
              {
                key: 'batch-plans',
                label: <Link to="/batch-plans">批次计划管理</Link>,
              },
              {
                key: 'shipper-plan-details',
                label: <Link to="/shipper-plan-details">计划明细管理</Link>,
              },
              {
                key: 'experts',
                label: <Link to="/experts">应急专家库</Link>,
              },
              {
                key: 'company-info',
                label: <Link to="/company-info">企业信息管理</Link>,
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            key: 'planManagement',
            label: '计划管理',
            children: [
              {
                key: 'plan-batch-plans',
                label: <Link to="/plan-batch-plans">批次计划管理</Link>,
              },
              {
                key: 'plan-approval',
                label: <Link to="/plan-approval">计划明细管理</Link>,
              },
              {
                key: 'escort-batch',
                label: <Link to="/escort-batch">押运批次管理</Link>,
              },
            ],
          },
          {
            key: 'basicManagement',
            label: '基础管理',
            children: [
              {
                key: 'shippers',
                label: <Link to="/shippers">托运企业列表</Link>,
              },
              {
                key: 'escort-vehicles',
                label: <Link to="/escort-vehicles">押运车辆维护</Link>,
              },
              {
                key: 'escort-personnel',
                label: <Link to="/escort-personnel">押运人员维护</Link>,
              },
              {
                key: 'carrier-companies',
                label: <Link to="/carrier-companies">承运企业管理</Link>,
              },
              {
                key: 'carrier-vehicles',
                label: <Link to="/carrier-vehicles">承运车辆管理</Link>,
              },
              {
                key: 'carrier-personnel',
                label: <Link to="/carrier-personnel">承运人员管理</Link>,
              },
            ],
          },
          {
            key: 'trainingManagement',
            label: '培训管理',
            children: [
              {
                key: 'training-materials',
                label: <Link to="/training-materials">培训资料管理</Link>,
              },
              {
                key: 'training-records',
                label: <Link to="/training-records">培训记录</Link>,
              },
            ],
          },
          {
            type: 'divider',
          },
          { key: 'regulatoryApp',
            label: '监管 APP',
            children: [
              {
                key: 'self-inspection',
                label: <Link to="/self-inspection">自查审批</Link>,
              },
              {
                key: 'formation-management',
                label: <Link to="/formation-management">编队管理</Link>,
              },
              {
                key: 'bridge-approval',
                label: <Link to="/bridge-approval">上桥审批</Link>,
              },
            ],
          },
          {
            type: 'divider',
          },
          {
            key: 'driverApp',
            label: '驾押人员（服务号H5）',
            children: [
              {
                key: 'driver-app-person-vehicle-binding',
                label: <Link to="/driver-app/person-vehicle-binding">人车绑定</Link>,
              },
              {
                key: 'driver-app-plan-query',
                label: <Link to="/driver-app/plan-query">计划查询</Link>,
              },
              {
                key: 'driver-app-training',
                label: <Link to="/driver-app/training">培训学习</Link>,
              },
              {
                key: 'driver-app-self-check',
                label: <Link to="/driver-app/self-check">自检自查</Link>,
              },
            ],
          },
        ]}
      />
    </Sider>
  )
}

// 标签页头部组件
const TabHeader = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { tabs, activeKey, addTab, removeTab, setActiveKey, closeAll, refreshTab } = useTabsStore()

  // 监听路由变化，自动添加标签页
  useEffect(() => {
    const currentPath = location.pathname
    const currentRoute = routeConfig.find(route => route.path === currentPath)
    if (currentRoute) {
      addTab({
        key: currentPath,
        label: currentRoute.label,
        path: currentPath,
      })
      setActiveKey(currentPath)
    }
  }, [location.pathname, addTab, setActiveKey])

  const handleTabClick = (key: string) => {
    navigate(key)
    setActiveKey(key)
  }

  const handleTabClose = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    removeTab(key)
    if (key === activeKey && tabs.length > 1) {
      const firstTab = tabs.find(tab => tab.key !== key)
      if (firstTab) {
        navigate(firstTab.key)
        setActiveKey(firstTab.key)
      }
    }
  }

  const handleRefresh = (key: string, e: React.MouseEvent) => {
    e.stopPropagation()
    refreshTab(key)
  }

  const tabItems: TabsProps['items'] = tabs.map(tab => ({
    key: tab.key,
    label: (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>{tab.label}</span>
        {tab.key !== '/' && tabs.length > 1 && (
          <div style={{ display: 'flex', gap: 4 }}>
            <Tooltip title="刷新">
              <ReloadOutlined
                style={{ fontSize: 12, cursor: 'pointer' }}
                onClick={(e) => handleRefresh(tab.key, e)}
              />
            </Tooltip>
            <Tooltip title="关闭">
              <CloseCircleOutlined
                style={{ fontSize: 12, cursor: 'pointer' }}
                onClick={(e) => handleTabClose(tab.key, e)}
              />
            </Tooltip>
          </div>
        )}
      </div>
    ),
    children: <Outlet />,
  }))

  return (
    <div style={{
      borderBottom: '1px solid #f0f0f0',
      background: '#fff',
    }}>
      <Tabs
        activeKey={activeKey}
        items={tabItems}
        onTabClick={handleTabClick}
        style={{
          margin: 0,
          height: 40,
        }}
        tabBarStyle={{
          height: 40,
          lineHeight: '40px',
        }}
        type="card"
        extra={
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={closeAll}
            style={{ marginRight: 16 }}
          >
            关闭全部
          </Button>
        }
      />
    </div>
  )
}

// 主应用组件
const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <TopHeader />
        <Layout>
          <Sidebar />
          <Layout style={{ padding: 24, background: '#f5f5f5' }}>
            <TabHeader />
            <div style={{ minHeight: 280, marginTop: 16 }}>
              <Routes>
                {AppRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </Routes>
            </div>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  )
}

export default App;