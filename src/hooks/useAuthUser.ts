import { useEffect, useState } from 'react';
import { getAdminProfile } from '../api/adminAuth';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'moderator';
  // Thêm các trường khác nếu cần
}

export function useAuthUser() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      setUser(null);
      return;
    }
    getAdminProfile()
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setUser(null);
        setError('Phiên đăng nhập hết hạn hoặc không hợp lệ');
        setLoading(false);
      });
  }, []);

  return { user, loading, error };
} 