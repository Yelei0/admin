import { Routes, Route, Navigate } from 'react-router-dom';
import GenericListPage from '../components/GenericListPage';
import SettingsPage from '../components/SettingsPage';
import CarrierPage from '../pages/CarrierPage';
import CompanyInfoPage from '../pages/CompanyInfoPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 重定向到托运企业列表页 */}
      <Route path="/" element={<Navigate to="/shippers" replace />} />
      
      {/* 托运企业列表页 */}
      <Route 
        path="/shippers" 
        element={<GenericListPage configPath="/shipper-list.config.json" />} 
      />
      
      {/* 承运商端页面 */}
      <Route path="/carrier" element={<CarrierPage />} />
      
      {/* 批次计划管理 */}
      <Route 
        path="/batch-plans" 
        element={<GenericListPage configPath="/batch-plan.config.json" />} 
      />
      
      {/* 应急专家库 */}
      <Route 
        path="/experts" 
        element={<GenericListPage configPath="/expert.config.json" />} 
      />
      
      {/* 企业信息管理 */}
      <Route path="/company-info" element={<CompanyInfoPage />} />
      
      {/* 个人中心 - 修改密码 */}
      <Route path="/change-password" element={<ChangePasswordPage />} />
      
      {/* 订单列表页 */}
      <Route 
        path="/orders" 
        element={<GenericListPage configPath="/order.config.json" />} 
      />
      {/* 用户管理页 */}
      <Route 
        path="/users" 
        element={<GenericListPage configPath="/user.config.json" />} 
      />
      {/* 产品管理页 */}
      <Route 
        path="/products" 
        element={<GenericListPage configPath="/product.config.json" />} 
      />
      {/* 设置页面 */}
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default AppRoutes;
