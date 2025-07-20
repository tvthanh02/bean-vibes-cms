import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  InfoCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import { getComments, updateComment, deleteComment } from '../../api/comments';
import { useConfirmModal } from '../../hooks/useConfirmModal';
import dayjs from 'dayjs';

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'visible', label: 'Hiển thị' },
  { value: 'hidden', label: 'Đã ẩn' },
];

// Mock mapping review/place name
const reviewMap = { rv1: 'Review Cafe A', rv2: 'Review Cafe B' };
const placeMap = { pl1: 'Cafe A', pl2: 'Cafe B' };

const Comments: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState({ user: '', reviewId: '', placeId: '', status: '', content: '', dateFrom: '', dateTo: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
  const { showDeleteConfirm, showUpdateConfirm } = useConfirmModal();

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    const res = await getComments({ ...filter, page, pageSize });
    setData(res.data);
    setPagination(p => ({ ...p, current: page, pageSize, total: res.total }));
    setLoading(false);
  };

  useEffect(() => { fetchData(1, pagination.pageSize); /* eslint-disable-next-line */ }, [filter]);

  const handleEdit = (item: any) => {
    setEditing(item);
    setModalOpen(true);
    form.setFieldsValue(item);
  };
  const handleDelete = async (id: string, content: string) => {
    showDeleteConfirm(content.substring(0, 30) + '...', () => {
      deleteComment(id).then(() => {
        message.success('Đã xoá!');
        fetchData();
      }).catch(() => {
        message.error('Xóa thất bại!');
      });
    });
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      showUpdateConfirm(editing.content.substring(0, 30) + '...', () => {
        updateComment(editing.id, values).then(() => {
          message.success('Đã cập nhật!');
          setModalOpen(false);
          fetchData();
        }).catch(() => {
          message.error('Cập nhật thất bại!');
        });
      });
    } catch (error) {
      message.error('Vui lòng kiểm tra lại thông tin!');
    }
  };
  const handleToggleStatus = async (item: any) => {
    try {
      await updateComment(item.id, { status: item.status === 'visible' ? 'hidden' : 'visible' });
      message.success(item.status === 'visible' ? 'Đã ẩn bình luận!' : 'Đã hiển thị bình luận!');
      fetchData();
    } catch (error) {
      message.error('Thao tác thất bại!');
    }
  };
  const handleShowDetail = (item: any) => {
    setDetail(item);
    setDetailOpen(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nội dung', dataIndex: 'content', key: 'content', render: (text: string) => <Tooltip title={text}>{text.length > 30 ? text.slice(0, 30) + '...' : text}</Tooltip> },
    { title: 'Người gửi', dataIndex: 'user', key: 'user' },
    { title: 'Bài viết', dataIndex: 'reviewId', key: 'reviewId', render: (id: string) => reviewMap[id as keyof typeof reviewMap] || id },
    { title: 'Địa điểm', dataIndex: 'placeId', key: 'placeId', render: (id: string) => placeMap[id as keyof typeof placeMap] || id },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string, item: any) => (
      <Tag 
        color={status === 'visible' ? 'green' : 'gray'} 
        onClick={() => handleToggleStatus(item)} 
        style={{ cursor: 'pointer' }}
        icon={status === 'visible' ? <EyeOutlined /> : <EyeInvisibleOutlined />}
      >
        {status === 'visible' ? 'Hiển thị' : 'Đã ẩn'}
      </Tag>
    ) },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    {
      title: 'Hành động', key: 'action', render: (_: any, item: any) => (
        <Space>
          <Button onClick={() => handleShowDetail(item)} type="link" icon={<InfoCircleOutlined />}>Chi tiết</Button>
          <Button onClick={() => handleEdit(item)} type="link" icon={<EditOutlined />}>Sửa</Button>
          <Button danger onClick={() => handleDelete(item.id, item.content)} type="link" icon={<DeleteOutlined />}>Xoá</Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Input placeholder="Nội dung" value={filter.content} onChange={e => setFilter(f => ({ ...f, content: e.target.value }))} style={{ width: 160 }} allowClear />
        <Input placeholder="Người gửi" value={filter.user} onChange={e => setFilter(f => ({ ...f, user: e.target.value }))} style={{ width: 120 }} allowClear />
        <Input placeholder="Bài viết" value={filter.reviewId} onChange={e => setFilter(f => ({ ...f, reviewId: e.target.value }))} style={{ width: 100 }} allowClear />
        <Input placeholder="Địa điểm" value={filter.placeId} onChange={e => setFilter(f => ({ ...f, placeId: e.target.value }))} style={{ width: 100 }} allowClear />
        <Select options={statusOptions} value={filter.status} onChange={v => setFilter(f => ({ ...f, status: v }))} style={{ width: 110 }} allowClear />
        <DatePicker placeholder="Từ ngày" value={filter.dateFrom ? dayjs(filter.dateFrom) : undefined} onChange={d => setFilter(f => ({ ...f, dateFrom: d ? d.format('YYYY-MM-DD') : '' }))} style={{ width: 120 }} allowClear />
        <DatePicker placeholder="Đến ngày" value={filter.dateTo ? dayjs(filter.dateTo) : undefined} onChange={d => setFilter(f => ({ ...f, dateTo: d ? d.format('YYYY-MM-DD') : '' }))} style={{ width: 120 }} allowClear />
      </div>
      
      <Table 
        rowKey="id" 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        bordered 
        scroll={{ x: 1200 }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page, pageSize) => fetchData(page, pageSize),
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
      
      <Modal
        title="Cập nhật bình luận"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}> <Select options={statusOptions.filter(o => o.value !== '')} /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết bình luận"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
      >
        {detail && (
          <div className="space-y-2">
            <div><b>ID:</b> {detail.id}</div>
            <div><b>Nội dung:</b> {detail.content}</div>
            <div><b>Người gửi:</b> {detail.user}</div>
            <div><b>Bài viết:</b> {reviewMap[detail.reviewId as keyof typeof reviewMap] || detail.reviewId}</div>
            <div><b>Địa điểm:</b> {placeMap[detail.placeId as keyof typeof placeMap] || detail.placeId}</div>
            <div><b>Trạng thái:</b> <Tag color={detail.status === 'visible' ? 'green' : 'gray'}>{detail.status === 'visible' ? 'Hiển thị' : 'Đã ẩn'}</Tag></div>
            <div><b>Ngày tạo:</b> {dayjs(detail.createdAt).format('DD/MM/YYYY')}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Comments; 