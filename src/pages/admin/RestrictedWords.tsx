import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message } from 'antd';
import {
  getRestrictedWords, addRestrictedWord, updateRestrictedWord, deleteRestrictedWord
} from '../../api/adminRestrictedWords';

const typeOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'review', label: 'Review' },
  { value: 'comment', label: 'Bình luận' },
  { value: 'cafe', label: 'Cafe' },
];

const RestrictedWords: React.FC = () => {
  const [type, setType] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await getRestrictedWords(type);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [type]);

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
    await deleteRestrictedWord(id);
    message.success('Đã xoá!');
    fetchData();
  };
  const handleOk = async () => {
    const values = await form.validateFields();
    if (editing) {
      await updateRestrictedWord(editing.id, values);
      message.success('Đã cập nhật!');
    } else {
      await addRestrictedWord(values);
      message.success('Đã thêm mới!');
    }
    setModalOpen(false);
    fetchData();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Từ khoá', dataIndex: 'word', key: 'word' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type: string) => typeOptions.find(o => o.value === type)?.label },
    {
      title: 'Hành động', key: 'action', render: (_: any, item: any) => (
        <Space>
          <Button onClick={() => handleEdit(item)} type="link">Sửa</Button>
          <Popconfirm title="Xoá từ khoá này?" onConfirm={() => handleDelete(item.id)}>
            <Button danger type="link">Xoá</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Space className="mb-4">
        <span>Lọc theo loại:</span>
        <Select options={typeOptions} value={type} onChange={setType} style={{ width: 160 }} />
      </Space>
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
          <Form.Item name="word" label="Từ khoá" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}> <Select options={typeOptions.filter(o => o.value)} /> </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RestrictedWords; 