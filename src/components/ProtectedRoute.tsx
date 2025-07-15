import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  role?: 'admin' | 'moderator';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { user, loading } = useAuthUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (role && user.role !== role) {
    // Nếu không đúng role, chuyển về trang phù hợp
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/moderator/dashboard'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute; 