import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip, Input as AntInput, Row, Col, Card } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  EnvironmentOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { getPlaces, addPlace, updatePlace, deletePlace } from '../../api/adminPlaces';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

interface Place {
  id: string;
  name: string;
  address: string;
  description: string;
  status: string;
  region: string;
  style: string;
  createdAt: string;
  owner: string;
}

// Mock data
const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Cà phê Trung Nguyên',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    description: 'Cà phê truyền thống Việt Nam với không gian thoáng mát',
    status: 'active',
    region: 'Quận 1',
    style: 'Cà phê truyền thống',
    createdAt: '2024-01-15T10:30:00Z',
    owner: 'owner001',
  },
  {
    id: '2',
    name: 'Cà phê Highlands',
    address: '456 Lê Lợi, Quận 3, TP.HCM',
    description: 'Cà phê hiện đại với menu đa dạng',
    status: 'active',
    region: 'Quận 3',
    style: 'Cà phê hiện đại',
    createdAt: '2024-01-20T14:45:00Z',
    owner: 'owner002',
  },
  {
    id: '3',
    name: 'Cà phê WorkSpace',
    address: '789 Võ Văn Tần, Quận 3, TP.HCM',
    description: 'Không gian làm việc yên tĩnh với WiFi miễn phí',
    status: 'inactive',
    region: 'Quận 3',
    style: 'Cà phê hiện đại',
    createdAt: '2024-02-01T09:15:00Z',
    owner: 'owner003',
  },
  {
    id: '4',
    name: 'Cà phê Premium',
    address: '321 Đồng Khởi, Quận 1, TP.HCM',
    description: 'Cà phê cao cấp với không gian sang trọng',
    status: 'active',
    region: 'Quận 1',
    style: 'Cà phê specialty',
    createdAt: '2024-02-10T16:20:00Z',
    owner: 'owner004',
  },
  {
    id: '5',
    name: 'Cà phê Music',
    address: '654 Nguyễn Thị Minh Khai, Quận 1, TP.HCM',
    description: 'Cà phê với nhạc sống vào cuối tuần',
    status: 'active',
    region: 'Quận 1',
    style: 'Cà phê fusion',
    createdAt: '2024-02-15T11:30:00Z',
    owner: 'owner005',
  },
];

const Places: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Place | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    region: '',
    style: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const fetchPlaces = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredPlaces = mockPlaces;
      
      // Apply search filter
      if (searchText) {
        filteredPlaces = filteredPlaces.filter(place => 
          place.name.toLowerCase().includes(searchText.toLowerCase()) ||
          place.address.toLowerCase().includes(searchText.toLowerCase()) ||
          place.description.toLowerCase().includes(searchText.toLowerCase()) ||
          place.owner.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredPlaces = filteredPlaces.filter(place => place.status === filters.status);
      }
      
      // Apply region filter
      if (filters.region) {
        filteredPlaces = filteredPlaces.filter(place => place.region === filters.region);
      }
      
      // Apply style filter
      if (filters.style) {
        filteredPlaces = filteredPlaces.filter(place => place.style === filters.style);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredPlaces = filteredPlaces.filter(place => {
          const placeDate = dayjs(place.createdAt);
          return placeDate.isAfter(startDate) && placeDate.isBefore(endDate);
        });
      }
      
      setPlaces(filteredPlaces);
    } catch (error) {
      showError('Lỗi khi tải danh sách địa điểm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [searchText, filters]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (place: Place) => {
    setEditing(place);
    form.setFieldsValue(place);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa địa điểm thành công');
      fetchPlaces();
    } catch (error) {
      showError('Lỗi khi xóa địa điểm');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editing) {
        showSuccess('Cập nhật địa điểm thành công');
      } else {
        showSuccess('Thêm địa điểm thành công');
      }
      setModalOpen(false);
      fetchPlaces();
    } catch (error) {
      showError('Lỗi khi lưu địa điểm');
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', region: '', style: '', dateRange: null });
    setSearchText('');
  };

  const columns = [
    {
      title: 'Tên địa điểm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      render: (address: string) => (
        <Tooltip title={address}>
          <span>{address.length > 50 ? `${address.substring(0, 50)}...` : address}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (description: string) => (
        <Tooltip title={description}>
          <span>{description.length > 50 ? `${description.substring(0, 50)}...` : description}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Khu vực',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: 'Phong cách',
      dataIndex: 'style',
      key: 'style',
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
      title: 'Chủ sở hữu',
      dataIndex: 'owner',
      key: 'owner',
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
      render: (_: any, record: Place) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa địa điểm"
            description={`Bạn có chắc chắn muốn xóa "${record.name}"?`}
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
            <EnvironmentOutlined />
            Quản lý địa điểm
          </h1>
        </div>

        {/* Search and Add Button */}
        <div className="flex justify-between items-center mb-4">
          <Search
            placeholder="Tìm kiếm địa điểm..."
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
            Thêm địa điểm
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
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Khu vực:</div>
              <Select
                placeholder="Chọn khu vực"
                allowClear
                style={{ width: '100%' }}
                value={filters.region}
                onChange={(value) => handleFilterChange('region', value)}
              >
                <Select.Option value="Quận 1">Quận 1</Select.Option>
                <Select.Option value="Quận 2">Quận 2</Select.Option>
                <Select.Option value="Quận 3">Quận 3</Select.Option>
                <Select.Option value="Quận 7">Quận 7</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
              <div className="mb-2 text-sm font-medium">Phong cách:</div>
              <Select
                placeholder="Chọn phong cách"
                allowClear
                style={{ width: '100%' }}
                value={filters.style}
                onChange={(value) => handleFilterChange('style', value)}
              >
                <Select.Option value="Cà phê truyền thống">Cà phê truyền thống</Select.Option>
                <Select.Option value="Cà phê hiện đại">Cà phê hiện đại</Select.Option>
                <Select.Option value="Cà phê fusion">Cà phê fusion</Select.Option>
                <Select.Option value="Cà phê specialty">Cà phê specialty</Select.Option>
              </Select>
            </Col>
            <Col span={6}>
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
          dataSource={places} 
          loading={loading} 
          bordered 
          scroll={{ x: 1200 }}
        />

        <Modal
          title={editing ? 'Sửa địa điểm' : 'Thêm địa điểm'}
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
              name="name"
              label="Tên địa điểm"
              rules={[{ required: true, message: 'Vui lòng nhập tên địa điểm' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Địa chỉ"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item
              name="region"
              label="Khu vực"
              rules={[{ required: true, message: 'Vui lòng chọn khu vực' }]}
            >
              <Select>
                <Select.Option value="Quận 1">Quận 1</Select.Option>
                <Select.Option value="Quận 2">Quận 2</Select.Option>
                <Select.Option value="Quận 3">Quận 3</Select.Option>
                <Select.Option value="Quận 7">Quận 7</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="style"
              label="Phong cách"
              rules={[{ required: true, message: 'Vui lòng chọn phong cách' }]}
            >
              <Select>
                <Select.Option value="Cà phê truyền thống">Cà phê truyền thống</Select.Option>
                <Select.Option value="Cà phê hiện đại">Cà phê hiện đại</Select.Option>
                <Select.Option value="Cà phê fusion">Cà phê fusion</Select.Option>
                <Select.Option value="Cà phê specialty">Cà phê specialty</Select.Option>
              </Select>
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

export default Places; 