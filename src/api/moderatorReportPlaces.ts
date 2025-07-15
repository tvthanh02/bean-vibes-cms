// MOCK DATA
let reportPlaces = [
  { id: 'rp1', placeId: 'pl1', reason: 'Sai thông tin', status: 'pending' },
  { id: 'rp2', placeId: 'pl2', reason: 'Địa điểm trùng lặp', status: 'pending' },
];

export const getReportPlaces = async () => Promise.resolve({ data: Array.isArray(reportPlaces) ? reportPlaces : [] });
export const resolveReportPlace = async (id: string) => {
  reportPlaces = reportPlaces.map(r => r.id === id ? { ...r, status: 'resolved' } : r);
  return Promise.resolve();
}; 