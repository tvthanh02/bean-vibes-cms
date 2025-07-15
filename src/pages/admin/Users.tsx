import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message, Space } from 'antd';
import { getAdminUsers, updateAdminUser, removeModerator } from '../../api/adminUsers';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isModerator: boolean;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAdminUsers();
      setUsers(res.data);
    } catch (err) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
    form.setFieldsValue(user);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateAdminUser(editingUser!.id, values);
      message.success('Cập nhật thành công!');
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      message.error('Cập nhật thất bại');
    }
  };

  const handleRemoveModerator = async (user: User) => {
    try {
      await removeModerator(user.id);
      message.success('Đã gỡ quyền kiểm duyệt viên!');
      fetchUsers();
    } catch (err) {
      message.error('Thao tác thất bại');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: (role: string) => <Tag color={role === 'admin' ? 'red' : 'blue'}>{role}</Tag> },
    { title: 'Kiểm duyệt viên', dataIndex: 'isModerator', key: 'isModerator', render: (is: boolean) => is ? <Tag color="green">Có</Tag> : <Tag color="gray">Không</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, user: User) => (
        <Space>
          <Button onClick={() => handleEdit(user)} type="link">Sửa</Button>
          {user.isModerator && (
            <Button danger onClick={() => handleRemoveModerator(user)} type="link">Gỡ quyền kiểm duyệt</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={users} loading={loading} bordered />
      <Modal
        title="Cập nhật người dùng"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}> <Input /> </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users; 