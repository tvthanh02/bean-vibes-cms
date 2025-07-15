import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div className="p-8">
      <Title level={2}>Chào mừng quản trị viên!</Title>
      <p>Đây là trang dashboard mẫu.</p>
    </div>
  );
};

export default Dashboard; 