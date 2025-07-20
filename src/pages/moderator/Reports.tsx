import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip, Input as AntInput, Row, Col, Card } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getReports, updateReport, deleteReport } from '../../api/moderatorReportPlaces';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  priority: string;
  reportedBy: string;
  reportedAt: string;
  targetType: string;
  targetName: string;
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Nội dung không phù hợp',
    description: 'Bình luận chứa từ ngữ không phù hợp, cần kiểm duyệt',
    type: 'content',
    status: 'pending',
    priority: 'high',
    reportedBy: 'user001',
    reportedAt: '2024-01-15T10:30:00Z',
    targetType: 'comment',
    targetName: 'Bình luận về cà phê',
  },
  {
    id: '2',
    title: 'Thông tin sai lệch',
    description: 'Địa điểm cung cấp thông tin không chính xác về giờ mở cửa',
    type: 'information',
    status: 'resolved',
    priority: 'medium',
    reportedBy: 'user002',
    reportedAt: '2024-01-20T14:45:00Z',
    targetType: 'place',
    targetName: 'Cà phê Highlands',
  },
  {
    id: '3',
    title: 'Spam bình luận',
    description: 'Người dùng spam bình luận quảng cáo không liên quan',
    type: 'spam',
    status: 'pending',
    priority: 'low',
    reportedBy: 'user003',
    reportedAt: '2024-02-01T09:15:00Z',
    targetType: 'comment',
    targetName: 'Bình luận spam',
  },
  {
    id: '4',
    title: 'Hình ảnh không phù hợp',
    description: 'Hình ảnh địa điểm chứa nội dung không phù hợp',
    type: 'content',
    status: 'resolved',
    priority: 'high',
    reportedBy: 'user004',
    reportedAt: '2024-02-10T16:20:00Z',
    targetType: 'place',
    targetName: 'Cà phê Premium',
  },
  {
    id: '5',
    title: 'Đánh giá gian lận',
    description: 'Đánh giá có dấu hiệu gian lận, tạo bởi tài khoản giả',
    type: 'fraud',
    status: 'pending',
    priority: 'high',
    reportedBy: 'user005',
    reportedAt: '2024-02-15T11:30:00Z',
    targetType: 'review',
    targetName: 'Đánh giá gian lận',
  },
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<Report | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredReports = mockReports;
      
      // Apply search filter
      if (searchText) {
        filteredReports = filteredReports.filter(report => 
          report.title.toLowerCase().includes(searchText.toLowerCase()) ||
          report.description.toLowerCase().includes(searchText.toLowerCase()) ||
          report.targetName.toLowerCase().includes(searchText.toLowerCase()) ||
          report.reportedBy.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredReports = filteredReports.filter(report => report.status === filters.status);
      }
      
      // Apply type filter
      if (filters.type) {
        filteredReports = filteredReports.filter(report => report.type === filters.type);
      }
      
      // Apply priority filter
      if (filters.priority) {
        filteredReports = filteredReports.filter(report => report.priority === filters.priority);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredReports = filteredReports.filter(report => {
          const reportDate = dayjs(report.reportedAt);
          return reportDate.isAfter(startDate) && reportDate.isBefore(endDate);
        });
      }
      
      setReports(filteredReports);
    } catch (error) {
      showError('Lỗi khi tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [searchText, filters]);

  const handleEdit = (report: Report) => {
    setEditing(report);
    form.setFieldsValue(report);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa báo cáo thành công');
      fetchReports();
    } catch (error) {
      showError('Lỗi khi xóa báo cáo');
    }
  };

  const handleSubmit = async (values: any) => {
    if (!editing) return;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      showSuccess('Cập nhật báo cáo thành công');
      setModalOpen(false);
      fetchReports();
    } catch (error) {
      showError('Lỗi khi cập nhật báo cáo');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', type: '', priority: '', dateRange: null });
    setSearchText('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'resolved': return 'green';
      case 'rejected': return 'red';
      default: return 'blue';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Tooltip title={description}>
          <span>{description.length > 60 ? `${description.substring(0, 60)}...` : description}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: { [key: string]: string } = {
          'content': 'Nội dung',
          'information': 'Thông tin',
          'spam': 'Spam',
          'fraud': 'Gian lận'
        };
        return typeMap[type] || type;
      },
    },
    {
      title: 'Đối tượng',
      dataIndex: 'targetType',
      key: 'targetType',
      render: (targetType: string) => {
        const targetMap: { [key: string]: string } = {
          'comment': 'Bình luận',
          'place': 'Địa điểm',
          'review': 'Đánh giá'
        };
        return targetMap[targetType] || targetType;
      },
    },
    {
      title: 'Tên đối tượng',
      dataIndex: 'targetName',
      key: 'targetName',
      render: (name: string) => (
        <Tooltip title={name}>
          <span>{name.length > 30 ? `${name.substring(0, 30)}...` : name}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'pending' ? 'Chờ xử lý' : status === 'resolved' ? 'Đã xử lý' : 'Từ chối'}
        </Tag>
      ),
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? 'Cao' : priority === 'medium' ? 'Trung bình' : 'Thấp'}
        </Tag>
      ),
    },
    {
      title: 'Người báo cáo',
      dataIndex: 'reportedBy',
      key: 'reportedBy',
    },
    {
      title: 'Ngày báo cáo',
      dataIndex: 'reportedAt',
      key: 'reportedAt',
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Report) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa báo cáo"
            description={`Bạn có chắc chắn muốn xóa báo cáo "${record.title}"?`}
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
            <ExclamationCircleOutlined />
            Quản lý báo cáo
          </h1>
        </div>

        {/* Search */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm báo cáo..."
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
                <Select.Option value="pending">Chờ xử lý</Select.Option>
                <Select.Option value="resolved">Đã xử lý</Select.Option>
                <Select.Option value="rejected">Từ chối</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Loại báo cáo:</div>
              <Select
                placeholder="Chọn loại báo cáo"
                allowClear
                style={{ width: '100%' }}
                value={filters.type}
                onChange={(value) => handleFilterChange('type', value)}
              >
                <Select.Option value="content">Nội dung</Select.Option>
                <Select.Option value="information">Thông tin</Select.Option>
                <Select.Option value="spam">Spam</Select.Option>
                <Select.Option value="fraud">Gian lận</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Độ ưu tiên:</div>
              <Select
                placeholder="Chọn độ ưu tiên"
                allowClear
                style={{ width: '100%' }}
                value={filters.priority}
                onChange={(value) => handleFilterChange('priority', value)}
              >
                <Select.Option value="high">Cao</Select.Option>
                <Select.Option value="medium">Trung bình</Select.Option>
                <Select.Option value="low">Thấp</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Ngày báo cáo:</div>
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
          dataSource={reports} 
          loading={loading} 
          bordered 
          scroll={{ x: 1400 }}
        />

        <Modal
          title="Sửa báo cáo"
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
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="type"
              label="Loại báo cáo"
              rules={[{ required: true, message: 'Vui lòng chọn loại báo cáo' }]}
            >
              <Select>
                <Select.Option value="content">Nội dung</Select.Option>
                <Select.Option value="information">Thông tin</Select.Option>
                <Select.Option value="spam">Spam</Select.Option>
                <Select.Option value="fraud">Gian lận</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="pending">Chờ xử lý</Select.Option>
                <Select.Option value="resolved">Đã xử lý</Select.Option>
                <Select.Option value="rejected">Từ chối</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[{ required: true, message: 'Vui lòng chọn độ ưu tiên' }]}
            >
              <Select>
                <Select.Option value="high">Cao</Select.Option>
                <Select.Option value="medium">Trung bình</Select.Option>
                <Select.Option value="low">Thấp</Select.Option>
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

export default Reports; 