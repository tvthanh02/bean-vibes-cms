import axiosInstance from './axiosInstance';

export const adminLogin = (data: { username: string; password: string }) => {
  // Mock login: nếu username là 'admin' thì role admin, nếu là 'mod' thì role moderator
  if (data.username === 'admin' && data.password === 'admin') {
    // Lưu profile vào localStorage để getAdminProfile dùng
    localStorage.setItem('mock_profile', JSON.stringify({
      id: '1', username: 'admin', email: 'admin@email.com', role: 'admin'
    }));
    return Promise.resolve({ data: { token: 'admin-token' } });
  }
  if (data.username === 'mod' && data.password === 'mod') {
    localStorage.setItem('mock_profile', JSON.stringify({
      id: '2', username: 'mod', email: 'mod@email.com', role: 'moderator'
    }));
    return Promise.resolve({ data: { token: 'mod-token' } });
  }
  return Promise.reject({ response: { data: { message: 'Sai tài khoản hoặc mật khẩu' } } });
};

export const adminLogout = () => {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('mock_profile');
  return Promise.resolve();
};

export const getAdminProfile = () => {
  // Lấy profile từ localStorage
  const profile = localStorage.getItem('mock_profile');
  if (profile) return Promise.resolve({ data: JSON.parse(profile) });
  return Promise.reject({ response: { data: { message: 'Chưa đăng nhập' } } });
}; 