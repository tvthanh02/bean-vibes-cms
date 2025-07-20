import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

export const useConfirmModal = () => {
  const showConfirm = (
    title: string,
    content: string,
    onOk: () => void,
    onCancel?: () => void,
    okText: string = 'Xác nhận',
    cancelText: string = 'Hủy'
  ) => {
    Modal.confirm({
      title,
      icon: React.createElement(ExclamationCircleOutlined),
      content,
      okText,
      cancelText,
      onOk,
      onCancel,
    });
  };

  const showDeleteConfirm = (
    itemName: string,
    onOk: () => void,
    onCancel?: () => void
  ) => {
    showConfirm(
      'Xác nhận xóa',
      `Bạn có chắc chắn muốn xóa "${itemName}"? Hành động này không thể hoàn tác.`,
      onOk,
      onCancel,
      'Xóa',
      'Hủy'
    );
  };

  const showUpdateConfirm = (
    itemName: string,
    onOk: () => void,
    onCancel?: () => void
  ) => {
    showConfirm(
      'Xác nhận cập nhật',
      `Bạn có chắc chắn muốn cập nhật "${itemName}"?`,
      onOk,
      onCancel,
      'Cập nhật',
      'Hủy'
    );
  };

  const showApproveConfirm = (
    itemName: string,
    onOk: () => void,
    onCancel?: () => void
  ) => {
    showConfirm(
      'Xác nhận duyệt',
      `Bạn có chắc chắn muốn duyệt "${itemName}"?`,
      onOk,
      onCancel,
      'Duyệt',
      'Hủy'
    );
  };

  const showRejectConfirm = (
    itemName: string,
    onOk: () => void,
    onCancel?: () => void
  ) => {
    showConfirm(
      'Xác nhận từ chối',
      `Bạn có chắc chắn muốn từ chối "${itemName}"?`,
      onOk,
      onCancel,
      'Từ chối',
      'Hủy'
    );
  };

  return {
    showConfirm,
    showDeleteConfirm,
    showUpdateConfirm,
    showApproveConfirm,
    showRejectConfirm,
  };
}; 