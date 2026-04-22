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
import ShipperPlanDetailPage from '../pages/ShipperPlanDetailPage';
import PlanApprovalPage from '../pages/PlanApprovalPage';
import PlanBatchPlansPage from '../pages/PlanBatchPlansPage';
import EscortBatchPage from '../pages/EscortBatchPage';
import EscortVehiclesPage from '../pages/EscortVehiclesPage';
import EscortPersonnelPage from '../pages/EscortPersonnelPage';
import FormationManagementPage from '../pages/FormationManagementPage';
import SelfInspectionPage from '../pages/SelfInspectionPage';
import DriverAppPlanQueryPage from '../pages/DriverAppPlanQueryPage';

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

  // 托运企业计划明细管理
  { path: '/shipper-plan-details', element: <ShipperPlanDetailPage /> },

  // 计划审批页面
  { path: '/plan-approval', element: <PlanApprovalPage /> },

  // 计划管理批次计划管理
  { path: '/plan-batch-plans', element: <PlanBatchPlansPage /> },

  // 计划管理押运批次管理
  { path: '/escort-batch', element: <EscortBatchPage /> },

  // 计划管理押运车辆维护
  { path: '/escort-vehicles', element: <EscortVehiclesPage /> },

  // 计划管理押运人员维护
  { path: '/escort-personnel', element: <EscortPersonnelPage /> },

  // 监管APP编队管理
  { path: '/formation-management', element: <FormationManagementPage /> },

  // 监管APP自查审批
  { path: '/self-inspection', element: <SelfInspectionPage /> },

  // 驾押人员APP计划查询
  { path: '/driver-app/plan-query', element: <DriverAppPlanQueryPage /> },

  // 批次计划管理
  {
    path: '/batch-plans',
    element: <GenericListPage configPath="/batch-plan.config.json" />,
  },

  // 计划明细管理
  { path: '/plan-details', element: <PlanDetailPage /> },

  // 应急专家库
  {
    path: '/experts',
    element: <GenericListPage configPath="/expert.config.json" />,
  },

  // 企业信息管理
  { path: '/company-info', element: <CompanyInfoPage /> },

  // 个人中心 - 修改密码
  { path: '/change-password', element: <ChangePasswordPage /> },

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
];

export default routes;
