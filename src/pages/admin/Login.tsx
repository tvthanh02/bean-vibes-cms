import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { UserOutlined, LockOutlined, CoffeeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../api/adminAuth';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await adminLogin(values);
      localStorage.setItem('admin_token', res.data.token);
      message.success('Đăng nhập thành công!');
      // Điều hướng theo role
      const profile = JSON.parse(localStorage.getItem('mock_profile') || '{}');
      if (profile.role === 'admin') navigate('/admin/dashboard');
      else navigate('/moderator/dashboard');
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-200">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl border-0 p-0">
        <div className="flex flex-col items-center py-8 px-6">
          <div className="bg-orange-400 rounded-full p-3 mb-4 shadow-lg">
            <CoffeeOutlined style={{ fontSize: 32, color: 'white' }} />
          </div>
          <Title level={3} className="text-center mb-1 !font-bold">Bean Vibes CMS</Title>
          <Text type="secondary" className="mb-6 text-base">Đăng nhập quản trị viên / kiểm duyệt viên</Text>
          <Form
            name="admin-login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="w-full"
          >
            <Form.Item
              label="Tên đăng nhập"
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input size="large" placeholder="Tên đăng nhập" prefix={<UserOutlined />} autoFocus />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password size="large" placeholder="Mật khẩu" prefix={<LockOutlined />} />
            </Form.Item>

            <Form.Item className="mb-2">
              <Button type="primary" htmlType="submit" block size="large" loading={loading} className="!bg-orange-500 hover:!bg-orange-600 !font-semibold shadow">
                Đăng nhập
              </Button>
            </Form.Item>
            <div className="text-center text-xs text-gray-400 mt-2">
              <div><b>Admin:</b> admin / admin</div>
              <div><b>Moderator:</b> mod / mod</div>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default Login; 