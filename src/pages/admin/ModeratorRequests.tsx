import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Space } from 'antd';
import { getModeratorRequests, approveModeratorRequest, rejectModeratorRequest } from '../../api/adminModeratorRequests';

interface Request {
  id: string;
  username: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ModeratorRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getModeratorRequests();
      setRequests(res.data.map((r: any) => ({ ...r, status: r.status as 'pending' | 'approved' | 'rejected' })));
    } catch {
      message.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    await approveModeratorRequest(id);
    message.success('Đã phê duyệt!');
    fetchRequests();
  };

  const handleReject = async (id: string) => {
    await rejectModeratorRequest(id);
    message.success('Đã từ chối!');
    fetchRequests();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên đăng nhập', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => {
      if (status === 'pending') return <Tag color="blue">Đang chờ</Tag>;
      if (status === 'approved') return <Tag color="green">Đã duyệt</Tag>;
      return <Tag color="red">Bị từ chối</Tag>;
    } },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, req: Request) => req.status === 'pending' ? (
        <Space>
          <Button type="primary" onClick={() => handleApprove(req.id)}>Phê duyệt</Button>
          <Button danger onClick={() => handleReject(req.id)}>Từ chối</Button>
        </Space>
      ) : null,
    },
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={requests} loading={loading} bordered />
    </div>
  );
};

export default ModeratorRequests; 