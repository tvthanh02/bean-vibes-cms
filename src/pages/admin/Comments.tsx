import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip, Input as AntInput, Row, Col, Card } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined,
  MessageOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getComments, updateComment, deleteComment } from '../../api/comments';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface Comment {
  id: string;
  content: string;
  status: string;
  visible: boolean;
  submittedBy: string;
  submittedAt: string;
  placeName: string;
  reviewTitle: string;
}

// Mock data
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Cà phê ở đây rất ngon, không gian đẹp và nhân viên phục vụ nhiệt tình. Rất thích không gian ở đây.',
    status: 'approved',
    visible: true,
    submittedBy: 'user001',
    submittedAt: '2024-01-15T10:30:00Z',
    placeName: 'Cà phê Trung Nguyên',
    reviewTitle: 'Cà phê ngon, không gian đẹp',
  },
  {
    id: '2',
    content: 'Cà phê được, không gian ổn nhưng hơi ồn ào. Giá cả hợp lý.',
    status: 'pending',
    visible: true,
    submittedBy: 'user002',
    submittedAt: '2024-01-20T14:45:00Z',
    placeName: 'Cà phê Highlands',
    reviewTitle: 'Cà phê bình thường',
  },
  {
    id: '3',
    content: 'Không gian yên tĩnh, WiFi ổn định, phù hợp để làm việc. Cà phê cũng ngon.',
    status: 'rejected',
    visible: false,
    submittedBy: 'user003',
    submittedAt: '2024-02-01T09:15:00Z',
    placeName: 'Cà phê WorkSpace',
    reviewTitle: 'Không gian làm việc tốt',
  },
  {
    id: '4',
    content: 'Cà phê đặc biệt ngon, không gian sang trọng nhưng giá hơi cao. Phù hợp cho cuộc hẹn quan trọng.',
    status: 'approved',
    visible: true,
    submittedBy: 'user004',
    submittedAt: '2024-02-10T16:20:00Z',
    placeName: 'Cà phê Premium',
    reviewTitle: 'Đắt nhưng chất lượng cao',
  },
  {
    id: '5',
    content: 'Có nhạc sống vào cuối tuần, không gian lãng mạn. Cà phê ngon, giá hợp lý.',
    status: 'pending',
    visible: true,
    submittedBy: 'user005',
    submittedAt: '2024-02-15T11:30:00Z',
    placeName: 'Cà phê Music',
    reviewTitle: 'Nhạc sống hay',
  },
];

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Comment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    visible: '',
    place: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchComments = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredComments = mockComments;
      
      // Apply search filter
      if (searchText) {
        filteredComments = filteredComments.filter(comment => 
          comment.content.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.placeName.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.reviewTitle.toLowerCase().includes(searchText.toLowerCase()) ||
          comment.submittedBy.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredComments = filteredComments.filter(comment => comment.status === filters.status);
      }
      
      // Apply visibility filter
      if (filters.visible) {
        const isVisible = filters.visible === 'true';
        filteredComments = filteredComments.filter(comment => comment.visible === isVisible);
      }
      
      // Apply place filter
      if (filters.place) {
        filteredComments = filteredComments.filter(comment => comment.placeName === filters.place);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredComments = filteredComments.filter(comment => {
          const commentDate = dayjs(comment.submittedAt);
          return commentDate.isAfter(startDate) && commentDate.isBefore(endDate);
        });
      }
      
      setComments(filteredComments);
    } catch (error) {
      showError('Lỗi khi tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [searchText, filters]);

  const handleEdit = (comment: Comment) => {
    setEditing(comment);
    form.setFieldsValue(comment);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa bình luận thành công');
      fetchComments();
    } catch (error) {
      showError('Lỗi khi xóa bình luận');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!editing) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Cập nhật bình luận thành công');
      setModalOpen(false);
      fetchComments();
    } catch (error) {
      showError('Lỗi khi cập nhật bình luận');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', visible: '', place: '', dateRange: null });
    setSearchText('');
  };

  const columns = [
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <Tooltip title={content}>
          <span>{content.length > 80 ? `${content.substring(0, 80)}...` : content}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Địa điểm',
      dataIndex: 'placeName',
      key: 'placeName',
    },
    {
      title: 'Đánh giá',
      dataIndex: 'reviewTitle',
      key: 'reviewTitle',
      render: (title: string) => (
        <Tooltip title={title}>
          <span>{title.length > 30 ? `${title.substring(0, 30)}...` : title}</span>
        </Tooltip>
      ),
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
      title: 'Người bình luận',
      dataIndex: 'submittedBy',
      key: 'submittedBy',
    },
    {
      title: 'Ngày bình luận',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Comment) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa bình luận"
            description={`Bạn có chắc chắn muốn xóa bình luận này?`}
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
            <MessageOutlined />
            Quản lý bình luận
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm bình luận..."
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
              <div className="mb-2 text-sm font-medium">Địa điểm:</div>
              <Select
                placeholder="Chọn địa điểm"
                allowClear
                style={{ width: '100%' }}
                value={filters.place}
                onChange={(value) => handleFilterChange('place', value)}
              >
                <Select.Option value="Cà phê Trung Nguyên">Cà phê Trung Nguyên</Select.Option>
                <Select.Option value="Cà phê Highlands">Cà phê Highlands</Select.Option>
                <Select.Option value="Cà phê WorkSpace">Cà phê WorkSpace</Select.Option>
                <Select.Option value="Cà phê Premium">Cà phê Premium</Select.Option>
                <Select.Option value="Cà phê Music">Cà phê Music</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Ngày bình luận:</div>
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
          dataSource={comments} 
          loading={loading} 
          bordered 
          scroll={{ x: 1200 }}
        />

        <Modal
          title="Sửa bình luận"
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
              name="content"
              label="Nội dung"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="approved">Đã duyệt</Select.Option>
                <Select.Option value="pending">Chờ duyệt</Select.Option>
                <Select.Option value="rejected">Từ chối</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="visible"
              label="Hiển thị"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái hiển thị' }]}
            >
              <Select>
                <Select.Option value={true}>Hiển thị</Select.Option>
                <Select.Option value={false}>Ẩn</Select.Option>
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

export default Comments; 