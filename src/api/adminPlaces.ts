// MOCK DATA
let places = [
  { id: 'pl1', name: 'Cafe A', address: '123 Đường A', submittedBy: 'user1', status: 'pending', reason: '', createdAt: '2024-06-01', visible: true },
  { id: 'pl2', name: 'Cafe B', address: '456 Đường B', submittedBy: 'user2', status: 'approved', reason: '', createdAt: '2024-06-02', visible: true },
  { id: 'pl3', name: 'Cafe C', address: '789 Đường C', submittedBy: 'user3', status: 'rejected', reason: 'Không hợp lệ', createdAt: '2024-06-03', visible: false },
];

export const getPlaces = async (params: any = {}) => {
  let data = [...places];
  if (params.status) data = data.filter(p => p.status === params.status);
  if (params.visible !== undefined) data = data.filter(p => p.visible === params.visible);
  if (params.name) data = data.filter(p => p.name.toLowerCase().includes(params.name.toLowerCase()));
  if (params.address) data = data.filter(p => p.address.toLowerCase().includes(params.address.toLowerCase()));
  if (params.submittedBy) data = data.filter(p => p.submittedBy === params.submittedBy);
  if (params.dateFrom) data = data.filter(p => p.createdAt >= params.dateFrom);
  if (params.dateTo) data = data.filter(p => p.createdAt <= params.dateTo);
  const total = data.length;
  const page = params.page || 1;
  const pageSize = params.pageSize || 5;
  data = data.slice((page - 1) * pageSize, page * pageSize);
  return Promise.resolve({ data, total });
};

export const getPendingPlaces = async () => {
  return Promise.resolve({ data: places.filter(p => p.status === 'pending') });
};

export const approvePlace = async (id: string) => {
  places = places.map(p => p.id === id ? { ...p, status: 'approved' } : p);
  return Promise.resolve();
};
export const rejectPlace = async (id: string, reason: string) => {
  places = places.map(p => p.id === id ? { ...p, status: 'rejected', reason } : p);
  return Promise.resolve();
};
export const updatePlace = async (id: string, values: any) => {
  places = places.map(p => p.id === id ? { ...p, ...values } : p);
  return Promise.resolve();
};
export const deletePlace = async (id: string) => {
  places = places.filter(p => p.id !== id);
  return Promise.resolve();
};
export const toggleVisiblePlace = async (id: string) => {
  places = places.map(p => p.id === id ? { ...p, visible: !p.visible } : p);
  return Promise.resolve();
}; 