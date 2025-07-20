import React from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  FileProtectOutlined,
  FlagOutlined,
  AppstoreOutlined,
  KeyOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  CommentOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { adminLogout } from '../api/adminAuth';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', to: '/admin/dashboard' },
  { key: 'users', icon: <UserOutlined />, label: 'Người dùng', to: '/admin/users' },
  { key: 'moderator', icon: <FileProtectOutlined />, label: 'Kiểm duyệt', to: '/admin/moderator' },
  { key: 'reports', icon: <FlagOutlined />, label: 'Báo cáo', to: '/admin/reports' },
  { key: 'categories', icon: <AppstoreOutlined />, label: 'Danh mục', to: '/admin/categories' },
  { key: 'keywords', icon: <KeyOutlined />, label: 'Từ khóa', to: '/admin/keywords' },
  { key: 'places', icon: <EnvironmentOutlined />, label: 'Địa điểm', to: '/admin/places' },
  { key: 'reviews', icon: <FileProtectOutlined />, label: 'Bài viết đánh giá', to: '/admin/reviews' },
  { key: 'comments', icon: <CommentOutlined />, label: 'Bình luận', to: '/admin/comments' },
];

function getBreadcrumb(location: string) {
  if (location.includes('dashboard')) return ['Dashboard'];
  if (location.includes('users')) return ['Người dùng'];
  if (location.includes('moderator')) return ['Kiểm duyệt'];
  if (location.includes('reports')) return ['Báo cáo'];
  if (location.includes('categories')) return ['Danh mục'];
  if (location.includes('keywords')) return ['Từ khóa'];
  if (location.includes('places')) return ['Địa điểm'];
  if (location.includes('reviews')) return ['Bài viết đánh giá'];
  if (location.includes('comments')) return ['Bình luận'];
  if (location.includes('settings')) return ['Cài đặt'];
  return [];
}

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const breadcrumb = getBreadcrumb(location.pathname);
  const { user } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={handleLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" className="!bg-gradient-to-b !from-gray-800 !to-gray-900">
        <div className="h-16 flex items-center justify-center text-white text-2xl font-bold tracking-wide gap-2">
          <CoffeeOutlined />
          <span>BEAN VIBES</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[menuItems.find(item => location.pathname.startsWith(item.to))?.key || 'dashboard']}
          className="!bg-transparent !px-2 !py-2"
        >
          {menuItems.map(item => (
            <Menu.Item 
              key={item.key} 
              icon={item.icon} 
              className={`!rounded-lg !my-2 !mx-3 !px-4 !py-3 transition-all duration-200 ${
                location.pathname.startsWith(item.to) 
                  ? '!bg-blue-600 !text-white shadow-lg' 
                  : 'hover:!bg-gray-700 !text-gray-300'
              }`}
            >
              <NavLink 
                to={item.to} 
                className={({ isActive }) => 
                  isActive 
                    ? 'font-semibold text-white' 
                    : 'text-gray-300 hover:text-white'
                }
              >
                {item.label}
              </NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white shadow flex items-center justify-between px-6 z-10" style={{ padding: 0, minHeight: 64, height: 64, position: 'sticky', top: 0, background: '#fff', zIndex: 10, boxShadow: '0 2px 8px #f0f1f2' }}>
          <div className="flex items-center gap-3">
            <CoffeeOutlined className="text-gray-700 text-2xl" />
            <span className="font-semibold text-lg">Trang quản trị hệ thống review cafe Hà Nội</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar style={{ backgroundColor: '#4b5563' }} icon={<UserOutlined />} />
            <span className="font-medium text-gray-700">{user?.username}</span>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button icon={<LogoutOutlined />} type="text" className="!text-gray-600 hover:!text-gray-800">Đăng xuất</Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4">
          <Breadcrumb className="mb-6">
            <Breadcrumb.Item>
              <NavLink to="/admin/settings" className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                <UserOutlined />
                Admin
              </NavLink>
            </Breadcrumb.Item>
            {breadcrumb.map((b) => (
              <Breadcrumb.Item key={b} className="text-gray-600 flex items-center gap-1">
                {b === 'Dashboard' && <DashboardOutlined />}
                {b === 'Người dùng' && <UserOutlined />}
                {b === 'Kiểm duyệt' && <FileProtectOutlined />}
                {b === 'Báo cáo' && <FlagOutlined />}
                {b === 'Danh mục' && <AppstoreOutlined />}
                {b === 'Từ khóa' && <KeyOutlined />}
                {b === 'Địa điểm' && <EnvironmentOutlined />}
                {b === 'Bài viết đánh giá' && <FileProtectOutlined />}
                {b === 'Bình luận' && <CommentOutlined />}
                {b === 'Cài đặt' && <SettingOutlined />}
                {b}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div className="bg-white p-8 min-h-[360px] rounded-xl shadow">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 