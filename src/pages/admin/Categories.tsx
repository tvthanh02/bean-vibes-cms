import React, { useEffect, useState } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, Space, Popconfirm, message } from 'antd';
import {
  getRegions, addRegion, updateRegion, deleteRegion,
  getStyles, addStyle, updateStyle, deleteStyle,
  getServices, addService, updateService, deleteService,
  getPurposes, addPurpose, updatePurpose, deletePurpose
} from '../../api/adminCategories';

const categoryConfigs = [
  {
    key: 'regions', label: 'Khu vực',
    apis: { get: getRegions, add: addRegion, update: updateRegion, delete: deleteRegion }
  },
  {
    key: 'styles', label: 'Phong cách',
    apis: { get: getStyles, add: addStyle, update: updateStyle, delete: deleteStyle }
  },
  {
    key: 'services', label: 'Dịch vụ',
    apis: { get: getServices, add: addService, update: updateService, delete: deleteService }
  },
  {
    key: 'purposes', label: 'Mục đích',
    apis: { get: getPurposes, add: addPurpose, update: updatePurpose, delete: deletePurpose }
  },
];

const Categories: React.FC = () => {
  const [activeKey, setActiveKey] = useState('regions');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const config = categoryConfigs.find(c => c.key === activeKey)!;

  const fetchData = async () => {
    setLoading(true);
    const res = await config.apis.get();
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [activeKey]);

  const handleAdd = () => {
    setEditing(null);
    setModalOpen(true);
    form.resetFields();
  };
  const handleEdit = (item: any) => {
    setEditing(item);
    setModalOpen(true);
    form.setFieldsValue(item);
  };
  const handleDelete = async (id: string) => {
    await config.apis.delete(id);
    message.success('Đã xoá!');
    fetchData();
  };
  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      await config.apis.update(editing.id, values);
      message.success('Đã cập nhật!');
    } else {
      await config.apis.add(values);
      message.success('Đã thêm mới!');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    {
      title: 'Hành động', key: 'action', render: (_: any, item: any) => (
        <Space>
          <Button onClick={() => handleEdit(item)} type="link">Sửa</Button>
          <Popconfirm title="Xoá mục này?" onConfirm={() => handleDelete(item.id)}>
            <Button danger type="link">Xoá</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={setActiveKey} items={categoryConfigs.map(c => ({ key: c.key, label: c.label }))} />
      <Button type="primary" className="mb-4" onClick={handleAdd}>Thêm mới</Button>
      <Table rowKey="id" columns={columns} dataSource={data} loading={loading} bordered />
      <Modal
        title={editing ? 'Cập nhật' : 'Thêm mới'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleOk}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}> <Input /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Categories; 