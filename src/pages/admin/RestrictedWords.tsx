import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Input as AntInput, Row, Col, Card } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  StopOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getRestrictedWords, addRestrictedWord, updateRestrictedWord, deleteRestrictedWord } from '../../api/adminRestrictedWords';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface RestrictedWord {
  id: string;
  word: string;
  category: string;
  status: string;
  reason: string;
  createdAt: string;
  createdBy: string;
}

// Mock data
const mockRestrictedWords: RestrictedWord[] = [
  {
    id: '1',
    word: 'spam',
    category: 'spam',
    status: 'active',
    reason: 'Từ khóa spam, quảng cáo không mong muốn',
    createdAt: '2024-01-15T10:30:00Z',
    createdBy: 'admin001',
  },
  {
    id: '2',
    word: 'quảng cáo',
    category: 'advertising',
    status: 'active',
    reason: 'Từ khóa quảng cáo không được phép',
    createdAt: '2024-01-20T14:45:00Z',
    createdBy: 'admin001',
  },
  {
    id: '3',
    word: 'lừa đảo',
    category: 'fraud',
    status: 'inactive',
    reason: 'Từ khóa liên quan đến lừa đảo',
    createdAt: '2024-02-01T09:15:00Z',
    createdBy: 'admin002',
  },
  {
    id: '4',
    word: 'bạo lực',
    category: 'violence',
    status: 'active',
    reason: 'Từ khóa liên quan đến bạo lực',
    createdAt: '2024-02-10T16:20:00Z',
    createdBy: 'admin001',
  },
  {
    id: '5',
    word: 'khiêu dâm',
    category: 'adult',
    status: 'active',
    reason: 'Nội dung không phù hợp',
    createdAt: '2024-02-15T11:30:00Z',
    createdBy: 'admin002',
  },
];

const RestrictedWords: React.FC = () => {
  const [restrictedWords, setRestrictedWords] = useState<RestrictedWord[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RestrictedWord | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchRestrictedWords = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredWords = mockRestrictedWords;
      
      // Apply search filter
      if (searchText) {
        filteredWords = filteredWords.filter(word => 
          word.word.toLowerCase().includes(searchText.toLowerCase()) ||
          word.reason.toLowerCase().includes(searchText.toLowerCase()) ||
          word.createdBy.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredWords = filteredWords.filter(word => word.status === filters.status);
      }
      
      // Apply category filter
      if (filters.category) {
        filteredWords = filteredWords.filter(word => word.category === filters.category);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredWords = filteredWords.filter(word => {
          const wordDate = dayjs(word.createdAt);
          return wordDate.isAfter(startDate) && wordDate.isBefore(endDate);
        });
      }
      
      setRestrictedWords(filteredWords);
    } catch (error) {
      showError('Lỗi khi tải danh sách từ khóa bị cấm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestrictedWords();
  }, [searchText, filters]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (word: RestrictedWord) => {
    setEditing(word);
    form.setFieldsValue(word);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa từ khóa thành công');
      fetchRestrictedWords();
    } catch (error) {
      showError('Lỗi khi xóa từ khóa');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editing) {
        showSuccess('Cập nhật từ khóa thành công');
      } else {
        showSuccess('Thêm từ khóa thành công');
      }
      setModalOpen(false);
      fetchRestrictedWords();
    } catch (error) {
      showError('Lỗi khi lưu từ khóa');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', category: '', dateRange: null });
    setSearchText('');
  };

  const columns = [
    {
      title: 'Từ khóa',
      dataIndex: 'word',
      key: 'word',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => {
        const categoryMap: { [key: string]: string } = {
          'spam': 'Spam',
          'advertising': 'Quảng cáo',
          'fraud': 'Lừa đảo',
          'violence': 'Bạo lực',
          'adult': 'Nội dung người lớn'
        };
        return categoryMap[category] || category;
      },
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'red' : 'gray'}>
          {status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
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
      render: (_: any, record: RestrictedWord) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa từ khóa"
            description={`Bạn có chắc chắn muốn xóa từ khóa "${record.word}"?`}
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
            <StopOutlined />
            Quản lý từ khóa bị cấm
          </h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm từ khóa..."
            allowClear
            style={{ width: 300 }}
            onSearch={(value) => setSearchText(value)}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm từ khóa
          </Button>
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
            <Col span={8}>
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
              <div className="mb-2 text-sm font-medium">Danh mục:</div>
              <Select
                placeholder="Chọn danh mục"
                allowClear
                style={{ width: '100%' }}
                value={filters.category}
                onChange={(value) => handleFilterChange('category', value)}
              >
                <Select.Option value="spam">Spam</Select.Option>
                <Select.Option value="advertising">Quảng cáo</Select.Option>
                <Select.Option value="fraud">Lừa đảo</Select.Option>
                <Select.Option value="violence">Bạo lực</Select.Option>
                <Select.Option value="adult">Nội dung người lớn</Select.Option>
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
          dataSource={restrictedWords} 
          loading={loading} 
          bordered 
          scroll={{ x: 1000 }}
        />

        <Modal
          title={editing ? 'Sửa từ khóa' : 'Thêm từ khóa'}
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
              name="word"
              label="Từ khóa"
              rules={[{ required: true, message: 'Vui lòng nhập từ khóa' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
            >
              <Select>
                <Select.Option value="spam">Spam</Select.Option>
                <Select.Option value="advertising">Quảng cáo</Select.Option>
                <Select.Option value="fraud">Lừa đảo</Select.Option>
                <Select.Option value="violence">Bạo lực</Select.Option>
                <Select.Option value="adult">Nội dung người lớn</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="reason"
              label="Lý do"
              rules={[{ required: true, message: 'Vui lòng nhập lý do' }]}
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {editing ? 'Cập nhật' : 'Thêm'}
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

export default RestrictedWords; 