import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Tag, message } from 'antd';
import { getPendingReviews, approveReview, rejectReview } from '../../api/moderatorReviews';

interface Review {
  id: string;
  title: string;
  content: string;
  submittedBy: string;
  status: 'pending' | 'approved' | 'rejected';
  reason?: string;
}

const ReviewsPending: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<Review | null>(null);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    const res = await getPendingReviews();
    setReviews(res.data.map((r: any) => ({ ...r, status: r.status as 'pending' | 'approved' | 'rejected' })));
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id: string) => {
    await approveReview(id);
    message.success('Đã duyệt bài review!');
    fetchReviews();
    setDetail(null);
  };
  const handleReject = async () => {
    if (!detail) return;
    await rejectReview(detail.id, rejectReason);
    message.success('Đã từ chối bài review!');
    fetchReviews();
    setRejectModal(false);
    setDetail(null);
    setRejectReason('');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title' },
    { title: 'Người gửi', dataIndex: 'submittedBy', key: 'submittedBy' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => {
      if (status === 'pending') return <Tag color="blue">Đang chờ</Tag>;
      if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
      return <Tag color="red">Bị từ chối</Tag>;
    } },
    {
      title: 'Hành động', key: 'action', render: (_: any, review: Review) => review.status === 'pending' ? (
        <Button type="link" onClick={() => setDetail(review)}>Xem chi tiết</Button>
      ) : null
    }
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={reviews} loading={loading} bordered />
      <Modal
        title="Chi tiết bài review"
        open={!!detail}
        onCancel={() => setDetail(null)}
        footer={detail && detail.status === 'pending' ? [
          <Button key="approve" type="primary" onClick={() => handleApprove(detail.id)}>Duyệt</Button>,
          <Button key="reject" danger onClick={() => setRejectModal(true)}>Từ chối</Button>,
        ] : null}
      >
        {detail && (
          <div>
            <p><b>Tiêu đề:</b> {detail.title}</p>
            <p><b>Nội dung:</b> {detail.content}</p>
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

export default ReviewsPending; 