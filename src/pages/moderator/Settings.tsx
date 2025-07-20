import React, { useState } from 'react';
import { Card, Form, Input, Button, Modal, message, Avatar, Divider, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuthUser } from '../../hooks/useAuthUser';
import { adminLogout } from '../../api/adminAuth';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleChangePassword = async (values: any) => {
    setLoading(true);
    try {
      // TODO: Implement change password API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      message.success('Đổi mật khẩu thành công!');
      setChangePasswordVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Đổi mật khẩu thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await adminLogout();
      message.success('Đăng xuất thành công!');
      navigate('/admin/login');
    } catch (error) {
      message.error('Đăng xuất thất bại!');
    } finally {
      setLoading(false);
      setLogoutVisible(false);
    }
  };

  const showLogoutConfirm = () => {
    setLogoutVisible(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2} className="mb-6">Cài đặt tài khoản</Title>
      
      {/* Profile Section */}
      <Card className="mb-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <Avatar size={64} icon={<UserOutlined />} style={{ backgroundColor: '#4b5563' }} />
          <div>
            <Title level={4} className="mb-1">{user?.username}</Title>
            <Text type="secondary">Kiểm duyệt viên hệ thống</Text>
          </div>
        </div>
        
        <Divider />
        
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <SafetyOutlined className="text-blue-500 text-xl" />
              <div>
                <Text strong>Đổi mật khẩu</Text>
                <br />
                <Text type="secondary">Cập nhật mật khẩu tài khoản của bạn</Text>
              </div>
            </div>
            <Button 
              type="primary" 
              onClick={() => setChangePasswordVisible(true)}
              icon={<LockOutlined />}
            >
              Đổi mật khẩu
            </Button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <LogoutOutlined className="text-red-500 text-xl" />
              <div>
                <Text strong>Đăng xuất</Text>
                <br />
                <Text type="secondary">Thoát khỏi hệ thống</Text>
              </div>
            </div>
            <Button 
              danger 
              onClick={showLogoutConfirm}
              icon={<LogoutOutlined />}
            >
              Đăng xuất
            </Button>
          </div>
        </Space>
      </Card>
      
      {/* Change Password Modal */}
      <Modal
        title="Đổi mật khẩu"
        open={changePasswordVisible}
        onCancel={() => setChangePasswordVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu hiện tại" />
          </Form.Item>
          
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
          </Form.Item>
          
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          
          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setChangePasswordVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" loading={loading}>
                Đổi mật khẩu
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* Logout Confirm Modal */}
      <Modal
        title="Xác nhận đăng xuất"
        open={logoutVisible}
        onCancel={() => setLogoutVisible(false)}
        onOk={handleLogout}
        okText="Đăng xuất"
        cancelText="Hủy"
        confirmLoading={loading}
      >
        <p>Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
      </Modal>
    </div>
  );
};

export default Settings; 