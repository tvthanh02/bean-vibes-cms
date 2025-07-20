import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Space, Popconfirm, message, Input as AntInput, Select, DatePicker, Row, Col, Card, Tag } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlusOutlined,
  AppstoreOutlined,
  SearchOutlined,
  FilterOutlined
} from '@ant-design/icons';
import {
  getRegions, addRegion, updateRegion, deleteRegion,
  getStyles, addStyle, updateStyle, deleteStyle,
  getServices, addService, updateService, deleteService,
  getPurposes, addPurpose, updatePurpose, deletePurpose
} from '../../api/adminCategories';
import { useToast } from '../../hooks/useToast';
import dayjs from 'dayjs';

const { Search } = AntInput;
const { RangePicker } = DatePicker;

// Mock data
const mockRegions = [
  { id: '1', name: 'Quận 1', description: 'Khu vực trung tâm thành phố', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Quận 2', description: 'Khu vực phía Đông', status: 'active', createdAt: '2024-01-20T14:45:00Z' },
  { id: '3', name: 'Quận 3', description: 'Khu vực dân cư', status: 'inactive', createdAt: '2024-02-01T09:15:00Z' },
  { id: '4', name: 'Quận 7', description: 'Khu vực phát triển mới', status: 'active', createdAt: '2024-02-10T16:20:00Z' },
];

const mockStyles = [
  { id: '1', name: 'Cà phê truyền thống', description: 'Phong cách cà phê Việt Nam', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Cà phê hiện đại', description: 'Phong cách cà phê phương Tây', status: 'active', createdAt: '2024-01-20T14:45:00Z' },
  { id: '3', name: 'Cà phê fusion', description: 'Kết hợp nhiều phong cách', status: 'inactive', createdAt: '2024-02-01T09:15:00Z' },
  { id: '4', name: 'Cà phê specialty', description: 'Cà phê đặc biệt cao cấp', status: 'active', createdAt: '2024-02-10T16:20:00Z' },
];

const mockServices = [
  { id: '1', name: 'WiFi miễn phí', description: 'Kết nối internet không dây', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Chỗ đậu xe', description: 'Bãi đậu xe an toàn', status: 'active', createdAt: '2024-01-20T14:45:00Z' },
  { id: '3', name: 'Phòng riêng', description: 'Không gian làm việc riêng tư', status: 'inactive', createdAt: '2024-02-01T09:15:00Z' },
  { id: '4', name: 'Nhạc sống', description: 'Biểu diễn âm nhạc trực tiếp', status: 'active', createdAt: '2024-02-10T16:20:00Z' },
];

const mockPurposes = [
  { id: '1', name: 'Làm việc', description: 'Không gian làm việc yên tĩnh', status: 'active', createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', name: 'Hẹn hò', description: 'Địa điểm lãng mạn', status: 'active', createdAt: '2024-01-20T14:45:00Z' },
  { id: '3', name: 'Gặp gỡ bạn bè', description: 'Nơi tụ tập bạn bè', status: 'inactive', createdAt: '2024-02-01T09:15:00Z' },
  { id: '4', name: 'Đọc sách', description: 'Không gian yên tĩnh để đọc', status: 'active', createdAt: '2024-02-10T16:20:00Z' },
];

const Categories: React.FC = () => {
  const [activeKey, setActiveKey] = useState('regions');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    dateRange: null as any,
  });
  const [form] = Form.useForm();
  const { showSuccess, showError, contextHolder } = useToast();

  const categoryConfigs = [
    {
      key: 'regions',
      label: 'Khu vực',
      fetchFunction: getRegions,
      addFunction: addRegion,
      updateFunction: updateRegion,
      deleteFunction: deleteRegion,
      mockData: mockRegions,
    },
    {
      key: 'styles',
      label: 'Phong cách',
      fetchFunction: getStyles,
      addFunction: addStyle,
      updateFunction: updateStyle,
      deleteFunction: deleteStyle,
      mockData: mockStyles,
    },
    {
      key: 'services',
      label: 'Dịch vụ',
      fetchFunction: getServices,
      addFunction: addService,
      updateFunction: updateService,
      deleteFunction: deleteService,
      mockData: mockServices,
    },
    {
      key: 'purposes',
      label: 'Mục đích',
      fetchFunction: getPurposes,
      addFunction: addPurpose,
      updateFunction: updatePurpose,
      deleteFunction: deletePurpose,
      mockData: mockPurposes,
    },
  ];

  const config = categoryConfigs.find(c => c.key === activeKey)!;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Use mock data for now
      let filteredData = config.mockData;
      
      // Apply search filter
      if (searchText) {
        filteredData = filteredData.filter(item => 
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.description.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      // Apply status filter
      if (filters.status) {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      
      // Apply date range filter
      if (filters.dateRange && filters.dateRange.length === 2) {
        const [startDate, endDate] = filters.dateRange;
        filteredData = filteredData.filter(item => {
          const itemDate = dayjs(item.createdAt);
          return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
        });
      }
      
      setData(filteredData);
    } catch (error) {
      showError('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeKey, searchText, filters]);

  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      showSuccess('Xóa thành công');
      fetchData();
    } catch (error) {
      showError('Lỗi khi xóa');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editing) {
        showSuccess('Cập nhật thành công');
      } else {
        showSuccess('Thêm thành công');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      showError('Lỗi khi lưu dữ liệu');
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
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
      render: (_: any, record: any) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
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
            <AppstoreOutlined />
            Quản lý danh mục
          </h1>
        </div>

        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={categoryConfigs.map(config => ({
            key: config.key,
            label: config.label,
            children: (
              <div>
                {/* Search and Add Button */}
                <div className="flex justify-between items-center mb-4">
                  <Search
                    placeholder={`Tìm kiếm ${config.label.toLowerCase()}...`}
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
                    Thêm {config.label}
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
                  dataSource={data} 
                  loading={loading} 
                  bordered 
                  scroll={{ x: 800 }}
                />
              </div>
            ),
          }))}
        />

        <Modal
          title={editing ? `Sửa ${config.label}` : `Thêm ${config.label}`}
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
              label="Tên"
              rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả"
            >
              <Input.TextArea />
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

export default Categories; 