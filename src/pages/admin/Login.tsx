import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
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
    <div className="min-h-screen flex">
      {/* Left Section - Visual Background */}
      <div className="w-2/5 relative bg-cover bg-center" style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="coffee" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23D4A574;stop-opacity:1" /><stop offset="100%" style="stop-color:%23A0522D;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23coffee)"/><circle cx="200" cy="300" r="80" fill="%23F5F5DC" opacity="0.8"/><circle cx="600" cy="200" r="60" fill="%23F5F5DC" opacity="0.6"/><circle cx="650" cy="400" r="40" fill="%23F5F5DC" opacity="0.7"/><rect x="150" y="250" width="100" height="80" rx="10" fill="%23333" opacity="0.9"/><rect x="170" y="240" width="60" height="100" rx="8" fill="%23F5F5DC" opacity="0.9"/><circle cx="200" cy="280" r="15" fill="%23F5F5DC" opacity="0.8"/><circle cx="200" cy="320" r="15" fill="%23F5F5DC" opacity="0.8"/><rect x="500" y="280" width="120" height="60" rx="8" fill="%23333" opacity="0.8"/><rect x="520" y="270" width="80" height="80" rx="8" fill="%23F5F5DC" opacity="0.9"/><circle cx="560" cy="310" r="12" fill="%23F5F5DC" opacity="0.8"/><circle cx="560" cy="330" r="12" fill="%23F5F5DC" opacity="0.8"/><rect x="100" y="450" width="80" height="60" rx="5" fill="%23FFF" opacity="0.9"/><rect x="620" y="480" width="60" height="40" rx="5" fill="%23FFF" opacity="0.9"/><rect x="300" y="520" width="100" height="50" rx="5" fill="%23FFF" opacity="0.8"/></svg>')`
      }}>
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-2xl font-light italic">"Espress Yourself."</p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-3/5 bg-white flex items-center justify-center px-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Title level={2} className="!text-gray-800 !font-semibold mb-2">Welcome Back</Title>
            <Text className="text-gray-500 text-base">enter your account credentials to view your orders</Text>
          </div>

          <Form
            name="admin-login"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
            className="w-full"
            initialValues={{ username: 'yuyan@gmail.co', password: '**********' }}
          >
            <Form.Item
              label={<span className="text-gray-700 font-medium">Email</span>}
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập email!' }]}
            >
              <Input 
                size="large" 
                className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                prefix={<UserOutlined className="text-gray-400" />}
                autoFocus 
              />
            </Form.Item>

            <Form.Item
              label={<span className="text-gray-700 font-medium">Password</span>}
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password 
                size="large" 
                className="border-gray-300 focus:border-gray-500 focus:ring-gray-500 rounded-lg"
                prefix={<LockOutlined className="text-gray-400" />}
              />
            </Form.Item>

            <div className="text-right mb-6">
              <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">Forgot your password?</a>
            </div>

            <Form.Item className="mb-6">
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                size="large" 
                loading={loading} 
                className="!bg-green-500 hover:!bg-green-600 !font-semibold !text-white !border-0 rounded-lg h-12 text-base"
              >
                Log In
              </Button>
            </Form.Item>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              {/* <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div> */}
            </div>

            {/* <div className="space-y-3">
              <Button 
                block 
                size="large" 
                className="!bg-white !text-blue-600 !border-gray-300 hover:!border-blue-400 rounded-lg h-12 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Sign in with Facebook
              </Button>
              
              <Button 
                block 
                size="large" 
                className="!bg-white !text-blue-600 !border-gray-300 hover:!border-blue-400 rounded-lg h-12 flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Sign in with Google
              </Button>
            </div> */}

            <div className="text-center mt-6">
              <Text className="text-gray-500">
                Don't have an account?{' '}
                <a href="#" className="text-blue-500 underline">Sign Up</a>
              </Text>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login; 