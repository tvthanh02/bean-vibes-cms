import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message } from 'antd';
import { getReportReviews, resolveReportReview } from '../../api/moderatorReportReviews';

interface ReportReview {
  id: string;
  reviewId: string;
  reason: string;
  status: 'pending' | 'resolved';
}

const ReportReviews: React.FC = () => {
  const [reports, setReports] = useState<ReportReview[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const res = await getReportReviews();
    setReports(res.data.map((r: any) => ({ ...r, status: r.status as 'pending' | 'resolved' })));
    setLoading(false);
  };

  useEffect(() => { fetchReports(); }, []);

  const handleResolve = async (id: string) => {
    await resolveReportReview(id);
    message.success('Đã xử lý báo cáo!');
    fetchReports();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã bài review', dataIndex: 'reviewId', key: 'reviewId' },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => status === 'pending' ? <Tag color="red">Đang chờ</Tag> : <Tag color="green">Đã xử lý</Tag> },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, report: ReportReview) => report.status === 'pending' ? (
        <Button type="primary" onClick={() => handleResolve(report.id)}>Xử lý</Button>
      ) : null,
    },
  ];

  return (
    <div>
      <Table rowKey="id" columns={columns} dataSource={reports} loading={loading} bordered />
    </div>
  );
};

export default ReportReviews; 