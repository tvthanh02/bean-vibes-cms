// MOCK DATA
let comments = [
  { id: 'c1', content: 'Quán rất đẹp!', user: 'user1', reviewId: 'rv1', placeId: 'pl1', status: 'visible', createdAt: '2024-07-16' },
  { id: 'c2', content: 'Phục vụ hơi chậm.', user: 'user2', reviewId: 'rv2', placeId: 'pl2', status: 'hidden', createdAt: '2024-07-15' },
  { id: 'c3', content: 'Cafe ngon, view đẹp.', user: 'user3', reviewId: 'rv1', placeId: 'pl1', status: 'visible', createdAt: '2024-07-14' },
  { id: 'c4', content: 'Không gian yên tĩnh.', user: 'user4', reviewId: 'rv2', placeId: 'pl2', status: 'visible', createdAt: '2024-07-13' },
  { id: 'c5', content: 'Giá hợp lý.', user: 'user5', reviewId: 'rv1', placeId: 'pl1', status: 'visible', createdAt: '2024-07-12' },
  { id: 'c6', content: 'Nhạc hay.', user: 'user6', reviewId: 'rv2', placeId: 'pl2', status: 'hidden', createdAt: '2024-07-11' },
  { id: 'c7', content: 'Sẽ quay lại.', user: 'user7', reviewId: 'rv1', placeId: 'pl1', status: 'visible', createdAt: '2024-07-10' },
  { id: 'c8', content: 'Bánh ngon.', user: 'user8', reviewId: 'rv2', placeId: 'pl2', status: 'visible', createdAt: '2024-07-09' },
  { id: 'c9', content: 'Nhân viên thân thiện.', user: 'user9', reviewId: 'rv1', placeId: 'pl1', status: 'visible', createdAt: '2024-07-08' },
  { id: 'c10', content: 'Địa điểm dễ tìm.', user: 'user10', reviewId: 'rv2', placeId: 'pl2', status: 'visible', createdAt: '2024-07-07' },
  { id: 'c11', content: 'Không thích lắm.', user: 'user11', reviewId: 'rv1', placeId: 'pl1', status: 'hidden', createdAt: '2024-07-06' },
  { id: 'c12', content: 'Rất hài lòng.', user: 'user12', reviewId: 'rv2', placeId: 'pl2', status: 'visible', createdAt: '2024-07-05' },
];

export const getComments = async (filter?: { user?: string; reviewId?: string; placeId?: string; status?: string; content?: string; dateFrom?: string; dateTo?: string; page?: number; pageSize?: number }) => {
  let data = comments;
  if (filter) {
    if (filter.user) data = data.filter(c => c.user && filter.user && c.user.includes(filter.user));
    if (filter.reviewId) data = data.filter(c => c.reviewId === filter.reviewId);
    if (filter.placeId) data = data.filter(c => c.placeId === filter.placeId);
    if (filter.status) data = data.filter(c => c.status === filter.status);
    if (filter.content !== undefined && filter.content !== '') data = data.filter(c => c.content && c.content.toLowerCase().includes(filter.content!.toLowerCase()));
    if (filter.dateFrom) data = data.filter(c => c.createdAt && c.createdAt >= filter.dateFrom!);
    if (filter.dateTo) data = data.filter(c => c.createdAt && c.createdAt <= filter.dateTo!);
  }
  const total = data.length;
  const page = filter?.page || 1;
  const pageSize = filter?.pageSize || 10;
  data = data.slice((page - 1) * pageSize, page * pageSize);
  return Promise.resolve({ data, total });
};

export const updateComment = async (id: string, data: any) => {
  comments = comments.map(c => c.id === id ? { ...c, ...data } : c);
  return Promise.resolve();
};

export const deleteComment = async (id: string) => {
  comments = comments.filter(c => c.id !== id);
  return Promise.resolve();
}; 