import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Popconfirm, message, DatePicker, Input as AntInput, Row, Col, Card, Select } from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserAddOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getModeratorRequests, approveModeratorRequest, rejectModeratorRequest } from '../../api/adminModeratorRequests';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface Request {
  id: string;
  username: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  reason: string;
  submittedAt: string;
}

// Mock data
const mockRequests: Request[] = [
  {
    id: '1',
    username: 'moderator001',
    email: 'moderator001@example.com',
    status: 'pending',
    reason: 'Có kinh nghiệm quản lý cộng đồng và muốn đóng góp cho hệ thống',
    submittedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    username: 'moderator002',
    email: 'moderator002@example.com',
    status: 'approved',
    reason: 'Chuyên gia về cà phê, có kiến thức sâu rộng về ngành',
    submittedAt: '2024-01-20T14:45:00Z',
  },
  {
    id: '3',
    username: 'moderator003',
    email: 'moderator003@example.com',
    status: 'rejected',
    reason: 'Muốn tham gia để quảng cáo dịch vụ cá nhân',
    submittedAt: '2024-02-01T09:15:00Z',
  },
  {
    id: '4',
    username: 'moderator004',
    email: 'moderator004@example.com',
    status: 'pending',
    reason: 'Có kinh nghiệm làm moderator cho các trang web khác',
    submittedAt: '2024-02-10T16:20:00Z',
  },
  {
    id: '5',
    username: 'moderator005',
    email: 'moderator005@example.com',
    status: 'approved',
    reason: 'Chủ quán cà phê, muốn đóng góp kiến thức chuyên môn',
    submittedAt: '2024-02-15T11:30:00Z',
  },
];

const ModeratorRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null as any,
  });
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredRequests = mockRequests;
      
      // Apply search filter
      if (searchText) {
        filteredRequests = filteredRequests.filter(request => 
          request.username.toLowerCase().includes(searchText.toLowerCase()) ||
          request.email.toLowerCase().includes(searchText.toLowerCase()) ||
          request.reason.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredRequests = filteredRequests.filter(request => request.status === filters.status);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredRequests = filteredRequests.filter(request => {
          const requestDate = dayjs(request.submittedAt);
          return requestDate.isAfter(startDate) && requestDate.isBefore(endDate);
        });
      }
      
      setRequests(filteredRequests);
    } catch (error) {
      showError('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [searchText, filters]);

  const handleApprove = async (id: string, username: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess(`Đã phê duyệt yêu cầu của ${username}!`);
      fetchRequests();
    } catch (error) {
      showError('Lỗi khi phê duyệt yêu cầu');
    }
  };

  const handleReject = async (id: string, username: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess(`Đã từ chối yêu cầu của ${username}!`);
      fetchRequests();
    } catch (error) {
      showError('Lỗi khi từ chối yêu cầu');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', dateRange: null });
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
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason: string) => (
        <span>{reason.length > 50 ? `${reason.substring(0, 50)}...` : reason}</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'pending') return <Tag color="blue">Đang chờ</Tag>;
        if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
        return <Tag color="red">Bị từ chối</Tag>;
      },
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, req: Request) => req.status === 'pending' ? (
        <Space>
          <Popconfirm
            title="Phê duyệt yêu cầu"
            description={`Bạn có chắc chắn muốn phê duyệt yêu cầu của "${req.username}"?`}
            onConfirm={() => handleApprove(req.id, req.username)}
            okText="Phê duyệt"
            cancelText="Hủy"
            okButtonProps={{ type: 'primary' }}
          >
            <Button 
              type="primary" 
              icon={<CheckCircleOutlined />}
            >
              Phê duyệt
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Từ chối yêu cầu"
            description={`Bạn có chắc chắn muốn từ chối yêu cầu của "${req.username}"?`}
            onConfirm={() => handleReject(req.id, req.username)}
            okText="Từ chối"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<CloseCircleOutlined />}
            >
              Từ chối
            </Button>
          </Popconfirm>
        </Space>
      ) : null,
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="p-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <UserAddOutlined />
            Quản lý yêu cầu moderator
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm yêu cầu..."
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
            <Col span={12}>
              <div className="mb-2 text-sm font-medium">Trạng thái:</div>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Select.Option value="pending">Đang chờ</Select.Option>
                <Select.Option value="approved">Đã duyệt</Select.Option>
                <Select.Option value="rejected">Bị từ chối</Select.Option>
              </Select>
            </Col>
            <Col span={12}>
              <div className="mb-2 text-sm font-medium">Ngày gửi:</div>
              <RangePicker
                style={{ width: '100%' }}
                value={filters.dateRange}
                onChange={(dates) => handleFilterChange('dateRange', dates)}
                format="DD/MM/YYYY"
              />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Button onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card>

        <Table 
          rowKey="id" 
          columns={columns} 
          dataSource={requests} 
          loading={loading} 
          bordered 
          scroll={{ x: 1000 }}
        />
      </div>
    </>
  );
};

export default ModeratorRequests; 