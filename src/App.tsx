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
  { path: '/plan-details', label: '计划明细管理' },
  { path: '/experts', label: '应急专家库' },
  { path: '/company-info', label: '企业信息管理' },
  { path: '/shippers', label: '托运企业列表' },
  { path: '/settings', label: '系统设置' },
  { path: '/change-password', label: '修改密码' },
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
            key: 'shipperClient',
            label: '托运企业端（前台）',
            children: [
              {
                key: 'batch-plans',
                label: <Link to="/batch-plans">批次计划管理</Link>,
              },
              {
                key: 'plan-details',
                label: <Link to="/plan-details">计划明细管理</Link>,
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
            key: 'shipperManagement',
            label: '托运企业管理',
            children: [
              {
                key: 'shippers',
                label: <Link to="/shippers">托运企业列表</Link>,
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
  const { tabs, activeKey, addTab, removeTab, setActiveKey, closeOthers, closeAll, refreshTab } = useTabsStore()

  // 监听路由变化，自动添加标签页
  useEffect(() => {
    const pathname = location.pathname
    const route = routeConfig.find(r => r.path === pathname)

    if (route) {
      const exists = tabs.find(t => t.key === pathname)
      if (!exists) {
        addTab({
          key: pathname,
          label: route.label,
          path: pathname,
          closable: pathname !== '/'
        })
      }
      setActiveKey(pathname)
    }
  }, [location.pathname])

  const handleTabChange = (key: string) => {
    setActiveKey(key)
    navigate(key)
  }

  const handleTabEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove' && typeof targetKey === 'string') {
      removeTab(targetKey)
      const remainingTabs = tabs.filter(t => t.key !== targetKey)
      if (remainingTabs.length > 0 && activeKey === targetKey) {
        const closedIndex = tabs.findIndex(t => t.key === targetKey)
        const newTab = remainingTabs[Math.min(closedIndex, remainingTabs.length - 1)]
        navigate(newTab.path)
      }
    }
  }

  const tabItems: TabsProps['items'] = tabs.map(tab => ({
    key: tab.key,
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {tab.label}
        {tab.key === activeKey && (
          <Tooltip title="刷新">
            <ReloadOutlined
              style={{ fontSize: 12, marginLeft: 4 }}
              onClick={(e) => {
                e.stopPropagation()
                refreshTab(tab.key)
              }}
            />
          </Tooltip>
        )}
      </span>
    ),
    closable: tab.closable !== false,
  }))

  const tabOperationsMenu: MenuProps['items'] = [
    {
      key: 'refresh',
      label: '刷新当前',
      icon: <ReloadOutlined />,
      onClick: () => refreshTab(activeKey),
    },
    {
      key: 'close',
      label: '关闭当前',
      icon: <CloseOutlined />,
      onClick: () => handleTabEdit(activeKey, 'remove'),
      disabled: tabs.find(t => t.key === activeKey)?.closable === false,
    },
    {
      key: 'closeOthers',
      label: '关闭其他',
      icon: <CloseCircleOutlined />,
      onClick: () => {
        closeOthers(activeKey)
        const currentTab = tabs.find(t => t.key === activeKey)
        if (currentTab) {
          navigate(currentTab.path)
        }
      },
    },
    {
      key: 'closeAll',
      label: '关闭所有',
      icon: <CloseCircleOutlined />,
      onClick: () => {
        closeAll()
        navigate('/')
      },
    },
  ]

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #f0f0f0',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
    }}>
      <Tabs
        type="editable-card"
        activeKey={activeKey}
        onChange={handleTabChange}
        onEdit={handleTabEdit}
        items={tabItems}
        hideAdd
        size="small"
        style={{ flex: 1 }}
        tabBarStyle={{ margin: 0, borderBottom: 'none' }}
      />
      <Dropdown menu={{ items: tabOperationsMenu }} placement="bottomRight">
        <Button
          type="text"
          icon={<DownOutlined />}
          style={{ marginLeft: 8 }}
        >
          标签操作
        </Button>
      </Dropdown>
    </div>
  )
}

// 布局组件
const MainLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航栏 */}
      <TopHeader />

      <Layout>
        {/* 左侧边栏 */}
        <Sidebar />

        {/* 右侧内容区 */}
        <Layout>
          {/* 标签页头部 */}
          <TabHeader />

          {/* 页面内容 */}
          <div style={{
            background: '#f0f2f5',
            minHeight: 'calc(100vh - 112px)',
            padding: '16px'
          }}>
            <Outlet />
          </div>
        </Layout>
      </Layout>
    </Layout>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          {AppRoutes.map(route => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Routes>
    </Router>
  )
}

export default App
