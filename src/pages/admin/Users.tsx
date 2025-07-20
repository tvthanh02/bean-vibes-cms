import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message, Space, Popconfirm, Input as AntInput, Select, DatePicker, Row, Col, Card } from 'antd';
import { 
  EditOutlined, 
  UserDeleteOutlined,
  UserOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getAdminUsers, updateAdminUser, removeModerator } from '../../api/adminUsers';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin001',
    email: 'admin001@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'moderator001',
    email: 'moderator001@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '3',
    username: 'moderator002',
    email: 'moderator002@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '4',
    username: 'admin002',
    email: 'admin002@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2024-02-10T16:20:00Z',
  },
  {
    id: '5',
    username: 'moderator003',
    email: 'moderator003@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2024-02-15T11:30:00Z',
  },
];

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredUsers = mockUsers;
      
      // Apply search filter
      if (searchText) {
        filteredUsers = filteredUsers.filter(user => 
          user.username.toLowerCase().includes(searchText.toLowerCase()) ||
          user.email.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply role filter
      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }
      
      // Apply status filter
      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredUsers = filteredUsers.filter(user => {
          const userDate = dayjs(user.createdAt);
          return userDate.isAfter(startDate) && userDate.isBefore(endDate);
        });
      }
      
      setUsers(filteredUsers);
    } catch (error) {
      showError('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText, filters]);

  const handleEdit = (user: User) => {
    setEditing(user);
    form.setFieldsValue(user);
    setModalOpen(true);
  };

  const handleRemoveModerator = async (userId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Đã thu hồi quyền moderator');
      fetchUsers();
    } catch (error) {
      showError('Lỗi khi thu hồi quyền');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!editing) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Cập nhật thành công');
      setModalOpen(false);
      fetchUsers();
    } catch (error) {
      showError('Lỗi khi cập nhật');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ role: '', status: '', dateRange: null });
    setSearchText('');
  };

  const columns = [
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'Moderator'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          {record.role === 'moderator' && (
            <Popconfirm
              title="Thu hồi quyền moderator"
              description={`Bạn có chắc chắn muốn thu hồi quyền moderator của "${record.username}"?`}
              onConfirm={() => handleRemoveModerator(record.id)}
              okText="Thu hồi"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button 
                danger 
                icon={<UserDeleteOutlined />}
              >
                Thu hồi quyền
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserOutlined />
            Quản lý người dùng
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm người dùng..."
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>

        {/* Advanced Filters */}
        <Card 
          size="small" 
          className="mb-4"
          title={
            <span className="flex items-center gap-2">
              <FilterOutlined />
              Bộ lọc nâng cao
            </span>
          }
        >
          <Row gutter={16}>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Vai trò:</div>
              <Select
                placeholder="Chọn vai trò"
                allowClear
                style={{ width: '100%' }}
                value={filters.role}
                onChange={(value) => handleFilterChange('role', value)}
              >
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="moderator">Moderator</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Trạng thái:</div>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
              </Select>
            </Col>
            <Col span={8}>
              <div className="mb-2 text-sm font-medium">Ngày tạo:</div>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={(dates) => handleFilterChange('dateRange', dates)}
                format="DD/MM/YYYY"
              />
            </Col>
            <Col span={4} className="flex items-end">
              <Button onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>

        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={users} 
          loading={loading} 
          bordered 
          scroll={{ x: 800 }}
        />

        <Modal
          title="Sửa thông tin người dùng"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
          >
            <Form.Item
              name="username"
              label="Tên đăng nhập"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  Cập nhật
                </Button>
                <Button onClick={() => setModalOpen(false)}>
                  Hủy
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default Users; 