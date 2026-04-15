import { Routes, Route, Navigate } from 'react-router-dom';
import GenericListPage from '../components/GenericListPage';
import SettingsPage from '../components/SettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 重定向到订单管理页 */}
      <Route path="/" element={<Navigate to="/orders" replace />} />
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