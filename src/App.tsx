import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import Login from './pages/admin/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/admin/Dashboard';
import AdminLayout from './layouts/AdminLayout';
import Users from './pages/admin/Users';
import ModeratorRequests from './pages/admin/ModeratorRequests';
import Reports from './pages/admin/Reports';
import Categories from './pages/admin/Categories';
import RestrictedWords from './pages/admin/RestrictedWords';
import PlacesPending from './pages/admin/PlacesPending';
import ModeratorLayout from './layouts/ModeratorLayout';
import ReportsMod from './pages/moderator/Reports';
import ModeratorDashboard from './pages/moderator/Dashboard';
import CommentsAdmin from './pages/admin/Comments';
import ReviewsAdmin from './pages/admin/Reviews';
import PlacesAdmin from './pages/admin/Places';
import ReviewsMod from './pages/moderator/Reviews';
import PlacesMod from './pages/moderator/Places';
import CommentsMod from './pages/moderator/Comments';
import AdminSettings from './pages/admin/Settings';
import ModeratorSettings from './pages/moderator/Settings';

const App: React.FC = () => {
  return (
    <ConfigProvider
      locale={viVN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          {/* Các route sẽ được thêm ở đây */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="moderator" element={<ModeratorRequests />} />
              <Route path="reports" element={<Reports />} />
              <Route path="categories" element={<Categories />} />
              <Route path="keywords" element={<RestrictedWords />} />
              <Route path="places" element={<PlacesAdmin />} />
              <Route path="reviews" element={<ReviewsAdmin />} />
              <Route path="comments" element={<CommentsAdmin />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Các route quản trị khác sẽ thêm ở đây */}
            </Route>
          </Route>
          <Route path="/moderator" element={<ProtectedRoute role="moderator" />}>
            <Route element={<ModeratorLayout />}>
              <Route path="dashboard" element={<ModeratorDashboard />} />
              <Route path="places" element={<PlacesMod />} />
              <Route path="reviews" element={<ReviewsMod />} />
              <Route path="comments" element={<CommentsMod />} />
              <Route path="reports" element={<ReportsMod />} />
              <Route path="settings" element={<ModeratorSettings />} />
              {/* Các route chức năng moderator sẽ thêm ở đây */}
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
