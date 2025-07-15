import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message, Space } from 'antd';
import { getPendingPlaces, approvePlace, rejectPlace } from '../../api/adminPlaces';

interface Place {
  id: string;
  name: string;
  address: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const PlacesPending: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Place | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPlaces = async () => {
    setLoading(true);
    const res = await getPendingPlaces();
    setPlaces(res.data.map((p: any) => ({ ...p, status: p.status as 'pending' | 'approved' | 'rejected' })));
    setLoading(false);
  };

  useEffect(() => { fetchPlaces(); }, []);

  const handleApprove = async (id: string) => {
    await approvePlace(id);
    message.success('Đã duyệt địa điểm!');
    fetchPlaces();
    setDetail(null);
  };
  const handleReject = async () => {
    if (!detail) return;
    await rejectPlace(detail.id, rejectReason);
    message.success('Đã từ chối địa điểm!');
    fetchPlaces();
    setRejectModal(false);
    setDetail(null);
    setRejectReason('');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Người gửi', dataIndex: 'submittedBy', key: 'submittedBy' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => {
      if (status === 'pending') return <Tag color="blue">Đang chờ</Tag>;
      if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
      return <Tag color="red">Bị từ chối</Tag>;
    } },
    {
      title: 'Hành động', key: 'action', render: (_: any, place: Place) => place.status === 'pending' ? (
        <Button type="link" onClick={() => setDetail(place)}>Xem chi tiết</Button>
      ) : null
    }
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={places} loading={loading} bordered />
      <Modal
        title="Chi tiết địa điểm"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={detail && detail.status === 'pending' ? [
          <Button key="approve" type="primary" onClick={() => handleApprove(detail.id)}>Duyệt</Button>,
          <Button key="reject" danger onClick={() => setRejectModal(true)}>Từ chối</Button>,
        ] : null}
      >
        {detail && (
          <div>
            <p><b>Tên:</b> {detail.name}</p>
            <p><b>Địa chỉ:</b> {detail.address}</p>
            <p><b>Người gửi:</b> {detail.submittedBy}</p>
            {detail.status === 'rejected' && <p><b>Lý do từ chối:</b> {detail.reason}</p>}
          </div>
        )}
      </Modal>
      <Modal
        title="Lý do từ chối"
        open={rejectModal}
        onCancel={() => setRejectModal(false)}
        onOk={handleReject}
        okText="Từ chối"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Lý do" required>
            <Input.TextArea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlacesPending; 