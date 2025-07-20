import { message } from 'antd';
import { useCallback } from 'react';

export const useToast = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const showSuccess = useCallback((content: string) => {
    messageApi.open({
      type: 'success',
      content,
    });
  }, [messageApi]);

  const showError = useCallback((content: string) => {
    messageApi.open({
      type: 'error',
      content,
    });
  }, [messageApi]);

  const showInfo = useCallback((content: string) => {
    messageApi.open({
      type: 'info',
      content,
    });
  }, [messageApi]);

  const showWarning = useCallback((content: string) => {
    messageApi.open({
      type: 'warning',
      content,
    });
  }, [messageApi]);

  const showLoading = useCallback((content: string) => {
    return messageApi.open({
      type: 'loading',
      content,
      duration: 0,
    });
  }, [messageApi]);

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showLoading,
    contextHolder,
  };
}; 