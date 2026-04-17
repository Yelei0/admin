import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TabItem {
  key: string
  label: string
  path: string
  closable?: boolean
}

interface TabsState {
  // 已打开的标签页
  tabs: TabItem[]
  // 当前激活的标签页
  activeKey: string
  // 添加标签页
  addTab: (tab: TabItem) => void
  // 移除标签页
  removeTab: (key: string) => void
  // 设置激活标签页
  setActiveKey: (key: string) => void
  // 关闭其他标签页
  closeOthers: (key: string) => void
  // 关闭所有标签页
  closeAll: () => void
  // 刷新标签页
  refreshTab: (key: string) => void
}

// 路由路径到标签名的映射
export const routeLabelMap: Record<string, string> = {
  '/': '首页',
  '/carrier': '承运商端',
  '/batch-plans': '批次计划管理',
  '/plan-details': '计划明细管理',
  '/experts': '应急专家库',
  '/company-info': '企业信息管理',
  '/shippers': '托运企业列表',
  '/settings': '系统设置',
  '/change-password': '修改密码',
}

export const useTabsStore = create<TabsState>()(
  persist(
    (set, get) => ({
      tabs: [
        { key: '/', label: '首页', path: '/', closable: false }
      ],
      activeKey: '/',

      addTab: (tab) => {
        const { tabs } = get()
        const exists = tabs.find(t => t.key === tab.key)
        if (!exists) {
          set({ tabs: [...tabs, tab] })
        }
        set({ activeKey: tab.key })
      },

      removeTab: (key) => {
        const { tabs, activeKey } = get()
        const newTabs = tabs.filter(t => t.key !== key)
        
        // 如果关闭的是当前激活的标签，需要切换激活状态
        if (activeKey === key && newTabs.length > 0) {
          const closedIndex = tabs.findIndex(t => t.key === key)
          const newActiveKey = newTabs[Math.min(closedIndex, newTabs.length - 1)].key
          set({ tabs: newTabs, activeKey: newActiveKey })
        } else {
          set({ tabs: newTabs })
        }
      },

      setActiveKey: (key) => {
        set({ activeKey: key })
      },

      closeOthers: (key) => {
        const { tabs } = get()
        const currentTab = tabs.find(t => t.key === key)
        if (currentTab) {
          // 保留当前标签和不可关闭的标签
          const fixedTabs = tabs.filter(t => t.key === key || t.closable === false)
          set({ tabs: fixedTabs, activeKey: key })
        }
      },

      closeAll: () => {
        const { tabs } = get()
        // 只保留不可关闭的标签
        const fixedTabs = tabs.filter(t => t.closable === false)
        if (fixedTabs.length > 0) {
          set({ tabs: fixedTabs, activeKey: fixedTabs[0].key })
        }
      },

      refreshTab: (key) => {
        // 触发标签页刷新，通过 key 变化来实现
        const event = new CustomEvent('refresh-tab', { detail: { key } })
        window.dispatchEvent(event)
      }
    }),
    {
      name: 'tabs-storage',
      partialize: (state) => ({ tabs: state.tabs, activeKey: state.activeKey })
    }
  )
)
