import React from 'react';
import { Typography, Card } from 'antd';
import { CoffeeOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const ModeratorDashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px]">
      <Card className="max-w-xl w-full text-center shadow-lg rounded-xl p-8">
        <div className="flex justify-center mb-4">
          <CoffeeOutlined style={{ fontSize: 40, color: '#f59e42' }} />
        </div>
        <Title level={2}>Chào mừng kiểm duyệt viên!</Title>
        <Paragraph>Hệ thống CMS kiểm duyệt review cafe Hà Nội.<br/>Hãy chọn chức năng ở menu bên trái để bắt đầu kiểm duyệt bài viết, địa điểm, báo cáo...</Paragraph>
      </Card>
    </div>
  );
};

export default ModeratorDashboard; 