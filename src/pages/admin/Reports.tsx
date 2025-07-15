import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Select, Space } from 'antd';
import { getReports, resolveReport } from '../../api/adminReports';

interface Report {
  id: string;
  type: 'post' | 'comment' | 'place';
  objectId: string;
  reason: string;
  status: 'pending' | 'resolved';
}

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'post', label: 'Bài viết' },
  { value: 'comment', label: 'Bình luận' },
  { value: 'place', label: 'Địa điểm' },
];

const Reports: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports(type);
      setReports(res.data.map((r: any) => ({ ...r, type: r.type as 'post' | 'comment' | 'place', status: r.status as 'pending' | 'resolved' })));
    } catch {
      message.error('Không thể tải danh sách báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line
  }, [type]);

  const handleResolve = async (id: string) => {
    await resolveReport(id);
    message.success('Đã xử lý báo cáo!');
    fetchReports();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type: string) => {
      if (type === 'post') return <Tag color="blue">Bài viết</Tag>;
      if (type === 'comment') return <Tag color="purple">Bình luận</Tag>;
      return <Tag color="orange">Địa điểm</Tag>;
    } },
    { title: 'Mã đối tượng', dataIndex: 'objectId', key: 'objectId' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => status === 'pending' ? <Tag color="red">Đang chờ</Tag> : <Tag color="green">Đã xử lý</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, report: Report) => report.status === 'pending' ? (
        <Button type="primary" onClick={() => handleResolve(report.id)}>Xử lý</Button>
      ) : null,
    },
  ];

  return (
    <div>
      <Space className="mb-4">
        <span>Lọc theo loại:</span>
        <Select options={typeOptions} value={type} onChange={setType} style={{ width: 160 }} />
      </Space>
      <Table rowKey="id" columns={columns} dataSource={reports} loading={loading} bordered />
    </div>
  );
};

export default Reports; 