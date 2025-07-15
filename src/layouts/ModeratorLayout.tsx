import React from 'react';
import { Layout, Menu, Breadcrumb, Avatar, Dropdown, Button } from 'antd';
import {
  FileSearchOutlined,
  FileProtectOutlined,
  FlagOutlined,
  CheckCircleOutlined,
  CommentOutlined,
  EnvironmentOutlined,
  LogoutOutlined,
  CoffeeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuthUser } from '../hooks/useAuthUser';
import { adminLogout } from '../api/adminAuth';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: 'dashboard', icon: <CheckCircleOutlined />, label: 'Dashboard', to: '/moderator/dashboard' },
  { key: 'places', icon: <EnvironmentOutlined />, label: 'Địa điểm', to: '/moderator/places' },
  { key: 'reviews', icon: <FileProtectOutlined />, label: 'Bài viết đánh giá', to: '/moderator/reviews' },
  { key: 'reports', icon: <FlagOutlined />, label: 'Xem báo cáo', to: '/moderator/reports' },
  { key: 'report-reviews', icon: <FileSearchOutlined />, label: 'Xử lý báo cáo bài đánh giá', to: '/moderator/report-reviews' },
  { key: 'report-places', icon: <EnvironmentOutlined />, label: 'Xử lý báo cáo địa điểm', to: '/moderator/report-places' },
  { key: 'report-comments', icon: <CommentOutlined />, label: 'Xử lý báo cáo bình luận', to: '/moderator/report-comments' },
  { key: 'comments', icon: <CommentOutlined />, label: 'Bình luận', to: '/moderator/comments' },
];

function getBreadcrumb(location: string) {
  if (location.includes('places')) return ['Duyệt địa điểm mới'];
  if (location.includes('reviews')) return ['Duyệt bài đánh giá'];
  if (location.includes('reports')) return ['Xem báo cáo'];
  if (location.includes('report-reviews')) return ['Xử lý báo cáo bài đánh giá'];
  if (location.includes('report-places')) return ['Xử lý báo cáo địa điểm'];
  if (location.includes('report-comments')) return ['Xử lý báo cáo bình luận'];
  if (location.includes('comments')) return ['Bình luận'];
  return ['Dashboard'];
}

const ModeratorLayout: React.FC = () => {
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
      <Sider breakpoint="lg" collapsedWidth="0" className="!bg-gradient-to-b !from-orange-400 !to-yellow-200">
        <div className="h-16 flex items-center justify-center text-white text-2xl font-bold tracking-wide gap-2">
          <CoffeeOutlined />
          <span>MODERATOR</span>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[menuItems.find(item => location.pathname.startsWith(item.to))?.key || 'dashboard']}
          className="!bg-transparent"
        >
          {menuItems.map(item => (
            <Menu.Item key={item.key} icon={item.icon} className="!rounded-lg !my-1 !mx-2 hover:!bg-orange-200">
              <NavLink to={item.to} className={({ isActive }) => isActive ? 'font-bold text-orange-600' : ''}>{item.label}</NavLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        <Header className="bg-white shadow flex items-center justify-between px-6 z-10" style={{ padding: 0, minHeight: 64, height: 64, position: 'sticky', top: 0, background: '#fff', zIndex: 10, boxShadow: '0 2px 8px #f0f1f2' }}>
          <div className="flex items-center gap-3">
            <CoffeeOutlined className="text-orange-400 text-2xl" />
            <span className="font-semibold text-lg">Trang kiểm duyệt viên hệ thống review cafe Hà Nội</span>
          </div>
          <div className="flex items-center gap-3">
            <Avatar style={{ backgroundColor: '#f59e42' }} icon={<UserOutlined />} />
            <span className="font-medium text-gray-700">{user?.username}</span>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button icon={<LogoutOutlined />} type="text" className="!text-orange-500 hover:!text-orange-700">Đăng xuất</Button>
            </Dropdown>
          </div>
        </Header>
        <Content className="m-4">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>Moderator</Breadcrumb.Item>
            {breadcrumb.map((b) => (
              <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
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

export default ModeratorLayout; 