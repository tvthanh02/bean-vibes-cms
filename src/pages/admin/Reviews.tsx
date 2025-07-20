import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip, Input as AntInput, Row, Col, Card } from 'antd';
import { 
  EyeOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  EyeInvisibleOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getReviews, approveReview, rejectReview, updateReview, deleteReview, toggleVisibleReview } from '../../api/adminReviews';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface Review {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: string;
  visible: boolean;
  submittedBy: string;
  submittedAt: string;
  placeName: string;
}

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    title: 'Cà phê ngon, không gian đẹp',
    content: 'Cà phê rất ngon, không gian thoáng mát, nhân viên phục vụ nhiệt tình. Rất thích không gian ở đây.',
    rating: 5,
    status: 'approved',
    visible: true,
    submittedBy: 'user001',
    submittedAt: '2024-01-15T10:30:00Z',
    placeName: 'Cà phê Trung Nguyên',
  },
  {
    id: '2',
    title: 'Cà phê bình thường',
    content: 'Cà phê được, không gian ổn nhưng hơi ồn ào. Giá cả hợp lý.',
    rating: 3,
    status: 'pending',
    visible: true,
    submittedBy: 'user002',
    submittedAt: '2024-01-20T14:45:00Z',
    placeName: 'Cà phê Highlands',
  },
  {
    id: '3',
    title: 'Không gian làm việc tốt',
    content: 'Không gian yên tĩnh, WiFi ổn định, phù hợp để làm việc. Cà phê cũng ngon.',
    rating: 4,
    status: 'rejected',
    visible: false,
    submittedBy: 'user003',
    submittedAt: '2024-02-01T09:15:00Z',
    placeName: 'Cà phê WorkSpace',
  },
  {
    id: '4',
    title: 'Đắt nhưng chất lượng cao',
    content: 'Cà phê đặc biệt ngon, không gian sang trọng nhưng giá hơi cao. Phù hợp cho cuộc hẹn quan trọng.',
    rating: 5,
    status: 'approved',
    visible: true,
    submittedBy: 'user004',
    submittedAt: '2024-02-10T16:20:00Z',
    placeName: 'Cà phê Premium',
  },
  {
    id: '5',
    title: 'Nhạc sống hay',
    content: 'Có nhạc sống vào cuối tuần, không gian lãng mạn. Cà phê ngon, giá hợp lý.',
    rating: 4,
    status: 'pending',
    visible: true,
    submittedBy: 'user005',
    submittedAt: '2024-02-15T11:30:00Z',
    placeName: 'Cà phê Music',
  },
];

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    rating: '',
    visible: '',
    dateRange: null as any,
  });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredReviews = mockReviews;
      
      // Apply search filter
      if (searchText) {
        filteredReviews = filteredReviews.filter(review => 
          review.title.toLowerCase().includes(searchText.toLowerCase()) ||
          review.content.toLowerCase().includes(searchText.toLowerCase()) ||
          review.placeName.toLowerCase().includes(searchText.toLowerCase()) ||
          review.submittedBy.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredReviews = filteredReviews.filter(review => review.status === filters.status);
      }
      
      // Apply rating filter
      if (filters.rating) {
        filteredReviews = filteredReviews.filter(review => review.rating === parseInt(filters.rating));
      }
      
      // Apply visibility filter
      if (filters.visible) {
        const isVisible = filters.visible === 'true';
        filteredReviews = filteredReviews.filter(review => review.visible === isVisible);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredReviews = filteredReviews.filter(review => {
          const reviewDate = dayjs(review.submittedAt);
          return reviewDate.isAfter(startDate) && reviewDate.isBefore(endDate);
        });
      }
      
      setReviews(filteredReviews);
      setPagination(prev => ({ ...prev, total: filteredReviews.length }));
    } catch (error) {
      showError('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, searchText, filters]);

  const handleEdit = (review: Review) => {
    setEditing(review);
    form.setFieldsValue(review);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa đánh giá thành công');
      fetchData();
    } catch (error) {
      showError('Lỗi khi xóa đánh giá');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Duyệt đánh giá thành công');
      fetchData();
    } catch (error) {
      showError('Lỗi khi duyệt đánh giá');
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Từ chối đánh giá thành công');
      fetchData();
    } catch (error) {
      showError('Lỗi khi từ chối đánh giá');
    }
  };

  const handleToggleVisible = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Cập nhật hiển thị thành công');
      fetchData();
    } catch (error) {
      showError('Lỗi khi cập nhật hiển thị');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!editing) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Cập nhật đánh giá thành công');
      setModalOpen(false);
      fetchData();
    } catch (error) {
      showError('Lỗi khi cập nhật đánh giá');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', rating: '', visible: '', dateRange: null });
    setSearchText('');
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Tooltip title={content}>
          <span>{content.length > 50 ? `${content.substring(0, 50)}...` : content}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => `${rating}/5`,
    },
    {
      title: 'Địa điểm',
      dataIndex: 'placeName',
      key: 'placeName',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'approved' ? 'Đã duyệt' : status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
        </Tag>
      ),
    },
    {
      title: 'Hiển thị',
      dataIndex: 'visible',
      key: 'visible',
      render: (visible: boolean) => (
        <Tag color={visible ? 'green' : 'red'}>
          {visible ? 'Hiển thị' : 'Ẩn'}
        </Tag>
      ),
    },
    {
      title: 'Người đăng',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
    },
    {
      title: 'Ngày đăng',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Review) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="Duyệt đánh giá"
                description={`Bạn có chắc chắn muốn duyệt đánh giá "${record.title}"?`}
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
                okButtonProps={{ type: 'primary' }}
              >
                <Button 
                  type="primary" 
                  icon={<CheckCircleOutlined />}
                >
                  Duyệt
                </Button>
              </Popconfirm>
              
              <Popconfirm
                title="Từ chối đánh giá"
                description={`Bạn có chắc chắn muốn từ chối đánh giá "${record.title}"?`}
                onConfirm={() => handleReject(record.id)}
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
            </>
          )}
          
          <Popconfirm
            title="Cập nhật hiển thị"
            description={`Bạn có chắc chắn muốn ${record.visible ? 'ẩn' : 'hiển thị'} đánh giá "${record.title}"?`}
            onConfirm={() => handleToggleVisible(record.id)}
            okText="Cập nhật"
            cancelText="Hủy"
          >
            <Button 
              icon={record.visible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            >
              {record.visible ? 'Ẩn' : 'Hiển thị'}
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="Xóa đánh giá"
            description={`Bạn có chắc chắn muốn xóa đánh giá "${record.title}"?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button 
              danger 
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
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
            <InfoCircleOutlined />
            Quản lý đánh giá
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm đánh giá..."
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
              <div className="mb-2 text-sm font-medium">Trạng thái:</div>
              <Select
                placeholder="Chọn trạng thái"
                allowClear
                style={{ width: '100%' }}
                value={filters.status}
                onChange={(value) => handleFilterChange('status', value)}
              >
                <Select.Option value="approved">Đã duyệt</Select.Option>
                <Select.Option value="pending">Chờ duyệt</Select.Option>
                <Select.Option value="rejected">Từ chối</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Đánh giá:</div>
              <Select
                placeholder="Chọn đánh giá"
                allowClear
                style={{ width: '100%' }}
                value={filters.rating}
                onChange={(value) => handleFilterChange('rating', value)}
              >
                <Select.Option value="1">1 sao</Select.Option>
                <Select.Option value="2">2 sao</Select.Option>
                <Select.Option value="3">3 sao</Select.Option>
                <Select.Option value="4">4 sao</Select.Option>
                <Select.Option value="5">5 sao</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Hiển thị:</div>
              <Select
                placeholder="Chọn trạng thái hiển thị"
                allowClear
                style={{ width: '100%' }}
                value={filters.visible}
                onChange={(value) => handleFilterChange('visible', value)}
              >
                <Select.Option value="true">Hiển thị</Select.Option>
                <Select.Option value="false">Ẩn</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Ngày đăng:</div>
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
          dataSource={reviews} 
          loading={loading} 
          bordered 
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            onChange: (page, pageSize) => {
              setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 5 }));
            },
          }}
        />

        <Modal
          title="Sửa đánh giá"
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
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true, message: 'Vui lòng chọn đánh giá' }]}
            >
              <Select>
                <Select.Option value={1}>1 sao</Select.Option>
                <Select.Option value={2}>2 sao</Select.Option>
                <Select.Option value={3}>3 sao</Select.Option>
                <Select.Option value={4}>4 sao</Select.Option>
                <Select.Option value={5}>5 sao</Select.Option>
              </Select>
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

export default Reviews; 