// MOCK DATA
let reviews = [
  { id: 'rv1', title: 'Review Cafe A', content: 'Nội dung...', submittedBy: 'user1', status: 'pending', reason: '', createdAt: '2024-06-01', visible: true },
  { id: 'rv2', title: 'Review Cafe B', content: 'Nội dung...', submittedBy: 'user2', status: 'approved', reason: '', createdAt: '2024-06-02', visible: true },
  { id: 'rv3', title: 'Review Cafe C', content: 'Nội dung...', submittedBy: 'user3', status: 'rejected', reason: 'Spam', createdAt: '2024-06-03', visible: false },
];

export const getReviews = async (params: any = {}) => {
  let data = [...reviews];
  if (params.status) data = data.filter(r => r.status === params.status);
  if (params.visible !== undefined) data = data.filter(r => r.visible === params.visible);
  if (params.title) data = data.filter(r => r.title.toLowerCase().includes(params.title.toLowerCase()));
  if (params.submittedBy) data = data.filter(r => r.submittedBy === params.submittedBy);
  if (params.dateFrom) data = data.filter(r => r.createdAt >= params.dateFrom);
  if (params.dateTo) data = data.filter(r => r.createdAt <= params.dateTo);
  const total = data.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  data = data.slice((page - 1) * pageSize, page * pageSize);
  return Promise.resolve({ data, total });
};

export const getPendingReviews = async () => {
  return Promise.resolve({ data: reviews.filter(r => r.status === 'pending') });
};

export const approveReview = async (id: string) => {
  reviews = reviews.map(r => r.id === id ? { ...r, status: 'approved' } : r);
  return Promise.resolve();
};
export const rejectReview = async (id: string, reason: string) => {
  reviews = reviews.map(r => r.id === id ? { ...r, status: 'rejected', reason } : r);
  return Promise.resolve();
};
export const updateReview = async (id: string, values: any) => {
  reviews = reviews.map(r => r.id === id ? { ...r, ...values } : r);
  return Promise.resolve();
};
export const deleteReview = async (id: string) => {
  reviews = reviews.filter(r => r.id !== id);
  return Promise.resolve();
};
export const toggleVisibleReview = async (id: string) => {
  reviews = reviews.map(r => r.id === id ? { ...r, visible: !r.visible } : r);
  return Promise.resolve();
}; 