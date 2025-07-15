import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Tag, Space, Popconfirm, message, DatePicker, Tooltip } from 'antd';
import { getPlaces, approvePlace, rejectPlace, updatePlace, deletePlace, toggleVisiblePlace } from '../../api/moderatorPlaces';
import dayjs from 'dayjs';

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
];
const visibleOptions = [
  { value: '', label: 'Tất cả' },
  { value: true, label: 'Hiện' },
  { value: false, label: 'Ẩn' },
];

const Places: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState({ name: '', address: '', submittedBy: '', status: '', visible: '', dateFrom: '', dateTo: '' });
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  const fetchData = async (page = pagination.current, pageSize = pagination.pageSize) => {
    setLoading(true);
    const params = { ...filter, visible: filter.visible === '' ? undefined : filter.visible, page, pageSize };
    const res = await getPlaces(params);
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
  const handleDelete = async (id: string) => {
    await deletePlace(id);
    message.success('Đã xoá!');
    fetchData();
  };
  const handleOk = async () => {
    const values = await form.validateFields();
    await updatePlace(editing.id, values);
    message.success('Đã cập nhật!');
    setModalOpen(false);
    fetchData();
  };
  const handleToggleVisible = async (item: any) => {
    await toggleVisiblePlace(item.id);
    message.success(item.visible ? 'Đã ẩn địa điểm!' : 'Đã hiển thị địa điểm!');
    fetchData();
  };
  const handleShowDetail = (item: any) => {
    setDetail(item);
    setDetailOpen(true);
  };
  const handleApprove = async (id: string) => {
    await approvePlace(id);
    message.success('Đã duyệt địa điểm!');
    fetchData();
    setDetailOpen(false);
  };
  const handleReject = async (id: string) => {
    Modal.confirm({
      title: 'Lý do từ chối',
      content: (
        <Form layout="vertical" id="rejectForm">
          <Form.Item name="reason" label="Lý do" rules={[{ required: true }]}> <Input.TextArea rows={3} /> </Form.Item>
        </Form>
      ),
      onOk: async () => {
        const formEl = document.getElementById('rejectForm');
        // @ts-ignore
        const reason = formEl?.elements?.reason?.value || '';
        await rejectPlace(id, reason);
        message.success('Đã từ chối địa điểm!');
        fetchData();
        setDetailOpen(false);
      },
      okText: 'Từ chối',
      cancelText: 'Hủy',
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name', render: (text: string) => <Tooltip title={text}>{text.length > 30 ? text.slice(0, 30) + '...' : text}</Tooltip> },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address', render: (text: string) => <Tooltip title={text}>{text.length > 30 ? text.slice(0, 30) + '...' : text}</Tooltip> },
    { title: 'Người gửi', dataIndex: 'submittedBy', key: 'submittedBy' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => {
      if (status === 'pending') return <Tag color="blue">Chờ duyệt</Tag>;
      if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
      return <Tag color="red">Đã từ chối</Tag>;
    } },
    { title: 'Hiện/Ẩn', dataIndex: 'visible', key: 'visible', render: (visible: boolean, item: any) => <Tag color={visible ? 'green' : 'gray'} onClick={() => handleToggleVisible(item)} style={{ cursor: 'pointer' }}>{visible ? 'Hiện' : 'Ẩn'}</Tag> },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (d: string) => dayjs(d).format('DD/MM/YYYY') },
    {
      title: 'Hành động', key: 'action', render: (_: any, item: any) => (
        <Space>
          <Button onClick={() => handleShowDetail(item)} type="link">Chi tiết</Button>
          {item.status === 'pending' && <Button onClick={() => handleApprove(item.id)} type="link">Duyệt</Button>}
          {item.status === 'pending' && <Button danger onClick={() => handleReject(item.id)} type="link">Từ chối</Button>}
          <Button onClick={() => handleEdit(item)} type="link">Sửa</Button>
          <Popconfirm title="Xoá địa điểm này?" onConfirm={() => handleDelete(item.id)}>
            <Button danger type="link">Xoá</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Input placeholder="Tên" value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} style={{ width: 160 }} allowClear />
        <Input placeholder="Địa chỉ" value={filter.address} onChange={e => setFilter(f => ({ ...f, address: e.target.value }))} style={{ width: 160 }} allowClear />
        <Input placeholder="Người gửi" value={filter.submittedBy} onChange={e => setFilter(f => ({ ...f, submittedBy: e.target.value }))} style={{ width: 120 }} allowClear />
        <Select options={statusOptions} value={filter.status} onChange={v => setFilter(f => ({ ...f, status: v }))} style={{ width: 120 }} allowClear />
        <Select options={visibleOptions} value={filter.visible} onChange={v => setFilter(f => ({ ...f, visible: v }))} style={{ width: 100 }} allowClear />
        <DatePicker placeholder="Từ ngày" value={filter.dateFrom ? dayjs(filter.dateFrom) : undefined} onChange={d => setFilter(f => ({ ...f, dateFrom: d ? d.format('YYYY-MM-DD') : '' }))} style={{ width: 120 }} allowClear />
        <DatePicker placeholder="Đến ngày" value={filter.dateTo ? dayjs(filter.dateTo) : undefined} onChange={d => setFilter(f => ({ ...f, dateTo: d ? d.format('YYYY-MM-DD') : '' }))} style={{ width: 120 }} allowClear />
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          onChange: (page, pageSize) => fetchData(page, pageSize),
        }}
      />
      <Modal
        title="Cập nhật địa điểm"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết địa điểm"
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={null}
      >
        {detail && (
          <div className="space-y-2">
            <div><b>ID:</b> {detail.id}</div>
            <div><b>Tên:</b> {detail.name}</div>
            <div><b>Địa chỉ:</b> {detail.address}</div>
            <div><b>Người gửi:</b> {detail.submittedBy}</div>
            <div><b>Trạng thái:</b> <Tag color={detail.status === 'pending' ? 'blue' : detail.status === 'approved' ? 'green' : 'red'}>{statusOptions.find(o => o.value === detail.status)?.label}</Tag></div>
            <div><b>Hiện/Ẩn:</b> <Tag color={detail.visible ? 'green' : 'gray'}>{detail.visible ? 'Hiện' : 'Ẩn'}</Tag></div>
            <div><b>Ngày tạo:</b> {dayjs(detail.createdAt).format('DD/MM/YYYY')}</div>
            {detail.status === 'rejected' && <div><b>Lý do từ chối:</b> {detail.reason}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Places; 