import type { ReactNode } from 'react';
import GenericListPage from '../components/GenericListPage';
import SettingsPage from '../components/SettingsPage';
import CarrierPage from '../pages/CarrierPage';
import CompanyInfoPage from '../pages/CompanyInfoPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import PlanDetailPage from '../pages/PlanDetailPage';
import HomePage from '../pages/HomePage';
import DangerousGoodsPage from '../pages/DangerousGoodsPage';
import CarrierPlanDetailPage from '../pages/CarrierPlanDetailPage';
import PlaceholderPage from '../pages/PlaceholderPage';
import FormationManagementPage from '../pages/FormationManagementPage';
import SelfInspectionPage from '../pages/SelfInspectionPage';
import BridgeApprovalPage from '../pages/BridgeApprovalPage';

export interface RouteConfig {
  path: string;
  element: ReactNode;
}

// 路由配置数组
const routes: RouteConfig[] = [
  // 首页 - 空白页
  { path: '/', element: <HomePage /> },

  // 托运企业列表页
  {
    path: '/shippers',
    element: <GenericListPage configPath="/shipper-list.config.json" />,
  },

  // 承运商端页面
  { path: '/carrier', element: <CarrierPage /> },

  // 危险货物管理
  { path: '/dangerous-goods', element: <DangerousGoodsPage /> },

  // 承运企业计划明细管理
  { path: '/carrier-plan-details', element: <CarrierPlanDetailPage /> },

  // 批次计划管理
  {
    path: '/batch-plans',
    element: <GenericListPage configPath="/batch-plan.config.json" />,
  },

  // 计划明细管理
  { path: '/plan-details', element: <PlanDetailPage /> },

  // 托运企业计划明细管理
  { path: '/shipper-plan-details', element: <PlanDetailPage /> },

  // 计划审批
  { path: '/plan-approval', element: <PlaceholderPage title="计划审批" description="计划审批功能正在开发中..." /> },

  // 计划批次计划管理
  { path: '/plan-batch-plans', element: <GenericListPage configPath="/batch-plan.config.json" /> },

  // 押运批次管理
  { path: '/escort-batch', element: <PlaceholderPage title="押运批次管理" description="押运批次管理功能正在开发中..." /> },

  // 押运车辆维护
  { path: '/escort-vehicles', element: <PlaceholderPage title="押运车辆维护" description="押运车辆维护功能正在开发中..." /> },

  // 押运人员维护
  { path: '/escort-personnel', element: <PlaceholderPage title="押运人员维护" description="押运人员维护功能正在开发中..." /> },

  // 编队管理
  { path: '/formation-management', element: <FormationManagementPage /> },

  // 上桥审批
  { path: '/bridge-approval', element: <BridgeApprovalPage /> },

  // 自查审批
  { path: '/self-inspection', element: <SelfInspectionPage /> },

  // 应急专家库
  {
    path: '/experts',
    element: <GenericListPage configPath="/expert.config.json" />,
  },

  // 企业信息管理
  { path: '/company-info', element: <CompanyInfoPage /> },

  // 个人中心 - 修改密码
  { path: '/change-password', element: <ChangePasswordPage /> },

  // 承运企业管理
  { path: '/carrier-companies', element: <PlaceholderPage title="承运企业管理" description="承运企业管理功能正在开发中..." /> },

  // 承运车辆管理
  { path: '/carrier-vehicles', element: <PlaceholderPage title="承运车辆管理" description="承运车辆管理功能正在开发中..." /> },

  // 承运人员管理
  { path: '/carrier-personnel', element: <PlaceholderPage title="承运人员管理" description="承运人员管理功能正在开发中..." /> },

  // 培训资料管理
  { path: '/training-materials', element: <PlaceholderPage title="培训资料管理" description="培训资料管理功能正在开发中..." /> },

  // 培训记录
  { path: '/training-records', element: <PlaceholderPage title="培训记录" description="培训记录功能正在开发中..." /> },

  // 订单列表页
  {
    path: '/orders',
    element: <GenericListPage configPath="/order.config.json" />,
  },
  // 用户管理页
  {
    path: '/users',
    element: <GenericListPage configPath="/user.config.json" />,
  },
  // 产品管理页
  {
    path: '/products',
    element: <GenericListPage configPath="/product.config.json" />,
  },
  // 设置页面
  { path: '/settings', element: <SettingsPage /> },

  // 驾押人员 - 人车绑定
  { path: '/driver-app/person-vehicle-binding', element: <PlaceholderPage title="人车绑定" description="人车绑定功能正在开发中..." /> },

  // 驾押人员 - 计划查询
  { path: '/driver-app/plan-query', element: <PlaceholderPage title="计划查询" description="计划查询功能正在开发中..." /> },

  // 驾押人员 - 培训学习
  { path: '/driver-app/training', element: <PlaceholderPage title="培训学习" description="培训学习功能正在开发中..." /> },

  // 驾押人员 - 自检自查
  { path: '/driver-app/self-check', element: <PlaceholderPage title="自检自查" description="自检自查功能正在开发中..." /> },
];

export default routes;
